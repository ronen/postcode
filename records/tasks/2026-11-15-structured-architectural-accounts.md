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

## Outcome

## Verification
