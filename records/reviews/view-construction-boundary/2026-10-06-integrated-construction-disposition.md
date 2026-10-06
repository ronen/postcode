Record type: disposition

# Qualified construction boundary final integrated review: disposition

Date: 2026-10-06
Task: [Construction boundary](../../tasks/2026-10-05-view-construction-boundary.md)
Handoff: [Final integrated review](2026-10-06-integrated-construction-handoff.md)
Findings: [Round 1](2026-10-06-integrated-construction-round-1-findings.md)
Reviewed target: `16ec9ae261715735aa44f62e969ae0f49dc2942e`
Correction: `0e82ee5`
Status: findings addressed; human authorized push and PR creation; task remains active

## Actionable finding

**F1 — Accepted and corrected.** The production OpenAI adapter constructs failures
with `provider` before `kind`, `code` and `diagnostic`. Arrangement had moved
`provider` to the end. Values were unchanged, but serialized JSON and observation
rendering differed outside the permitted set.

The comparison fixture now uses the adapter's order. Before correcting the
implementation, that fixture reproduced the reviewer's failure at JSON offset
1027 for the first unavailable JSON case. Arrangement now reconstructs the
provider field first when present. This restores baseline serialization while
keeping provider metadata in reporting and outside retained selection identity.
The focused test asserts exact serialized equality with the production-shaped
failure. No new behavior allowance or architectural decision is introduced.

After correction, type checking and the build passed; all **52 focused selection
and integration tests** passed. The updated differential passed **486 cases**,
including full rendering, observation contents, binding schedules, disclosures
and three real provider input captures. The
[post-correction comparison](../../validation/view-construction-boundary/2026-10-06-integrated-correction-comparison.json)
records the result. Whitespace checks passed. The reviewer independently passed
all 486 suite tests on the reviewed target; that full run predates this correction.
The narrow correction was verified with the focused tests and differential rather
than claiming another full-suite run.

The original integrated verification record's fixture-order correction concerned
the outer result object. It did not cover this nested provider-first production
failure. The historical record is preserved; this disposition records the gap and
the added verification rather than extending the earlier claim retrospectively.

## Non-defect observations

All four observations are accepted.

1. **Duplicate test assertion:** removed the repeated View-ID assertion in the
   associated-inspection test. The remaining assertion preserves its coverage.
2. **Ignored `after` in non-inspect arrangement keys:** retained as reported.
   The accepted formula includes continuation in the arrangement key, and the CLI
   parser restricts `--after` to interactive inspection. No supported CLI behavior
   needs correction; no new normalization policy is introduced.
3. **Retained records accumulate:** acknowledged as the approved selection-retention
   strategy. Repeated pages deduplicate by identity. Performance and memory remain
   uncharacterized; this review supplies no new scalability claim.
4. **Mechanical comparison requires a Git checkout:** made explicit in the script's
   reproduction comment. Run it from the target Git checkout root, passing compiled
   baseline and target output roots. An extracted source tree lacks repository
   capture and exercises fewer organization Views; its smaller count is not the
   committed 632-View comparison.

## Assessment and limits

The review's seven focus-area assessments are accepted. The reviewer confirms
the construction/arrangement boundary, fixed retained selections, bounded display
behavior, allocation schedule, identity separation and worker finalization,
organization classification and the documented comparison allowances.

The stated coverage limits also stand: the investigation differential uses
synthetic history and does not independently cover follow-up lenses,
program-subject unsupported requests or organization-routed associated inspection.
Those paths have code-reading and existing unit/integration evidence. No hosted
inference, GUI, performance or memory verification is claimed. These are reported
limits, not unresolved blocking findings or authorization to expand this task.

## Gate conclusion

Round 1 recommended acceptance after F1 and explicitly identified its correction
as narrow enough for author verification without another independent round. F1 is
corrected and verified; no finding is rejected, materially qualified or deferred.
The human authorized pushing all changes and creating a PR with a concise summary,
while explicitly keeping the task open. This disposition supports that next step;
it does not interpret the reviewer recommendation or PR authorization as approval
to close the task. Explicit human closure approval remains required.
