# Structured architectural accounts: working proposal

Updated: 2026-11-11

Exploratory synthesis for discussion, incorporating the emerging direction and a
recommended bounded capability. This is not an adopted design, planning package,
or implementation authorization. Recommendations and unresolved choices remain
open. The [discussion notes](structured-architectural-accounts.md) retain the
alternatives, implementation inspection and research behind this synthesis.

Current recommendations, including the review refinements, are stated inline.
Remaining choices are marked **Needs design** where they arise and collected below.
The proposed reduction of first-delivery scope has not been agreed.

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
After review, use explicit shared-subject introduction as the actionable default:
when identifying descriptions are mixed with behavior, place them in one or more
identifying children. Their citation targets can avoid exposure to behavioral-sibling
corrections. Identification-only roots need no extra wrapper; local terms may stay embedded.
The [children variant](structured-account-example/children/README.md) now exercises
that recommendation with complete first/follow-up payloads and independent child
support. The original payload retains the single-account alternative for comparison.

The [foundation](../foundation/README.md), [application specification](../docs/app-specification.md),
[core concepts](../docs/core-concepts.md), [architectural constraints](../docs/architectural-constraints.md)
and applicable accepted decisions remain governing. The
[structured-interpretation decision](../docs/decisions/structured-investigram-content.md)
permits exploring this content while preserving qualification and revision contracts.

## Current exploratory checkpoint

The design has a stable direction, but no adopted payload schema or planning package:

- Retain qualified accounts and their history, allowing partiality and disagreement;
  do not require a reconciled architectural model.
- Shared subject references provide continuity across accounts; identifying and
  behavioral descriptions remain qualified claims, not authoritative subject fields.
- Use a common content protocol, including keyed prose and specialized architectural
  forms. Established concepts guide both investigation and explanation; diagrams
  test content sufficiency through a bounded rendering exercise.
- Distinguish architectural relationships inside accounts from account-organizing
  relationships. The latter currently favor explicit qualified metadata records
  returned alongside accounts, with their own meaning, support and consequences.
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
| Account partition | When mixed with behavior, put descriptions of explicitly introduced shared subjects in identifying children by default. Grouping is allowed; identification-only roots need no wrapper. Both partitions now have complete authored fixtures and ownership/support checks. |
| Identifying support | Use replacement descriptions when their containing account is replaced; unchanged identifying siblings remain available. Original input/history is separately labelled; exact older answers remain fixed. `affectedSubjects` is not an item-survival mask. |
| Relationship K | Retain/index separately; cite its reporter for substantive explanation. This does not deliver the reporter's complete own content or enable independent revision of K. |
| Behavioral content | Supply the causal chain through classification, transition, resume/recheck and admission outcome. Admission uses local variables and an illustration; the scenario state model references R directly. Shared syntax does not require redundant aliases or broader claims. |
| Validation | Both partitions have a repeatable fixture checker and diagram traceability. Exact illustration access reports linked-account revision status without automatic retargeting or reconsideration. Cross-form semantics remain a separate assessment. |
| Request/reuse | Distinguish request plus selected seed context from subsequent acquired context in provenance. Reuse freshness policy remains to be settled. |

## The proposed capability

PostCode retains architectural subjects and qualified accounts about them so that
successive investigations can reuse, extend and challenge understanding. Subjects
provide continuity; accounts provide attributable descriptions and claims. Neither
shared identity nor a current selection requires the accounts to agree.

**Governing framing — organize accounts without requiring a canonical theory.** The
human recalls an existing principle, not a newly adopted direction. The
[foundation's retained-understanding guidance](../foundation/product-design.md#retained-architectural-understanding-and-continuity)
explicitly permits overlapping, disagreeing and incomplete accounts without a single
consolidated architecture model. The accepted
[accumulation requirement](../docs/decisions/structured-investigram-content.md#require-accumulated-understanding)
and its [reaffirmation](../docs/decisions/specialized-architectural-investigation.md#retained-understanding-and-context)
carry this into intended application behavior. Our discussion should apply that
framing to the proposed mechanisms. Retained subjects provide continuity of reference
and access to accounts; they do not require one authoritative description or a
globally reconciled graph. Architectural structure is asserted within qualified
accounts, not silently accumulated as universally accepted program facts.

Require enough machinery to retain and retrieve accounts, preserve support and
scope, follow subjects and explicit relationships, record supported corrections or
inconsistencies, and expose structured explanations faithfully. Do not make universal
identity resolution, automatic conflict detection, complete dependency tracking or
global consistency prerequisites. Reconciliation remains an explicit investigation
with qualified outcomes. Correction partition should support useful explanation and
revision, not promise perfect semantic independence; uncertainty about broader
impact can be recorded rather than solved automatically. This framing does not
relax existing qualification, exact-access or correction obligations. Accept that
users and investigators may need to compare accounts and perform further inquiry.

Start with admission → trial → correction over one captured Cockatiel revision,
under default single-trial recovery, within one supported Session. Use composition
order to probe whether the content can express new relationships across accounts.
Broader graphical investigation and the minimal GUI follow separately.

### Scope boundary: architecture, not UI workflow

The human directs this work to presume that users can view and select the retained
subjects, accounts and investigation choices they need. Do not design menus, layouts,
selection gestures or a separate assembly workflow here. Describe only selections
that affect application behavior: subject(s) and their roles, Lens/parameters,
explicit prior context, actual navigation origin, and exact versus fresh access.

Viewing several accounts together does not make them multiple subjects of a Lens,
supply them to an investigator, establish agreement, or create a new retained aggregate.
Those are distinct operations requiring explicit application meaning. The UI can
provide context when the selection identifies it; an absent origin remains absent.
The earlier optional collection-inspection/assembled-answer mechanism is set aside,
not a prerequisite or an unresolved UI decision blocking this capability.

The useful result is being able to follow Half-open from an admission explanation,
obtain an account of concurrent callers, see an explicit correction, and still
retrieve the original answer. Retained content should also supply the meaning for
representative architectural diagrams without a renderer inventing it.

## Continuing subjects, qualified information, explicit selections

This vocabulary describes responsibilities, not storage tables or public API types.

| Concept | Proposed responsibility |
| --- | --- |
| Subject | The governing role: what a Lens investigates or a claim concerns. Entities, relationships, collections and investigrams can play this role; it is not another entity kind. |
| Retained subject reference | Working terminology for the common identity/reference mechanism. It identifies the referent playing the subject role without turning every referent into an Entity. Names aid recognition; references preserve the established identity. |
| Qualified item | Information about one or more subjects, with attributable scope, evidence, method/provenance and limitations. Definitions are one kind of information among others. |
| Investigram | The existing immutable unit of retained interpretation; proposed content forms include keyed prose and specialized architectural structures. Mechanical claims retain their own character and guarantees. |
| Architectural account | A coherent explanation that may occupy one or several investigrams. The explanatory term alone does not give a collection an identity or make it a correction target. |
| Retained answer selection | Exact qualified parts and support selected for an application answer, with selection basis and revision context. It is immutable and distinct from UI grouping, investigator context and selected Lens subjects. |
| Identifying support | Qualified content making a referenced subject intelligible, with exact supporting references. It need not be a selected account constituent and is not evidence for every claim about the subject. |
| Exact answer | A fixed record of selected content and support, including captured revision/association context. The proposed identifying support must be fixed too. |

The retained architectural model comprises subjects, qualified information,
relationships, support and revision/conflict history. It can be partial, contested
and incomplete. Identity does not establish that a hypothesized relationship exists
or that an account is correct. Cross-Session persistence and correspondence across
program revisions are outside this first scope.

For precise addressing in this note, “account A” means an identified investigram
unless explicitly described as a collection. Correction targets are investigram IDs;
local designations belong to an exact investigram. A multi-investigram explanation
can be identified through a retained selected answer without a mutable account
aggregate. A reference to that answer is distinct from references to its constituents.

**Needs design — interpreted identity.** Governing documents allow implemented
architectural subjects but do not specify the proposed allocation/continuity rules
for interpreted referents such as Half-open. Specify their grounding, scope and
guarantees, and assess the corresponding decision/document changes. Do not silently
redefine Subject or extend Entity to cover every addressable thing.

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
Preserve the descriptions actually grounding selected accounts; do not reinterpret
an old account by automatically substituting a newer definition. Newer or competing
descriptions can be exposed distinctly as revision context or separate selected items.
When the whole containing account is selected through a correction replacement,
use that replacement's identifying content as current support. Retain the original
as labelled historical/input context where relevant. `affectedSubjects` describes
claimed correction scope; it does not exempt embedded items from replacement. This
selection rule does not prove the replacement true or reconcile competing descriptions.

**Human direction — competing descriptions.** When two accounts describe S differently
without an explicit correction relationship, show both and supply both as investigator
context, preserving their separate attribution, scope and support. Difference alone
does not establish contradiction: accounts may concern different conditions or
complementary aspects. Do not silently choose a winner or synthesize agreement.
For larger inventories, bounded delivery/discovery can preserve access to alternatives;
the two-account case needs no adjudication to make progress. Exact earlier answers
still retain their captured context.

**Proposed common account-relationship model.** The human proposes unifying qualified
relationships such as “A is an alternative to B,” “A corrects B” and “A is inconsistent
with B.” Recommend a shared representation of exact participating accounts/roles,
relationship kind, reporting investigation/account, explanatory content, scope,
evidence and qualifications, with type-specific validation and consequences. Alternative
does not imply error or replacement; inconsistency reports tension under a specified
scope; correction explicitly proposes a replacement for an identified error. These
meanings are not mutually exclusive classifications of account pairs. Common machinery
does not require a generic graph ontology or one identical payload for every kind.
Mechanical composition and exposure remain distinguishable from interpreted relations.

**Relationship as qualified organizing metadata.** The human identifies an indexable
domain type with participants/roles, kind, explanation and qualified support, and
suggests that its role in organizing accounts favors metadata rather than ordinary
architectural content. Recommend explicit relationship records supplied alongside
accounts in the investigation result. They can be interpretively generated while
serving as metadata in the retained model. This does not automatically make each
relationship an investigram or promote it to a shared subject. Exact submission
packaging and physical storage remain open.

This refines the preceding partition analogy: if a relationship assertion lives
as ordinary content, embedded versus separate investigram is the same question as
for a subject description. Giving account relationships their own organizing role
provides a reason to choose a distinct qualified record instead. The cost is that
their challenge/revision behavior then needs its own explicit contract; it is not
inherited merely from investigram addressability.

“Metadata” specifies function, not epistemic authority. Preserve the reporting
investigation/account, reason, evidence, scope and qualifications as inspectable
information actually supplied in context. Do not create an unqualified link plus an
optional explanatory paragraph. New relationship records can be indexed against
existing accounts without mutating their original content or exact answer snapshots.
Calling the material metadata does not exempt it from existing attributable-support
and complete correction-context delivery requirements. For the correction path,
retain the existing reporter-citation rule: substantive delivery of K's explanation
records exposure to TRIAL-1 and permits citing that reporter, not K. Bare relationship
and endpoint IDs do not. This delivery alone does not supply TRIAL-1's complete own
content. Physical storage on K and substantive attribution to TRIAL-1 are compatible;
no duplicate prose field is required. Independent relationship citations or revocation
would be separate extensions, not implicit consequences of indexability.

**Agreed distinction:** use “account relationship” for this organizing mechanism.
Its participants are retained accounts/investigrams; kinds such as alternative,
correction and inconsistency organize explanations and can affect their selection
or status. Architectural relationships, such as an execution waiting on a breaker
or a policy delegating to another, are claims within accounts about the described
software. They belong to architectural content forms, not this account-relationship
type, and their presence does not trigger account revision/status behavior. No shared
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
K, revising the account that asserts K, and withdrawing/changing K's operational
effects. Do not assume these are the same action. Whether a disputed or superseded
K influences current selection and reconsideration remains open, as does any
independent relationship-targeting operation. Preserve assertion/history and other
applicable relationships; a challenge does not itself establish A's correctness
or B's error. This question is distinct from deferred reassessment of accounts
exposed to corrected context. No automatic withdrawal exists today.

**Reassessment — recommend deferring detailed design and delivery.** The human
recognizes reassessment as within the product's remit but suggests keeping it in
the backlog unless it affects the present architecture. Current correction records
already have stable identities, and reconsideration is derived per cause without
mutating accounts or historical answers. That supports later extension; it does not
implement clearance. Keep only these compatibility checks in the current design:

- Preserve exact account and correction-cause references, reporter/support and
  exposure history, rather than storing only an unexplained permanent warning bit.
- Keep current reconsideration status derived and allow future qualified assessment
  records to participate in that calculation without rewriting earlier accounts.
- Do not constrain the common relationship model to unqualified binary edges only;
  a future assessment must be able to identify both an account and a correction cause.

Defer assessment outcomes, delivery requirements, competing assessments and downstream
clearance rules. A future probe can use A corrected by B under cause K, C exposed to A,
and D exposed to C, with an independent second cause. Any eventual clearance must
distinguish resolution of K from global correctness and downstream reassessment.
The accepted decision already anticipates this work. For now concerns may remain
uncleared; that is a disclosed limitation, not a reason to broaden the current scope.
Current exposure still does not establish reliance. This is the present scope
recommendation, not an adopted clearance policy or implementation authorization.

**Composition evidence sharpens this planning risk.** The ordering-only
COMPOSITION-DEFINITIONS-1 shares seven delivered-account citations with the synthesis.
A later component correction can flag it, and that cause can propagate to later
consumers of the definition; a smaller cited unit is not a transitive isolation
boundary. The current slice has no operation to clear an assessed-as-unaffected
account. Before completing the planning package, explicitly accept this limitation
for the first capability or prioritize a bounded reassessment probe. This raises its
planning priority without authorizing implementation or reversing the agreed scope.
Per-output exposure is an alternative requiring a consequential revision of the
current evaluation-wide delivery rules; agent-selected evidence or claimed reliance
cannot silently substitute for actual delivery. Separate evaluations can limit actual
exposure but add orchestration. Preserve the cause-specific history whichever future
policy is chosen.

**Proposed investigation — reconcile selected accounts.** The human proposes selecting
accounts and asking to reconcile them. Recommend supporting this as an explicit
qualified investigation, not a display operation or an automatic consequence of
showing accounts together. Its objects of examination are the exact selected accounts;
they need not describe the same subject. The investigator can inspect their support
and acquire further evidence through the normal dialogue. This requires a request
contract for multiple account inputs; it is not claimed as an existing operation or
added to the first delivery's scope yet.

Reconciliation means investigating how the accounts relate, not guaranteeing agreement.
Possible results include explaining compatible scopes, supported correspondence or
conflation, a new synthesis, explicit corrections where justified, or an unresolved
disagreement with missing evidence identified. New interpretation is retained with
its own support and provenance. Synthesis does not automatically supersede its inputs;
correction requires the existing exact-target, complete-delivery and qualification
rules. Subject merge/split and reference rewriting do not follow automatically.
Earlier accounts and exact answers remain available. A useful negative probe is a
case where the evidence warrants leaving the accounts unreconciled rather than
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
revision. Selecting existing accounts for reconciliation need not introduce this
broader input channel. Supplying “this is wrong because …” would need attributable
participant content and explicit investigation use; neither feedback nor assertion
automatically corrects retained accounts. Keep that broader work separate here.
Reconciliation of explicitly selected retained accounts remains a proposed operation,
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
account's applicable qualifications, basis and revision context, as well as item-level
support and qualifications. Supplying an excerpt cites its containing investigram;
partial delivery does not establish a complete correction target.

Human presentation alone does not create investigator citations. If this support is
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
Replacement-aware selection does not reinterpret an unchanged account by substituting
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

### One mechanism across producers

Use a shared domain mechanism for declaring/reusing subjects, retaining qualified
information, validating references, indexing associations and selecting content.
Mechanical analyses and interpretations both contribute through it. Existing modules
are architectural subjects too; do not introduce parallel architectural module IDs
or a permanent legacy-subject exception behind a common lookup facade.

Producers still differ. Mechanical discovery preserves its deterministic
same-Session identity and capture rules. Interpretation uses supplied IDs and new
declarations. A compiler-derived export claim and an interpreted responsibility
account can concern the same module M without sharing an epistemic guarantee.
Mechanical results do not become investigrams to fit the common mechanism.

The human confirms that commonality is necessary at the subject-facing level; how
deeply producers share internal mechanisms can emerge later. A common subject
contract does not by itself settle allocation, storage or migration implementation.

The shared contract includes qualified-information retention as well as identity
and indexing; it need not eagerly compute every mechanical item before Lens
evaluation. Shared allocation does not prevent independent discoveries of duplicate
referents, including an interpreter describing a symbol whose mechanical ID it was
not supplied. Reuse known references; preserve unresolved duplicates for qualified
correspondence rather than promising automatic semantic deduplication.

A policy kind implemented by M may be a different subject, connected by a qualified
implementation relationship. What something is, how it was discovered, and how a
particular claim is supported remain distinct.

Qualifications must remain attributable to the portions they qualify. Shared
enclosing support may avoid repetition where it actually applies; neither association
with a subject nor inclusion in one account extends evidence to unrelated claims.
The walkthrough permits shared support storage but makes each child self-contained
in qualification delivery: no substantive limitation is inherited implicitly from
a composition parent. The target's own delivery must include its applicable limits.

### Items, topics and associations

Use a small extensible vocabulary for information requiring special handling,
including structured forms needed by the selected diagrams. Investigations can
invent meaningful topics using supported qualified forms. Content form and the
role an account plays for a particular subject are separate dimensions.

Exact investigram references identify interpretation correction targets; a finer
item address does not authorize a sub-investigram patch. Titles or topic labels
support discovery; matching labels never imply replacement or equivalence. An
invented topic does not acquire specialized rendering behavior by its name.

Accounts explicitly identify existing subjects they refer to as well as new subjects
they introduce. Structured content uses these references as participants/endpoints;
prose may carry a reference inventory without token-by-token annotation. One
concurrent-caller account can concern Half-open, a shared breaker role and execution
roles without being copied under each subject.

Keep these relationships distinct:

- **Refers to** supports navigation and finding mentions.
- **Describes** is a qualified association for selecting accounts about a subject.
- **Identifies** is a proposed qualified association role saying which subject an
  account supplies an identifying description for. It is not a whole-investigram kind.
- **Supports** attributes evidence or prior interpretation to particular content.
- **Architectural relationships** describe the program, such as ownership or waiting.

For example, DEFINITIONS-1 identifies S, S-open and S-closed, and may describe P
without identifying P. ROLE-DEFINITIONS-1 identifies its new roles and W while
describing their relationship to P. A behavioral account can also identify a subject;
the separate definition-child pattern is useful here, not mandatory everywhere.
Definition lookup uses the per-subject identifies association, exposing candidates,
scope and correction/conflict context. It does not infer identification from a
describes association plus an account-wide label. No unique authoritative definition
is implied. **Needs design:** settle the exact role vocabulary, its relationship to
describes indexing, and qualified validation; the role must remain explicit.

The selected input subject and actual prior-content exposure are separate again.
Extend the existing referent/association machinery rather than maintain duplicate
inventories with unclear ownership. Index results expose IDs, roles, titles, scope
and revision context; substantive titles and summaries count as exposure, not
complete delivery. Rich listings can therefore broaden later reconsideration.
**Needs design:** choose useful listing content and bounds while preserving those
exposure rules; relabeling substantive text as metadata cannot avoid them.

**Referring-account discovery.** The human's direction is that accounts explicitly
listing S as a referent must be available to an investigation of S, either supplied
up front or discoverable/retrievable during its dialogue. ADMISSION-1 can therefore
be found through its Half-open reference without a describes-S association or known
navigation origin. Index implementation is an engineering choice.

Ordering by retention time is a possible discovery aid, not evidence that an account
is authoritative, most applicable or the one the human came from. Preserve known
origin separately; leave it unknown when absent. Bare-reference results are not
content exposure; substantive titles/descriptions and retrieved content are.
**Needs design:** delivery/query contracts, ordering and bounds. Current association
lookup does not implement this referent-based capability; it needs extension and
an origin-free discovery fixture, independently of the caller-selected example.

## Introduction and change

### Dialogue-based context acquisition

The human emphasizes that interpretation already runs through a dialogue: initial
context need not be the final selection of everything the investigator can use.
PostCode can expose available retained material and let the investigator request
what it needs. Prefer exploring a hybrid: supply useful identifying descriptions
and known contextual origin initially, then make additional attributes/accounts,
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
**Needs design:** discovery/query capabilities, continuation/bounds, reuse eligibility
and freshness, and how acquired support is fixed in exact answers.
Do not treat this as a requirement to choose all relevant accounts before starting.

### Routes for subject introduction

Allow three routes into the same subject mechanism:

1. **Explicit introduction.** An investigation declares a useful subject using a
   submission-local key, a name and an attributable identifying description.
   PostCode validates the result and assigns a retained ID. Other content in the
   same result can use that local key before allocation.
2. **Local designation.** An investigram gives something a local key without creating
   a shared subject yet. Later exploration can promote the exact investigram/key pair;
   repeated promotion resolves to its established binding.
3. **Contextual selection (including prose or diagram components).** A human follows wording such as “Half Open.” PostCode can
   establish “Half Open as used in account A,” retaining the exact account and
   selected occurrence/context where available. This records a focus, not an
   inferred precise architectural definition. The initial designation is an
   attributed selection record, not an investigram fabricated from the human action.
   A selected diagram component can similarly resolve to its exact retained content
   element and context. Display coordinates or a renderer's generated ID are not
   sufficient identity. If the element already references a shared subject or has
   an established promotion binding, reuse it. A component assembled from several
   claims may require explicit disambiguation or qualified analysis; selection alone
   does not establish their equivalence.

Submission-local subject keys and investigram-local designation keys have different
owners and must remain distinguishable. Equal local keys in ADMISSION-1 and its
replacement do not establish continuity. Reuse an existing shared subject reference
or retain an explicit mapping with appropriate support; never inherit by spelling.

**Needs design — contextual selection.** Define the selection record's qualification,
reference shape and repeated-selection behavior. An exact investigram plus stable
occurrence selector is a candidate for idempotence, not a selected ID formula.
Repeated wording alone does not identify an occurrence or resolve its meaning.

All routes preserve origin. Later accounts can improve a subject's definition, but
do not retrospectively enrich the original. Promotion adds a retained mapping or
qualified association; it does not mutate the originating investigram's referent
list or earlier answers. Ambiguous wording can remain unresolved pending analysis.
Subject creation needs an application operation; presentation binding is insufficient.

Later context supplies subject IDs, relevant exact descriptions and qualifications.
New information identifies the subject ID. Replacement also identifies the exact
earlier investigram, its replacement and a supported reason: subject ID alone cannot
choose among several descriptions. Validate local/existing references and accept
the result atomically, with no partial subject creation on rejection.

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

**Needs design — interpretive Lens offers.** Define what makes a question applicable
to a qualified or initially unknown subject, the support it requires, and how an
offer is explained. Classification may inform this without becoming established
fact. Deferring compiler capabilities does not by itself settle interpretive offers.

The composition probe supplies concrete scoping evidence: P/B is an unordered set of
component kinds for a question covering both orders, with no outer/inner meaning in
input position. Its output introduces C-BB and C-BH as qualified ordered-pattern
subjects; subsequent pattern investigation can take one subject. This supports
starting multi-subject offers around explicit joint/comparison questions, rather than
requiring a pair for every composition follow-up. It does not settle generic Lens
applicability, arity, role assignment or matching from classification alone.

Relationships may themselves have subject identities and qualified accounts. Use
the same explicit/local/prose routes rather than requiring every relationship to
become a shared subject immediately. A relationship account supplies participants,
roles, conditions and direction/order where meaningful; its identity alone supplies
none of those claims. Equal labels or endpoints do not establish relationship identity.

For W, recommend identifying the waiting relationship between the particular caller
role and the shared breaker role's recovery decision in the named usage pattern.
Keep default configuration, occurrence and waiting conditions in qualified behavioral
claims, as with S's behavioral scope. Allocating W does not establish that waiting
occurs. A change to conditions normally corrects the behavioral account; a mistaken
participant or identifying characterization can also require definition correction
or a different referent. The definition/behavior boundary is not an exemption from
qualification, and identity continuity remains an explicit judgment.

If separately introduced S1 and S2 appear to designate the same thing, record a
qualified correspondence and preserve both references and their original accounts.
If S0 conflates two things, record that finding and introduce/reference S1 and S2.
Do not automatically distribute old claims or edges between them. A legitimate
whole with two parts is not necessarily a conflation.

**Split candidate proposed by the human.** Preserve S0, optionally relabel its current
designation as “conflated X and Y,” and introduce/reuse separate references for X and
Y. Retain a qualified conflation finding connecting them. The finding, not the label,
carries the claim; it can itself be contested. S0 continues to identify the earlier
designation and its history, rather than silently becoming a new architectural union
object. Do not retarget its accounts or distribute their claims automatically. Exact
earlier answers preserve their original labels/support; fresh access can expose the
later label and finding. This remains a candidate split policy, not an adopted rule.

There is a close precedent in [Wikidata's conflation guidance](https://www.wikidata.org/wiki/Help:Conflation):
it supports explicit conflation items and separation into distinct items. Its
[split procedure](https://www.wikidata.org/wiki/Help:Split_an_item) preserves statement
references while reorganizing items. Borrow the explicit diagnosis and separate
referents, not an automatic transfer of PostCode's immutable claims. PROV's
[alternate/specialization distinctions](https://www.w3.org/TR/prov-o/#alternateOf)
describe aspects of the same thing or more specific descriptions; neither should
be treated as a ready-made conflation split. These references offer useful patterns,
not a decision procedure for whether two architectural referents are identical.

A correspondence or conflation finding alone does not trigger the existing
correction-based reconsideration machinery. An explicit correction of an identifying
investigram can trigger its established propagation; merely referring to the same
subject is not an exposure dependency. **Needs design:** decide whether that limit
is sufficient initially or whether further impact signaling is required.

Initially, prefer recording and exposing these accounts over automatic merging,
transitive equivalence, pooled histories or graph rewriting. Later reconciliation
can build on them without making names decide architectural identity.

## Worked thread: admission → trial → correction

### Structured selection and context origin

The human's direction is to avoid requiring prose interaction with PostCode. A UI
makes a subject selectable and offers declared investigation choices; CLI handles,
menus or badges are possible mechanisms, not chosen designs. Natural-language
questions in these notes explain the request's meaning, not required user input.

Selecting Half-open does not by itself identify an explanation it was followed from.
When the interaction identifies an exact originating account/answer location, include
that explanation as contextual input under an explicit bounded policy. A bare subject
selection or a subject-list entry may have no originating explanation; record none.
Do not infer origin from the latest answer, the account that first introduced S, or
whatever account happens to mention it. Known navigation alone also does not establish
human reliance or actual investigator exposure.

Both routes should supply relevant retained identifying descriptions for S, their
qualified scope and revision/conflict context. A contextual selection preserves the
description used there, with later correction context distinguished. A subject-only
selection resolves identifying candidates through explicit associations; it need not
invent an origin to do so. Multiple definitions are not silently reconciled and the
entire subject history need not be supplied. **Needs design:** candidate selection,
bounds and additional associated context for subject-only requests. These are distinct
from discovering every referring account; a bare selection does not guarantee that
ADMISSION-1 is found or available for correction.

### Sequence — the definition-child alternative

This sequence uses INTRO-1/DEFINITIONS-1 and TRIAL-RESULT-1/ROLE-DEFINITIONS-1
from the earlier child walkthrough. The complete JSON payload deliberately uses the
single-account alternative; their account IDs/composition must not be mixed. Both
exercise the same introduction, follow-up, correction and retained-access obligations.

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
3. **Follow-up.** The human selects S for concurrent callers and outcomes. The
   walkthrough chooses a request on S whose caller explicitly selects DEFINITIONS-1
   and ADMISSION-1 from ANSWER-1. An account follow-up focused on S remains an
   alternative; no origin-free context-selection policy is settled. In either
   case distinguish the subject, information need, selected descriptive context and
   navigation origin. To correct ADMISSION-1, the investigator must receive the target's
   complete own content, referent and qualifications, and obtain supporting program
   evidence. An ID or subject summary does not suffice. Existing account follow-up
   also uses bounded delivery, so neither route guarantees correction eligibility
   without checking what was actually supplied.
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
   account or saved assembly. Exact ANSWER-1 returns its
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
are substantively attributed to TRIAL-1 for citation/exposure even when stored on
the separate organizing record K; they need not be duplicated inside architectural
content. Receiving them cites TRIAL-1 but does not supply its complete own content.
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
reconsideration remains conservative: seeing an account is not proven reliance,
and its correction does not prove every exposed result false. Preserve current
propagation/exemption rules unless a later decision explicitly revises them.
On the citing side, all investigrams from one evaluation share its conservative
exposure index, including definition children and replacements. Splitting that output
does not narrow its citations. On the cited side, citations name particular
investigrams: an investigation receiving only a definition child need not cite its
behavioral sibling, so a later correction of that sibling need not flag it. With
embedded definitions, even a definition excerpt cites the mixed containing account.
Use explicit shared-subject introduction as a signal of expected reuse: if the result
also explains behavior, put identifying descriptions in children by default, grouping
where coherent. This avoids a particular exposure path, not all semantic dependencies
or warnings, and requires no prediction of which later query will occur.

Agreement in discussion: the investigating agent may judge that new findings warrant
correcting an earlier account during an ordinary follow-up. It must explicitly
identify the correction and provide reason/support; new detail or a shared subject
does not automatically imply replacement. PostCode checks delivery eligibility and
submission validity without thereby establishing the correction's truth.

Agreement in discussion: an investigation selected on Half-open S can return one
or more qualified items associated with Circuit Breaker P, explicitly as additions
or as replacements correcting exact earlier investigrams. The selected subject
guides the information need; it does not restrict output associations to that subject.
An addition preserves earlier items without implying error. A correction identifies
its target, replacement, reason and support and meets the complete-delivery rules;
the original remains retained. Both can occur in one accepted result.

Context and retained-content selections can be explicit. Automatic relevance
judgments, correspondence and synthesis establishing new claims require qualified analysis.
Capture actual selected input context: a stable subject ID alone is insufficient
as a reuse key when its supplied descriptions change.

**Needs design — request and origin.** Specify the request alternative above,
context acquisition/selection policy, request-time identity and reuse freshness.
Origin records lineage; it affects answer/reuse identity when it changes substantive selected input
or qualification, not merely because the human reached the same request differently.

### Shared local roles and exact illustration addresses

Use one optional role mechanism in the structured content-item envelope across forms:
`roles` declares item-local variables, `roleScope` qualifies their binding, and
`illustrations` supplies qualified mappings to scenario subjects and exact target items.
The admission item exercises this mechanism. The scenario state item references R
directly; a local name for that same participant adds no variable or generality.
An illustration maps a general account to an example, not two names for one scenario
participant. Keys remain scoped to exact items, not account-global or matched by name.
A local role is not a retained subject. Broader applicability still requires qualified
interpretation; syntax alone does not generalize the state model.

Cross-account item addresses fix an account reference plus a content key. Local keys
inside the item can further designate a role, case or relationship occurrence under
the form's rules; that is not independent correction identity. Supplied qualified
item content cites its containing account. Exact answer support/revision context stays
fixed. Fresh illustration access may report the target account's current revision
status while preserving the original item target. A superseded account does not prove
its particular illustrated item wrong, and matching replacement keys do not justify
retargeting. The explicit same-result link makes disclosure possible without becoming
an exposure citation or a new reconsideration/clearance rule.

The children fixture uses one owning position per account: result root, ordered child
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
explanation without supplying or citing it. Fresh selection discloses displacement rather than mutating the old tree.

### Composition as a design probe

Test both wrapping orders using separately qualified breaker and bulkhead accounts.
Content must distinguish outer/inner instance roles, their owned state/resources,
and where execution can wait. The examples contrast capacity occupied while
waiting for recovery with an admitted trial waiting for capacity.

A new composition interpretation can reuse subject IDs and accounts while
establishing these relationships with evidence. Selecting component accounts side
by side does not establish composition semantics. Reusing a policy kind does not
identify instance roles in two patterns as the same runtime object.

**Needs design — contextual referents.** Distinguish Half-open as a state category
from that state as held by a particular breaker role in a composition pattern.
Retain the state, role and pattern context explicitly. Determine whether a compound
reference suffices or independently investigated applications need their own identity;
neither flat labels nor a universal contextual-identity primitive is assumed.

The [first composition probe](structured-account-example/composition/README.md) now
supplies a separate bulkhead account and two authored ordering accounts continuing
the children variant. It reuses P/B/S, introduces the two ordered patterns, and keeps
scenario roles and waiting relations local to their interaction items. An explicit
situation records the bearer of S, occupied execution/queue/trial resources, and
application-work progress. Exact account/item/role/relation/situation designations
support follow-up without allocating a new contextual subject automatically.

This is an initial recommendation to test, not a settled identity design. The cases
are possible finite prefixes under different explicit setups: the outer-bulkhead
case needs capacity for the later caller to reach the breaker; the outer-breaker
case uses a shared bulkhead occupied by independent work. Wrapping order alone does
not establish either wait. Qualified synthesis uses the component accounts plus
wrapper evidence; it neither reuses earlier scenario R/W as identical objects nor
transplants their trace as a general template.

Probe-local interaction fields expose policy order, local relations and asserted
situations. Whether situations should become a separate catalogue form remains open;
that would require explicit role correspondence across forms. The current one-item
role scope avoids that mapping and therefore does not validate it. No universal
resource ontology or general waiting-subject identity is established. Authored
fixtures and rendered sequence diagrams test representability, not live investigator
reliability or supported API acceptance. Whether generated composition investigation
belongs in the first implemented capability remains open.

The revised origin-free composition context selects ADMISSION-2, with K's qualified
reason and endpoint references. ADMISSION-1 is accessible on request but its content
is not delivered or directly cited. K's explanation cites its reporter, TRIAL-1;
this history disclosure is not complete correction context and claims no exemption.
Relevant conflicting accounts and explicit historical requests remain reasons to
supply other content under the existing delivery rules.

The probe now defines and checks two exact nested selectors: a local relation key,
or a particular state assignment identified by situation plus bearer and category.
Unknown, mixed and ambiguous selectors are rejected. This exercises addressing, not
a live follow-up or promotion. Both composition traces still describe entry to
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
The mapping belongs to the exact diagram/legend pair, not subject identity. A selected
figure and legend are not automatically complete own-account delivery. This updates
the illustrative content contract without introducing a general presentation system.


**Discussion distinction and recommendation.** Retaining qualified accounts and
expressing architectural meaning are separate design questions. Reuse the subject,
association, evidence, immutable-account, correction and exact-access mechanisms
for structured interpretive content. Add content forms that express the architectural
claims themselves. A transition record can refer to existing state and participant
subjects while its containing investigram supplies attributable support and limits.
It need not become a separately retained subject unless continuity or investigation
requires that. Correcting the record initially means replacing its whole investigram,
not silently updating a canonical state-machine graph.

This is a recommendation about the domain mechanism, not a claim that the current
prose transport works unchanged. Each form needs defined meaning, reference checks,
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
forms, but validating a transition requires knowing what its fields mean. **Needs
design:** choose a small vocabulary for the admission/trial example and express one
state transition and one interaction through it before settling payload schemas.
These recommendations do not yet adopt a vocabulary or schema.

**Emerging proposal — architectural concept catalogue.** The human proposes that
PostCode supply established architectural concepts for two purposes: an agent-facing
vocabulary/ontology for framing investigations and explanations, and support for
communicating those explanations through diagrams. The vocabulary is useful even
when no diagram is appropriate. Use one structured content model: a supported form
can be as simple as a keyed prose explanation, and other forms express states,
transitions or interactions. Results may combine these forms. The catalogue is not
limited to diagram types; prose is content within the model, not a separate channel.

An investigator can use a concept because the investigation requests it or because
the investigator judges it relevant. Recommend distinguishing concept meaning and
applicability guidance from its supported structured content forms and diagram
mappings. A concept may support several forms or no diagram form; several concepts
may contribute to a diagram. Returning a concept identifier does not by itself
require a diagram payload. If the request requires a specialized form, however, a
keyed prose item alone does not silently satisfy it; missing information or unsupported output must
be explicit. Exact request/result conventions remain to be designed.

Recommend catalogue entries with stable identifiers, versioned meanings/contracts,
source/adaptation, applicability guidance, examples and treatment of partial knowledge.
Content forms specify data requirements, potentially with JSON Schemas. Keyed prose
items and specialized forms retain the same qualification requirements. Schema checks can validate shape;
reference and content-specific checks still need defined rules, and none establishes
the truth or applicability of the architectural claim. Versioned contracts preserve
the meaning of retained content when the catalogue evolves. Exact packaging remains
to be designed, including whether several content blocks share an investigram.

**Unified structure, including prose.** The human rejects a prose-versus-structure
split: a key with prose is itself a useful structured form. This can simplify the
proposed return protocol and makes prose items addressable through the same local
designation mechanism. Preserve the separate meanings of an item/local key, a
concept identifier, a form identifier and a subject reference; exact field names
remain open. Specialized forms add explicit architectural relationships and fields
where useful. A keyed explanation can discuss a transition without supplying the
explicit endpoints/conditions needed for a diagram; filling those gaps still
requires qualified analysis. A form or local key does not by itself allocate a
shared subject or change whole-investigram correction granularity.

**Tradeoffs raised on review.** Uniform structure does not make prose's architectural
meaning explicit: consumers still cannot mechanically extract transitions from an
arbitrary keyed paragraph. Mandatory fine-grained keys would add authoring/validation
overhead and pressure agents to fragment explanations. Prefer a small prose form
that can hold a coherent explanation; require additional addressability only where
references or the chosen form need it. Keep arbitrary local keys distinct from
controlled concept/form vocabulary so invented labels do not imply understood
semantics. A generic prose fallback must not conceal failure to supply a requested
specialized form. If every new form were required to carry a diagram mapping or
schema, extensibility would become unnecessarily expensive; those obligations
depend on the form's intended handling. The recommendation is a common content
protocol with varied semantic detail, not an assertion that all content is equally
amenable to mechanical use. Exact mandatory keys and nesting remain open.

**Agreed exploratory direction — agent source references.** Catalogue entries should
give concise, self-contained guidance and may directly refer agents to source
material for deeper understanding, preferably specific sections. Agents need not
read the full sources to use a supported form. State PostCode's selected subset or
adaptation explicitly: deeper reading does not silently expand the content contract.
Concept references support architectural terminology and methods; claims about the
investigated program still require their own evidence and qualifications.

Concept identifiers identify architectural meanings; form identifiers/versions
identify particular data contracts. Their encoding together or separately remains
open. Neither is a subject identity or Lens identity. A state-transition account can reference Half-open S without making
S's subject record an instance of the account schema. Several investigations can
produce the same form; one investigation can return several forms alongside prose.
Selecting a form does not itself establish that it applies: the investigation must
qualify that interpretation. Open topic labels remain available within supported
forms; an invented label does not create a new understood contract. Start by drafting
the state-behavior entry needed by the example, including a keyed prose form and
a specialized state/transition form, not a comprehensive catalogue.

**Local keys and later promotion.** The human proposes keys for structured elements
both for internal references (nodes and transition endpoints) and for later subject
promotion, while leaving room for investigator discretion and contextual selection.
Recommend that each contract require local addressability where its structure needs
references, without requiring every value to have an explicit key. The investigator
can choose keys and optionally designate additional elements. Structured element keys
can serve as local designations when their scope and referent meaning are defined;
they do not automatically allocate shared subjects. An unkeyed retained element can
still be selected through an exact content locator and contextual designation.
**Needs design:** key scope across multiple content blocks, distinction between a
record and the architectural thing it describes, and selection/promotion binding.
Keys or content paths in different account revisions never establish continuity
merely by matching. Diagram selection uses the same mechanism by mapping back to
retained content; it is not a separate source of architectural identity.

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
absent from a partial account. If nested/concurrent regions are needed, record their
meaning rather than treating them as merely visual grouping. These refinements are
recommendations to test, not an adopted schema.

Check whether the example supplies those information requirements, with exact
account/support references and explicit unknowns. A concurrent-caller sequence
account should additionally test participants, ordering, waiting and alternatives
through the admission correction. Depiction must eventually be possible without
inventing architectural claims. Follow the content exercise with a small rendering
experiment; layout, styling and interactive navigation remain outside this scope.

Use a few forms justified by explanatory needs, permitting qualified prose inside
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

Combining accounts in a view requires exact identity guarantees or qualified
correspondence for each alignment. Shared relationship IDs are one route, not a
requirement to identify every prose relationship. Without established correspondence,
retain separate depictions, disclose unresolved alignment, or decline the combined
view; never merge transitions merely by endpoints. **Needs design:** inventory the
specific shared transitions/roles needed by these diagrams and their supplied
identity/correspondence evidence.

Prefer coherent whole investigrams for independently correctable interpretive items
initially. An account may select several such units. Fine-grained content addresses
can aid navigation without implying fine-grained replacement. Current corrections
replace whole investigrams and require complete target delivery; partition content
accordingly or motivate an explicit governing change. Subordinate investigrams offer
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
narrow what later evaluations cite by allowing a definition to be delivered without
its behavioral sibling. This is a stronger argument than avoiding replacement copying.
An investigator-facing default is: when a result mixes explicit shared-subject
introductions and behavior, put the identifying descriptions in one or more children.
An identification-only investigram may be the root without an extra wrapper; local
terms can stay embedded. Group related descriptions rather than normalizing every
assertion into a child. A departure should state its coherence/delivery rationale and
acknowledge the broader correction/citation unit. This remains a recommendation;
the children variant now exercises ownership, independent qualification and support
selection in authored fixtures, not through the implemented application.
Compare the producing evaluations as well as direct citation targets. DEFINITIONS-1
received only ORIENTATION-0; its consumers avoid the separate admission sibling's
correction path. COMPOSITION-DEFINITIONS-1 shares seven synthesis citations, so
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
substitute for complete delivery. The exact rules depend on the chosen forms.

## Existing machinery and application boundary

**Account-to-account relationships: specific mechanisms, no general alternative link.**
Inspection of [contracts](../src/lib/investigation/contracts.ts),
[acceptance](../src/lib/investigation/acceptance.ts) and
[revision processing](../src/lib/investigation/revisions.ts) confirms:

- A reporter can return a correction naming an earlier target A and embedding a
  newly constructed replacement B, with reason, evidence and qualifications. Acceptance
  allocates separate correction/replacement records and processing gives that link
  replacement-selection, conflict and reconsideration consequences.
- A reporter can return an unresolved inconsistency with references to earlier
  accounts, reason and support. Targets require substantive delivered content.
  These records are retained and indexed for affected-account inspection, without
  implying replacement. Newly submitted sibling accounts are not eligible targets.
- Composition and investigation provenance encode parts of a result and follow-up
  lineage, respectively. Neither establishes a semantic comparison.
- An account can refer to earlier accounts and explain a relationship in prose, but
  that alone does not create a recognized/indexed alternative relationship.

Thus a qualified relationship “new B is an alternative to A” has useful precedents
but needs a submission, validation, retention and access extension. Do not merely
rename the correction field and inherit replacement effects. Specify how links name
newly returned accounts (local references or explicit construction), who owns the
qualified relationship explanation, and what operations discover it. This remains
design work, not an implemented generic account-relationship facility.

**Existing hierarchy, proposed subject semantics.** A single investigation already
returns one root with recursive child investigrams. PostCode validates the result
tree and assigns each investigram its own retained identity. The proposed
definition/admission partition uses that existing composition machinery; it does
not introduce hierarchical investigation results. Explicit introduction of shared
subjects such as Half-open, and qualified per-subject identifies associations, are
proposed extensions. See the [submission contract](../src/lib/investigation/contracts.ts)
and [acceptance code](../src/lib/investigation/acceptance.ts).

The inspected implementation provides immutable investigrams, fixed composition,
qualified associations, atomic result acceptance, corrections/conflicts,
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
  identity and qualified information; contextual promotion if included in the slice.
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

Recommend one mechanical producer and subsequent interpretation sharing the subject
mechanism; admission/follow-up/correction; explicit selection and exact historical
access; and the representative diagram content above. Preserve all three introduction
routes in the design, but distinguish model coverage from first delivery.

**Scope choice remains open.** The initial proposal exercised all routes through
implementation. The review recommends explicit introduction/reuse as the delivered
path, with local/prose promotion, correspondence/conflation and composition as
design or fixture probes initially. That narrower path is the current recommendation
for discussion, not an agreed reduction. A fixture using seeded material does not
demonstrate an implemented promotion or reconciliation operation.

Validation needs several kinds of evidence:

- **Deterministic application fixtures:** actual retention/evidence/API paths with
  scripted investigator communication. Check reference integrity, duplicate names,
  atomic rejection, full/partial delivery, unsupported corrections, conflicts,
  continuity and unchanged exact answers. Include promotion and qualified
  correspondence/conflation at the level selected by the scope decision, explicitly
  distinguishing model probes from delivered application operations.
- **A real investigation:** start at an ordinary supported entry, discover a usable
  subject, follow it, reuse actual retained content and acquire program evidence.
  Assess semantic fidelity independently. Seeded orientation does not demonstrate
  discovery; a seeded omission does not demonstrate reliable error detection.
- **Content-to-diagram inspection:** construct small views from retained content;
  check traceability, omissions, conflicts and role distinctions. Content sufficiency,
  truth and human intelligibility are separate questions to assess.

Checks must be possible within the supported Session lifetime. Defer cross-Session
identity, automatic equivalence, general inference, universal schemas, automatic
account reconciliation, full presentation/navigation and the minimal GUI.

## Choices to discuss before a planning package

### Assumptions to challenge after the acceptance-bias review

**Terminology after comparison.** The earlier proposals to use “revision,”
“replacement” or “alternative” as a universal substitute for correction have given
way to distinguishing account-relationship kinds. An alternative need not correct
anything; a correction asserts an error and proposes replacement, with attributable
reasons rather than app-certified truth. “Revision” can remain general explanatory
language, but no global governing rename is recommended here. Current Correction
and RevisionStatus contracts remain binding until explicitly revised.

**Correction remains compatible with this framing.** In response to the human's
question about revisiting the existing mechanism, inspection of the accepted
[correction contract](../docs/decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation)
supports retaining correction as an attributed, qualified assertion that a specific
account should be replaced. It preserves originals, supports competing replacements
and unresolved inconsistencies, and explicitly says primary selection does not
resolve conflict. Acceptance validates contracts/references and delivery, not truth.
The current recency-based primary-selection rule is a display heuristic, explicitly
not credibility. This is an organizational consequence of a correction, not a global
truth-maintenance obligation. Do not weaken an explicit replacement assertion into
an undifferentiated alternative, or treat its acceptance as semantic adjudication.

Revisit fit and consequences rather than reverse the design wholesale: distinguish
an omitted case in a purportedly complete admission account (potential correction)
from an additional case outside an explicitly narrow account's scope (addition);
check primary-selection/conflict disclosure against the example; compare correction
units without demanding perfect impact propagation. No governing revision is
proposed solely because the system retains contradictory accounts. Whether a new
account is sufficiently supported to correct an old one remains investigative
judgment, including possible unresolved disagreement about the correction itself.

**Follow-up distinction — adoption versus historical retention.** The human points
out that fixing an identified factual error is not reconciling legitimate partial
views, and questions whether retaining the uncorrected account is necessary.
Recommend assessing three policies separately: current selection of an explicit
correction's replacement, historical retention of the earlier account, and warnings
on accounts exposed to that earlier content. Alternative accounts should not acquire
correction consequences merely because they differ. Conversely, an explicitly
supported correction need not remain a coequal current explanation to honor plural
accounts. Acceptance still does not mechanically establish its truth.

Retaining the earlier account has an independent purpose: preserve exact earlier
answers and the content actually supplied to later investigations, allow inspection
of the error/reason, and permit challenge to a mistaken correction. This does not
require routinely supplying the old account as a current alternative, indefinite
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
  stable ID nor the investigator's replacement declaration proves sameness. Local or
  contextual promotion likewise establishes a designation, not automatic equivalence
  between the selected content occurrence and an independently known subject.
- **Catalogue granularity.** The inventory mixes architectural concepts, view
  families and notations; it is not already a coherent ontology. Test whether concept
  guidance, content contracts and diagram mappings need distinct entries and
  relationships. Do not assume a schema for each named concept or let the diagram
  inventory define the full architectural vocabulary. Keep the initial catalogue small.
- **Definition partition and support.** A definition child is an example partition,
  not a universal normalization rule. The actionable default uses explicit introduction
  of shared subjects, when mixed with behavior, as the signal for identifying children.
  Later consumers can cite their definitions without the behavioral sibling. It still adds support/composition obligations and
  does not narrow exposure shared by outputs of the producing evaluation. The mixed
  concrete payload demonstrates the contrasting cost; current rules remain governing.
- **Automatic identifying support.** Exact snapshots are sound, but selecting which
  descriptions ground a reference can require interpretation. Test two competing
  descriptions of S. Prefer explicitly anchored support or visible unresolved
  alternatives; an application selector must not synthesize a definition or claim
  compatibility merely to make an answer readable. Bounded closure remains open.
- **One mechanism across producers.** Shared subject/reference semantics remain the
  intended direction. The first delivery's migration depth and common retention
  machinery are not demonstrated by that principle. Test one mechanical producer
  and one interpretation before fixing internal factoring or broad migration scope;
  preserve mechanical guarantees and avoid unnecessary parallel identities.

1. **Concrete concept and content contracts.** Organize concept guidance, supported
   forms and diagram mappings; draft the state-behavior and interaction entries
   needed by the example. Specify returned identifying content, local references,
   promotion declarations and account-relationship metadata. Establish attributable
   support and full/partial delivery, without requiring a comprehensive catalogue.
2. **Account boundaries.** Review the concrete mixed-account payload against the
   recommendation for independently deliverable identifying children. Show what is
   retrieved and replaced when one description or admission claim changes, including unchanged content and root/child behavior.
   Addressability and qualification do not establish independent semantic validity.
3. **Account-relationship semantics.** Specify initial kinds, endpoint roles,
   reporting/support, reference validation and discovery. Preserve distinctions
   between coexistence, reported inconsistency and explicit correction. Decide
   what challenging a correction means or disclose that changing its standing is
   deferred; do not accidentally infer withdrawal from revising its reporter.
4. **End-to-end subject and application access.** Specify interpreted identity and
   reuse guarantees, exact naming/local-key resolution, qualified identifies/refers-to
   associations, ordinary entry and applicable investigation offers. Work through
   subject-only versus explicit-origin context, dialogue acquisition, competing
   descriptions and exact-answer support. Demonstrate one mechanical producer and
   interpretation through the common subject contract; deeper factoring can emerge.
5. **First delivery and verification.** Decide which introduction/promotion paths,
   relationship kinds and reconciliation operations are delivered versus only probed.
   Composition and merge/split remain design probes unless explicitly included.
   Use real investigation to test discovery/reuse, fixtures for lifecycle and API
   guarantees, and bounded rendering for content sufficiency. Human pushback and
   general presentation remain out of scope; detailed reassessment is deferred as
   recommended above. Preserve exact history and disclose unsupported operations.

## Designs and theories to build on

Use [incremental formalization](https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html)
to guide coexistence of prose, local structure and shared subjects;
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
