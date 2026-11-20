# Structured architectural accounts final integrated review: round 7 findings

Record type: findings
Received: 2026-11-20
Reviewer: Claude (Opus 5.5), the same session that performed rounds 5 and 6, reviewing the dialog 14 live evidence at the human's request
Handoff: [Structured architectural accounts: final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 7
Reviewed target: production implementation `3ef4e20dec8899b7bbd2b75cc8262ff11791cada`, unchanged; evidence and harness at `54383a3` (harness `5216855`, task follow-up `c27b9ba`)
Prior findings: [round 6](2026-11-20-m4-integrated-round-6-claude-findings.md) (earlier rounds as listed there)
Prior reviewed target: `3ef4e20dec8899b7bbd2b75cc8262ff11791cada`

## Returned findings

### Scope and method

- Reviewed the [dialog 14 live regression record](../../validation/structured-architectural-accounts/m4-dialog14-live-regression.md), the committed runner and audit, the round 6 section of the [disposition](2026-11-19-m4-integrated-disposition.md), and task follow-up `c27b9ba`.
- `git diff 3ef4e20 54383a3` touches no `src`, `test`, `tsconfig` or package files: only the two scripts and records. The production target is unchanged, so the round 6 result of **731/731** on a fixed build still applies and the suite was not rerun. The existing `_build` still yields digest `5ad660bc…9d2b9bde`, matching the record.
- Checked the private captures in `_trials/m4-dialog14-1/`:
  - the manifest hash `ca67e71a…2146c` matches;
  - the capture copies of the runner and audit are byte-identical to the committed scripts;
  - the committed audit, run against a scratchpad copy of the captures with the same build, passes all checks;
  - I read the hosted output, the retained answer and its support, and the budget ledger directly.
- No live inference. No implementation, governing, task or other record change other than this findings file.

### Assessment of the evidence

The record's claims are supported:

- **Production instructions and schema:** every captured instruction byte equals `dialogInstructions` plus the reference instructions, so no elicitation was appended. The hosted tools equal production, with model `gpt-5.6-sol`, medium reasoning, the ChatGPT-plan route, wire `@10` and zero retries.
- **Wire agreement:** the first wire request and its responses decode exactly to the domain input, and the submitted wire arguments decode to the captured reply.
- **Inputs:** one subject plus six context entries `[k, r, k, b, r, b]` are kept intact in the request and resulting question. They produce three complete addressed item responses `[k, r, b]` plus the option metadata. Bodies and item/owner qualifications match the retained records. Exposure is exactly one complete direct delivery per distinct item plus the metadata.
- **Accounting:** one hosted request against a cap of 20, 7,754 + 892 = 8,646 tokens, no missing hosted usage. The single scripted setup call is counted separately. The hosted output was one `submit_contribution` with no tool calls, failures or repairs.
- **The live answer:**
  - it is accepted and designated for the invoked question;
  - its prose keeps admission gating, isolation ownership and stale-success rejection distinct and correctly attributed;
  - it cites all three exact retained addresses as support;
  - it preserves the input limitations ("does not establish all failure or cancellation behavior");
  - it explicitly qualifies its one inferential link, that isolation may make a completion stale, as an example rather than an exclusive cause.
- **Controlled setup:** it is honestly identified (`postcode-trial` / `scripted`), goes through real acceptance, and its notes carry a qualification stating they are manually prepared and unverified. The record does not present it as live authoring.

### Findings

None.

### Observation: what the trial can and cannot discriminate

This scenario shows that the production `@14` instructions and deduplicated inputs work in a live dialog. It cannot show that the agent matches responses by address rather than by position. Three features make the two strategies indistinguishable here:

- each note's text announces its own topic ("Half-open admission: …", "Manual isolation: …", "Stale completion: …");
- the delegated question names the three mechanisms;
- the cited addresses come from each response's own address field.

An agent that ignored the request entries altogether, or matched them by position, would produce the same answer and the same citations.

The record partly acknowledges this ("does not reveal the model's internal matching algorithm"). It should not be read as live evidence for address-based matching specifically. The practical consequence of the gap is small. Subjects are always delivered first, so the subject response is unaffected, and context entries carry no roles, so misaligning context only matters for a question that refers to context entries by position. A more discriminating trial would need neutrally labeled items and a question about specific context selections. I do not consider that necessary for the gate, and it would need separate authorization for inference.

### Residual limits

- A single run on a single controlled whole-item scenario.
- Component versus whole-item routes, designation and whole-contribution routes, repeated subject roles, bounded omission and live authoring of duplicate context keep only their offline evidence.
- The returned-withdrawn-designation guidance was not exercised live.
- The truth of the input notes and generated prose about Cockatiel is not established. Representative memory was not remeasured.
- This round, like rounds 5 and 6, comes from one reviewing session. Round 5 was the only fresh full-branch derivation of the final mechanism by this reviewer.

### Gate recommendation

The dialog 14 evidence is accurately recorded and reproducible, and no correction is needed. With round 6's clean result on the unchanged production target, I see no further correction needed before the human's sufficiency determination for the final integrated gate. If the human wants that determination to rest on a reviewer independent of rounds 5–7, a fresh full-branch review of `3ef4e20` would provide it. Review sufficiency, task closure and merge remain the human's decision.
