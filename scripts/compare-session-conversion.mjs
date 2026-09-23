import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Controlled before/after verification for the one-shot session conversion.
// Build each revision separately, then pass BEFORE_BUILD AFTER_BUILD REPORT.
const [beforeBuild, afterBuild, report] = process.argv.slice(2);
if (!beforeBuild || !afterBuild || !report) throw new Error('Expected two builds and a report path');
const before = await import(pathToFileURL(path.resolve(beforeBuild, 'src/lib/cli.js')));
const after = await import(pathToFileURL(path.resolve(afterBuild, 'src/lib/cli.js')));
const rows = [];
async function invoke(implementation, args, config) {
  let stdout = '', stderr = ''; const batches = [];
  const exit = await implementation.runCli([...args, '--project', config], {
    cwd: process.cwd(), checkout: process.cwd(), stdout: value => { stdout += value; }, stderr: value => { stderr += value; },
    sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } },
  });
  assert.equal(exit, 0, stderr);
  const view = batches[0].records.find(record => record.kind === 'qualified-view').value;
  assert.equal(batches[0].records.find(record => record.kind === 'rendered-output').value, stdout);
  return { view, stdout, batches };
}
function comparable(value) {
  if (typeof value === 'string') return value.replace(/view\/[01]-experimental/g, 'view/converted-experimental')
    .replaceAll('snapshot-scoped Entity IDs', 'session-local Entity IDs');
  if (Array.isArray(value)) return value.map(comparable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['navigation', 'dependencyNavigation', 'expectedSnapshot', 'reference'].includes(key))
    .map(([key, item]) => [key === 'snapshot' ? 'session' : key, comparable(item)]));
  return value;
}
// Containment references and organization evidence are supporting collections, historically ordered by
// snapshot-derived hashes. Compare its membership after binding other references;
// preserve every evidence field/reference and all presentation row, population and relationship ordering.
// Establish a bijection, not a blanket redaction: every repeated relationship
// reference must keep pointing to the same paired record in the other view.
function compareViews(left, right, beforeText, afterText) {
  const forward = new Map(), backward = new Map(), referenceSets = [], evidenceSets = [];
  const reference = value => typeof value === 'string' && /^(?:snapshot:[a-f0-9]{64}|session:[a-f0-9-]{36}|(?:module|group)-[a-f0-9]{8,64})(?::|$)/.test(value);
  function visit(a, b, location) {
    if (reference(a) || reference(b)) {
      assert.ok(reference(a) && reference(b), location);
      if (forward.has(a)) assert.equal(b, forward.get(a), location);
      if (backward.has(b)) assert.equal(a, backward.get(b), location);
      forward.set(a, b); backward.set(b, a); return;
    }
    if (Array.isArray(a)) {
      assert.ok(Array.isArray(b), location); assert.equal(a.length, b.length, location);
      if (location.endsWith('.organizationEvidence')) { evidenceSets.push([a, b, location]); return; }
      if (location.endsWith('.containment')) { referenceSets.push([a, b, location]); return; }
      a.forEach((item, i) => visit(item, b[i], `${location}[${i}]`)); return;
    }
    if (a && typeof a === 'object') {
      assert.ok(b && typeof b === 'object', location);
      assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), location);
      for (const key of Object.keys(a)) visit(a[key], b[key], `${location}.${key}`);
      return;
    }
    assert.deepEqual(b, a, location);
  }
  visit(comparable(left), comparable(right), 'view');
  for (const [a, b, location] of evidenceSets) {
    const remaining = new Set(b);
    for (const record of a) {
      let matched = false;
      for (const candidate of remaining) {
        const oldForward = new Map(forward), oldBackward = new Map(backward), oldSetCount = referenceSets.length;
        try {
          visit(record, candidate, location);
          remaining.delete(candidate); matched = true; break;
        } catch (error) {
          if (!(error instanceof assert.AssertionError)) throw error;
          forward.clear(); backward.clear();
          oldForward.forEach((value, key) => forward.set(key, value));
          oldBackward.forEach((value, key) => backward.set(key, value));
          referenceSets.length = oldSetCount;
        }
      }
      assert.ok(matched, `No equivalent supporting record at ${location}: ${record.kind}`);
    }
  }
  for (const [a, b, location] of referenceSets) {
    const unmatched = new Set(b);
    for (const id of a.filter(id => forward.has(id))) {
      assert.ok(unmatched.delete(forward.get(id)), location);
    }
    const unbound = a.filter(id => !forward.has(id));
    for (const [index, id] of [...unmatched].entries()) visit(unbound[index], id, location);
  }
  if (left.presentation.format === 'unicode') {
    const normalizeOutput = (value, side) => {
      value = value.split('\nNext ·')[0].split('\nNavigation evaluates current inputs afresh.')[0]
        .split('\nEntity references belong to this session.')[0]
        .replace(/^(?:Snapshot|Session) .*$/m, 'Analysis context')
        .replaceAll('snapshot-scoped Entity IDs', 'session-local Entity IDs');
      const pairs = [...forward].map(([a, b], index) => [side === 'before' ? a : b, `REFERENCE_${index}`]);
      for (const [id, label] of pairs.sort((a, b) => b[0].length - a[0].length)) value = value.split(id).join(label);
      return value.trimEnd();
    };
    assert.equal(normalizeOutput(afterText, 'after'), normalizeOutput(beforeText, 'before'), 'Unicode semantic output');
  }
  return forward.size;
}
for (const fixture of ['dependency-journey', 'dependency-contract', 'exports']) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'postcode-conversion-'));
  try {
  cpSync(`fixtures/${fixture}`, directory, { recursive: true });
  execFileSync('git', ['init', '--quiet', directory]);
  const config = path.join(directory, 'tsconfig.json');
  const initial = await invoke(before, ['modules', '--json'], config);
  const snapshot = initial.view.projection.snapshot;
  const dependency = await invoke(before, ['dependencies', '--json'], config);
  const handle = fixture === 'dependency-journey' ? 'forward' : fixture === 'dependency-contract' ? 'requests' : 'origin';
  for (const format of [[], ['--json']]) {
    for (const command of [['modules'], ['organization', 'project'], ['organization', 'repository'], ['inspect', handle],
      ['inspect', handle, '--source-detail'], ['dependencies'], ['dependencies', '--source-detail'],
      ['children', handle, '--source-detail'], ['parents', handle, '--source-detail']]) {
      const focused = ['inspect', 'children', 'parents'].includes(command[0]);
      const scope = command[0] === 'inspect' ? snapshot : dependency.view.projection.snapshot;
      const a = await invoke(before, [...command, ...format, ...(focused ? ['--snapshot', scope] : [])], config);
      const b = await invoke(after, [...command, ...format], config);
      console.log(fixture, [...command, ...format].join(' '));
      const pairedReferences = compareViews(a.view, b.view, a.stdout, b.stdout);
      assert.equal(b.batches[0].session, b.view.projection.session);
      assert.equal(b.batches[0].command, 1);
      assert.deepEqual(b.batches[0].events.map(event => event.type), a.batches[0].events.map(event => event.type));
      rows.push({ fixture, command: [...command, ...format], pairedReferences, equivalent: true });
    }
  }
  } finally { rmSync(directory, { recursive: true, force: true }); }
}
writeFileSync(report, JSON.stringify(rows, null, 2) + '\n');
console.log(`${rows.length} semantic view comparisons passed`);
