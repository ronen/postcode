# Proposed revisions to docs/architectural-constraints.md

## Add to “Views and analysis boundary”

Add the following bullets after the existing two bullets. Retain both existing
bullets and their decision provenance.

- For module, organization, dependency and investigation Projection families, including subject-associated investigram inspection, arrangement in every current or future Presentation, including the GUI, consumes the qualified information selected for its Projection. It must not independently query accumulated session state to broaden or refresh that information. New selection or refresh returns through core construction. This boundary permits projection-scoped lazy materialization and presentation pushdown when Lens meaning, population, qualification, evaluation materialization and retained-result semantics are preserved; it does not require eager resolution or separately stored processing stages. [[Qualified construction and arrangement](decisions/qualified-projection-construction.md#separate-qualified-construction-from-arrangement)]
- For these Projection families, arrangement may use a narrowly scoped, session-owned reference-binding capability to allocate or return compact spellings for explicit record IDs and kinds supplied by the core for its Projection, including navigable support. Validate requests against that supplied reference population before allocation and preserve established append-only bindings. The capability returns only bindings; it must not expose selector lookup, record retrieval, session enumeration, evaluation or content refresh. Reference binding must not broaden the selected information. [[Qualified construction and arrangement](decisions/qualified-projection-construction.md#separate-qualified-construction-from-arrangement)]

## Add to “Source evidence and disclosure”

Add the following bullet after the existing source-disclosure recording bullet.
Retain both existing bullets and their decision provenance.

- Holding or passing resolved core content internally is not source disclosure. Any Presentation, including CLI and GUI Presentations, that exposes source from that content must do so through a View whose actual disclosure is classified and recorded. Classification covers the source actually exposed by that Presentation, including expansions and exports; access to core content does not exempt an interface from source-disclosure recording. [[Qualified construction and arrangement](decisions/qualified-projection-construction.md#separate-qualified-construction-from-arrangement)]
