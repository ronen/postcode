# M2 follow-up result-contract evidence reconciliation

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../../tasks/2026-11-15-structured-architectural-accounts.md)
Review assignment: [M2 vertical handoff](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-handoff.md)
Review context: [Round 10](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-10-claude-findings.md) and its preserved [accompanying note](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-10-claude-addendum-findings.md)
Authority: task follow-up `678e665`; no additional live inference authorized or performed

## Clarification

**A non-null follow-up result contract was demonstrated live in original run 6, trial 2.** Its retained option promised `postcode/state-diagram-answer@1`, the application invoked that option, the subsequent investigator received the contract, its contribution was accepted, and the resulting answer projection recorded `fulfilled` with no unmet requirements.

The limitation is accurate for the **later focused option runs**, whose invoked options promised no contract, and for the latest return-only check, which did not invoke an option. It is too broad as a statement about all M2 live evidence. The historical run does not establish the same scenario under the latest production guidance and exact-option question identity, nor does it establish architectural accuracy or general reliability.

The historical findings and accompanying reviewer text are preserved unchanged. This record supplies the implementing agent's reconciliation under the human's explicit direction.

## Underlying historical evidence

I inspected the original `_trials/m2-trials-6/` spec, exchanges, steps, terminal reports and usage. These are the captures behind the [original trial record](README.md). The initial and follow-up requests are labelled `states` and `option`; the latter is trial 2 within run 6. The seven requests are ordinals 27–33 in the historical ledger, with the last three used for invocation.

The evidence chain is explicit:

1. The authored option `inspect-breaker-state` requests `state-behavior` on the delegated breaker module Entity and explicitly supplies `resultContract: "postcode/state-diagram-answer@1"`. This is present in the submission and in the accepted, retained option; it was not inferred solely from the resulting diagram.
2. The application's next recorded request is the `follow-up` Lens with that exact owner and key. The resulting question's operation, subjects and contract match the retained option request.
3. Every invocation exchange carries that non-null contract in `request.resultContract`. Delivered option metadata carries the same promised contract and meaning. Resolved wire handles match the selected subject, option owner and resulting Query result.
4. The subsequent investigator submitted once. Terminal reporting records `accepted`, the application delivery is not failed, and the answer projection records `fulfilled`, with no unmet requirements in its alternatives. The older reporting format does not expose the newer separate attempt-fulfillment report; no such report is claimed here.

The source option was deliberately elicited with:

> For this trial only: in addition to your answer, offer at least one follow-up option proposing a further investigation. Name a supported operation, either state-behavior with one module Entity as its subject, or examine-content with one exact content item of your own submission as its subject, and give its meaning.

This supplies operation names and subject signatures. It does **not** supply the result-contract identifier, but the initial state-behavior request already carries that identifier as production context. The option invocation itself has no extra elicitation. Therefore the run proves the elicited contract-bearing integration path under those conditions; it does not prove spontaneous option generation or authoring from production instructions without that operation/signature assistance.

## Revision and scenario boundaries

| Evidence | Revision/protocol basis | Follow-up contract observation |
| --- | --- | --- |
| Original run 6 / trial 2 | Captured dialog `@3`, wire `@2`; production text and schema match reconstructed `107e32f89a7737b315e767db1c092208afd9bd73` | Explicit non-null promise, forwarded to the investigator; accepted result projected as fulfilled |
| Focused option retry and completed run | `6f72f86d7cf4cfa1dd61c34e4455cc97ec42133b`, dialog `@6`, wire `@4`; elicitation supplies no operation names/signatures | Both returned options have null contracts; capped retry incomplete, extended run accepted with null fulfillment |
| Revised-selector chain | `2ed7b5f251157e2176879023694b5166892923b2`, dialog `@7`, wire `@5` | Invoked option has null contract; accepted with null fulfillment |
| Explicit report-answer chain | `2b0d0c3787f0a7787caf781faeba772ce2c98042`, dialog `@8`, wire `@6` | Invoked option has null contract; accepted with null fulfillment |
| Latest report-only check | `4267a051754f62f1c728295cfe94c09b4b9354af`, dialog `@9`, wire `@7` | No option invocation. The ordinary initial/fresh state-behavior requests have a contract, which is not follow-up-option evidence |

The first focused option attempt timed out before offering an option; it adds no contract-bearing invocation evidence. I rechecked the retained option and question contracts in each later option capture listed above, rather than inferring null contracts from prose summaries.

The original run spec did not record a checkout SHA. To sharpen the revision boundary, I reconstructed and built `107e32f` from Git and compared every captured instruction and hosted function schema against that build. All seven exchanges match exactly, including only the recorded elicitation and normal reference guidance; requested model/reasoning also match `gpt-5.6-sol` / medium. This confirms the captured instruction/schema basis, **not every original runtime file or a clean checkout at that SHA**. The qualification and terminal protocol identities independently record dialog `@3` / wire `@2`.

The earlier implementation also predates R4's exact-option question identity: the old question does not contain an `option` owner/key field, although the application invoked the retained owner/key and delivered its metadata. Current production has that identity distinction and later instruction/schema corrections. Original run 6 should not be represented as live verification of those later changes combined with a promised contract.

## Current offline coverage and added regression

Before this clarification, tests covered contract retention in option metadata, contract assessment, hosted request transport, and application follow-up invocation separately. The application follow-up scenario explicitly used a null contract. A focused application test for **non-null option-contract forwarding plus fulfillment assessment** was missing.

Commit **`956032c6c7c52eb2c574b270d489069c22331241`** adds that coverage to `test/contribution-application.test.ts`, using the real application, ledger, invocation, dialog coordination and answer selection with only agent communication substituted. An `examine-content` option promises the state-diagram contract, so the check cannot pass merely because the initial state-behavior Lens has a default contract. It verifies:

- the exact option's contract reaches the investigator, delivered option metadata and retained question;
- a conforming state-model answer is accepted and fulfilled;
- a prose-only answer remains accepted and retained but is **unfulfilled**, with the missing state-model requirement visible in both attempt assessment and selected answer; a contract shortfall does not trigger structural repair or discard useful content;
- reuse preserves each outcome without another dialog, and exact presentation preserves the captured answer;
- an unknown promised contract is refused before a dialog rather than silently treated as no contract.

The TypeScript build and **47/47** relevant application, results, state, hosted-transport and contribution-ledger tests passed, with no skips. `git diff --check` passed. No production code or method version changed; the production implementation remains `4267a05`. This closes a test-coverage gap, not a discovered runtime defect.

## Remaining gap and limits

There is still **no live option invocation promising a non-null contract under the latest production guidance and exact-option identity behavior**. Nor does the old successful run show a live nonconforming answer correctly reported as unfulfilled; that case is now explicitly covered offline. No new live trial was run or inferred from the authorization for this reconciliation. Cumulative M2 dispatches remain 103.

The earlier successful run is valid historical evidence within its recorded conditions. Current offline tests cover forwarding and fulfillment enforcement. Neither substitutes for a current live sample of that exact combination. Whether further live evidence is wanted is a human checkpoint judgment; this clarification does not treat it as a newly imposed gate.

The other accepted limitations remain: limited model/repository sampling with no measured first-submission reliability, generated-account accuracy not independently verified, lifecycle guarantees covered offline, one structural repair attempt, and no application/CLI configuration path selecting the hosted contribution agent. The historical prose-note observations are unchanged. M2 remains unaccepted and M3 has not begun.

## Audit provenance

The retrospective capture audit is retained in ignored `_verification/m2-contract-evidence-audit.mjs` and its JSON result. The reconstructed historical build is also ignored. The following hashes identify the five original capture files inspected now; they are retrospective fingerprints, not an original run manifest or proof of original checkout identity. Captures contain repository source and are not committed.

| File in original run 6 | Bytes | SHA-256 |
| --- | ---: | --- |
| `spec.json` | 1,222 | `f7693e7dfeff91992466c020b9235b9fea1c75e8216a426d6d019614f849b69b` |
| `steps.jsonl` | 72,731 | `cd87028b79a4cf46483f60ef49ab714025ea859af70718cefcf691ab4d4a587f` |
| `exchanges.jsonl` | 1,184,246 | `ef13fa4953ba555016b8e3d4129683b54934eec080101b77195152d668098332` |
| `attempts.jsonl` | 56,845 | `f4147eb598a7d3bb05772f9c66b8a5bec86660c783eec08695af512b0e594097` |
| `usage.json` | 75,856 | `d1483da78eb4cad416921617a04ae06f25fac14383b483ee91b417ec493c304f` |


## Subsequent authorized live evidence — 2026-11-18

After this reconciliation, the human authorized a focused current-revision trial. The [promised-contract verification](promised-contract-verification.md) now supplies the live sample identified as missing above: an explicitly promised non-null contract, exact-option question identity, current production guidance, accepted contribution and fulfilled contract. It used 7 requests without repair or retry. The preceding gap statement records the evidence available when the reconciliation was written; this later evidence does not change the original run’s revision/elicitation limits or the preserved reviews. Live nonconforming-contract behavior and broad reliability/accuracy remain unverified.
