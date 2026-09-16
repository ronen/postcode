# TypeScript dependency evidence characterization

Date: 2026-09-16
Task: [Implement module dependencies](../../tasks/2026-09-16-module-dependencies.md)
Plan: [Module dependencies](../../../docs/plans/module-dependencies-plan.md)
Status: intermediate evidence for independent review; production integration pending

## Purpose and reproducibility

The first plan step requires characterizing the supported public compiler contract
before graph projections depend on it. This record preserves observed compiler
behavior and separates it from the proposed provider interpretation. It does not
change the approved population, governing decisions, or existing CLI behavior.

The pinned compiler is TypeScript 6.0.3. Run:

```sh
npm run check
npm run build
node --test _build/test/dependency-contract.test.js
```

The [characterization tests](../../../test/dependency-contract.test.ts) use the
[dependency-contract fixture](../../../fixtures/dependency-contract/README.md)
and self-cleaning temporary projects. They never execute fixture code. The main
fixture constructs SourceFiles through the same public `createSourceFile` path
as the current captured-input host. Other tests use standard compiler hosts to
isolate public behavior. Assertions are on compiler evidence, not rendered output
or a duplicate implementation of the future provider. One small candidate syntax
predicate characterizes the approved composition rule explicitly.

## Observations established by the tests

| Question | Observed evidence | Provider consequence |
| --- | --- | --- |
| Supported request forms | Public node kinds distinguish static and side-effect imports, direct re-exports, import-equals, import types, dynamic imports, and bare require calls. | No text scanning or emitted-code analysis is needed for recognition. |
| Explicit type evidence | Clause-level and element-level `isTypeOnly` flags remain distinct; import types expose `isTypeOf`. | Preserve the evidence before deciding whether all occurrences establish a whole-edge type-only claim. An empty named list must not become type-only through vacuous `every`. |
| Nonliteral expressions | Identifiers and concatenations remain expression nodes; no-substitution templates satisfy `isStringLiteralLike`. | Do not evaluate expressions. Treat no-substitution templates as literal dynamic targets. |
| Re-export intermediates | The specifier symbol identifies `forward.ts`; following its export alias reaches `target.ts`. | Use the specifier target for dependency structure; do not flatten the alias chain. |
| TypeScript require literals | `getSymbolAtLocation` on the literal returns no target, even for an already loaded target. | Existing discovery resolution evidence is insufficient for this mechanism. |
| JavaScript require literals | The equivalent JavaScript literal has a target symbol in this fixture. | Do not assume uniform checker behavior across source languages. |
| Explicit require resolution | `resolveModuleName` in CommonJS mode locates an existing target. | Use the captured host and configured options; resolution is a separate operation from symbol lookup. |
| Population boundary | Resolution finds `require-only.ts`, but the file is absent from `Program.getSourceFiles()`, before and after the lookup. | A found filename alone cannot create a supported module entity or edge. Preserve a resolved-but-outside-supported-population request outcome. Do not call it unresolved. |
| Package conditions | Import and CommonJS resolution modes choose different declaration files from one package's exports. | Carry the applicable usage mode; require must use CommonJS resolution mode even in an ESM file. |
| Local shadowing | `resolveName('require', location, SymbolFlags.Value, true)` identifies parameter, hoisted function, block variable, imported alias, and module-local ambient bindings. | Lexical position or a source-text search is insufficient. Exclude established local bindings, including calls before their declaration. |
| Missing versus global binding | Both can have no local lookup result, but only the global declaration has a symbol and callable signature. | Absence of a local symbol alone does not establish affirmative CommonJS context. |
| Source format | `.cts` and `.mts` retain distinct public `impliedNodeFormat` values under the captured-host construction. An ESM file can still see an ambient require declaration. | Format, declared availability, source-request recognition, and actual loader existence are different claims. |
| Ambient ownership | Merged named ambient declarations share one symbol while request locations remain associated with individual declarations. | Retain occurrence-specific source evidence rather than assigning every declaration placement to each occurrence. |
| Nested namespaces and augmentations | A namespace symbol is not a discovered ambient module. A module-augmentation name can resolve to the augmented source module instead of the enclosing file module. | Ownership cannot be implemented as simply the nearest syntactic module or every enclosing source file. |
| Composition | Named, wildcard, namespace, type-only, and empty-list direct `export ... from` forms pass the candidate syntax rule. Comments and empty statements do not block it; the tested declaration, import, executable, local-export, and assignment forms do. | Require at least one direct re-export and inspect every substantive top-level statement. Empty-list direct re-exports differ from local `export {}`. |
| Diagnostics | A supported import node survives a syntax error elsewhere in the same file. | Preserve encountered diagnostics and qualify the result; do not equate parse recovery with an unqualified complete interpretation. |

## Proposed provider contract for review

These are implementation proposals within the approved plan, not established
production behavior or independently reviewed guarantees.

1. Enumerate source requests only for project-classified modules in the existing
   discovered population. External-only modules remain opaque. Associate each
   occurrence with a discovered source-file module or visible named ambient
   module symbol. For nested namespaces, retain the enclosing established module;
   for augmentation bodies, require explicit symbol-to-population ownership.
   Unestablished ownership must become coverage qualification rather than being
   guessed. Merged declarations retain their individual source spans.
2. Retain one occurrence per supported request node. Capture the enclosing syntax,
   target expression or literal, mechanism, explicit type evidence, source owner,
   resolution attempt, and established target evidence before snapshot identity
   is finalized. Nonliteral dynamic and require calls produce no edge.
3. Use configured compiler symbol identity where established. Resolve CommonJS
   literals through the input-capturing host with the CommonJS resolution mode;
   map an established file back to the existing supported population. Exact named
   ambient targets need the configured checker's ambient-symbol evidence. Preserve
   unresolved, target-indeterminate, and resolved-outside-population outcomes
   distinctly. Do not infer Node builtin identity from a `node:` prefix alone.
4. A candidate bounded require recognizer accepts only a bare identifier and one
   argument, with no established local value binding. Affirmative contextual
   evidence may be a compiler-established CommonJS file format or an applicable
   ambient global callable require declaration. A global implementation-defined
   function named require must not qualify merely because local lookup excludes
   globals. Missing or conflicting declaration/context evidence needs an explicit
   unavailable-recognition result. Recognition establishes a source form only.
   This contextual rule especially needs independent scrutiny before integration.
5. Whole-occurrence type-only evidence can come from an explicit type-only clause,
   a nonempty all-type named list with no default import, or import-type syntax.
   Preserve `typeof import` as type-query evidence. Aggregate a type-only edge
   only when every supporting occurrence establishes it; retain unmarked mixed
   edges without runtime or value labels.
6. Composition must examine all established module declarations, ignoring only
   comments and `EmptyStatement`. Parse diagnostics or unestablished declaration
   bodies must qualify evaluation rather than silently proving a negative or
   positive property. Keep this expansion separate from discovery facets.

## Risks requiring review and subsequent implementation verification

The explicit-resolution/population distinction is the principal reason for this
intermediate checkpoint. The approved plan permits qualified non-edge outcomes,
but final ts-node validation must still demonstrate both surveyed internal edges
and qualified literal/nonliteral requests. This fixture alone does not establish
that acceptance condition. Expanding the configured Program to load every
require-resolved target would change the existing discovery contract and is not
silently authorized by this characterization.

The tests establish useful local-shadowing and format evidence, not a universal
proof that a callable global named require has CommonJS meaning. Review the
proposed affirmative-context rule, including globals supplied by project source,
Node typings, JavaScript inference, and absent declarations. Further adversarial
fixtures may be needed before accepting the production guarantee.

Remaining characterization/integration checks include wildcard ambient targets,
resolution-mode attributes on import types, source ownership under unavailable
symbols and augmentation diagnostics, multiple declaration files and placements,
external declaration-only targets, and the surveyed ts-node revision. Resolution
must be exercised through the actual captured-input and output-exclusion boundary,
including changed/missing inputs and conditional package metadata, before a new
provider claim is considered complete.

No dependency occurrence records, graph evaluation, lenses, expansions, CLI,
observations, or discovery-facet rename have been implemented at this checkpoint.
The full semantic fixtures, representative journey, unfamiliar-repository
exercise, clean instrument evaluation, latency measurement, and final integrated
review all remain required. No claim of slice completion is made.
