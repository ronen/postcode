# Audit representations of first-class user-model concepts

Status: active
Opened: 2026-10-06
Closed:

## Task

# Audit representations of first-class user-model concepts

Commit `ea31806` updated the product framing to define Lens, Projection, Presentation, and View without discouraging software representations. It also updated the engineering guidelines to say that first-class concepts in the user model should normally have explicit representations in the code. Audit how the implementation represents these four concepts against that guidance and their governing definitions. Assess the code as it stands; do not treat earlier audits as conclusions about its current architecture.

For each concept, describe its role in the user model, how it is represented and used in the current core and interfaces, and whether that representation could also support a future GUI. Examine relevant concerns such as identity, parameters, lifecycle, and invariants.

Keep the audit focused on these four concepts; consider related concepts where they help explain a finding.

Write an audit report with the mapping and evidence for each of the four concepts, any actionable findings with their practical consequences, and uncertainties that need a design choice. A finding should name the affected behavior or invariant and cite the relevant code. If no change is warranted, say so. Do not implement fixes, add speculative abstractions, or revise governing documents as part of this audit. Report proposed follow-up work for separate consideration.

## Follow-ups

## Outcome

## Verification
