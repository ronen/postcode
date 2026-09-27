# Reproduction and artifact scope

Run from `/Users/ronen/postcode/app` with the supported Node runtime (review used Node 22.13.1 and TypeScript 6.0.3). These commands write only under `_foundation-readiness-review-codex/`. The probe importing the real compiler reads the existing `fixtures/dependency-journey` fixture and enclosing repository; it does not run target code.

```sh
node node_modules/typescript/bin/tsc -p tsconfig.json --outDir _foundation-readiness-review-codex/build
node _foundation-readiness-review-codex/probes.mjs
node _foundation-readiness-review-codex/terminal-probe/probe.mjs
node _foundation-readiness-review-codex/timeout-probe.mjs
```

- `probes.mjs` imports the fresh build and retained published Stately 2.4.0 sources. It regenerates `layout-prototype.mjs` from the baseline compiled layout with only the reachability implementation and sanctioned mutation updates changed. It checks all seven probe groups and writes `probe-results.json`. Assertions about current weaknesses intentionally confirm those weaknesses; passing does not mean they were fixed.
- The layout exercise uses minimal JavaScript evidence values consumed by the pure layout function. It does not type-check a new production adapter or test new filesystem acquisition.
- `root-id-failure.log` preserves the initial failure from attempting to pass the repository's empty-string root directly to Stately. The final adapter encodes region IDs.
- `terminal-probe/` has its own research manifest, lockfile and dependencies. If needed, restore only those packages with `npm ci --prefix _foundation-readiness-review-codex/terminal-probe --cache _foundation-readiness-review-codex/npm-cache --ignore-scripts --no-audit --no-fund`. Package archives, inspected source, metadata and archive hashes are in `upstream/`. Application dependencies are not changed.
- `timeout-probe.mjs` launches a finite Node child that handles SIGTERM and exits voluntarily after 1.2 seconds. A 500 ms timeout sends the signal; the parent waits for exit. The probe checks a filesystem signal marker because timeout handling can close output pipes. It writes `timeout-results.json` and `timeout-signal.txt`. This is not a test of killing arbitrary descendants or stuck kernel I/O.
- `baseline.json`, `guidelines-working-tree.diff`, and `baseline-delta.diff` record the initial code/guidance state. `final-verification.json` records the final preservation/link checks and relevant source hashes.

The full test suite and established performance/SCC stress experiments were deliberately not repeated. Their earlier evidence is linked and qualified in `REPORT.md`; the source has not changed. No probe writes into the prior audits, canonical tests, product source, governing/process documents, task records or backlog.
