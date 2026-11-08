# PostCode

> *Humans should be able to understand, design, direct and evaluate software without needing to read or write its programming language.*

PostCode is an interactive window onto software architecture. It aims to present a software project through established architectural concepts—such as responsibility, ownership, boundaries and state transitions—and support investigation in those terms. These investigations can concern existing implementations, hypothetical alternatives or intended designs. The goal is for these accounts to help humans and agents understand the software, explore design choices, direct implementation and evaluate the results, without requiring them to read source code.

Accounts preserve provenance, epistemological status and limitations, distinguishing derived facts, recorded assertions, observations and interpretations.

PostCode's Projections and Views are read-only: they do not directly modify the program or silently rewrite their underlying material. Humans continue to direct program changes by instructing implementation agents; PostCode-provided context can allow the terminology of the software investigation to also be used to direct changes.

See the [research product design](foundation/product-design.md) for conceptual commitments, the [application specification](docs/app-specification.md) for intended application behavior and high-level design, and the [capability reference](docs/capability-reference.md) for the current toolbox.

## Development

PostCode is expected to be implemented primarily by coding agents under human direction and review. The repository uses explicit plans, recorded architectural decisions, and durable task records so that development does not depend on transient agent conversations.

Once PostCode is minimally functional, the human directing the project will use it to understand and supervise further development of PostCode itself. Experience from that use will guide its continued development.

For the current project state, see [`STATUS.md`](STATUS.md). For plans, architecture, decisions, and the backlog, see the [documentation guide](docs/README.md).

Coding agents should begin with [`AGENTS.md`](AGENTS.md). The detailed development process is described in [`dev/workflow.md`](dev/workflow.md).

## Development CLI

The CLI opens one configured TypeScript project for an interactive investigation
or a single view. It presents qualified module inventories, repository/project
organization, group and module inspection, direct dependency relationships, and
qualified interpretations that support progressive investigation.
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
inspect documented --more-details
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
`--more-details` is available for inspection and dependency views. It shows qualified
information, requested module names, implementation names, captured locations and
organization metadata. It omits source excerpts in text and JSON. `--source-detail`
is rejected with guidance to use the new option. Analysis and investigators retain
captured source through their existing evidence interfaces.

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

Discovery inventories configured files treated as separate modules and visible
named module declarations, including interfaces to external dependencies. Files
treated as shared global code are not counted as modules. Diagnostics and unavailable export
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

### Progressive investigation

With [hosted investigation enabled](docs/hosted-investigation.md), use
`summarize <module>` for a terse functional account. In the same shell, select a
displayed investigram reference for `explain @investigram-…`,
`decompose @investigram-…` or `examine @investigram-…`. These lenses clarify an
account, produce smaller selectable aspects, or investigate it more deeply.
Replace the ellipsis with the exact displayed reference. `usage` reports known
provider usage, including failed work; unavailable charges remain unknown.

Hosted work is optional. Explicitly choose OpenAI API-key billing or Sign in with
ChatGPT and granted plan usage; PostCode never switches routes automatically.
Credentials use protected macOS storage. Setup and route selection are described
in the [hosted guide](docs/hosted-investigation.md).

Repeated requests reuse retained outcomes and make a fresh answer selection,
including accepted corrections and current associations. Warnings preserve unresolved
alternatives and reconsideration causes; they do not establish that an account is
wrong. `inspect @investigram-…` selects the original historical account with its
current revision context. In the shell, `present @answer-…` presents the exact selected
answer again. Add `--revision-page <n>` for further correction/cause rows or the
shown `--after @investigram-…` continuation for its frozen association listing.
`--json` and supported `--more-details` change presentation without selecting anew.
Every program View identifies fresh or retained selection and the answer's precise
ID and Session-local alias. One-shot references expire at command end.
Interpretations and their evidence remain qualified; they are not established
program truth or runtime observations.

All four lenses have live formative evidence, including useful corrections and
recorded failures, omissions and presentation limits. See the
[investigation reference](docs/cli-reference.md#progressive-investigation-and-usage)
for commands, associations, retention and paging, and [STATUS](STATUS.md) for current
capabilities and limitations. Follow-up investigations require a live shell;
one-shot `summarize` and `usage` operate in separate transient sessions.

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

Group `--more-details` shows captured paths and artifact/link metadata without
file contents. Organization and group views use the experimental
`postcode-organization-view/1` JSON schema. See the
[command reference](docs/cli-reference.md#organization-and-group-inspection) for
limits, scope, evidence qualifications, and navigation examples.

## Observability

Each accepted shell command and each one-shot view request submits an experimental
version-four observation batch to a timestamped local file under a UTC date
subdirectory of this PostCode checkout's `_observations/` directory. The CLI
discloses that absolute root destination on stderr.
The batch carries the session identifier and command order (1 for one-shot use),
plus the request, analysis context, command outcome, exact output, and any
produced view/attribution-disclosed event. Refusals, failures, interruption and invalidation
are recorded where possible without inventing a view. It can contain repository-derived documentation and
explicitly requested implementation locations and submitted feedback. Nothing is sent remotely. The local sink
creates its root and dated directories with mode `0700` and files with mode `0600`.

Observation output is Git-ignored and explicitly excluded from analysis, along
with PostCode's build output, including when a nested configuration is selected.
If retaining additional generated views/reports, keep them in `_observations/`
or outside the repository being analyzed. Git-ignore alone does not exclude
repository evidence. Sink failures produce a warning while preserving the view.
PostCode does not read historical observation streams or prescribe sink retention.
Do not commit real-project observations without explicit human approval.

Recorded output remains evidence of what PostCode displayed, but observations do not yet generally identify the captured program basis supporting it. The [bounded provenance correction](docs/backlog.md#preserve-captured-basis-attribution-in-observations) must precede reliance on newly collected observations for assessments requiring attribution to a particular program state.

These observations support later work by the
[PostCode Research Project](https://github.com/ronen/postcode-research).
Contemporaneous subjective-note capture and remote research export remain deferred.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

### Inadequacy feedback

Use `feedback` with an optional explanation, for example `feedback "The responsibility is unclear"`.
In the shell it concerns the most recently displayed investigation result; consecutive
reports retain that target. Help, usage and feedback acknowledgments do not replace it.
One-shot `node _build/src/cli.js feedback` accepts a context-free report without opening
a project or enabling an investigator. It uses `_observations/context-free/` under
the existing local observation root. `--json` changes the acknowledgment format.
Feedback records experience and starts no analysis, correction or program change.
Delivery failure is reported without invalidating the result or preventing continued use.
