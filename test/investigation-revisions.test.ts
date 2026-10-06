import { revisionPage } from '../src/lib/investigation/revision-page.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { InvestigationRevisions } from '../src/lib/investigation/revisions.js';
import type { Investigram, Correction, InvestigationProvenance } from '../src/lib/investigation/contracts.js';
import type { RecordId, SessionId } from '../src/lib/records.js';

const id = (value: string) => value as RecordId;
const session = 'revision-fixture' as SessionId;
function fixture() {
  const accounts: Investigram[] = [], corrections: Correction[] = [], origins: InvestigationProvenance[] = [];
  const account = (name: string, citations: string[] = [], complete: string[] = [], originName = name) => {
    const origin = { id: id(`p-${originName}`), kind: 'investigation-provenance' as const, session, method: 'test',
      request: { operation: 'clarification' as const, subject: id('module'), parameters: {} }, originatingModule: id('module'),
      instructions: 'test', agent: { provider: 'test', model: 'test', origin: 'scripted' as const, configuration: {} },
      citations: citations.map(id), completeTargets: [], completeCorrections: complete.map(id), suppliedEvidence: [], summarizedEvidence: [], deliveries: [] };
    if (!origins.some(item => item.id === origin.id)) origins.push(origin);
    accounts.push({ id: id(name), session, method: 'test', kind: 'investigram', status: 'interpretation', prose: name,
      referent: { description: name, subjects: [] }, originatingModule: id('module'), associations: [], qualifications: [],
      evidence: [], children: [], corrections: [], inconsistencies: [], provenance: origin.id });
  };
  const correction = (name: string, target: string, replacement: string, producer = replacement) => {
    corrections.push({ id: id(name), kind: 'investigram-correction', session, method: 'test', reporter: id(producer), target: id(target),
      replacement: id(replacement), correctedSubjects: [id('module')], reason: name, qualifications: [], evidence: [], provenance: id(`p-${producer}`) });
  };
  return { accounts, corrections, origins, account, correction, snapshot: () => new InvestigationRevisions(accounts, corrections, origins) };
}

test('primary selection searches all branches; later descendants win without erasing conflict or earlier snapshots', () => {
  const f = fixture();
  for (const name of ['A', 'B', 'C', 'D']) f.account(name);
  f.correction('AB', 'A', 'B'); f.correction('AC', 'A', 'C');
  const earlier = f.snapshot().snapshot(id('A'));
  assert.equal(earlier.primary, 'C'); assert.equal(earlier.conflicting, true);
  f.correction('BD', 'B', 'D');
  const status = f.snapshot().snapshot(id('A'));
  assert.equal(status.primary, 'D'); assert.equal(status.conflicting, true);
  assert.deepEqual(status.rows.map(item => item.correction), ['AB', 'AC', 'BD']);
  assert.equal(earlier.primary, 'C');
  assert.equal(f.snapshot().snapshot(id('C')).familyPrimary, 'D');
  assert.equal(f.snapshot().snapshot(id('C')).primary, 'C', 'precise C selection follows only its own descendants');
});

test('per-cause propagation stops at whole-evaluation exemptions and retains independent and alternate paths', () => {
  const f = fixture();
  f.account('A'); f.account('Y', ['A']); f.account('Z', ['Y']);
  f.account('B', ['A', 'Y']); f.account('reporter-child', [], [], 'B'); f.account('other-replacement', [], [], 'B');
  f.correction('AB', 'A', 'B');
  f.account('aware', ['Y'], ['AB']); f.account('aware-child', [], [], 'aware');
  f.account('through-aware', ['aware']); f.account('alternate', ['aware', 'Z']);
  f.account('partial', ['A']); f.account('provenance-only');
  let graph = f.snapshot();
  for (const name of ['Y', 'Z', 'alternate', 'partial']) assert.equal(graph.snapshot(id(name)).needsReconsideration, true, name);
  for (const name of ['B', 'reporter-child', 'other-replacement', 'aware', 'aware-child', 'through-aware', 'provenance-only']) assert.equal(graph.snapshot(id(name)).needsReconsideration, false, name);
  assert.equal(graph.snapshot(id('Y')).rows[0]!.cause!.direct, true);
  assert.equal(graph.snapshot(id('Z')).rows[0]!.cause!.direct, false);
  assert.deepEqual(graph.snapshot(id('alternate')).rows[0]!.cause!.via, ['Z']);
  f.account('C', ['A']); f.correction('AC', 'A', 'C'); graph = f.snapshot();
  assert.equal(graph.snapshot(id('aware')).causeCount, 1, 'earlier completeness cannot exempt an unseen correction');
  assert.equal(graph.snapshot(id('B')).causeCount, 1, 'producing one cause does not exempt another');
  assert.equal(graph.snapshot(id('Y')).causeCount, 2);
  assert.equal(f.origins.find(item => item.id === 'p-B')!.citations.includes(id('A')), true);
});

test('dense citation graphs and many causes remain bounded without enumerating paths; all pages are accessible', () => {
  const f = fixture(); f.account('A');
  for (let n = 0; n < 80; n++) f.account(`N${n}`, ['A', ...Array.from({ length: n }, (_, i) => `N${i}`)]);
  for (let n = 0; n < 55; n++) { f.account(`R${n}`, ['A']); f.correction(`C${n}`, 'A', `R${n}`); }
  const graph = f.snapshot(), full = graph.snapshot(id('N79')), first = revisionPage(full);
  assert.equal(full.rows.length, 55); assert.equal(full.rows[0]!.cause!.via.length, 80);
  assert.ok(Object.isFrozen(full.rows[0]!.cause!.via));
  assert.equal(first.causeCount, 55); assert.equal(first.rows.length, 24); assert.equal(first.nextPage, 2);
  assert.equal(first.rows[0]!.cause!.via.length, 8); assert.equal(first.rows[0]!.cause!.omittedVia, 72);
  const all = [first, revisionPage(full, 2), revisionPage(full, 3)].flatMap(page => page.rows);
  assert.equal(all.length, 55); assert.equal(new Set(all.map(row => row.correction)).size, 55);
  assert.equal(revisionPage(full, 3).nextPage, null);
  assert.ok(JSON.stringify(first).length < 9000);
});

test('context pages preserve exact originals and distinguish reference availability, incomplete exposure and full correction context', async () => {
  const { InvestigationContext } = await import('../src/lib/investigation/context.js');
  const { InvestigatorReferences } = await import('../src/lib/investigation/openai/references.js');
  const f = fixture(); f.account('A'); f.account('Y', ['A']);
  for (let n = 0; n < 28; n++) { f.account(`R${n}`, ['A']); f.correction(`C${n}`, 'A', `R${n}`); }
  const graph = f.snapshot();
  const history = { get: (id: RecordId) => graph.accounts.get(id), provenance: (id: RecordId) => f.origins.find(item => item.id === id),
    correction: (id: RecordId) => f.corrections.find(item => item.id === id), corrections: (id: RecordId) => f.corrections.filter(item => item.target === id),
    revision: (id: RecordId, page?: number) => revisionPage(graph.snapshot(id), page) };
  const context = new InvestigationContext(history, session);
  const partial = context.prepare(id('Y'), ['prose'], 0, { accounts: 1, characters: 60_000 });
  assert.equal(partial.accounts[0]!.id, 'Y');
  assert.equal(partial.accounts[0]!.revision!.rows.length, 24);
  assert.ok(partial.omittedAccounts.length > 0);
  context.supplied(partial);
  assert.ok(!context.citations.includes(id('Y')), 'zero-length prose and revision references alone do not cite Y');
  assert.ok(!context.citations.includes(id('A')), 'correction target reference is not content');
  assert.equal(context.completeCorrections.length, 0);
  const second = context.prepare(id('Y'), undefined, undefined, undefined, 2);
  assert.equal(second.accounts[0]!.revision!.rows.length, 4);
  assert.equal(second.accounts[0]!.revision!.nextPage, null);
  context.supplied(second);
  assert.ok(context.citations.includes(id('Y')));
  assert.ok(context.completeCorrections.includes(id('C27')));
  const transport = new InvestigatorReferences();
  const encoded = transport.encode({ attempt: id('attempt'), instructions: 'test', request: { operation: 'clarification', subject: id('Y'), parameters: {} },
    responses: [second], remaining: { milliseconds: 1000, calls: 1, toolCalls: 1 } });
  const encodedAccount = (encoded.responses as any)[0].accounts[0];
  assert.notEqual(encodedAccount.revision.original, 'Y');
  assert.equal(encodedAccount.prose, 'Y', 'prose stays untouched');
  assert.deepEqual(transport.tools({ requests: [{ kind: 'investigram', subject: encodedAccount.id, revisionPage: 2 }] }), { requests: [{ kind: 'investigram', subject: 'Y', revisionPage: 2 }] });
});

test('incoming inconsistencies preserve qualification and count as reporter exposure only when actually delivered', async () => {
  const { InvestigationContext } = await import('../src/lib/investigation/context.js');
  const f = fixture(); f.account('A'); f.account('reporter');
  f.accounts[1] = { ...f.accounts[1]!, inconsistencies: [{ targets: [id('A')], reason: 'A qualified disagreement.', qualifications: ['Static interpretation only.'], evidence: [] }] };
  const graph = f.snapshot();
  const context = new InvestigationContext({ get: id => graph.accounts.get(id), provenance: id => f.origins.find(item => item.id === id),
    correction: () => undefined, corrections: () => [], revision: (id, page) => revisionPage(graph.snapshot(id), page) }, session);
  const omitted = context.prepare(id('A'), [], undefined, { accounts: 1, characters: 0 });
  assert.deepEqual(omitted.accounts[0]!.revision!.omittedInconsistencyReporters, ['reporter']);
  context.supplied(omitted); assert.equal(context.citations.length, 0);
  const supplied = context.prepare(id('A'), []);
  assert.deepEqual(supplied.accounts[0]!.revision!.inconsistencies[0]!.qualifications, ['Static interpretation only.']);
  context.supplied(supplied); assert.deepEqual(context.citations, ['reporter']);
  assert.equal(context.completeTargets.length, 0);
});

test('automatic context summarizes all incoming inconsistencies honestly and follows the primary branch', async () => {
  const { InvestigationContext } = await import('../src/lib/investigation/context.js');
  const f = fixture();
  for (const name of ['A', 'B', 'C', 'D', 'Y']) f.account(name, name === 'Y' ? ['A'] : []);
  f.correction('AB', 'A', 'B'); f.correction('AC', 'A', 'C'); f.correction('CD', 'C', 'D');
  for (let n = 0; n < 30; n++) {
    f.account(`reporter-${n}`);
    f.accounts[f.accounts.length - 1] = { ...f.accounts.at(-1)!, inconsistencies: [{ targets: [id('A')], reason: `Disagreement ${n}`, qualifications: ['Test.'], evidence: [] }] };
  }
  const graph = f.snapshot();
  const history = { get: (id: RecordId) => graph.accounts.get(id), provenance: (id: RecordId) => f.origins.find(item => item.id === id),
    correction: (id: RecordId) => f.corrections.find(item => item.id === id), corrections: (id: RecordId) => f.corrections.filter(item => item.target === id),
    revision: (id: RecordId, page?: number) => revisionPage(graph.snapshot(id), page) };
  // Starting at B automatically includes A via family context. A's small
  // relationship summary must point through C to D, not the oldest A-to-B branch.
  const context = new InvestigationContext(history, session);
  const delivered = context.prepare(id('B'));
  const a = delivered.accounts.find(item => item.id === 'A')!;
  assert.deepEqual(a.corrections, ['AC']);
  assert.match(a.omissions.join(' '), /30 incoming inconsistencies omitted by automatic-account summary policy/);
  assert.doesNotMatch(a.omissions.join(' '), /Incoming inconsistency content omitted by character bound/);
  assert.equal(a.revision!.nextPage, 1);
  assert.deepEqual(a.revision!.omittedInconsistencyReporters, []);
  context.supplied(delivered);
  assert.ok(!context.citations.some(value => value.startsWith('reporter-')));
  const first = context.prepare(id('A')), second = context.prepare(id('A'), undefined, undefined, undefined, 2);
  assert.equal(first.accounts[0]!.revision!.inconsistencies.length, 24);
  assert.equal(second.accounts[0]!.revision!.inconsistencies.length, 6);
  assert.equal(second.accounts[0]!.revision!.nextPage, null);
  context.supplied(first); context.supplied(second);
  assert.equal(context.citations.filter(value => value.startsWith('reporter-')).length, 30);
});
