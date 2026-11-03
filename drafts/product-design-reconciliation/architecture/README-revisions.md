# Proposed revisions to docs/architecture/README.md

Delivery note: these descriptions accompany the required implementation and must be checked against delivered behavior before publication. The [assessed baseline](../plans/product-design-reconciliation.md#assessed-baseline) remains in the plan; implementation-specific format and execution descriptions elsewhere in this document are updated by the implementing agent as needed.

## Replace the opening paragraph

The development CLI supports project investigation and standalone inadequacy feedback. Investigation opens one configured TypeScript project in a transient Session, evaluates module inventory and presentation-declared standard expansions, constructs retained Projections and presents qualified Unicode text or experimental JSON. Produced Views submit self-contained observation batches to a separate local sink. Standalone feedback uses that observation boundary without opening an investigation. The initial slice's instrument validation and independent reviews are recorded in the [completed task](../../records/tasks/2026-09-12-initial-module-inventory.md).

## In the introductory lifecycle paragraph, replace the sentence beginning “The shell and one-shot CLI share”

Shell and one-shot investigation requests share execution in a private compiler worker; context-free feedback submission has no analysis-worker requirement.

## Add at the start of “Implemented subset of the product model”

The CLI's text and JSON presentations share the [human output boundary](../decisions/human-facing-architectural-representations.md#human-output-boundary). `--more-details` exposes additional qualified information and attribution without the former source excerpts and declarations. Source acquisition and captured evidence remain available to analyses and the Investigator. Meaning-preserving presentation does not infer new program properties or refresh a retained answer. Representative semantic assessment and its limits are part of [reconciliation verification](../plans/product-design-reconciliation.md#implementation-verification), not a guarantee that every possible generated passage is adequate.

Exact retained-answer presentation preserves frozen selection and support, including through paging, without acquiring evidence or invoking interpretation. Additional-detail choices retain that boundary. This implementation does not add durable investigation history, arbitrary coordinated Views or complete captured-basis export.

The current Investigram implementation carries prose and qualified support, with associations, composition, corrections and exposure-based reconsideration. The [interpretation-content definition](../core-concepts.md#interpretation-content) applies the existing contracts to prose, structured content or a combination; it does not implement structured content or select account schemas or a working-account architecture.

## In “Implemented subset of the product model,” replace the paragraph beginning “Current observation batches retain”

Investigation observation batches retain the presented View, rendered output, Session identifier, configured paths and method names, but do not generally export the captured program-state basis associated with the Projection. For example, ordinary module inventory omits the retained analysis-input support; individual evidence references or attribution details do not establish a complete captured-state association. Retained core support and exported observation provenance are different guarantees. This is a [known recording gap](../decisions/coordinated-views-and-qualified-results.md#current-observation-provenance-gap), not only a future multi-state requirement. Feedback includes the context already available for the displayed result; it does not close that broader gap or reconstruct a missing basis.

## In “Request publication,” replace the opening sentences from “The worker result distinguishes” through “Input checks and observation-delivery warnings apply to every alternative.”

An investigation worker result distinguishes a program View, a subjectless usage report and a request-resolution report. The parent finalizes reports using its authoritative usage ledger. Publication records the actual normalized request in versioned experimental observations and emits a View event only for a program View. Input checks and observation-delivery warnings apply to every alternative.

## In “Request publication,” add a feedback paragraph

Feedback submission is separate from investigation execution and answer selection. Shell feedback preserves available context for the most recently displayed result, while one-shot feedback has no associated investigation context. Submission uses the observation boundary, with continued investigation independent of pending delivery and failures disclosed without invalidating the result. Observation records remain self-contained and do not restore a Session or its reference bindings. [Feedback observations](../decisions/human-facing-architectural-representations.md#feedback-observations) governs this distinction.
