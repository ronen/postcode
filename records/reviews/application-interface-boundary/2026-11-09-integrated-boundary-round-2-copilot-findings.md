Record type: findings
Received: 2026-11-09
Reviewer: GitHub Copilot (copilot-pull-request-reviewer[bot])
Handoff: [Integrated application boundary review](2026-11-09-integrated-boundary-handoff.md)
Round: 2
Reviewed target: `52a260b58fe30e3fc3a40a828e57f872d8455ff7`
Prior findings: [Integrated round 1](2026-11-09-integrated-boundary-round-1-findings.md)
Prior reviewed target: `e7de4b1ba5a222c0facc9b376c5a8c5b582e1386`

## Retrieval and scope

Retrieved PR #13 reviews, inline review comments and issue conversation comments using GitHub CLI `gh api --paginate --slurp` on 2026-11-09. All pages were read: 2 reviews, 3 inline annotations and 0 conversation comments. This record preserves review 5830794373 and every annotation it references, including the two prior M1 annotations carried into its summary as open/resolved. The earlier overall review is preserved in [M1 round 3](2026-11-09-m1-boundary-round-3-copilot-findings.md) and is not duplicated. No conversation comments were returned. Component bodies below are preserved verbatim, including embedded markup and original line endings. Repository labels identify source metadata; no source text is redacted.

The target includes the round 1 correlation-capture correction at `6191231` and its records. Copilot supplies no executed verification or separate gate recommendation beyond its report below; the prior review and implementation checks are not independent Copilot verification.

## Retrieved findings

### Overall review

Author: copilot-pull-request-reviewer[bot]
Submitted: 2026-11-09T18:37:47Z
Review ID: 5830794373
Source: https://github.com/ronen/postcode/pull/13#pullrequestreview-5830794373
State: COMMENTED

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

Eligibility checks read inherited option properties, so an empty options object can activate a constructor rule and throw an error instead of treating the option as absent.

<details open>
<summary><strong>2 open issues</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Ignore inherited properties when evaluating eligibility rules](https://github.com/ronen/postcode/pull/13#discussion_r4516499050) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Allow raw organization requests without Presentation group details](https://github.com/ronen/postcode/pull/13#discussion_r4511492976)
</details>

<details>
<summary><strong>1 resolved since last review</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Return SessionClosed if the session closes during perform](https://github.com/ronen/postcode/pull/13#discussion_r4511493065)
</details>

<sub>Review effort: Balanced</sub>

### Inline annotation 4511492976

Author: Copilot
Review ID: 5824285917
Location: `src/lib/application/executor.ts`, current line 147; original line 147
Original commit: `9b1446614d54a764ef50d2860be54652f49826ed`
Source: https://github.com/ronen/postcode/pull/13#discussion_r4511492976

A direct `organization` request with `requirements: { modules: [], groups: [] }` passes `supportedRequirements`, but this construction path calls `resolveOrganizationProjection`, whose guard in `organization/content.ts` throws `Organization presentation requires evaluated group-details`. The new API therefore rejects a supported subset with an exception and `defect` work status, even though no Presentation was requested. Separate raw organization-content resolution from the Presentation-only `group-details` requirement so this request, and subsequent raw exact retrieval, can return the fixed subset without acquiring extra detail.

### Inline annotation 4511493065

Author: Copilot
Review ID: 5824285917
Location: `src/lib/application/session.ts`, current line 144; original line 137
Original commit: `9b1446614d54a764ef50d2860be54652f49826ed`
Source: https://github.com/ronen/postcode/pull/13#discussion_r4511493065

If the host closes the session from the `onWork` finish callback, `close()` clears `state` while `perform()` is completing. This continuation then dereferences `state!.store` for an investigation answer and throws a `TypeError` instead of the typed `SessionClosed` outcome, even though application work is already completed. Recheck `allowed()` after awaiting `perform()` and before accessing state, as the scoped `check()` does after its await.

### Inline annotation 4516499050

Author: Copilot
Review ID: 5830794373
Location: `src/lib/application/consumption.ts`, current line 75; original line 75
Original commit: `52a260b58fe30e3fc3a40a828e57f872d8455ff7`
Source: https://github.com/ronen/postcode/pull/13#discussion_r4516499050

With an eligibility rule using `option: 'constructor'`, `when: 'present'` and `values: [true]`, an empty `options` object reads `Object.prototype.constructor` instead of treating the option as absent. `canonical(value)` then throws `Non-serializable identity input`, turning a valid request into an application defect. Restrict the lookup to own properties so inherited members cannot activate `present` or `truthy` rules.
