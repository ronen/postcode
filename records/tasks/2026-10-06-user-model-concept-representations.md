# Audit representations of first-class user-model concepts

Status: completed
Opened: 2026-10-06
Closed: 2026-10-06

## Task

# Audit representations of first-class user-model concepts

Commit `ea31806` updated the product framing to define Lens, Projection, Presentation, and View without discouraging software representations. It also updated the engineering guidelines to say that first-class concepts in the user model should normally have explicit representations in the code. Audit how the implementation represents these four concepts against that guidance and their governing definitions. Assess the code as it stands; do not treat earlier audits as conclusions about its current architecture.

For each concept, describe its role in the user model, how it is represented and used in the current core and interfaces, and whether that representation could also support a future GUI. Examine relevant concerns such as identity, parameters, lifecycle, and invariants.

Keep the audit focused on these four concepts; consider related concepts where they help explain a finding.

Write an audit report with the mapping and evidence for each of the four concepts, any actionable findings with their practical consequences, and uncertainties that need a design choice. A finding should name the affected behavior or invariant and cite the relevant code. If no change is warranted, say so. Do not implement fixes, add speculative abstractions, or revise governing documents as part of this audit. Report proposed follow-up work for separate consideration.

## Follow-ups

Put P2 and P5 in the backlog.  For P1, P3, and P4, add entries for the questions behind them, linking to the audit and naming the proposed solutions as options, not decisions.   then you can close the task

## Outcome

Audited how Lens, Projection, Presentation and View are represented in the core
and interfaces. The [audit report](../audits/2026-10-06-user-model-concept-representations/REPORT.md)
maps each concept, with evidence, and assesses GUI support. No source code changed.

Projections are well represented by retained, immutable records with deterministic
identity and qualified resolved content; no change is warranted there. Lens has no
explicit representation, and two confirmed defects result from that:

- observations describe follow-up investigation lenses as configured-project
  inventory requests;
- `children`/`parents` report a bound group reference as `unknown-reference`.

The other findings are:

- subject designation is stored and reported as lens parameters;
- dependency subject selection retains an unrequested `inspect` Projection;
- `format` combines presentation choice with display bounds;
- a retained Projection cannot be presented again without re-selection.

The report also records open design questions and five proposed follow-ups.

As directed in the follow-up, these backlog entries were added:

- "Correct lens misreporting in observations and dependency subject status" (P2);
- "Allow a View to be requested for an existing Projection" (P5);
- question-framed entries for P1, P3 and P4, which name the audit's proposals as
  options: "Decide how lenses are represented", "Decide how a Projection's subject
  is designated and separated from lens parameters", and "Decide how GUI
  Presentations and their parameters are represented".

## Verification

- `npm run build` succeeded, and `node --test _build/test/*.test.js` passed
  486 of 486 tests at the task's opening revision with no source changes.
- F1 was reproduced by calling the built `observationBatch` with each lens value.
- F2 was reproduced by opening a session on a copy of `fixtures/organization`,
  binding a group reference through `organization`, and requesting `inspect`,
  `children` and `parents` on it.
- Cited line ranges were checked against the audited source. Every relative link
  and heading anchor in the report and the new backlog entries was checked by
  script.
