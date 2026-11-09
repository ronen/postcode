/** A rejected value must never make its own report unserializable. */
export function representationProblem(value: unknown, field: string, ancestors = new Set<object>()): { field: string; reason: string } | null {
  if (value === null || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' && Number.isFinite(value)) return null;
  if (typeof value === 'number') return { field, reason: 'Non-finite numbers cannot be represented as JSON request data.' };
  if (typeof value !== 'object') return { field, reason: `A ${typeof value} value cannot be represented as JSON request data.` };
  if (ancestors.has(value)) return { field, reason: 'A cyclic value cannot be represented as JSON request data.' };
  if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
    return { field, reason: 'Only plain objects and arrays can be represented as structured request data.' };
  }
  if (Array.isArray(value) && (Object.keys(value).length !== value.length || Object.keys(value).some((key, index) => key !== String(index)))) return { field, reason: 'Sparse arrays or array properties cannot be preserved as JSON request data.' };
  ancestors.add(value);
  try {
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key === 'symbol') return { field, reason: 'Symbol keys cannot be represented as JSON request data.' };
      if (Array.isArray(value) && key === 'length') continue;
      const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
      if (!descriptor.enumerable) return { field: `${field}.${key}`, reason: 'Non-enumerable properties cannot be preserved as JSON request data.' };
      if (!('value' in descriptor)) return { field: `${field}.${key}`, reason: 'Accessor properties cannot be captured as request data without executing caller code.' };
      const problem = representationProblem(descriptor.value, `${field}.${key}`, ancestors);
      if (problem) return problem;
    }
    return null;
  } finally { ancestors.delete(value); }
}

