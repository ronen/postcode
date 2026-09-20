# CommonJS context counterexamples

These compiler-only fixtures address provider-contract review finding 1.
They do not implement or accept a recognition rule and never execute target code.

`classic` uses explicit CommonJS output and Node10 resolution, matching the
surveyed ts-node configuration's relevant settings. TypeScript 6.0 requires the
explicit deprecation acknowledgement; this fixture is not an unchanged copy of
ts-node's complete configuration. `impliedNodeFormat` is absent.

`mixed` uses NodeNext with both `.cts` and `.mts` files. Their per-file formats
differ, but their require identifiers refer to the same ambient Node variable.

Both fixtures use PostCode's pinned installed `@types/node` through explicit
`typeRoots`, so the tests exercise the real `var require: NodeJS.Require` shape
rather than only a simplified function declaration. Missing `./target` modules
are intentional: these tests characterize contextual evidence, not resolution.

The same test file also distinguishes a global implementation named require,
an ambient callable variable, a noncallable declaration, and no declaration.
`preserve` characterizes mixed syntax with a callable ambient variable, including
an explicit `.mts` counterexample. Temporary projects cover missing declarations,
conflicting annotations, JavaScript's compiler-generated require symbol, nested
calls, destructuring/catch/loop bindings, parse recovery, and `with` scope.
The completed lexical protocol and recommended preserve boundary are in the
[final contract proposal](../../records/validation/module-dependencies/2026-09-16-final-recognition-contract.md).
See [the characterization tests](../../test/dependency-contract.test.ts) and
[the review investigation](../../records/validation/module-dependencies/2026-09-16-commonjs-review-investigation.md).
