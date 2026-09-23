# Transient session shell: integrated review

Record type: handoff
Prepared: 2026-09-23
Task: [Transient interactive session shell](../../tasks/2026-09-23-transient-session-shell.md)
Review gate: final integrated review, before task closure
Review target: `6dd42cb6426cf21d56cbeab4745e179354007576`
Baseline: `8dccbfd8713c5425d333e29952217b86c883326c`
Branch: `codex/transient-session-shell`

## Review assignment and boundaries

Review the complete approved session-shell implementation and its verification.
The prior [one-shot assignment](2026-09-23-one-shot-handoff.md) reviewed
`45205c54c908d70c618caa9bb03187bf0bd5e887`; its
[findings](2026-09-23-one-shot-round-1-findings.md) and
[disposition](2026-09-23-one-shot-disposition.md) remain separate evidence. The
human cleared that checkpoint before accumulation. This assignment addresses
the integrated result and may focus new scrutiny on `45205c5..6dd42cb`, while
checking compatibility with the full governing scope and earlier contracts.

Inspect the implementation and reproduce material checks. Do not treat this
handoff, the agent's validation or the earlier review as proof. Return actionable
findings with severity, evidence and practical consequences, and distinguish
non-defect observations and unverified areas. Reviewers may write only their
findings record; do not change implementation, plans, governing material, task
status, the task record or this handoff.

## Governing context

- [Approved plan](../../../docs/plans/transient-session-shell.md)
- [Accepted session decisions](../../../docs/decisions/transient-analysis-sessions.md)
- [Core concepts](../../../docs/core-concepts.md)
- [Architectural constraints](../../../docs/architectural-constraints.md)
- [Engineering guidelines](../../../dev/engineering-guidelines.md)
- [Implementation conventions](../../../docs/implementation-conventions.md)
- [Review workflow](../../../dev/review.md)

## Result under review

One-shot requests and the terminal shell share session execution and publication.
The TypeScript provider retains discovery and completed requested expansions;
dependencies can acquire additional input evidence. Existing contexts retain
their first support, earlier records remain immutable, and projections select
matching evaluation bases. The store owns append-only entity-reference bindings.
The shell distinguishes exact name/handle lookup from `@` references, with `--`
for literal selectors. Ambiguous lookups retain all matches.

Captured compiler probes, repository evidence and process context are checked
around commands/publication. Detection invalidates and requires restart. Views
are withheld before publication or retained truthfully with invalidation after
output. A private worker makes synchronous compiler work terminable; interruption
ends the session, and termination is awaited. Command observations distinguish
views, actual disclosure, refusal, failure, interruption and invalidation. EOF
finishes accepted work and its observation. No public batch/server interface,
persistence, interpreting lens, automatic refresh or target-code execution exists.

The current provider does not expand its Program module population during a
session. Additional dependency resolution remains bounded by that population.
Long sessions retain history without eviction. Checks are non-atomic and not a
comprehensive freshness guarantee. These limits are described in the CLI reference.

## Verification already performed

The [integrated validation](../../validation/transient-session-shell/2026-09-23-integrated.md)
records all 216 tests and type checks passing, 162 complete view/output
comparisons, real compiler-backed shell interruption with truthful observation,
fixture terminal inspection, PostCode adaptive journeys, input-change checks,
latency samples and heap/RSS measurements. It records an unexplained long latency
outlier and a subsequent shorter isolated repeat rather than discarding either.
The validation and task-record commits follow the implementation target and do
not change runtime code. Human inspection/acceptance has not been claimed.

## Review focus and reproduction

1. Check requirement-specific reuse and immutable support, especially inventory
   followed by dependency acquisition; ensure cached incomplete results do not
   suppress later attempts, dependency completion can retain the same module
   basis, and unrelated work cannot broaden a projection or alter qualification.
2. Check bindings under new collisions, exact name/handle ambiguity, literal
   reserved-looking selectors and the one-shot-to-shell recovery journey.
3. Examine detection coverage and exclusions, including negative probes,
   directory selection, output-boundary retargeting, and pre/post-publication
   races. Check that validation does not refresh evidence or read excluded output.
4. Inspect worker lifecycle and prompt state: opening, active/idle Ctrl-C, EOF,
   expected operational failure, unexpected defect, observation delivery and
   worker release. Reproduce the actual compiler path rather than relying on a
   delayed promise or other cancellation substitute.
5. Check observations for actual requests, outcomes, exact rendered output,
   command order/session correlation and disclosure. Failure batches must not
   fabricate a view; sink failure must preserve a successful result.
6. Inspect the complete fixture and PostCode investigation as a human, choosing
   subsequent subjects from displayed references. Assess qualifications and
   omissions, source-detail after accumulation, repetition, and usable latency.
   Review the memory measurements and unestablished latency outlier critically.

From the ordinary checkout (Node >=22.13 with pinned dependencies):

```sh
npm run check
npm test
node scripts/compare-session-requests.mjs /tmp/session-comparisons.json
node scripts/probe-session-interruption.mjs
node --expose-gc scripts/measure-session-journey.mjs tsconfig.json /tmp/session-measurements.json
node _build/src/cli.js shell --project fixtures/dependency-journey/tsconfig.json
node _build/src/cli.js shell
```

Use `modules`, `inspect @REFERENCE`, `dependencies`, `children @REFERENCE`,
`parents @REFERENCE`, project/repository organization, group inspection and
`--source-detail`, choosing actual references from preceding output. Do not edit
the project during the unchanged-input journey; test invalidation separately.
Repository-layout tests require suitable Git context; ignored archive directories
can differ from ordinary worktrees, as the first review established. Measurement
commands use no-op sinks; normal CLI invocations write private `_observations`.

## Findings return

If the reviewer has repository write access, use
[the findings template](../../../dev/templates/review-findings.md), create
`YYYY-MM-DD-integrated-round-N[-reviewer]-findings.md` in this review series, and
identify this handoff, the reviewer, round and exact target actually reviewed.
Preserve the returned report under `## Returned findings`. Commit only that
record and modify nothing else. Otherwise return the report to the human for
preservation. Later rounds should name prior findings/targets and corrections.

## Review gate

The implementing agent stops here for human-arranged independent review and
human inspection. The task remains active. A reviewer recommendation alone does
not authorize closure: the human must determine that the final gate is sufficient.
Material corrections may require another round under this same assignment.
