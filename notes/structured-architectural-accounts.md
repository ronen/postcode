# Structured architectural accounts: working exploration

Started: 2026-11-09

Exploratory, non-governing notes. Recommendations below are discussion proposals,
not accepted decisions or implementation authorization. No draft planning package
has been requested yet.

For the consolidated current direction, start with the
[working proposal](structured-architectural-accounts-proposal.md). This discussion
record includes earlier alternatives later revised, particularly account-scoped
identity, eager relationship-subject creation and a facade over legacy subjects.
The [concrete walkthrough](structured-architectural-accounts-example.md) tests a
provisional arrangement without adopting it.
Its second-review revision explicitly assigns context selection and working-answer
assembly to the caller, separates new role definitions, and clarifies qualification
delivery and evaluation-wide exposure. These remain provisional example choices.

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
