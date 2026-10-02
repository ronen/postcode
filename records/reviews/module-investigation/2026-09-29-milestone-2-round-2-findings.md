# Module investigation: shell and session integration review findings, round 2

Record type: findings
Received: 2026-09-29
Reviewer: Claude Opus 5.5 (Claude Code session arranged by the human; not the implementing agent)
Handoff: [2026-09-29-milestone-2-handoff.md](2026-09-29-milestone-2-handoff.md)
Round: 2
Reviewed target: `849267193a6d75113d2deb33c8a1b481f916fa4e`
Prior findings: [Round 1](2026-09-29-milestone-2-round-1-findings.md)
Prior reviewed target: `a396f9b8e9b38ad344554cbe4c0e7677ded1ec0e`

## Returned findings

### Scope and method

As the human directed, this round covers only the corrections. I did not repeat
the full review.

I reviewed the source and test diff `bd03902..8492671`, which consists of
correction commits `df2bdb0` and `8492671`. I also read the
[disposition](2026-09-29-milestone-2-disposition.md). The later commits `c2ec2b2`
and `53ac402` touch only records.

All checks ran in a detached worktree at `8492671`. I added no credentials and ran
no hosted inference. I re-ran my round-1 F1 probe and added one new probe. Both
were uncommitted scratch tests that used the production `runCli`, the real worker
and `ScriptedInvestigator`.

### Checks performed

- `npm run check` passed.
- `npm test`: 367 of 367 passed, with 0 failed, cancelled or skipped (about
  133.7 s).
- **Round-1 probe P1:** the investigator reports a call's usage 5 ms after returning
  its `tools` reply. The view now shows `calls 2, missingCalls 0`, and the
  observation shows the same. At round 1 the view had shown 1 unknown call.
- **New probe P6:** `children @<known investigram> --source-detail` and
  `inspect @investigram-00000000 --source-detail`, run in the shell. See the
  observations below.

### Assessment of corrections

**F1: corrected.** The correction has two parts:

- **Worker:** usage callbacks now live for the length of the dialogue
  (`usageCallbacks`) rather than only until each reply.
- **Parent:** it seals each attempt's call reports when `closeDialogue` runs, before
  it aborts and closes the dialogue. `execute` then rebuilds every investigation
  view from `usageReport()`, so it no longer uses the worker's view usage.

The parent now drives the human `usage` command, the views, the observations and
the final stderr report. The worker ledger remains only as an internal input. I
confirmed the ordering argument: the worker sends `agent-close` from the domain's
`finally` block before it replies, and the parent processes messages in order. So
the snapshot is complete when the reply is finalized.

The seal is defensive. Even without it, the existing check
`dialogues.get(attempt) !== current` already rejects reports that arrive after
close. Either way, it makes the intended boundary explicit.

The new closing-window regression intercepts only delivery of the real close
message. It shows three things:

- the worker snapshot missed the report;
- the parent accepted a report sent before closure; and
- the parent treated a report sent after closure as unknown.

In both formats, the view, observation and rendered output agree.

Separating the view identity (which includes usage) from the projection identity
(which does not) is reasonable. It is also correctly reflected in the
presentation method, now at version 3.

**F2: corrected.** A known investigram reference given to `children`, `parents` or
`summarize` now yields `unsupported-subject-lens`. It exits with the expected
failure status, and it neither coerces the reference nor invokes the investigator.
A missing or foreign reference still produces missing or unknown, which is
correct. Lookup is scoped to the session's retained investigrams. The remaining
lenses that accept selectors are `inspect`, which is supported, and the three
covered here, so coverage is complete.

**F3: corrected.** Human final stderr now reports each attempt with its
termination, then session totals and limitations, using the shared renderer. The
unknown-only case has no blank line. The regressions cover both a multi-attempt
shell interruption and a one-shot interruption where all usage is unknown.
Removing the leading `\n` from `usageLines` also changes spacing in ordinary views;
this is cosmetic only.

**F4: corrected.** Each correction now prints its corrected subjects and its own
evidence (or "none supplied"). Both are raw IDs. The disposition explicitly
records them as attribution keys rather than selectable references, which is
acceptable at this checkpoint.

The comment on atomic publication now describes the behaviour accurately.

### New findings

None.

### Observations

- **Source-escape events with no disclosed source.** In probe P6, both commands
  emitted a `source-escape:investigation-support` event with zero source items:
  - `children @<investigram> --source-detail` (the new unsupported path);
  - `inspect` of a missing investigram with `--source-detail` (present since
    round 1; I missed it then).

  The existing mechanical `inspect` behaves the same way: `presentation.ts`
  attaches `sourceDetail` whenever it is requested, including when nothing
  matches. So this follows established convention rather than being a regression.
  It over-reports disclosure, which is the conservative direction. If an event
  should mean that source was actually shown, this applies to all lenses and
  belongs with separate work, not this gate.
- **Round-1 residual limits.** The disposition records these accurately:
  - allocation of undisplayed bindings;
  - raw evidence IDs;
  - a transport defect on a non-cloneable adapter reply;
  - usage labels that show only provider and model.
- **Unprobed cases.** These remain as I left them in round 1 and are not claimed
  as covered:
  - shell invalidation during evidence work;
  - a worker crash during an exchange.

### Cancellation concern

The run at this target had no cancellations. Across both rounds I have now seen
four complete runs without any. This does not resolve the concern.

The disposition records the human's decision:

- diagnosis of the execution-ownership cancellations is deferred through
  milestone 2;
- that diagnosis is required before milestone 3's live adapter work.

That agrees with my round-1 recommendation. The validation qualification remains
in force.

### Recommendation

All four round-1 findings are corrected and have deterministic regression
coverage. The corrections introduce no new defects. I recommend that the human
accept the milestone-2 gate. The acceptance should keep the qualification about
the execution-ownership cancellations and the recorded prerequisite that they be
diagnosed before milestone-3 live adapter work. No further review round is needed
for these corrections.
