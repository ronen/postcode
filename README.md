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

The development CLI opens one configured TypeScript project and presents qualified
`modules(project)` and exact-selection `inspect(subjects)` views. Use Node.js
22.13 or later:

```sh
npm ci
npm run build
npm run --silent postcode
npm run --silent postcode -- --project fixtures/exports/tsconfig.json
npm run --silent postcode -- inspect documented --project fixtures/exports/tsconfig.json
npm run --silent postcode -- inspect documented --project fixtures/exports/tsconfig.json --source-detail
npm run --silent postcode -- --json
npm test
npm run check
```

The default configuration is `tsconfig.json` in the current directory. Inspection
accepts one exact module name, generated handle, or Entity ID from an inventory.
One referent can match zero, one, or several modules; it never falls back to fuzzy
matching. IDs and handles are scoped to the analyzed snapshot. Source-backed
modules without a compiler-established conceptual name are shown as anonymous,
with generated handles for recognition. Handles use language names, extensionless
basenames, or declared exports, with an honest anonymous fallback. They preserve
their generated provenance and do not claim responsibilities or conceptual names.
Compact Entity IDs are precise within the full snapshot population, extending
hash prefixes on collision. Handle and compact ID selection require
`--snapshot <complete-snapshot-id>` supplied by the generated command or JSON;
mismatched snapshots produce no current match. Exact names are current lookups.

Normal output contains conceptual information and qualifications. Unicode and the
experimental `postcode-view/0` JSON presentation use the same qualified projection.
The suggested inspection command includes the explicit CLI and selected-project
paths as invocation context; replace only its subject. A short snapshot label is
displayed in the header, while that command retains the full required snapshot.
`--source-detail` is available only for inspection and shows supporting source
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
Inspection shows up to 50 exports and three assertions, with
up to 2,000 characters and 20 tags in JSON. Unicode limits each assertion to
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
2 indicates a usage or project-open failure; 1 indicates an internal failure.

See the [architecture overview](docs/architecture/README.md),
[development conventions](dev/conventions.md), and
[active task](records/tasks/2026-09-12-initial-module-inventory.md) for implementation
boundaries and outstanding validation/review gates.

## Observability

Normal view-producing invocations automatically submit one experimental
version-zero observation batch to a local file under this PostCode checkout's
`_observations/` directory. The CLI discloses that absolute destination on stderr.
The batch includes the request, analysis context, qualified view, exact output,
and any source-escape event. It can contain repository-derived documentation and
explicitly requested source locations and excerpts. Nothing is sent remotely. The local sink
creates its directory with mode `0700` and files with mode `0600`.

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
