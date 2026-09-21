Record type: findings
Received: 2026-09-21
Reviewer: GitHub Copilot (copilot-pull-request-reviewer[bot] / Copilot)
Handoff: [Integrated handoff](2026-09-21-integrated-handoff.md), supplemented by the [PR review instructions](https://github.com/ronen/postcode/pull/5)
Round: 2 — Copilot PR review
Reviewed target: `98c3c18cc15c0e8fa9039d849c96ece640acd368`
Prior findings: [Claude round 1](2026-09-21-integrated-round-1-findings.md)
Prior reviewed target: `b74c454c08c95a5aae7aacff816b27019fecaf9f`

# Analysis latency integrated review: Copilot findings

## Retrieval scope and completeness

Retrieved using `gh api --paginate --slurp` for all three GitHub REST collections:
`repos/ronen/postcode/pulls/5/reviews`, `repos/ronen/postcode/pulls/5/comments`,
and `repos/ronen/postcode/issues/5/comments`. Each returned one page: one review,
one inline comment and zero conversation comments. All returned review and comment
bodies are preserved verbatim below, including overview text, formatting and
boilerplate. Metadata labels are repository-authored. No source component was
filtered, redacted or summarized, and no retrieval failure was encountered.
The overview's test-count allegation is preserved even though it has no separate
inline annotation. Interpretation belongs in the disposition, not this record.

The reviewed production code is unchanged from Claude's target; intervening
commits add the handoff, review findings, status and human follow-ups. The PR also
contains the antecedent documentation/process commits disclosed in its body.

## Retrieved findings

### Overall review 5270611121

Author: copilot-pull-request-reviewer[bot]
State: COMMENTED
Submitted: 2026-09-21T18:56:26Z
Reviewed commit: `98c3c18cc15c0e8fa9039d849c96ece640acd368`
Source: https://github.com/ronen/postcode/pull/5#pullrequestreview-5270611121

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

Benchmark retries can silently yield undersampled results, and two records misstate one skipped test as passed.

*Get a fresh assessment by requesting another Copilot review.*

**Review effort:** Lite  
**Findings:** 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (1)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Fail or mark incomplete when all sample retries are exhausted](#discussion_r4065385672) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

This PR reuses captured TypeScript source digests within each discovery call, reducing repeated hashing while preserving evidence semantics.

**Changes:**
- Adds bounded digest reuse and regression coverage.
- Adds profiling, comparison, benchmarking, and retained validation evidence.
- Updates status, architecture, task/review records, and documentation.

| File | Description |
|---|---|
| `test/​source-evidence.test.ts` | Tests digest reuse and fresh openings. |
| `STATUS.md` | Records latency investigation status. |
| `src/​lib/​typescript/​project.ts` | Implements discovery-local digest memoization. |
| `scripts/​profile-analysis.mjs` | Profiles disposable builds. |
| `scripts/​measure-analysis.mjs` | Measures fresh CLI invocations. |
| `scripts/​compare-analysis.mjs` | Compares baseline and optimized outputs. |
| `scripts/​benchmark-analysis.mjs` | Runs paired timing samples and retries. |
| `records/​validation/​2026-09-21-analysis-latency.md` | Documents measurements and limitations. |
| `records/​validation/​2026-09-21-analysis-latency-equivalence.json` | Retains equivalence results. |
| `records/​tasks/​2026-09-21-analysis-latency.md` | Records task scope and follow-ups. |
| `records/​reviews/​analysis-latency/​2026-09-21-integrated-round-1-findings.md` | Preserves prior review findings. |
| `records/​reviews/​analysis-latency/​2026-09-21-integrated-handoff.md` | Defines review scope and procedure. |
| `notes/​README.md` | Documents durable-note navigation. |
| `notes/​dependency-landscape.md` | Links dependency notes. |
| `notes/​candidate-capabilities.md` | Documents candidate capabilities. |
| `drafts/​README.md` | Documents note reclassification rules. |
| `docs/​README.md` | Documents durable notes. |
| `docs/​cli-reference.md` | Documents latency and digest reuse. |
| `docs/​backlog.md` | Records remaining latency work. |
| `docs/​architecture/​README.md` | Documents the bounded optimization. |
| `dev/​workflow.md` | Updates documentation categories. |
| `dev/​process-conventions.md` | Defines durable-note conventions. |
| `dev/​planning.md` | Defines draft-to-note reclassification. |
| `AGENTS.md` | Adds repository guidance for notes. |
</details>

---

💡 <a href="/ronen/postcode/new/main?filename=.github/skills/code-review/SKILL.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add a `code-review` agent skill</a> or configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

### Inline finding 4065385672

Author: Copilot
Review: 5270611121
Location: `scripts/benchmark-analysis.mjs:50` (RIGHT)
Commit: `98c3c18cc15c0e8fa9039d849c96ece640acd368`
Created: 2026-09-21T18:56:26Z
Updated: 2026-09-21T18:56:26Z
Source: https://github.com/ronen/postcode/pull/5#discussion_r4065385672

If all three attempts for a sample are excluded, this loop simply continues to the next sample and the script still exits successfully, so a later summary can report medians from fewer than the requested representatives. Fail the series (or explicitly mark it incomplete) when the retry budget is exhausted so contamination/timeout handling cannot silently produce an undersampled result.
