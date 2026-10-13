Record type: findings

# Integrated Lens request model: round 4 — Copilot findings

Retrieved: 2026-10-13
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]` / `Copilot`)
Assignment context: [Integrated Lens request model](2026-10-13-integrated-request-model-handoff.md)
Round: 4 (GitHub PR review)
Pull request: [ronen/postcode #10](https://github.com/ronen/postcode/pull/10)
Reviewed target: `33e443a260589530725d8003ad9a6dc5935c7b2a`
PR base at retrieval: `9e91b85dfaa9525745a8cc9bb855886bad429bdf`
Prior findings: [Round 3](2026-10-13-integrated-request-model-round-3-findings.md)
Prior implementation target: `e4452fdfcf797ab04222cbea5cd546995ade9366`

## Retrieval method and scope

The human explicitly requested retrieval, preservation and assessment of the Copilot review. Retrieved using `gh api --paginate --slurp` for `repos/ronen/postcode/pulls/10`, `/pulls/10/reviews`, `/pulls/10/comments` and `/issues/10/comments`. All returned pages were inspected: one review submission, one inline review comment, and zero issue-conversation comments, each listing on one page. The inline comment belongs to the submitted review; no replies or other conversation comments were present at retrieval. No retrieved review component was filtered out or redacted. Bodies below preserve their returned text, including HTML, invisible path characters and original line endings; labels and metadata are repository-authored.

This is the human-requested GitHub review of the 153-file PR diff, whose base precedes the original integrated implementation baseline. The existing handoff is assignment context; Copilot did not report following it or running verification. The current PR head matches the review's `commit_id`; only records and plan metadata changed since the prior implementation target. Reviewer verification limits and gate conclusions are not inferred beyond the returned text.

## Retrieved findings

### Review submission — 5509380968

Author: `copilot-pull-request-reviewer[bot]`
State: `COMMENTED`
Submitted: `2026-10-13T20:13:16Z`
Target: `33e443a260589530725d8003ad9a6dc5935c7b2a`
Source: [Review 5509380968](https://github.com/ronen/postcode/pull/10#pullrequestreview-5509380968)

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

The current capability reference incorrectly states that completed answer-identity and prerequisite-attribution work remains in progress.

<details open>
<summary><strong>1 open finding</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Update stale capability status and remove obsolete progress claim](https://github.com/ronen/postcode/pull/10#discussion_r4263518014) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

Implements the explicit Lens request model across CLI execution, qualified resolution, retained answers, presentation, attribution, and observations.

**Changes:**
- Separates request/designation context from reusable answer identity.
- Adds runtime Lens/Presentation catalogs, qualified refusals, work attribution, and an exports extension.
- Updates comprehensive tests and governing/supporting documentation.

| File | Description |
| ---- | ----------- |
| `src/​lib/​answer-identity.ts` | Defines designation-free mechanical answer identity. |
| `src/​lib/​cli.ts` | Publishes worker work reports. |
| `src/​lib/​collection-selection.ts` | Canonically orders unordered selections. |
| `src/​lib/​command-execution.ts` | Publishes View and non-View outcomes. |
| `src/​lib/​commands.ts` | Normalizes command aliases and raw references. |
| `src/​lib/​dependencies/​content.ts` | Generalizes dependency answer content. |
| `src/​lib/​dependencies/​evaluate.ts` | Attributes dependency evaluation work. |
| `src/​lib/​dependencies/​organization.ts` | Attributes organization expansion work. |
| `src/​lib/​dependencies/​records.ts` | Records direction, coverage, and outsiders. |
| `src/​lib/​documentation-view.ts` | Shares bounded documentation presentation. |
| `src/​lib/​evaluation.ts` | Adds work-aware evaluation and reuse reporting. |
| `src/​lib/​evidence-access.ts` | Attributes evidence acquisition. |
| `src/​lib/​export-view.ts` | Shares export role and route rendering. |
| `src/​lib/​exports/​content.ts` | Constructs qualified export answers. |
| `src/​lib/​exports/​presentation.ts` | Adds export View arrangement and rendering. |
| `src/​lib/​exports/​records.ts` | Defines retained export projections. |
| `src/​lib/​identity.ts` | Adds methods and non-allocating binding lookup. |
| `src/​lib/​investigation/​acceptance.ts` | Retains operation-specific provenance methods. |
| `src/​lib/​investigation/​associations.ts` | Validates associated presentation content. |
| `src/​lib/​investigation/​bounds.ts` | Defines investigation guard defaults. |
| `src/​lib/​investigation/​content.ts` | Derives candidates from retained operation selections. |
| `src/​lib/​investigation/​contracts.ts` | Generalizes operation contracts and parent context. |
| `src/​lib/​investigation/​evaluation.ts` | Uses catalogued operation policy and attribution. |
| `src/​lib/​investigation/​openai/​references.ts` | Transports new retained reference positions. |
| `src/​lib/​investigation/​operations.ts` | Defines fixed interpretation operations. |
| `src/​lib/​investigation/​selection-record.ts` | Retains operation requests rather than selectors. |
| `src/​lib/​investigation/​selection-validation.ts` | Validates the revised selection schema. |
| `src/​lib/​investigation/​selection.ts` | Constructs resolved investigation selections. |
| `src/​lib/​mechanical-implementations.ts` | Registers mechanical Lens constructors. |
| `src/​lib/​memory-store.ts` | Validates new answers and resolves bindings. |
| `src/​lib/​module-content.ts` | Shares qualified export resolution. |
| `src/​lib/​module-selection.ts` | Validates and orders resolved modules. |
| `src/​lib/​observations.ts` | Introduces observation format version two. |
| `src/​lib/​organization/​content.ts` | Supports qualified outside-population groups. |
| `src/​lib/​organization/​evaluate.ts` | Attributes organization evaluation. |
| `src/​lib/​organization/​projections.ts` | Consumes resolved organization subjects. |
| `src/​lib/​organization/​records.ts` | Removes invocation-specific selection fields. |
| `src/​lib/​program-presentation.ts` | Coordinates mechanical arrangement and rendering. |
| `src/​lib/​projections.ts` | Constructs designation-independent projections. |
| `src/​lib/​records.ts` | Extends record and store contracts. |
| `src/​lib/​request-catalog.ts` | Captures and validates request catalogs. |
| `src/​lib/​request-reporting.ts` | Renders resolution and usage reports. |
| `src/​lib/​resolution-context.ts` | Separates exposed lookup context from answers. |
| `src/​lib/​session-protocol.ts` | Adds request alternatives and work progress. |
| `src/​lib/​session-worker.ts` | Transfers catalogs and incremental work. |
| `src/​lib/​shell.ts` | Exposes worker work reports. |
| `src/​lib/​source-disclosure.ts` | Classifies export-source disclosure. |
| `src/​lib/​subject-resolution.ts` | Implements qualified subject resolution. |
| `src/​lib/​typescript/​project.ts` | Attributes provider work and reuse. |
| `test/​answer-identity.test.ts` | Tests answer and View identity separation. |
| `test/​commands.test.ts` | Tests aliases and raw follow-up references. |
| `test/​comparison.ts` | Normalizes newly declared references. |
| `test/​dependency-presentation.test.ts` | Tests qualified dependency refusals. |
| `test/​dependency-projections.test.ts` | Tests resolved dependency construction. |
| `test/​discovery.test.ts` | Migrates lookup/refusal expectations. |
| `test/​expansions.test.ts` | Tests explicit empty module detail. |
| `test/​foundation-identity.test.ts` | Updates identity invariants. |
| `test/​helpers.ts` | Uses resolved projection fixtures. |
| `test/​openai-investigator.test.ts` | Tests non-View usage reporting. |
| `test/​organization-cli.test.ts` | Tests organization refusals and titles. |
| `test/​organization.test.ts` | Migrates organization lookup expectations. |
| `test/​projection-helpers.ts` | Adapts tests through production resolution. |
| `test/​records.test.ts` | Tests cross-session resolution rejection. |
| `test/​request-helpers.ts` | Adds result-kind assertions. |
| `test/​shell.test.ts` | Verifies reference designation reporting. |
| `test/​source-disclosure.test.ts` | Tests refusal and disclosure observations. |
| `test/​source-evidence.test.ts` | Supplies binding lookup to analysis fixtures. |
| `STATUS.md` | Documents implemented request-model behavior. |
| `README.md` | Updates documentation links and observation version. |
| `foundation/​README.md` | Clarifies foundation authority. |
| `notes/​README.md` | Links candidate UX notes. |
| `notes/​candidate-capabilities.md` | Clarifies exploratory capability scope. |
| `docs/​README.md` | Documents specification and reference roles. |
| `docs/​capability-reference.md` | Adds the supported-capability reference. |
| `docs/​implementation-conventions.md` | Records request-model conventions. |
| `docs/​plans/​README.md` | Updates active and completed work. |
| `docs/​plans/​module-investigation.md` | Marks the prior plan complete. |
| `docs/​decisions/​README.md` | Indexes the new accepted decisions. |
| `docs/​decisions/​compact-attribution-and-complete-results.md` | Records attribution-output policy. |
| `docs/​decisions/​experimental-structured-outputs.md` | Records experimental schema policy. |
| `docs/​decisions/​precise-subject-designations-and-lookup-bindings.md` | Records precise-reference semantics. |
| `docs/​decisions/​qualified-projection-construction.md` | Marks the former decision superseded. |
| `docs/​decisions/​unordered-collection-inspection.md` | Records canonical selection ordering. |
| `dev/​engineering-guidelines.md` | Adds stable section anchors. |
| `dev/​process-conventions.md` | Defines stable documentation anchors. |
| `dev/​review.md` | Clarifies process-maintenance reviews. |
| `dev/​workflow.md` | Clarifies historical-reference handling. |
| `records/​reviews/​lens-request-model/​2026-10-12-answer-identity-disposition.md` | Records answer-identity dispositions. |
| `records/​reviews/​lens-request-model/​2026-10-12-request-attribution-handoff.md` | Preserves attribution review scope. |
| `records/​reviews/​lens-request-model/​2026-10-12-subject-resolution-disposition.md` | Records resolution corrections. |
| `records/​reviews/​lens-request-model/​2026-10-13-integrated-request-model-round-3-findings.md` | Records final integrated review findings. |
| `records/​reviews/​lens-request-model/​2026-10-13-operation-definitions-disposition.md` | Records operation-definition corrections. |
| `records/​reviews/​lens-request-model/​2026-10-13-operation-definitions-handoff.md` | Preserves operation review scope. |
| `records/​reviews/​lens-request-model/​2026-10-13-operation-definitions-round-2-findings.md` | Records the successful recheck. |
| `records/​reviews/​lens-request-model/​2026-10-13-presentation-compatibility-disposition.md` | Records presentation compatibility disposition. |
</details>

🧠 **Review effort:** Balanced

---

💡 <a href="/ronen/postcode/new/main?filename=.github/skills/code-review/SKILL.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add a `code-review` agent skill</a> or configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

### Inline finding — 4263518014

Author: `Copilot`
Review: `5509380968`
Created: `2026-10-13T20:13:16Z`
Location: `docs/capability-reference.md:46` (`RIGHT`)
Original location: line `46` at `33e443a260589530725d8003ad9a6dc5935c7b2a`
Target: `33e443a260589530725d8003ad9a6dc5935c7b2a`
Reply to: none
Source: [Comment 4263518014](https://github.com/ronen/postcode/pull/10#discussion_r4263518014)

This current-capability reference still says answer identity and prerequisite attribution are in progress, but this PR implements and reports both as complete. That contradicts the updated status page and sends readers to a correction plan for work that is no longer pending. Keep the distinct captured-basis limitation, but remove the obsolete progress claim.
