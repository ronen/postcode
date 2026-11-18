# M3 mechanical accumulating-Session measurement

Date: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Plan: [M3 migration](../../../docs/plans/structured-architectural-accounts.md#3-complete-producer-and-caller-migration)
Script: [`measure-contribution-session.mjs`](../../../scripts/measure-contribution-session.mjs)

## Method

Repeat the M2 bounded exercise to identify repeated work, retained-data growth and delivery expansion. There is no performance threshold in the plan. These are single runs under ordinary background load, including concurrent offline tests, not statistical benchmarks.

The read-only source fixture is the primary PostCode checkout at `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1`: 741 modules. Both measured builds use Node 26.11.0 with `--expose-gc` and the same installed dependencies. The complete test suite separately uses Node 22.13.1, matching the installed native credential-lock binary. Neither measurement loads that credential path or makes live inference requests.

Baseline: pre-M3 `7035d036b384fa8f47ed3c27f30825c7ef645ebf`, archived and compiled in ignored scratch space. Current: the implementation target named in the mechanical handoff. Build digests, over compiled `src/`:

- Baseline: `6e66acec4a14597eed0493251502af9ec65e40aff7a668c58152ee43ee946b61`.
- Current: `35c39ece0d5d90d4885002a1d2167a8f239ca48d5baa668afd5e10b87518322f`.

Reproduce with `node --expose-gc scripts/measure-contribution-session.mjs <fixed-source-tsconfig> <build-directory> <empty-report-directory>/report.json 40`. Each output directory must be empty; it is excluded from the captured source. The reports for this run are in ignored `_verification/m3-measure-baseline/` and `_verification/m3-measure-indexed/` in the task worktree. The script is unchanged.

## Fixed application journey

Two rounds in one Session: module inventory, organization, dependency structure, then inspection and dependency children for three modules. Decimal MB are used below.

| Observation | Pre-M3 | Current |
| --- | ---: | ---: |
| Session opening | 4.6 s | 3.3 s |
| Eighteen requests, total | 164.4 s | 211.2 s |
| Module inventory, first / repeat | 49.7 / 39.5 s | 56.8 / 55.7 s |
| Dependency structure, first / repeat | 18.8 / 15.6 s | 22.0 / 23.7 s |
| Heap after final request | 454.6 MB | 1,251.5 MB |
| Heap sampled after close | 106.2 MB | 346.5 MB |
| Repeated answers equal | yes | yes |

The complete journey is about 28% slower in this pair. Mechanical answers now retain full qualified common snapshots, and the native ledger includes symbols and individual findings. Both increase retention and construction cost. The higher post-close process heap is an observation, not proof that all additional objects were released or that the ledger leaked.

A separate controlled GC check on `fixtures/exports` captured weak references to the store and ledger, closed the application Session, retained its returned module answer, and collected after asynchronous turns. Both store and ledger were collected. This checks their lifetime on that fixture; it does not explain every byte in the representative process measurement or establish bounded memory for arbitrarily large repositories. Snapshot size remains a mechanical-review focus.

## Native evaluation and retained data

| Evaluation | Pre-M3 time | Current time | Current position | Current serialized ledger |
| --- | ---: | ---: | ---: | ---: |
| Discovery | 1.25 s | 1.41 s | 1 | 3.60 M characters |
| Exports, documentation, composition | 4.03 s | 7.58 s | 3 | 132.57 M characters |
| Equivalent repeat | 0.034 s | 0.050 s | 3 | 132.57 M characters |
| Exports-only requirement set | 3.96 s | 4.41 s | 3 | 132.57 M characters |

After all expansions, the baseline has 741 Entities, 2,964 investigrams, 1,482 items, 1,482 declarations, 4 productions and 13.77 M serialized characters. Current has 8,242 Entities, 50,934 investigrams, 27,412 items, 23,522 declarations and 7 productions. Both have zero retained-input deliveries for these independent compiler findings. Repeating the evaluation or requesting the equivalent exports-only result adds no contribution, production, Entity or organizing use.

**Correction found by this exercise.** The initial current build took 225.4 seconds for all-expansion evaluation and 417.5 seconds for the application journey. Acceptance rebuilt each producer's evidence set for every investigram, scanned previously built provider keys for each new finding, and scanned the staged pool for identifying item types. Batch-local indexes remove that quadratic work. Final all-expansion time is 7.6 seconds, with the same retained counts and serialized size. Atomic validation and independently attributed producer evidence remain unchanged. The initial report is in ignored `_verification/m3-measure-current/`; it is not the final build.

The remaining serialized growth reflects substantially more qualified content and organizing uses, with provider records also retained in native item bodies and fixed support. This representation has a real cost. The measurement establishes no repeated ledger growth under equivalent evaluation, but does not claim the representation is compact or that answer construction costs are negligible.

## Forty scripted dialogs and change breadth

| Observation | Pre-M3 | Current |
| --- | ---: | ---: |
| Median dialog time | 27 ms | 29 ms |
| Median / maximum delivered characters | 50,095 / 69,816 | 50,095 / 69,816 |
| Total deliveries | 304 | 304 |
| Status pass after dialogs | 3.4 ms | 46.6 ms |
| Status pass after broad change | 5.2 ms | 51.4 ms |
| Status pass after narrow withdrawal | 5.0 ms | 41.6 ms |

The dialogs add 40 investigrams and 40 productions to each build. Their exchange volume remains bounded by the same selected information; the newly retained mechanical population is not automatically delivered to them. The status pass intentionally visits every investigram, now about 51,000 rather than 3,000.

Both builds have zero flagged dialogs before changes. Adding alternate identification for their 40 modules flags all 40 (one cause for the first dialog, two for the others). Withdrawing the first dialog's account retains the same 40 flagged dialogs (one cause for the first, three for each later dialog that read it). The broad and narrow controls preserve M2's cause breadth. These are controlled mechanism observations, not additional instruction-usability or architectural-correctness trials. Agentic/caller migration still requires its separate checkpoint.
