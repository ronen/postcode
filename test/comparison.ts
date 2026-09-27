import assert from 'node:assert/strict';
/** Comparison policy for unchanged methods: only the producing namespace varies.
 * Digests, foreign references, compact IDs, literal evidence and array order do not.
 * This is deliberately not a general string-redaction or graph-isomorphism helper.
 */
const namespace = /^session:[a-f0-9-]{36}(?=:|$)/;
const references = new Set([
  'id', 'session', 'claim', 'subject', 'context', 'inputs', 'retryBasis', 'scope', 'evidence', 'basis',
  'modules', 'contexts', 'claims', 'evaluations', 'evaluation', 'moduleEvaluation',
  'dependencyEvaluation', 'organizationEvaluation', 'repository', 'projection', 'moduleProjection',
  'module', 'symbol', 'origin', 'via', 'assertion', 'target', 'owner', 'parent', 'child',
  'groups', 'candidates', 'artifacts', 'containment', 'placements', 'occurrence', 'occurrences',
  'relationships', 'members', 'internalRelationships', 'coverage', 'nonEdgeRequests',
  'subjects', 'opaqueSubjects', 'projectModules', 'source', 'commonAncestors', 'entries', 'values', 'targetEvidence', 'moduleClaims', 'moduleEvaluations',
]);

function producingSession(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    // Bare reference collections are an explicitly supported comparison input.
    for (const item of value) {
      const found = typeof item === 'string' ? item.match(namespace)?.[0] : producingSession(item);
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

export function normalizeSession<T>(value: T): T {
  if (typeof value === 'string') return normalizeRendered(value) as T;
  const serializable = JSON.parse(JSON.stringify(value, (_key, item: unknown) =>
    item instanceof Map ? { entries: [...item] } : item instanceof Set ? { values: [...item] } : item)) as unknown;
  const session = producingSession(serializable);
  const reference = (item: string) => session && (item === session || item.startsWith(`${session}:`))
    ? `session:normalized${item.slice(session.length)}` : item;
  function visit(item: unknown, field: string): unknown {
    if (typeof item === 'string') {
      if (['rendered', 'stdout'].includes(field)) return normalizeRendered(item, session);
      return references.has(field) || field === '$references' ? reference(item) : item;
    }
    if (Array.isArray(item)) return item.map(child => visit(child, field));
    if (item && typeof item === 'object') {
      const object = item as Record<string, unknown>;
      return Object.fromEntries(Object.entries(object).map(([key, child]) => [key,
        // Captured input values are opaque evidence, including arbitrary field names.
        (object.kind === 'analysis-inputs' && key === 'value') || ['capture', 'layout', 'artifact', 'link', 'links', 'location', 'dependencyResolution'].includes(key) ? child
          : object.kind === 'rendered-output' && key === 'value' && typeof child === 'string' ? normalizeRendered(child, session) : visit(child, key)]));
    }
    return item;
  }
  return visit(serializable, '$references') as T;
}

function normalizeRendered(text: string, session?: string): string {
  // JSON rendering is compared structurally; whitespace is retained by replacing
  // only JSON string tokens at the corresponding reference positions.
  if (text.trimStart().startsWith('{')) {
    const parsed: unknown = JSON.parse(text);
    if (session) assert.equal(producingSession(parsed), session, 'Rendered JSON must use the producing session');
    assert.equal(text, JSON.stringify(parsed, null, 2) + (text.endsWith('\n') ? '\n' : ''), 'Rendered JSON layout');
    const normalized = normalizeSession(parsed);
    // Production JSON output has one documented pretty-print layout.
    return JSON.stringify(normalized, null, 2) + (text.endsWith('\n') ? '\n' : '');
  }
  // Unicode prints the namespace only in its unindented session heading. Literal
  // evidence in labels/documentation is never substituted, even if it resembles it.
  return text.replace(/^Session ([a-f0-9-]{36})$/m, (heading, uuid: string) =>
    !session || session === `session:${uuid}` ? 'Session normalized' : heading);
}
