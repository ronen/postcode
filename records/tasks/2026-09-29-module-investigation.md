# Module investigation

Status: active
Opened: 2026-09-29
Closed:

## Task

Please implement the approved plan at docs/plans/module-investigation.md -- This is explicit authorization\
to begin the substantive implementation task described by that plan

## Follow-ups

### Review disposition direction

The review is complete.  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### Review resolution choices

The human answered the following questions (question text is retained as context):

> F1: I agree replacement associations are misattributed. May I make each correction explicitly identify the subjects whose accounts it corrects, while using correction.target solely for the corrected investigram and never inferring corrected subjects from the originating request?

Use explicit corrected subjects (Recommended)

> F2: How should unusual provider usage be handled without failing the investigation? I recommend retaining each distinct report with explicit anomalies, excluding unresolved figures from trusted totals.

Retain reports with anomalies (Recommended)

> F4 needs your ruling: should delivering a correction's reason or qualifications create a citation to its reporting investigram, since corrections are its accompanying content?

Cite the reporting investigram (Recommended)

> F7 and the unexplained execution-ownership test cancellations contain unresolved uncertainty. May I investigate them with bounded regression checks, preserving the current shared input-basis policy while testing README acquisition and comparing cancellation behavior against the pre-implementation baseline? I’ll report the evidence before proposing any policy change.

Investigate and report (Recommended)

### F7 acceptance and cancellation deferral — 2026-09-29

Re F7, I’ll accept your recommended disposition, with one clarification: this is a conservative shared acquisition basis, not an exact list of inputs used by the compiler. The behavior seems reasonable for this slice:

- Reading README registers it for session validity, as required.
- Advancing the shared revision makes incomplete mechanical work eligible for another attempt. That may be unnecessary work, but doesn’t misrepresent its outcome.
- Completed work remains reusable, and earlier records remain unchanged. The reported regression covers the important interaction. Including README in later input-basis records is acceptable provided that membership means “captured in the shared basis,” not “used to derive this mechanical claim.”



  Please record that distinction and the conservative retry behavior in the architecture account, then disposition F7 as accepted current behavior with regression coverage. Separating acquisition revisions by relevance could be a later optimization if unnecessary re-evaluation becomes significant; it needn’t expand this milestone.    ;;; Re deferring cancellation diagnosis: defer, deferral with:
  - A backlog entry containing the reproduction commands, baseline commit, affected tests, and captured results.
  - Milestone validation distinguishing the cancelled suite runs from the successful isolated runs.
  - Explicit disclosure in the review handoff, so the reviewer can assess whether the remaining uncertainty affects milestone acceptance.
  Please describe validation as qualified by this unresolved concern, rather than treating isolated passes as a fully passing suite.

### Round 2 review disposition direction — 2026-09-29

The next round of review is complete.  As usual:  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### Round 2 resolution choices — 2026-09-29

The human answered the following questions (question text is retained as context):

> R2-F1 requires an evidence-response contract change. May I return selected claims with their own qualification and evidence, summarize evaluation-level qualification by reference, and add bounded navigation through module/group/artifact listings? I’ll verify qualification preservation and usable relationship/documentation access at realistic scale, then prepare the correction for another independent review.

Implement scoped, navigable evidence (Recommended)

> For R2-F2, may I restrict correctedSubjects to module, symbol, group and repository-artifact records, rejecting claims, source-evidence and content captures? This keeps corrections associated with described subjects while evidence remains separately attributable.

Restrict to these subject kinds (Recommended)

### Round 3 review disposition direction — 2026-09-29

The next round of review is complete.  As usual:  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### Round 3 resolution choices — 2026-09-29

Context: the recommendations were lighter module listings retaining identity,
naming claim and qualification with source support available through inspectable
references, and separate summarized-evidence tracking in attempt reports and
accepted provenance. Summary citations retain their exposure form; references
alone remain uncitable.

Go ahead with both recommendations; of course with attendant regression coverage and architecture doc updates

### Milestone 1 acceptance — 2026-09-29

ok, Milestone 1 is accepted

### Milestone 2 implementation direction — 2026-09-29

Go ahead with milestone 2

### Milestone 2 round 1 review disposition direction — 2026-09-29

The review round is complete:  As usual:  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### Milestone 2 cancellation deferral ruling — 2026-09-29

> The reviewer asks for a renewed decision on the unresolved execution-ownership cancellations because milestone 2 extends those lifecycle paths. May I retain the qualified deferral for milestone 2 and record diagnosis as required before milestone 3’s live, cost-bearing adapter work? I’ll correct F1–F4 independently while you decide.

Defer through milestone 2; diagnose before live adapter (Recommended)

### Milestone 2 F1 closure-boundary usage approval — 2026-09-29

Regarding F1, I approve the focused correction and regression.&#x20;
Using the parent’s authoritative ledger to finalize CLI usage is consistent with the existing design. Finalization should use a snapshot taken at the dialogue’s closure boundary, so views and observations agree on which reports were accepted.
The regression should deliver usage specifically inside that closing window and verify consistent totals in the command view, subsequent `usage` view, and observation—without double-counting. Reports arriving after closure should retain the existing ignored/unknown treatment.

### Milestone 2 source-disclosure correction direction — 2026-09-29

the re-review has completed, as you will see it clears all the fixes but reports a previously-missed observation.  regarding that observation,  please fix source-disclosure observations within this task, including existing affected commands. The governing decision requires events to describe actual disclosure, so treat this as correcting pre-existing nonconformance.
Preserve `--source-detail` in the request record, but emit a source-escape event only when source detail was actually presented. Account for each command’s supported disclosure forms, including locations and excerpts; the option or an empty source-detail container is insufficient.
Add regression coverage for missing and unsupported references, empty disclosure, and successful disclosure in human and JSON output. Include the correction and verification in the milestone handoff. If this requires a substantially broader redesign, report that before expanding scope.

### Milestone 2 round 3 assessment direction — 2026-09-30

round 3 review has been completed, please read and assess as usual

### Milestone 2 round 3 observation rulings — 2026-09-30

> The reviewer leaves the maintenance safeguard to your choice. I recommend adding brief cross-references beside each renderer’s source-detail code, pointing to the classifier and its regression tests. This changes comments only.

Add renderer cross-references (Recommended)

> The reviewer did not assess paths exposed outside sourceDetail, such as configuration paths in JSON analysis context. I recommend recording this as an unassessed backlog follow-up, without claiming compliance or expanding this milestone. Would you prefer a bounded audit before milestone-2 acceptance?

Record unassessed follow-up (Recommended)

### Milestone 2 acceptance and continuation — 2026-09-30

ok, milestone 2 is accepted; wrap it up and continue on

### 2026-09-30 — ChatGPT sign-in and optional plan usage

Please extend milestone 3 to support **Sign in with ChatGPT with optional ChatGPT plan usage**, alongside the existing OpenAI API-key mechanism. This is an authorized addition to the current implementation task. Replace the pending API-key setup step with the workflow below.

Keep the current API-key option available. The user must explicitly select the authentication/billing route; never silently switch between subscription usage and API billing.

Use the current official documentation, verifying its requirements before implementation:

- [https://developers.openai.com/siwc/quickstart](https://developers.openai.com/siwc/quickstart)
- [https://developers.openai.com/siwc/token-sharing-open-source](https://developers.openai.com/siwc/token-sharing-open-source)
- [https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites](https://help.openai.com/en/articles/20001542-using-your-chatgpt-plan-in-other-apps-and-sites)

**Sign-in and credential lifecycle**

Provide an explicit CLI setup command that works without opening a project. It should initiate browser sign-in, receive the local callback, validate the authorization and granted plan-usage permission, and securely persist the resulting credentials and registration metadata. Exact command names and configuration are implementation choices. Provide credential-safe status and sign-out operations.

Authentication must persist across PostCode invocations so I can normally sign in once for the entire assessment. Renew credentials automatically as required, persist rotated credentials safely, and coordinate renewal across processes. Ordinary process exit must not sign out or revoke authorization.

Continue using protected credential storage, preferably macOS Keychain, and the established parent-process credential boundary. Keep credentials out of investigator context, worker messages, logs, observations, assessment artifacts, and agent-visible diagnostics. Do not reuse or inspect Codex’s own credentials. Preserve the documented limitation that same-user processes are not absolutely isolated by Keychain storage.

**Provider integration**

Implement the documented subscription-sharing Responses API contract, including its streaming and tool-format requirements. Do not assume this is merely an API-key replacement.

Preserve investigation semantics, explicit result submission and validation, cancellation, execution guards, usage attribution, and the existing inference-retry policy. Credential renewal is distinct from retrying an investigation. Streaming transport must not expose an unfinished investigram as an accepted result.

Verify availability of the intended `gpt-6-sol` model and medium reasoning configuration through the authorized account. Do not silently substitute a model; report any incompatibility requiring a choice.

**Usage and assessment reporting**

Identify the selected authentication/billing route in configuration provenance and appropriate user-facing reporting. Explain subscription allowance and optional purchased-credit use accurately, with links to the provider’s usage controls.

Continue recording provider-reported usage. Adapt assessment reporting to distinguish API charges from subscription-funded usage. Do not equate API list-price estimates with actual ChatGPT credit charges or treat unavailable monetary attribution as zero. If useful, report an API-equivalent estimate explicitly as a comparison only. Keep evaluator usage separately attributed even if it shares the same subscription allowance.

Do not purchase credits, enable automatic purchases, or change provider-side spending settings.

**Verification, documentation, and human setup**

Retain API-key regression coverage and add offline coverage for sign-in validation, persistence and renewal, concurrent renewal, revocation, streaming completion and failure, cancellation, usage, credential exclusion, and explicit route selection.

Update `docs/hosted-investigation.md`, the architecture account, and the affected approved-plan provisions to reflect this authorized addition. Follow the task protocol for recording this instruction and include the changes in the milestone review handoff.

When implementation and offline verification are ready, pause with the exact command I should run in my own terminal. I will complete browser sign-in and tell you when setup is ready, without sharing credentials. Then perform the appropriate connection check and continue the authorized assessments using the ChatGPT-plan route. If interactive reauthorization becomes necessary, record the interruption and pause for me.

If eligibility or protocol restrictions require materially broader changes, explain the specific issue before expanding scope.

### Human setup failure — 2026-09-30

I tried running the command in the terminal, I got this output:  &#x20;
```plaintext
Opening ChatGPT sign-in. Approve optional plan usage in the browser if desired. PostCode will not purchase credits or change spending settings.
PostCode ChatGPT registration storage is invalid; it was not overwritten.
```

Browser was not opened.  I tried twice and got the same result both times

### Browser handoff failure — 2026-09-30

Still not working, here's the output:  &#x20;
```plaintext
Opening ChatGPT sign-in. Approve optional plan usage in the browser if desired. PostCode will not purchase credits or change spending settings.
PostCode could not open the sign-in browser.
```

## Outcome

### Milestone 1 — domain execution checkpoint

Implemented at `d4260522c2abf0530de076c05944f531de003e4b` on
`codex/module-investigation`, against opening boundary
`c15afdd3b03f588534ac386c2453c81da71ffb68`. The task remains active, awaiting
the plan's human-arranged milestone-1 review and direction before milestone 2.

The evaluation-layer assessment found existing module, dependency and organization
evaluators already separate from projection construction and responsible for
their own reuse. Retain those evaluators and add a domain evidence-query boundary
over them; a wholesale evaluator rewrite would add risk without a needed change
in responsibility. Extend the existing provider with subject-based content
acquisition through its captured-input host, rather than introduce another
filesystem policy. This preserves the existing mechanical command path.

The domain interpretation boundary now coordinates fresh bounded dialogues,
qualified evidence/context requests, explicit submission, whole-result acceptance,
correction eligibility, immutable composition/replacements, provenance and
attempt usage. The agent communication boundary is exercised through a reusable
scripted double. Returned accepted units are not yet retained as session
interpretation outcomes; that is milestone 2. No CLI or externally meaningful
product capability changed, so the existing user reference and project status
remain applicable.

No dependency was added. The concrete hosted route, provider/model verification
and credential disclosure belong to milestone 3 and have not been selected or
exercised. No credentials were read and no repository content was transmitted to
an inference provider by PostCode. The implementation uses the plan's allowed
single explicit submission protocol without repair/truncation recovery; its
bounds and cancellation limits are documented in the
[architecture account](../../docs/architecture/investigation.md). The implementation
conventions now identify the reusable double and independent usage ownership.

The remaining milestones, live formative assessments, milestone reviews and final
integrated review remain required. This checkpoint does not conclude the task or
establish human acceptance of a review gate.

## Verification

### Milestone 1 review follow-up

The human-arranged [round-1 review](../reviews/module-investigation/2026-09-29-milestone-1-round-1-findings.md)
was assessed under the recorded follow-up direction. The
[disposition](../reviews/module-investigation/2026-09-29-milestone-1-disposition.md)
addresses every finding and preserves the non-defect observations and residual
uncertainties. F3, F5 and F6 were accepted and corrected in
`1de634a29e0ba07a42091d0718f286462f77e3f4`. F1 and F2 are accepted issues with
resolution choices awaiting human direction; F4 and F7 require the requested
ruling/investigation direction. The reviewer-reported test cancellations remain
unresolved and have not been dismissed. Milestone 2 has not begun.

The correction passed type checking, build, all 31 investigation tests and
`git diff --check`. No full-suite rerun or live inference was performed for these
corrections. The milestone gate remains unaccepted pending human direction.

### Approved review rulings and bounded investigation

The recorded human rulings were implemented in `f5a974d` and `32f90a5`:
corrections identify explicit corrected subjects, usage preserves distinct
reports with anomalies, and delivered correction content cites its reporter.
All F1–F6 findings are corrected. The F7 regression establishes the shared-basis
retry consequence without changing policy; acceptance of that behavior was
requested and remains pending.

The bounded comparison reproduced all 13 execution-ownership cancellations on
the pre-implementation baseline and the corrected full suite. Both isolated
runs passed 13 tests. Baseline full results were 283 passed, zero failed,
13 cancelled; corrected full results were 318 passed, zero failed, 13 cancelled.
The pattern is pre-existing; its cause remains unresolved. Human direction on
explicitly deferring diagnosis versus keeping it open was requested and remains
pending. No cancellation code or test was changed.

Type checking, build, all 34 investigation tests, and the README regression
passed. The final usage-report equality refinement passed both focused usage
tests after the full-suite run started. The
[correction validation](../validation/module-investigation/2026-09-29-milestone-1-review-corrections.md)
preserves the exact verification scope and limits. The updated disposition
records every finding; the original review remains unchanged. Milestone 2 has
not begun, and the human has not accepted the milestone-1 gate.

### F7 acceptance and qualified diagnosis deferral

The human accepted F7 with regression coverage and clarified that membership in
the conservative shared acquisition basis does not establish compiler use or
claim derivation. The architecture account now records that distinction and the
conservative eligibility for retry of incomplete work, with completed work and
earlier records preserved. Acquisition revisions by relevance remain a possible
later optimization, outside this milestone.

The human also deferred cancellation diagnosis subject to durable evidence and
explicit qualification. The backlog now contains the reproduction commands,
pre-implementation baseline, affected tests and captured results. The correction
validation distinguishes the cancelled full-suite runs from successful isolated
runs and explicitly remains qualified by the unresolved concern. A dated,
human-requested addendum to the original handoff discloses that evidence for the
reviewer's assessment of milestone acceptance. The original handoff text and
review findings remain unchanged. F1–F7 now have resolved dispositions, with
cancellation diagnosis deferred rather than explained or dismissed.

These documentation changes were checked with `git diff --check` and local link
target validation. No runtime code changed and no tests were rerun for this
follow-up. Earlier test results retain their stated qualifications. The task
remains active at milestone 1 pending the human's gate decision; milestone 2 has
not begun.

### Round 2 corrections ready for independent review

The human-approved R2-F1 and R2-F2 contracts are implemented in
`212fa9e82f58d41f3de6829ad84285e40305930b`. Evidence responses retain selected
claims and their own qualified support, summarize evaluation/repository-wide
qualification separately, and expose bounded stable continuation pages. Group
navigation reaches members, artifacts and documentation. Extensive own source
support can be separately inspected without making a subject disappear from the
population or treating bare references as supplied evidence. Corrected subjects
are restricted to modules, symbols, groups and repository artifacts.

The [disposition](../reviews/module-investigation/2026-09-29-milestone-1-disposition.md)
addresses both round-2 findings, all round-1 status confirmations, the process
observation and residual limits. The original findings and handoff remain
unchanged for this round. A further independent review of the changed evidence
contract is required under that handoff; the human arranges it. Milestone 2 has
not begun and this checkpoint does not accept the milestone gate.

Final type checking passed. `npm test` passed 339 tests with zero failures,
cancellations or skips. The [round-2 validation](../validation/module-investigation/2026-09-29-milestone-1-round-2-corrections.md)
records fixture regressions, provenance checks, the real-repository sweep and
reproduction commands. All 258 modules and 79 groups were navigable; all
relationship/export queries for 93 project modules stayed within collection
bounds with no omitted entries or unavailable responses, and group navigation
reached 595 artifacts including root README content. Explicit source-support
references remain distinct from embedded evidence. Whitespace and local link
checks passed.

The latest successful full run does not diagnose the intermittent
execution-ownership cancellations. The human-authorized backlog deferral and
qualified validation remain in force, with the previously cancelled suites and
successful isolated runs kept distinct. No cancellation code, runtime dependency,
CLI capability, governing material or development-process file changed. No
credentials or live inference were used.

### Original milestone 1 verification

Milestone 1: `npm run check` passed; `npm test` passed 323 tests. Subsequent
targeted checks covered the final local corrections: 62 investigation/store/input/
output-boundary tests, then 37 investigation/expansion tests and another type
check. `git diff --check` passed. The full suite preceded the final local
corrections; targeted final checks passed on the committed implementation.

The [validation record](../validation/module-investigation/2026-09-29-milestone-1.md)
records coverage, chronology, reproduction and limits. These are implementing-agent
checks, not independent review or evidence of live interpretive usefulness.

### Round 3 corrections complete

The human-approved R3-F1 and R3-F2 recommendations are implemented in
`aef0878b17e1d31ec079edecd63a8ada469f56f8`. Module listings retain naming claims
and full own qualification while delivering source support by inspectable
reference. Attempt reports and accepted provenance distinguish summaries from
fully supplied records, preserve both exposure forms when both were delivered,
and reject citations to uninspected references or withheld summaries. The
architecture and investigator instructions describe these semantics; the
investigation method advanced to version 5.

Type checking and build passed. All 342 tests passed with zero failures,
cancellations or skips; the final focused evidence suite passed all 10 tests.
The new 263-module regression completes a guarded inventory dialogue. On the
real repository, all 258 modules fit 21 pages; listing, one source inspection and
submission complete in 23 exchanges and 1,141,713 serialized units under the
unchanged limits. The complete collection sweep omitted no entries and returned
no unavailable collection responses. The
[round-3 validation](../validation/module-investigation/2026-09-29-milestone-1-round-3-corrections.md)
preserves reproduction, exact results, the corrected initial test assumption
and limits. Whitespace and local documentation links were checked.

Every finding has a disposition. The reviewer considers the third round
sufficient once its low-severity findings are corrected or dispositioned, without
a mandatory further independent round. Both are now corrected. The original
handoff and authored findings remain unchanged. Validation remains qualified by
the unresolved, explicitly deferred execution-ownership cancellation concern;
this passing run does not diagnose it. No hosted/live validation or milestone-2
implementation was undertaken. The task remains active at milestone 1 awaiting
the human's gate decision.

### Milestone 2 — shell and session integration checkpoint

Implemented in `a396f9b8e9b38ad344554cbe4c0e7677ded1ec0e`, against the accepted
milestone-1 boundary `bca53ba66b1440039de805e1d74e2ef9a10a552b`. The
[milestone-2 handoff](../reviews/module-investigation/2026-09-29-milestone-2-handoff.md)
and [validation record](../validation/module-investigation/2026-09-29-milestone-2.md)
are committed for human-arranged independent review.

The evaluation-layer organization now includes a dedicated investigation evaluator.
It owns operation-based reuse and atomic publication of accepted interpretation
and accompanying corrections into the existing program record store. Mechanical
evaluators remain responsible for their own reuse and acquisition; projections
consume retained outcomes without invoking investigation. This separation avoids
putting inference or retention decisions into rendering, while a session-owned
evidence-access instance preserves continuation lifetime.

The production shell and one-shot paths support summary selection, retained
outcomes, exact investigram inspection, source traceability and attempt/session
usage. A private operation-tagged worker bridge reaches the injected investigator
communication participant in the parent while compiler/evidence/retention work
remains in the worker. Parent-owned usage and exposure snapshots survive active
worker termination. Earlier retained accounts supply context to subsequent
operations; correction targets and replacements remain independently inspectable.
Original composition is unchanged, with replacement selection and reconsideration
display still reserved for milestone 5.

No provider dependency, hosted setup, credential mechanism or public test flag was
added. Regular CLI summary requests report configuration unavailability; tests
inject the scripted participant through the same worker/session path. Public
follow-up lenses and broader associated-account discovery remain later work.
Architecture, CLI reference, README and project status describe this checkpoint.
No governing foundation, development-process instruction or accepted decision was
modified.

Final type checking and build passed. The latest complete suite passed 360 tests
with no failures or cancellations (approximately 113.0 seconds). A final small
reporting refinement linked non-retained failures to their exact attempt and
labeled unknown aggregates in human final reporting; the final target then passed
all 18 integration tests (approximately 9.22 seconds) and all 13 isolated
execution-ownership tests (approximately 3.33 seconds), plus type checking,
whitespace and local documentation-link checks.

An intermediate complete run reproduced the deferred concern: 346 passed, zero
failed and 13 execution-ownership cancellations out of 359 tests, with the same
pending-promise/event-loop error. The validation, backlog and new handoff preserve
that result separately from the later full and isolated passes. Validation remains
qualified by the unresolved concern; no cancellation diagnosis or baseline rerun
was undertaken. Scripted tests establish integration behavior, not live provider
behavior or interpretive usefulness.

The overall task remains active at the milestone-2 review gate. The human arranges
independent review and determines acceptance before milestone 3. No milestone-3
implementation or live assessment has begun.

### Milestone 2 round 1 review corrections and pending F1 choice

The [round-1 disposition](../reviews/module-investigation/2026-09-29-milestone-2-disposition.md)
assesses every finding and retains the non-defect observations and residual limits.
`df2bdb07b8b0b3c7149a11e36a9bfbbd44c8b4e0` corrects F2–F4: unsupported
investigram/lens selection, per-attempt abnormal human usage reporting, and explicit
corrected-subject/evidence attribution. It also corrects F1's demonstrated
post-reply usage loss by retaining worker usage callbacks until dialogue close.
Architecture and CLI documentation reflect those changes. The original handoff
and reviewer-authored findings remain unchanged.

F1 remains open because code inspection identified a remaining closing-window
race between the worker's final snapshot and parent dialogue close. Human direction
was requested on using the authoritative parent usage snapshot to finalize CLI
views, with a regression for that window. That additional change has not been made.

Type checking, build and all 23 focused integration tests passed. The stationary
full-suite run passed all 365 tests with zero failures/cancellations, about 112.56
seconds. An earlier run, during which review records were added, passed 363 and
failed two repository-backed session checks with input invalidation; it had zero
cancellations. The [correction validation](../validation/module-investigation/2026-09-29-milestone-2-round-1-corrections.md)
preserves both results and the concurrent-edit explanation as an inference.
Whitespace and local documentation link checks passed.

The human renewed the execution-ownership cancellation deferral through milestone
2 and requires diagnosis before milestone 3's live, cost-bearing adapter work.
The backlog and disposition record that prerequisite. Validation remains qualified;
the passing complete run does not diagnose the earlier cancellations. No live
adapter, credentials, inference or cancellation-policy change was introduced.
The task remains active at the milestone-2 gate, awaiting the F1 ruling and human
acceptance; milestone 3 has not begun.

### Milestone 2 F1 completion — closure-boundary usage

The human-approved F1 completion is implemented in
`849267193a6d75113d2deb33c8a1b481f916fa4e`. Parent dialogue closure seals immutable
call reports before abort/close callbacks. CLI views are finalized from those
snapshots, and subsequent usage views and observations use the same accepted
reports. Duplicate reports count once; reports after closure remain ignored,
including first reports for unknown calls. View identity includes finalized usage
separately from interpretation projection identity; retained accounts and prior
views remain unchanged. Architecture and CLI documentation describe the boundary.

Two deterministic regressions drive the real shell and compiler worker in human
and JSON formats. Intercepting the actual close-message delivery places usage
inside the closing window and confirms the worker snapshot missed it. The command
view, subsequent usage view and observations agree on three calls, one unknown,
zero anomalies and 40 synthetic input tokens, with no duplicate counting. Reports
first delivered after closure stay unknown. Type checking and build passed; all
25 integration tests passed (14.59 seconds), followed by all 367 full-suite tests
with no failures, cancellations or skips (130.80 seconds) on a stationary worktree.
Whitespace and local documentation links passed.

The [disposition](../reviews/module-investigation/2026-09-29-milestone-2-disposition.md)
now records all four findings as corrected and the
[validation](../validation/module-investigation/2026-09-29-milestone-2-round-1-corrections.md)
preserves the exact target, regression method and results. The original review and
handoff remain unchanged. Validation remains qualified by the historical,
unresolved execution-ownership cancellations; diagnosis is required before
milestone 3's live, cost-bearing adapter work. The task remains active awaiting
human milestone-2 acceptance. No milestone-3 work or live inference has begun.

### Milestone 2 round 2 and actual source-disclosure correction

The [round-2 review](../reviews/module-investigation/2026-09-29-milestone-2-round-2-findings.md)
independently clears F1–F4 at `849267193a6d75113d2deb33c8a1b481f916fa4e` and
recommends milestone acceptance with the standing cancellation qualification.
Its previously missed observation about source-escape events is addressed under
the human's explicit direction to correct pre-existing nonconformance in this task.

`b408c414b041f032a8954ca450c9cbe30dded139` corrects the shared observation boundary
for module, organization, dependency and investigram views. Request records retain
the explicit option; only actually presented locations or nonempty excerpts cause
a source-escape event. Events preserve their family and record actual disclosure
forms. Empty containers, source IDs, omission counts and claim metadata alone do
not imply disclosure. Classification follows each format: organization JSON's
repository-root path and dependency JSON's embedded organization-support source
records count when serialized, even when the human renderer omits them. Source
rendering, acquisition and interpretation semantics remain unchanged. This required
no broader redesign, dependency, public command or governing-document change.

Type checking and build passed. All 45 focused disclosure/investigation/
organization/dependency tests passed (48.56 seconds), and all 369 tests passed on a
stationary worktree with zero failures, cancellations or skips (130.37 seconds).
New human/JSON shell regressions cover missing and unsupported references, source-
free retained accounts, empty/metadata-only containers, location-only and excerpt
disclosure, and format differences, checking request intent and recorded output.
Whitespace and changed-document local links passed.

The [disposition](../reviews/module-investigation/2026-09-29-milestone-2-disposition.md)
records both rounds and the observation correction. The human-requested dated
[handoff addendum](../reviews/module-investigation/2026-09-29-milestone-2-handoff.md)
and [validation](../validation/module-investigation/2026-09-29-milestone-2-source-disclosure.md)
identify the exact correction target and evidence while preserving the original
handoff and reviewer-authored findings. Validation remains qualified by historical
unresolved execution-ownership cancellations; diagnosis is required before live,
cost-bearing adapter work. The task remains active at the milestone-2 gate pending
human acceptance. No milestone-3 implementation or live inference occurred.

### Milestone 2 round 3 assessment and observation rulings — 2026-09-30

The [round-3 review](../reviews/module-investigation/2026-09-29-milestone-2-round-3-findings.md)
independently clears the source-disclosure correction at
`b408c414b041f032a8954ca450c9cbe30dded139`, with no new findings. The reviewer
passed type checking, all 369 tests with zero failures/cancellations/skips (133.4
seconds), and negative/positive disclosure probes in both formats. The reviewer
recommends milestone acceptance with the existing cancellation qualification;
the implementing agent agrees that no defect in the reviewed target remains open.

All observations are dispositioned. Under the human's recorded rulings,
`9370fef` adds comments beside source-detail rendering in each of the four view
families, pointing to the classifier and regression tests, including JSON field
changes. It also records paths outside sourceDetail as an explicitly unassessed
[backlog follow-up](../../docs/backlog.md#assess-disclosure-classification-for-paths-outside-sourcedetail).
Neither compliance nor nonconformance is inferred, and no broader audit or redesign
was undertaken. The reviewer's correction of round-2 wording and the authorized
handoff-addendum traceability observation are acknowledged in the
[disposition](../reviews/module-investigation/2026-09-29-milestone-2-disposition.md).

Verification confirmed source edits contain comments only, whitespace is clean,
and documentation links and source/test cross-references resolve. No runtime tests
were rerun for these comments and records; the independent 369-test result covers
the unchanged implementation. Findings and handoff remain unchanged.

The cancellation concern remains unexplained and qualifies validation. Diagnosis
is required before milestone-3 live, cost-bearing adapter work. The task remains
active at the milestone-2 gate pending explicit human acceptance; no milestone-3
implementation has begun.

### Milestone 2 accepted; milestone 3 started — 2026-09-30

The human accepted milestone 2 and authorized continuing. Acceptance is recorded
in `6f16401`; the overall task remains active. `6677ccc` diagnoses and corrects
the deferred execution-ownership test-harness race, with a controlled reproduction
of the cancellation signature, confirmed production timeout/exit settlement,
15 passing isolated tests and all 371 passing suite tests. The
[diagnosis record](../validation/module-investigation/2026-09-30-execution-ownership-diagnosis.md)
retains historical qualifications and inference limits. Production cancellation
policy is unchanged.

Under the plan's delegated integration selection, milestone 3 will use OpenAI's
Responses API at its fixed HTTPS API endpoint with `gpt-6-sol`, medium reasoning,
standard service, and no automatic retries or fallback. Official model guidance
verified on 2026-09-30 supports this exact model/effort combination. The official
`openai` JavaScript/TypeScript SDK 7.25.0 (Apache-2.0; Node >=22) is selected for
maintained request/response types, abortable transport and provider error types;
its default retries and logging will be disabled explicitly. No general agent
framework or provider registry is needed.

The initial credential mechanism is macOS Keychain, retrieved privately by
PostCode using the system `security` executable. A human creates the item in
Keychain Access, outside this conversation. Intentional PostCode-specific
enablement remains separate from credential existence. Unsupported platforms or
failed access produce configuration unavailability without an environment-key
fallback. The concrete setup handoff will disclose repository transmission,
separate API charges, provider spending controls, revocation/rotation and the
lack of enforced isolation from same-user agents. No credential retrieval or live
inference has occurred. The plan requires a pause for human setup before live use.

Sources: [model](https://developers.openai.com/api/docs/models/gpt-6-sol),
[SDK](https://developers.openai.com/api/docs/libraries),
[spend controls](https://developers.openai.com/api/docs/guides/spend-limits).

### Milestone 3 offline adapter and credential handoff — 2026-09-30

`54d8a1b` implements the selected OpenAI Responses adapter and macOS Keychain
preflight, intentional PostCode enablement and transmission disclosure, safe
failure translation, actual returned model/service-tier usage attribution and
partitioned totals. The SDK is pinned at 7.25.0; requests use the selected model,
medium reasoning, standard service, `store: false`, no retries/fallback and a
16,000-token output bound. Function access remains subject-based and whole-result
acceptance remains in the existing domain boundary. Presentation identity is now
`postcode/investigation-presentation@4`. Architecture, help, CLI reference and
project status describe the implemented capability and its pending live verification.

The [offline validation record](../validation/module-investigation/2026-09-30-milestone-3-offline-adapter.md)
records the 11 adapter tests, real worker/CLI coverage in both formats, synthetic
credential exclusion, provider failure taxonomy, cancellation and usage cases.
Type checking and all 382 suite tests passed with zero failures, cancellations or
skips (128.10 seconds). The earlier ownership diagnosis remains separately
traceable, including the limits of historical attribution. No test result is
claimed to establish live provider behavior.

The [credential setup handoff](../../docs/hosted-investigation.md) is ready. Under
the approved plan, work pauses for the human to configure access before any live
inference. No real credential has been read or written and no live inference has
run. The task remains active; milestone 3 is not complete. After setup, live usage
verification, committed assessment tooling, pinned/frozen references, clean
summary evaluators, source-informed assessment, baseline/focused cases and the
milestone-3 independent review remain. Freeze source references before any live
run on the assessment subjects or fixtures. Milestone 4 remains gated.

### Milestone 3 ChatGPT sign-in addition and replacement handoff — 2026-09-30

The human's authorized addition, preserved before implementation in `1de7477`,
is implemented in `b0a0ca9`. The prior API-key-only setup handoff is superseded by
project-independent browser Sign in with ChatGPT. API-key billing remains an
explicit alternative; neither route silently falls back to the other. The
[accepted route decision](../../docs/decisions/hosted-authentication-and-billing.md),
approved-plan provisions, architecture, hosted setup, CLI reference and current
status now reflect this authorized addition.

PostCode validates loopback authorization, identity and granted plan scopes,
persists registrations and credentials in its own Keychain item, serializes
refresh rotation across processes, and provides safe status, selection and
sign-out. Ordinary exit retains sign-in. Subscription inference uses streaming,
namespaced functions and the required request restrictions; completed submissions
still pass through existing domain validation. Route provenance, usage reporting
and development assessment reporting distinguish API billing from ChatGPT-funded
usage and leave unknown monetary/credit attribution unknown. Evaluator and assessor
usage remain separate even when sharing the allowance.

The dependency choices isolate provider transport (`openai` 7.25.0), OIDC signature
validation (`jose` 6.2.12), in-process protected credential storage
(`@napi-rs/keyring` 2.1.0), and kernel refresh coordination (`fs-ext` 2.1.1).
A kernel lock avoids concurrent rotation after a suspended process loses a timed
lease. Native dependencies are optional for installation; unavailable support
fails hosted setup without plaintext fallback. Purpose, license, integration
rationale and current protocol sources are retained in the
[offline validation record](../validation/module-investigation/2026-09-30-milestone-3-chatgpt-offline.md).

Type checking passed. The full suite passed **407 tests, zero failures,
cancellations or skips**, in 127.11 seconds with repository inputs unchanged.
Coverage includes actual local OAuth callbacks with generated identities,
cross-process rotation, lock-owner death, permission decline, refresh and
revocation failures, streaming completion/failure, cancellation, both output
formats, credential exclusion, explicit route selection and assessment monetary
unknowns. The first sandboxed loopback attempt was permission-restricted; the
permitted offline run passed. No real Keychain item or Codex credential was read
or changed, and no live inference or spending-settings operation occurred.

Work now pauses for the human to run `npm run postcode -- auth chatgpt sign-in`
from `/Users/ronen/postcode/app` in their own terminal and report readiness without
credentials. Afterward run the explicit account/model/medium connection check,
retain its usage, and continue the authorized ChatGPT-route assessment. Live
eligibility/protocol compatibility and native Keychain/browser interaction remain
unverified. Interactive reauthorization requires a human pause. The current docs
name `earliest_refresh_at` without defining its representation; the implementation
retains it opaquely and renews at expiry rather than guessing an earlier schedule.

The task remains active and milestone 3 remains incomplete. Frozen references,
remaining assessment tooling, clean evaluators and source-informed assessors,
live baseline/focused cases and the independent milestone review are still due.
The final milestone handoff must carry the addition, offline verification, actual
connection result and attribution limits. Milestone 4 remains behind acceptance.

### First-sign-in native storage correction — 2026-09-30

The human-reported failure was recorded in `cba73b0`. An isolated nonexistent
native Keychain item demonstrated that the installed binding returns null despite
its async declaration advertising undefined. The prior boundary passed null to
registration decoding, causing the reported pre-browser invalid-storage error.
No actual PostCode or Codex credential was inspected or modified. The previous
offline fixture modeled undefined absence and therefore missed this native gap.

`6941c59` normalizes both absence sentinels at the native boundary while preserving
rejection of invalid/empty stored values and credential-safe native read failures.
Three regressions exercise that boundary and first sign-in/persistence. Type
checking and build passed; the 39-test focused authentication, transport, shared
CLI and assessment run passed with zero failures, cancellations or skips. An
isolated native absence read through the corrected manager also passed. The
[correction record](../validation/module-investigation/2026-09-30-keychain-first-sign-in-correction.md)
retains reproduction, the coverage gap, verification and remaining live limits.
Architecture and setup documentation were updated. The full suite was not rerun
for this localized correction; its earlier passing result remains historical.

The corrected build is ready for the human to retry the same terminal sign-in
command. Browser authorization, real protected storage and account/model access
still require human setup; the task remains active at that pause. Carry the
reported failure and correction into the eventual milestone review handoff.

### Native browser handoff correction — 2026-09-30

The second setup failure was preserved in `32779df`. The original native launcher
reproduced an AppleScript `location` selector failure with a harmless loopback
URL. Its Foundation import lacked `use scripting additions`, so `open location`
was not resolved correctly. The previous native check exercised stdin reading
only; offline OAuth tests replaced browser opening. Those checks missed the
actual native launch defect.

`2de9684` adds the required import and isolates the native handoff for reuse by
OAuth and a committed opt-in diagnostic. Authorization URLs remain on stdin,
with no credential-bearing process arguments. The diagnostic opens a harmless
local page and requires both launcher success and the browser's HTTP request.
It passed against the corrected production launcher on this host. No credentials,
Keychain items, OAuth or inference services were used in this check.

Type checking/build and 39 relevant authentication, transport, shared CLI and
assessment regressions passed with zero failures, cancellations or skips (4.91
seconds). The full suite was not rerun for this localized correction. The
[validation record](../validation/module-investigation/2026-09-30-browser-handoff-correction.md)
preserves cause, coverage gap, native check and remaining live limits. The setup
guide and architecture account were updated. The build is ready for the human
to retry sign-in; actual authorization and account/model verification remain
pending. Carry this failure and correction into the milestone review handoff.
