Record type: disposition

# Qualified result and Presentation compatibility: disposition

Date: 2026-10-13
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Handoff: [Presentation compatibility](2026-10-13-presentation-compatibility-handoff.md)
Findings: [Round 1](2026-10-13-presentation-compatibility-round-1-findings.md)

## Findings and dispositions

### F1 — accepted and corrected

The Unicode refusal report incorrectly extended the usable-reference lifetime statement to retained-answer IDs. Those identifiers identify retained Projections, while the public reference-designation path accepts supported subject entities. Retained-answer redisplay remains explicitly deferred. The reviewer's distinction is accepted without qualification.

Correction `1910c9d01c72c53c288d078b24dd917ea842645f` labels these values as “Retained answer ID” and explicitly states that redisplay using them is not yet supported. The lifetime sentence now applies only when candidates exist and explicitly says “Candidate references,” avoiding ambiguity when it follows retained-answer lines. JSON, retained identity, subject-reference resolution and redisplay scope are unchanged.

The existing Unicode materialization-refusal regression checks the distinct labels and unsupported-redisplay notice alongside a usable candidate reference. Additional renderer assertions remove the candidates from that report and check both Session and command lifetimes: retained IDs and the notice remain, but no usable/expiring-reference promise appears. These latter assertions are controlled report-rendering cases, not claims of new end-to-end population-provider coverage.

## Corrections and verification

- Implementer: `npm run check` and build passed; the focused compatibility/request-model run passed all 24 tests, including actual worker publication and sink-failure checks. Tests used temporary process-scoped sleep inhibition, and repository inputs/Git state remained unchanged during execution. `git diff --check` passed. No paid inference was used.
- Reviewer: independently passed all 566 tests at the original reviewed target, exercised the direct-Session option matrix and reproduced the retained-ID navigation refusal. That full-suite result applies to the reviewed target, not to the later wording correction. The implementer did not repeat the full suite for this bounded rendering change.

## Non-defect observations and residual limits

The review confirms that definitions govern compatibility, expansion planning and fallback; qualified partial content remains ordinary; decisions participate in View identity; usage finalization preserves them; and associated/embedded content remains explicitly composed. Shallow boundary checks continue relying on family resolvers for support validation, rather than constituting a full arbitrary-payload validator. No change to those boundaries is needed for F1.

Remaining Lens-name coupling is part of the already authorized mechanical integration work. The exports constructor/Presentation and final integrated verification remain pending. Custom-catalog worker delivery, compatibility-specific fallback paging, systematic malformed-content fuzzing and hosted investigators were not independently exercised. The historical intermittent failure and earlier sleep-related runs remain subject to the verification limits recorded in the findings and handoff; this wording correction does not diagnose them.

## Review rounds

Round 1 reviewed `1b853bd61961b4da94b630c9c4e8de91c3be49e6` against `d8ceb60b9671c136044a32db3a33f9f0a7cc9445`. The authored findings are preserved in commit `5e026f7`. F1 was the only actionable finding and is corrected in `1910c9d01c72c53c288d078b24dd917ea842645f`. Nothing was rejected, deferred or materially qualified.

## Gate conclusion

The reviewer considers this checkpoint suitable for the remaining work and does not require a separate review round for F1 unless the human prefers one. The correction does not materially invalidate that review. The human has requested disposition and correction, but has not yet explicitly accepted this gate. Under the review workflow, wider implementation remains paused pending that acceptance; the task remains active. Acceptance would permit the remaining mechanical integration, not close the task or replace final integrated review.

On 2026-10-13, the human explicitly accepted this gate and authorized continuation (“yes, continue”), as recorded in the task follow-up. This supersedes the pending-gate conclusion above. Remaining mechanical integration and final integrated review are still required.
