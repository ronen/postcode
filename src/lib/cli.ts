import { existsSync } from 'node:fs';
import path from 'node:path';
import { evaluateModules } from './evaluation.js';
import { MemoryProgramRecordStore } from './memory-store.js';
import { localFileObservationSink, observationBatch } from './observations.js';
import type { ObservationSink } from './observations.js';
import { createView, presentationRequirements, renderView } from './presentation.js';
import { inspect, modules } from './projections.js';
import { openTypeScriptProject } from './typescript/project.js';

const help = `PostCode — initial module inventory\n
Usage: postcode [modules | inspect <exact-selector>] [--project <tsconfig.json>] [--snapshot <snapshot-id>] [--json] [--source-detail]

Defaults: modules(project), ./tsconfig.json, Unicode text.
inspect accepts one exact name, mnemonic handle, or Entity ID; zero/one/multiple matches are explicit.
Handle selection requires --snapshot from the inventory. A stale snapshot produces no current match.
--source-detail requires inspect and discloses only source locations supporting displayed claims.
JSON uses the experimental postcode-view/0 schema. Exports/documentation expansions are declared before evaluation.
Unicode inventory lists project modules with 3 export cues and collapses external modules with counts.
JSON lists all selected modules with up to 6 exports; inspection shows up to 50. Omissions are explicit.
Normal views automatically submit a local observation batch; the destination is disclosed on stderr.

Concepts:
modules inventories the supported population; inspect selects exact subjects from that population.
Materialization is analysis coverage; omissions describe display coverage, not missing analysis.
Population: configured external-module SourceFiles and visible named ambient modules, not every compiler category.
Names are current lookups. Generated handles are navigation cues, not responsibility claims; full IDs are snapshot-scoped.
Source and environment changes require a fresh snapshot; old references never imply a successor.
Derived claims retain limitations. Documentation is a recorded assertion whose truth, currency and completeness are not established.
Export relationships describe aliases/forwarding, not calls or dependencies. Target code is not executed.
Generated-output locations are excluded by the input filter; the reported count is location boundaries, not files found.
Next-action commands include CLI/project invocation paths; declaration paths and evidence require --source-detail.
See docs/cli-reference.md for commands, examples, reference scoping, qualifications and observations.
`;

const shellQuote = (value: string) => `'${value.replace(/'/g, `'\\''`)}'`;

function repositoryRoot(config: string): string | null {
  let directory = path.dirname(config);
  for (;;) {
    if (existsSync(path.join(directory, '.git'))) return directory;
    const parent = path.dirname(directory);
    if (parent === directory) return null;
    directory = parent;
  }
}

export async function runCli(args: readonly string[], environment: {
  readonly cwd: string;
  readonly checkout: string;
  readonly stdout: (text: string) => void;
  readonly stderr: (text: string) => void;
  readonly sink?: ObservationSink;
}): Promise<number> {
  let config = path.join(environment.cwd, 'tsconfig.json');
  let json = false;
  let sourceDetail = false;
  let expectedSnapshot: string | null = null;
  const positional: string[] = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]!;
    if (arg === '--help' || arg === '-h') { environment.stdout(help); return 0; }
    if (arg === '--json') json = true;
    else if (arg === '--source-detail') sourceDetail = true;
    else if (arg === '--snapshot') {
      const next = args[++index];
      if (!next || !/^snapshot:[a-f0-9]{64}$/.test(next)) { environment.stderr('Usage error: --snapshot requires a complete snapshot ID.\n'); return 2; }
      expectedSnapshot = next;
    } else if (arg === '--project') {
      const next = args[++index];
      if (!next || next.startsWith('--')) { environment.stderr('Usage error: --project requires a configuration path.\n'); return 2; }
      config = path.resolve(environment.cwd, next);
    } else if (arg.startsWith('--')) { environment.stderr(`Usage error: unknown option ${arg}.\n`); return 2; }
    else positional.push(arg);
  }
  const lens = positional[0] ?? 'modules';
  if ((lens !== 'modules' && lens !== 'inspect') || (lens === 'modules' && positional.length > 1)
    || (lens === 'inspect' && positional.length !== 2) || ((sourceDetail || expectedSnapshot !== null) && lens !== 'inspect')) {
    environment.stderr('Usage error: use modules or inspect <one exact selector>; source detail requires inspect.\n');
    return 2;
  }
  const destination = path.resolve(environment.checkout, '_observations');
  const opened = openTypeScriptProject({ configPath: config, excludedOutputDirectories: [
    destination, path.resolve(environment.checkout, '_build'),
  ] });
  if (opened.status !== 'opened') {
    environment.stderr(`Project open failed:\n${opened.diagnostics.map(diagnostic => `  TS${diagnostic.code}: ${diagnostic.message}`).join('\n')}\n`);
    return 2;
  }
  const presentation = { format: json ? 'json' as const : 'unicode' as const, sourceDetail };
  const store = new MemoryProgramRecordStore();
  const evaluation = evaluateModules(store, opened.analysis, presentationRequirements(presentation));
  const projection = lens === 'inspect' ? inspect(store, evaluation, positional[1]!, expectedSnapshot) : modules(store, evaluation);
  const command = ['node', path.join(environment.checkout, '_build/src/cli.js'), 'inspect', 'SUBJECT',
    '--snapshot', projection.snapshot, '--project', config].map(shellQuote).join(' ');
  const view = createView(store, projection, { ...presentation, navigation: { inspect: command } });
  const rendered = renderView(view);
  environment.stdout(rendered);
  environment.stderr(`Local observations: ${destination} (may contain repository-derived text and explicitly requested source locations).\n`);
  const snapshot = store.get(projection.snapshot);
  if (snapshot.kind !== 'snapshot') throw new Error('Expected analysis snapshot');
  const batch = observationBatch(view, rendered, { configPath: config, repositoryRoot: repositoryRoot(config), methods: snapshot.methods });
  try {
    const acknowledgement = await (environment.sink ?? localFileObservationSink(destination)).submit(batch);
    if (!acknowledgement.accepted) environment.stderr(`WARNING: observation not recorded: ${acknowledgement.reason}\n`);
  } catch (error) {
    environment.stderr(`WARNING: observation not recorded: ${error instanceof Error ? error.message : 'sink delivery failed'}\n`);
  }
  return 0;
}
