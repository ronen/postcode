# Establish an internal application API independent of interfaces

Status: in review
Decided: pending human acceptance
Arising from: [Application/interface separation](../plans/application-interface-boundary.md)
Scope: existing application capabilities, their internal client boundary, CLI adaptation and extension policy

## Context

Qualified analysis and construction already have interface-independent contracts.
Current coordination nonetheless couples semantic request execution to CLI
Presentation types, bounded Views and rendered text. Some provider setup,
connection checking, feedback and delivery behavior is also implemented in
command-oriented modules. Reusing only the lower analysis functions would leave
new clients to reproduce resolution, retention, qualification and lifecycle policy.

The desired boundary covers existing functionality and allows later interfaces
and account capabilities to evolve it. It does not select a graphical framework,
external protocol or public library. The decisions below are interdependent.

[Needs review] The human has agreed with the five recommendations and supplied further
contract directions for the combined plan. Those directions are reflected below.
The detailed decision and coordinated governing revisions remain in review before
acceptance and promotion. The wording
below describes that agreed direction, not an adopted architecture.

## Decisions

<a id="shared-application-boundary"></a>
### Own application behavior behind explicit internal contracts

Application services own semantic request validation, qualified subject resolution,
information requirements, Evaluation and investigation coordination, immutable
answer construction and interpretation selection into answers, exact retained-answer
access, reference
validity, operational outcomes and resource lifecycle. Interfaces invoke these
services through explicit typed requests/results. They do not call lower-level
selectors or stores to recreate an application operation.

Interfaces own interaction, input syntax, surface-specific defaults and alias syntax,
Presentation declarations, arrangement, rendering and output delivery. They may
use shared Presentation utilities without making application execution depend on
any particular renderer. Clients remain free to choose which supplied answer to
display. Source-bearing internal content is not human disclosure
or an external-agent permission merely because it crosses this internal API.

Shared account/provider, feedback and observation-delivery services remain
cohesive responsibilities alongside investigation services. They need not be
methods of a project Session. Hosts own their selected runtime dependencies,
input/output mechanisms, actual display receipts and recording choices. Shared
services enforce their applicable validation, evidence exclusion, credential,
feedback and delivery contracts. No new general service container is required.

Keep this a logical internal boundary under `src/lib/`, with explicit intended
exports and inward dependencies. It is not a public package, separately versioned
SDK, network protocol, process architecture or universal client capability set.
Existing internal callers may migrate directly. Later capability tasks may extend
the contracts when concrete requirements justify it.

**Rationale and alternatives.** A facade over CLI execution retains format and
display assumptions. Giving each interface direct core access duplicates
application policy. A new public service would add compatibility, deployment and
authorization obligations without evidence of need. A small internal service
boundary isolates the responsibility that changes with application behavior.

<a id="qualified-content-delivery"></a>
### Deliver qualified answers independently of CLI Views

An information request identifies the Lens, subject designation, semantic
parameters and supported input context separately from client presentation. The
application API is the request-validation boundary for direct callers: invalid
inputs receive resolution outcomes; internal violations after validation remain
defects. Static typing alone does not establish that runtime input is valid.
An exact retained request identifies an answer rather than a repeated Lens
application. Usage and unsuccessful resolution remain non-Projection outcomes.
Keep request occurrence, current work/usage and delivery context separate from
the immutable answer's identity and retained semantic outcome.

For the currently eager families, deliver complete resolved qualified content
through the intended API. Reuse family contracts and expose the selected answer,
supporting contexts/bases, relevant outcomes, relationships, full interpretation
and revision/association snapshots and precise references. Preserve composite
versus mechanical-support identity. Do not make bounded CLI JSON the content
contract, or expose a general read-only store in place of that contract.

Exact access follows fixed support only, without lookup/reselection, Evaluation,
new evidence or provider calls. A retained failed or unavailable answer can be
successfully retrieved without replaying its failure or charging inference.
Unknown, foreign and wrong-kind targets and unsupported consumption requirements
have explicit outcomes. Broken required support remains a defect. Retention does
not extend Session lifetime, and exact access does not restore a discarded or
invalidated Session.

Precise IDs are sufficient for answers, resolution candidates and follow-up
subjects. Compact aliases are a CLI typing affordance, not a required general
client contract. Already allocated coordination aliases may accompany results as
optional fields. A GUI displays names and retains precise IDs internally; whether
external agents need short references is deferred to their interface design.

Delivered content, reports and progress events are plain structured-clone-safe
data, without class instances, functions, store handles or compiler objects. Keep
host-supplied reference lifetime and publication context, including repository root
or its unavailability and method provenance, beside the answer. One-shot expiry is
a fact supplied by the host, not a Lens parameter. Preserve its effect on View
identity and guidance without altering answer identity.

This delivery is an internal application value, not a newly retained Projection
or View, nor a promise of a stable external serialization. It need not be stored a
second time. Existing answer identity, immutable-payload consistency, qualifications
and binding rules continue to apply.

**Rationale and alternatives.** Existing full-content resolvers and frozen
selections already provide the essential contract. A second universal account
model would duplicate them and anticipate unresolved structured-account design.
A View-only result loses information beyond display bounds. A generic store gives
clients enough authority to broaden an answer accidentally. Full selected content
is the bounded reuse of existing capability needed here.

<a id="requirements-and-presentations"></a>
### Share requirements coordination while clients own Presentations

Content requests do not require a CLI Presentation. By default, a direct
information request acquires all current standard expansions for the subject kinds
of its answer family; callers may request a supported subset. Standard expansions
are domain-defined subject-kind detail and contribute to answer identity. Current
standard expansions are mechanical and inference-free. Revisit the default if a
future subject kind introduces a costly expansion, including inference. Matching
today's CLI defaults is a verification convenience, not this policy's rationale.
Exact retrieval never acquires missing expansions to satisfy this default.

Clients own Presentation declarations: acceptable content contracts, requirements,
preconditions and fallbacks. Supply them once at client composition or Session
opening. Application coordination validates semantic rules, captures and freezes
them before work; requests name choices among those captured declarations, not new
per-request descriptors. Keep format/display eligibility client-owned and expose
semantic requirement descriptors, not CLI format lists, as capability metadata.

Coordination owns prospective and resolved-subject compatibility, acquisition of
requirements before Evaluation, materialization checks, actual selection and its
inspectable reasons. Clients cannot silently relax explicit choices or reinterpret
partial materialization as an established empty answer. Arrangement and rendering
can be shared by clients with compatible consumption contracts.

Arrangement receives only fixed qualified content and supplied bindings or the
CLI-only scoped binding capability described below. It cannot request missing work or read
current history. Exact content compatibility never acquires support absent from
that answer. Rendering a different perspective is permitted only when supplied
content establishes it; deriving another architectural claim requires analysis.

**Rationale and alternatives.** Keeping all compatibility in the CLI would make a
future client reproduce semantic selection rules. Putting terminal options and
renderers in application execution would preserve the coupling being removed.
Separating declarations from their rendering implementation preserves the current
contracts without introducing a generic planner or plugin language.

<a id="cli-bindings-and-outcomes"></a>
### Keep compact binding CLI-scoped and distinguish presentation outcomes

The store owns append-only, never-rebind alias infrastructure. Preserve shared
coordination-time allocations for resolution candidates and constructed populations,
and answer-alias coordination. Optional aliases do not oblige non-CLI clients to
use them or require another interface's binding design now.

Supply arrangement-time binding only to the CLI client at worker composition,
validated against the answer's supplied reference population. Preserve today's
page-driven batches/order; do not preallocate every reference in complete content.
The serialized CLI requesting operation encloses application execution and CLI
arrangement. Its binding capability expires at operation settlement and is revoked
on invalidation or close. It has no query/selection authority, cannot escape in
returned content, and is not a general API operation. Ordinary direct clients use
precise IDs. No parent-to-worker binding bridge is introduced.

Application work outcomes describe application work. When an answer has been
produced/retrieved and CLI arrangement reports `unknown-continuation`, application
work is `completed`; CLI publication and observation outcomes record presentation
failure and exit status remains 3. Do not amend the completed application report to
represent a client failure. The observation application-work-status field changes
from `failed` to `completed` for this case; this is an agreed visible change.
Malformed request syntax remains refusal and a retained investigation failure
remains historical. Preserve the qualified View, selected answer and continuation
behavior independently of those outcome distinctions.

**Rationale and alternatives.** Display-driven alias allocation cannot be replaced
by eager full-population binding without changing collision schedules. A general
binding operation or bridge is unnecessary when only the CLI needs this affordance.
Separating application and presentation outcomes avoids making successful exact
retrieval depend on a CLI paging choice. Keeping command failure visible preserves
the actual experience without misclassifying application work.

<a id="runtime-and-publication"></a>
### Preserve runtime, publication and audience guarantees

The internal API is callable in-process using the current asynchronous lifecycle.
The CLI continues to run compiler work in its private worker. A CLI client at that
worker's composition boundary invokes application services and then arranges the
supplied answer. Application and domain modules do not import that client.
Presentation location does not change its responsibility.

Retain worker-side binding/alias coordination, the explicit usage-independent
investigation arrangement key, and self-sufficient parent usage finalization and
rendering. Keep Git ownership, provider credentials/dialogues, usage accounting and
observation delivery in the non-disposable parent where currently required. Direct
callers own their resources in the calling process. Preserve one active operation,
terminal cancellation, no late publication, and separate cleanup reporting. Expose the
existing work/attempt progress and final-report channels through typed callbacks,
independently of rendering and recording. Lifecycle outcomes distinguish busy,
closed, invalidated, interrupted and incomplete cleanup; a concurrent call produces
typed busy without disturbing the active operation. No new worker protocol for
other clients is established by this decision. A GUI host will probably need worker
hosting and full-content transport over the same plain-data contracts, without CLI
alias binding; that belongs to its own task.

Keep input validation before/after execution and share pre-output/post-output
validity policy through a publication guard. A bare `deferPublicationCheck` flag is
not a client escape hatch; any internal deferral is owned by the guarded path. Client receipt of content does
not establish that it was shown or that validity was checked at a later display.
Preserve the CLI failure/status and output contracts, including human-facing
JSON, source classification and terminal safety, except for the explicitly agreed
application-work-status change above. A future external-agent interface
must declare its consumption/access contract separately; an agent invoking the
current CLI still receives the CLI's human-facing output.

Future human clients must reuse or re-establish verified intelligibility and
source-disclosure classification for their actual output. Existing classification
of CLI Views does not automatically establish that a GUI may display raw API
content. The internal payload is not a ready-made public JSON or external-agent
export.

Observation batch content construction and classification over CLI Views remain
CLI-owned. A neutral module owns the batch envelope, local sink and delivery
acknowledgment, without type/runtime dependencies on CLI Views or classifiers.
Feedback depends only on those neutral contracts. Generalized observation content
construction and optional recording controls are outside this decision.

Feedback uses available actual-display context and exact output without
reconstruction or new investigation. Application attribution and usage do not
depend on research capture. Preserve explicit feedback delivery even when a caller
does not record ordinary requests. Keep delivery rejection distinct from accepted
delivery with a cleanup warning, and neither erases the delivered application
result. Preserve current CLI observation behavior and known export limitations.

**Rationale and alternatives.** Moving arrangement across threads is not necessary
to remove an import/ownership dependency and would increase transport scope.
Using the CLI worker as a composition host lets the existing ownership and
identity contracts remain intact. Turning observation storage into the source of
application state would violate its distinct lifetime and optional research role.

## Governing impact and conformance

This decision supplements existing decisions; it does not supersede a headed
decision or change a core-concept definition. Add the explicit boundary to
`app-specification.md` and `architectural-constraints.md` on acceptance. No
foundation or development-process revision is required.

Preserve the current successors in
[research-question-driven observation](research-question-driven-observation.md),
the [qualified construction identity rules](qualified-construction-under-the-request-model.md),
[exact answer rules](exact-retained-answer-presentation.md),
[request-model compatibility](lens-application-and-request-outcomes.md),
[reference designation rules](precise-subject-designations-and-lookup-bindings.md),
and [execution ownership](execution-ownership-and-cancellation.md). Worker alias
allocation, arrangement-key transport and authoritative parent finalization remain
unchanged under this proposal, so their preservation clauses require no exception.

The baseline Session, request/report and account-command couplings identified in
the companion plan do not yet conform to this stronger application boundary.
Adoption is not a conformance claim. The associated implementation must establish
conformance for all scoped current capabilities, with direct API and adapted CLI
verification; no CLI-only semantic execution path is deferred past completion.

The human-directed outcome distinction above is a scoped implementation/reporting
change, not a relocation of worker alias allocation, arrangement-key transport or
parent usage finalization. Preserve the remaining publication, qualification and
identity contracts. No existing record's historical rationale is rewritten.

The broader structured-account, account-presentation, GUI and external-agent work
remains independent. It may revise the API. Known captured-basis observation
export and navigation-origin gaps remain outside this change, without new claims
of durable replay, complete research attribution, or implemented graphical
navigation. Retaining useful command-line facilities does not settle the future
of the interactive human shell.
