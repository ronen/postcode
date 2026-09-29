# Milestone 2: actual source-disclosure observations

Date: 2026-09-29
Implementing-agent validation, not independent review or milestone acceptance.
Target: `b408c414b041f032a8954ca450c9cbe30dded139`
Prior reviewed target: `849267193a6d75113d2deb33c8a1b481f916fa4e`
Runtime: Node.js 22.13.1 with repository-pinned dependencies.

## Authorized correction

The human explicitly included existing affected commands in this task, treating
round 2's source-escape observation as pre-existing nonconformance with the
[actual-disclosure decision](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md#record-the-actual-source-disclosure-level).
A format-aware classifier at the shared observation boundary examines supported,
bounded presentation fields for module, organization, dependency and investigram
views. It does not read files or infer source from arbitrary strings. No broader
redesign, acquisition change or new public command was required.

The request retains `presentation.sourceDetail`. An event requires actual source
locations or nonempty excerpts, not the option, an empty container, record IDs,
claim counts or omission metadata. Events retain their disclosure family in
`sourceLevel` and add explicit `sourceForms` (`locations`, `excerpts`, or both).
Organization events distinguish actual path-only, module-only or mixed disclosure.
Observation metadata changes do not change analysis or view identity methods.

Format differences are deliberate and tested. Organization JSON serializes a
captured repository-root path even when selection is missing; its location event
remains correct. Human output omits that field and emits no event for the same
empty selection. Dependency JSON embeds source records in organization support,
whereas human output from that collection shows only region/artifact paths and
claim counts. No rendering policy was changed to conceal existing disclosure.

## Verification

| Check | Result |
| --- | --- |
| `npm run check` | Passed |
| `npm run build` | Passed |
| Initial source-disclosure regression file | 2 tests passed, 0 failed/cancelled; 20.05 seconds |
| Final targeted disclosure/investigation/organization/dependency tests | 45 passed, 0 failed/cancelled/skipped; 48.56 seconds |
| `npm test` against the committed target, worktree held stationary | 369 passed, 0 failed/cancelled/skipped; 130.37 seconds |
| Whitespace and changed-document local links | Passed |

Reproduce focused checks after building:

```sh
node --test _build/test/source-disclosure.test.js _build/test/investigation-integration.test.js _build/test/organization-cli.test.js _build/test/dependency-presentation.test.js
```

The new tests drive the real shell/compiler worker and injected investigator in
both human and JSON formats, using an isolated temporary Git repository. Each
format executes a summary followed by 16 commands. Coverage includes:

- Missing investigram, module and group references; unsupported investigram
  `children` and `parents`; the request option remains recorded throughout.
- Successful module inspection with locations only, module locations and excerpts,
  organization paths, outgoing/incoming/full dependency views, and investigram
  source support. A normal inspection without source detail emits no event.
- A retained child investigram with no source support: successful inspection with
  the explicit option and an empty support container emits no event.
- Empty evidence arrays and metadata-only source containers for all four view
  families, rendered by their production renderers before observation assertions.
- Empty excerpt text with real locations; source items omitted by the human
  module renderer but serialized in JSON; source records serialized only by
  dependency JSON organization support; repository-root-only organization JSON.
- Matching rendered output in the command observation and captured CLI output,
  actual event forms, and no additional investigator execution for observation.

## Limits and standing qualification

The classifier describes the supported explicit source-detail fields and their
current rendering rules. It does not semantically detect generated prose that
quotes source; that existing interpretive limit remains. Future presentation
changes must keep this classification and regression coverage aligned.

The full run includes all 13 execution-ownership tests but does not diagnose their
historical intermittent cancellations. Validation remains qualified by that
unresolved concern; diagnosis is required before milestone 3's live, cost-bearing
adapter work. No separate isolated ownership run, baseline diagnosis, credentials,
hosted adapter or live inference was performed. The original review findings are
unchanged. See the [disposition](../../reviews/module-investigation/2026-09-29-milestone-2-disposition.md)
and human-requested addendum in the [milestone handoff](../../reviews/module-investigation/2026-09-29-milestone-2-handoff.md).
