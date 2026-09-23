# Command and concepts reference

PostCode opens one `tsconfig.json`-configured TypeScript project. From the PostCode
checkout, install with `npm ci` and build with `npm run build`.

## Commands

```sh
node _build/src/cli.js modules --project path/to/tsconfig.json
node _build/src/cli.js modules --project path/to/tsconfig.json --json
node _build/src/cli.js organization project --project path/to/tsconfig.json
node _build/src/cli.js organization repository --project path/to/tsconfig.json --json
node _build/src/cli.js inspect --project path/to/tsconfig.json -- MODULE_HANDLE
node _build/src/cli.js inspect --project path/to/tsconfig.json --source-detail -- MODULE_HANDLE
node _build/src/cli.js dependencies --project path/to/tsconfig.json
node _build/src/cli.js children --project path/to/tsconfig.json -- MODULE_HANDLE
node _build/src/cli.js parents --project path/to/tsconfig.json -- MODULE_HANDLE
node _build/src/cli.js --help
```

Replace `MODULE_HANDLE` with one exact name or generated handle. A lookup can
match zero, one, or multiple subjects. Each command opens a short-lived session;
Entity IDs in its output are local to that session and cannot navigate another
invocation. No generated follow-up commands are emitted.

This is the one-shot checkpoint of the [session plan](plans/transient-session-shell.md).
The interactive prompt, accumulating analysis and change detection follow review.
Until the prompt is available, ambiguous one-shot lookups display every match
without a public mechanism for selecting one of their session-local IDs.

Without arguments, the command is `modules` with `./tsconfig.json` and Unicode
output. `--json` selects the experimental structured presentation. `--source-detail`
supports inspection and dependency views. The retired `--snapshot` and
`--dependency-context` options are rejected. `--help` performs no analysis.

`--` ends option parsing: subsequent arguments are literal positional values.
For a module named `--json`, use `inspect --project path/to/tsconfig.json -- --json`.
Place all options, including `--json` and `--source-detail`, before the marker.
One exact selector is still
required; the marker does not enable multiple selectors.

Exit 0 means a view was produced, including a qualified or partial result. Exit 2
means invalid arguments or failure to open the project; exit 1 means an internal
failure. Project-open diagnostics include the file and one-based line/column
when TypeScript supplies them. Observation delivery failure is a visible warning
and preserves the view.

## First use

1. List modules.
2. Choose an exact name or mnemonic handle.
3. Run `inspect NAME_OR_HANDLE --project path/to/tsconfig.json`.
4. Add `--source-detail` before `--` when source evidence is needed.

## Inventory and inspection

`modules(project)` inventories the configured module population. Unicode lists
project modules prominently, collapses other modules with counts, and shows up to
three exports per listed module. It is a menu for investigation, not a statement
of project purpose, architecture, runtime behavior, or dependencies.

`inspect(subjects)` selects exact group and module subjects. One
referent can select zero, one, or several matches; a selected subset is explicit.
Inspection shows up to 50 exports per selected module, up to three module-level
documentation assertions, and up to three assertions per displayed export. The
per-export limit combines original-symbol and export-alias contributions.
JSON inventory retains the full module list, full identities, up to six exports,
and bounded project documentation. Neither format changes the lens population.

## Organization and group inspection

`organization project` (also `organization`) selects groups containing a direct
or descendant module of the opened project, plus their full ancestor closure.
`organization repository` selects the complete repository-layout population.
Neither changes a retained group's direct relationships. Context-only direct
subgroups remain reachable in the project view even when descent is pruned.

```sh
node _build/src/cli.js organization project --project path/to/tsconfig.json --json
node _build/src/cli.js inspect --project path/to/tsconfig.json -- GROUP_NAME
node _build/src/cli.js inspect --project path/to/tsconfig.json --source-detail -- GROUP_NAME
```

Replace `GROUP_NAME` with an exact group segment name. Inspect a documented
group, then look up a subgroup name or direct module handle. Repeated group names
return all matches, sectioned from any matching modules.

Group inspection shows all direct parents, subgroups and modules, with IDs and
salient group annotations. It counts direct documentation artifacts and other
unanalyzed artifacts, including opaque boundaries. Direct presence does not deny
descendant membership. `none` means completed placement found no selected-project
modules in that group or its descendants. Unknown presence is qualified evaluation
state, not a fourth property value. Documentation existence is direct and is not
inherited. Module placement exceptions are grouped by outcome, with established
multiple locations separated from uncertain candidates and unavailable evidence.

Unicode organization expands at most 150 distinct groups, through depth 6 (root
depth 0), with 12 module leaves per expanded group. It expands a repeated group
once and marks later occurrences as references. Selected-group omissions, pruned
descents, repeated references, and omitted module placements are separate counts.
JSON retains the full selected graph and direct relationships. Its adjacent
group summaries have `detail: "not-requested"`; their empty detail arrays are not
claims of absent relationships. Group inspection lists all direct relationships
and uses aggregate counts for other artifacts. Ordinary output includes names,
IDs and qualifications; link mechanics and repository paths require source detail.

Organization and group views use `postcode-organization-view/1-experimental`.
Module-only inspections retain `postcode-view/1-experimental`. Mixed inspection
embeds the existing qualified module view in `moduleDetail`. Both are experimental
schemas; observation records retain the exact view and rendered output.

Group source detail identifies the absolute repository root and group paths,
repository-relative artifact paths, artifact kinds, and qualified link evidence.
Link evidence includes incoming links that establish the group's parents;
the artifact list retains only artifacts placed directly in the inspected group.
It reads the already captured evidence and includes no documentation or artifact
contents. Source-escape observation levels distinguish `organization-paths`,
`organization-and-module-source`, and the existing
`declaration-locations-and-excerpts` module detail.

The enclosing Git worktree supplies current tracked and visible untracked
artifacts. Deleted artifacts and ignored untracked contents are absent. Empty
directories do not induce groups. Direct README/README.* artifacts establish
documentation availability, except opaque submodule/nested-repository boundaries.
Repository/local/global exclusion policies and explicit generated-output
locations remain qualified. Ordinary artifact contents do not affect organization
identity unless independently observed as compiler inputs. Captured metadata,
exclusion policy, link evidence, and provider methods remain in the captured analysis support.
First-observed inputs are non-atomic; sparse-checkout completeness remains unresolved.

A missing or unusable project fails before any view. After opening, unavailable
repository evidence yields a qualified unavailable organization; no project-layout
fallback is invented outside Git. Repository coverage is independent of module
placement coverage: a partial module provider can retain complete repository
groups and known direct placements. The current eager TypeScript provider's
incomplete states are covered by synthetic-provider tests. This view establishes
layout relationships rather than dependencies or architectural responsibilities.

Every CLI invocation opens and evaluates afresh. Earlier latency evidence is
preserved in the [measurements](../records/validation/2026-09-21-analysis-latency.md);
those measurements do not establish session reuse.

## Names, handles and identity

Groups have one intrinsic directory-segment name and a compact `group-…` Entity
ID, abbreviated against the complete repository group population. The root has
no intrinsic name and is displayed as `[repository root]`. This display label
and repository paths are not selectors. Groups have no generated handles.
Repeated group names and exact group/module name collisions return every match,
sectioned by kind. Precise Entity IDs belong to the producing session.

A **name** is established by the language model. Ordinary source-file modules
usually have no conceptual TypeScript name; path-derived compiler symbols do not
supply one. Explicit language naming mechanisms and named ambient modules can.

A **handle** is a generated recognition cue, not a responsibility claim or precise
identifier. It uses a language name, then an extensionless source basename when
non-generic, then a representative declared export, then `anonymous`. Generic
basenames (`index`, `main`, `entry`, `mod`) fall back to exports or anonymity.
Type-heavy fallback candidates prefer a type export over a helper predicate.
Basename evidence exposes no directory, extension or source location and does not
become a conceptual name. JSON retains `handleStatus` and `handleProvenance`.
Handles may repeat; one handle can select several modules.
Generated cues matching compact Entity-ID syntax (`module-` or `group-` plus 8–64 lowercase
hexadecimal characters) receive a `handle-` prefix. Their original cue provenance
is retained, while scoped Entity IDs remain precise and independently selectable.

A compact **Entity ID**, such as `module-a7bcf3e2`, names an entity in a
session. The current single-request implementation abbreviates digest prefixes
against its complete population, including collapsed modules. The growth-safe
binding allocator belongs to the next implementation checkpoint. These IDs have
no cross-invocation selection contract, even if their spellings repeat.

A **session** is the analysis and reference context, independently of which
inputs have been observed. JSON exposes `projection.session`; this identifier
is also present in its observation batch. It is not an input digest or evidence
of freshness. Supporting inputs, method versions and captured source evidence
remain attached to program claims. Inputs are assumed stable during analysis;
capture is first-observed and non-atomic. No continuing-session invalidation
mechanism is exposed at this checkpoint.

One-shot lookups match the union of exact names and generated handles. A language
name that looks like `module-a7bcf3e2` remains an ordinary exact lookup. There are
no fuzzy matches, wildcard selectors, retained aliases, or durable sessions.

For example, a source module cued by `widget.ts` and an ambient module named
`widget` both match `inspect widget`. Both are shown; neither is chosen implicitly.
The planned shell will let a human repeat an ambiguous lookup and select one
of its displayed references in that same session. Opening a shell with an ID
copied from a one-shot command will not restore the earlier session.

## Analysis coverage and display omissions

Analysis **materialization** describes what records were established for a
capability. Full materialization does not mean every record is displayed or that
the entire program is correct. Partial, unavailable, deferred, stopped and failed
states remain explicit; missing results cannot establish an empty set.

The compact successful state names completed capabilities. Unicode retains the
status and limitations needed to interpret its claims; JSON supplies fuller
context and machine-readable detail. `(none)` denotes an established empty export
set and differs from an actual export named `none`. Inventory shows export names;
type/value roles and exceptional export provenance remain available in inspection.

The structured presentation's `expansions` field lists each requested expansion
kind once. Per-module execution and materialization belong to the qualified
`evaluations` records, not repeated entries in that kind list.

**Display omissions** describe presentation choices: collapsed module entries and
their details, unlisted exports, and omitted documentation. Aggregate export and
documentation-module counts refer to listed modules, excluding the separately
collapsed group. A module can contribute to the documentation omission count even
when its documented export is outside the small export cue. Inspection discloses
assertion, character and tag omissions locally, without repeating an aggregate
item that could imply all module documentation was absent.
Unicode wraps documentation to 88-character lines including its indentation; the
stored assertion remains unchanged. Each Unicode assertion has at most eight
wrapped content lines shared by prose and tags, excluding labels and omission
notices. Additional characters/tags omitted by this height bound are counted.
JSON inspection retains up to 2,000 prose characters and 20 tags per assertion,
with up to 300 characters per tag.

## Supported TypeScript population and qualifications

The population is external-module SourceFiles and visible named ambient-module
symbols in the selected configured TypeScript Program. It includes reached
external declarations; global scripts are not modules. Other compiler module
categories and other project configurations are not established by this lens.

TypeScript analysis establishes qualified module/export information; it does not
execute target code or run unrelated semantic checks merely to collect diagnostics.
Encountered diagnostics and unresolved or unsupported analysis paths qualify
affected results. Inputs are memoized as first observed, not captured atomically.

Compiler-associated documentation is a **recorded assertion**. One view-level
qualification states that truth, currency and completeness are not established.
Ordinary local labels say `Documentation`; when original-symbol and alias
contributions differ, human-readable provenance labels distinguish them. An export
relationship describes aliases, origins or forwarding, not calls or dependencies.
Forwarding evidence retains distinct declaration steps across reachable module/name
states, including converging and cyclic routes; it does not enumerate every complete
path. A value role requires a reachable route without a type-only step.
Ordinary local provenance may be suppressed; meaningful exceptions remain visible
in inspection.

## Source detail and observations

`--source-detail` is an explicit escape from conceptual information. It displays
locations and bounded excerpts supporting selected, displayed claims, grouped by
module and then export, with defining/forwarding source and documentation beneath
each item. This section precedes qualifications and run limitations.
Ranges use one-based lines and UTF-16 columns, with exclusive ends. Excerpts
retain at most four source lines and 300 Unicode characters per evidence span;
omitted characters are counted. Wrapped
source lines use `↪` in Unicode. File-level module associations are labeled and
have no excerpt. Full claim record keys remain in JSON.

Evidence comes from already captured compiler inputs; rendering never rereads the
filesystem. Narrow variable, binding and import/export-specifier spans expand to
their enclosing declaration statement so the snippet includes meaningful syntax.
Forwarding statements and semantic-symbol definitions remain distinct; shared
export/symbol spans are shown once within each export. Excerpts remain bounded,
so they support investigation without replacing the qualified compiler claim.
This is not full-file rendering or arbitrary source browsing. The invocation
records source-escape use at the locations-and-excerpts level alongside the view.

Every view-producing CLI invocation submits one self-contained observation batch
to a `date=YYYY-MM-DD` UTC subdirectory of the PostCode checkout's
`_observations/` directory. Each filename starts with its filesystem-safe UTC
submission timestamp and ends with the batch UUID. The root destination is disclosed
on stderr. Format-version-1 batches carry `session` and `command` (1 for one-shot),
with independent batch/event UUIDs. They contain request/context, the qualified view and exact output;
they may contain repository-derived text and explicitly requested source detail.
Nothing is sent remotely. Files are created with private permissions and ignored
by Git. The producer does not read historical batches or prescribe retention.

Caller-supplied generated-output locations are excluded before configuration and
compiler input reads, including imported files and symlink targets. The run's exclusion
count is the distinct location boundaries enforced by that filter, not a count of
generated files found or read. A configured location can be absent or outside the
selected roots and still be protected against resolution into it. Git-ignore alone
does not establish this exclusion. Keep additional generated views in the excluded
`_observations/` directory or outside the analyzed repository.

Unicode inline values (names, selectors, qualifications and source paths) display
line-breaking, indentation and Unicode bidirectional formatting controls as visible
Unicode escapes. Operational paths retain their original values internally. Documentation
and excerpts retain the renderer's structured wrapping. JSON retains the original
string values; display escaping does not alter stored claims or evidence.

The observation-destination disclosure and CLI diagnostic/warning values use the
same inline terminal-control escaping. Escaping changes the displayed text only;
it does not change filesystem destinations or recorded observation values.


## Dependency investigation

`dependencies` shows direct project dependency structure. A dependency parent depends
directly on a dependency child. `children` selects outgoing relationships and
source-owned request results without edges; `parents` selects established incoming
project relationships. Each accepts the same exact module names and generated
handles as module inspection. Groups are not dependency
subjects. Zero, one and multiple matches remain explicit.

Start with `dependencies --project fixtures/dependency-journey/tsconfig.json`,
then use `children right`, `parents shared`, or `inspect forward` with the same
`--project` option. These are new lookups in independent short-lived sessions.
Options go before `--` when the selector resembles an option.

Project modules form the root and cycle population, including isolated modules. Roots
have no established project dependency parents; they do not imply entry points or
importance. Cycles are generated groupings, not entities, and retain every member and
internal relationship. Shared children retain one identity. External modules appear
as opaque leaves: a parent view can show known incoming relationships, but a child
view cannot establish an empty external interior.

Unicode expands at most 60 components through depth 6 and displays at most 200
relationships. JSON retains the complete graph and relationships. Unicode shows up
to 20 supporting occurrences per displayed edge, JSON up to 50. Request results and
recognition-coverage details are bounded to 20/50 respectively; structure summarizes
request results unless source detail is requested. Omission counts describe display,
not analysis. Incomplete dependency evaluations retain known components without
establishing roots or false empty results.

Recognized unresolved literals, target-indeterminate nonliteral calls, and targets
outside the discovered population are request results, never fabricated modules or
edges. Recognition-coverage outcomes separately record unsupported shapes, missing
ownership, and unavailable/conflicting evidence. Parent views cannot attribute a
request without an established child to the selected target, so they explain this
limit without copying source-owned coverage records. Every dependency view states the
bounded CommonJS rule: bare, one-argument `require`, completed lexical evidence, and
affirmative captured context. Recognition establishes no runtime loader or execution.
Other mechanisms remain distinguishable; only an edge whose every occurrence has
explicit type-only evidence is labelled type-only. An unmarked edge makes no value
or runtime claim.

The `re-exports only` annotation is an independently qualified syntax property; it
is neither an API label nor a safe-collapse recommendation. It appears in module and
organization views as well as dependency views. Evaluation unavailability remains
separate from absence of a positive claim. Discovery classifications are exposed as
`discoveryFacets` in experimental JSON, with composition outside that array.
An empty named re-export, `export {} from './target'`, is a supported direct
re-export for this property; the bare module marker `export {};` prevents it.
This syntax distinction does not establish runtime behavior or side-effect freedom.

Requested repository-layout expansion compares occurrence-specific source and target
placements. Results may be same-group, into-descendants, outward, varies-by-placement,
or varies-by-occurrence, or remain unestablished. None establishes architectural
policy. Missing repository organization weakens only the expansion.

`--source-detail` exposes captured occurrence syntax, locations, target-resolution
basis and file evidence, recognition outcomes, and organization placement/containment
support without rereading files. It bounds source evidence to 100 records and
organization claims to 50, with per-claim occurrence and evidence omissions explicit.
Ordinary views omit raw syntax and source paths. The experimental schema is
`postcode-dependency-view/1-experimental`; observations retain its request, outcomes,
qualifications, display bounds and rendered output. Source escape uses the
`dependency-occurrences-and-organization-evidence` level.

Dependency resolution can observe inputs not needed by ordinary inventory.
Ordinary organization and inspection do not silently request dependencies.
`--dependency-context` has been retired because reproducing snapshot scope was
its only purpose; handles no longer require such scope.

Dependency views define organization-relative labels and distinguish their projection
population from the full discovered population available to exact lookup. Cycle headers
list members without implying extra pairwise edges. Request and recognition rows use
view-local `Request N` and `Coverage N` labels; these are not entity selectors. The
source-detail command exposes captured support for the selected view, prioritizing
non-edge and recognition evidence within its source bound. Module composition badges
are separated from relationship mechanism labels.

Every one-shot command evaluates current inputs afresh. Explicit source detail
uses evidence captured for that command. Unknown request ownership and known
ownership omitted from display remain distinct.

Fresh analysis can still take several seconds on larger configured projects.
Evidence preparation reuses each captured file's content digest within the current
analysis, avoiding repeated hashing without retaining analysis between commands.
The [latency measurements](../records/validation/2026-09-21-analysis-latency.md)
show the measured improvement and its limits. Each command currently has its own short-lived session and observation. Native
SIGINT can terminate compiler-backed work; the process and transient state end.
An interrupted process may not submit an observation. Shell interruption handling
is a later checkpoint.
