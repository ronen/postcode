# Structured architectural accounts: working proposal

Updated: 2026-11-12

Exploratory synthesis for discussion, incorporating the emerging direction and a
recommended bounded capability. This is not an adopted design, planning package,
or implementation authorization. Recommendations and unresolved choices remain
open. The [discussion notes](structured-architectural-accounts.md) retain the
alternatives, implementation inspection and research behind this synthesis.

Current recommendations, including the review refinements, are stated inline.
Remaining investigram-design choices are marked **Needs design** where they arise and
collected below. Surrounding application choices are context, not prerequisites.
Remaining first-delivery choices have not been agreed; the earlier three-route
introduction/promotion model has been replaced by explicit entity introduction/reuse.

The [first concrete walkthrough](structured-architectural-accounts-example.md) tests
a provisional definition/admission child partition, a subject request with explicit
context, and immutable selection across results. Its choices remain open; it does
not supersede the unresolved choices in this proposal.
It tests explicit context input, new role definitions during follow-up, and qualified
retained access. UI composition and an additional assembled-answer workflow are not
requirements of this architecture proposal.

The [complete illustrative results](structured-account-example/README.md) now give
actual proposed submissions, identity bindings, a qualified correction record and
two diagrams generated from retained structured fields. That pass deliberately uses
one investigram per coherent explanation, making repeated replacement content visible
as a comparison with the earlier child partition. Neither partition is adopted.
After review, use explicit entity introduction as the actionable default:
when identifying descriptions are mixed with behavior, place them in one or more
identifying children. Receiving an identifying child alone avoids the exposure path through its behavioral sibling. Identification-only roots need no extra wrapper; local terms may stay embedded.
The [children variant](structured-account-example/children/README.md) now exercises
that recommendation with complete first/follow-up payloads and independent child
support. The original payload retains the single-investigram alternative for comparison.

The [foundation](../foundation/README.md), [application specification](../docs/app-specification.md),
[core concepts](../docs/core-concepts.md), [architectural constraints](../docs/architectural-constraints.md)
and applicable accepted decisions remain governing. The
[structured-interpretation decision](../docs/decisions/structured-investigram-content.md)
permits exploring this content while preserving qualification and revision contracts.

The [structure consolidation](structured-architectural-accounts-consolidation.md)
now maps conceptual responsibilities, submitted results, retained records and derived
information. It records the current guidance-as-metadata direction and the three
catalogue responsibilities, and walks the existing examples through their ownership
boundaries. The [complete metadata payload](structured-account-example/metadata-payload.md)
now exercises qualified metadata, exact option/presentation addresses and explicit
trial diagram inputs in both partitions. This is an authored fixture protocol;
product acceptance and a general presentation system remain unimplemented.

**2026-11-12 discussion update:** [Association declarations and information targets](structured-architectural-accounts.md#association-declarations)
now explore a common addition/supersession/withdrawal mechanism for entity-and-role
associations and result associations, including declarations referring to content owned
by other investigrams. This would replace the whole-investigram supersession approach
in the earlier model. Its correction, delivery and reconsideration consequences still
need resolution. The detailed synthesis and executable fixtures below have not yet
been reconciled with this direction; their earlier correction rules are not evidence
that the new mechanism is already specified or adopted.
The subsequent [entity-context and query-result discussion](structured-architectural-accounts.md#entity-context-and-result-exposure)
proposes entities and their associations as the context-facing accounts, with query-result
entities and distinct exposure/result-composition paths into reconsideration. Q is a
particular query invocation. These changes also remain to be reconciled with the
previous synthesis and fixtures.

## Current exploratory checkpoint

The design has a stable direction, but no adopted payload schema or planning package.
The current naming/model pass uses Entity for identified architectural things and
Subject for a role; it supersedes the earlier retained-subject/registration vocabulary
and three introduction routes. These are proposed refinements, not changes to the
governing definitions or implemented API:

- Retain qualified accounts and their history, allowing partiality and disagreement;
  do not require a reconciled architectural model.
- Entity references organize accounts around explicitly identified architectural things; identifying and
  behavioral descriptions remain qualified claims, not authoritative entity fields.
- Use a common content protocol, including keyed prose and specialized architectural
  types. Established concepts guide both investigation and explanation; diagrams
  test content sufficiency through a bounded rendering exercise.
- Distinguish architectural relationships inside investigrams from investigram-organizing
  relationships. The latter currently favor explicit qualified metadata records
  returned alongside investigrams, with their own meaning, support and consequences.
- Alternatives, inconsistencies and corrections have distinct meanings. There is
  no longer a recommendation to rename all corrections “revision” or “alternative.”
- Subject/context selection and dialogue-based retrieval remain separate from UI
  design. Human pushback is out of scope; detailed reassessment is recommended for
  deferred work, preserving the necessary references and derived-status extension.

The complete illustrative submission/retrieval/correction example is now available
above. Review its actual content and provisional partition before generalizing the
schema. It is an authored fixture, not an implemented or live investigation path.
The five remaining decision groups are collected near the end of this note.

Current recommendations sharpened by the complete-example review:

| Topic | Position for the next design pass |
| --- | --- |
| Investigram partition | When mixed with behavior, put descriptions of explicitly introduced entities in identifying children by default. Grouping is allowed; identification-only roots need no wrapper. Both partitions now have complete authored fixtures and ownership/support checks. |
| Identifying support | Use replacement descriptions when their containing investigram is replaced; unchanged identifying siblings remain available. Original input/history is separately labelled; exact older answers remain fixed. `affectedSubjects` is not an item-survival mask. |
| Relationship K | Retain/index separately; record exposure to its reporter when supplying the substantive explanation. This does not deliver the reporter's complete own content or enable independent revision of K. |
| Behavioral content | Supply the causal chain through classification, transition, resume/recheck and admission outcome. Admission uses local variables and an illustration; the scenario state model references R directly. Shared syntax does not require redundant aliases or broader claims. |
| Validation | Both partitions have a repeatable fixture checker and diagram traceability. Exact illustration access reports linked-investigram revision status without automatic retargeting or reconsideration. Cross-type semantics remain a separate assessment. |
| Request/reuse | Distinguish request plus selected seed context from subsequent acquired context in provenance. Preserve those inputs for application reuse decisions; a general reuse freshness policy is outside this design. |
| Concept associations and options | Multiple qualified concepts may describe a subject; recognition is not a whitelist. Selectable investigator-proposed “find out more” options can carry concern annotations. Icons and automatic concept-specific treatments are deferred; option delivery/validation remains to be designed. |

## The proposed capability

PostCode identifies architectural entities and retains qualified information about
them so that successive investigations can reuse, extend and challenge understanding.
Entities provide continuity; accounts provide attributable descriptions and claims. Neither
shared identity nor a current selection requires the accounts to agree.

**Governing framing — organize accounts without requiring a canonical theory.** The
human recalls an existing principle, not a newly adopted direction. The
[foundation's retained-understanding guidance](../foundation/product-design.md#retained-architectural-understanding-and-continuity)
explicitly permits overlapping, disagreeing and incomplete accounts without a single
consolidated architecture model. The accepted
[accumulation requirement](../docs/decisions/structured-investigram-content.md#require-accumulated-understanding)
and its [reaffirmation](../docs/decisions/specialized-architectural-investigation.md#retained-understanding-and-context)
carry this into intended application behavior. Our discussion should apply that
framing to the proposed mechanisms. Entity references provide continuity of reference
and access to investigrams; they do not require one authoritative description or a
globally reconciled graph. Architectural structure is asserted within qualified
accounts, not silently accumulated as universally accepted program facts.

Require enough machinery to retain and retrieve investigrams, preserve support and
scope, follow subjects and explicit relationships, record supported corrections or
inconsistencies, and expose structured explanations faithfully. Do not make universal
identity resolution, automatic conflict detection, complete dependency tracking or
global consistency prerequisites. Any future reconciliation would require explicit
investigation with qualified outcomes; no reconciliation operation is required here.
Correction partition should support useful explanation and revision, not promise perfect semantic independence; uncertainty about broader
impact can be recorded rather than solved automatically. This framing does not
relax existing qualification, exact-access or correction obligations. Accept that
users and investigators may need to compare accounts and perform further inquiry.

Start with admission → trial → correction over one captured Cockatiel revision,
under default single-trial recovery, within one supported Session. Use composition
order to probe whether the content can express new relationships across investigrams.
Broader graphical investigation and the minimal GUI follow separately.

### Scope boundary: architecture, not UI workflow

The human directs this work to presume that users can view and select the retained
subjects, investigrams and investigation choices they need. Do not design menus, layouts,
selection gestures or a separate assembly workflow here. Describe only selections
that affect application behavior: subject(s) and their roles, Lens/parameters,
explicit prior context, actual navigation origin, and exact versus fresh access.

**Remit clarification:** the global investigation set, Overview versus Explain,
structural-query entry routes, option discovery and the Follow-up investigation Lens
are illustrative surrounding application usage. They help test how structured
investigrams could fit PostCode; designing or delivering those application capabilities
is not part of this work. Preserve the investigram implications they expose—representable
qualified content, exact references, contextual subjects, provenance and delivery
semantics—without making a complete investigation catalogue or request journey a
prerequisite. A bounded verification path may specify representative inputs without
settling the app-wide investigation interface.

**Working-note organization.** Surrounding application discussion remains useful
exploratory context here. Its length or presence is not itself a scope defect or a
commitment to delivery. Consolidation or relocation can happen when drafting the
planning package; reorganizing these notes is not a prerequisite for this design.

Apply this boundary to the open questions below: this work specifies what investigram
content, references, qualification, retention and access must preserve. Examples may
stipulate entry operations and context policies to exercise those guarantees. General
investigation availability, discovery ranking, resource budgets and reuse policy are
surrounding application choices, not prerequisites for this proposal. Integration
must respect existing governing contracts; any necessary bounded extension must be
identified separately from an app-wide redesign.

Viewing several investigrams together does not make them multiple subjects of a Lens,
supply them to an investigator, establish agreement, or create a new retained aggregate.
Those are distinct operations requiring explicit application meaning. The UI can
provide context when the selection identifies it; an absent origin remains absent.
The earlier optional collection-inspection/assembled-answer mechanism is set aside,
not a prerequisite or an unresolved UI decision blocking this capability.

The useful result is being able to follow Half-open from an admission explanation,
obtain an account of concurrent callers, see an explicit correction, and still
retrieve the original answer. Retained content should also supply the meaning for
representative architectural diagrams without a renderer inventing it.

## Entities, qualified information, explicit selections

This vocabulary describes responsibilities, not storage tables or public API types.

| Concept | Proposed responsibility |
| --- | --- |
| Subject | The governing role: what a Lens investigates or a claim concerns. Entities, relationships, collections and investigrams can play this role; these examples do not establish mutually exclusive categories. The proposed Entity treatment below includes explicitly identified architectural relationships and patterns. |
| Entity | An explicitly identified architectural thing around which accounts and qualified items are organized. Mechanical and interpretive analyses can introduce entities, including explicitly identified architectural relationships or patterns under the proposed governing clarification below. Identity does not establish one authoritative definition, uniqueness across discoveries or persistence beyond the supported scope. |
| Entity reference | A reusable ID identifying an entity. A result uses local IDs for new entities; PostCode allocates global IDs on acceptance and resolves those local references. Existing entities are referenced by global ID. |
| Referent | What a reference denotes; an entity can be a referent of many investigrams. This is not a separate retained-object kind. |
| Qualified information | Information about one or more subjects, with attributable scope, evidence, method/provenance and limitations. Definitions are one kind of information among others. |
| Investigram | The existing immutable unit of retained interpretation; proposed content types include keyed prose and specialized architectural structures. Mechanical claims retain their own character and guarantees. |
| Account | Ordinary explanatory language for information provided by PostCode, not a domain object or retained-unit kind. An investigram gives an account of behavior; a sequence of investigations can collectively present an account of a mechanism. |
| Retained answer selection | Exact qualified parts and support selected for an application answer, with selection basis and revision context. It is immutable and distinct from UI grouping, investigator context and selected Lens subjects. |
| Identifying support | Qualified content making a referenced subject intelligible, with exact supporting references. It need not be a selected investigram constituent and is not evidence for every claim about the subject. |
| Exact answer | A fixed record of selected content and support, including captured revision/association context. The proposed identifying support must be fixed too. |

The retained architectural model comprises entities, qualified information,
relationships, support and revision/conflict history. It can be partial, contested
and incomplete. Identity does not establish that a hypothesized relationship exists
or that an account is correct. Cross-Session persistence and correspondence across
program revisions are outside this first scope.

Use **investigram** for a particular retained interpretation and **account** only
in its ordinary explanatory sense. “The investigram gives an account of breaker
behavior” and “this sequence of investigations presented an account of the Policy
mechanism” are both valid. Account does not name a collection, assembly operation,
independent identity or correction unit. Correction targets are investigram IDs;
local content designations belong to an exact investigram.

Use **composition tree** for one investigation's fixed root/children and **retained
answer selection** for the exact chosen results and captured context. A reference
to an answer remains distinct from references to its constituents. There is no
additional Account object or required account-assembly UI. Provisional fixture fields
now use `investigram`, `investigrams` and `investigramRelationships` for these
responsibilities. The [working vocabulary](structured-architectural-accounts-consolidation.md#working-vocabulary)
also fixes content item, content type, content-type contract/schema, architectural
concept, follow-up option, presentation recommendation, architectural relationship,
investigram relationship and content association. Fixture spellings have been aligned;
governing definitions and product code have not changed.

**Exposure index** is the preferred name for the existing citation index. It records
supplied substantive investigram content, not reliance, endorsement or evidential
support. Context delivery preserves what was supplied and with which qualifications;
support remains attributed grounds for a claim. The working fixtures use `exposureIndex`
without changing propagation or correction rules. Decide when drafting whether to
include the governing/API/implementation rename as explicit semantics-preserving
cleanup; do not treat it as already adopted or automatically a separate backlog item.

### Consolidated investigram structure

The governing five-part description states information obligations, not a complete
schema or five disjoint compartments. Claims are assertions, not necessarily separate
records. The proposed keyed content items live inside Interpretation content; each
can express several claims. Child investigrams are complete separately identified
artifacts, not content items. Evidence, qualification and provenance apply across
content and substantive metadata and need not be physically duplicated.

Distinguish these responsibilities before adding fields:

- **Architectural content:** descriptions, prose, models and interactions, with
  supported content-type contracts and explicit references.
- **Organizing information:** referent inventory, qualified content associations, composition
  and relationships between investigrams. An entity description is content; saying
  that an investigram or item identifies/refers to that entity is organizing information.
- **Guidance metadata:** follow-up options and presentation recommendations.
  They describe ways to investigate or present information, rather than being parts
  of the architectural account. Their interpretive judgments remain qualified.

This is not a proposal for three generic wrapper fields. New entity declarations
are acceptance instructions anchored to identifying content; resulting entity IDs
belong to the common identity mechanism. Provenance and relationship records can
be referenced from an investigram. Indexes, current status and rendered diagrams are
not additional assertions to copy into its payload. The [ownership audit](structured-architectural-accounts-consolidation.md)
separates these responsibilities and their correction/delivery implications.

**Needs design — interpreted identity.** Governing documents allow implemented
architectural subjects but do not specify the proposed allocation/continuity rules
for interpreted referents such as Half-open. Specify their grounding, scope and
guarantees, and assess the corresponding decision/document changes. Subject remains
a role, while Entity names the architectural thing. A selected
passage, investigram or answer does not become an entity merely through addressability.
The proposed common mechanism does not erase producer-specific identity guarantees.

**Proposed governing clarification — relationships and patterns as Entities.** Treat
an explicitly identified architectural relationship, such as W, or an ordered pattern,
such as C-BB/C-BH, as an Entity when it is given an identity across investigrams. Distinguish
that identity from each qualified claim about its participants, conditions or occurrence.
Identifying W does not establish that waiting occurs; identifying a pattern does not
establish that the program implements it. The current Subject examples do not expressly
form disjoint categories, but this treatment must be made explicit in the governing
Entity/Relationship definitions and corresponding decision before implementation.
It is a separate governing-design item alongside interpreted identity, not an assumed
consequence of changing fixture field names.

Existing mechanical relationship claims, such as a module exporting a symbol, can
remain claims without independent entity identities. Nor does every structured edge,
addressable claim or relationship between investigrams become an Entity. Check existing
implementation assumptions when planning the extension; no general relationship
migration or change to mechanical identity guarantees follows from this clarification.

Extend existing immutable answer selection as needed for new subjects/content.
Investigation input selection and UI composition remain distinct responsibilities;
neither mutates a retained answer. UI grouping alone requires no new collection Lens,
assembled Projection or Workspace mechanism in this capability.

### What an answer owes for referenced subjects

Recommend qualified identifying support, not bare IDs and not automatic inclusion
of every definition as a selected constituent. A substantive subject reference should
have an intelligible identifying description or an explicitly unresolved contextual
designation, with exact inspectable support. Identity and descriptive qualifications
remain attributable; neither an association nor a label establishes semantic truth.

The application selects this support at answer construction and fixes its exact
references, supplied content and relevant qualification/revision context. Rendering
cannot fetch today's preferred definition and silently change an exact answer.
Preserve the descriptions actually grounding selected investigrams; do not reinterpret
an old investigram by automatically substituting a newer definition. Newer or competing
descriptions can be exposed distinctly as revision context or separate selected items.
When the whole containing investigram is selected through a correction replacement,
use that replacement's identifying content as current support. Retain the original
as labelled historical/input context where relevant. `affectedSubjects` describes
claimed correction scope; it does not exempt embedded items from replacement. This
selection rule does not prove the replacement true or reconcile competing descriptions.

**Human direction — competing descriptions.** When two investigrams describe S differently
without an explicit correction relationship, show both and supply both as investigator
context, preserving their separate attribution, scope and support. Difference alone
does not establish contradiction: investigrams may concern different conditions or
complementary aspects. Do not silently choose a winner or synthesize agreement.
For larger inventories, bounded delivery/discovery can preserve access to alternatives;
the two-investigram case needs no adjudication to make progress. Exact earlier answers
still retain their captured context.

**Proposed common investigram-relationship model.** The human proposes unifying qualified
relationships such as “A is an alternative to B,” “A corrects B” and “A is inconsistent
with B.” Recommend a shared representation of exact participating investigrams/roles,
relationship kind, reporting investigation and investigram, explanatory content, scope,
evidence and qualifications, with type-specific validation and consequences. Alternative
does not imply error or replacement; inconsistency reports tension under a specified
scope; correction explicitly proposes a replacement for an identified error. These
meanings are not mutually exclusive classifications of investigram pairs. Common machinery
does not require a generic graph ontology or one identical payload for every kind.
Mechanical composition and exposure remain distinguishable from interpreted relations.

**Relationship as qualified organizing metadata.** The human identifies an indexable
domain type with participants/roles, kind, explanation and qualified support, and
suggests that its role in organizing investigrams favors metadata rather than ordinary
architectural content. Recommend explicit relationship records supplied alongside
investigrams in the investigation result. They can be interpretively generated while
serving as metadata in the retained model. This does not automatically make each
relationship an investigram or designate it as an architectural entity. Exact submission
packaging and physical storage remain open.

This refines the preceding partition analogy: if a relationship assertion lives
as ordinary content, embedded versus separate investigram is the same question as
for a subject description. Giving investigram relationships their own organizing role
provides a reason to choose a distinct qualified record instead. The cost is that
their challenge/revision behavior then needs its own explicit contract; it is not
inherited merely from investigram addressability.

“Metadata” specifies function, not epistemic authority. Preserve the reporting
investigation and investigram, reason, evidence, scope and qualifications as inspectable
information actually supplied in context. Do not create an unqualified link plus an
optional explanatory paragraph. New relationship records can be indexed against
existing investigrams without mutating their original content or exact answer snapshots.
Calling the material metadata does not exempt it from existing attributable-support
and complete correction-context delivery requirements. For the correction path,
retain the existing reporter-exposure rule: substantive delivery of K's explanation
records exposure to TRIAL-1 and permits evidence attribution to that reporter, not K. Bare relationship
and endpoint IDs do not. This delivery alone does not supply TRIAL-1's complete own
content. Physical storage on K and substantive attribution to TRIAL-1 are compatible;
no duplicate prose field is required. Independent relationship exposure entries or revocation
would be separate extensions, not implicit consequences of indexability.

**Agreed distinction:** use “investigram relationship” for this organizing mechanism.
Its participants are retained investigrams; kinds such as alternative,
correction and inconsistency organize explanations and can affect their selection
or status. Architectural relationships, such as an execution waiting on a breaker
or a policy delegating to another, are claims within investigrams about the described
software. They belong to architectural content types, not this investigram-relationship
type, and their presence does not trigger investigram revision/status behavior. No shared
domain relationship abstraction is required. Mechanical composition and exposure
also retain their own established meanings. Working names are not adopted API names.

**Relationship standing remains open.** Currently a Correction
is a distinct retained record with a reporting investigram; the correction record
itself is not an eligible investigram correction target. Revising its reporter does
not retract or retarget the original relationship. Our first K sketch followed that
shape, not an adopted representation for the new common model.

The earlier recommendation to give K its own investigram was premature. The current
metadata proposal favors a qualified relationship record; a mechanical index exposes
the assertion without independently authoring another claim. This is a recommendation,
not an adopted replacement for the existing correction representation.

The human cautions that whether/how K can be challenged requires considering the
implications of challenging a correction. Distinguish recording disagreement with
K, revising the investigram that asserts K, and withdrawing/changing K's operational
effects. Do not assume these are the same action. Whether a disputed or superseded
K influences current selection and reconsideration remains open, as does any
independent relationship-targeting operation. Preserve assertion/history and other
applicable relationships; a challenge does not itself establish A's correctness
or B's error. This question is distinct from deferred reassessment of investigrams
exposed to corrected context. No automatic withdrawal exists today.

**Reassessment — recommend deferring detailed design and delivery.** The human
recognizes reassessment as within the product's remit but suggests keeping it in
the backlog unless it affects the present architecture. Current correction records
already have stable identities, and reconsideration is derived per cause without
mutating investigrams or historical answers. That supports later extension; it does not
implement clearance. Keep only these compatibility checks in the current design:

- Preserve exact investigram and correction-cause references, reporter/support and
  exposure history, rather than storing only an unexplained permanent warning bit.
- Keep current reconsideration status derived and allow future qualified assessment
  records to participate in that calculation without rewriting earlier investigrams.
- Do not constrain the common relationship model to unqualified binary edges only;
  a future assessment must be able to identify both an investigram and a correction cause.

Defer assessment outcomes, delivery requirements, competing assessments and downstream
clearance rules. A future probe can use A corrected by B under cause K, C exposed to A,
and D exposed to C, with an independent second cause. Any eventual clearance must
distinguish resolution of K from global correctness and downstream reassessment.
The accepted decision already anticipates this work. For now concerns may remain
uncleared; that is a disclosed limitation, not a reason to broaden the current scope.
Current exposure still does not establish reliance. This is the present scope
recommendation, not an adopted clearance policy or implementation authorization.

**Composition evidence sharpens this planning risk.** The ordering-only
COMPOSITION-DEFINITIONS-1 shares seven delivered-investigram exposure entries with the synthesis.
A later component correction can flag it, and that cause can propagate to later
consumers of the definition; a smaller unit of exposure is not a transitive isolation
boundary. The current slice has no operation to clear an assessed-as-unaffected
investigram. Before completing the planning package, explicitly accept this limitation
for the first capability or prioritize a bounded reassessment probe. This raises its
planning priority without authorizing implementation or reversing the agreed scope.
Per-output exposure is an alternative requiring a consequential revision of the
current evaluation-wide delivery rules; agent-selected evidence or claimed reliance
cannot silently substitute for actual delivery. Separate evaluations can limit actual
exposure but add orchestration. Preserve the cause-specific history whichever future
policy is chosen.

**Proposed investigation — reconcile selected investigrams.** The human proposes selecting
investigrams and asking to reconcile them. Recommend supporting this as an explicit
qualified investigation, not a display operation or an automatic consequence of
showing investigrams together. Its objects of examination are the exact selected investigrams;
they need not describe the same subject. The investigator can inspect their support
and acquire further evidence through the normal dialogue. This requires a request
contract for multiple investigram inputs; it is not claimed as an existing operation or
added to the first delivery's scope yet.

Reconciliation means investigating how the investigrams relate, not guaranteeing agreement.
Possible results include explaining compatible scopes, supported correspondence or
conflation, a new synthesis, explicit corrections where justified, or an unresolved
disagreement with missing evidence identified. New interpretation is retained with
its own support and provenance. Synthesis does not automatically supersede its inputs;
correction requires the existing exact-target, complete-delivery and qualification
rules. Subject merge/split and reference rewriting do not follow automatically.
Earlier investigrams and exact answers remain available. A useful negative probe is a
case where the evidence warrants leaving the investigrams unreconciled rather than
producing a compromise. UI selection mechanics remain out of scope.

**Scope agreement — human pushback to interpreting agents is deferred.** Leave
human-supplied challenges, clarifications and additional knowledge as investigation
material out of this capability for now. Distinguish the implemented
[inadequacy feedback](../docs/capability-reference.md#scope-of-this-reference), which
is feedback to developers/researchers, not to interpreting agents, from an
architectural assertion or challenge supplied as investigation material. General participant-material capture
is not implemented, but is already permitted by the
[foundation](../foundation/product-design.md#participant-supplied-architectural-material)
and [accepted participant-exchange direction](../docs/decisions/specialized-architectural-investigation.md#external-participants).
It therefore requires capability/contract design, not necessarily a foundation
revision. Selecting existing investigrams for reconciliation need not introduce this
broader input channel. Supplying “this is wrong because …” would need attributable
participant content and explicit investigation use; neither feedback nor assertion
automatically corrects retained investigrams. Keep that broader work separate here.
Reconciliation of explicitly selected retained investigrams remains a proposed operation,
without a human-pushback channel or a commitment to include it in first delivery.

In the walkthrough, selected input descriptions and the new result's identifying
associations supply that support. FOLLOWUP-ANSWER-1 supplies identifying support for
S from DEFINITIONS-1 without making that investigram a selected constituent. A fresh
replacement-aware selection from INTRO-1 supplies support for ADMISSION-2's new
roles from ROLE-DEFINITIONS-1 even though that child is outside INTRO-1's tree.
These support obligations hold regardless of how a UI chooses to group or display
retained information; basic intelligibility cannot depend on a separate assembly step.

Avoid unlimited recursive inclusion of definitions. Supply enough qualified context
to distinguish the intended referents and disclose ambiguity or unavailable support.
**Needs design:** specify support selection, bounds, intelligibility/completeness
checks and behavior when adequate support is missing. These rules cannot be left to
renderer inference. A concise identifying description is not the complete investigram
and does not confer correction eligibility. Identifying excerpts carry their source
investigram's applicable qualifications, basis and revision context, as well as item-level
support and qualifications. Supplying an excerpt records exposure to its containing investigram;
partial delivery does not establish a complete correction target.

Human presentation alone does not create investigator exposure entries. If this support is
later supplied to an investigator, its substantive content counts as exposure even
though it is not a selected constituent. Retention alone is not delivery.

### Retained-access semantics at the application boundary

Retain these distinctions independently of UI design:

| Application operation | Required behavior |
| --- | --- |
| Retrieve an exact retained answer | Preserve its content, selected references, identifying support and captured qualification/revision context. |
| Inspect an exact investigram afresh | Keep that investigram as the target while supplying explicitly selected current revision context. A replacement does not silently retarget it. |
| Select retained information using current replacement policy | Disclose requested originals, selected replacements, conflicts and relevant qualifications. Capture the resulting selection; later history does not mutate it. |
| Investigate selected subject(s) | Apply a declared Lens and parameters with explicit selected/acquired context; record actual deliveries and supporting basis. |

Fresh access can capture later revision context; exact answer retrieval cannot.
Replacement-aware selection does not reinterpret an unchanged investigram by substituting
a newer definition into its original descriptive context. Newer definitions may be
available separately with that difference visible. Retained selections with equivalent
selected content and captured support/revision context have repeatable identity. This
is distinct from investigator dispatch/reuse: request-time inputs include operation,
subject, parameters and selected seed context; acquisitions made during the dialogue
are known only afterward and recorded in provenance. Reusing a retained investigation
is not a guarantee that a fresh dialogue would acquire the same context or result.

The application supplies the selected qualified information; the UI can arrange it.
Alignment needs supplied identity/correspondence and synthesis needs qualified
analysis. No new assembly Lens or revision-mode UI is selected here. **Needs design:**
extend existing retrieval/selection contracts for new references and identifying
support, without introducing a saved collection solely to support display grouping.

### One entity mechanism across producers

Use a common entity/reference contract for declaring/reusing entities, retaining
qualified information, validating references, indexing associations and selecting
content. Mechanical analyses and interpretations must remain compatible with that
contract. Existing modules are architectural subjects too; avoid allocating parallel
architectural module IDs merely to use them in interpreted investigrams.

Producers still differ. Mechanical discovery preserves its deterministic
same-Session identity and capture rules. Interpretation uses supplied IDs and new
declarations. A compiler-derived export claim and an interpreted responsibility
investigram can concern the same module M without sharing an epistemic guarantee.
Mechanical results do not become investigrams to fit the common mechanism.

Mechanical analysis introduces/reuses entities and supplies qualified identifying
information, not their definitive architectural meaning. An entity ID may be opaque,
but allocation must reuse mechanically established identity within its supported
scope rather than minting a fresh ID on every encounter. UUID spelling would not
replace the provider's identity rules. An interpreted policy kind P can still differ
from its implementing module M.

A result records its selected entity subject(s) as referents and can identify additional
entities it concerns. Selected-subject provenance, result referents and associated
qualified items remain distinct: selection does not establish that analysis succeeded
or produced a definition. Every child need not duplicate the evaluation's entire
subject list; referent membership belongs to the content/scope of that result unit.
Qualified identifying, classification, behavior and open-topic items can all attach
to an entity through exact investigram/content associations. Merely mentioning the entity
is a separate discovery relationship. No common authoritative entity definition is
assembled by either producer.

The human confirms that commonality is necessary at the subject-facing level; how
deeply producers share internal mechanisms can emerge later. A common entity/reference
contract does not by itself settle allocation, storage or migration implementation.
Demonstrate compatibility with an existing mechanical subject in the bounded path;
shared internal retention/allocation machinery or migration of mechanical producers
is not a prerequisite. Any such implementation scope needs a separate choice.

The common entity contract includes qualified-information retention as well as identity
and indexing; it need not eagerly compute every mechanical item before Lens
evaluation. Common allocation does not prevent independent discoveries of duplicate
referents, including an interpreter describing a symbol whose mechanical ID it was
not supplied. Reuse known references; preserve unresolved duplicates for qualified
correspondence rather than promising automatic semantic deduplication.

A policy kind implemented by M may be a different subject, connected by a qualified
implementation relationship. What something is, how it was discovered, and how a
particular claim is supported remain distinct.

Qualifications must remain attributable to the portions they qualify. Shared
enclosing support may avoid repetition where it actually applies; neither association
with a subject nor inclusion in one investigram extends evidence to unrelated claims.
The walkthrough permits shared support storage but makes each child self-contained
in qualification delivery: no substantive limitation is inherited implicitly from
a composition parent. The target's own delivery must include its applicable limits.

### Content items, topics and content associations

Use a small extensible vocabulary for information requiring special handling,
including content types needed by the selected diagrams. Each type has an identifier
and a content-type contract: required data, meanings, reference and qualification rules.
A schema specifies the mechanically checkable shape within that contract. These are
distinct from an architectural concept and from the item instantiating the type.
Investigators select from a defined, extensible catalogue of supported types; they
cannot mint a type identifier and expect PostCode to understand its structure. They can
invent meaningful topics and identify concepts using supported content types. Content type and the
role an investigram plays for a particular subject are separate dimensions.

Exact investigram references identify interpretation correction targets; a finer
item address does not authorize a sub-investigram patch. Titles or topic labels
support discovery; matching labels never imply replacement or equivalence. An
invented topic does not acquire specialized rendering behavior by its name.

Investigrams explicitly identify existing subjects they refer to as well as new subjects
they introduce. Structured content uses these references as participants/endpoints;
prose may carry a reference inventory without token-by-token annotation. One
concurrent-caller investigram can concern Half-open, a shared breaker role and execution
roles without being copied under each subject.

Keep these relationships distinct:

- **Refers to** supports navigation and finding mentions.
- **Describes** is a qualified association for selecting investigrams about a subject.
- **Identifies** is a proposed qualified association role saying which subject an
  investigram supplies an identifying description for. It is not a whole-investigram kind.
- **Supports** attributes evidence or prior interpretation to particular content.
- **Architectural relationships** describe the program, such as ownership or waiting.

For example, DEFINITIONS-1 identifies S, S-open and S-closed, and may describe P
without identifying P. ROLE-DEFINITIONS-1 identifies its new roles and W while
describing their relationship to P. A behavioral investigram can also identify a subject;
the separate definition-child pattern is useful here, not mandatory everywhere.
Definition lookup uses the per-subject identifies association, exposing candidates,
scope and correction/conflict context. It does not infer identification from a
describes association plus an investigram-wide label. No unique authoritative definition
is implied. **Needs design:** settle the exact role vocabulary, its relationship to
describes indexing, and qualified validation; the role must remain explicit.

The selected input subject and actual prior-content exposure are separate again.
Extend the existing referent/association machinery rather than maintain duplicate
inventories with unclear ownership. Index results expose IDs, roles, titles, scope
and revision context; substantive titles and summaries count as exposure, not
complete delivery. Rich listings can therefore broaden later reconsideration.
**Needs design:** choose useful listing content and bounds while preserving those
exposure rules; relabeling substantive text as metadata cannot avoid them.

**Referring-investigram discovery.** The human's direction is that investigrams explicitly
listing S as a referent must be available to an investigation of S, either supplied
up front or discoverable/retrievable during its dialogue. ADMISSION-1 can therefore
be found through its Half-open reference without a describes-S association or known
navigation origin. Index implementation is an engineering choice.

Ordering by retention time is a possible discovery aid, not evidence that an investigram
is authoritative, most applicable or the one the human came from. Preserve known
origin separately; leave it unknown when absent. Bare-reference results are not
content exposure; substantive titles/descriptions and retrieved content are.
**Needs design:** referent-based discovery/retrieval contracts that preserve
qualification, exposure and disclosed limits. Current association lookup needs
extension for this capability. An origin-free fixture can stipulate an ordering and
delivery bound without selecting the general discovery-ranking policy.

## Introduction and change

### Dialogue-based context acquisition

The human emphasizes that interpretation already runs through a dialogue: initial
context need not be the final selection of everything the investigator can use.
PostCode can expose available retained material and let the investigator request
what it needs. Prefer exploring a hybrid: supply useful identifying descriptions
and known contextual origin initially, then make additional attributes/investigrams,
alternatives and supporting material discoverable and retrievable on request.
An inventory-first approach is another option where even identifying context is large
or ambiguous. The subject-reference/association extensions still need to make the
new material available through the existing dialogue machinery.

“Bounded selection” therefore concerns manageable deliveries and disclosed omissions,
not a rigid initial cutoff beyond which retained information is inaccessible. General
dialogue/resource limits still apply; retrieval is not promised to be unlimited or
exhaustive. Record actual deliveries and qualifications throughout. Substantive listing
content counts as exposure; bare IDs do not. A correction target may become eligible
after complete content is acquired through later requests in that evaluation.

The initial request records its selected seed context; provenance also records what
the dialogue actually supplies afterward. Available, requested and delivered material
are distinct. Do not make unknown future acquisitions part of a pre-execution request
key. Request-time identity includes the selected seed context; any reuse policy must
separately state when later retained-context changes require a fresh investigation.
**Needs design:** access to the new retained content, full/partial delivery and
omission disclosure, and how acquired support is fixed in exact answers. The hybrid
above is a provisional example policy. General initial-context selection, discovery
ordering, dialogue budgets and reuse eligibility/freshness belong to surrounding
application design. Preserve the information those policies require without making
their general design part of this capability.
Do not treat this as a requirement to choose all relevant investigrams before starting.

### Entity introduction, reuse and contextual selection

The purpose of entity identity is to organize accounts and their qualified items
around the same architectural things, without requiring their descriptions to agree.
Keeping all investigrams alone does not establish which concern the same thing. One
investigram can concern several entities; each entity can have identifying descriptions,
classifications, behavioral items and other topics, as well as merely referring investigrams.
These are explicit qualified content associations, not authoritative mutable entity fields.

Use one introduction mechanism. An analysis explicitly identifies new entities with
local IDs, names and attributable identifying information. PostCode allocates global
IDs when accepting the result, resolves all local references and retains introduction
provenance atomically. References to existing entities use their supplied global IDs.
An opaque ID, potentially a UUID, is a representation choice; no agent-generated IDs,
preallocation dialogue or additional registration decision is required. Fixture IDs
such as S are readable aliases. Equal names never establish identity.

Every explicit entity designation participates in this mechanism. There is no second
class awaiting promotion because it has not yet proved useful across investigrams.
Whether PostCode eagerly builds an entity record and its associated information or
resolves that information through indexes is an implementation choice. Submission-local
entity keys differ from content keys, graph-node keys and other structural addresses:
those addresses do not automatically designate independent architectural entities.
New descriptions can name an existing entity without introducing another identity.

**Contextual selection is an investigation input, not an introduction route.** A user
can select “application work has not started” and choose Explain. The subject is the
exact passage in its investigram context, not a newly allocated entity named after the
sentence. A selected diagram component likewise resolves to its retained content;
renderer coordinates or generated display IDs alone are insufficient. Preserve an
existing explicit entity reference when present. A selection assembled from several
claims does not establish that their referents are identical.

The resulting investigation may simply explain the selection, reuse an existing
entity, or explicitly introduce an entity with qualified identifying information and
origin in that selection. PostCode does not decide entityhood from arbitrary wording.
Likewise, an ordinary local content designation is selectable without later promotion;
if analysis identifies an architectural entity there, it uses the same introduction
mechanism. Earlier investigrams and exact answers remain unchanged.

**Needs design:** contextual selection's exact reference shape, qualifications and
repeated-selection behavior; interpreted entity identity and acceptance guarantees.
An investigram plus stable occurrence selector can identify the selected content, but
neither repeated wording nor the same content key in a replacement establishes entity
continuity. Reuse an explicit global entity ID or report qualified correspondence.

Later context supplies entity IDs with the relevant qualified descriptions. The
investigator can reuse only identities made available to it; duplicate discoveries
remain possible. New items identify their associated entity IDs and exact containing
investigrams/content keys. Replacement additionally identifies the earlier investigram,
its replacement and supported reason: an entity ID cannot select among descriptions.
All references must resolve at acceptance, with no partial entity creation on rejection.

### Continuity, classification and reconciliation

For an ordinary correction, S remains Half-open while H1 and H2 are different
qualified descriptions of S. Complementary information need not replace H1.
Clarifying “as used in A” need not imply that the contextual description was false;
the exact refinement/supersession treatment remains open.

Classification such as state, relationship or module should be attributable and
revisable, allowing unknown, multiple or disputed classifications. Keep it separate
from record kind and producer provenance. A free-form assertion that something is
a module cannot grant compiler capabilities; Lens applicability also requires the
actual supported analysis context.

**Agreed exploratory direction — concept associations.** A subject may have several
qualified concept associations: Foo may provide priority-queue behavior, be a shared
mutable resource, and serve as a scheduler's pending-work queue. Preserve the sense
of each assertion (implements, is an instance of, uses, or plays a role), its scope,
origin and support; do not collapse these into an intrinsic unqualified type field.
Compatible aspects and conflicting classifications must remain distinguishable.
A compact classification can provide useful context without rediscovery, with fuller
support requestable. Its substantive delivery still records exposure to its containing investigram;
calling it a tag does not remove qualification or exposure obligations.

**Surrounding application design — interpretive Lens options.** The broader app needs
to define what makes a question applicable
to a qualified or initially unknown subject, the support it requires, and how an
option is explained. Classification may inform this without becoming established
fact. Deferring compiler capabilities does not by itself settle interpretive options.

<a id="global-investigation-entry"></a>
**Illustrative application context — global entry investigations.** Retain both Overview
and Explain in a small globally defined set. Global means the operation is known to
PostCode before an investigator proposes an option; it does not guarantee applicability
to every subject or require every operation to be displayed everywhere. Supported
subject/basis/method constraints still apply. The purposes below provide usage
context for this investigram design, not its implementation deliverables:

| Investigation | Information need |
| --- | --- |
| Overview | Broad architectural orientation: what the selected subject is, its responsibilities, important concepts and relationships, and ways to investigate further. |
| Explain | Clarify the selected subject, including its meaning and role in supplied context. Particularly useful for something selected within an explanation, but not restricted to that route. |
| Find available investigations | Investigate applicable questions for selected subject(s) and context, returning options without requiring an existing option or human-authored question. |
| Follow-up investigation | Execute an exact retained follow-up option, with its declared selections/parameters, as described below. |

Overview versus Explain is a distinction of information need, not simply long versus
short output. Exact applicability and parameter contracts remain surrounding
application work; these names do not imply the current implementation supports all
these routes.

Existing structural queries/Lenses, including module listings, provide possible
subjects for Overview or Explain. They keep their mechanical methods and guarantees;
subject discovery need not itself be an interpretive investigation. Another entry
route selects a term, passage or component within an existing explanation and uses
its contextual designation for Explain. These “impromptu subjects” are selections
of exact content occurrences with available origin, not a separate entity class.
An investigation can explain that occurrence without allocating an entity, or explicitly
introduce an entity with identifying information grounded in that context. Selection
alone does not establish entity identity or settle what the passage refers to.
The contextual-selection rules above govern the input; only explicit entity
introduction in a result allocates a new entity identity.
Neither entry route requires the human to formulate an architectural prose query.

**Agreed exploratory direction — selectable “find out more” options.** Treat options
as explicit investigram guidance metadata, not architectural interpretation-content
items. They can be communicated to a user or investigator without becoming part of
the architectural explanation. The human should select an available investigation
rather than formulate its question in prose.
An investigator may return applicable options with its result or through a generic
request to discover available investigations. The option's meaning is atemporal;
“recommended next” is an optional annotation tied to a particular inquiry, not a
required sequence. Concise concern labels and explanatory blurbs can accompany it.
For example, “Compare wrapping orders” can identify timing/resource occupancy as its
concerns without presupposing a measured performance effect. An annotation asserting
an architectural effect requires qualified support.

Retain the originating investigram, exact subjects/roles, applicability and scope. A
label, intelligible purpose, supported interpretive method and selectable parameters
can specify the request behind the option; agent-facing instructions may use prose.
These fields are recommendations to work through, not an adopted option schema.
Options from different investigrams can coexist. Generating an option does not add a new
executable capability or establish that the set is exhaustive. Automatic selection
of operations from concept tags is a separate, deferred treatment; dynamic options
need not depend on a complete operation ontology. Qualified option content, exact
references and delivery/validation are investigram-design questions. General availability
and discovery are surrounding application work; production invocation is a separate
first-delivery scope choice, not implied by the retained follow-up option fixture.

<a id="offered-followup-investigation"></a>
**Illustrative application context — Follow-up investigation Lens.** Use a general
follow-up Lens whose subject is the exact retained investigram containing an option,
and whose parameter identifies that option by a stable key local to that investigram.
The subject is the retained investigram, not the transient execution record of the
investigation that produced it. Additional selections can fill parameters declared
by the option; human-authored prose is not required.

For example, the user selects “Compare wrapping orders.” The request names the
originating investigram and its option key. That retained follow-up option supplies the question,
P and B as architectural targets, their unordered selection semantics, the supported
interpretive method and any selectable parameters. “Composition order” need not
become a globally predefined Lens: the follow-up Lens provides the invocation
mechanism, while the selected option specifies the architectural investigation.
The fixture stipulates a request shape to test exact option resolution and provenance;
it is not an implemented API. Investigram-content validation remains in scope. General
Lens applicability, parameter interaction and request reuse policy remain surrounding
application work.

Keep invocation subject and architectural referents distinct. The new explanation
can describe P, B and their ordered patterns, with corresponding associations, even
though the request selects the originating investigram. Record the exact originating
investigram/option and actual supplied context as follow-up provenance. The new result
does not append a child to the immutable original or establish a correction merely
by following its option. The UI may expose the option while showing its relevant
subjects without requiring the user to navigate back to the originating investigram.

Selecting an option need not deliver its source investigram's complete own content.
The substantive option and supporting content actually supplied retain attribution,
qualification and ordinary exposure semantics; bare identifiers alone do not count
as content delivery. Option delivery does not by itself establish complete-target
eligibility. Resolve the exact option, preserve its scope and disclose applicable
revision/reconsideration status; do not silently substitute an identically named
option from a replacement investigram. Options remain within supported investigative
capabilities rather than creating executable operations by declaration.

**Interpretive result contracts.** The default prospective contract can be a qualified
investigram with supported content types, valid references, evidence, qualifications,
composition and accompanying records. A selected option supplies the question and
scope within supported investigative capabilities; it need not declare a specialized
schema for each question or a list of mandatory diagrams. The general contract is
explicit rather than “arbitrary content in an investigram wrapper.” Each returned type
must satisfy its own contract. A general compatible Presentation handles supported
content, while a particular diagram requires suitable materialized content. An option
cannot create a new method, type or renderer just by naming one.

A request can specialize that default when its promise warrants it. “Explain recovery
behavior” leaves type selection to the investigator. “Generate a state diagram of
recovery behavior” requires qualified state-behavior content sufficient for that diagram
and a compatible diagram Presentation. The investigator supplies architectural meaning;
the renderer produces the picture. Missing evidence, permitted partial results and an
unmet diagram request must be explicit. A prose-only investigram can satisfy the former
request but cannot silently satisfy the latter. This optional specialization preserves
the governing prospective-contract and Presentation-compatibility obligations without
requiring a tailored result schema on every option. Exact encoding remains design work.
The [option example](structured-account-example/followup-options.md#optional-diagram-contract)
compares the two promises; the existing concurrent-callers fixture retains the general
contract and does not require the agent to choose its diagrams in advance.

The [bounded retained follow-up option example](structured-account-example/followup-options.md)
exercises investigram-owned option metadata in both partitions: ADMISSION-1 returns
an option, the existing follow-up invokes it, and ADMISSION-2 has no repeated option
because TRIAL-1 in that submission already addresses the question. Access probes distinguish an option excerpt, complete own
content, captured answers and fresh correction disclosure. No global option-discovery
system or initial admission-entry design is added to the remit. Other illustrative
request paths retain their documented assumptions.

**Settled exploratory direction — metadata belongs to its exact investigram.**
Referent information, associations, follow-up options and presentation recommendations
are about that specific immutable interpretation. A replacement supplies its own
metadata; earlier metadata remains with the earlier investigram and its exact references.
For example, A1 says “Foo is X” and options investigation of X; A2 corrects that to
“Foo is Y.” The X option does not carry forward as guidance for A2. A question about X
may independently remain interesting without being A2's follow-up option.

This version-specific behavior is appropriate, not a continuity defect. Withdraw the
recommendation to move options to a parent or guidance child merely to preserve their
addresses; no separate guidance lifecycle is needed. A repeated option in another
investigram would be a new explicitly supplied option at a new address. Matching wording
establishes neither continuity nor automatic invocation/reuse. In this example ADMISSION-2
omits the option already addressed by TRIAL-1. This does not redefine atemporal "find out
more" options as only unanswered next steps or prohibit useful reinvestigation. Earlier invocations retain their
exact option provenance. Historical access and fresh correction disclosure remain intact;
human browsing alone does not create investigator exposure.

**Remaining metadata contract details.** Preserve applicable qualifications and exact
addresses when metadata is delivered independently. Moving options out of content does
not make an excerpt complete-investigram delivery or waive evidence/exposure rules.
The structured originating-occurrence field for an entity introduced from selection
remains open: it records an exact investigram/item/selector, not equivalence or delivery.
The next fixture pass should encode this ownership and delivery envelope, not reopen
whether options need to survive correction as the same objects.

The composition probe supplies concrete scoping evidence: P/B is an unordered set of
component kinds for a question covering both orders, with no outer/inner meaning in
input position. Its output introduces C-BB and C-BH as qualified ordered-pattern
subjects; subsequent pattern investigation can take one subject. This supports
starting multi-subject options around explicit joint/comparison questions, rather than
requiring a pair for every composition follow-up. It does not settle generic Lens
applicability, arity, role assignment or matching from classification alone.

Architectural relationships may themselves be explicitly identified as entities,
with qualified investigrams. A structured relation or prose mention can also remain
content without an independent entity designation; identifying one uses the same
entity-introduction mechanism. A relationship investigram supplies participants,
roles, conditions and direction/order where meaningful; its identity alone supplies
none of those claims. Equal labels or endpoints do not establish relationship identity.

For W, recommend identifying the waiting relationship between the particular caller
role and the shared breaker role's recovery decision in the named usage pattern.
Keep default configuration, occurrence and waiting conditions in qualified behavioral
claims, as with S's behavioral scope. Allocating W does not establish that waiting
occurs. A change to conditions normally corrects the behavioral investigram; a mistaken
participant or identifying characterization can also require definition correction
or a different referent. The definition/behavior boundary is not an exemption from
qualification, and identity continuity remains an explicit judgment.

If separately introduced S1 and S2 appear to designate the same thing, record a
qualified correspondence and preserve both references and their original investigrams.
If S0 conflates two things, record that finding and introduce/reference S1 and S2.
Do not automatically distribute old claims or edges between them. A legitimate
whole with two parts is not necessarily a conflation.

**Split candidate proposed by the human.** Preserve S0, optionally relabel its current
designation as “conflated X and Y,” and introduce/reuse separate references for X and
Y. Retain a qualified conflation finding connecting them. The finding, not the label,
carries the claim; it can itself be contested. S0 continues to identify the earlier
designation and its history, rather than silently becoming a new architectural union
object. Do not retarget its investigrams or distribute their claims automatically. Exact
earlier answers preserve their original labels/support; fresh access can expose the
later label and finding. This remains a candidate split policy, not an adopted rule.

There is a close precedent in [Wikidata's conflation guidance](https://www.wikidata.org/wiki/Help:Conflation):
it supports explicit conflation items and separation into distinct items. Its
[split procedure](https://www.wikidata.org/wiki/Help:Split_an_item) preserves statement
references while reorganizing items. Borrow the explicit diagnosis and separate
referents, not an automatic transfer of PostCode's immutable claims. PROV's
[alternate/specialization distinctions](https://www.w3.org/TR/prov-o/#alternateOf)
describe aspects of the same thing or more specific descriptions; neither should
be treated as a ready-made conflation split. These references provide useful patterns,
not a decision procedure for whether two architectural referents are identical.

**Proposed entity supersession and reconsideration.** An investigation can propose
successors when an entity conflates several things or separate entities designate
the same thing. A split can introduce S and E as successors to R; a merge can introduce
R3 or reuse an existing entity as successor to R1/R2. Preserve old IDs and original
associations, and retain the reporting investigram, reasons, qualified correspondences
and scope. A same-entity correspondence differs from a conflation/split relationship.
Supersession concerns an organizing identity, not automatic correction of all investigrams
about it. Fresh access can disclose successors; exact references still resolve to the
original entity. Do not redistribute claims, infer transitive equivalence or choose
between competing supersessions silently. The earlier relabeling idea is optional;
the qualified finding, not the label, explains what happened.

Entity supersession could cause investigrams explicitly referring to or associated with
the old entity to need reconsideration. Preserve this as a distinct cause from exposure
to a corrected defining investigram: entity use can occur without delivery of that investigram.
Correcting an identifying investigram already participates in existing exposure-based
propagation; correspondence or entity supersession does not trigger it today. A proposed
warning can say “This investigram refers to R, subsequently reported as conflating S and E.”
It does not declare the investigram false or automatically flag all its claims as wrong.
**Needs design:** supersession submission/support, affected-investigram rules, derived
status and competing/challenged supersessions. Clearance or narrowing after qualified
reassessment remains deferred. This is a compatibility/design probe, not an implemented
operation or an expansion of the first delivery to a reconciliation Lens.

Initially, prefer recording and exposing these investigrams over automatic merging,
transitive equivalence, pooled histories or graph rewriting. Later reconciliation
can build on them without making names decide architectural identity.

## Worked thread: admission → trial → correction

### Structured selection and context origin

The human's direction is to avoid requiring prose interaction with PostCode. A UI
makes a subject selectable and provides declared investigation choices; CLI handles,
menus or badges are possible mechanisms, not chosen designs. Natural-language
questions in these notes explain the request's meaning, not required user input.

Selecting Half-open does not by itself identify an explanation it was followed from.
When the interaction identifies an exact originating investigram/answer location, include
that explanation as contextual input under an explicit bounded policy. A bare subject
selection or a subject-list entry may have no originating explanation; record none.
Do not infer origin from the latest answer, the investigram that first introduced S, or
whatever investigram happens to mention it. Known navigation alone also does not establish
human reliance or actual investigator exposure.

Both routes should supply relevant retained identifying descriptions for S, their
qualified scope and revision/conflict context. A contextual selection preserves the
description used there, with later correction context distinguished. A subject-only
selection resolves identifying candidates through explicit associations; it need not
invent an origin to do so. Multiple definitions are not silently reconciled and the
entire subject history need not be supplied. **Needs design:** identifying-support
references, qualification and omission disclosure for subject-only requests. Examples
may stipulate candidate selection and delivery bounds; a general relevance policy
is outside this work. These guarantees are distinct from discovering every referring
investigram; a bare selection does not guarantee that ADMISSION-1 is found or available
for correction.

### Sequence — the definition-child alternative

This sequence uses INTRO-1/DEFINITIONS-1 and TRIAL-RESULT-1/ROLE-DEFINITIONS-1
from the child walkthrough. Complete JSON fixtures now exercise both this partition
and the mixed-content alternative in separate hypothetical Sessions; their investigram
IDs/composition must not be mixed. Both exercise the same introduction, option-based
follow-up, correction and retained-access obligations.

This adapts the [connected examples](initial-journey/cockatiel-account-examples.md).
Their static Cockatiel account concerns the recorded revision; the waiting omission
and its discovery are staged. This proposal adds no verification of library behavior.

1. **Entry and orientation.** A supported mechanical analysis identifies module M.
   An interpretation identifies Circuit breaker policy kind P, with a qualified
   connection to M. This establishes a path from ordinary application entry to an
   architectural subject. A fixture may seed orientation for narrower tests.
2. **Admission.** The result introduces Half-open S and describes admission under
   the stated recovery configuration. In the provisional walkthrough, INTRO-1 has
   DEFINITIONS-1 and ADMISSION-1 as children; explicit identifies associations locate
   the descriptions distinguishing S from an execution. ANSWER-1 fixes content and support.
   Other introduction/partition choices remain open in the broader design.
3. **Follow-up option.** ADMISSION-1 returns `concurrent-callers-option`, a qualified
   option targeting Half-open S, in qualified guidance metadata addressed by
   `{investigram, optionKey}`. The illustrative Follow-up investigation Lens
   takes ADMISSION-1 as invocation subject and the exact option key as parameter; S
   is its resolved architectural focus. The caller separately selects DEFINITIONS-1
   and complete ADMISSION-1 from ANSWER-1 as context. `informationNeed` is explanatory
   wording, not a prose request. Preserve the option origin, architectural focus,
   actual selected context and human navigation origin as distinct information.
   To correct ADMISSION-1, the investigator must receive the target's
   complete own content, referent and qualifications, and obtain supporting program
   evidence. An ID or subject summary does not suffice. Existing investigram follow-up
   also uses bounded delivery. Option invocation therefore does not guarantee correction
   eligibility without checking what was actually supplied.
4. **Extension and correction.** The follow-up reuses S, introduces the shared breaker
   instance and execution roles in ROLE-DEFINITIONS-1, and explains their behavior
   in TRIAL-1. Both are children of TRIAL-RESULT-1. The result also supplies
   ADMISSION-2 and an explicit correction of ADMISSION-1.
   Accept it atomically; preserve the original and its fixed composition. A new
   result does not append children to the old investigram; replacement composition
   remains disjoint as required by the existing contract.
5. **Current use and historical access.** The request returns its follow-up answer.
   Its referenced subjects have fixed identifying support without automatically
   selecting every supporting definition as a constituent.
   The UI may show definition children, ADMISSION-2 and TRIAL-1 together using
   application-supplied qualified information; this requires no additional synthesized
   investigram or saved assembly. Exact ANSWER-1 returns its
   captured selection/context; fresh inspection of ADMISSION-1 can disclose later
   corrections around the unchanged original.
   Neither operation silently redirects its exact reference.

H1/H2 illustrate subject-definition revision where a definition changes; they need
not be extra independently retained objects in every admission correction. An
omission in admission behavior may leave the definition's meaning unchanged. If H1
is embedded in the root's own content, however, replacing the root replaces that
content too and the replacement must supply its description. A separate definition
child is independently correctable; root replacement does not automatically carry
that child or a corrected successor into its new composition. The walkthrough tests
the child partition and retained access; a general partition policy is open.

The walkthrough's correction is reported by TRIAL-1. Its reason and qualifications
are substantively attributed to TRIAL-1 for exposure even when stored on
the separate organizing record K; they need not be duplicated inside architectural
content. Receiving them records exposure to TRIAL-1 but does not supply its complete own content.
A later correction of TRIAL-1 preserves the original
reporter and correction record; it does not automatically withdraw or rewrite that
correction edge. **Needs design:** any mechanism for changing a correction's standing
must be explicit. The example does not claim that capability.

Preserve three independent dimensions:

| Dimension | Example |
| --- | --- |
| Revision status | ADMISSION-1 has a replacement, possibly competing replacements. |
| Applicability | TRIAL-1 covers default single-trial recovery, not every configuration. |
| Answer selection | A retained answer captures its particular qualified items and support; UI grouping of several answers does not alter those selections. |

Existing replacement preference does not resolve conflicts. Exposure-based
reconsideration remains conservative: seeing an investigram is not proven reliance,
and its correction does not prove every exposed result false. Preserve current
propagation/exemption rules unless a later decision explicitly revises them.
On the receiving side, all investigrams from one evaluation share its conservative
exposure index, including definition children and replacements. Splitting that output
does not narrow its exposure entries. On the supplied-content side, exposure entries name particular
investigrams: an investigation receiving only a definition child need not record
exposure to its behavioral sibling, so a later correction of that sibling need not flag it. With
embedded definitions, even a definition excerpt records exposure to the mixed containing investigram.
Use explicit entity introduction as a signal of expected reuse: if the result
also explains behavior, put identifying descriptions in children by default, grouping
where coherent. This avoids a particular exposure path, not all semantic dependencies
or warnings, and requires no prediction of which later query will occur.

Agreement in discussion: the investigating agent may judge that new findings warrant
correcting an earlier investigram during an ordinary follow-up. It must explicitly
identify the correction and provide reason/support; new detail or an entity
does not automatically imply replacement. PostCode checks delivery eligibility and
submission validity without thereby establishing the correction's truth.

Agreement in discussion: an investigation concerning Half-open S can return one
or more qualified items associated with Circuit Breaker P, explicitly as additions
or as replacements correcting exact earlier investigrams. The architectural focus
guides the information need; it does not restrict output associations to that subject.
An addition preserves earlier items without implying error. A correction identifies
its target, replacement, reason and support and meets the complete-delivery rules;
the original remains retained. Both can occur in one accepted result.

Context and retained-content selections can be explicit. Automatic relevance
judgments, correspondence and synthesis establishing new claims require qualified analysis.
Capture actual selected input context: a stable subject ID alone is insufficient
as a reuse key when its supplied descriptions change.

**Needs design — request and origin.** Specify how the bounded request represents
selected subjects, exact investigram/option references and supplied context, and how actual
deliveries are recorded. Stipulate a context policy for verification; do not require
a general relevance or reuse-freshness policy. Origin records lineage; it affects
answer/reuse identity when it changes substantive selected input or qualification,
not merely because the human reached the same request differently.

### Shared local roles and exact illustration addresses

Use one optional role mechanism in the structured content-item envelope across types:
`roles` declares item-local variables, `roleScope` qualifies their binding, and
`illustrations` supplies qualified mappings to scenario subjects and exact target items.
The admission item exercises this mechanism. The scenario state item references R
directly; a local name for that same participant adds no variable or generality.
An illustration maps a general investigram to an example, not two names for one scenario
participant. Keys remain scoped to exact items, not investigram-global or matched by name.
A local role is not an entity. Broader applicability still requires qualified
interpretation; syntax alone does not generalize the state model.

Cross-investigram item addresses fix an investigram reference plus a content key. Local keys
inside the item can further designate a role, case or relationship occurrence under
the type's rules; that is not independent correction identity. Supplied qualified
item content records exposure to its containing investigram. Exact answer support/revision context stays
fixed. Fresh illustration access may report the target investigram's current revision
status while preserving the original item target. A superseded investigram does not prove
its particular illustrated item wrong, and matching replacement keys do not justify
retargeting. The explicit same-result link makes disclosure possible without becoming
an exposure entry or a new reconsideration/clearance rule.

The children fixture uses one owning position per investigram: result root, ordered child
slot or correction-replacement root. All positions are reachable through child and
reporter-to-replacement ownership links, without cycles or shared subtrees. Content
references do not supply ownership. Children have their own applicable qualifications and identifying associations;
replacing the behavioral child leaves the identifying child unchanged. Self-contained
qualification means judging each child's own claims, not copying every restriction.
State-category identification carries basis/method limits without a default-sampling
restriction; scenario role identification retains the single-slot context needed to
distinguish those roles. Removing limits requires checking support or narrowing claims,
not simply deleting inconvenient qualifiers. Minimal identifying support need not
include occurrence/release behavior: exact related-content links can locate that
explanation without supplying it or recording exposure to it. Fresh selection discloses displacement rather than mutating the old tree.

### Composition as a design probe

Test both wrapping orders using separately qualified breaker and bulkhead investigrams.
Content must distinguish outer/inner instance roles, their owned state/resources,
and where execution can wait. The examples contrast capacity occupied while
waiting for recovery with an admitted trial waiting for capacity.

A new composition interpretation can reuse subject IDs and investigrams while
establishing these relationships with evidence. Selecting component investigrams side
by side does not establish composition semantics. Reusing a policy kind does not
identify instance roles in two patterns as the same runtime object.

**Needs design — contextual referents.** Distinguish Half-open as a state category
from that state as held by a particular breaker role in a composition pattern.
Retain the state, role and pattern context explicitly. Determine whether a compound
reference suffices or independently investigated applications need their own identity;
neither flat labels nor a universal contextual-identity primitive is assumed.

The [first composition probe](structured-account-example/composition/README.md) now
supplies a separate bulkhead investigram and two authored ordering investigrams continuing
the children variant. It reuses P/B/S, introduces the two ordered patterns, and keeps
scenario roles and waiting relations local to their interaction items. An explicit
situation records the bearer of S, occupied execution/queue/trial resources, and
application-work progress. Exact investigram/item/role/relation/situation designations
support follow-up without allocating a new entity automatically.

This is an initial recommendation to test, not a settled identity design. The cases
are possible finite prefixes under different explicit setups: the outer-bulkhead
case needs capacity for the later caller to reach the breaker; the outer-breaker
case uses a shared bulkhead occupied by independent work. Wrapping order alone does
not establish either wait. Qualified synthesis uses the component investigrams plus
wrapper evidence; it neither reuses earlier scenario R/W as identical objects nor
transplants their trace as a general template.

Probe-local interaction fields expose policy order, local relations and asserted
situations. Whether situations should become a separate catalogue type remains open;
that would require explicit role correspondence across types. The current one-item
role scope avoids that mapping and therefore does not validate it. No universal
resource ontology or general waiting-entity identity is established. Authored
fixtures and rendered sequence diagrams test representability, not live investigator
reliability or supported API acceptance. Whether generated composition investigation
belongs in the first implemented capability remains open.

The revised origin-free composition context selects ADMISSION-2, with K's qualified
reason and endpoint references. ADMISSION-1 is accessible on request but its content
is not delivered or recorded as direct exposure. K's explanation records exposure to its reporter, TRIAL-1;
this history disclosure is not complete correction context and claims no exemption.
Relevant conflicting investigrams and explicit historical requests remain reasons to
supply other content under the existing delivery rules.

The probe now defines and checks two exact nested selectors: a local relation key,
or a particular state assignment identified by situation plus bearer and category.
Unknown, mixed and ambiguous selectors are rejected. This exercises addressing, not
a live follow-up or entity introduction from selected content. Both composition traces still describe entry to
Half-open as action text; their snapshots are after-state assertions, not linked
transition records. A later need for transition-level correspondence calls for a
qualified general P-level state model or a scenario-local state-behavior item. Neither
is supplied by this probe, and the earlier TRIAL-1 statechart is not rebound.

## Structured content and diagrams

**Readability refinement.** The [four overview examples](structured-account-example/diagrams.md)
now use concise authored labels and a separate keyed legend. Proposed optional
`displayLabel` and `overviewScope` fields preserve a direct association with the
full qualified element; renderers may assign display-local references mechanically.
Keep meaningful names where possible, retain guard cues and a visible scope notice,
and put detailed conditions, effects, causes and support in the linked legend.
The mapping belongs to the exact diagram/legend pair, not entity identity. A selected
figure and legend are not automatically complete own-investigram delivery. This updates
the illustrative content contract without introducing a general presentation system.


**Discussion distinction and recommendation.** Retaining qualified accounts and
expressing architectural meaning are separate design questions. Reuse the subject,
association, evidence, immutable-investigram, correction and exact-access mechanisms
for structured interpretive content. Add content types that express the architectural
claims themselves. A transition record can refer to existing state and participant
subjects while its containing investigram supplies attributable support and limits.
It need not become a separate entity unless explicit identity across investigrams
requires that. Correcting the record initially means replacing its whole investigram,
not silently updating a canonical state-machine graph.

This is a recommendation about the domain mechanism, not a claim that the current
prose transport works unchanged. Each type needs defined meaning, reference checks,
qualification attribution and complete/partial delivery rules. Prose can remain in
conditions and explanations. Unreported transitions or conditions do not mean they
do not exist; coverage and unknowns must remain explicit. Structured content carries
claims with the same epistemic obligations as prose.

**Terminology recommendation.** Build on established architectural concepts, as
already directed by [the foundation](../foundation/product-design.md#illustrative-lens-families).
The [earlier concept references](initial-journey/architectural-concept-references.md)
provide a starting point, especially SEI Views and Beyond and its treatment of
behavior. Use precise distinctions such as module versus runtime participant,
state versus state occupancy, transition trigger versus guard versus effect, and
possible interaction versus observed execution. Record the meaning and any adaptation
of borrowed concepts. Familiar names alone do not import a formalism's execution
semantics, completeness assumptions or conformance requirements.

The two questions meet at content validation: retention can accommodate several
types, but validating a transition requires knowing what its fields mean. **Needs
design:** choose a small vocabulary for the admission/trial example and express one
state transition and one interaction through it before settling payload schemas.
These recommendations do not yet adopt a vocabulary or schema.

**Emerging proposal — architectural concept catalogue.** The human proposes that
PostCode supply established architectural concepts for two purposes: an agent-facing
vocabulary/ontology for framing investigations and explanations, and support for
communicating those explanations through diagrams. The vocabulary is useful even
when no diagram is appropriate. Use one structured content model: a supported type
can be as simple as a keyed prose explanation, and other types express states,
transitions or interactions. Results may combine these types. The catalogue is not
limited to diagram types; prose is content within the model, not a separate channel.

**Agreed exploratory direction — recognition without mandatory special treatment.**
A source-grounded catalogue can grow into a broad recognized vocabulary without
becoming a long user menu or a whitelist. Curate meanings, aliases and source-specific
distinctions rather than treating every scraped term as a standardized concept.
Agents may use an unregistered concept with a name and concise definition; do not
infer equivalence to a recognized concept merely from matching text. The catalogue
identifier denotes a meaning; association of that meaning with a subject remains a
qualified investigram claim. The associations are many-to-many, not one concept per subject.

Recognition alone does not promise an icon, special renderer, concept-specific
operation or automatic applicability rule. The human explicitly defers those special
treatments as future features the structure permits. Likewise, no comprehensive
hierarchy or automatic inference over concept relationships is required now. Existing
structured-type/diagram probes remain useful without implementing generalized
concept-dispatched behavior. Catalogue population can be incremental and independent
of specialized treatment; exact custom-concept designation/reuse remains to be designed.

An investigator can use a concept because the investigation requests it or because
the investigator judges it relevant. Recommend distinguishing concept meaning and
applicability guidance from its supported structured content types and diagram
mappings. A concept may support several types or no diagram type; several concepts
may contribute to a diagram. Returning a concept identifier does not by itself
require a diagram payload. The general interpretive contract is a qualified investigram;
content-type-specific checks apply to whatever supported types it supplies. Only an explicitly
specialized request, such as generating a state diagram, requires suitable diagram
content. A keyed prose item alone does not silently satisfy that promise; missing
information or unsupported output must be explicit. Exact request/result conventions
remain to be designed.

Recommend catalogue entries with stable identifiers, versioned meanings/contracts,
source/adaptation, applicability guidance, examples and treatment of partial knowledge.
Content types specify data requirements, potentially with JSON Schemas. Keyed prose
items and specialized types retain the same qualification requirements. Schema checks can validate shape;
reference and content-specific checks still need defined rules, and none establishes
the truth or applicability of the architectural claim. Versioned contracts preserve
the meaning of retained content when the catalogue evolves. Exact packaging remains
to be designed, including whether several content blocks share an investigram.

**Unified structure, including prose.** The human rejects a prose-versus-structure
split: a key with prose is itself a useful structured type. This can simplify the
proposed return protocol and makes prose items addressable through the same local
designation mechanism. Preserve the separate meanings of an item/local key, a
concept identifier, a type identifier and a subject reference; exact field names
remain open. Specialized types add explicit architectural relationships and fields
where useful. A keyed explanation can discuss a transition without supplying the
explicit endpoints/conditions needed for a diagram; filling those gaps still
requires qualified analysis. A type or local key does not by itself allocate an
entity or change whole-investigram correction granularity.

**Tradeoffs raised on review.** Uniform structure does not make prose's architectural
meaning explicit: consumers still cannot mechanically extract transitions from an
arbitrary keyed paragraph. Mandatory fine-grained keys would add authoring/validation
overhead and pressure agents to fragment explanations. Prefer a small prose type
that can hold a coherent explanation; require additional addressability only where
references or the chosen type need it. Keep arbitrary local keys distinct from
controlled concept/type vocabulary so invented labels do not imply understood
semantics. A generic prose fallback must not conceal failure to supply a requested
specialized type. If every new type were required to carry a diagram mapping or
schema, extensibility would become unnecessarily expensive; those obligations
depend on the type's intended handling. The recommendation is a common content
protocol with varied semantic detail, not an assertion that all content is equally
amenable to mechanical use. Exact mandatory keys and nesting remain open.

**Consolidated catalogue responsibilities.** Architectural concept guidance is not
merely the schema for a diagram: it helps the investigator recognize useful distinctions,
frame questions and explain meaning. Content-type contracts describe how to express
that meaning, with fields, references and attributable support. A concept can inform
several types, and one item can express several concepts; do not require a complete
independent item per concept. Exact encoding of concept associations on an item remains
open rather than dictated by the fixtures' single `concept` field.

Share identity through entity references and share assertions through exact references
to qualified content. Referencing S does not import a particular description of S.
Each item's contract can be satisfied by its own data plus explicitly referenced,
available material, without copying everything; necessary unresolved references do
not make an explanation complete. Cross-item alignment and newly asserted connections
need qualified content, not renderer inference. Initially prefer straightforward shared
entities/identifying support and add deeper content sharing only where examples justify it.

**Diagram-type catalogue and presentation recommendations.** Keep a distinct catalogue
responsibility for supported diagram types, input contracts and mappings under the
existing Presentation/compatibility model, not a parallel rendering architecture. A presentation
recommendation is guidance metadata naming a diagram type and bindings to exact items,
entities or selections permitted by that type. For example, a state-diagram recommendation
can bind its `model` input to TRIAL-1's `recovery` item; the sequence diagram can bind
TRIAL-1's `concurrent-callers` item. Its `stateContent`/`transition` references already
identify the recovery-model dependency; resolve it through the content contract without
repeating it in the recommendation. The diagram contract can accept an entire model
rather than demand a duplicate node/edge list. Multi-item diagrams require explicit
input roles and qualified correspondence wherever alignment establishes meaning.

PostCode resolves the declared inputs/support, validates compatibility and sufficiency,
and applies a known rendering mapping. Layout, display aliases and legends must not
invent architectural relationships. A type may have a default presentation, but returning
diagram-capable content is distinct from recommending a diagram. The catalogue split
is conceptual, not a choice of separate files/registries or a full presentation system.
The [consolidation example](structured-architectural-accounts-consolidation.md#catalogue-responsibilities)
shows this flow. The [metadata payload](structured-account-example/metadata-payload.md)
now exercises two diagram types, exact own-investigram bindings and qualified metadata
excerpts; trial generation follows those bindings and preserves the existing diagrams
and legends both with recommendations and with those recommendations removed and
diagram/content selected directly. Recommendations express usefulness, not rendering
permission. Adding a renderer or selecting a compatible diagram requires no investigram
change or correction; original recommendations remain historical metadata. An erroneous
recommendation could warrant correction, but not merely the absence of a newly available
diagram suggestion. Composition remains the earlier fixed-entry rendering probe. This is not
a general catalogue, cross-investigram input resolver or product protocol.

**Presentation remit.** Our responsibility is the retained architectural meaning,
qualifications and exact references, declared intended diagram inputs, and representative
rendering to demonstrate sufficiency. General input-retrieval strategy, arrangement of
legends/details and navigation are later presentation work. Do not add a presentation
context-selection policy or a universal referenced-content closure service to this
proposal. If an example exposes missing meaning or ambiguous references, fix that in
the content contract. Selecting context for a subsequent investigation is different:
retain explicit supplied context, requestable additions, qualification and actual-delivery
records under the established investigation contracts.

**Future presentation annotations.** Required/optional annotations and groups of
alternative presentations are possible later extensions. Distinguish required by the
request from an investigator's judgment that a presentation is essential; the latter
does not change the request's obligations. Alternative presentations need not contain
identical information. Record purpose and qualification where relevant; defer their
selection/UI behavior. They are not mandatory new fields in this capability.

**Agreed exploratory direction — agent source references.** Catalogue entries should
give concise, self-contained guidance and may directly refer agents to source
material for deeper understanding, preferably specific sections. Agents need not
read the full sources to use a supported type. State PostCode's selected subset or
adaptation explicitly: deeper reading does not silently expand the content contract.
Concept references support architectural terminology and methods; claims about the
investigated program still require their own evidence and qualifications.

Concept identifiers identify architectural meanings; type identifiers/versions
identify particular data contracts. Their encoding together or separately remains
open. Neither is an entity identity or Lens identity. A state-transition investigram can reference Half-open S without making
S's subject record an instance of the investigram schema. Several investigations can
produce the same type; one investigation can return several types alongside prose.
Selecting a type does not itself establish that it applies: the investigation must
qualify that interpretation. Open topic labels remain available within supported
types; an invented label does not create a new understood contract. Start by drafting
the state-behavior entry needed by the example, including a keyed prose type and
a specialized state/transition type, not a comprehensive catalogue.

**Local content keys and entity designations.** Require local addressability where
types need internal references, such as nodes and transition endpoints; not every
value needs a key. These are content addresses, not automatically entity identities.
An investigator can explicitly designate an architectural entity represented by an
element, using a submission-local entity key or existing global ID. PostCode resolves
new entity keys on acceptance. An unkeyed passage or component can still be selected
by exact occurrence for investigation without allocating an entity.
**Needs design:** key scope across content blocks, contextual-selection addressing,
and the distinction between selecting a content record and identifying what it describes.
Matching keys across investigram revisions do not establish continuity. Diagram selection
maps to retained content; it is not a separate source of architectural identity.

**Notation-informed information probe.** The human suggests testing whether retained
content supplies the information needed by an established diagram style, and clarifies
that choosing a renderer or working out depiction is not the present task. Use
statecharts and sequence diagrams from SEI's
[Documenting Behavior](https://www.sei.cmu.edu/documents/1986/2002_004_001_13934.pdf)
as concrete references. The human agrees that actual rendering is useful bounded
validation after specifying content, without allowing rendering work to sidetrack
the design. Mermaid was an illustrative candidate, not a selected dependency.

The human proposes a statechart information shape based on hierarchically grouped,
named directed graphs with labelled nodes and edges and an incoming entry edge.
Explore that shape with explicit state/transition meaning: references, containment,
state-bearing participant, transition endpoints, triggers, guards and effects.
Labels can contain qualified prose without being the sole representation of these
distinctions. Default initial entry is distinct from an ordinary incoming transition;
do not impose a universal single boundary-entry rule or invent initial information
absent from a partial investigram. If nested/concurrent regions are needed, record their
meaning rather than treating them as merely visual grouping. These refinements are
recommendations to test, not an adopted schema.

Check whether the example supplies those information requirements, with exact
investigram/support references and explicit unknowns. A concurrent-caller sequence
investigram should additionally test participants, ordering, waiting and alternatives
through the admission correction. Depiction must eventually be possible without
inventing architectural claims. Follow the content exercise with a small rendering
experiment; layout, styling and interactive navigation remain outside this scope.

Use a few types justified by explanatory needs, permitting qualified prose inside
and alongside them. Do not require a universal ontology or full UML/statechart
semantics. These are semantic obligations to explore, not settled field schemas:

| Representative view | Meaning the retained content needs to supply |
| --- | --- |
| Ownership/structure | Policy kinds, instance and execution roles, supplied work, and qualified relationships with explicit participants. |
| Recovery states | State owner; states; transition triggers, guards and effects; scope and missing cases. Elapsed eligibility differs from an execution-triggered transition. |
| Concurrent callers | Participants; meaningful ordering; trial occupancy; waiting/release conditions; alternative outcomes. A possible scenario differs from an observed execution. |

A small independent consumer should be able to construct each view and trace its
architectural meanings to selected content and support. Layout chooses positions;
it does not infer missing transitions, resolve identities, suppress conflict or
complete a partial state machine. Shape/reference checks establish well-formedness,
not behavioral correctness. Missing meaning remains visible or prevents the
unsupported depiction.

Combining investigrams in a view requires exact identity guarantees or qualified
correspondence for each alignment. Shared relationship IDs are one route, not a
requirement to identify every prose relationship. Without established correspondence,
retain separate depictions, disclose unresolved alignment, or decline the combined
view; never merge transitions merely by endpoints. **Needs design:** inventory the
specific shared transitions/roles needed by these diagrams and their supplied
identity/correspondence evidence.

Prefer coherent whole investigrams for independently correctable interpretive items
initially. A retained answer selection may select several such units. Fine-grained content addresses
can aid navigation without implying fine-grained replacement. Current corrections
replace whole investigrams and require complete target delivery; partition content
accordingly or motivate an explicit governing change. Subordinate investigrams provide
a middle option: coherent fixed composition with independently correctable parts.
Complete target delivery concerns the target's own required content, not its entire
descendant subtree. Child replacement and root replacement must be worked through
separately; a new tree cannot simply adopt an old child by implication.

**Why children exist; partition still open.** The accepted
[investigram decision](../docs/decisions/investigrams-and-progressive-investigation.md#distinguish-fixed-composition-from-investigation-provenance)
uses one retained unit for whole explanations and their parts, allowing separately
addressable follow-up and correction within a fixed result. It distinguishes this
organization from later-investigation provenance and program structure. Children
already exist in the submission/acceptance implementation. The human asks that we
compare their affordances and costs before choosing the example's partition.

A single investigram with keyed content parts gives local addressing and coherent
qualification delivery, but all parts share the whole-investigram correction target.
Child investigrams add independent retained targets, associations and correction
boundaries, at the cost of more support/context delivery and composition/replacement
rules. They do not narrow their producing evaluation's exposure index. They can
narrow later evaluations’ exposure by allowing a definition to be delivered without
its behavioral sibling. This is a stronger argument than avoiding replacement copying.
An investigator-facing default is: when a result mixes explicit entity
introductions and behavior, put the identifying descriptions in one or more children.
An identification-only investigram may be the root without an extra wrapper; local
terms can stay embedded. Group related descriptions rather than normalizing every
assertion into a child. A departure should state its coherence/delivery rationale and
acknowledge the broader correction/exposure unit. This remains a recommendation;
the children variant now exercises ownership, independent qualification and support
selection in authored fixtures, not through the implemented application.
Compare the producing evaluations as well as direct exposure targets. DEFINITIONS-1
received only ORIENTATION-0; its consumers avoid the separate admission sibling's
correction path. COMPOSITION-DEFINITIONS-1 shares seven synthesis exposure entries, so
component corrections can reach it and then its consumers. The relevant factor is
which correction paths exist, not context volume alone. Independently qualified
identification from a bounded basis can make separate evaluations useful, with added
orchestration cost. Do not withhold necessary context or force premature subject
introduction to minimize warnings. Broad exposure does not erase the independent
qualification, access and correction-target benefits of identifying children.

Compare actual delivery paths; a diagram's nested graph or keyed node does not
require a child investigram. Removing the existing hierarchy is not necessary to choose no children
for a particular result.

Organizational roots still carry qualified interpretation and ordinary exposure and
correction semantics. Orientation and scope claims can make them useful without
restating child behavior. Restated summaries create additional correction surfaces;
correcting a child does not silently update its root. Do not force a behavioral
synthesis simply to satisfy the substantive-root requirement. Roots should be
intelligible, not empty scaffolding
disguised as an unqualified result container. A children-only result pattern would
need separate justification if the examples show the roots add no explanatory value.

**Prerequisite — structured delivery.** Before using corrections on structured
content, specify how all required own content, referent information and attributable
qualifications are delivered, how bounded excerpts/omissions are reported, and how
actual deliveries establish completeness. Update content-part tracking and context
transport accordingly. Shape validity, an ID, or a diagram's selected fields cannot
substitute for complete delivery. The exact rules depend on the chosen types.

## Existing machinery and application boundary

**Investigram-to-investigram relationships: specific mechanisms, no general alternative link.**
Inspection of [contracts](../src/lib/investigation/contracts.ts),
[acceptance](../src/lib/investigation/acceptance.ts) and
[revision processing](../src/lib/investigation/revisions.ts) confirms:

- A reporter can return a correction naming an earlier target A and embedding a
  newly constructed replacement B, with reason, evidence and qualifications. Acceptance
  allocates separate correction/replacement records and processing gives that link
  replacement-selection, conflict and reconsideration consequences.
- A reporter can return an unresolved inconsistency with references to earlier
  investigrams, reason and support. Targets require substantive delivered content.
  These records are retained and indexed for affected-investigram inspection, without
  implying replacement. Newly submitted sibling investigrams are not eligible targets.
- Composition and investigation provenance encode parts of a result and follow-up
  lineage, respectively. Neither establishes a semantic comparison.
- An investigram can refer to earlier investigrams and explain a relationship in prose, but
  that alone does not create a recognized/indexed alternative relationship.

Thus a qualified relationship “new B is an alternative to A” has useful precedents
but needs a submission, validation, retention and access extension. Do not merely
rename the correction field and inherit replacement effects. Specify how links name
newly returned investigrams (local references or explicit construction), who owns the
qualified relationship explanation, and what operations discover it. This remains
design work, not an implemented generic investigram-relationship facility.

**Existing hierarchy, proposed subject semantics.** A single investigation already
returns one root with recursive child investigrams. PostCode validates the result
tree and assigns each investigram its own retained identity. The proposed
definition/admission partition uses that existing composition machinery; it does
not introduce hierarchical investigation results. Explicit introduction of shared
subjects such as Half-open, and qualified per-subject identifies associations, are
proposed extensions. See the [submission contract](../src/lib/investigation/contracts.ts)
and [acceptance code](../src/lib/investigation/acceptance.ts).

The inspected implementation provides immutable investigrams, fixed composition,
qualified content associations, atomic result acceptance, corrections/conflicts,
exposure/reconsideration, and direct selected-content/exact-answer access through
the [application API](../src/lib/application/index.ts). It currently has prose-only
investigation content, module/investigram investigation targets, and narrower
subject resolution. The proposed model is not already supported.

Concrete constraints confirmed in the review:

| Current contract | Required design treatment |
| --- | --- |
| `correctedSubjects` admits module, symbol, group and repository-artifact; acceptance adds corrected-subject associations | Extend validation and association semantics to the intended referents, preserving explicit correction subjects. |
| Investigrams and provenance require `originatingModule` | Specify attributable originating architectural context for the new request types. Do not silently turn an interpreted implementation relationship into a mechanical context/identity guarantee. |
| Investigation parameters are empty and nonempty parameters are rejected | Give concurrent-callers and other questions declared Lens/operation meaning, with meaningful parameters if needed. Parameters are not mandatory when distinct declared questions suffice; effective-input identity must capture the chosen semantics. |
| Context parts are prose, referent and qualifications | Establish structured-content completeness and bounded-delivery rules before the correction path is used. |

These are design obligations for the capability, not authorization to alter the
contracts now. Originating-context representation and request semantics remain open.

The capability needs a continuous path through:

- Common subject declaration/reuse and lookup, integrated with existing mechanical
  identity and qualified information; contextual selection if included in the slice.
- Structured submission, reference/support validation, immutable retention,
  and explicit subject-reference/description indexing.
- Applicable subject/Lens requests with declared question meaning and selected
  context, plus full/partial delivery accounting for structured content.
- Retained selection, fresh inspection and exact retrieval preserving new content,
  qualifications, corrections and fixed identifying support through the direct API.

Keep application semantics independent of rendering. Account for affected existing
human-output paths; deferring the GUI does not permit dropping qualifications or
misrepresenting content there. This remains an internal Session capability, not a
promise of a public API or general query store.

## Proposed scope and validation

Recommend admission/follow-up/correction, explicit selection and exact historical
access, and the representative diagram content above. Demonstrate compatibility
between an existing mechanical subject and subsequent interpreted investigrams through
the common entity/reference contract. This does not require migrating a mechanical
producer or sharing its internal storage. Explicit entity introduction/reuse is the
common model; contextual selection remains a distinct input capability whose first
delivery is a scope choice.

**Scope choice remains open.** Recommend explicit entity introduction/reuse through
the admission/follow-up/correction path. The earlier three-route model and separate
promotion stage are withdrawn. Contextual selection, correspondence/conflation,
entity supersession and composition remain design or fixture probes unless explicitly
included. A seeded fixture does not demonstrate live discovery, contextual investigation
or reconciliation. Qualified correspondence and conflation must remain representable;
operations that resolve identity disputes remain outside the bounded capability.

Validation needs several kinds of evidence:

- **Deterministic application fixtures:** actual retention/evidence/API paths with
  scripted investigator communication. Check reference integrity, duplicate names,
  atomic rejection, full/partial delivery, unsupported corrections, conflicts,
  continuity and unchanged exact answers. Include contextual selection and qualified
  correspondence/conflation at the level selected by the scope decision, explicitly
  distinguishing model probes from delivered application operations.
- **A real investigation:** start at an ordinary supported entry, discover a usable
  subject, follow it, reuse actual retained content and acquire program evidence.
  Assess semantic fidelity independently. Seeded orientation does not demonstrate
  discovery; a seeded omission does not demonstrate reliable error detection.
  Use existing supported entry operations or an explicitly bounded integration
  extension; this check does not require global option discovery or a new entry catalogue.
- **Content-to-diagram inspection:** construct small views from retained content;
  check traceability, omissions, conflicts and role distinctions. Content sufficiency,
  truth and human intelligibility are separate questions to assess.

Checks must be possible within the supported Session lifetime. Defer cross-Session
identity, automatic equivalence, general inference, universal schemas, automatic
investigram reconciliation, full presentation/navigation and the minimal GUI.

## Choices to discuss before a planning package

### Assumptions to challenge after the acceptance-bias review

**Terminology after comparison.** The earlier proposals to use “revision,”
“replacement” or “alternative” as a universal substitute for correction have given
way to distinguishing investigram-relationship kinds. An alternative need not correct
anything; a correction asserts an error and proposes replacement, with attributable
reasons rather than app-certified truth. “Revision” can remain general explanatory
language, but no global governing rename is recommended here. Current Correction
and RevisionStatus contracts remain binding until explicitly revised.

**Correction remains compatible with this framing.** In response to the human's
question about revisiting the existing mechanism, inspection of the accepted
[correction contract](../docs/decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation)
supports retaining correction as an attributed, qualified assertion that a specific
investigram should be replaced. It preserves originals, supports competing replacements
and unresolved inconsistencies, and explicitly says primary selection does not
resolve conflict. Acceptance validates contracts/references and delivery, not truth.
The current recency-based primary-selection rule is a display heuristic, explicitly
not credibility. This is an organizational consequence of a correction, not a global
truth-maintenance obligation. Do not weaken an explicit replacement assertion into
an undifferentiated alternative, or treat its acceptance as semantic adjudication.

Revisit fit and consequences rather than reverse the design wholesale: distinguish
an omitted case in a purportedly complete admission investigram (potential correction)
from an additional case outside an explicitly narrow investigram's scope (addition);
check primary-selection/conflict disclosure against the example; compare correction
units without demanding perfect impact propagation. No governing revision is
proposed solely because the system retains contradictory investigrams. Whether a new
investigram is sufficiently supported to correct an old one remains investigative
judgment, including possible unresolved disagreement about the correction itself.

**Follow-up distinction — adoption versus historical retention.** The human points
out that fixing an identified factual error is not reconciling legitimate partial
views, and questions whether retaining the uncorrected investigram is necessary.
Recommend assessing three policies separately: current selection of an explicit
correction's replacement, historical retention of the earlier investigram, and warnings
on investigrams exposed to that earlier content. Alternative investigrams should not acquire
correction consequences merely because they differ. Conversely, an explicitly
supported correction need not remain a coequal current explanation to honor plural
accounts. Acceptance still does not mechanically establish its truth.

Retaining the earlier investigram has an independent purpose: preserve exact earlier
answers and the content actually supplied to later investigations, allow inspection
of the error/reason, and permit challenge to a mistaken correction. This does not
require routinely supplying the old investigram as a current alternative, indefinite
retention, or a universal dependency model. Removing it would sacrifice current
historical-access/lineage obligations, rather than simply avoid reconciliation.
Reconsideration currently warns from exposure, not established reliance, and cannot
be cleared by an existing reassessment operation; those costs merit separate review.
No deletion, policy change or governing revision is adopted by this discussion.

These are recommendations to reconsider, not reversals of human agreements or
changes to governing requirements. Several were already formally open; conversational
confidence has sometimes exceeded the examples supporting them.

- **Continuity under definition correction.** Keeping S across H1/H2 is appropriate
  only if they still concern the same referent. Test a clarification against an actual
  conflation of state category, instance occupancy and execution phase. Neither a
  stable ID nor the investigator's replacement declaration proves sameness. A
  contextual selection establishes an investigation input, not an entity or automatic
  equivalence between the occurrence and an independently known entity.
- **Catalogue granularity.** The inventory mixes architectural concepts, view
  families and notations; it is not already a coherent ontology. Test whether concept
  guidance, content contracts and diagram mappings need distinct entries and
  relationships. Do not assume a schema for each named concept or let the diagram
  inventory define the full architectural vocabulary. Start with a bounded catalogue
  slice; allow the recognized vocabulary to grow independently of special treatments.
- **Definition partition and support.** A definition child is an example partition,
  not a universal normalization rule. The actionable default uses explicit introduction
  of entities, when mixed with behavior, as the signal for identifying children.
  Later consumers can receive their definitions without exposure to the behavioral sibling. It still adds support/composition obligations and
  does not narrow exposure shared by outputs of the producing evaluation. The mixed
  concrete payload demonstrates the contrasting cost; current rules remain governing.
- **Automatic identifying support.** Exact snapshots are sound, but selecting which
  descriptions ground a reference can require interpretation. Test two competing
  descriptions of S. Prefer explicitly anchored support or visible unresolved
  alternatives; an application selector must not synthesize a definition or claim
  compatibility merely to make an answer readable. Preserve explicit support references
  and report missing support; general presentation retrieval/arrangement is outside
  this remit, distinct from investigator context acquisition.
- **One mechanism across producers.** Common entity/reference semantics remain the
  intended direction. The first delivery's migration depth and common retention
  machinery are not demonstrated by that principle. Test interpreted use of an
  existing mechanical subject before considering shared internal machinery or
  migration; preserve mechanical guarantees and avoid unnecessary parallel identities.

1. **Concrete concept and content contracts.** Organize concept guidance, supported
   types and diagram-type input contracts/mappings; draft the state-behavior and interaction entries
   needed by the example. Specify returned identifying content, local references,
   entity declarations and investigram-relationship metadata. Include governing treatment
   of explicitly identified relationships/patterns as Entities alongside interpreted
   identity. Review the bounded metadata encoding now exercised by the fixtures:
   exact ownership, address namespaces and qualification/delivery rules; replacements
   supply their own metadata. Generalizing these contracts remains design work. Preserve the
   general qualified-investigram result contract, with optional
   specialization for explicit content/presentation promises. Establish attributable
   support and full/partial delivery, without requiring a comprehensive catalogue.
2. **Investigram boundaries.** Review the concrete mixed-content payload against the
   recommendation for independently deliverable identifying children. Show what is
   retrieved and replaced when one description or admission claim changes, including unchanged content and root/child behavior.
   Addressability and qualification do not establish independent semantic validity.
3. **Investigram-relationship semantics.** Specify initial kinds, endpoint roles,
   reporting/support, reference validation and discovery. Preserve distinctions
   between coexistence, reported inconsistency and explicit correction. Decide
   what challenging a correction means or disclose that changing its standing is
   deferred; do not accidentally infer withdrawal from revising its reporter.
4. **End-to-end subject and application access.** Specify interpreted identity and
   reuse guarantees, exact naming/local-key resolution, qualified identifies/refers-to
   associations and exact retained follow-up option references. Use a representative supported
   invocation to work through subject-only versus explicit-origin context, actual
   dialogue delivery, competing descriptions and exact-answer support. Demonstrate
   compatibility with an existing mechanical subject. General entry/option discovery,
   context ranking, reuse policy and producer migration are not prerequisites.
5. **First delivery and verification.** Decide which contextual-selection capabilities
   and investigram-relationship kinds are delivered versus only probed. Composition and
   merge/split remain design probes; reconciliation operations are outside this slice.
   Use real investigation to test discovery/reuse, fixtures for lifecycle and API
   guarantees, and bounded rendering for content sufficiency. Human pushback and
   general presentation remain out of scope; detailed reassessment is deferred as
   recommended above. Preserve exact history and disclose unsupported operations.

## Designs and theories to build on

Use [incremental formalization](https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html)
to guide coexistence of prose, local structure and entities;
[qualified statements](https://www.mediawiki.org/wiki/Wikibase/DataModel/Primer)
to separate referents from descriptions; and
[reason maintenance](https://dspace.mit.edu/entities/publication/5377b306-4ecc-4687-b1f5-78cbb4a0543a)
to inform explicit support and reconsideration.
[Nanopublications](https://nanopub.net/docs/guidelines/) provide a useful separation
of assertion and provenance. The discussion notes give fuller comparisons.

Borrow these concepts without importing one consistent belief set, logical
entailment over exposure links, or a universally formalized architecture. Missing
information is not a negative assertion; structural validity is not truth; an
AI-produced classification is still a claim. Additional mechanisms should earn
their place through concrete investigation, retrieval or diagram needs. No library
choice follows from these conceptual precedents.
