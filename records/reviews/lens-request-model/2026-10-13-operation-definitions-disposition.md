# Fixed operation definitions and interpretation extension: disposition

Record type: disposition
Date: 2026-10-13
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Handoff: [Operation definitions checkpoint](2026-10-13-operation-definitions-handoff.md)
Findings: [Round 1](2026-10-13-operation-definitions-round-1-findings.md); [round 2](2026-10-13-operation-definitions-round-2-findings.md)
Reviewed target: `300c5a7e4c1d310d8177d24c24590c5c5aad6368`
Correction commit: `d61bccf00c0ce2777b3e2ccdba000db45a337775`

## Findings and dispositions

### F1 — accepted and corrected

The internal catalog accepted declarations that mechanical dispatch could not honor. Catalog capture now requires canonical equality with the built-in definition whenever either the supplied definition or the built-in definition uses mechanical requirements. This rejects new mechanical identities, changed requirements/results, altered question/applicability/cardinality/parameters, mechanical replacements of interpretation Lenses, and interpretation replacements of built-in mechanical Lenses (including inspection's special construction path). Unchanged definitions remain accepted independently of object key order. Supported interpretation additions continue to use the existing shared path.

This is assembly validation before project acquisition. Invalid internal definitions fail as assembly errors, rather than becoming accepted caller requests, resolution reports for a nonexistent application, runtime dispatch failures, or answers to another question. It does not broaden mechanical assembly support or change public CLI behavior. The temporary equality boundary remains until the approved mechanical constructor/Presentation integration makes additional definitions executable.

### F2 — accepted and corrected

Catalog capture rejects `usage` and command spellings that alias a different normalized Lens identity: `dependencies`, `children` and `parents`. These names previously shadowed supplied declarations. Built-in names that already match their normalized Lens identity remain valid. Tests cover every currently shadowing spelling and rejection before Session project acquisition.

### F3 — accepted and corrected

Interpretation definitions must declare an empty plain parameter object. Nonempty declarations and malformed parameter containers are rejected before Session opening, so a request cannot advertise semantic parameters that execution drops before operation reuse. Mechanical parameter changes fail F1's canonical equality check. No parameter semantics, new operation inputs or cache-key policy were added.

## Corrections and verification

All three corrections and descriptive documentation are in `d61bccf00c0ce2777b3e2ccdba000db45a337775`. The regression table exercises the reviewer's examples, the new-mechanical rejection claim, the reverse mechanical-to-interpretation replacement, all shadowing aliases, and nonempty/malformed parameter declarations. Each rejection is checked both at catalog capture and through `openSession`, before any valid project is supplied. A positive test verifies unchanged built-ins, canonical equality independent of property order, supported interpretation additions and frozen parameter declarations.

`npm run check`, `npm run build`, and `git diff --check` passed. The focused run of `lens-extensions.test.ts`, `request-model.test.ts` and `investigation-selection.test.ts` passed all 50 tests, including 16 added regression/acceptance tests. The run also preserves ordinary interpretation reuse, original provenance, failure/retry policy, direct/worker request reporting and retained selection invariants. Repository inputs and Git state remained unchanged during testing; no paid inference was used.

The full suite was not rerun for these bounded assembly checks. The reviewer independently passed all 542 tests on the reviewed implementation and recommended a narrow catalog re-check, with no mandatory full new review round. Those earlier results are not presented as a full run of the corrected target.

## Non-defect observations and residual limits

The review's observations about reuse/method provenance, retained requests, title identity/escaping, module candidates and fixed catalog lifetime remain applicable. These corrections do not change operation execution, selection identity or store validation.

The reviewer explicitly classified the weaker detection of hand-built/corrupted selection records as a non-defect observation: construction checks the Lens declaration, while store validation checks the self-contained operation request and actual retained subject kind without a global Lens map. The optional proposal for a stronger declared-kind invariant was not an actionable finding and is not implemented by this correction. The observation remains visible here for the human's gate assessment; no new store-validation guarantee is claimed.

Non-default catalogs still have no worker/CLI assembly seam. Hosted investigators, general malformed-catalog fuzzing and the remaining Presentation/mechanical extension work were not assessed here. The historical intermittent CLI failure remains unexplained; passing checks do not diagnose or repair it. Runtime Presentation compatibility, materialized preconditions/failures/fallback, the exports extension and final integrated verification remain required by the approved plan.

## Review rounds

Round 1 reviewed `300c5a7e4c1d310d8177d24c24590c5c5aad6368`; its authored findings remain unchanged in the linked record. F1, F2 and F3 are all accepted and corrected. No finding is rejected, materially qualified or deferred, and none requires a new scope or product decision.

## Gate conclusion

The reviewer's requested narrow re-check has passed. No further independent round is required by its recommendation, although the human may request one against the correction commit. Human acceptance of this intermediate gate is still pending; broader implementation remains paused and the task stays active. Acceptance permits the remaining approved implementation to continue, not task closure or waiver of final integrated review.


## Round-two assessment and human acceptance

The narrow second round reviewed `d61bccf00c0ce2777b3e2ccdba000db45a337775`, independently passed all 558 tests, confirmed F1–F3 resolved, and returned no actionable findings. Its non-defect notes preserve the construction/store-validation boundary and require real mechanical assembly support before replacing the temporary equality restriction. The latter is part of the next authorized implementation; no extra store schema or corruption-detection contract is added solely for the optional observation. Remaining unverified areas and the historical intermittent failure remain as recorded by the reviewer.

On 2026-10-13 the human explicitly accepted this gate and authorized continuation after considering the notes. This supersedes the pending-gate conclusion above. The task remains active, and remaining plan work and final integrated review are still required.
