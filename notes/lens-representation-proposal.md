# Proposal for explicit Lens representation and subject selection

Recorded: 2026-10-06

Reworked: 2026-10-08 against the adopted architecture reconciliation

Develop a sound request model exercised by every existing capability. The proposed scope is explicit Lens identity, applicability and parameter meaning; subject designation and resolution; selection independent of inspection construction; request reporting from the actual request and outcome; and preservation of the distinction between Lens requirements and reusable investigation operations. This addresses the representation audit's F1–F4, subject to checking implementation dependencies during planning. Ease of adding Lenses is an acceptance criterion for this work.

This remains an exploratory proposal, not a formal draft plan, accepted implementation decision or authorization to implement. The [adopted product design](../foundation/product-design.md#21-lenses-projections-presentations-and-views), [core concepts](../docs/core-concepts.md), [architectural constraints](../docs/architectural-constraints.md) and [coordinated Views decision](../docs/decisions/coordinated-views-and-qualified-results.md) govern it. The [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md) supplies historical findings; its proposals are not requirements. The [backlog](../docs/backlog.md#candidates) now describes those findings in the adopted model.

## What the adopted model changes

There is no distinct composite-Lens architectural category to implement. A Presentation can coordinate independently qualified Projections without manufacturing an outer Lens or Projection merely to combine their display or interaction. Each input retains its own meaning and qualification. A summary View need not imply a summary Lens.

A Lens can still use several analyses, evidence sources, reusable operation outcomes or qualified Projections to produce its own answer. The [accepted distinction](../docs/decisions/coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition) depends on requested meaning: a Lens produces a qualified answer with its own subject, question and selection; a Presentation coordinates existing answers. New synthesis requires analysis. This is not a one-Lens/one-operation restriction or a prohibition on genuinely consumed component answers.

Accordingly, the earlier discussion of a parameterized composite summary is no longer a design target for this work. Choosing independent summary and dependency answers for a coordinated View is Projection selection. Refining the information a particular summary Lens is to synthesize is a Lens parameter. Neither becomes a request to execute arbitrary operations. The operation choices needed to satisfy a Lens remain implementation responsibilities under Evaluation.

Existing associated-inspection and embedded module results keep their accepted contracts. The reconciliation expressly does not mandate migrating them into independent top-level Projections. Their presence is not itself an architecture contradiction. F4 is different: dependency construction creates an inspection answer only to copy its selection, without consuming that answer as an attributed qualified contribution.

## Proposed scope and deferred work

| Work | Treatment |
| --- | --- |
| F1 Observation request misreporting | Correct from actual normalized requests and their outcomes, including unsupported requests. |
| F2 Bound group reported as unknown by dependency lenses | Separate reference resolution from applicability and selection in an evaluation population. |
| F3 Designation mislabeled as Lens parameters | Separate the fields and their semantics across request, retained result descriptors and reporting. |
| F4 Inspection construction used as selection | Extract qualified selection without constructing an inspection answer. |
| Ease of adding Lenses | Demonstrate local, understandable integration for an ordinary interpretive Lens and a mechanical Lens using existing information. |
| F5 Presentation representation | Leave GUI and general multi-Projection Presentation design to separate work. |
| F6 Retained-result presentation | Preserve the acknowledged continuity/disclosure limitation and separate remediation. Request-model work must not claim to fix it merely by separating presentation fields. |
| Captured-basis observation attribution | Keep the independently deferred export gap separate from F1. Accurate request descriptions do not establish captured program-state provenance. |

The [current conformance provisions](../docs/decisions/coordinated-views-and-qualified-results.md#adoption-and-conformance) permit the existing transient single-project implementation as a limited subset. This proposal does not add multi-state analysis, following/pinned controls, live refresh, persistence, a plugin system, a workflow language or a general planner. New Lens examples used for validation do not automatically become product capabilities.

## Meaning carried by a request

A request should keep the following responsibilities identifiable. This table describes semantics, not mandatory stored stages or a universal record schema.

| Information | Meaning |
| --- | --- |
| Lens identity | The investigative question selected. “Question” means the conceptual information need, not a user-supplied prose prompt. |
| Lens parameters | Values refining that question; currently empty for the implemented lenses. |
| Subject designation | How the subject is named: configured project, repository, literal name/handle or precise reference in the current capability set. |
| Resolution and application outcome | What the designation resolved to, on which population/basis, and whether the requested Lens and parameters apply. |
| Program-input designation and applicable binding | The program information the request concerns, kept separate from subject designation and Lens parameters. |
| Captured basis | The actual captured support used by the resulting Projection; a Session identifier or configured path alone is not that basis. |
| Presentation and execution inputs | Display choices, declared expansions and execution constraints, each retaining its own meaning. |

For the current API, the opened project's input context can remain session-bound rather than being repeated in every call. Planning should explain how normalized requests use that context and how results retain their existing qualified support. It must not relabel the current unchanged-input session as a following or pinned binding, or add speculative multi-input fields and capture identifiers merely to resemble the full product model. The architecture explicitly leaves representation choices open.

Defaults and aliases should normalize before semantic validation, with the actual resolved choices available for reporting. Do not reconstruct a past request's explanation from later defaults. A request and its produced result remain distinct: missing subjects, unsupported applications and unavailable analysis must be describable without pretending the requested information was produced. Repeating a request is also distinct from presenting an exact retained Projection.

### Planning has its own outcome

Agreed in discussion: planning is an activity in its own right, and its outcome must cleanly express when it was unable to settle on a plan. A settled plan identifies the resolved subject selection, Lens and normalized parameters, applicable input context, and the information and presentation requirements to be fulfilled. It does not guarantee that subsequent Evaluation will succeed or fully materialize the requested answer. The exact plan representation remains an implementation choice; an explicit planning outcome does not require a general planner, workflow language or durable planning store.

When planning cannot settle a valid application, its outcome preserves the request, the resolution achieved, relevant candidate subjects and qualifications, and the reason or information still needed. Missing subjects, ambiguity where one subject is required, invalid parameters and incompatible precise targets belong here. They are not Lens answers and do not create Projections for the unsuccessful application. The interface can explain the outcome and, where appropriate, ask for clarification. No new interactive clarification flow is required for the current CLI merely to represent that possibility. Multiple resolved subjects remain valid when the selected Lens accepts that collection.

Keep this distinct from a valid application whose qualified answer is empty or partial, and from evaluation failure or unavailability after a plan has been settled. If resolving the request required prerequisite analysis, preserve that work and its qualified results and outcomes as part of the request, even if planning ultimately cannot settle the requested application. When resolution consumes previously established information, preserve attribution to that information and its qualifications as well. An unsuccessful planning outcome does not imply that no work occurred or erase independently produced results. Unexpected invariant failures remain defects rather than ordinary unable-to-plan outcomes.

This changes the existing contract that retains some missing, ambiguous or unsupported investigation selections as Projections. The later decision package must explicitly supersede those provisions and specify request/planning outcome retention and reporting, together with the resulting CLI and structured-output changes. This is an intentional agreed design change, not a contradiction to conceal inside a refactor. Reporting of planning outcomes must not fabricate a program View or view-produced event when no Projection was presented.

Agreed in discussion: planning outcomes are interaction-scoped. Return a self-contained outcome to the caller, keep it available through execution and publication, and capture the actual request, resolution, choices and reasons in the command's observations. After the interaction completes, the session does not retain an independently addressable plan. Observation snapshots preserve the account of the interaction without creating a resumable plan or plan store. Planning resources should be released at completion; any program results or supporting records produced during the interaction retain their own established lifetimes. This does not change the separately deferred captured-basis observation export work.

## Explicit Lens definitions

Use one canonical Lens identity vocabulary in normalized domain requests and results, with explicit CLI spelling mappings. A small typed set of definitions should state purpose, applicability, parameter meaning and information requirements. Keep those semantics available to dispatch, validation and request reporting without requiring those consumers to import renderers or constructors.

Prefer the existing semantic dependency names `dependency-structure`, `dependency-children` and `dependency-parents`, with their shorter CLI aliases, but settle identifier spellings and command mappings in planning. Exhaustive typing and runtime boundary validation should expose missing cases; inventory must not be a fallback description for an unrecognized Lens.

Applicability depends on the Lens, subject and parameter values. It is separate from analysis availability, execution success and materialization. Requirements may vary by subject and parameter values without changing Lens identity. The implemented definitions should cover current capabilities without treating the present subject kinds as an exhaustive domain ontology.

A Lens may use different underlying work for different subject kinds while retaining a coherent investigative purpose. That does not authorize silently changing dependency children into group containment or investigram composition. The meaning of the Lens, not the convenience of a shared command word, determines the supported application.

### Inspection and reporting

Agreed in discussion: one `inspect` Lens matches the intended model. Module, group, mixed and exact-investigram inspection express qualified detail for the designated subjects while preserving their different selection and retention rules. Exact investigram inspection targets the immutable original and performs no inference. Associated inspection retains its mechanical basis and frozen association selection.

The implementation is free, and encouraged where it keeps responsibilities clear, to make this Lens a thin layer over separate internal Lens implementations for the supported subject kinds. One Lens identity does not require one constructor, one record shape or one large conditional implementation. Subject-specific requirements, parameter validation and construction can live with those implementations; mixed inspection can coordinate the applicable implementations while preserving its accepted qualified selection. Requests and results identify the shared Lens, with implementation method and provenance attributable separately. This is an agreed planning direction recorded in a non-governing note; its consequential contract still belongs in the eventual decision package.

`usage` is already reporting, not a program Lens. Represent that distinction in normalized requests and structured output. Remove the current lens-shaped compatibility descriptor in favor of an honest reporting result; there is no compatibility need to preserve it. Usage must not enter Lens enumeration or acquire a retained program Projection.

## Subject designation and qualified resolution

Retain designation, resolved targets, Lens applicability and qualified population selection separately. The investigation family's `SelectionSelector` is a useful starting point for literals and resolved/unresolved references, but its `null` case does not distinguish project from repository. This does not require replacing every record family with one shape.

Agreed in discussion: subject lookup is coordinated during request/View planning through a shared, interface-independent resolution capability. It is not owned by the Lens implementation. Planning supplies the designation and intended lookup context; the resolver returns candidates and qualified resolution information; application checking uses the Lens's declared applicability and cardinality. Planning is responsible for supplying valid resolved subjects to the Lens implementation. Whether a Lens is chosen before or after full or partial name resolution is a planning responsibility and does not constrain the Lens implementation.

This separates planning from Presentation arrangement. Planning may request Evaluation to establish a lookup population; arrangement still consumes supplied qualified results without selector lookup or analysis. The existing CLI request coordinator can implement this responsibility without a general planner or a new mandatory stored planning stage.

The [product-design clarification on request resolution and system-initiated investigation](../foundation/product-design.md#31-investigation-and-representation-selection) makes the boundary explicit: planning may request and consume qualified information, but does not itself derive the lookup population or other program claims. Resolution must retain attribution to the information and qualifications behind its selection, ambiguity or inability to resolve. Established candidates, incomplete coverage and unavailable analysis must not disappear into an undifferentiated “not found.”

Clarified by the human in discussion: prerequisite analysis that PostCode initiates to resolve an explicit request is itself system-initiated investigation. Its role in satisfying that request does not change who initiated the prerequisite investigation. System-initiated investigation also includes work undertaken without an explicit request, such as investigation in anticipation of later interaction. Both use the same analysis and qualification mechanisms and need not create a visible View. Preserve the trigger, captured basis, relevant results and qualifications behind selections and suggestions. Reuse does not establish freshness. Prerequisite work remains attributable to the enclosing request and governed by its resource constraints; anticipatory work requires the applicable human-authorized resource policies.

Foundation wording to reconcile: the local product design at commit `4df521d` explicitly defines system-initiated investigation as work “without such an initiating request,” after describing prerequisite work as part of an explicit request. That exclusion conflicts with the human's clarification above. This note records the intended meaning; it does not silently revise the governing document. Reconciliation should preserve the distinction between resource authorization for work serving an explicit request and work undertaken in anticipation of one, without excluding the former from system-initiated investigation.

For this proposal, account for prerequisite work in request/planning outcomes and check existing initiation paths during planning. The clarification does not itself add anticipatory investigation, background scheduling or a general resource-policy system to the implementation scope. Reporting should preserve actual initiation and attribution where relevant; the separately deferred captured-basis export gap must still be acknowledged. The eventual architecture reconciliation should also check the Evaluation definition's description of where information requirements arise, so prerequisite and other system-initiated work fit explicitly without making planning an analysis implementation.

Resolve a precise reference to its actual target and kind before interpreting failure to match a Lens's population. Prefer a narrow read operation on the existing session binding service for known bindings. The present `entityIds` operation can allocate references; it is not a read-only reverse lookup. Do not infer existence from a prefix or allocate every retained subject merely to classify a request. Preserve valid-request allocation schedules and collision behavior. The arrangement-side binding port must remain binding-only.

Agreed in discussion: when a Lens is selected, planning uses its declared applicability to narrow name lookup to suitable candidates. If broader or partial resolution preceded Lens selection, planning refines or validates that result before invoking the Lens implementation. The resolver remains usable before a Lens is selected. Current dependency requests therefore continue to search module names/handles. A precise `children @group-…` request is different: its target must not be filtered into apparent nonexistence or silently retargeted. Planning resolves the group and reports the unsupported application without passing it to the dependency Lens. Missing information about a lookup population remains distinct from an established empty selection.

Lens implementations should defensively check that supplied subjects and normalized parameters satisfy their contract. Invalid input at that internal boundary is an invariant failure, not the normal route for rejecting a human's request. User-facing missing, ambiguous, invalid-parameter and unsupported-application outcomes belong to request coordination using the declared contract. Analysis availability and materialization remain separate: a valid application can still yield partial or unavailable information. Share contract definitions or validation logic rather than maintain competing applicability rules in planning and implementation.

| Existing request capability | Behavior to preserve or correct |
| --- | --- |
| Module inventory | Configured-project subject and qualified module population. |
| Organization for project or repository | Distinct population selection and its qualifications. |
| Dependency structure | Project structure, opaque endpoints and coverage distinctions. |
| Module, group and mixed inspection | All exact matches and legitimate embedded detail; no arbitrary selection of one match. |
| Dependency children and parents | Current direct module selection, including opaque external subjects; bound non-module targets produce an explicit unsupported outcome. |
| Module summary | One module; missing/ambiguous selection does not invoke investigation. |
| Explain, decompose and examine | One exact investigram; program-subject references are unsupported, not unknown. |
| Exact investigram and associated inspection | Original-target semantics and fixed retained correction/association selections. |
| Usage | Subjectless reporting through the same request/reporting infrastructure, outside Lens semantics. |

A bound group refusal should preserve its actual target and requested Lens in an unsuccessful planning outcome, produce an accurate unsupported-subject description and leave the reference usable by subsequent inspection. It does not invoke the Lens or create a Projection for that invalid application. Implementing this requires the explicit contract change described above, rather than silently removing previously required unsupported-selection records. A known compatible target absent from a supplied evaluation population must retain that scope limitation rather than become an unknown reference. Applicability, reference status and evaluation materialization must not be compressed into one overloaded status.

Agreed in discussion: different subject designations must not create different Projections when the qualified answer is otherwise identical. A name lookup and a precise reference resolving to the same subject should share Projection identity when the Lens, normalized parameters, captured basis, selected information, supporting method/evidence, qualification and relevant outcomes are otherwise the same. The same applies to different names or handles resolving to that subject. Preserve meaningful collection order or roles where applicable; this is not permission to equate distinct subjects or captures merely because their displayed content matches.

Designation and lookup provenance belong to the request and its resolution outcome, which can reference the resulting Projection. Preserve literal/reference modes, supplied spellings, missing/ambiguous outcomes and population-completeness information there, rather than making one invocation's lookup history part of a shared answer. The unresolved and subsequently resolved outcomes remain distinct without requiring an unresolved request to establish a program answer. Qualification that actually affects the Lens's selected population or answer still belongs to the Projection and must not be discarded to force identity equality.

This replaces the earlier proposal to preserve separate name/reference Projection identities. It requires more than changing a hash: request-specific fields must be separated from immutable Projection payloads so two requests sharing an ID do not submit conflicting retained records. Plan the exact record, descriptor, comparison and method-version changes across all four families, including associated inspection and investigation selections. Existing accepted identity/retention provisions that encode designation in Projections need explicit treatment in the later decision package. No global content-deduplication service or cross-session identity guarantee is implied.

## Selection independent of inspection construction

Extract the matching and qualified selection responsibility currently embedded in module inspection into the shared resolution capability used by request coordination. Dependency construction should consume the resolved selection and retain its own answer without a discarded inspection Projection. Where module inspection and summary lookup have equivalent matching semantics, share that responsibility while preserving their different cardinality rules. Keep subject-name resolution distinct from the Lens's selection of information that answers its question.

The selection operation should consume an explicitly established population and its relevant support. It should not obtain broader matches by scanning unrelated accumulated information, initiate rendering or manufacture a Lens answer as a lookup side effect. Planning may first request Evaluation to establish that population; the resolver consumes the resulting qualified information. Separation does not imply that every request can be resolved before any evaluation.

Preserve organization inspection's embedded module Projection and associated inspection's retained mechanical basis where those answers are genuinely consumed. There is no requirement for a universal component pointer or for converting these accepted selections into a multi-Projection View.

## Lens requirements and investigation operations

Keep the [accepted operation separation](../docs/decisions/investigation-operations-and-lenses.md). Lens requirements describe the information needed for the answer. Investigation operations describe reusable work with their own subject, parameters and relevant context. Evaluation determines compatible reuse and missing work; construction consumes materialized information and outcomes.

The duplicated current mappings in session dispatch and investigation selection should have one authoritative source. Their present one-to-one shape is a property of this slice, not a permanent restriction on Lens definitions. A different Lens must not force a new investigation when its requirement can use a compatible retained outcome. Conversely, sharing an operation name cannot justify reuse across incompatible subjects, parameters or method/context.

A prompt-backed operation can remain a small declarative entry with standard evidence access, validation, retention and reporting. Prompt/method changes that alter the work need explicit provenance and reuse treatment. A Lens definition must not bypass Evaluation by invoking an investigator directly. The existing single-operation dialogue contract remains unchanged; this work does not introduce multi-operation dialogues or a declarative composition engine.

Agreed in discussion: an ordinary interpretive Lens should have a convenient authoring declaration supplying its identity and description, applicable subjects and parameters, the prompt defining the interpretive work, and any departures from standard context/evidence or result handling. One declaration may define both the Lens and its default reusable operation, without requiring the author to duplicate metadata merely to preserve the architectural distinction. Internally, Lens requirements and operation identity remain separate: Evaluation still owns execution and reuse, and another Lens can request the same compatible operation. Standard execution, validation, retention, presentation and reporting should work without Lens-specific edits in those common paths. Specialized implementations remain possible when their semantics require them. The exact declaration syntax and registration mechanism are not yet chosen.

## Request reporting from the actual request and outcome

Carry normalized request meaning and the actual resolution/application outcome through execution and publication. Observations should not infer a request from a View-wide Lens tag or reconstruct it from bounded arranged content. Record the requested Lens, designation and true parameter values separately from the produced Projection and outcome. Refused and failed requests still have an intelligible request even when no answer exists.

Describe navigation through its designation mode: precise session reference, literal lookup or scoped population request. Identify investigrams as subjects without implying they are entities. Every implemented Lens, including follow-ups and unsupported children/parents requests, must produce accurate reporting without a catch-all inventory description. Usage has a reporting-request description of its own.

Preserve command outcomes, actual output, usage finalization, source-disclosure classification and delivery behavior. The current singular schema can be corrected without implementing a plural View schema; future coordination will need associations between each actual request and result, rather than a single Lens attributed to an entire View.

The [captured-basis observation gap](../docs/backlog.md#preserve-captured-basis-attribution-in-observations) remains separate and explicitly deferred. This work may correct an associated-inspection request descriptor, but that alone does not establish adequate exported support after the ephemeral store is gone. Do not claim full provenance conformance or add historical observation migration under F1.

## Ease of adding Lenses as an acceptance criterion

Walk through both additions against the proposed design during planning and demonstrate the resulting integration approach during implementation verification. Record the actual changes required and why each belongs to the new capability. A prose assertion that a table is extensible is insufficient; a bounded fixture or test definition can demonstrate the path without shipping a new public Lens.

| Addition to exercise | Expected integration |
| --- | --- |
| An ordinary interpretive Lens over a currently supported subject and existing investigram/evidence contracts | Declare Lens identity, applicability and parameter meaning; select an existing operation or add an objective/prompt with the necessary operation metadata; reuse the existing execution, acceptance, retention, arrangement and reporting paths. |
| A mechanical Lens selecting a useful subset of already established module or dependency information | Declare the question and requirements; implement its qualified selection/construction; reuse subject resolution, reference handling, existing content/presentation facilities where suitable and request reporting. No new provider or analyzer is needed for this example. |

Pass when additions are local and understandable: capability-specific declarations and construction belong with that capability; common parsing, applicability handling and observations do not need another Lens-name conditional. A small explicit registration or CLI exposure change can be reasonable. Agreed in discussion: new semantics may require any kind of implementation code appropriate to their responsibilities, not only selection or arrangement code. For presentation, reuse a suitable Presentation, modify one compatibly without breaking its existing uses, or create a new Presentation. The test is whether each necessary change serves the new semantics while preserving existing contracts, rather than repeating dispatch policy throughout the system.

The interpretive walkthrough can use a hypothetical module “risks” Lens with existing evidence access and investigram output. It must demonstrate the agreed single-declaration authoring convenience while keeping Lens identity separate from operation identity. Reusing an operation should preserve its original provenance, and adding a prompt should not require copying the entire investigation path. The mechanical walkthrough can use a Lens selecting a module's established exports, declaring the existing export-information requirement without constructing an inspection answer to extract it. These are integration examples, not approval to ship either Lens or a claim about interpretation quality. The mechanical example must retain qualification, omissions and population meaning. Both need correct reporting and unsupported/missing-subject behavior without special reporting patches.

Aim for prompt plus minimal metadata in the ordinary interpretive case. Do not turn that aim into a promise that every new Lens needs only a prompt. Neither walkthrough justifies a plugin system, dynamic registration, a workflow language or a general planner.

### Matching Lens results to Presentations

Agreed in discussion: implement an explicit, bounded contract mechanism in this work so planning can determine which available Presentations are appropriate for a Lens's result, even with only a few current result types. Every existing program View path must exercise it. Declared compatibility should replace implicit dispatch assumptions rather than become unused metadata beside them. Exact schema and API mechanics remain to be planned; this does not expand into general GUI Presentation design.

A Lens implementation declares the kind of qualified information its Projection exposes for the selected subject and parameters. A Presentation declares the input contracts it supports, any additional preconditions, supported presentation options and standard expansions it needs. Several lenses can supply the same contract, and several Presentations can consume it. An ordinary new interpretive Lens using the existing investigram contract should therefore be eligible for existing interpretation Presentations without a new Lens-name branch in each one. Different internal implementations of one Lens may expose different result contracts; the shared Lens identity alone is not enough to select a Presentation.

The contract must carry meaning as well as data shape: populations, relationship direction, identity/correspondence where relevant, qualification, materialization and permitted absent detail. A generic nodes-and-edges shape alone does not establish that a dependency-specific Presentation can honestly display containment or inferred relationships. Typed content interfaces and small explicit compatibility declarations or checks may suffice for current families; no structural-schema inference engine or universal Projection format is implied.

Planning distinguishes compatibility from preference. It determines which Presentations can consume the prospective result and requested options, then honors an explicit choice or selects among compatible choices using interface context and defaults. The choice and its criteria must remain inspectable. Where materialized content matters, planning can refine the choice after Evaluation or use a declared fallback; it must expose consequential changes rather than silently change the question or omit required qualification. No suitable Presentation is a View-planning problem, not evidence that the Lens is inapplicable to the subject.

Compatibility has a pre-execution and an actual-result aspect. Declared result contracts let planning choose a candidate and include its standard expansion requirements before Evaluation. Actual content and evaluation outcomes then determine what was materialized. A supported contract must account for empty, partial and unavailable cases: supplying less information is not permission to render a misleading complete answer. Any further evaluation needed for a revised choice returns through request coordination; arrangement cannot acquire it. Exact retained-Projection presentation would be limited to the content that result actually supplies, with richer information requiring another request under the separately scoped continuity rules.

The minimum mechanism should provide:

- Explicit identification of the qualified result contracts currently implemented, backed by their typed content and semantic guarantees. Do not force different meanings into one generic record shape or give every Lens a unique output type merely because its identity differs.
- A declaration of the prospective result contract from the chosen Lens implementation for the resolved subject and normalized parameters.
- Presentation declarations identifying accepted contracts, supported options, relevant preconditions and standard expansion requirements. Those requirements remain distinct from the Lens's own requirements.
- Actual planner use of those declarations to choose a compatible Presentation or explain why a requested View cannot be planned. Keep compatibility separate from default/preference policy and retain the choices actually made.
- Validation at the construction/arrangement boundary that the supplied result conforms to the selected contract. A programmer passing incompatible content is an invariant failure; expected partial or unavailable content remains an ordinary qualified result under its declared contract.

Use ordinary types and a small static catalog or explicit functions as sufficient for the current families; choose exact API mechanics during planning. Keep the concrete contract association available at runtime where the planner needs it, rather than relying only on compile-time types. Rich structural matching, automatic data conversion, contract inheritance, dynamic discovery and a general constraint solver are not necessary. An explicit adapter is possible when needed, but must preserve supplied meaning and qualification and cannot smuggle analysis into Presentation.

The full adopted model permits a Presentation to accept a collection of qualified inputs with roles and established correspondence requirements. The current mechanism need not implement that general collection matching, and must not assert that one input is a permanent architectural limit. Lens-specific recommendations can be useful defaults, but should not become exclusive hard-coded Lens-to-Presentation pairings. Existing associated/embedded results remain covered through their actual supplied content contracts. Usage and unsuccessful planning reports remain outside program Projection contracts rather than being disguised as Lens results.

## Implementation dependencies to resolve during planning

A focused source check confirms that the central request and construction paths remain as audited; the following are concrete planning dependencies, not findings of contradiction in the adopted architecture.

| Dependency | Planning consequence |
| --- | --- |
| [Session dispatch](../src/lib/session.ts) duplicates the Lens-to-operation mapping, selects subjects inline and routes unsupported investigrams through investigation Views | Trace every existing capability through the new request model, including refusals and usage. A parallel unused abstraction would not meet the goal. |
| [Dependency records](../src/lib/dependencies/records.ts) and [store validation](../src/lib/memory-store.ts) require a dependency Evaluation and module subjects | Route the known-group refusal through an unsuccessful planning outcome, not a dependency Projection. Specify its reporting/retention without inventing a dependency Evaluation or labeling the group a module. |
| [Dependency construction](../src/lib/dependencies/projections.ts) calls module inspection for selection | Extract matching without changing relationship populations, coverage, opaque-subject handling or valid-reference allocation. |
| [Investigation execution](../src/lib/investigation/execute.ts) has a prompt-objective table but also selects module versus investigram validity by operation name | The extension walkthrough must assess operation applicability and initial context as well as prompt registration. Another prompt alone does not currently satisfy integration. |
| [Selection records](../src/lib/investigation/selection-record.ts), family descriptors and identity helpers encode request meaning differently | Separate request-specific designation/resolution data from shared answer payloads and identity; account for record validation, descriptor, comparison and identity-method effects together. Preserve fixed revision snapshots and all answer-relevant qualification. |
| [Observations](../src/lib/observations.ts) derives request records from View descriptors; worker/parent publication finalizes usage | Trace the request/outcome information end to end for direct-session, one-shot and shell paths, including no-View outcomes. Preserve self-sufficient parent-side rendering. |

Identifier spellings, exact planning-outcome shapes and interaction-scoped ownership, registration mechanics and replacement output shapes remain to be specified. One `inspect` identity with freedom for separate internal implementations, designation-independent identity for otherwise identical answers, unsuccessful planning outcomes without Projections, and their interaction-scoped lifetime with observation reporting are agreed in this discussion, rather than established by the architecture reconciliation itself. Retention and compatibility provisions in the still-accepted [qualified construction decision](../docs/decisions/qualified-projection-construction.md) require explicit revision in the decision package. At this early development stage, structured-output compatibility imposes no migration work. Update responsible identity-method versions when semantics change, and revise output validation and comparison expectations to the new contracts; current experimental format labels do not establish a stability promise.

## Evidence required from the eventual work

Every existing capability must exercise the request model through its actual execution path. Cover one-shot and shell use, direct session calls, Unicode and JSON output, source-detail and existing pagination inputs, usage and no-View failures. Preserve behavior except for the agreed corrections and structured-output changes. Update tests to assert the new semantics without treating old serialized shapes as compatibility requirements.

Regression evidence should include:

- F1 descriptions through real publication for all Lens identities and designation modes, using independently stated expectations rather than generating expected prose from the implementation table.
- F2's bind-group, inspect, children/parents refusal, inspect-again journey; existing investigram refusals; unknown prefixes; literal reserved-looking names; mixed and ambiguous matches.
- Planning narrows name lookup using the selected Lens's applicability and supplies only contract-valid subjects to its implementation. Precise incompatible references yield ordinary request outcomes without invoking that implementation; directly supplying invalid subjects to the internal implementation boundary exposes an invariant failure instead.
- Unsettled planning retains accurate resolution and reason information without manufacturing a Projection. Its reporting is distinguishable from valid empty or partial Lens answers and from subsequent evaluation failure. Work already performed for resolution remains accounted for.
- Applicable subjects with partial/unavailable analysis, opaque external dependency subjects, and no hosted invocation on missing/ambiguous or unsupported requests.
- F3 separation across records, Views and observations, with parameters normalized and validated. Current lenses should reject undeclared parameter values rather than silently ignore them.
- F4 selection without an unused retained inspection answer, alongside preservation of legitimate embedded and associated results.
- Stable references and collisions; distinct literal/reference request meanings that resolve to one shared Projection when their qualified answers are otherwise identical; repeat insertion without payload conflicts; retained reconstruction after corrections; operation reuse and attributable qualification. Different captured bases, methods or answer-relevant qualifications must remain distinguishable even when displayed content is equal.
- Both extension walkthroughs, with a reviewable account of additions and evidence that reporting and subject handling work without Lens-specific patches in unrelated layers.
- Every existing program View path uses declared result/Presentation compatibility. Both extension examples reuse a compatible Presentation without a new Lens-name dispatch branch. Incompatible choices yield an intelligible planning outcome, required standard expansions enter Evaluation before arrangement, and empty/partial/unavailable content retains its qualification. A compatible modification to an existing Presentation is verified against its existing uses.

Use existing fixtures, controlled investigator doubles, comparison and publication tests. A live inference run is not needed to verify request integration; interpretation-quality assessment for a genuinely new public Lens would be separate.

## Architecture questions and next discussion

No fundamental inconsistency was identified in the focused reading. This is not a broad conformance certification. In particular, removal of a distinct composite-Lens category is compatible with retained Lens contributions, and preserving associated inspection is explicit in the adopted decision.

If planning exposes a real contradiction among the foundation, concepts, constraints or accepted decisions, record the exact conflicting provisions and the request behavior they prevent. Keep architecture inconsistencies distinct from known deferred nonconformance, implementation coupling and design choices left open. Bring a fundamental issue back for human direction rather than silently changing governing material or working around it in code.

Inspection identity, planning ownership of resolution, applicability-based narrowing, designation-independent identity for otherwise identical Projections, planning outcomes without fabricated Projections, convenient interpretive-Lens authoring with separate reusable operation semantics, local mechanical-Lens integration with appropriately scoped code and Presentation reuse/modification/creation, and an exercised result/Presentation contract mechanism are agreed in discussion.

Planning outcome lifetime is also agreed: return and report a self-contained outcome, without a session-retained, independently addressable plan after interaction completion.

Agreed in discussion: for now, during early development, structured outputs are experimental and subject to change without notice. The human confirms there are no current production consumers of these JSON formats inside or outside PostCode; temporary GUI wireframes based on JSON investigation results are not a reason to preserve them. Change affected JSON and observation payloads directly to express the new model. No compatibility aliases, dual formats, deprecation period, adapters or migration are required for this work. Historical observations remain untouched, with no current promise of reading them through a new-format reader. Internal Presentation compatibility and preservation of qualified meaning remain requirements; freedom to change serialized formats does not waive those contracts.

This is a development-stage policy, not the intended permanent external contract. Structured outputs will eventually need deliberate versioning and published schemas, with compatibility obligations defined for their consumers. Establish that policy when preparing the formats for supported use; do not introduce its infrastructure or maintenance burden into this early development work.

The policy questions discussed here are settled sufficiently to prepare a draft. Exact type names, identifier spellings, registration layout, result-contract variants and test organization can be worked out there rather than asking the human to preselect every implementation detail. The draft must expose any newly discovered dependency or fundamental issue that changes the agreed scope or semantics.

Prepare a formal draft plan with the necessary decision proposals once these choices are sufficiently clear. Its target is the current capability set using a coherent request model; general multi-Projection presentation, captured-basis observation export and retained-Projection redisplay remain separately tracked unless a concrete dependency makes a scope change necessary.
