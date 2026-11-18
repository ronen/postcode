# M2 early vertical application review: findings

Record type: findings
Received: 2026-11-18
Reviewer: Claude (Opus 5.5), the same independent review session as rounds 4, 5 and 7–10. It did not take part in implementing M2, running the trials or writing the intent checks.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 11
Reviewed target: production implementation `4267a051754f62f1c728295cfe94c09b4b9354af`, plus test commit `956032c` and records through `f31919a`. Those commits change no source or scripts after `4267a05`.
Reviewed scope:
- follow-ups `678e665` and `bd8fc70`;
- the preserved round 10 accompanying note `12b431d`;
- the application test added in `956032c`;
- the reconciliation in [follow-up-contract-evidence.md](../../validation/structured-architectural-accounts/m2-trials/follow-up-contract-evidence.md);
- the live check in [promised-contract-verification.md](../../validation/structured-architectural-accounts/m2-trials/promised-contract-verification.md);
- the README and checkpoint additions;
- the underlying captures in `_trials/m2-trials-6/` and `_trials/m2-promised-contract-verification-1/`.

Prior findings: [M2 round 10 Claude findings](2026-11-17-m2-vertical-round-10-claude-findings.md) and its [accompanying note](2026-11-17-m2-vertical-round-10-claude-addendum-findings.md)
Prior reviewed target: `4267a051754f62f1c728295cfe94c09b4b9354af`

## Returned findings

### Recommendation

**No actionable findings.**

- The captures support the claimed option identity, contract forwarding and fulfillment, in both the historical run and the current one.
- The reconciliation states the historical and current evidence and their limits accurately.
- The added application test covers contract forwarding and enforcement, including an accepted but unfulfilled result, and it fails under the relevant mutations.

This review does not accept the M2 checkpoint or authorize M3.

### Correction to my own earlier wording

The accompanying round 10 note was the text of my chat summary. It said there was "no live follow-up that promises a result contract". That was too broad: original run 6, trial 2 invoked such an option, as verified below.

My committed round 10 record scoped the same limitation to that round's live check, which was correct. The reconciliation identifies the difference accurately and leaves both historical texts unchanged, which is the right handling.

### Method and verification

- **Build and suites.** I built an exact export of `f31919a` under Node 22.23.4. The contribution, ledger and exports suites passed **105/105**, with no skips. Production source and scripts are identical to `4267a05`.
- **Mutation checks on the new test**, on a scratch copy of the build:

  | Mutation | Result |
  | --- | --- |
  | Executor forwards `resultContract: null` instead of the option's contract | The test fails |
  | Fulfillment assessment always returns `fulfilled` | The test fails |
  | Unmodified build | The test passes |

- **Historical reconstruction.** I built `107e32f` from Git and generated its production instructions and function schema. All seven run-6 exchanges match exactly: the four authoring exchanges add only the recorded elicitation, and the three invocation exchanges are the plain `state-behavior` instructions. The function schemas also match. This independently confirms the reconciliation's claim about the instruction and schema basis.
- **Capture audits** with my own scripts, of both runs: manifest or fingerprint digests, specs and elicitations, instruction and schema equality, submissions, wire requests, bindings, delivered metadata, steps, attempt reports, usage and ledgers. The details follow.

### 1. Option identity, contract forwarding and fulfillment

**Current run** (`m2-promised-contract-verification-1`, implementation `4267a05`):

- **Capture integrity.** All 14 manifest digests matched, and the manifest's own SHA-256 matches the record.
- **Elicitation.** It asks, in natural language, for a follow-up "whose answer must include a state diagram". It names no operation, field, shape or contract identifier.
- **Instructions and schemas.** All seven exchanges equal current production instructions: authoring exchanges plus only that elicitation, invocation exchanges the plain `examine-content` instructions. The function schemas match.
- **Authored option.** The first, accepted submission authored `deeper_diagram`: `examine-content` on the retained `model` item, with an explicit `resultContract: "postcode/state-diagram-answer@1"`.
- **Forwarding.** All five invocation exchanges carry:
  - that contract;
  - operation `examine-content`;
  - `option.key = deeper_diagram`, with the owner handle resolving to the initial investigram.

  The delivered option metadata carries the same contract and the meaning byte-for-byte.
- **Why forwarding is distinguishable.** `examine-content` has no default contract, so the contract can only have come from the option.
- **Result.**
  - The follow-up question records both the contract and the `option` identity.
  - The subsequent contribution was accepted on its first submission. Attempt fulfillment for that contract and projected fulfillment are both `fulfilled`, with no unmet requirements.
  - The terminal report's `followUp` carries the owner, key and meaning.
- **Usage.** Seven requests against a ceiling of 20, totaling 121,580 tokens, with no missing, anomalous or non-finite usage.

**Historical run** (`m2-trials-6`, trial 2):

- **Fingerprints.** All five files match the sizes and SHA-256 fingerprints in the reconciliation.
- **Authored option.** The authored option requested `state-behavior` on a module Entity, with an explicit `resultContract: "postcode/state-diagram-answer@1"`, in both the rejected first submission and the repaired accepted one.
- **Forwarding.** All three invocation exchanges carry that contract. As the reconciliation says, none carries an `option` field, because that implementation predates exact-option identity.
- **Result.** The single follow-up submission was accepted, and the projection records `fulfilled` with no unmet requirements. The older reporting format has no separate attempt-fulfillment field, and the record does not claim one.
- **Ledger.** Ordinals 27–30 are the `states` step and 31–33 the `option` step, as stated.
- **Elicitation.** The elicitation supplied operation names and subject signatures but no contract identifier, exactly as quoted.

### 2. Reconciliation of historical and current evidence

The reconciliation is accurate.

- **Scope.** It confines the earlier limitation to the later focused runs. I confirmed from each run's step captures that the invoked options in the retry, extended, revised-selector and report-answer runs all had a null contract and null projected fulfillment. The report-only check invoked no option.
- **Historical limits.** It is careful not to overstate the historical run:
  - its elicitation supplied operation names and signatures;
  - its instruction and schema versions were older (dialog `@3`, wire `@2`);
  - it lacked exact-option identity.
- **Reconstruction.** The claim that the rebuilt `107e32f` matches the captured instructions and schema is supported by my own reconstruction. The record correctly notes that this does not prove the original checkout identity.
- **Supersession.** The later addendum to the reconciliation, and the README and checkpoint additions, state that the new current-revision run fills the positive gap. They do not revise the historical boundaries or the preserved reviews.

### 3. Offline coverage of contract enforcement

The added test runs through the real application, ledger, invocation, dialog coordination and answer selection, with only agent communication substituted. It checks the following:

- **Forwarding.** An `examine-content` option's promised contract reaches the investigator's request and the delivered option metadata, and is retained in the question together with the exact option identity.
- **Fulfilled case.** A conforming state model gives attempt and projected fulfillment `fulfilled`.
- **Accepted but unfulfilled.** A prose-only answer is accepted, not marked failed, and recorded as `unfulfilled` in both attempt reporting and the projection. The specific unmet requirement is attached to the alternative, and no structural repair is triggered.
- **Reuse and exact presentation.** Ordinary reuse and exact presentation preserve each outcome without another dialog.
- **Unknown contract.** An unknown promised contract is refused as `invalid-parameters` before any dialog opens.

The other unmet path, a state model with zero states, is covered at domain level in `test/contribution-state.test.ts`. The case of an accepted attempt that supplies no answer, `no-answer-supplied`, is covered in the results, dialog and application tests.

### Non-defect observations and limits

- **Unknown contracts at authoring time.** An option naming an unknown result contract is accepted when authored and refused only when invoked. This matches the existing treatment of options that name an unsupported operation, so it is not a regression. Validating option contracts at acceptance would be a design choice for the human, not a correction.
- **Remaining limits.** These stand as the records state them:
  - a nonconforming follow-up reported as accepted but unfulfilled is demonstrated only offline;
  - one model and one repository, with no measure of first-submission reliability;
  - the generated accounts' accuracy is unverified;
  - lifecycle cases with non-zero reconsideration causes are covered offline;
  - one structural repair attempt;
  - no configuration path for the hosted contribution agent.
- **Not done.** I did not visually inspect the diagrams or repeat the full offline suite. The correction adds one test and changes no production code.
- **Scratch work.** I kept `GIT_DIR` scoped to individual commands, and the repository's `core.bare` remains `false`.

Only this findings record is created and committed by this reviewer. Implementation, governing material, the task record, task status and the original handoff remain untouched.
