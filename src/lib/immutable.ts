import { types } from 'node:util';

/** Freeze a value owned by this boundary. Callers must clone borrowed values first. */
export function freezeOwned<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freezeOwned);
    Object.freeze(value);
  }
  return value;
}


const nativeCopy = Symbol('native copy required');

/**
 * A retention boundary's proof of ownership, never a process-wide registry. Only
 * plain graphs copied and deeply frozen here are eligible for subsequent sharing.
 * Captured values carry no reference back to this boundary or its bookkeeping.
 */
export class ImmutableCapture {
  #owned: WeakSet<object> | undefined = new WeakSet();

  /** Release table capacity too, even if a closed owner or its outputs remain reachable. */
  dispose(): void { this.#owned = undefined; }

  capture<T>(value: T): T {
    const owned = this.#owned;
    // Cancellation may finish internal work after disposal. It must not recreate
    // bookkeeping; the application's existing lifetime checks prevent publication.
    if (!owned) return freezeOwned(structuredClone(value));
    const copies = new Map<object, object>();
    const copy = (input: unknown): unknown => {
      if (typeof input === 'function' || typeof input === 'symbol') throw nativeCopy;
      if (input === null || typeof input !== 'object') return input;
      if (owned.has(input)) return input;
      if (copies.has(input)) return copies.get(input);
      if (types.isProxy(input)) throw nativeCopy;
      const prototype = Object.getPrototypeOf(input);
      if (!Array.isArray(input) && prototype !== Object.prototype && prototype !== null) throw nativeCopy;
      const result: object = Array.isArray(input) ? new Array(input.length) : {};
      copies.set(input, result);
      for (const key of Object.keys(input)) {
        const descriptor = Object.getOwnPropertyDescriptor(input, key)!;
        // Do not run getters during a speculative copy. Native cloning handles
        // accessors/exotic objects and their aliasing or errors for the whole graph.
        if (!('value' in descriptor)) throw nativeCopy;
        Object.defineProperty(result, key, { value: copy(descriptor.value), enumerable: true, configurable: true, writable: true });
      }
      return result;
    };
    let result: T;
    try { result = copy(value) as T; }
    catch (error) {
      if (error !== nativeCopy) throw error;
      // These values keep the previous native-copy behavior and never become
      // trusted merely because Object.freeze accepts their outer object.
      return freezeOwned(structuredClone(value));
    }
    for (const object of copies.values()) Object.freeze(object);
    for (const object of copies.values()) owned.add(object);
    return result;
  }
}
