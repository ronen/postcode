# M3 agentic/caller cut-over review: disposition

Record type: disposition
Date: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Handoff: [M3 agentic/caller cut-over](2026-11-18-m3-agentic-caller-handoff.md)
Findings: [round 1, Claude](2026-11-18-m3-agentic-caller-round-1-findings.md)
Corrected target: `4a4d060e2c789f903f950d68602ffa99d0575d42`
Gate status: Accepted by the human on 2026-11-18

## Findings and dispositions

**F1 — accepted and corrected.** Common Unicode output now renders the applicable attempt kind, code and reason/diagnostic, each invalid-submission problem, and producer-reported inability/statement. It explicitly distinguishes a retained outcome from a new investigation request. Reporting text is escaped as inline terminal data. These details are read only from request reporting, not inserted into answer content or identity. Exact historical presentation has no attempt-report block; selected content still retains its applicable owner report and qualification. The responsible CLI presentation method advances to `postcode/contribution-presentation@3`.

**F2 — accepted and corrected.** An unavailable common acquisition is marked `withheld`, with the omission/refusal reason, matching program-evidence reporting. Dispatching its unavailable notice cannot turn that withheld content into a delivered acquisition. The pre-existing boundary still discards omitted delivery records; no exposure is added or removed by the attribution correction. Successful bounded excerpts are subsequently recorded as delivered normally.

Both corrections are in `4a4d060`. The original findings and handoff remain unchanged. The fixes do not revise the accepted attempt/answer decision or authorize additional capability work.

## Verification

Implementing-agent verification of the corrected target:

- `npm run build` and `git diff --check` passed.
- **89/89 offline tests passed**, with no failures, skips or cancellations, on macOS Node 22.13.1 at concurrency 2 (108.43 seconds). Files: `investigation-answer-outcomes`, `work-attribution`, `m3-agentic-cutover`, `contribution-dialog`, `retained-presentation`, `human-output`, `source-disclosure` and `application-exact-compatibility`.
- Twelve new direct/worker cases cover undesignated inability and statement, malformed replies, invalid submissions, call guards, communication failures and configuration failures. They verify rendered details, terminal escaping, reused versus retryable reporting, equal retained selections and exact replay excluding attempt-only details. Existing JSON and partial-content tests also pass.
- A new acquisition regression exercises an oversized initial whole-contribution response, an oversized explicit item request and a successful bounded excerpt. The first two have empty content deliveries and withheld attribution; only the excerpt appears in actual item exposure.
- The full suite and representative memory experiment were not rerun for these local rendering/work-disposition corrections. Their previous results remain attributed to `e6f5c4c` in the [caller checkpoint](../../validation/structured-architectural-accounts/m3-agentic-caller-checkpoint.md). No new memory result or independent verification of this correction is claimed. No live inference was performed.

The corrected compiled-source digest is `2244430ef84968a0020ca0a99ca60017b629a7831e24f77c56998cbb037d7490`. To clarify the reviewer's reproduction limitation, the existing `buildIdentity` function in [scripts/comparison-fixtures.mjs](../../../scripts/comparison-fixtures.mjs) computes this digest and is called by the memory profiler. It hashes sorted relative file paths and file bytes beneath the build's `src` directory. After compiling the exact target into a clean output directory, reproduce it from the checkout root with:

```sh
node --input-type=module -e 'import {buildIdentity} from "./scripts/comparison-fixtures.mjs"; console.log(buildIdentity("_build").sha256)'
```

This clarification does not alter the preserved review or imply that the reviewer reproduced the digest or memory measurement.

## Review rounds and remaining limits

Claude's round 1 reviewed `e6f5c4c28a467670100fbdc77b9fabac0b1df17e`, found the application cut-over sound apart from F1 and noted F2's attribution inconsistency. Its Linux VM run recorded 771 passes, two native kernel-lock failures and one matching native skip, while its focused 33 tests passed. Those environmental limits and the unverified representative memory run remain as reported. The reviewer explicitly judged implementing-agent verification sufficient for the local F1 correction; the new correction has not received a separate independent rereview.

## Gate conclusion

Both findings are corrected and locally verified. The human has reported that the review is ready but has not yet accepted the M3 caller checkpoint. Human determination remains pending; the mechanical checkpoint's prior acceptance does not accept this one. The existing handoff applies if the human requests further review, using the corrected target above. M4 integrated verification, legacy retirement and final review remain later obligations. The task stays active; no acceptance, closure, merge or live inference is inferred.

## Round 2 and human acceptance

[Claude's round 2](2026-11-18-m3-agentic-caller-round-2-findings.md), committed at `d30e0f7`, independently reviewed `4a4d060`, reproduced both fixes and the compiled-source digest, and returned no actionable findings. Its full Linux VM run recorded 784 passes, two native kernel-lock failures and one corresponding skip out of 787 tests; the preserved report explains those environment limits. It did not repeat memory measurements or live inference. Its round 1 assessment otherwise applies to the corrected target.

The human then stated: “ok, M3 called acceptance is good, continue with M3”. This accepts the caller checkpoint at `4a4d060`; direction is preserved in task follow-up `82d8b96`. Together with the earlier mechanical acceptance, the M3 checkpoints are satisfied. Continue the approved plan's remaining M4 integrated verification, legacy retirement and documentation work. Final integrated review and human confirmation remain required before task closure; no additional live inference is authorized. The earlier pending conclusions above remain historical evidence.
