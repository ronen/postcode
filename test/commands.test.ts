import assert from 'node:assert/strict';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { test } from 'node:test';
import { commandWords, parseCommand } from '../src/lib/commands.js';
import { runCli } from '../src/lib/cli.js';
import type { ObservationBatch } from '../src/lib/observations.js';
import { interactionDriver, invokeCli } from './cli-helpers.js';

test('strict option grammar applies before help in both interfaces', () => {
  for (const interactive of [false, true]) {
    for (const args of [
      ['--unknown', '--help'], ['--help', '--unknown'], ['--project'],
      ['--project', '--help'], ['--help', '--project='], ['--json=false', '--help'],
      ['--project=a', '--project=b', '--help'], ['--project', '-file'],
      ['inspect', '--unknown'], ['-j'],
    ]) assert.equal(parseCommand(args, '.', interactive).kind, 'error', JSON.stringify({ args, interactive }));
    for (const flag of ['-h', '--help']) {
      assert.equal(parseCommand(['unknown-lens', 'extra', flag], '.', interactive).kind, 'help');
    }
    const repeated = parseCommand(['inspect', 'name', '--json', '--json', '--source-detail', '--source-detail'], '.', interactive);
    assert.equal(repeated.kind, 'view');
    if (repeated.kind === 'view') assert.deepEqual(repeated.request.presentation, { format: 'json', sourceDetail: true });
    for (const name of ['--help', '--json', '-h', '@module-literal']) {
      const result = parseCommand(commandWords(`inspect -- '${name}'`), '.', interactive);
      assert.equal(result.kind, 'view');
      if (result.kind === 'view') { assert.equal(result.request.selector, name); assert.equal(result.request.reference, undefined); }
    }
  }
  for (const value of ['a b.json', '-config.json']) {
    const args = [`--project=${value}`, 'modules'];
    const result = parseCommand(args, '/tmp');
    assert.equal(result.kind, 'view');
    if (result.kind === 'view') assert.equal(result.configPath, path.resolve('/tmp', value));
    assert.equal(parseCommand([...args, '--help'], '/tmp', true).kind, 'error');
  }
  assert.deepEqual(commandWords('inspect "a b"'), ['inspect', 'a b']);
  assert.equal(parseCommand(commandWords('inspect "--unknown"'), '.').kind, 'error');
});

test('one-shot scanner errors and help produce no observations; inline project produces a view', async () => {
  for (const args of [['--help', '--unknown'], ['--help', '--project='], ['--help', '--project=a', '--project=b']]) {
    const result = await invokeCli(args);
    assert.equal(result.exit, 2); assert.match(result.stderr, /Usage error:/);
    assert.equal(result.stdout, ''); assert.equal(result.batches.length, 0);
  }
  const help = await invokeCli(['unknown-lens', '--help']);
  assert.equal(help.exit, 0); assert.match(help.stdout, /Usage:/); assert.equal(help.batches.length, 0);
  const result = await invokeCli([`--project=${path.resolve('fixtures/exports/tsconfig.json')}`, '--json', '--json']);
  assert.equal(result.exit, 0); assert.equal(result.batches.length, 1);
  assert.equal(result.batches[0]!.records.find(item => item.kind === 'rendered-output')!.value, result.stdout);
});

test('ambiguous project diagnostics give a readable hint without introducing terminal structure', async () => {
  const result = await invokeCli(['--project', '-x']);
  assert.equal(result.exit, 2); assert.equal(result.stdout, ''); assert.equal(result.batches.length, 0);
  assert.match(result.stderr, /ambiguous\. Did you forget/);
  assert.match(result.stderr, /To specify an option argument starting with a dash use '--project=-XYZ'\./);
  assert.doesNotMatch(result.stderr, /\\u000a/);
  assert.equal(result.stderr.trimEnd().split('\n').length, 1);
  const unsafe = await invokeCli(['--bad\noption\t\u001b\u202e']);
  assert.equal(unsafe.exit, 2);
  assert.equal(unsafe.stderr.trimEnd().split('\n').length, 1);
  assert.doesNotMatch(unsafe.stderr, /[\t\u001b\u202e]/);
  assert.match(unsafe.stderr, /\\u0009/);
  assert.match(unsafe.stderr, /\\u001b/);
  assert.match(unsafe.stderr, /\\u202e/);
});

test('shell records scanner refusals and then accepts a quoted literal selector', { timeout: 30000 }, async () => {
  const input = Object.assign(new PassThrough(), { isTTY: true });
  const driver = interactionDriver(() => input.end());
  const lines = ['modules --project -x', 'modules --help --unknown', 'modules --project=x --help', 'inspect --json --json -- "@literal"'];
  const batches: ObservationBatch[] = [];
  let started = false, errors = '';
  const exit = await runCli(['shell', `--project=${path.resolve('fixtures/exports/tsconfig.json')}`], {
    cwd: process.cwd(), checkout: process.cwd(), input,
    stdout: text => { if (!started && text.includes('postcode> ')) { started = true; driver.run(() => input.write(lines[0] + '\n')); } },
    stderr: text => { errors += text; },
    sink: { async submit(batch) {
      batches.push(batch);
      driver.run(() => { const next = lines[batches.length]; if (next) input.write(next + '\n'); else input.end(); });
      return { accepted: true };
    } },
  });
  driver.verify(); assert.equal(exit, 0); assert.equal(batches.length, 4);
  for (const batch of batches.slice(0, 3)) {
    assert.deepEqual(batch.events.map(event => event.type), ['command-refused']);
    assert.equal(batch.records.some(item => item.kind === 'qualified-view'), false);
  }
  assert.match(errors, /Unknown option/); assert.match(errors, /keeps its opened project/);
  assert.match(errors, /ambiguous\. Did you forget/);
  assert.match(errors, /To specify an option argument starting with a dash use '--project=-XYZ'\./);
  assert.doesNotMatch(errors, /\\u000a/);
  const view = batches[3]!.records.find(item => item.kind === 'qualified-view')!.value as { projection: { selection: { matches: number } } };
  assert.equal(view.projection.selection.matches, 0);
});
