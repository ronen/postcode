// Extraction-only oracle. Fixed UUID/time test sources make attempt identities and
// accounting deterministic; no semantic digests, aliases or output fields are masked.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { syncBuiltinESMExports } from 'node:module';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { Worker } from 'node:worker_threads';
import { writeFileSync } from 'node:fs';
import { comparisonFixture, buildIdentity } from './comparison-fixtures.mjs';
const [beforeBuild, afterBuild, report] = process.argv.slice(2);
if (!report) throw Error('BEFORE_BUILD AFTER_BUILD REPORT');
const load = (build, name) => import(pathToFileURL(path.resolve(build, 'src/lib', name)));
const identities = { before: buildIdentity(beforeBuild), after: buildIdentity(afterBuild) };
const uuid = crypto.randomUUID, createHash = crypto.createHash, now = Object.getOwnPropertyDescriptor(performance, 'now');
Object.defineProperty(performance, 'now', { value: () => 0, configurable: true });
const json = { format: 'json', moreDetails: false };
async function journey(build, configPath, selector, collision, host) {
  // A controlled digest-prefix collision fixture leaves the allocation algorithm
  // unchanged. Compare exact resulting IDs and spellings in both implementations.
  crypto.createHash = collision ? (...args) => {
    const hash = createHash(...args), digest = hash.digest;
    hash.digest = function(encoding) { const value = digest.call(this, encoding); return encoding === 'hex' ? `12345678${value.slice(8)}` : value; };
    return hash;
  } : createHash;
  let sequence = 0;
  crypto.randomUUID = () => `00000000-0000-4000-8000-${String(++sequence).padStart(12, '0')}`;
  syncBuiltinESMExports();
  // Preserve the recorded pre-extraction baseline's module/export shape.
  const openSession = build === beforeBuild
    ? (await load(build, 'session.js')).openSession
    : (await load(build, 'interfaces/cli/application.js')).openCliSession;
  const { MemoryProgramRecordStore } = await load(build, 'memory-store.js');
  const trace = [], progress = [], results = [], originals = {};
  for (const method of ['entityIds', 'answerIds']) {
    originals[method] = MemoryProgramRecordStore.prototype[method];
    MemoryProgramRecordStore.prototype[method] = function(ids, kind) {
      trace.push({ operation: method, kind: kind ?? 'answer', ids: [...ids] });
      return originals[method].call(this, ids, kind);
    };
  }
  const agent = { identity: { provider: 'postcode-test', model: 'scripted', configuration: {}, origin: 'scripted' },
    open() { return { close() {}, async exchange(input) {
      return { kind: 'submit', result: { localId: 'root', prose: 'Controlled interpretation.',
        referent: { description: 'Selected module.', subjects: [input.request.subject] },
        qualifications: ['Interpretation, not a behavioral observation.'], evidence: [], associations: [{ subject: input.request.subject, qualifications: ['Explicit association.'], evidence: [] }],
        children: [], corrections: [], inconsistencies: [] } };
    } }; } };
  let session;
  if (host === 'in-process') {
    const opened = await openSession({ configPath }, { investigation: { agent }, onWork: event => progress.push(event) });
    assert.equal(opened.status, 'opened'); session = opened.session;
  } else {
    const workerSource = `
      import crypto from 'node:crypto';
      import { syncBuiltinESMExports } from 'node:module';
      import { performance } from 'node:perf_hooks';
      import { parentPort } from 'node:worker_threads';
      let sequence = 0;
      crypto.randomUUID = () => '00000000-0000-4000-8000-' + String(++sequence).padStart(12, '0');
      Object.defineProperty(performance, 'now', { value: () => 0, configurable: true });
      if (${collision}) {
        const original = crypto.createHash;
        crypto.createHash = (...args) => {
          const hash = original(...args), digest = hash.digest;
          hash.digest = function(encoding) { const value = digest.call(this, encoding); return encoding === 'hex' ? '12345678' + value.slice(8) : value; };
          return hash;
        };
      }
      syncBuiltinESMExports();
      const { MemoryProgramRecordStore } = await import(${JSON.stringify(pathToFileURL(path.resolve(build, 'src/lib/memory-store.js')).href)});
      for (const method of ['entityIds', 'answerIds']) {
        const original = MemoryProgramRecordStore.prototype[method];
        MemoryProgramRecordStore.prototype[method] = function(ids, kind) {
          parentPort.postMessage({ type: 'allocation-fixture', entry: { operation: method, kind: kind ?? 'answer', ids: [...ids] } });
          return original.call(this, ids, kind);
        };
      }
      await import(${JSON.stringify(pathToFileURL(path.resolve(build, 'src/lib/session-worker.js')).href)});
    `;
    const worker = new Worker(new URL('data:text/javascript,' + encodeURIComponent(workerSource)), { workerData: { configPath, investigatorIdentity: agent.identity } });
    worker.on('message', message => {
      if (message.type === 'allocation-fixture') trace.push(message.entry);
      if (message.type === 'work-progress') progress.push(message.progress);
    });
    const { interactiveSession } = await load(build, 'interactive-session.js');
    session = interactiveSession({ configPath }, { worker, investigator: agent });
    assert.equal((await session.opening).status, 'opened');
  }
  async function execute(request, allowedOutcomeChange = false) {
    const start = trace.length, event = progress.length;
    const result = await session.execute(request, { requestId: `request-${results.length}` });
    const rendered = JSON.parse(result.rendered);
    assert.equal(result.rendered, JSON.stringify(rendered, null, result.kind === 'view' && result.view.schema !== 'postcode-investigation-view/1-experimental' ? 2 : undefined) + '\n');
    results.push({ request, allowedOutcomeChange, kind: result.kind, failed: result.failed ?? false,
      context: result.context, attribution: result.attribution, rendered: result.rendered,
      ...(result.kind === 'view' ? { view: result.view, methods: result.methods, resolution: result.resolution ?? null,
        investigationArrangementKey: result.investigationArrangementKey } : { report: result.report }),
      allocations: trace.slice(start), progress: progress.slice(event) });
    return result;
  }
  try {
    const modules = await execute({ lens: 'modules', selector: null, presentation: json });
    const module = modules.view.modules.find(item => item.name === selector) ?? modules.view.modules[0];
    const inspected = await execute({ lens: 'inspect', selector: module.id, reference: true, presentation: json });
    await execute({ kind: 'present', target: inspected.view.answerReference, presentation: json });
    await execute({ kind: 'present', target: inspected.view.projection.id, presentation: { ...json, after: 'investigram-00000000' } }, true);
    await execute({ kind: 'present', target: modules.view.projection.id, presentation: { ...json, moreDetails: true } });
    const summary = await execute({ lens: 'summarize', selector, presentation: json });
    assert.equal(summary.view.result.evaluation.outcome.kind, 'accepted');
    const root = summary.view.result.evaluation.outcome.root;
    const historical = await execute({ lens: 'inspect', selector: root, reference: true, presentation: json });
    await execute({ kind: 'present', target: historical.view.answerReference, presentation: json });
    await execute({ kind: 'present', target: historical.view.answerReference, presentation: { ...json, after: 'investigram-00000000' } }, true);
    await execute({ lens: 'inspect', selector: module.id, reference: true, presentation: json });
    await execute({ kind: 'present', target: inspected.view.answerReference, presentation: json });
    await execute({ lens: 'usage', selector: null, presentation: json });
    await execute({ lens: 'modules', selector: null, parameters: null, presentation: json });
    await execute({ lens: 'usage', selector, presentation: json });
    await execute({ lens: 'inspect', selector, subject: 'project', presentation: json });
    return results;
  } finally {
    await session.close();
    crypto.createHash = createHash; syncBuiltinESMExports();
    for (const method of Object.keys(originals)) MemoryProgramRecordStore.prototype[method] = originals[method];
  }
}
const cases = [];
try {
  await comparisonFixture('dependency-journey', async (root, selector) => {
    for (const host of ['in-process', 'worker']) for (const collision of [false, true]) {
    const before = await journey(beforeBuild, path.join(root, 'tsconfig.json'), selector, collision, host);
    const after = await journey(afterBuild, path.join(root, 'tsconfig.json'), selector, collision, host);
    assert.equal(after.length, before.length);
    for (let index = 0; index < before.length; index++) {
      const a = structuredClone(before[index]), b = after[index];
      if (a.allowedOutcomeChange) {
        assert.equal(a.failed, true); assert.equal(b.failed, true);
        assert.equal(a.attribution.status, 'failed'); assert.equal(b.attribution.status, 'completed');
        a.attribution.status = 'completed';
        const finish = a.progress.filter(event => event.kind === 'finish');
        assert.equal(finish.length, 1); assert.equal(finish[0].status, 'failed'); finish[0].status = 'completed';
      }
      // Comparing serialization preserves field order in every context/report.
      assert.equal(JSON.stringify(b), JSON.stringify(a), `journey request ${index}`);
      cases.push({ host, collision, request: a.request, allocations: a.allocations, allowedWorkStatusChange: a.allowedOutcomeChange, equal: true });
      console.log(`journey request ${index} host=${host} collision=${collision} equal`);
    }
    }
  });
  assert.deepEqual({ before: buildIdentity(beforeBuild), after: buildIdentity(afterBuild) }, identities);
  writeFileSync(report, JSON.stringify({ ...identities, deterministic: ['UUID source', 'attempt clock'], cases }, null, 2) + '\n');
} finally {
  crypto.randomUUID = uuid; crypto.createHash = createHash; syncBuiltinESMExports();
  if (now) Object.defineProperty(performance, 'now', now); else delete performance.now;
}
