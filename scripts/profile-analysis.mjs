// Development-only profiler. Instrument a disposable build copy; never target inputs.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Optional source build lets the same harness instrument an older compiled revision.
const destination = path.resolve(process.argv[2] ?? path.join(root, '_build/profile'));
const source = path.resolve(process.argv[3] ?? path.join(root, '_build'));
if (destination === source) throw Error('The instrumented copy must not replace the source build');
mkdirSync(destination, { recursive: true });
cpSync(path.join(source, 'src'), path.join(destination, 'src'), { recursive: true });
const groups = {
  'typescript/project': ['openTypeScriptProject'],
  'repository/capture': ['captureRepository'], 'repository/layout': ['deriveLayout'],
  'typescript/expansions': ['prepareExpansions'], 'typescript/composition': ['prepareComposition'],
  'typescript/dependencies': ['prepareDependencies'],
  evaluation: ['evaluateModules', 'recordModuleEvaluation'],
  'dependencies/evaluate': ['evaluateDependencies'],
  'organization/evaluate': ['evaluateOrganization'],
  'dependencies/organization': ['evaluateDependencyOrganization'],
  projections: ['modules', 'inspect'],
  'organization/projections': ['organization', 'inspectOrganization'],
  'dependencies/projections': ['dependencyStructure', 'dependencyChildren', 'dependencyParents'],
  presentation: ['createView', 'renderView'],
  'organization/presentation': ['createOrganizationView', 'renderOrganizationView'],
  'dependencies/presentation': ['createDependencyView', 'renderDependencyView'],
  observations: ['observationBatch'],
};
for (const [file, names] of Object.entries(groups)) {
  const filename = path.join(destination, 'src/lib', file + '.js');
  let code = readFileSync(filename, 'utf8');
  for (const name of names) {
    const asynchronous = code.includes(`export async function ${name}(`);
    const declaration = `export ${asynchronous ? 'async ' : ''}function ${name}(`;
    if (code.split(declaration).length !== 2) throw Error(`Missing unique boundary: ${name}`);
    code = code.replace(declaration, `${asynchronous ? 'async ' : ''}function __profile_${name}(`);
    code += `\nexport function ${name}(...args) { return globalThis.__analysisMeasure(${JSON.stringify(name)}, () => __profile_${name}(...args)); }\n`;
  }
  writeFileSync(filename, code);
}
// Preparation returns materializers; measure those separately, including evidence construction.
const project = path.join(destination, 'src/lib/typescript/project.js');
let code = readFileSync(project, 'utf8');
for (const name of ['Expansions', 'Composition', 'Dependencies']) {
  const variable = `prepared${name}`;
  const scope = code.includes(`${variable}?.(session, evidence)`) ? 'session' : 'snapshot';
  const pattern = new RegExp(`${variable}\\?\\.\\(${scope}, evidence\\)`, 'g');
  if ((code.match(pattern) ?? []).length !== 1) throw Error(`Missing materializer: ${variable}`);
  code = code.replace(pattern, `${variable} ? globalThis.__analysisMeasure('materialize${name}', () => ${variable}(${scope}, evidence)) : undefined`);
}
writeFileSync(project, code);
console.log(destination);

// The CLI now isolates compiler work in a worker. Keep worker timings separate
// from parent wall-clock timings; do not add overlapping inclusive intervals.
const workerFile = path.join(destination, 'src/lib/session-worker.js');
if (readFileSync(workerFile, 'utf8').includes('parentPort')) {
  const instrumentation = `import { parentPort as profilePort } from 'node:worker_threads';
const profileStack = [];
globalThis.__analysisMeasure = (name, operation) => {
  const started = performance.now(), frame = { child: 0 }; profileStack.push(frame);
  const finish = () => {
    const inclusiveMs = performance.now() - started;
    profileStack.pop(); if (profileStack.length) profileStack.at(-1).child += inclusiveMs;
    profilePort.postMessage({ type: 'profile-sample', name, inclusiveMs, exclusiveMs: inclusiveMs - frame.child });
  };
  try {
    const result = operation();
    if (result && typeof result.then === 'function') return result.finally(finish);
    finish(); return result;
  } catch (error) { finish(); throw error; }
};\n`;
  writeFileSync(workerFile, instrumentation + readFileSync(workerFile, 'utf8'));
  const parentFile = path.join(destination, 'src/lib/interactive-session.js');
  let parentCode = readFileSync(parentFile, 'utf8');
  const listener = "worker.on('message', (message) => {";
  if (!parentCode.includes(listener)) throw new Error('Missing worker profiling boundary');
  parentCode = parentCode.replace(listener, listener + `
    if (message.type === 'profile-sample') {
      const stages = globalThis.__analysisWorkerStages ??= {};
      const entry = stages[message.name] ??= { calls: 0, inclusiveMs: 0, exclusiveMs: 0 };
      entry.calls++; entry.inclusiveMs += message.inclusiveMs; entry.exclusiveMs += message.exclusiveMs;
      return;
    }
`);
  writeFileSync(parentFile, parentCode);
}
