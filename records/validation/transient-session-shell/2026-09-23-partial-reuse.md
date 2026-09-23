# Partial-expansion reuse after integrated review round 2

Date: 2026-09-23
Correction target: `441772648cbd550b108c1060cc8dfb1df883edc4`
Task: [Transient interactive session shell](../../tasks/2026-09-23-transient-session-shell.md)
Finding: [R2-F1](../../reviews/transient-session-shell/2026-09-23-integrated-round-2-findings.md)
Disposition: [Integrated assignment](../../reviews/transient-session-shell/2026-09-23-integrated-disposition.md)

The human approved retrying stable partial work only after additional input
acquisition. This report records implementing-agent verification of that
correction, not independent review or human acceptance.

## Implementation and focused coverage

The TypeScript provider retains partial prepared expansions, composition,
dependency work and discovery results against an append-only input-acquisition
revision. Validation does not advance that revision or refresh captured inputs.
Dependency inputs are acquired before deciding whether partial expansions need
another attempt. Each prepared component retains its acquisition revision; if
later preparation acquires more inputs, earlier partial work is not marked
stable on that newer basis.

A stable result supplies `retryBasis`, referencing captured analysis inputs in the
same session. Evaluation validates that reference and reuses a partial outcome
only for identical result content and that basis. Completed results remain
reusable independently of later acquisition. Providers without the assurance
continue to get new incomplete attempts. The session no longer caches module or
dependency outcomes above that boundary, which would hide acquisition; existing
organization caches remain keyed to the selected evaluation.

Focused regressions cover:

- Real unresolved re-exports reused through inventory, inspection and dependencies
  without altering earlier views or entity bindings.
- A completed root with partial exports retaining its outcome and evaluation count
  on the same basis, including direct provider-result reuse.
- CommonJS dependency resolution acquiring previously unobserved target probes:
  the partial basis changes, one new module attempt is established and shared
  across dependency/module routes, and subsequent requests reuse it.
- The same acquisition sequence through `session.execute`, including unrelated
  organization and inspection requests and retention of the earlier view.
- Removal of the optional provider assurance still permitting repeated incomplete
  attempts. Existing later-completion and changed-input invalidation tests remain
  applicable.

The TypeScript discovery method advances to 12 and module evaluation to 5.
Qualification remains partial; `retryBasis` is reuse metadata, not a claim that an
incomplete result became complete.

## Realistically sized comparison

Added [measure-partial-session.mjs](../../../scripts/measure-partial-session.mjs).
It creates two temporary Git copies of the current PostCode `src`, `test` and
`tsconfig.json`, using the installed dependencies via a symlink. One copy adds
`src/partial-export.ts` containing `export { missing } from './nowhere.js';`.
The clean copy has 215 modules and the partial copy 216. Both runtime versions
analyze the same source content; this compares execution policies, not different
historical versions of the target project.

The baseline runtime is the saved build of reviewed target `cafbd9c`. The corrected
runtime is `441772648cbd550b108c1060cc8dfb1df883edc4`, submitted for round 3. Commands were:

```sh
node --expose-gc scripts/measure-partial-session.mjs <saved-baseline-src> --allow-retries
node --expose-gc scripts/measure-partial-session.mjs
```

Each run uses a fresh process (Node 22.13.1 / TypeScript 6.0.3) and no concurrent
verification jobs. Each project first acquires all five lenses, then establishes
five reference views, then executes four rounds of modules, dependencies,
organization, inspection of the complete `session` module and its children: 20
measured requests. A forced collection follows each timed request, outside its
duration. Timings include direct execution and its two validation passes; they
exclude worker transport, publication, sink delivery and physical terminal output.
The corrected run asserts complete result equality against the warmed reference
view on every measured request, including rendered output and all qualifications.
There are no latency or heap thresholds.

### Median direct request latency (milliseconds; four samples per cell)

| Request | Previous clean | Previous partial | Corrected clean | Corrected partial |
| --- | ---: | ---: | ---: | ---: |
| Modules | 1553 | 3678 | 1581 | 1569 |
| Dependencies | 733 | 2818 | 760 | 743 |
| Organization | 588 | 2619 | 609 | 599 |
| Inspect complete module | 603 | 2658 | 597 | 595 |
| Children | 684 | 2719 | 692 | 688 |

Partial-project inspection ranged from 2630–2706 ms before the correction and
576–600 ms afterward. This reproduces the reported penalty under the old policy
and removes it in the tested repeated-request workload. Small differences between
clean samples are ordinary single-run variation; no general latency guarantee or
statistical performance claim is made.

### Collected heap (MiB)

| Runtime/project | Before 20 repeats | After 20 repeats | After close |
| --- | ---: | ---: | ---: |
| Previous, clean | 234.7 | 236.5 | 39.2 |
| Previous, partial | 273.6 | 368.6 | 37.8 |
| Corrected, clean | 235.2 | 236.6 | 39.3 |
| Corrected, partial | 237.9 | 237.6 | 40.0 |

The old partial project retained four distinct projections per lens across the
four measured repeats; every other case retained one. The corrected run matched
all repeated results exactly. Reference views are held during the repeat phase
and released before the closing measurement; samples retain only scalars. The
first project's process baseline was about 30 MiB and the second's about 39 MiB.
These are collected heap observations, not proof of a general memory bound.
New requirements and additional input bases can still retain more outcomes; no
history eviction was introduced.

## Final checks

`npm run check`, `npm test` (228 tests), and `git diff --check` passed. The unchanged
`scripts/compare-session-requests.mjs` passed all 162 full view/output comparisons
across fresh, accumulated, repeated and reordered requests. The real compiler
interruption probe passed: the control returned a view and exited 0; interruption
inside checker work returned no view, recorded only `command-interrupted`, awaited
teardown and exited 130 about 20 ms after interruption. No unrelated verification
was running during the before/after cost measurements.

## Limits

This probe covers one kind of partial expansion and 20 measured requests after
warm-up, on one machine. It does not establish long-session behavior for every
partial/unavailable state, a memory limit, or shell end-to-end latency. Existing
full fixture comparisons and lifecycle tests complement it. The prior 257-second
outlier remains unexplained; this correction addresses the separately reproduced
project-wide retry cost. Previously approved platform/opening/interactive-failure
limits and required human inspection remain in force.
