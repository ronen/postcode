# M2 early vertical application review: findings

Record type: findings
Received: 2026-11-17
Reviewer: Claude (Opus 5.5), independent review session arranged by the human. This session did not take part in implementing M2 or in writing the earlier intent checks.
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 4
Reviewed target: `56995015770f4c1a8bf4a91ca179526884dafd97`
Reviewed scope: `d1c34ddc938e834ec96018991643a48eafb5659a..56995015770f4c1a8bf4a91ca179526884dafd97`, the full M2 vertical result, assessed afresh
Prior findings: [M2 round 3 findings](2026-11-17-m2-vertical-round-3-findings.md), with [round 1](2026-11-17-m2-vertical-round-1-findings.md), [round 2](2026-11-17-m2-vertical-round-2-findings.md) and the [round 1](2026-11-17-m2-vertical-round-1-corrections-intent-check-claude.md) and [round 2](2026-11-17-m2-vertical-round-2-corrections-intent-check-claude.md) intent checks as context
Prior reviewed target: `56995015770f4c1a8bf4a91ca179526884dafd97`. Round 3 reviewed the same target, so no corrections are presented for this round.

## Returned findings

### Recommendation

**Not yet sufficient to proceed to M3.** I found one P1 and one P2 defect in the follow-up option path. M2 is required to deliver that path, and earlier rounds did not examine these cases:

- Invoking a retained follow-up option can return the answer to a different option as its own (R4-F1).
- The production instructions do not tell an agent how to author an option that can be invoked (R4-F2).

Three P3 defects concern presentation fidelity and test robustness (R4-F3 to R4-F5). The rest of the vertical result holds up under fresh inspection, including the corrections from rounds 1–3. Some of R4-F1's possible resolutions would change answer-identity semantics, and that part may need human direction (see R4-F1).

This is a recommendation to the human who controls the gate. It does not begin M3 or close the task.

### Scope and method

I read the handoff, the task record including the 2026-11-17 follow-up, and dev/review.md. I also read the approved plan, in full for M2, the verification tables and the instruction table. I read the M2 checkpoint, measurement and trial records, and the qualified-answers, structured-explanation and association/exposure decisions where they apply. I treated all findings and intent checks from rounds 1–3 as context, not proof.

I read the M2 source changes across the whole range, concentrating on these files:

- `contributions/{answers,answer-support,outcomes,evaluation,dialog,state-model,state-diagram,modules,operations,catalog}.ts`
- `application/{executor,lenses,requests,catalog,session,retained}.ts`
- the exports wrapper and its presentation
- the hosted contribution protocol and its adapter changes

I wrote targeted probes against the built target. They are review scripts and were not committed. I inspected the trial records and the elicitation inputs recorded in the worktree's ignored `_trials/` directory, read-only. I ran no live inference.

The worktree's HEAD is `9c1f047`. Every commit after the target changes only task and review records, so I built and tested an exact export of the target, made with `git archive 5699501`.

### Independent verification

Under Node 22.23.4 on Linux, with a fresh `npm ci`:

- `npm run check` and `npm run build` passed, and `git diff --check d1c34dd 5699501` passed.
- Contribution and ledger suites (`contribution-*.test.js`, `contributions.test.js`): **83/83 passed**.
- Full offline suite, run in six batches because of the tool time limit: **751 tests, 748 passed, 2 failed, 1 skipped**. Both failures are in `chatgpt-auth.test.js`, which uses cross-process kernel locks (`lock child exited before ready`); this sandbox does not support them. The skip needs a case-insensitive filesystem. I consider neither related to M2, but I have not confirmed the two lock tests elsewhere.
- These counts are from a checkout at a path as long as the user's worktree path. At a shorter checkout path, one M2 test fails deterministically; see R4-F5.
- R4-F1, R4-F3 and R4-F4 were each reproduced by an executed probe, and R4-F2 by inspecting the generated instructions for both operations.

### R4-F1 — P1: Invoking a follow-up option can return another option's answer

**Location.**
- `src/lib/application/executor.ts:156`: the follow-up route passes `option.request` alone as the invocation, and passes the option's address only as dialog context.
- `src/lib/contributions/ledger.ts:241`: a Query result is keyed by the canonical request.
- `src/lib/contributions/evaluation.ts:49–55`: ordinary reuse.
- `src/lib/investigation/openai/contribution-protocol.ts:61`: the option request schema allows only `operation`, `subjects` and `resultContract`, and `additionalProperties` is false.
- `src/lib/contributions/dialog.ts:150`: the instructions state the same shape.

**What happens.** The option's key, owner and meaning never become part of the invocation request. Two options are therefore treated as one question whenever they have the same operation, subjects and result contract. The first invocation runs a dialog. The second reuses that dialog's outcome: no dialog runs, and the second option's meaning is never delivered to any agent.

The hosted schema does not allow `parameters` in an option request. A live agent therefore cannot make two such options differ, other than through a content `component`.

**Executed reproduction**, through `openApplication` with a scripted agent on a one-module fixture:

1. A state-behavior answer offers two options on its own state-model item, both `examine-content`:
   - `reopen`, meaning `MEANING_A: investigate how the open state is left`;
   - `shared`, meaning `MEANING_B: investigate whether the state is shared between callers`.
2. Invoking `reopen` runs a dialog. The dialog receives `MEANING_A` and answers `ANSWER_TO_A`.
3. Invoking `shared` returns `reused: true` with the same Query result. Its answer is `ANSWER_TO_A`, and its projection carries `parameters: { option: 'shared' }`. Only two dialogs ran in total, and `MEANING_B` was never delivered.
4. An explicit `fresh: true` invocation of `shared` does run. Its answer is designated for the *same* Query result, so a later ordinary invocation of `reopen` returns `ANSWER_TO_A` and `ANSWER_TO_B` as two equally standing alternative answers to one question.

**Why this is a defect.** The [structured-explanation decision](../../../docs/decisions/structured-architectural-explanation.md) says the following about options:

- the follow-up Lens "delegates the specific question to that qualified option while preserving its exact owner/key and meaning";
- each option carries "enough retained meaning, target/reference and parameter information to invoke it";
- "no … automatic result-reuse policy is introduced".

The application instead delivers, as the answer to the requested option, an answer produced for a different delegated question. Nothing in the answer discloses this. The conflated alternatives in step 4 also break the guarantee that alternatives are distinct answers to the same question.

The existing test (`test/contribution-application.test.ts`) offers only one executable option, so it cannot observe this.

**Resolution.** There are two directions, and choosing between them may change answer-identity semantics, so it may need human direction:

- make the invoked option, or its retained meaning, part of the invocation's question identity;
- or allow and require distinguishing parameters, and treat options with identical requests explicitly as the same question.

Whichever is chosen:

- invoking a distinct option must not silently return another option's answer;
- the second option's meaning must reach a producing dialog;
- a fresh follow-up must not add alternatives to a different option's question.

Ordinary reuse of a genuinely equivalent request should remain. Add a regression test with two options that share a request but differ in meaning.

### R4-F2 — P2: The instructions do not tell an agent how to author an invocable option

**Location.** `dialogInstructions` in `src/lib/contributions/dialog.ts:129–154`, and both entries in `src/lib/contributions/operations.ts`. The follow-up route that refuses an unknown operation or subject kind is at `src/lib/application/executor.ts:149–155`.

**What happens.** The instructions describe the shape of an option. They never name the operations that can be invoked (`state-behavior`, `examine-content`), the subject kind each accepts, or a result contract identity an option could promise.

I generated the instructions for both operations. Neither contains `state-behavior`, `examine-content` or `postcode/state-diagram-answer@1`. A state-behavior dialog sees only its own operation and contract, in `input.request`. An examine-content dialog never learns that `state-behavior` exists. No dialog learns of `examine-content` at all.

**Trial evidence.** The live follow-up evidence depends on information that production dialogs do not receive. The trial-1 elicitation supplied it explicitly: "Name a supported operation, either state-behavior with one module Entity as its subject, or examine-content with one exact content item of your own submission as its subject".

**Consequence.** Without that text, an agent that offers an option has to guess the operation name. A wrong guess gives an option that is retained and shown in the arranged view with its operation. Invoking it is refused as `unsupported-subject`.

This is the question the handoff asks under focus 4, a detail a live agent is likely to get wrong. It also bears on the plan's instruction row "Author follow-up options and illustrations with the correct scope".

**Resolution.**
- Supply the supported operations, their subject signatures and the promised result-contract identities in the dialog instructions or input.
- Consider a schema `enum` for the operation.
- Record whether the trial-1 option observation still stands without the elicitation's operation list. Re-running it needs separately confirmed inference authorization.

### R4-F3 — P3: The arranged answer omits selected content it cannot present, without notice

**Location.** `arrangeContributionAnswer` in `src/lib/contributions/answers.ts:235–238`.

**What happens.** The arrangement presents only `prose` bodies and the state models that can be drawn.

- A state model that cannot be drawn is discarded silently when another model in the same alternative can be drawn. `diagramUnavailable` is then null, and when no model can be drawn it reports only `models[0]`.
- Selected items of any other type, such as `identification`, appear only as a "Selected content: key" qualification group, without their body.
- `assessFulfillment` counts the requirement as met when any model is drawable, so no `unmet` entry or notice records what was left out.

**Executed reproduction.** One designated alternative selects four items:

- a drawable model;
- a zero-state model with bearer `the shared pool`, `applicability: POOL_APPLICABILITY` and `unsupported: [POOL_CONCURRENCY_NOT_REPRESENTABLE]`;
- an identification item;
- a third model.

The answer reports `fulfilled` and draws two diagrams, with `diagramUnavailable: null` and no notices. None of `the shared pool`, `POOL_APPLICABILITY`, `POOL_CONCURRENCY_NOT_REPRESENTABLE` or the identification's name or designation appears anywhere in the arranged view.

**Impact.** The structured answer still carries the content, so nothing is lost from retention. The arranged "explanation with pictures" can still hide material qualification an agent attached to selected content, and not only edge cases of form.

**Resolution.** Report every selected state model that cannot be drawn, per alternative. Present, or explicitly list as not presented, selected items of types the arrangement does not render.

### R4-F4 — P3: Distinct states can render indistinguishably

**Location.**
- `src/lib/contributions/state-model.ts:54`: keys must be unique, labels need not be.
- `src/lib/contributions/state-diagram.ts:47`: the text form and legend use labels.
- `src/lib/contributions/state-diagram.ts:97`: SVG node labels are truncated to 20 characters, with no mnemonic.

**Executed reproduction.** A valid model with:

- states `Waiting for primary response`, `Waiting for primary response (retry)`, `Done` and `Done`;
- transitions `w1→d1` and `w2→d2`.

The results:

- The SVG has two boxes both labelled `Waiting for primary…` and two labelled `Done`.
- The text form lists `[Done]` twice.
- The legend gives `T1 Waiting for primary response → Done` and `T2 … (retry) → Done`.

From the picture, a reader cannot tell which box is which state. From the text and legend, a reader cannot tell whether the two transitions end in the same state or in different ones.

**Plausibility.** Live labels already exceed 20 characters, for example `Opening criterion satisfied` and `Unordered numeric comparison` in the committed trial diagrams, so prefix collisions are plausible.

**Why this matters.** The renderer promises to arrange exactly the supplied states. Here it loses which supplied state each element is, which is the "carry their full meaning" test in focus 3.

**Resolution.**
- Disambiguate states in all three forms, for example by key or a state mnemonic in the legend, whenever labels collide or truncation collides.
- Alternatively, reject duplicate labels at acceptance, with a repair message.

### R4-F5 — P3: A dialog exposure test depends on the checkout path length

**Location.** `test/contribution-dialog.test.ts:76`, together with `evidencePageCharacters = 55_000` (`src/lib/evidence-delivery.ts:42`) and `responseCharacters = 60_000` (`src/lib/contributions/dialog.ts:125`).

**What happens.** The test "a dialog consumes retained mechanical module information…" assumes that the retained export finding fits inline in the `exports` evidence response. The response limit leaves only about 5,000 characters above the evidence page bound. The evidence page is filled up to its character bound with records that contain absolute source paths, so the remaining headroom depends on the checkout path.

**Observed.** At the exact target, the enriched response was 61,941 characters against the 60,000 limit. The finding was correctly withheld and named by address in `retainedOmitted`. The test then fails with `TypeError: Cannot read properties of undefined (reading 'owner')`.

| Checkout path | Result |
| --- | --- |
| `/sessions/…/review` | Fails, repeatedly |
| `/tmp/r` | Fails |
| `/tmp/Users/ronen/postcode/app-worktrees/structured-architectural-accounts-impl` | Passes |
| The same path with ten extra characters | Passes |

The earlier rounds passed it because their checkout paths happened to fit.

**Impact.** Product behavior follows the design, since an omitted finding is disclosed and can be acquired separately. The test, however:

- breaks in CI, in other clones and on other machines;
- silently stops covering the inline-delivery path whenever it does pass for a different reason.

**Resolution.** Make inline delivery deterministic in the test, or assert on both branches. Separately, consider whether 5,000 characters of headroom makes inline delivery of a retained finding effectively unreachable for real modules.

### Assessment of the handoff's focus areas

1. **Identity and exposure attribution.** Wrappers record only provider evidence and Claim contexts as supplied input. Organizing policy is a separately attributed production. There is one native-keyed Entity per module.
   - Dialog acquisitions, initial context, option metadata and change notices are recorded at actual dispatch and rolled back when undelivered.
   - Answer selection, support capture and arrangement record no exposure.
   - The tests and a code reading both confirm this; I found no new defect here.
2. **Answer selection and reuse.**
   - Alternatives are assessed separately, with their history, fixed support and attributed qualification groups.
   - Exact presentation follows only the retained record, and `present` uses no ledger.
   - Reuse prefers an accepted attempt for reporting only.
   - Limit-stop and investigation-failure outcomes stay reusable, which matches the legacy evaluation.
   - The exception is R4-F1: the question identity for option invocation.
3. **Diagram fidelity.** Every node and edge is one supplied state or transition, and unknown entry, coverage, applicability and unsupported semantics reach the notes. The exceptions are R4-F4 and the omission in R4-F3.
4. **Instruction usability.** The shapes, reference translation and closed schema are consistent with each other. A malformed handle decodes to an invalid reference, and validation then rejects it. The exception is R4-F2.
5. **Warning breadth, supersede versus add, single repair, hosted configuration.** I agree with the earlier rounds' observations and found no new evidence that would change them. Live use still needs the hosted agent to be constructed in code; the checkpoint records this as planned for M3/M4.
6. **Dependency gaps.**
   - R4-F1 will recur for the M3 operations on selected content (`explain`, `examine`, `decompose`) unless question identity for delegated questions is settled now.
   - Two more points will matter when M3 migrates more families:
     - Each answer embeds its composed evidence records and repository records. Answer identity is a hash over the whole payload, and the answer is rebuilt on every request, including reused ones.
     - `entityModule` derives module records by slicing the native key string.
   - Neither of these two points is a defect at this checkpoint.

### Non-defect observations and limits

- The round 2 intent-check observation still stands: an accepted report with no designated answer appears only in attempt reporting. Recording explicit human acceptance of that treatment in the gate disposition remains appropriate.
- An option's `meaning` is not in the attempt report's `request`. The report gives the owner as its subject and `{}` as its parameters. This is minor, and it goes with R4-F1.
- No live inference, no rerun of the measurement, and no check of the architectural truth of the trial accounts were performed. I inspected the committed diagrams' text forms but did not render the SVGs visually.

Only this findings record is created and committed by this reviewer. Implementation, governing material, the task record, task status and the original handoff remain untouched.
