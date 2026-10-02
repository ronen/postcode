Record type: handoff

# Module investigation: final integrated review

Prepared: 2026-10-02
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Review gate: final integrated review and human completion decision after acceptance of milestones 1–5
Review target: `f4328296cc8fff1f4d7fd820a4ca98ede6ce1f5c`
Baseline: `c15afdd3b03f588534ac386c2453c81da71ffb68` (task opening, before implementation)
Diff range: `c15afdd3b03f588534ac386c2453c81da71ffb68..f4328296cc8fff1f4d7fd820a4ca98ede6ce1f5c`
Branch: `codex/module-investigation`

## Assignment and boundaries

Independently review the completed slice across all five milestones, including the
human-authorized authentication addition, contract/reference improvements and
focused assessments. Inspect implementation and evidence against the approved plan,
accepted decisions and recorded human follow-ups. Assess combined usefulness and
result quality as well as mechanical correctness, security boundaries and protocol
adherence. Prior milestone acceptance, passing tests, this account and agreement
among assessment agents are context, not proof of correctness.

This is a new integrated assignment, not another milestone-5 round. The human
accepted milestone 5 after both rounds and the subsequent local corrections. Review
the cumulative integration; do not restrict scope to changes since milestone 5.
The named target is immutable; this later handoff commit supplies the assignment
only. There is no pull request for this assignment.

The human arranges the reviewer. You may run deterministic tests and offline
capture checks and read pinned subject source. Do not rerun live inference, access
real Keychain items or Codex credentials, initiate sign-in/sign-out/revocation, or
change provider settings. If more live evidence is necessary, report the exact gap
for human direction. Do not modify implementation, governing material, task status,
task record, this handoff or historical evidence. Only the returned findings record
is authorized for commit. Regenerated audit outputs should be byte-identical;
report discrepancies rather than accepting or rewriting the evidence.

## Governing context

- [Approved plan](../../../docs/plans/module-investigation.md), especially success
  criteria/completion, all five milestones, evidence/correction semantics and the
  formative protocol. The [task record](../../tasks/2026-09-29-module-investigation.md)
  preserves subsequent human choices; use these when a frozen earlier account
  predates an amendment.
- [Core concepts](../../../docs/core-concepts.md),
  [architectural constraints](../../../docs/architectural-constraints.md),
  [engineering guidance](../../../dev/engineering-guidelines.md),
  [implementation conventions](../../../docs/implementation-conventions.md).
- Accepted decisions: [investigrams](../../../docs/decisions/investigrams-and-progressive-investigation.md),
  [operations/lenses](../../../docs/decisions/investigation-operations-and-lenses.md),
  [execution/evidence](../../../docs/decisions/investigator-execution-and-evidence-access.md),
  [private reference transport](../../../docs/decisions/investigator-reference-transport.md),
  [hosted authentication/billing](../../../docs/decisions/hosted-authentication-and-billing.md),
  [transient sessions](../../../docs/decisions/transient-analysis-sessions.md),
  [execution ownership](../../../docs/decisions/execution-ownership-and-cancellation.md),
  [stable output boundaries](../../../docs/decisions/generated-output-boundaries.md).
- Current descriptive account: [architecture overview](../../../docs/architecture/README.md),
  [investigation architecture](../../../docs/architecture/investigation.md),
  [CLI](../../../docs/cli-reference.md), [hosted setup](../../../docs/hosted-investigation.md),
  [status](../../../STATUS.md) and [backlog](../../../docs/backlog.md).

Human choices include explicit API-key versus ChatGPT-plan selection; renewable
parent-owned credentials; gpt-5.6-sol/medium after gpt-6-sol was unavailable on the
account; the exact merge-anything configuration override; structural private handles
without increased evidence exposure or repair; reporter citation without correction-ID
substitution; bounded metadata/current-primary context; and the separately authorized
pass-06 dependent-account sequence. No general tuning or live rerun is authorized here.

## Integrated result and review focus

| Boundary | Current behavior and important review questions |
| --- | --- |
| Domain and retained work | Four public lenses select reusable operations. Fresh bounded dialogues acquire qualified evidence and explicitly submit whole results. Atomic validation/retention preserves interpretation status, referents, qualifications, composition, corrections, associations and provenance. Check invalid/missing references, unsupported subject kinds, partial failure and reuse independently of presentation. |
| Evidence and input validity | Subject-based evidence uses existing mechanical evaluators and captured repository inputs. Scoped claims preserve their own support/qualification; pages expose omissions and continuations. Reference availability is distinct from delivered content. README acquisition registers session validity and advances the conservative shared basis; basis membership does not mean the compiler used that input for a claim. Completed work and earlier records remain unchanged. |
| Shell, workers and observations | Stable session references support arbitrary follow-up chains and exact inspection. Parent-owned dialogue/usage and worker-owned program state must agree at cancellation, invalidation and closure. Check late usage inside the closure boundary, ignored late reports, no partial publication, and actual disclosed locations/excerpts versus a requested option or empty container. |
| Hosted routes and credentials | Project-independent sign-in/status/sign-out; optional plan permission, secure persistence and registration, automatic coordinated rotation, revocation and explicit route provenance. API-key support remains. Check exclusion from context/messages/logs/observations/artifacts, process-exit behavior, failure-safe persistence, and same-user Keychain limitations. Renewal is not inference retry. |
| Streaming and private references | Subscription-specific streaming/namespaced tools and API transport share domain validation. Successful terminal completion gates finalized output; deltas/failed/incomplete streams cannot publish. Short handles map designated fields structurally, including nested results/requests; source/prose remain literal. Availability never grants citation. Unknown/foreign handles fail exactly. Guards measure canonical-domain serialized UTF-16 exchanges, not token charges or compact wire size. |
| Revision semantics | All reachable branches participate in primary selection; recency does not resolve conflicts or establish credibility. Redisplay uses replacements' own composition; exact subjects/history remain unchanged. Corrected-context warnings propagate through citations with per-cause whole-evaluation exemptions, not through composition/provenance alone. They do not prove error or perform reassessment. |
| Bounded presentation | Revision/inconsistency pages and automatic context preserve qualification and reporter citation. Metadata-only delivery is not substantive correction exposure. Displaced accounts and reported corrections remain separately navigable without splicing trees. Bounds disclose omissions and preserve exact retrieval; they do not bound session memory or all traversal. Include the post-review R2-O1/R2-O2 corrections described below. |
| Usage and assessments | Usage survives failed/rejected/cancelled work without double-counting. Missing/anomalous values and monetary attribution remain unknown. Scripted setup and formative-role usage stay distinct. Check instructions, exposure, schema and captured outputs against the actual outcomes, including rejected drafts and incomplete sequences. |

Starting points are `src/lib/investigation/` (execution, acceptance, context,
revisions, presentation, usage and transports), `evidence-access.ts`,
`evidence-delivery.ts`, session/worker/CLI boundaries, `source-disclosure.ts`, and
TypeScript captured-input integration. The corresponding investigation, evidence,
source-disclosure, authentication, adapter, reference and execution-ownership tests
exercise real boundaries with an investigator communication double or offline
provider responses. Review regressions to existing mechanical commands as part of
the cumulative diff, not only the new lenses.

## Prior review trail and current verification

| Accepted milestone | Disposition and review trail |
| --- | --- |
| 1 — domain execution | [Disposition](2026-09-29-milestone-1-disposition.md): correction subjects, usage anomalies, citation, scoped evidence and conservative shared input basis. |
| 2 — shell/session | [Disposition](2026-09-29-milestone-2-disposition.md): parent closure usage, actual source-disclosure observations and qualified deferrals. |
| 3 — hosted baseline | [Disposition](2026-09-30-milestone-3-disposition.md): streaming, auth lifecycle, documentation discovery, exact references and bounded reassessment. |
| 4 — progressive lenses | [Disposition](2026-10-01-milestone-4-disposition.md): follow-up navigation/context and human-accepted controlled-case limits. |
| 5 — revisions | [Disposition](2026-10-02-milestone-5-disposition.md): all-branch selection, propagation, reporter citation, metadata bounds and dependent evidence. |

Read the findings linked from these dispositions, not just the implementer's
summaries. Round 2 of milestone 5 independently passed 466 tests and reproduced all
four pass-06 audits byte-identically, but did not fully inspect all formative role
inputs/outputs or independently rederive fsm-engine/merge-anything semantics.
Earlier reviews' stated limits remain; this integrated assignment is the opportunity
to assess cross-milestone gaps rather than assume cumulative completeness.

After that review, `9d189d9e0e208881b3a037da88af0d49b52b61e0` fixes a reproduced
ordering omission: an already displayed accompanying primary must still disclose
a deeper displaced original/subtree. It also covers both previously unexercised
metadata truncation paths, exact counts and retained navigation. Presentation is
now @11; investigation @11, adapter @6 and private references @3 are unchanged.
This local fix was verified by the implementer, not re-reviewed. Include it here.

The latest [full offline verification](../../validation/module-investigation/2026-10-02-milestone-5-round-2/verification.md)
at clean stationary `9d189d9` passed **468 tests**, zero failures/cancellations/skips,
153.733 seconds (163.513 with build/monitor); maximum scheduling gap 1.111 seconds,
none over two seconds. Runtime/tests/dependencies are unchanged at this integrated
target. No suite rerun was needed just to prepare the handoff.

Historical failures are not erased: the
[readiness-race diagnosis](../../validation/module-investigation/2026-09-30-execution-ownership-diagnosis.md)
resolved the deferred pre-live harness defect with a controlled reproduction, while
not attributing every old cancellation conclusively; the
[sleep/scheduling diagnosis](../../validation/module-investigation/2026-10-01-offline-diagnosis.md)
and [loopback failure account](../../validation/module-investigation/pass-06/offline-verification.md)
retain failed runs separately from successful unchanged full suites. These provide
bounded explanations, not universal execution/cancellation guarantees.

## Live evidence and independent source assessment

Begin with the [combined assessment/usage account](../../validation/module-investigation/integrated/report.md),
then read the six linked pass reports and their exact inputs, outputs, observations,
exchanges, exposure records, reference bindings, source references and formative
role dispatches/responses. The combined account is an index, not a substitute for
those records or your own source analysis. Check the
[pass-04 manifest clarification](../../validation/module-investigation/pass-04/manifest-clarification.md)
and [pass-05 review addendum](../../validation/module-investigation/2026-10-02-milestone-5-review-addendum.md).

Independently examine pinned source underlying consequential claims and compare it
with generated accounts, the implementer-prepared references and assessment findings.
Review the usefulness of the entire progressive sequence and explicit uncertainty,
not merely source agreement of a terse summary. Report unsupported conclusions,
material omissions, disagreements and claims the available evidence cannot settle.

| Upstream subject | Exact source revision | Initial module |
| --- | --- | --- |
| Cockatiel | `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e` | `src/common/Executor.ts` |
| fsm-engine | `0bd7bb2cc9df14a1b599fb2748e5daf10169f513` | `src/fsm-engine.ts` |
| merge-anything | `bc7c79fe8fce89ed3350d7b3bdf7cdd1a7633906` | `src/index.ts`, plus delegated implementation |

The [pass-05 manifest](../../validation/module-investigation/pass-05/manifest.json)
and earlier manifests identify upstream URLs, paths and hashes; license notices
accompany retained excerpts. Local disposable checkouts, when available, are under
`_investigation/module-assessment-sources/`; all three HEADs were verified against
the pins during handoff preparation. The durable evidence depends on the pins,
not continued existence of these scratch directories. Self-authored controlled
fixtures are tracked under `fixtures/`, with each pass's exact setup and source pin.

Assessments held **gpt-5.6-sol / medium / ChatGPT-plan**, Node **22.13.1** and
TypeScript **6.0.3** fixed. Merge-anything retains the approved additional configuration
`{"extends":"./tsconfig.json","compilerOptions":{"ignoreDeprecations":"6.0"}}`;
original source/configuration is unchanged. Instructions, context, transport and
presentation evolve only in separately frozen passes. Do not replay old captures as
if they had been generated by today's method versions.

Key evidence limits requiring explicit review:

- Pass 02 rejected all four normal submissions; its drafts are not accepted results.
  Pass 03 later established accepted documentation reconciliation after bounded
  changes, without proving that any single change caused improvement.
- Pass 04's controlled correction has acknowledged answer cues. The refined pass-05
  fixture reduces those cues but introduced ambiguous dependent wording and a
  rejected correction-ID citation. Neither proves spontaneous detection.
- Pass 05 has three overload failures and two bounded recoveries; merge-anything
  decomposition remains incomplete. Human milestone acceptance does not relabel it
  complete. Identify whether the final completion criterion requires a specific
  deferral decision before closure; do not silently waive or rerun the case.
- Pass 06, explicitly authorized as one focused sequence, accepts source-supported
  corrections of actual direct/transitive dependent errors. Later Z refinement
  creates compatible but structurally competing alternatives, not a new distinct
  detection. Generated “complete result” wording remains imprecise. Warnings alone
  establish neither error nor correctness.
- Semantic omissions, the Cockatiel overstatement, unavailable caller/runtime
  evidence, source-detail sections without actual code excerpts and dense repeated
  context remain. Source locations can be genuinely disclosed without an excerpt;
  disclosure-event correctness and presentation usefulness are different questions.
- Fresh evaluator/assessor contexts still share family, reference authorship and
  orchestration. Adaptive target selection (including Cockatiel selection informed
  by earlier assessor feedback), single runs and changed questions/context limit
  comparisons. Exact role model/effort/usage is unavailable where recorded as such.

The [consolidated usage summary](../../validation/module-investigation/integrated/usage-summary.json)
reconciles **203 assessment provider requests / 5,110,325 known reported tokens**,
with three missing provider reports and fifteen excluded empty synthetic reports.
It preserves per-session/run, route and pass attribution, all failures and recoveries.
Evaluator/assessor/preparer usage and actual monetary/allowance-versus-credit funding
are separately unknown, not zero. Five connection diagnostics (three known reports,
2,659 tokens; two unknown) remain outside assessment totals. API-key behavior has
offline coverage, not a live API-billed assessment. No purchase/spending changes or
silent fallback occurred. Diagnostic allowance remains two used/eight remaining.

## Offline reproduction and remaining boundaries

From the checkout, with dependencies already installed:

```sh
npm test
python3 records/validation/module-investigation/pass-03/audit-results.py
python3 records/validation/module-investigation/pass-04/audit-results.py
python3 records/validation/module-investigation/pass-04/audit-navigation.py
python3 records/validation/module-investigation/pass-05/audit-results.py
python3 records/validation/module-investigation/pass-05/audit-lifecycle.py
python3 records/validation/module-investigation/pass-05/audit-artifacts.py
python3 records/validation/module-investigation/pass-06/audit-results.py
python3 records/validation/module-investigation/pass-06/audit-lifecycle.py
python3 records/validation/module-investigation/pass-06/audit-dependent-evidence.py
python3 records/validation/module-investigation/pass-06/audit-artifacts.py
python3 records/validation/module-investigation/integrated/aggregate-usage.py
```

OAuth tests need permitted loopback listeners; constrained environments may report
`EPERM`. Keep repository inputs stationary and avoid sleep during a suite run;
report the actual environment and any failed/cancelled runs. Do not weaken timeouts
or substitute isolated passes for a failed full suite. Audits recompute analysis
files from exact captures; record any mismatch and restore only your own generated
changes. Preserve intentional transcript whitespace and opaque provider transport
payloads; do not decode private reasoning content or inspect real credentials.

Out-of-scope candidates stay in the backlog: model configuration, retry/forced
regeneration, automatic reconsideration, UI redesign, paths outside sourceDetail,
existing output-case boundaries and other pre-existing concerns. No GUI, persistence,
arbitrary questions, target runtime execution, general model comparison or spending
control was added. Check that documentation states these limits without using them
to dismiss a defect in the authorized slice.

## Findings return and final gate

If you have repository write access, use the
[findings template](../../../dev/templates/review-findings.md) and create
`records/reviews/module-investigation/YYYY-MM-DD-integrated-round-1-findings.md`
(add a reviewer suffix only when needed). Start with `Record type: findings`;
identify yourself, this handoff, round, exact target and actual scope/method/checks.
Preserve your report under `## Returned findings`. Include actionable findings,
non-defect observations, unverified areas, source-grounded quality/usefulness
judgments, remaining uncertainty and your recommendation on task completion.
Commit only that record and modify nothing else. Without write access, return the
findings to the human for preservation. Subsequent rounds remain under this handoff,
with exact new target, prior findings and changes identified.

The implementer dispositions every finding and asks the human before rejection,
material qualification, consequential alternatives, scope expansion or proceeding
through reviewer-identified uncertainty. A reviewer recommendation is not acceptance.
The active task remains open until findings and required work/deferrals are resolved
and the human explicitly accepts the final gate. Do not close the task or infer
completion from the five accepted milestone gates.
