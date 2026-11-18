# M3 ownership-aware immutable sharing

Date: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Implementation: `f4e8a386de51eda7483227dd386b9d6f265b730a`
Authorization boundary: `959ef44` task follow-up
Corrected runtime baseline: `8e06c5c74ba6679dd7e030dbb28162503b6235aa`
Evidence: [measurement summary](m3-ownership-sharing-summary.json)
Review: [focused ownership-sharing handoff](../../reviews/structured-architectural-accounts/2026-11-18-m3-ownership-sharing-handoff.md)

## Implemented boundary

The [memory investigation](m3-memory-investigation.md) identified avoidable copies of immutable records and content. The implementation introduces an `ImmutableCapture` owned by each program store. The paired contribution ledger delegates capture to that store; a standalone ledger owns its own capture boundary. No process-wide registry of captured objects is introduced.

Store retention, ledger acceptance, contribution-answer capture and production delivery capture now reuse already-owned immutable subgraphs. Unknown plain objects and arrays are copied with their aliases preserved, frozen and then registered as owned. Arbitrary caller-frozen objects are copied. Accessors and exotic objects use native structured cloning of the entire graph, preserving native aliasing and error behavior without treating the resulting graph as proof of deep ownership. The ownership proof remains private; plain captured values contain no marker, owner reference or executable capability.

Answer construction still reads and captures selection, standing, membership, producing concerns, inconsistency associations, fulfillment and other time-dependent state. It does not resolve that state lazily. Shared records/items/declarations are immutable information, not pointers to current status. Exact arrangement follows the retained graph and works after close; the closed Session API still refuses new operations. Exposure recording, chronology, Session/reference validation, full collision comparison and atomic acceptance remain in place. Ownership does not authorize a record or skip its validation. Canonical identity construction/comparison and method versions are unchanged.

The application discards the ownership table on close, interruption and invalidation. This releases its backing capacity even while an owner or old output remains referenced. Late cancellation work falls back to ordinary copying and cannot recreate the registry. Independent stores have independent ownership proofs. The scope is the physical store's lifetime; application Sessions each have their own store. Standalone stores/ledgers release their table with their owner when collected. Captured outputs themselves hold only frozen data.

The [implementation architecture](../../../docs/architecture/contributions.md) describes the boundary and lifetime. This is a production implementation informed by the prototype, including explicit disposal and conservative whole-graph fallback; it does not install the prototype's global WeakSet or override public `structuredClone`.

## Representative comparison

Both runs use Node 26.11.0 with `--expose-gc`, fresh processes and the same clean, read-only 741-module primary checkout at `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1`. The corrected build was copied before implementation changes and its compiled source digest matches the earlier investigation. The implementation's profiled build digest also matches the build used for the full suite. Digests and complete application answer keys are preserved in the summary.

The [profiler](../../../scripts/profile-contribution-memory.mjs) repeats the 18-request application journey, then captures an eight-module inspection, repeats it eight times, and constructs eight different inspections sharing seven of the original eight modules. The controlled withdrawal then checks that the old answer's complete JSON hash is unchanged while a fresh answer gets a different identity. No inference is involved. The profiler now tags production capture allocations and counts exposure records in addition to its existing audits.

All figures below are decimal MB after four asynchronous GC turns:

| Observation | Corrected baseline | Ownership sharing |
| --- | ---: | ---: |
| Journey complete; 15 retained answers | 1,182.91 | 643.37 |
| Initial overlap selection; 16 answers | 1,168.70 | 643.68 |
| Eight identical repeats; still 16 answers | 1,168.62 | 643.67 |
| Eight distinct overlapping answers; 24 answers | 1,188.94 | 644.71 |
| Additional heap for those distinct answers | 20.24 | 1.03 |
| After controlled withdrawal; 25 answers | 1,191.18 | 644.83 |
| Closed, measurement frame still holds inventory | 352.68 | 157.60 |
| Frame returned, closed Session facade deliberately held | 50.64 | 50.70 |
| Facade released | 49.32 | 49.38 |
| Profiler weak-reference registry cleared | 24.04 | 24.09 |

The journey reduction is **539.54 MB, or 45.61%**. Identical repeats stabilize; distinct overlapping answers retain their new selection/state without duplicating the large common bodies. The registry uses memory while its owner is live, so this is not a minimum-footprint claim. Its post-close capacity plateau is eliminated: the final process heap is effectively the same as the corrected baseline.

Both runs retain the same information and exposure population at the journey checkpoint:

| Invariant | Both runs |
| --- | ---: |
| Application answer keys, after removing the Session namespace | All 18 match |
| Retained answers | 15 |
| Entities / investigrams / productions | 8,400 / 65,583 / 15 |
| Actual delivery records | 7,787 |
| Evidence occurrences / distinct IDs in answer support | 138,695 / 96,935 |
| Content-item occurrences / distinct addresses in answer support | 48,361 / 35,025 |

Every retained program-record kind has the same count in both runs. Counts also match at the initial-overlap, identical-repeat, distinct-overlap and history-change checkpoints. The distinct requests add eight answers without adding canonical records, contributions or deliveries, and without increasing the union of support evidence/item identities. The withdrawal adds one investigram and production in each run; actual deliveries stay at 7,787. Both history probes preserve the old answer's complete hash and change the fresh identity. Independently generated withdrawal-production IDs are not compared across Sessions.

In the corrected build, zero audited support evidence/item occurrences share their canonical store/ledger objects. In the implementation, **all 138,695 evidence and 48,361 item occurrences do**. Serialized sizes remain essentially unchanged: about 99.40 MB canonical program records, 180.25 MB ledger, and 377.39 MB answers. These categories overlap and are not heap sizes or additive information totals. The small serialized-byte differences between runs are operational build/output exclusion paths, not changed answer identities or missing information.

In both representative close controls, the store and ledger are collected while the suspended measurement frame still holds one inventory answer. After the frame returns, the inventory and all tracked answers are collected even with the closed facade held. Sharing makes the surviving output smaller while preserving its information. The approximately 25 MB final drop is profiler metadata, not application retention.

These are bounded single runs under background load, including offline tests, not statistical latency benchmarks. Allocation samples estimate allocation origins rather than dominator sizes; ownership-table allocation can be attributed to whichever capture grew it. Do not interpret those groups as disjoint semantic information costs. Pre-GC observations are not application peak-memory measurements. Temporary canonicalization allocation remains outside this change; the earlier investigation's allocation-only experiment was not rerun as a claim of improvement.

## Verification

Verification by the implementing agent, not independent review:

- `npm run check`, `npm run build`, script syntax and `git diff --check` passed.
- The full offline suite passed **779/779**, with no failures, skips or cancellations, on Node 22.13.1 and concurrency 2. Existing native credential-lock and local callback tests ran outside the sandbox. No live inference was authorized or used.
- The focused runtime pass exercised **147 tests** before the final full run. The full run used the final build, held unchanged throughout.
- Six new tests cover ownership proof versus caller freezing, independent mutable snapshots, plain graph aliases/cycles/sparse arrays, whole-graph native fallback/getters/errors, independent owners and disposal, owned-but-invalid collision/Session/atomic-batch cases, and two simultaneous application Sessions with retained post-close output and worker message delivery. Existing native and contribution-answer tests now assert actual canonical sharing, unchanged exposure, and exact historical arrangement with store/status reads disabled.
- The full suite retains existing atomic contribution rejection, caller-mutation isolation, exposure/reconsideration, exact history and real CLI/worker-path coverage. The new transport check additionally passes retained output through a native worker message channel and compares both the delivered value and detached arrangement.
- A separate forced-GC control verifies collection of the **ownership table itself**, while its capture owner and frozen output remain strongly held. A second live boundary retains its own table until its own disposal; late work on the first does not allocate a new table. This supplements the functional disposal assertions and representative heap measurement without a fragile heap threshold in the test suite.

Reproduce the last control from a compiled implementation build:

```sh
node --expose-gc --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { ImmutableCapture } from './_build/src/lib/immutable.js';
const NativeWeakSet = globalThis.WeakSet, registries = [];
globalThis.WeakSet = class extends NativeWeakSet {
  constructor() { super(); registries.push(new WeakRef(this)); }
};
const a = new ImmutableCapture(), b = new ImmutableCapture();
globalThis.WeakSet = NativeWeakSet;
const old = a.capture({ nested: [1, 2, 3] }), live = b.capture({ value: 1 });
const collect = async () => {
  for (let i = 0; i < 8; i++) { await new Promise(r => setImmediate(r)); global.gc(); }
};
a.dispose(); await collect();
assert.equal(registries[0].deref(), undefined);
assert.ok(registries[1].deref());
assert.equal(b.capture(live), live);
assert.notEqual(a.capture(old), old);
assert.deepEqual(old.nested, [1, 2, 3]);
b.dispose(); await collect();
assert.equal(registries[1].deref(), undefined);
assert.equal(registries.length, 2);
JS
```

For representative reproduction, compile each exact revision into a separate build directory and use a fixed source checkout independently of both builds:

```sh
node --expose-gc scripts/profile-contribution-memory.mjs <fixed-source-tsconfig> <corrected-build> <empty-baseline-report-directory>
node --expose-gc scripts/profile-contribution-memory.mjs <fixed-source-tsconfig> <implementation-build> <empty-implementation-report-directory>
```

The source fixture should remain unchanged throughout. Compare the complete journey answer keys after removing only the Session namespace, per-kind record counts, contribution/delivery counts, historical-hash checks and GC phases; do not compare only rendered text or shortened identifiers.

## Review boundary

This is authorized M3 implementation within the remaining mechanical checkpoint. The task remains active. The focused review should examine the implementation and evidence, especially trust establishment, aliases/fallback, disposal, independently captured state and unchanged validation/exposure. It does not accept the M3 checkpoint, close the task, authorize live inference, or substitute for the separate agentic/caller checkpoint and M4 integrated review. No governing material or temporary canonicalization optimization is included.
