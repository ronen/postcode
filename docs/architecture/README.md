# Implemented architecture

The development CLI opens one configured TypeScript project, evaluates module
inventory and presentation-declared standard expansions, constructs stored
`modules(project)`, repository/project organization, or exact-selection group/module inspection projections, and presents
a qualified Unicode or experimental JSON view. Every produced view submits a
self-contained observation batch to a separate local sink. The initial slice's
instrument validation and independent reviews are recorded in the
[completed task](../../records/tasks/2026-09-12-initial-module-inventory.md).

The governing choices are the accepted [projection architecture decisions](../decisions/initial-projection-architecture-decisions.md)
and [module inventory decisions](../decisions/initial-module-inventory-decisions.md).
The governing cross-cutting terminology is maintained in [core concepts](../core-concepts.md), and binding cross-cutting rules are maintained in [architectural constraints](../architectural-constraints.md); this document describes how the current implementation realizes them.

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

## Dependency provider checkpoint

An explicit dependency evaluation can now request a bounded source-request pass
through the same TypeScript integration. Compiler and file-resolution work
finishes before snapshot identity is finalized. The pass materializes qualified
occurrences, separate recognition/ownership coverage results, and directed
module-pair relationship claims retaining every resolved supporting occurrence.
The evaluator records dependency work separately from its module-discovery basis;
a provider that cannot supply it yields unavailable work, not an empty graph.
Ordinary discovery does not implicitly request dependency analysis.

The [dependency structure decisions](../decisions/module-dependency-structure-decisions.md)
and [bounded CommonJS decision](../decisions/bounded-commonjs-source-evidence-decision.md)
govern this boundary. Only project-owned requests contribute relationships;
external interiors remain opaque. Resolution outside the existing module
population never adds an entity. Source evidence keeps the configured file
resolver's result distinct from the evidence identifying a target module, and
retains actual target declarations for later placement analysis. Aggregation
preserves direct re-export intermediates and all occurrences, and marks a
relationship type-only only when every occurrence establishes that qualification.

This is an implementation checkpoint, not a new CLI view. Dependency graph
projections, optional composition and organization expansions, presentations,
navigation, and dependency-view observations remain to be integrated under the
[active plan](../plans/module-dependencies-plan.md).

## Identity and evidence

Snapshot identity hashes the compiler and PostCode method versions, Node and
platform context, selected configuration and options, source population and
contents, the observed filesystem inputs used by configuration and resolution,
and the captured repository organization inputs and method versions.
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
one private JSON file per accepted batch under a UTC `date=YYYY-MM-DD` subdirectory
of the PostCode checkout's ignored `_observations/` directory. Filenames carry a
filesystem-safe UTC submission timestamp and the batch UUID. It exposes no
historical-read API and supplies no producer retention or migration policy.
Rejection or delivery failure emits a
warning without changing the successful view or its exit status. No remote/shared
sink or contemporaneous-note command exists. Privacy and exclusion details are in
[implementation conventions](../implementation-conventions.md#local-observation-sink).

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

## Repository organization

The completed [repository organization task](../../records/tasks/2026-09-15-module-organization.md)
added an internal repository-layout evidence boundary under `src/lib/repository/`,
governed by the [organization decisions](../decisions/repository-organization-decisions.md).
Repository evidence is captured after successful project opening and before
snapshot identity is finalized. The snapshot references a stored capture result,
including explicit unavailability outside a worktree. Organization evaluation
reads that result and a stored module evaluation; it performs no filesystem or
compiler work. Pure layout is prepared with capture and retained alongside it,
so view construction never repeats layout analysis. Repository inputs contribute
to snapshots across the module and organization CLI surfaces.

Capture uses the enclosing Git worktree of a configuration path. Git supplies
tracked membership, effective ignore decisions, and repository metadata; native
filesystem reads capture present artifact kinds, directory entries, link targets,
and applicable exclusion-policy digests. Tracked artifacts override ignore
matches, while deleted artifacts are absent. Explicit output destinations are
normalized and excluded independently of Git ignores. Nested repository markers
and Gitlinks identify opaque boundaries without importing their contents.
Opaque boundaries named README or README.* do not establish documentation
availability. Ordinary artifact and README contents are not read. Repository, local, and global
exclusion inputs remain distinguishable. Known environmental or filesystem
failures produce explicit capture unavailability; unexpected defects propagate.

Link resolution uses the captured visible paths and link targets. A metadata-only
probe in an already visible containing directory distinguishes an absent target
from an existing target whose exact path spelling was not captured. The latter
remains unestablished. Resolution does not traverse opaque repositories, ignored
contents, or generated output, and distinguishes proven cycles from the bounded
redirect limit. External path traversal is refused, even where a path could later
re-enter the worktree through an uncaptured alias.

Pure layout derivation prepares region names, direct containment and artifact
placements, direct README associations, and qualified link outcomes. Directory
links can add a parent to an existing region; deterministic cycle refusal leaves
a directed acyclic containment graph. Captured canonical and invoked repository
roots (verified by resolving lexical ancestors, rather than inferred from path
depth) let placement interpret apparent source paths without using realpath as
module identity. Bounded traversal through accepted directory-link regions maps
aliased source paths to existing groups; ordinary file-link modules retain their
apparent artifact's placement.

Organization evaluation materializes group entities, region and artifact evidence,
qualified direct containment, artifact and module placement, and direct README
associations through `ProgramRecordStore`. Group entities and direct layout
relationships remain fixed within a snapshot. Root groups have no intrinsic name;
other names are single captured segments. Module placement retains established,
multiple, unplaced, external, and unavailable outcomes with reasons. Candidate
ambiguity is represented separately; this provider does not invent candidates.

Each organization evaluation references its module-evaluation basis and retains
repository coverage separately from placement coverage. Group-property claims
reference that evaluation. Known direct placements survive incomplete evaluation;
descendant-only and none are asserted only when placement evaluation completed
fully. Unknown presence is represented separately from those values. The store
validates group claim identity, reference kinds, placement outcome shape, and the
evaluation prerequisite for negative presence.

Repository projections select the complete group population. Project projections
select established project-module placement groups and their ancestor closure.
Neither changes the direct relationships of a retained group. Declared
`group-details` expansions retain direct parents, subgroups, modules, artifact
placements, and documentation relationships; adjacent entities are expansion
data rather than extra selected subjects. Generic organization inspection matches
exact group and module names together, including repeated group names, or selects
precisely by currently scoped Entity ID. Group IDs use `group-` and the same
collision-extending digest abbreviation as module IDs. Group paths and root
display labels are not selectors. Existing module inspection expansion records
remain available through a referenced module projection.

The organization presentation declares group details and the common module
standard expansions before evaluation. Using the same compiler preparation keeps
navigation across lenses in a common snapshot. View construction reads stored
claims and captured paths, materializes bounded display rows and omission counts,
and never invokes another lens or analysis. Rendering receives only that value.
Repository/project trees retain direct contextual siblings, distinguish pruning
from selection, and expand a shared group once. Group inspection shows all direct
relationships; adjacent summary records explicitly identify unrequested detail.
Module-only inspection reuses the existing qualified module view; mixed matches
are sectioned by kind and retain that module view as embedded detail.

Group source escape carries captured group/README/artifact paths and qualified
link evidence without contents. Source-level mechanics are absent from ordinary
organization output. Observations accept either view schema and distinguish group
paths from module locations/excerpts or mixed disclosure. The analysis context's
repository root comes from stored capture rather than a second live lookup.

The representative fixture and focused ephemeral Git projects exercise the full
journey, graph/display limits, source disclosure, observations, and synthetic
partial/unavailable module providers. Instrument validation and the final review
gate are recorded in the completed repository organization task.

Inputs remain first-observed and non-atomic. Git may reread live exclusion policy;
a final policy check refuses detected lasting changes but cannot detect every
transient concurrent edit. Sparse-checkout completeness remains unresolved.
Capture refuses non-UTF-8 names or Git evidence and Git output exceeding its
bounded subprocess buffer instead of silently dropping or corrupting artifacts.


## Dependency graph and qualified expansions

The dependency library now constructs project structure and focused child/parent
projections from stored provider results. It keeps the discovered project population,
including isolated modules, separate from dependency evaluation coverage. Structure
uses strongly connected components of project-to-project edges; generated component
indices are grouping data, never entity identities. Every internal relationship and
cycle member remains available. Source components are established roots only with
complete module and dependency evaluations. External endpoints remain opaque.
Focused projections reuse exact, snapshot-scoped module selection and retain direct
relationships; non-edge requests remain attached to their source owners.

Composition is a separately requested module expansion. The TypeScript integration
checks all captured module declarations for the positive `re-exports-only` property
and records its own outcome. No inverse property is produced. Discovery classifications
use `discoveryFacets`, keeping discovery evidence distinct from qualified composition.

The optional dependency-organization expansion consumes a matching stored organization
evaluation. Captured request and target declaration evidence narrow endpoint placement
before broader module-placement fallback. All applicable endpoint combinations remain
explicit, including placement and occurrence variation, incomplete information, and
candidate ambiguity. Common ancestors retain containment evidence across multiple
parents. This expansion performs no filesystem or compiler work and cannot weaken the
underlying dependency result when repository organization is unavailable.

These library layers follow the accepted [dependency structure](../decisions/module-dependency-structure-decisions.md),
[composition](../decisions/module-composition-property-decision.md), and
[organization integration](../decisions/dependency-organization-integration-decisions.md)
decisions. Dependency CLI views and the associated presentation/observation integration
remain pending at this intermediate checkpoint.
