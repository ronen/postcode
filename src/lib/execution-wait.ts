/** Wait cooperatively without leaving a rejection or late result unobserved. */
export async function untilAborted<T>(action: () => Promise<T>, signal: AbortSignal): Promise<T> {
  signal.throwIfAborted();
  let abort!: () => void;
  const stopped = new Promise<never>((_resolve, reject) => {
    abort = () => reject(signal.reason);
    signal.addEventListener('abort', abort, { once: true });
  });
  try { return await Promise.race([Promise.resolve().then(() => { signal.throwIfAborted(); return action(); }), stopped]); }
  finally { signal.removeEventListener('abort', abort); }
}
