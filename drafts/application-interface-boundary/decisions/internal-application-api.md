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

[Needs review] The human must accept these choices before promotion. The wording
below describes the recommended decision, not an already settled architecture.

## Decisions

<a id="shared-application-boundary"></a>
### Own application behavior behind explicit internal contracts

Application services own semantic request validation, qualified subject resolution,
information requirements, Evaluation and investigation coordination, immutable
answer construction and selection, exact retained-answer access, reference
validity, operational outcomes and resource lifecycle. Interfaces invoke these
services through explicit typed requests/results. They do not call lower-level
selectors or stores to recreate an application operation.

Interfaces own interaction, input syntax, surface-specific defaults and aliases,
Presentation declarations, arrangement, rendering and output delivery. They may
use shared Presentation utilities without making application execution depend on
any particular renderer. Source-bearing internal content is not human disclosure
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
parameters and supported input context separately from client presentation.
An exact retained request identifies an answer rather than a repeated Lens
application. Usage and unsuccessful resolution remain non-Projection outcomes.
Keep request occurrence, current work/usage and delivery context separate from
the immutable answer's identity and retained semantic outcome.

For the currently eager families, deliver complete resolved qualified content
through the intended API. Reuse family contracts and expose the selected answer,
supporting contexts/bases, relevant outcomes, relationships, full interpretation
and revision/association snapshots and coordinated references. Preserve composite
versus mechanical-support identity. Do not make bounded CLI JSON the content
contract, or expose a general read-only store in place of that contract.

Exact access follows fixed support only, without lookup/reselection, Evaluation,
new evidence or provider calls. A retained failed or unavailable answer can be
successfully retrieved without replaying its failure or charging inference.
Unknown, foreign and wrong-kind targets and unsupported consumption requirements
have explicit outcomes. Broken required support remains a defect. Retention does
not extend Session lifetime, and exact access does not restore a discarded or
invalidated Session.

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

Content requests do not require a CLI Presentation. They can request supported
information requirements through the current finite family/standard-expansion
contracts. Presentation-driven requests still declare their requirements before
Evaluation, preserving compatibility and materialization checks.

Each client owns its Presentation declarations and options. For an explicit
Presentation, it supplies the shared coordinator with a captured, bounded
description of acceptable content contracts, requirements, preconditions and
fallbacks. Keep options that only affect rendering out of semantic Lens inputs.
Coordination owns prospective and resolved-subject compatibility, acquisition of
required information, materialization checks, actual selection and inspectable
reasons. The client owns how its format/detail options select the permitted
declarations. It cannot silently relax explicit choices or reinterpret partial
materialization as an established empty answer.

Arrangement receives only fixed qualified content and supplied bindings or the
already permitted binding-only capability. It cannot request missing work or read
current history. Exact content compatibility never acquires support absent from
that answer. Rendering a different perspective is permitted only when supplied
content establishes it; deriving another architectural claim requires analysis.

**Rationale and alternatives.** Keeping all compatibility in the CLI would make a
future client reproduce semantic selection rules. Putting terminal options and
renderers in application execution would preserve the coupling being removed.
Separating declarations from their rendering implementation preserves the current
contracts without introducing a generic planner or plugin language.

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
terminal cancellation, no late publication, and separate cleanup reporting. No new
worker protocol for other clients is established by this decision.

Keep input validation before/after execution and the explicit deferred-publication
contract with pre-output and post-output checks. Client receipt of content does
not establish that it was shown or that validity was checked at a later display.
Preserve the current CLI failure/status and output contracts, including human-facing
JSON, source classification and terminal safety. A future external-agent interface
must declare its consumption/access contract separately; an agent invoking the
current CLI still receives the CLI's human-facing output.

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

The broader structured-account, account-presentation, GUI and external-agent work
remains independent. It may revise the API. Known captured-basis observation
export and navigation-origin gaps remain outside this change, without new claims
of durable replay, complete research attribution, or implemented graphical
navigation. Retaining useful command-line facilities does not settle the future
of the interactive human shell.
