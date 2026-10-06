# Qualified construction boundary final integrated review: findings

Record type: findings
Received: 2026-10-06
Reviewer: Claude Opus 5.5 (Claude Code), independent agent session arranged by the human
Handoff: [Qualified construction boundary: final integrated review](2026-10-06-integrated-construction-handoff.md)
Round: 1
Reviewed target: `16ec9ae261715735aa44f62e969ae0f49dc2942e` (diff range `b34e8ee43db39610de4189cd967fbd92e16a6592..16ec9ae261715735aa44f62e969ae0f49dc2942e`)

## Returned findings

### Scope actually reviewed

I reviewed the source, test, script, documentation and decision changes in the
full diff range above. This covers:

- **Mechanical content and arrangement:** `projection-content.ts`, `module-content.ts`,
  `composition-content.ts`, `organization/content.ts`, `dependencies/content.ts`,
  `qualification-view.ts` and `composition-view.ts`, plus the arrangement and
  rendering changes in `presentation.ts`, `organization/presentation.ts` and
  `dependencies/presentation.ts`.
- **Investigation selection and arrangement:** the selection record, construction
  and validation (`selection-record.ts`, `selection.ts`, `selection-validation.ts`),
  `investigation/content.ts`, `reference-binding.ts`, the `revisions.ts` snapshot
  and `revision-page.ts` adapter, `investigation/presentation.ts`, `associations.ts`
  and `evaluation.ts`.
- **Store, identity and wiring:** store validation and indexing (`memory-store.ts`,
  `records.ts`), method registration (`identity.ts`), the investigator reference
  encoder, request coordination (`session.ts`) and worker-to-parent finalization
  (`interactive-session.ts`, `session-worker.ts`, `session-protocol.ts`).
- **Evidence and documentation:** the new and changed tests, the three comparison
  scripts and their committed reports, the integrated verification record, the
  promoted decision, the architectural-constraints additions, the architecture and
  CLI-reference changes, the implementation conventions and the backlog removal.

I judged the work against the accepted decision, the task's human resolutions
(including F1(a) and the F2 zero-group rule) and the seven focus areas in the
handoff. I read the intermediate checkpoint findings and dispositions only for
context. For context outside the range, I also read the OpenAI adapter's failure
construction, `execute.ts` outcome handling and the organization Projection
construction in `organization/projections.ts`.

### Method and verification performed

- **Code reading:** I read the full source diff. I compared each `arrange*`
  function line by line with the builder it replaced at the baseline, checking
  every former `store.get` and `store.entityIds` site.
- **Automated checks:** `npm run check` passed. `npm test`, with loopback access
  and an unchanged checkout, gave **486 tests: 486 passed, 0 failed, 0 skipped,
  0 cancelled**.
- **Comparison reproduction:** I extracted and compiled `b34e8ee`, `5591775` and
  the target in the scratch directory, outside the repository. From the repository
  root I ran the three comparison scripts as the verification record directs. The
  results matched the committed reports:
  - **Mechanical:** 632 Views (152 module, 216 organization, 264 dependency),
    30 incomplete organization cases and 708 View-ID substitutions.
  - **Investigation:** 486 cases (384 investigation, 102 associated), with three
    captured-input comparisons and no differences.
  - **Revisions:** 875 exact results.

  The mechanical comparison must run from a git checkout. An extracted tree has no
  repository capture and gives a smaller organization population (552 Views).
- **Allowance audit:** I read each script's allowances and normalizations (focus 7).
- **Probe:** I ran the investigation comparison against a copy whose unavailable
  fixture uses the production provider-failure key order (F1).

### Assessment by focus area

1. **Construction versus arrangement.** `resolve*` functions own qualified selection
   and population-derived counts:
   - **Organization:** the external-module total, per-group artifact summaries with
     their basis and classification, and the repository summary.
   - **Dependency:** the discovered and project-module totals and the
     request/coverage counts.
   - **Investigation:** selection, revision snapshots, support and exposure pairs.

   `arrangeModuleView`, `arrangeOrganizationView`, `arrangeDependencyView`,
   `arrangeInvestigationView`, `arrangeAssociatedInvestigations` and
   `arrangeAssociatedInspection` receive no store. Mechanical arrangement receives
   pre-allocated binding maps. Investigation arrangement receives a frozen object
   whose only method is `bind`. Embedded module inspection arranges the resolved
   `moduleDetail` with coordinated `detail` bindings. Associated inspection uses the
   shown View's Projection as its basis: the embedded module Projection for
   module-only routing, otherwise the organization Projection. Store validation
   checks the subjects against that basis. The associated domain query moved to
   `selection.ts`, so `evaluation.ts` no longer imports presentation code.
2. **Retained records.** Selection identity hashes the full payload except `id`,
   normalizing only the inventoried reference positions. Unavailable outcomes
   retain only `kind`, `code` and `diagnostic`. Provider status, body and request
   ID go to `InvestigationReporting` and enter only the arrangement key, as F1(a)
   requires. The validator rejects:
   - `children` or `parents` requests without an unsupported investigram;
   - `no-evaluation` with a selected supported subject;
   - extra keys on the unavailable outcome;
   - paged fields in snapshots;
   - incomplete selection graphs, relation sets or revision populations;
   - inconsistency attribution that does not match the reporter's ordinal.

   This resolves the earlier F1 and F2. Resolution re-reads only fixed references
   and never calls `sessionRevisions`. Lens and evaluation distinctions remain
   explicit in `lens`, `variant`, `outcome` and `status`.
3. **Bounded investigation display.** The queue replay uses retained relations in
   place of a live `primary()` call, together with immutable children and
   accompanying corrections. Displaced handling still runs before the
   duplicate-body check, and the 256-account bound is applied in the same place.
   Revision pages come from `revisionPage` over snapshots.

   Support is still gathered from displayed accounts, corrections and page
   inconsistencies. Exposures are filtered to the collected provenances in their
   insertion order. Source detail comes from core-supplied `sources` filtered by
   the same predicate as before.

   Content provides every record that arrangement dereferences: displaced
   descendants and their corrections, revision-row corrections, and inconsistency
   reporters with their provenance.
4. **Reference allocation.** The order is unchanged:
   1. displayed investigram set;
   2. module investigation subjects;
   3. per-candidate module binding;
   4. all associated matches, after mechanical or investigation arrangement.

   Mechanical coordination binds the discovery population, the organization groups
   followed by modules, and the embedded `detail` population. The port validates
   the whole batch before calling `entityIds`, and the population covers every ID
   the replay binds. Both differential scripts compare the complete `entityIds`
   call schedules.
5. **Identity.**
   - **Projection:** IDs exclude format, pages, continuation, lifetime, usage and
     reporting.
   - **Arrangement key:** contains the presentation, normalized continuation,
     `revisionPage ?? 1`, lifetime and reporting, with `attempt` normalized as a
     reference.
   - **Associated-inspection View ID:** follows the approved formula. Its
     continuation resolves only within the frozen matches. Unknown tokens are
     `{ literal }` values and absent tokens are `{ none }`.
   - **Usage:** subjectless usage has a constant per-session descriptor ID.
   - **Worker finalization:** the worker reply carries `investigationArrangementKey`
     beside the View. `interactive-session.ts` requires the key and finalizes with
     the sealed `usageReport()` without store access. The closing-window
     integration test captures the key from the real worker message.
6. **Organization classification.** The per-group predicate and the closing
   predicate use the same View fields. A materialized group's state depends only
   on the shared repository and placement outcomes, so the closing check, which
   uses `materialized`, matches the per-group checks and applies with zero groups.
   Context groups receive only `group`, `group-properties` and containment claims
   (`organization/projections.ts`). Their zero `unanalyzed` value therefore never
   shows the incomplete tree annotation. JSON fields and numbers are unchanged.
7. **Comparison allowances.**
   - **Mechanical:** substitutes only `@26` View IDs, recomputed with the old
     formula, including embedded Views. It applies the three permitted wording
     rewrites only when the old View's fields are incomplete.
   - **Investigation:** substitutes top-level View and Projection IDs, plus the
     qualification `inputs` reference when the captured value differs. It
     separately asserts that the method registry changes exactly as permitted, and
     then gives both observation batches the same method context.
   - **Envelope IDs:** observation-envelope IDs are mapped by role.

   No other fields are erased. Two limits apply. The investigation fixture is
   narrower than production in the case reported as F1. It also exercises only
   `summarize`, `inspect`, `usage` and `summarize`-shaped unsupported or
   unavailable requests. The follow-up lenses, `program-subject` unsupported
   requests and organization-routed associated inspection rely on unit tests rather
   than this differential.

   The decision, constraints, architecture text and CLI reference match the
   implementation.

### Actionable findings

**F1 (low–medium; exact JSON/observation change outside the permitted set): real
provider failures serialize `result.unavailable` with a different key order.**

- **Cause.** `arrangeInvestigationView` (`src/lib/investigation/presentation.ts`,
  the `unavailable:` reconstruction) rebuilds the reported outcome as
  `{ ...selection.outcome.value, ...(reporting.provider ? { provider } : {}) }`,
  which gives key order `kind, code, diagnostic, provider`.
- **Production shape.** The only production source of `provider` is
  `failure()` in `src/lib/investigation/openai/adapter.ts:50`. It constructs
  `{ provider, kind, code, diagnostic }`, and `execute.ts` passes this through
  unchanged. The baseline View serialized that object as received.
- **Effect.** For every HTTP-level OpenAI communication or authentication failure,
  JSON output and the observation record now differ from the baseline in field
  order. The values are the same. The handoff's permitted visible changes do not
  include this, and the decision requires preserving schema field layout.
- **Why verification missed it.** The verification record says the differential
  fixture's result-property order was "corrected" to match production. However,
  the fixture's unavailable value puts `provider` last, which matches the
  no-provider paths but not the adapter.
- **Probe.** I moved `provider` first in a copy of
  `compare-investigation-construction.mjs`. The comparison then fails on the first
  JSON unavailable case:
  `Rendering differs at 1027 for {"kind":"unavailable","format":"json",...}:
  "kind":"communication-failure",...,"provider":{...}` versus
  `"provider":{"status":500,...},"kind"`.
- **Suggested correction.** Reconstruct in production order, with `provider`
  first when present. Alternatively, carry the reporting shape so that its
  original key order is preserved. Then make the differential fixture use the
  adapter's order so that it covers this case.

### Non-defect observations

- **Duplicate test assertion.** In `test/investigation-integration.test.ts`
  (associated inspection test), `assert.notEqual(invalid.view.id, otherInvalid.view.id)`
  is now duplicated. This is harmless.
- **Ignored `after` in the arrangement key.** `associationContinuation` is hashed
  into every investigation arrangement key, including non-`inspect` lenses where
  `after` is ignored. If a caller supplied `after` to `summarize`, View IDs would
  differ for identical output. The CLI does not appear to route such requests, so
  this is only a note.
- **Retained records accumulate.** Every mechanical `inspect` and every
  investigation request now retains a selection record. Repeated pages deduplicate
  by identity. As approved, no size characterization was done.
- **Mechanical comparison needs a git checkout.** It must run from a git checkout,
  because organization coverage depends on repository capture. The verification
  record's instructions imply this ("from the target checkout") but don't state it.

### Unverified areas and residual limits

- No hosted inference, GUI, performance or memory characterization.
- The investigation differential is synthetic history. I did not independently
  differential-test follow-up lenses, `program-subject` unsupported requests or
  organization-routed associated inspection. For these I relied on code reading
  and the existing unit and integration tests.
- I did not re-derive the 486 investigation specs individually. I reviewed the
  generator and the allowances.

### Recommendation for the stated gate

The integrated implementation conforms to the accepted decision and constraints
across all four families, associated inspection, identity separation and worker
finalization, and the author's evidence reproduces. I recommend **acceptance after
correcting F1**. F1 is a narrow, in-scope fix whose verification is to extend the
existing differential fixture. It does not affect the boundary analysis, and I do
not consider a further independent round necessary for it unless the human prefers
one. This is a reviewer recommendation only, not human approval to close the task.
