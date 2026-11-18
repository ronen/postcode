# M3 remaining mechanical-family review: round 1 findings

Record type: findings
Received: 2026-11-18
Reviewer: Claude (Opus 5.5), independent review session
Handoff: [M3 remaining mechanical-family review](2026-11-18-m3-mechanical-handoff.md)
Round: 1
Reviewed target: `6d30d89e35971b04d759ff99f9f2a25f2111dab1`
Reviewed scope: `7035d036b384fa8f47ed3c27f30825c7ef645ebf..6d30d89e35971b04d759ff99f9f2a25f2111dab1`

## Returned findings

### Recommendation

The mechanical migration is substantially sound. Producers enter the common boundary through one wrapper. Provider statements are validated against retained records, and identification uses provider-scoped native keys rather than names. Equivalent recomputation did not renew withdrawn uses in any case I examined, and the batch-local acceptance indexes keep atomicity and producer separation intact.

The checkpoint is **not yet sufficient as submitted** because of F1. A dependency-children/parents answer captures the whole project's dependency-organization population, so unrelated changes alter its identity and appear in its human output. That is the "selection that includes unrelated populations" case named in the handoff. F2 needs either a narrower recorded input or an explicit human-accepted statement of what "supplied" means for this provider. F3 and F4 are smaller corrections. After F1 is corrected (with regression coverage) and F2–F4 are disposed of, a focused rereview of those changes should be enough for this gate; it would not need to repeat the whole mechanical review. The human decides whether the checkpoint is sufficient.

None of these findings concerns the separately scheduled agentic/caller work.

### Method and verification

I read the governing plan (M3, the intermediate-state contract, the verification table and the risks), the [association organization and exposure](../../../docs/decisions/association-organization-and-exposure.md#exposure-and-reconsideration) decision's exposure rules, and the checkpoint and measurement records. I then read the complete target diff: every changed `src/lib` file, all changed tests, the descriptive architecture, `STATUS.md` and the capability reference. I followed callers into the unchanged provider code where a judgment depended on what a provider actually reads (`organization/evaluate.ts`, `dependencies/organization.ts`, `typescript/expansions.ts` symbol identity, `dependencies/projections.ts`, `dependencies/presentation.ts`). I treated the handoff and the implementer's verification as claims to check, not as proof.

Before the work below, the checkout was at `ff01068` (the handoff commit), with `src/` and `test/` identical to the target.

Independent verification, run on the user's machine in a Linux VM (Node 22.23.5) against the installed dependencies. I compiled to scratch space outside the worktree, so the worktree's `_build` was not touched:

- `tsc -p tsconfig.json --noEmit`: passed.
- `tsc -p tsconfig.json` (scratch `outDir`): passed.
- `git diff --check 7035d03 6d30d89`: passed.
- Full offline suite, `node --test --test-concurrency=2`, run in ten file batches from a self-contained git copy of the worktree: **769 tests: 766 passed, 1 skipped, 2 failed.**
  - The skip is the case-insensitive-filesystem link test, which needs a different filesystem.
  - The two failures are the native credential kernel-lock tests: `lock child exited before ready`. The installed `fs-ext` binary is macOS-built and cannot load in a Linux VM.
  - Run directly in the worktree, `answer-identity.test.js` also failed, because git in the VM cannot follow the worktree's absolute macOS `.git` pointer, so the repository layout was unavailable. It passed 2/2 from a self-contained git copy.
  - I treat all of these as environmental. They do not contradict the implementer's 769/769 under Node 22.13.1 on macOS.
- Ad hoc Node probes against the compiled target, on `fixtures/dependency-journey` and `fixtures/exports` with temporary git copies where layout was needed, produced the evidence cited in F1, F2 and F4 and in observation O1. No implementation, test or fixture file was changed. The probes are not committed.

Not performed: the 741-module accumulating-Session measurement, the controlled GC check, or any Node 26 run. No live inference was used, and none was authorized. The measurement figures below are the implementer's, apart from the small-fixture snapshot sizes in O1.

### Actionable findings

#### F1: Dependency children/parents capture the whole dependency-organization population

Location: [dependencies/projections.ts:86–87](../../../src/lib/dependencies/projections.ts#L86). Compare [dependencies/presentation.ts:172](../../../src/lib/dependencies/presentation.ts#L172) and [contributions.md:53](../../../docs/architecture/contributions.md#L53).

`project()` passes every claim of the dependency-organization expansion, `(store.get(organization)).claims`, to `selectNativeContributions`, whatever `subjectRole` and the selected relationships are. The legacy answer and its presentation scope organization to the answer's own edges (`content.organization.filter(item => selectedEdges.has(item.claim.record.subject))`). The new capture is therefore wider than the answer, which contradicts the architecture text: "Selection follows the family's existing population and expansion rules".

Reproduction, against the compiled target on `fixtures/dependency-journey` (6 modules, 6 relationships), with repository organization and dependency organization evaluated:

1. `dependencyChildren(store, dep, [M], dorg.id)` for a module with one outgoing relationship selects 16 findings. Six of them are `dependency-organization` findings, which is all six in the project, although the answer has one relationship.
2. A controlled agentic contribution reports an unresolved inconsistency between two of those *other* relationships' classification items.
3. A fresh `dependencyChildren` for the same module has unchanged `relationships` but a **different Projection ID**. `nativeConcernLines` for it renders `Unresolved inconsistency (…): Probe: two unrelated relationship classifications disagree.` with its owner qualification.

So an answer about one module's dependencies changes identity and discloses a concern about content it does not present. The same path also inflates the retained snapshot (see O1). `dependencyStructure` is unaffected because its edges cover the project.

Suggested correction: select only dependency-organization claims whose `subject` is in the answer's `relationships`. Add a regression case (an unrelated relationship's inconsistency or change leaves a children/parents answer unchanged) next to the existing "unrelated organizing-use withdrawal" control in `test/contribution-native.test.ts`.

#### F2: Dependency-organization exposure records findings the provider does not read

Location: [dependencies/organization.ts:174](../../../src/lib/dependencies/organization.ts#L174) and the input handling in [contributions/native.ts:126–131](../../../src/lib/contributions/native.ts#L126).

The derived provider is credited with item delivery of `[...dependency.relationships, ...dependency.occurrences, ...organization.claims]`. The provider body reads the following:

- module-placement claims
- containment claims
- group claim contexts
- artifact-placement claims
- the resolved occurrences listed on each relationship

It does not read `group-properties` claims or `group-documentation` claims. It does not read `dependency.occurrences` entries that are not relationship occurrences, that is, unresolved or opaque non-edge requests.

On `fixtures/dependency-journey`, the dependency-organization production's item deliveries included 3 `group-properties` items alongside the families actually used. By code inspection, any unresolved requests in a fixture that has them would also be delivered.

The decision records "substantive information actually supplied to the producing investigation", and the handoff asks whether each derived provider's recorded input "accurately describes what it consumed, without manufacturing … dependence". Whether being handed the whole organization evaluation counts as supply is a semantic judgment I would not settle as reviewer. Two resolutions look reasonable:

- (a) narrow the inputs to the claim families and occurrences the algorithm reads; or
- (b) keep them, and state explicitly in the checkpoint and architecture text that this provider's supplied input is the complete organization and dependency evaluations.

Under the current fixed-item semantics this does not appear to create reconsideration causes by itself, though I did not exhaustively verify that. It does misstate the exposure record that later audits and any item-level status would rely on. As far as I could see, placement/properties (module population only) and the compiler and layout producers (no deliveries) are recorded accurately.

#### F3: Derived inputs without a contribution are silently dropped

Location: [contributions/native.ts:126–129](../../../src/lib/contributions/native.ts#L126).

`inputItems` maps each input through `nativeItem` and discards inputs that have no established contribution (`return item ? [...] : []`). A derived producer given an uncontributed population therefore records partial or empty exposure without any error. Answer construction fails closed in the same situation (`Expected contributed native finding`), and the synthetic-fixture test updates show it can arise outside `recordModuleEvaluation`.

On current real paths, the inputs are contributed before the derived producer runs, so I found no live misrecording. The asymmetry is still a latent understatement of exposure.

Suggested correction: throw when any input finding lacks an established item, mirroring the selection's fail-closed check.

#### F4 (minor): Displacement is disclosed twice in two answer families

Locations: [exports/presentation.ts:82](../../../src/lib/exports/presentation.ts#L82) and [presentation.ts:196](../../../src/lib/presentation.ts#L196), with [organization/presentation.ts:249](../../../src/lib/organization/presentation.ts#L249) and line 280.

- **Exports answer.** After withdrawing the naming use and the export-listing use on `fixtures/exports`, the rendered exports view contains each withdrawal's grounds twice. The new generic lines appear first ("A selected finding's organizing use is displaced (investigram:…#use)…" and "Change …: withdraw — GROUNDS"). The M2 specific lines follow ("The use of this module identification … was withdrawn by later analysis: GROUNDS …").
- **Organization inspection with a module subject.** The outer organization view and the embedded module detail (`renderUnicode(…, 'embedded')`) both render native concern lines. The organization selection includes the module subjects, so the same displacement appears once for each part: two outer lines and two embedded lines in the probe.

This is not a truthfulness defect. It is redundant, and the generic lines carry only opaque addresses where the M2 lines name the affected finding. Suggested correction: avoid rendering native concerns already covered by the M2 exports rendering, and do not repeat outer-view concerns in embedded detail. Keep the structured view complete.

### Non-defect observations

- **O1: Snapshot representation dominates answer size.** On `fixtures/dependency-journey`, a module-inventory Projection serializes to 184,493 characters; without its `contributions` capture it is 5,964. Of the support, resolved `evidence` is about 69k, `items` about 43k (item bodies about 14k), `owners` about 28k and `uses` about 27k. The ledger and the store each `structuredClone` on retention, so every Projection carries its own deep copy of item bodies and resolved evidence that are already immutable and retained in the same Session. This fits the measured rise in final-request heap from 454.6 to 1,251.5 MB. F1 adds to it for children/parents answers. I found no remaining quadratic acceptance work. The batch-local `stagedById`, `suppliedByHandle` and `providerKeys` maps leave validation unchanged, and the in-pool duplicate-provider-key case is now tested. Whether exact answers should capture immutable addresses plus captured status instead of embedded copies is a representation choice for the implementer and human; the cost is disclosed, not waived.
- **O2: Identity and equivalence.** Symbol identity is the provider's name plus declaration spans, and group identity is the captured path, scoped by provider rule and scope. Names enter only as qualified identifying text, and anonymous roots contribute none. Derived keys for placement, properties and dependency organization exclude evaluation-specific record identity while keeping the statement, the qualification (including evidence and limitations) and the relevant module population for properties. Dependency-organization keys normalize their placement support recursively. The original exact record stays in the established item, and the later record remains in the store. This matches the checkpoint's description, and the different-requirement-set test exercises it.
- **O3: Placement and layout group findings.** Placement refers to layout groups without recording delivery of the group findings. Both come from one pass over the captured layout, and the architecture text states that internal computation within a provider pass manufactures no acquired input. I consider this consistent with the decision.
- **O4: Relationships and assertions stay non-Entities.** Dependency-organization, documentation-association and recorded-assertion findings get no organizing use when their subject is not a module, symbol or group. They remain addressable through their owners, and no filler Entity or identification is introduced. Opaque and unresolved occurrences keep only their owner as a referent.
- **O5: Test assertions.** Two M2 assertions in `test/contribution-modules.test.ts` were loosened from exact counts to `>` comparisons, because the expansion now contributes more. The new native suite separately checks no growth on equivalent recomputation, so coverage is not lost. Exact expected counts would have been a slightly stronger regression signal.
- **O6: Checkpoint boundary.** The checkpoint, architecture text, capability notice and `STATUS.md` keep mechanical completion separate from the unfinished agentic/caller cut-over, claim neither M3 completion nor M4, and introduce no permanent alternate organizing model. The only inaccuracy I found is the selection sentence noted in F1.

### Unverified areas and residual limits

- I did not reproduce the 741-module measurement, so the growth figures and the post-correction acceptance time remain the implementer's evidence.
- I did not exhaustively confirm that fixed item deliveries can never yield reconsideration causes (relevant to F2's impact).
- Coverage of ambiguous placement and partial or unavailable populations was checked by reading the existing organization and dependency tests and their new contribution calls, not by new probes.
- Selection breadth for module-expansion outcomes was confirmed per-module on fixtures only. An outcome covering many modules would widen `inspect` captures, through the `exportOutcomes` argument, to every module in that outcome.
