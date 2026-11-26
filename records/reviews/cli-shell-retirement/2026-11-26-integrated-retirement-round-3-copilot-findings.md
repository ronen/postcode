# CLI shell retirement — final integrated review: Copilot findings

Record type: findings
Received: 2026-11-26
Reviewer: GitHub Copilot
Handoff: [Final integrated review](2026-11-25-integrated-retirement-handoff.md)
Round: 3 (recorded rounds; first Copilot review)
Reviewed target: `3af1c57c406fa07906e6c581210ad3965034ad8b`
Prior findings: [Round 2](2026-11-26-integrated-retirement-round-2-findings.md)

## Retrieval scope

Retrieved the complete PR #15 review submissions, inline review comments and
conversation comments using `gh api --paginate --slurp` for
`repos/ronen/postcode/pulls/15/reviews`, `pulls/15/comments` and
`issues/15/comments`. Each endpoint returned one page: one review, one inline
comment and zero conversation comments. All retrieved review components are
preserved below, without filtering, redaction or text normalization. The labels
and metadata are repository-authored; the source bodies are reviewer-authored.

## Retrieved findings

### Review submission

Author: `copilot-pull-request-reviewer[bot]`
Submitted: 2026-11-26T23:46:26Z
Source: [Review 6081638017](https://github.com/ronen/postcode/pull/15#pullrequestreview-6081638017)

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

The authentication CLI smoke test resolves its executable from the working directory rather than import.meta.url, allowing isolated-build runs to pass against a stale checkout CLI instead of the build under review.

<details open>
<summary><strong>1 open issue</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Resolve CLI smoke-test entry relative to import.meta.url](https://github.com/ronen/postcode/pull/15#discussion_r4714281602) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

Retires PostCode’s human investigation interface while preserving qualified analysis through the internal application API. The remaining CLI provides authentication and help; trial rendering stays separate from application content.

**Changes:**
- Removes the investigation shell, private worker, compact aliases, mechanical Views, observation/feedback implementation, and dependent tooling.
- Preserves exact same-Session references and historical answers, with shared shutdown reporting for terminal interruption and invalidation.
- Moves retained coverage to direct application access and records trial-rendering and lifecycle verification.

| File | Description |
| ---- | ----------- |
| `tsconfig.json` | Includes trial-support TypeScript in compilation. |
| `test/​verification.test.ts` | Removes retired CLI verification cases. |
| `test/​terminal-layout.test.ts` | Removes terminal-layout tests. |
| `test/​temporary-directory.ts` | Extracts reusable temporary-fixture cleanup. |
| `test/​source-evidence.test.ts` | Updates the store adapter for exact references. |
| `test/​session-comparison.ts` | Removes worker-comparison lifecycle support. |
| `test/​request-helpers.ts` | Removes CLI request assertion helpers. |
| `test/​projection-helpers.ts` | Imports application-owned Lens definitions. |
| `test/​processing-index.test.ts` | Checks composition content without Views. |
| `test/​output-boundary.test.ts` | Tests exclusions through direct application opening. |
| `test/​organization.test.ts` | Replaces compact selectors with exact references. |
| `test/​method-provenance.test.ts` | Removes retired Presentation-method coverage. |
| `test/​investigation-usage.test.ts` | Adds direct Session accounting coverage. |
| `test/​foundation-ownership.test.ts` | Removes compact-binding allocation tests. |
| `test/​foundation-identity.test.ts` | Retains exact-selection coverage; removes View checks. |
| `test/​expansions.test.ts` | Verifies resolved content instead of rendered Views. |
| `test/​evidence-access.test.ts` | Uses the extracted temporary-directory helper. |
| `test/​dependency-projections.test.ts` | Tests precise dependency-subject references. |
| `test/​contribution-state.test.ts` | Imports the trial-owned state renderer. |
| `test/​contribution-native.test.ts` | Checks retained support without CLI rendering. |
| `test/​contribution-measurement.test.ts` | Uses the extracted fixture helper. |
| `test/​contribution-application.test.ts` | Uses trial arrangement; removes CLI View assertions. |
| `test/​compiler-candidate-paths.test.ts` | Exercises compiler candidates through direct access. |
| `test/​comparison.ts` | Removes rendered-output normalization. |
| `test/​collection-selection.test.ts` | Removes alias assumptions and uses application requests. |
| `test/​cli-helpers.ts` | Removes investigation CLI test utilities. |
| `test/​benchmark-analysis.test.ts` | Removes obsolete CLI benchmark coverage. |
| `test/​authentication-cli.test.ts` | Adds authentication-only behavior and import checks. |
| `test/​assessment-usage.test.ts` | Uses the extracted fixture helper. |
| `test/​application-services.test.ts` | Removes CLI policy and feedback tests. |
| `test/​application-references.test.ts` | Covers exact references and refusal distinctions. |
| `test/​application-client.test.ts` | Retains complete-content checks without CLI comparisons. |
| `test/​application-boundary.test.ts` | Enforces separation from trial-support imports. |
| `test/​application-assertions.ts` | Adds direct application assertion helpers. |
| `src/​lib/​work-attribution.ts` | Removes CLI-only request and reporting helpers. |
| `src/​lib/​typescript/​project.ts` | Clarifies unchanged handle naming in a comment. |
| `src/​lib/​terminal-layout.ts` | Removes terminal layout implementation. |
| `src/​lib/​subject-resolution.ts` | Resolves exact references without compact bindings. |
| `src/​lib/​source-disclosure.ts` | Removes CLI View disclosure classification. |
| `src/​lib/​shell.ts` | Removes the interactive investigation shell. |
| `src/​lib/​session-worker.ts` | Removes the private compiler worker. |
| `src/​lib/​session-protocol.ts` | Removes worker transport contracts. |
| `src/​lib/​resolution-context.ts` | Removes CLI lookup-presentation support. |
| `src/​lib/​request-catalog.ts` | Removes the CLI request catalog. |
| `src/​lib/​records.ts` | Replaces binding APIs with retained-entity lookup. |
| `src/​lib/​qualification-view.ts` | Removes View-specific qualification shaping. |
| `src/​lib/​qualification-policy.ts` | Retains core prose; removes View classification. |
| `src/​lib/​program-presentation.ts` | Removes mechanical View coordination and rendering. |
| `src/​lib/​presentation-contracts.ts` | Removes retired client Presentation definitions. |
| `src/​lib/​organization/​projections.ts` | Removes group alias allocation. |
| `src/​lib/​organization/​content.ts` | Removes a View compatibility helper. |
| `src/​lib/​module-selection.ts` | Removes module alias allocation. |
| `src/​lib/​memory-store.ts` | Removes binding tables; preserves exact lookup. |
| `src/​lib/​investigation/​usage-presentation.ts` | Removes CLI usage rendering. |
| `src/​lib/​interfaces/​cli/​subject-guidance.ts` | Removes shell-specific reference guidance. |
| `src/​lib/​interfaces/​cli/​runtime.ts` | Removes shared investigation-host assembly. |
| `src/​lib/​interfaces/​cli/​request-reporting.ts` | Removes CLI resolution and usage rendering. |
| `src/​lib/​interfaces/​cli/​report-contracts.ts` | Removes CLI report contracts. |
| `src/​lib/​interfaces/​cli/​methods.ts` | Removes retired Presentation-method identifiers. |
| `src/​lib/​interfaces/​cli/​investigator-policy.ts` | Removes investigation CLI configuration policy. |
| `src/​lib/​interfaces/​cli/​feedback.ts` | Removes CLI feedback publication. |
| `src/​lib/​interfaces/​cli/​answer-presentation.ts` | Removes answer navigation and continuation rendering. |
| `src/​lib/​identity.ts` | Removes compact reference allocation. |
| `src/​lib/​git-execution.ts` | Clarifies ownership wording in a comment. |
| `src/​lib/​exports/​content.ts` | Removes export-selection alias allocation. |
| `src/​lib/​export-view.ts` | Removes export display helpers. |
| `src/​lib/​execution-wait.ts` | Adds cooperative abort-aware waiting. |
| `src/​lib/​execution-errors.ts` | Adds structured shutdown and finalization errors. |
| `src/​lib/​evidence-view.ts` | Removes View-specific evidence shaping. |
| `src/​lib/​diagnostic-view.ts` | Removes CLI diagnostic presentation. |
| `src/​lib/​contributions/​subjects.ts` | Removes compact contribution references. |
| `src/​lib/​contributions/​native-presentation.ts` | Removes native-contribution human rendering. |
| `src/​lib/​contributions/​evaluation.ts` | Makes investigator selection abort-aware. |
| `src/​lib/​contributions/​dialog.ts` | Preserves terminal cleanup and reporting failures. |
| `src/​lib/​composition-view.ts` | Removes composition View helpers. |
| `src/​lib/​cli.ts` | Restricts commands to authentication and help. |
| `src/​lib/​authentication/​commands.ts` | Relocates authentication handling and escapes output. |
| `src/​lib/​application/​retained.ts` | Retrieves historical answers by exact ID. |
| `src/​lib/​application/​requests.ts` | Removes CLI adapter-specific validation helpers. |
| `src/​lib/​application/​reports.ts` | Removes retired alias and refusal fields. |
| `src/​lib/​application/​operation-scope.ts` | Removes private CLI operation hosting. |
| `src/​lib/​application/​observations.ts` | Removes observation transport and file storage. |
| `src/​lib/​application/​lenses.ts` | Updates parameter-capture documentation only. |
| `src/​lib/​application/​index.ts` | Documents shutdown semantics and exports failure types. |
| `src/​lib/​application/​feedback.ts` | Removes feedback preparation and observation conversion. |
| `src/​lib/​application/​contracts.ts` | Removes CLI fields and specifies shutdown guarantees. |
| `src/​lib/​application/​bindings.ts` | Removes coordinated compact bindings. |
| `src/​lib/​answer-references.ts` | Classifies only exact answer-reference syntax. |
| `src/​cli.ts` | Drops investigation checkout context. |
| `scripts/​structured-accounts/​run-trial.mjs` | Imports trial-owned answer arrangement. |
| `scripts/​profile-contribution-memory.mjs` | Uses the extracted build-identity helper. |
| `scripts/​profile-analysis.mjs` | Removes CLI/worker profiling tooling. |
| `scripts/​probe-session-interruption.mjs` | Removes shell interruption probing. |
| `scripts/​probe-compiler-interruption.mjs` | Removes worker interruption probing. |
| `scripts/​module-investigation/​verify-configuration.mjs` | Removes legacy assessment configuration verification. |
| `scripts/​module-investigation/​questions.json` | Removes CLI View evaluation questions. |
| `scripts/​module-investigation/​injected-setup.mjs` | Removes legacy assessment injection support. |
| `scripts/​module-investigation/​assessor-rubric.json` | Removes the legacy View assessment rubric. |
| `scripts/​measure-partial-session.mjs` | Removes CLI-shaped partial-session measurement. |
| `scripts/​measure-contribution-session.mjs` | Uses the extracted build-identity helper. |
| `scripts/​measure-analysis.mjs` | Removes historical CLI measurement tooling. |
| `scripts/​comparison-fixtures.mjs` | Removes CLI comparison fixture utilities. |
| `scripts/​compare-session-requests.mjs` | Removes direct-versus-worker View comparisons. |
| `scripts/​compare-analysis.mjs` | Removes historical CLI build comparisons. |
| `scripts/​build-identity.mjs` | Extracts build hashing for retained tools. |
| `scripts/​benchmark-analysis.mjs` | Removes the CLI benchmark series driver. |
| `scripts/​assess-human-output.mjs` | Removes hosted CLI View assessment. |
| `records/​validation/​cli-shell-retirement/​baseline/​ordinary-0-0.txt` | Captures baseline text diagram output. |
| `records/​validation/​cli-shell-retirement/​baseline/​ordinary-0-0.svg` | Captures baseline SVG diagram output. |
| `records/​validation/​cli-shell-retirement/​after/​ordinary-0-0.txt` | Records added alternative qualification disclosure. |
| `records/​validation/​cli-shell-retirement/​after/​comparison.json` | Records checked retirement differences. |
| `records/​validation/​cli-shell-retirement/​after-review-round-1/​fresh-1-0.txt` | Records the identified second alternative. |
| `records/​validation/​cli-shell-retirement/​after-review-round-1/​fresh-0-0.txt` | Records the identified first alternative. |
| `records/​validation/​cli-shell-retirement/​after-review-round-1/​comparison.json` | Records comparison after rendering corrections. |
| `records/​tasks/​2026-11-25-cli-shell-retirement.md` | Records task scope and authorized follow-ups. |
| `records/​reviews/​cli-shell-retirement/​2026-11-25-terminal-lifecycle-disposition.md` | Records lifecycle dispositions and verification evidence. |
| `package.json` | Removes the terminal-width dependency. |
| `package-lock.json` | Updates lockfile metadata and removes width dependencies. |
| `docs/​README.md` | Separates internal capabilities from authentication syntax. |
| `docs/​decisions/​terminal-session-invalidation.md` | Records shared invalidation and abort finalization. |
| `docs/​decisions/​README.md` | Indexes the terminal-finalization clarification. |
| `docs/​decisions/​cli-shell-retirement.md` | Records partial supersession of abort-only wording. |
| `docs/​backlog.md` | Updates retired-facility context and opening-failure gaps. |
| `docs/​architectural-constraints.md` | Adds binding invalidation-finalization requirements. |
</details>

<sub>Review effort: Balanced</sub>

### Inline review comment

Author: `Copilot`
Created: 2026-11-26T23:46:26Z
Location: `test/authentication-cli.test.ts`, line 25 at `3af1c57c406fa07906e6c581210ad3965034ad8b`
Source: [Comment 4714281602](https://github.com/ronen/postcode/pull/15#discussion_r4714281602)
Review: `6081638017`

Please resolve this child entry relative to `import.meta.url`, as required by `docs/implementation-conventions.md:44` and demonstrated in `test/contribution-measurement.test.ts:16`. When this test runs from an isolated compiled build while the working directory remains the checkout, `_build/src/cli.js` executes the checkout's CLI instead of the CLI under review; the help assertion can therefore pass against a stale build. Resolving `../src/cli.js` from this test keeps the smoke check tied to its own build.
