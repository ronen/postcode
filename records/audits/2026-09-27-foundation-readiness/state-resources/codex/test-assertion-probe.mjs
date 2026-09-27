import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root = path.dirname(new URL(import.meta.url).pathname);
const checkout = path.join(root, 'checkout');
const edits = [
  ['session-inputs.test.js', "assert.equal(batch.records.some(record => record.kind === 'qualified-view'), after);"],
  ['shell.test.js', 'assert.equal(batch.command, 1);'],
];
const copies = [];
for (const [name, target] of edits) {
  const original = fs.readFileSync(path.join(checkout, '_build/test', name), 'utf8');
  assert.equal(original.split(target).length, 2);
  const filename = path.join(checkout, '_build/test', 'audit-mutated-' + name.replace('.test.js', '.probe.js'));
  fs.writeFileSync(filename, original.replace(target, "assert.fail('AUDIT: this assertion must fail');"));
  copies.push(filename);
}
const run = spawnSync(process.execPath, ['--test', '--test-name-pattern=publication observes invalidation|idle Ctrl-C', ...copies],
  { cwd: checkout, encoding: 'utf8', timeout: 45000 });
fs.writeFileSync(path.join(root, 'test-assertion-probe.log'), run.stdout + run.stderr);
assert.ifError(run.error);
assert.equal(run.status, 0, 'The baseline defect is that deliberately failing assertions are swallowed.');
console.log(JSON.stringify({ deliberateAssertionFailures: 2, exitStatus: run.status, edits }, null, 2));
