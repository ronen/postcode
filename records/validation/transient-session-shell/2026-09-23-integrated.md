# Transient session shell: integrated verification

Date: 2026-09-23
Implementation: `6dd42cb6426cf21d56cbeab4745e179354007576`
Task: [Transient interactive session shell](../../tasks/2026-09-23-transient-session-shell.md)
Plan: [Approved plan](../../../docs/plans/transient-session-shell.md)
Prior checkpoint: [One-shot validation](2026-09-23-one-shot.md)

This is implementation-agent evidence. Independent integrated review and human
inspection/acceptance remain outstanding. Measurements used the implementation's
working tree before the implementation and record commits; no source changed
during a measured session. Repository artifact/tracked metadata will differ after
these record commits. No real-project observation batches are committed here.

## Verification

- `npm run check`: passed with Node 22.13.1 and pinned TypeScript 6.0.3.
- `npm test`: all 216 tests passed (final run about 49 seconds).
- `git diff --check`: passed.
- `node scripts/compare-session-requests.mjs REPORT`: 162 comparisons passed,
  54 each for dependency-journey, dependency-contract and exports. Each fixture
  uses a temporary Git worktree with the same inputs for every opening. Eighteen
  requests cover both formats, inventory, both organizations, inspection,
  dependency structure, children/parents, and explicit source detail. Compare a
  fresh session with the worker-backed accumulated request, reverse independent
  requests in another worker, then repeat earlier questions in the first worker.
  Compare complete returned views and rendered output. Only session UUID prefixes
  and headers are consistently renamed; no relationships, support collections,
  repeated-row reference markers, qualifications, omissions or ordering are
  dropped. This does not extend the historical-run comparator's claims.
- Existing semantic, output-safety, source-evidence and sink-failure tests pass.
  Shell tests additionally exercise quoting/literal selectors, non-terminal
  refusal before project opening, syntax recovery, adaptive selection from a
  prior view, ambiguity recovery from one-shot group lookup to a precise shell
  reference, idle Ctrl-C, EOF with accepted work, and command correlation.
- Focused tests exercise append-only collision bindings; dependency inputs first
  acquired after inventory; reuse of the identical completed module evaluation;
  unchanged earlier projections, contexts and input records; later completion
  of incomplete module and dependency evaluations, including reuse of a module
  basis while retaining the earlier partial dependency outcome.
- Change tests cover source, configuration, absent dependency becoming present,
  new configured file, repository exclusion policy and process environment.
  Resolution/population cases run outside Git so repository recapture cannot
  mask a missing compiler-probe check. Excluded output creation stays valid;
  retargeting an output boundary invalidates before replaying captured reads.
- Publication tests introduce real source edits before output and immediately
  after output. The former observes invalidation without any view; the latter
  retains the actual emitted view/output plus invalidation. Expected operational
  failure, invariant defect and interruption remain distinct, with no fabricated
  view/disclosure events.

The current compiler Program fixes module population at opening. Additional
CommonJS resolution acquires input evidence but does not add modules. Growing
lookup ambiguity is consequently outside this provider's supported discovery;
its actual name/handle ambiguities and the growth-safe allocator are tested.

## Real compiler interruption

`node scripts/probe-session-interruption.mjs` copies the built runtime to an OS
temporary directory and adds only an atomic marker immediately before the real
`program.getTypeChecker()` call. A project has 80,000 declarations. The production
shell runs with a terminal-designated input stream; after the marker and 20 ms,
the interrupted run sends Ctrl-C through readline. No asynchronous compiler stub
or inserted wait is used. The same shell, worker termination, publication and
observation paths as the CLI run.

| Run | Opening | Command through exit | Ctrl-C through exit | Exit | Observation |
| --- | ---: | ---: | ---: | ---: | --- |
| Control | 3.645 s | 1.814 s | — | 0 | view-produced, command-completed |
| Interrupted | 3.650 s | 0.198 s | 46.8 ms | 130 | command-interrupted only |

The interrupted request was unfinished at signalling, returned no view, and
awaited worker termination before returning. A probe found an earlier teardown
race where return preceded termination; the implementation now shares and awaits
the termination promise. The marker was also made atomic after one harness run
observed its created-but-not-yet-written file. Both corrections precede the
recorded final result. These timings are observations, not a cancellation latency
guarantee. Initial-opening interruption can end before a session ID exists and
therefore may have no command observation. Native one-shot SIGINT still has the
narrower behavior established at the first checkpoint.

## Investigation and costs

A real terminal smoke journey on dependency-journey used displayed references to
inspect `forward`, request dependency structure, select `right`'s children and
`shared`'s parents, inspect captured forwarding source, request project and
repository organization, and inspect the `common` group. Its repeated inventory
request was withheld when adding a new repository script changed the captured
manifest, demonstrating invalidation in the running prompt. Automated retained
view tests separately verify unchanged repeated inventory.

`node --expose-gc scripts/measure-session-journey.mjs tsconfig.json REPORT` exercised
PostCode through the shared executor and then the actual shell controller. It
chooses references from prior structured views: modules, session-module inspection,
dependencies, children, a child's parents, explicit source detail, project and
repository organization, a displayed group, and repeated inventory/dependencies.
The inventory contained 215 modules, of which 59 were project-associated. The
repository organization contained 48 groups. Every shell command completed;
qualified coverage and omissions remained present. This is agent inspection,
not the required human inspection.

The direct executor opened in 1.638 s and produced its first inventory in 3.089 s.
The first inspection/dependency requests took 0.551/0.847 s. Subsequent focused
and organization requests took 0.493–0.597 s. Repeated inventory/dependencies in
that run took 5.390/3.214 s. Executor measurements include its validation passes,
but exclude worker startup, publication-boundary checks and observation delivery.

The full shell run opened in 7.293 s, produced its first view in 18.036 s, and had
an unexplained 257.669 s first-inspection outlier. Remaining commands took
0.962–4.646 s. To check that anomaly, a separate process repeated the shorter
shell journey without first retaining the direct executor's views:

| Shell stage | Isolated repeat |
| --- | ---: |
| Opening through prompt | 1.734 s |
| First inventory | 4.662 s |
| Inspection selected from inventory | 1.349 s |
| First dependency view | 1.776 s |
| Repeated inventory | 2.199 s |

Both shell measurements include worker messaging, rendering, publication checks
and observation construction through submission to a no-op sink. They exclude
local sink disk-write latency and terminal display consumption. The isolated
repeat did not reproduce the extreme outlier; its cause is unestablished. Do not
use these single samples as a stable latency guarantee or discard the slower
run. No performance threshold is asserted by ordinary tests. Reuse is established
by retained evaluation identity and provider results, not inferred from timings.

With three explicit GC/event-loop rounds per sample, executor heap use was
30.0 MiB before opening, 235.3 MiB with the live session, and 51.3 MiB after closing.
Earlier view objects were intentionally still referenced at close. After the
subsequent shell worker had terminated, parent heap use was 49.2 MiB. These
measurements support release of the bulk retained compiler/store state; RSS is
not a reachability test. Process RSS was 606.4 MiB at the live executor sample,
591.8 MiB after close, and 422.0 MiB after worker close. Peak sampled RSS in the
combined shell run was about 1,066 MiB, including the parent process. The isolated
short shell repeat reached about 758 MiB. Retained history has no eviction or
memory budget; long investigations and larger projects remain a material limit.

## Coverage and remaining review

Validation replays observed compiler probes and compares repository evidence and
process context; it is sequential, non-atomic and command-boundary based.
Transient changes reverted between checks, changes after the last check,
unobserved inputs outside selection/resolution, unread ordinary artifact contents,
and tool replacement with an unchanged reported version can escape detection.
The [CLI reference](../../../docs/cli-reference.md#input-stability-and-retained-work)
documents the implemented contract. Native filesystem/Git operations can also
delay worker termination; the experiment establishes the real compiler path.

The review's input-basis note is resolved through retained first support for
existing contexts and later input records for newly established contexts. Memory
release is measured above. The hypothetical textual namespace-substitution
collision remains a documented non-defect limitation: stable allocation no longer
uses population-wide recomputation, but record-key canonicalization was not
changed. Conflicting record content still fails rather than silently merging.

Human inspection of the complete fixture/PostCode investigation and the final
independent review remain required. No interpreting lens, session persistence,
external-agent access, public batch input or automatic refresh was added.
