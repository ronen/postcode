# Dependency compiler contract fixture

This small configured project characterizes TypeScript 6.0.3 public compiler
behavior before dependency-provider integration. Its code is parsed, never run.
The package boundary fixes CommonJS defaults independently of PostCode's own
package. `.mts` supplies an explicit ESM counterexample.

- `requests.cts` contains the supported mechanisms, explicit type flags, literal
  and nonliteral requests, unreachable syntax, shadowed require calls, and
  excluded call shapes. It deliberately contains semantic errors; tests do not
  run a whole-project semantic check.
- `target.ts` and `forward.ts` distinguish direct re-export targets from final
  export origins.
- `require-only.ts` is deliberately absent from configured roots and ordinary
  imports. Explicit resolution can find it without adding it to the Program.
- `ambient.d.ts` supplies a merged named ambient owner and an ambient target.
- `node-types/globals.d.ts` is a minimal fixture declaration, not vendored Node
  typings or evidence that a runtime loader exists.
- `script.js` and `esm.mts` expose language/format differences in require evidence.

See [the characterization record](../../records/validation/module-dependencies/2026-09-16-typescript-contract.md)
and [tests](../../test/dependency-contract.test.ts). None of this fixture implies
that the dependency CLI or provider is already implemented.
