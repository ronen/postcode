# Investigram structure: consolidation checkpoint

Updated: 2026-11-12

Current exploratory model, not an adopted schema or product behavior. The
[proposal](structured-architectural-accounts-proposal.md) states scope, consequences and
open decisions; [fixtures](structured-account-example/README.md) now exercise the new
direction. Prior discussion remains in the [historical notes](structured-architectural-accounts.md).
Governing documents still describe whole-investigram correction.

## Center of the model

Entities organize qualified information. Queries request information. Investigations
contribute content and association declarations; investigrams preserve those contributions
and their provenance. A query's result has an entity identity through which original and
later designated answers can be organized. It is not the query, and Q identifies a particular
invocation, not a recurring question.

An investigram is never globally superseded in this proposed model. Later declarations can
displace particular associations, including the designation of an earlier query's result.
Its original information, names, evidence and metadata remain attributable to it. An exact
captured answer remains fixed. Fresh access can disclose later declarations and select
other information explicitly.

There is no single canonical definition per entity. Several descriptions, scopes and
conflicting interpretations can coexist. Identity/reuse does not establish agreement,
unique discovery, or equivalence of independently allocated entities.

<a id="working-vocabulary"></a>
## Working vocabulary

| Term | Meaning |
| --- | --- |
| Entity | Identified thing around which qualified information is organized; the proposed kinds include architectural things and query results. |
| Subject / referent | Roles: what an investigation concerns; what a reference denotes. |
| Query invocation | One request with captured subjects, parameters and context. Its result identity is separate. |
| Investigram | Immutable, qualified contribution bundle from an investigation. Not the default context or supersession unit. |
| Account | Ordinary language for information provided by PostCode; no additional Account object. |
| Content item | Keyed item within Interpretation content. Identity of content is not identity of the described entity. |
| Content type | A supported kind of content item in a defined, extensible catalogue. |
| Content-type contract / schema | Required data, semantics, qualification and reference rules / mechanically checkable shape within that contract. |
| Architectural concept | Vocabulary for framing interpretation, not a required representation or diagram. |
| Architectural relationship | Relationship in the described architecture. It may itself be identified as an entity, without making every edge one. |
| Content association | Qualified use of content for a target entity and information role. |
| Association specification / declaration | Submitted specification expressing addition, supersession or withdrawal, attributable to its producing investigram. |
| Investigram relationship | Qualified comparison of investigations/accounts, such as reported inconsistency. It does not silently displace associations; whole-bundle correction is replaced by declarations in this proposal. |
| Follow-up option | Available investigation associated with exact originating metadata; atemporal availability, not implied priority. |
| Presentation recommendation | Judgment of usefulness, not permission to render compatible content. |
| Context delivery | Exact material supplied, including ownership, basis, qualification and completeness. |
| Association exposure | Exact association uses/content actually delivered, retaining route, source qualification and generating provenance. |
| Inventory/selection-scope exposure | Dependency on an acquired availability inventory or content selected by an explicit scope, with coverage and actual delivery position. A scope-selected delivery need not present a separate list; bare entries do not deliver listed content. |
| Exposure index | Indexes actual content and inventory deliveries, with entity/query-result IDs organizing access. Qualified guidance and reason delivery also retain source exposure. Product `citation` indexes remain investigram-based until adoption. |
| Support | Attributed grounds for a claim, not inferred from delivery alone. |

Qualified information is a broad description, not another record kind. “Metadata” does
not imply mechanical truth or exemption from evidence obligations. Content associations,
withdrawal reasons and result organization can be the substantive interpretation.

## Three ownership maps

### Submitted investigation contribution

```text
Invocation Q and its allocated result entity RESULT-Q
  Contribution pool of investigrams
    Content items, referents, qualifications, evidence
    Association specifications
      addition / supersession / withdrawal
      target entity + information role
      exact content/declaration members where applicable
      exact earlier associations displaced
      reason and attributable grounds
    Follow-up options and presentation recommendations
    Fixed local child links, arranged as a forest
  Local entity introductions and references to existing identities
```

Acceptance resolves local IDs, validates all declarations and references, and retains
atomically. The result entity is allocated with the invocation; architectural entities
are introduced through qualified identifying content. Existing mechanical identities
retain provider guarantees. Own-result/earlier-result targets use the same entity mechanism.
The `result` role applies if and only if the target is a query-result entity.

### Retained information

```text
Entity identities and introduction provenance
Query invocations and their generating/delivery history
Immutable investigrams
  Original items, declarations, qualifications, evidence, guidance, child links
Association indexes by entity + role
Query-result designations with explicit member references
Captured answers and exact delivered content projections
Separately acquired inventory snapshots with scope, coverage and delivery position
```

An entity/role target denotes a category of information. It is not a single value slot.
Exact displaced-association references are additional to the target. The new declaration's
owner and the referenced content's owner may differ. Original qualification remains with
the original content; the new association has its own attributable grounds.

### Derived/access information

```text
Association standing: displacement links and competing declarations
Entity projections: explicit selected information with qualifications and applicable context disclosures
Inventory acquisition: scoped availability, without implicit content delivery
Result membership: exact declarations/items, never implicit current substitutions
Reconsideration causes on evaluations and exact result designations
Validated diagram inputs and rendered diagrams/legends
```

No global investigram superseded flag is derived. A new declaration can reference old
content without copying it. A rare declaration-only investigram is meaningful when its
qualified organizing assertions are meaningful; no filler prose is required.

## Ownership and effect audit

| Responsibility | Owner / effect |
| --- | --- |
| Architectural content | Original investigram owns exact items and applicable qualification. New wording needs new content. |
| Addition | Producing investigram owns a new association. Existing associations coexist. |
| Supersession | Producing investigram owns a new association explicitly displacing earlier associations, not their owner bundles. |
| Withdrawal | Producing investigram records displacement without replacement members. Old content and other associations remain. |
| Result designation | Association targeting a query-result entity. Can include exact items/declarations originating elsewhere. |
| Child composition | Fixed submitted-bundle structure; not result membership, current answer selection, exposure or architectural containment. |
| Follow-up option | Exact producing metadata remains owned by its investigram. Access through a result/entity does not retarget or transfer it. |
| Presentation recommendation | Original usefulness judgment; selecting a different compatible diagram changes no retained record. |
| Context projection | Captures actual delivered content, original qualification, source provenance and applicable disclosures. A subject ID or human browsing is not exposure. |
| Inventory delivery | Captures availability scope/coverage and time separately. Matching later entries may affect selection; listed content is not supplied merely by appearing. |
| Reconsideration | Derived cause-specific warning, not proof of wrongness or automatic withdrawal. |

The fixture provisionally requires same-target supersession, historical displacement
targets and full delivery of the targeted declaration/members. These rules need review;
they are not hidden consequences of the word association.

## Exposure and result membership

Supplying entity S means supplying a selected qualified projection, not its ID or a
canonical definition. Selecting a portion of Q's result and delivering it records its exact
association/designation route under RESULT-Q, not every association of that entity. Receiving
an inventory is separate, with its own scope and timing. The selected text/node need not
become another entity.

A result can need reconsideration because its producer received subsequently displaced
information. It can also need reconsideration because a constituent association was later
displaced—even when its producer created that entity and never received it as context.
The second route is designated membership, not fabricated exposure or the fixed child tree.
A third route is availability/selection scope: a later matching entry could have changed an
acquired inventory or the content selected by an explicit scope. A description acquired by
exact reference or fixed result membership does not establish that scope dependency.

The executable prototype tracks exact delivered association uses. Entity identity alone
cannot expose an evaluation to information created later. Item excerpts record their route;
sharing an item through another association is not a displacement warning. Generating-context
provenance remains conservative across a producer's contributions, without making the entire
entity's future information part of an old delivery.

Status is keyed by designation: `displacedBy`, `membershipCauses`, and
`generatingEvaluationCauses` remain distinct. `needsReconsideration` combines the latter two,
not the mere fact that the designation has a successor. A new designation is not flagged by
its own creation; unrelated later concerns still apply. Fresh status never rewrites the
captured original answer.

Redesignating an earlier result requires its declared question/scope, subjects, parameters
and operation/option in context, captured in `queryMeanings`. It is optional. Other containing
designations receive fresh notices/status rather than automatic redesignation. No investigation
must maintain every result that references an affected association.

Supersession for fuller coverage and withdrawal can trigger review without asserting falsehood.
Known causes accepted before an actual delivery are disclosed context, not later-change
warnings. This covers direct exposure, designation concerns and inherited producer concerns.
A fresh projection must disclose all those applicable causes; missing/altered disclosure is
rejected. Notice receipt is awareness, not adequate replacement evidence or endorsement.
New designation membership retains already-displaced standing without treating it as a new
change. A prior acquisition can still affect its producer, even if the query finishes later.
Later refresh does not clear that earlier warning. Historical statuses remain intact.

The fixture records host-assigned acceptance positions and delivery-state positions; these
are ordering aids, not proposed public timestamps or agent-supplied exemption claims. General inventory
coverage, clearance and reassessment remain open. Producers still exclude their own causes. Identifying content newly established from the
pinned basis need not copy irrelevant source behavioral restrictions; original reused content
retains its qualifications, while new scenario examples carry their own applicable limits.

Renewed assertions need no reinstatement operation: after B supersedes A, C may supersede B
using A's original content, retaining its provenance and qualifications and supplying C's own
grounds. A stays displaced. After withdrawal, C may add a new association to the earlier content.
D may later disagree with C through another supersession or withdrawal. Normal acquisition and
eligibility apply; historical causes and result designations are not cleared or restored.
General declaration revocation/reinstatement is deferred. See the
[working agreement](structured-architectural-accounts-proposal.md#renewed-association).

Competing undisplaced associations remain available and are both included when acquiring current
descriptions in scope, with qualified grounds and support. Recency does not pick a winner. Exact
requests remain narrower and fixed result memberships do not expand automatically. With sequential
investigations, C acquiring A after B superseded it receives disclosure of B and can acquire the
support needed to supersede B explicitly. Deliberately leaving B standing remains valid; parallel
execution is not required to explain the competing fixture. See the
[working agreement](structured-architectural-accounts-proposal.md#competing-associations).

<a id="catalogue-responsibilities"></a>
## Catalogue responsibilities and diagrams

| Catalogue responsibility | Purpose |
| --- | --- |
| Architectural concept guidance | Meanings, investigative distinctions, examples and references. |
| Content-type contract | Required data, semantics, qualification, references and partial/unknown cases. |
| Diagram-type input contract/mapping | Compatible inputs and their known mapping to a diagram and legend. |

One concept can have several representations; one item can express several concepts.
Entity references share identity; exact qualified item references share assertions.
The supported catalogue is extensible, but an investigator cannot invent an understood
content type just by naming it. Prose is a supported structure, not an unqualified escape.

TRIAL-1's state diagram binds `recovery`; the sequence binds `concurrent-callers` and
follows its existing `stateContent`/`transition` references. No duplicate state-model
binding or renderer-invented dependency. Both diagrams render unchanged with recommendations
removed. Legends preserve conditions, qualifications and source mappings. Presentation
retrieval, arrangement and UI remain outside this remit.

## What the current examples show

Q1 introduces state categories and an incomplete admission account. Its result designation
includes the entity associations. Q2 receives RESULT-Q1's selected qualified information;
it adds trial content, supersedes the admission association and redesignates RESULT-Q1
while referencing unchanged descriptions. ADMISSION-1 remains unchanged. No K-style
whole-investigram correction or special replacement tree is returned.

The later expansion probe supersedes identifying information without alleging factual
error. Q1 had never received S, but RESULT-Q1 included S's identifying declaration and
therefore receives a membership cause. A consumer of RESULT-Q1 inherits it. Other probes
reuse an earlier item in a declaration-only result and withdraw that new association
without changing the original item or its other association standings. Competing
supersessions remain available.

The mixed and children partitions preserve the same behavioral models. Children can
still give descriptions appropriate qualification boundaries, but they are no longer
necessary to obtain independent association supersession or item delivery. Entity/result
exposure changes the earlier argument about smaller citation units; do not present that
argument as unchanged. Evaluation-wide provenance can still cause conservative warnings.

Composition receives selected P/S/R/B projections and returns pattern entities plus
RESULT-Q4. Exact local selectors remain valid; their context entity is RESULT-Q4. The
same architectural diagrams and assertions remain authored content.

## Open decisions and verification limits

The [revised addition probe](structured-account-example/additions.md) distinguishes exact
association content from availability/selection scope. A description supplied by reference does
not imply a scope guarantee. Initial descriptions selected by scope do carry that dependency,
even without a separate list request; `selectionScope` records the guarantee with actual delivery
time. Explicit inventory acquisition also records entity, scope and position.
The fixture lists all retained association addresses/roles in scope, including displaced ones,
without delivering their content or interpretive reasons. New matching entries affect prior
inventory recipients; exact supersession/withdrawal still affects actual association uses.

Fixed designation membership is not inventory exposure. Merely adding another description of
S does not mark a result containing an earlier description; its producer can still be affected
through an actually acquired inventory. The original by-reference seven-evaluation/eight-designation control acquires no causes from
either addition. Adding an inventory reader and consumer gives two affected evaluations/results.
This does not estimate realistic warning frequency: a [Q2 discovery branch](structured-account-example/acquisition.md)
that lists associations before retrieving content reaches 3/7 evaluations and 4/8 designations.
The earlier broad 5/7 and 7/8 comparison remains reproducible. Both partitions agree.

A qualified declaration reason supplied as context creates exact exposure to that declaration;
later displacement can affect its recipient directly. Referenced members are not delivered
or made eligible for reuse/correction merely by the reason. Fresh disclosures follow later
displacement of the supplied declaration too, without implying reinstatement of its predecessor.

Removing implicit entity-wide exposure and unsolicited addition reasons is a structural
refinement, not targeted suppression or semantic clearance. It leaves a coverage limit:
unrequested new information may matter even when no inventory dependency was established.
The human accepts that coverage limitation. General initial selection and richer inventory
policies still need bounded treatment. The contract is at the investigation boundary; dialog
tools and storage sharing are implementation choices. The broad earlier counts no longer
establish a first-delivery need for reassessment.

Investigator-directed propagation is deferred alongside targeted suppression, reassessment/
clearance and automatic scheduling. It could identify a qualified concern for an exact earlier
result that structural propagation missed. An exposure-index lookup might find candidates;
acquiring their questions, results and support would permit assessment. A candidate listing
is not an impact judgment, and a concern neither displaces earlier content nor fabricates
past exposure. No reverse-lookup API or concern declaration is implemented. See the
[proposal](structured-architectural-accounts-proposal.md#deferred-investigator-directed-propagation-reassessment-and-scheduling).

Before drafting: settle identity/migration depth, result designation shape, support selection,
first-delivery inventory coverage and delivery bounds, and first-delivery scope. Declared dependencies and investigator-directed propagation are deferred:
observe coverage gaps before choosing anticipatory dependency declarations, qualified impact
assessment when new findings emerge, or both. Either would supplement actual exposure tracking.
ADMISSION-1 already claims runtime admission coverage, which is not the same as completeness
of a retained-information selection. An added waiting case may challenge that claim without an
automatic cause when no relevant scope exposure or displacement exists. Preserve this accepted
limit and deferred test; introduce no standing coverage subscription. Carry these deferrals explicitly.
Entity merge/split remains a separate
qualified identity probe; association displacement does not automatically merge IDs or
redistribute their histories.

The [checkers](structured-account-example/README.md#verification) validate authored references,
qualification delivery, atomicity, exact history, declaration lifecycle, conservative
reconsideration and diagram/selector inputs. Their source judgments are not mechanically
proved. No live investigator, supported product API, general cross-investigram renderer,
performance bound, persistence or migration is demonstrated. The plan must explicitly
revise the governing correction/exposure model before implementation.
