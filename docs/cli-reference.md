# Command and concepts reference

PostCode opens one `tsconfig.json`-configured TypeScript project. From the PostCode
checkout, install with `npm ci` and build with `npm run build`.

## Commands

```sh
node _build/src/cli.js modules --project path/to/tsconfig.json
node _build/src/cli.js modules --project path/to/tsconfig.json --json
node _build/src/cli.js inspect --project path/to/tsconfig.json --snapshot SNAPSHOT -- MODULE_HANDLE
node _build/src/cli.js inspect --project path/to/tsconfig.json --snapshot SNAPSHOT --source-detail -- MODULE_HANDLE
node _build/src/cli.js --help
```

Replace `MODULE_HANDLE` with one exact name, generated handle, or compact Entity ID.
Replace `SNAPSHOT` with the full `snapshot:…` value from JSON. For convenience,
each CLI view supplies an inspection command with the selected configuration,
CLI location and full snapshot already filled in.
These command paths are invocation context, not discovered source evidence.

Without arguments, the command is `modules` with `./tsconfig.json` and Unicode
output. `--json` selects the experimental structured presentation. `--source-detail`
and `--snapshot` are inspection options. `--help` performs no analysis.

`--` ends option parsing: subsequent arguments are literal positional values.
For a module named `--json`, use `inspect --project path/to/tsconfig.json -- --json`.
Place all options, including `--json` and `--source-detail`, before the marker.
Generated inspection commands include this marker. Commands are omitted when
CLI or configuration paths contain control characters; the view instead gives
manual-inspection guidance. One exact selector is still
required; the marker does not enable multiple selectors.

Exit 0 means a view was produced, including a qualified or partial result. Exit 2
means invalid arguments or failure to open the project; exit 1 means an internal
failure. Project-open diagnostics include the file and one-based line/column
when TypeScript supplies them. Observation delivery failure is a visible warning
and preserves the view.

## First use

1. List modules.
2. Choose a mnemonic handle or precise Entity ID.
3. Run the generated inspection command with that subject.
4. Add `--source-detail` before `--` when source evidence is needed.

## Inventory and inspection

`modules(project)` inventories the configured module population. Unicode lists
project modules prominently, collapses other modules with counts, and shows up to
three exports per listed module. It is a menu for investigation, not a statement
of project purpose, architecture, runtime behavior, or dependencies.

`inspect(subjects)` selects exact module subjects from that population. One
referent can select zero, one, or several matches; a selected subset is explicit.
Inspection shows up to 50 exports per selected module, up to three module-level
documentation assertions, and up to three assertions per displayed export. The
per-export limit combines original-symbol and export-alias contributions.
JSON inventory retains the full module list, full identities, up to six exports,
and bounded project documentation. Neither format changes the lens population.

## Names, handles and identity

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
Generated cues matching compact Entity-ID syntax (`module-` plus 8–64 lowercase
hexadecimal characters) receive a `handle-` prefix. Their original cue provenance
is retained, while scoped Entity IDs remain precise and independently selectable.

A compact **Entity ID**, such as `module-a7bcf3e2`, precisely selects a module
within its snapshot. Digest prefixes start at eight hexadecimal characters and
extend when needed against the complete module population, including collapsed
modules. IDs are deterministic and collision-free within that population. A
complete reference is the pair of snapshot ID and Entity ID. JSON exposes
`projection.snapshot` and each module's `entityId` separately; its internal `id`
record key remains available for record references and compatibility.

A **snapshot** identifies captured inputs, environment and method versions. The
short Unicode snapshot label is for recognition, not a valid `--snapshot` value.
Handle and compact Entity ID selection require the full snapshot in the generated
command or JSON. A missing or stale scope produces no current match; repeated
handle or ID text does not imply continuity. Exact names are current-snapshot
lookups. If a name equals an existing compact Entity ID, omit `--snapshot` to
select by name; supplying the current snapshot selects precisely by that compact
ID. The named module remains separately addressable by its own scoped Entity ID.
Internal full record keys include snapshot scope and remain accepted.
There are no fuzzy matches, wildcard selectors, retained aliases, or durable
navigation sessions.

For example, an exporting source file `widget.ts` and a separate ambient
declaration `declare module "widget" { export const named: number; }` both receive
the handle `widget`. The ambient module also has the exact language name `widget`;
the source-file module remains conceptually anonymous.

| Selector (with the same `--project` configuration) | Result |
| --- | --- |
| `inspect --snapshot SNAPSHOT_ID -- widget` | Both modules: two genuine matches for the shared handle, with the count displayed. This is the result of replacing `MODULE_HANDLE` with `widget` in the generated command. |
| `inspect -- widget` | Only the ambient module, by its exact language name. Unscoped lookup does not select by handle. |
| `inspect --snapshot SNAPSHOT_ID -- ENTITY_ID` | Exactly the module identified by that Entity ID. |

Use the full snapshot value and the desired module's Entity ID from the inventory
when you need one precise selection; a shared handle does not promise uniqueness.

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
Ordinary local provenance may be suppressed; meaningful exceptions remain visible
in inspection.

## Source detail and observations

`--source-detail` is an explicit escape from conceptual information. It displays
locations and bounded excerpts supporting selected, displayed claims, grouped by
module and then export, with defining/forwarding source and documentation beneath
each item. This section precedes qualifications, run limitations and navigation.
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
to the PostCode checkout's `_observations/` directory. The destination is disclosed
on stderr. Batches contain request/context, the qualified view and exact output;
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
line-breaking and indentation controls as visible Unicode escapes. Documentation
and excerpts retain the renderer's structured wrapping. JSON retains the original
string values; display escaping does not alter stored claims or evidence.

The observation-destination disclosure and CLI diagnostic/warning values use the
same inline terminal-control escaping. Escaping changes the displayed text only;
it does not change filesystem destinations or recorded observation values.
