# Proposed revisions to docs/core-concepts.md

## Add “Request resolution” after “Program inputs, bindings, captured states and Projection requests”

### Request resolution

*[decision: [Lens application and request outcomes](decisions/lens-application-and-request-outcomes.md#coordinate-qualified-subject-resolution-outside-lens-implementations)]*

**Subject designation** is how a request identifies its subject, such as a literal name, precise Session reference, configured project or repository. It is distinct from the resolved subject and from Lens parameters. Request coordination uses qualified population information and Lens applicability/cardinality to resolve a valid application; it obtains missing program information through Evaluation and core construction.

A settled plan identifies resolved subjects, Lens and normalized parameters, applicable input context, and information/Presentation requirements and choices. Settlement does not guarantee Evaluation success or complete materialization. Planning has an outcome even when no valid application can be settled. An unsettled planning outcome is delivered as a **resolution result** containing the request, candidates, reasons, consequential choices, qualifications and prerequisite attribution. This returned information can be retained by an interface without a Session-addressable planning object or observation storage. It does not become a Projection merely because it describes why an application cannot proceed. Existing qualified prerequisite results and valid-but-failed/unavailable answer selections retain their own semantics and lifetimes. [[Resolution-result lifetime](decisions/lens-application-and-request-outcomes.md#return-unsettled-applications-as-resolution-results)]

These definitions do not prescribe materialized planning stages, a general planner or a universal output schema. Reference validity remains governed by the Session lifecycle; keeping returned information does not extend it.

## Add to “Lens” after its last paragraph

A Lens definition makes its question, applicability/cardinality, parameter meaning, requirements and prospective result contract explicit. The question is a conceptual information need rather than necessarily a user-supplied prose question. Subject-specific implementations can realize one Lens through different work and result contracts. The selected implementation remains attributable through its versioned method and provenance, separately from the Lens identity. Shared authoring declarations may define a Lens and its default operation conveniently; requirements and reusable operation identity remain distinct. [[Explicit Lens meaning](decisions/lens-application-and-request-outcomes.md#represent-lens-meaning-independently-of-lookup-and-implementation)]

## Add to “Projection” after its last paragraph

Otherwise identical qualified answers have repeatable logical identity within the supported Session, independently of subject designation or lookup route. Equality uses the decision’s [canonical effective-input set](decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity), including Session context, method version and meaningful subject order/roles. Invocation-specific resolution information has a separate owner; answer-relevant qualification remains in the Projection. This preserves full immutable payload consistency without requiring physical memoization or cross-session identity.

## Add to “Presentation and View” after its last paragraph

Result/Presentation compatibility is an explicit contract between the qualified content a Lens implementation exposes and the inputs, options, preconditions and standard expansions a Presentation supports. Compatibility includes semantic meaning and qualified partial/unavailable cases, not only data shape or Lens identity. Planning uses it before Evaluation and validates the materialized result before arrangement. A missing compatible Presentation or failed materialization-dependent precondition without a permitted fallback returns a resolution result with a presentation-failure reason and references to any retained answers; it does not make the Lens inapplicable. Further required information returns through request coordination. Usage reports and resolution results are not Views merely because they are rendered. [[Compatibility](decisions/lens-application-and-request-outcomes.md#match-qualified-results-to-presentations-explicitly)] [[Reporting](decisions/lens-application-and-request-outcomes.md#report-actual-requests-and-outcomes)]
