# UNSHELL planning

Exploratory working notes, 25 November 2026. Not an approved implementation plan,
accepted architectural decision, or implementation authorization. Formal drafting
follows discussion of consequential choices. Implementation belongs in a separate chat.

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

### Validation artifacts — human direction, 25 November 2026

> Preserve the existing qualified explanations and state diagrams where they support live validation, moving any validation-only arrangement/rendering into trial-runner support. Keep the structured results as the authoritative artifacts. Preserve alternatives, limitations and unrendered-content notices so the rendered artifacts remain faithful to those results. This does not require retaining the CLI presentation framework or maintaining a separate rendering path in core.

This settles the direction for trial presentation. It does not adopt a formal plan
or amend governing documents. Preserve the complete application result first;
rendering is a derived artifact with separately recorded failure/omission information.

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
| `application/session.ts`, `executor.ts`, `requests.ts`, `contracts.ts`, `content.ts`, `retained.ts`, `consumption.ts` | Preserve shared requests, validation, qualification, exact access, content requirements, Presentation matching, usage/work and lifecycle. Remove only private-host plumbing proven unused. |
| `application/operation-scope.ts` | Both `withCliOperation` and `evaluateOperation` are consumed only by `interfaces/cli/application.ts` (plus tests for the former). Retire the private registration/host surface and its Session closures once surviving tests use public requests. Preserve the lower shared evaluation machinery. Do not promote this hook into BOOK orchestration. This narrows the prior handoff's tentative suggestion of a surviving internal direct consumer. |
| `application/bindings.ts` | Preserve current shared alias handling and coordinated allocations. Production imports remain in executor/contracts. CLI-port-only allocations may retire with their adapter; removing shared aliases is a separate semantic change. |
| `application/publication.ts` | Keep the neutral publication guard and direct tests; remove CLI integration. Runner artifacts need an explicit captured-result validity policy, discussed below. |
| `application/feedback.ts`, `application/observations.ts` | Preserve independent companion services and their tests. They are explicit application entries despite not being re-exported by `application/index.ts`. Retire CLI builders/capture commands. Do not infer that no remaining CLI caller cancels adopted feedback/delivery requirements. |
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
view instead of the complete result; other steps save the result. Normalize capture
around complete application results with request, attribution/reporting, selected
qualified content, exact support and consumption context. Save those authoritative
artifacts before attempting explanations/diagrams. Preserve raw step outcomes even
when an artifact cannot be arranged or written. Failed rendering must not recast a
completed application request as failed analysis.

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

### Proposed observable lifecycle policy — discussion still needed

- Preserve primary execution outcome, artifact/reporting failure and cleanup
  failure as distinguishable information. If there is no primary failure, a cleanup
  failure still makes the run visibly unsuccessful; never report clean success.
- On interruption, request terminal cooperative cancellation through the existing
  application lifetime API, await active request settlement, then snapshot available
  final work/usage. Independently attempt Session cleanup and lease release, even
  when one fails. Restore installed process listeners. No prompt preemption of
  synchronous compiler work or crash-proof final accounting is promised.
- Attempt final accounting on request, rendering and output failures. Report missing
  artifacts explicitly when storage itself fails; preserve already-written attempts
  and budget records. Do not claim that every failure can produce `usage.json`.
- Treat trial outputs as records of captured application outcomes, not certification
  that files remain current throughout artifact writing. Preserve direct pre/post
  execution validation; rendering consumes returned fixed content. If a stronger
  current-at-publication policy is wanted, make that explicit and use the neutral
  guard rather than reintroducing worker deferral.
- Keep output directories explicitly excluded. Validate or enforce the budget ledger,
  lock and temporary-file boundary too: a source comment saying the ledger lives
  outside the project is not an enforced evidence exclusion. Choose a narrow policy
  during drafting; do not silently allow generated ledger evidence.

### Conversation-close failure

The prior session reported an executed real-application experiment with two otherwise
identical interrupted state-behavior requests. A normal conversation close left the
caller with `CommandInterrupted` and work `interrupted`; a throwing close replaced
that error and yielded work `defect`. Both retained attempt termination `interrupted`,
one close call and one usage call. This session has not rerun that experiment.
Source has not changed since its baseline. Current source inspection confirms the
catch/rethrow followed by `conversation.close()` in `finally`, and a nested final
report callback that still executes when close throws.

Preserve the primary outcome while exposing cleanup failure and retaining final
accounting/close-once behavior. Concrete representation remains unsettled; an
unclassified aggregate that makes interruption look like a defect is insufficient.
Check success, expected failure, interruption, throwing close and throwing report
callbacks. The latter can also replace an earlier exception and deserves a bounded
assessment before selecting the reporting mechanism. No general supervisor follows
from this issue.

## Coverage relocation

| Existing coverage | Surviving verification |
| --- | --- |
| `contribution-application.test.ts` cancellation | Keep real application/evaluation with only the agent participant substituted: dispatched usage survives and late contributions are rejected. Add throwing-close regression at this boundary. |
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
  Assess the same outcome/accounting policy without creating a generic runner framework.
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

Artifact presentation is settled above. Recommended remaining boundary: keep shared
aliases and feedback/delivery contracts, retire their CLI-specific callers, and use
cooperative in-process validation with separately visible execution, capture and
cleanup outcomes. Confirm the observable lifecycle/publication policy before formal
drafting; representation and helper names can remain implementation choices.

A small prospective implementation sequence is: establish retained authentication
and reliable direct validation; move useful rendering/coverage and retire the complete
CLI/worker consumer cluster; verify surviving application behavior and reconcile
active documentation/dependencies. These are discussion dependencies, not approved
milestones. No compatibility machinery should be added solely to keep retiring
commands or their old tests working.
