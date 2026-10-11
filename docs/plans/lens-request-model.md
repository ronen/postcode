# Explicit Lenses and qualified request resolution

Status: approved
Created: 2026-10-11
Updated: 2026-10-11
Superseded by:

## Current problem

PostCode currently represents a Lens through several partly overlapping string vocabularies, inline dispatch rules and family-specific descriptors. Subject designation occupies fields reported as Lens parameters. Dependency selection constructs an inspection Projection only to copy its selected modules. Observations infer the request from its View, misdescribing follow-ups and some refusals, while dependency requests report a bound group as unknown rather than unsupported.

## Intended outcome

Establish a sound request model exercised by every existing capability. A request identifies its investigative question, true parameters, subject designation and presentation/execution choices. Coordination resolves subjects against qualified information and declared applicability. Evaluation supplies reusable work; construction produces a qualified answer; publication reports the actual request and outcome, including when no program answer was produced.

For example, with this model in place, after organization exposes a group reference, `children @group-…` resolves that group and explains that dependency children applies to modules. It performs no dependency application, preserves the reference for subsequent inspection, and records the actual refusal. The model also preserves inspection of every matching module/group through `inspect foo`: a collection is not an ambiguity error for a Lens that supports it.

The work addresses [representation audit](../../records/audits/2026-10-06-user-model-concept-representations/REPORT.md) F1–F4. It does not adopt every audit suggestion. Approval of this plan and its decisions does not itself authorize implementation; implementation follows the [task protocol](../../foundation/task-protocol.md).

## Scope and boundaries

| Included | Required result |
| --- | --- |
| Explicit Lens definitions | One source of identity, question, applicability/cardinality, parameter validation, requirements and prospective result contract. |
| Subject designation and resolution | Shared interface-independent lookup; precise-reference resolution distinct from applicability and materialization. |
| Planning and outcome lifetime | Self-contained resolution results when an application cannot be settled; no fabricated program Projection or View. |
| Qualified answer identity | Repeatable logical identity for otherwise identical answers reached by different designations; immutable payload consistency. |
| Selection | No unused inspection answer in dependency selection; preserve genuinely consumed embedded and associated results. |
| Request reporting | Correct request/outcome data through direct Session calls, worker execution, CLI publication, usage and observations. |
| Existing interpretation reuse | Preserve compatible reuse and demonstrate no repeated inference for the same completed work, including another consuming Lens. |
| Result/Presentation compatibility | Bounded declarations actually used by every current program View path. |
| Prerequisite attribution | Bounded remediation in the current resolution, interpretation-evidence and publication paths identified below. |
| Extension evidence | Local integration walkthroughs for an ordinary interpretive Lens and a mechanical Lens using existing information. |

Do not add a plugin system, dynamic discovery, workflow language, general planner, autonomous investigation, scheduler, multi-operation dialogue, semantic answer matching, or generic cache service. Do not add GUI interaction/rendering design, a general non-View report architecture, general multi-Projection Presentation selection, new public Lenses, annotation support, persistence, cross-session identity, multi-state analysis, or following/pinned controls.

F5's general Presentation/options design and F6's exact retained-answer redisplay remain separate. Preserve their disclosed limitations. Captured-basis export in observations and navigation-origin lineage remain independently scoped; accurate request reporting does not close either gap. A supplied reference does not establish an originating View. No historical observation migration, reader, compatibility adapter or dual output format is required under the accompanying temporary experimental-output policy.

Keep F1/F2 within this coherent work, using the selected request-outcome contract. This deliberately changes the separate-correction sequencing recommended in [Coordinated Views — Adoption and conformance](../decisions/coordinated-views-and-qualified-results.md#adoption-and-conformance): the combined scope avoids an interim refusal/reporting representation that would immediately be replaced. It waits for neither GUI nor a general reporting architecture. The existing defects remain disclosed until fixed. Milestones may stage integration, but completion requires every existing capability to use the model.

## Decisions and governing dependencies

This plan implements the contracts in [Lens application and request outcomes](../decisions/lens-application-and-request-outcomes.md), [Qualified construction under the request model](../decisions/qualified-construction-under-the-request-model.md) and [Experimental structured outputs during early development](../decisions/experimental-structured-outputs.md).

These decisions replace all three headed decisions in [qualified construction](../decisions/qualified-projection-construction.md) as complete units. The [replacement mapping](../decisions/qualified-construction-under-the-request-model.md#supersession-mapping) explicitly carries forward family qualified-input rules, arrangement isolation, binding-only capability, frozen revision selections, atomic retention, usage finalization, source disclosure and verification obligations. Mechanical and investigation lookup failures, not just the investigation selection table, receive explicit new retention treatment.

Preserve the [operation separation](../decisions/investigation-operations-and-lenses.md), [evaluation outcome/retry rules](../decisions/investigator-execution-and-evidence-access.md#evaluation-outcomes-and-later-requests), [execution ownership](../decisions/execution-ownership-and-cancellation.md), and [coordinated-Views contracts](../decisions/coordinated-views-and-qualified-results.md). Existing associated/embedded results remain valid; coordination of independent answers belongs to Presentation, while synthesis of another qualified answer belongs to a Lens.

Usage and resolution results share delivery dependencies without requiring the same record shape or lifetime. Answer identity depends on separating request provenance from immutable answer payloads; it is independent of the physical reuse mechanism. The retention and output contracts determine which result alternatives publication must support.

## Current implementation assessment

Baseline: `dade1e7`; source behavior is unchanged from `c7fb80f`. This is source and existing-test inspection, including the field/ownership trace and concrete extension walkthroughs below, not new runtime verification or a complete architecture-conformance audit. Recheck affected paths if the implementation changes before work starts.

| Path inspected | Established dependency and bounded treatment |
| --- | --- |
| `src/lib/session.ts`, family Projection constructors | Dispatch selects subjects inline and duplicates Lens-to-operation mapping. Module, organization and dependency payloads contain selectors/reference flags; investigation selections also retain designation. Route all capabilities through normalization/resolution while keeping family-specific construction. |
| `src/lib/dependencies/projections.ts` | Calls module `inspect` for matching. Replace that dependency with shared qualified selection, preserving direct relationship direction, owner population, opaque subjects, non-edge requests and coverage. |
| `src/lib/memory-store.ts`, `src/lib/investigation/selection-record.ts` | Binding allocation and immutable record validation constrain changes. Add narrow read access to established bindings rather than allocate arbitrary populations to classify a target. Existing investigation selections encode unsupported children/parents and module/group/investigram targets. Move those unsuccessful application cases to resolution results while preserving valid failed/unavailable records. |
| `src/lib/investigation/evaluation.ts`, `contracts.ts`, `execute.ts` | Reuse already compares operation/subject/parameters independently of Lens and designation. Execution still hard-codes operation objectives and module-versus-investigram applicability. Extension needs an operation definition with appropriate initial context, not merely another prompt string. |
| `src/lib/observations.ts`, `command-execution.ts` | View publication reconstructs the request from its descriptor. Command observations already support no-View failures/refusals. Extend that existing path with actual normalized requests and resolution results rather than invent a general report system. |
| `session-protocol.ts`, `session-worker.ts`, `interactive-session.ts` | The result envelope and parent usage finalizer assume a View. Make the bounded result alternatives explicit and preserve self-sufficient parent rendering, sealed usage reports and pre/post-publication checks. |
| Existing investigation integration/selection, projection-content and publication tests | Repeated requests already have usage/reuse assertions, including direct operation reuse. Preserve and extend these tests instead of claiming to introduce reuse from scratch. Existing selector-sensitive identity assertions need deliberate replacement, not indiscriminate snapshot regeneration. |

### Bounded initiation and attribution assessment

Current records contain qualified evaluation/support references, interpretation attempts and exposure provenance. They do not provide a general explicit parent-request/initiator link for prerequisite work. Observation request IDs are assigned during publication; worker operation sequence numbers correlate transport rather than establish investigation provenance. A command name, generating operation request or attempt identifier alone does not fill this gap.

| Current path | Existing support | In-scope treatment |
| --- | --- | --- |
| Mechanical name resolution for inspect, summary and dependency subjects | Module/organization/dependency evaluation populations and their qualifications; selection is currently embedded in dispatch/construction | Carry the explicit root request and distinguish its requested answer from additional work establishing lookup information. Preserve the support actually consumed, incomplete/unavailable outcomes and candidates even when planning fails. |
| Summary/follow-up Evaluation | Operation request, retained outcome or unavailable result, attempt/provenance and usage; compatibility reuse already occurs | Associate execution and current consumption with the explicit request without inserting its invocation ID into reusable work identity. Preserve original generation provenance on reuse. |
| Investigator evidence access and initial context | Subject-based queries through `evidence-access.ts`, qualified delivery and captured support, execution guards and exposure records | Attribute additional acquisition/derivation to its interpretation attempt and parent request. Record consequential query purpose, result/qualification or unavailability. Retrieval of already-established information records consumption; it must not falsely claim new investigation or freshness. |
| Worker/parent publication, failure and cancellation | Operation-tagged messages, sealed usage, command outcomes, cleanup and input-validity checks | Carry actual attribution and outcome data across publication, including failed/unfinished requests. Keep resource constraints/cancellation inherited from the parent and report actual work without authorizing continuation after it ends. |

This is sufficient evidence to include a bounded attribution path in the design; it is not proof that all current initiation requirements are fulfilled. Use request-scoped execution/reporting context and existing support records, not an event for every helper or a universal investigation store. New retained results keep their generating attribution where applicable; returned outcomes preserve the current consumption and consequential prerequisite facts. Attribution must remain intelligible without an independently addressable request store: identifiers alone cannot replace the relevant parent purpose, constraints and outcome information. Keep invocation attribution outside shared answer payloads and reusable work keys. Direct Session entry points must establish explicit request context too, without requiring observation delivery.

#### Field ownership and bounded changes

The planning trace identifies five changes at existing boundaries. Field names below describe information to carry, not a required TypeScript schema.

| Boundary and existing fields | Missing relationship | Concrete change and lifetime |
| --- | --- | --- |
| `session.ts`: `ViewRequest`, `ExecutionOptions`, direct `evaluateInvestigation`; `session-protocol.ts`: transport `operation` | No stable root-request attribution before work begins; a publication UUID or transport sequence is not its meaning | Establish a request correlation token with normalized request, actual/known initiating actor, purpose and execution constraints at each public entry. CLI and direct callers use the same coordination contract; unknown caller identity is not fabricated as human. Pass this context separately from operation semantic inputs. Retain the bounded parent description with attributed results/returned information so later inspection needs no request-history lookup. |
| `evaluation.ts`, dependency/organization evaluators and `evidence-access.ts`: result IDs, contexts, `basis`/`moduleEvaluation`, states, `selected`, limitations and captured-content references | Results preserve support but not why additional work was requested, its initiator/parent or first establishment versus current consumption | At the request/evidence acquisition boundary associate the qualified outcome/support with a work purpose, PostCode initiator where additional investigation occurs, parent correlation and actual execution/reuse disposition. Preserve first-generating attribution with retained support and return current consumption separately. Use bounded Session-owned attribution metadata alongside existing outcomes, without changing semantic Evaluation/Projection keys or attaching a new invocation to an already immutable payload. Existing evaluators/providers expose establishment versus reuse at the point they actually know it; do not infer it from an equal ID or add an outer cache. |
| `investigation/execute.ts`: `InvestigationOptions`, bounds/signal; `AttemptReport` and accepted `InvestigationProvenance`: attempt, request, agent, instructions, exposures | Operation subject/parameters and exposure lists do not identify the explicit parent; evidence-query execution/unavailability is not preserved by exposure lists alone | Carry parent context into execution. Record bounded purpose/query, actual outcome/qualification and support links for consequential evidence work, including acquired-but-not-delivered information and unavailable queries. Link it to the attempt and parent, retaining generating attribution for accepted interpretation and current facts in failure/limit reports. Pure retrieval/continuation of existing information records consumption, not new investigation. Keep exposure/citation eligibility unchanged. |
| `session-worker.ts`, `interactive-session.ts`: operation-tagged replies/progress, sealed attempt reports and parent-owned usage | Attribution assembled only at final success would be lost on a failed/interrupted request | Carry bounded work/outcome data with progress/final result or failure reporting at the existing operation boundary; seal actual received facts on interruption. If termination prevents a complete report, disclose the incomplete state instead of inventing successful acquisition. Preserve parent cancellation, one command in flight and no late publication. No new scheduling or resource authorization is introduced. |
| `command-execution.ts`, `observations.ts`: actual stdout/stderr, command outcome, request/analysis/output UUIDs, batch `formatVersion` | The produced-View path derives request meaning from `view.projection`; no-View path lacks qualified resolution and work attribution | Publish normalized request, result kind, resolution information and bounded work attribution directly, using existing command/batch-local occurrence IDs and version 2 of the observation envelope. Non-View results get no view-produced event. Keep source classification, sealed usage and sink failure behavior. Returned data is independent of sink success. |

This is a bounded addition of request context, per-outcome generating attribution/current consumption, and evidence-work reporting at those five boundaries. It does not require a record per helper call, a retained request-result catalog, a new analyzer, an autonomous engine or historical store export. Mechanical result/support metadata lasts with its supported Session; result consumers receive enough parent/purpose/outcome information to interpret it without a lookup into released planning resources. Interpretation method/provenance changes are versioned with their records.

Existing execution guards constrain the investigator and its evidence calls; they are not a new public whole-request budget. Carry actual inherited limits/cancellation and disclose where no numeric limit exists. Do not claim stricter enforcement than the underlying boundary provides. User-facing budgeting and autonomous authorization remain separate work.

Implementation confirms these seams and encodings rather than postponing their scope definition to M1. If it reveals a need for general history export, autonomous policies, or another substantial facility, the implementing agent brings that dependency to the human before expansion. Session-local support references do not by themselves close the separately known post-Session observation-basis gap.

## Request and result design

### Explicit capability definitions

Use a small typed set of Lens definitions and a separate CLI spelling map. The normalized vocabulary retains `modules`, `organization`, `inspect`, `summarize`, `explain`, `decompose`, `examine`, and uses `dependency-structure`, `dependency-children`, `dependency-parents` for the existing dependency questions. CLI commands remain unchanged. Organization over a configured project versus repository is one question with distinct subjects, not a subject choice encoded as a Lens parameter.

Each definition exposes the conceptual information need, subject/parameter applicability and cardinality, normalization/validation, requirements and the prospective qualified result contract. Current public Lenses have no semantic parameters; undeclared or invalid Lens parameters at the direct Session request boundary return a resolution result before Lens execution. Violating the validated internal Lens contract is a defect. Share applicability definitions/validation between those boundaries. Do not import renderers to discover Lens meaning. Keep invocation/execution constraints separate from operation meaning and do not treat current subject kinds as an exhaustive ontology.

One `inspect` identity covers module, group, existing mixed module/group and exact-investigram inspection. Use thin subject-specific implementations with their own requirements and result contracts; versioned construction method and provenance identify which implementation/support produced an answer. This does not introduce arbitrary mixtures of investigram and program subjects or change exact-original inspection into current-replacement lookup. Dependency children/parents retain their dependency meaning; group containment is not an alternative implementation of that question.

### Coordination and selection

Keep designation, resolved subject(s), Lens parameters, session-bound program-input context, actual captured support, Presentation choices and execution constraints identifiable. Normalize defaults/aliases before validation and retain the choices actually made.

A settled plan identifies those subjects, Lens/parameters, applicable input context and information/Presentation requirements; settlement does not guarantee Evaluation success or complete materialization. Do not relabel the unchanged-input Session as a following/pinned binding or add speculative multi-input fields/capture identifiers. Subject identification requires neither a Workspace root nor a formal task. Respect explicit initial-View choices and preserve current defaults; opening a subject authorizes an initial answer only when the action communicates that behavior, not unrelated exploration.

Resolution consumes a qualified population supplied by analysis/Evaluation/core construction. It can run before a Lens is chosen, but when one is selected, narrow name matching to its applicable subjects and check cardinality. The Lens implementation receives valid inputs; its defensive validation exposes invariant failures, not ordinary human-request refusals. Name resolution ordering belongs to coordination.

Resolve a precise reference to its actual bound target before applicability checking. Unknown binding, known incompatible target, and known compatible target missing from the supplied evaluation population are different outcomes. Read-only reverse binding lookup must not allocate references or infer existence from a prefix. Preserve established valid-request allocation schedules, collisions, reserved-looking literal names and binding-only arrangement access.

Share equivalent module/name matching without conflating inspect's collection cardinality with summary's single-subject requirement. Dependency construction consumes the resolved selection without retaining an unused inspect Projection. Qualified population results genuinely consumed for resolution and existing organization-embedded module detail or associated inspection remain legitimate.

### Outcome and retention cases

An unsettled planning outcome is delivered as a self-contained resolution result, not a second independently stored artifact. Its request, candidates, reason, criteria, qualifications, prerequisite work and available follow-up references remain usable after execution finishes without observations or fresh lookup.

| Case | Result and retention |
| --- | --- |
| Name/ref cannot establish subjects; ambiguity for a single-subject Lens; invalid parameters; precise incompatible target | Resolution result; no Projection for the requested application. Preserve any prerequisite results separately. |
| `inspect foo` has several applicable matches | Settled collection application for all established matches; supplied resolution information accompanies the shared answer and carries lookup-specific qualification. |
| Valid inventory/organization/dependency population is empty | Qualified answer for that population, including relevant completeness; not failed name resolution. |
| Bound applicable subject has partial/unavailable analysis or is outside the supplied evaluation population | The target is resolved. Retain a qualified answer identifying it and the actual scope/materialization limitation, supported by its retained subject information and the unmet requirement/outcome. Do not invent membership or turn lack of materialization into unknown binding. |
| Valid interpretive application yields accepted, limited or failed retained Evaluation | Retained selection and its immutable interpretation/revision support under existing rules. |
| Configuration/communication unavailability after a valid application is settled | Retained unavailable selection with immutable kind/code/diagnostic; no reusable Evaluation, so later retry remains possible. |
| Exact investigram exists / does not exist | Preserve exact-original retained inspection when present; resolution result when missing. |
| Associated inspection finds no associated interpretation | Preserve its legitimate mechanical basis and empty frozen association selection. |
| Usage | Subjectless report, without program Lens, Projection or compatibility descriptor. |
| No compatible Presentation or an unsatisfied materialization-dependent precondition without a permitted fallback | Resolution result with a presentation-failure reason and references to any answer already produced and retained. No View is fabricated. A malformed internal value is a defect, while a partial result allowed by the selected contract is ordinary qualified content. |

The [family-specific retention table](../decisions/lens-application-and-request-outcomes.md#return-unsettled-applications-as-resolution-results) enumerates the module, organization, dependency and investigation cases replaced, preserving valid empty population answers and legitimate empty embedded selections. “Resolution information” is request-specific context for a settled answer or a resolution result, not another artifact. No current CLI command can redisplay an unsuccessful selection by Projection ID. The new contract requires sufficient returned data and emitted text/JSON, not a shell-side outcome store or independent Session lookup of a resolution result. GUI callers can retain candidates and select one or several for follow-up; prove that through an interface-independent test without implementing the GUI or new CLI list syntax. Candidate references remain subject to Session validity; one-shot references expire at command completion. Later Session accumulation must not silently change the returned candidate list.

Execution-limit stops and investigation failures retain reusable evaluations; configuration/communication failures do not. Interrupted/invalidation outcomes end the Session under current execution rules and do not create reusable interrupted evaluations. Acquired mechanical evidence follows its own retention rules. Do not accept unfinished interpretation or conflate no-account results with planning failure.

### Answer identity and resolution context

Give the same effective qualified answer the same Projection identity regardless of name, handle, reference or incidental lookup route, using the decision's [canonical effective-input set](../decisions/lens-application-and-request-outcomes.md#give-equivalent-qualified-answers-repeatable-identity) and [family identity formulas](../decisions/qualified-construction-under-the-request-model.md#separate-answer-view-and-report-identity). This includes Session context, method version, evidence and meaningful subject order/roles. Same displayed prose or entity list is insufficient. Full retained payload consistency remains mandatory: remove invocation-specific fields from immutable answer payloads before sharing identity.

The four family checks are:

- Module: `inspect foo` finds A/B under incomplete lookup coverage. Resolution preserves that other matches may be unknown; the answer describes established A/B with their detail support. Exact selection of A/B may share that answer. It must not imply exhaustive matching, and any population-coverage claim in an answer remains an identity input.
- Organization: matching G/M preserves both kinds and legitimate embedded module detail. Repository and configured-project populations remain distinct even if their current lists coincide.
- Dependency: name/ref selection of M can share an answer with identical relationship direction, dependency support, opaque endpoints and coverage. Group refusal creates no dependency answer.
- Investigation: summary by name/ref can reuse one operation outcome and share the same answer snapshot. Changed corrections/associations can change a Projection without new inference; exact-original and associated-inspection semantics remain distinct.

Supply resolution context alongside answer content where output needs “two exact matches,” reference status or lookup coverage. Arrangement may use that context but cannot rerun lookup. Consequential displayed differences belong to the affected arrangement/report identity, not the shared answer. No universal View identity formula is introduced. Version affected identity methods, preserve explicit reference normalization and frozen revision snapshots, and verify identical resubmission without conflicting stored payloads.

Logical repeatability does not mandate Projection memoization or physical deduplication. Future annotations motivate predictable referents but add no annotation, persistence or cross-session continuity requirements here.

### Reporting and publication

Carry the normalized request and actual resolution/application outcome from execution to publication. Usage reports and resolution results are non-View outputs; existing program answers use their appropriate View contracts. Adapt the current worker result alternatives, parent rendering/finalization and observation publication only as needed. Exact type names and JSON layouts are implementation choices within these contracts.

Observations record the requested Lens, designation, actual parameters, consequential choices, produced result and outcome independently. No catch-all inventory description, fabricated View or view-produced event for a refusal/report. Preserve actual stdout/stderr, source-disclosure classification, usage even without accepted interpretation, sink-failure warnings, command failure distinctions and cancellation/cleanup behavior. Delivery failure must not invalidate an otherwise delivered result. Resolution results and usage reports require no semantic/content ID; request/attempt correlation and existing batch-local UUIDs identify occurrences. Advance the changed observation envelope to `formatVersion: 2` without historical migration. Correct the present singular request/View path without adding a plural View schema.

If minimal non-View support turns into a general reporting architecture, return the coupled retention/usage change for human scope review. Existing schema labels remain experimental identifiers under the output decision; update tests/docs intentionally without adding migration infrastructure.

### Result/Presentation contracts

Declare the existing module, organization/mixed, dependency and investigation/associated content contracts through their actual types and semantic guarantees. A shared `inspect` identity can expose different contracts by subject. A generic graph shape is not sufficient to make containment compatible with dependency rendering.

Use the existing family arrangements with their supported Unicode/JSON and source/page options as bounded catalog choices. Declare accepted content, partial/unavailable cases, preconditions and standard expansions. Planning uses compatibility to honor explicit choices or an explicit default; where there is only one suitable arrangement no ranking engine is needed. F5's general options redesign remains deferred.

Select standard expansions before Evaluation. Check actual content at the construction/arrangement boundary. A missing compatible Presentation is delivered as the resolution result specified above, not Lens inapplicability; retain any qualified answer already produced before that failure. Coordination can refine a choice or use a declared fallback after Evaluation when an explicit materialized precondition requires it, honoring explicit choices and exposing consequential changes. Any revised choice requiring further information returns through coordination; rendering never acquires it. Contract associations must be available at runtime, and an explicit adapter preserves meaning/qualification without hidden analysis. Compatibility governs future additions too and must be exercised by every existing program View path. Bounded handling of the current families does not make one contributing Projection a permanent architectural limit.

### Reuse and extension walkthroughs

Minimize incurred interpretation costs: the same completed interpretation is not performed twice within the supported Session compatibility/validity contract. This reaffirms existing operation reuse; verify before replacing mechanisms. Newly accumulated evidence does not by itself invalidate compatible retained work. Preserve original provenance and current consumption attribution. Invocation IDs, consuming Lens or lookup spelling must not fragment reuse; materially different work must not be conflated. Repeated failed attempts follow existing retention/retry rules.

The following source-level walkthroughs define the integration approach. They are non-public examples for design and verification, not new product capabilities. Implementation must demonstrate them with existing fixtures and a controlled investigator double, without paid inference.

#### Shared preparation for both additions

The current coupling is concrete: `session.ts` maps Lens names to operations; `investigation/execute.ts` hard-codes objectives and distinguishes module-summary initial context from investigram follow-ups; `investigation/presentation.ts` has Lens-specific titles and reconstructs unavailable requests using an operation map. Module arrangement similarly branches on `inspect` for detail. Adding a prompt today would therefore be insufficient.

Replace duplicated semantic dispatch once, during this work. Lens definitions supply subject/parameter contracts, requirement construction and prospective result contracts. Separate operation definitions supply objective, supported inputs, initial-context policy and method provenance. They can share a convenient authoring entry without merging their identities. Supply the normalized request and result role/title to arrangement rather than reconstructing operation meaning there. Existing special behavior, such as associated mechanical inspection, remains an explicit content/arrangement contract, not an implicit rule that every new interpretive Lens must imitate.

These definitions are static within the supported Session; dynamic installation or hot replacement is not required. Tests supply their fixture definitions when assembling the catalog before Session execution, through an internal construction seam using the same definition types and coordination path as the production catalog. The effective catalog stays fixed for that Session. This requires neither a public registration API nor modification of a running Session; exact construction syntax remains delegated. Changes to an objective, context policy or method that change the work must change its recorded method provenance and compatible-reuse treatment. The implementation may express this through versioned method definitions and Session validity rather than introduce a plugin or hot-reload protocol. Reporting receives the normalized request through the common path.

#### Ordinary interpretive addition: module risks

| Local integration point | Concrete addition after shared preparation |
| --- | --- |
| Lens declaration | Define a non-public `risks` question about one module, with no semantic parameters, the shared module designation/applicability rule, a risks-operation requirement and the existing qualified investigram result contract. |
| Reusable operation | Add its objective/prompt and method metadata, using existing module initial context and evidence access. Register it in the static operation definitions. Execution, acceptance, correction handling, retention and usage use their existing common machinery. A convenient Lens/default-operation entry need not duplicate this metadata. |
| Qualified construction | Reuse the operation-result selection/construction path for an accepted, limited, failed or unavailable interpretation. The Lens selects the answer; Evaluation owns operation execution and compatible reuse. No separate risks-specific retained record family is needed. |
| Presentation | Select the existing interpretation Presentation through the investigram contract. It receives the supplied question/title and normalized request, including for unavailable results. Add no risks-name branch or new risks Presentation. |
| Entry and verification | Include the fixture definition in the catalog supplied before Session execution; no public CLI command is required. A direct request exercises name/reference resolution, invalid/missing/ambiguous subjects, operation execution, construction, existing Presentation and reporting. A second fixture Lens consumes the same operation to prove reuse independent of Lens identity. |

This leaves an ordinary interpretive addition close to a prompt plus a declaration: no per-Lens changes to common lookup, investigator loops, acceptance, retention, worker publication or rendering. The one-time removal of existing hard-coded assumptions is part of this plan, not a cost silently assigned to each subsequent author. Verify meaningful prompt/method changes do not reuse incompatible work and that simple new consumption preserves original provenance. Introducing a genuinely different evidence or acceptance contract would be a different, larger kind of addition.

#### Mechanical addition: module exports

| Local integration point | Concrete addition after shared preparation |
| --- | --- |
| Lens declaration | Define a non-public question selecting exports of one module, using shared module designation/applicability and no semantic parameters. Declare the existing export-information requirement, plus any standard detail expansion requested by its Presentation. |
| Evaluation | Obtain the already supported export information through existing Evaluation/provider paths. No new analyzer, evidence-acquisition mechanism or interpretation is required. |
| Qualified construction | Add a local constructor selecting export claims and their support/limitations from established module content, using the export structures in `module-content.ts`. Preserve unavailable, partial and established-empty distinctions. Declare a qualified module-exports contract; do not manufacture inspection merely to copy its selection or mislabel an export subset as complete module detail. |
| Presentation | Add a small exports Presentation using existing export/documentation formatting. Its declaration accepts the exports contract and specifies its options/standard expansions. This concrete route avoids forcing the existing inventory/inspection contract to mean a narrower answer. A compatible reuse or modification is also acceptable if implementation demonstrates that its existing uses remain valid. |
| Entry and verification | Include the Lens and Presentation in the bounded fixture catalogs before Session execution and exercise a direct Session request. Normalization, resolution, attribution, worker delivery and observations require no exports-name branch. Verify empty/partial/unavailable exports and that dependency selection still creates no unused inspection answer. |

Mechanical additions may need capability-specific code for their question and content. Locality means that this code belongs in the declaration, constructor and suitable Presentation, with a small explicit registration point. It does not mean every addition fits a table row or must reuse an unsuitable renderer. Together the examples test both shared interpretation Presentation compatibility and the ability to add an explicit new result/Presentation pairing without changing common coordination.

## Existing capability coverage

| Capability | Behavior to preserve or correct |
| --- | --- |
| Module inventory | Configured-project subject, qualified population and valid empty answer. |
| Project/repository organization | Distinct scoped populations, groups and qualifications; legitimate embedded module detail. |
| Dependency structure | Configured-project structure, opaque endpoints and coverage distinctions. |
| Module/group/mixed inspection | All established exact matches, including mixed matches; accompanying lookup qualification and associated interpretation selection. No arbitrary single-match choice. |
| Dependency children/parents | Direct module subjects, including opaque external modules. Bound group/investigram references are unsupported, not unknown; preserve those bindings for later inspection. |
| Module summary | Exactly one module; missing or ambiguous selection invokes no requested interpretation. A bound investigram is unsupported, not unknown. |
| Explain/decompose/examine | One exact investigram. Bound program subjects are unsupported, not unknown; unknown or missing investigram targets remain distinguishable. |
| Exact investigram inspection | Original target and frozen correction selection, with no generation of a missing interpretation. |
| Usage | Subjectless reporting through shared request/publication infrastructure, outside Lens semantics. |

Apply this coverage to direct Session calls and existing CLI modes, names/handles/precise references where supported, and default/configured-project/repository designation where relevant. Preserve qualified failure/refusal cases as well as successful Views.

## Milestones and verification

### M1 — Establish definitions and the bounded request trace

Inventory every current command/API path and affected identity/schema/retention assertion. Implement normalized Lens/reporting definitions, applicability/parameter validation and request context. Confirm the assessed field ownership and implement its bounded request-context seams before broader record changes. Exercise the concrete extension declarations above early enough to reveal remaining common-path coupling. Bring architectural awkwardness or an undermining dependency back to the human rather than conceal it behind exceptions.

Exit evidence: the capability inventory below exercised through definitions; direct parameter-rejection and applicability tests; documented request-to-Evaluation/publication ownership; concrete extension change lists. No unused registry counted as completion.

### M2 — Resolve subjects and produce qualified application outcomes

Introduce shared qualified resolution and read-only bound-reference lookup. Route module, organization, dependency and investigation requests through it, preserving collection/single-subject differences. Remove F4's inspection side effect. Implement the outcome/retention cases with explicit request-scoped prerequisite attribution and bounded non-View publication so unresolved paths can be exercised end to end.

Exit evidence: F2 bind-group → inspect → children/parents refusal → inspect again; bound compatible targets omitted from the supplied population; unknown and reserved-looking references; multiple matches; incomplete/unavailable lookup; direct retained-candidate follow-up with observations disabled; no invocation of the requested interpretation for missing/ambiguous or unsupported subjects. Any authorized prerequisite work remains separately accounted for, including when it cannot settle the parent application.

### M3 — Separate immutable answers from request reporting

Update all four families' retained payloads, identity inputs/methods, descriptors, validation and comparison policies. Preserve valid failed/unavailable selections and frozen revision/association content. Complete usage descriptor removal and publication changes, including parent finalization, observation-envelope version 2 and non-View delivery failures. Attribute current requests directly in observations.

Exit evidence: four worked identity examples; equal effective answers share IDs and resubmit consistently; meaningful support differences remain distinct; F1 publication coverage across every Lens identity and supported designation mode; F3 parameter separation; request-specific rendered context does not alter shared answer identity. Confirm reuse/usage behavior is preserved across name/ref and another consuming Lens.

### M4 — Exercise compatibility and extensions across the toolbox

Route every current program View through the result/Presentation contracts. Complete both extension fixtures and remove obsolete duplicated dispatch policy that the exercised definitions replace. Validate preserved embedded/associated results, incompatible choices and materialized-precondition failure results with retained answer references, standard expansions and boundary invariant checks. Complete user-facing documentation and relevant descriptive architecture/conventions, without making implementation claims before they are verified.

Exit evidence: each existing command in one-shot and shell modes, direct Session calls, Unicode/JSON, source detail and existing pagination; stable reference collisions; interpretation acceptance/failure/retry, correction snapshots, cancellation and usage finalization; all publication and qualification checks below. No family may bypass the model at completion.

### Verification obligations

Use independently stated expected behaviors, real fixture providers and the existing investigator double. Reuse `test/investigation-integration.test.ts`, `investigation-selection.test.ts`, `projection-content.test.ts`, dependency tests, Session comparison and observation-publication tests where appropriate. Verify:

- Resolution distinguishes missing, unknown, unsupported, ambiguous, incomplete/unavailable lookup, valid empty and valid-but-failed applications; invariant violations remain defects.
- Returned candidates, criteria and support survive command completion/observation failure and later accumulation without fresh resolution; references expire honestly.
- Exercise an external-module reference exposed by dependency output in subsequent `inspect` and `summarize` requests, preserving actual subject applicability, support and limitations. The current TypeScript provider retains external candidates in its shared module population (`typescript/project.ts`), so being outside the project-owned dependency graph does not by itself establish absence from the supplied module evaluation. Separately, use a controlled same-Session fixture with an established bound module and a narrower or partial supplied evaluation that omits it. Verify the compatible target remains resolved and gets a retained qualified partial/unavailable answer without invented membership; an actually incompatible Lens still returns an unsupported resolution result. Exercise the equivalent known-target/materialization distinction for the other applicable families.
- Exercise Presentation failure both before Evaluation (no compatible choice) and after construction (a materialized precondition fails with no permitted fallback). Verify a resolution result identifies the presentation reason, preserves references to any already retained answer and fabricates no View. Allowed partial content remains an ordinary qualified result; malformed content remains a defect. Also verify a permitted fallback preserves explicit choices and reports consequential changes.
- Through the actual worker/parent publication and observation sink path, verify `formatVersion: 2`, normalized requests and actual outcomes for Views, usage reports and resolution results. Usage and resolution results emit no view-produced event; an actual View still does. Preserve output/usage and delivery-failure behavior.
- Verify valid precise-reference requests retain population allocation order and collision behavior after read-only classification. Unsuccessful requests allocate only for actual prerequisites/candidate delivery, with the permitted effect on later compact spellings explicitly reflected in expectations. Existing bound references never change.
- Interpretation reuse adds no inference calls/usage for compatible completed work, including another consuming Lens; incompatible work and retryable failures behave correctly.
- Resolution prerequisites and evidence acquisition carry initiator, parent/trigger, constraints, results and qualifications through success/failure/publication without rewriting reused provenance or authorizing work after cancellation.
- Arrangement has no store/lookup/Evaluation access; genuine embedded/associated content is preserved. Source escaping and captured-source disclosure remain correctly classified; generated-output exclusions remain enforced.
- Parent-side usage finalization is independent of acceptance and result kind; repeated finalization does not lose presentation inputs or recursively hash finalized IDs. Sink failure does not erase a result. Input checks, no late publication and cleanup reporting remain intact.
- Equivalent-run comparisons normalize only known references, preserving literal evidence, qualification, omissions, order, repeated reference markers and meaningful differences.

Run focused checks during each slice, then `npm run check` and `npm test` for the completed implementation. Investigate failures against known backlog items rather than suppressing them or claiming unsupported conformance.

## Risks, uncertainties and decision ownership

The source assessment bounds the work; it is not an implementation proof. No remaining design choice is intentionally deferred that would change the accepted outcome contract. The following checks have explicit owners and decision points:

| Risk or uncertainty | Owner and resolution point |
| --- | --- |
| Providers expose qualified outcomes but do not uniformly report actual establishment versus consumption. Attribution must reflect real work, including acquired-but-undelivered evidence and interrupted requests. | Implementer confirms the five assessed boundaries in M1 and verifies them end to end in M2/M3. Encoding/hook choices are delegated; a need for a general investigation/history facility returns to the human before scope expansion. |
| Removing designation from four families can collide with immutable payload fields or lose consequential displayed context. | Implementer audits retained inputs and versions responsible methods in M3; family-specific identity, resubmission and qualification tests are exit evidence. Any proposed weakening of identity or retention requires human agreement before implementation. |
| Result alternatives affect parent rendering, usage finalization and failure delivery. | Implementer verifies bounded non-View delivery in M2/M3. A general report framework is outside scope and requires a separate human decision if the bounded approach proves insufficient. |
| Existing hard-coded operation context and Presentation dispatch can obstruct the extension approach. | Implementer exercises the two concrete walkthroughs in M1 and demonstrates them in M4. If ordinary interpretive additions still require common-path Lens branches or a new Presentation, return the design problem to the human before declaring extensibility complete. |
| Canonical documents or implementation may change after this assessment. | Implementer reconciles the baseline at task initiation; bring consequential architectural conflicts or new dependencies to the human before relying on stale assumptions. |

## Implementation choices and scope changes

Exact type/module names, declaration syntax, registration mechanics and bounded CLI output layout remain delegated within the governing contracts. The first implementation trace can reveal a need for a further scope decision; it cannot silently enlarge this plan.

Update implemented capability/status documentation during implementation after verifying the behavior it describes. No foundation or development-process change is included in this work.
