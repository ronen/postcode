# Experimental structured outputs during early development

Status: in preparation
Arising from: [Explicit Lenses and qualified request resolution](../plans/lens-request-model.md)
Scope: temporary compatibility policy for structured application outputs, and the specific output changes in the Lens request-model work
Supersedes:
- [Qualified construction — Separate Projection identity from presentation and reporting identity](qualified-projection-construction.md#separate-projection-identity-from-presentation-and-reporting-identity): only the schema-name/field-layout and wording preservation restrictions that prevent the request-model changes enumerated below.

## Context

The current text/JSON and observation structures were designed for experimentation. There are no known durable consumers inside or outside PostCode; temporary GUI wireframes do not create a compatibility requirement. Preserving earlier shapes now would carry lookup-as-parameter fields and a lens-shaped usage descriptor into a model intended to distinguish those meanings.

## Decisions

### Permit direct changes to affected experimental outputs

#### Decision

For now, structured application outputs are experimental and subject to change without notice. Approved work may change affected JSON and observation payloads directly, without compatibility aliases, dual formats, adapters, deprecation periods or historical migration. Leave existing observation files untouched and introduce no historical-reader promise. Tests and current documentation describe the actual new format.

This policy permits the Lens request-model work to separate request/designation/parameters, express resolution and usage results without faux program Views, expose actual outcome/attribution, and change affected Projection descriptors and arrangement/report identity inputs. Replace the qualified-construction decision's schema-name/field-layout and wording preservation clauses only for those changes. Semantic qualification, source disclosure, ordering/omission behavior outside the explicit changes, immutable retained support and current retention/retry rules are not compatibility details to discard.

Existing experimental schema labels identify output families, not supported compatibility versions. They may remain or be renamed when the family changes; a field change alone does not require a label bump under this temporary policy. Keep actual labels unambiguous in current producers/tests/docs. Continue to version responsible identity methods when semantics change; experimental wire-format policy does not waive method provenance.

#### Rationale and alternatives

No current durable consumer benefits from maintaining an obsolete shape. A compatibility layer or mandatory format-version migration would add work without preserving a supported use. Conversely, declaring outputs experimental does not permit arbitrary loss of information or silent supersession of other decisions.

#### Consequences

Inventory affected preservation clauses with each approved change. This policy does not automatically revoke every historical schema prescription. This decision changes the qualified-construction provisions above; later unrelated changes reconcile any other binding prescriptions when they arise. The companion [request-model decision](lens-application-and-request-outcomes.md) handles retention and identity semantics rather than treating them as formatting changes.

### Establish supported schemas when durable consumption becomes a requirement

#### Decision

Before treating structured outputs as a supported integration contract, define deliberate versioning, published schemas and compatibility obligations for their consumers. The current policy is a development-stage choice, not a permanent exemption. That later design does not add schema infrastructure or migration duties to this early development work.

#### Rationale and consequences

Durable consumers need explicit promises. Introducing those promises when supported use is designed allows their scope to reflect actual needs. Revisit this policy when such consumption is proposed, rather than assume present experimental labels already establish it.
