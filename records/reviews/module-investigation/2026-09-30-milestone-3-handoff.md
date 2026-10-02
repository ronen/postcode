# Module investigation milestone 3: hosted execution and formative summaries

Record type: handoff
Prepared: 2026-09-30
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Review gate: milestone 3, before follow-up lenses and milestone 4
Review target: `986fddb6945eadf613ca28899003916fc689f8b7`
Baseline: `6f164016c0291ec94cbdf8febb382ebca64d7af5` (milestone 2 accepted)
Diff range: `6f164016c0291ec94cbdf8febb382ebca64d7af5..986fddb6945eadf613ca28899003916fc689f8b7`
Branch: `codex/module-investigation`

## Review assignment and boundaries

Independently review milestone-3 implementation, tests, source and captured live
assessment evidence. Do not treat this handoff, prior test results, evaluator
agreement or earlier reviews as proof. Recommend whether the implementation and
qualified assessment evidence are adequate for the milestone gate, identifying
remaining defects, uncertainty and any human choices. In particular, assess the
missed conflicting-documentation case rather than treating all accepted
submissions as a fully passing assessment.

The human arranges the review. This assignment permits only a findings record;
do not change implementation, governing material, task status or the task record.
Use offline verification and captured live evidence. Do not access real Keychain
items, inspect Codex credentials, sign out, alter provider settings or issue live
provider requests as part of this review. Findings should identify any additional
live evidence needed for the human to decide.

## Governing context

- [Approved plan](../../../docs/plans/module-investigation.md), including the
  authorized ChatGPT-plan addition, fixed human-selected model and formative
  assessment/retry protocol.
- [Hosted authentication and billing decision](../../../docs/decisions/hosted-authentication-and-billing.md).
- [Investigator execution/evidence access](../../../docs/decisions/investigator-execution-and-evidence-access.md),
  [investigrams/progressive investigation](../../../docs/decisions/investigrams-and-progressive-investigation.md),
  [operations/lenses](../../../docs/decisions/investigation-operations-and-lenses.md),
  [transient sessions](../../../docs/decisions/transient-analysis-sessions.md).
- [Core concepts](../../../docs/core-concepts.md),
  [architectural constraints](../../../docs/architectural-constraints.md),
  [investigation architecture](../../../docs/architecture/investigation.md),
  [setup and disclosure](../../../docs/hosted-investigation.md).
- [Task follow-ups](../../tasks/2026-09-29-module-investigation.md) preserve the
  model choice, override approval, diagnostic authorization and clarification that
  the ten-request limit concerns debugging rather than planned assessments.

## Result under review

The parent-only OpenAI Responses adapter supports explicit API-key billing and
persistent Sign in with ChatGPT with granted plan use. Browser sign-in works
without a project, validates authorization/identity/permissions, and persists
registration and rotated credentials in protected storage. Renewal is coordinated
across processes; ordinary exit retains authorization. Status/sign-out and local
revocation notification are included. Same-user processes are not absolutely
isolated by Keychain, as disclosed. No Codex credentials are reused.

The subscription route uses streaming and namespace tools. Completion requires a
successful terminal event; finalized indexed items may supply an empty terminal
output only after validated event-sequence consistency. Unfinished output is never
accepted. Headerless SSE, native first-sign-in storage and browser-launch issues
found during human setup were corrected with recorded evidence and regressions.
Explicit submission/domain validation, cancellation, execution guards and no
inference retries remain in force; renewal does not restart an investigation.

Requested and provider-reported configuration/usage are separate; selected route
is visible. Reports retain anomalies and unknown consumption, preserve closure
accounting, and do not turn token totals into actual subscription charges. No
purchase or provider-side spending setting was changed. API-key coverage remains.
The ChatGPT route is fixed to **gpt-5.6-sol / medium**, human-selected after
**gpt-6-sol** was unavailable; no Astra or billing fallback occurred.

The [assessment pass](../../validation/module-investigation/pass-01/report.md)
retains exact pinned/effective configurations, source-based references, instructions,
questions/rubric, commands/views, observations, sanitized exchanges and fresh
role inputs/outputs. Merge-anything uses the exact approved `ignoreDeprecations:
"6.0"` override with **TypeScript 6.0.3**, preserving original tracked source and
configuration. Assessment and diagnostic request ledgers are separate; eight of
ten authorized additional diagnostic requests remain.

## Verification already performed

- Complete offline `npm test` at `6a214807d231d30c3925ef523785753bb4635c32`:
  **419 passed, 0 failed, 0 cancelled, 0 skipped**, 151.833 seconds, including build.
  Repository inputs were unchanged throughout; loopback permission supports actual
  local callback tests. Later changes through the review target are verification
  documentation and current-status wording only.
- Focused harness/transport run: 12 passed. Earlier detailed
  [API adapter](../../validation/module-investigation/2026-09-30-milestone-3-offline-adapter.md),
  [ChatGPT lifecycle](../../validation/module-investigation/2026-09-30-milestone-3-chatgpt-offline.md)
  and [completed stream items](../../validation/module-investigation/2026-09-30-chatgpt-completed-items.md)
  records describe regression boundaries and live diagnostic history. Later
  successful checks do not rewrite earlier failed/unknown-consumption attempts.
- Six planned live cases: five accepted interpretations and one deliberate
  character-guard stop before inference; **21 requests / 666,727 reported tokens**.
  No missing/anomalous usage in this pass. All six command/usage/observation totals
  agree and post-run pin/configuration checks pass. Real monetary attribution and
  evaluator/assessor usage are unavailable, not zero.
- Six fresh view-only evaluators and six fresh source-informed assessors ran using
  only their recorded inputs. They are formative assessment agents, not the
  independent implementation reviewer. Exact model settings/usage were unavailable;
  common model family, orchestration and implementing-agent reference preparation
  limit independence. No prompt tuning or regeneration followed their findings.

The historical cancellation concern was diagnosed before live adapter work:
[bounded reproduction and correction](../../validation/module-investigation/2026-09-30-execution-ownership-diagnosis.md),
commit `6677ccc`. Readiness could remain pending after the child had already been
terminated by its deadline. The fixture now rejects early exit and establishes
readiness before testing escalation. Historical cancelled suites remain cancelled;
the diagnosis reproduces their signature but cannot establish every historical
occurrence's timing or prove universal production/remote cancellation correctness.

## Review focus and reproduction

Run `npm ci`, `npm test` on the supported Node runtime (recorded 22.13.1). Tests use
synthetic credentials and offline provider responses. Authentication callbacks
need local loopback permission. The [assessment harness guide](../../../scripts/module-investigation/README.md)
explains source/configuration reproduction; inspect captured live runs without
regenerating them.

Focus on:

1. OAuth callback/ID-token/scope validation, registration and credential persistence,
   refresh coordination, failure/revocation semantics and credential exclusion
   across parent, workers, tools, diagnostics, observations and captures.
2. Explicit route selection and the distinct subscription Responses contract;
   streaming completion/identity validation, tool namespace/argument validation,
   cancellation, usage acceptance boundaries and absence of hidden retries.
3. Preservation of investigation semantics and API-key behavior through the real
   CLI/worker boundary; evidence delivery, qualified invalid/limited outcomes and
   monetary/usage reporting without overclaiming.
4. Assessment reproducibility, unchanged source pins, exact override/compiler/model,
   fixed prompts, request counts and role separation. Confirm the ledger's 192-call
   theoretical ceiling is not represented as a usage target or a new spending grant.
5. Assessment adequacy and limitations: fsm-engine context-isolation wording;
   exception/ownership omissions; dense evidence/repeated accounting and generic
   correction footer; the guard evaluator's name/state misunderstanding. The mixed
   fixture never acquired README, so its conflict omission is recorded and
   **reconciliation after disclosure is unassessed**. Do not silently waive this
   coverage gap, infer a prompt fix is authorized, or equate accepted validation
   with factual correctness. Several reference summaries cannot settle all emitted
   detail, and no upstream runtime test suite was executed.

Public explanation/decomposition/examination, progressive sequences and later
correction-selection/reconsideration remain milestone-4/5 work. Their absence from
summary-only views is not itself a defect at this gate. The future model-selection
backlog is not additional implementation scope.

## Findings return

Use [the findings template](../../../dev/templates/review-findings.md). If repository
write access is available, create
`records/reviews/module-investigation/2026-09-30-milestone-3-round-1-findings.md`,
record this handoff, actual immutable target/range, reviewer/method, checks,
actionable findings, non-defect observations, unverified areas and gate recommendation.
Preserve authored findings under `## Returned findings`, commit only that record,
and modify nothing else. Without write access, return the complete findings to
the human for preservation. Later rounds use the next round number and identify
their actual target plus prior findings and corrections.

## Review gate

Pause for independent review and human milestone-3 acceptance. The task remains
active and milestone 4 has not begun. Material corrections may require another
review round; the human decides whether accumulated review and qualified
assessment evidence are sufficient. Do not infer acceptance from an assessor or
reviewer's recommendation.
