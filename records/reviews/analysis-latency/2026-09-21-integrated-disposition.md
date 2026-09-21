Record type: disposition
Date: 2026-09-21
Task: [Investigate and reduce analysis latency](../../tasks/2026-09-21-analysis-latency.md)
Handoff: [Integrated handoff](2026-09-21-integrated-handoff.md), supplemented by [PR #5](https://github.com/ronen/postcode/pull/5)
Findings: [Claude round 1](2026-09-21-integrated-round-1-findings.md); [Copilot round 2](2026-09-21-integrated-round-2-copilot-findings.md)

# Analysis latency integrated review disposition

## Findings and dispositions

### Claude round 1 — no actionable findings

No correction was requested. Claude independently reproduced all 21 comparison
cases and type checks. Its test run reported 191 passed and one pre-existing
filesystem-dependent skip. Its single timing check was explicitly a plausibility
check, not a replication of the controlled measurement series. The human required
PR and Copilot review before task closure; the clean recommendation did not close
the task.

### Copilot inline finding 4065385672 — accepted and corrected

[Source](https://github.com/ronen/postcode/pull/5#discussion_r4065385672).
The series driver previously continued after all three attempts for a sample were
excluded and could exit successfully without the requested representative count.
This is a clear defect in the authorized contamination/retry behavior.

Correction `053290f0a1f25a5573b85bdb7f995635878f791e` fails immediately after the
third excluded attempt with a nonzero exit and an explicit incomplete-series
message naming the case, variant, sample and retained manifest. Every attempted
run and available per-attempt report is written before failure. No subsequent
sample silently substitutes for the missing one. The same rule applies to
warm-ups. A successful third attempt continues normally.

The validation report explains the failure contract and use of a new output
directory for another series. The historical measurement series contains no
excluded attempts; its recorded samples and aggregates are unchanged.

### Copilot overview allegation about skipped-test counts — requires human direction

[Source](https://github.com/ronen/postcode/pull/5#pullrequestreview-5270611121).
The overview states: "two records misstate one skipped test as passed." No separate
annotation identifies the two records or the test run to which this refers.
This allegation is treated as a finding even though the overview lists only the
retry issue in its numbered finding count.

Evidence assembled for the human's decision:

- The original implementer log's summary is reproduced below. It reports 192
  tests passed and zero skipped; this is the run described by the original
  validation report and integrated handoff.
- Claude's independently preserved review reports 191 passed and one skipped
  on its environment. `STATUS.md` and the PR distinguish that run from the
  implementer's run.
- The correction verification performed now reports 195 passed and zero skipped.
  It is a new run, not a replacement for either historical result.

Original implementer log summary:

```text
1..192
# tests 192
# suites 0
# pass 192
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 20855.7981
```

The human was asked whether to record the allegation as unsupported by these
separate runs while preserving both results and the historical handoff, or to
clarify the current validation report further. No rejection or material
qualification has been adopted pending that answer. The historical handoff and
reviewer-authored findings have not been changed.

## Corrections and verification

- Correction: `053290f0a1f25a5573b85bdb7f995635878f791e`.
- `npm run check`: passed.
- `npm test`: 195 tests, 195 passed, zero skipped or failed.
- New regression coverage runs the actual benchmark driver against deterministic
  child measurement reports in an isolated temporary working directory. It
  verifies nonzero termination after warm-up or representative retry exhaustion,
  retention of all three rejected attempts and their reasons, no later sample
  continuation, and successful completion of all requested sample slots when the
  third attempt succeeds. These tests make no performance-threshold assertions.
- Raw timing evidence and production discovery behavior are unchanged; this fix
  affects the development series driver. No timing rerun was needed to establish
  its deterministic retry-exhaustion behavior.
- All returned Copilot bodies were checked byte-for-byte against the fetched API
  bodies before the findings record was committed. All pages of review, inline
  and conversation collections were retrieved; there were no conversation comments.

## Review rounds

1. Claude: target `b74c454c08c95a5aae7aacff816b27019fecaf9f`; no actionable findings.
2. Copilot: target `98c3c18cc15c0e8fa9039d849c96ece640acd368`; retry defect accepted
   and corrected, overview test-count allegation awaiting human direction.

## Gate conclusion

The task remains active. Human direction is required on the test-count allegation
before its final disposition. No final review-gate acceptance, merge or task
closure is inferred. The corrected benchmark behavior is verified by the
implementing agent; Copilot has not yet reviewed the correction.
