import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TestContext } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { temporaryDirectory } from './cli-helpers.js';
import { ScriptedInvestigator } from './investigator-double.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import type { ModuleAnalysis } from '../src/lib/evaluation.js';
import { evidenceAccess } from '../src/lib/evidence-access.js';
import type { EvidenceQuery, EvidenceResponse } from '../src/lib/evidence-access.js';
import { evidencePageCharacters } from '../src/lib/evidence-delivery.js';
import { investigate, evidenceResponseCharacters } from '../src/lib/investigation/execute.js';
import { InvestigationUsage } from '../src/lib/investigation/usage.js';
import type { AgentInput, AgentReply } from '../src/lib/investigation/contracts.js';
import type { RecordId } from '../src/lib/records.js';

async function fixture(t: TestContext, unrelated: number, hugeDocumentation = false, wideSupport = false, ancestorDocumentation = 0) {
  const root = temporaryDirectory(t, 'postcode-evidence-');
  execFileSync('git', ['init', '--quiet', root]);
  mkdirSync(path.join(root, 'feature'));
  mkdirSync(path.join(root, 'unrelated'));
  writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { noLib: true, types: [], module: 'nodenext' }, include: ['**/*.ts'] }));
  writeFileSync(path.join(root, 'feature/entry.ts'), "import { middle } from './middle.js'; import './missing.js'; export const entry = () => middle();");
  writeFileSync(path.join(root, 'feature/middle.ts'), "import { leaf } from './leaf.js'; export const middle = () => leaf();");
  writeFileSync(path.join(root, 'feature/leaf.ts'), `${hugeDocumentation ? `/** ${'Explanation. '.repeat(7000)} */` : '/** Completes work. */'}\nexport const leaf = () => 1;\nexport const extra = 2;`);
  writeFileSync(path.join(root, 'feature/README.md'), 'This feature delegates entry to middle to leaf.');
  for (let index = 0; index < unrelated; index++) writeFileSync(path.join(root, `unrelated/item${index}${wideSupport ? '.d' : ''}.ts`),
    wideSupport ? `declare module 'wide' { export const item${index}: number; }` : `export const item${index} = ${index};`);
  for (let index = 0; index < ancestorDocumentation; index++) writeFileSync(path.join(root, `README.${index}.md`), 'Repository intent assertion.');
  if (ancestorDocumentation) writeFileSync(path.join(root, 'unrelated/README.md'), 'Sibling documentation must not be selected.');
  const opened = await openTypeScriptProject({ configPath: path.join(root, 'tsconfig.json') });
  if (opened.status !== 'opened') throw new Error('Expected fixture');
  const store = new MemoryProgramRecordStore();
  const evaluation = evaluateModules(store, opened.analysis);
  const module = (handle: string) => evaluation.modules.find(id => {
    const item = store.get(id);
    assert.ok(item.kind === 'module');
    const claim = store.get(item.claim);
    return claim.kind === 'claim' && claim.information.type === 'module' && claim.information.handle === handle;
  })!;
  return { root, opened, store, evaluation, module, evidence: evidenceAccess(store, opened.analysis, opened.session) };
}
function checkQualified(response: EvidenceResponse, store: MemoryProgramRecordStore) {
  assert.ok(JSON.stringify(response).length <= evidencePageCharacters);
  assert.ok(response.records.every(item => !['evaluation', 'dependency-evaluation', 'organization-evaluation', 'repository-evidence', 'analysis-inputs'].includes(item.kind)));
  const delivered = new Map(response.records.map(item => [item.id, item]));
  const repositoryIds = new Set([...(response.repositories?.map(item => item.id) ?? []), ...(response.supportReferences?.map(item => item.id) ?? [])]);
  for (const record of response.records) {
    assert.deepEqual(record, store.get(record.id), 'delivery must not rewrite retained claims or qualification');
    if (record.kind === 'claim' || record.kind === 'recorded-assertion') assert.ok(delivered.has(record.context));
    if (record.kind === 'claim-context') for (const id of record.evidence) assert.ok(delivered.has(id) || repositoryIds.has(id), 'own evidence stays attributable');
  }
}
function pages(evidence: ReturnType<typeof evidenceAccess>, query: EvidenceQuery): EvidenceResponse[] {
  const responses: EvidenceResponse[] = [];
  let response = evidence.query(query);
  do {
    responses.push(response);
    assert.ok(responses.length < 100, 'continuations must progress');
    if (!response.page?.next) break;
    response = evidence.query({ ...query, cursor: response.page.next } as EvidenceQuery);
  } while (true);
  return responses;
}

test('subject relationship delivery excludes unrelated project growth and preserves scoped support', async t => {
  const sizes: Record<string, number>[] = [];
  for (const unrelated of [2, 160]) {
    const f = await fixture(t, unrelated);
    const measured: Record<string, number> = {};
    for (const kind of ['dependencies', 'dependents', 'membership', 'exports'] as const) {
      const response = f.evidence.query({ kind, subject: f.module('entry') });
      checkQualified(response, f.store);
      assert.equal(response.page!.next, null);
      assert.equal(response.page!.omitted.length, 0);
      assert.ok(response.records.filter(item => item.kind === 'source-evidence').every(item => !item.path.includes('/unrelated/')));
      assert.ok(response.evaluations!.length > 0);
      measured[kind] = JSON.stringify(response).length;
      if (kind === 'dependencies') {
        assert.equal(response.records.filter(item => item.kind === 'claim' && item.information.type === 'dependency').length, 1);
        assert.ok(response.records.some(item => item.kind === 'dependency-occurrence' && item.targetStatus === 'unresolved'));
      }
    }
    sizes.push(measured);
  }
  for (const kind of Object.keys(sizes[0]!)) assert.ok(sizes[1]![kind]! < sizes[0]![kind]! + 2000, `${kind} grew with unrelated modules`);
});

test('bounded listings expose every module and group artifact with query-bound stable continuations', async t => {
  const f = await fixture(t, 160);
  let discoveries = 0;
  const analysis: ModuleAnalysis = { ...f.opened.analysis, discover: (...args) => { discoveries++; return f.opened.analysis.discover(...args); } };
  const evidence = evidenceAccess(f.store, analysis, f.opened.session);
  const first = evidence.query({ kind: 'modules' });
  assert.equal(first.status, 'partial');
  assert.ok(first.page!.next);
  const calls = discoveries;
  const second = evidence.query({ kind: 'modules', cursor: first.page!.next! });
  assert.equal(discoveries, calls, 'continuation must read the pinned selection without reevaluating');
  assert.deepEqual(evidence.query({ kind: 'modules', cursor: first.page!.next! }), second);
  assert.equal(evidence.query({ kind: 'organization', cursor: first.page!.next! }).status, 'unavailable');
  assert.equal(evidence.query({ kind: 'modules', cursor: 'forged' }).status, 'unavailable');
  assert.equal(f.evidence.query({ kind: 'modules', cursor: first.page!.next! }).status, 'unavailable');
  const listed = pages(evidence, { kind: 'modules' });
  for (const response of listed) checkQualified(response, f.store);
  const ids = listed.flatMap(response => response.selected);
  assert.equal(ids.length, new Set(ids).size);
  assert.deepEqual(new Set(ids), new Set(f.evaluation.modules));
  assert.equal(listed.at(-1)!.page!.end, f.evaluation.modules.length);
  const groups = pages(evidence, { kind: 'organization' });
  const artifacts = new Set<string>();
  for (const listing of groups) {
    checkQualified(listing, f.store);
    for (const group of listing.selected) for (const details of pages(evidence, { kind: 'group', subject: group })) {
      checkQualified(details, f.store);
      for (const record of details.records) if (record.kind === 'repository-artifact') artifacts.add(record.artifact.path);
    }
  }
  assert.ok(artifacts.has('feature/README.md'));
  for (let index = 0; index < 160; index++) assert.ok(artifacts.has(`unrelated/item${index}.ts`));
});

test('scoped summaries preserve incomplete evaluation and separate placement qualification', async t => {
  const f = await fixture(t, 2);
  const analysis: ModuleAnalysis = { ...f.opened.analysis, discover: (...args) => ({ ...f.opened.analysis.discover(...args),
    materialization: 'partial', reason: 'Controlled incomplete module population.' }) };
  const evidence = evidenceAccess(f.store, analysis, f.opened.session);
  const modules = evidence.query({ kind: 'modules' });
  checkQualified(modules, f.store);
  assert.equal(modules.status, 'partial');
  assert.equal(modules.evaluations![0]!.materialization, 'partial');
  assert.equal(modules.evaluations![0]!.reason, 'Controlled incomplete module population.');
  assert.ok(modules.evaluations![0]!.qualification.length);
  const groups = evidence.query({ kind: 'organization' });
  checkQualified(groups, f.store);
  assert.equal(groups.evaluations![0]!.materialization, 'full', 'layout coverage is independent');
  assert.equal(groups.evaluations![0]!.placement!.materialization, 'partial');
  assert.equal(groups.evaluations![0]!.placement!.reason, 'Controlled incomplete module population.');
});

test('an oversized qualified listing item is explicit and does not hide later items', async t => {
  const f = await fixture(t, 2, true);
  const responses = pages(f.evidence, { kind: 'exports', subject: f.module('leaf') });
  for (const response of responses) checkQualified(response, f.store);
  assert.ok(responses.some(response => response.page!.omitted.length > 0));
  assert.ok(responses.filter(response => response.page!.omitted.length).every(response => response.status === 'partial'));
  const claims = responses.flatMap(response => response.records).filter(item => item.kind === 'claim' && item.information.type === 'export');
  assert.ok(claims.some(item => item.kind === 'claim' && item.information.type === 'export' && item.information.exportedName === 'extra'));
  for (const omission of responses.flatMap(response => response.page!.omitted)) assert.ok(!responses.some(response => response.selected.includes(omission.id)));
});

test('realistic dialogue follows delegation and group documentation through bounded tools', async t => {
  const f = await fixture(t, 160);
  let middle: RecordId, leaf: RecordId, group: RecordId, artifact: RecordId;
  const response = (value: unknown): EvidenceResponse => {
    const result = value as EvidenceResponse;
    checkQualified(result, f.store);
    assert.ok(JSON.stringify(result).length < evidenceResponseCharacters);
    assert.notEqual(result.status, 'unavailable');
    return result;
  };
  const agent = new ScriptedInvestigator([
    () => ({ kind: 'tools', requests: [{ kind: 'dependencies', subject: f.module('entry') }, { kind: 'membership', subject: f.module('entry') }, { kind: 'modules' }] }),
    input => {
      const dependency = response(input.responses[0]).records.find(item => item.kind === 'claim' && item.information.type === 'dependency');
      assert.ok(dependency?.kind === 'claim' && dependency.information.type === 'dependency');
      middle = dependency.information.child;
      const placement = response(input.responses[1]).records.find(item => item.kind === 'claim' && item.information.type === 'module-placement');
      assert.ok(placement?.kind === 'claim' && placement.information.type === 'module-placement');
      group = placement.information.groups[0]!;
      const modules = response(input.responses[2]);
      return { kind: 'tools', requests: [{ kind: 'dependencies', subject: middle }, { kind: 'group', subject: group }, { kind: 'modules', cursor: modules.page!.next! }] };
    },
    input => {
      const dependency = response(input.responses[0]).records.find(item => item.kind === 'claim' && item.information.type === 'dependency');
      assert.ok(dependency?.kind === 'claim' && dependency.information.type === 'dependency');
      leaf = dependency.information.child;
      const documentation = response(input.responses[1]).records.find(item => item.kind === 'claim' && item.information.type === 'group-documentation');
      assert.ok(documentation?.kind === 'claim' && documentation.information.type === 'group-documentation');
      artifact = documentation.information.artifact;
      assert.ok(response(input.responses[2]).page!.start > 0);
      return { kind: 'tools', requests: [{ kind: 'source', subject: leaf }, { kind: 'source', subject: artifact }] };
    },
    input => {
      const doc = response(input.responses[1]);
      assert.ok(doc.records.some(item => item.kind === 'captured-content' && item.text.includes('delegates entry')));
      return { kind: 'submit', result: { localId: 'root', prose: 'Entry delegates to middle and leaf.',
        referent: { description: 'The entry feature.', subjects: [f.module('entry')] }, qualifications: ['Source interpretation.'],
        evidence: [...response(input.responses[0]).selected, ...doc.selected], associations: [], children: [], corrections: [], inconsistencies: [] } };
    },
  ]);
  const result = await investigate({ session: f.opened.session, request: { operation: 'functionality', subject: f.module('entry'), parameters: {} },
    evidence: f.evidence, history: { get: () => undefined, provenance: () => undefined, correction: () => undefined, corrections: () => [] },
    agent, usage: new InvestigationUsage(), check: async () => { assert.equal(await f.opened.changed(), false); } });
  assert.equal(result.outcome.kind, 'accepted');
  assert.ok(result.report.summarizedEvidence.some(id => f.store.get(id).kind === 'dependency-evaluation'), 'delivered summary is attributable without claiming full-record delivery');
});


test('missing provider expansions and dependency analysis remain unavailable, not empty complete results', async t => {
  const f = await fixture(t, 2);
  const analysis: ModuleAnalysis = { discover: (...args) => {
    const { expansions: _expansions, dependencies: _dependencies, ...result } = f.opened.analysis.discover(...args);
    return result;
  } };
  const evidence = evidenceAccess(f.store, analysis, f.opened.session);
  for (const kind of ['exports', 'dependencies'] as const) {
    const result = evidence.query({ kind, subject: f.module('entry') });
    checkQualified(result, f.store);
    assert.equal(result.status, 'unavailable');
    assert.equal(result.selected.length, 0);
    assert.match(result.limitations.join(' '), /did not supply/);
  }
});


test('a merged module with extensive own support stays selectable through explicit inspect references', async t => {
  const f = await fixture(t, 150, false, true);
  const responses = pages(f.evidence, { kind: 'modules' });
  const wide = f.module('wide');
  assert.ok(wide);
  const delivered = responses.find(response => response.selected.includes(wide))!;
  assert.ok(delivered);
  checkQualified(delivered, f.store);
  assert.equal(delivered.status, 'partial');
  assert.equal(delivered.page!.omitted.length, 0);
  assert.ok(delivered.supportReferences!.length >= 150);
  assert.ok(delivered.records.some(item => item.kind === 'claim-context' && item.evidence.length >= 150));
  assert.ok(delivered.records.every(item => item.kind !== 'source-evidence'));
  assert.deepEqual(new Set(responses.flatMap(response => response.selected)), new Set(f.evaluation.modules));
  for (const reference of delivered.supportReferences!) {
    const inspected = f.evidence.query({ kind: 'inspect', subject: reference.id });
    assert.equal(inspected.status, 'available');
    assert.ok(inspected.records.some(item => item.id === reference.id));
  }
  let withheld: RecordId | undefined;
  const next = (input: AgentInput): AgentReply => {
    const response = input.responses[0] as EvidenceResponse;
    if (!response.supportReferences?.length) return { kind: 'tools', requests: [{ kind: 'modules', cursor: response.page!.next! }] };
    withheld = response.supportReferences[0]!.id;
    return { kind: 'submit', result: { localId: 'root', prose: 'Claims to use undelivered support.',
      referent: { description: 'The wide module.', subjects: [wide] }, qualifications: ['Interpretation.'], evidence: [withheld],
      associations: [], children: [], corrections: [], inconsistencies: [] } };
  };
  const execution = await investigate({ session: f.opened.session, request: { operation: 'functionality', subject: wide, parameters: {} },
    evidence: f.evidence, history: { get: () => undefined, provenance: () => undefined, correction: () => undefined, corrections: () => [] },
    agent: new ScriptedInvestigator([() => ({ kind: 'tools', requests: [{ kind: 'modules' }] }), next, next, next]),
    usage: new InvestigationUsage(), check: async () => {} });
  assert.ok(withheld);
  assert.equal(execution.report.suppliedEvidence.includes(withheld), false);
  assert.equal(execution.outcome.kind, 'investigation-failure');
  if (execution.outcome.kind === 'investigation-failure') assert.equal(execution.outcome.reason, 'Evidence must identify supplied context in this session.');
});

test('a complete 263-module inventory fits one guarded dialogue with qualified support by reference', async t => {
  const f = await fixture(t, 260);
  const selected: RecordId[] = [];
  let inspected: RecordId | undefined;
  let pageCount = 0;
  const next = (input: AgentInput): AgentReply => {
    const response = input.responses[0] as EvidenceResponse;
    checkQualified(response, f.store);
    if (response.page) {
      pageCount++;
      selected.push(...response.selected);
      assert.equal(response.page.omitted.length, 0);
      assert.equal(response.status, 'partial', 'referenced support stays explicitly partial even on the final page');
      assert.ok(response.records.every(item => item.kind !== 'source-evidence'));
      assert.ok(response.supportReferences!.length);
      if (response.page.next) return { kind: 'tools', requests: [{ kind: 'modules', cursor: response.page.next }] };
      inspected = response.supportReferences![0]!.id;
      return { kind: 'tools', requests: [{ kind: 'inspect', subject: inspected }] };
    }
    assert.ok(response.records.some(item => item.id === inspected && item.kind === 'source-evidence'));
    return { kind: 'submit', result: { localId: 'root', prose: 'The qualified module inventory was traversed.',
      referent: { description: 'Entry.', subjects: [f.module('entry')] }, qualifications: ['Most source support remains uninspected.'],
      evidence: [inspected], associations: [], children: [], corrections: [], inconsistencies: [] } };
  };
  const result = await investigate({ session: f.opened.session, request: { operation: 'functionality', subject: f.module('entry'), parameters: {} },
    evidence: f.evidence, history: { get: () => undefined, provenance: () => undefined, correction: () => undefined, corrections: () => [] },
    agent: new ScriptedInvestigator([() => ({ kind: 'tools', requests: [{ kind: 'modules' }] }), ...Array.from({ length: 31 }, () => next)]),
    usage: new InvestigationUsage(), check: async () => {} });
  assert.equal(result.outcome.kind, 'accepted', 'default dialogue call and volume guards must permit full traversal and inspection');
  assert.equal(selected.length, 263);
  assert.deepEqual(new Set(selected), new Set(f.evaluation.modules));
  assert.ok(pageCount < 25, 'leave exchanges for useful follow-up after listing');
  assert.deepEqual(result.report.suppliedEvidence.filter(id => f.store.get(id).kind === 'source-evidence'), [inspected]);
});

test('summary citations retain their exposure form, including subsequent full delivery and failed attempts', async t => {
  const f = await fixture(t, 2);
  const summaryIds = new Set<RecordId>();
  const fullIds = new Set<RecordId>();
  let context: RecordId;
  const collect = (response: EvidenceResponse) => {
    response.records.forEach(record => fullIds.add(record.id));
    response.evaluations?.forEach(item => { summaryIds.add(item.id); item.qualification.forEach(item => summaryIds.add(item.id)); });
    response.repositories?.forEach(item => summaryIds.add(item.id));
  };
  const options = { session: f.opened.session, request: { operation: 'functionality' as const, subject: f.module('entry'), parameters: {} },
    evidence: f.evidence, history: { get: () => undefined, provenance: () => undefined, correction: () => undefined, corrections: () => [] },
    check: async () => {} };
  const execution = await investigate({ ...options, usage: new InvestigationUsage(), agent: new ScriptedInvestigator([
    () => ({ kind: 'tools', requests: [{ kind: 'modules' }, { kind: 'membership', subject: f.module('entry') }] }),
    input => {
      const modules = input.responses[0] as EvidenceResponse;
      input.responses.forEach(response => collect(response as EvidenceResponse));
      context = modules.evaluations![0]!.qualification[0]!.id;
      assert.ok(!fullIds.has(context));
      const organization = input.responses[1] as EvidenceResponse;
      const layoutContext = organization.evaluations![0]!.qualification.find(item => item.scope !== 'configured-project')!.id;
      return { kind: 'tools', requests: [{ kind: 'inspect', subject: context }, { kind: 'inspect', subject: layoutContext }] };
    },
    input => {
      const response = input.responses[0] as EvidenceResponse;
      assert.ok(response.records.some(item => item.id === context && item.kind === 'claim-context'));
      input.responses.forEach(response => collect(response as EvidenceResponse));
      return { kind: 'submit', result: { localId: 'root', prose: 'An account supported by qualified summaries.',
        referent: { description: 'Entry.', subjects: [f.module('entry')] }, qualifications: ['Summary citations cover only delivered summary content.'],
        evidence: [...summaryIds], associations: [], children: [], corrections: [], inconsistencies: [] } };
    },
  ]) });
  assert.equal(execution.outcome.kind, 'accepted');
  assert.deepEqual(new Set(execution.report.suppliedEvidence), fullIds);
  assert.deepEqual(new Set(execution.report.summarizedEvidence), summaryIds);
  for (const kind of ['evaluation', 'organization-evaluation', 'repository-evidence']) {
    assert.ok([...summaryIds].some(id => f.store.get(id).kind === kind), `expected summary exposure for ${kind}`);
    assert.ok(![...fullIds].some(id => f.store.get(id).kind === kind));
  }
  assert.ok(execution.report.suppliedEvidence.includes(context!));
  assert.ok(execution.report.summarizedEvidence.includes(context!), 'full delivery does not erase earlier summary exposure');
  if (execution.outcome.kind === 'accepted') {
    assert.deepEqual(execution.outcome.result.provenance.suppliedEvidence, execution.report.suppliedEvidence);
    assert.deepEqual(execution.outcome.result.provenance.summarizedEvidence, execution.report.summarizedEvidence);
    assert.ok(Object.isFrozen(execution.outcome.result.provenance.summarizedEvidence));
  }
  const failed = await investigate({ ...options, usage: new InvestigationUsage(), agent: new ScriptedInvestigator([
    () => ({ kind: 'tools', requests: [{ kind: 'modules' }] }),
    () => ({ kind: 'ended' }),
  ]) });
  assert.equal(failed.outcome.kind, 'investigation-failure');
  assert.ok(failed.report.summarizedEvidence.includes(f.evaluation.id));
  assert.equal(failed.report.suppliedEvidence.includes(f.evaluation.id), false);
});

test('summaries withheld by the response guard do not grant citation eligibility or exposure', async t => {
  const f = await fixture(t, 2);
  const execution = await investigate({ session: f.opened.session, request: { operation: 'functionality', subject: f.module('entry'), parameters: {} },
    evidence: { lookup: f.evidence.lookup, query: query => ({ ...f.evidence.query(query), limitations: ['x'.repeat(evidenceResponseCharacters)] }) },
    history: { get: () => undefined, provenance: () => undefined, correction: () => undefined, corrections: () => [] },
    agent: new ScriptedInvestigator([
      () => ({ kind: 'tools', requests: [{ kind: 'modules' }] }),
      input => {
        assert.equal((input.responses[0] as EvidenceResponse).status, 'unavailable');
        return { kind: 'submit', result: { localId: 'root', prose: 'Claims to cite an undelivered summary.',
          referent: { description: 'Entry.', subjects: [f.module('entry')] }, qualifications: ['Interpretation.'], evidence: [f.evaluation.id],
          associations: [], children: [], corrections: [], inconsistencies: [] } };
      },
    ]), usage: new InvestigationUsage(), check: async () => {} });
  assert.deepEqual(execution.report.suppliedEvidence, []);
  assert.deepEqual(execution.report.summarizedEvidence, []);
  assert.equal(execution.outcome.kind, 'investigation-failure');
  if (execution.outcome.kind === 'investigation-failure') assert.equal(execution.outcome.reason, 'Evidence must identify supplied context in this session.');
});


test('module inspection discovers qualified local and ancestor documentation with bounded continuations and no content exposure', async t => {
  const f = await fixture(t, 160, false, false, 28);
  const responses = pages(f.evidence, { kind: 'inspect', subject: f.module('entry') });
  assert.ok(responses.length > 1);
  const records = responses.flatMap(response => { checkQualified(response, f.store); return response.records; });
  const docs = records.filter(record => record.kind === 'claim' && record.information.type === 'group-documentation');
  assert.equal(new Set(docs.map(record => record.id)).size, 29);
  assert.ok(records.some(record => record.kind === 'claim' && record.information.type === 'module-placement' && record.subject === f.module('entry')));
  assert.ok(records.some(record => record.kind === 'claim' && record.information.type === 'group-containment'));
  assert.ok(!records.some(record => record.kind === 'captured-content'));
  assert.ok(!JSON.stringify(responses).includes('Sibling documentation must not be selected'));
  const artifacts = records.filter(record => record.kind === 'repository-artifact');
  assert.ok(!JSON.stringify(artifacts).includes('unrelated/README.md'));
  assert.match(responses[0]!.limitations.join(' '), /does not establish applicability/);
  const doc = docs[0]!; assert.ok(doc.kind === 'claim' && doc.information.type === 'group-documentation');
  const content = f.evidence.query({ kind: 'source', subject: doc.information.artifact });
  assert.ok(content.records.some(record => record.kind === 'captured-content'));
});

test('normal module inspection lets the investigator acquire documentation and records only delivered exposure', async t => {
  const f = await fixture(t, 2);
  let artifact: RecordId;
  const seen = new Set<RecordId>();
  const agent = new ScriptedInvestigator([
    () => ({ kind: 'tools', requests: [{ kind: 'inspect', subject: f.module('entry') }] }),
    input => {
      const response = input.responses[0] as EvidenceResponse;
      checkQualified(response, f.store);
      response.records.forEach(record => seen.add(record.id));
      assert.ok(!response.records.some(record => record.kind === 'captured-content'));
      const doc = response.records.find(record => record.kind === 'claim' && record.information.type === 'group-documentation');
      assert.ok(doc?.kind === 'claim' && doc.information.type === 'group-documentation');
      artifact = doc.information.artifact;
      return { kind: 'tools', requests: [{ kind: 'source', subject: artifact }] };
    },
    input => {
      const response = input.responses[0] as EvidenceResponse;
      response.records.forEach(record => seen.add(record.id));
      assert.ok(response.records.some(record => record.kind === 'captured-content' && record.text.includes('delegates entry')));
      return { kind: 'submit', result: { localId: 'root', prose: 'Documentation records a delegation assertion.', referent: { description: 'Entry', subjects: [f.module('entry')] }, qualifications: ['Nearby documentation is not proof of applicability or behavior.'], evidence: response.selected, associations: [], children: [], corrections: [], inconsistencies: [] } };
    },
  ]);
  const result = await investigate({ session: f.opened.session, request: { operation: 'functionality', subject: f.module('entry'), parameters: {} }, evidence: f.evidence,
    history: { get: () => undefined, provenance: () => undefined, correction: () => undefined, corrections: () => [] }, agent, usage: new InvestigationUsage(), check: async () => {} });
  assert.equal(result.outcome.kind, 'accepted');
  assert.deepEqual(new Set(result.report.suppliedEvidence), seen);
  assert.ok(result.report.summarizedEvidence.some(id => f.store.get(id).kind === 'organization-evaluation'));
});
