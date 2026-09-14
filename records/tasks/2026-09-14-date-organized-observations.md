# Organize observation files by date and timestamp

Status: completed
Opened: 2026-09-14
Closed: 2026-09-14

## Task

The current code records observations `_observations/<36-character-hash>.json` which isn't very useful and quickly fills up the \_observations directory.  i'd suggest placing them in a subdirectory whose name includes  the current date, and  have each observation json file include the current timestamp.  you could prefix or suffix the directory and files names with something appropriate.  as per AGENT.md open a task record for this work.   do the work in a feature branch.

## Follow-ups

don't close the task until separate review

prepare a handoff for review

Claude's review is in place.  As you can see it's clean.  So you can close out the task.  Note the only change needed for STATUS.md i think is to update the link to the latest completed task.  Once it's all done, push and create a PR, and give me a comment to use when I merge it.

## Outcome

The local file observation sink now stores each newly submitted batch under a UTC
date directory named `date=YYYY-MM-DD`. Each JSON filename begins with the
filesystem-safe UTC submission timestamp `timestamp=YYYY-MM-DDTHH-MM-SS.sssZ_`
and retains the batch UUID as its collision-resistant suffix. One clock reading
supplies both path components. Private directory and file modes, exclusive file
creation, batch contents, destination disclosure, and output exclusion remain
intact. No retention, migration, historical-read, or old-file management behavior
was added.

User-facing, CLI, architecture, and development documentation describe the dated
layout. `STATUS.md` now links to this task as the most recently completed task.
The independent review found no actionable defects and recommended closure. The
reviewed branch was pushed and [pull request #2](https://github.com/ronen/postcode/pull/2)
was opened against `main`.

## Verification

- Implementing-agent verification: `npm run check` passed; `npm test` passed all
  77 tests; `git diff --check` passed.
- Deterministic automated coverage verifies one clock read, the exact UTC path,
  stored batch, timestamped filename pattern, and `0700`/`0600` permissions.
- The [independent review](../reviews/2026-09-14-date-organized-observations-findings.md)
  reproduced the type check and all 77 tests on Node 22.13.1, found no whitespace
  errors, and independently probed UTC-midnight rollover, collision/exclusive
  creation, recursive-directory permissions, and nested output exclusion.
- Documentation links and the minimal `STATUS.md` update were checked locally.
- GitHub confirmed pull request #2 is open from
  `codex/date-organized-observations` into `main`.
