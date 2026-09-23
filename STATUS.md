# Project Status

Last reviewed: 2026-09-23

The development CLI supports module inventory, repository organization, and direct
module dependencies, with Unicode and experimental JSON views. Module and group
inspection, exports, documentation, source evidence, and exact name/handle lookup support
exploration of program structure. Dependency views distinguish established
relationships, unresolved requests, and analysis limits; they do not describe
runtime behavior or architectural intent. See the [CLI reference](docs/cli-reference.md).

The [module dependency slice](docs/plans/module-dependencies-plan.md) is complete,
including evaluation on PostCode and an unfamiliar repository. Its
[task record](records/tasks/2026-09-16-module-dependencies.md) preserves acceptance
and evaluation details.

The [analysis-latency task](records/tasks/2026-09-21-analysis-latency.md) is complete.
Fresh analysis on PostCode is substantially faster through reuse within each
discovery call, with existing output semantics preserved. The
[validation report](records/validation/2026-09-21-analysis-latency.md) and
[review disposition](records/reviews/analysis-latency/2026-09-21-integrated-disposition.md)
provide measurements, verification, and remaining limits.

The [transient interactive session shell plan](docs/plans/transient-session-shell.md)
is being implemented under the [active task](records/tasks/2026-09-23-transient-session-shell.md).
The one-shot conversion checkpoint replaces snapshots with short-lived sessions,
retains captured input support independently of session identity, removes scope
options and generated commands, and adds session/command observation correlation.
The experimental view schemas and observation format are now version 1.

Accumulating analysis, stable bindings under growth, input-change invalidation,
and the interactive prompt remain ahead. The plan requires human-arranged
independent review of this checkpoint before accumulation begins.
