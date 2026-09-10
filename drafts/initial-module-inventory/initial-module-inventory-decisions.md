# Initial module inventory slice decisions

Status: accepted
Decided: 2026-09-10
Arising from: [Initial module inventory plan](../plans/initial-module-inventory-plan.md)
Scope: the initial PostCode product slice and TypeScript language integration

## Context

PostCode has an adopted product model but no runnable application. The initial
slice needs to establish useful end-to-end behavior without prematurely selecting
a GUI framework, designing the composite `summary` lens, or treating raw analysis
as the product interface.

The slice must provide a truthful conceptual representation over TypeScript
projects, preserve qualifications and source provenance, and be useful as a
starting point for further investigation. It must also remain narrow enough to
implement and evaluate before module dependencies, additional languages,
persistent workspaces, and resource-bounded analysis are introduced.

## Decisions

### Begin with a TypeScript module inventory

#### Decision

Implement PostCode in TypeScript and support TypeScript and configured JavaScript
through the TypeScript language environment as the first language integration.
Implement one primitive lens, `modules(project)`, through a development CLI.

`project` is a context-relative PostCode subject denoting the one configured
TypeScript project opened through operational setup. It does not denote an
executable entry point, filesystem root, repository, workspace, or current focus.
The likely operational default is a `tsconfig.json` in the current directory,
but exact command syntax is not part of this decision.

The normal CLI presentation is Unicode text. JSON is an alternative presentation
of the same qualified projection model and is explicitly experimental; it is not
a raw analysis or compiler dump. The CLI exposes lenses and views, not a public
family of analysis commands.

#### Rationale

A module inventory exercises language analysis, a lens, projection construction,
qualification, presentation, and navigation without first requiring composite
summary semantics. Supporting a second language immediately would provide useful
pressure on abstractions but would slow progress toward a usable instrument.
Keeping TypeScript-specific semantics behind a language-integration boundary
preserves the opportunity to add that pressure later.

#### Alternatives considered

- Begin with `summary(project)`: deferred because it would require premature
  decisions about composite lenses, prioritization, omission, and synthesis.
- Begin with module dependencies: moved to a subsequent slice so the first slice
  establishes module identity and navigation first.
- Expose analysis commands directly in the CLI: rejected because analysis is an
  internal means of satisfying lenses, not a parallel product surface.
- Support two languages initially: deferred in favor of faster progress with an
  explicit language-integration boundary.

#### Consequences

- The product-level default may remain `summary(root)` even though the development
  CLI explicitly starts with `modules(project)` in this slice.
- `summary(project)`, dependencies, dependents, callers, history, runtime data,
  revision comparison, and GUI work remain outside this slice.
- `package.json`, filesystem heuristics, and compiler output are not used to infer
  conceptual executable entry points.

### Use an explicit TypeScript module-discovery contract

#### Decision

For this slice, `modules(project)` contains:

- `SourceFile` records in the configured TypeScript `Program` that TypeScript
  classifies as external modules; and
- named ambient-module symbols visible to that configured `Program`.

The configured `Program` determines membership according to normal TypeScript
configuration inheritance, file selection, and resolution semantics. Root files
are discovery provenance rather than conceptual top-level or entry modules.
Global scripts are not modules and are not listed merely to account for project
files. Tests are included when the selected configuration includes them; test
classification is not inferred from filenames.

Module identity follows TypeScript resolution rather than written path or
specifier spelling. Different specifiers resolving to the same source-backed
module refer to one module in that analysis context, with written occurrences and
resolution evidence retained. Forwarding or barrel modules remain distinct
modules. Named ambient modules and declaration-backed modules are not forced into
ordinary one-file implementation identity.

This population is an explicit supported contract, not a claim to enumerate every
module category that a custom compiler host or other TypeScript mechanism could
produce. Possible omitted virtual, synthetic, generated, or nonordinary forms are
a qualified limitation until use exposes a consequential gap.

#### Rationale

TypeScript documents module mechanisms but does not expose one stable public
“enumerate every module” operation. The chosen population is explainable,
reviewable, and characterizable through public compiler behavior. Broader wording
would create a promise without an operational definition.

#### Alternatives considered

- Infer entry modules from package metadata, filesystem layout, or compiler
  output: rejected because the lens inventories the configured Program and does
  not claim an executable application root.
- Use paths as module identity: rejected because identity follows configured
  TypeScript resolution and paths remain source provenance.
- Promise every module form TypeScript might recognize: rejected because no
  stable public enumeration contract establishes that population.

#### Consequences

- The first slice analyzes one selected TypeScript configuration and does not
  silently merge sibling configured projects.
- A source shared by several configured projects receives context-scoped records
  rather than one globally canonical analysis identity.
- Unsupported categories and diagnostics remain visible limitations rather than
  being silently omitted or guessed.

### Represent modules as qualified domain entities

#### Decision

`modules(project)` returns a list of module domain entities together with
lens-wide Claim context and any narrower per-module Claim context. Each module has
a snapshot-scoped opaque identifier, its TypeScript-established name or honest
anonymity, a simple deterministic PostCode mnemonic handle, and established
conceptual facets.

Facets are overlapping established characteristics rather than one universal
enumeration. They may describe such distinctions as project/external,
ambient, declaration-only, generated or host-provided, implementation available,
and opaque where the analysis supports them. Language-specific evidence is
preserved without presenting TypeScript categories as universal PostCode facts.

An entity kind may define **standard expansions**: related claims and records
that presentations may include as inline detail without applying another lens.
The initial module standard expansions are:

- effective exported-symbol relationships; and
- associated in-source documentation assertions.

Dependencies and dependents are separately meaningful lens material, not module
presentation expansions.

#### Rationale

The module lens should select modules, not encode the information policy of every
presentation. Standard expansions let a presentation request useful recognition
detail without turning `modules(project)` into a dependency, documentation, or
summary lens.

#### Alternatives considered

- Let `modules(project)` require every useful module property: rejected because
  it would couple module selection to presentation information policy.
- Let presentations query arbitrary relationships: rejected because a
  presentation could silently acquire the semantics of another lens.
- Represent every addressable claim or assertion as an entity: rejected because
  it would erase meaningful distinctions among entities, claims, evidence, and
  relationships.

#### Consequences

- A presentation declares the standard expansions it will use before evaluation.
  Rendering accesses only materialized records and does not trigger analysis.
- Addressability does not make every record an entity. Symbols are entities;
  exports are relationship claims; documentation may be an addressable recorded
  assertion; and documentation-to-subject association may itself be a qualified
  relationship claim.
- Exact expansion layout, elision, truncation, grouping, and pagination remain
  presentation choices, with consequential omission disclosed.

### Treat re-exports as part of the effective export surface

#### Decision

The exported-symbol expansion represents the module's effective externally
visible symbol set as established by TypeScript, including re-exports. An export
relationship retains the exported name and how it was established, including
direct declaration, aliasing, re-export, wildcard forwarding, default export, or
export assignment where applicable. Origin is retained when established, and
type and value roles are independent and may coexist.

One effective exported symbol follows TypeScript semantic symbol identity even
when overloads, declaration merging, or namespace augmentation contribute several
declarations. Those declarations remain separate evidence rather than appearing
as unrelated duplicate exports.

Documentation attached to an exported alias and documentation attached to an
originating declaration remain distinct assertions.

#### Rationale

Re-exports define a module's public surface; omitting them would make barrel and
forwarding modules misleading. Preserving relationship and declaration detail
retains truth without forcing it all into the normal presentation.

#### Alternatives considered

- Include only locally declared exports: rejected because it would misrepresent
  the external surface of barrel and forwarding modules.
- Emit one exported entry per contributing declaration: rejected because
  overloads and merged declarations contribute to one semantic symbol.

#### Consequences

- Presentations can identify effective exports without losing the direct,
  aliased, or forwarded relationship that established them.
- Multiple declarations and origin information remain available as supporting
  records rather than duplicate public symbols.

### Discover entity-associated in-source documentation

#### Decision

Language analysis discovers in-source documentation that the applicable language
environment associates with a program entity. It records the documentation as a
recorded assertion, linked to its subject with source provenance and the language
mechanism establishing the association. PostCode establishes that the
documentation exists and what it says, not that its contents are true, current,
or complete.

The initial TypeScript integration applies this responsibility to modules and
exported symbols using documentation associated by the supported TypeScript
compiler model, including structured tags where available. It does not infer the
subjects of arbitrary unattached comments or perform natural-language synthesis.
Several contributing or conflicting documentation records remain distinct.

Documentation may be surfaced prominently because it can materially improve
understanding. It may also contribute to generated mnemonic handles, but such a
handle remains an interpretive convenience whose provenance and generated status
are retained.

#### Rationale

Documentation is among the most useful conceptual information already present in
source. Treating it as a recorded assertion preserves its value without
mistaking authorial description for mechanically established program behavior.

#### Alternatives considered

- Treat documentation text as a derived fact about program behavior: rejected
  because the analysis establishes only that the assertion was recorded.
- Infer the subjects of arbitrary comments or synthesize documentation in this
  slice: deferred because those require separate interpretive methods and
  qualifications.

#### Consequences

- Language integrations are responsible for discovering documentation their
  supported environment associates with entities.
- Presentations may use documentation prominently while preserving its recorded-
  assertion status and distinct contributing sources.

### Keep conceptual presentation separate from source escape

#### Decision

Normal Unicode and JSON presentations show conceptual facets and conceptual
qualification. They do not show source facets or source-level Claim context such
as filesystem paths, declaration positions, raw syntax, compiler-node detail, or
implementation mappings.

Source-level detail is available only through an explicit source expansion and is
identifiable as source escape-hatch use. Language-specific does not automatically
mean source-level: TypeScript may mechanically establish a truthful conceptual
facet while its compiler mechanism and source mapping remain unexpanded
provenance.

Epistemological status, evaluation materialization, and consequential limitations
remain visible even when detailed source evidence is not shown.

#### Rationale

The initial slice must exercise PostCode's conceptual surface rather than become a
decorated source browser. At the same time, hiding qualification or pretending
that source provenance does not exist would weaken trust and traceability.

#### Alternatives considered

- Show paths and source locations in the normal presentation: rejected because
  it would make the initial product surface a source-oriented inventory.
- Hide all provenance and qualification until source expansion: rejected because
  users need conceptual status and limitations to understand the claims shown.

#### Consequences

- An explicit source expansion requires the source-escape observation behavior
  required by the adopted product design.
- If source expansion is deferred from the initial implementation, normal
  presentations still enforce this boundary and the missing escape affordance is
  explicit plan scope rather than a silent fallback.

### Make references repeatable but snapshot-scoped

#### Decision

Analysis snapshot identity is deterministic over all analysis-defining inputs and
method versions. Within an equivalent snapshot, module opaque identifiers,
mnemonic handles, ordering, and structured output are deterministic across
processes. Changed inputs produce a different snapshot context.

Identifiers do not assert semantic identity across snapshots. Cross-revision or
cross-analysis continuity is a separate qualified relationship. A stale mnemonic
or identifier that does not match the current snapshot produces an honest
no-current-match result rather than an inferred successor.

The CLI supports focusing or expanding modules selected by an exact name,
mnemonic handle, or opaque identifier learned from an earlier inventory. A
referent may resolve to zero, one, or several entities; cardinality and the
selected subset remain visible. Wildcard, partial, fuzzy, and list selector syntax
is deferred and exact lookup does not silently fall back to fuzzy matching.

#### Rationale

Repeatability supports continued CLI use, reproducible JSON, debugging, and
testing without requiring a persistent cache. Snapshot scoping prevents a stable
encoding from masquerading as durable semantic identity.

#### Alternatives considered

- Use persisted cache record IDs as stable references: rejected because cache
  lifecycle and eviction would determine logical identity.
- Preserve stale mnemonic handles as aliases: deferred because it would imply
  continuity that has not been established.
- Fall back from exact selection to fuzzy matching: rejected because a stale
  referent could silently select a different entity.

#### Consequences

- Equivalent uncached invocations can reproduce usable references.
- Changed inputs intentionally create a new snapshot namespace and may invalidate
  earlier interactive mnemonics.

### Preserve Claim context and evaluation outcomes distinctly

#### Decision

A **Claim** is the information asserted by an analysis result. **Claim context**
contains its evidence or source references, provenance and method, scope,
epistemological guarantee, and limitations. Context may be shared across a result
set and narrowed for a particular record without erasing the narrower
qualification.

An **evaluation outcome** describes what occurred while PostCode attempted to
materialize requested information: applicability and availability, execution
state, result materialization, relevant cost, and failure or stopping reasons.
Evaluation outcome is not Claim context and may exist when no claim or entity was
produced.

A projection is itself an addressable program-domain object. It identifies its
subject, lens, parameters, and analysis snapshot and retains the relevant
evaluation outcomes and references to its claims. Multiple evaluation attempts
must not overwrite one another or make a later result erase a prior deferred,
partial, stopped, or failed attempt.

Project-open failure occurs before an investigation projection exists. After a
project opens, diagnostics encountered on an actual requested analysis path
conservatively qualify the relevant result in this slice; PostCode does not run
unrelated compiler checks merely to search for diagnostics.

#### Rationale

Produced records cannot explain why nothing was produced. Separating evaluation
outcomes from Claim context distinguishes an established empty result from
deferred, unavailable, stopped, or failed work and preserves the adopted
epistemological and resource-bounded analysis model.

#### Alternatives considered

- Attach every outcome only to produced entity records: rejected because no
  record exists for deferred, failed, or established-empty results.
- Collapse evaluation state into Claim context: rejected because execution and
  materialization do not determine whether a produced claim is true or exact.
- Overwrite earlier attempts with the latest result: rejected because it would
  destroy evidence of partial, stopped, failed, or deferred evaluation.

#### Consequences

- Projection-level context can explain both content and its absence.
- Shared evaluation outcomes are surfaced only where relevant to a lens rather
  than being copied indiscriminately into every claim.

### Validate usefulness as an application instrument

#### Decision

Completeness and correctness within the supported TypeScript contract are
necessary automated verification conditions. Human inspection must also
establish that the Unicode output is usable as a starting point rather than a
compiler-data dump.

As app-local formative validation, give the projection alone to clean AI agents
and ask consistent structured questions about what the project contains,
apparent module roles, a justified next investigation subject, supported
conclusions, ambiguity, confusing information, and missing conceptual
information. Retain the projection, questions, model/context conditions, and
responses where practical.

Exercise the slice on PostCode and at least one unfamiliar external TypeScript
repository. This validation asks whether the module view supplies a useful
starting point. The research project's broader comparison of conceptual and
source-aware understanding remains outside the slice.

#### Rationale

An accurate enumeration can still fail as a product surface. Structured clean
evaluation reduces familiarity and acceptance bias without pretending that agent
responses are objective measures or substitutes for human judgment.

#### Alternatives considered

- Treat semantic fixture correctness as sufficient validation: rejected because
  accurate data can still form an unusable product surface.
- Use only the project author's inspection: rejected because familiarity can
  substitute for information actually conveyed by the view.
- Make comparative conceptual/source-aware research an acceptance gate: rejected
  because that broader question belongs to the research project using PostCode.

#### Consequences

- Verification includes objective semantic checks and bounded formative
  evaluation without treating agent impressions as product truth.
- Validation evidence retains enough context to be inspected and compared.

## Follow-up

- Revisit omitted TypeScript module categories when they create a demonstrated
  usability gap.
- Implement dependencies and dependents in the separate subsequent slice.
- Revisit partial analysis and durable caching when measured cost warrants them.
- Let the research project own comparative conceptual/source-aware experiments.
