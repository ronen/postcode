# Method-provenance checkpoint

Date: 2026-11-08
Original source: `815f2378a5e6f2d4ca36884e4a8547a42f6c49ca`
Post-split implementation: `b4dc07b`
Task opening: `82178dd`

The first M1 checkpoint separates the three client Presentation versions from application capture, advances observed-inputs to 7 and program-records to 23, and appends responsible Presentation methods to delivered artifact provenance. It does not extract execution or change work outcomes. The existing additional investigation-evaluation provenance entry on fresh investigation results is preserved.

Original emitted source digest: `7813fd1e17ede9588f185f2507c1a13927731e757ab6d5ee9b7939400b73c1af`.
Post-split emitted source digest: `70d8d8bebfe283fc06e770300df52ee3fe267a5e99cc8eaa95ebc6f998b62c02`.

The local task worktree retains `_verification/original-build` and `_verification/post-method-split-build`. The latter is the extraction comparison baseline. Neither build is a committed product artifact; their source revisions and digests identify them. [Method transition evidence](method-transition.json) records complete per-case changed-reference mappings, unchanged-reference counts and the compared command outcomes.

Verification: `npm run check`; 19 tests across method provenance, projection content and exports; 39 tests across answer identity, retained presentation and Session inputs; and 21 runCli comparisons (18 mechanical text/JSON variants, missing-subject resolution, usage and disabled investigation). All passed. No credentials or live inference were used. The harness checks complete observation records/events after occurrence correlation, serialized field order, exact output layout and semantic content. It uses explicit same-kind bijections only in `--method-split` mode, with method-list differences checked against the specified application/client split. It does not discard qualification or reorder populations. The extraction mode forbids digest/alias changes.

The renderer-only test holds the application methods and fixture fixed while changing the client method. Full module content, captured inputs and Evaluation remain equal under the shared Session-reference policy; the View changes. A separate application projection-method change still changes captured-input and answer identity. Exact retained tests continue to deny selection/Evaluation on presentation and preserve earlier support.

This checkpoint is not the M1 boundary-slice review gate or a conformance claim for the full plan. Direct application contracts, operation-scoped binding, separated work finalization, companion services, broad CLI/script migration and integrated verification remain outstanding.
