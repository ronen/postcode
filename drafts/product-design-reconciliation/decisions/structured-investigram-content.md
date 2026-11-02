# Allow structured investigram content

Status: in review
Decided: pending human agreement
Arising from: [Product-design reconciliation](../plans/product-design-reconciliation.md)
Scope: Interpretation content and its representation-independent contracts, and permission to explore partial architectural accounts; no account architecture or schema is selected
Supersedes:

- [Represent retained interpretation as investigrams](investigrams-and-progressive-investigation.md#represent-retained-interpretation-as-investigrams), in full; its identity, interpretive character, support, provenance and distinction from mechanical Projections are restated below.
- In [Separate program referents from interpretive focus](investigrams-and-progressive-investigation.md#separate-program-referents-from-interpretive-focus), references to prose as the interpretation input and inspected content, and the prose-specific wording of the incidental-identifier rule. These apply to interpretation content regardless of representation; the referent/focus, validated-reference and exact-subject contracts remain binding.
- In [Associate investigrams with subjects and select retained results](investigrams-and-progressive-investigation.md#associate-investigrams-with-subjects-and-select-retained-results), prose-specific wording about incidental mentions and not adopting the latest prose as truth. These rules apply to interpretation content; explicit association and retained-selection semantics remain binding.
- In [Record explicit corrections without rewriting earlier interpretation](investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation) and [Record citation exposure and derive reconsideration status](investigrams-and-progressive-investigation.md#record-citation-exposure-and-derive-reconsideration-status), retained prose as the content required for correction eligibility and for complete target/replacement delivery. The criterion becomes complete retained interpretation content, with referent information, qualifications and correction reasons still required as specified below. Correction, exposure, conflict and reconsideration rules otherwise remain binding.
- In [Start each operation fresh and permit bounded investigator dialogue](investigator-execution-and-evidence-access.md#start-each-operation-fresh-and-permit-bounded-investigator-dialogue), the selected investigram's prose in the minimum initial follow-up request becomes its interpretation content. Referent information, context references, fresh-dialogue, execution and evidence-access contracts remain binding.

## Context

The adopted design permits accumulating partial, qualified architectural understanding across investigations. The present prose-only Investigram definition unnecessarily prevents considering structured content as one realization. Existing fixed composition, subject association, immutable retention, evidence and replacement mechanisms are plausible foundations; that does not establish that a particular schema or working-account design will be useful.

<a id="permit-structured-interpretation"></a>
## Permit structured interpretation without selecting an account model

An **Investigram** is an immutable, addressable artifact of program investigation containing a qualified interpretation, with referent information, evidence context and provenance. It may contain multiple related claims and subordinate investigrams. An account and a part of an account may use the same concept without requiring separate domain types.

**Interpretation content** is the substantive content of an investigram's qualified interpretation. It may be prose, structured content, or a combination, including prose within a structure. Its representation does not change its interpretive status or the requirements for qualification, evidence attribution, immutable retention, citation exposure and correction. Qualifications remain attributable to the claims or portions they qualify; they need not apply uniformly to all content.

The term “interpretation content” refers to part of the existing investigram, not a new artifact or architectural mechanism. Referent information, provenance, evidence context and qualifications remain separately required where the existing contracts require them.

Each investigram retains or resolves to its generating operation, originating program context, selected subject where applicable, and supporting method and qualification. Shared metadata remains attributable. PostCode assigns retained identities and validates references. Neither structural validity nor a resolved reference makes interpretation mechanically established. Mechanical Projections remain distinct; they can supply evidence without being converted into investigrams. Investigram addressability does not make an account a program Entity.

Inspection exposes the retained interpretation content together with referent information, evidence, composition, provenance and corrections. Follow-up uses the selected investigram's interpretation content and program context to focus further interpretation; that content is interpretive input, not a mechanically established premise. The minimum initial follow-up request supplies that content, referent information and context references.

An incidental identifier or mention in interpretation content does not acquire reference or subject-association semantics merely through its appearance, whether in prose or a structure. Declared references and explicit associations retain their validation and qualification contracts. Selecting a retained account does not adopt its interpretation content as truth.

Any substantive portion of interpretation content supplied to an investigator, including an excerpt or descriptive listing, creates a citation under the existing exposure rules. Merely discovering a reference without receiving content does not. Exposure is not reliance, endorsement or comprehension.

Correction eligibility requires the target's complete retained interpretation content, referent information and qualifications to have been supplied during the current evaluation. Complete correction-context delivery requires both the target's and replacement's own interpretation content, referent information and qualifications, together with the correction reasons and qualifications. Structured portions and embedded prose within an investigram are all part of its own interpretation content; this preserves the existing exemption from delivering its subordinate investigram tree. References alone, summaries and partial delivery do not establish completeness. Preserve exact-original access, correction notices, bounded-omission disclosures, further retrieval and completeness recording per correction.

A structured-content capability must specify how complete delivery is established and bounded delivery is reported under these contracts before using the correction mechanism. It cannot redefine complete delivery to mean an arbitrary subset of interpretation content. This decision selects no content schema and does not treat shape validation as semantic validation.

Accounts can overlap, disagree, remain incomplete and be reused, extended or challenged by later investigations. Their evidence, qualifications and revision history stay distinguishable. Reuse does not supply independent corroboration. This neither requires a consolidated authoritative architecture model nor prohibits partial architectural models useful to a particular investigation.

A working account comprising several selected investigrams remains a hypothesis for subsequent design. Selecting several accounts need not mutate any account's composition tree or assert program relationships between them. A Presentation can coordinate supplied qualified Projections; new synthesis or inferred correspondence still requires qualified analysis. This decision does not select a persistent working-account object, a selection algorithm, account schema, notation, ontology, new Entity kind, cross-capture identity, editing authority or correspondence mechanism.

Fixed composition continues to identify the parts of one result. A subsequent investigation produces a separate result with provenance; replacements are explicit and originals remain available within the supported lifecycle. Do not silently append to an earlier tree or redirect its references. Associations retain their qualified meaning and do not automatically become ownership, structural containment or semantic identity.

## Alternatives and consequences

Keeping prose as a required general content form would unnecessarily constrain representations before learning what architectural journeys need. Replacing investigrams with a new architecture graph/store would choose much more than current evidence supports. Making every structured element a mechanical fact or an independently identified entity would erase important distinctions.

The selected generalization permits, but does not require, structured content. Existing prose investigrams remain valid; no storage migration or new implementation follows from adoption. A later experiment may use several selected investigrams and content shapes chosen for particular representations, or may discover that another approach is needed. Architectural account schemas, selection, correspondence and detailed design remain subsequent human-directed work.

## Adoption and conformance

Update the Investigram and interpretation-content definitions, related contracts and application permission together with this decision. The current prose contracts, acceptance, context delivery and renderers remain a conforming subset of the broadened content definition, subject to the semantic requirement that human understanding not depend on source-language literacy. Their lack of structured content is a capability gap, not a newly introduced conformance defect.

Retain current transient Session limits. Retention and follow-up across successive investigations in one Session provide mechanisms for accumulated understanding, not a demonstration that its intended UX and supporting architecture are complete. Restart persistence, changed-program continuity and cross-session account reuse remain unsupported. Those require lifecycle, basis and reference/correspondence decisions before implementation, not as a prerequisite to a bounded same-Session exploration. Follow the [architectural-account exploration candidate](../backlog.md#explore-architectural-accounts-through-journeys). The human-understanding and evidence-boundary obligations apply regardless of the content form eventually chosen.
