# Transient analysis sessions

Status: in preparation
Arising from: [Transient interactive session shell](../plans/transient-session-shell.md)
Scope: session context, reference binding, accumulated analysis, and CLI/observation lifecycle
Supersedes: the scoped choices listed under [Supersession](#supersession).

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
Equivalent requests under equivalent inputs and methods remain semantically
comparable. Each claim retains its supporting evidence and method context;
neither session membership nor observation metadata supplies that support.

#### Rationale

Follow-up examination needs to acquire information while preserving the ongoing
investigation. An identity derived from a fixed observed-input set makes that
growth change the reference context. Hiding snapshot arguments would preserve
this mismatch. Capturing every possible input in advance would instead restrict
which follow-up analyses the investigation could support.

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

#### Consequences

Reference allocation must accommodate later discovery without rebinding earlier
references. Selection syntax and allocation mechanics are implementation choices.

### Immutable information within an accumulating session

Captured evidence, claims, evaluation outcomes, and produced projections remain
unchanged when later analysis adds information. Separate evaluation attempts
retain their own execution and materialization outcomes. Later success does not
erase earlier partiality or failure.

A produced projection identifies its subject, lens, parameters, session context,
selected claims, and relevant evaluation outcomes. Its supporting evidence and
method context remain attributable. It represents the information selected for
that projection rather than a live query over subsequently accumulated records.

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

#### Consequences

This resolves the materialized-projection identity question needed for this
slice without defining a universal logical-query identity. Future interpretation
augmentation or supersession can relate retained accounts; its semantics belong
to the summary slice.

### Stable inputs as the session precondition

The session assumes relevant project and analysis-environment inputs remain
unchanged. Capture is first-observed and non-atomic. Reading an input later in
the session does not establish its contents at session start.

Change detection is best-effort. A detected relevant input change invalidates the
session for further investigation, with restart as recovery. Absence of detection
is not proof of unchanged inputs. Tracking an evolving worktree and automatic
refresh are outside this lifecycle contract.

#### Rationale

Comprehensive concurrent-change detection would introduce a substantial validity
mechanism for a use case explicitly outside the session's precondition. The
bounded alternative supports accumulating analysis while refusing continuation
when the system knows that the assumption has been violated.

#### Consequences

The detection mechanism and coverage are implementation choices. The precondition
and detection limits remain explicit qualifications; they do not weaken stable
reference bindings or the integrity of captured evidence.

### Command-scoped observations with session correlation

A command is the observation-batch boundary within a session. Each batch is
self-contained and carries a session identifier and command order. The identifier
is constant within a session and distinguishes it from other sessions; its format
is an implementation choice. One-shot invocations use the same model.

Each batch remains interpretable without earlier batches or the transient program
store. Delivery occurs at command completion rather than being deferred until
session exit. The existing observation-content and delivery-failure contracts
continue to apply.

Session correlation does not turn observations into persisted operational state,
current program evidence, or a source for restoring reference bindings. The
observation sink and program store retain their separate ownership and lifecycles.

#### Rationale

A process-scoped batch would defer the record of an entire investigation until
exit. Command batches preserve independent delivery while session correlation
makes the sequence of examinations available to observation consumers.

#### Consequences

The observation model extends invocation-local context to related commands without
requiring producer-side persistence or historical reading. Sink retention policy
remains independent of session lifetime.

## Supersession

This decision supersedes the earlier choices to the extent specified below.
Unaffected decisions remain accepted, and the earlier rationale remains historical
evidence.

| Earlier decision | Replacement extent |
| --- | --- |
| [Initial core concepts: analysis and identity context](../../../docs/decisions/initial-core-concepts-decisions.md#include-only-the-analysis-and-identity-context-needed-by-the-definitions) | Replace Analysis snapshot with Session and its reference/evidence distinctions. |
| [Initial core concepts: lenses, projections and views](../../../docs/decisions/initial-core-concepts-decisions.md#preserve-the-lens-projection-presentation-and-view-distinction) | Replace the projection's snapshot scope with session and immutable result support; preserve lens/presentation distinctions. |
| [Projection architecture: record-oriented model](../../../docs/decisions/initial-projection-architecture-decisions.md#use-a-record-oriented-program-information-model) | Replace universal snapshot context with session records and attributable result evidence/method context. |
| [Projection architecture: storage boundary](../../../docs/decisions/initial-projection-architecture-decisions.md#isolate-storage-behind-programrecordstore) | Replace snapshot-scoped references with session bindings; preserve storage independence and separate lifecycle concerns. |
| [Projection architecture: deterministic logical identity](../../../docs/decisions/initial-projection-architecture-decisions.md#use-deterministic-logical-identity-independently-of-persistence) | Replace snapshot-derived, cross-invocation identity with session context and semantic comparability; persistence remains deferred. |
| [Inventory: qualified domain entities](../../../docs/decisions/initial-module-inventory-decisions.md#represent-modules-as-qualified-domain-entities) | Replace snapshot-scoped Entity IDs with session bindings; retain discovery, facets, and expansions. |
| [Inventory: repeatable snapshot references](../../../docs/decisions/initial-module-inventory-decisions.md#make-references-repeatable-but-snapshot-scoped) | Replace reference scope and repeatability with active-session binding and exact lookup semantics. |
| [Identity constraints: analysis versus invocation identity](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md#make-analysis-identity-independent-of-invocation-identity) | Replace snapshot hashing and deterministic cross-invocation IDs with result method attribution, session-local identity, and semantic comparability. |
| [Organization: identities and relationships](../../../docs/decisions/repository-organization-decisions.md#represent-groups-and-placement-with-qualified-identities-and-relationships) | Replace snapshot-scoped group IDs with session bindings; retain placement and naming meanings. |
| [Organization: snapshot inputs](../../../docs/decisions/repository-organization-decisions.md#extend-snapshot-identity-only-with-claim-relevant-organization-inputs) | Retain claim-relevant captured evidence and methods without a snapshot identity formula; apply session stability contract. |
| [Dependencies: boundaries](../../../docs/decisions/module-dependency-structure-decisions.md#preserve-external-diagnostic-evaluation-and-observation-boundaries) | Replace snapshot identity extension with session evidence/method attribution and observation behavior; preserve provider boundaries. |
| [Observations: invocation batches](../../../docs/decisions/initial-observation-recording-decisions.md#submit-self-contained-invocation-scoped-observation-batches) | Replace invocation batch scope with self-contained command batches and session correlation. |

The previous unresolved logical/materialized projection identity discussion remains
historical; this decision supplies the bounded answer needed for accumulated results.

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
