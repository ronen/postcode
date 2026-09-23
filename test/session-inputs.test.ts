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
import { evaluateDependencies } from '../src/lib/dependencies/evaluate.js';
import { modules } from '../src/lib/projections.js';
import { openSession, SessionInvalidated, AnalysisFailure } from '../src/lib/session.js';
import type { ProgramRecord } from '../src/lib/records.js';
import { moduleStandardExpansions } from '../src/lib/records.js';

function temporary(run: (root: string, configPath: string) => void, include = false) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-session-'));
  try {
    execFileSync('git', ['init', '--quiet', root]);
    const configPath = path.join(root, 'tsconfig.json');
    writeFileSync(configPath, JSON.stringify({ compilerOptions: { noLib: true, types: [], module: 'nodenext' },
      ...(include ? { include: ['**/*.ts', '**/*.cts'] } : { files: ['entry.cts'] }) }));
    writeFileSync(path.join(root, 'entry.cts'), "export {}; require('./later/target');");
    run(root, configPath);
  } finally { rmSync(root, { recursive: true, force: true }); }
}

const request = { lens: 'modules' as const, selector: null, presentation: { format: 'json' as const, sourceDetail: false } };

test('dependency acquisition adds captured inputs while completed core work and earlier support remain unchanged', () => {
  temporary((root, configPath) => {
    mkdirSync(path.join(root, 'later'));
    writeFileSync(path.join(root, 'later/target.ts'), 'export const target = 1;');
    const opened = openTypeScriptProject({ configPath });
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
  test(`session invalidates after detected ${change} changes`, () => {
    temporary((root, configPath) => {
      if (change === 'resolution' || change === 'population') rmSync(path.join(root, '.git'), { recursive: true });
      const opened = openSession({ configPath });
      if (opened.status !== 'opened') throw new Error('Expected project');
      const { session } = opened;
      const oldEnvironment = process.env.POSTCODE_SESSION_TEST;
      try {
        session.execute(change === 'resolution' ? { ...request, lens: 'dependencies' } : request);
        if (change === 'source') writeFileSync(path.join(root, 'entry.cts'), 'export const changed = 1;');
        if (change === 'configuration') writeFileSync(configPath, '{"files":[]}');
        if (change === 'resolution') { mkdirSync(path.join(root, 'later')); writeFileSync(path.join(root, 'later/target.ts'), 'export {};'); }
        if (change === 'population') writeFileSync(path.join(root, 'new.ts'), 'export {};');
        if (change === 'repository') writeFileSync(path.join(root, '.gitignore'), 'entry.cts\n');
        if (change === 'environment') process.env.POSTCODE_SESSION_TEST = 'changed';
        assert.throws(() => session.execute(request), SessionInvalidated);
        assert.throws(() => session.check(), SessionInvalidated);
      } finally {
        session.close();
        if (oldEnvironment === undefined) delete process.env.POSTCODE_SESSION_TEST;
        else process.env.POSTCODE_SESSION_TEST = oldEnvironment;
      }
    }, change === 'population');
  });
}

test('excluded observation creation does not invalidate the session', () => {
  temporary((root, configPath) => {
    const output = path.join(root, 'observations');
    const opened = openSession({ configPath, excludedOutputDirectories: [output] });
    if (opened.status !== 'opened') throw new Error('Expected project');
    try {
      const before = opened.session.execute(request);
      mkdirSync(output);
      writeFileSync(path.join(output, 'fake.ts'), 'export const fake = 1;');
      assert.deepEqual(opened.session.execute(request), before);
    } finally { opened.session.close(); }
  }, true);
});

test('a later completed evaluation preserves the earlier incomplete outcome and projection', () => {
  temporary((_root, configPath) => {
    const opened = openTypeScriptProject({ configPath });
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

test('publication observes invalidation before and after output without fabricating or erasing views', async () => {
  const { publishCommand } = await import('../src/lib/command-execution.js');
  const cases: Promise<void>[] = [];
  // Keep each temporary directory alive through asynchronous observation submission.
  for (const after of [false, true]) {
    const root = mkdtempSync(path.join(os.tmpdir(), 'postcode-publication-'));
    const configPath = path.join(root, 'tsconfig.json');
    writeFileSync(configPath, '{"compilerOptions":{"noLib":true,"types":[]},"files":["entry.ts"]}');
    const source = path.join(root, 'entry.ts');
    writeFileSync(source, 'export const original = 1;');
    const opened = openSession({ configPath });
    if (opened.status !== 'opened') throw new Error('Expected project');
    const { session } = opened;
    let output = '', error = '';
    cases.push((async () => {
      try {
        const code = await publishCommand({ id: session.id, check: session.check, execute: command => {
          const result = session.execute(command);
          if (!after) writeFileSync(source, 'export const changed = 2;');
          return result;
        } }, request, 'modules --json', configPath, 1, {
          stdout: text => { output += text; if (after) writeFileSync(source, 'export const changed = 2;'); },
          stderr: text => { error += text; },
        }, { async submit(batch) {
          assert.equal(batch.records.some(record => record.kind === 'qualified-view'), after);
          assert.equal(batch.records.find(record => record.kind === 'rendered-output')!.value, output);
          assert.ok(batch.events.some(event => event.type === 'session-invalidated'));
          assert.equal(batch.events.some(event => event.type === 'view-produced'), after);
          assert.equal(batch.events.some(event => event.type === 'source-escape'), false);
          return { accepted: true };
        } });
        assert.equal(code, 2);
        assert.match(error, /invalidated/);
        assert.equal(output.length > 0, after);
      } finally { session.close(); rmSync(root, { recursive: true, force: true }); }
    })());
  }
  await Promise.all(cases);
});

test('dependency completion keeps earlier partial outcomes even when the module basis is reused', () => {
  temporary((_root, configPath) => {
    const opened = openTypeScriptProject({ configPath });
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
  temporary(root => {
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
  test(`operational analysis errors check input stability before allowing continuation (changed=${changed})`, t => {
    temporary((root, configPath) => {
      mkdirSync(path.join(root, 'later'));
      writeFileSync(path.join(root, 'later/target.ts'), 'export const target = 1;');
      const opened = openSession({ configPath });
      if (opened.status !== 'opened') throw new Error('Expected project');
      const { session } = opened;
      try {
        const before = session.execute(request);
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
        assert.throws(() => session.execute({ ...request, lens: 'dependencies' }), changed ? SessionInvalidated : AnalysisFailure);
        assert.equal(attempted, true);
        probe.mock.restore();
        if (changed) assert.throws(() => session.execute(request), SessionInvalidated);
        else assert.deepEqual(session.execute(request), before);
      } finally { session.close(); }
    });
  });
}
