# Application-specification reconciliation

Prepared for discussion, 2026-10-10. This note is non-governing. It proposes document boundaries and identifies decisions needed before preparing an adoption package; it does not authorize implementation.

Updated through draft review and follow-up discussion on 2026-10-11. The coordinated draft was authorized, prepared, and reviewed; the latest revisions incorporate the agreements recorded below. The package remains unadopted and does not authorize implementation. Earlier exploratory passages provide discussion context; the draft-review and follow-up sections describe the current disposition.

## Recommendation and baseline

Create `docs/app-specification.md` as the human-maintained specification of intended application behavior and high-level application design. Keep the research foundation responsible for the conceptual commitments the application must preserve, core concepts responsible for shared terminology, and architectural constraints responsible for cross-cutting implementation obligations. Use the specification to explain what the human or external agent can request, observe, inspect, and rely on, together with the major application responsibilities and relationships that support it. Avoid turning it into either a second conceptual glossary or an implementation inventory.

The content baseline is the supplied **Expanded Product Design Before the Conceptual Split**, frozen at research revision `87f74eb`. Its detailed requirements survive their removal from the research document. The supplied narrower **PostCode: Product Design**, with the 2026-10-11 research-observations revision of §§3.1.1, 3.6.1, 3.7, and 5, is the proposed research foundation, not yet adopted. The currently [adopted foundation](../foundation/product-design.md) remains governing until explicit adoption, but must not be used to roll back the expanded baseline. Source section numbers below refer to the expanded baseline unless explicitly identified otherwise; the substantive context needed for discussion is included here.

Local accepted commitments also survive. In particular, the [coordinated-views decision](../docs/decisions/coordinated-views-and-qualified-results.md) already reconciles multi-projection Views, captured states, immutable answers, presentation continuity, and optional summary navigation. The [qualified-construction decision](../docs/decisions/qualified-projection-construction.md) and the interpretation/session decisions add contracts absent from both supplied designs. This reconciliation should build on them rather than reopen their settled choices incidentally.

**Recommended change policy:** distinguish relocation, editorial consolidation, new local elaboration, and substantive design change in the eventual package. Preserve “may,” “should,” examples, conditions, and deferrals. A capability described as intended is neither implemented nor scheduled merely because the specification governs it.

## Relationship to the Lens-planning discussion

The human clarified the sequence: issues in the [Lens-planning discussion](lens-representation-proposal.md), following the [representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md), led to the expanded pre-split product design; that expansion prompted the research/application split. The Lens-planning note has not yet been adapted to those specification changes.

Agree the reconciliation and promote its coordinated documentation first. The human can then return to the Lens-planning discussion and adapt it against the adopted documents. This assignment need not resolve or revise that proposal. Its discussion agreements provide upstream context, not a reconciled downstream design to import wholesale into the specification. Currently accepted local contracts remain governing until explicitly changed; recording them here does not preclude their deliberate revision in later Lens work.

## Document roles agreed in discussion

| Document | Responsibility |
| --- | --- |
| Research foundation | Concepts and commitments necessary to the research. |
| App specification | Intended application behavior and high-level application design. |
| Core concepts | Shared application terminology and conceptual relationships. |
| Architectural constraints | Binding cross-cutting rules implementations must preserve. |
| Decision records | Consequential accepted choices, their rationale, scope, and supersession history. |
| `docs/architecture/` | Selective description of how the current implementation works. |

No further consolidation among these document roles is sought. The working preference is one app-specification document with sections, rather than splitting it into several documents. Detailed rules should have a primary home and concise linked consequences elsewhere where useful.

The specification includes high-level architecture when it defines major responsibilities and how they fit together. The eventual Lens design could explain what a Lens declares, how planning resolves subjects and selects suitable Presentations, and how requirements relate to reusable operations and Evaluation. It can also state expectations for adding capabilities. Concrete types, registration syntax, module layout, and dispatch mechanics ordinarily remain implementation choices. These examples establish the appropriate level of specification; they do not adopt the pending Lens proposal.

### Architectural prescription and agent freedom

The aim is to avoid both routine human micromanagement and architectural omissions that require repeated reconstruction through audits. Decisions with consequences beyond the component being implemented deserve explicit treatment, but not every such decision requires a human to choose its mechanics.

| Level | Treatment |
| --- | --- |
| Required contracts | Human-directed design settles user-visible meanings and guarantees, consequential UX behavior, resource/spending and lifecycle policies, and architectural boundaries with consequential external or cross-cutting effects. Significance depends on effect rather than size. |
| Delegated design choices | Agents can and should design internal boundaries, modules, interfaces, abstractions, and dependency organization under the engineering guidelines, within approved commitments. They choose representations, algorithms, and interaction details, explain consequential choices, and verify results. |
| Local implementation details | Agents routinely choose local organization, algorithms, helper types, naming, and mechanics that do not alter wider contracts. |

The architecture section should state responsibilities, contracts, explicit freedoms, and validation expectations. For extensibility, a demonstration of adding an ordinary interpretive Lens and a mechanical Lens can provide stronger evidence than prescribing a registry. The point is to test local, understandable integration without scattered dispatch or reporting changes; exact examples and acceptance criteria belong in the relevant design or plan.

An implementing agent should seek human direction when a choice changes a specified meaning or guarantee, changes an architectural boundary with consequential external or cross-cutting effects, introduces an undelegated consequential lifecycle/external contract/dependency, resolves a governing contradiction, or exposes a tradeoff not already delegated. Within the authorized scope and established delegation, it should proceed. This is the agreed direction for later specification and separate process-maintenance proposals, not a change to current repository instructions in this note.

### Continuing role of descriptive architecture

`docs/architecture/` explains the implemented realization: major components, responsibility boundaries, data flows, storage/process boundaries, and significant limitations. For implemented Lens work, it would describe where responsibilities live, how requests pass through them, and how a capability integrates with the system. It must distinguish implemented support from intended design.

Agents can maintain that description as part of authorized implementation without an additional approval gate for ordinary descriptive updates. A new binding choice still follows the decision process; documenting an implementation cannot establish its authority. Keep the account selective and useful across components, rather than duplicating classes, interfaces, functions, or rationale already recorded elsewhere.

## Working specification categories

These replace the initial ten-section outline as the working organization. They are broad categories, not a settled section order or a decision to separate every contract from the interaction it governs.

| Category | Contents and boundary |
| --- | --- |
| UX | Overall experience of understanding and operating PostCode: investigation flow, representation selection, navigation, workspace organization, focus, lineage, continuity, qualification, source access, feedback, and control. Include how explicit and inferred choices remain understandable and inspectable; do not reduce UX to individual controls or visual styling. |
| Capabilities and behavior | Shared request and outcome behavior, subject resolution, ambiguity, unavailable analysis, comparison, retained interpretation, and further investigation. Use specific Lenses as examples without privileging the current toolbox. A separate capability reference should describe supported investigations, Lenses, and Views. |
| Semantic contracts and guarantees | Consequential operation meanings: exact retained answer versus fresh request; presentation-only change versus refresh; following/pinned inputs versus captured bases; comparison versus derived change claims; original interpretations versus replacements. Use core definitions and link cross-cutting constraints. |
| Application architecture and extensibility | Major responsibilities, relationships, contracts, and extension expectations. Explain the intended design sufficiently to guide implementation, with explicit delegated choices and evidence expectations rather than a module or type blueprint. |
| Execution and resource behavior | Progress, partial results, applicability/availability, execution state, materialization, failure, stopping, costs, and resource limits; request-scoped versus autonomous work, attribution, parent constraints, and authorization. |
| Integration | Shared context and references for external coding agents, incoming assertions, runtime observations and tools, language/analysis providers, and hosted services. Specify exchange meaning and guarantees; leave concrete protocols and representations to appropriate designs and references. |
| Research observation | Automatic interaction capture, subjective reports, event provenance, delivery and failure behavior, and generated-output handling. Separate research evidence, diagnostics, workspace state, caches, and repository evidence. |

Begin with a short role/scope statement explaining human maintenance, intended versus implemented behavior, and absence of implementation authorization. Capability status and qualifications apply throughout. The specification need not catalogue the toolbox or prescribe a privileged Lens or initial View. Keep related interaction and semantic-contract text close enough that readers need not constantly move between sections.

Text and machine-readable presentations are first-class throughout; do not organize the specification as a GUI specification with a CLI appendix. Keep detailed command syntax, record encodings, provider setup, and concrete visual designs in their respective references or later plans.

## Allocation and consolidation

| Topic | Research foundation | Local home and proposed treatment |
| --- | --- | --- |
| Lens, Projection, Presentation, View; qualification; evidence kinds | Defines the conceptual distinctions and research commitments. | [Core concepts](../docs/core-concepts.md) defines application vocabulary and relationships once. The specification uses it in interaction contracts; [constraints](../docs/architectural-constraints.md) retains preservation and analysis-boundary rules. Avoid reproducing the four full definitions three times. |
| Request interpretation and autonomous work | Defines investigation initiation and attributable, qualified outcomes. | Specification owns the human-visible resolution, authorization, and resource behavior. Add concise initiation vocabulary to core concepts if needed across requests and observations; add corresponding evaluation/attribution constraints through a decision. |
| Supplied populations, counts, composition, expansions | Preserves qualification and distinguishes analysis from presentation. | Specification gives observable guarantees and a few boundary examples. Constraints remains the operational source for construction/arrangement independence and supplied-population rules. Keep subject-kind Expansion terminology in core concepts. |
| Workspace UX | Establishes investigation context and navigation through qualified Views without prescribing a workspace UI. | Specification owns the chosen organization: initially a collection and arrangement of Views, with focus and navigation, displayed in a tab or window. Shared Workspace purpose and defaults are future UX candidates; investigation context already comprises the Views, bases, and relevant lineage. Introduce cross-cutting terminology into core concepts only when needed and agreed. |
| Investigation continuity over time | Establishes an aspirational direction of continuity of attention without invented semantic continuity. | Preserve that direction while deferring implementation and precise continuity requirements until more is understood about the application. Prudent design can avoid obvious obstacles without introducing speculative persistence machinery. |
| Binding, capture, identity, labels | Requires attributable bases and distinguishes identity from naming. | Core concepts retains definitions; constraints retains immutability, capture, and reference-binding obligations. Specification explains pin/follow, refresh, disappearance, exact identifiers, and interpreted labels to users. |
| Interpretation | Requires evidence-based status and identifiable interpretation. | Keep Investigram/Investigator definitions in core concepts. Specification covers retained-account behavior; constraints retains acceptance, evidence access, correction, and qualification invariants. Accepted decisions preserve detailed rationale and scoped contracts. |
| Agent context | Requires shared qualified referents and attributed incoming assertions. | Specification retains context contents, synchronization and atomic-write expectations, state associations, reference semantics, and generated-state status. File/manifest format and interactive protocols remain open. |
| Source escape | Requires identifiable and observed source excursions, including progressive disclosure. | Specification owns access and navigation behavior; constraints retains captured-source support and actual-disclosure recording. Language span units and excerpt mechanics stay in implementation conventions. |
| Observations and outputs | Requires research evidence and protection against self-corroboration. | Specification owns event coverage, subjective capture, delivery behavior and build policy, preserving development/test capture and explicit evidence exclusion as clarified below. Constraints retains enforced evidence exclusions and lifecycle separation. Sink implementation and archive policy remain distinct. |
| Lens families, runtime input, languages | Illustrates research scope without imposing an ontology or prioritizing particular Lenses. | Specification retains shared and conditional guarantees, with examples where helpful. A separate user-facing capability reference describes supported investigations, Lenses, and Views. Candidate families remain exploratory rather than requirements; no particular Lens or View is privileged unless the application UX deliberately depends on it. |
| Application architecture, implementation, and sequencing | Does not specify application architecture or delivery milestones. | Specification states intended high-level responsibilities and extension contracts; accepted decisions and constraints govern consequential choices and cross-cutting obligations. Plans sequence approved work; architecture describes what exists; `STATUS.md` describes current capabilities; CLI/setup references describe current use. |

Some semantic rules necessarily have both a user consequence and an implementation obligation. Consolidation should mean one detailed local rule with a concise linked consequence elsewhere, not deleting a rule merely because two audiences need it. Initially retain the current constraint groups; do not undertake wholesale relocation from constraints into the new specification. Any later removal or change of authority must identify its replacement and decision basis explicitly.

## Questions and recommendations

### 1. Authority and maintenance — direction agreed

The task establishes the new specification as governing intended behavior and human-maintained. The discussion confirms the document roles and architectural scope above. It conforms to the research foundation and uses core terminology; conflicts with accepted local decisions and constraints require coordinated resolution. Adding it must not create an automatic precedence rule that silently overrides those decisions.

Semantic specification changes require explicit human direction; durable consequential choices should be recorded as decisions. Implementing agents should report a gap or contradiction, not change the specification to match their implementation. Exact maintenance wording remains for the later package and separate process work.

The human does not want further consolidation. Do not make the specification the sole local behavioral authority or relocate most user-visible rules out of constraints. Detailed allocation remains to be reviewed within the agreed division.

### 2. Initiation, resolution, and resource governance

The expanded baseline §3.1.1 and narrower research design §3.1.1 agree: PostCode-initiated prerequisite investigation remains **request-scoped system-initiated investigation**, even when its parent was requested by a human or external agent. Autonomous investigation has no parent request. Merely choosing unspecified request elements is interpretation, not itself additional investigation. The current adopted foundation instead excludes work with an initiating request from “system-initiated investigation”; that older definition must not survive this reconciliation.

Preserve the expanded baseline's additional application rules: prerequisite work is governed by its parent's constraints; work beyond that purpose or continuing after satisfaction/cancellation is autonomous; autonomous work requires human-authorized resource policies and remains deferred if it exceeds limits or materially delays explicit work. Preserve inspectable trigger, basis, results, and qualifications, including when no View is produced. Reuse does not imply freshness. A suggested summary with no expressed need is autonomous; a summary selected to answer an expressed need is not automatically autonomous.

This needs a local decision and coordinated terminology/constraint updates. The current Evaluation definition derives requirements from Lenses and standard expansions; clarify how prerequisite and autonomous requests enter that model without letting request interpretation derive program claims. The specification must preserve established candidates, ambiguity, incomplete coverage, and inability to resolve rather than flattening them into “not found.”

**Recommendation:** settle this semantic and attribution model now, leaving scheduling, policy representation, and numerical budgets open. Do not infer that selecting a hosted provider authorizes autonomous spending: [hosted enablement](../docs/decisions/investigator-execution-and-evidence-access.md#require-intentional-hosted-service-enablement-and-protect-credentials) authorizes transmission/use within its scope, not a general autonomous resource policy. Existing operation dialogue and reuse rules remain intact. Detailed classification of internal evidence/tool work can be resolved when its initiation paths are designed; do not require an event for every implementation step.

### 3. Observation delivery and evidence role — resolved with revised foundation

The final supplied research-observations revision replaces the disputed location wording. Section 3.7 requires delivery to a designated research destination, subject to §5. Section 5 permits retention, reuse, and comparison as PostCode-produced artifacts with provenance and evidence separation intact, while prohibiting use as independent repository evidence about the same repository. The human explicitly confirmed that this weakening is deliberate: historical and comparative use is permitted; self-corroborating evidence feedback is not. Earlier discussion of compulsory outside-repository storage, latest-release research use, or blanket coding-agent exclusion does not govern this draft.

Preserve expanded §3.8.4 in the application specification: production builds deliver observations to designated research storage using build-selected configuration; development/test builds may suppress capture or use another destination, including inside the development repository, subject to explicit evidence exclusion. This is application-level elaboration of the research requirements, not a new exception requiring a foundation amendment.

The [accepted sink decision](../docs/decisions/initial-observation-recording-decisions.md#send-to-a-sink-and-forget) already permits in-repository development/test sinks and deliberate discard. Local development observations in the PostCode checkout remain permissible when self-analysis explicitly excludes them from repository evidence. The [local acceptance contract](../docs/decisions/local-observation-acceptance.md) continues to govern complete publication and truthful acknowledgement independently of destination selection.

**Agreed treatment:** record this as an allocation clarification. No research-foundation amendment, sink-decision supersession, observation relocation, or new nonconformance finding is needed on this account. Preserve the production/development distinction and generated-output evidence boundary in the later specification. Storage location does not by itself select a remote service, retention policy, archive, or reproducibility guarantee.

### 4. Continuity over time — refinement and implementation deferred

The human distinguished continuity over time from workspace UX. Product design is aspirational: its direction does not require all capabilities to work at once. Continuity remains an intended direction, but both implementation and precise requirements can remain deferred until experience with the rest of the application provides a better basis for deciding them. This replaces the earlier recommendation to settle observable continuity requirements during this reconciliation.

**Agreed treatment:** retain the aspiration and existing conceptual distinctions without choosing save/resume semantics, process-restart persistence, refresh triggers, cross-session reference lifetimes, or multi-capture session mechanisms now. Prudent implementation should keep future continuity in mind and avoid obvious obstacles, but this is not a mandate for speculative storage abstractions or persistence infrastructure. Further refinement of continuity requirements is not a prerequisite for preparing the specification.

The [session contract](../docs/decisions/transient-analysis-sessions.md#stable-inputs-as-the-session-precondition) still invalidates on detected relevant input change and requires reopening. The [coordinated-views adoption](../docs/decisions/coordinated-views-and-qualified-results.md#adoption-and-conformance) expressly permits this limited subset. Preserve existing captured-result, qualification, reference-binding, and [expiry-disclosure](../docs/decisions/reference-lifetime-disclosure.md) contracts; the deferral does not weaken them or imply that current references are durable. Existing separately identified conformance gaps remain separate from future continuity work.

#### Workspace organization — simple starting model agreed

Workspaces were removed from the research design because it focuses on the conceptual and semantic information necessary for research evaluation. A particular workspace UX does not follow necessarily from those principles. Expanded §§3.3–3.4 remain the application design baseline; changes to that model are deliberate application choices, not changes to the research concepts merely because they organize the same information differently.

**Agreed starting direction:** a workspace is a collection and arrangement of Views. One tab can contain several Views; a workspace can also be displayed in its own window using the familiar “open in a new tab or window” model. Exact treatment depends on the shared interface controls. One tab per View was considered less attractive: adding splits and placement would recreate an arrangement through potentially awkward tab machinery.

Keep workspace management lightweight. The model need not require a name, permanent root subject, saved state, or formal investigation object. Views can open inline or alongside other Views with sensible placement; exact gestures and layout remain GUI design choices. Useful refinements to explore include distinguishing brief inspection from keeping a View, retaining navigation history independently of visible layout, and allowing an investigation to outgrow its starting subject. These should reduce management demands rather than introduce another required workflow.

Each View retains its own subject, question, captured basis, and qualifications. Ordinary interface focus supports navigation. Do not equate workspace with Session or infer a new session lifecycle or persistence promise from the UX choice.

A richer definition—a collection of Views forming a working context for an investigation—is appealing as a later extension. Shared purpose, request defaults, context-sensitive choices, and agent sharing could then enrich a workspace. Whether that support is optional for some workspaces, automatic, or common to all remains open. Start with the simple model and avoid obvious obstacles to richer context without building speculative context machinery.

For example, investigating “why synchronization is slow” might bring together several modules, runtime observations, and a comparison with an earlier revision. Shared context could include an information need, repository/project defaults, focal subjects, and context intended for a coding agent. It might help interpret references, select relevant questions or Presentations, and communicate the investigation. Ordinary focus already supports basic navigation without requiring this richer model.

Questions for later include how the human supplies or corrects inferred context; which choices it influences and how those choices are inspected or overridden; how context evolves when an investigation branches; and what agent sharing includes. Workspace membership alone must not imply a common captured state, establish a program relationship, or make one View evidence for another. Preserve the distinction between request defaults and existing results, and between explicit choices and inferred purpose. Shared context and persistence remain independent: either could be useful without the other.

**Possible later documentation:** a candidate-future-UX note beside the existing candidate-capabilities note could retain such possibilities. Creating that separate document now is premature. First turn this discussion into a draft proposal and review and promote it; retain these ideas here in the meantime. No future-UX document or additional design work is authorized by this suggestion.

This stages refinement of the richer baseline model rather than silently withdrawing its continuity and lineage aspirations. The eventual specification should distinguish the initial UX choice, future context possibilities, and separately deferred continuity requirements.

### 5. Shared architecture versus the capability toolbox — allocation agreed

The human distinguished the architecture supporting investigations from the particular investigations supplied in the toolbox. Early implementation of `summarize`, `explain`, `decompose`, and `examine` does not make those specific questions foundational. This replaces the earlier recommendation to give those four actions a dedicated place in the app specification merely because they are already implemented.

**Agreed allocation:** the app specification and architectural material describe how Lenses declare requirements, produce qualified answers, and work with Presentations. Shared contracts cover retained interpretation, exact references, corrections, conflicting accounts, and reconsideration across applicable capabilities. A separate user-facing capability reference should list supported investigations, Lenses, and Views, explaining their meaning, suitable subjects, parameters, available presentations, and limitations. It can be organized around questions people can ask, while distinguishing implemented support from future possibilities. Its exact name, structure, and maintenance mechanics remain for later drafting; do not create it during this discussion.

A particular Lens or View belongs in the app specification when the intended application design depends on it. The human's hypothetical “rich-workspace-wallpaper” View illustrates that possibility, not a capability being selected now. Until such a design dependency exists, particular toolbox items need not be named as required parts of the specification. Examples can still clarify a general rule without establishing priority or obligation.

Avoiding “Lens” terminology or internal Lens names in the GUI does not preclude well-defined user-facing action names such as “Explain” or “Decompose” in menus, shortcuts, or commands. The capability reference can document those names alongside their meanings, applicability, and options; it need not consist only of prose questions. Exact user-facing vocabulary, reference organization, and format remain open for later design and drafting.

The supplied designs are less specific than accepted local interpretation contracts. Preserve the shared meanings established by [investigrams](../docs/decisions/investigrams-and-progressive-investigation.md) and [operation/Lens separation](../docs/decisions/investigation-operations-and-lenses.md): earlier accounts remain immutable and accessible; explicit corrections and conflicting alternatives retain their qualifications; reconsideration does not establish error or automatically regenerate an account. Moving a capability's description does not withdraw or supersede its currently accepted behavior. Any deliberate later change still needs the appropriate decision treatment.

Preserve the distinction between a fixed result composition, later investigation provenance, a correction relationship, workspace lineage, and a program relationship. Also preserve current replacement-selection semantics and acceptance/failure/reuse behavior; neither a generic summary example nor a new workspace abstraction supersedes them. The built-in Investigator's restricted evidence access is separate from integration with external coding agents that modify programs.

Current mechanical scope also remains qualified: repository organization is one scheme rather than canonical architecture; external dependency endpoints have opaque interiors; ambiguity, unknown targets, unavailable analysis, and established emptiness differ. These accepted application commitments can be summarized with links, without importing every TypeScript rule or CLI schema into the general specification.

**Recommendation:** retain these as scoped application contracts. Keep detailed correction algorithms, provider transport, private reference encoding, concrete source populations, and record-store mechanics in their existing decisions/references. Preserve explicit hosted billing-route selection, no silent route fallback, credential exclusion, and usage uncertainty as applicable guarantees, not a universal commitment to a particular model or price.

#### No prescribed summary-first default

The [current CLI reference](../docs/cli-reference.md#product-model-and-current-cli-scope) confirms that the no-argument command is module inventory, not `summarize`. The [accepted summary-View decision](../docs/decisions/coordinated-views-and-qualified-results.md#allow-summary-views-independently-of-summary-lenses) permits a summary View when no more specific need is expressed; it does not require a summary-first default or a summary Lens for every summary View.

**Agreed direction:** do not prescribe a privileged Lens or initial View in the app specification now. Retain the possibility of selecting an appropriate starting View, with explicit information needs and choices taking precedence, but leave concrete defaults to UX design. A future initial View could coordinate established information, present an interpretation, or combine several answers. This does not select that behavior now or turn opening a subject into a mandatory `summarize` invocation. The research design's lack of prioritized Lenses leaves room for deliberate application UX choices later.

Different kinds of workspaces might eventually have different initial Views suited to their purposes. This is another possible basis for future UX defaults, not a decision to introduce workspace kinds, a fixed taxonomy, or any particular initial View now.

#### Interpretation history and immutability — scope agreed

Correction and disagreement disclosure, and accurate explanation of reconsideration, are necessary parts of the application's overarching epistemological contract. Selecting a replacement does not establish its truth or resolve a disagreement. Reconsideration indicates that interpretation content supplied to an earlier investigation was subsequently corrected; it does not prove reliance on that content, establish that the resulting account is wrong, or require automatic regeneration.

Access to earlier interpretations is a useful UX commitment consistent with that epistemological approach, rather than a uniquely necessary consequence of the research contract. It allows the human to understand a correction, revisit earlier reasoning, and interpret references already shared with an agent. Exact GUI mechanisms remain open, and access is subject to the applicable retention and reference-lifetime policy.

Use **immutable** explicitly in the high-level architectural commitment, with its scope and semantic meaning stated:

> **Retained evidence and qualified results are immutable.** Subsequent analysis, corrections, or refreshed inputs do not alter their content or supporting context. New information produces new records or explicit relationships, while existing references retain their original meaning.

This preserves a stable basis for dependent results and the historical account of what an investigation received or established. It also avoids bugs from rewriting information whose dependants have been overlooked. A correction can cause dependent accounts to need reconsideration without changing their original inputs or conclusions. The existing local architecture already adopts much of this commitment; the specification should make its significance clear, with precise preservation and reference rules in architectural constraints and the implemented mechanism described in `docs/architecture/`.

The commitment is scoped to retained evidence and qualified results, not all application state. Workspace arrangement, focus, defaults, and selection of the account currently displayed can change. Derived current reconsideration status can evolve while the underlying account remains immutable. Immutable programming-language objects or UI state-management techniques are implementation choices, not prescribed by this semantic contract.

**Immutability is distinct from retention.** An immutable result need not be kept forever. Retention duration, disposal, availability after application restart, and cross-session access require separate lifecycle policies. Discarding a result must not silently give its reference a different meaning, but immutability alone does not promise that the result will remain retrievable indefinitely. This discussion does not settle persistence or retention policy.

## Meaning that must not disappear during consolidation

The eventual draft should be checked particularly for these easily lost qualifications:

- **Presentation versus analysis:** exact counts of supplied qualified populations are permitted, even if the numeral was not supplied; inferred categories, unsupported totals, correspondence and new program claims require analysis. An outer Projection can select a qualified answer without synthesizing prose. A coordinated summary does not require a summary Lens.
- **Basis versus answer:** pinned inputs are not an exact retained result. New interpretations or correction selections can change a fresh answer without a new program capture. Presentation-only paging/reformatting preserves the selected answer; disclosed reselection is a refresh, not equivalent continuity.
- **Resources:** budgets constrain execution, not Lens meaning. Keep applicability/availability, execution state, materialization, and guarantee separate. Cost estimates remain uncertain; actual cost is available where practical. Partial information survives only when its method permits it. Existing interpretation acceptance does not permit retaining an unfinished generated account merely because mechanical partial results can survive.
- **Source access:** expanded §3.5 permits an escape-hatch mechanism; narrower §3.4 says the application provides one. Treat that as an explicit strengthening in the proposed research requirement, consistent with already accepted source-detail behavior. Preserve the conventional source Lens model and source-origin lineage, but do not decide GUI controls or exact disclosure-level names here.
- **Agent context:** retain the baseline's minimum content: task/information need where formalized, focus, Views and references, inputs/bindings/captures, per-Projection selections and qualifications, influential system-initiated results, source mappings, and View relationships. Preserve synchronization, atomic publication, and avoidance of repository dirtiness/self-analysis. A compact manifest is an option, not a required storage layout; interactive exchange and hosting the agent conversation are future possibilities.
- **Research capture:** keep prompts to external agents only “when available”; subjective reactions should be easy to record, but emoji buttons and “Wish I had…” controls are examples. Keep session/task/version/state associations, actual disclosure, initiation provenance, resource choices and available usage. Preserve visible delivery failure without invalidating a successful View and the distinction between sink acceptance and later cleanup.
- **Candidate scope:** tests need not have language-independent descriptions; written requirements remain assertions; inferred boundaries remain candidates and can yield “no clean boundary”; runtime evidence is execution-scoped. Candidate lists do not require implementing every lens, running the investigated program, adding a debugger, or adopting `postcode diff` as command syntax.

Omit repeated examples and duplicate conceptual exposition, not these qualifications. Preserve useful candidate-family context without turning it into a required toolbox or requiring a catalogue inside the specification. Supported capabilities belong in the proposed separate reference; future possibilities can remain exploratory. No existing exploratory note is promoted by reference.

## Representative passages to test the boundary

These are discussion samples, not the start of a canonical draft.

**Request resolution — application specification:**

> When resolving a request requires information not yet established, PostCode obtains qualified results through request-scoped system-initiated investigation. The resulting selection, ambiguity, or inability to resolve remains attributable to those results and their limitations. Established candidates and incomplete coverage remain inspectable. Choosing an unspecified presentation alone does not constitute additional investigation.

**Presentation continuity — application specification, using existing concepts and constraints:**

> Changing the format or page of a retained answer preserves its selected information and qualifications. An action that instead obtains a fresh answer is identified as a refresh and discloses consequential changes. Following and pinned input bindings govern subsequent requests; neither makes a retained Projection mutable.

**Workspace/continuity boundary — illustrative baseline passage, pending UX discussion and later continuity refinement:**

> Moving a View into a linked workspace preserves its derivation history and input bindings. If its live anchor disappears or correspondence becomes uncertain, the View remains available with that condition exposed. Its placement does not establish a relationship in the program, and PostCode does not silently select a successor subject.

**Candidate capability — conditional contract, not feature commitment:**

> A boundary-investigation Lens may propose groupings using dependency, ownership, history, and other evidence. If offered, it presents those groupings with supporting and contrary evidence and unresolved ambiguity, and can report that no clean boundary is evident. This does not establish one canonical decomposition of the program.

## Subsequent documentation and decision package

After agreement, use `drafts/app-specification/` with the normal canonical-relative layout. New documents use their intended filenames; revisions use `-revisions` and identify complete changed units. A short package guide should identify adoption dependencies, non-`docs/` destinations, unresolved choices, and which edits relocate meaning versus change it.

| Destination | Likely work |
| --- | --- |
| `docs/app-specification.md` | New complete intended-behavior specification following the agreed outline. |
| Separate capability reference under `docs/` (filename to be settled during drafting) | User-facing account of supported investigations, Lenses, and Views, with meaning, applicability, options, and limitations. Distinguish current support from candidates; the specification owns shared contracts and any future explicit UX dependency on a particular capability. |
| `foundation/product-design.md` | Explicitly identified replacement by the narrower research design. No observation-location amendment is needed. Draft links target this canonical path and its intended replacement. Adoption remains explicit. |
| `docs/core-concepts.md` | Update role/cross-links; add only agreed workspace/context/initiation meanings; clarify Evaluation requirements. Consolidate operational prose only where its replacement preserves meaning and authority. |
| `docs/architectural-constraints.md` | Update role/cross-links; add agreed initiation, parent-resource, attribution, and autonomous-policy obligations. Preserve construction, qualification, immutability, evidence-access, and generated-output exclusion boundaries. |
| `docs/decisions/` and its guide | New decisions for consequential local changes and precise supersession metadata where required; guide recognizes specification changes and their relationship to accepted decisions. |
| `docs/plans/module-investigation.md` | Reconcile foundation references and inherited summary/interpretation contract wording without enlarging the approved slice or changing its lifecycle by inference. Check other affected mutable plans. Completed plans retain their historical scope and rationale. |
| `docs/README.md`, `foundation/README.md` | Explain document ownership, intended versus implemented behavior, and navigation. These are part of the later package, including the explicitly identified foundation-guide destination. |
| `docs/architecture/README.md`, `docs/cli-reference.md`, `README.md`, `docs/hosted-investigation.md`, `docs/backlog.md` | Update affected references/scope descriptions and any newly agreed conformance follow-ups. Keep runtime limitations accurate; do not claim functionality from specification adoption. Change only affected units. |

Likely decision treatment:

1. **Application specification role and document allocation:** record the consequential authority arrangement and any material relocation. This need not supersede behavioral decisions simply because their rules are now explained in the specification.
2. **Investigation initiation and attribution:** add a decision for the expanded-baseline model. A localized Evaluation addition can use a localized decision link without superseding the whole [claim/evidence/evaluation definition](../docs/decisions/initial-core-concepts-decisions.md#distinguish-claim-content-evidence-qualification-and-evaluation). If a whole headed decision is actually replaced, enumerate it and carry forward unaffected provisions. Do not supersede the operation/Lens or coordinated-views decisions merely to add attribution.
3. **Workspace/context terminology:** record any cross-cutting meanings needed for the agreed simple workspace model. Richer shared context remains a future UX candidate; continuity implementation and precise requirements remain deferred. Do not introduce a persistence decision or supersede “Stable inputs as the session precondition” through this reconciliation.

Observation location requires no new decision or supersession: the clarified reading preserves the existing sink and evidence-exclusion contracts.

Separating a capability reference from shared architecture does not itself change accepted Lens behavior. Not prescribing a summary-first default agrees with the existing optional-summary decision; no supersession is needed on that account. Identify any actual semantic or authority changes during drafting rather than infer them from document relocation.

Each actual replacement needs both a backward `Supersedes` mapping and forward `Superseded in part`/`Superseded by` metadata. Do not rewrite accepted rationale or rewrite completed records to fit the new organization. The recent coordinated-views and qualified-construction records remain accepted unless an identified decision truly changes.

**Historical-reference policy agreed after review.** Preserve historical links as recorded and interpret them against the identified baseline or historical context; changed destinations alone do not warrant repair. Follow the [updated workflow](../dev/workflow.md#references-in-historical-records): inspect incoming references when changing governing material and assess whether a separate clarification is needed for intelligibility or continuing authority. Update mutable documentation within scope. The foundation draft therefore has no compatibility anchors or local appendix; the reference assessment below replaces that earlier proposal.

**Separate process maintenance:** propose changes to `AGENTS.md`, `dev/workflow.md`, `dev/planning.md`, `dev/review.md`, and `dev/engineering-guidelines.md` so they direct agents to the specification, define human-maintained ownership, distinguish intended behavior from capability status, and require reporting contradictions. Check `dev/process-conventions.md` only for consequential convention changes. These proposals belong in the handoff for a separate human-directed process task, not as edits bundled into this product-design work.

Existing conformance gaps must survive: [retained-answer presentation](../docs/backlog.md#allow-a-view-to-be-requested-for-an-existing-projection), [captured-basis observations](../docs/backlog.md#preserve-captured-basis-attribution-in-observations), and the coordinated-views decision's other documented limitations. Observation attribution correction remains required before reliance on newly collected observations for state-specific assessment; attribution is not a promise of full reproducibility. The plan index says module investigation has not begun while status/architecture describe integrated interpretation; flag this status discrepancy for human reconciliation, without guessing or changing task/plan lifecycle here.

## Discussion outcome and drafting authorization

Document roles, inclusion of UX and high-level application architecture, the balance of prescription and delegation, and the continuing descriptive role of `docs/architecture/` have been discussed and agreed as direction. The broad specification categories are a working organization, not a final outline. Adaptation of the Lens-planning proposal follows reconciliation and promotion, outside this assignment.

Observation delivery and evidence separation are resolved by the supplied 2026-10-11 foundation revision. Preserve baseline application delivery behavior and explicit evidence exclusion; the new foundation permits historical/comparative artifact use without independent evidential reuse. Existing sink decisions are not superseded.

Continuity over time remains aspirational, with implementation and precise requirements deferred until more is understood about the application. The initial workspace UX is a simple collection and arrangement of Views displayed in a tab or window. Shared Workspace purpose and defaults are retained as potentially optional future UX candidates. The foundation’s investigation context already has a place in the simple model through accumulated Views, captured bases, and relevant lineage.

The distinction between shared architecture and toolbox entries is also agreed. Propose a separate supported-capability reference in the later package. The app specification need not name a particular Lens or View unless a deliberate application design depends on it, and it prescribes no privileged initial Lens or View now. Shared interpretation contracts and currently accepted capability behavior remain preserved.

Correction/disagreement disclosure and qualified reconsideration belong to the epistemological contract; access to earlier interpretations is intended UX behavior. Explicit immutability of retained evidence and qualified results is a high-level architectural commitment. It is distinct from retention duration and persistence, and does not prescribe UI state-management techniques.

The human authorized the coordinated draft on 2026-10-10, with this note retained for impact and follow-up work. The draft is ready for review, not approved or promoted. Its proposed initiation/resource rules carry forward the expanded baseline; its minimal new terminology is Workspace, investigation context, and investigation initiation, without introducing a formal shared-purpose object.

Preparation checked the supplied designs against relevant governing concepts, constraints, accepted decisions, plans, and descriptive documentation. This is a documentation reconciliation, not a new runtime conformance audit. A prematurely created candidate-future-UX note and its index entry were removed; the useful context remains here pending review and promotion. No supplied source, canonical specification, process instruction, or application code has changed; existing capability and GUI exploration notes remain untouched.

## Draft package and review map

Start with the [application specification draft](../drafts/app-specification/app-specification.md), then the [decision draft](../drafts/app-specification/decisions/application-specification-boundaries.md). The [capability reference draft](../drafts/app-specification/capability-reference.md) describes the supported toolbox separately. This note remains the review and follow-up guide; it is not part of canonical promotion.

The package root corresponds to `docs/`. Each `-revisions.md` file identifies complete replacement/addition units. Its promotion-content blocks use links relative to the canonical destination, so some links intentionally do not resolve from the draft location.

| Draft artifact | Canonical destination / review purpose |
| --- | --- |
| [app-specification.md](../drafts/app-specification/app-specification.md) | New `docs/app-specification.md`: intended behavior and high-level architecture. |
| [capability-reference.md](../drafts/app-specification/capability-reference.md) | New `docs/capability-reference.md`: current supported questions, actions, presentations, and limitations. |
| [decisions/application-specification-boundaries.md](../drafts/app-specification/decisions/application-specification-boundaries.md) | New decision: document authority, simple Workspace, initiation attribution, and immutability versus retention. Set acceptance metadata only on approval. |
| [core-concepts-revisions.md](../drafts/app-specification/core-concepts-revisions.md) | Role paragraph; localized Evaluation and Session additions; investigation-initiation and Workspace definitions. Existing term provenance remains. |
| [architectural-constraints-revisions.md](../drafts/app-specification/architectural-constraints-revisions.md) | Role paragraph; initiation/parent/resource/attribution rules; retention distinction. Existing rules preserved. |
| [backlog-revisions.md](../drafts/app-specification/backlog-revisions.md) | Three new candidates: initiation-attribution assessment, bounded shared agent context, and navigation-origin lineage. Reconcile existing Lens/GUI candidates and the Git-history reference. |
| [README-revisions.md](../drafts/app-specification/README-revisions.md), [decisions/README-revisions.md](../drafts/app-specification/decisions/README-revisions.md), [implementation-conventions-revisions.md](../drafts/app-specification/implementation-conventions-revisions.md) | Document authority, navigation, decision requirements, and subordinate conventions. |
| [plans/module-investigation-revisions.md](../drafts/app-specification/plans/module-investigation-revisions.md) | Update the architectural-basis passage without changing the approved slice or inferring lifecycle status. |
| [architecture/README-revisions.md](../drafts/app-specification/architecture/README-revisions.md), [cli-reference-revisions.md](../drafts/app-specification/cli-reference-revisions.md) | Link intended design and current support; retain current limitations. |
| [outside-docs/foundation/product-design.md](../drafts/app-specification/outside-docs/foundation/product-design.md) | **Outside `docs/`: complete replacement of `foundation/product-design.md`.** Supplied 2026-10-11 research-observations revision preserved exactly; no local navigation appendix. Requires explicit foundation adoption. |
| [outside-docs/foundation/README-revisions.md](../drafts/app-specification/outside-docs/foundation/README-revisions.md) | **Outside `docs/`: `foundation/README.md`.** Use the research-owned description of conceptual authority and application conformance. |
| [outside-docs/README-revisions.md](../drafts/app-specification/outside-docs/README-revisions.md) | **Outside `docs/`: root `README.md`.** Add conceptual/intended/supported navigation. |
| [outside-docs/STATUS-revisions.md](../drafts/app-specification/outside-docs/STATUS-revisions.md) | **Outside `docs/`: `STATUS.md`.** Link the per-action capability reference while retaining the concise capability/limits summary and existing review date. |

### Meaning preserved, staged, or changed

| Expanded baseline topic | Draft treatment |
| --- | --- |
| §§2.1–2.3: qualified information, logical execution, evidence and method | Research concepts remain in the narrower foundation; application responsibilities, resource choices, selection, disclosure, and retained-answer behavior are stated in the spec using existing local contracts. |
| §§2.4–2.5: identity, continuity, labels | Preserve identity/reference and qualification contracts. Continuity across changes/restarts remains an aspiration; implementation and precise future lifecycle requirements are deferred by agreement. |
| §3.1: request interpretation and initiation | Carry forward request-scoped/autonomous distinction and parent/resource/attribution obligations. Add localized core meanings and constraints; prescribe no general planner. |
| §3.2: summary and recursive navigation | Preserve qualified navigation and summary as an option. No privileged initial Lens/View, consistent with the accepted coordinated-Views decision. |
| §§3.3–3.4: workspace and navigation | Deliberate refinement: simple collection and arrangement of Views first. Rich shared context and specialized workspace kinds remain future UX candidates; no permanent root, name, or persistence requirement. |
| §§3.5–3.6: source and comparison | Preserve actual source-disclosure classification, captured support, qualified comparison, and the boundary between presentation and new claims. |
| §3.7: agent integration | Preserve shared referents, exact result versus repeatable request, minimum context, provenance, exclusion, and artifact publication expectations. Artifact transport is an option; interactive exchange remains a possibility. |
| §3.8 and §5: observations/output boundary | Preserve event scope, provenance, subjective reports, build-selected production delivery, development/test alternatives, and exclusion. The final supplied revision requires a designated research destination and prohibits independent repository-evidence reuse, while allowing provenance-preserving artifact use. The intermediate latest-release and agent-access restrictions are not adopted. Research-versus-development provenance, separation of diagnostics/product telemetry from research evidence, and outside-or-explicitly-exclude support are deliberately retained as local application requirements from the expanded baseline, although removed from the narrower foundation. |
| §4: capability examples/language support | Examples remain illustrative, not prioritized requirements. General and conditional qualification rules survive in the spec; the separate reference lists actual support. No new Lens family or language implementation commitment. |
| Accepted local interpretation and construction contracts | Retained unchanged, with references. Explicit immutability is clarified as distinct from retention. No pending Lens-representation policy is adopted. |

No accepted headed decision is replaced by this draft, so there are no decision supersession mappings to apply. The new decision supplements existing decisions; historical accepted bodies and completed plans/records remain untouched. Reassess this if review changes a substantive contract. The existing supersession mappings made by earlier decisions must remain intact.

**Historical foundation links:** the replacement is exactly the clarified supplied research document. Historical anchors may cease to resolve against today’s file; that is expected under the agreed policy. Mutable plan/backlog references are migrated. Accepted records retain their original links and rationale; see the substantive reference assessment below.

### Points to review before promotion

- Whether the specification draws the intended line between stable application guarantees and delegated implementation choices. In particular, the extensibility passage describes evidence from representative additions without selecting a registry or requiring each Lens to be prompt-only.
- The initiation-attribution obligations and the proposed scoped assessment of existing prerequisite work. These preserve the expanded baseline but have not received a fresh full runtime conformance audit.
- The historical-reference assessment below and the supported-capability reference. Its current limitations must remain accurate when promoted.
- The three new backlog candidates and additions to existing Lens/GUI entries. They define useful work without selecting a delivery sequence or authorizing implementation.

### Promotion and process dependencies

Review the 16 canonical destinations as one coordinated package. Explicitly approve the foundation replacement and decision; merge revisions into the then-current documents, set acceptance metadata, preserve existing decision history, and verify links in their canonical locations. Promotion does not authorize code changes. Retain this note for the independent follow-ups below rather than deleting it with the drafts.

Separately update `AGENTS.md` and the applicable `dev/` guidance under human-directed process maintenance: direct agents to the spec, establish human ownership, distinguish intended from implemented behavior, preserve decision requirements, and delegate ordinary mechanics within the contracts. Include reviewer reading guidance in `dev/review.md` and identify the capability reference as descriptive current-support documentation. The human has already updated the historical-reference guidance; that item is resolved. No process edits are bundled here. Until promotion, existing authorized work continues under adopted guidance; the draft does not pause it. Establish the remaining process changes before implementing under the new arrangement. The plan-index discrepancy about whether module investigation has begun also needs human lifecycle reconciliation; neither its status nor historical records were rewritten.

### Historical-reference assessment

The incoming-reference inventory was reviewed for meaning and continuing authority, not merely anchor validity. No separate amendment is presently warranted:

- [Initial core-concepts decisions](../docs/decisions/initial-core-concepts-decisions.md): affected summary, navigation, test, and resource anchors occur in its source-basis table. The decisions state their definitions and rationale locally; surviving commitments and existing partial-supersession mappings remain intelligible. The changed foundation does not reverse those still-binding definitions.
- [Qualified Projection construction](../docs/decisions/qualified-projection-construction.md): the affected execution-planning reference accompanies an explicit statement of the pushdown/lazy-materialization permission and its qualification, population, and construction boundaries. That rule remains in the narrower foundation and specification; the record does not rely on the old anchor to convey it.
- [Coordinated Views](../docs/decisions/coordinated-views-and-qualified-results.md) and [the earlier interface-boundary decision](../docs/decisions/keep-views-grounded-in-core-projections.md): their cited presentation concepts and local rules remain intelligible; existing supersession metadata already states their authority. No additional supersession follows from the document split.
- [The representation audit](../records/audits/2026-10-06-user-model-concept-representations/REPORT.md): its linked navigation, workspace, and agent-context descriptions report the investigated baseline. Later conceptual changes do not retrospectively correct that historical assessment. It remains evidence to reinterpret during Lens/GUI planning, not authority for the new specification.

The supplied expanded baseline’s initiation additions are not in the older adopted foundation. Their research revision (`87f74eb`) and substantive rules are now carried into the new decision/specification/constraints, so continued understanding does not depend on an ignored input. No foundation re-sync appendix-maintenance task remains; future replacements still require the workflow’s incoming-reference assessment.

### Review disposition and discussion agreements

Claude reviewed draft `9a31d7e` and note `fb47f18` on 2026-10-10, without seeing the later §3.7 clarification. The review found no blocking defect and recommended corrections before promotion. Its original returned text remains untouched; this section records our disposition rather than rewriting that review.

| Review findings | Disposition |
| --- | --- |
| B1, B2: requested answer versus prerequisites; initial-View authorization | Clarified the three-way distinction. Human agreement: opening a repository or subject is an explicit request for its initial View **when the action communicates that behavior**. Applicable resource constraints still govern; work beyond the request remains autonomous. No particular initial View or autonomous policy is selected. |
| B3: smaller baseline omissions | Restored explicit timing/trigger delegation, accurate language relationships, agent CLI invocation and reference copying, resource estimates/thresholds, formalized task references, plain-English qualification, and a constructed working surface. Context lists now include repositories and applicable lineage without requiring unimplemented roots/live dependencies. |
| F1: investigation context | Mapped the foundation concept to accumulated Views, captured bases, and relevant lineage, including discovery, source-navigation origin, and inputs contributing to comparisons/summaries. Added a concise core definition. Optional future **shared Workspace purpose/defaults** is distinct. |
| F2: continuity | Foundation commitment stands; realization and precise future requirements remain deferred. No-silent-retargeting is unconditional; the current unchanged-input Session remains a disclosed limited subset. |
| F3: observation storage | Used the supplied “In research use” clarification. Rejected additional restrictions making development-build observations ineligible for research or requiring production builds for research; those were not agreed. Build type alone does not determine research use; evidence exclusion remains required. |
| F4: historical links | Human chose historical-context interpretation and additive clarification where materially needed. Removed all compatibility additions; incoming-reference assessment above found no amendment necessary. Human updated development guidance separately. |
| R1, R2: duplication and conformance gap | Reduced the specification’s detailed initiation rules to user-visible behavior plus links to definitions and operational constraints; shortened new core lifecycle wording. Decision retains reviewable rationale and adopted choices. Added the attribution assessment-gap link directly to the constraint. Immutability is explicitly referenced as an architectural commitment. |
| R3: delegated versus reserved choices | Human design covers consequential behavior/contracts and **architectural boundaries with consequential external or cross-cutting effects**. Agents can and should design internal boundaries under the engineering guidelines. Use this default with explicit exceptions rather than marking every detail. Escalate undelegated consequential contracts, dependencies, policies, and tradeoffs. |
| R4–R6: authority, naming, reference accuracy | Removed circular authority wording; decisions must conform to or explicitly revise the spec. Unified “Capability reference,” clarified tab/window wording, added supported dependency cycles and operational-command pointers, and added STATUS navigation. Context scope across Workspaces is a follow-up design question. The plan’s “No foundation revision is required” sentence was removed because this coordinated package includes one; the slice itself is not enlarged. |
| G1–G7: follow-up omissions | Added reviewer-guidance maintenance, GUI-note reconciliation, note-index follow-up, STATUS/reference division, initial-View/resource-policy consequences, and durable baseline provenance. Foundation re-sync appendix work is unnecessary under the agreed policy. Existing module-investigation prerequisites fall under the new assessment gap, not new obligations silently added to the old plan. |

Added short examples of request resolution, opening a related View, and paging after a correction. Preserved the stable decision headings for future partial supersession. Broader shortening of this exploratory note can wait until promotion, when its retained purpose becomes primarily follow-up work.

### Re-review disposition

Claude re-reviewed draft `9741cfe` and note `ed9fc81` on 2026-10-10, agreed with all prior dispositions, and found no blocking issue. The original review text remains untouched. Process commit `c308640` supplies the two referenced `dev/` anchors; no process edits are needed for those links.

- **N1 — partial navigation lineage:** accepted as a disclosed current limitation. A focused static inspection of `ViewRequest` and execution in [session.ts](../src/lib/session.ts), request/View capture in [observations.ts](../src/lib/observations.ts), and [investigram selection](../src/lib/investigation/selection.ts) confirms that follow-ups retain their selected subject while ordinary navigation has no general origin-View field. The spec now expressly applies the intended context contract to the CLI shell as well as graphical interfaces, without requiring a stored View object. Decision and capability reference disclose the limited subset, and a new backlog candidate scopes assessment and support. A manually supplied reference does not prove which View supplied it; preserve established origin and disclose unavailable origin rather than inventing lineage. No immediate code migration is authorized.
- **N2 — explicit initial View:** corrected the decision sentence. The answer is governed by the explicit request’s resource constraints; additional prerequisite investigation is request-scoped system-initiated work.
- **N3 — stable anchors:** added explicit anchors to the new specification, capability reference, and decision headings, and to promotion sections in affected mutable-document revisions. Existing links keep their stable slugs. Verified the human-added `dev/workflow.md#references-in-historical-records` and `dev/engineering-guidelines.md#dependencies-and-boundaries` anchors. The supplied foundation remains unchanged.
- **N4 — research storage:** did not adopt the suggested unconditional outside-repository sentence. It would narrow the prior human-agreed reading of §3.7 together with §5’s explicit-exclusion alternative. At that review round the concern remained for human consideration. The subsequent supplied foundation revision and human clarification resolve it below.
- **N5 — optional refinements:** retained the existing decision heading for investigation context/Workspace provenance and the note’s stated distinction between exploratory history and current disposition. Neither requires a further conceptual change.

Those revisions subsequently received the second re-review described below; the package remains unadopted. Validation includes the focused source inspection described above and document checks, not runtime probes or a comprehensive conformance audit.

### Second re-review and final observation-boundary clarification

Claude’s second re-review covered draft `9a8a2e7` and note `a5d9439`. It accepted the lineage, wording, and anchor fixes, leaving N4 for deliberate human resolution and one foundation-guide anchor nit. Its original text remains untouched.

After considering N4’s alternatives, the human supplied a new research-observations version of the foundation on 2026-10-11 and clarified that the weaker restriction is deliberate. The final rule concerns evidential role: PostCode can revisit, compare, or otherwise use its own output as identified artifacts, but cannot use it as independent repository evidence about the same repository. Its earlier conclusions must not become corroboration of themselves. This replaces both the former location-specific wording and the intermediate proposals requiring the latest production build or excluding observation access categorically from coding agents. The clarification does not change existing production-delivery configuration or development/test sink choices in the application baseline.

The full foundation draft now matches that supplied version exactly. Besides §3.7’s designated research destination, the input changes “stream” to “records” in initiation attribution, explicitly subjects shared agent context to §5, removes “silently” from the prohibition on independent repository evidence, and preserves artifact reuse conditional on provenance and evidence separation. The app specification and decision now state this resolved boundary without the earlier disputed interpretation. No new accepted-decision supersession is necessary: the current evidence-exclusion decision already prohibits the feedback loop and permits explicitly excluded output locations.

Added the missing `governing-documents` anchor to the foundation README revision. That fixes the nit without altering the supplied foundation design. These changes implement the human’s clarified direction and subsequently received the third re-review below; the package remains unadopted.

### Third re-review and foundation-guide wording

Claude’s third re-review covered draft `45c3fae` and note `69b8033` on 2026-10-11. It confirmed the exact foundation replacement, resolving promotion links, consistency with the revised evidence boundary, and closure of N4. It found no further concern preventing a human adoption decision. The original review text remains untouched.

- **O1 — retained local provisions:** explicitly recorded in the decision draft as well as the allocation table that research-versus-development provenance, separation of diagnostics/product telemetry from research evidence, and outside-or-explicitly-exclude support remain deliberate application requirements from the expanded baseline. Removing them from the conceptual foundation does not withdraw them locally. The decision preserves this rationale after promotion independently of this note. “Must not silently enter research evidence” concerns diagnostics entering the research evidence set; the unconditional prohibition on independent repository-evidence reuse concerns a different boundary.
- **O2 — agent-mediated re-entry:** added an explicit clarification to the specification’s generated-output evidence boundary: repository content derived from PostCode output does not independently corroborate the originating conclusions, and supplied origin provenance must be preserved where available. This does not require detecting otherwise unknown derivation. Implementation follow-up remains below; the semantic obligation is not deferred to that work.
- **O3 — research-source revision:** resolved by human agreement that local adoption history identifies the governing text. Cite the local adoption commit explicitly when useful; normally that provenance is implicit in Git history. An upstream revision may be recorded if supplied, but is not required and cannot be independently verified from this repository alone. No separate document version number or recurring upstream-revision bookkeeping is required.

The human also supplied the research-owned wording for the foundation README’s product-design entry. The draft now uses that sentence exactly, preserving the explicit heading anchor. Local document-allocation guidance remains in the application documentation rather than being added to that entry. This wording replacement and the note additions above have been checked locally; they do not constitute adoption or an additional independent review.

### Draft verification

Checked 405 relative links across the 16 proposed canonical destinations, with no unresolved promotion targets. Revision blocks match the checked promoted contents, and note file links resolve. The historical inventory found 20 incoming references outside notes/drafts; nine anchors in three historical records cease to resolve in the new foundation. Their meaning and continuing authority were assessed above rather than repairing them to satisfy a current-tree link check. The foundation draft equals the supplied 2026-10-11 research-observations document byte for byte; no local appendix remains. This remains documentation review, without a new runtime conformance audit. No canonical files, source inputs, accepted records, or unrelated notes are changed by these revisions.

## Impact and follow-up after adoption

### Candidate future UX

After review and promotion, consider creating `notes/candidate-future-ux.md` alongside candidate capabilities, under separate human direction. Carry forward richer optional Workspace context, shared purpose and defaults, context-sensitive suggestions, different Workspace kinds and initial Views, brief inspection versus keeping a View, and evolution beyond an initial subject. Preserve open questions about inferred versus explicit context, human correction, inspectable choices, branching, and agent sharing. Keep continuity/save-resume requirements undecided until further experience. The present package does not create that file or require its infrastructure.

### Lens representation follow-up

Return to [the existing Lens proposal](lens-representation-proposal.md) after reconciliation is promoted. Its discussion preceded this split and has not been adapted here. Reconcile it against the adopted spec, revised concepts/constraints, coordinated Views, and qualified construction before treating any discussion agreement as an accepted implementation direction.

Check specifically: Lens question versus reusable operation; subject designation versus parameters; request resolution versus qualified analysis; request-scoped initiation and attribution; one View versus multiple contributing Projections; current outcome retention and failure semantics; and extensibility evidence for mechanical and interpretive additions. A single `inspect` identity, registry/declaration syntax, removal of retained planning outcomes, unified identity policy, or serialized migration is not adopted by this package. Identify actual reversals and provide precise decision supersession only if later accepted.

### GUI notes and note navigation

Revisit [GUI design kickoff](gui/design-kickoff.md) and [GUI analysis needs](gui/analysis-needs.md) after adoption alongside the Lens proposal. Their linked workspaces, saved-workspace/return journeys, summary-first assumptions, agent focus across windows, and N14/N18 requirements must be reassessed against the simple Workspace, investigation-context floor, deferred continuity, unspecified initial View, and explicit-opening authorization. These notes remain exploratory and are not revised by this package.

Under human direction, add this reconciliation note and the existing product-design architecture-impact note to the [notes index](README.md), and update their mutable foundation links as part of their reconciliation. Consider trimming this note after promotion while retaining the impact/follow-up material and any independently useful rationale.

### Agent-mediated feedback-loop follow-up

When refining agent context and evidence provenance, apply the specification’s explicit boundary to repository comments, documentation, or commit messages derived from PostCode output. Determine how supplied origin/provenance is preserved through the selected exchange and subsequent analysis, keeping recorded assertions distinct from established truth. The origin may be unavailable; this work does not imply a general ability or requirement to detect every derivative assertion, or prohibit useful artifact sharing with coding agents.

### Reconcile the existing codebase in bounded steps

Promotion is documentation adoption, not a code migration. Begin subsequent implementation planning from the adopted contracts and current evidence, classify each difference as a defect, accepted limitation, missing capability, or unresolved design, then scope remediation with observable acceptance criteria. Avoid interpreting an aspirational requirement as a mandate to build all infrastructure at once.

| Work area | Existing evidence / next step |
| --- | --- |
| Request descriptions and subject status | Existing audit F1/F2 and backlog describe confirmed defects. Preserve that bounded remediation; don't require a complete Lens redesign first. |
| Lens, subject, and presentation representation | Existing F3–F5 findings and backlog require design choices. Reconcile the Lens proposal and GUI requirements before changing identities, parameters, schemas, or compatibility behavior. |
| Exact retained-answer presentation | Existing F6 limitation remains. Plan exact Projection redisplay so paging/reformatting preserves the selected answer and qualification; no persistence or multi-state prerequisite. |
| Observation captured basis | Existing accepted gap remains. Correct attribution before state-specific research assessment; do not confuse provenance with full reproducibility or archival retention. |
| Initiation, parent/trigger, and resource attribution | New scoped assessment candidate. Existing requests perform prerequisites, but the reconciliation has not established their end-to-end conformance. Existing module-investigation prerequisite/evidence work falls within this assessment gap, without expanding the old approved slice. Trace actual request/evidence/evaluation/observation paths before proposing record changes. Establish authorization and attribution before adding autonomous work. |
| Simple graphical Workspaces | Existing UI/UX and presentation candidates gain the agreed direction. Define a bounded first journey using actual core capabilities; preserve focus, placement/derivation distinction, corrections, qualifications, and history within the supported lifetime. No shared-purpose machinery prerequisite. Communicate that opening a subject requests its initial View and identify applicable resource constraints; background work outside that request needs an authorized autonomous policy. |
| Navigation-origin lineage | Current CLI follow-up provenance is partial; ordinary references do not carry an origin View. The new candidate assesses known versus unavailable origin and scopes preservation before claiming full investigation history, without requiring persistence. |
| Shared coding-agent context | New bounded-design candidate. Select a useful exchange, exact versus repeatable reference semantics, lifetime disclosure, capture attribution, and exclusion/publication behavior before choosing a transport. Specify which Workspaces/windows are included and how focus is selected; do not silently inherit a most-recently-active-window policy from GUI notes. |
| Interpretation/correction UX | Reuse existing correction/reconsideration contracts and formative UI evidence. Verify human-visible originals, replacements, conflicts, and qualified reconsideration in each newly supported presentation. Do not infer that a warning establishes error. |
| Future continuity, multi-state, live refresh, broader resource policies | Deferred design, not immediate conformance defects merely because absent. Preserve current disclosed Session limits and record specific requirements when the corresponding work is proposed. |

Use representative vertical journeys to verify changes: a mechanical request with resolution prerequisites; a summary and follow-up with reused outcomes; correction followed by exact-original inspection and paging; source disclosure; and an exported agent reference if that interface is added. Verification should distinguish supported behavior from plausible but false claims about basis, freshness, population, or initiation. No new runtime tests or audit were performed for this documentation draft.

Keep `STATUS.md`, the capability reference, CLI guidance, and descriptive architecture aligned as behavior changes. Do not edit the human-maintained specification to make a nonconforming implementation appear compliant. Resolve contradictions through the appropriate human-directed design process.
