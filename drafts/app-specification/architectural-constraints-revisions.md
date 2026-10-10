# Proposed revisions to docs/architectural-constraints.md

Each block below is a complete replacement or addition at the identified destination. Unlisted material remains unchanged.

## Replace the second role paragraph

<!-- BEGIN PROMOTION CONTENT -->
The constraints conform to the adopted [product design](../foundation/product-design.md), state binding cross-cutting obligations consistent with the [application specification](app-specification.md), and use the governing terminology in [core concepts](core-concepts.md). They do not describe the implementation, repeat routine implementation conventions, or collect every consequence of every accepted decision. Descriptive implementation architecture belongs under [`docs/architecture/`](architecture/), and repeatable mechanical practices belong in [implementation conventions](implementation-conventions.md).
<!-- END PROMOTION CONTENT -->

## Replace “Evaluation and failure”, preserving its rules and adding an initiation section after it

<!-- BEGIN PROMOTION CONTENT -->
## Evaluation and failure

- Keep reusable investigation operations distinct from their consuming lenses. The evaluation layer selects retained outcomes and missing operations and coordinates execution through the domain interpretation boundary; projections consume materialized results. [[Investigation operations and lenses](decisions/investigation-operations-and-lenses.md)]
- Keep analysis applicability and availability, execution state, result materialization, and epistemological status distinct. Additional work or successful execution does not inherently make a produced claim truer or more exact. [[Evaluation and failure distinctions](decisions/adopt-qualification-and-evaluation-constraints.md#keep-evaluation-materialization-and-failure-distinctions-explicit)]
- Preserve usable qualified information from partial, stopped, or failed evaluation when the analysis method permits it. Do not make an absent result indistinguishable from an established empty result. [[Evaluation and failure distinctions](decisions/adopt-qualification-and-evaluation-constraints.md#keep-evaluation-materialization-and-failure-distinctions-explicit)]
- Keep expected operational failures, unexpected defects or broken invariants, successful results containing diagnostics or limitations, and evaluation failures that prevent the intended result distinct. Do not convert an unexpected defect into an ordinary analysis outcome merely to continue execution. [[Evaluation and failure distinctions](decisions/adopt-qualification-and-evaluation-constraints.md#keep-evaluation-materialization-and-failure-distinctions-explicit)]
- Preserve meaningful domain distinctions until presentation. Presentation may format or progressively disclose information, but must not collapse distinctions that affect what the result means or what may safely be concluded from it. [[Evaluation and failure distinctions](decisions/adopt-qualification-and-evaluation-constraints.md#keep-evaluation-materialization-and-failure-distinctions-explicit)]

## Investigation initiation and request attribution

- Obtain additional qualified information needed for request resolution through analysis, Evaluation, and core construction. Request interpretation must not independently derive program claims or the population used to resolve subjects. Preserve established candidates and consequential incompleteness, ambiguity, unavailability, or inability to resolve. [[Investigation initiation](decisions/application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work)]
- Distinguish the initiator of additional investigation from the actor authorizing its parent. Attribute request-scoped system-initiated work to an explicit parent and govern it by that request's purpose, constraints, and resource choices. [[Investigation initiation](decisions/application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work)]
- Treat work outside the parent's purpose or continuing after satisfaction or cancellation as autonomous. Autonomous work requires human-authorized resource policies; defer work exceeding those policies or materially delaying an explicit request unless authorized. Hosted-service enablement alone is not autonomous resource authorization. [[Investigation initiation](decisions/application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work)]
- When additional investigation influences selection, ambiguity, inability to resolve, suggestions, Views, or reports, keep its trigger, parent where applicable, captured basis, relevant results, and qualifications inspectable from that outcome and attributable in observations. Reuse does not establish freshness merely because the input has a following binding. [[Investigation initiation](decisions/application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work)] [[Current initiation-attribution assessment gap](decisions/application-specification-boundaries.md#adoption-and-conformance)]
<!-- END PROMOTION CONTENT -->

## Replace “Session references and retained information”, preserving existing rules and adding the retention distinction

<!-- BEGIN PROMOTION CONTENT -->
## Session references and retained information

- Once a session reference is bound to an entity, do not rebind it. Adding inputs, evidence, or results must not change that binding. [[Session references](decisions/transient-analysis-sessions.md#stable-reference-bindings-within-a-session)]
- Retain captured evidence and produced results without mutation by later analysis. Preserve their supporting inputs, method versions, qualifications, and relevant evaluation outcomes; session membership alone does not establish their evidential basis. [[Accumulated results](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)]
- Keep observation event identities and clocks separate from program claims. Entity and record references need not reproduce across invocations; equivalent analyses must remain semantically comparable without erasing meaningful differences. [[Session context](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]
- For mechanical analyses, equivalent inputs, methods, requirements, completed evaluations, and presentation choices produce deterministic semantic content, ordering, and presentation apart from session-local references and observation metadata. Cross-session reference spelling is not a determinism requirement. [[Session context](decisions/transient-analysis-sessions.md#session-as-the-analysis-and-reference-context)]
- Unrelated accumulated work does not change a lens's population or meaning. Reuse satisfies declared requirements and expansions; additional information from completing an earlier incomplete evaluation remains distinguishable from changing the requested question. [[Accumulated results](decisions/transient-analysis-sessions.md#immutable-information-within-an-accumulating-session)]
- Under the initial unchanged-input session contract, detected relevant input changes invalidate further investigation. Disclose best-effort detection and non-atomic capture; do not claim comprehensive freshness validation. [[Input stability](decisions/transient-analysis-sessions.md#stable-inputs-as-the-session-precondition)]

- When presenting references that will expire before they can be used as subjects of a subsequent request, make that limitation clear in the surrounding presentation. [[Reference lifetime disclosure](decisions/reference-lifetime-disclosure.md)]

- Keep immutability distinct from retention, disposal, persistence, and availability. Preserve the content and support of retained evidence/results and the meaning of their references; disposal must not silently retarget a reference. This does not prohibit changing Workspace layout, focus, defaults, display selection, or derived current reconsideration status. [[Immutability and retention](decisions/application-specification-boundaries.md#distinguish-immutable-information-from-retention-policy)]
<!-- END PROMOTION CONTENT -->
