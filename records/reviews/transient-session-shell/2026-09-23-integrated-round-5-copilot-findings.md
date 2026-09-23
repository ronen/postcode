# Transient session shell integrated review: second Copilot review

Record type: findings
Received: 2026-09-23
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]`)
Handoff: [Integrated assignment](2026-09-23-integrated-handoff.md); supplementary PR review retrieved at human direction, without asserting that Copilot followed the handoff
Round: 5 (second Copilot PR review)
Reviewed target: `88f66b1f99d93694afc920fa12434c44f9118a7c`
PR base at retrieval: `0d59720fa22381cffa1f65ba22f5fdb478bc5e51`
Prior findings: [Round 4, Copilot](2026-09-23-integrated-round-4-copilot-findings.md)
Prior reviewed target: `841f51098dbb33cfe0c231a29e2816bf99983254`
Source: [PR #6](https://github.com/ronen/postcode/pull/6)

## Retrieval method and completeness

Retrieved 2026-09-23T19:40:01.877853+00:00 using `gh api` for PR metadata and
`gh api --paginate --slurp` for all pages of:

- `repos/ronen/postcode/pulls/6/reviews`: 2 reviews.
- `repos/ronen/postcode/pulls/6/comments`: 3 inline comments, including any replies.
- `repos/ronen/postcode/issues/6/comments`: 0 conversation comments.

Review 5293938719 and inline comments 4084949168, 4084949226 and 4084949274
are already preserved in round 4. Their bodies were checked byte-for-byte against
that record and are unchanged; they are not duplicated here. Their current inline
`line` positions are null after the correction. There were no new inline comments
or replies. The new review 5294207644 is preserved below in full: its issue is
embedded in the overview under "Previously missed (1)", even though that overview
also says "Findings: None". It has no separate inline-comment identifier.

All endpoints succeeded and pagination completed. No new body was omitted,
redacted or normalized. Repository-authored metadata is separate from the
verbatim body, including its embedded formatting and relative links. This records
what was available at retrieval time, not unpublished reasoning or later updates.
The reviewer reports balanced effort but no executed verification. Assessment
and disposition are recorded separately.

## Retrieved findings

### Overall review 5294207644

Author: `copilot-pull-request-reviewer[bot]`
Source: [5294207644](https://github.com/ronen/postcode/pull/6#pullrequestreview-5294207644)
state: `COMMENTED`
submitted_at: `2026-09-23T17:08:28Z`
commit_id: `88f66b1f99d93694afc920fa12434c44f9118a7c`

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🔵 Needs a closer look

Session-reference observation metadata incorrectly states that no continuity was established.

**Review effort:** Balanced  
**Findings:** None

<details>
<summary><strong>Resolved since last review (3)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Correct probe text to reflect input-independent random session IDs](#discussion_r4084949274)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Update comment to describe captured-input materialization boundary](#discussion_r4084949226)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Document captured-input boundary instead of session identity finalization](#discussion_r4084949168)
</details>

<details>
<summary><strong>Previously missed (1)</strong></summary>

In code that hasn't changed since last review

<details>
<summary><picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> Derive provenance text from projection.parameters.reference</summary>

`src/​lib/​observations.ts:41`

For shell `@` commands, `projection.parameters.reference` is true, but this batch still records the request as having “no previous view or cross-invocation continuity.” That contradicts the session-reference contract and misstates the request provenance for observation consumers. Derive this text from `parameters.reference` so reference navigation and name/handle lookup are distinguished.
</details>
</details>
