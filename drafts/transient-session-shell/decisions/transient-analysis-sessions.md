# Transient analysis sessions

Status: in preparation
Arising from: [Transient interactive session shell](../plans/transient-session-shell.md)
Scope: session context, reference binding, accumulated analysis, and CLI/observation lifecycle
Supersedes:

- [Initial core concepts — Include only the analysis and identity context needed by the definitions](../../../docs/decisions/initial-core-concepts-decisions.md#include-only-the-analysis-and-identity-context-needed-by-the-definitions)
- [Initial core concepts — Preserve the lens, projection, presentation, and view distinction](../../../docs/decisions/initial-core-concepts-decisions.md#preserve-the-lens-projection-presentation-and-view-distinction)
- [Projection architecture — Use a record-oriented program-information model](../../../docs/decisions/initial-projection-architecture-decisions.md#use-a-record-oriented-program-information-model)
- [Projection architecture — Isolate storage behind ProgramRecordStore](../../../docs/decisions/initial-projection-architecture-decisions.md#isolate-storage-behind-programrecordstore)
- [Projection architecture — Use deterministic logical identity independently of persistence](../../../docs/decisions/initial-projection-architecture-decisions.md#use-deterministic-logical-identity-independently-of-persistence)
- [Module inventory — Represent modules as qualified domain entities](../../../docs/decisions/initial-module-inventory-decisions.md#represent-modules-as-qualified-domain-entities)
- [Module inventory — Make references repeatable but snapshot-scoped](../../../docs/decisions/initial-module-inventory-decisions.md#make-references-repeatable-but-snapshot-scoped)
- [Identity constraints — Make analysis identity independent of invocation identity](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md#make-analysis-identity-independent-of-invocation-identity)
- [Repository organization — Represent groups and placement with qualified identities and relationships](../../../docs/decisions/repository-organization-decisions.md#represent-groups-and-placement-with-qualified-identities-and-relationships)
- [Repository organization — Extend snapshot identity only with claim-relevant organization inputs](../../../docs/decisions/repository-organization-decisions.md#extend-snapshot-identity-only-with-claim-relevant-organization-inputs)
- [Module dependencies — Preserve external, diagnostic, evaluation, and observation boundaries](../../../docs/decisions/module-dependency-structure-decisions.md#preserve-external-diagnostic-evaluation-and-observation-boundaries)
- [Observation recording — Submit self-contained, invocation-scoped observation batches](../../../docs/decisions/initial-observation-recording-decisions.md#submit-self-contained-invocation-scoped-observation-batches)
- [Projection architecture — Make projection and evaluation state first-class records](../../../docs/decisions/initial-projection-architecture-decisions.md#make-projection-and-evaluation-state-first-class-records)
- [Module inventory — Preserve Claim context and evaluation outcomes distinctly](../../../docs/decisions/initial-module-inventory-decisions.md#preserve-claim-context-and-evaluation-outcomes-distinctly)
- [Observation recording — Record normal view production automatically](../../../docs/decisions/initial-observation-recording-decisions.md#record-normal-view-production-automatically)
- [Repository organization — Keep organization schemes explicit and separate](../../../docs/decisions/repository-organization-decisions.md#keep-organization-schemes-explicit-and-separate)

## Context

The one-shot infrastructure tied records and user references to a deterministic
snapshot of analysis-defining inputs. New commands opened and evaluated afresh;
--snapshot guarded selection against that newly established context. Dependency
preparation could observe inputs that ordinary inventory did not need, requiring
--dependency-context to reproduce a compatible input basis.

A continuing investigation needs to acquire additional evidence and results
without replacing its reference namespace. The forthcoming, separate summary
work strengthens this need: follow-up examination may add evidence for revising
an interpretation. This slice supplies accumulating analysis state, not summary
semantics or a managed workspace.

The completed performance task removed redundant digest computation without
sessions. Its result is established infrastructure, not evidence that session
latency or a new lifecycle has already been validated.

## Decisions

### Session as the analysis and reference context

A session is the continuing context for an investigation and its accumulated
program records. It replaces the snapshot model: the set of observed inputs may
grow without replacing the context in which subjects are referenced.

The initial session concerns one configured project and lasts for one process.
An interactive shell retains it across commands; a one-shot invocation has a
short-lived session. Cross-invocation references are outside this contract. Future
continuity across invocations belongs to session persistence and an explicit
reopening validity policy.

Entity and record references need not reproduce across independent invocations.
For mechanical analyses, equivalent inputs, methods, declared requirements,
completed evaluations, and presentation choices produce deterministic semantic
content, ordering, and presentation apart from session-local references and
observation metadata. This is not a determinism contract for future interpreting
analyses. Each claim retains its supporting evidence and responsible method
versions; neither session membership nor observation metadata supplies that support.
Method changes capable of changing claims remain explicitly versioned.

Semantic comparison preserves populations, relationships, evidence, qualification,
and display omissions while allowing consistent renaming of session-local
references. It does not assert that arbitrary historical runs used identical
inputs. No aggregate input-set digest is part of this decision.

#### Rationale

Follow-up examination needs to acquire information while preserving the ongoing
investigation. An identity derived from a fixed observed-input set makes that
growth change the reference context. Hiding snapshot arguments would preserve
this mismatch. Capturing every possible input in advance would instead restrict
which follow-up analyses the investigation could support.

#### Alternatives considered

- Snapshot identity hidden by shell syntax: retains the coupling between the
  growing observed-input set and reference scope.
- Exhaustive input capture before the first view: restricts open-ended follow-up
  analysis and needlessly forces eager work.
- Identical reference spelling across sessions: may be useful mechanically, but
  is not necessary for deterministic semantic output or session-local navigation.
- An aggregate input-set digest for run comparison: could support a later
  comparison use case, but is not required for controlled semantic verification.

#### Consequences

The session's lifetime and reference scope are independent of how much analysis
has completed. Persistence remains a separate lifecycle decision, and the CLI's
snapshot-based cross-invocation navigation contract is retired.

### Stable reference bindings within a session

A reference bound to an entity retains that binding throughout the session.
Additional evidence, discovered entities, or analysis cannot change its referent.
Entity identity follows the applicable provider's established semantics; a label
or matching source content does not establish identity.

Names and generated handles remain lookup inputs that can match zero, one, or
several subjects. Their spelling and recognition value are distinct from the
binding of a precise reference.

#### Rationale

A human must be able to examine a previously encountered subject after further
analysis without silently selecting a different subject. This requires stable
bindings within the investigation, not deterministic identifiers across fresh
invocations.

#### Alternatives considered

- References derived from each provider entity key: compatible with this
  decision and available to implementation. Today's compact IDs already use the
  provider-key digest portion rather than the snapshot prefix. Incremental
  collision handling must preserve every issued spelling; recomputing shortest
  prefixes against a larger population would not suffice. Matching spellings in
  independent sessions do not promise continuity.
- Reassigning short references as discovery grows: conflicts with stable bindings.
- Names or handles as unique identity: conflicts with legitimate multiple matches.

#### Consequences

Reference allocation must accommodate later discovery without rebinding earlier
references. Selection syntax and allocation mechanics are implementation choices.
If supported discovery adds subjects to a lookup population, names and handles may
acquire additional matches; this does not change any precise reference binding.

### Immutable information within an accumulating session

Captured evidence, claims, evaluation outcomes, and produced projections remain
unchanged when later analysis adds information. Separate evaluation attempts
retain their own execution and materialization outcomes. Later success does not
erase earlier partiality or failure.

A produced projection identifies its subject, lens, parameters, session context,
selected claims, and relevant evaluation outcomes. Its supporting evidence and
method context remain attributable. It represents the information selected for
that projection rather than a live query over subsequently accumulated records.

Unrelated accumulated work does not change a lens's selected population or
meaning. Each projection selects information satisfying its declared requirements
and expansions rather than all information incidentally present in the store.
This permits reuse and completion of earlier incomplete work. It also permits a
future lens whose declared question explicitly concerns accumulated evidence;
such semantics are not implicit in every lens.

The established evaluation boundary coordinates reuse and additional analysis
from lens requirements and presentation-declared expansions. Projection
construction and rendering retain their existing responsibilities. Presentation
parameters do not become lens parameters because evaluation work is shared.

For the current lenses, unchanged inputs and completed evaluation yield the same
information for a repeated request. Reconstructing a projection or rendering it
again does not itself create a different semantic answer. A later attempt may
establish information missing from an incomplete earlier evaluation, with the
earlier outcome and projection retained.

#### Rationale

Accumulation is compatible with immutable evidence and projections. Without that
separation, additional work could silently alter what an earlier view established
or strengthen its claims. The session provides continuity without making all
answers within it interchangeable.

#### Alternatives considered

- Live projections over the entire accumulated store: could change an earlier
  answer or its meaning without a new request.
- Recompute all analysis for each command: preserves separation but defeats reuse.
- Prohibit all dependence on accumulated information: would prevent completing
  partial evaluations and future explicitly evidence-dependent lenses.

#### Consequences

This resolves the materialized-projection identity question needed for this
slice without defining a universal logical-query identity. Future interpretation
augmentation or supersession can relate retained accounts; its semantics belong
to the summary slice.

### Stable inputs as the session precondition

The session assumes relevant project and analysis-environment inputs remain
unchanged. Capture is first-observed and non-atomic. Reading an input later in
the session does not establish its contents at session start.

Change detection is best-effort, with an implemented strategy and demonstrated
coverage rather than an absence of detection. A detected relevant input change
invalidates the session for further investigation, with restart as recovery. Absence of detection
is not proof of unchanged inputs. Tracking an evolving worktree and automatic
refresh are outside this lifecycle contract.

#### Rationale

Comprehensive concurrent-change detection would introduce a substantial validity
mechanism for a use case explicitly outside the session's precondition. The
bounded alternative supports accumulating analysis while refusing continuation
when the system knows that the assumption has been violated.

#### Alternatives considered

- Revalidate every captured input before every command: one possible strategy,
  not a required mechanism or a guarantee of atomic capture. Its I/O cost is not
  established by the earlier optimization of hashing already captured text.
- Comprehensive freshness guarantees: exceed the stable-input precondition.
- No implemented detection: supplies no best-effort robustness and is insufficient.
- Automatic refresh: requires a different lifecycle and continuity contract.

#### Consequences

The detection mechanism and coverage are implementation choices. The precondition
and detection limits remain explicit qualifications; they do not weaken stable
reference bindings or the integrity of captured evidence.

### Command-scoped observations with session correlation

A command is the observation-batch boundary within a session. Each batch is
self-contained and carries a session identifier and command order. The identifier
is constant within a session and distinguishes it from other sessions; its format
is an implementation choice. One-shot invocations use the same model.

Normal view production automatically records repository and session context;
lens, subject, lens parameters, presentation, presentation parameters, and declared
expansions; selector input and resolved subjects; available navigation or focus
provenance; relevant evaluation outcomes, qualifications, refusals, unavailability,
and failures; projection and view identity; the qualified machine-readable view
artifact and exact rendered output; and actual source disclosure. The record of
what was presented remains distinct from analysis that was available but not shown.
Observation artifacts may contain sensitive repository information, under the
existing sink privacy contract.

Each batch has its own UUID, independently of the session correlation identifier.
Event and context records retain their UUIDs. Each batch remains interpretable
without earlier batches or the transient program store. Events refer to shared context and artifacts included once within the
batch, and those references resolve within the submitted batch. Batch-local
event and context identifiers remain distinct from content identity and the
session correlation identifier. Delivery occurs at command completion rather
than being deferred until session exit. The batch format remains explicitly
versioned and experimental, without a backward-compatibility or historical-reading
promise. Existing observation-content and delivery-failure contracts continue
to apply.

Session correlation does not turn observations into persisted operational state,
current program evidence, or a source for restoring reference bindings. The
observation sink and program store retain their separate ownership and lifecycles.

#### Rationale

A process-scoped batch would defer the record of an entire investigation until
exit. Command batches preserve independent delivery while session correlation
makes the sequence of examinations available to observation consumers.

#### Alternatives considered

- One batch per process: delays delivery and risks losing a whole investigation.
- Session-linked batches that require earlier batches to be interpreted: weaken
  the existing self-contained observation contract.
- Observations as session persistence: confuses use evidence with operational state.

#### Consequences

The observation model extends invocation-local context to related commands without
requiring producer-side persistence or historical reading. Sink retention policy
remains independent of session lifetime.

### Retained domain and storage boundaries

The session change preserves the following architectural commitments from the
headed decisions replaced by this record.

#### Decision

Program information remains a record-oriented model of entities, claims, Claim
context, evidence, recorded assertions, evaluation outcomes, and projections.
Addressability within a session does not make all records entities. Graphs, trees,
tables, and paths are derived representations, not the canonical store. Claims
retain explicit method and supporting-input context. Correspondence across
program states would be a separate qualified relationship, not identifier reuse.

Analysis, evaluation, and projection construction communicate through
ProgramRecordStore using domain-shaped operations required by implemented slices.
Storage-native rows, query objects, connections, and identity do not escape the
adapter. Access mechanics do not conceal consequential cost, failure,
qualification, or materialization. The store is ephemeral; its engine remains an
implementation choice. Durable caching, durable investigation state, and
observation storage are separate lifecycle concerns. Retaining an ephemeral
store would not by itself establish a durable cache-validity contract.
Cross-process caching remains deferred until all analysis-defining inputs can be
validated and retention, migration, concurrency, cleanup, and recovery are
addressed.

Lens, projection, presentation, and view retain distinct meanings. A lens defines
the question; lens parameters refine requested information. A projection is
qualified information for a subject and program state, addressable within its
session. A presentation defines rendering and interaction, with presentation
parameters distinct from lens parameters. A view instantiates a presentation of
a projection. These distinctions do not require separately materialized pipeline
stages or a universal projection-key formula.

A Claim supplies asserted information; Claim context supplies supporting evidence,
provenance and method, scope, epistemological guarantee, and limitations. Shared
context remains attributable and narrower context is not erased. Evaluation
outcomes separately describe applicability, availability, execution,
materialization, relevant cost, and failure or stopping reasons. They remain
available when no entity or claim is produced, distinguishing established emptiness
from absence of a result. Projections are stored addressable domain objects;
evaluation outcomes are distinct records or immutable domain values associated
with the relevant request or materialization. Repeated attempts do not overwrite
earlier outcomes. Projection qualification selects relevant evaluation outcomes
rather than inheriting unrelated work or failures from shared evaluation.

Modules remain qualified domain entities with established names or honest
anonymity, simple deterministic generated mnemonic handles, bound Entity IDs, and overlapping
established facets. The supported population and TypeScript identity rules are
unchanged. Handle generation is deterministic for equivalent supporting inputs;
the freedom to allocate session-local references does not relax that requirement.
Language-specific evidence is retained without presenting TypeScript categories
as universal PostCode facts. Lens-wide and narrower Claim context remain attributable. Inspection
selects subjects rather than exposing arbitrary stored records. Exact lookup
retains zero/one/many outcomes, with no fuzzy, wildcard, list, or successor
inference introduced by this slice.

Module standard expansions retain effective exports and associated recorded
documentation; the accepted [composition expansion](../../../docs/decisions/module-composition-property-decision.md) remains applicable.
Dependency children and parents remain separate lens questions, not module
standard expansions. Presentation requirements are declared before evaluation;
rendering consumes materialized information and discloses consequential omissions.
The accepted [subject-kind expansion definition](../../../docs/decisions/subject-kind-standard-expansion-decision.md) remains in force.

Groups remain entities with provider-established segment names and bound Entity
IDs, without generated handles or path selectors. The repository root has a
contextual label rather than an intrinsic segment name. Direct subgroup
containment and artifact/module placement remain qualified relationships;
descendant membership remains derived and distinct. Multiple established
placements use the same module identity. Multiple placement, candidate ambiguity,
unplaced results, unavailable analysis, and out-of-population modules remain
distinct. Exact group/module name collisions retain all matches, sectioned by
kind, and displayed entities retain their precise references.

Organization schemes remain explicitly identified, distinct qualified accounts.
Repository layout is the initial method, not canonical architecture. Future
package, namespace, build-target, declared, user-defined, or inferred schemes are
not silently merged with it. Groups, claims, method context, and projection
identity retain sufficient qualification to prevent accidental combination.
Neither an organization aggregate entity nor a particular bundling of organization
records within the session is required. Later comparison or composition requires
explicit semantics.

Repository evidence retains the claim-relevant visible artifact manifest, kinds,
effective exclusions, generated-output boundaries, links, and opaque repository
boundaries, with the methods that establish them. Arbitrary unexamined worktree
contents do not become inputs merely because artifacts exist. Content becomes
supporting evidence when an analysis or disclosure uses it. First-observed,
non-atomic qualification remains applicable.

Resolved external modules remain valid dependency endpoints with opaque interiors.
They do not establish package, version, installed-artifact, or online-repository
identity. Parent views may show established incoming project relationships;
unexamined external children are not an established empty set. Resolved opaque
targets, unresolved requests, indeterminate targets, platform-provided targets,
and unavailable analysis remain distinct wherever established by the provider.

Dependency cycle groupings remain presentation structures within the session,
not entities or independently selectable subjects.

Project-open failures, qualified results with encountered diagnostics, partial or
unavailable evaluation, failures preventing results, and unexpected defects remain
distinct. Project-open failure precedes an investigation projection. After
opening, diagnostics encountered on the requested analysis path qualify the
relevant information; unrelated compiler checks are not run merely to search
for diagnostics.
Dependency methods and evidence remain attributable to their claims, and source
disclosure, generated-output exclusion, and observations cover the resulting
views, navigation, omissions, and actual disclosures.

#### Rationale

Replacing whole headed decisions must not accidentally withdraw their still-valid
domain and storage commitments. These boundaries support accumulated analysis
without making session lifecycle a reason to redefine modules, groups, dependency
evidence, or presentation semantics.

#### Alternatives considered

- Replace fragments within the earlier headings: incompatible with the adopted
  decision-supersession lifecycle.
- Discard the other provisions when replacing those headings: an unintended
  architecture change.
- Change the decision lifecycle solely for this promotion: unnecessary; complete
  replacement decisions can retain the applicable provisions explicitly.

#### Consequences

The headings listed in Supersedes are replaced in full. The remaining headings in
their original bundles continue to govern. The restated provisions above and the
new session decisions supply the complete replacement, while earlier rationale
remains historical evidence.

## Supersession mapping

Every entry in Supersedes denotes a whole headed decision. The replacements are:

| Earlier headed decision | Replacement sections in this record |
| --- | --- |
| Core concepts: analysis and identity context | Session as the analysis and reference context; Stable reference bindings within a session; Retained domain and storage boundaries |
| Core concepts: lens/projection/presentation/view distinction | Immutable information within an accumulating session; Retained domain and storage boundaries |
| Projection architecture: record-oriented model | Session as the analysis and reference context; Immutable information within an accumulating session; Retained domain and storage boundaries |
| Projection architecture: ProgramRecordStore | Retained domain and storage boundaries |
| Projection architecture: deterministic logical identity | Session as the analysis and reference context; Stable reference bindings within a session |
| Inventory: qualified domain entities | Stable reference bindings within a session; Retained domain and storage boundaries |
| Inventory: repeatable snapshot references | Stable reference bindings within a session; Retained domain and storage boundaries |
| Identity constraints: analysis versus invocation identity | Session as the analysis and reference context; Command-scoped observations with session correlation |
| Organization: identities and relationships | Stable reference bindings within a session; Retained domain and storage boundaries |
| Organization: snapshot inputs | Stable inputs as the session precondition; Retained domain and storage boundaries |
| Dependencies: boundaries | Immutable information within an accumulating session; Retained domain and storage boundaries |
| Observations: invocation batches | Command-scoped observations with session correlation |
| Projection architecture: first-class projection and evaluation records | Immutable information within an accumulating session; Retained domain and storage boundaries |
| Inventory: Claim context and evaluation outcomes | Immutable information within an accumulating session; Retained domain and storage boundaries |
| Observations: automatic view recording | Command-scoped observations with session correlation |
| Organization: explicit separate schemes | Retained domain and storage boundaries |

The earlier unresolved logical/materialized projection identity discussion remains
historical; this record supplies the bounded answer needed for accumulated results.

## Governing and implementation impact

The [core concepts](../docs/core-concepts.md) replace Analysis snapshot with
Session and describe projections in that context. The
[architectural constraints](../docs/architectural-constraints.md) replace
snapshot-based identity requirements with stable session references and retained
evidence and method context.

Concrete implementation conventions are updated alongside implementation as
described in the plan. Unrelated qualification, source evidence, output safety,
language-boundary, and observation-sink requirements remain unchanged.

The adopted foundation already permits continuing investigations and accumulated
qualified information; no foundation change is required. Historical records
retain their original snapshot terminology.
