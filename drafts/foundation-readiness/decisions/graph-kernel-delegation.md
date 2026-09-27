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
- Adopt a larger graph framework: no demonstrated need for its broader concepts or lifecycle.
- Treat the package as a universal domain graph: would conflate graph topology with evidence and qualification.

## Consequences and verification

Test isolates, unknown/root nodes, self-loops, deep chains, cycles, incremental updates, multi-parent diamonds, parallel supporting claims and deterministic ordering against independent expected results. Compare full qualified outputs after the intentional identity correction establishes its new baseline.

Verify each chosen operation against the same semantic and scale requirements, whether delegated or local. An operation-level exception does not reopen library selection. If the combined evidence undermines the overall adoption rationale, report that material finding for reconsideration rather than silently replacing the selected library or building a parallel generic graph framework. No graph database, all-pairs cache, or future correction traversal is introduced by this decision. Existing dependency and organization decisions retain their domain meanings; this decision specializes implementation ownership without superseding them.
