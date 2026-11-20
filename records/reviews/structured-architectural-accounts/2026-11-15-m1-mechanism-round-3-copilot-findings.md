Record type: findings
Received: 2026-11-16
Reviewer: GitHub Copilot pull-request reviewer (`copilot-pull-request-reviewer[bot]`)
Handoff: [M1 common contribution mechanism review](2026-11-15-m1-mechanism-handoff.md)
Round: 3
Reviewed target: `eb09a8269bf4f9d22644ff75c89d0abb5faca7af` (pull request head; implementation `5ebe10a19be93a2613ec5fe5cf5f5dcaf16df295` plus the checkpoint record)
Prior findings: [Round 1 findings](2026-11-15-m1-mechanism-round-1-findings.md); [Codex round 2 findings](2026-11-15-m1-mechanism-round-2-findings.md); [Claude round 2 findings](2026-11-15-m1-mechanism-round-2-claude-findings.md)
Prior reviewed target: `b02c7bcdd59e4253dbe9cddb761c590bb52ca360`

## Retrieved findings

Retrieved by the implementing agent on 2026-11-16 at the human's instruction, with the GitHub CLI:

- `gh api --paginate repos/ronen/postcode/pulls/14/reviews` — 1 review.
- `gh api --paginate repos/ronen/postcode/pulls/14/comments` — 6 inline review comments, all belonging to that review, none a reply.
- `gh api --paginate repos/ronen/postcode/issues/14/comments` — 0 conversation comments.

Scope: every review, inline annotation and conversation comment on [pull request #14](https://github.com/ronen/postcode/pull/14) at retrieval. Pagination was followed. Each component's text below is the API's `body` field, unedited, including its HTML and any invisible characters. The labels above each component are repository-authored. Nothing was filtered, summarized, reordered or redacted. The review ran against the whole pull request, not the handoff's assignment text; it is recorded in this series because it examined the same implementation. A parallel [Claude round 3 rereview](2026-11-15-m1-mechanism-round-3-claude-findings.md) examined target `5ebe10a`. Interpretation and disposition are recorded separately.

### Review overview

Kind: pull-request review, state `COMMENTED`
Author: `copilot-pull-request-reviewer[bot]`
Submitted: 2026-11-16T08:47:37Z
Commit: `eb09a8269bf4f9d22644ff75c89d0abb5faca7af`
Identifier: 5917216901 — https://github.com/ronen/postcode/pull/14#pullrequestreview-5917216901

<!-- ccr-overview-v2 -->

### 🟡 Changes recommended

Unresolved critical ledger flaws allow duplicate production IDs and externally mutable records to corrupt producer history, exact access, and association standing.

<details open>
<summary><strong>6 open issues</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Return an immutable snapshot of displacement entries](https://github.com/ronen/postcode/pull/14#discussion_r4583611363) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Reject duplicate production IDs within a batch](https://github.com/ronen/postcode/pull/14#discussion_r4583611415) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Freeze declaration entries before exposing them](https://github.com/ronen/postcode/pull/14#discussion_r4583611450) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Default method-filtered identifications to standing states](https://github.com/ronen/postcode/pull/14#discussion_r4583611504) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Validate excerpt bounds before recording member exposure](https://github.com/ronen/postcode/pull/14#discussion_r4583611559) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Suppress changes disclosed through membership status](https://github.com/ronen/postcode/pull/14#discussion_r4583611612) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

Introduces the first milestone of structured architectural accounts: a shared ledger for retaining qualified analysis contributions and organizing their uses. The mechanism is exercised by controlled producers only; existing application behavior remains unchanged.

**Changes:**
- Adds contribution identities, atomic acceptance, association declarations and Query-result designations.
- Records producer inputs and derives standing, reconsideration causes and result fulfillment.
- Adds contract tests, architecture documentation and migration checkpoint records.

| File | Description |
| ---- | ----------- |
| `test/​contributions.test.ts` | Tests identity, acceptance, qualification and association changes. |
| `test/​contribution-results.test.ts` | Tests result selection, fresh attempts and fulfillment. |
| `test/​contribution-helpers.ts` | Supplies controlled producers and shared test helpers. |
| `test/​contribution-exposure.test.ts` | Tests delivery history, disclosure and cause propagation. |
| `src/​lib/​identity.ts` | Adds contribution and status method versions. |
| `src/​lib/​contributions/​status.ts` | Derives standing-related and reconsideration status. |
| `src/​lib/​contributions/​production.ts` | Acquires qualified inputs and records deliveries. |
| `src/​lib/​contributions/​outcomes.ts` | Separates production outcomes from fulfillment checks. |
| `src/​lib/​contributions/​model.ts` | Defines contribution records and submission types. |
| `src/​lib/​contributions/​ledger.ts` | Implements retention, atomic acceptance and exact access. |
| `src/​lib/​contributions/​catalog.ts` | Defines content contracts for prose and identification. |
| `records/​validation/​structured-architectural-accounts/​m1-checkpoint.md` | Records milestone scope, verification and migration obligations. |
| `records/​tasks/​2026-11-15-structured-architectural-accounts.md` | Records the implementation task and human clarifications. |
| `records/​reviews/​structured-architectural-accounts/​2026-11-15-m1-mechanism-round-2-findings.md` | Records the focused second-round review. |
| `records/​reviews/​structured-architectural-accounts/​2026-11-15-m1-mechanism-round-2-claude-findings.md` | Records additional second-round findings and limitations. |
| `records/​reviews/​structured-architectural-accounts/​2026-11-15-m1-mechanism-round-1-findings.md` | Records initial mechanism findings and verification. |
| `records/​reviews/​structured-architectural-accounts/​2026-11-15-m1-mechanism-handoff.md` | Defines the milestone review scope and gate. |
| `docs/​implementation-conventions.md` | Adds controlled-producer testing guidance. |
| `docs/​architecture/​README.md` | Links the mechanism and states its integration status. |
| `docs/​architecture/​contributions.md` | Describes responsibilities, semantics and current limits. |
</details>

<sub>Review effort: Balanced</sub>

### Inline annotation 1

Kind: inline review comment
Author: `Copilot`
Location: `src/lib/contributions/ledger.ts`, line 141, at commit `eb09a8269bf4f9d22644ff75c89d0abb5faca7af`
Identifier: 4583611363 — https://github.com/ronen/postcode/pull/14#discussion_r4583611363

This returns the mutable backing displacement array, including unfrozen entries. A JavaScript caller can remove entries to make a withdrawn association appear standing, or alter historical standing by changing a position, without an acceptance or cache invalidation. Return an immutable snapshot rather than the live index.

### Inline annotation 2

Kind: inline review comment
Author: `Copilot`
Location: `src/lib/contributions/ledger.ts`, line 286, at commit `eb09a8269bf4f9d22644ff75c89d0abb5faca7af`
Identifier: 4583611415 — https://github.com/ronen/postcode/pull/14#discussion_r4583611415

Two `begin()` calls with the same caller-supplied ID create distinct handles, so this object-identity check accepts both in one batch. The second `#conclude()` overwrites the first production, making its investigrams resolve to the wrong producer and input history. Reject duplicate production IDs before committing the batch.

### Inline annotation 3

Kind: inline review comment
Author: `Copilot`
Location: `src/lib/contributions/ledger.ts`, line 583, at commit `eb09a8269bf4f9d22644ff75c89d0abb5faca7af`
Identifier: 4583611450 — https://github.com/ronen/postcode/pull/14#discussion_r4583611450

This wrapper is retained unfrozen and returned directly by `declarationEntry`, `association` and `associations`. A JavaScript caller can replace its `declaration` or `owner`, changing later exact access and status derivation while the owning investigram still contains the original immutable declaration. Freeze the entry itself before exposing it; its nested address, declaration and owner are already frozen.

### Inline annotation 4

Kind: inline review comment
Author: `Copilot`
Location: `src/lib/contributions/ledger.ts`, line 167, at commit `eb09a8269bf4f9d22644ff75c89d0abb5faca7af`
Identifier: 4583611504 — https://github.com/ronen/postcode/pull/14#discussion_r4583611504

After a mechanical identification is withdrawn, `identifications(module, { method: 'test/module-discovery@1' })` returns nothing because it still defaults to current-only selection. This contradicts the method's documented contract and the method-specific selection rule in `docs/decisions/qualified-answers-over-contributions.md:45`. Default method-filtered lookups to all standing states while keeping general identification current-only; extend the withdrawal test to omit its explicit `standing: 'all'` override.

### Inline annotation 5

Kind: inline review comment
Author: `Copilot`
Location: `src/lib/contributions/production.ts`, line 169, at commit `eb09a8269bf4f9d22644ff75c89d0abb5faca7af`
Identifier: 4583611559 — https://github.com/ronen/postcode/pull/14#discussion_r4583611559

`member()` records the association and its displacement declarations before validating the excerpt bound, so an invalid bound throws without returning that information but leaves deliveries recorded. This invents exposure and can mark an undisclosed change as known, suppressing a legitimate reconsideration cause. Validate the bound before recording either part, and update `test/contribution-exposure.test.ts:507` to assert unchanged history instead of four leftover association deliveries.

### Inline annotation 6

Kind: inline review comment
Author: `Copilot`
Location: `src/lib/contributions/status.ts`, lines 92–94, at commit `eb09a8269bf4f9d22644ff75c89d0abb5faca7af`
Identifier: 4583611612 — https://github.com/ronen/postcode/pull/14#discussion_r4583611612

If a producer receives designation D, member A is superseded by B, and D is received again, the second response identifies B in `status.membership` but `pending()` still reports B from the earlier delivery. Only D's own displacements are captured as disclosed, so the exact change communicated through its status is not recognized as known. Capture the change IDs disclosed through membership and producer concerns at delivery time and suppress them across routes, without requiring a redundant `notify(B)`.
