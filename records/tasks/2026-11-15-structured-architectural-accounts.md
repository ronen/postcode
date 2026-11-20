# Implement structured architectural accounts

Status: active
Opened: 2026-11-15
Closed:

## Task

please implement the approved plan at `docs/plans/structured-architectural-accounts.md`.  This is explicit authorization
to begin the substantive implementation task described by that plan.

## Follow-ups

2026-11-15, after the M1 implementation (`2bc5b86`), checkpoint record and review handoff were committed and before any independent review was arranged:

> Please address this feedback on the M1 implementation choices before I arrange the independent M1 checkpoint review. Read it against the adopted decisions and current implementation. Make straightforward conformance fixes within the existing task; bring back any consequential semantic choice before implementing it.
>
> 1. Deterministic Entity IDs are acceptable.
> The adopted contract does not require random IDs. Scoped deterministic digests are compatible with identity resolution and stable references, without establishing cross-session or cross-basis equivalence.
>
> However, deterministic IDs do not by themselves guarantee deterministic semantic ordering. Checkpoint choice 9 says ledger enumeration follows acceptance order. Distinguish that enumeration from mechanical answer ordering, and identify how M2 will verify equivalent mechanical answers when independent contributions arrive in different orders. Revise the checkpoint’s rationale accordingly.
>
> 2. Same-target supersession is consistent with the adopted design.
> Restricting supersession to the same Entity and compatible role class, or the same Query result, implements the existing contract. Cross-target changes use withdrawal plus addition.
>
> Different topical keys may remain compatible: an investigator can explicitly replace a topic with a differently named topic and explain why. Structural validation should not attempt to establish their semantic equivalence.
>
> 3. Designation membership concerns should propagate to recipients of that designation.
> If D designates association A, a producer receives D, and A is subsequently displaced, that producer can acquire a concern through D’s membership. The adopted D1/A example already supports this behavior.
>
> Preserve the distinction between receiving a designation and receiving its members’ content. Record the membership route without inventing content delivery. Verify the controls: discovery-only handles, the same content received through an unrelated association, known changes at delivery, and exact change notices received before submission.
>
> Describe this as implementing the intended propagation contract, rather than an additional conservative policy.
>
> 4. A separate contribution ledger is acceptable.
> The decisions require a consistent identity/information contract, not one physical store. M2 should demonstrate integration with existing program records, preserving qualification, reference integrity and Session lifetime without competing Entity identities or a permanent parallel organizing regime.
>
> 5. Explain the additional restriction on agentic qualifications.
> Checkpoint choice 5 and ledger.ts reject all provider Claim-context references in agentic qualifications, alongside guarantees and stronger epistemic statuses.
>
> Referencing an existing context does not inherently strengthen a claim; it may preserve attribution or limitations. Explain:
> - Exactly what the qualification `contexts` field means.
> - Why any such reference from an agentic contribution would violate that meaning.
> - How an agentic contribution reusing mechanical content preserves the source’s qualification without inheriting its guarantee.
> - Whether this is merely a restriction on that particular field, with a separate supported path for source context, or whether legitimate qualified reuse is being prohibited.
>
> Ground the answer in the adopted contracts. If the restriction is unnecessarily broad, propose the smallest correction. Do not introduce a new epistemic-policy rule merely to justify the implementation.
>
> Update the checkpoint and descriptive architecture documentation with the clarified rationale and any resulting fixes. Preserve the task’s review-record requirements, run checks appropriate to any changes, and report what changed and whether anything still needs human resolution.
>
> This feedback prepares M1 for independent review; it does not replace that review or constitute checkpoint acceptance. Leave the implementation ready for me to arrange the M1 checkpoint review.

2026-11-16, received while the second round 2 reviewer's findings (F1–F3 of the Claude round 2 record) were being corrected; those corrections were committed as `9ca9865` before this follow-up was acted on:

> Also, please record the reviewer’s observation about displacement disclosure as a clarification of the existing delivery contract.
>
> When an investigator acquires association A and is informed that B superseded it, delivery of A and B’s qualified displacement context does not itself constitute acquisition of B’s replacement use or content.
>
> “Reasons only” should mean sufficient qualified displacement context: the exact declaration, affected use, operation, grounds and replacement reference. It must not mean an isolated explanation stripped of qualification or traceability. Record what was actually delivered; the explanation retains its own provenance and exposure implications.
>
> Consequently, if C later displaces B, a recipient of only A and that displacement context does not automatically acquire C as another reconsideration cause. The historical displacement of A remains. Actual acquisition of B, or another relevant exposure path, can make C applicable.
>
> Check that the implementation and existing tests preserve this distinction. Add focused coverage if it is missing, distinguishing:
> - acquiring A with displacement context and a reference to B;
> - actually acquiring B’s replacement use/content;
> - the effects of a later displacement of B.
>
> Update the checkpoint and descriptive documentation as appropriate. Treat this as clarification of the adopted contract, not a new propagation policy. If you find a conflict with the governing text or actual behavior, report it rather than silently changing semantics.
>
> Report the changes and verification. This clarification does not itself constitute M1 checkpoint acceptance.

2026-11-16, after the clean round 7 review of `22698ae`, with Milestone 2 still on hold at the human's direction ("don't move on to M2 yet, next i'll be looking at the open question and will review the other choices you made"). On the open secondary-standing question recorded in the M1 checkpoint:

> Keep the existing reference-versus-notice rule; automatic enrichment of secondary standing is not required.
>
> Check the existing producer/result-delivery path: when a secondary investigation returns C, including its declaration that C supersedes B, the invoking producer must receive that qualified declaration and have its actual delivery recorded. Fix any omission in the existing path.
>
> Add a controlled test where an outer producer receives B, invokes secondary work that supersedes B with C, receives that result, and then submits. C must not become a reconsideration cause for that output. Preserve controls where the change was not disclosed or only a bare reference was supplied; invocation alone establishes no knowledge.
>
> Do not introduce new nested-execution machinery or notification of unrelated side effects merely for this case. If the required delivery path does not yet exist, identify that concrete integration gap rather than claiming it has been verified.
>
> Record the resolution and verification in the checkpoint. M2 must additionally demonstrate the behavior through the real dialog integration.

2026-11-16, after the secondary-standing resolution was verified and recorded (`73fe7a9`, `ca5ba19`). The "other choices" are the implementation choices in the M1 checkpoint record, including the implementing agent's scope judgment to correct attempt fulfillment in M1:

> your other choices are approved.  M1 is satisfied.

2026-11-17, during Milestone 2. The implementing agent proposed four focused live-agent trials and asked about route, ceiling and elicitation. Proposal as put to the human: run on Cockatiel at the commit pinned by the earlier assessments (`80b5ed6`), whose CircuitBreakerPolicy has the plan's representative circuit-breaker states; (1) state-behavior on CircuitBreakerPolicy, expecting a state model and diagram; (2) invoke a retained follow-up option from trial 1; (3) an explicit fresh investigation of trial 1's question, to observe identity reuse, acquisition before change, and supersede-versus-add; (4) state-behavior on a second policy module, to check for name conflation and honest "no state" handling; mid-dialog change notices to stay covered by deterministic tests only. The human's selections:

> Route: ChatGPT plan (Recommended) — Sign in with ChatGPT, gpt-5.6-sol at medium reasoning: the route and model the earlier assessments used.
>
> Ceiling: 60 requests (Recommended).
>
> Elicitation: Ask for options in trial 1 (Recommended) — Trial 1's request deliberately asks the agent to propose at least one follow-up investigation, as the plan allows for eliciting optional actions. Recorded as elicited, not spontaneous.

2026-11-17, implementation handover from Claude to Codex at the Milestone 2 checkpoint:

> Please continue the active task 2026-11-15-structured-architectural-accounts in ../app-worktrees/structured-architectural-accounts-impl on its existing branch. Implementation is handed over from Claude to you. Record this instruction as a task follow-up first. Milestone 2 awaits its checkpoint review (handoff records/reviews/structured-architectural-accounts/2026-11-17-m2-vertical-handoff.md). When findings arrive, address them under dev/review\.md. Do not start Milestone 3 until I say the checkpoint is sufficient. Raw trial captures are in the worktree's ignored \_trials/

2026-11-17, after receiving the M2 round 1 findings. The implementing agent prepared three additional Cockatiel instruction-usability trials on the same ChatGPT route/model, capped at the remaining 21 requests from the original ceiling of 60. The proposal was to create explicitly hypothetical conflicting claims, compare/reuse/partition qualified content with an illustration, then withdraw an explicitly temporary use. The question offered running these trials or leaving the live-trial gap open for checkpoint discussion. The human selected:

> Run the three prepared trials within the remaining 21 requests

2026-11-17, after the [clean M2 round 3 review](../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-3-findings.md) and [round 2 corrections intent check](../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-2-corrections-intent-check-claude.md), both concerning implementation target `56995015770f4c1a8bf4a91ca179526884dafd97`:

> round 3 review and another intent check are clean.  but because this is a such core functionality i'll get some more independent reviews before moving to M3

2026-11-17, while addressing round 4 finding R4-F1. The implementing agent asked: "For R4-F1, should each retained follow-up option’s exact owner/key be part of its question identity? This keeps different options separate even when their operation and subjects match; repeated invocation of the same option can still reuse its answer." The human selected:

> Use exact option identity (recommended)

2026-11-17, after the clean round 5 re-review of `6f72f86`:

> The latest re-review is complete and reports no actionable findings. I accept the consequence of exact option identity: follow-up-option requests and ordinary requests do not automatically share answers, while their retained content remains available for reuse.\
> \
> Before deciding the M2 checkpoint, please run the focused live verification below. Record this direction under the task protocol.\
> \
> I authorize up to 11 additional inference requests using the same route/model and pinned Cockatiel fixture as the earlier trials. Stop at that limit and report any incomplete verification.\
> \
> Exercise this chain through the application:\
> \
> 1\. Request a suitable investigation and explicitly ask it to include an applicable follow-up option. The trial prompt must not supply operation names, subject signatures, request shapes or result-contract identifiers. The agent must obtain those from the actual production instructions.\
> 2\. Invoke the returned option through the application.\
> 3\. Verify that the option is accepted and invocable, its exact identity and retained meaning reach the subsequent investigator, and the resulting contribution and contract fulfillment are handled correctly.\
> \
> Use the normal production instructions and repair behavior. Do not require exact architectural wording or spontaneous option generation. If the trial fails, preserve and report the failure rather than adding missing guidance to the trial prompt.\
> \
> Update the durable trial record with the elicitation, implementation revision, inference usage, observed behavior and limitations, following the existing evidence conventions. Distinguish successful execution from the architectural correctness of the generated explanation.\
> \
> This is focused verification, not a rerun of the full live suite. Completion of the re-review does not itself accept the M2 checkpoint or authorize starting M3. Report the trial outcome for independent review.

2026-11-17, after the first focused option-verification attempt hit the normal elapsed-dialog limit, using four of the eleven authorized requests. The retry will use the unchanged elicitation, route/model, fixture and production limits, within the seven requests remaining in the existing authorization:

> Possibly it's worth trying the trial again?

2026-11-17, during the unchanged focused retry, after asking whether seven requests would suffice. This adds ten inference requests to the existing cumulative ceiling of sixty, for a new ceiling of seventy; all other trial constraints remain unchanged:

> let's increase the cap with an additional ten

2026-11-17, after the original implementer’s round 6 corrections intent check:

> Please address both observations in:\
> \
> records/reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-6-corrections-intent-check-claude.md\
> \
> Record this direction under the task protocol and follow the repository’s review-response workflow.\
> \
> 1\. Hidden reconsideration status in export answers\
> \
> Keep the captured status and expose it in the export presentation, following the existing contribution-answer approach.\
> \
> If a displacing declaration’s producing context needs reconsideration, make that visible and preserve access to its exact causes. Attribute the concern to the organizing declaration/its production—not to the mechanical export finding. Do not imply that the displacement has been reversed or that the earlier association has been reinstated.\
> \
> Add focused verification that a later cause is visible in a fresh export answer, while exact presentation of an earlier retained answer preserves its captured state.\
> \
> 2\. Unexplained component selector\
> \
> Clarify the production instructions: what `component` means, where supported component selectors come from, and that an arbitrary content-body field name is not automatically a valid selector. Tell agents to omit `component` and target the whole item when no supported selector is available.\
> \
> Keep the observed `component: "unsupported"` submission as a regression case. Verify the instruction/schema/validation agreement and the normal repair path. Do not broaden selector semantics merely to accept that mistaken submission.\
> \
> Run the relevant offline checks and record the corrections and verification for independent review. Do not rewrite the historical review.\
> \
> No additional live inference is authorized by this instruction. State clearly that the revised instructions have not yet been verified live. These fixes do not accept the M2 checkpoint or authorize starting M3.

2026-11-17, authorizing focused live verification of the revised component-selector instructions at implementation `2ed7b5f`. Use the same fixture, route/model and unchanged elicitation, with normal production repair. Thirty additional requests are a hard ceiling, not a usage target; the unused request from the earlier allowance is not added to this new run's allowance. Further attempts must resolve a specific uncertainty, and all evidence is preserved:

> Go ahead with a cap of 30 additional requests. Record this under the task protocol, and make further attempts only to resolve specific uncertainties. Preserve the evidence for review; M2 remains unaccepted.

2026-11-17, responding to the preserved round 8 review. Execution will use a new hard ceiling of 30 additional inference requests, following the previous focused trial approach; further attempts must resolve a specific uncertainty. M2 remains unaccepted and M3 remains on hold.

> Round 8 review is ready.  Regarding R8-F1:
> \
> Clarify `report.answer` in the production instructions and hosted schema:- The submission’s own answer designations already count as its answer; agents need not repeat them in `report.answer`.- The field allows an investigator to explicitly return existing answer designations for this invocation—for example, when an earlier answer remains adequate and no new designation is needed.- Entries reference answer-designation declarations, not invocation handles, Query results or arbitrary dialogue handles.- Describe the exact reference forms validation accepts, including applicable local references. Replace the misleading generic description asking only for “an exact handle supplied in this dialogue”.Preserve existing semantics. Do not prohibit harmless repetition of the submission’s own designations merely to enforce the preferred authoring style. Explicitly returning an existing answer must not clear its reconsideration causes.Retain the observed invocation-handle mistake as a regression case. Add focused offline verification of the instructions/schema agreement, valid existing-designation references, own-designation handling, and rejection/repair of the invalid invocation reference.Verify with a focused live trial, using our previous approach to retries, with a large enough cap to be able to perform the test effticvely.

2026-11-17, authorizing the proposed narrow live check of the R9-F1 wording correction at `4267a05`: an initial answer followed by a fresh adequacy review, using the same pinned fixture, route/model and normal production repair, with a new hard cap of 20 requests. Further attempts must resolve a specific uncertainty; preserve all evidence. M2 remains unaccepted and M3 remains on hold.

> Go ahead with the live inference

2026-11-17, after round 10, clarifying the scope of live follow-up contract evidence and checking current offline coverage. The accompanying reviewer note repeats the non-null-contract limitation alongside the accepted remaining limitations; it will be preserved separately from implementation interpretation.

> Please reconcile the follow-up result-contract evidence:
>
> The latest review says a non-null follow-up contract has not been demonstrated live, but m2-trials/README.md says the earlier trial 2 answered under its option’s promised state-diagram contract.
>
> Check the underlying evidence and clarify whether the limitation applies only to the latest focused trials or to the live evidence overall. Preserve any relevant differences between implementation revisions and elicitation conditions; do not claim the earlier trial proves more than it does.
>
> Also confirm that current offline tests cover forwarding and enforcing a follow-up option’s result contract. Add focused coverage if it is missing.
>
> Record the clarification and verification using the repository’s review-response workflow, without rewriting historical reviews. Report any actual gap that remains. No additional live inference is authorized.
>
> The other observations—limited reliability/correctness evidence, offline-only lifecycle cases, the single repair attempt and the missing hosted-agent configuration path—can remain explicit limitations or later-milestone obligations.

2026-11-18, authorizing the proposed focused live check of a follow-up option promising a non-null result contract under current production guidance and exact-option identity. Use the same pinned Cockatiel fixture and route/model, natural-language elicitation asking for a follow-up whose answer includes a state diagram, and no supplied protocol identifiers, reference shapes or operation names. Invoke the returned option through the application with normal production repair. The new hard cap is 20 additional requests; further attempts must resolve a specific uncertainty and all evidence is preserved. M2 remains unaccepted and M3 remains on hold.

> ok do it

2026-11-18, resolving the round 11 observation about capability availability in retained follow-up options.

> review round is complete.  Please record the resolution of the reviewer’s observation about unknown result contracts in follow-up options:
>
> Keep capability-availability validation at invocation time, consistently for both operations and result contracts. A well-formed option may be retained even when its operation or contract is unsupported; invocation must refuse it with a clear explanation.
>
> Continue rejecting structurally malformed options at authoring. Agent instructions should direct authors to the supplied catalogue when creating executable options, without turning catalogue availability into a retention-validity requirement.
>
> Follow the task and review-response workflow. Confirm that existing tests cover retention followed by explicit invocation refusal for an unknown contract and an unsupported operation; add focused coverage only if missing. No additional live inference is needed.
>
> This records the design choice; it does not accept the M2 checkpoint or authorize M3.

2026-11-18, accepting the M2 checkpoint and authorizing progression to M3, subject to any remaining blocking concern identified before transition. The task remains active and later review gates remain applicable.

> ok, unless you can think of anything else, i think we're good to move on to M3

2026-11-18, continuing on the existing branch after M2 acceptance:

> Please continue task `2026-11-15-structured-architectural-accounts` in `../app-worktrees/structured-architectural-accounts-impl` on its existing branch. M2 is accepted; its disposition is `records/reviews/structured-architectural-accounts/2026-11-18-m2-vertical-disposition.md`. Begin M3 under the approved plan, starting with remaining mechanical-family migration. Preserve the separate mechanical and agentic/caller review checkpoints. No additional live inference is authorized.

2026-11-18, requesting investigation of memory at the corrected M3 mechanical revision, with exact historical answers preserved:

> Can you investigate the high memory? &#x20;
>
> - Profile the **current corrected revision**, separating canonical retained information, duplicated answer support, and temporary allocations.
> - Measure repeated identical requests versus distinct answers over overlapping information. Check whether retained memory stabilizes where expected.
> - Investigate sharing immutable content/evidence while separately capturing each answer’s time-dependent standing and reconsideration causes.
> - Explain the elevated post-close heap on the representative workload; the small-fixture collection test doesn’t settle that.
>
> The constraint is **preserving exact historical answers**. Replacing copies with references must not make an old answer acquire today’s standing or require fresh analysis. Sharing immutable records may achieve that without changing semantics; you should establish which representation fits the existing lifetime and delivery contracts.
>
> We're not necessarily trying to return to the old memory footprint; but we should  resolve whether the dominant growth is necessary information or avoidable duplication

2026-11-18, after the corrected-revision memory investigation was committed as `9683fea`:

> Please implement the ownership-aware sharing recommended in:\
> \
> records/validation/structured-architectural-accounts/m3-memory-investigation.md\
> \
> This is authorized M3 implementation work. Record this direction under the task protocol.\
> \
> Share internally owned immutable content and evidence at retention/capture boundaries, while preserving each answer’s independently captured selection, standing, reconsideration causes and other time-dependent state.\
> \
> Preserve the existing contracts:\
> \- Historical answers remain self-contained and immutable. Exact presentation must not consult current ledger state or require a live Session.\
> \- Untrusted external input remains isolated from caller mutation; an arbitrary frozen object is not proof of deep ownership.\
> \- Sharing neither creates nor removes exposure records.\
> \- Session validation, collision checks, atomic acceptance and plain structured worker delivery remain intact.\
> \
> Use the prototype as evidence, not production code to adopt unchanged. Bound ownership bookkeeping to the appropriate lifetime; avoid its module-global registry-capacity problem. Leave the concrete implementation to your judgment.\
> \
> Verify multiple simultaneous Sessions, retained answers after close, ownership-bookkeeping disposal, mutation isolation, historical snapshot preservation, collision/atomic validation and worker delivery. Run the full suite and repeat the representative memory measurement against the corrected baseline, recording memory, answer identities and retained counts.\
> \
> Keep temporary canonicalization/allocation optimization separate from this change.\
> \
> Update the implementation documentation and validation records, and prepare the change for independent review. This does not accept the M3 checkpoint

2026-11-18, accepting the M3 mechanical checkpoint, including its reviewed ownership-sharing correction at `08f6cde`, and authorizing continuation of the separate agentic/caller migration under the approved plan. The later agentic/caller checkpoint and M4 integrated review remain required; no additional live inference is authorized.

> I accept the M3 mechanical checkpoint, please continue implementation

2026-11-18, directing the caller migration under the accepted investigation-attempt/answer-outcome decision at `bd9f581`. The separate caller checkpoint and M4 review remain required; no inference is authorized.

> The conflict has been resolved by accepted decision investigation-attempts-and-answer-outcomes.md, commit bd9f581, already in this worktree. Record the implementation direction as a task follow-up, then complete the migration under that decision and its verification requirements.

2026-11-18, accepting the M3 caller checkpoint at `4a4d060` after the clean round 2 review, and directing continued work under the approved plan. The remaining integration, legacy retirement and final review are M4; this interpretation follows the completed M3 checkpoints. No additional live inference is authorized, and final integrated-review acceptance remains separate.

> ok, M3 called acceptance is good, continue with M3

2026-11-19, resolving full integrated-review round 3 finding F3: explicitly selected input context in retained follow-up requests is to be delivered using the existing acquisition, bounds and actual-dispatch exposure rules. This follows the review-workflow request to choose delivery versus rejection; no new hosted authoring capability or live inference is authorized.

> Deliver context using the existing acquisition, bounds and exposure rules (recommended)

2026-11-19, after clean integrated rereview round 4, authorizing completion of hosted follow-up-option context authoring and focused live verification. This supersedes the earlier no-additional-inference restriction only for this focused verification. Under `dev/workflow.md` verification policy, the implementing agent estimates 8–16 requests for authoring and invocation and chooses a new hard cap of 30, including failures, structural repair and targeted retries. Use the established ChatGPT-plan route, `gpt-5.6-sol` with medium reasoning, pinned Cockatiel fixture and unchanged production execution limits; stop when the objective is met. Final independent review and human sufficiency remain separate.

> The re-review is in; as you will see it doesn't find any new major issues.  But I do have a request re the minor note regarding the instructions to agents about context:  Please complete the follow-up-option context authoring path.\
> \
> The retained option model already accepts explicitly selected context, request identity includes it, and invocation delivers it under the existing acquisition, bounds and exposure rules. However, the hosted submission schema and option-authoring instructions omit it.\
> \
> Let agents supply optional request.context and explain its purpose in the authoring instructions. Use the existing semantics and supported reference types: context is additional selected input, distinct from the investigation’s subjects, and need not be supplied on every option.\
> \
> Follow the task and review-response workflow, add appropriate offline verification, and verify authoring and invocation with a focused live trial under the established inference policy. Record the results for independent review.

2026-11-20, resolving integrated review round 5 findings F1 and F2 before implementation. Returned withdrawn designations remain acceptable as attempt answers, with their captured standing explicitly disclosed alongside attempt fulfillment; returning one is neither endorsement nor re-adoption. Exact duplicate subject/context acquisitions are to be delivered once while preserving request roles and distinct acquisition routes. This direction authorizes these corrections and offline verification, not additional live inference or integrated-gate acceptance.

> The review is complete.  Regarding its findings:\
> \
> For F1, accept a returned withdrawn designation, but make its withdrawn standing explicit alongside the attempt’s fulfillment reporting. Returning it is not endorsement or re-adoption; making it current again requires a new declaration. Preserve the distinction between attempt fulfillment and the question having no current answer, and test it.\
> \
> For F2, avoid repeated delivery of exact duplicate subject/context inputs while preserving their roles and exposure semantics. Do not conflate different acquisition routes merely because they reach the same content.\
> \


2026-11-20, after clean integrated rereview round 6, authorizing focused live verification of dialog `@14` with exact duplicate subject/context inputs and address-based response matching. This supersedes the no-additional-inference restriction only for this regression trial. Under `dev/workflow.md`, estimate 3–8 requests for a focused invocation and any normal repair or targeted retry, with a new hard cap of 20 counting every dispatched request, failure and retry. Use the established ChatGPT-plan route, `gpt-5.6-sol` with medium reasoning, pinned Cockatiel fixture and unchanged production limits/instructions. A controlled retained-option fixture may establish duplicate selections through normal acceptance; distinguish its scripted setup from live behavior. Stop once the objective is met, preserving unsuccessful outcomes and repairs. Final independent review and human sufficiency remain separate.

> The re-review is complete.  Re dialog 14 -- please verify dialog version 14 with a focused live regression trial exercising the revised instructions for matching deduplicated subject/context responses by address. Use the production instructions and the established inference policy, and record the outcome, failures and repairs for review.

2026-11-20, following M4 round 11's clean correction rereview and its native-identity ownership observation, authorizing acceptance-time namespace authority and consistent forward lookup checks. Independent integrated review remains pending; no additional live inference is authorized.

> The review (M4 round 11 Claude) is complete.   Please address the native-identity ownership issue noted in the review:
>
> Introducing a provider-native identity must require host-established authority for that provider’s identity namespace. Other producers can reuse the common Entity ID or introduce a separately identified Entity. Enforce this at acceptance rather than relying on the hosted schema. Do not equate authority with merely being a mechanical producer.
>
> Also make forward lookup validate the expected Entity kind and modality, consistently with reverse lookup.
>
> Implement the smallest coherent change, preserving other producers’ ability to extend or challenge information about native Entities. Verify unauthorized introduction, legitimate provider introduction, cross-producer reuse and lookup integrity.
>
> Follow the task and review-response workflow, recording the rule and verification for independent review. If enforcing it requires a consequential choice beyond this direction, bring that choice back for discussion.

2026-11-20, accepting the final M4 integrated review gate after round 12 at production target `aec3bc511dbe398f8a598a50ae162cf5dc475d08`, and directing task closure and PR readiness. Merge and worktree removal are not authorized by this request.

> I accept the M4 integrated review gate. Please complete the task records and prepare the PR for merge.

## Outcome

## Verification
