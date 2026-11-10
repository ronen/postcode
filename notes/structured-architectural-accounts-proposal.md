# Structured architectural accounts: working proposal

Updated: 2026-11-10

Exploratory synthesis for discussion, incorporating the emerging direction and a
recommended bounded capability. This is not an adopted design, planning package,
or implementation authorization. Recommendations and unresolved choices remain
open. The [discussion notes](structured-architectural-accounts.md) retain the
alternatives, implementation inspection and research behind this synthesis.

This version incorporates the clarifications from the
[review assessment](structured-architectural-accounts.md#review-assessment-unresolved-contracts-2026-11-10).
Remaining choices are marked **Needs design** where they arise and collected below.
The proposed reduction of first-delivery scope has not been agreed.

The [foundation](../foundation/README.md), [application specification](../docs/app-specification.md),
[core concepts](../docs/core-concepts.md), [architectural constraints](../docs/architectural-constraints.md)
and applicable accepted decisions remain governing. The
[structured-interpretation decision](../docs/decisions/structured-investigram-content.md)
permits exploring this content while preserving qualification and revision contracts.

## The proposed capability

PostCode retains architectural subjects and qualified accounts about them so that
successive investigations can reuse, extend and challenge understanding. Subjects
provide continuity; accounts provide attributable descriptions and claims. Neither
shared identity nor a current selection requires the accounts to agree.

Start with admission → trial → correction over one captured Cockatiel revision,
under default single-trial recovery, within one supported Session. Use composition
order to probe whether the content can express new relationships across accounts.
Broader graphical investigation and the minimal GUI follow separately.

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
| Investigram | The existing immutable unit of retained interpretation, potentially containing structured content and prose. Mechanical claims retain their own character and guarantees. |
| Architectural account | A coherent explanation that may occupy one or several investigrams. The explanatory term alone does not give a collection an identity or make it a correction target. |
| Working selection | Exact qualified parts selected for a question, with selection basis and revision context. A retained selection is immutable; a changed selection produces another answer rather than mutating it. Selection does not establish a synthesized explanation. |
| Exact answer | The existing fixed record of selected content and support, including the revision/association context captured for that answer. |

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

**Needs design — selection owner.** Prefer extending the existing immutable
investigation-selection Projection for retained selected answers. Its Lens/question,
parameters, supported constituents and selection policy need a contract. Investigation
input selections and mutable future Workspace/View choices remain distinct uses;
they do not make the retained answer mutable or require a Workspace in this slice.

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

### Items, topics and associations

Use a small extensible vocabulary for information requiring special handling,
including identifying descriptions and the structured forms needed by the selected
diagrams. Investigations can invent meaningful topics using supported qualified
content forms. The initial recognized vocabulary remains to be chosen.

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
- **Supports** attributes evidence or prior interpretation to particular content.
- **Architectural relationships** describe the program, such as ownership or waiting.

The selected input subject and actual prior-content exposure are separate again.
Extend the existing referent/association machinery rather than maintain duplicate
inventories with unclear ownership. Index results expose IDs, roles, titles, scope
and revision context; substantive titles and summaries count as exposure, not
complete delivery. Rich listings can therefore broaden later reconsideration.
**Needs design:** choose useful listing content and bounds while preserving those
exposure rules; relabeling substantive text as metadata cannot avoid them.

## Introduction and change

Allow three routes into the same subject mechanism:

1. **Explicit introduction.** An investigation declares a useful subject using a
   submission-local key, a name and an attributable identifying description.
   PostCode validates the result and assigns a retained ID. Other content in the
   same result can use that local key before allocation.
2. **Local designation.** An investigram gives something a local key without creating
   a shared subject yet. Later exploration can promote the exact investigram/key pair;
   repeated promotion resolves to its established binding.
3. **Prose selection.** A human follows wording such as “Half Open.” PostCode can
   establish “Half Open as used in account A,” retaining the exact account and
   selected occurrence/context where available. This records a focus, not an
   inferred precise architectural definition. The initial designation is an
   attributed selection record, not an investigram fabricated from the human action.

Submission-local subject keys and investigram-local designation keys have different
owners and must remain distinguishable. Equal local keys in ADMISSION-1 and its
replacement do not establish continuity. Reuse an existing shared subject reference
or retain an explicit mapping with appropriate support; never inherit by spelling.

**Needs design — prose selection.** Define the selection record's qualification,
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

Relationships may themselves have subject identities and qualified accounts. Use
the same explicit/local/prose routes rather than requiring every relationship to
become a shared subject immediately. A relationship account supplies participants,
roles, conditions and direction/order where meaningful; its identity alone supplies
none of those claims. Equal labels or endpoints do not establish relationship identity.

If separately introduced S1 and S2 appear to designate the same thing, record a
qualified correspondence and preserve both references and their original accounts.
If S0 conflates two things, record that finding and introduce/reference S1 and S2.
Do not automatically distribute old claims or edges between them. A legitimate
whole with two parts is not necessarily a conflation.

A correspondence or conflation finding alone does not trigger the existing
correction-based reconsideration machinery. An explicit correction of an identifying
investigram can trigger its established propagation; merely referring to the same
subject is not an exposure dependency. **Needs design:** decide whether that limit
is sufficient initially or whether further impact signaling is required.

Initially, prefer recording and exposing these accounts over automatic merging,
transitive equivalence, pooled histories or graph rewriting. Later reconciliation
can build on them without making names decide architectural identity.

## Worked thread: admission → trial → correction

This adapts the [connected examples](initial-journey/cockatiel-account-examples.md).
Their static Cockatiel account concerns the recorded revision; the waiting omission
and its discovery are staged. This proposal adds no verification of library behavior.

1. **Entry and orientation.** A supported mechanical analysis identifies module M.
   An interpretation identifies Circuit breaker policy kind P, with a qualified
   connection to M. This establishes a path from ordinary application entry to an
   architectural subject. A fixture may seed orientation for narrower tests.
2. **Admission.** ADMISSION-1 describes admission and inspection under the stated
   recovery configuration. It introduces Half-open S, or exposes a local designation
   that can be promoted. Its description H1 distinguishes the state from a trial
   execution. ANSWER-1 fixes the selected content and support.
3. **Follow-up.** The human selects S for concurrent callers and outcomes. The
   request form remains unresolved: it could investigate S with explicitly selected
   earlier context, or investigate ADMISSION-1 with a declared focus on S. In either
   case distinguish the subject, information need, selected descriptive context and
   navigation origin. To correct ADMISSION-1, the investigator must receive the target's
   complete own content, referent and qualifications, and obtain supporting program
   evidence. An ID or subject summary does not suffice. Existing account follow-up
   also uses bounded delivery, so neither route guarantees correction eligibility
   without checking what was actually supplied.
4. **Extension and correction.** TRIAL-1 reuses S, distinguishes the shared breaker
   instance role from execution roles, and accounts for waiting and later outcomes.
   The result also supplies ADMISSION-2 and an explicit correction of ADMISSION-1.
   Accept it atomically; preserve the original and its fixed composition. A new
   result does not append children to the old investigram; replacement composition
   remains disjoint as required by the existing contract.
5. **Current use and historical access.** A working answer selects ADMISSION-2 and
   TRIAL-1 with qualifications and correction context. It need not synthesize a new
   account. Exact ANSWER-1 returns its captured selection/context; fresh inspection
   of ADMISSION-1 can disclose later corrections around the unchanged original.
   Neither operation silently redirects its exact reference.

H1/H2 illustrate subject-definition revision where a definition changes; they need
not be extra independently retained objects in every admission correction. An
omission in admission behavior may leave the definition's meaning unchanged. If H1
is embedded in the root's own content, however, replacing the root replaces that
content too and the replacement must supply its description. A separate definition
child is independently correctable; root replacement does not automatically carry
that child or a corrected successor into its new composition. The example has not
yet selected a root/child partition or its resulting answer selection.

Preserve three independent dimensions:

| Dimension | Example |
| --- | --- |
| Revision status | ADMISSION-1 has a replacement, possibly competing replacements. |
| Applicability | TRIAL-1 covers default single-trial recovery, not every configuration. |
| Working selection | This answer selects ADMISSION-2 and TRIAL-1 for this question. |

Existing replacement preference does not resolve conflicts. Exposure-based
reconsideration remains conservative: seeing an account is not proven reliance,
and its correction does not prove every exposed result false. Preserve current
propagation/exemption rules unless a later decision explicitly revises them.

Initially a working selection can be explicit. Automatic relevance judgments,
correspondence and synthesis establishing new claims require qualified analysis.
Capture actual selected input context: a stable subject ID alone is insufficient
as a reuse key when its supplied descriptions change.

**Needs design — request and origin.** Specify the request alternative above,
context acquisition/selection policy and effective-input identity. Origin records
lineage; it affects answer/reuse identity when it changes substantive selected input
or qualification, not merely because the human reached the same request differently.

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

Recommend probing this representation now; whether a full generated composition
investigation belongs in the first implemented capability remains open.

## Structured content and diagrams

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

**Prerequisite — structured delivery.** Before using corrections on structured
content, specify how all required own content, referent information and attributable
qualifications are delivered, how bounded excerpts/omissions are reported, and how
actual deliveries establish completeness. Update content-part tracking and context
transport accordingly. Shape validity, an ID, or a diagram's selected fields cannot
substitute for complete delivery. The exact rules depend on the chosen forms.

## Existing machinery and application boundary

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
- Working selection and exact retrieval preserving new content, qualifications,
  corrections and fixed support through the direct API.

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

1. **Identity and addressing.** Specify guarantees for interpreted referents of
   implemented architecture, including contextual roles and governing changes.
   Keep exact investigram addresses separate from selected collections. Settle local
   key namespaces, cross-correction mappings and prose-selection identity where needed.
2. **Item and correction boundaries.** Work through an embedded definition, a
   subordinate definition investigram and a separately selected definition. Show root
   and child correction behavior and the resulting answer selection. Resolve how
   clarification of a contextual definition differs from correction.
3. **Request, context and selection.** Choose subject investigation versus focused
   account follow-up; define originating context, selected input and lineage.
   Assess the proposed placement of retained selections in the Projection model,
   with declared question meaning.
   Specify interpretive Lens applicability and listing/exposure tradeoffs.
4. **Content and delivery.** Choose forms that supply the diagrams, define their
   complete/bounded delivery contracts before corrections, and establish the precise
   identity or correspondence needed for combined views. Formal validity and semantic
   fidelity remain separate checks.
5. **Shared-mechanism migration and entry.** Decide which existing producers/subject
   kinds migrate first and how ordinary entry reaches the first interpreted subject.
   A mechanical module plus interpretation is a useful minimum demonstration, not
   proof of complete migration. Transitional representations need explicit bounds.
6. **Delivery boundary.** Choose between the broader first scope and the review's
   explicit-introduction path with other mechanisms probed. Decide whether the
   absence of subject-wide reconsideration for standalone conflation findings is
   acceptable initially. Broader coverage tests extension sooner but increases scope.

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
