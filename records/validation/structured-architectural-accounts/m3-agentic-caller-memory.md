# M3 caller representative memory comparison

Date: 2026-11-18
Task: `2026-11-15-structured-architectural-accounts`
Evidence: [machine-readable summary](m3-agentic-caller-memory-summary.json)

## Method and scope

The accepted corrected mechanical ownership-sharing revision `08f6cde38d514251a34962ccc095a569a1e22a5f` was rebuilt from its archived `src`, `test`, `package.json` and `tsconfig.json`. Its compiled source digest is `243550ab60452c19cd1f3e0c469ea8d093c326f282867fefd982ca6026fe3991`, matching the accepted measurement. The final caller build digest is `0a0a5318d4f39c8b20758eb76c5ac0841461128d9d756093b2b2d7c95e527ee1`; the full suite uses that same unchanged build. This comparison detects migration regressions; the earlier [ownership-sharing comparison](m3-ownership-sharing-checkpoint.md) separately establishes the reduction from the unshared corrected baseline.

Both runs use fresh Node 26.11.0 processes with `--expose-gc` against the same clean, read-only 741-module primary checkout at `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1`. The [profiler](../../../scripts/profile-contribution-memory.mjs) makes 18 application requests (two rounds), repeats an identical eight-module selection eight times, creates eight distinct selections sharing seven modules, then makes a controlled withdrawal and checks old-answer hash preservation and changed fresh identity. No provider inference occurs. The measurement runs alongside offline validation; elapsed request times are preserved but are not comparative latency claims.

To reproduce, compile the two revisions into separate fixed build directories, then run each in a fresh process against that same repository snapshot:

```sh
node --expose-gc scripts/profile-contribution-memory.mjs <repository-tsconfig> <fixed-build> <empty-output-directory>
```

Keep the workload checkout clean and the compiled build fixed throughout each run. The durable summary contains full normalized answer keys, retained counts by record kind, serialized support categories, pre/post-GC memory, sampled allocation groups and liveness controls. It normalizes only each answer ID's producing Session prefix; literal content is not rewritten. Raw profiler files are disposable instrumentation output, not prerequisites for this record.

## Retained memory and counts

Decimal MB after four asynchronous GC turns:

| Observation | Accepted mechanical baseline | Caller implementation |
| --- | ---: | ---: |
| Journey complete; 15 answers | 643.39 | 643.19 |
| Initial overlap selection; 16 answers | 643.70 | 643.50 |
| Eight identical repeats; still 16 answers | 643.70 | 643.50 |
| Eight distinct overlapping answers; 24 answers | 644.74 | 644.53 |
| After controlled historical change; 25 answers | 644.86 | 644.65 |
| Closed, measurement frame still holds inventory | 157.47 | 157.35 |
| Frame returned, closed Session facade held | 50.66 | 50.61 |
| Closed facade released | 49.35 | 49.29 |
| Profiler registry cleared | 24.06 | 23.99 |

The approximately 0.2 MB difference is not a claimed optimization. Identical selection stabilizes both answer count and post-GC heap. Eight distinct overlapping answers add approximately 1.03 MB, with no additional canonical records, investigrams, productions or exposures and no increase in the union of support evidence/item identities. The controlled withdrawal adds one production and investigram, preserves the earlier answer's complete JSON hash, and changes the new answer identity. Independent scripted production identities are not expected to match across Sessions.

At the journey checkpoint both builds have 8,400 Entities, 65,583 investigrams, 15 productions and 7,787 actual delivery records. All canonical program-record kind counts agree. Each retains 15 answers: four module, four organization, four dependency and three inspection selections. The baseline's three `investigation-selection-projection` records become three `contribution-inspection-projection` records; this is the intentional caller contract change, not extra duplicated answers.

All 12 native journey answer keys match the baseline after Session normalization. The six inspection deliveries (three repeated questions) have new keys, as required by the new inspection method and common selection contract. Within each run the repeated inspection questions reuse their logical answer identities. The summary preserves all 18 keys and per-request comparisons.

The common inspection selections carry more explicit selected support: evidence occurrences rise from 138,695 to 139,125 and item occurrences from 48,361 to 48,467. Their unions remain 96,935 evidence IDs and 35,025 item addresses. **Every audited evidence occurrence shares its canonical store record and every audited item occurrence shares its ledger item while those owners are live.** Additional references and independently captured selection/status therefore do not recreate the prior large content copies.

## Information, duplication and temporary work

The caller run serializes about 99.40 MB of canonical program records, 180.25 MB of ledger records and 380.92 MB of answer graphs, compared with 377.39 MB of baseline answer graphs. These graphs overlap; their serialized lengths are not additive retained heap or a lower bound on necessary information. Common inspection explicitly includes content/uses that the old associated selection represented differently. Internally their large immutable evidence and item bodies are shared. Owner provenance and selection/standing/cause wrappers remain answer-specific where required. This measurement finds no regression to dominant duplicated answer bodies after caller migration; it does not claim that every remaining canonical byte is irreducible.

The rejected partial caller representation embedded full production history for every selected owner. Besides repeated serialization, this brought unrelated batch members and operational chronology into selected answers. The final representation retains exact selected content/evidence, producer, originating question, report and qualification, with independent status snapshots; full attempts remain Session records. This is the appropriate split for the existing lifetime/delivery contracts: historical presentation is self-contained without retaining unrelated attempt history in each answer.

The elevated representative post-close heap is explained by the control sequence, not dismissed using a small fixture. Immediately after close, the suspended measurement frame still holds one inventory answer; its shared canonical support legitimately remains reachable (157.35 MB process heap), while both store and ledger are already collected. After the frame returns, no tracked answer or inventory remains live even with the closed facade held. Releasing that facade removes another approximately 1.32 MB. Clearing the profiler's own weak-reference metadata removes approximately 25.30 MB, leaving 23.99 MB. The accepted ownership-boundary disposal remains covered by `immutable-capture` and the simultaneous-Session lifetime tests; no module-global ownership registry was introduced.

Pre-GC samples and live allocation groups are retained as observations, not peak-memory or dominator measurements. Sampling attributes allocations to capture paths but does not partition semantic ownership, and GC timing varies. Temporary canonicalization/serialization still allocates, and its separate allocation-only experiment was not repeated as a claim of improvement. No generic canonicalization or temporary-allocation optimization is included in this checkpoint.
