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

## Verification

The [separate method checkpoint](../validation/application-interface-boundary/provenance-checkpoint.md) records original-to-post-split evidence. [Boundary verification](../validation/application-interface-boundary/boundary-checkpoint.md) records the extraction baseline, exact final implementation/build identity, checks and limitations: 638 passing full-suite tests on the preceding extraction build, 51 passing focused tests after final refinements, 21 passing stable CLI comparisons, and 60 passing retained-answer/allocation cases across in-process and worker hosts with ordinary and forced-collision fixtures. No live credentials or paid inference were used. These are implementing-agent checks, not independent-review findings or human acceptance.
