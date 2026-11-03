# Proposed revisions to docs/implementation-conventions.md

## Rename “Source-detail presentation” to “Additional detail and evidence presentation,” preserving the old anchor

<a id="source-detail-presentation"></a>
## Additional detail and evidence presentation

## Insert before that section's existing bullets

`--more-details` exposes additional qualified information, attribution, locations and implementation mappings under the [human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary). Keep current information placement and display bounds until separately revised.

## In “Additional detail and evidence presentation,” replace the bullet beginning “Group source detail includes”

- Group attribution detail can identify captured absolute repository/group paths and repository-relative artifact paths and metadata.

## In “Additional detail and evidence presentation,” replace the three consecutive bullets beginning “Expose source detail only,” “Preserve module and export containment,” and “Expand a narrow compiler span”

- `--more-details` omits source excerpts and declaration text in text, JSON and retained presentations, including embedded views and continuations. Preserve intelligible assertions, labels and evidence even when they share a supporting record with source; retain their provenance and qualification. Machine evidence interfaces retain captured source under their own contracts.
- Preserve module and export containment in evidence organization, and distinguish forwarding declarations from semantic-symbol definitions in the acquired support and mappings.
- When acquiring evidence, a narrow compiler span can expand to its enclosing statement to make the evidence intelligible to analysis and agents, keeping it bounded and qualified.

## In “Local observation sink,” replace the bullet beginning “Include the session identifier”

- Include the existing Session identifier and command order for investigation commands; one-shot investigation uses command ordinal 1. Shell feedback preserves available correlation for the displayed result. Context-free feedback carries no invented investigation Session, View, subject or captured basis; ordinary invocation metadata does not establish that context. Keep batches self-contained and record actual output and outcome. Distinguish expected analysis failure (`failed`/`command-failed`) from an unexpected defect (`defect`/`command-defect`). A command without a View must not emit a view-produced event. Record attribution disclosures, source displays, recognized representation limits and submitted feedback distinctly from machine acquisition. Preserve historical event meanings. [[Feedback observations](decisions/human-facing-architectural-representations.md#feedback-observations)]

## In “Local observation sink,” replace the bullet beginning “Treat local observation files as potentially sensitive”

- Treat local observation files as potentially sensitive because they can contain repository context, selection inputs, documentation, qualifications, the qualified View artifact and exact rendered output. Files may contain intelligible source-derived evidence and historical source detail. Actual output, including inadequate representations, must not be erased from its observation record. Create new sink, project and date directories with mode `0700` and files with mode `0600`; leave permissions of pre-existing directories under their owner's control.

## In “CLI operation,” replace the bullet beginning “Open one configured project”

- Open one configured project per investigation Session. One-shot investigation executes one request; the terminal shell retains state through successive requests and closes on exit, EOF, invalidation or interruption. Feedback submission is observation-only: shell feedback uses available context for the latest displayed result, while one-shot feedback requires no project opening, investigator enablement or prior investigation context.

## In “Local observation sink,” replace the bullet beginning “Bind each local sink”

- For project-context observations, retain the local organization under `_observations/<label>-<key>/YYYY-MM-DD/HH-mm-ss.sssZ_<batch-uuid>.json`, using one UTC submission timestamp. Derive the label from the configuration directory basename: NFKD normalization, ASCII letters/digits/underscore/hyphen, other runs replaced with hyphens, trimmed edge hyphens, 64-character limit, lowercase, and `project` fallback. The key is the first six hexadecimal SHA-256 characters of the normalized absolute configuration path. Context-free feedback uses the selected local observation destination without opening a project or asserting a project association; its destination organization is an implementation choice. Directory grouping is not domain identity. Preserve existing files at their current paths and version new batch formats under the experimental-output policy.

## In “Local observation sink,” replace the bullet beginning “Disclose the absolute project-specific local destination”

- Disclose the absolute selected local destination on stderr, including for context-free feedback; exclude the entire observation root from evidence.

## In “Local observation sink,” add

- Initiate feedback submission when the report is made without making continued investigation wait for delivery. Preserve the distinction between submission, sink acceptance and cleanup. Disclose delivery failure without changing the displayed result or blocking continued use, including truthful reporting when the command or Session ends. Existing local acceptance and privacy rules apply. [[Feedback observations](decisions/human-facing-architectural-representations.md#feedback-observations)]

## In “Accumulation and interactive execution,” replace the bullet beginning “Run both CLI entry paths”

- Run investigation requests from both CLI entry paths through one private compiler worker, with one operation in flight and operation-tagged replies. Keep asynchronous Git child handles, exit monitoring and observation delivery in the parent. Context-free feedback submission has no analysis-worker requirement. Direct session users await opening, execution, validation and close, with Git owned in their calling process. Disposal settles pending work and prevents late publication; cleanup reports remain separately awaitable. Share execution errors at the neutral execution boundary. No public transport or stdin batch API is established. [[Execution ownership](decisions/execution-ownership-and-cancellation.md)] [[Feedback observations](decisions/human-facing-architectural-representations.md#feedback-observations)]
