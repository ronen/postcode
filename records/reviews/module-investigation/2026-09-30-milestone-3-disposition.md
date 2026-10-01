# Module investigation milestone 3: disposition

Record type: disposition
Date: 2026-09-30
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Handoff: [Milestone 3](2026-09-30-milestone-3-handoff.md)
Findings: [Round 1](2026-09-30-milestone-3-round-1-findings.md), reviewed target `986fddb6945eadf613ca28899003916fc689f8b7`
Status: F2–F4 corrected; bounded F1 reassessment completed with new submission failures; human disposition pending, no gate acceptance

## Findings and dispositions

| Finding | Disposition | Basis and action |
| --- | --- | --- |
| F1: documentation never acquired; cause unestablished | Accepted; bounded adjustment/reassessment authorized in `31e8c18` | Human notes choose (a), preserve all three source/configuration/model pins and frozen references, and authorize one consistent improvement pass plus a conditional direct-exposure diagnostic. Existing membership, containment and group-documentation claims make the proposal feasible without a new tool or wider source boundary. Module inspection exposes qualified containing/ancestor context and README references with existing byte/item pagination; instructions describe assertion comparison without expected answers or exhaustive reading. Context delivery and actual exposure are regression-tested. Pass 02 delivered README content in the focused run and two upstream runs, but all four submissions failed validation. Discovery is exercised; accepted reconciliation remains unestablished. The new contract/reference failures require human disposition; see the reassessment section below. |
| F2: unfinished done-item status | Accepted; corrected in `57c2c84` | An explicitly non-completed done status invalidates the reconstructed output. Missing status remains supported as the reviewer proposes; completed terminal/identity checks remain required. Regression covers parseable evidence and submission arguments with absent/completed/incomplete/in-progress/null status; usage still survives rejected output. |
| F3: malformed non-submission call becomes submission | Accepted; corrected in `57c2c84` | Classify the function name before parsing. Only explicit `submit_investigram` yields a malformed submission; unknown functions and malformed evidence arguments use existing `ended` behavior. Both routes retain usage, with one request and no retry. |
| F4: expiry-time admission race | Accepted; corrected in `57c2c84` | A 60-second margin refreshes under the existing lock before returning a credential. Current official guidance explicitly calls for near-expiry refresh; no interpretation of the opaque earliest-refresh field is required. Tests cover the exact threshold, safely valid/expired tokens, persisted replacements and concurrent process renewal within the margin. This reduces the risk, not a guarantee against every network delay. No live request was needed to establish this boundary behavior. |

The F1 notes were assessed before implementation and preserved verbatim in the
active task, not treated as a scratch-file authority. The earlier pass remains
unchanged. A separately frozen pass covered the three fixed subjects and focused-entry.
The focused README was delivered, so the conditional direct-exposure diagnostic
was inapplicable and did not run. No unreported retry or further tuning occurred.
The human also approved a separate one-call control, retaining the original
zero-call control. No model substitution or subject modification is authorized.

## Non-defect observations

- **OAuth/credential boundary:** accepted as the review's bounded no-defect finding,
  not proof of every live provider behavior. Added disclosure that a locally
  retained refresh token can have become unusable remotely after interrupted
  rotation or failed persistence; current retry/reauthorization policy is unchanged.
- **ID-token hint:** accepted; setup disclosure now states that the account-identifying
  hint may persist in browser history, while PostCode excludes its URL from process
  arguments and diagnostics. No new credential disclosure path was introduced.
- **Sign-out lock:** accepted as described. Remote revocation can hold the lock
  long enough for another token request to report `credential_busy`; tokens are
  already locally removed. Record the distinction without asserting a new defect
  or changing lock/revocation policy.
- **Route selection/disclosure and usage:** accepted as reviewed, with the existing
  limits. No billing or fallback change; unknown monetary attribution remains unknown.
- **192-call ceiling:** accepted as non-misrepresentation. New ledgers use the
  neutral `ceiling` field; legacy `authorized` ledgers remain readable and their
  historical files are unchanged. Ambiguous ledgers with both keys are rejected.
- **Hard-limit control:** accepted limitation; the human approved an additional
  one-call control in `31e8c18`. Original zero-call evidence remains preserved;
  the additional run made one provider call (1,777 reported tokens), processed its evidence requests and stopped before a second exchange. Undelivered results correctly remain outside exposure. This is a mid-dialogue stop, not a stop after the investigator has read source; no extra control was added.
- **Other retained limitations:** accepted and retained. Context-isolation wording,
  exceptional/ownership omissions, dense IDs/repeated usage and name/state confusion
  remain assessment evidence, not silently waived or attributed solely to the model.
  The generic milestone/correction footer is removed as the suggested focused
  presentation cleanup; actual account/correction content remains available.
- **Assessment independence:** accepted. Fresh role contexts do not establish
  independent corroboration; same family, common orchestration, implementer-prepared
  references and unknown role configuration/usage remain explicit.
- **Unverified areas:** all reviewer limits remain recorded: no new real Keychain,
  provider/browser/revocation exercise by the reviewer; no independent source-pin,
  override or harness rerun; no exhaustive factual/runtime audit; credential boundary
  and historical cancellation checked only to the stated depth. The new assessment
  does not retroactively broaden the review's coverage.

## Corrections and verification

`57c2c84` contains F2–F4 and the two credential-disclosure clarifications. Type check
passed. The focused adapter/authentication run passed 45 tests, zero failures or
cancellations (4.43 seconds) with required loopback permission. The initial sandboxed
attempt passed 42 and failed three callback tests because loopback was unavailable;
that attempt is distinct from the permitted successful run, not suppressed evidence.

The discovery and ledger tests passed 14 tests (8.62 seconds), including scoped
metadata, pagination, separately requested content and exact exposure accounting.
The complete suite at `79a33bb` passed 424 tests, zero failures/cancellations/skips
(146.90 seconds), with repository inputs stationary and local loopback permission.
A subsequent adjacent F2 check also rejects an explicit unfinished status on a
function call in nonempty terminal output on either route; its 25 focused adapter
tests passed (5.57 seconds). The separately frozen reassessment is complete;
final integrated offline verification failed at `4a0a334`: **410 passed, 9 failed,
5 cancelled**, 4,251,441.929 ms reported duration. Tracked inputs stayed unchanged.
Timeouts and input-validation failures remain unexplained. The [validation record](../../validation/module-investigation/2026-10-01-milestone-3-round-1-validation.md)
preserves the command, complete output and affected tests. This target does not
have a fully passing suite; historical/isolated passes do not clear the uncertainty.

F4 sources checked on 2026-09-30: [accounts and sessions](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions#refreshing-tokens)
and [token reference](https://developers.openai.com/siwc/token-sharing-open-source/token-reference).
The first directs near-expiry renewal and serialized replacement; the second still
lists the earliest-refresh field without defining its representation. The chosen
60-second margin is an implementation safety margin, not a provider-mandated value.

## Bounded reassessment and new findings — 2026-10-01

The [pass-02 report](../../validation/module-investigation/pass-02/report.md) retains
all five runs, exact frozen configuration and context, observations, sanitized
exchanges, role inputs/outputs and accounting. All source pins and the approved
merge-anything override remained unchanged. GPT-5.6 Sol / medium / ChatGPT-plan
remained fixed. There were 16 requests and 547,736 provider-reported tokens, with
no missing/anomalous reports; actual money and allowance/credit attribution remain
unknown. Diagnostic allowance remains 2 used / 8 remaining.

- **F1 discovery:** the focused case, fsm-engine and merge-anything actually received
  README content. Cockatiel did not. This is observed acquisition, not a guarantee
  that all relevant documentation will be found.
- **F1 reconciliation and submission contract:** the focused draft attributes and
  contrasts the README claim, but uses a repository artifact and module as
  structured inconsistency targets. The validator correctly requires earlier
  investigrams and rejects the whole draft. The frozen instructions/schema omit
  this target restriction; an instruction-contract gap is a plausible contributor.
  No accepted user-facing reconciliation resulted. F1 is neither closed nor
  silently deferred. Further bounded clarification and reassessment require human
  direction under the one-improvement authorization.
- **Reference reliability:** all three upstream drafts fail exact-reference
  validation. Each has a supplied identity reproduced with two characters omitted;
  bounded diagnoses preserve additional unmatched spellings without claiming an
  exhaustive validation replay. No approximate matching, repair or retry was added.
  The repeated pattern warrants a bounded offline investigation before choosing
  a representation change; it is not classified solely as a model limitation.
- **User-facing assessment:** fresh evaluators/assessors received the actual failure
  or guard views, not rejected drafts substituted for accepted results. They cannot
  establish functional comprehension from absent accounts. Captured draft analysis
  is separately qualified in the report. Shared-family/orchestration limits remain.
- **Control:** the human-approved one-call case stops after tool processing and
  before delivery of those results, unlike the historical zero-call stop. It does
  not show a stop after source has been read by the investigator. This limit is
  disclosed for human assessment, not represented as broader coverage. The new
  evaluator also repeats the historical opaque-name/state misunderstanding; the
  source-informed assessor identifies it, so that presentation concern remains.

The proposed next step is a bounded clarification of the existing submission
contract plus offline diagnosis of reference-copying failures, with any
consequential reference representation change returned for approval before another
live pass. It is a proposal only. The authorized reassessment is preserved even
though no normal case produced an accepted account. The preceding accepted pass
remains historical evidence, not proof that the new context caused these failures.

## Authorized offline follow-up — 2026-10-01

The human authorized contract clarification and bounded offline diagnosis in
`f315bb8`. The [diagnosis and proposed remedy](../../validation/module-investigation/2026-10-01-offline-diagnosis.md)
retain reproduction scripts, reference audits, offline parser replays and monitored
suite evidence. No new provider request or credential access occurred.

The existing inconsistency-target restriction is now explicit in operation
instructions and both provider tool schemas, including nested accounts. Five
new deterministic cases preserve attributed documentation/source discrepancies
in prose, reject program-subject inconsistency targets and reject mistyped
references without repair/retry. The focused 65-test run passed. This corrects
the instruction gap but does not establish live reconciliation or close F1.

The exact-input audit narrows the preliminary reference diagnoses: only one unique
misspelling per upstream submission is absent from all supplied references.
Other IDs previously absent from the delivered-record index were supplied as bare
references. The three misspellings each omit two characters from a long canonical
ID. Eight stub adapter replays preserve the drafts exactly, supporting their
origin in received model output rather than transport mutation. A private short,
exact model-facing binding scheme is proposed, with all domain/exposure validation
preserved; implementation and another live pass require human approval.

The prior failed suite overlaps 21 macOS sleep/wake events. Before product edits,
the unchanged suite passed all 424 tests under temporary idle-sleep prevention,
with no failures/cancellations, in 140.781 seconds; a timing monitor recorded no
gap above two seconds. This supports a suspension-related explanation but does
not prove every old failure's cause. The failed run remains preserved. No timeout,
input-validation or ownership rule was changed. Final integrated verification of
the contract clarification remains pending.

## Review rounds and gate

Round 1 is preserved in `77b49e3`. No finding is rejected, and no uncertainty is
silently converted to a model limitation. The authorized offline diagnosis and controlled rerun are recorded above; human
direction remains pending on the consequential reference remedy and further live
assessment. No timeout or validation rule was weakened. The existing handoff remains the review
assignment; a new exact correction/reassessment target will be supplied for round 2.
Independent re-review and human milestone acceptance remain required. Milestone 4
has not begun; this task remains active.
