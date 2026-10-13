# Fixed operation definitions and interpretation extension: round 2 findings

Record type: findings
Received: 2026-10-13
Reviewer: Claude Opus 5.5 (Claude Code), independent session with no implementation involvement (also the round-1 reviewer)
Handoff: [2026-10-13-operation-definitions-handoff.md](2026-10-13-operation-definitions-handoff.md)
Round: 2 (narrow re-check of catalog rejection cases, as recommended in round 1)
Reviewed target: d61bccf00c0ce2777b3e2ccdba000db45a337775 (corrections `300c5a7..d61bccf`, branch `codex/lens-request-model`)
Prior findings: [2026-10-13-operation-definitions-round-1-findings.md](2026-10-13-operation-definitions-round-1-findings.md)
Prior reviewed target: 300c5a7e4c1d310d8177d24c24590c5c5aad6368

## Returned findings

### Method

- Read the [disposition](2026-10-13-operation-definitions-disposition.md) and the correction diff:
  - `captureCatalog` in `request-catalog.ts`;
  - the new rejection table and acceptance test in `lens-extensions.test.ts`;
  - the architecture note in `docs/architecture/investigation.md`.
- Confirmed that `HEAD` (`a5bcdc8`) differs from `d61bccf` only in records (`git diff d61bccf HEAD -- src test fixtures package.json` is empty).
- Extracted `d61bccf` with `git archive`, built it in the scratchpad, and reran the round-1 catalog probes against a temporary two-module project. I also probed further edge cases. Nothing was written to the repository.

### Verification performed

- `npm run check`: passed.
- `npm test` (loopback permitted, repository inputs held stable): 558 tests, 558 passed. The disposition notes that the implementer ran only a focused set of tests for the correction, so this is the first full-suite run of the corrected target.
- Round-1 probe cases at `d61bccf`. Each is now rejected when the Session opens, before the project is acquired:

| Case | Round 1 (`300c5a7`) | Now (`d61bccf`) |
|---|---|---|
| `modules` with dependency requirements | `TypeError` during execution | Rejected: altered mechanical definition |
| `modules` with module subjects/collection | Modules View for a module designation | Rejected: altered mechanical definition |
| `summarize` replaced by the `modules` definition | Organization View labeled `summarize` | Rejected: altered mechanical definition |
| Interpretation Lens named `children` | Shadowed by `dependency-children` | Rejected: reserved identity |
| Interpretation Lens named `usage` | Shadowed by the usage report | Rejected: reserved identity |
| Interpretation Lens declaring `depth` | Parameter recorded, then dropped; answer reused across values | Rejected: requires an empty parameter object |

- Additional edge cases:
  - a mechanical definition with an extra unknown field is rejected, because the canonical comparison covers the whole definition;
  - `explain` changed to module subjects is rejected as an incompatible interpretation definition;
  - a catalog that omits a built-in Lens is accepted, and the `dependencies` command spelling then becomes an ordinary refusal ("does not identify a registered Lens or report") rather than a defect;
  - a built-in interpretation Lens retargeted to another interpretation operation (`summarize` → `risks`) is accepted. This is the intended interpretation-extension path, and it uses the shared machinery that round 1 assessed.

### Actionable findings

None.

- **F1 is resolved.** Any entry that is mechanical, or that replaces a built-in mechanical Lens (including inspection), must equal the built-in definition canonically. The comparison does not depend on property order. New mechanical identities, changed policy, mechanical replacement of interpretation Lenses, and the reverse are all rejected. The rejection is tested both through `captureCatalog` and through `openSession`, without a valid project.
- **F2 is resolved.** `usage` and the command spellings that map to a different Lens identity (`dependencies`, `children`, `parents`) are rejected. Self-mapping spellings remain valid.
- **F3 is resolved.** Interpretation definitions must declare an empty plain parameter object, and a malformed container is rejected. Mechanical parameter changes fail the F1 equality check.

### Non-defect observations

- The store-validation observation from round 1 remains as the disposition describes it. Validation no longer ties a selection's `lens` to its operation, and that weakness matters only for hand-built or corrupted records. Construction enforces the Lens declaration.
- The canonical-equality boundary is deliberately temporary. The planned mechanical constructor/Presentation assembly will need to replace it with real support for honoring declared requirements, rather than relaxing it.

### Unverified areas and residual limits

- Non-default catalogs still have no worker/CLI seam, so I did not exercise them there.
- I did not fuzz malformed catalogs beyond the cases listed above.
- I did not exercise hosted investigators.
- The remaining plan work is outside this re-check.
- The historical intermittent CLI failure did not recur; its cause remains unconfirmed.

### Recommendation for this intermediate gate

All round-1 findings are corrected. The catalog seam now rejects at assembly every definition that execution cannot honor, and the full suite passes on the corrected target. Together with the round-1 assessment of reuse, provenance, the selection contract and the interpretation extension, I consider the checkpoint suitable for continuing. Whether the gate is sufficient remains the human's decision.
