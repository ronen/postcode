# Subject-kind standard expansion decision

Arising from: [Module dependencies plan](../plans/module-dependencies-plan.md)
Scope: the cross-cutting definition of standard expansion for entity and non-entity subject kinds

## Context

The accepted definition limits standard expansions to information defined for an
entity kind. The dependency slice needs presentations to request qualified
organization information about dependency relationships before evaluation
without turning those relationships into entities or silently applying another
lens.

## Decisions

### Define standard expansions for kinds of subject

#### Decision

Broaden the governing standard-expansion definition from related information
defined for an entity kind to related information defined for a kind of subject.
A presentation may request that information as inline detail without applying
another lens.

Entities and relationships remain different concepts. A relationship can serve
as a subject, be addressable, and have qualified property or relationship claims
without becoming an Entity.

Use the generalized mechanism for:

- a module-subject composition expansion that materializes `re-exports only`;
- a dependency-relationship-subject organization-context expansion that
  materializes placement-relative claims and identifies its organization scheme.
  The initial expansion requests repository layout.

A presentation declares the expansion before evaluation. Domain analysis defines
and materializes it; projection construction selects the resulting records and
outcomes; rendering consumes stored information only.

#### Rationale

The established expansion boundary already lets presentations request useful
information before evaluation without silently becoming another lens. The new
organization property concerns a dependency relationship rather than either
endpoint module. Generalizing expansions to subject kinds is smaller and more
accurate than making relationships entities or making optional organization
context inherent to every dependency projection.

#### Alternatives considered

- Extend Entity to include relationships: rejected because it collapses a useful
  distinction and raises unnecessary identity, participant, lifecycle, and
  inspection questions.
- Attach the organization property to a module: rejected because the property
  concerns a particular dependency relationship.
- Make organization context inherent to all dependency projections: rejected
  because the information is optional presentation detail with its own cost and
  evaluation outcome.
- Build a general property planner: rejected because standard expansions already
  satisfy the concrete requirement.

#### Consequences

- `docs/core-concepts.md` defines standard expansion for kinds of subject.
- Standard expansions may now be defined for other non-entity subjects when a
  concrete presentation need arises; this does not create a universal expansion
  registry or require every subject kind to define one.
- Existing module export, documentation, group-detail, and source-detail
  expansion semantics remain valid.


## Governing-document change

[`docs/core-concepts.md`](../core-concepts.md) defines standard expansion as
related information for a kind of subject rather than only an entity kind.

This decision does not change the architectural constraints.
