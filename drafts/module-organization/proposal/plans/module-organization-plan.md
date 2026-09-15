# Module organization slice

Status: in review
Created: 2026-09-15
Updated: 2026-09-15
Superseded by:

## Context

The [initial module inventory slice](../../../../docs/plans/initial-module-inventory-plan.md)
establishes the first working PostCode path from an opened TypeScript project
through qualified program records, evaluation, projections, inspection, Unicode
and structured presentations, snapshot-scoped navigation, source-detail escape,
and observation recording. This plan treats that infrastructure as established
while allowing its slice-specific representations to remain local rather than
generalizing them prematurely.

The next useful question is how the program is organized. Repository layout can
provide immediate mechanical evidence, but files and directories must not become
PostCode's universal product abstraction. A repository may contain one or more
configured projects, while an organization is one qualified account of groups,
containment, and membership. Later providers may derive different organizations
from packages, namespaces, build targets, explicit architectural declarations,
user-defined groupings, or inferred clusters. Distinct schemes must remain
distinct rather than being silently combined into a supposedly canonical tree.

This slice deliberately precedes dependency analysis. A later slice can interpret
dependencies relative to the organizational boundaries established here without
making dependency roles, re-exports, cycles, runtime behavior, or architectural
rules part of organization discovery.

The proposed consequential choices are collected in the companion
[module organization decisions](../decisions/module-organization-decisions.md).
Material under `drafts/` remains provisional and non-governing until the human
directs its promotion.

## Use narrative

A human opens one configured TypeScript project and requests an organization
view. The project-focused investigation shows the groups that contain modules
from that project, directly or through descendants, while preserving their
enclosing organizational context. The human can instead investigate the complete
repository-layout organization to see groups supported only by documentation,
data, or other currently unanalyzed artifacts.

The human sees concise group names, stable snapshot-scoped Entity IDs, direct
documentation availability, project-module presence, subgroups, and module
leaves. They inspect a group, see its direct parents, direct subgroups, direct
member modules, and salient group information, and then navigate by a displayed
Entity ID into a subgroup or module. Ordinary views remain conceptual. When exact
repository evidence is needed, source detail identifies the applicable paths and
source-level qualifications without reproducing file contents.

The result says what the repository-layout provider established, the current
worktree and configured-project context to which it applies, what was excluded or
left unanalyzed, and whether requested information was complete, partial,
unavailable, or empty. It does not claim that layout is the repository's one true
architecture.

## Intended outcome

Deliver an independently useful, read-only view of repository organization that:

- represents organizational groups as PostCode entities rather than exposing a
  filesystem browser;
- relates groups through direct containment and relates modules and other
  artifacts to their directly established groups;
- supports both a complete repository subject and a focused configured-project
  subject without creating conflicting versions of group entities;
- recognizes direct group documentation through a narrow mechanical convention;
- supports group inspection and precise navigation among groups and modules;
- preserves qualifications for membership, containment, multiple placement,
  ambiguity, unplaced modules, unanalyzed artifacts, exclusions, and unavailable
  evaluation; and
- leaves dependency-aware roles and architectural interpretation to later slices.

## Success criteria

### Organization behavior

- The repository-layout provider establishes one group for every visible,
  non-excluded directory region induced by repository artifacts, plus the
  ancestor groups required to connect those regions to the repository root.
  Empty directories without visible artifacts do not create groups.
- Directory nesting establishes direct subgroup containment. Direct and
  descendant relationships remain distinguishable.
- Every visible, non-excluded repository artifact has a direct placement in the
  provider result. Modules and supported group documentation receive the bounded
  analysis defined by this slice; other artifacts remain present with explicit
  unanalyzed status.
- `organization(repository)` returns the provider's complete group population for
  the captured repository state. `organization(project)` returns groups with a
  direct or descendant placement of a module from the selected configured project,
  including the ancestor closure needed to preserve organizational context.
- Project selection does not rewrite a retained group or filter away its complete
  direct relationships. Presentation filtering and pruning remain distinct from
  projection population.
- External modules from the Slice 1 module population are outside this
  organization rather than reported as unplaced. An in-scope project module whose
  source evidence cannot be placed within the repository organization is reported
  as unplaced with its qualified reason.
- A module with several independently established direct placements appears in
  each location with the same Entity ID. Several established placements are not
  mislabeled as ambiguity. Ambiguity remains a distinct supported outcome for a
  provider that has candidate placements but cannot establish which relationship
  holds; the initial repository-layout provider need not invent such a case.

### Repository and project boundary

- A repository is the enclosing Git worktree that supplies the evidence and
  revision boundary. A project is the opened `tsconfig.json`-configured TypeScript
  analysis scope. The slice neither discovers sibling projects nor introduces a
  separate repository selector.
- Slice 1's project-open boundary remains an operational prerequisite. A missing,
  malformed, or otherwise unusable configured project fails before an
  investigation projection is produced.
- After the project opens, repository-layout organization can remain available
  when later program-content analysis is partial or unavailable. Module placement
  and project-derived properties retain their actual evaluation status rather
  than becoming false empty results. A project-subject organization whose module
  population cannot be established may itself be partial or unavailable.
- When the opened project is not within a Git worktree, repository-layout
  organization is explicitly unavailable. A TypeScript-project-layout provider is
  deferred rather than introduced as a silent fallback.

### Repository-layout evidence

- Organization reflects the current worktree observed for the invocation, not
  `HEAD` or the index substituted for it. Present tracked artifacts and visible,
  nonignored untracked artifacts contribute; an ordinary tracked artifact
  currently deleted from the worktree does not remain present.
- Repository-controlled ignore rules are respected, including nested
  `.gitignore` files. Tracked artifacts remain evidence even when a pattern matches
  them. Ignored untracked contents do not contribute groups, documentation, or
  placement evidence.
- Effective local Git exclusions, including `.git/info/exclude` and the active
  user-global excludes, are respected so editor and platform litter does not
  become organization. Repository-authored and environmental exclusion inputs
  remain distinguishable and qualify reproducibility where material.
- PostCode-generated output is excluded through the governing explicit evidence
  boundary, independently of Git ignore behavior. No conventional directory name
  is globally excluded from repositories PostCode investigates.
- A Git submodule or nested repository is identified from applicable evidence and
  retained as one opaque, unanalyzed boundary artifact in its enclosing group.
  Its internal contents and organization are not traversed or analyzed.
- Sparse-checkout completeness is acknowledged as an unresolved boundary case
  and is not silently claimed to be solved by this slice.

### Groups, documentation, and properties

- A layout-derived group has the provider-established directory segment as its
  intrinsic name and a deterministic snapshot-scoped Entity ID. It does not need
  a generated mnemonic handle. Repeated names may produce several exact matches;
  Entity IDs provide precise selection.
- The repository-root group has no intrinsic directory-segment name. Presentations
  may label it contextually as `[repository root]`; its ID supplies precise
  identity and its checkout path remains source detail.
- A direct artifact named `README` or `README.*`, without an extension restriction,
  is recognized as documentation of its direct group. Every matching artifact is
  retained. The association establishes the existence and direct subject of the
  recorded documentation, not the truth, currency, completeness, or descendant
  applicability of its contents.
- Documentation is not inherited by subgroups or modules in this slice. Ordinary
  and source-detail views do not reproduce its contents; source detail can identify
  its captured repository path.
- Module presence is one typed, mutually exclusive group property within the
  qualified project and organization context: `direct`, `descendant-only`, or
  `none`. `none` is produced only by completed evaluation. Partiality or
  unavailability is evaluation status, not a fourth property value.
- Direct documentation availability and module presence may act as salient facets
  in filtering, annotation, grouping, or comparison. The slice does not introduce
  a universal facet schema. Counts are measures or presentation summaries rather
  than numeric facets merely by being displayed.
- Root, leaf, and branch position can be derived when useful without becoming
  badges or stored facets. Dependency-derived roles such as barrel, shared-types,
  boundary root, or group entry are absent rather than guessed.

### Inspection, navigation, and presentation

- The standard organization presentation shows group structure and module leaves
  with concise, aligned identities and annotations. It makes consequential
  filtering, pruning, repetition, and omission visible.
- A project-focused presentation may show a direct subgroup that has no direct or
  descendant project module and annotate it compactly as having no project
  modules. When rendering several levels it may retain that group while pruning
  recursive descent, provided the pruning is disclosed and the group remains
  reachable by its Entity ID.
- `inspect(group)` shows the inspected group's identity, salient established
  properties, all direct parent groups, all direct subgroups, all directly placed
  member modules, direct group-documentation availability, and a bounded account
  of other directly placed unanalyzed artifacts. Displayed parents, subgroups, and
  modules include their precise Entity IDs. Direct subgroups also carry their
  salient group annotations.
- A group with several parents can appear beneath each parent using the same
  Entity ID. A recursive rendering expands it at most once and marks later
  occurrences as references without exposing the source-level reason for the
  additional relationship by default.
- Modules without an ordinary established placement appear in visible sections
  grouped by qualified outcome or reason. Multiple placement, ambiguity,
  unplaced results, and unavailable placement evaluation remain distinguishable.
- Generic inspection preserves Slice 1's exact, honest selection behavior. An
  exact name may match several groups and may also collide with module selection;
  every match is shown, sectioned by subject kind. Paths are evidence detail, not
  selectors. The plan does not prescribe command spelling or option layout.
- Standard expansions required by the organization and group presentations are
  declared before evaluation. Rendering consumes materialized information and
  does not silently trigger another lens or analysis.

### Symlink qualification

- A symbolic link remains an artifact and its link nature and target evidence are
  retained in source detail, not displayed by default.
- An internal directory link may establish an additional parent for the target
  group without duplicating that group. A link that is broken, crosses the
  repository-provider boundary, or would introduce cyclic containment remains
  qualified link evidence without establishing the unsupported containment edge.
- Module identity follows the configured TypeScript program, not filesystem target
  identity, realpath, inode, or content equality. A module established at a linked
  path is a distinct module entity from a target-path module also established by
  TypeScript, and is placed according to its apparent path.
- Symlink handling is bounded completeness and safety behavior, not a primary
  product scenario or a general-purpose link-topology subsystem.

### Identity, evidence, and observation

- Snapshot identity extends Slice 1 with every organization-defining input and
  responsible method version, including the visible artifact manifest and
  relevant kinds, effective exclusions, generated-output boundaries, and link or
  nested-repository evidence used by claims.
- Snapshot identity does not hash irrelevant bytes merely because an artifact
  exists. Content affects identity when analysis or exposed evidence depends on
  it. Inputs retain Slice 1's first-observed, non-atomic qualification.
- Group Entity IDs, relationship records, projections, and deterministic
  structured output are reproducible within an equivalent snapshot and do not
  imply continuity across snapshots.
- Ordinary presentations remain conceptual. Source detail identifies applicable
  captured paths and source-level qualifications but does not show file contents.
  It records the actual source-disclosure level through the established
  observation path.
- Normal production of organization and group-inspection views participates in
  the established observation contract, including projection, presentation,
  selection, qualification, omission, failure, and source-escape information.

### Instrument validation

- A human can use the organization view as a useful map rather than as a renamed
  filesystem listing.
- Clean-agent evaluation receives only the qualified view and can identify the
  main groups, distinguish direct from descendant membership, select a justified
  next subject, explain what documentation and placement claims do and do not
  establish, and identify consequential omissions or unavailable information.
- The slice is exercised on PostCode and at least one unfamiliar external
  TypeScript repository. Validation evidence records the view, questions,
  evaluator context, and responses where practical without treating evaluator
  impressions as mechanically established product facts.

## Smallest representative investigation

Use a compact repository containing:

- a documented group with at least one direct project module and one subgroup;
- a project module directly inside that subgroup; and
- a sibling group containing documentation or currently unanalyzed artifacts but
  no selected-project module.

Demonstrate the complete repository organization and the focused project
organization. Inspect the documented group; distinguish direct modules from
descendant presence; navigate by displayed Entity ID from group to subgroup and
then module; and request source detail to locate documentation and repository
evidence without displaying document contents.

This central journey intentionally excludes symlinks, submodules, ambiguous or
multiple placement, and failure scenarios. Those belong to focused contract
coverage so fringe completeness behavior does not dominate the product test.

## Scope

- Extend the established analysis snapshot and program-information path with the
  repository-layout evidence required by this slice.
- Establish qualified group entities, containment, artifact placement, module
  placement, direct group-documentation association, and salient group
  properties.
- Apply organization investigations to the repository and selected configured
  project subjects.
- Extend generic inspection to groups while retaining module inspection.
- Add conceptual Unicode and structured presentations sufficient for organization
  discovery, group inspection, and navigation.
- Extend source-detail and observation behavior to the newly exposed evidence and
  views.
- Add semantic fixtures, deterministic checks, human review, and bounded
  instrument validation.
- Update implemented-behavior documentation, architecture documentation, status,
  and any other canonical material made false or incomplete by implementation.

## Non-goals

- Dependency or dependent analysis of any kind.
- Re-export, barrel, facade, shared-types, aggregation, cycle, boundary-crossing,
  entry-role, or dependency-role classification.
- Runtime behavior, tests-as-behavior analysis, architectural-rule enforcement,
  or inferred architectural intent.
- Treating repository layout as a canonical project architecture or silently
  combining it with package, namespace, build-target, user-defined, or inferred
  organization schemes.
- Package or workspace discovery, multi-project aggregation, repository selection,
  or automatic monorepository interpretation.
- A TypeScript-project-layout organization provider outside Git worktrees.
- Interpretation, summarization, excerpt selection, claim extraction, or inherited
  applicability of group documentation.
- Exhaustive semantic classification of arbitrary repository artifacts.
- Public selection or independent inspection of documentation and opaque artifact
  records.
- Path-based group selection, fuzzy selection, a universal group-handle scheme,
  or cross-snapshot entity continuity.
- A universal facet framework or generalized contextual-facet mechanism.
- Full source rendering, file browsing, editor integration, or document-content
  display.
- General submodule, nested-repository, sparse-checkout, or symlink-management
  facilities.
- A GUI, durable cache, durable investigation state, or stable public structured
  schema.
- Prescribing exact CLI syntax, record names, type shapes, internal package
  boundaries, or storage layout.

## Proposed approach

### 1. Extend captured analysis context

Define the repository evidence actually required by the provider and incorporate
it into the established first-observed snapshot model before deriving claims.
Keep repository-authored ignore evidence, environmental exclusion inputs, and
explicit PostCode-generated-output boundaries distinguishable. Preserve the
successful project-open precondition and the defect/evaluation boundaries already
established by Slice 1.

### 2. Establish repository-layout organization

Discover the complete bounded repository artifact population and derive groups,
direct containment, and direct artifact placement. Recognize README documentation
and opaque repository boundaries. Implement only the bounded link behavior needed
to avoid false containment, unsafe traversal, or duplicate group identity.

### 3. Relate configured-project modules

Relate Slice 1 module entities to groups using captured source evidence and the
layout provider's established regions. Derive descendant presence without
rewriting direct placement. Preserve multiple, ambiguous, unplaced, external, and
unavailable outcomes with their actual qualifications.

### 4. Assemble organization projections and group inspection

Produce qualified repository- and project-subject projections and extend exact
inspection to group subjects. Declare bounded standard expansions for the
information the presentations need. Reuse established records and boundaries
where they fit; do not force group properties into Slice 1's `ModuleFacet`
representation or prescribe an organization aggregate entity without a concrete
need.

### 5. Present and navigate the organization

Add a compact human-readable organizational presentation and corresponding
structured view. Show group and module identities, salient annotations, direct
relationships, placement exceptions, and consequential pruning. Keep paths and
link mechanics in source detail. Let the implementing agent choose exact command
syntax, typography, tree glyphs, wrapping, and bounded expansion limits while
preserving the observable distinctions in this plan.

### 6. Verify the vertical slice

Verify the representative journey first, then focused qualification and boundary
cases. Exercise deterministic repeatability, changed-input invalidation,
source-detail capture, and observation production. Review the result as a product
instrument on both familiar and unfamiliar repositories, and update canonical
documentation to describe implemented behavior rather than planned intent.

## Fixture and acceptance coverage

Use several focused fixtures rather than one repository containing every edge:

- the smallest representative documented group, direct module, subgroup module,
  and documentation-or-artifact-only sibling;
- complete repository versus focused project populations and ancestor closure;
- direct, descendant-only, and completed-none module presence;
- root modules, repeated group names, group/module selector collisions, and exact
  Entity ID navigation;
- multiple README matches, direct-only documentation association, and other
  unanalyzed artifact kinds;
- direct, multiple, unplaced, outside-repository, external-module, partial, and
  unavailable placement outcomes, without inventing an ambiguous-layout heuristic;
- tracked, ignored-untracked, visible-untracked, globally excluded, locally
  excluded, deleted, and generated-output evidence;
- opaque Git submodule and nested-repository boundaries;
- ordinary internal file and directory links plus broken, external, and cyclic
  refusal behavior;
- successful repository organization after project opening when later module
  analysis is partial or unavailable, and operational failure when the project
  cannot be opened;
- equivalent-process determinism and snapshot changes for every changed input
  capable of changing organization claims or exposed evidence;
- conceptual versus source-detail disclosure, including confirmation that no file
  contents appear in group source detail;
- disclosed filtering, pruning, repeated graph references, placement exceptions,
  and bounded artifact summaries in human and structured views; and
- successful observation production and visible non-blocking observation-sink
  failure for the new views.

## Risks and uncertainties

- Git's effective visibility depends partly on local and user-global exclusions,
  so equivalent repository content can yield different qualified results across
  environments. The method must retain enough context to avoid implying stronger
  reproducibility.
- Enumerating a complete visible worktree, particularly untracked artifacts, may
  be costly in large repositories. Premature caching or partial-discovery policy
  would broaden the slice; measured problems should remain visible limitations.
- A directory-derived view can easily collapse into a filesystem browser. The
  entity, property, qualification, and navigation behavior—not decorative tree
  rendering—must carry the product value.
- Group identity induced by layout is mechanically clear within a snapshot but
  does not establish cross-revision continuity or agreement with human
  architecture.
- Directory symlinks make containment a graph and can produce repeated paths.
  Bounded safe handling is required, but optimizing rare topologies could consume
  effort disproportionate to the slice's learning value.
- Documentation presence is useful context but can be overinterpreted. The view
  must not imply inheritance, correctness, completeness, or applicability to
  members merely from location and filename.
- Project modules can have source evidence outside the repository, across several
  declarations, or unavailable due to partial analysis. Placement must not become
  more certain merely to preserve a neat tree.
- The project-focused projection and complete relationships of retained groups
  can be confused with presentation filtering. Tests and view wording must keep
  subject population, expansion, and display coverage distinct.

## Deferred questions

- What semantics should a separately identified TypeScript-project-layout
  provider use when a configured project is outside a Git worktree?
- Which document conventions beyond direct `README` and `README.*` should a
  future provider recognize, and when should document content be summarized or
  interpreted?
- How should sparse-checkout and intentionally unavailable worktree content
  qualify repository-layout completeness?
- Which additional organization schemes should be added first, and what explicit
  comparison or composition semantics should relate them without silent merging?
- Which module roles and group-boundary properties become useful once dependency
  analysis is available?

## Governing-document impact

This package proposes no change to
[`docs/core-concepts.md`](../../../../docs/core-concepts.md) or
[`docs/architectural-constraints.md`](../../../../docs/architectural-constraints.md),
so it intentionally contains no proposed `docs/` revisions.

Groups and organization are concrete domain concepts needed by this slice, but
their use here does not yet demonstrate that a cross-cutting governing definition
would remain stable across later package, namespace, build-target, declared,
user-defined, or inferred organization methods. The companion decisions define
the initial behavior within their stated scope. Repeated use can justify a later
core-concept addition without making this implementation slice settle the
universal meaning prematurely.

Likewise, treating the enclosing Git worktree as the repository evidence and
revision boundary is an operational definition for the initial repository-layout
provider and configured-project invocation. It is not proposed as a universal
definition of repository that would exclude future analysis of a bare repository,
remote revision, archive, or another repository representation.

Keeping distinct organization schemes from being silently merged is a scoped
organization decision and a concrete application of the existing requirements to
preserve provenance, method, scope, and consequential distinctions without
strengthening or broadening claims. It does not prohibit a future explicitly
defined comparison or composite lens that retains those qualifications. If the
rule later proves necessary across kinds of analyses rather than specifically for
organization, generalizing it into an architectural constraint requires separate
human agreement and the normal governing-document change process.

## Implementation selections and approval gates

The implementing agent may choose exact command syntax, internal record and type
names, code boundaries, Git enumeration mechanism, presentation glyphs, ordering,
wrapping, bounded counts, and whether documentation or generic artifacts need
internal entity records. Those choices must preserve the observable contracts and
governing distinctions above.

Pause for human direction rather than embedding an assumption if implementation
would require:

- changing the governing core concepts or architectural constraints;
- superseding an accepted Slice 1 decision rather than extending it;
- weakening repository completeness or silently dropping visible artifacts;
- changing the selected-project or enclosing-repository boundary;
- introducing another organization provider or combining schemes;
- adding dependency, documentation-interpretation, or architectural-rule analysis;
- adopting a universal facet, organization, artifact, or persistence framework;
- exposing paths or file contents in ordinary conceptual views; or
- materially reducing qualification, deterministic identity, or observation
  coverage.

## Resulting decisions

The companion proposed
[module organization decisions](../decisions/module-organization-decisions.md)
records the new consequential choices for review. Existing governing decisions
remain applicable, especially:

- [Initial core-concepts decisions](../../../../docs/decisions/initial-core-concepts-decisions.md)
- [Initial module inventory decisions](../../../../docs/decisions/initial-module-inventory-decisions.md)
- [Initial projection architecture decisions](../../../../docs/decisions/initial-projection-architecture-decisions.md)
- [Qualification and evaluation constraints](../../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md)
- [Identity, evidence, and observation constraints](../../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md)
- [Initial observation recording decisions](../../../../docs/decisions/initial-observation-recording-decisions.md)
