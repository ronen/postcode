# Human-facing architectural representations

Status: in review
Decided: pending human agreement
Arising from: [Product-design reconciliation](../plans/product-design-reconciliation.md) and the adopted [product design](../../foundation/product-design.md)
Scope: source-language-independent human understanding, evidence access, representation limits and research feedback across PostCode
Supersedes:

- [Keep conceptual presentation separate from source escape](initial-module-inventory-decisions.md#keep-conceptual-presentation-separate-from-source-escape), replaced by [the human output boundary](#human-output-boundary) and [additional detail](#additional-detail).
- [Record the actual source-disclosure level](adopt-identity-evidence-and-observation-constraints.md#record-the-actual-source-disclosure-level), replaced by [actual exposure and inadequacy observations](#representation-observations).
- [Provide project structure and focused direct navigation](module-dependency-structure-decisions.md#provide-project-structure-and-focused-direct-navigation), replaced by [dependency navigation with intelligible detail](#dependency-navigation).
- [Keep organization conceptual while preserving bounded source detail](repository-organization-decisions.md#keep-organization-conceptual-while-preserving-bounded-source-detail), replaced by [conceptual organization with intelligible detail](#organization-detail).
- [Defer contemporaneous note capture](initial-observation-recording-decisions.md#defer-contemporaneous-note-capture), replaced by [initial feedback interaction](#initial-feedback-interaction) and [feedback observations](#feedback-observations).

## Context

The source-escape interaction offers source excursions when conceptual representations are insufficient. This conflicts with the [adopted product design](../../foundation/product-design.md), which supports humans with architectural and computational understanding without requiring knowledge of the implementation language. Its restriction is semantic, not a ban on text originating in source artifacts. Reading a declaration to reconstruct a contract is not an adequate human representation; reading an intelligible recorded assertion from a comment can be.

Source acquisition, machine evidence delivery and human representation have distinct purposes. Preserving source for analysis and coding agents is necessary; removing useful source-derived meaning from the human surface would undermine the product. Encoding alone establishes neither audience nor intelligibility.

[Application specification boundaries](application-specification-boundaries.md), [coordinated Views](coordinated-views-and-qualified-results.md) and the [experimental-output policy](experimental-structured-outputs.md) preserve source obligations by reference; those references follow the mappings above. Their architecture, lineage, lifecycle and output-evolution decisions remain accepted. Source-navigation lineage still records available provenance, including historical navigation; it does not require a new source browser.

Evidence acquisition decisions, bounded CommonJS recognition, source facets and supporting expansions remain accepted. Supporting detail remains distinct from another Lens question.

## Decisions

<a id="human-output-boundary"></a>
### Establish the human representation boundary

Human understanding must not depend on programming-language source or syntax. This applies to the meaning conveyed through Views, explanations, documentation, evidence detail, qualifications, corrections, diagnostics and non-View reports. A code excerpt, declaration or signature the human must decipher cannot substitute for an architectural account. Explicit opt-in, small excerpts, JSON encoding or diagnostic labels do not make a syntax-dependent explanation adequate.

Assertions, labels and evidence embedded in source artifacts may be presented when intelligible without source-language literacy, preserving their provenance and epistemological status. A comment's readable claim remains a recorded assertion, not established program truth. Permission to present such material does not require every View to include it: relevance, conceptual focus, explicit detail choices and disclosed bounds still guide selection. Implementation identifiers, paths, references and mappings can support traceability without becoming the explanation. Architecture vocabulary and notations start from established practice, with their applicability to the software established or qualified case by case.

Do not routinely display programming-language source as supporting evidence. Any display of source as source must serve a specific purpose that does not require the human to decipher it, and for which an intelligible description or reference would not suffice. Such display does not replace disclosure of an unmet architectural information need.

Assess a mixed passage by the meaning the human needs, not merely its origin or spelling. Additional detail must meet the same human output boundary as the main answer.

An interface's declared purpose and consumption contract determine its audience, not its encoding or caller identity. Public CLI text and JSON are human-facing; agent invocation does not change that contract. Existing source-bearing internal records, acquisition and subject-based investigator tools remain available under their access contracts. Separately scoped coding-agent delivery can carry source; human-facing use of its results must supply intelligible meaning. Shared content understandable by humans and agents need not be hidden or duplicated solely to distinguish the audiences.

Preserve captured material, file associations, spans, evidence identities, implementation mappings, method and supporting basis. The [captured-source decision](adopt-identity-evidence-and-observation-constraints.md#present-source-evidence-from-captured-analysis-input) remains accepted: evidence attributed or delivered for a claim comes from that supporting capture, not a later filesystem read. Intelligible evidence from that capture may be shown with its qualification; machines may receive the full captured source. The Investigator's restrictions on independent discovery, shell execution, mutation and web access remain unchanged.

Exact retained presentation preserves the selected answer and its support. Displaying an already supplied assertion, or rendering already established semantic information intelligibly, need not produce new analysis. Inferring a new contract, responsibility or explanation from source does require analysis and separately qualified information. Do not silently introduce such claims or refresh selection inside `present`. Where supplied information cannot adequately represent the need, disclose the limit rather than rewriting the retained answer.

#### Rationale and consequences

Human comprehension, evidence acquisition and agent coordination have different needs. Applying one semantic boundary across human interfaces preserves useful source-derived meaning without making source literacy a hidden prerequisite. JSON encoding and small excerpt size cannot substitute for that boundary.

<a id="representation-limits-and-feedback"></a>
### Disclose representation limits and accept inadequacy feedback

When PostCode recognizes that available representations and investigation cannot adequately meet an architectural information need, disclose the limitation. This includes known unsupported requests, refusals, unavailable evidence and material qualifications that cannot be conveyed intelligibly. It does not imply automatic detection of every defect in generated interpretation. Further qualified investigation may help but is not guaranteed to settle the question. Do not substitute code deciphering or confident but unsupported prose for an answer. Distinguish unavailable information from available information that cannot be adequately represented through the offered interface.

Preserve independently intelligible qualified information when part of the need remains unresolved. Targeted omission or refusal can be appropriate when the offered representation would otherwise mislead or require source literacy; source origin alone is no reason to omit useful information or reject a whole result. Do not conceal material qualification while simplifying a display.

Provide a low-friction way to report an inadequate View or explanation, with optional clarification and no requirement to submit feedback before continuing. Retain its associated View or exact answer, subject, captured basis and investigation context where already available, without reconstruction or further investigation. Include other available context when it can be provided without undue effort and is likely to help interpret the feedback. Record and submit through the observation destination without otherwise changing the investigation or initiating work. Feedback is optional. Submission follows the observation delivery contract; disclose failure without invalidating the displayed result or preventing subsequent use. Feedback is evidence of the experience, not proof of a false program claim, a correction or authorization to change software.

#### Rationale and consequences

A limit notice preserves the distinction between missing information and an inadequate representation. Feedback records human experience without converting it into a correction or an instruction to change software. Requiring a report before continuing would make a research aid an obstacle to investigation.

<a id="representation-observations"></a>
### Record actual exposure and inadequacy separately

Record actual human output, representation limitations, evidence-attribution disclosures, displays of source as source and submitted feedback with provenance. Classify what each Presentation actually exposes, including expansions and exports, rather than inferring it from a requested option. New exposed fields require coverage. Detail access or source display does not itself establish inadequacy, and exposure classification does not establish semantic adequacy. Holding core support internally or supplying it to an investigator is not human exposure.

Preserve the [qualified-construction disclosure boundary](qualified-construction-under-the-request-model.md#preserve-qualified-construction-and-arrangement-isolation): source-bearing qualified content is presented through its appropriate classified View. Non-View reports carry their bounded request, reason and reference information; they must not become an unclassified source-export path. Apply truthful actual-output and attribution recording to those reports as well. Historical observations retain their meanings. Record a nonconforming output truthfully if one occurs.

#### Rationale and alternatives

The predecessor required: “Record every source escape and the actual level of source detail disclosed.” Actual exposure remains important, but its rationale treated source escape as evidence of inadequate conceptual representation. Recording exposure and human feedback separately avoids that inference without losing the difference between an artifact reference and displayed contents. Schema and event names remain implementation choices.

<a id="additional-detail"></a>
### Provide additional detail under the human output boundary

Normal module and organization presentations emphasize conceptual subjects, relationships, facets and qualification. Language analysis may establish a conceptual property while its mechanism and mappings remain supporting provenance. Epistemological status, evaluation materialization and consequential limitations remain visible whether or not additional detail is requested.

The additional-detail control supplies qualified supporting information, attribution, locations and implementation mappings without source excerpts or declaration text. Preserve support from the captured Claim context of the inspected subjects and displayed expansion records; make consequential selection and omission visible in the presentation and its observations. This control is neither full-file rendering nor arbitrary browsing. It does not implement the exceptional source-display permission above.

There is no blanket exclusion of intelligible paths, identifiers or mappings from normal output for either modules or organization. Their placement is a capability presentation choice, subject to conceptual focus, relevance and bounded output. The reconciliation implementation keeps the existing placement of useful information; subsequent placement improvements do not require superseding this decision.

Where still-accepted decisions refer to “source detail”, “source-detail options” or “source disclosure” as a human-facing control, apply their selection, compatibility, bounds, identity and continuation requirements to this additional-detail control under the human output boundary. References to acquisition or actual exposure retain those distinct meanings. In particular, the [exact retained-presentation contract](exact-retained-answer-presentation.md#check-presentation-against-retained-content), its [reporting contract](exact-retained-answer-presentation.md#report-presentation-without-replaying-evaluation), the [qualified-construction contract](qualified-construction-under-the-request-model.md#preserve-qualified-construction-and-arrangement-isolation) and [investigator evidence access](investigator-execution-and-evidence-access.md#integrate-interpretation-with-evaluation-and-qualified-evidence-access) remain accepted. They neither authorize a syntax-dependent explanation nor lose their actual-exposure requirements.

#### Rationale and consequences

The predecessor excluded paths, positions and implementation mappings from normal module output and offered an explicit source escape. The semantic boundary instead permits useful intelligible information wherever its presentation is appropriate. This also replaces organization’s path exclusion consistently, without requiring a layout change. Exact option spelling and information placement for this change belong in the implementation plan. Appropriate method/identity changes must not masquerade as changes in the investigated program.

<a id="dependency-navigation"></a>
### Preserve dependency navigation with intelligible detail

Retain three direct dependency questions: `dependency-structure(project)` selects the established project graph and supported non-edge requests owned by its modules; `dependency-children(module)` selects direct dependencies, relationships and supported requests establishing no child; `dependency-parents(module)` selects direct users and their relationships. A parent depends on a child, and Views make that direction explicit. These are Lens meanings; command spellings remain implementation choices.

Non-edge requests remain qualified request results, separate from children and graph relationships. Focused child output lists them; project output summarizes their counts without depicting them as nodes. Additional detail identifies the requested module, captured location, target status and applicable resolution evidence intelligibly. A request establishing no child creates no parent result. Preserve the written specifier as an attributed label when it identifies the request; an excerpt must not be its only human-readable carrier.

The supported questions remain direct-only. Transitive reach and maximum hops require later Lens parameters; presentation bounds on roots, levels, nodes or detail do not narrow the requested Projection. Shared evaluation can support the three questions without merging them into one Lens or making them standard inspection expansions.

#### Rationale and consequences

The replaced sentence offered “explicit source detail exposes captured syntax, location, target status, and applicable resolution evidence.” The replacement keeps the information needed to understand the request while removing syntax as its explanation. Project orientation and focused navigation remain complementary, and a later transitive query still changes the question rather than merely revealing more rows.

<a id="organization-detail"></a>
### Keep organization conceptual with intelligible detail

Normal organization and group inspection show groups, relationships, modules, salient properties, qualification and bounded summaries, with precise Entity IDs for navigation. `inspect(group)` exposes all direct parents, subgroups and member modules, direct documentation availability, salient properties and a bounded account of other direct artifacts. Direct subgroups carry their own salient annotations.

Additional detail identifies applicable captured paths and intelligible source-level qualifications without reproducing documentation or other file contents. Presentation may align group and module annotations, prune branches with no project modules and mark repeated references, preserving consequential omissions and actual-disclosure recording. Glyphs, widths, command spelling and expansion limits remain presentation choices.

#### Rationale and consequences

This retains program organization as a qualified navigation scheme while replacing the source escape and blanket normal-output path exclusion with the shared additional-detail rule. It does not make the organization slice interpret documentation contents or make filesystem layout the program's canonical architecture.

<a id="initial-feedback-interaction"></a>
### Initial feedback interaction

Provide a simple shell command for inadequacy feedback about the most recently displayed result, with optional explanation and available context, including its existing Session correlation. A one-shot invocation submits feedback without associated prior-result or investigation context and requires no project opening or investigator enablement. Missing context does not prevent submission. Feedback acknowledgments do not replace the investigation result: consecutive reports concern the same displayed result until another investigation result is displayed. Command syntax remains an implementation choice. Other subjective-note interactions remain deferred; never guess an association to a prior invocation.

<a id="feedback-observations"></a>
#### Observation context and delivery

Use the existing command-scoped observation model. Shell feedback carries the Session correlation and command order; a one-shot invocation has its own correlation identifier and ordinal 1 without opening an analysis Session. This metadata does not assert a known project, captured basis or prior result. Context-free feedback is discoverable under the existing observation destination and identifiable as context-free; directory names and record layout remain implementation choices.

Keep each batch self-contained. For shell feedback, include the available displayed View or non-View result and its exact rendered output, together with available subject, qualification, captured-basis and investigation context. These are the already supplied artifacts of that display, not a new presentation or lookup. Include available context within the batch rather than references requiring an earlier batch or live store. Missing context remains explicit and does not prevent submission; no reconstruction or new capture is required.

Submit feedback at its command completion under the existing observation delivery contract. Awaiting local sink acceptance is permitted. Disclose failure without changing the displayed result or preventing subsequent commands; no asynchronous delivery queue or shutdown-flushing mechanism is required. Sink acceptance, privacy, retention and generated-output exclusions remain in force.

#### Rationale and alternatives

The predecessor deferred all subjective notes until cross-invocation association existed. The shell now has a displayed result available to associate explicitly, and a one-shot report can be useful without that association. Guessing an earlier result remains unacceptable. The existing delivery mechanism is adequate for this bounded interaction; a future destination with materially different latency can motivate a separate delivery design.

## Alternatives and consequences

Keeping source escape as a fallback would leave the human to reconstruct meaning in a language they are not presumed to understand. A blanket ban on source-derived text would discard useful assertions, labels and evidence without establishing semantic adequacy. The chosen boundary instead requires intelligible meaning with preserved qualification, while keeping source acquisition and agent access intact.

Verification therefore needs both positive preservation cases and examples of inadequate representations. The [verification criteria](../plans/product-design-reconciliation.md#implementation-verification) cover these cases and require claims of conformance to identify the capabilities and journeys assessed.

<a id="adoption-and-conformance"></a>
## Adoption and conformance

The [baseline assessment](../plans/product-design-reconciliation.md) identifies an explicit syntax-oriented source escape that requires reconciliation. Other text channels need proportionate semantic assessment. At the assessed baseline, the application has not been demonstrated to satisfy the broader architectural working premise. Adoption changes no runtime behavior and does not certify that it does.

Supported human-facing interfaces must conform to the boundary and feedback requirements of this decision. The [implementation specification](../plans/product-design-reconciliation.md#implementation-specification) scopes the work to establish conformance in the current application. Completion requires that implementation and verification. The [later detail-placement review](../backlog.md#review-more-details-information-placement) concerns improving information organization. Keep unsupported cases visible and descriptions accurate throughout implementation.
