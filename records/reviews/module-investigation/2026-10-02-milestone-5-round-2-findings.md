# Module investigation milestone 5: corrections and integrated lifecycle — round 2 findings

Record type: findings
Received: 2026-10-02
Reviewer: Claude Code (claude-opus-5-5), same reviewer session as round 1, arranged by the human; repository-writing reviewer
Handoff: [2026-10-02-milestone-5-handoff.md](2026-10-02-milestone-5-handoff.md)
Round: 2
Reviewed target: `9e07266804701447fd737d6499db3f4e13262fc1` (production correction `117a4d4`; scope `6ccdceb..9e07266`)
Prior findings: [2026-10-02-milestone-5-round-1-findings.md](2026-10-02-milestone-5-round-1-findings.md)
Prior reviewed target: `37837f8d1432df652c6cec7c839f101a5b3d2cea`

## Returned findings

### Scope and method

I reviewed these items:

- **Human direction:** the task follow-ups `f21dd5e` (F2 option (a) and one
  focused live sequence), `458fe44` (F4 bounds) and `56912e6` (F5 current-primary
  link).
- **Records:** the [disposition](2026-10-02-milestone-5-disposition.md) and the
  [pass-05 addendum](../../validation/module-investigation/2026-10-02-milestone-5-review-addendum.md).
- **Code:** the production diff `117a4d4` (`context.ts`, `execute.ts`,
  `openai/protocol.ts`, `presentation.ts`, `commands.ts`, `identity.ts`) and the new
  tests.
- **Documentation:** the updated architecture, CLI, hosted and backlog documents.
- **Pass 06:** the protocol, setup, report, fixture pin, the dependent-evidence and
  initial-warning captures, and the command sequence.

No source, test, script or package file changed between `117a4d4` and the target.
Pass-05 artifacts, the original fixture, the handoff and the round-1 findings are
unchanged in `6ccdceb..9e07266`.

Checks performed:

- `npm test` at the target: **466 tests, 466 pass, 0 fail/cancelled/skipped**,
  148.0 s. I did not hit the loopback `EPERM` condition recorded for the restricted
  run.
- All four pass-06 audits completed: `audit-results.py`, `audit-lifecycle.py`,
  `audit-dependent-evidence.py` and `audit-artifacts.py`. Results:
  - ledgers agree with wire exposure;
  - reconciliation reports `derivedStateMatchesIndependentReconciliation: true`;
  - there are three accepted dependent corrections;
  - no artifacts are flagged.
  The working tree stayed clean, so the regenerated outputs are byte-identical to
  the committed ones.
- The pass-06 fixture checkout is at `b6a2ba8`, as recorded in
  `fixture-git-commit.txt`. Its three files hash identically to the pass-05 fixture.
- I re-ran my round-1 F1 reproduction against the target, in a scratch copy
  outside the repository. The redisplayed result now lists the correction reported
  by the displaced root (`displacedCorrections` includes `child → X`). It renders
  "Displaced account … reports correction …", does not splice X into the tree, and
  reports zero omissions.

### Round-1 findings: verification of corrections

- **F1: resolved.** `rememberDisplaced` collects reporter/target/replacement
  references for each displaced account's accompanying corrections. They are
  listed separately and never added to `display`. The new integration regression
  covers a corrected reporting root and checks that the old replacement isn't
  spliced in. The architecture and CLI docs now describe this accurately.
- **F2: resolved as directed (option (a)).** `correctionEvidenceGuidance` appears
  in the instructions, in every context delivery's limitations, and in the
  evidence and `revisionPage` schema descriptions. Evidence eligibility in
  `acceptance.ts` is unchanged. The regressions check four things: a reporter
  citation is accepted; a correction ID is rejected; reporter citation after
  metadata-only exposure is rejected; and a rejected submission ends the
  evaluation as `investigation-failure` after one exchange, with no substitution
  and no repair dialogue. The pass-06 audit confirms that no live correction used
  a correction ID as evidence.
- **F3: resolved.** The help text now matches the behavior.
- **F4: resolved for output.** The displaced-account, displaced-correction and
  revision-status listings are each sliced to 256, with separate omission counts.
  Those counts feed into projection identity and are rendered. Displaced subtrees
  are no longer expanded for entries omitted by the account bound. The
  documentation states that traversal is still bounded only by session history,
  not by the listing limit. The large-history regression exercises the
  revision-status omission (255 statuses omitted) and exact inspection after
  omission, without inference.
- **F5: resolved.** Policy omission of incoming inconsistencies now reports the
  full `inconsistencyCount` with paging instructions, distinct from the
  character-bound message. The automatic link is the incoming correction whose
  replacement is, or leads to, the current primary. Because each replacement has
  exactly one creating correction, at most one such link exists. The regression
  checks the A→B, A→C, C→D branch, 30 inconsistencies and full retrieval across
  pages.
- **F6: resolved.** The addendum records the hosted structured inconsistency
  without changing the frozen pass-05 report. I checked it against the
  conflict-case `stdout.txt` reviewed in round 1.

### Evidence gap: focused dependent sequence

The pass-06 setup meets the human's instruction in `f21dd5e`:

- Y and Z now make unambiguous, source-refutable claims: "at most one element … reading
  element zero obtains every label" and "never discards a second or third label".
- Truthful scripted-origin qualifications are kept.
- No correction cue was added.
- The source, README and configuration are byte-identical to pass 05.
- The model, effort and route are unchanged.
- Freezing precedes inference: `94ee9b9` precedes the captures.

The initial-warning capture shows Y with a direct cause and Z with a transitive
cause from A's accepted correction, before either was examined. Examination of Y
was accepted with corrections Y → `ecddab3f` and Z → `ad0f2e8f`. Both cite captured
source and the original accounts, both reasons refute the cardinality claim, and
the evaluation received the full source body. This is an accepted, source-supported
correction of real errors in both a direct and a transitive dependent. That was the
specific gap identified in round 1.

The report correctly says the third evaluation (Z → `5d641bad`) is not an
independent second detection, because Z had already been corrected. It also
correctly treats the resulting competing Z alternatives and the new conservative
warnings on accounts that cited original Z as exposure relationships, not errors.
I agree with its stated limits: one tiny scripted case, a selected examination, and
shared model family and orchestration. It is not a measure of spontaneous detection.

### New findings

There are no actionable findings of medium or higher severity. Two low-severity
observations do not block the gate:

**R2-O1 — Low (not exercised). Moving the displacement check after the
already-displayed check can drop a displaced original in one contrived order.**
`presentation.ts` now returns early on `accounts.has(id)` before calling
`rememberDisplaced(entry.original)`. Suppose a BFS entry for a corrected original
K is processed after an accompanying-replacement entry that resolves to the same
primary. That can happen when a shallower displayed replacement reports `K → K1`
while K is still queued deeper as a child. K is then neither displayed nor recorded
as displaced, and neither is anything in its own subtree. Under `37837f8` the
original was recorded before this check. I found this by reading the code; it needs
a specific cross-result structure, and the correction itself stays disclosed through
its reporter. Recording displacement for already-displayed primaries while still
under the listing bound would remove the gap. This can wait for the integrated
review.

**R2-O2 — Low (test coverage).** The large-history regression reaches exactly 256
displaced accounts and asserts only `displacedCorrections.length <= 256`. As a
result, the truncation paths for `omissions.displaced` and
`omissions.displacedCorrections` are not exercised. Only the revision-status
truncation is. The slicing code is simple, so this is a coverage note.

### Unverified areas and residual limits

- I did not read the full pass-06 role inputs and outputs. I relied on the report
  and the audits for what the evaluator and assessor concluded. I did check the
  dependent-correction reasons and evidence.
- I did not re-derive the "complete result" wording concern beyond agreeing that
  literal array preservation is false.
- The round-1 limits still apply: the fsm-engine and merge-anything semantics, the
  sleep monitor and the dry-run captures were not independently re-verified.

### Recommendation

All six round-1 findings are corrected as directed, and the dependent-account
evidence gap is addressed within the human's bounds. In my judgement the evidence
is now **sufficient for the milestone-5 gate**. I recommend that the human accept
milestone 5 and proceed to the final integrated review across milestones. R2-O1
and R2-O2 can be dispositioned there. This recommendation is not acceptance; that
decision remains the human's.
