import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { normalizeSession } from './helpers.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { evaluateDependencyOrganization } from '../src/lib/dependencies/organization.js';
import { dependencyChildren, dependencyParents, dependencyStructure } from '../src/lib/dependencies/projections.js';
import type { DependencyOrganizationClaim } from '../src/lib/dependencies/records.js';
import { moduleEntityIds, recordId } from '../src/lib/identity.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import type { ModulePlacementClaim } from '../src/lib/organization/records.js';
import { evaluateOrganization } from '../src/lib/organization/evaluate.js';
import type { EvaluationRecord, ModuleClaim, RecordId } from '../src/lib/records.js';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';

function fixture(files: Record<string, string>, run: (root: string) => void, git = true) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-dependency-projections-'));
  try {
    for (const [name, contents] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
      writeFileSync(path.join(root, name), contents);
    }
    writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
      module: 'NodeNext', moduleResolution: 'NodeNext', noLib: true, types: [], moduleDetection: 'legacy',
    }, include: ['**/*.ts'] }));
    if (git) execFileSync('git', ['init', '--quiet', root]);
    run(root);
  } finally { rmSync(root, { recursive: true, force: true }); }
}
function analyze(root: string) {
  const opened = openTypeScriptProject({ configPath: path.join(root, 'tsconfig.json') });
  assert.equal(opened.status, 'opened');
  if (opened.status !== 'opened') throw new Error('Expected open');
  const store = new MemoryProgramRecordStore();
  const evaluation = evaluateDependencies(store, opened.analysis, ['composition']);
  const basis = store.get(evaluation.moduleEvaluation) as EvaluationRecord;
  const moduleClaims = basis.modules.map(id => { const module = store.get(id); if (module.kind !== 'module') throw new Error('Expected module'); return store.get(module.claim); }).filter((item): item is ModuleClaim => item.kind === 'claim' && item.information.type === 'module');
  const name = (id: RecordId) => { const info = moduleClaims.find(item => item.subject === id)!.information; return info.name ?? info.handle; };
  const module = (name: string) => moduleClaims.find(item => (item.information.name ?? item.information.handle) === name)!.subject;
  return { store, evaluation, basis, name, module };
}

test('structure retains isolated modules, source SCC roots, self loops and shared children', () => {
  fixture({
    'a.ts': "export * from './b'; export * from './shared';",
    'b.ts': "export * from './a';", 'other.ts': "export * from './shared';",
    'shared.ts': 'export {};', 'self.ts': "export * from './self';", 'isolated.ts': 'export {};',
  }, root => {
    const { store, evaluation, name } = analyze(root);
    const view = dependencyStructure(store, evaluation);
    const graph = view.graph!;
    assert.equal(graph.rootsEstablished, true);
    assert.equal(view.modules.length, 6);
    assert.equal(view.relationships.length, 5);
    assert.deepEqual(graph.components.map(c => c.members.map(name).sort()).sort(), [['a', 'b'], ['isolated'], ['other'], ['self'], ['shared']]);
    assert.deepEqual(graph.roots.map(i => graph.components[i]!.members.map(name).sort()).sort(), [['a', 'b'], ['isolated'], ['other'], ['self']]);
    const cycle = graph.components.find(c => c.members.length === 2)!;
    assert.equal(cycle.internalRelationships.length, 2);
    assert.equal(cycle.cyclic, true);
    assert.equal(graph.components.find(c => c.members.map(name).includes('self'))!.internalRelationships.length, 1);
    const shared = graph.components.findIndex(c => c.members.map(name).includes('shared'));
    assert.equal(graph.components.filter(c => c.children.includes(shared)).length, 2);
    assert.deepEqual(dependencyStructure(store, evaluation), view);
  });
});

test('focused lenses retain only direct edges, nonedges stay with their owner and opaque endpoints remain selectable', () => {
  fixture({
    'a.ts': "import './b'; import './missing'; import('outside'); export {};",
    'b.ts': "import './c'; export {};", 'c.ts': 'export {};',
    'node_modules/outside/package.json': '{"types":"index.d.ts"}',
    'node_modules/outside/index.d.ts': 'export interface T {}',
  }, root => {
    const { store, evaluation, name, module, basis } = analyze(root);
    const child = dependencyChildren(store, evaluation, 'a');
    assert.deepEqual(child.modules.map(name).sort(), ['a', 'b', 't']);
    assert.equal(child.relationships.length, 2);
    assert.equal(child.nonEdgeRequests.length, 1);
    assert.equal(dependencyParents(store, evaluation, 'b').relationships.length, 1);
    assert.equal(dependencyParents(store, evaluation, 'a').nonEdgeRequests.length, 0);
    const external = dependencyChildren(store, evaluation, module('t'));
    assert.deepEqual(external.opaqueSubjects, [module('t')]);
    assert.equal(external.relationships.length, 0);
    assert.equal(dependencyParents(store, evaluation, module('t')).relationships.length, 1);
    const compact = moduleEntityIds(basis.modules).get(module('a'))!;
    assert.equal(dependencyChildren(store, evaluation, compact).selection.referenceStatus, 'current');
    assert.equal(dependencyChildren(store, evaluation, 'module-00000000', true).subjects.length, 0);
    assert.deepEqual(dependencyChildren(store, evaluation, compact, true).subjects, [module('a')]);
    const partial = { ...evaluation, id: recordId(evaluation.session, 'partial', 1), execution: 'stopped' as const, materialization: 'partial' as const };
    store.put([partial]);
    const incomplete = dependencyStructure(store, partial);
    assert.equal(incomplete.graph!.rootsEstablished, false);
    assert.deepEqual(incomplete.graph!.roots, []);
    assert.equal(incomplete.subjects.length, 3);
    assert.equal(incomplete.relationships.length, 3);
  });
});

test('composition is an independent exhaustive positive property across merged declarations', () => {
  fixture({
    'target.ts': 'export interface T {}',
    'positive.ts': "// comment\n; export * from './target'; export * as ns from './target'; export type { T } from './target'; export type * from './target'; export {} from './target';",
    'imported.ts': "import './target'; export * from './target';",
    'local.ts': 'const a = 1; export { a };', 'empty.ts': 'export {};',
    'assignment.ts': 'export = 1;', 'executable.ts': "export * from './target'; console.log(1);",
    'broken.ts': "export * from './target'; const = ;",
    'first.d.ts': "declare module 'merged' { export * from 'target'; } declare module 'mixed' { export * from 'target'; } declare module 'target' { export interface T {} }",
    'second.d.ts': "declare module 'merged' { export type { T } from 'target'; } declare module 'mixed' { export const local: number; }",
  }, root => {
    const { store, evaluation, basis, name, module } = analyze(root);
    const outcomes = store.evaluations(evaluation.session).filter(e => e.requirement === 'composition');
    const positives = outcomes.flatMap(e => e.claims ?? []).map(id => store.get(id)).map(claim => {
      assert.ok(claim.kind === 'claim' && claim.information.type === 'module-composition');
      return name(claim.subject);
    });
    assert.deepEqual(positives.sort(), ['merged', 'positive']);
    assert.equal(outcomes.find(e => e.modules.includes(module('broken')))!.materialization, 'partial');
    assert.equal(outcomes.find(e => e.modules.includes(module('empty')))!.materialization, 'full');
    assert.equal(outcomes.length, basis.modules.length);
    const view = dependencyChildren(store, evaluation, 'positive');
    assert.ok(view.expansions.moduleClaims.length > 0);
    assert.ok(view.expansions.moduleEvaluations.every(id => store.get(id).kind === 'evaluation'));
  });
});

function organizationResult(root: string) {
  const result = analyze(root);
  const organization = evaluateOrganization(result.store, result.basis);
  const expansion = evaluateDependencyOrganization(result.store, result.evaluation, organization);
  const claims = expansion.claims.map(id => result.store.get(id) as DependencyOrganizationClaim);
  return { ...result, organization, expansion, claims };
}

test('organization expansion distinguishes same group, descendants and outward without transitive dependencies', () => {
  fixture({ 'src/a.ts': "import './b'; import './child/c'; export {};", 'src/b.ts': 'export {};',
    'src/child/c.ts': "import '../b'; export {};" }, root => {
    const { store, evaluation, expansion, claims, name } = organizationResult(root);
    const answers = claims.map(claim => {
      const relationship = store.get(claim.subject);
      assert.ok(relationship.kind === 'claim' && relationship.information.type === 'dependency');
      return [name(relationship.subject), name(relationship.information.child), claim.information.classification];
    });
    assert.deepEqual(answers.sort(), [['a', 'b', 'same-group'], ['a', 'c', 'into-descendants'], ['c', 'b', 'outward']]);
    assert.equal(expansion.materialization, 'full');
    assert.ok(claims.every(claim => claim.information.occurrences.every(o => o.pairs.every(p => p.commonAncestors.length > 0))));
    assert.equal(dependencyStructure(store, evaluation, expansion.id).expansions.organization, expansion.id);
  });
});

test('merged owners use occurrence-specific source placement; target declarations preserve variation', () => {
  fixture({
    'src/first.d.ts': "declare module 'parent' { export type A = import('target').T; } declare module 'target' { export interface T {} }",
    'src/child/second.d.ts': "declare module 'parent' { export type B = import('target').T; }",
  }, root => {
    const { claims, expansion } = organizationResult(root);
    assert.equal(claims.length, 1);
    assert.equal(claims[0]!.information.classification, 'varies-by-occurrence');
    assert.deepEqual(claims[0]!.information.occurrences.map(o => o.classification).sort(), ['outward', 'same-group']);
    assert.ok(claims[0]!.information.occurrences.every(o => o.source.groups.length === 1));
    assert.equal(expansion.materialization, 'full');
  });
  fixture({ 'src/parent.d.ts': "declare module 'parent' { export type A = import('target').T; } declare module 'target' { export interface T {} }",
    'src/child/target.d.ts': "declare module 'target' { export interface T { value: string } }" }, root => {
    const { claims } = organizationResult(root);
    assert.equal(claims[0]!.information.classification, 'varies-by-placement');
    assert.equal(claims[0]!.information.occurrences[0]!.target.groups.length, 2);
    assert.deepEqual(claims[0]!.information.occurrences[0]!.pairs.map(p => p.classification).sort(), ['into-descendants', 'same-group']);
  });
});

test('missing or partial organization weakens only expansion and cannot establish outward', () => {
  const files = { 'a.ts': "import './b'; export {};", 'b.ts': 'export {};' };
  fixture(files, root => {
    const { store, evaluation, expansion, claims } = organizationResult(root);
    assert.equal(evaluation.materialization, 'full');
    assert.equal(expansion.availability, 'unavailable');
    assert.equal(claims[0]!.information.classification, null);
    assert.equal(dependencyStructure(store, evaluation).relationships.length, 1);
  }, false);
  fixture(files, root => {
    const { store, evaluation, organization } = organizationResult(root);
    const partial = { ...organization, id: recordId(evaluation.session, 'partial-organization', 1), execution: 'stopped' as const, materialization: 'partial' as const };
    store.put([partial]);
    const result = evaluateDependencyOrganization(store, evaluation, partial);
    const claim = store.get(result.claims[0]!) as DependencyOrganizationClaim;
    assert.equal(claim.information.classification, null);
    assert.deepEqual(claim.information.occurrences[0]!.pairs, []);
    assert.equal(claim.information.occurrences[0]!.status, 'partial');
  });
});

test('fallback preserves partial and ambiguous target placement without inventing endpoint associations', () => {
  fixture({ 'src/a.ts': "import './b'; export {};", 'src/b.ts': 'export {};', 'other/c.ts': 'export {};' }, root => {
    const { store, evaluation, organization, module } = organizationResult(root);
    const occurrence = store.get(evaluation.occurrences[0]!);
    const relationship = store.get(evaluation.relationships[0]!);
    assert.ok(occurrence.kind === 'dependency-occurrence');
    assert.ok(relationship.kind === 'claim' && relationship.information.type === 'dependency');
    const fallbackOccurrence = { ...occurrence, id: recordId(evaluation.session, 'fallback-occurrence', 1), targetEvidence: [] };
    const fallbackEdge = { ...relationship, id: recordId(evaluation.session, 'fallback-edge', 1), information: {
      ...relationship.information, occurrences: [fallbackOccurrence.id] } };
    const dependency = { ...evaluation, id: recordId(evaluation.session, 'fallback-dependency', 1), occurrences: [fallbackOccurrence.id], relationships: [fallbackEdge.id] };
    store.put([fallbackOccurrence, fallbackEdge, dependency]);
    const placement = organization.claims.map(id => store.get(id)).find(claim => claim.kind === 'claim'
      && claim.subject === module('b') && claim.information.type === 'module-placement');
    assert.ok(placement?.kind === 'claim' && placement.information.type === 'module-placement');
    for (const mode of ['established', 'partial', 'ambiguous'] as const) {
      const replacement: ModulePlacementClaim = { ...placement, id: recordId(evaluation.session, 'fallback-placement', mode), information: {
        ...placement.information, outcome: mode === 'ambiguous' ? 'ambiguous' as const : 'established' as const,
        groups: mode === 'ambiguous' ? [] : placement.information.groups,
        candidates: mode === 'ambiguous' ? organization.groups.slice(0, 2) : [],
        reasons: mode === 'partial' ? ['not-visible' as const] : [],
        materialization: mode === 'ambiguous' ? 'partial' as const : 'full' as const,
      } };
      const changed = { ...organization, id: recordId(evaluation.session, 'fallback-organization', mode),
        claims: organization.claims.map(id => id === placement.id ? replacement.id : id) };
      store.put([replacement, changed]);
      const result = evaluateDependencyOrganization(store, dependency, changed);
      const claim = store.get(result.claims[0]!) as DependencyOrganizationClaim;
      const item = claim.information.occurrences[0]!;
      assert.equal(item.target.basis, 'module-placement');
      assert.deepEqual(item.target.claims, [replacement.id]);
      assert.equal(item.status, mode);
      assert.equal(item.classification, mode === 'established' ? 'same-group' : null);
      if (mode === 'ambiguous') {
        assert.equal(item.target.candidates.length, 2);
        assert.deepEqual(item.pairs, []);
      }
    }
  });
});

test('directory links preserve multiple containment parents and their common ancestor evidence', () => {
  fixture({ 'src/target.ts': 'export {};', 'holder/entry.ts': "import '../src/target'; export {};" }, root => {
    symlinkSync('../src', path.join(root, 'holder/alias'));
    const { claims } = organizationResult(root);
    const item = claims[0]!.information.occurrences[0]!;
    assert.equal(item.classification, 'into-descendants');
    assert.equal(item.pairs.length, 1);
    assert.equal(item.pairs[0]!.commonAncestors.length, 2);
    assert.equal(item.pairs[0]!.containment.length, 3);
  });
});

test('empty graph and composition evaluation are established empty results', () => {
  fixture({ 'script.ts': 'const value = 1;' }, root => {
    const { store, evaluation } = analyze(root);
    const projection = dependencyStructure(store, evaluation);
    assert.deepEqual(projection.graph, { components: [], roots: [], rootsEstablished: true });
    const composition = store.evaluations(evaluation.session).filter(e => e.requirement === 'composition');
    assert.equal(composition.length, 1);
    assert.equal(composition[0]!.materialization, 'full');
    assert.deepEqual(composition[0]!.claims, []);
  });
});

test('graph and composition results reproduce across fresh processes', () => {
  const script = `import { openTypeScriptProject } from './_build/src/lib/typescript/project.js';
    import { MemoryProgramRecordStore } from './_build/src/lib/memory-store.js';
    import { evaluateDependencies } from './_build/src/lib/dependencies/evaluate.js';
    import { dependencyStructure } from './_build/src/lib/dependencies/projections.js';
    const store = new MemoryProgramRecordStore();
    const opened = openTypeScriptProject({ configPath: 'fixtures/dependency-contract/tsconfig.json' });
    const outcome = evaluateDependencies(store, opened.analysis, ['composition']);
    const projection = dependencyStructure(store, outcome);
    console.log(JSON.stringify([projection, ...projection.expansions.moduleEvaluations.map(id => store.get(id)),
      ...projection.expansions.moduleClaims.map(id => store.get(id))]));`;
  const run = () => execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  assert.deepEqual(normalizeSession(JSON.parse(run())), normalizeSession(JSON.parse(run())));
});

test('store rejects invalid component indices and missing organization occurrence support atomically', () => {
  fixture({ 'a.ts': "import './b'; export {};", 'b.ts': 'export {};' }, root => {
    const { store, evaluation, claims } = organizationResult(root);
    const view = dependencyStructure(store, evaluation);
    const invalid = { ...view, id: recordId(evaluation.session, 'invalid-graph', 1), graph: { ...view.graph!, roots: [100] } };
    assert.throws(() => store.put([invalid]), /Invalid dependency graph grouping/);
    assert.throws(() => store.get(invalid.id), /Missing program record/);
    const claim = claims[0]!;
    assert.throws(() => store.put([{ ...claim, id: recordId(evaluation.session, 'invalid-expansion', 1),
      information: { ...claim.information, occurrences: [] } }]), /every supporting occurrence/);
  });
});
