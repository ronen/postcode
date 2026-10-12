# Answer identity checkpoint: disposition

Record type: disposition
Date: 2026-10-12
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Handoff: [Answer identity checkpoint](2026-10-12-answer-identity-handoff.md)
Findings: [Round 1](2026-10-12-answer-identity-round-1-findings.md)

## Findings and dispositions

| Finding | Disposition | Basis and action |
| --- | --- | --- |
| F1 — Unlabelled lookup-population limitations in Unicode | Accepted and corrected | All four renderers share a text-only lookup qualifier derived from each supplied population's applicability, availability and execution/materialization. Complete lookup adds no general provider-limitation lines. Consequential coverage limits carry a `Lookup (modules)` or `Lookup (groups)` label and an escaped reason or conservative fallback. The complete JSON resolution context and the answer's own qualification remain intact. |
| F2 — Caller order and embedded empty selections | Requires human direction | Confirmed that the module selection preserves caller order and that organization/dependency construction inherits it; no current Session path supplies arbitrary permutations. The reviewer offers consequential alternatives, so neither is silently selected. Recommend population-order canonicalization with outside-population subjects in a fixed order, preserving reference allocations. Separately recommend an explicit internal embedded-detail entry point while rejecting an empty ordinary inspection. These choices were put to the human; constructor behavior remains unchanged pending direction. This is a pending decision within the active plan, not rejection or deferral beyond task completion. |
| F3 — Loss of status-specific fixture assertions | Accepted and corrected | The fixture adapter includes the actual resolution status in its refusal error. Every migrated generic assertion now names the expected missing, unknown-reference, lookup-incomplete or lookup-unavailable status. The old collision test is retitled to describe its retained-subject assertion, and View-context identity explicitly distinguishes a literal name from a raw reference whose normalized spelling is the same. |
| F4 — Stale lookup branches and fixed reference suffix | Accepted and corrected | Removed impossible missing-selection fallbacks and ambiguity/follow-up limitations from investigation arrangement, redundant cardinality failure terms from Session publication, and the fixed `current` suffix from precise-reference wording. Valid unavailable/failed outcomes and unknown-continuation failure still apply. The publication test now verifies the suffix is absent instead of carrying an unreachable assertion about the removed reference-status field. |

## Corrections and verification

Correction target: edeb749454f832b55821c1ab5b527c2b6e6f786a.

`npm run check` and build passed. The focused constructor/identity/refusal run passed all 79 tests. The new CLI lookup test passed after correcting its fixture handle. Final `npm test` passed all 516 tests (about 169 seconds), including worker/parent publication, unknown-continuation and unavailable outcomes, reference spelling, Unicode/JSON, source disclosure and usage/cancellation. `git diff --check` passed. No paid inference was used; existing offline authentication tests used local loopback permission. Visible repository inputs were held stable during testing.

Mechanical presentation advances from `@29` to `@30`, and investigation presentation from `@14` to `@15`, reflecting the changed rendering. Answer formulas, subject selection and allocation schedules are unchanged by F1/F3/F4. As already documented, provider capture of the method registry can change supporting input IDs when these methods advance. Descriptive architecture and CLI documentation explain the narrower Unicode lookup notices.

The new CLI test uses real complete lookup and real unavailable group lookup, each with a successfully selected module. It also exercises the CLI renderer with explicitly supplied partial module coverage and escaped control text; that controlled case is not claimed as an end-to-end provider partial-lookup test. The first new test attempt incorrectly assumed the generic filename `entry.ts` produced handle `entry`; the fixture was corrected to `widget.ts`, whose expected handle is independently established by existing cases. Production lookup was not changed to accommodate the test.

The reviewer's non-defect observations are retained as supporting analysis, not substituted for further verification. Residual limits remain: no new end-to-end partial mixed group/module CLI case, mixed name/reference shell follow-up probe, cancellation-during-construction probe or worker-restart-between-resolution-and-arrangement probe; second-consuming-Lens reuse and attribution/compatibility/catalog demonstrations remain required later in the approved plan. The historical intermittent CLI failure's cause remains unconfirmed; neither the review's passing suite nor this correction claims to resolve it.

## Review rounds

Round 1 examined `5d1b33631313cfbbb1f304b0a4aba94153b29d00` over `a081c92..5d1b336`. The reviewer reported four nonblocking findings, recommended F1 correction and F2 resolution before extension demonstrations, and did not require another review round unless the human prefers one. F1/F3/F4 are local corrections; the F2 choice remains separate.

## Gate conclusion

Human direction is required on F2 and on sufficiency of this intermediate review gate before wider implementation resumes. No finding has been rejected or materially qualified. The task remains active and the broader implementation remains paused. Final integrated review and human acceptance are still required before task closure; the reviewer's recommendation alone does not accept either gate.
