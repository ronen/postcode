import path from 'node:path';
import { localFileObservationSink, observationBatch } from './observations.js';
import type { ObservationSink } from './observations.js';
import { openSession } from './session.js';
import type { ViewRequest } from './session.js';
import { inlineText } from './terminal-text.js';

const help = `PostCode — modules, organization and dependencies\n
Usage: postcode [modules | organization [project | repository] | inspect <exact-selector> | dependencies | children <exact-selector> | parents <exact-selector>] [--project <tsconfig.json>] [--json] [--source-detail]

Defaults: modules(project), ./tsconfig.json, Unicode text.
organization defaults to the configured project; repository selects the complete enclosing Git worktree organization.
inspect accepts one exact group/module name or module handle; zero/one/multiple matches are explicit.
Groups have segment names and group Entity IDs, with no handles or path selectors. The root has no intrinsic name.
Place options before -- to pass an option-like selector literally: inspect --json -- --help.
Exact names and generated handles are current lookups with zero, one, or multiple matches.
Entity references belong only to the session that produced them; one-shot IDs cannot navigate another invocation.
--source-detail supports inspect and dependency views and discloses source locations and bounded excerpts supporting displayed claims.
Group source detail shows captured paths and artifact metadata without documentation or other file contents.
JSON uses experimental postcode-view/1, postcode-organization-view/1 or postcode-dependency-view/1 schemas. Standard expansions are declared before evaluation.
Unicode inventory lists project modules with 3 export cues and collapses external modules with counts.
JSON lists all selected modules with up to 6 exports; inspection shows up to 50. Omissions are explicit.
Organization Unicode expands 150 groups, 6 levels, and 12 module leaves per group; JSON retains the full graph.
Project views retain direct artifact-only siblings and disclose pruned descent. Repeated groups expand once.
Group inspection lists all direct parents, subgroups, modules, and bounded artifact counts.
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
Names are current lookups. Generated handles are navigation cues, not responsibility claims; precise compact Entity IDs are session-local.
Inputs are assumed unchanged during analysis; capture is first-observed and non-atomic.
Restart after source or environment changes; references never imply a successor.
The interactive shell and its ambiguity-recovery journey are not available at this intermediate checkpoint.
Derived claims retain limitations. Documentation is a recorded assertion whose truth, currency and completeness are not established.
Export relationships describe aliases/forwarding, not calls or dependencies. Target code is not executed.
Generated-output locations are excluded by the input filter; the reported count is location boundaries, not files found.
See docs/cli-reference.md for commands, examples, reference scoping, qualifications and observations.
`;


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
  const positional: string[] = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]!;
    if (arg === '--') { positional.push(...args.slice(index + 1)); break; }
    if (arg === '--help' || arg === '-h') { environment.stdout(help); return 0; }
    if (arg === '--json') json = true;
    else if (arg === '--source-detail') sourceDetail = true;
    else if (arg === '--project') {
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
    || (focused && positional.length !== 2)
    || (sourceDetail && !focused && !dependencyLens)) {
    environment.stderr('Usage error: use modules, organization [project | repository], inspect <selector>, dependencies, children <selector>, or parents <selector>; --source-detail requires inspect or a dependency view.\n');
    return 2;
  }
  const destination = path.resolve(environment.checkout, '_observations');
  const opened = openSession({ configPath: config, excludedOutputDirectories: [
    destination, path.resolve(environment.checkout, '_build'),
  ] });
  if (opened.status !== 'opened') {
    environment.stderr(`Project open failed:\n${opened.diagnostics.map(diagnostic => `  TS${diagnostic.code}: ${inlineText(diagnostic.message)}`).join('\n')}\n`);
    return 2;
  }
  const { session } = opened;
  try {
    const { view, rendered, repositoryRoot, methods } = session.execute({ lens: lens as ViewRequest['lens'],
      selector: focused ? positional[1]! : null,
      subject: positional[1] === 'repository' ? 'repository' : 'project',
      presentation: { format: json ? 'json' : 'unicode', sourceDetail },
    });
    environment.stdout(rendered);
    environment.stderr(`Local observations: ${inlineText(destination)} (may contain repository-derived text and explicitly requested source locations).\n`);
    const batch = observationBatch(view, rendered, { configPath: config, repositoryRoot, methods }, 1);
    try {
      const acknowledgement = await (environment.sink ?? localFileObservationSink(destination)).submit(batch);
      if (!acknowledgement.accepted) environment.stderr(`WARNING: observation not recorded: ${inlineText(acknowledgement.reason)}\n`);
    } catch (error) {
      environment.stderr(`WARNING: observation not recorded: ${inlineText(error instanceof Error ? error.message : 'sink delivery failed')}\n`);
    }
    return 0;
  } finally { session.close(); }
}
