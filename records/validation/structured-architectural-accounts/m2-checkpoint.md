# M2 early vertical application

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Plan: [Structured architectural accounts](../../../docs/plans/structured-architectural-accounts.md#2-early-vertical-application)
Starting revision: `d1c34ddc938e834ec96018991643a48eafb5659a` (M1 disposition)
Implementation: `6f42db0`

## Scope reached

Milestone 2 integrates real producers, an agentic dialog, the state-behavior concept with a real diagram, and the application route, all on the M1 mechanism. The human found the M1 gate satisfied on 2026-11-16. Two follow-ups during M2 are recorded verbatim in the task record: the resolution of the secondary-standing question, and the approval of the live trials.

| Commit | Increment |
| --- | --- |
| `f72e2e0` | Module identification contributed through a Session-owned ledger paired with the record store; one common Entity per module |
| `a58c2c9` | Export findings contributed; the internal exports answer selects its naming and export finding from the ledger |
| `69ef0fc` | Agentic dialog over the ledger: initial context, acquisition, exact change notices, bounded repair and outcomes |
| `4d4c12c` | State-model content type, state-behavior concept guidance, state-diagram result contract and renderer |
| `0f571e7` | Application route: the `state-behavior` and `follow-up` Lenses, explicit fresh investigation, and a retained contribution answer |
| `5e81a83` | Hosted transport generic over typed dialog protocols; the contribution protocol over it |
| `ce03f16` | Delivery correction found by the measurement; measurement script and record; live-trial harness |
| `85f1b49`, `107e32f`, `6f42db0` | Corrections found by the live trials: adapter repair turn, exact submission shapes, complete submission schema, renderer loop and caption placement |

The [architecture account](../../../docs/architecture/contributions.md) describes each part as implemented.

## Plan requirements for M2

| Requirement | Status and evidence |
| --- | --- |
| Real module identification | Each module's identifying finding is contributed under the discovery method, and a separately attributed policy uses it. A module record and its Entity resolve to each other. Tests in `test/contribution-modules.test.ts`. |
| Exports needed for an export answer using retained module naming | The exports answer selects the discovery method's naming and the export method's finding from the ledger, and captures their standing. Mechanical claims and qualification are the provider's own records. |
| A read-only export assembly creates no production exposure | Verified: assembling and repeating the answer leaves every production's deliveries empty. |
| A producer consuming retained module information records it | Verified with a mechanical consumer and with dialogs. The baseline identification and the retained export finding are recorded deliveries of the consuming production. |
| Equivalent provider recomputation after displacement adds no associations | Verified for identification and exports after withdrawal; the method's own finding remains, with its standing. |
| Naming qualification and mechanical semantic content survive the wrapper | Verified; the finding carries the discovery Claim context, and a mechanical qualification can name only a Claim context of its own method. |
| Agentic state-dependent behavior, real diagram contract and renderer | Implemented. Prose does not fulfil the diagram contract, and each alternative is assessed separately. |
| Accepted partial outcomes and declarations | Verified: an accepted contribution with a reported inability keeps its declarations in effect and is reported unfulfilled. |
| A retained follow-up option executed through the application API | Verified deterministically and live. |
| Focused live trials and controlled dialogs across acquisition, retention, exact access and rendering | Controlled dialogs on real fixtures in `test/contribution-dialog.test.ts` and `test/contribution-application.test.ts`. Live trials in the [trial record](m2-trials/README.md). |
| Bounded accumulating-Session exercise against the baseline | [Measurement record](m2-measurement.md). |

## Obligations carried from M1

| Obligation | Status |
| --- | --- |
| Equal mechanical answers under reordered arrival | Verified for the exports answer. The structured answer, resolved content and both renderings are equal under the shared comparison policy whether independent contributions arrive before the findings, after them, or not at all. The remaining mechanical families are M3. |
| One Entity per module, no competing interpreted copy | Verified. |
| Qualification and reference integrity for program records | Verified; unresolved references are rejected, and a mechanical qualification context must be a Claim context of the producing method, checked by record kind and method. |
| Shared Session lifetime and invalidation | The ledger is created for and released with the Session's record store. Heap after Session close equals the baseline in the measurement. |
| No capability left on both regimes after migration | For module identification and exports, the module claim remains as the finding's full statement and the ledger organizes it. Module inventory, inspection, organization, dependencies and the earlier interpretation operations remain on the earlier structures until M3. |
| Result delivery through the real dialog | Verified with a substituted agent participant and live. A dialog that requests exports receives the mechanical finding that request retained, through its own production, and a change it receives that way is not a later cause for its output. |

## Defects found and corrected during M2

- **Delivery bundling.** For modules with large export surfaces, the dialog bundled the evidence page with the retained finding and both were withheld. Found by the measurement and corrected in `ce03f16`.
- **Hosted adapter repair turn.** The adapter did not keep a submission call pending, so a repair turn failed. Found by live trial and corrected in `85f1b49`.
- **Harness exclusion.** The harness excluded its ledger's directory, and with it the project. Found by live trial and corrected in `85f1b49`.
- **Renderer overlaps.** Overlapping self-loops, captions hidden behind states, and a caption across a state label. Found by inspecting live diagrams and corrected in `85f1b49` and `6f42db0`.
- **Unclear instructions.** Grounds, options, `unsupported`, content bodies and report placement were not exactly specified, and the submission schema was open. Found by live trials and corrected in `85f1b49` and `107e32f`. Each observed mistake is kept as a regression case.

## Capability migration status

| Capability | Status at this checkpoint | Applicable contract | Required by |
| --- | --- | --- | --- |
| Module identification | Contributed through the ledger; deterministic handles and module claims unchanged | New, for the identification and its use | — |
| Effective exports (internal exports answer) | Contributed and selected through the ledger | New | — |
| Module inventory, inspection, organization, dependencies, documentation, composition | Unmigrated | Pre-adoption contracts | M3 |
| `summarize`, `explain`, `decompose`, `examine` | Unmigrated: legacy trees, correction and citations | Pre-adoption contracts | M3 |
| State-behavior investigation and diagram | Available through the application interface; no CLI route or Presentation | New | — |
| Follow-up option invocation | Available through the application interface for supported operations | New | — |
| Explicit fresh investigation | Available for contribution Lenses; refused for mechanical Lenses and the earlier interpretation operations | New | M3 for the earlier operations |
| Hosted agent for contribution dialogs | The protocol exists; no application or CLI configuration path selects it, and a caller constructs it | New | M3 or M4 |
| Exposure-index terminology | Not started | New terminology | M3 |

## Legacy check families at this checkpoint

No existing test was removed or weakened. Two were changed:

- **One exports test** in `test/exports-lens.test.ts` stores controlled partial and unavailable evaluations directly. It now passes them through the same contribution wrapper as real evaluations, because the exports answer deliberately fails when a finding was never contributed.
- **The shared comparison policy** in `test/comparison.ts` treats the new Entity and investigram reference fields as references.

The remaining families keep the restoration milestones recorded at M1.

## Risks and questions for review

- **Warning breadth.** One change that identifies every module again flags every dialog that acquired those modules' baselines. The measurement shows one cause per changed module per dialog, cheap to derive. The decision anticipates this breadth, and it is not mitigated.
- **Supersede versus add.** In the live fresh investigation the agent superseded an earlier interpretation it described as confirmed and refined. That is permitted with grounds, but a reader might expect an added alternative.
- **Single repair attempt and first-problem reporting.** Under the final protocol no trial needed more than one repair, but several independent mistakes in one submission would still exhaust it.
- **No configuration path for the hosted dialog agent.** Live use requires constructing the agent in code.
- **Answer record size.** A contribution answer carries its selected content, which keeps exact presentation independent of the ledger and makes answer records larger.

## Verification

Run by the implementing agent, offline except where stated:

- `npm run check` and `git diff --check` passed at `6f42db0`.
- The full offline suite passed **738/738** with no skips at `6f42db0`. That is the 668 tests of the starting revision, of which one was adapted as described, plus 70 new tests. Earlier complete runs during M2 that failed did so under heavy background load or machine sleep, with "Session invalidated" errors and per-test durations of many minutes. They were rerun under normal load before each commit.
- The accumulating-Session measurement ran on the baseline and current builds; see its record.
- Live trials used 39 of the approved 60 requests on the ChatGPT plan route; see the trial record.

These are implementing-agent checks, not independent review. Milestone 2 is implemented and awaits the human-arranged checkpoint review.


## Corrections to the round 6 intent-check observations — 2026-11-17

Human direction was recorded before implementation in task follow-up `d7c4972`. Both observations in the [round 6 corrections intent check](../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-6-corrections-intent-check-claude.md) are addressed by implementation commit **`2ed7b5f251157e2176879023694b5166892923b2`**, the exact target for further independent review under the existing [M2 handoff](../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-handoff.md). The historical review and handoff are unchanged.

- **Displacing production concerns:** exports presentation now exposes the captured producing-context status, with exact causes, routes, grounds and source qualifications available in the View. Rendering attributes reconsideration to the displacement's production and explicitly states that it does not establish an error, reverse displacement or reinstate the earlier association. The mechanical export finding's qualification stays separate. A focused regression introduces a later cause, verifies its visibility in a fresh answer, and checks that the earlier retained answer's capture, View and rendered text stay unchanged. Standing is unchanged.
- **Component selectors:** shared production and schema guidance explains that a selector addresses a locally addressable part of a content item, with supported selectors defined by its content-type contract and listed in a retained item's `components` array. State-model guidance specifies `state:<key>` and `transition:<key>`. Arbitrary body fields are not selectors; agents are told to omit `component` and target the whole item when no supported selector is available. Validation and the ordinary bounded repair path are unchanged. Regressions preserve both observed invalid values, `unsupported` and `HalfOpen concurrency and deferred-decision semantics`, assert rejection without ledger mutation, and exercise repair to whole-item and valid state/transition targets.

The concurrently returned [round 7 findings](../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-7-claude-findings.md) reviewed live evidence from `6f72f86d7cf4cfa1dd61c34e4455cc97ec42133b`, read at `372e5ec`. That review did **not** assess these corrections. Its R7-F1 identifies the same selector-guidance gap; its capture evidence supplied the second invalid-value regression above. The new implementation target remains subject to independent review.

Identity versions are now exports Presentation `@8`, contribution dialog `@7` and contribution wire `@5`. Export capture semantics and supported selector semantics did not change.

Implementing-agent offline verification under Node 22.13.1:

- TypeScript build passed.
- **163/163** selected contribution, application, exports, source-disclosure, answer-identity and presentation tests passed, with no failures or skips.
- After adding the second observed selector to the regression, a fresh build and **22/22** dialog, hosted-protocol and module tests passed, with no failures or skips. This expanded test data after the 163-test run; no production code changed between those runs.
- `git diff --check` passed. Local logs are in ignored `_verification/m2-intent-observations.log` and `_verification/m2-intent-expanded-regression.log`.

No live inference was run for these corrections. **The revised production instructions have not yet been verified live.** Earlier live evidence remains evidence for its recorded implementation and does not establish first-submission success or the architectural correctness of generated explanations under the revised instructions. Cumulative dispatched inference usage remains 69 of the previously authorized 70 requests; the latest direction authorizes no additional live inference. M2 remains unaccepted, and M3 has not begun.


## Subsequent authorized live verification — 2026-11-17

After the offline corrections above, task follow-up `76e2ea6` authorized up to 30 additional inference requests, with further attempts only to resolve specific uncertainties. The [revised-selector live record](m2-trials/revised-selector-verification.md) now supplies live evidence for implementation `2ed7b5f251157e2176879023694b5166892923b2`: one completed chain used 13 requests. The authored option used valid `state:half`; an unrelated invalid invocation-as-investigram reference in its report was repaired normally without changing the selector. The exact option, meaning and selector reached the subsequent investigator, whose first submission was accepted. Initial contract fulfillment and null follow-up fulfillment matched the actual requests. Production instruction/schema equality and usage were checked against all captures.

This later evidence supersedes the earlier lack of live verification for the revised instructions; the preceding correction record remains an accurate account of its verification at that time. No code, elicitation or repair behavior changed for this run. No further live attempt was made, and 17 of the newly authorized requests remain unused. This is focused integration evidence, not architectural proof, broad reliability evidence, or independent review of the corrections. M2 remains unaccepted and M3 has not begun.


<a id="round-8-corrections"></a>
## Round 8 correction and verification — 2026-11-17

Human direction for [R8-F1](../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-8-claude-findings.md) was recorded before implementation in `d17f51b`. Correction **`2b0d0c3787f0a7787caf781faeba772ce2c98042`** clarifies `report.answer` in shared production and hosted-schema guidance. Own answer designations already count; the optional report can explicitly return existing designations of this invocation's Query result. Retained owning-investigram handles and declaration keys, and applicable submission-local investigram references, are documented and represented by the schema. Invocation/Query-result/arbitrary handles are not answer-designation references. Harmless repetition of an own designation remains accepted. Validation, selection, standing and repair semantics are unchanged. Dialog advances to `@8` and wire to `@6`.

The TypeScript build and **166/166** relevant offline tests passed with no skips. Focused coverage checks instruction/schema agreement, actual hosted translation of retained and local report references, own-designation omission and harmless repetition, atomic rejection and normal repair of the observed invocation reference, and explicit reuse of an existing designation without clearing its exact nonzero reconsideration causes or creating another designation. `git diff --check` passed. No historical review or handoff was rewritten.

The [focused live record](m2-trials/report-answer-verification.md) verifies the revised guidance on that same implementation: the initial and follow-up new answers omitted `report.answer` and were accepted without repair; a fresh investigator then returned the initial designation explicitly, with unchanged projected answer content and fulfilled contract. The fresh attempt needed ordinary repair for an unrelated empty investigram, which is preserved. The run used 15 of the chosen 30-request ceiling and stopped because the objective was met. This follows the live-trial cap guidance subsequently pointed out on `main` at `c7aa85c`. Generated architectural explanations and the adequacy judgment remain unproved. The correction and evidence are ready for independent review; M2 remains unaccepted and M3 has not begun.


<a id="round-9-corrections"></a>
## Round 9 correction and offline verification — 2026-11-17

The preserved [round 9 findings](../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-9-claude-findings.md), committed by the reviewer in `b156034`, confirm R8-F1 resolved and identify the adjacent instruction gap R9-F1. The correction is **`4267a051754f62f1c728295cfe94c09b4b9354af`**, the new exact implementation target under the existing M2 handoff. Historical findings and the handoff are unchanged.

Shared production and hosted-schema guidance now states that an answer-only return can submit `investigrams: []` with its producer report, without a placeholder investigram. Every supplied investigram must contribute content, declarations or qualified metadata; qualification alone is insufficient. An optional adequacy judgment may be retained as a qualified prose item without a new answer designation. Existing validation, selection, standing and bounded repair semantics are unchanged. Dialog advances to `@9` and wire to `@7`.

The TypeScript build and **96/96 contribution tests** passed, with no failures or skips. The focused regression checks shared instruction/schema guidance, direct acceptance of the minimal report-only return, atomic rejection of the observed qualification-only `review` placeholder, and normal repair either by removing the placeholder or by adding a qualified prose note. All successful paths preserve the exact earlier designation and fulfill the original contract without creating a new answer designation. Existing tests for nonzero reconsideration-cause preservation also passed. `git diff --check` passed.

**The revised wording has not been verified live.** No inference was run for this correction; cumulative M2 dispatches remain 97. Earlier live evidence retains its original implementation target and limits. A narrow initial-answer/fresh-return live check was discussed as useful but optional; discussion alone does not authorize it. Independent review of this correction remains outstanding. M2 remains unaccepted, M3 has not begun, and merging `main` remains deferred to the next deliberate checkpoint as agreed.


## Authorized live verification after round 9 — 2026-11-17

The human subsequently authorized the proposed narrow live check in task follow-up `ff143d2`. The [report-only live record](m2-trials/report-only-verification.md) now verifies implementation `4267a051754f62f1c728295cfe94c09b4b9354af` with an initial investigation and fresh adequacy review. Both submissions were accepted without repair. The fresh investigator used an empty `investigrams` array and explicitly returned the original designation; it created no new investigram or designation, fulfilled the original contract, and retained the same projected answer alternative.

The run used 6 of 20 authorized requests, with 14 unused, and stopped because the focused objective was met. All six exchanges matched current production instructions/schema and reported usage; totals were 145,345 tokens. No implementation or elicitation changes were made during execution. This later evidence supplies live verification of the revised wording; the preceding offline-only record describes its state at that earlier point. Generated architectural claims and the adequacy judgment remain unproved. M2 remains unaccepted and M3 has not begun.


<a id="round-10-contract-evidence"></a>
## Round 10 follow-up contract evidence reconciliation — 2026-11-17

Under task follow-up `678e665`, the [contract-evidence clarification](m2-trials/follow-up-contract-evidence.md) reconciles the original trial record with the limitation stated in the preserved [round 10 accompanying note](../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-10-claude-addendum-findings.md). Original run 6 demonstrably invoked and fulfilled an explicitly promised non-null contract. Its old instruction/schema versions and operation/signature-assisted elicitation limit that evidence. Later focused option runs used null contracts; the latest return-only run had no option invocation. A non-null follow-up under the latest guidance and exact-option identity remains unobserved live.

Current component tests covered the pieces, but application-level non-null option-contract forwarding and fulfillment coverage was missing. Test commit `956032c6c7c52eb2c574b270d489069c22331241` fills it, checking positive fulfillment, accepted-but-unfulfilled prose, reuse, exact presentation and unknown-contract refusal without inference. Build and 47 relevant offline tests passed with no skips. Production code and method versions are unchanged at `4267a05`. No additional live inference was run; cumulative dispatches remain 103. Historical reviews are unchanged, other accepted limitations remain explicit, M2 remains unaccepted, and M3 has not begun.
