# Integrated application boundary verification

Date: 2026-11-09
Task: [Application interface boundary](../../tasks/2026-11-08-application-interface-boundary.md)
Plan: [Application interface boundary](../../../docs/plans/application-interface-boundary.md)
Implementation: `e7de4b1ba5a222c0facc9b376c5a8c5b582e1386`
Original baseline: `815f2378a5e6f2d4ca36884e4a8547a42f6c49ca`
Post-provenance extraction baseline: `b4dc07b`
Final emitted-source SHA-256: `b540490f0de1f9f4f3264fe4732b5f78134e9e874ffa1db7c679bf15c1d81867`

## Integrated result

M1–M3 implementation is integrated behind the intended internal application entry and independent account, observation and feedback services. M4 adds a small intended-entry client, same-fixture direct/CLI assertions, lifecycle TSDoc and current documentation. It changes no production execution behavior or method versions. The CLI reference now explicitly distinguishes completed application work from later presentation/command failure, retains observation format version 4, and documents unknown-continuation exit 3. The architecture, capability and status descriptions identify the internal Node boundary and preserve its limitations.

The [small client](../../../test/application-client.ts) imports production functions and types only from `application/index.ts`. It opens one project, reads captured capabilities, requests inventory, repository organization, dependencies, precise inspection and interpretation, follows a precise Investigram, retrieves the earlier exact answer, reads usage, awaits close and checks typed post-close refusal. It supplies no CLI parser, Presentation, terminal writer or sink. Work, attempt progress and final reports are frozen and structured-cloneable. Its [integration test](../../../test/application-client.test.ts) runs real compiler/repository work with `ScriptedInvestigator` and compares the same fixture against stable `runCli` Unicode/JSON output. Direct content retains 65 exports and full documentation, 75 dependency occurrences and their organization support, at least 30 associations and 26 revision rows. CLI displays preserve matching answer identity, exact recorded output and truthful export/documentation/occurrence omissions.

## Checkpoint preservation and identity

The separately recorded [method-provenance checkpoint](provenance-checkpoint.md) remains unchanged: original `815f237` to `b4dc07b`, advancing only observed-inputs to 7 and program-records to 23 while separating three client Presentation methods. Its [reference-mapping evidence](method-transition.json) is preserved, not rewritten around extraction.

The extraction comparison now runs from the same post-split build (emitted-source SHA-256 `70d8d8bebfe283fc06e770300df52ee3fe267a5e99cc8eaa95ebc6f998b62c02`) to the final digest above. [Integrated comparison evidence](integrated-comparison.json) preserves 21 stable CLI cases and 60 deterministic journey/allocation cases. No method-split flag is used for extraction. No semantic digests, aliases, qualification, ordering or identity inputs are discarded. The sole approved comparison adjustment remains unknown-continuation application work/finish changing from failed to completed while CLI failure is retained. Journey entry selection preserves the baseline's old module and the final build's migrated entry, rather than retargeting both builds.

The method registry and artifact provenance were inspected separately from imports. `typescript/project.ts` captures the application registry plus provider/repository methods; the three Presentation versions reside in `interfaces/cli/methods.ts`. The CLI adapter adds only the methods responsible for the actual artifact. `method-provenance.test.ts` changes only a client method while holding application methods and fixture inputs fixed, compares complete selected support and Evaluation/input identities, and observes a changed View identity/artifact method. Changing an application method still changes input and answer identity. File moves after the provenance checkpoint introduce no method bump or further allowed identity transition.

## Verification matrix

All paths below are relative to the repository; tests are executable TypeScript sources compiled by the ordinary build. Existing assertions were retained rather than replaced by the new client test.

| Plan criterion | Distinguishing evidence |
| --- | --- |
| Direct API and complete content | `application-client`, `application-boundary`, `application-journey`, `projection-content`: intended-entry-only client; complete exports/documentation, occurrences, associations/revisions and fixed support; plain cloneable results; same-fixture CLI bounds. |
| Qualified resolution | `application-lifecycle`, `request-model`, `request-designation-input`, `subject-resolution`, `presentation-compatibility`: missing/ambiguous/incompatible subjects, precise and bound targets, rejected/accessor input, invalid parameters, retained refusal pointers, empty/partial/unavailable content. |
| Fresh versus exact | `application-journey`, `retained-presentation`, `application-exact-compatibility`: A→B/A→C/B→D correction conflicts, reconsideration and composites; full prior answer equality; original/replacement access; selection/Evaluation/store-write/inference tripwires on exact access. |
| CLI compatibility and consumption | `application-client`, `retained-presentation`, `investigation-selection`, `human-output`, `shell`, `source-disclosure`; stable CLI and journey oracles: both hosts/formats, more detail, reference lifetime, malformed/unknown/out-of-range continuations, no page reconstruction from bounded JSON. |
| Compatibility planning | `presentation-compatibility`, `application-lifecycle`, `application-exact-compatibility`, `exports-lens`: pre-lookup and resolved-family refusal, captured declarations, fallback acquisition before Evaluation, explicit options, raw subsets and exact missing-support refusal. |
| Lifecycle and faults | `application-lifecycle`, `application-cli-outcomes`, `execution-ownership`, `session-inputs`, `output-boundary`, `work-attribution`: single operation guard, busy refusal, scope expiry, close during completed work, pre/post checks, withheld versus emitted output, late callbacks/replies, provider failure, cleanup ownership and retained final usage. |
| Binding and identity | `answer-identity`, `method-provenance`, `retained-presentation`, `investigation-selection`; 60 ordinary/collision cases: precise-ID journeys, separate aliases, whole-population/mechanical/association allocation schedules, operation-local validation/revocation and transported arrangement key. |
| Companion services | `application-services`, `chatgpt-auth`, `chatgpt-investigator`, `openai-investigator`, `feedback`, `observation-publication`, `assessment-budget`: offline account/check operations, no automatic billing fallback, feedback context and failed-display replacement, atomic batch publication, delivery and cleanup warnings, real controlled shell with token/fetch tripwires. |
| Progress and lifecycle types | `application-client`, `application-lifecycle`, `work-attribution`, `execution-ownership`: onWork/onProgress/onReport, caller correlation, frozen snapshots, mutation/accessor refusal, late-progress suppression, distinct lifecycle failures and final accounting. |
| Method identity separation | `method-provenance`, complete comparison evidence and registry/adapter inspection described above; application captures omit Presentation methods and delivery adds responsible client methods. |
| Reports and attribution | `request-model`, `work-attribution`, `application-cli-outcomes`, both comparison oracles: normalized context and parent reconstruction, full associated-inspection work, parser versus programmatic refusals, direct/deferred invalidation and exact outcomes. |
| Outcome separation | `application-cli-outcomes`, `application-lifecycle`, `retained-presentation`: unknown continuation retains exit 3 and command failure while work is completed; arrangement throws do not undo work; no false displayed snapshot; malformed syntax is refusal and historical failure remains historical. |
| Script consumers | M3 migration/measurement record, M4 syntax/named-export linkage audit and controlled shell in the full suite; stable/current versus historical checkpoint paths remain distinguished. |
| Architectural dependency | `application-boundary` traverses runtime, dynamic and type imports from the application and all companion entries. Manual tracing confirms one `requestExecutor` under `openApplication`, shared CLI worker/in-process composition, and no old session shim or CLI-owned semantic engine. Worker composition remains outside the neutral graph. |

## Commands and results

- `npm test -- --test-concurrency=2`: **664/664 passed**, zero failures, skips or cancellations. This runs the repository's build and full test script, limiting concurrent test files to two. The offline suite ran on Node.js 26.11.0 with TypeScript 6.0.3 and local loopback access for authentication fixtures.
- `npm run check` and `git diff --check`: passed on the final change.
- The new same-fixture client/CLI integration test also passed independently before the full run.
- `compare-application-boundary.mjs POST_SPLIT_BUILD FINAL_BUILD REPORT`: **21/21 passed**, through each build's stable `src/lib/cli.js` `runCli` entry, covering representative Unicode/JSON and resolution/usage/disabled-investigation output.
- `compare-application-journey.mjs POST_SPLIT_BUILD FINAL_BUILD REPORT`: **60/60 passed**, both hosts with ordinary and forced-prefix collisions. The committed JSON preserves comparison cases and allocation traces, without machine-specific build paths.
- Current-build script syntax and named-export linkage: **14 live/assessment entry points, 19 built named exports resolved**; all removed mixed-responsibility/generated shim modules absent. No inference-starting assessment entry point was imported to test linkage.
- The full suite repeats the transitive runtime/type dependency checks, method-provenance mutation checks, real controlled offline shell, account/check fixtures, and lifecycle/ownership tests described in the matrix.

M3's [service and script record](m3-checkpoint.md) additionally preserves 288 live View/output comparisons, eight exact service-output baseline comparisons, 11 direct/11 shell measurement requests, profiler execution, both 80,000-declaration interruption probes and 40 clean/partial repository-sized reuse checks. M4 changes only tests, TSDoc and documentation; those runtime checks are retained rather than repeated without cause. The current-build linkage audit and controlled shell were repeated for integration.

## Limits and review state

No live credentials, paid inference or external investigation assessment were used. Authentication fixtures require local loopback access; hosted production credential availability is not claimed. Measurements are descriptive, not performance guarantees. The boundary remains internal Node code for a single configured unchanged-input project: no browser runtime, public transport, persistence, generic display history, research/feedback decoupling or complete captured-basis observation export is introduced. Synchronous compiler work in a direct caller cannot be preempted on that same thread; CLI cancellation still uses its worker.

These are implementing-agent checks. The task remains active for the final integrated review and any resulting corrections. Passing tests or a clean reviewer report does not authorize closure or merging; the human determines when the review gate is sufficient.
