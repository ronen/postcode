/** Focused M3 memory investigation. No inference. Run each build in a fresh process.
 * node --expose-gc scripts/profile-contribution-memory.mjs <tsconfig> <build> <empty-output-dir> [allocations]
 * Optional prototype build exports copyOwned from immutable.js; production builds do not.
 * Raw profiles are scratch artifacts. Allocation samples estimate live bytes, not retained sizes.
 */
import { mkdirSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Session as Inspector } from 'node:inspector';
import { createHash } from 'node:crypto';
import { buildIdentity } from './comparison-fixtures.mjs';

const configPath = path.resolve(process.argv[2]);
const build = path.resolve(process.argv[3]);
const output = path.resolve(process.argv[4]);
if (!global.gc) throw Error('Run with --expose-gc');
if (existsSync(output) && readdirSync(output).length) throw Error('Output directory must be empty');
mkdirSync(output, { recursive: true });
const load = file => import(pathToFileURL(path.join(build, 'src/lib', file)));
const { openApplication } = await load('application/index.js');
const { MemoryProgramRecordStore } = await load('memory-store.js');
const { sessionLedger, moduleEntity } = await load('contributions/modules.js');
const { inspect } = await load('projections.js');
const immutable = await load('immutable.js');
// Attribute the production ownership-aware capture through the same sampling
// labels as native cloning. The wrapper does not change the value or ownership.
const capture = immutable.ImmutableCapture?.prototype.capture;
if (capture) {
  const tagged = (() => {
    function cloneAnswerRecord(value) { return capture.call(this, value); }
    function cloneCanonicalRecord(value) { return capture.call(this, value); }
    function cloneLedgerRecord(value) { return capture.call(this, value); }
    function cloneOther(value) { return capture.call(this, value); }
    return { cloneAnswerRecord, cloneCanonicalRecord, cloneLedgerRecord, cloneOther };
  })();
  immutable.ImmutableCapture.prototype.capture = function(value) {
    const kind = value?.kind;
    const tag = kind?.includes('projection') ? tagged.cloneAnswerRecord
      : kind === 'investigram' || kind === 'production' ? tagged.cloneLedgerRecord
        : value?.session && value?.id ? tagged.cloneCanonicalRecord : tagged.cloneOther;
    return tag.call(this, value);
  };
}
const nativeClone = globalThis.structuredClone;
// Tag native clone allocations without changing the production build's ownership behavior.
// Prototype modules opt in locally; do not replace public structuredClone with sharing.
const copy = nativeClone;
const cloneCounts = {};
function cloneAnswerRecord(value, options) { return copy(value, options); }
function cloneCanonicalRecord(value, options) { return copy(value, options); }
function cloneLedgerRecord(value, options) { return copy(value, options); }
function cloneOther(value, options) { return copy(value, options); }
globalThis.structuredClone = (value, options) => {
  const kind = value?.kind;
  const clone = kind?.includes('projection') ? cloneAnswerRecord
    : kind === 'investigram' || kind === 'production' ? cloneLedgerRecord
      : value?.session && value?.id ? cloneCanonicalRecord : cloneOther;
  cloneCounts[clone.name] = (cloneCounts[clone.name] ?? 0) + 1;
  return clone(value, options);
};

let weakStore, weakLedger, weakInventory;
const records = new Map();
const put = MemoryProgramRecordStore.prototype.put;
MemoryProgramRecordStore.prototype.put = function(values) {
  put.call(this, values);
  weakStore = new WeakRef(this);
  for (const value of values) records.set(value.id, { kind: value.kind, value: new WeakRef(this.get(value.id)) });
  if (values.length) weakLedger = new WeakRef(sessionLedger(this, values[0].session));
};
const inspector = new Inspector(); inspector.connect();
const post = (method, params = {}) => new Promise((resolve, reject) => inspector.post(method, params, (error, result) => error ? reject(error) : resolve(result)));
await post('HeapProfiler.startSampling', { samplingInterval: 32768 });
const report = { at: new Date().toISOString(), node: process.versions.node, build: buildIdentity(build), prototype: Boolean(immutable.copyOwned), ownershipAware: Boolean(capture), samples: [] };
let allocationMode = 'live sampled allocations';
const save = () => writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const bytes = value => Buffer.byteLength(JSON.stringify(value));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

function audit() {
  const ledger = weakLedger?.deref();
  const kinds = {}, support = {}, uniqueEvidence = new Set(), uniqueItems = new Set();
  let canonicalBytes = 0, answerBytes = 0, answerCount = 0, evidenceOccurrences = 0, itemOccurrences = 0, evidenceShared = 0, itemShared = 0;
  for (const entry of records.values()) {
    const record = entry.value.deref();
    if (!record) continue;
    const size = bytes(record);
    const group = kinds[record.kind] ??= { count: 0, serializedBytes: 0 }; group.count++; group.serializedBytes += size;
    if (!record.kind.includes('projection')) { canonicalBytes += size; continue; }
    answerCount++; answerBytes += size;
    for (const capture of [record.support, record.contributions?.support, record.native?.support].filter(Boolean)) {
      for (const [key, value] of Object.entries(capture)) support[key] = (support[key] ?? 0) + bytes(value);
      for (const evidence of capture.evidence) {
        evidenceOccurrences++; uniqueEvidence.add(evidence.id);
        if (records.get(evidence.id)?.value.deref() === evidence) evidenceShared++;
      }
      for (const item of capture.items) {
        itemOccurrences++; uniqueItems.add(JSON.stringify(item.address));
        if (ledger?.item(item.address) === item.item) itemShared++;
      }
    }
  }
  return { kinds, canonicalBytes, answerBytes, answerCount, support, evidenceOccurrences, uniqueEvidence: uniqueEvidence.size,
    itemOccurrences, uniqueItems: uniqueItems.size, evidenceShared, itemShared,
    ledger: ledger ? { entities: ledger.entities().length, investigrams: ledger.investigrams().length, productions: ledger.productions().length,
      deliveries: ledger.productions().reduce((count, production) => count + production.deliveries.length, 0),
      serializedBytes: bytes([ledger.entities(), ledger.investigrams(), ledger.productions()]) } : null };
}
function allocationSummary(profile) {
  const groups = {}, frames = [];
  function walk(node, inherited) {
    const frame = node.callFrame;
    const group = /^clone(AnswerRecord|CanonicalRecord|LedgerRecord|Other)$/.test(frame.functionName) ? frame.functionName : inherited;
    groups[group] = (groups[group] ?? 0) + node.selfSize;
    if (node.selfSize) frames.push({ bytes: node.selfSize, function: frame.functionName, url: frame.url, line: frame.lineNumber + 1, group });
    node.children.forEach(child => walk(child, group));
  }
  walk(profile.head, 'other');
  return { groups, largestFrames: frames.sort((a, b) => b.bytes - a.bytes).slice(0, 30) };
}
async function sample(label, detail = false) {
  const beforeGC = process.memoryUsage();
  for (let i = 0; i < 4; i++) { await new Promise(resolve => setImmediate(resolve)); global.gc(); }
  const afterGC = process.memoryUsage();
  const { profile } = await post('HeapProfiler.getSamplingProfile');
  const value = { label, beforeGC, afterGC, allocationMode, allocations: allocationSummary(profile), clones: { ...cloneCounts }, prototypeCopies: immutable.copyCounts ? { ...immutable.copyCounts } : undefined,
    live: { store: Boolean(weakStore?.deref()), ledger: Boolean(weakLedger?.deref()), inventory: Boolean(weakInventory?.deref()) },
    ...(detail ? { audit: audit() } : {}) };
  report.samples.push(value); save();
  console.log(JSON.stringify({ label, heapMB: +(afterGC.heapUsed / 1e6).toFixed(1), live: value.live, answers: value.audit?.answerCount }));
}

await sample('loaded');
let closedSession;
async function journey() {
  const root = path.dirname(configPath);
  const opened = await openApplication({ configPath, excludedOutputDirectories: [path.join(root, '_build'), path.join(root, '_observations'), build, output] });
  if (opened.status !== 'opened') throw Error(JSON.stringify(opened));
  const session = opened.session; closedSession = session;
  await sample('opened');
  const answers = [];
  const run = async (label, request) => {
    const start = performance.now(), value = await session.execute(request);
    if (value.kind !== 'answer') throw Error(`${label}: ${value.kind}`);
    answers.push({ label, id: value.answer.id, milliseconds: performance.now() - start });
    await sample(label);
    return value;
  };
  for (const round of [1, 2]) {
    const inventory = await run(`${round} modules`, { kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } });
    weakInventory = new WeakRef(inventory);
    const modules = inventory.answer.content.value.modules;
    const pick = handle => (modules.find(item => item.claim.record.information.handle === handle) ?? modules[0]).id;
    await run(`${round} organization`, { kind: 'lens', lens: 'organization', designation: { kind: 'repository' } });
    await run(`${round} dependency-structure`, { kind: 'lens', lens: 'dependency-structure', designation: { kind: 'configured-project' } });
    for (const handle of ['work-attribution', 'memory-store', 'executor']) {
      await run(`${round} inspect ${handle}`, { kind: 'lens', lens: 'inspect', designation: { kind: 'reference', value: pick(handle) } });
      await run(`${round} children ${handle}`, { kind: 'lens', lens: 'dependency-children', designation: { kind: 'reference', value: pick(handle) } });
    }
  }
  report.journey = answers;
  await sample('journey canonical and answer audit', true);
  // Constructors isolate answer retention from source evaluation and application input validation.
  await overlap();
  await session.close();
  await sample('closed inside journey', true);
}
async function overlap() {
  const store = weakStore.deref(), ledger = weakLedger.deref();
  const basis = store.evaluations(ledger.session).find(value => value.requirement === 'modules' && value.basis === undefined);
  const population = basis.modules.filter(id => store.get(store.get(id).claim).information.discoveryFacets.includes('project'));
  const subjects = population.slice(0, 8);
  let earlier = inspect(store, basis, subjects);
  const original = hash(earlier), initialId = earlier.id;
  await sample('overlap baseline', true);
  for (let i = 1; i <= 8; i++) {
    if (inspect(store, basis, subjects).id !== initialId) throw Error('Identical answer changed');
    if (i === 1 || i === 4 || i === 8) await sample(`identical ${i}`, true);
  }
  for (let i = 0; i < 8; i++) {
    inspect(store, basis, [...subjects.slice(0, 7), population[8 + i]]);
    if (i === 0 || i === 3 || i === 7) await sample(`distinct overlapping ${i + 1}`, true);
  }
  // Time-dependent state remains captured even in a sharing prototype.
  const use = ledger.identifications(moduleEntity(store, subjects[0]))[0].address;
  const production = ledger.begin({ producer: { mechanism: 'agentic', method: 'profile/withdraw@1', agent: { model: 'scripted' } } });
  ledger.accept([{ production, contribution: { investigrams: [{ key: 'withdraw', qualification: { limitations: ['Controlled memory-profile change.'] },
    declarations: [{ key: 'withdraw', operation: 'withdraw', displaces: [use], grounds: { text: 'Controlled history probe.' } }] }] } }]);
  const current = inspect(store, basis, subjects);
  if (hash(earlier) !== original || current.id === earlier.id) throw Error('Historical answer changed or fresh status was not captured');
  report.history = { preserved: true, changedFreshId: true, old: earlier.id, fresh: current.id };
  earlier = null;
  await sample('after historical change', true);
}
async function allocations() {
  const { openTypeScriptProject } = await load('typescript/project.js');
  const { evaluateModules } = await load('evaluation.js');
  const opened = await openTypeScriptProject({ configPath, excludedOutputDirectories: [path.join(path.dirname(configPath), '_build'), build, output] });
  if (opened.status !== 'opened') throw Error('Expected opened project');
  const store = new MemoryProgramRecordStore();
  const basis = evaluateModules(store, opened.analysis, ['exports', 'documentation', 'composition']);
  await sample('canonical information before answers', true);
  const subjects = basis.modules.filter(id => store.get(store.get(id).claim).information.discoveryFacets.includes('project')).slice(0, 32);
  const first = inspect(store, basis, subjects);
  await sample('initial 32-module answer', true);
  await post('HeapProfiler.stopSampling');
  await post('HeapProfiler.startSampling', { samplingInterval: 32768, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
  allocationMode = 'all sampled allocations since repeat start, including subsequently collected objects';
  for (let i = 1; i <= 4; i++) {
    if (inspect(store, basis, subjects).id !== first.id) throw Error('Equivalent answer changed');
    await sample(`repeat 32-module answer ${i}`);
  }
  report.identicalAnswer = true;
}
if (process.argv[5] === 'allocations') await allocations();
else {
  await journey();
  await sample('closed after journey returns, session facade held', true);
  closedSession = null;
  await sample('closed facade released', true);
  // Weak-reference metadata itself is instrument overhead, measured separately.
  records.clear(); weakStore = undefined; weakLedger = undefined; weakInventory = undefined;
  await sample('instrument registry cleared');
}
await post('HeapProfiler.stopSampling'); inspector.disconnect();
globalThis.structuredClone = nativeClone;
MemoryProgramRecordStore.prototype.put = put;
if (capture) immutable.ImmutableCapture.prototype.capture = capture;
save();
