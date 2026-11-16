Record type: findings
Received: 2026-11-16
Reviewer: Claude (Opus 5.5), independent review session; same reviewer as the Claude round 2 findings, not the implementing session
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Round: 3
Reviewed target: `5ebe10a19be93a2613ec5fe5cf5f5dcaf16df295`
Prior findings: [Claude round 2 findings](2026-11-15-m1-mechanism-round-2-claude-findings.md); also [Codex round 2 findings](2026-11-15-m1-mechanism-round-2-findings.md)
Prior reviewed target: `b02c7bcdd59e4253dbe9cddb761c590bb52ca360`
Reviewed scope: focused rereview of `b02c7bc..5ebe10a` (corrections `9ca9865`, clarification `5ebe10a`) and the paths they affect, under the original handoff; the recorded follow-up `ac4f6d6` and checkpoint update `eb09a82` were read as context

## Returned findings

### Recommendation

F2 and F3 are resolved. F1 is resolved for every case I reported, but one closely related form of disclosure remains outside the corrected rule (R1 below). R1 is small, applies the same rule F1 already applies, and has a clear correction within scope; I recommend fixing it before M2. It does not need another full review: a check of the correction and its regression test is enough. Otherwise I found no new defect in the corrections or the clarification. The human determines whether the checkpoint is sufficient.

### Method and verification

Read the full source and test diff, traced the new known-change set through every cause route in `status.ts`, checked the acquisition validation against each `SelectionScope` shape and every caller of `#item` and `inventory`, and compared the B/C clarification with the decision text and the human's follow-up. Reran my round 2 probes against the compiled target and added probes for other forms in which a delivery identifies a change. The checkout was clean at `eb09a82`; the only difference from the reviewed target is the checkpoint record.

- `npm run check` — passed.
- `npm run build` — passed.
- `node --test _build/test/contributions.test.js _build/test/contribution-exposure.test.js _build/test/contribution-results.test.js` — **40/40 passed**, no skips.
- `git diff --check` over `b7c78b1..9ca9865` and `9ca9865..5ebe10a` — passed.
- In-memory probes outside the repository — every round 2 reproduction now behaves as the decisions require; R1 reproduced.

I did not rerun the complete offline suite. As my round 2 record explains, this review shell (Linux over the macOS checkout's `node_modules`) cannot validly reproduce it. No existing source imports the mechanism; the 708/708 result remains implementing-agent evidence.

### Resolution of prior findings

| Finding | Rereview result |
| --- | --- |
| F1 — a delivered change was still a cause | Resolved for the reported cases. Re-delivery with disclosed grounds, direct `declaration(change)`, and the inherited variant now yield no cause; the notice control is unchanged, and a refreshed listing still does not make a change known. Treating delivery of an association as delivery of the addition or supersession at that address follows from the same rule: that delivery identifies the change, its operation and the uses it affects. It is correctly limited to producing-context derivation; designation standing and membership status keep their own rules. See R1 for the remaining form. |
| F2 — `declaration()` delivered a use without exposure | Resolved. An addition or supersession acquired by address is delivered and recorded exactly as `association()`. A later displacement and a later member displacement are causes through either route, and a displaced use arrives with the displacing grounds. A withdrawal is still delivered as grounds with no standing. |
| F3 — malformed acquisitions were recorded | Resolved. Scopes are normalized and validated against existing targets. A topical scope needs a nonempty key or explicit `null`, the inventory kind is checked, and excerpt bounds must be non-negative integers; zero remains a valid, fully disclosed excerpt. Refusal throws `InvalidAcquisition` before anything is recorded, and `baseline`/`designations` inherit the validation. The weak test assertion now checks its intended message. |

The displacement-context clarification (`5ebe10a`) matches the decision text and the human follow-up. The test distinguishes three cases: context-only receipt of A with a reference to B; actual acquisition of B as a use, as member content or through a listing; and bare receipt of B's content. It shows that only an actual path to B makes C a cause. The added `establishes` field is a reference, and the recorded history confirms no use or content of B was delivered. Behavior was already conforming; I agree no conflict exists.

### Remaining finding

#### R1 — P3: A change disclosed as a concern on a later delivery still re-enters by the earlier route

Location: [status.ts:92–94](../../../src/lib/contributions/status.ts#L92); disclosure points at [production.ts:131–134](../../../src/lib/contributions/production.ts#L131) (`#owner`, `concerns`) and the `status` in `association()`. Neither is captured in the corresponding delivery record.

Deliveries disclose changes in two forms the corrected known-change set does not include:

1. **Owner concerns.** Every delivered item, association, change and metadata entry carries `owner.concerns`: the owner's current producing-context causes, each naming the exact change, its operation, its routes and its current standing.
2. **Association status.** Every delivered association carries `status.membership`, `status.producing` and `status.content`, each a list of causes in the same form.

Reproductions:

- *Inherited.* X's producer received identification A. Production P receives X's item. A is withdrawn (W). P receives X's item again: `owner.concerns` shows `[W, exact]`. P's pending causes are still `[W, inherited]`.
- *Membership.* P receives designation D, whose member association is then withdrawn (W). P re-delivers D: `status.membership` shows `[W, membership]`. P's pending causes are still `[W, membership]`.

These are the same situation as F1's inherited variant. The change was shown to P, identified exactly, before submission. Yet it re-enters through a delivery made before the change. The decision applies the known-at-delivery boundary to "direct, membership and inherited concerns, so a known cause cannot re-enter by another route". The notice rule makes actual delivery that identifies the particular change sufficient. A disclosed cause supplies the exact change declaration, its operation and the affected use or route, with access to the declaration; it meets that test.

Correction: record the change identities disclosed as concerns on each delivery, as `association` deliveries already record `disclosed`, so the history shows what actually reached the producer. Then include them in the known-change set by the same rule. Add regressions for both variants above and keep the undisclosed control. If the human instead regards a disclosed concern as weaker than a notice, that is a semantic choice the checkpoint should state explicitly; I do not read the decisions that way.

### Observations

The five observations I recorded in round 2 are now in the checkpoint, each assigned to M2 or M3; that disposition is appropriate. I have no new observations. The M2 obligations and remaining limits are unchanged from the earlier records.

This review changes only this findings record. It does not accept the checkpoint, modify task status or the handoff, or close or merge the task.
