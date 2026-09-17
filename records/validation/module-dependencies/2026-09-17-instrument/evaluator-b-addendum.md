Addendum based only on `tsnode-structure.txt` and `tsnode-children.txt`:

- **Requests without edges are material evidence.** Structure reports 20 `outside-population`, 17 `unresolved`, and 13 `target-indeterminate` source-owned request results. They are not 50 additional established dependencies. The qualification supports interpreting `outside-population` as resolution outside the discovered module population, rather than failed resolution. `unresolved` does not establish runtime failure. `target-indeterminate`, together with the nonliteral-target qualification, indicates a target was not established; individual expressions and causes are unavailable.

- **The focused view makes the limits concrete.** `ts-error (module-e144eeff)` has 19 established direct relationships plus 12 request results without edges: 10 outside-population, one unresolved CommonJS request, and one target-indeterminate CommonJS request. The ten outside-population results comprise four static imports, three import-types, and three CommonJS requests. Six are explicitly type-only. These outcomes must remain distinct from established children.

- **Recognition outcomes are a different category.** Structure reports 44 `ownership-unestablished` outcomes under an explicit “not recognized occurrences” heading. I cannot count these as recognized requests, unresolved dependencies, or runtime calls. The exact ownership criterion and reasons are not explained. The focused view reports no recorded coverage outcomes for the selected module, while retaining bounded recognition; that does not establish unrestricted coverage.

- **CommonJS recognition does not establish runtime behavior.** The qualifications explicitly restrict recognition to bare, single-argument `require`, complete lexical evidence, and affirmative captured context. Aliases, properties, and other APIs are excluded. ESM format overrides ambient declarations; `preserve` requires callable ambient corroboration; absent module options do not imply defaults. Relationships carrying both `commonjs` and `static-import` show multiple source mechanisms for the same module pair, not execution frequency or multiple runtime loads. No source-request result establishes emitted code, actual loading, execution, or deployment success.

- **Display limits substantially affect the overview.** Structure reports one omitted module, 63 omitted relationships, 50 summarized/omitted request results, and 24 summarized/omitted recognition outcomes; no descents are pruned. The selected children view reports zero omissions. Full materialization and completed analysis describe the bounded analysis, not a complete runtime graph. The global recognition total of 44 versus an omission count of 24 is hard to reconcile from a display containing only the category total: no individual outcomes are visible. “Summarized/omitted” also combines two meaningfully different presentation states.

- **Organization remains descriptive and partial.** Both captures explicitly report partial organization materialization. `same-group`, `into-descendants`, and `outward` do not establish an architectural policy or violation; `organization not established` is unknown context, not a policy failure. Opaque external targets supply no evidence about their interiors or absence of children.

The qualifications support these restrained interpretations, but request rows lack target text, occurrence identifiers, and source locations. Even the focused view’s zero-omission claim therefore does not make the twelve outcomes individually investigable. Repeated identical rows are especially difficult to distinguish. This is presentation friction, not evidence that the analysis is incorrect.

A justified next step is to request a captured **parents** view for `ts-error`, to identify direct incoming relationships within its displayed cycle grouping. This avoids reading the grouping’s `↔` sequence as pairwise direct edges. The supplied navigation gives:

```sh
node /Users/ronen/postcode/app/_build/src/cli.js parents \
  --snapshot snapshot:1ba429928ddc2ccc772cb7a76ca5cc16e06d943010ccd4435043f193560873fe \
  --project /Users/ronen/postcode/app/_dependency-contract-investigation/ts-node/tsconfig.postcode-validation.json \
  -- module-e144eeff
```

This is proposed navigation only; I did not execute it or inspect source code.
