# PostCode

> *When coding agents do the coding, humans should be able to understand, direct, and supervise software development without ever needing to see programming-language source code.*

PostCode is an application for software development that aims to make that possible. It presents task-appropriate views of program structure, behavior, history, and rationale.

Those views preserve the provenance, epistemological status, and limitations of their content. They clearly distinguish between derived facts, recorded assertions, observations, and interpretations.

As an initial simplification, PostCode's projections and views are read-only. Humans continue to direct program changes by instructing coding agents in prose.

See [`foundation/product-design.md`](foundation/product-design.md) for the full conceptual design.

## Development

PostCode is expected to be implemented primarily by coding agents under human direction and review. The repository uses explicit plans, recorded architectural decisions, and durable task records so that development does not depend on transient agent conversations.

Once PostCode is minimally functional, the human directing the project will use it to understand and supervise further development of PostCode itself. Experience from that use will guide its continued development.

For the current project state, see [`STATUS.md`](STATUS.md). For plans, architecture, decisions, and the backlog, see the [documentation guide](docs/README.md).

Coding agents should begin with [`AGENTS.md`](AGENTS.md). The detailed development process is described in [`dev/workflow.md`](dev/workflow.md).

## Development CLI

The CLI opens one configured TypeScript project for an interactive investigation
or a single view. It presents qualified module inventories, repository/project
organization, group and module inspection, and direct dependency relationships.
Use Node.js 22.13 or later:

```sh
npm ci
npm run build
npm run --silent postcode -- shell
```

The default configuration is `tsconfig.json` in the current directory, so this
opens PostCode itself. Use `shell --project path/to/tsconfig.json` to choose another
project; the project stays fixed for that session. Opening with `--json` makes
JSON the default presentation for its commands. Run `npm test` and `npm run check`
for the test suite and type checking.

For a small example, open the exports fixture:

```sh
npm run --silent postcode -- shell --project fixtures/exports/tsconfig.json
```

Then enter commands at the PostCode prompt:

```text
modules
inspect documented
inspect documented --source-detail
dependencies
children documented
parents documented
organization repository
help
exit
```

Choose subsequent subjects from the displayed output. Plain selectors match one
exact group/module name or generated module handle, returning zero, one, or all
matches. For precise navigation within the shell, prefix a displayed Entity ID
with `@`: `inspect @module-…`, `children @module-…`, `parents @module-…`, or
`inspect @group-…`. Replace the ellipsis with the actual displayed reference.
Bindings stay fixed throughout that session. Handles are generated recognition
cues and do not establish conceptual names or responsibilities. Matching ID
spellings in another session do not restore the earlier investigation.

The shell requires a terminal; piped and command-file input are refused. Quoted
names and backslash escapes are supported. It does not execute target code or
operating-system commands. Use `help` for command syntax and `exit` or EOF to
close the session. EOF lets accepted work and its observation submission finish.

Completed applicable analysis is reused. Partial results are also reused while
their captured input basis is unchanged, retaining their qualifications. Later
dependency requests can acquire additional resolution inputs and permit another
partial attempt without rewriting earlier evidence or views. Sessions are
transient: there is no save/resume or history eviction. Memory can grow as new
requests and input bases accumulate; closing releases session state.

For one-shot use, omit `shell`. Each invocation opens a short-lived session for
one request; no arguments selects `modules`:

```sh
npm run --silent postcode
npm run --silent postcode -- modules --json
npm run --silent postcode -- inspect documented --project fixtures/exports/tsconfig.json
npm run --silent postcode -- organization project
npm run --silent postcode -- dependencies --project fixtures/dependency-journey/tsconfig.json
```

Use exact names/handles for one-shot selection. To navigate from a displayed ID,
open a shell and obtain a reference there. The retired `--snapshot` and
`--dependency-context` options are rejected, and output no longer includes
generated follow-up commands.

Normal output contains conceptual information and qualifications. Unicode and
experimental JSON retain the existing lens meanings and display bounds. Inputs
are assumed unchanged and captured as first observed, non-atomically. Best-effort
checks at command boundaries detect relevant changes and end the session;
restart explicitly to analyze changed inputs. There is no continuous file watch
or automatic refresh. See the [input-stability reference](docs/cli-reference.md#input-stability-and-retained-work)
for detection coverage and limits. Use `--` before literal selectors beginning
with `@` or `--`, for example
`inspect --project path/to/tsconfig.json -- --json`.
`--source-detail` is available for inspection and dependency views and shows supporting source
locations and bounded excerpts grouped by displayed concepts, separately identified
as source escape. File-level associations have no excerpt; it does not show full files.

The default Unicode inventory lists project-associated modules with up to three
export names each. External modules are collapsed with an accurate count; their entries and details are omitted from display, not from analysis.
Symbol documentation belongs in inspection. Compact Entity IDs accompany handles in the inventory. Inspection retains export
roles, aliases, forwarding and multiple contributing declarations. Consequential
qualifications remain visible in every affected view.
Common module anonymity/facets and successful analysis states are consolidated.
Display omissions are counted separately from analysis coverage. The default view
retains concise TypeScript coverage and run limitations; stable terminology is in
`--help` and the [command and concepts reference](docs/cli-reference.md).

JSON retains the full selected module list, compact IDs and internal record keys,
up to six exports
and one documentation assertion per project-associated module/export. Its
inventory assertion excerpts are limited to 400 characters and five tags.
Inspection shows up to 50 exports per selected module, up to three module-level
assertions, and up to three assertions per displayed export (combining original
symbol and alias contributions). Each assertion has up to 2,000 characters and
20 tags in JSON. Unicode limits each assertion to
eight wrapped content lines shared by prose and tags, with extra omissions counted.
Tag text is limited to 300 characters. Every omitted
export, assertion, tag or character is counted for displayed subjects; collapsed
modules' details are collectively disclosed as omitted. Conceptual documentation excerpts
omit fenced source examples and source-oriented `@example`/`@see` tags; the full
assertions remain stored with provenance. Documentation is a recorded
assertion, not proof of behavior or currency. Type-only forwarding may expose a
value symbol for type queries without exposing a runtime value; symbol roles and
export roles remain separate.

Discovery inventories external-module SourceFiles and visible named ambient
modules in the configured TypeScript Program, including external dependencies.
Global scripts are not inventorial modules. Diagnostics and unavailable export
routes qualify results; this command does not run a general type check. Exit code
0 indicates a produced view, which can contain qualified/partial expansions;
2 indicates usage, project-open failure or invalidation; 3 indicates an expected
analysis failure preventing a view; 1 indicates an internal failure; 130 indicates
interactive interruption. The shell continues after syntax or expected analysis
failures when state remains sound; internal failures and invalidation end it.
Ctrl-C cancels an idle input line; during work it terminates the analysis worker
and ends the session.

See the [architecture overview](docs/architecture/README.md),
[implementation conventions](docs/implementation-conventions.md),
[development process conventions](dev/process-conventions.md), and
[session-shell task record](records/tasks/2026-09-23-transient-session-shell.md) for implementation
boundaries, verification and review dispositions.

## Organization

`organization project` shows groups with direct or descendant modules from the
selected project and their ancestor context. `organization repository` includes
artifact-only groups throughout the enclosing Git worktree. Both use the same
group identities and direct relationships. Context-only siblings are labelled;
pruning and omitted module leaves are disclosed. A shared group expands once,
with subsequent occurrences marked as references.

Inspect a group's exact segment name to see all direct
parents, subgroups, member modules, documentation availability, and counts of
other unanalyzed artifacts. Exact names may match several groups and modules;
inspection sections distinguish the kinds. Groups have directory-segment names,
no generated handles or path selectors, and a contextual label for the unnamed
repository root.

Direct README/README.* existence establishes documentation availability; its
contents and applicability to descendants are not evaluated. Opaque repository
boundaries remain unanalyzed. Module presence is `direct`, `descendant-only`, or
`none`, with unknown presence separately qualified by incomplete evaluation.
External, unplaced, multiple, ambiguous, and unavailable placement outcomes retain
their distinctions. Layout is one organizational account, without architectural
role inference. A successfully opened project outside Git has unavailable
repository organization.

Group `--source-detail` shows captured paths and artifact/link metadata without
file contents. Organization and group views use the experimental
`postcode-organization-view/1` JSON schema. See the
[command reference](docs/cli-reference.md#organization-and-group-inspection) for
limits, scope, evidence qualifications, and navigation examples.

## Observability

Each accepted shell command and each one-shot view request submits an experimental
version-one observation batch to a timestamped local file under a UTC date
subdirectory of this PostCode checkout's `_observations/` directory. The CLI
discloses that absolute root destination on stderr.
The batch carries the session identifier and command order (1 for one-shot use),
plus the request, analysis context, command outcome, exact output, and any
produced view/source-escape event. Refusals, failures, interruption and invalidation
are recorded where possible without inventing a view. It can contain repository-derived documentation and
explicitly requested source locations and excerpts. Nothing is sent remotely. The local sink
creates its root and dated directories with mode `0700` and files with mode `0600`.

Observation output is Git-ignored and explicitly excluded from analysis, along
with PostCode's build output, including when a nested configuration is selected.
If retaining additional generated views/reports, keep them in `_observations/`
or outside the repository being analyzed. Git-ignore alone does not exclude
repository evidence. Sink failures produce a warning while preserving the view.
PostCode does not read historical observation streams or prescribe sink retention.
Do not commit real-project observations without explicit human approval.

These observations support later work by the
[PostCode Research Project](https://github.com/ronen/postcode-research).
Contemporaneous subjective-note capture and remote research export remain deferred.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
