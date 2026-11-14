# Structured architectural accounts: working exploration

Started: 2026-11-09

Exploratory, non-governing notes. Recommendations below are discussion proposals,
not accepted decisions or implementation authorization. No draft planning package
has been requested yet.

For the consolidated current direction, start with the
[working proposal](structured-architectural-accounts-proposal.md). This discussion
record includes earlier alternatives later revised, particularly account-scoped
identity, eager relationship-subject creation and a facade over legacy subjects.
The [concrete walkthrough](structured-architectural-accounts-example.md) and
[current fixtures](structured-account-example/README.md) now exercise entity/result
context and association declarations, with separate association/content and inventory exposure.
Earlier dated entries preserve their then-current alternatives; whole-investigram correction,
blanket entity exposure and automatic disclosure of all additions in those entries are
historical. See the [exposure model alignment](#exposure-model-alignment) for the current pass;
the [earlier conformance entry](#entity-context-conformance) records the preceding migration.

## Scope established by the human

Explore accounts that successive investigations can reuse, extend and challenge,
preserving evidence, qualifications, conflicts and earlier accounts. Retained
content should supply the meaning needed by architectural diagrams and later
graphical investigation. Validate an eventual implementation independently through
the application boundary within the supported Session lifetime. Broader
presentation/navigation work and the minimal GUI follow separately.

Work is isolated on `codex/structured-architectural-accounts`, based on
`1805b3131fb57d2cdee93e059688045961ef8ec2`; local main matched fetched origin/main.
The human authorized these evolving notes. The scope is being explored
conditionally. Discussion agreements include explicit subject identities with
revisable qualified descriptions, extensible recognized item kinds alongside open
topics, and subject identities as a core aspect of the retained architectural model.
No representation decision is adopted.

## Inspected basis and existing machinery

Governing context: [product design](../foundation/product-design.md),
[application specification](../docs/app-specification.md),
[core concepts](../docs/core-concepts.md),
[constraints](../docs/architectural-constraints.md), and the accepted decisions on
[structured interpretation](../docs/decisions/structured-investigram-content.md),
[progressive investigation](../docs/decisions/investigrams-and-progressive-investigation.md),
[architectural investigation](../docs/decisions/specialized-architectural-investigation.md)
and the [application API](../docs/decisions/internal-application-api.md).

Exploratory inputs: [connected examples](initial-journey/cockatiel-account-examples.md),
[script](initial-journey/cockatiel-investigation-script.md), and
[findings](initial-journey/design-findings.md). Their Cockatiel behavior is an
illustrative static account at the recorded revision, not newly verified behavior.
The waiting omission and its discovery are staged.

- Immutable investigrams, fixed composition, qualified subject associations,
  whole-result atomic acceptance, corrections, competing replacements and
  citation-based reconsideration already exist. Fresh answer selection snapshots
  current revision/association information; exact answer access preserves its
  earlier snapshot. Exact investigram inspection and exact answer retrieval differ:
  a new inspection can retain newer revision context around the same original.
- Reuse currently matches a compatible operation request/method. It does not
  establish semantic equivalence between differently framed questions. Association
  selection answers which accounts explicitly describe a subject, not which ones
  best answer a particular question. Replacement preference follows the accepted
  recency policy across correction branches; it does not resolve disagreement.
- The [application entry](../src/lib/application/index.ts) already delivers full
  selected qualified content without CLI rendering, supports precise follow-up
  references and exact retrieval, and keeps work/usage separate from retained
  answers. [Direct journey tests](../test/application-journey.test.ts) exercise
  correction, conflicts, reconsideration, reuse and fixed earlier answers through
  this boundary, substituting only investigator communication.
- Content remains `prose` in [contracts](../src/lib/investigation/contracts.ts),
  [acceptance](../src/lib/investigation/acceptance.ts), investigator submission and
  [context delivery](../src/lib/investigation/context.ts). Complete delivery checks
  prose, referent and qualifications. All structured content would need equivalent
  coverage, including partial exposure and correction eligibility.
- Investigation operations accept a module or investigram, retain an originating
  module, and currently have no semantic parameters. Public subject resolution
  does not offer policy kinds, states or instance/execution roles as such.
  Existing associations connect accounts to supported subjects; they are not
  state-of, ownership, interaction or cross-account correspondence claims.
- No general working-account selection, architectural element designation,
  behavioral content contract or arbitrary multi-Projection composition is supplied
  by the existing API. Its provider `accounts.ts` concerns authentication accounts,
  not architectural accounts.

Inspection only: no tests or hosted investigations were run. A documentation
lag exists: the application-boundary plan/index still say approved/not authorized,
whereas STATUS and implementation describe the delivered API. This exploration
uses the inspected implementation for capability claims; plan lifecycle metadata
has not been changed.

## Initial recommendation and alternatives

Use admission → trial → correction as the primary bounded case: one program
revision, default single-trial recovery, implemented architecture, one live Session.
ADMISSION-1 exposes Half-open; the follow-up returns TRIAL-1 with ADMISSION-2 and
the explicit correction. ANSWER-1 remains exactly retrievable. A working selection
can contain ADMISSION-2 and TRIAL-1 without appending to ADMISSION-1's composition
tree or pretending they form a newly synthesized explanation.

Use the two composition orders as a design probe before fixing content contracts.
They test distinct component roles, resource ownership and a new qualified claim
using earlier accounts. Keep a full composition investigation a scope choice,
rather than automatically adding the rest of the journey. Starting with composition
would test cross-account synthesis sooner but also adds bulkhead discovery,
multi-account input selection and ordered roles before basic continuity is proven.

Prefer small coherent interpretation units that can be separately qualified,
selected and corrected. Do not make every sentence an investigram, or assume all
content belongs in one large account. Partition affects correction delivery cost:
the complete target's own content must be supplied, not merely its changed fields.

Keep three dimensions separate:

| Dimension | Example | Proposed treatment |
| --- | --- | --- |
| Revision | ADMISSION-1 has replacement ADMISSION-2; alternatives may conflict | Existing correction/reconsideration machinery; explicit snapshots |
| Applicability | TRIAL-1 concerns default single-trial recovery, not every configuration | Retained scope and request meaning; interpretive relevance judgments require qualified analysis |
| Working selection | The current answer selects ADMISSION-2 plus TRIAL-1 | Exact selected references with selection basis; no claim of consolidation or authority |

The smallest first design could let callers explicitly select already qualified
accounts; automatic semantic relevance ranking or reconciliation would be separate
analysis. Existing automatic replacement selection must retain its disclosures.

## Subjects, relationships and diagram demands

Prefer account-scoped designations for exposed architectural subjects, with explicit
meaning and supporting context. Whether these are structured content targets,
dedicated subject records or selected investigrams remains open. Avoid creating a
global canonical entity solely because two accounts use the same label.

For example, Half-open is a state of the breaker in this account; Shared breaker
instance is a role in a usage pattern, not an observed runtime object; Recovery
trial is an execution role; Individual execution has its own progress. Following
one must preserve that distinction and its account origin. Reusing an exact
designation preserves reference identity; claiming correspondence to a separately
introduced subject needs qualified support. Corrections must not retarget old
subject references; any successor correspondence needs explicit treatment.

| Representative diagram | Meaning retained content must supply |
| --- | --- |
| Small ownership/structure diagram | Policy kind, shared instance role, individual executions, supplied work and qualified relationships among them |
| Recovery state diagram | State owner, states, transition triggers, guards/conditions, effects and omitted cases; elapsed eligibility differs from an execution-triggered transition |
| Concurrent-caller interaction | Participants/roles, meaningful ordering, trial occupancy, waiting, release conditions and alternative later outcomes; possible scenario differs from observed execution |

Use a few explicit content forms justified by these examples, with attributable
prose and qualifications. A universal graph with arbitrary edge labels leaves too
much interpretation to consumers; a full UML/statechart model would prematurely
commit to semantics and completeness the evidence may not support.

Validation should demonstrate that simple independent consumers can construct the
representative diagrams from retained content alone. Every meaningful edge,
transition, ordering, condition and qualification must trace to that content;
layout may choose placement but cannot invent missing semantics. Include negative
cases: omitted transition, ambiguous identity, partial scope, conflicting accounts
and missing support must remain incomplete or refused. Formal shape/reference
checks do not establish behavioral correctness or human comprehension.

## Application boundary and verification direction

Extend the existing path end to end: submission and reference transport; structural
and qualified-support validation; immutable retention; subject resolution and Lens
applicability; context delivery/exposure; selection and fixed support resolution;
direct delivery and exact retrieval. Keep interpretation in core analysis and
keep client rendering dependent on delivered qualified content. Scope affected
human-output handling explicitly even though broad presentation work is deferred.

Fixtures can establish subject/reference integrity, full versus partial delivery,
atomic acceptance/rejection, conflicts, replacement selection and unchanged exact
answers. Use the real application/evidence/retention path with scripted investigator
communication. A seeded orientation can isolate follow-up design, but cannot prove
discovery. A seeded correction can prove delivery, not error detection.

A separate real investigation must start from an ordinary supported entry point,
produce a usable architectural subject, follow it, reuse the actual earlier content
and acquire supporting program evidence. Check semantic fidelity independently.
Natural correction discovery needs its own assessment and must not be claimed from
a staged success. Diagram sufficiency, architectural correctness and usefulness to
a human are distinct validation questions. Existing observation basis-export gaps
matter if new research records are used for state-specific assessment; live
application verification alone need not introduce a general observation redesign.

## First discussion questions

1. Is the first success criterion a small complete admission → trial → correction
   capability, with composition as a design probe, or must the first delivered
   capability also establish new claims across separately produced accounts?
2. Should a selected Half-open identify the state as described in a particular
   account, or an independently maintained subject shared by several accounts?
   Recommend account-scoped meaning first; shared identity adds correspondence
   and revision policy that matching labels cannot supply.
3. Should the initial working account be an explicit selection of qualified parts,
   or must PostCode choose and synthesize the most applicable account for a question?
   Recommend explicit selection first; synthesis remains an available qualified
   investigation, not an implicit consequence of selection.

Further decisions: exact boundaries of interpretation units; initial subject
discovery; request/perspective meanings; per-part support and qualifications;
content-delivery completeness/bounds; subject continuity under replacement;
representative diagram consumers and independent semantic checks.

## Half-open walkthrough: account-scoped subjects

Discussion on 2026-11-09 proceeds conditionally with admission → trial → correction
and composition as a design probe. The human requested clarification of scoped
subjects; the following records the initial proposal. The subsequent discussion
below revises the preferred separation of subject identity and description.

Interpret account-scoped as **introduced and grounded by an exact account**, not
confined to use inside it or defined by every claim that account makes. Let H1
designate the Half-open state category of the identified breaker policy at the
captured revision, introduced by ADMISSION-1. It is neither a particular runtime
state occurrence nor the recovery-trial execution. Its declaration has an owner,
meaning, architectural context and qualified support. Most behavioral conditions,
including the default single-trial scope of a particular explanation, belong to
claims rather than automatically becoming subject identity. The exact boundary
between defining context and claim scope remains to be specified.

1. ADMISSION-1 declares H1 and makes admission claims referring to it. The state-of
   relationship is a qualified claim, not something inferred from record nesting.
2. Selecting H1 for concurrent-caller investigation preserves that exact target,
   requested perspective and available navigation origin. Supply its declaration
   and supporting account context as interpretation; acquire program evidence
   separately. Origin does not establish reliance or truth. The fixture supplies
   complete ADMISSION-1 if the follow-up is to correct it.
3. TRIAL-1 explicitly reuses H1, adds claims about waiting and outcomes, and may
   introduce shared-instance and execution roles of its own. It is a separate
   result, not a new child appended to ADMISSION-1. New relationships and account
   associations require qualified attribution. An exact shared designation permits
   a consumer to align the selected subject without reconciling its claims.
4. When correcting only the admission omission, ADMISSION-2 can explicitly reuse
   H1. Its richer admission claims do not require a newly designated state. The
   reporting investigation establishes this treatment; a renderer does not infer
   it from matching labels. Retaining H1 does not preserve ADMISSION-1's erroneous
   claims as truth. The replacement's composition remains disjoint as required;
   sharing a subject reference is not sharing a composition child.
5. If the correction instead changes what the subject denotes (for example,
   Half-open actually conflated a breaker state with an executing trial), introduce
   H2, or several subjects for a split. Preserve H1, state what was mistaken, and
   record qualified correspondence where support permits. An account replacement
   alone does not supply an element-to-element mapping. No implicit retargeting or
   requirement for a one-to-one successor follows.

ANSWER-1 keeps its original selection and correction snapshot. A later working
answer can select ADMISSION-2 and TRIAL-1, both referring to H1. A fresh investigation
of H1 is distinct from exact retrieval of ANSWER-1: it retains the chosen referent
while receiving correction-aware context under a declared selection policy.
For the bounded example, explicitly supply the originating account and applicable
correction context; inclusion of other associated accounts is a separate selection,
not permission to supply all history. If H1 was replaced by H2, selecting H1 still
targets H1 and discloses the correction; following H2 is an explicit new selection.

Existing reconsideration remains conservatively account-based: an earlier result
exposed to ADMISSION-1 may need reconsideration even if it concerned only the
unchanged state designation. The generating evaluation's existing per-correction
exemptions apply; sharing H1 neither propagates nor clears reconsideration by itself.
Do not introduce element-level dependency tracking to suppress these warnings in
the first slice without a separate justification.

Composition can reuse H1 alongside a new breaker instance role in each wrapping
pattern, with qualified relationships between them. It cannot identify two instance
roles as the same runtime object merely because both concern the breaker kind.
An independently introduced Half-open designation is not automatically H1; its
correspondence needs analysis. This trades a global subject registry for explicit
provenance and occasional duplicate designations. The key open choice is whether
replacements may reuse unchanged scoped declarations (recommended) or must always
mint new declarations plus correspondence, which gives stricter version separation
but adds identity churn even for an ordinary correction of behavior.

## Emerging direction: subject identity with revisable descriptions

The human finds it useful to know H1 and H2 concern the same thing, suggesting a
Half-open identity whose definition through H1 can be superseded through H2.
Prefer this separation for further exploration: S is the subject identity; H1 and
H2 are immutable qualified descriptions of S. This changes the illustrative use of
H1/H2 above, where they denoted subject declarations. An introducing account keeps
its discovery provenance without permanently owning all later descriptions of S.

S has an exact reference distinct from the label “Half-open.” Its identity is
scoped and grounded in the investigated architecture; its descriptions, behavioral
claims, associations and qualifications remain attributable to their accounts.
It need not promise global identity, a complete model or persistence after Session
end. This fits the governing distinction between an Entity and claims about it;
the representation and method establishing this particular identity remain open.

In the bounded example, ADMISSION-1 describes S through H1; TRIAL-1 investigates S
with H1 as supplied context; ADMISSION-2 corrects that description through H2 while
explicitly retaining S. Selection of S can obtain applicable retained descriptions
and revision context. Exact H1 or ANSWER-1 access still preserves the original.
The request must retain which descriptive context was actually selected/supplied;
a stable subject alone does not identify an immutable answer or a reusable attempt.

No single mutable definition should silently settle conflicts. A working selection
may prefer H2 under explicit replacement rules while retaining H1 and alternatives.
If descriptions were introduced independently, their correspondence requires
qualified analysis before joint treatment as one subject. A conflated concept may
instead require splitting subjects; a correction need not preserve identity.
Shared subject identity supports alignment but does not establish agreement,
behavioral truth, or citation exposure. Reconsideration continues to follow actual
account exposure. Open next: how subjects are introduced/reused, how qualified
identity assertions can themselves be challenged, and how subject requests choose
and capture descriptive context without silently changing earlier requests.

## Candidate creation and update mechanism

The human proposes investigation output containing new subjects `{name, definition}`,
PostCode-assigned internal IDs, later context containing subjects and IDs, and
updates `{id, definition}` targeting identity rather than potentially reused names.
The human endorsed this direction and its creation/update refinements in discussion.
This is an emerging design agreement, not an adopted output schema or authorization
to implement; representation and account partition remain open.

- New declarations also need submission-local keys so relationships and claims in
  the same result can refer to them before PostCode assigns retained IDs. Validate
  local references and existing Session references, then atomically retain subjects,
  defining interpretation, other claims and corrections. Existing investigram
  local-ID allocation is a precedent, not current subject-creation support.
- Definitions are qualified interpretation with attributable scope, evidence and
  generating provenance, including qualified relationships to surrounding subjects.
  These may share enclosing account support where applicable; duplication on every
  field is unnecessary. Validation establishes structural acceptance, not truth.
- Later investigator context supplies exact subject IDs, relevant definitions and
  their exact account references, scope/qualification and correction context. Names
  aid recognition/lookup; IDs identify targets. The actual supplied content and
  completeness remain recorded. A bare ID does not establish corrective authority.
- An update adds a new immutable definition/account for the same subject. A
  replacement identifies both the subject ID and the exact earlier definition's
  owning account being corrected, with reason and support. Subject ID alone cannot
  identify which account is superseded when several descriptions exist. Current
  corrections replace whole investigrams; field-level definition patches are not
  already supported. Definition/account partition must preserve that contract or
  explicitly revise it. Reuse existing correction machinery rather than introduce
  a second independently evolving definition-history mechanism.
- New behavioral information can simply be another qualified account about the
  existing subject. It need not rewrite the identifying definition or supersede
  a complementary perspective. Distinguish addition from replacement explicitly.
- Fresh selection may prefer a replacement with conflict disclosure; earlier
  definitions, exact answers and supplied-context records remain fixed. A stable
  subject ID is insufficient as the sole reuse key for an investigation whose
  selected descriptive context changes; retain effective input selection.
- Duplicate names are valid. Unknown/foreign IDs or invalid local references reject
  the submission without partial retention. Independently introduced duplicates
  require qualified correspondence; no automatic name-based merge. If a correction
  changes the referent itself, creating/reconciling subjects is distinct from
  revising a definition of an unchanged subject.

Recommended initial distinction: a concise qualified identifying definition for
each subject, with richer admission/state/interaction accounts referring to it.
The definition is revisable, but need not absorb every newly learned fact.

## Information associated with a subject

The human asks whether subjects can have other associated items besides definitions.
Recommended direction: the subject is a stable referent for multiple qualified
items; a definition is one role among them. Half-open could have identifying
descriptions, state-of relationships, admission rules, transition accounts,
concurrent-caller interactions, and recorded limitations or unresolved questions.
These examples guide the bounded capability, not a universal category catalogue.

Keep substantive information in qualified accounts/claims and associate it explicitly
with subjects. An interaction can concern Half-open, a shared breaker role and
individual executions without duplicating the account under each subject. Association
roles explain relevance; they do not themselves assert state ownership, causality
or other program relationships. Those remain qualified content. Evidence supports
particular claims/accounts, rather than automatically corroborating everything
associated with a subject. Revision history concerns those accounts and is surfaced
through subject inspection without becoming a behavioral property of the subject.

Addition of a complementary account differs from correction of an identified
account; neither mutates subject identity. Working selection chooses exact qualified
items for a question without implying a single reconciled description. Reuse existing
explicit investigram associations as a foundation, extending subject kinds and
content as needed. Whether an item is a whole investigram or an addressable portion
remains open, especially because correction and complete-delivery rules currently
operate on whole investigrams.

## Item identity, labels and indexing

The human asks whether associated items use fixed keywords or investigator-chosen
semantic labels that later investigations reuse for updates. Recommended separation:
an exact retained item/account reference identifies the update target; a freely
chosen title explains its meaning; explicit subject associations support retrieval;
scope and qualifications distinguish applicability. A label is neither a unique key
nor a guarantee of equivalent content. Same titles can concern different cases;
equivalent questions can have different titles. Corrections may revise titles while
retaining an explicit link to the earlier account.

Begin with subject-to-account indexing and exact account lookup. A subject query can
offer IDs, informative titles, scope, revision context and attributable descriptions,
then permit retrieval of full qualified content. Substantive descriptive listings
count as exposure under existing citation rules; they do not establish complete
delivery for correction. A later investigator selects a candidate on meaning,
retrieves the required content and returns an explicit correction target or a new
associated item. Never infer replacement from equal or similar labels. Multiple
candidates, partial retrieval and omitted population remain explicit.

Agreement in discussion: use a small defined vocabulary for items PostCode needs
to handle specially, including for UI purposes, implemented so it can be extended
as PostCode grows. Investigations can also invent new topics; the vocabulary does
not bound what can be investigated or recorded. This is an exploratory design
agreement, not an adopted schema or implementation authorization.

Recognized roles/content forms have explicit contracts (for example identifying
definitions, or supported state/interaction content). Investigation-defined topics
have meaningful labels and use supported qualified content forms without requiring
a new registered category. A novel label does not itself install specialized UI
behavior or acquire a recognized contract. Both kinds retain exact IDs, subject
associations, scope, evidence, provenance and correction history; updates target
IDs, not labels. Content-form validation preserves declared structural meaning
without establishing behavioral truth. A title alone cannot supply diagram semantics.
Exact initial vocabulary and its extension mechanism remain to be designed.

For the first slice, prefer whole-investigram references for independently
correctable items where coherent, reusing current retention/correction identities.
Finer content addresses remain possible but do not by themselves authorize
sub-investigram replacement. Automated semantic retrieval or keyword normalization
is a later need to justify, not necessary for the small subject-associated set.

## Subjects referred to by an account's content

The human identifies a further output need: besides declaring new subjects, an
investigation should explicitly list existing subjects its main content refers to
(analogous to objects/referents in language). Prefer “subject references” or
“referents” as working terminology; “subject” remains the investigative role and
does not imply grammatical subject position or sole ownership of an account.

Recommended distinction: an account introduces subjects through declarations,
refers to existing subjects by exact ID, and revises earlier information through
explicit correction targets. Referring to a subject requires neither redeclaring
it nor updating its definition. New subjects use submission-local references until
atomic acceptance resolves them; references in main content can identify both
newly declared and earlier subjects. Attach reference scope to the content it
actually concerns, rather than assuming every descendant discusses every subject
mentioned in the result's root.

For TRIAL-1, Half-open and an already known shared breaker role can be existing
referents, while a waiting execution role may be introduced locally. The main
interaction account connects them through qualified claims. A reference inventory
allows navigation and reverse lookup of referring accounts, but does not supply
the interaction relationships or their semantics by itself. Structured claims can
use those references as endpoints/participants. Prose can retain an explicit
referent inventory without requiring token-level annotation initially.

Keep “refers to this subject” distinct from the existing qualified association
“describes this subject,” and both distinct from the selected input subject and
evidential support. An index may expose either role explicitly; it must not silently
promote every mention into a descriptive association. Output reference lists also
do not establish which prior account content was supplied to the investigation;
citation exposure continues to come from actual context delivery.

Existing `Referent.subjects` already offers a reference-list precedent alongside
separate qualified associations. Extend/reconcile these responsibilities rather
than introduce duplicate fields with unclear ownership. Exact naming, role
classification and integration with the new subject declarations remain open.

## Retained architectural model

The human identifies the collection of subject identities as a core aspect of the
retained architectural model. Carry this forward as a design premise: these are
retained architectural referents across investigations, not merely navigation IDs
attached to individual answers.

The emerging model comprises those subjects together with qualified definitions,
accounts and relationship claims referring to them, their supporting bases and
provenance, and their correction/conflict history. Working selections and exact
answers identify particular uses of that retained material. This describes logical
responsibilities, not a decision for a new graph database, single store or universal
schema. Existing mechanical subjects and qualified information remain relevant;
the model is not necessarily composed exclusively of interpretation.

Shared subject identity permits accounts to accumulate around a continuing
referent without making their claims mutually consistent or authoritative. The
model can be partial and contested. This is compatible with the foundation's
allowance for accumulated understanding without requiring a single consolidated
authoritative architecture model. It does not promise cross-Session persistence
or identity across changed program states.

Subject introduction, qualified reuse/correspondence, and later correction of
mistaken identity therefore deserve explicit core treatment. Interface indexing
and layout consume that model; they do not establish its architectural claims.

## Relationships as content and investigative subjects

The human asks whether relationships are account items, subjects themselves, or
both. Governing concepts already distinguish a relationship from a qualified claim
asserting it, and allow a relationship to play the role of investigative subject.
Recommended design: relationships are expressed through structured qualified
claims in accounts, and can be explicitly selected for further investigation.
These roles need not require duplicate substantive content or a new entity kind.

A relationship item identifies its meaning, participant references and their roles,
relevant conditions/scope, and attributable evidence/provenance/qualification.
For example: Half-open is a state of the breaker policy kind; or a waiting execution
waits for a recovery decision of a shared breaker role during an occupied trial.
Do not force every relationship into two unlabelled endpoints. An interaction or
transition may need several participants, meaningful order, triggers and effects.
The small supported content vocabulary defines semantics consumers rely on;
novel relationship topics can remain qualified explanatory content until a suitable
structured contract is defined. Arbitrary edge labels alone do not grant that
contract or establish diagram semantics.

The human asks whether giving relationships subject identities from introduction
would be simpler. Revised recommendation: give each explicitly modeled architectural
relationship a subject identity R from the outset, distinct from immutable accounts
C1/C2 describing or challenging it. Use the same declaration, reference and retention
mechanisms as other subjects, while preserving the distinction between relationship
and entity. This removes a later promotion step and the need for navigation to
switch between claim-only and relationship-subject targets. Exact claims/accounts
remain selectable for their own historical content. This is a recommendation under
discussion, not an adopted decision. The item/account partition and correction target
still obey whole-investigram replacement unless separately revised.

For example, R can designate the waiting relationship between an execution role
and the breaker's recovery decision; C1 describes its circumstances and C2 corrects
its release/admission conditions. The relationship subject retains an attributable
introduction identifying what is being discussed. Participant roles, direction,
conditions and other architectural assertions remain qualified account content;
do not create an unqualified mutable edge alongside the accounts. Diagrams use
selected qualified descriptions, not identity records alone.

Tradeoffs of identities from the outset:

- More declared subjects and references, and discovery must distinguish entities,
  relationships and the accounts about them. Use local references within a result
  and atomic validation/allocation to introduce connected subjects together.
- Defining when a revised description still concerns R remains necessary. Additional
  conditions may refine the same relation; a new endpoint, changed relation meaning
  or split may identify something different. Qualified analysis must express the
  chosen continuity rather than an automatic rule based solely on field differences.
- Independent investigations may introduce duplicate relationships. Equal endpoint
  IDs and labels do not automatically merge them; correspondence stays qualified.
  Explicitly reusing an existing R avoids duplicate creation when it is supplied.
- A rejected or disputed relation remains a retained referent with contrary accounts;
  its identity must not imply that the relation is established or currently operative.

No important semantic capability is lost; the principal cost is earlier identity
and reference bookkeeping. The scope is explicitly modeled architectural
relationships, not every incidental prose connection, account association or
provenance link. This chooses no universal graph schema, durable cross-Session
identity or automatic equivalence method. The original claim-first recommendation
saved some identities but introduced a lifecycle distinction that now appears less
valuable than a uniform subject mechanism.

Correction of C1 to C2 can retain R when they concern the same connection with a
better description. A discovered different connection, split or mistaken identity
requires explicit new referents/correspondence rather than retargeting R. A denial
or unresolved conflict can remain an account about R; retaining its identity does
not assert that the alleged connection exists. Shared endpoints or relation labels
alone do not establish sameness across accounts or configurations.

For diagrams, an edge is a depiction of selected qualified relationship claims,
with access to their support and unresolved alternatives. Following it can target
the exact claim or an explicitly exposed shared relationship subject. Deduplicating
labels/endpoints or selecting a primary correction cannot silently reconcile
conflicts. Keep architectural relationship claims distinct from account-subject
associations, composition, citations, correction links and navigation lineage.

## Flexible introduction: shared subjects, local targets and prose

The human first proposed lazy subject creation on exploration, then a fluid model
allowing three routes together. Carry this forward for design rather than forcing
one creation policy for all content:

- An investigation explicitly declares subjects for central findings or other
  useful shared referents. Importance is the investigation's judgment, not a
  prerequisite that every subject must satisfy.
- It can give other content account-local identifiers for possible later promotion.
  An exact account ID plus local key identifies the target; the displayed name is
  not required to be unique. A repeated promotion resolves to the same bound subject.
- It can leave content as ordinary prose. If the human follows “Half Open,” retain
  a subject with an initial contextual definition: “Half Open as used in account A.”
  Later investigation can supply a more precise superseding definition.

The third route refines the earlier analysis: allocating a subject for an explicit
contextual designation need not first extract or establish its architectural meaning.
The initial definition preserves a focus, not an assertion that a particular state,
runtime object or relationship has been identified correctly. Retain exact account
identity, the selected wording and occurrence/context where available, plus origin
in the human's selection and the source account's qualifications. Do not invent
semantic certainty from that act of selection. Investigation is required when
establishing a stronger definition, resolving ambiguous meaning or making new claims.

All routes converge on the same subject mechanism, with attributable immutable
definitions/accounts and precise IDs. For example, S42 initially has D0 (“Half Open
as used in ADMISSION-1”); a subsequent interpretation supplies D1 describing the
breaker recovery state. S42 can continue while D1 explicitly supersedes D0. D0 is
not retroactively enriched, and clarification need not imply its contextual wording
was false. Exact revision/correction terminology and account partition remain open.

Repeated prose names can have ambiguous meanings. Capture a selected occurrence
when possible, or preserve the unresolved designation rather than silently choosing
a meaning. If further investigation discovers conflation or several referents,
describe that result and introduce separate subjects as needed. Equal names in
different accounts never automatically establish identity. Type-specific Lens
applicability cannot be inferred from an unresolved contextual definition.

Promotion retains a new mapping/qualified association to the exact originating
account/local target or prose selection; it does not rewrite the account's referent
list or an earlier answer. Fresh inspection can select the later association.
This needs an explicit application operation and retained link representation;
the current presentation binding port does not authorize subject creation. Following
an old account preserves that origin and supplies applicable correction context,
rather than silently targeting a replacement account.

Benefits: no obligation to anticipate every useful subject or formalize all prose;
the model can grow around actual investigation. Costs: several designation routes,
local-to-shared mappings, initially underdetermined subjects and qualified refinement/
correspondence rules. Only promoted subjects appear in the shared-subject index.
Diagrams still require explicit relationship/participant semantics in selected
accounts; contextual subjects alone do not supply those meanings. Probe all three
routes with Half-open and a relationship before settling the implementation shape.

## Subject classification, existing subjects and identity reconciliation

The human asks about subject types, integration with implemented Lens subjects, and
merge/split. The following are recommendations for discussion, not agreements yet.

**Classification.** Expose what kind of thing a subject is understood to be, using
recognized extensible terms plus intelligible descriptions, permitting unknown,
multiple or disputed classifications. Keep architectural classification qualified
and revisable: contextual “Half Open as used in A” can initially be unclassified,
then receive a supported state classification. Classification can be a recognized
item/facet in the retained account, with a convenient selected summary in delivery;
it need not be an unqualified mutable field defining identity. Distinguish semantic
classification from representation/record kind and from origin/method. Neither a
label nor an investigator's assertion that something is a module grants compiler
module capabilities. Lens applicability uses supported targets/content and their
qualification; missing classification can motivate bounded prerequisite work.

**Existing subjects.** Current Lens declarations accept configured-project,
repository, module, group and investigram; precise retained-reference resolution
supports module/group/investigram. Symbols and dependency/containment claims exist
as retained support but are not generally public Lens subjects. Project/repository
designations have contextual resolution semantics, not the same record shape as
modules. `ModuleRecord` and `GroupRecord` already separate identity from qualified
naming/classification information through their claims.

The initial suggestion was a common application-level access contract over existing
and new representations. The human asks whether mechanical analyses and
interpretation should instead use the same subject-creation and qualified-item
mechanism throughout. Revised recommendation: yes, design one shared domain
mechanism, with both kinds of producer contributing subjects and qualified items;
do not retain a permanent legacy-subject exception behind a common lookup facade.
Migration scope and implementation representation remain to be planned.

Preserve reference meaning, lifetime, captures and mechanical guarantees; avoid a
duplicate architectural identity for an existing module. Investigations can refer
to that same module subject and contribute further qualified accounts. A policy kind
implemented by a module may instead be a distinct subject connected by a qualified
implementation mapping. Investigram-as-subject remains distinct from the architecture
it describes. A common mechanism permits specific content contracts and does not
make every Lens applicable to every subject. General exposure of all currently
retained symbols/relationships need not be added to the first slice.

Terminology clarification: architectural subject is the umbrella, including modules,
symbols and other implementation-level referents. Do not introduce disjoint
“architectural subject” and “implementation subject” categories. “New architectural
subjects” above means additional referents introduced through interpretation or
contextual selection, not exclusion of existing mechanically discovered subjects.
What something is, how it was identified, and what evidence supports claims about
it are separate dimensions. An interpreted policy kind can concern implemented
architecture just as a compiler-discovered module does. Different descriptions or
methods do not by themselves require different identities; a module's conceptual
responsibility and source-level naming can both describe the same module. A policy
kind and a module implementing it may instead be distinct referents connected by
a qualified implementation relationship. Hypothetical/intended/implemented modality
is another distinction and must not be inferred from record kind or discovery method.

**Merge.** Prefer non-destructive identity reconciliation: retain a qualified claim
that S1 and S2 designate the same referent within a stated scope, with evidence,
provenance and exact descriptive context. Preserve both IDs and originating
accounts. A new selection may coordinate information via that claim and disclose
the contributing identities and unresolved conflicts; no pointer retargeting,
automatic endpoint rewrite, name-based union or unqualified transitive closure.
More cautious correspondence such as possible equivalence or implementation mapping
must remain distinguishable from same-referent claims. The correspondence account
can itself later be challenged/corrected. A preferred display reference, if useful,
is selection policy rather than identity erasure.

**Split.** Preserve S0 and record a qualified account identifying its conflation,
introducing or referencing S1/S2 for the distinguished referents. Retain the old
definitions, citations and exact answers. Moving a former behavioral claim onto
one successor requires analysis; do not copy all S0 accounts or incident edges onto
both successors. New navigation can offer the alternatives with the distinction
explained, while an exact request about S0 still targets that historical/conflated
subject with current context as declared. A broader subject legitimately containing
two parts is decomposition, not evidence of mistaken identity.

For the first scope, recommend recording/exposing explicit qualified same-referent
and conflation/successor accounts, with navigation to precise targets. Defer automatic
identity reconciliation, automatic pooling of all related accounts and wholesale
graph rewriting. Include deterministic cases for an initially unknown classification,
existing module references, duplicate names, a proposed correspondence and a state/
execution conflation. These establish reference/qualification behavior, not reliable
automatic discovery of equivalence or conflation.

## Common subject and qualified-item mechanism across producers

Following the human's question, prefer a shared domain contract for declaring or
reusing subjects, retaining qualified items associated with them, validating
references/support, indexing and selecting content, and preserving exact earlier
answers. Mechanical analyses, interpretations and contextual selections use this
mechanism with their actual provenance. They need not share an identical execution
protocol, submission payload or identity-discovery algorithm.

Mechanical producer identity keys must preserve established same-Session reuse and
determinism under their method/capture rules. An interpretive producer can use the
local-declaration and existing-ID mechanisms already discussed. Central allocation
must not manufacture a new module on every evaluation or infer identity from names.
Existing module/group records already separate identity, descriptive claims and
qualification, making them useful migration examples rather than alien exceptions.

“Qualified item” is neutral vocabulary: mechanical claims remain mechanical,
recorded assertions remain assertions, and investigrams remain interpretation.
Use typed content and support contracts where needed. An interpretation referencing
a compiler-discovered subject does not inherit its mechanical guarantee. Lens
applicability depends on attributable classification and required analysis support,
not merely a free-form type label or which producer first created the subject.

For example, a module analysis supplies subject M and naming/classification/export
items; an investigation uses M in a responsibility account and introduces Half-open
S plus a qualified implementation relationship. Subsequent mechanical and
interpretive results can refer to M through the same mechanism. The model retains
each item's actual evidence and guarantee.

Shared retention does not imply one universal revision algorithm: an interpreted
challenge to a mechanical claim is qualified contrary information, not automatic
replacement of that analysis result. Reanalysis and new basis/method results remain
explicit; current interpretation correction contracts still apply to investigrams.
The eventual plan should exercise at least one mechanical producer and a subsequent
interpretation through the shared mechanism, including exact retrieval. Broader
migration scope is an explicit planning choice, not implementation authorization.

## Knowledge-representation precedents (exploratory, 2026-11-10)

The human asks whether this design repeats older knowledge-representation work and
its failures, clarifying that building on existing designs/theories matters more
than choosing libraries. Assessment: the connection is real and useful; stable
referents, qualified descriptions, relationships as referents, and revision/support
tracking should not be treated as novel inventions. Bounded application alone is
not sufficient protection against expensive formalization or brittle assumptions.

Relevant precedents and proposed lessons:

- [Minsky's frames](https://dspace.mit.edu/entities/publication/0eca0164-cb5f-42de-8c86-43f54b23306d)
  organize structured descriptions and expectations. Borrow structured descriptions,
  but do not turn a subject into one mutable authoritative bundle or silently fill
  missing architectural information from defaults.
- [Doyle's truth-maintenance system](https://dspace.mit.edu/entities/publication/5377b306-4ecc-4687-b1f5-78cbb4a0543a)
  and [de Kleer's assumption-based TMS](https://www.dekleer.org/Publications/An%20Assumption-Based%20TMS.pdf)
  distinguish conclusions, justifications and assumptions, including alternative
  contexts. These inform support and reconsideration, but PostCode's exposure links
  are not logical entailment dependencies. Seeing corrected material does not prove
  an account false. Preserve competing accounts without requiring a globally
  consistent belief set or implementing an inference engine.
- [Wikibase's data model](https://www.mediawiki.org/wiki/Wikibase/DataModel/Primer)
  separates entities from statements with qualifiers, references and ranks.
  Borrow the entity/qualified-statement distinction. Its ranks do not substitute
  for PostCode's separate revision status, question applicability and working
  selection, or its qualification guarantees.
- [Nanopublications](https://nanopub.net/docs/guidelines/) separate assertion,
  assertion provenance and publication information;
  [W3C PROV](https://www.w3.org/TR/prov-overview/) provides provenance concepts.
  These inform account boundaries and attribution. Provenance alone does not
  establish truth, sufficiency of evidence, or permission to synthesize new claims.
- [Shipman and Marshall's Formality Considered Harmful](https://people.engr.tamu.edu/shipman/viki/papers/tochi/tochi.html)
  documents cognitive overhead, premature structure and situational differences.
  Incremental formalization closely matches prose → local designation → shared
  subject, while permitting explicit shared subjects initially where useful.
  Promotion must retain original context; formalizing an interpretation does not
  increase its evidential strength.

Historical qualification: these approaches were not uniformly unsuccessful.
McDermott's [R1 report](https://www.sciencedirect.com/science/article/pii/0004370282900212)
describes regular operational use for configuring DEC computers. That does not
establish general applicability or make knowledge acquisition/maintenance cheap.

Recommendation for further design, not an adopted decision: describe PostCode as
incrementally formalized architectural accounts with explicit provenance and
reason-maintenance concerns. Use the admission/trial/correction example to test
which semantics must be explicit for follow-up and diagrams. Retain informal
material and unknowns; distinguish missing information from negative assertions;
do not infer equivalence from labels or truth from structured form. Require a
concrete retrieval, investigation or diagram benefit for added machinery. A shared
subject/item mechanism need not impose a universal content ontology or uniform
revision rule. No library/storage choice or implementation is authorized by this
comparison.

## Review assessment: unresolved contracts (2026-11-10)

The human supplied Claude's review of the working proposal. Rechecked relevant
governing definitions, investigation acceptance/execution/context, and selection
records. The review supports the direction but identifies omissions that must be
resolved before a planning package. The following is this agent's assessment, not
human adoption of the review's recommendations or a revised implementation scope.

**Terminology and identity.** Accept the ambiguity: governing Subject is an
investigative role, not an entity kind. Prefer working terminology “retained subject
reference” or “referent identity” for the common mechanism; preserve the distinctions
between entities, relationships and investigrams. Do not broaden Entity merely to
obtain uniform reference handling. Identity introduction for an interpreted subject
of implemented architecture needs an explicit contract and governing-impact review.
Existing documents allow implemented subjects and analysis identity guarantees;
they do not supply the proposed Half-open allocation/continuity rules. This is an
underspecified case, not evidence that interpreted implemented subjects are forbidden.

**Account addresses.** The proposal conflates an explanatory account spanning units
with an exactly addressable investigram. Recommend binding local designations and
correction targets to exact investigrams, using (investigram ID, local key). Submission
keys are a separate namespace resolved at acceptance. A selection Projection can
identify a multi-investigram selected answer without inventing a mutable account
aggregate. The wording needs this distinction before concrete output schemas.

**Partition.** Independently correctable subordinate investigrams are a valid middle
option. H1 can be a definition child rather than embedded in the admission root's
own content. If embedded, replacement restates it even when its meaning is unchanged.
If separate, child correction requires its own complete content rather than the full
subtree. Root replacement does not automatically transplant an old or corrected
child into the new composition. Work through root/child selections before preferring
this layout; do not assume it solves all continuity issues.

**Requests, origin and selection.** Recommend a request identifying S, a declared
information need and an explicit selected-context set, distinguishing all three from
navigation lineage. Ordinary account follow-up remains a different request option.
The review overstates its completeness guarantee: current follow-up calls bounded
`exposure.prepare`, which can omit parts. Both paths need verified delivery before
correction eligibility. Prefer extending immutable investigation-selection Projections
for retained selected answers; a mutable UI choice is separate and not required
for this first API capability. Exact Lens/parameter and selection contracts remain open.

**Confirmed implementation constraints.** `correctedSubjects` admits only module,
symbol, group and repository-artifact and produces corrected-subject associations;
`originatingModule` is required; request parameters are empty and nonempty parameters
are rejected; `ContextPart` and completeness currently cover prose, referent and
qualifications. These need explicit treatment. A distinct declared Lens/operation
could encode a fixed concurrent-caller question, so nonempty parameters are not the
only solution. Meaningful parameters, if used, must enter effective-input identity.
Architectural context must come from captured inputs and attributable lineage, not
silently turn an interpreted implementation mapping into a mechanical identity fact.
Structured completeness is a prerequisite to corrections, not deferred validation.

**Diagrams and contextual roles.** Shared relationship references or qualified
correspondence can support cross-account alignment; endpoint/label matching cannot.
The review's duplicate-or-merge choice is too narrow: supported correspondence,
separate contextual depictions, and disclosed unresolved alignment are alternatives.
For each representative combined diagram, identify the actual alignments it needs.
Distinguish the Half-open state category from its application to a breaker role
within a pattern. An explicit tuple/reference to state, role and pattern may suffice;
whether independently investigated applications need their own identity remains open.
No new universal contextual-identity primitive is established by this assessment.

**Additional obligations.** Specify repeated prose-selection behavior (exact account
plus a stable occurrence selector is a candidate, not a chosen hash formula), and
represent the contextual designation as an attributed selection record, not fabricated
interpretation. Local keys do not inherit identity across replacement investigrams;
explicit mappings/reused shared IDs are needed. A conflation claim alone triggers no
existing correction propagation; record that limit or explicitly correct the affected
identifying account. Rich index titles/summaries can widen exposure and reconsideration;
do not evade the rule by relabeling substantive text metadata. Interpretive Lens
offers need declared applicability to qualified/unknown subjects as well as evidence
requirements. The common producer contract includes retention of qualified information,
not just IDs/indexes, while mechanical information can still be produced on demand.
Independent discoveries can duplicate existing mechanical referents; common allocation
does not establish semantic deduplication.

**Scope recommendation for discussion.** Keep explicit introduction/reuse and one
real subject follow-up/correction as the delivered path. Probe local/prose promotion,
merge/split and composition at the design/fixture level initially. Preserve them in
the model without promising all operations in the first capability. This is a proposed
reduction from the proposal's validation breadth, not an agreed change. Resolve the
reference/address model, request/context contract and one concrete root/child correction
example first; then revise the proposal and select the implementation boundary.


## Re-review: identifying support and association roles (2026-11-10)

Claude's re-review finds the revised walkthrough coherent and identifies further
contracts. These are recommendations for discussion, not adopted decisions.

- **Answer support.** Prefer supplied/navigable identifying support without making
  every definition a selected constituent. Substantive subject references need
  intelligible qualified identifying content or an explicit unresolved designation,
  with exact inspectable support. Choose and fix that support at answer construction;
  rendering cannot fetch a newer definition and silently change an exact answer.
  Ambiguity/conflicts remain explicit. This need not recursively include every
  definition referenced by another definition. Selection/completeness rules remain
  open. Working assembly should organize content, not repair unintelligible answers.
- **Identification role.** Put “identifies S” on the qualified account–subject
  association. A whole-account identifying-description kind plus describes-P does
  not establish that it identifies P. Keep content form separate from association
  role; a behavioral account can identify one subject and describe another. The
  initial role vocabulary remains proposed, and identification does not confer truth.
- **W's identity.** Prefer the waiting relationship between the specified caller
  role and R's recovery decision in the named usage pattern. Keep configuration,
  occurrence and conditions in qualified claims. An identity does not assert that
  waiting occurs. Correct behavioral conditions in the behavior account; also
  correct identifying content if its participants or characterization were mistaken.
  This does not imply every relationship correction must preserve identity.
- **Assembly question/modes.** Candidate inspection Lens over an exact collection:
  “inspect these accounts with revision context.” Recommend exact-members mode for
  explicit assembly: keep requested DEFINITIONS-1 even if DEFINITIONS-2 exists,
  disclosing current revision context in the new answer. An explicit prefer-replacements
  mode follows correction chains and exposes original-to-selected mappings/conflicts.
  Exact retrieval of either answer preserves its captured selection/support; fresh
  assembly can capture a newer snapshot. These modes are proposed, not implemented.
- **Origin-free discovery.** Existing association listing cannot find ADMISSION-1
  from S merely because it refers to S. This needs an investigator-visible refers-to
  query or an explicit context policy using that index. Bare IDs are not substantive
  exposure; supplied titles/descriptions can be, and content retrieval is. The
  caller-selected example does not demonstrate origin-free correction.
- **Correction reporter.** Reason/qualification reported by TRIAL-1 is its own
  substantive content. Correcting it preserves the original reporter and correction;
  it does not itself withdraw or rewrite that correction edge. Any changed standing
  requires explicit semantics. Thin roots remain qualified investigrams, not an
  implicitly supported unqualified children-only result type.

Human presentation alone does not add investigator citations. If an investigator
later receives the identifying support, substantive delivery counts even when called
support rather than a selected constituent. Preserve that distinction in the proposed
answer-support contract. Settle that contract and per-subject identification first.

## Complete-example review follow-up (2026-11-11)

The [concrete results](structured-account-example/README.md) and proposal now distinguish
citing-side evaluation-wide exposure from cited-side investigram boundaries. The
recommendation favors identifying children where useful as independent later context;
the mixed payload remains a concrete comparison, not the recommended default.

Fresh support uses replacement descriptions; originals remain labelled historical/input
context. Rejected the proposed use of `affectedSubjects` as an item-survival exemption:
whole-account replacement cannot silently become selective validity tracking. K remains
separate metadata with substantive explanation attributed to its reporter for citation,
preserving the existing rule rather than introducing independent relationship citations.

The interaction now supplies completion, outcome availability, classification and
explicit causal step references. No new event kind was necessary. R remains a qualified
scenario role; generalizing its model to arbitrary instances of P needs interpretation.
The questionable free-slot case was removed from the bounded admission table, reentrant
entry calls explicitly excluded, and the stale-trial guard made precise. Structural
checks do not certify cross-form semantics. Declaration/key scopes, pool ownership,
qualified excerpts and request-time versus acquired context are now explicit.

Further consolidation of the long proposal is still useful before a planning package;
this pass adds a current-position table and fixes the relevant sections inline rather
than treating that editorial work as adoption. No implementation or governing material
was changed.

## Remaining repairs before the children variant (2026-11-11)

The re-review's claimed scope mismatch was withdrawn: both admission payloads already
exclude reentrant entry calls. K's reason stays unchanged; scope-change disclosure is
recorded as a general contract consideration, not a defect in this example.

ADMISSION-2 now expresses general admission with form-local execution/instance roles.
Its R/E-caller/W references belong to a separately qualified scenario illustration,
whose bindings do not restrict the general claim. Causal links now continue from
outcome transition through resume/recheck to ordinary work or refusal; they assert
causal contribution under the stated conditions, not unconditional sufficiency.
Classification wording and the residual ambiguous reconsideration sentence are fixed.

The actionable partition recommendation uses explicit shared-subject introduction as
the reuse signal: when mixed with behavior, put identifying descriptions in one or
more children by default. Identification-only roots need no wrapper; local terms may
stay embedded. The human explicitly requested these repairs before the children
variant. This pass does not introduce that variant or validate its ownership/support
contracts; the mixed payload remains a comparison.

## Shared roles and the paired children variant (2026-11-11)

The human authorized the shared-role/addressing prerequisite and then the children
variant. Both are now represented in [complete paired payloads](structured-account-example/children/README.md).
Local roles, scope and qualified illustrations use a common structured-item envelope;
the admission and state items exercise it without generalizing the scenario model.
Wait initiation now cites both request and trial entry, conditioned on continuing
occupancy. A local relationship occurrence can be designated through its exact item
without already having a shared general subject identity.

Exact account/content-key addressing fixes illustration targets. A conditional access
probe reports a later replacement of the illustrated account, without judging that
item, retargeting it by matching keys, mutating exact answers or adding reconsideration
propagation. This surfaces an explicit same-result reference while preserving the
existing distinction between content links and prior-exposure citations.

The initial result owns DEFINITIONS-1 and ADMISSION-1 as separate children. The
follow-up owns ROLE-DEFINITIONS-1 and TRIAL-1; behavioral child TRIAL-1 reports K with
a disjoint ADMISSION-2 replacement. Each child carries its own qualifications and
identifying associations where applicable. ADMISSION-2 copies no state descriptions:
unchanged DEFINITIONS-1 supplies support. Stored composition remains immutable while
fresh selected content discloses the behavioral displacement. The mixed variant
remains available as a comparison in a separate hypothetical Session.

A repeatable fixture checker covers ownership/reachability, declaration and local-role
resolution, qualified illustration addresses, child support and causal ordering, with
malformed-copy probes. Behavioral diagram data is equal across partitions. This is
authored design validation, not implemented acceptance or an end-to-end investigation.
Broader applicability, general relationship identity, composition, and reassessment
remain open; no governing material or product behavior was changed.

## Applicable qualification and orientation repair (2026-11-11)

The children review exposed a mistaken implementation of self-contained qualification
as copying all behavioral limitations. DEFINITIONS-1's descriptions were rechecked
against the pinned state vocabulary and narrowed to identification, with basis/method
limits but no default-sampling restriction on the categories. ROLE-DEFINITIONS-1 keeps
the single-slot scenario context needed to distinguish its subjects, without blanket
behavioral exclusions. Reusing S does not generalize the default-scoped admission or
trial behavior. Qualification selection is interpretive judgment, not a keyword filter.

TRIAL-RESULT-1 now supplies orientation and locates the children, without restating
waiting or release rules. Summaries remain permitted but create another correction
surface; a child correction does not update a root summary. Roots need useful qualified
content, not mandatory behavioral synthesis.

The scenario state bearer again references R directly in both variants. Its local
alias and supposed illustration merely renamed the same participant; common role
syntax was no reason to force that indirection. Illustration retains the distinct
general-to-example meaning demonstrated by admission. A second binding mechanism is
not introduced. W's minimal description identifies participants and what is awaited,
states that it does not specify occurrence/release conditions, and provides an exact
related-content link. That link locates further explanation without delivering or
citing the behavioral account. Independent identification need not be behaviorally
complete. Structural checks cannot certify that the selected qualifications suffice.

## 2026-11-11 — First composition probe

The [authored composition continuation](structured-account-example/composition/README.md)
compares two bounded waiting points using the children variant and a separately
qualified bulkhead account. Reuse policy kinds and Half-open; introduce the two
ordered patterns; leave scenario participants and waiting relations locally
designated for now. This recommendation is exploratory, not an adopted decision.

Order alone is insufficient: the bulkhead-outside case needs a second execution slot;
the breaker-outside case explicitly shares an occupied bulkhead with independent work.
The payload captures resource occupancy and state at a stated trace point rather
than asking rendering to infer them. It is a finite prefix, not a full trace or a
comparison under identical workloads. Contributions from earlier accounts remain
qualified interpretations, while wrapper source supplies new composition evidence.

Open: whether situation snapshots belong inside interactions or in a separate form;
how a later investigator selects/promotes one exact local role or relation; and when
a general relationship warrants shared identity. Keeping one role scope here avoids
cross-form correspondence, so that case remains untested. All composition children
still share dialogue exposure; partition does not narrow reconsideration from prior
component corrections. No new correction, reassessment mechanism or product API is
introduced. The first implementation scope remains undecided with respect to live
composition generation.

## 2026-11-11 — Composition review refinements

The origin-free composition request now supplies current ADMISSION-2 and qualified
K history without the superseded ADMISSION-1 content. The target remains requestable;
K's substantive explanation cites its reporter, not its endpoint references. No
complete-context exemption is claimed. The seven remaining citations still expose
the ordering-definition child to later component corrections. That cause can also
reach later definition consumers; partition is not transitive isolation. Record this
as a planning risk needing explicit acceptance or prioritization of a bounded
reassessment probe, without changing the governing exposure rule or authorizing it.
Per-output exposure would require separate design agreement, not agent-declared
support lists standing in for actual deliveries.

The probe defines and checks a discriminated nested-selector grammar for relations
and situated state assignments. A state selection must match an actual bearer/category
pair in the named situation, and ambiguous assignments fail. No live follow-up is
claimed. Transition assertions remain action prose and after-state snapshots; a
future transition-level consumer needs new qualified general or scenario-local state
content. P/B input is explicitly an unordered pair for examining both orderings;
C-BB/C-BH become single-subject follow-up entry points. These findings refine the open
Lens-offer and content-form questions without adopting a wider universal contract.

## 2026-11-11 — Clearer overviews and separate legends

The human finds the statechart boxes and sequence annotations too dense. The
[readability pass](structured-account-example/diagrams.md) uses meaningful concise
labels, mechanically assigned display references and separate legends for detailed
meaning. Authored `displayLabel`/`overviewScope` fields remain associated with full
qualified content; rendering must not invent semantic abbreviations. Keep scope
visible, conditional edges recognizably conditional, and preserve exact legend/source
mapping and evidence. Mixed and children variants retain separate legends even when
their images match. This is an example-level contract refinement and presentation
probe, not a new GUI or a reason to discard the full accounts.

## 2026-11-11 — Available investigations and recognized concepts

Agreed exploratory direction: selectable “find out more” offers can be returned by
investigations or discovered through a generic investigation-discovery request.
Their question is atemporal; optional “recommended next” annotations need an inquiry
context. Concern labels and blurbs help explain relevance without prescribing a
journey. Retain the proposing account and qualified applicability. A selectable offer
may carry agent-facing prose; the human need not author a prose question. Generating
an offer does not create an executable capability. The offer schema and supported
application interaction still need design.

A subject can carry multiple qualified concept associations. A recognized catalogue
provides stable meanings; custom concepts remain possible, with definitions rather
than label-based equivalence. Such classifications can supply compact reusable context
but remain account content with support, scope and exposure. Catalogue breadth is
independent of specialized behavior. The human explicitly defers icons, automatic
concept-specific operations and other special treatments as future features enabled
by this structure. No comprehensive ontology, concept hierarchy inference or adoption
of these mechanisms into the first implementation is implied.

## 2026-11-11 — Global entry and contextual Explain

Retain Overview and Explain as distinct broadly available investigation purposes:
Overview orients; Explain clarifies the subject, especially something selected within
an existing explanation. Contextual (“impromptu”) subjects retain their selected
occurrence and “as used here” meaning rather than acquiring unqualified identity.
Existing structural queries such as module listings also yield subjects for either
operation, preserving mechanical guarantees. Find available investigations and
Follow-up investigation complete the proposed global starting set; applicability
and parameters remain to be specified. This provides entry before any offers exist
without turning every architectural question into a global menu entry. No fixture
has yet been converted into a complete global-entry → returned-offer → invocation
chain. The human clarifies that this is illustrative surrounding application usage,
not additional design or delivery scope for structured architectural accounts. The
audit identifies assumptions to make explicit in examples; it does not require
settling the global investigation set or implementing a complete offer-discovery
journey. Keep the implications for account content, references, qualification,
contextual designation and provenance within the current remit.

## 2026-11-11 — Bounded returned-offer invocation example

Both admission fixtures now return a qualified offer on ADMISSION-1. The existing
follow-up invokes that exact account/key through a stipulated Follow-up investigation
Lens; Half-open S is the offer's architectural focus, not its invocation subject.
The prose information need is documentary. Existing complete context delivery keeps
correction eligibility and citation exposure unchanged. ADMISSION-2 repeats the offer,
but old references remain on ADMISSION-1; access probes distinguish captured answers,
partial offer disclosure and full correction context. This exercises account content,
resolution and provenance without designing global discovery or changing the broader
application remit. No live protocol acceptance is claimed.

## 2026-11-11 — Tightening the account-design remit

The human authorizes tightening the proposal after a scope audit. Keep qualified
account content, subject/reference compatibility, exact access, actual context
delivery and retained-offer provenance in scope. Global entry operations, offer
availability/discovery, general context ranking/budgets and investigation reuse
policy are surrounding application choices; examples may stipulate them without
making their design prerequisites. Compatibility with an existing mechanical subject
does not require migrating its producer or sharing internal storage. Qualified
correspondence/conflation remain representable, while reconciliation operations are
outside the bounded capability. The proposal's inline open questions and closing
checklist now apply these distinctions. This does not adopt a payload, authorize
implementation or settle the remaining first-delivery choices.

## 2026-11-11 — Entities as the common organizing identity

The human directs updating the proposal/examples after the naming and identity
exploration. Use Entity for an explicitly identified architectural thing, Subject
for the role an investigation/claim concerns, and Referent for what a reference
denotes. The earlier retained-subject and registered-entity distinctions are removed.
The purpose is organizing qualified accounts/items about the same things, not merely
keeping records alive. Each explicit new entity declaration uses a local ID; PostCode
allocates a global ID and resolves references on atomic acceptance. Later results reuse
supplied entity IDs. UUID format is optional and does not establish semantic sameness.

There is no registration/promotion threshold or separate contextual introduction
route. A selected passage such as “application work has not started” is a valid
investigation input without becoming an entity. Its analysis may explain it, reuse
an existing entity, or introduce one. Content/node/role keys remain distinct from
explicit entity designations. Items still attach through qualified account/item
associations; a mere list of referring investigrams does not replace that organization.

Mechanical analyses participate in the same conceptual model, supplying qualified
identifying information rather than definitive architectural meaning. Reuse their
provider-established identities within supported scope; assigning opaque IDs must
not mint a new identity on each encounter. Selected-subject provenance, result
referents and successful descriptive claims remain distinct. Common semantics do
not mandate migrating every producer or changing storage in the first delivery.

The human also proposes qualified entity supersession for splits/merges, preserving
old identities and correspondences. Entity use could become a separate cause of
needs-reconsideration from exposure to a corrected defining account. Preserve exact
references and original associations; do not redistribute claims automatically.
The walkthrough now illustrates these proposed extensions, their challenge/conflict
questions and deferred reassessment. They are not implemented by the current fixtures
or added to the bounded delivery. The proposal, both payload partitions, composition
fixtures and their checkers use the revised entity terminology; adopted documents
and application code remain unchanged.

## 2026-11-11 — Review clarification: Entity and interpretive result contracts

The human directs the agreed clarifications after review. Explicitly identified
architectural relationships/patterns can use the proposed Entity mechanism, while
claims about their existence, participants and behavior remain qualified. Mark this
as governing treatment needed alongside interpreted identity. Existing mechanical
relationship claims need not become independently identified entities or be migrated.

The general prospective interpretive result contract can remain a qualified investigram;
not every offer needs a specialized schema or mandatory form list. Returned forms
still satisfy their own contracts. A request promising a state diagram specializes
the content requirement and adds a compatible presentation obligation. Partial diagrams
require explicit scope/omissions and permitted partial fulfillment; unsupported or
failed diagram delivery cannot silently count as success through prose alone. The
offer note now illustrates this distinction without changing the executable fixtures.

Surrounding application discussion is legitimate exploratory context, not a flaw merely
because it occupies space. Leave it in the notes; consolidate when drafting if useful.
The guidance-child alternative and structured originating-occurrence field from the
review remain open, not silently adopted by these clarifications. No governing files
or application contracts are changed.

## 2026-11-11 — Account as ordinary language, Investigram as the retained unit

The human chooses account as the informal term for information provided by PostCode,
not an additional object or grouping mechanism. An investigram can give an account
of breaker behavior, and a sequence of investigations can collectively present an
account of the Policy mechanism. Current proposal/example prose now says investigram
when naming a particular retained interpretation, its relationships, corrections,
qualifications or content ownership. Composition trees and retained answer selections
retain their distinct names. No Account aggregate or account-assembly UI is introduced.

Provisional JSON field names and source identifiers using account remain unchanged
and are explicitly explained as encoding investigrams; governing terminology and
application code are unchanged. Historical discussion above preserves its original
wording. Naming of other concepts remains open for further discussion.

## 2026-11-11 — Structure, guidance and diagram contracts; consolidation

The human authorizes recording the latest discussion and a consolidation pass before
adding more mechanisms. Content items structure Interpretation content; a claim is an
assertion, not necessarily a separately keyed object; children are complete investigrams.
The governing five-part definition is an information-obligation list, not a complete
or disjoint schema. Identifying descriptions are content, while explicit referent
inventories and associations organize it.

Offers now belong to qualified guidance metadata rather than architectural content.
Presentation recommendations are also guidance: name a supported diagram type and bind
its inputs to exact content/entity references under its input contract. Distinguish
architectural concept guidance, content-form contracts and diagram-type input contracts/
mappings. Concepts and items need not correspond one-to-one. Shared entity references
establish identity; shared assertions need exact qualified content references. Rendering
resolves explicit inputs/support, validates compatibility and chooses layout, not new
architectural meaning. An optional recommendation differs from a promised diagram.

Required/optional and alternative-presentation annotations are future extensions;
request obligations differ from investigator judgments, and alternatives need not
contain identical information. Their selection/UI behavior is deferred.

The new consolidation note maps both the submitted result and retained investigram,
then audits ownership, correction, qualification and delivery against admission/trial/
correction and composition. Not everything belongs in an investigram field: entity
allocation is an acceptance responsibility, provenance and relationships can have
separate records, and indexes/current status/rendered diagrams are derived or produced.
Guidance ownership and referenced-content delivery remain the main structural choices.
A guidance-only child needs consideration under the substantive-investigram contract;
metadata placement alone does not make offers survive correction. Exact origin/address
namespaces remain a smaller open detail. No wrapper schema or new independent guidance
record is adopted by this grouping.

The proposal records this direction inline. Existing JSON and checkers remain unchanged
and are explicitly labelled as exercising the earlier offer-as-content encoding and
fixed diagram entry points. This pass is a conceptual consolidation, not verification
of guidance metadata, a general diagram registry or a live end-to-end investigation.

## 2026-11-11 — Metadata ownership settled; presentation boundary restored

The human clarifies that an offer makes sense as follow-up to the investigram that
generated it. A1's “Foo is X” and offer about X do not carry forward when A2 corrects
that to “Foo is Y.” Metadata is about the specific immutable investigram: referents,
associations, offers and presentation recommendations stay with its version. Replacements
supply their own metadata. Prior offer invocations retain exact provenance. Matching
wording in a replacement creates neither shared offer identity nor automatic rerun/reuse.
The earlier proposal to preserve guidance identity through a parent, guidance child or
independent record is withdrawn; no separate lifecycle is needed for this purpose.

The human also restores the presentation remit boundary. Retain architectural meaning,
qualifications and exact references; recommendations identify intended diagram inputs;
representative diagrams prove sufficiency. General retrieval, detail/legend arrangement
and navigation belong to presentation work. This differs from context supplied to an
investigator, which preserves explicit delivery, requestable additions and exposure.
Do not turn these into one universal closure/context-selection problem.

The proposal and consolidation now reflect these resolutions. The structure is more
coherent because these questions no longer motivate extra owners or services; remaining
work includes precise metadata addressing/qualification/delivery, fixture alignment and
previously recorded identity/governing choices. Existing fixtures still use the older
offer-as-content encoding; this documentation pass does not claim protocol implementation.


## 2026-11-11 — Complete payload after structure consolidation

At the human's request, the [complete-payload pass](structured-account-example/metadata-payload.md)
now encodes offers and presentation recommendations as exact-investigram metadata in
both partitions. Separate content/offer/presentation key namespaces prevent ambiguous
lookup and replacement fallback. Complete own delivery includes metadata and qualified
basis/provenance context; excerpts do not confer correction eligibility. Original offers
remain with their original investigram; replacements supply their own. No guidance child
or independent lifecycle was needed.

The trial recommendations bind a state model and an interaction through two bounded
diagram input contracts. The sequence also explicitly binds the recovery model whose
transitions it references. This makes a previously implicit renderer dependency visible
without duplicating the model or adding inferred meaning. Both trial partitions reproduce
the previous diagrams and qualified legends. Composition remains the earlier fixed-entry
rendering probe; its results have explicit empty metadata arrays.

The shared and new authored checks cover namespaces, qualification/delivery, metadata
retention and diagram inputs. They do not demonstrate product acceptance, live agent
behavior, cross-investigram rendering or a general presentation retrieval strategy.
The structure looks more coherent because each responsibility has a concrete owner;
address and delivery semantics remain its main complexity. Previously recorded governing,
identity, support-selection and correction-standing questions remain open.


## 2026-11-11 — Review: offers already addressed and optional recommendations

The human authorized removing ADMISSION-2's redundant concurrent-callers offer: this
submission already supplies TRIAL-1. Historical ADMISSION-1 guidance remains accessible.
This is not a universal ban on reinvestigation or a change from atemporal "find out more"
to "next steps". No addressed-by field or extra guidance lifecycle is introduced.

The earlier metadata pass duplicated the interaction's `stateContent` dependency in a
presentation `stateModel` binding. That binding is removed. The content contract owns
exact model/transition references; the diagram resolver follows them with form/reference
validation, without inference. Direct diagram/content selections now render both trial
diagrams unchanged with recommendations removed, in both partitions. Recommendations
express investigator judgment of usefulness rather than permission to render.

Adding a renderer or choosing a compatible diagram does not revise the investigram or
require correction. Historical metadata remains immutable. An erroneous recommendation
could warrant correction, but a missing suggestion for a new renderer is not an error.
The authored checkers exercise these boundaries; product behavior and general cross-
investigram presentation retrieval remain outside this pass.


## 2026-11-11 — Accumulated naming choices applied

The human agrees: content item within Interpretation content; content type for the
supported kind; content-type contract for required data and semantics, with a schema
for mechanically checkable shape. The catalogue is defined and extensible. An investigator
may identify new concepts/topics using supported types, not invent an unknown type and
expect processing. Architectural concept remains distinct from the representation.

Use follow-up option (option when clear), rather than investigation offer or suggestion:
atemporal availability without implied recommendation. Keep presentation recommendation.
Use architectural relationship for relationships in the architecture, investigram
relationship for qualified relations between investigrams, and content association for
identifies/describes associations between information and entities/subjects.

Use exposure index for the existing citation index: substantive supplied content, not
reliance or endorsement. Context delivery records the actual portions/qualification;
support is attributed grounds for a claim. The human prefers including cleanup rather
than leaving debt, but the scope of the governing/API/implementation rename will be
decided when drafting. It is not adopted now or automatically put on a separate backlog.

Current notes, fixture keys/checkers and generated source pointers now use the agreed
names; governing/product files remain unchanged. Historical entries above retain the
language of their discussion. The consolidation's vocabulary is the current reference.


<a id="association-declarations"></a>
## 2026-11-12 — Association declarations and information targets

Current exploratory direction from the discussion, not an adopted governing change
or a fixture protocol. Resolve substantive choices and deferral boundaries in notes
before translating them into a draft planning package.

**Identity/reuse clarified.** Reusing an entity ID means referring to the previously
identified thing, not agreeing with an earlier description. Descriptions and names
remain qualified content; identity is not an authoritative definition or proof that
independently introduced IDs denote different architectural things. Entity introduction,
identifying content and content association remain distinct responsibilities.

**Association supersession.** The human intends an expanded description to be able to
supersede an earlier identifying association without correcting the whole investigram.
Earlier discussion contemplated updating associated information, but the concrete
fixtures had not specified independent association supersession. The human also proposes
withdrawal without replacement. Existing association/content provenance is never mutated.
Different applicability alone does not warrant withdrawal: an association that remains
appropriate in its stated scope can coexist with another qualified association.

**Preferred unification under development — proposal (I).** Use association declarations
for both entity-related information and an investigation's designated result, rather
than a separate whole-investigram supersession mechanism. B can declare associations
concerning A's result, not just B's own result. B can replace the designated result and
independently displace other associations. Historical production provenance and captured
answers remain fixed. This is a substantive alternative to the governing correction
model; the old fixtures still demonstrate whole-investigram correction.

The alternative (II), superseding content items directly, is less attractive because one
item can participate in several associations and remain appropriate for some of them.
Association-specific declarations can preserve those uses without copying content.
The proposed coverage check that each content item participates in at least one
association remains to be worked through; it does not by itself cover direct item access
or semantic dependencies.

**Names and structure agreed in discussion.** An investigram includes a collection of
association specifications expressing association declarations. The three declaration
kinds are addition, supersession and withdrawal:

- Addition introduces an association.
- Supersession introduces a replacement association and identifies the exact earlier
  associations displaced.
- Withdrawal identifies exact earlier associations displaced without replacements.

An association target is a choice between:

- an investigram's result; or
- an entity together with an applicable role, such as identifies or describes.

A separate role field is not needed for result targets. Own-result and other-result
references are cases of the same target kind. New entity/local investigram references
resolve on acceptance; existing references use exact retained IDs. Entity plus role
identifies a category of information, not a single mutable slot or one canonical
content item. Target, associated content, and exact supersession/withdrawal references
are distinct. Multiple competing associations need not be reconciled automatically.

**Cross-investigram content and ownership.** B may declare an association referring to
an exact content item owned by A. A keeps ownership, original evidence, qualifications
and provenance of the item; B owns the new qualified association. References do not
copy/reparent the item, broaden its scope or silently rewrite it. New wording requires
new content. This extends the fixture's own-content-only association contract. An
investigram with no new content items but substantive qualified association declarations
is permitted in principle, likely rare; it should not require filler prose. This revisits
the earlier substantive-root-content rule, not the requirement for meaningful qualified
interpretation.

**Reasons and grounds.** Supersession and withdrawal require an explicit qualified
reason, normally inline with the declaration. Ordinary additions need attributable
grounds, not redundant explanatory prose. A fuller explanation can be referenced as
content. Targeting an earlier association already locates its participants/content;
repeat references are not mandatory support. Additional evidence or exact content
references are supplied where needed to substantiate the new judgment. Actual delivery
and evidence provenance remain preserved. No mandatory separate support list or special
operation for updating a declaration's reasons is proposed. A later investigation can
provide additional qualified grounds concerning an earlier claim, with exact references;
it does not rewrite the original investigation's evidence or automatically strengthen
an aggregated conclusion.

**Still to resolve before adopting this direction.** Distinguish replacement by an
expanded description from reporting a factual error; specify correction/reconsideration
consequences and direct-content-access disclosure without treating every withdrawal as
proof of falsehood. Define what a result association designates (items and child content),
what must be delivered before displacement, and how competing/challenged declarations
are handled. Reconcile guidance, composition, historical access and verification with
this proposed mechanism. No governing, product, or fixture changes are made in this
recording pass.


<a id="entity-context-and-result-exposure"></a>
## 2026-11-12 — Entity context, query results and reconsideration

The human proposes organizing architectural accounts around entities and their
associations. Investigrams remain immutable bundles of investigation contributions,
with provenance and qualification, but need not be the unit normally supplied as
context. Supplying an entity means delivering a qualified selection of associated
information, not just an ID or a reconciled canonical definition. Preserve competing
accounts and the exact content/qualifications actually delivered, including their
original owners. Entity references alone are not substantive delivery.

A query-result entity could unify the earlier special result target with entity-related
associations. The human agrees that Q denotes a particular query invocation, with its
captured subjects, parameters and context, rather than a continuing inquiry or every
invocation of similarly worded queries. Q's result is distinct from Q. Later association
declarations may concern that result entity without rewriting what Q originally
returned or an earlier captured answer. Exact result designation and declaration syntax
remain to be reconciled with the preceding proposal; this does not adopt an Entity
schema for every existing product result.

For a user selecting something within Q's result, the supplied portion records exposure
to Q's result entity. The delivery record preserves exact selected content, qualification
and supplied context, not a later expansion of the entity's associations. The passage
need not itself become an entity. Human selection/browsing alone creates no investigator
exposure. Other information supplied during the dialogue remains attributable separately.

**Reconsideration principle clarified.** A fuller description can reveal edge cases,
failure modes or additional behavior relevant to earlier analyses, even if the earlier
description was factually correct. Supersession/withdrawal can therefore create a
reconsideration cause without requiring a finding of factual error. Do not substitute
proven reliance for conservative exposure. Precisely which exposure is relevant remains
to be specified. Whether an addition should also trigger reconsideration is newly exposed
by this model and remains open; no blanket addition trigger was agreed.

**Two paths into result reconsideration.** The human agrees that needs-reconsideration
propagation should reach query results:

1. Exposure: Q receives information about S and produces result R. A relevant later
   change concerning S can cause R to need reconsideration; investigations receiving
   R can pass that cause to their own results.
2. Result composition: Q may itself introduce S and designate newly created information
   as part of R. There was no prior exposure to S. Changes affecting information
   designated as part of R must be traceable through that designation, rather than by
   inventing an incoming exposure record.

These paths are distinct inputs to cause tracking. This proposed result-composition
path is not the existing fixed child-investigram tree, nor does every reference or
shared entity automatically establish propagation. Specify which content/association
changes affect a result, especially where one item has several associations and only
one is displaced. Downstream propagation can then use actual result exposure. Preserve
cause identities, historical delivery and exact answers; the warning does not assert
that a result is false or automatically clear earlier warnings.

This direction remains conceptual. Entity/result exposure granularity, complete-delivery
requirements, result designation, applicability of earlier exemptions, competing and
challenged declarations, and migration from investigram exposure need explicit design
and a worked example. Governing documents, product implementation and executable
fixtures remain on the earlier model; passing those checks does not validate this one.


<a id="entity-context-conformance"></a>
## 2026-11-12 — Conformance pass for entity context and declarations

The human requested that the working material be conformed throughout before another
review. The proposal, consolidation, walkthrough, contract and example guides now describe
one current direction rather than accumulating incompatible amendments. Governing/product
files remain unchanged. This is exploratory validation, not an adopted plan.

The mixed and children fixtures now allocate query-result identities and use association
addition/supersession/withdrawal. Q2 supersedes the admission association and separately
redesignates RESULT-Q1, referencing unchanged definitions rather than copying them. The
original investigrams, child links and captured answers stay exact. No K-style correction
record, whole-owner superseded flag or special replacement tree remains in current fixtures.
The source continues to own its guidance; a RESULT-Q1 invocation names the exact originating
ADMISSION-1 option. ADMISSION-2 does not repeat what the submission already answers.

New authored probes cover a consumer of the original result, a fuller identifying description
without a factual-error claim, old-content reuse with no new items, withdrawal without
replacement and competing supersessions. The simulator separates evaluation exposure from
result-membership causes: Q1 never received newly introduced S, but its result can need
reconsideration after S's identifying association is superseded. Actual consumers of that
result can inherit the concern. Declaration-only results can include the withdrawal itself.

**Provisional choices made concrete for review:**

- One query-result identity/initial designation per fixture invocation; result members
  reference exact items or declarations. `result` applies iff the target is a query-result
  entity. All submitted items are associated, which is coverage rather than semantic proof.
- Supersession displaces exact earlier associations at the same target; changing target
  uses withdrawal plus addition. Withdrawal is not itself an association to supersede in
  this bounded model. Challenge and reinstatement remain open.
- Displacement requires actual delivery of the target declaration and its full designated
  content/dependencies with applicable source qualification. Reusing foreign content also
  requires delivery. Neither demands all unrelated content/metadata in the owning bundle.
- Supersession/withdrawal cause conservative entity-exposure and result-membership warnings,
  including shared-item overlap. An unchanged valid association can receive a warning
  without being displaced. Generating-context provenance remains relevant across projections.
- The producer is exempt from its own declaration causes. No received-cause exemption or
  clearance is implemented. Addition-trigger policy remains open; absence of a prototype
  trigger is not an agreement that additions cannot matter.

These choices need review rather than being presented as settled by the conversation.
Support selection, exact propagation/exemptions, declaration standing and first migration
scope still need decisions in notes before drafting. Broad reassessment/merge-split features
can be deferred only with an explicit first-capability boundary.

The children comparison now demonstrates qualification scope, not a required independent
correction/citation unit. The mixed variant's inherited behavioral limitations remain visible
on description excerpts. Composition selects P/S/R/B projections and designates RESULT-Q4;
its exact local follow-up selectors use that result as context. Existing architectural
state/interaction content, diagrams and qualified legends are preserved.

The [verification guide](structured-account-example/README.md#verification) records the
current checks: both lifecycle partitions, 50 malformed lifecycle/delivery copies, 26 guidance
cases, five malformed composition cases and nine selector cases, plus generated diagram
source/legend/traceability checks. JSON and local links were checked. These are authored
probes, not live agent, semantic-source or supported-API verification.


## 2026-11-12 — Exact exposure and designation-status review fixes

Following the human's direction to apply the review fixes, the prototype now uses exact
association uses actually delivered. The earlier entity-wide exposure and shared-item
membership rules were too broad: receipt of P orientation incorrectly flagged Q1 for its
own later admission output and for a P association created by Q-reuse. Those rules are
withdrawn in the current synthesis/fixtures; older dated entries preserve the exploration.

Entity/result identities remain organizing context. Qualified `associationUses` record
exact versions/routes, including `viaAssociation` for excerpts, without pretending that
an excerpt delivered full membership. The producer's actual generating-context exposure
can still propagate through its delivered contributions. Identity events remain separate.

Status now names each result designation, distinguishing displaced standing, membership
concerns and generating-evaluation concerns. An updated designation does not receive the
cause that created it, and receiving it is distinct from receiving the original designation
of the same RESULT-Q. Unrelated later causes still apply. Exact captures are unchanged;
fresh status inspection is separate. There is no new reassessment/clearance decision.

Redesignation is optional and requires actual delivery of the earlier invocation's declared
question/scope, subjects, parameters and operation/option. `queryMeanings` captures that
request context alongside the projection. Superseding a component association does not
require finding/redesignating all containing results; their exact designations retain
membership and receive appropriate fresh notices/status.

The new expansion description has identification-specific qualification in both partitions.
Its waiting example is separately scoped related content, not an unqualified general waiting
rule. Previously retained mixed items still keep their original source qualifications.

New probes exercise an excerpt consumer and a consumer of the updated answer. Checkpoints
show the updated designation clear of admission/redesignation warnings before later independent
expansion. Checks assert Q1 has no fabricated exposure, one association's withdrawal does not
warn other uses of the same item, and an updated designation still receives a later relevant
membership cause. Query-meaning and excerpt-route rejection cases bring lifecycle malformed
cases to 64 across both partitions. The other guidance, composition, selector and diagram
checks remain applicable. These remain authored notes/probes, not product implementation.


## 2026-11-12 — Known changes are context, not later-change warnings

The human approved applying the timing correction from re-review. Each delivery captures
its retained-state position; causes accepted before it must be disclosed and are not later
changes to that delivery. Missing disclosure is a delivery-completeness defect. Fresh
projections now include known direct, designation-membership and inherited producer concerns,
so a known cause cannot return through another propagation route. Notices preserve qualified
reasons and standing without proving adequate replacement context or endorsing historical use.

New designation membership uses its acceptance boundary: already-displaced members remain
visibly displaced but do not introduce new membership warnings. The producing evaluation may
still be affected if it acquired relevant content earlier. Actual acquisitions govern, not
query start or final acceptance. A later refresh leaves earlier exposure and historical
warnings intact. No general reassessment or clearance operation is introduced.

Q-reuse and Q-competing no longer acquire EXPANSION-1 as a later-change cause when their
input already disclosed it, and Q-withdraw does not inherit that known cause through reuse.
The later competing declaration still affects earlier recipients. Probe-order documentation
now includes Q-excerpt, Q-updated and the generated competing copy. Separate branches test
pre-change capture followed by later acceptance/refresh, informed acquisition during a query,
inherited disclosure and new historical membership. Missing/altered disclosure and invalid
positions are rejected; lifecycle malformed cases total 72 across both partitions.

The proposal, consolidation, walkthrough, contracts and fixture guides now state this timing
rule inline. Earlier statements here that there is no received-cause distinction are historical.
Governing/product files remain unchanged; the scope remains authored exploratory validation.


## 2026-11-12 — Addition policy and deferred proactive reassessment

The human prefers a conservative addition trigger over investigator-selected harmless versus
consequential additions. The agreed next step is to exercise that default and inspect warning
volume before including targeted suppression in first delivery. Addition impact has no exact
displaced association; its proposed entity/context scope must be explicit rather than treated
as receipt of information created later. The existing executable fixtures remain displacement-only.

Targeted suppression by the causing investigator and later reassessment are related qualified
assessments for an exact target and cause. They remain deferred. Distinguish "this target needs
no change" from stopping propagation through it; retain other causes and independent paths.
Neither current implementation nor the prototype supplies general clearance.

The human also proposes deferring proactive orchestration: PostCode could automatically assess
the immediately affected ("0th-order") dependents and potentially stop propagation there,
without marking/notifying and waiting for user action as the only possible workflow. This is
a scheduling option over qualified reassessment, not a separate weaker inference mechanism.
Pending-status presentation, resource limits and scheduling policy remain future work. Preserve
the possibility without adopting a notification system or expanding the first implementation.


The human adds UI-state-dependent scheduling examples: automatically reassess information
underlying views currently exposed to the user, or trigger reassessment when a view is
re-exposed. Retain these as deferred scheduling options over the same exact target/cause
mechanism. Human visibility is not investigator exposure; actual material delivered during
reassessment is. Scheduling alone changes neither historical captures nor cause standing.

## 2026-11-12 — Conservative addition probe completed

At the human's request, the [probe](structured-account-example/additions.md) now runs a
category clarification and a recovery caveat independently against identical history in
both partitions, then cumulatively. Each addition targets S/describes and displaces nothing.
All ordinary additions are enabled from the beginning; the existing displacement regression
remains separate. Neither example claims a new source discovery: the added association
re-expresses qualified information already retained elsewhere.

Each marks 5/7 prior evaluations and 7/8 designations. The cumulative second addition marks
9/10 prior designations. Qualified notices create an indirect path to the P-only excerpt
consumer; an R-only recovery recipient inherits Q2's concern. Neither is fabricated direct
S exposure. Bare subject/referent selection remains unflagged. Actual-delivery timing keeps
informed recipients clear; refresh does not clear an older exposure. Exact cause references,
original bundles, snapshots and association standing are preserved.

The probe makes entity scope and broad unsupplied-addition notice disclosure explicit; they
are experimental choices requiring review, not automatically adopted completeness rules.
The recommendation for discussion is to revisit deferring all bounded cause-specific
reassessment, or explicitly accept coarse new-information marks. No suppression, clearance,
reassessment or scheduling was implemented, and no new first-delivery decision was made.

## 2026-11-12 — Likely substantive impact of the addition warnings

At the human's request, inspected all five flagged evaluations' outputs and all seven
flagged designations, for each new addition separately. The [manual assessment](structured-account-example/additions.md#manual-assessment-of-likely-changes)
finds no clear required substantive change. Q2's model already distinguishes category/instance
and explicitly contains the recovery caveat; the other four evaluations mainly retain or
re-associate admission/recovery content. The original and newer Q1 admission/inspection
designations could optionally be enriched, without a required revision from either addition.
Their existing waiting-omission issue remains a separate cause.

The counts overlap, rather than measuring twelve independent outcomes. This narrows the
earlier inference: the probe usefully shows redundancy costs, but does not establish how
often genuinely new findings change previous answers or that first delivery needs clearance.
An earlier explicit conclusion challenged by genuinely new information would be a stronger
next comparison. No qualified reassessment was executed and no stored cause was cleared.

## 2026-11-12 — Association exposure and explicit inventory acquisition

The human requested conformance of proposal/probe to the distinction between receiving a
specific association and separately asking what other associations are available. The
[revised probe](structured-account-example/additions.md) records both at the investigation
boundary; dialog tools are left to implementation. Mechanical inventory entries do not
deliver their content or produce exposure to each listed investigator. Scope and captured
position are explicit; substantive summaries would be additional content exposure.

The old blanket delivery of unrelated additions' reasons is removed. Exact association
displacement and required qualified/inherited context remain. Additions affect earlier
matching inventories; fixed result membership does not imply inventory exposure. This
fixture's all-retained inventory gains entries on additions/supersessions, even when
previously empty; it does not remove entries on withdrawal. Other inventory policies need
explicit coverage and change rules.

The two additions now affect 0/7 original evaluations and 0/8 designations in each partition,
compared with 5/7 and 7/8 under the reproduced earlier broad rule. A separately requested S
inventory and downstream consumption of its result yield 2/9 evaluations and 2/10 designations
affected (one direct, one inherited). The cumulative second addition reaches those two plus
an intervening inventory reader: 3/11 evaluations and 3/12 designations. Exact causes and
actual-delivery timing survive; no semantic suppression or clearance is implemented.

This narrows structural overreach without establishing that unrequested new information
cannot matter. General discovery/ranking, partial inventories, complete-answer claims,
qualified reassessment and production-scale storage remain open. Inventory exposure need
not create one content edge per listed entry; implementations can share delivery records
while retaining meaningful times. No performance claim follows from these authored counts.

<a id="exposure-model-alignment"></a>
## 2026-11-12 — Exposure model accepted as working direction; document alignment

The human accepts association/content exposure plus separately acquired inventory exposure
as a sound bounded direction, including imperfect semantic coverage and the need to specify
richer inventory policies later. All current working documents now use entity/query-result
IDs as organizing context rather than blanket exposure units. Exact membership is not an
inventory; unrequested association reasons are not automatically delivered. Qualified reasons,
options and substantive summaries remain content, even when called metadata. The proposal
states these obligations at the investigation boundary, leaving dialog tools to implementation.

The human suggested a deferred investigator-directed propagation route: an investigation
could locate earlier query results through their exposure to associations about an entity,
including other attributes, inspect selected questions/results/support, and identify a result
that may need updating. Candidate discovery is not an impact assertion or content delivery.
A qualified concern would identify an exact target and new finding/cause; it could propagate
without fabricating historical exposure or replacing earlier information. The representation,
eligibility and reverse-lookup operation remain undesigned and unimplemented.

Investigator-directed propagation, targeted suppression, reassessment/clearance and automatic
scheduling stay deferred beyond the first capability. The refined probe does not establish
a need to bring them forward. No exhaustive search obligation, new payload field, declaration
operation, product behavior or governing change is introduced by this documentation pass.
Historical dated discussion and the labeled earlier entity-wide experiment remain intact.

## 2026-11-12 — Review fixes: acquisition scope and declaration-reason exposure

The human authorized the accepted review fixes before discussing architectural coverage
dependencies. Initial content selected by explicit scope now records its selection guarantee
and delivery position, without claiming that a separate inventory list was supplied. Exact
reference selection stays narrower. The bounded policy selects all undisplaced associations
in the entity/role scope; it is not an authority ranking. The probe contrasts identical initial
content acquired by these two routes, then adds another identifying description.

A qualified declaration reason supplied as context now contributes exact direct exposure to
that declaration. Its later displacement reaches the recipient even when the producer is
unaffected. Nested bare references do not deliver their targets or establish full-member
eligibility. Fresh disclosure includes later displacement of the supplied declaration too;
no predecessor is automatically reinstated.

The [acquisition probes](structured-account-example/acquisition.md) add a Q2 discovery/retrieval
branch: each tested addition marks 3/7 evaluations and 4/8 designations in both partitions.
The original 0/7 and 0/8 baseline is labeled a by-reference boundary control, not realistic
warning frequency. The review's 400-character dialog excerpt claim was checked: dialog
listing returns references; the excerpts are in human-facing association presentation.

ADMISSION-1 already claims architectural admission coverage. A newly added waiting case could
challenge it even without inventory exposure, but whether coverage claims require a standing
future-information dependency remains unresolved. Coverage of runtime behavior is distinct
from completeness of retained-information selection. This pass adds no coverage dependency,
new concern operation or suppression/reassessment feature.

## 2026-11-12 — Defer remedies for unobserved coverage dependencies

The human agrees to defer declared dependencies, and notes that the already deferred
investigator-directed propagation could address the same gap. Observe how often and in which
circumstances missed impacts arise before choosing either mechanism or combining them. Declared
dependencies would anticipate relevant changes; directed propagation would assess particular
earlier results when new findings emerge. Both supplement actual exposure rather than replace
it, and neither fabricates historical delivery. No metadata field or propagation operation is added.

Preserve the concrete deferred test: ADMISSION-1 claims coverage of admission behavior; a newly
added waiting case could undermine that claim without relevant prior inventory/selection exposure
or explicit displacement. The current mechanism does not guarantee a warning in that case. This
accepted coverage limit does not mean the earlier claim is unaffected. Runtime-domain completeness
and completeness of a retained-information selection remain distinct. The next discussion can
address the remaining first-capability choices rather than design these deferred remedies now.

## 2026-11-12 — Renewed assertions preserve provenance without reinstatement

The human agrees that if B supersedes A, a later C should be able to supersede B while using
A's original content. The content retains its original provenance and qualifications; C supplies
a new attributable assertion and grounds. A remains displaced. This also leaves D free to
disagree again through a later qualified association. After a withdrawal, a new addition can
associate the earlier content without undoing the withdrawal declaration.

Normal acquisition and eligibility requirements continue to apply. Historical declarations,
deliveries, result designations and causes are preserved; this is not reassessment or clearance.
General declaration revocation/reinstatement is deferred. Competing-association selection still
needs bounded treatment. No new operation, product behavior or executed fixture is added by
this notes pass.

## 2026-11-12 — Competing associations and sequential investigation

The human agrees that if B and C both supersede A without displacing each other, current-description
acquisition should include both with their qualifications and grounds. PostCode does not select
a winner by recency. Exact-reference acquisition stays narrower, and fixed result designations
do not silently grow. General delivery bounds still need treatment without hiding competition.

The human notes that this should be an edge case in the sequential setting: C acquiring A after
B's supersession receives that information and can supersede B explicitly. The normal eligibility
requirements still apply: disclosure of B's declaration is not delivery of all of its members.
C can deliberately leave B standing; competition need not imply parallelism. The existing probe
remains useful as that deliberate case, without claiming empirical frequency. No fixture or
product behavior changes are needed for this agreement.

## 2026-11-12 — Displacement acquisition guidance, structural acceptance

Reader note added after review: the later [general validation boundary](#general-validation-boundary)
removes the two remaining acquisition gates mentioned in this historical entry.

The human agrees that investigators can reasonably be expected to follow instructions. Before
superseding or withdrawing an association, they must acquire its complete designated content,
qualifications and required support. Mechanical enforcement of that completeness rule is deferred
for the first capability; an acceptance gate cannot establish actual understanding.

Structural checks remain mandatory: existing eligible exact targets, compatible target/role,
valid operation shape and required grounds. Delivery records still faithfully record actual
qualified content and notices; IDs never become exposure to unseen content. The fixture separately
retains foreign-content reuse and earlier-query-meaning requirements. This decision concerns the
prior support required for displacement, not those separate checks. Governing qualification,
evidence and provenance requirements are not relaxed; their replacement design needs adoption.

The acquisition probe now accepts reason-only and no-target-content withdrawal branches as a
deliberate instruction-boundary test, without implying sound investigation or invented exposure.
It still rejects unknown targets, missing grounds and malformed delivery. End-to-end investigation
should examine instruction-following before deciding whether to add a mechanical completeness gate.

<a id="general-validation-boundary"></a>
## 2026-11-12 — General validation boundary and future dialog recovery

The human proposes the general rule: mechanically check data integrity as good programming
practice; encode semantic/investigation policies in agent instructions and defer their mechanical
enforcement until needed. This extends the preceding displacement decision to prior acquisition
for content reuse and earlier-query redesignation. Reuse needs no special instruction beyond
understanding and qualifying information used. Redesignation instructions must explain the need
to understand the earlier question and scope. References still resolve and preserve original
provenance/qualification; accurate delivery records do not invent exposure to referenced content.

The human also notes that future policy checks could work inside the dialog: call attention to
an apparent omission, remind the investigator, and allow it to acquire information, clarify or
revise. This need not be a final rejection. A mere acknowledgement is not proof of compliance;
malformed final data remains invalid. No semantic checker or reminder protocol is implemented.

The authored model removes the reuse and prior-query-acquisition gates. Positive boundary probes
accept no-context reuse/redesignation and inventory-only reuse without fabricating deliveries.
Captured question context, if selected, must remain accurate; unresolved references still fail.
The adopted governing material and product code remain unchanged.

## 2026-11-12 — Review clarifications: reuse coverage and current cause standing

The human agrees to document the reuse coverage limit and defer a dedicated "used without
delivery" record or dependency. References without recorded delivery can be derived for a future
audit. Ordinary association reuse without acquisition need not inherit a later displacement of
the source association. Result membership protects only the specific included association, not
any direct reference to its item. No privileged original association governs all uses of content.

Fresh inspection should reveal a cause declaration's current standing without treating the cause
as cleared or the original result as sound. The new counterfactual renewal branch has C supersede
B and reassert A's content. An original recipient of A retains historical cause B and receives no
new automatic C cause. Existing standing lookup and fresh disclosure expose C's relationship to B;
captured inputs and answers remain unchanged. New recipient delivery records B and C as known
context. No model behavior or retained status field is added. A forward pointer clarifies the
historical entry whose remaining acquisition gates were removed in the next discussion.

## 2026-11-12 — Recognized request reuse preserves result identity

The human corrects a conflation between a repeated user request and a new investigation
invocation. Recognizing the same request and reusing Q1 returns its existing result entity;
there is no Q2 or duplicate result designation. Architectural identities and claims are not
reintroduced. Access/reporting may be separate, and exact redisplay is access rather than new
investigation. A new Q arises only when new investigation is undertaken; effective-input changes
or an explicitly supported new-investigation operation can distinguish it from reuse. Matching
wording alone is not input equivalence. No new rerun operation or cache-key design is introduced.

The earlier suggestion of a separate result entity for each repeated user request is withdrawn.
The proposal preserves existing reuse behavior while leaving failed/partial-result treatment
and the depth of mechanical-query migration to be bounded. The simulator still models new
accepted invocations; this notes pass does not implement product request coordination.

## 2026-11-12 — Existing mechanisms suffice for identity merge/split findings

The human agrees that existing mechanisms are sufficient: preserve independent IDs, express
qualified correspondence, introduce distinct entities when an earlier one conflates things, and
use ordinary association declarations for specific justified changes. No automatic aliasing,
association pooling/reassignment, entity-level supersession or identity-specific propagation is
needed in this capability. Original content, identities and histories remain available.

The human notes that choosing how to present this information may be awkward, but UI design is
not the current concern. Record that boundary without adding organizing mechanisms to anticipate
it. The illustrative cases are not a new executable identity probe or an adopted governing change.

## 2026-11-13 — Generalized analysis contributions and complementary methods

The human challenges the recommendation to keep mechanical claims outside investigrams: as
investigrams become immutable contribution bundles, mechanical analyses could produce them too.
The working direction is to generalize the bundle while preserving method-specific evidence,
basis, scope and guarantees. An atomic submission can contain multiple investigrams; neither
all mechanical work nor every evaluation outcome must become one bundle. A concrete mechanical
module-discovery/export example remains the next test, not an already demonstrated integration.

The human prefers sound design over preserving an inferior split to avoid document or code
changes; this pre-release application has no compatibility obligation that dictates the choice.
The human also points out that mechanical and interpreted analyses can enhance as well as correct
each other. Mechanical static dependency analysis may be supplemented by interpreted discovery of
runtime dependencies. Valid scoped claims can coexist; only an appropriately justified declaration
displaces an earlier association. Inferred runtime behavior retains its conditions and is not
automatically observed execution. A replacement never inherits the displaced claim's method
guarantee. Later mechanical analysis can likewise enhance or supersede interpreted contributions.

The proposal and consolidation now express this working direction; the earlier blanket statement
that mechanical claims do not become investigrams is withdrawn. Governing documents, product code
and the executable fixture schema are unchanged pending the concrete mechanical example.

## 2026-11-13 — Worked unification of analysis contributions

The human requested a concrete pass through the common mechanical/interpreted model. The new
[worked example](structured-account-example/unification/README.md) uses a small pinned source
fixture and authored expected outputs: module discovery, later export surfaces and symbol
introductions, mechanical computed-target indeterminacy, interpreted conditional target, a combined
selection, and subsequent supersession in each producer direction. The proposed later constant-target
mechanical method is explicitly hypothetical; no native provider or live investigator was run.

The organizing model works without a separate mechanical member/reference arm or correction
system. Mechanical module/symbol introductions need structured identifying content rather than
mandatory prose. Per-contribution method and captured basis must accompany delivered content;
producer kind does not confer a guarantee. Identical module references are reused across analyses,
and later symbols can be introduced atomically. Established empty exports remain distinct from
an unavailable analysis with no contribution. Queries, producing analyses, contribution bundles
and selected results must retain their separate roles when several methods serve one request.

The shared authored model now accepts registered content contracts and optional host-attributed
production provenance. Older fixtures retain their fixed shared basis. The unification checker
validates seven authored analyses and rejects twelve malformed cases, without claiming semantic
certification or product integration. Earlier answers, source ownership and guarantees survive
supersession. Exposure records actual retained-information acquisition; merely sharing a module
ID does not expose mechanical producers to every interpretation of it.

Recommendation: proceed with generalized investigrams as qualified analysis contributions. Complete
native content/access contracts, coordinated-method attribution, migration scope and actual Session-
lifetime verification remain planning work. No adopted or product files were changed.

## 2026-11-13 — Investigation vocabulary and execution mechanisms

The human agrees to broaden investigation while emphasizing the real operational distinction
between the dialog-wrapping agent boundary and source-analysis operations. Mechanical versus
agentic is a choice of mechanism for creating investigrams, not an artifact distinction.
Investigation names the inquiry, analysis the work, interpretation the explanatory judgment or
inference, and investigram the retained qualified contribution. Investigating agent names the
dialog participant. Agentic analysis runner and mechanical analysis provider are working names
for the distinct execution boundaries; no code rename or universal execution API is adopted here.

The active proposal and consolidation now record that vocabulary. The unification probe changes
`producer.kind` from mechanical/interpreted to mechanical/agentic; method, scope, evidence and
guarantees remain distinct. A mechanical tool contribution keeps its provenance when invoked or
reused by an agent. Agentic output does not imply that all its information has one epistemic status.
Historical discussion retains earlier wording; no product or governing files are changed.

## 2026-11-13 — Production mechanisms are extensible

The human clarifies that mechanical and agentic need not be the only mechanisms; hybrid or
other future mechanisms could also create investigrams. Record an extensible common contribution
model, not a mandatory binary producer taxonomy. The current authored probe validates only its
two supported kinds; that is a fixture scope limit. Future mechanisms retain attributable methods,
bases and qualifications, and a hybrid label does not replace actual method provenance. No hybrid
execution protocol or implementation is introduced now.

## 2026-11-13 — Epistemological capability belongs to mechanisms and methods

The human notes a real functional difference: mechanical analysis can return verified truth for
some queries, while agentic interpretation cannot independently supply that guarantee. These are
properties of the mechanisms/methods, not restrictions to enshrine in the common investigation or
investigram definitions. Record verification within the method's supported scope, captured basis
and assumptions. Agentic use of mechanically verified information retains the verifying method's
provenance; production kind alone does not make every output verified. No schema or execution
change follows from this clarification.

## 2026-11-13 — Unification review corrections

The human authorized the review fixes. Provider/native identity resolution now precedes common
allocation: repeated discovery binds existing entities without analyzer Session bookkeeping.
The bounded adapter reuses exact identifying associations when content/method/basis/qualification
match, and adds new qualified identification on the same entity when the method changes. Fresh
allocation collisions remain invalid. This corrects the earlier rerun-as-collision negative case.

Q-M now contributes a mechanical finding and a separately attributed agentic organizing declaration
in one acceptance. The constant-target analyzer does not author the supersession judgment. The
organizer references the mechanical item without inheriting its verification. A defined mechanical
organizing policy remains possible under its own method attribution. Q-R adds fuller prose alongside
the valid mechanical finding; the earlier claim that this fixture tests supersession in both
producer directions is withdrawn. Justified cross-mechanism displacement remains possible, with
material method/scope/guarantee changes explained in its grounds. Minimum-guarantee selection is
deferred; guarantees are not one universal ordered scale.

Q-C and Q-R record retained selections as their actual basis. Selected source claims keep their own
source bases and guarantees. First native verification must include mechanical reads of retained
claims (e.g. export projection acquiring module naming), exposure and later-displacement behavior,
and provider re-encounter. The authored probe does not establish any of that native integration.
The updated checker exercises seven invocations plus two re-encounter branches and rejects sixteen
malformed cases. No governing, product or foundation documents were changed.

## 2026-11-13 — Re-encounter exposure, standing and allocation corrections

The human authorized fixes from the focused re-review. Equality reuse by the host now records a
normalization decision rather than inventing investigator deliveries. The rerun has no retained
context exposure; its result can still include earlier associations and acquire later membership
causes. Reuse is restricted to undisplaced identifying associations. After supersession or
withdrawal, recomputation resolves the same entity but contributes a new identifying addition,
leaving the original displacement and any replacement intact. Renewal does not adjudicate a
conflict or imply the analyzer read the organizing claim. This corrects the previous probe's
synthetic deliveries and its reuse of displaced identifications.

Native keys and common IDs now differ throughout the fixture. A genuinely different provider
identity scope allocates fresh common IDs without correspondence; it is no longer a negative
collision example. The adapter also handles per-investigram provenance. Scope continuity remains
provider-specific; no universal rule makes each source change a new entity.

Q-M now has only the organizer's association to the mechanical item. The existing model already
checks reachability across the whole submission, so the earlier duplicate association was
unnecessary. Mechanical item attribution and agentic declaration attribution remain separate.
Q-R's basis now includes the supplied/cited loader and plugin source as well as its retained
selection. Q-C remains selection-only. The previous entry's Q-R retained-only basis is corrected.

The unification probe now exercises seven main invocations and six re-encounter branches,
including supersession/withdrawal renewal and later result-membership causes without invented
evaluation exposure. Seventeen malformed cases are rejected. These remain authored probes;
no product or governing files were changed and no native integration is claimed.

Verification: unification, both partitions, additions, acquisition, guidance, composition/selector
checks and diagram regeneration all pass. Working-note file links and fixture JSON also validate.

## 2026-11-13 — Disclose provider renewal history; change organizing use explicitly

The human approved two follow-ups to the clean mechanical review. Exact qualified provider
recomputation that creates a new identification after displacement now records host-established
history to the earlier association. Fresh substantive delivery discloses that history and the
qualified displacement reason; the objection no longer disappears from scope-selected current
information. History does not claim the analyzer received or answered the objection, deliver old
content, infer semantic equivalence, reinstate an association or clear concerns. Subsequent readers
are exposed to the reasons actually delivered. Inventory-only address lists remain distinct.

A new Q-O probe withdraws the organizer's association while adding a new association to the
unchanged mechanical item. A separate variant also explicitly restores use of the earlier
interpretation through a new addition. Original items, method guarantees, prior displacements
and captured answers remain unchanged. This accepts the existing withdrawal/addition lifecycle;
it does not introduce a supersession relation to an independent replacement association.

The authored unification checker now exercises renewal history through exact/scope/excerpt/result
access, notices and repeated reuse, plus organizing-use renewal/restoration. Twenty-eight malformed
cases are rejected, including forged or incomplete history and missing/altered disclosure. Governing
and product files remain unchanged; native adapter integration is still unverified.

Verification: all unification, partition, additions, acquisition, guidance, composition/selector
checks and diagram regeneration pass; working-note file links and fixture JSON validate.

## 2026-11-13 — All existing mechanical information, migrated in stages

The human agreed to option 3: include all currently supported mechanical architectural information
in the plan, implemented and verified in stages. Start with module discovery/exports and actual
mechanical reads of retained naming; continue through dependencies/remaining module information,
organization, and integrated agentic verification. Mixed old/new representation is an intermediate
state. This does not require rewriting provider algorithms or replacing suitable physical storage.
The human's follow-up asks how common entities affect current storage and lookup; implementation
layout is not settled by this scope agreement. Provider-output suppression remains a separate,
deferred host policy; repeated contributions retain visible renewal history.

## 2026-11-13 — Record entity storage and lookup boundaries

At the human's request, recorded the source-inspected distinction between immutable record
storage/exact retrieval, provider/common identity and reference bindings, and finding qualified
information about an entity. Existing records point to single identifying claims; the proposed
entity-facing contract obtains descriptions through associations with standing and qualification.
Exact identity resolution remains valid within the Session after identification withdrawal, while
name matching remains qualified and potentially ambiguous. No parallel architectural entity
registry is intended. Physical layouts, classes and indexes remain implementation choices;
search scope and historical-name handling need precise contracts. The proposal links the inspected
record, store, binding and subject-resolution code. No product or governing files changed.

## 2026-11-13 — Keep architectural decisions distinct from implementation choices

The human asked to record the clarified boundary. The prior pre-draft checklist was too broad:
not every nested-result bound, delivery limit, role spelling, schema field or migration subtask
requires architectural settlement. Decide retained meaning, investigator guarantees, consumer-visible
information and promised capabilities here. Leave implementation mechanisms free within those
requirements; consequential changes still follow the decision workflow.

The proposal and consolidation now narrow pre-draft questions to partial/unsuccessful result
semantics, first-delivery capability/verification and remaining semantic ambiguities. The fixture
contract guide explicitly distinguishes architectural requirements, illustrative implementation
choices and deferred capabilities. Executability does not promote every probe detail into a
requirement. No fixture, product or governing behavior changes in this documentation pass.

## 2026-11-13 — Levels of unsuccessful or inadequate investigation

The human separated failure to obtain an investigram (including agent connectivity/authorization
and mechanical file-read failure) from inadequacy in returned information. Known inadequacy can
come from PostCode detecting an unrepaired unmet contract or from the producer reporting inability.
Receipt, structural acceptance, request fulfillment and substantive correctness must remain distinct.
A valid, contract-fulfilling, reportedly successful result can still be wrong without PostCode knowing;
there is no general acceptance test for that. Later discovery can use existing challenge/association
and reconsideration mechanisms, but discovery is not guaranteed.

The human reconfirmed deferring user-reported objections and pushback-driven investigation.
A suspected error would not establish incorrectness or automatically displace information; future
handling and propagation policy remain separate work. Existing developer/research feedback is not
investigator-directed pushback. Notes record these distinctions without adding a reporting schema,
new acceptance gate or fixture/product behavior. Partial-result designation details remain to fit
the agreed distinctions.

## 2026-11-13 — Process accepted contributions normally despite incomplete fulfillment

The human agreed: “if we receive an investigram, we retain and process all its content normally.
the fact that the investigation didn't achieve everything we hoped for doesn't invalidate things
that it does achieve”. Ordinary data-integrity acceptance remains required; the agreement concerns
accepted information, not retaining malformed data. Content and association declarations receive
normal processing and effects, while known inadequacy and request fulfillment are reported
separately. No special partial-result retention or suppression mechanism is introduced.

The proposal and consolidation now mark this retention question resolved. Outcome fields, result
packaging and repair sequence remain implementation choices preserving those distinctions. This
is a notes-only agreement, not a change to governing documents, product code or fixture behavior.

## 2026-11-13 — Mechanism delivery versus initial product offering

The human corrected the proposed “required investigation” framing. The journey helped design the
mechanism; the implementation deliverable is the mechanism itself, including the already agreed
mechanical migration. In practice include a small set of plausibly useful capabilities that exercise
and validate varied subjects/relationships, qualifications, follow-up, correction and enough content
for selected diagrams. Do not choose contrived capabilities merely to fit the mechanism, but do not
turn validation selection into choosing the initial user-facing offering either.

The proposal and consolidation now distinguish this validation repertoire from a mandated journey
or product catalogue. Cockatiel admission/trial and composition remain worked examples and candidate
scenarios. Concrete validation choices are planning/implementation work preserving coverage and
independent Session-lifetime verification. No new production behavior or fixture changes follow.

## 2026-11-13 — Plausible usefulness, without proof of user value

The human clarified that the validation capabilities need only be plausibly useful; proving user
value is not required. Main's updated upcoming-work note separates ACCOUNT validation from SLICE,
which will select the initial user-facing graphical offering. Merged that update into this branch
and aligned the proposal and consolidation. Credible investigative purposes and mechanism coverage
remain requirements; evidence of product value does not become an acceptance gate for this plan.

## 2026-11-13 — One concept and controlled mechanism coverage

The discussion distinguished investigations from capabilities, then narrowed the selected concept
to state-dependent behavior with state-diagram content. Entity/relationship descriptions are part
of the common mechanism. Interaction and composition remain useful design probes, not required
implemented concepts. We are exercising the mechanism, not testing breadth of interpretive ability.

Optional agent actions cannot supply reliable test coverage through spontaneity alone. The agreed
plan requirement is a few live-agent runs to check that the real integration works, plus controlled
dialogs to provide mechanism coverage. This includes follow-up options, diagram recommendations,
reported inability, addition/supersession/withdrawal and reuse of earlier content. Test harness and
mocking details remain implementation choices. Plausible usefulness constrains the capability and
outer queries; deliberately constructed responses are appropriate for targeted mechanism checks.
The proposal and consolidation record this scope without prescribing a test implementation.

## 2026-11-13 — Strategy agreement on the usefulness sanity check

The human reports that the strategy agent agrees: “plausibly useful” serves as a sanity check on
the representative architectural application, not a separate acceptance criterion. ACCOUNT
implements and validates the mechanism using recognizable architectural content; controlled
dialogs establish mechanism behavior, while a few live-agent runs check integration. Neither
establishes the usefulness of an initial investigation offering. SLICE selects that offering
using the demonstrated capabilities and limitations. No update to upcoming-work.md is needed.
The proposal and consolidation now state this distinction explicitly.

## 2026-11-13 — Analysis content and explicit diagram contracts

The human chose “Analysis content” over “Investigation content” for substantive investigram content,
including mechanical findings. This is agreed terminology for the proposed model, pending governing
adoption. The human also clarified that the additional contract-validation case is to return a
diagram, not propose an architectural design.

Use a state-diagram requirement within the selected concept to exercise explicit result contracts,
distinct from spontaneous presentation recommendations: successful fulfillment, otherwise valid
content with the requirement unmet, and producer-reported inability. Preserve normal processing of
accepted contributions and separately report fulfillment. Request packaging, rendering integration
and exact test mechanics remain implementation choices. Updated the proposal and consolidation.

## 2026-11-13 — A real diagram catalogue entry in this plan

The human agreed to include one real state-diagram type, its input contract and a minimal renderer,
rather than defer all actual diagrams to SLICE. Planning specifies the notation and bounded semantic
coverage. Injectable catalogues remain a possible test technique, but registration/dispatch tests
alone do not establish that retained content carries the meaning needed for a recognizable diagram.
This commits to a concrete validation artifact, not a polished presentation system or initial
product catalogue. SLICE may select, refine, supplement or replace the diagram.

## 2026-11-13 — Projection as outer answer, designations as engine information

Claude's review exposed an unstated relationship between existing Projections and query-result
entities. The human clarified that Subject/Lens/Projection/Presentation/View are outer concepts,
while the investigation/investigram mechanism is the engine. Agreed: preserve both levels. Lens
methods select qualified engine information into immutable Projections, with no required one-to-one
Lens/investigation/investigram mapping. Query-result entities and designations organize engine
information; they do not replace Projections.

Exact answers remain fixed. Fresh selection may produce another Projection. Existing qualified-
answer identity rules remain, distinguishing meaningful selected content, support and history
without automatically importing incidental invocation identity. Preserve provenance and payload
consistency. Drafting must check this mapping against existing contracts and raise concrete conflicts.

Updated the proposal and consolidation and removed stale scope questions from fixture result
packaging. Replaced the generic semantic-ambiguity placeholder with the review's specific remaining
discussion points: name-search scope, meaningful result ordering/nesting, exposure-rename scope,
and early vertical validation before completing mechanical migration. These remain discussion
items, not newly adopted choices.

## 2026-11-13 — Early producer boundary, historical names and exposure rename

The human agreed to early vertical validation and suggested an internal producer interface so the
mechanism can be tested before real-provider migration, using multiple test producers for cross-
producer cases where needed. Recorded a producer/contribution boundary without prescribing identical
mechanical and agentic execution protocols or concrete interface design. Real integration still
occurs early, before completing mechanical migration.

The human requires historical/displaced-name lookup, routinely or on request, so a remembered name
can locate the entity rather than simply disappear. Preserve match standing, ambiguity, coverage and
access to current identifying information. Presentation and continuation/confirmation are interface
policies; name matching itself does not prove identity or a rename.

The human approved exposure-index terminology throughout affected governing documents, APIs and
code as part of the semantic migration. Distinct evidence citations/support are not renamed.
Meaningful result ordering/nesting remains to be explained; no new decision on that was recorded.

## 2026-11-13 — Close result-ordering question

The human clarified that an investigram atomically captures claims, whose placement does not imply
ordering. The prior discussion had inflated result-member ordering into an apparent design issue
without a concrete requirement. Claims retain explicit qualifications and any stated temporal or
dependency semantics; amendments have explicit declaration relationships. A result designation can
select contributions from different investigrams without ordering their claims. Recorded this
clarification and closed the question: incidental packaging remains implementation work, with no
additional generic ordering or nesting mechanism required.

## 2026-11-13 — Partial order between investigrams

The human corrected the emphasis: investigrams themselves are timeless qualified statements, not
just bundles with unordered members. More precisely, their directed exposure/provenance/amendment
relationships define a partial order. Recorded contribution ancestry without a total ranking of
claims: later production alone gives no precedence; exposure does not assert reliance; amendment
acts through associations rather than mutable investigrams. Shared provenance and ordinary content
references do not by themselves establish ancestry. Acceptance chronology still serves delivery
and later-change semantics, distinct from authority or architectural time described in the content.

## 2026-11-13 — Re-review terminology and partial-order clarification

Claude's follow-up review found the earlier discussion points resolved and the design ready for
a planning package. Two drafting cautions were clarified now: reserve Projection for the outer
application answer, using context selection/delivery for engine acquisition; and describe the
investigram ancestry partial order as explanatory rather than a new structure to build. Existing
relationship records and their particular acceptance/propagation rules remain operative. No generic
acyclicity validator over every investigram link follows. Updated the proposal and consolidation;
no fixture or product behavior changed. Decision supersession mappings and carrying necessary
context into the package remain drafting work.

## 2026-11-13 — Application access to contribution relationships

The human clarified that the implicit/explanatory partial order must not hide its underlying
relationships from the application and UI. Recorded qualified application access to explicit
exposure, provenance, amendment and reconsideration-cause information with exact references.
Answer-relevant information accompanies the answer; further history can be acquired separately,
without requiring every Projection to embed the whole dependency history. UI display choices
remain outside this scope. Exposure is not reliance, and chronology is not a substitute for
explicit relationships. No new partial-order subsystem follows.

## 2026-11-13 — Relationship representation is an implementation choice

The human refined application access: relevant relationships may be mapped onto application-level
items rather than exposing raw engine records. No further decision to hide or expose investigrams
as a specific API object is needed. Their distinction from Projections is already established;
implementation chooses direct or mapped representations while preserving relationship meaning,
qualification, precise traceability and exact access. Avoid attributing a contribution-specific
relationship to the whole answer or presenting exposure as reliance. Revised the prior access
paragraphs so they no longer prescribe exposure of underlying records or a new application model.

## 2026-11-13 — Supporting-note terminology cleanup after clean re-review

Claude's follow-up reports all checks passing and the design ready for planning. Cleaned remaining
engine-context uses of “projection” in the walkthrough, fixture contracts, payload tour and supporting
READMEs. Actual application Projections retain that term. Existing fixture helper/report identifiers
are explicitly described as local context-delivery implementation names, not architectural terms or
product API commitments; no fixture behavior or generated data changed. No planning package started.

## 2026-11-14 — Existing agentic capabilities join the migration

The fresh review identified the missing treatment of existing agentic Lenses and their retained
results. The human expressed agreement with migrating those capabilities. Recorded this working
scope in the proposal and consolidation: preserve the questions and qualified outputs of summarize,
explain, decompose and examine, prior-result investigation and inspection/status access, using the
common contribution/association mechanism rather than a permanent legacy correction regime.
Drafting must specify cut-over and observable selection/status changes. This does not silently
resolve the review's separate renewal, fresh-selection or multi-producer exposure questions.

## 2026-11-14 — Mechanical wrapper does not renew on incidental recomputation

The human agreed to separate the mechanical method's finding from the wrapper's decision to
contribute organizing declarations. Equivalent recomputation reuses established qualified content
even when its association was displaced, without automatically adding a new association. A cache
miss or unrelated provider execution must not undo organizing decisions. Changed inputs/methods/
findings may warrant contributions; deliberate reassertion would need an explicit organizing action.
No analyzer exposure is invented by host reuse. Method-specific answer selection and standing
disclosure remain to discuss. Marked the existing automatic-renewal adapter/branches as superseded
design evidence pending fixture alignment; no executable behavior was changed in this notes update.

## 2026-11-14 — Mechanical-answer application boundary

The human distinguished Lens answers from mechanical contributions, then clarified the remit:
this mechanism preserves findings with method, basis and qualifications, retains association
standing/history and makes the information available to the application. Displacement does not
rewrite findings or automatically renew associations. How a specific Lens uses and presents this
information belongs to application contracts; no new mechanical-specific selection/warning
mechanism is required here. Existing guarantees remain migration constraints, with concrete
conflicts surfaced rather than silently resolved. Updated the proposal and consolidation and
closed that discussion item; fresh-result selection remains a separate review question.

## 2026-11-14 — Fix fixture exposure attribution to investigram production

The human clarified that each investigram captures its production exposure at creation; atomic
acceptance does not merge independent producers' histories. Fixed the authored model rather than
introducing a new per-item dependency policy. Q-M now has host-captured exposure separately for the
source-only mechanical contribution and the agentic organizer, including actual delivery of the
mechanical item to the latter. Shared-production contributions retain their common input history.
Propagation, designation generating causes and fresh disclosure follow the delivered owner;
invocation totals are report summaries, not inheritance sources.

Added explicit direct-item access to isolate mechanical content from its organizing association;
routed excerpts still require their association route. Regression checks show that an agent-only
input displacement affects the organizer and its readers, not the mechanical finding or its
exact-content reader. A second branch supplies retained input to the mechanical producer and
verifies forward propagation through the finding to the organizer. Captured histories/answers
remain unchanged, and fresh informed delivery respects the existing timing rule.

All authored checkers pass: partitions/lifecycle (72 malformed cases), additions (26 plus 4
historical cases), acquisition (26), guidance (26), composition (5 payload and 9 selector cases),
diagram/legend checks, and unification (38). A deliberate in-memory simulation of the old shared
invocation exposure fails the new mechanical-isolation assertion. Reports regenerated; sorted an
existing set-based report iteration to keep those outputs reproducible. These are fixture checks,
not live or product verification. The separately superseded automatic-provider-renewal branches
remain marked pending alignment; this change addresses production exposure only.

## 2026-11-14 — Equally standing result alternatives must both be supplied

The human corrected the suggestion that Lens code could choose between competing designations:
where neither has priority, PostCode should use both. Recorded the fresh-result rule: supply the
equally standing alternatives with distinct membership, qualification and provenance, without
choosing by recency or merging them into a synthesized claim. Exact/explicit selection is narrower.
An agent can be supplied or offered both and choose for its own inquiry based on provenance or
context; this does not change the alternatives' standing or invent a global priority. The rule is
an application mapping constraint, not merely a guarantee that both are stored somewhere.

## 2026-11-14 — New retained information flags reconsideration, not automatic reruns

The human confirmed the existing reconsideration mechanism as the response to relevant new
information. Clarified reuse: accumulation alone does not change request identity or force another
investigation. Matching additions affect acquired inventory/selection scopes; displacement can
affect actual exposure or designated membership. Causes propagate without automatic rerun or
invalidating reuse. Exact description access does not subscribe to all future entity information.
Explicit request inputs remain distinct from engine-selected/acquired context, whose actual delivery
is production provenance/exposure. Updated the ambiguous seed-context wording; no new cache or
reassessment mechanism is introduced, and exact historical answers remain fixed.

## 2026-11-14 — Entity and Query result remain distinct

The human chose separate concepts: Entity denotes an identified thing in the system under study;
Query result organizes answers to a particular invocation. Both use shared identity/reference and
association machinery, without introducing a named “Association Target” umbrella. Reconsider a
blanket term only if repeated usage makes it helpful. Redesignation remains useful for preserving
question-specific answer organization instead of inferring it from all information about the
architectural subjects. Broader Entity terminology with a kind property was considered but would
still require the distinction; shared internal representation remains an implementation choice.

Updated the proposal, consolidation and current supporting prose. Existing fixture `entities`,
`resultEntity` and target-field spellings remain explicitly described as shared storage encodings,
not conceptual Entity classification or product API requirements. No executable behavior changed.

## 2026-11-14 — Milestone reviews, without a mixed-mode product requirement

The human confirmed review checkpoints as a primary purpose of milestones and corrected the
assumption that migration needs a supported mixed-state behavior contract. An implementation may
break callers temporarily while conforming them to changed core machinery, or retain old machinery
until the replacement is ready. Those are implementation strategies, not architectural requirements.
Keep the full migration endpoint and milestone reviews. State what each stage completes and verifies,
without requiring a fully usable intermediate product or adding compatibility machinery merely to
keep every stage working. Final verification must cover the agreed complete capability set.

## 2026-11-14 — Confirm referent-based discovery in first delivery

The human confirmed that discovery through explicit referents was already intended and is an
important purpose of referents. Made first-delivery scope explicit: an investigator can discover
a contribution referring to its subject even when the contribution's descriptive association
concerns another Entity, without a known address/navigation origin. Qualified acquisition remains
separate from discovery; no semantic search or automatic content delivery is implied. Recorded
the current fixture's missing coverage as a validation gap, not an unresolved inclusion decision.

## 2026-11-14 — Identification vocabulary and baseline initial context

The human agreed to initial context containing all non-displaced identification-role associations
for each subject Entity. Preserve the supplied alternatives, qualifications, provenance and status;
record selection-scope exposure. Reconsideration is not displacement, and does not silently remove
an association. Broader topical information remains available for acquisition rather than being
implicitly delivered. This baseline is for Entities, not a rule that recasts Query results as Entities.

The preceding discussion clarified local addressing: every association has a key, including
identifications and result designations; its exact identifier is the owning investigram plus that
key. PostCode-understood purpose is separate. The role name is identification; it requires a readable
name/designation plus qualified identifying information, distinguishing generated labels from
source names. Several identifications of one Entity can coexist. Other topical information may use
meaningful agent-chosen local keys, without adding a separately identified topic system. Recorded
these agreements in the primary notes and marked fixture vocabulary/baseline alignment outstanding.


## 2026-11-14 — Align identification baseline and provider re-encounter probes

Aligned the working fixtures and contracts with identification vocabulary: `identification` is the
recognized identifying role; other topical associations use `topic` plus their own meaningful local
keys. Every association keeps its exact owner/key address. Identifying content requires a readable
designation and qualified distinguishing information. Assigned labels are not implicitly source names;
mechanical identification can provide the source path without invented prose.

The initial Circuit Breaker request now receives the all-non-displaced-identification baseline.
A dedicated probe covers multiple subjects, coexisting identifications (including differently keyed
ones from one producer), exclusion of displaced associations, preservation of reconsideration-marked
ones, empty scoped selection, later identification additions and exact historical delivery. Other
acquisition controls deliberately retain narrower inputs; they are not alternative initialization
policies. Baseline scope exposure observes additions without subscribing to every topical association.

Also completed the previously agreed no-automatic-renewal alignment: equivalent provider recomputation
reuses the established identifying association even after displacement. Its history remains available,
its current standing stays unchanged and no analyzer delivery is invented. Removed automatic renewal
history machinery. Explicit investigator withdrawal-plus-addition/re-adoption remains distinct.

All authored checkers pass: lifecycle (72 malformed cases), additions (26 plus four historical-policy
negatives), acquisition (26), baseline (14), unification (33), guidance (26), composition (five) and
nested selectors (nine). Diagram sources/legends still match in both partitions and composition.
These are authored mechanism probes, not live-agent, native-provider or product acceptance. Updated
primary notes and supporting contracts; governing and product files remain unchanged.


## 2026-11-14 — Diagram requirements use existing contracts

The human agreed that existing result/Presentation contracts cover the review's diagram concern.
Investigation requirements concern supplying qualified diagram-compatible content; application
presentation checks and failure outcomes concern rendering it. Valid partial content is retained
normally, and rendering failure does not invalidate it. A later result designation cannot inherit
the original answer's diagram compatibility: check its selected content under the existing contracts.
Recorded this in the proposal and consolidation, without adding a fulfillment mechanism, renderer
placement prescription or UI design. This resolves D2's contract-boundary question and B3's related
redesignation/diagram-compatibility case; detailed governing mappings remain drafting work.


## 2026-11-14 — Defer concept-driven investigation availability

The human agreed to defer using architectural classifications to determine Lens applicability or
available investigations. This may connect to follow-up options: concept-to-investigation knowledge
could live in PostCode, in agents, or in both. The current capability retains qualified classifications
and follow-up options without requiring that ontology or making classifications automatic eligibility
rules. Agents may already use classifications as context for their suggestions. Recorded the deferral
in the proposal and consolidation; no fixture or product change is needed.


The human clarified that automatically enabling/disabling operations goes beyond suggesting
follow-ups. Separated those concerns in the current notes: where suggestion knowledge lives is
one future choice; using classifications as eligibility rules is another, stronger choice. Neither
follows automatically from the other. Existing agent-authored follow-up options remain in scope.
