# Backlog

This backlog records worthwhile work and concerns that arise outside an active plan or authorized task. An entry is a candidate for consideration, not a commitment or authorization to implement. Its presence means that it remains open; no separate status is needed.

Keep entries concise but sufficiently contextual to remain intelligible. Remove an entry when it is incorporated into a plan, resolved, or declined. Carry any context worth preserving into the resulting plan or decision; Git retains the backlog's history. A consequential choice not to pursue something may warrant a decision record, but routine pruning does not.

The human evaluates backlog entries during planning as appropriate. Coding agents may add entries when directed by the development workflow, but must not prioritize, promote, implement, or remove them without human direction.

Use this form for new entries:

```markdown
## Short descriptive title

Added: YYYY-MM-DD
Origin:
Area:

Describe the need, why it matters, and relevant constraints without designing the solution prematurely.
```

## Candidates

## Correct lens misreporting in observations and dependency subject status

Added: 2026-10-06
Origin: [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md) findings F1 and F2
Area: observations and dependency lenses

Two confirmed defects misdescribe requests:

- [F1](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f1-observations-describe-follow-up-investigation-requests-as-configured-project-inventory): observation request records describe `explain`, `decompose` and `examine`, and `children`/`parents` on an investigram, as "Configured-project inventory requested." Observations are the research record of PostCode use, so these entries misstate the request and its reference scope. No test covers these descriptions.
- [F2](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f2-a-bound-group-reference-given-to-children-or-parents-is-reported-as-an-unknown-reference): `children` or `parents` on a bound group reference reports `unknown-reference`, when the actual reason is that the lens does not apply to groups. The investigation family reports the equivalent case as an unsupported subject for the lens.

Both could be corrected directly, with tests covering every lens. Changing F2's status may need agreement on the dependency Projection's selection-status vocabulary. A shared lens representation, if adopted (see "Decide how lenses are represented"), would remove the common cause.

Describe the requested information from the actual request and its resolution, not by inferring one Lens from a View-wide descriptor. A coordinating View can have several Projection requests and results; observations, captions and agent context must preserve those associations when that capability is introduced. A bounded correction to current misreporting need not introduce a plural schema or wait for that future work.

## Decide how lenses are represented

Added: 2026-10-06
Origin: [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#lens)
Area: lens model and request dispatch

Lens is first-class in the user model but has no representation in code. Its identity exists only as strings that differ between requests, Projection records, Views and observations. Subject applicability, requirements and dispatch are coded inline in the request executor. Several lists of lens names are maintained separately, which caused the defects in "Correct lens misreporting in observations and dependency subject status". A GUI will need to enumerate the questions available for a subject, caption each View with its question, and edit lens parameters.

Open questions:

- Is `inspect` one lens whose meaning depends on subject kind, or several lenses routed from one command? The same question applies to `children`/`parents` across dependency and investigram subjects.
- Should `usage` remain lens-shaped, or become a separate reporting request?
- How visible should "lens" be to users? This affects naming more than the need for a representation.

One option the audit proposed is a single typed lens table, giving each lens's identifier, accepted subject kinds, parameters, requirements and constructor. Command parsing, dispatch, the operation mapping and observation descriptions would all derive from it. Other forms remain open.

The [coordinated-Views decision](decisions/coordinated-views-and-qualified-results.md) removes any assumption that a View has exactly one Lens or that coordinating a summary requires a composite summary Lens. Later Lens preparation should distinguish a Lens's question and parameters, its application to a subject and captured state basis, Evaluation's reusable operations, and the Presentation's input collection. Several analyses or qualified contributions can serve one Lens without a separate category. This does not decide a registration mechanism, one `inspect` identity across subject kinds, or an execution framework. The earlier exploratory representation proposals do not settle identifier spellings, a single `inspect` identity, a registry or prompt mechanism, a combined F1–F4 implementation scope, or schema migration. `usage` remains reporting under the accepted qualified-construction decision; its current lens-shaped descriptor is a compatibility issue, not an open question about whether it is a program Lens.

## Decide how a Projection's subject is designated and separated from lens parameters

Added: 2026-10-06
Origin: representation audit findings [F3](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f3-subject-designation-is-stored-and-reported-as-lens-parameters) and [F4](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f4-dependency-subject-selection-creates-and-retains-an-unrequested-inspection-projection)
Area: Projection records and identity

Mechanical Projection records store the subject selector in `parameters`, and observations publish it as `lensParameters`. Each family represents its subject differently. Dependency `children`/`parents` resolve their subject by constructing and retaining a module `inspect` Projection that no request asked for. No lens has real parameters yet, so no answer is currently wrong. The first real parameter, such as direct versus transitive reach, would share a field with subject designation.

Open question: is the subject of a lookup-based Projection the lookup or the resolved entity? Today name and reference lookups of the same module produce distinct Projection IDs with identical content. The answer affects deduplication, pinning and comparison.

One option the audit proposed is a structured subject designation shared across record families, modelled on the investigation family's `SelectionSelector`, with dependency subjects resolved without retaining an `inspect` Projection. This would change Projection record shapes and possibly identity.

The coordinated-Views model does not make internally requested component Projections inherently invalid. F4 concerns construction and retention of an inspection Projection to obtain dependency subject-selection data: its selection is copied, but its qualified inspection answer is not consumed as an attributed contribution, and module-only selection determines the result. Preserve genuinely consumed component answers with attributable meaning, method, basis and qualification; no universal direct component pointer is prescribed. Keep subject designation, selected subjects, program-input designations, binding policies, captured-state attribution and true Lens parameters distinct; a revision designation is not a Lens parameter merely because it occupies a request field. Subject remains open-ended: a module investigated across captured states and an identified qualified change are different possible subjects, with state designation explicit in either case. No change-investigation implementation follows from that distinction. Do not infer a universal identity or deduplication policy from the possibility of several inputs.

## Decide how GUI Presentations and their parameters are represented

Added: 2026-10-06
Origin: representation audit finding [F5](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f5-presentation-choice-presentation-parameters-and-display-bounds-are-fused-into-format)
Area: presentations and GUI preparation

`Presentation.format` (`unicode` or `json`) selects both the output encoding and every display bound. Paging, continuation and reference lifetime travel outside the `Presentation` record. The type cannot express a GUI presentation or parameters such as sorting, grouping or expansion depth. Population-wide reference coordination happens inside each `create*View` function together with CLI arrangement. A GUI would therefore have to reimplement that coordination or call CLI arrangement.

This needs a decision before GUI presentation work, not before. Open questions:

- How are presentation choice, presentation parameters and display bounds represented?
- Which inputs count as presentation context, and so leave View identity unchanged? Candidates include available space, reference lifetime and usage reporting.

Options the audit proposed include separating presentation selection from bounds, and making reference coordination an interface-independent step called by both CLI and GUI arrangement.

Assess nonempty multi-Projection input collections, contribution/state attribution, exact correspondence guarantees, and the distinction between coordinating one View and placing independent Views together. Decide how composition changes are recorded and how continuity relates to identity before implementing a managed View lifecycle. Preserve population counts and qualification through arrangement; do not hide new analysis inside cross-Projection coordination. Revisit the audit’s presentation-context question: available space, interaction state, reference lifetime and per-input usage/reporting need explicit treatment rather than inheriting current CLI identity formulas. Decide which input orders or roles are meaningful, which are presentation choices, and which do not affect identity. Preserve meaningful before/after roles without imposing ordered identity on every collection. No multi-Projection GUI implementation is authorized by the conceptual decision.

## Allow a View to be requested for an existing Projection

Added: 2026-10-06
Origin: representation audit finding [F6](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md#f6-a-retained-projection-cannot-be-presented-again-every-view-request-re-selects)
Area: session API, Views and investigation selection

The session API accepts only complete View requests, so every page, format or continuation change rebuilds its Projection from current session state. For mechanical lenses this returns the same Projection. An investigation selection, however, takes a new revision snapshot each time. A correction accepted between `inspect @investigram-…` and `--revision-page 2` makes page 2 a page of a different Projection. This shows only through the Projection ID in JSON.

The intended implementation direction is a request form that names an exact retained Projection together with new presentation inputs, so that paging and reformatting keep the same answer. Keep exact-result redisplay distinct from repeating a request with pinned inputs: pinning selects the same captured program state, not necessarily the same retained analysis result. Preserve this distinction in agent-context references and future interface wording.

F6 is a current human-facing continuity/disclosure limitation, with remediation explicitly deferred to separately scoped work. Paging or reformatting is intended to preserve the selected answer and its qualifications, but the current request path may select newer retained interpretation or correction/association snapshots. Separate CLI commands and changed Projection IDs in JSON do not sufficiently disclose refresh to a human paging an answer. Make refresh behavior apparent and disclose consequential changes in answer, selection or qualifications if an interaction refreshes instead; clearly disclosed reselection may be an interim treatment but is not equivalent to exact-result continuity. This does not require a warning for every identifier change or a comparison notice for every independently requested fresh investigation.

Separate presenting a captured result from repeating a request under its input binding: following resolves a changing input again, while pinned continues to use the same captured program state. Retained interpretation and correction/association selections also support the answer, but are not thereby captured program states and acquire no following or pinned policies. Preserve explicit earlier results and reference bindings. Remediation does not depend on live refresh, multi-state analysis or GUI support and must precede any claim that current paging preserves one selected answer. Any new request or schema requires its own compatibility and identity decision; no implementation or session-lifecycle change is authorized here.

## Preserve captured-basis attribution in observations

Added: 2026-10-08
Origin: [Current observation provenance gap](decisions/coordinated-views-and-qualified-results.md#current-observation-provenance-gap)
Area: observation provenance and qualified result attribution

Current observation batches do not generally preserve an exported association between the presented Projection and its captured program-state basis. Ordinary module inventory is a confirmed case: the batch retains a conceptual View and session/path/method context, but not the retained analysis-input support. Session-local identifiers and configured paths do not establish that basis after the ephemeral store is gone. Optional source-detail evidence digests describe disclosed items, not a complete state association. Recorded output remains evidence of what PostCode displayed; observations do not generally establish the captured program basis supporting it. This is a current recording gap relevant to existing observation obligations, independent of future multi-state or GUI capability.

Assess and correct the bounded observation export path so that the recorded result remains attributable to the basis actually used, including capture limitations and the repository-state provenance required by the product design. Do not reconstruct provenance by reading a later working tree. Determine what can be supplied from retained support, which references remain resolvable after session closure, and which additional capture or retention information is necessary. Choose schema, disclosure and compatibility treatment from that assessment; do not prescribe a state field in every record family or imply that a commit alone captures relevant working-tree inputs.

Scope this work to identifying the captured basis and its limitations, rather than retaining everything necessary to reproduce an investigation. It does not authorize a durable analysis store or repository archive. Do not assume that a commit hash or references into a discarded store are sufficient attribution. Any bounded retention needed for adequate attribution must be justified within the later approved design; full reproducibility is a separate concern.

Include associated-inspection attribution in the assessment: its exported descriptor uses the composite selection ID while retaining mechanical descriptor fields, and omits the explicit mechanical support reference retained in core. Check whether the observation adequately describes the actual qualified answer and its support. A composed Projection does not inherently become a View of two independent Projections; preserve the accepted composition contract without requiring universal direct component pointers.

Correction is explicitly deferred and need not block architectural adoption or interface exploration. Complete it before relying on newly collected observations for assessments requiring attribution to a particular program state. Until then, preserve the distinction between evidence of displayed output and evidence of its captured program basis. Keep this work separate from F1 request-description fixes unless an approved implementation scope deliberately combines them. This candidate authorizes no implementation or rewriting of historical observations.

## Assess conformance when extending coordinated Views and state scope

Added: 2026-10-07
Origin: [Coordinate Views while preserving qualified results](decisions/coordinated-views-and-qualified-results.md)
Area: qualified results, presentation composition and future lifecycle

The current implementation is a permitted limited subset of the broader product model. Before extending it, assess state-to-claim/evidence associations, meaningful ordering, capture timing and non-atomicity; input-level qualifications and partial outcomes; identity guarantees used for alignment; and distinctions among descriptive counts, overlapping populations and new analytical aggregates. Verify that each supplied Projection stays fixed and that arrangement cannot broaden its population through session access. No broad conformance audit has yet established these properties for future multi-input behavior.

Scope prerequisites to the introduced capability. Coordinating several existing Projections from one Session does not inherently require multi-state support or new capture identity. It does require attributable input meanings and qualifications, appropriate presentation/observation descriptors, stable selected answers and visible composition changes. Choosing a qualified Projection selection versus coordinating supplied answers depends on requested meaning; neither new synthesis nor an outer Projection is required merely to share a display.

Current entity keys and several lookup/reuse paths are session-scoped and assume unchanged program inputs. Before introducing another capture, decide whether it belongs to a new Session or to a Session extended to support several captures, and how entity versions, record keys, reuse, associations and reference bindings distinguish their bases. Reusing a module key in the same namespace cannot by itself establish cross-state semantic correspondence. Assess affected schemas and method versions after choosing the design; this candidate does not prescribe a state-ID field in every record or a rewrite of every family.

Also assess View-to-View input dependencies and anchors: distinguish discovery lineage from a continuing dependency on another View’s supplied Projection or selection. Define handling of a changed or absent anchor without silent retargeting. This need does not create a third universal input-binding category or require a live View implementation now.

Before adding live refresh, multi-state analysis, cross-session coordination, workspace persistence or agent-context export, resolve the necessary reference/correspondence, result-selection, captured-result versus repeatable-request references, composition-recording and retention contracts for that capability. For multi-Projection output, assess the singular View descriptors, observation request records and any agent-context format together. Record the actual Projections presented, their composition and captured-state associations, and make composition/basis changes visible. Decide the required observation events and any workspace-state retention separately; recording a change does not inherently require workspace persistence. Expose the choices actually made and their criteria at the time, rather than explanations reconstructed from subsequently changed defaults. Inspectability requires neither a general planner nor a separately stored plan artifact.

This candidate creates no schedule or requirement to implement those capabilities together. Existing defects in request observations, unsupported-subject status and parameter descriptors remain separate candidates and must not be excused as missing future features.

## Consider summary suggestions and recursive navigation

Added: 2026-10-07
Origin: [Summary Views and navigation](decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses)
Area: entry experience and navigation

The product permits suggesting a summary View when no more specific information need is expressed; it does not mandate that default. The CLI’s module-inventory default is compatible with that direction, while `summarize` offers the implemented module interpretation. Consider whether summary suggestions and recursive navigation would be useful in future interface work, distinguishing coordination of qualified inputs from synthesis of a new answer. Define useful selection and omission disclosure without requiring a summary Lens for every subject. No change to current commands or immediate GUI work is implied.

## Qualify evidence that modules are used for testing

Added: 2026-10-03
Origin: human discussion of test-code visibility in the planned GUI
Area: mechanical analysis and presentation

Investigate mechanical signals that a module is used for testing, including
weaker location and naming clues (such as a top-level `test` directory or a
`*.test.*` filename) and stronger evidence from known test frameworks.
Distinguish what each signal establishes: a matching path or name, selection as
a test entry by a runner's effective configuration, or a recognized test
registration. Imports of testing APIs alone need not establish either of the
latter claims.

Assess which claims are practical across configurable discovery rules, globals,
wrappers, and helper modules. Failure to recognize a signal must not imply that
a module is non-test, and no such signal alone establishes that its contents
are exclusively for testing. Consider how UIs could offer filtering or
collapsing choices based on these distinct signals, with their epistemic
qualifications visible and the treatment of unclassified modules explicit.

## Configurable investigator model and reasoning effort

Added: 2026-09-30
Origin: human discussion following the ChatGPT-plan route's model-availability check
Area: investigator configuration and usability

Allow users to choose the investigator's model and reasoning effort from the
configurations supported by their provider, account and authentication route.
The module investigation assessment required a human-selected alternative when
its intended model was unavailable through ChatGPT plan usage; product support
should make such choices accessible without implementation edits.

Provide defaults or recommendations, potentially per provider and access route,
with an explanation of expected quality, latency and usage tradeoffs and their
uncertainty. Recommendations could begin as curated defaults; automatic model
selection and comparative benchmarking are separate possibilities.

Preserve the effective configuration in investigation provenance and usage
reports. Define when configuration changes take effect and how they interact
with retained outcomes, without silently regenerating earlier investigations or
switching billing routes.

## Assess disclosure classification for paths outside sourceDetail

Added: 2026-09-30
Origin: [Module investigation milestone-2 round-3 review](../records/reviews/module-investigation/2026-09-29-milestone-2-round-3-findings.md)
Area: observation semantics and source disclosure

The source-disclosure correction classifies supported explicit source-detail fields
by presentation and format. The reviewer did not assess paths carried outside
`sourceDetail`, such as configuration paths in JSON analysis context, against the
[actual-disclosure decision](decisions/adopt-identity-evidence-and-observation-constraints.md#record-the-actual-source-disclosure-level).
The human directed recording this as an unassessed follow-up without expanding
milestone 2. Neither compliance nor nonconformance has been established.

A future assessment should distinguish source locations actually presented from
operational/context paths retained only in observation records, account for human
and JSON output, and establish whether any source-escape events are missing.
This entry does not authorize a classification change or prescribe a redesign.


## Diagnose execution-ownership cancellations in full-suite runs

Status: diagnosed and corrected under the human-authorized milestone-3 prerequisite
on 2026-09-30. The [diagnosis and regression record](../records/validation/module-investigation/2026-09-30-execution-ownership-diagnosis.md)
reproduces the pending-readiness cancellation while confirming owner settlement
and child exit. All 371 tests pass after correcting the harness. Historical
results and their original uncertainty below remain preserved; exact historical
child-startup timing was not captured.

Added: 2026-09-29
Origin: [Module investigation milestone-1 review](../records/reviews/module-investigation/2026-09-29-milestone-1-disposition.md)
Area: execution ownership and test reliability

The human deferred diagnosis while retaining this unresolved qualification on
milestone validation. A bounded comparison reproduced the review's cancellation
pattern on pre-implementation baseline
`c15afdd3b03f588534ac386c2453c81da71ffb68` and corrected implementation
`f5a974d364245a3c19f4afe70d8e5f92c1807729`. The pattern predates investigation
implementation, but its cause and any production implications remain unknown.

Reproduce in separate checkouts with Node.js 22.13.1 and the pinned dependencies.
After `npm run build`, run these separately to distinguish isolation from the
full suite (the symptom is intermittent; a pass does not resolve it):

```sh
node --test _build/test/execution-ownership.test.js
node --test _build/test/*.test.js
```

Captured comparison results:

| Checkout | Isolated execution ownership | Full suite |
| --- | --- | --- |
| Pre-implementation baseline | 13 passed, 0 cancelled | 283 passed, 0 failed, 13 cancelled; 296 total |
| Corrected milestone 1 | 13 passed, 0 cancelled | 318 passed, 0 failed, 13 cancelled; 331 total |

All 13 tests in `test/execution-ownership.test.ts` were affected: Git deadline/
escalation/exit, unconfirmed cleanup, worker interruption during opening and
validation, unexpected worker exit, worker send/close/late settlement, opening
timeout/invalidation, interrupted publication, worker cleanup bounds, Git output
limits, and failed spawn handling. The first test reported
`Promise resolution is still pending but the event loop has already resolved`
after approximately 364 ms on the baseline; the remaining 12 were cancelled by
the parent. The reviewer also saw 13 cancellations in one full run, followed by
successful isolated and full runs.

The [validation record](../records/validation/module-investigation/2026-09-29-milestone-1-review-corrections.md)
preserves runtime, chronology and comparison limits. Local scratch logs are
`_investigation/baseline-ownership.log`, `baseline-full.log`,
`current-ownership.log` and `current-full.log` in that directory; the durable
results above do not depend on those uncommitted files being retained.
Investigate the unresolved cause without treating isolated passes as a fully
passing suite or assuming a load-related explanation. This entry does not
authorize a cancellation-policy change.

Milestone-2 integration development reproduced the same 13 cancellations in a
359-test full run: 346 passed, zero failed, 13 cancelled, approximately 128.3
seconds. The first execution-ownership test reported the same pending-promise/
event-loop error after approximately 349.6 ms; the other 12 were cancelled by the
parent. An earlier 357-test development run passed all tests. The
[milestone-2 validation](../records/validation/module-investigation/2026-09-29-milestone-2.md)
records the later 360/360 complete run and the final 13/13 isolated ownership run
separately, alongside the final focused integration checks. This is another
observation of the deferred concern, not a diagnosis or a change in its disposition.

The milestone-2 reviewer ran the pinned target `a396f9b8e9b38ad344554cbe4c0e7677ded1ec0e`
three times: 360 passed, zero failed or cancelled each time (about 125.5, 121.0
and 117.4 seconds). These passes do not diagnose the concern. The human renewed
qualified deferral through milestone 2 after that review, with diagnosis required
before milestone 3's live, cost-bearing adapter work. The new parent-side dialogue,
abort and usage state increases the importance of resolving the ownership concern
before relying on live interruption and cleanup. See the
[milestone-2 findings](../records/reviews/module-investigation/2026-09-29-milestone-2-round-1-findings.md).

## Consider grouping investigation operations in one dialogue

Added: 2026-09-29
Origin: module investigation discussion of reusable operations and composite lenses
Area: investigation execution and efficiency

The [operation/lens separation](decisions/investigation-operations-and-lenses.md)
allows evaluation to identify investigation work independently of its consuming
lenses. The [module investigation slice](plans/module-investigation.md) executes
each missing operation in a fresh dialogue.
Assess whether grouping several selected operations in one dialogue improves
context reuse, latency, or usage sufficiently to justify the added complexity.

Define submission and outcome boundaries, independent success or failure,
execution limits, usage attribution, and the effect of shared context on
citation indexes and correction eligibility. Preserve qualified results and
operation provenance, and compare interpretive quality with separate dialogues;
selecting several operations does not itself require grouped execution.

## Provide Git history as investigator evidence

Added: 2026-09-29
Origin: module investigation scope discussion before implementation
Area: investigation evidence and historical context

The [product design](../foundation/product-design.md#32-summary-as-initial-view-and-recursive-navigation)
allows summaries to draw on history, while the initial
[module investigation slice](plans/module-investigation.md) excludes it.
Make relevant history available through the subject-based evidence interface
to help explain how code acquired its current shape and recorded rationale.
A bounded starting point could expose changes affecting a module and selected
commit messages and diffs, without requiring a general history lens.

Preserve revision identity, distinguish historical evidence from current source,
and qualify commit messages as recorded assertions. Make retrieval bounds and
unavailable history explicit. Reuse the investigation assessments to evaluate
the effect on explanatory value, evidence selection, usage, and latency;
reassess prompts when adding history access and tune them if findings warrant
it.

## Correct output boundaries across different filesystem case rules

Added: 2026-09-28
Origin: foundation-readiness M3 review, O1 and O2; explicitly deferred by the human when accepting M3
Area: generated-output evidence boundaries

The current case probe assumes one rule per device and folds an entire lexical
path according to its resolved parent's rule. A controlled filesystem model
confirms two defects: directories with different case rules on one device can
cause generated output to be missed or source to be excluded (O1); a sensitive
lexical prefix linked into an insensitive filesystem can exclude a distinct
case-differing sibling (O2). The local APFS checks do not exercise either layout.

Correct these while preserving shared compiler/repository exclusions, alias
counting, missing suffixes, original path spellings and replay invalidation.
Unknown explicit boundaries must still fail visibly rather than use a guessed
rule. Component-specific case observation needs assessment, including directories
that offer no usable spelling probe. This entry is a deferred concern, not platform
certification or authorization to implement. See the
[M3 disposition](../records/reviews/foundation-readiness/2026-09-28-m3-acquisition-lifetime-disposition.md)
and [preserved model evidence](../records/validation/foundation-readiness/2026-09-28-m3-round-2.md).

## Assess reference-lifetime disclosure in existing views

Added: 2026-09-26
Origin: module investigation review and reference-lifetime disclosure decision
Area: presentation and session references

Assess views introduced by earlier slices against the
[reference-lifetime disclosure requirement](decisions/reference-lifetime-disclosure.md):
when references expire before they can be used as subjects of a subsequent
request, their surrounding presentation must make that limitation clear.
Check one-shot output in particular and bring nonconforming presentations into
conformance. A shared notice can cover affected references; ordinary follow-up
references in a continuing session need no repeated caveats.

The earlier implemented slices to assess are:

- [Initial module inventory](plans/initial-module-inventory-plan.md): module lists,
  module inspection, exports, and forwarding relationships.
- [Repository organization](plans/repository-organization-plan.md): repository
  and project organization views, group inspection, and membership references.
- [Module dependencies](plans/module-dependencies-plan.md): dependency overview,
  direct dependencies and dependents, and references in supporting source detail.
- [Transient interactive session shell](plans/transient-session-shell.md): shared
  presentation and help for one-shot commands versus continuing shell sessions.

Cover human and JSON output, including ambiguous-selection results, as these
views currently behave after the shell integration.

Conformance is currently unknown. The potential impact is confusion about which
displayed references support further navigation, rather than a change to
reference binding or the underlying program claims. This is a deferred usability
assessment, not a prerequisite for the module investigation slice.

## Retry failed or incomplete interpretation without restarting the session

Added: 2026-09-24
Origin: module investigation planning discussion
Area: investigation execution and recovery

Module investigation retains investigation-failure and
execution-limit outcomes; repeating a command displays those outcomes rather than
invoking the investigator again. Communication/service failures leave no reusable
outcome, so later requests already proceed through ordinary selection in the same
shell. This candidate concerns explicit retry of retained outcomes, whose current
recovery requires restarting the shell and losing accumulated investigation context.
Consider supporting that retry if formative use establishes its value. Define
which outcomes qualify, how retained evidence and accepted results are used, and
which attempt is displayed afterward. Preserve earlier outcomes and qualification;
a retry does not itself establish that earlier claims are superseded. This concerns
interpretation requests, not a change to existing mechanical-analysis retry rules.

## Explicitly rerun a successful interpretation

Added: 2026-09-24
Origin: module investigation planning discussion
Area: investigation execution and retained results

Module investigation reuses a retained successful result when
its command is repeated. Consider whether an explicit action to regenerate a
successful interpretation would be useful; no concrete need has yet been
established. Distinguish regeneration from inspecting a retained result, following
up on a new target, and displaying an explicit correction. Any later design must
account for inference cost and preserve earlier results without treating a newer
generation as automatically more correct. This is separate from retrying failed
or incomplete interpretation.

## Investigation usage and budgeting support

Added: 2026-09-24
Origin: module investigation planning discussion of execution containment and usage allowances
Area: investigation usage and budgeting

Consider user-set allowances for hosted inference, separate from the per-evaluation
mechanism that contains runaway investigations. Module investigation
includes basic per-investigation and session usage reporting, with explicit coverage
limits, but no budgeting interface. Future support could use those measurements
to prevent a new investigation from starting once an allowance is exhausted,
at coarse granularity without interrupting work in progress.
Define allowance scope, configuration, measured units, and enforcement limitations;
a token allowance is not a guaranteed monetary ceiling, and admission checks can
permit an in-flight investigation to exceed the remaining allowance.

Local inference may remove the need for provider-spending controls, but runaway
containment remains useful for responsiveness and resource use. Keep that mechanism
independent of budgeting support so it applies to either hosted or local execution.
Retain available provider usage metadata without assuming every integration reports
the same measures or supports precise cost accounting.

## Reconsider investigrams after context corrections

Added: 2026-09-25
Origin: module investigation planning discussion of citation exposure
Area: investigation revision and qualification

Consider an explicit reconsider operation for accounts marked as needing
reconsideration after cited context changes. Module investigation records
conservative citation indexes and discloses direct and transitive warnings, but
provides no clearing operation. Evaluate the need using correction frequency,
citation breadth, and the practical burden of uncleared warnings.

A reassessment could retain a new account or record that the earlier account remains
unchanged against specified updated context. Preserve the original investigram and
record the reassessment basis. Define how clearing a cause affects downstream
warnings without erasing independent causes or implying downstream reassessment.
Track no-change outcomes as a possible sign of overly broad citation exposure,
not proof that the original citations were irrelevant. Investigator-reported
relevance may eventually refine selection while the full history of context
supplied to the investigator remains available as provenance.

## Investigate multi-project repositories

Added: 2026-09-25
Origin: human request to understand interrelated projects in a monorepo
Area: project scope and repository-wide investigation

PostCode currently opens one configured project per session, even though the
enclosing repository may contain several related projects. Investigate how to
identify and present those projects as useful organizational boundaries while
also reasoning about the behavior and dependencies of the collection as a whole.
Account for relationships that cross project boundaries, shared or overlapping
module populations, and differing project configurations without treating
repository layout alone as proof of a project's semantic boundary. Preserve the
scope and evidence behind both project-level and collection-level conclusions.

## Review the investigation UI and UX as a whole

Added: 2026-09-23
Origin: human exploratory use of the completed interactive session on another repository
Area: presentations and interaction

The session works, but repeated use makes the current views difficult to read:
output is too wordy, important information is hard to find, and presentation
choices that were tolerable for one-shot commands compound across an
investigation. Evaluate the full journey across inventory, organization,
dependencies, inspection, qualifications, source detail, and shell interaction
before making isolated formatting changes. Identify what deserves immediate
attention, what should be progressively disclosed, and what belongs in a later
visual interface. Preserve precise navigation, evidence, qualifications, and
consequential omission disclosure while improving readability.

The [milestone-4 progressive assessment](../records/validation/module-investigation/pass-04/report.md)
adds captured examples: repeated full accounts and accounting/evidence metadata
obscure what changed; investigram source-detail views can supply artifact paths
and metadata without checkable excerpts or line positions; and standalone captured
interpretive views omit effective compiler/configuration attribution that is
available in the surrounding assessment record. Consider readable, bounded
evidence navigation and concise provenance in the whole-journey review. These
are formative observations, not measured human usability results or authorization
for a presentation redesign.

The [milestone-5 integrated assessment](../records/validation/module-investigation/pass-05/report.md)
adds original/current account distinctions, causal warning pages and explicit
conflicts to this journey. Assess whether repeated empty revision status obscures
important warnings, and how users discover qualifications learned in follow-ups
when the retained summary has no explicit correction. Preserve exact historical
selection and avoid implying automatic synthesis or reassessment. These remain
formative concerns, not a request to tune the current assessment. The
[focused dependent-account sequence](../records/validation/module-investigation/pass-06/report.md)
again exposes absent excerpts and dense repeated context. Its evaluator distinguishes
compatible replacement accounts from the structural “conflicting alternatives”
label, and local exact selection from family primary, but finds the wording demanding.
Use these captures as further qualitative evidence for the same journey review,
without implying measured misunderstanding or authorizing current-slice redesign.

## Investigate analysis parallelism and asynchronous I/O

Added: 2026-09-24
Origin: human observation that PostCode appears to use one CPU during analysis
Area: analysis execution and responsiveness

Both CLI entry paths run one command at a time in one analysis worker. TypeScript program construction and much of discovery use synchronous compiler APIs; repository capture and input probes retain synchronous filesystem reads. The [foundation-readiness plan](plans/foundation-readiness.md) has introduced parent-owned asynchronous Git execution and cancellation. Its remaining processing work removes repeated scans through local indexes; it does not establish general analysis parallelism.

After that slice, measure remaining CPU use and stage-level wall time on representative projects to identify work that could run independently or overlap without changing results. Account for the implemented parent/worker execution model and asynchronous Git ownership.

Evaluate further parallel analysis or asynchronous I/O against worker startup and communication, memory use, deterministic output, captured-input consistency, session reference bindings and cancellation. Do not assume that asynchronous reads accelerate CPU-bound compiler work. Use the [completed latency investigation](../records/validation/2026-09-21-analysis-latency.md), the [processing audits](../records/audits/2026-09-27-foundation-readiness/README.md), and the foundation plan's integrated measurements as evidence, accounting separately for opening, first use, reuse and full CLI publication.

## Evaluate independent TypeScript versions for building and analysis

Added: 2026-09-14
Origin: human-directed process review of implementation conventions
Area: toolchain and TypeScript language integration

The current dependency layout uses one installed TypeScript version both to build and type-check PostCode and to analyze subject projects at runtime. Evaluate whether to separate those roles so the build-time compiler can evolve for development convenience while the runtime analyzer remains deliberately pinned and changes only with semantic fixtures and analysis-identity review. Preserve a clear account of which analyzer version establishes each result. If the roles are separated, revise the implementation convention so build-only TypeScript upgrades no longer require runtime-analyzer semantic verification.
