# Exact retained-answer presentation

Status: in preparation
Created: 2026-10-14
Updated: 2026-10-14
Superseded by:

## Problem and intended outcome

A human inspects an answer, conducts another investigation that introduces a correction, then asks for the next page of the earlier answer. Today the page request selects again from current Session history. Page two can consequently belong to a different qualified answer. Repeating a command in another format has the same risk. A changed Projection ID in JSON does not adequately disclose that behavior.

Support a request that presents an exact retained Projection with new presentation inputs. Preserve its captured basis, selected interpretations, correction and association state, qualifications, relevant evaluation outcomes and supporting references. Keep that operation distinct from asking the Lens again, even when a new request uses the same captured program inputs or reuses a completed operation.

This work delivers continuity within the supported transient Session. It does not promise byte-identical output, current interpretation status, permanent availability or continuity across process restarts.

<a id="review-choices"></a>
## Review choices

This package remains non-governing. Resolve the following choices with the human before promotion; the approach below develops the recommendations so their consequences can be reviewed.

| Choice | Recommendation | Alternative and consequence |
| --- | --- | --- |
| Q1: existing paging syntax | [Needs review] Add shell present and move --after and --revision-page to it. Reject those flags on fresh Lens requests with guidance to present an answer reference. | Preserve old syntax as explicit reselection. This needs conspicuous refresh semantics and consequential-change disclosure; a JSON ID or generic warning does not cure F6. Implicitly looking up the last matching request creates additional history and ambiguity policy. |
| Q2: invalidated Sessions | [Needs review] Keep current Session validity/publication checks and shutdown behavior. | Historical presentation after invalidation is valuable and conceptually compatible with immutable answers, but requires separating readable retention from investigation cancellation and shell shutdown. Scope and lifecycle decisions must be revised before including it. |
| Q3: human-facing answer references | [Needs review] Expose a distinct, stable, Session-local compact answer reference alongside the precise Projection ID. The API accepts the precise ID; CLI accepts both. | Raw IDs alone are smaller to implement but cumbersome in human paging. An implicit last-answer alias adds mutable targeting and is not part of this recommendation. |

The command spelling present is a concrete review proposal. Exact internal names and output layout are delegated after the behavioral choices are accepted. Other consequential recommendations, including outcome/report separation, the observation version and default handling below, are part of the decision package for approval rather than implementation assumptions.

## Implementation assessment

Assessment baseline: 296190615e60872bd8db6bf9a40334ca7787a3ed, with main and freshly fetched origin/main equal on 2026-10-14. The [Lens request-model plan](lens-request-model.md) is completed. Its older source assessment describes its own starting point, not current code.

This assessment reads source, current descriptive documentation and existing tests. No application tests or runtime reproduction were executed during this planning assessment. Existing assertions are evidence of intended coverage, not a claim that they were freshly verified.

| Current path | Finding and consequence |
| --- | --- |
| [requests.ts](../../src/lib/requests.ts), [session.ts](../../src/lib/session.ts) | ViewRequest describes Lens/report requests; normalization has no retained-presentation alternative. execute validates the Session, resolves subjects, plans expansions, evaluates as needed and constructs/selects an answer. Reuse of work does not bypass selection. |
| [presentation-contracts.ts](../../src/lib/presentation-contracts.ts) | Explicit static contracts already declare formats, source support, association/revision paging, requirements and completeness preconditions. Prospective compatibility currently depends on a Lens request and Lens definition. Retained compatibility must instead inspect the supplied answer's meaning and materialization. |
| [investigation/selection.ts](../../src/lib/investigation/selection.ts), [selection-record.ts](../../src/lib/investigation/selection-record.ts), [content.ts](../../src/lib/investigation/content.ts) | Selection records retain complete unpaged revision snapshots, original-to-selected relations, displaced accounts, navigation, associations and semantic outcomes. Resolution follows fixed references. It does not have to consult later history. Keep this representation. |
| [investigation/associations.ts](../../src/lib/investigation/associations.ts) | createAssociatedInspectionView selects associations anew. The retained associated-inspection variant names its mechanical Projection. The resulting View exposes the composite ID with mechanical descriptor fields. Redisplay must recover that exact variant and mechanical basis, not call this selecting wrapper. |
| [module-content.ts](../../src/lib/module-content.ts), [organization/content.ts](../../src/lib/organization/content.ts), [dependencies/content.ts](../../src/lib/dependencies/content.ts) | Family resolvers already expose qualified immutable content and supporting outcomes. Mechanical construction and expansion planning are separate responsibilities; retained presentation can resolve fixed support without invoking constructors. |
| [program-presentation.ts](../../src/lib/program-presentation.ts), family presentation modules, [reference-binding.ts](../../src/lib/reference-binding.ts) | Existing arrangements consume supplied content and coordinated references. Some convenience wrappers still combine store-based coordination and selection. The investigation arranger already takes a restricted binding port. Extract/reuse only the coordination needed for exact content; do not expose store lookup to arrangers. |
| [investigation/presentation.ts](../../src/lib/investigation/presentation.ts) | Arrangement mixes retained semantic outcomes with current attempt/reuse/provider reporting. Passing null reporting currently also makes the displayed result null. Retained failed/unavailable selections must remain intelligible without fabricating another attempt. Associated listing text also describes revision status as current; qualify it as selected for this answer. |
| [commands.ts](../../src/lib/commands.ts), [shell.ts](../../src/lib/shell.ts) | Paging is currently permitted on shell inspection commands. No answer target or redisplay command exists. Generated continuation guidance currently encourages the reselection path. |
| [command-execution.ts](../../src/lib/command-execution.ts), [session-protocol.ts](../../src/lib/session-protocol.ts), [interactive-session.ts](../../src/lib/interactive-session.ts), [observations.ts](../../src/lib/observations.ts) | Direct/worker publication already transports explicit View/report alternatives, normalized requests, usage, request work and observations. Extend those paths together. Parent usage finalization must remain self-sufficient and cannot reselect. |
| [answer-identity.ts](../../src/lib/answer-identity.ts), [memory-store.ts](../../src/lib/memory-store.ts) | Retained answer keys exclude designation and presentation inputs; insertion enforces immutable payload consistency. Subject compact bindings cover modules, groups and investigrams. Projection references need their own target category, not promotion to program entities. |
| [investigation-selection.test.ts](../../test/investigation-selection.test.ts) | Existing cases reconstruct old content after corrections, associations and inconsistencies with enumeration/lookup disabled; exercise full unpaged support and presentation-only identity differences. They do not provide a public retained-presentation operation. |

The [architecture overview](../architecture/README.md), [investigation architecture](../architecture/investigation.md), [capability reference](../capability-reference.md) and [CLI reference](../cli-reference.md) acknowledge the F6 limitation. [STATUS.md](../../STATUS.md) also uses “redisplay” for current replacement selection. Update that terminology during implementation: fresh reselection and exact presentation must no longer share that ambiguous description.

## Governing dependencies and document impact

The [application specification](../app-specification.md), [core concepts](../core-concepts.md) and [architectural constraints](../architectural-constraints.md) already require presentation continuity and distinguish captured basis from interpretation selection. The [coordinated-Views decision](../decisions/coordinated-views-and-qualified-results.md), [qualified construction](../decisions/qualified-construction-under-the-request-model.md), [Lens request outcomes](../decisions/lens-application-and-request-outcomes.md), [transient Sessions](../decisions/transient-analysis-sessions.md), [investigram decisions](../decisions/investigrams-and-progressive-investigation.md) and [reference lifetime disclosure](../decisions/reference-lifetime-disclosure.md) remain governing.

The accompanying [decision](../decisions/exact-retained-answer-presentation.md) specifies the new bounded request, reference and reporting contract. No definition of Projection, Presentation, View or pinned input needs replacement. No foundation or application-specification revision is needed for the recommended scope. The package includes a narrow architectural-constraint addition to make the supported retained-request boundary directly usable; its decision provenance is the companion record. If Q2 changes, reassess governing and lifecycle documents before promotion.

The accompanying backlog revision transfers F6 into this plan and preserve the unresolved portion of F5. Adoption does not establish implemented conformance. During promotion, replace live F6 backlog links with this plan while retaining truthful current-limit statements. Do not rewrite historical decisions, audits or concluded records. Their references remain interpretable against their historical baselines.

## Scope

Cover all production families: module inventory, module/group/mixed inspection, project/repository organization, dependency structure/children/parents, operation-result investigation and exact-investigram inspection. Associated inspection remains one retained composite answer with its supporting mechanical result; it is not converted into arbitrary multi-Projection composition.

Exercise the internal module-exports and shared interpretation extension fixtures through the common path. This preserves the completed request model's extension boundary without making those Lenses public.

Include the direct Session request, worker transport, shell syntax/help, all affected text/JSON descriptors, supported Presentation inputs, reference binding, refusal reporting, usage finalization, source-disclosure observations, focused verification and capability/status/architecture documentation.

Exclude general GUI Presentation design, a public Presentation/plugin registry, arbitrary multi-Projection Views, new Lenses, new sorting/filtering/depth controls, replay of original requests from answer references, live refresh, pinned/following controls, multi-state analysis, persistence, eviction, observation readback, full captured-basis export and general View-origin history.

## Request and CLI behavior

### Exact presentation

Introduce a discriminated request alternative whose meaning is “present this retained Projection.” Its inputs are an exact answer target and presentation inputs/context. It contains no subject designation, Lens parameters, operation request or input-binding change. Reject mixed request forms and malformed presentation values at the boundary rather than ignoring them; retain the existing safe request-capture and terminal-escaping behavior. Do not overload inspect, invent a present Lens, or interpret an answer reference as its subject.

The direct Session boundary accepts a precise Projection ID. Validate that the target is retained in this Session and belongs to a supported answer kind. A retained answer may be empty, partial, unavailable or contain an earlier failed evaluation. An unknown target, foreign Session, wrong record kind or incompatible Presentation returns a qualified non-View refusal, not a replacement answer. Do not claim an unknown ID was previously retained and expired without evidence. Broken retained support is an internal defect, not ordinary unavailability.

The shell surface, subject to Q1/Q3, is:

~~~text
present @answer-… --json
present @answer-… --after @investigram-…
present @answer-… --revision-page 2
present @answer-… --source-detail
~~~

Each produced answer exposes its precise ID and, if Q3 is accepted, its compact answer reference in both human and structured output. Resolution results naming already-retained answers expose usable targets too. No history command or implicit “last” target is required. A display failure does not revoke an already-retained answer.

One-shot present is rejected before opening an unrelated Session. One-shot outputs still identify their answer but explicitly disclose that references expire at command end. The reference-lifetime notice covers every family touched by the new output, not just investigrams. It offers no cross-process reconstruction.

A presentation request supplies a complete effective presentation choice after normal defaults: omitted paging starts at page one/no continuation; source detail defaults off; format follows the supported interface default. It does not inherit a previous View's options, because a Projection can have many Views. Effective choices are inspectable. Existing format-specific bounds remain; no new all-content/export mode is implied.

### Fresh selection and navigation

Existing Lens commands remain independently requested fresh selections. The text/JSON output distinguishes “Fresh answer selection” from “Retained answer; selection unchanged.” Reuse may mean that fresh selection returns the same Projection ID and incurs no inference. Never imply that a new selection necessarily acquired new program evidence or regenerated interpretation.

Do not add a refresh command that reconstructs a request from a Projection. Designation and request-specific choices are not retained answer identity. The human repeats or supplies a Lens request deliberately. A future managed interface replacing a displayed answer must retain the prior target and disclose consequential changes; that replacement interaction is outside this bounded shell surface.

Subject navigation remains a new request. For example, inspect @investigram from an older answer preserves the investigram target but may select newer correction context. Help and continuation wording must distinguish this from present @answer, which fixes the complete selection. Avoid promising that all navigation from a retained answer is historically frozen.

Under Q1's recommendation, fresh inspect rejects --after and --revision-page, explaining how to obtain/use the answer reference. Every rendered continuation points to retained presentation. Do not retain silent reselection aliases. A fresh command with --json or --source-detail remains explicitly a fresh selection; reformatting an earlier answer uses present.

## Presentation separation and content sufficiency

Separate four responsibilities, reusing the current static catalogs and typed family content:

1. Fresh planning: resolve subjects; select a prospective result/Presentation contract; declare needed expansions before Evaluation.
2. Retained resolution: retrieve the exact supported Projection and resolve only its fixed supporting records, including composite mechanical support.
3. Presentation compatibility: select/check the current requested presentation against the supplied answer's actual semantic variant, permitted detail and materialization. A fresh plan can use the same declarations prospectively, but retained checking cannot invoke Evaluation.
4. Reference coordination and arrangement: supply the existing qualified populations and bindings; arrange/render them with explicit presentation and reporting inputs.

Representation separates the chosen Presentation definition, presentation parameters (format, source disclosure, continuation and revision page) and context/reporting (reference lifetime and usage). This does not imply context is excluded from View identity: exposed consequential differences remain identity inputs under the accepted family rules. Output encoding may continue to select existing CLI bounds in this slice. General F5 option/layout policy remains open.

| Requested change | Exact retained presentation |
| --- | --- |
| Unicode ↔ JSON | Supported by the compatible family Presentation over the same answer; format-specific omissions remain explicit. JSON is not the complete core store. |
| Another association/revision page | Uses the retained full population/snapshot. Continuations resolve only within that supplied population and its stable bindings. A later associated account cannot become a valid token for the older answer. |
| Turn supported source disclosure on/off | Uses captured support already belonging to this answer. Preserve unavailable/partial source qualifications. No filesystem acquisition or new expansion is triggered. |
| Reveal existing but previously abbreviated detail | Allowed only through an existing supported Presentation option and its declared bounds. Core retention alone does not promise a UI control for every retained field. |
| Missing expansion or richer information | Refuse exact presentation when the chosen contract needs information outside the retained content; explain that a new information request is needed. Do not fill it from otherwise available Session records. |
| New correction, association, reconsideration state or replacement | Requires fresh core selection. Even “just updating a warning” changes this answer's selected qualification. |
| Inventory → inspection; children → parents; deeper/new analytical question | New Lens/application request. Similar fields do not make the semantics interchangeable. |

The initial option matrix uses the existing family arrangements; Unicode and JSON apply to every row:

| Retained answer | Source-detail toggle | Association continuation | Revision page |
| --- | --- | --- | --- |
| Module inventory; project/repository organization population | No; these population Presentations do not offer source detail | No | No |
| Mechanical module/group/mixed inspection, without an associated composite | Yes, over supplied support | No; do not add current associations | No |
| Associated module/group/mixed inspection composite | Yes, through its retained mechanical base | Yes, over the frozen association listing | No; inspecting a listed account is a new request |
| Dependency structure/children/parents | Yes, over supplied support | No | No |
| Investigation operation-result selection | Yes, over supplied interpretation support | No | Yes, over its retained revision snapshots |
| Historical investigram-inspection selection | Yes, over supplied support | Yes | Yes |
| Internal module-exports fixture | Yes, as declared by its existing Presentation | No | No |

This exposes retained investigation source/revision arrangement through present even where an existing fresh shell command did not offer those flags. It adds no new information or page algorithm. Empty or unavailable selected outcomes remain qualified; they do not acquire accounts merely to populate a page. Content availability and supported options are separate checks: a retained inventory can carry source support without its inventory Presentation offering a source-detail mode.

Use the fixed catalog's compatible default and declared fallbacks. This slice adds no public Presentation-ID selection option. Future alternative Presentations must satisfy the same retained-content boundary.

Distinguish not requested, qualified unavailable, partial, complete and established empty content. A compatible Presentation can display a selected unavailable outcome without retrying it. A strict completeness precondition can refuse it or use an explicitly permitted fallback without changing the answer. Do not reject a qualified partial answer merely because it is not complete.

The associated-inspection route dispatches by retained variant, resolves its mechanical Projection and frozen investigation content, arranges the mechanical base, then attaches the frozen listing. It must never call selectAssociatedInspection. Ordinary investigation redisplay must never call selectInvestigation, even if reuse normally yields the same result.

## Identity, retention and references

No new answer is constructed for presentation. Its ID and immutable payload stay exactly equal, including supporting evaluations and input references. The operation may allocate new navigation spellings for explicitly supplied off-page support, following existing append-only schedules; it cannot bind newly accumulated populations.

Retained presentation does not have to reproduce the original View ID. Format, paging, source disclosure, compatibility decisions, visible lifetime, selected title, lookup context and authoritative usage can affect the arranged artifact. Preserve family-specific identity rules and explicit continuation normalization. Method versions advance for changed semantics; do not change answer formulas merely to add the request route.

Current invocation context reports the exact presentation target and effective choices. Original name-lookup prose or an earlier attempt's provider diagnostics are not reconstructed or copied as if they describe this invocation. Preserve all answer-relevant qualification from retained content. Derive a neutral title from the retained Lens meaning and the Session's fixed catalog, rather than requiring the old command spelling.

If compact answer references are adopted, allocate them in a separate target namespace, backed by exact retained Projection IDs. Preserve existing subject bindings and collision behavior; do not extend the arrangement's entity-binding port into arbitrary record lookup. Repeated presentation of the same ID returns the same alias, and a new colliding answer cannot steal an old one. A Projection does not become a program Entity or automatically a Lens subject.

The existing store already retains records for the transient Session, with no eviction. Add no duplicated answer archive, retained View store or full resolved-content cache. A bounded alias map adds retention proportional to exposed answers and ends with the Session. Keeping stdout or observations does not extend references. Presentation after invalidation remains the explicit Q2 decision.

## Outcomes, reporting and observations

Report current presentation success separately from the retained answer's analysis outcome. Successfully displaying a retained failed/unavailable answer is a completed presentation request; the earlier failure remains visibly qualified. A refused target, option, continuation or incompatible presentation is a current refusal. Fresh Lens execution keeps its existing failure behavior. Out-of-range numeric pages retain explicit bounds/empty-page semantics rather than selecting a different answer; malformed values are rejected.

Retained semantic outcome must be available to the arranger independently of optional current attempt reporting. Do not fake reused=true, generate an attempt ID, replay provider failure metadata as a new event, or charge previous usage again. Current work attribution records consumption of the exact retained answer/support and no evaluation/provider/interpretation work. Normal input-validation probes, when Q2 retains them, are validation rather than new claim acquisition. Existing original generating attribution remains intact.

Carry the presentation request kind through normalization, direct execution, worker envelopes, parent finalization, publication and observations. A produced View records its exact Projection, effective presentation choices, selection mode and actual rendered output. Preserve the internal investigation arrangement key for idempotent authoritative usage finalization. No core lookup, binding or selection occurs in the parent.

Advance the observation envelope from version 2 to 3 for the new request-kind and outcome contract. Keep experimental family schemas governed by the [experimental-output policy](../decisions/experimental-structured-outputs.md); do not add adapters, migration or historical-reader promises. Record view-produced and actual source escape only when a View is emitted. Record refusals with the target and reason, without a fabricated View. Sink failure remains a visible warning and cannot erase delivered output.

The existing captured-basis export gap remains explicit: recorded View IDs, Session IDs and paths do not preserve complete captured support after the store disappears. Preserve actual answer attribution; make the associated-inspection variant and its exact mechanical-support reference explicit in the delivered descriptor and observation, but do not claim this closes general captured-state export or archives evidence. Likewise, an answer target identifies a Projection, not the particular earlier View from which a user copied it; do not invent navigation-origin lineage.

## Delivery slices and exit evidence

### M1 — Retained target and Presentation boundary

Add validated request discrimination, exact record resolution and content-based compatibility for every supported family/variant. Separate currently coupled reporting/outcome inputs. Keep fresh requests on their existing semantic path, with shared arrangement contracts.

Exit evidence: direct same-ID presentation over mechanical, historical/request investigation and associated composite answers; supported unavailable/partial results; explicit wrong-kind/foreign/unknown refusals; a resolver that cannot select history, evaluate or acquire evidence.

### M2 — Shell continuity and reference behavior

Add the approved command/reference scheme and paging migration, neutral selected-status wording, visible fresh/retained mode, lifetime disclosures and usable continuation guidance. Carry full effective options without implicit previous-View inheritance.

Exit evidence: shell/API coverage for current families, stable aliases and existing subject collisions, one-shot refusal, source disclosure, and read-only reformat/page sequences after intervening Session changes.

### M3 — Publication, observations and documentation

Complete worker and parent transport, usage finalization, version-three observations, successful presentation of retained failures, refusals, cancellation, input checks and sink-failure behavior. Update current documentation after verifying implementation. Remove no historical observations.

Exit evidence: actual worker/parent/sink tests; accurate current request and retained outcome; explicit unchanged-answer identity across changed output; implementation/status/capability/CLI descriptions agree.

Use the repository's implementation task and independent-review workflow after separate implementation authorization. This planning package opens no task record and authorizes no code changes.

## Verification matrix

Use real fixtures and the existing controlled investigator double, without hosted inference. Extend existing tests rather than inventing an independent fake retention model.

| Scenario | Required observable evidence |
| --- | --- |
| Retain P, accept a correction/replacement, present P again | Same Projection ID, account selection, revision snapshot, basis and qualifications. Fresh selection Q can show the correction; P remains unchanged. |
| Revision page boundary | More than 24 correction/cause rows; add corrections, branches, inconsistencies and transitive reconsideration between pages. Later pages of P use P's complete snapshot and stable ordering. |
| Association page boundary | More than 24 associated accounts, including empty initial listing; add new associated accounts between requests. Old P's total, membership and continuation stay fixed; a Q-only token is refused for P. |
| Composite inspection | Module-only, group-only and mixed selections preserve the exact associated composite and mechanical support, including selected outsiders and qualified incomplete content. |
| Additional materialization | Retain a partial answer, then acquire information enabling a later fuller answer. Present old partial content with its earlier qualifications; no current Session enrichment. |
| Failed/unavailable retained answer | No retry/inference/charge; original kind/code/diagnostic and evaluation limitations remain visible. Presentation succeeds independently of the old evaluation failure; fresh retry behavior remains unchanged. |
| Formats and disclosure | Reformat and toggle only supported captured source detail. Compare full content/support, structured Views and actual rendered output, allowing only explicit presentation/report differences. Source classifications match actual exposure. |
| Compatibility failure | Missing expansion, unsupported variant/option and unmet completeness precondition return qualified non-View refusals referencing the retained answer. Permitted fallback preserves explicit choices. |
| Identity | Repeated equal effective presentation is stable under equal reporting; changed pages/lifetime/usage do not change Projection identity. Semantic continuation normalization retains literals in a disjoint key space. |
| Target/reference lifecycle | Unknown, foreign and wrong-kind targets; stale same-spelling foreign Session; answer/subject namespaces; collisions; old bindings unchanged; no use after close. Q2's accepted invalidation policy is tested explicitly. |
| Separation | No selectors, construction, current-history enumeration or Evaluation on present. Binding sees only supplied populations, including off-page support. Fresh commands still use coordination normally. |
| Publication | Direct and worker results agree; finalization twice is stable; Session usage may reflect intervening work without charging presentation; observation v3 reports present, not a Lens repeat; sink failure preserves output. |
| Honest command behavior | All fresh Lens commands report fresh selection; old paging syntax follows Q1; one-shot lifetime is explicit for every family; subject navigation does not claim frozen-answer continuity. |
| Extension locality | Shared interpretation and module-exports fixtures can present retained answers without new Lens-name branches in coordination/reporting. |

During implementation run focused checks per slice, then npm run check and npm test. Compare semantic content with kind-aware reference normalization; do not erase qualification, omissions, ordering, literal evidence or meaningful identity differences to make tests pass.

## Risks and decision ownership

The human resolves Q1–Q3 and approves the decision/constraint package before promotion. If the human includes post-invalidation presentation, revise the plan before implementation rather than bypassing validation locally.

The implementer rechecks this baseline against concurrent repository work at task initiation. Particular risks are associated composite dispatch, source support that looks present but lacks the required qualified expansion, retained unavailable outcomes hidden by null current reporting, and accidental population-wide binding from current history. If a retained family cannot reconstruct its qualified content, repair the bounded retention contract through an explicit reviewed scope adjustment; do not silently select a fresh substitute.

The implementer owns exact type/module names and ordinary output layout within approved semantics. A need for a generic Projection registry, new capture model, retained View history, generalized Presentation framework or complete observation basis export returns to the human before expansion.
