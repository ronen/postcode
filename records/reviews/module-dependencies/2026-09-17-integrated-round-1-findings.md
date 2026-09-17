# Module dependencies integrated review: round 1 findings

Record type: findings
Received: 2026-09-17
Reviewer: Independent Claude Code review session (no prior involvement in this implementation)
Handoff: [Integrated handoff](2026-09-17-integrated-handoff.md)
Round: 1
Reviewed target: `93d6d7d52bc3715276014a85f197db5e7f8a72b8`

## Returned findings

### Review method

Read the handoff and `dev/review.md` in full, then the complete governing set it
cites: the [module-dependencies plan](../../../docs/plans/module-dependencies-plan.md),
[core concepts](../../../docs/core-concepts.md),
[architectural constraints](../../../docs/architectural-constraints.md),
[implementation conventions](../../../docs/implementation-conventions.md), the five
decision records (module dependency structure, bounded CommonJS source evidence,
module composition property, dependency/organization integration, subject-kind
standard expansion), the active [task record](../../tasks/2026-09-16-module-dependencies.md)
and all three prior review dispositions (provider-contract, provider-integration,
graph/expansions) to establish what earlier rounds already verified and corrected,
and the [integrated instrument report](../../validation/module-dependencies/2026-09-17-integrated-instrument.md)
and its cited [final recognition contract](../../validation/module-dependencies/2026-09-16-final-recognition-contract.md).

Confirmed the handoff's own commit (`d98c4a3`) adds only the handoff file on top of
the stated target `93d6d7d`, so the reviewed diff is exactly baseline
`8dac095`..`93d6d7d` (127 files, ~16.6k insertions).

Read the complete non-fixture, non-generated-capture diff file by file rather than
sampling: `src/lib/typescript/{dependencies,commonjs,composition,project}.ts`,
`src/lib/dependencies/{records,evaluate,graph,organization,projections,presentation}.ts`,
`src/lib/composition-view.ts`, `src/lib/cli.ts`, `src/lib/{records,presentation,
evaluation,identity,memory-store,observations}.ts`, and the organization-side changes
in `src/lib/organization/{evaluate,placement,presentation,projections,records}.ts`.
For each, traced specific behavior against the governing decision rather than
trusting the handoff's prose summary of it:

- Line-by-line comparison of `commonjs.ts`'s ordered checks against the approved
  [ordered rule](../../validation/module-dependencies/2026-09-16-final-recognition-contract.md#ordered-rule)
  and its exact completed-lexical-analysis protocol (ownership/shape done by the
  caller; SourceFile identity/no-syntax-diagnostic/no-`WithStatement`/root-reaches-
  file checks; the `resolveName` anchor climbing only enclosing `CallExpression`s;
  per-file format precedence over configured `module`, with `Preserve` deferred to
  the declaration-threshold step; the ambient-declaration contribution matrix
  producing `implementation`/`callable`/`noncallable`/`insufficient`; and the final
  threshold combining format and contributions into the same outcome table rows).
  Found the implementation matches the approved contract exactly, including the
  `preserve`-without-corroboration and absent-declaration-permits-CommonJS-context
  branches that earlier review rounds specifically scrutinized.
- The exhaustive `re-exports only` rule in `composition.ts` against the composition
  decision, including comments/`EmptyStatement`, merged multi-file ambient-module
  declarations, and diagnostic-qualified partial materialization.
- SCC/root derivation in `graph.ts` (iterative Kosaraju, isolated-module inclusion,
  cyclic flag, `rootsEstablished` gating) against the "derive graph structure"
  decision.
- Lens population/edge/non-edge/coverage filtering in `projections.ts` against the
  three-lens decision, specifically the asymmetry that `dependency-parents` empties
  both `nonEdgeRequests` and `coverage` while `dependency-structure`/`-children`
  populate them, against the human's approved parent-disclosure contract recorded
  in the task follow-ups.
- Occurrence-narrowed vs. module-placement-fallback endpoint classification and the
  same/into-descendants/outward/varies derivation in `organization.ts` against the
  organization-integration decision's exact classification predicates.
- Presentation bounds and omission accounting in `dependencies/presentation.ts`
  (component/edge/occurrence/request/coverage/source-detail caps and their
  `omitted*` counters) and the CLI's option-combination validation, navigation
  command construction, and `--dependency-context` wiring in `cli.ts`.
- The `ModuleFacet`→`ModuleDiscoveryFacet`/`facets`→`discoveryFacets` rename for
  completeness (`grep` across `src/`, `test/`, `docs/` found no leftover bare
  `facets` field or `ModuleFacet` type reference outside historical decision/plan
  prose, which is correctly preserved as history).
- `memory-store.ts`'s new atomic invariants: dependency-occurrence/coverage/
  relationship/organization-claim shape and cross-reference checks, the
  whole-edge type-only/mechanism-union recomputation check, the organization
  claim's occurrence-completeness-with-subject requirement, and the
  established-status/non-null-classification biconditional.
- `docs/architecture/README.md` and `docs/cli-reference.md` additions against the
  actual behavior exercised below.

### Verification performed

- `npm run check` — passes, no errors, at the exact reviewed target.
- `npm test` — all **188/188** tests pass, matching the handoff's claim.
- Live CLI reproduction of the plan's six-module representative journey using the
  committed `fixtures/dependency-journey/tsconfig.json`:
  - `dependencies --project fixtures/dependency-journey/tsconfig.json` reproduces
    the described root (`entry`), two branches (`left`, `right`), one shared child
    with two direct parents (`shared`, reached from `left` and from the re-export
    intermediary `forward`), and correct `same-group`/`outward` organization labels.
  - `parents -- module-0a02841d` (the shared module) shows exactly the two incoming
    relationships, the "cannot be attributed to the selected module" parent-view
    disclosure text, and no fabricated coverage/non-edge rows.
  - `children -- module-0a02841d` shows exactly the one outgoing relationship to
    `leaf`.
  - `inspect --dependency-context -- module-aee44b7a` (the re-export intermediary)
    shows the `re-exports only` composition annotation consistently with the
    dependency view.
  - A deliberately wrong `--snapshot` value against `parents` correctly produces
    `0 exact match(es) · snapshot-mismatch` rather than a silent match.
- Live CLI self-analysis on PostCode's own `tsconfig.json` (`dependencies --project
  tsconfig.json` and `--json`) independently reproduced the integrated instrument
  report's published numbers exactly: 60 modules in projection (48 project + 12
  opaque), 280 relationships, 1 omitted module and 80 omitted relationships at the
  Unicode bound, 17 root components, and exactly 1 cyclic project SCC. This is a
  fresh reproduction from this review session, not a reading of the retained
  capture, and it matches.
- Spot-checked `test/dependency-projections.test.ts`'s composition fixture by hand:
  confirmed `export {} from './target'` is deliberately treated as a supported
  zero-element re-export-from (module `positive` stays positive), while bare
  `export {};` (no specifier), local declarations, imports, `export =`, and
  diagnostic-bearing files are all correctly excluded from the positive set, and
  the two-file merged-ambient-module aggregation (`merged` positive, `mixed` not,
  because one of its two declaring files contributes a local `const`) behaves as
  asserted.
- Confirmed the atomicity tests (`store rejects unsupported relationship edges and
  false whole-edge qualifications atomically`, `store rejects invalid component
  indices and missing organization occurrence support atomically`) actually verify
  atomicity: each `assert.throws` on `store.put` is paired with a following
  `store.get` on the same id throwing "Missing program record", confirming the
  rejected batch left no partial record behind.
- `git status --short` after all of the above confirms this review made no
  tracked-file changes other than this findings record.

### Actionable findings

None. No correctness, decision-conformance, qualification-boundary, or atomicity
defect was found in the reviewed scope, and no defect was reproduced against the
governing plan, decisions, core concepts, or architectural constraints.

### Non-defect observations

- In `dependencies/projections.ts`, the `coverage` filter for the
  `dependency-structure` lens is unconditional (`lens === 'dependency-structure' ||
  ...`), while the parallel `occurrences`/`nonEdgeRequests` filtering for that same
  lens is scoped to project-owned subjects. I traced whether this could leak
  coverage results from outside the project population into the project view. It
  cannot in practice: `prepareDependencies`'s syntax walk only visits
  `program.getSourceFiles()` filtered to `!isSourceFileFromExternalLibrary`, so a
  top-level owner resolved through `byFile` is always a `project`-faceted module;
  and a named-ambient-module owner resolved through `bySymbol` is built from that
  same symbol's own `getDeclarations()`, which necessarily includes the local block
  that produced the match, so it always contributes `project` to that candidate's
  facets. The only coverage rows this filter can add beyond what the narrower
  `dependency-children` filter would have shown are `ownership-unestablished`
  (owner `null`, which cannot be scoped to a population by definition) and, in a
  scenario I could not construct or confirm, a same-named-but-distinct-symbol
  edge case for `external-owner`. Not a defect; recorded because the asymmetry
  with the occurrence filter is easy to misread as unscoped.
- `composition.ts` treats `export {} from './target'` as a supported (zero-element)
  direct re-export for the `re-exports only` rule. The plan's exclusion list names
  "local export lists, and `export {}`" as statements that prevent the claim; read
  narrowly, that phrase is about the bare, specifier-less `export {};` module
  marker (confirmed excluded — `empty.ts` in the composition test is not positive),
  not the `export ... from` variant with an empty named list. The implementation's
  reading — gate on `moduleSpecifier !== undefined` alone — is coherent, deliberately
  encoded, and exercised by a dedicated test assertion (`positive.ts` including this
  exact form stays positive). Flagging only because the plan text does not spell out
  this specific sub-case and a future reader could reach the opposite conclusion
  from the same sentence; not a defect in the current, tested behavior.
- This round is the first correctness review of `cli.ts`, the dependency
  presentation/rendering layer, `composition-view.ts`, the organization-side
  composition wiring, and `memory-store.ts`'s new invariants — the graph/expansions
  round covered the library layer up to and including `organization.ts`'s
  classification logic, and the provider-contract/provider-integration rounds
  covered the TypeScript integration, but CLI/presentation/navigation/observation
  had previously received only clean-evaluator comprehension checks, not an
  implementation review. It held up under this round's inspection and live
  reproduction; recorded so the gate record reflects that this was new ground, not
  a re-confirmation of already-reviewed code.

### Unverified areas and residual limits

- Did not re-run the adapted ts-node checkout validation: this environment has no
  network access to fetch the external `TypeStrong/ts-node` revision, so the
  ts-node-specific numbers in the integrated instrument report (64 project modules,
  30 opaque endpoints, 263 relationships, 30 root components, three project SCCs,
  the 21-call production provider probe) were read and cross-checked for internal
  consistency and consistency with the approved recognition contract, but not
  independently reproduced from a fresh checkout in this session. The PostCode
  self-analysis numbers were independently reproduced (see above), which
  corroborates the same code path the ts-node run exercises.
- Did not reconstruct the exceptional boundary fixture (root cycle, isolated
  module, opaque external endpoint, pruned chain) described in the instrument
  report, since it is deliberately not committed to the repository (ephemeral, as
  the report states). Relied instead on the corresponding committed unit-test
  coverage in `test/dependency-projections.test.ts` and
  `test/dependency-presentation.test.ts` (cycle grouping, isolated modules, opaque
  leaves, component bounds), all of which pass, plus manual review of the rendering
  code that produces the cycle-member-list/pruned-descent wording the report
  describes.
- Did not independently re-measure fresh-invocation latency; the reported
  39–42 second PostCode timings and the unexplained ts-node outlier are cost
  observations rather than correctness claims, and the plan explicitly does not
  require a latency bound.
- Did not re-derive every one of the 188 tests by hand; read all dependency-related
  test files for coverage shape and spot-checked representative assertions per
  focus area (CommonJS contract rows, composition edge cases, graph/cycle
  structure, organization classification, parent-view disclosure, atomicity),
  rather than manually recomputing each of the ~1,900 lines of test code.
- Did not review the two clean-evaluator protocol transcripts
  (`2026-09-17-instrument/evaluator-{a,b}-*.md`) themselves; the instrument report's
  summary of their feedback and disposition was read and is consistent with what
  the presentation code now does (comma-separated cycle members, explicit
  same-group/descendant/outward/varies vocabulary, separated composition/mechanism
  badges, numbered request/coverage rows, explicit fresh-navigation wording), but
  the underlying transcripts were not independently re-read line by line.

### Recommendation

The reviewed target (`93d6d7d52bc3715276014a85f197db5e7f8a72b8`) is sound. Type
checking and the full test suite pass; the CommonJS recognizer, composition rule,
graph/SCC derivation, three-lens projection scoping, organization classification,
CLI option handling, and the store's new atomic invariants each conform to their
governing decisions on direct inspection; and live reproduction of both the
committed representative journey and PostCode's own self-analysis matches the
integrated instrument report's published structural numbers exactly. I found no
actionable defects and no contradiction between the implementation and the
approved plan, decisions, core concepts, or architectural constraints.

I recommend the human treat this round as satisfying the final integrated review
gate, subject to the two non-defect observations above (neither is a correctness
defect; both are candidates for a short clarifying comment or documentation note if
this area is touched again) and to the disclosed residual limits (principally, that
the ts-node-specific numbers were cross-checked for consistency but not
independently reproduced from a fresh external checkout in this session).
