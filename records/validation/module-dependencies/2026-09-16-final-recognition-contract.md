# Final ordered CommonJS recognition proposal

Date: 2026-09-16
Task: [Module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Decision: [Bounded CommonJS source evidence](../../../docs/decisions/bounded-commonjs-source-evidence-decision.md)
Status: completed proposal for provider-contract approval; production recognizer not integrated
Replaces as proposal: the mandatory-ambient rule in [the earlier investigation](2026-09-16-commonjs-review-investigation.md#proposed-recognition-rule--approval-required)

## Authorized result

The human authorized removal of the universal ambient-declaration prerequisite,
a precise completed-lexical-analysis rule, bounded `module: preserve`
characterization, a final ordered proposal, adapted ts-node validation, and a new
superseding decision preserving the previous decision's history. This report
returns those results; it does not infer that the intermediate review gate or the
complete compiler contract is accepted.

## Evidence and the preserve boundary

The [compiler tests](../../../test/dependency-contract.test.ts) now cover 22 cases.
Six additions establish:

- `module: preserve` with Bundler resolution retains static import/export syntax
  and literal/nonliteral require calls. Ordinary `.ts` files have no per-file
  format signal; explicit `.mts` files still have ESNext format. Both can see the
  same ambient callable declaration.
- CommonJS `.cts` and `.cjs` occurrences can have no global declaration. The
  compiler's JavaScript identifier lookup may nevertheless return a generated
  require symbol with no declarations, even when globals are excluded.
- A call-expression lookup location avoids that fallback while retaining local
  scope in the tested nested calls, parameters, hoisted functions, and block
  bindings. Other tests cover imported aliases, destructuring, catch, loops,
  module-local declarations, and type-only names.
- A parse-recovered source or a `with` ancestor can coexist with a lookup that
  returns no binding. Neither is sufficient for the negative lexical claim.
- Under preserve, absent, callable, noncallable, and conflicting ambient
  annotations remain distinguishable. Inspecting each declaration's own type
  annotation matters: a merged effective type can conceal contradictory input.

Recommendation: **support preserve when no per-file format is defined and an
unshadowed, consistently callable ambient global declaration corroborates the
mixed-mode interpretation**. Preserve without that corroboration is explicitly
insufficient context. Defined ESM format remains an established unsupported
format, even under preserve; it is not missing evidence.

This is a bounded provider guarantee, not a claim that every valid preserve-mode
request is covered. CommonJS context is already affirmative without typings;
preserve intentionally allows multiple source mechanisms and receives the extra
corroboration requirement. The requirement is conditional, not the rejected
universal declaration prerequisite. Choosing this supported subset rather than
leaving preserve wholly unsupported is the recommendation returned for approval.

## Ordered rule

Apply the steps in order and preserve the first blocking outcome and its evidence.
A recognized occurrence is still subject to ordinary source-owner, snapshot,
diagnostic, and target-resolution qualification.

1. **Ownership and shape.** Work only on captured occurrences owned by established
   project modules. Keep unestablished ownership as a separate coverage outcome.
   The call must be a bare identifier exactly named `require` with exactly one
   argument. Aliases, property calls, other APIs, and wrong arity are outside the
   approved mechanism. Do not infer targets by evaluating expressions.
2. **Complete lexical analysis.** Use the exact protocol below. An incomplete,
   unsupported, stopped, or failed analysis cannot establish no local binding.
   A successfully found local value binding is an established alternative binding
   and excludes the call, regardless of type annotations or file format.
3. **Determine context with precedence.** A defined compiler per-file format wins.
   CommonJS supplies affirmative context; ESNext is an established unsupported
   format for this bounded provider. Only if the per-file value is absent may an
   explicit configured `module: CommonJS` supply affirmative fallback context.
   If that value is also absent or different, distinguish explicit `Preserve`
   (conditional context in step 5) from every other insufficient/unsupported
   configuration. Do not treat an ambient declaration alone as a format override.
4. **Inspect available global binding evidence.** Inspect the callee's resolved
   symbol and every contributing declaration, separately from the lexical result.
   No declaration, including a characterized compiler-generated JavaScript symbol,
   is recorded as absent declaration evidence. A global implementation or another
   established alternative binding excludes the call. Consistently noncallable
   declaration evidence also establishes an alternative. Mixed callable/noncallable,
   incompatible, or otherwise conflicting evidence is its own outcome. Unavailable
   interpretation is insufficient evidence, not absence. Callable ambient evidence
   corroborates recognition and retains its source references.
5. **Apply the declaration threshold.** Affirmative CommonJS context plus completed
   no-local-binding analysis permits recognition with absent or corroborating
   declaration evidence. Preserve with absent per-file format requires the
   corroborating case. Preserve without it remains insufficient context. No
   alternative/conflicting/insufficient binding result permits recognition.
6. **Resolve or retain indeterminacy.** For recognized literals, use the configured
   resolver in CommonJS mode through the captured host. Preserve supported module
   targets, unresolved results, and resolved files outside the supported population
   distinctly. Exact ambient targets require checker evidence, not spelling-based
   platform inference. Nonliteral expressions produce target-indeterminate request
   results, not edges. Aggregate only established ordered module pairs, retaining
   every occurrence and conservative whole-edge type-only qualification.

### Exact completed-lexical-analysis protocol

For this pinned TypeScript provider, a negative lexical result requires all of:

1. Successful configured project opening; the occurrence SourceFile is the actual
   captured member of that Program and the node's parent chain reaches that same
   SourceFile. An absent file, detached node, or unestablished ownership cannot be
   used to establish the negative claim.
2. No encountered syntactic diagnostic in that SourceFile. This conservative
   prerequisite prevents parser recovery elsewhere in the same scope from hiding
   a binding. It does not require a whole-project semantic/type check.
3. A completely inspected parent chain with no `WithStatement`. This is a lexical
   guarantee over captured syntax, not an assertion about execution or dynamic
   changes to a runtime environment.
4. A completed public-checker lookup using
   `checker.resolveName('require', location, ts.SymbolFlags.Value, true)`.
   Start `location` at the CallExpression and climb directly enclosing
   CallExpressions only. These nodes introduce no lexical scope. Using that anchor
   avoids the identifier-location JavaScript require-symbol fallback, including
   directly nested calls. Do not climb across a function, block, or other scope.
5. An `undefined` result establishes no local value binding under this characterized
   method. A symbol with a source declaration establishes a local binding. A result
   that cannot be interpreted under the characterized public evidence remains
   insufficient; absence of declarations on an unexpected result is not silently
   converted to no local binding.

The attempt is complete only after these steps finish. Cancellation/stopping
preserves an incomplete evaluation without a negative claim. A known unavailable
provider capability is unavailable. Unexpected checker exceptions or broken
invariants remain defects and propagate; they must not be caught and relabeled
ordinary no-binding results or routine unavailable analysis.

### Declaration interpretation boundary

Inspect declared contributions independently. Ambient function signatures must
have no implementation body; ambient variables must have an interpretable
explicit callable annotation (including a resolved interface or type alias).
Declaration-file provenance and ambient modifiers are evidence, not a blanket
permission to ignore an implementation or contradiction elsewhere in the symbol.
A declaration whose relevant type cannot be established is insufficient evidence.
Compare callable/noncallable contributions before trusting the merged symbol's
effective type. This determines source-mechanism evidence only; it does not claim
that all declarations are type-correct or that any callable value exists at runtime.

## Outcome table

Rows assume established ownership and supported call shape unless stated otherwise.

| Evidence | Outcome | Meaning for dependency results |
| --- | --- | --- |
| Wrong shape, alias, property, or excluded API | outside supported shape | no recognized occurrence |
| Captured local binding | established alternative binding | excluded occurrence candidate |
| Global implementation or consistently noncallable binding | established alternative binding | excluded occurrence candidate |
| Defined per-file ESM | established unsupported format | excluded under this provider, not a claim of no dependency |
| Syntax recovery, with scope, missing node context, incomplete lookup | insufficient lexical evidence | no recognition; disclose incomplete coverage |
| Conflicting declaration evidence | conflicting binding evidence | no recognition; retain conflict qualification |
| CommonJS per-file format, complete negative lexical result, no declarations | recognized request | retain missing declaration evidence without veto |
| Explicit CommonJS option, no per-file format, same lexical result, no declarations | recognized request | classic fallback; no loader claim |
| Either CommonJS context with consistent callable ambient declaration | recognized request | retain corroborating evidence |
| Preserve, no per-file format, complete negative lexical result, callable ambient declaration | recognized request | explicitly bounded preserve support |
| Preserve, no per-file format, declarations absent | insufficient context | explicitly disclosed unsupported case |
| Unset module option and no per-file format, including legacy pre-ES6 effective CommonJS defaults | insufficient context | fallback requires explicit CommonJS; no inference from compiler defaults |
| Other configuration without established supporting context | insufficient context or known unsupported configuration | distinguish known exclusion from unavailable evidence |
| Recognized literal with supported target | resolved occurrence | contributes to one ordered module-pair edge |
| Recognized literal resolving outside population | qualified non-edge result | no fabricated module or mislabeled resolution failure |
| Recognized unresolved literal | unresolved request result | no edge |
| Recognized nonliteral | target-indeterminate request result | no expression evaluation and no edge |

Recognition coverage outcomes must remain distinct from target-resolution results:
an excluded candidate is not an unresolved literal occurrence. Conditional or
unreachable syntax remains source evidence, without a claim that execution reached
it. No outcome establishes actual loading, value use, emission, or deployment.

## Adapted ts-node validation

The [retained result](2026-09-16-ts-node-adapted-validation.json) and
[exact adapted configuration](2026-09-16-ts-node-validation-config.jsonc) concern
revision `ddb05ef23be92a90c3ecac5a0220435c65ebbd2a`.
The original configuration is untouched. The only configuration edits are:

```diff
     "moduleResolution": "node",
+    "ignoreDeprecations": "6.0",
-    "importsNotUsedAsValues": "error",
```

The lines are separated in the original file; the complete adapted artifact and
both content digests preserve exact reproduction. Normalized compiler-option
comparison confirms these are the only option changes other than config filename.
Both parsed configurations select the **same 66 root paths**, compared as complete
sorted arrays; the retained result includes that array and its digest.

All declared dependencies were installed with `npm install --ignore-scripts
--package-lock=false --no-audit --no-fund`. `npm ls --all --json` exited zero with
no dependency problems. The result records installed direct versions and the
installed-tree digest. Installation resolved the repository's package ranges with
npm; it is not a reconstruction of the old Yarn lockfile environment. In particular,
Node declarations now come from the target's installed 13.13.5 package rather than
PostCode's ancestor 22.20.2 package. PostCode analysis still uses its pinned
TypeScript 6.0.3; target TypeScript 4.7.4 is an installed analysis input/dependency.
Lifecycle scripts and native builds were not executed, and target code was not run.

The unchanged original still fails production opening with diagnostics **5107 and
5102**. The adapted configuration opens successfully. The existing production
`evaluateModules` provider completes fully with **202 modules**, including both
surveyed targets as project modules with implementation available. Thus this is
more than a manual compiler probe for opening and discovery. It is still **not**
final dependency instrument validation: the dependency recognizer, relationships,
and presentations do not exist yet, and must later be exercised on this recorded
setup. The manual occurrence probe continues to retain 21 core candidates,
including three nonliteral expressions, without claiming production recognition.

Use the [probe](../../../test/dependency-repository-probe.ts) after installing the
recorded revision and placing the retained adapted configuration beside the original:

```sh
npm run build
node _build/test/dependency-repository-probe.js /path/to/ts-node/tsconfig.postcode-validation.json /path/to/ts-node/tsconfig.json
```

The probe asserts complete root-selection equality, records option differences,
keeps original failure separate, and invokes existing production discovery only
when opening succeeds. Output source paths are normalized as disclosed in the
retained JSON. No failed original opening is bypassed in application code.

## Decision preservation and remaining gate

Verification after the completed changes: `npm run check` passed; `npm test`
passed all **151 tests**, including **22** compiler-contract cases. `git diff
--check` passed. A byte comparison from `## Context` onward verified the prior
decision body unchanged, and changed-document local links were checked.

The [new decision](../../../docs/decisions/bounded-commonjs-source-evidence-decision.md)
supersedes only the headed CommonJS decision in the earlier bundle. The earlier
body, including its original rationale, is unchanged. Only lifecycle metadata
(status and forward mapping) changes as required by the decision README. The
current plan's survey summary now cites the corrected rationale.

The next step is human approval and, where requested, a further provider-contract
review of this complete proposal. Production integration remains paused. Later
integration must encode these recognition outcomes as behavior tests, capture
method/input identity, and complete remaining ownership/resolution/graph/product
verification. Neither these compiler tests nor existing module discovery satisfy
the final integrated-review gate.
