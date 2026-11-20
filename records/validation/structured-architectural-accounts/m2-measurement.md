# M2 accumulating-Session measurement

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Plan: [Structured architectural accounts](../../../docs/plans/structured-architectural-accounts.md#2-early-vertical-application), early vertical application
Script: [`scripts/measure-contribution-session.mjs`](../../../scripts/measure-contribution-session.mjs)

## Purpose and method

The plan asks for a bounded accumulating-Session exercise on a representative repository, recording retained-data growth, answer-construction work and context-delivery volume relative to the implementation baseline. The aim is to find accidental repeated work or whole-store expansion. It sets no performance target, and nothing here is a threshold.

- **Repository measured:** the PostCode primary checkout at `8a7f283`, read only and unchanged during the runs. It has 741 discovered modules, including test files.
- **Baseline build:** `8a7f283`, built in a scratch directory with its own `npm ci`. The dependencies are identical to the current build's. The build digest is recorded in the raw report.
- **Current build:** the task worktree with the contribution mechanism through the hosted protocol, plus the delivery correction described below.
- **Environment:** Node 22.13.1, run with `--expose-gc`, on the developer machine under ordinary background load. Each figure comes from one run, so timings are indicative only.

The script has three parts. Part A runs one fixed mechanical journey twice in one Session through the application interface, and runs on both builds. The journey is module inventory, repository organization, dependency structure, and inspection plus dependency children of three modules. Part B times module evaluation at the domain level and records ledger growth. Part C accumulates 40 scripted agentic dialogs over real retained information, then applies one broad and one narrow change. Parts B and C need the contribution mechanism and run on the current build only.

## Part A: the same journey on both builds

| | Baseline | Current |
| --- | --- | --- |
| Session opening | 4.5 s | 3.9 s |
| Whole journey, both rounds | 165.9 s | 157.9 s |
| Module inventory, first and second round | 48.0 s, 42.2 s | 48.8 s, 38.7 s |
| Dependency structure, first and second round | 18.2 s, 16.1 s | 17.2 s, 14.2 s |
| Heap at end of journey | 525 MB | 547 MB |
| Heap after Session close | 146 MB | 148 MB |
| Second-round answers identical to first | yes | yes |

Request times differ within run-to-run noise. Heap is about 22 MB, or 4%, higher while the Session is open, which is the ledger's module identification and export findings. After close, heap returns to the baseline level, so the ledger is released with the Session's record store. The long module inventory request comes from the existing standard expansions and is the same on both builds.

## Part B: module evaluation and ledger growth (current build)

| Evaluation | Time | Ledger position | Investigrams | Serialized ledger |
| --- | --- | --- | --- | --- |
| Discovery | 1.2 s | 1 | 1,482 | 3.6 M characters |
| With exports, documentation and composition | 4.3 s | 2 | 2,964 | 13.8 M characters |
| The same, repeated | 0.04 s | 2 | 2,964 | 13.8 M characters |
| Exports only, a new requirement set | 3.7 s | 2 | 2,964 | 13.8 M characters |

Each module contributes one identifying finding and one export finding, each with its organizing policy contribution: 741 Entities and 2,964 investigrams. The equivalent recomputation reuses the evaluation and adds nothing. The exports-only evaluation is new provider work, which the baseline also does. Its findings equal the established ones, so it adds no contribution.

The serialized ledger is large mainly because each export finding lists all its export claim references twice, once in the body and once as evidence, and each finding carries its full qualification. This is a representation choice and can be reduced if it matters. It is not repeated work.

## Part C: accumulating dialogs (current build)

Each of 40 scripted dialogs targets one project module. It receives the baseline identification context, requests that module's exports, acquires the module's topical inventory, reads the first dialog's account, and submits an account with a state model and a designated answer.

| Observation | Value |
| --- | --- |
| Dialog time | 0.27 s for the first, which included export evaluation; median 0.03 s |
| Deliveries recorded per dialog | 8, or 6 where noted below |
| Characters delivered per dialog, all exchanges | median 48,552; maximum 68,572 |
| Ledger after the dialogs | 3,004 investigrams, 44 productions, 304 deliveries |
| Status derivation, all investigrams | about 5 ms after the dialogs and after each change |

**Correction found by this measurement.** In the first run, seven dialogs on modules with large export surfaces received neither the export evidence page nor the retained export finding. The dialog had bundled the two into one response, which exceeded the 60,000-character response bound, so both were withheld. The record stayed truthful, since nothing was recorded as delivered, but an evidence page that would have fit on its own was lost. The evidence page is now always delivered. If the retained finding does not also fit, it is named by address, not delivered, and the response states the omission. A regression test covers this. After the correction those seven dialogs receive pages of 55,000 to 58,000 characters instead of a 3,600-character withheld notice. They still record 6 deliveries, because a retained finding omitted by address is correctly not a delivery. The first dialog records 6 because there was no earlier account to read.

### Warning breadth

| Change | Dialogs with a cause | Causes per dialog |
| --- | --- | --- |
| None, after the dialogs | 0 of 40 | — |
| Another discovery method adds an identification for each of the 40 modules | 40 of 40 | 1 for the first dialog, 2 for the others |
| The first dialog's account is withdrawn | 40 of 40 | 1 for the first dialog, 3 for the others |

The broad change flags every dialog: each acquired its module's baseline identification scope, and a new identification is an addition within that scope. The later dialogs also inherit the first dialog's producing-context cause because they read its account. The narrow change adds an exact-use cause to the 39 dialogs that received that account. The first dialog gains nothing from the withdrawal of its own use, as specified.

This is the behavior the [exposure decision](../../../docs/decisions/association-organization-and-exposure.md#exposure-and-reconsideration) anticipates: "Baseline identification scopes can be broad, especially after changed-method batches." The plan asks for concrete causes and volumes to be reported for human review if the behavior looks impractical, and forbids disabling the causes to reduce noise. Here the warnings are one per changed module per dialog that acquired its baseline, and they are cheap to derive. Whether this breadth is acceptable in use is a question for the M2 checkpoint review. The mechanism is not changed.

## Limits

- Each figure comes from a single run on a shared developer machine. Background activity varied between runs, so only differences far larger than the timings themselves are meaningful.
- Part C's dialogs are scripted, so delivery volume reflects what this script requests, not what a real agent would request.
- The measurement does not cover hosted inference, CLI rendering of contribution answers (no such Presentation exists), or migration of the earlier interpretation operations. The plan asks for the relevant measurement to be repeated after the remaining migration.
- Raw reports were kept in the scratch directory and are not committed. They contain repository paths and record identifiers but no source text. Rerun the script to reproduce them.

## Report-output reproduction constraint after M2 round 6

The [Copilot round 6 review](../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-6-copilot-findings.md) found that the script excluded the entire optional report parent, which could remove project inputs when the report was placed beside the configuration or inside source directories. The corrected script requires a dedicated empty report directory, creates it when absent, and refuses a nonempty parent before opening the project. Choose a new directory for each saved run; omitting the output argument still prints the report without adding a report exclusion.

The original measurements above were not rerun for this correction. A controlled two-module regression verifies both unsafe-parent refusals and identical selected answers with no output versus output in a dedicated directory. Its one scripted dialog uses no hosted inference.
