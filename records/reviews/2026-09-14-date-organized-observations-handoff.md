# Independent review: date-organized observation files

Date: 2026-09-14
Status: ready for human-arranged independent review; task remains active
Branch: `codex/date-organized-observations`
Task: [active task](../tasks/2026-09-14-date-organized-observations.md)

## Review assignment and boundaries

Independently review the observation-storage naming and layout change against the
task authorization, governing observation decisions, repository conventions, and
documented behavior. Inspect the implementation and tests rather than treating the
implementing agent's verification as proof of correctness.

This document does not invoke a reviewer, claim independent acceptance, authorize
implementation changes, or close the task. Inspect and test, then return findings
without modifying implementation, governing material, task status, or the active
task record. Put the review report in
`records/reviews/2026-09-14-date-organized-observations-findings.md` and leave it
uncommitted for the human to return. Report and preserve any pre-existing worktree
changes.

## Exact scope

- Baseline: `f6e1f35395fe426baec6023be4596e483a355d20` (`main` when the task began).
- Implementation under review: `d5ee5ef83f3eb787731816603606c6a48b5d4385`.
- Task metadata through handoff request: `b6389df9232cf6736f0e678906f114e04af43615`.
- The commit containing this handoff is review metadata, not an implementation
  change. Record the full checked-out `HEAD` in the findings. If later implementation
  changes appear beyond the target, identify them and review them explicitly.

Use the implementation delta as the primary change set:

```sh
git status --short
git log --oneline f6e1f35395fe426baec6023be4596e483a355d20..HEAD
git diff --stat f6e1f35395fe426baec6023be4596e483a355d20..d5ee5ef83f3eb787731816603606c6a48b5d4385
git diff f6e1f35395fe426baec6023be4596e483a355d20..d5ee5ef83f3eb787731816603606c6a48b5d4385 -- \
  src/lib/observations.ts test/cli.test.ts README.md dev/conventions.md \
  docs/cli-reference.md docs/architecture/README.md \
  records/tasks/2026-09-14-date-organized-observations.md
```

## Governing context

Start with [AGENTS.md](../../AGENTS.md), the
[task protocol](../../foundation/task-protocol.md),
[workflow](../../dev/workflow.md), and [conventions](../../dev/conventions.md).
Read the [observation decisions](../../docs/decisions/initial-observation-recording-decisions.md),
[CLI reference](../../docs/cli-reference.md), and
[architecture overview](../../docs/architecture/README.md). The active task
preserves the exact authorization and the requirement for separate review.

The accepted decisions keep retention, migration, historical reads, and archive
policy outside the producer. This change should organize newly submitted local
files only; it should not migrate, delete, read, or otherwise manage existing flat
observation files.

## Resulting behavior to verify

For each accepted batch, the local sink reads its clock once and writes:

```text
_observations/
└── date=YYYY-MM-DD/
    └── timestamp=YYYY-MM-DDTHH-MM-SS.sssZ_<batch-uuid>.json
```

Both path components use the same UTC instant. Colons are replaced in the filename
while the ISO `T`, milliseconds, and `Z` remain, making filenames sortable,
unambiguous, and broadly filesystem-safe. The timestamp is path metadata rather
than a new field in the experimental batch envelope; the task's reference to
prefixing or suffixing names was interpreted as requesting filename content.

The root and newly created dated directories use mode `0700`; files use `0600` and
retain exclusive creation. The batch JSON and UUID identities are unchanged. The
CLI still discloses the absolute `_observations` root, and that root remains the
explicit analysis-output exclusion boundary, which covers its dated descendants.
No projection, snapshot, or structured-view semantics changed, so method versions
were not advanced.

## Review focus

- Confirm the UTC layout and filename satisfy the task without introducing a
  date/timestamp mismatch, including around midnight.
- Confirm one clock read supplies both path components and the optional clock
  seam does not weaken the `ObservationSink` boundary or normal CLI behavior.
- Check path safety, collision behavior, recursive directory creation, exclusive
  file creation, and private permissions. Distinguish behavior for newly created
  paths from the documented owner responsibility for pre-existing permissions.
- Confirm multiple submissions on one day no longer fill the `_observations` root,
  while submissions across UTC dates remain readable by the test helpers.
- Confirm the existing output exclusion still protects every dated descendant and
  that destination disclosure remains truthful.
- Check that documentation consistently describes the implemented path, UTC basis,
  permissions, and absence of producer-side retention or migration policy.
- Look for flaky time assumptions, platform-sensitive filename characters, test
  gaps, accidental behavior changes, or unauthorized changes outside the task.

## Verification to perform

Record versions, commands, results, and the exact reviewed commit:

```sh
node --version
npm test
npm run check
git diff --check f6e1f35395fe426baec6023be4596e483a355d20..HEAD
```

Use focused independent probes if a material boundary is not established by the
tests, particularly a UTC-date transition, multiple writes with the same timestamp,
pre-existing date directories, and nested output exclusion. Keep generated
observations in disposable locations and remove only review-owned artifacts.

Implementing-agent evidence: `npm test` passed all 77 tests, `npm run check` passed,
and `git diff --check` passed. The new deterministic test pins
`2026-09-14T23:45:06.007Z` and checks one clock read, the exact path, stored batch,
and `0700`/`0600` modes. Independent CLI-process coverage checks four written
batches through their date directories and validates the filename pattern. These
results are evidence to reproduce or challenge, not independent acceptance.

## Requested report and completion gate

Lead with actionable findings. For each, give severity, exact file and line,
concrete trigger or reproduction, expected versus actual behavior, and the
violated task, decision, convention, or documented contract. Distinguish in-scope
defects from optional improvements, pre-existing limitations, and questions of
interpretation. State uncertainty and any verification not performed.

If no actionable defects remain, say so explicitly and summarize the evidence and
residual limits. Recommend whether the task is ready to close. The human will
return the report for disposition; until then, the task remains **active**.
