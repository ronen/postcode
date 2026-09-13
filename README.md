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
with exported symbols for recognition. Generated handles use conceptual names or
declared exports, with short anonymous handles where no useful cue exists. They
are navigation aids, not inferred responsibility labels. Handle selection requires
`--snapshot <complete-snapshot-id>` copied from its inventory header; mismatched
snapshots produce an explicit no-current-match result. Exact names are current
lookups; full Entity IDs already contain snapshot context.

Normal output contains conceptual information and qualifications. Unicode and the
experimental `postcode-view/0` JSON presentation use the same qualified projection.
`--source-detail` is available only for inspection and shows supporting source
locations, separately identified as source escape. It does not show full files.

The default Unicode inventory lists project-associated modules with up to three
exports each. External modules are collapsed with an accurate count and a short
preview; their entries and details are omitted from display, not from analysis.
Symbol documentation belongs in inspection. Full Entity IDs and ordinary local
export provenance are suppressed in the Unicode inventory; aliases, forwarding,
multiple contributing declarations and differing qualifications remain visible.

JSON retains the full selected module list, full Entity IDs, up to six exports
and one documentation assertion per project-associated module/export. Its
inventory assertion excerpts are limited to 400 characters and five tags.
Inspection shows up to 50 exports and three assertions, with
2,000 characters and 20 tags. Tag text is limited to 300 characters. Every omitted
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
explicitly requested source locations. Nothing is sent remotely. The local sink
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
