# Present exact retained answers independently of fresh selection

Status: in preparation
Decided: [Needs review]
Arising from: [Exact retained-answer presentation](../plans/exact-retained-answer-presentation.md)
Scope: retained presentation in the current transient Session API and CLI, qualified content compatibility, references, identity and reporting

## Context

Current commands coordinate a fresh Lens application before producing each View. They can reuse completed analysis, yet select newer correction or association state when a person only intended to page or reformat an earlier answer. The qualified-construction work already retains the full selected interpretation and revision state. Its fixed-reference content resolvers provide the basis for exact presentation without creating a second answer archive.

The [continuity contract](coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes) distinguishes an exact retained Projection from a repeated request, including a request against pinned program inputs. The [request model](lens-application-and-request-outcomes.md) separates immutable qualified answers from designation, invocation reporting and Presentation choices. This decision makes those distinctions operable for existing families.

The recommendations marked Q1–Q3 remain for human resolution in the accompanying plan. The record is not ready for acceptance while those annotations remain.

## Decisions

<a id="request-an-exact-retained-answer"></a>
### Request an exact retained answer

Expose retained presentation as a request kind distinct from a Lens application or operational report. It designates an exact retained Projection and new presentation inputs. It does not designate a new subject, change Lens parameters, request another input binding or reconstruct an original request.

Resolve the target to a supported retained record in the active Session, then follow only its fixed support. Preserve the selected captured basis, interpretations, corrections, associations, reconsideration snapshot, qualification and relevant evaluation outcomes. Do not run subject lookup, Evaluation, new core selection or evidence acquisition to satisfy this operation. Current validity checks remain a separate lifecycle concern.

Support the current mechanical families, investigation request/historical-inspection variants and associated-inspection composite. Resolve an associated answer's exact mechanical support as well as its frozen interpretation selection. Treat its composite ID as the target; presenting only its mechanical base would be a different answer. The internal exports fixture uses the same boundary.

Reject unknown, foreign or wrong-kind targets and incompatible presentation inputs as non-View resolution results preserving the actual request, target, reason and any valid retained answer reference. Do not fall back to the current answer for a subject. Missing required supporting records for a retained valid Projection are an internal defect. Preserving a reference does not establish that its content is currently available.

Reject mixed fresh/retained forms and malformed options without invoking selection. A valid retained failed, unavailable, partial or empty answer remains an answer. Its incomplete materialization does not by itself make presentation invalid.

#### Rationale and alternatives

Repeating an input-pinned request still permits different interpretation selection or newly completed analysis. Inspecting an exact investigram fixes that account but not the correction/association context of its inspection. Replaying bounded JSON loses content and support that another page or presentation may need. Resolving existing retained records is sufficient for the assessed implementation; a new retained View store, generalized registry or duplicate content archive is unnecessary.

<a id="check-presentation-against-retained-content"></a>
### Check Presentation against retained content

Retained compatibility uses the supplied content's semantic contract, variant, supporting expansions and qualified materialization. It does not require another Lens application. Fresh request planning continues to declare prospective Presentation requirements before Evaluation; both routes use shared declarations and arrangement contracts.

Keep Presentation choice, parameters and reporting/context explicit enough that the retained route can supply format, source disclosure and paging without fabricating a Lens request. Ordinary context is not automatically identity-neutral: reference lifetime and authoritative usage can change the presented artifact. Retain the accepted family identity rules.

Arrangers consume resolved qualified content and explicit supplied reference populations. They do not receive a record store, lookup callback or current-history selector. Extract needed reference coordination from existing convenience wrappers without moving answer selection into Presentation. Preserve existing subject-binding schedules and collision behavior for valid fresh requests. Retained presentation binds only the populations fixed by its answer; it does not enumerate current Session populations to reproduce a fresh request's preparation.

Reformatting, supported paging and supported disclosure of already supplied captured evidence preserve the answer. If an option requires unselected information, refuse it and explain the need for a new information request. Additional information already elsewhere in the Session is still outside this answer. A declared fallback can accommodate qualified partial/unavailable content while preserving explicit choices and identifying the change of Presentation.

Continuation resolution is confined to the retained listing and stable bindings supplied for it. A token that exists only in a later answer is not a valid continuation for the earlier one. Invalid continuations produce non-View refusal. A valid numeric page beyond the retained range can produce an explicitly empty bounded page; it does not acquire further history or change the answer.

Omitted page inputs normalize to the first page/no continuation; source detail defaults off; format follows the interface default. A Projection reference does not denote a previous View or inherit that View's options. Effective choices are recorded.

#### Rationale and consequences

The existing full content and unpaged revision snapshots suffice for the current controls. There is no need to implement generic GUI parameters, a Presentation plugin language, arbitrary result collections or a new complete-content export. These bounded separations do not forbid future projection-scoped lazy materialization under its own qualified execution contract; this operation presents the already-retained content of the current eager families.

<a id="make-retained-and-fresh-actions-distinct"></a>
### Make retained and fresh actions distinct

[Needs review Q1: this heading develops the recommended paging migration.]

Add a shell present command accepting an exact answer reference and supported presentation options. Move association and revision paging from fresh inspect requests to present. Reject the old combination with actionable guidance; generated continuation text names the exact answer. Do not reinterpret a repeated request as the last matching retained answer.

Existing Lens commands remain fresh selections. Human and structured output identify whether the action selected afresh or presented an exact retained answer. Fresh selection can reuse earlier work and return the same answer ID; neither a changed ID nor an equal ID establishes whether inference ran.

To request current information, issue the relevant Lens command. No separate refresh-from-Projection facility is introduced. Independently requested Lens commands do not require comparisons against every earlier answer. A future interaction replacing a displayed answer under a refresh action remains subject to the governing consequential-change disclosure rule.

During retained presentation, describe revision and reconsideration state as selected for that answer. Do not query current history merely to add a “new correction available” notice. Subject navigation is distinct: inspect @investigram may select newer context for the same original account and must not be advertised as another page of the retained answer.

#### Rationale and alternatives

A separate command is a small explicit distinction that later interfaces can preserve. Keeping old paging syntax would require a different UX and comparison/disclosure policy. A generic “results may change” warning is insufficient. An implicit current-answer slot introduces mutable targeting and ambiguous history selection that are unnecessary for this capability.

<a id="preserve-answer-identity-and-reference-lifetime"></a>
### Preserve answer identity and reference lifetime

Presenting a retained answer returns exactly its retained Projection ID and does not publish another Projection. Preserve immutable support and answer formulas; new presentation requests do not enter answer identity.

[Needs review Q3: the following paragraph develops the compact-reference recommendation.]

Expose a stable compact answer reference with the precise ID, including in resolution results that identify retained answers after display failure. The direct API accepts precise IDs; the CLI accepts precise IDs and compact answer references. Bind compact references in a distinct Session-local answer namespace. They identify Projections, not program entities, Lens subjects, request occurrences or Views. Preserve existing subject-reference bindings; answer allocation cannot steal or retarget them. No implicit last-answer alias or persistent lookup service is included.

View identity continues to reflect the retained Projection, responsible Presentation method and consequential exposed presentation/reporting inputs under each family's rules. Preserve explicit continuation normalization and investigation usage-independent arrangement keys. Reference alias spelling and incidental routing do not redefine answer identity.

A presentation request does not recreate original lookup prose, request-specific provider diagnostics or an old usage report. Those are invocation context, not retained answer meaning. Preserve answer-relevant qualification and retained semantic outcome independently. A neutral title can use retained Lens meaning and the fixed Session catalog.

[Needs review Q2: retain current Session validity checks, invalidation and shell shutdown for this slice.]

Retained references remain available only within the supported active Session. One-shot output discloses expiry at command end for every affected family; one-shot present is rejected before opening a new Session. Keeping output or observations does not preserve a live target. This work adds no persistence, eviction, reopening or invalidated-Session read mode. Supporting historical presentation after invalidation would require a separate lifetime/ownership decision.

#### Rationale and consequences

An answer can have multiple Views and multiple generating/consuming requests. Retaining a Projection does not identify one “original View” to replay. Small answer bindings improve human use without changing the domain ontology or introducing cross-session guarantees. Existing retained content and reference immutability remain distinct from future retention policy.

<a id="report-presentation-without-replaying-evaluation"></a>
### Report presentation without replaying Evaluation

Separate the retained answer's evaluation outcome from the current presentation outcome. Successfully displaying a qualified failed or unavailable answer completes the presentation request, while keeping that historical outcome visible. It does not report a new analysis failure or attempt. Invalid targets/options/continuations and incompatible presentation return current refusals. Fresh Lens requests retain their existing outcome semantics.

Report retained-content consumption with its real generating attribution. Do not fabricate reused-operation results, new attempts, current provider diagnostics or inference charges. Current Session usage may include intervening requests; it is reporting context, not part of the frozen answer. Retained selection status, guarantees and limitations do not change with that usage.

Carry the normalized presentation request through direct Session execution, worker delivery, parent finalization, output and observation. Parent rendering remains self-sufficient, with no core lookup, binding or selection. Preserve the explicit arrangement key and idempotent authoritative usage finalization. Preserve cancellation, no late publication and applicable validity checks.

Record the exact presented target, its actual composite/support relationships where needed to describe that answer, effective presentation choices, selection mode and actual output. For associated inspection, expose the composite variant and exact mechanical-support reference instead of relying on mechanical descriptor fields beneath a composite ID. A new presentation occurrence may reuse the same View ID; observation event/artifact identities still distinguish occurrences. Emit view-produced only for a real View and classify actual source exposure independently on each presentation. Non-View refusals carry no fake View or source export. Observation failure is disclosed without erasing a delivered result.

Advance the observation envelope to formatVersion 3 for the added request kind and presentation-versus-retained-outcome contract. The version-two prescription was scoped to the completed request-model change; preserve that historical record. Current producers, tests and documentation move together. Existing files remain untouched, with no migration, compatibility adapter or historical-reader promise. Experimental output-family labels remain governed by the [experimental-output decision](experimental-structured-outputs.md); advance responsible identity methods when their semantics change.

#### Rationale and consequences

Current investigation arrangement reconstructs outcome display through optional current reporting. Simply passing no execution report could hide retained failure qualification; fabricating a report could imply another attempt. Explicit separation avoids both errors.

Accurate presentation observations do not close the independently backlogged captured-basis export gap. Session-local IDs and configured paths do not identify all captured evidence after Session disposal. Preserve that limitation and do not claim durable answer replay or complete state attribution. An answer reference also cannot establish which earlier View supplied it, so general navigation-origin history remains separate.

## Governing impact and conformance

This decision supplements existing accepted contracts; it does not replace a headed decision. The application specification and core concepts already define exact retained presentation and its distinction from pinned requests. Their definitions remain unchanged. The accompanying architectural-constraint addition states the supported request boundary for current eager families.

Preserve the [qualified-construction](qualified-construction-under-the-request-model.md) answer/View identity and support rules, the [request model](lens-application-and-request-outcomes.md) non-View and compatibility rules, [compact attribution](compact-attribution-and-complete-results.md), [reference lifetime disclosure](reference-lifetime-disclosure.md), [execution ownership](execution-ownership-and-cancellation.md), and source/observation obligations. New retained requests extend those paths; existing fresh Lens semantics remain in force except the explicitly approved paging surface change.

The CLI currently lacks this operation. Adoption adds no conformance claim; the companion plan must establish it through continuity tests across intervening corrections, association changes and materialization, all supported families, direct/worker publication, refusals, stable references, source disclosure and usage finalization. Resolve Q1–Q3 before acceptance. No foundation or process-document change is included.
