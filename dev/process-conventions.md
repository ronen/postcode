# Process Conventions

This document contains human-maintained conventions governing how development work is conducted in this repository. It supplements the adopted [baseline conventions](../foundation/baseline-conventions.md) and may be changed only through separate human-directed process maintenance.

## Disposable Scratch Material

- Put repository-specific scratch files and directories under a descriptively named root-level directory beginning with `_`, such as `_analysis/`, `_investigation/`, or `_rendered/`. The root `.gitignore` reserves this namespace for uncommitted working material.
- `_work/TASK.md` is a governed task-drafting and handoff artifact, not ordinary scratch material. It is the sole exception to the classification in the next rule and must be handled as prescribed by the [task protocol](../foundation/task-protocol.md).
- Treat all other content under root underscore directories as disposable, provisional, and non-governing, regardless of any status or approval language it contains. Material acquires a durable or governing role only when moved or incorporated into its appropriate non-underscore location and any applicable approval and commit requirements are satisfied.
- Remove scratch material that you created when it is no longer useful. Do not remove pre-existing scratch material without human direction or clear ownership.
- Do not create project-local `.codex`, `.claude`, or similar tool-specific directories for scratch work.
- Automated tests and tools may use the operating system's temporary location for ephemeral runtime artifacts that they create and clean up. This exception does not apply to agent-created investigation, planning, or other repository working material.
- Keep durable project material independent of disposable scratch material. Do not cite or link to scratch material from durable project material.
- Treat durable project material that depends on disposable scratch material as an unexpected finding and report it rather than using the scratch material as authoritative.

## Provisional Draft Material

- Use [`drafts/`](../drafts/) when provisional planning material is worth preserving in Git for review, comparison, or continuity across sessions.
- Treat draft artifacts as durable but non-governing. Neither committing them nor placing approval language within them gives them the role of a plan, decision, or other canonical project document.
- Agents may use draft artifacts as planning context, but not as binding requirements.
- Keep canonical project material independent of draft artifacts. Do not cite or link to draft artifacts from canonical project material.
- Treat canonical project material that depends on a draft artifact as an unexpected finding and report it rather than using the draft artifact as authoritative.
- When promoting draft artifacts, carry the necessary context into the resulting canonical documents and link those documents to one another. Git history may preserve their shared drafting provenance.
- The human directs promotion. Content moved or incorporated into a canonical location must independently satisfy the approval requirements for that document type.

## Durable Non-Governing Notes

- Use [`notes/`](../notes/) for committed, human-curated exploratory material that should remain available across sessions without becoming governing or acquiring a permanent historical-record role.
- Treat notes as context, not authority. They are not requirements, plans, decisions, backlog commitments, or implementation authorization.
- Add, materially revise, move, or delete notes only through explicit human direction. Notes may be consolidated or deleted without a lifecycle status; Git retains their history.
- Notes may link to canonical documents and other notes. Drafts may link to notes while planning, but promoted material must remove or replace those links and carry any required context into its durable role.
- Keep canonical and governing material independent of notes. A mutable canonical document may link to a note only as optional background when it remains complete without the note and the link is removed or updated if the note is deleted.
- Never link to notes from accepted decisions, concluded task records, preserved review findings, review handoffs after review begins, or other historical records whose lifecycle prevents later editorial repair.
