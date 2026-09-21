# Analysis latency investigation

Date: 2026-09-21
Task: [Investigate and reduce analysis latency](../tasks/2026-09-21-analysis-latency.md)
Baseline runtime: `db3a593` (task-opening commit; unchanged pre-optimization runtime)

## Result and scope

Repeated serialization and SHA-256 hashing of the same captured source text dominated
ordinary PostCode invocations. The source-evidence factory hashed a whole file for
every declaration, documentation block, forwarding route and dependency occurrence.
Large installed declaration files made this especially expensive during expansion
materialization. The baseline CPU pilot attributed 32.82 of 38.14 sampled seconds
to evidence construction, including 20.67 seconds in canonical serialization and
11.52 seconds in hash updates beneath that factory.

The implementation reuses each `SourceFile` object's content digest within one
`discover` call. Snapshot source entries and all evidence records use the same
existing digest function. The map is created after compiler preparation, is local
to the call, and is discarded afterwards. Files first needed during evidence
materialization are handled lazily. There is no path-keyed or cross-opening cache,
no skipped analysis, and no changed analysis method or identity version: record
content and semantics are unchanged. No session or broader lifecycle was needed.

## Repeated end-to-end measurements

Times below are parent-observed monotonic elapsed seconds from launching a fresh
Node process through its exit, including module loading, the complete CLI pipeline,
rendering, output capture, and real local observation-file submission. Each cell
has three measured fresh-process samples after a separate warm-up for that variant
and command. The median and full range are shown; there are no timing test gates.

| Subject and command | Before median (range) | After median (range) | Reduction | Speedup |
| --- | ---: | ---: | ---: | ---: |
| PostCode `dependencies --json` | 39.093 (39.059–39.138) | 4.821 (4.661–4.939) | 87.67% | 8.11× |
| PostCode `organization repository` | 38.995 (37.775–39.171) | 4.351 (4.329–4.387) | 88.84% | 8.96× |
| Small fixture `dependencies --json` | 0.914 (0.866–0.930) | 0.917 (0.900–0.933) | −0.28% | 1.00× |
| Small fixture `organization project` | 0.888 (0.886–0.915) | 0.897 (0.897–0.933) | −1.08% | 0.99× |

The small differences on the fixture are within the observed variation; no speedup
is established there. Its six modules have little repeated large-file evidence.
Both subjects use the same enclosing Git worktree, deliberately holding repository
capture roughly constant while varying the configured TypeScript population.
The fixture disables standard libraries and automatic type inclusion. PostCode
uses its ordinary `tsconfig.json`, including application/test sources and installed
declarations. This is not a claim about all small standalone repositories.

### Stage attribution

Exclusive medians in milliseconds for the PostCode dependency command follow.
Nested instrumented stages have been subtracted, so these rows do not count
repository capture twice under project opening, or expansion work twice under
evaluation. Independent stage medians need not sum to the median elapsed time.

| Stage | Before | After |
| --- | ---: | ---: |
| Project opening / TypeScript Program, excluding repository capture | 992.33 | 1055.67 |
| Repository evidence capture | 216.40 | 214.87 |
| Repository layout derivation | 1.35 | 1.42 |
| Compiler export/documentation preparation | 207.21 | 194.46 |
| Composition preparation | 1.01 | 1.06 |
| Dependency preparation | 94.34 | 95.07 |
| Expansion materialization, including evidence | 34494.02 | 723.58 |
| Composition materialization | 96.70 | 34.72 |
| Dependency materialization | 200.49 | 31.72 |
| Remaining discovery/evaluation, identity, record validation and storage | 1848.68 | 1482.45 |
| Module-evaluation recording | 27.38 | 26.65 |
| Organization evaluation / placement | 38.74 | 39.07 |
| Dependency-organization derivation | 48.08 | 46.44 |
| Dependency projection construction | 19.88 | 18.06 |
| View construction | 44.68 | 42.04 |
| Rendering | 21.33 | 27.20 |
| Observation batch construction | 0.44 | 0.45 |
| Local observation submission | 78.97 | 74.46 |

Organization's expansion materialization similarly fell from 35019.37 to 742.30
milliseconds. The separate optimized CPU pilot reduced inclusive evidence samples
to 491 milliseconds, with no remaining multi-second hashing hotspot. Its largest
self-time categories include canonicalization, evidence construction, garbage
collection and record cloning; this does not justify weakening record validation.

The small fixture still spends about 210–220 milliseconds capturing this worktree,
34–35 milliseconds opening its small Program, and about 425 milliseconds in child
startup/imports and orchestration outside the named stages. Parent-observed
startup/exit adds further cost. These largely fixed costs explain its unchanged
latency. Remaining ordinary PostCode costs include Program opening, complete
record materialization/validation and expansion construction. Fresh navigation
still incurs those costs.

## Conditions, contamination and retained observations

Host: Intel Core i9-9980HK at 2.40 GHz, 16 logical CPUs, macOS x64; Node 22.13.1,
TypeScript 6.0.3. Runs were sequential, with no build, tests or second benchmark
running concurrently. Before/after order alternated by sample. Each process opens
its project afresh; warm-up affects filesystem/OS caches, not a retained compiler
Program or in-process JIT state. No cold-disk-cache claim is made.

Both instrumented builds analyzed the same worktree after the source optimization
and regression test were written. Source files and repository artifact membership
were held constant through the paired series. Later validation documentation and
the comparison helper were added after timing. Each case has one identical rendered
output SHA-256 across all eight before/after/warm-up runs, including the complete
snapshot scope. Observation UUIDs and filenames legitimately differ.

The harness records wall and monotonic elapsed time in parent and child, CPU time,
load averages, free memory and a 250-millisecond parent heartbeat. It enforces a
120-second timeout. Clock divergence over one second, parent heartbeat gaps over
two seconds, process failures, or low CPU/wall ratios below 0.6 on runs longer
than ten seconds cause exclusion and bounded repetition. All attempted runs are
retained. The final series contains 32 successful runs: eight warm-ups and 24
representative samples, with no contaminated or timed-out runs. Maximum parent
wall/monotonic difference was 2.35 milliseconds and maximum heartbeat gap was
272.76 milliseconds. Inspection of sample ranges found no material outlier.

This detection is practical rather than exhaustive. Some suspension mechanisms
advance both clocks; process CPU ratios and the parent heartbeat supplement the
comparison. Thermal throttling and unrelated contention cannot be ruled out by
these counters, and no dedicated thermal/power sensor was sampled. Host load and
memory readings are retained for that reason. Repeat suspect measurements rather
than treating these thresholds as proof of an uncontaminated machine.

Both CPU-profiled pilot runs are retained separately and excluded from representative
aggregates: they had profiling enabled and occurred at different subject revisions.
The first pilot appeared delayed in tool delivery, but its own measured elapsed
was 38.090 seconds; it was not a measured long-running outlier. The earlier
975-second dependency observation and roughly 420-second organization journey
remain in their original historical records. This investigation explains the
ordinary fresh-invocation cost; it does not retrospectively establish whether
those exceptional historical wall times involved sleep, suspension or contention.

[Retained timing data](2026-09-21-analysis-latency-data.json) contains every sample,
pilot disposition, stage timings, conditions, output hashes and CPU-profile
summaries. These are development measurements, not reusable program claims.
Raw CPU profiles are not required to interpret the preserved summaries and can be
regenerated with the commands below. No repository-derived view text is included
in the timing data.

## Semantic verification

- `npm run check` passed.
- `npm test` passed all 192 tests, including existing identity, generated-output
  exclusion, completeness, qualification, source-detail, navigation and observation
  coverage. No timing assertion was added.
- The new regression exercises repeated evidence from multiple declarations,
  documentation, forwarding and dependency resolution. It checks direct content
  digests and distinct spans; later filesystem changes cannot alter evidence from
  a previously opened Program. A fresh opening observes same-length changed text,
  changes the snapshot and source digest, and retains the evidence population.
  Repeated equivalent openings reproduce all collected records and outcomes.
- Twenty-one baseline/optimized CLI pairs were compared for exact rendered output,
  stderr, qualified view and observation contents after replacing invocation UUID
  references with record kinds. Cases cover both dependency fixtures, inventory,
  repository/project organization, group source detail, dependency structure,
  children, parents, dependency-context module inspection, source disclosure and
  stale snapshot rejection, plus PostCode's full structured inventory.
  [Retained comparison results](2026-09-21-analysis-latency-equivalence.json)
  record the commands and matching output hashes. All passed.
- The measurement series separately verifies byte-identical output hashes for
  PostCode dependency JSON and organization Unicode and the smaller fixture.
- Rebuilding the baseline from `git archive db3a593` reproduced every application
  file used in the original measurement. The original ignored build also held two
  stale, unimported JavaScript siblings from earlier work; no rebuilt application
  file refers to them. They were not deleted or treated as part of the runtime.
  A later fixture smoke comparison through the reconstructed baseline passed;
  its timings are retained separately as tooling verification, not added to the
  paired series. All four development scripts pass `node --check`.

The implementing agent performed these checks; they do not substitute for the
human-arranged independent review gate.

## Reproduction and tooling lifecycle

The four `scripts/*analysis.mjs` tools are development-only helpers for this
investigation. They add no runtime options or dependencies. The profiler copies
compiled application files, checks each expected function boundary, and wraps
those boundaries only in the disposable copy. Materializer calls are timed
separately. If implementation boundaries change, update the helper deliberately;
a missing boundary fails instead of silently dropping attribution.

Following Copilot review, exhausting all three attempts for any warm-up or
representative sample now fails the series with a nonzero exit status and an
explicit incomplete-series error. The manifest and per-attempt reports remain
available; do not summarize that incomplete series as the requested sample set.
Use a new output directory for another series. Deterministic regression checks
cover exhausted warm-up and representative retries, retained failed attempts, and
successful recovery on the third attempt. The original 32-run series had no
excluded attempts, so this correction does not change its retained measurements.

For a fresh comparison, build the baseline in a disposable directory and instrument
it alongside the current build. From the repository root, using an unused output
directory:

```sh
npm run build
mkdir -p _build/latency-baseline-source
git archive db3a593 | tar -x -C _build/latency-baseline-source
ln -s "$PWD/node_modules" _build/latency-baseline-source/node_modules
node node_modules/typescript/bin/tsc -p _build/latency-baseline-source/tsconfig.json
node scripts/profile-analysis.mjs _build/latency-before _build/latency-baseline-source/_build
node scripts/profile-analysis.mjs _build/latency-after
node scripts/benchmark-analysis.mjs _build/latency-before _build/latency-after _build/latency-results 3
node scripts/compare-analysis.mjs _build/latency-before _build/latency-after _build/latency-results/equivalence.json
```

Build artifacts and optional timing outputs above stay under the CLI's explicitly
excluded `_build` location. Real observation delivery uses the explicitly excluded
`_observations` sink. Do not edit the subject checkout, run tests/builds concurrently,
or compare outputs across changes to artifact membership during a series.
Absolute times and snapshot hashes are environment/worktree dependent; the intended
comparison is two implementations against identical current inputs.

For a separate diagnostic CPU profile (not a representative timing sample):

```sh
node --cpu-prof --cpu-prof-dir=_build/latency-results scripts/measure-analysis.mjs _build/latency-before _build/latency-results/cpu-before.json dependencies --json
```

The benchmark captures and hashes rendered stdout instead of painting a terminal;
rendering and output delivery to that capture are timed. Actual terminal painting,
Codex tool delivery and human reading are outside the measurement. The development
wrappers add a shared instrumentation cost; no claim is made that these
figures are exact terminal stopwatch timings. Observations use the real file sink,
including serialization and delivery, rather than a discard sink.
