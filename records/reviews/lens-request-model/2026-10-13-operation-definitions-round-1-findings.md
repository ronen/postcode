# Fixed operation definitions and interpretation extension: round 1 findings

Record type: findings
Received: 2026-10-13
Reviewer: Claude Opus 5.5 (Claude Code), independent session with no implementation involvement (also the reviewer of the earlier rounds on this task)
Handoff: [2026-10-13-operation-definitions-handoff.md](2026-10-13-operation-definitions-handoff.md)
Round: 1
Reviewed target: 300c5a7e4c1d310d8177d24c24590c5c5aad6368 (scope `e324a79..300c5a7`, branch `codex/lens-request-model`)

## Returned findings

### Method

- Read the handoff and the governing references it names, concentrating on the shared extension preparation, the reuse rules and M4.
- Confirmed that `HEAD` (`08c67dd`) differs from the target only in records and descriptive documentation. `git diff 300c5a7 HEAD -- src test fixtures package.json` is empty.
- Inspected the complete source and test diff for `e324a79..300c5a7`:
  - the new `request-catalog.ts` (`captureCatalog`) and `investigation/operations.ts` (`OperationDefinition`, `operationMethod`, `requireOperation`);
  - catalog threading through `requests.ts` and Session `openSession`/`requestExecutor`;
  - the evaluator's reuse key and method;
  - `investigate`'s definition-driven subject and initial-context policy;
  - acceptance method propagation;
  - the selection record's new `operation`/`subjectKind`, its validation, reference mapping and investigator reference transport;
  - title handling and arrangement identity in `presentation.ts`;
  - the `content.ts` candidate change;
  - the method version bumps;
  - the new `lens-extensions.test.ts`.
- Listed every remaining call site that falls back to a default definition (`captureRequest`, `normalizeRequest`, `investigationInstructions`, `investigate`, `selectInvestigation`, `createInvestigationView`). In the Session path, supplied definitions are passed explicitly and win. The defaults remain only in the worker/interactive path, which uses the production catalog, and in `command-execution`'s `normalizeRequest`, which applies to CLI requests only.
- Built `300c5a7` in the scratchpad with `git archive` and ran direct-Session probes there against a two-module temporary project, supplying altered catalogs through the internal `openSession` assembly argument. Nothing was written to the repository.

### Verification performed

- `npm run check`: passed.
- `npm test` (loopback permitted, repository inputs held stable): 542 tests, 542 passed.
- The probe results below support F1–F3. No paid inference was used; probes used the scripted investigator double.

### Actionable findings

All three findings concern the internal assembly seam, which `captureCatalog` is meant to validate. None is reachable from the public CLI, whose catalog is fixed. They matter at this gate because the remaining work (mechanical/Presentation assembly and the qualified-exports extension) builds on this seam.

#### F1 (medium) — `captureCatalog` accepts altered definitions under built-in Lens IDs; execution ignores the alteration, crashes, or returns an answer for a different question

The handoff says additional mechanical definitions are explicitly rejected. The guard only checks that a non-interpretation Lens ID already exists in the built-in `lenses`. The definition itself is not compared with the built-in one. Execution still dispatches mechanical Lenses by name. Interpretation-to-mechanical replacement is also accepted. Probe results:

| Supplied catalog entry | Request | Result |
|---|---|---|
| `modules` with `requirements: { kind: 'dependencies' }`, `results: ['dependencies']` | `modules` | Execution throws `TypeError: Cannot read properties of null (reading 'id')`, a defect rather than a resolution result |
| `modules` with `subjects: ['module']`, `cardinality: 'collection'` | `modules entry` | The module designation is accepted, and a `postcode-view/1` modules View is returned |
| `summarize` replaced by the `modules` definition with `id: 'summarize'` | `summarize` with no selector | A `postcode-organization-view/1` View is returned, labeled as Lens `summarize` |

In the last case the normalized request, attribution and observation would record a `summarize` question answered by an organization View that neither definition declares. The handoff's review focus 4 asks that unsupported fixture requests remain resolution results rather than fabricated answers; this is the catalog-level form of that concern.

Suggested direction:

- until mechanical assembly is supported, require every non-interpretation entry to equal the built-in definition (canonical comparison);
- reject an entry that changes a built-in interpretation Lens into a non-interpretation Lens.

`lens-extensions.test.ts` has no rejection test for `captureCatalog`; the stated rejection of mechanical additions is untested. A table-driven rejection test would also protect F2 and F3.

#### F2 (low) — Lens IDs that collide with command spellings or `usage` are accepted but unreachable

`captureRequest` maps command spellings (`dependencies`, `children`, `parents`) and the `usage` report before it consults the catalog. `captureCatalog` does not reject IDs that collide with these spellings. Probes:

- an interpretation Lens with `id: 'children'`: the request `children entry` returned a `postcode-dependency-view/1` for `dependency-children`;
- an interpretation Lens with `id: 'usage'`: the request `usage` returned the usage report.

The supplied definition is silently shadowed. Suggested correction: reject catalog IDs that are command spellings mapping to a different Lens ID, and reject `usage`.

#### F3 (low) — Parameters declared by an interpretation Lens are accepted, then dropped before the operation; differently parameterized requests reuse one answer

`LensDefinition.parameters` is typed `Record<string, never>`, but `captureCatalog` does not check it at runtime. `invalidParameters` accepts any key that a supplied definition declares. The Session then calls the operation with `parameters: {}`.

With `risks` declaring `parameters: { depth: … }`:

- `parameters: { depth: 1 }` was accepted, with the normalized request recording `{"depth":1}` and the operation request `{}`;
- a second request with `{ depth: 9 }` reused the first result (`reused: true`, identical accounts).

The recorded request therefore claims a parameterization that the answer did not use. Suggested correction: until operation parameters are supported, reject non-empty `parameters` in interpretation Lens definitions, and in mechanical ones through F1's equality check.

### Non-defect observations

- **Reuse and method provenance:**
  - The evaluator's reuse lookup requires both the effective method and the operation request to match. The effective method combines `investigation-evaluation@3`, the common `investigation@13` and a digest of the whole definition.
  - Changing the objective, initial-context policy or authored method label therefore prevents reuse even without a version bump. This is tested over one retained store.
  - Accepted investigrams, corrections and provenance carry the effective operation method, and identity allocation uses it.
  - The current Lens, designation and attribution stay outside the key: `risk-review` reuses the `risks` evaluation with the original provenance, without a second investigator call.
  - Configuration unavailability, retryable communication failure and retained failure keep their existing policy (tested).
- **Selection contract:**
  - Request selections retain the actual operation request and subject kind, including unavailable outcomes.
  - Arrangement reads the reported request from the selection rather than from a Lens-to-operation map.
  - Reference mapping includes `operation.subject`, and investigator reference transport now lists `operation` (replacing a stale `selector` field).
- **Store validation:**
  - Store validation remains self-contained: request/subject identity, subject kind against the stored record, empty parameters, and canonical equality with the selected evaluation's request.
  - One invariant is weaker than before. Validation no longer ties the record's `lens` to its operation, and no longer ties `subjectKind` to the operation's declared subject kind. Construction (`selectInvestigation`) still checks the Lens declaration, so this matters only for a hand-built or corrupted record. The record's own `operation` field now carries the meaning that `lens` used to.
  - If the human wants the stronger invariant without a global map, the selection could retain the operation's declared subject kind from the definition.
- **Titles and identity:**
  - Titles come from the definition. The arrangement key includes the title, so `risks` and `risk-review` Views differ in identity while sharing the evaluation.
  - Production titles are unchanged: `Module summary`, `Explain · investigram`, and so on.
  - `renderInvestigationView` escapes the title through `inlineText`.
- **Content candidates:** these are now derived for every request variant, filtered to module subjects. Previously only `summarize` derived them. Investigram-subject operations get none, as before.
- **Catalog lifetime:** the catalog is captured and frozen synchronously before Session opening, and later caller mutation is ignored (tested). There is no registration or replacement during execution. The worker path uses only the production catalog.

### Unverified areas and residual limits

- I did not exercise the worker/CLI path with a non-default catalog; it has no catalog seam.
- I did not fuzz malformed catalogs beyond the probes above, for example prototype-named IDs or non-string objectives.
- I did not exercise hosted investigators.
- I did not assess the remaining plan work: runtime result/Presentation compatibility, fallback, removal of mechanical dispatch, and the qualified-exports extension.
- The historical intermittent CLI failure did not recur in this run; its cause remains unconfirmed.

### Recommendation for this intermediate gate

The reuse and provenance changes, the definition-driven investigator policy, the retained selection contract and the interpretation extension through the shared machinery are sound for the assessed cases. They can support the remaining work.

I recommend correcting F1 before the mechanical/Presentation assembly work builds on `captureCatalog`. Today the seam accepts definitions that execution does not honor, and one combination returns an answer to a different question. F2 and F3 are small validation additions in the same function and fit naturally with F1. After that, a narrow re-check of the catalog rejection cases would be enough; a full new round is not necessary unless the human prefers one.
