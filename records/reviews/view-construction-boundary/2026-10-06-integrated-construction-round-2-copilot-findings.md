Record type: findings

# Qualified construction boundary: Copilot PR review

Received: 2026-10-06
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]`)
Handoff: [Final integrated review](2026-10-06-integrated-construction-handoff.md)
Round: 2 (external PR review)
Reviewed target: `50ab76de48e22412303e6081caf861507d4d0a4b`
Prior findings: [Round 1](2026-10-06-integrated-construction-round-1-findings.md)
Prior reviewed target: `16ec9ae261715735aa44f62e969ae0f49dc2942e`
Source: [PR #9 review 5430311850](https://github.com/ronen/postcode/pull/9#pullrequestreview-5430311850)
Submitted: 2026-10-06T14:56:35Z
External review state: `COMMENTED`

## Retrieval scope

Retrieved through `gh api --paginate` from PR #9's reviews, inline review comments
and issue conversation comments endpoints. The complete response contained one
Copilot review, zero inline annotations and zero conversation comments. The exact
review was also retrieved by its stable review ID. The review body below is
preserved in full; CRLF line endings were normalized to LF, with no other text
changes. No components were filtered or unavailable.

This external review covers the PR at the target above, including the F1 correction
`0e82ee5` and its recorded disposition. Copilot supplied no test-run evidence;
its own description of review scope and recommendation appears below. Assessment
and human acceptance belong to the separate disposition and task record.

## Retrieved findings

### Overall review — Copilot, review 5430311850

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🔵 Needs a closer look

The cross-cutting identity, retained-record, binding, worker-finalization, and presentation changes warrant final human review despite extensive verification.

**Review effort:** Balanced  
**Findings:** None

<details>
<summary><strong>What changed in this PR</strong></summary>

Separates qualified Projection construction from CLI presentation shaping across mechanical and investigation views.

**Changes:**
- Adds immutable, display-independent content resolution and pure arrangement stages.
- Retains investigation selections and revisions with restricted reference binding and separate View identity.
- Updates organization qualification wording, architecture documentation, tests, and comparison evidence.

| File | Description |
| ---- | ----------- |
| `test/​projection-content.test.ts` | Tests immutable, unbounded resolved content. |
| `test/​processing-index.test.ts` | Updates composition-resolution performance coverage. |
| `test/​investigation-revisions.test.ts` | Tests unpaged snapshots and paging adapter. |
| `test/​investigation-integration.test.ts` | Covers arrangement identity and worker finalization. |
| `src/​lib/​session.ts` | Integrates new view coordinators and arrangement keys. |
| `src/​lib/​reference-binding.ts` | Adds population-restricted reference binding. |
| `src/​lib/​records.ts` | Registers investigation selection records. |
| `src/​lib/​qualification-view.ts` | Centralizes qualification presentation shaping. |
| `src/​lib/​projection-content.ts` | Adds qualified record/context resolution. |
| `src/​lib/​presentation.ts` | Separates module resolution from arrangement. |
| `src/​lib/​organization/​presentation.ts` | Arranges organization content and qualified wording. |
| `src/​lib/​organization/​content.ts` | Resolves organization content and classification. |
| `src/​lib/​module-content.ts` | Resolves complete module Projection content. |
| `src/​lib/​memory-store.ts` | Validates retained investigation selections. |
| `src/​lib/​investigation/​selection.ts` | Constructs retained investigation selections. |
| `src/​lib/​investigation/​selection-validation.ts` | Enforces selection invariants. |
| `src/​lib/​investigation/​selection-record.ts` | Defines selection records and identity references. |
| `src/​lib/​investigation/​revisions.ts` | Produces complete revision snapshots. |
| `src/​lib/​investigation/​revision-page.ts` | Applies revision delivery bounds. |
| `src/​lib/​investigation/​openai/​references.ts` | Handles selection-record wire references. |
| `src/​lib/​investigation/​evaluation.ts` | Uses revision paging over snapshots. |
| `src/​lib/​investigation/​content.ts` | Resolves fixed investigation content and support. |
| `src/​lib/​investigation/​associations.ts` | Separates association selection and arrangement. |
| `src/​lib/​interactive-session.ts` | Finalizes usage using worker arrangement identity. |
| `src/​lib/​identity.ts` | Registers new identity method versions. |
| `src/​lib/​dependencies/​presentation.ts` | Separates dependency resolution and arrangement. |
| `src/​lib/​dependencies/​content.ts` | Resolves complete dependency content. |
| `src/​lib/​composition-view.ts` | Presents already-resolved composition content. |
| `src/​lib/​composition-content.ts` | Resolves composition claims and evaluations. |
| `scripts/​compare-view-construction.mjs` | Compares mechanical Views with baseline. |
| `scripts/​compare-investigation-revisions.mjs` | Compares revision delivery with baseline. |
| `scripts/​compare-investigation-construction.mjs` | Compares investigation Views and observations. |
| `records/​validation/​view-construction-boundary/​2026-10-06-revision-comparison.json` | Records revision comparison results. |
| `records/​validation/​view-construction-boundary/​2026-10-06-investigation-selection.md` | Documents selection checkpoint validation. |
| `records/​validation/​view-construction-boundary/​2026-10-06-investigation-comparison.json` | Records investigation comparison results. |
| `records/​validation/​view-construction-boundary/​2026-10-06-integrated-mechanical-comparison.json` | Records final mechanical comparisons. |
| `records/​validation/​view-construction-boundary/​2026-10-06-integrated-correction-comparison.json` | Records post-correction comparisons. |
| `records/​validation/​view-construction-boundary/​2026-10-06-integrated-construction.md` | Documents integrated verification. |
| `records/​validation/​view-construction-boundary/​2026-10-05-mechanical.md` | Documents mechanical checkpoint verification. |
| `records/​validation/​view-construction-boundary/​2026-10-05-mechanical-comparison.json` | Records mechanical checkpoint comparisons. |
| `records/​tasks/​2026-10-05-view-construction-boundary.md` | Preserves task scope and approvals. |
| `records/​reviews/​view-construction-boundary/​2026-10-06-mechanical-construction-disposition.md` | Records mechanical findings disposition. |
| `records/​reviews/​view-construction-boundary/​2026-10-06-investigation-selection-round-1-findings.md` | Records selection review findings. |
| `records/​reviews/​view-construction-boundary/​2026-10-06-investigation-selection-handoff.md` | Defines selection review scope. |
| `records/​reviews/​view-construction-boundary/​2026-10-06-investigation-selection-disposition.md` | Records selection corrections and disposition. |
| `records/​reviews/​view-construction-boundary/​2026-10-06-integrated-construction-round-1-findings.md` | Records integrated review findings. |
| `records/​reviews/​view-construction-boundary/​2026-10-06-integrated-construction-handoff.md` | Defines final integrated review scope. |
| `records/​reviews/​view-construction-boundary/​2026-10-06-integrated-construction-disposition.md` | Records final finding correction. |
| `records/​reviews/​view-construction-boundary/​2026-10-05-mechanical-construction-round-1-findings.md` | Records mechanical review findings. |
| `records/​reviews/​view-construction-boundary/​2026-10-05-mechanical-construction-handoff.md` | Defines mechanical review scope. |
| `docs/​implementation-conventions.md` | Establishes construction and arrangement conventions. |
| `docs/​decisions/​README.md` | Indexes the accepted decision. |
| `docs/​cli-reference.md` | Documents qualified artifact terminology. |
| `docs/​backlog.md` | Removes the resolved builder-boundary item. |
| `docs/​architecture/​README.md` | Documents the new architectural boundary. |
| `docs/​architecture/​investigation.md` | Documents retained investigation construction. |
| `docs/​architectural-constraints.md` | Governs arrangement, binding, and disclosure. |
</details>

---

💡 <a href="/ronen/postcode/new/main?filename=.github/skills/code-review/SKILL.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add a `code-review` agent skill</a> or configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>
