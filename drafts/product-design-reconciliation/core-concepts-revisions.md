# Proposed revisions to docs/core-concepts.md

## Investigram: replace the term-level decision link and first two definition paragraphs

*[decision: [Allow structured investigram content](decisions/structured-investigram-content.md#permit-structured-interpretation)]*

An **Investigram** is an immutable, addressable artifact of program investigation containing a qualified interpretation. It includes the following information:

- <a id="interpretation-content"></a>**Interpretation content** — the substantive content of the interpretation. It may contain multiple related [claims](#claim), expressed in prose, structured content, or a combination, including prose within a structure.
- **Referent information** — what the interpretation concerns in its program context. It may include references to specific [subjects](#subject); a referent may span entities or identify captured source.
- **Evidence context** — the supporting [evidence](#evidence) and its relationship to the interpretation's claims.
- **Provenance** — the operation and selected subject that produced the investigram, together with its originating program context and supporting method.
- **Qualifications** — the claims' [Claim context](#claim-context), including evidence attribution, provenance and method, scope, epistemological status or guarantee, and limitations. Qualifications remain attributable to the claims or portions they qualify; they need not apply uniformly to all content.

Investigrams can be associated with the subjects they describe for subsequent inspection and investigation. [[Subject associations](decisions/investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results)]

## Evidence: append to the second paragraph

Source acquisition and agent access are distinct from human presentation. Human-facing attribution, intelligible source-derived assertions and implementation mappings preserve provenance and epistemological status without requiring source-language literacy; captured source can remain available through defined machine evidence interfaces. [[Human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary)]

## Expansion: replace its second paragraph

Standard expansions concern the subject kind's presentation semantics, independently of the Lens that selected the subject. Supporting implementation detail can include evidence attribution and mappings, subject to the human output boundary. [[Human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary)] Exposing another Lens's answer may add its Projection to a coordinating Presentation or embed another View. Requesting that answer goes through Evaluation and core construction; presenting an already supplied result does not require reevaluation. Inline placement alone does not make an additional Lens question a standard expansion. Dependency children and dependency parents, for example, remain separately meaningful Lens questions rather than standard module expansions. [[Coordinated expansion](decisions/coordinated-views-and-qualified-results.md#keep-evaluation-and-qualified-construction-independent-of-presentation)]
