# Module investigation: milestone 3 hosted execution and formative summaries review findings, round 1

Record type: findings
Received: 2026-09-30
Reviewer: Claude Opus 5.5 (Claude Code session arranged by the human; not the implementing agent)
Handoff: [2026-09-30-milestone-3-handoff.md](2026-09-30-milestone-3-handoff.md)
Round: 1
Reviewed target: `986fddb6945eadf613ca28899003916fc689f8b7`

## Returned findings

### Scope and method

I reviewed the implementation range
`6f164016c0291ec94cbdf8febb382ebca64d7af5..986fddb6945eadf613ca28899003916fc689f8b7`
on `codex/module-investigation`. The two commits after the target (`766c0c0`,
`6d128ce`) change only the task record and the handoff. I read the handoff as
the assignment, not as evidence.

The human asked for the handoff at `2026-09-29-milestone-3-handoff.md`. That file
does not exist. The only milestone-3 handoff is
`2026-09-30-milestone-3-handoff.md`, so I followed that one.

I read these files in full:

- `src/lib/investigation/openai/` (`oauth.ts`, `chatgpt-credentials.ts`,
  `credential-store.ts`, `adapter.ts`, `stream-output.ts`, `protocol.ts`,
  `configuration.ts`, `auth-command.ts`, `browser.ts`);
- the range's changes to `cli.ts`, `commands.ts`, `contracts.ts`, `usage.ts`,
  `reporting.ts` and `presentation.ts`;
- the reply handling in `execute.ts`;
- the assessment harness README, `request-budget.mjs` and both ledgers.

I read these sections of the governing documents:

- the plan's success criteria and milestone-3 section;
- the plan's focused-case and assessment-target sections;
- the architecture section on the hosted transport and credential boundary;
- the task-record follow-ups on the model choice, the diagnostic allowance and
  assessment accounting.

For the assessment pass, I read:

- `report.md` and `references.md`;
- the frozen investigator instructions;
- the focused-entry spec, exchanges, summary view and assessor output;
- the hard-limit spec and view.

I also scanned the tool requests captured in all five cases that reached inference.

I did not use real Keychain items, inspect Codex credentials, sign in or out,
change provider settings or send any provider request.

### Checks performed

- **Full suite.** I ran `npm ci` and `npm test` in a detached scratch worktree at
  the exact target, on Node 22.13.1. Result: **419 tests, 419 passed, 0 failed,
  0 cancelled, 0 skipped**, 159.05 s by the test runner (170.2 s wall-clock).
  Loopback callback tests ran. `git status --porcelain` was empty both before and
  after the run.
- **Ledger and totals.** I recomputed the totals from `request-budget.json` and
  from each case's `exchanges.jsonl`. Both give **21 requests and 666,727 reported
  tokens**, and the per-case counts match `report.md`: 5, 4, 5, 4, 3 and 0
  requests. All 21 ledger entries are `response-received`. `diagnostic-budget.json`
  shows 2 of 10 diagnostic requests used.
- **Evidence kinds requested.** I tallied the evidence kinds that the investigator
  requested in all five inference cases (see finding 1).
- **Documentation reachability.** I ran an offline `organization repository` view
  with the built target CLI on a git-initialized copy of
  `fixtures/module-investigation-assessment`. No investigator was configured. The
  single repository group is shown as `documented`.
- **Adapter probes.** I ran two probes against the built target modules
  (`CompletedStreamOutput` and `openAIInvestigator`, using a stub `fetch`). See
  findings 2 and 3.

### Actionable findings

#### 1. The conflicting-documentation case is unassessed, and no case in the pass acquired documentation (significant; gate-relevant; needs a human decision)

The plan assigns four focused cases to milestone 3; conflicting documentation is
one of them. The plan's assessment target says such a case "preserves the
attributed assertion and exposes the discrepancy". The report is candid that the
focused-entry run never acquired the README. The fresh assessor also records this
as a `material-omission`.

The gap is wider than one fixture. In **none** of the five inference cases did
the investigator request `organization`, `group` or `membership` evidence. All
requests were `inspect`, `exports`, `dependencies`, `dependents` and `source`:

| Case | Evidence kinds requested |
| --- | --- |
| Cockatiel | inspect 5, exports 2, dependencies 1, dependents 1, source 5 |
| fsm-engine | inspect 5, exports 1, dependencies 2, dependents 1, source 3 |
| merge-anything | inspect 11, exports 3, dependencies 2, dependents 1, source 4 |
| focused-entry | inspect 3, exports 1, dependencies 1, dependents 1, source 6 |
| focused-opaque | inspect 1, exports 1, dependencies 1, dependents 1, source 1 |

No delivered response contains README content. The only uses of "documentation"
in the captures are:

- the instruction sentence ("Organization lists groups; query group ... for ...
  documentation");
- the qualification of an evaluation with requirement `documentation`.

As a result, the whole pass has no case in which documentation reached the
investigator. That includes the real-repository README claims that the frozen
references discuss: Cockatiel's policy descriptions and merge-anything's
"always-new-object" wording.

The offline organization view shows that the README is reachable: the fixture's
group is marked `documented`. So this is not broken delivery. It is still a
two-hop path that the model has to find on its own. The initial request carries
only the module reference. Nothing in the returned inspect/source records points
to the containing group or to its documentation. The instructions mention the
path only in passing.

The plan's success criteria say that shortfalls should be investigated enough to
separate implementation defects from investigator limitations, and that they
list "incorrect operation instructions, or broken context delivery" as possible
defects. On this evidence I cannot classify the gap. It could be the model's
acquisition choice. It could also be that the context and instructions make
documentation too hard to discover. The uniform result across five subjects
makes the second explanation plausible enough that it should not be recorded
simply as a model limitation.

What is needed from the human:

- **Choose a disposition.** Either:
  - (a) authorize a bounded adjustment and a rerun; or
  - (b) explicitly defer, or accept as unassessed, the conflicting-documentation
    case at this gate.

  The handoff rightly does not infer that a prompt fix is authorized. Examples of
  a bounded adjustment are an instruction change, or surfacing the containing
  group and its documentation reference in the initial or inspect context.
- **Extra live evidence under (a).** At least one focused-entry run in which the
  README is actually delivered, so that reconciliation can be assessed. The plan
  also asks for reassessment across all three subjects after an improvement
  effort. The human should decide whether that applies here.
- **Under (b).** The disposition should state that documentation handling is
  unexercised for all subjects, not just the fixture.

#### 2. Completed stream items are accepted without checking the item's own status (minor; correctness)

`CompletedStreamOutput.observe`/`complete` (`src/lib/investigation/openai/stream-output.ts`)
checks that `type`, `id`, `call_id`, `name` and `namespace` are consistent between
the `added` and `done` events. It does not check the `status` of the done item.

A probe fed a sequence with the same response ID and one added/done pair. The done
item had `status: "incomplete"` and `arguments: "{\"partial\":"`. `complete()`
returned that item. Under a `response.completed` terminal with empty output, the
adapter would then treat it as the model's output.

Consequences:

- With truncated but still-parseable `request_evidence` arguments, the adapter
  would execute tool requests taken from an unfinished item.
- With `submit_investigram`, the item goes to domain validation.
- Domain validation limits the harm. Even so, this weakens the handoff's claim
  that "unfinished output is never accepted". A done item with a non-completed
  status contradicts the completed terminal. By the adapter's own rule, that
  should be an inconsistent sequence.

Suggested fix: require `status === 'completed'` on done items when a status is
present, or reject any non-completed status. Add a regression next to the existing
completed-items test.

#### 3. Malformed JSON arguments on any function call become a `submit` of `null` (minor; classification)

In `adapter.ts`, `JSON.parse(call.arguments)` runs **before** the adapter checks
the function name. Any parse failure returns `{ kind: 'submit', result: null }`.
A probe confirmed this for a `request_evidence` call with arguments `{bad`. By
reading the code, an unsupported function name with malformed arguments does the
same.

`execute.ts` then sends `null` through `acceptInvestigation`. The retained
investigation-failure therefore reports an invalid *submission*, although the
model never called `submit_investigram`. The outcome is still a failure, not an
acceptance. However, it misattributes the cause in retained records and
assessment captures, and it conflicts with the explicit-submission principle.

The existing test covers the case only for `submit_investigram`. Suggested fix:
check the function name first, then parse. Treat non-submission parse failures
as `ended`, or as a distinct protocol failure.

#### 4. The access token is used up to its exact expiry time (minor; reliability)

`chatGPTCredentials().session().token()` renews only when `now() >= expiresAt`.
A token that expires in the few milliseconds or seconds before the provider
admits the request is still sent. The likely result is a 401, which is classified
as `configuration-unavailable`. Because there are no inference retries, the
investigation is lost.

The code comment explains why it does not interpret `earliest_refresh_at`. That
reasoning does not rule out a small fixed safety margin. This case is rare, and no
captured run shows it.

Suggested fix: renew within a small margin, such as 60 s, before `expiresAt`, or
document the accepted risk.

### Non-defect observations

- **OAuth and credential boundary.** I found no defect in the following:
  - state and single-callback handling;
  - PKCE;
  - pinned discovery metadata;
  - ID-token signature, issuer, audience, nonce and saved-subject checks;
  - scope-based plan permission;
  - persisting the client mapping before the token exchange;
  - pending-generation supersession;
  - kernel-lock renewal;
  - the sign-out generation marker and watcher abort;
  - bounded revocation retries.

  Offline tests cover these, including tests with separate processes. The
  residual risks are inherent to rotating refresh tokens and are not specific to
  this code. They arise when a refresh succeeds at the provider but the caller
  aborts, or when the Keychain write then fails. The next refresh would then fail
  as reused or invalid and require interactive sign-in. The documentation's
  "temporary failures retain them" is accurate for local state. It may be worth
  adding a sentence noting that the retained token can still be unusable remotely.
- **ID-token hint.** On returning sign-in, the ID-token hint is kept out of process
  arguments, as documented. It is still part of the authorization URL, so it will
  appear in browser history. It is not an API bearer credential, but it identifies
  the user. Consider mentioning this in the setup disclosure.
- **Sign-out lock.** Sign-out holds the credential lock during remote revocation,
  which can take up to about 31 s. Another process's `token()` waiting on the lock
  can hit its 30 s deadline and get `credential_busy`. Because the tokens have
  already been removed, the practical outcome for inference is the same.
- **Route selection and disclosure.** Route selection is explicit, there is no
  fallback, and the disclosure is printed before any project is opened. As
  documented, enabling hosted investigation also makes credential preflight
  apply to mechanical commands.
- **Usage reporting.** Usage is reported before the outcome is classified. It is
  grouped by reported execution model and service tier, and it says clearly that
  monetary attribution is unavailable, not zero. I found no overclaim in the
  presentation or reporting changes.
- **192-call ceiling.** The ledger stores the ceiling under the key `authorized`.
  Its `scope` text and the harness README both call it a theoretical ceiling
  (6 × 32), not a target or a new grant. The task-record clarification puts
  planned runs under the existing plan authorization, and 21 requests were used.
  I see no misrepresentation. A neutral key name such as `ceiling` would remove
  the ambiguity.
- **Hard-limit control.** The control stops on a 1-character guard before any
  provider call. It shows the guard and the accounting of zero provider calls
  correctly. It is a weak contrast with the opaque case's voluntary three-call
  stop, because no acquisition takes place before the stop. The human should
  decide whether this satisfies "contrasted with a hard-limit stop" or whether a
  mid-dialogue stop is wanted, such as a calls or tool-calls guard that trips
  after some evidence.
- **Other retained limitations.** The report retains these limitations without
  waiving them, and I agree they are recorded appropriately:
  - the fsm-engine "separate context" overstatement;
  - the ownership and aliasing gaps in merge-anything and Cockatiel;
  - the dense identifiers, repeated usage and generic correction footer;
  - the hard-limit evaluator's "opaque" name/state confusion.

  The generic footer ("This checkpoint shows immutable originals and explicit
  correction links…") appears even in the zero-call limit-stop view, where it has
  no referent. It is a small presentation clean-up candidate.
- **Independence of the assessment agents.** The evaluators and assessors are of
  one model family, share orchestration, and use references prepared by the
  implementing agent. They agree with each other, but that does not show factual
  correctness. The report says so.

### Unverified areas and residual limits

- No live provider behavior, real Keychain, browser sign-in or remote revocation
  was exercised. All conclusions about those rely on captured evidence and offline
  tests.
- I did not re-clone the upstream subjects to check the source pins, the
  merge-anything override or the post-run configuration checks independently. I
  also did not rerun the assessment harness.
- I did not independently check the factual accuracy of the Cockatiel, fsm-engine
  and merge-anything summaries against upstream source beyond the report, the
  references and the retained assessor outputs. No upstream runtime tests were run.
- I did not verify worker-boundary credential exclusion beyond reading the code
  and seeing the existing sentinel tests pass.
- I did not probe the historical cancellation diagnosis (`6677ccc`) beyond the
  passing suite.

### Gate recommendation

**Not yet adequate for unqualified milestone-3 acceptance. Adequate for a
qualified acceptance if the human explicitly decides finding 1.**

The hosted implementation, offline verification and usage accounting are sound.
Findings 2–4 are minor, bounded corrections that do not invalidate the captured
evidence. None of the 21 captured exchanges shows item-status inconsistency or a
malformed-argument path.

One of the plan's four milestone-3 focused cases, conflicting documentation, was
not exercised. No case in the pass delivered documentation at all. Whether that
reflects the model or the operation instructions and context design has not been
established.

Before accepting, the human should choose one of these options:

- (a) authorize a bounded adjustment, correct findings 2–3 (and optionally 4),
  and rerun at least the focused-entry case, followed by another review round; or
- (b) record an explicit deferral of the conflicting-documentation case and of
  documentation acquisition generally, and correct findings 2–3 as ordinary
  in-scope fixes.

The human should also say whether the pre-inference hard-limit control is a
sufficient contrast.
