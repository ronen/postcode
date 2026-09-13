# Initial module inventory: final integrated independent-review handoff

Status: independent review returned; findings dispositioned
Prepared: 2026-09-13
Review target: `fee76353d011f93f0cf1f7bd377c94e96c4fe4c8`
Last implementation commit: `a2e7bb30d1215717ab609d96c3eb0394efd31cb8`
Feature branch: `codex/initial-module-inventory`
Base main commit: `4a8914c823c6e9856f0aa02cf7704f6830348de8`
Task-opening commit: `58971db`

The requested independent review of the **complete branch change** has returned.
Its [original findings](2026-09-13-module-inventory-final-findings.md) are preserved
unchanged. The [disposition](2026-09-13-module-inventory-final-disposition.md)
distinguishes the reviewed target from the subsequent tested selector correction.
The remaining sections preserve the review request and its verification context.

## Governing context and scope

Read [AGENTS.md](../../AGENTS.md), the
[task protocol](../../foundation/task-protocol.md),
[product design](../../foundation/product-design.md),
[baseline conventions](../../foundation/baseline-conventions.md),
[development conventions](../../dev/conventions.md), and
[workflow](../../dev/workflow.md). Review against the full
[approved plan](../../docs/plans/initial-module-inventory-plan.md) and accepted
[module-inventory](../../docs/decisions/initial-module-inventory-decisions.md),
[projection](../../docs/decisions/initial-projection-architecture-decisions.md), and
[observation](../../docs/decisions/initial-observation-recording-decisions.md)
decisions. The [active task and follow-ups](../tasks/2026-09-12-initial-module-inventory.md)
record authorization and subsequent human direction.

The result is a local TypeScript development CLI for one configured project,
module inventory and exact inspection, qualified export/documentation expansions,
Unicode/experimental JSON, explicit source detail and local observation batches.
It is not a summary, dependency/call lens, persistent cache, cross-revision identity
system, GUI, arbitrary source browser or general lazy-evaluation framework.

The [architecture overview](../../docs/architecture/README.md) explains the current
boundaries; [README](../../README.md) and the
[CLI reference](../../docs/cli-reference.md) describe supported use.

## Important human refinements

The approved task delegates ordinary CLI/layout choices. Later human reviews
explicitly requested basename-derived recognition handles, collision-checked
compact Entity IDs, snapshot-scoped handle/ID selection, usable inspection commands,
compact inventory, and source hierarchy/excerpts. Keep these refinements in view
when comparing the original plan with current behavior:

- Normal views retain honest TypeScript names or anonymity. Basenames can inform
  generated handles without becoming conceptual names or responsibility claims;
  handle provenance remains explicit.
- Generated commands contain the explicit invocation/configuration paths needed
  to run the command. These operational paths are distinct from discovered source
  evidence. Actual declaration paths and syntax require source detail.
- Unicode collapses external entries and bounds export/documentation display while
  preserving qualifications. JSON lists all selected modules with bounded related
  detail. Materialization remains separate from omissions.
- Source detail groups supporting evidence by module/export, distinguishes
  forwarding from semantic definitions, and enlarges narrow compiler spans to
  enclosing declaration syntax when needed. It uses captured input, bounded
  excerpts and truthful ranges; file associations have no full-file excerpt.
- The final correction makes `presentation.expansions` a unique list of kinds;
  per-module execution/materialization remains in qualified evaluation records.

The human's [conditional presentation approval](2026-09-13-presentation-approval.md)
is satisfied: all tests pass and regenerated JSON contains exactly
`["exports", "documentation"]`. Do not require another presentation approval
round for unchanged approved behavior. Substantive correctness issues found by
this independent implementation review still require disposition.

## Requested review focus

1. **Plan coverage and boundaries.** Assess the integrated records/store/evaluation/
   language/projection/presentation/observation path against the complete plan.
   Check that rendering reads materialized records, record batches preserve their
   reference and immutability invariants, and no required capability is hidden
   behind an incomplete intermediate milestone.
2. **TypeScript semantics and qualifications.** Review the stated external-module
   SourceFile plus visible named-ambient population, configuration/resolution,
   effective export and alias/type-only/wildcard/export-assignment behavior,
   merged symbols/overloads, and compiler-associated documentation. Unresolved
   paths, syntax diagnostics, empty sets and failed/unavailable states must not
   be strengthened into unsupported conclusions.
3. **Identity and exact selection.** Check captured positive/negative inputs,
   environment/method versions, deterministic output, complete-population compact
   ID collision handling, zero/one/many selection and stale-snapshot rejection.
   Handles need not be unique, and no successor continuity is inferred.
4. **Conceptual/source boundary.** Check the authorized operational-command and
   mnemonic distinctions, explicit source scope, enclosing-syntax excerpts,
   evidence-role grouping, per-assertion height/character/tag omissions and
   single-view epistemological qualification. Confirm the unique expansion list
   does not suppress qualified per-module outcomes.
5. **Observation and exclusion.** Check self-contained invocation batches and UUID
   references, exact rendered artifacts, source-escape level, private local sink,
   visible delivery failures, and output exclusions through configuration, roots,
   imports, directories, symlinks and nested project selection. No remote sink or
   historical producer reads are implemented.
6. **Evidence and remaining risk.** Assess tests and real-project/clean-agent
   validation as evidence, including their stated limitations. Identify missing
   necessary verification, misleading claims or material discrepancies in current
   documentation. Historical review samples are not claims about final behavior.

## Verification already performed

Environment: Node `22.13.1`, npm `11.17.0`, pinned TypeScript `6.0.3`,
`@types/node` `22.20.2`. All **51 tests** and `npm run check` pass at the last
implementation commit. Full branch whitespace checks pass. No generated output,
real-project observations, dependency cache, third-party checkout, or foundation
changes are included in the branch diff.

| Area | Evidence |
| --- | --- |
| Population/configuration, diagnostics, changed inputs and deterministic identity | `test/discovery.test.ts`, population/empty/diagnostic fixtures |
| Effective exports, aliases, roles, merging, docs and expansion-kind uniqueness | `test/expansions.test.ts`, export fixtures |
| Immutable store, reference validation, state distinctions and ID collisions | `test/records.test.ts` |
| CLI processes, selection, source boundary, layout/bounds, commands, observations and output exclusions | `test/cli.test.ts` |
| Self-analysis | 174 modules, 18 listed/156 collapsed; 349 full evaluation scopes; final JSON has two unique expansion kinds |
| Approved unfamiliar repository | [p-queue validation](../validation/2026-09-13-p-queue.md): pinned revision `180ab9e25cd10b6f548767d7176076b50d25e188`, seven modules, five project modules, exact export sets checked; final recheck preserves all six entry exports |
| Clean-agent exercise | [Validation record](../validation/2026-09-13-module-inventory-validation.md), [questions](../validation/initial-module-inventory-questions.md): two completed isolated responses to the original view, retained with conditions and failed initial attempts |
| Human presentation evaluation | Six returned reviews and implemented dispositions, then [explicit conditional approval satisfied](2026-09-13-presentation-approval.md) |
| Early independent architecture checkpoint | [Handoff/dispositions](2026-09-12-module-inventory-core.md), [returned findings](2026-09-13-module-inventory-core-findings.md); no blocking findings, all dispositions addressed |

The clean agents evaluated the original input, not the final presentation. Their
responses motivated corrections but are not independent implementation review or
proof of final comprehension quality. The eager provider's uncommon unavailable/
failed/stopped states are covered by clearly identified synthetic provider cases;
those captures do not claim production failures. Input consistency is explicitly
first-observed and non-atomic. No unrelated target semantic/build/test execution
was used to claim analysis correctness.

Final artifacts and hashes are identified in the approval record. They are local,
ignored evidence under `_observations/validation/2026-09-13/`; they are not required
repository dependencies. If unavailable to the reviewer, use durable summaries
and report which raw evidence could not be inspected rather than claiming it was
reproduced. The p-queue checkout and installed dependencies remain outside Git.

## Suggested reproduction

Use the review target (or later metadata-only handoff commit) and installed pinned
dependencies. `npm ci` installs them when needed. From the checkout:

```sh
npm test
npm run check
node _build/src/cli.js modules --project fixtures/exports/tsconfig.json
node _build/src/cli.js modules --project fixtures/exports/tsconfig.json --json
```

Use a displayed handle or compact ID plus the generated command's full snapshot
to inspect a module. The `chain` handle in the export fixture exercises forwarding
and mixed documentation; add `--source-detail` to inspect its supporting syntax.
The empty fixture and unresolved-export tests distinguish established emptiness
from missing analysis. CLI output creates private local observation batches.
Snapshot values vary with checkout/environment/input changes; do not expect the
implementer's exact IDs in another checkout.

## Review return and exit gate

Return prioritized findings with file/line references, the violated requirement
or concrete risk, reproduction/reasoning and suggested correction where useful.
Distinguish blockers from nonblocking suggestions and explicitly state whether
any finding prevents task closure. List verification reproduced and not performed.

The human arranged the independent review and returned its findings. Both notes
are resolved as recorded in the disposition; no proposed residual review concern
remains. The independent-review gate is satisfied separately from the already
completed presentation approval. See the task record for closure.
