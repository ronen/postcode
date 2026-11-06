# Research-question-driven observation

Status: in review
Decided: [set on acceptance]
Arising from: Human-directed reconciliation of the research-observation revision adopted in foundation/product-design.md at `60f11e2`, November 2026
Scope: Research capture and delivery, their separation from architectural provenance, and unchanged current recording support
Supersedes:

- [Command-scoped observations with session correlation](transient-analysis-sessions.md#command-scoped-observations-with-session-correlation), the whole headed decision, replaced by [research capture](#research-capture).
- [Stable inputs as the session precondition](transient-analysis-sessions.md#stable-inputs-as-the-session-precondition), the whole headed decision, replaced by [validity and recording](#validity-and-recording).
- [Attribute system-initiated investigation and constrain autonomous work](application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work), the whole headed decision, replaced by [investigation attribution](#investigation-attribution).
- [Report actual requests and outcomes](lens-application-and-request-outcomes.md#report-actual-requests-and-outcomes), the whole headed decision, replaced by [request reporting](#request-reporting).
- [Report presentation without replaying Evaluation](exact-retained-answer-presentation.md#report-presentation-without-replaying-evaluation), the whole headed decision, replaced by [retained presentation](#retained-presentation).
- [Results over captured bases](specialized-architectural-investigation.md#results-over-captured-bases), the whole headed decision, replaced by [results over captured bases](#results-over-captured-bases).
- [Retained understanding and local investigation context](specialized-architectural-investigation.md#retained-understanding-and-context), the whole headed decision, replaced by [retained understanding and context](#retained-understanding-and-context).
- [Record actual exposure and inadequacy separately](human-facing-architectural-representations.md#representation-observations), the whole headed decision, replaced by [actual exposure](#actual-exposure).
- [Provide additional detail under the human output boundary](human-facing-architectural-representations.md#additional-detail), the whole headed decision, replaced by [additional detail](#additional-detail).
- [Keep organization conceptual with intelligible detail](human-facing-architectural-representations.md#organization-detail), the whole headed decision, replaced by [organization detail](#organization-detail).
- [Preserve qualified construction and arrangement isolation](qualified-construction-under-the-request-model.md#preserve-qualified-construction-and-arrangement-isolation), the whole headed decision, replaced by [qualified construction](#qualified-construction).
- [Keep observations separate from `ProgramRecordStore`](initial-observation-recording-decisions.md#keep-observations-separate-from-programrecordstore), the whole headed decision, replaced by [observation lifetime](#observation-lifetime).
- [Retain unaffected domain and storage commitments](coordinated-views-and-qualified-results.md#retain-unaffected-domain-and-storage-commitments), the whole headed decision, replaced by [domain and storage](#domain-and-storage).
- [Attribute usage to execution independently of interpretation retention](investigator-execution-and-evidence-access.md#attribute-usage-to-execution-independently-of-interpretation-retention), the whole headed decision, replaced by [execution usage](#execution-usage).
- [Compact interface attribution and complete operational results](compact-attribution-and-complete-results.md), the complete record, replaced by [compact attribution](#compact-attribution).

## Context

The adopted [research-observation requirements](../../foundation/product-design.md#research-observation-support) make recording serve a research question. Ordinary non-research use need not produce or export research records. Automatic capture is appropriate where retrospective reconstruction would be unreliable. [System-initiated work](../../foundation/product-design.md#system-initiated-investigation) remains attributable in the investigation and in any research records that capture it.

Earlier local decisions deliberately required automatic command recording and comprehensive payloads. The foundation revision alone does not withdraw those local commitments. This decision withdraws their universal applicability explicitly, while preserving architectural support, qualifications, operational reporting, explicit feedback and honest delivery.

## Decisions

<a id="research-capture"></a>
### Choose capture for the research question

Choose the interactions, reports, versions, repository states and surrounding context needed to interpret the research question. Capture automatically where retrospective reconstruction would be unreliable; do not require a diary for every action. Ordinary non-research use need not create or export research records. This permission is independent of build type and does not require every implementation to offer a recording-mode control.

There is no mandatory comprehensive event taxonomy, field set, command boundary or copy of every result for all research. Recording may preserve content or reference it where the referenced material remains available for the intended assessment. Do not represent ephemeral Session references as durable evidence. Disclose omissions and limits relevant to the research claim; sparse records must not masquerade as complete histories. Distinguish research evidence from testing, debugging and operational telemetry to the extent needed to interpret the collected material.

This replaces the automatic/comprehensive prescription in the earlier command-recording decision. Its command-scoped, self-contained, versioned batch protocol remains a supported recording format, with separate occurrence identifiers and Session correlation, internal reference resolution, submission at command completion and no historical migration promise. It is not a prerequisite for another question-specific capture design. Existing explicit feedback continues to use that protocol. Selecting or revising a research format does not establish operational persistence, current program truth or restoration of Session bindings.

For research use, deliver the resulting records to the designated research destination under the [generated-output boundary](../architectural-constraints.md#generated-output-evidence-boundary). Production versus development build configuration does not determine whether a use is research. Development/test capture may remain local and excluded from evidence. No new destination-selection mechanism or remote service is selected here.

The person conducting the research establishes its purpose and designated record destination through study instructions or configuration. That designation may cover multiple sessions; it requires neither a separate declaration for each session, new application fields nor a mandatory research-mode workflow. The existing local observation folder can be the designated destination when explicitly chosen. Automatic capture can continue without implying research use or, by itself, establishing delivery to a research destination.

Preserve sink acceptance and failure contracts for records submitted: delivery failure is visible and does not invalidate an otherwise delivered result, including a non-View report. Acceptance, cleanup, retention, migration, historical reading and producer caching remain distinct. A chosen absence of recording is not a failed delivery or a claim of successful recording. Keep research observations separate from the operational program store under [their own lifetime](#observation-lifetime). Existing local no-overwrite publication and privacy protections remain binding when that sink is used.

<a id="investigation-attribution"></a>
### Preserve investigation attribution independently of research capture

Incorporate the whole predecessor [initiation decision](application-specification-boundaries.md#attribute-system-initiated-investigation-and-constrain-autonomous-work), including qualified resolution, initiator distinctions, parent scope, cancellation, autonomous resource authorization and inspectable consequential provenance. Replace only its unconditional research-recording requirement: system-initiated work remains attributable from the investigation outcome it influences, and in any research records that capture it. Such records preserve its initiator, parent or autonomous trigger and enough relevant context, results and qualifications to interpret the captured work. A human parent does not relabel system work as human-initiated.

Research selection does not license removing the operational attribution required to understand a selection, ambiguity, refusal, suggestion, View or report. It does not require an event for every helper, a general planner or a universal trace schema.

<a id="request-reporting"></a>
### Report actual requests without requiring their research capture

Incorporate the whole predecessor [actual-request reporting decision](lens-application-and-request-outcomes.md#report-actual-requests-and-outcomes), including normalized request/outcome propagation, subjectless usage, self-sufficient parent rendering, independently usable resolution information, generating provenance versus current consumption, execution checks and authoritative usage finalization. Replace its automatic observation copies with question-driven capture. When recording these interactions, describe actual requests, outcomes and usage without inventing a Lens, Projection or view-produced event. Preserve system-work attribution under the preceding decision. Applicable delivery failures remain visible without erasing results. Operational reporting and retained generating provenance do not depend on research collection.

<a id="compact-attribution"></a>
### Keep complete operational attribution and select research detail deliberately

Non-View JSON carries the compact attribution summary alongside the actual request, reason, candidates and consequential prerequisite qualifications. Counts supplement that explanation; complete reporting may have a summary presentation without implying incomplete execution.

The full attribution report continues to travel with the Session result independently of observation delivery. Every referenced parent has its description in that report, including earlier generating requests, with each distinct parent stored once and local references resolvable without another Session/history lookup. Expansion aggregation preserves record identities, qualified outcomes and generating origins; unlike outcomes cannot disappear into a total. Preserve the established incremental recording and progress delivery, repository-scale behavior, answer identity and Session lifetime. No durable history service, truncation of the full operational report or whole-request resource budget is introduced.

Research records need not copy that full report universally. Their selection must still support interpretation of the captured system work; the current full-report batch remains available. This replaces the complete earlier [compact attribution record](compact-attribution-and-complete-results.md). Its rationale for bounded interface output and complete operational results still applies.

<a id="retained-presentation"></a>
### Preserve retained-presentation reporting

Incorporate the whole predecessor [retained-presentation reporting decision](exact-retained-answer-presentation.md#report-presentation-without-replaying-evaluation), including historical versus current outcomes, generating attribution and real current consumption, actual composite/support relationships, normalized requests, effective choices, self-sufficient rendering, usage finalization, cancellation and validity checks. Replace mandatory research-event production and exhaustive copying with the capture choice above. Effective presentation choices and selected-answer relationships remain explicit in delivered results.

Where research captures presentation, keep the target, choices, output and limitations needed to interpret that occurrence. A repeated View ID does not identify one occurrence. Classify actual exposure for the presented content; never invent a View or source export for a refusal. Historical format-version prescriptions remain records of those changes, not requirements to change the current version. This does not close the known exported-basis or navigation-origin gaps or establish durable replay.

<a id="results-over-captured-bases"></a>
### Preserve qualified results and visible changes without universal event recording

Incorporate the whole predecessor [Results over captured bases](specialized-architectural-investigation.md#results-over-captured-bases), including its inherited Lens/operation separation, qualified reuse, architectural claim boundary, parameter meaning and absence of a mandatory managed-View lifecycle. Each Projection retains its captured basis, including the respective roles of supplied prior interpretation and selected accounts/revision snapshots. Make changes in View composition and replacement by newly based results visible and preserve the lineage needed by the investigation. These are not merely rendering-context changes.

Replace the blanket recording requirement with research selection: when capturing such events, preserve or reference the contributions and surrounding context needed to interpret them and their limitations. A record of displayed output alone does not establish its complete captured basis. Do not require complete basis export for a question it does not serve, or remove basis attribution from the architectural result itself.

<a id="retained-understanding-and-context"></a>
### Retain local investigation context and explicit feedback

Incorporate the whole predecessor [retained-understanding decision](specialized-architectural-investigation.md#retained-understanding-and-context), including useful retained architectural understanding, local Views/bases/lineage terminology, the Workspace lineage floor and separation from Investigator input or an observation archive. Withdraw the blanket requirement to record relevant context evolution. Research may capture relevant context without duplicating all [retained architectural understanding](../../foundation/product-design.md#retained-architectural-understanding-and-continuity).

Retain easy contemporaneous subjective reporting as a local application choice; the foundation permits those reports without requiring their collection. Keep the existing explicit inadequacy-feedback interaction and [self-contained feedback contract](human-facing-architectural-representations.md#feedback-observations): submitting feedback is a deliberate recording action, with optional explanation, available displayed artifacts and exact output, explicit missing context, no reconstruction or new investigation and visible delivery failure. Ordinary use does not require reporting feedback. Permitting no automatic recording does not silently turn a requested feedback submission into a no-op. Observation history remains distinct from operational restoration.

<a id="actual-exposure"></a>
### Distinguish actual exposure when it is recorded

Replace [Record actual exposure and inadequacy separately](human-facing-architectural-representations.md#representation-observations) with this decision. Keep the human output boundary and representation-limit disclosures independent of research. When research records human output, distinguish what was actually exposed from machine acquisition or internally available support. Keep displayed source, attribution detail, recognized representation limits and submitted inadequacy distinct when collected; detail access or source display is not itself a report of inadequacy. Preserve relevant context and qualification; do not infer semantic adequacy from a syntax classifier or silently reinterpret historical records.

Research need not record every field or every exposure. Source-bearing content still requires the appropriate classified human-facing representation, including expansions and exports; new exposed fields still require boundary coverage. Non-View reports must not become an unclassified source-export path. Records of nonconforming output must describe the actual output rather than falsely asserting conformance. The following successors preserve additional-detail and organization guarantees while making their research recording conditional.

<a id="additional-detail"></a>
### Preserve additional detail without mandatory research export

Incorporate the whole predecessor [additional-detail decision](human-facing-architectural-representations.md#additional-detail), including conceptual focus, captured support, visible qualifications and consequential omissions, intelligible paths and mappings, absence of source excerpts, and the application of existing selection, compatibility, bounds, identity and continuation contracts to the additional-detail control. Change only the obligation to record selection/omission in observations: where research captures this interaction, preserve the context needed to interpret what was actually shown under [actual exposure](#actual-exposure). Human disclosure and classification remain independent of research capture; this establishes no new option, content placement or source-display permission.

<a id="organization-detail"></a>
### Preserve intelligible organization detail

Incorporate the whole predecessor [organization-detail decision](human-facing-architectural-representations.md#organization-detail), including qualified organization/navigation semantics, captured path support, intelligible qualifications, no file-content reproduction and visible consequential omissions. Change only mandatory actual-disclosure recording to the research-dependent rule under [actual exposure](#actual-exposure). Presentation choices and the distinction between qualified organization and canonical architecture remain unchanged.

<a id="qualified-construction"></a>
### Preserve qualified construction and exposure coverage

Incorporate the whole predecessor [qualified construction and arrangement decision](qualified-construction-under-the-request-model.md#preserve-qualified-construction-and-arrangement-isolation), including all family contracts, qualification and population semantics, reference allocation/binding schedules, arrangement isolation and self-sufficient parent construction. Its actual-source classification remains mandatory for human output; its research-recording clause now follows the preceding actual-exposure decision. Neither internal support nor a research recording choice changes what a human-facing interface may expose. No construction, identity, reference or arrangement machinery is removed by this change.

<a id="validity-and-recording"></a>
### Preserve input validity independently of recording

Incorporate the whole predecessor [stable-input Session decision](transient-analysis-sessions.md#stable-inputs-as-the-session-precondition), including unchanged-input assumptions, first-observed non-atomic capture, best-effort demonstrated detection, invalidation, restart and publication checks. Invalidation remains visible even without research recording. Do not publish an invalidated result as successful; if output was already emitted, disclose the subsequent invalidation. Where records capture that command, preserve the actual output and invalidation needed to avoid misleading interpretation. Replace only the automatic observation requirement; this establishes no new freshness guarantee or refresh mechanism.

<a id="observation-lifetime"></a>
### Keep research evidence independent of the ephemeral store

Incorporate the whole predecessor [observation/store separation decision](initial-observation-recording-decisions.md#keep-observations-separate-from-programrecordstore): operational program records and research evidence retain distinct ownership, validity, retention and cache semantics even if they share a physical engine. Observation history is not automatically current architectural evidence or restored operational state. Replace the universal serialize-or-copy prescription with preservation of selected content or references that remain usable for the intended research assessment after ephemeral Session disposal. A reference into a discarded store is insufficient. This permits durable references without selecting a persistence mechanism, weakening the existing self-contained feedback protocol or requiring an archive of every result.

<a id="domain-and-storage"></a>
### Preserve domain and storage boundaries with selected research capture

Incorporate the whole predecessor [domain and storage decision](coordinated-views-and-qualified-results.md#retain-unaffected-domain-and-storage-commitments), including all carried-forward program-information, store, identity, source, repository/dependency, qualification and failure distinctions. Replace only its blanket observation coverage of resulting Views, navigation, omissions and disclosures with [question-driven capture](#research-capture) and [actual-exposure semantics](#actual-exposure). Source disclosure, evidence exclusion and method/evidence attribution remain independently binding. Inbound reliance on earlier superseded domain/storage units follows this successor chain; it creates no new analysis or persistence design.

<a id="execution-usage"></a>
### Preserve execution usage independently of research recording

Incorporate the whole predecessor [execution-usage decision](investigator-execution-and-evidence-access.md#attribute-usage-to-execution-independently-of-interpretation-retention): actual attempts own usage, including unsuccessful attempts; retained presentation adds no inference usage; totals aggregate reported calls once with model, units, categories and missing-usage limitations preserved. Usage remains available for final operational reporting after interruption or invalidation, independently of interpretation retention, disposable state and sink acceptance. It does not imply complete billed usage, invoke inference, change reuse or authorize spending. Replace only the requirement that research observations always include attempt and Session usage: select research detail for the question, preserving accurate meaning and the attribution of captured system work. The operational usage ledger is not optional research machinery.

## Rationale and alternatives

Keeping comprehensive recording as a local requirement would defeat the relaxed foundation. Removing all observation machinery would discard useful research evidence and explicit feedback without evidence that their maintenance cost warrants removal. Requiring a generic configurable event framework now would replace one premature universal design with another. The chosen boundary permits selective recording and ordinary use without it, while retaining the existing protocol as one usable format.

Architectural provenance answers what supports an account and what may be concluded from it. Research records answer a question about PostCode use. They can share material without having the same completeness, lifetime or delivery requirements. Visibility and required investigation lineage are not synonyms for export to a research destination.

## Adoption and conformance

Accept with the specification, concept, constraint, metadata/index and backlog revisions. Earlier decision bodies and concluded plans/tasks remain historical. The supersession list names complete records or complete headed units; incorporation above carries every unaffected requirement forward. Already superseded units retain their existing chains, not a second competing replacement. Historical implementation-specific versions and completed verification prescriptions do not imply new work.

Source inspection at `60f11e2` found no newly demonstrated implementation conflict from this relaxation. The current CLI still automatically builds and submits version-four command batches to a local sink. It offers no public no-recording mode or question-specific capture selection. These remain permitted behaviors, not capabilities introduced by adoption. Research purpose and destination are established through study instructions or configuration as described above; automatic local capture alone establishes neither. This pass introduces no release-build routing or research-mode workflow.

`src/lib/command-execution.ts` constructs records after publication and supplies their snapshot to shell feedback; `src/lib/feedback.ts` embeds that snapshot without live-store reconstruction. `src/lib/observations.ts` builds current records and publishes local files. `src/lib/source-disclosure.ts` classifies displayed content for observations, while the human output boundary and its verification remain independent obligations. Full work attribution and usage travel through Session/worker reporting independently of sink acceptance. Investigation delivery/provenance and immutable selection records still support architectural accounts; research relaxation is not a reason to remove them.

The confirmed captured-program-basis export limitation remains real, but remediation is now tied to a research question needing that attribution. Broader supplied-interpretation and selection-snapshot contributions also need assessment when the question relies on them. Missing export is not evidence that internal result provenance is missing. Navigation-lineage and operational initiation obligations remain independently scoped. No new violation is deferred merely to finish this reconciliation.

Optional cleanup is captured in the [backlog](../backlog.md#separate-optional-research-recording-from-feedback-context). Decoupling publication snapshots from batch construction could enable no-recording use without losing explicit feedback and reduce UUID/event construction, serialization and local writes. The feedback coupling and source-exposure verification make indiscriminate deletion inappropriate. No performance saving is measured here. Keep current behavior until separately authorized work chooses its interface and verifies the preserved contracts. No implementation plan, schema migration, generic capture framework or runtime change is approved by this documentary adoption.
