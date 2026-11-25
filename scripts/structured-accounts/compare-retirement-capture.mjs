/** Exact controlled comparison with narrowly checked retirement differences.
 * node scripts/structured-accounts/compare-retirement-capture.mjs BASELINE.json.gz AFTER.json
 * No identity, runtime, evidence, support or relationship normalization.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
const read = file => JSON.parse(file.endsWith('.gz') ? gunzipSync(readFileSync(file)).toString() : readFileSync(file, 'utf8'));
const [beforePath, afterPath] = process.argv.slice(2);
assert.ok(beforePath && afterPath, 'Supply the committed baseline and new capture');
const before = read(beforePath), after = read(afterPath);
assert.equal(process.versions.node, '26.11.0', 'Use the baseline runtime; do not erase runtime or derived input identity');
const expected = structuredClone(before), counts = {};
const count = name => { counts[name] = (counts[name] ?? 0) + 1; };
const visible = value => value.replace(/[\u0000-\u001f\u007f]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
const decode = value => value.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
assert.equal(after.steps.length, before.steps.length);
for (const [i, step] of expected.steps.entries()) {
  const actual = after.steps[i];
  assert.equal(actual.label, step.label);
  // Only fields at the application envelope root; nested support is never omitted.
  for (const key of ['bindings', 'answerReference', 'referenceLifetime', 'referenceNotice']) {
    if (Object.hasOwn(step.result, key)) {
      assert.ok(!Object.hasOwn(actual.result, key), `${step.label}: retired ${key}`);
      delete step.result[key]; count(key);
    }
  }
  for (const candidate of step.result.resolution?.candidates ?? []) {
    if (candidate.reference !== candidate.id) {
      const match = /^(module|group|investigram)-([a-f0-9]{8,64})$/.exec(candidate.reference);
      assert.ok(match && candidate.id.split(':').at(-1).startsWith(match[2]), 'Replace only an alias for this exact candidate');
      candidate.reference = candidate.id; count('candidate.reference → own precise ID');
    }
  }
  if (!step.view) continue;
  assert.equal(actual.view.alternatives.length, step.view.alternatives.length);
  for (const [j, alternative] of step.view.alternatives.entries()) {
    const current = actual.view.alternatives[j];
    assert.equal(current.diagrams.length, alternative.diagrams.length);
    // Derive disclosure from the BASELINE's unchanged per-alternative structured input.
    const disclosure = [...new Set(alternative.qualifications.flatMap(group => [
      ...group.statements.map(statement => `${group.label}: ${statement}`),
      ...(group.owner?.statements.map(statement => `${group.label} — owner: ${statement}`) ?? []),
    ]))].map(visible);
    assert.ok(disclosure.some(statement => statement.includes('interpretation')), 'Controlled fixture must disclose interpretation');
    for (const [k, diagram] of alternative.diagrams.entries()) {
      const rendered = current.diagrams[k];
      assert.equal(diagram.method, 'postcode/state-transition-diagram@7');
      assert.equal(rendered.method, 'postcode/state-transition-diagram@8');
      assert.equal(rendered.text, diagram.text + '\nQualifications of this alternative\n' + disclosure.join('\n'));
      const oldBox = /viewBox="0 0 (\d+) (\d+)"/.exec(diagram.svg), newBox = /viewBox="0 0 (\d+) (\d+)"/.exec(rendered.svg);
      assert.ok(oldBox && newBox); assert.equal(newBox[1], oldBox[1]); assert.ok(Number(newBox[2]) > Number(oldBox[2]));
      const start = rendered.svg.indexOf('<text x="20"');
      assert.ok(start > 0, 'Standalone SVG has a visible disclosure footer');
      const graph = rendered.svg.slice(0, start).replace(newBox[0], oldBox[0]) + '</svg>';
      assert.equal(graph, diagram.svg, 'Existing nodes, labels, edges and entry must be unchanged');
      const footer = rendered.svg.slice(start, -'</svg>'.length);
      const lines = [...footer.matchAll(/<text x="20" y="(\d+)" style="[^"]+">([^<]*)<\/text>/g)];
      assert.equal(lines.map(match => match[0]).join(''), footer, 'Only visible text is added');
      assert.equal(decode(lines[0][2]), 'Qualifications of this alternative');
      assert.equal(lines.slice(1).map(match => decode(match[2])).join(''), disclosure.join(''), 'SVG preserves all statements of its own alternative');
      let previousY = Number(oldBox[2]);
      for (const line of lines) {
        assert.ok(Number(line[1]) > previousY && Number(line[1]) < Number(newBox[2]), 'Disclosure lines are distinct and within the canvas');
        previousY = Number(line[1]);
      }
      diagram.method = rendered.method; diagram.text = rendered.text; diagram.svg = rendered.svg;
      count('qualified standalone diagram');
    }
  }
}
assert.deepEqual(after, expected, 'Unexplained capture difference (IDs, targets, support, qualifications, ordering and runtime are exact)');
console.log(JSON.stringify({ runtime: process.versions.node, steps: before.steps.length, intentionalDifferences: counts, result: 'exact equality after checked differences' }, null, 2));
