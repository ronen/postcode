# Proposed revisions to docs/backlog.md

## Add under “Candidates”

<a id="review-more-details-information-placement"></a>
## Review placement of information exposed by more details

Added: 2026-11-03
Origin: [Product-design reconciliation](plans/product-design-reconciliation.md#more-details)
Area: information presentation and progressive disclosure

The previous `--source-detail` interaction bundled source disclosure with other potentially useful information, making that information available only through the source escape hatch. That coupling was a design flaw: access to useful qualified information should not depend on requesting source. The minimal reconciliation replaces source disclosure with `--more-details`, preserving the other qualified information and its current placement. Review that information by purpose: what belongs in the default answer, what merits optional detail, and whether another interaction would serve the human better. Include dependency requests that did not establish edges, supporting explanations, evidence attribution, locations and implementation mappings. Their former inclusion in a source-escape option is not a reason to preserve that organization indefinitely.

Use concrete journeys to assess relevance and discoverability while preserving qualifications and bounded output. This is an improvement to information organization, not deferred conformance work or permission to restore the source escape.

<a id="explore-architectural-accounts-through-journeys"></a>
## Explore architectural accounts through concrete journeys

Added: 2026-10-29
Origin: [Allow structured investigram content](decisions/structured-investigram-content.md)
Area: architectural representations and retained interpretation

Explore structured architectural accounts carried as investigram content, potentially with several selected investigrams forming a working account. This is a promising approach, not an architectural decision to adopt it. Begin with concrete journeys and selected representations—such as operation admission/cancellation or responsibility across a boundary—and discover the content each needs. Evaluate usefulness to an architect without source-language literacy, not merely successful rendering or schema validity.

Keep partiality, conflicts, evidence, revision history and interpretive status attributable across all [interpretation content](core-concepts.md#interpretation-content), including structured portions and embedded prose. Apply the existing inspection, follow-up, citation and correction contracts, including complete content delivery where required. Reuse retention, associations and replacement mechanisms where they fit; a selected account set need not be one mutable composition tree or a canonical architecture. Defer account schemas, selection, correspondence and subclaim identity until the journeys establish the need. Before extending beyond an unchanged-input Session, resolve lifecycle, captured-basis and reference/correspondence choices. Use the existing coordinated-View, navigation and coding-agent context candidates rather than building parallel infrastructure by assumption. This capability exploration is distinct from required semantic representation conformance and authorizes no implementation.

## Remove “Assess disclosure classification for paths outside sourceDetail” from candidates

Its assessment is included in the [required reconciliation work](plans/product-design-reconciliation.md#observations-and-documentation), rather than deferred as a separate candidate. Preserve the originating [review](../records/reviews/module-investigation/2026-09-29-milestone-2-round-3-findings.md); moving the work into the plan does not claim the assessment has already been completed.
