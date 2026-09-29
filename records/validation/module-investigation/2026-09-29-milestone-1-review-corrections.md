# Milestone 1 review-correction validation

Date: 2026-09-29
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Review: [Round 1 disposition](../../reviews/module-investigation/2026-09-29-milestone-1-disposition.md)
Validator: implementing Codex agent; not an independent review
Runtime: Node.js 22.13.1 with the repository's pinned dependencies

## Correction coverage

F3, F5 and F6 were previously corrected in `1de634a` and passed all 31 then-current
investigation tests. F1, F2 and F4 were corrected under the human's recorded
rulings in `f5a974d`, with F7 regression coverage and no input-policy change.
All 34 investigation tests passed. The README regression also passed for partial
and completed mechanical work. Type checking, build and whitespace checks passed.

Final F2 inspection replaced JSON-based report equality with deep equality so
non-finite values such as NaN and Infinity remain distinct anomalous reports.
That refinement (`32f90a5`) passed type checking, build and both targeted usage
tests. It was made after the full-suite comparison started; the earlier full
suite alone is not evidence for that final refinement.

The regressions exercise explicit corrected program subjects across follow-up
chains and subordinate accounts, reject invalid corrected subjects, preserve
unusual usage without changing investigation success/failure, distinguish
correction-reporter exposure from complete target context, and preserve omitted
content as unexposed. No provider, credential or live inference was exercised.

## README acquisition evidence

The test first materializes organization and mechanical work, then acquires a
README through the subject-based evidence boundary. It verifies that:

- partial work gets one new attempt on a changed retry basis, then reuses it;
- completed work remains reused;
- earlier evaluations, input snapshots and claim-context attribution remain
  immutable;
- the new retry-basis analysis-input record includes README in the host's read
  observations, while the earlier compiler-read basis does not;
- acquisition alone does not invalidate the unchanged session.

During test development, an assertion against the first retained claim context
correctly failed: existing claims keep their original input attribution. The
final regression checks the new retry-basis record rather than mistaking an old
context for new work. No production behavior was changed in response. This
refines the attribution observation without changing the observed retry effect.
Human acceptance of the demonstrated shared-basis behavior remains pending.

## Bounded cancellation comparison

The comparison used one isolated execution-ownership run and one full-suite run
per baseline/corrected target, without repeatedly rerunning until green. The
baseline was a temporary detached worktree at the task-opening boundary
`c15afdd3b03f588534ac386c2453c81da71ffb68`. It used the same installed dependencies
and Node 22.13.1 as the working checkout. The temporary worktree was removed after
its runs; scratch logs remain under `_investigation/` and are not committed.

An initial baseline command selected the system Node installation, which failed
to load its llhttp dynamic library before tests began. Setting the Node 22.13.1
binary directory explicitly on PATH resolved that environment failure. It is
not counted as a test run or confused with the cancellation evidence.

| Target | Isolated execution ownership | Full suite |
| --- | --- | --- |
| Pre-implementation baseline | 13 passed, 0 cancelled | 283 passed, 0 failed, 13 cancelled; 296 total (125.5 seconds) |
| Corrected milestone 1 | 13 passed, 0 cancelled | 318 passed, 0 failed, 13 cancelled; 331 total (131.8 seconds) |

The baseline's first execution-ownership test was cancelled after approximately
364 ms with `Promise resolution is still pending but the event loop has already
resolved`; the remaining 12 tests in that file were cancelled by the parent.
This reproduces the review's pattern before investigation implementation and
establishes that the pattern is pre-existing. It does not establish the cause,
prove production cancellation is correct, or erase the cancelled verification.
No execution-ownership test or production cancellation code was modified.
The human has been asked whether to defer diagnosis explicitly to the backlog
or keep it open before gate acceptance.

Reproduction after building: `node --test _build/test/execution-ownership.test.js`
and `node --test _build/test/*.test.js`. The full runs were sequential; focused
checks also ran during the comparison, so this was not an isolated load study.

## Gate and limits

The original handoff, review and validation remain historical evidence. The task
is active at milestone 1. Human rulings on F7 and cancellation diagnosis, and
explicit acceptance of the milestone gate, remain pending. No milestone-2 work
has begun. Session retention, reconsideration, display and real-provider behavior
remain outside this checkpoint's verified scope.
