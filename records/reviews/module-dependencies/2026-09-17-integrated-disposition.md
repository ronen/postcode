Record type: disposition
Date: 2026-09-17
Updated: 2026-09-20
Task: [Module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Handoff: [Integrated review](2026-09-17-integrated-handoff.md)
Findings: [Round 1](2026-09-17-integrated-round-1-findings.md); [Round 2 — Copilot](2026-09-20-integrated-round-2-copilot-findings.md); [Round 3 — Copilot](2026-09-20-integrated-round-3-copilot-findings.md); [Round 4 — Copilot](2026-09-20-integrated-round-4-copilot-findings.md)

# Module dependencies integrated review: disposition

## Findings and dispositions

The independent review reports no actionable findings. All three non-defect
observations are accepted, with the following dispositions:

1. **Coverage-filter asymmetry — clarified.** A comment beside the filter explains
   that structure retains the evaluation's recognition coverage, including unowned
   results; children require a selected owner; parents carry no source-owned coverage.
   This is intentionally distinct from project-owned request/edge selection. The
   comment describes existing selection behavior and does not claim that every
   possible owner has been proved project-owned. The reviewer's hypothetical
   same-named/distinct-symbol `external-owner` case remains unconfirmed. No new
   invariant, behavior change or investigation proceeds on an assumption about that
   case; investigating or resolving that uncertainty requires human direction.
2. **Empty named re-export versus bare module marker — clarified.** A source comment
   and CLI-reference note distinguish the already-tested supported
   `export {} from './target'` form from the excluded bare `export {};` marker.
   This documents current behavior and the reviewer's accepted reading of the
   direct-re-export rule; it introduces no new syntax support or runtime claim.
   The approved plan and historical decision remain unchanged.
3. **Newly reviewed integration surface — recorded.** This round is the first
   independent correctness review of the CLI, dependency presentation/rendering,
   composition-view helper, organization-side composition wiring and new store
   invariants. Prior clean evaluators assessed comprehension, not correctness.
   The round's inspection and live reproduction are preserved in its findings;
   earlier library/provider reviews are not presented as having covered this surface.

## Corrections and verification

Clarification commit: `21e396ff6d1aad4d116b897adee23d01e86a9862`.
Only comments and descriptive documentation changed. Inspection of the diff confirms
no executable statements, identities, schemas or qualification rules changed;
`git diff --check` passes. No additional tests were added or run for these editorial
changes. The independent review ran type checking and all **188/188 tests** at
`93d6d7d52bc3715276014a85f197db5e7f8a72b8`, reproduced the committed journey and
PostCode structural counts, and exercised scoped-navigation mismatch rejection.

The review's disclosed verification limits are accepted and retained, not silently
upgraded to independent verification:

- **Adapted ts-node:** the reviewer checked retained evidence and contract consistency
  but did not reproduce the external checkout. The implementing-agent validation
  remains the source of those measured counts. No new external-checkout work is
  undertaken in this disposition.
- **Exceptional boundary fixture:** the reviewer relied on committed tests and code
  inspection rather than reconstructing the temporary fixture. Its complete input
  contents are durably retained in the
  [instrument evidence](../../validation/module-dependencies/2026-09-17-instrument/boundary-inputs.json),
  although the executable fixture directory was temporary. This availability does
  not imply the reviewer reconstructed it.
- **Latency:** no independent remeasurement occurred. Existing measurements and the
  unexplained ts-node outlier remain disclosed; no cause, performance bound or
  optimization is inferred or implemented.
- **Test assertions:** the reviewer inspected all dependency-related test files and
  selected assertions but did not independently rederive all 188 tests. Preserve
  that distinction from the full passing execution.
- **Clean-evaluator responses:** the reviewer checked the report and corresponding
  implementation, not every underlying response. The original responses remain
  linked from the [instrument report](../../validation/module-dependencies/2026-09-17-integrated-instrument.md).

These limits introduce no correction request in the returned review. They remain
available for the human's later PR and gate assessment. No additional independent
review is claimed for the editorial clarification commit.

## Review rounds

Round 1 reviewed `93d6d7d52bc3715276014a85f197db5e7f8a72b8` against baseline
`8dac095574bc7dd40ab105d2ce1fe5524c1cf647`. The reviewer committed the unchanged
[findings](2026-09-17-integrated-round-1-findings.md) in `6196520` and recommended
accepting the integrated gate with the disclosed non-defect observations and limits.

## Gate conclusion

The human directed assessment of the observations and explicitly required the task
to remain open for a later PR process. This disposition does not infer human gate
acceptance from the reviewer's recommendation. The task remains **active**, with no
closure date and no PR created by this follow-up. Await human direction for that
process and any further review or explicit gate conclusion.


## Round 2 — Copilot dispositions (2026-09-20)

The human authorized retrieval, in-scope correction, commit/push and PR update for
another review. The full review and all three inline comments were preserved before
correction in `9f7e01c`. No conversation comments were returned. All three findings
are accepted and corrected in `7efb9f0a55bc4e51df95063892973e6cba805d10`:

1. **Exact occurrence partition — accepted.**
   [Comment 4056501244](https://github.com/ronen/postcode/pull/4#discussion_r4056501244).
   Individually valid edges did not ensure evaluation-wide completeness or uniqueness.
   The store now collects resolved occurrence IDs from the evaluation and consumes
   each exactly once across its referenced relationships. Missing support, support
   outside this evaluation, duplicate relationship references and overlapping support
   under distinct relationship IDs are rejected. Duplicate evaluation occurrence IDs
   are also rejected. Non-resolved requests remain outside the partition. The rule
   applies to retained evidence even when evaluation materialization is partial.
   Existing endpoint and aggregation checks still apply. A regression checks these
   cases using stored and pending references, verifies every new record is absent
   after rejected batches, preserves the prior evaluation, and accepts a consistent
   partial evaluation. The records method advances to `program-records@15`.
2. **Count-dependent nouns — accepted.**
   [Comment 4056501262](https://github.com/ronen/postcode/pull/4#discussion_r4056501262).
   Dependency Unicode rendering now chooses singular/plural nouns independently for
   projection and population summaries, selection matches, display omissions and
   source-detail counts. Regression coverage exercises zero, one and two, including
   opposing module/relationship counts to detect accidental reuse of another count.
   The presentation method advances to `presentation@20`. Historical captures remain
   unchanged as evidence of their original targets.
3. **Stale architecture checkpoint — accepted.**
   [Comment 4056501275](https://github.com/ronen/postcode/pull/4#discussion_r4056501275).
   The architecture overview now describes the provider as the evidence basis for
   the integrated projections, expansions, presentation, navigation and observations.
   The contradictory statement that those layers remain unimplemented is removed.

Verification: `npm run check` and `npm test` pass, **190/190 tests**, on the correction
code. `git diff --check` passes for the corrections. The original retrieved review
body retains its source whitespace/line endings rather than being reformatted.
No fresh external ts-node validation or instrument-evaluator round was performed;
previous limits remain. These corrections require further review rather than
extending round 1's clean recommendation to changed code.

Round 2 reviewed `51148890e634021a6e47862d37d7bd06798e70d0` through
[PR #4](https://github.com/ronen/postcode/pull/4); Copilot review ID `5260062233`
recommended changes. The next round should review the updated PR head, focusing on
the evaluation-wide partition and its atomic rejection behavior while retaining the
original integrated assignment. No new handoff is needed. The PR description will
identify the exact new head and prior target for that review.

The task remains **active**. Further independent review and the human's explicit
final gate decision are pending; no merge or closure is authorized by this disposition.


## Round 3 — Copilot disposition (2026-09-20)

Copilot review `5260102601` examined `bb29a6dd99808bce31331c860225d25e2101679c`
and confirms all three round-2 findings are resolved. The complete new review and
annotation were preserved in `1f1ee0f` before correction. No additional conversation
or replies were returned. One new finding is accepted:

- **One relationship per ordered module pair — accepted and corrected.**
  [Comment 4056541956](https://github.com/ronen/postcode/pull/4#discussion_r4056541956).
  Exact occurrence partitioning alone permitted two distinct edges for the same
  parent/child pair when their support was disjoint. The store now also tracks
  canonical ordered `(subject, child)` pairs and rejects duplicates within each
  dependency evaluation. This enforces the existing aggregation decision without
  conflating opposite directions or changing provider recognition. The records
  method advances to `program-records@16`.

Correction: `e3adc105bd958ebe2829ec1f8feac4af2c5ace52`. The regression creates two
same-pair occurrences, divides them across individually valid pending relationships,
and checks rejection for both batch insertion orders. Each rejected record remains
absent and the prior evaluation and aggregate remain unchanged. The same fixture's
reverse-direction relationship is accepted in the original evaluation, preserving
ordered-pair semantics. The previous partition regressions remain in force.

Verification: `npm run check`, all **191/191 tests**, and `git diff --check` pass on
the correction. The new test initially assumed a particular generated module name;
that fixture assumption was corrected to select the two-occurrence aggregate before
the final passing run. No external-repository or new instrument-evaluator run was
performed; previously disclosed limits remain unchanged.

The human authorized commit, push and PR update for another review. The PR body
identifies the new exact head and prior reviewed target. Further review remains
required; the task is active and neither merged nor closed.


## Round 4 — no findings; human review recommendation (2026-09-20)

Review `5260125842` examined `f6bc7fcb6aea87ba27894284870f99df3a35f1a8`, reports
no findings, and confirms the ordered-pair correction resolved. It recommends final
human review because of the breadth of the integration, but identifies no particular
unresolved defect, missing check or contradictory requirement. Its complete text is
preserved in `45c85bf`; that recommendation is not converted into an unconditional
approval or rejected as meaningless.

The human asks whether another broad implementation review is warranted. The
implementing agent's recommendation is that another full broad pass is not necessary
solely on this evidence. Human review of the plan alone would not establish the
implementation's correctness. However, the accumulated evidence also includes the
independent round-1 implementation review of compiler evidence, record invariants,
graph, organization and CLI integration, its passing tests and live reproductions,
the earlier provider/graph checkpoints, and subsequent Copilot corrections and
rereviews. This is more than design approval. The broad round-1 review was performed
by an independent Claude Code session, not a human line-by-line code review.

The substantive changes after that broad review were localized store validation and
presentation corrections, with regression tests and a final passing 191-test suite.
Copilot's two store findings demonstrate that the earlier broad review was imperfect;
the response was to strengthen evaluation-wide checks and test the specific failure
modes, not to assume the earlier clean review proved every invariant. If the human
wants an additional independent check, a focused adversarial review of evaluation
partitioning, ordered-pair aggregation and atomicity would address the observed
weakness more directly than repeating all layers. This is an optional recommendation,
not authorization to arrange another reviewer.

Residual limits remain explicit, including the unconfirmed external-owner scenario,
external-checkout reproduction limits and latency observations. Copilot's broad
sentence does not resolve these or identify a new concrete issue. No new tests,
implementation changes or gate acceptance follow from this record. The human's
final acceptance/scope decision is pending; the task remains active and unmerged.
