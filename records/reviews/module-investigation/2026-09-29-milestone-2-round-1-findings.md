# Module investigation: shell and session integration review findings, round 1

Record type: findings
Received: 2026-09-29
Reviewer: Claude Opus 5.5 (Claude Code session arranged by the human; not the implementing agent)
Handoff: [2026-09-29-milestone-2-handoff.md](2026-09-29-milestone-2-handoff.md)
Round: 1
Reviewed target: `a396f9b8e9b38ad344554cbe4c0e7677ded1ec0e`

## Returned findings

### Scope and method

I reviewed the implementation diff `bca53ba..a396f9b`. This covers:

- the new `investigation/evaluation.ts`, `presentation.ts` and `reporting.ts`;
- changes to `session.ts`, `session-worker.ts`, `session-protocol.ts`,
  `interactive-session.ts`, `memory-store.ts`, `records.ts`, `identity.ts`,
  `commands.ts`, `command-execution.ts`, `shell.ts`, `cli.ts` and
  `observations.ts`;
- the new `test/investigation-integration.test.ts`;
- the documentation changes.

I read the unchanged code that this work depends on:

- `investigation/execute.ts`
- `usage.ts`
- the agent contracts
- `EntityBindings`
- the store's commit path

I judged the work against these sources:

- the plan's milestone-2 section;
- the plan sections on retained outcomes, request identity, stable references,
  inspection, correction display, bounds and outcomes, asynchronous execution,
  usage reporting and observations;
- the relevant deterministic-check lists.

I also read the milestone-2 validation record and the backlog entry on
cancellations. The commits after the target (`50eb199`, `2e2d600`) change only
records and `docs/backlog.md`.

All checks ran in a detached worktree at the pinned target, using the
repository's installed dependencies. I added no credentials and ran no hosted
inference. I also wrote uncommitted probe tests in that scratch worktree. Each probe
drove the built production `runCli`, together with the real compiler worker and
the repository's `ScriptedInvestigator`.

### Checks performed

- `npm run check` passed.
- I ran the full suite (`npm test`, then `node --test _build/test/*.test.js` twice
  more) three times in a row. Results are in the table below.
- Five probes, described under the findings and observations below.

| Run | Tests | Passed | Failed | Cancelled | Duration |
| --- | --- | --- | --- | --- | --- |
| 1 (`npm test`) | 360 | 360 | 0 | 0 | about 125.5 s |
| 2 | 360 | 360 | 0 | 0 | about 121.0 s |
| 3 | 360 | 360 | 0 | 0 | about 117.4 s |

### Findings

**F1 (low–medium): the worker and parent usage ledgers can disagree. `usage` and
the view can then show a reported call as unknown, while the observation counts it.**

The worker's domain ledger feeds `usage` and every view's `usage` field
(`session.ts`, `usageReport`). The parent ledger in `interactive-session.ts` feeds
the `investigation-usage` observation record and the final stderr report.

- **Parent:** it accepts a usage report for a call as long as the attempt's
  dialogue is still open.
- **Worker:** `session-worker.ts` deletes the `exchanges` entry as soon as it
  receives `agent-result`. Any `agent-usage` for that call that arrives later is
  dropped.
- **In-process domain path:** by contrast, it records usage until the attempt ends
  (`if (activeUsage) recordUsage(usage)`).

So when an adapter reports usage after an exchange's reply resolves, the bridge
behaves differently from the domain contract. Nothing in `AgentDialogue` forbids
reporting usage after the reply; some streaming adapters settle usage after the
final content.

Probe P1 reproduced this. A one-shot `summarize --json` call reported call 1's
usage 5 ms after returning its `tools` reply. The printed view showed
`calls 2, missingCalls 1`. The same command's observation showed
`calls 2, missingCalls 0`.

This is conservative, because the call is shown as unknown rather than zero.
However, the handoff states that the parent ledger is authoritative, yet the
human-facing `usage` command reads the other ledger. Its "unknown" count can also
contradict the stored observation for the same command.

Possible corrections include:

- key worker-side usage by attempt/call rather than by the pending exchange; or
- have `usage` and the views read the parent's snapshot.

Either correction should come with a regression test for usage reported after the
reply. Late usage after a dialogue has *closed* is a separate case: the current
test and documentation already treat it as ignored and unknown.

**F2 (low): a mechanical lens given a known investigram reference reports
`unknown-reference` rather than an unsupported subject/lens combination.**

In the shell, probe P3 ran `children @investigram-…` using a reference displayed
by the preceding summary. It rendered `0 exact matches · unknown-reference` in the
dependency view. `summarize @investigram-…` rendered `Selection: missing`.

Neither coerces the reference or invokes the investigator, which is correct.
However, the reference *is* bound in this session. The plan's deterministic checks
ask for "mechanical lenses applied to investigram references report unsupported
subject/lens combinations without coercing the reference … or invoking the
investigator".

This milestone is the first time users can reach investigram references in the
shell, so the misleading status is now user-visible. No test covers the case. If
the implementer judges this check to belong to milestone 4, record that deferral
explicitly.

**F3 (low): final abnormal usage on stderr shows only session totals, and prints
a stray blank line when there are no totals.**

`publishCommand` builds the human final report from `usage.totals` alone. The
plan says "Final reporting and observations include available attempt and session
totals".

- **Observations and JSON stderr:** these contain the per-attempt data.
- **Human stderr:** it does not break usage down by attempt. In a shell that ran
  several attempts before an interruption, the human final report therefore loses
  that breakdown.

When `totals` is empty (all calls unknown), the report ends with an empty extra
line. Probe P4 showed `Final investigation usage: 1 calls; 1 unknown; 0 anomalous.\n\n`.

**F4 (low): the human correction display omits corrected subjects and the
correction's own support.**

`renderInvestigationView` prints the reporter, target, replacement, reason and
qualifications for each correction. It does not print `correctedSubjects` or
`correction.evidence`.

For `inspect`, the correction's evidence appears only after being merged into the
flat `Support` list. That list does not say which account or correction cites
each item. For `summarize`, support is not printed at all. The JSON view contains
all the data.

The plan requires the reporting view to list corrections "with targets,
replacement references, reasons, and access to supporting context". The human
view satisfies this only indirectly: the user must inspect the reporter and read
unattributed support. I suggest printing corrected subjects and evidence
references per correction, or naming the attribution explicitly as a limit of
this checkpoint.

### Non-defect observations

- **Selection and reuse.** `investigationEvaluation` selects work by
  `canonical({operation, subject, parameters})` over retained evaluation records.
  This is independent of lens and presentation. `evaluateInvestigation` shows that
  reuse does not need a lens. Configuration and communication failures return no
  evaluation record, so a later request runs fresh (the test covers this for each
  taxonomy row). Additional evidence or context does not change the key.
- **Atomic retention.** `MemoryProgramRecordStore.put` validates the whole batch
  before committing anything. It rejects a failed evaluation that carries
  investigrams or corrections, and a correction whose target is not already
  retained. The domain returns a failure for an invalid submission without
  emitting records, and the test confirms that earlier accounts are unchanged.
  - The comment "no await between the last validity check and atomic publication"
    is slightly inaccurate: the `return` from `investigate` and the
    `await investigate` add microtask boundaries.
  - The property still holds. The check is snapshot-based, and interruption
    arrives as a macrotask. After `investigate` returns, `signal.aborted` is
    rechecked synchronously before `put`.
- **References.** Investigram bindings use the existing append-only hash-prefix
  allocator, which is session-scoped. Originals, children and replacements are
  inspectable. A foreign-session reference is `missing`. Inspecting an original
  shows the original tree plus incoming correction links; it does not redirect.
  - Inspect selection allocates bindings for every retained investigram in the
    session, including ones not yet displayed. This is harmless for stability.
  - An account's `Evidence:` line prints raw record IDs rather than selectable
    references.
- **Bridge ownership and late events.**
  - The parent opens the investigator dialogue lazily, one per attempt.
  - `agent-close` aborts the dialogue and closes it.
  - Replies after close are dropped (`closedDialogues`), as is usage after close
    (the identity check on `dialogues.get`).
  - Messages from a finished operation are dropped by the `pending.id` guard.
  - Because `investigate` closes its dialogue in `finally` before it returns, the
    close message always precedes the operation reply.
  - A `DataCloneError` from a non-cloneable reply is caught by `post` and disposes
    the session. There is no unhandled rejection, but the result is a defect
    (exit 1 in probe P4), not a retained investigation failure. In-process, the same
    reply would simply lose its extra property. This matters only for a broken
    adapter; the absent (`undefined`) reply case is covered.
- **Interruption.** Probe P2 was a shell interrupted during an in-flight
  `summarize`. It exited 130, emitted one `command-interrupted` batch with parent
  usage (`1` call, termination `interrupted`) and printed the final usage on
  stderr. This agrees with the one-shot test. The parent's `dispose` relabels only
  `running` reports: `interrupted` when the cause is interruption, `defect`
  otherwise.
- **Usage arithmetic.** Categories are keyed by (unit, category, includedIn) and
  grouped by full agent identity plus source. Subsets are never added to their
  parents, and there is no grand total. When a sum overflows, the value becomes
  null, and it stays null. Non-finite raw values are listed separately.
  Human output shows only `provider/model`, so two configurations of one model
  would render with identical labels (JSON distinguishes them).
- **Configuration unavailability.** Probe P5 ran the ordinary CLI with no
  injection. `summarize entry` exits 3 with a `configuration-unavailable` view and
  one-shot reference expiry. `usage` exits 0 with zero calls. `summarize nothing`
  exits 3 with `Selection: missing`. No public injection flag or stdin mode was
  added.
- **Source disclosure.** `--source-detail` is accepted for `inspect` (including
  investigrams) and refused for `summarize`. Only an explicit source detail
  produces the `investigation-support` source-escape event. Investigator-only
  acquisition produces none. Generated prose that quotes source cannot be detected
  as disclosure; this is inherent and beyond this checkpoint.
- **Scope.** Replacement substitution, conflict and reconsideration display,
  follow-up lenses, subject-associated discovery and hosted setup are all absent,
  and the documentation discloses this. This matches the plan's milestone
  allocation.

### Cancellation concern

The cancellation of the 13 execution-ownership tests did not recur in my three
complete runs at the target. As the handoff states, these passes do not resolve the
concern or explain its cause. I did not diagnose it.

It matters more for this milestone than before. Milestone 2 adds parent-side
asynchronous state to `interactive-session.ts`:

- dialogues
- abort controllers
- usage recording
- relabelling of attempt reports on disposal

That module is the one whose worker send, close, late-settlement and cleanup paths
the cancelled tests exercise.

The reported symptom ("Promise resolution is still pending but the event loop has
already resolved") means a test awaited a promise that nothing left alive could
settle. That is the failure mode a lifecycle or cleanup defect would produce. It
is also consistent with a harness-timing artifact.

The pattern reproduces on the pre-investigation baseline, and the new
investigation paths have their own passing integration coverage. So I do not
consider the concern a defect introduced by this milestone. However, it is still
unresolved uncertainty about exactly the worker and session ownership paths this
milestone extends. Acceptance should keep the validation qualification. Diagnosis
should not be deferred past the point where a live, cost-bearing adapter depends on
reliable interruption and cleanup, which is milestone 3.

### Unverified areas and residual limits

- I did not review a hosted adapter or live behavior; none exists at this
  checkpoint. The bridge findings concern contract fidelity for a future adapter
  whose callback timing I could not observe.
- I did not probe these directly: shell invalidation during evidence work, as
  opposed to after submission; worker crash during an exchange; or multi-attempt
  interrupted final reporting. My assessment of them rests on code reading.
- The probes are uncommitted scratch tests. They are not regression coverage.

### Recommendation

The milestone-2 integration substantially meets the plan:

- operation-based selection and retention policy;
- atomic retention;
- stable, exact investigram inspection with original and replacement references;
- the parent-owned bridge with independent usage;
- human and JSON views, one-shot expiry, and expected failure exits.

I found no defect that compromises retention integrity, reference stability or
late-result rejection.

I recommend accepting the checkpoint after F1 is corrected or explicitly
dispositioned. F1 is the only finding where two production reports of the same
command can disagree. F2–F4 are low-severity presentation and coverage gaps. They
can be corrected cheaply or deferred with explicit human direction.

The unresolved execution-ownership cancellation remains a standing qualification,
as described above. It does not by itself block this gate, because the pattern
predates this work and I did not reproduce it in the repeated runs. The human
should decide whether to keep deferring its diagnosis now that the worker lifecycle
has become more complex.
