# M3 ownership-aware sharing review: round 3 findings

Record type: findings
Received: 2026-11-18
Reviewer: Claude (Opus 5.5), independent review session
Handoff: [M3 ownership-aware sharing review](2026-11-18-m3-ownership-sharing-handoff.md)
Round: 3
Reviewed target: `08f6cde38d514251a34962ccc095a569a1e22a5f`
Reviewed scope: `8719c25602dda05965567562d39b0d779b579f38..08f6cde38d514251a34962ccc095a569a1e22a5f` (product change limited to `src/lib/immutable.ts`, its tests and the architecture text); `22f6738` and `cca5585` read as the finding and the correction record
Prior findings: [round 2 Copilot](2026-11-18-m3-ownership-sharing-round-2-copilot-findings.md)
Prior reviewed target: `8719c25602dda05965567562d39b0d779b579f38`

## Returned findings

### Recommendation

**No new actionable findings.** Copilot comment `4618453312` describes a real defect, and `08f6cde` corrects it fully, with regression coverage. The correction changes nothing else in ownership, validation, exposure or disposal. My round 1 recommendation therefore still holds for the corrected target: the sharing change is ready to be included in the mechanical checkpoint. The human decides whether the gate is satisfied.

Note on round 1: my earlier review did not catch this defect. My round 1 record says the native fallback preserves aliasing, and that was true for acyclic graphs. However, neither my probes nor the existing tests covered a cyclic graph on the fallback path or a cyclic capture after disposal. Both of those reached the recursive `freezeOwned` and overflowed the stack.

### Method and verification

I read the preserved Copilot review, the correction diff and the checkpoint's correction section. Between `f4e8a38`/`8719c25` and `08f6cde`, the only `src/`, `test/` or `scripts/` changes are in `src/lib/immutable.ts` and `test/immutable-capture.test.ts`, and HEAD (`cca5585`) is identical to `08f6cde` in those directories.

Verification ran on the user's machine in a Linux VM (Node 22.23.5) against the installed dependencies, using a `git archive` scratch copy. The worktree was not modified.

- **Checks.** `tsc --noEmit` and `tsc` passed, and `git diff --check f4e8a38 08f6cde` passed. The compiled-source digest is `243550ab60452c19cd1f3e0c469ea8d093c326f282867fefd982ca6026fe3991`, which matches the correction record.
- **The defect at `f4e8a38`** (product code identical to Copilot's `8719c25`):
  - Capturing a self-referential plain object succeeds while the owner is live, but throws `RangeError: Maximum call stack size exceeded` after `dispose()`.
  - A cyclic graph forced onto the native fallback by a getter overflows the same way, even with a live owner. A cyclic `Map` graph happened to survive, because `Object.values` does not traverse Map entries.
- **The correction at `08f6cde`:** the same probes succeed.
  - The post-disposal copy keeps its self-reference and alias, is deeply frozen, and is a new root (no ownership reuse).
  - The cyclic getter fallback keeps its self-reference and freezes its child.
- **Full offline suite at `08f6cde`**, run from a self-contained git copy in twelve file batches with concurrency 2: **780 tests: 777 passed, 1 skipped, 2 failed.** The skip (case-insensitive filesystem) and the failures (the two native credential kernel-lock tests, which need the macOS-built `fs-ext` binary) are the same environmental cases as in my earlier rounds. This is consistent with the implementing agent's 780/780 on macOS Node 22.13.1.

No live inference was used. I did not rerun the representative memory measurement or the extended GC control. A correctness-only change to the fallback freezer does not affect the shared plain path that those measurements exercised, which uses its own copy-and-freeze, not `freezeOwned`.

### Assessment of the correction

- **Cycle safety.** `freezeOwned` marks a node as visited before descending and freezes it after its descendants, so cycles and aliases terminate. The visited set is local to each call and is discarded when it returns. It is not stored on the boundary, so it cannot act as, or restore, an ownership proof. Repeated late capture still returns fresh copies, as the test asserts.
- **Behavior is otherwise unchanged.** An already-frozen node is still traversed rather than treated as proof that its descendants are immutable, as before. The new shallow-frozen-parent test pins this down. Freeze order (children before parent) does not affect the result. Typed-array and Map/Set behavior is unchanged from the pre-existing state described in my round 1 O2.
- **Scope.** `freezeOwned` is shared by post-disposal capture, native fallback and the application's other `freezeOwned(structuredClone(…))` call sites. Every one of them gets the same termination guarantee and none loses an existing one. Canonical identity, store and ledger validation, exposure recording and disposal wiring are untouched.
- **Tests.** The three added assertions cover exactly the reported path, plus the two neighbouring paths that shared the defect:
  - post-disposal cyclic capture, including the no-reuse check;
  - traversal through a shallow-frozen cyclic parent;
  - a cyclic getter fallback.

### Non-defect observations

- **Recursion depth.** This is not a cycle issue, it is unchanged by the correction, and it was not part of the finding. For a linear chain of nested plain objects, native `structuredClone` already throws `RangeError` at 2,000 levels in this runtime. `freezeOwned` and the live plain capture handle 2,000 levels but overflow by 5,000, at both `f4e8a38` and `08f6cde`. Retained records are far shallower, so I see no practical exposure. I note it only because the fallback path inherits `structuredClone`'s own limit.
- The per-call `Set` adds a small allocation to each `freezeOwned` call. These calls are on fallback and small-report paths, not the shared bulk path measured in the checkpoint.

### Unverified areas and residual limits

- I did not run the extended forced-GC control (disposed `WeakSet` and per-call `Set` collected), the 741-module measurement, or Node 26.11.0.
- The limits recorded in my round 1 for this assignment otherwise stand.
