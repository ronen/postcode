# M2 round 2 corrections: original-intent check

Record type: findings
Received: 2026-11-17
Reviewer: Claude, the original M2 implementer. **This is not an independent review.** The human asked a single question, "does any of this change intended semantics or contradict the decisions?" This check answers that question and nothing more. Its findings are inputs for the gate reviewer and the human, not a gate result.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 2, corrections
Reviewed target: `5699501`
Prior findings: [Round 1 corrections intent check](2026-11-17-m2-vertical-round-1-corrections-intent-check-claude.md), [M2 round 2 findings](2026-11-17-m2-vertical-round-2-findings.md)
Prior reviewed target: `22753b3216a3b1f34a381e512acea22587c16dcf`

## Returned findings

### Scope and method

I read the following and checked them against the four contribution decisions and the intended M2 semantics:

- the round 2 findings record (`4cca963`);
- the correction commits `d6f28cc`, which addresses intent concerns C1–C4, and `5699501`, which addresses R2-F1.

I ran no tests, probes or trials. This check does not assess completeness or test coverage, which belong to the independent review.

### Conclusion

No. Neither correction changes intended semantics or contradicts the decisions. Each of C1–C4 and R2-F1 is resolved in the direction intended. The round 2 review's assessments agree with mine. Two observations follow; neither is a defect. The first is a choice the human may want to record explicitly.

### How each concern was resolved

- **C1, answer identity.** The current attempt's report and failure no longer enter the Projection.
  - The executor stops passing them, the payload fields are removed, and the no-answer explanation no longer replays them.
  - They remain in delivery reporting (`reporting.contribution` and `reporting.unavailable`), outside identity.
  - This matches [answer identity and request reuse](../../../docs/decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse).
- **C2, qualification attribution.**
  - Each arranged qualification is now a group with a kind and an exact source: an item, association, declaration or metadata address.
  - The owner's qualification, reconsideration concerns and producer report are attributed to that source's own owner.
  - A displacing or reporting owner's statements therefore no longer read as qualifying the selected answer.
  - This matches [visible qualification](../../../docs/decisions/qualified-answers-over-contributions.md#visible-qualification-and-historical-navigation).
- **C3, raw Entity IDs.** The renderer no longer adds the Entity ID to the label. The exact Entity stays in the structured answer.
- **C4, failure kind.**
  - A production that returns no contribution now retains a typed `ProductionFailure`.
  - Reuse rebuilds the attempt outcome from that record, not from the evaluation's cache.
  - The transient-failure filter now reads the failure kind instead of the reason string. The behavior is the same, because communication and configuration failures still default their reason to their kind.
  - Retaining the domain code and diagnostic in the production record is consistent with the decisions. Production records are not part of answer identity, and a failed production has no investigram that could enter an answer.
- **R2-F1, module bearer labels.**
  - Each content contract's `identifying` function is now resolved while the answer is built, and stored in fixed support as `identifyingNames`.
  - Arrangement therefore still needs neither catalog nor ledger access.
  - Mechanical `module-identification` items now give their name, or their generated handle. The origin of each name is shown in the bearer-identification qualification group.
  - Several identifications are joined without preference, which is consistent with keeping alternatives unranked.
  - The names are derived deterministically from retained bodies, so including them in identity is sound. The Projection method version advances.

### Observations

1. **Undesignated accepted reports leave exact presentation (a choice to confirm).** Suppose an accepted contribution reports an inability and designates nothing for the result. Its producer report now reaches the client only through delivery reporting. Neither the retained answer nor its exact presentation carries it.

   This is one of the two options the round 1 intent check offered, and it does not contradict the decisions. The report stays retained on the production in the ledger. The [valid partial contribution](../../../docs/decisions/common-analysis-contributions.md) case keeps its items, and those items become visible once something designates them.

   The intent check left open whether this report counts as answer-relevant qualification. The disposition should record that the human accepts it being treated as attempt reporting, so the choice is not left implicit.

2. **Owner statements repeat in every group (presentation volume only).** Each group from the same owner repeats that owner's qualification, concerns and report. For example, a selected item and its selected use from one contribution show the same owner statements twice. The attribution is correct. A presentation could show each owner's statements once and refer to them from each group, without changing the retained structure. This is not semantic and does not need addressing at this checkpoint.

### Nothing further

I found no change to exposure attribution, claim selection, standing, the membership rule, reuse precedence or the dialog protocol beyond what is described above.
