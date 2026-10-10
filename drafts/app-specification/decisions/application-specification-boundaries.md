# Separate research concepts from application specification

Status: in review
Decided: [set on acceptance]
Arising from: Human-directed reconciliation of the research product design and local application design, October 2026
Scope: Document authority, initial Workspace meaning, investigation initiation and attribution, and retained-information lifecycle distinctions

## Context

The expanded product design combined research concepts with application interactions and architecture. Narrowing the research foundation does not withdraw the removed application requirements. The [application specification](../app-specification.md) carries those requirements and the deliberate refinements below, while the [research product design](../../foundation/product-design.md) defines the conceptual commitments necessary for evaluation.

This record is reviewed with the foundation replacement and coordinated documentation revisions. Adoption changes intended design and governing terminology, not implementation status, accepted runtime schemas, or authorization to implement.

## Establish the application specification and preserve document roles

The application specification is the human-maintained governing statement of intended interactions, capabilities, externally meaningful guarantees, and high-level application architecture. It conforms to the research foundation. Agents may prepare changes under explicit human direction during design or planning; implementing agents report contradictions and gaps rather than revising it during implementation.

Core concepts continues to define shared meanings; architectural constraints remains the concise source of binding cross-cutting obligations; decisions preserve consequential choices and rationale. Descriptive architecture explains the current implementation. A separate supported-capability reference describes the toolbox without elevating particular Lenses to core architecture. A specific View or Lens belongs in the app specification only where a deliberate design commitment depends on it.

Human design establishes meanings, guarantees, responsibilities, ownership, lifecycles, and dependency boundaries. Implementing agents choose delegated representations and mechanics within those contracts and verify them. Consequential changes to these boundaries require human agreement; ordinary implementation choices do not require routine human selection. Contradictions among governing documents require explicit resolution.

## Start with a Workspace as a collection and arrangement of Views

A Workspace is a collection and arrangement of Views, displayable in a tab or window. One tab need not mean one View. It does not require a name, permanent root subject, formal task, persistence, or shared-context object. A Workspace is distinct from a Session and from one View coordinating several Projections. Placement does not establish program relationships or shared evidence.

This deliberately stages the richer workspace model of the expanded design. Shared purpose, defaults, context-sensitive choices, specialized workspace kinds, and agent sharing remain possible later UX refinements, potentially optional. Navigation and derivation remain distinct from placement. Continuity across program changes and application restarts remains aspirational; its implementation and precise requirements are deferred, without weakening current qualification, immutable-result, reference, or capture contracts.

No particular initial View or Lens is prescribed now. This preserves the optional summary-View treatment in [coordinated Views](coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses); it does not change the meaning of implemented summary investigation.

## Attribute system-initiated investigation and constrain autonomous work

System-initiated investigation obtains qualified information for orientation, request resolution, navigation, suggestions, or later interaction through the same analysis mechanisms as explicit investigation. It need not produce a visible View. Selecting unspecified request elements without additional analysis is not itself another investigation.

Request-scoped investigation has an explicit parent whose purpose, constraints, and resource choices govern it. Autonomous investigation has no parent; work outside a parent's purpose or continuing after satisfaction or cancellation is autonomous. Autonomous work requires human-authorized resource policies. Work exceeding them or materially delaying an explicit request is deferred unless authorized; enabling a hosted provider alone is not that authorization.

Request resolution can consume qualified results but cannot itself establish program claims or the population used for resolution. Consequential additional investigation remains attributable from the selection, ambiguity, inability to resolve, suggestion, View, or report it influences. Preserve initiator, parent or trigger, captured basis, results, and qualifications in inspectable provenance and observations. A human parent does not relabel its prerequisites as human-initiated analysis. This does not prescribe a general planner, scheduler, event for every implementation step, or universal new outcome record.

This extends Evaluation's stated sources of requirements and adds cross-cutting attribution constraints. It does not replace existing construction, operation, retention, or failure contracts. In particular, a later Lens redesign must reconcile any proposed change to retained request outcomes explicitly.

## Distinguish immutable information from retention policy

Retained evidence and qualified results are immutable: subsequent analysis, corrected inputs, or corrections produce new information and explicit relationships without rewriting earlier content or support. Existing references retain their meanings. A derived current reconsideration status can change without changing the original account or its recorded context exposure.

Immutability is distinct from retention duration, disposal, persistence, and availability after restart. It does not require indefinite storage or immutable UI-state implementation. Layout, focus, defaults, and current display selection may change. Discarding an item does not authorize silently retargeting its reference. Earlier interpretations remain accessible within the supported lifecycle; current transient Sessions remain transient.

The [session immutability decision](transient-analysis-sessions.md#immutable-information-within-an-accumulating-session), [interpretation contracts](investigrams-and-progressive-investigation.md), and [captured-result rules](coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh) remain applicable. Corrections and conflicts retain their qualification; reconsideration does not prove error or automatically trigger generation.

## Adoption and conformance

Accept this record only with the corresponding app specification, research foundation replacement, and governing-document revisions. The foundation's historical navigation additions preserve access to moved topics without changing the supplied research commitments. Separate human-directed process maintenance must establish the specification's role in agent entry instructions and development guidance before implementation proceeds under the new arrangement.

No earlier headed decision is superseded by this record. Additions to Evaluation and lifecycle terminology are localized elaborations. The coordinated-Views, qualified-construction, interpretation, source-disclosure, hosted-access, observation-sink, and unchanged-input Session decisions remain binding. The narrower observation provision, read with its generated-output boundary, permits the existing explicitly excluded development/test storage; no sink decision is reversed.

Existing known gaps remain visible, including request misreporting, exact retained-Projection presentation, and captured-basis observation attribution. Follow their existing [backlog entries](../backlog.md); recording attribution must be corrected before relying on newly collected observations for state-specific assessment. Adoption is not evidence that the current code conforms to the broader specification.

Assess existing prerequisite work against the initiation/parent/trigger contract before relying on current observations to assess who initiated investigation or its resource policy. That scoped assessment is [backlogged](../backlog.md#assess-investigation-initiation-and-parent-attribution); it does not block retaining current limited CLI behavior with its limitations disclosed. Establish policy and attribution before adding autonomous execution. GUI/workspace and shared-agent-context work require separately approved scope and design; use existing GUI planning concerns and the associated reconciliation candidates rather than implement them through document promotion.

## Alternatives and consequences

Keeping application behavior in the foundation would obscure ownership and tie local UX choices to research concepts. Consolidating the other governing roles into one large document would remove useful distinctions between meanings, obligations, rationale, and current implementation. Keeping only a capability inventory would leave cross-cutting behavior and architecture underspecified.

The chosen arrangement requires coordinated human review of meaningful changes while leaving implementation mechanics delegated. The simple Workspace postpones richer context requirements until they can be informed by use. Explicit attribution may require changes to existing request and observation representations; their exact form is deliberately left to follow-up work.
