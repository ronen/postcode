# CLI shell retirement — final integrated review

Record type: handoff
Prepared: 2026-11-25
Task: [Surgical CLI shell retirement](../../tasks/2026-11-25-cli-shell-retirement.md)
Review gate: final integrated review before task closure
Review target: `3b1a5bc0d1fb9e4bfc943bd1d71eecdba1760edc`
Baseline or diff range: `5db2cf19f0436d206aa5d5c05de7f022a03b45b9..3b1a5bc0d1fb9e4bfc943bd1d71eecdba1760edc`
Branch: `codex/cli-shell-retirement`
Worktree: `../app-worktrees/cli-shell-retirement` relative to the primary checkout
Pull request: https://github.com/ronen/postcode/pull/15

## Review assignment and boundaries

Independently review the complete authorized retirement, including surviving
responsibilities and actual rendered disclosure. Inspect implementation and evidence;
this handoff, implementing-agent verification and the accepted earlier checkpoint
are not proof of correctness. Recommend whether the final review gate is sufficient,
with actionable findings and unverified limits. Do not change product code, governing
material, the task record or task status. No live inference or credential use is
requested. The human arranges this review.

The baseline contains the approved plan and task prerequisites. Its source matches
the examined source baseline `5f9534aeee06996843c74548a3083b11df8815bf`.
The earlier [lifecycle assignment](2026-11-25-terminal-lifecycle-handoff.md),
[round 1 findings](2026-11-25-terminal-lifecycle-round-1-findings.md) and
[disposition](2026-11-25-terminal-lifecycle-disposition.md) remain historical.
The human accepted that checkpoint and authorized continuation. This assignment
now includes the full retirement, rendering correction and integrated preservation.

## Governing context

- [Approved plan](../../../docs/plans/cli-shell-retirement.md),
  [retirement decision](../../../docs/decisions/cli-shell-retirement.md), and
  [accepted invalidation clarification](../../../docs/decisions/terminal-session-invalidation.md).
- [Task and follow-ups](../../tasks/2026-11-25-cli-shell-retirement.md), including
  per-alternative standalone diagram disclosure and the human's requested carried-forward checks.
- [Application specification](../../../docs/app-specification.md),
  [core concepts](../../../docs/core-concepts.md),
  [architectural constraints](../../../docs/architectural-constraints.md), and relevant
  [foundation](../../../foundation/README.md) commitments.
- [Execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md),
  [qualified answers](../../../docs/decisions/qualified-answers-over-contributions.md),
  [internal application entry](../../../docs/decisions/internal-application-api.md),
  and [research recording policy](../../../docs/decisions/research-question-driven-observation.md).

## Result under review

`postcode` provides authentication/help only. Retired commands refuse without project
opening or investigator configuration. The interactive/one-shot investigation host,
private worker/protocol, CLI adapter/scopes/validation deferral, mechanical human
Views, alias allocator/lookup, observation/feedback implementation and exclusive
scripts/dependencies are removed. Direct semantic operations, exact retained support,
qualified resolution, attribution/usage and account protections remain.

Trial explanation and state-diagram rendering consumes only supplied content under
`scripts/structured-accounts/support/`. SVG/text diagrams carry their own alternative's
interpretation status and applicable owner limitations, intentionally correcting the
baseline. Core has no dependency on trial support. Private investigator wire handles
and instructions remain unchanged.

Opened-Session invalidation and abort preserve the first established cause, accounting
and shared shutdown assessment. Cleanup/report failures remain distinguishable and
repeat-observable without repeated cleanup. The contract is cooperative and has no
overall shutdown deadline. Existing opening-error, output case-rule and runner-cleanup
limitations remain outside scope. No replacement investigation UI, persistence,
public transport, research framework or broader callback isolation is introduced.

Shared Presentation negotiation remains coupled to useful requirement selection and
exact compatibility after losing its principal client. Generated-handle reserved
spellings preserve naming semantics, without retaining compact lookup. Current docs
and the research-support backlog disclose the resulting gap.

## Verification already performed

See the [integrated verification and coverage map](../../validation/cli-shell-retirement/integrated-verification.md)
for commands, precise exclusions, tool coverage and limitations. The implementing
agent ran type checking, a clean build and the final **499/499 retained tests** on
**Node 26.11.0**. This includes 38 direct shutdown cases, migrated accounting/input/
ownership checks, authentication and controlled execution of both retained trial
runners. The optional `fs-ext` binary required a local rebuild for Node 26; subsequent
authentication and full-suite runs passed. This is an environment correction, not a
source workaround.

All 18 controlled capture steps compare exactly after explicitly checked differences:
removed root alias/lifetime fields, six candidates using their unchanged precise IDs,
and five diagram disclosures/method versions. No support, identity, ownership,
qualification, option target, exchange, usage or step relationship is stripped.
Repeated final captures are byte-identical. The SVG was visually inspected on a white
background; its original transparency and overview/legend distinction remain.

No live model or credential/browser smoke was run. The scenario auditor's imports
and syntax were checked, without generating a new live capture. Existing diagnostic
and hosted transport tests use controlled collaborators. The historical sharing
prototype has checkpoint-specific assumptions; it is not a current-build API.

## Review focus and reproduction

1. **Carried-forward O1 — publication path and completion flag.** Confirm the CLI-only
   deferred path, operation host and validation plumbing are actually removed and
   direct execution always postchecks. Inspect `requestFinalized` and the direct
   “close from the completed-work callback” test: a synchronous finish callback can
   close before `finish()` returns, so the marker still distinguishes completed work
   from terminal abort. Assess this demonstrated direct need rather than assuming
   the flag remains only for a deleted publication window.
2. **Carried-forward F2 — runtime provenance.** Baseline and final comparison use
   **Node 26.11.0**, not merely any supported Node. Input identities include runtime
   provenance. Verify it is recorded and preserved; do not normalize away mismatched
   identities to compare another Node version.
3. **Old host lifecycle guarantees.** Use the coverage map and inspect deleted tests
   at the baseline against current direct tests. Check cancellation, cleanup ownership,
   delayed/late usage, accepted production before final validation, source invalidation,
   concurrency refusal, immutable exact support and ordinary failure locality.
   Distinguish intentionally retired prompt/EOF/worker races and hard compiler
   preemption from surviving lifecycle responsibilities. No direct hard interruption
   is claimed.
4. **F1/F3 active ordering and finalization.** Verify clean active invalidation;
   simultaneous participant-close and final-report failures followed by shutdown
   observation; all failure phases; and interruption before a pending change is
   detected. Preserve original causes, request/work status, internal usage, once-only
   cleanup and identical repeated shutdown assessment. Ordinary request failures
   must not poison later idle shutdown.
5. **Qualified preservation and complete retirement.** Check exact names/ambiguity,
   same-Session record validation, kind/applicability distinctions, qualified missing/
   incomplete populations, fixed historical support, fresh/option chains and exact
   option targets. Audit transitive imports, remaining exports, scripts, dependencies
   and current docs for accidental loss or retired compatibility routes.
6. **Actual disclosure.** Open the committed standalone SVG and text, inspect both
   against their structured input and the different-alternative fixture, and verify
   interpretation/owner limitations stay with their own diagram. Check incompatible
   and unrendered notices and unchanged core semantics. Inspect the comparison
   implementation instead of trusting its success message.

Run from the task worktree, with a native dependency installation matching the chosen
runtime and local socket/process-lock access for authentication tests:

```sh
node --version # v26.11.0 for the capture comparison
npm run check
npm run build
node --test --test-concurrency=2 _build/test/*.test.js
node scripts/structured-accounts/capture-retirement-baseline.mjs _verification/review-retirement /private/tmp/postcode-cli-retirement-controlled
node scripts/structured-accounts/compare-retirement-capture.mjs records/validation/cli-shell-retirement/baseline/capture.json.gz _verification/review-retirement/capture.json
```

Use a clean build when comparing revisions: TypeScript does not delete old emitted
files. Keep the synthetic fixture's absolute path identical; its capture refuses to
overwrite unexpected content. Do not modify analyzed checkout inputs while running
fresh-process reproducibility tests. This task adds no cross-Session identity promise.

## Findings return

With repository write access, follow the [findings template](../../../dev/templates/review-findings.md)
and create `records/reviews/cli-shell-retirement/2026-11-25-integrated-retirement-round-1-findings.md`
(or the actual review date and subsequent round). Identify this handoff, exact target,
scope, method, verification and limits; preserve the review under `## Returned findings`.
Commit only that record and modify nothing else. Without repository write access,
return the findings to the human for preservation. Do not interpret a clean review
as authority to close the task or merge.

## Review gate

The implementing agent pauses for human-arranged final integrated review under
[task protocol §4](../../../dev/task-protocol.md#independent-review). Review findings
can require corrections and further rounds. The task remains active until the human
confirms the gate is sufficient; this handoff does not authorize closure or merging.
