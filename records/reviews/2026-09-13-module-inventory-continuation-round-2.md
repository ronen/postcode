# Module inventory continuation: second Copilot disposition and handoff

Date: 2026-09-13
Status: corrections verified; awaiting human-arranged Copilot rereview
Correction/review target: `a612015bed0087634d9f185a9b2b33e0fd91053d`
Reviewed predecessor: `77b95e35c058f36858464daf13e15c2553c09c70`
Pull request: [#1](https://github.com/ronen/postcode/pull/1)
Task: [active continuation](../tasks/2026-09-13-module-inventory-review-continuation.md)
Previous handoff: [first Copilot dispositions](2026-09-13-module-inventory-continuation.md)

## Review and scope

Retrieved all review summaries, inline comments and conversation comments directly
through paginated GitHub CLI API calls. There are two reviews, eight inline
comments overall, and no conversation comments. The
[new review](https://github.com/ronen/postcode/pull/1#pullrequestreview-5191106822)
is `COMMENTED`, recommends changes, and reports 68/74 files reviewed at Balanced
effort. It adds three findings; the suppressed comment repeats the second affected
generated-command test. The human identified the severities as High/Medium/Medium
and authorized corrections in follow-up commit `79f9f86`, before implementation.

All three are defects within the [approved plan](../../docs/plans/initial-module-inventory-plan.md)
and its three accepted decisions: qualified documentation provenance, truthful
analysis guarantees, and isolated test observation sinks. No new design decision,
dependency, foundation revision or scope expansion was needed. Historical task
and review records remain unchanged.

## Dispositions

| Finding | Correction and verification |
| --- | --- |
| [High: documentation-association subjects](https://github.com/ronen/postcode/pull/1#discussion_r3999966795) | Before batch mutation, module associations require module subjects, origin-symbol associations require symbols, and export-alias associations require export claims. A 42-case matrix covers three association kinds, seven subject variants and pending/existing targets, including valid acceptance, wrong claim discriminators, atomic rejection and preservation of existing records. This closes a malformed-record boundary gap; current TypeScript production of malformed associations was not observed. |
| [Medium: exclusions claimed without an enforced filter](https://github.com/ronen/postcode/pull/1#discussion_r3999966811) | Discovery contexts include the generated-output exclusion statement only when the enforced location count is nonzero. Regression checks omitted options, an empty list and one supplied location through project/module qualifications in the public view. |
| [Medium: persistent observations from command tests](https://github.com/ronen/postcode/pull/1#discussion_r3999966822) | Both generated-command tests run the copied CLI in disposable checkouts removed in `finally`. Each verifies the exact rendered output in its temporary observation batch. The existing process/sink test shares the small checkout-copy helper. The helper uses the real checkout path to match Node entry-point resolution on symlinked temporary paths. |

Record and discovery method versions advance to `program-records@8` and
`typescript-modules@6`; equivalent inputs consequently receive new snapshot IDs.
No CLI presentation layout or selector semantics changed in this round.

## Verification

- `npm test`: **59/59 passed**; `npm run check`: passed, Node 22.13.1 / TypeScript
  6.0.3. Both new correctness regressions failed on the preceding implementation.
- Across the full passing suite, all 211 existing top-level checkout observation
  batches retained their names and SHA-256 content hashes, with none added or
  removed. The set of temporary `postcode-*` test directories was also unchanged.
- Refreshed direct-library JSON and Unicode fixture samples: seven modules and
  eight discovery contexts with zero exclusions, and the same population with
  one explicit exclusion. Each discovery context agrees with the run's count;
  requested expansions remain exactly `["exports", "documentation"]`.
- Full-branch whitespace, changed-document links and preservation of completed
  task/governing records checked. Subsequent handoff/checkpoint commits are metadata.

Private ignored samples and logs are retained under
`_observations/validation/2026-09-13/continuation-round-2/`. The eight-file manifest
SHA-256 is `b0ac06160479ba5ac36641dce4113fdadb8de88e6a25921751e4c23262b0fb0c`.
This optional local evidence is not a repository dependency. Earlier observations
were preserved; this round did not repeat real-project self/p-queue captures,
clean-agent exercises or human presentation review. The unchanged first-observed
input-capture limitation remains.

## Next review gate

Have Copilot review the correction against these three findings, including valid
association acceptance as well as rejection, project/per-module qualifications
with zero and nonzero filters, and both generated-command tests' cleanup. Run
`npm test` and `npm run check` to reproduce automated verification.

The human arranges and returns the next review. The continuation remains **active**;
no rereview acceptance is claimed. Resolve returned in-scope defects and close only
when no actionable findings remain or the human explicitly accepts residual concerns.
