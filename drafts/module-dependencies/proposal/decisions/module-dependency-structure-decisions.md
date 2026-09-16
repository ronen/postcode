# Module dependency structure decisions

Status: in review
Decided:
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
  direct module graph and supported non-edge request results owned by its project
  modules;
- `dependency-children(module)` selects modules on which the subject directly
  depends and their relationships, plus the subject's supported source requests
  that establish no dependency child; and
- `dependency-parents(module)` selects modules that depend directly on the
  subject and their relationships.

Non-edge request results remain separate from dependency children and
relationships. The focused child presentation lists them as qualified request
results; the project presentation summarizes their counts without depicting
them as nodes; and explicit source detail exposes captured syntax, location,
target status, and applicable resolution evidence. Because such a request
establishes no child, it creates no parent result.

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
external references, literal or nonliteral dynamic `import()` calls, and the
bounded CommonJS-form `require()` calls defined below.

Use the configured TypeScript environment to resolve literal targets. A resolved
occurrence contributes to one directed relationship from its source module to the
resolved target module. Aggregate occurrences with the same ordered module pair
into one relationship while retaining every occurrence and its evidence.

Retain unresolved literal requests and target-indeterminate nonliteral dynamic or
CommonJS-form requests as source request results without inventing target modules
or graph edges. Do not perform expression constant evaluation or control-flow
and reachability analysis in this slice. Conditional or unreachable syntax
therefore remains a recognized request without a claim that execution reached
it.

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

### Include bounded CommonJS-form requests without loader claims

#### Decision

Recognize a CommonJS-form source request only for a call of a bare `require`
identifier with exactly one argument, where the identifier is not established as
locally shadowed and the captured context supports the CommonJS-form
interpretation. The implementation must characterize that context and the
available shadowing evidence explicitly. When required evidence is unavailable,
do not guess that the call has CommonJS meaning.

Preserve literal and nonliteral target status. Resolve a literal target through
the configured TypeScript environment and create a relationship only when that
environment establishes a supported target. Retain an unresolved literal as a
non-edge request result. Retain a nonliteral target as target-indeterminate
without constant evaluation or a fabricated edge.

The mechanism establishes a qualified source request, not that a runtime
CommonJS loader exists, loading occurred, emitted code retains the call, or
execution reached it. Calls through aliases or properties, calls with zero or
several arguments, `require.resolve`, and other CommonJS APIs remain outside this
bounded mechanism unless a later decision expands it. Dependency views disclose
the supported boundary and any material unavailable recognition evidence.

#### Rationale

The pre-approval survey found that excluding CommonJS-form requests from the
ts-node core source population would hide otherwise undiscoverable internal
relationships, literal requests to external packages and Node builtins, and
target-indeterminate requests. Provider analysis may establish the literal
requests as external boundary children, platform-target results, or other
qualified outcomes. All of those result kinds are part of this slice's product
model. Results from PostCode, date-fns, and the rxjs library packages show that
the mechanism may be absent in other projects, but they do not cancel material
distortion in a project where it is used. Structural distortion is judged per
configured project rather than by repository-wide prevalence or a majority of
surveyed repositories.

Shadowing, contextual interpretation, and resolution still require a narrow
evidence contract. The occurrence model already keeps the source mechanism,
target status, relationship, and runtime claims separate, so bounded support does
not require a broader CommonJS subsystem.

#### Alternatives considered

- Include every call named `require`: rejected because local functions and
  unsupported contexts would produce false source requests and relationships.
- Retain the baseline exclusion with a disclosure: rejected because disclosure
  does not restore internal relationships, external boundary children, or useful
  target-indeterminate request results that bounded recognition can establish.
- Recognize only literal calls: rejected because a qualified nonliteral request
  remains useful even though it creates no graph edge.
- Count only omitted project-internal edges: rejected because resolved external
  boundary children, platform-target results, and non-edge request results are
  part of the selected dependency result.
- Infer runtime CommonJS loading from the recognized form: rejected because the
  configured TypeScript evidence does not establish loader availability or
  execution.

#### Consequences

- The TypeScript characterization must settle the exact affirmative contextual
  and shadowing evidence used by the bounded recognizer.
- Literal CommonJS-form requests participate in the same target resolution,
  aggregation, organization, external-boundary, source-detail, and observation
  rules as other occurrences.
- Nonliteral CommonJS-form requests become visible non-edge request results.
- CommonJS coverage remains explicitly bounded rather than an open-ended
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

- Broaden CommonJS recognition beyond the bounded direct-call form only when a
  later product question and evidence contract justify it.
- Add transitive reach and maximum-hop lens parameters after direct structure is exercised.
- Revisit addressable cycle subjects if humans need cycle-focused inspection.
- Add package identity, package versions, or external source expansion only with explicit correspondence and analysis-boundary semantics.
- Revisit eager evaluation and durable caching only with measured cost and a complete applicability contract.
