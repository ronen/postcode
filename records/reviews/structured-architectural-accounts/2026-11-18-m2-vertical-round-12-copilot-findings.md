Record type: findings
Received: 2026-11-18
Reviewer: GitHub Copilot
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 12
Reviewed target: `c2132181bb8028c0678af46c8cecade1cf96976f`
Prior findings: [Round 11](2026-11-18-m2-vertical-round-11-claude-findings.md); previous Copilot review [round 6](2026-11-17-m2-vertical-round-6-copilot-findings.md)
Prior reviewed target: round 11 production `4267a051754f62f1c728295cfe94c09b4b9354af`, tests/records through `f31919a`; previous Copilot target `c13abfb687899eb8a6be0055df29f3c63e951aef`

## Retrieval scope

Retrieved through `gh api --paginate --slurp` from PR #14 reviews, inline comments and conversation comments. All pages were retrieved: 3 review submissions, 11 inline comments and 0 conversation comments. This record preserves the newest review submission and its two inline comments in source order. Earlier submissions and their nine inline comments belong to prior review rounds and are not duplicated. No conversation comments or replies were present. Source bodies below are preserved verbatim; labels and retrieval metadata are repository-authored. Copilot reports its review effort as Balanced; it supplies no executed test evidence. Its summary acknowledges three prior issues as resolved and identifies two new issues. No M2 acceptance is inferred.

## Retrieved findings

### Review submission 5954280234

Author: copilot-pull-request-reviewer[bot]  
Submitted: 2026-11-18T09:56:19Z  
Source: https://github.com/ronen/postcode/pull/14#pullrequestreview-5954280234

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

The regression test loads the checkout’s `_build` instead of the build under test, risking stale results or failures, and the architecture documentation misstates the implemented migration status.

<details open>
<summary><strong>2 open issues</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Load the child process from the test&#39;s build directory](https://github.com/ronen/postcode/pull/14#discussion_r4612010715) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Correct migration status for the implemented application and agent route](https://github.com/ronen/postcode/pull/14#discussion_r4612010787) · New
</details>

<details>
<summary><strong>3 resolved since last review</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Preserve qualified displacement evidence in the snapshot](https://github.com/ronen/postcode/pull/14#discussion_r4604460908)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Validate requirements and Presentation before invoking follow-ups](https://github.com/ronen/postcode/pull/14#discussion_r4604460840)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Avoid excluding project inputs for optional report output](https://github.com/ronen/postcode/pull/14#discussion_r4604460740)
</details>

<sub>Review effort: Balanced</sub>

### Inline comment 1: 4612010715

Author: Copilot  
Location: `test/contribution-measurement.test.ts`, line 15  
Source: https://github.com/ronen/postcode/pull/14#discussion_r4612010715

The child process always loads the checkout's `_build`, rather than the build containing this running test. If the suite is compiled into a separate verification directory, this regression either exercises a stale `_build` or fails because `_build` is absent. Resolve the build directory relative to the compiled test, as required by `docs/implementation-conventions.md:41`, so the measurement checks the implementation actually under test.

### Inline comment 2: 4612010787

Author: Copilot  
Location: `docs/architecture/README.md`, line 34  
Source: https://github.com/ronen/postcode/pull/14#discussion_r4612010787

The migration status here contradicts the implementation in this PR: `applicationCatalog` now registers `state-behavior` and `follow-up`, and `openApplication` connects them to `contributionEvaluation` and the dialog agent. Only the CLI and earlier interpretation operations remain on the old path. Please distinguish those remaining gaps from the implemented application/agent route so this architecture entry point does not tell callers that the new API is unavailable.

