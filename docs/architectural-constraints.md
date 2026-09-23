# Architectural Constraints

This document states PostCode's current binding, cross-cutting architectural constraints. It is the concise operational source for rules that implementations must preserve across plans and slices. Accepted [decision records](decisions/) preserve why these constraints were adopted or changed.

The constraints conform to the adopted [product design](../foundation/product-design.md) and use the governing terminology in [core concepts](core-concepts.md). They do not describe the implementation, repeat routine implementation conventions, or collect every consequence of every accepted decision. Descriptive implementation architecture belongs under [`docs/architecture/`](architecture/), and repeatable mechanical practices belong in [implementation conventions](implementation-conventions.md).

Substantive changes require explicit human agreement and a corresponding accepted decision record, with both updated in the same commit. Append to every constraint a short bracketed link to the decision that established or most recently changed it. Follow the [development workflow](../dev/workflow.md#documentation) when changing this document. If this document and an accepted decision disagree, treat the inconsistency as an unexpected finding rather than silently choosing or reconciling them.

## Claims and qualification

- Preserve each claim's evidence or source references, provenance and method, scope, epistemological guarantee, and limitations throughout evaluation, projection construction, transformation, storage, comparison, caching, and presentation. Shared context must remain attributable, and narrower qualification must not be erased. [[Preserve claim qualification](decisions/adopt-qualification-and-evaluation-constraints.md#preserve-claim-qualification-throughout-processing-and-presentation)]
- Derive a claim's epistemological status from its evidence and method. Confidence expressed by a person, heuristic, or generative model does not strengthen the claim. [[Preserve claim qualification](decisions/adopt-qualification-and-evaluation-constraints.md#preserve-claim-qualification-throughout-processing-and-presentation)]
- Do not strengthen or broaden a claim when transforming, aggregating, caching, comparing, or rendering it. [[Preserve claim qualification](decisions/adopt-qualification-and-evaluation-constraints.md#preserve-claim-qualification-throughout-processing-and-presentation)]
- Keep mechanically derived facts, recorded assertions, observations, and interpretations distinguishable in domain representations and human-facing views. [[Preserve claim qualification](decisions/adopt-qualification-and-evaluation-constraints.md#preserve-claim-qualification-throughout-processing-and-presentation)]
- Keep consequential qualification visible in the human-facing view. A weaker, partial, historical, asserted, observed, or inferred claim must not masquerade as a stronger one. [[Preserve claim qualification](decisions/adopt-qualification-and-evaluation-constraints.md#preserve-claim-qualification-throughout-processing-and-presentation)]
- Prefer explicit unavailability, refusal, partiality, or limitation to plausible unsupported output. [[Preserve claim qualification](decisions/adopt-qualification-and-evaluation-constraints.md#preserve-claim-qualification-throughout-processing-and-presentation)]

## Evaluation and failure

- Keep analysis applicability and availability, execution state, result materialization, and epistemological status distinct. Additional work or successful execution does not inherently make a produced claim truer or more exact. [[Evaluation and failure distinctions](decisions/adopt-qualification-and-evaluation-constraints.md#keep-evaluation-materialization-and-failure-distinctions-explicit)]
- Preserve usable qualified information from partial, stopped, or failed evaluation when the analysis method permits it. Do not make an absent result indistinguishable from an established empty result. [[Evaluation and failure distinctions](decisions/adopt-qualification-and-evaluation-constraints.md#keep-evaluation-materialization-and-failure-distinctions-explicit)]
- Keep expected operational failures, unexpected defects or broken invariants, successful results containing diagnostics or limitations, and evaluation failures that prevent the intended result distinct. Do not convert an unexpected defect into an ordinary analysis outcome merely to continue execution. [[Evaluation and failure distinctions](decisions/adopt-qualification-and-evaluation-constraints.md#keep-evaluation-materialization-and-failure-distinctions-explicit)]
- Preserve meaningful domain distinctions until presentation. Presentation may format or progressively disclose information, but must not collapse distinctions that affect what the result means or what may safely be concluded from it. [[Evaluation and failure distinctions](decisions/adopt-qualification-and-evaluation-constraints.md#keep-evaluation-materialization-and-failure-distinctions-explicit)]

## Session references and retained information

- Once a session reference is bound to an entity, do not rebind it. Adding inputs, evidence, or results must not change that binding. [[Session references](decisions/transient-analysis-sessions.md#stable-reference-bindings-within-a-session)]
- Retain captured evidence and produced results without mutation by later analysis. Preserve their supporting inputs, method versions, qualifications, and relevant evaluation outcomes; session membership alone does not establish their evidential basis. [[Accumulated results](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)]
- Keep observation event identities and clocks separate from program claims. Entity and record references need not reproduce across invocations; equivalent analyses must remain semantically comparable without erasing meaningful differences. [[Session context](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]
- For mechanical analyses, equivalent inputs, methods, requirements, completed evaluations, and presentation choices produce deterministic semantic content, ordering, and presentation apart from session-local references and observation metadata. Cross-session reference spelling is not a determinism requirement. [[Session context](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]
- Unrelated accumulated work does not change a lens's population or meaning. Reuse satisfies declared requirements and expansions; additional information from completing an earlier incomplete evaluation remains distinguishable from changing the requested question. [[Accumulated results](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)]
- Under the initial unchanged-input session contract, detected relevant input changes invalidate further investigation. Disclose best-effort detection and non-atomic capture; do not claim comprehensive freshness validation. [[Input stability](decisions/transient-analysis-sessions.md#stable-inputs-as-the-session-precondition)]

## Generated-output evidence boundary

- Keep PostCode-generated output outside the analyzed repository or exclude it from repository evidence through an explicit, enforced PostCode policy. Do not infer exclusion merely from generic directory names, Git-ignore status, or markings in the content. [[Explicit generated-output evidence boundary](decisions/adopt-identity-evidence-and-observation-constraints.md#exclude-generated-output-through-an-explicit-evidence-boundary)]

## Observation lifecycle and delivery

- Keep observation-sink selection independent of retention, migration, historical-reading, and producer-side cache policy. [[Observation lifecycle policy](decisions/adopt-identity-evidence-and-observation-constraints.md#keep-sink-selection-separate-from-observation-lifecycle-policy)]
- Make observation-delivery failure visible without invalidating an otherwise successfully produced view. [[Observation delivery failure](decisions/adopt-identity-evidence-and-observation-constraints.md#preserve-a-successful-view-when-observation-delivery-fails)]

## Source evidence and disclosure

- Derive presented source evidence from the captured analysis input supporting the claim, not from a later filesystem read that may observe different content. [[Captured source evidence](decisions/adopt-identity-evidence-and-observation-constraints.md#present-source-evidence-from-captured-analysis-input)]
- Record each source escape and the actual level of source detail disclosed. [[Source-disclosure level](decisions/adopt-identity-evidence-and-observation-constraints.md#record-the-actual-source-disclosure-level)]
