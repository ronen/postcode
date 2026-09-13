# Project Status

Last reviewed: 2026-09-14

The development CLI provides Unicode and experimental JSON module inventories,
exact-selection inspection, export/documentation expansions, explicit source
location and excerpt disclosure, and local observation batches. See
[usage](README.md) and the [architecture overview](docs/architecture/README.md).

The [initial module-inventory task](records/tasks/2026-09-12-initial-module-inventory.md)
is complete. Its [validation](records/validation/2026-09-13-module-inventory-validation.md),
[p-queue exercise](records/validation/2026-09-13-p-queue.md),
[presentation approval](records/reviews/2026-09-13-presentation-approval.md), and
[final review disposition](records/reviews/2026-09-13-module-inventory-final-disposition.md)
remain recorded.

The [PR review continuation](records/tasks/2026-09-13-module-inventory-review-continuation.md)
is active on `codex/initial-module-inventory` in [PR #1](https://github.com/ronen/postcode/pull/1).
Latest runtime correction: `30145ad` addresses bidi display controls, forwarding
analysis growth and repeated exclusion-path resolution. Its
[verification handoff](records/reviews/2026-09-14-module-inventory-continuation-round-9.md)
records **76/76 tests passing**, plus type and whitespace checks.

Next gate: human-arranged Claude review of the entire continuation, using the
[final verification handoff](records/reviews/2026-09-14-module-inventory-continuation-claude-handoff.md).
The task remains open pending that review and disposition of any findings.
