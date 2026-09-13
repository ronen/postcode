# Module inventory continuation: fifth Copilot disposition and handoff

Date: 2026-09-13
Status: corrections verified; awaiting human-arranged Copilot rereview
Correction/review target: `8199cca85bf837ed6a61f9bf8a3bdfbf13c36e70`
Reviewed predecessor: `8cc68d545611772451d24131ae7c3612308cdab3`
Pull request: [#1](https://github.com/ronen/postcode/pull/1)
Task: [active continuation](../tasks/2026-09-13-module-inventory-review-continuation.md)
Previous handoff: [fourth Copilot dispositions](2026-09-13-module-inventory-continuation-round-4.md)

## Review and dispositions

Paginated GitHub CLI retrieval returned five reviews, nine inline comments overall
and no conversation comments. [Review 5191721749](https://github.com/ronen/postcode/pull/1#pullrequestreview-5191721749)
on `8cc68d5` is `COMMENTED`, recommends changes, and reports 71/77 files reviewed
at Balanced effort. It contains two previously missed suppressed findings and one
new inline finding. All three are accepted within the
[approved plan](../../docs/plans/initial-module-inventory-plan.md) and its three
accepted decisions. Authorization was committed as `ebb1982` before implementation.

| Finding | Correction and verification |
| --- | --- |
| Summary, `src/lib/typescript/expansions.ts:66`: module-only recursion guard truncates a valid renamed route. | Guard each path by `(module, exportedName)`. The `A.a → B.b → A.b` fixture retains both forwarding segments and the final direct declaration, including supporting source evidence and shared semantic identity. A wildcard cycle also terminates with the expected effective exports. |
| Summary, `src/lib/typescript/inputs.ts:9`: exclusion ordering/duplicates change snapshot identity. | Normalize paths, sort lexical/real-path pairs and remove duplicate pairs before filtering and identity capture. Permutations, duplicate entries and equivalent lexical spelling produce matching snapshots, claims and contexts; removing a distinct exclusion changes identity and restores that directory's sources. Distinct lexical aliases are retained rather than silently weakening the filter. |
| [Inline Unicode structural injection](https://github.com/ronen/postcode/pull/1#discussion_r4000443722) | Escape control characters at inline interpolation boundaries for names, selectors, source paths, qualifications and labels. LF/tab become visible escapes; Unicode line/paragraph separators are escaped too. Documentation and excerpts retain structured wrapping; rendering does not mutate JSON/domain text. Tests use actual control-bearing export names and source filenames plus synthetic module-name/selector labels. |

Generated commands are omitted when CLI/configuration paths contain control
characters, using existing manual-inspection guidance. Escaping those paths into
a different shell argument would display a command that no longer addresses the
requested configuration. Separate cases cover configuration and checkout paths;
ordinary generated commands retain their existing executable-command tests.

Input, expansion and presentation methods advance to `observed-inputs@1`,
`typescript-expansions@1` and `presentation@10`. Snapshot identities consequently
change. No new dependency, general selector language or governing revision was
introduced; no disagreement or unresolved unforeseen issue remains.

## Verification and limits

- `npm test`: **68/68 passed**; `npm run check`: passed on Node 22.13.1 / TypeScript
  6.0.3. Route and exclusion regressions failed before correction. The Unicode
  regression fixture was corrected during development; its initial failure was a
  fixture lookup error, not evidence of renderer behavior.
- A separate before/after probe renders the same qualified fixture with the
  predecessor and corrected renderers: the former emits raw inline controls; the
  latter emits visible escapes and preserves the JSON input. The ordinary export
  fixture renders identically through both renderers on the same view.
- Refreshed JSON/Unicode retains unique requested expansion kinds, structured
  documentation and source excerpts. The renamed-route JSON contains
  `reexport, reexport, direct` in order.
- The full passing suite preserved all 211 existing top-level checkout observation
  batches by name/content hash, added none and leaked no temporary test directories.
- Full-branch whitespace, changed-document links, evidence hashes and preservation
  of completed task/governing records checked. Subsequent handoff/checkpoint commits
  are metadata only.

Ten evidence files and their manifest are retained under the ignored
`_observations/validation/2026-09-13/continuation-round-5/`. Manifest SHA-256:
`f3574a15178d3502c6e6bec54354c6b7568c6a5b775b33002cf893603a159ec6`.
The predecessor-renderer comparison isolates rendering on a current qualified
view; it is not a complete historical pipeline replay. Real-project captures,
clean-agent exercises and human presentation review were not repeated. Earlier
evidence remains unchanged; local artifacts are optional and not repository dependencies.

## Next review gate

Have Copilot assess route completeness and cycle termination, canonical exclusion
sets without losing filtering, and Unicode interpolation boundaries alongside
structured wrapping and generated-command safety. Reproduce with `npm test` and
`npm run check`.

The human arranges and returns the next review. The continuation remains **active**;
no rereview acceptance is claimed. Resolve returned in-scope defects and close only
when no actionable findings remain or the human explicitly accepts residual concerns.
