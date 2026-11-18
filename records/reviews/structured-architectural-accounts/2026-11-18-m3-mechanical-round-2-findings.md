# M3 remaining mechanical-family review: round 2 findings

Record type: findings
Received: 2026-11-18
Reviewer: Claude (Opus 5.5), independent review session
Handoff: [M3 remaining mechanical-family review](2026-11-18-m3-mechanical-handoff.md)
Round: 2
Reviewed target: `8e06c5c74ba6679dd7e030dbb28162503b6235aa`
Reviewed scope: `6d30d89e35971b04d759ff99f9f2a25f2111dab1..8e06c5c74ba6679dd7e030dbb28162503b6235aa` (the round 1 correction commit; records-only commits `473602e` and `58153ad` read as context)
Prior findings: [round 1](2026-11-18-m3-mechanical-round-1-findings.md)
Prior reviewed target: `6d30d89e35971b04d759ff99f9f2a25f2111dab1`

## Returned findings

### Recommendation

**No new actionable findings.** F1–F4 from round 1 are each corrected as recommended, with direct regression coverage. My own round-1 reproductions no longer show the defects against the corrected build. The corrections do not invalidate the rest of the round-1 analysis.

From the perspective of these findings, the mechanical checkpoint is sufficient to proceed. The separately assigned [ownership-sharing review](2026-11-18-m3-ownership-sharing-round-1-findings.md) covers the later representation change (`f4e8a38`), which addresses round 1's snapshot-size observation O1. The human decides whether the checkpoint is sufficient.

### Method and verification

I read the correction diff (`8e06c5c`), the checkpoint's round 1 corrections section (`58153ad`) and the new and changed tests. I re-checked each correction against the provider code it depends on, in `dependencies/organization.ts`, `dependencies/projections.ts`, `exports/presentation.ts` and `presentation.ts`. I confirmed that `src/` and `test/` are unchanged between `8e06c5c` and the ownership-sharing diff baseline `959ef44`.

Verification ran on the user's machine in a Linux VM (Node 22.23.5) against the installed dependencies. I compiled each exact revision from `git archive` into scratch space, so the worktree was not modified:

- `8e06c5c` compiles. Its compiled-source digest is `6113c623dc0d…`, which matches the runtime baseline digest recorded in the ownership-sharing summary.
- From a self-contained git copy of `8e06c5c`: `contribution-native`, `contribution-modules`, `dependency-projections`, `contributions` and `contribution-exposure` passed **69/69**.
- The complete suite was run at `f4e8a38`, which includes these corrections: 779 tests, 776 passed, 1 skipped and 2 failed. The skip and failures are the same environmental cases as in round 1 (case-insensitive filesystem; macOS-built `fs-ext` kernel lock). Details are in the ownership-sharing round 1 record.
- `git diff --check 473602e f4e8a38` passed.
- I reran my round 1 probes against the compiled `8e06c5c` build:
  - **F1:** a dependency-children answer for one module no longer selects any classification outside its relationships.
  - **F2:** on `fixtures/dependency-journey`, the dependency-organization production delivers exactly module-placement 6, containment 2, group 3, artifact-placement 7, dependency 6 and resolved occurrence 6. There are no group-properties or module-identification items.
  - **F4 (exports):** each withdrawal's grounds are rendered once.

No live inference was used.

### Disposition of round 1 findings, as verified

- **F1, corrected.** Children/parents now select only dependency-organization claims whose `subject` is one of the answer's relationships, and non-classification claims are rejected. The new test covers both children and parents with nonempty selections. It shows that an unrelated inconsistency leaves both answer IDs and their concern text unchanged, that the selected classification set equals the answer's relationships, and that the whole-project structure answer still discloses the inconsistency. The architecture text now states the narrowed rule.
- **F2, corrected (narrowing option a).** The provider accumulates exactly the records its body reads: placement and containment claims, the group claims whose contexts it reads, artifact-placement claims, each relationship and that relationship's resolved occurrences. Input mapping is no longer recursive, so delivering a relationship no longer also delivers its endpoint module identifications. That matches the provider's actual reads; endpoints are resolved through placement. The test compares the complete delivered set with the expected set, using real group-properties, group-documentation and unresolved-request negative controls.
- **F3, corrected.** Every declared input must resolve to an established item, and the mapping runs before any production opens. The test checks that ledger position, production count and investigram count are unchanged after the throw. The previously synthetic dependency-placement fixture now contributes its constructed inputs through the normal boundary.
- **F4, corrected.**
  - In the exports view, the generic lines now omit exactly the uses, changes and producing owners that the M2-specific text already renders. I checked that the M2 text renders each cause's operation, grounds and owner/declaration qualifications, so nothing is hidden. Independent native concerns still render; the test withdraws an individual-export use and finds its grounds once.
  - Embedded module detail no longer renders native concerns; the enclosing organization view does. Both structured captures stay complete, which my structural probe confirmed. The test confirms single rendering in the organization view.

### Non-defect observations

- **Fail-closed timing.** The new input check (F3) and acceptance in general run after the derived provider has `store.put` its evaluation. If one of them throws, a later identical call can return the retained evaluation early without contributing, and answers will then fail closed with `Expected contributed native finding`. This is loud rather than silent, it applies equally to every native producer, and real paths contribute inputs first. I mention it only as the residual shape of the boundary.
- Method versions advance appropriately for the changed projection, provider and presentation semantics (dependency-projection @10, dependency-organization @2, presentation @40, module-exports presentation @10).

### Unverified areas and residual limits

- I did not rerun the 741-module measurement against `8e06c5c` itself. See the ownership-sharing record for the reduced-scale comparison that used `8e06c5c` as its baseline.
- Round 1 limits that the corrections did not touch still apply. In particular, I have not exhaustively checked whether fixed item deliveries can ever produce reconsideration causes.
