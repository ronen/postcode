# Library-reuse audit of existing generic functionality

Status: read-only audit for the backlog item
[Audit existing generic functionality for library reuse](../../../../../docs/backlog.md#audit-existing-generic-functionality-for-library-reuse).
It changes no code, adds no dependencies, and changes no planning, decision, or
governing document. Adopting any recommendation requires separate human direction.

Audit date: 2026-09-27
Revision audited: `3415ece` (clean `main`)
Governing guidance: [`dev/engineering-guidelines.md`](../../../../../dev/engineering-guidelines.md),
"Dependencies and boundaries", final bullet (check for established libraries before
implementing substantial generic functionality).

## Summary

PostCode has about 4,900 lines of source under `src/`. Its only runtime dependency
is `typescript`. Most of the code encodes PostCode concepts: records, claims,
qualifications, evaluations, projections, organization and dependency semantics,
and views. Under the backlog item's scope rule, that code is presumptively
bespoke. The generic parts are few and mostly small. The audit found:

| # | Functionality | Current code | Candidate | Recommendation |
|---|---|---|---|---|
| 1 | Terminal display width for wrapping, alignment and truncation | `presentation.ts` `wrapText`/`fitLines`/`excerpt`; `organization/presentation.ts` column padding | `string-width` (plus built-in `Intl.Segmenter`) | **Strong candidate** (for correctness, not size) |
| 2 | CLI option scanning | `commands.ts` `parseCommand` loop | built-in `node:util` `parseArgs` | Marginal |
| 3 | Strongly connected components / condensation | `dependencies/graph.ts` | `@dagrejs/graphlib`, `graphology` + `graphology-components` | Marginal now; revisit with future graph work |
| 4 | Canonical JSON serialization | `identity.ts` `canonical` | `canonicalize` (RFC 8785) | Keep |
| 5 | Git worktree capture and ignore evaluation | `repository/capture.ts` | `ignore`, `isomorphic-git`, `simple-git` | Keep |
| 6 | Shell-like line tokenizer | `commands.ts` `commandWords` | `shell-quote`, `shlex`, `string-argv` | Keep |
| 7 | Worker-thread request/interrupt channel | `interactive-session.ts`, `session-worker.ts` | `comlink` | Keep |
| 8 | Record-store referential validation | `memory-store.ts` | schema validators (`zod`, `ajv`, …) | Keep (domain-specific) |
| 9 | Terminal-control neutralization | `terminal-text.ts` | `strip-ansi` | Keep (trivial; library has different semantics) |
| 10 | Input change detection | `typescript/inputs.ts` | `chokidar`, TypeScript watch API | Keep |
| 11 | Top-level CLI framework | `cli.ts`, `commands.ts`, `shell.ts` | `commander`, `yargs` | Keep |

Only item 1 is a clear recommendation. The rest are marginal or should stay
bespoke, often because PostCode already uses the right built-in (`node:readline`,
`node:test`, `node:crypto`, `structuredClone`, `worker_threads`). Some internal
duplications turned up along the way; they are listed under
[Incidental observations](#incidental-observations) and are not library questions.

## Method and scope

- Read every file under `src/`. Separated generic mechanisms from code that
  expresses PostCode concepts. Checked the tests that exercise each generic
  mechanism.
- Excluded trivial utilities (`compare`, deep `freeze`, `within`, pluralization,
  `randomUUID`/SHA-256 through `node:crypto`), where a dependency would cost more
  than it saves.
- Excluded PostCode-specific semantics as presumptively bespoke: record kinds and
  their invariants, identity methods and handles, organization and dependency
  derivation, qualification and projection logic, and view assembly. Item 8 is
  listed only because its *mechanism* (reference validation) looks generic.
- Library facts come from the npm registry and the npm downloads API on
  2026-09-27: latest version, license, last modification, dependencies, and weekly
  downloads. Behavior claims about libraries come from their documentation and
  general knowledge. I checked two things directly: I ran `parseArgs` on Node
  22.13.1, and I read the published SCC sources of `@dagrejs/graphlib` and
  `graphology-components`. Claims marked *verify* should be checked before
  adoption.

## Candidate assessments

### 1. Terminal display width — strong candidate

**Current code.**
- `src/lib/presentation.ts:78` `excerpt` truncates by code point (`[...text]`).
- `src/lib/presentation.ts:209` `fitLines` binary-searches a code-point prefix that fits a line budget.
- `src/lib/presentation.ts:222` `wrapText` wraps at 88 columns, counting code points as columns.
- `src/lib/organization/presentation.ts` pads the organization tree's name column with `.length` (UTF-16 units) and `padEnd`.

Tests: `test/cli.test.ts:624`, `:686`, `:710` cover wrapping bounds, omission
counts, and injection safety.

**Problem the bespoke code does not solve.** Neither a code point nor a UTF-16
unit is a terminal column:
- East Asian wide characters and most emoji take two columns, so CJK
  documentation or module names overflow the 88-column bound.
- Combining marks and zero-width joiners take zero columns, so wrapping breaks too
  early and the organization column misaligns.
- Code-point truncation (`excerpt`, `fitLines`) can split a grapheme cluster, such
  as an emoji ZWJ sequence or a base letter plus combining mark. The visible
  excerpt then shows a fragment that is not in the source.

Getting column widths right needs Unicode East Asian Width and emoji data, which
change with each Unicode version. That is the kind of maintenance burden the
guideline targets.

**Candidates.**
- `string-width` 8.3.0: MIT, modified 2026-09-24, about 581M downloads/week.
  Depends on `strip-ansi` and `get-east-asian-width`, both from the same
  maintainer. Pure ESM, which matches PostCode's ESM build.
- `get-east-asian-width` 1.7.0: MIT, modified 2026-09-17, about 92M/week, no
  dependencies. It is a lower-level alternative if only per-code-point width is
  wanted. It does not handle grapheme clusters, so PostCode would still need its
  own cluster logic.
- `wrap-ansi` 10.0.2: MIT, about 496M/week. **Not recommended.** Its main value
  is preserving ANSI styling across line breaks. PostCode never emits styling:
  `terminalText` escapes controls before wrapping. Its trimming and hard-wrap
  options also differ from the current indent/continuation contract.
- Built-in `Intl.Segmenter` (available in Node ≥ 22) splits text into grapheme
  clusters with no dependency.

**What would change.** Keep the bespoke wrapping loop and its indent and
continuation contract. Measure width with `string-width`, and iterate and truncate
over `Intl.Segmenter` grapheme clusters instead of code points. Pad the
organization column by measured width. Bespoke code removed: essentially none; this
is a correctness change, not a size reduction. Bespoke tests removed: none; wide,
combining, and ZWJ cases should be added.

**Integration and migration cost.** Low: one small dependency tree (three
packages) and changes confined to presentation helpers. Rendered Unicode output
changes for non-ASCII text, so `methods.presentation` in `identity.ts` would need
a version bump. Omission counts in the qualified view are currently in characters
(`omittedTextCharacters`). Whether those should count code points (as now) or
grapheme clusters is a presentation-contract choice to settle when the change is
made. It is not settled by adopting the library.

**Intrusion on core concepts.** None. Width is purely a terminal-presentation
concern and stays inside the Unicode renderers. JSON views and stored assertions
do not change.

### 2. CLI option scanning — marginal

**Current code.** The option loop in `src/lib/commands.ts:53` (about 14 lines)
handles `--`, `--help`/`-h`, `--json`, `--source-detail`, and `--project <path>`,
and rejects unknown options. The positional and lens grammar after the loop is
PostCode-specific. Tests: `test/shell.test.ts`, `test/session.test.ts`, and
`test/cli.test.ts`, all through public behavior.

**Candidate.** Built-in `node:util` `parseArgs`: stable on the required Node
22.13, no dependency. It supports `strict`, `allowPositionals`, the `--`
terminator, short aliases, and `tokens`. I checked locally that
`--project --json` in strict mode is rejected with
`ERR_PARSE_ARGS_INVALID_OPTION_VALUE`, which matches the current refusal.

**Fitness and behavior differences.**
- `parseArgs` also accepts `--project=path`. That is a harmless but real CLI
  extension.
- It rejects a `--project` value that starts with a single `-` unless written
  `--project=-x`. The current code rejects only values starting with `--`.
- Its error messages would need translating into PostCode's `Usage error:` form
  and passing through `inlineText`.
- The interactive refusal of `--project` stays bespoke.

**Savings.** About 10 lines. No tests removed, because the tests exercise public
CLI behavior, which should remain covered.

**Recommendation.** Adopt it only when the option surface grows, or if standard
`--opt=value` syntax is wanted. There is no dependency cost, but also little
burden to remove.

### 3. Strongly connected components — marginal now

**Current code.** `src/lib/dependencies/graph.ts` (61 lines) runs an iterative
Kosaraju pass (about 27 lines), then builds the condensation: deterministic
component ordering, internal-edge lists, child component indices, and roots only
when evaluation is complete. Tests: `test/dependency-projections.test.ts:58–65`
and `test/dependency-presentation.test.ts:119`.

**Candidates.**
- `@dagrejs/graphlib` 4.0.5: MIT, modified 2026-08-03, about 5.4M/week, no
  dependencies. It provides `alg.tarjan` and `alg.findCycles`.
- `graphology` 0.26.0 (MIT, about 1.7M/week) with `graphology-components` 1.5.4
  (MIT, about 78K/week). `graphology-components` was last modified 2022-06, so its
  maintenance posture is quieter.

**Fitness.**
- Either library would replace only the Kosaraju core.
- Deterministic ordering (sorted members, components sorted by first member) and
  all condensation bookkeeping would stay bespoke, because PostCode needs output
  that does not depend on library iteration order.
- The current implementation is deliberately iterative. **Both libraries'
  SCC routines are recursive.** I checked the published sources:
  - `@dagrejs/graphlib` 4.0.5: `alg.tarjan` in `dist/graphlib.esm.js` has a
    nested visit function that calls itself for each unvisited successor.
  - `graphology-components` 1.5.4: `stronglyConnectedComponents` in `index.js`
    uses a recursive inner `DFS`. Only its undirected `connectedComponents` uses
    the iterative `DFSStack`.

  A long import chain could therefore overflow the stack. Adopting either library
  would reintroduce a failure mode the current code avoids.
- Building a library graph object means translating `RecordId`s in and out. That
  is cheap and keeps library types out of records, but it adds boilerplate close
  to the size of the code removed.

**Recommendation.** Keep for now. Net savings are about 20 lines, in exchange for
one dependency and a recursion-depth regression, which is not worth it. Revisit when later planned work needs more
general graph algorithms. For example, `docs/plans/module-investigation.md`
anticipates transitive reconsideration over citation graphs "with combinatorially
many paths". At that point a single shared graph library (`@dagrejs/graphlib` has
the better dependency and maintenance profile) could serve both uses, behind a
PostCode-owned adapter so that library graph types do not become domain types.

### 4. Canonical JSON serialization — keep

**Current code.** `canonical` in `src/lib/identity.ts:23` is 10 lines. It
recursively sorts object keys by UTF-16 code units, delegates scalars to
`JSON.stringify`, and throws on non-serializable values. It underlies `digest`,
record IDs, memo keys, and cache keys.

**Candidates.**
- `canonicalize` 5.1.0: Apache-2.0, about 4.1M/week, an RFC 8785 (JCS)
  implementation.
- `safe-stable-stringify` (MIT, about 69M/week) and `fast-json-stable-stringify`
  (MIT, about 185M/week; last modified 2023).

**Fitness.** For plain JSON data, the current code already matches JCS ordering
and number formatting. Adopting a library would remove about 10 lines, but it
could weaken the explicit "Non-serializable identity input" guard. Some stable
stringifiers silently drop `undefined` members or honor `toJSON` (*verify* per
library). Any byte difference would change every record ID and force identity
method bumps across the board.

**Recommendation.** Keep. Optionally, a comment could note that the output is
intended to coincide with RFC 8785 for plain JSON values.

### 5. Git worktree capture and ignore evaluation — keep

**Current code.** `src/lib/repository/capture.ts` (321 lines) is the largest
generic-looking module. It shells out to `git` for:
- discovery,
- `ls-files --stage`,
- `check-ignore --no-index --stdin`,
- `core.excludesFile`, `core.ignoreCase`, `core.precomposeUnicode`, and
  `core.sparseCheckout`.

It also:
- scrubs Git environment redirection,
- requires UTF-8 output,
- digests the exclusion-policy files and re-checks them afterwards,
- classifies submodules and nested repositories,
- resolves symlinks only through captured paths.

Tests: `test/repository.test.ts` plus the organization tests.

**Candidates.**
- `ignore` 7.0.10: MIT, about 369M/week. A JavaScript reimplementation of
  gitignore matching.
- `isomorphic-git` 1.42.2: MIT, about 2M/week, with 13 dependencies. A
  JavaScript reimplementation of Git.
- `simple-git` 4.0.2: MIT, about 14M/week. A promise wrapper around the same
  `git` CLI.

**Fitness.** `docs/decisions/repository-organization-decisions.md` defines
visibility by Git's actual behavior: repository `.gitignore`, `info/exclude`, the
active user-global excludes, tracked-despite-ignored artifacts, and Git's
case and precomposition policy. Asking the installed `git` is the most faithful
way to get that.
- `ignore` and `isomorphic-git` reimplement the rules. Neither reads PostCode's
  configured global excludes the way Git does (*verify* for `isomorphic-git`), and
  they can diverge on edge cases, which would silently change the captured
  population.
- `simple-git` removes only the roughly 15-line `git` helper. It would bring
  asynchronous APIs into a synchronous capture, add `debug` and other
  dependencies, and still need the environment scrubbing and UTF-8 checks.
- Most of the module is PostCode's evidence policy (link-resolution outcomes,
  exclusion digests, boundary classification). No library provides that.

**Recommendation.** Keep. The existing approach already reuses the most
authoritative external implementation: Git itself.

### 6. Shell-like line tokenizer — keep

**Current code.** `commandWords` in `src/lib/commands.ts:90` (15 lines) handles
quotes and backslash escapes, and is documented as "deliberately a tokenizer,
without interpolation, pipes, redirection or execution". Tests:
`test/shell.test.ts:14` and others.

**Candidates.**
- `shell-quote` (MIT, about 93M/week) parses `$VAR` expansion, operators (`|`,
  `>`, `;`) and comments into non-string tokens. PostCode would have to
  neutralize them, which is the opposite of the documented contract.
- `string-argv` (last modified 2023) and `shlex` (about 0.8M/week) are closer
  fits, but they replace only 15 well-tested lines, and their escape rules differ
  subtly (*verify*).

**Recommendation.** Keep. The code is trivial and its narrow semantics are
intentional.

### 7. Worker-thread request/interrupt channel — keep

**Current code.** `src/lib/interactive-session.ts` (66 lines) and
`src/lib/session-worker.ts` (26 lines) allow one in-flight request. Interrupting
terminates the worker, discarding all compiler state, and errors are mapped back
to `SessionInvalidated`, `AnalysisFailure`, and `CommandInterrupted`.

**Candidate.** `comlink` 4.4.2 (Apache-2.0, about 3.1M/week, last modified
2024-11). It proxies calls, but it has no notion of terminate-on-interrupt or
typed error-class mapping. Supporting those would take about as much code as it
removes, plus a Node adapter. Pool libraries (`piscina`, `tinypool`) model
reusable pools, which contradicts "termination discards all worker state".

**Recommendation.** Keep.

### 8. Record-store referential validation — keep

**Current code.** `src/lib/memory-store.ts` (350 lines) validates atomic batches:
immutable-collision checks, same-session references, per-kind reference typing,
and many domain invariants (dependency partitions, placement outcomes,
organization evidence completeness). Tests: `test/records.test.ts`,
`test/dependency-projections.test.ts:275`, and others.

**Fitness.** Schema libraries (`zod`, `valibot`, `ajv`) validate one value's
shape. Nearly all of this code checks cross-record references and domain
invariants, which would become custom refinements anyway. It would also bring a
library's schema vocabulary next to the records defined in `records.ts`.

**Recommendation.** Keep. This is PostCode-specific semantics under the audit's
scope rule.

### 9. Terminal-control neutralization — keep

`src/lib/terminal-text.ts` (7 lines) renders C0/C1 controls, line and paragraph
separators, and bidi controls visibly as `\uXXXX`, as the output-safety guideline
requires. `strip-ansi` *removes* ANSI sequences only. That would hide controls
rather than render them visibly, and it would leave bidi controls untouched.
**Keep.**

### 10. Input change detection — keep

`src/lib/typescript/inputs.ts` (81 lines) memoizes every `ts.System` query,
including negative lookups, and re-probes them all on `check`. It is synchronous
and deterministic, and it records what was consulted as identity input.
- File watchers such as `chokidar` are event-driven, can miss or coalesce events,
  and do not naturally cover negative lookups.
- TypeScript's own watch program watches failed lookups, but it is asynchronous
  and polling- or event-based. It does not provide the digestable observation
  record.

**Keep.**

### 11. Top-level CLI framework — keep

`commander` 15 (MIT, about 586M/week) and `yargs` generate help text, own process
exit, and impose a subcommand model. PostCode's help text carries conceptual
qualifications, and its exit codes and observation publishing are domain
behavior. The interactive shell already uses the built-in `node:readline`.
**Keep.** Item 2 covers the useful part.

## Incidental observations

These are not library questions. They turned up while reading and are reported
for separate consideration only.

- **Duplicated path helpers.** `within` and the missing-leaf `real` resolution
  exist in both `repository/capture.ts` and `typescript/inputs.ts`. The two
  `real` variants use different filesystem probes (`lstatSync`/`readlinkSync`
  versus `ts.sys`), so any consolidation must preserve that distinction.
- **Duplicated operational error-code list.** `['EACCES', 'EPERM', 'ENOENT', …]`
  appears in both `session.ts:25` and `repository/capture.ts:35`.
- **Reachability cost.** `reaches` in `repository/layout.ts:30` filters the whole
  containment list at every step, and runs once per resolved directory link. This
  is quadratic in the worst case. It is not a correctness problem, and the
  analysis-latency work did not flag it.

## Suggested follow-up (requires human direction)

1. If non-ASCII terminal fidelity matters now, open a task to adopt `string-width`
   with `Intl.Segmenter` in the Unicode renderers. Decide the omission-count unit
   (code points versus grapheme clusters), bump `methods.presentation`, and add
   wide, combining, and ZWJ fixtures.
2. Consider `node:util` `parseArgs` the next time the CLI option surface changes.
3. When the module-investigation work needs general graph algorithms, evaluate one
   shared graph library (starting with `@dagrejs/graphlib`) behind a
   PostCode-owned adapter. The iterative SCC in `graph.ts` should stay unless the
   library offers a non-recursive equivalent.
