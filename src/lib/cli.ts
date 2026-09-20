import path from 'node:path';
import { evaluateModules } from './evaluation.js';
import { evaluateDependencies } from './dependencies/evaluate.js';
import { evaluateDependencyOrganization } from './dependencies/organization.js';
import { dependencyStructure, dependencyChildren, dependencyParents } from './dependencies/projections.js';
import { createDependencyView, dependencyPresentationRequirements, renderDependencyView } from './dependencies/presentation.js';
import { MemoryProgramRecordStore } from './memory-store.js';
import { localFileObservationSink, observationBatch } from './observations.js';
import type { ObservationSink } from './observations.js';
import { createView, presentationRequirements, renderView } from './presentation.js';
import { inlineText } from './terminal-text.js';
import { modules } from './projections.js';
import { evaluateOrganization } from './organization/evaluate.js';
import { inspectOrganization, organization } from './organization/projections.js';
import { createOrganizationView, organizationPresentationRequirements, renderOrganizationView } from './organization/presentation.js';
import type { EvaluationRecord, ProjectionRecord } from './records.js';
import { openTypeScriptProject } from './typescript/project.js';

const help = `PostCode — modules, organization and dependencies\n
Usage: postcode [modules | organization [project | repository] | inspect <exact-selector> | dependencies | children <exact-selector> | parents <exact-selector>] [--project <tsconfig.json>] [--snapshot <snapshot-id>] [--json] [--source-detail]

Defaults: modules(project), ./tsconfig.json, Unicode text.
organization defaults to the configured project; repository selects the complete enclosing Git worktree organization.
inspect accepts one exact group/module name, module handle, or Entity ID; zero/one/multiple matches are explicit.
Groups have segment names and group Entity IDs, with no handles or path selectors. The root has no intrinsic name.
Place options before -- to pass an option-like selector literally: inspect --json -- --help.
Handle and compact Entity ID selection require --snapshot from the inventory. A stale snapshot produces no current match.
--source-detail supports inspect and dependency views and discloses source locations and bounded excerpts supporting displayed claims.
Group source detail shows captured paths and artifact metadata without documentation or other file contents.
JSON uses experimental postcode-view/0, postcode-organization-view/0 or postcode-dependency-view/0 schemas. Standard expansions are declared before evaluation.
Unicode inventory lists project modules with 3 export cues and collapses external modules with counts.
JSON lists all selected modules with up to 6 exports; inspection shows up to 50. Omissions are explicit.
Organization Unicode expands 150 groups, 6 levels, and 12 module leaves per group; JSON retains the full graph.
Project views retain direct artifact-only siblings and disclose pruned descent. Repeated groups expand once.
Group inspection lists all direct parents, subgroups, modules, and bounded artifact counts.
--dependency-context explicitly prepares dependency inputs for snapshot-compatible module/organization inspection; generated dependency navigation includes it.
dependencies shows the project dependency structure; children/parents select exact modules.
A dependency parent depends directly on a dependency child; only supported project-owned source requests establish edges.
Dependency Unicode expands 60 components, 6 levels and 200 edges; JSON retains all graph modules and relationships.
Focused relationships show up to 20 occurrences in Unicode or 50 in JSON; source detail shows up to 100 evidence records.
External dependencies are opaque leaves. Cycles retain members and internal edges; roots do not imply entry points.
Normal views automatically submit a local observation batch; the destination is disclosed on stderr.

Concepts:
modules inventories the supported population; inspect selects exact subjects from that population.
Materialization is analysis coverage; omissions describe display coverage, not missing analysis.
Population: configured external-module SourceFiles and visible named ambient modules, not every compiler category.
Names are current lookups. Generated handles are navigation cues, not responsibility claims; precise compact Entity IDs are snapshot-scoped.
Source and environment changes require a fresh snapshot; old references never imply a successor.
Derived claims retain limitations. Documentation is a recorded assertion whose truth, currency and completeness are not established.
Export relationships describe aliases/forwarding, not calls or dependencies. Target code is not executed.
Generated-output locations are excluded by the input filter; the reported count is location boundaries, not files found.
Next-action commands include CLI/project invocation paths; declaration paths and evidence require --source-detail.
See docs/cli-reference.md for commands, examples, reference scoping, qualifications and observations.
`;

const shellQuote = (value: string) => /^[a-zA-Z0-9_./:@=-]+$/.test(value) ? value : `'${value.replace(/'/g, `'\\''`)}'`;

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
  let dependencyContext = false;
  let expectedSnapshot: string | null = null;
  const positional: string[] = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]!;
    if (arg === '--') { positional.push(...args.slice(index + 1)); break; }
    if (arg === '--help' || arg === '-h') { environment.stdout(help); return 0; }
    if (arg === '--dependency-context') dependencyContext = true;
    else if (arg === '--json') json = true;
    else if (arg === '--source-detail') sourceDetail = true;
    else if (arg === '--snapshot') {
      const next = args[++index];
      if (!next || !/^snapshot:[a-f0-9]{64}$/.test(next)) { environment.stderr('Usage error: --snapshot requires a complete snapshot ID.\n'); return 2; }
      expectedSnapshot = next;
    } else if (arg === '--project') {
      const next = args[++index];
      if (!next || next.startsWith('--')) { environment.stderr('Usage error: --project requires a configuration path.\n'); return 2; }
      config = path.resolve(environment.cwd, next);
    } else if (arg.startsWith('--')) { environment.stderr(`Usage error: unknown option ${inlineText(arg)}.\n`); return 2; }
    else positional.push(arg);
  }
  const lens = positional[0] ?? 'modules';
  const dependencyLens = ['dependencies', 'children', 'parents'].includes(lens);
  const focused = ['inspect', 'children', 'parents'].includes(lens);
  if (!['modules', 'inspect', 'organization', 'dependencies', 'children', 'parents'].includes(lens)
    || (['modules', 'dependencies'].includes(lens) && positional.length > 1)
    || (lens === 'organization' && (positional.length > 2 || !['project', 'repository'].includes(positional[1] ?? 'project')))
    || (focused && positional.length !== 2) || (expectedSnapshot !== null && !focused)
    || (sourceDetail && !focused && !dependencyLens)) {
    environment.stderr('Usage error: use modules, organization [project | repository], inspect <selector>, dependencies, children <selector>, or parents <selector>; --snapshot requires inspect, children or parents; --source-detail requires inspect or a dependency view.\n');
    return 2;
  }
  const destination = path.resolve(environment.checkout, '_observations');
  const opened = openTypeScriptProject({ configPath: config, excludedOutputDirectories: [
    destination, path.resolve(environment.checkout, '_build'),
  ] });
  if (opened.status !== 'opened') {
    environment.stderr(`Project open failed:\n${opened.diagnostics.map(diagnostic => `  TS${diagnostic.code}: ${inlineText(diagnostic.message)}`).join('\n')}\n`);
    return 2;
  }
  const presentation = { format: json ? 'json' as const : 'unicode' as const, sourceDetail };
  const store = new MemoryProgramRecordStore();
  const dependencyOutcome = dependencyLens || dependencyContext ? evaluateDependencies(store, opened.analysis, dependencyPresentationRequirements.modules) : null;
  const evaluation = dependencyOutcome ? store.get(dependencyOutcome.moduleEvaluation) as EvaluationRecord
    : evaluateModules(store, opened.analysis, lens === 'modules' ? presentationRequirements(presentation) : organizationPresentationRequirements.modules);
  const organizationOutcome = lens === 'modules' ? null : evaluateOrganization(store, evaluation, organizationPresentationRequirements.groups);
  const dependencyOrganization = dependencyLens ? evaluateDependencyOrganization(store, dependencyOutcome!, organizationOutcome!) : null;
  const projection = dependencyLens
    ? lens === 'dependencies' ? dependencyStructure(store, dependencyOutcome!, dependencyOrganization!.id)
      : lens === 'children' ? dependencyChildren(store, dependencyOutcome!, positional[1]!, expectedSnapshot, dependencyOrganization!.id)
        : dependencyParents(store, dependencyOutcome!, positional[1]!, expectedSnapshot, dependencyOrganization!.id)
    : lens === 'modules' ? modules(store, evaluation) : lens === 'inspect'
      ? inspectOrganization(store, organizationOutcome!, positional[1]!, expectedSnapshot)
      : organization(store, organizationOutcome!, positional[1] === 'repository' ? 'repository' : 'configured-project');
  const command = (placeholder: string, action = 'inspect') => [
    ['node', path.join(environment.checkout, '_build/src/cli.js'), action, ...(dependencyOutcome && action === 'inspect' ? ['--dependency-context'] : [])],
    ['--snapshot', projection.snapshot], ['--project', config, '--', placeholder],
  ].map(tokens => tokens.map(shellQuote).join(' ')).join(' \\\n  ');
  // A displayed command must remain both structurally safe and executable as shown.
  const commandPaths = config + environment.checkout;
  const unsafeCommandPath = inlineText(commandPaths) !== commandPaths;
  const moduleProjection = projection.kind === 'organization-projection' && projection.moduleProjection
    ? store.get(projection.moduleProjection) as ProjectionRecord : null;
  const moduleOnly = projection.kind === 'organization-projection' && projection.lens === 'inspect' && projection.groups.length === 0
    && moduleProjection !== null && (moduleProjection.modules.length > 0 || organizationOutcome!.groups.length === 0);
  const options = { ...presentation, ...(unsafeCommandPath ? {} : { navigation: { inspect: command(dependencyLens ? 'ENTITY_ID' : 'MODULE_HANDLE') } }) };
  const view = projection.kind === 'dependency-projection' ? createDependencyView(store, projection, { ...options,
    ...(unsafeCommandPath ? {} : { dependencyNavigation: { children: command('ENTITY_ID', 'children'), parents: command('ENTITY_ID', 'parents'), source: ['node', path.join(environment.checkout, '_build/src/cli.js'), lens, '--source-detail', '--project', config, ...(lens === 'dependencies' ? [] : ['--snapshot', projection.snapshot, '--', 'ENTITY_ID'])].map(shellQuote).join(' ') } }) })
    : projection.kind === 'projection' ? createView(store, projection, options)
    : moduleOnly ? createView(store, moduleProjection!, options)
    : createOrganizationView(store, projection, { ...options,
      ...(unsafeCommandPath ? {} : { navigation: { inspect: command('ENTITY_ID') } }) });
  const rendered = view.schema === 'postcode-dependency-view/0-experimental' ? renderDependencyView(view)
    : view.schema === 'postcode-view/0-experimental' ? renderView(view) : renderOrganizationView(view);
  environment.stdout(rendered);
  environment.stderr(`Local observations: ${inlineText(destination)} (may contain repository-derived text and explicitly requested source locations).\n`);
  const snapshot = store.get(projection.snapshot);
  if (snapshot.kind !== 'snapshot') throw new Error('Expected analysis snapshot');
  const captured = snapshot.repository ? store.get(snapshot.repository) : null;
  const repositoryRoot = captured?.kind === 'repository-evidence' && captured.capture.status === 'available' ? captured.capture.evidence.root : null;
  const batch = observationBatch(view, rendered, { configPath: config, repositoryRoot, methods: snapshot.methods });
  try {
    const acknowledgement = await (environment.sink ?? localFileObservationSink(destination)).submit(batch);
    if (!acknowledgement.accepted) environment.stderr(`WARNING: observation not recorded: ${inlineText(acknowledgement.reason)}\n`);
  } catch (error) {
    environment.stderr(`WARNING: observation not recorded: ${inlineText(error instanceof Error ? error.message : 'sink delivery failed')}\n`);
  }
  return 0;
}
