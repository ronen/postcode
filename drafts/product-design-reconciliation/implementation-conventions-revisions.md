# Proposed revisions to docs/implementation-conventions.md

## In “Source-detail presentation,” insert before the existing bullets

The current implementation's syntax-oriented escape is replaced by `--more-details` through [human-representation reconciliation](plans/product-design-reconciliation.md#implementation-specification). Preserve captured evidence and source mappings for analysis and agent access while applying the [human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary) to every human delivery path. Existing schema strings and display bounds do not establish semantic adequacy. Preserve intelligible assertions, labels and evidence with provenance and epistemological status; source origin alone is not a reason to suppress content.

## In that section, replace the bullet beginning “Group source detail includes”

- Group attribution detail can identify captured absolute repository/group paths and repository-relative artifact paths and metadata, without requiring source-language literacy. Intelligible assertions or evidence originating in source can also be presented with their qualifications. Record actual attribution disclosure separately from agent evidence acquisition and human inadequacy feedback.

## In that section, replace the three consecutive bullets beginning “Expose source detail only,” “Preserve module and export containment,” and “Expand a narrow compiler span”

- Human expansions may expose intelligible assertions, evidence and implementation mappings with provenance and epistemological status. They must not require the human to decipher source syntax to understand the answer. Do not use source origin or code-like spelling as a blanket exclusion rule. Apply the same semantic contract to public text/JSON and retained presentation while preserving source-bearing evidence internally and for agents. [[Human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary)]
- Preserve module and export containment in evidence organization, and distinguish forwarding declarations from semantic-symbol definitions in the acquired support and mappings.
- When acquiring evidence, a narrow compiler span can expand to its enclosing statement to make the evidence intelligible to analysis and agents, keeping it bounded and qualified. Acquisition bounds do not establish human intelligibility: display useful meaning with qualification, and disclose a representation limit rather than require code deciphering.

## In “Local observation sink,” replace the bullet beginning “Include the session identifier”

- Include the session identifier and command order in each self-contained batch; the one-shot command ordinal is 1. Record the command outcome and actual stdout/status stderr. Distinguish expected analysis failure (`failed`/`command-failed`) from an unexpected defect (`defect`/`command-defect`). A command without a View must not emit a view-produced event. Apply the human-output and representation-limit observation contract to View and non-View output; source acquisition is not a human source-escape event. Preserve historical event meanings.

## In “Local observation sink,” replace the bullet beginning “Treat local observation files as potentially sensitive”

- Treat local observation files as potentially sensitive because they can contain repository context, selection inputs, documentation, qualifications, the qualified View artifact and exact rendered output. Files may contain intelligible source-derived evidence and historical source detail. Actual output, including inadequate representations, must not be erased from its observation record. Create new sink, project and date directories with mode `0700` and files with mode `0600`; leave permissions of pre-existing directories under their owner's control.

No development instruction under `dev/` changes. Other implementation conventions, including captured support, retained-answer continuity, source coordinates, control-character escaping, output exclusions and acquisition rules, remain applicable.
