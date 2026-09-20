Record type: findings
Received: 2026-09-20
Reviewer: GitHub Copilot
Handoff: [Integrated handoff](2026-09-17-integrated-handoff.md)
Round: 2 (first Copilot round)
Reviewed target: `51148890e634021a6e47862d37d7bd06798e70d0`
Prior findings: [Round 1](2026-09-17-integrated-round-1-findings.md)
Prior reviewed target: `93d6d7d52bc3715276014a85f197db5e7f8a72b8`
External PR: https://github.com/ronen/postcode/pull/4

# Integrated review: Copilot round 2

## Retrieval method and scope

Retrieved with `gh api --paginate` from `repos/ronen/postcode/pulls/4/reviews`,
`repos/ronen/postcode/pulls/4/comments`, and `repos/ronen/postcode/issues/4/comments`.
The responses contain one submitted review, three inline comments and zero conversation
comments. All returned review components are preserved below, in API order within
each category; no filtering, redaction or body-text normalization was applied.
Bodies include the review's HTML, relative links and original line endings.
Metadata wrappers are repository-authored. All annotations belong to review
`5260062233` at the target above; no replies or additional conversation were returned.
The reviewed scope is PR #4 against main. Relative to round 1, intervening changes
were comments, documentation, review evidence and task/status records. Copilot's
report below supplies its assessment; it does not report executing tests.

## Retrieved findings

### Overall review 5260062233

Author: copilot-pull-request-reviewer[bot]
Source: https://github.com/ronen/postcode/pull/4#pullrequestreview-5260062233

<!-- ccr-overview-v2 -->

## Copilot review overview

### 🟡 Changes recommended

Dependency-evaluation validation can accept records whose resolved occurrences and relationships disagree, producing an inconsistent projected graph.

*Get a fresh assessment by requesting another Copilot review.*

**Review effort:** Balanced  
**Findings:** 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> · 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> · 1 <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture>

<details open>
<summary><strong>Open (3)</strong></summary>

- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/high-v2-light.png" alt="High severity" width="62" height="18" align="texttop"></picture> [Require relationships to partition all resolved occurrences exactly](#discussion_r4056501244) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/medium-v2-light.png" alt="Medium severity" width="62" height="18" align="texttop"></picture> [Pluralize output nouns according to their counts](#discussion_r4056501262) · New
- <picture><source media="(prefers-color-scheme: dark)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.svg"><img src="https://github.githubassets.com/static/images/icons/copilot-code-review/low-v2-light.png" alt="Low severity" width="62" height="18" align="texttop"></picture> [Update architecture overview to reflect integrated dependency layers](#discussion_r4056501275) · New
</details>

<details>
<summary><strong>What changed in this PR</strong></summary>

Adds qualified, occurrence-backed TypeScript dependency analysis, graph projections, navigation, composition metadata, organization context, and CLI presentation.

**Changes:**
- Adds dependency recognition, records, SCC graphing, parent/child projections, and organization classification.
- Integrates dependency views, source-detail navigation, observations, and `re-exports-only` composition.
- Adds extensive fixtures, tests, review records, and validation captures.

| File | Description |
| ---- | ----------- |
| `README.md` | Documents dependency commands. |
| `STATUS.md` | Records implementation status. |
| `docs/​README.md` | Links candidate capabilities. |
| `docs/​architecture/​README.md` | Documents dependency architecture. |
| `docs/​candidate-capabilities.md` | Records future analysis ideas. |
| `docs/​cli-reference.md` | Documents dependency CLI behavior. |
| `docs/​core-concepts.md` | Generalizes standard expansions. |
| `docs/​decisions/​README.md` | Indexes dependency decisions. |
| `docs/​decisions/​bounded-commonjs-source-evidence-decision.md` | Defines CommonJS evidence boundaries. |
| `docs/​decisions/​dependency-organization-integration-decisions.md` | Defines organization classification. |
| `docs/​decisions/​module-composition-property-decision.md` | Defines composition semantics. |
| `docs/​decisions/​module-dependency-structure-decisions.md` | Defines dependency graph semantics. |
| `docs/​decisions/​subject-kind-standard-expansion-decision.md` | Extends expansion semantics. |
| `docs/​plans/​module-dependencies-plan.md` | Specifies the dependency slice. |
| `drafts/​dependency-landscape/​working-notes.md` | Retains exploratory dependency notes. |
| `fixtures/​dependency-context/​README.md` | Explains CommonJS fixtures. |
| `fixtures/​dependency-context/​classic/​entry.ts` | Exercises classic CommonJS. |
| `fixtures/​dependency-context/​classic/​tsconfig.json` | Configures classic CommonJS. |
| `fixtures/​dependency-context/​mixed/​entry.cts` | Exercises CommonJS-form input. |
| `fixtures/​dependency-context/​mixed/​entry.mts` | Exercises ESM-format exclusion. |
| `fixtures/​dependency-context/​mixed/​tsconfig.json` | Configures mixed NodeNext formats. |
| `fixtures/​dependency-context/​preserve/​entry.ts` | Exercises preserve-mode recognition. |
| `fixtures/​dependency-context/​preserve/​explicit.mts` | Exercises preserve ESM exclusion. |
| `fixtures/​dependency-context/​preserve/​globals.d.ts` | Supplies callable ambient evidence. |
| `fixtures/​dependency-context/​preserve/​target.ts` | Supplies preserve-mode target. |
| `fixtures/​dependency-context/​preserve/​tsconfig.json` | Configures preserve mode. |
| `fixtures/​dependency-contract/​README.md` | Documents compiler-contract fixture. |
| `fixtures/​dependency-contract/​ambient.d.ts` | Exercises ambient ownership. |
| `fixtures/​dependency-contract/​esm.mts` | Exercises ESM CommonJS rejection. |
| `fixtures/​dependency-contract/​forward.ts` | Exercises direct re-exports. |
| `fixtures/​dependency-contract/​node-types/​globals.d.ts` | Supplies minimal `require`. |
| `fixtures/​dependency-contract/​package.json` | Establishes CommonJS package format. |
| `fixtures/​dependency-contract/​requests.cts` | Covers supported request forms. |
| `fixtures/​dependency-contract/​require-only.ts` | Tests outside-population resolution. |
| `fixtures/​dependency-contract/​script.js` | Exercises JavaScript ownership. |
| `fixtures/​dependency-contract/​target.ts` | Supplies dependency targets. |
| `fixtures/​dependency-contract/​tsconfig.json` | Configures contract fixture. |
| `fixtures/​dependency-journey/​common/​leaf.ts` | Adds journey leaf. |
| `fixtures/​dependency-journey/​common/​shared.ts` | Adds shared dependency. |
| `fixtures/​dependency-journey/​src/​entry.ts` | Adds journey root. |
| `fixtures/​dependency-journey/​src/​forward.ts` | Adds re-export intermediary. |
| `fixtures/​dependency-journey/​src/​left.ts` | Adds left branch. |
| `fixtures/​dependency-journey/​src/​right.ts` | Adds right branch. |
| `fixtures/​dependency-journey/​tsconfig.json` | Configures journey fixture. |
| `records/​reviews/​module-dependencies/​2026-09-16-provider-contract-disposition.md` | Records contract disposition. |
| `records/​reviews/​module-dependencies/​2026-09-16-provider-contract-handoff.md` | Records contract handoff. |
| `records/​reviews/​module-dependencies/​2026-09-16-provider-contract-round-1-findings.md` | Retains first contract review. |
| `records/​reviews/​module-dependencies/​2026-09-16-provider-contract-round-2-findings.md` | Retains second contract review. |
| `records/​reviews/​module-dependencies/​2026-09-16-provider-integration-disposition.md` | Records provider disposition. |
| `records/​reviews/​module-dependencies/​2026-09-16-provider-integration-handoff.md` | Records provider handoff. |
| `records/​reviews/​module-dependencies/​2026-09-16-provider-integration-round-1-findings.md` | Retains provider findings. |
| `records/​reviews/​module-dependencies/​2026-09-17-graph-expansions-disposition.md` | Records graph disposition. |
| `records/​reviews/​module-dependencies/​2026-09-17-graph-expansions-handoff.md` | Records graph handoff. |
| `records/​reviews/​module-dependencies/​2026-09-17-graph-expansions-round-1-findings.md` | Retains graph findings. |
| `records/​reviews/​module-dependencies/​2026-09-17-integrated-disposition.md` | Records integrated disposition. |
| `records/​reviews/​module-dependencies/​2026-09-17-integrated-handoff.md` | Records integrated handoff. |
| `records/​reviews/​module-dependencies/​2026-09-17-integrated-round-1-findings.md` | Retains integrated findings. |
| `records/​tasks/​2026-09-16-module-dependencies.md` | Tracks the active task. |
| `records/​validation/​module-dependencies/​2026-09-16-commonjs-review-investigation.md` | Records CommonJS investigation. |
| `records/​validation/​module-dependencies/​2026-09-16-dependency-provider-integration.md` | Records provider validation. |
| `records/​validation/​module-dependencies/​2026-09-16-dependency-provider-validation.json` | Retains provider results. |
| `records/​validation/​module-dependencies/​2026-09-16-final-recognition-contract.md` | Records recognition contract. |
| `records/​validation/​module-dependencies/​2026-09-16-ts-node-adapted-validation.json` | Retains adapted ts-node results. |
| `records/​validation/​module-dependencies/​2026-09-16-ts-node-compiler-evidence.json` | Retains compiler evidence. |
| `records/​validation/​module-dependencies/​2026-09-16-ts-node-validation-config.jsonc` | Records adapted configuration. |
| `records/​validation/​module-dependencies/​2026-09-16-typescript-contract.md` | Documents TypeScript findings. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​boundary-external-children.txt` | Captures external-child output. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​boundary-inputs-initial.json` | Retains initial boundary inputs. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​boundary-inputs.json` | Retains final boundary inputs. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​boundary-structure.txt` | Captures boundary structure. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​capture-summary.json` | Summarizes initial captures. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​evaluator-a-addendum.md` | Retains evaluator A addendum. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​evaluator-a-final.md` | Retains evaluator A result. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​evaluator-a-initial.md` | Retains evaluator A baseline. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​evaluator-a-navigation.md` | Retains navigation evaluation. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​evaluator-b-addendum.md` | Retains evaluator B addendum. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​evaluator-b-final.md` | Retains evaluator B result. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​evaluator-b-initial.md` | Retains evaluator B baseline. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​evaluator-b-navigation.md` | Retains navigation evaluation. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-boundary-structure.txt` | Captures final boundary output. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-capture-summary.json` | Summarizes final captures. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-journey-children.txt` | Captures final child view. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-journey-inspect.txt` | Captures final inspection. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-journey-parents.txt` | Captures final parent view. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-journey-structure.txt` | Captures final journey structure. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-postcode-structure.txt` | Captures PostCode structure. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-tsnode-children.txt` | Captures ts-node children. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-tsnode-structure.txt` | Captures ts-node structure. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-wording-journey.txt` | Validates final wording. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​final-wording-source.txt` | Validates source-detail wording. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​journey-children.txt` | Captures journey children. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​journey-inspect.txt` | Captures journey inspection. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​journey-parents.txt` | Captures journey parents. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​journey-structure.txt` | Captures journey structure. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​observation-checks.json` | Records observation checks. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​postcode-children.txt` | Captures PostCode children. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​postcode-inspect.txt` | Captures PostCode inspection. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​postcode-parents.txt` | Captures PostCode parents. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​postcode-structure.txt` | Captures PostCode structure. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​tsnode-children.txt` | Captures ts-node children. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​tsnode-original-opening.stderr.txt` | Retains original opening failure. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​tsnode-provider.json` | Retains provider output. |
| `records/​validation/​module-dependencies/​2026-09-17-instrument/​tsnode-structure.txt` | Captures ts-node structure. |
| `records/​validation/​module-dependencies/​2026-09-17-integrated-instrument.md` | Documents integrated validation. |
| `src/​lib/​cli.ts` | Adds dependency CLI workflows. |
| `src/​lib/​composition-view.ts` | Builds composition view data. |
| `src/​lib/​dependencies/​evaluate.ts` | Records dependency evaluations. |
| `src/​lib/​dependencies/​graph.ts` | Derives SCC dependency graphs. |
| `src/​lib/​dependencies/​organization.ts` | Classifies relationship placement. |
| `src/​lib/​dependencies/​presentation.ts` | Builds and renders dependency views. |
| `src/​lib/​dependencies/​projections.ts` | Implements dependency lenses. |
| `src/​lib/​dependencies/​records.ts` | Defines dependency domain records. |
| `src/​lib/​evaluation.ts` | Shares module-evaluation recording. |
| `src/​lib/​identity.ts` | Versions new analysis methods. |
| `src/​lib/​memory-store.ts` | Validates dependency records. |
| `src/​lib/​observations.ts` | Records dependency observations. |
| `src/​lib/​organization/​evaluate.ts` | Reuses extracted placement logic. |
| `src/​lib/​organization/​placement.ts` | Extracts path placement. |
| `src/​lib/​organization/​presentation.ts` | Displays composition annotations. |
| `src/​lib/​organization/​projections.ts` | Projects module expansions. |
| `src/​lib/​organization/​records.ts` | Extends organization projections. |
| `src/​lib/​presentation.ts` | Presents composition separately. |
| `src/​lib/​records.ts` | Adds dependency/composition types. |
| `src/​lib/​typescript/​commonjs.ts` | Implements CommonJS recognition. |
| `src/​lib/​typescript/​composition.ts` | Derives composition properties. |
| `src/​lib/​typescript/​dependencies.ts` | Extracts dependency occurrences. |
| `src/​lib/​typescript/​project.ts` | Integrates dependency preparation. |
| `test/​cli.test.ts` | Tests CLI and composition output. |
| `test/​dependencies.test.ts` | Tests provider behavior and invariants. |
| `test/​dependency-contract.test.ts` | Characterizes compiler behavior. |
| `test/​dependency-presentation.test.ts` | Tests dependency rendering/navigation. |
| `test/​dependency-projections.test.ts` | Tests graph and projection semantics. |
| `test/​dependency-provider-probe.ts` | Adds manual provider probe. |
| `test/​dependency-repository-probe.ts` | Adds compiler/repository probe. |
| `test/​discovery.test.ts` | Updates discovery schema tests. |
| `test/​organization.test.ts` | Updates organization projection tests. |
| `test/​records.test.ts` | Updates record fixtures. |
</details>

---

💡 <a href="/ronen/postcode/new/main?filename=.github/skills/code-review/SKILL.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add a `code-review` agent skill</a> or configure MCP servers for context-aware, tailored reviews. <a href="https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review?tool=webui#mcp-servers-and-agent-skills" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn more in the docs.</a>

### Inline comment 4056501244

Author: Copilot
Source: https://github.com/ronen/postcode/pull/4#discussion_r4056501244
Location: `src/lib/memory-store.ts`; line 158; original line 158; side RIGHT

The evaluation validator checks each referenced relationship in isolation, but never checks that those relationships cover exactly the resolved occurrences listed by this evaluation. A batch can therefore omit the relationship for a resolved occurrence (or reference support outside `record.occurrences`) and still be accepted; `dependencyStructure` will then silently produce a graph inconsistent with the retained occurrence evidence. Please enforce a one-to-one partition of this evaluation's resolved occurrences across its relationships.

### Inline comment 4056501262

Author: Copilot
Source: https://github.com/ronen/postcode/pull/4#discussion_r4056501262
Location: `src/lib/dependencies/presentation.ts`; line 231; original line 231; side RIGHT

The fixed pluralization renders user-facing output such as `1 modules in this projection · 1 direct relationships` (also present in the committed one-edge journey capture). Pluralize each noun from its corresponding count.

### Inline comment 4056501275

Author: Copilot
Source: https://github.com/ronen/postcode/pull/4#discussion_r4056501275
Location: `docs/architecture/README.md`; line 84; original line 84; side RIGHT

This current architecture document says dependency projections, expansions, presentations, navigation, and observations remain unimplemented, but the same PR implements them and the later section states they are integrated. That leaves the canonical implementation overview internally contradictory; update this checkpoint paragraph to describe the provider as the basis for the now-integrated layers.

