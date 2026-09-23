import path from 'node:path';
import type { ViewRequest } from './session.js';
import { inlineText } from './terminal-text.js';

export const help = `PostCode — modules, organization and dependencies\n
Usage: postcode shell [--project <tsconfig.json>] [--json]
       postcode [modules | organization [project | repository] | inspect <exact-selector> | dependencies | children <exact-selector> | parents <exact-selector>] [--project <tsconfig.json>] [--json] [--source-detail]

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
Open postcode shell to resolve ambiguous lookups, then inspect @<displayed-reference>.
Shell commands use the same lenses and options, plus help and exit. Single/double quotes and backslash escapes are supported.
Use -- before a literal selector beginning @. References remain bound; names and handles are lookups.
The shell requires terminal input. Ctrl-C cancels an idle line; during analysis it ends the session.
Detection of relevant input changes invalidates the session; restart is required.
Derived claims retain limitations. Documentation is a recorded assertion whose truth, currency and completeness are not established.
Export relationships describe aliases/forwarding, not calls or dependencies. Target code is not executed.
Generated-output locations are excluded by the input filter; the reported count is location boundaries, not files found.
See docs/cli-reference.md for commands, examples, reference scoping, qualifications and observations.
`;

export type ParsedCommand = { kind: 'help' } | { kind: 'exit' } | { kind: 'error'; message: string }
  | { kind: 'shell'; configPath: string; json: boolean }
  | { kind: 'view'; configPath: string; request: ViewRequest };

export function parseCommand(args: readonly string[], cwd: string, interactive = false, defaultJson = false): ParsedCommand {
  let configPath = path.join(cwd, 'tsconfig.json'), json = defaultJson, sourceDetail = false, literal = false;
  const positional: string[] = [];
  const error = (message: string): ParsedCommand => ({ kind: 'error', message: `Usage error: ${message}\n` });
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]!;
    if (arg === '--') { positional.push(...args.slice(index + 1)); literal = true; break; }
    if (arg === '--help' || arg === '-h') return { kind: 'help' };
    if (arg === '--json') json = true;
    else if (arg === '--source-detail') sourceDetail = true;
    else if (arg === '--project') {
      if (interactive) return error('a shell keeps its opened project; exit to choose another.');
      const next = args[++index];
      if (!next || next.startsWith('--')) return error('--project requires a configuration path.');
      configPath = path.resolve(cwd, next);
    } else if (arg.startsWith('--')) return error(`unknown option ${inlineText(arg)}.`);
    else positional.push(arg);
  }
  const lens = positional[0] ?? 'modules';
  if (interactive && ['help', 'exit'].includes(lens) && args.length === 1) return { kind: lens as 'help' | 'exit' };
  if (!interactive && lens === 'shell' && positional.length === 1 && !sourceDetail) return { kind: 'shell', configPath, json };
  const focused = ['inspect', 'children', 'parents'].includes(lens);
  const dependency = ['dependencies', 'children', 'parents'].includes(lens);
  if (!['modules', 'inspect', 'organization', 'dependencies', 'children', 'parents'].includes(lens)
    || (['modules', 'dependencies'].includes(lens) && positional.length > 1)
    || (lens === 'organization' && (positional.length > 2 || !['project', 'repository'].includes(positional[1] ?? 'project')))
    || (focused && positional.length !== 2) || (sourceDetail && !focused && !dependency)) {
    return error('use modules, organization [project | repository], inspect <selector>, dependencies, children <selector>, or parents <selector>; --source-detail requires inspect or a dependency view.');
  }
  const selector = focused ? positional[1]! : null;
  const reference = interactive && !literal && selector?.startsWith('@') === true;
  return { kind: 'view', configPath, request: { lens: lens as ViewRequest['lens'],
    selector: reference ? selector!.slice(1) : selector, ...(reference ? { reference: true } : {}),
    subject: positional[1] === 'repository' ? 'repository' : 'project', presentation: { format: json ? 'json' : 'unicode', sourceDetail } } };
}

/** Deliberately a tokenizer, without interpolation, pipes, redirection or execution. */
export function commandWords(line: string): readonly string[] {
  const words: string[] = [];
  let word = '', quote: string | null = null, escaped = false, started = false;
  for (const character of line) {
    if (escaped) { word += character; escaped = false; started = true; }
    else if (character === '\\' && quote !== "'") { escaped = true; started = true; }
    else if (quote) { if (character === quote) quote = null; else word += character; }
    else if (character === '"' || character === "'") { quote = character; started = true; }
    else if (/\s/.test(character)) { if (started) words.push(word); word = ''; started = false; }
    else { word += character; started = true; }
  }
  if (quote || escaped) throw new Error('Usage error: unfinished quote or escape.\n');
  if (started) words.push(word);
  return words;
}
