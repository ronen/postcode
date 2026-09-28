Record type: findings
Received: 2026-09-28
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]` / `Copilot`, account ID 175728472)
Handoff: [M5 integrated foundation review](2026-09-28-m5-integrated-handoff.md)
Round: 2
Reviewed target: `996b0d3cfffb2ceb12d455c734ebd647cfc729ca`
Prior findings: [M5 round 1](2026-09-28-m5-integrated-round-1-findings.md)
Prior reviewed target: `9f8c8bd85e94428b11abb5b415e98cebb1f50901`
Review transport: [GitHub PR #7](https://github.com/ronen/postcode/pull/7)

## Retrieval and scope

Retrieved on 2026-09-28 through `gh api --paginate --slurp` from
`repos/ronen/postcode/pulls/7/reviews`, `repos/ronen/postcode/pulls/7/comments`
and `repos/ronen/postcode/issues/7/comments`. Each endpoint returned one page:
one overall review, one inline review comment, and zero conversation comments.
No source components were filtered or redacted. Bodies below retain their exact
API-returned text, including mixed line endings, HTML and invisible characters.
Repository-authored labels separate the source components; they are not part of
the reviewer's text. Retrieval is complete for those endpoints at this snapshot.

The PR API identified the head as the reviewed target above and the base as
`6af13629aa50d875b378bf8d0294a9fda5e356d3`. This was a PR review of that diff;
Copilot did not state that it followed the repository handoff, ran tests, or
independently verified all plan gates. Its own scope and recommendation are
preserved below without inferring additional verification. Since round 1, changes
include the scanner diagnostic correction (`1a8ee38`), prefix-fit investigation
and regression coverage (`c507781`), and review/task records through the target.

## Retrieved findings

### Overall review

Author: `copilot-pull-request-reviewer[bot]`
Review ID: `5342049571`
Submitted: `2026-09-28T17:01:57Z`
State: `COMMENTED`
Source: https://github.com/ronen/postcode/pull/7#pullrequestreview-5342049571

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🔵 Needs a closer look

The broad cross-cutting ownership and execution changes require final human review, and the plan index still reports the obsolete M3 checkpoint.

**Review effort:** Balanced  
**Findings:** 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (1)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Update plan index from stale M3 to current M5 milestone](#discussion_r4124906805) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

Implements the foundation-readiness plan across analysis ownership, execution, publication, graph processing, indexing, and CLI behavior.

**Changes:**
- Adds immutable, reference-aware records and indexed analysis processing.
- Introduces worker-isolated analysis, parent-owned Git execution, and atomic observation publication.
- Improves terminal layout, strict option parsing, tests, documentation, and validation evidence.

| File | Description |
| ---- | ----------- |
| `test/​terminal-layout.test.ts` | Tests Unicode layout and fitting. |
| `test/​source-evidence.test.ts` | Adapts evidence tests to async opening. |
| `test/​shell.test.ts` | Strengthens interactive-shell testing. |
| `test/​session-comparison.ts` | Adds safe comparison-session cleanup. |
| `test/​repository-probe.ts` | Awaits repository capture. |
| `test/​records.test.ts` | Adapts record tests to async discovery. |
| `test/​processing-index.test.ts` | Tests indexed processing costs and order. |
| `test/​process-probe.ts` | Awaits discovery in the probe. |
| `test/​organization-cli.test.ts` | Consolidates CLI helpers and async behavior. |
| `test/​observation-publication.test.ts` | Tests atomic publication and failure boundaries. |
| `test/​inputs.test.ts` | Tests candidate failures and replay stability. |
| `test/​helpers.ts` | Makes discovery async and shares comparison logic. |
| `test/​directed-graph.test.ts` | Tests delegated graph operations. |
| `test/​dependency-repository-probe.ts` | Awaits project openings. |
| `test/​dependency-provider-probe.ts` | Awaits dependency project opening. |
| `test/​dependency-presentation.test.ts` | Consolidates fixtures and reference comparisons. |
| `test/​compiler-candidate-paths.test.ts` | Tests candidate recovery through all entry paths. |
| `test/​comparison.ts` | Adds reference-aware session normalization. |
| `test/​commands.test.ts` | Tests strict option grammar and diagnostics. |
| `test/​cli-helpers.ts` | Adds shared CLI and fixture helpers. |
| `STATUS.md` | Documents current capabilities and limits. |
| `src/​lib/​typescript/​inputs.ts` | Shares output policy and stable replay handling. |
| `src/​lib/​typescript/​diagnostics.ts` | Adds indexed diagnostic selection. |
| `src/​lib/​typescript/​dependencies.ts` | Indexes diagnostics and corrects identity keys. |
| `src/​lib/​typescript/​composition.ts` | Uses indexed diagnostics and reference-aware IDs. |
| `src/​lib/​terminal-text.ts` | Makes tabs visibly escaped. |
| `src/​lib/​terminal-layout.ts` | Adds grapheme- and cell-aware layout. |
| `src/​lib/​shell.ts` | Uses worker execution and separated cleanup reporting. |
| `src/​lib/​session-worker.ts` | Coordinates compiler work and parent-owned Git. |
| `src/​lib/​session-protocol.ts` | Defines worker messages and error translation. |
| `src/​lib/​repository/​layout.ts` | Delegates reachability and edge checks. |
| `src/​lib/​records.ts` | Adds non-throwing record lookup. |
| `src/​lib/​qualification-policy.ts` | Centralizes qualification policy. |
| `src/​lib/​projections.ts` | Corrects reference identity and completion checks. |
| `src/​lib/​organization/​projections.ts` | Delegates ancestry and corrects projection identity. |
| `src/​lib/​organization/​placement.ts` | Adds weakly retained placement indexes. |
| `src/​lib/​observations.ts` | Adds grouped atomic observation publication. |
| `src/​lib/​memory-store.ts` | Adds immutable ownership and evaluation indexes. |
| `src/​lib/​immutable.ts` | Adds owned-value deep freezing. |
| `src/​lib/​identity.ts` | Adds explicit reference normalization and batch bindings. |
| `src/​lib/​git-execution.ts` | Adds bounded parent-owned Git execution. |
| `src/​lib/​execution-errors.ts` | Centralizes execution failure types. |
| `src/​lib/​evaluation.ts` | Publishes coupled outcomes atomically. |
| `src/​lib/​evaluation-state.ts` | Shares materialization completion checks. |
| `src/​lib/​directed-graph.ts` | Encapsulates Stately graph operations. |
| `src/​lib/​dependencies/​projections.ts` | Corrects dependency projection identity. |
| `src/​lib/​dependencies/​organization.ts` | Indexes ancestry and reuses immutable derivations. |
| `src/​lib/​dependencies/​graph.ts` | Delegates SCC computation. |
| `src/​lib/​dependencies/​evaluate.ts` | Returns store-owned dependency outcomes. |
| `src/​lib/​composition-view.ts` | Prepares indexed composition views. |
| `src/​lib/​commands.ts` | Adopts strict Node option scanning. |
| `src/​lib/​command-execution.ts` | Separates delivery and cleanup failures. |
| `src/​lib/​cli.ts` | Runs one-shot analysis through the worker boundary. |
| `scripts/​profile-analysis.mjs` | Supports async and worker profiling. |
| `scripts/​probe-compiler-interruption.mjs` | Verifies worker interruption behavior. |
| `scripts/​measure-partial-session.mjs` | Adapts session measurements to async APIs. |
| `scripts/​measure-analysis.mjs` | Records build and worker measurements. |
| `scripts/​comparison-fixtures.mjs` | Shares reproducible comparison fixtures. |
| `scripts/​compare-session-requests.mjs` | Expands safe session comparisons. |
| `scripts/​compare-analysis.mjs` | Expands build-aligned CLI comparisons. |
| `records/​validation/​foundation-readiness/​m5-fit-prefix-probe.mjs` | Adds independent prefix-fitting validation. |
| `records/​validation/​foundation-readiness/​m5-fit-prefix-probe-result.json` | Records prefix-fitting results. |
| `records/​validation/​foundation-readiness/​m4-session-comparison.json` | Records M4 session equivalence. |
| `records/​validation/​foundation-readiness/​m4-measurements/​summary.json` | Summarizes performance samples. |
| `records/​validation/​foundation-readiness/​m4-measurements/​conditions.json` | Records measurement conditions. |
| `records/​validation/​foundation-readiness/​m4-measurements/​2400-2-before-organization.json` | Records baseline organization measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​2400-2-before-modules.json` | Records baseline module measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​2400-2-after-organization.json` | Records updated organization measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​2400-2-after-modules.json` | Records updated module measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​2400-1-before-organization.json` | Records baseline organization measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​2400-1-before-modules.json` | Records baseline module measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​2400-1-after-organization.json` | Records updated organization measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​2400-1-after-modules.json` | Records updated module measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​240-2-before-organization.json` | Records baseline organization measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​240-2-before-modules.json` | Records baseline module measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​240-2-after-organization.json` | Records updated organization measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​240-2-after-modules.json` | Records updated module measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​240-1-before-organization.json` | Records baseline organization measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​240-1-before-modules.json` | Records baseline module measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​240-1-after-organization.json` | Records updated organization measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements/​240-1-after-modules.json` | Records updated module measurement. |
| `records/​validation/​foundation-readiness/​m4-measurements.mjs` | Adds reproducible M4 measurement driver. |
| `records/​validation/​foundation-readiness/​m3-session-comparison.json` | Records M3 session equivalence. |
| `records/​validation/​foundation-readiness/​m3-round-2-case-model.mjs` | Preserves filesystem case model. |
| `records/​validation/​foundation-readiness/​m3-round-2-case-model-result.json` | Records modeled filesystem defects. |
| `records/​validation/​foundation-readiness/​m3-round-1-session-comparison.json` | Records round-one comparisons. |
| `records/​validation/​foundation-readiness/​m3-round-1-regression-controls.json` | Records regression-control outcomes. |
| `records/​validation/​foundation-readiness/​m3-profile-smoke.json` | Records profiling smoke results. |
| `records/​validation/​foundation-readiness/​m3-compiler-probe.json` | Records compiler interruption results. |
| `records/​validation/​foundation-readiness/​m2-session-comparison.json` | Records M2 session comparisons. |
| `records/​validation/​foundation-readiness/​m2-round-1-session-comparison.json` | Records M2 round-one comparisons. |
| `records/​validation/​foundation-readiness/​m2-round-1-mutation-results.json` | Records identity mutation controls. |
| `records/​validation/​foundation-readiness/​m1-compiler-probe.json` | Records initial interruption baseline. |
| `records/​validation/​foundation-readiness/​2026-09-28-m3-round-2.md` | Documents M3 correction evidence. |
| `records/​reviews/​foundation-readiness/​2026-09-28-m5-integrated-disposition.md` | Records M5 findings and limits. |
| `records/​reviews/​foundation-readiness/​2026-09-28-m2-state-identity-round-2-findings.md` | Preserves independent M2 findings. |
| `package.json` | Pins graph and display-width dependencies. |
| `package-lock.json` | Locks new dependency trees. |
| `docs/​plans/​README.md` | Updates the plan index, but leaves a stale milestone. |
| `docs/​plans/​foundation-readiness.md` | Marks the plan active. |
| `docs/​cli-reference.md` | Documents new CLI, layout, and lifecycle behavior. |
| `docs/​backlog.md` | Records deferred filesystem defects. |
</details>

---

💡 <a href="/ronen/postcode/new/main?filename=.github/skills/code-review/SKILL.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add a `code-review` agent skill</a> or configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

### Inline finding

Author: `Copilot`
Comment ID: `4124906805`
Review ID: `5342049571`
Created: `2026-09-28T17:01:57Z`
Location: `docs/plans/README.md`, right-side line 9 (original line 9)
Commit: `996b0d3cfffb2ceb12d455c734ebd647cfc729ca`
Source: https://github.com/ronen/postcode/pull/7#discussion_r4124906805

This status is stale: M3 has been accepted and the integrated implementation is now at the M5 review gate. Leaving the plan index at the M3 checkpoint contradicts the current handoff and PR status; update it to the current milestone.
