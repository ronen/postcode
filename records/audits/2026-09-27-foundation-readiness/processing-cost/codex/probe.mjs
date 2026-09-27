import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openTypeScriptProject } from './build/src/lib/typescript/project.js';
import { MemoryProgramRecordStore } from './build/src/lib/memory-store.js';
import { evaluateModules } from './build/src/lib/evaluation.js';
import { evaluateDependencies } from './build/src/lib/dependencies/evaluate.js';
import { evaluateOrganization } from './build/src/lib/organization/evaluate.js';
import { evaluateDependencyOrganization } from './build/src/lib/dependencies/organization.js';
import { modules } from './build/src/lib/projections.js';
import { organization } from './build/src/lib/organization/projections.js';
import { dependencyStructure } from './build/src/lib/dependencies/projections.js';
import { createView, renderView } from './build/src/lib/presentation.js';
import { createOrganizationView } from './build/src/lib/organization/presentation.js';
import { createDependencyView } from './build/src/lib/dependencies/presentation.js';
import { moduleStandardExpansions } from './build/src/lib/records.js';
import { openSession } from './build/src/lib/session.js';
import { locate } from './build/src/lib/organization/placement.js';
const directory = path.dirname(fileURLToPath(import.meta.url));
const report = { environment: { node: process.version, platform: process.platform, arch: process.arch, cpu: os.cpus()[0].model }, cases: [] };
const output = () => writeFileSync(path.join(directory, 'measurements.json'), JSON.stringify(report, null, 2) + '\n');
const json = { format: 'json', sourceDetail: false };
const unicode = { format: 'unicode', sourceDetail: false };
function fixture(n, external = false) {
  const root = path.join(directory, 'inputs', `${external ? 'external-' : ''}${n}`);
  mkdirSync(root, { recursive: true });
  execFileSync('git', ['init', '--quiet', root]);
  writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { types: [], noLib: true, module: 'NodeNext', moduleResolution: 'NodeNext' }, include: ['src/**/*.ts'] }));
  for (let i = 0; i < n; i++) {
    const folder = path.join(root, 'src', `g${Math.floor(i / 10)}`);
    mkdirSync(folder, { recursive: true });
    const next = i + 1;
    const edge = next < n ? `import '../g${Math.floor(next / 10)}/m${next}.js';\n` : '';
    writeFileSync(path.join(folder, `m${i}.ts`), `${edge}${external && i === 0 ? "import 'outside';\n" : ''}/** Value ${i}. */\nexport const v${i} = ${i};\n`);
  }
  if (external) {
    const dependency = path.join(root, 'node_modules/outside');
    mkdirSync(dependency, { recursive: true });
    writeFileSync(path.join(dependency, 'package.json'), '{"types":"index.d.ts"}');
    writeFileSync(path.join(dependency, 'index.d.ts'), 'export interface External {}');
    writeFileSync(path.join(root, '.gitignore'), 'node_modules/\n');
  }
  return path.join(root, 'tsconfig.json');
}
function timed(fn) {
  const start = performance.now(), cpu = process.cpuUsage(), wall = Date.now();
  const value = fn();
  return { value, ms: performance.now() - start, cpuMs: Object.values(process.cpuUsage(cpu)).reduce((a,b) => a+b, 0)/1000, wallMs: Date.now() - wall };
}
function samples(fn) {
  fn();
  return Array.from({length: 3}, () => { const {value, ...t} = timed(fn); return t; });
}
function countGets(store, fn) {
  let gets = 0;
  const original = store.get;
  store.get = function(id) { gets++; return original.call(this, id); };
  try { fn(); return gets; } finally { store.get = original; }
}
const cases = process.argv.includes('--synthetic-only') ? [] : [
  ['postcode', path.resolve('tsconfig.json')],
  ['dependency-journey', path.resolve('fixtures/dependency-journey/tsconfig.json')],
];
cases.push(...[250, 500, 1000].map(n => [`generated-${n}`, fixture(n)]));
for (const [name, configPath] of cases) {
  console.log(`Starting ${name}`);
  const item = { name, configPath, stages: {}, repeated: {}, counts: {} };
  const stage = (name, fn) => { const {value, ...t} = timed(fn); item.stages[name] = t; return value; };
  const opened = stage('open', () => openTypeScriptProject({ configPath, excludedOutputDirectories: name.startsWith('generated') ? [] : [directory, path.resolve('_build'), path.resolve('_observations')] }));
  assert.equal(opened.status, 'opened');
  const actual = opened;
  assert.equal(actual.status, 'opened');
  const store = new MemoryProgramRecordStore();
  const evaluation = stage('moduleEvaluation', () => evaluateModules(store, actual.analysis, moduleStandardExpansions));
  const dependency = stage('dependencyEvaluation', () => evaluateDependencies(store, actual.analysis, moduleStandardExpansions));
  const basis = store.get(dependency.moduleEvaluation);
  const org = stage('organizationEvaluation', () => evaluateOrganization(store, basis));
  const depOrg = stage('dependencyOrganizationEvaluation', () => evaluateDependencyOrganization(store, dependency, org));
  const moduleProjection = stage('moduleProjection', () => modules(store, evaluation));
  const orgProjection = stage('organizationProjection', () => organization(store, org, 'repository'));
  const depProjection = stage('dependencyProjection', () => dependencyStructure(store, dependency, depOrg.id));
  const session = store.get(evaluation.session);
  const repository = store.get(session.repository);
  item.population = { modules: evaluation.modules.length, groups: org.groups.length, artifacts: repository.capture.evidence?.artifacts.length ?? 0, expansionClaims: moduleProjection.expansions.claims.length, expansionEvaluations: moduleProjection.evaluations.length, relationships: dependency.relationships.length, dependencyOrganizationMaterialization: depOrg.materialization };
  const tasks = {
    moduleViewJson: () => createView(store, moduleProjection, json),
    moduleViewUnicode: () => createView(store, moduleProjection, unicode),
    organizationViewUnicode: () => createOrganizationView(store, orgProjection, unicode),
    dependencyViewJson: () => createDependencyView(store, depProjection, json),
    dependencyViewUnicode: () => createDependencyView(store, depProjection, unicode),
    repeatedDependencyOrganization: () => evaluateDependencyOrganization(store, dependency, org),
    repeatedModuleEvaluation: () => evaluateModules(store, actual.analysis, moduleStandardExpansions),
  };
  for (const [name, fn] of Object.entries(tasks)) {
    item.repeated[name] = samples(fn);
    item.counts[name] = { storeGets: countGets(store, fn) };
  }
  const view = createView(store, moduleProjection, unicode);
  item.repeated.renderModuleUnicode = samples(() => renderView(view));
  item.repeated.inputValidation = samples(() => { assert.equal(actual.changed(), false); });
  if (repository.capture.status === 'available') {
    let placementComparisons = 0, artifactComparisons = 0;
    const measuredArray = (array, increment) => new Proxy(array, { get(target, property, receiver) {
      if (property === 'find') return predicate => target.find((...args) => { increment(); return predicate(...args); });
      return Reflect.get(target, property, receiver);
    } });
    const evidence = { ...repository.capture.evidence, artifacts: measuredArray(repository.capture.evidence.artifacts, () => artifactComparisons++) };
    const layout = { ...repository.layout, placements: measuredArray(repository.layout.placements, () => placementComparisons++) };
    let lookups = 0;
    for (const id of basis.modules) {
      const module = store.get(id), claim = store.get(module.claim);
      if (!claim.information.discoveryFacets.includes('project')) continue;
      const context = store.get(claim.context);
      for (const sourceId of context.evidence) {
        const source = store.get(sourceId);
        if (source.kind === 'source-evidence' && !source.resolution) { locate(source.path, evidence, layout); lookups++; }
      }
    }
    item.counts.placement = { lookups, placementComparisons, artifactComparisons };
  }
  report.cases.push(item); output();
  console.log(JSON.stringify({name, population: item.population, stages: item.stages, counts: item.counts}));
}
// Observe the real session coordinator without changing source or private state.
for (const external of [false, true]) {
  const configPath = fixture(100, external);
  const opened = openSession({configPath}); assert.equal(opened.status, 'opened');
  const original = MemoryProgramRecordStore.prototype.put;
  let current;
  MemoryProgramRecordStore.prototype.put = function(records) {
    for (const record of records) current.puts[record.kind] = (current.puts[record.kind] ?? 0) + 1;
    const t = timed(() => original.call(this, records)); current.putMs += t.ms;
  };
  const runs = [];
  try {
    let first;
    for (let i=0; i<3; i++) {
      current = { puts: {}, putMs: 0 };
      const {value, ...t} = timed(() => opened.session.execute({lens: 'dependencies', selector: null, presentation: unicode}));
      if (first) assert.deepEqual(value, first); else first = value;
      runs.push({...current, ...t, organization: value.view.evaluations.organization});
    }
  } finally { MemoryProgramRecordStore.prototype.put = original; opened.session.close(); }
  (report.sessionReuse ??= []).push({external, runs}); output();
}
