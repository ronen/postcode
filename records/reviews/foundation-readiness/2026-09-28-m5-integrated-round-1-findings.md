# Foundation readiness M5 integrated review: round 1 findings

Record type: findings
Received: 2026-09-28
Reviewer: Claude Code (Claude Opus 5.5), independent agent session arranged by the human
Handoff: [2026-09-28-m5-integrated-handoff.md](2026-09-28-m5-integrated-handoff.md)
Round: 1
Reviewed target: `9f8c8bd85e94428b11abb5b415e98cebb1f50901` (scope `6af13629aa50d875b378bf8d0294a9fda5e356d3..9f8c8bd85e94428b11abb5b415e98cebb1f50901`)

## Returned findings

### Scope and method

I reviewed the exact target in a detached worktree created from `9f8c8bd` in a
scratch directory, installed from the lockfile with `npm ci`. The application
source at the target matches the M4 checkpoint `5e732df`. Between them, only
`scripts/measure-analysis.mjs` (+2/−1) and some records change. Later commits
(`a3109bd`…`0c93b81`) change no `src`, `test` or `scripts` files.

The accepted M2 and M3 rounds already covered packages 1–5 in depth, so I did not
review them again line by line. I focused on the package 6–8 source changes
(`11c17c7..9f8c8bd`) and how they meet the accepted ownership and acquisition
boundaries. I read every changed application file in that range:
`directed-graph.ts`, dependency and organization graph/evaluation/projection
callers, `repository/layout.ts`, `organization/placement.ts`,
`composition-view.ts`, the three presentation modules, `terminal-layout.ts`,
`terminal-text.ts`, `commands.ts` and the TypeScript diagnostics, expansions and
project changes. I compared each index or delegation with the code it replaced to
check whether semantics, order and supporting evidence stayed the same. I also
ran probes directly against the built modules.

### Verification performed

- `npm run check`: passed.
- `npm test`: **294/294** passed; 0 failures, cancellations, skips or todos
  (about 123 s, stable workspace, no concurrent edits).
- `node scripts/compare-session-requests.mjs _foundation-readiness/review-session-comparison.json`:
  exit 0, with **288/288** complete view/output comparisons passing (72 each for
  dependency-journey, dependency-contract, exports and generated-scale). The
  report was written inside the scratch worktree and is not committed.
- Graph adapter probes against the pinned `@statelyai/graph` 2.4.0:
  - `ancestors` includes its roots and treats an empty root set as empty.
  - `reaches(x, x)` is true, as the replaced `reaches` was. Direction is correct.
  - SCCs merge mutual edges and self-loops, and components update after an
    incremental `add`.
  - The empty-string repository-root ID survives the prefix encoding.
  - A 100,000-node chain gives full ancestry (about 0.4 s) and outgoing
    reachability without recursion overflow.
  - Duplicate node IDs collapse harmlessly.
- Equivalence reading of each replaced algorithm:
  - Kosaraju → SCC; population filtering, sorting and internal-edge retention are
    unchanged.
  - Fixed-point upward closure in organization evaluation and projection →
    incoming DFS from the same seeds.
  - Dependency-organization ancestry → incoming DFS. Claims come from every
    incoming edge of every reached group, the same set the old per-pop
    collection built, including parallel and non-tree edges.
  - Layout cycle, existing-parent and additional-parent acceptance → `reaches`
    and `hasEdge` on a graph kept in step with `containment.push`. `source` is
    always a region, so `add` cannot throw.
- Index/order reading:
  - Placement ancestor walks yield the longest match first, like the former
    length sort.
  - Documentation, source-detail and link buckets re-sort by original ordinal.
  - Composition evaluations are deduplicated per subject, matching the former
    `includes`.
  - `diagnosticLookup` keeps compiler order and handles file-less diagnostics
    only on request.
  - The rewritten 4-line/300-code-point excerpt loop keeps the same text and
    omission count as the former array slice.
  - Map-based `find` replacements take the last duplicate rather than the first.
    Each case I checked is keyed by a subject or path that is unique by
    construction.
- Weak-key placement index: the capture and layout are stored in the
  `repository-evidence` record, which `memory-store.ts` deep-freezes with
  `freezeOwned`. Both production callers pass the stored objects, so a stale
  index is not reachable in current code.
- Terminal layout probes (`layoutText`, `fitText`, `boundedText`):
  - CJK width wrapping; a tab shown as `\u0009`; CR in CRLF escaped with LF kept
    as structure.
  - An indivisible escape wider than the budget is omitted and counted as
    1 original code point.
  - A ZWJ family emoji stays whole.
  - A combining mark after an escaped control stays in the escape token.
  - Runs of spaces, leading spaces and narrow budgets all terminate.
  - `fitText` stops at a token boundary and trims.
  - I read the wrap loop to confirm that progress is guaranteed.
- Option grammar probes of `parseCommand` (one-shot and interactive):
  - Help with an unknown option reports the error.
  - Duplicate `--project` is rejected; `--project=` (even with `--help`) is
    rejected as empty.
  - `--project -x` is refused as ambiguous; `--project=-x` is accepted.
  - `inspect -x` is refused; `inspect -- -x` is accepted literally; `inspect
    @foo` keeps a literal selector.
  - `-hh` and `--json --json` are idempotent; `--help=1` and `--json=false` are
    refused.
  - In a shell, `--project=x --help` is refused by the project restriction
    rather than help. `help` and `--help` work; `exit --json` is refused as
    before.
- End-to-end CLI: `node _build/src/cli.js --project -x` exits 2 with a
  controlled usage error (see F1).

### Actionable findings

**F1 — low: multi-line scanner diagnostics are flattened into literal `\u000a`
text.** `commands.ts` passes `failure.message` from `util.parseArgs` through
`inlineText`. Node's message for an ambiguous option value spans three lines, so
the user sees:

```text
Usage error: Option '--project' argument is ambiguous.\u000aDid you forget to specify the option argument for '--project'?\u000aTo specify an option argument starting with a dash use '--project=-XYZ'.
```

Escaping keeps the output safe and the exit status controlled, so this is not a
safety or truthfulness defect. The problem is usability. This is exactly the
error that points users to the grammar's required `--project=-value` form, and
the hint is hard to read. The test at `test/commands.test.ts:75` only matches
`Unknown option`, which is a single line, so no test covers the multi-line case.
Suggested correction: split Node's message on LF and escape each line, or
replace LF with a space before escaping. Add a test for the ambiguous-value
message in both one-shot and shell paths. This does not change the approved
grammar.

No other actionable defects were found in the reviewed scope.

### Non-defect observations

- **O-a: literal `\uXXXX` text in source prose is treated as an indivisible
  token.** `terminal-layout.ts` merges any six-character `\u` + 4-hex sequence
  into one token so that escapes made by `inlineText` cannot be split.
  `boundedText` and `layoutText` apply this to raw documentation and source text
  too. So prose that literally contains `é` is never truncated inside that
  spelling. For example, `boundedText('ab\\u00e9cd', 3, true)` keeps `ab` and
  reports 8 omitted code points. Omission counts stay exact, so this only makes
  truncation coarser. It may be worth documenting or restricting to text known to
  have been escaped.
- **O-b: a combining mark after an escaped control renders on the escape's last
  digit** (for example `\u0007` followed by U+0301). It stays indivisible and is
  not a control, so there is no spoofing concern, but the escape reads slightly
  garbled.
- **O-c: graph adapter strictness.** `directedGraph` throws
  `Graph edge outside selected population` where the replaced loops silently
  ignored such edges. Every current caller builds edges from its own population,
  so this is a stricter invariant rather than a behavior change. Any future
  caller that passes an unfiltered population would fail loudly rather than
  wrongly.
- **O-d: tabs are now visible escapes everywhere `terminalText` applies**, which
  includes tab-indented source excerpts in source detail. This is the documented
  presentation@26 change. It does make tab-indented code noisier to read.
- **O-e: the approved grammar rejects single-dash selectors without `--`.**
  `inspect -x` is now a usage error; it used to be a positional selector. The
  plan's grammar table requires this. I note it only as a user-visible change
  already covered by presentation/grammar documentation.
- **Deferred O1/O2 (M3)** are unchanged and outside this round's new findings:
  per-directory case rules on one device, and lexical paths crossing filesystems
  with different case rules. I did not re-examine them.

### Unverified areas and residual uncertainty

- I did not rebuild the M3 baseline or rerun the 72-case graph/index and final
  CLI comparisons (`scripts/compare-analysis.mjs`). I did not rerun the
  measurement driver either. The committed reports and build hashes were not
  independently regenerated.
- Packages 1–5 and C01–C14/C16/C20/C22 were not re-audited beyond confirming
  that M4 did not touch their ownership code paths. The full suite passing
  includes the prior review regressions.
- The integrated invariants named in the handoff were not re-traced
  independently for this round beyond the M4 touch points above. They are:
  failed publication installs no retained support; new acquisition does not
  overwrite contexts; replay does not acquire; worker disposal keeps children;
  output obligations are kept. The previous rounds' analysis and passing
  regressions are my basis.
- I did not review the dependency and license audit beyond reading the pinned
  versions in `package.json`.
- Native scope is the same macOS/APFS/Node environment as the implementing
  agent's. I claim no other OS or filesystem.
- I only spot-checked `fitText`'s binary-search monotonicity by reasoning about
  greedy wrapping, not exhaustively.

### Recommendation

The integrated result looks sound for the reviewed M4 scope. The graph
delegation and indexes preserve semantics, order and supporting evidence as far
as I could trace, and the full suite passes at the exact target. F1 is a small,
self-contained usability correction. It can be verified by the implementing
agent without another full review round, unless the human prefers one. The
deferred O1/O2 defects remain deferred. The gate decision rests with the human.
