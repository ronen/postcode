# Facets for subjects

Status: in review
Decided: [needs-review — set adoption date at promotion]
Arising from: [Module investigation](../plans/module-investigation.md)
Scope: Property and Facet definitions, including facets of non-entity subjects
Supersedes: [Define Facet as a classification role played by a property](../../../docs/decisions/initial-core-concepts-decisions.md#define-facet-as-a-classification-role-played-by-a-property)

## Context

The initial Property/Facet decision defines properties of subjects but limits
facets to classifying entities. [Investigrams](investigrams-and-progressive-investigation.md)
are non-entity subjects whose revision and conflict states also serve as compact
classification dimensions. This record broadens facet applicability to subjects
and restates the other Property/Facet distinctions so that the replacement
decision is self-contained.

## Decisions

### Apply facets to subjects, including investigrams

Use Property for a characteristic of a subject about which information can be
requested or asserted. Distinguish the characteristic from claims about its
value or whether it holds. A Facet is a property used as a compact
classification dimension for describing, filtering, grouping, or comparing
subjects, including entities and investigrams. A claim supplies its value, and
Claim context supplies its qualification. Different facets may overlap and need
not share a representation or value type.

Facet names a role played by a property, not a separate record category or a
special epistemological status. A conceptual facet describes the subject in
terms useful to investigation; a source facet describes its source-level
representation or implementation mapping. Language-specific knowledge can
establish a conceptual facet and does not by itself make that facet
source-level. Facet names do not determine claim strength. Adopt no universal
Property or Facet schema, implementation subtype hierarchy, or generic facet
machinery.

Investigram facets such as superseded, supersedes, conflicting, and needs
reconsideration have values supplied by session-scoped claims derived from
retained corrections, citations, and evaluation context. New session context
yields new derived claims without modifying immutable investigram content. A
recorded correction or conflict does not establish which program interpretation
is true.

Claims about an investigram's correction, conflict, or reconsideration state
concern that session artifact. Their scope is the relevant session state, and
their support comes from retained relationships and evaluation context.

#### Rationale, alternatives, and consequences

Properties already apply to subjects. Broadening facets from entities to
subjects allows the same descriptive classification role for investigrams.
Describing their revision and conflict states is useful by itself; this slice
does not require new filtering or grouping operations. Presentation-only
annotations would describe the same characteristics without recognizing their
existing conceptual role as facets.

## Governing impact and promotion

The accompanying [core concepts](../core-concepts.md) extend Facet from
entities to subjects and link the Property and Facet definitions to this record.
The decision above fully replaces the initial decision's headed Property/Facet
definition, preserving its other distinctions.

At promotion, add a `Superseded in part` mapping from
[Define Facet as a classification role played by a property](../../../docs/decisions/initial-core-concepts-decisions.md#define-facet-as-a-classification-role-played-by-a-property)
to [Apply facets to subjects, including investigrams](#apply-facets-to-subjects-including-investigrams).
The earlier record remains partially superseded. Set the decision date at
adoption, update canonical indexes, and rewrite links for their destination paths.
