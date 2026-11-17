# M2 round 1 corrections: original-intent check

Record type: findings
Received: 2026-11-17
Reviewer: Claude, the original M2 implementer. **This is not an independent review.** The human asked a single question, "does any of this change intended semantics or contradict the decisions?" This check answers that question and nothing more. Its findings are inputs for the gate reviewer and the human, not a gate result.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 1, corrections
Reviewed target: `22753b3216a3b1f34a381e512acea22587c16dcf`
Prior findings: [M2 round 1 findings](2026-11-17-m2-vertical-round-1-findings.md)
Prior reviewed target: `6f42db00af65d01e5e7f42c8bfab80aafcff4b30`

## Returned findings

### Scope and method

I read the round 1 findings and the correction diffs: `2493db7` (F1–F8), `a062be2` (illustration support) and `22753b3` (documentation and the review-elicitation trial record). I checked them against the four contribution decisions and against the intended M2 semantics. I ran no tests, probes or trials. This check does not assess whether each finding is fully resolved, which belongs to the independent re-review.

### Conclusion

Mostly no. The corrections stay within the adopted semantics and close real gaps. One part contradicts the qualified-answers decision (C1). Three smaller issues concern presentation fidelity or reporting precision, not semantics (C2–C4).

### C1: Attempt outcomes enter answer identity

**Location.** `src/lib/contributions/answers.ts:116`. The values originate at `src/lib/application/executor.ts:124–129`.

**What happens.** When a question has no standing alternative, `selectContributionAnswer` writes two attempt-derived values into the retained Projection payload, and so into the answer's identity:

- `emptyReport`, the producer report of the current attempt;
- `unavailable`, the current attempt's domain failure. The executor fills this from `evaluated.unavailable` or from the attempt's non-accepted outcome, for example a limit-stop reason, invalid-submission problems or a provider diagnostic.

**Why this contradicts the decision.**

- [Answer identity and request reuse](../../../docs/decisions/qualified-answers-over-contributions.md#answer-identity-and-request-reuse) requires moving "invocation-specific resolution/lookup context out of the Projection; preserve answer-relevant qualification in it".
- The F2 finding itself required keeping "invocation-specific reporting outside answer identity".
- The corrected architecture text claims that invocation-only outcomes stay outside the answer's identity, which this code does not do.

**Failure scenario.** Two attempts at the same question each end without a designation, for different reasons, such as "Tool request guard reached." and a timeout. The selection is identical, yet they produce different exact answers. An ordinary request that reuses a retained failure can also produce a different answer ID depending on whether the attempt outcome was held in memory or rebuilt (see C4).

**Suggested resolution.**

- Remove `emptyReport` and `unavailable` from the Projection payload. F2 is already met through application reporting, since `reporting.contribution` and `reporting.unavailable` carry these values outside identity.
- Supply the no-answer explanation from that reporting at delivery, not from the retained answer.
- If the human or gate reviewer judges that an *accepted* contribution's retained producer report, with no designation, is answer-relevant qualification, it may stay. It is ledger-recorded, not invocation context. That should be a deliberate choice applied to every accepted production for the result, not the current attempt only.

Add a test showing that two failed attempts with different reasons yield equal answer identity.

### C2: Selected answers' qualifications are flattened without attribution

**Location.** `arrangeContributionAnswer` in `src/lib/contributions/answers.ts`, at the construction of `qualifications`.

**What happens.** The arrangement merges these into one deduplicated list of strings for each alternative:

- the qualifications of the owners and items actually selected;
- the qualifications of owners whose declarations displaced a selected use;
- the qualifications of owners that filed inconsistency reports;
- the qualifications of displacing and reporting declarations;
- the qualifications of support and dependency items reached through `include`.

Only the displacement grounds and the inconsistency grounds get a distinguishing prefix.

**Why it matters.** Nothing is lost any more, which F1 required. But the arrangement now misattributes qualifications. A withdrawing owner's limitation, such as "this withdrawal ends a trial's organizing use", reads as if it qualified the selected answer. [Visible qualification](../../../docs/decisions/qualified-answers-over-contributions.md#visible-qualification-and-historical-navigation) expects each qualification to remain attached to what it qualifies.

**Suggested resolution.** Group arranged qualifications by their source: selected content, selected uses, displacements of selected uses, inconsistency reports, and supporting items. Label each group, and test with the F1 cross-owner and withdrawal case.

### C3: Raw Entity IDs appear in rendered diagrams

**Location.** `src/lib/contributions/state-diagram.ts`, the first line of `renderStateDiagram`.

**What happens.** For an Entity bearer, the renderer rewrites the label as `<label> [Entity: <entity id>]`. The ID is the full Session-namespaced identifier. It therefore:

- appears in the SVG title, the text form and a new "State bearer" note;
- makes rendered output differ between Sessions for the same answer;
- shows an internal identifier, although compact user-facing references are recorded as later migration work.

**Why it matters.** F8 asked that each diagram show its model's own bearer. The arrangement already derives a qualified label from the bearer's identifications (`bearer()` in `answers.ts`), and that label alone meets F8.

**Suggested resolution.** Render the derived label, or the scoped role, without the raw ID, and keep the Entity in the structured answer. Add a check that rendered diagrams contain no Session identifier. The committed M2 diagrams were checked this way at `6f42db0`.

### C4: Reused failures lose their kind when rebuilt

**Location.** `src/lib/contributions/evaluation.ts`, where ordinary reuse builds `attemptResult`.

**What happens.** When a reused attempt is not held in the in-memory `completed` map, every non-accepted outcome is rebuilt as `investigation-failure` with the production's reason. Limit-stop, ended-without-submission and invalid-submission become indistinguishable. Currently the map lives as long as the evaluation, which normally matches the Session, so this is latent. It also feeds C1 while the outcome remains in the payload.

**Suggested resolution.** Rebuild the outcome kind from the retained production's own outcome. If the production does not record the kind, record it there.

### Checked and consistent with intended semantics

- **F1, answer support.** `answer-support.ts` reads the ledger directly and records no production exposure. It is fixed at construction, with standing, causes and displacement history captured, and does not rely on current history. Displaced earlier member uses remain selected and are visibly qualified, which matches the M1 membership rule. Including illustrations (`a062be2`) correctly completes this.
- **F2, attempt versus current answer** (apart from C1). The attempt's outcome, fulfillment and report are now separate from the fulfillment of the current answer. A fresh unfulfilled attempt beside a standing, fulfilled earlier answer is reported correctly.
- **F3, reuse.** An accepted attempt now takes precedence over an earlier failure for reuse reporting only. Every standing alternative is still selected independently, and nothing gains precedence by recency.
- **F4, originating question.**
  - Delivering the owner's originating invocation and request, and the question a result designation answers, adds context, not acquired content. It is kept distinct from the route by which content was selected.
  - Exempting `parameters` from reference translation on the wire is correct, because parameters are literal question context.
- **F5, malformed acquisitions.** They are refused as unavailable, and nothing is recorded. Genuine defects still propagate.
- **F6, dispatch timing.** The delivery checkpoint now advances when the exchange is handed to the participant. That errs toward recording exposure, which is the safe direction under the actual-delivery contract. It is consistent with the earlier treatment of communication-failure replies, which were also recorded.
- **F7, usage reporting.** Final attributed reporting now happens on every terminal exit, as in the legacy executor.
- **F8, bearer** (apart from C3). A role bearer is shown verbatim, and each model now has its own bearer.
- **Review elicitation trials.**
  - The trials used 10 requests, bringing the total to 49 of the 60 approved.
  - They are recorded as deliberately elicited, not spontaneous.
  - The record correctly states that the live evidence is at `2493db7`, not `a062be2`.

### Minor

- `records/validation/structured-architectural-accounts/m2-trials/README.md`, line 20, says the raw captures stay in the session scratch directory. They are also in the worktree's ignored `_trials/` directory.
