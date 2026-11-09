# Separate application functionality from its interfaces

Status: active
Opened: 2026-11-08
Closed:

## Task

Please implement the approved plan at docs/plans/application-interface-boundary.md -- This is explicit authorization to begin the substantive implementation task described by that plan.

## Follow-ups

Before opening the record, the human selected the starting-point action in response to the main-synchronization check (local main was 11 commits ahead, including the approved plan):

> Publish local main first, then use 815f237

Main was published and verified equal to origin/main at `815f2378a5e6f2d4ca36884e4a8547a42f6c49ca`. Implementation uses `codex/application-interface-boundary` in `../app-worktrees/application-interface-boundary`.

## Outcome

2026-11-09: M1 is implemented through the required intermediate review checkpoint. Method provenance was separated in `b4dc07b`; the application boundary and shared CLI adapter are implemented at `94f3c5046115687205b695aafa33bba9c35fef96`. [Draft PR #13](https://github.com/ronen/postcode/pull/13) contains the task branch. The [M1 handoff](../reviews/application-interface-boundary/2026-11-09-m1-boundary-handoff.md) is committed for human-arranged independent review. Implementation stops at that gate; the task remains active, with M2–M4 work still required.

2026-11-09: Accepted and corrected all three findings from the [M1 round 1 review](../reviews/application-interface-boundary/2026-11-09-m1-boundary-round-1-findings.md) in `67e3818`. F1 keeps local delivery/publication checks inside the accepted operation scope and lets `publishCommand` use that scope around actual output exactly once. F2 adds production-entry exact-path coverage for exports support refusal, support/materialization fallback, partial/empty results, and retained investigation revision/association continuations. F3 attributes malformed invocation attachments to `invocation`, while preserving the accepted semantic request. No finding was rejected or deferred. The original handoff remains applicable; the changed publication composition is presented for further review at this correction target. No new assignment or intermediate disposition is opened; the assignment's final disposition and human gate conclusion remain pending. M2–M4 have not begun.

## Verification

The [separate method checkpoint](../validation/application-interface-boundary/provenance-checkpoint.md) records original-to-post-split evidence. [Boundary verification](../validation/application-interface-boundary/boundary-checkpoint.md) records the extraction baseline, exact final implementation/build identity, checks and limitations: 638 passing full-suite tests on the preceding extraction build, 51 passing focused tests after final refinements, 21 passing stable CLI comparisons, and 60 passing retained-answer/allocation cases across in-process and worker hosts with ordinary and forced-collision fixtures. No live credentials or paid inference were used. These are implementing-agent checks, not independent-review findings or human acceptance.

Correction verification at `67e3818`: `npm run build`, `npm run check`, and `git diff --check` passed. The full offline suite ran 652 tests: 650 passed, and two authentication/kernel-lock tests failed because the installed `fs-ext` binary targeted Node 22 while execution used Node 26. After `npm rebuild fs-ext`, the complete 20-test authentication file passed, including both failures; no product change was needed for that environment correction. Thus every test has a passing result on the correction code. The 21 stable CLI and 60 both-host/collision journey comparisons passed against the same post-provenance baseline, with unchanged comparison policy. Corrected emitted-source digest: `627a27158bb7b77734fd9acd32aa57d7db1c2c7a5ae55da813b5d8c6485ec097`.

The new race test was also run against the reviewed build and failed with `SessionBusy`; its new publication tests exposed five source checks instead of three on stable/after-output delivery and four instead of two on output failure. They pass with the correction. New exact-path tests deny selection/Evaluation/acquisition during exact access and retain full assertion coverage through the application/CLI entries. Malformed attachment cases include functions, Maps, class instances, null, arrays and primitives; accepted usage work remains completed and the omission is labelled `invocation`. Review evidence is preserved unchanged, and the task remains active pending the human-arranged review decision.
