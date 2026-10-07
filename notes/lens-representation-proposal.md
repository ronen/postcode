# Proposal for explicit Lens representation and subject selection

Recorded: 2026-10-06

Introduce an explicit Lens vocabulary, separate subject designation from lens parameters, and correct the observation and applicability defects together. Keep the existing Projection families and qualified construction boundary. The useful common representation is the question and its application to a subject; it need not become a universal execution registry or Projection schema.

This is exploratory material for discussion, not an approved plan, accepted decision, or authorization to implement. It addresses F1–F4 of the [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md) and the first three resulting [backlog entries](../docs/backlog.md#candidates). The audit's Presentation and retained-Projection presentation proposals remain separate candidates.

## Assessment of the audit proposals

| Audit proposal | Recommended treatment | Reason |
| --- | --- | --- |
| P1 Explicit lenses | Adopt the explicit identity and applicability; narrow the proposed table's responsibility | Shared semantics should drive dispatch and reporting, but CLI grammar, evaluation coordination, construction and presentation change for different reasons. |
| P2 Direct defect corrections | Include F1 and F2 as required outcomes of this work | A new abstraction is insufficient unless observations and unsupported-subject results become correct. If design discussion delays the work, these defects can be fixed separately. |
| P3 Subject designation and selection | Adopt separation of designation, selected subjects and lens parameters; extract dependency subject selection | Preserve lookup distinctions and qualified populations. Do not change to identity based only on resolved entities. |
| P4 Presentation redesign | Defer to GUI presentation planning | Neither confirmed defect requires new bounds, layouts or reference-coordination APIs for a GUI. |
| P5 Present a retained Projection | Consider separately | Snapshot-preserving paging has value even in the CLI, but it needs a request and refresh contract independent of Lens representation. Deferral does not resolve F6. |

Two audit conclusions need qualification. First, the absence of a Lens type makes inconsistent policy easier, but adding a table alone does not fix either defect. F1 also comes from inferring the request from a View descriptor with a fallback; F2 comes from confusing reference resolution with selection in a module population. Second, an internally constructed Projection is not inherently wrong because no human requested it directly: composite lenses may legitimately construct component Projections. F4 warrants correction because the dependency code uses inspection solely as a selector, retains an unused result, and inherits its module-only failure classification.

The governing [Lens and Projection definitions](../docs/core-concepts.md#investigation-and-representation), [operation separation](../docs/decisions/investigation-operations-and-lenses.md), and [qualified construction decision](../docs/decisions/qualified-projection-construction.md) remain the basis. Source inspection of [session dispatch](../src/lib/session.ts), [dependency construction](../src/lib/dependencies/projections.ts), [selection records](../src/lib/investigation/selection-record.ts), and [observations](../src/lib/observations.ts) supports the audit's diagnosis. Its recorded probes supply the runtime evidence for F1 and F2.

## Lens identity and responsibility

“Question” here means the conceptual question a Lens answers, such as “What does this module depend on directly?” It does not mean a prose question supplied by the user or introduce a free-text request field.

Use one canonical `LensId` throughout normalized requests, Projection records, resolved descriptors, Views and observations. Keep command spelling as an interface mapping. Prefer the existing semantic dependency names `dependency-structure`, `dependency-children` and `dependency-parents`, with `dependencies`, `children` and `parents` as CLI aliases. There should be no second identity vocabulary hidden in the investigation selection family merely because it records an unsupported request.

A small typed set of Lens definitions should identify each question, its supported subject forms and cardinality, its parameter contract, and its information requirements. A short question label can support consistent descriptions. These semantic definitions should have no store, provider, terminal or View dependencies. A typed dispatch function can select the existing construction path. Whether an execution registration table would make extensions easier remains open; separating responsibilities should not require adding another branch in every layer whenever a Lens is added.

Requirements may vary with the subject kind and lens parameters. Keep that variation explicit, and combine Lens requirements with independently declared presentation expansions before Evaluation. The current investigation Lens-to-operation mapping should have one source shared by requirement declaration and outcome validation, but its present one-to-one shape must not become a general restriction. Evaluation continues to own reuse and execution; a Lens definition must not invoke an investigator. The [initial projection decision](../docs/decisions/initial-projection-architecture-decisions.md#keep-the-first-evaluator-eager-and-implementation-specific) specifically leaves API mechanics open and rejects a speculative capability planner.

CLI adapters should derive recognized Lens identities from this vocabulary while retaining their own syntax, aliases, option rules and help. Observations should consume normalized request meaning. Neither needs to import constructors. Exhaustive typing and boundary validation should make an omitted Lens case visible instead of silently describing it as inventory.

### Ease of adding lenses

The human identified an additional design goal in follow-up discussion: make adding new lenses as easy as possible. Ideally, an interpretive Lens that fits the existing investigation machinery would require little more than a new prompt in a table. Mechanical lenses will sometimes require new analysis code, but integrating that code should also be straightforward. This goal should inform the representation work without automatically adding a general extension framework to its scope.

For interpretive lenses, distinguish reusable execution machinery from the instructions defining the requested interpretation. A declarative entry could supply a prompt and the small amount of necessary metadata, reusing subject resolution, evidence access, evaluation, result validation, retention, qualification, presentation and observation handling. Applicability, parameters and result contracts could use established defaults where appropriate. A Lens needing new evidence capabilities or a different result form may still require code; the simple case should not pay that integration cost.

Preserve the accepted distinction between Lens and investigation operation. A Lens can declare an operation whose implementation uses the configured prompt, and several lenses may consume the same operation. Prompt changes that change the requested interpretation or generating method need explicit version/provenance and reuse treatment; prompt text alone should not silently redefine the meaning of a previously retained result. This is compatible with a convenient authoring table, without deciding its exact layout now.

For mechanical lenses, distinguish selecting or combining existing qualified information from introducing a genuinely new analysis. The former should mostly require a definition and construction logic; the latter also needs an analysis implementation and its evidence and qualification contracts. Neither should require repeating Lens-specific classifications throughout parsing, selection, dispatch and observations.

For the present proposal, evaluate candidate designs by walking through hypothetical additions: an interpretive Lens using existing evidence and result machinery, a mechanical Lens over already materialized information, and a Lens with subject-specific, parameter-selected composition as described below. Identify which files and decisions each would require. This can reveal unnecessary coupling without implementing new lenses. A prompt-definition mechanism, extension API or broader execution registration design can be addressed later if the audit corrections do not require it. Ease of extension is a reason to reconsider manual dispatch, not yet a decision to adopt the audit's all-in-one table.

### One Lens with several implementations and components

Two independent dimensions should be supported in the conceptual design. A Lens can apply to several subject kinds, using different operations for each. It can also combine several qualified contributions for one subject, with parameters choosing the requested contributions. Neither dimension requires giving up the Lens's identity. Their combination means that a single Lens ID need not identify a single prompt, operation, constructor or result layout.

The shared identity should express a coherent investigative purpose. For example, a future summary Lens might answer “What is this subject responsible for, and how does it fit into its surroundings?” Module and group summaries could use different evidence, operations and composition while fulfilling that purpose. Summarizing a group would not necessarily mean running module summary independently on every member: that gives a collection of module answers, not automatically an account of the group. The Lens must define any related-subject selection and aggregation it needs. These examples describe possible extensions, not current summary support.

Recommended distinctions:

| Concept | Responsibility |
| --- | --- |
| Lens definition | State the investigative purpose, supported applications and parameter meaning. |
| Lens application | Bind that definition to a designated/resolved subject and normalized lens parameter values. |
| Subject-specific realization | Determine the applicable requirements and how their qualified results contribute to this application. This may be a small declaration or ordinary code. |
| Evaluation | Satisfy requirements using compatible retained results or new work, preserving operation provenance and outcomes. |
| Projection construction | Select and combine the resulting qualified information into the Lens's immutable answer. |
| Presentation | Arrange that answer; it does not decide which substantive question the Lens meant to ask. |

“Realization” is explanatory vocabulary here, not a proposed new governing concept or mandatory stored stage. An ordinary Lens can use one realization; a simple interpretive realization can amount to a prompt-backed operation and standard result construction. A composite realization can request several contributions. Definitions should not force authors of simple lenses to specify a general workflow.

### Parameters that choose contributions

A parameter can select operations when that choice defines the information requested. For example, a future `summary(subject, aspects: [responsibilities, dependencies])` would request a different answer from `summary(subject, aspects: [responsibilities])`, while keeping the same Lens identity. The Lens definition maps those aspects to suitable operations or component lenses for the subject. This need not expose internal operation names as the user-facing parameter vocabulary.

The following hypothetical applications illustrate the combination of both dimensions:

| Application | Possible contributions |
| --- | --- |
| Module summary, responsibilities | Functionality interpretation from module evidence. |
| Module summary, responsibilities and dependencies | Functionality interpretation plus qualified dependency information; an additional synthesis operation if new explanatory prose combining them is requested. |
| Group summary, responsibilities | A group interpretation using qualified membership and other declared group evidence. |
| Group summary, responsibilities and dependencies | Group interpretation plus a defined account of dependencies across the group's boundary; this cannot simply reuse module adjacency without specifying the aggregation and its limitations. |

Separate contribution selection from execution and display choices. Omitting dependency information from the requested answer is a Lens parameter. Collapsing an already selected dependency section is a presentation parameter. Reusing an existing dependency evaluation instead of running work again is an execution choice. A time or cost budget is an execution constraint: reaching it leaves requested work unmaterialized, rather than silently removing that contribution from the question.

Normalize defaults and parameter values before determining applicability and identity. If aspect order has no semantic meaning, reordering it should not change the question. If a Lens parameter is supported only for certain subject kinds, validate that combination explicitly. Do not accept it and silently ignore it on other kinds. A conceptual contribution that applies but cannot currently be evaluated remains unavailable or partial, rather than becoming an unsupported question. Thus, general applicability is a property of Lens, subject and parameter values together; the current table below is the simpler case with empty lens parameters.

### Composition of qualified information

Composition may use other lenses' qualified Projections, reusable operation outcomes, or both. Use a component Lens when its existing question and selection semantics are wanted. Use an operation directly when its reusable information is needed without introducing another question. Mechanical analysis requirements retain their existing contracts; this does not propose recasting all analysis as investigation operations.

For every contribution, specify its subject, parameters and role in the outer answer. An outer Lens remains about its original subject even when it requests information about related subjects. Component Projections are legitimate when consumed or referenced by that answer; unrelated accumulated results must not be swept into it. Composition combines qualified content, not rendered Views. New interpretive conclusions require an evaluated interpretation operation, rather than being generated inside a constructor or renderer.

Preserve each contribution's qualification and relevant outcome. A missing requested contribution must remain visible, even if other contributions produced useful information; an unrequested contribution is a different case. If synthesis depends on earlier results, make that dependency explicit and preserve what was actually supplied. Selecting several operations does not authorize combining them into one investigator dialogue; the accepted operation decision defers that separate execution choice.

Projection identity should distinguish the outer Lens, normalized parameters, subject designation/selection and retained semantic result with its supporting method/basis. Reuse of an underlying operation is determined by that operation's compatible request and context, independently of which Lens consumes it. Changing the selected aspects may change the outer Projection while reusing an unchanged functionality interpretation. Execution scheduling and renderer choice do not themselves redefine the Lens. Earlier composite results must remain reconstructible from their retained contributions, even if later work produces better or additional information.

This strengthens the case for a definition that resolves requirements from subject and parameters, rather than a permanently fixed `LensId → operation` table. The immediate representation work should avoid baking in that restriction. Whether to implement declarative composition now remains open; first establish the parameter/applicability contract and walk through a concrete composite example. Dynamic registration, a general workflow language and new summary capabilities are separate possible work.

### One inspection lens

Treat `inspect` as one question: show the qualified detail and retained associated interpretation for the designated subjects. Module, group, mixed and exact-investigram inspection implement this question for different subjects. The associated-inspection composite is a construction variant of inspection, not another user-selectable question. Preserve its explicit mechanical basis and frozen association selection.

This gives a stable identity without making internal record shape define the user's question. Exact investigram inspection still targets the original immutable investigram, including correction information; it does not redirect to a replacement or execute inference. Module and group inspection still apply their respective standard detail and association rules. A shared label may be refined by subject kind in presentation.

The alternative is distinct identities such as module inspection and investigram inspection behind the same command. That would be preferable if they become independently selectable questions on the same subject, or acquire meaningfully different parameter contracts. The current differences are adequately expressed by subject kind, requirements and construction variants. Having four record variants alone is insufficient reason to create four lenses.

Keep dependency children and parents as the two distinct, direct dependency questions established by the [dependency decision](../docs/decisions/module-dependency-structure-decisions.md#provide-project-structure-and-focused-direct-navigation). Do not reinterpret them as group containment or investigram composition when the supplied subject has another kind. Refusal does not imply that an investigram version of either Lens exists.

### Usage remains reporting

Exclude `usage` from `LensId`. Normalize it to a distinct reporting request before domain dispatch. The CLI command can remain unchanged, and the existing JSON `projection` descriptor with `lens: usage` can remain an explicitly typed compatibility case at the reporting boundary. It must not participate in Lens enumeration or create a retained program Projection.

This follows the [accepted usage treatment](../docs/decisions/qualified-projection-construction.md#retain-investigation-selections-with-derived-revision-snapshots). Replacing the entire public usage schema is unnecessary for this work. Observation construction should distinguish a reporting request explicitly rather than casting its descriptor to a Lens.

## Subject applicability and selection

Applicability answers whether the question, with its selected lens parameters, is meaningful for the supplied subject. It does not promise that an analysis provider is available, that evaluation will succeed, or that complete information exists. For example, a summary can apply to a module while inference is unavailable; a dependency Lens can apply to an opaque external module while its children remain unexamined.

The initial definition set should preserve these capabilities:

| Lens | Supported subject | Selection behavior |
| --- | --- | --- |
| `modules` | Configured project | Select the established module population with its qualifications. |
| `organization` | Configured project or repository | Preserve the distinct project and repository populations. |
| `dependency-structure` | Configured project | Preserve project structure and opaque endpoints. |
| `inspect` | Modules, groups, their existing mixed lookup result, or an exact investigram | Preserve all exact program-name matches; inspect an investigram by precise reference. |
| `dependency-children`, `dependency-parents` | Modules, including supported opaque external modules | Preserve all exact module matches and current direct relationships. |
| `summarize` | One module | Zero or multiple matches remain missing or ambiguous; do not invoke investigation. |
| `explain`, `decompose`, `examine` | One exact investigram | Preserve original-target semantics; refuse program subjects. |

Configured project and repository are subject forms, not new entity kinds. A list of accepted entity kinds alone cannot express these requests. Likewise, cardinality belongs in the contract: multiple matches are useful inspection results but do not authorize an arbitrary choice of summary subject.

Separate three responsibilities:

1. **Resolve designation.** Interpret a literal within the declared lookup population, or resolve a precise session reference to its actual target and kind. Preserve zero, one and multiple matches and the basis for any completeness claim.
2. **Check application.** Check the Lens's subject forms and cardinality. A known group with a dependency Lens is unsupported, not unknown. A module that lacks analysis support is a different case.
3. **Evaluate and construct.** Materialize applicable requirements and construct the qualified result, or retain a qualified unsupported selection without executing the refused analysis.

These are responsibilities, not a requirement for three universal pipeline objects. Literal lookup may require Evaluation to establish its population. A bound reference already supplies a target kind and can be checked before dependency analysis or hosted investigation. Keep request validation in core as well as the CLI, so direct session callers receive the same semantics.

Reference lookup must be separate from checking membership in a Lens's selected population. Prefer a narrow read operation on the session's existing binding service for known bindings. Do not infer existence from a `group-` or `investigram-` prefix, scan arbitrary accumulated claims, or bind every retained subject merely to classify a request. The current `entityIds` operation allocates bindings; it is not a read-only reverse lookup. Preserve established allocation populations, timing and collision behavior for valid requests. The arrangement-side binding-only port must not gain lookup access.

Literal lookup should remain Lens-scoped. For example, `children src` searches module names and handles; it need not search groups to decide whether an identically named group would be unsupported. `children @group-…` supplies an exact group and must be refused accurately. Broadening all name searches to every subject kind would change ambiguity and selected populations without being needed for F2.

### Explicit refusal and independent status

For a bound group passed to children or parents, retain the requested canonical Lens, designation, actual target and unsupported kind. Expose `unsupported-subject-lens` consistently in structured output and explain in text that the reference resolves to a group but the Lens accepts modules. Report the command as unsuccessful, consistent with current unsupported-investigram requests. A subsequent `inspect` of the same reference must still succeed.

Keep reference resolution, Lens applicability and analysis materialization distinct. In particular, do not add `unsupported` as a spelling of `unknown-reference`, label the group as a selected module, or suggest that an empty relationship list proves there are no dependencies. Unknown references remain unresolved; known compatible targets outside a supplied evaluation population must retain that scope limitation rather than become unknown references.

Prefer a small shared selection/application descriptor carried by the existing record families, including explicit rejected targets where needed. Dependency-specific relationship content can remain empty for refusal without inventing a dependency Evaluation. Existing investigation refusal variants can carry the same meaning. The formal plan should settle the exact discriminated shapes and validation rules; it need not introduce a fifth universal Projection family or unify every family's counts.

## Subject designation and lens parameters

Retain three distinct pieces of meaning:

- **Designation:** how the request identifies its subject, such as configured project, repository, an exact literal name/handle, or a precise reference.
- **Selected subjects:** the actual target IDs or qualified population selected on the supporting basis, with resolution and applicability outcomes.
- **Lens parameters:** values that refine the question. Current lenses have none; their value is `{}`. Direct versus transitive reach remains a future capability.

Use the investigation family's `SelectionSelector` as a starting point, not as a complete shared model. Its literal, resolved-reference and unresolved-reference cases are useful, but `null` cannot by itself distinguish project and repository subjects. For precise references, preserve the normalized target in domain identity and retain the supplied spelling as request/reporting information where useful. Unresolved reference text remains explicit. Names that look like references stay literal when the request used literal syntax.

The subject is what is investigated; the lookup is its designation. This does not require deduplicating Projections by resolved subject. A lookup-based result also records what that designation selected, whether it was ambiguous or missing, and the population and basis on which it was resolved. Two requests can concern the same module yet legitimately produce distinct retained selection results.

Accordingly, preserve the existing identity distinction between a literal name lookup and a reference lookup that resolves to the same module. Do not attempt a universal query identity or workspace deduplication policy here. Include canonical Lens identity, true lens parameters, normalized designation and relevant selected result/basis in each family's identity as appropriate. Keep literal and resolved-reference key spaces disjoint, normalize only known reference positions, and distinguish an unresolved reference from the same reference after it becomes bound. Retain existing revision snapshots and exclusion of presentation/reporting inputs.

A common descriptor should expose this meaning across records, resolved content, Views and observations without replacing their family-specific qualified content. Associated inspection must describe the actual composite Projection and preserve the designation through its mechanical basis; it should no longer rely on substituting an ID into an unrelated-looking descriptor without an explicit derivation. F3 is not fixed if selectors move internally but observations still publish them as `lensParameters`.

Extract module matching and its qualified selection result from the module inspection constructor. Dependency constructors can then select subjects without creating or retaining an `inspect` Projection. Share that matching with module inspection and summary lookup where their semantics are equivalent, preserving each consumer's cardinality rules. Organization inspection may continue to construct its embedded module Projection because that qualified result is used. Selection helpers should consume explicit evaluation populations and coordinated references, not discover a broader population from the store.

## Correct observation meaning

Build observation request records from a normalized request descriptor, supplemented by the actual resolution/application outcome. Carry that descriptor through execution/publication if it cannot be faithfully obtained from retained content. Keep requested Lens and designation distinct from the produced Projection ID and schema. A rejected dependency request must still be recorded as that request.

Descriptions should combine the question with the designation mode rather than maintain another list of Lens string tests. For example, an explanation requested through an investigram reference should identify the explanation request and its session-local reference scope; an unsupported children request should describe dependency children and the unsupported target. Inventory wording belongs only to inventory. This also removes the misleading implication that every reference names an entity, since investigrams are subjects without being entities.

Publish actual lens parameter values, currently `{}`, separately from designation and selected-subject information. Preserve command outcomes, usage finalization, source-disclosure classification and observation delivery behavior. Unknown internal Lens values should fail validation, not acquire plausible fallback prose.

## Compatibility and boundaries to preserve

This is a visible schema and semantic change, even if most human output remains the same. Canonical dependency names, separated descriptor fields, new selection outcomes and corrected observation fields can affect JSON consumers and comparison tests. Recommend a coordinated change with explicit experimental schema versions where field meaning or layout changes, plus appropriate identity method versions. Avoid maintaining duplicate authoritative descriptors indefinitely. Keep only deliberately bounded compatibility adapters, such as the usage descriptor.

The current [construction decision](../docs/decisions/qualified-projection-construction.md#separate-projection-identity-from-presentation-and-reporting-identity) explicitly preserved schema layout and allowed only specified visible changes. A future accepted decision must authorize the new differences and identify any superseded provisions. Do not present them as incidental cleanup under that earlier decision. Whether the observation envelope version also changes depends on the chosen request-record contract; settle that before implementation. Historical observation files remain unchanged, with no migration or reader project implied.

Preserve qualified populations, deterministic ordering, method attribution, partial outcomes, immutable reference bindings and retained results. Preserve construction/arrangement separation and self-sufficient Views. Versioning may change Projection and View IDs; it should not become an excuse to change entities, analysis meaning, selected content or evidence. Comparison checks must account for intentional differences individually.

## Evidence a later implementation should provide

- Every Lens and usage reporting produce accurate request records through the real publication path, including follow-ups, exact inspection, unsupported combinations and unresolved references. Expectations should be independently stated, not generated from the same Lens table under test.
- The organization fixture reproduces the F2 journey: bind a group, inspect it, request children and parents, receive unsupported-subject outcomes, then inspect the still-valid group reference. Cover the existing investigram refusals and follow-ups on modules/groups as well.
- A fabricated reference with a known-looking prefix stays unresolved. Literal reserved-looking names stay literal. Mixed inspection and multiple module matches retain their current behavior; summary ambiguity does not invoke an investigator.
- Supported subjects with unavailable or partial analysis stay applicable but qualified. External dependency subjects retain their opaque-interior limitations. Unsupported requests initiate no hosted investigation or unnecessary dependency analysis once the kind is known.
- Dependency selection retains its requested Projection without retaining an unused inspection Projection. Organization's legitimate embedded Projection and associated inspection's mechanical basis remain intact.
- All published descriptors separate designation from empty lens parameters. Literal/reference distinctions, unknown-to-bound identity, repeated construction, reference collisions and equivalent-run comparison remain sound. Retained investigation reconstruction stays unchanged after later corrections or associations.

Use the existing dependency, investigation-selection, integration, shell, comparison and observation test infrastructure. A separate validation framework or live inference is unnecessary for these corrections.

## Discussion before a formal draft plan

| Choice | Recommended starting point | What could change the choice |
| --- | --- | --- |
| Inspection identity | One Lens, with subject-specific requirements and construction | Evidence that the variants are separately selectable questions rather than different detail for different subjects. |
| Lookup semantics and identity | Preserve designation and selected subjects; keep name/reference results distinct | An explicit product requirement for semantic deduplication, with a separate account of ambiguity and missing selections. |
| Refusal contract | Shared applicability meaning in existing families; accurate bound-target metadata and unsuccessful command outcome | A concrete advantage from a separate refusal result that also preserves the current retained unsupported-selection contract. |
| Lens definition scope | Semantic definitions and requirements, with execution wiring that makes additions local | An extension walkthrough may favor a registration table or shared interpretive execution path over manually extended dispatch. Keep interface dependencies out of semantic definitions. |
| Subject-specific composition | One Lens can select different operations and component Projections by subject and normalized parameters | Settle a concrete example's contribution meanings, unsupported combinations, partial outcomes and any synthesis dependencies before choosing an execution mechanism. |
| Ease of extension | Use the goal to assess this design; aim for prompt entries for ordinary interpretive additions | Decide whether a small declarative mechanism belongs in this work or a later slice, based on concrete integration needs. |
| Public compatibility | Version the affected experimental schemas; keep a bounded usage adapter | Known consumers needing a deliberate transition period. |
| Timing | Address explicit representation and F1–F4 as one coherent scope | If design remains unsettled, release targeted F1/F2 corrections with regressions first. They do not depend on adopting the complete proposal. |

The most useful follow-up discussion is about inspection identity, lookup identity, the refusal contract, and a concrete example of subject-specific composition. For that example, settle which contributions its parameters select, how they apply to each subject kind, and whether combination means preserving separate qualified sections or producing a new synthesis. Exact type and field names can follow those choices. GUI captions can use questions without deciding now whether the interface teaches the term “Lens.” Adding parameter editors, transitive reach, plugin registration, a generic planner, open/pinned Views or Projection redisplay would enlarge the implementation scope beyond the audit corrections.

Once the substantive choices are settled, a formal draft package can carry the proposed plan, consequential decision, exact compatibility changes and any needed governing-document revisions. It should explicitly account for the three relevant backlog entries and leave F5/F6 independently open. This note can continue to hold alternatives and discussion that do not belong in the eventual plan.
