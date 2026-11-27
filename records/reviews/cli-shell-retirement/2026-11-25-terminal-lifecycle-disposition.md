# Direct terminal Session lifecycle: disposition

Record type: disposition
Date: 2026-11-25
Task: [Surgical CLI shell retirement](../../tasks/2026-11-25-cli-shell-retirement.md)
Handoff: [Direct terminal Session lifecycle](2026-11-25-terminal-lifecycle-handoff.md)
Findings: [Round 1](2026-11-25-terminal-lifecycle-round-1-findings.md)
Correction target: `9961ef465e02df1601d48a851e88091f1278109d`

## Findings and dispositions

- **F1 — accepted, human-confirmed.** The human explicitly confirmed the implemented
  invalidation behavior in task follow-up commit `2c4f50b`. The accepted
  [terminal invalidation decision](../../../docs/decisions/terminal-session-invalidation.md)
  records the narrow clarification and reciprocal supersession metadata preserves
  the original decision's rationale. The binding constraint, application API contract
  and descriptive architecture now explicitly cover immediately started owned cleanup,
  invalidation's protected finalization and shared shutdown assessment. No runtime
  semantic change was needed. Active-work tests cover clean invalidation, simultaneous
  participant-close/attempt-report failures, and simultaneous failures in all four
  phases including work notification and owned-resource cleanup. They verify retained
  cause/accounting, later mixed shutdown observers and exactly-once cleanup/reporting.
- **F2 — accepted.** The preservation record identifies Node **26.11.0** for the
  original baseline, initial repeat, original post-lifecycle comparison and new
  correction comparison. It explains that Node runtime provenance affects input
  identities, records the reviewer's Node 22.13.1 difference and requires exact runtime
  disclosure in later handoffs and the final comparison. No identity/provenance fields
  are normalized away. The original handoff and findings remain unchanged.
- **F3 — accepted.** Two paired direct-boundary cases hold a changed Git acquisition
  result pending during an active dialog. Releasing it establishes invalidation;
  interrupting first establishes interruption. The same delayed input produces the
  invalidation control case, so the abort case is not merely an unobserved file edit.
  Late completion cannot relabel work or attempt accounting, and repeated shutdown
  observers and later operations preserve the established cause. Active invalidation
  tests also use an actual source-file change detected inside the dialog's validity check.

## Corrections and verification

Correction commit: `9961ef465e02df1601d48a851e88091f1278109d`.

On Node **26.11.0**:

- `npm run check` and `npm run build` pass.
- `node --test --test-concurrency=2 _build/test/application-shutdown.test.js` passes
  all **35** tests, including the five added active-work cases.
- The controlled application capture is byte-identical to the committed decompressed
  baseline with no exclusions. SHA-256:
  `7c8af4e41ced1590f3ac9be352aacb513cda7ccf5c6b0222b3f441c3ff53f919`.
- `git diff --check` passes. Runtime implementation modules are unchanged from the
  reviewed target; production source edits are API documentation comments only.

The original five-suite 93-test verification and reviewer's independent checks remain
in the historical evidence. The full suite is still due for the integrated retirement.
No live inference, agent-instruction change or callback-isolation redesign occurred.

The non-defect observations remain applicable. In particular, review the deferred
CLI operation scope and completion flag during retirement (O1); the ordinary
callback policy, cooperative limits and existing opening-path gap remain unchanged.
The review's pre-existing multiple-child Git cleanup reporting limitation was not
expanded into a new resource-lifecycle project.

## Review rounds

Round 1 reviewed `ff2da8709b8ed929b6fcaac1ccbd52129c93a9d5` against
`5db2cf19f0436d206aa5d5c05de7f022a03b45b9`. The human confirmed F1's intended
behavior, and the implementing agent corrected F1–F3 as above. The reviewer recommended
proceeding after disposition and corrections and did not request a full further round
unless Session/dialog semantics changed. Those semantics did not change.

## Gate conclusion

All actionable findings have been addressed. The human has confirmed the F1 contract;
explicit acceptance of the intermediate review gate remains pending. No further full
review round is inferred as required by these corrections. CLI/worker retirement,
alias/observation removal, trial rendering relocation and its authorized disclosure
correction remain pending. The task stays active; final integrated review, task
closure and merging are not authorized by this disposition.
