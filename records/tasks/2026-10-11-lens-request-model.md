# Implement explicit Lenses and qualified request resolution

Status: active
Opened: 2026-10-11
Closed:

## Task

Please implement the approved plan at `docs/plans/lens-request-model.md`. This is explicit authorization to begin the substantive implementation task described by that plan.

## Follow-ups

### 2026-10-11 — Review disposition and corrections

The review is complete.  Please assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### 2026-10-11 — F3 and F4 behavior

Context: The agent asked, “For F3, I recommend refusing usage requests that supply a selector, subject, or nonempty parameters, and retaining those rejected inputs in the resolution report. Should I use that behavior? Usage is defined as subjectless in the approved plan.” The human selected:

Refuse and preserve rejected inputs (recommended)

The subsequent human direction was:

For F4, also go with your recommendation.  Two details matter:

- Preserve the supplied Lens name as rejected input, without pretending it identifies a valid Lens.
- Non-cloneable values cannot necessarily be preserved verbatim in a report. Record the affected field and an intelligible reason, explicitly indicating any representation limit. Reporting must not fail while trying to serialize the rejected input.

Keep this handling narrow: an unexpected failure *after successful validation* remains an internal defect.

### 2026-10-11 — Investigate intermittent verification failure

Context: The agent asked whether to investigate the reviewer's earlier intermittent CLI JSON failure next, while keeping wider implementation paused. The human replied:

yes investigate it

### 2026-10-12 — Continue after intermediate review

Context: Following the investigation's conclusion and its recorded uncertainty about the historical failure, the human accepted continuing implementation:

That's fine, continue implementation

### 2026-10-12 — Subject-resolution review disposition and corrections

The review is complete.  As usual:  Please assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### 2026-10-12 — F1 allocation and F4 precise-reference choices

Yes, I agree with both recommendations.

**F1 — allocate only returned candidates on unsuccessful lookup.** That matches the adopted intent: a missing lookup shouldn’t allocate unrelated references, and an ambiguous lookup needs references for its returned candidates. Preserve allocations required by genuine prerequisite work, existing bindings, and successful-request allocation schedules. “Returned candidates” should mean the full candidate set supplied in the result, not merely those visible on a rendered page.

**F4 — retain and document raw same-Session record IDs.** They are a useful precise designation alongside compact references. Apply the same rules to both:

- Verify the actual retained record, its Session and supported subject kind.
- Check Lens applicability separately; a known incompatible subject remains “unsupported,” not “unknown.”
- Accept raw IDs through explicit reference designation, without reinterpreting literal names.
- Promise no persistence or cross-Session validity.

A raw ID and its compact reference should resolve to the same subject and, with otherwise identical effective inputs, the same qualified answer. Their supplied spellings can remain distinct in request reporting.

## Outcome

Intermediate checkpoint, 2026-10-11: implementation commit `a9c8189f042d5fe6cabf27db414b995a5972d0f6` establishes normalized request reporting, shared Lens-to-operation declarations, explicit View/usage/parameter-resolution execution alternatives, parent usage finalization and observation-envelope version 2. Usage no longer has a synthetic Projection/View descriptor. Module matching is shared without the dependency-selection inspection side effect. The local observation convention now specifies version-two batches; user-facing and descriptive documentation records the implemented subset and remaining gaps.

The task remains active and no milestone is declared complete. Qualified subject resolution and retention changes, answer identity, prerequisite/evidence attribution, runtime Presentation compatibility, operation/extension seams and demonstrations, and full-plan verification remain required. The [intermediate review handoff](../reviews/lens-request-model/2026-10-11-request-publication-handoff.md) enumerates that work. Implementation pauses for human-arranged review under the development workflow before expanding this shared boundary into the remaining family migrations. Final integrated review and human gate acceptance will still be required before closure.

Review corrections, 2026-10-11: all five actionable round-one findings were accepted and corrected in `4c9c3e0` and `709ea65d9ffe7f21e60306fa2d02ba9c0b74dd5f`. The [disposition](../reviews/lens-request-model/2026-10-11-request-publication-disposition.md) records each judgment, the human-directed F3/F4 behavior, and the exact corrected target. Dependency Lens vocabulary and designation validation now agree with the plan; usage refuses and preserves extra inputs; malformed input receives a safe caller refusal with explicit representation limits; unexpected post-validation failures remain defects; the usage schema's optional context is documented. The reviewer's intermittent CLI failure remains unexplained. Wider implementation remains paused pending human direction on that uncertainty and acceptance of the intermediate gate. The task remains active and the outstanding plan work above remains required.

Intermittent-failure investigation, 2026-10-11: authorized by the follow-up above and recorded in the disposition. The named test parsed stdout before checking the command's status, masking any pre-publication failure as a JSON syntax error. A controlled input change reproduced the exact error through a legitimate Session invalidation; this does not establish the historical cause. Commit `42038cb207eefe6c4993a27511cf1b5627f23159` adds exit-status/stderr assertions while preserving all output checks. Product behavior is unchanged. The original failure was not reproduced under stable inputs, and its cause remains unconfirmed. Wider implementation remains paused for the human's intermediate-gate decision.

Qualified subject-resolution checkpoint, 2026-10-12: following the human's acceptance of the earlier gate, implementation `6acd1e94c89e026b2fa32dc86fce24b9897d0d37` routes Session/worker/CLI requests through shared qualified resolution. Precise bindings are classified before applicability without allocation; failed lookup returns a self-contained report with candidates, criteria and qualified prerequisite outcomes. Known compatible subjects omitted from supplied mechanical populations retain qualified answers with explicit unavailable detail. Existing valid allocation schedules, source disclosure and legitimate embedded/associated results are preserved. Successful observations carry resolution information separately. Responsible construction/presentation methods were advanced, and documentation distinguishes the implemented request boundary from remaining work.

The [qualified subject-resolution handoff](../reviews/lens-request-model/2026-10-12-subject-resolution-handoff.md) establishes the next intermediate review gate under the development workflow. Implementation pauses for human-arranged independent review before the remaining migrations build on this cross-family boundary. No milestone is declared complete: the bounded attribution trace, direct operation context, legacy low-level selection migration, four-family answer identity, runtime compatibility, extension demonstrations and final integrated review remain required. The task remains active. The historical intermittent failure's cause remains unconfirmed; this checkpoint does not claim to repair it.

On 2026-10-12, F2 and F3 were corrected in `fd1ddfbe145407cadbaa6baa03fdc550b0d6efa8`: Unicode reports preserve each lookup population's established match outcome and unavailable/incomplete state, and investigram-only Lenses reject direct name designation before Evaluation. The [subject-resolution disposition](../reviews/lens-request-model/2026-10-12-subject-resolution-disposition.md) records every finding. F1's unsuccessful allocation schedule and F4's raw record-ID designation policy await explicit human choices; neither has been changed. Wider implementation remains paused and the task remains active pending those choices and acceptance of the intermediate gate.

## Verification

### Subject-resolution review corrections

`npm run check` and build passed. Of 59 targeted direct-request, subject-resolution and CLI tests, 58 initially passed; a new F2 assertion confused the concrete unavailable reason with its separate qualification. After correcting that assertion, the affected CLI test passed. The disposition preserves this distinction and the reviewer's residual coverage limits. `git diff --check` passed. No full-suite rerun is claimed for this correction, and no paid inference was used.

### Qualified subject-resolution checkpoint verification

On 2026-10-12, final `npm run check` passed and final `npm test` passed all 509 tests (about 171 seconds). The initial focused run passed 68 tests. New coverage checks binding-preserving unsupported refusals with no Evaluation/allocation, qualified missing/unknown/incomplete/unavailable resolution, candidate lifetime, narrower supplied populations, omission validation and external endpoint inspection/summary. Worker publication, usage/cancellation, source disclosure, reference allocation and the previously intermittent CLI test passed in the final suite. Earlier runs exposed legacy output assertions, fixture-specific unavailable-layout expectations, an embedded empty-detail preservation issue and a mistaken test change for the valid handle `missing`; these were corrected without weakening qualification. The review handoff records the evidence and limits. `git diff --check` passed. No paid inference was used; existing offline loopback tests ran with permission. No visible repository files were changed during test runs.

### Intermittent-failure investigation verification

An instrumented full offline suite passed all 503 tests. Eight concurrent repeats of the named test passed during that run, with no invalidation traced for its fixture. After rebuilding to remove the temporary instrumentation, `npm run check` and the isolated named test passed. A separate controlled fixture demonstrated exit 0/valid JSON without an input change and exit 2/empty stdout/Session-invalidated diagnostics after an input change; parsing the latter reproduced the exact reported exception. The disposition records evidence and limits. `git diff --check` passed; no paid inference was used.

### Review-correction verification

Final `npm run check` passed. Final `npm test` passed all 503 tests, including the reviewer's previously failing CLI test and new refusal/serialization regressions. Focused runs passed 26 and 35 tests; `git diff --check` passed. An earlier full run was contaminated by creating a repository file during input-sensitive tests; stable reruns passed. The disposition preserves that distinction and does not treat passing reruns as an explanation of the reviewer's intermittent failure. Existing offline loopback tests ran with permission; no paid inference was used.

### Intermediate-checkpoint verification

At the intermediate checkpoint, `npm run check` passed and `npm test` passed all 495 tests. Existing offline sign-in tests required local loopback permission: a sandbox bind probe returned `EPERM`, and the final full run passed with that permission. No paid inference was used. Focused coverage and the initial failures/corrections are recorded in the review handoff. `git diff --check` passed. These results verify the checkpoint, not completion of the approved plan.
