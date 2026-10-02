Record type: handoff

# Module investigation milestone 5: corrections and integrated lifecycle

Prepared: 2026-10-02
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Review gate: milestone 5, before final integrated review across milestones
Review target: `37837f8d1432df652c6cec7c839f101a5b3d2cea`
Baseline: `4e6ee26` (human acceptance of milestone 4)
Diff range: `4e6ee26..37837f8d1432df652c6cec7c839f101a5b3d2cea`
Branch: `codex/module-investigation`

## Assignment and boundaries

Independently review implementation, deterministic tests, pinned-source evidence,
actual investigator deliveries and formative findings for milestone 5. Recommend
whether the evidence is sufficient for this gate, identifying defects, uncertainty
and human decisions. Inspect the implementation and relevant evidence; this
handoff, successful tests, accepted submissions and agent assessments are not proof.

The human arranges review. This assignment permits a findings record only. Do not
modify implementation, governing material, this handoff, task status or task record.
Use offline verification and retained live captures. Do not access real Keychain
items or Codex credentials, sign out, alter provider settings or issue live requests.
If more live evidence is needed, identify it for human authorization.

## Governing basis

- [Approved plan](../../../docs/plans/module-investigation.md), milestone 5,
  correction/reconsideration rules and integrated assessment protocol. The human's
  controlled-case refinement is preserved in task follow-up `bd00b66`.
- [Core concepts](../../../docs/core-concepts.md) and
  [architectural constraints](../../../docs/architectural-constraints.md).
- Accepted decisions: [investigrams](../../../docs/decisions/investigrams-and-progressive-investigation.md),
  [operations and lenses](../../../docs/decisions/investigation-operations-and-lenses.md),
  [execution and evidence](../../../docs/decisions/investigator-execution-and-evidence-access.md),
  [reference transport](../../../docs/decisions/investigator-reference-transport.md),
  [hosted authentication](../../../docs/decisions/hosted-authentication-and-billing.md).
- [Investigation architecture](../../../docs/architecture/investigation.md),
  [CLI reference](../../../docs/cli-reference.md),
  [hosted configuration](../../../docs/hosted-investigation.md),
  [milestone-4 dispositions](2026-10-01-milestone-4-disposition.md).

## Behavior under review

`investigation/revisions.ts` derives a session snapshot from immutable accepted
accounts, corrections and provenance. Selection follows every reachable correction
branch by accepted recency, with stable array order for simultaneous corrections.
Newer descendants of an older branch can become primary without resolving conflicts.
Result redisplay substitutes replacements and their own composition; exact inspection
and follow-up subjects retain original identity. Corrected children can appear
under unchanged roots. Root replacement displaces old composition without splicing;
old subtree corrections remain disclosed. Current revision facets affect view identity.

For each correction, reverse citations propagate reconsideration unless the
citing account's whole generating evaluation produced that correction or received
its complete context. Exemptions block that path only; independent causes/paths
remain. Composition and subject provenance do not independently propagate warnings.
Warnings do not establish error, semantic reliance, invalidation or reassessment.

Human and investigator context expose at most 24 correction/cause and incoming
inconsistency rows per page, at most eight proximal citations per cause with
explicit omissions, and at most 256 displayed accounts. Context automatically
included accounts carry summaries plus continuation, avoiding repeated expanded
revision pages. Actual correction/inconsistency content cites reporting accounts;
metadata and navigation handles alone grant no content exposure. Complete-context
exemption requires actual target/replacement fields and correction content, not
recursive children. Typed transport maps the new fields structurally; prose/source
remain unchanged, and guards measure canonical-domain exchanges.

Production change is `9eb0b7d`; `e54a4c3` freezes assessment inputs, harness changes
and offline evidence. No production runtime or frozen input changed during live
assessment. Later changes are captures, audits and descriptive documentation.

## Verification and evidence

The complete offline suite at clean, stationary `9eb0b7d` passed **462 tests**,
zero failures/cancellations/skips, 158.895 seconds (170.501 with build/monitor).
Idle-sleep prevention and a one-second monitor showed a maximum 1.057-second gap,
none over two seconds. Five focused assessment-harness tests and both real
CLI/worker no-network setup dry runs also passed. Earlier cancellation uncertainty
is retained; the successful suite does not retroactively diagnose every old failure.

Read [pass-05 report](../../validation/module-investigation/pass-05/report.md),
[offline evidence](../../validation/module-investigation/pass-05/offline-verification.md),
[manifest](../../validation/module-investigation/pass-05/manifest.json),
[protocol](../../validation/module-investigation/pass-05/protocol.md), and each case's
exact commands, views, observations, exchanges, setup and role inputs/outputs.
Actual account delivery, canonical exposure and bindings are separately captured.

The fixed configuration remains **gpt-5.6-sol / medium / ChatGPT-plan**,
TypeScript **6.0.3**, original upstream pins and the exact approved merge-anything
`ignoreDeprecations: "6.0"` override. All five postflight checks pass; old milestone-4
fixture/results remain unchanged. Provider accounting reconciles **73 requests /
1,683,241 known reported tokens**, three missing provider reports, no anomalous
provider reports. Eight scripted evaluations contribute ten explicitly synthetic
empty reports, not provider charges. Evaluator/assessor and preparer usage remain
separately unknown. Actual monetary and allowance-versus-credit attribution are
unknown. No extra diagnostics, fallback, purchases or spending-setting changes;
diagnostic allowance remains two used/eight remaining.

Nineteen hosted attempts (17 scheduled plus two allowed recoveries) produced
15 accepted results, three overload communication failures and one evidence-contract
rejection. Merge-anything decomposition remains incomplete after its shell's recovery
allowance was used for the summary. Refined-case examination of Y was rejected for
citing a correction record itself instead of its reporting investigram. Handles
resolved exactly; the entire proposed result was rejected, with no repair/retry.
The successful steps do not constitute a fully passing live sequence.

The refined numeric case corrects A using source while interface-only README avoids
stating the answer, then exposes direct/transitive warnings on scripted Y/Z.
The phrase “need not represent” in Z admits an unintended cautious-warning reading;
both controlled live examinations/clarifications use it, reducing discriminating
power. The fixture was not tuned. In the conflict case, clarification of older B
corrects it; its newest descendant becomes primary while alternatives remain
unresolved. These are truthful scripted-origin cases, not spontaneous detection
or naturally occurring model disagreement. M4 evidence is preserved unchanged.

Sixteen fresh formative roles, separated into view-only evaluators and source-informed
assessors, find useful qualified understanding but semantic omissions, ambiguous
wording, dense presentation and limited reference coverage. They share model family,
reference authorship and orchestration, and are not independent implementation
reviewers. Cockatiel target selection was informed by summary-assessor feedback;
this bias is recorded. M3 comparison controls pins/model/route but changes contracts,
context and question set and does not isolate generator improvement.

## Requested review focus and reproduction

Review all-branch selection and stable ordering, exact original subjects, immutable
composition/history, revision-aware projection identity, per-cause/whole-evaluation
exemptions, independent alternate paths, scale/bounds and usable continuations.
Inspect source/qualification delivery, reporter citation, correction completeness,
structural reference translation and unsupported/missing references. Check real
CLI worker cancellation/invalidation publication boundaries and usage attribution.

Assess whether the controlled refinement meets the human instruction and whether
the incomplete/rejected live paths and ambiguous wording leave a material evidence
gap for milestone acceptance. Evaluate assessment/reference claims against the
pinned source rather than accepting role agreement. Review the retained evidence
failure for any contract clarity issue; do not silently broaden allowed evidence
or count an attempted correction as accepted. Review documentation against behavior.

Reproduce locally without hosted credentials or network:

```sh
npm test
python3 records/validation/module-investigation/pass-05/audit-results.py
python3 records/validation/module-investigation/pass-05/audit-lifecycle.py
python3 records/validation/module-investigation/pass-05/audit-artifacts.py
```

The audits regenerate analysis artifacts from captures. Preserve exact transport,
terminal and role text; their incidental whitespace is disclosed separately from
clean authored-code/document checks. Dense metadata/whole-journey UI concerns are
backlogged, not authorization for redesign. The final integrated review across
milestones remains after this gate; the active task is not concluded.

## Return procedure

If you can write to this repository, follow the
[findings template](../../../dev/templates/review-findings.md), create
`2026-10-02-milestone-5-round-1-findings.md` in this directory, identify this
handoff, exact target/scope/method/checks, preserve your report under
`## Returned findings`, and commit only that file. Include actionable findings,
non-defect observations, unverified areas, uncertainty and a gate recommendation.
Otherwise return the findings to the human for preservation. Further rounds use
this handoff and the next round number, naming their exact target and prior review.
The implementer will disposition every finding and seek human direction before
rejection, material qualification, consequential alternatives or scope expansion.
