Record type: findings

# Product-design reconciliation final integrated review: round 4 Copilot findings

Received: 2026-11-03
Reviewer: GitHub Copilot (`copilot-pull-request-reviewer[bot]`)
Handoff: [Final integrated review](2026-11-03-final-integrated-handoff.md)
Round: 4 (external PR re-review retrieved at human direction)
Reviewed target: `3016c1f64ddcc668cbe8cc1a2f5daf067bd9ac81`
Prior findings: [Round 3 Copilot findings](2026-11-03-final-integrated-round-3-copilot-findings.md)
Prior reviewed target: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Corrections presented: `c4c905451079fc915a110fea5cd8f291d958a05c`; the reviewed target additionally contains the updated disposition.

## Retrieval scope and method

Retrieved all pages using `gh api --paginate --slurp` for `repos/ronen/postcode/pulls/12/reviews`, `repos/ronen/postcode/pulls/12/comments` and `repos/ronen/postcode/issues/12/comments`: two overall reviews, four inline comments, zero inline replies and zero conversation comments. The earlier overall review body is unchanged and remains preserved in round 3. This record preserves the new overall review and all four inline comments it references, including the three carried forward from the previous review, in API order.

Each included source body is preserved verbatim, without redaction or normalization. API metadata is reduced to identity, author, original/current location and commit, timestamps and source links. Null current locations are retained as such; they are not inferred. No components were unavailable. Copilot reports Balanced review effort and state COMMENTED; it does not report test execution or following the repository handoff.

## Retrieved findings

### Overall review 5756190543

Author: `copilot-pull-request-reviewer[bot]`
Submitted: 2026-11-03T16:50:36Z
Source: https://github.com/ronen/postcode/pull/12#pullrequestreview-5756190543

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

The recursive scan includes caller-supplied request data as recognized representation limits, causing false `representation-limited` reports.

<details open>
<summary><strong>2 open issues</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Exclude caller-supplied limits from representation-limit scans](https://github.com/ronen/postcode/pull/12#discussion_r4457786990) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Exclude rejected request data from attribution scans](https://github.com/ronen/postcode/pull/12#discussion_r4457237504)
</details>

<details>
<summary><strong>2 resolved since last review</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Render bounded diagnostics in Unicode support inspection](https://github.com/ronen/postcode/pull/12#discussion_r4457237425)
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Apply fence filtering and omission counts to retained tag bodies](https://github.com/ronen/postcode/pull/12#discussion_r4457237367)
</details>

<sub>Review effort: Balanced</sub>

### Inline comment 4457237367

Author: `Copilot`
Review ID: 5755513563
Location: `src/lib/documentation-view.ts`; current line None, original line 90
Current commit: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Original commit: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Created: 2026-11-03T16:06:32Z
Updated: 2026-11-03T16:06:33Z
Source: https://github.com/ronen/postcode/pull/12#discussion_r4457237367

Retained tag bodies bypass the fence filter: an `@see` containing `Architecture ```read(1)``` reference` reaches module/export documentation and investigation support unchanged in text and JSON, with no representation limit. Apply the same plain-text-aware fence handling to retained tags, preserve adjacent prose, and include removed characters in the original tag omission counts.

### Inline comment 4457237425

Author: `Copilot`
Review ID: 5755513563
Location: `src/lib/investigation/presentation.ts`; current line 176, original line 176
Current commit: `3016c1f64ddcc668cbe8cc1a2f5daf067bd9ac81`
Original commit: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Created: 2026-11-03T16:06:32Z
Updated: 2026-11-03T16:06:33Z
Source: https://github.com/ronen/postcode/pull/12#discussion_r4457237425

Unicode investigram inspection serializes support qualifications directly at line 273, but never renders the top-level diagnostic meanings added here. Claims supported by malformed files therefore expose raw diagnostics without problem/consequence/action wording, and all occurrences bypass the five-code/three-occurrence bounds. Render these diagnostics through `diagnosticLines`, keeping complete occurrence arrays in JSON rather than the Unicode support serialization.

### Inline comment 4457237504

Author: `Copilot`
Review ID: 5755513563
Location: `src/lib/source-disclosure.ts`; current line None, original line 83
Current commit: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Original commit: `3353e70ad859d34094bdf61aaed9fc317b28b587`
Created: 2026-11-03T16:06:33Z
Updated: 2026-11-03T16:06:33Z
Source: https://github.com/ronen/postcode/pull/12#discussion_r4457237504

This recursive scan treats preserved rejected-request data as analyzer provenance: a JSON request with an invalid selector such as `{ diagnostics: [{ code: 2307, path: '/not-analyzed.ts' }] }` produces an `attribution-disclosed` event despite no analysis occurring. Collect diagnostic locations only from owned qualification/support fields, excluding rejected input, so caller data cannot manufacture evidence-disclosure events.

### Inline comment 4457786990

Author: `Copilot`
Review ID: 5756190543
Location: `src/lib/observations.ts`; current line 141, original line 141
Current commit: `3016c1f64ddcc668cbe8cc1a2f5daf067bd9ac81`
Original commit: `3016c1f64ddcc668cbe8cc1a2f5daf067bd9ac81`
Created: 2026-11-03T16:50:36Z
Updated: 2026-11-03T16:50:36Z
Source: https://github.com/ronen/postcode/pull/12#discussion_r4457786990

A rejected JSON request with `selector: { representationLimits: ['caller marker'] }` preserves that value even when the report's own `resolution.representationLimits` is empty. This recursive scan nevertheless records the caller's marker and emits `representation-limited`, falsely reporting a limit recognized by PostCode. Collect limits only from owned documentation, support-assertion and resolution fields, excluding request and attribution data.

