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

## Outcome

## Verification
