# Surgical CLI shell retirement

Status: in preparation
Created: 2026-11-25
Updated: 2026-11-25

## Purpose and resulting behavior

In anticipation of a graphical interface built around the book model, remove the
investigation CLI and its private machinery so they do not remain an additional
interface to maintain as the application design evolves. Preserve the internal
application, qualified information and direct validation facilities. This plan
implements [CLI shell retirement](../decisions/cli-shell-retirement.md); adoption of
the plan does not itself authorize implementation.

`npm run postcode` remains an authentication-only entry point with help. Retired
investigation, presentation, shell and feedback commands are rejected without
opening a project or configuring an investigator. There is no replacement human
investigation interface. The internal application API continues to provide mechanical
analysis, contribution investigations, qualified resolution, exact retained access,
ordinary/fresh/follow-up requests, attribution and accounting.

Qualified explanation and state-diagram rendering used by the direct trial runner
moves to trial support. Mechanical-family human Views retire; their analysis and
qualified Projection construction remain. Compact aliases and alias metadata retire;
precise identities, supported name lookup, qualified references, exact option targets
and connections between trial steps remain. Investigator wire handles are unaffected.

## Scope and constraints

Remove the interactive shell, one-shot investigation commands, private CLI adapter,
worker/transport/finalization, CLI-only operation scopes and validation plumbing,
mechanical Presentations/View helpers, observation/feedback implementation, compact
binding infrastructure and their exclusive tests/scripts/dependencies. Follow actual
feature need and dependency ownership, not module location or export status.

Preserve shared Presentation negotiation under its current contract, Expansion
acquisition, domain identity, qualification, exact support, retained selection,
credential protections, generated-output exclusions, the neutral publication guard
and asynchronous Git ownership. Document negotiation's lost principal client and its
coupling to useful requirement selection as a residual for later design.

Strengthen terminal Session abort according to the decision: interrupted work remains
interrupted despite cleanup/final-report failures; internal accounting survives;
`interrupt()`, lifetime-signal abort and active `close()` share the contract; both
shutdown methods expose the same separately observed shutdown assessment. Preserve
first established terminal cause, repeated-shutdown behavior, ownership until exit
and the cooperative limits of in-process execution.

Excluded: book-model implementation, graphical interaction/hosting/feedback design,
replacement investigation CLI, generic worker or observation framework, unrelated runner lifecycle
fixes, broad callback-isolation redesign, and foundation/steering/development-process
changes. Do not add production callers merely to retain unused facilities.

## Preparation and dependency boundary

Start implementation only after the coordinated decision/specification/constraint
package is adopted and the human authorizes a task under the task protocol. Use an
implementation worktree containing the adopted package. The examined source baseline
is `5f9534aeee06996843c74548a3083b11df8815bf`; later planning commits change notes only.
Reconcile intervening source changes before using the inventories below.

Capture controlled pre-change evidence before removal or movement. Use existing
application fixtures and scripted agent participants to exercise real coordination;
do not replace the engine with mocked final results. Preserve a reproducible comparison
procedure and enough sanitized evidence for review. Keep bulky disposable captures in
a root underscore directory; preserve necessary conclusions/representative artifacts
in the task's durable verification record. Do not include credentials or raw sensitive
repository material in committed evidence.

## Work sequence

### 1. Establish preservation baselines and separate surviving clients

- Establish an import/consumer inventory, including scripts, package commands and
  mixed tests. Capture representative direct application/runner outputs before edits.
- Separate authentication/help and terminal-safe output from general CLI dispatch.
  Preserve account behavior, credential-safe errors and interruption handling without
  opening analysis projects. Keep the `postcode` package command.
- Move `arrangeContributionAnswer`, its arrangement-only types/helpers and
  `contributions/state-diagram.ts` into coherent trial support. Choose the smallest
  build arrangement consistent with existing script/test conventions. Do not leave a
  forwarding renderer in core or migrate the whole CLI Presentation framework.
- Keep selection/resolution in `contributions/answers.ts` and state semantics in
  `state-model.ts`. Redirect runner imports and move rendering assertions, preserving
  qualified prose, alternative diagrams, incompatible-model and unrendered notices.
- Compare controlled baseline output before further semantic changes. Inspect the
  actual explanation/diagram output against qualification and disclosure requirements;
  existing omission tests are not proof of full conformance. Record any material
  pre-existing gap and obtain disposition rather than silently broadening this task.

Completion evidence: authentication works through the retained entry point, relocated
rendering consumes only supplied content, core has no dependency on trial support,
and equal-input rendering comparison has no unexplained changes.

### 2. Preserve terminal Session-abort guarantees in core

- Correct dialog cleanup/final-report exceptions replacing interruption. Retain final
  attempt/work/usage internally before settling the interrupted request; notification
  failure cannot erase them. Reject late content and seal usage without inventing
  missing measurements.
- Coordinate active request finalization and participant/resource cleanup through one
  Session-owned shutdown assessment. Both `interrupt()` and `close()` observe its
  completion/failures; signal-triggered failures remain available to later close.
  Request interruption alone is not a shutdown failure. Preserve distinguishable
  cleanup and report-delivery failures, including simultaneous failures.
- Treat close during active work as terminal abort, idle close as shutdown without a
  new request abort, and repeated calls as observers of the same assessment. Preserve
  first established termination/invalidation reason and the final-validation boundary.
- Observe internal asynchronous failures so signal-only abort creates no unhandled
  cleanup rejection. Do not suppress failures from callers observing shutdown.
- Preserve Git reporting deadlines, escalation and ownership until exit. Document
  caller ownership with injected `runGit`. No overall shutdown deadline or new
  asynchronous participant contract is introduced; synchronous work remains cooperative.

Test through the direct application boundary before retiring worker coverage. Audit
abort ordering at the opening boundary as well: do not let the separation introduce
an unowned resource or conceal cleanup failure before a Session is returned. Report
any existing opening-path defect outside the agreed active-Session correction rather
than silently designing an additional lifecycle.

Completion evidence: the lifecycle matrix below passes, independently of a CLI host.
Work terminated by abort and a producing attempt stopped by that abort report
interruption even when cleanup and a final reporting callback fail. Earlier completed
attempts retain their actual outcomes; do not retroactively relabel accepted production.

### 3. Remove the CLI consumer cluster and compact aliases

- Retire shell/command execution, worker protocol/host, private CLI operation scope
  and adapter, deferred publication-check transfer, and CLI-only input constraints.
  Ordinary direct pre/post-execution validity checks remain.
- Remove mechanical-family Presentations and View/disclosure helpers whose consumers
  retire. Keep same-named domain analysis, content builders and qualification data.
- Remove Entity/answer/Investigram compact-binding maps, allocators, private ports,
  candidate/delivery alias metadata and alias-input branches. Preserve same-Session
  retained-ID validation, kind/applicability distinctions, names/ambiguity and request
  attribution. Do not replace compact aliases with another generated short namespace.
- Remove the command feedback builders/envelope and unused observation sink/delivery
  implementation. Do not wire trials to a replacement. Keep operational attribution,
  usage, qualified bases and production exposure independent of this removal.
- Remove exclusive tooling/dependencies; retain useful test responsibilities at their
  surviving boundary. Verify trial fresh/follow-up chains and exact retained targets
  after alias removal.

Completion evidence: no remaining production import of the retired cluster; all
retained scripts build/run through their intended boundary; alias compatibility is
removed deliberately without changing exact references, qualified meaning or method
provenance. New imports/exports are justified by actual surviving responsibilities.

### 4. Verify the integrated result and reconcile current documentation

Run type/build checks and the retained full test suite after focused tests pass.
Inspect the final dependency graph, package scripts, current docs and surviving
validation tools. Compare baseline artifacts using only explicitly listed alias-field
and run-specific exclusions; never normalize away support, qualification, referenced
targets or result/step relationships.
Where independently generated Session IDs differ, use controlled identities or an
explicit consistent correspondence preserving kinds, ownership and every reference
relationship. Do not strip IDs wholesale or imply cross-Session identity guarantees.

Update README, STATUS, capability/CLI references, hosted setup, implemented architecture
and implementation conventions to describe authentication-only CLI access, internal
analysis access, validation rendering, cooperative execution and the research-support
gap. Document the Presentation-negotiation residual and any other proven inseparable
unused capabilities, with reasons and needed redesign. Do not treat useful retained
capabilities or ordinary callback-policy limitations as dead-code redesign projects.

The adopted backlog revision tracks research observation/feedback reconciliation.
Check remaining entries for stale CLI/worker/export premises without reprioritizing
unrelated work. Historical reports, accepted rationale and concluded task/review
records remain unchanged. Report affected development instructions separately.

Prepare the final integrated review handoff under the task protocol. The human
arranges review and decides when its gate is sufficient. Close implementation only
after required verification and review, with remaining limits stated accurately.

## Dependency and coverage inventory

These are assessed starting points, not permission to delete a file with a surviving
responsibility. Recheck at implementation time.

| Cluster | Disposition |
| --- | --- |
| `cli`, `commands`, `shell`, `command-execution`, `interactive-session`, `session-worker`, worker protocol and `interfaces/cli` | Retire investigation/shell/feedback and transport; extract/retain authentication composition and actual credential/output dependencies. |
| `application/operation-scope`, Session registration/private evaluator route, `InputConstraints`, shell-only `incompleteWork` and `investigation/usage-presentation` | Remove exclusive CLI support; retain shared contribution evaluation, RequestWork, usage and public validation. |
| `presentation.ts`, organization/dependency/export Presentation modules, `contributions/native-presentation`, `presentation-contracts`, `request-catalog`, `program-presentation`, qualification/diagnostic/evidence/documentation/composition/export View helpers and `source-disclosure` | Remove CLI Presentation closure. Keep analysis/evidence/Projection construction with similar names. |
| `application/bindings`, memory-store/identity compact bindings, subject/retained reference branches | Remove compact alias allocation/lookup/output, preserving canonical identity and qualified access. `investigation/openai/references` remains active transport support. |
| `application/feedback`, `application/observations` and CLI snapshot/capture adapters | Remove their unused implementation and exclusive tests. Preserve foundation/semantic requirements through documents and backlog, not an unused replacement abstraction. |
| `terminal-layout`, `string-width` | Remove when the consumer audit confirms exclusivity. `terminal-text` remains for authentication. |
| `structured-accounts/run-trial`, dialog14 runner/auditor, request budget, auth/usage diagnostics, direct contribution measurement/profile tools | Retain useful direct consumers and behavior, redirect renderer imports only. Do not delete `module-investigation/` wholesale. |
| `module-investigation/run-shell`, CLI `compare-*`, `assess-human-output`, worker probes, `measure-analysis`, `benchmark-analysis`, `profile-analysis`, `measure-session-journey`, `measure-partial-session` | Retire with their targets, including exclusive benchmark retry/disposition tests. Keep shared fixtures while retained tools use them. No replacement benchmark project. |

| Existing coverage | Required treatment |
| --- | --- |
| Contribution application/dialog tests | Preserve cancellation, exact targets, retained outcomes, exposure and usage; add the direct shutdown matrix. |
| Mixed investigation integration tests | Move late-usage attribution, post-close rejection and one-close assertions to direct tests. Retire worker-to-parent closing-window reconciliation and transport-specific races. |
| Execution ownership tests | Retain Git deadlines, escalation, spawn/output failure and incomplete-cleanup ownership. Move meaningful opening/validation assertions off CLI helpers; retire worker-exit cases. |
| Application lifecycle/boundary/identity/request tests | Preserve safe capture, refusal distinctions, qualified empty/partial content, exact support and publication guard. Retire private operation-scope and alias-allocation assertions. |
| Contribution answer/state tests | Keep domain semantics and exact support in core tests; relocate arrangement/diagram/omission assertions to trial support. |
| Authentication/services tests | Retain credential/account behavior and safe output; verify help/retired-command rejection and no project/investigator opening. Retire observation/feedback-only tests. |

## Verification contract

### Terminal-abort matrix

Exercise `interrupt()`, external lifetime-signal abort and active `close()` during a
pending dialog and non-dialog work that can be controlled at an asynchronous boundary.
Include normal cleanup, participant-close failure, final-report callback failure,
both failures, delayed/late replies and usage, owned Git exit timeout and eventual
exit, injected Git ownership, repeated/mixed shutdown calls, idle close after abort,
and invalidation versus abort ordering. Verify both request and shutdown promises,
internal final accounting, no late acceptance, and no unhandled internal rejection.
Test a completed request followed by abort and abort before final validation finishes.
Do not claim to test hard interruption of synchronous compiler work in-process.

### Preserved behavior and allowed differences

Compare ordinary, fresh, follow-up and exact-retained direct requests; qualified
mechanical results; alternatives and missing/unrendered content; compatible and
incompatible state diagrams; meaningful failure reporting and usage. Preserve exact
step references and option targets. Alias-only fields/inputs and the specified
shutdown promise/outcome corrections are intentional changes. Retired human command
outputs are not compatibility targets.

Keep normal runner capture order, budgets and cleanup behavior. Existing runner
limitations (partial records on failure, success-path final usage, and cleanup that
can replace a prior error or skip budget close) are outside this separation. Do not
fix them incidentally or describe the retained behavior as stronger than it is.

Controlled participants are the equality oracle. This work does not intentionally
change agent instructions or wire handles. If instructions, agent-facing tools or
response schemas change, focused actual-integration live trials are required under
the workflow; estimate requests and establish a finite cap before running them.
Otherwise, live smoke validation can supplement controlled verification but cannot
prove equality across independent model responses. Record any unperformed checks.

## Success, risks and follow-up

Success means the authentication entry point, direct application and retained trials
work without the retired shell/worker/alias/observation implementation; terminal
abort satisfies the specified contract; comparisons show no unexplained semantic
or rendering drift; current documentation and backlog disclose lost facilities and
remaining gaps. Shared Presentation negotiation remains deliberately retained.

Principal risks are deleting qualified support with similarly named View code,
breaking exact trial connections while removing aliases, losing accounting during
shutdown, and confusing deletion of implementation with withdrawal of foundation
requirements. The baselines, direct tests, scoped decision and gap/backlog revisions
address these risks. Renderer disclosure conformance remains an assessment obligation,
not a presumed property of existing tests. Material new conflicts return to the human.

The research-support backlog and later presentation/acquisition design remain outside
implementation scope. No new human interface, persistence, public transport or GUI
design follows from this plan.
