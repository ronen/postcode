# Module inventory continuation: seventh-round disposition and handoff

Date: 2026-09-13
Status: corrections verified; awaiting human-arranged Copilot rereview
Correction/review target: `e89d741ff4d2b6f9b077c61a6b5460629e3b3bde`
Reviewed predecessor: `fbea319ba7ee2705fc98d41a758e2dd79db621c7`
Pull request: [#1](https://github.com/ronen/postcode/pull/1)
Task: [active continuation](../tasks/2026-09-13-module-inventory-review-continuation.md)
Previous handoff: [sixth Copilot disposition](2026-09-13-module-inventory-continuation-round-6.md)

## Review and dispositions

Paginated GitHub CLI retrieval returned eight review entries, eleven inline
comments overall and no conversation comments. The two new review entries are a
[quota-limit notice](https://github.com/ronen/postcode/pull/1#pullrequestreview-5192140380)
and the subsequent [completed review 5192259666](https://github.com/ronen/postcode/pull/1#pullrequestreview-5192259666),
both on `fbea319`. The completed review is `COMMENTED`, recommends changes,
and reports 74/80 files reviewed at Balanced effort. It has one new inline finding
and one previously missed suppressed finding. Both are accepted within the
[approved plan](../../docs/plans/initial-module-inventory-plan.md) and its three
accepted decisions. Authorization was committed as `da09b69` before implementation.

| Finding | Correction and verification |
| --- | --- |
| [Missing symlink descendants](https://github.com/ronen/postcode/pull/1#discussion_r4000907273): an absent generated file reached through a symlink is recorded as a negative input, then disappears from captured inputs when it becomes excludable. | Resolve the nearest existing ancestor and append the unresolved suffix before containment checks. The full-project regression keeps snapshots, claims and contexts identical through missing-directory, directory-created, leaf-created, changed and removed stages. A separate non-excluded symlink still admits a new source and changes the snapshot. |
| Summary, `src/lib/typescript/project.ts:50`: diagnostic projection discards occurrence locations, leaving equal messages indistinguishable. | Include diagnostic file and one-based line/column in failure messages when TypeScript supplies them. Deduplication still operates on the original occurrence data. Root/inherited errors remain single reports; equal messages in distinct files or positions now identify their respective locations. Multiline and control-bearing config paths verify coordinates and safe stderr output. |

The returned diagnostic shape remains `{ code, message }`; no unsupported location
is invented. A diagnostic without source location retains its existing message.
Operational project-open failures remain separate from conceptual views and emit
no misleading observation. Input/discovery methods advance to `observed-inputs@2`
and `typescript-modules@8`, producing new snapshot IDs. No dependency, governing
revision or unrelated capability was added. No disagreement or unresolved
unforeseen issue arose.

## Verification and limits

- `npm test`: **73/73 passed**; `npm run check`: passed on Node 22.13.1 / TypeScript
  6.0.3. The symlink regression and initial location assertions failed before fixes.
- Regenerated fixture evidence records one snapshot across absent/created/removed
  excluded descendants, two located inherited-config diagnostics, and the unchanged
  fallback for an unavailable config with no source position.
- The full passing suite preserved all 211 existing top-level checkout observation
  batches by name/content hash, added none and leaked no temporary test directories.
- Full-branch whitespace, changed-document links, evidence hashes and preservation
  of completed task/governing records checked. Subsequent handoff/checkpoint commits
  contain metadata only.

Seven evidence files and their manifest are retained under the ignored
`_observations/validation/2026-09-13/continuation-round-7/`. Manifest SHA-256:
`ea5e43530b75807b1b12cc5d37bbca374f9a32f8ea2ea454fe5de79f438c9dbe`.
Real-project captures, clean-agent exercises and human presentation review were not
repeated. Earlier evidence is preserved; local artifacts are optional, not repository
dependencies. Input capture remains first-observed rather than atomic.

## Next review gate

Have Copilot assess ancestor resolution for missing generated descendants, retained
visibility of non-excluded inputs, and diagnostic locations alongside occurrence
deduplication and terminal escaping. Reproduce with `npm test` and `npm run check`.

The human arranges and returns the next review. The continuation remains **active**;
no rereview acceptance is claimed. Resolve returned in-scope defects and close only
when no actionable findings remain or the human explicitly accepts residual concerns.
