# Integrated CLI retirement verification

Date: 2026-11-25
Task: [Surgical CLI shell retirement](../../tasks/2026-11-25-cli-shell-retirement.md)
Plan: [CLI shell retirement](../../../docs/plans/cli-shell-retirement.md)
Source implementation: `35fc782` (following the accepted lifecycle checkpoint and trial-rendering relocation).
Documentation: `7ecbe433d85d55446d1c7cdbc1c107d914caa04c`.

This is implementing-agent verification, not independent review. The task remains
active for the final integrated review. The prior lifecycle findings and disposition
remain unchanged as historical records.

## Controlled preservation and standalone disclosure

Baseline and all final comparisons used **Node 26.11.0**, TypeScript 6.0.3, the same
absolute synthetic fixture path `/private/tmp/postcode-cli-retirement-controlled`,
and the capture's controlled UUID/monotonic clock. No runtime or identity fields
were removed or normalized. A different supported Node version can change captured
method provenance and derived input identities and is not an equality oracle.

[Baseline capture](baseline/capture.json.gz) and [integrated capture](after/capture.json.gz)
retain all 18 steps, exchanges, attempts, usage, complete qualified content and
exact reference connections. The uncompressed baseline SHA-256 is
`7c8af4e41ced1590f3ac9be352aacb513cda7ccf5c6b0222b3f441c3ff53f919`;
the integrated SHA-256 is
`f4dd1b3e39179f7bbc08168e6a75719eccc66a218d0f7b292e0d021c08748fd4`.
Final captures repeat byte-identically. The [comparison result](after/comparison.json)
is reproducible with:

```sh
node --version # v26.11.0
npm run build
node scripts/structured-accounts/capture-retirement-baseline.mjs _verification/retirement-capture /private/tmp/postcode-cli-retirement-controlled
node scripts/structured-accounts/compare-retirement-capture.mjs records/validation/cli-shell-retirement/baseline/capture.json.gz _verification/retirement-capture/capture.json
```

The comparison checks only these intentional differences:

| Location | Difference |
| --- | --- |
| Application envelope root | Remove 17 `bindings`, 17 `answerReference`, 18 `referenceLifetime`, and one `referenceNotice` field. Nested support is never excluded. |
| Six resolution candidates | Replace the compact spelling with that candidate's own unchanged precise ID; the old spelling must match its ID prefix. |
| Five diagrams | Method `postcode/state-transition-diagram@7` becomes `@8`; text appends the alternative's supplied qualifications, SVG adds visible qualification text and extends its canvas. Existing SVG picture markup is byte-identical. |

Everything else compares exactly: core methods, input provenance, identities,
selected/historical support, alternatives, option owner/key and targets, request and
step relations, actual delivered inputs, qualification, prose, usage, state models,
state/transition legends and notes. The script checks that each disclosure is derived
from that same alternative in the baseline's unchanged structured input. It verifies
the complete SVG text, distinct line positions inside its canvas, unchanged graph,
and exact appended text. This is not an allowlist that discards diagram fields.

The [standalone SVG](after/ordinary-0-0.svg) and [text](after/ordinary-0-0.txt) now
carry interpretation status and applicable owner limitations. This is the human's
authorized rendering-only correction to the baseline disclosure gap, not semantic
drift. Visual inspection used `rsvg-convert` with a white background: the picture and
all qualification lines are visible without clipping. The SVG retains its original
transparent background. Its picture remains an overview; the existing text/legends
carry full transition meaning. Structured JSON remains authoritative.

`contribution-answers.test.ts` additionally uses two alternatives with different
owner/item limitations (including XML punctuation), verifies both SVG and text from
the same supplied content, and rejects qualification leaking between alternatives.
Other answer/state tests retain incompatible and unrendered models, collisions,
coverage/entry disclosures, historical support and partial result fulfillment.

## Lifecycle and responsibility migration

The former host's tests are not treated as disposable merely because their imports
were retired. Surviving requirements are checked at the owning direct or domain
boundary; retired rendering/transport assertions are intentionally removed.

| Former host coverage | Retained verification |
| --- | --- |
| Session ownership, accumulation, close and detached results (`session`, `application-journey`, `application-cli-outcomes`) | `application-boundary`, `application-client`, `application-lifecycle`, `session-inputs`, `foundation-identity` and `foundation-ownership`: full selected content, immutable exact support, distinct Session ownership, retained identities and reports after close. |
| Active interruption/close, first cause, callback failures and accounting (`investigation-integration`, `execution-ownership`) | All 38 `application-shutdown` cases through `openApplication`: interrupt/signal/active-close matrix; participant/attempt/work-report/resource failures; repeated/mixed observers; late reply/usage; pending agent selection and injected Git; clean and failing active invalidation; both pending-change orders; completed production and final validation; concurrency refusal and opening cancellation. |
| Late usage, unknown/anomalous/overflow measurements and failed/reused investigations (`investigation-integration`) | `investigation-usage`, `investigation-answer-outcomes`, `contribution-dialog`, `contribution-application`, `work-attribution`: delayed reports from an earlier reply before sealing, non-finite serialization, aggregate overflow, ordinary failure retention/retry, evidence dispatch and sealed late rejection. Known incompatible retained subjects refuse before another agent opens. |
| Git deadlines/escalation, actual exit, cleanup ownership, spawn/output failure and opening/validation behavior | `execution-ownership` plus `application-shutdown`: real controlled child exit and deterministic failure injection; qualified opening timeout/recovery; incomplete cleanup retains exit ownership. Injected `runGit` remains caller-owned. |
| Input invalidation, generated outputs and publication (`session-inputs`, worker publication tests) | Direct pre/post execution checks, compiler/repository/output-boundary suites and client-neutral `guardPublication` tests. No private deferral or validation bypass remains. |
| Requests, qualified refusals, exact support and extensions (`request-model`, `request-designation-input`, `lens-extensions`, `exports-lens`, `presentation-compatibility`, `retained-presentation`) | `application-lifecycle`, `application-references`, `application-exact-compatibility`, `subject-resolution`, `answer-identity`, `collection-selection`, `projection-content` and contribution suites: capture without accessors, declaration/subset compatibility, foreign/unknown/unsupported targets, names/ambiguity, missing versus incomplete/unavailable populations, exact access without acquisition, qualified unbounded content. |
| Trial rendering and chained options | `contribution-answers`, `contribution-state`, `structured-trial`, controlled capture/comparison: ordinary reuse, fresh alternatives and exact option owner/target continuity; distinct diagram qualifications. |
| Hosted/authentication behavior | Existing `chatgpt-auth`, diagnostic/transport/reference and OpenAI investigator tests, with real direct application coordination; `authentication-cli` verifies safe labels/errors/help, retired-command refusal without credentials and no import path to project opening/hosting. |

Prompt editing, EOF queues, shell tokenization, terminal layout/paging, observation
publication, alias collisions, stale worker replies and worker-send/exit races retire
with their respective owners. They are not new direct-Session guarantees. Hard
preemption of synchronous compiler work also does not survive worker removal: the
accepted direct execution contract is cooperative. No overall shutdown deadline,
descendant-tree termination or general callback isolation is claimed.

### Carried-forward review points

**O1:** `application/operation-scope.ts`, its registration/evaluation host, CLI-only
input constraints and the deferred publication path are removed. Direct execution
always performs its postcheck. The `requestFinalized` marker remains for a proven
direct need: an `onWork` finish callback can call `close()` synchronously before
`finish()` returns. The direct test named “close from the completed-work callback
preserves completed direct delivery and establishes SessionClosed” verifies that
completed work stays completed and no new interruption is established. Removing
that flag without another mechanism would regress this direct case.

**F1/F3:** the accepted invalidation clarification remains in the contract, decision
and implementation documentation. Detection starts owned cleanup and uses the same
protected finalization and memoized shutdown assessment as abort. First-established
`SessionInvalidated`/`invalidated` survives later interrupt/close; interruption before
a pending change is detected remains `interrupted`. Clean invalidation alone does
not fail shutdown. Original simultaneous participant, attempt/work-report and
owned-resource failures remain observable without repeated cleanup. Ordinary request
failures remain local to that request.

**F2:** Node **26.11.0** is recorded here, in the capture procedure and in the final
handoff; the comparison executable rejects a different running Node version.

## Final checks and retained tools

On Node **26.11.0**, type checking and a clean build passed. The final retained
suite passed **499/499 tests**, with zero failures, cancellations or skips:

```sh
npm run check
npm run build
node --test --test-concurrency=2 _build/test/*.test.js
```

The final suite ran against source `35fc782` and documentation `7ecbe43`, after
removing the remaining host-only helpers. Earlier intermediate runs and their
corrected issues are not substituted for this final result. `git diff --check`
and current-document relative-link checks pass.

The first unrestricted full run exposed a local `fs-ext` binary built for Node 22
(ABI 127) under Node 26 (ABI 147). Rebuilding that optional dependency locally with
`npm rebuild fs-ext --offline --nodedir=/usr/local` resolved both credential-lock
failures; all 20 authentication tests then passed. No product source or dependency
version was changed to accommodate the environment. Local socket and process-lock
tests require execution outside the filesystem/network sandbox.

All 13 retained `.mjs` scripts parse and their static imports resolve. The real
standard trial runner executes with credential access and only its communication
participant replaced in a child process; it verifies files, ordinary/fresh/option
chains, usage and success-path budget close. The dialog14 runner's actual `--offline`
path verifies its exact option and deduplicated qualified inputs. These checks do
not claim live inference equality or actual model quality. The scenario auditor's
imports/syntax remain valid; no new live capture was generated for it. Existing
authentication/usage diagnostic tests exercise controlled boundaries; this task did
not launch a browser or perform a live credential/connection check.

Direct contribution measurement runs in its retained integration test. The memory
profiler completed its 18-request journey, overlapping selections, historical-hash
preservation/fresh identity and closed-state release on a controlled 40-module
fixture. Its overlap scenario requires at least 16 project modules; the two-module
preservation fixture is too small. No comparative performance claim follows.
The historical scratch sharing transformer still runs its local ownership controls;
its transformed build is an experiment for the pre-sharing checkpoint documented in
[the original investigation](../structured-architectural-accounts/m3-memory-investigation.md),
not a compatibility promise for current production builds.

Source/import audits found no surviving production reference to the retired cluster
and no core import of trial support. A final export audit removed the unused
CLI composition classifier, artifact-classification boolean wrapper, work summary and
worker incomplete-report helper. Shared complete work reporting remains. The package
command stays; `string-width` and its three exclusive transitive dependencies are
removed, with optional credential dependencies retained. Investigator instructions
and private wire handles are unchanged; controlled exchanges compare exactly.

## Deliberate residuals and limits

Shared Presentation negotiation lost its principal CLI client but remains coupled
to useful standard/subset requirements and exact compatibility under its existing
contract. It needs later presentation/acquisition design to separate; no artificial
caller was added. Generated module handles keep their established reserved spelling
rules to avoid changing naming semantics/method identity; this supplies no compact
lookup. The completion marker's direct need is described above.

Current README, status, capability/authentication references, hosted setup,
architecture and conventions describe direct access, trial rendering, cooperative
execution and the research-support gap. The adopted backlog already covered most
retirement premises; remaining captured-basis/observation references were clarified
without reprioritizing candidates. No foundation, steering, development-process,
application-specification or governing-concept/constraint files were changed.

Observation delivery, human disclosure classification and contextual feedback are
absent; operational work/usage and trial artifacts are not replacements. The
[research-support candidate](../../../docs/backlog.md#research-observation-and-feedback-after-cli-retirement)
remains open. The existing opening-path loss of an original error when cleanup also
fails, output case-rule limitations and trial failure-capture/cleanup limitations
remain disclosed and outside scope. The standard runner can skip budget close when
Session close fails; both runners can replace an earlier error during cleanup. No
new UI, persistence, transport, runner lifecycle or broader callback policy is introduced.
