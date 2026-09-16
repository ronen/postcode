# Dependency and organization integration decisions

Status: in review
Decided:
Arising from: [Module dependencies plan](../plans/module-dependencies-plan.md)
Scope: qualified composition of module-dependency evidence with the accepted repository-layout organization

## Context

The completed repository-organization slice established one explicit organization scheme, qualified group containment, and module placement. Dependency relationships can now be interpreted relative to that organization, but repository layout does not establish architectural intent, policy, or a unique perspective for multiply placed modules.

This record governs organization-relative information about individual dependency
relationships. It relies on, but does not define, the cross-cutting
standard-expansion concept.

## Decisions

### Classify organization relationships conservatively from occurrence evidence

#### Decision

When requested, relate a dependency occurrence to the explicit repository-layout
organization using its captured source evidence and established target placement.
Use the source placement or placements applicable to that occurrence. Do not
automatically use every placement of a multi-declaration module when the
occurrence belongs to a narrower placed declaration or artifact. When the evidence
cannot narrow the source placement, use every established applicable placement
conservatively.

Use resolution evidence in the same way when it establishes a narrower target
artifact or declaration placement. When it cannot narrow the target, use every
established applicable target placement conservatively. Do not invent an
association between source and target placements that the occurrence evidence
does not support.

Establish a common classification only when it survives every applicable
endpoint placement supported by the occurrence evidence:

- `within` when the child remains within every applicable source placement's
  organizational context;
- `into-descendants` when the child is in a descendant group for every applicable
  source placement, accounting for every applicable target placement;
- `outward` when the child is outside every applicable source placement and its
  descendants, accounting for every applicable target placement; and
- `varies-by-placement` when established placements give different answers.

Retain partial or unavailable placement evaluation rather than forcing a value.
Reserve ambiguous for candidate placements the provider cannot establish.

Aggregate module relationships expose a common organization classification only
when all supporting occurrences agree. Otherwise retain variation by occurrence
and the occurrence-level evidence. Preserve the organization scheme, endpoint
placements, containment evidence, common ancestors where established, and
evaluation outcomes supporting the result.

Do not introduce contextual facets or group-parameterized dependency questions in
this slice.

#### Rationale

A module with several established placements can have a relationship that is
inside all placement contexts, outside all of them, or inside some and outside
others. Conservative invariant classification supplies useful structure without
choosing one convenient organizational perspective. Captured occurrence evidence
can often avoid unrelated placements that would otherwise weaken the result.

#### Alternatives considered

- Store one unqualified `crossesBoundary` Boolean: rejected because multiple
  placements and partial evidence can produce mixed or unavailable results.
- Parameterize every classification by a selected group: deferred as contextual
  facets until a group-relative product question justifies them.
- Cross-product every module placement: rejected because it can invent
  combinations unrelated to the source occurrence that established the edge.
- Call established variation ambiguous: rejected because the provider may know
  every placement and their differing consequences exactly.
- Infer architectural violations from boundary crossings: rejected because
  repository layout establishes no dependency policy or intended layering.

#### Consequences

- Some relationships receive `varies-by-placement` or
  `varies-by-occurrence` instead of a simpler tag. These preserve exceptional
  multi-placement or differing-occurrence evidence; they are not a primary
  presentation journey.
- Dependency results remain valid when organization information is unavailable;
  only the requested expansion is weakened.
- A later group-relative lens may add contextual facets through a separate
  decision.

## Follow-up

- Add contextual facets only when a concrete group-relative question requires them.
