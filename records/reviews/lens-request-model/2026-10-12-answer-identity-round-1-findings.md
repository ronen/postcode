# Answer identity checkpoint: round 1 findings

Record type: findings
Received: 2026-10-12
Reviewer: Claude Opus 5.5 (Claude Code), independent session with no implementation involvement (also the reviewer of the earlier request-publication and subject-resolution rounds)
Handoff: [2026-10-12-answer-identity-handoff.md](2026-10-12-answer-identity-handoff.md)
Round: 1
Reviewed target: 5d1b33631313cfbbb1f304b0a4aba94153b29d00 (scope `a081c92..5d1b336`, branch `codex/lens-request-model`)

## Returned findings

### Method

- Read the handoff, the [subject-resolution disposition](2026-10-12-subject-resolution-disposition.md), and the approved [plan](../../../docs/plans/lens-request-model.md) sections on answer identity and resolution context, reuse, and M3 exit evidence.
- Inspected the complete source, test and documentation diff for `a081c92..5d1b336`. That covered:
  - `answer-identity.ts` and `resolution-context.ts`;
  - the three mechanical constructors and `selectResolvedModules`;
  - the investigation selection, validation, content and presentation changes;
  - the store guard;
  - the Session dispatch;
  - the three mechanical View identities and renderers;
  - every migrated test, including the `projection-helpers.ts` fixture adapter.
- Checked `mechanicalAnswerIdentity` against every `RecordId` position in the three Projection record types, including the dependency graph components, expansions and `selection.outsidePopulation`.
- Read the investigation evaluation results to confirm that `integration.evaluate` always returns either an evaluation or an unavailable outcome. Removing the `no-evaluation` outcome therefore does not turn a reachable result into a defect.
- Confirmed that `HEAD` (`1042ba1`) differs from the target only in review and task records (`git diff 5d1b336 HEAD -- src test fixtures package.json` is empty).
- Ran scratch probes (not committed) against the built target, through direct constructors and `openSession().execute`, on `fixtures/dependency-journey`. They covered:
  - constructor order and empty inputs;
  - session-ID residue in identity payloads;
  - the resolution context for population Lenses;
  - literal compact spellings used as names;
  - raw-reference designations;
  - Unicode output by name versus by reference for `inspect` and `children`.

### Verification performed

- `npm run check`: passed.
- `npm test` (build, then `node --test _build/test/*.test.js`, loopback permitted, repository inputs held stable): 515 tests, 515 passed.
- Probe results:
  - The normalized identity payload of a two-module inspection contains no occurrence of the producing Session UUID.
  - A literal compact spelling supplied as a name is refused as `missing` and is not reinterpreted as a reference.
  - A raw-ID reference resolves, and its designation appears verbatim in View JSON.
  - Population Lenses (`modules`, `dependencies`, `organization`) expose `resolution` with designation `default`, no subjects and no populations.
  - Name and reference requests give equal `projection` descriptors with `parameters: {}`.
  - Other probe results are cited in the findings below.

### Actionable findings

No finding blocks continuation. F1 is low-to-medium severity; F2–F4 are low.

#### F1 (low–medium) — Name-designated Views print all lookup-population limitations, unlabelled, ahead of the answer

The three mechanical Unicode renderers and the investigation renderer emit `view.resolution.qualifications` verbatim directly after the selection line. `resolveSubjects` builds that list from two sources:

- the incompleteness reason of every lookup population;
- every limitation of every claim context of those populations.

For `inspect left` in `fixtures/dependency-journey`, the name route therefore renders 14 extra lines that the reference route for the same answer does not render. The probe compared 42 lines with 28. The extra lines include repository-layout, Git exclusion, sparse-checkout, link-redirect and README-association limitations from the group lookup population, even though only a module matched. `children left` adds two module-population limitations in the same way.

The lines carry no label. A reader cannot tell that they qualify the lookup rather than the answer. They also sit between the selection line and the answer body, so they push the answer down without telling the reader anything about the match. The plan asks for "relevant lookup wording/qualification" and says consequential lookup differences belong to the View. Here the consequential case is incomplete or unavailable lookup coverage ("other matches may be unknown"). That case is present, but it is lost among general provider limitations that the answer's own qualification sections already state, or that do not apply to it.

Recommended correction:

- In Unicode, render only the consequential lookup qualification (incomplete or unavailable population reasons). Label it as lookup context, for example `Lookup: …`, or reuse the per-population summary lines adopted for resolution reports in the previous round.
- Keep the complete limitation list in JSON `resolution`.
- Add a CLI test asserting the qualification lines for one complete lookup and one partial lookup.

This does not affect answer identity. It affects only the View's legibility and the precision of its qualification.

#### F2 (low) — Resolved-subject constructors make caller order an identity input without canonicalizing or declaring it

`selectResolvedModules` returns `[...subjects]`, keeping caller order. `inspectOrganization` and the dependency constructors pass subject order through to `modules`, `subjects`, `contexts` and the keyed payload in the same way. The probe showed that `inspect(store, evaluation, [a, b])` and `inspect(store, evaluation, [b, a])` produce two different retained answers for the same subject set.

Through the Session, the order is deterministic. Name matches arrive in population order, and a reference has one subject. So no current request path fragments an answer. However, the constructors are now the published resolved-only boundary that the M4 extension Lenses and catalog will call. The plan counts meaningful subject order and roles as identity inputs. For these collection Lenses, the order of the matched set has no stated meaning.

There is also a small asymmetry at the same boundary:

- `inspect(store, evaluation, [])` constructs a zero-subject `inspect` answer (`matches: 0`, `subset: true`). It must, because embedded group-only detail relies on it.
- The organization and dependency constructors reject an empty resolved selection.

Recommended correction: either canonicalize collection subjects to evaluation-population order, with outside-population subjects appended in a fixed order, or document caller order as a semantic input of these constructors and test it. Also consider separating the embedded empty-detail entry point from public module inspection, so that a direct caller cannot manufacture an empty requested answer. Settle this before the extension demonstrations rely on the constructors.

#### F3 (low) — Migrated adapter assertions no longer distinguish which refusal occurred

The fixture adapter throws one generic message (`Unresolved designation must be handled by request coordination`) for every non-`resolved` status. Several migrated assertions replaced status-specific expectations with `assert.throws(..., /request coordination/)`. Those assertions now pass for any refusal:

- `test/organization.test.ts`: compact spelling used as a name, reserved `group-00000000` reference, artifact path `data/value.json`, and `repository`. These previously distinguished `current`, `unknown-reference` and zero-match outcomes.
- `test/projection-content.test.ts`: three `'missing'` organization cases.
- `test/foundation-identity.test.ts`: the literal-Session-spelling test.

For example, the reserved `group-00000000` case would still pass if it became `missing` instead of `unknown-reference`.

The Session-level tests and `subject-resolution` tests from the previous round still cover the statuses themselves. This is therefore a loss of local specificity, not of coverage. The "resolved internal selectors cannot collide with literal normalized spellings" test now checks only that different subjects give different answers. The collision property it was named for now lives in `resolutionContextIdentity` (name versus reference kinds), which the new answer-identity test covers only for Session-shaped names.

Recommended correction: have the adapter include the resolution status in its error, or return it, and assert the expected status in each migrated case. Optionally retitle or retarget the collision test at View-context identity: a name and a raw-reference designation with the same normalized spelling give distinct `resolutionContextIdentity` values.

#### F4 (low) — Stale lookup-era branches remain in investigation arrangement and wording

- In `src/lib/investigation/presentation.ts`, the following branches can no longer occur, because the constructor and validation now require exactly one resolved subject and an outcome:
  - `selection?.status ?? 'missing'`;
  - the `selected.length !== 1` limitation strings ("resolve a missing or ambiguous selection", "Follow-up requires one exact investigram reference");
  - in `session.ts`, the `selected.length !== 1` terms of `failed`.
  The ambiguity limitation in particular describes a situation that is now a refusal, not a View.
- `lookupDescription` always appends `· current` to reference designations. Unknown references are now refused before any View exists, so the suffix carries no information. It survives as a fixed string from the removed `referenceStatus` field.

Recommended correction: remove the unreachable branches and the fixed suffix, or keep the suffix only if a non-current reference state is planned, in which case say so. No behavioral test change is expected beyond rendered-text expectations.

### Non-defect observations

- **Answer payloads and keys:**
  - All three mechanical families key `mechanicalAnswerIdentity(payload)`. That is the complete payload, with `identityReference` applied at every `RecordId` position: session, modules, claims, contexts, evaluations, expansions, groups, `moduleProjection`, subjects, relationships, occurrences, non-edge requests, coverage, opaque subjects, graph members and internal relationships, and `selection.outsidePopulation`. I found no unnormalized reference position and no literal position that is normalized.
  - Because the ID is now a function of the full payload, the earlier risk of a key omitting a payload field is gone. Conflicting resubmission under one ID is no longer possible for these families. A notable case is history-dependent expansion membership: `evaluations` and `expansions` depend on which expansions exist in the store, and those were previously outside the key.
  - The store rejects non-empty `parameters` and `selection.referenceStatus`. Investigation validation rejects `selector` and `unsupportedSubject`.
  - Methods advanced: `projection@12`, `dependency-projection@6`, `investigation-projection@3`, `presentation@29`, `investigation-presentation@14`.
- **Equal answers by name and reference:**
  - The new Session test shows equal `projection` descriptors and `parameters: {}` for module `inspect`, `children` and `parents`, and for group inspection, with different View IDs and identical repeated requests. My probe agreed.
  - The investigation integration test shows a by-reference summary reusing the by-name snapshot with `agent.inputs.length` unchanged, so no new inference.
  - Cross-Session normalization tests for all five family variants now assert that the internal and precise IDs are equal.
- **Qualified support stays distinct:** a different construction basis (the partial evaluation) changes the answer ID. Lookup qualification is frozen in the resolution context and changes only the View ID. The partial-lookup example matches the plan's module worked example.
- **Resolution context and View identity:**
  - Every mechanical View key and the investigation arrangement key include `resolutionContextIdentity`. That function normalizes subjects, and a designation value only when the kind is `reference`.
  - Name and reference designations differ by kind, so a literal name spelled like a normalized record ID cannot collide with a reference. Session-shaped literal names stay literal (tested).
  - Usage finalization still hashes the explicit arrangement key, not a finalized View ID, and keeps `resolution`.
  - Associated-inspection Views key the mechanical View ID, which already includes the context.
  - Arrangement receives only the frozen context. No store, lookup or Evaluation access was added.
- **Resolved-only construction:**
  - Organization and dependency constructors refuse empty, duplicate, foreign-Session or wrong-kind subjects.
  - Investigation selection requires one applicable same-Session subject and an evaluation or unavailable outcome, or one investigram for historical inspection.
  - Associated inspection may still be empty (tested).
  - Group-only organization inspection embeds a genuine empty module Projection, and name and reference routes give equal `moduleDetail`.
  - Valid unavailable and failed outcomes and frozen revision and association snapshots keep their earlier coverage.
- **Allocation:**
  - Session dispatch is unchanged apart from passing resolved subjects and the context.
  - Constructors still allocate the evaluation population (`store.entityIds(evaluation.modules | groups)`) before use, so the successful whole-population schedule from the previous gate is preserved.
  - No constructor allocates on refusal paths, because refusals never reach construction.
- **Test migration:**
  - The fixture adapter routes string selectors through the production `resolveSubjects` and throws on any unsettled result, so it cannot recreate retained missing answers.
  - Its raw-record-ID shortcut is test-only.
  - Removed assertions either moved to Session-level refusal checks or were replaced by legitimate empty-population and embedded cases (see F3 for the specificity loss).
  - The removed `session.test` module-miss rendering check is superseded by the existing resolution-report assertions in the same test.
  - The `comparison.ts` addition normalizes only `designation.value` for reference-kind designations.
- **Documentation:** the architecture overview, the investigation architecture page, the CLI reference, the implementation conventions and STATUS describe the intermediate state accurately. They disclose that attribution, compatibility and extensions remain outstanding.

### Unverified areas and residual limits

- I did not exercise:
  - partial or unavailable group lookup together with a successful mixed group/module name match through the CLI;
  - mixed reference/name shell follow-ups;
  - cancellation during construction;
  - a worker restart between resolution and arrangement.
- I did not check reuse across a second consuming Lens. The plan places that in the M4 extension demonstration, and the handoff discloses it as remaining.
- Attribution, Presentation compatibility, catalog construction and extension demonstrations are disclosed as remaining work and were not assessed.
- The historical intermittent CLI failure did not recur in this full run. Its cause remains unconfirmed.

### Recommendation for this intermediate gate

The answer-identity and resolved-construction boundary is suitable for continuing the remaining authorized implementation:

- retained payloads no longer carry designation or lookup status;
- keys cover the complete normalized payload;
- equal name, handle, raw and compact selections share answers while their Views stay distinguishable;
- unsettled requests cannot manufacture answers;
- the migrated tests do not restore a lookup API.

F1 is a legibility and qualification-precision correction to the new View context and should be made during continuing work. F2 should be settled before the extension demonstrations call the resolved constructors. F3 and F4 are test-specificity and cleanup items. None of these needs another review round unless the human prefers one.
