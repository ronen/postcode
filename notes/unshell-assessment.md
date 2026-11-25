# UNSHELL separation assessment

25 November 2026. Exploratory assessment, not an accepted decision, implementation
plan or implementation authorization. Read with [the discussion and earlier
evidence](unshell-planning.md). This assessment refines that note's provisional
residual register. It does not amend governing documents.

## Finding

The CLI/worker cluster can be retired without replacing the trial runner or
redesigning the application. Useful rendering can move to trial support. Several
core hooks exist solely to accommodate the CLI and can retire with it. A narrow
interruption correction is worthwhile for direct callers and future clients.

Two choices need discussion before formal drafting: whether removal of compact
aliases may deliberately change trial-result metadata, and whether to retire the
command-shaped feedback API or temporarily retain it until feedback has a new
client contract. Neither should be mislabeled as technically inseparable core.

## Dispositions

| Capability | Assessment and proposed disposition |
| --- | --- |
| Investigation commands, interactive shell and private worker | Retire the client, transport, worker composition, finalization and their exclusive dependencies. Keep authentication through a small entry point. No replacement worker framework. |
| Qualified explanation and state-diagram arrangement | Move the useful functions/types from `contributions/answers.ts` and renderer in `contributions/state-diagram.ts` into trial support. Keep answer selection/resolution and `state-model.ts` in core. Preserve qualifications, alternatives, incompatible-model handling and omission notices. |
| Private CLI operation scope | Remove `application/operation-scope.ts`, its registration in Session, private run/evaluate hooks and CLI adapter. Keep the contribution evaluator used by ordinary application execution. |
| CLI-only validation plumbing | Remove `InputConstraints`, `conflictingDesignation`/`reportHasInputs` transport, their exclusive refusal branches and private deferred postcheck route. Preserve public request capture, shape validation and ordinary pre/post-execution checks. |
| Shell work/usage presentation | Remove `incompleteWork` if no surviving consumer remains and `investigation/usage-presentation.ts`; keep RequestWork, work reporting and authoritative usage. |
| Compact Entity/answer/Investigram aliases | Technically removable through coordinated, finite changes; see the compatibility choice below. Do not retain merely because exported, tested or currently required by decisions. |
| Investigator wire handles | Keep. `investigation/openai/references.ts` provides separate per-dialog transport handles, with exact identity conversion/validation. Removing CLI aliases does not remove these. |
| Precise identities and retained access | Keep record identity, exact qualified support, subject resolution, retained Projection access, ordinary/fresh/follow-up requests and their attribution. Application `present` retrieves retained content; its name does not make it terminal rendering. |
| Application result metadata | Keep useful title, failure, reporting, basis and lifetime information. Remove proven CLI-only overrides with the private scope. Do not assume every field once displayed by CLI is disposable. Alias fields are addressed separately. |
| Presentation negotiation | Keep under the agreed scope boundary; record the unused client-facing facility and acquisition coupling described below. Do not introduce trial Presentations. |
| Expansion acquisition and mechanical analysis | Keep. These supply evidence and requirements for direct requests, investigation and anticipated BOOK use. No finding makes the Lens catalogue or analysis families shell-only. |
| Command feedback/envelope | A separable retirement candidate, with an unresolved product-contract choice below. No trial consumer was found. |
| Observation delivery/local sink | Preserve useful delivery semantics: explicit acceptance, independent operation outcome and post-publication cleanup warning. A future feedback schema is not required to retain these mechanics. |
| Publication guard | Keep the small neutral helper and its direct tests. Its pre/output/post distinction is useful future-client policy. Do not add it to the runner as part of migration. |
| Git execution ownership | Keep deadlines, termination/escalation, incomplete-cleanup reporting and ownership until confirmed exit. Direct callers already use it. |

Source removal must follow the dependency closure, including tests, package entry
points, scripts and dependencies. Terminal layout and its exclusive packages can
retire; terminal-safe escaping still used by authentication must survive. Similarly,
delete CLI view/classification helpers without deleting domain evidence or
qualification machinery with related names. The earlier note contains the detailed
test and script inventory; this assessment does not authorize broader script cleanup.

## Interruption worth keeping in core

The direct path already has terminal Session cancellation, guarded asynchronous
exchange, late-result rejection, usage sealing and Git ownership. The worker adds
host-specific supervision, but also protects the operation's outcome from cleanup
failure. That last responsibility is useful without a worker.

In `contributions/dialog.ts`, the catch classifies and rethrows interruption, then
the finally block calls `conversation.close()` and the final reporting callback.
Either can throw over the original failure. `application/session.ts` classifies
work from the resulting exception, so an interrupted attempt can accompany work
marked as a defect. The prior-session experiment reported exactly this mismatch
when agent close threw; source inspection in this assessment corroborates the path.
That experiment was not rerun here.

| Guarantee | Direct boundary assessment |
| --- | --- |
| Interruption is terminal; no subsequent request resumes discarded state | Already implemented; retain and verify. |
| Late agent replies/contributions cannot become accepted after interruption | Already guarded; preserve direct coverage when worker tests retire. |
| Usage dispatched before shutdown remains attributable; usage after sealing is ignored | Preserve the direct accounting rules and move meaningful late-usage tests out of CLI harnesses. |
| Request outcome remains interrupted even when participant cleanup fails | Gap worth correcting in core. Report cleanup failure separately, without changing attempt/work classification or swallowing the cleanup problem. |
| Final accounting/report remains available when cleanup fails | Keep internal capture reliable. Define reporting-callback exception behavior explicitly alongside cleanup behavior; external callback exceptions must not silently overwrite a settled interruption. |
| Request settlement, cleanup reporting and actual resource exit remain distinct | Keep. A bounded cleanup report is not confirmation of exit. |
| Hard termination of synchronous compiler work, parent reconciliation after worker loss, late transport-message suppression | Retire this worker's implementation. These require a host boundary and are not guarantees of an in-process API. Document the resulting limitation for future GUI hosting. |

Recommend strengthening the existing dialog/Session lifecycle rather than extracting
a generic supervisor. The design must specify where secondary cleanup failures are
observed and how final reporting completes. `Session.close()` is a candidate channel,
but currently does not join an active request; simply moving an exception there
would be incomplete. Specify ordering and ownership before selecting that API.
No new runner cancellation/publication policy follows from this change.

Verification should exercise real application orchestration with controlled agent
participants: interrupt during exchange, close failure, late reply/usage, final
attempt/work agreement, exactly-once close, repeated close/interruption, reporting
callback failure and existing Git ownership cases. Deliberate exceptional-path
changes must be documented separately from unchanged trial rendering.

## Choice 1: compact aliases and trial compatibility

CLI compact aliases and canonical identity are separate. BOOK needs exact identity
and support; the hosted investigator has its own wire handles. No surviving feature
need for CLI-style short aliases was established in this assessment.

Removal would touch these finite areas:

- Entity/answer binding maps and allocator methods in `identity.ts`, `records.ts`
  and the memory store; retain canonical lookup and kind/existence checks.
- `application/bindings.ts`, mechanical population allocation, executor deliveries
  and candidate reference construction; preserve meaningful selection and ambiguity.
- Retained-target resolution and contribution subject alias maps; keep precise
  Projection, Entity and Investigram access and exact subject validation.
- Compact-reference result fields, alias input acceptance and their tests; keep
  name resolution, literal designations and investigator wire-reference tests.

This changes shared API behavior and needs scoped decision amendments. That is
contract work, not evidence that core identity needs redesign.

However, the trial runner saves complete application results for non-contribution
steps, and the dialog14 runner also records complete results. Alias fields therefore
appear in artifacts even where the trial does not use them. Removing those fields
cannot truthfully be called fully unchanged trial behavior.

**Recommendation:** remove compact aliases in UNSHELL if the human accepts that
specific metadata/accepted-input change. Preserve qualified results, exact targets,
rendered explanations/diagrams and runner lifecycle. Compare artifact structure with
an explicit list of removed alias fields; do not normalize away other differences.
If unchanged artifacts means preserving those fields too, retain aliases temporarily
as compatibility residue, clearly labeled as such rather than a redesign dependency.

## Choice 2: feedback representation

`application/feedback.ts` takes a command number and command/records/events snapshot;
it emits version-four command observations containing stdout and command outcomes.
Its production consumer is the retiring CLI. It is not already a GUI feedback model.

The useful obligations are deliberate reporting, actual supplied display context,
honest missing-context notices, no reconstruction/investigation, and visible delivery
failure. The sink's file-publication algorithm itself only needs an artifact identity
and serializable payload; command event semantics are in the envelope/builders.

**Recommendation for discussion:** retire the command-specific feedback builders
and envelope, preserve useful delivery mechanics and their tests, and leave the GUI
feedback representation to GUI design. Any minimal transport type adjustment should
serve that separation only; do not design a general event protocol or wire it into
trials. State explicitly that there is no end-user feedback interaction during the
period without an investigation client, and retain the future-client obligations.

The alternative is retaining the small current feedback service and command envelope
until a new client contract is designed. If chosen, document it as deliberately
unused compatibility/transition code. It is not technically impossible to remove.
Accepted decisions currently require this interaction, so either disposition needs
an explicit scoped treatment; deleting the caller alone does not settle that policy.

## Actual residuals and future design

Shared Presentation negotiation is the main established coupled residual. Removing
the CLI removes its principal production client, but request requirement selection
and `standardRequirements` share coordination with still-needed Expansion acquisition.
The surviving boundary supports declarations, compatibility/refusal and consumption
metadata, with direct tests. Retain it under the explicit scope boundary. Future
removal should separate evidence requirements/acquisition from client presentation
negotiation and revise request/result contracts. That work should be justified by
the chosen BOOK/GUI consumption model, not merely by zero current client declarations.

Aliases and feedback are conditional residuals only if the choices above retain
them. The publication guard is a small useful retained policy, not an identified
redesign project. Qualified content, attribution, exact retrieval, Expansion
acquisition and resource ownership are active responsibilities, not dead residues.

The absence of hard preemption in-process is a host limitation to document, not a
reason to retain unused worker code in core. Future GUI hosting may need its own
execution boundary without inheriting this shell's protocol.

## Governing changes to draft after discussion

The retirement decision must scope its supersession by obligation, including
incorporated predecessor clauses. Historical rationale and records stay intact.

| Current governing location | Proposed treatment |
| --- | --- |
| `execution-ownership-and-cancellation.md`, Decision and Consequences | Supersede private compiler-worker/parent ownership selection and CLI-specific interfaces. Preserve terminal cancellation, separate settlement/cleanup/exit, Git ownership and captured-input validation. State the direct-process limitation. |
| `internal-application-api.md`, invocation context | Retire CLI attachments/parser outcomes/private adapter plumbing; preserve typed semantic attribution, safe capture and work/attempt reporting. |
| Same decision, CLI bindings and outcomes | Retire scoped CLI port and private operation route. Resolve alias provisions according to choice 1; retain useful execution/presentation/publication distinctions. |
| Same decision, runtime/publication/audience | Retire worker composition, parent finalization and CLI output obligations. Preserve ordinary direct checks, publication policy, resource ownership and internal-content versus human/public-export distinctions. Scope feedback/envelope changes according to choice 2. |
| `qualified-answers-over-contributions.md`, exact presentation/references, qualified access and construction | Preserve fixed retained support, qualifications, exact IDs, selection and identity. Retire CLI continuation rendering and worker finalization. Explicitly address alias acceptance/allocation schedules if removing aliases; do not broadly supersede retained access. |
| `precise-subject-designations-and-lookup-bindings.md` and inherited request/reference clauses | Preserve precise-ID validation, literal/name resolution and kind-aware behavior. Amend short-lookup spelling/namespace requirements only if aliases retire. |
| `research-question-driven-observation.md`, retained understanding/context and actual exposure, including incorporated feedback contract | Preserve question-selected capture and truthful display context. Resolve temporary absence of feedback interaction and command representation explicitly. No new mandatory capture or trial schema. |
| Application specification, concepts/constraints and current architecture/reference/setup docs | Reconcile current interface, private worker, binding and rendering claims while preserving applicable product and domain requirements. Any substantive governing change needs accepted decision support. |

Formal drafting must follow the relevant inheritance links for exact replacement
units; the table identifies affected obligations, not blanket supersession of all
documents containing the words CLI or worker. No foundation revision is indicated.
Do not edit steering or development-process instructions as part of this package.

## Verification boundary and next step

This assessment used source, tests, accepted decisions and BOOK/GUI planning context.
It makes no claim that proposed deletion builds or that the test suite passes.
The earlier nine runner experiments were controlled control-flow checks; they were
not live inference or complete application tests. Historical interruption evidence
is labeled above rather than presented as a fresh run.

Implementation verification should combine dependency/build checks, surviving
application/authentication tests, direct lifecycle coverage, moved rendering tests
and before/after runner artifact comparison with controlled equal inputs. Cover
ordinary/fresh/follow-up requests, alternatives, limited/unrendered content, state
diagrams and retained access. Preserve existing failure/cleanup behavior except
the separately accepted core interruption correction. Live trials can supplement
that evidence but cannot establish equality across nondeterministic agent responses.

Next: settle the two choices, then draft the scoped retirement decision, documentation
changes and implementation/verification plan. No implementation has begun.
