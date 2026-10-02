# Module investigation final integrated review: findings

Record type: findings
Received: 2026-10-02
Reviewer: Claude Opus 5.5 (`claude-opus-5-5`) in a fresh Claude Code session, arranged by the human; repository-writing reviewer
Handoff: [2026-10-02-integrated-handoff.md](2026-10-02-integrated-handoff.md)
Round: 1
Reviewed target: `f4328296cc8fff1f4d7fd820a4ca98ede6ce1f5c` (diff range `c15afdd3b03f588534ac386c2453c81da71ffb68..f4328296cc8fff1f4d7fd820a4ca98ede6ce1f5c`, checked out at handoff commit `492ed00`, whose only difference from the target is the handoff record)

## Returned findings

### Summary

I found no correctness defect in the domain, revision, context-exposure, transport,
worker-bridge or credential code that I read, and the full offline suite and all
eleven audits reproduced cleanly. The pinned-source accounts I checked are mostly
correct and in places find real, non-obvious behavior in the upstream code. Two
things still stand between this slice and closure. The plan's completion rule needs
an explicit human decision about the incomplete merge-anything integrated sequence
(F1). Two user-facing descriptive documents are also stale (F2). F3 is a latent
asymmetry in what an unresolved inconsistency may target, for implementer and human
disposition.

**Recommendation:** do not close the task yet. Resolve F1 by an explicit human
deferral decision (or authorized work), correct F2, and disposition F3. I do not
think another full integrated review round is needed if the F2/F3 changes are
limited to documentation, or to a small acceptance rule with focused regression
coverage. A focused re-check of those changes would be enough.

### Scope and method

- Read the handoff, `dev/review.md`, the findings template, the plan's success
  criteria, scope, formative protocol and failure/recovery rules, and the task
  record's follow-ups from milestone 4 onward together with the milestone-5 outcome,
  correction and acceptance sections.
- Read the integrated assessment report and the pass-05 report, plus the pass-05
  review addendum. I skimmed the backlog, STATUS, CLI reference, hosted setup guide
  and the relevant sections of `docs/architecture/investigation.md`.
- Read the cumulative source in full for `src/lib/investigation/{contracts,acceptance,evaluation,execute,context,revisions,associations,presentation,usage}.ts`,
  `openai/{adapter,references,configuration,credential-store,chatgpt-credentials}.ts`,
  `evidence-access.ts`, `evidence-delivery.ts` and `source-disclosure.ts`. I read the
  cumulative diffs of `session.ts`, `interactive-session.ts`, `session-worker.ts`,
  `session-protocol.ts`, `cli.ts`, `commands.ts`, `command-execution.ts`,
  `typescript/project.ts` (content acquisition) and the mechanical presentation
  modules. I checked symlink resolution in `repository/capture.ts` for artifact
  acquisition and skimmed `oauth.ts` for PKCE, state, nonce and loopback handling.
- Checked pinned upstream source against selected consequential claims in the pass-05
  views for all three subjects. I used the local checkouts under
  `_investigation/module-assessment-sources/`. All three HEADs match the pins.
  merge-anything has only the approved untracked `tsconfig.postcode-assessment.json`.
- Ran one offline acceptance probe in the scratchpad against the built `_build`
  output (F3). Nothing was written to the repository.

### Verification performed

- **Full suite.** `npm test` at the clean checkout passed **468 tests: 468 pass, 0 fail,
  0 cancelled, 0 skipped**. The suite took 167.161 s (`duration_ms`), and 2:57.29
  wall-clock including the build (11:54:20Z–11:57:17Z). Environment: macOS Darwin
  25.6.0, Node v22.13.1, with local loopback listeners permitted (no `EPERM`). The
  repository was stationary during the run. I did not run a sleep/scheduling monitor
  or idle-sleep prevention, so I cannot independently confirm the absence of
  scheduling gaps beyond the clean result.
- **Audits.** All eleven handoff audit commands exited 0 under Python 3.14.7. These
  were `pass-03/audit-results`, `pass-04/audit-{results,navigation}`,
  `pass-05/audit-{results,lifecycle,artifacts}`,
  `pass-06/audit-{results,lifecycle,dependent-evidence,artifacts}` and
  `integrated/aggregate-usage`. Afterward `git status --short` was empty, so every
  regenerated output is byte-identical with no untracked files. The aggregate
  reproduces **203 provider requests / 5,110,325 known reported tokens, 3 missing,
  0 anomalous, 15 empty synthetic excluded**. The pass-06 dependent audit reports 3
  accepted dependent corrections.
- **No live inference or credentials.** No credential, Keychain, sign-in, provider or
  live-inference operation was performed.

### Actionable findings

#### F1 — Medium (completion gate): the incomplete merge-anything integrated sequence still needs an explicit human deferral decision

In pass 05, merge-anything decomposition failed with a second `server_is_overloaded`
after the single recovery allowance had been spent on the summary. The planned
examination then used the explanation as its subject. The pass-05 report, the
integrated report and the handoff all correctly call this an incomplete four-lens
sequence.

The plan's success criteria say "A blocked required case remains incomplete unless
the human explicitly approves its deferral". The recovery section adds that after
exhausted recovery the agent should "stop and request human instructions … Do not …
silently waive required validation". The plan also requires each subject to run the
"completed integrated sequence".

I found no recorded human decision on this case. The task record's milestone-5
acceptance ("ok, milestone 5 is accepted, wrap it. up then prepare the integrated
review") does not address it. Neither milestone-5 disposition nor the round-2
findings mention a deferral. The implementer correctly declined to relabel it. The
gate therefore still requires the human to do one of two things:

- (a) explicitly approve deferral, with the limitation preserved in the account and
  completion record; or
- (b) authorize a bounded completion step, such as one fresh-session merge-anything
  decomposition and examination under the frozen pass-05 configuration.

This is not an implementation defect. The other required cases appear complete: the
pass-05 refined dependent-correction rejection was superseded for evidence purposes
by the separately authorized pass-06 sequence, and the fsm-engine overload was
recovered within its allowance. I did not find another blocked required case.

#### F2 — Low–Medium (documentation): README and the architecture overview still describe the milestone-3 state

The plan requires user documentation to be complete. Its deliverables name "the
architecture overview, README, status …" as describing the implemented boundaries.
STATUS, the CLI reference, hosted setup and `docs/architecture/investigation.md` are
current. Two documents are not.

- **`README.md`.**
  - The only investigation text is the `### Interpretation integration checkpoint`
    block, last changed in milestone 3 (`b0a0ca9`). It was appended below `## License`,
    so it is nested under the license heading.
  - It says only "`summarize <module>` and `usage` now have session and one-shot
    execution paths" and "Live verification is pending."
  - It omits `explain`/`decompose`/`examine`, correction-aware redisplay, revision
    paging and associated-account inspection.
  - The "Development CLI" introduction and its example command list still describe
    only the mechanical views.
- **`docs/architecture/README.md:24–30`.** It says "An optional hosted summary adapter
  now has explicit enablement and macOS Keychain preflight; live verification is
  pending. Public follow-up lenses and correction-aware display remain later milestones
  of the module-investigation plan." All of those statements are now false. The
  overview does not mention the ChatGPT-plan route.

**Fix:** update both documents to describe the delivered four-lens, correction-aware
behavior and the two explicit billing routes, and link the existing CLI reference
and STATUS limits. Move the README block into the CLI section rather than under
License.

The CLI reference section is accurate in substance. Its heading, "Interpretation
checkpoint: summary, inspection and usage", is also stale relative to its content.
Renaming it would require updating the STATUS and README anchors.

#### F3 — Low (acceptance asymmetry; latent): an unresolved inconsistency may target an investigram whose content was never delivered, with no evidence

`acceptance.ts` validates inconsistency targets only by
`reference(id, 'subject')` plus `exposure.history.get(id)`. That check requires an
earlier investigram in this session, not delivered context. `support()` allows
`evidence: []`.

By contrast, a correction target must be in `completeTargets`. The integration test
"association discovery alone cannot authorize correcting an undelivered account"
enforces this for corrections. An investigator that has only seen a bare handle could therefore
assert a structured inconsistency against content it never received. This can happen
through an `investigations` listing, `children`, revision rows or `revisionNotices`,
which the transport issues as handles.

That assertion then appears on the target's revision status and on every redisplay
("Unresolved inconsistency reported by @R …"). The reporter's citation index records
nothing about the target.

An offline probe against the built acceptance and context modules accepted a unit
whose only inconsistency targeted an undelivered investigram with empty evidence.
The result had `citations: []`.

The one live structured inconsistency (pass-05 conflict case, `investigram-0db46c6c`)
is not affected: I checked its retained provenance, and all three targets were both
cited and complete. So this is latent, not an observed defect.

The governing decision says PostCode "validates structure and references; semantic
inconsistency remains an interpretive judgment", so the current behavior may be
intended. If so, the CLI/architecture documents should say that an inconsistency's
targets need not have been supplied to the reporter. Otherwise, require at least
substantive delivery (citation) of each target, consistent with the
reference-availability-is-not-exposure principle used elsewhere, and add a
regression. This choice is the implementer's to propose and the human's to decide.

### Non-defect observations (verified)

- **Revision semantics.** `InvestigationRevisions` matches the plan and decision:
  - `primary()` takes the most recently ranked correction over all outgoing-reachable
    links, so A→B, A→C, B→D yields D.
  - Conflict is family-wide.
  - Cause propagation is a per-correction BFS over citers. The reporting evaluation
    and evaluations holding complete context for that correction are exempt; the
    exemption is per cause and whole-evaluation.
  - Composition does not propagate warnings.
  - Exact inspection uses originals, and redisplay uses `primary` with displaced
    subtrees disclosed, including the `9d189d9` ordering fix.
- **Retention.** Retention is atomic: there is a synchronous `store.put` after the
  final abort check. Reuse is by canonical request identity, and communication and
  configuration failures are not retained.
- **Exposure accounting.** Exposure is recorded only when responses are actually sent
  with the next exchange, so an acquired but undelivered response is not exposure.
  Correction content makes its reporter citable without completing the reporter's own
  parts, and excerpts never complete prose. The context character bound covers
  substantive content only, as `investigation.md` documents. Provenance metadata in
  automatic accounts is governed only by the dialogue guard, which is documented.
- **Transport.** The streaming adapter accepts output only after a terminal
  `response.completed` that is consistent with its status. `error`, `failed` and
  `incomplete` streams never publish. The structural handle map covers all typed fields
  I traced, unknown handles decode to an invalid spelling that validation rejects, and
  prose and source are not walked.
- **Credentials.** Credentials stay in the parent. The worker receives only identity
  and replies, and usage is recorded in the parent ledger and sealed at dialogue
  close.
- **Artifact acquisition.** Repository-artifact acquisition follows only links already
  resolved inside the captured worktree. A post-capture swap is caught by the
  input-validity check that runs after every tool call and before delivery.
- **Rotated tokens.** A refresh token rotated and then lost to a failed Keychain write
  forces re-sign-in. This is a known, documented consequence
  (`docs/hosted-investigation.md:170–172`), not a new finding.
- **Mechanical command regressions.** Every mechanical `inspect`, including one-shot
  `inspect`, now appends an "Associated investigrams" block and gains an
  `investigation-presentation` method and a derived view identity. In one-shot use
  this block is always empty. This is documented and tested. It adds noise to
  existing views, which is relevant to the existing UI/UX backlog entry.
- **Large source files.** Source files whose serialized capture exceeds 60,000 UTF-16
  units cannot be delivered at all, because there is no range retrieval. This is
  documented (`investigation.md:124–135`) and did not affect the three subjects. It
  will matter for real modules larger than about 55 KB.

### Source-grounded quality and usefulness judgments

Checked against the pinned upstream revisions:

- **merge-anything (`bc7c79f`), pass-05 summary.** The summary is supported by
  `src/merge.ts`, `extensions.ts` and `typeUtils`:
  - Only plain objects recurse, and other values replace.
  - Own string and symbol keys are copied, enumerability is preserved, and
    `__proto__` is skipped.
  - Reference sharing occurs when there is no overlap.
  - `concatArrays` concatenates only when both values are arrays.
  - `Merge` uses `Assign` and `PrettyPrint`, falling back to `Pop`, and `PrettyPrint`
    has a `Seen` guard.

  One small type-level edge is not mentioned: `merge(x)` with no further arguments is
  typed `Pop<[]> = never` while returning `x`. I did not independently verify the
  examination's callback-triggering or access-ordering claims.
- **Cockatiel (`80b5ed6`), `src/common/Executor.ts`.**
  - The summary's classification and timing account is correct.
  - The examination's central finding (`@investigram-a3ed2fe4`) is correct and
    useful: `resultFilter`, success timing and synchronous success listeners lie
    inside the `try`, so their exceptions reach `errorFilter`.
  - Its child `@investigram-860ecfdf` overstates. It says a listener exception "can be
    classified only for success-event emission inside the try". But the handled-result
    `failureEmitter.emit({ … handled: true, reason: { value } })` is also inside the
    `try`, so a throwing failure listener on that path is caught and classified. This
    matches the already-recorded Cockatiel overstatement. I confirm it independently
    from source.
  - The delegation account's BulkheadPolicy claim is correct and non-obvious:
    `src/BulkheadPolicy.ts:77` calls `fn` directly, so the exposed
    `onSuccess`/`onFailure` from its private wrapper never fire.
  - It omits `TimeoutPolicy`, which also invokes through an `ExecuteWrapper`
    (`src/TimeoutPolicy.ts:99`).
- **fsm-engine (`0bd7bb2`).**
  - The dispatch account is supported: dispatch always enqueues, the outermost call
    drains the queue FIFO, and an error clears the queue
    (`src/fsm-engine.ts:189–216`).
  - The "apparent defect" in timer payload forwarding is confirmed by source.
    `src/fsm-engine.ts:370` reads
    `'payload' in params ? [] : [params.payload]`, which inverts forwarding.
    The pass-05 report describes this as a "suspicion … not an observed runtime
    defect". The runtime part is true, but the source makes the inversion
    unambiguous. This is the clearest instance of the investigator producing a
    genuinely valuable, source-verifiable finding.
- **Usefulness across the sequence.** Follow-ups add real, checkable understanding
  beyond the terse summaries, and qualifications are mostly honest about static-only
  evidence. Usefulness is limited by three things:
  - Uncorrected overstatements persist in retained summaries when a later examination
    narrows them without submitting a correction.
  - Presentation is dense. Each account line lists full canonical evidence IDs that
    cannot be typed as references. Every displayed account carries a "0 of 0
    relationships" revision block. `--source-detail` prints raw JSON with absolute
    local paths and only some excerpts.
  - Interpretation is static only.

  These are recorded in the backlog, and I agree with that classification. They do
  not undermine the slice's premise.

### Unverified areas and remaining uncertainty

- **Not read in full.** I did not read every test file. I listed the integration and
  revision test inventories and relied on the passing suite for the remainder. I read
  only parts of `oauth.ts` and none of `auth-command.ts`, `browser.ts` or
  `stream-output.ts` in full.
- **Formative role records not re-inspected.** I did not re-inspect formative role
  dispatches and outputs, exchange captures beyond the targeted provenance check, the
  pass-01 to pass-04 or pass-06 views, or wording-level analysis of the pass-06
  dependent case. I relied on the audits, the reports and the earlier reviews for
  those.
- **Upstream semantics only partly re-derived.** My check was limited to the claims
  listed above. Shared model family and orchestration limits on independence remain as
  recorded.
- **Not run.** No sleep monitor, no dry-run CLI setup, and no live evidence. I see no
  gap that requires new live evidence, except that F1's option (b) would by definition
  need human-authorized live inference.

### Recommendation on task completion

The implementation, offline verification and retained formative evidence are, in my
judgment, sufficient for the slice's behavioral scope, subject to the qualifications
already recorded.

Completion should wait for:

1. the human's explicit decision on F1;
2. the F2 documentation corrections; and
3. a disposition of F3, whether a documented intentional behavior or a small
   acceptance rule with a regression.

This recommendation is not acceptance. The final gate remains the human's.
