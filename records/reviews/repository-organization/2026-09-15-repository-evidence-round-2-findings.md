Record type: findings
Received: 2026-09-15
Reviewer: Independent review (Claude Sonnet 5, interactive session)
Handoff: [2026-09-15 repository-evidence handoff](2026-09-15-repository-evidence-handoff.md)
Round: 2
Reviewed target: `ae09e427acae3ce3e112081ed270f0fbe5f965d8`
Prior findings: [Round 1](2026-09-15-repository-evidence-round-1-findings.md)
Prior reviewed target: `b48b47baff36f3f38f855a5391966fb484247bd7`

## Returned findings

### Scope and method

This round reviews the correction commit `ae09e427acae3ce3e112081ed270f0fbe5f965d8`
identified by the [disposition](2026-09-15-repository-evidence-disposition.md) as
the exact target addressing round 1. Confirmed via `git diff` that, relative to
the round-1 target, this commit touches only `src/lib/repository/layout.ts` and
`test/repository.test.ts` — no other implementation, governing material, or task
record changed in the correction itself. Read the full diff, re-read the updated
`layout.ts` in full, and re-traced both new fixtures by hand against the
implementation before running anything.

### Verification performed

- `npm run check` on a detached checkout of the correction target: passed, no
  diagnostics.
- `npm test` on the same checkout: 100/100 passed, 0 failed, 0 skipped —
  confirming (not just trusting the disposition's report) that the new
  case-spelling fixture actually exercised the `target-not-established` branch
  on this machine rather than silently skipping.
- `node --test _build/test/repository.test.js`: 23/23 passed (up from 20 in
  round 1, consistent with the three new/extended fixtures).
- Re-ran the read-only PostCode self-capture smoke check at this target: 129
  artifacts, 24 regions, 23 containment edges, 9 direct README associations,
  ~293ms. The small increase from round 1's 127/23/22/9 is fully explained by
  the correction itself adding lines to the captured `test/repository.test.ts`
  file; it is not evidence of a behavior change.
- `git diff --check` between the round-1 and round-2 targets: clean.
- Hand-traced finding 1's regression test (`an existing link target with
  uncaptured case spelling remains unestablished rather than broken`) against
  `resolveLink`: confirmed it genuinely exercises the code path this reviewer
  manually reproduced last round, that it honestly detects filesystem support
  via `existsSync` and calls `context.skip(...)` with an early `return` rather
  than asserting something weaker, and that the layout assertions (single
  region `Target`, no additional containment edge, `outcome:
  'target-not-established'`) are consistent with `deriveLayout` treating any
  non-`resolved` link status as a pass-through with no containment
  contribution.
- Hand-traced finding 2's fix: confirmed `capture.ts` is byte-for-byte
  unchanged by this correction (`git diff` on that file is empty), so the
  removed `boundaryPaths` re-check in `layout.ts` could only have been
  reachable if `resolveLink` could return `status: 'resolved'` for a target at
  or beneath a boundary artifact — which this reviewer already traced as
  impossible in round 1 and re-confirmed by re-reading `resolveLink`
  unchanged. The extended `link resolution uses captured evidence without
  traversing opaque or ignored targets` fixture now asserts
  `layout.containment` is empty and both boundary-crossing links surface
  `opaque-boundary` through `deriveLayout`, which is the right regression
  guard for "capture, not layout, owns this classification."
- Hand-traced the new three-node cycle fixture (`a/to-b` → `b/to-c` → `c/to-a`)
  against `deriveLayout`'s `reaches` BFS and the sorted processing order:
  confirms `a/to-b` and `b/to-c` are accepted as `additional-parent` in that
  order (each check runs before the cycle exists) and `c/to-a` is correctly
  refused as `cyclic-containment` because `reaches('a', 'c')` becomes true only
  once the first two symlink edges have already been added — validating that
  cycle refusal generalizes beyond the two-node case checked in round 1, and
  that its result does not depend on input array order (the fixture also
  reverses the artifact array and asserts identical output).
- Hand-traced the new invoked-worktree-alias fixture (`captureRepository`
  invoked through a symlinked `invoked-repo` alias to `root`, with an absolute
  link target spelled through that alias) against the `rootPaths`/
  `absoluteTarget` mechanism this reviewer flagged in round 1 as
  under-exercised: confirmed `discovery` resolves the real worktree root while
  the invoked (lexical, unresolved) alias is separately retained as a second
  accepted absolute-target prefix, so the link correctly resolves to
  `additional-parent` with `targetRegion: 'target'` rather than being refused
  as `outside-repository`. This is a real, previously-unverified branch and the
  fixture exercises it correctly.

### Actionable findings

None. Both round-1 findings are resolved:

1. `target-not-established` now has dedicated, honestly-gated coverage
   (finding 1, round 1) — **resolved**.
2. The unreachable `boundaryPaths` re-check in `layout.ts` has been removed and
   replaced with a comment naming capture's ownership of the classification,
   with a regression fixture guarding the invariant (finding 2, round 1) —
   **resolved**.

### Non-defect observations

- The disposition explicitly leaves the round-1 observation about
  `ENAMETOOLONG`/`ESTALE` classification unaddressed, disclosing that choice
  rather than silently dropping it. I have no further comment on that
  trade-off; it remains a reasonable, disclosed residual limit rather than a
  finding.
- The two additional fixtures (three-node cycle, invoked-worktree-alias) go
  beyond what round 1 asked for — round 1 raised them as *observations*, not
  actionable findings — and both genuinely exercise previously-untested
  branches rather than restating existing coverage. This is a responsive,
  proportionate reaction to reviewer observations, not scope creep.
- No new code paths were introduced by this correction (it is a pure
  deletion-plus-comment in `layout.ts` and additive-only in the test file), so
  the risk surface for a fresh defect from this round's change is small; I
  focused verification on confirming the deletion is truly safe and the new
  fixtures truly test what they claim, rather than re-auditing the whole
  provider from scratch.

### Residual limits / unverified areas

Unchanged from round 1: real permission-denied/`ENAMETOOLONG`/disk-full/
concurrent-mutation scenarios, a genuinely case-sensitive filesystem, a real
Git submodule, and the clean-agent instrument validation remain unexercised by
this review, consistent with the handoff's disclosed scope and the plan's
later-stage validation requirements.

### Recommendation

Both round-1 actionable findings are resolved with correct, verified fixes and
new tests that were hand-traced (not just executed) to confirm they exercise
the claimed branches. I found no regressions and no new actionable findings.
**This checkpoint is ready for integration** with the next stage of work
(snapshot identity, group records, and the remaining organization pipeline).
This recommendation is input to the task, not an acceptance decision; the
human retains the review-gate conclusion.
