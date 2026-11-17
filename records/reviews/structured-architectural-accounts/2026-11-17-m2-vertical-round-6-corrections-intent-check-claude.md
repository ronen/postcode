# M2 rounds 3–6 corrections: original-intent check

Record type: findings
Received: 2026-11-17
Reviewer: Claude, the original M2 implementer. **This is not an independent review.** The human asked a single question, "does this diff change intended semantics or contradict the decisions?" This check answers that question and nothing more. Its findings are inputs for the gate reviewers and the human, not a gate result.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: rounds 3–6, corrections
Reviewed target: `d537c65`
Prior findings: [Round 2 corrections intent check](2026-11-17-m2-vertical-round-2-corrections-intent-check-claude.md), [round 3](2026-11-17-m2-vertical-round-3-findings.md), [round 4](2026-11-17-m2-vertical-round-4-claude-findings.md), [round 5](2026-11-17-m2-vertical-round-5-claude-findings.md), [round 6 Copilot](2026-11-17-m2-vertical-round-6-copilot-findings.md)
Prior reviewed target: `e91d96c`

## Returned findings

### Scope and method

I read the diff `e91d96c..d537c65` and checked it against the four contribution decisions, the intended M2 semantics, and the human's task follow-ups recorded in that range. The diff contains:

- the round 3–6 findings records;
- the task follow-ups;
- correction commit `6f72f86`, which addresses R4-F1 to R4-F5;
- correction commit `d537c65`, which addresses the three round 6 Copilot annotations;
- the focused option-verification record and its trial-record updates.

I ran no tests, probes or trials. This check does not assess completeness or test coverage.

### Conclusion

No. Neither correction changes intended semantics or contradicts the decisions.

- **Follow-up option identity.** The one consequential semantic change is that a follow-up option's exact owner and key are now part of its question identity. The human chose this explicitly in the task follow-up for R4-F1, and accepted its consequence after round 5.
- **The other changes** fill gaps in the intended direction:
  - unrenderable selected content is now disclosed;
  - colliding state labels are disambiguated;
  - option-authoring instructions are derived from the actual registrations;
  - requests that cannot be presented are refused before inference;
  - qualified displacement support is captured for the exports answer.

Two observations follow. Neither is a contradiction. One is a minor inconsistency between what the exports answer's identity contains and what it presents. The other is an instruction-usability gap that showed up in both successful live runs.

### How each correction was resolved

- **R4-F1, option question identity.**
  - `InvocationRequest.option` enters the canonical request key, and the ledger checks that the option exists before invocation.
  - The option is captured in fixed answer support, delivered as initial input and in `request.option`, and named in attempt reporting.
  - A retained option's own request still cannot carry an `option` field, so identity cannot be forged.
  - This matches the human's choice, "Use exact option identity", and the accepted consequence that follow-up and ordinary requests do not share answers automatically while their retained content stays reusable.
  - It remains consistent with [answer identity and request reuse](../../../docs/decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse): a different request can consume retained information without becoming the earlier request.
- **R4-F2, option authoring instructions.**
  - `followUpInstructions()` derives operations, subject shapes and result contracts from the same registrations that invocation checks.
  - The hosted subject schema adds `investigram` and `designation` subjects, which matches what the ledger and the executor's subject-signature check accept.
  - These are instruction and schema changes only, with no change to semantics.
- **R4-F3, unpresented content.** `unpresented` lists every selected item that is not rendered, with its full retained model and its bearer. This strengthens the intended rule that alternatives are assessed and disclosed separately and nothing selected is silently dropped.
- **R4-F4, state label ambiguity.**
  - Mnemonics appear only when displayed captions collide.
  - `stateLegend` keeps each exact key and full label.
  - States and transitions are still drawn exactly as supplied.
- **R4-F5, the path-dependent test.** This is a test change only.
- **Copilot 4604460740, measurement output.** The measurement script now refuses a report directory that is not empty, and excludes only that directory. This affects tooling only.
- **Copilot 4604460840, preflight.**
  - Prospective Presentation planning now happens before the follow-up branch.
  - Contribution requirements are checked before evaluation.
  - A request that cannot be presented therefore runs no inference and accepts no organizing change, which is the behavior the other Lens families already had.
  - The ordering only moves refusal earlier; no outcome that was previously possible for a valid request changes.
- **Copilot 4604460908, exports displacement support.**
  - The exports answer now captures, through the shared `answerSupport` collector, each displacing declaration with its producer, its owner and declaration qualifications, and its grounds evidence and support.
  - It renders them as qualifying the organizing change, never the mechanical finding.
  - Capture reads the ledger only and records no exposure.
  - When no use has been displaced, the support is empty, so the M1 obligation for equal mechanical answers under reordered arrival of independent contributions still holds.
- **The focused option verification.**
  - It ran under the human's direction, including the ceiling raised to 70.
  - The elicitation, instructions, limits and repair behavior were unchanged across runs.
  - Failures and the budget-refused dispatch are reported as such.
  - Successful execution is kept distinct from the architectural correctness of the explanations.

### Observations

1. **The exports answer's identity contains derived status it does not present.**
   - **What happens.** The capture records each displacing owner through `answerSupport`, which also records that owner's producing-context causes and each captured use's derived status. `exportsIdentity` includes these in `supportKey`, under `owners[].producing` and `uses[].status`. `renderModuleExports` and the exports View show the displacement's producer and qualifications, but not whether the displacing contribution itself needs reconsideration.
   - **Consequence.** A later change that adds a cause to the displacing production yields a fresh exports answer with a different identity and identical presentation.
   - **Why it is not a contradiction.** The decision allows captured, history-dependent causes in a snapshot, and identity remains consistent with the payload.
   - **Resolution.** Either present it, by stating that the displacement itself needs reconsideration as the contribution arrangement already does for owners, or exclude it from the exports capture and identity. Presenting it is the closer match to the contribution answer's arrangement.
   - **Priority.** Low. It does not affect answers where no use was displaced.
2. **The `component` selector on content subjects is not explained.**
   - **What happened.** Both successful initial investigations in the focused verification needed the one structural repair. The cause was the same each time: an option subject named `component: "unsupported"`, treating a field of the state-model body as a declared component of the item.
   - **Cause.** The instructions give `component?: string` with no definition of what a component is or where valid components come from.
   - **Impact.** This does not affect semantics, but it uses up the single repair in the path the round 5 instructions were meant to make reliable.
   - **Suggestion.** Either state what a component is and which content types declare components, or tell agents to omit it and refer to the whole item. Keep the observed submission as a regression case, as was done for the earlier instruction findings.
   - **Authorization.** Verifying the change live would need separate inference authorization from the human.

### Nothing further

I found no change to exposure attribution, claim selection, standing, the membership rule, alternative precedence, or the reported-inability treatment the human was asked to confirm, beyond what is described above.
