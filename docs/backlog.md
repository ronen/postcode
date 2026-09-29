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
