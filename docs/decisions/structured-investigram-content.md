# Allow structured investigram content

Status: accepted
Decided: 2026-11-03
Arising from: [Product-design reconciliation](../plans/product-design-reconciliation.md)
Scope: required accumulated architectural understanding, interpretation content and its representation-independent contracts; no account architecture or schema is selected
Supersedes:

- [Represent retained interpretation as investigrams](investigrams-and-progressive-investigation.md#represent-retained-interpretation-as-investigrams), replaced by [the representation-independent definition](#permit-structured-interpretation).
- [Separate program referents from interpretive focus](investigrams-and-progressive-investigation.md#separate-program-referents-from-interpretive-focus), [Associate investigrams with subjects and select retained results](investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results), [Record explicit corrections without rewriting earlier interpretation](investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation) and [Record citation exposure and derive reconsideration status](investigrams-and-progressive-investigation.md#record-citation-exposure-and-derive-reconsideration-status), each replaced by its [representation-independent successor contract](#generalize-interpretation-contracts) below, which carries forward its other requirements explicitly.
- [Start each operation fresh and permit bounded investigator dialogue](investigator-execution-and-evidence-access.md#start-each-operation-fresh-and-permit-bounded-investigator-dialogue), replaced by its [representation-independent successor contract](#generalize-interpretation-contracts) below, preserving the dialogue and execution requirements.

## Context

The adopted foundation permits accumulating partial, qualified architectural understanding across investigations. This decision makes that an intended application capability while leaving its UX and supporting architecture unresolved. The present prose-only Investigram definition unnecessarily prevents considering structured content as one realization. Existing fixed composition, subject association, immutable retention, evidence and replacement mechanisms are plausible foundations; that does not establish that a particular schema or working-account design will be useful.

## Decisions

<a id="require-accumulated-understanding"></a>
### Require accumulated architectural understanding

PostCode must support accumulating partial, qualified architectural understanding across investigations. Humans can revisit it and investigate further; later investigations can reuse, extend or challenge earlier accounts. Accounts may overlap, disagree or remain incomplete, with evidence, qualifications and revision history distinguishable. This requires neither a consolidated authoritative architecture model nor persistence beyond a selected lifecycle.

The UX and supporting architecture require further design through concrete journeys. Structured interpretation is an expected ingredient, not an adopted account schema or working-account architecture. Retention duration, cross-session availability and correspondence across changed program states remain open design questions.

#### Rationale, alternatives and consequences

Treating each answer as disposable would underserve architectural practice across related investigations. Requiring accumulation establishes that product direction without prescribing a premature representation. Existing Session retention, associations, follow-up and corrections provide supporting mechanisms; they do not establish that the intended accumulation experience is complete. Capability design is deferred to the [account exploration work](../backlog.md#explore-architectural-accounts-through-journeys). This deferral is acceptable for the accurately described current CLI subset, but design and validation must precede a claim to support the intended accumulated-understanding capability. It is separate from immediate human-output conformance work.

<a id="permit-structured-interpretation"></a>
### Permit structured interpretation without selecting an account model

An **Investigram** is an immutable, addressable artifact of program investigation containing a qualified interpretation, with referent information, evidence context and provenance. It may contain broad, related claims and subordinate investigrams; it need not express atomic propositions. An account and a part of an account may use the same concept without requiring separate domain types.

**Interpretation content** is the substantive content of an investigram's qualified interpretation. It may be prose, structured content, or a combination, including prose within a structure. Its representation does not change its interpretive status or the requirements for qualification, evidence attribution, immutable retention, citation exposure and correction. Qualifications remain attributable to the claims or portions they qualify; they need not apply uniformly to all content.

Each investigram retains or resolves to its generating operation, originating program context, selected subject where applicable, and supporting method and qualification. Shared metadata remains attributable. PostCode assigns retained identities and validates references. Neither structural validity nor a resolved reference makes interpretation mechanically established. Mechanical Projections remain distinct; they can supply evidence without being converted into investigrams. Investigram addressability does not make an account a program Entity.

Claim content is the asserted information within an investigram; Claim context qualifies that content. Evaluation outcomes describe how an attempt ended, whether it produced an investigram or failed. These distinctions do not prescribe separate storage records for every sentence or a new type system for every claim. Investigation is the product activity; interpretation is the character of the investigram’s content. Projection remains the general Lens-result concept.

#### Rationale and consequences

A common retained unit supports a whole account and its parts without requiring atomic claims. Broadening its content form removes a premature representation restriction while preserving the same epistemic status and supporting context. Prose remains valid; structured content is permitted rather than required.

<a id="generalize-interpretation-contracts"></a>
### Generalize interpretation contracts without changing their other obligations

The following are successor decisions for the identified headings. Each carries forward the predecessor's requirements in full except for the exact wording replacements below. The unchanged provisions are incorporated by reference, including their qualifications and exceptions. This preserves detailed selection, dialogue, correction and propagation contracts without restating their algorithms here. Historical records remain unchanged.

| Predecessor heading | Wording replaced | Successor wording |
| --- | --- | --- |
| [Separate program referents from interpretive focus](investigrams-and-progressive-investigation.md#separate-program-referents-from-interpretive-focus) | “An arbitrary ID in prose”; “Its prose is part of”; “its prose, referent information”; “the selected investigram's prose and program context” | “An arbitrary ID in interpretation content”; “Its interpretation content is part of”; “its interpretation content, referent information”; “the selected investigram's interpretation content and program context”, respectively. The free-form referent description remains separately required. |
| [Associate investigrams with subjects and select retained results](investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results) | “A source citation or prose mention”; “the most recent prose as truth”; “incidental prose mentions or evidence citations” | “A source citation or mention in interpretation content”; “the most recent interpretation content as truth”; “incidental mentions in interpretation content or evidence citations”, respectively. |
| [Record explicit corrections without rewriting earlier interpretation](investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation) | “The target's retained prose, referent information, and qualifications must have been supplied in full” | “The target's retained interpretation content, referent information, and qualifications must have been supplied in full”. |
| [Record citation exposure and derive reconsideration status](investigrams-and-progressive-investigation.md#record-citation-exposure-and-derive-reconsideration-status) | “complete retained prose, referent information, and qualifications”; “replacement's own prose, referent information, and qualifications” | “complete retained interpretation content, referent information, and qualifications”; “replacement's own interpretation content, referent information, and qualifications”, respectively. |
| [Start each operation fresh and permit bounded investigator dialogue](investigator-execution-and-evidence-access.md#start-each-operation-fresh-and-permit-bounded-investigator-dialogue) | “the selected investigram's prose, referent information, and context references for a follow-up” | “the selected investigram's interpretation content, referent information, and context references for a follow-up”. The coverage description and investigator-written qualifications retain their existing contracts. |

The following paragraphs summarize the resulting content and completeness requirements for orientation. The incorporated predecessor text with the specified replacements governs if this summary differs.

Inspection exposes the retained interpretation content together with referent information, evidence, composition, provenance and corrections. Follow-up uses the selected investigram's interpretation content and program context to focus further interpretation; that content is interpretive input, not a mechanically established premise. The minimum initial follow-up request supplies that content, referent information and context references.

An incidental identifier or mention in interpretation content does not acquire reference or subject-association semantics merely through its appearance, whether in prose or a structure. Declared references and explicit associations retain their validation and qualification contracts. Selecting a retained account does not adopt its interpretation content as truth.

Any substantive portion of interpretation content supplied to an investigator, including an excerpt or descriptive listing, creates a citation under the existing exposure rules. Merely discovering a reference without receiving content does not. Exposure is not reliance, endorsement or comprehension.

Correction eligibility requires the target's complete retained interpretation content, referent information and qualifications to have been supplied during the current evaluation. Complete correction-context delivery requires both the target's and replacement's own interpretation content, referent information and qualifications, together with the correction reasons and qualifications. Structured portions and embedded prose within an investigram are all part of its own interpretation content; this preserves the existing exemption from delivering its subordinate investigram tree. References alone, summaries and partial delivery do not establish completeness. Preserve exact-original access, correction notices, bounded-omission disclosures, further retrieval and completeness recording per correction.

#### Application to structured content

A structured-content capability must specify how complete delivery is established and bounded delivery is reported under these contracts before using the correction mechanism. It cannot redefine complete delivery to mean an arbitrary subset of interpretation content. This decision selects no content schema and does not treat shape validation as semantic validation.

Accounts can overlap, disagree, remain incomplete and be reused, extended or challenged by later investigations. Their evidence, qualifications and revision history stay distinguishable. Reuse does not supply independent corroboration. This neither requires a consolidated authoritative architecture model nor prohibits partial architectural models useful to a particular investigation.

A working account comprising several selected investigrams remains a hypothesis for subsequent design. Selecting several accounts need not mutate any account's composition tree or assert program relationships between them. A Presentation can coordinate supplied qualified Projections; new synthesis or inferred correspondence still requires qualified analysis. Account schemas, selection, correspondence and supporting architecture remain subsequent design work.

Fixed composition continues to identify the parts of one result. A subsequent investigation produces a separate result with provenance; replacements are explicit and originals remain available within the supported lifecycle. Do not silently append to an earlier tree or redirect its references. Associations retain their qualified meaning and do not automatically become ownership, structural containment or semantic identity.

#### Rationale, alternatives and consequences

These substitutions change what content inspection, follow-up, citation and correction contracts must handle, so the affected headings receive explicit successors. The [additional-detail terminology rule](human-facing-architectural-representations.md#additional-detail) instead applies existing selection, compatibility and exposure contracts to the renamed control without changing those contracts.

Keeping prose as a required general content form would unnecessarily constrain representations before learning what architectural journeys need. Replacing investigrams with a new architecture graph/store would choose much more than current evidence supports. Making every structured element a mechanical fact or an independently identified entity would erase important distinctions.

The selected generalization permits, but does not require, structured content. Existing prose investigrams remain valid; no storage migration or new implementation follows from adoption. A later experiment may use several selected investigrams and content shapes chosen for particular representations, or may discover that another approach is needed.

## Adoption and conformance

Update the Investigram and interpretation-content definitions and related application contracts together with this decision. The current prose contracts, acceptance, context delivery and renderers remain a conforming subset of the broadened content definition, subject to the semantic requirement that human understanding not depend on source-language literacy. Their lack of structured content is a capability gap, not a newly introduced conformance defect.

Retain current transient Session limits. Restart persistence, changed-program continuity and cross-session account reuse remain unsupported. The accumulation decision above records the impact and acceptable scope of deferral; the [exploration candidate](../backlog.md#explore-architectural-accounts-through-journeys) carries the follow-up work. Human-output and evidence-boundary obligations apply regardless of content form.
