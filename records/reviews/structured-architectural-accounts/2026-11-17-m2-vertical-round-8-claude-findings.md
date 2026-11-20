# M2 early vertical application review: findings

Record type: findings
Received: 2026-11-17
Reviewer: Claude (Opus 5.5), the same independent review session as rounds 4, 5 and 7. It did not take part in implementing M2, running the trials or writing the intent checks.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 8
Reviewed target:
- implementation `2ed7b5f251157e2176879023694b5166892923b2`;
- records through `0bf752bb4364f83f2c7794baaeda28fd133e1b18`, which change no source, scripts or tests after `2ed7b5f`.

Reviewed scope:
- correction `2ed7b5f`, which addresses R7-F1 and both observations of the round 6 intent check;
- its offline verification record, `ac3ab73`;
- the live verification of the revised selector instructions, in [revised-selector-verification.md](../../validation/structured-architectural-accounts/m2-trials/revised-selector-verification.md) and `_trials/m2-selector-verification-1/`;
- the task follow-ups `d7c4972` and `76e2ea6`.

Prior findings: [M2 round 7 Claude findings](2026-11-17-m2-vertical-round-7-claude-findings.md), with the [round 3–6 corrections intent check](2026-11-17-m2-vertical-round-6-corrections-intent-check-claude.md) as context
Prior reviewed target: live evidence of `6f72f86d7cf4cfa1dd61c34e4455cc97ec42133b`, with records through `372e5ec`

## Returned findings

### Recommendation

**R7-F1 is resolved, and so are both intent-check observations.** The new live run confirms the revised selector guidance in the elicited option chain.

One new **P3 instruction finding**, R8-F1, comes from the new evidence. It concerns an under-specified optional report field and does not block the gate.

The live-instruction evidence gap remains closed. This review does not accept the M2 checkpoint or authorize M3.

### Method

I read the correction diff, the new and updated validation records, the task follow-ups and the checkpoint addition. I built an exact export of `0bf752b` under Node 22.23.4. Its source, scripts and tests are identical to `2ed7b5f`.

I audited the new captures with my own scripts:

- every manifest digest;
- the elicitation, against the earlier runs;
- each exchange's instructions and function schema, against production text I generated from my build;
- the submissions, the repair feedback, the reference bindings, the follow-up wire input and delivered metadata, the application steps, the attempt reports, the usage and the budget ledger.

I ran no inference.

### Verification

- **Build and suites.** `npm run build` passed. The contribution, ledger and exports suites passed **100/100**.
- **Full offline suite**, in six batches: **760 tests, 757 passed, 2 failed, 1 skipped**. These are the same environment-only cases as earlier rounds: kernel-lock tests in `chatgpt-auth.test.js`, and a skip that needs a case-insensitive filesystem.
- **Selector probe** against the build. A retained state-model item is delivered with `components: ["state:half"]`. Validation accepts `state:half` and rejects `unsupported`, the free-text value seen in the earlier trial, and `transition:none`.

### Resolution of prior findings

- **R7-F1, the component selector.**
  - **The change.**
    - One shared explanation, `componentSelectorGuidance`, now appears both in the production follow-up instructions and on the hosted schema's `component` field.
    - The state-model guidance states the `state:<key>` and `transition:<key>` selectors, that `unsupported` and arbitrary body fields declare none, and that the selector should be omitted to target the whole model.
    - The guidance's claim that retained items list valid selectors in their `components` array matches what agents actually receive.
    - Validation and bounded repair are unchanged, and both observed invalid values are kept as regression cases.
    - The dialog and wire method versions advance to `@7` and `@5`.
  - **Live confirmation.**
    - The authoring exchanges equal the production `state-behavior` instructions plus only the unchanged elicitation. The invocation exchanges equal the `examine-content` instructions exactly. The function schemas match.
    - The agent used `state:half`, a real key of its own model, in both submissions.
    - Validation accepted the selector, which reached the follow-up investigator in its wire subject and question.
    - Neither earlier invalid value recurred.
- **Intent-check observation 1, export reconsideration status.**
  - **The change.**
    - Export Views now show each displacing production's captured concerns, with exact cause addresses, routes, grounds, and cause producer and owner/declaration qualifications.
    - The text rendering states that the concern does not establish an error, reverse the displacement or reinstate the earlier use.
    - The concern is attributed to the displacing production, not to the mechanical finding.
  - **Test coverage.** The new regression in `test/contribution-modules.test.ts` checks the following:
    - a later premise withdrawal appears in a fresh answer;
    - an earlier exact answer's projection, View and text are unchanged;
    - the mechanical finding's qualification and exports are unaffected.
  - **Version.** The Presentation advances to `@8`.
- **Intent-check observation 2.** This is the same selector issue as R7-F1, resolved above.

### Live-run accounting and behavior

All of the following are accurately recorded:

- **Requests and tokens.** The 13 requests are ordinals 1–13 in a separate ledger with ceiling 30. Per-exchange provider totals reproduce every table entry and total 541,114 tokens. No usage is missing or anomalous.
- **Outcomes.** Both contributions were accepted. The initial answer fulfilled `postcode/state-diagram-answer@1`. The follow-up has null fulfillment, which is correct because the option promised no contract.
- **Option delivery.** The option's owner, key, meaning and `state:half` subject reached the next investigator and its terminal report.
- **Startup failure.** The sandbox startup failure consumed no requests: it was an `EPERM` on the credential lock, raised before any reservation.
- **Stopping.** The decision to stop after one successful run matches the authorization's instruction to attempt only to resolve specific uncertainties.

### R8-F1 — P3: The meaning of `report.answer` is undefined, and its schema description contradicts accepted use

**Location.**
- The submission line of `dialogInstructions` in `src/lib/contributions/dialog.ts`: `report?: { …, answer?: [ address ] }`.
- The hosted `report.answer` schema in `src/lib/investigation/openai/contribution-protocol.ts`, which describes `investigram` as "An exact handle supplied in this dialogue".
- `attemptAnswers` in `src/lib/contributions/outcomes.ts`. It already counts an attempt's own result designations, so `report.answer` is needed only to report existing retained designations.

**Observed.** Neither the instructions nor the schema say what `report.answer` is for.

| Submission(s) | What the agent put in `report.answer` | Result |
| --- | --- | --- |
| 7 of the 8 submissions in the three runs that reached submission | Its own new designation, by submission-local reference | Redundant; accepted |
| Selector run, first submission | `{ investigram: <the invocation handle>, declaration: "answer" }` | Rejected (`Unknown investigram reference.`); the run's single repair removed the field |

The local form contradicts the schema description, which asks for a supplied handle. The invocation handle is one of the few handles a fresh dialog has been supplied.

**Pattern.** Every initial investigation that reached submission in the three successful runs has now spent its one permitted repair on an under-specified optional field: the component selector twice, this field once. A second independent mistake would end the investigation as `invalid-submission`.

**Resolution.**
- State that the contribution's own result designations already count as its answer.
- State that `report.answer` lists only exact existing designations it adopts as its answer.
- Make the schema description agree with whichever forms validation accepts.
- Keep the observed submission as a regression case.

Verifying the revised wording live would need separate authorization.

### Non-defect observations and limits

- **Unprompted option.** The follow-up contribution offered an option of its own, on its explanation, without elicitation. It is retained metadata and was not invoked.
- **Scope of the live evidence.** It still covers one model, one repository and one successful selector run. It does not show first-submission validity, reliability, a non-null follow-up contract, or the architectural correctness of the accounts. The record says so.
- **Not checked.** I did not visually inspect diagrams, and I did not re-review earlier, unchanged components.
- **Scratch-environment error.** During this review, a `git init` meant for my scratch copy ran against the worktree's git directory, because `GIT_DIR` was still set. It set `core.bare = true` in the primary repository's `.git/config` and rewrote the worktree index with identical content. I restored `core.bare = false` immediately. Both checkouts then reported clean status with HEAD unchanged. No commit, ref or tracked file was altered.

Only this findings record is created and committed by this reviewer. Implementation, governing material, the task record, task status and the original handoff remain untouched.
