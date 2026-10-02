# Module investigation milestone 5: corrections and integrated lifecycle — round 1 findings

Record type: findings
Received: 2026-10-02
Reviewer: Claude Code (claude-opus-5-5), fresh session arranged by the human; repository-writing reviewer
Handoff: [2026-10-02-milestone-5-handoff.md](2026-10-02-milestone-5-handoff.md)
Round: 1
Reviewed target: `37837f8d1432df652c6cec7c839f101a5b3d2cea` (diff range `4e6ee26..37837f8`; production change `9eb0b7d`)

## Returned findings

### Scope and method

I reviewed the production change `9eb0b7d` line by line: `revisions.ts`,
`context.ts`, `presentation.ts`, `associations.ts`, `evaluation.ts`, `execute.ts`,
`commands.ts` and the reference transport. I read them against the approved plan's
milestone 5, correction and reconsideration sections and the deterministic check
list. I also read `acceptance.ts` because it determines correction order and
evidence eligibility. Separately I reviewed the new tests, the documentation diff,
the harness changes in `e54a4c3`, the pass-05 report and protocol, the refined and
conflict setups, the numeric fixture, and selected exact captures: refined
rejection analysis and exchanges, and the conflict-case `stdout.txt`. I checked one
upstream assessment claim (Cockatiel listener exceptions) against the pinned
source. I did not access credentials or providers and did not issue live requests.
I modified nothing except this record.

Checks performed:

- `npm test` at HEAD `88d95d5`, whose only change after the target is the handoff
  (verified with `git diff --stat 37837f8 88d95d5`): **464 tests, 464 pass, 0
  fail/cancelled/skipped**, 143.4 s. The count exceeds the handoff's 462 at
  `9eb0b7d` by exactly the two harness tests added to
  `test/assessment-budget.test.ts` in `e54a4c3`.
- `audit-results.py`, `audit-lifecycle.py` and `audit-artifacts.py` all completed.
  They reported exact resolutions, ledger agreement, `derivedStateMatchesIndependentReconciliation: true`
  for all five cases and no flagged artifacts. The working tree stayed clean
  afterwards, so the regenerated artifacts are byte-identical to the committed ones.
- Fixture hashes for `fixtures/integrated-investigation-assessment/*` match the
  frozen manifest. The pinned Cockatiel checkout is at the manifest commit.
- One scratch experiment, run in a copy of the target outside the repository and
  using the existing integration-test helpers (see F1).

### Actionable findings

**F1 — Medium. Redisplay after root replacement silently drops the corrections the
original root reported.**
`presentation.ts` follows `account.corrections` only for the *displayed* (primary)
account. `rememberDisplaced` records only the displaced root's composition. When a
result root E that reported correction `child → X` is itself later corrected
(`E → E′`), redisplaying that retained result shows E′ and lists E as displaced
composition. The `child → X` correction and its replacement X disappear from the
view entirely: they are not in `corrections`, not in revision rows, and not listed
by reference. I reproduced this with the integration-test helpers. The first
explain view had the correction. After `examine E` produced `E → E′`, the repeated
`explain` returned `reused: true` with only correction `E → E′`; the check
`corrections.some(c => c.target === child)` was `false`. The plan asks to "disclose
further corrections in displaced trees with references". The architecture doc says
"Replacing the root displaces its old subtree; corrections there remain disclosed
and inspectable". Both read most naturally as also covering corrections *reported by*
displaced accounts, which are substantive content of the original result. Today
they are reachable only by manually inspecting the displaced root. The existing
lifecycle test covers corrections *targeting* the displaced subtree, but not
corrections reported by it. Suggested resolution: disclose displaced accounts'
accompanying corrections by reference (without splicing their replacements into
the new tree). If that is not intended, narrow the documentation.

**F2 — Medium (contract clarity; human decision). Correction handles look like
eligible evidence but are rejected, and the instructions don't say so.**
The refined Y examination was rejected because it cited the correction record
(`r8Ez-BsWQjyM.4`) as evidence. The model received that handle in
`revision.rows[].correction` and `corrections[]`, in the same opaque namespace as
every citable handle. The instructions say only "evidence (supplied references)"
and "Copy supplied references exactly". Neither the instructions, the context
limitations nor the governing documents state that correction identities are
ineligible, or that correction content must be attributed through
`correction.reporter`. `acceptance.ts` eligibility is the union of supplied evidence,
summarized evidence and `exposure.citations`, which holds investigram IDs only.
The rejection is therefore correct under the implementation, but the model could
not reasonably anticipate it, and it cost the only live attempt at correcting a
reconsideration-flagged dependent. I agree with the handoff that allowed evidence
should not be silently broadened. The options for the human are: (a) state the
rule explicitly in the instructions/limitations ("cite a correction's reporter
investigram, never the correction ID"); (b) accept correction IDs as evidence
meaning their reporter; or (c) give the investigator a structured validation reason
on rejection. Option (a) is the smallest in-scope change. Any of them changes
investigator-visible contract text, so a frozen-protocol rerun would not be
comparable without recording that change.

**F3 — Low. CLI help still says replacement selection is a later milestone.**
`src/lib/commands.ts:48` (in the help text shown by `postcode help`) still reads
"Original accounts are shown. Automatic replacement selection and derived revision
warnings remain a later milestone." It directly contradicts the new
`--revision-page` line above it, the behavior and the updated CLI reference. The
documentation sweep missed it.

**F4 — Low. The 256-account bound doesn't cover the displaced and revision-status
outputs, and every subject gets a status block.**
In `presentation.ts`, `rememberDisplaced` runs before the 256-account check. It
traverses each displaced subtree, including those of entries that are themselves
omitted. `revisionSubjects` then computes and renders a full `RevisionStatus`
(up to 24 rows plus 24 inconsistencies) for every displayed, original, displaced
and selected account. As a result, `displaced`, `revisions` and the rendered
"Revision status …" blocks are bounded only by session size, not by the
documented 256-account display bound. This came from reading the code and was not
exercised at scale. Realistic sessions are small. However, the handoff presents
"at most 256 displayed accounts" as the scale bound, and the conflict capture
already shows one empty status block per displaced child ("0 of 0
relationships/causes"). This adds to the density concern already in the backlog.
Suggested resolution: bound or summarize the displaced and status listings with
explicit omissions, or document that they fall outside the bound.

**F5 — Low. Misleading omission text for automatically included accounts.**
In `context.ts:33-35,66`, automatically included accounts get every page-1
inconsistency reporter moved to `omittedInconsistencyReporters` by policy. The
omission message then says "Incoming inconsistency content omitted by character
bound", which is wrong in that case. The policy list also covers only page 1, not
`inconsistencyCount`. A related point: such accounts carry only
`incoming.slice(0, 1)`, the *oldest* correction targeting them, rather than the
link that leads to `primary`. For the conflict family that is `A → B`, not the
branch that selects D. This is accurate but the least informative choice.

**F6 — Low (report completeness). The live conflict-case examination of Z
submitted a structured inconsistency, and the report doesn't mention it.**
The report says the live examination of Z "submits no correction". That is true,
but the accepted result (`@investigram-0db46c6c`) also submitted an unresolved
inconsistency targeting A, B and C. It states that none of the winner-priority
accounts matches the independent append logic, with source evidence. The retained
summary redisplay shows it. This is the only live instance of the incoming
inconsistency path, and it is relevant both to the "spontaneous detection" caveat
and to how the ambiguous Z wording affected behavior: the model called Z
"directionally correct" while flagging its premises. The report should state it.

### Material evidence gap (human decision)

The controlled refinement meets the human instruction (bd00b66):

- The documentation states only the interface.
- A is plausibly mistaken and carries only truthful test-origin and
  static-interpretation qualifications, with no "unverified" lure.
- The source is eight lines.
- The fixture, setup and reference were frozen and hash-verified.
- The M4 artifacts are unchanged.

However, no accepted live evaluation corrected an account that was flagged only
because of reconsideration propagation, in either the refined or the conflict
shell. Both accepted live corrections (A in the refined case, older-branch B in the
conflict case) target accounts that directly embody the mistake. The one attempt on
a dependent (Y) was rejected under F2. The Z prompts are weakened by the "need not
represent" ambiguity in both shells. Propagation, exemption and non-clearing are
thoroughly covered by the deterministic tests and the capture audit. Live evidence
that warnings lead an investigator to revise a dependent account is absent. In my
judgement this is not a correctness defect for the gate. It does mean milestone
acceptance rests on deterministic coverage for that behavior. The human should
decide whether that suffices, or whether to authorize one bounded live rerun of the
refined Y/Z steps after F2 is resolved (and optionally with unambiguous Z wording),
recorded as a new fixture rather than a retroactive repair.

### Non-defect observations (verified)

- **Primary selection** (`revisions.ts:81-93`) traverses all reachable outgoing
  links and picks the replacement of the highest-ranked link. The replacement of
  the latest reachable link is always an endpoint, because any correction of it
  must be accepted later and is reachable. Rank is session evaluation order and
  then the `evaluation.corrections` array. That array is built post-order by
  `acceptance.ts:build`: a replacement's nested corrections precede their parent
  correction, and children's corrections follow the parent's. The order is stable
  and deterministic. The documentation's "correction array order" is accurate only
  for that flattened array.
- **Exemption and propagation.** One worklist per correction starts at the target.
  An exempt citer (same provenance, or `completeCorrections` contains the
  correction) is neither marked nor expanded, so exemption applies on every path
  while independent paths and later causes remain. Unit and integration tests
  cover the whole-evaluation, reporter-child, other-replacement, unseen-later-cause
  and alternate-path cases. `audit-lifecycle.py` reimplements the rule as a
  fixpoint, which corroborates the implementation but does not independently
  interpret the rule.
- **Completeness** requires the correction record to be actually delivered (not
  omitted by the character bound) and all three parts of both target and
  replacement, accumulated across exchanges. It does not require children.
  Reporter citation from correction content and incoming-inconsistency content is
  recorded with empty parts, so it cites without conferring completeness. Revision
  metadata alone creates no citation (tested).
- **Exact inspection** uses originals (`historical`). Follow-up subjects keep their
  request identity. Projection identity includes revision statuses and
  inconsistencies, and associated-inspection identity includes per-item status.
- **CLI `--revision-page`** validation is strict and tested. The investigator
  `revisionPage` is validated in `execute.ts`, and transport maps the new
  `revision` handles structurally while leaving prose and reasons literal
  (tested).
- **Invalidation and interruption** during a correcting submission publish no new
  qualified view and leave earlier views unchanged (tested through the real CLI).
- **Cockatiel assessment claim checked against the pinned source.**
  `Executor.ts:49-76` emits success and handled-result failure events inside the
  `try`, and `EventEmitter.emit` is synchronous. A listener exception there is
  routed through `errorFilter`, so the examination's claim that failure-listener
  exceptions "always escape" is indeed an overstatement, as the report says.
- **The conflict-case redisplay** selects the live descendant D across the older
  branch, keeps `conflicting` and shows all three corrections, matching the report.

### Unverified areas and residual limits

- I did not independently re-derive the fsm-engine or merge-anything semantic
  claims against source, beyond accepting the audit reconciliation.
- I did not re-run the sleep-prevention monitor and did not inspect the real
  CLI/worker dry-run captures beyond the reports.
- I did not exercise F4 at scale. Usage attribution I checked only through
  `audit-results.py`.
- This is a single
  review session that did not have the full M1–M4 history in context.

### Recommendation

The implementation of all-branch selection, per-cause exemption, immutable
history, bounded cause paging and structural transport is sound for this gate.
I found no defect in the propagation semantics. I recommend **accepting the
milestone-5 gate conditional on**:

- correcting F1 (or explicitly narrowing the documentation) and F3;
- dispositioning F4–F6, where documentation or report corrections suffice;
- a human decision on F2 and on whether the gap described above needs a bounded
  live rerun.

F1 and F2 are not blockers for the final integrated review, provided their
dispositions are recorded before it.
