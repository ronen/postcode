/** Best-effort delivery validity. Output remains owned by the client; successful
 * receipt of a value does not establish validity at a later display time. */
export type PublicationOutcome = { readonly status: 'published' }
  | { readonly status: 'withheld' | 'output-failed' | 'failed-after-output'; readonly error: unknown };
export async function guardPublication(check: () => void | Promise<void>, output: () => void | Promise<void>): Promise<PublicationOutcome> {
  try { await check(); } catch (error) { return { status: 'withheld', error }; }
  try { await output(); } catch (error) { return { status: 'output-failed', error }; }
  try { await check(); } catch (error) { return { status: 'failed-after-output', error }; }
  return { status: 'published' };
}
