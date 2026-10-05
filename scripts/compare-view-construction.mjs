import assert from 'node:assert/strict';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
// Checkpoint-specific @26 → @27 mechanical comparison; no broad identity normalization.
// Build both revisions, then pass BEFORE_BUILD AFTER_BUILD REPORT from the checkout root.
const [before, now, reportPath] = process.argv.slice(2);
if (!before || !now || !reportPath) throw new Error('Expected two builds and a report path');
const root = process.cwd();
const load = (base, name) => import(pathToFileURL(path.resolve(base, 'src/lib', name + '.js')).href);
const { openTypeScriptProject } = await load(now, 'typescript/project');
const { MemoryProgramRecordStore } = await load(now, 'memory-store');
const { evaluateModules } = await load(now, 'evaluation');
const { moduleStandardExpansions } = await load(now, 'records');
const { modules, inspect } = await load(now, 'projections');
const { evaluateOrganization } = await load(now, 'organization/evaluate');
const { organization, inspectOrganization } = await load(now, 'organization/projections');
const { evaluateDependencies } = await load(now, 'dependencies/evaluate');
const { evaluateDependencyOrganization } = await load(now, 'dependencies/organization');
const { dependencyStructure, dependencyChildren, dependencyParents } = await load(now, 'dependencies/projections');
const { recordId, identityReference } = await load(now, 'identity');
const { artifactClassificationComplete } = await load(now, 'organization/content');
const { sourceDisclosure } = await load(now, 'source-disclosure');
const { sourceDisclosure: oldDisclosure } = await load(before, 'source-disclosure');
const pairs = {};
for (const [family, file, create, render] of [ ['module', 'presentation', 'createView', 'renderUnicode'], ['organization', 'organization/presentation', 'createOrganizationView', 'renderOrganizationView'], ['dependency', 'dependencies/presentation', 'createDependencyView', 'renderDependencyView'] ]) {
  pairs[family] = { current: await load(now, file), baseline: await load(before, file), create, render };
}
const report = { compared: 0, byFamily: {}, incompleteOrganization: 0, changedViewIds: 0, sourceClassifications: 0, fixtures: [] };
function expectedOldIds(value, presentation) {
  const result = structuredClone(value);
  const change = view => {
    const kind = view.schema === 'postcode-view/1-experimental' ? 'view' : view.schema === 'postcode-organization-view/1-experimental' ? 'organization-view' : 'dependency-view';
    const key = { projection: identityReference(view.projection.session, view.projection.id), presentation, method: 'postcode/presentation@26' };
    const expected = recordId(view.projection.session, kind, key);
    assert.notEqual(view.id, expected);
    view.id = expected; report.changedViewIds++;
    if (view.moduleDetail) change(view.moduleDetail);
  };
  change(result); return result;
}
function compare(store, family, projection, sourceAllowed = false) {
  const pair = pairs[family];
  const calls = [];
  const tracked = new Proxy(store, { get(target, name) {
    if (name === 'entityIds') return (ids, kind) => { calls.push([kind, [...ids]]); return target.entityIds(ids, kind); };
    const value = target[name]; return typeof value === 'function' ? value.bind(target) : value;
  } });
  for (const format of ['unicode', 'json']) for (const sourceDetail of sourceAllowed ? [false, true] : [false]) {
    const presentation = { format, sourceDetail };
    const old = pair.baseline[pair.create](tracked, projection, presentation);
    const expectedCalls = calls.splice(0);
    const current = pair.current[pair.create](tracked, projection, presentation);
    assert.deepEqual(calls.splice(0), expectedCalls, 'reference allocation sequence');
    const adjusted = expectedOldIds(current, presentation);
    assert.deepEqual(adjusted, old, `${family} full view ${projection.lens} ${format} source=${sourceDetail}`);
    assert.equal(JSON.stringify(adjusted, null, 2), JSON.stringify(old, null, 2));
    assert.deepEqual(sourceDisclosure(current), oldDisclosure(old)); report.sourceClassifications++;
    if (format === 'unicode') {
      let expected = pair.baseline[pair.render](old);
      if (family === 'organization' && !artifactClassificationComplete(old.evaluations.repository, old.evaluations.placement, 'materialized')) {
        report.incompleteOrganization++;
        expected = expected.replace(/Other artifacts: (\d+) unanalyzed · (\d+) opaque boundaries/g, 'Other captured artifacts: $1 · $2 opaque boundaries (classification incomplete)')
          .replace(/(\d+) unanalyzed artifacts/g, '$1 other captured artifacts (classification incomplete)')
          .replace('Module presence describes the selected configured project; other artifacts remain unanalyzed.', 'Module presence describes the selected configured project. Other captured artifacts have no module or documentation association established in the supplied information; classification is incomplete.');
      }
      assert.equal(pair.current[pair.render](current), expected, `${family} exact Unicode ${projection.lens} source=${sourceDetail}`);
    }
    report.compared++; report.byFamily[family] = (report.byFamily[family] ?? 0) + 1;
  }
}
for (const fixture of ['empty', 'exports', 'diagnostics', 'module-population', 'organization', 'dependency-journey', 'dependency-contract', 'dependency-context/classic', 'dependency-context/mixed', 'dependency-context/preserve']) {
  const opened = await openTypeScriptProject({ configPath: path.join(root, 'fixtures', fixture, 'tsconfig.json') });
  assert.equal(opened.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const evaluation = evaluateModules(store, opened.analysis, moduleStandardExpansions);
  compare(store, 'module', modules(store, evaluation));
  for (const id of [...evaluation.modules.slice(0, 2), 'missing-selector']) compare(store, 'module', inspect(store, evaluation, id), true);
  const org = evaluateOrganization(store, evaluation);
  compare(store, 'organization', organization(store, org));
  compare(store, 'organization', organization(store, org, 'repository'));
  for (const id of [...org.groups.slice(0, 1), ...evaluation.modules.slice(0, 1), 'missing-selector']) compare(store, 'organization', inspectOrganization(store, org, id), true);
  const partial = { ...evaluation, id: recordId(evaluation.session, 'evaluation', 'comparison-partial'), modules: evaluation.modules.slice(0, 1), execution: 'stopped', materialization: 'partial', reason: 'Synthetic bounded provider outcome.' };
  store.put([partial]); const partialOrg = evaluateOrganization(store, partial);
  compare(store, 'organization', organization(store, partialOrg, 'repository'));
  if (partialOrg.groups.length) compare(store, 'organization', inspectOrganization(store, partialOrg, partialOrg.groups[0]), true);
  const deps = evaluateDependencies(store, opened.analysis, moduleStandardExpansions);
  const depOrg = evaluateOrganization(store, store.get(deps.moduleEvaluation));
  const expansion = evaluateDependencyOrganization(store, deps, depOrg);
  compare(store, 'dependency', dependencyStructure(store, deps, expansion.id), true);
  for (const id of [...store.get(deps.moduleEvaluation).modules.slice(0, 2), 'missing-selector']) {
    compare(store, 'dependency', dependencyChildren(store, deps, id, false, expansion.id), true);
    compare(store, 'dependency', dependencyParents(store, deps, id, false, expansion.id), true);
  }
  // Reconstruct earlier selections after dependency accumulation.
  compare(store, 'module', modules(store, evaluation));
  report.fixtures.push(fixture);
}
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`${report.compared} mechanical Views matched the baseline; see ${reportPath}.`);
