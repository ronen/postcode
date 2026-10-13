# Lens application, request outcomes and qualified answer identity

Status: accepted
Decided: 2026-10-11
Arising from: [Explicit Lenses and qualified request resolution](../plans/lens-request-model.md)
Scope: current Lens definitions, qualified subject resolution, outcome lifetime, Projection identity, reporting and result/Presentation compatibility
Supersedes: [Separate qualified Projection construction from presentation shaping](qualified-projection-construction.md), the complete record, jointly with [Qualified construction under the request model](qualified-construction-under-the-request-model.md) and [Experimental structured outputs](experimental-structured-outputs.md). The [whole-unit mapping](qualified-construction-under-the-request-model.md#supersession-mapping) identifies the replacement of each headed decision and carries forward its unaffected commitments.

## Context

Current requests, retained selections and Views encode Lens identity and subject lookup differently. Two confirmed defects misreport investigation follow-ups and bound incompatible references. Mechanical records publish lookup selectors as Lens parameters, and dependency selection constructs an unused inspection answer. Correcting individual strings leaves the semantic responsibilities distributed and difficult to extend.

The architecture already distinguishes a Lens's question, Evaluation's reusable operations, qualified construction and Presentation. It allows planning to obtain prerequisite information through request-scoped system-initiated investigation, but preserves current family retention contracts until an explicit reconciliation. This record supplies that reconciliation without introducing a general planner, universal record format or composite-Lens category.

## Decisions

### Represent Lens meaning independently of lookup and implementation

#### Decision

Define Lens identity, conceptual question, subject/parameter applicability and cardinality, normalized parameter meaning, information requirements and prospective qualified result contract explicitly. The question is an information need, not necessarily prose supplied by a human. Keep subject designation, designated program inputs, captured basis, presentation choices and execution constraints distinct from Lens parameters. Current public Lenses have no semantic parameters. At the public Session request boundary undeclared or invalid Lens parameters return a resolution result before Lens execution; violating the already-validated internal Lens contract is a programming defect. Share applicability/validation definitions between coordination and implementation rather than maintain competing rules. Present subject kinds are the current toolbox, not an exhaustive domain ontology.

Use one `inspect` identity for existing module, group, mixed module/group and exact-investigram inspection. A thin definition can delegate to distinct implementations with different requirements and output contracts. Requests and results identify that shared Lens; a result's versioned construction method and supporting provenance identify the subject-specific implementation and contribution. Preserve exact-original semantics, frozen association/revision selection and qualified embedded module detail. This choice does not add new subject mixtures or change dependency children/parents into containment.

Keep Lens requirements distinct from reusable operations. Evaluation owns execution and compatible reuse. A convenient declaration may define an ordinary interpretive Lens and its default prompt-backed operation together, but does not merge their identities or bypass Evaluation. Registration syntax, module organization and local execution mechanisms remain implementation choices.

#### Rationale and alternatives

Explicit shared meaning prevents request reporting and validation from depending on renderer or constructor conventions. A subject-specific implementation is not by itself a different investigative question. Separate inspection identities remain technically possible, but add distinctions without a corresponding difference in the intended question. A single constructor would unnecessarily couple different subject semantics. A universal registry/plugin language is unnecessary for the current toolbox.

#### Consequences

Every current capability uses the same model. Exact CLI alias spellings remain an interface concern. Adding a Lens must demonstrate local, understandable changes, including reuse or compatible extension of Presentation support; it need not be code-free.

### Coordinate qualified subject resolution outside Lens implementations

#### Decision

Request coordination owns lookup through an interface-independent resolver over qualified information. When a Lens is selected, its applicability narrows literal-name candidates; its cardinality determines whether the selection is usable. Precise references first resolve to their actual target and kind, then undergo applicability checking. Known incompatible subjects and known compatible subjects outside a supplied evaluation population are not unknown references.

Planning supplies contract-valid subjects/parameters to Lens implementations. Internal violations are invariant failures; ordinary missing, ambiguous, invalid-parameter and unsupported requests return resolution results from coordination. Whether a Lens is selected before or after partial lookup is not a Lens implementation responsibility.

A settled plan identifies resolved subjects, Lens and normalized parameters, applicable program-input context, required information and selected Presentation requirements/choices. It does not guarantee that Evaluation will succeed or materialize a complete answer. A known compatible target outside the supplied evaluation population is resolved: construct a qualified unavailable/partial answer identifying that target and the population limitation, without asserting absence or inventing records in that population. The current families must support that valid-application case, with existing subject support and the actual unmet requirement/outcome.

Obtaining additional lookup information goes through analysis, Evaluation and core construction with parent/initiator/resource attribution. Resolution consumes that information without deriving program claims independently. Shared matching does not construct an unused inspection answer. Genuinely consumed population Projections, embedded module answers and associated-inspection bases remain valid.

Additional investigation PostCode initiates for lookup or evidence acquisition is request-scoped system-initiated work even when its parent was requested by a human or external agent. Selecting an unspecified Lens or Presentation for the expressed need is request interpretation, not by itself additional investigation. Consumption of already-established information preserves its origin and qualifications without claiming new execution.

#### Rationale and alternatives

Filtering precise incompatible references into nonexistence produces F2. Letting each Lens reject arbitrary subjects as its normal interface duplicates resolution/applicability rules. Conversely, assuming all resolution precedes Evaluation loses qualified prerequisites. The boundary supports all three without prescribing a stored planning stage.

#### Consequences

Preserve current reference bindings and valid allocation schedules. Reverse lookup is a read capability; it does not expand the arrangement-side binding-only port. Preserve candidates, coverage and prerequisite outcomes when resolution is unsuccessful. Additional work remains request-scoped only within its parent's purpose, resources and lifetime; no autonomous resource policy is introduced.

### Return unsettled applications as resolution results

#### Decision

Deliver an unsettled planning outcome as a self-contained resolution result containing the request, established candidates, reason/information needed, consequential criteria/choices, qualifications and prerequisite attribution. The returned information can be retained by an interface after execution finishes without observations, fresh resolution or dependence on mutable later Session state. Do not create a program Projection for an application that could not be settled.

“Resolution information” names the request-specific facts supplied with either a settled application or a resolution result, not another retained artifact. A View-planning failure is delivered in the same resolution-result alternative with a presentation-failure reason and references to any already-produced retained answers. It can occur before Evaluation if no declared contract matches, or after Evaluation if an explicit materialization-dependent Presentation precondition fails and no permitted compatible fallback applies. Partial/unavailable content allowed by a contract is not itself an incompatibility; a malformed internal value remains a defect. Returning retained references does not add general CLI redisplay support.

Replace the existing retained selections for missing exact-investigram inspection and missing/ambiguous operation subjects or unsupported subject/Lens applications. Apply the same distinction to mechanical explicit lookup: no established applicable subjects means a resolution result, not an empty successful inspection/dependency answer. Preserve a valid population answer that is empty, partial or unavailable, and preserve a resolved applicable subject even when its information is not materialized. Invalid parameter requests also produce resolution results before Lens execution.

| Family | Current lookup outcomes replaced by a resolution result | Qualified answers retained |
| --- | --- | --- |
| Module | Module lookup with no name/handle match, an unknown precise reference or an established incompatible target. Missing lookup under incomplete discovery preserves that limitation instead of claiming absence. | Inventory of a valid configured-project population, including established empty and unavailable/partial outcomes; inspection of resolved modules, including known compatible modules absent from the current supplied population. Multiple matches are a valid collection. |
| Organization/group/mixed | Explicit inspection with no module/group match or unknown/incompatible target. No empty organization inspection or empty associated selection is created merely to report the unsuccessful lookup. | Organization of the designated configured project/repository, including empty/partial/unavailable layout; inspection of resolved group/module collections with embedded module detail. The lack of an available repository/layout qualifies the scoped answer, not the existence of the request's designated scope. |
| Dependency | Children/parents with no name match, unknown reference or known incompatible group/investigram. The current retained false-unknown group case becomes an unsupported resolution result. | Configured-project dependency structure, including empty/partial/unavailable graphs; children/parents of resolved modules, including zero edges, opaque external modules and compatible targets outside the evaluated population. Direction and recognition coverage remain qualified. |
| Investigation | Summary with missing/ambiguous module selection or an incompatible investigram target; follow-ups without one exact investigram or with a program-subject target; missing exact-investigram inspection; invalid Lens parameters. | Settled summary/follow-up with accepted/limited/failed retained Evaluation or retryable unavailability; exact existing investigram inspection; associated inspection of an existing mechanical answer including zero associated accounts. |

An absent embedded module portion of a valid group answer is governed by that answer's construction contract, not mistaken for a separately unsuccessful public lookup. Preserve legitimate embedded mechanical bases rather than deleting every empty internal selection.

Several matches are valid for supported collection applications. In particular, `inspect foo` can inspect all established module/group matches; ambiguity prevents summary only because it requires one module. The interface can use candidate references for follow-up on one or several candidates without identifying the unsuccessful request itself.

Preserve successful selections, valid-but-failed/limited/unavailable interpretation selections, original/correction snapshots, and associated inspection including zero matches. Configuration/communication failures can retain an unavailable selection without a reusable Evaluation. Do not change evaluation acceptance, reuse/retry, cancellation, cleanup or mechanical-evidence retention.

For now, no independent Session address, history reopening, persistence or resumable plan is required for a resolution result. Transient execution resources can be released without discarding returned data. Candidate references remain usable only within their supported Session lifetime; one-shot output retention does not extend it. Carry the information through the worker/parent envelope and current CLI output without a new shell-side outcome store.

#### Rationale and alternatives

A failure to identify a valid application is information about the request, not an answer to its Lens. Retained unsuccessful Projections currently provide Session addressability but current commands cannot explicitly redisplay them by Projection ID. Returning sufficient data preserves interface use without adding a new persistent object category. Observation capture alone is unsuitable because it is not operational storage and may be disabled or fail.

Keeping unsuccessful Projections would remain a coherent alternative with designation-sensitive identity. An independently addressable non-Projection outcome store is also possible, but no current interaction requires it. Neither is selected here. General non-View report/GUI design remains deferred.

#### Consequences

The table replaces both the unsuccessful investigation-selection rows and the earlier blanket preservation of mechanical Projection records for these explicit lookup failures. Valid empty population answers and the retained cases above continue under [qualified construction](qualified-construction-under-the-request-model.md#preserve-retained-selections-and-support-under-the-new-outcome-contract). Prerequisite results survive under their own rules; a returned refusal does not imply no work occurred.

### Give equivalent qualified answers repeatable identity

#### Decision

Within the supported Session, otherwise identical qualified answers have the same logical Projection identity independently of lookup spelling or name/reference route. The canonical effective-input set is: Session identity context and responsible identity-method version; resolved subjects with meaningful collection order/roles; Lens and normalized parameters; captured supporting basis and selected information; supporting methods, evidence and relevant outcomes; answer-relevant qualifications; and retained interpretation/correction/association selection. Derived fields must be fixed by these inputs. Other documents use this set rather than define competing lists.

Move invocation-specific designation and lookup provenance to request/resolution information before sharing answer identity. Full immutable payload consistency remains mandatory: retained fields must be represented by or determined from the identity inputs. Preserve fixed references, method versioning and kind-aware reference normalization. Different supporting bases or interpretation selections may produce distinct answers even with identical displayed text.

The lookup route and incidental accumulation cannot create unexplained identity differences. Physical object reuse, constructor memoization and a global deduplication service are not required. No cross-session identity, annotation or persistence guarantee follows.

Keep lookup spelling, reference status and candidate-search coverage in resolution information. Qualifications affecting the actual selected answer remain in that answer. Inspection of established A/B found under incomplete lookup does not claim exhaustive matching; a population-coverage answer would carry additional meaning. Displayed lookup messages may use supplied resolution context beside a shared Projection, with consequential differences reflected in the affected View/arrangement identity. Non-View resolution results do not require a semantic identity. No universal View identity formula or hash of every invocation field is required.

#### Rationale and alternatives

Equivalent answers should provide repeatable referents rather than different identities caused by navigation mechanics. This can support future answer-specific interactions, but does not prescribe their design. Equality of prose alone is insufficient, while physical memoization is an implementation technique rather than the referent contract.

This is separate from minimizing interpretation cost. Preserve the accepted compatible-operation reuse rule: the same completed interpretation is not executed again within Session validity. Current reuse already excludes Lens and lookup spelling. New evidence alone does not invalidate a reusable outcome; existing qualification/correction/retry rules govern. A changed Projection selection can reuse an earlier interpretation.

#### Consequences

The [family-by-family identity contracts](qualified-construction-under-the-request-model.md#separate-answer-view-and-report-identity) replace designation-bearing payload/Projection formulas, mechanical View formulas, and descriptor-dependent reporting formulas explicitly. They preserve full-payload consistency, frozen pagination normalization, explicit arrangement inputs and authoritative usage finalization. Non-View resolution results and usage reports need no semantic/content identity; occurrence correlation uses request/attempt information and batch-local observation UUIDs. Entity bindings and investigram identity semantics are unaffected.

### Report actual requests and outcomes

#### Decision

Carry the actual normalized request, resolution and execution outcome through publication. Request reporting does not infer a Lens from a View-wide tag or from bounded arranged content. Preserve designation modes and real parameters; describe investigrams as subjects without treating them as entities. Refused/failed requests retain intelligible meaning even without a program answer.

Usage is subjectless reporting. Remove the lens-shaped compatibility descriptor; neither usage nor resolution reporting manufactures a program Projection or View. Adapt current result alternatives, output, parent usage finalization and observations together, without requiring usage reports and resolution results to have the same shape or lifetime. General report architecture and GUI design remain deferred.

Preserve actual output, source-disclosure classification, independent usage accounting, existing execution checks and delivery behavior. An observation-delivery failure is visible but does not invalidate an otherwise delivered result, including a non-View report. Emit a view-produced event only for an actual View. Keep rendering self-sufficient in the parent; usage finalization must not query core state or reconstruct lost selection from bounded display fields.

Record root-request and consequential prerequisite attribution through affected outcomes and observations. Keep current consumption distinct from retained generating provenance; an invocation ID cannot fragment work reuse or overwrite the original attribution. Resolution information is operationally usable without observation delivery. This does not claim to close the separate captured-basis export or navigation-origin gaps.

#### Rationale and alternatives

Deriving request meaning from produced Views causes F1 and cannot honestly describe unsuccessful applications. Retaining usage's faux Lens descriptor only preserves an experimental shape whose consumers do not currently require compatibility. A general report framework would exceed the needs of this change.

#### Consequences

The replacement [construction/reporting contracts](qualified-construction-under-the-request-model.md) remove the usage-only descriptor and its identity/data flow. The companion output decision specifies affected experimental shapes and observation-envelope versioning. Preserve subjectless usage semantics, sealed attempt usage, independent acceptance/usage accounting, source evidence controls, sink selection/lifecycle and warning behavior. Retain consequential generating attribution with its supported results for the Session lifetime, separately from later consumption. Later requests must not overwrite the recorded origin or insert invocation-specific attribution into immutable shared answer payloads or reusable-work identity. This requires no new public referent or identity guarantee; internal correlation identifiers and metadata encoding remain implementation choices. Further substantial output architecture requires a separate scope decision.

### Match qualified results to Presentations explicitly

#### Decision

Lens implementations declare prospective qualified result contracts by subject and parameters. Presentations declare supported contracts/options, relevant preconditions and standard expansions. Planning uses these declarations for program View construction, including future additions, honoring explicit choices or a bounded default. Contract associations are available at runtime where coordination needs them; compile-time types alone do not satisfy this obligation. Validate actual supplied content at the construction/arrangement boundary.

Contracts include meaning, populations, direction, qualification, materialization and permitted absent detail, not merely structural shape. Existing typed family content and a small static catalog suffice. One Lens can expose several contracts; several Lenses can share one. Do not require a unique output type per Lens or a universal Projection schema.

Declare Presentation expansion requirements before Evaluation, independently of Lens requirements. Lack of a compatible Presentation returns a resolution result with a presentation-failure reason, not proof that the Lens is inapplicable. Preserve any qualified answer already produced before that failure; inability to arrange it does not revoke its retention. Required additional work returns through coordination. Partial/unavailable content remains an ordinary qualified result under a supporting contract; an internal incompatible value is a defect.

Coordination may refine a Presentation choice or use a declared fallback after Evaluation when materialized preconditions require it, preserving explicit user choices and exposing consequential changes. An adapter preserves supplied meaning/qualification and performs no hidden analysis. A reused Projection remains an attributed PostCode result, not independent corroboration of its own claims.

#### Rationale and alternatives

Explicit compatibility supports local Lens additions without implicit family dispatch knowledge or Lens-name checks in each renderer. A single compatible arrangement plus an explicit default is enough where that is all the toolbox offers. General ranking, schema inference, automatic conversion, contract inheritance and collection matching are unnecessary now.

#### Consequences

Use current family arrangements and their formats/options as the initial units; general option modeling and coordinated multi-Projection Presentation design remain separate. The ordinary interpretive example must use the existing interpretation Presentation through its shared result contract, with no new Lens-name dispatch branch. The mechanical example may reuse, compatibly modify or add a suitable Presentation. Standard execution, retention, reporting and applicability handling must work without scattered capability-specific patches. Prompt/method changes that alter reusable work carry explicit method provenance and compatibility treatment.

## Adoption and conformance

These contracts and their application-specification, concept and constraint provisions apply on adoption, with the known implementation gaps below explicitly accepted pending completion of the [Lens request-model plan](../plans/lens-request-model.md#milestones-and-verification). Their promotion is not deferred until implementation. Adoption does not establish conformance: complete the plan's integration and verification before claiming every current path satisfies them.

| Current gap and consequence | Remediation in the existing plan |
| --- | --- |
| Lens policy and parameter meaning are distributed; resolution is embedded in dispatch/construction and dependency selection creates an unused inspection answer. | M1 establishes definitions and request context; M2 introduces shared resolution and independent selection. |
| Failed lookups retain Projections, and compatible bound targets can be mistaken for unknown references. Returned planning information lacks the new self-contained contract. | M2 implements the family outcome table, target/materialization distinction and resolution-result delivery. |
| Answer payloads/identity contain designation, usage has a lens-shaped descriptor, and publication infers request meaning from Views. | M3 separates immutable answers, updates family identity methods and publishes actual requests through View and non-View alternatives, including the changed observation envelope. |
| Explicit parent/initiator attribution is incomplete, including evidence-work and failed/interrupted paths. | M1–M3 implement and verify the bounded attribution trace. Broader assessment remains separately scoped. |
| Runtime result/Presentation compatibility and local additions are not yet established across the toolbox. | M1 exercises the declarations; M4 integrates every current path and demonstrates both extension cases. |

The governing documents link to this disclosure while these gaps remain. The [conformance backlog entry](../backlog.md#establish-conformance-to-the-lens-request-model) tracks completion under this existing plan; it does not require another plan or authorize implementation. Existing defects and limitations remain disclosed. Implementation updates the affected descriptions and gap links only after verification establishes conformance; unresolved gaps require explicit disposition rather than an assumed completion.

The initial source assessment identifies absent explicit initiation/parent links in resolution/evidence/publication paths and includes bounded remediation. Recheck the field-level trace before broad record changes; substantial additional gaps require human scope review.

This decision is reflected in the application specification, core concepts and architectural constraints. The [complete supersession mapping](qualified-construction-under-the-request-model.md#supersession-mapping) carries forward unaffected commitments from the replaced headed decisions. Exact retained-answer redisplay, captured-basis observation export, navigation lineage and general Presentation/GUI design remain separately tracked.

This plan combines F1/F2 correction with the request model, changing the earlier sequencing recommendation in [Coordinated Views — Adoption and conformance](coordinated-views-and-qualified-results.md#adoption-and-conformance). The defects remain defects until fixed. The combined scope supplies their durable request/outcome representation without an interim representation that would immediately be replaced; it does not wait for GUI, multi-state or general reporting work. This is an explicit implementation-sequencing choice, not a waiver of accurate current reporting or a change to the coordinated-Views semantic contracts.
