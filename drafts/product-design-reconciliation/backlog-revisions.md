# Proposed revisions to docs/backlog.md

## Add under “Candidates”

<a id="review-more-details-information-placement"></a>
## Review placement of information exposed by more details

Added: 2026-11-03
Origin: [Product-design reconciliation](plans/product-design-reconciliation.md#more-details)
Area: information presentation and progressive disclosure

The previous `--source-detail` interaction bundled source disclosure with other potentially useful information, making that information available only through the source escape hatch. That coupling was a design flaw: access to useful qualified information should not depend on requesting source. The minimal reconciliation replaces source disclosure with `--more-details`, preserving the other qualified information and its current placement. Review that information by purpose: what belongs in the default answer, what merits optional detail, and whether another interaction would serve the human better. Include dependency requests that did not establish edges, supporting explanations, evidence attribution, locations and implementation mappings. Their former inclusion in a source-escape option is not a reason to preserve that organization indefinitely.

Coordinate this bounded placement review with [Review the investigation UI and UX as a whole](#review-the-investigation-ui-and-ux-as-a-whole). Use concrete journeys to assess relevance and discoverability while preserving qualifications and bounded output. This is an improvement to information organization, not deferred conformance work or permission to restore the source escape.

<a id="explore-architectural-accounts-through-journeys"></a>
## Explore architectural accounts through concrete journeys

Added: 2026-10-29
Origin: [Allow structured investigram content](decisions/structured-investigram-content.md)
Area: architectural representations and retained interpretation

The [application requires accumulated understanding](decisions/structured-investigram-content.md#require-accumulated-understanding). Existing retention and follow-up support parts of it, but the intended UX and supporting architecture have not been established. The impact is limited support for revisiting and combining architectural understanding across investigations. This capability design is deferred while the current CLI subset is described accurately; complete design and validation before claiming the broader capability is supported. It is separate from the immediate human-output conformance work.

Explore structured architectural accounts carried as investigram content, potentially with several selected investigrams forming a working account. This is a promising approach, not an architectural decision to adopt it. Begin with concrete journeys and selected representations—such as operation admission/cancellation or responsibility across a boundary—and discover the content each needs. Evaluate usefulness to an architect without source-language literacy, not merely successful rendering or schema validity.

Keep partiality, conflicts, evidence, revision history and interpretive status attributable across all [interpretation content](core-concepts.md#interpretation-content), including structured portions and embedded prose. Apply the existing inspection, follow-up, citation and correction contracts, including complete content delivery where required. Reuse retention, associations and replacement mechanisms where they fit; a selected account set need not be one mutable composition tree or a canonical architecture. Defer account schemas, selection, correspondence and subclaim identity until the journeys establish the need. Before extending beyond an unchanged-input Session, resolve lifecycle, captured-basis and reference/correspondence choices. Use the existing coordinated-View, navigation and coding-agent context candidates rather than building parallel infrastructure by assumption. This capability exploration is distinct from required semantic representation conformance.

## Remove “Assess disclosure classification for paths outside sourceDetail” from candidates

Its assessment is included in the [required reconciliation work](plans/product-design-reconciliation.md#observations-and-documentation), rather than deferred as a separate candidate. Preserve the originating [review](../records/reviews/module-investigation/2026-09-29-milestone-2-round-3-findings.md); moving the work into the plan does not claim the assessment has already been completed.

## In “Review the investigation UI and UX as a whole,” replace the opening paragraph

The session works, but repeated use makes the current views difficult to read: output is too wordy, important information is hard to find, and presentation choices that were tolerable for one-shot commands compound across an investigation. Evaluate the full journey across inventory, organization, dependencies, inspection, qualifications, additional detail and shell interaction before making isolated formatting changes. Identify what deserves immediate attention, what should be progressively disclosed, and what belongs in a later visual interface. Preserve precise navigation, evidence attribution, qualifications and consequential omission disclosure while improving readability. Coordinate the [more-details placement review](#review-more-details-information-placement) with this broader work.

## In that entry, replace the paragraph beginning “The milestone-4 progressive assessment”

The [milestone-4 progressive assessment](../records/validation/module-investigation/pass-04/report.md) supplies captured examples of repeated accounts and accounting/evidence metadata obscuring what changed, limited evidence navigation, and standalone interpretive Views omitting effective compiler/configuration attribution available in the surrounding assessment record. Assess whether intelligible evidence attribution and bounded navigation help the human identify and evaluate support under the human output boundary. Missing source excerpts are not by themselves a deficiency. These are formative observations, not measured human usability results.

## In that entry, replace the paragraph beginning “The milestone-5 integrated assessment”

The [milestone-5 integrated assessment](../records/validation/module-investigation/pass-05/report.md) adds original/current account distinctions, causal warning pages and explicit conflicts to this journey. Assess whether repeated empty revision status obscures important warnings, and how users discover qualifications learned in follow-ups when the retained summary has no explicit correction. Preserve exact historical selection and avoid implying automatic synthesis or reassessment. The [focused dependent-account sequence](../records/validation/module-investigation/pass-06/report.md) supplies further qualitative evidence about dense repeated context and demanding wording around compatible replacement accounts, structural conflicts and local versus family selection. Evaluate support and provenance intelligibility rather than treating absent source excerpts as the problem. These captures do not establish measured human misunderstanding.
