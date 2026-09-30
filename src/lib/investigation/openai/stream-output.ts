/** Completed item events may carry the output while the terminal envelope is empty.
 * Items remain provisional until the caller receives response.completed. Deltas
 * alone never supply executable tool arguments. */
export class CompletedStreamOutput {
  private responseId: string | undefined;
  private valid = true;
  private readonly added = new Map<number, Record<string, unknown>>();
  private readonly done = new Map<number, Record<string, unknown>>();

  observe(event: Record<string, unknown>): void {
    if (event.type === 'response.created') {
      const response = event.response;
      if (this.responseId || !response || typeof response !== 'object' || !('id' in response) || typeof response.id !== 'string') this.valid = false;
      else this.responseId = response.id;
    }
    if ('response_id' in event && event.response_id !== this.responseId) this.valid = false;
    if (event.type !== 'response.output_item.added' && event.type !== 'response.output_item.done') return;
    const index = event.output_index, item = event.item;
    if (typeof index !== 'number' || !Number.isSafeInteger(index) || index < 0 || !item || typeof item !== 'object' || Array.isArray(item)) { this.valid = false; return; }
    const value = item as Record<string, unknown>;
    if (event.type === 'response.output_item.added') {
      if (index !== this.added.size || this.added.has(index)) this.valid = false;
      else this.added.set(index, value);
    } else {
      const initial = this.added.get(index);
      if (!initial || this.done.has(index) || ['type', 'id', 'call_id', 'name', 'namespace'].some(key => initial[key] !== value[key])) this.valid = false;
      else this.done.set(index, value);
    }
  }

  /** Null denotes missing/inconsistent completed output, not an empty success. */
  complete(response: Record<string, unknown>): unknown[] | null {
    if (!this.valid || !this.responseId || response.id !== this.responseId || !this.added.size || this.added.size !== this.done.size) return null;
    return [...this.added.keys()].map(index => this.done.get(index)!);
  }
}
