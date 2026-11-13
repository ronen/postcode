# Upcoming work

Last considered: 2026-11-13

A living document for keeping track of upcoming work and deciding what order to
do it in. Major checkpoints are useful occasions to reconsider it in strategy
discussion. It is a planning aid, not a governing document.
The [backlog](../docs/backlog.md), [candidate capabilities](candidate-capabilities.md),
and [candidate UX](candidate-ux.md) hold the broader inventories.

Maintain this document through human-led strategy discussion. Edit it only when
the human explicitly requests changes to this document; general authorization to
prepare or promote a planning package does not include it. Report implications
for upcoming work separately rather than including proposed revisions in the package.

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

Solid arrows show prerequisites; dashed arrows show conditional contributions or useful design input.
Codes identify items independently of ordering.

```mermaid
flowchart TD
    ACCOUNT["✦ ⚠️ ACCOUNT — Structured architectural accounts"] --> SLICE["⚠️ SLICE — First usable graphical investigation scope"]
    SLICE --> PRESENT["⚠️ ✦ PRESENT — Account presentation and navigation"]
    PRESENT --> MINIGUI["✦ MINIGUI — Minimal graphical investigation"]
    MINIGUI -. Needs demonstrated through use .-> GUI["✦ GUI — Broader graphical investigation 🧱"]
    AGENT["✦ ⚠️ AGENT — External-agent investigation and exchange"]

    classDef default fill:#dbeafe,stroke:#64748b,color:#172554
```

<a id="tentative-ordering"></a>
## Tentative ordering

| Position | Item | Why here / what could change it |
| --- | --- | --- |
| Next: plan and implement | [ACCOUNT — Structured architectural accounts](#account) | Exercise the account mechanism through representative, plausibly useful investigations and diagrams. Admission → trial → correction is a candidate; composition can test extension across accounts. |
| After ACCOUNT | [SLICE — First usable graphical investigation scope](#slice) | Select a coherent first offering using the journey exploration and ACCOUNT's demonstrated capabilities and limitations. Identify any additional capability work needed. |
| After SLICE | [PRESENT — Account presentation and navigation](#present) | Build representations, qualifications, and navigation for the selected experience, using implemented accounts. Any additional capability prerequisites depend on SLICE's selection. |
| After PRESENT | [MINIGUI — Minimal graphical investigation](#minigui) | Build a small graphical surface for actual human investigation using the available account and presentation capabilities. |
| Movable, when a concrete exchange needs it | [AGENT — External-agent investigation and exchange](#agent) | Support external design or implementation agents requesting investigations or using retained accounts. Assess reusable investigation and exchange capabilities; neither retaining the interactive CLI, structured accounts, nor a preceding human GUI journey is a prerequisite. |
| Following experience with MINIGUI | [GUI — Broader graphical investigation](#gui) | Extend the graphical experience where sustained use identifies valuable capabilities. May become several plans. |

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
  investigram content and existing associations, retention, and replacement.
  Choose plausibly useful investigations and diagrams with credible investigative
  purposes, avoiding cases contrived to fit the mechanism. Proven user value is
  not required here; SLICE selects the initial user-facing offering separately.
  Extend the application answer-content contracts so direct and exact access
  preserve the new structure and its qualified support.
  Account design and implementation must carry the semantic content needed by
  a small set of representative architectural diagrams—for example,
  structural, state, or interaction views. Their distinct information needs
  guide account structure; a working account may
  comprise several investigrams. The examples span policy kinds, instance roles,
  states, and executions; responsibility-focused investigation can inform those
  accounts without requiring a separate Lens. Preserve the known account/answer
  origin of follow-up selections, independently of evidence support or human reliance.
- **Decision:** what structure and selection are actually needed? Distinguish
  revision status, applicability to a question, and the working selection for an investigation.
  Correspondence or synthesis requires qualified analysis. A universal schema,
  consolidated model, and general retrieval system are not assumed.
  Choose how the initial architectural subjects become available; a supplied
  fixture can test machinery without demonstrating end-to-end investigation.
  Define the meaning of offered questions so it does not depend on the human's
  unspoken purpose; PRESENT can build their discoverable presentation.
- **Validation:** demonstrate within ACCOUNT that the selected diagrams can be
  generated from retained account content without reconstructing missing
  architectural meaning during rendering. Universal notation support and stored
  layout choices are not required. Success establishes faithful support for the
  selected investigations, not their suitability for the first user-facing offering.
- **Sources:** [journey outputs: connected account examples](initial-journey/cockatiel-account-examples.md),
  [journey findings: capability-planning inputs](initial-journey/design-findings.md#capability-planning-inputs),
  [backlog: architectural accounts through concrete journeys](../docs/backlog.md#explore-architectural-accounts-through-journeys),
  [candidate capabilities: responsibility-focused investigation](candidate-capabilities.md#responsibility-focused-investigation),
  [backlog: navigation origins](../docs/backlog.md#assess-and-preserve-navigation-origin-lineage),
  [decision: structured investigram content](../docs/decisions/structured-investigram-content.md).

<a id="agent"></a>
### AGENT — External-agent investigation and exchange

- **Kind:** ✦ ⚠️
- **Outcome:** external design and implementation agents can request useful
  investigations and consult qualified accounts during conversations held elsewhere,
  with clear scope, exact-result versus repeatable-request semantics, reference
  lifetime, captured basis, implementation mappings, and relevant origin.
- **Scope:** a bounded exchange selected for a concrete episode, including agent-led or mixed
  investigation. Assess the complete qualified content, precise references and
  operational reports now available through the
  [shared application API](../docs/architecture/README.md#application-entry)
  before choosing an external-agent interface. The internal Node entry does not
  itself provide an external transport or establish disclosure permissions. Reuse of
  those capabilities does not depend on retaining the interactive human command
  shell; any continuing command-line interface should serve concrete agent needs.
  Structured accounts, a GUI, participant-material ingestion, and
  persistence are not prerequisites by assumption. Preserve supplied PostCode
  provenance when output returns through repository material or contributions,
  so it is not mistaken for independent corroboration.
- **Source:** [backlog: external-agent investigation and context exchange](../docs/backlog.md#design-a-bounded-shared-context-interface-for-coding-agents).

<a id="gui"></a>
### GUI — Broader graphical investigation

- **Kind:** ✦
- **Size:** 🧱 — broader integrated investigation flows and formative evaluation;
  likely several implementation plans.
- **Outcome:** a graphical experience that supports sustained investigation on real
  repositories beyond the first bounded slice.
- **Scope:** needs demonstrated through MINIGUI use. Workspace management, richer
  layouts, persistence, and customization are possible extensions, selected for
  their value rather than assumed prerequisites for useful graphical investigation.
- **Source:** [backlog: whole-journey UX review](../docs/backlog.md#review-the-investigation-ui-and-ux-as-a-whole).

<a id="minigui"></a>
### MINIGUI — Minimal graphical investigation

- **Kind:** ✦
- **Outcome:** a usable graphical slice for investigating one project, so human-use
  evaluation can test more than typing commands and reading text results.
- **Scope:** the experience selected by SLICE: a few account presentations and diagrams, selection of subjects and
  offered questions, following relationships, and returning to earlier or corrected
  answers with their qualifications. Build on completed ACCOUNT and PRESENT: accounts
  supply content, Presentations make it intelligible, and this item supplies the
  controls and interaction flow within the supported Session lifetime. Extend the
  API as needed within this task; full Workspace management and customization can wait.
- **Decision:** choose GUI hosting and execution arrangements around the current
  in-process Node API. Synchronous compiler work cannot be preempted on its calling
  thread; preserve responsiveness, interruption and cleanup without assuming the
  API already supplies a browser runtime or transport.
- **Validation:** use the slice for actual investigation, including follow-up and
  reconsideration. CLI checks remain useful for core verification but do not
  establish the usefulness of the human experience. Once usable, trigger the
  [CLI retirement checkpoint](#cli-retirement-checkpoint).
- **Sources:** strategy discussion: a graphical surface for first practical human use;
  [journey outputs: investigation script](initial-journey/cockatiel-investigation-script.md),
  [journey findings: implementation-validation checks](initial-journey/design-findings.md#implementation-validation).

<a id="present"></a>
### PRESENT — Account presentation and navigation

- **Kind:** ⚠️ ✦
- **Outcome:** useful architectural representations through which the human can
  change perspective, inspect qualifications, and revisit earlier or revised accounts.
- **Scope:** the representations and navigation needed for the experience selected
  by SLICE, using implemented ACCOUNT capabilities and exact retained-answer presentation.
  Extend the API as needed within this task. Use
  established architectural notations where they fit. Generating a diagram
  cannot supply missing semantics or strengthen a claim. Additional perspective
  content may require investigation rather than another rendering of one account.
  Resolve composition, reference coordination, and View identity as needed by
  these interactions; broader GUI architecture follows concrete requirements.
  Use complete qualified API content and precise subject/answer IDs rather than
  CLI output or compact-alias arrangement. Clients own Presentation declarations
  and rendering; application coordination matches their captured requirements.
  Make subject-specific questions discoverable, with new investigation distinct
  from displaying retained detail. Show consequential conditions and corrections
  while preserving access to earlier answers. Explore returning to a useful
  surrounding account; keeping it always visible remains a hypothesis.
- **Validation:** build on ACCOUNT's diagram validation with a bounded
  presentation and navigation demonstration, using an export or standalone renderer
  if sufficient. Check semantic fidelity, consequential scope and uncertainty,
  traceability to account content, and revised versus exact earlier answers.
  Successful rendering alone is insufficient; MINIGUI supplies the first
  interactive human-use evaluation.
- **Decision:** what belongs in the main representation versus optional detail,
  and how are partiality, disagreement, and revision made usable? Investigation
  lineage and architectural relationships remain distinct.
  Use structured qualification where it serves the selected interactions, without
  requiring a general visual taxonomy or a project-wide overview.
- **Sources:** [journey outputs: investigation script](initial-journey/cockatiel-investigation-script.md),
  [journey outputs: connected account examples](initial-journey/cockatiel-account-examples.md),
  [journey findings: implementation-validation checks](initial-journey/design-findings.md#implementation-validation),
  [candidate UX: discoverable questions](candidate-ux.md#discoverable-questions-and-named-actions),
  [candidate UX: qualification and changing accounts](candidate-ux.md#qualification-and-changing-accounts),
  [candidate UX: available orientation](candidate-ux.md#orientation-that-remains-in-view),
  [backlog: Presentation representation, F5](../docs/backlog.md#decide-how-gui-presentations-and-their-parameters-are-represented),
  [backlog: additional-detail placement](../docs/backlog.md#review-more-details-information-placement),
  [backlog: navigation origins](../docs/backlog.md#assess-and-preserve-navigation-origin-lineage),
  [backlog: coordinated-View conformance](../docs/backlog.md#assess-conformance-when-extending-coordinated-views-and-state-scope).

<a id="slice"></a>
### SLICE — First usable graphical investigation scope

- **Kind:** ⚠️
- **Outcome:** a coherent, bounded investigation experience for the first GUI,
  with concrete scope and acceptance criteria for PRESENT and MINIGUI.
- **Scope:** choose the user scenario, starting knowledge, useful endpoint,
  investigations, and representations that belong together. Use the completed
  journey exploration and ACCOUNT's demonstrated capabilities and limitations;
  this selects an initial offering rather than restarting the journey exercise.
  ACCOUNT's capabilities may be selected, modified, supplemented, or left out.
  Identify needed changes and missing capabilities, drawing on the backlog and
  candidate inventories, and place that work before the work that depends on it.
- **Boundary:** selects the offering and its acceptance criteria. Detailed
  presentation and interface design belong to PRESENT and MINIGUI; additional
  investigation capabilities have their own implementation scope.
- **Sources:** [journey outputs: investigation script](initial-journey/cockatiel-investigation-script.md),
  [journey outputs: connected account examples](initial-journey/cockatiel-account-examples.md),
  [journey findings: capability-planning inputs](initial-journey/design-findings.md#capability-planning-inputs),
  strategy discussion: separate mechanism validation from selection of the first offering.

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

These questions guide human-led reconsideration of the selection, ordering, and
rationale. Item codes stay stable as priorities change; detailed outcomes and
implementation history remain in their existing records.

<a id="cli-retirement-checkpoint"></a>
### CLI retirement checkpoint

Once MINIGUI supports usable graphical investigation, assess whether to retire
the interactive human CLI. Consider any continuing value in launching,
authentication, debugging, automation, or agent-facing access separately:
those facilities need not require retaining the interactive command shell.
The checkpoint decides what remains useful and the cost of supporting it;
neither retirement nor indefinite support for both interfaces is assumed.
