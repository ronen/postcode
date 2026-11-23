# Knowledge-representation precedents for qualified architectural accounts

Exploratory research pointers from 2026-11-10, extracted and condensed 2026-11-23.
These are design analogies, not adopted requirements, a literature review or a
library recommendation. External references and their descriptions are preserved
from the exploration, not independently reverified during this cleanup.

Stable referents, qualified descriptions, relationships and revision/support
tracking have substantial precedents. A bounded application can use those ideas
without building a universal knowledge model, but bounded scope alone does not
prevent expensive formalization or brittle assumptions.

## References and possible lessons

- [Minsky's frames](https://dspace.mit.edu/entities/publication/0eca0164-cb5f-42de-8c86-43f54b23306d)
  organize structured descriptions and expectations. Borrow structure without
  making each Entity one mutable authoritative bundle or silently filling missing
  architectural information from defaults.
- [Doyle's truth-maintenance system](https://dspace.mit.edu/entities/publication/5377b306-4ecc-4687-b1f5-78cbb4a0543a)
  and [de Kleer's assumption-based TMS](https://www.dekleer.org/Publications/An%20Assumption-Based%20TMS.pdf)
  distinguish conclusions, justifications and assumptions, including alternative
  contexts. They inform support and reconsideration, but PostCode's exposure links
  are not logical entailment dependencies. A change to supplied material does not
  prove a resulting account false. Competing accounts need not be reconciled into
  one globally consistent belief set.
- [Wikibase's data model](https://www.mediawiki.org/wiki/Wikibase/DataModel/Primer)
  separates entities from statements with qualifiers, references and ranks.
  The identity/qualified-statement distinction is useful; ranks do not substitute
  for separate standing, applicability, selection and qualification semantics.
- [Nanopublications](https://nanopub.net/docs/guidelines/) separate assertions,
  assertion provenance and publication information;
  [W3C PROV](https://www.w3.org/TR/prov-overview/) supplies provenance concepts.
  These inform contribution boundaries and attribution. Provenance alone does not
  establish truth, sufficient evidence or permission to synthesize new claims.
- [Shipman and Marshall's *Formality Considered Harmful*](https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html)
  discusses cognitive overhead, premature structure and situational differences.
  Incremental formalization is a useful design lens: add structure when retrieval,
  investigation or communication needs it, preserving the original context.
  Formalizing an interpretation does not increase its evidential strength. This
  analogy does not prescribe an Entity-promotion lifecycle.
- [McDermott's R1 report](https://www.sciencedirect.com/science/article/pii/0004370282900212)
  describes operational use in configuring DEC computers. Older knowledge systems
  were not uniformly unsuccessful; that example does not establish general
  applicability or make knowledge acquisition and maintenance cheap.

## Questions to carry into future design

Require a concrete retrieval, investigation or diagram benefit for additional
machinery. Preserve unknowns and distinguish missing information from negative
assertions. Do not infer identity from labels, truth from structured form, or
semantic dependence merely from exposure. Shared identity and association
mechanisms need not impose a universal ontology or automatic reconciliation.

For the adopted PostCode semantics, use the [core concepts](../docs/core-concepts.md)
and [association/exposure decision](../docs/decisions/association-organization-and-exposure.md).
These references are background for future exploration, not substitutes for those
contracts.
