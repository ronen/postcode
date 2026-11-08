# Upcoming work

Last considered: 2026-11-08

A living document for keeping track of upcoming work and deciding what order to
do it in, updated at each major checkpoint. It is a planning aid, not a governing
document.
The [backlog](../docs/backlog.md), [candidate capabilities](candidate-capabilities.md),
and [candidate UX](candidate-ux.md) hold the broader inventories.

The current focus is useful investigation of a software project through established
architectural concepts, with retained, qualified accounts that humans and agents
can use in their design work. Comparison with capable general-purpose agents can
inform evaluation; specialization does not depend on first demonstrating superiority.

<a id="kinds-of-work"></a>
<a id="legend"></a>
## Legend

<style>
.upcoming-work-legend {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 0.6em;
  font-size: 0.85em;
  line-height: 1.15;
}
.upcoming-work-legend th, .upcoming-work-legend td {
  border: 1px solid #cbd5e1;
  padding: 2px 6px;
  text-align: left;
  vertical-align: top;
}
.upcoming-work-legend th:first-child, .upcoming-work-legend td:first-child { width: 2em; }
.upcoming-work-legend th:nth-child(2), .upcoming-work-legend td:nth-child(2) { width: 17em; }
</style>

<table class="upcoming-work-legend">
  <thead>
    <tr><th scope="col">Icon</th><th scope="col">Kind</th><th scope="col">Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td>🐛</td><td>Defect</td><td>Supported behavior is wrong or violates its contract.</td></tr>
    <tr><td>🚧</td><td>Limitation</td><td>A boundary on what the system supports or guarantees that we may want to remove.</td></tr>
    <tr><td>✦</td><td>Missing capability</td><td>Something useful the system cannot yet do.</td></tr>
    <tr><td>⚠️</td><td>Open product / architectural question</td><td>An unresolved choice that could change scope, direction, or dependencies.</td></tr>
    <tr><td>🧹</td><td>Maintenance / housekeeping</td><td>Upkeep that keeps the repository and development environment accurate and usable.</td></tr>
  </tbody>
</table>

<a id="size-markers"></a>

<table class="upcoming-work-legend">
  <thead>
    <tr><th scope="col">Icon</th><th scope="col">Size</th><th scope="col">Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td>🐝</td><td>Quick</td><td>Well understood and likely cheaper to finish than carry through more planning.</td></tr>
    <tr><td>🧱</td><td>Large</td><td>Substantial effort; worth breaking into useful stages.</td></tr>
    <tr><td></td><td>Ordinary or uncertain</td><td>(No size marker)</td></tr>
  </tbody>
</table>

<a id="dependencies-and-decision-points"></a>
## Dependencies and decision points

Dashed arrows show conditional contributions or useful design input.
Codes identify items independently of ordering.

```mermaid
flowchart TD
    ACCOUNT["✦ ⚠️ ACCOUNT — Structured architectural accounts"] -. Content and qualification contracts .-> PRESENT["⚠️ ✦ PRESENT — Account presentation and navigation"]
    PRESENT -. If a dedicated working surface is needed .-> GUI["✦ GUI — Bounded graphical investigation 🧱"]
    AGENT["✦ ⚠️ AGENT — External-agent investigation and exchange"]

    classDef default fill:#dbeafe,stroke:#64748b,color:#172554
```

<a id="tentative-ordering"></a>
## Tentative ordering

| Position | Item | Why here / what could change it |
| --- | --- | --- |
| Next: bounded capability planning | [ACCOUNT — Structured architectural accounts](#account) | Use the completed exploration's connected account examples to choose a first implementation slice with PRESENT. Admission → trial → correction is a candidate; composition can test extension across accounts. |
| Plan alongside ACCOUNT | [PRESENT — Account presentation and navigation](#present) | Choose the minimum presentation and navigation needed to exercise that slice, including qualifications and access to earlier answers. The exploration supplies examples, not a settled interface. |
| Movable, when a concrete exchange needs it | [AGENT — External-agent investigation and exchange](#agent) | Support external design or implementation agents requesting investigations or using retained accounts. Assess existing CLI support first; neither structured accounts nor a preceding human GUI journey is a prerequisite. |
| Conditional on interaction needs | [GUI — Bounded graphical investigation](#gui) | Build a dedicated working surface when its interactions are needed for the experiment or justified by its findings. Diagram presentation alone need not require the full GUI. |

<a id="item-catalog"></a>
## Item catalog

Alphabetical by code.

<a id="account"></a>
### ACCOUNT — Structured architectural accounts

- **Kind:** ✦ ⚠️
- **Outcome:** successive investigations can reuse, extend, or challenge retained
  architectural understanding while preserving evidence, qualifications,
  conflicts, and access to earlier accounts.
- **Scope:** a bounded slice drawn from the completed exploration's connected
  account examples, within the current Session lifetime. Assess structured
  investigram content and existing associations, retention, and replacement. Account shapes
  can follow the data needed by selected representations; a working account may
  comprise several investigrams.
- **Decision:** what structure and selection are actually needed? Distinguish
  revision status, applicability to a question, and the working selection for an investigation.
  Correspondence or synthesis requires qualified analysis. A universal schema,
  consolidated model, and general retrieval system are not assumed.
  Choose how the initial architectural subjects become available; a supplied
  fixture can test machinery without demonstrating end-to-end investigation.
- **Sources:** [journey outputs: connected account examples](initial-journey/cockatiel-account-examples.md),
  [journey findings: capability-planning inputs](initial-journey/design-findings.md#capability-planning-inputs),
  [backlog: architectural accounts through concrete journeys](../docs/backlog.md#explore-architectural-accounts-through-journeys),
  [decision: structured investigram content](../docs/decisions/structured-investigram-content.md).

<a id="agent"></a>
### AGENT — External-agent investigation and exchange

- **Kind:** ✦ ⚠️
- **Outcome:** external design and implementation agents can request useful
  investigations and consult qualified accounts during conversations held elsewhere,
  with clear scope, exact-result versus repeatable-request semantics, reference
  lifetime, captured basis, implementation mappings, and relevant origin.
- **Scope:** a bounded exchange selected for a concrete episode, including agent-led or mixed
  investigation. Assess existing CLI capabilities before choosing additional
  interfaces. Structured accounts, a GUI, participant-material ingestion, and
  persistence are not prerequisites by assumption. Preserve supplied PostCode
  provenance when output returns through repository material or contributions,
  so it is not mistaken for independent corroboration.
- **Source:** [backlog: external-agent investigation and context exchange](../docs/backlog.md#design-a-bounded-shared-context-interface-for-coding-agents).

<a id="gui"></a>
### GUI — Bounded graphical investigation

- **Kind:** ✦
- **Size:** 🧱 — a new graphical interface with integrated investigation flows
  and formative evaluation, even within the bounded first journey.
- **Outcome:** a useful graphical investigation on real repositories, with evidence,
  qualifications, originals, replacements, conflicts, and reconsideration visible.
  Evaluation includes sustained use and returning to earlier answers.
- **Scope:** the interaction needs established through the account examples and PRESENT,
  within the supported Session lifetime. May become several implementation plans.
- **Source:** [backlog: whole-journey UX review](../docs/backlog.md#review-the-investigation-ui-and-ux-as-a-whole).

<a id="present"></a>
### PRESENT — Account presentation and navigation

- **Kind:** ⚠️ ✦
- **Outcome:** useful architectural representations through which the human can
  change perspective, inspect qualifications, and revisit earlier or revised accounts.
- **Scope:** the representations and navigation needed for the selected account
  slice, coordinating with ACCOUNT and building on exact retained-answer presentation. Use
  established architectural notations where they fit. Generating a diagram
  cannot supply missing semantics or strengthen a claim. Additional perspective
  content may require investigation rather than another rendering of one account.
  Resolve composition, reference coordination, and View identity as needed by
  these interactions; broader GUI architecture follows concrete requirements.
- **Decision:** what belongs in the main representation versus optional detail,
  and how are partiality, disagreement, and revision made usable? Investigation
  lineage and architectural relationships remain distinct.
- **Sources:** [journey outputs: investigation script](initial-journey/cockatiel-investigation-script.md),
  [journey outputs: connected account examples](initial-journey/cockatiel-account-examples.md),
  [journey findings: implementation-validation checks](initial-journey/design-findings.md#implementation-validation),
  [backlog: Presentation representation, F5](../docs/backlog.md#decide-how-gui-presentations-and-their-parameters-are-represented),
  [backlog: additional-detail placement](../docs/backlog.md#review-more-details-information-placement),
  [backlog: navigation origins](../docs/backlog.md#assess-and-preserve-navigation-origin-lineage),
  [backlog: coordinated-View conformance](../docs/backlog.md#assess-conformance-when-extending-coordinated-views-and-state-scope).

<a id="principles-for-choosing-the-order"></a>
## Principles for choosing the order

Build a sound foundation for the next useful capability, with enough concrete
use to test whether the foundation is right.

- **Maintain progress toward a workable system:** balance housekeeping, bug fixes,
  and foundational work with steps that make PostCode useful end to end. Before
  regular use, bounded bugs and limitations can wait when they do not undermine
  current evaluation or create architectural debt in the work that follows.
- **Give extra weight to misleading behavior:** especially errors in answers,
  evidence, scope, or request reporting that people or evaluations rely on.
- **Resolve architectural debt before extending the affected area:** prioritize
  weaknesses that would spread into the next capability or interface.
- **Use concrete needs to settle uncertain architecture:** small representative
  journeys and experiments can establish requirements.
- **Implement the required case with a credible route to generalization:** keep
  current capabilities working and explain how later extension fits.
- **Make subsequent learning trustworthy:** fix a limitation before an assessment
  relies on the missing guarantee. Select research capture for the actual question;
  address recording or export gaps when that assessment depends on them.
- **Prefer bounded outcomes and stopping points:** improved behavior, an enabled
  next step, or a resolved uncertainty.
- **Clear small, well-understood items when convenient:** if finishing something
  costs less than carrying it through further planning, do it and remove it from
  the list. Especially useful for housekeeping, provided it doesn't disrupt
  focused work or conceal unresolved decisions.
- **Reorder as evidence changes:** findings, cost, and formative use can shift priorities.

For comparable items, favor greater user or research value, fewer dependencies,
less speculative design, and lower cost of later change.

<a id="checkpoint-review"></a>
## Checkpoint review

At substantial completions, consequential findings, or changes in priority:

- What is complete, and what remains unresolved?
- Which backlog items now merit inclusion? Have candidate ideas become relevant?
- Which listed items should move down, return to the broader inventory, or drop out?
- Have dependencies or conditional choices changed?

Update the selection, ordering, and rationale accordingly. Item codes stay stable
as priorities change; detailed outcomes and implementation history remain in
their existing records.
