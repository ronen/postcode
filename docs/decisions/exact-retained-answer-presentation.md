# Present exact retained answers independently of fresh selection

Status: accepted
Decided: 2026-10-25
Arising from: [Exact retained-answer presentation](../plans/exact-retained-answer-presentation.md)
Scope: retained presentation in the current transient Session API and CLI, qualified content compatibility, references, identity and reporting

## Context

Current commands coordinate a fresh Lens application before producing each View. They can reuse completed analysis, yet select newer correction or association state when a person only intended to page or reformat an earlier answer. The qualified-construction work already retains the full selected interpretation and revision state. Its fixed-reference content resolvers provide the basis for exact presentation without creating a second answer archive.

The [continuity contract](coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes) distinguishes an exact retained Projection from a repeated request, including a request against pinned program inputs. The [request model](lens-application-and-request-outcomes.md) separates immutable qualified answers from designation, invocation reporting and Presentation choices. This decision makes those distinctions operable for existing families.

The human agreed on 2026-10-14 to move paging to present, retain current invalidation/shutdown as a bounded lifecycle limitation, and include stable compact answer references. The accompanying plan records that agreement. The human also confirmed Session-local alias resolution in response to review C4: a locally bound spelling denotes its local answer even if copied elsewhere. On 2026-10-25, the human also agreed in response to N2 that generated paging commands preserve the View's other effective choices while changing only the paged input; manually written present requests retain normal defaults. The human confirmed in response to R3 on the same date that revision paging preserves an unknown association token, discloses the continuing failure and offers a separate restart. The complete decision and companion plan were accepted and approved on 2026-10-25; implementation requires separate authorization.

## Decisions

<a id="request-an-exact-retained-answer"></a>
### Request an exact retained answer

#### Decision

Expose retained presentation as a request kind distinct from a Lens application or operational report. It designates an exact retained Projection and new presentation inputs. It does not designate a new subject, change Lens parameters, request another input binding or reconstruct an original request.

Resolve the target to a supported retained record in the active Session, then follow only its fixed support. Preserve the selected captured basis, interpretations, corrections, associations, reconsideration snapshot, qualification and relevant evaluation outcomes. Do not run subject lookup, Evaluation, new core selection or evidence acquisition to satisfy this operation. Current validity checks remain a separate lifecycle concern.

Support the current mechanical families, investigation request/historical-inspection variants and associated-inspection composite. Resolve an associated answer's exact mechanical support as well as its frozen interpretation selection. Treat its composite ID as the target; presenting only its mechanical base would be a different answer. A bare mechanical inspection is also a supported target, obtainable through precise IDs in presentation-unavailable retainedAnswers or an exposed mechanical-support pointer. Presenting it shows that different mechanical-only answer without adding associations. An embedded support pointer exposes its precise ID and receives an alias only when targeted by present; retainedAnswers targets receive aliases with their resolution result. The internal exports fixture uses the same boundary.

Reject unknown, foreign or wrong-kind targets and incompatible presentation inputs as non-View resolution results preserving the actual request, target, reason and any valid retained answer reference. Do not fall back to the current answer for a subject. Missing required supporting records for a retained valid Projection are an internal defect. Preserving a reference does not establish that its content is currently available.

Reject mixed fresh/retained forms and malformed options without invoking selection. A valid retained failed, unavailable, partial or empty answer remains an answer. Its incomplete materialization does not by itself make presentation invalid.

#### Rationale and alternatives

Repeating an input-pinned request still permits different interpretation selection or newly completed analysis. Inspecting an exact investigram fixes that account but not the correction/association context of its inspection. Replaying bounded JSON loses content and support that another page or presentation may need. Resolving existing retained records is sufficient for the assessed implementation; a new retained View store, generalized registry or duplicate content archive is unnecessary.

<a id="check-presentation-against-retained-content"></a>
### Check Presentation against retained content

#### Decision

Retained compatibility uses the supplied content's semantic contract, variant, supporting expansions and qualified materialization. It does not require another Lens application. Fresh request planning continues to declare prospective Presentation requirements before Evaluation; both routes use shared declarations and arrangement contracts.

Keep Presentation choice, parameters and reporting/context explicit enough that the retained route can supply format, source disclosure and paging without fabricating a Lens request. Ordinary context is not automatically identity-neutral: reference lifetime and authoritative usage can change the presented artifact. Retain the accepted family identity rules.

Arrangers consume resolved qualified content and explicit supplied reference populations. They do not receive a record store, lookup callback or current-history selector. Extract needed reference coordination from existing convenience wrappers without moving answer selection into Presentation. Preserve existing subject-binding schedules and collision behavior for valid fresh requests. Retained presentation binds only the populations fixed by its answer; it does not enumerate current Session populations to reproduce a fresh request's preparation. Binding previously unbound off-page support on this new path can lengthen a later newly allocated subject reference compared with a history without presentation. This consequence is permitted; existing bindings never change, and the separate answer allocator cannot affect subject spellings.

Reformatting, supported paging and supported disclosure of already supplied captured evidence preserve the answer. If an option requires unselected information, refuse it and explain the need for a new information request. Additional information already elsewhere in the Session is still outside this answer. A declared fallback can accommodate qualified partial/unavailable content while preserving explicit choices and identifying the change of Presentation.

Continuation resolution is confined to the retained listing and stable bindings supplied for it. A token that exists only in a later answer is not a valid continuation for the earlier one. Malformed continuation syntax produces a non-View refusal. A well-formed token outside the frozen listing produces the existing qualified unknown-continuation View, with the same Projection and failed command status. Preserve its literal token in the disjoint View-identity key space; do not search current history to make it valid. A valid numeric page beyond the retained range can produce an explicitly empty bounded page; it does not acquire further history or change the answer.

Revision paging is answer-wide: one page number applies to every displayed revision status, for operation-result and historical-inspection answers alike. Each status retains its own totals and explains an exhausted page without implying absent history. If any status has further rows, supply one shared present continuation for the same answer and state that it pages all shown statuses. Keep inspect-original navigation separately labelled as a new selection that can select newer context. Association continuation and restart guidance likewise names the fixed answer. One-shot guidance instead explains how to open a shell and request information there.

Source detail and revision paging for retained operation-result answers use already supplied evidence and revision snapshots. Fresh operation commands keep their current option restrictions; expanding their request syntax is unnecessary for retained continuity.

Omitted page inputs normalize to the first page/no continuation; source detail defaults off; format follows the interface default, including JSON in a postcode shell --json Session. A Projection reference does not denote a previous View or inherit that View's options. Effective choices are recorded.

Generated shell continuation commands reproduce the View's other effective choices explicitly, changing only the paged input. Preserve source detail and the other paging position; an association restart clears only its continuation. Use canonical effective flags, including --json for JSON Views even where redundant with the shell default, rather than making hint text depend on hidden default context. Unicode hints use the existing Unicode shell default; no new format option is introduced. Omit flags whose normal defaults already express the effective choice. This command generation does not create implicit option inheritance for a manually written request. A revision-page continuation also preserves a well-formed unknown association token: its structured entry and rendered hint disclose the continuing unknown-continuation state and failed command status. Offer a separate association restart that clears only after while preserving the other effective choices and exact answer target. Do not resolve the token against later Session history.

Expose bounded structured continuation entries in View descriptors, including JSON, for supported association-next, revision-next and association-restart actions when applicable. Each entry supplies the action and the normalized present request with the exact precise target and complete applicable effective format, source-detail and paging inputs, omitting controls unsupported by the retained variant. Retain next/nextPage and omission metadata; do not require a JSON consumer to reconstruct the request from those scalars. Unicode commands derive from the same entries and supplied canonical reference bindings, without lookup or allocation. Field names remain delegated. The entries are determined by existing answer/presentation/lifetime identity inputs, with kind-aware reference normalization. One-shot Views provide bounds, expiry and shell/new-request guidance, not executable continuation requests for the expiring answer.

#### Rationale and consequences

The existing full content and unpaged revision snapshots suffice for the current controls. There is no need to implement generic GUI parameters, a Presentation plugin language, arbitrary result collections or a new complete-content export. These bounded separations do not forbid future projection-scoped lazy materialization under its own qualified execution contract; this operation presents the already-retained content of the current eager families.

<a id="make-retained-and-fresh-actions-distinct"></a>
### Make retained and fresh actions distinct

#### Decision

Add a shell present command accepting an exact answer reference and supported presentation options. Move association and revision paging from fresh inspect requests to present. Reject these flags on every fresh Lens request with actionable guidance; only inspect previously accepted them. At shared subject-reference classification, refuse answer aliases and well-formed precise Projection IDs supplied as subjects to inspect, children, parents, summarize, explain, decompose or examine, with guidance to present. Recognizing the reference kind does not claim that the answer is retained or available. Preserve literal-name handling after -- and existing treatment of malformed or other unknown subject references. Use the same narrow answer-reference classification for one-shot commands before Session creation or name lookup: @-prefixed answer aliases and precise Projection IDs not passed as literals after -- receive active-Session/lifetime guidance and instructions to open a shell and request information there. Keep other one-shot @-name behavior and literal lookup after --. Subject-taking internal extension fixtures share this boundary. Generated continuation text names the exact answer. Do not reinterpret a repeated request as the last matching retained answer.

Existing Lens commands remain fresh selections. Human and structured output identify whether the action selected afresh or presented an exact retained answer. Fresh selection can reuse earlier work and return the same answer ID; neither a changed ID nor an equal ID establishes whether inference ran.

To request current information, issue the relevant Lens command. No separate refresh-from-Projection facility is introduced. Independently requested Lens commands do not require comparisons against every earlier answer. A future interaction replacing a displayed answer under a refresh action remains subject to the governing consequential-change disclosure rule.

During retained presentation, describe revision and reconsideration state as selected for that answer. Do not query current history merely to add a “new correction available” notice. Subject navigation is distinct: inspect @investigram may select newer context for the same original account and must not be advertised as another page of the retained answer.

#### Rationale and alternatives

A separate command is a small explicit distinction that later interfaces can preserve. Keeping old paging syntax would require a different UX and comparison/disclosure policy. With no established user base requiring compatibility, useful rejection guidance is preferable to preserving ambiguous paging behavior. A generic “results may change” warning is insufficient. An implicit current-answer slot introduces mutable targeting and ambiguous history selection that are unnecessary for this capability.

<a id="preserve-answer-identity-and-reference-lifetime"></a>
### Preserve answer identity and reference lifetime

#### Decision

Presenting a retained answer returns exactly its retained Projection ID and does not publish another Projection. Preserve immutable support and answer formulas; new presentation requests do not enter answer identity.

Expose a stable compact answer reference with the precise ID, including the retainedAnswers field of presentation-unavailable resolution results. The direct API accepts precise IDs; the CLI accepts precise IDs and compact answer references. Bind compact references in a distinct Session-local answer namespace. They identify Projections, not program entities, Lens subjects, request occurrences or Views. Preserve existing subject-reference bindings; answer allocation cannot steal or retarget them. Resolve an alias only through the active Session's existing answer bindings, never by searching record-ID hash prefixes. An unbound alias is “not bound in this Session”; a foreign precise ID can be identified and refused. An alias already bound locally denotes that local answer even if its spelling was copied from another Session. No Session-qualified token, implicit last-answer alias or persistent lookup service is included.

Allocate or retrieve the canonical alias during Session coordination, before arrangement, on both fresh and retained routes. For CLI execution this happens in the worker. Carry the alias in the View or resolution payload so parent rendering requires no binding. On fresh associated inspection, select the composite from the constructed mechanical Projection ID before arranging the base View, allocate the composite alias, then arrange the mechanical base, frozen listing and final composite output using the composite answer reference for the delivered answer. The delivered answer reference is the composite's. Composite selection allocates no subject references: mechanical binding still precedes associated-listing binding, with unchanged populations, order and collision behavior. Retained presentation resolves the existing composite instead of selecting again. One-shot output also allocates aliases for within-output correlation, with an expiry notice; it offers shell-opening/new-request guidance rather than a present command for an expiring answer.

View identity continues to reflect the retained Projection, responsible Presentation method and consequential exposed presentation/reporting inputs under each family's rules. Include an explicit fresh or retained mode marker in every family's View identity rather than relying on incidental lookup-context differences. The marker is exposed consequential context under the accepted rule. Fresh formulas retain existing title inputs where present and existing lookup/reporting context alongside the marker.

| Artifact | Retained-route identity inputs |
| --- | --- |
| Module, organization, dependency and internal exports View | Responsible Presentation method, exact Projection ID, selected Presentation/compatibility decision, effective format/source choices, lifetime, retained mode and neutral title where the family exposes one; dependency Views have no title, and resolution context is absent. |
| Investigation arrangement key | Responsible Presentation method, exact Projection ID, selected Presentation/choices, normalized association continuation, revision page (default 1), lifetime, retained mode, neutral title, absent resolution context and null current-attempt reporting. |
| Final investigation View | Responsible method, explicit usage-independent arrangement key and authoritative Session usage, preserving the existing finalization formula. |
| Associated-inspection View | Responsible method, exact composite Projection ID, base mechanical View ID in retained mode, normalized association continuation, lifetime and retained mode; the base determines title and Presentation choices. |

Fresh historical inspection also has null current-attempt reporting; the explicit mode keeps it distinct. Equal retained-route reporting means equal visible lifetime, effective Presentation decision and authoritative usage where included, with no attempt/reuse/provider report. Preserve kind-aware reference normalization and the disjoint unknown-token literal space.

Raw supplied target spelling and request occurrence IDs belong in separate request context and observation records, outside the View. The View exposes the resolved precise ID and canonical bound alias. Alias versus precise-ID targeting therefore yields equal View identity under otherwise equal inputs; canonical reference referents are normalized rather than hashed as arbitrary spelling. These presentation inputs do not redefine answer identity.

A presentation request does not recreate original lookup prose, request-specific provider diagnostics or an old usage report. Those are invocation context, not retained answer meaning. Preserve answer-relevant qualification and retained semantic outcome independently. A neutral title can use retained Lens meaning and the fixed Session catalog.

Keep current Session validity checks, invalidation and shutdown behavior as a bounded lifecycle limitation. Session invalidation does not make the historical answer itself invalid over its captured basis; the current lifecycle makes it unavailable. Its content and qualifications remain unchanged. Separating the lifetime of retained information from permission to continue investigating is conceptually valid and remains outside this work.

Retained references remain available only within the supported active Session. One-shot output discloses expiry at command end for every affected family; one-shot present is rejected before opening a new Session. Keeping output or observations does not preserve a live target. This work adds no persistence, eviction, reopening or invalidated-Session read mode. Supporting historical presentation after invalidation would require a separate lifetime/ownership decision.

#### Rationale and consequences

An answer can have multiple Views and multiple generating/consuming requests. Retaining a Projection does not identify one “original View” to replay. Small answer bindings improve human use without changing the domain ontology or introducing cross-session guarantees. Existing retained content and reference immutability remain distinct from future retention policy.

<a id="report-presentation-without-replaying-evaluation"></a>
### Report presentation without replaying Evaluation

#### Decision

Separate the retained answer's evaluation outcome from the current presentation outcome. Successfully displaying a qualified failed or unavailable answer completes the presentation request with failed: false and exit status 0, while keeping that historical outcome visible. It does not report a new analysis failure or attempt. Invalid targets/options, malformed continuations and incompatible presentation return current refusals. A well-formed unknown continuation retains its qualified View and existing failed command status. Fresh Lens requests retain their existing outcome semantics.

Report retained-content consumption with its real generating attribution. Do not fabricate reused-operation results, new attempts, current provider diagnostics or inference charges. Current Session usage may include intervening requests; it is reporting context, not part of the frozen answer. Retained selection status, guarantees and limitations do not change with that usage.

Carry the normalized presentation request through direct Session execution, worker delivery, parent finalization, output and observation. Parent rendering remains self-sufficient, with no core lookup, binding or selection. Preserve the explicit arrangement key and idempotent authoritative usage finalization. Preserve cancellation, no late publication and applicable validity checks.

Record the exact presented target, its actual composite/support relationships where needed to describe that answer, effective presentation choices, selection mode and actual output. For associated inspection, expose the composite variant and exact mechanical-support reference instead of relying on mechanical descriptor fields beneath a composite ID. A new presentation occurrence may reuse the same View ID; observation event/artifact identities still distinguish occurrences. Emit view-produced only for a real View and classify actual source exposure independently on each presentation. Non-View refusals carry no fake View or source export. Observation failure is disclosed without erasing a delivered result.

Advance the observation envelope to formatVersion 3 for the added request kind and presentation-versus-retained-outcome contract. The version-two prescription was scoped to the completed request-model change; preserve that historical record. Current producers, tests and documentation move together. Existing files remain untouched, with no migration, compatibility adapter or historical-reader promise. Experimental output-family labels remain governed by the [experimental-output decision](experimental-structured-outputs.md); advance responsible identity methods when their semantics change.

#### Rationale and consequences

Current investigation arrangement reconstructs outcome display through optional current reporting. Simply passing no execution report could hide retained failure qualification; fabricating a report could imply another attempt. Explicit separation avoids both errors.

Accurate presentation observations do not close the independently backlogged captured-basis export gap. Session-local IDs and configured paths do not identify all captured evidence after Session disposal. Preserve that limitation and do not claim durable answer replay or complete state attribution. An answer reference also cannot establish which earlier View supplied it, so general navigation-origin history remains separate.

## Governing impact and conformance

This decision supplements existing accepted contracts; it does not replace a headed decision. The application specification and core concepts already define exact retained presentation and its distinction from pinned requests. Their definitions remain unchanged. The architectural constraints state the supported request boundary for current eager families.

Preserve the [qualified-construction](qualified-construction-under-the-request-model.md) answer/View identity and support rules, the [request model](lens-application-and-request-outcomes.md) non-View and compatibility rules, [compact attribution](compact-attribution-and-complete-results.md), [reference lifetime disclosure](reference-lifetime-disclosure.md), [execution ownership](execution-ownership-and-cancellation.md), and source/observation obligations. New retained requests extend those paths; existing fresh Lens semantics remain in force except the explicitly adopted surface and disclosure changes inventoried below.

The affected preservation clauses are:

| Existing contract | Treatment in this decision |
| --- | --- |
| Qualified-construction association continuation and unknown-token identity | Preserve the qualified unknown-continuation View, literal key space and failed status; reject only malformed syntax before arrangement. |
| Qualified-construction answer/View support and identity | Preserve immutable answer formulas and fixed support. Extend consequential View inputs with the exposed mode marker and retained-route context; preserve family separation and usage finalization. Advance methods.presentation, methods.investigationPresentation and methods.exportsPresentation. The captured method registry can consequently change analysis-input references and Projection IDs between builds; this permitted provenance effect is separate from exact within-Session continuity and does not change answer formulas or require supersession. Expose the associated composite variant and exact mechanical support instead of an ambiguous descriptor. |
| Request-model verification requirement for human agreement on other consequential visible changes | Acceptance records human agreement to these consequential visible changes: present, removal of fresh paging flags, answer aliases and their worker allocation, the new subject-support allocation path and possible later collision lengths, mode labels/neutral titles, explicit composite descriptors, structured continuation requests in View descriptors, shared answer-as-subject guidance including one-shot lifetime guidance, and observation version three; implementation still requires separate authorization. Existing subject bindings and fresh allocation schedules remain unchanged. |
| Investigrams progressive paging and historical “redisplay” | Its “redisplay” follows replacement chains and therefore means fresh selection. Exact retained presentation never follows later chains. Move paging to present with answer-wide revision hints; preserve separately labelled subject navigation and bounded population/qualification reporting. |
| Reference lifetime, compact attribution and execution ownership | Preserve Session-local bindings, accurate consumption/generating attribution, cancellation, validation and no late publication. Add one-shot disclosure for all references in affected program Views without extending lifetime. |

These are supplementary rules for the new operation and explicitly adopted surface changes, not replacement of a headed decision. Historical records remain unchanged.

The CLI currently lacks this operation. Adoption adds no conformance claim; the companion plan must establish it through continuity tests across intervening corrections, association changes and materialization, all supported families, direct/worker publication, refusals, stable references, source disclosure and usage finalization. No foundation or process-document change is included.
