# Initial projection architecture decisions

Status: accepted
Decided: 2026-09-10
Arising from: [Initial module inventory plan](../plans/initial-module-inventory-plan.md)
Scope: internal boundaries established by the initial PostCode slice
Supersedes:
Superseded in part:
Superseded by:

## Context

PostCode needs to represent entities, claims, relationships, evidence,
qualifications, evaluation outcomes, and projections. Later slices are expected
to add many-to-many relationships, additional analysis providers, composite
lenses, larger repositories, and possibly durable caching. The initial slice must
preserve those conceptual distinctions without building speculative frameworks or
committing all code to an early physical storage engine.

## Decisions

### Use a record-oriented program-information model

Represent analyzed and projected information as qualified, addressable program
records rather than as a graph object constructed for one view. Records may refer
to other records, allowing graphs, trees, tables, and paths to be derived for a
particular projection or presentation.

Program records include program entities, claims, Claim context, relationship
claims, recorded assertions, evaluation outcomes, projections, and the
relationships among them. Being addressable does not collapse those categories
into one generic entity kind.

Every record and claim has explicit analysis-snapshot and method context. Records
from several repository states may coexist, while correspondence across states is
a separate qualified relationship rather than identifier reuse.

#### Rationale

The record model matches the qualified, composable nature of PostCode information
and permits later relational analyses without making one graph representation or
one lens's needs canonical.

#### Consequences

- The initial implementation need not materialize every possible record eagerly
  or adopt one universal schema.
- Graph structure is derived from relationship records rather than becoming the
  sole storage model.
- Large non-relational payloads may later be referenced artifacts without changing
  the identity and qualification model.

### Isolate storage behind `ProgramRecordStore`

Analyses, evaluation, and projection construction communicate through a
storage-independent `ProgramRecordStore` boundary. Program-domain records and
their qualifications do not expose storage-native rows, query objects,
connections, or identifiers.

The boundary exposes only operations required by implemented slices. It supports
snapshot-scoped entity references and domain-shaped queries. Whether already
available information is reached through services, properties, accessors, or a
per-entity facade is an implementation choice, provided meaningful cost, failure,
qualification, and materialization behavior is not hidden.

The first store is ephemeral. Its engine is an implementation choice; SQLite is
neither required nor excluded. Durable cache storage, durable investigation state,
and formative observation storage are separate lifecycle concerns.

#### Rationale

Direct dependence on storage-native APIs would turn the first physical engine
into a system-wide commitment. A universal persistence abstraction would be
equally premature. A narrow domain boundary preserves replaceability while
remaining grounded in actual slice operations.

#### Consequences

- Engine replacement is an architectural aim, not a promise of costless
  substitution; transaction, indexing, concurrency, and failure differences may
  later require boundary evolution.
- The implementation can test domain and projection behavior without a durable
  database.
- Durable caching cannot be created merely by retaining the ephemeral store; it
  requires a complete applicability and invalidation contract.

### Separate lens requirements, evaluation, and projection construction

Lenses and presentations do not call language analyzers directly. A lens
contributes the information requirements inherent in its projection; a composite
lens includes the requirements of its components. A presentation may declare the
standard expansions it intends to render.

An evaluation layer coordinates applicable analysis providers, execution
constraints, shared work, Claim context, and qualified materialization outcomes.
The lens constructs its projection from the evaluated state. The presentation
then renders the projection using only records materialized by that evaluation;
rendering cannot trigger new evaluation.

Shared evaluation preserves which requested information each operation satisfies.
Evaluation reports deferred, partial, unavailable, stopped, and failed work rather
than reducing all outcomes to success or failure. Projection construction handles
unmet requirements without overstating its result.

#### Rationale

This separation lets several lenses reuse analysis capabilities without coupling
them to TypeScript entry points. It also lets presentation needs influence
materialization without allowing rendering to perform hidden work or letting a
presentation silently become an arbitrary lens.

#### Consequences

- Standard expansion policy belongs to entity-kind/domain presentation semantics,
  not to `modules(project)` or a TypeScript analyzer.
- Presentation requirements remain distinct from lens parameters even when they
  affect execution planning.
- Future evaluation may become lazy, incremental, or staged without changing lens
  semantics.

### Keep the first evaluator eager and implementation-specific

For the initial slice, evaluation may compute all requirements for a requested
view before projection construction. Do not build a general lazy, incremental,
staged, or capability-planning framework merely to preserve future options.

The architecture fixes responsibilities and invariants, not exact API mechanics.
Implementation agents choose the smallest clear API for method names, call
direction, plan values versus direct requirement declaration, composition,
request sets or flags, batching and deduplication ownership, and
property-versus-service access.

#### Rationale

The first module and export analysis can be performed together. Specifying a
general planner before a data-dependent or expensive analysis requires it would
create framework code based on imagined needs.

#### Consequences

- A temporary orchestration function may exist or not; its name and shape are not
  architectural commitments.
- Recurring implementation friction is evidence that the boundary or its
  abstraction level should be reconsidered, not a reason to accumulate exceptions.

### Make projection and evaluation state first-class records

A projection is an addressable program-domain object rather than only a transient
return value. It identifies its subject, lens and lens parameters, and analysis
snapshot, and it refers to the claims that constitute its content.

Evaluation outcomes are distinct records or immutable domain values associated
with the relevant projection request or materialization. They remain available
when no entity or claim was produced. Repeated attempts do not overwrite one
another or erase prior partial, deferred, stopped, or failed outcomes.

The lens selects only evaluation outcomes relevant to its projection when
constructing lens-wide Claim context. A shared evaluation's unrelated failures or
work are not indiscriminately surfaced through every projection.

#### Rationale

Storing projections and evaluation outcomes within the same program-record model
keeps qualification consistent and makes projections addressable for future
navigation and agent context. Separate attempts are necessary because a logical
request may be evaluated under different execution conditions.

### Use deterministic logical identity independently of persistence

Derive analysis-snapshot identity deterministically from every input and method
version capable of changing the claims made by the slice. Derive module record
identifiers, mnemonic handles, ordering, and structured output deterministically
within an equivalent snapshot.

Persistence and identity remain independent. Recomputing an equivalent snapshot
reproduces its logical identifiers even when no cache survives. A different
snapshot namespace makes no continuity claim, even if a local identifier happens
to have the same spelling.

The first slice uses a cache-capable lifecycle but does not automatically reuse
analysis records across process lifetimes. A running process may retain an
applicable snapshot in memory. Cross-process caching is deferred until PostCode
can validate all analysis-defining inputs and address retention, migration,
concurrency, cleanup, and recovery.

#### Rationale

Determinism provides repeatable CLI references, reproducible structured output,
and testability without using persistence as identity. A knowingly incomplete
cache-validity check could silently return false claims and is therefore worse
than recomputation.

## Alternatives considered

- Pass immutable values directly between every stage without a store boundary:
  viable for the first lens but less suited to addressable projections and the
  relationship-heavy next slice.
- Use SQLite directly throughout the domain: deferred because it would make a
  physical engine part of every consumer before its durable requirements exist.
- Build a universal storage abstraction: rejected as speculative; the store grows
  only with concrete domain operations.
- Have lenses call analyzers directly: rejected because it couples product
  semantics to language-specific execution and impedes reuse by composite lenses.
- Let presentation rendering trigger analysis: rejected because rendering would
  become stateful, non-reproducible, and capable of concealing cost or failure.
- Require a complete one-pass plan object: not adopted; requirements may later be
  declared, staged, or expanded through implementation-specific mechanisms.
- Use persistent cache records as entity identity: rejected because eviction and
  lifecycle would determine logical reference stability.

## Follow-up

- Reconsider SQLite or another engine when relationship queries or persistence
  provide demonstrated value.
- Add lazy or staged evaluation only when an implemented analysis requires it.
- Keep durable investigation/session state and formative observation storage in
  explicitly separate lifecycle decisions even if they later share a physical
  engine.
