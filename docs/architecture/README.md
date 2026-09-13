# Implemented architecture

The development CLI opens one configured TypeScript project, evaluates module
inventory and presentation-declared standard expansions, constructs stored
`modules(project)` or exact-selection `inspect(subjects)` projections, and presents
a qualified Unicode or experimental JSON view. Every produced view submits a
self-contained observation batch to a separate local sink. The initial slice's
instrument validation and independent reviews are recorded in the
[completed task](../../records/tasks/2026-09-12-initial-module-inventory.md).

The governing choices are the accepted [projection architecture decisions](../decisions/initial-projection-architecture-decisions.md)
and [module inventory decisions](../decisions/initial-module-inventory-decisions.md).

## Responsibilities and flow

Operational project opening lives in the TypeScript integration. It follows
TypeScript configuration inheritance, file selection, package and module
resolution, and automatic module detection. It disables emission because this
application reads programs. Configuration errors and unavailable configured root
files return project-open failure before a projection exists. Compiler objects
remain inside that integration; input projects are never executed.

The presentation declares module-standard exports and documentation requirements
before the evaluator requests discovery through a small language-analysis boundary. Discovery writes an atomic batch of snapshot, module entity, module
claim, Claim context, and source-evidence records through `ProgramRecordStore`.
Compiler expansion preparation completes before snapshot identity is finalized.
Expansion materialization adds semantic symbol entities and claims, export
relationship claims, recorded documentation assertions, and qualified association
claims. The evaluator records an immutable discovery attempt and separate expansion
outcomes scoped to each module, so inspection does not inherit unrelated expansion
failures. Lens
construction reads stored information, selects relevant subjects and context,
and writes an addressable projection. It does not call TypeScript.

The current store adapter uses private in-memory maps. It clones and freezes
records, requires each snapshot record's own ID to equal its snapshot identity,
rejects conflicting replacements and invalid references (including entity
claim discriminators and reciprocal subjects, and documentation-association
subjects matching their module, origin-symbol or export-alias provenance), and
supports multiple snapshots and evaluation attempts. No persistence, sessions, SQL query
model, or general scheduling framework exists.

Module claims carry the information asserted. Claim context separately identifies
evidence, method, scope, guarantee, limitations, and encountered diagnostic codes.
Source evidence carries compiler names, file paths, contributing declaration
ranges, content digests, configured-root provenance, and written module-specifier
occurrences with established resolution targets or explicit non-establishment. It is not a conceptual
module label. SourceFile modules without an independently established module name
are anonymous; their snapshot-scoped generated handles are navigation aids.

Evaluation state separately records applicability, availability, execution,
materialization, reason, and a deterministic module-count cost. An established
empty population has a completed, fully materialized evaluation and a stored
projection. Unavailable or unmaterialized work cannot establish emptiness. The
current TypeScript provider discovers eagerly; other state combinations are
verified at the evaluation boundary, not exposed as a new scheduling product.
Unexpected defects propagate rather than becoming ordinary analysis failures.

## Identity and evidence

Snapshot identity hashes the compiler and PostCode method versions, Node and
platform context, selected configuration and options, source population and
contents, and the observed filesystem inputs used by configuration and resolution.
Those inputs include positive and negative reads/existence checks, directory
queries, and realpath results. Each observation is memoized within an opened
project. This is a snapshot of first-observed inputs, not an atomic filesystem
transaction or a cache-validity contract. A changing repository should be reopened.
The snapshot retains concise analysis coverage, consistency and enforced
output-location counts for run-specific presentation. Exclusion counts identify
filter boundaries, not generated files discovered or read.

The method registry must be bumped when the associated semantics change.
Entity identity follows the configured compiler's source identities and ambient
symbols. It makes no continuity claim across snapshots or relocated checkouts.
Absolute paths contribute to internal snapshot identity, but are not conceptual
names. Handles use language names, basenames or declared exports, with honest
anonymous fallbacks. Basenames provide bounded mnemonic evidence without becoming
conceptual names; generated provenance remains explicit. Handles that match compact
Entity-ID syntax receive a `handle-` prefix, keeping those selectors distinct.
Compact Entity IDs use
record-key digest prefixes checked against the entire module population, extended
on collision. Inspection requires explicit snapshot scope for handles and compact
IDs, reporting no current match when scope is missing or stale. Internal record
keys remain separate from the compact user-facing address.

Actual generated-output directories supplied by the caller are excluded before
configuration discovery and compiler reads. A target directory named `_observations`
or `_build` remains an ordinary configured input unless it is an explicitly
supplied output destination. Exclusion applies to roots, imported files, directory
listings, and symlink targets, including missing descendants resolved through
the nearest existing ancestor, so excluded contents do not enter evidence or its
identity digest. Exclusion entries are normalized, sorted and deduplicated as
lexical/real-path pairs before filtering and identity capture, so input order and
repeated entries do not change the snapshot. Discovery contexts assert this exclusion only when at least one
output location was supplied; direct library runs may enforce none. The CLI supplies
its actual checkout observation and build directories before opening a project,
including when the selected configuration is nested elsewhere. Git-ignore rules
alone are not this evidence boundary.

Configuration opening retains explicit syntax validation because TypeScript 6.0
omits root syntax errors from its parsed configuration error list. Repeated error
reports are deduplicated by file, position, length, category, code and message;
identical text at different source occurrences remains visible. Failure messages
retain the diagnostic file and one-based line/column when available, so those
occurrences can be located; absent locations are not inferred.

Discovery collects syntax diagnostics encountered while examining the configured
Program, conservatively qualifying the whole population and affected modules.
It does not invoke unrelated semantic checking. There is no claim that an absence
of discovery diagnostics establishes a type-correct project.

## Expansions and presentations

The compiler's effective exports preserve exported names, originating semantic
symbol identity, independent type/value roles, and direct/aliased/forwarded routes.
Overloads and merged declarations remain one semantic symbol with separate source
evidence. Type-only restrictions on routes and alias chains suppress runtime value
exposure without rewriting the underlying symbol's roles. Unresolved targets,
conflicting wildcard origins, and unestablished forwarding routes qualify expansion
outcomes and claims. The integration uses the public compiler API and does not
perform a whole-project semantic check merely to collect diagnostics.

Compiler-associated JSDoc blocks are retained individually, including structured
tags. Module documentation, originating-symbol documentation and export-alias
documentation retain distinct association claims. Documentation is a recorded
assertion: mechanically establishing its association does not establish that the
text is true, current or complete. Unattached comments are not assigned a subject.

Projection construction selects expansion claims and outcomes relevant to selected
modules. View construction reads only materialized records and selects documented
export/documentation limits; omitted exports, assertions, tags and text characters
remain counted. Rendering receives a qualified view value and cannot query the
store or trigger analysis. Unicode and JSON use the same domain projection with
different display limits. Unicode inventory lists project modules, counts collapsed
external modules and retains their exceptional qualifications. Its qualified view records display coverage separately from analysis
selection. JSON retains the full selected module list and full identities.
Detailed inspection exposes exports and recorded assertions; shared qualifications
appear once while exceptional provenance stays local. JSON has an explicitly
experimental schema. Normal qualifications omit detailed
source evidence. Explicit inspection source detail groups locations and bounded excerpts by displayed
modules and their exports, separating forwarding, defining source and documentation.
It precedes closing qualifications/navigation, retains claim keys in JSON, and
never renders full-file content. The compiler
boundary captures ranges and excerpts from already observed input. Presentation does
not reread files; file-level module associations have no excerpt. Narrow compiler spans may expand
to their enclosing declaration statement to expose relevant syntax. Unicode
documentation has a separate height bound; stored assertions remain unchanged.

Successful capability states and common module anonymity/facets are consolidated.
Analysis status, aggregate display omissions, and run limitations remain separate;
documentation omission counts include materialized exports outside the displayed
cue. Stable explanations live in help and the command reference, while concise
TypeScript coverage and non-atomic-input limitations remain in the view. The CLI
supplies a quoted next-action command with the selected project and full snapshot.
Options precede an end-of-options marker so exact selectors that resemble flags
remain usable. The parser still accepts one exact selector.
Its paths are explicit invocation context, distinct from analyzed source evidence.

## Observations and runtime boundaries

The [observation decisions](../decisions/initial-observation-recording-decisions.md)
require a separate `ObservationSink`. Observation batches are never inserted into
`ProgramRecordStore` or read back as program truth. Each batch has format version
zero and invocation-local UUIDs. Request context, repository/configuration/snapshot
context, qualified view artifact and exact rendered output each appear once in the
batch, referenced by the view-produced and optional source-escape events. They
remain interpretable after the ephemeral store is discarded.

The CLI discloses the absolute local sink destination on stderr. The sink creates
one private JSON file per accepted batch under the PostCode checkout's ignored
`_observations/` directory. It exposes no historical-read API and supplies no
producer retention or migration policy. Rejection or delivery failure emits a
warning without changing the successful view or its exit status. No remote/shared
sink or contemporaneous-note command exists. Privacy and exclusion details are in
[development conventions](../../dev/conventions.md#local-development-observation-sink-selection).

Expected usage and project-open failures precede view production. Internal defects
propagate to a distinct CLI failure. Successful views can carry partial expansion
outcomes; process success is not a claim that every requested fact was established.
Both initial independent reviews and instrument validation are complete; their
evidence and limitations remain in the completed initial task. Subsequent PR review
corrections and the human-arranged rereview gate are tracked by the active
[continuation](../../records/tasks/2026-09-13-module-inventory-review-continuation.md).

Unicode rendering escapes controls at inline value boundaries before assembling
layout. Documentation and source excerpts use structured wrapping; JSON and domain
records retain their original text. Generated commands are omitted for invocation
paths with controls rather than displaying a changed, non-executable argument.
Re-export traversal guards module/exported-name pairs along each path, permitting
renamed routes to revisit a module while bounding actual cycles.
