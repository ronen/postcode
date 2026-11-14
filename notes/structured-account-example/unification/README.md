# Mechanical and agentic production: worked unification

> **Design update, 2026-11-14:** automatic provider renewal after displacement is no longer the
> agreed behavior. Equivalent mechanical recomputation reuses the established contribution without
> adding an association or changing standing. The adapter, renewal-history branches and associated
> contract details below still exercise the earlier choice and await alignment. Passing those checks
> does not verify the new policy. Explicit investigator withdrawal/addition remains a separate case.
> See [the wrapper agreement](../../structured-architectural-accounts-proposal.md#mechanical-analysis-wrapper-and-contribution-reuse).


Updated 2026-11-13. Exploratory design work, not an adopted contract or a product migration.
[Main inputs](contributions.json), [organizing-use renewal](organization-renewal.json),
[report](report.json) and [checker](check-unification.py) exercise
the common association/lifecycle model over a small [source fixture](source/loader.ts).
The producing methods and their outputs are **authored expected contributions**. No native
PostCode provider, live investigator, hypothetical constant-target analyzer or runtime execution
was run. Source digests identify these files; they do not certify an analyzer's output.

## Finding

A common investigram envelope works for the tested mechanically and agentically produced contributions.
Entity references, keyed content, association declarations, result designations, exact access,
qualification delivery and cause propagation share a common representation. Identity resolution
before acceptance still follows provider-specific rules. The important changes are a producer-neutral
content catalogue, structured identifying content, idempotent native-identity resolution and
attribution of method/basis to each producing investigram, including several methods in one acceptance. They are changes to the existing provenance and
qualification responsibilities, not additional accounts with a second correction mechanism.

Unification does **not** mean that everything addressable becomes an investigram. Raw source,
evidence records, evaluation outcomes, entities and selected Projections keep their roles.
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
| Q-C | A qualified selection uses the delivered Q-S and Q-I associations, without reading source | Its basis names those retained selections. RESULT-Q-C keeps each original owner, source basis, method, scope and guarantee. No synthesized complete graph is asserted. |
| Q-M | **Hypothetical** mechanical method establishes the restricted constant target; a separately attributed agentic analysis judges its use in place of the earlier inference | `CONSTANT-TARGET-1/dependency` retains the mechanical finding. The sole association to it, `TARGET-ORGANIZATION-1/runtime`, supersedes the earlier interpreted association. Submission-wide reachability preserves separate ownership without a duplicate association. One acceptance contains two differently attributed investigrams. Neither method was executed. |
| Q-R | Authored interpretation uses the retained mechanical finding and supplied source evidence to explain possible invocation versus observed use | `RUNTIME-REFINED-1/runtime` is an addition. The still-valid mechanical finding remains undisplaced, with its original guarantee; the new prose carries its own interpreted guarantee. |

Q-M separates calculation from the judgment to displace an earlier association. The organizing
agent compares the same conditional target, basis and assumptions and explains the change from
inferred to restricted mechanically established support. The constant-target method does not
author that judgment. A defined deterministic organizing policy could also produce such a
declaration under its own method attribution; no blanket rule makes all organization agentic.

Q-R is complementary information, so it does not remove the valid mechanical finding from current
selections. Cross-mechanism supersession remains possible when justified. Its qualified reason
should explain material changes of method, scope or guarantee; no mechanical/agentic precedence
is implied. Defer a minimum-guarantee selection mechanism: guarantees are scoped contracts, not
a universal ranked scale. Structural validation does not certify the judgment.

The final undisplaced `describes` associations for M-loader are exports, the source-request
account, the organizer's association to the mechanical finding, and the fuller interpreted
explanation. The mechanical bundle has no association of its own: the organizer's association
makes its item reachable across the submission. This is already supported by the common model;
no extra association kind or replacement-reference field is needed. The item retains mechanical
provenance and the declaration retains agentic provenance. Inventories and result membership
contain only one association to that item. Earlier interpretation and captured answers remain
available by exact reference.

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

`producer.kind` identifies the execution mechanism; this bounded probe exercises `mechanical` and
`agentic`. They are not an exhaustive taxonomy. Hybrid or other future producers should use the
same contribution contract with appropriate method attribution; their execution integration is
not specified here. The fixture's two-value validation is a current support limit, not a universal
model constraint. A hybrid label would not substitute for actual contributing-method provenance.
This is independent
of whether a particular claim is an interpretation, a recorded assertion or mechanically established
information. The existing agent-dialog runner and source-analysis provider boundary remain distinct;
they produce the same kind of retained contribution. Invoking a mechanical tool from an agent does
not change the tool contribution's producer. The agent's subsequent interpretation is separately
attributed. Here the agentic stages are authored stand-ins, not actual dialogs.

`provenance` in this probe materializes the existing responsibility for attributable producer
method and captured basis. Fixture acceptance bindings supply it on behalf of the host, rather
than trusting a submitted claim of producer authority. Single-method fixtures use a default;
Q-M uses `provenanceByInvestigram` with complete local-owner coverage and a separate invocation
basis. These are host-side fixture bindings, not additional investigator-authored authority fields.
The mechanical item and agentic organizing declaration retain different provenance even when
delivered together. Each delivered item/declaration retains
its owner's provenance. Claim-specific `qualification` remains with the item, and bundle-level
qualifications accompany it. A producer's kind does not manufacture a claim guarantee. Mechanical
contributions do not need model/agent identity or mandatory prose; interpreting producers retain
whatever agent/method attribution their actual execution requires.

The original common model assumed one fixture-wide basis. This branch carries a captured input
selection for each contribution: file digests/configuration for source analysis, exact retained
selections alone for Q-C, retained selections plus the supplied/cited loader and plugin source
for Q-R, and the retained comparison plus same-submission finding for the Q-M organizer. The invocation records their combined inputs without inventing one producer. Q-S's loader-source
basis is not substituted for Q-I's loader-plus-plugin basis when they are selected together.
These are different scopes of the same authored program state, not proof of identity continuity
across changing source states. The existing older fixtures keep their explicitly shared basis.

Four content contracts are registered in this checker; the shared model enforces their addressing,
introduction and association rules. In particular, an identifying item need not be the earlier
prose-shaped `entity-description/0`. A newly introduced entity still needs explicit identifying
content and an `identifies` association. A fresh allocation cannot steal an existing ID.

### Independent production exposure within one acceptance

Q-M also supplies host `exposureByInvestigram` bindings. CONSTANT-TARGET-1 has no retained-input
exposure. TARGET-ORGANIZATION-1 receives RUNTIME-1 plus the exact mechanical item produced in the
same submission. Their captured histories remain distinct, even though acceptance is atomic.
Per-invocation warning totals summarize the contributions; they do not supply inherited exposure.

The regression displaces the organizer's earlier input independently. The organizer and its readers
are flagged; the mechanical item and its exact-content reader are not. Fresh direct content access
also avoids the sibling's concern, while fresh organizing-association access discloses it. An
informed later reader does not acquire that already-known concern as a new cause. Original snapshots
and captured histories remain unchanged. A separate branch gives the mechanical producer actual
retained input: its later displacement reaches the mechanical finding and then the organizer that
received it. This tests the real dependency without inventing reverse exposure. All are authored
execution scenarios, not a live adapter or claims of semantic reliance.

### Provider re-encounter before acceptance

The [bounded host adapter](provider-identity.py) resolves provider + native ID + supported basis
scope before common acceptance. It takes the provider's repeated native output, binds known
identities to existing common entity IDs, and normalizes those references without requiring the
analyzer to inspect Session state. Native IDs (`typescript-native:…`) differ from common IDs
throughout the fixture. A genuinely different identity scope allocates fresh common IDs, with
no implied correspondence. The adapter uses reproducible UUIDs for new allocations in the probe;
this is not a proposed product allocation algorithm. The real provider retains its own continuity
rules, including what constitutes an identity scope. A source change is not universally a new scope. This is separate from recognized request reuse, which does no new
analysis and returns the existing Q/result.

The six branches exercise distinct cases:

- An identical Q-D2 rerun reuses the three **undisplaced** identifying associations when content,
  method/basis, evidence and qualification match. Host equality/reuse is recorded separately in
  the report; the analyzer received no old information, so deliveries, exposure and source-query
  dependencies remain empty. Its result still includes the reused associations. A later
  displacement creates a membership cause for that result, not an evaluation cause for Q-D2.
- A changed method keeps the entity IDs and adds newly qualified identifying items/associations.
- A different provider identity scope allocates three fresh common IDs for the same native keys,
  rather than treating their spelling as common IDs and rejecting a collision.
- Re-encounter also works with `provenanceByInvestigram`, not only one default producer.
- After supersession of an identification, a rerun resolves the same entity but renews its own
  identifying contribution as an addition; it does not reuse the displaced association.
- The same renewal behavior holds after withdrawal.

Renewal leaves the original displacement and any replacement association intact. It neither
reinstates the old association nor adjudicates a disagreement; a new identifying use may coexist
with a qualified alternative. The new output has its own provenance. These branches deliberately
model recomputation without receiving the organizing claim, so the adapter does not invent that
exposure or claim the analyzer considered it. Fresh delivery of the renewal nevertheless discloses
the recorded objection through the host-established history below.

This is a bounded reuse policy, not name-based deduplication or a claim that every provider has
the same fingerprint. Fresh common-ID allocation collisions remain invalid for any producer.

### Renewal history and disclosure

When exact qualified comparison finds only displaced matching identifications, the adapter records
`renewalHistory` on the new association through a host acceptance binding. It lists exact
`previousAssociations` and `establishedBy: authored/provider-qualified-equality@0`. The method
label attributes the comparison to the host; it does not claim the mechanical analyzer read or
answered the objection. The comparison remains bounded to the same provider identity, method,
basis, content, evidence and qualifications (ignoring the new-versus-existing introduction marker).
It is not inferred semantic equivalence between arbitrary accounts.

Fresh scope selections, exact association deliveries, excerpts and result deliveries include this
history and the earlier associations' qualified displacement reasons. The model follows exact
history links through further renewals, and also discloses history when the renewal arrives as a
substantive notice. An inventory of addresses alone does not deliver that material. A reused
renewal retains its history; equality reuse cannot strip it on the next run.

The historical references do not deliver earlier items or make the earlier associations uses of
the new result. Displacement notices retain their own provenance. Subsequent investigators are
exposed to the reasons they actually receive; the rerun analyzer is not retroactively exposed.
Already accepted displacements are disclosed history, not later reconsideration causes. The
renewal link adds no automatic propagation rule or clearance. New deliveries must preserve the
history and notices; altered or missing disclosure is rejected.

This is narrowly host-established metadata, not a new investigator assertion of equality. Common
acceptance checks exact prior references, same target, prior displacement, addition ownership and
attribution. The adapter establishes equality. Product adapter verification remains required.

### Changing the organizing use while keeping the finding

The [Q-O input](organization-renewal.json) receives the organizer's association and its mechanical
item, then submits two declarations atomically:

1. Withdraw `TARGET-ORGANIZATION-1/runtime`, with grounds rejecting its use as the preferred
   replacement for the earlier inference.
2. Add `TARGET-REORGANIZATION-1/retain-finding`, referencing the original
   `CONSTANT-TARGET-1/dependency` as complementary information.

The mechanical item is not copied, recalculated or requalified. Its original source owner, method,
basis and guarantee accompany the new association. The original interpretation's association
remains displaced, and earlier captured answers remain fixed. Results using the withdrawn
organizing association acquire the ordinary membership concern. This is a changed organizing use,
not clearance of earlier concerns or reversal of the old supersession.

The checker also exercises an explicit optional addition referencing the earlier interpretation's
original item. Both pieces of information then coexist under new associations with their original
qualifications. Merely withdrawing the organizer would omit the requested "keep the finding" part;
withdrawal-plus-addition expresses it without a new lifecycle operation. Declaring supersession
of an independently associated replacement remains unnecessary for this case. These agentic
reassociations do not receive the automatic provider-equality history field.

## Production, selection and outcomes remain distinct

The probe's invocations separate discovery, export inspection and dependency investigation for
clarity. This is not a rule that each internal compiler phase needs a public query result.
A real request may use multiple analyses or already retained contributions. Attribute each output
to its actual producing method and basis; do not assign the last method to every selected item.
An answer's selection of earlier material does not change its producer or reparent its children.

Q-E demonstrates several bundles accepted together. Incremental later work is a new contribution,
not a mutation of the discovery bundle. A generalized investigram is not the complete evaluation,
transaction, query result or Projection. Partial outcomes and prerequisites still need their own
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
qualified deliveries are recorded. Q-M's organizer receives the association it replaces; Q-R
receives the organizer's association and its mechanical item, plus the supplied source evidence,
without displacing that association.
The same delivery machinery works for mechanical consumers of retained contributions: actual reads
matter, not whether the consumer happens to be an agent. Bare IDs remain distinct from claim delivery.

The zero retained-information exposure on these authored mechanical contributions is not a
measurement of today's complete exports/dependency request pipeline. For example, the existing
export Projection also selects module naming and supporting contexts. An actual adapter must record
qualified claims it consumes and preserve identifying information it includes in the selected result.
The probe isolates newly produced surfaces from that larger selection; it must not be used to exempt
mechanical reads from exposure recording merely because the method is mechanical.

When Q-M's organizing declaration supersedes the runtime association, Q-C is flagged through
its actual delivery and result membership. Q-D/Q-E/Q-S are not flagged through shared entity
identity. Q-I's original result receives a membership cause without inventing exposure to its own
output. Q-R's addition does not create an exact-displacement cause or reach Q-C, which did not
receive an inventory. Q-C retains its organizing-declaration cause. Earlier suites cover additions
to acquired inventory/selection scopes, cause timing and fresh standing.

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
- The human chose all currently supported mechanical architectural information, in stages. Map
  detailed migration milestones and retain failed/partial outcome distinctions. New analyzers and
  provider-suppression policy are outside the scope; physical storage and provider algorithms need
  not be replaced merely to expose their contributions through the common model.
- Verify at least one actual mechanical contribution followed by an interpreting investigation in the
  supported Session lifetime, including a mechanical consumer of retained claims (for example, export
  Projection reading module naming). Check that those reads create actual qualified deliveries and
  exposure, and that later displacement reaches the consumer. Include native identity re-encounter.
  Authored examples cannot establish adapter correctness or agent compliance.

There is no new foundational choice needed to describe complementary static/runtime information.
The remaining choices concern the complete contracts and first implementation boundary. We have not
proved that every existing provider can migrate without further findings.

## Verification

Run `python3 notes/structured-account-example/unification/check-unification.py`.
`--write` regenerates [the report](report.json). The checker validates seven accepted invocations
plus six provider re-encounter branches, organizing withdrawal-plus-addition and optional explicit
restoration of earlier content, later symbol introduction, exact answer reuse, separate
production bases, mixed-method acceptance, complementary additions, qualified supersession,
original snapshots and result/exposure causes. It rejects **38 malformed cases atomically**, including
empty native identity, forged producer attribution, unsupported producer/type, missing basis/scope, inconsistent target status,
unknown entity/displacement targets, duplicate item keys, missing grounds, incomplete/ambiguous
per-investigram provenance, fresh common-ID allocation collisions and an unreachable mechanical
item. Renewal checks additionally reject forged/invalid host history and missing or altered
history/displacement-reason delivery. A new identity scope is a positive allocation case, not
a malformed contribution.

Those checks validate representation and lifecycle. They do not establish native method execution,
semantic truth, runtime behavior, performance, complete provider migration or end-to-end acceptance.
No product, governing or foundation files are changed.
