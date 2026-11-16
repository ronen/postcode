# M1 common contribution mechanism review: disposition

Record type: disposition
Date: 2026-11-16
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Findings:

- [Round 1, Codex](2026-11-15-m1-mechanism-round-1-findings.md)
- [Round 2, Codex](2026-11-15-m1-mechanism-round-2-findings.md)
- [Round 2, Claude](2026-11-15-m1-mechanism-round-2-claude-findings.md)
- [Round 3, Claude](2026-11-15-m1-mechanism-round-3-claude-findings.md)
- [Round 3, Copilot](2026-11-15-m1-mechanism-round-3-copilot-findings.md)
- [Round 4, Codex](2026-11-16-m1-mechanism-round-4-codex-findings.md)
- [Round 5, Codex](2026-11-16-m1-mechanism-round-5-codex-findings.md)
- [Round 6, Codex](2026-11-16-m1-mechanism-round-6-codex-findings.md)
- [Round 7, Codex](2026-11-16-m1-mechanism-round-7-codex-findings.md)

## Findings and dispositions

Every actionable finding was accepted. None was rejected, qualified or deferred. Each was a conformance defect within the authorized scope, and none required a change to the adopted semantics. Two matters went to the human and are recorded at the end of this section.

| Round and finding | Disposition | Basis |
| --- | --- | --- |
| R1 Codex F1: a valid pool with a forward identifying reference partially committed | Accepted | Atomic acceptance of a flat pool has no semantic order |
| R1 Codex F2: bounded excerpts discarded item qualification | Accepted | Excerpts retain applicable source qualification |
| R1 Codex F3: routed item delivery hid an accepted displacement | Accepted | Displaced information arrives with its displacement context |
| R1 Codex F4: delivery history aliased caller-owned values | Accepted | Actual delivery history is the authority for reconsideration |
| R2 Claude F1: only an explicit notice made a change known | Accepted | A known cause cannot re-enter by another route |
| R2 Claude F2: a declaration address delivered a use without exact-use exposure | Accepted | Later displacement of an exact received use is a cause |
| R2 Claude F3: malformed scopes and excerpt bounds were recorded | Accepted | Unavailable information is not an established empty result |
| R3 Claude R1 and Copilot 6: a change disclosed as a concern re-entered | Accepted | Same rule as R2 Claude F1 |
| R3 Copilot 1 and 3: mutable displacement and declaration entries | Accepted | Retained information is immutable |
| R3 Copilot 2: two productions of one identity accepted together | Accepted | Each investigram keeps its own producer's history |
| R3 Copilot 4: method-filtered identification defaulted to standing uses | Accepted | A method-specific query retains that method's findings |
| R3 Copilot 5: member delivery recorded before validating its bound | Accepted | A refused request delivers and records nothing |
| R4 Codex F1: method selection followed the organizer | Accepted | Findings and organizing judgments keep separate attribution |
| R4 Codex F2: excerpt records lost actual coverage | Accepted | Retained history identifies actual coverage |
| R4 Codex F3: a fulfillment-check error reopened structural repair | Accepted | Validity and fulfillment are separate; defects propagate |
| R4 Codex O1: a fresh partial attempt reported fulfilled by an old answer | Accepted and corrected in M1 | See below |
| R5 Codex R1: an unexpected acceptance failure left the production open | Accepted | Late submission is rejected after execution ends |
| R5 Codex O1: a further displacement shown only as standing | Human direction obtained | See below |

Rounds 2 (Codex), 6 and 7 reported no actionable finding. The reviewers' non-defect observations are carried into later milestones in the [M1 checkpoint record](../../validation/structured-architectural-accounts/m1-checkpoint.md).

**Round 4 O1.** An earlier review had assigned the relation between reported answers and fulfillment to M2. The implementing agent corrected it in M1, because the M1 producer boundary was returning a false fulfilled status and the governing text settles the behavior. That changed an earlier scope disposition, so it was reported to the human as the implementing agent's judgment. The human approved it with the other implementation choices on 2026-11-16.

**Round 5 O1.** The reviewer did not assert a defect and left the interpretation open. The implementing agent changed no behavior, documented the current reading and pinned it with a test. The human resolved it on 2026-11-16: keep the existing reference-versus-notice rule, with no automatic enrichment of secondary standing, and verify the result-delivery path for a producer that invoked secondary work. That path already existed. A controlled test verifies it, and the checkpoint records the remaining integration gap for M2.

Two human follow-ups during the assignment also shaped the result without being reviewer findings: the feedback on the implementation choices before round 1, and the clarification that displacement context is not acquisition of the replacement. Both are preserved verbatim in the task record.

## Corrections and verification

| Commit | Content |
| --- | --- |
| `2bc5b86` | Initial mechanism |
| `84c1cc1` | Pre-review clarifications after human feedback; round 1 target |
| `b02c7bc` | Round 1 corrections; round 2 target |
| `9ca9865` | Round 2 Claude corrections |
| `5ebe10a` | Displacement-context clarification; round 3 target |
| `2b9fce8` | Round 3 corrections; round 4 target |
| `1f7e1ec` | Round 4 corrections; round 5 target |
| `22698ae` | Round 5 correction; target of rounds 6 and 7 |
| `73fe7a9` | Result-delivery test and documentation after the human's resolution; no source change |

Each correction has a regression test named in the checkpoint record's per-round sections. At `73fe7a9` the implementing agent's checks were: `npm run check` and `git diff --check` passed; the contribution tests passed 51/51; the complete offline suite passed 719/719 with no skips, comprising the 668 unmodified tests of the starting revision and 51 new tests.

Reviewers independently ran the type check, build and contribution tests at each target. No reviewer reproduced a complete-suite pass. Two reported complete runs with three sign-in tests failing in a sandbox that could not bind a local port, and passing outside it. The complete-suite result therefore remains implementing-agent evidence. Earlier complete runs that failed under a modified worktree or heavy machine load are described in the checkpoint record, with their cause stated as inferred.

Residual limits are those the reviewers carried forward: the mechanism is exercised by controlled producers only; native and common identity correspondence, mechanical answer ordering under reordered arrival, real Claim-context kinds and methods, shared Session lifetime, selected-content baselines, nested designated-content delivery, result delivery through the real dialog, and accumulating-Session measurements are M2 and later obligations.

## Review rounds

| Round | Reviewer | Target | Result |
| --- | --- | --- | --- |
| 1 | Codex | `84c1cc1` | Four findings |
| 2 | Codex | `b02c7bc` | Clean |
| 2 | Claude | `b02c7bc` | Three findings |
| 3 | Claude | `5ebe10a` | One finding |
| 3 | Copilot | `eb09a82` (`5ebe10a` plus the checkpoint record) | Six comments, one the same as the Claude finding |
| 4 | Codex | `2b9fce8` | Three findings and one reproduction in a deferred area |
| 5 | Codex | `1f7e1ec` | One finding and one open interpretation |
| 6 | Codex | `22698ae` | Clean; focused check |
| 7 | Codex, fresh session | `22698ae` | Clean; whole mechanism |

The one commit after the last reviewed target, `73fe7a9`, adds a test and documentation and changes no source. It was not independently reviewed.

## Gate conclusion

On 2026-11-16 the human approved the implementation choices and determined that the Milestone 1 review gate is satisfied: "your other choices are approved.  M1 is satisfied." The statement is preserved in the task follow-ups. The task remains active for Milestones 2 to 4.
