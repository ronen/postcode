import assert from 'node:assert/strict';
import { test } from 'node:test';
import { InvestigatorReferences } from '../src/lib/investigation/openai/references.js';
import type { AgentInput } from '../src/lib/investigation/contracts.js';

const input = (responses: unknown[] = []): AgentInput => ({ attempt: 'attempt', instructions: 'literal instructions',
  request: { operation: 'functionality', subject: 'module:canonical', parameters: {} }, responses,
  remaining: { milliseconds: 1000, calls: 2, toolCalls: 4 } }) as unknown as AgentInput;
const response = (records: unknown[]) => ({ status: 'available', records, selected: [], limitations: [] });
const context = { id: 'record:canonical', session: 'session:canonical', method: 'method:literal' };

test('reference traversal preserves literal source, assertions, names, opaque values and qualifications', () => {
  const refs = new InvestigatorReferences();
  const literal = 'module:canonical';
  const original = input([response([
    { ...context, kind: 'captured-content', subject: literal, inputs: 'inputs', mapping: 'mapping', text: literal, path: literal },
    { ...context, kind: 'recorded-assertion', context: 'context', text: literal, tags: [{ name: literal, text: literal }] },
    { ...context, kind: 'analysis-inputs', value: { subject: literal, id: literal } },
    { ...context, kind: 'source-evidence', path: literal, location: { excerpt: { text: literal } }, resolution: { target: literal, writtenSpecifier: literal } },
    { ...context, kind: 'claim-context', inputs: 'inputs', scope: 'configured-project', evidence: ['source'], guarantee: literal, limitations: [literal] },
    { ...context, kind: 'claim', subject: literal, context: 'context', information: { type: 'module', name: literal, handle: literal } },
  ])]);
  const before = structuredClone(original);
  const wire = refs.encode(original) as any;
  const records = wire.responses[0].records;
  const handle = wire.request.subject;
  assert.match(handle, /^r[A-Za-z0-9_-]{11}\.1$/);
  assert.equal(records[0].subject, handle); assert.equal(records[0].text, literal); assert.equal(records[0].path, literal);
  assert.equal(records[1].text, literal); assert.deepEqual(records[1].tags, [{ name: literal, text: literal }]);
  assert.deepEqual(records[2].value, { subject: literal, id: literal });
  assert.equal(records[3].resolution.target, handle); assert.equal(records[3].resolution.writtenSpecifier, literal);
  assert.equal(records[3].location.excerpt.text, literal);
  assert.equal(records[4].scope, 'configured-project'); assert.equal(records[4].guarantee, literal);
  assert.equal(records[5].information.name, literal); assert.equal(records[5].information.handle, literal);
  assert.deepEqual(original, before);
  assert.equal((refs.encode(original) as any).request.subject, handle);
  assert.equal(refs.audit().bindings.filter(b => b.reference === literal).length, 1);
});

test('nested dependency placements, exports, summaries, cursors and omitted references are mapped structurally', () => {
  const refs = new InvestigatorReferences();
  const r = 'module:canonical';
  const endpoint = { groups: [r], candidates: [r], artifacts: [r], evidence: [r], claims: [r], reasons: [r] };
  const encoded = refs.encode(input([{ ...response([
    { ...context, kind: 'claim', subject: r, context: r, information: { type: 'dependency-organization', evaluation: r,
      occurrences: [{ occurrence: r, source: endpoint, target: endpoint, pairs: [{ source: r, target: r, commonAncestors: [r], containment: [r] }] }] } },
    { ...context, kind: 'claim', subject: r, context: r, information: { type: 'export', symbol: r, origin: null, exportedName: r, routes: [{ via: r, kind: 'alias' }] } },
    { ...context, kind: 'dependency-projection', evaluation: r, subjects: [r], graph: { roots: [0], components: [{ members: [r], internalRelationships: [r], children: [1] }] }, expansions: { organization: r, moduleEvaluations: [r], moduleClaims: [r] } },
  ]), evaluations: [{ ...context, basis: r, qualification: [{ ...context, inputs: r, scope: r, guarantee: r }] }],
  supportReferences: [{ id: 'bare-source', kind: 'source-evidence', method: r }], page: { next: 'cursor', omitted: [{ id: r, reason: r }] } }])) as any;
  const h = encoded.request.subject, output = encoded.responses[0];
  const occurrence = output.records[0].information.occurrences[0];
  assert.deepEqual(occurrence.source, { groups: [h], candidates: [h], artifacts: [h], evidence: [h], claims: [h], reasons: [r] });
  assert.deepEqual(occurrence.target, occurrence.source);
  assert.deepEqual(occurrence.pairs, [{ source: h, target: h, commonAncestors: [h], containment: [h] }]);
  assert.equal(output.records[1].information.symbol, h); assert.equal(output.records[1].information.origin, null);
  assert.equal(output.records[1].information.routes[0].via, h); assert.equal(output.records[1].information.exportedName, r);
  assert.deepEqual(output.records[2].graph.components, [{ members: [h], internalRelationships: [h], children: [1] }]);
  const qualification = output.evaluations[0].qualification[0];
  assert.equal(qualification.inputs, h); assert.equal(qualification.scope, h); assert.equal(qualification.guarantee, r);
  assert.equal(output.page.omitted[0].id, h); assert.equal(output.page.omitted[0].reason, r);
  assert.deepEqual(refs.tools({ requests: [{ kind: 'inspect', subject: h, cursor: output.page.next }] }), { requests: [{ kind: 'inspect', subject: r, cursor: 'cursor' }] });
  assert.ok(refs.audit().bindings.some(b => b.reference === 'bare-source'));
  assert.equal(output.records.some((record: any) => record.id === output.supportReferences[0].id), false);
});

test('nested submissions and prior context decode only designated references, with auditable exact resolutions', () => {
  const refs = new InvestigatorReferences();
  const r = 'module:canonical';
  const provenance = { ...context, request: { subject: r }, originatingModule: r, citations: [r], suppliedEvidence: [r], summarizedEvidence: [r], completeTargets: [r], completeCorrections: [r], instructions: r };
  const wire = refs.encode(input([{ requested: r, accounts: [{ id: r, prose: r, referent: { description: r, subjects: [r] }, evidence: [r],
    children: [r], corrections: [r], provenance, revisionNotices: [{ id: r, target: r, replacement: r }] }], corrections: [{ ...context, target: r, correctedSubjects: [r], replacement: r, reporter: r, provenance: r, evidence: [r], reason: r }], omittedAccounts: [r], omittedCorrections: [r] }])) as any;
  const h = wire.request.subject;
  assert.equal(wire.responses[0].accounts[0].provenance.request.subject, h);
  assert.equal(wire.responses[0].accounts[0].provenance.instructions, r);
  assert.deepEqual(wire.responses[0].accounts[0].revisionNotices, [{ id: h, target: h, replacement: h }]);
  assert.deepEqual(wire.responses[0].corrections[0].correctedSubjects, [h]);
  const account = { localId: h, prose: h, qualifications: [h], evidence: [h], referent: { description: h, subjects: [h] }, associations: [{ subject: h, evidence: [h], qualifications: [h] }], inconsistencies: [{ targets: [h], evidence: [h], reason: h }], children: [], corrections: [] };
  const draft = { ...account, children: [account], corrections: [{ target: h, correctedSubjects: [h], evidence: [h], reason: h, replacement: account }] };
  const decoded = refs.submission(draft) as any;
  for (const item of [decoded, decoded.children[0], decoded.corrections[0].replacement]) {
    assert.equal(item.prose, h); assert.equal(item.localId, h); assert.deepEqual(item.qualifications, [h]);
    assert.deepEqual(item.evidence, [r]); assert.deepEqual(item.referent, { description: h, subjects: [r] });
    assert.equal(item.associations[0].subject, r); assert.deepEqual(item.inconsistencies[0].targets, [r]);
  }
  assert.deepEqual(decoded.corrections[0].correctedSubjects, [r]); assert.equal(decoded.corrections[0].target, r);
  assert.ok(refs.audit().resolutions.some(item => item.path === '$.corrections[0].replacement.referent.subjects[0]' && item.reference === r));
  assert.equal(draft.children[0]!.evidence[0], h);
});

test('unknown, canonical and foreign spellings fail closed; audit snapshots and namespaces remain independent', () => {
  const refs = new InvestigatorReferences(), other = new InvestigatorReferences();
  const h = (refs.encode(input()) as any).request.subject;
  const foreign = (other.encode(input()) as any).request.subject;
  const snapshot = refs.audit();
  for (const invalid of ['module:canonical', `${h}x`, foreign, 'x'.repeat(1000)]) {
    const decoded = refs.tools({ requests: [{ kind: 'source', subject: invalid, prose: h }] }) as any;
    assert.equal(decoded.requests[0].subject, `invalid-investigator-reference:${invalid}`);
    assert.equal(decoded.requests[0].prose, h);
    assert.equal(refs.audit().resolutions.at(-1)!.reference, null);
  }
  assert.equal(snapshot.resolutions.length, 0);
  refs.encode(input()); assert.equal(refs.audit().resolutions.length, 0);
  refs.close(); assert.throws(() => refs.encode(input()), /closed/); assert.throws(() => refs.tools({}), /closed/);
  assert.throws(() => refs.audit(), /closed/);
  assert.deepEqual(other.tools({ requests: [{ kind: 'source', subject: h }] }), { requests: [{ kind: 'source', subject: `invalid-investigator-reference:${h}` }] });
});
