# CLI shell retirement preservation evidence

Task: [Surgical CLI shell retirement](../../tasks/2026-11-25-cli-shell-retirement.md).
Approved source baseline: `5f9534aeee06996843c74548a3083b11df8815bf`.
Implementation starts at `5db2cf19f0436d206aa5d5c05de7f022a03b45b9`; no intervening source changes.

## Controlled baseline

The committed baseline, its initial repeat, and the implementing agent's original
post-lifecycle comparison all used **Node 26.11.0**. Use that exact Node version for
byte comparison. The captured `node` value is method provenance and contributes to
`analysis-inputs` identities: a different supported runtime can legitimately change
both that value and derived IDs. Do not strip runtime provenance or identity fields
to obtain equality. Round 1 independently reproduced byte equality under Node 26.11.0;
its Node 22.13.1 comparison differs in runtime provenance and derived input identities,
as recorded in the findings. Record the exact runtime again for the final integrated
comparison and in subsequent handoffs; the original handoff remains historical.

Before removal or movement, using Node 26.11.0, run:

```sh
npm run build
node scripts/structured-accounts/capture-retirement-baseline.mjs _verification/baseline /private/tmp/postcode-cli-retirement-controlled
node scripts/structured-accounts/capture-retirement-baseline.mjs _verification/baseline-repeat /private/tmp/postcode-cli-retirement-controlled
cmp _verification/baseline/capture.json _verification/baseline-repeat/capture.json
```

Both captures are byte-identical. `baseline/capture.json.gz` is the full sanitized
capture, compressed without a timestamp. It contains only a synthetic two-module
fixture, controlled participant contributions and real application coordination.
No credentials, live inference, or private repository material are used. The supplied
fixture path must remain identical when comparing builds; the script refuses to
replace unexpected contents. Its UUID sequence and monotonic clock are controlled
before loading application modules. Every precise identity, owner, target and
step relationship is retained, without a cross-Session identity claim. No fields
are excluded at this baseline. Comparison after retirement will list each intentional
alias-field exclusion explicitly; support and qualification are never excluded.

The capture exercises mechanical families and exact access, contribution ordinary
reuse, fresh alternatives, exact historical answers, delegated option owner/key,
qualified name-resolution failure, actual agent input delivery and final usage.
The standalone ordinary diagram and text are included for readable inspection.
Existing application, answer and state-model suites additionally cover incompatible
and unrendered alternatives, historical status and immutable exact support.

## Disclosure assessment (correction authorized, not yet implemented)

The arranged view records interpretation status and the owner limitation
“Controlled interpretation; not independently established.” The standalone diagram
SVG and text exported by the standard runner do not include either statement.
The text preserves entry, coverage and unsupported semantics, but those disclosures
do not establish the epistemic status of the account. The SVG is an overview whose
full transition meaning requires its accompanying text/legend. This is a material
pre-existing disclosure gap; equality alone cannot establish conformance. The human has directed a rendering-only correction: each standalone SVG/text
diagram must visibly carry its own alternative’s supplied interpretation status and
applicable owner limitations. The task follow-up preserves that instruction. The
correction and both-format verification remain pending after the lifecycle checkpoint.

## Direct terminal lifecycle checkpoint

The implementation retains the first established interruption/invalidation cause,
seals final dialog usage, records final attempt/work accounting and separately
assesses resource cleanup, participant cleanup, attempt notification and work
notification. Detection of invalidation starts owned cleanup without an explicit
shutdown call, and uses the same protections and assessment as terminal abort.
Invalidation alone leaves shutdown clean. Its cleanup/notification failures remain
available to later shutdown observers, while ordinary request failures remain local
to their requests. Repeated `interrupt()`/`close()` calls observe one assessment. Signal
cancellation internally observes its promise. Cooperative waits cover input validation
and asynchronous participant selection; no new asynchronous participant-close contract
or synchronous preemption is introduced. The worker and CLI remain at this checkpoint.

Verification commands:

```sh
npm run check
npm run build
node --test --test-concurrency=2 _build/test/application-shutdown.test.js _build/test/application-lifecycle.test.js _build/test/contribution-dialog.test.js _build/test/contribution-application.test.js _build/test/execution-ownership.test.js
node scripts/structured-accounts/capture-retirement-baseline.mjs _verification/after-lifecycle /private/tmp/postcode-cli-retirement-controlled
cmp _verification/baseline/capture.json _verification/after-lifecycle/capture.json
```

Type checking, build and all 93 tests in the five lifecycle/coordination suites pass.
The controlled post-lifecycle capture is byte-identical
to the pre-change baseline with no exclusions. The pre-change preservation suites
(application boundary, contribution application/answers/state) passed 32 tests.
The lifecycle checkpoint checks cover the three shutdown routes, all combinations
of participant and attempt-notification failures, work-notification failures,
missing measurements, late replies/usage, pending non-dialog selection and injected
Git validation, owned Git cleanup deadlines/escalation/eventual exit, reentrant and
repeated calls, completed work, accepted production followed by aborted final
validation, invalidation ordering and ordinary request-local failures. The test
runner detects unhandled rejections; the signal-only resource case deliberately
waits beyond the cleanup deadline before observing close.

Full-suite verification, remaining test migration, retirement, rendering relocation,
final disclosure verification and final dependency/documentation audits remain for
the integrated result. No live inference or instruction changes occurred here.

### Existing opening-path finding

Controlled failure injection against `openApplication` confirms that a process
creation defect followed by a rejection from `GitExecutionOwner.close()` surfaces
only the cleanup error. The injected process creation throws before any child exists;
this experiment tests failure propagation, not resource exit. The opening catch
awaits cleanup before rethrowing its original error. That pre-existing loss of the
original cause remains outside this active-Session correction and is recorded in the
backlog. Cleanup failure is not concealed. No additional opening lifecycle has been
introduced.

## Round 1 corrections and verification

Human direction confirmed invalidation's terminal-finalization contract in the
[task follow-up](../../tasks/2026-11-25-cli-shell-retirement.md); the
[accepted clarification](../../../docs/decisions/terminal-session-invalidation.md)
and application contract/architecture now describe it explicitly. No runtime
implementation semantics changed in these review corrections.

On Node **26.11.0**, `npm run check`, `npm run build`, and
`node --test --test-concurrency=2 _build/test/application-shutdown.test.js` pass
(all 35 tests). Five added direct-boundary cases exercise clean active invalidation,
simultaneous participant-close/attempt-report failures, all finalizer phases including
work reporting and owned cleanup, and both orders around a pending Git input change.
The paired pending-change test proves the same delayed input result invalidates
when allowed to finish and cannot relabel work after interruption. Tests observe
accounting and original cause identity, automatically started owned cleanup,
repeated/mixed shutdown promises, late usage and cleanup/report call counts.

A new controlled capture on Node **26.11.0** is byte-identical to the committed,
decompressed baseline, with no exclusions. Reproduce with the capture command above
using `_verification/invalidation-capture` as output and compare `capture.json`
with decompressed `baseline/capture.json.gz`. The historical review handoff and
reviewer's findings remain unchanged. Full integrated verification remains pending.
