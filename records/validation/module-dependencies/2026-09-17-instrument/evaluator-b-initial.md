This evaluation uses only the seven captured views. Statements below describe what those views establish, not independently verified program behavior.

1. **Roots, shared children, and cycles**

   - Journey: `entry (module-aea97dd6)` is the displayed structural root. Its direct children are `left` and `right`. `shared (module-0a02841d)` has direct parents `left` and `forward`; it is reached transitively from `right` through `forward`, and from `entry` along two paths. `leaf` is a direct child of `shared`. No cycle is displayed.
   - Boundary: the `{a, b}` cycle grouping, `m0`, and `isolated` are displayed roots. `a` and `b` directly re-export each other. The grouping explicitly is not an entity. The visible chain runs `m0 → … → m7`, with descent pruned at `m6`; its remainder cannot be reconstructed from this capture.
   - Postcode: displayed roots are `process-probe`, `dependency-repository-probe`, `discovery-test`, `dependency-provider-probe`, `expansions-test`, `repository-test`, `inputs-test`, `dependencies-test`, `records-test`, `organization-test`, `repository-probe`, `cli-test`, `dependency-presentation-test`, `organization-cli-test`, `dependency-contract-test`, `cli (module-f576de7c)`, and `dependency-projections-test`. These labels establish no architectural role.
   - Postcode shows a cycle containing three distinct `records` modules: `module-2b23ed6d`, `module-a9b8523d`, and `module-b3cab524`. Explicit edges establish reciprocal type-only relationships between `b3cab524` and each of the other two. They do **not** show a direct relationship between `2b23ed6d` and `a9b8523d`.
   - Shared Postcode children include `identity`, `memory-store`, and `records (module-b3cab524)`. The dedicated parents view establishes 30 direct parents for that particular `records` module. Repeated “reference (already expanded)” entries preserve sharing without repeating expansion.

2. **Parent, child, direct, and transitive**

   The direction is explicit: a dependency parent depends directly on a dependency child. These are source-request relationships, not containment, ownership, execution order, or importance. The children view for `cli (module-61acf56d)` establishes 16 direct relationships. The parents view for `records (module-b3cab524)` identifies modules directly depending on it.

   Transitive relationships require following multiple edges. Journey `right → forward → shared` establishes transitively reaching `shared`, not a direct `right → shared` edge. Structural roots are not established entry points.

3. **“Re-exports only”**

   This is explicitly a syntax property. It does not establish a barrel, facade, API boundary, purity, safe collapse, or absence of transitive side effects. The inspect qualification says only comments and `EmptyStatement` syntax are ignored.

   Placement matters: `right → forward · re-exports only · static-import` appears to describe the target module’s syntax, while `forward → shared · re-export` describes the relationship mechanism. The distinction is inferable from the paired rows, but the shared separator makes it unnecessarily easy to misread “re-exports only” as an edge property.

4. **Organization classifications**

   The views explicitly attach `same-group`, `into-descendants`, `outward`, or `organization not established` to relationships. Reading these as relative repository-organization positions is reasonable; the captures do not define the grouping rules or the precise boundary of “outward.”

   These labels do not establish dependency policy, permitted layering, an architectural violation, or runtime direction. `into-descendants` is especially easy to confuse with transitive dependency descendants without a short legend. Organization materialization is partial in Postcode and Boundary, so unavailable classification cannot be treated as absence of organization.

5. **Display and analysis limits**

   - Postcode structure omits **1 module and 80 relationships**, despite no pruned descents. Later nodes retain nested module references but lose explicit edge rows and their classifications. That makes the overview visibly asymmetric; the dedicated children view recovers all 16 `cli` edges.
   - Boundary omits **2 modules and 2 relationships**, with **1 pruned descent**. The visible `m6 → m7` relationship does not establish what follows.
   - Journey and the dedicated parent/child captures report no display omissions.
   - Display bounds explicitly do not reduce analysis coverage. Conversely, full materialization and “completed” do not mean unrestricted recognition or runtime completeness.
   - “None in supported coverage” and “No recorded coverage outcomes; bounded recognition still applies” cannot establish that unsupported requests do not exist.
   - Nonliteral targets are not evaluated. Resolution outside the discovered population does not add modules.
   - Inspect reports two excluded generated-output locations and first-observed, memoized inputs rather than an atomic filesystem snapshot.
   - Inspect’s “1 module selected from 204” versus structure’s “60 modules” is unexplained in these views. A reader cannot safely reconcile those populations.
   - The generic inspect limitation appears even though the selected `cli` has no visible “re-exports only” status. Its placement beneath exports leaves unclear which positive syntax finding, if any, it qualifies.

6. **Opaque externals and CommonJS/runtime conclusions**

   `t (module-f8a7afe4)` is explicitly opaque external. Its children view reports zero established relationships but specifically rejects the conclusion that its child set is empty. Likewise, external targets such as `node:crypto` and `typescript` provide no interior dependency graph.

   CommonJS recognition is bounded to bare `require` with exactly one argument, complete lexical evidence, and affirmative captured context. Aliases, properties, and other APIs are excluded. Defined ESM format overrides ambient declarations; `preserve` needs callable ambient corroboration; missing module options do not imply compiler defaults.

   These captures establish source requests only: no value use, emitted code, loader availability, execution, bundling, deployment, or actual runtime side effects. Neither a type-only cycle nor an external target marked “re-exports only” justifies a runtime conclusion.

7. **Justified next investigation and precise navigation**

   Follow the explicitly pruned Boundary chain to establish the next direct relationships. Use the supplied children command, replacing `ENTITY_ID` with the already visible `m7` identifier:

   ```sh
   node /Users/ronen/postcode/app/_build/src/cli.js children \
     --snapshot snapshot:abb38f505069e34a17093403ea9bc69e7343ae3dbfb8b184f07ea58711a1feb4 \
     --project /Users/ronen/postcode/app/_dependency-presentation-validation/boundary-input/tsconfig.json \
     -- module-206dde09
   ```

   This is a proposed navigation step, not an executed investigation. It should reveal the established direct children of `m7` within the same captured analysis context, subject to the resulting view’s qualifications.

The most consequential wording issue is the Postcode cycle header’s `A ↔ B ↔ C` notation: it visually suggests pairwise direct relationships that its explicit edge rows do not establish. Other material friction is the undefined organization vocabulary, interleaving module and relationship badges, delayed global omission notices, unexplained population counts, and generic navigation placeholders requiring manual ID substitution. The explicit scope qualifications and the external-child warning otherwise make the central limitations recoverable.
