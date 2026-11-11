# Investigram structure: consolidation checkpoint

Updated: 2026-11-11

Exploratory consolidation of the [working proposal](structured-architectural-accounts-proposal.md), not a schema, adopted decision or implementation task. This records the current direction and tests ownership against the existing examples. It does not add a new Account object, a universal metadata framework or a presentation/navigation system.

## Assessment

The model has a coherent center: an investigram communicates a qualified interpretation, identifies what it concerns, and can carry guidance for using or investigating it. The muddiness came from mixing conceptual responsibilities, submission instructions, retained records and indexes in one growing list of possible fields.

Three corrections make the structure clearer:

- Content items structure **Interpretation content**; they are not child investigrams or independently retained Claim objects.
- Investigation offers and presentation recommendations are **qualified guidance metadata**, not architectural content forms. Metadata can contain interpretive judgments and is not exempt from evidence, attribution or delivery rules.
- Entity allocation belongs to acceptance of an analysis result. Entity identity, evaluation provenance, separately recorded relationships, derived indexes and rendered diagrams are not all fields to copy into every investigram.

Metadata ownership is now settled in the exploratory direction: it is about one exact immutable investigram. Its referents, associations, offers and presentation recommendations stay with that version; a replacement supplies its own metadata. Guidance is not required to survive replacement as the same offer. The earlier guidance-child/independent-lifecycle question is withdrawn rather than solved by another artifact type.

Presentation retrieval and arrangement are outside this remit. Our responsibility is to preserve architectural meaning, qualifications and exact references, identify intended diagram inputs, and demonstrate sufficiency in representative examples. That is distinct from choosing context for an investigator, which retains its existing explicit delivery, requestable-context and exposure rules.

This is a more coherent structure, not yet a completed protocol. Most remaining work is contract precision and fixture alignment, rather than deciding where another top-level field belongs. New concepts and diagrams should extend the appropriate content/input catalogue rather than grow the investigram envelope. Entity identity guarantees and proposed supersession/reconsideration semantics still need their own governing treatment; consolidation has not proved them implemented or universally sufficient.

## What the governing definition means

The [five information obligations](../docs/core-concepts.md#interpretation-content) are not five disjoint storage compartments. Evidence and provenance also qualify claims; qualifications must be attributable to the portions they constrain. Composition, associations, corrections and citation exposure are described after that initial list. The [implemented record](../src/lib/investigation/contracts.ts) already has child references, associations, correction references and a provenance reference in addition to prose and support.

| Term | Meaning in this design |
| --- | --- |
| Account | Ordinary language for information or explanation provided by PostCode, potentially across investigations. No separate aggregate identity. |
| Investigram | Immutable, addressable unit of qualified interpretation; it has its own content and may reference child investigrams. |
| Claim | Something asserted. A prose paragraph or a structured item can make several claims without separately allocated claim records. |
| Content item | Addressable portion of Interpretation content, with a supported form and attributable qualifications/support. Its key does not make it independently correctable. |
| Child investigram | Another complete investigram in the fixed composition tree, with its own identity, qualification and correction boundary. |
| Entity | Explicitly identified architectural thing around which information is organized. Descriptions remain qualified information, not authoritative fields on its identity. |
| Subject / referent | Roles: what is investigated or concerned; what a reference denotes. Not additional container types. |

## Two maps, not one ever-growing record

These maps show responsibilities and ownership, not proposed field names or a requirement to inline records.

### Submitted investigation result

```text
Submitted result
  Proposed investigrams
    Local identity and architectural content
    Explicit referents and qualified associations
    Child links forming a result tree and any replacement trees
    Applicable support and qualifications
    Offers and presentation recommendations, attributed to an owner
  New entity declarations / references to existing entities
    Local new IDs; qualified identifying information anchored in the result
  Proposed relationships between investigrams
    Reporter, exact participants, reasons and support
```

The existing fixture uses an `introducesEntity` marker on an identifying content item. Conceptually this does two jobs: a submission instruction requests an identity, while the description supplies a qualified claim. Separating those jobs does not require a new declaration-list field: the marker can remain an encoding if acceptance can unambiguously resolve the declaration, owner and identifying support. Reuse references existing entity IDs; names do not deduplicate entities.

PostCode accepts the result atomically: allocate identities, resolve local references, validate ownership/support and retain records. Actual request, method, captured basis and deliveries are recorded through evaluation provenance; the investigator does not fabricate its own delivery history. There is no additional registration/promotion stage.

### Retained investigram and its surroundings

```text
Investigram
  Identity
  Interpretation content: keyed architectural content items
  Referent information and qualified associations
  Child-investigram references
  Qualified guidance: investigation offers, presentation recommendations
  Attributable evidence, qualifications and provenance references
  Links to accompanying relationships

Related retained information, not duplicated inside every investigram
  Entity identities and their introduction provenance
  Evaluation provenance and actual delivery records
  Qualified relationships between investigrams
  Exact answer selections and captured support/revision context

Derived or produced information
  Entity/referring-investigram indexes
  Current revision and reconsideration status
  Validated presentation inputs and rendered diagrams/legends
```

“Qualified guidance” groups responsibilities for this discussion; it is not a proposal for a generic extensible bag of metadata. Inline versus referenced storage remains open. Metadata belongs to the exact immutable investigram it describes. A replacement has its own metadata; no entry is silently transferred or retargeted. Exact answers preserve what they selected; fresh access can separately disclose later status.

## Ownership and lifecycle audit

| Responsibility | Owner and meaning | Correction, qualification and access |
| --- | --- | --- |
| Architectural content | The containing investigram; prose, identifying descriptions, models and interactions. | Whole-investigram correction remains the boundary. Item and nested-element addresses do not authorize patches. Applicable support travels with excerpts. |
| Referent inventory | Explicit declaration that this investigram concerns an entity or other supported referent. | Not an authoritative description. Indexes can derive from explicit references; prose alone must not be mined for inferred identities. Automatic extraction from structured fields needs form-specific rules. |
| Item associations | Qualified relation between an entity/subject and an investigram or exact content item, such as identifies or describes. | Can organize several descriptions without synthesizing a canonical one. Historical association and revision context remain fixed in exact answers. |
| Entity introduction | Analysis declaration resolved by PostCode; identifying information stays in qualified content. | Correcting that description does not delete the identity. Mechanical identity rules still govern reuse. Duplicate discoveries remain possible. |
| Child composition | Owning investigram references its fixed children. | Correcting a child does not rewrite parent composition or automatically correct its other claims. No adoption of old children into a new tree by reference. |
| Investigation offers | Qualified metadata of the exact originating investigram, with offer key, targets, scope and supported method. | Remains with that version; a replacement supplies its own offers. Matching wording does not establish continuity or reuse. Investigator delivery of substantive guidance remains exposure; human browsing alone is not. |
| Presentation recommendations | Metadata of the exact investigram, naming a supported presentation/diagram type and bindings to exact content or entities. | Presentation does not establish new correspondence or causal claims. An optional recommendation differs from a promised request outcome. Exact recommendations cannot silently retarget newer content. |
| Investigram relationships | Explicit supported records with reporter and exact endpoints; currently prefer separate retention/indexing. | Correction, alternative and inconsistency have different consequences. Revising the reporter does not silently revoke the relationship. |
| Evidence, qualification and provenance | Cross-cutting attribution, including support for metadata when it asserts claims. | No unqualified side channel. “Metadata” does not imply mechanical truth, automatic inclusion or exemption from delivery/completeness rules. |
| Indexes / current status | Derived views over retained declarations, relationships and delivery history. | Indexing is not semantic synthesis. Entity-supersession reconsideration remains a proposed extension, distinct from existing citation exposure. |

For interpretive results this is not yet a final ownership schema. The mechanical producer participates in common identity/reference and qualified-information semantics without becoming an investigram or requiring identical storage.

## Concepts, content and diagrams

<a id="catalogue-responsibilities"></a>
Keep three catalogue responsibilities distinct, even if packaged together:

| Catalogue responsibility | Defines | Does not imply |
| --- | --- | --- |
| Architectural concept guidance | Meaning, useful distinctions, questions to investigate, examples and sources. | A required diagram, a schema for every concept or automatic applicability to an entity. |
| Content-form contract | Meaning and representation of an item: fields, references, qualifications and explicit partial/unknown cases. | One item per concept or one independently retained claim per field. |
| Diagram-type input contract and mapping | Supported diagram inputs, bindings, compatibility/preconditions and their mapping to visual elements/legends. | Inference of architectural relationships or a duplicate canonical model. |

Diagram types describe supported diagram Presentations under the existing result/Presentation compatibility model; this catalogue does not introduce a competing presentation architecture.

One content item may express several concepts. One concept may have several representations or only prose. Referencing Half-open S shares identity; it does not share every claim about S. Sharing a description or transition requires an exact reference to that qualified content. Satisfying a content contract can use explicit, available referenced material rather than duplication; a bare unresolved ID is not sufficient when its meaning is needed. Cross-item scope/role alignment must be asserted with support, not guessed from equal keys.

A diagram type can accept one complete state-behavior item, rather than require every node and edge to be supplied again. Another type may accept several explicitly bound items. PostCode follows only the dependencies declared by the input/content contracts, checks sufficiency and renders. It does not search accumulated knowledge for a plausible diagram or synthesize missing transitions while laying it out.

### Recommendation example

```text
Interpretation content in TRIAL-1
  recovery: state-behavior model
  concurrent-callers: interaction

Presentation recommendations attributed to TRIAL-1
  state-diagram: model = TRIAL-1 / recovery
  sequence-diagram: interaction = TRIAL-1 / concurrent-callers
```

This is a conceptual example, not an adopted payload. Entity labels/identifying support and any explicitly shared model elements remain exact qualified references. An entity reference alone does not select which of its competing descriptions to draw. The content contracts and diagram input bindings must make that selection explicit where it matters.

A supported request promising a state diagram requires both suitable qualified data and compatible diagram presentation. A general explanation may choose useful forms and recommend a diagram without promising it. Required/optional annotations and groups of alternative presentations are future extensions. Distinguish a request obligation from an investigator's judgment that a presentation is essential; alternatives need not assert identical information. Selection/UI behavior for those annotations is deferred.

## Walk the existing examples through the map

1. **Initial result.** INTRO-1 owns DEFINITIONS-1 and ADMISSION-1 in the children partition. The identifying descriptions introduce local keys for S/open/closed; acceptance resolves them to entity IDs. The descriptions remain content in DEFINITIONS-1. Associations locate them precisely; behavioral items in ADMISSION-1 refer to those entities.
2. **Offer.** The concurrent-callers offer is investigative guidance associated with its exact originating investigram and key. Current JSON still encodes it as `investigation-offer/0` in ADMISSION-1's content; that is the earlier representation, not the new recommendation. Its question, targets, qualifications and delivery obligations survive the conceptual move to metadata.
3. **Follow-up and correction.** Invocation selects that exact offer. Actual delivery of complete ADMISSION-1 and identifying support establishes the context/eligibility exercised by the fixture. TRIAL-1 introduces scenario roles and W, supplies behavioral content, and reports correction K with ADMISSION-2. Entity declarations, architectural claims and K's organizing meaning remain separate responsibilities. The same scenario role/entity references can be shared between state and interaction items without asserting broader applicability.
4. **Diagrams.** Explicit recommendations could bind the state and interaction items as above. Existing generators demonstrate input sufficiency and preserve legends/qualifications, but their entry points are hard-coded for the fixtures. They do not implement a diagram-type catalogue, recommendation protocol or general reference-resolving presentation service.
5. **After correction.** Exact old references and offers remain on ADMISSION-1, with applicable correction context on fresh access. ADMISSION-2 supplies its own metadata; its repeated offer is a new offer at a new address, not automatic continuation or invocation. Earlier invocations retain ADMISSION-1/offer provenance. This is intended version-specific behavior, not a continuity defect. More plainly: if A1 says “Foo is X” and offers further investigation of X, while A2 corrects it to “Foo is Y,” A1's X offer does not become follow-up guidance for A2. The same rule applies to presentation recommendations and other metadata.
6. **Composition and selected content.** The ordered-pattern entities C-BB/C-BH organize later information; scenario-local role/relation keys remain content addresses. Selecting a wait is a valid input without entity allocation. A subsequent identifying interpretation can introduce an entity grounded in that occurrence. A structured origin address remains an open small extension; the current selector check is not proof of that introduction path.

The mixed-content partition retains the same core semantics with larger correction/qualification units. No new group named Account is needed in either case.

## Recommendations and remaining choices

**Keep now:** content items inside Interpretation content; children as complete investigrams; entity identity outside any authoritative description; explicit qualified associations; guidance outside architectural content; provenance/indexes/status with their actual owners; three distinct catalogue responsibilities. Do not add a top-level field for every new architectural concept or diagram type. Add a content form or diagram input contract only for a demonstrated explanatory need.

**Settled ownership and remaining contract details:**

1. **Version-specific metadata.** Keep guidance on the investigram whose explanation it extends. Do not move it to a parent, guidance child or independent record merely to preserve its address through correction. Historical metadata remains available with its original investigram; replacements supply their own. This removes the need for a separate guidance lifecycle.
2. **Content sufficiency, not presentation policy.** Specify meaningful content, qualification, exact references and declared diagram inputs. Representative rendering tests whether those inputs contain enough meaning without inference. General retrieval strategy, legend/detail arrangement and user navigation belong to later presentation work, not another context-selection mechanism in this design. Missing meaning or ambiguous references exposed by an example remain in scope to fix.
3. **Investigator delivery and metadata qualification.** Preserve applicable investigram qualifications and narrower qualifications where needed. Supplying an offer excerpt does not supply the whole investigram or establish complete-target eligibility. Actual investigator deliveries, requestable additional context and exposure remain separate from what a human sees. Precisely encoding the new metadata delivery/completeness envelope remains work; it must preserve existing guarantees, not reopen general context-ranking policy.
4. **Origin and address namespaces.** Distinguish content-item addresses from offer/recommendation addresses if moved into separate metadata collections. Preserve historical references; specify migration only when changing the actual protocol. Add a structured selected-occurrence origin when an introduction example exercises it. It records provenance, not proof of equivalence or delivery.

These are narrower choices than designing a universal knowledge store. Entity supersession/challenge and cause-specific reassessment remain the previously identified future compatibility questions. Full UI, global operation discovery, persistence, a comprehensive catalogue and broader producer migration remain outside this slice.

## What is and is not verified

The existing fixtures still exercise the earlier offer-as-content encoding, entity allocation bindings, precise item associations, both investigram partitions, qualified correction/access, composition selectors and fixed diagram inputs. They have not been converted to guidance metadata or diagram recommendations in this pass. Their unchanged checks do not validate those new mechanisms.

This consolidation maps the proposals and tests their consequences conceptually. A later bounded fixture revision should encode the settled investigram-specific metadata ownership and one explicit diagram recommendation, carrying qualification/completeness and exact-address behavior through the change. It should preserve old metadata with the original and give the replacement its own, without a guidance-child variant or independent guidance lifecycle. It need not implement the whole application journey. The [proposal](structured-architectural-accounts-proposal.md) carries the updated direction inline; the [fixture contracts](structured-account-example/contracts.md) label the representation difference.
