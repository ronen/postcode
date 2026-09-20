Record type: findings
Received: 2026-09-20
Reviewer: GitHub Copilot
Handoff: [Integrated handoff](2026-09-17-integrated-handoff.md)
Round: 3 (second Copilot round)
Reviewed target: `bb29a6dd99808bce31331c860225d25e2101679c`
Prior findings: [Round 2 — Copilot](2026-09-20-integrated-round-2-copilot-findings.md)
Prior reviewed target: `51148890e634021a6e47862d37d7bd06798e70d0`
External PR: https://github.com/ronen/postcode/pull/4

# Integrated review: Copilot round 3

## Retrieval method and scope

Retrieved all pages with `gh api --paginate` for
`repos/ronen/postcode/pulls/4/reviews`, `repos/ronen/postcode/pulls/4/comments`,
and `repos/ronen/postcode/issues/4/comments`. Responses contained two reviews,
four inline comments and no conversation comments. This record preserves the new
review `5260102601` and its one annotation, in API order. The earlier review and
three earlier annotations are preserved in round 2 and not duplicated here; their
bodies were checked unchanged. No replies or other conversation were returned.
All selected bodies are preserved verbatim without redaction or normalization;
metadata wrappers are repository-authored. Review scope is PR #4 against main,
including the exact partition, pluralization and documentation corrections since
round 2. No test execution is reported by this reviewer.

## Retrieved findings

### Overall review 5260102601

Author: copilot-pull-request-reviewer[bot]
Source: https://github.com/ronen/postcode/pull/4#pullrequestreview-5260102601

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

Store validation still permits multiple disjointly supported relationships for the same ordered module pair, allowing duplicate direct edges.

*Get a fresh assessment by requesting another Copilot review.*

**Review effort:** Balanced  
**Findings:** 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (1)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Reject duplicate relationships for the same ordered parent/child pair](#discussion_r4056541956) · New
</details>

<details>
<summary><strong>Resolved since last review (3)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Require relationships to partition all resolved occurrences exactly](#discussion_r4056501244)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Pluralize output nouns according to their counts](#discussion_r4056501262)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Update architecture overview to reflect integrated dependency layers](#discussion_r4056501275)
</details>

### Inline comment 4056541956

Author: Copilot
Source: https://github.com/ronen/postcode/pull/4#discussion_r4056541956
Location: `src/lib/memory-store.ts`; line 165; original line 165; side RIGHT

The exact-occurrence check still accepts two distinct relationship records for the same ordered parent/child pair when they partition that pair's occurrences between them. That violates the aggregation invariant (one relationship per ordered module pair) and lets projections double-count a direct edge. Track each relationship's `(subject, child)` pair here and reject duplicates; add a regression that splits two same-pair occurrences across two pending relationships.

