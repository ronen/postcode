# Surgical CLI shell retirement

Status: in preparation
Created: 2026-11-25
Updated: 2026-11-25

## Purpose and resulting behavior

In anticipation of a graphical interface built around the book model, remove the
investigation CLI and its private machinery so they do not remain an additional
interface to maintain as the application design evolves. Preserve the internal
application, qualified information and direct validation facilities. This plan
implements [CLI shell retirement](../decisions/cli-shell-retirement.md).

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
credential protections, generated-output exclusions, client-neutral publication
validity policy and asynchronous Git ownership. Document negotiation's lost principal
client and its coupling to useful requirement selection as a residual for later design.

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

The examined source baseline is `5f9534aeee06996843c74548a3083b11df8815bf`.
Reconcile intervening source changes when assessing consumers and preservation coverage.

Capture controlled pre-change evidence before removal or movement. Verification
must exercise real application coordination with controlled participants rather than
substitute mocked final results. Preserve a reproducible comparison procedure and
representative sanitized artifacts. Baseline captures must exclude
credentials and sensitive repository material from committed evidence.

## Required outcomes

### Independent authentication and validation support

- Account for surviving consumers, including scripts, package commands and mixed
  test responsibilities. Establish representative direct application/runner baselines.
- Separate authentication/help and terminal-safe output from general CLI dispatch.
  Preserve account behavior, credential-safe errors and interruption handling without
  opening analysis projects. Keep the `postcode` package command.
- Separate validation rendering from core selection, resolution and state semantics,
  preserving their behavior and dependency boundaries. Trial support owns the useful
  rendering; core has no dependency on it and retains no separate rendering path.
- Preserve qualified prose, alternative diagrams, incompatible-model and unrendered
  notices, with verification of the relocated rendering and surviving core semantics.
- Compare output against the controlled baseline. Inspect actual explanation/diagram
  output against qualification and disclosure requirements;
  existing omission tests are not proof of full conformance. Record any material
  pre-existing gap and obtain disposition rather than silently broadening this task.

Completion evidence: authentication works through the retained entry point, relocated
rendering consumes only supplied content, core has no dependency on trial support,
and equal-input rendering comparison has no unexplained changes.

### Reliable terminal Session abort

- Correct dialog cleanup/final-report exceptions replacing interruption. Retain final
  attempt/work/usage internally before settling the interrupted request; notification
  failure cannot erase them. Reject late content and seal usage without inventing
  missing measurements.
- Both `interrupt()` and `close()` expose the same shutdown outcome, covering active
  request finalization and participant/resource cleanup. Signal-triggered failures
  remain available to later close. Request interruption alone is not a shutdown
  failure. Preserve distinguishable
  cleanup and report-delivery failures, including simultaneous failures.
- Treat close during active work as terminal abort, idle close as shutdown without a
  new request abort, and repeated calls as observers of the same assessment. Preserve
  first established termination/invalidation reason and the final-validation boundary.
- Signal-only abort creates no unhandled internal cleanup rejection, and callers
  observing shutdown can obtain the retained failures.
- Preserve Git reporting deadlines, escalation and ownership until exit. Document
  caller ownership with injected `runGit`. No overall shutdown deadline or new
  asynchronous participant contract is introduced; synchronous work remains cooperative.

Verify these guarantees through the direct application boundary. At the opening
boundary, do not let the separation introduce an unowned resource or conceal cleanup
failure before a Session is returned. Report
any existing opening-path defect outside the agreed active-Session correction rather
than silently designing an additional lifecycle.

Completion evidence: the lifecycle matrix below passes, independently of a CLI host.
Work terminated by abort and a producing attempt stopped by that abort report
interruption even when cleanup and a final reporting callback fail. Earlier completed
attempts retain their actual outcomes; do not retroactively relabel accepted production.

### Complete retirement without loss of surviving responsibilities

- Retire shell/command execution, the private worker and its protocol, and exclusive
  CLI adaptation, coordination and validation support. Ordinary direct pre/post-
  execution validity checks remain.
- Retire mechanical-family human Presentations and CLI disclosure classification
  while preserving domain analysis, qualified content construction and qualification.
- Remove compact-alias allocation, lookup and input/output support. Preserve
  same-Session retained-ID validation, kind/applicability distinctions, names/ambiguity
  and request attribution. Do not replace aliases with another short namespace.
- Remove the command feedback builders/envelope and unused observation sink/delivery
  implementation. Do not wire trials to a replacement. Keep operational attribution,
  usage, qualified bases and production exposure independent of this removal.
- Remove exclusive tooling/dependencies; retain useful test responsibilities at their
  surviving boundary. Verify trial fresh/follow-up chains and exact retained targets
  after alias removal.

Completion evidence: no remaining production import of the retired cluster; all
retained scripts build/run through their intended boundary; alias compatibility is
removed deliberately without changing exact references, qualified meaning or method
provenance.

### Verified preservation and accurate current documentation

Verify type/build correctness and the retained full test suite.
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
unrelated work.

## Tooling and verification coverage

Retain the direct structured-account trials and their scenario auditing, request-budget
support, authentication/usage diagnostics and useful direct contribution measurement.
Retire shell-driven live-validation scenarios, CLI comparison and human-output checks,
worker-specific probes, and CLI/worker analysis benchmarks and profilers. No replacement
benchmark project is included. Shared fixtures and dependencies remain only where
surviving responsibilities need them.

Retiring a harness must not erase verification of surviving semantics. The required
coverage is:

| Responsibility | Required evidence |
| --- | --- |
| Application investigation and retained access | Exact targets, retained outcomes, qualification, production exposure, accounting and the terminal-abort matrix below. |
| Usage and participant lifetime | Usage arriving before sealing remains attributable; late content/usage is rejected after closure; participant cleanup is not repeated. Transport-only races retire with the worker. |
| Execution ownership | Git deadlines, escalation, spawn/output failures, incomplete-cleanup ownership and opening/validation behavior through the surviving boundary. |
| Application requests and results | Safe capture, refusal distinctions, qualified empty/partial content, exact support, identity and publication validity. Private CLI scopes and alias allocation are no longer compatibility targets. |
| Rendering | Qualified arrangement, diagrams, incompatible-model/omission behavior and actual disclosure, separately from core state semantics and exact support. |
| Authentication | Credential/account behavior, safe output, help, retired-command rejection and absence of project/investigator opening. |

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
change agent instructions or wire handles. Live smoke validation can supplement
controlled verification but cannot prove equality across independent model responses.

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
not a presumed property of existing tests.

The research-support backlog and later presentation/acquisition design remain outside
implementation scope. No new human interface, persistence, public transport or GUI
design follows from this plan.
