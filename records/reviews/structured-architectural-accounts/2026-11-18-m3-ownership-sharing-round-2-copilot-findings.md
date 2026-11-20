# M3 ownership-aware sharing review: round 2 Copilot findings

Record type: findings
Received: 2026-11-18
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer`; inline author `Copilot`)
Handoff: [M3 ownership-aware sharing review](2026-11-18-m3-ownership-sharing-handoff.md)
Round: 2
Reviewed target: `8719c25602dda05965567562d39b0d779b579f38`
Prior findings: [round 1](2026-11-18-m3-ownership-sharing-round-1-findings.md)
Prior reviewed target: `f4e8a386de51eda7483227dd386b9d6f265b730a`

## Retrieval method and scope

The human requested retrieval and correction of Copilot's current PR review. Retrieved all pages with `gh api --paginate --slurp` from `repos/ronen/postcode/pulls/14/reviews`, `pulls/14/comments`, and `issues/14/comments`: four submitted reviews, twelve inline comments, and zero conversation comments. This record preserves the latest Copilot review (ID `5962139661`, submitted `2026-11-18T17:51:53Z`) and its one inline comment, ID `4618453312`, verbatim. There are no replies to that inline comment or additional conversation components. The other three reviews and eleven inline comments concern earlier revisions and are excluded from this latest-review scope; the latest overview's references to two resolved earlier comments are retained as authored. No requested component was unavailable.

The PR review targets `8719c25`; its product source, tests and profiler are unchanged from `f4e8a38`. This assignment covers the ownership finding below. Interpretation, correction and verification belong outside the preserved source text.

## Retrieved findings

### Overall review

Source: [review 5962139661](https://github.com/ronen/postcode/pull/14#pullrequestreview-5962139661)

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

Capturing a retained cyclic object after disposal causes a stack overflow because freezeOwned revisits the cycle, so the disposal path needs cycle-aware handling and regression coverage.

<details open>
<summary><strong>1 open issue</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Make disposal-time freezing cycle-safe for retained cyclic values](https://github.com/ronen/postcode/pull/14#discussion_r4618453312) · New
</details>

<details>
<summary><strong>2 resolved since last review</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Load the child process from the test&#39;s build directory](https://github.com/ronen/postcode/pull/14#discussion_r4612010715)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Correct migration status for the implemented application and agent route](https://github.com/ronen/postcode/pull/14#discussion_r4612010787)
</details>

<sub>Review effort: Balanced</sub>

### Inline comment 4618453312

Source: [comment 4618453312](https://github.com/ronen/postcode/pull/14#discussion_r4618453312)
Author: `Copilot`
Location: `src/lib/immutable.ts`, line 30
Commit: `8719c25602dda05965567562d39b0d779b579f38`

Disposal changes which plain graphs can be captured: a self-referential object captures successfully before `dispose()`, but capturing that same retained value afterward throws `RangeError: Maximum call stack size exceeded`, because `freezeOwned` recursively revisits the cycle. This contradicts the new cycle-preservation behavior and the intended ability to finish captures after disposal without sharing. Keep this path cycle-aware without restoring the disposed owner's registry, and cover a cyclic value in the disposal regression.
