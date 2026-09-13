# Project Status

Last reviewed: 2026-09-13

The [initial module-inventory task](records/tasks/2026-09-12-initial-module-inventory.md)
is complete on `codex/initial-module-inventory`. The first independent architectural
review reported no blocking findings; its [dispositions](records/reviews/2026-09-12-module-inventory-core.md)
are recorded and the small corrections are implemented.

The development CLI now provides Unicode and experimental JSON module inventories
and exact-selection inspections, effective export and documentation expansions,
explicit source-location and excerpt disclosure, and automatic local observation batches.
Program claims, Claim context, source evidence, documentation assertions, evaluation
outcomes, projections and observations remain distinct. See [usage](README.md)
and the [architecture overview](docs/architecture/README.md).

All 71 automated tests and type checks pass. Coverage includes semantic fixtures,
separate-process CLI determinism, changed-input identity, source separation,
omission disclosure, sink delivery/privacy behavior, and actual checkout output
exclusion for nested configurations. PostCode self-analysis has run successfully.
Two clean-agent evaluations are complete; their findings led to clearer empty-set,
materialization and navigation wording and less external documentation in compact
inventories. Their responses and exact inputs are retained locally; the
[validation handoff](records/validation/2026-09-13-module-inventory-validation.md)
records findings, corrections, and remaining usability uncertainty.

The approved [p-queue validation](records/validation/2026-09-13-p-queue.md) is complete
at a pinned revision: seven modules, matching independent invocations and checked
project export surfaces. No implementation defect was found in that exercise.

The human's [conditional presentation approval](records/reviews/2026-09-13-presentation-approval.md)
is satisfied: tests pass and regenerated JSON lists each requested expansion kind
once while retaining per-module evaluation records. Presentation review is complete.

The [final independent review](records/reviews/2026-09-13-module-inventory-final-findings.md)
reported no blocking findings. Both notes are [resolved](records/reviews/2026-09-13-module-inventory-final-disposition.md):
diagnostic scoping was already correct, and an exact name/compact-ID collision has
a tested correction. The initial task remains completed and immutable.

A subsequent GitHub Copilot PR review identified further record-validation,
target-exclusion, option-like selector and documentation issues. The active
[continuation](records/tasks/2026-09-13-module-inventory-review-continuation.md)
corrects all five findings, including optional attempt-numbering cleanup, in
`15c1398`. Its [disposition and handoff](records/reviews/2026-09-13-module-inventory-continuation.md)
record verification and the required human-arranged Copilot rereview.
The next Copilot review identified documentation-association validation, inaccurate
zero-exclusion qualifications, and persistent observations from two CLI tests.
Those three findings are corrected in `a612015`; the
[second disposition and handoff](records/reviews/2026-09-13-module-inventory-continuation-round-2.md)
records 59 passing tests and verified observation/test-directory cleanup.
A third review's two previously missed findings are corrected in `ba1436d`:
snapshot self-identity validation and the inspection-only CLI option explanation.
The [third disposition and handoff](records/reviews/2026-09-13-module-inventory-continuation-round-3.md)
records 61 passing tests and verification. The continuation remains active until
returned findings are resolved or the human explicitly accepts any residual concern.
The fourth review's handle/Entity-ID collision and duplicate configuration
syntax diagnostics are corrected in `cc836cc` and `92e4ed2`. The human approved
preserving root syntax validation after the suggested removal caused a regression.
The [fourth disposition and handoff](records/reviews/2026-09-13-module-inventory-continuation-round-4.md)
records 64 passing tests and fixture verification.
The fifth review's renamed re-export route, exclusion-set identity and Unicode
structural injection findings are corrected in `8199cca`. The
[fifth disposition and handoff](records/reviews/2026-09-13-module-inventory-continuation-round-5.md)
records 68 passing tests and targeted output comparisons. The continuation remains
active. The sixth review's stderr observation-destination injection is corrected
in `b19e787`, with the same escaping applied to adjacent diagnostics and warnings.
The [sixth disposition and handoff](records/reviews/2026-09-13-module-inventory-continuation-round-6.md)
records 71 passing tests and verification of unchanged actual sink paths.
PR #1 is awaiting another human-arranged rereview.
