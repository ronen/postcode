# M2 information and exact-answer operations

Date: 2026-11-09
Task: [Application interface boundary](../../tasks/2026-11-08-application-interface-boundary.md)
Plan: [Application interface boundary](../../../docs/plans/application-interface-boundary.md)
Implementation: `aa84ed8208948210b51c5f34b7775c5e05a33c4d`
Prior M1 implementation: `9202fcedb76acca1cc2c0a9598b324672119bb91`
Extraction baseline: `b4dc07b`
Baseline emitted-source SHA-256: `70d8d8bebfe283fc06e770300df52ee3fe267a5e99cc8eaa95ebc6f998b62c02`
M2 emitted-source SHA-256: `e79f617a6d645deaa7b9a97578ee350c7c615fc34001f19cc2330bd5210cc47b`

## Implementation and scope

The human accepted the M1 review gate and directed progression to M2. The decision is preserved in the task follow-ups and [M1 disposition](../../reviews/application-interface-boundary/2026-11-09-m1-boundary-disposition.md); the review findings and handoff remain unchanged.

M1 moved the executor's family branches together to avoid creating parallel semantic engines. M2 establishes direct operation coverage for organization, dependency structure/children/parents, group/mixed/Investigram inspection, interpretation requests and follow-ups, resolution, usage, and exact retrieval. These operations reuse the existing constructors, fixed content resolvers, Evaluation and investigator bridge. The nonpublic interpretive and exports catalogs use the same machinery, without facade-specific branches or CLI Presentation declarations.

The direct dependency subset test exposed an unconditional organization expansion: `{ modules: [], groups: [] }` still constructed dependency organization detail. The shared dependency constructor now acquires that optional detail only when `group-details` is requested. Subset results retain the existing null organization-support pointer; subsequent exact requests requiring those missing details are refused rather than enriched. Tests also verify that no organization Evaluation work is charged for the subset. Default CLI requirements still include the expansion.

This correction changes coordination of declared requirements, not record formats, identity formulas or underlying analysis methods. The existing nullable expansion contract already represents the narrower answer. No method version changes or new comparison allowances are needed. The ordinary CLI and retained allocation behavior remain equal to the post-provenance baseline. The [implemented architecture](../../../docs/architecture/README.md) now describes the completed information operations and the remaining service migration.

## Direct journey evidence

[Application journey tests](../../../test/application-journey.test.ts) call the intended application entry and receive full plain content without a CLI renderer or sink. They use real compiler/repository fixtures and replace only investigator communication with `ScriptedInvestigator`.

- Mechanical requests cover project/repository organization, dependency directions and qualified source support, group-only inspection with empty embedded module detail, mixed group/module inspection, composite versus bare mechanical identity, supported subsets, missing subjects, incompatible subjects and usage.
- The interpretive journey obtains modules, resolves a subject, retrieves real source evidence, validates and retains the submitted account, and follows a precise Investigram. Seven investigations accumulate dependent accounts, explicit associations and corrections along `A → B`, `A → C`, then `B → D`. Fresh selection chooses D while retaining the conflict and displaced original composition. The journey verifies direct and transitive reconsideration, the correcting evaluation's exemption, and a later account's complete-correction context without erasing the older subject's status.
- Earlier operation, historical-inspection and mechanical-composite answers remain equal after accumulation. Exact retrieval compares the whole selected answer, including content, identity, support, provenance and revision/association snapshots. Store writes, Evaluation/history enumeration, subject-alias lookup and investigator opening are disabled during these checks; attribution contains fixed-content consumption only, with no new evidence queries or usage.
- Nonpublic interpretation lenses share operation reuse and original provenance across distinct Lens identities. The exports fixture supplies its qualified exports/documentation through the same direct and exact operations.
- Failed and configuration-unavailable investigation answers remain exactly retrievable with their historical outcomes unchanged, completed current retrieval work and no new inference. Unknown, foreign and wrong-kind exact targets produce typed resolution results preserving the supplied request.

Existing CLI, constructor, selection, revision, qualification and retained-presentation tests retain their behavioral assertions. This adds direct-boundary coverage rather than replacing those tests with a facade smoke test.

## Verification

- `npm run build`, `npm run check`, and `git diff --check` passed.
- All five new direct journey tests passed.
- The full offline suite, `node --test --test-concurrency=2 _build/test/*.test.js`, passed **659/659 tests**, with no skips, failures or environment exceptions. Local loopback access was enabled for existing authentication fixtures.
- `compare-application-boundary.mjs` passed all **21 stable CLI cases** against the post-provenance baseline.
- `compare-application-journey.mjs` passed all **60 retained-answer/allocation cases**, covering in-process and worker hosts with ordinary and forced-prefix-collision fixtures.
- Both comparisons identify the emitted-source digests above. Their comparison policy and scripts are unchanged; extraction used no method-split allowance. The full suite also includes the transitive runtime/type dependency test from the intended application entry.

No live credentials or paid inference were used. These are implementing-agent checks, not a new independent review or human acceptance of later milestones. M2 is complete; M3 companion services, CLI/script consolidation and M4 integrated verification/documentation/review remain within the active task.
