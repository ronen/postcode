# Implement the module organization slice

Status: active
Opened: 2026-09-15
Closed:

## Task

mplement the approved plan at docs/plans/module-organization-plan.md. This is explicit authorization\
to begin the substantive implementation task described by that plan. Create a\
suitably named feature branch and work there.  If the implementation becomes sufficiently complex that intermediate review\
would materially reduce risk, pause for independent revi​ew after appropriate\
key developments; prepare and commit a handoff as per `dev/review.md`, then\
pause for me to arrange the review. In any case, after implementation and planned verification are substantially complete, prepare and commit a final integrated-review handoff as per `dev/review.md`.\
Pause for one or more final review rounds and do not close the task until I\
say that the review gate is sufficient.

## Follow-ups

## Outcome

### Intermediate checkpoint: repository evidence (2026-09-15)

Implementation target: `b48b47baff36f3f38f855a5391966fb484247bd7` on
`codex/module-organization`.

Implemented internal worktree-evidence capture and pure layout derivation:
Git-visible current artifacts, qualified exclusion inputs, explicit generated-output
boundaries, opaque repositories, bounded link handling, induced regions, direct
containment and artifact placement, and direct README association. Updated status
and architecture documentation to identify the implemented boundary and the
remaining integration. No dependencies, governing documents, or development
instructions were changed.

An independent review checkpoint precedes integration because visibility,
exclusion, link-resolution, and identity-input mistakes would affect every later
group and placement claim. The human arranges that review. The task remains
active; this is not the final integrated-review gate.

Still required by the approved plan: connect capture after successful project
opening and before snapshot identity; materialize qualified groups and
relationships through the record store; relate configured-project modules with
their actual evaluation states; implement repository/project projections and
generic group inspection; present and navigate the Unicode and structured views;
extend source-detail and observations; complete integration and acceptance
coverage; perform bounded instrument validation on PostCode and an unfamiliar
external repository; update resulting product documentation; prepare the final
integrated-review handoff; and obtain the human's explicit review-gate conclusion
before closing this task.

### Repository evidence review corrections (2026-09-15)

Acted on the committed
[round-1 findings](../reviews/module-organization/2026-09-15-repository-evidence-round-1-findings.md)
in correction commit `ae09e427acae3ce3e112081ed270f0fbe5f965d8`.
Accepted both actionable findings: added regression coverage for an existing
link target with uncaptured case spelling, and removed the redundant opaque
boundary classification from layout derivation after confirming that capture
owns that classification. Strengthened the opaque-outcome assertions and added
the reviewer's suggested three-group cycle and aliased-invocation fixtures.
The authored findings and original handoff remain unchanged.

These are in-scope review corrections under the existing authorization. The
task remains active, with the intermediate checkpoint's human conclusion and
the remaining integration work still pending. No final review gate or task
closure is asserted.

## Verification

At the intermediate implementation target:

- `npm run check` passed.
- `npm test` passed all 97 tests, including 20 new repository tests.
- New tests cover the representative artifact layout, ancestor regions, direct
  README matching, effective ignore rules and tracked overrides, current deletion,
  case matching, explicit output exclusions, opaque boundaries, safe and refused
  links, ordering, changed-input evidence, cross-process determinism, and failure
  classification.
- A read-only capture/derivation smoke check on the PostCode worktree, explicitly
  excluding its actual `_build` and `_observations` destinations, returned 127
  artifacts, 23 regions, 22 containment edges, and 9 direct README associations in
  approximately 227 ms. This is an implementation smoke check, not instrument
  validation or a general performance guarantee.
- The staged diff passed `git diff --cached --check` and was inspected for
  unrelated, generated, and sensitive content.

These checks do not establish snapshot/store integration, organization CLI
behavior, source disclosure, observation coverage for new views, or instrument
usefulness. Those remain subsequent implementation and verification work. Capture
is non-atomic; sparse-checkout completeness remains unresolved. Unsupported path
spellings and bounded link resolution are explicit qualifications to assess at
the intermediate review.

For correction commit `ae09e427acae3ce3e112081ed270f0fbe5f965d8`:

- `npm run check` passed.
- `npm test` passed all 100 tests, with zero failures and zero skips, including
  23 repository tests. The new case-spelling regression actually executed on
  this machine; it explicitly skips when run on a filesystem without the
  required case alias behavior.
- New assertions verify that `target-not-established` survives layout
  derivation without a false containment edge, that opaque refusal outcomes
  survive without a duplicate classifier, that indirect containment cycles are
  refused, and that nested configuration opening through a directory alias
  retains the supported absolute-link resolution.
- `git diff --check` and the staged diff check passed; the correction diff was
  manually inspected. No new public behavior or identity-method semantics for
  valid captured evidence were introduced.
