# Module investigation: shell and session integration review findings, round 3

Record type: findings
Received: 2026-09-30
Reviewer: Claude Opus 5.5 (Claude Code session arranged by the human; not the implementing agent)
Handoff: [2026-09-29-milestone-2-handoff.md](2026-09-29-milestone-2-handoff.md) (including its human-requested addendum)
Round: 3
Reviewed target: `b408c414b041f032a8954ca450c9cbe30dded139`
Prior findings: [Round 2](2026-09-29-milestone-2-round-2-findings.md)
Prior reviewed target: `849267193a6d75113d2deb33c8a1b481f916fa4e`

## Returned findings

### Scope and method

As the human directed, this round covers only the source-disclosure correction.
I reviewed `849267193a6d75113d2deb33c8a1b481f916fa4e..b408c414b041f032a8954ca450c9cbe30dded139`,
which consists of:

- the new `src/lib/source-disclosure.ts`;
- the change to `observations.ts`;
- the new `test/source-disclosure.test.ts`;
- the associated architecture and CLI documentation.

I also read the handoff addendum and the disposition. The commits after the
target (`108cfb5`, `c44b06f`) touch only records.

I judged the change against the governing decision, [record the actual
source-disclosure level](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md#record-the-actual-source-disclosure-level).
That decision explicitly rejects inferring disclosure from the requested option.

**Correction to my round-2 wording:** I described the empty-container event as
following "established convention" and suggested deferring it. That was wrong.
The mechanical path did share the behaviour, but the governing decision prohibits
that behaviour, so it was a pre-existing nonconformance rather than a convention.

I compared the classifier's rules for each view family with the renderer that
produces that output:

- **Module inspect:** `presentation.ts` `renderView`, which shows the module
  association, module and export documentation, and export forwarding and
  defining source.
- **Organization:** `renderOrganizationView`, which shows group paths and
  artifacts, and embedded module detail only when modules exist. The human view
  does not show `repositoryRoot`.
- **Dependencies:** `renderDependencyView`, which shows item paths, spans and
  excerpts. For organization evidence it shows only region and artifact paths.
- **Investigation:** `renderInvestigationView`, which shows the source-evidence
  and repository-artifact items serialized in `sourceDetail`.

I also checked whether investigram `inspect` without `--source-detail` could show
source through its `Support` lines. It cannot: support details expand only claim
information, recorded-assertion text, claim contexts and captured-content
metadata. Module, symbol, export and organization claim information carries no
paths. Captured-content support omits `text` and `path`. Source-evidence, region
and artifact records appear only as IDs. Recorded-assertion (documentation) text
also appears in ordinary mechanical views, and there it is not treated as source
escape.

### Checks performed

- Checks ran in a detached worktree at `b408c41`, with no credentials and no
  hosted inference.
- `npm run check` passed.
- `npm test`: 369 of 369 passed, with 0 failed, cancelled or skipped (about
  133.4 s).
- I re-ran round-2 probe P6, a scratch test that is not committed. It covered
  `children @<known investigram> --source-detail`,
  `inspect @investigram-00000000 --source-detail` and, as a positive control,
  `inspect entry --source-detail`, in both JSON and Unicode. The two empty
  selections now emit no `source-escape` event, while their request records still
  show `--source-detail`. The control emits
  `declaration-locations-and-excerpts` with `sourceForms: locations,excerpts`.

### Assessment

The correction conforms to the governing decision. Events are now derived from
the source fields the chosen format actually renders, not from the requested
option. The request record keeps the requested option, so the difference between
what was asked for and what was disclosed remains auditable.

The per-format distinctions match the renderers:

- organization JSON's `repositoryRoot`, which the human view does not render;
- dependency organization-support source records, which only JSON embeds;
- module items for modules omitted from the human view, which JSON still
  serializes.

`sourceForms` distinguishes locations from non-empty excerpts. An empty excerpt
text does not count as excerpt disclosure, but its genuine location still counts.
The organization level (`organization-paths`, `organization-and-module-source` or
the module-only level) is computed from what is actually present, not from the
option's container.

The new test runs a 16-command matrix through the real shell and worker in both
formats. For every view family it checks, together:

- the request intent;
- the rendered output;
- the event count and forms;
- empty and metadata-only containers, through the real renderers and the shared
  observation boundary.

Ambiguities in classification lean toward over-reporting, which is the safe
direction. Examples: a repository-root region in dependency human output renders
as `[repository root]` but counts as a location, and every item for an exported
subject counts, whatever its role.

### New findings

None.

### Observations

- **Maintenance risk: the classifier is a second model of each renderer's
  output.** The two are linked only by the tests. If a later renderer change
  displays more source (for example, a new role or field in human output) and the
  classifier is not updated, disclosure would go unrecorded. That is the unsafe
  direction.

  The current matrix would catch changes to existing paths, but not new ones.
  Structurally, each renderer could report the source it emitted. Until then,
  anyone changing a renderer should also update `source-disclosure.ts`. It would
  help to state this cross-reference next to each renderer's source-detail section
  or in the implementation conventions. Whether and where to add it is the
  human's choice. This is not a defect in the reviewed target.
- **Other disclosure outside the classifier.** Paths that ordinary JSON views
  already carry outside `sourceDetail` (for example, the configuration path in
  analysis context) are outside this classifier. The correction did not change
  them, and I did not assess them against the decision.
- **Handoff addendum.** The handoff was extended after review began.
  `dev/review.md` normally keeps handoffs unchanged. The disposition records that
  the human explicitly requested the addendum, and it preserves the original text.
  I have noted it only for traceability.

### Cancellation concern

This run had no cancellations. Across rounds 1–3 I have seen five complete runs
without any. This does not resolve the concern. The recorded qualification, and
the requirement to diagnose it before milestone-3 live adapter work, remain in
force.

### Recommendation

The source-disclosure correction is sound and conforms to the governing
decision. It introduces no regressions in the checked behaviour. The corrections
cleared in round 2 are unaffected: this target changes only the observation
classification and its documentation.

I recommend that the human accept the milestone-2 gate. The acceptance should keep
the qualification about the execution-ownership cancellations and the requirement
to diagnose them before milestone 3.
