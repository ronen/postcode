# Architectural Constraints

This document states PostCode's current binding, cross-cutting architectural constraints. It is the concise operational source for rules that implementations must preserve across plans and slices. Accepted [decision records](decisions/) preserve why these constraints were adopted or changed.

The constraints conform to the adopted [product design](../foundation/product-design.md) and use the governing terminology in [core concepts](core-concepts.md). They do not describe the implementation, repeat routine implementation conventions, or collect every consequence of every accepted decision. Descriptive implementation architecture belongs under [`docs/architecture/`](architecture/), and repeatable mechanical practices belong in [implementation conventions](implementation-conventions.md).

Substantive changes require explicit human agreement and a corresponding accepted decision record, with both updated in the same commit. Follow the [development workflow](../dev/workflow.md#documentation-and-decisions) when changing this document. If this document and an accepted decision disagree, treat the inconsistency as an unexpected finding rather than silently choosing or reconciling them.

## Claims and qualification

- Preserve each claim's evidence or source references, provenance and method, scope, epistemological guarantee, and limitations throughout evaluation, projection construction, transformation, storage, comparison, caching, and presentation. Shared context must remain attributable, and narrower qualification must not be erased.
- Derive a claim's epistemological status from its evidence and method. Confidence expressed by a person, heuristic, or generative model does not strengthen the claim.
- Do not strengthen or broaden a claim when transforming, aggregating, caching, comparing, or rendering it.
- Keep mechanically derived facts, recorded assertions, observations, and interpretations distinguishable in domain representations and human-facing views.
- Keep consequential qualification visible in the human-facing view. A weaker, partial, historical, asserted, observed, or inferred claim must not masquerade as a stronger one.
- Prefer explicit unavailability, refusal, partiality, or limitation to plausible unsupported output.

## Evaluation and failure

- Keep analysis applicability and availability, execution state, result materialization, and epistemological status distinct. Additional work or successful execution does not inherently make a produced claim truer or more exact.
- Preserve usable qualified information from partial, stopped, or failed evaluation when the analysis method permits it. Do not make an absent result indistinguishable from an established empty result.
- Keep expected operational failures, unexpected defects or broken invariants, successful results containing diagnostics or limitations, and evaluation failures that prevent the intended result distinct. Do not convert an unexpected defect into an ordinary analysis outcome merely to continue execution.
- Preserve meaningful domain distinctions until presentation. Presentation may format or progressively disclose information, but must not collapse distinctions that affect what the result means or what may safely be concluded from it.
