# M4 representative memory comparison

Date: 2026-11-18
Task: `2026-11-15-structured-architectural-accounts`
Evidence: [machine-readable comparison](m4-memory-summary.json)

## Basis

The corrected, accepted caller source is `4a4d060e2c789f903f950d68602ffa99d0575d42`, compiled-source SHA-256 `2244430ef84968a0020ca0a99ca60017b629a7831e24f77c56998cbb037d7490`. Its build was preserved before retirement. The integrated build digest is `3edaa8934ae36f8f966f4fc08fef395da08da0343d5374d0cc4b5a640b320a94`. Both use fresh Node 26.11.0 processes, `--expose-gc`, and the same clean, read-only primary checkout at `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1` (741 modules). The profiler is unchanged. No inference is involved.

Reproduction after building either revision into its own directory:

```sh
node --expose-gc scripts/profile-contribution-memory.mjs /path/to/pinned/primary/tsconfig.json /path/to/build /path/to/new-output
```

Run from the task checkout with an unchanged build and pinned workload. The retained comparison excludes timing as a performance conclusion: the final suite ran concurrently, and this is one process per revision, not a statistical benchmark. Four GC turns precede each retained sample. Serialized byte counts measure logical shape, not unique retained heap: shared references serialize repeatedly.

## Retention and identities

| Checkpoint | Baseline heap MB | Integrated heap MB | Answers |
|---|---:|---:|---:|
| journey canonical and answer audit | 643.14 | 643.32 | 15 |
| overlap baseline | 643.46 | 643.63 | 16 |
| identical 8 | 643.46 | 643.64 | 16 |
| distinct overlapping 8 | 644.50 | 644.68 | 24 |
| after historical change | 644.61 | 644.80 | 25 |
| closed inside journey | 157.16 | 157.31 | 1 |
| closed after journey returns, session facade held | 50.53 | 50.53 | 0 |
| closed facade released | 49.21 | 49.21 | 0 |
| instrument registry cleared | 23.92 | 23.92 | — |

All 18 journey answer keys match after normalizing only the random Session prefix. The comparison preserves every key, not just a count. Identical repeated selection asserts the same exact answer ID on every request and stabilizes at 16 answers. Eight distinct overlapping selections reach 24 answers and add about 1.05 MB of retained heap in either build. They add no canonical program records, Entities, investigrams, productions or exposure records. Their support unions stay unchanged. The controlled historical withdrawal adds one investigram and production; it creates a different fresh answer while the earlier answer's full JSON hash remains unchanged in each run. Scripted change-production IDs are independent across Sessions.

At the journey checkpoint both builds retain 8,400 Entities, 65,583 investigrams, 15 productions and 7,787 actual deliveries. Every native record-kind count agrees, including 741 modules and 15 answer records (four module, four organization, four dependency and three common inspections). At live checkpoints all 139,125 initial evidence occurrences and 48,467 item occurrences share their corresponding canonical objects, and sharing stays complete through the repeated/distinct/history cases. The initial unions contain 96,935 evidence identities and 35,025 item addresses.

The integrated logical serialization is about 99.40 MB of canonical program records, 180.25 MB of ledger records and 380.91 MB of answers. These are not disjoint retained heaps: answer serialization repeats shared evidence/items. The unchanged counts, complete observed sharing and stable repeated selections show no new dominant duplication introduced by retirement. The roughly 0.18 MB live-heap difference is not a claimed optimization or regression. Answer-specific selection, standing and reconsideration snapshots remain independently retained.

Removing retired Session method names and advancing `program-records@25` changes captured provenance payloads. It does not change the 18 measured answer keys or native provider algorithms. The slightly smaller serialization includes that metadata change and output-directory spelling; it is not evidence of reduced architectural information.

## Post-close heap

The 157 MB checkpoint deliberately still holds the last inventory through the measuring function's local variable. Weak probes show the program store and contribution ledger collected while that answer and its reachable support survive. Once the frame returns, the inventory is also collected and heap falls to about 50.53 MB while the closed Session facade remains. Releasing that facade removes about 1.32 MB; clearing the profiler's own weak-reference index and metadata drops the process to about 23.9 MB. This repeats the representative explanation established in M3; it does not rely on the small-fixture collection test.

Canonical retained information, shared answer support and independent answer snapshots therefore remain distinct from the measuring harness and temporary request allocations. Before/after-GC samples and allocation groups are preserved in the comparison. This change does not optimize canonicalization, serialization, sorting or temporary capture allocation; the earlier [memory investigation](m3-memory-investigation.md) remains the evidence for that separately scoped opportunity.
