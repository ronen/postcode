Record type: findings
Received: 2026-11-17
Reviewer: Codex, independent gate reviewer
Handoff: [M2 early vertical application review](2026-11-17-m2-vertical-handoff.md)
Round: 3
Reviewed target: `56995015770f4c1a8bf4a91ca179526884dafd97`
Prior findings: [M2 round 2 findings](2026-11-17-m2-vertical-round-2-findings.md)
Prior reviewed target: `d6f28cc6d54aa623cc2ca79e1ef77eaf2d7f3d0c`

## Returned findings

### Recommendation

**No actionable findings.** R2-F1 is resolved. With the earlier corrections and verification recorded in rounds 1 and 2, I recommend that the human consider the M2 vertical result technically sufficient to proceed to M3. This review does not itself satisfy the human-controlled gate, begin M3, or close the task.

### Scope and method

This is a focused rereview of the correction in `5699501`: identifying-name capture in fixed answer support, bearer-label arrangement and provenance disclosure, the Projection method-version advance, the new discovery regression, and the corresponding architecture description. The original handoff and its governing decisions remain applicable. I read the [round 2 corrections intent check](2026-11-17-m2-vertical-round-2-corrections-intent-check-claude.md) as context, not independent verification.

The checkout was clean at `e91d96caf73dcc800266339c891bf6c8c74e4426`. Its only change after the reviewed implementation target is that intent-check record. The source and tests inspected and executed therefore match the exact implementation target above.

I inspected the correction against the identifying-name contracts, fixed-support and exact-presentation rules, and the original R2-F1 reproduction. I ran the contribution regression and core ledger suites and independently repeated the original single-module probe, additionally making ledger identification and catalog lookup throw after constructing the answer to check that rendering uses only the captured support.

### Resolution of R2-F1

- Answer construction resolves each retained item's identifying names through its content contract. Mechanical `module-identification` items now participate through the same capability as generic identification, rather than being excluded by a presentation-side type filter.
- The fixed snapshot retains each name's origin, the original item body and detailed handle provenance, and the exact Entity. Arrangement derives the readable label from that snapshot and attributes name/handle origins in the bearer-identification qualification groups. It introduces no ledger or catalog lookup during presentation and no producer exposure during assembly.
- The independent reproduction now renders `States of barrel` in text and SVG, without a raw Session ID. Rendering still succeeds with identification and catalog lookups disabled after selection, and producer delivery records remain unchanged.
- The new regression uses the ordinary discovered `barrel` and `origin` module Entities, with no supplemental generic identification. It checks distinct labels, text/SVG output, generated-handle attribution, mechanical qualification, retained exact Entity references, no rendered Session IDs, and unchanged exposure. After withdrawing one identification, the old answer renders identically; a fresh selection updates only the affected bearer's label.
- The responsible Projection method advances from version 4 to 5. The architecture documentation describes the implemented fixed-support boundary.

### Independent verification

Under Node 22.13.1:

- `npm run check`: passed.
- `npm run build`: passed.
- `node --test --test-concurrency=2 _build/test/contribution-*.test.js`: **65/65 passed**.
- `node --test _build/test/contributions.test.js`: **18/18 passed**.
- Original R2-F1 probe with post-selection lookup guards: passed.
- `git diff --check`: passed.

These 83 tests include the earlier intent-correction regressions as well as the new module-label case. I did not repeat the full offline suite for this narrow correction; the [round 2 record](2026-11-17-m2-vertical-round-2-findings.md) preserves that run and its successful authentication rerun outside the sandbox. No new live inference or performance measurement was performed.

### Non-defect observations and limits

The intent check's observations about undesignated accepted reports and repeated owner statements do not reveal a new implementation defect. The existing treatment of an undesignated report as attempt reporting remains documented and tested; the human can explicitly record acceptance of that treatment in the gate disposition. Owner statements remain correctly attributed even when repeated across groups. Neither observation requires changing this correction to resolve R2-F1.

The earlier review's limits concerning architectural truth, general live-agent reliability, broad renderer stress testing, and remaining M3 migration work still apply. This round supplies focused evidence for the correction rather than a fresh review of every unchanged component.

Only this findings record is changed for return. Implementation, governing documents, task record and task status remain untouched.
