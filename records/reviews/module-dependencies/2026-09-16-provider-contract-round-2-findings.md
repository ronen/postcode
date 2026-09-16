# Module dependency provider contract review — round 2 findings

Record type: findings
Reviewer: Independent review agent (Claude Sonnet 5, fresh session per round 1; retains round-1 context in this conversation but no other prior context)
Handoff: [2026-09-16 provider contract handoff](2026-09-16-provider-contract-handoff.md)
Round: 2
Reviewed target: `be4897e66de57c16caf869d2da9bec829a8ef8ec`, under the same handoff and original baseline `8dac095574bc7dd40ab105d2ce1fe5524c1cf647`
Prior findings: [Round 1](2026-09-16-provider-contract-round-1-findings.md)
Prior reviewed target: `12a5e76bd0c6211bf70ffb0c097085f7bd2e66b9`

## Returned findings

### Scope and method

I read the [disposition](2026-09-16-provider-contract-disposition.md), the new
[bounded CommonJS source evidence decision](../../../docs/decisions/bounded-commonjs-source-evidence-decision.md),
the [CommonJS review investigation](../../validation/module-dependencies/2026-09-16-commonjs-review-investigation.md),
the [final ordered recognition contract](../../validation/module-dependencies/2026-09-16-final-recognition-contract.md),
the updated [characterization record](../../validation/module-dependencies/2026-09-16-typescript-contract.md),
the task record's follow-up log, the diffs to `docs/plans/module-dependencies-plan.md`
and `docs/decisions/module-dependency-structure-decisions.md`, the full updated
`test/dependency-contract.test.ts` (22 cases, up from 13), and every new fixture
under `fixtures/dependency-context/`. I confirmed `be4897e` is the exact current
target: `git diff --stat be4897e HEAD` shows only `STATUS.md` and the disposition
record changed afterward, and no `src/` file has changed since the original
baseline (`git diff --stat 8dac095 be4897e -- src/` is empty).

I reproduced the stated verification: `npm run check`, `npm run build`,
`node --test _build/test/dependency-contract.test.js` (22/22 passed), `npm test`
(151/151 passed), and `git diff --check 8dac095 be4897e` (clean). I independently
fetched ts-node's `tsconfig.json`/`src/bin.ts`/`src/index.ts`/`src/transpilers/swc.ts`
at the pinned revision (`ddb05ef23be92a90c3ecac5a0220435c65ebbd2a`) from GitHub to
verify the record's specific line-level claims, and spot-checked
`2026-09-16-ts-node-adapted-validation.json` and the adapted `.jsonc` config
against the claimed diff. I also wrote further disposable compiler probes against
the pinned `typescript@6.0.3` to test scenarios adjacent to, but not identical to,
the new fixtures.

### Disposition of round-1 findings

All four round-1 actionable findings are substantively and accurately addressed,
and the work goes beyond a minimal fix:

- **Finding 1 (format/declaration precedence)** is resolved with a genuinely new
  ordered rule (final contract, "Ordered rule" steps 1-6) that gives a defined
  per-file format precedence over declaration evidence, uses `options.module`
  only as a fallback when per-file format is absent, and treats `preserve`
  as a distinct conditional case requiring corroborating declaration evidence.
  This directly closes both halves of the round-1 gap: I confirmed by fetching
  ts-node's `tsconfig.json` that its explicit `"module": "commonjs"` feeds the
  fallback branch (matching the new `classic` fixture and test 14), and the new
  `mixed`/`preserve` fixtures and tests 15/17 now pin the previously-undecided
  outcome for an ESM file that shares a visible ambient declaration with a
  CommonJS file — exactly the false-positive scenario I raised. I also
  independently re-verified the `program.getCompilerOptions().module` value for
  ts-node's exact classic configuration and the `impliedNodeFormat === undefined`
  claim; both hold.
- **Finding 2 (default import + all-type named list)** is fixed with a matching
  fixture addition and assertion (`imports[5]` in `requests.cts`, test 1). Verified
  by reading the updated fixture and test.
- **Finding 3 (ts-node population boundary)** went beyond narrowing the risk: the
  implementing agent checked out the actual pinned ts-node revision and confirmed,
  at the compiler-evidence level, that both cited internal targets
  (`src/child/child-loader.ts`, `src/esm.ts`) are selected roots already present
  in the Program. I independently re-fetched `src/bin.ts:526` and `src/index.ts:1466`
  from GitHub and confirmed both really do contain `require(...) as typeof import(...)`
  pairs against the same targets, which also substantiates the new decision's
  correction that these two pairs are not uniquely recoverable through CommonJS
  alone (import-type evidence already reaches them). I further fetched
  `src/index.ts:671` and `src/transpilers/swc.ts:32,48` and confirmed the three
  cited nonliteral `require(...)` expressions exist as described.
- **Finding 4 (nested-namespace ownership)** is fixed: the test now walks outward
  from the actual `import('target').T` occurrence inside `Nested`, records the
  visited enclosing module names (`['Nested', "'named'"]`), and asserts the
  resulting owner equals `named` and differs from the resolved target `target`.
  This is exactly the direct assertion I asked for.

I found no instance where a round-1 finding was minimized, reinterpreted away, or
marked resolved without matching evidence. The disposition record's claims all
checked out against the actual diffs and re-run tests.

### New actionable findings (round 2)

1. **The ambient/implementation discriminator for a `require` binding is untested
   in its most confusable shape.** The final contract's "declaration interpretation
   boundary" and its supporting test (`global implementation, ambient variable,
   absent binding and noncallable declaration differ`) distinguish a global
   function *implementation* (`function require(name) {...}`, `ambient: false`,
   kind `FunctionDeclaration`) from an ambient *declaration*
   (`declare var require: ...`, `ambient: true`, kind `VariableDeclaration`). I
   probed the one shape in between that the tests skip: a plain, non-`declare`
   global **variable** implementation (`var require = (name) => name;`, no
   `declare`). It produces `declarations: ['VariableDeclaration']`,
   `ambient: false` (via the same `getCombinedModifierFlags` check the contract
   specifies), and one call signature — i.e. it has the *same declaration kind*
   as the ambient-variable case, differing only in the ambient modifier flag. This
   is the shape most likely to be misclassified if a future implementation ever
   keys off declaration syntax kind instead of strictly the ambient flag, and it
   is a legitimate real-world pattern (a global shim file assigning `require`
   without a `.d.ts`). Recommend adding this exact case to the test/fixture set
   before the discriminator is implemented, alongside the already-tested
   function-implementation and ambient-variable cases.

2. **The "resolved interface or type alias" callable-annotation claim is asserted
   but not exercised.** The declaration-interpretation boundary text says an
   ambient variable's "interpretable explicit callable annotation" includes "a
   resolved interface or type alias," but
   `preserve binding evidence is absent, corroborating, alternative, or conflicting…`
   (the only test that inspects per-declaration annotation types) uses only
   inline function-type annotations (`(name: string) => unknown` / `string`). I
   probed `interface Requireish { (name: string): unknown } declare var require:
   Requireish;` and confirmed `checker.getTypeFromTypeNode(declaration.type!)
   .getCallSignatures().length` correctly resolves to `1` through the
   `TypeReference`, so the claim is accurate — but it is currently a documentation
   claim, not a pinned compiler fact. Recommend adding one case using a named
   interface or type alias annotation rather than only inline function types.

### Non-defect observation worth recording

I attempted a third adversarial shape — a global `require` symbol receiving both
a real implementation (`function require(name) {...}`) and an ambient
declaration (`declare var require: (name: string) => unknown;`) in the same
scope, to see whether "mixed callable/noncallable, incompatible, or otherwise
conflicting evidence" (final contract, step 4) could arise between an
*implementation* and a *declaration* rather than between two declarations. It
cannot in this pinned compiler: TypeScript reports `TS2300: Duplicate identifier
'require'` and does not merge the two into one symbol (the function-name lookup
returns only its own single `FunctionDeclaration`). This combination is not a
soundness gap in the contract — it is an invalid program that TypeScript itself
rejects — so I am not raising it as a finding; I record it here only so the
disposition does not need to independently rediscover the same dead end.

I also confirmed a narrower boundary case worth a one-line disclosure rather than
a fixture: a project with no per-file `impliedNodeFormat` **and** no explicit
`compilerOptions.module` (e.g., a minimal legacy tsconfig that relies on
TypeScript's own historical default-to-CommonJS behavior for pre-ES6 targets)
reads `program.getCompilerOptions().module` as `undefined`, not `CommonJS` — I
verified this with a probe using an unset-module, ES5-target config. Under the
final rule this falls into the "insufficient context" bucket rather than being
recognized, even though TypeScript's own effective behavior would be CommonJS.
This fails safe (under-recognition, not a false positive) and does not affect the
ts-node validation target, which sets `module` explicitly, so it is not blocking.
It is, however, a real named boundary that the outcome table does not currently
call out alongside its other named exclusions, and the eventual provider-contract
or coverage-disclosure text should say so explicitly rather than leaving it to be
inferred.

### Unverified areas / residual limits

Consistent with the record's own disclosures, I did not attempt to verify
wildcard ambient targets, resolution-mode attributes on import types, the
captured-host/output-exclusion boundary, or augmentation ownership against an
external/unresolved target — these remain open exactly as stated, and were not
in scope for round 2's assessment of what changed. I did not install ts-node's
full dependency tree or re-run the adapted-configuration validation myself; I
verified its inputs (the exact config diff, the two target file paths and their
source content, and the three nonliteral call sites) against the live GitHub
repository and found them accurate, but I did not re-execute
`dependency-repository-probe.ts` against a local checkout.

### Recommendation on the stated gate

All four round-1 findings are resolved with matching evidence, and I found no
new correctness defect in this round — only two small, additive coverage gaps
(findings 1 and 2 above) in the same spirit as the round-1 findings, plus one
narrow, fail-safe boundary condition worth a documentation line. None of these
three items reveal a flaw in the ordered rule's logic itself; they are missing
pins on claims that, where I checked them, held up. I recommend treating the
intermediate provider-contract checkpoint as ready for the human's approval of
the ordered recognition rule, optionally after adding the two small fixture
cases above, which are cheap and do not require further design discussion. I
did not find anything here that should reopen the classic/mixed/preserve
precedence design itself.
