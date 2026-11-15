# One retained follow-up option and its invocation

Updated 2026-11-15. Executing retained follow-up options through the supported application boundary
is in scope for the planned capability, including focused live validation. The Follow-up investigation
Lens name and request serialization here remain illustrative; this probe is not an implemented
product API or a global discovery/menu design. The initial investigation is an authored precondition. [Payload tour](metadata-payload.md) shows current ownership.

Options are qualified metadata owned by exact investigrams. Their address differs
from the entity/result through which they are made available and supplied as context.
Changing an association does not migrate an option or rewrite an earlier invocation.

## Return and invoke the option

Both partitions put `concurrent-callers-option` on ADMISSION-1. Its label and purpose
concern concurrent callers/trial outcomes in the stated single-trial scope. Its focus
is S, initially a local introduction reference; its method is the stipulated supported
qualified architectural interpretation method. It declares no additional parameters.
Its qualification says this is a question, not an assertion of a concurrency outcome
or certification of admission coverage. Source basis and applicable qualification remain.

After allocation the relevant request fields are:

```json
{
  "id": "Q2",
  "operation": "follow-up-investigation",
  "subject": {"entity": "RESULT-Q1"},
  "option": {"investigram": "ADMISSION-1", "optionKey": "concurrent-callers-option"},
  "parameterValues": {},
  "resultEntity": "RESULT-Q2"
}
```

The actual [mixed ledger](context-and-bindings.json) and [partitioned ledger](children/context-and-bindings.json)
also capture basis/evidence, deliveries, architectural focus and explicit navigation
origin. The request is selected structurally; `informationNeed` is documentary wording,
not a human-authored query parameter. The option's purpose/scope supplies the delegated
question under a supported method. An investigator cannot create an executable Lens
by naming an unsupported method.

RESULT-Q1 is the request subject/context, ADMISSION-1 is the metadata owner, and S is
the architectural focus. Receiving the option preserves all three. The original result
and its bundles are not extended or reorganized by Q2. Q2 contributes independently,
including its new designation for RESULT-Q1. An exact option address alone does not
establish human navigation history.

<a id="optional-diagram-contract"></a>
## General interpretation versus a promised diagram

The existing concurrent-callers option promises a qualified interpretation of its
question. Its prospective result contract is an investigram with valid supported
content, association declarations, references, evidence, qualifications and result designation.
The authored result chooses interaction and state-behavior types; the option does not
mandate those types, and a sufficient qualified prose investigram is not disallowed by
its result-shape contract. Whether an investigram adequately answers the question remains
an interpretive assessment, not a schema check.

A different selectable option could promise **Generate a state diagram of recovery
behavior**. This is a conceptual specialization example, not another executed fixture
or a new global Lens. It must name its target and scope; for the existing recovery
item that means scenario breaker R under the qualified default-sampling setup, not
an unqualified general model of all P instances.

| Contract aspect | Explain recovery behavior | Generate a state diagram of recovery behavior |
| --- | --- | --- |
| Investigation output | Qualified investigram; investigator chooses useful supported types. | Qualified investigram containing state-behavior data sufficient for the requested diagram and scope. |
| Content validation | Validate each type actually returned, its references and qualifications. | Additionally require the state-diagram information: bearer, states, transitions and applicable conditions/support, with explicit omissions. A concept tag alone does not satisfy this. |
| Presentation promise | A compatible general presentation; diagrams are available when supported content is present. | A compatible diagram Presentation generates the state diagram from the supplied architectural meaning. It may arrange and label content but cannot invent transitions or conditions. |
| Partial information | Explain the supported conclusions and limits. | If the contract permits a partial diagram, render it with visible scope and omissions; do not imply completeness. Otherwise report the diagram request as unmet. |
| No supported state model | A qualified explanation of what is known may still be useful. | Preserve the qualified explanation, but explicitly report that the requested diagram could not be supplied. Prose alone is not successful fulfillment of the diagram promise. |

This separates the investigator's content obligation from rendering. A valid specialized
payload is necessary but not sufficient for successful diagram presentation; missing
compatibility or rendering failure cannot be reported as a completed diagram request.
Conversely, a well-shaped state model is not proof that the interpretation is true.
The existing [recovery diagram and legend](recovery-state.md) illustrate suitable
content/presentation, but do not demonstrate the specialized invocation or its failure
handling. Exact encoding and validation of such optional requirements remain design
work; the JSON option and checkers retain their original general result contract.

## Delivery and later association changes

The [mixed access probe](followup-option-access.json) and [partitioned access probe](children/followup-option-access.json)
record these boundaries:

- An exact option excerpt with qualification/basis/provenance is substantive guidance
  delivered through RESULT-Q1, with exact owner/key and generating provenance. It does not
  expose every association of RESULT-Q1, supply an association inventory, deliver the source
  bundle or fulfill the instruction to acquire complete target support before displacement.
- The actual Q2 delivery separately includes full original result declarations/members.
  This fulfills the acquisition instruction for the two targeted supersessions; mechanical
  enforcement of that completeness instruction is deferred. It is not a universal full-history default for invoking an option.
- ADMISSION-1 and its option remain unchanged. Association displacement notices concern
  exact designated information; no whole-owner replacement automatically invalidates,
  transfers or reissues the option. Its suitability after changes remains qualified
  selection work, not a lifecycle inferred from the owner ID.
- ADMISSION-2 does not repeat the option because TRIAL-1 already answers it. Selecting
  that option key on ADMISSION-2 fails, with no fallback to the old owner. This is an
  authoring choice, not a rule that options are always unanswered or temporally next.

The exact original result snapshot stays fixed. Fresh access and further acquisition
are separate. Human browsing is not investigator exposure; actual substantive delivery
is. A separately requested mechanical association inventory creates inventory exposure, not
content exposure to each entry. A substantive option label/purpose is qualified interpretation;
it cannot be treated as a mechanical reference just because it is metadata. The inventory
probe does not define an option-discovery inventory or its change rules. There is no new
guidance child, mutable option registry or automatic rerun.

## What the probe establishes

The [guidance checker](check-guidance.py) resolves the exact owner/key and supported method,
preserves source qualification/provenance, rejects wrong namespaces, undeclared parameters
and owner fallback, and verifies exact qualified option delivery through its result context. It also checks direct diagram
selection independently of recommendations. See [all checks](README.md#verification).

This exercises one structured invocation chain. Overview/Explain and structural listings
remain surrounding application examples. It does not design global entry routes, test a
live agent, or settle which old options should be offered after an association changes.
