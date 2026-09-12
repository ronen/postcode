# Module inventory core: independent-review handoff

Status: reviewed; no blocking findings
Prepared: 2026-09-12
Reviewed implementation commit: `da8e7224395b9ac58361339bdc485c14640ad473`
Feature branch: `codex/initial-module-inventory`
Base main commit: `4a8914c`
Task-opening commit: `58971db`

This is the required early architectural checkpoint for the active
[initial module inventory task](../tasks/2026-09-12-initial-module-inventory.md).
The implementing agent has performed local verification, not independent review.
Please arrange an independent reviewer and return their findings before extensive
implementation continues. This checkpoint does not replace final integrated review.

## Governing material

Read [AGENTS.md](../../AGENTS.md), the
[task protocol](../../foundation/task-protocol.md),
[product design](../../foundation/product-design.md),
[development workflow](../../dev/workflow.md), and
[conventions](../../dev/conventions.md).
Review against the full [approved plan](../../docs/plans/initial-module-inventory-plan.md)
and its accepted decisions:

- [Module inventory](../../docs/decisions/initial-module-inventory-decisions.md)
- [Projection architecture](../../docs/decisions/initial-projection-architecture-decisions.md)
- [Observation recording](../../docs/decisions/initial-observation-recording-decisions.md)

The [architecture overview](../../docs/architecture/README.md) describes the
implemented checkpoint and the responsibilities that remain to be integrated.
No accepted decision or foundation document has been changed.

## Implemented checkpoint

The branch contains the opening record before implementation, a pinned
TypeScript/Node build and test scaffold, configured project opening, external
SourceFile and named ambient-module discovery, deterministic logical identity,
qualified addressable records, an ephemeral `ProgramRecordStore`, immutable
evaluation attempts, and stored inventory/exact-selection inspection projections.

The integration follows TypeScript's configured classification; under NodeNext,
package configuration can make a file an external module even without written
imports/exports. The global-script fixture explicitly uses legacy detection.
SourceFile compiler path names stay in evidence and do not become conceptual names.
Generated handles are snapshot-scoped navigation aids.

All compiler nodes and symbols remain inside the TypeScript integration. Lenses
read materialized records. Source evidence is separate from module claims and
conceptual qualifications. Expected project-open failures, successful discovery
with syntax diagnostics, fully established emptiness, and unavailable or failed
evaluation states have separate representations.

## Requested review focus

1. Whether the concrete record model, immutable store operations, evaluation
   boundary, and projection construction preserve the accepted distinctions and
   provide a sound base for exports/documentation and presentation requirements.
   Assess any premature abstractions or missing invariants before more code uses them.
2. Whether module discovery honors the complete stated TypeScript population,
   configured resolution identity, ambient merging, root provenance, honest naming,
   and distinctions between operational failure and qualifying diagnostics.
3. Whether snapshot inputs and method versions are sufficient for the claims
   currently made. Examine inherited config, dependencies, absent resolution
   candidates, source contents, environment context, repeated attempts, and stale
   references. No durable cache or cross-snapshot continuity is claimed.
4. Whether explicit generated-output exclusion is enforced through roots, imports,
   directory queries and symlink targets, and whether its caller contract can
   reliably support the selected local observation destination. No sink exists yet.
5. Whether qualifications remain usable with empty, unavailable and partial
   results, with only relevant outcomes and selected module context projected.
   Review the tests as evidence, not as a replacement for checking the contract.

Return prioritized findings with file/line references, governing requirements,
reproduction or concrete reasoning, and suggested correction where useful.
Distinguish checkpoint defects from capabilities intentionally awaiting the next
milestone. State whether any finding should prevent building on this core.

## Verification at the reviewed commit

Environment: macOS, Node.js `22.13.1`, npm `11.17.0`, TypeScript `6.0.3`.

```sh
npm ci
npm test
npm run check
git diff 4a8914c..da8e722 --check
```

`npm test`: 19/19 passed. `npm run check`: passed. Diff whitespace checks passed.
The installation used the committed lockfile dependencies with install scripts
disabled. `npm ci` above is the clean reproduction command, not an additional
claimed clean-install test.

Coverage includes exact six-module fixture membership, inherited configuration,
transitive discovery and repeated imports, allowed JavaScript, declaration modules,
merged named ambient modules, automatic module detection, excluded global scripts,
empty population, malformed/inherited/unusable configuration, missing root files,
encountered syntax diagnostics without unrelated semantic checking, exact zero/one/
multiple selection, immutable and atomic store behavior, separate evaluation
attempts, and coexistence of snapshots without inferred successors.

Separate-process checks compare the complete test-harness structured result for
equivalent inputs. A second check modifies a method version in an isolated copy of
the built harness and verifies a changed snapshot. Additional tests change source,
inherited options, package metadata, and a previously absent resolution target.
Generated-output tests add and change TypeScript/JSON files under an excluded sink
location, including an import and a symlink, and verify evidence/snapshot exclusion.
Custom absolute output locations are also tested.

The test inputs and assertions are committed. Temporary fixture projects and the
method-version test copy are removed by the tests. Build output, dependency caches,
and the selected future observation directory are Git-ignored. No observations
from real projects or third-party repository contents are committed.

## Work remaining within the same task

This is intentionally an early core checkpoint. There is no user-facing CLI,
Unicode/JSON presentation, standard expansion policy, export/symbol analysis,
documentation assertion analysis, explicit source-detail presentation, or
observation producer/sink implementation yet. Finer written resolution-occurrence
evidence and the remaining semantic fixtures must accompany those additions.
No full-slice success or product usefulness is claimed.

After returned checkpoint findings are resolved, continue the complete approved
slice. Outstanding validation includes final CLI process determinism and sink
failure/privacy checks, PostCode CLI self-analysis, a human-approved unfamiliar
repository, human Unicode-output inspection, retained clean-agent question/answer
evidence, final-diff review, and final independent integrated review. Do not close
the task before those obligations and returned findings are addressed or the human
explicitly accepts a revision of the effective goal.

## Review result and disposition

Received 2026-09-13: the human supplied an independent review by Claude of the
specified implementation commit. The [complete returned findings](2026-09-13-module-inventory-core-findings.md)
are retained separately. The reviewer reproduced all verification commands,
reported no blocking findings, and concluded that further implementation can proceed.
The human delegated disposition of the nonblocking findings to the implementer.

1. **Single selector:** retain one exact referent. The approved plan explicitly
   defers list-selector syntax; plural subjects describes zero/one/multiple matches.
   The implementation selection is now explicit in development conventions.
2. **Ambient declarations in ordinary `.ts`:** addressed with a characterization
   test and declaration-only facet derivation from the ambient modifier, not just
   the containing filename. Discovery method version advanced.
3. **File-less diagnostics:** addressed by limiting these to project-wide context;
   ordinary file-associated syntax diagnostics still qualify affected modules.
4. **Claim union:** accepted as an integration note. Export and documentation
   records will add distinct variants when implemented, preserving module claims.
5. **Actual output destination:** accepted as an integration obligation. The CLI
   must pass its actual checkout observation/build paths explicitly, with a nested
   configuration regression check. The existing caller boundary remains suitable.

The first checkpoint is cleared. Final independent integrated review remains
required; this result does not establish completion of the full task.
