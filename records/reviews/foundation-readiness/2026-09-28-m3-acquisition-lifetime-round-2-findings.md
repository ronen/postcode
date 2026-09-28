# Foundation readiness M3 acquisition/lifetime review: round 2 findings

Record type: findings
Received: 2026-09-28
Reviewer: Claude Code (Claude Opus 5.5), independent agent session arranged by the human
Handoff: [2026-09-28-m3-acquisition-lifetime-handoff.md](2026-09-28-m3-acquisition-lifetime-handoff.md)
Round: 2
Reviewed target: `43410a0c1066389e64df657f9a850f53b3c951d3` (corrections `4656a34c0847c82d9f830a9d1587a2a28f2dd138..43410a0c1066389e64df657f9a850f53b3c951d3`)
Prior findings: [2026-09-28-m3-acquisition-lifetime-round-1-findings.md](2026-09-28-m3-acquisition-lifetime-round-1-findings.md)
Prior reviewed target: `4656a34c0847c82d9f830a9d1587a2a28f2dd138`

## Returned findings

### Scope and method

This round reviewed two corrections, both recorded in the
[disposition](2026-09-28-m3-acquisition-lifetime-disposition.md):

- the correction for round-1 F1;
- the human-directed correction for the case-insensitive missing-suffix
  uncertainty, authorized in the task follow-up `0ec793a`.

Commit `a7799e2`, which follows the target, adds only the disposition and
validation records, so it is not part of the implementation reviewed here. I did
not re-review unchanged M3 areas that round 1 accepted.

I read every source, test and documentation change from `4656a34` to `43410a0`:

- source: `output-boundary.ts`, `typescript/inputs.ts`, and the two
  method-version bumps;
- tests: the new `compiler-candidate-paths` test and the added `inputs` and
  `output-boundary` cases;
- documentation: the architecture, CLI reference and conventions updates.

I built `43410a0`, the round-1 target `4656a34` and the range baseline `ecb9f6b`
in separate disposable detached worktrees and ran native probes against them. The
main checkout was not modified except for this record.

### Actionable findings

**F2 (low): case-handling detection can refuse an explicit boundary that resolves
correctly.**

`caseInsensitive` ([`src/lib/output-boundary.ts`](../../../src/lib/output-boundary.ts))
detects case handling by listing a directory:

1. It runs `readdirSync` on the nearest existing directory.
2. It picks an entry whose case-flipped spelling is absent from the listing.
3. It compares the `lstat` results for the two spellings.

It runs for every boundary at opening and again at every validation phase. Any
operational error, or a walk that reaches the device root without a usable entry,
becomes an `OutputBoundaryFailure`. The session then refuses to open, or, during
validation, is invalidated.

Boundary establishment therefore now also depends on conditions that
`livePath` does not need:

- the directory can be listed, not just searched;
- the directory, or an ancestor on the same device, has a suitable letter-bearing
  entry;
- the chosen sibling entry still exists between `readdir` and `lstat`.

Confirmed natively (direct `openSession`): the boundary is
`<root>/hidden/out`, which exists, and `hidden` has mode `0311` (searchable, not
listable).

| Build | `outputBoundary([...])` | `openSession` |
| --- | --- | --- |
| `4656a34` | resolves, count 1 | `opened` |
| `43410a0` | `OutputBoundaryFailure: … hidden/out: EACCES` | `project-open-failed (resolve generated-output boundary: EACCES)` |

By inspection, the same refusal occurs in two further cases, neither reproduced
natively:

- **Empty mount point.** An existing, empty output directory that is itself a
  mount point has nothing to list. Its parent is on another device, so the walk
  reports `Cannot establish filesystem case handling`.
- **Sibling deleted mid-probe.** If the chosen sibling is deleted between the
  listing and `lstat`, the `ENOENT` becomes a boundary failure. At a validation
  phase, that falsely invalidates a stable session.

The reported reason, a bare `EACCES`, does not tell the user that case detection
is the step that failed.

This is narrower than F1. Both CLI boundaries live in the listable checkout, so the
CLI paths are unaffected in ordinary use. It is still a refusal of a resolvable
explicit boundary that the generated-output decision does not require, and it was
introduced by the correction.

Suggested direction: determine case handling without listing. For an existing
component with a letter in its basename, `lstat` the case-flipped spelling in its
parent; this needs only search permission, which `livePath` already requires.
Treat the same `dev`/`ino` as insensitive, and `ENOENT` or a different inode as
sensitive. Walk upward only when a basename has no ASCII letter. If case handling
still cannot be established, prefer a stated conservative default over refusal, or
at least name case detection in the failure reason. Also avoid turning a vanished
sibling into a boundary failure.

### Assessment of the corrections

- **F1 (resolved).**
  - `captureInputs` now wraps boundary evaluation for each candidate. An
    operational resolution failure records an `unavailablePath` observation and a
    recovery probe, and the candidate is reported as excluded, which makes it
    absent to the compiler. Non-operational errors still propagate, and a new test
    checks this.
  - I reran my round-1 reproductions on all three builds with the one-shot CLI:

    | Fixture | `ecb9f6b` | `4656a34` | `43410a0` |
    | --- | --- | --- | --- |
    | `node_modules/cyc -> cyc` | exit 0 | exit 2 (ELOOP refusal) | exit 0, 2 modules |
    | `node_modules/locked` mode 000 | exit 0 | exit 2 (EACCES refusal) | exit 0, 2 modules |
    | dangling `node_modules/gone` | exit 0 | exit 0 | exit 0 |

  - The new test covers both fixtures for: direct opening, check and execution;
    one-shot CLI; shell; and recovery invalidation.
  - The misattributed configuration path no longer arises for these candidates.
- **Case-insensitive missing suffix (resolved on APFS, subject to F2).**
  - Boundaries now carry a case flag for their lexical and real forms. Containment,
    distinct-boundary counting and the replay snapshot compare case-folded keys
    where the filesystem is observed to be insensitive. Stored locations keep the
    original spellings.
  - The new test covers counting, candidate exclusion before and after
    materialization, non-retargeting on materialization, and repository-capture
    exclusion. It passes natively on this APFS volume.

### Non-defect observations

- **Validation replay can now add to the captured observations.**
  - Scenario: a candidate is absent at first read and then becomes a cycle.
  - At `43410a0`, `inputs.changed()` returns `false`, as it should, because the
    compiler sees absence both times. It does so by calling `recordUnavailable`
    from inside the replay loop, and `inputs.revision()` advanced by 1 (native
    probe).
  - At `4656a34` the same replay threw `ELOOP` and invalidated.
  - The new behaviour matches "consistent absence can continue". The side effects
    are that a validation pass extends `inputs.identity()`, and that the revision
    bump discards retained incomplete materializations. A fresh session converges
    to the same observation set, so I see no wrong outcome.
  - The decision's rule against silently revising the captured basis is arguably
    not engaged, because compiler-visible inputs are unchanged. The implementer or
    human may still prefer replay to compare without recording.
- **One case flag per device.** The flag is cached per device for one resolution
  pass. Linux ext4 case-folding can be enabled per directory (`chattr +F`), so one
  flag per device could be wrong there. Native checks cover only macOS/APFS, as
  stated.
- **Mixed-filesystem lexical paths.** `lexicalInsensitive` is taken from the
  filesystem of `dirname(lexical)` after following links. A lexical prefix that
  crosses a case-sensitive filesystem through a link into a case-insensitive one is
  then compared case-folded. This could only over-exclude sibling paths that differ
  in case; it is not demonstrated in any realistic layout.
- **Documentation and dispositions.** The documentation updates accurately state:
  - the new candidate-absence behaviour;
  - the approximately two-minute cost when Git hangs;
  - the SIGINT-only cleanup guarantee.

  The disposition records every round-1 observation without expanding scope. The
  version bumps to `observed-inputs@5` and `repository-inputs@5` correspond to real
  policy changes.

### Verification performed

- `npm run check` and `npm test` at `43410a0`: type check passed; **280/280**
  tests passed, with zero failures, skips or cancellations.
- Native one-shot CLI reproduction of the round-1 cycle, unreadable and dangling
  fixtures across `ecb9f6b`, `4656a34` and `43410a0` (table above).
- A native direct-API probe of a boundary under a searchable but unlistable parent,
  on `4656a34` and `43410a0` (F2 table).
- A native `captureInputs` probe of a candidate that goes from missing to a cycle
  before replay, on both builds (observation above).

### Unverified areas and residual uncertainty

- I did not rerun the implementing agent's CLI and session comparisons or the
  regression-control reports. I relied on the full test suite and the recorded
  provenance.
- The empty-mount-point and vanished-sibling cases in F2 come from reading the code
  and were not reproduced.
- There was no native case-sensitive-volume or Linux testing. The case-sensitive
  branch of the new test was not exercised on this machine.

### Recommendation

Both round-1 corrections achieve their purpose: F1 is resolved, and the
case-insensitive suffix defect is fixed on APFS. **F2** is a narrow regression
introduced by the case-detection mechanism. It does not affect ordinary CLI use,
but it can refuse or invalidate sessions whose explicit boundaries resolve
correctly. I recommend correcting it. The likely fix is local to `caseInsensitive`,
and a brief check of that change would suffice rather than a full further round.
Whether F2 must be resolved before the M3 gate is the human's decision. Human
acceptance of M3 is not inferred.
