# M3 remaining mechanical-family review: disposition

Record type: disposition
Date: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Handoff: [M3 remaining mechanical-family review](2026-11-18-m3-mechanical-handoff.md)
Findings: [round 1](2026-11-18-m3-mechanical-round-1-findings.md), [round 2](2026-11-18-m3-mechanical-round-2-findings.md)
Correction target: `8e06c5c74ba6679dd7e030dbb28162503b6235aa`
Gate status: Human determination pending

## Findings and dispositions

All four actionable round 1 findings were accepted and corrected in `8e06c5c`. Round 2 independently confirms each correction and reports no new actionable findings.

| Finding | Disposition |
| --- | --- |
| F1: Unrelated dependency-organization selection | Accepted and corrected. Children/parents select classifications only for their selected relationships. Regression coverage checks both directions, unchanged identity/concerns under unrelated changes, and continued disclosure in the whole-project answer. |
| F2: Overstated derived-input exposure | Accepted and corrected using the narrower-input option. The provider records exact relationships, their resolved occurrences, placement, containment, group and artifact-placement findings actually read. Non-edge requests and unrelated properties/documentation are excluded; mapping no longer recursively invents additional deliveries. No broader supplied-input semantics were adopted. |
| F3: Missing common input silently omitted | Accepted and corrected. Every input must resolve before a production opens. Regression coverage verifies unchanged ledger position, production and investigram counts on failure; synthetic fixtures establish their inputs through the normal boundary. |
| F4: Duplicate warning display | Accepted and corrected. Exports omit generic repetitions already disclosed by the specific presentation while retaining independent concerns. Organization renders concerns once around embedded module detail; both structured captures remain complete. |

The round 2 non-defect observation about an evaluation retained before contribution failure remains a disclosed boundary limitation: subsequent reuse can fail loudly on missing contributed findings. The reviewer did not request a correction, and this disposition introduces no change to that behavior. The earlier snapshot-size observation was investigated and addressed under separately authorized ownership-sharing work and its [separate review assignment](2026-11-18-m3-ownership-sharing-handoff.md); this disposition does not combine that assignment with the mechanical review.

## Corrections and verification

The [mechanical checkpoint](../../validation/structured-architectural-accounts/m3-mechanical-checkpoint.md) records the reproductions, corrections, method-version changes and implementing-agent verification: 49/49 targeted checks and 773/773 full offline tests at the correction target. The later ownership-sharing implementation passed 779/779 on the implementing machine, as preserved in its [validation record](../../validation/structured-architectural-accounts/m3-ownership-sharing-checkpoint.md).

The independent mechanical rereview compiled the exact correction target, matched its recorded build digest, passed 69/69 targeted tests, and reran its own F1, F2 and F4 reproductions successfully. Its full-suite run at the later sharing target recorded 776 passes, one filesystem-dependent skip and two native credential-lock failures in the Linux VM using a macOS-built dependency. The reviewer identifies these as environmental, not actionable implementation findings. The exact verification and remaining limits are preserved in the findings records; they are not represented here as an independent full-suite pass.

No additional implementation change or test rerun was needed to receive these clean findings. No live inference was used. Fixed-item reconsideration paths were not exhaustively independently checked; the full 741-module memory measurement was not independently repeated by the mechanical reviewer.

## Review rounds

- Round 1 reviewed `6d30d89e35971b04d759ff99f9f2a25f2111dab1` and returned F1–F4 plus non-defect observations.
- Round 2 reviewed corrections at `8e06c5c74ba6679dd7e030dbb28162503b6235aa`, verified F1–F4 and found no new actionable issues. It states that the corrections do not invalidate the remainder of round 1's analysis.

## Gate conclusion

The mechanical reviewer recommends sufficiency from the perspective of these findings. The human has notified the implementer that both assignments have been reviewed, but has not yet accepted the mechanical checkpoint. Human determination of review sufficiency remains pending. The task stays active; this disposition does not authorize proceeding through the gate, close the task, or replace the separate agentic/caller checkpoint and M4 integrated review.
