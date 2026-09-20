# Implement module dependencies

Status: completed
Opened: 2026-09-16
Closed: 2026-09-20

## Task

Implement the approved plan at docs/plans/module-dependencies-plan.md. This is explicit authorization\
to begin the substantive implementation task described by that plan. Create a\
suitably named feature branch and work there.  If the implementation becomes sufficiently complex that intermediate review\
would materially reduce risk, pause for independent revi​ew after appropriate\
key developments; prepare and commit a handoff as per `dev/review.md`, then\
pause for me to arrange the review. In any case, after implementation and planned verification are substantially complete, prepare and commit a final integrated-review handoff as per `dev/review.md`.\
Pause for one or more final review rounds and do not close the task until I\
say that the review gate is sufficient.

## Follow-ups

### 2026-09-16 — Review disposition instructions

The review is complete.  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### 2026-09-16 — CommonJS investigation authorization

Context: The agent asked, "Finding 1 leaves CommonJS recognition unresolved: classic ts-node configuration lacks a per-file format signal, while ESM files can share ambient require declarations. May I investigate classic and mixed-module fixtures plus the surveyed ts-node checkout, then bring you a concrete recognition rule before implementing it? Your instruction requires approval before proceeding through this uncertainty."

Investigate, then propose a rule (Recommended)

### 2026-09-16 — Revised recognition investigation and decision supersession

Context: After discussion of non-authoritative feedback, the work proposed for authorization was to revise the mandatory ambient-declaration requirement; define completed lexical analysis precisely; characterize `module: preserve` with focused fixtures; return a final ordered recognition rule and outcome table before recognizer integration; use the adapted ts-node validation configuration while retaining its original opening failure and proving equivalent source selection; and correct the prior decision's unique-edge rationale while preserving the CommonJS requirements.

OK, now that everybody's in alignment, I do authorize the work.  Note that "correcting" the prior decision does not literally mean editing the decison record, but rather creating a new decision that supersedes the previous one, as per docs/decisions/README

### 2026-09-16 — Round-2 review disposition instructions

Round-2 of review is complete.  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### 2026-09-16 — Intermediate gate approved; implementation resumed

Context: Asked whether the ordered recognition contract is approved and the intermediate review gate is sufficient to resume implementation.

yes resume implementation

### 2026-09-16 — Provider integration round-1 disposition instructions

Round 1 of review is complete.  Assess and record a disposition for every finding. Act on findings whose resolution is clear and within the authorized scope. Ask me before rejecting or materially qualifying a finding, choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.

### 2026-09-16 — Multi-file diagnostic regression authorized

Context: The agent recommended a focused regression proving that an aggregated relationship supported by multiple source files retains each distinct diagnostic once, including errors with identical codes.

ok, do it

### 2026-09-16 — Provider integration gate approved; implementation resumed

Context: Asked whether the provider-integration review gate, including the authorized multi-file regression, is sufficient to resume implementation.

yes, resume implementation

### 2026-09-17 — Graph review observations and continued implementation

The review is complete.  It has no findings but a few non-defect observations.  Assess and act on those observations as you see fit. Ask me before choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty, otherwise continue with the implementation

### 2026-09-17 — Parent-view coverage disclosure approved

Context: The agent asked for approval of a disclosure contract that retains source-owned coverage in structure/child projections and explains bounded coverage in every view.

Yes, I would approve that disclosure contract, with one terminology correction.
A parent view should:
- show only established incoming relationships;
- state the bounded CommonJS coverage;
- explain that a request without an established child cannot be attributed to the selected module and therefore cannot produce a parent result;
- avoid copying source-owned coverage records into the parent projection.
Structure and child views should expose the source-owned details:
- recognized requests with no edge, such as unresolved literals and target-indeterminate calls;
- unavailable or conflicting recognition evidence;
- applicable bounded-recognition limitations.
I would avoid the phrase “occurrence-level exclusions.” Some excluded forms never become recognized occurrences. Call them source-owned request results and recognition-coverage outcomes instead.
The bounded rule can be presented as concise reusable disclosure text; the parent projection does not need fabricated coverage records merely to satisfy the presentation requirement. This preserves the distinction between analysis facts and how each view explains its limits.

### 2026-09-17 — Clean instrument evaluators authorized

Context: The agent asked permission to run two fresh evaluator agents, supplying only captured views and fixed comprehension questions for instrument validation, while leaving final independent implementation review to the human.

Run two clean evaluators

### 2026-09-17 — Integrated review disposition; keep task open for later PR process

The review is complete.  It has no findings but a few non-defect issues.  Assess and act on those issues as you see fit. Ask me before choosing between consequential alternatives, expanding scope, or proceeding where the reviewer identifies unresolved uncertainty.  In any case, keep the task open, we will do a PR process later

### 2026-09-20 — GitHub pull request authorized

Create a github pull request, with the request body giving Copilot the necessary information to do a review

### 2026-09-20 — Copilot findings retrieval and correction authorized

The copilot review is complete.  Please fetch the full review and preserve it as per dev/review\.md;  Its findings seem sound, act on them unless you disagree or see any issues that should be raised for discussion.  If there are no such issues, record the disposition, commit, push, and update the PR to prepare for the next review.

### 2026-09-20 — Next Copilot round authorized

[Same as before]   The copilot review is complete.  Please fetch the full review and preserve it as per dev/review\.md;  Its findings seem sound, act on them unless you disagree or see any issues that should be raised for discussion.  If there are no such issues, record the disposition, commit, push, and update the PR to prepare for the next review.

### 2026-09-20 — Final review gate accepted; closure authorized

Context: The agent recommended accepting the accumulated implementation reviews and regression verification as sufficient, without another mandatory broad or adversarial review. The human accepted that recommendation and instructed closure:

ok good.  close out the task as per the workflow & protocol, push, and give me a comment to use when i merge the PR.

## Outcome

Implemented the approved module dependency slice on `codex/module-dependencies`:
source-request occurrences and qualified direct relationships; bounded CommonJS
recognition; structure, children and parents projections; SCC/root derivation and
external opacity; composition properties and occurrence-specific organization
context; Unicode/JSON presentation, source detail, scoped navigation and observations.
Documentation describes the integrated result. The approved CommonJS refinement is
recorded in a superseding decision, preserving the original historical decision.

Provider, graph and integrated review records preserve the checkpoints and corrections.
All four concrete Copilot findings were accepted and corrected, including exact
resolved-occurrence partitioning and one relationship per ordered module pair, with
atomic rejection regressions. The final Copilot review reports no findings. The human
accepted the accumulated final review gate and authorized closure on 2026-09-20.
[PR #4](https://github.com/ronen/postcode/pull/4) is ready for human merge; it was not
merged by the implementing agent.

No required implementation work is deferred. Bounded source/CommonJS coverage,
partial organization evidence, the unconfirmed external-owner scenario, incomplete
independent reproduction of external validation, and measured fresh-analysis latency
(including the unexplained ts-node outlier) remain disclosed in the
[integrated disposition](../reviews/module-dependencies/2026-09-17-integrated-disposition.md)
and [instrument report](../validation/module-dependencies/2026-09-17-integrated-instrument.md).
No runtime-execution or latency-bound claim is made.

## Verification

- `npm run check` and `npm test`: **191/191 tests pass** at final implementation
  `e3adc105bd958ebe2829ec1f8feac4af2c5ace52`; subsequent changes are review/task/status
  records only. Tests cover compiler evidence, graph and organization qualification,
  composition, source separation, navigation, observations, deterministic identities,
  and evaluation-wide partition, ordered-pair and atomicity invariants.
- The representative six-module journey, boundary cases, PostCode self-analysis and
  adapted ts-node validation are preserved in the instrument report. The original
  ts-node opening failure and equivalent 66-root adapted selection remain explicit.
  Two clean evaluators assessed view comprehension separately from correctness review.
- The independent integrated reviewer reproduced the journey and PostCode structural
  counts and passed the then-current 188-test suite. Three Copilot rounds identified,
  checked corrections for, and ultimately reported resolution of all four findings;
  the final reviewed target is `f6bc7fcb6aea87ba27894284870f99df3a35f1a8`.
- Final record links and `git diff --check` verified. No new implementation tests were
  needed for closure-only record changes. Human gate acceptance is preserved above.

