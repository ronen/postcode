# Milestone 3 summary assessment pass 01

Date: 2026-09-30. This is a formative development assessment, not milestone
acceptance, an untouched benchmark or independent implementation review.

## Fixed effective configuration and authorization

The [manifest](manifest.json), [source references](references.md), exact
[instructions](instructions.json), questions and rubric were frozen in `d00deb6`
and the isolated fixture/source/accounting preparation in `870e9be`, before
subject inference. Node 22.13.1 and PostCode analyzer **TypeScript 6.0.3** were
used throughout. Each run preflight checked source pins, file/configuration
hashes and the frozen context-selection implementation. A later harness-only
check also compares the built provider identity to the frozen manifest; no
provider, prompt, source, evidence-selection or domain behavior changed mid-pass.

Investigator: **gpt-5.6-sol / medium / ChatGPT-plan**, adapter
`postcode/chatgpt-responses@2`, OpenAI SDK 7.25.0, streaming, no inference retries
or model/billing fallback. The human selected this because gpt-6-sol was absent
from the authorized account catalog; capability and interpretive value remained
for assessment. The connection check had already succeeded. No additional
connection diagnostic, purchase or spending-setting change occurred in this pass.

Merge-anything used the exact approved [override](merge-anything-override.json):
`{"extends":"./tsconfig.json","compilerOptions":{"ignoreDeprecations":"6.0"}}`.
Its original source and configuration are unchanged. The inherited
@cycraft/tsconfig 0.1.2 is hashed too. These findings belong to that **effective
configuration**, not an unmodified-config run or a claim of semantic equivalence.
Cockatiel and fsm-engine used their original configs. Source Git pins, all source
hashes, documentation, lockfile/configuration hashes and license notices are
retained. The controlled fixture has its own [reconstructable local commit](fixture-git-commit.txt).

The human clarified in `9262403` that the ten-request limit applies to
implementation/debugging. The [diagnostic ledger](diagnostic-budget.json) remains
at **2 used / 8 available**. The separate [assessment ledger](request-budget.json)
contains the planned single attempts. Its 192-call ceiling is six cases times the
existing 32-call guard, not a target or a new spending allowance. There were no
repeated investigations or recovery attempts. Ordinary 180-second, 32-call,
96-tool-call and 2,000,000-character guards were unchanged, except the labelled
one-character hard-limit control.

## Captures and outcomes

| Case | Outcome | Requests | Reported tokens | Elapsed |
| --- | --- | ---: | ---: | ---: |
| [Cockatiel](cockatiel/summary-view.txt) | Accepted interpretation | 5 | 204,659 | 130.472 s |
| [fsm-engine](fsm-engine/summary-view.txt) | Accepted interpretation | 4 | 161,522 | 122.667 s |
| [merge-anything](merge-anything/summary-view.txt) | Accepted interpretation | 5 | 216,892 | 131.470 s |
| [Mixed/delegated entry](focused-entry/summary-view.txt) | Accepted interpretation | 4 | 68,870 | 72.429 s |
| [Opaque callback](focused-opaque/summary-view.txt) | Accepted interpretation | 3 | 14,784 | 42.770 s |
| [Hard-limit control](focused-hard-limit/summary-view.txt) | Character guard; no investigram | 0 | 0 | 1.943 s |

**21 requests, 666,727 reported tokens**. All provider reports were available and
non-anomalous in this pass. Accepted means explicit submission passed domain
validation; it does not certify interpretive correctness. The limit control made
zero provider calls, rather than reporting unavailable usage as zero.

Each case directory retains exact spec/commands, terminal stdout/stderr,
observations, sanitized provider request/response exchanges when any occurred,
timing, rendered summary, exact evaluator/assessor inputs, dispatch instructions
and outputs. Absolute paths in captures are historical run locations; reproduce
using the manifest inputs and the [harness instructions](../../../../scripts/module-investigation/README.md),
not by relying on the original temporary checkout. Session references have meaning
inside their captured session only. No source-detail option was requested by the
human-facing commands; investigator source access is separately captured.

The command view, subsequent usage view and usage observations agree in all six
cases (`usage-consistency.json` in each directory). [Usage reporting](usage-report.json)
keeps provider reports and their included subsets separate. The three large
subjects account for 583,073 tokens. Full retained dialogue context is sent on
successive requests and these reports have zero cached-input tokens; this is
material processing cost, not a measured monetary charge. ChatGPT included
allowance versus purchased credits and actual monetary charges are unavailable,
not zero; no API list-price estimate is substituted. Provider controls remain
[ChatGPT usage settings](https://chatgpt.com/settings/usage).

Six fresh view-only evaluators and six separate fresh source-informed assessors
received only their recorded artifact inputs, with no task history. Bootstrap
reads were confined to those inputs; role outputs preserve their assessments.
The Cockatiel evaluator had one subsequent artifact-persistence turn with no
reassessment. [Assessment-agent usage](assessment-agent-usage.json) is separately
attributed and unavailable, not included as zero in investigator totals. Exact
model identifiers/reasoning settings were unavailable through those tools;
settings were inherited without an explicit model override. They are OpenAI-family
agents and share orchestration. Reference preparation by the implementing agent,
purposeful subject selection and shared family/orchestration limit independence.

## Findings retained without prompt tuning

- Cockatiel communicates execution, outcome classification, timing and cloning
  usefully, without assigning retry policy to the executor. Its normal-flow
  summary omits the broad catch scope and effects of predicate/listener failures;
  the evaluator independently identifies those as follow-up questions.
- fsm-engine communicates builder/runtime/timer responsibilities and flags the
  suspicious timer payload expression. The assessor identifies repeated
  overstatement risk in "separate context": caller context is not deep-copied.
  Queue cleanup versus rollback and the exact state-commit point remain omitted.
- merge-anything follows the public barrel into merge strategies and type support.
  Ownership/aliasing limits, including returning the original with no extra inputs,
  are underexplained. The evaluator recognizes the gap without claiming a deep
  clone. Several details exceed what the frozen references alone can settle.
- The mixed fixture distinguishes a stateless clamp from a stateful counter and
  does not invent a unified business role. It **does not report the deliberately
  conflicting README assertion**. The captured evidence requests inspect modules,
  exports, dependencies and source, but never request repository/documentation
  discovery. Thus this run exposes an acquisition/coverage omission; it does not
  establish how the investigator would reconcile the README after disclosure.
- The opaque fixture produces a short source-qualified callback account and leaves
  substantive callback behavior to its caller. It stops voluntarily after three
  calls, rather than hitting a guard. This supports bounded acquisition and a
  disclosed unknown, not a claim that every low-value branch is optimally pruned.
- The hard-limit view correctly reports the guard and zero provider calls, but
  its evaluator mistakes the subject name "opaque" for a module state. The fresh
  assessor identifies this as a presentation misunderstanding; the control supplies
  no functionality interpretation or evidence of a failed semantic conclusion.
- Across views, long evidence identifiers, repeated usage and a generic footer
  about correction links impede clarity. No concrete correction is present in
  these summary-only examples; generic checkpoint wording can imply otherwise.
  Evaluators distinguish absent follow-ups from failed follow-ups. Their proposed
  next lenses do not prove those later capabilities exist.

Full authored role outputs are retained beside the views; this synthesis is not a
replacement for them. Source-informed references are qualified source readings,
not executed subject tests or exhaustive audits. Findings are not silently fixed
or scored into a pass. There was no model switch, prompt refinement, extra
regeneration or claim that these examples establish general usefulness. Human
review must consider the conflicting-documentation coverage gap and other limits
when deciding milestone acceptance and future prompt/model work.

## Verification and remaining gate

Build and focused harness/transport checks passed before live runs (12 tests).
The runner's offline regressions verify reserve-before-dispatch accounting,
failed-attempt persistence, competing-run exclusion, cap refusal, command driving
and credential exclusion. Pinned configuration preflight succeeded for all three
upstream subjects; original tracked source/configuration remained unchanged.
The complete final suite result will be recorded with the milestone handoff.

The earlier execution-ownership cancellation prerequisite was diagnosed and
corrected in `6677ccc`; see the [diagnosis](../2026-09-30-execution-ownership-diagnosis.md).
Historical cancelled runs remain cancelled; attributing every old occurrence to
the reproduced readiness race remains an inference. No universal cancellation or
remote billing-stop guarantee follows from the correction.

Milestone 3 still requires independent implementation review and human acceptance.
Milestone 4's follow-up lenses, progressive sequences and correction-aware work
have not begun. This pass preserves the human-selected model for judgment rather
than automatically substituting a stronger or more expensive configuration.
