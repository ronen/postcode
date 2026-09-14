# Presentation approval and expansion-list correction

Status: approved under the human's explicit conditional authorization
Date: 2026-09-13
Implementation: `a2e7bb30d1215717ab609d96c3eb0394efd31cb8`
Task: [initial module inventory](../tasks/2026-09-12-initial-module-inventory.md)

The human pre-approved the final correction and explicitly authorized presentation
approval when tests pass and regenerated JSON contains unique requested expansion
kinds. Both conditions are satisfied. No additional presentation approval or
presentation review is required. Final independent integrated implementation
review remains a separate required task gate.

## Correction and verification

Projection construction now deduplicates requested expansion kinds in first-request
order. Presentation exposes that unique list; no per-module evaluation records
are removed or consolidated. The regression checks inventory, one selected module
and zero matches, asserting the exact JSON list and preserving scoped evaluation
identities, module subjects, execution and materialization states. The projection
method version is incremented; the CLI reference describes the field's scope.

All 51 automated tests and `npm run check` pass. Separate-process determinism,
source scope, identity, qualifications and observations remain covered. Complete
branch whitespace checks pass.

Regenerated `view-final.json` explicitly verifies:

```json
"expansions": ["exports", "documentation"]
```

It retains 174 modules and 349 full evaluation records: one module-discovery
outcome, 174 export outcomes and 174 documentation outcomes. The two expansion
kinds no longer encode per-module repetition. Self Unicode and JSON share the
snapshot, and the generated inspection command selects the intended module.

The approved pinned p-queue recheck retains seven modules, 15 full scopes, the
unique expansion list and all six entry exports. Eleven exceptional samples,
including direct and forwarding/alias source expansions, are refreshed. These
checks exposed no additional substantive issue.

## Retained evidence

The private, ignored directory `_observations/validation/2026-09-13/` contains:

- `view-final.json` / `.txt` and `inspect-final.txt`;
- `source-final.txt` and `source-chain-final.txt`;
- `exceptions-final.txt` and `exceptions-final-cases.json`;
- `p-queue/unicode-final.json` / `.txt` and `p-queue/inspect-final.json`;
- `presentation-approved-manifest.json`, recording hashes, sizes and snapshots.

Self snapshot: `snapshot:0a4990bbf6a01bcc53f3d1ef9d758f6842c2a2543f18d635a2423fd872f76f18`.
External snapshot: `snapshot:5f0aa3ff4af28cbcf8d44dca8222539a34aec52005991e101d3b4271e139f914`.

| Artifact | Bytes | SHA-256 |
| --- | --- | --- |
| `view-final.json` | 2419565 | `c99a9ee3af898773fc0df063724e4fd269df855e6f49f8764e45fbe3c7f9de66` |
| `view-final.txt` | 2209 | `4a02560760e5c395da50f894b8c649c9a5dd1a98acb0dfd78472db30b63f8eed` |
| `inspect-final.txt` | 1444 | `f1c0dacdd3512b573bf148b0f04868960851af722661ae4b825ab24b4d972f1b` |

Manifest SHA-256: `d74dd0d09e1869870650bd126b26d4d02bb49d1df7eac2f876744286a50d9dfd`.

Earlier samples remain intact. Capture/refresh drivers are retained locally and
run from `_build/` for import resolution. Normal CLI samples use local observation
delivery; synthetic provider cases are labeled and do not claim CLI batches.
Real-project observations and third-party repository contents remain uncommitted.

The presentation gate is cleared. The task remains active for final independent
integrated review and disposition of its findings; it is not yet closed.
