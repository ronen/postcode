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

<a id="invocation-context"></a>
### Preserve typed application attribution and separate client context

Application requests and work
contexts describe the validated semantic operation, requirements and application
outcome. The application owns request correlation, purpose, execution constraints,
generating/consuming parents and work status. These contracts do not require CLI
format/detail fields or a Presentation.

A client may supply an optional, plain-data invocation attachment. Capture it
safely before asynchronous work, retaining representation/omission limits rather
than invoking accessors. Freeze it and carry it alongside application context,
including earlier parent contexts, without interpreting it as semantic authority
or including it in answer identity. The application never infers a request from
the resulting answer. Direct clients can omit the attachment entirely.

The CLI supplies its actual normalized invocation, including Presentation choices,
reference lifetime and supplied alias spelling. Its reporting adapter uses this
captured data to preserve existing `context.request` fields in CLI resolution and
usage JSON, observation requests and `request-work`, including generating parents.
Application types do not import the CLI context shape. The adapter projects existing
captured values into legacy fields; it does not reproduce request coordination,
work attribution, defaults or outcome decisions. Other clients consume the typed
application context and choose their own reporting representation.

Client-owned option eligibility is declarative input to shared compatibility.
The application matches opaque option values against captured client declarations
and semantic facts, preserving prospective refusal before lookup, resolved-family
checks and materialized compatibility. It owns resolution/refusal reporting even
when the unsatisfied condition was declared by a client. This finite matching
contract introduces neither executable client predicates nor a general rule engine.
Malformed CLI options remain rejected-input data through the shared safe-capture
and rejection path; retain the CLI parent's existing wholly-rejected-input route.
Do not convert these refusals into rendering exceptions.

**Rationale and alternatives.** Shared attribution needs the actual initiating
request and its parent history. Making the semantic context an opaque CLI request
would prevent a clean client-independent contract. Reconstructing invocation data
from answers loses explicit choices and cannot recover earlier parent requests.
A separate optional attachment preserves that information while the CLI-specific
output shape stays in its adapter and can retire with it.

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
client contract. Shared request coordination nevertheless continues to accept
Session aliases in reference designations and exact-answer targets. Resolve them
per request, preserving the supplied spelling in normalized context and attribution
and preserving current refusals; do not move lookup or unbound-alias handling into
the CLI. Precise IDs being sufficient does not make them the only valid input.
Already allocated coordination aliases may accompany results as optional fields.
A GUI displays names and retains precise IDs internally; whether
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
information request acquires the current subject-kind standard expansions carried
by its resolved answer family's content contract; callers may request a supported
subset. This means module expansions for module content, module and group expansions
for organization/dependency content, exports/documentation for module-export
content, and none for investigation content. Interpretation of a module does not
implicitly acquire its mechanical expansions. Required Lens support remains separate. Standard expansions
are domain-defined subject-kind detail and contribute to answer identity. Current
standard expansions are mechanical and inference-free. Revisit the default if a
future subject kind introduces a costly expansion, including inference. Matching
today's CLI defaults is a verification convenience, not this policy's rationale.
Exact retrieval never acquires missing expansions to satisfy this default.

Clients own Presentation declarations: acceptable content contracts, requirements,
preconditions and fallbacks. Supply them once at client composition or Session
opening. Application coordination validates semantic rules, captures and freezes
them before work; requests name choices among those captured declarations, not new
per-request descriptors. Keep format/display policy client-owned while shared
coordination performs the declarative eligibility match and produces refusals as
specified above. Expose semantic requirement descriptors, not CLI format lists,
as capability metadata.

Coordination owns prospective and resolved-subject compatibility, acquisition of
requirements before Evaluation, materialization checks, actual selection and its
inspectable reasons. Clients cannot silently relax explicit choices or reinterpret
partial materialization as an established empty answer. Arrangement and rendering
can be shared by clients with compatible consumption contracts.

Arrangement receives only fixed qualified content and supplied bindings or the
scoped binding capability currently supplied to the CLI as described below. It cannot request missing work or read
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

The store owns append-only, never-rebind alias infrastructure. Application
coordination owns population-wide mechanical allocations, fresh investigation-Lens
pre-allocation, resolution candidates, all association matches including off-page
matches, and separate answer aliases. Extract those allocations from current
mechanical Presentation wrappers without changing their relative order; supply
ID/alias maps to mechanical arrangement. Historical Investigram inspection keeps
its association allocation at the final port call described below. Exact access uses fixed support and never adds history enumeration.
Optional aliases do not oblige direct clients to use them.

The narrower port remains for investigation-View arrangement. Validate
each complete batch against the investigation content's `references` population
before allocation. Preserve traversal/revision-page order and subsequent navigable
module and any supplied candidate bindings. Historical Investigram inspection
then requests its complete association population through this port, including
off-page matches, after the displayed/navigation/candidate batches. That final
batch is population-wide, not page-driven, and cannot be moved ahead of arrangement
without changing allocation order. Mechanical content needs no new
reference-population schema.
Do not shrink mechanical/association populations to displayed rows or eagerly
bind the whole investigation population. The companion plan inventories the sites.

Supply this port only to the current CLI adapter at trusted composition, in its
worker or in-process test host. This is the current implementation scope, not a
revocation of the accepted permission for other Presentations to use a suitably
scoped port. Another client requires its own design; there is no general binding
API or parent-to-worker binding bridge.

A trusted internal operation-scope entry point acquires the application guard once,
providing a single-request executor over the same shared machinery and a revocable
binding capability. It does not nest an ordinary guarded call. Application code
imports no CLI adapter. The scope remains held through arrangement; revoke binding
on settlement, throw, invalidation or close, and permit no escape in returned data.

Application work finishes when
its request and required application validity checks finish. Complete all attribution
before finalization, including consumption of the selected associated-inspection
composite currently recorded after arrangement. Arrangement cannot append work to
a finalized report. A direct call's post-execution check precedes finalization,
so an invalidated direct result still has work status `invalidated`.

The CLI's trusted deferred path finalizes application work before arrangement and
retains the operation guard through arrangement. Its parent publication guard owns
the deferred validity checks. An expected `unknown-continuation` or unexpected
arrangement failure after application completion does not rewrite that report;
client presentation/publication has its own outcome. Application failures before
completion retain their distinct statuses. Parent interruption preserves whether
application completion was actually reported; a missing terminal report is not
inferred to have completed.

For `present` with `unknown-continuation`, application work changes from `failed`
to `completed`, while the CLI command/observation remains failed with exit 3 and
the same qualified View/guidance. The human also agreed that an unexpected
arrangement exception after completed work likewise leaves that report completed,
while the CLI keeps its exception classification, diagnostic and exit code.
This is an additional visible work-status change, agreed in the subsequent
general-boundary discussion rather than implied by the original exception.
Malformed input and compatibility refusals remain refused. Already-finalized work
stays unchanged when later publication fails,
as in the existing deferred CLI path. Retained investigation failure stays historical.

Keep observation batches at `formatVersion: 4`, with the new work-status meanings
explicitly documented under the experimental-output policy; no historical records
are rewritten or migration promised. The plan's outcome matrix enumerates the
changes and unchanged cases for verification.

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
supplied answer. Compose that same adapter in-process for tests and controlled
harnesses; do not preserve a second CLI-shaped Session implementation. Application
and domain modules do not import that client. Presentation location does not change
its responsibility.

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
not a client escape hatch. The CLI guard is neutral parent-side policy parameterized
by a check transport; its private worker-protocol deferral field transfers check
ownership to that guarded path. The CLI always defers to pre-output/post-output
checks through the worker; ordinary direct calls retain their own pre/post-execution
checks. In-process adapter tests can use local check transport. Client receipt of
content does not establish display or a later validity check.
Preserve the CLI failure/status and output contracts, including human-facing
JSON, source classification and terminal safety, except for the explicitly agreed
application-work-status changes and method-provenance separation in this decision. A future external-agent interface
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
depend on research capture. Direct non-recording clients currently have context-free
feedback. Displayed-result feedback remains CLI-only because its supplied snapshot
uses CLI batch-shaped records; another client's receipt/builder is separate work.
Keep delivery rejection distinct from accepted
delivery with a cleanup warning, and neither erases the delivered application
result. Preserve current CLI observation behavior and known export limitations.

**Rationale and alternatives.** Moving arrangement across threads is not necessary
to remove an import/ownership dependency and would increase transport scope.
Using the CLI worker as a composition host lets the existing ownership and
identity contracts remain intact. Turning observation storage into the source of
application state would violate its distinct lifetime and optional research role.

<a id="method-provenance"></a>
### Separate application methods from Presentation methods

The human directed identity separation within this task. Split the captured method
registry by responsibility. Application analysis inputs and Session method provenance
include application/domain/provider methods only; client Presentation methods belong
to the client that produces the View. A Presentation-method change alone must not
change analysis-input, evidence, Evaluation or Projection identity. Application
method changes continue to affect their responsible identities.

At the baseline, `identity.ts` mixes `presentation`, `investigationPresentation`
and `exportsPresentation` with application methods; `typescript/project.ts` captures
the entire registry in analysis inputs and Session provenance. Remove those three
Presentation entries from the application capture. Move the definitions to a
client-owned registry, retaining the shared mechanical method for module,
organization and dependency Views. Audit imports and every consumer of delivered
`methods`; the application executor must stop appending investigation Presentation
provenance. No presentation registry is injected into analysis merely to recreate
the old dependency.

Clients append the methods actually responsible for their delivered artifact to
its provenance. CLI View and investigation arrangement/finalization formulas keep
their responsible Presentation methods and authoritative usage inputs. A future
GUI defines its own Presentation method provenance without changing the Session.
The application API returns application provenance, and the CLI adapter supplies
CLI-specific method context for its output and observations. Do not claim a renderer
was used merely because its version is registered.

This deliberately changes the captured input/provenance model. Advance responsible
identity methods for that semantic change, including the input-capture method and
Session record method as applicable, with a concrete before/after explanation.
Downstream hashes and compact spellings may change across the baseline boundary;
no cross-build identity equality or persisted-reference migration is promised.
Preserve all other captured values, content, qualification, within-Session exact
identity and allocation schedule. Comparison must account for referential changes
explicitly rather than dropping provenance fields or globally normalizing hashes.

**Rationale and alternatives.** Retaining the mixed registry would make every
application client depend on CLI renderer versions even after import separation,
and would complicate CLI retirement. The one-time identity/provenance change is
within this task's human-directed scope. It establishes the same separation for
future clients without designing their View formulas or a method-plugin framework.

## Governing impact and conformance

Add the boundary to `app-specification.md` and `architectural-constraints.md` and
revise the complete Evaluation and Expansion definitions in `core-concepts.md`
together on acceptance. Standard detail may be required directly, explicitly or
by request default, without a Presentation; its subject-kind meaning and separation
from another Lens question remain unchanged. These are governing proposals, not
changes made by adopting a draft. No foundation or development-process revision
is required.

This decision supplements the existing answer/View identity rules. It replaces the
implementation's mixed method capture with the separated provenance rule above;
the earlier decision's description of the provider's then-current registry capture
is not a requirement to retain that incidental coupling. Current CLI-only port
provisioning scopes this implementation without withdrawing the existing broader
Presentation permission. No whole headed decision is superseded.

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

The outcome distinctions above and the human-directed method-provenance separation
are explicit implementation/reporting changes. Neither relocates worker alias
allocation, arrangement-key transport or parent usage finalization. Preserve the
remaining publication, qualification and identity contracts. No existing record's
historical rationale is rewritten.

The broader structured-account, account-presentation, GUI and external-agent work
remains independent. It may revise the API. Known captured-basis observation
export and navigation-origin gaps remain outside this change, without new claims
of durable replay, complete research attribution, or implemented graphical
navigation. Retaining useful command-line facilities does not settle the future
of the interactive human shell.
