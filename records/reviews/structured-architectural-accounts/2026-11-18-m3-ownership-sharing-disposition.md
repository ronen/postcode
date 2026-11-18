# M3 ownership-aware sharing review: disposition

Record type: disposition
Date: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Handoff: [M3 ownership-aware sharing review](2026-11-18-m3-ownership-sharing-handoff.md)
Findings: [round 1](2026-11-18-m3-ownership-sharing-round-1-findings.md), [round 2 Copilot](2026-11-18-m3-ownership-sharing-round-2-copilot-findings.md), [round 3](2026-11-18-m3-ownership-sharing-round-3-findings.md)
Corrected target: `08f6cde38d514251a34962ccc095a569a1e22a5f`
Gate status: Human determination pending

## Findings and dispositions

Copilot comment `4618453312` is **accepted and corrected**. The original ownership implementation supported cyclic plain graphs while live, but its post-disposal and native fallback paths could overflow the recursive freezer. Correction `08f6cde` adds a visited-object Set local to each freezing call. It preserves cycles, aliases and deep freezing without restoring ownership bookkeeping or treating a caller's shallow freeze as ownership proof.

Claude's round 3 independently reproduces the defect on the earlier build and verifies its correction, including the cyclic getter fallback and fresh-copy behavior after disposal. It reports no new actionable findings and maintains its recommendation that the corrected sharing change is ready for inclusion in the mechanical checkpoint. The change of reviewer does not change the assignment or require a new handoff.

The observations about active-session table cost, serialization/canonicalization cost, pre-existing exotic-value behavior, recursion-depth limits and per-call traversal allocation remain disclosed non-defect observations. No further optimization or semantic change is adopted through this disposition. The initial clean review did not exercise cyclic fallback or post-disposal capture; its coverage limitation and the later defect remain visible in the preserved records.

## Corrections and verification

The [validation checkpoint](../../validation/structured-architectural-accounts/m3-ownership-sharing-checkpoint.md) preserves implementation and measurement evidence separately by exact target. At the correction target, the implementing agent verified type/build checks, 32/32 focused tests, 780/780 full offline tests on macOS Node 22.13.1, and a forced-GC control for the disposed ownership table and per-call traversal table with outputs held. No live inference was used.

Claude's round 3 matched the corrected compiled-source digest, passed type/build and diff checks, and verified both formerly failing cyclic paths. Its independent full-suite run on Linux Node 22.23.5 recorded 777 passes, one filesystem-dependent skip and two native credential-lock failures attributed to the installed macOS-built dependency. These are preserved as environmental limits, not represented as an independent all-passing suite.

The independent round 1 reduced-scale memory reproduction remains evidence for the original sharing implementation: matching identities, retained counts and exposure, with approximately 46% lower retained heap on 239 modules. The full 741-module measurement and extended GC control were not independently rerun in round 3. The earlier memory figures retain their original targets; no new memory or latency result is claimed for the cycle correction. No additional implementation change or verification rerun was required by the clean re-review.

## Review rounds

- Round 1: Claude reviewed `f4e8a386de51eda7483227dd386b9d6f265b730a` and returned no actionable findings, with the limits recorded above.
- Round 2: Copilot reviewed `8719c25602dda05965567562d39b0d779b579f38`, whose product code was unchanged from round 1, and identified the cyclic post-disposal defect. The complete latest review and inline comment were preserved before correction in `22f6738`.
- Round 3: Claude reviewed `08f6cde38d514251a34962ccc095a569a1e22a5f`, verified the correction and returned no new actionable findings.

## Gate conclusion

The ownership-sharing review cycle is clean at the corrected target. The human has reported completion of the re-review but has not yet accepted the M3 mechanical checkpoint. Human determination remains pending. This disposition is separate from the [mechanical-family disposition](2026-11-18-m3-mechanical-disposition.md); neither substitutes for the later agentic/caller checkpoint or M4 integrated review. The task stays active and no gate acceptance, task closure or further live inference is inferred.
