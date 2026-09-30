# Module investigation milestone 3: disposition

Record type: disposition
Date: 2026-09-30
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Handoff: [Milestone 3](2026-09-30-milestone-3-handoff.md)
Findings: [Round 1](2026-09-30-milestone-3-round-1-findings.md), reviewed target `986fddb6945eadf613ca28899003916fc689f8b7`
Status: corrections and authorized reassessment in progress; no gate acceptance

## Findings and dispositions

| Finding | Disposition | Basis and action |
| --- | --- | --- |
| F1: documentation never acquired; cause unestablished | Accepted; bounded adjustment/reassessment authorized in `31e8c18` | Human notes choose (a), preserve all three source/configuration/model pins and frozen references, and authorize one consistent improvement pass plus a conditional direct-exposure diagnostic. Existing membership, containment and group-documentation claims make the proposal feasible without a new tool or wider source boundary. Module inspection exposes qualified containing/ancestor context and README references with existing byte/item pagination; instructions describe assertion comparison without expected answers or exhaustive reading. Context delivery and actual exposure are regression-tested. Normal discovery and post-disclosure reconciliation will be reported separately; neither is declared established before the new runs. |
| F2: unfinished done-item status | Accepted; corrected in `57c2c84` | An explicitly non-completed done status invalidates the reconstructed output. Missing status remains supported as the reviewer proposes; completed terminal/identity checks remain required. Regression covers parseable evidence and submission arguments with absent/completed/incomplete/in-progress/null status; usage still survives rejected output. |
| F3: malformed non-submission call becomes submission | Accepted; corrected in `57c2c84` | Classify the function name before parsing. Only explicit `submit_investigram` yields a malformed submission; unknown functions and malformed evidence arguments use existing `ended` behavior. Both routes retain usage, with one request and no retry. |
| F4: expiry-time admission race | Accepted; corrected in `57c2c84` | A 60-second margin refreshes under the existing lock before returning a credential. Current official guidance explicitly calls for near-expiry refresh; no interpretation of the opaque earliest-refresh field is required. Tests cover the exact threshold, safely valid/expired tokens, persisted replacements and concurrent process renewal within the margin. This reduces the risk, not a guarantee against every network delay. No live request was needed to establish this boundary behavior. |

The F1 notes were assessed before implementation and preserved verbatim in the
active task, not treated as a scratch-file authority. The earlier pass remains
unchanged. A separately frozen pass will cover the three fixed subjects and
focused-entry; failure to deliver the focused README permits one labelled
normal-interface diagnostic, never an unreported retry or indefinite tuning.
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
  the new result will establish what the additional control actually exercised.
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
tests passed (5.57 seconds). New assessment results remain pending.

F4 sources checked on 2026-09-30: [accounts and sessions](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions#refreshing-tokens)
and [token reference](https://developers.openai.com/siwc/token-sharing-open-source/token-reference).
The first directs near-expiry renewal and serialized replacement; the second still
lists the earliest-refresh field without defining its representation. The chosen
60-second margin is an implementation safety margin, not a provider-mandated value.

## Review rounds and gate

Round 1 is preserved in `77b49e3`. No finding is rejected, and no uncertainty is
silently converted to a model limitation. The existing handoff remains the review
assignment; a new exact correction/reassessment target will be supplied for round 2.
Independent re-review and human milestone acceptance remain required. Milestone 4
has not begun; this task remains active.
