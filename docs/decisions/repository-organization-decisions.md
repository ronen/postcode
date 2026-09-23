# Repository organization slice decisions

Status: partially superseded
Decided: 2026-09-15
Arising from: [Repository organization plan](../plans/repository-organization-plan.md)
Scope: the initial repository-layout organization slice
Superseded in part:

- [Represent groups and placement with qualified identities and relationships](#represent-groups-and-placement-with-qualified-identities-and-relationships) is replaced by [Stable reference bindings within a session](transient-analysis-sessions.md#stable-reference-bindings-within-a-session), [Retained domain and storage boundaries](transient-analysis-sessions.md#retained-domain-and-storage-boundaries).
- [Extend snapshot identity only with claim-relevant organization inputs](#extend-snapshot-identity-only-with-claim-relevant-organization-inputs) is replaced by [Stable inputs as the session precondition](transient-analysis-sessions.md#stable-inputs-as-the-session-precondition), [Retained domain and storage boundaries](transient-analysis-sessions.md#retained-domain-and-storage-boundaries).
- [Keep organization schemes explicit and separate](#keep-organization-schemes-explicit-and-separate) is replaced by [Retained domain and storage boundaries](transient-analysis-sessions.md#retained-domain-and-storage-boundaries).

## Context

The initial module inventory established qualified TypeScript module entities,
snapshot-scoped navigation, generic inspection, bounded standard expansions,
source-detail escape, and observation recording. The next slice needs to expose
where modules and other repository artifacts are organized without treating
filesystem paths as universal product identity or presupposing one canonical
organization scheme.

Repository layout is useful initial mechanical evidence. It can establish groups,
containment, documentation locations, and module placement before dependency
analysis exists. It cannot by itself establish architectural purpose, dependency
roles, documentation truth, or correspondence with future package, namespace,
build, declared, user-defined, or inferred organizations.

## Decisions

### Expose repository organization rather than only module folders

#### Decision

Treat the slice as an investigation of organizational structure within a
repository. Groups may contain subgroups and may directly contain or associate
modules, documentation, and other repository artifacts. Modules remain the
primary analyzed program subjects, while unsupported artifact kinds remain
present with explicit unanalyzed status.

A repository is the Git worktree evidence and revision boundary. A configured
TypeScript project is one compiler-defined analysis scope within that repository.
Do not use repository and project interchangeably, and do not assume a repository
contains exactly one project.

#### Rationale

A module-only hierarchy would discard documentation-only and data-only regions
and would make later artifact analysis artificially difficult. Repository and
project separation also matches single-project and multi-project repositories
without requiring project discovery in this slice.

#### Alternatives considered

- Organize only modules: rejected because organizational regions can be meaningful
  before or without a module placement.
- Call the complete Git worktree the project: rejected because the configured
  TypeScript project is already a narrower, established subject.
- Analyze every artifact kind now: rejected because recognition and placement are
  useful without speculative semantic analysis.

#### Consequences

- A group can exist with no module established by the selected project.
- Whether a group has direct or descendant project modules becomes a useful
  qualified property rather than a criterion for underlying existence.
- Future slices can add analysis for currently opaque artifacts without changing
  the initial meaning of organization.

### Keep organization schemes explicit and separate

#### Decision

Identify the method that establishes an organization. The initial method is
repository layout. Future package, namespace, build-target, explicitly declared,
user-defined, or inferred organizations must remain distinct qualified results;
do not silently merge them into one canonical hierarchy.

The plan does not require a product-level organization aggregate entity or
prescribe how the implementation bundles organization information within a
snapshot. Groups, claims, method context, and projection identity must retain
enough qualification to prevent accidental combination.

#### Rationale

Several organizational accounts may each be valid for different questions. A
single silently combined structure would hide disagreement, overstate
containment, and make provider evidence difficult to explain.

#### Alternatives considered

- Establish one canonical organization model immediately: rejected because no
  evidence supports preferring layout over future schemes in every investigation.
- Introduce a fully generalized organization-provider framework now: rejected as
  premature architecture beyond the one implemented method.
- Make versioning require a dedicated organization entity: left as implementation
  design because snapshot and Claim context can preserve the necessary semantics
  without settling that representation in the product model.

#### Consequences

- Repository layout is an identified provider result, not universal truth about
  the program's architecture.
- Later provider comparison or composition requires explicit semantics and cannot
  be smuggled into an implementation refactor.

### Establish complete bounded repository-layout evidence

#### Decision

For an opened project within a Git worktree, establish the complete directory
hierarchy induced by the current worktree's Git-visible, non-excluded artifacts.
Every such artifact receives a direct group placement, and every containing
directory region and required ancestor receives a group. Empty directories do not
constitute evidence.

Include present tracked artifacts and visible nonignored untracked artifacts.
Respect repository `.gitignore` files, `.git/info/exclude`, and active user-global
exclusions while distinguishing environmental inputs from repository-authored
evidence. A tracked artifact remains included despite matching an ignore pattern;
an ordinary tracked artifact currently deleted from the worktree is absent.
Apply PostCode's explicit generated-output evidence boundary independently of Git
ignore rules.

Identify a Git submodule or nested repository as an opaque boundary artifact from
the evidence available to the enclosing repository. Do not traverse or analyze
its internal organization. Sparse-checkout completeness remains deferred and
must not receive an unsupported guarantee.

#### Rationale

Completeness relative to a bounded, explainable provider makes
`organization(repository)` testable and useful. Including unignored worktree
artifacts reflects what the opened TypeScript project can actually observe, while
effective exclusions prevent ordinary local litter from becoming product
organization.

#### Alternatives considered

- Use only committed `HEAD` contents: rejected because it can disagree with the
  source state being analyzed.
- Use only tracked artifacts: rejected because configured projects routinely
  analyze legitimate uncommitted work.
- Treat all ignored content as generated output: rejected because Git ignore
  policy and PostCode's evidence boundary have different meanings.
- Traverse nested repositories and submodules: rejected as disproportionate and
  as a violation of the selected repository boundary.
- Infer empty directories as groups: rejected because Git does not preserve them
  and they contain no qualifying artifact evidence.

#### Consequences

- The result is complete only relative to the identified provider, worktree, and
  exclusion environment.
- Local exclusion policy can change the snapshot and may limit reproducibility
  across environments.
- Opaque boundaries remain visible without importing another repository's
  organization.

### Provide repository- and project-subject organization projections

#### Decision

Support organization as a lens over both the repository and the selected
configured project without creating two versions of each group.

`organization(repository)` contains the complete provider-established group
population. `organization(project)` contains groups having direct or descendant
placement of a module from the selected project, including the ancestor closure
needed to preserve that placement's context. A retained group's complete direct
relationships and evidence are not rewritten by project selection.

Presentation may transparently prune, compact, or filter the projected
information, but consequential omission must remain visible and must not be
confused with lens population.

#### Rationale

The repository projection tests provider completeness and exposes meaningful
non-module regions. The project projection provides a useful focused map. Treating
project focus only as invisible presentation filtering would make the question
asked by the lens unclear; filtering the data associated with group entities
would instead create context-dependent versions of the same group.

#### Alternatives considered

- Provide only the project-focused result: rejected because provider completeness
  and documentation- or artifact-only groups would be inaccessible.
- Provide only the repository result and make project focus a presentation option:
  rejected because repository and configured project are different subjects.
- Filter each retained group's subgroup relationships to the project population:
  rejected because it would make one group entity carry different underlying
  containment depending on the selecting lens.

#### Consequences

- An inspected group can show direct subgroups outside the project-focused
  population, with their project-module status qualified.
- The same module-presence predicate can support project population and
  presentation focus while those uses remain conceptually distinct.
- Exact command syntax and presentation controls remain implementation choices.

### Represent groups and placement with qualified identities and relationships

#### Decision

Represent groups as PostCode entities. A layout-derived group has its directory
segment as the provider-established intrinsic name and a deterministic,
snapshot-scoped Entity ID; it does not require a generated mnemonic handle. The
repository root has no segment name and receives only a contextual presentation
label. Paths remain source evidence rather than selectors or universal group
identity.

Establish direct subgroup containment, direct artifact placement, and direct
module placement as qualified relationships. Descendant membership is derived
and remains distinct from direct placement. Show all independently established
placements for a module using the same module Entity ID. Keep multiple placement,
candidate ambiguity, qualified unplaced results, unavailable placement analysis,
and modules outside the organization population distinct.

Inspection shows the Entity ID of every displayed entity and extends exact
selection honestly across groups and modules. Repeated names and cross-kind
collisions produce every exact match rather than implicit disambiguation.

#### Rationale

Names and paths are convenient but do not provide unique conceptual identity.
Qualified relationships preserve evidence and allow tree or graph presentations
without making either depiction canonical. Honest multi-match selection extends
the navigation contract already established for modules.

#### Alternatives considered

- Use repository-relative paths as product identity and selectors: rejected
  because paths are provider evidence and would turn layout into the universal
  abstraction.
- Generate group mnemonics immediately: rejected because segment names plus
  precise displayed IDs provide sufficient initial navigation.
- Force one placement per module: rejected because ambient or multi-declaration
  modules can have evidence in several groups.
- Treat every repeated placement as ambiguity: rejected because several
  independently established relationships are not uncertain candidates.

#### Consequences

- Groups can be navigated precisely within a snapshot despite repeated names.
- Cross-snapshot continuity remains a separate future relationship.
- Presentations can render organization as a tree where possible while preserving
  graph identity and qualified exceptions.

### Recognize direct group documentation without interpreting it

#### Decision

Recognize every direct artifact named `README` or `README.*`, regardless of
extension, as documentation associated with its direct group. Establish that the
document exists and is associated by this convention; do not establish that its
contents are true, current, complete, inherited by descendants, or applicable to
member modules.

Show direct documentation availability as salient group information. Do not
select excerpts or reproduce document contents in this slice. Explicit source
detail may identify captured document paths so the human can locate the source.
Other filenames remain ordinary unanalyzed artifacts until a later provider or
convention recognizes them.

#### Rationale

README files are a common, mechanically recognizable source of group context.
Treating their contents as group truth or inheriting them through the hierarchy
would require interpretation that this slice deliberately avoids.

#### Alternatives considered

- Restrict recognized documents to Markdown: rejected because the naming
  convention, not the extension, supplies the initial association evidence.
- Display an automatically selected excerpt: rejected because useful selection
  and applicability cannot be established mechanically here.
- Inherit ancestor documentation automatically: rejected because location alone
  does not establish applicability to descendants.
- Hide all non-module artifacts: rejected because it would make repository
  organization incomplete.

#### Consequences

- Documentation-only groups remain visible in repository organization.
- Future content extraction or interpretation can add separately qualified claims
  without redefining the initial association.
- Documentation and artifact records may be internal entities if concretely
  useful, but public selectors and independent inspection are not required.

### Use typed group properties without generalizing the facet mechanism

#### Decision

Use one mutually exclusive module-presence property for groups within the
qualified project and organization context: `direct`, `descendant-only`, or
`none`. Emit `none` only after completed evaluation establishes no applicable
placement. Keep partial and unavailable evaluation orthogonal to the property
value.

Treat module presence and direct documentation availability as facets when they
serve as compact classification dimensions. A facet is the role played by a
property under the governing core concepts, not a requirement to reuse Slice 1's
string-tag `ModuleFacet` representation or create a universal schema. Counts are
measures, not numeric facets merely because they are useful to a presentation.

#### Rationale

One typed value prevents contradictory combinations such as simultaneous direct
and absent presence. Reusing the conceptual facet vocabulary preserves a useful
product idea without turning an entity-specific first implementation into global
architecture.

#### Alternatives considered

- Use independent boolean tags for each presence state: rejected because invalid
  combinations would become representable.
- Add `none-established` as another value: rejected because incomplete evaluation
  and an established empty result have different meanings.
- Introduce parameterized contextual facets now: rejected because project and
  organization already qualify the complete analysis context, and no implemented
  entity-relative role requires a general mechanism in this slice.
- Generalize `ModuleFacet` into a universal facet record: rejected as premature.

#### Consequences

- Presentations can annotate, filter, and group by module presence without losing
  evaluation status.
- Later genuinely entity-relative properties, such as a module's role within a
  particular group, require explicit contextual semantics when implemented.

### Keep organization conceptual while preserving bounded source detail

#### Decision

Normal organization and group-inspection presentations show groups, relationships,
modules, salient properties, qualification, and bounded summaries rather than
repository paths or file contents. Every displayed entity includes its precise
Entity ID to support follow-up navigation.

`inspect(group)` exposes all direct parents, all direct subgroups, all direct
member modules, direct documentation availability, salient group properties, and
a bounded account of other direct artifacts. Direct subgroups carry their own
salient group annotations. Source detail identifies applicable captured paths and
source-level qualifications but does not reproduce documentation or other file
contents.

#### Rationale

Structure alone can look like a filesystem browser. Entity identity, qualified
membership, documentation association, project-relative properties, and
navigation make it a program-organization view. Exact paths remain important for
verification and coding-agent coordination but belong behind explicit source
escape.

#### Alternatives considered

- Show full paths in normal trees: rejected because it would make source layout
  the dominant product identity.
- Hide Entity IDs until source detail: rejected because ordinary inspection needs
  precise follow-up navigation.
- Display documentation contents in group inspection: rejected because the slice
  does not interpret or summarize those contents and the human can locate them
  from source detail.

#### Consequences

- Presentation may align group and module annotations, prune no-project-module
  branches, and mark repeated graph references, provided omissions remain clear.
- Actual source disclosure continues through the established observation contract.
- Exact command syntax, glyphs, widths, and expansion limits remain implementation
  choices.

### Bound symlink semantics without making them the product focus

#### Decision

Retain a symbolic link as source-qualified artifact evidence. Follow its target
for organization only when the resolved target remains within the same provider
population. An internal directory link can give the target group another parent
without creating a duplicate group. Refuse a containment edge that would cross a
provider boundary or create a cycle, while retaining the link, target, and reason
as qualified evidence.

Module identity continues to follow the configured TypeScript program. A module
established at a linked source path is distinct from a target-path module also
established by TypeScript and is placed according to its apparent source path.
The organization provider does not synthesize placement identity from realpath or
content equality.

#### Rationale

Ignoring links entirely would make provider completeness false and could miss
ordinary internal organization. Treating target identity as module identity would
contradict observed TypeScript behavior. At the same time, rare link graphs do not
justify a general link-management subsystem.

#### Alternatives considered

- Treat every link as permanently opaque: rejected because safe internal links
  can supply valid organization evidence.
- Duplicate target groups beneath link paths: rejected because one recognized
  region would acquire several group identities merely from filesystem aliases.
- Give linked and target source paths one module Entity ID: rejected because
  TypeScript can establish distinct SourceFiles and relative-resolution contexts.
- Permit cyclic containment: rejected because it makes containment incoherent and
  recursive presentation unsafe.

#### Consequences

- Group containment may be a directed acyclic graph rather than a strict tree.
- Group inspection includes direct parents, and repeated tree occurrences use the
  same Entity ID and bounded expansion.
- Symlink qualification is available through source detail but does not clutter
  the default product journey.

### Extend snapshot identity only with claim-relevant organization inputs

#### Decision

Extend the established analysis snapshot with every organization-defining input
and method version capable of changing the slice's claims or exposed evidence.
This includes the visible artifact manifest and relevant kinds, effective
exclusion environment, explicit generated-output boundaries, and link,
submodule, or nested-repository evidence actually used.

Do not hash arbitrary worktree bytes when no claim or exposed evidence depends on
them. Preserve the established first-observed, non-atomic input qualification.

#### Rationale

Dirty and untracked worktree state can change groups and placements even when it
does not enter the TypeScript program, so Slice 1's compiler-input identity alone
is insufficient. Hashing every byte would instead invalidate all entity
references for irrelevant changes and would imply an unnecessarily broad
snapshot claim.

#### Alternatives considered

- Use only a Git revision name: rejected because the analyzed worktree can differ
  from that revision.
- Reuse the Slice 1 snapshot without organization inputs: rejected because
  different organizations could then share one snapshot identity.
- Hash every worktree file in full: rejected because unrelated unanalyzed content
  need not affect any claim or exposed evidence.

#### Consequences

- Organization IDs and structured views are reproducible for equivalent observed
  inputs and methods.
- Changes to organization-defining dirty or untracked state create a new snapshot.
- Contents become identity inputs when later slices analyze or expose them.

### Keep project opening distinct from later analysis availability

#### Decision

Retain Slice 1's operational project-open boundary. If the configured TypeScript
project cannot be opened, fail the invocation before producing an investigation
projection. Once opening succeeds, repository organization can remain available
when later requested program-content analysis is partial or unavailable.

Do not convert unavailable module placement or module-presence analysis into an
established empty result. A project-focused organization that depends on an
unestablished module population can be partial or unavailable while the complete
repository organization remains usable.

#### Rationale

The configured project is the invocation anchor and opening it is established
Slice 1 behavior. After that boundary, making repository evidence disappear
because a later compiler query failed would unnecessarily conflate project
analysis with repository discovery.

#### Alternatives considered

- Fall back to a repository-only session when project opening fails: rejected
  because it changes the established operational contract and invocation context.
- Fail every organization result after any module-analysis failure: rejected
  because usable qualified repository information may remain.
- Treat unavailable module results as no modules: rejected because absence and an
  established empty result are different.

#### Consequences

- Operational failure, evaluation failure, partial materialization, and
  established empty organization remain distinct.
- A future repository-first invocation mode would require a separate product
  decision rather than appearing accidentally in this slice.

### Defer dependency-relative organization roles

#### Decision

Do not analyze dependencies, dependents, re-exports as organization roles,
cycles, dependency mechanisms, runtime behavior, boundary crossings,
architectural rules, or labels such as barrel, facade, shared-types, feature,
utility, layer, entry, or root in this slice.

Preserve dependency analysis as the likely next slice, where dependency claims
can be interpreted relative to qualified organizational boundaries.

#### Rationale

Organization is independently useful for discovery, documentation, navigation,
and later contextualization. Pulling dependency semantics into it would obscure
that value, expand the evidence contract, and couple two product questions before
either is validated.

#### Alternatives considered

- Add obvious dependency-derived annotations opportunistically: rejected because
  apparently simple roles require dependency population, direction, scope, and
  qualification decisions.
- Begin with architectural-rule enforcement: rejected because the slice does not
  establish declared architecture or dependency constraints.

#### Consequences

- Initial group facets remain mechanical and modest.
- The next slice can ask dependency questions against explicit organization
  context without retrofitting groups into an earlier dependency model.

## Follow-up

- Plan dependency and dependent analysis as a separate slice interpreted relative
  to organizational boundaries where useful.
- Revisit TypeScript-project-layout organization only through an explicitly named
  provider with its own evidence and completeness contract.
- Add document-content extraction, summarization, and applicability interpretation
  only with separately qualified methods.
- Revisit additional organization schemes and explicit comparison or composition
  after repository-layout organization has been exercised.
