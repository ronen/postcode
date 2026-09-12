# Project Status

Last reviewed: 2026-09-13

The [initial module-inventory task](records/tasks/2026-09-12-initial-module-inventory.md)
is active on `codex/initial-module-inventory`. The first independent architectural
review reported no blocking findings; its [dispositions](records/reviews/2026-09-12-module-inventory-core.md)
are recorded and the small corrections are implemented.

The development CLI now provides Unicode and experimental JSON module inventories
and exact-selection inspections, effective export and documentation expansions,
explicit source-location disclosure, and automatic local observation batches.
Program claims, Claim context, source evidence, documentation assertions, evaluation
outcomes, projections and observations remain distinct. See [usage](README.md)
and the [architecture overview](docs/architecture/README.md).

All 35 automated tests and type checks pass. Coverage includes semantic fixtures,
separate-process CLI determinism, changed-input identity, source separation,
omission disclosure, sink delivery/privacy behavior, and actual checkout output
exclusion for nested configurations. PostCode self-analysis has run successfully.
Clean-agent instrument validation is being prepared.

Outstanding gates: human approval of an unfamiliar external TypeScript repository
before acquisition/analysis, its validation exercise, human Unicode-output
inspection, completion of clean-agent validation, and final independent integrated
review. The full [approved plan](docs/plans/initial-module-inventory-plan.md) remains
the task scope; no closure or final acceptance is claimed.
