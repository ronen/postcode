/** Accumulating-Session measurement for the structured-accounts plan. Descriptive only: no thresholds.
 *
 *   node --expose-gc scripts/measure-contribution-session.mjs <project tsconfig> <build directory> [output.json] [dialogs]
 * Output must be in a dedicated, empty directory (created if absent); its whole directory is excluded.
 *
 * Part A runs a fixed mechanical journey through the application interface; it exists in the
 * baseline build too, so the two builds can be compared like for like. Parts B and C need the
 * contribution mechanism and are skipped on a build without it. Part B times module evaluation
 * at the domain level and records ledger growth. Part C accumulates scripted agentic dialogs over
 * real retained information, then applies a broad identification change and a narrow withdrawal,
 * recording delivery volume, status derivation cost and how many contributions gain a cause.
 */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildIdentity } from './build-identity.mjs';

const configPath = path.resolve(process.argv[2] ?? 'tsconfig.json');
const build = path.resolve(process.argv[3] ?? '_build');
const output = process.argv[4];
const dialogCount = Number(process.argv[5] ?? 40);
const load = file => import(pathToFileURL(path.join(build, 'src/lib', file)));
const root = path.dirname(configPath);
// The exclusion policy is directory-based. Never exclude an arbitrary report parent:
// it may be the configuration directory or contain source that the measurement needs.
const reportDirectory = output ? path.dirname(path.resolve(output)) : null;
if (reportDirectory) {
  if (existsSync(reportDirectory) && readdirSync(reportDirectory).length) {
    throw new Error('The report requires a dedicated empty output directory; its parent contains existing files. Choose a new report directory.');
  }
  mkdirSync(reportDirectory, { recursive: true, mode: 0o700 });
}
const excluded = [path.join(root, '_build'), path.join(root, '_observations'), build, ...(reportDirectory ? [reportDirectory] : [])];
const collect = async () => { for (let i = 0; i < 3; i++) { global.gc?.(); await new Promise(resolve => setImmediate(resolve)); } const { rss, heapUsed } = process.memoryUsage(); return { rss, heapUsed }; };
const timed = async run => { const started = performance.now(); const value = await run(); return { value, milliseconds: performance.now() - started }; };
const report = { configPath, build: buildIdentity(build), node: process.versions.node, gcAvailable: Boolean(global.gc), at: new Date().toISOString() };

// Part A: the same mechanical journey through the application interface, twice, in one Session.
{
  const { openApplication } = await load('application/index.js');
  const before = await collect();
  const opened = await timed(() => openApplication({ configPath, excludedOutputDirectories: excluded }));
  if (opened.value.status !== 'opened') throw new Error(`Project did not open: ${JSON.stringify(opened.value)}`);
  const session = opened.value.session, samples = [];
  const run = async (label, request) => {
    const { value, milliseconds } = await timed(() => session.execute(request));
    if (value.kind !== 'answer') throw new Error(`${label}: ${value.kind}`);
    samples.push({ label, milliseconds, answer: value.answer.id.slice(value.answer.id.lastIndexOf(':') + 1, value.answer.id.lastIndexOf(':') + 13), ...(await collect()) });
    return value;
  };
  try {
    for (const round of [1, 2]) {
      const inventory = await run(`${round} modules`, { kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } });
      const modules = inventory.answer.content.value.modules;
      const pick = handle => (modules.find(item => item.claim.record.information.handle === handle) ?? modules[0]).id;
      await run(`${round} organization`, { kind: 'lens', lens: 'organization', designation: { kind: 'repository' } });
      await run(`${round} dependency-structure`, { kind: 'lens', lens: 'dependency-structure', designation: { kind: 'configured-project' } });
      for (const handle of ['work-attribution', 'memory-store', 'executor']) {
        await run(`${round} inspect ${handle}`, { kind: 'lens', lens: 'inspect', designation: { kind: 'reference', value: pick(handle) } });
        await run(`${round} children ${handle}`, { kind: 'lens', lens: 'dependency-children', designation: { kind: 'reference', value: pick(handle) } });
      }
      if (round === 1) report.modules = modules.length;
    }
  } finally { await session.close(); }
  report.application = { openingMs: opened.milliseconds, before, samples, closed: await collect(),
    repeatedAnswersEqual: samples.slice(0, samples.length / 2).every((item, index) => item.answer === samples[samples.length / 2 + index].answer) };
}

const contributions = existsSync(path.join(build, 'src/lib/contributions/ledger.js'));
report.contributions = contributions;
if (contributions) {
  const { openTypeScriptProject } = await load('typescript/project.js');
  const { MemoryProgramRecordStore } = await load('memory-store.js');
  const { evaluateModules } = await load('evaluation.js');
  const { moduleEntity, sessionLedger } = await load('contributions/modules.js');
  const { conductDialog } = await load('contributions/dialog.js');
  const { evidenceAccess } = await load('evidence-access.js');
  const opened = await openTypeScriptProject({ configPath, excludedOutputDirectories: excluded });
  if (opened.status !== 'opened') throw new Error('Project did not open');
  const store = new MemoryProgramRecordStore(), session = opened.session;
  const ledger = sessionLedger(store, session);
  const size = () => {
    const investigrams = ledger.investigrams(), productions = ledger.productions();
    return { position: ledger.position, entities: ledger.entities().length, investigrams: investigrams.length, productions: productions.length,
      items: investigrams.reduce((sum, item) => sum + item.items.length, 0), declarations: investigrams.reduce((sum, item) => sum + item.declarations.length, 0),
      deliveries: productions.reduce((sum, item) => sum + item.deliveries.length, 0), serializedCharacters: JSON.stringify([ledger.entities(), investigrams, productions]).length };
  };

  // Part B: module evaluation, which now also contributes findings, and an equivalent recomputation.
  const evaluations = [];
  for (const expansions of [[], ['exports', 'documentation', 'composition'], ['exports', 'documentation', 'composition'], ['exports']]) {
    const { value, milliseconds } = await timed(() => evaluateModules(store, opened.analysis, expansions));
    evaluations.push({ expansions, milliseconds, evaluation: value.id.slice(-12), ledger: size(), ...(await collect()) });
  }
  report.evaluation = evaluations;

  // Part C: accumulating scripted dialogs over real retained information.
  const evidence = evidenceAccess(store, opened.analysis, session);
  const discovery = store.evaluations(session).find(item => item.requirement === 'modules' && item.basis === undefined);
  const subjects = discovery.modules.filter(id => store.get(store.get(id).claim).information.discoveryFacets.includes('project')).slice(0, dialogCount);
  const caveat = { limitations: ['Scripted measurement content; not an interpretation of the program.'] };
  const operation = { id: 'state-behavior', method: 'measure/state-behavior@1', objective: 'Measurement dialog.' };
  const dialogs = [];
  for (const [index, module] of subjects.entries()) {
    const entity = moduleEntity(store, module);
    const { invocation } = ledger.invoke({ operation: operation.id, subjects: [{ role: null, subject: { kind: 'entity', entity } }], parameters: {}, context: [], resultContract: null });
    const volumes = [];
    const agent = { identity: { provider: 'measure', model: 'scripted', configuration: {}, origin: 'scripted' }, open: () => {
      let step = 0;
      return { close() {}, exchange: async input => {
        volumes.push(JSON.stringify(input.responses).length + JSON.stringify(input.notices).length);
        if (step++ === 0) return { kind: 'tools', requests: [{ kind: 'exports', subject: module }, { kind: 'inventory', scope: { kind: 'entity', entity, role: 'topic', topic: 'behavior' }, inventory: 'current-only' },
          // Every dialog also reads the first dialog's account, as a later investigation building on earlier work would.
          ...(dialogs[0] ? [{ kind: 'association', association: dialogs[0].use, content: true }] : [])] };
        return { kind: 'submit', contribution: { investigrams: [{ key: 'a', qualification: caveat, referents: [entity],
          items: [{ key: 'p', type: 'prose', body: { text: `Measurement account ${index}.` } },
            { key: 'm', type: 'state-model', body: { bearer: { entity }, states: [{ key: 'idle', label: 'Idle' }, { key: 'busy', label: 'Busy' }], initial: { kind: 'unknown' },
              transitions: [{ key: 't', from: 'idle', to: 'busy', trigger: 'work arrives' }], coverage: { states: 'some', transitions: 'some' } } }],
          declarations: [{ key: 'use', operation: 'add', target: { kind: 'entity', entity, role: 'topic', topic: 'behavior' }, members: [{ kind: 'item', item: { investigram: { local: 'a' }, item: 'p' } }] },
            { key: 'answer', operation: 'add', target: { kind: 'result', result: invocation.result }, members: [{ kind: 'item', item: { investigram: { local: 'a' }, item: 'm' } }] }] }] } };
      } };
    } };
    const { value, milliseconds } = await timed(() => conductDialog({ ledger, store, evidence, operation, invocation: invocation.id, agent, check: async () => {} }));
    if (value.outcome.kind !== 'accepted') throw new Error(`Dialog ${index}: ${JSON.stringify(value.outcome)}`);
    const investigram = value.outcome.acceptance.productions[0].investigrams.a;
    dialogs.push({ module, entity, investigram, use: { investigram, declaration: 'use' }, milliseconds, deliveries: value.production.deliveries.length, deliveryKinds: value.production.deliveries.map(item => item.kind),
      exchangeCharacters: volumes });
  }
  const statusPass = () => timed(() => ledger.investigrams().reduce((sum, item) => sum + (ledger.status.investigram(item.id).producing.length ? 1 : 0), 0));
  const flagged = () => dialogs.filter(item => ledger.status.investigram(item.investigram).producing.length).length;
  const afterDialogs = { ledger: size(), status: await statusPass(), flaggedDialogs: flagged(), ...(await collect()) };

  // A broad change: another discovery method identifies every module the dialogs concerned.
  const finder = ledger.begin({ producer: { mechanism: 'mechanical', method: 'measure/rediscovery@2', agent: null } });
  ledger.accept([{ production: finder, contribution: { investigrams: dialogs.map((item, index) => ({ key: `r${index}`, qualification: { status: 'mechanically-derived', guarantee: 'Measurement finding.' },
    items: [{ key: 'id', type: 'identification', body: { name: `module ${index}`, nameOrigin: 'system-under-study', designation: 'Rediscovered module' } }],
    declarations: [{ key: 'use', operation: 'add', target: { kind: 'entity', entity: item.entity, role: 'identification' }, members: [{ kind: 'item', item: { investigram: { local: `r${index}` }, item: 'id' } }] }] })) } }]);
  const afterBroad = { status: await statusPass(), flaggedDialogs: flagged(),
    causesPerDialog: dialogs.map(item => ledger.status.investigram(item.investigram).producing.length) };

  // A narrow change: the first dialog's account is withdrawn. Every later dialog read it.
  const withdrawer = ledger.begin({ producer: { mechanism: 'agentic', method: 'measure/withdraw@1', agent: null } });
  ledger.accept([{ production: withdrawer, contribution: { investigrams: [{ key: 'w', declarations: [{ key: 'w', operation: 'withdraw', qualification: caveat, displaces: [dialogs[0].use], grounds: { text: 'Measurement withdrawal.' } }] }] } }]);
  const afterNarrow = { status: await statusPass(), flaggedDialogs: flagged(),
    causesPerDialog: dialogs.map(item => ledger.status.investigram(item.investigram).producing.length) };
  report.dialogs = { count: dialogs.length,
    perDialog: dialogs.map(({ milliseconds, deliveries, deliveryKinds, exchangeCharacters }) => ({ milliseconds, deliveries, deliveryKinds, exchangeCharacters })),
    afterDialogs, afterBroad, afterNarrow, final: { ledger: size(), ...(await collect()) } };
}

if (output) writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
