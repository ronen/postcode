# Module dependency integrated instrument validation

Date: 2026-09-17
Task: [Module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Plan: [Approved plan](../../../docs/plans/module-dependencies-plan.md)
Initial integrated target: `29380ac` (full hash in the capture summary)
Corrected presentation target: `f7c13495d433e24e3994afc7b3a02000483f1199`
Final navigation/ownership wording: `3d8d5349ad604225963094eecb0cb4cd0d31372a` (subsequent wording-only correction)

## Conditions and retained evidence

All investigated programs were analyzed read-only with Node 22.13.1 and the pinned
TypeScript 6.0.3. No investigated target code, build, or install script was executed.
The actual CLI excluded this checkout's `_build` and `_observations` locations.

The [capture summary](2026-09-17-instrument/capture-summary.json) retains commands,
exit codes, process elapsed times, snapshots, configured population summaries,
and navigation selections for 23 fresh CLI invocations. Those invocations used the
normal local observation sink. The [corrected capture summary](2026-09-17-instrument/final-capture-summary.json)
retains nine further captures at the corrected presentation target. These used a
fresh Node process per invocation with the CLI's injected observation sink so the
qualified view and rendered output could be checked together; their timers measure
`runCli` after module loading, not whole process launch. The
[observation checks](2026-09-17-instrument/observation-checks.json) preserve selected
exit, source-disclosure, and exact-rendered-artifact checks. Multi-megabyte duplicate
JSON envelopes are not committed; the retained Unicode views and structured
summaries identify this limitation.

Capture command paths identify the historical invocation environment, not durable
selectors or a requirement that its disposable checkout still exists. The representative
input is the committed [journey fixture](../../../fixtures/dependency-journey/tsconfig.json).
The exceptional boundary fixture's complete [input contents](2026-09-17-instrument/boundary-inputs.json)
are retained and can be recreated under any temporary Git repository. Its first
capture accidentally inherited this checkout's ESM package context, so extensionless
requests did not resolve. Adding its explicit CommonJS package context corrected the
fixture, without changing implementation. The [initial inputs](2026-09-17-instrument/boundary-inputs-initial.json)
and evaluator A's initial response preserve that failed validation setup; its three
initial timings in the capture summary must not be read as successful cycle/depth
validation. Subsequent boundary captures establish the intended exceptional graph.

The unfamiliar repository is [TypeStrong/ts-node at the surveyed revision](https://github.com/TypeStrong/ts-node/tree/ddb05ef23be92a90c3ecac5a0220435c65ebbd2a).
Its dependencies were previously installed with scripts disabled. As approved,
validation uses the copied configuration with `importsNotUsedAsValues` removed and
`ignoreDeprecations: "6.0"` added. The original opening still fails with TS5107 and
TS5102, retained [verbatim](2026-09-17-instrument/tsnode-original-opening.stderr.txt).
Parsing original and adapted configurations again establishes exactly the same
66 configured root files. See the [earlier investigation](2026-09-16-commonjs-review-investigation.md)
for setup and the governing recognition evidence.

## Implementing-agent checks

Type checking and the complete **188-test suite pass** at the final wording target.
Tests cover exact provider evidence, graph and expansion semantics, Unicode/JSON
selection, scoped navigation, opacity, three-member cycles without invented edges,
depth/component bounds, conceptual/source separation, request/coverage rows,
source-escape observations, terminal controls, and deterministic identity.
`git diff --check` passes. Prior checks remain in their historical records.

The six-module journey establishes one root, two branches, a shared child with two
direct parents, and a re-export intermediary. Executed children, parents, and
inspection commands reproduce the structure snapshot and select the intended precise
IDs. The corrected [structure](2026-09-17-instrument/final-journey-structure.txt),
[children](2026-09-17-instrument/final-journey-children.txt),
[parents](2026-09-17-instrument/final-journey-parents.txt), and
[inspection](2026-09-17-instrument/final-journey-inspect.txt) preserve the journey.
The [boundary view](2026-09-17-instrument/final-boundary-structure.txt) demonstrates a
root cycle, isolated module, opaque external endpoint, and explicitly pruned chain.
It retains 14 projection modules and 12 relationships in analysis, while Unicode
omits two modules and two relationships and prunes one further descent.

PostCode establishes 48 project modules plus 12 opaque endpoints in its dependency
projection, 280 relationships, 17 root components, and one project SCC. Its full
lookup population contains 204 discovered modules. The corrected
[project view](2026-09-17-instrument/final-postcode-structure.txt) discloses one omitted
module and 80 omitted relationships at the 200-edge Unicode bound. A selected `cli`
module has 16 direct children; its scoped inspection reproduces the same snapshot.
The other module also bearing the generated handle `cli` remains a distinct ID.
The dedicated parent view establishes 30 incoming relationships for the selected
`records` module. These are bounded structural facts, not architectural judgments.

Adapted ts-node establishes 64 project modules and 30 opaque endpoints, 263 direct
relationships, 30 root components, and three project SCCs. Recognized requests with
no edge remain separate: 20 outside-population, 17 unresolved, 13 target-indeterminate.
There are separately 44 ownership-unestablished recognition-coverage outcomes.
Its corrected [structure](2026-09-17-instrument/final-tsnode-structure.txt) discloses
one omitted module and 63 omitted relationships; the selected
[child view](2026-09-17-instrument/final-tsnode-children.txt) shows 19 relationships
and 12 non-edge results without display omissions. Source escape and observation
checks passed. Organization remains qualified/partial where external endpoints
have no established repository-layout comparison.

The final [production provider probe](2026-09-17-instrument/tsnode-provider.json)
reproduces all **21 surveyed core CommonJS calls**: 8 resolved, 5 outside-population,
5 unresolved, and 3 target-indeterminate. Both surveyed internal module pairs retain
CommonJS plus adjacent import-type evidence, and neither aggregate is type-only.
The index-to-ESM pair additionally retains static-import and re-export mechanisms.
No runtime loader, actual execution, or uniquely undiscoverable relationship claim
is inferred. These results match the approved superseding decision.

## Clean evaluator protocol and responses

The human expressly authorized two fresh evaluator agents. Both began without task
history and were restricted to supplied captured views: no implementation, tests,
plans, prior reviews, or original source files. They did not edit files or execute
investigated software. Later explicit source escape was itself a supplied view.
This was instrument comprehension evaluation, not independent implementation review;
interpretations are not program truth or human gate acceptance.

The fixed questions asked each evaluator to identify roots, shared children and
cycles; explain dependency direction and directness; interpret composition and
organization qualifications; identify display/analysis limits; explain opaque external
and CommonJS/runtime boundaries; and choose a justified precise next investigation.
They were asked to distinguish explicit evidence from inference and report misleading
wording or material friction.

Evaluator A received journey structure/children/parents/inspection and boundary
structure/external-child views (optional boundary JSON was not used). Its
[initial response](2026-09-17-instrument/evaluator-a-initial.md),
[corrected-boundary addendum](2026-09-17-instrument/evaluator-a-addendum.md),
[corrected-presentation response](2026-09-17-instrument/evaluator-a-final.md), and
[final navigation check](2026-09-17-instrument/evaluator-a-navigation.md) are preserved.

Evaluator B received PostCode structure/children/parents/inspection plus journey and
corrected boundary views, followed by ts-node structure/children. Its
[initial response](2026-09-17-instrument/evaluator-b-initial.md),
[ts-node addendum](2026-09-17-instrument/evaluator-b-addendum.md),
[corrected-presentation response](2026-09-17-instrument/evaluator-b-final.md), and
[final navigation/source check](2026-09-17-instrument/evaluator-b-navigation.md) are preserved.
Pre-correction views without the `final-` prefix in the evidence directory preserve
what prompted feedback. Final wording was checked against
[the new journey capture](2026-09-17-instrument/final-wording-journey.txt) and
[the explicit source view](2026-09-17-instrument/final-wording-source.txt).

## Feedback disposition

- **Cycle member arrows — corrected.** A bidirectional separator could invent
  adjacent pairwise edges. Headers now list members with commas, while explicit
  directed edges remain underneath. A three-member fixture pins this distinction.
- **Organization vocabulary — corrected.** All dependency views define same-group,
  strict organization descendants, outward, variation, and unknown outcomes without
  architectural-policy claims.
- **Composition/edge badge ambiguity — corrected.** Module composition is separated
  from relationship mechanisms; focused views identify it explicitly as a module
  property. Full negative composition evaluation no longer adds an irrelevant generic
  composition limitation beneath an unrelated export list.
- **Population and coverage overreading — corrected.** Headers distinguish projection,
  project and discovered lookup populations; full outcomes are explicitly bounded
  source analysis. Root-component meaning is defined.
- **Late or unclear omissions — corrected.** Principal graph omissions appear before
  the graph. Coverage outcomes are individually numbered, reconciling displayed and
  omitted totals. Request results have separate view-local numbers. Further-descent
  wording distinguishes expansion pruning from retained direct child edges.
- **Source navigation and ownership — corrected.** Source-detail actions are explicit,
  fresh evaluation is stated, and a known omitted owner differs from unestablished
  ownership. Scoped selectors retain mismatch rejection. Both evaluators confirm the
  fresh-versus-historical distinction is now clear; evaluator B confirms row-to-source
  correspondence. Numbers cannot be carried between fresh views as identities.
- **Raw target text/locations in ordinary views — intentionally remain source detail,**
  as required by the approved conceptual/source boundary. The explicit escape now
  provides the next step, with non-edge/recognition evidence prioritized in its bound.
  Evaluator B accepted this separation. Bounded call snippets may omit surrounding
  binding declarations; they are supporting evidence, not a complete independent
  proof of every recognition classification.
- **Placeholder and density friction — retained limitation.** Navigation requires
  substituting a precise ID; generic module inspection also accepts handles. Large
  graph overviews remain dense and bounded. No new ranking, contextual lens, caching,
  or architecture inference was introduced to address these observations.

## Cost and remaining limits

Fresh actual CLI invocations on PostCode took **39.225–42.447 seconds** across the
seven measured modes. Six ordinary ts-node samples took **27.131–28.346 seconds**;
one child-JSON invocation took **975.779 seconds**. That outlier is retained, its cause
was not profiled, and these uncontrolled wall-clock samples establish neither a
stable latency distribution nor an upper bound. Corrected fresh-process harness
checks subsequently measured `runCli` at 39.766 seconds for PostCode structure and
26.823–27.634 seconds across ts-node structure/children/source detail. Provider-only
measurement is not interchangeable with full presentation and observation cost.
No caching, partial discovery, scheduler, or target execution was introduced.

Whole-repository captures were repeated at `f7c1349`; the final `3d8d534` changes only
fresh-navigation wording, distinct owner-disclosure wording, the corresponding
presentation method version, tests, and documentation. Those final wordings have
fresh fixture captures and evaluator confirmation; the expensive whole-repository
journeys were not repeated after that wording-only change. Snapshot IDs consequently
differ between capture rounds and must not be treated as successor identities.

The task remains active. This evidence supports final integrated review; it does
not satisfy that review gate or authorize task closure.
