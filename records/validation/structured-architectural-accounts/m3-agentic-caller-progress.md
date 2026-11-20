# M3 agentic/caller migration — implementation progress

Date: 2026-11-18
Status: work in progress; not an independent-review handoff
Task: `2026-11-15-structured-architectural-accounts`
Branch: `claude/structured-architectural-accounts`
Mechanical acceptance: `afb0aa1`, `142a046`

The human accepted the mechanical checkpoint and authorized continuation. The caller checkpoint remains separate and unaccepted. No additional live inference is authorized or was performed.

## Working changes

- Route the four existing agentic operations through common contributions and the fixed Session operation catalog; use the common hosted dialog and private worker bridge.
- Support exact whole-contribution, content/component and result-designation inputs. Capture independent inspection selections, explicit associations, reverse exact-subject investigations and their qualified support.
- Combine native and common inspection when a designation selects both. Preserve the native answer's identity independently of accumulated associated findings.
- Resolve common identities and historical identifying names without inferring identity from spelling. Allocate contribution aliases within ledger lifetime.
- Add a common CLI arrangement, fixed association/change pagination, source-body separation and responsible presentation methods. Hosted native finding references use typed program-record traversal; unknown/literal content bodies are not searched for references.
- Attribute accepted productions and reuse to the originating request; distinguish acquisition from dispatch in evidence reporting.

This is an intermediate implementation commit, not a completed checkpoint. Several legacy implementation helpers remain for their unit tests; removal and complete retirement still need an explicit audit.

## Verification so far

On Node v26.11.0, the compiled working revision passes 55 tests across:
`m3-agentic-cutover`, `contribution-hosted`, `application-client`,
`application-exact-compatibility`, `application-lifecycle`,
`application-services`, and `lens-extensions`.
The local log is `_verification/m3-cutover-adapted.log`.

This includes exact historical presentation after redesignation, detached presentation after close with ledger/store tripwires, mixed inspection continuations and unknown-cursor restart, caller mutation isolation, simultaneous Sessions, worker delivery/usage, and typed hosted-reference translation without live requests. The unchanged legacy evaluator's definition-fingerprint test remains a legacy unit test; it is not evidence that the new common operation catalog fingerprints changed definitions.

`npm run build` still exits 2 because caller tests in `application-journey`, `human-output`, `investigation-integration`, `openai-investigator`, `retained-presentation`, `source-disclosure`, and `work-attribution` still use legacy agent types. No source TypeScript errors were reported in that build. The full suite has not passed or been claimed. `git diff --check` passes. Representative memory measurement has not been repeated for this partial caller migration.

## Unresolved contract decision

Accepted M2 behavior deliberately excludes failed-attempt diagnostics from an empty contribution answer; different failures and an accepted empty contribution can have the same answer identity. Invocation reporting retains the attempts. The governing migration decision, `docs/decisions/qualified-answers-over-contributions.md`, says: “Retained unavailable selections preserve kind/code/diagnostic”. Existing summary/follow-up callers test that historical contract.

A clarification was requested before completing failure capture: either explicitly extend the M2 reporting-only behavior to all agentic operations with a corresponding contract clarification, or preserve retained failures for the existing four operations while keeping M2 unchanged. No answer has been assumed. Existing assertions about retained failure detail must not simply be removed.

## Remaining before the caller checkpoint

Resolve that semantic choice, complete test migration and the coverage mapping, audit bounded presentation and qualification visibility, verify all common acquisition/work-attribution paths and operation-definition identity, run the full suite under the reference runtime, repeat the representative memory workload as appropriate for the changed inspection contract, and finish implementation/capability documentation. Then commit a distinct caller review handoff. M4 integrated review remains a later gate.

## Subsequent resolution and checkpoint

The human resolved the conflict through accepted decision `investigation-attempts-and-answer-outcomes.md` at `bd9f581`. Implementation direction was recorded before the affected changes in task follow-up `fc9d909`. The earlier progress report above remains historical evidence. The completed caller implementation and verification are recorded in [the caller checkpoint](m3-agentic-caller-checkpoint.md), with [test migration coverage](m3-agentic-caller-coverage.md). Mechanical acceptance does not accept this separate checkpoint.
