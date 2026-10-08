# Coordinate Views while preserving qualified results

Status: accepted
Decided: 2026-10-08
Arising from: human strategy discussion following the product-design revision in commit `c0ed132a7af4c479e21deab69d0d6dfe9330ca7f`, as clarified by commit `337451bd37f91004a14d56149c52b4491bef783a` and the human’s instruction to conform application architecture to the adopted foundation
Scope: Lens and Projection meaning, Presentation and View composition, state qualification, interface analysis boundaries, and the relationship between product direction and the current implementation subset
Supersedes:

- [Transient analysis sessions — Retained domain and storage boundaries](transient-analysis-sessions.md#retained-domain-and-storage-boundaries), the whole headed decision.
- [Initial projection architecture — Separate lens requirements, evaluation, and projection construction](initial-projection-architecture-decisions.md#separate-lens-requirements-evaluation-and-projection-construction), the whole headed decision.
- [Keep views grounded in core projections](keep-views-grounded-in-core-projections.md), the complete record.

## Context

The revised [product design](../../foundation/product-design.md#21-lenses-projections-presentations-and-views) permits a View to coordinate several independently qualified Projections and a Projection to concern several program states. Application concepts still describe a View of one Projection and a Projection for one state. Earlier references to a composite Lens can be mistaken for a mandatory category or for a requirement that all coordinated information be synthesized into one answer.

The adopted interface boundary already permits counts and aggregates describing the core-supplied population. Its prohibition on new program claims must remain intact without outlawing ordinary population descriptions. The adopted product design explicitly permits exact counts over supplied qualified populations, separates input binding policies from captured program states, and allows PostCode to suggest a summary View when no more specific information need has been expressed. This decision adapts application architecture to that foundation without revising it or requiring a summary-first default.

This decision changes the conceptual contract, not the current CLI's capability set. It preserves historical rationale by replacing whole decision units and carrying forward unaffected commitments.

## Decisions

### Generalize Lens results and View composition

A Lens defines the investigative question about a subject. Its parameters refine the information requested. It may use several analyses, evidence sources, reusable operation outcomes or qualified Projections to produce its answer. “Composite Lens” can describe such a method but is not a separate architectural category. No one-to-one Lens/analysis/operation/prompt relationship is required. Using a component Projection means deliberately consuming its qualified Lens answer under the outer request’s declared requirements, preserving attributable method, supporting basis and qualification. Its applicability must be suitable for the contribution requested; copying a selector result alone does not establish that relationship. This does not prescribe a universal component-reference field or require manufacturing a Projection for every internal selection operation.

A Projection is the qualified result of applying a Lens to one or more captured program states and a subject, with particular Lens parameters. A request designates program inputs and applicable binding policies; execution resolves them to the captured states identified by the result. It retains its selected content and the captured basis, supporting method and evidence, qualifications and relevant evaluation outcomes needed to interpret that result. State associations remain attributable to the claims and evidence they support; preserve ordering or roles such as before/after where meaningful. A Session supplies a reference context, not a substitute for this basis. A mutable branch designation, matching label or repeated reference spelling is not a state or correspondence guarantee.

A Presentation defines how one or more Projections are rendered, interacted with or exposed. A View instantiates it over a nonempty collection of Projections. Each input remains identifiable with its own subject, Lens, parameters, program-state basis and qualification. A coordinating Presentation may provide shared alignment, axes, anchoring or linked selection. Independent Views merely placed together remain separate Views; visual proximity or a shared container does not alone establish a single View.

Choosing between a Lens result and View coordination depends on the requested meaning. If core selects related information into an answer with its own declared subject, question and qualified selection, that answer is a Projection even when it reuses established claims. A Presentation coordinating existing answers need not construct another Projection. New synthesis requires analysis. Existing associated-inspection and embedded module results keep their accepted contracts; this criterion neither mandates their migration nor requires a new Projection merely to share layout or interaction.

Presentation parameters describe display and interaction choices and remain distinct from Lens parameters, which refine the information requested. Presentation context describes rendering circumstances. Context changes need not change View identity. Adding or removing an underlying Projection changes composition and must be visible and recorded. Replacing displayed information with a result based on newly captured state must likewise expose and record the change of basis; it is not merely a rendering-context change. Observation records must identify the Projections actually presented, their composition and associated captured states, and record composition or captured-basis changes when they occur. This does not by itself require durable workspace state. This decision prescribes no universal View identity formula or managed-View lifecycle and does not replace current CLI identity formulas. Investigation lineage and captured-basis distinctions remain available regardless of the representation chosen.

### Define request inputs and captured states

A program input is a designated source of program information, such as a repository revision, working tree, index, execution or observation stream. A binding policy determines which state of that input a request uses. A captured program state is the program information captured from that input as the basis for a result; its capture timing, scope and limitations remain attributable. Capture does not imply an exhaustive or atomic snapshot.

A Projection request designates one or more program inputs and applicable binding policies, a subject, a Lens and Lens parameter values. Execution resolves inputs to the captured states used by the result. Repeating a request and presenting an existing Projection are distinct operations. These terms describe meaning, not required record types, a capture identifier algorithm or a planner. A Session is the analysis and reference context, not an input binding or proof of one completely observed state.

Captured-basis attribution is a required property, not a prescription for a state field or new key in every record family. Its representation must preserve the associations needed to interpret the result; affected records and identity rules depend on the capability being introduced.

### Keep Subject open-ended and state designation explicit

Subject remains the role of what a Lens investigates or a Claim concerns, not a closed list or a new entity kind. “What changed in this module between A and B?” investigates the module across separately identified captured states A and B. “Why was this dependency removed?” can instead investigate an identified, qualified change, with its relevant states and evidence still explicit. An established change may become the subject of further investigation without concealing program-input or captured-state designation inside the subject.

This clarifies the existing Subject example and preserves its open-ended role. It neither introduces a change entity kind nor commits to implementing change investigation.

### Preserve immutable results under bindings and refresh

For revision-oriented inputs, **following** means subsequent requests resolve a changing input again; **pinned** means subsequent requests continue to use the same captured program state. These policies select inputs for requests, not the content of a mutable Projection. Other inputs retain source-appropriate bindings, such as an execution, observation interval or continuing stream. Different captures of a changing input must be distinguishable. Later observations cannot silently support information attributed to an earlier interval. No binding promises synchronized, atomic or complete capture.

The application retains its existing immutable-result commitment. A request using newly captured inputs produces a result whose content, evidence and qualifications identify that new basis, without changing an earlier result. Repeating a request on pinned inputs is distinct from redisplaying a retained Projection: the former may use an updated method version or newly available compatible analysis to satisfy the same requirements, while the latter presents that exact result. Compatible reuse of the same retained result need not allocate a new identifier. This does not authorize collapsing distinct captures merely because displayed content is equal; their captured bases must remain distinguishable. Capture identity and content-equivalence policies remain separate implementation decisions.

References exposed to an agent must distinguish a Projection over its captured basis from a request repeatable using current input bindings. Future workspace context must keep designated inputs and policies attributable to the resulting captured states and expose when the basis differs from what a subsequent request would select. This establishes meaning for later integration, not a context-export schema or an implementation commitment.

A multi-state Projection and a multi-Projection View both preserve state associations, meaningful order or roles, capture timing and relevant limitations. A View must not suggest synchronized states when the inputs do not establish that. Correspondence requires established identity guarantees or qualified analysis; labels or compact session references alone cannot establish cross-state identity. An exact identity guarantee is limited to what its producing method establishes: exact matching of supplied path values can align path labels, but does not establish semantic continuity of entities across revisions. Equality caused by reusing a key is not such a guarantee.

The [immutable-information](transient-analysis-sessions.md#immutable-information-within-an-accumulating-session), [stable-reference](transient-analysis-sessions.md#stable-reference-bindings-within-a-session) and [stable-input](transient-analysis-sessions.md#stable-inputs-as-the-session-precondition) decisions remain accepted. Later results may reflect completed analysis or newly selected retained interpretation without changing earlier results. Reuse or rerendering need not create a different semantic answer. The current session still invalidates on detected relevant input change and requires reopening; this decision does not authorize refreshing that session in place.

### Preserve the selected answer during presentation changes

Presentation-only actions, including paging and reformatting, preserve the selected answer and its qualifications. The intended implementation direction is to present an exact retained Projection, or the same retained collection for a coordinated View, with different presentation inputs. Repeating a request and selecting a newer answer is a refresh, even if the program inputs have not changed. If an interaction refreshes the answer, its refresh behavior must be apparent and consequential changes in the answer, selection or qualifications must be disclosed. Clearly disclosed reselection may be an interim treatment, but does not provide the same continuity as presenting the exact retained result.

A result's captured program-state basis is distinct from the retained interpretations and correction/association selections supporting its answer. Either can affect the answer; interpretation history is not thereby a captured program state. An existing Projection retains both its captured basis and the selections supporting that result. This distinction introduces no following or pinned policy for interpretation history.

Disclosure concerns meaningful changes, not every identifier change. Nor does every independently requested fresh investigation require a comparison notice against earlier answers. Calling successive CLI commands separate Views or exposing changed Projection IDs only in JSON is insufficient disclosure for an interaction presented as paging an answer. The current F6 continuity/disclosure limitation and its deferred remediation are acknowledged under [Adoption and conformance](#adoption-and-conformance).

### Keep evaluation and qualified construction independent of presentation

A View request may coordinate several Projection requests, each with its own designated inputs, binding policies, subject, Lens and parameters. Lenses and Presentations do not call language analyzers directly. A Lens declares the information requirements for its answer, including contributions from other analyses or qualified results. A Presentation may declare standard expansions for subject kinds before Evaluation. Evaluation coordinates applicable providers, execution constraints, compatible reuse, shared work, Claim context and qualified materialization outcomes. Construction selects the materialized information and relevant outcomes into the Lens's retained answer.

Shared work preserves which requirements each operation satisfies. Deferred, partial, unavailable, stopped and failed work remain distinct; construction cannot conceal unmet requirements or turn missing information into an established empty result. A successful contribution cannot erase another requested contribution's limitations.

An interface may choose subjects and Lens requests, request Evaluation and declared expansions, select supplied Projections, implement Presentations, navigate Views and manage workspace interaction. Rendering and arrangement consume supplied qualified information and do not initiate Evaluation. An interaction requiring more information issues another request through Evaluation and core construction. Standard expansion is related detail defined for a subject kind; an additional Lens question remains an additional request whether displayed in the same coordinating View or an embedded View.

Presentation requirements remain distinct from Lens parameters even when they influence execution. Evaluation may be shared, lazy, staged or subject to presentation pushdown if it preserves Lens meaning, population, qualification, materialization and retained-result semantics. The [initial eager evaluator](initial-projection-architecture-decisions.md#keep-the-first-evaluator-eager-and-implementation-specific) remains an accepted implementation choice; no general planner is required.

### Coordinate supplied information without deriving new program claims

“Core” denotes interface-independent analysis, Evaluation and Projection construction, not a required package. Interface and Presentation code must not establish new Claims about investigated subjects or retained interpretations. New correspondence, correlations, priorities, reconciliations, inferred categories, synthesized summaries and analytical aggregates require core analysis and a qualified Projection whose method and qualifications are explicit. New interpretation is evaluated through the interpretation boundary, not generated inside an arranger or constructor.

Presentations may sort, group by supplied fields, filter, progressively disclose and report exact counts over explicitly identified populations supplied by their Projections, including qualified supporting evidence and evaluation outcomes. Exact counting over an identified supplied population is expressly permitted even when the input does not store the resulting numeral. Beyond these population descriptions, deriving an aggregate that makes a new claim about the program requires core analysis and a qualified Projection. Sorting by an already supplied metric and displaying its first N items is sorting plus truncation; deriving that metric or claiming an unsupported project-wide ranking is analysis. Counts can describe the full supplied qualified population as well as a displayed subset: “87 dependencies; showing 20” is valid when 87 describes the supplied dependency population or an explicitly core-supplied total. If only 20 records are supplied without a qualified total, 87 cannot be inferred. Distinguish a selected population, an evaluation-wide supporting population, a filtered subset and a displayed subset. Exact arithmetic does not establish complete analysis or project-wide coverage.

Preserve each input's qualification and materialization and disclose consequential filtering, grouping, aggregation and omission. Across several Projections, display counts retain their input associations. Counting rows from overlapping results does not establish a distinct-entity total unless their correspondence is already established. A project-wide total, inferred classification or aggregate requiring new evidence, semantics or analysis belongs in core; a core-supplied total may be rendered without reanalysis. This retains counts over supplied populations, including undisplayed members, while replacing the earlier broadly worded “aggregate” permission with this more explicit scope. The earlier prohibition on new program claims remains in force.

These permissions are not an exhaustive whitelist of UI computation. Ordinary layout and interaction need not become core analysis merely because they are not listed. The boundary is the derivation of new program claims and the preservation of supplied meaning and qualification.

Alignment or overlay may use correspondence already established by the inputs or an exact identity guarantee they supply. Displaying two dependency results beside one another does not establish additions, removals or significance. Such change claims require a comparison/diff Lens; characterizing renames or inferring equivalence likewise requires analysis. A displayed flow must already be established by an input. Presentation coordination and investigation lineage are not themselves claims of program relationships.

GUI plans must identify missing core capabilities needed to produce their qualified Projections, such as Lenses, analyses or standard expansions, instead of assigning unsupported program derivation to View code. Those capabilities need not all be implemented before GUI work begins.

The [qualified-construction decision](qualified-projection-construction.md) remains accepted in full. For its covered families, each Presentation input is the qualified information selected for that Projection; arrangement cannot query accumulated state to broaden or refresh it. Multiple inputs do not create a store-access exception. The existing binding-only port validates explicit IDs and kinds against the supplied population, preserves append-only bindings and returns only spellings. Existing eager resolution, family-specific qualified summaries, immutable selection snapshots, source-disclosure obligations and CLI identity/compatibility rules remain in force. Any future extension of reference coordination must preserve input attribution and reference scope; no cross-session transport contract is established here.

### Preserve inspectable selection and parameter meaning

Whenever PostCode selects Projections or a Presentation, the resolved selections, their criteria and consequential omissions must remain inspectable, for any kind of View. This applies to explicit, automatic and mixed selection to the extent PostCode makes choices; it is not restricted to summaries. Inspection must expose the choices actually made and the criteria used at the time, rather than reconstructing an explanation from subsequently changed defaults. Omission does not establish absence, unavailability or unimportance without supporting information.

A request about output form or length is a presentation choice when it changes only rendering or visible abbreviation. If satisfying it changes which information is requested or synthesized, it affects Projection selection or Lens parameters. Execution constraints remain distinct. These rules require inspectability, not a separately stored plan artifact or a general query planner.

### Allow summary Views independently of summary Lenses

When the human has not expressed a more specific information need, PostCode may suggest a summary View as an initial View for the subject. This is an available entry and recursive-navigation pattern, not a mandatory default. Explicit questions and choices take precedence. A summary View may coordinate independently qualified Projections, display a summary Lens's synthesized account, or combine both. A summary Lens need not exist or be selected for every summarized subject.

A coordinating summary exposes the supplied accounts and consequential omissions without inventing a unifying conclusion. A synthesized summary is a new qualified answer produced through core analysis. Selection criteria, resolved choices and limitations remain inspectable; omitting an aspect cannot imply its absence, unavailability or unimportance without support. The current CLI’s inventory default does not conflict with this optional summary suggestion. Its bounded module `summarize` capability is one implementation of a summary request, not the definition of all summary Views.

### Retain unaffected domain and storage commitments

The following provisions carry forward the unaffected commitments of the replaced session heading. Its conceptual paragraph is replaced by the definitions above; other domain and storage provisions remain unchanged.

Program information remains a record-oriented model of entities, claims, Claim
context, evidence, recorded assertions, evaluation outcomes, and projections.
Addressability within a session does not make all records entities. Graphs, trees,
tables, and paths are derived representations, not the canonical store. Claims
retain explicit method and supporting-input context. Correspondence across
program states would be a separate qualified relationship, not identifier reuse.

Analysis, evaluation, and projection construction communicate through
ProgramRecordStore using domain-shaped operations required by implemented slices.
Storage-native rows, query objects, connections, and identity do not escape the
adapter. Access mechanics do not conceal consequential cost, failure,
qualification, or materialization. The store is ephemeral; its engine remains an
implementation choice. Durable caching, durable investigation state, and
observation storage are separate lifecycle concerns. Retaining an ephemeral
store would not by itself establish a durable cache-validity contract.
Cross-process caching remains deferred until all analysis-defining inputs can be
validated and retention, migration, concurrency, cleanup, and recovery are
addressed.

Lens, Projection, Presentation and View have the meanings established in
[Generalize Lens results and View composition](#generalize-lens-results-and-view-composition).
A Projection remains addressable within its session. These distinctions do not
require separately materialized pipeline stages or a universal projection-key formula.

A Claim supplies asserted information; Claim context supplies supporting evidence,
provenance and method, scope, epistemological guarantee, and limitations. Shared
context remains attributable and narrower context is not erased. Evaluation
outcomes separately describe applicability, availability, execution,
materialization, relevant cost, and failure or stopping reasons. They remain
available when no entity or claim is produced, distinguishing established emptiness
from absence of a result. A projection is an addressable program-domain object
rather than only a transient return value; evaluation outcomes are distinct
records or immutable domain values associated
with the relevant request or materialization. Repeated attempts do not overwrite
earlier outcomes. Projection qualification selects relevant evaluation outcomes
rather than inheriting unrelated work or failures from shared evaluation.

Modules remain qualified domain entities with established names or honest
anonymity, simple deterministic generated mnemonic handles, bound Entity IDs, and overlapping
established facets. The supported population and TypeScript identity rules are
unchanged. Handle generation is deterministic for equivalent supporting inputs;
the freedom to allocate session-local references does not relax that requirement.
Language-specific evidence is retained without presenting TypeScript categories
as universal PostCode facts. Lens-wide and narrower Claim context remain attributable. Inspection
selects subjects rather than exposing arbitrary stored records. Exact lookup
retains zero/one/many outcomes, with no fuzzy, wildcard, list, or successor
inference introduced by this slice.

Module standard expansions retain effective exports and associated recorded
documentation; the accepted [composition expansion](module-composition-property-decision.md) remains applicable.
Dependency children and parents remain separate lens questions, not module
standard expansions. Presentation requirements are declared before evaluation;
rendering consumes materialized information and discloses consequential omissions.
The accepted [subject-kind expansion definition](subject-kind-standard-expansion-decision.md) remains in force.

Groups remain entities with provider-established segment names and bound Entity
IDs, without generated handles or path selectors. The repository root has a
contextual label rather than an intrinsic segment name. Direct subgroup
containment and artifact/module placement remain qualified relationships;
descendant membership remains derived and distinct. Multiple established
placements use the same module identity. Multiple placement, candidate ambiguity,
unplaced results, unavailable analysis, and out-of-population modules remain
distinct. Exact group/module name collisions retain all matches, sectioned by
kind, and displayed entities retain their precise references.

Organization schemes remain explicitly identified, distinct qualified accounts.
Repository layout is the initial method, not canonical architecture. Future
package, namespace, build-target, declared, user-defined, or inferred schemes are
not silently merged with it. Groups, claims, method context, and projection
identity retain sufficient qualification to prevent accidental combination.
Neither an organization aggregate entity nor a particular bundling of organization
records within the session is required. Later comparison or composition requires
explicit semantics.

Repository evidence retains the claim-relevant visible artifact manifest, kinds,
effective exclusions, generated-output boundaries, links, and opaque repository
boundaries, with the methods that establish them. Arbitrary unexamined worktree
contents do not become inputs merely because artifacts exist. Content becomes
supporting evidence when an analysis or disclosure uses it. First-observed,
non-atomic qualification remains applicable.

Resolved external modules remain valid dependency endpoints with opaque interiors.
They do not establish package, version, installed-artifact, or online-repository
identity. Parent views may show established incoming project relationships;
unexamined external children are not an established empty set. Resolved opaque
targets, unresolved requests, indeterminate targets, platform-provided targets,
and unavailable analysis remain distinct wherever established by the provider.

Dependency cycle groupings remain presentation structures within the session,
not entities or independently selectable subjects.

Project-open failures, qualified results with encountered diagnostics, partial or
unavailable evaluation, failures preventing results, and unexpected defects remain
distinct. Project-open failure precedes an investigation projection. After
opening, diagnostics encountered on the requested analysis path qualify the
relevant information; unrelated compiler checks are not run merely to search
for diagnostics.
Dependency methods and evidence remain attributable to their claims, and source
disclosure, generated-output exclusion, and observations cover the resulting
views, navigation, omissions, and actual disclosures.

## Supersession mapping

| Earlier unit replaced in full | Replacement provisions here | Semantic change and preserved scope |
| --- | --- | --- |
| Transient analysis sessions: Retained domain and storage boundaries | Generalize Lens results and View composition; Preserve immutable results under bindings and refresh; Retain unaffected domain and storage commitments | Generalizes single-state and single-Projection wording; carries forward all other domain/storage commitments. All other session headings remain accepted, including command-scoped observations, immutable results and input invalidation. |
| Initial projection architecture: Separate lens requirements, evaluation, and projection construction | Generalize Lens results and View composition; Keep evaluation and qualified construction independent of presentation | Removes a distinct composite-Lens reading and a single evaluated-result/View assumption; retains declared requirements, shared Evaluation, subject-kind expansions and the prohibition on rendering-triggered analysis. Other currently accepted headings remain accepted. |
| Keep views grounded in core projections: complete record | Keep evaluation and qualified construction independent of presentation; Coordinate supplied information without deriving new program claims | Generalizes to several Projection inputs; preserves full-supplied-population counts, qualification and omission disclosure; narrows the former broad aggregation wording to the explicit presentational permissions and restores the GUI planning obligation. The prohibition on new program claims is retained. |

The whole-unit replacements include their earlier rationale and consequences as historical material, not as text to rewrite. Earlier records receive forward metadata links to these headings at adoption. No already superseded initial concept heading is superseded a second time. The operation/Lens decision's use of “composite” remains valid descriptive language, and its single-operation dialogue limit remains explicit; it needs no supersession. The subject-kind expansion decision and the qualified-construction decision also remain accepted unchanged. The initial inventory decision’s “Begin with a TypeScript module inventory” is slice-scoped and remains accepted: its `summary(root)` shorthand does not require every product summary View to use a summary Lens. Completed plans and their earlier composite-summary rationale remain historical evidence, not new restrictions on the generalized model.

The Subject clarification preserves the accepted role definition in [Initial core concepts](initial-core-concepts-decisions.md#define-entities-subjects-claims-and-relationships-by-their-meaning); it does not supersede that unit. Presentation continuity adds an explicit interaction obligation while preserving immutable retained selections and the existing construction/arrangement boundary. It does not rewrite the retained-investigram selection decision or authorize a change to current CLI compatibility contracts; the current gap is acknowledged and remediation deferred below.

### Inbound reliance on replaced units

On promotion, preserve these existing links and check that the provisions they rely on remain available through forward supersession metadata. Do not rewrite the historical bodies merely to redirect links.

| Existing dependent | Provision preserved here |
| --- | --- |
| [Execution ownership and cancellation](execution-ownership-and-cancellation.md) | Session/store ownership in Retain unaffected domain and storage commitments; existing execution ownership remains accepted. |
| [Investigrams and progressive investigation](investigrams-and-progressive-investigation.md#governing-impact) | Qualified subject inspection and attributable Claim context in Retain unaffected domain and storage commitments. |
| [Qualified Projection construction](qualified-projection-construction.md#context) | Addressable retained Projections, domain storage boundaries, and interface-independent construction and arrangement. |
| [Investigation operations and lenses](investigation-operations-and-lenses.md#context) and [Module investigation plan](../plans/module-investigation.md) | Declared requirements, Evaluation coordination and reuse, and construction from qualified materialized information. |
| [Initial core concepts](initial-core-concepts-decisions.md#context) | Evaluation separation and the distinctions carried into the current definitions. |

Earlier supersession mappings also remain intact; they document history and chain through the new forward metadata. Recheck inbound references against the current canonical files at promotion, in addition to checking links emitted by this package.

## Rationale and alternatives

Forcing every coordinated View through a synthesizing Lens would manufacture answers where the human needs only independently qualified accounts and linked interaction. Allowing presentation to derive claims would bypass the qualification boundary. The chosen distinction follows meaning and evidential responsibility, not the number of inputs or the complexity of the arithmetic.

Restricting counts to displayed items would lose useful, already accepted population descriptions. Allowing arbitrary aggregates would conceal new analysis. Explicit supplied-population attribution preserves both usability and qualification.

Treating a live Projection as a mutable latest-state query would destroy the meaning of retained results. Binding future requests to evolving inputs preserves continuity without rewriting evidence. Requiring immediate implementation of the full product model would conflate conceptual direction with slice scope.

## Adoption and conformance

On human acceptance, update core concepts, constraints, descriptive scope documentation, decision metadata/index and the associated backlog additions together. The adopted foundation is the governing input and remains unchanged. No application code, runtime schema or historical observation migration is authorized by adoption.

The current transient, single-project, single-state CLI and its family-specific single-top-level-Projection Views are a permitted limited subset. Embedded mechanical bases and associated inspection do not claim general multi-Projection coordination. Multi-state analysis, general multi-Projection GUI support, live refresh, workspace persistence and a general planner remain separate work. Current eager builders, retained records, interpretation correction semantics, reporting-only usage and public compatibility provisions are unchanged.

The [representation audit](../../records/audits/2026-10-06-user-model-concept-representations/REPORT.md) identifies existing defects in observation request descriptions and bound unsupported-subject reporting (F1/F2), semantic field conflation (F3), selector coupling through a retained inspection result used only for selection (F4), and a retained-result paging/redisplay limitation (F6). Adoption neither fixes nor legitimizes these. F1/F2 already misdescribe current behavior and warrant separately scoped correction, without waiting for a GUI or the broader model. F3 requires descriptor/compatibility work before real Lens parameters are introduced. F4 merits decoupling selection: the dependency constructor copies inspection selection data without consuming the inspection answer as an attributed qualified contribution. This is not a ban on component Projections. F5's CLI-specific Presentation representation remains a limitation to reassess before GUI work.

F6 is a current human-facing continuity/disclosure limitation. Old stored results remain immutable, but a later page or format request may select a different interpretation or correction/association snapshot. Separate CLI commands and changed Projection IDs in JSON do not adequately disclose this to a human paging an answer. Remediation is explicitly deferred to separately scoped work in the existing retained-Projection View backlog entry; it does not depend on live refresh, multi-state analysis or GUI support. The direction is exact retained-Projection presentation with new presentation inputs. Clearly disclosed reselection may be an interim treatment, but must not be described as equivalent continuity. The current CLI cannot claim to preserve one selected answer across such requests, and its descriptive documentation must acknowledge that limit.

The accompanying backlog tracks deferred remediation, later assessment of future capabilities and possible summary suggestions. This is an explicit deferral of implementation, not a waiver of accurate current claims. No broad runtime conformance audit has been performed for this decision. Scope prerequisites to the capability being introduced: coordinating several existing Projections from one Session does not inherently require multi-state support or a new capture model. It does require qualified input attribution, presentation continuity, composition recording and appropriate interface compatibility. Accommodating another capture additionally requires a deliberate namespace, session-scope and basis-compatibility policy because current entity keys and reuse/lookup paths assume unchanged inputs. Separate Sessions per capture and an explicitly extended multi-capture Session are different possible approaches, not choices made here. Storage, identity, refresh, persistence and planning designs remain later implementation choices; none is authorized by this proposal.

### Current observation provenance gap

Current observation batches retain the presented View and rendered output, plus session identity, configured paths and method names. They do not generally export the captured program-state basis associated with each Projection. In particular, ordinary module inventory exports conceptual qualification but omits the retained analysis-input and supporting-evidence references; the ephemeral core store is not exported with the batch. Optional source-detail records can carry evidence digests for disclosed items, but do not establish complete state attribution. Retaining qualified support in core therefore does not establish that observations preserve it.

This is a current conformance gap in the observation-recording obligation, also relevant to the foundation's existing event-provenance requirement. It must not be classified solely as absent future multi-state support. The [captured-basis observation candidate](../backlog.md#preserve-captured-basis-attribution-in-observations) tracks bounded assessment and correction, including the adequacy of associated-inspection attribution. That case retains a qualified composite selection in core; it does not automatically require recording two independent top-level Projections or a universal component pointer. No new observation schema, retention mechanism or historical-data migration is selected here.

Correction of this current limitation is explicitly deferred; it need not precede architectural acceptance or interface exploration. Recorded output remains evidence of what PostCode displayed, but observations do not generally establish the captured program basis supporting that output. Correction must precede reliance on newly collected observations for assessments requiring attribution to a particular program state. The bounded candidate and conformance links remain in place; this deferral neither satisfies the existing observation obligations nor authorizes implementation.

Identifying the captured basis is distinct from retaining everything needed to reproduce an investigation. The follow-up must establish adequate attribution and its limitations without silently expanding into a durable analysis store or repository archive. A commit hash alone must not be assumed to cover the actual captured inputs, including relevant working-tree information; references into a discarded store must not be assumed resolvable. The necessary representation and any bounded retention remain design choices for that follow-up, not a commitment to full reproducibility.
