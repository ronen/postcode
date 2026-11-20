# M2 early vertical application review: findings

Record type: findings
Received: 2026-11-17
Reviewer: Codex, independent review session
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 1
Reviewed target: `6f42db00af65d01e5e7f42c8bfab80aafcff4b30`
Reviewed scope: `d1c34ddc938e834ec96018991643a48eafb5659a..6f42db00af65d01e5e7f42c8bfab80aafcff4b30`; implementation, tests and supporting evidence for the M2 vertical checkpoint

## Returned findings

### Recommendation

Do not treat this checkpoint as sufficient to proceed to M3 yet. Eight actionable defects remain in the migrated vertical path. The principal issues are loss of qualified answer context, incomplete outcome reporting, and missing originating-question context for selected-content investigations. The dialog also has malformed-input and termination-accounting defects. These are conformance corrections within the adopted semantics, not requests to redesign the contribution model.

The mechanical wrapper integration and the basic successful application journey are promising: the focused contribution suite passes, identity mapping and separately attributed organizing policy are explicit, and the implementation demonstrates retained answers, explicit fresh execution and executable options. Those results do not cover the counterexamples below. Human determination of gate sufficiency remains required.

### Method and verification

Read the handoff, task follow-ups, approved plan, applicable foundation/specification/architecture material, the four contribution decisions, the reference-transport decision, and the M1 disposition. Inspected the implementation diff and relevant surrounding code, the new tests, the measurement script/record, and the committed live-trial account. Inspected available successful trial step records as supporting evidence, without treating scratch material as authority or a durable dependency of this report.

The checkout was clean at `28b65e5693dd3954b99588854b30bd4883c2b1e5`. Its changes after the reviewed target are task/review/validation records and diagram artifacts, not application source or tests. Consequently, the checked and executed application/test code is the exact assigned implementation target. Later records were read only as assignment/evidence context.

Independent checks:

- `npm run check` and `npm run build` passed using the existing installed dependencies; no fresh dependency installation was performed.
- `node --test --test-concurrency=2 _build/test/contribution-*.test.js` passed **52/52**, with no skips.
- `node --test --test-concurrency=2 _build/test/*.test.js` completed **738 tests: 735 passed, 3 failed, no skips**. The only failures were the sandboxed loopback sign-in cases listed next; no other offline test failed.
- The three loopback sign-in tests that failed under the sandbox passed in a separate unsandboxed run of `node --test _build/test/chatgpt-auth.test.js`: **20/20**, with no skips. No hosted inference was used.
- `git diff --check d1c34dd 6f42db0` passed.
- Executed controlled counterexamples against the built application, ledger and dialog for each finding below. The scripts were review probes, not changes to the committed tests.
- Rendered and visually inspected the committed fresh circuit-breaker and consecutive-breaker SVGs, and inspected the committed diagram text. The diagrams show the supplied state/transition structures; this does not establish the truth of the live architectural interpretation.

The accumulating-Session measurement was inspected, not independently rerun. No live-model trials were rerun, and no new inference authorization was assumed.

### F1 — P1: Answer construction drops qualifications and standing of the selected uses

Location: `src/lib/contributions/answers.ts:73–92`, especially the flattening through `designatedItems`, the qualification fallback at line 76, and the status selection at line 82.

The answer retains the top designation and a flat list of its eventual items, but not the qualified association paths through which those items were selected. Consequently, member-association qualifications, existing displacement context, and item/member inconsistency reports can disappear. A narrower designation qualification also replaces, rather than accompanies, its owner's qualification when that owner contributes no selected item. Evidence and support are retained as addresses without resolved supporting content or a supported application access route to those records.

Executed reproduction:

1. Retain a prose item under source qualification `SOURCE_LIMIT`, with an Entity association carrying `MEMBER_USE_LIMIT`.
2. Withdraw that association with qualified grounds `WITHDRAWAL_REASON`.
3. In another contribution, designate that exact association for a Query result. Give the designation owner `DESIGNATION_OWNER_LIMIT` and its declaration `DESIGNATION_NARROW_LIMIT`.
4. Construct and arrange the contribution answer. Its qualifications contain only `DESIGNATION_NARROW_LIMIT` and `SOURCE_LIMIT`; neither the member qualification, the designation owner's qualification, nor the already accepted withdrawal appears in the answer. Since the withdrawal predates the designation, there is correctly no later membership concern to accidentally disclose it.
5. Add a qualified inconsistency report targeting the selected prose item and another item. Reconstruct the answer: its identity and payload remain unchanged, and no inconsistency is disclosed.

This makes qualified or disputed selected information appear stronger than it is. It violates [qualified construction and retained support](../../../docs/decisions/qualified-answers-over-contributions.md#qualified-construction-and-retained-support) and [visible qualification](../../../docs/decisions/qualified-answers-over-contributions.md#visible-qualification-and-historical-navigation). A renderer with no ledger access cannot restore information discarded by construction.

Preserve the exact member-use graph and its applicable owner/declaration qualifications, standing, grounds, inconsistencies and necessary support in the immutable resolved answer, or through explicit fixed-support application access. Carry these qualifications into arrangement without consulting current history. Test cross-owner member selection, already-displaced members, item-targeted inconsistency and exact presentation after later changes. Do not manufacture exposure while assembling this support.

### F2 — P1: The application loses reported inability and the fresh attempt's fulfillment

Location: `src/lib/application/executor.ts:122–135`; `src/lib/contributions/answers.ts:94–95`.

`conductDialog` correctly distinguishes the attempt's fulfillment and `reportedInability`, but the application discards both. It returns the whole Query result's fulfillment, an accepted/not-accepted flag, and an attempt reference. Neither the report text nor a resolved attempt outcome is delivered. Communication/configuration diagnostics likewise lose their domain code/diagnostic, apart from optional raw provider reporting. An exact retained answer cannot recover those distinctions.

Executed two cases through `openApplication` on the real exports fixture:

- A valid partial prose answer reported inability `Could not verify concurrency` and a coverage statement. Both strings were absent from the complete returned application value, despite acceptance.
- After a fulfilled state-model answer, a fresh investigation submitted `{ investigrams: [], report: { inability: 'FRESH_INABILITY_SENTINEL' } }`. The application returned `failed: false` and `fulfillment: 'fulfilled'`, with no inability text or `no-answer-supplied` attempt fulfillment. The old answer legitimately remains current and fulfilled; it does not fulfill this fresh attempt, which returned no answer. The client is given no way to distinguish the two observations.

Preserve the producer report and the attempt's own outcome/fulfillment separately from current-answer fulfillment, including on ordinary reuse and exact access where answer-relevant. Keep invocation-specific reporting outside answer identity as required. This is the existing [access/outcome contract](../../../docs/decisions/common-analysis-contributions.md#access-and-outcomes), and repeats at the application boundary the distinction corrected in M1 round 4; acceptance must not erase an explicit shortfall.

### F3 — P2: Ordinary reuse remains tied to the first failed production after a successful fresh attempt

Location: `src/lib/contributions/evaluation.ts:42–45`, with `src/lib/application/executor.ts:132–135`.

The reuse lookup uses `productions().find(...)`, which always returns the first reusable production for a Query result. A retained initial failure therefore controls subsequent request failure/reporting even after an explicit fresh investigation supplies a valid answer.

Executed sequence through the application interface:

1. Ordinary state-behavior request: the scripted agent ends without submission; application reports failure.
2. `fresh: true`: the agent submits a valid state model and designates the repeated question's result; application reports `failed: false`, `fulfilled`.
3. Ordinary repetition: no dialog runs and the valid answer is selected, but the application reports `failed: true`, `reused: true`, and the original failed attempt's ID, while still reporting `fulfilled`.

Choose/report compatible reusable work without making an obsolete failed attempt the outcome of successful current retrieval. Preserve the failed attempt as history and preserve all standing answer alternatives; changing attempt selection must not introduce recency-based precedence among claims. Add the failure → successful fresh execution → ordinary reuse regression case alongside the already-tested success-first sequence.

### F4 — P1: Selected-content dialogs cannot obtain the originating question they are instructed to understand

Location: `src/lib/contributions/dialog.ts:253–270` and its acquisition tool surface; the reused delivery representation at `src/lib/contributions/production.ts:156–179`.

An item subject receives its enclosing item and an owner record with a production ID, but not that production's invocation, originating Query result, question, subjects, parameters or result contract. Acquiring the whole owning contribution still omits this context. There is no dialog tool to resolve a production/invocation/result into its originating request. `designations` returns associations, not the question they answer.

Executed reproduction: retain an item from an invocation with operation `ORIGINAL_QUESTION_MARKER` and parameter `scenario: ORIGINAL_SCOPE_MARKER`; start an `examine-content` dialog on the item, then explicitly request its whole contribution. Neither marker is present in either exchange. The earlier request exists in the ledger but is inaccessible to the investigating agent. This is not a character-bound omission.

The instructions require understanding and potentially redesignating the earlier answer, yet the new follow-up route cannot reliably supply the information needed to comply. Deliver the recorded originating context with selected-content baselines and provide supported further exact acquisition where needed, retaining an explicit distinction between originating question and navigation origin. Preserve the selected historical subject rather than following the current answer. This is required by [exact prior information as a subject](../../../docs/decisions/qualified-answers-over-contributions.md#exact-prior-information-as-a-subject) and the [acquisition baseline](../../../docs/decisions/association-organization-and-exposure.md#acquisition-baseline-context-and-discovery); it is an M2 integration gap, not a request to migrate the legacy `examine` Lens early.

### F5 — P2: Malformed agent acquisitions escape as internal exceptions

Location: `src/lib/contributions/dialog.ts:248–251` and `313–318`.

The runtime parser checks only `kind`, then casts arbitrary agent JSON to `DialogTool`. Several acquisition methods dereference the required address before producing an `InvalidAcquisition` or `UnknownReference`, so the existing refusal handling does not cover malformed requests.

Executed single-request dialogs with `{ kind: 'item' }`, `{ kind: 'association', association: null }`, and `{ kind: 'metadata' }`. Each threw `TypeError: Cannot read properties of undefined/null (reading 'investigram')` after the first exchange. In contrast, a malformed inventory was returned as unavailable and the dialog continued. The hosted request schema is non-strict and requires only `kind`, so the invalid cases can reach this boundary through the production transport.

Validate each request's required structure before dispatch and return a qualified unavailable response without recording acquisition. Keep genuine internal defects propagating; do not solve this by catching every `TypeError`. Test missing, null and wrong-shaped addresses through the dialog boundary.

### F6 — P2: A timeout forgets context already dispatched to the agent

Location: `src/lib/contributions/dialog.ts:283–286` and `321–324`.

The checkpoint for delivered acquisitions is advanced only after `await conversation.exchange(...)` returns. If the elapsed guard fires while that exchange is in progress, the catch block discards the responses and notices that were already passed to the agent, then retains the limit-stop production with an inaccurate input history.

Executed a controlled agent whose `exchange` records its input and never resolves, with an 80 ms guard. It received one baseline response containing the subject identification. The result was `limit-stop`, but the retained production had **zero deliveries**. No assumption about a network provider's receipt is needed: the communication participant demonstrably received the input.

Advance the delivered checkpoint at actual dispatch, while preserving rollback for acquisitions never dispatched. Test timeout after dispatch separately from timeout during acquisition before dispatch. The [actual-delivery exposure contract](../../../docs/decisions/association-organization-and-exposure.md#exposure-and-reconsideration) applies to failed attempts as well as accepted contributions.

### F7 — P2: Cancellation drops already reported provider usage from Session accounting

Location: `src/lib/contributions/evaluation.ts:49–56`; `src/lib/contributions/dialog.ts:321–334`.

Attempt reporting happens only after `conductDialog` returns normally. Interruption or Session invalidation throws out of that call, so no report reaches the Session's report map, even though `InvestigationUsage` already contains the dispatched call and its usage. The existing legacy executor emits its report in `finally`; this migrated route does not preserve that safeguard.

Executed an application request with a scripted agent that reported a valid synthetic input-token category, then aborted the supplied application signal. `execute` correctly threw `CommandInterrupted`, but the report callback was never called and `session.usage()` returned `attempts: []`, `calls: 0`, and no totals after one dispatched, accounted call.

Emit the final attributed attempt/usage report on interruption, invalidation and other terminal exits without retaining an unaccepted contribution or permitting late publication. Add direct cancellation coverage with usage received before abort, and preserve the distinction between missing usage and no call. This is an unaffected lifecycle/accounting obligation, not deferred migration work.

### F8 — P2: Diagram arrangement ignores the model's state bearer

Location: `src/lib/contributions/answers.ts:139–152`; `src/lib/contributions/state-diagram.ts:102–120`.

Every state model is rendered with the same caller-supplied `bearerLabel`; the renderer never reads `model.bearer`. Neither its text, legend nor notes preserve a scoped role or the identity of a different Entity bearer. A valid designated state-model-only answer meets the result contract, so accompanying prose cannot be assumed to repair this loss.

Executed reproduction: render otherwise identical models whose bearers are respectively `each cache instance` and `one connection`, supplying the same module label. The complete `StateDiagram` values are identical and both say `States of module`. An answer containing both models would present them as states of the same thing. The live records also exercise scoped instance bearers, so this is not confined to an unsupported content type.

Use each model's retained bearer meaning, resolving any needed qualified Entity label during answer construction and preserving scoped roles verbatim with output sanitization. A display label may abbreviate, but the delivered diagram-plus-explanation must retain what actually bears the state. Add a multi-model answer with distinct bearers and a role-bearing model without prose. This follows the [bounded state-diagram contract](../../../docs/decisions/structured-architectural-explanation.md#bounded-state-diagram-capability).

### Other observations and residual limits

- **Instruction evidence remains incomplete.** The [trial record](../../validation/structured-architectural-accounts/m2-trials/README.md) explicitly records no live inconsistency report, withdrawal, reuse/partitioning, or illustration. The plan requires deliberate elicitation across the instruction table rather than substituting deterministic mechanism tests. The recorded human trial direction explicitly permits deterministic-only change notices; it does not explicitly settle the other omitted rows. The four approved trials do demonstrate the successful basic vertical path. Before declaring the instruction checkpoint complete, obtain human disposition of the remaining live obligations or complete them within separately confirmed inference authorization. This review does not authorize additional live calls or presume that all omitted observations are product defects.
- **Warning breadth:** the measured baseline-scope and inherited causes follow the accepted propagation rule. The evidence does not justify suppression, clearance, or narrower scopes. The measurement is one bounded run; no statistical cost or usability conclusion follows from it.
- **Supersede versus add:** the live fresh investigation's qualified supersession is structurally permitted. Its description as confirmation/refinement alone does not prove that displacement was the right reasoning choice, but neither establishes a host defect. Preserve the grounds and qualified alternatives; do not impose a new semantic acceptance gate from this review.
- **One repair attempt:** a bounded single repair is an implementation choice, not independently a defect. First-error reporting can still leave a second error after repair. The limited successful final-protocol trials do not establish a reliability rate; malformed acquisitions in F5 are a separate boundary defect.
- **Hosted configuration and remaining migration:** constructing the hosted dialog agent in code satisfies the documented current route; a new configuration UI or CLI command is not required for this checkpoint. Remaining mechanical families, earlier interpretation operations, worker integration for their migration, and terminology cut-over remain M3/M4 work. No competing module Entity allocation or fabricated assembly exposure was found in the inspected wrapper path.
- **Documentation:** `docs/architecture/contributions.md` still says the hosted path has never run against a real model and later says the state-behavior/diagram/follow-up capabilities are unavailable, contradicting its own application-route section and the trial evidence. Correct those stale descriptions when recording corrections; they should not be read as additional scope deferrals.
- **Validation limits:** no independent inference run, complete protocol-capture audit, performance rerun, proof of interpretive correctness, or general renderer stress test was performed. Visual inspection plus the existing structural tests is limited evidence; F8 concerns retained meaning rather than aesthetic preference.

Only this findings record is changed and committed by the reviewer. Implementation, governing material, task status and the original handoff remain untouched.
