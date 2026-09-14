# Independent review findings: date-organized observation files

Date: 2026-09-14
Reviewer: independent review agent (no prior involvement in this implementation)
Handoff: [records/reviews/2026-09-14-date-organized-observations-handoff.md](2026-09-14-date-organized-observations-handoff.md)
Task under review: [records/tasks/2026-09-14-date-organized-observations.md](../tasks/2026-09-14-date-organized-observations.md) (status remains **active**; this report does not change it)

## Scope actually reviewed

- Baseline: `f6e1f35395fe426baec6023be4596e483a355d20` (`main` when the task began).
- Implementation under review: `d5ee5ef83f3eb787731816603606c6a48b5d4385` ("Organize observations by UTC submission date").
- Full checked-out `HEAD` at review time: `27c443be8cba82daf87b7325d93a45893af9d8fe` ("Prepare date-organized observations review handoff").
- Commits between baseline and `HEAD`: `4447f54` (TASK OPENED), `d5ee5ef` (implementation), `b84d2f1` and `b6389df` (TASK FOLLOW-UP, follow-up text only), `27c443b` (handoff document only).
- Confirmed no implementation changes beyond `d5ee5ef`: `git diff --stat` from `d5ee5ef`→`b6389df` touches only the task record's **Follow-ups** section (+4 lines), and from `b6389df`→`27c443b` adds only the handoff document. Neither touches implementation, tests, or governing/documentation files.
- Worktree state: `git status --short` was clean at the start of this review (the task-record edit noted in the session's initial snapshot had already been committed as part of the follow-up commits above). No pre-existing uncommitted changes were found or needed preservation.

## Verification performed

```text
$ node --version
v22.13.1
$ npm run check         # tsc -p tsconfig.json --noEmit  → clean, no output
$ npm test               # builds, then runs the Node test runner
# tests 77
# pass 77
# fail 0
$ git diff --check f6e1f35395fe426baec6023be4596e483a355d20..HEAD   # no output (no whitespace errors)
```

All three results match the implementing agent's reported evidence.

### Independent probes beyond the existing test suite

1. **Recursive-mkdir mode propagation.** Confirmed on this Node/platform that `mkdir(dated, { recursive: true, mode: 0o700 })` applies `0700` to every directory level created in the same call (both `_observations` and `date=YYYY-MM-DD` when neither exists yet), and that it leaves a pre-existing ancestor's mode untouched (tested with a pre-existing `0755` `_observations` root — the root stayed `0755`, only the new `date=...` directory was created at `0700`). This matches the documented distinction between newly created paths and pre-existing owner-controlled permissions.
2. **UTC midnight transition.** Submitted two batches through `localFileObservationSink` with fixed clocks at `2026-09-14T23:59:59.999Z` and `2026-09-15T00:00:00.000Z`. Each landed in its own correctly-named dated directory (`date=2026-09-14`, `date=2026-09-15`) with a filename timestamp matching that same instant — no date/timestamp mismatch. This is guaranteed by construction (both path components are sliced from one `toISOString()` call), not merely by the test fixture's single frozen instant.
3. **Collision/exclusivity.** Submitting the same batch id at the same fixed instant twice: the second `submit` rejected with `EEXIST` (the `wx` flag), confirming exclusive-creation collision protection survived the path restructuring.
4. **Nested output exclusion.** Pre-created `_observations/date=2020-01-01/generated.ts` under a nested-config checkout and confirmed the CLI's module inventory and snapshot were byte-for-byte identical before and after that file existed (`modules before: 1 after: 1`, `stdout identical: true`). The existing `excludedOutputDirectories` boundary (which excludes descendants via nearest-existing-ancestor resolution) protects dated subdirectories without any code change being needed for that guarantee.

## Findings

No actionable defects were found.

- The implementation change is minimal and localized to `localFileObservationSink` in `src/lib/observations.ts:46`: one clock read (`now()`), used to derive both the `date=YYYY-MM-DD` directory and the `timestamp=...` filename prefix from the same ISO string, preserving the prior exclusive-creation (`wx`), private-mode (`0600`/`0700`), and batch-UUID-suffixed naming behavior.
- The optional `now` parameter defaults to `() => new Date()` and is never supplied by `src/lib/cli.ts:114`, so normal CLI behavior is unaffected; the seam is exercised only by the new deterministic unit test, and it does not add any surface to the `ObservationSink` interface itself (`observations.ts:17-19` unchanged).
- Documentation in `README.md`, `dev/conventions.md`, `docs/cli-reference.md`, and `docs/architecture/README.md` was updated consistently and accurately describes the implemented UTC date/timestamp layout, the root-vs-dated `0700`/`0600` permissions, and the absence of producer-side retention/migration policy. No stale mention of the old flat layout remains in currently-governing documentation (historical, already-concluded task/review records under `records/` correctly remain unchanged, per the task protocol's prohibition on rewriting concluded records).
- The change stays within the accepted [observation decisions](../../docs/decisions/initial-observation-recording-decisions.md): it only affects local-sink file layout (a sink implementation detail), does not migrate or read pre-existing flat files, does not add retention/query behavior, and does not touch `ObservationBatch` content, `formatVersion`, snapshot identity, or method versions — consistent with the handoff's statement that no method version bump was required.
- Task-protocol mechanics were followed: the task was opened before implementation, the "don't close until separate review" and "prepare a handoff" follow-ups were each committed before being acted on, and the task record's **Task** text was preserved verbatim with only **Follow-ups** appended.

## Points of interpretation (not defects)

- The task text said the directory/file names could be "prefix[ed] or suffix[ed] with something appropriate" for the *files*, without an explicit path-vs-filename-content distinction. The handoff records the implementer's interpretation that this meant filename content rather than a new field inside the batch envelope. That interpretation is reasonable and matches the accepted decisions (which keep the timestamp as sink-side path metadata rather than an addition to the experimental batch envelope), but it is an interpretive choice worth the human's awareness rather than a mechanically compelled reading of the task text.

## Residual limits and things not independently verified

- I did not test on a non-POSIX filesystem (e.g., actual Windows/FAT/exFAT/SMB); the `=` and `-` characters used are conventionally safe there, but this was reasoned about rather than run on such a filesystem.
- I did not test true concurrent (parallel-process) writes racing to create the same new `date=YYYY-MM-DD` directory simultaneously; `fs.mkdir({recursive:true})` is documented as tolerant of a directory that already exists, and the existing multi-process test (four real CLI subprocess invocations) exercises concurrent-ish creation successfully, but I did not construct an adversarial race specifically at the directory-creation step.
- I did not exhaustively re-derive every prose sentence of the four updated documentation files against the implementation beyond the passages that describe layout, UTC basis, permissions, and retention/migration absence (the passages the review focus called out); I did not find any updated sentence that overstates or misstates behavior.

## Recommendation

Ready to close, from this review's perspective: verification reproduces the implementing agent's reported results, the four independent boundary probes above did not surface any defect, and documentation is consistent with the implemented behavior and with the governing decisions. The task record's own "don't close until separate review" follow-up is satisfied by this report; closing the task remains the human's decision per the task protocol.
