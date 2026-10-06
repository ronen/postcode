# Separate qualified Projection construction from presentation shaping

Status: in review
Arising from: [View-construction boundary task](../../records/tasks/2026-10-05-view-construction-boundary.md)
Scope: current and future Presentations of the module, organization, dependency and investigation Projection families, including associated-investigram inspection and GUI Presentations; the eager construction strategy applies only to the existing builders

## Context

The [boundary audit](../../records/audits/2026-10-05-view-builder-boundary/REPORT.md)
found no confirmed interface analysis violation. It found an unresolved assignment
of responsibilities: builders dereference qualified information, derive totals
from evaluation populations, and select retained interpretations while also
applying CLI display limits. Renaming those builders would preserve the coupling.

The [initial projection architecture](initial-projection-architecture-decisions.md#separate-lens-requirements-evaluation-and-projection-construction)
and [interface boundary](keep-views-grounded-in-core-projections.md) establish the
conceptual roles, but do not choose a concrete boundary for these builders. The
[session decision](transient-analysis-sessions.md#retained-domain-and-storage-boundaries)
requires addressable, retained Projections without requiring every processing
stage to be separately stored.

The [retained-selection decision](investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)
already requires repeated requests to explicitly select retained interpretations
and revision relationships, while leaving current-selection representations as
implementation details. Its [composition decision](investigrams-and-progressive-investigation.md#distinguish-fixed-composition-from-investigation-provenance)
also requires retained Projections to remain unchanged. This decision chooses a
retained selection representation to meet those obligations independently of
CLI artifacts. It extends the views-and-analysis constraint with an arrangement
boundary; it does not supersede those earlier decisions or change Lens meanings.

## Decisions

### Separate qualified construction from arrangement

#### Decision

Assign responsibilities by their inputs and effects:

| Responsibility | Input and result | Owner |
| --- | --- | --- |
| Qualified selection and derivation | Materialized records and declared requirements → selected subjects, qualified relationships, revision semantics and population summaries | Interface-independent core |
| Projection construction | Selected information, relevant outcomes and supporting basis → addressable, immutable Lens result | Interface-independent core |
| Presentation arrangement | Qualified Projection content and presentation choices → displayed rows, labels, excerpts, pages, omissions and source disclosure | Presentation |
| Format-specific rendering | Arranged View → terminal text, JSON or another interface representation | Presentation |

For these Projection families, every Presentation, including a future GUI,
arranges the qualified information selected for its Projection. Arrangement
cannot independently query accumulated session state to broaden or refresh that
information. A request for newly accumulated information returns through core
selection and construction. The narrowly scoped reference-binding capability
below is the only arrangement-side session interaction in the existing builders;
it supplies reference spellings, not additional program information.

For the existing builders, use typed, immutable, eagerly resolved content values.
Construction accepts no terminal width, output format, documentation limit,
association snippet limit or other display bound. It consumes materialized
records through `ProgramRecordStore`, without invoking analysis or reading source
files. Content values expose selected records, full Claim contexts, captured
support and relevant evaluation outcomes, retaining the attribution between them.
They are internal resolved representations of Projections, not CLI View schemas
or separately stored pipeline stages. Core modules do not import CLI View types
or terminal-layout helpers. A `create*View` coordinator may remain, with core
construction and arrangement independently callable.

Eager resolution and the absence of display bounds in core construction are
choices for these existing builders, not universal constraints. The foundation's
[execution-planning rule](../../foundation/product-design.md#215-logical-model-and-execution-planning)
continues to permit presentation pushdown and lazy materialization when Lens
meaning, selected population, qualification, materialization and retained-result
semantics are preserved. A future projection-scoped access mechanism may realize
that strategy; it cannot grant arrangement independent access to accumulated
state. Lazy or pushed-down work is planned and executed through Evaluation and
core construction. Arrangement and rendering do not initiate Evaluation; an
interaction needing more information issues a new request through those
boundaries. Presentation-declared standard expansions still precede Evaluation.

##### Qualified inputs and arrangement by family

**Module inventory and inspection.** Keep selected modules, selection status,
expansion Claims and relevant outcomes. Resolve exports, symbol/origin information,
complete documentation assertions and associations, composition and captured
support. Presentation owns project-first ordering, external-module collapse,
conceptual documentation excerpts, export/documentation limits, terminal fitting
and omission counts. Source groups cover displayed Claims; collapsed modules
retain their exceptional qualifications. Separate qualified composition input
from its textual annotation.

**Organization and group/mixed inspection.** Preserve repository/project
selection, context groups, direct relationships, placement exceptions and the
embedded module Projection. Core supplies the external-module total over the
organization evaluation, explicitly identifying that basis rather than implying
a count of the inspected group. Repository exclusions and unestablished links
likewise retain their captured repository/layout basis and evaluation state.
Presentation owns tree traversal, repeated-reference rows, depth/group/module
limits and display omissions.

Core derives per-group artifact summaries over the supplied artifact placements,
module placements and documentation associations. Each summary carries its group
and materialized-support population, contributing Claim/context references,
repository and module evaluation references, placement outcome and detail state.
The resolved content includes those contexts and outcomes, including their
limitations. These summaries are qualified aggregations, not independently
established Claims about file contents or the full repository.

With partial artifact or module placement, `moduleAssociated` counts only known
associations. The set difference underlying `unanalyzed` is the remainder of
materialized artifact support with no supplied module/documentation association;
it does not establish that those artifacts lack such an association in the full
program. `opaqueBoundaries` counts captured boundary markers within that same
remainder. None of these is promoted to a complete classification merely because
its arithmetic is exact. Complete evaluation still carries capture limitations.
Core supplies classification completeness and its reasons with each summary:
classification is complete only when the relevant artifact support (including
documentation associations), module population and placement are available and
fully materialized by completed evaluation for that scope. Partial, unavailable
or otherwise unestablished supporting information leaves it incomplete. This
state is independent of how many modules presentation displays. For the existing
organization builder this is fully derivable from existing View fields: a group's
`detail` must be `materialized`, and both `evaluations.repository` and
`evaluations.placement` must be applicable, available, completed and fully
materialized. Unrequested detail remains distinct from incomplete classification.
Artifact placement and direct documentation-existence associations are produced
by the same repository/layout evaluation; there is no separate documentation
materialization outcome to omit. Placement state already incorporates module
population and placement completeness. Captured-input limitations remain attached
even to a complete classification.

Define this predicate in core and apply it to the same outcome/detail fields in
resolved content and in the self-sufficient arranged View. Rendering and JSON
consumers need no side input, hidden arrangement flag or additional JSON field.
If those inputs cease to cover a future classification, extend its explicit
qualification rather than infer completeness from displayed content.
`detail: materialized` indicates requested detail was supplied, not that all
placement is complete. Context groups with `detail: not-requested` retain their
zero-valued compatibility fields without establishing emptiness.

The existing opening summary already discloses repository and placement
materialization, including when some modules are listed. Preserve that summary.
For incomplete classification, additionally replace the stronger local
“unanalyzed” labels with neutral wording and an adjacent notice:

- Inspection: `Other captured artifacts: N · M opaque boundaries (classification incomplete)`.
- Tree count annotation, where shown: `N other captured artifacts (classification incomplete)`.
- Closing qualification: keep the configured-project scope statement and replace
  “other artifacts remain unanalyzed” with “Other captured artifacts have no
  module or documentation association established in the supplied information;
  classification is incomplete.”

“Other” describes the supplied information, not an assertion that those artifacts
are outside analysis or cannot be associated. Use the core-supplied completeness
state for the affected count and the View's closing qualification, including
incomplete artifact support or module placement; neither a nonempty module list
nor a complete-looking display can override it. Use the incomplete closing
qualification whenever a requested artifact classification supplied for the
Projection is incomplete; unrequested context-group detail does not establish
either completeness or a new artifact classification. When no groups are selected,
preserve the conservative closing notice based on repository and placement
completeness alone, including missing selectors and unavailable layout. This
qualifies the supplied evaluation basis without inventing a group classification.
Preserve complete-case wording.
Keep JSON field names, numeric calculations and existing evaluation metadata,
and document `unanalyzed` in [the CLI reference](../cli-reference.md) as the legacy
field for this qualified remainder.
Consumers must keep those counts attached to their supplied basis and outcomes.

**Dependency structure and direct children/parents.** Preserve the stored graph,
selected subjects, relationships, non-edge requests, recognition coverage,
composition and organization expansions. Discovered/project-module totals retain
the module-evaluation basis separately from the selected population. Supply all
selected occurrences and support, including those beyond JSON's 50-occurrence
limit. Opaque external subjects and unestablished roots keep their meaning.
Presentation owns component traversal, edge/occurrence/source limits, source
priority, display counts and omissions.

**Investigation and exact inspection.** Core selects the accepted result, exact
originals for inspection, and primary replacements for non-historical redisplay.
Replacements use their own composition; displaced composition and accompanying
corrections remain distinct. `InvestigationRevisions` supplies full primary,
family-primary, conflict, reconsideration and inconsistency derivations. Its
unpaged domain result owns neither the 24-row page nor the eight-item cause-path
bound. CLI arrangement applies these bounds; the investigator-context adapter
retains its own existing bounded delivery, without changing correction
eligibility, supplied context or exposure recording.

Core supplies relations as well as account sets: ordered root entries and child/
accompanying-correction adjacency preserving each original → selected account,
parent and role; displaced-composition/correction relations; correction →
provenance; navigation; and exposure forms per `(evidence, provenance)` pair.
Keep incoming entries when two originals select the same primary. Adjacency can
be shared without enumerating paths or losing the ordering needed by traversal.

Arrangement replays the existing queue and duplicate handling with the 256-account
bound. It adds displaced information only for entries that pass that bound,
selects corrections from shown accounts and the current revision page, and gathers
provenance from those accounts/corrections and displayed inconsistency reporters.
It builds support from that displayed subset and filters the supplied exposure
pairs to those collected provenances, preserving insertion order. Source detail
and reference requests follow that subset. This is filtering and arranging
core-supplied relations, not discovering or reinterpreting additional accounts.
Passing a complete provenance union straight through would change CLI output.

**Associated-investigram inspection.** Core selects all exact originals explicitly
associated with the inspected subjects, in existing acceptance order, with their
qualified revision information. Provenance mentions and evidence citations do
not add matches. Presentation owns `--after`, unknown-continuation handling, the
24-account page, 400-character snippets, 55,000-character detail budget and
omissions. Listing details use the existing first revision page. Total matches
counts the full associated population. Mechanical inspection plus this selection
is a core Projection, not an identity assembled from a bounded listing.

##### Reference-binding ownership

Request coordination owns the session binding service. Preserve its current call
schedule and each call's population/order, including calls before selection:

| Existing allocation | Owner and timing |
| --- | --- |
| All session investigrams for an `investigram-…` selector; module/group populations for subject lookup | Request coordination, at the existing lookup points before Projection construction |
| Module discovery population; organization groups then module population; dependency module basis | Coordination for mechanical construction, at the existing builder points; supply resulting maps to arrangement, including embedded module inspection |
| Investigation references determined by bounded traversal/current revision page, navigable module subjects, then summarize candidates | Investigation arrangement through the narrow binding capability, in the current sequence |
| All associated matches, including those outside the page | Coordination for association listing, after the preceding mechanical/investigation arrangement allocations and before continuation lookup/page arrangement |

The arrangement capability is `bind(ids, kind)`: allocate or return compact
spellings only for explicitly supplied IDs and kinds in the core result's
reference population. Include every ID in a bindable reference position of the
resolved content, with its validated module, group or investigram kind:

- selected and reachable accounts, including those display may omit, all
  displaced originals and their composition descendants, and associated matches;
- revision primaries/family primaries, row targets/replacements/reporters and
  every cause's complete `via` list;
- inconsistency reporters and targets, including inconsistencies on account
  bodies, and every reporter/target/replacement in displaced corrections;
- composition parents and investigation subjects, using the module binding
  capability for module subjects, plus summarize candidates and the supplied
  mechanical populations.

Claim/evidence IDs remain precise references, not compact-bindable entities.
This population authorizes binding only; it does not preallocate every member.
Validate the whole request before allocation.
The port returns only bindings, with no selector lookup, enumeration, record
retrieval, evaluation or refresh operation. It cannot accept arbitrary session
IDs outside its supplied population. Session-owned bindings remain append-only.
Rendering and parent-side usage finalization receive no such capability.

Eager resolution must not allocate every possible investigation reference.
Conversely, existing population-wide mechanical and association allocations must
not shrink to the displayed subset. Construction can use precise record IDs;
compact spellings remain a coordination/presentation concern. No bindings or
mutable binding service enter the retained Projection record.

##### Source disclosure

Holding or passing resolved core content internally is not disclosure. Any
Presentation that exposes source from that content must do so through a View
whose actual source disclosure is classified and recorded. This applies equally
to the CLI and future GUI Presentations. Classify what is actually exposed after
arrangement, including expansions or exports, rather than inferring disclosure
from held evidence or a requested option. New Presentation source fields require
corresponding classification coverage; direct core access is not an exemption.

#### Rationale

Qualified selection changes when Lens semantics or retained interpretation change;
arrangement changes with layout and disclosure policy. Explicit qualified inputs
separate those reasons for change and prevent future interfaces from independently
refreshing an earlier result. Keeping a limited binding capability acknowledges
the existing visible, stateful allocation behavior without reopening content
selection to presentation. Source recording follows actual exposure, not memory
ownership.

#### Alternatives considered

- **Use JSON Views as the core contract:** rejected because JSON already removes
  documentation, occurrences and investigation detail under display bounds. It
  is a Presentation, not a canonical or complete Projection representation.
- **Extract only terminal helpers:** rejected because qualified selection remains
  interleaved with display traversal and broad store access.
- **Give arrangement a read-only store/general resolver:** rejected because read
  access can still broaden or refresh selected information. A restricted binding
  port provides the one stateful capability needed here.
- **Allocate every reference up front or make all allocation display-dependent:**
  rejected because either changes established allocation order/populations.
- **Mandate eager resolution universally:** rejected because it would unnecessarily
  prohibit the foundation's qualified pushdown and lazy execution strategies.

#### Consequences

The existing builders must be brought into conformance with this boundary as
part of the separation; their combined responsibilities are not an exception to
the new constraint. Future Presentations of these families adopt the same
arrangement and disclosure boundary without inheriting the CLI's eager strategy.
After explicit human agreement, promote the decision and constraint additions
together in one commit only with, or after, the conforming implementation; do not
introduce a binding constraint over knowingly nonconforming current code.

Data flow retains existing process boundaries:

- **Mechanical:** request/standard expansions → Evaluation → stored Projection →
  resolve qualified content and coordinate population bindings → arrange → render.
- **Associated mechanical inspection:** construct the mechanical Projection and
  explicit associated selection → retain the composite selection record → resolve
  → arrange the mechanical portion → bind all associated matches → arrange the
  associated page → render the combined View.
- **Investigation:** in the worker, resolve the subject and evaluate/reuse when
  applicable → construct and retain the selection → resolve qualified content →
  arrange with the reference port and provisional usage → render. Exact inspection
  skips investigation execution; association binding/paging follows the account
  reference allocations.
- **Usage only:** coordinate the existing reporting request → create its
  compatibility descriptor → arrange usage reporting → render, with no retained
  program Projection. The same parent-side usage finalization applies.
- **Publication:** the worker sends a self-sufficient arranged View and its usage-
  independent identity key. The parent finalizes authoritative usage, recomputes
  the View ID and re-renders that value, without store access, selection or binding.
  Publication classifies and records actual source disclosure. Direct session
  execution uses the same construction/arrangement boundary without worker transfer.

No extra storage stage is required for resolved content, arranged Views or text.
Sharing immutable support and indexing each selected basis avoids duplicating the
whole session. Resolving undisplayed support can increase transient memory use;
this does not authorize speculative caching or new infrastructure.

Verification must cover arrangement without content-store access, binding-port
rejection of out-of-population/kind requests without partial allocation, established
allocation order including collisions, and source classification for actual
exposure. Every compact reference emitted by the existing CLI must be within the
supplied typed reference population, including displaced descendants and support
outside the displayed account bodies. Population tests must distinguish a selected
subset, evaluation-wide counts, partial/unavailable outcomes, established empty
results and unrequested
group detail. Tests beyond display bounds must compare full core content with
exact existing CLI omissions, including displayed-subset provenance/exposures.
These obligations apply to the current builders; future Presentations must also
satisfy the arrangement and disclosure constraints.

### Retain investigation selections with derived revision snapshots

#### Decision

Keep existing mechanical Projection records and resolve their exact referenced
basis without storing another content stage. Add one investigation-selection
Projection record family in `ProgramRecordStore`. Its variants cover these cases:

| Request/result | Retention and outcome representation |
| --- | --- |
| Summarize, explain, decompose or examine with accepted, limited or failed retained evaluation | Investigation-request variant references that evaluation; accepted results select its root and applicable replacements |
| Exact investigram inspection, including missing selection | Historical-inspection variant retains exact selected IDs/status and associated selection; no generating evaluation is required |
| Missing/ambiguous operation subject or unsupported subject/Lens combination, including children/parents/summarize on an investigram and follow-ups on a program subject | Investigation-request variant retains requested Lens, selector, selected IDs/status and unsupported-kind information; explicit no-evaluation outcome |
| Configuration-unavailable or communication-failure without a retained evaluation | Investigation-request variant embeds only the immutable unavailable outcome's kind, code and diagnostic; evaluation reference is absent. Provider status/body/request ID remain request/View reporting |
| Associated inspection of a mechanical Projection, including zero matches | Associated-inspection variant references the Projection whose mechanical View is shown and retains the explicit inspected subjects and full ordered association selection/revisions |
| Usage-only request | No retained program Projection; keep the current JSON `projection` field as a compatibility reporting descriptor with `lens: usage`, no selected subjects and the existing empty selection fields |

For module-only inspection routed through organization selection, the mechanical
basis is the embedded module Projection whose View is shown, not the enclosing
organization Projection. Inspected subjects still come from the organization
selection's groups plus that module Projection's modules (the groups are empty
in this case). Retain those subjects explicitly. Mixed/group inspection uses
the shown organization Projection as its mechanical basis.

The usage descriptor is not an investigation answer or new Lens. It keeps the
existing schema shape while usage remains View reporting. No new program analysis
is introduced for usage. All other rows produce an addressable retained selection
record, even when no account is available. Inline unavailable outcomes record what
this selection could expose; they are not reusable investigation evaluations and
must not prevent the existing retry of configuration/communication failures.

Choose **stored derived, unpaged revision results**, not reconstruction from a
restricted evidence closure or a session watermark. At construction, the shared
domain derivation considers session correction acceptance order, citation
propagation and provenance exemptions. Retain its full results for accounts
relevant to the selection: selected originals/primaries, reachable composition
and accompanying accounts, displaced originals and all their composition
descendants, and associated matches. Gather displaced corrections from every
such descendant as well as its root. Store primary/family-primary, conflict and
reconsideration status, all ordered revision
rows with complete proximal `via` lists, and all qualified inconsistencies and
reporter/ordinal attribution. These lists are not all possible citation paths.

Retain the ordered roots/selection relations, displacement and navigation relations
whose lookup otherwise depends on accumulated state. Refer to immutable accounts,
corrections, provenance, supporting Claims/contexts and evidence by their existing
IDs. Complete source and exposure-pair content can be resolved from those frozen
references; it need not be duplicated in the selection record. Relative correction
order is retained by the ordered derived rows and selected primaries, not absolute
session ranks. Resolving an old record reads these snapshots and fixed references;
it does not call `sessionRevisions` again or discover newly associated accounts.

The record identifies the session, versioned construction method, variant, Lens,
subjects/semantic request parameters, selection status, relevant evaluation or
inline outcome, optional mechanical basis, ordered association IDs and derived
selection/revision values. Reference validation checks referenced kinds and same-
session membership and preserves atomic immutable insertion. Attempt identifiers
that name reporting events rather than retained records are not record references:
keep them, along with `reused` and usage, in request/View reporting. An accepted
evaluation still supplies its existing valid provenance references.

Provider error status, body and request ID likewise remain invocation reporting.
Unavailable selections retain only `kind`, `code` and `diagnostic`; differing
provider reporting alone does not change their Projection identity. The View's
arrangement key includes that reporting so the exposed request result remains
distinguishable.

Derive identity from the full retained semantic payload other than its own ID,
normalizing only known reference positions. Every retained field must be
represented by or deterministically determined from those inputs. Preserve literal
selectors separately from resolved-reference positions. Selected subjects and
selection status are explicit identity inputs: a missing reference that later
binds must not collide with the earlier record. Do not include format, source
option, pagination, reference-lifetime text, usage, invocation reuse status,
absolute session counters or unrelated accumulation. Such values either belong
to View/reporting identity or are not part of this result.

A later relevant correction, inconsistency or association can change the derived
payload and create a new Projection. Earlier records remain unchanged. An unrelated
addition that leaves the selected payload unchanged leaves its ID unchanged.

#### Rationale

Storing derived revision results is the smallest direct way to preserve an answer
whose current derivation reads session-wide history. It avoids proving a reduced
citation/correction closure sufficient for replay and avoids tying identity to
every session addition. The cost is retained derived metadata, not duplicated
account prose or captured source. This explicitly chooses a current-selection
representation for the earlier retention obligations; exact TypeScript helper
names and record layout remain implementation details within this contract.

#### Alternatives considered

- **Acceptance-prefix watermark:** simple replay, but including the watermark
  changes identity on irrelevant additions; omitting it from identity can assign
  different retained payloads the same ID. Rejected.
- **Relevant correction/citation/provenance closure:** could reproduce the result,
  but requires preserving all propagation intermediates, exemptions and relative
  rank and proving closure sufficiency. Rejected in favor of storing the derived
  result already needed by consumers.
- **Store all resolved content and View stages:** rejected because it duplicates
  immutable support and imposes unnecessary schemas/lifetimes. Only selection
  and the mutable-history-dependent derived result need new retention.
- **Leave selections inside returned CLI Views:** rejected because historical
  reuse/addressability would remain dependent on an interface artifact.
- **Retain usage as an empty program Projection:** rejected because usage is
  reporting without a program subject; the existing schema descriptor is enough.

#### Consequences

The minimal record changes are a discriminated selection-record family, its union
membership, reference/shape validation and a versioned construction method. Core
construction/resolution functions and full revision derivation replace selection
inside the builders; CLI and investigator-context adapters apply their own bounds.
No persistence, generic Projection registry, new dependencies or general framework
is needed. The store's investigation-evaluation index continues to include only
evaluation records, so retaining an unavailable selection cannot change reuse.

Verification must exercise every request row above, repeat insertion of identical
records, and missing-to-bound selection without immutable collisions. Retain a
Projection, add corrections/associations and verify old reconstruction is unchanged
while a new selection reflects relevant additions. Include transitive causes,
whole-evaluation exemptions, competing correction branches, later descendants,
inconsistency reporters and irrelevant insertions that shift absolute ranks but
not relative ordering. Verify exact originals, displaced composition and the
existing bounded investigator context as well as CLI pagination. Verify the
shown module Projection is the associated basis in module-only inspection,
with the same inspected subjects; mixed/group cases retain their organization
basis.

### Separate Projection identity from presentation and reporting identity

#### Decision

Preserve CLI commands, schema names/field layout, ordering, selection,
evaluation behavior, bound module/group/investigram references, qualification,
source disclosure and omission policy. Preserve wording except for the explicitly
permitted incomplete-artifact classification change described above. The permitted
visible changes are:

- Investigation and associated-inspection Projection IDs, View IDs and responsible
  method metadata in JSON/observations, including the usage reporting descriptor's
  ID.
- Bump the shared `methods.presentation` from `postcode/presentation@26` to
  `postcode/presentation@27`. This changes all module, organization and dependency
  View IDs and reported presentation-method metadata, including complete-case
  output whose text is unchanged. Associated-inspection IDs also change through
  their base View ID. Retain the shared method instead of introducing a separate
  organization-presentation version.
- Neutral “other captured artifacts” wording with adjacent incompleteness
  disclosure in organization inspection, tree counts and closing qualification
  when core-supplied classification is incomplete. Complete-case wording, JSON
  field names/calculations and existing evaluation metadata remain unchanged.
  Document the qualified meaning of the legacy JSON `unanalyzed` field in
  [the CLI reference](../cli-reference.md).

Mechanical-only Projection and View identity formulas remain unchanged; the
shared presentation-method bump changes View ID values, not their formulas.
Mechanical Projection IDs, entity identities and investigram identities remain
unchanged.

Both investigation and associated-inspection **View formulas change**, not just
the Projection inputs they previously inherited. Use these conceptual inputs
with explicit reference normalization:

- Investigation arrangement key = presentation method + retained Projection ID
  (or usage descriptor ID) + format/source-detail choices + normalized `after`
  and `revisionPage` + reference lifetime + invocation reporting (`reused`, attempt
  identifier and any other reported request outcome not already fixed by the
  Projection).
- Final investigation View ID = presentation method + that arrangement key +
  actual usage report.
- Associated-inspection View ID = presentation method + composite Projection ID
  + base mechanical View ID + normalized association continuation (`after`) +
  reference lifetime. Format/source detail are already inputs to the base View ID.

Both formulas normalize `after` by the same rule: absent/null is an explicit
no-continuation value; a token resolving within the Projection's frozen associated
matches contributes `{ reference: identityReference(session, matched.id) }`; an
unknown token contributes `{ literal: token }` in a disjoint key space. Resolve
against supplied matches and their coordinated bindings, without a fresh session
lookup. Keep the raw token in the existing View field for compatibility, but do
not hash a resolved compact spelling. Normalize an omitted revision page to 1.

The usage descriptor identifies the session and subjectless reporting request,
not usage totals, format or pagination. Association and revision page controls
remain presentation inputs even when they affect which account details appear.
Absent and unknown continuation tokens remain explicit View inputs, not attempted
record references or changes to the associated population. A resolved token
identifies a position within that same population without narrowing it.

Carry the usage-independent arrangement key beside the View in the internal
worker result envelope and pass it explicitly to usage finalization. Do not add
it to the public JSON View schema or reconstruct it from bounded View fields.
The finalizer can replace provisional usage repeatedly without changing selection,
losing presentation/page inputs or hashing a previously finalized ID. The parent
re-renders the self-sufficient arranged View; it does not need the Projection
record, core content or reference port.

#### Rationale

The old investigation View ID inherited format, pages and lifetime through its
Projection ID. Removing those inputs without updating the View formula would
collide different presentations in observations. A separate arrangement key keeps
all of those inputs available through parent-side usage finalization while leaving
Projection identity independent of reporting. Associated inspection similarly
needs its continuation in View identity once the Projection selects all matches.

#### Alternatives considered

- **Keep the old View formulas:** rejected because format/page choices no longer
  enter indirectly through Projection IDs.
- **Keep presentation settings in Projection IDs:** rejected because it preserves
  the original coupling and gives pages of one qualified answer different domain
  identities.
- **Reconstruct final identity inputs from the arranged View:** rejected because
  bounded or empty lists do not retain every requested page choice. An internal
  arrangement key avoids public schema changes and parent-side core access.

#### Consequences

Compare full Unicode/JSON content and observations for fresh, accumulating and
reordered requests. Keep expected method/Projection/View identity differences
and the permitted incomplete-classification wording differences explicit in
comparison reports; do not erase other fields to make comparisons pass. Any
additional visible change requires separate human agreement.

Wording checks must include partial placement with some modules successfully
listed, and incomplete artifact support with completed module placement. Verify
the neutral count label, adjacent incompleteness notice and closing explanation
in inspection and tree output. Verify that displayed-module counts do not control
the choice, complete-case wording is unchanged, and JSON numeric values, field
names and evaluation metadata remain unchanged apart from permitted identity/
method differences. Verify completeness can be reproduced solely from the View's
existing evaluation/detail fields, including documentation-existence coverage.
The existing opening materialization summary remains present. Comparison reports
must explicitly account for the shared method bump in every mechanical View ID
and reported method list, including unchanged complete-case output and associated
inspection's base View; mechanical Projection and entity IDs remain unchanged.

Identity checks must show that different formats, source-detail settings, revision
pages, association continuations and reference lifetimes of one qualified result
share its Projection ID but have distinct applicable View IDs. Empty/unknown pages
also retain their presentation identity. Check that the same associated record
reached with different compact spellings under reordered allocation normalizes
to the same semantic continuation input in both formulas, while unknown literals
remain distinct from resolved references and from no continuation. Changing
authoritative usage changes the final View ID without changing its Projection
or arrangement key; repeated
finalization with the same usage is stable. First execution versus reuse keeps
reporting distinguishable without changing a retained selection. Verify that all
retained fields remain determined by Projection identity and that compact reference
allocation still matches the established CLI sequence.
