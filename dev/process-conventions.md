# Process Conventions

This document contains human-maintained conventions governing how development work is conducted in this repository. It complements the [task protocol](task-protocol.md) and may be changed only through separate human-directed process maintenance.

<a id="documentation-links"></a>
## Documentation Links

- Prefer explicit HTML anchors, such as `<a id="unexpected-findings"></a>`, for links to sections within repository Markdown documents. Use stable, descriptive lowercase slugs with hyphens, independent of section numbering or exact heading wording, rather than relying on Markdown-generated heading anchors.
- Preserve an anchor when its section is renamed or reordered while retaining the same meaning. Adding anchors or updating links remains subject to the target document's editing and historical-record rules.

<a id="pull-request-use"></a>
## When to Use Pull Requests

Substantive implementation follows the [task protocol's pull-request requirements](task-protocol.md#publication-and-cleanup). For other work, use a PR when it provides useful review, collaboration, or a meaningful historical record. Otherwise, changes may be committed and integrated locally under human direction; a PR is not required as a matter of ritual.

<a id="pull-request-descriptions"></a>
## Pull Request Descriptions

Write pull request descriptions for a reader who needs to understand why the PR exists and what it accomplishes. Lead with the problem or purpose and the resulting behavior. Briefly state relevant verification and any material limitation, risk, or unexpected scope.

Keep the description proportionate to the change. A small PR may need only a short paragraph; a substantial one may benefit from a few bullets or sections. Summarize the final result rather than recounting implementation and review history.

Link to plans, decisions, validation reports, or review records when their detail is useful. Do not duplicate those records or turn the description into a reviewer prompt unless the human explicitly requests that. Update the description when the scope changes so it continues to describe the PR as a whole.

## Disposable Scratch Material

- Put repository-specific scratch files and directories under a descriptively named root-level directory beginning with `_`, such as `_analysis/`, `_investigation/`, or `_rendered/`. The root `.gitignore` reserves this namespace for uncommitted working material.
- `_work/TASK.md` is a governed task-drafting and handoff artifact, not ordinary scratch material. It is the sole exception to the classification in the next rule and must be handled as prescribed by the [task protocol](task-protocol.md).
- Treat all other content under root underscore directories as disposable, provisional, and non-governing, regardless of any status or approval language it contains. Material acquires a durable or governing role only when moved or incorporated into its appropriate non-underscore location and any applicable approval and commit requirements are satisfied.
- Remove scratch material that you created when it is no longer useful. Do not remove pre-existing scratch material without human direction or clear ownership.
- Do not create project-local `.codex`, `.claude`, or similar tool-specific directories for scratch work.
- Automated tests and tools may use the operating system's temporary location for ephemeral runtime artifacts that they create and clean up. This exception does not apply to agent-created investigation, planning, or other repository working material.
- Keep durable project material independent of disposable scratch material. Do not cite or link to scratch material from durable project material.
- Treat durable project material that depends on disposable scratch material as an unexpected finding and report it rather than using the scratch material as authoritative.

## Provisional Draft Material

- Use [`drafts/`](../drafts/) for canonical-shaped proposals being prepared for approval and promotion.
- Treat draft artifacts as durable but non-governing. Neither committing them nor placing approval language within them gives them the role of a plan, decision, or other canonical project document.
- Agents may use draft artifacts as planning context, but not as binding requirements.
- Keep canonical project material independent of draft artifacts. Do not cite or link to draft artifacts from canonical project material.
- Treat canonical project material that depends on a draft artifact as an unexpected finding and report it rather than using the draft artifact as authoritative.
- When promoting draft artifacts, carry the necessary context into the resulting canonical documents and link those documents to one another. Git history may preserve their shared drafting provenance.
- The human directs promotion. Content moved or incorporated into a canonical location must independently satisfy the approval requirements for that document type.

<a id="durable-notes"></a>
## Durable Non-Governing Notes

- Use [`notes/`](../notes/) for committed, human-curated exploratory material that should remain available across sessions without becoming governing or acquiring a permanent historical-record role. This includes durable planning notes, alternatives, unresolved questions, investigation results, and shelved thinking.
- Treat notes as context, not authority. They are not requirements, plans, decisions, backlog commitments, or implementation authorization.
- Add, materially revise, move, or delete notes only through explicit human direction. Notes may be consolidated or deleted without a lifecycle status; Git retains their history.
- Notes may link to canonical documents and other notes. Drafts may link to notes while planning, but promoted material must remove or replace those links and carry any required context into its durable role.
- Keep canonical and governing material independent of notes. A mutable canonical document may link to a note only as optional background when it remains complete without the note and the link is removed or updated if the note is deleted.
- <a id="historical-records"></a>Never link to notes from accepted decisions, concluded task records, preserved review findings, review handoffs after review begins, or other historical records whose lifecycle prevents later editorial repair.
