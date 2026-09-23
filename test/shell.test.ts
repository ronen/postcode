import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import path from 'node:path';
import { test } from 'node:test';
import { runCli } from '../src/lib/cli.js';
import { commandWords, parseCommand } from '../src/lib/commands.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import type { QualifiedView } from '../src/lib/presentation.js';
import { normalizeSession } from './helpers.js';

const config = path.resolve('fixtures/dependency-journey/tsconfig.json');

test('shell tokenizer has quoting without command execution, and preserves literal reserved-looking names', () => {
  assert.deepEqual(commandWords(`inspect 'a b' --json`), ['inspect', 'a b', '--json']);
  assert.deepEqual(commandWords('inspect a\\ b'), ['inspect', 'a b']);
  assert.deepEqual(commandWords('inspect "$(echo nope)"'), ['inspect', '$(echo nope)']);
  assert.throws(() => commandWords('inspect "unfinished'), /unfinished/);
  const literal = parseCommand(['inspect', '--', '@module-deadbeef'], '.', true);
  assert.equal(literal.kind, 'view');
  if (literal.kind === 'view') { assert.equal(literal.request.selector, '@module-deadbeef'); assert.equal(literal.request.reference, undefined); }
  const reference = parseCommand(['inspect', '@module-deadbeef'], '.', true);
  if (reference.kind !== 'view') throw new Error('Expected view');
  assert.equal(reference.request.reference, true);
  assert.equal(reference.request.selector, 'module-deadbeef');
  assert.equal(parseCommand(['modules', '--project', 'other'], '.', true).kind, 'error');
});

test('non-terminal shell input is refused before project opening', async () => {
  let error = '';
  const code = await runCli(['shell', '--project', '/does/not/exist'], {
    cwd: process.cwd(), checkout: process.cwd(), input: new PassThrough(), stdout: () => assert.fail('No output'), stderr: text => { error += text; },
  });
  assert.equal(code, 2);
  assert.match(error, /terminal stdin/);
  assert.doesNotMatch(error, /Project open/);
});

test('adaptive shell uses prior references, records syntax refusals, finishes on EOF and matches one-shot views', { timeout: 30000 }, async () => {
  const input = Object.assign(new PassThrough(), { isTTY: true });
  const batches: ObservationBatch[] = [];
  let started = false, stderr = '';
  const shell = runCli(['shell', '--project', config, '--json'], {
    cwd: process.cwd(), checkout: process.cwd(), input,
    stdout: text => {
      if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('inspect "unfinished\n')); }
    }, stderr: text => { stderr += text; },
    sink: { async submit(batch) {
      batches.push(batch);
      setImmediate(() => {
        if (batch.command === 1) input.write('modules\n');
        else if (batch.command === 2) {
          const view = batch.records.find(item => item.kind === 'qualified-view')!.value as QualifiedView;
          const forward = view.modules.find(item => item.handle === 'forward')!;
          input.write(`inspect @${forward.entityId} --source-detail\n`);
        } else if (batch.command === 3) input.write('dependencies\n');
        else input.end();
      });
      return { accepted: true }; } },
  });
  assert.equal(await shell, 0);
  assert.match(stderr, /unfinished/);
  assert.equal(batches.length, 4);
  assert.equal(new Set(batches.map(batch => batch.session)).size, 1);
  assert.deepEqual(batches.map(batch => batch.command), [1, 2, 3, 4]);
  assert.deepEqual(batches[0]!.events.map(event => event.type), ['command-refused']);
  assert.ok(!batches[0]!.records.some(item => item.kind === 'qualified-view'));
  const inspection = batches[2]!.records.find(item => item.kind === 'qualified-view')!.value as QualifiedView;
  assert.equal(inspection.projection.selection.matches, 1);
  assert.ok(inspection.sourceDetail);
  let oneShot: ObservationBatch | undefined;
  await runCli(['dependencies', '--project', config, '--json'], {
    cwd: process.cwd(), checkout: process.cwd(), stdout: () => {}, stderr: () => {},
    sink: { async submit(batch) { oneShot = batch; return { accepted: true }; } },
  });
  assert.deepEqual(normalizeSession(batches[3]!.records.find(item => item.kind === 'qualified-view')!.value),
    normalizeSession(oneShot!.records.find(item => item.kind === 'qualified-view')!.value));
});

test('ambiguous one-shot lookup recovers through an in-session lookup and precise group reference', { timeout: 30000 }, async () => {
  let original: unknown;
  await runCli(['inspect', 'src', '--project', config, '--json'], {
    cwd: process.cwd(), checkout: process.cwd(), stdout: () => {}, stderr: () => {},
    sink: { async submit(batch) { original = batch.records.find(item => item.kind === 'qualified-view')!.value; return { accepted: true }; } },
  });
  const input = Object.assign(new PassThrough(), { isTTY: true });
  let started = false, count = 0;
  assert.equal(await runCli(['shell', '--project', config, '--json'], {
    cwd: process.cwd(), checkout: process.cwd(), input, stderr: () => {},
    stdout: text => { if (!started && text.includes('postcode> ')) { started = true; setImmediate(() => input.write('inspect src\n')); } },
    sink: { async submit(batch) {
      count++;
      const view = batch.records.find(item => item.kind === 'qualified-view')!.value as {
        projection: { selection: { matches: number } }; groups: { entityId: string }[];
      };
      if (count === 1) {
        assert.ok(view.projection.selection.matches > 1);
        assert.deepEqual(normalizeSession(view), normalizeSession(original));
        setImmediate(() => input.write(`inspect @${view.groups[0]!.entityId}\n`));
      } else { assert.equal(view.projection.selection.matches, 1); setImmediate(() => input.end()); }
      return { accepted: true };
    } },
  }), 0);
  assert.equal(count, 2);
});

test('idle Ctrl-C discards its input line and EOF finishes the next accepted command', { timeout: 30000 }, async () => {
  const input = Object.assign(new PassThrough(), { isTTY: true });
  let started = false, count = 0;
  const code = await runCli(['shell', '--project', config], {
    cwd: process.cwd(), checkout: process.cwd(), input, stderr: () => {},
    stdout: text => {
      if (!started && text.includes('postcode> ')) {
        started = true;
        setImmediate(() => { input.write('discard-this'); input.write('\x1b[D\x1b[D'); input.write('\x03'); setImmediate(() => input.end('modules\n')); });
      }
    },
    sink: { async submit(batch) {
      count++; assert.equal(batch.command, 1);
      assert.ok(batch.events.some(event => event.type === 'view-produced'));
      return { accepted: true };
    } },
  });
  assert.equal(code, 0); assert.equal(count, 1);
});

test('expected analysis failure, defect and interruption are distinct and never invent views', async () => {
  const { publishCommand } = await import('../src/lib/command-execution.js');
  const { AnalysisFailure } = await import('../src/lib/session.js');
  const { CommandInterrupted } = await import('../src/lib/interactive-session.js');
  for (const [error, expectedCode, expectedEvent] of [
    [new AnalysisFailure('temporarily unavailable'), 3, 'command-failed'],
    [new Error('broken invariant\x1b[2J'), 1, 'command-defect'],
    [new CommandInterrupted(), 130, 'command-interrupted'],
  ] as const) {
    let stderr = '';
    let observed: ObservationBatch | undefined;
    const code = await publishCommand({ id: 'test-session', execute: () => { throw error; }, check: () => {} },
      { lens: 'modules', selector: null, presentation: { format: 'json', sourceDetail: false } }, 'modules', config, 1,
      { stdout: () => assert.fail('No output'), stderr: text => { stderr += text; } },
      { async submit(batch) {
        observed = batch;
        return { accepted: true };
      } });
    assert.equal(code, expectedCode);
    assert.deepEqual(observed!.events.map(event => event.type), [expectedEvent]);
    assert.equal(observed!.records.some(item => item.kind === 'qualified-view'), false);
    assert.equal((observed!.records.find(item => item.kind === 'command-outcome')!.value as { status: string }).status,
      expectedEvent.slice('command-'.length));
    assert.equal(stderr.includes('\x1b'), false);
  }
});

for (const queued of [false, true]) {
  test(`terminal EOF while busy leaves input paused and drains accepted commands (queued=${queued})`, { timeout: 30000 }, async () => {
    const input = Object.assign(new PassThrough(), { isTTY: true });
    const batches: ObservationBatch[] = [];
    let started = false, afterEof = false, promptsAfterEof = 0;
    try {
      const code = await runCli(['shell', '--project', config], {
        cwd: process.cwd(), checkout: process.cwd(), input, stderr: () => {},
        stdout: text => {
          if (afterEof && text.includes('postcode> ')) promptsAfterEof++;
          if (!started && text.includes('postcode> ')) {
            started = true;
            setImmediate(() => {
              input.write('modules\n');
              if (queued) input.write('help\n\n');
              input.write('\x04'); // Close readline without ending the underlying TTY-like stream.
              afterEof = true;
            });
          }
        },
        sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } },
      });
      assert.equal(code, 0);
      assert.equal(batches.length, queued ? 2 : 1);
      assert.ok(batches[0]!.events.some(event => event.type === 'view-produced'));
      assert.equal(promptsAfterEof, 0);
      assert.equal(input.isPaused(), true);
    } finally { input.destroy(); }
  });
}
