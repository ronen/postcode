# Architectural Constraints

This document states PostCode's current binding, cross-cutting architectural constraints. It is the concise operational source for rules that implementations must preserve across plans and slices. Accepted [decision records](decisions/) preserve why these constraints were adopted or changed.

The constraints conform to the adopted [product design](../foundation/product-design.md) and use the governing terminology in [core concepts](core-concepts.md). They do not describe the implementation, repeat routine implementation conventions, or collect every consequence of every accepted decision. Descriptive implementation architecture belongs under [`docs/architecture/`](architecture/), and repeatable mechanical practices belong in [implementation conventions](implementation-conventions.md).

Substantive changes require explicit human agreement and a corresponding accepted decision record, with both updated in the same commit. Follow the [development workflow](../dev/workflow.md#documentation-and-decisions) when changing this document. If this document and an accepted decision disagree, treat the inconsistency as an unexpected finding rather than silently choosing or reconciling them.

The initial architectural constraints have not yet been adopted. They will be populated through an upcoming accepted decision.
