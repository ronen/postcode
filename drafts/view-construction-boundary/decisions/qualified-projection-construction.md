# Separate qualified Projection construction from presentation shaping

Status: in review
Arising from: [View-construction boundary task](../../records/tasks/2026-10-05-view-construction-boundary.md)
Scope: the existing module, organization, dependency, investigation and associated-investigram builders

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
stage to be separately stored. This decision applies those commitments; it does
not replace them or change the governing definitions and constraints.

## Decision

### Core constructs qualified information; presentation shapes its exposure

Separate the responsibilities by their inputs and effects:

| Responsibility | Input and result | Owner |
| --- | --- | --- |
| Qualified selection and derivation | Materialized records and declared requirements → selected subjects, qualified relationships, revision semantics and population summaries | Interface-independent core |
| Projection construction | Selected information, relevant outcomes and supporting basis → addressable, immutable Lens result | Interface-independent core |
| Presentation arrangement | Qualified Projection content and presentation choices → displayed rows, labels, excerpts, pages, omissions and source disclosure | Presentation |
| Format-specific rendering | Arranged View → terminal text or experimental JSON | Presentation |

The first two responsibilities can share functions and records. Arrangement and
rendering can likewise share a module where appropriate. The boundary isolates
Lens semantics and qualified derivation from changes to display policy, rather
than prescribing four packages or four stored stages.

Provide a typed, immutable, format-independent content value for each existing
Projection family. It exposes the selected domain records, relevant outcomes,
full Claim contexts and captured supporting evidence, plus the specific derived
information that family needs. It is a resolved representation of a Projection,
not another Lens, a second analysis result, or a new public serialization schema.
It must retain relationships between Claims, contexts, inputs and evidence;
flattening qualification into display prose is insufficient at this boundary.

Core construction accepts no terminal width, output format, CLI documentation
limit, association snippet limit, or other display bound. It consumes only
materialized inputs through `ProgramRecordStore`. It neither invokes analysis nor
reads source files. Presentation requirements still declare standard expansions
before Evaluation; obtaining a different expansion can change materialized
information, whereas choosing how to show the same information cannot.

Arrangement consumes these values without a general store handle or a callback
that can query subsequent session state. It may count, filter, sort and group
the supplied populations, preserving their scope and materialization. It cannot
look up an extra evaluation or discover additional interpretations. A public
`create*View` convenience function may still coordinate construction and
arrangement, but callers can use the core result independently of CLI code.
Core modules do not import CLI View types or terminal-layout helpers.

### Preserve the existing Lens questions and populations

**Module inventory and inspection.** Keep the existing selected modules,
selection status, expansion Claims and relevant evaluation outcomes. Resolve
exports, symbol and origin information, documentation associations, complete
recorded assertions, composition properties and captured source support before
display shaping. Project-first ordering, external-module collapse, conceptual
documentation excerpts, export/documentation limits, terminal height fitting
and omitted-text accounting belong to arrangement. Source groups expose only
support for the Claims actually displayed, as today. Collapsed external modules
retain their exceptional qualifications.

**Organization and group/mixed inspection.** Preserve repository versus project
selection, context groups, direct relationships, selected module placements and
the embedded module Projection. Core supplies the evaluation-wide external-module
total with its organization-evaluation basis; it is not a total over the
selected group or displayed rows. Core also derives each group's existing
artifact classifications from its selected artifact placements, module
placements and documentation associations. These are classifications of captured
support, not a new analysis of file contents. Group detail remains explicitly
`materialized` or `not-requested`; the latter's existing zero-valued CLI fields
must not become evidence of established emptiness.

Repository exclusion and unestablished-link counts retain their captured
repository/layout basis and relevant evaluation state. They remain repository-wide
disclosures. Tree traversal, repeated-reference rows, depth/group/module bounds,
placement-exception arrangement and display omission counts belong to
presentation. Display pruning must not remove information from the core result.

**Dependency structure and direct children/parents.** Preserve the stored graph,
selected subjects, relationships, non-edge requests, recognition coverage,
composition and organization expansions. Core supplies discovered/project-module
counts from the dependency evaluation's module basis, separately from the
selected module population. The full core result includes all selected
occurrences and their support, including material beyond JSON's current
50-occurrence display limit. Opaque external subjects and unestablished roots
retain their current meaning. Component traversal, edge/occurrence/source bounds,
source prioritization and displayed-population counts belong to presentation.

**Investigation lenses and exact inspection.** Move retained-account selection
and Projection construction out of `createInvestigationView`. Preserve selection
of the accepted result, exact originals for inspection, and primary replacements
for non-historical redisplay. A replacement uses its own composition. Displaced
composition and accompanying corrections remain separately identifiable; no
displaced children are spliced into the replacement.

`InvestigationRevisions` remains the shared domain implementation of primary and
family-primary selection, conflicts and citation-derived reconsideration. Expose
its complete qualified derivation separately from the existing paged disclosure.
Preserve its bounded evidence-delivery adapter for investigator context; moving
CLI pagination must not change correction eligibility or context delivery.
The core result supplies the relevant correction relationships, cause paths,
inconsistencies, navigation and provenance exposure forms. It preserves the
original evaluation outcome and does not equate a warning with established error.

The 256-account/metadata bounds, 24-row revision pages and eight-item cause-path
disclosure are presentation policy. Preserve their existing traversal order and
omission semantics in the CLI, including omission of a branch when its account
is not displayed. These bounds do not narrow the underlying Lens question.

**Associated-investigram inspection.** Core selects exact originals by explicit
association with the inspected subjects and supplies current qualified revision
information at construction time. Provenance mentions and evidence citations
remain insufficient to create associations. Presentation owns `--after`, the
24-account page, 400-character prose excerpts, 55,000-character detail budget,
unknown-continuation handling and all corresponding omissions. Total matches
counts the full associated population. The augmented inspection is a core
Projection combining its mechanical basis with that associated selection;
attaching a presentation-shaped listing does not construct its identity.

**Usage and unsupported requests.** Usage stays View reporting, separate from
the retained interpretation's identity. Missing/ambiguous selections, unsupported
subject/Lens combinations, unavailable investigators and failed or limited
evaluations preserve their existing outcomes. No new investigation is triggered
by construction, pagination or rendering.

### Representation, retention and identity

Keep the current mechanical Projection records. Resolve their content through
small family-specific core functions using the exact referenced evaluations and
expansions. Broader counts explicitly identify their supporting evaluation or
captured evidence; they do not silently enlarge the Projection's selected
population. These resolved values need not be stored as additional records.

Add a retained investigation-selection Projection record, with variants for an
investigation request and for associated inspection of a mechanical Projection.
It identifies the Lens, subjects and semantic parameters, selected evaluation
outcome where applicable, optional mechanical basis, selected accounts and
relevant ordered revision/association basis. It retains enough immutable
information to reconstruct the same qualified selection after later session
accumulation. Extend the record union and store validation for its referenced
kinds, session consistency and immutable insertion. Empty or unavailable results
still have a qualified Projection with their relevant outcome.

This one additional record family addresses the concrete absence of retained,
addressable investigation selections. It does not require storage of resolved
content, arranged Views, pagination results or rendered output in the program
store, nor does it introduce persistence or a generic Projection registry.

Use a distinct versioned investigation-projection method. Projection identity
depends on the selected qualified result and its relevant revision/association
basis, not output format, source disclosure, reference-lifetime messaging, usage,
page selection or display omissions. A new correction or association may produce
a new Projection on a later request; it cannot mutate an earlier result. Do not
key an unrelated session addition into a Projection unless it changes information
or qualification relevant to that result.

View identity includes the Projection, presentation choices and the applicable
reporting context. Continue normalizing references only in identified reference
positions. Preserve existing module, group and investigram bindings, including
the established allocation ordering for CLI-visible references; eager resolution
must not silently allocate additional compact references ahead of displayed ones.
Core consumers can use the existing precise domain record IDs.

### Compatibility

Preserve CLI commands, JSON schema names and field layout, text wording,
selection, evaluation reuse and outcomes, entity/investigram references,
qualification, source-disclosure behavior, output ordering, bounds and omissions.
JSON remains a Presentation: it already bounds documentation, occurrences,
investigation metadata and source evidence. It is not a complete or canonical
Projection contract.

The intentional externally visible change is to investigation and associated-
inspection Projection IDs and dependent View IDs in JSON/observations. Different
formats or pages of the same selected qualified result can share a Projection
ID, while their View IDs identify the different presentations. Responsible
identity method metadata will change with the record/identity semantics. No
entity or investigram identity is regenerated for this change. Mechanical-only
Projection and View identity formulas need not change.

Do not normalize away this change in equivalence checks: report the expected
identity differences explicitly and compare all other content. Any additional
visible change requires a separate explanation and human agreement before
implementation.

## Smallest implementation surface

1. Add family-specific Projection-content types and construction functions beside
   the existing projection modules. Preserve each domain's meaningful differences;
   do not build a universal View model or copy the CLI schemas into core types.
2. Split `createView`, `createOrganizationView` and `createDependencyView` into
   optional coordination plus pure arrangement over those inputs. Split the
   qualified composition input from its display annotation as part of this work.
3. Add investigation Projection construction and the retained record variant
   described above. Separate full revision derivation from paged disclosure and
   split association selection, page arrangement and rendering. Preserve existing
   evidence-delivery behavior through its current bounded adapter.
4. Update session coordination to construct the investigation/associated
   Projection before arranging its View. Retain existing worker and publication
   boundaries, including parent-side usage finalization.
5. Update descriptive architecture and affected implementation/CLI identity
   documentation. Resolve the named backlog entry after verification. Do not
   revise foundation, development-process instructions or unrelated backlog work.

Exact helper names and colocating types with their implementation are routine
implementation choices. New packages, dependencies, analyses, Lenses, generic
presentation frameworks and persistent state are outside this decision.

## Alternatives considered

**Use JSON Views as the core Projection contract.** This minimizes some initial
conversion work, but imports schema versions, documentation omission policy,
source disclosure and JSON's own display limits into core semantics. A later
interface would have to recover information already removed. Rejected.

**Only move terminal fitting and format switches into helpers.** This is smaller
in lines changed, but leaves interpretation selection and broad population
derivations coupled to display traversal and gives presentation continued access
to arbitrary accumulated store contents. It does not resolve the role question.
Rejected.

**Give presentation a read-only store or a general record resolver.** Read-only
access prevents mutation, but does not constrain populations or freeze a selected
interpretation against future corrections. A projection-scoped support resolver
could be a later execution optimization; it is unnecessary for these eager
builders. Use explicit qualified inputs now.

**Store every fully resolved Projection-content and View stage.** This would
duplicate immutable support and require additional schemas and lifecycle rules.
Mechanical Projections already retain their basis. Only investigation selections
need a new retained record family. Reject mandatory storage of other stages.

**Keep investigation selections solely inside returned Views.** This avoids new
store validation, but preserves the current absence of a core-addressable
selection and makes reuse depend on an interface artifact. Reject it in favor of
the small retained selection record, without storing rendered or bounded stages.

## Consequences and verification

Resolving complete selected support may increase transient memory use relative
to resolving only displayed items. Share immutable records and prepare indexes
once per selected basis; do not clone the entire session or enumerate every
correction path. No performance framework or new caching policy is required.

Verify these boundaries with representative fixtures and known expectations:

- Construct core content without CLI presentation imports; arrange multiple
  formats/pages from one result without store access or further Evaluation.
- Verify evaluation-wide counts in single-group and single-module requests,
  partial/unavailable versus established-empty outcomes, and context groups
  whose detail was not requested.
- Exercise content beyond existing display limits: exports/documentation,
  organization depth and placements, dependency components/occurrences/evidence,
  association pages and investigation/revision bounds. Check both retained core
  information and exact CLI omission disclosures.
- Preserve exact-original inspection, primary/family-primary distinctions,
  displaced composition, accompanying corrections, conflicts, reconsideration,
  association roles and correction-context delivery.
- Retain an investigation Projection, add a relevant correction/association,
  and verify the earlier Projection remains unchanged while a new construction
  reflects the addition. Unrelated accumulation must not broaden selection.
- Compare fresh, accumulating and reordered requests in Unicode, JSON and
  observations using the repository's reference-aware comparison policy. Keep
  expected identity-method changes explicit; preserve source disclosure and
  reference allocation behavior.
- Run `npm run check` and `npm test` after implementation, alongside the focused
  checks above, and inspect the final diff and affected documentation.

This is a proposal awaiting explicit human agreement. No implementation or
backlog resolution is established by committing this draft.
