# Exact retained-answer presentation

Status: approved
Created: 2026-10-14
Updated: 2026-10-25
Superseded by:

## Problem and intended outcome

A human inspects an answer, conducts another investigation that introduces a correction, then asks for the next page of the earlier answer. Today the page request selects again from current Session history. Page two can consequently belong to a different qualified answer. Repeating a command in another format has the same risk. A changed Projection ID in JSON does not adequately disclose that behavior.

Support a request that presents an exact retained Projection with new presentation inputs. Preserve its captured basis, selected interpretations, correction and association state, qualifications, relevant evaluation outcomes and supporting references. Keep that operation distinct from asking the Lens again, even when a new request uses the same captured program inputs or reuses a completed operation.

This work delivers continuity within the supported transient Session. It does not promise byte-identical output, current interpretation status, permanent availability or continuity across process restarts.

<a id="review-choices"></a>
## Resolved review choices

The human agreed to Q1–Q3 on 2026-10-14, with Q2 expressly limited to the current lifecycle. The choices below are settled for this plan. The complete plan was approved on 2026-10-25 after three review rounds. Implementation requires separate authorization.

| Choice | Agreed behavior | Alternative and consequence |
| --- | --- | --- |
| Q1: existing paging syntax | Add shell present and move --after and --revision-page to it. Reject those flags on fresh Lens requests with guidance to present an answer reference. | Keeping old syntax as explicit reselection would need conspicuous refresh semantics and consequential-change disclosure; a JSON ID or generic warning does not cure F6. Implicitly looking up the last matching request creates additional history and ambiguity policy. |
| Q2: invalidated Sessions | Keep current Session validity/publication checks and shutdown behavior as a bounded lifecycle limitation. Invalidation makes the historical answer unavailable through this lifecycle; it does not make the answer itself invalid. | Historical presentation after invalidation is valuable and conceptually compatible with immutable answers, but requires separating readable retention from investigation cancellation and shell shutdown. Scope and lifecycle decisions must be revised before including it. |
| Q3: human-facing answer references | Expose a distinct, stable, Session-local compact answer reference alongside the precise Projection ID. The API accepts the precise ID; CLI accepts both. | Raw IDs alone are smaller to implement but cumbersome in human paging. An implicit last-answer alias adds mutable targeting and is not part of this design. |

The agreed shell command is present. With no established user base requiring compatibility, reject ambiguous old paging flags with useful guidance rather than retaining aliases. Exact internal names and output layout remain delegated within these choices. Outcome/report separation, the observation version and default handling below are covered by the accepted decision.

## Implementation assessment

Assessment baseline: 296190615e60872bd8db6bf9a40334ca7787a3ed, with main and freshly fetched origin/main equal on 2026-10-14. The [Lens request-model plan](lens-request-model.md) is completed. Its older source assessment describes its own starting point, not current code.

This assessment reads source, current descriptive documentation and existing tests. No application tests or runtime reproduction were executed during this planning assessment. Existing assertions are evidence of intended coverage, not a claim that they were freshly verified.

| Current path | Finding and consequence |
| --- | --- |
| [requests.ts](../../src/lib/requests.ts), [session.ts](../../src/lib/session.ts) | ViewRequest describes Lens/report requests; normalization has no retained-presentation alternative. execute validates the Session, resolves subjects, plans expansions, evaluates as needed and constructs/selects an answer. Reuse of work does not bypass selection. |
| [presentation-contracts.ts](../../src/lib/presentation-contracts.ts) | Explicit static contracts already declare formats, source support, association/revision paging, requirements and completeness preconditions. Prospective compatibility currently depends on a Lens request and Lens definition. Retained compatibility must instead inspect the supplied answer's meaning and materialization. |
| [investigation/selection.ts](../../src/lib/investigation/selection.ts), [selection-record.ts](../../src/lib/investigation/selection-record.ts), [content.ts](../../src/lib/investigation/content.ts) | Selection records retain complete unpaged revision snapshots, original-to-selected relations, displaced accounts, navigation, associations and semantic outcomes. Resolution follows fixed references. It does not have to consult later history. Keep this representation. |
| [investigation/associations.ts](../../src/lib/investigation/associations.ts) | createAssociatedInspectionView selects associations anew. The retained associated-inspection variant names its mechanical Projection. The resulting View exposes the composite ID with mechanical descriptor fields. Exact presentation must recover that exact variant and mechanical basis, not call this selecting wrapper. |
| [module-content.ts](../../src/lib/module-content.ts), [organization/content.ts](../../src/lib/organization/content.ts), [dependencies/content.ts](../../src/lib/dependencies/content.ts) | Family resolvers already expose qualified immutable content and supporting outcomes. Mechanical construction and expansion planning are separate responsibilities; retained presentation can resolve fixed support without invoking constructors. |
| [program-presentation.ts](../../src/lib/program-presentation.ts), family presentation modules, [reference-binding.ts](../../src/lib/reference-binding.ts) | Existing arrangements consume supplied content and coordinated references. Some convenience wrappers still combine store-based coordination and selection. The investigation arranger already takes a restricted binding port. Extract/reuse only the coordination needed for exact content; do not expose store lookup to arrangers. |
| [investigation/presentation.ts](../../src/lib/investigation/presentation.ts) | Arrangement mixes retained semantic outcomes with current attempt/reuse/provider reporting. Passing null reporting currently also makes the displayed result null. Retained failed/unavailable selections must remain intelligible without fabricating another attempt. Associated listing text also describes revision status as current; qualify it as selected for this answer. |
| [commands.ts](../../src/lib/commands.ts), [shell.ts](../../src/lib/shell.ts) | Paging is currently permitted on shell inspection commands. No answer target or exact-presentation command exists. Generated continuation guidance currently encourages the reselection path. |
| [command-execution.ts](../../src/lib/command-execution.ts), [session-protocol.ts](../../src/lib/session-protocol.ts), [interactive-session.ts](../../src/lib/interactive-session.ts), [observations.ts](../../src/lib/observations.ts) | Direct/worker publication already transports explicit View/report alternatives, normalized requests, usage, request work and observations. Extend those paths together. Parent usage finalization must remain self-sufficient and cannot reselect. |
| [answer-identity.ts](../../src/lib/answer-identity.ts), [memory-store.ts](../../src/lib/memory-store.ts) | Retained answer keys exclude designation and presentation inputs; insertion enforces immutable payload consistency. Subject compact bindings cover modules, groups and investigrams. Projection references need their own target category, not promotion to program entities. |
| [investigation-selection.test.ts](../../test/investigation-selection.test.ts) | Existing cases reconstruct old content after corrections, associations and inconsistencies with enumeration/lookup disabled; exercise full unpaged support and presentation-only identity differences. They do not provide a public retained-presentation operation. |

The [architecture overview](../architecture/README.md), [investigation architecture](../architecture/investigation.md), [capability reference](../capability-reference.md) and [CLI reference](../cli-reference.md) acknowledge the F6 limitation. The reconciliation inventory below covers the affected terminology, including [STATUS.md](../../STATUS.md); fresh selection and exact presentation must have distinct wording.

## Governing dependencies and document impact

The [application specification](../app-specification.md), [core concepts](../core-concepts.md) and [architectural constraints](../architectural-constraints.md) already require presentation continuity and distinguish captured basis from interpretation selection. The [coordinated-Views decision](../decisions/coordinated-views-and-qualified-results.md), [qualified construction](../decisions/qualified-construction-under-the-request-model.md), [Lens request outcomes](../decisions/lens-application-and-request-outcomes.md), [transient Sessions](../decisions/transient-analysis-sessions.md), [investigram decisions](../decisions/investigrams-and-progressive-investigation.md) and [reference lifetime disclosure](../decisions/reference-lifetime-disclosure.md) remain governing.

The accompanying [decision](../decisions/exact-retained-answer-presentation.md) specifies the new bounded request, reference and reporting contract. No definition of Projection, Presentation, View or pinned input needs replacement. No foundation or application-specification revision is needed for the adopted scope. The architectural constraints state the supported retained-request boundary, with provenance in the companion decision. Separating retained-information lifetime from permission to investigate remains outside this plan.

F6 is transferred from the backlog into this plan; the unresolved portion of F5 remains in the backlog. Adoption does not establish implemented conformance. Current behavior documents link to this plan while retaining the known limitation until implementation is verified. Do not rewrite historical decisions, audits or concluded records. Their references remain interpretable against their historical baselines.

## Scope

Cover all production families: module inventory, module/group/mixed inspection, project/repository organization, dependency structure/children/parents, operation-result investigation and exact-investigram inspection. Associated inspection remains one retained composite answer with its supporting mechanical result; it is not converted into arbitrary multi-Projection composition.

Exercise the internal module-exports and shared interpretation extension fixtures through the common path. This preserves the completed request model's extension boundary without making those Lenses public.

Include the direct Session request, worker transport, shell syntax/help, all affected text/JSON descriptors, supported Presentation inputs, reference binding, refusal reporting, usage finalization, source-disclosure observations, focused verification and capability/status/architecture documentation.

Exclude general GUI Presentation design, a public Presentation/plugin registry, arbitrary multi-Projection Views, new Lenses, new sorting/filtering/depth controls, replay of original requests from answer references, live refresh, pinned/following controls, multi-state analysis, persistence, eviction, observation readback, full captured-basis export and general View-origin history.

## Request and CLI behavior

### Exact presentation

Introduce a discriminated request alternative whose meaning is “present this retained Projection.” Its inputs are an exact answer target and presentation inputs/context. It contains no subject designation, Lens parameters, operation request or input-binding change. Reject mixed request forms and malformed presentation values at the boundary rather than ignoring them; retain the existing safe request-capture and terminal-escaping behavior. Do not overload inspect, invent a present Lens, or interpret an answer reference as its subject.

The direct Session boundary accepts a precise Projection ID. Validate that the target is retained in this Session and belongs to a supported answer kind. A retained answer may be empty, partial, unavailable or contain an earlier failed evaluation. An unknown target, foreign Session, wrong record kind or incompatible Presentation returns a qualified non-View refusal, not a replacement answer. Do not claim an unknown ID was previously retained and expired without evidence. Broken retained support is an internal defect, not ordinary unavailability.

The shell surface is:

~~~text
present @answer-… --json
present @answer-… --after @investigram-…
present @answer-… --revision-page 2
present @answer-… --source-detail
~~~

Each presented answer exposes its precise ID and compact answer reference in both human and structured output. A presentation-unavailable resolution result exposes usable targets for each ID in its retainedAnswers field, even though it produces no View. No history command or implicit “last” target is required; inability to arrange an answer does not revoke its retention.

Request coordination in the Session allocates or retrieves the answer alias after exact target resolution/construction and before arrangement. This runs in the worker for CLI requests, on both fresh and retained routes; the direct Session path uses the same coordination. The canonical answer reference travels in the arranged View or resolution result so parent finalization and rendering need no binding capability.

On fresh module/group inspection, construct the mechanical Projection, then select the associated composite from its precise ID before arranging the mechanical base View. Allocate the composite answer alias, arrange the mechanical base, then arrange the frozen listing and final composite output with that answer reference. Final output and continuation hints identify the composite answer, not its mechanical support. Selecting the composite allocates no subject references; preserve the existing mechanical subject allocations followed by associated-listing allocations, including order and collision behavior. The separately named mechanical support retains its own precise identity. Retained presentation resolves the existing composite and never reruns this fresh selection.

Allocate and expose an answer alias in one-shot output too, for within-output correlation, with the shared expiry notice. One-shot omission guidance says to open a shell, request the information there, then use that new Session's answer reference. It must not offer an executable present continuation for the expiring one-shot answer.

One-shot present is rejected before opening an unrelated Session. One-shot outputs still identify their answer but explicitly disclose that references expire at command end. The reference-lifetime notice covers every family touched by the new output, not just investigrams. It offers no cross-process reconstruction.

A presentation request supplies a complete effective presentation choice after normal defaults: omitted paging starts at page one/no continuation; source detail defaults off; format follows the supported interface default, including JSON in a postcode shell --json Session. It does not inherit a previous View's options, because a Projection can have many Views. Effective choices are inspectable. Existing format-specific bounds remain; no new all-content/export mode is implied.

Generated shell continuation commands explicitly preserve the View's other effective choices while changing only the paged input. Carry --source-detail when enabled, the current --after when changing revision page, and the current non-default --revision-page when changing association page. An association restart clears only --after. Emit --json for a JSON View, including when redundant with the shell default, so format is preserved without making hint text depend on hidden shell-default context; Unicode hints use the existing Unicode shell default. Default-off source detail, page 1 and absent continuation need no flags. This uses the existing reachable format surface and adds no new format option. Construct hints from the arranged View's effective inputs, not the spelling of an earlier request. These explicit commands do not create option inheritance for manually written present requests.

When a historical-inspection View has a well-formed but unknown association continuation, its revision-page continuation preserves that exact after token. The structured entry and rendered hint disclose that the association continuation remains unknown and the command retains failed status. Offer a separate association-restart entry that clears only after, preserving revision page, source detail, format and the precise answer target. Do not silently repair the token while paging revision details or consult later associations to resolve it.

Views carry structured continuation entries for supported next association page, next answer-wide revision page and association restart actions when applicable. Each entry identifies its action and supplies a complete effective request using the same normalized present-request shape: the exact precise Projection target, format, sourceDetail, revisionPage where supported, and after when present. Include complete effective values for applicable controls and omit inapplicable controls; an associated mechanical-inspection continuation must not carry an unsupported revisionPage. The View's canonical answer alias supplies human command spelling; it does not replace the precise target in the structured request. Final field names remain delegated. This is bounded continuation data, not a new request-history or generic navigation model.

Include these entries in JSON descriptors, alongside the existing next/nextPage and omission metadata; those scalar fields alone are not complete requests. Unicode rendering derives its commands from the same entries and the supplied canonical bindings, with no Session lookup or parent allocation. All values are determined by the fixed answer, effective presentation inputs and lifetime already covered by View identity; normalize target/reference referents under the existing rules. Do not introduce shell-default-dependent text or another identity formula. One-shot Views expose bounds and expiry/reopen guidance but no executable continuation request for the expiring answer.

### Fresh selection and navigation

Existing Lens commands remain independently requested fresh selections. The text/JSON output distinguishes “Fresh answer selection” from “Retained answer; selection unchanged.” Reuse may mean that fresh selection returns the same Projection ID and incurs no inference. Never imply that a new selection necessarily acquired new program evidence or regenerated interpretation.

Do not add a refresh command that reconstructs a request from a Projection. Designation and request-specific choices are not retained answer identity. The human repeats or supplies a Lens request deliberately. A future managed interface replacing a displayed answer must retain the prior target and disclose consequential changes; that replacement interaction is outside this bounded shell surface.

Subject navigation remains a new request. For example, inspect @investigram from an older answer preserves the investigram target but may select newer correction context. Help and continuation wording must distinguish this from present @answer, which fixes the complete selection. Avoid promising that all navigation from a retained answer is historically frozen.

All fresh Lens requests reject --after and --revision-page with guidance to present the answer reference; inspect is the currently accepted paging command being changed. Every rendered continuation points to retained presentation. Do not retain silent reselection aliases. A fresh command with its supported --json or --source-detail option remains explicitly a fresh selection; reformatting an earlier answer uses present.

At the shared subject-reference classification boundary, every subject-taking command (inspect, children, parents, summarize, explain, decompose and examine) rejects an answer-namespace reference with guidance to present that answer. Apply the same guidance to a well-formed precise Projection ID supplied as a subject reference, including @<precise Projection ID>; identifying its kind does not establish retention or availability. Do not unwrap the answer into a subject or allocate bindings. Keep the existing literal-name convention after --, and preserve existing handling of malformed or other unknown subject references.

Apply the same narrow answer-reference recognition in one-shot commands before opening a Session or attempting name lookup. An @-prefixed answer alias or well-formed precise Projection ID not passed as a literal after -- receives guidance that an answer can be presented only in the active shell Session that retains it; to begin new work, open a shell and request the information there. Do not claim that matching spelling in a new shell restores that answer. Preserve literal lookup after -- and existing behavior for other one-shot @-prefixed names. Production commands and subject-taking internal extension fixtures use the shared classification boundary; do not add command-specific answer-kind branches.

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

This exposes retained investigation source/revision arrangement through present even where an existing fresh shell command did not offer those flags. Fresh summarize/explain/decompose/examine retain their current flag restrictions; widening their parser/API surface is unnecessary for exact presentation. The asymmetry keeps the work bounded while using already-supported arrangement of selected content. It adds no new information or page algorithm. Verify actual disclosure through src/lib/source-disclosure.ts and test/source-disclosure.test.ts as well as end-to-end observations. Empty or unavailable selected outcomes remain qualified; they do not acquire accounts merely to populate a page. Content availability and supported options are separate checks: a retained inventory can carry source support without its inventory Presentation offering a source-detail mode.

Use the fixed catalog's compatible default and declared fallbacks. This slice adds no public Presentation-ID selection option. Future alternative Presentations must satisfy the same retained-content boundary.

Distinguish not requested, qualified unavailable, partial, complete and established empty content. A compatible Presentation can display a selected unavailable outcome without retrying it. A strict completeness precondition can refuse it or use an explicitly permitted fallback without changing the answer. Do not reject a qualified partial answer merely because it is not complete.

Revision paging is answer-wide for both operation-result and historical-inspection variants. One revision-page number applies to every displayed revision status; it does not select a particular original or change the retained population. Each status reports its page and own totals. When a status has no rows at that page, say that it has no further rows on this page, rather than implying it has no revision history.

Show one shared shell continuation when any displayed status has another page: “Continue revision details for this answer with present @answer-… --revision-page N [other effective flags]. This pages all shown revision statuses; some may have no further rows.” Replace the illustrative bracketed phrase with actual preserved flags, omitting it when none are needed. Individual statuses identify whether they have more rows without duplicating or changing that target. Keep original-subject navigation separately labelled: “inspect @original requests a new inspection and can select newer correction context.” That is not revision-page continuation. One-shot output uses the reopen-in-shell guidance above. Association hints likewise target the fixed answer, including restart at its first page after an unknown continuation.

The bare mechanical-inspection row is intentional but is not ordinary successful production inspect output: production module/group inspection attaches an associated composite, including when its listing is empty. Bare targets are reachable through precise IDs in presentation-unavailable retainedAnswers and through the exact mechanical-support reference exposed by this plan. Presenting one shows that different mechanical-only answer without adding associations. A support pointer exposes its precise ID; it does not allocate an additional alias solely for being embedded support. Targeting it with present allocates its alias, while IDs delivered as retainedAnswers receive aliases when that resolution result is coordinated.

The associated-inspection route dispatches by retained variant, resolves its mechanical Projection and frozen investigation content, arranges the mechanical base, then attaches the frozen listing. It must never call selectAssociatedInspection. Retained investigation presentation must never call selectInvestigation, even if reuse normally yields the same result.

## Identity, retention and references

No new answer is constructed for presentation. Its ID and immutable payload stay exactly equal, including supporting evaluations and input references. The operation may allocate new navigation spellings for explicitly supplied off-page support, following existing append-only schedules; it cannot bind newly accumulated populations.

Retained presentation does not have to reproduce the original View ID. Format, paging, source disclosure, compatibility decisions, visible lifetime, selected title, lookup context and authoritative usage can affect the arranged artifact. Preserve family-specific identity rules and explicit continuation normalization. Advance methods.presentation, methods.investigationPresentation and methods.exportsPresentation for the changed fresh and retained View semantics; do not change answer formulas merely to add the request route. The captured method registry participates in analysis-input identity, so those version changes can change input-record references and consequently Projection IDs between builds. This provenance effect is permitted and does not weaken exact same-ID continuity within one supported Session.

For each current family, extend its existing View identity with an explicit fresh or retained selection-mode marker, rather than relying on incidental differences such as non-null resolution context. The mode marker is exposed consequential context under the accepted View-identity rule, so this extension needs no supersession. Fresh Views keep their existing title where present, lookup/reporting context and other family inputs alongside the fresh marker. The retained route uses the following effective inputs:

| Artifact | Retained-route identity inputs |
| --- | --- |
| Module, organization, dependency and internal exports View | Responsible Presentation method, exact Projection ID, selected Presentation/compatibility decision, effective format/source choices, reference lifetime, retained mode and the neutral title where the family exposes one. Dependency Views have no title. Resolution context is absent. |
| Investigation arrangement key | Responsible Presentation method, exact Projection ID, selected Presentation/choices, normalized association continuation, revision page (default 1), reference lifetime, retained mode, neutral title, absent resolution context and null current-attempt reporting. |
| Final investigation View | Existing finalization formula: responsible method, explicit usage-independent arrangement key and authoritative Session usage. |
| Associated-inspection View | Existing composite formula: responsible method, exact associated Projection ID, base mechanical View ID constructed in retained mode, normalized association continuation, lifetime and retained mode; title and Presentation choices are determined by the base View. |

Preserve the existing kind-aware reference normalization and family separation. On fresh historical inspection, current-attempt reporting is also null; the explicit mode distinguishes it from retained presentation. “Equal reporting” on the retained route means the same visible lifetime, effective Presentation decision and authoritative Session usage where included, with no attempt/reuse/provider report. Request occurrence IDs and raw supplied target spelling stay in the separate request context and observation request record, outside the View. The View exposes the resolved precise answer ID and its canonical bound alias irrespective of whether the caller supplied that alias or the precise ID. Therefore these two ways of targeting the same answer have equal View identity under otherwise equal inputs. Canonical reference spellings do not enter identity as arbitrary text; their referents are normalized.

Current invocation context reports the exact presentation target and effective choices. Original name-lookup prose or an earlier attempt's provider diagnostics are not reconstructed or copied as if they describe this invocation. Preserve all answer-relevant qualification from retained content. Derive a neutral title from the retained Lens meaning and the Session's fixed catalog, rather than requiring the old command spelling.

Allocate compact answer references in a separate target namespace, backed by exact retained Projection IDs. Preserve existing subject bindings and collision behavior; do not extend the arrangement's entity-binding port into arbitrary record lookup. Repeated presentation of the same ID returns the same alias, and a new colliding answer cannot steal an old one. A Projection does not become a program Entity or automatically a Lens subject.

The separate answer allocator never changes subject spellings. Retained presentation may nevertheless allocate previously unbound module/group/investigram references from its fixed off-page support. These insertions may change the collision length of a subsequently allocated subject reference, compared with a Session history that omitted that presentation. This is an explicitly permitted consequence of the new request path; it never changes an already-bound reference or an existing fresh request's population/order. Verify both allocator independence and the later-collision case.

Resolve compact answer aliases only through the active Session's existing answer-binding table, never by searching record-ID hash prefixes. An unbound alias is “not bound in this Session”. A precise ID identifies its Session and can be refused as foreign.

A locally bound alias denotes its local target even if its spelling was copied from another Session. Bare spelling cannot establish foreign origin; detecting that would require a Session-qualified token, which is outside this design. The human confirmed these Session-local semantics on 2026-10-14 in response to review C4.

The existing store already retains records for the transient Session, with no eviction. Add no duplicated answer archive, retained View store or full resolved-content cache. A bounded alias map adds retention proportional to exposed answers and ends with the Session. Keeping stdout or observations does not extend references. Keep current Session validity checks, invalidation and shutdown behavior. Session invalidation does not make a historical answer invalid over its captured basis; the current lifecycle makes it unavailable. Separating retained-information lifetime from permission to continue investigating is conceptually valid but outside this work.

## Outcomes, reporting and observations

Report current presentation success separately from the retained answer's analysis outcome. Successfully displaying a retained failed/unavailable answer is a completed presentation request with failed: false and exit status 0; the earlier failure remains visibly qualified. This applies when presentation itself succeeds, not to an unknown-continuation page or other current presentation failure. A malformed target/option/continuation or incompatible presentation is a current refusal. A well-formed association continuation outside the frozen listing produces the existing qualified View with status unknown-continuation, retaining the exact Projection and counting omissions honestly. Its unknown token contributes a literal in the disjoint View-identity key space; do not select a current listing to find it. Preserve the existing failed command status for this unknown-continuation View. Fresh Lens execution keeps its existing failure behavior. Out-of-range numeric pages retain explicit bounds/empty-page semantics rather than selecting a different answer; malformed values are rejected.

Retained semantic outcome must be available to the arranger independently of optional current attempt reporting. Do not fake reused=true, generate an attempt ID, replay provider failure metadata as a new event, or charge previous usage again. Current work attribution records consumption of the exact retained answer/support and no evaluation/provider/interpretation work. Normal input-validation probes remain validation rather than new claim acquisition. Existing original generating attribution remains intact.

Carry the presentation request kind through normalization, direct execution, worker envelopes, parent finalization, publication and observations. A produced View records its exact Projection, effective presentation choices, selection mode and actual rendered output. Preserve the internal investigation arrangement key for idempotent authoritative usage finalization. No core lookup, binding or selection occurs in the parent.

Advance the observation envelope from version 2 to 3 for the new request-kind and outcome contract. Keep experimental family schemas governed by the [experimental-output policy](../decisions/experimental-structured-outputs.md); do not add adapters, migration or historical-reader promises. Record view-produced and actual source escape only when a View is emitted. Record refusals with the target and reason, without a fabricated View. Sink failure remains a visible warning and cannot erase delivered output.

The existing captured-basis export gap remains explicit: recorded View IDs, Session IDs and paths do not preserve complete captured support after the store disappears. Preserve actual answer attribution; make the associated-inspection variant and its exact mechanical-support reference explicit in the delivered descriptor and observation, but do not claim this closes general captured-state export or archives evidence. Likewise, an answer target identifies a Projection, not the particular earlier View from which a user copied it; do not invent navigation-origin lineage.

## Delivery slices and exit evidence

### M1 — Retained target and Presentation boundary

Add validated request discrimination, exact record resolution and content-based compatibility for every supported family/variant. Separate currently coupled reporting/outcome inputs. Keep fresh requests on their existing semantic path, with shared arrangement contracts.

Exit evidence: direct same-ID presentation over mechanical, historical/request investigation and associated composite answers; supported unavailable/partial results with failed: false on successful presentation; explicit wrong-kind/foreign/unknown refusals; fresh inspect output exposes the composite's alias rather than the base's, with unchanged subject-binding order/collision behavior; a resolver that cannot select history, evaluate or acquire evidence.

### M2 — Shell continuity and reference behavior

Add the approved command/reference scheme and paging migration, neutral selected-status wording, visible fresh/retained mode, lifetime disclosures and usable continuation guidance. Carry full effective options without implicit previous-View inheritance.

Exit evidence: shell/API coverage for current families, stable aliases (including the fresh composite target) and existing subject collisions, shared guided answer-as-subject refusals, one-shot refusal, source disclosure, and read-only reformat/page sequences after intervening Session changes.

### M3 — Publication, observations and documentation

Complete worker and parent transport, usage finalization, version-three observations, successful presentation of retained failures, refusals, cancellation, input checks and sink-failure behavior. Update current documentation after verifying implementation. Remove no historical observations.

Exit evidence: actual worker/parent/sink tests, including failed: false preserved through interactive-session.ts and a completed command outcome/exit 0 in command-execution.ts for successfully presented retained failures; accurate current request and retained outcome; explicit unchanged-answer identity across changed output; all implementation and documentation sites in the reconciliation inventory below agree.

Use the repository's implementation task and independent-review workflow after separate implementation authorization. Approval of this plan opens no implementation task record and authorizes no code changes.

## Verification matrix

Use real fixtures and the existing controlled investigator double, without hosted inference. Extend existing tests rather than inventing an independent fake retention model.

| Scenario | Required observable evidence |
| --- | --- |
| Retain P, accept a correction/replacement, present P again | Same Projection ID, account selection, revision snapshot, basis and qualifications. Fresh selection Q can show the correction; P remains unchanged. |
| Revision page boundary | More than 24 correction/cause rows; add corrections, branches, inconsistencies and transitive reconsideration between pages. Later pages of P use P's complete snapshot and stable ordering. Include two displayed revision statuses with different page counts; page N applies to both, an exhausted status is explained, and the one shared next-page hint stays on P. |
| Association page boundary | More than 24 associated accounts, including empty initial listing; add new associated accounts between requests. Old P's total, membership and continuation stay fixed; a well-formed Q-only token produces P's explicit unknown-continuation View and failed command status without changing P. |
| Composite inspection | Module-only, group-only and mixed selections preserve the exact associated composite and mechanical support, including selected outsiders and qualified incomplete content. |
| Additional materialization | Retain a partial answer, then acquire information enabling a later fuller answer. Present old partial content with its earlier qualifications; no current Session enrichment. |
| Failed/unavailable retained answer | No retry/inference/charge; original kind/code/diagnostic and evaluation limitations remain visible; successful presentation has failed: false, completed outcome and exit 0 at both direct and worker publication boundaries. Presentation succeeds independently of the old evaluation failure; fresh retry behavior remains unchanged. |
| Combined continuation choices | On a historical-inspection answer with --source-detail, --after and revision page 2, execute the structured JSON next request and its corresponding generated shell command for association paging and check that only after changes; do the same for revision paging and check that only the revision page changes. The descriptors include the precise retained target and complete effective choices, with actionable entries agreeing with next/nextPage and omission metadata. Generated requests omit controls unsupported by the retained variant, including revisionPage for associated mechanical inspection. Test association restart, Unicode, explicit JSON in a Unicode-default shell and a JSON-default shell. Include a well-formed unknown association token: revision continuation preserves it and the failed status, with disclosure in both structured and rendered hints; the separate association restart clears only after and retains the current revision page, source detail, format and answer target. Effective format/source choices, the other paging position, Projection identity and qualifications remain unchanged. A separately written present command with omitted options still uses normal defaults. |
| Formats and disclosure | Reformat and toggle only supported captured source detail. Compare full content/support, structured Views and actual rendered output, allowing only explicit presentation/report differences. Source classifications match actual exposure. |
| Compatibility failure | Missing expansion, malformed continuation, unsupported variant/option and unmet completeness precondition return qualified non-View refusals referencing the retained answer. Well-formed unknown continuations remain qualified Views. Permitted fallback preserves explicit choices. |
| Identity | Raw-ID and canonical-alias targeting yield equal View IDs under equal inputs; fresh historical inspection and retained presentation remain distinct despite null attempt reporting on both. Repeated equal effective presentation is stable under equal reporting; changed pages/lifetime/usage do not change Projection identity. Semantic continuation normalization retains literals in a disjoint key space. |
| Target/reference lifecycle | Unknown and foreign precise IDs, wrong-kind targets, unbound local aliases, answer/subject namespaces, collisions and old bindings unchanged; no use after close. An alias copied from another Session is unbound if absent locally, or denotes its existing local target if the spelling is bound locally; it never triggers cross-Session lookup. Detected input changes preserve the historical answer and its qualifications while further presentation is withheld and the shell shuts down. Keep the existing Session-invalidated message; it does not claim that earlier answers are invalid. No new invalidation wording is required. |
| Separation | No selectors, construction, current-history enumeration or Evaluation on present. Binding sees only supplied populations, including off-page support. Fresh commands still use coordination normally. |
| Publication | Direct and worker results agree; finalization twice is stable; Session usage may reflect intervening work without charging presentation; observation v3 reports present, not a Lens repeat; sink failure preserves output. |
| Honest command behavior | All fresh Lens commands report fresh selection; old paging flags on fresh requests are rejected with guidance to present the exact answer; one-shot lifetime disclosure covers answer, subject and supporting source/navigation references in Unicode and JSON for every affected family; all subject-taking commands guide answer references and precise Projection IDs to present in the shell, while one-shot commands reject them before Session creation/name lookup with lifetime and shell guidance; preserve literal names after -- and other one-shot @-name behavior; subject navigation does not claim frozen-answer continuity. |
| Extension locality | Shared interpretation and module-exports fixtures can present retained answers and their subject-taking paths receive the same answer-as-subject guidance without new Lens-name branches in coordination/reporting. |

During implementation run focused checks per slice, then npm run check and npm test. Compare semantic content with kind-aware reference normalization; do not erase qualification, omissions, ordering, literal evidence or meaningful identity differences to make tests pass.

## Implementation reconciliation

Update current behavior documents only with verified implementation. Their current descriptions retain the known limitations and point to this approved plan; they do not advertise the command or version-three production.

| Area | Current sites to reconcile during implementation |
| --- | --- |
| Fresh-selection versus exact-presentation terminology | STATUS.md; README.md progressive-investigation text; docs/cli-reference.md interpretation/replacement sections; docs/hosted-investigation.md; docs/architecture/README.md responsibilities; docs/architecture/investigation.md retention and correction sections; src/lib/commands.ts help. Replace current reselection uses of “redisplay” with “fresh selection”. |
| Exact presentation unavailable message | src/lib/request-reporting.ts currently says retained-ID redisplay is unsupported. Replace it with current usable answer targets and accurate presentation-unavailable reasons. |
| Retired paging syntax and generated guidance | src/lib/commands.ts help/parser; README.md; docs/cli-reference.md; docs/architecture/investigation.md; src/lib/investigation/associations.ts; src/lib/investigation/presentation.ts. Check ordinary continuation, unknown-continuation restart, answer-wide revisions, distinct subject navigation and one-shot guidance. |
| Observation version and operative conventions | src/lib/observations.ts and associated tests; README.md observability; docs/cli-reference.md, docs/capability-reference.md and docs/architecture/README.md; docs/implementation-conventions.md local observation sink. Change the convention from version two to version three when the producer changes. |
| Source classification | src/lib/source-disclosure.ts and test/source-disclosure.test.ts plus observation-publication tests cover the new retained operation-result disclosure route. |
| Backlog conformance | Update the captured-basis entry's associated-descriptor paragraph after verification of the explicit variant/support reference, without closing broader basis export. Program-View lifetime coverage includes all answer, subject and supporting references under the shared one-shot notice. Keep the remaining non-View reference-lifetime assessment open. |

Historical “redisplay” in the accepted investigrams decision means fresh replacement selection; exact retained presentation never follows later replacement chains. Preserve historical decision bodies and record this interpretation in the companion decision.

The retained-answer versus repeatable-request distinction for future external-agent references remains in the shared coding-agent context backlog entry.

## Review resolution and delegated details

The human resolved C4 in favor of Session-local aliases: local bindings determine meaning, including when a spelling was copied elsewhere. The human resolved round-two N2 on 2026-10-25 in favor of preserving other effective choices explicitly in generated paging commands. Manually written present requests retain normal defaults. The human resolved round-three R3 on 2026-10-25 in favor of preserving an unknown association continuation when paging revision details, disclosing its continuing failed status and offering a separate association restart. There are no outstanding consequential review questions. These adopted clarifications do not reopen Q1–Q3 or authorize lifecycle expansion.

Use the answer- prefix illustrated by the agreed command surface. Exact neutral-title wording, normal output layout and internal type/module names remain implementation details subject to the stated semantics, terminal safety and identity inputs. They do not authorize new default inheritance, implicit last-answer behavior or a broader Presentation selector.

## Risks and decision ownership

Q1–Q3 and the decision/constraint package are approved. Keep post-invalidation reading and broader lifecycle/interface design outside this plan; any later inclusion requires a separately agreed scope revision rather than a local validation bypass.

The implementer rechecks this baseline against concurrent repository work at task initiation. Particular risks are associated composite dispatch, source support that looks present but lacks the required qualified expansion, retained unavailable outcomes hidden by null current reporting, and accidental population-wide binding from current history. If a retained family cannot reconstruct its qualified content, repair the bounded retention contract through an explicit reviewed scope adjustment; do not silently select a fresh substitute.

The implementer owns exact type/module names and ordinary output layout within approved semantics. A need for a generic Projection registry, new capture model, retained View history, generalized Presentation framework or complete observation basis export returns to the human before expansion.
