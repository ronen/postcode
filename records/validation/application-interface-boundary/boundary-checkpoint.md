# Application boundary slice verification

Date: 2026-11-09
Implementation: `94f3c5046115687205b695aafa33bba9c35fef96`
Extraction baseline: `b4dc07b` (post method-provenance split)
Task: [application interface boundary](../../tasks/2026-11-08-application-interface-boundary.md)

This is implementing-agent verification for the plan's M1 boundary slice, not an independent review or completion of M2–M4. The preceding [method checkpoint](provenance-checkpoint.md) remains separately identifiable. No method version changed during extraction.

## Implemented slice

The intended entry is `src/lib/application/index.ts`. It returns explicit semantic request/result types, immutable plain selected content and fixed support, captured capabilities, work/attempt reports, and typed lifecycle errors. Direct inventory, precise module inspection and exact retrieval run without parser, renderer, terminal or observation sink. Associated inspection delivers its composite and mechanical support. Standard defaults and supported subsets belong to application coordination; exact retrieval cannot acquire absent support.

The shared executor was extracted as a whole to avoid parallel semantic execution paths. Existing families therefore already route through it, but broader direct investigation continuity and companion-service conformance remain later milestones. The worker and in-process test host use `interfaces/cli/application.ts`. The former `session.ts` is only a temporary forwarding import for live assessment scripts; it contains no execution implementation or public deferred-check option. Migration/removal of this import and consolidation of lower-level legacy Presentation helpers remain M3 work.

Application context keeps captured client fields separate, including generating-parent and attempt contexts. The CLI adapter reconstructs the prior serialized request shape. Structural facts about conflicting CLI designation fields and usage inputs enter shared validation through the trusted composition seam; the attachment itself cannot select work. Runtime/type dependency traversal covers static, dynamic and import-type edges from the intended entry and rejects CLI/View/terminal dependencies.

Mechanical aliases are supplied as plain entries. Investigation arrangement receives a validated operation-local port. Work finalizes before arrangement, while the operation guard remains held. Direct execution retains pre/post-work checks; worker publication transfers final checks to the parent shared publication guard. In-process CLI delivery uses local guarded composition. Unknown continuation still produces command failure/exit 3 with completed application work.

## Comparison evidence

[Boundary comparison data](boundary-comparison.json) identifies both emitted source digests and preserves the allocation traces and outcomes. Baseline source digest: `70d8d8bebfe283fc06e770300df52ee3fe267a5e99cc8eaa95ebc6f998b62c02`. Final source digest: `33590e52f979721b7639179b7a45cb7f2f608cbbe5009b1c927f44bea5d317bb`.

- 21 stable `runCli` comparisons passed: mechanical Unicode/JSON variants, missing-subject resolution, usage and disabled investigation. The oracle compares complete output layout, report field order, records/events and exact same-kind digests and aliases after occurrence/Session correlation. It uses no method-split allowance.
- 60 deterministic journey cases passed: 15 requests in each combination of in-process/worker host and ordinary/forced-prefix-collision fixture. UUID and attempt-clock sources are fixed equally in both builds. The collision fixture gives every hex digest the same initial eight characters while retaining its remaining digest; both builds still use the production append-only allocator. Every allocation call, batch order, precise ID, spelling, complete View/output, context/parent and work-progress event is compared by serialization.
- The journey covers inventory, precise mechanical inspection, exact aliases/IDs, accepted interpretation, historical Investigram inspection, association paging, old exact content after new interpretation, usage, malformed parameters, extraneous report inputs and conflicting designations. The only comparison adjustment is the approved `failed` → `completed` application work/finish status on unknown continuation. Both CLI results remain failed; separate both-host tests verify exit 3 and `command-failed` observations.

The deterministic oracle controls test-only occurrence sources; it does not redact semantic references or relax field/array order. The separate stable CLI oracle uses ordinary runtime occurrence sources. No live credentials or paid inference were used.

## Checks

- `npm run check` and `git diff --check`: passed at the implementation target.
- Full offline suite: 638 tests passed on the preceding extraction build, emitted source digest `d35ec44f4f57f47ed5c6bd7264ee1702aebe42715d26e6a040938bce10b3d832`. Loopback authentication fixtures required execution outside the filesystem/network sandbox. An earlier sandbox run failed those local-server fixtures; the unrestricted offline rerun passed all 638 tests.
- Final refinements after that full-suite build: preserved invalid-input report field order, froze work callbacks, validated plain catalog data, rejected undeclared opaque options, and added boundary coverage. All 51 focused tests passed on the final digest above: application boundary/lifecycle/CLI outcomes, Presentation compatibility, Lens extensions and exports. The 21 CLI and 60 journey comparisons also use this final build.
- An earlier 71-test focused lifecycle/request suite passed, including cancellation accounting, both-host designation handling, pre/post publication checks and direct pre/post-work check counts. Cancellation retains the final attempt report after invalidation instead of leaving a running usage report.

Direct tests cover caller mutation, omitted accessor fields without executing getters, malformed/missing/incompatible input, complete/partial/empty content, subset/default support, immutable structured cloning, exact-access denial of selection/Evaluation, typed busy refusal, operation-port expiry, whole-batch/wrong-kind validation, arrangement failure after completed work, and post-work invalidation before completion. Existing identity/provenance and opening/exclusion/cleanup assertions remain in the migrated test corpus.

To reproduce comparisons, emit the baseline and target into separate build directories in a checkout with installed dependencies, then run `scripts/compare-application-boundary.mjs BEFORE_BUILD AFTER_BUILD REPORT` and `scripts/compare-application-journey.mjs BEFORE_BUILD AFTER_BUILD REPORT`. Do not pass `--method-split` for extraction. The build digests cover emitted `src/` files; temporary paths and logs are not the durable evidence.

## Remaining scope

The required intermediate review must assess the dependency, capture, precise-content, binding and publication contracts before broad migration. M2's full direct investigation/revision/conflict journey, M3's account/configuration and observation/feedback service split and live-script migration, and M4's final integrated verification/documentation remain. This checkpoint makes no claim that those milestones or the full governing boundary have been completed.
