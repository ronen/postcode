# Structured architectural accounts final integrated review: round 10 Copilot findings

Record type: findings
Received: 2026-11-20
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]`; inline author `Copilot`)
Handoff: [Final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 10
Reviewed target: `5dc5d18c4c09aa949040b73b26f131b9c048c421`; production implementation `25e9361b12580cd6440fcff38b6f7b44907a86fd`
Prior findings: [Round 9](2026-11-20-m4-integrated-round-9-codex-findings.md)
Prior reviewed target: `cbd3c91722cdab21a35cac6bd05f2c47528fc09a`; production `25e9361b12580cd6440fcff38b6f7b44907a86fd`
External review: [5995804261](https://github.com/ronen/postcode/pull/14#pullrequestreview-5995804261)
Submitted: 2026-11-20T16:16:32Z
State: COMMENTED

## Retrieval scope and method

At the human's request, retrieved all pages of PR 14 reviews, inline comments and issue-conversation comments using `gh api --paginate --slurp` against `repos/ronen/postcode/pulls/14/reviews`, `pulls/14/comments` and `issues/14/comments`. The returned inventories contained 5 reviews, 13 inline comments and 0 conversation comments. The latest review is `5995804261` at the target above. Preserved its complete overview and its one new inline finding below, together with the older inline comment explicitly marked resolved in that overview. No replies or conversation comments accompanied these components. The four earlier review overviews and other historical inline comments are outside this new review's scope and were not duplicated. Nothing in the selected component bodies was redacted, summarized or normalized.

This is Copilot's automated balanced-effort PR review. No independent test execution or more specific inspected scope is reported in its returned text. Interpretation and disposition belong in the separate disposition record.

## Retrieved findings

### Overall review — Copilot

Source: [5995804261](https://github.com/ronen/postcode/pull/14#pullrequestreview-5995804261)

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

The lookup uses only `native.key`, allowing distinct entities to be misclassified as the session’s original module and inspection or investigation to use the wrong mechanical content.

<details open>
<summary><strong>1 open issue</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Validate full entity identity before resolving provider records](https://github.com/ronen/postcode/pull/14#discussion_r4644815175) · New
</details>

<details>
<summary><strong>1 resolved since last review</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Make disposal-time freezing cycle-safe for retained cyclic values](https://github.com/ronen/postcode/pull/14#discussion_r4618453312)
</details>

<sub>Review effort: Balanced</sub>

### Earlier comment marked resolved by this review — Copilot

Source: [4618453312](https://github.com/ronen/postcode/pull/14#discussion_r4618453312)
Review ID: `5962139661`
File: `src/lib/immutable.ts`
Original location: line 30, RIGHT; original commit `8719c25602dda05965567562d39b0d779b579f38`
Retrieved current location: line 36, commit `5dc5d18c4c09aa949040b73b26f131b9c048c421`

Disposal changes which plain graphs can be captured: a self-referential object captures successfully before `dispose()`, but capturing that same retained value afterward throws `RangeError: Maximum call stack size exceeded`, because `freezeOwned` recursively revisits the cycle. This contradicts the new cycle-preservation behavior and the intended ability to finish captures after disposal without sharing. Keep this path cycle-aware without restoring the disposed owner's registry, and cover a cyclic value in the disposal regression.

### New finding — Copilot

Source: [4644815175](https://github.com/ronen/postcode/pull/14#discussion_r4644815175)
Review ID: `5995804261`
File: `src/lib/contributions/subjects.ts`
Original location: line 66, RIGHT; original commit `5dc5d18c4c09aa949040b73b26f131b9c048c421`
Retrieved current location: line 66, commit `5dc5d18c4c09aa949040b73b26f131b9c048c421`

This lookup maps an Entity to a provider record using only `native.key`, although the ledger allows distinct Entities with that key under different providers, identity rules, or scopes. Such an Entity can therefore be classified as this Session's original module, causing inspection or investigation to use that module's mechanical content instead. Validate the complete native identity, Entity kind, and implemented modality before returning the provider record.
