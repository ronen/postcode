# Human-facing architectural representations

Status: in review
Decided: pending human agreement
Arising from: [Product-design reconciliation](../plans/product-design-reconciliation.md) and the adopted [product design](../../foundation/product-design.md)
Scope: source-language-independent human understanding, evidence access, representation limits and research feedback across PostCode
Supersedes:

- [Keep conceptual presentation separate from source escape](initial-module-inventory-decisions.md#keep-conceptual-presentation-separate-from-source-escape), in full. The replacement preserves conceptual qualification and traceability while withdrawing source escape and blanket exclusion of intelligible implementation provenance from normal presentation.
- [Record the actual source-disclosure level](adopt-identity-evidence-and-observation-constraints.md#record-the-actual-source-disclosure-level), in full. Actual output and useful disclosure metadata remain recorded; evidence-detail access is not a proxy for inadequacy or permission to rely on source literacy.
- The captured-syntax human-display clause of [Provide project structure and focused direct navigation](module-dependency-structure-decisions.md#provide-project-structure-and-focused-direct-navigation). Dependency semantics, non-edge results, captured evidence and qualification remain binding; code deciphering cannot supply the human account.
- The source-escape and excursion-recording clauses of [Keep organization conceptual while preserving bounded source detail](repository-organization-decisions.md#keep-organization-conceptual-while-preserving-bounded-source-detail). Conceptual organization, qualified membership, bounded paths and useful provenance remain binding.
- The source-escape permission and recording clauses of [Preserve qualified construction and arrangement isolation](qualified-construction-under-the-request-model.md#preserve-qualified-construction-and-arrangement-isolation), only insofar as they treat classified source exposure as a sufficient human representation or an excursion. Construction, family, binding, arrangement and truthful actual-disclosure contracts remain binding.
- The source-detail clauses of [Check Presentation against retained content](exact-retained-answer-presentation.md#check-presentation-against-retained-content), only insofar as they authorize source-language-dependent human fallback; and the source-escape event obligation in [Report presentation without replaying Evaluation](exact-retained-answer-presentation.md#report-presentation-without-replaying-evaluation). Exact answers, compatibility, identity, lifetimes, paging, complete effective-choice continuations, outcomes and actual-output recording remain binding. Intelligible evidence-detail controls are not withdrawn by this decision.
- In [Command-scoped observations with session correlation](transient-analysis-sessions.md#command-scoped-observations-with-session-correlation), the source-excursion recording clause, the requirement that one-shot feedback follow the investigation Session-correlation model, and command-completion delivery timing for feedback. Feedback uses available context and permits continued interaction while delivery is pending as specified below. Self-contained command batches, actual output, qualification, existing investigation correlation, sink acceptance and separation from operational state remain binding.
- In [Defer contemporaneous note capture](initial-observation-recording-decisions.md#defer-contemporaneous-note-capture), the deferral of inadequacy reporting and the requirement for cross-invocation association before such reporting can be introduced. Shell reports use the displayed result's available context; one-shot reports are context-free. The prohibition on guessing an association remains binding; other forms of subjective-note interaction are not selected here.
- The human source-escape clauses of [Integrate interpretation with evaluation and qualified evidence access](investigator-execution-and-evidence-access.md#integrate-interpretation-with-evaluation-and-qualified-evidence-access). Captured source access for the Investigator, subject-based acquisition, access restrictions, exposure provenance and usage accounting remain binding; human evidence detail is governed by intelligibility rather than excerpt size or origin.

## Context

The source-escape interaction offers source excursions when conceptual representations are insufficient. This conflicts with the [adopted product design](../../foundation/product-design.md), which supports humans with architectural and computational understanding without requiring knowledge of the implementation language. Its restriction is semantic, not a ban on text originating in source artifacts. Reading a declaration to reconstruct a contract is not an adequate human representation; reading an intelligible recorded assertion from a comment can be.

Source acquisition, machine evidence delivery and human representation have distinct purposes. Preserving source for analysis and coding agents is necessary; removing useful source-derived meaning from the human surface would undermine the product. Encoding alone establishes neither audience nor intelligibility.

<a id="human-output-boundary"></a>
## Establish the human representation boundary

Human understanding must not depend on programming-language source or syntax. This applies to the meaning conveyed through Views, explanations, documentation, evidence detail, qualifications, corrections, diagnostics and non-View reports. A code excerpt, declaration or signature the human must decipher cannot substitute for an architectural account. Explicit opt-in, small excerpts, JSON encoding or diagnostic labels do not make a syntax-dependent explanation adequate.

Assertions, labels and evidence embedded in source artifacts may be presented when intelligible without source-language literacy, preserving their provenance and epistemological status. A comment's readable claim remains a recorded assertion, not established program truth. Permission to present such material does not require every View to include it: relevance, conceptual focus, explicit detail choices and disclosed bounds still guide selection. Implementation identifiers, paths, references and mappings can support traceability without becoming the explanation. Architecture vocabulary and notations start from established practice, with their applicability to the software established or qualified case by case.

Do not routinely display programming-language source as supporting evidence. Any display of source as source must serve a specific purpose that does not require the human to decipher it, and for which an intelligible description or reference would not suffice. Such display does not replace disclosure of an unmet architectural information need.

Assess a mixed passage by the meaning the human needs, not merely its origin or spelling. Additional detail must meet the same human output boundary as the main answer.

An interface's declared purpose and consumption contract determine its audience, not its encoding or caller identity. Public CLI text and JSON are human-facing; agent invocation does not change that contract. Existing source-bearing internal records, acquisition and subject-based investigator tools remain available under their access contracts. Separately scoped coding-agent delivery can carry source; human-facing use of its results must supply intelligible meaning. Shared content understandable by humans and agents need not be hidden or duplicated solely to distinguish the audiences.

Preserve captured material, file associations, spans, evidence identities, implementation mappings, method and supporting basis. The [captured-source decision](adopt-identity-evidence-and-observation-constraints.md#present-source-evidence-from-captured-analysis-input) remains accepted: evidence attributed or delivered for a claim comes from that supporting capture, not a later filesystem read. Intelligible evidence from that capture may be shown with its qualification; machines may receive the full captured source. The Investigator's restrictions on independent discovery, shell execution, mutation and web access remain unchanged.

Exact retained presentation preserves the selected answer and its support. Displaying an already supplied assertion, or rendering already established semantic information intelligibly, need not produce new analysis. Inferring a new contract, responsibility or explanation from source does require analysis and separately qualified information. Do not silently introduce such claims or refresh selection inside `present`. Where supplied information cannot adequately represent the need, disclose the limit rather than rewriting the retained answer.

<a id="representation-limits-and-feedback"></a>
## Disclose representation limits and accept inadequacy feedback

When available representations and investigation cannot adequately meet an architectural information need, disclose the limitation. Further qualified investigation may help but is not guaranteed to settle the question. Do not substitute code deciphering or confident but unsupported prose for an answer. Distinguish unavailable information from available information that cannot be adequately represented through the offered interface.

Preserve independently intelligible qualified information when part of the need remains unresolved. Targeted omission or refusal can be appropriate when the offered representation would otherwise mislead or require source literacy; source origin alone is no reason to omit useful information or reject a whole result. Do not conceal material qualification while simplifying a display.

Provide a low-friction way to report an inadequate View or explanation, with optional clarification and no requirement to submit feedback before continuing. Retain its associated View or exact answer, subject, captured basis and investigation context where already available, without reconstruction or further investigation. Include other available context when it can be provided without undue effort and is likely to help interpret the feedback. Record and submit through the observation destination without otherwise changing the investigation or initiating work. The human can continue without waiting for delivery; disclose delivery failure without blocking continued use. Feedback is evidence of the experience, not proof of a false program claim, a correction or authorization to change software.

Record actual human output, representation limitations, useful evidence-attribution disclosure, displays of source as source and submitted feedback with provenance. Source display, disclosed limits and reported inadequacy remain distinct observations. Opening more detail does not itself establish inadequacy; machine acquisition is not human exposure. Exposure classification does not establish semantic adequacy. Preserve historical observations and event meanings. If an inadequate or nonconforming output is delivered, record it truthfully rather than concealing the failure.

## Preserved contracts and historical interpretation

[Application specification boundaries](application-specification-boundaries.md), [coordinated Views](coordinated-views-and-qualified-results.md) and the [experimental-output policy](experimental-structured-outputs.md) preserve source obligations by reference; those references follow the mappings above. Their architecture, lineage, lifecycle and output-evolution decisions remain accepted. Source-navigation lineage still records available provenance, including historical navigation; it does not require a new source browser.

Evidence acquisition decisions, bounded CommonJS recognition, source facets and supporting expansions remain suitable. The core-concept and subject-kind expansion decisions continue to distinguish supporting detail from another Lens question. Retained-answer identity and continuation rules continue to preserve effective supported choices. Replace `--source-detail` with `--more-details`: preserve the non-source information and its current placement while removing source excerpts and declarations from the detail output. This choice does not require an exceptional source-display facility. Review information placement separately rather than retaining the source escape as its organizing principle. Appropriate method/identity changes must not masquerade as changes in the investigated program.

<a id="initial-feedback-interaction"></a>
## Initial feedback interaction

Provide a simple shell command for inadequacy feedback about the most recently displayed result, with optional explanation and available context, including its existing Session correlation. A one-shot invocation submits feedback without associated prior-result or investigation context and requires no project opening or investigator enablement. Missing context does not prevent submission. The [implementation specification](../plans/product-design-reconciliation.md#inadequacy-feedback) defines the delivery outcomes; command syntax and internal mechanics remain implementation choices.

<a id="feedback-observations"></a>
## Observe feedback without requiring investigation context

Feedback may carry ordinary invocation metadata, but neither that metadata nor destination selection establishes an investigation Session, project association or captured basis.

Keep each submitted batch self-contained: include the context actually available, preserve actual-output recording, and do not make interpretation of the batch depend on an earlier observation stream or a live program store. Observation identifiers, record layouts and local destination organization remain implementation choices within the existing observation boundary.

Initiate submission when feedback is reported, rather than deferring it until Session exit. Continued investigation does not wait for delivery. Distinguish submission from sink acceptance, disclose delivery failure, and preserve truthful completion reporting when the command or Session ends. Sink acceptance, privacy, retention and generated-output exclusion contracts remain in force. This changes feedback interaction and delivery timing, not the ownership of observation storage or the current delivery contract for investigation commands.

## Alternatives and consequences

Keeping source escape as a fallback would leave the human to reconstruct meaning in a language they are not presumed to understand. A blanket ban on source-derived text would discard useful assertions, labels and evidence without establishing semantic adequacy. The chosen boundary instead requires intelligible meaning with preserved qualification, while keeping source acquisition and agent access intact.

Verification therefore needs both positive preservation cases and examples of inadequate representations. The [verification criteria](../plans/product-design-reconciliation.md#implementation-verification) cover these cases and require claims of conformance to identify the capabilities and journeys assessed.

<a id="adoption-and-conformance"></a>
## Adoption and conformance

The [baseline assessment](../plans/product-design-reconciliation.md) identifies an explicit syntax-oriented source escape that requires reconciliation. Other text channels need proportionate semantic assessment. At the assessed baseline, the application has not been demonstrated to satisfy the broader architectural working premise. Adoption changes no runtime behavior and does not certify that it does.

The [implementation specification](../plans/product-design-reconciliation.md#implementation-specification) includes replacing the source escape, remedying demonstrated semantic gaps, providing feedback and reconciling observations as required work. Completion requires that implementation and verification. The [later detail-placement review](../backlog.md#review-more-details-information-placement) concerns improving information organization. Keep unsupported cases visible and descriptions accurate throughout implementation.
