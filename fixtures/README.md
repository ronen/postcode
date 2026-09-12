# Analysis fixtures

These are deliberately small input projects, independent of PostCode's build.
They disable ambient dependency loading and default libraries to make the expected
population reviewable. Invalid source is intentional in `diagnostics`.

- `module-population`: exactly six modules: four external SourceFiles (`root.ts`,
  transitively discovered `transitive.ts`, `external.d.ts`, `allowed.js`) and two
  named ambient symbols. The two declarations of `ambient-one` form one module.
  `script.ts` is a configured root but is not a module. The inherited config and
  repeated import exercise TypeScript selection and resolution.
- `empty`: a configured global script establishes an empty module population.
- `diagnostics`: two external modules, one with a parse error and one with an
  unrelated semantic type error. Discovery encounters the parse diagnostic but
  does not request semantic checking to collect the type error.

Tests create temporary projects for changing-input and generated-output scenarios.
No third-party repository contents or real-project observations are retained here.

- `exports`: direct/default exports, wildcard and named forwarding, a chained
  barrel, type-only exports and imported aliases, overloads, declaration merging,
  a CommonJS export assignment with a namespace member, named ambient documentation,
  and distinct origin/alias JSDoc assertions. Tests assert concrete surfaces and
  compiler-associated documentation; no generated text snapshot substitutes for
  those semantic expectations.
