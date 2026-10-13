# Request attribution checkpoint: round 1 findings

Record type: findings
Received: 2026-10-12
Reviewer: Claude Opus 5.5 (Claude Code), independent session with no implementation involvement (also the reviewer of the earlier request-publication, subject-resolution and answer-identity rounds)
Handoff: [2026-10-12-request-attribution-handoff.md](2026-10-12-request-attribution-handoff.md)
Round: 1
Reviewed target: 2c26810611230bcb5d28a8f89d75b5213d57a893 (scope `1b5f178..2c26810`, branch `codex/lens-request-model`)

## Returned findings

### Method

- Read the handoff and the plan's [bounded initiation and attribution assessment](../../../docs/plans/lens-request-model.md#bounded-initiation-and-attribution-assessment), including the five-boundary table and the guard and budget paragraph. Also read the architectural constraints on initiation and request attribution.
- Inspected the complete source and test diff for `1b5f178..2c26810`:
  - the new `work-attribution.ts` (`RequestWork`, scopes, the `origins` WeakMap, `snapshot` and `finish`, the evidence handles);
  - reporting at the TypeScript provider caches, module, organization, dependency and dependency-organization evaluation, and content acquisition;
  - evidence access and the investigation exchange loop (acquisition, withholding, delivery marking, initial context);
  - investigation evaluation (reused, unavailable and established outcomes);
  - Session `execute` and `evaluateInvestigation`;
  - worker `work-report` messages and parent sealing;
  - `publishCommand` and the version-two `request-work` observation record;
  - the new `work-attribution.test.ts`.
- Confirmed that `HEAD` (`cd62121`) differs from the target only in review and task records (`git diff 2c26810 HEAD -- src test fixtures package.json` is empty).
- Ran scratch probes (not committed):
  - through `openSession().execute` on `fixtures/dependency-journey`, with a scripted investigator issuing about 25 evidence queries;
  - through `openSession().execute` and the CLI on this repository's own `tsconfig.json` (685 modules);
  - a micro-benchmark of `RequestWork.scope().record`.
  For timing comparisons, the baseline `1b5f178` and the target `2c26810` were each extracted with `git archive` into the scratchpad and built there, so observation files were written outside the repository.

### Verification performed

- `npm run check`: passed.
- `npm test` (build, then `node --test _build/test/*.test.js`, loopback permitted, repository inputs held stable): 529 tests, 529 passed.
- The probe results below support F1 and F2. Each timing comes from a single run on the same machine; I did not repeat or average them.

### Actionable findings

#### F1 (high) — Attribution recording costs quadratic time; ordinary commands on a mid-size project slow down by about 8–30×

`RequestWork.scope().record` builds a full `snapshot()` and passes it to `progress` on every call. `snapshot()` copies the accumulated `work` and `evidence` arrays, scans every entry's `generating` list, and then calls `freezeOwned`. `freezeOwned` recursively walks the whole report, including entries that are already frozen. Each record therefore costs time proportional to everything recorded so far.

In the worker path, every progress call also sends the whole report to the parent (`send({ type: 'work-report', … report })`), which structured-clones it again.

Record counts are large on realistic projects. `recordModuleEvaluation` reports one `module-expansion-evaluation` entry per expansion record, and the TypeScript provider reports one `provider-expansion` entry per expansion. Expansion records are per module and per requirement. A `modules` or `dependencies` request on this repository (685 modules) therefore records about 4,110 entries.

Measurements:

| Case | Baseline `1b5f178` | Target `2c26810` |
|---|---|---|
| Direct Session `modules` | 6.0 s | 47.3 s |
| Direct Session `dependencies` | 1.8 s | 54.2 s |
| Direct Session repeated `dependencies` | 1.0 s | 53.6 s (no repeat speed-up) |
| CLI `modules --json` | 12.5 s | 155.9 s (`user` 285 s) |
| CLI `inspect absent-name --json` (a refusal) | 15.3 s | 162.1 s |

- The micro-benchmark isolates the cause: 1,000, 2,000 and 4,110 `record` calls with a no-op progress callback take 2.1 s, 8.7 s and 36.8 s. That is quadratic growth, and it accounts for nearly all of the direct-Session regression.
- With a progress callback that serializes each snapshot, as the worker effectively does, one `dependencies` request on this repository produced 4,118 progress snapshots totalling about 24.8 GB of serialized data.
- On the 6-module fixture, a summary with about 25 evidence queries produced 189 snapshots totalling 61 MB.

The handoff says no large-project benchmark is claimed. This repository is an ordinary target for the tool, though, and every Lens is affected, including refusals and cached repeats. The plan expects attribution to be "a bounded addition" at existing boundaries, not "a record per helper call". The guidelines' cost expectations would also apply. I recommend correcting this before continuing.

Suggested direction (implementation choices are the implementer's):

- freeze each entry once when it is created, and build snapshots without re-walking frozen content;
- send progress as append-only increments, or throttle it at operation boundaries, rather than as whole reports per record;
- report per-module expansion outcomes as one entry per requirement and evaluation, with a count and qualification, rather than one entry per record;
- add a scale regression check (a synthetic project with several hundred modules, or a record-count budget) so the cost is pinned.

#### F2 (medium) — Work reports are unbounded and repeat the full parent context in every entry; refusal JSON grows by about 9 MB

Every `WorkOrigin` embeds the complete `InitiationContext`: the normalized request, purpose, constraints and investigation bounds. That applies to each entry's `current` origin and to every `generating` item's origin. Reports therefore repeat the same parent many times:

- On the 6-module fixture, an inventory's report is 86 KB.
- A 25-query summary's report is 604 KB, and the View it accompanies is 32 KB. The report contains 540 `generating` items and roughly 278 copies of the parent context.
- On this repository, a refused `inspect absent-name --json` writes 11.0 MB to stdout, of which 9.4 MB is `attribution` (4,113 entries). The baseline output was 1.6 MB.
- The CLI `modules` observation batch grows from 18.0 MB to 27.2 MB.

Non-View JSON (resolution and usage reports) now embeds this full report in the caller-facing output. The Unicode report does not print it.

The plan asks for "bounded work attribution" at publication. It also asks that result consumers "receive enough parent/purpose/outcome information to interpret" results without a lookup. That second requirement does need the parent context, but once per distinct parent, not once per entry. Retained origins from earlier requests legitimately need their own parent descriptions, which a per-report table of parents keyed by context ID could hold.

Recommended correction:

- carry each distinct parent once, and refer to it from `current` and `generating`;
- aggregate per-record entries as in F1;
- decide whether non-View stdout JSON should carry the complete report or a bounded summary, with the full report in the observation.

The output-contract part may need a human choice. Fixing F1 alone would not bound the size.

### Non-defect observations

- **Initiation context:**
  - Session `execute`, direct `evaluateInvestigation`, the interactive parent and `publishCommand` all build a frozen `InitiationContext` before any work starts. It contains the correlation ID, the normalized request or operation, `initiator: 'caller'` (no fabricated human), a purpose, `wholeRequestBudget: null`, the actual investigation bounds and the cancellation description.
  - Configured bounds are cloned when the Session or worker opens. The test shows that later mutation of the caller's bounds object is not observed.
  - Direct operation inputs are cloned before the asynchronous checks (tested).
  - `publishCommand` adopts the work report's context only when its ID matches the published request.
- **Generation versus consumption:**
  - First retention is recorded in a store-keyed `WeakMap` outside record payloads and keys, only for `established` dispositions and only for records not already attributed.
  - Equal re-derivation keeps earlier origins and does not invent origins for untracked support (tested). Disclosure of unknown origins is explicit.
  - The TypeScript provider reports reuse from its own `results`, expansion, composition and dependency caches.
  - Module evaluation reports reuse from its existing retained-outcome cache. Partial outcomes without a retry basis re-establish new attempts, so `established` is accurate there.
  - The dependency evaluator's every-call derivation is reported as `established` with first retention suppressed for equal IDs, as disclosed.
  - No outer cache was added: the test confirms four provider calls.
  - Answer and operation identities are untouched by this change. The only method bump is `investigation-presentation@16`, which follows from `AttemptReport.parent`.
- **Evidence:**
  - Acquisition is recorded when the query returns, before response bounding.
  - Bounded replacement is marked `withheld`, with the reason. Captured content stays retained but is excluded from `suppliedEvidence` (tested).
  - Delivery is marked in the same step that already records supplied and summarized exposure, so delivery state follows actual dispatch.
  - A guard stop between acquisition and the next exchange leaves `not-delivered` (tested).
  - Exposure-based listings and pages, and their continuations, are recorded as `consumed`, not new acquisition (tested).
  - A query still in flight at cancellation leaves `outcome: null` with an explicit unknown-acquisition limitation, and a late completion cannot rewrite the sealed report (tested).
- **Failure, cancellation and closed scopes:**
  - `failWork` seals direct failures with status and completeness.
  - The interactive parent seals the last received worker report as `interrupted` or `defect` in `dispose` and in `execute`'s catch block. Messages for other or ended operations are ignored.
  - `scope.check()` refuses after `finish` or abort, so a completed parent cannot authorize another provider call (tested).
  - Records arriving after `finish` are dropped.
- **Publication:**
  - `request-work` is added to every command batch: View, refusal, failure and interruption.
  - Refusals and failures still have no `view-produced` or source event (tested with a construction defect and a worker interruption with a failing sink).
  - Returned results do not depend on sink success.
- **Deferred publication check:** with `deferPublicationCheck`, `finish('completed')` runs before `publishCommand`'s later `session.check()`. A command invalidated at that point therefore publishes `request-work` with status `completed` beside a `command-outcome` of `invalidated`. The work did complete, so this does not overclaim acquisition, but the two statuses describe different things. A one-line note in the CLI reference, or carrying the publication outcome into the report, would avoid misreading it. I did not exercise this path.
- **Documentation:** the architecture, investigation, CLI-reference and status updates match the implemented behavior and disclose the remaining compatibility and extension work. They do not mention the size or cost of the reports.

### Unverified areas and residual limits

- I did not exercise worker-level timing of progress messages or the deferred-check invalidation path described above.
- I did not test cancellation during a TypeScript provider expansion on a large project, or memory retention of the `origins` map across many requests.
- I did not test hosted investigators, which the handoff does not expect.
- Timings are single runs on one machine. The direction and order of magnitude of the regression were consistent across the direct, CLI and micro-benchmark measurements, but the exact figures will vary.
- Compatibility, the catalog and operation definitions, and the extension demonstrations are disclosed as remaining work and were not assessed.
- The historical intermittent CLI failure did not recur in this run. Its cause remains unconfirmed.

### Recommendation for this intermediate gate

The attribution semantics are sound for the assessed boundaries:

- parents are explicit;
- generation and consumption are kept apart without entering identities;
- evidence acquisition, withholding and dispatch are distinguished;
- failure, interruption and late completion are sealed honestly;
- publication covers View and non-View outcomes without fabricated events.

The checkpoint is **not yet suitable for continuing** without correcting F1. Recording cost is quadratic in the number of recorded entries. Every command on a mid-size project, including refusals and cached repeats, becomes about 8–30× slower. The compatibility and extension work would build on and exercise this path. F2 should be corrected together with F1, because the same structure drives both cost and size, and the stdout and observation size choice may need human direction. After those corrections, a narrow re-check of timing and report size on a project of this repository's scale would be enough; a full new round is not necessary unless the human prefers one.
