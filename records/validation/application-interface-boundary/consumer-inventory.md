# Application boundary baseline inventory

Date: 2026-11-08
Source baseline: `815f2378a5e6f2d4ca36884e4a8547a42f6c49ca`
Task: [application interface boundary](../../tasks/2026-11-08-application-interface-boundary.md)

The baseline production code is unchanged from the plan's assessment revision; intervening commits adopt planning/governing documents. The task starts from published main. Recursive source and script searches are retained alongside this record. They include dynamic build-root imports and source rewriting, which TypeScript checking cannot validate.

## Consumers

The CLI uses `interactive-session` and its private `session-worker`. The worker calls `openSession`; one-shot and shell publication share `publishCommand`. Eighteen test files directly exercise the Session request interface; `test/request-helpers.ts` and `session-protocol.ts` derive result types. They must migrate to the same client adapter while direct application tests are added separately. Core construction tests that call arrangement wrappers retain their independent boundary assertions.

| Script role | Entries and action |
| --- | --- |
| Live CLI, measurements and parity | `compare-session-requests`, `measure-session-journey`, `measure-partial-session`, `probe-session-interruption`, `probe-compiler-interruption`, `profile-analysis`, `assess-human-output`: migrate entry points and instrumentation as required. The comparison script contains older selector-in-Projection assertions that must be assessed against the current answer-identity contract, not copied as an extraction oracle. |
| Live investigation assessment | `module-investigation/run-shell`, `diagnose-chatgpt`, `verify-configuration`, `injected-setup`, `check-browser`, `request-budget`, `usage-report`: retain trusted offline injection; inspect runtime dependencies individually. No top-level import of a live runner for linkage verification. JSON recipes/rubrics are data. |
| Historical comparisons | `compare-view-construction`, `compare-investigation-construction`, `compare-investigation-revisions`, `compare-session-conversion`, `compare-analysis`: retain recorded build assumptions. In particular, historical method-registry imports do not justify a production compatibility shim. |
| Historical benchmarks | `benchmark-analysis` and its child `measure-analysis`: retain checkpoint parser/sink assumptions. |
| Shared fixture/build helper | `comparison-fixtures`: keep exports and historical behavior; the focused `compare-application-boundary` harness owns new comparison policy. |

No additional pre-existing script entry points were found beyond the plan's inventory. Historical tools are not the oracle for extraction. The new focused comparison invokes each build's stable `src/lib/cli.js` entry, preserves report field order and JSON layout, records an explicit bijection only for the separately authorized method transition, and otherwise compares exact same-kind digests after the existing Session-namespace policy.

## Binding schedule

[Baseline sites](baseline-binding-sites.txt) preserve the concrete calls before extraction. The approved plan's population/order table matches these sites. In addition to direct calls, the investigation arranger calls its binding port for bounded traversal/revision participants, navigable modules, optional candidates, and finally all historical-inspection associations. `reference-binding.ts` validates the whole batch before allocation. Neither the port nor its permitted population means eager full-population allocation.

The mechanical wrapper sequence is discovery/basis modules then selected modules; organization uses evaluation groups, selected groups, module evaluation population, then embedded-detail discovery/selection. Answer references use the separate allocator. Associated mechanical selection precedes arrangement, but association bindings follow mechanical coordination. Exact retrieval follows fixed support, with no history enumeration. Extraction must preserve these schedules while moving their ownership.

## Provenance checkpoint scope

Remove only `presentation`, `investigationPresentation` and `exportsPresentation` from application capture. Advance observed inputs from 6 to 7 and program records from 22 to 23 because their capture/provenance semantics change. Preserve all Presentation version values and View/key formulas. Client artifact provenance appends only responsible methods. The application-method registry remains the input to `typescript/project.ts`; it is not reconstructed with client entries.

The separate checkpoint must be committed and its emitted build retained before execution/outcome extraction. The later extraction comparison must not reuse the method-split allowance.
