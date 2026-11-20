# M4 dialog 14 deduplicated-input live regression

Date: 2026-11-20
Task: [Structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Direction: task follow-up `c27b9ba`, after [integrated round 6](../../reviews/structured-architectural-accounts/2026-11-20-m4-integrated-round-6-claude-findings.md)
Production implementation: `3ef4e20dec8899b7bbd2b75cc8262ff11791cada`
Executed checkout and harness: `5216855bc46739404a0188410cc5a1775873b2b2`
Review assignment: [Final integrated review](../../reviews/structured-architectural-accounts/2026-11-19-m4-integrated-handoff.md)
Runner: [`run-dialog14-trial.mjs`](../../../scripts/structured-accounts/run-dialog14-trial.mjs)
Offline capture audit: [`audit-dialog14-trial.mjs`](../../../scripts/structured-accounts/audit-dialog14-trial.mjs)

## Result

**The focused live invocation succeeded on its first request, with no repair, retry or additional acquisition.** Seven selected subject/context entries became three distinct addressed content responses plus the invoked option's metadata. The live answer distinguished all three input mechanisms, supported its clarification with the three exact retained item addresses, and preserved the input limitations. The answer was accepted and designated for the invoked question.

The trial used **1 of 20 requests**, reporting **7,754 input + 892 output = 8,646 tokens**, with no missing provider usage report. Invocation elapsed time was **21.67 seconds** (20.59 seconds in the dialog). The objective was met and inference stopped. No production source, instructions, schema, bounds or acceptance behavior changed for this verification.

## Scenario and unchanged production instructions

A controlled setup submitted three qualified prose notes through the real application's contribution acceptance, offering an invocable retained option. The setup's communication participant is explicitly identified as `postcode-trial`, `controlled-dialog14-setup`, origin `scripted`; it is not a live authoring result. It neither writes directly into the ledger nor modifies an accepted request. The notes were manually prepared from the pinned Cockatiel module. Their owner qualification states:

> Controlled trial fixture: manually prepared notes about pinned Cockatiel code. This producing attempt has not verified source behavior. These retained input claims are not mechanically established facts.

| Exact item key | Distinct retained claim |
| --- | --- |
| `note_k` | Half-open admission waits for the decision when successes, failures and in-flight calls reach the configured budget, then calls `execute` again. |
| `note_r` | Manual isolation resolves a pending half-open decision and uses counted, individually disposable handles; the last release closes the circuit only while it is still Isolated. |
| `note_b` | A success from an old half-open episode is ignored by `recordHalfOpenSuccess` when its captured state is no longer current; this does not establish all failure/cancellation paths. |

The retained option selects `note_k` as its one subject and context `[note_k, note_r, note_k, note_b, note_r, note_b]`. All are whole-item selections from the same owner, with `component: null`. The original seven entries remain in the request and resulting question. The initial content responses are `[note_k, note_r, note_b]`, each carrying its own exact address. Thus the second response is `note_r` even though the second selected entry is another `note_k`; matching positions against the uncollapsed request would be wrong.

The option's ordinary delegated question is:

> Clarify how the selected half-open admission behavior relates to the additional selected notes on manual isolation and stale-completion handling. Keep the three mechanisms distinct, cite the exact retained item supporting each point, and preserve their limitations. A concise prose answer is sufficient.

The harness invokes this exact retained owner/key through the supported application `follow-up` Lens. Its `clarification` operation has no specialized result contract. The question deliberately asks for the three mechanisms and their support; it supplies no submission syntax, reference syntax, deduplication algorithm or positional-matching hint. **No elicitation or extra instructions were appended to the live dialog.** Every captured instruction byte equals production `dialogInstructions` for this operation plus the normal production reference instructions. The hosted tools/schema likewise equal production.

The relevant production instruction is unchanged:

> Initial responses cover subjects first, then additional context, once per exact selection in first-occurrence order. Repeated selections retain all their request roles but share that response. Different selection routes remain separate.

## Execution basis and accounting

| Basis | Value |
| --- | --- |
| Production methods | Dialog `postcode/contribution-dialog@14`; wire `postcode/contribution-dialog-wire@10` |
| Compiled-source SHA-256 | `5ad660bc9cdbb6b99b66c2cb90e8c70ed27dc02be76991e7283f433f8b2d9bde` |
| Fixture | Cockatiel `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`, clean before and after |
| Runtime | macOS, Node 22.13.1 |
| Route/model | App-managed ChatGPT sign-in, ChatGPT plan, `gpt-5.6-sol`, medium reasoning |
| Transport | `postcode/chatgpt-responses@7`, references `postcode/investigator-references@3`, zero transport retries |
| Production limits | 180,000 ms/dialog; 32 calls; 96 tool requests; 2,000,000 canonical exchange characters; one structural repair |
| Trial cap | New ceiling of 20 requests, reserved before dispatch; estimated 3–8 including normal repair/targeted retry |

The checkout was clean at launch and source/test files were identical to the independently reviewed production target. The build digest remained unchanged through the live run and final audit. Credentials came only through PostCode's existing credential manager. There was no API-key fallback or alternate model/route.

The shared request ledger contains one reservation, one completed exchange and one usage report. Application usage includes **two communication calls**: the controlled setup call, which has no usage report, and the hosted invocation, which has its provider usage report. The application's one missing report belongs to the explicitly scripted setup; it is not an additional inference request or missing provider usage. No usage anomalies were reported. Reported tokens are not confirmed billing or credit charges. Earlier trial budgets remain separate.

## Observed behavior, failures and repairs

The live agent submitted one qualified investigram with one prose item, `clarified_relationship`, and one new answer designation for the invocation. Its item support and declaration grounds both reference the exact owner and keys `note_k`, `note_r`, `note_b`. These are valid references to the initially delivered items, not new local stand-ins. The first wire response's handles decode to those same domain addresses.

The generated prose separates admission budgeting, isolation ownership and stale-success rejection into three paragraphs. It explains the relationship without swapping the notes: the budget limits admission; isolation can resolve the pending decision and change state; the old-state identity guard prevents a stale success updating its old episode. It explicitly retains that the success guard does not establish every failure or cancellation path. Item and owner qualifications state that this is clarification of manually prepared notes, without independent source inspection. The generated answer uses one supported prose item for the combined clarification rather than separate support lists for each paragraph; the addresses support the item collectively.

The audit finds one complete direct item exposure for each of the three initial records and one metadata exposure for the option. There are no redundant item deliveries, tool calls or later reacquisitions in this run. The request retains all its duplicate context entries while actual delivery/exposure records contain only what was dispatched.

| Outcome | Observed count |
| --- | ---: |
| Hosted inference requests | 1 |
| Accepted submissions | 1 |
| Transport failures, refusals or timeouts | 0 |
| Invalid submissions / structural repairs | 0 / 0 |
| Retries or additional live runs | 0 |
| Extra acquisition requests | 0 |

No failure or repair was needed; none was omitted from the accounting. The empty repair and failure lists are preserved in the audit output. Earlier trials' failures remain in their own records and are not superseded by this success.

## Verification and review limits

Before live dispatch, `node --check` passed for the runner, and its `--offline` preflight exercised the same retained fixture and application invocation without credentials or inference. That preflight verified the preserved seven-entry request, three distinct response addresses/bodies and option metadata. Its deliberately scripted inability report is a harness preflight outcome, not a live failure or an instruction-usability observation.

After the live run, the offline audit verified unchanged production instructions/schema/model settings, complete wire-to-domain request/response agreement, submitted-reference decoding, retained option/request agreement, exact delivered content and qualifications, actual exposure, and separated scripted/hosted request accounting. The accepted output's support addresses were independently compared with the three delivered addresses. Three deliberately corrupted copies were all rejected by the audit: changed instructions, a duplicated wire response replacing a different item, and a missing exposure record. These are audit controls, not production or live failures. Audit syntax, Markdown links and diff-whitespace checks passed.

No production change required another full-suite run. The [round 6](../../reviews/structured-architectural-accounts/2026-11-20-m4-integrated-round-6-claude-findings.md) **731/731** result remains attributed to `3ef4e20`; this record adds the focused live evidence and offline harness/audit checks. Representative memory was not repeated.

This single controlled scenario demonstrates successful use of addressed deduplicated inputs with the production dialog 14 instructions. It does not reveal the model's internal matching algorithm, establish statistical reliability, independently prove Cockatiel behavior, or verify every reference kind. All three live selections are whole prose items from one owner. Component/whole-item distinctions, different acquisition routes, repeated subject roles, bounded omissions, later reacquisitions and broader lifetime/atomicity cases retain their offline evidence. Returned-withdrawn-designation instructions were not exercised live here. This also does not claim live authoring of duplicate context: that setup was deliberately controlled.

Sanitized captures remain private in the ignored trial output directory `_trials/m4-dialog14-1/`: seed and setup result, exact domain inputs/replies, hosted exchanges and reference audit, terminal result, attempt reports, usage, spec, runnable harness/audit copies, preflight/final checks and budget. The **15-file** manifest is `_trials/m4-dialog14-manifest.json`, SHA-256 **`ca67e71a0d7d00c39eb565a325e9bdb327c2e189883b40aa2d6c8931bce2146c`**. Raw captures can contain source and are not committed; the scenario, observations, usage and limitations needed to interpret the result are preserved here. The committed runner and audit make the procedure inspectable independently of those local files.

The integrated assignment remains open for human-arranged review and sufficiency judgment. No task closure or merge is inferred.
