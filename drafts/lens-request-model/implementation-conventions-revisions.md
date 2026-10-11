# Proposed revisions to docs/implementation-conventions.md

## Replace the first bullet in “Qualified construction and arrangement”

- Keep the current module, organization, dependency and investigation core content independent of CLI limits, terminal fitting and format/source choices. Resolve fixed retained references before arrangement; subsequent history changes require another core selection. [[Construction boundary](decisions/qualified-construction-under-the-request-model.md#preserve-qualified-construction-and-arrangement-isolation)]

## Replace the third bullet in “Qualified construction and arrangement”

- Carry the investigation View's usage-independent arrangement key in the worker envelope. Finalize usage with that explicit key; do not add it to public JSON or reconstruct it from a bounded View. Usage reports and resolution results use explicit non-View alternatives and require no descriptor or arrangement key for a fabricated Projection. [[Identity separation](decisions/qualified-construction-under-the-request-model.md#separate-answer-view-and-report-identity)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]
