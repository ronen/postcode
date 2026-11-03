# Exact retained-answer presentation — integrated review round 2 findings

Record type: findings
Received: 2026-10-26
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]`; inline author `Copilot`)
Handoff: [Integrated implementation review](2026-10-26-implementation-integrated-handoff.md)
Round: 2
Reviewed target: 5005de6e4c95f8982c458e3a77a02e587713d959
Prior findings: [Round 1 findings](2026-10-26-implementation-integrated-round-1-findings.md)
Prior reviewed target: 62a282bb1e6858850e1dffd7a619b4c1b6332348

## Retrieval scope

The human requested retrieval and handling of the completed Copilot review on PR #11. Retrieved every page of the GitHub REST pull-request reviews, pull-request inline comments, and issue conversation comments using `gh api --paginate --slurp`. The complete responses contained one review, one inline annotation and zero conversation comments. All retrieved review and annotation bodies are preserved below; CRLF line endings in the review body are normalized to LF. No text is otherwise filtered, redacted or summarized. Location and identity labels are repository-authored.

GitHub records the target above and review state `COMMENTED`. Copilot's summary describes its reviewed scope; it does not report test execution or explicitly attest that it followed the repository handoff. Changes since round 1 include the refusal wording and embedded rendering corrections in `133ba4c3677da4b5d33c0e1122a52a5bd75118f8` and their disposition. The existing integrated assignment remains the governing repository scope.

## Retrieved findings

### Review body — copilot-pull-request-reviewer[bot]

Source: [5647157602](https://github.com/ronen/postcode/pull/11#pullrequestreview-5647157602)
Submitted: 2026-10-26T03:52:38Z

<!-- ccr-overview-v2 -->

### 🔵 Needs a closer look

The cross-family request and identity changes still have an unresolved compatibility defect and require final human review.

<details open>
<summary><strong>1 open issue</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Use selected modules when validating retained presentation](https://github.com/ronen/postcode/pull/11#discussion_r4373788257) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

This PR adds exact retained-answer presentation to PostCode, allowing paging and formatting without selecting newer correction or association history.

**Changes:**
- Adds `present` requests, Session-local answer aliases, and compatibility checks across supported answer families.
- Exposes selection mode, reference lifetime, and complete continuations; advances observations to version 3.
- Adds regression coverage and updates documentation and review records.

| File | Description |
| ---- | ----------- |
| test/​subject-resolution.test.ts | Updates answer-as-subject refusal expectations. |
| test/​source-evidence.test.ts | Adds answer-binding methods to the store fixture. |
| test/​source-disclosure.test.ts | Tests retained source disclosure through the shell. |
| test/​shell.test.ts | Updates paging and reference-lifetime assertions. |
| test/​session.test.ts | Expects observation version 3. |
| test/​retained-presentation.test.ts | Covers retained requests, failures, references, and invalidation. |
| test/​request-model.test.ts | Updates request normalization and observation assertions. |
| test/​request-designation-input.test.ts | Adjusts resolution access for request alternatives. |
| test/​projection-content.test.ts | Updates presentation identity and arrangement assertions. |
| test/​presentation-compatibility.test.ts | Tests retained refusals and fallback presentation. |
| test/​lens-extensions.test.ts | Tests retained interpretation extensions. |
| test/​investigation-selection.test.ts | Tests frozen paging, aliases, and binding stability. |
| test/​investigation-integration.test.ts | Moves paging to retained answers and checks frozen history. |
| test/​exports-lens.test.ts | Tests retained exports and missing-support refusals. |
| test/​comparison.ts | Normalizes composite references and answer headings. |
| test/​commands.test.ts | Updates command parsing tests for `present`. |
| test/​cli.test.ts | Expects observation version 3. |
| STATUS.md | Describes retained presentation capabilities. |
| src/​lib/​work-attribution.ts | Identifies retained-presentation initiation. |
| src/​lib/​subject-resolution.ts | Rejects answer references as Lens subjects. |
| src/​lib/​session.ts | Dispatches retained requests and coordinates answer aliases. |
| src/​lib/​retained-presentation.ts | Resolves and presents exact retained answers. |
| src/​lib/​requests.ts | Defines and validates distinct `present` requests. |
| src/​lib/​request-reporting.ts | Reports retained targets, aliases, and lifetime guidance. |
| src/​lib/​request-catalog.ts | Reserves the `present` command identity. |
| src/​lib/​records.ts | Adds answer-binding store interfaces. |
| src/​lib/​projection-content.ts | Narrows support resolution to read-only capabilities. |
| src/​lib/​program-presentation.ts | Passes answer context into mechanical presentations. |
| src/​lib/​presentation.ts | Adds module answer disclosure and embedded rendering support. |
| src/​lib/​presentation-contracts.ts | Checks retained-content presentation compatibility. |
| src/​lib/​organization/​presentation.ts | Adds answer disclosure and suppresses duplicate embedded headings. |
| src/​lib/​organization/​content.ts | Narrows organization content resolution capabilities. |
| src/​lib/​observations.ts | Advances observation batches to version 3. |
| src/​lib/​module-content.ts | Narrows module content resolution capabilities. |
| src/​lib/​memory-store.ts | Maintains separate Session-local answer bindings. |
| src/​lib/​investigation/​presentation.ts | Adds retained outcomes, identity, and complete continuations. |
| src/​lib/​investigation/​content.ts | Restricts content resolution to fixed record reads. |
| src/​lib/​investigation/​associations.ts | Arranges frozen composites and association continuations. |
| src/​lib/​identity.ts | Updates presentation versions and supports answer aliases. |
| src/​lib/​exports/​presentation.ts | Adds answer context and reference-independent identity. |
| src/​lib/​exports/​content.ts | Narrows export content resolution capabilities. |
| src/​lib/​dependencies/​presentation.ts | Adds dependency answer disclosure and identity fields. |
| src/​lib/​dependencies/​content.ts | Narrows dependency content resolution capabilities. |
| src/​lib/​composition-content.ts | Restricts composition resolution to record reads. |
| src/​lib/​commands.ts | Parses `present` and rejects fresh-request paging. |
| src/​lib/​answer-references.ts | Classifies answers and supplies subject-refusal guidance. |
| src/​lib/​answer-presentation.ts | Shares answer disclosure and continuation generation. |
| records/​tasks/​2026-10-26-exact-retained-answer-presentation.md | Records the active implementation task. |
| records/​reviews/​exact-retained-answer-presentation/​2026-10-26-implementation-integrated-round-1-findings.md | Preserves independent review findings and verification. |
| records/​reviews/​exact-retained-answer-presentation/​2026-10-26-implementation-integrated-handoff.md | Records review scope and handoff evidence. |
| records/​reviews/​exact-retained-answer-presentation/​2026-10-26-implementation-integrated-disposition.md | Records corrections and pending human gate confirmation. |
| README.md | Introduces retained presentation and observation version 3. |
| docs/​implementation-conventions.md | Updates continuation, comparison, and observation conventions. |
| docs/​hosted-investigation.md | Clarifies retained presentation adds no provider work. |
| docs/​cli-reference.md | Documents `present`, paging, refusals, and reference lifetime. |
| docs/​capability-reference.md | Summarizes retained presentation capabilities and limits. |
| docs/​backlog.md | Updates bounded attribution and lifetime coverage. |
| docs/​architecture/​README.md | Describes retained-request coordination and boundaries. |
| docs/​architecture/​investigation.md | Distinguishes fresh selection from frozen answer paging. |
</details>

<sub>Review effort: Balanced</sub>

### Inline annotation — Copilot

Source: [4373788257](https://github.com/ronen/postcode/pull/11#discussion_r4373788257)
Review: 5647157602
Location: `src/lib/presentation-contracts.ts:216` (right side)
Commit: `5005de6e4c95f8982c458e3a77a02e587713d959`
Created: 2026-10-26T03:52:37Z
Updated: 2026-10-26T03:52:38Z

An artifact-only group such as a directory containing only `README.md` can produce a valid `inspect` View but fail `present` when unrelated TypeScript modules exist elsewhere in the project. This check uses the full discovery population, while `moduleEvaluations` contains only outcomes retained for the selected or expanded modules. Check `content.value.modules` instead, and add a regression covering fresh inspection followed by retained presentation of a documentation-only group.
