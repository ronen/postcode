// Task verification: compare the pre-boundary delivery with the unpaged derivation + adapter.
// Usage: node scripts/compare-investigation-revisions.mjs BEFORE_BUILD AFTER_BUILD [REPORT]
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [beforePath, afterPath, reportPath] = process.argv.slice(2);
if (!beforePath || !afterPath) throw new Error('Supply before and after build directories');
const load = (root, name) => import(pathToFileURL(path.resolve(root, 'src/lib/investigation', name)).href);
const [{ InvestigationRevisions: Before }, { InvestigationRevisions: After }, { revisionPage }] = await Promise.all([
  load(beforePath, 'revisions.js'), load(afterPath, 'revisions.js'), load(afterPath, 'revision-page.js'),
]);
const accounts = [], corrections = [], origins = [];
const base = { session: 'comparison-session', method: 'comparison@1' };
function account(id, citations = [], completeCorrections = [], originName = id, inconsistencies = []) {
  const provenance = `provenance-${originName}`;
  if (!origins.some(item => item.id === provenance)) origins.push({ ...base, id: provenance, kind: 'investigation-provenance',
    request: { operation: 'clarification', subject: 'module', parameters: {} }, originatingModule: 'module', instructions: 'Fixture.',
    agent: { provider: 'test', model: 'test', origin: 'scripted', configuration: {} }, citations, completeCorrections,
    completeTargets: [], suppliedEvidence: [], summarizedEvidence: [], deliveries: [] });
  accounts.push({ ...base, id, kind: 'investigram', status: 'interpretation', prose: id, referent: { description: id, subjects: [] },
    originatingModule: 'module', provenance, evidence: [], qualifications: ['Scoped.'], associations: [], children: [], corrections: [], inconsistencies });
}
function correction(id, target, replacement, reporter = replacement) {
  corrections.push({ ...base, id, kind: 'investigram-correction', reporter, target, replacement, correctedSubjects: ['module'],
    reason: id, qualifications: ['Scoped.'], evidence: [], provenance: `provenance-${reporter}` });
}
for (const id of ['A', 'B', 'C', 'D']) account(id);
account('direct', ['A']); account('transitive', ['direct']);
account('aware', ['direct'], ['AB']); account('aware-child', [], [], 'aware'); account('through-aware', ['aware']);
account('alternate', ['aware', 'transitive']);
correction('AB', 'A', 'B'); correction('AC', 'A', 'C'); correction('BD', 'B', 'D');
for (let n = 0; n < 80; n++) account(`dense-${n}`, ['A', ...Array.from({ length: n }, (_, i) => `dense-${i}`)]);
for (let n = 0; n < 55; n++) { account(`replacement-${n}`, ['A']); correction(`cause-${n}`, 'A', `replacement-${n}`); }
for (let n = 0; n < 30; n++) account(`reporter-${n}`, [], [], `reporter-${n}`, [
  { targets: ['A', 'dense-79'], reason: `Disagreement ${n}`, evidence: ['support'], qualifications: ['Scoped.'] },
]);
const before = new Before(accounts, corrections, origins), after = new After(accounts, corrections, origins);
let comparisons = 0;
for (const account of accounts) for (const page of [1, 2, 3, 4, 9]) {
  const expected = before.status(account.id, page), actual = revisionPage(after.snapshot(account.id), page);
  assert.deepEqual(actual, expected, `${account.id}, page ${page}`);
  assert.equal(JSON.stringify(actual), JSON.stringify(expected), `Serialized field ordering: ${account.id}, page ${page}`);
  comparisons++;
}
const report = { comparisons, accounts: accounts.length, corrections: corrections.length, pages: [1, 2, 3, 4, 9],
  preserved: ['all fields and qualification', 'row and inconsistency ordering', 'serialized field ordering',
    'primary and family-primary', 'conflicts and reconsideration', 'whole-evaluation exemptions', 'paging, omissions and empty pages'],
  differences: [] };
if (reportPath) writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report)}\n`);
