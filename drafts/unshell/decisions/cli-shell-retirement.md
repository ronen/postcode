# Retire the investigation CLI while preserving the application

Status: in preparation
Decided: 2026-11-25
Arising from: [Surgical CLI shell retirement](../plans/cli-shell-retirement.md)
Scope: retirement of the investigation CLI, its private host and exclusive core support; direct validation, precise references, terminal Session abort and the research-support gap

Supersedes:

- [Decision](execution-ownership-and-cancellation.md#decision), only private compiler-worker/parent composition and its host-specific consequences; retain acquisition, validity, ownership and cleanup distinctions, by [retire client](#retire-client).
- [Decision](execution-ownership-and-cancellation.md#decision), terminal Session-abort settlement/reporting, extended to the specified direct shutdown assessment, by [terminal abort](#terminal-abort).
- [Preserve typed application attribution and separate client context](internal-application-api.md#invocation-context), only CLI attachments, parser outcomes and adapter-specific invocation requirements, by [retire client](#retire-client).
- [Keep compact binding CLI-scoped and distinguish presentation outcomes](internal-application-api.md#cli-bindings-and-outcomes), compact allocation, binding ports and private operation scopes; preserve semantic outcome and publication distinctions, by [precise references](#precise-references).
- [Preserve runtime, publication and audience guarantees](internal-application-api.md#runtime-and-publication), CLI worker/finalization and deferred-check composition, CLI outputs and command-shaped feedback/sink implementation; preserve direct validation, credential, resource, audience and publication duties, by [retire client](#retire-client).
- [Preserve runtime, publication and audience guarantees](internal-application-api.md#runtime-and-publication), terminal Session-abort and separate-cleanup obligations are refined by the shared shutdown assessment, by [terminal abort](#terminal-abort).
- [Preserve runtime, publication and audience guarantees](internal-application-api.md#runtime-and-publication), required current observation/feedback service implementation, with its absence explicitly tracked, by [research gap](#research-gap).
- [Exact prior information as a subject](qualified-answers-over-contributions.md#exact-prior-information-as-a-subject), only continued CLI answer-alias acceptance; preserve exact subject meaning and kind checks, by [precise references](#precise-references).
- [Exact presentation and references](qualified-answers-over-contributions.md#exact-presentation-and-references), CLI present/continuation syntax, retired-family paging/format/disclosure controls, compact aliases/allocation schedules and retired CLI View identity/finalization formulas; retain exact qualified access and surviving artifact identity, by [precise references](#precise-references).
- [Qualified application access](qualified-answers-over-contributions.md#qualified-application-access), only acceptance/preservation of Session compact aliases and retired CLI refusal syntax, by [precise references](#precise-references).
- [Qualified construction and retained support](qualified-answers-over-contributions.md#qualified-construction-and-retained-support), only CLI binding/allocation ports, worker finalization and retired Presentation verification obligations, including incorporated predecessors; keep qualification, exact support and semantic verification, by [precise references](#precise-references).
- [Allocate only returned candidates on unsuccessful lookup](precise-subject-designations-and-lookup-bindings.md#unsuccessful-lookup-bindings), the whole allocation decision; qualified candidate population/resolution behavior remains required, by [precise references](#precise-references).
- [Accept raw same-Session record IDs as precise designations](precise-subject-designations-and-lookup-bindings.md#precise-subject-designations), only compact-input acceptance and compact/raw equivalence; preserve retained-ID, kind, Session and applicability validation, by [precise references](#precise-references).
- [Separate answer, View and report identity](qualified-construction-under-the-request-model.md#separate-answer-view-and-report-identity), only retired CLI View/arrangement formulas and worker-envelope/parent usage finalization; preserve separate answer/report identity and provenance, by [retire client](#retire-client).
- [Return unsettled applications as resolution results](lens-application-and-request-outcomes.md#return-unsettled-applications-as-resolution-results), only current CLI/worker-envelope delivery and one-shot-specific guidance; preserve returned qualified resolution information and reference lifetime, by [retire client](#retire-client).
- [Send to a sink and forget](initial-observation-recording-decisions.md#send-to-a-sink-and-forget), only the mandatory current ObservationSink production boundary and CLI discard/submission implementation; preserve general separation from archive/retention policy, by [research gap](#research-gap).
- [Local observation acceptance contract](local-observation-acceptance.md), the whole development-filesystem-sink implementation selection; general truthful acceptance/cleanup distinctions survive, by [research gap](#research-gap).
- [Choose capture for the research question](research-question-driven-observation.md#research-capture), only continued availability of the command-batch format/local sink and its use for existing explicit feedback; preserve question-selected research capture/delivery duties, by [research gap](#research-gap).
- [Retain local investigation context and explicit feedback](research-question-driven-observation.md#retained-understanding-and-context), only continued provision through the current CLI feedback interaction; preserve retained understanding and client-neutral feedback obligations, by [research gap](#research-gap).
- [Initial feedback interaction](human-facing-architectural-representations.md#initial-feedback-interaction), the shell and one-shot interaction selection, including the nested observation contract replaced below, by [research gap](#research-gap).
- [Observation context and delivery](human-facing-architectural-representations.md#feedback-observations), the command-correlated self-contained batch implementation; carry forward available actual context, no reconstruction and visible delivery failures, by [research gap](#research-gap).
- [Current observation provenance gap](coordinated-views-and-qualified-results.md#current-observation-provenance-gap), only the prospective remedy targeting the retiring observation export; preserve the historical finding and question-dependent basis-attribution need in the successor backlog, by [research gap](#research-gap).

- [Session as the analysis and reference context](transient-analysis-sessions.md#session-as-the-analysis-and-reference-context), only selection of shell/one-shot CLI lifetimes; preserve Session analysis/reference context, supported lifetime and precise-reference stability, by [retire client](#retire-client).

## Context

The next human interface is expected to be graphical and organized around the book
model. Retaining the investigation CLI would require maintaining another interface
and keeping it conformant as the design evolves. Direct application access and
validation already exist independently of that shell.

Some code under core exists only to support the retiring interface. Some apparently
unused capabilities retain a real application responsibility. Separation follows
surviving feature need, not source location, export status or an existing test. The
retirement includes its cost: no replacement human investigation interface, no
mechanical-family human Views, and no current feedback/observation submission path.

The direct dialog path can classify an interruption, then let participant cleanup
or final-report delivery throw over it. Attempt/work reports can consequently disagree.
The private host protects the distinction better. The useful guarantee belongs at
the application lifecycle boundary, independently of the retiring transport.

## Decisions

<a id="retire-client"></a>
### Retire the investigation client and its private host

Remove one-shot investigation commands, the interactive shell, CLI presentation and
classification, private adapter/operation scope, worker/protocol/finalization, and
exclusive scripts/dependencies. Preserve `npm run postcode` as authentication-only
CLI access with help and explicit rejection of retired commands before any project
opening or investigator setup. Preserve account/security behavior and safe terminal
output. No replacement investigation command or human interface is introduced.

Keep shared semantic request capture/validation, qualified resolution, acquisition,
analysis/investigation, Projection construction, exact retained access, attribution
and usage. Preserve ordinary pre/post-execution checks; remove the private transfer
of check ownership to CLI publication. Application result completion remains distinct
from later client presentation/publication failure. Keep the small neutral publication
guard. API receipt is not later display validity or authorization to expose internal
source-bearing support publicly.

Remove mechanical-family Presentations and their View/disclosure helpers. Family
analysis, qualified content and exact support remain. A future human client must
establish the intelligibility and disclosure of its actual output; the retired CLI's
classification is not transferable certification.

The surviving application executes in its caller's process. Retiring the worker
reverses the earlier host choice: compiler execution/state is no longer separated
into that worker thread, and its active synchronous-work termination boundary is
lost. The previous host used `node:worker_threads`, not general process-crash
containment. Direct callers already use in-process execution; retaining the private
host without its human client would preserve the maintenance burden being removed.
No new worker/process framework or future host selection is established.

Keep shared Presentation negotiation and its current direct-request defaults;
Expansion acquisition remains useful. Record the loss of negotiation's principal
client and its coupling to requirement selection in implemented architecture, with
later redesign distinguished from removable code. This decision does not choose a
consumption model for the book or its graphical interface, or retire unrelated domain
capabilities.

**Alternatives.** Keeping the shell preserves another design-conformance obligation.
Replacing its worker with a general host expands the goal without a current client.
Deleting all newly unused facilities ignores retained obligations. Retaining all
core exports preserves CLI-only responsibilities indefinitely. Select surgical
removal with explicit preservation, conformance gaps and documented residuals.

<a id="precise-references"></a>
### Preserve precise references and remove compact aliases

Remove compact Entity/answer/Investigram aliases, allocator maps, accepted compact
inputs, alias-only output metadata and scoped binding ports. No compatibility layer,
replacement short namespace or stable compact-spelling schedule remains required.
Retire alias-specific collision, preallocation and population-binding obligations.

Preserve precise identities and stable referents within their supported Session
lifetime, exact qualified support and answer identity, valid names/literal designations,
ambiguity and population qualification. Resolve actual retained targets and their
kind before Lens applicability; unknown, foreign, wrong-kind and known-incompatible
targets remain distinct. Names and wire handles are not canonical identities. Keep
supplied request spelling for attribution where applicable, without preserving
retired parser syntax or alias equivalence.

Exact retained access still retrieves fixed support without new Evaluation, selection
or evidence. Preserve composite versus mechanical-support identity, historical
qualification, relevant outcomes and immutable captured selections. Retire CLI
continuation commands, paging/format controls and View-specific identity formulas
with those Presentations; do not infer permission to change retained content or
the identity and method provenance of surviving artifacts.

Trial ordinary/fresh/follow-up connections use captured requests, precise targets
and exact option-owner/key addresses. Preserve them and qualified references while
removing alias metadata. Investigator wire handles and their validation remain a
separate active transport facility. No persistence or cross-Session validity is added.

**Rationale.** Compact references served human typing. Precise identity already serves
the surviving boundary. Keeping aliases only because tests, outputs and earlier
decisions mention them would retain the retired feature. The intentional input and
metadata change is compatible with the experimental-output policy only because the
specific preservation clauses are explicitly reconciled here.

<a id="terminal-abort"></a>
### Preserve terminal Session abort and separate shutdown failures

Abort ends the whole Session. It accepts no further investigation work; continuing
requires another Session. Retain access to final accounting and shutdown observation.
This lifecycle responsibility is retained for future application clients although
the surviving runners do not invoke abort; verification uses direct application tests.

For an opened Session, `interrupt()`, lifetime-signal abort and active `close()` share
the same terminal-abort guarantees. Idle close starts no request abort but exposes
retained shutdown failures. Abort is delivered when the host can run it, and execution
responds at cooperative checkpoints; it cannot interrupt blocking synchronous work
before control returns.

An active request terminated by abort settles as interrupted. Preserve the first
established terminal cause, including already established invalidation. Completion
is established after final validity checks and internal result/work finalization;
later abort cannot retroactively interrupt a completed request. Final work/attempt
records and known usage are retained internally before interrupted settlement.
Completed producing attempts retain their actual outcomes if the consuming request
is interrupted later; only a producing attempt stopped by abort is reported interrupted.
Cleanup or terminal-report notification failure cannot replace that outcome, erase
accounting or reclassify it as a defect. Missing measurements remain explicit; late
replies cannot add accepted content or alter sealed usage.

Request settlement does not await resource exit. `interrupt()` and `close()` expose
the same shutdown assessment, including request finalization, participant cleanup,
terminal-report delivery and owned-resource cleanup. Retain actual failures and
distinguish cleanup from reporting failure; expected request interruption alone is
not a shutdown failure. This expands `interrupt()` beyond its former Git-only cleanup
promise. Repeated shutdown calls do not repeat participant cleanup or lose failures.
Shutdown promises resolve after a clean assessment and reject with the retained,
distinguishable failure set otherwise; preserve underlying typed resource failures.

Observe internal asynchronous failures, retain signal-route failures and expose them
through later shutdown calls. Signal-only abort must not create an unhandled internal
cleanup rejection. If no caller observes shutdown, retained failures remain unobserved;
callers remain responsible for promises they explicitly request. A new reporting
callback is not the failure channel.

Resource-exit reporting uses the existing bounded Git cleanup assessment, with
termination/escalation and ownership/monitoring retained until confirmed exit. A
reporting deadline is not proof of exit. This is not an overall shutdown deadline:
participant close is synchronous today, and synchronous callbacks/computation cannot
be forcibly time-bounded in-process. No asynchronous participant lifecycle is introduced.
With injected `runGit`, subprocess ownership and cleanup belong to its caller; the
Session cannot claim confirmation for resources it does not own.

**Consequences.** Strengthen existing Session/dialog responsibilities, including
joining active finalization for shutdown, without introducing a general supervisor.
Protection of notifications is limited to terminal-abort finalization. Exceptions
from progress/work/report callbacks before a terminal outcome is established and
success-path callback policy retain existing behavior. This is not a general
callback-isolation guarantee. Initial opening retains its existing acquisition,
validation and cleanup obligations; the plan must report conflicts or uncovered
defects rather than silently broaden the active-Session correction.

<a id="validation-rendering"></a>
### Preserve direct validation and relocate its useful rendering

Existing direct trial runners remain development validation tools. Move useful
qualified explanation/state-diagram arrangement and rendering into their support;
retain structured results as authoritative. No second rendering path remains in
core. Keep domain state semantics, qualified selection and exact support in core.

Arrangement consumes supplied qualified information, adds no architectural claims
or acquisition, preserves alternatives and consequential qualification, and discloses
omitted/incompatible content. Its actual human-facing output must satisfy the human
output boundary. Existing qualification/omission tests do not establish full disclosure
conformance; assess the rendered output under the associated plan. Source-bearing
validation captures are not automatically human-facing output.

Preserve runner request sequence, capture, budget and lifecycle behavior, apart from
the explicitly specified alias metadata/input removal and core shutdown correction.
Do not redesign trial artifacts, publication, cleanup policy or reporting. Retire
shell-based scenarios, CLI comparison/output assessment and CLI/worker benchmark
drivers without replacement; preserve useful direct validation/measurement and
fixtures with surviving consumers. Historical validation records remain historical.

**Rationale.** Trials already call the application directly. Their renderer dependency
is a separation problem, not a reason to retain the CLI framework or redesign trials.
Equal-input comparisons with controlled participants establish preservation; independent
live model responses cannot serve as an equality oracle.

<a id="research-gap"></a>
### Remove unused research implementation without withdrawing its obligations

Remove the command-shaped feedback interaction/builders/snapshots, command-batch
envelope and unused observation sink/delivery implementation. Do not retain speculative
mechanics or create a consumer or general framework to justify them.

Preserve the foundation's research observation/delivery and human feedback obligations,
and the client-neutral representation-limit/feedback requirement. Feedback reports
experience, not program truth, correction or an instruction to investigate. Where
provided, retain available actual displayed artifacts, exact output and relevant
subject/basis/context without reconstruction, fabricated context or further
investigation; disclose missing context and delivery failure. Removing this client
does not turn requested feedback into an allowed silent no-op in a future client.

Research capture remains selected for the research question, with automatic capture
where reconstruction would be unreliable, sufficient interpretable context and
delivery to its designated destination. Ordinary non-research use need not record.
Capture is distinct from qualification, provenance, production exposure, accounting
and operational state. Preserve the generated-output evidence boundary. Delivery
acceptance, cleanup, retention, historical reading and caching remain distinct; failure
must not invalidate an independently delivered result. No particular replacement
schema, remote destination or GUI design is selected.

After retirement there is no human investigation interface and no implemented
feedback/observation capture and submission facility for that interaction. This is
an explicit capability gap, not foundation conformance or withdrawal of requirements.
The backlog item **Research observation and feedback support after CLI retirement**
is added with adoption to carry reconciliation outside this plan. It incorporates
the existing research-question-dependent captured-basis attribution need and replaces
obsolete CLI recording/export remedies. Do not claim complete captured-basis evidence
from displayed output, paths or references into a discarded Session.

**Alternatives.** Retaining the small sink would preserve code with no surviving
consumer. Replacing it now would require an unchosen interaction/research design.
Removing it with an explicit gap/backlog entry preserves the requirement without
pretending to have a suitable implementation. Foundation material is unchanged.

<a id="adoption"></a>
## Adoption and conformance

At adoption, the
CLI, worker, aliases and observation implementation still exist; direct abort still
has the cleanup/reporting exception problem. The associated plan reconciles those
gaps and verifies preservation. Until reconciliation, describe the current interface
and limitations accurately; do not advertise authentication-only access or complete
shutdown guarantees prematurely.

Trial-rendering disclosure conformance is unassessed beyond existing qualification
and omission checks. The plan requires focused baseline/output assessment and
disposition of material findings before declaring verification sufficient. The
post-retirement research/feedback gap persists beyond plan completion and is tracked
by the backlog item above.

Preserve all obligations outside the explicit supersession
scope, including immutable qualification, precise identity, unchanged-input validity,
generated-output exclusion, credential protection and useful information acquisition.
