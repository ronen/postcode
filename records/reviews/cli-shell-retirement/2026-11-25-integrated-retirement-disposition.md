# CLI shell retirement — final integrated review: disposition

Record type: disposition
Date: 2026-11-26
Task: [Surgical CLI shell retirement](../../tasks/2026-11-25-cli-shell-retirement.md)
Handoff: [Final integrated review](2026-11-25-integrated-retirement-handoff.md)
Findings: [Round 1](2026-11-25-integrated-retirement-round-1-findings.md), [Round 2](2026-11-26-integrated-retirement-round-2-findings.md), [Copilot](2026-11-26-integrated-retirement-round-3-copilot-findings.md)
Production correction target: `cacea3e8850f47c9e1976fcb4c09de5260fbaae5`
Diagram test correction: `388b795bc82d9c6e573fc8b18e54a414c12c88c4`
CLI test correction: `0ef827ebbb5a38706d24a56119870c1cc00f7075`

## Findings and dispositions

- **R1 — Accepted and corrected.** `eb403a7` adds a direct-boundary submission
  validation case: changed input followed by a valid submission rejects with
  `SessionInvalidated`, keeps work and attempt termination invalidated, accepts no
  producing invocation or answer, retains measured usage, closes the participant
  once and permits clean idle shutdown. The coverage record explicitly supplements
  the earlier input-invalidation row; the prior tool-request and mechanical checks
  did not cover this submission branch. No lifecycle implementation changed.
- **R2 — Human-directed extension implemented.** The 2026-11-26 task follow-up,
  committed in `789dae4` before implementation, authorizes rendering only.
  `cacea3e` identifies the trial answer, alternative position/count, exact
  designation and selected account-item address in each standalone format.
  Multiple alternatives state their equal standing, lack of preference and
  unreconciled status. SVGs now carry the existing entry, coverage, applicability
  and unsupported-content notes and explicitly refer to their matching companion
  text for the full legend. Each keeps its own supplied qualifications. No core
  analysis or capability was added. Method `@9` and all intentional baseline
  differences are documented and checked from unchanged structured input.
- **R3 — Accepted and corrected.** `cacea3e` wraps SVG text on spaces using a width
  appropriate to its monospace font, conservatively allowing for wider characters.
  Overlong tokens can wrap; ordinary words such as “Interpretation” remain intact.
  All characters survive, canvas height grows, and no statement is truncated.
  Both fresh-alternative SVGs were rendered and visually inspected.
- **R4 — Accepted and corrected.** `ebf656a` removes the unused private operation
  initiation variant and purpose branch; the evidence-cancellation test now uses a
  normalized semantic Lens request. It removes the redundant
  `retainedAnswers[].reference` field and verifies `{ id }` refusals directly.
  Candidate `reference` remains to preserve supplied reference spelling.

- **Round 2 N1 — Accepted and corrected.** `388b795` restores the two diagram
  Session-ID assertions across the complete text, SVG picture, state/transition
  legends and notes, excluding only the intentional `Trial record` section in
  each rendered format. Both sections must be found before the assertions can
  pass. This replaces the narrower notes-only assertions introduced with R2.
  No production source or rendered artifact changed.

- **Copilot — Accepted and corrected.** Review comment
  [4714281602](https://github.com/ronen/postcode/pull/15#discussion_r4714281602)
  identifies a real isolated-build test gap. `0ef827e` resolves the child CLI entry
  using `fileURLToPath(new URL('../src/cli.js', import.meta.url))`, instead of the
  checkout-relative `_build/src/cli.js`. The smoke test now executes the CLI in
  its own compiled build. No production source changed.

## Corrections and verification

[Correction verification and artifacts](../../validation/cli-shell-retirement/review-corrections.md)
record the exact runtime, capture hash, comparison and visual inspection. Type
checking and build passed; all 73 focused tests and all **500 full-suite tests**
passed without skips or cancellations. The full suite used Node **26.11.0**.
Two independent 18-step captures are byte-identical. The comparator checks exact
new disclosure and unchanged graph markup before requiring equality of everything
else; it removes no identity or runtime provenance.

The former O1 publication path remains removed. The directly necessary
`requestFinalized` flag and its reentrant completed-work test remain. The new
submission case completes the identified former-host coverage gap. The accepted
terminal cause, shutdown assessment, ordering and ordinary-failure boundaries are
unchanged. Broader callback isolation, hard preemption and the documented opening
cleanup limitation remain outside scope. No live provider/credential run was used.

For the round 2 test tightening, type checking and build passed, all **10/10**
`contribution-answers` tests passed, and `git diff --check` passed. No full-suite or
capture rerun was needed for this test-only change; round 2 independently reproduced
the 500-test result and all recorded capture/artifact comparisons on Node 26.11.0.

For the Copilot correction, `npm run check`, `npm run build`, and all **3/3**
authentication CLI tests passed on Node 26.11.0. A second compilation using
`tsc -p tsconfig.json --outDir _verification/copilot-isolated-build` passed, and all
three tests passed from that isolated build while the working directory remained
the checkout. A controlled negative check changed only the disposable isolated
CLI entry to throw `ISOLATED_CLI_ENTRY_SENTINEL`: the former cwd-relative test still
passed against the checkout CLI, whereas the corrected test failed on that
sentinel. Both disposable files were restored, and the isolated suite passed again.
This directly verifies the identified gap and the fix. `git diff --check` passed;
no full-suite or capture rerun was needed for this test-only correction.

## Review rounds

Round 1 reviewed `3b1a5bc0d1fb9e4bfc943bd1d71eecdba1760edc` under the original
handoff and found no correctness defect. It recommended sufficiency after human
R2 disposition and allowed implementing-agent verification of the minor R1, R3
and R4 corrections. The R2 rendering extension was material and required further
independent review.
The human subsequently authorized the bounded rendering extension; this record
supplies its correction target and verification under the same review assignment.
Round 2 reviewed `ae9f2acac28b71afb2e217da5213b1e3d983ecf9`, including that rendering
extension, and confirmed that all four round 1 findings were resolved within the
human's authorization. It found no new correctness or disclosure defect, reproduced
all verification, and recommended the review gate as sufficient. Its only new
finding was N1, the optional test-strengthening nit corrected above.

Copilot reviewed `3af1c57c406fa07906e6c581210ad3965034ad8b`. Its complete review,
inline annotation and retrieval scope are preserved in the linked Copilot findings
record (`0019f1f`), before the correction. The one actionable finding is corrected
and verified as described above.

The original handoff, findings and reviewed artifacts remain unchanged.

## Gate conclusion

All actionable findings are addressed, including the round 2 test nit and Copilot
smoke-test finding. On 2026-11-26 the human confirmed that the review gate is
satisfied and explicitly authorized task closure, merging PR #15, and cleanup of
the task branch and worktree. This acceptance is preserved in the task follow-up.
The final integrated review gate is satisfied.
