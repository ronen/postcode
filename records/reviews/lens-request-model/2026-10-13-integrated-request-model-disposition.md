# Integrated Lens request model: disposition

Record type: disposition
Date: 2026-10-13
Task: [Implement explicit Lenses and qualified request resolution](../../tasks/2026-10-11-lens-request-model.md)
Handoff: [Integrated Lens request model](2026-10-13-integrated-request-model-handoff.md)
Findings: [Round 1](2026-10-13-integrated-request-model-round-1-findings.md)
Correction target: `764eaa0f4a4fb5663846b5f1bfc2efae54482431`

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

## Corrections and verification

For F1/F2, the initial five-test reproducer passed one and failed four against the reviewed implementation. After correction all five passed. The completed boundary-focused run passed all 57 tests, including the sixth new absence/accessor check, existing request publication, organization journeys, extension registration and post-validation defect checks. Type checking, build and diff checks passed.

For shared arrangement, a focused run passed 39 of 40 tests. The sole failure was a new fixture assumption: its ambient declaration was itself a configured project input, so it did not supply the intended external-collapse case. The fixture now imports a declaration from `node_modules`; the unchanged collapse assertion passes. No product qualification or expected display bound was relaxed. A subsequent content/compatibility/interpretation run passed all 29 tests.

The final `caffeinate -is npm test` passed **585/585**, with zero failed, cancelled or skipped tests, in approximately 200 seconds. This includes both boundary corrections, all four new arrangement regressions, unchanged CLI/organization/dependency journeys, source-disclosure observations, equivalent-answer identity, canonical collections, embedded-empty detail, frozen interpretation selections, worker publication, attribution and extension checks. `npm run check`, build and `git diff --check` passed. Repository inputs and Git state stayed unchanged during each final run. Temporary process-scoped sleep inhibition ended with execution. Existing offline loopback authentication fixtures ran with permission; no paid inference was used.

The module compatibility fixture supplies a separate question and answer identity to the existing module Presentation for both population and selected content. It checks Unicode and JSON arrangements, source eligibility/disclosure, external collapsing, export bounds, preserved qualification and deterministic detached repetition. Organization and dependency fixtures similarly compare arrangements under a separate question identity. These are controlled content-boundary demonstrations; they do not claim another end-to-end registered mechanical extension. The previously verified exports and interpretation extensions remain the end-to-end registration examples.

Residual limits remain explicit: no new repository-scale timing/heap study, hosted inference, worker-restart test or malformed-catalog fuzzing was performed. Exports partial/unavailable coverage still uses controlled core inputs. The reviewer's earlier-gate spot checks are not represented as independent rederivations of every race, allocation or revision case. The historical intermittent CLI JSON failure was not reproduced by this passing run and remains unexplained.

## Review rounds

- Round 1 reviewed `f7a082eaa92b929a03402164280a6b47dc586f02` over the complete plan scope. Its independent type check and 575-test pass apply to that earlier target.
- F1/F2 correction: `dd3c9e34551f69c6af54339faa3c09a1a3ae5f9d`.
- Human-directed arrangement correction and current target: `764eaa0f4a4fb5663846b5f1bfc2efae54482431`. The correction range from the reviewed implementation is `f7a082eaa92b929a03402164280a6b47dc586f02..764eaa0f4a4fb5663846b5f1bfc2efae54482431`.

## Gate conclusion

F1 and F2 are accepted and corrected. The remaining coupling was individually assessed and corrected under explicit human direction. No finding is rejected or silently deferred.

The reviewer proposed a narrow recheck only if changes remained within designation validation and organization registration. The subsequent human-directed work crosses that boundary, so the implementer requests a further independent round under the existing integrated handoff, focused on these corrections and their explicit content/Presentation distinctions. The original assignment still covers this work; its handoff and returned findings remain unchanged. The task is active. Human judgment that the final gate is sufficient remains required before closure.
