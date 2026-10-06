# Representations of Lens, Projection, Presentation and View

Audit date: 2026-10-06
Audited revision: `dbf0abdf5738d2fcd3166b92f4d4d2f422b91b68` (source identical to `f630994`)
Task: [Audit representations of first-class user-model concepts](../../tasks/2026-10-06-user-model-concept-representations.md)
Governing basis:

- [product design §2.1](../../../foundation/product-design.md#21-lenses-projections-presentations-and-views) and the [interaction model](../../../foundation/product-design.md#3-interaction-model);
- [core concepts](../../../docs/core-concepts.md#investigation-and-representation) and [architectural constraints](../../../docs/architectural-constraints.md);
- the engineering guideline that concepts first-class in the user model should normally have explicit representations in the code ([`dev/engineering-guidelines.md`](../../../dev/engineering-guidelines.md#dependencies-and-boundaries)).

## Scope and method

The audit read the current request path from command parsing to published observation:

- `src/lib/commands.ts` and `src/lib/session.ts`;
- every Projection constructor: `projections.ts`, `organization/projections.ts`, `dependencies/projections.ts` and `investigation/selection.ts`;
- the record types and resolved content modules;
- every `create*View`, `arrange*` and `render*` function;
- `investigation/associations.ts`, `reference-binding.ts`, `observations.ts` and the worker/shell usage finalization.

It also read the decisions that shape these concepts. These are the [initial projection architecture](../../../docs/decisions/initial-projection-architecture-decisions.md), [transient sessions](../../../docs/decisions/transient-analysis-sessions.md), [qualified Projection construction](../../../docs/decisions/qualified-projection-construction.md) and [operations and lenses](../../../docs/decisions/investigation-operations-and-lenses.md). The GUI notes under `notes/gui/` were used only as context for what a GUI is likely to need. They were not treated as requirements.

Two suspected defects were reproduced against the built code. The probes are described under [Findings](#findings). No source was changed.

The earlier [view-builder audit](../2026-10-05-view-builder-boundary/REPORT.md) predates the construction/arrangement separation. Its conclusions were not reused.

## Summary

| Concept | Explicit representation | Assessment |
| --- | --- | --- |
| Lens | None. Lens identity is a string tag that differs between request, Projection record, View and observation. Applicability, requirements and dispatch are coded inline in `requestExecutor`. | Below the guideline. Two confirmed defects follow from the scattered representation (F1, F2). |
| Projection | Four immutable, addressable record families with deterministic identity and resolved, qualified content values. | Strong. The governing invariants are represented and enforced. Subject and lens-parameter fields are conflated (F3), and one constructor retains an unrequested Projection (F4). |
| Presentation | A shared parameter record `{ format, sourceDetail }` plus one arrangement function per Projection family. Other presentation inputs travel outside that record. | Adequate for the CLI. Presentation choice, presentation parameters and display bounds are fused into `format` (F5). |
| View | Typed, schema-versioned, self-sufficient values with deterministic identity, published through observations. Views have no lifecycle beyond one command. | Adequate for the transient CLI, as the session decision intends. There is no way to present an existing Projection again (F6). |

The Projection layer and the arrangement boundary need no change. The actionable work is concentrated in Lens: a single representation of lens identity and subject applicability would remove the cause of F1 and F2. It would also give a GUI the lens enumeration and captions it will need.

## Concept mapping

### Lens

**Role in the user model.** A lens is the question asked of a subject. It can take parameters that refine the information requested, and a composite lens combines other qualified projections. A [projection's](../../../docs/core-concepts.md#projection) identity includes its lens and lens parameters. The [initial projection decision](../../../docs/decisions/initial-projection-architecture-decisions.md#separate-lens-requirements-evaluation-and-projection-construction) assigns a lens the information requirements its projection needs. In the [interaction model](../../../foundation/product-design.md#31-investigation-and-representation-selection), the human or PostCode selects a lens for a subject. Views offer [contextual lens application](../../../foundation/product-design.md#34-navigation-through-views) to displayed subjects.

**Representation.** No type, value or registry represents a lens. A lens exists only as string literals in several separate vocabularies:

- Request: `ViewRequest.lens` has 11 values (`src/lib/session.ts:36`). These include `usage`, which the [construction decision](../../../docs/decisions/qualified-projection-construction.md#retain-investigation-selections-with-derived-revision-snapshots) says is not a Lens.
- Module Projection: `'modules' | 'inspect'` (`src/lib/records.ts:196`).
- Organization Projection: `'organization' | 'inspect'` (`src/lib/organization/records.ts:92`).
- Dependency Projection: `'dependency-structure' | 'dependency-children' | 'dependency-parents'` (`src/lib/dependencies/records.ts:91`). The same requests are spelled `dependencies`, `children` and `parents` elsewhere.
- Investigation selection: `InvestigationLens` (`src/lib/investigation/selection-record.ts:6`), which includes `inspect`, `children` and `parents`.
- Investigation View request: a separate union including `usage` (`src/lib/investigation/presentation.ts:20`).

What each lens means operationally is coded where it is used:

- **Subject kinds accepted.** `session.ts:146-171` decides investigram support. Dependency lenses have no check (see F2).
- **Requirements.** `session.ts:182-189` chooses which evaluations run.
- **Constructor and Presentation.** `session.ts:190-206` chooses them.
- **Command validity.** `commands.ts:100-112` checks it.
- **Observation description.** `observations.ts:44-48` describes the request.

The lens-to-operation mapping is written twice: `session.ts:143` and `investigationOperations` in `selection-record.ts:7`.

**Parameters.** No current lens has a lens parameter in the governing sense. Direct and transitive reach would be one, but children and parents are separate lenses, and `InvestigationRequest.parameters` is typed `Record<string, never>` (`src/lib/investigation/contracts.ts:9`). Mechanical Projection records do have a `parameters` field, but it holds the subject selector (F3).

**Identity, lifecycle and invariants.** Lens identity matters only as a tag inside Projection identity. A lens has no lifecycle. Two of the invariants that a lens is supposed to carry are honoured, but only by the request dispatcher, not by any lens representation:

- requirements are declared before Evaluation;
- presentation requirements are kept separate from lens parameters.

**GUI support.** A GUI would need to:

- list the questions available for a focused subject, which requires lens applicability by subject kind;
- caption each View with its question, as the GUI analysis-needs note proposes (item N20);
- let the human edit lens parameters in place.

None of this can be derived from the current code without copying the dispatcher's string tests. The `inspect` tag names four different Projection variants, and `children` and `parents` change spelling between layers. Neither tag therefore gives a stable lens identity for captions, telemetry or agent context.

### Projection

**Role in the user model.** A projection is the qualified answer to a lens applied to a subject in a program state. It is [addressable within its session](../../../docs/core-concepts.md#projection), immutable once produced, and identifies its subject, lens, parameters and supporting basis.

**Representation.** There are four record families in `ProgramRecordStore`:

- `ProjectionRecord`, for module inventory and inspection (`records.ts:194-211`);
- `OrganizationProjectionRecord` (`organization/records.ts:90-111`);
- `DependencyProjectionRecord` (`dependencies/records.ts:89-115`);
- `InvestigationSelectionProjection`, with request, historical-inspection and associated-inspection variants (`investigation/selection-record.ts:15-37`).

Each family has a resolver that turns the record into frozen, qualified content without display bounds: `resolveModuleProjection`, `resolveOrganizationProjection`, `resolveDependencyProjection` and `resolveInvestigationContent`. `QualifiedRecord`/`QualifiedContext` (`projection-content.ts`) keep each record attached to its Claim context, captured inputs and evidence.

**Identity.** Identity comes from `recordId` over the method, lens, normalized selector, reference flag and evaluation basis (`projections.ts:51`, `organization/projections.ts:85`, `dependencies/projections.ts:77`). For investigations it is the full semantic payload with reference positions normalized (`selection-record.ts:40-69`). A resolved reference and a literal selector use disjoint key spaces. Presentation inputs are excluded, as the [identity decision](../../../docs/decisions/qualified-projection-construction.md#separate-projection-identity-from-presentation-and-reporting-identity) requires.

**Lifecycle and invariants.** Projections are retained by `store.put` and never mutated. Revision state is snapshotted at construction, so resolving an investigation selection does not consult later history. A later evaluation produces a new evaluation basis and therefore a new Projection, which preserves earlier results. Selection status is explicit:

- `referenceStatus`, `populationEstablished` and `materialization` for the mechanical families;
- `status` for investigations (`selected`, `ambiguous`, `missing` or `unsupported-subject-lens`).

These representations meet the governing invariants: immutability, retained qualification, no broadening by unrelated accumulated work, and distinct evaluation outcomes.

**Subject.** The subject is represented differently in each family:

- Mechanical families store a category string in `subject` (`configured-project`, `selected-modules`, `selected-entities` or `repository`), the designation in `parameters.selector`, and the resolved subjects in `modules`, `groups` or `subjects`.
- The investigation family stores a structured `SelectionSelector` (`literal`, `reference` or `unresolvedReference`) and a separate `subjects` list. This keeps designation, resolution and lens apart.

**GUI support.** The resolved content values form the interface-independent boundary that the decision intends GUI arrangement to consume. A GUI can present them without store access. The four families share no common shape for lens, subject and parameters, though. Generic operations need that shape: pinning, captioning, [agent-context listing](../../../foundation/product-design.md#371-shared-machine-readable-context) of "lens, lens parameter values, subject, projection", and observations. Each such operation would have to switch on four record shapes.

### Presentation

**Role in the user model.** A presentation describes how a projection is rendered, interacted with or exposed. It is selected independently of the information requested and has its own parameters, such as sorting, grouping, layout, filtering and expansion depth. It may declare standard expansions, which must precede Evaluation. Text and machine-readable data are both presentations.

**Representation.**

- **Parameters.** The `Presentation` record `{ format: 'unicode' | 'json'; sourceDetail: boolean }` (`src/lib/presentation.ts:17-20`) is shared by all families.
- **Behaviour.** One arrangement function per family carries the presentation logic: `arrangeModuleView`, `arrangeOrganizationView`, `arrangeDependencyView`, `arrangeInvestigationView` and `arrangeAssociatedInvestigations`.
- **Rendering.** Each family has a separate render function.
- **Declared requirements.** These are per-family constants: `presentationRequirements`, `organizationPresentationRequirements` and `dependencyPresentationRequirements`. `presentationRequirements` ignores its argument.

The arrangement side of the construction boundary is represented explicitly and enforced:

- arrangement takes resolved content, coordinated bindings or the binding-only port, and presentation inputs;
- it takes no store (`reference-binding.ts`, `presentation.ts:72`, `organization/presentation.ts:106`).

**Parameters.** The presentation inputs are spread across three places:

- `format` selects both the output encoding and the display bounds. Examples are 150 groups, 6 levels and 12 module leaves when `format === 'unicode'` (`organization/presentation.ts:144-157`), with similar bounds in `dependencies/presentation.ts:74-76,110,139` and `presentation.ts:75,84,94`.
- `sourceDetail` is a disclosure expansion.
- Continuation (`after`), `revisionPage` and `referenceLifetime` are presentation inputs carried on `ViewRequest`/`InvestigationViewRequest`, outside `Presentation`. They still enter View identity correctly.

There is no representation of presentation context. Terminal width is a constant 88 inside arrangement (`presentation.ts:182`).

**GUI support.** A GUI Presentation would arrange the same resolved content under its own policy. That is permitted, and the decision expects it. The shared `Presentation` type cannot describe a GUI presentation or its parameters, because bounds are keyed to the two CLI formats. Population-wide reference binding, which the decision requires to keep its established order, is coordinated inside each `create*View` function (`presentation.ts:65-69`, `organization/presentation.ts:97-104`, `dependencies/presentation.ts:56-61`). A GUI would therefore either reimplement that coordination or call functions that also perform CLI arrangement.

### View

**Role in the user model.** A view is an instantiated presentation of a particular projection. Different presentations or parameter values give distinct views. Presentation context may change rendering without changing identity. In the full product, views live in a [workspace](../../../foundation/product-design.md#33-workspace-model): they can be live or pinned, embedded, and linked by derivation. The [session concept](../../../docs/core-concepts.md#session) explicitly excludes "a workspace of managed views" from the current session.

**Representation.** There are four View types: `QualifiedView`, `QualifiedOrganizationView`, `QualifiedDependencyView` and `InvestigationView`, each with an experimental schema name. Associated inspection adds an `investigations` section to a mechanical View. Each View carries a `projection` descriptor, its `presentation`, qualifications, evaluation outcomes, arranged content and explicit omission accounting.

**Identity.**

- Mechanical: hash of the Projection, the `Presentation` and the presentation method (`presentation.ts:151`, `organization/presentation.ts:180`, `dependencies/presentation.ts:185`).
- Investigation: an arrangement key covering the Projection, presentation, continuation, page, lifetime and invocation reporting, then hashed again with the finalized usage report (`investigation/presentation.ts:184-209`).
- Associated inspection: composite Projection, base View, continuation and lifetime (`investigation/associations.ts:65-67`).

These formulas are the ones the [identity decision](../../../docs/decisions/qualified-projection-construction.md#separate-projection-identity-from-presentation-and-reporting-identity) chose.

**Lifecycle.** A View is produced per command and is self-sufficient. The parent can re-render it after usage finalization without store access (`interactive-session.ts:144-149`). It is published as a `qualified-view` observation record together with its rendered output and classified source disclosure (`observations.ts:31-57`). It is not retained in the session store, and no operation accepts a View or Projection ID.

**GUI support.** The View identity formulas and the self-sufficiency of arranged values carry over to a GUI. Several things do not exist yet:

- an open-view lifecycle;
- live/pinned binding;
- embedding;
- derivation relationships.

The session decision defers these deliberately, and building them now would be speculative. The `projection` descriptor inside a View has a different shape in each schema. In associated inspection it combines the composite Projection's ID with the mechanical Projection's lens, subject and selection (`associations.ts:65`).

## Findings

### F1. Observations describe follow-up investigation requests as configured-project inventory

**Affected behaviour.** `observationBatch` builds the observation `request` record's `navigation` description from string tests on `view.projection.lens` (`src/lib/observations.ts:44-48`). Those tests recognize `inspect`, `dependency-children`, `dependency-parents`, `summarize`, `usage`, `organization` and `dependency-structure`. Every other lens falls through to "Configured-project inventory requested."

Investigation Views carry the request lens (`investigation/presentation.ts:182`). As a result:

- `explain`, `decompose` and `examine` requests on an `@investigram` reference are recorded as inventory requests;
- so are `children` and `parents` requests on an investigram, which produce an `unsupported-subject-lens` selection.

**Evidence.** A probe called the built `observationBatch` with each lens value and `reference: true`. `explain`, `decompose`, `examine`, `children` and `parents` all returned "Configured-project inventory requested." `inspect`, `dependency-children` and `summarize` returned their intended descriptions. No test covers the navigation text for these lenses.

**Consequence.** Observations are the research record of PostCode use. A follow-up made through a session-local investigram reference is described as a reference-free inventory request. The description therefore misstates what the human asked for and the reference scope of the request.

**Cause.** There is no single lens representation. `observations.ts` keeps its own lens list, and that list fell behind when the follow-up lenses were added.

### F2. A bound group reference given to `children` or `parents` is reported as an unknown reference

**Affected behaviour.** The dependency lenses resolve their subject by calling the module `inspect` constructor (`dependencies/projections.ts:30`), which matches only modules. A group reference that is bound in the session therefore produces a dependency Projection with `matches: 0` and `referenceStatus: 'unknown-reference'`. The CLI renders "0 exact matches · unknown-reference".

The same shape of request, with a valid reference of a kind the lens does not accept, is handled explicitly in the investigation family:

- `children @investigram-…` gives `unsupported-subject-lens` (`session.ts:150`);
- `explain @module-…` gives `unsupportedSubject: 'program-subject'` (`session.ts:166-169`).

**Evidence.** A probe opened a session on a copy of `fixtures/organization` and ran `organization` to bind `@group-8cc331fe` (`src`). `inspect` on that reference reported `1 current`. `children` and `parents` on the same reference each reported `0 unknown-reference`.

**Consequence.** The status contradicts the [reference-binding constraint](../../../docs/architectural-constraints.md#session-references-and-retained-information) the human relies on: a reference once bound stays bound. The real reason is that the lens does not apply to groups. The human is invited to suspect that the reference has expired or is wrong. This conflicts with the preference for [explicit refusal or limitation](../../../docs/architectural-constraints.md#claims-and-qualification) over misleading output.

**Cause.** No representation states which subject kinds a lens accepts. Each family discovers applicability separately.

### F3. Subject designation is stored and reported as lens parameters

**Affected behaviour.** All three mechanical Projection families store the subject selector and the reference flag as `parameters: { selector, reference }` (`projections.ts:54`, `organization/projections.ts:86`, `dependencies/projections.ts:78`). The investigation View descriptor does the same (`investigation/presentation.ts:182`). Observations publish that field as `lensParameters` (`observations.ts:43`).

The governing definitions keep subject and lens parameters separate. Lens parameters "refine the information requested", and the projection identifies "its subject, lens, lens parameters". The investigation record already keeps them apart with `selector` and `subjects`.

**Consequence.** No lens has real parameters yet, so the conflation does not yet change any answer. Observations and JSON nevertheless already label a subject lookup as a lens parameter. When the first real lens parameter is introduced, such as direct versus transitive, it would share a field with subject designation. Its identity contribution and its caption would then have to be separated retroactively from four record shapes.

### F4. Dependency subject selection creates and retains an unrequested inspection Projection

**Affected behaviour.** `dependencyChildren` and `dependencyParents` resolve their selector by calling `inspect(store, basis, selector, reference)` (`dependencies/projections.ts:30`). That constructs and `store.put`s a module `ProjectionRecord` with lens `inspect`, and the dependency Projection copies its `selection`. No request asked for this Projection, and the dependency Projection does not reference it.

Organization inspection also calls `inspectModules`, but there the result becomes the embedded `moduleProjection` that the View displays (`organization/projections.ts:38`), so it is legitimate.

**Consequence.** The session holds addressable Projections that answer no lens request. Dependency subject resolution is also bound to the `inspect` lens's matching rules and its module-only population, which is the mechanism behind F2. The practical effect is small today. It matters once Projections become navigable or enumerable, for example in agent context or a workspace.

### F5. Presentation choice, presentation parameters and display bounds are fused into `format`

**Affected behaviour.** `Presentation.format` selects the encoding (Unicode text or JSON). It also selects every display bound and the terminal line budget used during arrangement (see [Presentation](#presentation)). Paging, continuation and reference lifetime are presentation inputs carried outside `Presentation`, on `ViewRequest`. No presentation parameter governs a bound directly.

**Consequence.** The current CLI behaves correctly, and View identity includes all of these inputs. However, the `Presentation` type cannot express:

- a presentation other than the two CLI formats;
- the presentation parameters the governing definition names, such as sorting, grouping or expansion depth.

A GUI Presentation would need a third `format` value threaded through every `arrange*` function, or its own arrangement that bypasses this type. The first option would leave GUI bounds hidden inside CLI arrangement code. The second would leave two unrelated representations of "Presentation". This finding becomes actionable when the GUI work is planned. No change is warranted before then.

### F6. A retained Projection cannot be presented again; every View request re-selects

**Affected behaviour.** The session API has only `execute(ViewRequest)` (`session.ts:114-137`). Every View, including a change of format, revision page or continuation, rebuilds its Projection from accumulated session state. For mechanical lenses this is harmless, because deterministic construction over the reused evaluation returns the same Projection ID.

For investigation selections, `createInvestigationView` always calls `selectInvestigation` (`investigation/presentation.ts:41-45`). This takes a fresh revision snapshot. Suppose a correction is accepted between `inspect @investigram-… ` and a later `--revision-page 2`. The second page is then a page of a different Projection. Its rows and statuses can differ from the selection that page 1 showed. The View records the new Projection ID only in JSON.

**Consequence.** The CLI effect is limited, because correction rows are ordered by acceptance and new rows mostly append. The governing model does let presentation and its parameters vary independently of the information requested. The decision's own identity checks expect "pages of one qualified result" to share a Projection. A GUI that pages, re-sorts or re-formats an open View would silently replace its Projection whenever investigation state has changed in between. Pinned views and agent-context references to a Projection have no way to present it again.

## Uncertainties that need a design choice

1. **Is `inspect` one lens?** The `inspect` command produces up to four Projection variants: module inspection, organization (group/mixed) inspection, exact investigram inspection, and the associated-inspection composite. `children`/`parents` likewise denote dependency questions for modules but are also accepted, and refused, for investigrams. A lens representation (P1) has to decide one of two things. Either these are single lenses whose meaning depends on subject kind, or they are distinct lenses that the CLI routes from one command word. That decision determines captions, observation labels and applicability tables.
2. **What is the subject of a lookup-based Projection?** Name lookup (`inspect foo`) and reference lookup (`inspect @module-…`) produce different Projection IDs with identical content, by design: the key spaces are disjoint. Two readings are possible. If the subject is the lookup, which can be zero, one or many matches, the current identity is right. If the subject is the resolved entity, two Projections answer the same question. The choice affects deduplication, pinning and comparison in a workspace, and how F3's separation should be shaped.
3. **What counts as presentation context?** The foundation says context changes rendering without changing View identity. Reference lifetime is included in investigation and associated-inspection View identity, and the decision treats it as a View input. Finalized usage is also part of investigation View identity. Within one session neither has any practical effect today. A GUI needs a rule: which of available space, interaction state, usage footers and reference lifetime are context, and which are parameters.
4. **Should `usage` remain lens-shaped?** It is carried as a lens value in requests, Views and observations as a documented compatibility descriptor. A lens representation would have to treat it as an exception or move it to a separate reporting request.
5. **How strongly user-facing is "lens"?** The GUI note proposes that lenses surface as questions and captions rather than as a named concept. Under either answer the system needs an explicit lens identity, applicability and caption source. The answer affects naming, but not the need for a representation.

## No change warranted

- Projection records, their deterministic identity, immutability, revision snapshots and qualified resolved content. These represent the governing invariants directly.
- The construction/arrangement boundary: no store access in arrangement, and a binding-only reference port.
- The View identity formulas, and the self-sufficient arranged View used for parent-side usage finalization.
- The absence of an open-view or workspace lifecycle. The current session concept excludes it, and adding it now would be speculative.

## Proposed follow-up work

These proposals are for separate consideration. None was implemented.

- **P1. Represent lenses explicitly (addresses F1, F2 and part of F3).** Introduce one lens vocabulary with, per lens:
  - an identifier;
  - the subject kinds it accepts;
  - its (currently empty) parameters;
  - its requirement declaration;
  - its constructor.

  Command parsing, session dispatch, the operation mapping and observation description would all derive from it. The smallest form is a typed table, not a framework. It needs Uncertainties 1 and 4 resolved first.
- **P2. Correct the two confirmed defects directly, if P1 is deferred.** For F1, describe follow-up and investigram-subject requests correctly and add tests for every lens. For F2, report a bound non-module reference given to dependency lenses as an unsupported subject for that lens, consistent with the investigation family. Changing F2's result status may need agreement on the dependency Projection's selection-status vocabulary.
- **P3. Separate subject designation from lens parameters (F3, F4).** Use a structured subject designation shared by the record families, modelled on `SelectionSelector`. Resolve dependency subjects without retaining an `inspect` Projection. This changes Projection record shapes and possibly identity, and depends on Uncertainty 2.
- **P4. Before GUI presentation work: separate presentation selection from bounds, and expose coordination (F5).** Decide how a GUI Presentation and its parameters are represented. Decide also whether population-wide reference coordination becomes an interface-independent step that both CLI and GUI arrangements call.
- **P5. Decide whether a View can be requested for an existing Projection (F6).** If yes, add a request form that names a retained Projection with new presentation inputs. That would let paging and re-formatting keep the same Projection. This also bears on pinned views and agent-context references.

## Not examined

- Wording and usability of the rendered output.
- Correctness of Evaluation and of analysis results.
- Performance of re-selection on repeated requests.
- Hosted-investigation execution paths beyond their effect on selection and View identity.
