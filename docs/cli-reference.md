# Command and concepts reference

PostCode opens one `tsconfig.json`-configured TypeScript project. From the PostCode
checkout, install with `npm ci` and build with `npm run build`.

## Commands

```sh
node _build/src/cli.js modules --project path/to/tsconfig.json
node _build/src/cli.js modules --project path/to/tsconfig.json --json
node _build/src/cli.js inspect SUBJECT --project path/to/tsconfig.json --snapshot SNAPSHOT
node _build/src/cli.js inspect SUBJECT --project path/to/tsconfig.json --snapshot SNAPSHOT --source-detail
node _build/src/cli.js --help
```

Replace `SUBJECT` with one exact name, generated handle, or full Entity ID.
Replace `SNAPSHOT` with the full `snapshot:…` value from JSON. For convenience,
each CLI view supplies an inspection command with the selected configuration,
CLI location and full snapshot already filled in; replace only `SUBJECT` there.
These command paths are invocation context, not discovered source evidence.

Without arguments, the command is `modules` with `./tsconfig.json` and Unicode
output. `--json` selects the experimental structured presentation. `--source-detail`
and `--snapshot` are inspection options. `--help` performs no analysis.

Exit 0 means a view was produced, including a qualified or partial result. Exit 2
means invalid arguments or failure to open the project; exit 1 means an internal
failure. Observation delivery failure is a visible warning and preserves the view.

## Inventory and inspection

`modules(project)` inventories the configured module population. Unicode lists
project modules prominently, collapses other modules with counts, and shows up to
three exports per listed module. It is a menu for investigation, not a statement
of project purpose, architecture, runtime behavior, or dependencies.

`inspect(subjects)` selects exact module subjects from that population. One
referent can select zero, one, or several matches; a selected subset is explicit.
Inspection shows up to 50 exports and three documentation assertions per subject.
JSON inventory retains the full module list, full identities, up to six exports,
and bounded project documentation. Neither format changes the lens population.

## Names, handles and identity

A **name** is established by the language model; a file path is not a conceptual
module name. Modules without such a name remain anonymous. A **handle** is a
deterministic recognition cue drawn from a module name or declared export, with
anonymous fallbacks. Type-heavy modules prefer an actual type export over a helper
predicate. Handles do not classify responsibilities and can have multiple matches.

An **Entity ID** addresses a record within its analysis snapshot. A **snapshot**
identifies captured inputs, environment and method versions. The short Unicode
snapshot label is for recognition, not a valid `--snapshot` argument. Full IDs and
full snapshots remain in JSON and in operational commands where required.

Handle selection requires the full snapshot from its inventory. A missing or stale
snapshot produces no current match; repeated handle text does not imply continuity.
Exact names are current-snapshot lookups and do not require `--snapshot`. Full
Entity IDs already contain their snapshot. There are no fuzzy matches, wildcard
selectors, retained aliases, or durable navigation sessions.

## Analysis coverage and display omissions

Analysis **materialization** describes what records were established for a
capability. Full materialization does not mean every record is displayed or that
the entire program is correct. Partial, unavailable, deferred, stopped and failed
states remain explicit; missing results cannot establish an empty set.

The compact successful state names completed capabilities. Detailed scope counts,
Claim context, guarantees and limitations remain in JSON. `Exports: none` is used
only when the module's effective export set is established as empty.

**Display omissions** describe presentation choices: collapsed module entries and
their details, unlisted exports, and omitted documentation. Aggregate export and
documentation-module counts refer to listed modules, excluding the separately
collapsed group. A module can contribute to the documentation omission count even
when its documented export is outside the small export cue. Inspection still
discloses assertion, character and tag omissions locally.

## Supported TypeScript population and qualifications

The population is external-module SourceFiles and visible named ambient-module
symbols in the selected configured TypeScript Program. It includes reached
external declarations; global scripts are not modules. Other compiler module
categories and other project configurations are not established by this lens.

TypeScript analysis establishes qualified module/export information; it does not
execute target code or run unrelated semantic checks merely to collect diagnostics.
Encountered diagnostics and unresolved or unsupported analysis paths qualify
affected results. Inputs are memoized as first observed, not captured atomically.

Compiler-associated documentation is a **recorded assertion**. The local
`doc [recorded assertion]` marker does not establish its truth, currency or
completeness. An export relationship describes aliases, origins or forwarding,
not calls or dependencies. Ordinary local provenance may be suppressed; meaningful
exceptions remain visible for displayed exports.

## Source detail and observations

`--source-detail` is an explicit escape from conceptual information. It displays
only source locations supporting selected, displayed claims, separately marked.
It does not provide full-file rendering or arbitrary source browsing. The invocation
records source-escape use alongside the produced view.

Every view-producing CLI invocation submits one self-contained observation batch
to the PostCode checkout's `_observations/` directory. The destination is disclosed
on stderr. Batches contain request/context, the qualified view and exact output;
they may contain repository-derived text and explicitly requested source detail.
Nothing is sent remotely. Files are created with private permissions and ignored
by Git. The producer does not read historical batches or prescribe retention.

Known generated-output locations are excluded before configuration and compiler
input reads, including imported files and symlink targets. The run's exclusion
count is the distinct location boundaries enforced by that filter, not a count of
generated files found or read. A configured location can be absent or outside the
selected roots and still be protected against resolution into it. Git-ignore alone
does not establish this exclusion. Keep additional generated views in the excluded
`_observations/` directory or outside the analyzed repository.
