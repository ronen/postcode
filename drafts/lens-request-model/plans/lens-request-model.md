# Explicit Lenses and qualified request resolution

Status: in preparation
Created: 2026-10-11
Updated: 2026-10-11

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

Keep F2 within this coherent work, using the selected request-outcome contract. Milestones may stage integration, but completion requires every existing capability to use the model.

## Decisions and governing dependencies

This plan implements the contracts in [Lens application and request outcomes](../decisions/lens-application-and-request-outcomes.md) and [Experimental structured outputs during early development](../decisions/experimental-structured-outputs.md).

These decisions change specific unsuccessful-selection retention, designation-bearing identity, usage-descriptor and schema-preservation provisions of [qualified construction](../decisions/qualified-projection-construction.md). Its arrangement isolation, binding-only capability, frozen revision selections, atomic retention, usage finalization and source-disclosure obligations continue.

Preserve the [operation separation](../decisions/investigation-operations-and-lenses.md), [evaluation outcome/retry rules](../decisions/investigator-execution-and-evidence-access.md#evaluation-outcomes-and-later-requests), [execution ownership](../decisions/execution-ownership-and-cancellation.md), and [coordinated-Views contracts](../decisions/coordinated-views-and-qualified-results.md). Existing associated/embedded results remain valid; coordination of independent answers belongs to Presentation, while synthesis of another qualified answer belongs to a Lens.

Usage and resolution results share delivery dependencies without requiring the same record shape or lifetime. Answer identity depends on separating request provenance from immutable answer payloads; it is independent of the physical reuse mechanism. The retention and output contracts determine which result alternatives publication must support.

## Current implementation assessment

Baseline: `c7fb80f`. This is focused source and existing-test inspection, not new runtime verification or a complete architecture-conformance audit. Recheck affected paths if the implementation changes before work starts.

| Path inspected | Established dependency and bounded treatment |
| --- | --- |
| `src/lib/session.ts`, family Projection constructors | Dispatch selects subjects inline and duplicates Lens-to-operation mapping. Module, organization and dependency payloads contain selectors/reference flags; investigation selections also retain designation. Route all capabilities through normalization/resolution while keeping family-specific construction. |
| `src/lib/dependencies/projections.ts` | Calls module `inspect` for matching. Replace that dependency with shared qualified selection, preserving direct relationship direction, owner population, opaque subjects, non-edge requests and coverage. |
| `src/lib/memory-store.ts`, `src/lib/investigation/selection-record.ts` | Binding allocation and immutable record validation constrain changes. Add narrow read access to established bindings rather than allocate arbitrary populations to classify a target. Existing investigation selections support children/parents and module/group/investigram subjects; a group refusal has a possible retained route if the chosen no-Projection contract is later declined. Its renderer currently assumes a program-subject refusal means an investigram-only Lens, so that route would require adaptation. |
| `src/lib/investigation/evaluation.ts`, `contracts.ts`, `execute.ts` | Reuse already compares operation/subject/parameters independently of Lens and designation. Execution still hard-codes operation objectives and module-versus-investigram applicability. Extension needs an operation definition with appropriate initial context, not merely another prompt string. |
| `src/lib/observations.ts`, `command-execution.ts` | View publication reconstructs the request from its descriptor. Command observations already support no-View failures/refusals. Extend that existing path with actual normalized requests and resolution outcomes rather than invent a general report system. |
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

At the first implementation milestone, verify the field-level trace for these paths and size the changes before broad record edits. If additional conformance work requires general historical basis export, autonomous policies, a new history store, or other substantial scope, stop that part for human review. Keep independently useful gaps in the backlog; do not defer a dependency and nevertheless claim this request model's attribution contract is fulfilled. Session-local support references do not by themselves close the separately known post-Session observation-basis gap.

## Request and result design

### Explicit capability definitions

Use a small typed set of Lens definitions and a separate CLI spelling map. The normalized vocabulary retains `modules`, `organization`, `inspect`, `summarize`, `explain`, `decompose`, `examine`, and uses `dependency-structure`, `dependency-children`, `dependency-parents` for the existing dependency questions. CLI commands remain unchanged. Organization over a configured project versus repository is one question with distinct subjects, not a subject choice encoded as a Lens parameter.

Each definition exposes the conceptual information need, subject/parameter applicability and cardinality, normalization/validation, requirements and the prospective qualified result contract. Current public Lenses have no semantic parameters; reject undeclared values at the direct API boundary. Do not import renderers to discover Lens meaning. Keep invocation/execution constraints separate from operation meaning.

One `inspect` identity covers module, group, existing mixed module/group and exact-investigram inspection. Use thin subject-specific implementations with their own requirements and result contracts. This does not introduce arbitrary mixtures of investigram and program subjects or change exact-original inspection into current-replacement lookup. Dependency children/parents retain their dependency meaning; group containment is not an alternative implementation of that question.

### Coordination and selection

Keep designation, resolved subject(s), Lens parameters, session-bound program-input context, actual captured support, Presentation choices and execution constraints identifiable. Normalize defaults/aliases before validation and retain the choices actually made.

Resolution consumes a qualified population supplied by analysis/Evaluation/core construction. It can run before a Lens is chosen, but when one is selected, narrow name matching to its applicable subjects and check cardinality. The Lens implementation receives valid inputs; its defensive validation exposes invariant failures, not ordinary human-request refusals. Name resolution ordering belongs to coordination.

Resolve a precise reference to its actual bound target before applicability checking. Unknown binding, known incompatible target, and known compatible target missing from the supplied evaluation population are different outcomes. Read-only reverse binding lookup must not allocate references or infer existence from a prefix. Preserve established valid-request allocation schedules, collisions, reserved-looking literal names and binding-only arrangement access.

Share equivalent module/name matching without conflating inspect's collection cardinality with summary's single-subject requirement. Dependency construction consumes the resolved selection without retaining an unused inspect Projection. Qualified population results genuinely consumed for resolution and existing organization-embedded module detail or associated inspection remain legitimate.

### Outcome and retention cases

An unsettled planning outcome is delivered as a self-contained resolution result, not a second independently stored artifact. Its request, candidates, reason, criteria, qualifications, prerequisite work and available follow-up references remain usable after execution finishes without observations or fresh lookup.

| Case | Result and retention |
| --- | --- |
| Name/ref cannot establish subjects; ambiguity for a single-subject Lens; invalid parameters; precise incompatible target | Resolution result; no Projection for the requested application. Preserve any prerequisite results separately. |
| `inspect foo` has several applicable matches | Settled collection application, with all established matches and lookup qualification. |
| Valid inventory/organization/dependency population is empty | Qualified answer for that population, including relevant completeness; not failed name resolution. |
| Bound applicable subject has partial or unavailable supporting analysis | Preserve known subject and scope; qualified answer/outcome under the family's valid-application rules. Do not turn lack of materialization into an unknown binding. |
| Valid interpretive application yields accepted, limited or failed retained Evaluation | Retained selection and its immutable interpretation/revision support under existing rules. |
| Configuration/communication unavailability after a valid application is settled | Retained unavailable selection with immutable kind/code/diagnostic; no reusable Evaluation, so later retry remains possible. |
| Exact investigram exists / does not exist | Preserve exact-original retained inspection when present; resolution result when missing. |
| Associated inspection finds no associated interpretation | Preserve its legitimate mechanical basis and empty frozen association selection. |
| Usage | Subjectless report, without program Lens, Projection or compatibility descriptor. |

No current CLI command can redisplay an unsuccessful selection by Projection ID. The new contract requires sufficient returned data and emitted text/JSON, not a shell-side outcome store or independent Session lookup of a resolution result. GUI callers can retain candidates and select one or several for follow-up; prove that through an interface-independent test without implementing the GUI or new CLI list syntax. Candidate references remain subject to Session validity; one-shot references expire at command completion. Later Session accumulation must not silently change the returned candidate list.

Execution-limit stops and investigation failures retain reusable evaluations; configuration/communication failures do not. Interrupted/invalidation outcomes end the Session under current execution rules and do not create reusable interrupted evaluations. Acquired mechanical evidence follows its own retention rules. Do not accept unfinished interpretation or conflate no-account results with planning failure.

### Answer identity and resolution context

Give the same effective qualified answer the same Projection identity regardless of name, handle, reference or incidental lookup route. Effective inputs include resolved subjects/roles/order, Lens, normalized parameters, selected information, captured supporting basis/methods/outcomes, qualifications and interpretation/correction/association snapshots. Same displayed prose or entity list is insufficient. Full retained payload consistency remains mandatory: remove invocation-specific fields from immutable answer payloads before sharing identity.

The four family checks are:

- Module: `inspect foo` finds A/B under incomplete lookup coverage. Resolution preserves that other matches may be unknown; the answer describes established A/B with their detail support. Exact selection of A/B may share that answer. It must not imply exhaustive matching, and any population-coverage claim in an answer remains an identity input.
- Organization: matching G/M preserves both kinds and legitimate embedded module detail. Repository and configured-project populations remain distinct even if their current lists coincide.
- Dependency: name/ref selection of M can share an answer with identical relationship direction, dependency support, opaque endpoints and coverage. Group refusal creates no dependency answer.
- Investigation: summary by name/ref can reuse one operation outcome and share the same answer snapshot. Changed corrections/associations can change a Projection without new inference; exact-original and associated-inspection semantics remain distinct.

Supply resolution context alongside answer content where output needs “two exact matches,” reference status or lookup coverage. Arrangement may use that context but cannot rerun lookup. Consequential displayed differences belong to the affected arrangement/report identity, not the shared answer. No universal View identity formula is introduced. Version affected identity methods, preserve explicit reference normalization and frozen revision snapshots, and verify identical resubmission without conflicting stored payloads.

Logical repeatability does not mandate Projection memoization or physical deduplication. Future annotations motivate predictable referents but add no annotation, persistence or cross-session continuity requirements here.

### Reporting and publication

Carry the normalized request and actual resolution/application outcome from execution to publication. Usage and resolution reports are non-View outputs; existing program answers use their appropriate View contracts. Adapt the current worker result alternatives, parent rendering/finalization and observation publication only as needed. Exact type names and JSON layouts are implementation choices within these contracts.

Observations record the requested Lens, designation, actual parameters, consequential choices, produced result and outcome independently. No catch-all inventory description, fabricated View or view-produced event for a refusal/report. Preserve actual stdout/stderr, source-disclosure classification, usage even without accepted interpretation, sink-failure warnings, command failure distinctions and cancellation/cleanup behavior. Delivery failure must not invalidate an otherwise delivered result.

If minimal non-View support turns into a general reporting architecture, return the coupled retention/usage change for human scope review. Existing schema labels remain experimental identifiers under the output decision; update tests/docs intentionally without adding migration infrastructure.

### Result/Presentation contracts

Declare the existing module, organization/mixed, dependency and investigation/associated content contracts through their actual types and semantic guarantees. A shared `inspect` identity can expose different contracts by subject. A generic graph shape is not sufficient to make containment compatible with dependency rendering.

Use the existing family arrangements with their supported Unicode/JSON and source/page options as bounded catalog choices. Declare accepted content, partial/unavailable cases, preconditions and standard expansions. Planning uses compatibility to honor explicit choices or an explicit default; where there is only one suitable arrangement no ranking engine is needed. F5's general options redesign remains deferred.

Select standard expansions before Evaluation. Check actual content at the construction/arrangement boundary. A missing compatible Presentation is a View-planning outcome, not Lens inapplicability; retain any qualified answer already produced before that failure. Any revised choice requiring further information returns through coordination; rendering never acquires it. Compatibility must be exercised by every existing program View path, not maintained as unused metadata. Bounded handling of the current families does not make one contributing Projection a permanent architectural limit.

### Reuse and extension walkthroughs

Minimize incurred interpretation costs: the same completed interpretation is not performed twice within the supported Session compatibility/validity contract. This reaffirms existing operation reuse; verify before replacing mechanisms. Newly accumulated evidence does not by itself invalidate compatible retained work. Preserve original provenance and current consumption attribution. Invocation IDs, consuming Lens or lookup spelling must not fragment reuse; materially different work must not be conflated. Repeated failed attempts follow existing retention/retry rules.

Exercise two non-public additions:

1. A module “risks” Lens using existing investigram/evidence contracts. A local declaration supplies Lens meaning, applicability/parameters, and a prompt/objective with operation metadata/default context. It may declare both the Lens and its default operation without duplicating metadata, but internal requirements and reusable operation identity remain separate. Also exercise a second consuming Lens requesting the same compatible operation.
2. A mechanical Lens selecting established module exports. Declare the export-information requirement and construct a qualified subset with omissions/coverage. Use shared resolution, reporting and existing presentation support where suitable; do not construct inspection merely to copy selection.

For each, record the exact declaration, registration, construction and Presentation changes and why they belong to the capability. Common applicability, execution, acceptance, retention and reporting must not need another Lens-name conditional. A small explicit registration/CLI exposure point is acceptable. Reuse a suitable Presentation, modify it compatibly and verify prior uses, or add one; new semantics may require any responsibility-appropriate code. Neither example authorizes a new public capability or a plugin framework. Use existing fixtures and controlled investigator doubles, not paid inference, for integration evidence.

## Milestones and verification

### M1 — Establish definitions and the bounded request trace

Inventory every current command/API path and affected identity/schema/retention assertion. Implement normalized Lens/reporting definitions, applicability/parameter validation and request context. Complete the field-level attribution trace above and confirm bounded remediation before broader changes. Exercise the two extension declarations early enough to reveal common-path coupling. Bring architectural awkwardness or an undermining dependency back to the human rather than conceal it behind exceptions.

Exit evidence: exhaustive capability inventory; direct parameter-rejection and applicability tests; documented request-to-Evaluation/publication ownership; concrete extension change lists. No unused registry counted as completion.

### M2 — Resolve subjects and produce qualified application outcomes

Introduce shared qualified resolution and read-only bound-reference lookup. Route module, organization, dependency and investigation requests through it, preserving collection/single-subject differences. Remove F4's inspection side effect. Implement the outcome/retention cases with explicit request-scoped prerequisite attribution and bounded non-View publication so unresolved paths can be exercised end to end.

Exit evidence: F2 bind-group → inspect → children/parents refusal → inspect again; unknown and reserved-looking references; multiple matches; incomplete/unavailable lookup; direct retained-candidate follow-up with observations disabled; no invocation of the requested interpretation for missing/ambiguous or unsupported subjects. Any authorized prerequisite work remains separately accounted for, including when it cannot settle the parent application.

### M3 — Separate immutable answers from request reporting

Update all four families' retained payloads, identity inputs/methods, descriptors, validation and comparison policies. Preserve valid failed/unavailable selections and frozen revision/association content. Complete usage descriptor removal and publication changes, including parent finalization and non-View delivery failures. Attribute current requests directly in observations.

Exit evidence: four worked identity examples; equal effective answers share IDs and resubmit consistently; meaningful support differences remain distinct; F1 publication coverage across all capabilities; F3 parameter separation; request-specific rendered context does not alter shared answer identity. Confirm reuse/usage behavior is preserved across name/ref and another consuming Lens.

### M4 — Exercise compatibility and extensions across the toolbox

Route every current program View through the result/Presentation contracts. Complete both extension fixtures and remove obsolete duplicated dispatch policy that the exercised definitions replace. Validate preserved embedded/associated results, incompatible choices, standard expansions and boundary invariant checks. Complete user-facing documentation and relevant descriptive architecture/conventions, without making implementation claims before they are verified.

Exit evidence: each existing command in one-shot and shell modes, direct Session calls, Unicode/JSON, source detail and existing pagination; stable reference collisions; interpretation acceptance/failure/retry, correction snapshots, cancellation and usage finalization; all publication and qualification checks below. No family may bypass the model at completion.

### Verification obligations

Use independently stated expected behaviors, real fixture providers and the existing investigator double. Reuse `test/investigation-integration.test.ts`, `investigation-selection.test.ts`, `projection-content.test.ts`, dependency tests, Session comparison and observation-publication tests where appropriate. Verify:

- Resolution distinguishes missing, unknown, unsupported, ambiguous, incomplete/unavailable lookup, valid empty and valid-but-failed applications; invariant violations remain defects.
- Returned candidates, criteria and support survive command completion/observation failure and later accumulation without fresh resolution; references expire honestly.
- Interpretation reuse adds no inference calls/usage for compatible completed work, including another consuming Lens; incompatible work and retryable failures behave correctly.
- Resolution prerequisites and evidence acquisition carry initiator, parent/trigger, constraints, results and qualifications through success/failure/publication without rewriting reused provenance or authorizing work after cancellation.
- Arrangement has no store/lookup/Evaluation access; genuine embedded/associated content is preserved. Source escaping and captured-source disclosure remain correctly classified; generated-output exclusions remain enforced.
- Parent-side usage finalization is independent of acceptance and result kind; repeated finalization does not lose presentation inputs or recursively hash finalized IDs. Sink failure does not erase a result. Input checks, no late publication and cleanup reporting remain intact.
- Equivalent-run comparisons normalize only known references, preserving literal evidence, qualification, omissions, order, repeated reference markers and meaningful differences.

Run focused checks during each slice, then `npm run check` and `npm test` for the completed implementation. Investigate failures against known backlog items rather than suppressing them or claiming unsupported conformance.

## Implementation choices and scope changes

Exact type/module names, declaration syntax, registration mechanics and bounded CLI output layout remain delegated within the governing contracts. The first implementation trace can reveal a need for a further scope decision; it cannot silently enlarge this plan.

Update implemented capability/status documentation during implementation after verifying the behavior it describes. No foundation or development-process change is included in this work.
