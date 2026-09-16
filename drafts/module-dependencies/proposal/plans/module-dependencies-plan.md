# Module dependencies slice

Status: in review
Created: 2026-09-15
Updated: 2026-09-16
Superseded by:

## Context

The completed initial module-inventory slice establishes qualified TypeScript
module entities, deterministic snapshot-scoped identity, exact inspection,
standard expansions, conceptual and source-detail presentations, and observation
recording. The completed repository-organization slice establishes one qualified
repository-layout organization, group identity and containment, module placement,
and repository/project organization views.

This slice asks how a human can understand program structure through direct
module relationships. It treats both completed slices as infrastructure without
making their slice-specific representations universal. In particular, the
implementation's Slice 1 `ModuleFacet` string array contains classifications
supplied by module discovery rather than the complete set of properties that may
serve as facets. Repository layout is not canonical architecture.

The strongest product question is:

> Where does this module sit in the configured project's direct dependency
> structure, and where can the human navigate next?

The slice combines a bounded project-level starting view with focused navigation
to direct dependency children and dependency parents. It preserves the graph
underlying those presentations, qualifies the source requests supporting each
relationship, and relates dependency evidence to repository organization where
requested.

The consequential choices are recorded in the decision records listed under
[Resulting decisions](#resulting-decisions).
The governing [`core concepts`](../docs/core-concepts.md) define standard expansions
for kinds of subject.

## Use narrative

A human opens one configured TypeScript project and requests its dependency
structure. PostCode shows the dependency roots established within the selected
project-module population and a bounded initial part of the directed graph.
Shared nodes retain every parent, resolved external modules appear as opaque
boundary children, and every consequential display omission is reported.

The human navigates from a displayed project module to its direct dependency
children: the modules on which it directly depends. From a shared dependency
child, the human asks for its direct dependency parents: the modules that depend
directly on it. The focused views preserve precise snapshot-scoped navigation and
make the relationship direction explicit.

For a relationship, the human can see supported mechanisms and qualifications
without being told that unestablished runtime behavior occurred. Several source
requests between the same ordered module pair contribute to one direct
relationship while retaining their individual evidence. A relationship is marked
type-only only when every applicable occurrence establishes that whole-edge
claim.

When requested by the selected presentation, PostCode also materializes:

- a module property shown as **re-exports only**, allowing the human to recognize
  that local implementation is unlikely to be found in that module without
  calling it a barrel, facade, or API boundary; and
- repository-layout-relative information describing whether an occurrence stays
  in the same group, moves into descendant groups of, or moves outward from every
  applicable organization placement established by its captured source evidence.

These properties remain distinct from presentation. A graph, list, structured
view, or organization tree may expose, group, filter, or omit materialized
properties according to declared presentation requirements and disclosed bounds.
Rendering performs no compiler, repository, or relationship analysis.

## Intended outcome

Deliver an independently useful read-only dependency investigation that:

- exposes the configured project's direct module-dependency graph from qualified
  source evidence;
- provides a bounded project-level starting view and precise navigation in both
  relationship directions;
- preserves the ordinary graph structure of shared nodes, multiple parents, and
  direct re-export intermediates;
- represents exceptional cycles truthfully without making cycle investigation a
  primary product journey;
- distinguishes resolved edges from unresolved and target-indeterminate source
  requests;
- avoids unsupported value-use, emitted-code, loader, and runtime claims;
- adds the qualified `re-exports only` module property to dependency and
  repository-organization presentations that request it;
- renames the Slice 1 discovery-specific facet representation so its limited
  provenance is explicit;
- adds conservative occurrence-relative repository-organization information to
  dependency relationships that request it; and
- extends standard expansion semantics to relationship subjects without making
  relationships entities or creating a general evaluation planner.

## Success criteria

### Lens and navigation behavior

- `dependency-structure(project)` selects the direct dependency graph established
  for project-classified modules in the configured TypeScript project, together
  with supported non-edge request results owned by those modules. The project
  presentation reports qualified counts for those results without rendering them
  as graph nodes.
- `dependency-children(module)` selects the subject module, its direct outgoing
  module relationships, and its supported source requests that establish no
  dependency child. The latter remain qualified request results and are presented
  separately from dependency children.
- `dependency-parents(module)` selects the subject module and its direct incoming
  module relationships. A source request that establishes no child creates no
  corresponding parent result.
- These are distinct lens questions even when one shared evaluation supplies
  their information. Exact command spelling remains an implementation choice.
- Human-facing views define the direction: a dependency parent depends directly
  on a dependency child. Parent and child terminology is explicitly scoped to
  dependency structure and is not used for organizational containment.
- Focused module selection preserves the established exact name, generated
  handle, compact Entity ID, and snapshot rules. Zero, one, and multiple matches
  remain explicit.
- Every displayed module supplies a precise Entity ID. Navigation commands retain
  full snapshot scope when required.

### Graph population and roots

- Project-classified modules form the structural population used to calculate
  dependency roots and project-internal cycles.
- A dependency root is a project module, or strongly connected component of
  project modules, with no dependency parents in that project-module population.
  Root does not mean executable entry point, architectural top level, ownership,
  or importance.
- Resolved external modules may appear as opaque dependency children. They are not
  project roots, and the initial analysis does not traverse their internal
  dependency structure merely because their source is locally installed.
- A focused parent view may report incoming project occurrences for a resolved
  external module. A focused child view of that external module reports that its
  interior is opaque; it does not present the absence of analyzed children as an
  established empty result.
- Named ambient modules classified as project modules participate when the
  provider can establish occurrence ownership and relationship evidence under the
  explicit TypeScript contract. Unestablished ownership qualifies coverage rather
  than being guessed.
- Shared nodes and several dependency parents remain one module entity with all
  established incoming relationships.
- Strongly connected components preserve every member and internal edge. Initial
  presentation grouping of a cycle does not create a new program entity or imply
  an independently selectable cycle subject.
- Modules disconnected from all established project relationships remain part of
  the project population. Presentations may section or bound them while disclosing
  omission.

### Direct occurrence and relationship evidence

- A direct dependency occurrence is a supported source module request owned by an
  established source module, with literal, nonliteral, resolved, unresolved, and
  indeterminate target status preserved as applicable.
- The initial supported mechanisms are:
  - static import declarations;
  - side-effect import declarations;
  - direct TypeScript re-export declarations;
  - import-type nodes;
  - TypeScript import-equals external module references; and
  - dynamic `import()` calls with literal or nonliteral target expressions.
- A literal target produces a module-pair relationship only when the configured
  TypeScript environment establishes a target in the supported module population.
  An unresolved literal remains a recognized request with no fabricated target.
- A nonliteral dynamic request is recognized as target-indeterminate and produces
  no module-pair edge. The provider performs no target-expression constant
  evaluation or reachability analysis.
- The focused child presentation lists unresolved literal and
  target-indeterminate request results separately from established dependency
  children. The project presentation summarizes their counts without depicting
  them as nodes or relationships. Explicit source detail exposes their captured
  syntax, location, target status, and applicable resolution evidence.
- Conditional and unreachable syntax remains source request evidence without a
  claim that execution reached it.
- Resolved occurrences from one source module to one target module aggregate into
  one directed module-pair relationship. Every source-derived relationship
  retains at least one supporting occurrence, and all supporting occurrences
  remain available.
- One occurrence may support the module relationship, source-mechanism claims,
  type-only qualification, organization-relative claims, and source detail
  without copying its underlying evidence into unrelated records.
- Re-export occurrences establish a relationship to the directly named module.
  Alias and forwarding provenance does not flatten a barrel chain to the
  originating declaration.
- Successful dependency results with encountered analysis-path diagnostics remain
  distinct from project-open failure and evaluation failure.

### Type-only and runtime boundaries

- Explicit type-information evidence is retained at occurrence level.
- A module-pair relationship is marked type-only only when every applicable
  supporting occurrence establishes the whole-edge claim.
- An unmarked edge is not labelled a runtime dependency or value dependency.
- The slice does not claim actual value access without binding-use analysis.
- Static, dynamic, side-effect, re-export, import-type, and import-equals
  mechanisms remain distinguishable without claiming execution, emitted output,
  loader availability, bundler retention, or deployment behavior.

### `re-exports only` property

- A qualified positive module-property claim is materialized when:
  - the module has at least one supported direct TypeScript re-export; and
  - every substantive top-level statement is a supported direct re-export.
- Supported direct re-exports include named, wildcard, namespace, and explicitly
  type-only `export ... from` forms that the selected TypeScript version exposes
  through its supported public syntax model.
- Comments and `EmptyStatement` syntax do not prevent the claim. Imports, local
  declarations, executable statements, export assignments, local export lists,
  and `export {}` prevent it. Any additional ignored syntax must be enumerated
  explicitly rather than hidden behind “non-substantive.”
- The property does not establish barrel, facade, API boundary, purity,
  importance, safe collapse, or absence of transitive side effects.
- Do not add inverse or companion module-kind labels merely because this positive
  characteristic exists.
- Dependency and repository-organization presentations may request this module
  property as a standard expansion and use it as a facet. It remains separate
  from the initial module-discovery string facets.

### Module-discovery facet naming

- Rename the implementation type `ModuleFacet` to `ModuleDiscoveryFacet` and the
  domain and view field `facets` to `discoveryFacets`.
- Apply the field rename consistently to presentations, experimental structured
  output, observations, tests, and implemented-behavior documentation.
- Preserve the existing values, evidence, qualification, and semantics. The
  rename identifies their discovery provenance; it does not introduce a universal
  facet representation or migration of later qualified properties into the
  array.

### Repository-organization relationship information

- A dependency presentation may request repository-layout-relative relationship
  information as a standard expansion of dependency-relationship subjects.
- Classification starts from each supporting occurrence and its captured source
  evidence. When that evidence establishes a narrower source declaration or
  artifact placement, unrelated placements of the aggregated module do not weaken
  that occurrence's classification.
- Resolution evidence may likewise establish a narrower target artifact or
  declaration placement. When occurrence or resolution evidence cannot narrow an
  endpoint, use every established placement applicable to that endpoint
  conservatively. Do not invent a source-to-target placement association that the
  evidence does not support.
- An occurrence may be classified:
  - `same-group` when every applicable endpoint-placement combination supported
    by the evidence places parent and child in the same organization group;
  - `into-descendants` when every applicable endpoint-placement combination
    supported by the evidence places the child in a strict descendant group of
    the parent placement;
  - `outward` when every applicable endpoint-placement combination supported by
    the evidence places the child outside the parent group and its descendants;
  - `varies-by-placement` when established placements give different results; or
  - partial or unavailable when required placement evidence is incomplete.
- Use ambiguous only for candidate placements that the provider cannot establish.
  Established placements with different consequences vary by placement rather
  than being ambiguous.
- An aggregated module relationship exposes a common organization classification
  only when all supporting occurrences agree. Otherwise it retains
  `varies-by-occurrence`, occurrence-level variation, and incomplete outcomes.
- Preserve the organization scheme, applicable endpoint placements, containment
  evidence, common ancestors where established, and evaluation outcomes behind
  the classification.
- Organization-relative unavailability never erases an established dependency
  relationship.
- These properties do not establish architectural rules, violations, intended
  layering, public API, subsystem boundaries, coupling quality, or whether a
  crossing is desirable.

### Expansion, evaluation, and presentation

- Broaden standard expansion semantics from information defined for an entity
  kind to information defined for a kind of subject. Relationships remain
  distinct from entities and may serve as subjects of qualified claims and
  expansions.
- The module-composition expansion materializes `re-exports only` claims.
- The dependency organization-context expansion materializes qualified
  relationship-to-organization claims and identifies the organization scheme it
  requests. The initial expansion uses the repository-layout scheme.
- Presentations declare required standard expansions before evaluation. They do
  not define expansion semantics, perform analysis, or strengthen claims.
- Lens requirements, presentation expansions, evaluation outcomes, projection
  content, display coverage, and source detail remain distinct.
- If a requested expansion is unavailable or partial, the view retains that
  outcome rather than making the property look false.
- Unicode and experimental structured views consume the same qualified
  projection content when they request the same expansions, while retaining
  presentation-specific bounds.
- The project Unicode view may bound roots, distinct expanded nodes, and rendered
  levels; focused views may bound displayed occurrences and source details. Every
  consequential omission is counted or otherwise disclosed.
- Rendering consumes only materialized records. It performs no compiler,
  filesystem, repository, containment, graph, or relationship analysis.

### Source detail, identity, failure, and observations

- Ordinary views remain conceptual. They may name mechanically established
  relationship mechanisms and organization classifications without showing raw
  syntax, paths, source positions, or compiler objects.
- Explicit source detail exposes bounded captured occurrence syntax, locations,
  resolution evidence, and applicable organization evidence without rereading
  files.
- Snapshot identity includes every dependency-analysis and expansion method
  version and every already-captured input capable of changing the new claims or
  disclosed evidence. Do not add invocation clocks or observation UUIDs.
- Equivalent inputs reproduce module references, dependency relationship
  identities, ordering, cycle groupings, organization classifications, and
  structured output. Changed claim-relevant inputs or methods change snapshot
  context.
- Project-open failure remains operational and precedes an investigation
  projection. After successful opening, unavailable dependency or expansion work
  is represented through evaluation outcomes rather than false empty results.
- Dependency views and source escape participate in the established observation
  contract, including request, lens, parameters, expansions, evaluation outcomes,
  qualified view artifact, rendered output, omissions, navigation, and actual
  source-disclosure level.

### CommonJS coverage and practical gate

- The baseline scope excludes CommonJS-form `require()` analysis. Every
  dependency view produced under that scope discloses the provider limitation.
- The occurrence and relationship model must admit later qualified CommonJS-form
  occurrences without changing dependency-edge identity, direction, aggregation,
  roots, cycles, or presentation bounds.
- Before substantive dependency implementation, a preliminary survey records
  source-owned CommonJS-form calls in PostCode and the selected unfamiliar
  validation repository and estimates which direct structural relationships the
  initial omission would lose. Repository selection must not be manipulated to
  conceal the limitation.
- If omission materially changes the apparent main structure, CommonJS support
  must be added to the slice scope before approval and before the occurrence
  provider and presentations are implemented. Do not conceal the distortion by
  weakening that criterion or selecting a more convenient repository.
- Final instrument validation repeats the survey against the implemented
  coverage and confirms that the earlier scope judgment still holds.

### Instrument validation

- Automated fixtures verify exact occurrence, edge, root, parent, child, cycle,
  type-only, re-export composition, organization, qualification, omission, and
  failure results independently of rendered snapshots.
- A human can use the project view to choose and navigate a justified next module
  without mistaking presentation bounds for graph bounds.
- Clean evaluators receiving only a qualified view can identify roots, shared
  children, cycles, relationship direction, supported mechanisms, organization
  qualifications, and consequential omissions without inventing runtime or
  architectural claims.
- Exercise the slice on PostCode and at least one unfamiliar TypeScript
  repository. Retain inputs, outputs, conditions, questions, responses, and
  limitations where practical without treating evaluator interpretation as
  program truth.
- Measure fresh-invocation cost because the completed organization journey showed
  substantial latency on PostCode. Do not introduce caching, partial discovery,
  or a general scheduler merely to satisfy an unmeasured concern.

## Smallest representative investigation

Use a compact configured project of roughly six modules containing:

- one dependency root;
- two immediate branches;
- one shared dependency child with two dependency parents;
- one direct re-export intermediary; and
- enough ordinary repository placement to demonstrate one same-group and one
  outward relationship.

Demonstrate the bounded project structure, navigate to one module's direct
dependency children, navigate to the shared module's direct dependency parents,
and inspect the re-export intermediary. The project view must disclose structure
beyond its initial rendering bounds.

Keep unresolved requests, nonliteral dynamic requests, external targets,
diagnostics, unavailable evaluation, source disclosure, and unusual organization
topologies in focused fixtures so they do not dominate the product journey.

## Scope

- Extend the TypeScript integration with the supported dependency occurrences and
  explicit coverage contract.
- Materialize occurrence evidence, direct module relationships, graph evaluation,
  roots, strongly connected components, and focused parent/child projections
  through the established record and evaluation boundaries.
- Add the module-composition and dependency-organization standard expansions.
- Extend dependency and organization presentations with requested qualified
  properties while preserving their distinct lens populations.
- Add Unicode and experimental structured dependency views, navigation, source
  detail, and observation support.
- Rename `ModuleFacet` to `ModuleDiscoveryFacet` and `facets` to
  `discoveryFacets` throughout the domain and view paths.
- Add semantic fixtures, determinism checks, product exercise, instrument
  validation, and resulting documentation.

## Non-goals

- Transitive dependency reach or maximum-hop parameters.
- CommonJS-form `require()` support under the baseline scope; the preliminary
  survey above may require adding bounded support before approval.
- Value-use analysis, emitted-code analysis, execution reachability, runtime
  loading evidence, bundler behavior, tree-shaking, or deployment behavior.
- Addressable cycle subjects, cycle mnemonic handles, or cycle inspection.
- A dependency-specific symbol graph duplicating effective-export and forwarding
  provenance.
- Package and version identity, package-manager analysis, or traversal of external
  package internals.
- Contextual facets or group-parameterized questions such as dependencies that
  exit one selected group.
- A group-level dependency-landscape lens, local dependency structure,
  explorative product semantics, or inferred conceptual units.
- Path-based module selection, source paths as module identity, or arbitrary
  source browsing.
- Architectural rule enforcement, inferred layers, violations, ownership,
  importance, canonical subsystem boundaries, or coupling judgments.
- A universal facet framework, relationship ontology, graph store, durable cache,
  general planner, or staged scheduler.
- A GUI or stable public structured schema.

## Approach

### 1. Survey CommonJS structural relevance

Before changing the dependency provider, scan source-owned files in PostCode and
the selected unfamiliar validation repository for CommonJS-form calls. Inspect
the calls and their literal targets far enough to estimate whether omitting them
would remove relationships that materially shape either repository's apparent
main structure. This survey determines whether the implementation scope must add
a bounded CommonJS recognition contract. It is an early scope check, not a
substitute for final validation or a claim that every call named `require` is a
module-loading request.

### 2. Characterize the supported TypeScript request contract

Use small compiler-backed investigations to settle source-module ownership,
literal and nonliteral request recognition, public resolution behavior, named
ambient modules, import-equals, direct re-export forms, and diagnostics. Finalize
the provider guarantee and limitations before depending on them in projections.

### 3. Materialize occurrences and direct relationships

Add the minimum records and store operations for occurrence evidence and
aggregated directed module relationships. Keep resolution status, mechanism,
type-only evidence, and source ownership independent. Extend snapshot method
identity for every changed claim.

### 4. Derive project graph information and focused projections

Derive the project graph, condensation graph, roots, shared-node structure, and
cycle groupings from materialized relationships. Implement the project,
dependency-child, and dependency-parent lenses without allowing presentations to
alter their requested populations.

### 5. Add requested module and organization expansions

Materialize the positive `re-exports only` property from an exhaustive syntax
rule. Relate dependency occurrences to captured source placement and derive
conservative organization classifications. Rename the initial discovery-facet
type and field without changing their values or semantics. Preserve independent
outcomes when either expansion is partial or unavailable.

### 6. Present, navigate, disclose, and observe

Create bounded conceptual Unicode and structured presentations, explicit source
detail, generated next actions, and complete observation artifacts. Extend the
organization view only with the requested module property; do not add dependency
counts or hidden dependency-lens behavior to it.

### 7. Verify the instrument and its practical boundary

Verify exact semantic fixtures before rendered outputs. Exercise the complete
journey on PostCode and an unfamiliar repository, inspect usability, run clean
evaluation, measure cost, and confirm the preliminary CommonJS scope judgment.
Update implemented-behavior documentation and prepare independent review
checkpoints in proportion to the new evidence and graph boundaries.

## Fixture and acceptance coverage

Use several reviewable fixtures covering:

- the representative root, shared-child, and re-export-intermediary journey;
- static, side-effect, type-only, import-type, import-equals, named and wildcard
  re-export, literal dynamic, nonliteral dynamic, and unresolved literal requests;
- several occurrences aggregated into one edge, including wholly type-only and
  mixed-evidence edges;
- direct re-export chains preserving every intermediate module;
- exceptional self-loop and multi-module-cycle cases, including a graph whose
  root is a cyclic component;
- named ambient modules, declaration-backed modules, JavaScript modules, and
  occurrence ownership that can and cannot be established;
- project-to-project, project-to-external, unresolved, target-indeterminate, and
  platform-provided outcomes where supported;
- focused-child separation of non-edge request results, project-level summary
  counts for those results, and their explicit source detail;
- positive `re-exports only`, comments and empty statements, every supported
  direct re-export form, and each substantive statement that prevents the claim;
- occurrence-specific source placement, multiple module placements, consistent
  same-group/into-descendants/outward classifications, variation by placement,
  variation by occurrence, placement ambiguity, and organization unavailability;
- partial, unavailable, failed, and established-empty evaluation without false
  negative properties;
- Unicode and structured display bounds, repeated nodes, cycle grouping,
  omissions, exact navigation, source detail, controls, and observation output;
- equivalent-process determinism and changed-input/method invalidation; and
- visible CommonJS coverage limitation plus preliminary-survey and final
  confirmation evidence.

## Risks and uncertainties

- TypeScript exposes several module-resolution and symbol APIs but no single
  public operation defining every supported source request and owner. An overly
  broad guarantee would silently omit relationships.
- Named ambient modules and modules with several declarations make source
  occurrence ownership more complex than SourceFile-backed modules.
- Graph roots can be numerous and uninformative on test-heavy or plugin-heavy
  projects. Presentation bounds must remain honest without inventing importance
  rankings.
- A cycle grouping can look like a new entity or collapse important internal
  relationships. The initial presentation must preserve members and edges while
  keeping generated grouping status clear.
- The `re-exports only` annotation may be overinterpreted as intended public API
  or safe collapse. Its wording and qualification must remain mechanical.
- Repository layout can supply several valid placements or containment paths.
  Conservative classification may produce variation rather than a neat tag; that
  result is preferable to choosing a convenient organizational perspective.
- Omitting CommonJS-form calls may materially reduce usefulness on JavaScript or
  older TypeScript repositories. The explicit validation gate prevents silent
  acceptance but may invalidate the initial scope.
- Dependency analysis may amplify the completed organization slice's measured
  fresh-invocation latency. Premature caching would create a larger validity and
  lifecycle problem than this slice is intended to solve.
- Adding relationship-subject expansions is a small conceptual generalization,
  but an overly generic implementation could become a speculative property or
  planner framework.

## Open questions

- Does the exact TypeScript characterization support the complete initial
  occurrence list above through stable public APIs?
- Which additional compiler-only or platform target outcomes can be named
  mechanically without implying package or runtime identity?
- Is `EmptyStatement` the only source statement ignored by the `re-exports only`
  rule, apart from comments which are not statements?
- What bounded Unicode graph shape best supports the representative journey
  without implying that omitted levels were not requested?
- Which unfamiliar TypeScript repository will supply both the preliminary
  CommonJS survey and the final external product exercise?

## Governing-document impact

The governing [`core concepts`](../docs/core-concepts.md) define standard expansion for
a kind of subject rather than only an entity kind. This permits a dependency
relationship to have presentation-requested organization context without turning
the relationship into an entity or making the information inherent to every
dependency projection.

This slice does not change the architectural constraints.

The dependency-child/parent terminology, direct graph semantics, occurrence
contract, module-composition property, and organization classification are
consequential slice decisions but do not otherwise change the existing
cross-cutting definitions. The discovery-facet rename aligns the implementation
with the already-governing Facet concept and does not change that concept.

## Implementation discretion and revision conditions

The implementing agent may choose exact CLI syntax, graph layout, Unicode glyphs,
deterministic ordering, display counts, record and method names, internal module
boundaries, and focused fixture organization, provided the observable contracts
and qualifications above are preserved.

The following choices are outside implementation discretion and require a
separately accepted change:

- expanding or narrowing the supported request mechanisms materially;
- including CommonJS-form requests when the preliminary scope condition has not
  made bounded support required;
- changing the configured-project or repository-layout organization boundary;
- treating external package or runtime identity as established;
- weakening occurrence evidence, edge aggregation, cycle preservation,
  deterministic identity, or evaluation distinctions;
- introducing contextual facets, architectural judgments, a universal facet or
  relationship framework, durable caching, or a general scheduler;
- exposing source syntax or paths in ordinary conceptual views; or
- changing another governing core concept or an architectural constraint.

The slice cannot be treated as complete when omitted CommonJS-form requests
materially distort the exercised structure. Validation of presentation usefulness
and independent review remain required, as in the completed slices.

## Resulting decisions

The consequential choices are recorded in:

- [module dependency structure](../decisions/module-dependency-structure-decisions.md);
- [module composition property](../decisions/module-composition-property-decision.md);
- [dependency and organization integration](../decisions/dependency-organization-integration-decisions.md);
- [subject-kind standard expansion](../decisions/subject-kind-standard-expansion-decision.md).

The plan retains the accepted initial module-inventory,
projection-architecture, qualification, identity/evidence, observation, and
repository-organization decisions except where these decisions explicitly extend
their later-slice scope.
