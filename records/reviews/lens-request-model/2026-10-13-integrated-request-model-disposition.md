# Integrated Lens request model: disposition

Record type: disposition
Date: 2026-10-13
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Handoff: [Integrated Lens request model](2026-10-13-integrated-request-model-handoff.md)
Findings: [Round 1](2026-10-13-integrated-request-model-round-1-findings.md), [Round 2](2026-10-13-integrated-request-model-round-2-findings.md), [Round 3](2026-10-13-integrated-request-model-round-3-findings.md), [Round 4 — Copilot](2026-10-13-integrated-request-model-round-4-copilot-findings.md)
Implementation correction target: `e4452fdfcf797ab04222cbea5cd546995ade9366`

## Findings and dispositions

### F1 — accepted and corrected

An invalid subject could normalize to a repository request while organization construction answered the configured-project question. Capture now accepts only the supported `project` and `repository` values. Invalid serializable values remain in rejected-input context; no lookup or requested Evaluation occurs. Organization construction receives the normalized Lens request and selects scope from its validated designation. An impossible internal designation throws before Evaluation rather than becoming a user refusal.

Correction: `dd3c9e34551f69c6af54339faa3c09a1a3ae5f9d`. Direct and worker regressions cover invalid strings, empty strings, booleans, numbers, null, objects and arrays. Valid default/project requests share their answer; repository requests remain distinct. Published observations carry the same actual scope as the returned answer.

### F2 — accepted and corrected

Capture now validates selector, reference and reference-lifetime fields before normalization. A selector must be supplied as a string or null, matching the existing request interface; omission or undefined produces an absent-field explanation instead of an attempted name lookup. Optional reference values must be booleans, and lifetimes must be `session` or `command`. Serializable rejected values are preserved. The new `absent` representation state distinguishes missing required input from an omitted nonrepresentable value. Existing accessor/non-cloneable handling retains its original representation limit without adding a false missing-field diagnosis or executing an accessor.

Correction: `dd3c9e34551f69c6af54339faa3c09a1a3ae5f9d`. Direct and worker publication tests cover rejection reason, preserved input, no work/prerequisites/answers, command-refused observations and continued Session usability. Existing post-validation failures, including a later `DataCloneError`, remain defects.

### Remaining family-local coupling — corrected under human direction

The reviewer presented this as a non-defect observation requiring human judgment. The implementer proposed retaining the checks collectively; the human instead directed their removal from shared arrangement/rendering while retaining legitimate Lens-specific registration, construction and validation. That direction is preserved verbatim in the task record and committed in `d615b7a` before affected work. It supersedes the implementer's proposed disposition.

Correction: `764eaa0f4a4fb5663846b5f1bfc2efae54482431`.

| Case assessed | Disposition and resulting boundary |
| --- | --- |
| Module source-detail eligibility | Removed the `inspect` check. The fixed module Presentation permits source detail for selected-module content and refuses population content. Prospective source compatibility uses selected-subject cardinality rather than the inspection implementation name. |
| Module export/documentation bounds and external collapsing | Removed the `modules`/`inspect` checks. One local Presentation policy chooses concrete bounds, documentation detail and external collapsing from existing population/selected-subject meaning and output format. |
| Module Unicode table/card layout | Removed the Lens check. Arrangement and rendering share that same Presentation policy. The existing subject scope describes answer meaning; no replacement Lens dispatch tag was introduced. |
| Organization source-detail eligibility | Removed the `inspect` check. The organization Presentation's policy permits source detail for selected-entity content. |
| Organization traversal, omission accounting and tree/card layout | Removed the `organization`/`inspect` checks. One family policy owns tree/card choice and display bounds using configured-project/repository versus selected-entity scope. Pruning, repeated references and embedded module detail retain their behavior. |
| Dependency headings and empty-child explanation | Removed dependency Lens-name checks. Retained answers now explicitly identify the selected subjects' parent/child endpoint role, or null for the population answer. Construction uses that role for relationship selection. Rendering combines this supplied direction with existing qualified completeness and opaque-endpoint information. |
| Dependency recognition/non-edge coverage and parent qualification | Removed dependency Lens-name checks. Retained coverage scope distinguishes the whole evaluation, selected source owners and results unattributable to selected targets. Construction uses it to select coverage; arrangement/rendering uses the supplied scope for disclosure and explanations. Store validation preserves the registered questions' contracts. |
| Dependency non-edge display bounds | Removed the structure-Lens check. The dependency Presentation summarizes population content unless explicit source detail requests bounded records; selected-subject content retains its detailed listing. |
| Interpretation support listing | Removed the `inspect` check. The View carries the already-retained selection variant. The shared Presentation lists support for retained historical/associated selections and keeps operation-answer support in JSON, preserving the existing distinction and qualifications. |
| Interpretation title lookup in the coordination helper | Retained as legitimate declaration lookup. The helper obtains a supplied or registered title before calling pure arrangement. It does not select layout, limits, coverage or source policy; arrangement receives the explicit title. |

No unavoidable question-name dependency remains in the four shared arrangements/renderers. Lens identity remains metadata, a registration key and an input to legitimate construction/validation. No general options framework, new production Lens or public registration API was added.

The dependency descriptor adds endpoint role and coverage scope; the interpretation View descriptor adds its retained selection variant. Experimental JSON therefore makes these meanings explicit. Dependency construction advances to `dependency-projection@8`, shared mechanical Presentation to `presentation@32`, and interpretation Presentation to `investigation-presentation@19`. Existing answer/reference identity guarantees remain; old method-version IDs are not promised unchanged.

### Other non-defect observations

| Observation | Disposition |
| --- | --- |
| Exact registry and captured catalog seam | Acknowledged. Exact executable registration, immutable parent capture, worker revalidation and production exclusion of the fixture exports Lens remain intact. |
| Exports family qualification and defensive-validation limit | Acknowledged as reported. The constructor remains the producer of the selected supported claims. This correction does not add the separate completeness/context recomputation the reviewer explicitly classified as a defensive limit rather than a defect. |
| Shared documentation/export formatting extraction | Acknowledged as behavior-preserving at the reviewed target. The new Presentation method advances for the subsequent explicit descriptor/policy changes; the earlier extraction did not itself require a bump. |
| Internal interpretation catalog replacement policy | Acknowledged and retained under the earlier accepted policy. Production uses the default catalog; this work does not broaden replacement of mechanical definitions or register the compatibility fixtures. |
| Coverage map | Acknowledged as the reviewer's spot-checked coverage assessment. New direct/worker boundary and shared-Presentation compatibility tests supplement it; neither that map nor passing tests imply exhaustive coverage. |

## Round-2 findings and dispositions

The human directed correction of both findings, preserving scope-based layout, bounds, qualifications and source disclosure, and explicitly withheld task-closure authorization. That direction was recorded before implementation in `be592d5`. Both corrections are in `e4452fdfcf797ab04222cbea5cd546995ade9366`.

### R2-F1 — accepted and corrected

Mechanical coordination now passes the supplied question title into both module and organization arrangement, including embedded module detail. Each self-contained View and JSON payload retains `title`; the title participates in View identity. It is not added to Projection content or identity. The shared mechanical Presentation method advances from `@32` to `@33` for the new payload and identity input. The existing scope policies still control table/tree/card layout, limits, qualifications and source eligibility.

The shared `inspect` declaration now supplies the question label `Inspect`. Module and organization renderers append their existing subject/context descriptions to the supplied label. The interpretation application supplies `Inspect · investigram`; its coordination helper retains that contextual default for direct construction as well, while an explicit supplied title takes precedence. This is application title construction before pure arrangement, not question inference by a shared renderer. Existing built-in headings are preserved.

Compatible-question regressions now compare equivalent content, layout and qualifications while requiring the new question's actual title in Unicode and JSON. Separate title-only variations preserve the complete Projection descriptor but change View IDs, including embedded module detail. Detached repetition, source disclosure, export/documentation bounds and external collapsing remain checked. Direct and worker tests verify the built-in inventory, project/repository organization, module-inspection and group-inspection headings. Exact investigram inspection retains its contextual heading and honors an explicit title override.

### R2-F2 — accepted and corrected

An absent or undefined Lens now produces `representation: absent` and explains that a Lens or report name must be supplied. It no longer claims a representation limit. Invalid representable names retain the supplied value. A supplied accessor or nonrepresentable Lens retains its actual representation-limit problem without an additional false missing-input problem, and accessors are not executed. Unexpected failures after validation remain internal defects.

Direct and worker publication regressions cover an omitted Lens: `invalid-request`, no prerequisite or requested work, no retained answer, missing-input qualification without a representation-limit claim, and matching JSON/observation records. Capture regressions separately check undefined, accessor and function-valued Lens inputs, serializable reports and zero accessor reads.

### Round-2 non-defect observations

| Observation | Disposition |
| --- | --- |
| Prospective source compatibility versus actual content scope | Recorded as a future registration constraint. Current exact registrations agree; arrangement continues enforcing the actual supplied scope. No registry expansion is part of these corrections. The legitimate inspection requirement-kind check for association paging remains unchanged. |
| Usage requires explicit `selector: null` | Recorded as existing behavior matching the typed request interface and CLI. This correction does not change usage omission policy or infer new human approval from the reviewer's observation. |
| Identity effects | Confirmed at the reviewed target. This correction adds the supplied display label to module/organization View identity and advances the shared Presentation method to `@33`; Projection methods and answer identity inputs are unchanged. Old method-version View IDs are not promised unchanged. |
| Compatible-content test strength and limit | Retained, with the incorrect byte-identical-heading expectation corrected. Tests still compare content and policy under a distinct question identity; this remains a controlled content-boundary demonstration, not another registered end-to-end extension. |

## Corrections and verification

### Round-1 correction verification

For F1/F2, the initial five-test reproducer passed one and failed four against the reviewed implementation. After correction all five passed. The completed boundary-focused run passed all 57 tests, including the sixth new absence/accessor check, existing request publication, organization journeys, extension registration and post-validation defect checks. Type checking, build and diff checks passed.

For shared arrangement, a focused run passed 39 of 40 tests. The sole failure was a new fixture assumption: its ambient declaration was itself a configured project input, so it did not supply the intended external-collapse case. The fixture now imports a declaration from `node_modules`; the unchanged collapse assertion passes. No product qualification or expected display bound was relaxed. A subsequent content/compatibility/interpretation run passed all 29 tests.

The final `caffeinate -is npm test` passed **585/585**, with zero failed, cancelled or skipped tests, in approximately 200 seconds. This includes both boundary corrections, all four new arrangement regressions, unchanged CLI/organization/dependency journeys, source-disclosure observations, equivalent-answer identity, canonical collections, embedded-empty detail, frozen interpretation selections, worker publication, attribution and extension checks. `npm run check`, build and `git diff --check` passed. Repository inputs and Git state stayed unchanged during each final run. Temporary process-scoped sleep inhibition ended with execution. Existing offline loopback authentication fixtures ran with permission; no paid inference was used.

The module compatibility fixture supplies a separate question and answer identity to the existing module Presentation for both population and selected content. It checks Unicode and JSON arrangements, source eligibility/disclosure, external collapsing, export bounds, preserved qualification and deterministic detached repetition. Organization and dependency fixtures similarly compare arrangements under a separate question identity. These are controlled content-boundary demonstrations; they do not claim another end-to-end registered mechanical extension. The previously verified exports and interpretation extensions remain the end-to-end registration examples.

Residual limits remain explicit: no new repository-scale timing/heap study, hosted inference, worker-restart test or malformed-catalog fuzzing was performed. Exports partial/unavailable coverage still uses controlled core inputs. The reviewer's earlier-gate spot checks are not represented as independent rederivations of every race, allocation or revision case. The historical intermittent CLI JSON failure was not reproduced by this passing run and remains unexplained.

### Round-2 correction verification

`npm run check`, `npm run build` and `git diff --check` passed. The focused run used `caffeinate -is node --test` with the projection-content, request-designation-input, request-model, investigation-selection, source-disclosure, organization-cli, answer-identity, subject-resolution, discovery, expansions and foundation-identity suites. All **111/111 tests passed**, with zero failures, cancellations or skips, in approximately 72 seconds. This includes the updated compatible-question/title identity tests, four new title/input tests, ordinary built-in journeys, unchanged reference allocation and resolution behavior, source observations, rejected-input publication and post-validation defect handling.

Repository inputs and Git state stayed unchanged during the run. Only redundant blank-line cleanup followed it before the implementation commit. Temporary process-scoped idle/system-sleep inhibition ended with execution. No paid inference was used. The full suite was not rerun for these focused corrections: the reviewer's independent **585/585** result applies to `764eaa0`, not to the new correction target.

The round-2 residual limits remain recorded as reported: earlier gates and scale measurements were not independently rederived, no hosted inference, heap study, worker-restart testing or catalog fuzzing was added, and exports partial/unavailable coverage remains controlled. No old/new real-project CLI byte comparison is claimed. The new built-in heading checks supplement the reviewer's mapping analysis and existing journey tests. The historical intermittent CLI failure remains unexplained.

## Round-3 assessment

Round 3 independently rechecked `e4452fdfcf797ab04222cbea5cd546995ade9366` and confirms R2-F1 and R2-F2 resolved, with no actionable findings. No implementation correction is required. The human subsequently directed housekeeping and GitHub publication while expressly keeping this task open.

The reviewer passed type checking and the full offline suite: **589/589**, zero failed, cancelled or skipped, approximately 200 seconds, with a clean worktree and no paid inference. The reviewer also compared `764eaa0` and `e4452fd` on this repository in Unicode and JSON for modules, project/repository organization, module/group inspection, dependencies, children and an unresolved inspection. After normalizing Session UUIDs, all eight Unicode results and exit codes matched; JSON changes were limited to supplied titles and View IDs. This supplies the real-project comparison previously unperformed, within the commands and environment tested.

| Non-defect observation | Assessment |
| --- | --- |
| External declaration answer IDs depend on installation path | Recorded with the reviewer's evidence: the same older build copied to another path also changed module/dependency Projection IDs while remaining stable at each path. The proposed TypeScript/declaration-resolution explanation remains a likely cause, not an independently established diagnosis. No cross-installation identity guarantee is added; any such requirement needs a separate decision. |
| Interpretation title context is constructed in two places | Recorded as a maintainability note. Both application paths agree and are tested. No helper refactor is needed for this documentation/publication housekeeping. |
| Dependency headings describe endpoint direction | Recorded as unchanged and outside the requested module/organization question-title correction. No further title behavior is inferred or introduced. |

Earlier gates and repository-scale timings were not independently rederived. No hosted inference, heap study, worker-restart testing or catalog fuzzing was added; exports partial/unavailable coverage remains controlled. The real-project CLI comparison excludes interpretation commands and shell sessions. The historical intermittent CLI failure remains unexplained and was not reproduced. The reviewer recommends the final gate as sufficient; that recommendation does not close the task.

## Round-4 Copilot disposition

The human requested retrieval and assessment of the GitHub Copilot review on [PR #10](https://github.com/ronen/postcode/pull/10). The complete review submission and its single inline finding were preserved in `fa50f98` before correction, with review/comment identifiers, target, location and retrieval coverage. All pages of review submissions, inline comments and PR conversation were fetched; there were no replies or issue-conversation comments at retrieval. The reviewed PR target is `33e443a260589530725d8003ad9a6dc5935c7b2a`. Copilot reported one low-severity finding and no executed verification; its change-summary table and service footer are preserved as returned, not treated as new implementation requirements or test evidence.

### C4-F1 — accepted and corrected

[Inline comment 4263518014](https://github.com/ronen/postcode/pull/10#discussion_r4263518014) correctly identifies obsolete capability status. The capability reference still said answer identity and prerequisite attribution were in progress, contradicting the implemented behavior and current status/architecture documentation.

Correction `d2c7684efff9cfcec5b38111f2c7680ea56f9fb5` replaces that sentence with the established equivalent-name/reference answer behavior and bounded request-scoped prerequisite/evidence work reporting. The link to the correction plan is replaced with the implemented request-work attribution description. The separate captured-basis attribution limitation, its backlog link and the warning against assuming complete research instrumentation remain intact.

Verification: inspected the edited paragraph against `STATUS.md`, the architecture's request-work attribution section and the captured-basis backlog entry; verified the replacement link's file/anchor and ran `git diff --check`. The complete review-to-correction range check flags the carriage returns in Copilot’s original table as trailing whitespace. Those source line endings are deliberately preserved; the same range passes with `cr-at-eol` enabled alongside the default whitespace checks. This is a documentation-only correction, so no runtime test rerun is claimed. The independent 589-test evidence remains applicable to the unchanged implementation target, with its previously recorded limits. No finding was rejected, materially qualified or deferred, and no additional independent review was arranged. The task remains active under the human's no-closure instruction.

## Review rounds

- Round 1 reviewed `f7a082eaa92b929a03402164280a6b47dc586f02` over the complete plan scope. Its independent type check and 575-test pass apply to that earlier target.
- F1/F2 correction: `dd3c9e34551f69c6af54339faa3c09a1a3ae5f9d`.
- Human-directed arrangement correction and round-2 target: `764eaa0f4a4fb5663846b5f1bfc2efae54482431`. The correction range from the reviewed implementation is `f7a082eaa92b929a03402164280a6b47dc586f02..764eaa0f4a4fb5663846b5f1bfc2efae54482431`.
- Round 2 independently reviewed `764eaa0f4a4fb5663846b5f1bfc2efae54482431`, confirmed round-1 F1/F2 resolved, and reported R2-F1/R2-F2. Its type check and 585-test pass apply to that target.
- Round-2 correction and round-3 implementation target: `e4452fdfcf797ab04222cbea5cd546995ade9366`, verified by the implementer as described above.
- Round 3 independently reviewed that same correction target and confirmed both round-2 findings resolved, with no new actionable findings, a 589-test pass and the bounded real-project CLI comparison described above.

- Round 4 retrieved the Copilot review of PR target `33e443a260589530725d8003ad9a6dc5935c7b2a`; its one documentation finding is corrected in `d2c7684efff9cfcec5b38111f2c7680ea56f9fb5`.

## Gate conclusion

All actionable findings across the four rounds are accepted and corrected; none remains open, rejected or deferred. Round 3 recommends the final gate as sufficient; the subsequent Copilot documentation finding is now corrected. The human has authorized PR publication and review corrections while explicitly withholding task closure. The correction and its records can be pushed to the existing PR under that direction. The task remains active; this disposition does not authorize closure on the human's behalf.
