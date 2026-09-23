# Transient analysis sessions

Status: in preparation
Arising from: [Transient interactive session shell](../plans/transient-session-shell.md)
Scope: session context, reference binding, accumulated analysis, and CLI/observation lifecycle

This proposed decision is non-governing. Discussion has established the direction;
the package still requires human review and promotion. Command lifecycle details
marked proposed in the plan remain open and are not accepted by this document.

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

## Proposed decisions

### Use a session as the analysis and reference context

A session owns the continuing investigation and its accumulated program records.
The initial session opens one configured project. The shell retains it across
commands; a one-shot invocation creates and ends a short-lived session.

Replace the snapshot model rather than retaining a growing-input digest as the
hidden reference namespace. No frozen all-input capture is required before the
first view. New input acquisition is an ordinary consequence of a view request.

Session-local identities need not reproduce across independent invocations.
Equivalent requests under equivalent inputs and methods must remain semantically
comparable. Observation clocks and event UUIDs do not become claim content.
Digests may support evidence integrity and change detection without defining an
immutable snapshot object.

Rationale: the continuing context must survive evidence growth. Reproducible
cross-invocation navigation is no longer a product requirement. A wrapper around
fresh one-shot evaluation would leave the central accumulation problem unsolved.

### Bind references within the active session

Once a precise reference is bound to an entity, it must not be rebound. Additional
analysis, new allocations, or abbreviation collisions cannot change an existing
binding. Entity allocation remains grounded in the provider's established identity
rules, not labels, realpath equality, content equality, or inferred responsibility.

Names and generated handles are lookup inputs, not promises of unique identity.
Preserve honest zero/one/many results and generated provenance. Precise references
and exact lookups need unambiguous selection when their spellings collide; exact
syntax is a pre-implementation review question.

There is only the active session's reference namespace. An unknown reference is
invalid input; there is no other-session lookup or special stale-session diagnosis.
A typed spelling that happens to be valid denotes its active binding, just as any
other valid input would. Do not fall back from an invalid precise reference to
another subject-selection mechanism.

Remove --snapshot and cross-invocation ID navigation. Future cross-invocation
references belong to deliberately persisted sessions, with their own reopening
validity policy, not reconstruction by matching reference text.

Rationale: stable local bindings support human navigation without repeated scope
arguments. Persistence, not an ungainly command guard, is the appropriate future
home for continuity across process lifetimes.

### Retain results and coordinate additional analysis

Retain captured evidence and published results without mutation by later analysis.
Retain separate evaluation attempts and their applicability, availability,
execution, materialization, and reasons. Later success does not erase earlier
partiality, failure, or missing information.

Requests supply lens requirements and presentation-declared standard expansions
to evaluation. Evaluation reuses applicable completed work and requests missing
work. Projections select qualified materialized records; rendering cannot trigger
analysis or reread source. Accumulation does not require a universal scheduler.

A produced projection identifies its subject, lens, parameters, session, claims,
supporting evidence/method context, and relevant evaluation outcomes. It is an
immutable result, not a live query over everything subsequently stored. A repeated
request can reuse a suitable existing result or create another addressable result.
Session identity alone is insufficient as a cache key for all answers to that
request: newly available material and changed request requirements matter.

This resolves the immediate materialized-result identity question noted in the
initial core-concepts decision without requiring a separate universal logical-query
identity. Presentation parameters remain distinct from lens parameters.

Later interpretation augmentation or supersession must be explicit and preserve
earlier results; the summary slice defines those relationships and their meaning.
No generic supersession mechanism is implemented here.

Rationale: stable references and immutable results can coexist with expanding
knowledge. More evidence does not retroactively strengthen an earlier claim or
make a historical interpretation mechanically established.

### Assume stable inputs and invalidate on detected changes

The user is expected not to change relevant project or analysis-environment inputs
during a session, including through other agents, builds, or dependency installation.
Disclose this precondition and the non-atomic, first-observed capture limitation.

New analysis may read previously unobserved inputs under this assumption. It does
not establish their contents at session start. Comprehensive concurrent-change
detection, atomic capture, and tracking an evolving worktree are not promised.

Provide best-effort detection of relevant changes. A detected relevant change
invalidates the session for further investigation; restart is the recovery path.
Do not silently reopen or continue combining known-inconsistent inputs. How the
provider detects changes, and when checks occur, are implementation choices whose
coverage and limitations must be documented and tested. Absence of detection must
not be presented as proof of unchanged inputs.

Rationale: full invalidation machinery is disproportionate to a session whose
documented precondition excludes concurrent edits. Best-effort robustness does
not relax reference binding, retained evidence integrity, or claim qualification.

### Keep the interface interactive and transient

Retain the one-shot CLI and add an interactive shell using shared request
execution. Remove generated next-command text in both interfaces; use help and
documentation for command instruction. Keep Unicode and experimental structured
views and the existing conceptual/source distinction.

Public stdin/file batch use is deferred. The normal journey chooses subsequent
subjects from prior output. A useful adaptive scripting language would require
additional semantics, while test harnesses can already consume results and issue
follow-up requests through the shared boundary.

Do not introduce persistence, a daemon, GUI integration, managed workspaces,
new lenses, summary interpretation, implicit current-subject state, or automatic
refresh. The old --dependency-context mechanism must be reassessed during
implementation: the shell acquires requirements internally, and a flag whose
sole purpose was reproducing snapshot scope has no continuing purpose. Remove
it if no independently useful documented behavior remains; do not create a new
public analysis-control surface merely to preserve that mechanism.

### Observe commands independently within a session

Produce self-contained observation batches per command, with session correlation
and command order. Preserve requests, resolved subjects, qualified views, exact
output, relevant outcomes, and actual source disclosure. Include failures,
refusals, invalidation, and interruption where observable, without inventing
produced views.

Each submitted batch remains interpretable without earlier batches or the
ephemeral store. Send batches as commands complete, not only at session exit.
Session correlation does not require durable producer state or a historical-read
API. Observation records are not a persisted session or current program evidence.

Retain the existing local sink, privacy posture, generated-output exclusions, and
visible non-blocking delivery failure. Evolve the experimental format explicitly;
exact version/schema mechanics remain a pre-implementation review question.

Rationale: a process-scoped batch would defer evidence until exit and could lose
an entire investigation. Command batches preserve the existing self-contained
delivery boundary while adding the correlation needed for sequential use.

## Alternatives not selected

- Keep snapshots and hide --snapshot: retains the wrong growing-input identity
  dependency and unwanted cross-invocation contract.
- Capture every possible input before navigation: cannot accommodate open-ended
  follow-up analyses and makes eager preparation a product restriction.
- Guarantee complete change detection: unnecessary for the unchanged-input
  precondition and materially broader than best-effort robustness.
- Track changes and refresh automatically: risks retargeting and requires another
  continuity contract.
- Add persistence now: introduces retention, compatibility, reopening validity,
  concurrency, and recovery requirements without serving the initial journey.
- Treat observations as persistence: conflates historical use evidence with
  operational state.
- Add a command-file language for testing: adaptive harnesses can exercise the
  actual command boundary without a new product language.

## Proposed supersession map

On promotion, add reciprocal metadata to the earlier records without rewriting
their historical rationale. These are scoped replacements; unaffected decisions
remain accepted.

| Earlier decision | Replacement extent |
| --- | --- |
| [Initial core concepts: analysis and identity context](../../../docs/decisions/initial-core-concepts-decisions.md#include-only-the-analysis-and-identity-context-needed-by-the-definitions) | Replace Analysis snapshot with Session and its reference/evidence distinctions. |
| [Initial core concepts: lenses, projections and views](../../../docs/decisions/initial-core-concepts-decisions.md#preserve-the-lens-projection-presentation-and-view-distinction) | Replace the projection's snapshot scope with session and immutable result support; preserve lens/presentation distinctions. |
| [Projection architecture: record-oriented model](../../../docs/decisions/initial-projection-architecture-decisions.md#use-a-record-oriented-program-information-model) | Replace universal snapshot context with session records and attributable result evidence/method context. |
| [Projection architecture: storage boundary](../../../docs/decisions/initial-projection-architecture-decisions.md#isolate-storage-behind-programrecordstore) | Replace snapshot-scoped references with session bindings; preserve storage independence and separate lifecycle concerns. |
| [Projection architecture: deterministic logical identity](../../../docs/decisions/initial-projection-architecture-decisions.md#use-deterministic-logical-identity-independently-of-persistence) | Replace snapshot-derived, cross-invocation identity with session identity and semantic comparability; persistence remains deferred. |
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

Promote the proposed core concepts and architectural constraints with the accepted
decision when directed. The implementation-conventions revision removes obsolete
identity allocation and command-generation practices; its adoption must align with
implementation. Preserve all unrelated qualification, source evidence, output
safety, language-boundary, and observation-sink requirements.

The adopted foundation already permits continuing investigations and accumulated
qualified information; no foundation change is proposed. Existing implementation
and historical evidence continue to describe snapshots until implementation and
documentation are updated. This draft does not authorize code changes.
