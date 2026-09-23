# Transient session shell integrated review: Copilot findings

Record type: findings
Received: 2026-09-23
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]` / `Copilot`)
Handoff: [Integrated assignment](2026-09-23-integrated-handoff.md); PR review retrieved under the human's direction, without an assertion that Copilot followed the handoff
Round: 4 (supplementary GitHub PR review)
Reviewed target: `841f51098dbb33cfe0c231a29e2816bf99983254`
PR base at retrieval: `0d59720fa22381cffa1f65ba22f5fdb478bc5e51`
Prior findings: [Integrated round 3 and supplement](2026-09-23-integrated-round-3-findings.md)
Prior reviewed target: `441772648cbd550b108c1060cc8dfb1df883edc4`
Source: [PR #6](https://github.com/ronen/postcode/pull/6)

## Retrieval method and completeness

Retrieved 2026-09-23T16:57:29.829019+00:00 using `gh api` for PR metadata and
`gh api --paginate --slurp` for all pages of:

- `repos/ronen/postcode/pulls/6/reviews`: 1 review.
- `repos/ronen/postcode/pulls/6/comments`: 3 inline comments, including any replies.
- `repos/ronen/postcode/issues/6/comments`: 0 conversation comments.

All returned review/comment bodies are preserved below verbatim, in API order
within each category, with repository-authored source labels. No bodies were
filtered, redacted, or normalized. Embedded relative links and formatting remain
as received and may require the GitHub source page to resolve. No endpoint failed
and pagination completed. This is the review available at retrieval time; no
claim is made about later comments or unpublished reviewer reasoning. The review
body describes its effort and findings but reports no executed verification.
Assessment and disposition are recorded separately.

## Retrieved findings

### Overall review 5293938719

Author: `copilot-pull-request-reviewer[bot]`
Source: [5293938719](https://github.com/ronen/postcode/pull/6#pullrequestreview-5293938719)
state: `COMMENTED`
submitted_at: `2026-09-23T16:47:28Z`
commit_id: `841f51098dbb33cfe0c231a29e2816bf99983254`

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🔵 Needs a closer look

The cross-cutting session, worker, invalidation, and identity changes still require the explicitly pending human inspection.

**Review effort:** Balanced  
**Findings:** 3 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (3)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Document captured-input boundary instead of session identity finalization](#discussion_r4084949168) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Update comment to describe captured-input materialization boundary](#discussion_r4084949226) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Correct probe text to reflect input-independent random session IDs](#discussion_r4084949274) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

Adds a transient interactive TypeScript analysis shell with reusable session state, stable references, change invalidation, interruption, and shared one-shot execution.

**Changes:**
- Introduces session-based analysis, caching, references, and observations.
- Adds worker-backed interactive command execution and interruption.
- Expands tests, validation tooling, and user documentation.

| File | Description |
| ---- | ----------- |
| `test/​source-evidence.test.ts` | Adapts evidence tests to sessions. |
| `test/​shell.test.ts` | Tests interactive shell lifecycle. |
| `test/​session.test.ts` | Tests session accumulation and references. |
| `test/​organization.test.ts` | Updates organization session semantics. |
| `test/​organization-cli.test.ts` | Updates CLI organization journeys. |
| `test/​helpers.ts` | Adds session normalization helpers. |
| `test/​expansions.test.ts` | Normalizes session-scoped expansion results. |
| `test/​dependency-provider-probe.ts` | Updates provider probe metadata. |
| `test/​dependency-projections.test.ts` | Tests session-local dependency selection. |
| `test/​dependency-presentation.test.ts` | Updates dependency navigation expectations. |
| `test/​dependencies.test.ts` | Tests captured input support. |
| `STATUS.md` | Records shell implementation status. |
| `src/​lib/​typescript/​inputs.ts` | Adds input revision and change detection. |
| `src/​lib/​typescript/​expansions.ts` | Migrates expansion records to sessions. |
| `src/​lib/​typescript/​dependencies.ts` | Migrates dependency records to sessions. |
| `src/​lib/​typescript/​composition.ts` | Migrates composition records to sessions. |
| `src/​lib/​shell.ts` | Implements interactive shell control. |
| `src/​lib/​session.ts` | Implements reusable request sessions. |
| `src/​lib/​session-worker.ts` | Hosts analysis in a worker. |
| `src/​lib/​records.ts` | Defines session-oriented records. |
| `src/​lib/​projections.ts` | Adds lookup/reference selection modes. |
| `src/​lib/​presentation.ts` | Updates schemas and session output. |
| `src/​lib/​organization/​records.ts` | Updates organization projection contracts. |
| `src/​lib/​organization/​projections.ts` | Adds session-local organization references. |
| `src/​lib/​organization/​presentation.ts` | Updates organization schema and rendering. |
| `src/​lib/​organization/​evaluate.ts` | Uses session-owned repository evidence. |
| `src/​lib/​observations.ts` | Adds command outcomes and correlation. |
| `src/​lib/​memory-store.ts` | Adds session validation and bindings. |
| `src/​lib/​interactive-session.ts` | Manages worker requests and interruption. |
| `src/​lib/​identity.ts` | Adds session IDs and stable bindings. |
| `src/​lib/​evaluation.ts` | Reuses stable completed/partial work. |
| `src/​lib/​dependencies/​records.ts` | Updates dependency projection contracts. |
| `src/​lib/​dependencies/​projections.ts` | Adds reference-aware dependency selection. |
| `src/​lib/​dependencies/​presentation.ts` | Updates dependency schema and rendering. |
| `src/​lib/​dependencies/​organization.ts` | Migrates organization claims to sessions. |
| `src/​lib/​dependencies/​evaluate.ts` | Keys dependency outcomes by session. |
| `src/​lib/​composition-view.ts` | Excludes input records from presentation. |
| `src/​lib/​commands.ts` | Adds shared command parsing/tokenization. |
| `src/​lib/​command-execution.ts` | Centralizes publication and observations. |
| `src/​lib/​cli.ts` | Routes one-shot and shell execution. |
| `scripts/​profile-analysis.mjs` | Supports session-based instrumentation. |
| `scripts/​probe-session-interruption.mjs` | Probes worker interruption behavior. |
| `scripts/​probe-compiler-interruption.mjs` | Probes native compiler interruption. |
| `scripts/​measure-session-journey.mjs` | Measures session journeys and memory. |
| `scripts/​measure-partial-session.mjs` | Measures partial-result reuse. |
| `scripts/​compare-session-requests.mjs` | Compares fresh and accumulated requests. |
| `scripts/​compare-session-conversion.mjs` | Verifies snapshot-to-session conversion. |
| `scripts/​compare-analysis.mjs` | Normalizes session-scoped comparisons. |
| `records/​validation/​transient-session-shell/​2026-09-23-partial-reuse.md` | Records partial-reuse validation. |
| `records/​validation/​transient-session-shell/​2026-09-23-one-shot.md` | Records one-shot validation. |
| `records/​validation/​transient-session-shell/​2026-09-23-integrated.md` | Records integrated validation. |
| `records/​tasks/​2026-09-23-transient-session-shell.md` | Tracks implementation and verification. |
| `records/​reviews/​transient-session-shell/​2026-09-23-one-shot-round-1-findings.md` | Preserves initial review findings. |
| `records/​reviews/​transient-session-shell/​2026-09-23-one-shot-handoff.md` | Defines one-shot review scope. |
| `records/​reviews/​transient-session-shell/​2026-09-23-one-shot-disposition.md` | Records finding dispositions. |
| `records/​reviews/​transient-session-shell/​2026-09-23-integrated-handoff.md` | Defines integrated review scope. |
| `README.md` | Documents interactive and one-shot use. |
| `docs/​implementation-conventions.md` | Establishes session implementation conventions. |
| `docs/​backlog.md` | Updates analysis-reuse terminology. |
</details>

---

💡 <a href="/ronen/postcode/new/main?filename=.github/skills/code-review/SKILL.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add a `code-review` agent skill</a> or configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

### Inline comment 4084949168

Author: `Copilot`
Source: [4084949168](https://github.com/ronen/postcode/pull/6#discussion_r4084949168)
created_at: `2026-09-23T16:47:26Z`
updated_at: `2026-09-23T16:47:28Z`
commit_id: `841f51098dbb33cfe0c231a29e2816bf99983254`
original_commit_id: `841f51098dbb33cfe0c231a29e2816bf99983254`
pull_request_review_id: `5293938719`
path: `src/lib/typescript/dependencies.ts`
side: `RIGHT`
line: `35`
original_line: `35`
subject_type: `line`

The session ID is allocated during project opening, before this preparation function is invoked. This should describe the captured-input boundary instead of implying that preparation finalizes session identity.

### Inline comment 4084949226

Author: `Copilot`
Source: [4084949226](https://github.com/ronen/postcode/pull/6#discussion_r4084949226)
created_at: `2026-09-23T16:47:27Z`
updated_at: `2026-09-23T16:47:28Z`
commit_id: `841f51098dbb33cfe0c231a29e2816bf99983254`
original_commit_id: `841f51098dbb33cfe0c231a29e2816bf99983254`
pull_request_review_id: `5293938719`
path: `src/lib/typescript/expansions.ts`
side: `RIGHT`
line: `28`
original_line: `28`
subject_type: `line`

Session identity is already allocated when the project opens, before this lazy preparation runs, so this comment documents an ordering that no longer exists. The relevant boundary here is materialization of captured input support.

### Inline comment 4084949274

Author: `Copilot`
Source: [4084949274](https://github.com/ronen/postcode/pull/6#discussion_r4084949274)
created_at: `2026-09-23T16:47:27Z`
updated_at: `2026-09-23T16:47:28Z`
commit_id: `841f51098dbb33cfe0c231a29e2816bf99983254`
original_commit_id: `841f51098dbb33cfe0c231a29e2816bf99983254`
pull_request_review_id: `5293938719`
path: `test/dependency-provider-probe.ts`
side: `RIGHT`
line: `67`
original_line: `67`
subject_type: `line`

This reports the opposite of the new identity contract: session IDs are random namespaces and are explicitly independent of analysis inputs (`docs/implementation-conventions.md:49`). Emitting this text makes probe results misdescribe how identity works.
