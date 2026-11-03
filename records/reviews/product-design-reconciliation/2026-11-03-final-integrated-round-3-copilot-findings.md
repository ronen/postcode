Record type: findings

# Product-design reconciliation final integrated review: round 3 Copilot findings

Received: 2026-11-03
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]`)
Handoff: [Final integrated review](2026-11-03-final-integrated-handoff.md)
Round: 3 (external PR review retrieved at human direction)
Reviewed target: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Prior findings: [Round 1](2026-11-03-final-integrated-round-1-findings.md), [Round 2](2026-11-03-final-integrated-round-2-findings.md)
Prior reviewed target: `bad7ef484bc5264e3738a723241a278344f93693`

## Retrieval scope and method

Retrieved via `gh api --paginate --slurp` from `repos/ronen/postcode/pulls/12/reviews`, `repos/ronen/postcode/pulls/12/comments` and `repos/ronen/postcode/issues/12/comments`. All pages were consumed: one review, three inline comments, zero conversation comments and zero inline replies. All retrieved review and inline-comment bodies are preserved below in API order, including the review overview's HTML, file table and original line endings. No body text was filtered, redacted or normalized. API metadata is reduced to identity, author, location, target and timestamps. No components were unavailable.

Copilot reports review effort Balanced and state COMMENTED. Its report does not state that it followed the repository handoff or ran tests. It is incorporated into the same assignment at the human's request. The target follows the previous implementation with review-record-only commits; the reviewed implementation remains `bad7ef484bc5264e3738a723241a278344f93693`.

## Retrieved findings

### Overall review 5755513563

Author: `copilot-pull-request-reviewer[bot]`
Submitted: 2026-11-03T16:06:33Z
Source: https://github.com/ronen/postcode/pull/12#pullrequestreview-5755513563

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

Retained tags bypass fence filtering, Unicode diagnostics lack explanatory wording and output bounds, and rejected request data can spuriously trigger attribution-disclosure events.

<details open>
<summary><strong>3 open issues</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Apply fence filtering and omission counts to retained tag bodies](https://github.com/ronen/postcode/pull/12#discussion_r4457237367) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Render bounded diagnostics in Unicode support inspection](https://github.com/ronen/postcode/pull/12#discussion_r4457237425) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Exclude rejected request data from attribution scans](https://github.com/ronen/postcode/pull/12#discussion_r4457237504) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

This PR updates PostCode’s human-facing output to explain results without requiring implementation-language knowledge. It replaces excerpt-based detail with attribution and adds local inadequacy feedback without starting new analysis.

**Changes:**
- Replaces `--source-detail` with `--more-details`, preserving names, locations and metadata while omitting source excerpts.
- Adds shared diagnostic explanations, bounded diagnostic displays and explicit documentation representation limits.
- Adds shell and context-free feedback, observation format 4, regression coverage and retained validation evidence.

| File | Description |
| ---- | ----------- |
| `test/​work-attribution.test.ts` | Migrates presentation fixtures to `moreDetails`. |
| `test/​verification.test.ts` | Uses the new detail flag in comparisons. |
| `test/​subject-resolution.test.ts` | Updates resolution and detail assertions. |
| `test/​source-disclosure.test.ts` | Tests attribution and unexpected excerpt classification. |
| `test/​shell.test.ts` | Updates shell detail requests and assertions. |
| `test/​session.test.ts` | Updates presentation options and observation expectations. |
| `test/​session-inputs.test.ts` | Updates attribution-event expectations. |
| `test/​retained-presentation.test.ts` | Updates retained-detail and format-version checks. |
| `test/​request-model.test.ts` | Updates request and observation assertions. |
| `test/​request-designation-input.test.ts` | Migrates presentation fixtures. |
| `test/​presentation-compatibility.test.ts` | Updates detail compatibility and fallback tests. |
| `test/​output-boundary.test.ts` | Accommodates expanded project-opening guidance. |
| `test/​organization-cli.test.ts` | Updates organization detail and attribution checks. |
| `test/​openai-investigator.test.ts` | Migrates investigation request options. |
| `test/​lens-extensions.test.ts` | Updates extension presentation and observation expectations. |
| `test/​investigation-selection.test.ts` | Updates retained investigation detail checks. |
| `test/​foundation-identity.test.ts` | Migrates qualification-test presentation options. |
| `test/​feedback.test.ts` | Adds feedback targeting, failure and delivery coverage. |
| `test/​exports-lens.test.ts` | Tests excerpt-free export detail and new events. |
| `test/​expansions.test.ts` | Migrates expansion-test presentation options. |
| `test/​execution-ownership.test.ts` | Migrates execution request fixtures. |
| `test/​discovery.test.ts` | Migrates discovery presentation options. |
| `test/​dependency-presentation.test.ts` | Updates dependency wording and detail checks. |
| `test/​dependencies.test.ts` | Checks contextual diagnostics and method version. |
| `test/​compiler-candidate-paths.test.ts` | Migrates dependency request options. |
| `test/​commands.test.ts` | Tests the new detail-option grammar. |
| `test/​collection-selection.test.ts` | Migrates collection-resolution request options. |
| `test/​answer-identity.test.ts` | Migrates answer-identity presentation fixtures. |
| `STATUS.md` | Describes excerpt-free detail and feedback. |
| `src/​lib/​typescript/​project.ts` | Captures diagnostic messages and locations. |
| `src/​lib/​typescript/​expansions.ts` | Preserves separate JSDoc `@see` names. |
| `src/​lib/​typescript/​diagnostics.ts` | Adds shared diagnostic capture. |
| `src/​lib/​typescript/​dependencies.ts` | Retains contextual dependency diagnostics. |
| `src/​lib/​typescript/​composition.ts` | Captures diagnostics and clarifies composition limits. |
| `src/​lib/​source-disclosure.ts` | Classifies attribution, excerpts and diagnostic locations. |
| `src/​lib/​shell.ts` | Tracks displayed results and publishes feedback. |
| `src/​lib/​session.ts` | Finalizes resolution reports before rendering. |
| `src/​lib/​requests.ts` | Validates and normalizes `moreDetails`. |
| `src/​lib/​request-reporting.ts` | Adds diagnostic explanations and resolution guidance. |
| `src/​lib/​records.ts` | Extends diagnostics with messages and coordinates. |
| `src/​lib/​qualification-policy.ts` | Explains module-population limits more plainly. |
| `src/​lib/​presentation.ts` | Adds excerpt-free module detail and bounded diagnostics. |
| `src/​lib/​presentation-contracts.ts` | Updates detail compatibility and retained choices. |
| `src/​lib/​organization/​presentation.ts` | Updates organization detail and diagnostic rendering. |
| `src/​lib/​observations.ts` | Introduces format 4 and distinct feedback/disclosure events. |
| `src/​lib/​investigation/​presentation.ts` | Transforms support detail and adds outcome guidance. |
| `src/​lib/​investigation/​execute.ts` | Adds audience requirements to investigation instructions. |
| `src/​lib/​identity.ts` | Advances affected analysis and presentation methods. |
| `src/​lib/​feedback.ts` | Publishes self-contained inadequacy reports. |
| `src/​lib/​exports/​presentation.ts` | Removes excerpts and adds shared diagnostics. |
| `src/​lib/​evidence-view.ts` | Separates source attribution from captured excerpts. |
| `src/​lib/​documentation-view.ts` | Adds fence handling and representation-limit notices. |
| `src/​lib/​diagnostic-view.ts` | Shares diagnostic meanings and bounds Unicode occurrences. |
| `src/​lib/​dependencies/​records.ts` | Clarifies dependency-recognition limitations. |
| `src/​lib/​commands.ts` | Adds feedback grammar and replaces the detail flag. |
| `src/​lib/​command-execution.ts` | Captures feedback targets and improves failure guidance. |
| `src/​lib/​cli.ts` | Handles context-free feedback before project startup. |
| `src/​lib/​answer-presentation.ts` | Preserves the new detail option in continuations. |
| `scripts/​measure-session-journey.mjs` | Migrates journey measurements to `moreDetails`. |
| `scripts/​measure-partial-session.mjs` | Migrates partial-session request options. |
| `scripts/​comparison-fixtures.mjs` | Updates comparison commands to the new flag. |
| `scripts/​compare-session-requests.mjs` | Updates comparison presentation options. |
| `scripts/​assess-human-output.mjs` | Adds a bounded real-investigator assessment harness. |
| `records/​validation/​product-design-reconciliation/​verification.txt` | Records initial integrated verification results. |
| `records/​validation/​product-design-reconciliation/​run-3/​summarize.txt` | Retains successful summary output. |
| `records/​validation/​product-design-reconciliation/​run-3/​explain.txt` | Retains successful explanation output. |
| `records/​validation/​product-design-reconciliation/​run-3/​basis.json` | Identifies the successful run’s fixture basis. |
| `records/​validation/​product-design-reconciliation/​run-3/​agent.json` | Records successful-run investigator configuration. |
| `records/​validation/​product-design-reconciliation/​run-2/​usage.json` | Retains authorization-failure usage evidence. |
| `records/​validation/​product-design-reconciliation/​run-2/​summarize.txt` | Retains the authorization-failure output. |
| `records/​validation/​product-design-reconciliation/​run-2/​summarize-usage.json` | Records usage for the failed summary attempt. |
| `records/​validation/​product-design-reconciliation/​run-2/​explain-unavailable.json` | Records the unavailable explanation follow-up. |
| `records/​validation/​product-design-reconciliation/​run-2/​examine-unavailable.json` | Records the unavailable examination follow-up. |
| `records/​validation/​product-design-reconciliation/​run-2/​decompose-unavailable.json` | Records the unavailable decomposition follow-up. |
| `records/​validation/​product-design-reconciliation/​run-2/​basis.json` | Identifies the failed run’s fixture basis. |
| `records/​validation/​product-design-reconciliation/​run-2/​agent.json` | Records failed-run investigator configuration. |
| `records/​validation/​product-design-reconciliation/​run-1/​unavailable.json` | Records initial credential unavailability. |
| `records/​validation/​product-design-reconciliation/​run-1/​basis.json` | Identifies the initial run’s fixture basis. |
| `records/​validation/​product-design-reconciliation/​assessment.md` | Assesses retained accounts and documents coverage limits. |
| `records/​tasks/​2026-11-03-product-design-reconciliation.md` | Records the active implementation task. |
| `records/​reviews/​product-design-reconciliation/​2026-11-03-final-integrated-round-2-findings.md` | Records correction verification and residual limits. |
| `records/​reviews/​product-design-reconciliation/​2026-11-03-final-integrated-round-1-findings.md` | Preserves initial integrated review findings. |
| `records/​reviews/​product-design-reconciliation/​2026-11-03-final-integrated-handoff.md` | Records review scope, target and verification context. |
| `records/​reviews/​product-design-reconciliation/​2026-11-03-final-integrated-disposition.md` | Records corrections and pending human confirmation. |
| `README.md` | Documents new detail, observation and feedback behavior. |
| `fixtures/​human-output/​tsconfig.json` | Configures the human-output assessment fixture. |
| `fixtures/​human-output/​remote.ts` | Supplies a configurable adapter boundary. |
| `fixtures/​human-output/​README.md` | Describes intended fixture behavior and limitations. |
| `fixtures/​human-output/​catalog.ts` | Supplies lookup orchestration for assessment. |
| `fixtures/​human-output/​cache.ts` | Supplies a single-entry cache for assessment. |
| `docs/​implementation-conventions.md` | Documents detail, diagnostics and feedback invariants. |
| `docs/​capability-reference.md` | Updates supported detail and feedback capabilities. |
| `docs/​architecture/​README.md` | Describes revised presentation and observation boundaries. |
| `docs/​architecture/​investigation.md` | Documents investigation attribution and feedback delivery. |
</details>

<sub>Review effort: Balanced</sub>

### Inline comment 4457237367

Author: `Copilot`
Location: `src/lib/documentation-view.ts:90` (original line 90)
Target: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Created: 2026-11-03T16:06:32Z
Source: https://github.com/ronen/postcode/pull/12#discussion_r4457237367

Retained tag bodies bypass the fence filter: an `@see` containing `Architecture ```read(1)``` reference` reaches module/export documentation and investigation support unchanged in text and JSON, with no representation limit. Apply the same plain-text-aware fence handling to retained tags, preserve adjacent prose, and include removed characters in the original tag omission counts.

### Inline comment 4457237425

Author: `Copilot`
Location: `src/lib/investigation/presentation.ts:176` (original line 176)
Target: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Created: 2026-11-03T16:06:32Z
Source: https://github.com/ronen/postcode/pull/12#discussion_r4457237425

Unicode investigram inspection serializes support qualifications directly at line 273, but never renders the top-level diagnostic meanings added here. Claims supported by malformed files therefore expose raw diagnostics without problem/consequence/action wording, and all occurrences bypass the five-code/three-occurrence bounds. Render these diagnostics through `diagnosticLines`, keeping complete occurrence arrays in JSON rather than the Unicode support serialization.

### Inline comment 4457237504

Author: `Copilot`
Location: `src/lib/source-disclosure.ts:83` (original line 83)
Target: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Created: 2026-11-03T16:06:33Z
Source: https://github.com/ronen/postcode/pull/12#discussion_r4457237504

This recursive scan treats preserved rejected-request data as analyzer provenance: a JSON request with an invalid selector such as `{ diagnostics: [{ code: 2307, path: '/not-analyzed.ts' }] }` produces an `attribution-disclosed` event despite no analysis occurring. Collect diagnostic locations only from owned qualification/support fields, excluding rejected input, so caller data cannot manufacture evidence-disclosure events.

