# Experimental structured outputs during early development

Status: in preparation
Arising from: [Explicit Lenses and qualified request resolution](../plans/lens-request-model.md)
Scope: temporary compatibility policy for structured application outputs, and the specific output changes in the Lens request-model work
Supersedes: [Qualified construction — Separate Projection identity from presentation and reporting identity](qualified-projection-construction.md#separate-projection-identity-from-presentation-and-reporting-identity), the whole headed decision, jointly with [Lens application and request outcomes](lens-application-and-request-outcomes.md) and [Qualified construction under the request model](qualified-construction-under-the-request-model.md). Their [mapping](qualified-construction-under-the-request-model.md#supersession-mapping) carries forward its unaffected identity, qualification and reporting commitments.

## Context

The current text/JSON and observation structures were designed for experimentation. [Command-scoped observations](transient-analysis-sessions.md#command-scoped-observations-with-session-correlation) already require an explicitly versioned experimental batch without backward-compatibility or historical-reading promises. This decision preserves that policy and distinguishes its envelope version from experimental output-family schema labels. There are no known durable consumers inside or outside PostCode; temporary GUI wireframes do not create a compatibility requirement. Preserving earlier shapes now would carry lookup-as-parameter fields and a lens-shaped usage descriptor into a model intended to distinguish those meanings.

## Decisions

### Permit direct changes to affected experimental outputs

#### Decision

For now, structured application outputs are experimental and subject to change without notice. Approved work may change affected JSON and observation payloads directly, without compatibility aliases, dual formats, adapters, deprecation periods or historical migration. Leave existing observation files untouched and introduce no historical-reader promise. Tests and current documentation describe the actual new format.

This policy permits the Lens request-model work to separate request/designation/parameters, express resolution results and usage reports without faux program Views, expose actual outcome/attribution, and change affected Projection descriptors and arrangement/report identity inputs. The whole-unit replacement relaxes the former schema-name/field-layout and wording preservation prescriptions for those changes; its other commitments are restated in the companion construction decision. Semantic qualification, source disclosure, ordering/omission behavior outside the explicit changes, immutable retained support and current retention/retry rules are not compatibility details to discard.

Output-family strings such as `postcode-*-view/1-experimental` and `postcode-investigation-usage/1-experimental` identify experimental families rather than supported compatibility versions. They may remain or be renamed when the family changes; a field change alone does not require a label bump under this temporary policy. This does not apply to the observation batch's numeric `formatVersion`. Advance that envelope from 1 to 2 for the changed request/outcome records and non-View publication contract in this work, retaining batch/session/command correlation and batch-local event/artifact UUIDs. This is an explicit format distinction, not a migration or historical-reader promise. Keep labels unambiguous in current producers/tests/docs and continue to version responsible identity methods when semantics change.

#### Rationale and alternatives

No current durable consumer benefits from maintaining an obsolete shape. A compatibility layer or mandatory format-version migration would add work without preserving a supported use. Conversely, declaring outputs experimental does not permit arbitrary loss of information or silent supersession of other decisions.

#### Consequences

Inventory affected preservation clauses with each approved change. This policy does not automatically revoke every historical schema prescription. The qualified-construction heading has a complete replacement under the mapping above, and command-scoped observation versioning remains in force. Later unrelated changes reconcile any other binding prescriptions when they arise. The companion [request-model decision](lens-application-and-request-outcomes.md) handles retention and identity semantics rather than treating them as formatting changes.

### Establish supported schemas when durable consumption becomes a requirement

#### Decision

Before treating structured outputs as a supported integration contract, define deliberate versioning, published schemas and compatibility obligations for their consumers. The application specification's [coding-agent context artifact](../app-specification.md#shared-context-for-external-coding-agents), if implemented for consumption by different agents, is such a supported-consumption case and must be documented and stable enough for that use. The current policy is a development-stage choice, not a permanent exemption. That later design does not add schema infrastructure or migration duties to this early development work.

#### Rationale and consequences

Durable consumers need explicit promises. Introducing those promises when supported use is designed allows their scope to reflect actual needs. Revisit this policy when such consumption is proposed, rather than assume present experimental labels already establish it.
