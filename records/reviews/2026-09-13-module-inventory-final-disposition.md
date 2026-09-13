# Final independent review: disposition and closure verification

Date: 2026-09-13
Status: findings resolved; independent-review gate satisfied
Reviewed target: `fee76353d011f93f0cf1f7bd377c94e96c4fe4c8`
Correction: `88f6d6d`
Task: [initial module inventory](../tasks/2026-09-12-initial-module-inventory.md)

The human returned the [independent findings](2026-09-13-module-inventory-final-findings.md)
in the repository. They are preserved unchanged in `f2e69c8`. The reviewer reported
no blocking findings and reproduced 51 tests, type checking, complete-branch
whitespace checks, fixture and self-analysis runs, and three representative
validation artifact hashes. The following dispositions are the implementing
agent's investigation and correction, separate from the reviewer's original text.

## 1. File-less diagnostic qualification

No change required: the suggested correction was already present at the reviewed
target. In `src/lib/typescript/project.ts`, `makeContext` calls
`qualifications(sourceFiles, scope === 'configured-project')`. Per-module scopes
are module record IDs, so they pass `false`; only the configured-project context
passes `true`. A file-less diagnostic therefore cannot be copied into every module
context through the alleged branch. The earlier checkpoint disposition correctly
records that fix. This conclusion follows from the actual call site, independently
of whether the current compiler produces file-less syntactic diagnostics.

## 2. Name/compact-ID collision

Corrected locally. Merely resembling `module-<hex>` does not trigger compact-ID
selection: the selector must equal an actual computed ID. Such an exact collision
is nevertheless reproducible with ordinary supported TypeScript input. Discover
one external-module source file, then declare an ambient module whose literal name
equals that source module's compact ID. The ID suffix is derived from the source
module key, so adding the declaration does not require solving a hash preimage.

Before the correction, unscoped lookup of that established name returned no match
with `snapshot-required`. Projection construction now permits the exact current
name lookup without scope. Supplying the current snapshot retains precise compact
ID selection. The named ambient module also remains addressable by its own scoped
ID. Missing scope for an ID without a matching name still requires a snapshot;
explicit stale scope still produces no current match.

The real-compiler regression first failed on the previous implementation and now
passes. It checks the named subject and its context, both precise scoped IDs,
missing scope, and stale scope. The projection method is versioned to `@5`, and
the CLI reference documents the collision behavior. No selector syntax, language
population, presentation layout, or identity-continuity feature was added.

## Verification after correction

- `npm test`: all **52 tests** pass on Node 22.13.1 with TypeScript 6.0.3.
- `npm run check`: passes. Complete-branch whitespace and final diff checks pass.
- Refreshed self-analysis: 174 modules; 349 fully materialized evaluation records
  (one discovery, 174 export, 174 documentation). Requested expansion kinds remain
  exactly `["exports", "documentation"]`. Exact generated-command inspection works.
- Refreshed approved pinned p-queue analysis: seven modules, 15 full evaluation
  scopes, five listed/two collapsed, and the same six entry exports.
- Refreshed eleven exceptional samples, including partial, zero/multiple match,
  documentation truncation, direct/alias source detail, and explicitly synthetic
  unavailable/failed/stopped provider outcomes.
- Compared self inventory, inspection, direct source, alias source, the combined
  exceptional samples, and p-queue inventory against their approved counterparts.
  All six text artifacts are identical after replacing only full snapshot IDs
  and abbreviated snapshot labels. The prior approved artifacts remain intact.

Private, ignored evidence is retained under
`_observations/validation/2026-09-13/post-review/`. It includes the refreshed
artifacts, test/check logs, capture drivers and `manifest.json`. Drivers run from
`_build/` for import resolution. This local evidence is not a repository dependency.

Self snapshot: `snapshot:bad01c29cafaa9abe13685971c0cc0f0ce6b3b5ca64f9ae9ff93863b404b49b2`.
External snapshot: `snapshot:77d9f373180643b09ee72d389be92acaab052b866ac4992a8c8f6a50d1c754fb`.

| Artifact | Bytes | SHA-256 |
| --- | --- | --- |
| `view-final.json` | 2419565 | `287c787f75c36617e1d03fcbaaf4ec622f56c692d7b1f8c2266cb43fb0adf516` |
| `view-final.txt` | 2209 | `f871d54ab5ff1ed9556ecdb25bcccdfbdd68fd7fe5a5934e6ea5d5f20ce633bb` |
| `inspect-final.txt` | 1444 | `1790293db539179e0427e51dfd41b1d93bd6e1a012bea54a0e0851395b04b85d` |

Manifest SHA-256: `5dbb0938f9d65085b5c7b8564c3c40dc2698f81846ba93fb9270cca6026f74ed`.

## Completion judgment and limits

Both review notes are materially resolved; no proposed residual review concern
requires human acceptance. The final independent review covers its stated target,
not the subsequent selector correction. That small correction has implementing-
agent regression and integration verification; no second independent review is
claimed. The required independent-review gate is satisfied.

The [presentation approval](2026-09-13-presentation-approval.md) remains applicable:
ordinary presentation behavior is unchanged and unique expansion kinds remain
verified. No additional presentation review is required. All authorized task gates
are satisfied, so the task can close under task-protocol section 4.

Existing evidence limits remain explicit: the clean agents assessed the original
view, not the final one; the unfamiliar-repository exercise covers one pinned
p-queue revision; unusual execution states use synthetic providers; compiler inputs
are memoized as first observed, not an atomic filesystem snapshot. No fresh external
clone, p-queue runtime/build/test execution, or new clean-agent evaluation was
performed for this correction. No foundation, accepted decision, plan lifecycle,
third-party content, generated build output or real-project observation is changed
or added to Git. Broader product work remains outside this completed slice.
