# Initial module inventory slice

Status: approved
Created: 2026-09-10
Updated: 2026-09-12
Superseded by:

## Context

PostCode has an adopted product design and development workflow but no runnable
application. The first implementation slice should exercise the product's
analysis, lens, projection, qualification, presentation, and CLI boundaries
without first selecting a GUI framework or prematurely designing the composite
`summary` lens.

The slice uses TypeScript as both the implementation language and the first
language integration. It implements two independently useful primitive lenses:
`modules(project)` inventories the modules in the configured TypeScript project,
and `inspect(subjects)` returns selected subjects for qualified detailed
inspection. `project` is opened through operational setup and is not an
executable entry point, filesystem root, workspace, or current focus.

The plan is governed by these resulting decisions:

- [Initial module inventory slice decisions](../decisions/initial-module-inventory-decisions.md)
- [Initial projection architecture decisions](../decisions/initial-projection-architecture-decisions.md)
- [Initial observation recording decisions](../decisions/initial-observation-recording-decisions.md)

## Use narrative

A developer runs PostCode against one selected TypeScript configuration. PostCode
opens the configured project, evaluates the information required by
`modules(project)` and the selected presentation, and emits a qualified conceptual
inventory of its modules.

The normal CLI produces a Unicode-text module-inventory view. It identifies
modules through TypeScript-established names or honest anonymity, deterministic
mnemonic handles, deterministic snapshot-scoped PostCode Entity IDs, and
conceptual facets. The view may show the module standard expansions declared by
its presentation before evaluation: effective exported symbols and associated
in-source documentation.

The developer can run the CLI again with a previously displayed name, mnemonic
handle, or Entity ID to apply `inspect(subjects)` to the matching module
or modules. Selection cardinality is explicit. The resulting view can show the
standard expansions declared by its presentation. The normal presentation does
not show source facets or source-level Claim context. An explicit source-detail
presentation request shows selected source information supported by the relevant
Claim context and is identifiable as source escape-hatch use.

The CLI can produce either a Unicode-text or JSON view of the same qualified
projection.

## Intended outcome

The repository contains a runnable development CLI that can open a configured
TypeScript project and produce a deterministic, qualified, conceptually presented
module inventory. The implementation establishes the smallest concrete internal
boundaries needed for language analysis, `ProgramRecordStore`, evaluation,
`modules(project)`, projections as stored domain objects, standard expansions,
and Unicode and JSON presentations.

The result is usable both for direct human inspection and as an initial instrument
for later PostCode research. It is not yet a general repository-understanding
application.

## Success criteria

### Observable behavior

- From a conventional starting location, the CLI can select and open one
  `tsconfig.json`-configured TypeScript project. Exact command syntax may be chosen
  during implementation and documented in the resulting user-facing material.
- The default command emits a Unicode `modules(project)` view rather than a raw
  compiler listing or a `summary(project)` projection.
- An alternative JSON presentation carries the same domain content and
  qualifications through an explicitly experimental schema.
- Each normal view-producing invocation submits a version-zero observation batch
  through an `ObservationSink`. The batch records the request, relevant evaluation
  and qualification context, qualified machine-readable view artifact, and exact
  rendered output shown to the user.
- Shared observation context and artifacts are included once per invocation batch
  and referenced from events by UUID. The producer does not maintain context UUIDs
  across invocations or read previously submitted event streams.
- Observation-sink failure is visibly reported but does not reclassify a
  successful projection as failed or prevent its presentation.
- The supported module population is exactly:
  - `SourceFile` records in the configured TypeScript `Program` that TypeScript
    classifies as external modules; and
  - named ambient-module symbols visible to that configured `Program`.
- Global scripts are not silently represented as modules. Root files remain
  discovery provenance rather than conceptual entry modules.
- Each module has a deterministic snapshot-scoped PostCode Entity ID, a simple
  deterministic mnemonic handle, its TypeScript-established name or honest
  anonymity, and established conceptual facets.
- Repeating an invocation with equivalent analysis inputs and method versions
  reproduces the snapshot identity, module identifiers, handles, ordering, and
  structured output.
- An `inspect(subjects)` invocation can select modules by exact name, handle, or
  Entity ID; zero, one, and multiple matches are represented honestly.
- `inspect(subjects)` returns the selected module entities and their applicable
  Claim context without redefining them or exposing arbitrary store contents.
- An explicit source-detail presentation request on an inspection shows only
  relevant selected source information supported by the displayed claims'
  context, keeps it visibly separate from conceptual information, and is recorded
  as source escape-hatch use.
- The module standard expansions are available to presentations:
  - effective exported symbols, including re-exports; and
  - compiler-associated documentation for modules and exported symbols.
- Export relationships preserve exported names, directness, aliasing,
  forwarding, origin where established, and independent type and value roles.
  Merged symbols and overloads appear as one semantic symbol with multiple
  contributing declarations rather than unrelated duplicate exports.
- Documentation is presented as a recorded assertion with its status preserved,
  not as proof that its contents are true, current, or complete.
- Default Unicode and JSON output show conceptual information only. Source
  facets, paths, declaration locations, raw syntax, compiler-node details, and
  detailed source provenance do not leak into normal output.
- Project-open failure, an established empty module set, analysis failure,
  deferred or unavailable work, and a successful result containing diagnostics
  remain distinguishable.
- Diagnostics qualify the result only when encountered on the actual discovery
  or requested-expansion analysis path; the slice does not run unrelated checks
  merely to discover diagnostics.

### Internal boundaries

- Program entities, claims, Claim context, evaluation outcomes, projections, and
  their relationships are represented as qualified, addressable program records.
- A Claim contains the asserted information. Claim context carries its evidence
  or source references, provenance and method, scope, epistemological guarantee,
  and limitations. Evaluation outcome separately represents applicability and
  availability, execution state, result materialization, relevant cost, and
  failure or stopping reasons.
- A projection is an addressable domain object. Relevant evaluation outcomes can
  be associated with it even when evaluation produces no entity records, so an
  empty established result cannot be confused with absent analysis.
- `modules(project)` returns module domain entities with lens-wide and narrower
  per-module Claim context. It does not itself require exports or documentation.
- `inspect(subjects)` returns its selected subject entities with applicable
  lens-wide and per-subject Claim context. In this slice its CLI-selectable
  subjects are modules learned from `modules(project)`.
- Entity kinds define standard expansions independently of individual lenses.
  Presentations declare required expansions before evaluation and cannot trigger
  evaluation while rendering.
- Language analyzers and projection construction use a storage-independent
  `ProgramRecordStore` boundary. Storage-native rows, query objects, connections,
  and identifiers do not escape its adapter.
- Lens and presentation requirements reach language analysis through an
  evaluation/coordination boundary. Lenses do not call TypeScript analysis
  directly, and presentations do not query unevaluated capabilities while
  rendering.
- The initial store is ephemeral and the evaluation strategy may compute all
  requirements for a view eagerly. The design does not require persistent cache
  reuse, continuing sessions, or a general lazy/staged planning framework.
- Observation production uses a separate `ObservationSink` boundary. Submitted
  batches remain interpretable without the ephemeral `ProgramRecordStore`, and
  sink retention or migration policy does not become application cache policy.
- Implementation details such as plan representation, method names, call
  direction, request flags, batching ownership, and property-versus-service access
  remain local choices unless implementation evidence makes one consequential.

### Verification and formative validation

- Automated fixtures make the expected module, export, documentation,
  qualification, and failure results small enough for a reviewer to verify.
- The complete supported module population is checked on those fixtures rather
  than validated only through snapshots of plausible-looking text.
- Determinism is checked across separate process invocations with equivalent
  inputs, and changed analysis-defining inputs are shown to produce a different
  snapshot context rather than assumed continuity.
- The CLI is exercised against PostCode and at least one unfamiliar external
  TypeScript repository. Repository familiarity must not be the only reason the
  output appears understandable.
- A human inspects the Unicode output for usability as an investigation starting
  point.
- The projection alone is supplied to clean AI agents with consistent structured
  questions covering what the project appears to contain, apparent module roles,
  a justified next subject to investigate, supported conclusions, ambiguities,
  confusing information, and missing conceptual information. The exact
  projection, questions, model/context conditions, and responses are retained as
  formative observations where practical.
- Clean-agent validation evaluates the app-local question of whether the module
  view supplies a useful starting point. Comparative research into conceptual
  versus source-aware understanding remains outside this plan.

## Scope

- Establish the minimal TypeScript application and test scaffold needed for a
  local development CLI.
- Select and open one TypeScript project through `tsconfig.json`, following normal
  TypeScript configuration inheritance, file selection, and resolution semantics.
- Create deterministic analysis-snapshot identity from all inputs relevant to the
  claims made by this slice.
- Implement the program-record model and an ephemeral `ProgramRecordStore`
  adapter sufficient for the slice.
- Implement TypeScript module discovery for the stated supported population.
- Discover effective exported symbols and compiler-associated documentation as
  standard expansion data.
- Implement evaluation, projection construction, `modules(project)`,
  `inspect(subjects)`, Unicode and JSON presentation, and exact module-subject
  selection.
- Implement an explicit source-detail presentation expansion for inspected
  modules and their materialized standard expansions, limited to source
  information selected through relevant Claim context.
- Implement invocation-scoped, version-zero observation batches and an
  `ObservationSink` boundary, including shared context references and visible
  delivery failure.
- Preserve conceptual/source separation and qualified outcomes end to end.
- Add reviewable fixtures and perform the verification and formative validation
  described above.
- Document how to run and exercise the resulting CLI.

## Non-goals

- A GUI framework or delivered graphical interface.
- `summary(project)`, composite-lens implementation, module dependencies,
  dependents, callers, history, runtime analysis, or revision comparison.
- Support for a second programming language or combining several TypeScript
  project configurations.
- Inferring executable entry points from `package.json`, filesystem layout,
  compiler output, or conventions.
- Treating global scripts as modules or classifying tests from filenames.
- Discovering every possible virtual, synthetic, generated, custom-host, or other
  module category outside the explicit first-slice population.
- Interpreting arbitrary unattached comments or using natural-language synthesis
  to decide which entity a comment describes.
- General selector syntax, wildcard matching, partial or fuzzy matching, or
  retained aliases for stale mnemonics.
- Optimizing mnemonic-handle quality, supporting multiple simultaneous generated
  handles, or user-assigned handles.
- Persistent analysis caching, SQLite selection, durable investigation sessions,
  cross-revision semantic identity, or continuity inference.
- Reading historical observation streams, maintaining producer-side context UUIDs
  across invocations, defining sink retention policy, automatic remote research
  export, or a contemporaneous subjective-note command.
- Resource-bounded partial module discovery or a general lazy, incremental, or
  staged evaluation framework.
- A stable public JSON schema or a public CLI analysis/debugging API.
- General presentation-layout optimization. Elision, truncation, pagination, and
  grouping may be refined locally so long as consequential omission stays visible.
- Full-file source rendering, arbitrary source browsing or navigation, syntax
  highlighting, and editor integration.
- The research project's comparative study of conceptual and source-aware
  understanding.

## Proposed approach

### 1. Establish a runnable vertical skeleton

Create the smallest TypeScript CLI and test setup consistent with repository
conventions. Prove the operational path from CLI invocation to selected
`tsconfig.json`, TypeScript `Program` construction, and an explicit project-open
result. Keep operational failures distinct from analysis outcomes.

This stage selects only dependencies needed by the implemented behavior. It does
not create speculative package boundaries or a GUI-oriented application shell.

### 2. Establish the program-information path

Define the minimum domain records needed for snapshots, modules, symbols,
documentation assertions, export relationships, claims and Claim context,
evaluation outcomes, and projections. Implement an ephemeral
`ProgramRecordStore` adapter and storage-independent access boundary.

Connect lens and presentation requirements to an evaluation layer and projection
construction without building a universal planner. Store projections as
addressable domain objects and preserve relevant evaluation outcomes even when no
module entity is produced.

### 3. Implement TypeScript module information

Discover external-module `SourceFile`s and named ambient-module symbols from the
configured TypeScript `Program`. Preserve TypeScript resolution identity and
discovery evidence without making paths the conceptual identity.

For presentation-requested standard expansions, discover the effective export
surface and compiler-associated documentation. Preserve aliases, re-exports,
merged declarations, type/value roles, and documentation provenance through
qualified records. Treat unsupported module categories and encountered
diagnostics as explicit limitations rather than guessing.

### 4. Assemble and present the module projections

Implement `modules(project)` over the evaluated program records. Assign
deterministic PostCode Entity IDs and simple deterministic mnemonic handles within
the deterministic snapshot context.

Implement `inspect(subjects)` as a qualified projection of selected subjects,
with exact module selection by name, handle, or identifier and honest
zero/one/many results and selected-subset disclosure. It does not mean “modules
contained by this module” and does not expose arbitrary records merely because
they exist in the store.

Implement Unicode and experimental JSON presentation of both projections. They
expose conceptual information and qualifications without leaking source detail.
Whether compact inventory and detailed inspection use distinct presentation
types or one presentation with parameters is an implementation choice; the
design does not require either a proliferation of special presentations or one
unbounded presentation option surface.

Implement an explicit source-detail presentation expansion for inspection. It
materializes only relevant selected source information supported by Claim context
for the inspected modules and displayed expansion records, keeps that information
visibly separate from conceptual information, and connects its disclosure to the
required source-escape observation. Source facets, source-level Claim context,
locations, declaration mappings, and snippets may all be represented; their exact
selection, granularity, and presentation controls remain presentation choices. It
does not provide full-file rendering or arbitrary source browsing.

For each normal view-producing invocation, construct a self-contained observation
batch with `formatVersion: 0`, UUID-addressed shared context, the qualified
machine-readable view, and the exact rendered output. Submit it through a selected
development `ObservationSink`; report rejection or delivery failure visibly and
continue to present a successfully produced view.

### 5. Verify and exercise the slice

Run automated tests across reviewable fixtures and separate-process determinism
checks. Exercise the CLI on PostCode and an unfamiliar external TypeScript
repository. Inspect the Unicode and JSON outputs for conceptual/source separation
and qualification integrity.

Run the clean-agent structured-question exercise and retain its inputs and outputs
as formative evidence. Use findings to correct functional or materially confusing
behavior; leave broader research questions to the research project.

## Fixture and test coverage

The fixture set should cover at least:

- configured root files, transitively imported files, and excluded global scripts;
- ordinary TypeScript and allowed JavaScript external modules;
- declaration-file external modules and named ambient modules;
- a project with an established empty module set;
- direct, default, aliased, wildcard, and chained re-exports;
- type-only, value-only, and dual-role exports;
- overloaded or merged exported symbols with multiple declarations;
- module and exported-symbol documentation, structured tags, absent
  documentation, and multiple contributing documentation records;
- duplicate implementation names or mnemonic handles producing multiple exact
  matches;
- `inspect(subjects)` selection producing honest zero-, one-, and multiple-module
  results with applicable qualifications and declared standard expansions;
- malformed or unusable project configuration as an operational failure;
- source diagnostics encountered on the requested analysis path;
- unsupported or unresolved cases that exercise explicit limitation reporting;
- deterministic output across equivalent independent invocations; and
- changed source, configuration, dependency, or method inputs producing a
  different snapshot context.

Prefer several small focused fixtures over one synthetic repository that is hard
to review. Use public TypeScript compiler behavior through the selected supported
API; do not make tests depend primarily on internal compiler implementation
details.

## Risks and uncertainties

- The public TypeScript API does not provide one exhaustive “all modules” call.
  The explicit first-slice population is testable but may omit a module category
  that later use finds important.
- Correct deterministic snapshot identity requires accounting for every input
  capable of changing the claims, including inherited configuration, source
  state, tool versions, resolution environment, and relevant external dependency
  state. An incomplete identity could make two unequal analyses appear equal.
- Compiler-associated documentation and symbol APIs may behave differently across
  declaration merging, aliases, JavaScript/CommonJS inference, and TypeScript
  versions. Characterization fixtures should expose, not conceal, those limits.
- A full module inventory may be too large or slow on some repositories. This
  slice records that usability gap rather than implementing partial discovery or
  durable caching prematurely.
- A simple mnemonic algorithm may produce awkward or duplicate handles. Duplicate
  selection is supported; wording optimization is deferred unless it blocks use.
- Showing exports and documentation can overwhelm Unicode output. Presentation
  volume controls may be adjusted without changing lens semantics, but omission
  must remain visible.
- The `ProgramRecordStore` and evaluation boundaries could become speculative
  frameworks. Implementation should expose only operations exercised by this
  slice and treat recurring boundary friction as evidence to revisit the design.
- Observation artifacts may contain repository-derived documentation,
  qualifications, identifiers, and explicitly expanded source information. The
  selected development sink needs an explicit external location and privacy
  posture even though long-term retention policy belongs to the sink.
- Clean-agent responses can be plausible, agreeable, or dependent on prior
  programming knowledge. Structured questions and retained evidence reduce but do
  not remove that limitation; human inspection remains necessary.

## Implementation selections and approval gates

- At implementation start, the implementing agent selects the TypeScript CLI and
  test toolchain and states the purpose of each consequential dependency. Routine
  choices within this plan are delegated; a choice that introduces a durable
  commitment beyond the plan requires human approval.
- Before PostCode submits repository-derived observations from a non-fixture
  project, the human approves the concrete development `ObservationSink`, its
  external local destination, and its privacy-visible configuration. The sink
  boundary and fixture-based behavior may be implemented and tested before that
  approval. This selection is sink implementation policy, not a commitment to
  retain or read old event formats in PostCode.
- Before acquiring or analyzing an unfamiliar external TypeScript repository,
  the human approves the proposed repository unless explicit selection criteria
  and authority have already been delegated. Repository selection must not
  change the scope of the formative exercise.

## Resulting decisions

- [Initial module inventory slice decisions](../decisions/initial-module-inventory-decisions.md)
- [Initial projection architecture decisions](../decisions/initial-projection-architecture-decisions.md)
- [Initial observation recording decisions](../decisions/initial-observation-recording-decisions.md)

Routine CLI syntax, method names, plan representation, batching ownership, and
presentation-layout choices should remain implementation decisions rather than
accepted architecture records unless review exposes a durable consequence.
