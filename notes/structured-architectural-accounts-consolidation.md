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
| Exposure index | Organizing entities/query results plus exact association uses actually delivered. Current product `citation` indexes remain investigram-based until an adopted migration. |
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
Captured answers and exact delivered projections
```

An entity/role target denotes a category of information. It is not a single value slot.
Exact displaced-association references are additional to the target. The new declaration's
owner and the referenced content's owner may differ. Original qualification remains with
the original content; the new association has its own attributable grounds.

### Derived/access information

```text
Association standing: displacement links and competing declarations
Entity projections: explicit selected information with qualifications and notices
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
| Context projection | Captures actual delivered material, original qualification, source provenance and applicable notices. An ID or human browsing is not exposure. |
| Reconsideration | Derived cause-specific warning, not proof of wrongness or automatic withdrawal. |

The fixture provisionally requires same-target supersession, historical displacement
targets and full delivery of the targeted declaration/members. These rules need review;
they are not hidden consequences of the word association.

## Exposure and result membership

Supplying entity S means supplying a selected qualified projection, not its ID or a
canonical definition. Selecting a portion of Q's result and delivering it records
exposure to RESULT-Q. Record the exact portion, not future associations of that entity.
The selected text/node need not become another entity.

A result can need reconsideration because its producer received subsequently displaced
information. It can also need reconsideration because a constituent association was later
displaced—even when its producer created that entity and never received it as context.
The second route is designated membership, not fabricated exposure or the fixed child tree.

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
Addition policy, received-cause exemptions, clearance and reassessment remain open. The fixture
still exempts producers from their own causes. Identifying content newly established from the
pinned basis need not copy irrelevant source behavioral restrictions; original reused content
retains its qualifications, while new scenario examples carry their own applicable limits.

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

Before drafting: settle identity/migration depth, result designation shape, support selection
and delivery bounds, addition/exposure precision, cause exemptions/reassessment, declaration
challenge/reinstatement, and first-delivery scope. Entity merge/split remains a separate
qualified identity probe; association displacement does not automatically merge IDs or
redistribute their histories.

The [checkers](structured-account-example/README.md#verification) validate authored references,
qualification delivery, atomicity, exact history, declaration lifecycle, conservative
reconsideration and diagram/selector inputs. Their source judgments are not mechanically
proved. No live investigator, supported product API, general cross-investigram renderer,
performance bound, persistence or migration is demonstrated. The plan must explicitly
revise the governing correction/exposure model before implementation.
