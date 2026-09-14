# Adopt qualification and evaluation constraints

Status: accepted
Decided: 2026-09-14
Arising from: the adopted [product design](../../foundation/product-design.md) and [initial module inventory plan](../plans/initial-module-inventory-plan.md)
Scope: claims, projections, evaluation, and failure handling across PostCode

## Context

PostCode must present useful information derived from sources with materially different epistemological force, including mechanical analysis, recorded assertions, observations, and interpretation. Analyses may also be unavailable, partial, stopped, or failed while still producing useful qualified information. These cases cannot be represented honestly if claim strength, execution outcome, and result materialization are collapsed into a single success state.

The adopted product design establishes the epistemological contract and the dimensions of resource-bounded analysis. The initial projection architecture and module-inventory decisions apply those requirements through Claim context, evaluation outcomes, projections, and explicit failure boundaries. The cross-cutting invariants demonstrated by that work now need to govern later slices without making the initial TypeScript representation or API shapes universal.

## Decisions

### Preserve claim qualification throughout processing and presentation

#### Decision

Every claim retains attributable evidence or source references, provenance and method, scope, epistemological guarantee, and limitations throughout evaluation, projection construction, transformation, storage, comparison, caching, and presentation. Shared qualification may be represented once, but narrower qualification must remain attributable and must not be erased.

A claim's epistemological status follows from its evidence and method, not from confidence expressed by a person, heuristic, or generative model. Transforming, aggregating, or presenting a claim must not strengthen or broaden it.

Mechanically derived facts, recorded assertions, observations, and interpretations remain distinguishable in domain representations and human-facing views. Consequential qualification remains visible to the human. Explicit unavailability, refusal, partiality, or limitation is preferable to plausible unsupported output.

#### Rationale

PostCode is intended to substitute qualified conceptual representations for routine source inspection. That working surface is trustworthy only if users can tell what each result establishes and weaker information cannot acquire apparent authority as it moves through the system.

#### Alternatives considered

- Preserve qualification only in internal metadata: rejected because information that is not visible in the human-facing view cannot prevent a weaker claim from masquerading as a stronger one.
- Let later processing assign a stronger status when an explanation appears convincing: rejected because confidence or synthesis is not evidence establishing the stronger claim.
- Apply qualification only to interpretations: rejected because mechanical analyses can also be partial, historical, scoped, or limited.

#### Consequences

- Domain and presentation representations must preserve enough structure to keep claims and their qualifications attributable.
- Summaries and other lossy presentations may omit detail but cannot conceal consequential changes in claim strength, coverage, or limitation.
- Generative explanations remain interpretations unless evidence and a defined method independently establish a separate claim.

### Keep evaluation, materialization, and failure distinctions explicit

#### Decision

Keep analysis applicability and availability, execution state, result materialization, and epistemological status distinct. Successful execution or additional work does not inherently make a produced claim truer or more exact.

Preserve usable qualified information from partial, stopped, or failed evaluation when the analysis method permits it. An absent result remains distinguishable from an established empty result.

Keep expected operational failures, unexpected defects or broken invariants, successful results containing diagnostics or limitations, and evaluation failures that prevent the intended result distinct. Do not convert an unexpected defect into an ordinary analysis outcome merely to continue execution. Preserve all distinctions that affect what a result means or what may safely be concluded until presentation; presentation may format or progressively disclose them but must not collapse them.

#### Rationale

Execution describes what happened while attempting work; materialization describes how much requested information was produced; epistemological status describes what may be concluded from that information. Collapsing these dimensions would either discard useful partial results or present absence and failure as knowledge. Treating defects as expected outcomes would conceal broken invariants and make results appear more reliable than the implementation warrants.

#### Alternatives considered

- Represent evaluation as binary success or failure: rejected because stopped or failed work may retain useful partial results, while successful execution may establish an empty or limited result.
- Discard all output from an incomplete evaluation: rejected because qualified partial information can remain useful and truthful.
- Treat diagnostics as failure of the whole result: rejected because a result may succeed while carrying limitations or diagnostics relevant to only part of its scope.
- Convert unexpected defects into unavailable or failed analysis outcomes: rejected because doing so would hide implementation faults behind an expected domain state.

#### Consequences

- Evaluation outcomes may exist without produced claims, and claims may remain available from an evaluation that did not fully complete.
- Projection-level information must explain both produced content and consequential absence.
- Implementations need explicit defect boundaries rather than catch-all conversion into ordinary result states.
