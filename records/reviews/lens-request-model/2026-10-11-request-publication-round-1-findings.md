# Request publication checkpoint: round 1 findings

Record type: findings
Received: 2026-10-11
Reviewer: Claude Opus 5.5 (Claude Code), independent session with no implementation involvement
Handoff: [2026-10-11-request-publication-handoff.md](2026-10-11-request-publication-handoff.md)
Round: 1
Reviewed target: a9c8189f042d5fe6cabf27db414b995a5972d0f6 (scope `e83a7f3..a9c8189`, branch `codex/lens-request-model`)

## Returned findings

### Method

- Read the handoff, [review workflow](../../../dev/review.md), the approved [plan](../../../docs/plans/lens-request-model.md) (M1, request/result design, reporting, verification obligations) and the three governing decisions ([request outcomes](../../../docs/decisions/lens-application-and-request-outcomes.md), [qualified construction](../../../docs/decisions/qualified-construction-under-the-request-model.md), [experimental outputs](../../../docs/decisions/experimental-structured-outputs.md)).
- Inspected the complete source, test and documentation diff for `e83a7f3..a9c8189`, with surrounding code in `session.ts`, `interactive-session.ts`, `command-execution.ts`, `observations.ts`, `commands.ts`, the dependency/module projection constructors and investigation selection/validation.
- Confirmed that `HEAD` (`a332830`) differs from the target only in review/task records (`git diff a9c8189 HEAD -- src test fixtures package.json` is empty), then built and ran the target sources.
- Ran a scratch probe (not committed) against the built target through direct `openSession().execute`, covering missing/population designations, incompatible designation modes, dependency vocabulary, usage with extraneous inputs, inherited-property Lens names and non-JSON parameters.

### Verification performed

- `npm run check`: passed.
- `npm test` (build, then `node --test _build/test/*.test.js`, loopback permitted): 495 tests, 494 passed, 1 failed (about 151 seconds). The failure was `test/cli.test.ts` "source hierarchy preserves forwarding, defining syntax and mixed documentation before the closing sections", with `SyntaxError: Unexpected end of JSON input` parsing the one-shot `--json` inventory stdout. That test does not touch the changed request paths' JSON shape (a module inventory View), and it passed in three consecutive isolated reruns. I treat it as an intermittent failure of the CLI subprocess under full-suite load, not attributable to this change, but I did not establish its cause.
- Direct probe results cited in the findings below.

### Actionable findings

#### F1 (medium) — Dependency Lens identities diverge from the plan's normalized vocabulary and from the retained answers

The plan's [explicit capability definitions](../../../docs/plans/lens-request-model.md#explicit-capability-definitions) require a typed Lens set *and a separate CLI spelling map*, with normalized identities `dependency-structure`, `dependency-children` and `dependency-parents`; CLI commands remain unchanged. `src/lib/requests.ts` instead uses the CLI spellings `dependencies`, `children` and `parents` as `LensId`, so there is no spelling map.

Consequences at the shared boundary this checkpoint establishes:

- One observation batch now records two identities for one Lens. A `children foo` request publishes `request.lens: "children"` while its `qualified-view` record has `projection.lens: "dependency-children"` (confirmed by probe; `src/lib/dependencies/records.ts:91` is unchanged). The previous observation request used the `dependency-*` value, so this checkpoint changes published Lens identity away from the planned vocabulary.
- `test/request-model.test.ts` enshrines the CLI spellings as the normalized vocabulary, and `InvestigationLens`/selection validation consume `lenses[...]` by the same keys, so later family migrations will build on the wrong identities.

Recommended correction: adopt the planned normalized identities in `LensId`/`lenses`, add the CLI-spelling→Lens map at the command boundary (and for direct-API spellings if those are retained), and update the request-model and observation tests to assert agreement between request and retained-answer Lens identity. This is cheaper to fix before M2/M3 than after.

#### F2 (medium) — The published designation can misdescribe the application actually performed

`normalizeRequest` derives designation mechanically: no selector → `missing` for non-population Lenses, and `subject` → `configured-project`/`repository` irrespective of the Lens's declared `subjects`. The declared applicability and cardinality are not checked anywhere at the request boundary (only `invalidParameters` runs). Probe results via direct Session calls:

- `children` with `selector: null` reports designation `{ kind: "missing" }` but returns a successful dependency-children View over the whole population (6 of 6 modules selected, `failed` unset).
- `modules` with `subject: "repository"` reports designation `{ kind: "repository" }` (not an applicable subject for `modules`), while executing the configured-project inventory.
- `inspect` with `selector: null` throws the internal invariant `Inspection requires a selector` (reported as a defect, not a resolution result).
- `summarize` with no selector correctly fails as ambiguous, but through the old family path.

The underlying dispatch behavior is pre-existing and full subject resolution is M2 scope, but this checkpoint's claim is that publication now carries the *actual* request (handoff focus 1, "all designation modes"). The decision forbids describing a request differently from what was applied, and the plan's M1 exit evidence includes "direct parameter-rejection **and applicability** tests". Neither the missing/incompatible-designation cases nor applicability are tested.

Recommended correction: at minimum, reject designation modes that the selected Lens declares inapplicable (no designation for a `one`/`collection` Lens; `subject` for a Lens whose `subjects` exclude it) with a resolution result before Evaluation, using the existing `postcode-resolution` path with an appropriate reason, and add direct tests for each. If the implementer prefers to defer this to M2, the handoff/status should state that published designations are not yet guaranteed to describe direct-API applications, rather than presenting all designation modes as covered.

#### F3 (low) — Usage silently discards supplied selector/parameters/subject

`normalizeRequest` returns `{ kind: 'report', report: 'usage', ...choices }` and `invalidParameters` returns `null` for reports. A direct request `{ lens: 'usage', selector: 'x', parameters: { bogus: 1 } }` returns a successful usage report whose normalized request contains none of the supplied inputs (probe confirmed). Under the CLI the raw `supplied` text survives in the command-outcome record, but direct callers get neither rejection nor a faithful request record. Either refuse extraneous designation/parameters for the subjectless report with a resolution result, or retain them in the normalized report request; add a test for whichever is chosen.

#### F4 (low) — Unknown Lens names fail as defects rather than through an explicit path

`normalizeRequest` checks `if (!definition)` against `lenses[request.lens]`. Inherited `Object.prototype` names (`toString`, `constructor`, `__proto__`) pass that check, normalize to `lens: undefined`, and then crash in `invalidParameters` with `TypeError: Cannot read properties of undefined (reading 'requirements')` (probe confirmed). A genuinely unknown name throws a plain `Error`. In `publishCommand`, `normalizeRequest` and the `structuredClone` performed by `Session.execute` are reached outside or before the `try`, so such inputs (and non-cloneable parameter values, which throw `DataCloneError`) escape without a command observation. The typed CLI cannot produce these, so impact is limited to direct callers; use `Object.hasOwn(lenses, ...)` and decide explicitly whether unknown Lenses are a defect or a resolution result, keeping the publication path inside its outcome handling.

#### F5 (low) — Two different shapes share the `postcode-investigation-usage/1-experimental` label

The new stdout usage report (`{ schema, session, context, usage }`) and the existing stderr final-usage block emitted by `publishCommand` after a failed/interrupted command (`{ schema, session, usage }`, no request context) use the same label for different occurrences. The [output decision](../../../docs/decisions/experimental-structured-outputs.md#permit-direct-changes-to-affected-experimental-outputs) permits label reuse within a family but asks that labels remain unambiguous across current producers/tests/docs. Either document that the stderr form is the same family with optional context, or distinguish it.

### Non-defect observations

- Caller input is snapshotted synchronously in `Session.execute` before the asynchronous check (`structuredClone` + freeze), and the new test proves mutation after the call is not observed. Execution options are copied. `requestId` correlation is passed from the publisher and kept out of Projection payloads and `integration.evaluate` requests.
- Invalid-parameter rejection precedes all Evaluation and store writes for every Lens; usage no longer calls `evaluateModules` (a behavior change from the baseline, which evaluated the module basis for usage; consistent with "subjectless usage performs no Evaluation").
- Parent finalization of usage/resolution reports uses `usageReport()` only, has no store or binding access, and is idempotent (`finalizeRequestReport` replaces usage only). The usage descriptor, its `recordId(... 'investigation-usage' ...)` identity and the faux-View branches in investigation arrangement/rendering are removed. Real investigation Views still carry the explicit usage-independent arrangement key.
- Publication: non-View results produce `resolution-result`/`usage-report` records, no `qualified-view`, `view-produced` or `source-escape` events; `formatVersion` is 2 in both batch builders; invalid parameters map to `refused`/`command-refused`, exit code 3; sink failure warns without altering status or output; pre/post-output invalidation is tested for the usage alternative. A usage report also yields the separate `investigation-usage` record when attempts exist; this duplication is harmless.
- `selectModules` preserves the population-wide `entityIds(evaluation.modules, 'module')` allocation that the former `inspect` call performed, before any matching, so valid-request allocation order is unchanged. Dependency selection no longer `put`s an inspection Projection; the new test confirms only dependency Projections are retained for name and reference selection.
- Selection-validation's switch to `lenses[record.lens].subjects` is equivalent to the former rule because the `request` variant only admits `children`/`parents` with an unsupported investigram.
- Test changes: `programOutput` removes only the top-level `context`; all View, rendered, reference and evidence comparisons are otherwise unchanged. The four replaced usage-as-View assertions now check the usage report, its idempotent finalization and absence of `view-produced`, preserving the usage totals and credential assertions. I found no weakened comparison.
- The old observation request record's `navigation` sentence ("Session-local entity reference supplied … no cross-invocation continuity") is gone; the designation kind plus batch session conveys the same scope, and the cross-invocation limitation remains documented in the CLI and capability references. Permitted under the experimental-output policy, noted for awareness.
- Documentation updates (README, STATUS, CLI/capability references, architecture overview, implementation conventions) describe the intermediate state accurately and disclose the unfinished resolution, identity, attribution and compatibility work. The F1 vocabulary issue is not reflected in any doc because docs do not name the normalized dependency identities.

### Unverified areas and residual limits

- `RequestContext` carries only `id`, `initiator: 'caller'` and the normalized request. The plan's first boundary also calls for purpose and execution constraints, and direct `evaluateInvestigation` establishes no request context. The handoff lists the attribution trace as remaining work; I did not assess its future design.
- Prospective `requirements`/`results` declarations are not consumed at runtime beyond operation mapping and the `dependencies` requirement test; consistent with the handoff's disclaimer, they are not evidence of compatibility.
- I did not exercise shell-mode interactive publication beyond the existing tests, cancellation during a non-View result, or hosted investigators (none expected).
- I did not audit the remaining family paths' lookup/selection behavior (F2 of the audit, F3 descriptors), which the handoff states are unchanged.

### Recommendation for this intermediate gate

The worker/publication boundary is structurally sound: the three result alternatives, parent finalization, observation versioning and F4 selection change behave as described, and no weakened tests were found. I recommend correcting **F1** before continuing, because normalized Lens identity is the key every subsequent family migration, identity formula and observation consumer will rely on. **F2** should either be corrected now (preferred, since it is small) or explicitly disclosed as deferred to M2 so that the "actual request" claim is not overstated. F3–F5 are low-severity and can be handled during continuing work. With F1 corrected and F2 corrected or explicitly deferred, the boundary is suitable for continuing the remaining authorized implementation; a fresh review round is not required for those narrow corrections unless the human prefers one.
