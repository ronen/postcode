# Core Concepts

This document states PostCode's governing cross-cutting architectural terminology and the relationships necessary to define it. It says what the terms mean now; accepted [decision records](decisions/) preserve why the concepts were adopted or changed. It conforms to the adopted [product design](../foundation/product-design.md), which governs product direction rather than implementation architecture. Binding cross-cutting rules that implementations must follow are stated separately in [architectural constraints](architectural-constraints.md).

This document is not an exhaustive ontology or an inventory of implementation types. It defines only concepts and distinctions that need to remain stable across plans and slices. It does not prescribe classes, interfaces, schemas, storage, module boundaries, or language-specific representations unless such a constraint is itself explicitly adopted as a core concept.

Semantic changes require explicit human agreement and a corresponding accepted decision record, with both updated in the same commit. Follow the [development workflow](../dev/workflow.md#documentation-and-decisions) when changing this document. If this document and an accepted decision disagree, treat the inconsistency as an unexpected finding rather than silently choosing or reconciling them.

The initial core architectural concepts have not yet been adopted. They will be populated through an upcoming accepted decision.
