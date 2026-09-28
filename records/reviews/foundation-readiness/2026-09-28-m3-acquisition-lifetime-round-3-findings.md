# Foundation readiness M3 acquisition/lifetime review: round 3 findings

Record type: findings
Received: 2026-09-28
Reviewer: Claude Code (Claude Opus 5.5), independent agent session arranged by the human
Handoff: [2026-09-28-m3-acquisition-lifetime-handoff.md](2026-09-28-m3-acquisition-lifetime-handoff.md)
Round: 3
Reviewed target: `085621903155fdf95ff3d329872e54ac8094374b` (corrections `43410a0c1066389e64df657f9a850f53b3c951d3..085621903155fdf95ff3d329872e54ac8094374b`)
Prior findings: [2026-09-28-m3-acquisition-lifetime-round-2-findings.md](2026-09-28-m3-acquisition-lifetime-round-2-findings.md)
Prior reviewed target: `43410a0c1066389e64df657f9a850f53b3c951d3`

## Returned findings

### Scope and method

This round reviewed the round-2 corrections as described in the updated
[disposition](2026-09-28-m3-acquisition-lifetime-disposition.md) and the
[round-2 validation record](../../validation/foundation-readiness/2026-09-28-m3-round-2.md).
They consist of:

- the regression test in `5ad6e24`;
- the correction checkpoint `0856219`.

Commit `d146e55`, which follows the target, changes only records: the disposition,
the validation record, and the case model with its result. The task follow-ups
`8856d11` and `66faf2b` change only the task record. None of these are part of the
implementation reviewed here.

Both the disposition and the validation record describe `0856219` as an
intermediate checkpoint. They say two case-model defects await a human scope
choice, and the task record contains no response yet. I reviewed the checkpoint as
it stands, without inferring that choice.

I read every source and test change from `43410a0` to `0856219`:

- `output-boundary.ts`: own-name case probe, device-root fallback, diagnostic
  wrapper;
- `typescript/inputs.ts`: replay without recording;
- the two method-version bumps;
- the new `inputs` and `output-boundary` tests.

I built `0856219` and `43410a0` in separate disposable detached worktrees. I then
reran my round-2 probes and the implementer's preserved case model against both
builds. The main checkout was not modified except for this record.

### Actionable findings

No new actionable findings.

Two items remain open. I raised them as round-2 observations, the implementing
agent has confirmed them as defects in a controlled model, and a human choice is
pending. I list them here so that the gate decision sees them in the review record.
They are not new defects I am introducing:

- **O1: same-device, per-directory case rules.** Case handling is still observed
  once per device for each resolution pass, so a second directory with a different
  rule on the same device gets the wrong answer. At this checkpoint the model's
  insensitive-directory case moved from correct to wrong, and the sensitive case
  moved from wrong to correct; see the table below.
- **O2: mixed-filesystem lexical prefix.** `lexicalInsensitive` still comes from
  the filesystem that `dirname(lexical)` resolves to. A case-sensitive lexical
  prefix that links into a case-insensitive filesystem therefore still causes an
  unrelated sibling that differs only in case to be excluded.

Neither can occur on the natively verified macOS/APFS scope, because APFS case
handling is per volume. O1 needs per-directory case-folding, such as Linux ext4/f2fs
`+F`. O2 needs a case-sensitive path prefix symlinked into a case-insensitive
volume, next to a sibling whose name differs only in case. Both are narrow, and
both are recorded rather than hidden.

My view, offered as input only: documenting both as explicit limitations for this
slice is proportionate. Component-specific case handling would be the complete fix
if Linux case-folding becomes a supported target. This is the human's choice, and
the task record rightly holds it pending.

### Assessment of the corrections

- **F2 (resolved).**
  - `observeCaseInsensitive` first resolves the nearest existing directory with
    `realpathSync.native`. It then `lstat`s that directory's own case-flipped
    spelling in its parent, which needs only search permission. It lists children
    only when the directory is a device root, where no own-name probe exists on
    that device.
  - Children that vanish before inspection are skipped.
  - Operational failures now carry a `Cannot establish filesystem case handling:
    <code>` reason, and an empty device root gets an explicit
    `… without a same-filesystem spelling probe` reason. This is the explicit
    failure the human chose.
  - Native rerun of my round-2 probe (`hidden` mode `0311`, boundary
    `hidden/out`):

    | Build | `outputBoundary` | `openSession` |
    | --- | --- | --- |
    | `43410a0` | `OutputBoundaryFailure … EACCES` | `project-open-failed` |
    | `0856219` | count 1 | `opened` |

  - The new regression test also covers exclusion, stable replay and session
    validation.
  - The own-name probe observes the parent directory's rule. That is sound only
    under the same-device assumption the code checks, and that assumption is O1.
- **Replay adding observations (resolved).**
  - `changed()` sets `replaying` for the duration of the replay, and
    `recordUnavailable` does not record while it is set.
  - Newly unresolvable candidates are still treated as absent during the replay,
    so the compiler-visible comparison is unchanged.
  - Native rerun of my missing-to-cycle probe:
    - At `43410a0`, `changed()` returned `false` and `revision()` advanced by 1.
    - At `0856219`, `changed()` returned `false` twice and `revision()` stayed
      unchanged.
  - The new test also checks unchanged identity and invalidation on recovery.
- **F1 (still resolved).** The cycle, unreadable and dangling `node_modules`
  fixtures open with the one-shot CLI at `0856219`: exit 0, 2 modules each.
- **Method versions.** `observed-inputs@6` and `repository-inputs@6` correspond to
  the changed boundary-observation and replay behaviour.

### Independent case-model rerun

I ran `records/validation/foundation-readiness/m3-round-2-case-model.mjs` against
both compiled builds. It reproduces the recorded
[result](../../validation/foundation-readiness/m3-round-2-case-model-result.json):

| Model case | Expected | `43410a0` | `0856219` |
| --- | --- | --- | --- |
| Mixed-filesystem lexical sibling (O2) | not excluded | excluded (wrong) | excluded (wrong) |
| Same-device insensitive suffix (O1) | excluded | excluded | not excluded (wrong) |
| Same-device sensitive sibling (O1) | not excluded | excluded (wrong) | not excluded |
| Nonempty device root | count 1 | 1 | 1 |
| Vanished device-root child | count 1 | `ENOENT` failure | 1 |
| Empty device root | explicit failure | explicit failure | explicit failure (clearer reason) |

The model substitutes an in-memory tree for `node:fs` calls in a separate process
and drives the production `outputBoundary`. It shows logic behaviour, not native
platform behaviour. I checked that its lookup applies each containing directory's
own case rule and follows links as the expected results assume.

### Non-defect observations

- In practice, the per-device cache means the first boundary resolved on a device,
  in sorted order, decides that device's rule for the pass. This is deterministic,
  so there is no ordering instability, but it is part of O1.
- The disposition and validation record state the checkpoint's status and limits
  accurately. They make no comparison-equivalence claim for `0856219`, and the
  model results are not presented as native evidence.

### Verification performed

- `npm run check` and `npm test` at `0856219`: type check passed; **282/282**
  tests passed, with zero failures, skips or cancellations.
- Native F2 and replay probes on `43410a0` and `0856219` (tables above).
- Native one-shot CLI rerun of the round-1 F1 fixtures on `0856219`.
- Independent rerun of the preserved case model against both builds.

### Unverified areas and residual uncertainty

- I did not rerun the CLI or session comparison matrices; the implementer also
  reports that they were not rerun at this checkpoint.
- There was no native case-sensitive volume, empty mount point, Linux case-folding
  or mixed-volume testing. O1, O2 and the device-root cases rest on the model and
  code reading.

### Recommendation

F2 and the replay observation are correctly resolved. F1 remains resolved. I found
no new defect. On the natively verified macOS/APFS scope, I see no remaining defect
in the M3 acquisition, lifetime or publication work.

M3 now depends on the pending human choice about O1 and O2: extend to
component-specific case handling, or record them as explicit limitations. If the
human chooses limitations, I would not need another round for that documentation
alone. If component-specific handling is implemented, a further round on that
change is warranted. Human acceptance of M3 is not inferred.
