Record type: findings
Received: 2026-11-16
Reviewer: Codex (GPT-6), same reviewer as Codex rounds 1, 2, 4 and 5
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Round: 6
Reviewed target: `22698aeb7ff5c99fa608ee68017c8bcd6a29ea11`
Prior findings: [Codex round 5](2026-11-16-m1-mechanism-round-5-codex-findings.md)
Prior reviewed target: `1f7e1ec8a2aafd3e0f4b28ffb7fdfa5815a081ae`
Reviewed scope: focused rereview of `1f7e1ec..22698ae`, including the affected lifecycle and disclosure paths. Clean checkout at `393e5e9f4e1596094b538a8f889c5083048396e1`; its difference from the implementation target is the checkpoint record. The original M1 baseline remains `8a7f2834470644726dd742a0ddaeb1455bac3b2a`.

## Returned findings

### Recommendation

R1 is resolved. No new actionable defect was found in the correction or its affected paths. O1 remains an explicitly unresolved interpretation question, not a confirmed defect and not a resolved policy decision. The response accurately distinguishes those outcomes.

This focused check does not constitute another whole-mechanism review or establish human acceptance of the M1 gate. The human has requested a prompt for a separate fresh review session; this record neither starts that session nor closes or merges the task.

### R1 — terminal acceptance-validation failures

The acceptance catch now closes the production before propagating an unexpected exception. Structural `InvalidContribution` errors retain their bounded repair path: the same handle stays open during an allowed repair and is concluded when repair is exhausted. Fulfillment checking remains outside that catch, preserving accepted contributions and the original post-acceptance exception.

The new regression checks a faulty content contract with zero and two allowed repairs, failure during repair, exhausted repair, asynchronous producer failure and no submission. Existing regression coverage still checks post-acceptance fulfillment failure with zero and one permitted repair. These distinguish the required lifecycle boundaries rather than merely testing the new line.

An additional reviewer probe used a valid identification contract whose identifying-name extractor threw a particular `TypeError` late in staging, after a separate valid prose investigram had also been built. With zero and two permitted repairs, the original error propagated, the producer callback ran once, the retained-state snapshot was unchanged, and the handle was closed. Both a subsequent valid submission and further evidence registration through that handle were refused. This verifies another supported acceptance callback and the pre-commit boundary, beyond the new early-validator regression.

### O1 — secondary standing remains a reference rather than an exact notice

The response changes documentation/comments and adds a regression; it does not change propagation semantics. The test reproduces actual acquisition of B followed by C superseding B and acquisition of A with B's displacement context. C remains a cause when it is shown only in B's standing. The controls show that an exact notice of C or acquisition of B with C's qualified displacement context suppresses the producing-context cause.

That accurately describes the current implementation. The [checkpoint](../../validation/structured-architectural-accounts/m1-checkpoint.md) explicitly says the question awaits human direction. A regression pinning current behavior is evidence of that behavior, not independent adoption of its semantics. The governing notice rule requires the exact change, affected use and operation; the secondary standing value supplies no operation. Whether the producer-facing context should be enriched into a qualified notice remains open. No acquisition of replacement content may be invented by either interpretation.

### Independent verification and limits

- `npm run check` — passed.
- `npm run build` — passed.
- `node --test _build/test/contributions.test.js _build/test/contribution-exposure.test.js _build/test/contribution-results.test.js` — **50/50 passed**, no skips.
- Additional late-stage identifying-name failure probes — passed with both repair allowances, including original-error identity, atomic staging, closure and refusal of late work.
- `git diff --check 1f7e1ec..22698ae` — passed.

The complete legacy suite was not rerun; the checkpoint's 718/718 result remains implementing-agent evidence. No live inference, native integration, application-path verification or performance measurement was performed. Later-milestone obligations recorded in earlier reviews remain unchanged.

Only this findings record was added. Implementation, tests, governing documents, earlier records, the handoff and task/checkpoint status were not modified.
