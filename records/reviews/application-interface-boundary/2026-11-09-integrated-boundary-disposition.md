# Integrated application boundary review: disposition

Record type: disposition
Date: 2026-11-09
Task: [Separate application functionality from its interfaces](../../tasks/2026-11-08-application-interface-boundary.md)
Handoff: [Integrated application boundary review](2026-11-09-integrated-boundary-handoff.md)
Findings: [Round 1](2026-11-09-integrated-boundary-round-1-findings.md)

## Findings and dispositions

**F1 — accepted and corrected.** The direct `execute` boundary previously discarded non-string or unrepresentable `requestId` values and generated another correlation without reporting the loss. The correction uses the reviewer's typed-error option: an invalid supplied correlation rejects with the exported `InvalidRequestId` before application work begins. The error's frozen `captured` data preserves representable rejected values or explicit omission reasons. Accessors are never executed. Missing/undefined correlation still generates an ID; supplied strings, including empty strings, retain their spelling. Invalid correlation does not produce a fabricated semantic result or work report, and the Session remains usable.

The non-defect observation about the dependency guard was also addressed: the source-import traversal now explicitly forbids the root CLI `requests.ts`, `request-catalog.ts`, `presentation-contracts.ts` and `diagnostic-view.ts` modules. Neutral `application/requests.ts` remains allowed. The independent reviewer confirmed none of the forbidden imports currently exists; this strengthens regression protection without changing runtime behavior.

The other observations are accepted as review context and require no correction. In particular, the reviewer explicitly classified the in-flight-close work-status behavior as pre-existing; this correction does not change that policy. No actionable finding is rejected or deferred, and no scope expansion is proposed.

## Corrections and verification

Correction target: `6191231c1a5e2a7aa682e371ab1a7ac0fa48fd25`
Prior reviewed target: `e7de4b1ba5a222c0facc9b376c5a8c5b582e1386`
Corrected emitted-source SHA-256: `a9fcd566d8b6150575985c230d89d5fc34ec7f28217305a1fe285673f710f97c`

The new regression reproduced F1 on the reviewed implementation with `Missing expected rejection`. It passes after correction and covers numeric, boolean, null, object and array correlations; accessor/function/non-finite values; preserved versus omitted representation; immutable cloneable error data; caller mutation after capture; absence of accessor execution or work; valid/empty/generated IDs; and continued Session use. The focused application lifecycle/boundary/client suite passed all 12 tests before the final caller-mutation assertion; the full run below covers the final version.

- `npm test -- --test-concurrency=2`: **665/665 tests passed**, with no failures, skips or cancellations. The ordinary build ran as part of the command; local loopback access was enabled for offline authentication fixtures.
- `npm run check` and `git diff --check`: passed.
- All **21 stable CLI comparisons** and **60 both-host/collision retained-answer/allocation comparisons** passed against the unchanged post-provenance baseline. Both comparison reports identify the corrected emitted-source digest above.
- The reviewed findings and handoff were checked against `a93ee46` and remain byte-for-byte unchanged.

No method versions, semantic answer identities, CLI fields or comparison allowances changed. The correction concerns direct occurrence-correlation validation only. The handoff, returned findings and historical verification records remain unchanged. No live credentials or paid inference were used.

## Review rounds

1. Round 1 independently reviewed `e7de4b1` across the complete original-baseline-to-target change, reproduced all 664 tests and 81 extraction comparisons, and found one low, non-blocking capture-fidelity issue. The findings are already preserved by reviewer commit `a93ee46`; they were not copied or rewritten by the implementing agent.

The implementing agent corrected F1 at the target above and verified the correction. This is not an independent rereview. The reviewer explicitly considered this correction suitable for implementing-agent verification without another full review round; the original integrated handoff remains applicable if the human requests further review.

## Gate conclusion

The reviewer recommends that the implementation satisfies the final gate in substance, with F1 a small non-blocking correction. F1 is now corrected, but the human has not yet declared the final integrated gate sufficient. The task remains active pending the human's decision on further review or gate acceptance. No closure or merge is authorized by this disposition.
