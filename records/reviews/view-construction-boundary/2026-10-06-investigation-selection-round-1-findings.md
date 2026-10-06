# Retained investigation selection checkpoint: findings

Record type: findings
Received: 2026-10-06
Reviewer: Claude Opus 5.5 (Claude Code), independent agent session arranged by the human
Handoff: [Retained investigation selection checkpoint](2026-10-06-investigation-selection-handoff.md)
Round: 1
Reviewed target: `3e1b94bc09bd4586d61c60de554f724f2b57bd3e` (diff range `5591775af0737d90911fb247d2007e75db1ab59c..3e1b94bc09bd4586d61c60de554f724f2b57bd3e`)

## Returned findings

### Scope actually reviewed

The full diff range above. That covers `selection-record.ts`, `selection.ts`,
`selection-validation.ts`, `investigation/content.ts`, `reference-binding.ts`,
the `revisions.ts` snapshot change and the `revision-page.ts` adapter, and the
adapter call sites in `presentation.ts`, `associations.ts` and `evaluation.ts`.
It also covers the store changes in `memory-store.ts` and `records.ts`, the
method registration in `identity.ts`, the investigator wire-reference traversal
in `openai/references.ts`, the new and changed tests, the comparison script, the
verification record and the comparison result, and the `docs/architecture/investigation.md`
addition. I judged the work against the approved proposal at `354f204`,
particularly "Retain investigation selections with derived revision snapshots",
"Reference-binding ownership" and the investigation rows of the family table,
and against the six focus areas in the handoff.

For context only, I read the existing CLI investigation builder (`createInvestigationView`),
`associatedView`, the investigator context's revision handling, evidence delivery,
the session request routing (`session.ts`) and the unavailable-outcome construction
in the OpenAI adapter. CLI arrangement over the new content, associated-selection
integration, the usage descriptor, and the View and arrangement identity changes
are deferred by design and were not reviewed.

### Method and verification performed

- I read the diff in full. I compared `derive()` and `validateInvestigationSelection()`
  line by line with the existing bounded queue in `createInvestigationView`, covering
  roots, primary selection, displacement, accompanying corrections, revision subjects,
  navigation, the reference population, the support set and the exposure pairs.
- `npm run check`: passed. `npm test` with loopback access and an unchanged checkout:
  **484 passed, 0 failed, 0 skipped**.
- I reproduced the revision differential. I built baseline `5591775` in a separate
  worktree and ran `node scripts/compare-investigation-revisions.mjs <baseline>/_build _build <report>`.
  It produced 875 comparisons over 175 accounts and 58 corrections, and the report
  was identical to the committed `2026-10-06-revision-comparison.json`. I read the
  script: it compares `before.status(id, page)` with `revisionPage(after.snapshot(id), page)`
  by `deepEqual` and by exact `JSON.stringify` field order, with no normalization.
- I ran ad hoc probes against the compiled target in a scratch directory, without
  repository changes. They covered the identity of inline unavailable outcomes, and
  store acceptance of request-variant combinations and of a valid payload under a
  non-derived ID. Results are reported below.

### Assessment by focus area

1. **Variants and identity.** All the authorized request rows are representable,
   and so are historical inspection (exact and missing) and associated inspection,
   including zero matches. Identity is the full payload except `id`, with only the
   inventoried positions in `mapReferences` normalized. Selector key spaces are disjoint:
   `literal`, `reference` and `unresolvedReference`. So a reference-shaped literal
   cannot collide with a resolved reference, and missing-to-bound selections get
   distinct IDs (tested). `reused` and attempt are absent, and so are pages, usage and
   absolute ranks. Inline unavailable outcomes are not inserted into the evaluation
   index (`memory-store.ts` indexes only `investigation-evaluation`), so reuse and
   retry are unchanged. See F1 for one identity input I consider questionable.
2. **Revision snapshots.** `snapshot()` is the old `status()` derivation with paging
   removed. Primary, family primary, conflict detection, the transitive affected sets
   with provenance and `completeCorrections` exemptions, the complete proximal `via`
   lists, and every inconsistency with reporter and ordinal are all retained. The
   records store results, not ranks. Validation of an old record and its reinsertion
   use only `get()` on fixed immutable records, so neither re-derives nor enumerates
   the session. The test with a throwing store and my reading of the validator agree.
3. **Queue replay.** The existing queue needs roots, original → selected (time-of-selection
   primary), `account.children`, `account.corrections` → `replacement`, and each displaced
   account's corrections. The record retains roots and every reachable original's
   relation, unbounded. The rest are fixed fields of immutable account and correction
   records. Repeated routes to one primary keep separate relation entries. The displaced
   set includes all composition descendants, and validation recomputes and checks both
   the graph and the displaced set. Navigation and composition parents are retained for
   every expanded account, which is a superset of what is displayed. Association order
   matches `associatedInvestigrams` (`store.investigations` × `investigrams` order). The
   associated-inspection basis and subjects match `session.ts` for module-only inspection
   (the embedded module Projection) and for mixed or group inspection (the organization
   Projection).
4. **Core content.** Content contains everything the CLI builder reaches. That includes
   accounts, corrections (accompanying, displaced and revision-row), every provenance
   those reach, and inconsistency reporters with their provenance. It also includes the
   support of all of those, with qualified context, captured inputs, sources and per-provenance
   exposure forms. Each is a superset that arrangement can filter to the displayed subset.
   The reference population covers every position the CLI currently binds: displayed,
   omitted and displaced accounts, correction parties, revision primaries and family
   primaries, row parties and complete `via` lists, inconsistency reporters and targets,
   including targets in account bodies, composition parents, module or investigram
   investigation subjects, and summarize candidates. Content is `freezeOwned` and
   structurally cloneable, and holds no closures.
5. **Validation and binding.** Store insertion checks kind and session for every inventoried
   reference. It checks graph and relation completeness, the revision population, correction-row
   parties, and inconsistency attribution against the reporter's ordinal. It rejects paged
   fields. All of this runs inside the existing atomic batch, and a rejected batch leaves no
   records (tested). `referenceBinding` validates the population once and rejects any batch
   with an ID outside the population, or of the wrong kind, before calling `entityIds`.
   Nothing is preallocated: the collision test shows the undisplayed colliding spelling is
   not reserved. The port exposes only `bind`. See F2 for combinations that validation still
   admits.
6. **Adapter compatibility.** The adapter rebuilds the exact old status shape and field order.
   Callers only spread these objects and never mutate them (`context.ts`), so the frozen
   shared inconsistency items are safe. Correction eligibility, exposure accounting and
   evaluation reuse code are unchanged. The new record kind is not reachable from evidence
   delivery's traversal (`evidence-delivery.ts` `compose`). Its addition to `openai/references.ts`
   only keeps the exhaustive switch total.

### Actionable findings

**F1 (medium; needs human direction before the record format is relied on): inline
unavailable outcomes embed per-attempt provider details, so Projection identity
varies per attempt.** `selection.ts` stores `result.unavailable` verbatim as
`outcome.value`. For communication or authentication failures, `openai/adapter.ts:50`
includes `provider: { status, body, requestId }`. Because identity is the full payload,
two otherwise identical failed requests on the same subject produce different selection
Projection IDs whenever the provider's `requestId` or error `body` differ. My probe
confirmed this: different `requestId` values gave different IDs. The approved text says
the variant "embeds the immutable unavailable outcome value, including code/diagnostic",
and that attempt identifiers naming reporting events stay in request or View reporting,
not in Projection identity. A provider request ID is that kind of reporting-event
identifier. The text doesn't settle whether `provider` belongs in the retained value.
Deciding now matters because CLI integration will hash this record into View identity.
Options:
(a) Retain only `kind`, `code` and `diagnostic`, and keep `provider` in request/View
reporting, as `attempt` is today.
(b) Explicitly accept per-attempt identity for unavailable selections, and document it.
Option (a) seems closer to the approved text. Either way, a test with `provider`
present would pin the choice; the current test omits it.

**F2 (low): construction and validation admit request combinations that the authorized
rows exclude.** Both `selectInvestigation` and `validateInvestigationSelection` accept
the following, which my probe confirmed:
(a) A `children` or `parents` request with `unsupportedSubject: null`. These lenses
appear only as unsupported investigram requests; program children and parents are
mechanical Projections.
(b) An operation lens with exactly one supported selected subject and `outcome: no-evaluation`.
By the request table and `session.ts:172`, a single supported subject always yields a
retained evaluation or an inline unavailable outcome.
Current callers can't produce either case, and the constructors are not yet wired in.
However, the record is the contract the integration will rely on, and the store validator
is the stated enforcement point. Suggest requiring `unsupportedSubject` for `children`
and `parents`, and requiring `status !== 'selected' || unsupported` for `no-evaluation`.

### Non-defect observations

- **Store does not verify derived IDs.** The store does not check that a selection
  record's `id` equals `recordId(session, kind, selectionIdentity(record))`. My probe
  inserted a valid payload under an arbitrary ID and the store accepted it. This
  matches how every other record kind is handled, since the store verifies no derived
  IDs. It is noted only because this record's identity is the subject of the approved
  text. A cheap check would make "identity derives from the full payload" enforceable.
- **Two account predicates.** `derive()` admits revision subjects by
  `index.accounts.has(id)`, while validation uses `get(id).kind === 'investigram'`.
  They differ only for an investigram not listed by any retained evaluation, which the
  store's evaluation-first retention makes unreachable. If the predicates are ever
  reconciled, prefer one shared helper.
- **No mechanical populations in the content reference population.** The bindable
  population in content omits the mechanical populations that the proposal's bullet
  list mentions. This is consistent with the proposal's table, where coordination,
  not the investigation port, allocates those populations and all associated matches.
  The integration should keep it that way rather than widen the port.
- **Method registration reaches more than session metadata.** Registering
  `investigation-projection@1` changes the session `methods` list, as the verification
  record says. `typescript/project.ts` also embeds `methods` in the `analysis-inputs`
  value, so that record's value and ID change in every session as well. This follows
  existing practice for method changes, but the later full comparison should account
  for it explicitly alongside the session method list.
- **Retained snapshot size.** `derive()` stores full snapshots for every associated
  match and every displaced descendant. This is as approved. Retained size grows with
  dense correction histories, and that was not characterized.

### Unverified areas and residual limits

- **Deferred integration.** I didn't review the CLI arrangement, the associated-selection
  wiring, the usage descriptor, the View or arrangement identity changes, or worker
  finalization, because they are deferred. Equivalence of a replayed queue over this
  content with existing output is argued from code reading, not demonstrated. The later
  integrated comparison must show it.
- **Investigator-context adapter.** Its equivalence rests on the revision differential
  and the existing tests. I did not run a separate investigator-context comparison.
- **Performance.** No performance or memory characterization was done.

### Recommendation for the stated gate

The core checkpoint is **sound enough to proceed to CLI integration**, subject to a
human decision on F1 first. F1 changes the retained identity input that integration
will hash. The retained relations and immutable records are sufficient to replay the
existing bounded queue. Revision snapshots preserve the full derivation, and the
adapter reproduces existing delivery exactly. Validation and the binding port enforce
the approved boundaries, with the gaps noted in F2. F2 can be corrected within the
authorized task. This is a reviewer recommendation only, not human acceptance of the
checkpoint.
