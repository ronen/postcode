# Complete payload: investigram-owned guidance

Exploratory fixture pass, 2026-11-11. This exercises the [structure consolidation](../structured-architectural-accounts-consolidation.md), not an adopted schema or product implementation. Both partitions use the same metadata rules; the architectural claims, entity associations, correction and rendered diagrams are unchanged.

## Read one complete result

Start with the recommended [children first result](children/first-result.json) and [follow-up result](children/followup-result.json), interpreted with their [context and allocated bindings](children/context-and-bindings.json). The [mixed first result](first-result.json) and [follow-up](followup-result.json) retain the comparison with larger qualification/correction units.

Each submitted investigram has these distinct responsibilities:

| Part | Example | Meaning |
| --- | --- | --- |
| Identity and title | Local `trial` becomes TRIAL-1 at acceptance | Identifies the immutable investigram. |
| `content` | `concurrent-callers`, `recovery` | Qualified architectural interpretation in supported forms; entity declarations remain anchored in identifying content. |
| `referents`, `associations` | R, W, P, S and precise content associations | Organizes this investigram's references and claims. |
| `offers` | ADMISSION-1's `concurrent-callers-offer` | Qualified further-investigation guidance about this exact explanation. |
| `presentations` | TRIAL-1's `recovery-state`, `concurrent-callers` | Recommends known diagram types with explicitly bound content. |
| `qualifications`, `evidence` | Own scope and evidence references | Applies across content and metadata, supplemented by entry-specific qualifications/support. |
| `children` | INTRO-1's two children | Fixed references to complete subordinate investigrams; no implicit descendant delivery. |

The containing result still supplies composition and correction K separately. Basis and evaluation/request provenance remain in the accompanying ledger; they are not invented by presentation or reduced to a local claim. Metadata arrays are explicit, including when empty. This is a bounded encoding of responsibilities, not a requirement that every conceptual concern become a new physical field.

## Exact addresses and qualified delivery

Content, offers and presentations have separate address namespaces:

- `{account, contentKey}` selects interpretation content.
- `{account, offerKey}` selects an investigation offer.
- `{account, presentationKey}` selects a presentation recommendation.

`account` remains a provisional wire spelling for an investigram. Submission references use `{submittedAccount: key}` and are resolved at acceptance, including within metadata. Identical keys in different namespaces or replacement investigrams never establish equivalence or fallback.

[Guidance access](children/guidance-access.json) materializes complete own delivery and a qualified recommendation excerpt; [offer access](children/offer-access.json) exercises the offer before and after correction. Complete own delivery includes content, all own metadata, qualifications, evidence and child links, with basis/provenance context. Omitting an offer or substituting an empty list does not count as complete. Neither an offer excerpt nor a recommendation excerpt establishes correction-target eligibility. A recommendation reference also does not deliver its input model.

Substantive investigator delivery cites the owning investigram. Human browsing alone does not. Metadata excerpts preserve own qualifications and the entry's support/qualifications, alongside basis and provenance. Correction-aware delivery still follows the existing disclosure rules; checking completeness alone does not authorize a correction.

ADMISSION-1's offer remains with ADMISSION-1 after K. ADMISSION-2 has no repeated offer because TRIAL-1 already addresses the question; earlier invocations retain their original address. Offers remain atemporal ‘find out more’ guidance, not necessarily unanswered next steps. No guidance child, transfer, separate offer lifecycle or automatic rerun is introduced. Captured answers remain unchanged. The same exact-owner rule applies to presentation recommendations; the checker tests missing-original rejection with a same-key candidate, without asserting an additional architectural correction.

## Diagrams use explicit inputs

The [bounded diagram catalogue](diagram-contracts.json) defines two input contracts and describes their known mappings:

| Recommendation on TRIAL-1 | Diagram type | Exact content inputs |
| --- | --- | --- |
| `recovery-state` | `state-diagram/0` | `model` → TRIAL-1 / `recovery` |
| `concurrent-callers` | `sequence-diagram/0` | `interaction` → TRIAL-1 / `concurrent-callers` |

The interaction's state-transition steps already name `stateContent: "recovery"` and exact transition keys. Its content contract owns that dependency. The sequence generator follows these references, rather than duplicating them in recommendation metadata or inferring transitions. Missing or incompatible referenced content prevents rendering; no recommendation is needed to establish the dependency.

The generator dispatches by the selected diagram type and resolves primary inputs plus dependencies declared by their content contracts. It still uses the fixture's qualified scope, evidence and entity labels. Current recommendations add no architectural limits beyond those already in the bound content and owner. They are suggestions, not a stronger contract imposed on the original offer.

Trial diagrams and legends regenerate unchanged both from recommendations and from explicit diagram/content selections with the owner's recommendations removed. The [access fixture](guidance-access.json) records these direct selections. Optional recommendations express usefulness; they do not authorize rendering. Adding a renderer or choosing a compatible diagram does not revise the investigram or require correction. An erroneous recommendation could warrant correction; a missing suggestion for a newly available diagram is not an error. Composition remains the earlier fixed-entry rendering probe, with empty presentation metadata; this pass does not claim to convert it or implement cross-investigram diagram retrieval.

## Checks and assessment

Run from the worktree root:

```sh
python3 notes/structured-account-example/check-guidance.py
python3 notes/structured-account-example/composition/check-and-render.py
python3 notes/structured-account-example/render-overviews.py
```

The guidance check includes the existing partition, offer and association checks. It also rejects 32 malformed guidance/address copies across both partitions, checks omitted or altered own metadata and missing/mismatched basis/provenance, and confirms access does not mutate retained fixtures. The composition/selector checks remain separate. Rendering checks reproduce the committed diagram sources, legends and traceability; the existing SVGs are unchanged.

The split now has a concrete use: architectural claims remain in content, while offers and rendering intentions concern their exact owner. It needs no special guidance lifecycle. The cost is explicit address and delivery rules, which would be necessary even if metadata stayed embedded in content. This supports the proposed organization without establishing that it is a general schema. Cross-investigram diagram inputs, broader catalogue design, live investigator acceptance and product retention/API validation remain untested. Existing governing/identity and support-selection questions are not resolved by these fixtures.
