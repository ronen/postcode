# Separate qualified view construction from presentation shaping

Status: active
Opened: 2026-10-05
Closed:

## Task

# Separate qualified view construction from presentation shaping

Resolve the open view-builder role question in `docs/backlog.md`. Use
`records/audits/2026-10-05-view-builder-boundary/REPORT.md` as
evidence, and follow the governing views and analysis boundary in
`docs/architectural-constraints.md` and the projection architecture decision in
`docs/decisions/initial-projection-architecture-decisions.md`.

The audit found no confirmed violation of the interface analysis boundary, but
the current builders combine qualified selection and derivation with
format-specific display shaping. Those responsibilities change for different
reasons, conflicting with the single-responsibility guideline in
`dev/engineering-guidelines.md`. Resolve that coupling as part of assigning
the builders' roles; do not treat their current structure as the intended design.

First establish a concrete architectural choice for the existing builders. Distinguish qualified selection and derivation, Projection construction, presentation arrangement, and format-specific rendering by the responsibility each performs, not by the current file or function name. Address investigation lenses, whose Projections are currently constructed inside view builders, and counts drawn from evaluation-wide populations or supporting evidence. Explain how the chosen boundary preserves each Lens's question, population, Claim qualification, evaluation materialization, and visible presentation omissions. Do not treat the current CLI JSON View schema as a canonical Projection contract without justification, or require separately stored runtime stages merely to express the conceptual distinction.

Make the architectural choice reviewable before changing code: describe the intended responsibilities and data flow, the smallest necessary API or record changes, affected existing behavior, and meaningful alternatives. If it is a consequential choice not already settled by accepted decisions, prepare a proposed decision and obtain explicit human agreement before implementing it. Do not silently settle that choice through a refactor.

Then implement the smallest coherent separation of responsibilities. A coordinating function may remain, but domain selection and qualified derivation should not be coupled to terminal fitting or format-dependent display bounds merely for convenience. Preserve established CLI behavior, selection, qualification, references, and evaluation outcomes; make any necessary externally visible change explicit before proceeding. Verify the boundary with focused behavior checks, update affected documentation, and resolve the backlog entry when the work is complete.

Scope is the existing view-construction boundary. Do not add new program analyses or Lenses, introduce persistence, or build a speculative general presentation framework. The resulting core responsibilities should be usable independently of CLI-specific presentation.

## Follow-ups

### Proposal review and boundary scope

See the review at \_view-construction-boundary-review/qualified-projection-construction.md; please address its findings; update the proposal and pause again for re-review. &#x20;

For review points 6 and 7, which the review identifies as needing human decision:

**6 — Source disclosure:** Holding or passing resolved core content internally is not itself disclosure. Any Presentation that exposes source from that content must do so through a View whose actual disclosure is classified and recorded. This applies equally to CLI and future GUI Presentations.

**7 — Scope:** The boundary applies to current and future Presentations of these Projection families, including the GUI. Include a proposed architectural-constraints revision stating that arrangement consumes the qualified information selected for its Projection and cannot independently query accumulated session state to broaden or refresh that information. Account explicitly for the narrowly scoped reference-binding capability needed to preserve existing behavior.

Keep eager resolution and “no display bounds in core construction” scoped to these builders. Do not establish a universal prohibition on presentation pushdown or lazy materialization, which the foundation permits when meaning and qualification are preserved.

### Proposal re-review and incomplete artifact wording

The opening-summary link below is normalized to a repository-relative path; the prompt is otherwise preserved verbatim.

See the re-review at \_view-construction-boundary-review/qualified-projection-construction-re-review\.md ; again please address its findings, update the proposal and pause again for re-review. &#x20;



There is one factual overstatement in point 2: the CLI **does** report repository and placement materialization in its [opening summary (line 272)](../../src/lib/organization/presentation.ts#L272), even when modules are present. But the underlying concern holds: “unanalyzed” makes a stronger claim than the set difference establishes. The later qualification “other artifacts remain unanalyzed” reinforces that problem.

For point 2, **I recommend accepting a narrowly scoped wording change now—option (a)**. Deferring this would leave a known mismatch precisely where this work is making qualification explicit.

I would go slightly further than merely appending “placement incomplete” to “unanalyzed”:

- When the supporting classification is incomplete, use a neutral label such as **“other captured artifacts”**, with an adjacent incompleteness notice.
- Explain that “other” means no module or documentation association has been established in the supplied information.
- Apply this consistently to the inspection line, tree annotation, and closing qualification.
- Preserve JSON field names, numeric calculations and existing evaluation metadata for compatibility; document the qualified meaning of the legacy `unanalyzed` field.
- Base the wording on the core-supplied completeness information, including incomplete artifact support or module placement—not whether the group happens to contain displayed modules.

For example:

> Other captured artifacts: 7 · 2 opaque boundaries (classification incomplete)

The proposal should list this as an explicitly permitted visible change. Verification should include **partial placement with some modules successfully listed**—the case that exposes the misleading wording—and confirm that complete cases and JSON counts remain unchanged.

### Acceptance and implementation review gates

Re-review is in \_view-construction-boundary-review/qualified-projection-construction-re-review-2.md&#x20;

Accept point 1’s option (a), documenting the shared presentation-method bump and resulting ID/metadata changes.

For point 2, derive completeness from existing View fields if they fully support it. Otherwise, add the smallest explicit completeness field needed, preserving existing fields and documenting the additive schema change. Keep rendering self-contained and qualification complete.

Address point 3, update the proposal to reflect these resolutions

No further re-review is needed, you may promote the proposal then proceed to the implementation.  As always, pause for discussion if significant unexpected issues arise; or if the implementation becomes sufficiently complex that intermediate review would materially reduce risk, pause for independent review after appropriate key developments.  Otherwise prepare a handoff and pause for final review before; don't close the task until explicit approval.

## Outcome

## Verification
