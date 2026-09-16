# Module dependency provider contract review — round 1 findings

Record type: findings
Reviewer: Independent review agent (Claude Sonnet 5, fresh session; no prior context on this task beyond the handoff and repository)
Handoff: [2026-09-16 provider contract handoff](2026-09-16-provider-contract-handoff.md)
Round: 1
Reviewed target: `12a5e76bd0c6211bf70ffb0c097085f7bd2e66b9` (diff range `8dac095574bc7dd40ab105d2ce1fe5524c1cf647..12a5e76bd0c6211bf70ffb0c097085f7bd2e66b9`), branch `codex/module-dependencies`

## Returned findings

### Scope and method

I read the handoff, the governing plan and all four linked decision records, the
initial-module-inventory decisions, `dev/review.md`, the characterization record,
`test/dependency-contract.test.ts`, the fixture files under
`fixtures/dependency-contract/`, and the existing production integration
(`src/lib/typescript/project.ts`, `src/lib/typescript/inputs.ts`) that the
proposed contract must eventually fit. I confirmed by diff that the handoff
commit (`23b9ded`, current branch tip) changed only the handoff document itself,
so the reviewed target's tree is identical to the working tree I inspected.

I reproduced the requested verification exactly:

- `npm run check` — passed, no output.
- `npm run build` — passed, no output.
- `node --test _build/test/dependency-contract.test.js` — 13/13 passed.
- `npm test` — 142/142 passed.
- `git diff --check 8dac095 12a5e76` — clean.
- `git diff --stat 8dac095 12a5e76 -- src/` — empty; confirms no production source changed, matching the handoff's claim.

I then went beyond re-running the given tests. I traced each assertion in
`test/dependency-contract.test.ts` against the actual fixture source to confirm
the assertions describe what the fixture really contains (they do — I hand
verified node ordering, indices, and counts for every test). I also wrote
disposable, out-of-repository probe scripts against the same pinned
`typescript@6.0.3` package to exercise compiler shapes the fixture does not
cover, and fetched `tsconfig.json`/`package.json` for the surveyed ts-node
revision (`ddb05ef23be92a90c3ecac5a0220435c65ebbd2a`) from GitHub to check a
population-boundary claim empirically. No repository files were added by these
probes; they were run from temporary scratch scripts and deleted.

### Actionable findings

1. **The proposed CommonJS "format or declaration" disjunction is unresolved and the fixture never exercises the compiler configuration of the actual motivating case (ts-node).** Proposed contract item 4 says affirmative context "may be a compiler-established CommonJS file format **or** an applicable ambient global callable require declaration." I probed both branches independently with the pinned compiler:
   - Under ts-node's actual root `tsconfig.json` (`"module": "commonjs", "moduleResolution": "node"` — fetched from the surveyed revision), `SourceFile.impliedNodeFormat` is `undefined` for every file. The per-file format signal that the entire characterization suite exercises (`file.impliedNodeFormat` on `.cts`/`.mts` under `module`/`moduleResolution`: `NodeNext`) simply does not exist under classic module resolution. If the provider's "format" branch is implemented as `impliedNodeFormat === CommonJS`, it will never fire anywhere in ts-node, i.e. in the very repository whose CommonJS-heavy internal relationships motivated this slice (`docs/plans/module-dependencies-plan.md`, "CommonJS scope evidence"). The provider would then depend entirely on the declaration branch for ts-node, which is untested end-to-end.
   - Conversely, I confirmed (extending the existing `esm.mts` test) that an ESM-format file with a visible, unshadowed, callable ambient `require` declaration is **evidentially indistinguishable** from a CommonJS file's declaration branch using the tests' own signature (`resolveName(...) === undefined` and one call signature). Real projects commonly mix `.cts`/`.js` (CommonJS) and `.mts` (ESM) files under one `tsconfig` with `"types": ["node"]`, which puts exactly this ambient `require: NodeRequire` declaration in global scope for every file regardless of that file's own module format. If the declaration branch is sufficient on its own (a literal "or"), genuine ESM occurrences would be misrecognized as CommonJS-form requests in such dual-module projects — precisely the over-permissive outcome the plan itself warns against ("An overly permissive CommonJS recognizer could mistake a local function or unsupported loader context for a module request").
   - These two facts are in tension: a pure disjunction risks false positives in mixed-module NodeNext projects; a pure conjunction (format **and** declaration) would silently produce no recognition anywhere in ts-node, defeating the slice's own stated acceptance condition ("bounded CommonJS-form recognition establishes the supported outcomes for the surveyed literal and nonliteral requests"). Neither the record nor the tests state or pin an intended precedence (e.g., trust a defined per-file format when available and use declaration only as a fallback when format is genuinely indeterminate). No fixture exercises classic (non-NodeNext) module resolution at all, and no test asserts the intended recognition *outcome* for the `esm.mts` occurrence (only the raw compiler facts). The handoff itself flags this rule as needing "especially" independent scrutiny before integration; this is the concrete adversarial gap that scrutiny should close. I recommend an explicit precedence rule plus two new fixtures (a classic `module: commonjs` project, and a mixed NodeNext project with both `.cts` and `.mts` files sharing a `types: ["node"]`-style ambient declaration) before the recognizer is implemented.

2. **The "no default import" qualifier on whole-occurrence type-only aggregation (proposed item 5) has no fixture coverage.** I confirmed with a probe that `import Def, { type Shape } from './target.js';` produces `importClause.isTypeOnly === false`, a default binding, and named elements that are all `isTypeOnly: true` — exactly the shape the proposed rule's "no default import" exception is meant to guard against, so that a value-importing default clause doesn't get swept into a type-only aggregate merely because its named list is all-type. `requests.cts` never contains a default import combined with an all-type named list, so this qualifier is asserted in prose only. This is a small, cheap addition to the fixture and should be added before the aggregation logic is implemented and trusted.

3. **Q2 (population boundary vs. ts-node) is probably not actually at risk, but this is not yet confirmed and the record should say so precisely.** I fetched ts-node's root `tsconfig.json` at the surveyed revision: it selects root files via `"include": ["src/**/*"]`, i.e. root-file membership is directory-glob-driven, not import-reachability-driven. That means the two "otherwise undiscoverable internal relationships" the survey found are almost certainly between two files that are *already* both root files in the configured `Program` (globbed into `src/**/*`) independent of whether a `require()` call reaches them — so the "resolved but outside the supported population" outcome the characterization guards against is unlikely to be triggered for those two specific edges. I could not confirm this without running full discovery against the real ts-node checkout (out of scope for this round), and it does not generalize to a require target that resolves *outside* `src/` (e.g. into `node_modules`, a generated file, or a relative path escaping the include root). Recommend the final ts-node validation explicitly record whether the two internal edges' targets fall inside `src/**/*` (making them population members already) versus needing the resolved-outside-population path, since the current record leaves this as an open risk that a two-minute config inspection substantially narrows.

4. **Nested-namespace occurrence ownership is asserted in the proposal but not directly exercised by the test that is supposed to characterize it.** Test `module declarations and augmentations require symbol membership, not just syntax ownership` establishes that a namespace nested inside an ambient module (`Nested` inside `'named'`) is not itself in `checker.getAmbientModules()`. That is necessary evidence for an ownership-walk algorithm ("for nested namespaces, retain the enclosing established module," proposed item 1) but the test never actually walks up from the `import('target').T` request that sits inside `Nested` to confirm which enclosing node the ownership algorithm would land on, nor asserts that the result is `'named'` rather than something else (e.g., an unowned/unestablished result, or a mis-attribution to `'target'`, the import's own resolution target, which is a distinct symbol already shown not to equal the augmentation's enclosing symbol in the adjacent assertion). This is a real occurrence-ownership case, not just a "namespace isn't an ambient module" fact; recommend a direct assertion of the walked-up owner for that specific node before relying on this test as ownership evidence.

### Non-defect observations

- Every assertion in `test/dependency-contract.test.ts` that I hand-traced against `requests.cts`, `ambient.d.ts`, `target.ts`, `forward.ts`, and `require-only.ts` is accurate: node ordering, counts (5 imports, 5 exports, 10 bare `require` calls, 15 same-target literal occurrences, 2 property-access calls, 8 single-argument require calls), and the scope-lookup declaration-kind sequence for parameter/hoisted-function/block-scoped shadowing all match the fixture exactly.
- I independently confirmed with a probe that `declare var require: (name: string) => unknown;` (the shape `@types/node` actually uses, `declare var require: NodeRequire`) produces the identical evidentiary signature (`resolveName` excluding globals → `undefined`; one call signature) as the fixture's `declare function require(...)` shape, differing only in `declarations[0].kind` (`VariableDeclaration` vs. `FunctionDeclaration`). This is reassuring — the characterized declaration-branch evidence generalizes to the real-world Node typings shape — but the fixture should still include it explicitly rather than leaving this generalization unverified in the repository's own evidence base.
- `src/lib/identity.ts`, `src/lib/records.ts`, and `src/lib/evaluation.ts` are unchanged in this diff, consistent with the record's claim that no identity-method version bump is needed yet.
- The re-exports-only composition predicate test is thorough and matches the decision text's positive/blocking lists exactly, including the empty-named-list re-export vs. bare local `export {}` distinction.
- The merged-ambient-declaration test (`parent`/`target`) correctly demonstrates occurrence-specific span retention under one shared owning symbol, which is solid evidence for the corresponding part of proposed item 1.

### Unverified areas / residual limits

I did not run analysis against a real ts-node checkout (only inspected its root `tsconfig.json`/`package.json` shape via network fetch); the exact source locations of the surveyed "two otherwise undiscoverable internal relationships" and "~10 literal requests" were not located or re-derived. Wildcard ambient targets, resolution-mode attributes on import types, the captured-host/output-exclusion boundary, and augmentation ownership when the augmented target is external or unresolved remain untested, exactly as the characterization record's own "Remaining characterization/integration checks" section discloses — I did not find reason to disagree with that self-assessment, beyond adding finding 4 above (nested-namespace ownership is under-asserted, not merely "remaining"). I did not attempt to assess presentation, CLI, graph, or organization-classification code, since none exists yet in this diff.

### Recommendation on the stated gate

Do not treat this checkpoint as sufficient to proceed to unqualified production integration of the CommonJS-form recognizer specifically. Finding 1 is a concrete, reproducible design gap — not a hypothetical concern — with a plausible path to either silently failing on the primary validation target (ts-node) or over-recognizing CommonJS-form calls in genuine ESM files, depending on how the current prose is read. It should be resolved with an explicit precedence rule and two additional fixtures before the recognizer is implemented and trusted. Findings 2 and 4 are small, cheap corrections to the characterization evidence that should be made before relying on it for the corresponding implementation pieces (type-only aggregation and ambient/augmentation ownership), but do not by themselves require broader re-scoping. Finding 3 narrows rather than raises the risk the record already disclosed for the population-boundary/ts-node question; it does not block proceeding with the general (non-CommonJS-specific) population-boundary handling, which is otherwise well evidenced by the tests I reproduced. All other characterization evidence I checked (request-syntax recognition, re-export target identity, resolution-mode package conditions, ownership of merged ambient declarations, and the composition predicate) held up under both re-derivation from the fixture and independent probing, and I recommend proceeding on those parts as characterized.
