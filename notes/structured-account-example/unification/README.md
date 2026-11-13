# Mechanical and interpreted contributions: worked unification

Updated 2026-11-13. Exploratory design work, not an adopted contract or a product migration.
[Inputs](contributions.json), [report](report.json) and [checker](check-unification.py) exercise
the common association/lifecycle model over a small [source fixture](source/loader.ts).
The producing methods and their outputs are **authored expected contributions**. No native
PostCode provider, live investigator, hypothetical constant-target analyzer or runtime execution
was run. Source digests identify these files; they do not certify an analyzer's output.

## Finding

A common investigram envelope works for the tested mechanical and interpreted contributions.
Entity references, keyed content, association declarations, result designations, exact access,
qualification delivery and cause propagation need no producer-specific variants. The important
changes are a producer-neutral content catalogue, structured identifying content and attribution
of method/basis to each producing contribution. They are changes to the existing provenance and
qualification responsibilities, not additional accounts with a second correction mechanism.

Unification does **not** mean that everything addressable becomes an investigram. Raw source,
evidence records, evaluation outcomes, entities and selected projections keep their roles.
An investigram bundles information contributed by analysis; an individual claim is content,
not automatically another bundle. No universal "mechanical claim" text wrapper is needed.

## Current machinery inspected

| Existing implementation | Consequence for the common representation |
| --- | --- |
| [Module, symbol and export records](../../../src/lib/records.ts) distinguish entity identity, claim and claim context | Introduce entities through typed identifying items; preserve method, evidence, basis, guarantee and exact references. Source names/handles do not become authoritative conceptual names. |
| [Identity construction](../../../src/lib/identity.ts) is deterministic within its provider/Session rules | Do not allocate a new entity on every encounter. The probe uses readable provider-ID stand-ins, not a replacement identity algorithm. |
| [Export content](../../../src/lib/exports/content.ts) selects exports and supporting contexts from separate expansion outcomes | A later export contribution can use an existing module and introduce its symbols. It does not mutate the earlier discovery result. |
| [Dependency records](../../../src/lib/dependencies/records.ts) recognize dynamic-import requests but leave computed names indeterminate | An interpreted target account can add information without correcting that scoped mechanical result. Empty established relationships do not mean no runtime dependencies. |
| [Qualified answer identity](../../../src/lib/answer-identity.ts) and [investigation reuse](../../../src/lib/investigation/evaluation.ts) distinguish retained information from repeated access | Recognized reuse returns existing identities and captured answers; common packaging must preserve that behavior. |

These are source-inspected mappings, not a serialization of an executed native analysis. The
four illustrative content contracts below retain the distinctions needed for this example;
they do not claim to cover every native export route, occurrence, claim context or provider.
Actual migration must preserve the complete native information exposed by each supported method.

## Source and meaning

The loader exports a constant target string and a function containing `import(pluginTarget)`.
The separate plugin module exists in the captured source; an empty module has no exports.

The mechanical source-request method recognizes a dynamic import with a computed target. Its
supported scope does not evaluate the constant. Interpretation can explain that, if the function
is invoked and reaches that expression, it attempts the constant target. Association with the
captured plugin module additionally carries a build/loader correspondence assumption. The source
module, an emitted artifact and a successful runtime load must not silently become the same claim.
No fixture establishes that the function was called or the load succeeded.

Requests carry stable `authored.*` operation identifiers and explanatory declared meanings. They
are a probe sequence, not proposed free-text user queries, new global Lenses or a UI journey. Q-E
uses an explicitly selected pair of modules for a fixture batch; this is not a claim that the
implemented exports Lens already accepts that cardinality.

## The contribution chain

| Invocation | Producer and contribution | Associations and result |
| --- | --- | --- |
| Q-D | Mechanical module discovery introduces M-loader, M-plugin and M-empty through structured module identification | `DISCOVERY-1` supplies three `identifies` associations; RESULT-Q-D selects them. No invented prose or agent identity. |
| Q-E | Later mechanical export analysis reuses those modules, introduces S-load and S-target as symbols, and returns the loader's export surface plus an established empty surface | Two investigrams in one accepted contribution, each with its own qualification. RESULT-Q-E selects the export and symbol-identification associations. Q-D's answer is unchanged. |
| Q-S | Mechanical source-dependency analysis returns the recognized dynamic-import occurrence with `target-indeterminate` and no established target relationship | `DEPENDENCIES-1/dependencies` describes M-loader. This is a qualified mechanical result, not an empty or failed analysis. |
| Q-I | Interpretation receives Q-S's association and the plugin's identifying association, then explains the conditional target from captured source | `RUNTIME-1/runtime` is added beside the source-request association. It does not supersede Q-S or claim runtime observation. |
| Q-C | A qualified selection includes both dependency associations through exact declaration references | RESULT-Q-C keeps each original owner, method, scope and guarantee. No synthesized complete graph is asserted. |
| Q-M | **Hypothetical** later mechanical method establishes the conditional target for a restricted constant-binding shape | `CONSTANT-TARGET-1/runtime` explicitly supersedes the interpreted runtime association. Its mechanical guarantee is separately stated and still excludes observed execution. This method is not implemented or executed. |
| Q-R | Authored interpretation offers a fuller explanation of the same conditional target, explicitly separating possible invocation from observed use | `RUNTIME-REFINED-1/runtime` supersedes the mechanical target association. This is an illustrative enhancement choice, not a discovered defect in an implemented analyzer. Its interpreted guarantee does not inherit the replaced method's guarantee. |

Q-M and Q-R test organization in both directions. There is no implicit precedence rule saying
mechanical analysis wins, or that interpretation always has broader authority. If their claims
have different valid scopes, ordinary additions can coexist instead. Supersession requires an
explicit declaration and attributable grounds; validity checks do not certify that judgment.

The final undisplaced `describes` associations for M-loader are its export surface, its original
mechanical source-request account and the fuller interpreted target explanation. Their shared
role does not merge their meanings. The original mechanical target, earlier interpretation and
all their captured answers remain available by exact reference.

## Content and provenance contracts exercised

| Illustrative type | Necessary data in this probe | Qualification boundary |
| --- | --- | --- |
| `module-identification/0` | Subject, introduction marker, provider identity, source name/handle/facets and source attribution | A nullable source name and generated handle identify implementation context; neither asserts an architectural role. |
| `symbol-identification/0` | Subject, introduction marker, provider identity, implementation name, type/value roles, declaration count and origin module | Symbol identity is not a runtime object or execution. |
| `export-surface/0` | Subject, keyed entries, exported names, symbol/origin references, routes, type/value roles and explicit coverage | The list is an export surface, not a complete module account. An established complete empty list differs from missing analysis. |
| `dependency-account/0` | Subject, explicit relationship semantics, requests/statuses, qualified conditional relationships and coverage | The same type can carry mechanical or interpreted information. `source-request` and `conditional-load-attempt` are explicit; producer kind alone determines neither meaning nor guarantee. |

Existing content items and declaration references remain the only member alternatives. Mechanical
claims become typed content within their producing bundle; there is no third member arm pointing
to a separate mechanical-information universe. Native records need not be copied physically: a
migration can make a native record accessible through the common content address while preserving
its identity semantics. The fixture does not implement that mapping or require duplicate storage.

`provenance` in this probe materializes the existing responsibility for attributable producer
method and captured basis. Fixture acceptance bindings supply it on behalf of the host, rather
than trusting a submitted claim of producer authority. Each delivered item/declaration retains
its owner's provenance. Claim-specific `qualification` remains with the item, and bundle-level
qualifications accompany it. A producer's kind does not manufacture a claim guarantee. Mechanical
contributions do not need model/agent identity or mandatory prose; interpreting producers retain
whatever agent/method attribution their actual execution requires.

The original common model assumed one fixture-wide basis. This branch carries a captured input
selection for each contribution, including file digests and configuration. Q-S's loader-source
basis is not substituted for Q-I's loader-plus-plugin basis when they are selected together.
These are different scopes of the same authored program state, not proof of identity continuity
across changing source states. The existing older fixtures keep their explicitly shared basis.

Four content contracts are registered in this checker; the shared model enforces their addressing,
introduction and association rules. In particular, an identifying item need not be the earlier
prose-shaped `entity-description/0`. A newly introduced entity still needs explicit identifying
content and an `identifies` association. A later introduction cannot steal an existing ID.

## Production, selection and outcomes remain distinct

The probe's invocations separate discovery, export inspection and dependency investigation for
clarity. This is not a rule that each internal compiler phase needs a public query-result entity.
A real request may use multiple analyses or already retained contributions. Attribute each output
to its actual producing method and basis; do not assign the last method to every selected item.
An answer's selection of earlier material does not change its producer or reparent its children.

Q-E demonstrates several bundles accepted together. Incremental later work is a new contribution,
not a mutation of the discovery bundle. A generalized investigram is not the complete evaluation,
transaction, query result or projection. Partial outcomes and prerequisites still need their own
attribution. The fixture includes an unavailable/failed attempt with no contribution, kept separate
from the established empty export surface. It does not settle every failed/partial query-result
contract or imply that such attempts cannot have existing qualified selections.

Recognized reuse of Q-E is demonstrated by returning the existing result and unchanged state.
The fixture does not implement a cache matcher or specify a new effective-input identity formula.
Later association changes do not mutate that returned mechanical answer. A fresh general selection
can disclose changes, while a method-specific Lens must preserve its declared meaning and guarantee;
selecting the latest `describes` association is not sufficient to satisfy an exports or mechanical
source-dependency contract.

## Exposure and reconsideration

Q-D/Q-E/Q-S use captured source and exact provider identities. They do not acquire prior interpretive
descriptions merely because those descriptions concern the same module. Their retained-information
exposure indexes are empty; source evidence and captured input attribution are still present.
Q-I really receives the source-dependency association and the plugin identification, so those
qualified deliveries are recorded. Q-M and Q-R acquire the association they explicitly replace.
The same delivery machinery works for mechanical consumers of retained contributions: actual reads
matter, not whether the consumer happens to be an agent. Bare IDs remain distinct from claim delivery.

The zero retained-information exposure on these authored mechanical contributions is not a
measurement of today's complete exports/dependency request pipeline. For example, the existing
export projection also selects module naming and supporting contexts. An actual adapter must record
qualified claims it consumes and preserve identifying information it includes in the selected result.
The probe isolates newly produced surfaces from that larger selection; it must not be used to exempt
mechanical reads from exposure recording merely because the method is mechanical.

When Q-M supersedes the runtime association, Q-C is flagged through its actual delivery and result
membership. Q-D/Q-E/Q-S are not flagged through shared entity identity. Q-I's original result receives
a membership cause without inventing exposure to its own output. After Q-R supersedes Q-M's association,
Q-C keeps its historical Q-M cause; fresh access discloses the later Q-R declaration. No cause is cleared
and no original association is reinstated. Earlier suites cover inventory/selection scope and timing.

A warning does not revoke a mechanical method guarantee over its original basis. It indicates the
retained-information concern under the specified propagation rules. Determining whether an existing
answer needs changing remains qualified analysis. No new cross-basis invalidation rule, semantic
dependency mechanism, policy gate or priority by producer kind is introduced.

## Recommendation and remaining decisions

Proceed with a generalized Investigram: an immutable, qualified **analysis contribution bundle**.
Use the existing content/association/provenance model for both kinds of producer, while keeping
producing method separate from epistemic guarantee. Generalize the content responsibility beyond
"Interpretation content"; `analysis content` is a working name, not a new adopted term.

The probe supports this direction without another correction system or producer-specific entity
model. It also identifies concrete planning work:

- Map native module/symbol/claim/context/evidence records into complete common contracts and exact
  application access. Preserve native identity/reuse and typed Lens meaning; the four small example
  contracts are not a finished provider schema.
- Represent producer attribution at the right analysis/contribution boundary when one request runs
  several methods. No common envelope should require an agent or assign one guarantee to all output.
- Decide which native producers join the first capability and retain the existing outcome distinctions
  for failed/partial work. Migration effort should not determine the conceptual split; the implementation
  still needs a reviewable bounded scope.
- Verify at least one actual mechanical contribution followed by an interpreting investigation in the
  supported Session lifetime. Authored examples cannot establish adapter correctness or agent compliance.

There is no new foundational choice needed to describe complementary static/runtime information.
The remaining choices concern the complete contracts and first implementation boundary. We have not
proved that every existing provider can migrate without further findings.

## Verification

Run `python3 notes/structured-account-example/unification/check-unification.py`.
`--write` regenerates [the report](report.json). The checker validates seven accepted contributions,
later symbol introduction, exact identity reuse on access, separate production bases, preserved
qualification, complementary associations, supersession in both directions, original snapshots,
result/exposure causes and fresh cause standing. It rejects **12 malformed cases atomically**, including
invalid provider references, forged producer attribution, unsupported producer/type, missing basis/scope, inconsistent target status,
unknown entity/displacement targets, duplicate item keys, missing grounds and identity collision.

Those checks validate representation and lifecycle. They do not establish native method execution,
semantic truth, runtime behavior, performance, complete provider migration or end-to-end acceptance.
No product, governing or foundation files are changed.
