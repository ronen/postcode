# UNSHELL planning

Exploratory working notes, 25 November 2026. Not an approved implementation plan,
accepted architectural decision, or implementation authorization. Formal drafting
follows discussion of consequential choices. Implementation belongs in a separate chat.

The [UNSHELL proposal](unshell-proposal.md) is the current synthesis for discussion.
The human directed that a well-defined proposal in notes precede an implementation
plan. Formal drafting waits for the remaining design questions in that proposal.

The subsequent [separation assessment](unshell-assessment.md) refines the provisional
dispositions and residual register below, identifies the worthwhile core interruption
correction, and records the two concrete compatibility choices for discussion.

## Baseline and provenance

Planning branch: `codex/unshell-planning`, created from published `main` at
`5f9534aeee06996843c74548a3083b11df8815bf`. Fetch and comparison confirmed local and
remote main agree. The BOOK worktree remains separate and unchanged.

The earlier session's UNSHELL handoff supplies discussion context and a reported
experiment. Its recommendations are provisional. Historical BOOK material was read
with `git show` from `fa66c8a99a68ba589f29629c6bfe1d29421fed20`:
`notes/book-migration-map.md`, `notes/book-implementation-survey.md`, and relevant
migration discussion in `notes/book-planning-discussion.md`. Its source baseline
was `dded8b7`; the difference to this baseline affects only planning guidance and
steering, not implementation or tests. Broader BOOK proposals are not imported.

## Goal and boundary

Retire end-user investigation commands, the interactive shell, their private worker
host/protocol/adapter, CLI arrangement/rendering, and code made unused by those
removals. Preserve authentication through a small command entry point. Adapt the
existing structured-account trial runner for development validation through the
application boundary. Preserve useful results, diagnostics and accounting.

Shared application Presentation negotiation, Expansion acquisition, and new book
capabilities are outside this work. GUI launching, a replacement development CLI,
a shared worker API and speculative GUI hosting are also outside it. Preserve core
resource/lifecycle/accounting behavior that still has a use. Extract additional
support only for subtle correctness logic with a concrete surviving responsibility.

The surviving application remains an internal API with qualified content, not a
new public serialization or a human-facing source export. Removing end-user commands
creates a deliberate period with authentication and development validation access,
but no replacement end-user investigation interface. Document that accurately.

## Discussion decisions

### Keep interruption scope surgical — human direction, 25 November 2026

> actually i overreached -- our UNSHELL remit doesn't need to include any mention of individual request cancellation at all. That wasn't part of the CLI shell, so is not an issue that needs discussing regarding surgical CLI shell removal.

The proposal retains terminal Session abort and the accounting/cleanup guarantees.
The deferred capability discussion introduced below is withdrawn from UNSHELL;
it creates no follow-up or backlog requirement for this work.

### Terminal Session abort and deferred request cancellation — human direction, 25 November 2026

> OK, let's preserve the existing terminal Session-abort capability and the proposed accounting/cleanup guarantees within UNSHELL. But we shouldn't treat it as the settled design for cancelling an individual GUI investigation. Let's identify request-level cancellation with a reusable Session as a deferred separate capability question.

The [proposal](unshell-proposal.md#terminal-session-abort) now specifies interrupted
request outcome, internally retained final accounting, separately observable cleanup
and final-report delivery failures, shutdown coordination and repeated-shutdown
behavior. It preserves terminal Session abort without selecting a GUI cancellation
interaction. Cancellation of one request with a reusable Session remains a distinct
deferred capability question, not an implementation commitment or a UNSHELL feature.

### Research observation disposition — human direction, 25 November 2026

> for research observation, i'd say: Choose option 2. Remove the unused implementation and explicitly document the resulting capability gap, preserving the foundation obligations. Identify what research capture and delivery the trial runner currently supports. Report the remaining gap.

The [proposal's research observation section](unshell-proposal.md#research-observation-capture-and-delivery)
now defines removal of the unused sink/delivery implementation, surviving direct
trial capture and local delivery, and the remaining capability gap. This settles
the delivery-mechanics question recorded below. Foundation obligations remain;
no GUI feedback design or replacement delivery framework is included.

The capture account was checked against both current structured-account runners,
their request-budget helper and the accepted research-capture contract. This was
source inspection, not a new live trial or verification of complete research capture.

### Alias and feedback disposition — human direction, 25 November 2026

> Agreed on both. Preserve precise identities, qualified references and the runner’s ability to connect trial steps; compact-alias metadata need not remain compatible. Remove CLI-specific feedback representation, retaining delivery mechanics only where still useful to an actual consumer. GUI feedback design is out of scope.

This settles alias removal without preserving compact-alias metadata compatibility.
Preserve exact identities, qualified support and trial step connections. The runner's
follow-up route already uses the selected option's precise Investigram address;
fresh steps reuse the earlier captured request. Both need regression verification.

Remove CLI-specific feedback representation. A consumer audit found no surviving
production caller of `deliverObservation` or `localFileObservationSink`: callers
belong to the retiring CLI and its measurement scripts; other uses are tests.
The trial runner writes its artifacts directly. Do not add a new caller merely to
justify retaining the sink, or design GUI feedback in UNSHELL.

The human then asked:

> ...but is the observation sink needed for the foundation design?

The foundation's [research observation support](../foundation/product-design.md#research-observation-support)
requires support for research recording and delivery to a designated research
destination. Its [feedback provision](../foundation/product-design.md#inadequate-representations)
also remains applicable to the intended human-facing product. Neither prescribes
the current command-batch envelope or a particular sink API. The accepted
[research-capture decision](../docs/decisions/research-question-driven-observation.md#research-capture)
preserves acceptance/failure distinctions and the current sink's protections when
used, without requiring that format for every research question.

The agent's immediate recommendation to remove the sink based solely on no surviving
caller was too strong. Trial file capture is a concrete surviving path, not evidence
that the foundation's broader recording/delivery requirement is fully satisfied.
Preserve that requirement and distinguish it from the implementation's reachability.
Whether to retain the reusable delivery mechanics as an explicit foundation-driven
exception to the actual-consumer criterion remains under discussion. No sink
retention/removal implementation or governing revision has been made.

### Validation artifacts — human direction, 25 November 2026

> Preserve the existing qualified explanations and state diagrams where they support live validation, moving any validation-only arrangement/rendering into trial-runner support. Keep the structured results as the authoritative artifacts. Preserve alternatives, limitations and unrendered-content notices so the rendered artifacts remain faithful to those results. This does not require retaining the CLI presentation framework or maintaining a separate rendering path in core.

This settles the direction for trial presentation. It does not adopt a formal plan
or amend governing documents. Structured results remain authoritative; this does
not authorize changing their schema, capture ordering or failure behavior.

### Surgical separation — human direction, 25 November 2026

> ok yes, our goal should be to move the rendering code over and then verify that the trial behavior is unchanged.

> Our overall attitude should be "surgical separation and removal of the CLI shell"

Use this as the scope criterion throughout UNSHELL: separate responsibilities with
surviving consumers, remove the retiring CLI client and its private machinery, and
verify that surviving behavior is unchanged. The original retirement boundary still
includes one-shot investigation commands and the private worker; authentication
remains. Do not bundle improvements to surviving application contracts, trial
artifacts, cancellation policy or lifecycle behavior merely because inspection
revealed an opportunity or an existing defect. The interruption-guarantee preservation
exception below is part of the separation assessment. Any other necessary behavioral
departure must be identified and discussed separately before inclusion.

The trial runner already uses the application directly and does not depend on the
shell or worker. Move its useful arrangement/rendering and redirect imports while
preserving the existing trial behavior. There is no new trial-publication or
execution-architecture decision required by that move.

### Preserve valuable core guarantees and document residuals — human direction, 25 November 2026

> ...where the separation will include adding a core capability around interruption guarantees, if that is worth keeping for future clients.  Plus documenting whatever unused/unneeded capabilities remain in the core but are not removable surgically, i.e. that need some redesign of core

Surgical separation includes preserving worthwhile interruption guarantees in core,
including adding a narrowly scoped capability when the retiring host is their only
adequate implementation. This is conditional on demonstrated value, not a requirement
to invent an abstraction. Prefer strengthening existing lifecycle responsibilities
when sufficient. The direct application boundary supplies a concrete home and consumer;
future clients should not have to reconstruct the same correctness policy.

Document residual core capabilities that become unused or unnecessary but cannot be
removed through local separation. For each, record the remaining consumers or lack
of them, the contract/coupling preventing surgical removal, and the redesign needed
for later retirement. Distinguish implementation reachability, useful responsibility
and adopted obligations. Document a limitation honestly rather than describing all
retained machinery as necessary or all CLI-originated machinery as dead.

### Core location does not imply retention — human direction, 25 November 2026

> also surgical removal can include removing core capabilities whose purpose was only for CLI shell support.  of course being careful not to remove core functionality that will be needed for the future book model and gui

> ...or even if CLI support wasn't its express purpose, if it is to support features that only CLI shell needed -- we can discuss things that are unclear

Assess actual feature needs and dependencies, not directory location, original intent
or a general-purpose name. A capability is a removal candidate when the features it
supports were needed only by the retiring CLI, even if it was designed as general core
functionality. Remove it when it can be separated without losing behavior needed by
surviving consumers or the intended BOOK and GUI. An exported function, an existing
test or CLI-oriented wording in an accepted
decision does not by itself justify retaining its implementation. Reconcile affected
governing clauses through the retirement planning package where necessary.

Where need or separability is unclear, bring the specific capability, its current
feature/consumer dependencies, plausible BOOK/GUI need and removal consequences to
the human for discussion. Do not silently settle uncertainty through either deletion
or indefinite retention.

For each candidate:

1. **Remove surgically** when its responsibility ends with the CLI and local separation
   preserves the needed core behavior. Private operation scopes, worker-only work
   finalization helpers and CLI-specific binding affordances are candidates even when
   implemented under application/core directories.
2. **Keep or extract the needed responsibility** when current consumers or concrete
   BOOK/GUI requirements depend on it. Preserve qualified content and exact references,
   analysis/acquisition, retained support, lifecycle/resource/accounting guarantees,
   and useful feedback/delivery responsibilities. This does not preserve every current
   CLI-shaped representation of those responsibilities.
3. **Document a residual requiring redesign** only when unnecessary CLI support is
   entangled with needed core behavior and cannot be removed locally. Name the actual
   coupling and required redesign; neither an API export nor a governing-text update
   alone establishes that substantial core redesign is necessary.

Check future needs against the BOOK handoff and relevant adopted GUI/application
requirements, distinguishing established responsibilities from exploratory suggestions.
Avoid deleting useful core functionality simply because its current visible caller is
the CLI; equally, hypothetical future reuse is not a blanket reason to keep CLI support.
This assessment does not implement BOOK or GUI, and shared Presentation negotiation
and Expansion acquisition remain outside the original retirement scope.

## Dependency and disposition assessment

Observed source consumers were checked at the baseline above, including static
relative imports and relevant dynamic script imports. Import reachability is a
candidate-finding aid, not sufficient proof of deletion: independent application
entry points, test semantics and accepted obligations also matter.

| Responsibility / files under `src/lib/` unless stated | Disposition and reason |
| --- | --- |
| `src/cli.ts`, `cli.ts` | Reduce to authentication/help/error handling. No investigation default, shell, project opening or GUI launching. Keep credential-safe diagnostics and terminal escaping. |
| `shell.ts`, `commands.ts`, `command-execution.ts` | Retire command parsing, dispatch, publication and shell state. Retain any useful semantic verification at the direct application boundary rather than preserving command adapters for tests. |
| `interactive-session.ts`, `session-worker.ts`, `session-protocol.ts` | Retire private transport and host together. Closing-window reconciliation, wire identifiers and stale-reply checks have no remaining direct-process role. |
| `interfaces/cli/application.ts`, `runtime.ts` | Retire client composition and deferred publication transport. Direct application execution already performs pre/post-execution checks. |
| `interfaces/cli/authentication.ts`, `application/accounts.ts`, `investigation/openai/` | Preserve authentication/account/provider behavior. Extract the authentication diagnostic dependency from mixed `interfaces/cli/investigator-policy.ts`; remove investigation-only policy when its callers retire. Help currently refers to project commands and needs revision. |
| `application/session.ts`, `executor.ts`, `requests.ts`, `contracts.ts`, `content.ts`, `retained.ts`, `consumption.ts` | Preserve shared requests, validation, qualification, exact access, content requirements, Presentation matching, usage/work and lifecycle. Remove separable CLI-only capabilities within these modules as well as private-host plumbing; audit concrete BOOK/GUI needs before deletion. |
| `application/operation-scope.ts` | Both `withCliOperation` and `evaluateOperation` are consumed only by `interfaces/cli/application.ts` (plus tests for the former). Retire the private registration/host surface and its Session closures once surviving tests use public requests. Preserve the lower shared evaluation machinery. Do not promote this hook into BOOK orchestration. This narrows the prior handoff's tentative suggestion of a surviving internal direct consumer. |
| `application/bindings.ts` | Assess CLI-only allocations/affordances for surgical removal, including within core. Production imports remain in executor/contracts, and shared request alias handling is an adopted behavior. Preserve precise identity/reference guarantees; determine whether removing remaining alias support is local separation or needs reference-contract redesign, then document any genuine residual. |
| `application/publication.ts` | Assess whether the neutral guard preserves a needed application/GUI guarantee or is separable CLI support; its export/tests alone do not settle retention. Preserve input-validity guarantees and the runner's existing validation/artifact behavior; do not add a new trial publication policy. |
| `application/feedback.ts`, `application/observations.ts` | Preserve needed feedback/delivery responsibilities and coverage. Remove separable CLI-only helpers/shapes even within these companion entries. Where command-shaped contracts are entangled with useful future feedback, document the redesign needed; no remaining CLI caller does not itself cancel the responsibility. |
| `contributions/answers.ts` | Keep `selectContributionAnswer`, `resolveContributionAnswer`, retained content/support and identity. Move the arrangement types/function beginning at `ArrangedQualification` into trial support where needed, along with its rendering dependencies. |
| `contributions/state-diagram.ts` | Move useful renderer and incompatibility checks into validation support. Preserve `state-model.ts` and analysis content contracts in core. Keep rendering tests with the moved responsibility. |
| `contributions/native-presentation.ts` | Retire with mechanical CLI renderers; preserve native selection, content contracts and identity. |
| `presentation-contracts.ts`, `request-catalog.ts`, root `requests.ts`, `resolution-context.ts`, `program-presentation.ts` | Candidate retirement cluster for this CLI. Distinguish root `requests.ts` from surviving `application/requests.ts`. Shared `application/consumption.ts` is not part of this deletion. |
| `presentation.ts`, `organization/presentation.ts`, `dependencies/presentation.ts`, `exports/presentation.ts` | Retire CLI arrangements/rendering; keep each family's analysis, qualified content and projection builders. |
| `composition-view.ts`, `documentation-view.ts`, `diagnostic-view.ts`, `qualification-view.ts`, `export-view.ts`, `evidence-view.ts`, `source-disclosure.ts` | Candidate transitive CLI-only helpers. Current source consumers are the retiring rendering/classification paths. Review surviving authentication and trial output requirements before deletion; historical output classification is not automatically proof for future clients. |
| `interfaces/cli/answer-presentation.ts`, `contribution-presentation.ts`, `report-contracts.ts`, `request-reporting.ts`, `subject-guidance.ts`, `methods.ts`, `feedback.ts`, `observations.ts` | Retire client-owned formatting, View identity/provenance, continuation guidance and capture construction. Trial rendering should carry its actual rendering method, not preserve the old CLI registry. |
| `investigation/usage-presentation.ts`, `work-attribution.ts: incompleteWork` | CLI/worker-specific consumers retire. Preserve `InvestigationUsage`, `RequestWork`, `WorkReportState` and neutral reporting. `incompleteWork` has only `interactive-session.ts` as a production caller. |
| `git-execution.ts`, `execution-errors.ts` | Preserve resource ownership, deadlines, exit monitoring and meaningful outcome distinctions. No new general host-support abstraction is justified. |
| `terminal-layout.ts`, dependency `string-width` | Candidate removal: `string-width` is imported only by terminal layout, whose consumers are retiring presentations/documentation formatting. Keep `terminal-text.ts` as required by the small entry point; escaping is independent of cell layout. |

The table is a concrete planning inventory, not a deletion patch. Implementation
must finish symbol-level checks and compile after the consumer switch, including
test helpers and dynamic script imports. Do not keep an otherwise dead client
module solely because an old test imports it.

## Trial artifacts and lifecycle

### Artifact fidelity

The general runner already executes direct application requests, fresh requests,
and offered follow-ups. Contribution steps currently save a projection and arranged
view; other steps save the result. Preserve those existing formats and behavior
through the rendering move. Earlier suggestions to normalize complete-result
capture or alter capture ordering were broader than this separation requires and
are not part of the working approach.

The useful arrangement is bounded: `arrangeContributionAnswer` consumes fixed
selected content, emits alternatives separately, carries qualification/support,
identifies every unrendered selected item and produces state-model pictures and
legends. It does not need the CLI request catalog, aliases, terminal tables or
observation batches. Move that coherent responsibility, not a second core renderer.
No extra analysis or evidence acquisition belongs in rendering.

### Executed runner control-flow experiment

On 25 November, nine controlled cases executed the actual body of
`scripts/structured-accounts/run-trial.mjs`. The harness read the source, asserted
seven single-line imports, removed those import declarations, and evaluated the
remaining body with an `AsyncFunction` receiving substitute import bindings.
Filesystem output was an in-memory map; credentials, hosted-agent construction,
application Session and budget were controlled substitutes. One synthetic step
emitted an attempt callback, returned a usage result or threw a sentinel error.
Individual output calls or Session close could throw distinct sentinel errors.
Assertions checked exact error identity, saved files and attempted cleanup.

| Injection | Caller error | Final usage saved | Attempt record saved | Budget close attempted |
| --- | --- | --- | --- | --- |
| None | None | Yes | Yes | Yes |
| Request failure | Primary | No | Yes | Yes |
| Request interruption | Primary | No | Yes | Yes |
| Request failure and Session-close failure | Cleanup, replacing primary | No | Yes | No |
| Session-close failure after successful request | Cleanup | Yes | Yes | No |
| Step-output failure | Primary | No | Yes | Yes |
| Attempt-output failure | Primary | No | No | Yes |
| Usage-output failure | Primary | No | Yes | Yes |
| Credential setup failure | Primary | No | No | Yes |

All assertions passed. Session close was attempted in every case after opening;
credential setup failure created no Session. This establishes runner control flow,
not real application cancellation, real filesystem failure behavior, credential
handling, provider behavior or a successful live trial. No files, credentials or
network inference were used by these substitutes. The interruption case is an
injected exception, not an OS signal test.

The source explains the results: `usage.json` is written after the entire step
loop, and `finally` awaits Session close before budget close. There is no lifetime
signal wiring. The budget lease reserves requests before dispatch; preserve that
ordering and never refund failed attempts merely because output capture failed.

### Separate findings, not migration requirements

The experiments above identify existing runner accounting and cleanup weaknesses.
They are not caused by moving rendering or removing the CLI, and do not make runner
redesign a prerequisite for UNSHELL. Preserve this evidence for separate disposition;
no failure-policy, capture-schema, signal-handling or publication-policy change is
included merely to address it.

Likewise, in-process compiler interruption limits already apply to trials. Removing
the private CLI worker does not newly impose those limits on the runner. Preserve
its existing execution architecture and resource accounting during the migration.
The unenforced assumption that the budget ledger lives outside the analyzed project
is another separate finding, rather than an implicit instruction to expand this work.

### Verification of unchanged trial behavior

- Exercise the same supplied qualified results through the original and relocated
  arrangement. Compare structured arrangements, SVG, textual diagrams, legends,
  qualifications, alternatives and unrendered-content notices. The same rendering
  algorithm retains its method identity when only its location changes.
- Use representative fixed inputs covering prose, drawable and incompatible models,
  multiple alternatives, missing renderable content and retained support. Preserve
  existing rendering assertions at their new home; do not replace them solely with
  snapshots generated by the implementation under test.
- Exercise the actual runner with controlled application/agent participants to
  compare requests, ordinary/fresh/follow-up step behavior, artifact formats and
  contents, usage/accounting and cleanup behavior before and after the move.
  Account narrowly for inherently variable timing or Session references; do not
  normalize away qualification, provenance, ordering or failures.
- Verify that the surviving runner/rendering dependency graph no longer reaches
  the retired CLI machinery. Preserve existing application-boundary checks.
- Live inference need not be used as a deterministic equality oracle for a code
  move. Any required live smoke validation is separate from fixed-input equivalence;
  changed agent instructions would require the repository's live-verification rules.

### Conversation-close failure

The prior session reported an executed real-application experiment with two otherwise
identical interrupted state-behavior requests. A normal conversation close left the
caller with `CommandInterrupted` and work `interrupted`; a throwing close replaced
that error and yielded work `defect`. Both retained attempt termination `interrupted`,
one close call and one usage call. This session has not rerun that experiment.
Source has not changed since its baseline. Current source inspection confirms the
catch/rethrow followed by `conversation.close()` in `finally`, and a nested final
report callback that still executes when close throws.

The earlier handoff proposed a narrow correction to preserve the primary outcome
while exposing cleanup failure. This is a pre-existing direct-path defect, not a
rendering-move regression. The subsequent explicit direction to preserve valuable
interruption guarantees makes this a concrete core-preservation candidate within
UNSHELL's planning assessment. It does not authorize implementation yet.

Inspection confirms the relevant contrast: `interactive-session.ts` settles the
pending operation with its original disposal reason before collecting conversation,
Git and worker cleanup failures into the separately awaited termination result.
Core `conductDialog` closes the production and rethrows interruption, but a throwing
conversation close in `finally` can replace it. The application then classifies work
from that replacement error. Existing direct callers are a concrete consumer of a
core outcome/cleanup distinction; this is not solely a hypothetical GUI need.

Recommended capability boundary:

- Preserve terminal interruption and original request outcome, with cleanup failures
  separately observable rather than replacing or disguising that outcome.
- Preserve close-once behavior, the cutoff for accepting late contribution/usage,
  and available final attempt/work accounting. Check throwing cleanup and reporting
  callbacks so the reporting path does not recreate the same outcome-loss problem.
- Reuse existing Session/dialog, usage/work and Git ownership facilities. Establish
  whether a small change there suffices before extracting any new helper or API.
- Keep cancellation request, request settlement, cleanup reporting and actual resource
  exit distinguishable. Do not promise hard interruption of synchronous computation,
  transport supervision or accounting survival after process destruction in core.
- Verify through the surviving application boundary with controlled participants.
  Any intentional change in exceptional interruption behavior is tested and documented
  separately from unchanged trial rendering behavior; normal trial behavior stays fixed.

The primary-outcome/cleanup distinction appears worth retaining in core. The exact
representation and complete guarantee inventory still need design assessment; do
not infer a generic worker host or resource supervisor from this recommendation.

## Coverage relocation

| Existing coverage | Surviving verification |
| --- | --- |
| `contribution-application.test.ts` cancellation | Keep real application/evaluation with only the agent participant substituted: dispatched usage survives and late contributions are rejected. Add coverage for any approved core interruption-guarantee preservation, distinguishing its exceptional-path change from unchanged trial rendering. |
| `contribution-dialog.test.ts` timeout/exposure | Keep direct tests and final attempt reporting. |
| `investigation-integration.test.ts`, “usage arriving after a reply remains attributable until dialogue close” | Move the substantive assertion to direct dialog/application tests: reporting for the first exchange during the second remains attributable; two calls, no missing measurements, one close. CLI JSON/batch equality is retired. |
| Same file, “worker guard ignores late replies and late usage from a closed dialogue” | Preserve direct post-close rejection of late result/usage. Retire transport-specific delivery behavior. |
| Same file, “CLI seals authoritative usage in the worker-to-parent closing window” | Retire with the worker. Do not reproduce a nonexistent direct-process wire race. |
| `execution-ownership.test.ts` | Keep direct Git deadline/escalation, early exit, incomplete cleanup ownership, output limits and spawn failure tests. Separate CLI publication and worker-exit cases. Preserve opening/validation semantics through direct application tests where old helpers depend on CLI. |
| `application-lifecycle.test.ts` | Keep direct validation, safe capture, qualified partial/empty populations and neutral publication outcomes. Split mixed worker-delivery tests. Retire private CLI operation-scope cases with the hook. |
| `contribution-answers.test.ts`, `contribution-application.test.ts`, `contribution-state.test.ts` | Keep exact support, alternatives, bearer identity and answer/attempt semantics in core tests; move qualified arrangement, incompatible-model and omission checks to trial-rendering tests. |
| Application boundary/identity/requests and family tests | Replace CLI helpers with direct requests where they are the only test of surviving semantics. Preserve shared Presentation-negotiation and Expansion tests; removal of the default CLI declarations must not erase shared contract coverage. |
| Authentication and services tests | Preserve credential-safe output, argument/help behavior, interruption and account-service tests; add retired-command rejection and no-project-opening checks for the small entry point. Keep neutral feedback/delivery coverage. |

No full test suite, proposed-removal build, authentication operation or live inference
was run in this resumed planning session. Coverage mappings above are source-inspected.

## Script disposition

- Keep/adapt `structured-accounts/run-trial.mjs` as the principal direct live runner.
  Its useful rendering moves into its support, with authoritative structured results.
- Keep the specific `run-dialog14-trial.mjs` scenario and `audit-dialog14-trial.mjs`
  while they validate the retained dialog contract. The scenario runner already uses
  nested cleanup so Session failure does not skip budget close; its final usage write
  is still success-path-only and nested cleanup can still replace an earlier error.
  Preserve their behavior in UNSHELL; retain these pre-existing failure-path findings
  for separate disposition.
- Keep `module-investigation/request-budget.mjs`, its coverage, useful usage reporting
  and authentication diagnostics. Do not delete the directory wholesale. Reassess
  shell-only scenario/configuration helpers and README references with `run-shell.mjs`.
- Retire `module-investigation/run-shell.mjs`, CLI comparison scripts
  (`compare-analysis`, `compare-application-boundary`, `compare-application-journey`,
  `compare-session-conversion`, `compare-session-requests`, `compare-view-construction`),
  CLI human-output assessment, and worker-specific interruption probes with their
  obsolete targets. Historical reports keep their original references.
- `measure-analysis`, `profile-analysis`, `measure-session-journey` and
  `measure-partial-session` also call CLI/worker paths. Remove them when their measured
  scenario retires; relocate genuinely required core performance checks to the direct
  boundary. `benchmark-analysis` drives `measure-analysis` and must be assessed with it,
  including its retry/disposition tests; do not leave a silently broken driver.
- `measure-contribution-session` and `profile-contribution-memory` already use direct
  application/domain facilities; preserve useful measurement coverage. Keep shared
  comparison fixtures while retained scripts use them. `prototype-contribution-sharing`
  is independent of CLI retirement and should not be removed as incidental cleanup.

## Residual core capability register

This is an initial post-retirement assessment, to be verified against the completed
separation. It is not a claim that every listed feature is presently unused, nor
an authorization to redesign it within UNSHELL. Reassess each candidate for surgical
removal under the core-location criterion above before deciding to retain it.
Carry confirmed residuals into durable
implemented-architecture documentation and appropriate follow-up candidates; notes
alone must not be their only description when implementation is complete.

| Candidate | Expected residual and evidence | Why removal may require redesign |
| --- | --- | --- |
| Shared Presentation negotiation (`application/consumption.ts`, catalog capture and request/result contracts) | Retiring CLI declarations removes its principal current client. The trial runner uses direct content requests. Generic declaration capture, compatibility/refusal handling and consumption metadata remain shared API facilities with direct tests. | Removing negotiation changes accepted application semantics and types; requirement selection shares this code with direct requests. Separate negotiable client presentation from still-needed information requirements and explicitly revise the contracts. Do not remove Expansion acquisition with it. |
| Compact aliases and coordinated allocations (`application/bindings.ts`, executor, store/reference handling) | Direct mechanical execution still allocates and returns aliases; current reference requests accept them even when the surviving caller uses precise IDs. This is active CLI-motivated coupling, not unreachable code. | Removing allocation or alias input changes accepted designation behavior, optional result fields and append-only binding/allocation schedules. Decide the future reference contract before removing that coupling. CLI-only binding ports can still retire locally. |
| Command-shaped feedback and observation envelope (`application/feedback.ts`, `application/observations.ts`) | CLI capture/feedback callers retire. The independent services and tests remain; displayed-result feedback still consumes command/records/events snapshots and emits version-four command batches. No new trial consumer is assumed. | A client-neutral replacement must preserve explicit feedback, actual-display context, delivery/cleanup distinctions and adopted observation obligations. Retiring the client does not by itself settle those contracts. Distinguish retained generic sink utility from unused command-shaped affordances. |
| Neutral publication guard (`application/publication.ts`) | Production integrations found are CLI-owned; the helper remains an explicit application export with direct coverage after their removal. The runner does not need new publication checks. | Determine whether this is useful retained core policy or an unnecessary API obligation. Reconcile the explicit publication contract before removing the export. Do not automatically call a small unused helper a core-redesign project; if its removal proves surgical, handle it as such. |

Expansion acquisition, qualified answer selection, resource ownership and final
accounting still serve surviving application work. They are not residual dead
capabilities merely because the CLI was one consumer. Complete the register with
any additional coupled leftovers found during separation, and remove candidates
from the residual list if the audit shows they can be retired surgically.

## Governing and documentation impact

A scoped retirement decision is necessary before implementation. In particular:

- `execution-ownership-and-cancellation.md` explicitly selects compiler worker
  execution. Supersede that host selection while preserving resource ownership,
  confirmed exit versus bounded cleanup reports, terminal interruption, captured
  evidence validation and operational-failure distinctions.
- `internal-application-api.md` has binding CLI/worker clauses in “Keep compact
  binding CLI-scoped and distinguish presentation outcomes” and “Preserve runtime,
  publication and audience guarantees,” plus command-specific invocation details.
  Define precise supersession units and preserve surviving application contracts.
  Do not rewrite the old rationale or erase the distinction between application
  completion and later presentation/publication failure.
- Update application-specification current-interface statements (navigation context,
  resolution delivery, implemented subset and external-agent access) and the scoped
  CLI binding/runtime references. Preserve shared Presentation/Expansion meaning,
  human-output principles, feedback obligations and future product aspirations.
- Check incoming accepted-decision preservation clauses for aliases, exact answer
  presentation, request-model behavior and identity. The final supersession map is
  not yet complete. CLI retirement is not blanket supersession of those decisions.
- Update implemented architecture, README, STATUS, capability/CLI reference, hosted
  setup and implementation conventions to describe the resulting authentication,
  internal application and development-validation access. Retain relevant analysis
  limitations and resource/input-validity disclosures outside deleted CLI docs.
- Leave historical task/review/validation records intact. Do not change foundation,
  steering or human-maintained `dev/` instructions. No foundation revision is indicated.
  Report any affected process instructions separately.

## Next discussion and drafting

The agreed approach is surgical separation and removal, including separable CLI-only
capabilities within core. Preserve existing direct trial behavior and the core
responsibilities needed by surviving consumers, BOOK and GUI. Assess aliases,
feedback representations and other residual candidates individually rather than
assuming all shared code must remain. No new runner lifecycle/publication policy
is needed to draft that approach. Assess and preserve worthwhile core interruption guarantees under
the explicit exception above; keep unrelated defects distinct from migration work.

Finish the interruption-guarantee assessment, residual core register, scoped
supersession map and remaining mixed-consumer/coverage assessment, then draft the
smallest coherent retirement package. A prospective implementation sequence is:
separate retained authentication and trial rendering and preserve identified core
interruption guarantees; retire the complete CLI/worker consumer cluster and relocate
useful coverage; verify surviving behavior, document core residuals and reconcile
active documentation/dependencies. These are discussion dependencies,
not approved milestones. Do not introduce compatibility machinery solely to keep
retiring commands or their old tests working, or generic abstractions for hypothetical
future consumers.
