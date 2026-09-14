# Organize observation files by date and timestamp

Status: active
Opened: 2026-09-14
Closed:

## Task

The current code records observations `_observations/<36-character-hash>.json` which isn't very useful and quickly fills up the \_observations directory.  i'd suggest placing them in a subdirectory whose name includes  the current date, and  have each observation json file include the current timestamp.  you could prefix or suffix the directory and files names with something appropriate.  as per AGENT.md open a task record for this work.   do the work in a feature branch.

## Follow-ups

don't close the task until separate review

prepare a handoff for review

Claude's review is in place.  As you can see it's clean.  So you can close out the task.  Note the only change needed for STATUS.md i think is to update the link to the latest completed task.  Once it's all done, push and create a PR, and give me a comment to use when I merge it.

## Outcome

## Verification
