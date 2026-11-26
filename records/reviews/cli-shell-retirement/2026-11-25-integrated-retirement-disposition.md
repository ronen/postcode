# CLI shell retirement — final integrated review: disposition

Record type: disposition
Date: 2026-11-26
Task: [Surgical CLI shell retirement](../../tasks/2026-11-25-cli-shell-retirement.md)
Handoff: [Final integrated review](2026-11-25-integrated-retirement-handoff.md)
Findings: [Round 1](2026-11-25-integrated-retirement-round-1-findings.md)
Correction target: `cacea3e8850f47c9e1976fcb4c09de5260fbaae5`

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

## Review rounds

Round 1 reviewed `3b1a5bc0d1fb9e4bfc943bd1d71eecdba1760edc` under the original
handoff and found no correctness defect. It recommended sufficiency after human
R2 disposition and allowed implementing-agent verification of minor corrections.
The human subsequently authorized the bounded rendering extension; this record
supplies its correction target and verification under the same review assignment.
The original handoff, findings and reviewed artifacts remain unchanged.

## Gate conclusion

All actionable findings are addressed. Human confirmation that the final review
gate is sufficient remains pending; the task stays active. The corrected target
above is available for any further round the human arranges under the original
handoff. This disposition does not authorize task closure or merging.
