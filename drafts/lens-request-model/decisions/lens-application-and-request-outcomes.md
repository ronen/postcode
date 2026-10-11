# Lens application, request outcomes and qualified answer identity

Status: in preparation
Arising from: [Explicit Lenses and qualified request resolution](../plans/lens-request-model.md)
Scope: current Lens definitions, qualified subject resolution, outcome lifetime, Projection identity, reporting and result/Presentation compatibility
Supersedes:
- [Qualified construction — Separate qualified construction from arrangement](qualified-projection-construction.md#separate-qualified-construction-from-arrangement): only the usage-descriptor data flow, replaced by [reporting actual requests and outcomes](#report-actual-requests-and-outcomes).
- [Qualified construction — Retain investigation selections with derived revision snapshots](qualified-projection-construction.md#retain-investigation-selections-with-derived-revision-snapshots): only the unsuccessful-selection and usage-descriptor retention prescriptions, replaced by [resolution-result lifetime](#return-unsettled-applications-as-resolution-results) and [reporting](#report-actual-requests-and-outcomes); designation-bearing payload/identity prescriptions are replaced by [answer identity](#give-equivalent-qualified-answers-repeatable-identity).
- [Qualified construction — Separate Projection identity from presentation and reporting identity](qualified-projection-construction.md#separate-projection-identity-from-presentation-and-reporting-identity): only preservation of designation-sensitive mechanical formulas and descriptor-dependent reporting formulas, replaced by [answer identity](#give-equivalent-qualified-answers-repeatable-identity) and [reporting](#report-actual-requests-and-outcomes). The companion [output policy](experimental-structured-outputs.md#permit-direct-changes-to-affected-experimental-outputs) separately replaces the affected shape/wording preservation clauses.

## Context

Current requests, retained selections and Views encode Lens identity and subject lookup differently. Two confirmed defects misreport investigation follow-ups and bound incompatible references. Mechanical records publish lookup selectors as Lens parameters, and dependency selection constructs an unused inspection answer. Correcting individual strings leaves the semantic responsibilities distributed and difficult to extend.

The architecture already distinguishes a Lens's question, Evaluation's reusable operations, qualified construction and Presentation. It allows planning to obtain prerequisite information through request-scoped system-initiated investigation, but preserves current family retention contracts until an explicit reconciliation. This record supplies that reconciliation without introducing a general planner, universal record format or composite-Lens category.

## Decisions

### Represent Lens meaning independently of lookup and implementation

#### Decision

Define Lens identity, conceptual question, subject/parameter applicability and cardinality, normalized parameter meaning, information requirements and prospective qualified result contract explicitly. The question is an information need, not necessarily prose supplied by a human. Keep subject designation, designated program inputs, captured basis, presentation choices and execution constraints distinct from Lens parameters. Current public Lenses have no semantic parameters and reject undeclared values.

Use one `inspect` identity for existing module, group, mixed module/group and exact-investigram inspection. A thin definition can delegate to distinct implementations with different requirements and output contracts. Preserve exact-original semantics, frozen association/revision selection and qualified embedded module detail. This choice does not add new subject mixtures or change dependency children/parents into containment.

Keep Lens requirements distinct from reusable operations. Evaluation owns execution and compatible reuse. A convenient declaration may define an ordinary interpretive Lens and its default prompt-backed operation together, but does not merge their identities or bypass Evaluation. Registration syntax, module organization and local execution mechanisms remain implementation choices.

#### Rationale and alternatives

Explicit shared meaning prevents request reporting and validation from depending on renderer or constructor conventions. A subject-specific implementation is not by itself a different investigative question. Separate inspection identities remain technically possible, but add distinctions without a corresponding difference in the intended question. A single constructor would unnecessarily couple different subject semantics. A universal registry/plugin language is unnecessary for the current toolbox.

#### Consequences

Every current capability uses the same model. Exact CLI alias spellings remain an interface concern. Adding a Lens must demonstrate local, understandable changes, including reuse or compatible extension of Presentation support; it need not be code-free.

### Coordinate qualified subject resolution outside Lens implementations

#### Decision

Request coordination owns lookup through an interface-independent resolver over qualified information. When a Lens is selected, its applicability narrows literal-name candidates; its cardinality determines whether the selection is usable. Precise references first resolve to their actual target and kind, then undergo applicability checking. Known incompatible subjects and known compatible subjects outside a supplied evaluation population are not unknown references.

Planning supplies contract-valid subjects/parameters to Lens implementations. Internal violations are invariant failures; ordinary missing, ambiguous, invalid-parameter and unsupported requests are coordination outcomes. Whether a Lens is selected before or after partial lookup is not a Lens implementation responsibility.

Obtaining additional lookup information goes through analysis, Evaluation and core construction with parent/initiator/resource attribution. Resolution consumes that information without deriving program claims independently. Shared matching does not construct an unused inspection answer. Genuinely consumed population Projections, embedded module answers and associated-inspection bases remain valid.

Additional investigation PostCode initiates for lookup or evidence acquisition is request-scoped system-initiated work even when its parent was requested by a human or external agent. Selecting an unspecified Lens or Presentation for the expressed need is request interpretation, not by itself additional investigation. Consumption of already-established information preserves its origin and qualifications without claiming new execution.

#### Rationale and alternatives

Filtering precise incompatible references into nonexistence produces F2. Letting each Lens reject arbitrary subjects as its normal interface duplicates resolution/applicability rules. Conversely, assuming all resolution precedes Evaluation loses qualified prerequisites. The boundary supports all three without prescribing a stored planning stage.

#### Consequences

Preserve current reference bindings and valid allocation schedules. Reverse lookup is a read capability; it does not expand the arrangement-side binding-only port. Preserve candidates, coverage and prerequisite outcomes when resolution is unsuccessful. Additional work remains request-scoped only within its parent's purpose, resources and lifetime; no autonomous resource policy is introduced.

### Return unsettled applications as resolution results

#### Decision

Deliver an unsettled planning outcome as a self-contained resolution result containing the request, established candidates, reason/information needed, consequential criteria/choices, qualifications and prerequisite attribution. The returned information can be retained by an interface after execution finishes without observations, fresh resolution or dependence on mutable later Session state. Do not create a program Projection for an application that could not be settled.

Replace the existing retained selections for missing exact-investigram inspection and missing/ambiguous operation subjects or unsupported subject/Lens applications. Apply the same distinction to mechanical explicit lookup: no established applicable subjects means a resolution result, not an empty successful inspection/dependency answer. Preserve a valid population answer that is empty, partial or unavailable, and preserve a resolved applicable subject even when its information is not materialized. Invalid parameter requests also produce resolution outcomes before Lens execution.

Several matches are valid for supported collection applications. In particular, `inspect foo` can inspect all established module/group matches; ambiguity prevents summary only because it requires one module. The interface can use candidate references for follow-up on one or several candidates without identifying the unsuccessful request itself.

Preserve successful selections, valid-but-failed/limited/unavailable interpretation selections, original/correction snapshots, and associated inspection including zero matches. Configuration/communication failures can retain an unavailable selection without a reusable Evaluation. Do not change evaluation acceptance, reuse/retry, cancellation, cleanup or mechanical-evidence retention.

For now, no independent Session address, history reopening, persistence or resumable plan is required for a resolution result. Transient execution resources can be released without discarding returned data. Candidate references remain usable only within their supported Session lifetime; one-shot output retention does not extend it. Carry the information through the worker/parent envelope and current CLI output without a new shell-side outcome store.

#### Rationale and alternatives

A failure to identify a valid application is information about the request, not an answer to its Lens. Retained unsuccessful Projections currently provide Session addressability but current commands cannot explicitly redisplay them by Projection ID. Returning sufficient data preserves interface use without adding a new persistent object category. Observation capture alone is unsuitable because it is not operational storage and may be disabled or fail.

Keeping unsuccessful Projections would remain a coherent alternative with designation-sensitive identity. An independently addressable non-Projection outcome store is also possible, but no current interaction requires it. Neither is selected here. General non-View report/GUI design remains deferred.

#### Consequences and exact supersession

In the qualified-construction retained-selection table, replace only the missing part of exact inspection and the missing/ambiguous/unsupported request row, plus the blanket statement that every non-usage row must retain an addressable selection. All remaining retention cases continue. Prerequisite results survive under their own rules; a returned refusal does not imply no work occurred.

### Give equivalent qualified answers repeatable identity

#### Decision

Within the supported Session, otherwise identical qualified answers have the same logical Projection identity independently of lookup spelling or name/reference route. Effective inputs include subjects with meaningful collection order/roles, Lens, normalized parameters, captured supporting basis, selected information, supporting methods/evidence/outcomes, answer-relevant qualifications and retained interpretation/correction/association selection.

Move invocation-specific designation and lookup provenance to request/resolution information before sharing answer identity. Full immutable payload consistency remains mandatory: retained fields must be represented by or determined from the identity inputs. Preserve fixed references, method versioning and kind-aware reference normalization. Different supporting bases or interpretation selections may produce distinct answers even with identical displayed text.

The lookup route and incidental accumulation cannot create unexplained identity differences. Physical object reuse, constructor memoization and a global deduplication service are not required. No cross-session identity, annotation or persistence guarantee follows.

Keep lookup spelling, reference status and candidate-search coverage in resolution information. Qualifications affecting the actual selected answer remain in that answer. Inspection of established A/B found under incomplete lookup does not claim exhaustive matching; a population-coverage answer would carry additional meaning. Displayed lookup messages may use supplied resolution context beside a shared Projection, with consequential differences reflected in the affected arrangement/report identity. No universal View identity formula or hash of every invocation field is required.

#### Rationale and alternatives

Equivalent answers should provide repeatable referents rather than different identities caused by navigation mechanics. This can support future answer-specific interactions, but does not prescribe their design. Equality of prose alone is insufficient, while physical memoization is an implementation technique rather than the referent contract.

This is separate from minimizing interpretation cost. Preserve the accepted compatible-operation reuse rule: the same completed interpretation is not executed again within Session validity. Current reuse already excludes Lens and lookup spelling. New evidence alone does not invalidate a reusable outcome; existing qualification/correction/retry rules govern. A changed Projection selection can reuse an earlier interpretation.

#### Consequences and exact supersession

Replace designation-bearing retained-selection payload/identity prescriptions and the preservation of mechanical Projection identity formulas where those encode designation, across module, organization, dependency and investigation families. Preserve full-payload identity consistency and all substantive support/selection inputs. Replace View/report formula prescriptions only where removed descriptors or newly separated consequential request context require it; preserve frozen pagination normalization, explicit arrangement inputs and authoritative usage finalization. Entity bindings and investigram identity semantics are unaffected.

### Report actual requests and outcomes

#### Decision

Carry the actual normalized request, resolution and execution outcome through publication. Request reporting does not infer a Lens from a View-wide tag or from bounded arranged content. Preserve designation modes and real parameters; describe investigrams as subjects without treating them as entities. Refused/failed requests retain intelligible meaning even without a program answer.

Usage is subjectless reporting. Remove the lens-shaped compatibility descriptor; neither usage nor resolution reporting manufactures a program Projection or View. Adapt current result alternatives, output, parent usage finalization and observations together, without requiring the same shape or lifetime for those reports. General report architecture and GUI design remain deferred.

Preserve actual output, source-disclosure classification, independent usage accounting, existing execution checks and delivery behavior. An observation-delivery failure is visible but does not invalidate an otherwise delivered result, including a non-View report. Emit a view-produced event only for an actual View. Keep rendering self-sufficient in the parent; usage finalization must not query core state or reconstruct lost selection from bounded display fields.

Record root-request and consequential prerequisite attribution through affected outcomes and observations. Keep current consumption distinct from retained generating provenance; an invocation ID cannot fragment work reuse or overwrite the original attribution. Resolution data is operationally usable without observation delivery. This does not claim to close the separate captured-basis export or navigation-origin gaps.

#### Rationale and alternatives

Deriving request meaning from produced Views causes F1 and cannot honestly describe unsuccessful applications. Retaining usage's faux Lens descriptor only preserves an experimental shape whose consumers do not currently require compatibility. A general report framework would exceed the needs of this change.

#### Consequences and exact supersession

Replace the qualified-construction usage-only retention row, usage-descriptor data flow and descriptor-dependent reporting formulas. Replace only the specific affected shape/wording prescriptions under the companion output decision. Preserve subjectless usage semantics, sealed attempt usage, independent acceptance/usage accounting, source evidence controls, sink selection/lifecycle and warning behavior. Further substantial output architecture requires a separate scope decision.

### Match qualified results to Presentations explicitly

#### Decision

Lens implementations declare prospective qualified result contracts by subject and parameters. Presentations declare supported contracts/options, relevant preconditions and standard expansions. Planning uses these declarations for every current program View path, honoring explicit choices or a bounded default. Validate actual supplied content at the construction/arrangement boundary.

Contracts include meaning, populations, direction, qualification, materialization and permitted absent detail, not merely structural shape. Existing typed family content and a small static catalog suffice. One Lens can expose several contracts; several Lenses can share one. Do not require a unique output type per Lens or a universal Projection schema.

Declare Presentation expansion requirements before Evaluation, independently of Lens requirements. Lack of a compatible Presentation is a View-planning outcome, not proof that the Lens is inapplicable. Preserve any qualified answer already produced before that failure; inability to arrange it does not revoke its retention. Required additional work returns through coordination. Partial/unavailable content remains an ordinary qualified result under a supporting contract; an internal incompatible value is a defect.

#### Rationale and alternatives

Explicit compatibility supports local Lens additions without implicit family dispatch knowledge or Lens-name checks in each renderer. A single compatible arrangement plus an explicit default is enough where that is all the toolbox offers. General ranking, schema inference, automatic conversion, contract inheritance and collection matching are unnecessary now.

#### Consequences

Use current family arrangements and their formats/options as the initial units; general option modeling and coordinated multi-Projection Presentation design remain separate. Verify ordinary interpretive and mechanical additions using existing information, with local declarations/construction and suitable reused, compatibly modified or new Presentations. Standard execution, retention, reporting and applicability handling must work without scattered capability-specific patches.

## Adoption and conformance

Adoption establishes contracts and a plan, not implementation conformance. Complete the plan's integration and verification before claiming every current path satisfies them. The initial source assessment identifies absent explicit initiation/parent links in resolution/evidence/publication paths and includes bounded remediation. Recheck the field-level trace before broad record changes; substantial additional gaps require human scope review.

This decision is reflected in the application specification, core concepts and architectural constraints. Its supersession is limited to the provisions identified above; unaffected contracts remain in force. Exact retained-answer redisplay, captured-basis observation export, navigation lineage and general Presentation/GUI design remain separately tracked.
