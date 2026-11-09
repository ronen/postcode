# Structured architectural accounts: working exploration

Started: 2026-11-09

Exploratory, non-governing notes. Recommendations below are discussion proposals,
not accepted decisions or implementation authorization. No draft planning package
has been requested yet.

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
