# Graph kernel delegation

Status: in review
Decided:
Arising from: [Foundation readiness](../plans/foundation-readiness.md)
Scope: existing directed-graph algorithms for dependency components and organization containment

## Context

PostCode owns several generic graph mechanisms: strongly connected components, cycle prevention during deterministic containment-link acceptance, multi-parent ancestry, and upward closure. Their results carry PostCode-specific evidence, qualification and ordering. The [paired library audits and supplementary reviews](../../records/audits/2026-09-27-foundation-readiness/README.md) establish concrete current uses for a library; adoption does not depend on speculative investigation features.

The audits establish that external graph delegation is worthwhile, and Stately is the selected library. Operation-level implementation choices remain subject to the exception rule below; they do not require repeating the overall adoption analysis.

## Decision

For each existing generic graph operation—SCC, containment cycle checks, ancestry and upward closure—adopt `@statelyai/graph` unless a local implementation is demonstrably simpler to maintain, preserves required semantics more directly, or avoids a demonstrated performance problem. Judge simplicity across the adapter and its callers, not by comparing isolated line counts. Existing code and migration effort alone do not justify an exception.

Keep library imports, types, mutation and graph lifetime behind a narrow application-owned adapter. Expose only the operations required by current callers, using PostCode-owned inputs and results. Record a brief rationale and relevant verification for each operation retained locally. These are implementation choices within this decision, not separate adoption approval gates.

PostCode retains population selection, deterministic edge acceptance and output sorting, self-loop classification, incomplete-root qualification, display traversal, and every supporting relationship or claim. Traversal-tree edges are insufficient evidence when parallel claims or multiple parents exist.

Encode the empty repository-root identifier at the adapter boundary. Use sanctioned mutation operations and membership-checked traversal with explicit direction. Use the assessed DFS approach for reachability; avoid path enumeration and the assessed `hasPath` queue cost. Choose and pin the verified release and lockfile during implementation, checking dependency and license terms against the audited evidence.

## Rationale

The adapter centralizes package-specific representation and mutation requirements while delegating algorithms. This reduces maintained responsibilities even if immediate line-count savings are small. The library's youth is a maintenance risk, balanced by its audited design, concrete semantic fit, and contract tests of the actual APIs used.

## Alternatives considered

- Retain bespoke algorithms: viable but leaves several independently maintained generic traversals and their proof obligations in PostCode.
- `@dagrejs/graphlib` 4.0.5: established, but the audited recursive SCC implementation overflowed the stack on the deep-graph probes, weakening existing depth robustness.
- `graphology` 0.26.0 with `graphology-components` 1.5.4: its audited SCC implementation had the same recursive-depth problem despite iterative helpers elsewhere in the ecosystem.
- `cytoscape` 3.34.3: a substantially broader framework whose audited headless SCC implementation also failed the depth probes.
- `strongly-connected-components` 1.0.1: passed the depth probes and remains a credible focused SCC alternative, but does not cover the other current traversal responsibilities; its dormant maintenance and local typing requirement also favor Stately for the combined use.
- Treat the package as a universal domain graph: would conflate graph topology with evidence and qualification.

The [archived library comparison](../../records/audits/2026-09-27-foundation-readiness/library-reuse/codex/graph-library-research.md) records the tested releases and probe conditions. These are selection-time findings, not claims about every release or a universal failure depth.

## Consequences

Delegated and local operations remain subject to the same semantic and scale requirements. An operation-level exception does not reopen library selection. If every operation would remain local, do not install an unused library or describe the work as library adoption. If the combined evidence undermines the overall adoption rationale, report that material finding for reconsideration rather than silently replacing the selected library or building a parallel generic graph framework. No graph database, all-pairs cache, or future correction traversal is introduced by this decision. The [derived dependency-graph boundary](module-dependency-structure-decisions.md#derive-graph-structure-without-making-a-graph-the-canonical-store), [qualified group and placement relationships](repository-organization-decisions.md#represent-groups-and-placement-with-qualified-identities-and-relationships), and [conservative organization classification](dependency-organization-integration-decisions.md#classify-organization-relationships-conservatively-from-occurrence-evidence) retain their meanings. This decision specializes implementation ownership without superseding them.
