Record type: findings
Received: 2026-11-15
Reviewer: Claude (Opus 5.5), independent review session; not the implementing session
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Round: 2
Reviewed target: `b02c7bcdd59e4253dbe9cddb761c590bb52ca360`
Prior findings: [Round 1 findings](2026-11-15-m1-mechanism-round-1-findings.md)
Prior reviewed target: `84c1cc16f70f3b384a6d772aa3bcb8fda70836b5`
Reviewed scope: the complete M1 mechanism, `8a7f2834470644726dd742a0ddaeb1455bac3b2a..b02c7bcdd59e4253dbe9cddb761c590bb52ca360`, under the original handoff. A second reviewer in round 2, alongside the [Codex round 2 findings](2026-11-15-m1-mechanism-round-2-findings.md) on the same target.

## Returned findings

### Recommendation

Correct F1 and F2 before treating the checkpoint as sufficient for M2, and preferably F3. F1 and F2 concern exactly the exposure semantics the M2 agentic dialog will be built on: F1 flags changes that were fully disclosed to the producer before it submitted, and F2 leaves a public acquisition by which an exact use arrives without exact-use exposure or its known displacement grounds. Both are conformance defects against the adopted decisions, not new semantics; F2 is the declaration analogue of round 1's F3. F3 is a smaller delivery-record integrity defect. Recommend a focused further review of the corrections. The human determines whether the checkpoint is sufficient.

The round 1 corrections themselves hold: I read each corrected path (staged names and owned copies before commit, item qualification outside the bounded body, `member()` replacing routed `item()`, cloned and frozen delivery records) and agree with the round 2 resolution table.

### Method and independence

This review covers the whole mechanism rather than only the round 1 corrections. I read the handoff, `dev/review.md`, the approved plan (Milestone 1, intermediate-state contract, verification coverage), the four governing decisions, the checkpoint record, the task follow-ups and both earlier findings records, then read all six modules in `src/lib/contributions/`, the three contract test files and helper, the architecture account, the testing convention and the two method-version additions. Prior review conclusions and the implementing agent's verification were treated as context, not evidence.

The checkout was clean at `ca86f7b` when this review began. The only differences from the reviewed target are the round 2 findings record and the checkpoint record; implementation and tests match `b02c7bc`. The reviewer is a different model and session from the implementing agent (Claude Fable 5.2 per commit attribution), but from the same model family; the human may weigh that when judging independence.

### Independent verification

- `npm run check` — passed.
- `npm run build` — passed.
- `node --test _build/test/contributions.test.js _build/test/contribution-exposure.test.js _build/test/contribution-results.test.js` — **36/36 passed**, no skips.
- `git diff --check 8a7f283..b02c7bc` — passed.
- Complete offline suite, run as two halves of the 65 compiled test files because of this environment's per-command time limit — **687/704 passed, 1 skipped, 16 failed**, all 16 in existing, unmodified test files. This is **not** a valid reproduction of the implementing agent's 704/704: the review shell is a Linux VM over the user's macOS checkout, and its `node_modules` native binary `fs-ext` fails to load (`invalid ELF header`), with process-lock and other environment-sensitive tests among the failures. No existing source or test file imports `src/lib/contributions/`, so the reviewed diff cannot reach the failing tests. I did not establish the cause of each failure; the complete-suite result remains implementing-agent evidence.
- In-memory Node probes against the compiled target, kept outside the repository, reproduced F1–F3 and the observations below. No implementation, test or governing file was changed.

Dependencies already installed in the checkout were used. No live inference or representative-Session measurement was performed.

### Actionable findings

#### F1 — P2: A change fully delivered before submission is still a cause; only `notify()` makes a change known

Location: [status.ts:89](../../../src/lib/contributions/status.ts#L89) and [status.ts:93](../../../src/lib/contributions/status.ts#L93); the disclosures that are ignored are recorded at [production.ts:143](../../../src/lib/contributions/production.ts#L143) and [production.ts:155](../../../src/lib/contributions/production.ts#L155).

`#derive` builds its known-change set only from `notice` deliveries. A change declaration delivered to the same production in any other way — as a disclosed displacement when an association is re-delivered (`association.disclosed`, plus a `declaration` delivery of the change with its grounds), or directly through `declaration(change)` — does not make the change known. The change therefore remains a cause through the exact, inherited, membership and scope routes, and `pending()` keeps reporting it after it has been delivered.

Reproduction (one module with mechanical identification A):

1. Open production P; `P.association(A)`.
2. Another producer withdraws A with grounds (W).
3. `P.association(A)` again. The returned value discloses W with its grounds; `P.pending()` still reports W on the `exact` route.
4. P submits. Its producing-context causes are `[W, exact]`. Replacing step 3 with `P.declaration(W)` gives the same result; replacing it with `P.notify(W)` gives no cause.

Inherited variant: P receives an item of X (whose producer had received A) before W, then receives A with W disclosed after W. P's causes are `[W, inherited]`.

The [exposure contract](../../../docs/decisions/association-organization-and-exposure.md#exposure-and-reconsideration) makes actual delivery, before submission, of a notice identifying a particular change sufficient to make that change known, and then forbids that change from flagging the contribution "including through another inherited production-exposure path"; it also requires that a known cause cannot re-enter by another route, and states that producing-context reconsideration identifies changes *not disclosed* to the producer before it finished. A delivered change declaration identifies the change, its operation and affected use and carries its qualified grounds; it is at least an exact notice. Treating it as undisclosed produces a false reconsideration signal, and would push an M2 agentic wrapper into sending redundant `notify()` calls to suppress causes for changes the agent has already been shown.

Correction appears clear and within scope: treat every change declaration actually delivered to the production before submission — disclosed displacements on association deliveries and `declaration` deliveries of a change — as making that change known by every route, exactly as a notice does, while keeping the separate record kinds so notice and content delivery remain distinguishable in history. Designation standing and membership status keep their separate rules. Add regressions for re-delivery disclosure, direct declaration delivery and the inherited variant, with the existing undisclosed, generic-listing and post-submission controls.

#### F2 — P2: `declaration()` delivers an exact use without exact-use exposure or its displacement grounds

Location: [production.ts:147–148](../../../src/lib/contributions/production.ts#L147), recorded as a `declaration` delivery that [status.ts:119](../../../src/lib/contributions/status.ts#L119) treats as inherited-only.

The public `declaration(address)` accepts any declaration, including additions and supersessions that establish associations. It returns the declaration's target, members, qualification and grounds — the substance of the exact use — and records a `declaration` delivery. Status derivation applies only the inherited route to that record, so no exact-use or membership exposure arises. For a displaced use it returns only the standing addresses of its displacements, not their grounds.

Reproduction:

1. Mechanical identification A of a module. Production P calls `P.declaration(A)` and receives A's target (`identification`) and its member item address.
2. A is later withdrawn. P submits: no cause. The same sequence with `P.association(A)` gives `[W, exact]`.
3. With A already withdrawn, `P.declaration(A)` returns `standing: { displaced, displacedBy: [W] }` but not W's grounds; `P.association(A)` discloses them.
4. For a result designation D whose member association is later withdrawn, an open production that called `association(D)` has a pending `membership` cause; one that called `declaration(D)` has none.

The [acquisition contract](../../../docs/decisions/association-organization-and-exposure.md#acquisition-baseline-context-and-discovery) requires displaced information to arrive with its displacement, reason and qualification context and classes missing disclosure as a delivery defect; the [exposure contract](../../../docs/decisions/association-organization-and-exposure.md#exposure-and-reconsideration) makes later displacement of an exact received use a cause, and checkpoint choice 6 routes membership concerns to a designation's recipients. Round 1's F3 closed the analogous route for items; this is the same gap for declarations. The doc comment describes `declaration()` as for "a declaration's own qualified grounds, such as a withdrawal reason", which is the safe use.

Correction appears clear and within scope: restrict public `declaration()` to withdrawals (grounds without an established use), or deliver association-establishing declarations through `association()` so they are recorded as exact uses with disclosure; keep the internal `#change` for disclosure context. Add regressions for a later displacement after acquiring an addition, a designation's later member displacement, and disclosure of known withdrawal grounds.

#### F3 — P3: Acquisition parameters are not validated, so malformed scopes and excerpts become recorded deliveries

Location: [production.ts:163–167](../../../src/lib/contributions/production.ts#L163) with [ledger.ts:154–158](../../../src/lib/contributions/ledger.ts#L154) and [model.ts:313–318](../../../src/lib/contributions/model.ts#L313); excerpt bound at [production.ts:113–118](../../../src/lib/contributions/production.ts#L113).

`inventory()` validates neither the scope's target nor its shape. A scope for a nonexistent Query result or Entity is returned and recorded as a `complete: true`, empty acquired scope. A topic scope with the `topic` key omitted (rather than `null`) matches nothing: with an existing `admission` association it lists 0 where `topic: null` lists 1, is recorded as complete, and a later topical addition produces no scope cause because the same malformed scope is re-applied during derivation. `excerptCharacters` is unchecked: `-5` yields a 91-character excerpt reporting 101 omitted characters of a 96-character body, and `2.5` reports 93.5 omitted characters.

The acquisition contract states that "an invalid captured delivery record is rejected as malformed data" and that unavailable information is not an established empty result; inventories and excerpts must state actual coverage. These arise from caller input, which in M2 is an agent's tool request. The contracts test at [contributions.test.ts:87](../../../test/contributions.test.ts#L87) appears to cover an unknown-Entity inventory, but it passes only because the handle has already concluded; no test exercises scope validation.

Correction: validate the scope target's existence and the scope's shape (including an explicit topic key or `null`) and require a non-negative integer excerpt bound before recording anything; reject otherwise. Tighten the existing assertion to the intended message.

### Checkpoint implementation choices

I reach the same judgments as round 1 on all twelve choices, with these additions.

| Choice | Additional judgment |
| --- | --- |
| 5. Qualification `contexts` | Permitted as clarified. Forcing agentic status to `interpretation` and rejecting `contexts` restricts one field, not qualified reuse; the three reuse paths are tested. The mechanical-side trust (a context reference need only resolve, `resolvesRecord` is kind-blind) is acceptable for M1 only because no wrapper exists; M2 should check record kind and method, not just resolution. |
| 6. Membership concerns to recipients | Conforms, but see F1 and F2: the membership route currently both ignores disclosed changes and is bypassed by `declaration()`. |
| 7. Whole-investigram delivery | Permitted. A related, unlisted selection: a displacing **supersession** disclosed with an association is recorded as a `declaration` (grounds) delivery, not as an exact use of the replacement. That matches the decision's notice example ("A was superseded by B" without acquiring B) and the B/C cause-standing example, but it is a semantic choice with M2 consequences (a later displacement of B is then no exact cause for the recipient of A). State it in the checkpoint; I do not consider it a defect. |
| 9, 12 | The M2 obligations recorded are sufficient as obligations. |

### Test independence

The contract tests mostly assert decision-derived distinctions rather than restating the implementation, and the controls for choice 6 are good. They miss the cases above: every "known cause" test has the change accepted before *all* of the relevant deliveries, so a change disclosed by a later delivery in the same production is never exercised (F1); `declaration()` is used in tests only on withdrawals (F2); and the only inventory-validation assertion passes for an unrelated reason (F3).

### Further observations (not defects at M1)

- **Shared local-key namespace across a batch.** Investigram and Entity local keys are unique across the whole pool, including independently attributed productions: two productions in one batch both using investigram key `note` reject the batch. This is consistent with allowing cross-production local references in one submission, but M2 mechanical wrappers that batch providers must namespace their keys.
- **Producer boundary failure taxonomy.** `produce()` leaves the production open if the producer throws, and ends attempts only as `not-submitted` or `invalid-submission`. The accepted execution-limit, investigation-failure and communication-failure distinctions are restored with the agentic family (checkpoint: M2/M3); the open handle should be concluded or explicitly discarded there.
- **Reported answers.** A producer report's `answer` must name result designations but is not checked against the production's invocation result, and fulfillment ignores it. M2's fresh-attempt path should decide how a reported existing answer relates to fulfillment.
- **Designation delivery and members already displaced.** Delivering a designation lists member associations as undelivered addresses without their standing; a member displaced before the designation was accepted is neither disclosed nor a cause. This is consistent while member content is not delivered, but the M2 nested designated-content acquisition must disclose it.

### Remaining limits

The real-path obligations listed in the checkpoint and round 2 record stand unchanged: native/common identity correspondence, recomputation after withdrawal, method-specific naming, reordered-arrival answer equality, real Claim-context kinds, shared Session lifetime, selected-content baseline and originating question context, nested designated content, live dialog usability, diagrams and options, and the accumulating-Session measurements of warning breadth and derivation cost.

This review changes only this findings record. It does not accept the checkpoint, modify task status or the handoff, authorize implementation beyond the active task, or close or merge the task.
