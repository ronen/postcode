Record type: findings
Received: 2026-09-15
Reviewer: Independent review (Claude Sonnet 5, interactive session)
Handoff: [2026-09-15 repository-evidence handoff](2026-09-15-repository-evidence-handoff.md)
Round: 1
Reviewed target: `b48b47baff36f3f38f855a5391966fb484247bd7`

## Returned findings

### Scope and method

Reviewed the exact target `b48b47baff36f3f38f855a5391966fb484247bd7` against baseline
`0af5595c5d130020214245cd3b8d6205e7d59449` (diff range as stated in the handoff), on a
detached checkout of the target commit. Read the governing plan, decisions
(module-organization, initial module inventory, identity/evidence/observation
constraints), and the handoff itself. Read `src/lib/repository/capture.ts`,
`evidence.ts`, `layout.ts`, `test/repository.test.ts`, `test/repository-probe.ts`,
and the `STATUS.md`/`docs/architecture/README.md` prose additions in full, then
traced the success/failure paths of `captureRepository` and `deriveLayout` by hand
against each test fixture and against several scenarios not covered by the test
suite.

### Verification performed

- `npm run check` at the target commit: passed, no diagnostics.
- `npm test` at the target commit: 97/97 passed, including all 20 repository tests.
- `node --test _build/test/repository.test.js` at the target commit: 20/20 passed.
- Independent read-only smoke check of the provider against this PostCode
  worktree itself (excluding `_build` and `_observations`): 127 artifacts,
  23 regions, 22 containment edges, 9 direct README associations, ~219ms —
  matching the handoff's reported smoke-check numbers within measurement noise.
- Manual reproduction, outside the test suite, of the `target-not-established`
  link-resolution outcome: on this machine's case-insensitive APFS volume, a
  directory `Target/` with a symlink whose target spells it `target` (lowercase)
  produces `link.status === 'target-not-established'` and `resolved: null`, as
  the evidence type and architecture note describe. This path has no automated
  test (see finding 1) but behaves correctly under manual reproduction.
- Hand-traced the worktree-visibility BFS (tracked overrides, nested ignore
  deactivation via `inactivePolicyDirectories`, the ignored-directory-with-tracked-
  descendant carve-out, and `.git`/opaque-boundary short-circuiting) against
  every fixture in `test/repository.test.ts` and against the code, confirming the
  traversal produces the asserted results for the stated reasons rather than by
  coincidence.
- Hand-traced `resolveLink` for every documented outcome (`resolved`, `broken`,
  `cyclic`, `outside-repository`, `excluded-output`, `outside-population`,
  `opaque-boundary`, `resolution-limit`, `target-not-established`), including the
  exact hop count at which the 40-redirect bound trips (confirmed off-by-one
  correctness: a chain needing 42 redirects fails on attempting the 41st, "at
  most 40" is honored exactly) and the two-node opposed-directory-link cycle
  resolution order (confirmed deterministic via the unconditional path-sort at
  the top of `deriveLayout`, independent of input array order).
- Compared `docs/architecture/README.md` and `STATUS.md` prose against the actual
  implementation; found no overstated claims. The prose is consistent with what
  the code does and does not yet do (no snapshot-identity integration, no CLI
  exposure, method versions not yet in `src/lib/identity.ts`).

### Actionable findings

1. **`target-not-established` link status has no automated test coverage.**
   `src/lib/repository/capture.ts:275` returns this status when a link's final
   segment is not resolvable through captured evidence (`byPath`/
   `visibleDirectories`) but an `lstat` on the literal joined path still succeeds
   — the case distinguishing "broken" from "existing target with an unsupported
   exact spelling" that the plan and decisions call out explicitly (module
   organization decisions, "Bound symlink semantics"; plan's link-resolution
   success criteria). It is declared in the `RepositoryArtifact['link']['status']`
   union and referenced in the provider's `limitations` text, but
   `test/repository.test.ts` never exercises it. I reproduced it manually (see
   Verification) and confirmed the implementation is correct, but this is exactly
   the kind of case-insensitive-filesystem / Unicode-spelling scenario the
   handoff itself calls a residual limit and flags for review attention (focus
   item 4). A regression here (e.g., from a future refactor of the segment-walk
   loop) would silently fall through to `broken`, changing established behavior
   without a failing test to catch it. Recommend a fixture before this evidence
   is depended on by group/containment records — a symlink into a directory
   whose provided target spelling doesn't match `readdirSync`'s captured spelling
   (case difference is sufficient and reachable on this contributor's own
   platform).

2. **The `boundaryPaths` opaque-boundary check in `deriveLayout` appears
   unreachable.** `src/lib/repository/layout.ts` re-derives `opaque-boundary` by
   comparing a resolved link's target path against known boundary artifact paths
   (lines defining `boundaryPaths` and the `target === boundary ||
   target.startsWith(...)` check). But `capture.ts`'s `resolveLink` already
   returns `opaque-boundary` directly, per path segment, the first time the walk
   encounters a `byPath` entry with `.boundary` set — and every directory
   component of a resolved target is necessarily visited as a `candidate` during
   that segment-by-segment walk (nothing can exist "underneath" a boundary
   artifact in captured evidence, since capture never descends into one). By
   hand-tracing every way a link can reach `status: 'resolved'`, I could not
   construct an input where `link.status` is `'resolved'` yet the resolved path
   is at or under a boundary path. If that reasoning is correct, the check in
   `layout.ts` is dead defensive code rather than a live correctness branch. This
   is not a functional defect — it doesn't misclassify anything I could
   construct — so I'm not asking for a fix before integration, but it's worth the
   author's own confirmation (or a comment noting the invariant it defends)
   before it either bit-rots or is mistaken for load-bearing when a future
   provider is layered on top.

### Non-defect observations

- The whitelist of "known" filesystem error codes that convert to
  `status: 'unavailable'` in `captureRepository` (`EACCES`, `EPERM`, `ENOENT`,
  `ENOTDIR`, `ELOOP`, `EIO`, `EMFILE`, `ENFILE`) omits a few plausible
  environmental codes of the same character, e.g. `ENAMETOOLONG` and `ESTALE`
  (stale NFS handle) — these would currently propagate as an "unexpected
  defect" per the documented capture/evaluation boundary rather than a graceful
  capture-unavailable result. Given the handoff already discloses that
  "[f]ilesystem permission failures... and every concurrent mutation topology are
  not exhaustively exercised," I'm recording this as an observation rather than
  a blocking finding — the boundary itself is a judgment call the author has
  already flagged as incomplete, not a silent gap.
- Multi-hop (three or more node) indirect directory-link cycles are not
  exercised by a dedicated fixture; only the two-node opposed-link case is
  tested. I traced the `reaches` BFS in `layout.ts` by hand and it appears
  correct for the general transitive case (it walks the full accumulated
  containment graph, not just direct edges), but this is inference from reading
  code, not from an executed assertion.
- I did not find any case where the traversal drops a visible artifact or leaks
  ignored content beyond what the existing 20 fixtures already assert; the
  ignored-directory-with-tracked-descendant carve-out (`inactivePolicyDirectories`)
  and the tracked-overrides-ignore-pattern logic both matched Git's actual
  behavior in every scenario I traced or constructed.
- The dual `rootPaths` (`root` vs. `invokedRoot`) mechanism for accepting
  absolute symlink targets reached only through a symlinked invocation path
  (rather than the resolved worktree root) has no dedicated test. I did not find
  a defect in it, but it is more subtle than the rest of the link-resolution
  code and is worth a fixture if the next round has room for it.
- Doc prose (`STATUS.md`, `docs/architecture/README.md`) accurately describes
  current scope and explicitly disclaims what remains undone; I found no
  overstatement of completeness.

### Residual limits / unverified areas

- Did not exercise real permission-denied, `ENAMETOOLONG`, disk-full, or
  concurrent-mutation scenarios; relied on code reading plus the handoff's own
  disclosure that these are not exhaustively tested.
- Did not test on a genuinely case-sensitive filesystem or against a real Git
  submodule (as opposed to the synthetic Gitlink fixture) — consistent with the
  handoff's own disclosed limits.
- Did not independently re-run the clean-agent/unfamiliar-repository instrument
  validation described in the plan; that validation is explicitly deferred past
  this checkpoint and out of this review's scope (repository-evidence capture
  and layout derivation only).
- This review did not assess anything beyond the stated target/baseline diff
  range; the handoff's own later commit and this findings record's preparation
  are correctly treated as out of scope per the handoff's instructions.

### Recommendation

The repository-evidence capture and layout-derivation boundary is well-reasoned,
matches the governing plan and decisions I could check it against, and is backed
by tests that assert behavior for the *reason* stated rather than incidentally.
Both actionable findings are test-coverage/defensive-code observations rather
than demonstrated incorrect behavior — I manually reproduced finding 1's code
path and it behaved correctly. I recommend this checkpoint is **ready for
integration** with the next stage of work, conditioned on adding a regression
test for the `target-not-established` outcome (finding 1) before or shortly
after that integration begins, since later group/containment records will start
depending on this evidence's stability. Finding 2 and the non-defect
observations are suggestions for the author's judgment, not integration
blockers.
