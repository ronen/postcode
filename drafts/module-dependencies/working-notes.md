# Module dependencies planning notes

Status: working notes; durable but non-governing
Started: 2026-09-15

These notes preserve the current module-dependencies planning discussion across
sessions. They are not an approved plan, accepted decision record, governing
concept revision, implementation authorization, or task record. A later proposal
must carry the necessary context into canonical documents rather than citing this
draft.

The earlier
[`_module-dependencies-plan/decision-candidates.md`](../../_module-dependencies-plan/decision-candidates.md)
is historical scratch material from when module dependencies were expected to be
the second product slice. Repository organization emerged during that planning
and was implemented first. The historical notes remain useful design lineage but
have not been conformed to the completed organization slice or the discussion
recorded here.

## Established context

Treat the completed initial module-inventory and repository-organization slices
as established infrastructure while reconsidering their slice-specific
representations rather than generalizing them automatically.

Applicable established capabilities include:

- configured TypeScript project opening and the explicit supported module
  population;
- deterministic analysis snapshots, module identities, generated navigation
  handles, exact selection, and qualified inspection;
- a record-oriented information model, ephemeral `ProgramRecordStore`, eager
  evaluation, addressable projections, and separate evaluation outcomes;
- presentation-declared standard expansions materialized before projection and
  rendering;
- conceptual Unicode and experimental structured presentations, bounded source
  escape, and observation recording; and
- repository-layout organization, qualified group identities and containment,
  module placement, multiple-placement and unavailable outcomes, and
  repository/project organization projections.

Repository layout is one qualified organization scheme. It is not established as
the program's canonical architecture.

## Agreed direction

### Product question and journey

The strongest initial product question is:

> Where does this module sit in the configured project's direct dependency
> structure, and where can the human navigate next?

The initial slice should combine two parts as one product journey:

1. a project-level dependency-structure view emphasizing dependency roots and a
   bounded initially rendered shape; and
2. focused navigation from a module to its direct dependency children or its
   direct dependency parents.

A **dependency parent** depends directly on a **dependency child**. Human-facing
views must scope parent and child terminology explicitly to dependency structure
so it cannot be confused with organizational containment. Avoid relying on the
pair “dependencies” and “dependents” without clarification.

The focused directions are separate lens questions even when they share one
evaluated graph. The initial slice is direct-only. Transitive reach and maximum
hop constraints are later lens parameters rather than presentation controls.

### Graph semantics and presentation bounds

Treat dependency structure as a directed graph. Preserve multiple parents,
shared nodes, and cycles rather than duplicating nodes or forcing a tree.

A dependency root is a project module, or cyclic component of project modules,
with no dependency parents in the selected project-module population. Root does
not mean executable entry point, architectural top level, or importance.

Strongly connected components are required to calculate roots and render cycles
truthfully. Initially, a cycle may be a generated presentation grouping that
lists its members and preserves its internal edges. Creating independently
selectable cycle subjects, mnemonic cycle handles, and `inspect(cycle-handle)` is
deferred until use demonstrates that cycles need their own navigation contract.

The requested graph population remains distinct from presentation bounds. Root
limits, initially rendered levels, node limits, collapsed groups, repeated-node
markers, and disclosed omissions are presentation choices. They must not silently
narrow the lens request.

### Occurrences and module-pair relationships

The initial dependency relationship is a direct, source-established module
request from one supported module entity to another module entity resolved by the
configured TypeScript environment.

Retain source request occurrences as qualified evidence. Aggregate resolved
occurrences with the same ordered module pair into one directed module dependency
relationship while preserving every supporting occurrence. Every source-derived
module relationship must retain at least one supporting occurrence. One
occurrence may support several claims without requiring duplicated source
evidence.

Initial occurrence mechanisms are expected to include:

- static imports;
- side-effect imports;
- direct TypeScript re-exports;
- import types;
- TypeScript import-equals external module references; and
- literal dynamic imports whose targets TypeScript establishes.

Recognize nonliteral dynamic requests as target-indeterminate requests. They do
not produce a module-pair edge. Do not perform target-expression constant
evaluation or control-flow and reachability analysis, so conditional or
unreachable syntax remains a recognized source request with bounded claims.

Preserve direct intermediate modules in re-export chains rather than flattening a
dependency to the originating declaration. Use **re-export** for direct
TypeScript re-export mechanisms and reserve **forwarding** for broader provenance
or routes through aliases and re-export chains.

### Type, value, loading, emission, and runtime claims

Do not impose the historical notes' initial `type`/`runtime` role pair.

Occurrence evidence may eventually support independent dimensions such as use of
type information, value access, a source-level module loading or evaluation
request, and syntax or mechanism. The initial slice should not install a general
role system or claim value access without the necessary binding-use analysis.

Explicit type-only evidence is in scope. Mark an aggregated module relationship
as **type-only** only when every applicable supporting occurrence establishes
that whole-relationship claim. An unmarked relationship must not be described as
a runtime dependency.

A source-level request does not establish that execution reached it, that loading
occurred, that emitted code retains it, or that it survives bundling,
tree-shaking, deployment, or another transformation. Those claims remain out of
scope.

### Qualified CommonJS-form `require`

Defer CommonJS-form `require()` recognition from the initial implementation, but
make the deferral conditional and architecturally deliberate rather than assuming
the gap is harmless.

The occurrence model must allow later CommonJS support to add a mechanism and its
own qualification without changing dependency-edge identity, direction,
aggregation, roots, cycles, or presentation bounds. A future provider may
recognize a qualified loading request only for a bare, single-argument `require`
that is not established as locally shadowed and whose context supports that
interpretation. It must preserve literal versus nonliteral target status and must
not claim that TypeScript establishes the runtime loader.

Every initial dependency view must disclose that CommonJS-form `require()` is not
analyzed. Provider completeness applies only to the explicitly supported request
mechanisms.

Practical validation must not select repositories merely because they avoid this
limitation. Validation on PostCode and an unfamiliar repository should record
whether source-owned CommonJS-form requests are materially present. If their
omission distorts the apparent main structure, that is evidence to promote
bounded support before judging the slice useful.

### `re-exports only` module property

Include a positive, narrowly defined module-composition property presented to
humans as **re-exports only**:

> The module has at least one supported direct re-export, and every substantive
> top-level statement is a supported direct re-export.

Comments and explicitly enumerated syntactically empty statements do not prevent
the claim. Imports, declarations, executable statements, export assignments,
local exports, and `export {}` are substantive and prevent it. The eventual plan
must define the supported direct re-export forms and ignored empty forms
exhaustively.

Do not infer or display barrel, facade, purity, importance, safe collapse, or API
boundary as established facts. The source shape may help the human infer where
local implementation is unlikely to be found, while the module's export surface,
aliases, and forwarding routes may still be important.

Do not create companion classifications such as `mixed`, `implementation`, or
`facade`, and do not generalize this into a taxonomy of “entirely X” module
kinds. Evaluation completeness remains separate so unavailable analysis cannot
look like a negative result.

Represent this as its own qualified module-property claim. It may serve as a
facet in presentations without being inserted into Slice 1's string-valued
module-discovery facet array. Dependency and repository-organization
presentations should be able to request the property and use it as a compact
module annotation. The organization view must be extended deliberately; its
current module leaves do not automatically expose all module properties.

### Facets and the Slice 1 representation

Facet is the broad governing concept: a property used as a classification
dimension. It is not the set of strings in the implementation's `ModuleFacet`
array, and no representation provides the exhaustive set of facets that may
apply to a module.

The Slice 1 array contains classifications established by initial module
discovery. Later module properties may serve as facets through their own qualified
claims and representations. Do not create a universal facet registry, universal
facet record, or common value schema.

Rename the implementation type `ModuleFacet` to `ModuleDiscoveryFacet` and the
domain and view field `facets` to `discoveryFacets` in this slice. Apply the field
rename consistently to presentations, experimental structured output,
observations, tests, and implemented-behavior documentation. Preserve the
existing values and semantics; the rename makes their discovery provenance
explicit.

Avoid formalizing the earlier tacit description “module-intrinsic facets”:
existing values such as `project` and `external` depend on configured analysis
context and are not simply intrinsic to a module.

### Organization-relative dependency properties

Include qualified repository-organization information for dependency
relationships. This is a concrete payoff from implementing organization before
dependencies.

Keep the dependency relationship claim distinct from the organization-relative
claims about it. Organization-relative information should preserve:

- the selected organization scheme, initially repository layout;
- the dependency-parent placements applicable to each supporting occurrence's
  captured source evidence;
- established dependency-child placement or placements;
- the relationship supported across those applicable placements, such as the
  same direct group, within the parent placements' organizational contexts, into
  descendants, toward enclosing groups, or outward from those contexts;
- applicable common ancestor or ancestors; and
- outside-organization, multiple, ambiguous, unplaced, partial, and unavailable
  outcomes with their actual evidence and evaluation state.

Classify each occurrence relative to the parent placement or placements
applicable to its captured source evidence. Do not automatically use every
placement of a multi-declaration module when the occurrence is established to
belong to a narrower declaration or artifact placement. When occurrence evidence
cannot narrow the applicable placements, use all established parent placements
conservatively.

Use resolution evidence similarly when it establishes a narrower target artifact
or declaration placement. Otherwise account conservatively for every established
target placement applicable to that occurrence. Do not invent source-to-target
placement associations that the evidence does not establish.

Expose a common organization classification only when it survives every
applicable endpoint placement supported by the occurrence evidence:

- if the child remains within the relevant organizational context for every
  applicable parent placement, classify the occurrence as `within`;
- if the child is in a descendant group for every applicable parent placement,
  expose the more specific `into-descendants` classification;
- if the child is outside every applicable parent placement and its descendants,
  classify the occurrence as `outward`;
- if it is inside some applicable parent-placement contexts and outside others,
  classify it as `varies-by-placement`; and
- if required placement evidence is partial or unavailable, do not present a
  complete organization classification.

Use `ambiguous` only when a provider has placement candidates but cannot establish
which placement holds. A relationship whose established placements have
different consequences is not ambiguous; it varies by placement.

Aggregate occurrence results conservatively. When all supporting occurrences
agree, expose their common organization classification. When established
occurrences differ, retain `varies-by-occurrence`. Preserve any narrower
occurrence-level `varies-by-placement` result and partial or unavailable evidence.

Whether an aggregated relationship crosses an organizational group boundary is
therefore a derived answer that may be established, consistently absent, variable
by placement or occurrence, or unavailable. A bare `crossesBoundary` Boolean is
insufficient.

Multiple organizational placements and multi-parent organization containment are
completeness cases rather than the representative journey. The central example
should use ordinary within-group and outward relationships; focused fixtures
should retain variation coverage.

Organization-relative information must not establish an architectural violation,
intended layering, public/private API, coupling quality, canonical subsystem
boundary, or whether crossing a group boundary is good or bad.

The dependency projection remains usable when organization evaluation is
partial or unavailable. Missing organization context weakens only those
supplemental claims and must not erase an established dependency relationship.

### Properties versus presentation

Keep domain properties separate from how a presentation surfaces them.

The organization scheme, endpoint placements, placement relationship, common
ancestors, evidence, and outcome are qualified domain information. A presentation
may omit them until focus, show a compact annotation, group or filter
relationships, provide detailed endpoint information, or use graph styling. It
must not derive, strengthen, or recompute those claims while rendering, and it
must disclose consequential omission.

The same separation applies to `re-exports only`: the domain property is a
qualified claim, its use as a facet is a classification role, and its appearance
as a tag, secondary line, filter, group, or omitted detail is presentation
policy.

### Presentation-declared materialization and standard expansions

Reuse the established pre-evaluation requirements path:

```text
lens requirements
+ presentation-declared standard expansions
        ↓
evaluation materializes qualified records
        ↓
projection selects those records and outcomes
        ↓
presentation renders stored information only
```

A presentation requests a domain-defined property; it does not define that
property's semantics or calculate its value.

Treat `re-exports only` as a module-subject standard expansion and organization
context as a dependency-relationship-subject standard expansion. If requested
information cannot be materialized, retain its evaluation outcome rather than
making the property appear false.

Broaden the governing definition of standard expansion from related information
defined for an **entity kind** to related information defined for a **kind of
subject**. Relationships remain distinct from entities. Both may serve as
subjects, be addressable, and have qualified claims and expansions. Do not expand
the Entity concept merely to absorb relationships.

This is an agreed semantic change to `docs/core-concepts.md` and will require a
corresponding accepted decision when the eventual proposal is promoted. No need
for an architectural-constraint change has yet been identified.

### External targets and diagnostics

Resolved external modules remain dependency endpoints. The initial analysis stops
at the external boundary rather than traversing their internal dependencies.
External package identity and version association are deferred; an external
package is not itself one module.

Keep an opaque resolved target, an unresolved literal request, an indeterminate
nonliteral request, and a platform-provided target distinct whenever the provider
can establish those outcomes. Do not present failure to resolve as a known opaque
target.

Locally installed package contents, published artifacts, online source
repositories, and repository metadata links must not be assumed to represent the
same program state. Any later correspondence is a separate qualified claim.

After successful project opening, diagnostics encountered on the requested
analysis path may conservatively qualify usable dependency results. Do not run
unrelated compiler checks merely to discover diagnostics. Keep a successful
qualified result distinct from operational failure and evaluation failure that
prevents the intended result.

## Smallest representative investigation

Use a compact configured project of roughly six modules that demonstrates:

- a dependency root;
- two immediate branches;
- a shared dependency child with multiple dependency parents;
- bounded initial rendering with disclosed deeper structure;
- a direct re-export route that preserves its intermediate module;
- focused navigation to one module's direct dependency children; and
- focused navigation to a shared module's direct dependency parents.

Exercise detailed occurrence mechanisms, unresolved and indeterminate requests,
diagnostics, external targets, organization outcomes, cycles, and failure cases
in small focused fixtures rather than turning the central journey into a
compiler-feature or exceptional-case demonstration.

## Explicitly deferred

- Transitive dependency reach and maximum-hop lens parameters.
- Qualified CommonJS-form `require()` support, subject to the practical
  validation gate above.
- Binding-use analysis sufficient to establish actual value access.
- Constant evaluation, reachability analysis, emission, bundler, tree-shaking,
  deployment, and runtime-execution claims.
- Addressable cycle subjects, mnemonic cycle handles, and cycle inspection.
- A dependency-specific symbol/binding graph duplicating the established export
  and forwarding evidence.
- Context-sensitive alias presentation unless the representative investigation
  demonstrates that it is necessary.
- Package/version identity and traversal into external package internals.
- Path-based module selection or using source paths as module identity.
- Group-level incoming/outgoing dependency counts or converting the organization
  view into a second dependency presentation.
- Architectural rules, violations, inferred layers, importance, coupling quality,
  or canonical subsystem boundaries.
- General contextual facets or group-parameterized dependency properties. A
  future group-relative investigation such as “show dependencies that exit group
  B” may justify them; the initial slice uses conservative occurrence-relative
  classification instead.
- A universal facet framework or general evaluation planner.

## Provisional recommendations

These recommendations have support in the discussion but need deliberate review
before becoming proposed decisions:

- Keep organization-relative dependency information optional through a declared
  relationship-subject expansion rather than making it inherent to every
  dependency projection.
- Let Unicode and structured presentations request the same qualified expansion
  content even when their display bounds differ.
- Continue with the current eager evaluation architecture unless measured
  dependency analysis cost demonstrates a need for staged or resource-bounded
  work.

## Open questions

- What exact supported-occurrence contract can the TypeScript provider claim for
  every import, import-type, re-export, import-equals, and dynamic-import form?
- How should occurrence evidence identify the originating module for named
  ambient modules and other modules with several declarations?
- When TypeScript resolves a target with several declarations or placements,
  what endpoint placement can an occurrence establish without inventing a
  cross-product of possibilities?
- What exact guarantee can be stated for the completeness of unresolved literal
  requests?
- Which syntactically empty top-level forms are ignored by the `re-exports only`
  definition, and which direct re-export forms are supported?
- Should type-only remain a positive edge property only, or should presentations
  also expose occurrence-level type-information evidence when the whole edge is
  not type-only?
- What is the precise dependency-project population for root calculation,
  especially named ambient modules and external modules that are members of the
  configured TypeScript `Program`?
- What precise organization classifications can be established from occurrence
  source placement, target placement, containment paths, and common ancestors,
  especially when organization containment itself has several parents?
- What is the minimal qualified presentation that makes project roots, shared
  nodes, omitted structure, and organization context understandable
  without overloading the initial view?
- What constitutes successful product validation on PostCode and an unfamiliar
  repository, including the threshold for promoting CommonJS-form support?
- Does the dependency analysis materially increase repeated-invocation cost
  enough to revisit eager evaluation or caching, given the measured latency of
  the completed organization slice?

## Historical-note disposition

The historical decision candidates contributed useful reasoning that remains
represented above:

- occurrence-backed edge aggregation;
- literal and nonliteral dynamic-request distinctions;
- the separation of source request, loading, emission, and execution claims;
- preservation of direct re-export intermediates and alias provenance;
- stopping at external analysis boundaries;
- distinctions among opaque, unresolved, indeterminate, and platform targets;
  and
- diagnostic qualification limited to the requested analysis path.

The following historical formulations have been revised or deliberately
deferred:

- a module-only `dependencies(module)` journey is broadened to project structure
  plus focused navigation;
- `dependencies`/`dependents` presentation terminology becomes dependency
  children/parents;
- the initial `type`/`runtime` role pair is replaced by conservative independent
  evidence and whole-edge type-only qualification;
- CommonJS support is conditionally deferred;
- dependency-specific symbol-path reconstruction and package/version identity are
  deferred; and
- repository organization now supplies an implemented, qualified context that
  did not exist when the notes were written.
