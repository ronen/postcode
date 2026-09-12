# Returned independent core review

Received: 2026-09-13
Reviewer: Claude, arranged by the human

The following review text is preserved as supplied by the human.

Independent Architectural Checkpoint Review

Reviewed commit: da8e7224395b9ac58361339bdc485c14640ad473 ("Establish module discovery and qualified projection core"), checked out and reviewed in isolation, then restored to codex/initial-module-inventory (HEAD 70bb3f4) afterward.

Governing material read: AGENTS.md, foundation/task-protocol.md, foundation/product-design.md, dev/workflow.md, dev/conventions.md, the approved plan and its three accepted decision records, docs/architecture/README.md, and the task record — all read at the reviewed commit. Confirmed via git diff 4a8914c..da8e722 -- foundation/ docs/decisions/ docs/plans/ that no foundation or accepted-decision document was touched by this commit.

Verification reproduction

Ran the handoff's exact commands at the reviewed commit (macOS, Node v22.13.1, npm 11.17.0, tsc 6.0.3 — matches the stated environment):

- npm ci — clean, 0 vulnerabilities. package-lock.json contains no "scripts" entries in any dependency, so the "install scripts disabled" claim is moot/true regardless of flags.
- npm test — 19/19 passed, matching the claim.
- npm run check — passed, no type errors.
- git diff 4a8914c..da8e722 --check — no whitespace errors.

All quantitative claims in the handoff's "Verification at the reviewed commit" section reproduce exactly as stated, and I cross-checked the prose description of test coverage against the actual test files (test/discovery.test.ts, test/records.test.ts) — the description is accurate, not overstated.

Findings

None of the following are blocking. They range from a genuine (but narrow) mismatch worth resolving in this task before more code depends on it, to low-severity completeness gaps and forward-looking notes. I found no correctness defect in the parts of the population contract, identity, store atomicity, or qualification logic that are actually exercised by tests — I traced the sort/merge/exclusion/diagnostic logic by hand against the fixtures and the results match what the tests assert.

1. inspect(subjects)'s single-string selector may not match the plural interaction the plan describes (moderate, worth confirming before CLI work)

- Where: src/lib/projections.ts:46-48 (inspect(store, evaluation, selector: string)), src/lib/records.ts:81 (ProjectionRecord.parameters: { readonly selector: string | null }).
- Governing requirement: the plan's use narrative says "The developer can run the CLI again with a previously displayed name, mnemonic handle, or Entity ID to apply inspect(subjects) to the matching module or modules," and the decisions describe "a referent" resolving to zero/one/several entities. Read literally this is about one referent producing multiple matches (duplicates), which the current single-selector shape handles correctly and is well tested (test/records.test.ts:79-105).
- Reasoning: it remains genuinely ambiguous whether the eventual CLI needs to inspect several different referents in one invocation (e.g. inspect A B), which the current shape cannot express without changing ProjectionRecord.parameters.selector from string | null to something list-shaped — a change that touches the identity key computation in projections.ts:27, the store's kind validation is unaffected, but tests and the project() filter (projections.ts:18-22) would need rework.
- Disposition: not a defect in what's built — the plan text is genuinely underspecified here, and exact CLI selector syntax is explicitly delegated to implementation. Flagging it now, before CLI code and its fixtures are built directly on the single-selector assumption, costs little; deciding it later could mean revisiting ProjectionRecord identity shape after more code depends on it (exactly the kind of premature-abstraction risk review focus #1 asks about).
- Suggested action: resolve explicitly (a one-line implementation-selection note, or ask the human) before the CLI's inspect argument handling is built.

2. Ambient-module facet derivation has an uncharacterized gap for non-.d.ts ambient declarations (low)

- Where: src/lib/typescript/project.ts:97-104.
- Governing requirement: decisions describe facets including "declaration-only" and "implementation available... where the analysis supports them."
- Reasoning: the ambient-module facet logic is ['ambient', ...(declarations.length > 0 && declarations.every(d => d.getSourceFile().isDeclarationFile) ? ['declaration-only'] : [])]. A named ambient module declared inside a non-.d.ts file (TypeScript permits declare module 'x' {...} in an ordinary .ts file when not using isolatedModules) would receive only the bare 'ambient' facet — neither declaration-only nor implementation-available — silently omitting a facet dimension the decision anticipates. No fixture exercises this path (the ambient.d.ts fixture only declares ambient modules in a declaration file), so the actual behavior in that case is untested, not just undocumented.
- Disposition: minor completeness gap in an explicitly-limited population contract ("Possible omitted virtual, synthetic, generated, or nonordinary forms are a qualified limitation until use exposes a consequential gap" — decisions doc). Not a checkpoint blocker.
- Suggested action: either add a small fixture characterizing this case, or note it as a known limitation alongside the existing limitation string in project.ts:10.

3. qualifications()'s file-less-diagnostic branch is untested and would over-qualify every per-module context if ever hit (low, informational)

- Where: src/lib/typescript/project.ts:129-132.
- Reasoning: qualifications(sourceFiles) filters encountered (syntactic diagnostics) with diagnostic.file === undefined || sourceFiles.includes(diagnostic.file). This function is called once for the global context (over all files) and once per module (over just that module's files). A hypothetical file-less syntax diagnostic would pass the filter for every per-module call, not just the global one, incorrectly attaching a population-wide diagnostic to every individual module's narrower context. In practice program.getSyntacticDiagnostics() diagnostics always carry a file, so this branch appears currently unreachable — it's defensive code with no test coverage of its actual (arguably wrong) behavior.
- Disposition: not a live bug; purely a latent-code note relevant to review focus #5 ("only relevant outcomes... projected").
- Suggested action: no urgency; if kept, a comment noting the assumption would help; a fixture is probably not worth building for an unreachable path.

4. ModuleClaim is a non-discriminated singleton that export/documentation claims will need to generalize (low, anticipated refactor)

- Where: src/lib/records.ts:17-37 (ModuleRecord, ModuleClaim, ProgramRecord union).
- Governing requirement: review focus #1 asks whether the record model provides "a sound base for exports/documentation... requirements" and to flag "premature abstractions... before more code uses them."
- Reasoning: the single 'claim' record kind is hard-wired to information: { type: 'module', ... } with module-specific fields (name, handle, facets) directly on it, rather than being a generic Claim<T> shape. When export-relationship and documentation-assertion claims are added (both explicitly named as the next standard-expansion work), this type will need to become a real discriminated union on information.type, and every current site that narrows via claim.kind !== 'claim' (e.g. projections.ts:4-10) will need a second narrowing on information.type. This is foreseeable, not a flaw in what exists — the store and evaluation boundary don't hard-code anything that would block it (ProgramRecordStore, references() in memory-store.ts are already generic over record kind).
- Disposition: not a defect; a natural, already-anticipated evolution (confirmed by docs/architecture/README.md's own "the record union will grow when those concrete records are implemented"). Recorded here only because focus #1 specifically asked for this kind of forward check.
- Suggested action: none needed now; worth a short mental note when exports/documentation land that ModuleClaim becomes one variant of a broader Claim union rather than being renamed/overloaded in place.

5. Generated-output exclusion default is directory-relative, not checkout-relative — confirmed adequate, but easy to wire wrong later (informational, not a defect in this commit)

- Where: src/lib/typescript/project.ts:26-29; governing text in dev/conventions.md ("Local development observation sink selection") and docs/architecture/README.md.
- Reasoning: the selected sink destination is fixed at "the PostCode development checkout's _observations/ directory... independently of the selected project's configuration directory" (conventions doc). The current default exclusion is path.join(dirname(configPath), '_observations') — i.e. relative to the analyzed project's config directory. This is correct by coincidence for self-analysis (checkout root == config directory) and harmless for an unrelated external repository (the real _observations/ tree isn't under the analyzed repo at all, so excluding a nonexistent directory there is a no-op). It would only become a real gap if a future invocation analyzes a tsconfig.json that sits somewhere in the PostCode checkout other than the checkout root — the caller-supplied excludedOutputDirectories parameter (project.ts:19, exercised by the "explicit output exclusion applies outside the default destination" test) is exactly the documented mechanism for that case.
- Disposition: the contract is sound and already tested for the case it's meant to cover; this is a caution for whoever wires the eventual CLI, not a finding against this commit.
- Suggested action: none now; worth remembering when the CLI is built that it must pass the checkout's actual _observations path explicitly whenever it isn't analyzing from the checkout root.

Focus-by-focus disposition

1. Record model / store / evaluation / projection soundness: sound. Atomicity, immutability, cross-reference validation, and kind-checking in memory-store.ts are correct and match their own claims (verified by hand-tracing put()'s two-pass validate-then-commit design and its handling of same-batch forward references). Only forward-looking note is #4 above.
2. Module discovery contract: correct against the stated population. I hand-verified the six-module fixture's expected evidence counts (including the ambient merge producing 3 ambient.d.ts evidence records under per-module contexts) match what the test asserts, confirmed ts.isExternalModule correctly incorporates automatic module detection (verified by the passing NodeNext/package.json test), and confirmed root-file provenance vs. conceptual-module distinction is honored. Minor gap: #2 above.
3. Snapshot/method-version sufficiency: sufficient. The whole methods registry (not just discovery) feeds snapshotId, so any method-version bump changes identity — this is explicitly required by dev/conventions.md, not an accidental over-coupling as I initially suspected. All the "changed input" determinism tests pass and correctly exercise config inheritance, source changes, package metadata, and previously-absent resolution targets.
4. Generated-output exclusion: enforced through roots, imports, directory listings, and symlink targets as claimed, verified via the exclusion tests and by hand-tracing the lexical+real dual-path check in inputs.ts. Caller contract is adequate; see #5.
5. Qualification usability under empty/unavailable/partial results: sound. populationEstablished is correctly derived from execution+materialization (deliberately independent of applicability/availability, consistent with the product design's three-dimension model), and inspect correctly narrows per-module context to the selected subset while still surfacing lens-wide context. See #3 for one untested edge.

Overall disposition

No finding here should prevent building further on this core. The implementation is unusually disciplined about the distinctions the governing documents care about (claim vs. claim-context vs. evaluation outcome vs. projection; source evidence vs. conceptual name; operational failure vs. qualifying diagnostic; established-empty vs. unavailable). All handoff verification claims reproduce exactly. The five findings above are two low-priority completeness/robustness notes untested by current fixtures (#2, #3), one anticipated non-issue worth a mental flag (#4), one forward-looking caution already covered by the existing caller contract (#5), and one genuine but narrow ambiguity in the plan's own text (#1) that's worth a deliberate one-line resolution before CLI argument handling is built on top of the current single-selector shape, rather than discovering it needs to change after more code depends on it.
