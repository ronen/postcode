# View builders and the views and analysis boundary

Audit date: 2026-10-05
Audited revision: `bd701d9b753d9c3ee6160ff49a24f854a72f331c`
Task: [Audit view builders against the interface analysis boundary](../../tasks/2026-10-05-view-builder-boundary-audit.md)
Governing rule: [views and analysis boundary](../../../docs/architectural-constraints.md#views-and-analysis-boundary), from [Keep views grounded in core projections](../../../docs/decisions/keep-views-grounded-in-core-projections.md)

## Scope and method

The audit read every function that turns stored records into a view value or rendered text:

- the module view: `createView` and `renderUnicode` in `src/lib/presentation.ts`, plus `src/lib/composition-view.ts`;
- the organization view: `createOrganizationView` and `renderOrganizationView` in `src/lib/organization/presentation.ts`;
- the dependency view: `createDependencyView` and `renderDependencyView` in `src/lib/dependencies/presentation.ts`;
- the investigation view: `createInvestigationView` and `renderInvestigationView` in `src/lib/investigation/presentation.ts`;
- associated-investigram listing: `associatedView`, `withAssociatedInvestigations` and `renderAssociatedInvestigations` in `src/lib/investigation/associations.ts`;
- the revision derivation those builders use: `src/lib/investigation/revisions.ts`.

It also checked the interface modules (`src/cli.ts`, `src/lib/cli.ts`, `commands.ts`, `shell.ts`, `interactive-session.ts`, `command-execution.ts`, `session-worker.ts`, `observations.ts`). None of them reads the record store or claim information. Each one only dispatches requests, finalizes usage reports and handles rendered views.

Every operation was placed in one of three classes:

- **Arrangement**: it sorts, groups, filters, bounds, labels or counts information that the Projection, its claim contexts, its supporting evidence or its evaluation outcomes already supply.
- **Core selection or derivation**: it selects or derives information under a rule set by an accepted decision, and does so in interface-independent code that other core work also uses.
- **New Claim**: it establishes something about an investigated subject or a retained interpretation that no core capability establishes.

The audit judged each operation by its responsibility, not by the name of its file or function.

## Result

No operation was confirmed as a clear violation, and no code was changed.

Most of the boundary questions depend on one choice that has not been made: whether the `create*View` builders are Projection construction or Presentation. That choice is described in [Finding A](#a-the-role-of-create-view-builders-is-not-assigned). Findings B and C are only conforming or nonconforming depending on how A is answered, so they are reported here and not corrected.

## Operation inventory

### Module view

All operations are arrangement:

- ordering project modules first;
- collapsing external modules in compact inventory and disclosing the collapse;
- bounding exports and documentation;
- excluding fenced code and `@example`/`@see` tags from documentation excerpts, with the omitted characters and tags disclosed;
- grouping source evidence for displayed claims;
- moving project-wide limitations to the status section.

Status lines such as "effective exports established", and the distinction between "(none)" and "not established", come only from stored evaluation outcomes and their materialization. Population counts come from `projection.selection`.

### Composition view

`prepareCompositionViews` reads only the claim and evaluation IDs the caller's projection selected. `compositionAnnotation` labels claims that are present, and labels incomplete evaluations as "composition not established". This is arrangement.

### Organization view

These operations are arrangement:

- building the group tree, with its depth, group and module bounds, repeated references and pruning, all disclosed;
- splitting placement exceptions by outcome;
- renaming the placement reason `link-not-established` to "relationship-not-established";
- selecting source-detail links.

Group annotations repeat the `group-properties` claims. "None." and "None established" follow placement materialization. The repository exclusion counts and the unestablished-relationship count group the link and exclusion outcomes that capture and layout classified (`src/lib/repository/layout.ts`). They are labelled as repository-wide.

Two counts read beyond the projection's selected claims, or depend on whether expansion detail was requested. See [Finding B](#b-organization-counts-and-their-populations).

### Dependency view

These operations are arrangement:

- ordering component rows from the stored `projection.graph`;
- applying the edge, component, occurrence and source bounds, all disclosed;
- counting `nonEdgeRequests` and `coverage` by their stored outcomes;
- adding fixed limitation text.

The `opaque` label applies the dependency decision's rule that external interiors stay opaque to the module's `project` discovery facet. The "empty child set is not established" message follows from that rule. Organization classification comes from stored `DependencyOrganizationClaim`s.

`summary.projectModules` and `summary.discoveredModules` count the module evaluation that the projection is based on, not the projection. The render labels them "Materialized population" and "available for exact lookup". See [Finding B](#b-organization-counts-and-their-populations).

### Investigation view and associated investigrams

Revision status is computed by `InvestigationRevisions` in `revisions.ts`. That status covers whether an account is superseded, which replacement is primary or family primary, whether alternatives conflict, whether the account needs reconsideration, and the causes. It is core derivation. The constraints for [citation exposure and reconsideration](../../../docs/architectural-constraints.md#retained-interpretation) require it, and `src/lib/investigation/evaluation.ts` uses the same class to supply correction context to the investigator. The view builder uses it and does not reinterpret it.

`associatedInvestigrams` performs the explicit-association selection that the subject-associated inspection constraint requires. Evaluation uses it too.

`createInvestigationView` also does the following:

- chooses the primary for non-historical lenses and the exact original for inspection;
- walks composition without splicing displaced composition into replacements;
- looks up composition parents in reverse;
- lists the exposure forms that provenance records.

All of this selects or arranges retained records. None of it creates a new statement about an interpretation. The limitations text states that recency is not credibility and that needing reconsideration does not establish error.

These builders also construct their projection identity inside the view builder (`investigation-projection`, `associated-inspection-projection`). They keep no projection record, and they mix selection with presentation bounds. See [Finding A](#a-the-role-of-create-view-builders-is-not-assigned).

## Findings that need an architectural choice

### A. The role of `create*View` builders is not assigned

Each `create*View` function takes a stored Projection, or in the investigation case the session store, and a `Presentation` (`format`, `sourceDetail`). It returns a schema-versioned value. The CLI renders that value as Unicode or prints it as JSON, and the planned GUI would most likely consume it. The function has two kinds of responsibility at once:

- **Presentation-specific**: limits that depend on the format (component, edge, group, depth, export and documentation bounds when `format === 'unicode'`), terminal-width fitting of documentation excerpts, and compact collapsing.
- **Interface-independent dereferencing and derivation**: following claims to their contexts and evidence, gathering composition and organization expansions, and computing counts. For investigations it also does the core selection of which retained accounts, revisions and associations answer the request. Investigations have no stored Projection record at all, so this builder is the only place where their Projection is constructed.

Under the decision, a Projection holds the qualified information for a Lens's question, and a Presentation arranges it. The JSON form of these builders acts as both. Whether a given operation conforms therefore depends on the part of the builder it is in:

- If the builders are Projection construction (core), operations such as the counts in Finding B are core work and conform. However, format-dependent bounds and terminal fitting would then make core output depend on a Presentation.
- If the builders are Presentation, then investigation selection, reading evaluation-wide claims and computing counts over evaluation populations would all be Presentation code reaching past what its Projection supplies.

Settling this would mean doing one of the following:

- separating an interface-independent "materialized projection" value from presentation bounding;
- giving investigation lenses stored Projection records like the mechanical lenses;
- or recording that the JSON view schema is the core's projection contract and that format-dependent bounds stay core-side.

Any of these changes the architecture and is not a local correction. It should be decided before GUI Views start consuming these values.

### B. Organization counts and their populations

These items are not violations if the builders are core (Finding A). They would be if the builders are Presentation:

- **`display.externalModules`**: `createOrganizationView` counts `module-placement` claims with reason `external-module` over the whole organization evaluation (`outcome.claims`), not over the projection's selected claims. Every organization view, including inspection of one group, renders "N external modules outside this organization". The figure is an evaluation-wide total that the Projection does not establish. The decision says such a total "must come from a core capability" if it is not established by the Projection.
- **Per-group `artifacts` counts (`moduleAssociated`, `unanalyzed`, `opaqueBoundaries`)**: these are worked out by set difference between artifact-placement, module-placement and group-documentation claims. For selected groups the projection includes every placement into the group, so the counts cover the population they name. The unanalyzed status also comes from the [repository organization decision](../../../docs/decisions/repository-organization-decisions.md#expose-repository-organization-rather-than-only-module-folders). However, no stored claim represents that status; it exists only as this subtraction. For context groups whose detail was `not-requested`, the JSON reports zero counts. It distinguishes those zeros from established zeros only through the separate `detail` field.
- **Dependency `summary.projectModules`/`discoveredModules`**: these count the module evaluation that the projection is based on, by discovery facet. The render names that population, so the disclosure is adequate. The count still sits outside the projection, which raises the same question as the first item.

Moving these totals into Projection construction would follow the module projection, which already stores `selection.population`. It would change Projection record shapes, though, and the right shape depends on Finding A, so the audit made no change.

## Not examined

- The audit did not reassess whether existing wording or bounds are good presentation. The [whole-journey UI review](../../../docs/backlog.md#review-the-investigation-ui-and-ux-as-a-whole) backlog entry covers that.
- It did not test whether evaluation materialization is correct.
- It covered GUI work only as far as the boundary applies to existing code; no GUI code exists yet.
