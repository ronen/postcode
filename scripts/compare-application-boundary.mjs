// Current extraction oracle: stable runCli entry, full serialized reports and output.
// --method-split is ONLY for the separately recorded original -> provenance checkpoint.
// It permits a bijection of same-kind precise references, not missing fields or reordered data.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
import { comparisonFixture, buildIdentity, commands } from './comparison-fixtures.mjs';
import { normalizeSession } from '../_build/test/comparison.js';
const [beforeBuild, afterBuild, report, mode] = process.argv.slice(2);
if (!report || mode && mode !== '--method-split') throw Error('BEFORE_BUILD AFTER_BUILD REPORT [--method-split]');
const split = mode === '--method-split';
const before = await import(pathToFileURL(path.resolve(beforeBuild, 'src/lib/cli.js')));
const after = await import(pathToFileURL(path.resolve(afterBuild, 'src/lib/cli.js')));
const identities = { before: buildIdentity(beforeBuild), after: buildIdentity(afterBuild) };
const clientMethods = ['postcode/module-exports-presentation@5', 'postcode/investigation-presentation@23', 'postcode/presentation@38'];
const methodChange = value => value === 'postcode/observed-inputs@6' ? 'postcode/observed-inputs@7'
  : value === 'postcode/program-records@22' ? 'postcode/program-records@23' : value;
async function invoke(api, args, configPath) {
  let stdout = '', stderr = ''; const batches = [];
  const exit = await api.runCli([...args, '--project', configPath], { cwd: process.cwd(), checkout: process.cwd(),
    stdout: text => { stdout += text; }, stderr: text => { stderr += text; },
    configureInvestigator: async () => ({ kind: 'disabled' }),
    sink: { async submit(batch) { batches.push(batch); return { accepted: true }; } } });
  assert.equal(batches.length, 1, stderr);
  const batch = batches[0];
  const occurrence = new Map(batch.records.map((record, i) => [record.id, `artifact:${i}`]));
  batch.events.forEach((event, i) => occurrence.set(event.id, `event:${i}`));
  // Occurrence correlation is not semantic identity; preserve repeated links.
  const request = batch.records.find(record => record.kind === 'request')?.value;
  if (request?.id) occurrence.set(request.id, 'request:current');
  const visit = value => typeof value === 'string' ? occurrence.get(value) ?? value
    : Array.isArray(value) ? value.map(visit) : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, child]) => [key, visit(child)])) : value;
  const view = batch.records.find(record => record.kind === 'qualified-view')?.value;
  const jsonOutput = stdout.startsWith('{') ? JSON.parse(stdout) : null;
  if (jsonOutput) assert.equal(stdout, JSON.stringify(jsonOutput, null, view && view.schema !== 'postcode-investigation-view/1-experimental' ? 2 : undefined) + '\n', 'exact output layout');
  const records = batch.records.map(record => {
    if (record.kind !== 'rendered-output') return record;
    assert.equal(record.value, stdout, 'recorded output is actual output');
    return { ...record, value: { checkedAgainstStdout: true } };
  });
  // The batch UUID and event timestamps are occurrence metadata, retained separately.
  return { data: normalizeSession(visit({ exit, stderr, session: batch.session, command: batch.command,
    formatVersion: batch.formatVersion, records, events: batch.events.map(({ at, ...event }) => event) })),
    stdout: jsonOutput ? JSON.stringify(normalizeSession(visit(jsonOutput))) : normalizeSession(stdout, batch.session), view, occurrence: { id: batch.id, events: batch.events.map(e => ({ id: e.id, at: e.at })) } };
}
const results = [];
await comparisonFixture('dependency-journey', async (root, selector) => {
  for (const args of [...commands(selector), ['inspect', 'does-not-exist', '--json'], ['usage', '--json'], ['summarize', selector, '--json']]) {
    const a = await invoke(before, args, path.join(root, 'tsconfig.json'));
    const b = await invoke(after, args, path.join(root, 'tsconfig.json'));
    const forward = new Map(), backward = new Map(); const rendered = [];
    const referenceFields = new Set(['id','session','context','inputs','scope','evidence','basis','claim','claims','contexts','evaluation','evaluations','moduleEvaluation','moduleEvaluations','dependencyEvaluation','organizationEvaluation','projection','moduleProjection','mechanical','subject','subjects','target','source','parent','child','modules','groups','records','prerequisites','support','account','attempt','entityId','reference','answerReference','selected']);
    function visit(left, right, field = '', location = '') {
      if (field === 'methods' && split) {
        const used = a.view ? a.view.schema === 'postcode-investigation-view/1-experimental' ? [clientMethods[1]]
          : a.view.schema === 'postcode-module-exports-view/1-experimental' ? [clientMethods[0]]
            : [clientMethods[2], ...(a.view.investigations ? [clientMethods[1]] : [])] : [];
        assert.deepEqual(right, [...left.filter(x => !clientMethods.includes(x)).map(methodChange), ...used], location); return;
      }
      if (typeof left === 'string' && (field === 'value' && location.includes('.records.') || field === 'stdout') && (left.startsWith('{') || left.includes('\n'))) {
        rendered.push([left, right]); return;
      }
      if (typeof left === 'string' && referenceFields.has(field)) {
        const match = left.match(/^session:(?:normalized|[a-f0-9-]{36})(?::([^:]+):[a-f0-9]{64})?$/);
        if (match) {
          const other = right.match(/^session:(?:normalized|[a-f0-9-]{36})(?::([^:]+):[a-f0-9]{64})?$/);
          assert.ok(other, location); assert.equal(other[1], match[1], location);
          if (!split && match[1]) assert.equal(left.slice(left.lastIndexOf(':')), right.slice(right.lastIndexOf(':')), location);
          if (forward.has(left)) assert.equal(forward.get(left), right, location);
          if (backward.has(right)) assert.equal(backward.get(right), left, location);
          forward.set(left, right); backward.set(right, left); return;
        }
        if (/^(?:module|group|investigram|answer)-[a-f0-9]{8,64}$/.test(left)) {
          assert.equal(left.split('-')[0], right.split('-')[0], location);
          if (!split) assert.equal(right, left, location);
          if (forward.has(left)) assert.equal(forward.get(left), right, location);
          if (backward.has(right)) assert.equal(backward.get(right), left, location);
          forward.set(left, right); backward.set(right, left); return;
        }
      }
      if (Array.isArray(left)) {
        assert.ok(Array.isArray(right), location); assert.equal(right.length, left.length, location);
        left.forEach((x, i) => visit(x, right[i], field, `${location}.${i}`)); return;
      }
      if (left && typeof left === 'object') {
        assert.deepEqual(Object.keys(right), Object.keys(left), location);
        for (const key of Object.keys(left)) visit(left[key], right[key], key, `${location}.${key}`); return;
      }
      assert.deepEqual(right, split && field === 'method' ? methodChange(left) : left, location);
    }
    visit(a.data, b.data);
    // JSON layout is checked by the shared policy; compare its complete content too.
    for (const [left, right] of [...rendered, [a.stdout, b.stdout]]) {
      if (left.startsWith('{')) {
        visit(JSON.parse(left), JSON.parse(right));
      } else {
        // Only references established by paired structured fields may change in text.
        let expected = left;
        for (const [from, to] of [...forward].sort(([x],[y]) => y.length-x.length)) expected = expected.split(from).join(to);
        assert.equal(right, expected, 'complete Unicode output');
      }
    }
    results.push({ args, exit: a.data.exit, references: [...forward], beforeOccurrence: a.occurrence, afterOccurrence: b.occurrence, equal: true });
    console.log(args.join(' '), 'equal');
  }
});
assert.deepEqual({ before: buildIdentity(beforeBuild), after: buildIdentity(afterBuild) }, identities);
writeFileSync(report, JSON.stringify({ mode: mode ?? 'extraction', ...identities, results }, null, 2) + '\n');
