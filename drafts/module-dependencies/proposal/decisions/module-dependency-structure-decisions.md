# Module dependency structure decisions

Arising from: [Module dependencies plan](../plans/module-dependencies-plan.md)
Scope: direct TypeScript module-dependency evidence, graph semantics, project and focused navigation, and analysis boundaries

## Context

The completed module inventory established qualified module identity, TypeScript discovery, deterministic navigation, source escape, and observation recording. This record governs the next slice's direct dependency evidence and graph questions without adding repository-organization interpretations or changing cross-cutting core terminology.

The product must reveal direct module relationships while keeping source requests distinct from value use, emitted code, loader behavior, and runtime execution.

## Decisions

### Provide project structure and focused direct navigation

#### Decision

Implement three primitive dependency questions:

- `dependency-structure(project)` selects the configured project's established
  direct module graph;
- `dependency-children(module)` selects modules on which the subject directly
  depends and their relationships; and
- `dependency-parents(module)` selects modules that depend directly on the
  subject and their relationships.

The names describe lens semantics; exact CLI spelling remains an implementation
choice. A dependency parent depends directly on a dependency child. Views scope
those terms explicitly to dependency structure and do not rely on the easily
confused pair “dependencies” and “dependents” without clarification.

The initial slice is direct-only. Transitive reach and maximum hops are later lens
parameters. Presentation limits on levels, roots, nodes, or detail do not narrow
the requested projection.

#### Rationale

The project graph provides orientation while focused views make that orientation
actionable. Either alone is independently incomplete as a product journey: a
bounded map without navigation is a dead end, while adjacency lists provide weak
structural context. Keeping the directions as separate questions preserves lens
identity even when evaluation work is shared.

#### Alternatives considered

- Implement only `dependencies(module)`: rejected because it supplies local
  adjacency without the project structure that motivates the slice.
- Implement only the project graph: rejected because the bounded initial view
  needs precise follow-up navigation.
- Put both directions into `inspect(module)` as standard module detail: rejected
  because dependency children and parents are separately meaningful lens
  questions under the accepted module decisions.
- Add transitive reach immediately: deferred because direct structure is useful
  and sufficient to test the graph, evidence, navigation, and organization model.

#### Consequences

- One evaluation may support all three projections without making them one lens.
- CLI and presentations must state relationship direction clearly.
- A later transitive request changes the lens parameters rather than merely
  expanding more rendered levels.

### Derive graph structure without making a graph the canonical store

#### Decision

Represent direct dependency occurrences and aggregated module relationships as
qualified addressable records. Derive graph projections, roots, strongly
connected components, repeated references, and presentation structures from
those records. Do not adopt one graph object or graph database as the canonical
program-information representation.

Project-classified modules form the structural population for project roots and
project-internal cycles. A root is a module, or strongly connected component of
modules, with no dependency parents in that population. Resolved external modules
may appear as opaque boundary children but are not project roots and are not
traversed as parents in this slice.

Preserve every member and internal edge of a strongly connected component.
Initial generated cycle groupings are presentation structures, not entities,
semantic identities, or independently selectable subjects.

Cycle handling is a graph-completeness requirement and an exceptional-case
presentation concern. It is not part of the representative product journey for
this slice.

#### Rationale

Dependencies are graph-shaped, but the accepted record architecture deliberately
allows graphs, trees, tables, and paths to derive from shared qualified records.
Strongly connected components make root calculation and bounded rendering
truthful without prematurely creating a new cycle-subject identity contract.

#### Alternatives considered

- Store one canonical graph object: rejected because it would duplicate or
  displace the accepted record-oriented information model.
- Break cycles by dropping or duplicating edges: rejected because it would make
  the projected structure false.
- Treat every cycle as a new entity with a mnemonic handle: deferred until use
  demonstrates a need for cycle-focused navigation.
- Infer executable entry modules as roots: rejected because dependency roots and
  runtime entry points are different concepts.

#### Consequences

- Multiple dependency parents and shared nodes survive every projection.
- Presentations can use tree-like layout only with explicit repeated references
  and disclosed bounds.
- Cycle identity remains snapshot-local presentation identity unless a later
  decision creates a program-domain subject.

### Build module relationships from retained source request occurrences

#### Decision

A direct dependency occurrence is a supported source module request owned by an
established module. The initial TypeScript provider recognizes static imports,
side-effect imports, direct re-exports, import types, TypeScript import-equals
external references, and literal or nonliteral dynamic `import()` calls.

Use the configured TypeScript environment to resolve literal targets. A resolved
occurrence contributes to one directed relationship from its source module to the
resolved target module. Aggregate occurrences with the same ordered module pair
into one relationship while retaining every occurrence and its evidence.

Retain unresolved literal requests and target-indeterminate nonliteral dynamic
requests as source request results without inventing target modules or graph
edges. Do not perform expression constant evaluation or control-flow and
reachability analysis in this slice. Conditional or unreachable syntax therefore
remains a recognized request without a claim that execution reached it.

Re-exports create a direct relationship to the named intermediate module. Preserve
existing alias and forwarding provenance without flattening the relationship to
the originating declaration.

#### Rationale

The module-pair edge is useful graph structure, while the occurrence explains why
the edge exists and what can safely be concluded. Keeping both avoids duplicate
parallel edges without erasing mechanism, resolution, type-only, source, or
organization evidence.

#### Alternatives considered

- Use one edge per source occurrence: rejected because repeated requests obscure
  the module relationship and make graph presentation noisy.
- Store only aggregated edges: rejected because qualifications and source
  mechanisms cannot be reconstructed honestly from a union alone.
- Resolve simple nonliteral expressions through constant folding: deferred to
  avoid accumulating an ad hoc expression evaluator.
- Flatten re-export routes to the originating declaration: rejected because the
  direct intermediate module is part of the program's dependency structure.
- Build a dependency-specific symbol and alias graph: rejected because the
  established export expansion already preserves applicable provenance and the
  initial question concerns modules.

#### Consequences

- Every source-derived relationship has at least one supporting occurrence.
- One occurrence may support several claims through shared evidence.
- Provider completeness is stated over an explicit request-mechanism contract,
  not every mechanism TypeScript or JavaScript might permit.

### Keep type information, value use, loading requests, emission, and execution distinct

#### Decision

Retain explicit type-information and mechanism evidence at occurrence level. Mark
an aggregated module relationship type-only only when every applicable supporting
occurrence establishes that whole-edge claim.

Do not label an unmarked relationship a runtime or value dependency. Do not claim
actual value access without binding-use analysis. A source request does not
establish execution, emitted output, loader availability, bundler retention,
deployment, or runtime loading.

The initial slice does not adopt a closed universal dependency-role enumeration.
Later language integrations or analyses may establish independently qualified
dimensions such as linking, macro expansion, code generation, or observed
loading without redefining the direct module relationship.

#### Rationale

The historical `type`/`runtime` pair conflates several questions and invites a
stronger claim than TypeScript source evidence supports. Occurrence-level evidence
and conservative whole-edge qualification preserve useful distinctions without
requiring all future languages to fit one vocabulary.

#### Alternatives considered

- Assign every edge either `type` or `runtime`: rejected because roles overlap and
  runtime behavior is not established by source syntax alone.
- Union occurrence roles onto the edge: rejected because a union can make one
  type-only occurrence cause a mixed edge to appear type-only.
- Infer value access from a non-type-only import declaration: rejected because
  imported bindings require separate use analysis.

#### Consequences

- Some relationships deliberately have no compact type/value label.
- Presentations may summarize mechanisms but must not turn absence of a type-only
  claim into a runtime claim.
- Later binding-use or runtime analyses can add claims without changing edge
  identity.

### Defer CommonJS-form requests behind an explicit product gate

#### Decision

Do not recognize CommonJS-form `require()` calls in the initial implementation.
Disclose that limitation in every dependency view and bound provider completeness
to the supported mechanisms.

Design occurrence records so later CommonJS support can add a qualified mechanism
without changing module-edge direction, aggregation, roots, cycles, or
presentation bounds. A future provider may recognize only a bare,
single-argument `require` that is not established as locally shadowed and whose
context supports the interpretation. Literal and nonliteral status remain
distinct, and TypeScript analysis does not establish the runtime loader.

During validation, record material source-owned CommonJS-form calls in PostCode
and the unfamiliar repository. If omission materially distorts the apparent main
structure, the slice does not satisfy its usefulness criterion without bounded
CommonJS support. Do not conceal the distortion by weakening the criterion or
selecting more convenient validation evidence.

#### Rationale

CommonJS support could improve practical coverage, but shadowing, contextual
loader interpretation, and resolution require their own evidence contract. The
occurrence model makes deferral architecturally safe; the product gate prevents
that architectural convenience from disguising a serious usability gap.

#### Alternatives considered

- Include every call named `require`: rejected because local functions and
  unavailable loaders would produce false relationships.
- Omit `require` silently: rejected because users could mistake a partial graph
  for complete supported structure.
- Add bounded support automatically if validation finds calls: rejected because
  validation evidence does not itself authorize expanded implementation scope.
- Select an unfamiliar repository without CommonJS use: rejected as acceptance
  bias when repository choice is used to conceal a known gap.

#### Consequences

- Initial JavaScript and older TypeScript projects may have materially partial
  dependency coverage.
- Validation can invalidate the initial omission of CommonJS support before the
  slice is judged useful.
- Later CommonJS support has a defined semantic boundary rather than an open-ended
  compatibility promise.

### Preserve external, diagnostic, evaluation, and observation boundaries

#### Decision

Resolved external modules remain valid dependency endpoints but are opaque with
respect to internal dependency traversal. Do not equate an external module with
its containing package, installed package contents, published artifact, or online
source repository. Any later correspondence or package/version association is a
separate qualified claim.

A focused parent view may report incoming project occurrences for a resolved
external module. A focused child view reports its interior as opaque unless the
provider actually analyzed that origin; it does not turn missing internal
analysis into an established empty set of children.

Keep resolved opaque targets, unresolved literal requests,
target-indeterminate requests, platform-provided targets, and unavailable
analysis distinct whenever the provider can establish those outcomes.

After project opening, diagnostics encountered on the requested analysis path may
qualify a usable result. Do not run unrelated compiler checks solely to discover
diagnostics. Keep project-open failure, successful qualified results, partial or
unavailable evaluation, evaluation failure, and unexpected defects distinct.

Extend analysis-snapshot identity, source disclosure, generated-output exclusion,
and observation recording to every new claim, method, input, projection, view,
omission, navigation action, and actual source disclosure level.

#### Rationale

The established slices already supply the right cross-cutting identity,
qualification, failure, source, and observation boundaries. Dependency analysis
adds relationship-heavy information but does not justify weakening or replacing
those guarantees.

#### Alternatives considered

- Traverse locally installed external source automatically: rejected because the
  project analysis boundary and corresponding state are not thereby established.
- Treat unresolved requests as opaque modules: rejected because resolution
  failure does not establish a target.
- Fail the entire projection on any syntax diagnostic: rejected because usable
  qualified dependency evidence may remain.
- Reuse observations as current dependency evidence: rejected by the established
  observation lifecycle and generated-output boundaries.

#### Consequences

- External dependency interiors, package identity, and cross-artifact
  correspondence remain later work.
- Structured results and observations grow to include relationship and expansion
  qualification while preserving their separate lifecycles.

## Follow-up

- Add qualified CommonJS-form request analysis if validation or later use demonstrates sufficient value and its recognition contract is accepted.
- Add transitive reach and maximum-hop lens parameters after direct structure is exercised.
- Revisit addressable cycle subjects if humans need cycle-focused inspection.
- Add package identity, package versions, or external source expansion only with explicit correspondence and analysis-boundary semantics.
- Revisit eager evaluation and durable caching only with measured cost and a complete applicability contract.
