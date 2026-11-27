import { requireAnswer, mechanicalContent } from './application-assertions.js';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import ts from 'typescript';
import { openTypeScriptProject } from '../src/lib/typescript/project.js';
import { MemoryProgramRecordStore } from '../src/lib/memory-store.js';
import { evaluateModules } from '../src/lib/evaluation.js';
import { evidenceAccess } from '../src/lib/evidence-access.js';
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { modules } from './projection-helpers.js';
import { openApplication as openSession, SessionInvalidated, AnalysisFailure } from '../src/lib/application/index.js';
import type { ProgramRecord } from '../src/lib/records.js';
import { moduleStandardExpansions } from '../src/lib/records.js';

async function temporary(run: (root: string, configPath: string) => void | Promise<void>, include = false) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-session-'));
  try {
    execFileSync('git', ['init', '--quiet', root]);
    const configPath = path.join(root, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [], module: 'nodenext' },
      ...(include ? { include: ['**/*.ts', '**/*.cts'] } : { files: ['entry.cts'] }) }));
    writeFileSync(path.join(root, 'entry.cts'), "export {}; require('./later/target');");
    await run(root, configPath);
  } finally { rmSync(root, { recursive: true, force: true }); }
}

const request = { kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } } as const;

test('dependency acquisition adds captured inputs while completed core work and earlier support remain unchanged', async () => {
  await temporary(async (root, configPath) => {
    mkdirSync(path.join(root, 'later'));
    writeFileSync(path.join(root, 'later/target.ts'), 'export const target = 1;');
    const opened = (await openTypeScriptProject({ configPath }));
    if (opened.status !== 'opened') throw new Error('Expected project');
    const store = new MemoryProgramRecordStore();
    const first = evaluateModules(store, opened.analysis, moduleStandardExpansions);
    const projection = modules(store, first);
    const retained = structuredClone([first, projection, ...first.contexts.map(id => store.get(id))]);
    const original = store.get(first.contexts[0]!);
    if (original.kind !== 'claim-context') throw new Error('Expected context');
    const earlierInputs = store.get(original.inputs!);
    assert.equal(earlierInputs.kind, 'analysis-inputs');
    const compilerInputs = (value: ProgramRecord) => value.kind === 'analysis-inputs'
      ? JSON.stringify((value.value as { inputs: unknown }).inputs) : '';
    assert.equal(compilerInputs(earlierInputs).includes('later/target.ts'), false);
    const later = evaluateDependencies(store, opened.analysis, moduleStandardExpansions);
    const context = store.get(later.contexts[0]!);
    if (context.kind !== 'claim-context') throw new Error('Expected context');
    assert.notEqual(context.inputs, original.inputs);
    assert.ok(compilerInputs(store.get(context.inputs!)).includes('later/target.ts'));
    assert.equal(later.moduleEvaluation, first.id);
    assert.equal(evaluateModules(store, opened.analysis, moduleStandardExpansions).id, first.id);
    assert.deepEqual([store.get(first.id), store.get(projection.id), ...first.contexts.map(id => store.get(id))], retained);
    assert.deepEqual(store.get(earlierInputs.id), earlierInputs);
  });
});

for (const change of ['source', 'configuration', 'resolution', 'population', 'repository', 'environment'] as const) {
  test(`session invalidates after detected ${change} changes`, async () => {
    await temporary(async (root, configPath) => {
      if (change === 'resolution' || change === 'population') rmSync(path.join(root, '.git'), { recursive: true });
      const opened = (await openSession({ configPath }));
      if (opened.status !== 'opened') throw new Error('Expected project');
      const { session } = opened;
      const oldEnvironment = process.env.POSTCODE_SESSION_TEST;
      try {
        requireAnswer(await session.execute(change === 'resolution' ? { ...request, lens: 'dependency-structure' } : request));
        if (change === 'source') writeFileSync(path.join(root, 'entry.cts'), 'export const changed = 1;');
        if (change === 'configuration') writeFileSync(configPath, '{"files":[]}');
        if (change === 'resolution') { mkdirSync(path.join(root, 'later')); writeFileSync(path.join(root, 'later/target.ts'), 'export {};'); }
        if (change === 'population') writeFileSync(path.join(root, 'new.ts'), 'export {};');
        if (change === 'repository') writeFileSync(path.join(root, '.gitignore'), 'entry.cts\n');
        if (change === 'environment') process.env.POSTCODE_SESSION_TEST = 'changed';
        await assert.rejects(async () => (requireAnswer(await session.execute(request))), SessionInvalidated);
        await assert.rejects(async () => (await session.check()), SessionInvalidated);
      } finally {
        await session.close();
        if (oldEnvironment === undefined) delete process.env.POSTCODE_SESSION_TEST;
        else process.env.POSTCODE_SESSION_TEST = oldEnvironment;
      }
    }, change === 'population');
  });
}

test('excluded observation creation does not invalidate the session', async () => {
  await temporary(async (root, configPath) => {
    const output = path.join(root, 'observations');
    const opened = (await openSession({ configPath, excludedOutputDirectories: [output] }));
    if (opened.status !== 'opened') throw new Error('Expected project');
    try {
      const before = (requireAnswer(await opened.session.execute(request)));
      mkdirSync(output);
      writeFileSync(path.join(output, 'fake.ts'), 'export const fake = 1;');
      assert.deepEqual(requireAnswer(await opened.session.execute(request)).answer, before.answer);
    } finally { await opened.session.close(); }
  }, true);
});

test('a later completed evaluation preserves the earlier incomplete outcome and projection', async () => {
  await temporary(async (_root, configPath) => {
    const opened = (await openTypeScriptProject({ configPath }));
    if (opened.status !== 'opened') throw new Error('Expected project');
    const store = new MemoryProgramRecordStore();
    let first = true;
    const analysis = { discover: () => {
      const result = opened.analysis.discover(store);
      if (!first) return result;
      first = false;
      return { ...result, execution: 'stopped' as const, materialization: 'partial' as const, reason: 'Controlled incomplete attempt' };
    } };
    const incomplete = evaluateModules(store, analysis);
    const projection = modules(store, incomplete);
    const retained = structuredClone([incomplete, projection]);
    const completed = evaluateModules(store, analysis);
    assert.notEqual(completed.id, incomplete.id);
    assert.equal(completed.execution, 'completed');
    assert.equal(evaluateModules(store, analysis).id, completed.id);
    assert.deepEqual([store.get(incomplete.id), store.get(projection.id)], retained);
    assert.equal(projection.selection.populationEstablished, false);
    assert.equal(modules(store, completed).selection.populationEstablished, true);
  });
});

test('dependency completion keeps earlier partial outcomes even when the module basis is reused', async () => {
  await temporary(async (_root, configPath) => {
    const opened = (await openTypeScriptProject({ configPath }));
    if (opened.status !== 'opened') throw new Error('Expected project');
    const store = new MemoryProgramRecordStore();
    let first = true;
    const analysis = { discover: () => {
      const result = opened.analysis.discover(store, [], true);
      if (!first) return result;
      first = false;
      return { ...result, dependencies: { ...result.dependencies!, execution: 'stopped' as const,
        materialization: 'partial' as const, reason: 'Controlled incomplete dependency attempt' } };
    } };
    const partial = evaluateDependencies(store, analysis);
    const retained = structuredClone(partial);
    const completed = evaluateDependencies(store, analysis);
    assert.equal(completed.moduleEvaluation, partial.moduleEvaluation);
    assert.notEqual(completed.id, partial.id);
    assert.equal(completed.materialization, 'full');
    assert.deepEqual(store.get(partial.id), retained);
  });
});

test('validation refuses retargeted output boundaries before replaying captured reads', async () => {
  const { captureInputs } = await import('../src/lib/typescript/inputs.js');
  const { symlinkSync, unlinkSync } = await import('node:fs');
  await temporary(root => {
    const output = path.join(root, 'output');
    const first = path.join(root, 'first'), second = path.join(root, 'second');
    mkdirSync(first); mkdirSync(second);
    symlinkSync(first, output);
    const captured = captureInputs([output]);
    captured.system.readFile(path.join(root, 'entry.cts'));
    assert.equal(captured.changed(), false);
    unlinkSync(output); symlinkSync(second, output);
    assert.equal(captured.changed(), true);
  });
});

for (const changed of [false, true]) {
  test(`operational analysis errors check input stability before allowing continuation (changed=${changed})`, async t => {
    await temporary(async (root, configPath) => {
      mkdirSync(path.join(root, 'later'));
      writeFileSync(path.join(root, 'later/target.ts'), 'export const target = 1;');
      const opened = (await openSession({ configPath }));
      if (opened.status !== 'opened') throw new Error('Expected project');
      const { session } = opened;
      try {
        const before = (requireAnswer(await session.execute(request)));
        const exists = ts.sys.fileExists;
        let attempted = false;
        const probe = t.mock.method(ts.sys, 'fileExists', (name: string) => {
          if (name === path.join(root, 'later/target.ts')) {
            attempted = true;
            if (changed) writeFileSync(path.join(root, 'entry.cts'), 'export const changed = 2;');
            throw Object.assign(new Error('Controlled resolution I/O failure'), { code: 'EIO' });
          }
          return exists(name);
        });
        await assert.rejects(async () => (requireAnswer(await session.execute({ ...request, lens: 'dependency-structure' }))), changed ? SessionInvalidated : AnalysisFailure);
        assert.equal(attempted, true);
        probe.mock.restore();
        if (changed) await assert.rejects(async () => (requireAnswer(await session.execute(request))), SessionInvalidated);
        else assert.deepEqual(requireAnswer(await session.execute(request)).answer, before.answer);
      } finally { await session.close(); }
    });
  });
}

for (const lens of ['modules', 'inspect', 'dependencies'] as const) {
  test(`session reuses partial expansions through ${lens} until additional inputs are acquired`, async () => {
    await temporary(async (root, configPath) => {
      writeFileSync(path.join(root, 'entry.cts'), "export { missing } from './nowhere.js';");
      writeFileSync(path.join(root, 'other.ts'), 'export const other = 1;');
      const opened = (await openSession({ configPath }));
      if (opened.status !== 'opened') throw new Error('Expected project');
      const { session } = opened;
      try {
        const inventory = (requireAnswer(await session.execute(request)));
        if (inventory.answer.content.contract !== 'modules') throw new Error('Expected modules');
        assert.ok(inventory.answer.content.value.evaluations.some(item => item.requirement === 'modules' && item.materialization === 'full'));
        assert.ok(inventory.answer.content.value.evaluations.some(item => item.requirement === 'exports' && item.materialization === 'partial'));
        const command = { ...request, lens: lens === 'dependencies' ? 'dependency-structure' : lens, designation: lens === 'inspect'
          ? { kind: 'reference' as const, value: inventory.answer.content.value.modules[0]!.id } : request.designation };
        const first = (requireAnswer(await session.execute(command)));
        const retained = (await structuredClone(first));
        const later = (requireAnswer(await session.execute(command)));
        assert.deepEqual(later.answer, first.answer);
        assert.deepEqual(first.answer, retained.answer);
        const firstBase = mechanicalContent(first), laterBase = mechanicalContent(later);
        if (!('modules' in firstBase) || !('modules' in laterBase)) throw new Error('Expected module selection');
        assert.deepEqual(laterBase.modules.map(item => item.id), firstBase.modules.map(item => item.id));
      } finally { await session.close(); }
    }, true);
  });
}


test('additional dependency inputs permit one new partial attempt and preserve the earlier basis', async () => {
  await temporary(async (root, configPath) => {
    writeFileSync(path.join(root, 'entry.cts'), "export { missing } from './nowhere.js'; require('./later/target');");
    mkdirSync(path.join(root, 'later'));
    writeFileSync(path.join(root, 'later/target.ts'), 'export const target = 1;');
    const opened = (await openTypeScriptProject({ configPath }));
    if (opened.status !== 'opened') throw new Error('Expected project');
    const store = new MemoryProgramRecordStore();
    const firstResult = opened.analysis.discover(store, moduleStandardExpansions);
    const first = evaluateModules(store, opened.analysis, moduleStandardExpansions);
    const retained = structuredClone(first);
    assert.ok(firstResult.expansions!.some(item => item.materialization === 'partial'));
    assert.ok(firstResult.retryBasis);
    const count = store.evaluations(first.session).length;
    assert.equal(opened.analysis.discover(store, moduleStandardExpansions), firstResult);
    assert.equal(evaluateModules(store, opened.analysis, moduleStandardExpansions).id, first.id);
    assert.equal(store.evaluations(first.session).length, count);
    const dependencies = evaluateDependencies(store, opened.analysis, moduleStandardExpansions);
    const laterResult = opened.analysis.discover(store, moduleStandardExpansions);
    assert.notEqual(laterResult.retryBasis, firstResult.retryBasis);
    assert.notEqual(dependencies.moduleEvaluation, first.id);
    const later = evaluateModules(store, opened.analysis, moduleStandardExpansions);
    assert.equal(later.id, dependencies.moduleEvaluation);
    assert.equal(opened.analysis.discover(store, moduleStandardExpansions), laterResult);
    assert.equal(evaluateModules(store, opened.analysis, moduleStandardExpansions).id, later.id);
    assert.deepEqual(store.get(first.id), retained);
    assert.ok(laterResult.expansions!.some(item => item.materialization === 'partial'));
    // Providers without the explicit stable-basis assurance still get a new attempt.
    const uncertain = { discover: () => { const { retryBasis: _basis, ...result } = laterResult; return result; } };
    assert.notEqual(evaluateModules(store, uncertain).id, evaluateModules(store, uncertain).id);
  });
});

test('session reevaluates partial work after new dependency acquisition, then reuses it across lenses', async () => {
  await temporary(async (root, configPath) => {
    writeFileSync(path.join(root, 'entry.cts'), "export { missing } from './nowhere.js'; require('./later/target');");
    mkdirSync(path.join(root, 'later'));
    writeFileSync(path.join(root, 'later/target.ts'), 'export const target = 1;');
    const opened = (await openSession({ configPath }));
    if (opened.status !== 'opened') throw new Error('Expected project');
    const { session } = opened;
    try {
      const first = (requireAnswer(await session.execute(request)));
      const retained = (await structuredClone(first));
      assert.deepEqual(requireAnswer(await session.execute(request)).answer, first.answer);
      requireAnswer(await session.execute({ ...request, lens: 'dependency-structure' }));
      const later = (requireAnswer(await session.execute(request)));
      assert.notEqual(later.answer.id, first.answer.id);
      requireAnswer(await session.execute({ ...request, lens: 'organization' }));
      // The unresolved re-export still supplies the valid generated handle "missing".
      const inspected = requireAnswer(await session.execute({ ...request, lens: 'inspect', designation: { kind: 'name', value: 'missing' } }));
      const base = mechanicalContent(inspected);
      assert.ok('modules' in base);
      assert.equal(base.modules[0]!.claim.record.information.handle, 'missing');
      assert.deepEqual(requireAnswer(await session.execute(request)).answer, later.answer);
      assert.deepEqual(first.answer, retained.answer);
    } finally { await session.close(); }
  });
});


test('README acquisition advances the shared basis once for partial work and preserves completed work', async () => {
  for (const partial of [false, true]) await temporary(async (root, configPath) => {
    writeFileSync(path.join(root, 'entry.cts'), partial ? "export { missing } from './nowhere.js';" : 'export const present = 1;');
    writeFileSync(path.join(root, 'README.md'), 'Repository documentation.');
    const opened = await openTypeScriptProject({ configPath });
    if (opened.status !== 'opened') throw new Error('Expected project');
    const store = new MemoryProgramRecordStore();
    const evidence = evidenceAccess(store, opened.analysis, opened.session);
    const groups = evidence.query({ kind: 'organization' });
    const rootClaim = groups.records.find(item => item.kind === 'claim' && item.information.type === 'group' && item.information.name === null);
    assert.ok(rootClaim?.kind === 'claim');
    const organization = evidence.query({ kind: 'group', subject: rootClaim.subject });
    const readme = organization.records.find(item => item.kind === 'repository-artifact' && item.artifact.path === 'README.md');
    assert.ok(readme);
    const before = opened.analysis.discover(store, moduleStandardExpansions);
    const first = evaluateModules(store, opened.analysis, moduleStandardExpansions);
    const earlier = structuredClone([first, ...first.contexts.map(id => store.get(id))]);
    const firstContext = store.get(first.contexts[0]!);
    assert.equal(firstContext.kind, 'claim-context');
    if (firstContext.kind !== 'claim-context') throw new Error('Expected context');
    const firstInputs = store.get(firstContext.inputs!);
    const snapshot = structuredClone(firstInputs);
    assert.ok(firstInputs.kind === 'analysis-inputs');
    assert.doesNotMatch(JSON.stringify((firstInputs.value as { inputs: unknown }).inputs), /README\.md/);
    const captured = evidence.query({ kind: 'source', subject: readme.id }).records.find(item => item.kind === 'captured-content');
    assert.ok(captured?.kind === 'captured-content');
    assert.notEqual(captured.inputs, firstContext.inputs);
    const after = opened.analysis.discover(store, moduleStandardExpansions);
    const later = evaluateModules(store, opened.analysis, moduleStandardExpansions);
    if (partial) {
      assert.notEqual(after.retryBasis, before.retryBasis);
      assert.notEqual(later.id, first.id);
      const inputs = store.get(after.retryBasis!);
      assert.ok(inputs.kind === 'analysis-inputs');
      assert.match(JSON.stringify((inputs.value as { inputs: unknown }).inputs), /README\.md/);
    } else assert.equal(later.id, first.id);
    assert.equal(opened.analysis.discover(store, moduleStandardExpansions), after);
    assert.equal(evaluateModules(store, opened.analysis, moduleStandardExpansions).id, later.id);
    assert.deepEqual(store.get(firstInputs.id), snapshot);
    assert.deepEqual([store.get(first.id), ...first.contexts.map(id => store.get(id))], earlier);
    assert.equal(await opened.changed(), false);
  });
});
