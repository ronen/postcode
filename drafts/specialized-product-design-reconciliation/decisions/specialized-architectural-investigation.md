# Specialize in architectural investigation and retained understanding

Status: in review
Decided: [set on human acceptance]
Arising from: Human-directed reconciliation of foundation/product-design.md at `03f4dd23ab6f8df90df54fe9c7f2c5243c461abc`, November 2026
Scope: Product role, architectural modalities and captured bases, retained understanding and external participants; current implementation remains an implemented-architecture subset
Supersedes:

- [Define entities, subjects, claims, and relationships by their meaning](initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning), replaced by [Architectural subjects](#architectural-subjects).
- [Generalize Lens results and View composition](coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition), replaced by [Results over captured bases](#results-over-captured-bases).
- [Define request inputs and captured states](coordinated-views-and-qualified-results.md#define-request-inputs-and-captured-states), replaced by [Inputs and captured bases](#inputs-and-captured-bases).
- [Permit structured interpretation without selecting an account model](structured-investigram-content.md#permit-structured-interpretation), replaced by [Architectural interpretation](#architectural-interpretation).

## Context

The adopted [design premise](../../foundation/product-design.md#design-premise) specializes PostCode in architectural investigation and retained understanding. Larger design conversations may take place elsewhere. Direct human usefulness and comparative architectural expertise remain research aspirations; specialization does not depend on demonstrating comparative advantage.

The foundation now distinguishes implemented, hypothetical and intended architecture and permits captured bases containing participant-supplied material or earlier Projections. Current general definitions unnecessarily restrict Entity, Projection requests, Projections and Investigrams to program subjects or captured program states. Existing implementation-specific types and methods may remain narrower.

The previous [product-design reconciliation](../plans/product-design-reconciliation.md) is completed. Its human-output boundary, feedback, qualified detail and structured-content permission remain applicable. This decision neither reopens that work nor claims that all intended capabilities have been delivered.

## Decisions

<a id="specialized-product-role"></a>
### Specialized product role

PostCode supplies qualified architectural investigation and retained understanding for humans working alone or with design and implementation agents. Participants may consult, challenge, extend and compare those accounts while conducting their larger design conversations elsewhere. PostCode does not take responsibility for architectural decisions or require a conversation host inside the product. Design and implementation are agent roles, not necessarily separate systems.

Useful direct human investigation and superior architectural investigative expertise along relevant dimensions remain aspirations to evaluate. Specialization is an adopted product choice independent of whether that advantage is demonstrated. The human output boundary remains binding for human-facing interfaces, including when agents invoke them. This role neither selects a GUI nor requires a new exchange transport.

Views and Projections are read-only with respect to the program and their underlying material. Receiving participant contributions is conceptually compatible with that boundary; it does not silently rewrite an earlier basis or adopt a proposal as an intention.

<a id="architectural-modalities"></a>
### Architectural modalities and qualification

Accounts may concern **implemented architecture** (actual software, supported and qualified by implementation evidence), **hypothetical architecture** (alternatives without implied acceptance, feasibility or realization), or **intended architecture** (accepted requirements or design decisions). These modalities concern what an account is about, separately from its provenance, method and epistemological status. An implemented account may be interpretive. Exact recording of a hypothetical account does not establish feasibility, acceptance or implementation. Observed behavior is execution-scoped evidence, not a fourth modality.

Apply a Lens across modalities only where its method supports that application. Sharing an account does not imply participant agreement, and PostCode interpretation is not authoritative by virtue of publication. Preserve the provenance and history of any transition from proposal to intention.

Architectural comparisons preserve the distinct bases and qualifications of their contributions. Juxtaposition alone does not derive correspondence, conformance, contradiction or significance. Those claims require qualified core analysis and a comparison Lens. A conceptual diff between program states is an implemented-state case of that broader comparison, not its definition. No comparison capability is introduced by this decision.

<a id="architectural-subjects"></a>
### Architectural subjects

This is the successor to the whole headed decision [Define entities, subjects, claims, and relationships by their meaning](initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning). Incorporate its requirements unchanged except that “distinguishable program subject” becomes “distinguishable architectural subject”; its module and symbol examples describe implemented architecture, not an exhaustive population.

An Entity can concern implemented, hypothetical or intended architecture. Implemented entities retain the applicable language/analysis identity guarantees. Subjects introduced by hypothetical or intended accounts inherit identity and provenance from those accounts; correspondence with other accounts requires support and qualification. A supplied label does not establish cross-account identity. Subject remains an open-ended investigative role; Claim remains information asserted by an analysis result; Relationship remains a connection whose assertion has its own qualification. Addressability alone does not establish entityhood, and references alone do not establish architectural relationships.

<a id="inputs-and-captured-bases"></a>
### Inputs and captured bases

This replaces the whole headed decision [Define request inputs and captured states](coordinated-views-and-qualified-results.md#define-request-inputs-and-captured-states).

A captured basis identifies the specific material used in a Lens application. It can include program states, observations, participant-supplied architectural material or earlier Projections, with their respective provenance, scope and limitations. Preserve meaningful element roles or order and the associations needed to understand which material supports which information. Capturing material establishes neither its truth nor its agreement with other material.

A program input remains a designated source of program information, such as a repository revision, working tree, index, execution or observation stream. Its binding policy determines which state a request uses. A captured program state remains information captured from such an input, with attributable timing, scope and limitations; it need not be exhaustive or atomic. It is one possible contribution to a captured basis, not a synonym for every basis.

A Projection request designates applicable inputs, a subject, a Lens and parameter values. Execution identifies the specific material used as the resulting captured basis. Binding policies apply where the input supports them; the revision-oriented following and pinned policies retain their existing meanings. Participant material and earlier Projections do not acquire those policies by analogy. Repeating a request is distinct from presenting an exact retained Projection. A Session supplies analysis and reference context, not an input binding or proof of a complete snapshot.

Retained interpretations used as input are contributions to the broader captured basis. In a follow-up investigation, this includes the prior Investigram content actually supplied, with its provenance, qualifications, corrections and disclosed omissions. An Investigram is not thereby a Projection; earlier Projections are one permitted kind of basis contribution, not an exhaustive category for all retained material. A bare navigation reference does not imply that the referenced account's content was supplied. Delivery establishes available input, not comprehension, causal reliance or endorsement.

For an answer selecting retained accounts, the exact selected accounts and applicable correction/association snapshots contribute to the answer's basis. Keep this selection distinct from the generating investigation's input deliveries and from its captured program-state support. Neither interpretation history nor a selection snapshot becomes a program state; no following or pinned policy is introduced for them. Later selection does not rewrite the earlier investigation's inputs. This elaborates the existing [selected-answer distinction](coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes), which separates retained interpretations from captured program states without excluding them from a broader basis.

In the earlier [selected-answer continuity decision](coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes) and [exact retained-answer decision](exact-retained-answer-presentation.md#request-an-exact-retained-answer), “captured basis” listed alongside interpretations or selections denotes captured program-state support. Those clauses require preservation of both contributions; they do not exclude interpretations or selections from the broader captured basis defined here. Their preservation and no-reselection obligations remain unchanged.

Captured-basis attribution is a semantic obligation. It may be distributed across immutable records and their resolvable relationships rather than stored in one manifest. Citation identifiers alone identify exposure, not the exact supplied content or all supporting material. A Session identifier alone supplies neither. The current delivery/provenance and selection records are assessed under [Adoption and conformance](#adoption-and-conformance); this decision does not prescribe a new capture mechanism or identity formula.

<a id="results-over-captured-bases"></a>
### Results over captured bases

This is the successor to the whole headed decision [Generalize Lens results and View composition](coordinated-views-and-qualified-results.md#generalize-lens-results-and-view-composition). Incorporate its requirements in full, including Lens/operation separation, qualified reuse, View coordination, composition recording, parameter meaning and the absence of a mandatory managed-View lifecycle, with these precise extensions:

- A Projection applies a Lens to a subject and a captured basis, rather than necessarily to one or more captured program states. Requests and inputs have the meanings in [Inputs and captured bases](#inputs-and-captured-bases).
- Its selected content, method, evidence, qualification and relevant Evaluation outcomes remain attributable to the actual basis. State associations are preserved for program states; corresponding attribution, meaningful ordering and roles apply to every other basis contribution.
- Each Projection in a View preserves its captured basis, not only its program-state basis. Composition changes and replacement with a newly based result remain visible and recorded. Observation attribution covers the contributions actually used, without requiring duplication of all retained understanding.

The existing [immutable-results and bindings](coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh), [selected-answer continuity](coordinated-views-and-qualified-results.md#preserve-the-selected-answer-during-presentation-changes) and [interface boundary](coordinated-views-and-qualified-results.md#coordinate-supplied-information-without-deriving-new-program-claims) remain accepted. Their program-state guarantees are unchanged. Immutability, no silent retargeting, qualified correspondence and the prohibition on deriving new claims in presentation apply equally to accounts of hypothetical and intended architecture when supported. Request interpretation cannot independently derive architectural claims either. No broadened access to evidence or mutable store is granted.

<a id="architectural-interpretation"></a>
### Architectural interpretation

This is the successor to the whole headed decision [Permit structured interpretation without selecting an account model](structured-investigram-content.md#permit-structured-interpretation). Incorporate its requirements unchanged with these wording replacements: “artifact of program investigation” becomes “artifact of architectural investigation”; “originating program context” becomes “originating architectural context”; “program Entity” becomes “Entity”.

An Investigram still contains a qualified interpretation, not every architectural account or every supplied document. Prose, structured content and combinations remain permitted; structure does not establish truth. Interpretation content, referent information, evidence context, generating provenance and qualifications remain attributable. This replacement broadens what the originating context may concern; it does not add a separate captured-basis obligation to every Investigram. Existing evidence, provenance, context-delivery and Projection-attribution obligations remain in force. An unimplemented subject need not be assigned a fictional originating module.

The [representation-independent interpretation contracts](structured-investigram-content.md#generalize-interpretation-contracts) remain accepted, including their incorporated predecessors, completeness requirements, exact-original access, fixed composition, associations, corrections and citation exposure. Existing references to program context govern current implemented investigations; they do not exclude accounts whose referents and originating context concern hypothetical or intended architecture under the broadened definition. Current Investigator submission validation accepts an investigation result into storage; it does not accept a design proposal as intended architecture. Participant-supplied material is not automatically an Investigram or an independently corroborating source.

<a id="retained-understanding-and-context"></a>
### Retained understanding and local investigation context

The [accumulation requirement](structured-investigram-content.md#require-accumulated-understanding) remains binding and extends to access by agents as well as humans. Retained accounts and underlying Projections can be consulted, compared, reused, extended or challenged with provenance, qualifications and revision history distinguishable. They may overlap or disagree. This requires neither one consolidated model nor indefinite persistence.

Keep **investigation context** as the local term for accumulated Views, their captured bases and relevant lineage. It identifies the surrounding investigation and is not the definition of all retained architectural understanding, an observation archive, an Investigator's execution input, or a separately required domain object. The [Workspace decision](application-specification-boundaries.md#start-with-a-workspace-as-a-collection-and-arrangement-of-views) retains its obligations, including navigation-origin lineage, simple Workspace scope and deferred continuity lifecycle. Its attribution to the former foundation terminology is historical; those local requirements are not withdrawn by the foundation's changed emphasis. This is a localized clarification, not supersession of that headed decision.

Feedback and observations retain or reference enough available surrounding requests, Views, choices, bases and lineage to interpret the event. They need not duplicate complete retained architectural understanding. Keep the existing stronger local feedback contract: self-contained batches include available displayed artifacts and exact output without lookup, reconstruction or new investigation. Observation history is not restored operational state. Existing event-capture obligations, including relevant evolution of investigation context, are not removed.

<a id="external-participants"></a>
### External participants and exchange

Human, agent and mixed investigations use the same conceptual and epistemological model. External design or implementation agents can request supported investigation, consult retained accounts, share references and contribute architectural material within the capabilities actually offered. Agent use does not depend on a preceding human investigation or an embedded conversation. Define each future exchange's actual scope and lifetime rather than implying that CLI invocation already supplies Workspace synchronization or a general contribution interface.

Participant material may include requirements, proposals, intentions, rationale, constraints, correspondence, uncertainty and verification. Preserve participant provenance and asserted or interpretive status; exact recording does not establish realization or acceptance. Distinguish original contributions from PostCode-derived output when origin is supplied. Reuse of earlier Projections remains use of PostCode artifacts, never independent corroboration about the same repository. Keep the generated-output evidence boundary intact.

The built-in Investigator's restricted evidence access remains scoped to that role. It is distinct from an external participant or an implementation agent acting under human instructions. Broadening external integration does not grant the built-in Investigator filesystem, shell, mutation or web access.

## Alternatives and consequences

Leaving general definitions implemented-only would make future capability design conflict with governing terminology despite the adopted foundation. Introducing generic modality records, input capture and acceptance infrastructure now would prematurely choose an architecture without a capability need. Removing investigation context would erase a useful local responsibility and risk withdrawing lineage guarantees. Requiring PostCode to host the larger conversation or first prove comparative advantage would contradict the revised product role.

Broaden meanings and conditional guarantees now, preserve the current concrete subset, and design new capabilities when concrete investigations justify them. The cost is explicitly maintaining the distinction between intended scope and delivered support. It is preferable to speculative machinery or overstated current capability.

## Adoption and conformance

Accept only together with the coordinated specification, core-concepts and constraints revisions, supersession metadata, decision index, capability/architecture disclosures and related backlog revisions. Set the acceptance date at promotion. No implementation task, runtime change or migration is authorized by adoption.

At `03f4dd2`, focused source inspection found no demonstrated implementation conflict caused by this revision. Current implemented-state analyses, prose Investigrams, transient unchanged-input Sessions, exact presentation and qualified prior-interpretation follow-up remain valid subsets. General participant-material capture, hypothetical/intended investigation, cross-modality comparison, cross-session retention and broad external exchange are not delivered by those mechanisms. Retain the current implemented-only subset without adding modality fields, generalized capture, design-acceptance workflows or migrations in anticipation of those capabilities. Its module-originating records remain appropriate to that subset.

For current follow-up, [Investigation execution](../../src/lib/investigation/execute.ts) supplies the selected prior account through `InvestigationContext.prepare` and records the dispatched response through `supplied`; the frozen delivery retains the supplied portions, correction context, completeness information and omissions. [Investigation acceptance](../../src/lib/investigation/acceptance.ts) retains those deliveries and citation/evidence identifiers in `InvestigationProvenance`, and each resulting Investigram points to that provenance. These records identify the retained-interpretation input contribution within the supported Session without a new basis field. Citations are an exposure index, not a replacement for delivery records or proof of reliance. Claim-support references preserve the distinction between material available to an investigation and evidence asserted for its claims.

For a retained answer, the immutable [investigation-selection Projection](../../src/lib/investigation/selection-record.ts) identifies the selected accounts, replacements, associations, revision snapshots and applicable evaluation or mechanical Projection. [Fixed-reference content resolution](../../src/lib/investigation/content.ts) reaches the corresponding accounts, provenance and supporting records. This attributes the answer's selected interpretation separately from its program-state support and the inputs originally delivered to the Investigator. Neither attribution rests solely on the Session identifier. This is a source-based assessment of existing internal retention, not a claim that observations export a complete basis, that every exposure was understood, or that unrestricted interpretation is semantically correct.

Existing documented captured-basis observation, navigation-lineage, initiation-attribution assessment and output-boundary limitations retain their prior scope and disposition. This is not a fresh conformance certification or an excuse to defer a newly demonstrated violation. If adoption review identifies one, first specify its concrete failing behavior, the minimum bounded implementation and focused verification; bring consequential scope changes to the human before promotion.

## Follow-up

The [modality capability candidate](../backlog.md#investigate-hypothetical-and-intended-architecture) records future work. Existing [account exploration](../backlog.md#explore-architectural-accounts-through-journeys) and [external exchange](../backlog.md#design-a-bounded-shared-context-interface-for-coding-agents) candidates retain their separate responsibilities. Detailed account design, retrieval and selection, GUI design and broader sequencing remain subsequent work.
