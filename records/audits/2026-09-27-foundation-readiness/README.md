# Foundation-readiness audit collection

Audit date: 2026-09-27
Archived: 2026-09-27
Status: historical exploratory evidence; no implementation or plan approval.

This collection preserves eight reports produced by Claude and Codex, with selected research, probes, recorded results, verification logs, source-baseline metadata, and reproduction instructions. The reports informed planning to strengthen PostCode's implementation foundations. Their conclusions remain those of their authors; inclusion here does not resolve disagreements or endorse every recommendation.

## Reports

| Subject | Claude | Codex | Audited application revision |
| --- | --- | --- | --- |
| Library reuse | [Report](library-reuse/claude/REPORT.md) · [archive metadata](library-reuse/claude/ARCHIVE.md) | [Report](library-reuse/codex/REPORT.md) · [archive metadata](library-reuse/codex/ARCHIVE.md) | `3415ece523067cc1a06eda42e37bc999ae46c445` |
| State consistency and resource lifetimes | [Report](state-resources/claude/REPORT.md) · [archive metadata](state-resources/claude/ARCHIVE.md) | [Report](state-resources/codex/REPORT.md) · [archive metadata](state-resources/codex/ARCHIVE.md) | `5c048694fa10dc19addcbaf5825bc9c9a9719c9a` |
| Processing cost | [Report](processing-cost/claude/REPORT.md) · [archive metadata](processing-cost/claude/ARCHIVE.md) | [Report](processing-cost/codex/REPORT.md) · [archive metadata](processing-cost/codex/ARCHIVE.md) | `5c048694fa10dc19addcbaf5825bc9c9a9719c9a` |
| Supplementary foundation readiness | [Report](foundation-readiness/claude/REPORT.md) · [archive metadata](foundation-readiness/claude/ARCHIVE.md) | [Report](foundation-readiness/codex/REPORT.md) · [archive metadata](foundation-readiness/codex/ARCHIVE.md) | `5c048694fa10dc19addcbaf5825bc9c9a9719c9a` |

Only engineering guidance changed between these two committed baselines. The later reports also used the then-uncommitted engineering-guideline revision, retained with the relevant evidence. Consult each report for its precise scope and baseline; source links identify repository locations, not a promise that current code still equals the audited revision.

## Selected supporting evidence

- Library selection: [library evidence](library-reuse/codex/library-evidence.md), [graph-library research](library-reuse/codex/graph-library-research.md), [SCC compatibility/depth results](library-reuse/codex/graph-research/probe-results.json), and [traversal results](library-reuse/codex/graph-research/traversal-results.json).
- State/resources: [Claude failure experiments](state-resources/claude/experiments/), [Codex failure-probe results](state-resources/codex/probes.json), [worker-send results](state-resources/codex/worker-send-probe.json), and [assertion-mutation results](state-resources/codex/test-assertion-probe.json).
- Processing: [Claude measurements](processing-cost/claude/results/summary-table.txt), [prototype diff](processing-cost/claude/prototype.diff), [output comparison](processing-cost/claude/results/equivalence.txt), [Codex measurements](processing-cost/codex/measurements.json), and [reproduction notes](processing-cost/codex/REPRODUCE.md).
- Supplementary review: [Claude ownership probe](foundation-readiness/claude/ownership-probe-results.json), [graph probe](foundation-readiness/claude/graph-probe-results.json), [layout probe](foundation-readiness/claude/layout-probe/results.json), [Codex focused probes](foundation-readiness/codex/probe-results.json), [terminal results](foundation-readiness/codex/terminal-results.json), and [timeout results](foundation-readiness/codex/timeout-results.json).

## Preservation and interpretation

132 source files were moved into the eight audit directories. Reports are consistently named `REPORT.md`. Authored prose and conclusions are preserved; only Markdown link destinations were mechanically adjusted for relocation. Per-audit `ARCHIVE-MANIFEST.json` files record original paths, original/archived SHA-256 hashes, and each link adjustment. Other retained evidence, including scripts, results, logs, and diffs, is byte-for-byte unchanged.

Links to unarchived or unavailable evidence lead to an explicit per-audit archival note, with the original target retained in the manifest. This keeps missing evidence visible without making durable records depend on scratch directories. Historical path strings and commands remain as authored and are explained by those notes.

Compiled builds, duplicate source checkouts, generated repositories, dependency installations, package-manager caches, published-source copies, and raw CPU profiles remain in their original scratch workspaces. Their omission inventories, selected package metadata/hashes, manifests/lockfiles, and available generation/profiling scripts describe how to reconstruct relevant inputs. Not every omitted artifact is independently reproducible from this collection; each report's evidence limits still apply. A separate unapproved library implementation brief was left in scratch because it is planning material, not an audit result.

## Reproduction and archival verification

Restore historical probes into their original paths in a disposable checkout of the relevant baseline before running them. Do not execute probes here: several write results beside their source or assume disposable copies of the application. Follow each audit's archival note and any retained reproduction instructions; cross-audit graph probes can require restoring more than one original workspace and installing exact research dependencies. This collection does not add dependencies to the application.

Archival verification checks file hashes, report-body preservation apart from link destinations, local Markdown link targets, report completeness, and source-file relocation. [Verification results](ARCHIVE-VERIFICATION.json) describe these checks. No application tests, benchmarks, or historical probes were rerun as part of the move.
