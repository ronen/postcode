/** Freeze a value owned by this boundary. Callers must clone borrowed values first. */
export function freezeOwned<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freezeOwned);
    Object.freeze(value);
  }
  return value;
}
