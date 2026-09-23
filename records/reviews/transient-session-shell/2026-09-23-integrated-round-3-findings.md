# Transient session shell integrated review: round 3 findings

Record type: findings
Received: 2026-09-23
Reviewer: Claude Opus 5.5 (`claude-opus-5-5`) in a fresh Claude Code session, arranged by the human; not the implementing agent
Handoff: [Transient session shell: integrated review](2026-09-23-integrated-handoff.md)
Round: 3
Reviewed target: `441772648cbd550b108c1060cc8dfb1df883edc4` (full scope `8dccbfd..4417726`, with new scrutiny on the R2-F1 correction `cafbd9c..4417726`; branch `codex/transient-session-shell`)
Prior findings: [Integrated round 2](2026-09-23-integrated-round-2-findings.md)
Prior reviewed target: `cafbd9c0b99016ecf9a1575bf9a8ddd67f009b0a`

## Returned findings

### Scope and method

I read the original handoff, the review workflow, the round 2 findings, the
integrated disposition (including its round 2 disposition and round 3 target),
the task follow-up that records the human's "Retry after additional inputs"
choice, and the [partial-reuse validation](../../validation/transient-session-shell/2026-09-23-partial-reuse.md).
I also checked the governing text on incomplete evaluation. That is the plan's
accumulation requirements and the decision section "Immutable information within
an accumulating session".

I reviewed the complete runtime, test, script and documentation diff for
`cafbd9c..4417726`. In `src/lib/typescript/project.ts` I read `discover` in full,
and in `src/lib/typescript/inputs.ts` the acquisition memo and validation probes.
I also read `recordModuleEvaluation` and `evaluateDependencies`, the session
executor, and how organization evaluation derives qualification from its module
basis. The checkout was at `HEAD` `65e2309`. `git diff 4417726 HEAD -- src test
scripts package.json` is empty, so the later commits change records only.

I treated the disposition and validation claims as statements to check. I wrote
scratch probes against the built runtime, drove the real CLI shell in a
pseudo-terminal, and did not modify the implementation.

### Verification performed

- `npm run check`: passed (Node 22.13.1). `npm test`: 228 of 228 passed.
- `node scripts/compare-session-requests.mjs`: 162 comparisons passed (54 per fixture).
- `node scripts/probe-session-interruption.mjs`: interruption inside checker work
  returned no view, recorded only `command-interrupted`, and exited 130 about
  18 ms after interruption.
- `node --expose-gc scripts/measure-partial-session.mjs`: passed. The script
  asserts full result equality on every one of the 20 measured requests in both
  the clean project (215 modules) and the partial project (216 modules). Every
  lens kept one distinct projection. Median-range direct latencies were close
  between the two projects:

  | Request | Clean (ms) | Partial (ms) |
  | --- | ---: | ---: |
  | Modules | 1353–1607 | 1385–1621 |
  | Dependencies | 648–737 | 657–702 |
  | Organization | 499–535 | 511–550 |
  | Inspect | 512–546 | 524–545 |
  | Children | 587–612 | 593–617 |

  Collected heap for the partial project was 235.8 MiB before the repeats,
  235.6 MiB after them, and 38.1 MiB after close. My first few clean samples ran
  alongside unrelated probes, so they are descriptive only. I did not rerun the
  `--allow-retries` baseline against a saved `cafbd9c` build. Round 2 had already
  measured the old cost independently, and these figures are consistent with its
  removal.
- **Mixed-order reuse and acquisition probe.** I used a small project with
  `export { missing } from './nowhere.js'; require('./later/target');` and one
  session. The sequence was `modules` ×2, then `dependencies`, `modules`,
  `organization`, `inspect other`, `inspect other --source-detail`, `modules`,
  `children entry`, `parents target`, `modules`, `dependencies` and `modules`.
  - The modules projection ID changed exactly once, after the first dependency
    request, and then stayed the same through the rest of the mixed sequence.
    Source-detail and organization work did not trigger further attempts.
  - Every modules rendering was byte-identical to the first.
  - A fresh session running `dependencies` then `modules` rendered the same text
    apart from the session ID. The retry therefore neither broadened the
    projection nor changed qualification, and the partial expansion lines still
    read `materialization partial`.
- **Invalidation remains distinct from retry.** In a partial project I executed
  `modules`, `dependencies` or `organization` twice, which caches the stable
  partial result. I then created the missing target as `nowhere.ts`,
  `nowhere.js` or `nowhere.d.ts`. All nine combinations raised
  `SessionInvalidated` on the next request. None served the reused partial
  result. The negative resolution probes therefore still guard the retained
  partial work.
- **Real shell on a partial PostCode copy.** I made a temporary Git copy of
  `src`, `test` and `tsconfig.json` and added the unresolved re-export. I then
  drove `node _build/src/cli.js shell --project …` through a Python `pty` driver.
  - Opening took 2.3 s. The first `inspect session` took 3.3 s, and repeats took
    0.8–0.9 s.
  - `dependencies` took 1.3 s. Later `inspect session` took 0.76–0.86 s.
  - `modules` took about 1.5 s both times and showed the partial `exports` and
    `documentation` qualifications. `children session` took 0.95 s both times.
  - EOF exited 0.

  Round 2 measured about 3.1 s for every repeated inspection. That cost is gone
  through the actual worker and publication path. The shell wrote ignored local
  batches under `_observations/`, and I deleted the temporary copy.

### Assessment of the R2-F1 correction

The correction implements the human-selected policy, and I found no defect in it.

- **Acquisition revision.** `revision()` is `observations.size`. The memo only
  inserts into that map. `changed()` calls stored probe closures directly and
  never writes to it, so validation cannot advance the revision or refresh
  evidence. Excluded paths return before the memo and never count as
  acquisition. The revision is therefore append-only and moves only on genuine
  new compiler-host observations.
- **Provider caches.** Complete components are kept with revision `null` and
  stay reusable across acquisition. Partial expansion, composition, dependency and
  whole-request entries count as current only at the revision on which they were
  prepared. Dependencies are prepared first, so their acquisition makes earlier
  partial expansions stale before the reuse decision.
  - `stable` requires every requested component to be current after all
    preparation. If a later step in the same call acquires inputs, the call omits
    `retryBasis` and does not cache the result. The next call retries. At most one
    extra attempt follows each acquisition, and I saw convergence in practice.
  - `inputs.identity()` is taken after preparation, so `retryBasis` names the
    captured-input record for the basis actually used.
- **Evaluation reuse.** `recordModuleEvaluation` accepts a basis only when it is
  an `analysis-inputs` record in the same session. The key for partial content
  includes the basis, and the key for complete content excludes it. Identical
  partial content on the same basis reuses the earlier record. A new basis, or a
  provider without the assurance (key `null`, never stored), creates a new
  attempt. Earlier records are never rewritten. The new regressions confirm this
  with `structuredClone` comparisons and the `uncertain` provider.
- **No outer cache.** The session-level module and dependency caches are
  removed. What remains is organization and dependency-organization reuse keyed by
  the selected evaluation IDs, cached only when complete. It cannot hide
  acquisition, because a new module basis has a new ID. Organization evaluation
  takes its qualification from its module basis, and its record IDs are
  deterministic. In the tested workload it kept one projection per lens.
- **Governing fit.** The plan and decision allow a later attempt to establish
  missing information while retaining earlier outcomes. They do not require a new
  attempt on every request. Reusing a qualified partial outcome on an unchanged
  basis keeps qualification unchanged; I verified the partial lines persist, so
  nothing is promoted to complete. The CLI reference, the architecture document
  and the implementation conventions describe the policy accurately. That
  includes the fact that a retry still evaluates project-wide expansions for a
  focused view, and that memory can still grow with new requirements or input
  bases. Method versions advanced to discovery 12 and evaluation 5.

### Actionable findings

None.

### Non-defect observations and nits

1. **Retry scope is global.** Any new compiler-host observation from any lens
   makes all partial provider work eligible for one more attempt. This matches the
   documentation ("New acquisition makes that partial work eligible to retry").
   In the partial PostCode copy, `dependencies` apparently acquired nothing new:
   inspection after it stayed at about 0.8 s, and I did not count attempts
   directly. In the small CommonJS project, one retry followed and then reuse
   resumed. The worst case is one project-wide expansion pass per request that
   acquires new inputs, bounded by the finite set of observable inputs.
2. **One branch has no direct test.** The unstable path is the case where
   expansion or composition preparation acquires inputs after dependency
   preparation in the same call. The new tests exercise acquisition only through
   dependency resolution. I could not construct a trigger for the unstable path
   with the current provider, because the compiler resolves the Program's modules
   at opening. The branch looks conservative (no basis, no cache), but it is
   unverified by execution.
3. **Provider caches ignore the `store` argument.** They key on the request and
   not on the `store` passed to `discover`. If one provider instance were used
   with two stores, a reused result could name a `retryBasis` absent from the
   second store, and `recordModuleEvaluation` would throw. This follows the
   pre-existing pattern for cached complete results. Sessions pair one provider
   with one store, so it has no current consequence.
4. **Warm-up hides the first retry.** `measure-partial-session.mjs` acquires every
   lens before measuring, so it deliberately excludes the one-time retry after
   first dependency acquisition. The validation report states this, and my mixed
   probe and shell run cover that transition.
5. **Focused views of complete subjects show no partial qualification.**
   `inspect session` in the partial project shows no partial qualification,
   while `modules` does. That is truthful for the selected subject and unchanged
   from round 2. It is no longer tied to a hidden latency penalty.

### Unverified areas and residual limits

- The limits the human approved in earlier rounds remain unverified by me:
  - interrupting opening in a real terminal;
  - non-Git and non-macOS behavior;
  - interactive sink failure and worker defects beyond code and tests;
  - sessions much longer than about 30 commands.
- The 257 s outlier did not recur in any of my runs, and its cause remains
  unestablished.
- I tested one kind of partial expansion (an unresolved re-export) plus a
  CommonJS dependency acquisition. I did not construct partial composition or
  partial dependency results on a realistically sized project.
- This round focused on the R2-F1 correction. I did not repeat the full
  human-level fixture and PostCode organization/group journeys from round 1, and
  my inspection does not substitute for the human inspection the plan requires.
- Timings are single runs on one machine and some overlapped my other probes.
  They are not latency guarantees.

### Recommendation

The R2-F1 correction is sound and matches the human-approved policy.
- Partial work is reused on an unchanged basis without project-wide repetition
  or retained growth.
- New acquisition produces exactly one new attempt, and earlier records stay
  unchanged.
- Changed inputs still invalidate rather than serve reused results.
- Qualification is never promoted.

I found no regression in the paths the handoff names, and no actionable
findings remain from rounds 1–3. From the perspective of this review, I see no
need for another round. Whether the accumulated review satisfies the final gate,
and the required human inspection and acceptance, remain the human's decisions.
This recommendation is not human acceptance of the gate.
