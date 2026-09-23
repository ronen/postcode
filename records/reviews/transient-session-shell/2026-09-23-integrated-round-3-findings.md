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

### Supplement: long-session experiment

Added 2026-09-23 at the human's request, after the report above had been
committed. It is by the same reviewer against the same target (`4417726`; the
runtime at `HEAD` is unchanged). It addresses the residual limit "sessions much
longer than about 30 commands". The report above is unchanged; this supplement
updates that item only.

#### Method

The scratch script below opens one session on the ordinary PostCode checkout
(`tsconfig.json`: 215 modules, 48 repository groups). It excludes `_build` and
`_observations`, as `measure-session-journey.mjs` does, and calls
`session.execute` directly. Worker transport, publication and terminal output
are not included. Each execution still includes its two validation checks. The
run used Node 22.13.1 with no concurrent verification jobs.

- **Pass 1.** A deterministic plan of 400 commands cycles through ten request
  shapes:
  - `inspect`, `children`, `parents` and `inspect --source-detail` by module
    reference;
  - `inspect` and `inspect --source-detail` by group reference;
  - `inspect` by exact module handle;
  - `modules`, with source detail on some requests;
  - `dependencies`;
  - `organization`, alternating project and repository.

  Subjects step through all 215 modules and all 48 groups, and presentation
  alternates between text and JSON. Of the 400 commands, 238 are distinct
  requests. The `modules`, `dependencies` and `organization` shapes have only a
  few variants, so they repeat.
- **Pass 2.** The same 400 commands again in the same session. The script
  asserts that each rendering's SHA-256 matches pass 1.
- **Measurements.** Collected heap (three forced collections) every 25 commands,
  outside timed intervals. Per-command wall time. Heap after close.

The script must retain only digests of pass-1 renderings. An earlier run kept the
full rendered text, 171.6 MiB in total. That inflated apparent growth to about
0.5 MiB per command and left 220 MiB held after close. That run's latency results
and byte-for-byte pass-2 equality agreed with the corrected run below, but its
heap figures are discarded.

#### Results

All 400 pass-2 renderings matched pass 1.

| Point | Collected heap |
| --- | ---: |
| Before opening | 29.8 MiB |
| Pass 1, after 25 commands (24 distinct) | 229.7 MiB |
| Pass 1, after 400 commands (238 distinct) | 257.9 MiB |
| Pass 2, every sample through 800 commands | 257.3–258.0 MiB |
| After close | 39.2 MiB |

Median direct latency (ms) per quarter of each pass:

| Request | Pass 1 (q1/q2/q3/q4) | Pass 2 (q1/q2/q3/q4) |
| --- | --- | --- |
| Inspect module/group/handle | 616/617/701/691 | 649/580/587/651 |
| Inspect with source detail | 634/617/672/675 | 652/580/580/648 |
| Children | 717/691/772/798 | 784/665/663/723 |
| Parents | 700/687/725/775 | 723/658/701/724 |
| Modules | 1382/1465/1600/1400 | 1334/1234/1323/1321 |
| Dependencies | 800/775/860/834 | 840/720/729/804 |
| Organization | 633/638/728/719 | 676/585/589/657 |

Opening took 1.5 s. The slowest single command took 1.9 s. Pass 1 took 310 s in
total and pass 2 took 291 s.

#### Interpretation

- **Memory.** Retained heap grows linearly with new distinct requests: 28.2 MiB
  over 214 new requests, about 135 KB each. It does not level off, as expected
  with no eviction. Repeating requests adds nothing measurable, as the flat
  pass 2 shows. At this rate, a few thousand distinct requests would retain a
  few hundred MiB more. Close releases the session's state.
- **My earlier figure.** An earlier conversational summary said "about 75 KB per
  new request". That divided by commands, not distinct requests; the figure here
  supersedes it.
- **Latency.** No latency growth with store size was observed. Pass 1's later
  quarters were somewhat slower, up to about 13% for inspection. Pass 2 ran with
  the largest store and was as fast or faster, so the pass 1 variation is more
  consistent with machine variation than with accumulated state.
- **The 257 s outlier.** Nothing resembling it occurred in 1,600 commands across
  the two runs. Its cause remains unestablished.
- **Updated limit.** The long-session limit becomes: tested to 800 commands (238
  distinct) on PostCode through direct execution. Retained memory grows linearly,
  by about 135 KB per new distinct request, and stays flat on repetition. Results
  are repeatable, latency did not drift, and closing releases memory. There is
  still no memory bound other than closing the session.

#### Limits

- Direct execution only. The shell's worker and publication path uses the same
  executor, but it was not driven for this length.
- The clean project only. Sessions with partial projects or many input
  acquisitions were not tested at this length.
- One machine, two runs, with the heap figures from one run.
- One deterministic command mix. A more varied real session could have different
  per-request growth.

This supplement does not change the actionable-findings result or the
recommendation above.

#### Script

<details>
<summary><code>long-session.mjs</code> (run with <code>node --expose-gc long-session.mjs tsconfig.json OUTPUT.json 400</code> after <code>npm run build</code>)</summary>

```js
import assert from 'node:assert/strict';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const h = x => createHash('sha256').update(x).digest('hex');
let renderedChars = 0;
const app = '/Users/ronen/postcode/app';
const { openSession } = await import(app + '/_build/src/lib/session.js');
const configPath = path.resolve(process.argv[2] ?? app + '/tsconfig.json');
const out = process.argv[3];
const N = Number(process.argv[4] ?? 400);
const collect = async () => { for (let i = 0; i < 3; i++) { global.gc(); await new Promise(r => setImmediate(r)); } return process.memoryUsage(); };
const mib = m => +(m.heapUsed / 1048576).toFixed(1);
const baseline = await collect();
let t = performance.now();
const opened = openSession({ configPath, excludedOutputDirectories: [path.join(app, '_build'), path.join(app, '_observations')] });
assert.equal(opened.status, 'opened');
const openMs = performance.now() - t;
const s = opened.session;
const fmt = (i, detail = false) => ({ format: i % 3 === 0 ? 'json' : 'text', sourceDetail: detail });
let inv = s.execute({ lens: 'modules', selector: null, presentation: { format: 'json', sourceDetail: false } });
const mods = inv.view.modules;
let org = s.execute({ lens: 'organization', selector: null, subject: 'repository', presentation: { format: 'json', sourceDetail: false } });
const groups = org.view.groups;
console.error(`opened ${openMs.toFixed(0)} ms; ${mods.length} modules, ${groups.length} groups`);
// Deterministic varied plan: walk across all modules and groups with different lenses/presentations.
const plan = [];
for (let i = 0; plan.length < N; i++) {
  const m = mods[(i * 7) % mods.length], g = groups[(i * 3) % groups.length];
  const kinds = [
    { lens: 'inspect', selector: m.entityId, reference: true, presentation: fmt(i) },
    { lens: 'children', selector: m.entityId, reference: true, presentation: fmt(i) },
    { lens: 'parents', selector: m.entityId, reference: true, presentation: fmt(i) },
    { lens: 'inspect', selector: m.entityId, reference: true, presentation: fmt(i, true) },
    { lens: 'inspect', selector: g.entityId, reference: true, presentation: fmt(i) },
    { lens: 'inspect', selector: m.handle, presentation: fmt(i) },
    { lens: 'modules', selector: null, presentation: fmt(i, i % 20 === 5) },
    { lens: 'dependencies', selector: null, presentation: fmt(i) },
    { lens: 'organization', selector: null, subject: i % 2 ? 'project' : 'repository', presentation: fmt(i) },
    { lens: 'inspect', selector: g.entityId, reference: true, presentation: fmt(i, true) },
  ];
  plan.push(kinds[i % kinds.length]);
}
const samples = [], heap = [], rendered = [];
for (const pass of [1, 2]) {
  for (const [index, request] of plan.entries()) {
    t = performance.now();
    const result = s.execute(request);
    const ms = performance.now() - t;
    if (pass === 1) { rendered.push(h(result.rendered)); renderedChars += result.rendered.length; }
    else assert.equal(h(result.rendered), rendered[index], `pass 2 differs at ${index} ${request.lens}`);
    samples.push({ pass, index, lens: request.lens, sourceDetail: request.presentation.sourceDetail, ms: +ms.toFixed(1) });
    if ((index + 1) % 25 === 0) {
      const m = await collect();
      heap.push({ pass, after: index + 1, heapMiB: mib(m), rssMiB: +(m.rss / 1048576).toFixed(1) });
      console.error(`pass ${pass} ${index + 1}/${plan.length} heap ${mib(m)} MiB`);
    }
  }
}
const live = await collect();
const released = { inv: undefined };
inv = undefined; org = undefined; s.close();
const closed = await collect();
writeFileSync(out, JSON.stringify({ node: process.versions.node, configPath, openMs, modules: mods.length, groups: groups.length,
  renderedChars, baselineMiB: mib(baseline), liveMiB: mib(live), closedMiB: mib(closed), heap, samples }, null, 1));
console.error('done');
```

</details>
