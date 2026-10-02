Record type: handoff

# Module investigation milestone 4: progressive investigation

Prepared: 2026-10-01
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Review gate: milestone 4, before correction-aware presentation and milestone 5
Review target: `69c86d6125441ea151f3dd2dbbe95cfc870a25ab`
Baseline: `b46074d` (milestone 3 implementation accepted by the human in `e25d727`)
Diff range: `b46074d..69c86d6125441ea151f3dd2dbbe95cfc870a25ab`
Branch: `codex/module-investigation`

## Assignment and boundaries

Independently review the implementation, tests, pinned-source evidence and captured
formative results for milestone 4. Recommend whether they are adequate for this
gate, identifying defects, uncertainty and human decisions. Do not treat this
handoff, prior tests, accepted submissions or assessment-agent agreement as proof.

The human arranges review. This assignment permits only a findings record; do not
modify implementation, governing material, this handoff, task status or task record.
Use offline checks and retained live evidence. Do not access real Keychain items,
inspect Codex credentials, sign out, change provider settings or issue live requests.
Identify any additional live evidence needed for human authorization.

## Governing context

- [Approved plan](../../../docs/plans/module-investigation.md), especially milestone 4,
  deterministic checks, progressive/focused assessment and controlled setup.
- [Core concepts](../../../docs/core-concepts.md) and
  [architectural constraints](../../../docs/architectural-constraints.md).
- Accepted decisions: [investigrams and progressive investigation](../../../docs/decisions/investigrams-and-progressive-investigation.md),
  [operations and lenses](../../../docs/decisions/investigation-operations-and-lenses.md),
  [execution and evidence access](../../../docs/decisions/investigator-execution-and-evidence-access.md),
  [reference transport](../../../docs/decisions/investigator-reference-transport.md),
  [hosted authentication and billing](../../../docs/decisions/hosted-authentication-and-billing.md).
- [Investigation architecture](../../../docs/architecture/investigation.md),
  [CLI reference](../../../docs/cli-reference.md),
  [hosted setup](../../../docs/hosted-investigation.md),
  [milestone-3 disposition](2026-09-30-milestone-3-disposition.md).

## Result under review

Shell `explain`, `decompose` and `examine` select retained investigram references,
including results of earlier follow-ups. Parsing rejects unsupported selections
without inference. Evaluation retains operation-based reuse, explicit submission,
validation, cancellation, guards and no automatic inference retry. Mechanical
inspection does not trigger generation.

Inspection exposes bounded explicit associations and continuations, stable references,
fixed composition and separate investigation-subject provenance. Association roles
remain qualified; originating-module identity or incidental mention alone does not
establish an association. Empty listings are not absence-of-functionality claims.
Account previews disclose omission and preserve whole qualification or explicit
qualification omission. View identity includes reference lifetime.

The investigator can list explicitly associated earlier accounts and retrieve
selected context. Bare handles/listings establish availability, not delivered
content, citations or correction eligibility. Structural reference translation
covers the new fields. Existing correction-aware investigator context remains in
force. Human views retain original accounts and explicit correction links; automatic
replacement selection, derived revision warnings/conflict presentation and integrated
reconsideration display remain milestone 5.

A private per-evaluation selection boundary permits the authorized controlled
assessment to inject an earlier account through normal submission, validation and
retention, then use the live investigator. The parent owns selection and credentials;
worker messages carry participant identity. Usage and retained provenance identify
the selected participant. This is not a production model/billing fallback.

Implementation is in `3875cce` and `9a204a6`; `645076f` freezes the live protocol and
offline evidence; `9edf6ce` records live results and assessments; `391d0a5` qualifies
capture whitespace checks. The review target adds only the active-task checkpoint.

## Verification and formative results

The final complete offline suite at `9a204a6` passed **448 tests, zero failures,
cancellations or skips**, 136.964 seconds (147.462 including build). The tracked
checkout was stationary; idle-sleep prevention and a one-second monitor recorded
no gap over two seconds. The earlier 447-pass/one-failure run is retained: an older
one-shot/shell comparison did not account for different reference lifetimes. The
correction explicitly checks those lifetimes and distinct view IDs, then compares
remaining content. The isolated regression and subsequent complete suite passed.
No runtime behavior changed after this verification/freeze.

Read the [pass-04 report](../../validation/module-investigation/pass-04/report.md),
[frozen protocol](../../validation/module-investigation/pass-04/protocol.md),
[manifest](../../validation/module-investigation/pass-04/manifest.json) and
[metadata clarification](../../validation/module-investigation/pass-04/manifest-clarification.md).
The clarification identifies three stale descriptive fields inherited from pass 03;
it preserves the frozen manifest and changes no effective input. Exact commands,
adaptive selections, human views, observations, wire exchanges, binding/resolution
and exposure records are retained per case. Source licenses are retained.

All **15 scheduled hosted evaluations were accepted**, with no recovery requests,
retries, reauthorization, rejected submissions or guard/budget stops. The model and
route remained **gpt-5.6-sol / medium / ChatGPT-plan**. Source pins, TypeScript 6.0.3
and the exact approved merge-anything override stayed fixed and passed post-run
verification. The original source/configuration files were not changed.

- Cockatiel follow-ups clarify filter polarity and broaden the exception account.
- FSM follow-ups clarify shared context, non-rollback and failure-cleanup boundaries.
- Merge-anything follows delegation, narrows property-handling subjects and submits
  an explicit correction concerning ordinary assignment versus guaranteed own data
  property creation; the evaluator tracks its original/replacement identities.
- The controlled numeric baseline is deliberately injected. Live decomposition
  corrects its false partition/rejection root, explanation preserves cumulative
  behavior, and examination separately corrects the designated child. The fresh
  assessor supports this comparison against the frozen source reference.

The audit reconciles **64 provider requests / 1,459,926 reported tokens**, with no
missing or anomalous provider reports. The scripted setup's empty synthetic usage
report is separately marked anomalous and excluded from trusted totals; it is not
an extra provider request. Actual ChatGPT monetary/allowance-credit attribution is
unknown, not zero. Sixteen fresh evaluator/assessor roles retain separately unknown
usage. No purchase, spending change, fallback or diagnostic request occurred; the
diagnostic allowance remains **two used / eight remaining**.

Four repeated lenses and sixteen inspections add no calls; displayed historical
records remain unchanged. The exposure audit excludes bare bindings/listings and
checks 706 structural resolution entries. JSON, report links and a supplementary
credential-pattern scan passed. Exact terminal/TAP/role captures retain whitespace;
the full diff has 110 disclosed capture warnings, while non-capture checks pass.

Historical execution-ownership and suspension-related failures/cancellations remain
preserved in [earlier validation](../../validation/module-investigation/2026-10-01-milestone-3-round-1-validation.md).
Later complete passes support readiness but do not prove each old failure's cause.
This milestone has a complete successful suite, not just isolated passes.

## Review focus and reproduction

Run `npm ci` and `npm test` using the supported runtime (recorded Node 22.13.1).
Tests use synthetic credentials/offline responses; local callback tests need
loopback permission. Keep tracked inputs stationary. The
[harness guide](../../../scripts/module-investigation/README.md) describes source
and effective configuration reproduction; review retained captures without
regenerating live assessments.

Focus on:

1. CLI grammar, exact selection, unsupported/missing references, reference lifetime,
   repeated results and the distinction between composition and later provenance.
2. Explicit association rules, stable bounded continuation, qualification/omission
   preservation, and inspect view identity as associated history grows.
3. Availability versus exposure/citation/correction eligibility, structural mapping
   of nested navigation, and preservation of earlier correction-aware context.
4. Parent/worker selection handshake, identity attribution, error/cancellation and
   usage closure behavior; credential exclusion and unchanged billing-route rules.
5. Scripted/live injection through ordinary boundaries, zero provider setup requests,
   separately anomalous synthetic usage, unchanged originals and explicit correction
   target/replacement/reporter/subject identities.
6. Assessment adequacy and reproducibility, including semantic claims underlying
   consequential corrections. The assessors' frozen reference summaries cannot
   settle every deeper getter, logger, timer, type or authored-test assertion.
   Inspect the pinned source independently where needed rather than treating
   evaluator agreement as verification.

Known limits are part of the gate judgment: additional context and adaptive target
choices prevent isolating UI/prompt/model effects; shared reference preparation,
orchestration and model family limit independence; no upstream runtime tests were
executed. Dense repeated metadata and human evidence blocks without checkable
excerpts (or with disclosed truncation), ambiguous generated positional wording,
and missing effective-config attribution within standalone views remain documented.
The exact effective configuration is retained in the assessment record. These
presentation observations augment the existing whole-journey backlog; no redesign
or prompt tuning was performed after observing results. Milestone-5 presentation
limits are explicit, not failed milestone-4 checks.

## Findings return and gate

Use [the findings template](../../../dev/templates/review-findings.md). With repository
write access, create
`records/reviews/module-investigation/2026-10-01-milestone-4-round-1-findings.md`,
identify this handoff, actual immutable target/range, reviewer/method, checks,
actionable findings, non-defect observations, unverified areas and gate recommendation.
Preserve authored findings under `## Returned findings`, commit only that record,
and modify nothing else. Without write access, return the complete findings to the
human for preservation. Subsequent rounds use the next round number and identify
their actual target plus prior findings and corrections.

Pause for independent review and human milestone-4 acceptance. The task remains
active; milestone 5 has not begun. The human decides whether accumulated review
and qualified assessment evidence are sufficient, including whether any further
review is needed after corrections.
