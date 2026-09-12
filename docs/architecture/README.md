# Implemented architecture

The initial module-inventory task is at its first architectural review checkpoint.
The implemented path opens one configured TypeScript project, materializes module
records through an ephemeral store, records an evaluation attempt, and constructs
stored `modules(project)` or exact-selection `inspect(subjects)` projections.
It is exercised by tests; the user-facing CLI and presentations are not yet built.

The governing choices are the accepted [projection architecture decisions](../decisions/initial-projection-architecture-decisions.md)
and [module inventory decisions](../decisions/initial-module-inventory-decisions.md).

## Responsibilities and flow

Operational project opening lives in the TypeScript integration. It follows
TypeScript configuration inheritance, file selection, package and module
resolution, and automatic module detection. It disables emission because this
application reads programs. Configuration errors and unavailable configured root
files return project-open failure before a projection exists. Compiler objects
remain inside that integration; input projects are never executed.

The evaluator requests module discovery through a small language-analysis
boundary. Discovery writes an atomic batch of snapshot, module entity, module
claim, Claim context, and source-evidence records through `ProgramRecordStore`.
The evaluator records an immutable attempt referring to those records. Lens
construction reads stored information, selects relevant subjects and context,
and writes an addressable projection. It does not call TypeScript.

The current store adapter uses private in-memory maps. It clones and freezes
records, rejects conflicting replacements and invalid references, and supports
multiple snapshots and evaluation attempts. No persistence, sessions, SQL query
model, or general scheduling framework exists.

Module claims carry the information asserted. Claim context separately identifies
evidence, method, scope, guarantee, limitations, and encountered diagnostic codes.
Source evidence carries compiler names, file paths, contributing declaration
ranges, content digests, and configured-root provenance. It is not a conceptual
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

The method registry must be bumped when the associated semantics change.
Entity identity follows the configured compiler's source identities and ambient
symbols. It makes no continuity claim across snapshots or relocated checkouts.
Absolute paths contribute to internal snapshot identity, but are not conceptual
names. Handles contain a snapshot prefix; full Entity IDs carry the entire digest.

Known generated-output directories are excluded before configuration discovery
and compiler reads. The integration excludes `_observations` and `_build` under
the selected configuration directory and accepts additional absolute output
directories from its caller. Exclusion applies to roots, imported files, directory
listings, and symlink targets, so excluded contents do not enter evidence or its
identity digest. The eventual CLI must supply its own actual output destinations
before opening a project, including when its checkout and the selected project
have different roots. Git-ignore rules alone are not this evidence boundary.

Discovery collects syntax diagnostics encountered while examining the configured
Program, conservatively qualifying the whole population and affected modules.
It does not invoke unrelated semantic checking. There is no claim that an absence
of discovery diagnostics establishes a type-correct project.

## Remaining integration

Exports, symbols, documentation assertions and associations, presentation-declared
standard expansions, source-detail disclosure, Unicode/JSON views, the CLI, and
observation production remain to be integrated after independent checkpoint
review. The record union will grow when those concrete records are implemented.
The source-evidence references already preserve contributing declarations; finer
resolution-occurrence evidence and expansion-specific qualifications still need
their fixtures and implementation.

Observation data will use a separate `ObservationSink` as required by the accepted
[observation decisions](../decisions/initial-observation-recording-decisions.md).
It will not be inserted into `ProgramRecordStore` or read back as program truth.
The implementation-time sink selection and its privacy posture are documented in
[development conventions](../../dev/conventions.md#local-development-observation-sink-selection).
