# Module investigation milestone 4: progressive investigation — round 1 findings

Record type: findings
Received: 2026-10-01
Reviewer: Claude Code (Claude Opus 5.5, `claude-opus-5-5`), fresh session arranged by the human; repository-writing reviewer
Handoff: [2026-10-01-milestone-4-handoff.md](2026-10-01-milestone-4-handoff.md)
Round: 1
Reviewed target: `69c86d6125441ea151f3dd2dbbe95cfc870a25ab` (diff range `b46074d..69c86d6125441ea151f3dd2dbbe95cfc870a25ab`, branch `codex/module-investigation`; handoff commit `973839e` read as the assignment only)

## Returned findings

### Scope and method

I reviewed the complete source, script and test diff in `b46074d..69c86d6`
(`3875cce`, `9a204a6`). I also confirmed that `9a204a6..69c86d6` changes no
`src/`, `scripts/`, `test/`, package or `tsconfig` file, and that `69c86d6` itself
adds only the task-record checkpoint. I read the governing milestone-4 plan text,
including the focused-case table and assessment targets, the CLI reference update,
and the pass-04 protocol, report, manifest clarification, rubric, questions,
per-case commands, selections, stdout captures and assessor outputs.

I traced the following paths in the code: shell grammar (`commands.ts`), follow-up
selection and failure flags (`session.ts`), association selection, bounding and
identity (`associations.ts`), acceptance-assigned association roles
(`acceptance.ts`), investigator listing and exposure (`context.ts`, `execute.ts`),
structural reference translation (`references.ts`), and the parent/worker
selection handshake (`interactive-session.ts`, `session-worker.ts`,
`session-protocol.ts`). I also traced the assessment harness hooks
(`run-shell.mjs`, `injected-setup.mjs`, `verify-configuration.mjs`) and the entity
binding stability these depend on (`identity.ts` `EntityBindings`).

I did not access Keychain items, inspect Codex credentials, change provider
settings, sign out or issue any live request. All execution was offline, in a
detached scratch worktree at the target, so the tracked checkout stayed stationary.

### Verification performed

- **Complete offline suite reproduced at the target.** `npm ci` followed by
  `npm test` under Node 22.13.1 gave **448 tests, 448 pass, 0 fail, 0 cancelled,
  0 skipped**. Test duration was 145.5 s, and wall time including the build was
  154.9 s.
- **Audits reproduced.** I ran the frozen `audit-results.py` and the post-run
  `audit-navigation.py` on a scratch copy of `pass-04/`. Their regenerated
  `verification.json`, `usage-runs.json` and `navigation-verification.json` are
  byte-identical to the committed files. The audits reconcile 64 ledger requests
  (Cockatiel 18, FSM 17, merge-anything 19, numeric 10), 1,459,926 provider-reported
  tokens and 706 exact structural resolutions.
- **Scripted setup.** `setup-exchanges.jsonl` holds one exchange with origin
  `injected-assessment-setup` and `providerRequests: 0`. The numeric usage
  attempts are attributed `postcode-assessment/scripted` (functionality, with the
  anomaly "No usage categories were reported.") and then three `openai/hosted`
  attempts. This matches the report's 11 dialogue calls, 1 anomaly and 10 provider
  requests.
- **Production reachability.** `src/cli.ts` does not pass `selectInvestigator`. The
  hook is reachable only through the internal `CliEnvironment`, which the
  assessment harness and tests use.
- **Credential patterns.** A supplementary scan of the pass-04 exchanges found no
  bearer, JWT or authorization strings. One `sk-` plus 20 alphanumeric characters
  match occurs inside a provider `encrypted_content` blob as a coincidental
  substring, not a credential. This is not proof against all secret formats.
- **Pinned-source semantic checks, made independently of the assessors:**
  - *Numeric* (`progressive-numeric/classify.ts`, commit `495f6c3`, tree `69e3585…`
    matches `fixture-git-commit.txt`): three independent `if`s, accumulated in
    positive/even/large order. All displayed examples are correct: 12 → three
    labels, 11 → positive and large, 9 → positive, 0 and −2 → even, −3 → `[]`.
    "Every finite value ≥ 10 is > 0" also holds. Both corrections are supported.
  - *Merge-anything* (`src/merge.ts` at `bc7c79f`): `assignProp` uses
    `carry[key] = newVal` for enumerable keys and `Object.defineProperty`
    (writable, configurable, non-enumerable) otherwise. Values are read through
    `origin[key]` and `newComer[key]`, so getters are evaluated eagerly. The
    correction's claim, that ordinary assignment could meet an inherited setter, is
    accurate and correctly qualified ("under the usual unmodified
    `Object.prototype` … normally does create the described own data property").
    The `__proto__` skip removes the only standard inherited accessor.
  - *Cockatiel* (`src/common/Executor.ts`, `src/common/Event.ts` at `80b5ed6`): I
    confirmed the true-means-failure filter polarity, the single try/catch spanning
    `resultFilter`, the success stopwatch and synchronous success emission, the
    stopwatch decision fixed by listener counts at invocation start,
    `errorFilter`/failure emission outside a protective try, and `EventEmitter.emit`
    iterating listeners without isolation. The examination's control-flow claims
    hold.
  - *FSM* (`src/fsm-engine.ts:370` at `0bd7bb2`):
    `const payload = ('payload' in params ? [] : [params.payload])` is inverted as
    the captures say, so a payload-bearing timer dispatches without its payload.
    The discrepancy is real in source and is appropriately retained as a static
    reading.
- **Offline probes, in the scratch worktree only.** These back findings F1 and F2
  below.

### Actionable findings

**F1 — Low (identity/correctness). The identity of a mechanical associated inspection omits its continuation input.**
`withAssociatedInvestigations` (`src/lib/investigation/associations.ts:45-50`)
derives the projection ID from the base projection, subjects, item IDs, total,
omitted count and status, and derives the view ID from those plus reference
lifetime. `investigations.after` is part of the view content but enters neither
identity. A scratch probe ran `summarize entry`, then `inspect entry` with
`after: 'investigram-00000000'`, then with `after: 'investigram-11111111'`. It
produced **identical view and projection IDs**, while `investigations.after`
differed (status `unknown-continuation`, `failed: true` in both). The
investigram-inspection path does not have this gap, because its projection ID
includes the whole `request` (and thus `after`) plus the investigations object.
The practical impact is small: it is confined to invalid continuations, and valid
continuations differ by items. Still, it is the same class of defect that `9a204a6`
fixed for reference lifetime, in the same function. The handoff presents view
identity as including the relevant inputs. Suggested correction: include
`investigations.after` (or the complete `investigations` value, matching the
investigation view) in the associated projection identity, and add a regression
next to the lifetime comparison.

**F2 — Low (test coverage). Only the success path of the parent/worker selection handshake is tested.**
The only test that sets `selectInvestigator` is the progressive integration test
(`test/investigation-integration.test.ts:554`). No test covers:

- a selector that throws;
- an interruption between `agent-select` and `agent-selected`;
- a stale `agent-selected` reply.

By reading the code, the paths look sound:

- the parent's top-level `ended`/`pending.id` guard covers `agent-select`;
- `dispose` clears `selectedAgents`;
- the worker ignores mismatched selection replies.

I probed the throwing case through `runCli shell`. It fails closed: the shell exits
1 with `Internal failure: selector boom`, no hang and no further prompt. The
harness's own guard ("Controlled setup must begin with functionality") relies on
exactly this. Because the hook is internal and assessment-only, this is a coverage
gap rather than a demonstrated defect. Suggested correction: add an offline test
for selector failure, including session closure and usage-report state. Either add
an interruption-during-selection test too, or record that path as an accepted
untested limit.

**F3 — Low (presentation wording).** Two follow-up messages read poorly:

- An unsupported program-subject follow-up renders as "The reference is bound to
  an program-subject; explain does not support that subject kind."
  (`src/lib/investigation/presentation.ts:117`), with ungrammatical, internal-kind
  wording.
- An unknown `--after` continuation renders only "Listing: unknown-continuation;
  0 shown of N." It never says that the supplied continuation reference is absent
  from this listing.

Both are minor and can wait for the whole-journey UI backlog if the human prefers.
Neither affects behavior.

**F4 — Assessment adequacy; needs a human judgment, not necessarily a correction.
The controlled-correction case has low discriminating power.**
The plan assigns milestone 4 the focused case "controlled correction of an earlier
interpretation". It asks whether examination "notices and explains
inconsistencies in earlier accounts". The numeric fixture shows that correction
works end to end: injection, retention, retrieval to complete target context,
explicit target, replacement, reporter and corrected subjects, and preserved
originals. It is weak evidence for the noticing capability:

- The fixture README states the correct conclusion outright: "Its source is the
  evidence for the independent conditions and emitted order. It does not validate
  input or provide a partition of the numeric domain."
- The function's doc comment says "Record applicable numeric properties".
- The injected account's own qualifications, which are delivered to the
  investigator, say it is "Injected … not a natural investigator result" and "has
  not acquired source evidence and remains unverified".
- The source is seven lines long.

The investigator's correction reasons cite the README agreeing with source. A
correction was therefore strongly cued, and the case cannot separate source-based
noticing from documentation- and qualification-prompted correction. The natural
merge-anything correction partly compensates. It is subtle, correctly qualified
and verified above, but it is a single case. I do not recommend a live rerun as a
condition of this gate. I recommend that the report or disposition state this
limitation explicitly, and that the human decide whether this suffices for the
milestone-4 focused case or should be strengthened in milestone 5's controlled
correction cases (for example, by withholding a conclusion-stating README or the
"unverified" cue).

### Non-defect observations

- **Selection, grammar and lifetimes behave as described.**
  - `explain`, `decompose` and `examine` need exactly one `@`-prefixed shell
    reference.
  - Names, `--` literals, one-shot use, extra positionals and `--source-detail`
    are refused.
  - Known module and group references give `unsupported-subject-lens`. Unbound
    references are `missing`. Neither triggers inference.
  - `--after` is limited to shell `inspect` and accepts only a well-formed handle.
  - Entity bindings are allocate-once (`EntityBindings`), so references and
    `--after` cursors stay stable as history grows.
  - Retention order is append-only.
- **Explicit association.** Association matching uses only stored `associations`.
  Acceptance assigns those roles as follows:
  - `investigation-subject` goes only to each root.
  - `described` goes to model-submitted associations validated as session
    subjects.
  - `corrected-subject` goes to replacement roots.

  Referent subjects, `originatingModule` and evidence mentions never create
  matches. Inspecting `anonymous` in merge-anything correctly does not list the
  correction about the `merge` module, and the injected child does not appear
  under `classify`.
- **Availability versus exposure.**
  - `InvestigationContext.list` returns `accounts: []`.
  - `supplied()` records no parts for it, and acceptance uses
    `exposure.citations`/`completeTargets`.
  - Listing handles therefore confer neither citation nor correction eligibility.
    The offline test of a correction attempted from a listing alone, and the
    audit's exposure reconstruction, both confirm this.
  - `references.ts` maps `listing.subject`, `next` and `selected`, request
    `cursor`, and account `provenance.request.subject`.
- **Previews.** Previews truncate only prose, with a counted omission. Account and
  association qualifications are delivered whole, or the whole detail is replaced
  by an explicit omission under the 55,000-unit page bound. The prose slice is by
  UTF-16 unit and can split a surrogate pair. This is cosmetic.
- **Presentation limits that belong to milestone 5 or the UI backlog** (not failed
  milestone-4 checks):
  - In association listings, corrected originals such as the injected root under
    `inspect classify` carry no correction indicator. Only the replacement's
    `corrected-subject` role hints at it, and the limitation sentence discloses
    this.
  - Examination `@investigram-8f1a2f3e` both corrects `@investigram-33b17c63` and
    records an inconsistency against it, rendered as "Unresolved inconsistency" even
    though the same result resolves it by correction.
  - Association subjects, provenance, evidence and corrected subjects render as
    canonical session record IDs rather than `@` references, and
    `investigation-subject` associations end with an empty `evidence:`.
  - Listing order is acceptance post-order, so parts and replacements precede
    their roots. Order is disclaimed as non-authoritative.
- **One-shot `inspect`.** Every one-shot `inspect` now carries an (always empty)
  associated listing with command lifetime and a changed view ID. This is
  intentional and covered by the updated shell test.
- **Upstream decompositions** in all three cases explicitly qualify themselves as
  non-exhaustive and possibly overlapping. This meets the plan's
  decomposition-overlap target beyond the controlled fixture.
- **Harness.** `verify-configuration.mjs` now checks all frozen operation templates.
  The `post-run-configuration.json` checks report all four subjects verified.

### Unverified areas and residual limits

- I did not rerun any live evaluation, and I could not independently confirm that
  the assessor and evaluator roles were confined to the supplied artifacts. Shared
  model family and orchestration remain as disclosed.
- I did not independently check the deeper examination claims beyond the
  spot-checks above: Cockatiel IPolicy documentation wording and authored-test
  claims; FSM logger failure, timer survival and constructor boundary; merge
  `Merge` type and test-coverage claims.
- I did not exercise interruption during selection, worker termination races
  around `agent-selected`, or real hosted adapter behavior with the selection hook.
  I read these paths only.
- I did not run upstream runtime tests, consistent with the handoff.
- The whitespace qualification (110 capture warnings) and the per-file licenses
  were not re-derived.

### Gate recommendation

**Adequate for the milestone-4 gate, subject to the human's judgment on F4.**

- I found no defect that undermines the core milestone-4 behavior: exact follow-up
  selection, operation-based reuse, explicit and bounded associations,
  availability-versus-exposure separation, structural reference mapping, preserved
  originals with explicit correction identities, or selected-participant
  attribution in usage and provenance.
- The offline suite and the audits reproduce exactly.
- The consequential semantic claims I checked hold against pinned source.
- F1–F3 are low-severity. Correct F1, with its regression test, before or at the
  start of milestone 5. F2 and F3 may be corrected or explicitly deferred.
- F4 is a qualification of the assessment evidence, not of the implementation.

No further live evidence is required for this gate in my view. If the human wants
stronger evidence for the "notices inconsistencies" target, a controlled case
without a conclusion-stating README or "unverified" cue would need separate live
authorization.
