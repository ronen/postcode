# Request attribution checkpoint: round 2 findings

Record type: findings
Received: 2026-10-13
Reviewer: Claude Opus 5.5 (Claude Code), independent session with no implementation involvement (also the round-1 reviewer)
Handoff: [2026-10-12-request-attribution-handoff.md](2026-10-12-request-attribution-handoff.md)
Round: 2 (narrow re-check of timing and report size, as recommended in round 1)
Reviewed target: aafaae226f24b503fbc6f89b14026ef1f950ae9f (corrections `2c26810..aafaae2`, branch `codex/lens-request-model`)
Prior findings: [2026-10-12-request-attribution-round-1-findings.md](2026-10-12-request-attribution-round-1-findings.md)
Prior reviewed target: 2c26810611230bcb5d28a8f89d75b5213d57a893

## Returned findings

### Method

- Read the [disposition](2026-10-13-request-attribution-disposition.md), the [compact attribution decision](../../../docs/decisions/compact-attribution-and-complete-results.md), and the documentation, STATUS and task-record updates in `2af5881..HEAD`.
- Confirmed that `HEAD` (`d5f09c9`) differs from `aafaae2` only in records (`git diff aafaae2 HEAD -- src test fixtures package.json` is empty).
- Inspected the complete source diff `2c26810..aafaae2`:
  - `WorkReportState`, `WorkProgress` increments, `RequestWork.emit`, and `snapshot` and `finish`;
  - report-local parent references and the `reportedParents` table;
  - generating groups keyed by original origin;
  - `recordExpansionWork` and its two call sites;
  - `summarizeWork` in `renderRequestReport`;
  - Session `currentWork` and `finishWork`;
  - worker `work-progress` messages and parent reconstruction and sealing in `interactive-session.ts`.
- Extracted `aafaae2` with `git archive` into the scratchpad, built it there, and reran the round-1 probes on it. CLI observations were written outside the repository. I compared against my round-1 figures for the baseline `1b5f178` and the target `2c26810`; I did not rerun those builds.

### Verification performed

- `npm run check`: passed.
- `npm test` (loopback permitted, repository inputs held stable): 535 tests, 535 passed.
- Single-run measurements on this repository's 685-module `tsconfig.json`:

| Case | Baseline `1b5f178` (round 1) | Target `2c26810` (round 1) | Corrected `aafaae2` |
|---|---:|---:|---:|
| Direct Session `modules` | 6.0 s | 47.3 s | 6.0 s |
| Direct Session `dependencies` | 1.8 s | 54.2 s | 1.8 s |
| Direct Session repeated `dependencies` | 1.0 s | 53.6 s | 1.0 s |
| CLI `modules --json` | 12.5 s | 155.9 s | 12.5 s |
| CLI `inspect absent-name --json` (refusal) | 15.3 s, 1.6 MB | 162.1 s, 11.0 MB | 12.4 s, 1.62 MB |

- Recording micro-benchmark, with every progress increment serialized: 1,000, 2,000 and 4,110 records took 16 ms, 27 ms and 51 ms, sending 0.52 MB, 1.04 MB and 2.15 MB. Round 1 measured 2.1 s, 8.7 s and 36.8 s without serialization. Cost is now linear, and the transport is about the size of the final report.
- Entry counts: `modules` records 8 work entries, and `dependencies` records 12, down from about 4,110. The expansion groups still list all record identities: 4,537 distinct record IDs appear in a repository-scale summarize report.
- Report sizes:
  - Full attribution is 1.05 MB for `modules` and 1.69 MB for `dependencies`.
  - The CLI `modules` observation batch is 19.0 MB; it was 27.2 MB in round 1 and 18.0 MB at the baseline.
  - The refusal's stdout `attribution` is now a 196-byte summary with `detail: "summary"`, `status: "refused"` and `completeness: "complete"`. The request, resolution and usage fields are retained in full.
  - The refusal's observation batch (5.4 MB) carries the full report.
- On the 6-module fixture, a 25-query summary went from 189 progress snapshots totalling 61 MB to 169 increments totalling 0.59 MB. The full report went from 604 KB to 393 KB, and the parent context now appears once per distinct parent instead of about 278 times.
- Repeated correlation IDs: a `modules` request and a later `summarize` request both used the caller ID `same`. The summarize report keeps its own purpose in `context` and the modules purpose in `parents[0]`. Generating origins refer to indices 0 and 1, and unknown origins remain `null`.

### Actionable findings

None.

- **F1 is resolved.** Recording and progress are now linear. Direct and CLI timings at this repository's scale match the baseline within single-run noise. The cached repeat is fast again. A refusal is no slower than the baseline.
- **F2 is resolved as the human directed.**
  - Each distinct parent is stored once and referred to by a report-local index.
  - Grouping keeps the associations between record identities, the exact qualification and cost, and the original origin. Different states, dispositions and requirements stay in separate groups.
  - Non-View JSON carries a summary in which `detail` is separate from `completeness`.
  - Session results and observations carry the full report.

### Non-defect observations

- **Size of full reports:** they still grow with record identities and evidence queries, as the decision states. A summarize at this repository's scale, with a scripted investigator issuing 25 queries (20 of them repeated `modules` queries), produced a 2.7 MB full report beside a 39 KB View. Most of it is provider-dependency record lists (1.26 MB) and per-query evidence detail (0.44 MB of evidence entries plus 0.27 MB of retrieval entries). It goes only to the Session result and the observation. Stdout is unaffected, and the decision accepts this growth. If observation size becomes a concern for long investigations, record lists repeated across queries are the remaining source of growth. I did not compare this case's timing with the baseline.
- **A second `finish` call no longer changes the report.** `WorkReportState.apply` ignores updates once a report has a final status. Before this change, a later `finish` overwrote the status. In Session `execute`, the only code after `finishWork` is report freezing and rendering. If that code threw, the report would stay `completed` (or `refused`) while the command failed as a defect. The work had in fact completed, so this does not overclaim. I did not exercise this path.
- **Worker reconstruction:** the parent's `WorkReportState` is replaced when the worker's `start` increment arrives. Sealing on `dispose` or `catch` still uses the received facts, and increments for other operations, or arriving after sealing, are still ignored. I checked this by reading the code and through the existing interruption test, not by exercising scheduling.
- **Deferred-publication statuses:** the round-1 observation is documented in the CLI reference and covered by a new test.

### Unverified areas and residual limits

- All timings are single runs on one machine. The baseline and round-1 figures were not rerun.
- I did not assess worker scheduling exhaustively, cancellation in the middle of a large expansion, or heap retention of the `origins` map over many requests.
- Hosted investigators were not exercised.
- The remaining plan work (Presentation compatibility, catalog and operation definitions, extension demonstrations) is outside this re-check.

### Recommendation for this intermediate gate

Both round-1 findings are corrected, and recording cost and report size are back in proportion at this repository's scale. The attribution semantics assessed in round 1 are preserved. I consider the checkpoint suitable for continuing to the compatibility and extension work. Whether the gate is sufficient remains the human's decision.
