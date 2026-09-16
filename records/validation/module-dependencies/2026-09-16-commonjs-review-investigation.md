# CommonJS review investigation and proposed recognition rule

Date: 2026-09-16
Task: [Module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Basis: [Provider-contract round 1](../../reviews/module-dependencies/2026-09-16-provider-contract-round-1-findings.md), findings 1 and 3
Status: historical investigation; its recognition proposal is replaced by the [final ordered proposal](2026-09-16-final-recognition-contract.md); validation adaptation authorized and exercised

## Authorization and boundary

The human authorized investigation of classic and mixed-module fixtures and the
surveyed ts-node checkout, followed by a proposed rule before implementation.
No production recognizer, population change, or governing-plan revision is made.

## New reproducible compiler evidence

The [context fixtures](../../../fixtures/dependency-context/README.md) and
[tests](../../../test/dependency-contract.test.ts) establish these facts using
TypeScript 6.0.3 and PostCode's pinned `@types/node` 22.20.2:

- Explicit `module: commonjs` plus classic `moduleResolution: node` has undefined
  `SourceFile.impliedNodeFormat`. The configured CommonJS option is available
  independently; the real ambient `var require: NodeJS.Require` binding is
  callable and not a local value binding.
- Mixed NodeNext `.cts` and `.mts` files have different per-file formats while
  sharing exactly the same Node require symbol, declaration, and call signature.
  A callable ambient declaration alone cannot discriminate those contexts.
- Excluding globals during lexical lookup returns no local binding for all four
  cases: a global function implementation named require, an ambient callable
  variable, a noncallable ambient variable, and no declaration. Declaration
  provenance and callability distinguish those cases; the local lookup alone
  cannot.

These assertions capture evidence only. No test encodes a chosen recognition
outcome or silently resolves the outstanding policy choice.

The official [TypeScript module reference](https://www.typescriptlang.org/tsconfig/module.html)
distinguishes configured CommonJS output from per-file NodeNext format and notes
that module mode also affects checking and resolution. This supports inspecting
both inputs, without claiming emitted output was produced. Node's
[ES-module documentation](https://nodejs.org/api/esm.html#no-require-exports-or-moduleexports)
distinguishes ordinary CommonJS globals from a locally constructed require in an
ES module. That runtime documentation is context for the conservative proposal,
not evidence that any source call executed or that a loader exists.

## ts-node evidence and limits

The public repository was checked out at exactly
`ddb05ef23be92a90c3ecac5a0220435c65ebbd2a`. The
[revision's configuration](https://github.com/TypeStrong/ts-node/blob/ddb05ef23be92a90c3ecac5a0220435c65ebbd2a/tsconfig.json)
selects `src/**/*`, uses CommonJS/Node resolution, and requests Node types.
No dependency install or repository script was run. The checkout was nested under
PostCode for this investigation; TypeScript and Node declarations resolved from
PostCode's ancestor `node_modules`. This is not the revision's complete dependency
environment: its package requests TypeScript 4.7.4 and Node typings 13.13.5.

[Retained compiler evidence](2026-09-16-ts-node-compiler-evidence.json) records the
conditions, counts, every core bare one-argument require call, and the two relevant
import-type occurrences. Core here means `src/` excluding `src/test/` **for report
selection only**. The configured Program was not narrowed; it had 66 roots,
including 27 core roots, and 228 SourceFiles in this environment. All 21 reported
core calls had no local require binding, a callable Node ambient variable, and
undefined implied format. There were 18 literal calls and 3 nonliteral calls.

| Surveyed occurrence | Explicit resolution target | Configured root | In compiler Program | Supported source-module predicate |
| --- | --- | --- | --- | --- |
| `src/bin.ts:526` | `src/child/child-loader.ts` | yes | yes | true |
| `src/index.ts:1466` | `src/esm.ts` | yes | yes | true |

Thus finding 3's population hypothesis is confirmed at the compiler-evidence
level in this environment. Those two targets do not require population expansion.
Other targets do: some `dist-raw` files resolve but are absent from the Program,
and some are loaded but do not satisfy the existing external-module SourceFile
predicate. Missing package installations prevent broad external-resolution
conclusions. Exact ambient `module` and `repl` targets were visible through the
Node declarations; their names do not independently establish platform identity.

The three nonliteral expressions are `transpilerPath` at `src/index.ts:671`,
`transpilerConfigLocalResolveHelper(swc, true)` at `src/transpilers/swc.ts:32`, and
`swcResolved` at `src/transpilers/swc.ts:48`. No expression was evaluated.

### Two further findings requiring human direction

First, actual `openTypeScriptProject` on the unchanged configuration returns
**project-open-failed** with codes 5107 (deprecated Node10 resolution without a
6.0 deprecation acknowledgement) and 5102 (removed `importsNotUsedAsValues`).
The manual compiler probe explicitly continues only to inspect compiler facts;
it is not a successful PostCode investigation, full discovery verification, or
final instrument-validation result. No compatibility bypass has been added.

For final instrument validation, I propose a separately named investigation
configuration at this same revision that preserves the selected source population
and analysis options, removes only the removed option, and adds
`ignoreDeprecations: "6.0"`. Retain both the original opening failure and the
exact adaptation, then verify root equality and the supported cases with the
production provider. Complete the dependency environment separately without
executing repository lifecycle scripts. An alternative is a recorded later
revision with equivalent cases, as the approved plan allows. This investigation
does not choose between those alternatives.

Second, both surveyed internal require calls have adjacent `typeof import(...)`
expressions naming the same targets, and checker symbols resolve those import
types to the same SourceFiles. The plan's survey wording calls the relationships
otherwise undiscoverable, but its supported import-type mechanism can already
supply evidence for these pairs. I propose qualifying that survey conclusion:
CommonJS remains required to preserve additional mechanisms, mixed type-only
qualification, and nonliteral request results; the two pairs are not evidence of
unique-edge recovery in this pinned source. This does not remove any approved
mechanism or acceptance requirement. No plan or decision wording has been changed
pending human direction.

## Proposed recognition rule — approval required

Replace the unresolved format-or-declaration disjunction with an ordered rule:

1. Retain the approved call-shape boundary: bare `require`, exactly one argument.
   Reject established local value bindings, including parameters, imports,
   hoisted functions, block bindings, and module-local ambient declarations.
2. Determine context from the configured compiler. A defined per-file format has
   precedence: CommonJS supplies positive format evidence; ESNext does not.
   Only when per-file format is absent may an explicit configured
   `module: CommonJS` supply the fallback. A shared ambient declaration alone
   never overrides ESM or supplies a missing format decision.
3. Also require a resolved global callable binding with at least one declaration,
   all contributing declarations ambient/declaration-only, and no captured
   implementation or conflicting binding. Preserve those declarations as evidence.
   Missing, noncallable, or conflicting evidence does not become a recognized
   dependency occurrence; disclose the relevant recognition-coverage limitation.
4. For an accepted call, keep literals and nonliterals separate. Resolve literals
   in CommonJS resolution mode through the captured host and retain supported
   target, unresolved, or resolved-outside-population status. Nonliterals remain
   target-indeterminate. None of these outcomes asserts execution or loading.

| Case | Proposed outcome |
| --- | --- |
| NodeNext `.cts`, ambient callable global, no local binding | recognize source request |
| NodeNext `.mts` with the same ambient declaration | no recognized occurrence; disclose unsupported context |
| Classic CommonJS, no per-file signal, ambient callable global | recognize source request |
| Other or missing format without explicit CommonJS fallback | recognition unavailable/unsupported context |
| CommonJS format but absent/noncallable/conflicting declaration | recognition evidence unavailable |
| Local require binding or global implementation named require | excluded as established alternative binding |
| Accepted nonliteral call | target-indeterminate request, no edge |

This is intentionally conservative for projects lacking declarations even when
configured for CommonJS. The proposed boundary must be disclosed, not reported as
an established absence of dependencies. Node-aware context inference, unusual
ambient merges, and unsupported compiler configurations must not be broadened
implicitly during implementation. The two motivating internal calls and all three
nonliteral calls have the positive ingredients under the observed environment;
the original configuration still fails operational opening as reported above.

After human agreement, encode recognition-outcome tests and integrate the rule;
then seek further review under the existing handoff. Until then this remains a
proposal, and the intermediate gate is unsatisfied.

## Reproduction

```sh
npm run check
npm run build
node --test _build/test/dependency-contract.test.js
node _build/test/dependency-repository-probe.js /path/to/ts-node/tsconfig.json
```

The [manual probe](../../../test/dependency-repository-probe.ts) parses the given
configuration without modifying it, uses the captured-input host for compiler
resolution, reports operational opening separately, and never executes target
code. Reproduce the pinned revision and record dependency versions and lookup
location; a fully installed or differently placed checkout may change external
results. The retained JSON discloses path normalization and import-type filtering.
