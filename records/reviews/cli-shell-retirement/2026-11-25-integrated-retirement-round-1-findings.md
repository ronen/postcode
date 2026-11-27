# CLI shell retirement — final integrated review: findings

Record type: findings
Received: 2026-11-25
Reviewer: Claude (Claude Code, `claude-opus-5-5`), fresh independent session arranged by the human
Handoff: [Final integrated review](2026-11-25-integrated-retirement-handoff.md)
Round: 1
Reviewed target: `3b1a5bc0d1fb9e4bfc943bd1d71eecdba1760edc` (scope `5db2cf19f0436d206aa5d5c05de7f022a03b45b9..3b1a5bc0d1fb9e4bfc943bd1d71eecdba1760edc`)

## Returned findings

### Scope and method

I reviewed the complete diff range (198 files) against the approved plan, the
retirement decision, the accepted invalidation clarification, the task record and
its follow-ups, and the handoff's six focus areas. The checkout was at `29f1998`,
which adds only the handoff. I confirmed that the working tree matches the target
outside `records/reviews/`. I read the implementation directly: `application/session.ts`,
`executor.ts`, `requests.ts`, `retained.ts`, `contracts.ts`, `index.ts`,
`execution-errors.ts`, `execution-wait.ts`, dialog finalization, `RequestWork`,
subject resolution, the memory store, the authentication CLI, the relocated trial
support (`answers.ts` and `state-diagram.ts`), and the capture and comparison
scripts. I also read the integrated verification map and the validation README.
For focus 3, I compared the names of deleted baseline host tests
(`investigation-integration`, `session`, `application-journey`,
`application-cli-outcomes` and `shell`) with the surviving direct tests. Where
coverage looked missing, I traced the code path and ran a scratch probe outside the
repository.

### Verification performed by the reviewer

All runs used **Node 26.11.0** (`/usr/local/bin/node`). The default `node` on PATH
is 26.13.0 and was not used for the oracle.

- I removed `_build`, then ran `npm run check` (passed) and `npm run build` (passed).
- `node --test --test-concurrency=2 _build/test/*.test.js`: **499/499 passed**, with
  0 failures, cancellations or skips. The only warning was a Node deprecation
  (`module.register()`).
- I ran `capture-retirement-baseline.mjs` twice with the documented fixture path.
  Both captures are byte-identical. Their SHA-256 is `f4dd1b3e…48fd4`, equal to the
  committed integrated capture. The committed baseline decompresses to `7c8af4e4…f919`,
  as recorded. The regenerated `ordinary-0-0.svg` and `.txt` equal the committed
  `after/` artifacts.
- `compare-retirement-capture.mjs` reproduced the recorded result: 18 steps, the
  listed intentional-difference counts, and "exact equality after checked
  differences". Under Node 26.13.0 the same script refuses with "Use the baseline
  runtime…" (F2 behaves as described). The capture carries `"node": "26.11.0"` in
  174 provenance fields, and none of them is normalized.
- I ran a scratch probe through `openApplication`, outside the repository and
  uncommitted: the agent changes the source and then submits. The request rejects
  with `SessionInvalidated`. Work is `invalidated`, attempt termination is
  `invalidated`, one usage call is retained, and the subsequent idle `close()` is
  clean.
- `node --check` passes for all retained `.mjs` scripts. No source, test or script
  imports `string-width`, `strip-ansi`, `ansi-regex` or `get-east-asian-width`, and
  the lockfile no longer lists `string-width`. These packages remain as extraneous
  entries in the local `node_modules`. I did not do a clean reinstall.

### Assessment by focus area

1. **O1 — publication path and completion flag.** The deferred-validation path is
   gone: `operation-scope.ts`, `registerOperationHost`, `InputConstraints`,
   `invalidReportInputs`, the `deferred` parameter and the host's `evaluate` route
   were all removed. `perform` always awaits `check()` after `execute`. The
   `requestFinalized` flag has a real direct need. `finishWork` sets it before
   `work.finish()` emits the `finish` progress event. `currentWork` is cleared only
   after `finish()` returns, so it cannot serve as the marker during a reentrant
   `close()`. The flag is reset at each operation start, and its only reader is
   `close()`. The named test verifies completed delivery, a `SessionClosed`
   establishment and the shared shutdown promise. I agree that removing the flag
   would regress this case.
2. **F2 — runtime provenance.** Confirmed as described above.
3. **Old host lifecycle guarantees.** Most of the guarantees survive at the direct
   boundary, and the coverage map is accurate: cancellation through all three
   routes, cleanup ownership and Git deadlines, late reply and usage rejection,
   abort after acceptance during final validation, concurrency refusal, immutable
   exact support (`application-boundary`/`foundation-*`), cross-Session and foreign
   references, limit stops, and ordinary failure locality. One gap remains, in R1.
   The retired items (prompt/EOF, tokenizer, worker races and hard compiler
   preemption) are correctly distinguished. No direct hard interruption is claimed.
4. **F1/F3 — active ordering and finalization.** `check()` establishes the cause
   with `disposed ?? new SessionInvalidated()` and starts `dispose`. `dispose`
   memoizes one assessment that waits on owned cleanup and on the active
   operation's internal `activeDone`. It never waits on the caller's promise.
   Finalizer failures reach `shutdownFailures` before `activeDone` resolves: through
   `TerminalFinalizationError` from the dialog, or through the abort-gated `onWork`
   catch. Ordinary (non-aborted) dialog finalizer failures keep their earlier
   request-local behavior and do not enter the assessment. All parts are tested and
   passed: clean invalidation, participant/attempt/work/resource failure
   combinations, both pending-change orders, once-only cleanup, identical repeated
   observation, and an ordinary failure followed by a clean idle close.
5. **Qualified preservation and complete retirement.** Exact names and ambiguity,
   same-Session `retainedEntity` validation, kind/applicability ordering,
   foreign/unknown/unsupported retained targets, missing versus incomplete
   populations, historical support, and fresh/option chains with exact option
   owner/key all survive. The capture and the direct suites confirm this.
   `isAnswerReference` and `resolveRetainedTarget` no longer accept
   `answer-…`/`@` spellings, and there is no replacement namespace. The
   authentication entry has no runtime import path to project opening; its test
   walks the real import graph. Production code has no remaining import of the
   retired cluster, and core has no import of `scripts/`. The current README,
   STATUS, capability reference, hosted setup, conventions and backlog contain no
   stale command examples. Small leftovers are listed in R4.
6. **Actual disclosure.** I read the committed and regenerated SVG and text and
   compared them with the structured alternative. Each diagram carries its own
   alternative's interpretation status, owner limitations, item qualifications and
   bearer-identification qualifications. The core arrangement is unchanged except
   for the one `renderStateDiagram` argument (I diffed it against the baseline
   `src/lib/contributions/answers.ts`). The comparison script really does check the
   things it claims: the disclosure is derived from the baseline alternative, the
   exact appended text, byte-identical picture markup, the footer containing only
   `<text>` lines, and ordered in-canvas line positions. The final `deepEqual` is
   strict. The two-alternative unit test rejects cross-alternative leakage in both
   formats, and the incompatible and unrendered paths are unchanged. Disclosure
   limits are in R2 and R3.

### Actionable findings

**R1 — Test coverage (low): no direct test for invalidation detected at submission
validation.** The deleted host test "post-submission input invalidation suppresses
the view but preserves usage" was the only test where the input changes and the
agent then *submits*. The dialog's `await wait(options.check)` before `ledger.accept`
must then refuse acceptance, the attempt must end `invalidated`, and usage must
survive. The surviving direct invalidation tests (`application-shutdown`
"active invalidation…" and "pending Git input change") reach the check through the
*tool-request* branch. `application-lifecycle` "direct post-execution validation"
covers mechanical work, and the abort-at-final-validation test covers acceptance
followed by abort. The coverage map's "Input invalidation…" row therefore overstates
retained coverage for this branch. My probe shows that the behavior is currently
correct, so this is not a defect. Suggested resolution: add one direct-boundary case
asserting `SessionInvalidated`, work and termination `invalidated`, no accepted
production or retained answer, retained usage, and a clean idle close.

**R2 — Disclosure (requires human direction; outside the authorized correction):
standalone diagrams do not say which alternative they show, or that other
alternatives exist.** The arranged view's notice ("N equally standing alternative
answers are shown separately… not reconciled") and the alternative's
designation/producer do not appear in the standalone SVG or text. In the controlled
capture, `fresh-0-0.svg` and `fresh-1-0.svg` (and the `.txt` files) are
byte-identical. A reader holding one file cannot tell that it is one of two
unreconciled alternatives, or tell the two apart. Separately, the SVG still omits
the diagram's own entry, coverage and unsupported notes ("States shown: some states
only; others may exist", "absence of an arrow is not a claim…"). These remain only
in the text and legend. That residual was disclosed before the correction, and the
human limited the correction to interpretation status and owner limitations. Now
that the SVG carries a qualification footer, a reader may reasonably treat it as
self-qualified. I am not asking the implementer to expand scope. The human should
decide whether either point warrants a follow-up or should be recorded as an
accepted residual.

**R3 — Rendering legibility (nit): the SVG disclosure wraps mid-word and uses about
half the canvas width.** `columns = floor((width − 40) / 14)` gives 44 characters
on a 660-wide canvas, at a 13px monospace font of about 7.8px per character. This
splits words like "Interpretatio|n" (the status word itself), "Contr|olled" and
"esta|blished". The committed SVG is 1784 units tall for a 542-unit picture. All text
remains present and visible, so this is not a disclosure failure. Wrapping at word
boundaries with a width matched to the font would make the status easier to read.

**R4 — Retirement residue (nit).** (a) The `{ kind: 'operation'; operation:
InvestigationRequest }` variant of `InitiationContext.request`, and its `initiation()`
purpose branch, lost their only production producer when the operation host's
`evaluate` route was removed. Now only `test/work-attribution.test.ts:247` constructs
one. (b) `ResolutionInformation.retainedAnswers[].reference` is now always set to
`id` (`executor.ts:47,78`). That field was the compact-answer slot, so it is now
redundant alias-shaped output that the plan's "remove alias-only output metadata"
would cover. Neither item is documented as a deliberate residual. Removing or
documenting them is a small, in-scope cleanup. The candidate `reference` field is
different: for reference designations it still carries the supplied spelling, so
keeping it is justified.

### Non-defect observations

- When an `onWork` callback closes the Session from the `finish` event and then
  throws, `progress` records a `work-report` failure: the controller is already
  aborted, so close rejects with `SessionShutdownError` even though the request
  completed. This matches the stated contract (report failure after shutdown
  begins). I am recording it only for awareness.
- If `close()` is called during an active `session.check()`, it now establishes
  `CommandInterrupted` instead of `SessionClosed`, because `check` runs under the
  busy guard. This is consistent with "active close is terminal abort".
- Opening-path cleanup can still replace an original error. This limitation is
  already disclosed and outside scope.

### Unverified areas and residual limits

- No live model, credential, browser or network run, which matches the handoff. I
  did not run the trial runners or the memory profiler independently; I relied on
  the `structured-trial` tests in the suite.
- I did not do a clean `npm ci` (the local `node_modules` still holds extraneous
  removed packages). I did not repeat a full unused-export audit; I spot-checked the
  retired-cluster symbols only.
- I compared the lifecycle migration by test names and targeted reading, not by
  replaying every deleted assertion.
- I did not render the SVG visually. I inspected its markup and geometry.

### Recommendation

The implementation meets the plan's completion evidence for every required outcome.
I found no correctness defect in the retirement, lifecycle finalization, qualified
preservation or controlled comparison, and I reproduced the oracle exactly on
Node 26.11.0. I recommend treating the final review gate as **sufficient once the
human has dispositioned R2** (follow-up or accepted residual). R1 is a
straightforward in-scope test addition, and R3 and R4 are optional cleanups. If any
of them is corrected, it can be checked by the implementing agent's verification;
none of them materially changes this analysis. This review does not authorize task
closure or merging.
