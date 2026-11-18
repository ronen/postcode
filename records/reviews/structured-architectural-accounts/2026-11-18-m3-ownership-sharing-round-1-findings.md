# M3 ownership-aware sharing review: round 1 findings

Record type: findings
Received: 2026-11-18
Reviewer: Claude (Opus 5.5), independent review session
Handoff: [M3 ownership-aware sharing review](2026-11-18-m3-ownership-sharing-handoff.md)
Round: 1
Reviewed target: `f4e8a386de51eda7483227dd386b9d6f265b730a`
Reviewed scope: `959ef4495b2fbdc0857e1a97da097fcd56de976e..f4e8a386de51eda7483227dd386b9d6f265b730a`, with `8e06c5c74ba6679dd7e030dbb28162503b6235aa` as the runtime comparison baseline; the validation records in `9683fea` and `7ad8965` read as evidence

## Returned findings

### Recommendation

**No actionable findings.** The sharing change is ready to be included in the mechanical checkpoint. Trust comes only from the boundary's own copy-and-freeze. Every capture site keeps independently captured time-dependent state and unchanged exposure. Validation still runs on owned inputs. Disposal is wired to every application exit I could find.

My reduced-scale reproduction independently confirms the claimed invariants and the direction and approximate size of the memory reduction. The remaining items below are optional optimizations or pre-existing behavior, not defects. The human decides whether the gate is satisfied.

### Method and verification

I read the complete source and test diff, the new architecture section, the ownership-sharing checkpoint and summary, the profiler changes, and the relevant parts of the memory investigation. I traced each capture site:

- store `put`
- ledger `invoke`, `begin`, `#conclude`, acceptance and name index
- production `#record`
- `selectContributionAnswer`
- the native contract's shared `finding`

I also traced the application lifetime paths in `application/session.ts`: open failure, unopened project, interrupt, invalidation and close. I searched `src/` for identity-keyed caches that sharing could conflate. The only data-keyed one, the placement index keyed by repository/layout evidence, is safe to share, because equal immutable evidence yields the same index.

Verification ran on the user's machine in a Linux VM with Node 22.23.5, against the installed dependencies. Builds and runs used scratch copies made with `git archive`; the worktree was not modified.

- **Build digests match the summary.** `8e06c5c` → `6113c623dc0d3df39d2a05b89fa98a88580518f56604da9c94b1467aca9e16b4` and `f4e8a38` → `102070264e3e21052e081fd4af5bb7eed2632e63e7004b60b02c99318482a738`, using the repository's `buildIdentity`.
- **Checks.** At `f4e8a38`, `tsc --noEmit` and `tsc` passed, and `git diff --check 473602e f4e8a38` passed. `src/`, `test/` and `scripts/` at HEAD `7ad8965` are identical to `f4e8a38`.
- **Full offline suite.** At `f4e8a38`, run from a self-contained git copy in ten file batches with concurrency 2: **779 tests: 776 passed, 1 skipped, 2 failed.**
  - The skip needs a case-insensitive filesystem.
  - The failures are the two native credential kernel-lock tests (`lock child exited before ready`); the installed `fs-ext` binary is macOS-built.
  - I consider these environmental. They are consistent with the implementer's 779/779 on macOS Node 22.13.1.
- **`ImmutableCapture` edge probe.** I compared `capture(v)` with `structuredClone(v)` on the following values: -0/NaN/undefined and holes, BigInt, symbol-keyed and non-enumerable properties, arrays with extra keys, an `Array` subclass, `Date`, `Error`, and JSON `__proto__`/`constructor` fields. All matched in value, prototype and own keys, and the results were frozen.
  - An owned value embedded in a new plain graph is shared by reference. Inside a `Map`, which takes the native fallback, it is copied.
  - Mutating a shared descendant throws.
  - The one difference is a typed array: `capture` throws `TypeError`, because `freezeOwned` cannot freeze a buffer view. The pre-change `freezeOwned(structuredClone(…))` path behaves the same way, so this is not a regression (see O2).
- **Representative reproduction, reduced.** The full 741-module profile could not finish in this VM: the detached runs of both builds were killed after about 3 minutes, the baseline at roughly 1.4 GB heap and the implementation at roughly 1.1 GB RSS. I therefore ran the unchanged profiler, with fresh processes and `--expose-gc`, on the same fixed source tree at `bd92670`. That tree was archived into a scratch git repository, with a tsconfig narrowed to `src/lib/organization/**` and `src/lib/repository/**`, giving 239 modules and 2,186 symbols. Both builds used the identical source, journey, overlap and history steps.

| Observation | `8e06c5c` | `f4e8a38` |
| --- | ---: | ---: |
| All 18 journey answer keys, Session namespace removed | equal | equal |
| Record-kind counts at every pre-close audit | equal | equal |
| Entities / investigrams / productions / deliveries at the journey audit | 2,583 / 24,248 / 15 / 3,560 | 2,583 / 24,248 / 15 / 3,560 |
| Evidence occurrences shared with canonical records | 0 of 52,546 | 52,546 of 52,546 |
| Item occurrences shared with ledger items | 0 of 18,905 | 18,905 of 18,905 |
| Serialized answers / canonical records (MB) | 147.1 / 35.4 | 147.1 / 35.4 |
| Heap after GC, journey complete (MB) | 554.6 | 298.6 |
| Added by eight distinct overlapping answers (MB) | 17.3 | 1.1 |
| Historical-hash preserved / fresh identity changed | yes / yes | yes / yes |
| After the withdrawal: investigrams / productions / deliveries | 24,249 / 16 / 3,560 | 24,249 / 16 / 3,560 |
| Closed inside journey: store / ledger live | no / no | no / no |
| Final heap after registry cleared (MB) | 42.4 | 42.5 |

The journey reduction here (46%) is close to the checkpoint's 45.6% at 741 modules. The retained information, exposure and answer identities are unchanged. At the "closed inside journey" sample, the record-kind audit differs only because the held inventory answer now shares canonical records, so the profiler's weak references to those records stay live. Information is not being duplicated or lost. This is expected and consistent with the checkpoint's account.

I did not rerun the ownership-table GC control script, so table collection is accepted here on the strength of the checkpoint plus my reading of `dispose()`.

### Assessment by review focus

1. **Trust establishment.** Only objects created by `copy` and then frozen enter the private `WeakSet`. Caller freezes are not trusted, and the tests show a caller-frozen graph being copied. Proxies, functions, symbols, accessors and non-plain prototypes abort the speculative copy before anything is registered, then fall back to a whole-graph native clone that is never registered. Aliases and cycles are preserved through `copies`. Sparse arrays are preserved because the copy uses `new Array(length)` plus own keys. Prototype-named fields are copied as own data properties through `defineProperty`, with no setter invoked. Ownership is per store, so a value captured by another store or a worker is copied. Sharing a frozen value carries no authority, because store reference validation still checks Session membership, which the tests exercise.
2. **Capture sites.** Answers still capture freshly derived standing, membership, producing causes, inconsistencies and fulfillment as new copied nodes; only immutable items, declarations and evidence are shared. The contribution-answer test arranges an earlier answer with store, standing and status reads disabled, after `releaseOwnership`. Delivery records are still per-delivery plain objects, with counts unchanged in my reproduction. Worker transport uses native cloning, as the MessageChannel test shows.
3. **Validation.** `store.put` still runs its full `canonical` collision comparison before capture and all reference/Session validation afterwards. A record that is already owned still goes through the whole batch. The ledger's acceptance validation runs before `capture`, and the native contract still compares `canonical` statements. The new owned-but-invalid store test covers collision, wrong-Session reference and atomic rejection.
4. **Lifetime.** `dispose` (close, interrupt, opening failure) and the invalidation branch call `releaseOwnership`. `close` now disposes before clearing `state`, so the release happens. An interrupt during project opening is caught by `alive()` before the synchronous `initialize`, so there is no window in which a disposed Session gets a live table. Late captures after disposal use the plain copy path and cannot recreate the table. Simultaneous Sessions have separate stores and tables, as the lifecycle test shows. Captured values hold no reference to the table or store.
5. **Measurement fairness.** The comparison holds the fixed source, journey and Node version constant across fresh processes. It compares complete answer keys, per-kind record counts and contribution/delivery counts as well as heap, and it reports the identical-repeat and distinct-overlap phases separately. The checkpoint states the profiler's own registry (about 25 MB) and the allocation-sampling caveats rather than counting them as savings. I found nothing misreported.

### Non-defect observations

- **O1: Table cost while live.** The ownership `WeakSet` holds an entry for every owned node while the Session is open. That is the "active-session tracking cost" the handoff discloses. Registering only top-level shared roots would trade this for less sharing granularity. That is optional optimization, not a defect.
- **O2: Typed arrays and other exotic values.** These keep the pre-existing behavior. Buffer views make `freezeOwned` throw; a `Map` or `Set` is frozen only shallowly. The change neither introduces nor fixes this. No current record type appears to contain such values, which is consistent with the full suite passing.
- **O3: Serialized size is unchanged by design.** Sharing reduces heap, not serialized answer size (about 147 MB in my run, about 377 MB in the checkpoint). Any consumer that serializes complete answers still pays the full cost. Canonicalization allocation also remains, as the handoff notes.

### Unverified areas and residual limits

- I did not reproduce the full 741-module run or the exact heap figures in the checkpoint, nor run Node 26.11.0. My figures come from a reduced subset of the same fixed tree on Node 22.23.5.
- I did not run the standalone ownership-table GC control.
- I did not test application-level interruption timing beyond reading the code and the existing lifecycle tests.
- No live inference was used, and none was authorized.
