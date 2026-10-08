# Keep views grounded in core projections

Status: superseded
Decided: 2026-10-05
Arising from: human discussion before planning the first GUI slice
Scope: PostCode interfaces presenting information about an investigated program

Superseded by: [Keep evaluation and qualified construction independent of presentation](coordinated-views-and-qualified-results.md#keep-evaluation-and-qualified-construction-independent-of-presentation) and [Coordinate supplied information without deriving new program claims](coordinated-views-and-qualified-results.md#coordinate-supplied-information-without-deriving-new-program-claims).

## Context

The governing [core concepts](../core-concepts.md#investigation-and-representation)
distinguish a Lens, which asks a question about a subject; a Projection, which
contains the qualified information produced for that question; a Presentation,
which describes how a Projection is rendered and interacted with; and a View,
which instantiates a Presentation of a particular Projection. GUI design has
exposed useful program information that current analyses do not yet provide.
Deriving it within GUI code would make its meaning, qualification and reuse
depend on that interface.

The [initial projection-architecture decision](initial-projection-architecture-decisions.md#separate-lens-requirements-evaluation-and-projection-construction)
already separates lens requirements, Evaluation, Projection construction and
rendering. This decision extends that responsibility boundary to interfaces;
it does not replace the earlier decision.

## Decision

Preserve those roles at the GUI boundary. The GUI may select a subject and
Lens, request Evaluation and declared expansions, provide graphical
Presentations for the resulting Projections, instantiate and navigate Views,
and manage interaction and workspace state. Analysis and Projection
construction remain interface-independent. Here, “core” means those
interface-independent analysis, Evaluation and Projection-construction
responsibilities, not a particular package. The same boundary applies to
other interfaces: interface and Presentation code must not establish new Claims
about investigated subjects or retained interpretations.

An interaction, including expansion in place, may issue a new request through
Evaluation; rendering a View from materialized information does not itself
initiate Evaluation.

A Presentation may sort, group, filter, progressively disclose and aggregate
Claims, Claim context, supporting evidence and evaluation outcomes made
available by the core for its Projection. It may count items in that Projection
or items shown in a View. Each count refers to the population it actually
counts: a count over a filtered or truncated View is not a count of the full
Projection.

The Presentation must preserve qualification and materialization, and disclose
consequential filtering, aggregation or omission, as required by the adopted
[presentation rule](../../foundation/product-design.md#213-presentation). A
project-wide total not established by the Projection, or any conclusion
requiring additional evidence or a new analysis method, must come from a core
capability.

## Rationale

PostCode has a deliberately built mechanism for deriving program information
with evidence, method, scope, epistemological guarantee, limitations and
evaluation outcomes. Deriving that information is PostCode's domain logic. If
the GUI performed it independently, the result could bypass qualification and
acquire different meanings across interfaces. The GUI should use the core's
qualified Projections and concentrate on interaction and Presentation. This
also lets different Presentations expose the same answer without changing the
question asked by its Lens.

## Alternatives considered

- Allow each GUI View to derive the additional program facts needed by its screen:
  rejected because those facts could acquire different meanings and
  qualifications across Presentations and interfaces.
- Forbid all presentation-side derivation: rejected because layout, selection
  and aggregation over projected information are ordinary presentation work
  when their scope and limitations remain clear.

## Consequences

GUI plans must identify missing core capabilities needed to produce qualified
Projections, such as Lenses, analyses or standard expansions, rather than have
View code produce unsupported program information. This decision does not
require those capabilities to be built before GUI work begins. Its boundary
concerns responsibilities, not source-file names or a prescribed GUI module
structure.

The accompanying [architectural constraint](../architectural-constraints.md#views-and-analysis-boundary)
states the binding rule.
