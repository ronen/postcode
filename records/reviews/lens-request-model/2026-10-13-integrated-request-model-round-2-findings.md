# Integrated Lens request model: round 2 findings

Record type: findings
Received: 2026-10-13
Reviewer: Claude Code (Claude Opus 5.5), independent agent session
Handoff: [Integrated Lens request model](2026-10-13-integrated-request-model-handoff.md)
Round: 2
Reviewed target: `764eaa0f4a4fb5663846b5f1bfc2efae54482431` (correction range `f7a082eaa92b929a03402164280a6b47dc586f02..764eaa0f4a4fb5663846b5f1bfc2efae54482431`)
Prior findings: [Round 1](2026-10-13-integrated-request-model-round-1-findings.md)
Prior reviewed target: `f7a082eaa92b929a03402164280a6b47dc586f02`

## Returned findings

### Scope and method

I reviewed the correction range in a detached worktree at the exact target. It has two parts:

- **F1/F2 boundary correction** in `dd3c9e3`.
- **Human-directed removal of shared-arrangement coupling** in `764eaa0`.

I also read the [disposition](2026-10-13-integrated-request-model-disposition.md) and the human follow-up preserved in the task record. The later commits `916cdd9` and `d6b4c3c` change only records.

For the arrangement work, I checked each replaced Lens-name branch against the old behavior for every built-in producer. I confirmed that the new scope and role fields map one-to-one onto the retained Lens IDs:

- **Module answers:** `modules` ⇔ `configured-project` and `inspect` ⇔ `selected-modules` (`projections.ts`).
- **Organization answers:** `organization` ⇔ `configured-project`/`repository` and `inspect` ⇔ `selected-entities`.
- **Dependency answers:** `dependency-structure`/`-children`/`-parents` ⇔ role `null`/`parent`/`child`. The store enforces this mapping.
- **Interpretation answers:** support listing on `variant !== 'request'` covers exactly the historical and associated inspection selections, which are the ones whose Lens was `inspect`.

I recomputed the module bounds table (exports 3/6/50, documentation 0/1/3, external collapse, detailed documentation, source eligibility) for Unicode/JSON × population/selected. It matches the old values in every cell.

I reran my round-1 probes against the compiled target, through direct Sessions, and added checks of refusal detail and valid organization scopes.

### Verification performed

- `npm run check` passed at the target.
- `caffeinate -is npm test` at the target: see [Full-suite result](#full-suite-result) below.
- `git diff --check f7a082e..764eaa0` passed. The worktree stayed clean.
- Probes:
  - Every malformed case from round 1 now returns `invalid-request` before lookup or Evaluation: omitted selector; `42`/object/array selectors; `reference: 'yes'`; `subject: 'bogus'`; `referenceLifetime: 'forever'`. Each qualification names the field and reason, and the supplied value is preserved, or reported as "No value was supplied" when omitted.
  - Valid organization scopes agree end to end. `repository` gives designation `repository`, answer subject `repository` and a distinct ID. `project` and the default share the configured-project answer.
  - Presentation-option defects (missing `presentation`, `format: 'xml'`, `revisionPage: -1`) still return `presentation-unavailable` refusals, which is acceptable.

### Prior findings

- **F1: resolved.** Capture refuses any `subject` other than `project`/`repository` and preserves the value. The organization registration now reads scope from the normalized designation. It throws an internal error on an impossible designation, which keeps the boundary between refusals and defects. Direct and worker regression tests cover the case.
- **F2: resolved.** `selector`, `reference`, `subject` and `referenceLifetime` are type- and enum-checked at capture. An accessor or non-cloneable field keeps its existing representation-limit treatment and is not double-reported. Valid CLI requests are unaffected: `commands.ts` always supplies `selector` as a string or `null`.

### Actionable findings

#### R2-F1 (low): shared module and organization renderers still print the built-in question's heading for any question using them

`createMechanicalView` (`src/lib/program-presentation.ts`) passes the registered `title` only to the exports arrangement. The module and organization renderers derive their headings from content scope instead:

- `presentation.ts:178`: `"Modules · …"` / `"Inspect · configured TypeScript project"`
- `organization/presentation.ts:233`: `"Inspect · groups and modules"` / `"Organization · …"`

The new compatible-question test (`projection-content.test.ts`, "the shared module Presentation accepts another question…") asserts that the Unicode output is byte-identical to the built-in. So content answering `fixture-compatible-question`, titled "Fixture information", renders as "Inspect", and its JSON carries no title. Behavior selection is no longer keyed on Lens identity, so the coupling the human named is removed. But the displayed question label is now inferred from scope. That is the "equivalent dispatch tag" outcome the human's direction warned against, applied to labelling rather than layout. It also falls short of the plan's statement that arrangement receives "the normalized request and result role/title".

The dependency heading ("Module dependency children/parents/structure") comes from the explicit endpoint role. It describes answer direction, not a question name, so I do not include it here.

This changes no answer, qualification, bound or disclosure. Today only built-in questions reach these renderers, because the exact registry blocks other producers. That is why I rate it low.

Suggested correction: pass the definition title through `createMechanicalView` to the module and organization arrangements, as is already done for exports and interpretation, and include it in View identity. Keep the scope-derived layout. If the human prefers the current headings for built-ins, a supplied title that equals today's text would keep existing output unchanged.

#### R2-F2 (low): a missing `lens` is still described as a representation limit

`dd3c9e3` introduced the `absent` representation state, so that missing required input is not mislabelled as an omitted unrepresentable value. The `lens` check in `captureRequest` still uses `'lens' in input ? 'preserved' : 'omitted'`. A request with no `lens` therefore reports "Representation limit: lens is omitted from the report." The other required field, `selector`, reports "No value was supplied." This is a one-token fix (`'absent'`). The current wording falsely suggests a value existed but could not be represented.

### Non-defect observations

- **Prospective source compatibility.** This check uses `lens.cardinality !== 'population'` as a proxy, while arrangement enforces the content's actual subject scope. For every registered implementation the two agree. If a future non-population question produced population-scoped module or organization content, the mismatch would surface as an arrangement defect rather than a refusal. That is acceptable under exact registration, but worth remembering when the registry grows. Association paging still keys on `requirements.kind === 'inspection'`. That is a requirement kind, not a Lens name, and I consider it legitimate.
- **Usage requests must now supply `selector: null`.** This matches the typed `ViewRequest` interface and the CLI, but it means a subjectless report is refused for omitting a subject field. The human's F3 direction (refuse supplied subject inputs) does not cover omission either way. I mention it only so the choice stays deliberate.
- **Identity effects.** Dependency payloads gain `subjectRole`/`coverageScope` with `dependency-projection@8`, the module/organization/dependency Presentation moves to `@32`, and interpretation to `@19`. The new fields are derived deterministically from the registered question. Designation-independent sharing and resubmission consistency are therefore unaffected, and the store and content validators reject inconsistent combinations, as tested. Old IDs change, as the disposition states.
- **Test strength.** The compatible-content tests compare entire arranged Views and renderings under a different question identity across format × source × scope. They also check exact bounds and external collapsing (with a real `node_modules` declaration), deterministic detached repetition, and store/content rejection of inconsistent dependency direction. These are controlled content-boundary demonstrations, as the disposition says, not another registered end-to-end extension.

### Unverified areas and residual limits

The round-1 limits still apply: earlier gates were not independently re-derived, the repository-scale timings were not repeated, and there was no hosted inference, heap study, worker-restart test or catalog fuzzing. Exports partial/unavailable coverage remains controlled. I did not compare rendered CLI output byte-for-byte between `f7a082e` and `764eaa0` on a real project. My built-in equivalence conclusion rests on the one-to-one mapping analysis above and on the unchanged CLI/journey tests passing. The historical intermittent CLI failure remains unexplained.

### Recommendation

F1 and F2 are resolved, and the human-directed coupling removal is behavior-preserving for every built-in producer, with appropriate validation and tests. R2-F1 and R2-F2 are low-severity: each is a label or wording correction with no effect on answers, qualifications or disclosure. I consider the final gate **sufficient once R2-F1 and R2-F2 have dispositions**. The implementer can verify either correction alone; I don't expect another independent round to be needed. Whether R2-F1 is corrected now or accepted as a known display limit is reasonably the human's call, since today's registry exposes no affected question.

### Full-suite result

Running `caffeinate -is npm test` at `764eaa0` gave **585/585 passed, with 0 failed, cancelled or skipped**, in about 195 s. The run was offline and used no paid inference. The worktree had no changes before or after the run.
