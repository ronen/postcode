/** Comparison policy for unchanged methods: only the producing namespace varies.
 * Digests, foreign references, literal evidence and array order do not.
 * This is deliberately not a general string-redaction or graph-isomorphism helper.
 */
const namespace = /^session:[a-f0-9-]{36}(?=:|$)/;
const references = new Set([
  'mechanical', 'id', 'session', 'claim', 'subject', 'context', 'inputs', 'retryBasis', 'scope', 'evidence', 'basis',
  'modules', 'contexts', 'claims', 'evaluations', 'evaluation', 'moduleEvaluation',
  'dependencyEvaluation', 'organizationEvaluation', 'repository', 'projection', 'moduleProjection',
  'module', 'symbol', 'origin', 'via', 'assertion', 'target', 'owner', 'parent', 'child',
  'groups', 'candidates', 'artifacts', 'containment', 'placements', 'occurrence', 'occurrences',
  'relationships', 'members', 'internalRelationships', 'coverage', 'nonEdgeRequests',
  // Common contribution identities and the investigram part of content, association and declaration addresses.
  'entity', 'investigram', 'production', 'record', 'referents', 'references', 'invocation', 'result', 'answer',
  'population', 'prerequisites', 'outsidePopulation', 'subjects', 'opaqueSubjects', 'projectModules', 'source', 'commonAncestors', 'entries', 'values', 'targetEvidence', 'moduleClaims', 'moduleEvaluations',
]);

function producingSession(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = producingSession(item);
      if (found) return found;
    }
  } else if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>;
    if (typeof object.session === 'string' && namespace.test(object.session)) return object.session;
    if (object.projection) return producingSession(object.projection);
    for (const [key, item] of Object.entries(object)) {
      if (key === 'value' || key === 'information') continue;
      const found = producingSession(item);
      if (found) return found;
    }
  }
  return undefined;
}

export function normalizeSession<T>(value: T, declaredSession?: string): T {
  if (typeof value === 'string') return value;
  const serializable = JSON.parse(JSON.stringify(value, (_key, item: unknown) =>
    item instanceof Map ? { entries: [...item] } : item instanceof Set ? { values: [...item] } : item)) as unknown;
  const session = declaredSession ?? producingSession(serializable);
  if (!session && Array.isArray(serializable) && serializable.some(item => typeof item === 'string' && namespace.test(item))) {
    throw new Error('Bare references require the producing session');
  }
  const reference = (item: string) => session && (item === session || item.startsWith(`${session}:`))
    ? `session:normalized${item.slice(session.length)}` : item;
  function visit(item: unknown, field: string): unknown {
    if (typeof item === 'string') {
      return references.has(field) || field === '$references' ? reference(item) : item;
    }
    if (Array.isArray(item)) return item.map(child => visit(child, field));
    if (item && typeof item === 'object') {
      const object = item as Record<string, unknown>;
      return Object.fromEntries(Object.entries(object).map(([key, child]) => [key,
        // Captured input values are opaque evidence, including arbitrary field names.
        (object.kind === 'analysis-inputs' && key === 'value') || ['capture', 'layout', 'artifact', 'link', 'links', 'location', 'dependencyResolution'].includes(key) ? child
          : object.kind === 'module-exports-projection' && ['exports', 'documentation'].includes(key) ? visit(child, '$references')
          : field === 'module-exports-body' && key === 'exports' ? visit(child, '$references')
          : object.type === 'module-exports' && key === 'body' ? visit(child, 'module-exports-body')
          : field === 'designation' && object.kind === 'reference' && key === 'value' && typeof child === 'string' ? reference(child)
          : visit(child, key)]));
    }
    return item;
  }
  return visit(serializable, '$references') as T;
}
