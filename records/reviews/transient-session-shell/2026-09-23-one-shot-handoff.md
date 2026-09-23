Record type: handoff
Prepared: 2026-09-23
Task: [Transient interactive session shell](../../tasks/2026-09-23-transient-session-shell.md)
Review gate: mandatory one-shot conversion checkpoint, before accumulation
Review target: `45205c54c908d70c618caa9bb03187bf0bd5e887`
Baseline or diff range: `8dccbfd..45205c54c908d70c618caa9bb03187bf0bd5e887`
Branch: `codex/transient-session-shell`

# One-shot session conversion review

## Review assignment and boundaries

Independently inspect the one-shot conversion and its verification before the
implementer proceeds to accumulating analysis. This is the explicit stage-1 gate
in the approved plan, not final review of the complete shell. Inspect the actual
implementation and evidence; this handoff and the implementing agent's results
are not proof of correctness.

The human arranges the reviewer and review mechanism. The reviewer may commit a
findings record as described below, but must not modify implementation, governing
material, task status or the active task record. Recommend whether this checkpoint
is sound enough to proceed, distinguishing actionable defects from matters
explicitly reserved for the following stages. The recommendation does not itself
constitute human acceptance.

## Governing context

- [Approved plan](../../../docs/plans/transient-session-shell.md), especially stage 1.
- [Accepted session decisions](../../../docs/decisions/transient-analysis-sessions.md).
- [Core concepts](../../../docs/core-concepts.md) and
  [architectural constraints](../../../docs/architectural-constraints.md).
- [Implementation conventions](../../../docs/implementation-conventions.md),
  [architecture](../../../docs/architecture/README.md), and
  [CLI reference](../../../docs/cli-reference.md).
- [Independent review workflow](../../../dev/review.md).

## Result under review

One-shot commands open one configured project in a short-lived session and execute
one request through the shared request boundary. The session owns the provider
and ephemeral program store and closes after observation submission, including
on failure. Snapshot record/schema/reference assumptions are replaced by session
namespaces. Captured input support is retained separately and linked from provider
claim contexts; evidence, responsible methods, selected claims and evaluation
outcomes retain their existing storage boundaries.

Names and handles are exact union lookups with zero/one/many outcomes. The CLI
no longer accepts `--snapshot` or `--dependency-context`, and no generated command
strings or corresponding presentation fields remain. One-shot IDs do not support
cross-invocation navigation. Library projections distinguish compact-reference
selection from lookup and retain same-session full record-key selection.

View schemas and observation batches are experimental version 1. Each produced
view's self-contained batch contains session identity and command ordinal 1,
separate from batch/event UUIDs. Source disclosure, local sink privacy and output
exclusions remain in place. Native SIGINT process termination was exercised on
real compiler work before choosing a future shell execution arrangement.

Deliberately remaining: accumulation and completed-work reuse, stable compact
bindings as populations grow, continuing-session invalidation, the prompt and
its lifecycle, failed-command/interruption observations, the in-session ambiguity
recovery journey, final adaptive investigation/human inspection, and follow-up
latency/memory measurements. The executor currently refuses a second request;
this checkpoint does not pretend that repeating fresh one-shot calls implements
accumulation. Compact ID allocation still uses the complete request population
and must be replaced before growth is exposed. Unchanged-input assumptions are
explicit; no new continuing-session freshness guarantee is claimed here.

## Verification already performed

The [validation record](../../validation/transient-session-shell/2026-09-23-one-shot.md)
describes the checks, normalization rules, measured interruption, PostCode smoke
checks and limitations. Implementing-agent results:

- `npm run check` passed and all 197 tests passed.
- 54 before/after fixture view comparisons passed, including Unicode output and
  reference-preserving structured comparisons.
- The real-compiler SIGINT experiment terminated the interrupted process before
  any view publication; its unsignalled control completed.
- PostCode inventory, dependency structure and explicit source inspection
  produced qualified views with truthful observations.
- Updated profiling instrumentation ran on a real fixture; `git diff --check`
  passed.

A repeat of the comparison on new temporary paths exposed ordering in another
supporting-evidence collection. Commit `45205c5` corrected the verifier to match
organization evidence by all fields under the same reference bijection. The full
54-case comparison then passed. This changed verification, not runtime code.

## Review focus and reproduction

1. Verify session identity is independent of the captured input set and cannot
   substitute for evidence or method context. Check immutable input support and
   source capture through the ProgramRecordStore boundary.
2. Check the new exact name/handle behavior, reserved-looking names, ambiguous
   matches, invalid/copied references and the removal of both obsolete options.
   Assess whether the library selector distinction is suitable for the next stage.
3. Verify selected populations, expansions, qualification, omissions and source
   disclosure preserve their established meanings. Rendering must remain free of
   live source reads and analysis requests.
4. Check observation correlation, batch independence, exact emitted output,
   source-escape truth, terminal-control escaping, sink failure and generated-output
   exclusions. Review experimental schema/version changes and runtime documentation.
5. Inspect the comparison harness critically: consistent bijections must retain
   relationship incidence. Containment and organization evidence collections are
   matched independently of old hash order; no evidence fields or supporting
   relationships may be discarded. Display row/relationship order remains checked.
6. Reproduce the real compiler experiment and assess its narrow conclusion. It
   establishes process termination, not future prompt recovery or interruption
   observation delivery.

Run `npm run check`, `npm test`, and
`node scripts/probe-compiler-interruption.mjs` after building. To reproduce the
migration comparison, independently build baseline `8dccbfd` and the review target
using the pinned dependency installation, then run:

```sh
node scripts/compare-session-conversion.mjs BEFORE_BUILD AFTER_BUILD REPORT.json
```

The build directories must contain `src/lib/cli.js` and resolve TypeScript 6.0.3.
Use disposable underscore directories for baseline/build/report preparation; do
not change analyzed fixtures. The comparator makes and removes its own temporary
Git fixture copies. The human can inspect current one-shot output using the README
commands; no shell command exists at this checkpoint.

## Findings return

If the reviewer has repository write access, use the
[findings template](../../../dev/templates/review-findings.md), create
`YYYY-MM-DD-one-shot-round-1-findings.md` in this review-series directory, and
include reviewer identity, this handoff, the exact target/scope reviewed, method,
verification, actionable findings, non-defect observations, unverified limits and
a recommendation. Preserve the report under `## Returned findings`. Commit only
that findings record and modify nothing else.

If repository writing is unavailable, return the findings to the human for
verbatim preservation through the review workflow. Further rounds use
`YYYY-MM-DD-one-shot-round-N[-reviewer]-findings.md` under this same handoff,
recording the prior findings/target and the exact new target actually reviewed.

## Review gate

The plan says: “Then pause for human-arranged independent review before proceeding
to accumulation.” Implementation is paused at that boundary and the task remains
active. The human must determine that this checkpoint's review is sufficient
before accumulation begins. Material corrections may require another round under
this handoff. The later final integrated review gate remains outstanding; this
checkpoint neither completes nor closes the task.
