# Structured architectural accounts: working proposal

Updated: 2026-11-10

Exploratory synthesis for discussion, incorporating the emerging direction and a
recommended bounded capability. This is not an adopted design, planning package,
or implementation authorization. Recommendations and unresolved choices remain
open. The [discussion notes](structured-architectural-accounts.md) retain the
alternatives, implementation inspection and research behind this synthesis.

Review follow-up: the [review assessment](structured-architectural-accounts.md#review-assessment-unresolved-contracts-2026-11-10)
identifies unresolved terminology, addressing, request/selection and completeness
contracts in this version. Its proposed scope reduction has not been agreed.

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
| Subject | An identified referent that investigations and information can concern: a module, policy kind, state, instance role, execution role, relationship, or account itself. Names aid recognition; IDs establish reference. |
| Qualified item | Information about one or more subjects, with attributable scope, evidence, method/provenance and limitations. Definitions are one kind of information among others. |
| Investigram | The existing immutable unit of retained interpretation, potentially containing structured content and prose. Mechanical claims retain their own character and guarantees. |
| Architectural account | A coherent explanation that may occupy one or several investigrams. This need not introduce another retained aggregate type. |
| Working selection | Exact qualified parts selected for a question, with selection basis and revision context. Selection does not establish a synthesized explanation. |
| Exact answer | The existing fixed record of selected content and support, including the revision/association context captured for that answer. |

The retained architectural model comprises subjects, qualified information,
relationships, support and revision/conflict history. It can be partial, contested
and incomplete. Identity does not establish that a hypothesized relationship exists
or that an account is correct. Cross-Session persistence and correspondence across
program revisions are outside this first scope.

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

Exact item/account references identify correction targets. Titles or topic labels
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
and revision context; substantive summaries count as exposure, not complete delivery.

## Introduction and change

Allow three routes into the same subject mechanism:

1. **Explicit introduction.** An investigation declares a useful subject using a
   submission-local key, a name and an attributable identifying description.
   PostCode validates the result and assigns a retained ID. Other content in the
   same result can use that local key before allocation.
2. **Local designation.** An account gives something a local key without creating
   a shared subject yet. Later exploration can promote the exact account/key pair;
   repeated promotion resolves to its established binding.
3. **Prose selection.** A human follows wording such as “Half Open.” PostCode can
   establish “Half Open as used in account A,” retaining the exact account and
   selected occurrence/context where available. This records a focus, not an
   inferred precise architectural definition.

All routes preserve origin. Later accounts can improve a subject's definition, but
do not retrospectively enrich the original. Promotion adds a retained mapping or
qualified association; it does not mutate the originating investigram's referent
list or earlier answers. Ambiguous wording can remain unresolved pending analysis.
Subject creation needs an application operation; presentation binding is insufficient.

Later context supplies subject IDs, relevant exact descriptions and qualifications.
New information identifies the subject ID. Replacement also identifies the exact
earlier account, its replacement and a supported reason: subject ID alone cannot
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
3. **Follow-up.** The human selects S for concurrent callers and outcomes. Context
   includes its selected definition, qualifications and exact earlier-account
   references. To correct ADMISSION-1, the investigator must receive the target's
   complete own content, referent and qualifications, and obtain supporting program
   evidence. An ID or subject summary does not suffice.
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
omission in admission behavior may leave the identifying description unchanged.

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

### Composition as a design probe

Test both wrapping orders using separately qualified breaker and bulkhead accounts.
Content must distinguish outer/inner instance roles, their owned state/resources,
and where execution can wait. The examples contrast capacity occupied while
waiting for recovery with an admitted trial waiting for capacity.

A new composition interpretation can reuse subject IDs and accounts while
establishing these relationships with evidence. Selecting component accounts side
by side does not establish composition semantics. Reusing a policy kind does not
identify instance roles in two patterns as the same runtime object.

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

Prefer coherent whole investigrams for independently correctable interpretive items
initially. An account may select several such units. Fine-grained content addresses
can aid navigation without implying fine-grained replacement. Current corrections
replace whole investigrams and require complete target delivery; partition content
accordingly or motivate an explicit governing change.

## Existing machinery and application boundary

The inspected implementation provides immutable investigrams, fixed composition,
qualified associations, atomic result acceptance, corrections/conflicts,
exposure/reconsideration, and direct selected-content/exact-answer access through
the [application API](../src/lib/application/index.ts). It currently has prose-only
investigation content, module/investigram investigation targets, and narrower
subject resolution. The proposed model is not already supported.

The capability needs a continuous path through:

- Common subject declaration/reuse, contextual promotion and lookup, integrated
  with existing mechanical identity and qualified information.
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
access; and the representative diagram content above. Exercise all three subject
introduction routes, with their implementation priority still open. Keep composition
as a representation probe unless discussion makes it a delivery requirement.

Validation needs several kinds of evidence:

- **Deterministic application fixtures:** actual retention/evidence/API paths with
  scripted investigator communication. Check reference integrity, duplicate names,
  atomic rejection, full/partial delivery, unsupported corrections, conflicts,
  continuity and unchanged exact answers. Include promotion and qualified
  correspondence/conflation examples.
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

1. **Item and correction boundaries.** Prefer whole-investigram independently
   correctable items. Work through whether definitions/classifications belong in
   separate small units or coherent larger accounts. Smaller units reduce unrelated
   correction exposure but can fragment explanations and increase bookkeeping.
   Resolve how clarification of a contextual definition differs from correction.
2. **Follow-up context and working selection.** Prefer explicit selections plus
   originating content and relevant correction context initially. Specify how other
   associated items are offered/retrieved, completeness for each form, and effective
   input selection for reuse. Automatic semantic selection adds analysis obligations.
3. **Shared-mechanism migration and entry.** Decide which existing producers/subject
   kinds migrate first and how ordinary entry reaches the first interpreted subject.
   A mechanical module plus interpretation is a useful minimum demonstration, not
   proof of complete migration. Transitional representations need explicit bounds.
4. **Content forms and subject introduction.** Choose the smallest recognized forms
   that supply the three diagrams, and specify local/prose promotion and unknown
   classification. Useful investigation should not require fully classified subjects
   or treat arbitrary labels as machine-understood semantics.
5. **Composition and reconciliation depth.** Decide whether fixtures/design probes
   suffice initially, or whether first delivery must generate composition and
   operationalize merge/split navigation. Broader coverage tests extension sooner
   but adds scope beyond the core continuity/correction thread.

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
