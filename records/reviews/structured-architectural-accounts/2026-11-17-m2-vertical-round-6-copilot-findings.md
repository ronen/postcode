# M2 early vertical application review — round 6, Copilot

Record type: findings
Received: 2026-11-17
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]`; inline author `Copilot`)
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 6
Reviewed target: `c13abfb687899eb8a6be0055df29f3c63e951aef`
Prior findings: [M2 round 5](2026-11-17-m2-vertical-round-5-claude-findings.md); Copilot's previous [M1 round 3](2026-11-15-m1-mechanism-round-3-copilot-findings.md)
Prior reviewed target: `6f72f86d7cf4cfa1dd61c34e4455cc97ec42133b` (M2 round 5); `eb09a8269bf4f9d22644ff75c89d0abb5faca7af` (previous Copilot review)
Pull request: [#14](https://github.com/ronen/postcode/pull/14)

## Retrieval method and scope

Retrieved with `gh api --paginate --slurp` from all three PR endpoints: `pulls/14/reviews`, `pulls/14/comments`, and `issues/14/comments`. Each endpoint returned one page: two reviews, nine inline comments and zero conversation comments. This record preserves the latest review (ID 5944897386, submitted 2026-11-17T19:12:07Z) and all three of its inline annotations, in returned order, with their bodies verbatim. The older M1 review and its six inline comments were retrieved but are not duplicated; they are already preserved in the linked M1 findings. The latest overview's resolved-issue references are preserved as authored. No conversation comments or replies were present. No source text was redacted or normalized.

The review is GitHub's PR review, not evidence that Copilot followed the local handoff or performed offline verification. The returned text states its recommendation and scope; it gives no test results. Implementation interpretation and corrections are separate from this record.

## Retrieved findings

### Overall review

Source: [5944897386](https://github.com/ronen/postcode/pull/14#pullrequestreview-5944897386) · author `copilot-pull-request-reviewer[bot]` · target `c13abfb687899eb8a6be0055df29f3c63e951aef`

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

Follow-ups bypass requirement and presentation checks, displacement exports lose qualifications and supporting evidence, and report-path exclusions can omit project inputs or prevent measurement entirely.

<details open>
<summary><strong>3 open issues</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Avoid excluding project inputs for optional report output](https://github.com/ronen/postcode/pull/14#discussion_r4604460740) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Validate requirements and Presentation before invoking follow-ups](https://github.com/ronen/postcode/pull/14#discussion_r4604460840) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Preserve qualified displacement evidence in the snapshot](https://github.com/ronen/postcode/pull/14#discussion_r4604460908) · New
</details>

<details>
<summary><strong>6 resolved since last review</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Freeze declaration entries before exposing them](https://github.com/ronen/postcode/pull/14#discussion_r4583611450)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Reject duplicate production IDs within a batch](https://github.com/ronen/postcode/pull/14#discussion_r4583611415)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Return an immutable snapshot of displacement entries](https://github.com/ronen/postcode/pull/14#discussion_r4583611363)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Suppress changes disclosed through membership status](https://github.com/ronen/postcode/pull/14#discussion_r4583611612)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Validate excerpt bounds before recording member exposure](https://github.com/ronen/postcode/pull/14#discussion_r4583611559)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Default method-filtered identifications to standing states](https://github.com/ronen/postcode/pull/14#discussion_r4583611504)
</details>

<sub>Review effort: Balanced</sub>

### Inline annotation 1

Source: [4604460740](https://github.com/ronen/postcode/pull/14#discussion_r4604460740) · author `Copilot` · `scripts/measure-contribution-session.mjs` line 23 at `c13abfb687899eb8a6be0055df29f3c63e951aef` · created 2026-11-17T19:12:06Z

Saving the optional report beside the project's tsconfig adds the entire project root to the evidence exclusions, preventing the measurement from opening the project; saving it inside a source directory excludes that whole subtree instead. Do not treat an arbitrary report parent as generated output. Require and validate a dedicated report directory that contains no project inputs, or provide exact-file exclusion.

### Inline annotation 2

Source: [4604460840](https://github.com/ronen/postcode/pull/14#discussion_r4604460840) · author `Copilot` · `src/lib/application/executor.ts` line 156 at `c13abfb687899eb8a6be0055df29f3c63e951aef` · created 2026-11-17T19:12:06Z

This early return bypasses the requirements and prospective Presentation checks below: follow-ups silently ignore unsupported expansions, and an incompatible Presentation is refused only after the dialog runs. That can spend hosted requests and accept organizing changes for a request already known to be unpresentable. Check supported requirements and prospective Presentation compatibility before invoking the follow-up.

### Inline annotation 3

Source: [4604460908](https://github.com/ronen/postcode/pull/14#discussion_r4604460908) · author `Copilot` · `src/lib/exports/content.ts` line 46 at `c13abfb687899eb8a6be0055df29f3c63e951aef` · created 2026-11-17T19:12:07Z

The displacement snapshot retains only grounds text, dropping the declaring producer, owner/declaration qualifications, and grounds evidence/support. A hypothetical or narrowly scoped withdrawal therefore appears in `renderModuleExports` without its limitations, which exact presentation cannot recover from this snapshot. Capture fixed, qualified displacement support and render it separately from the mechanical finding's qualification.

