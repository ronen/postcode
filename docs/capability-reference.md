# Capability reference

This reference describes the current toolbox. The [application specification](app-specification.md) defines intended application behavior and shared contracts; inclusion here describes support, not architectural priority or a promise that a capability is the preferred starting point. [Project status](../STATUS.md) summarizes current scope, and the [CLI reference](cli-reference.md) supplies syntax, options, and detailed limitations.

An [internal in-process application entry](architecture/README.md#application-entry)
provides the implemented semantic operations and complete selected qualified content
without CLI presentation or an observation sink. Exact answers retain their fixed
support through later work. It also exposes captured capabilities, request work and
usage, with separate account/configuration, observation and feedback services.
This does not establish a public transport, browser API or authorized external
evidence export; human-facing CLI output keeps its existing bounds.

PostCode currently provides a development CLI for investigating implemented architecture in one configured TypeScript project. Its retained interpretations arise from module and selected-content investigations, including invocation of retained follow-up options through the application API. Qualified follow-up uses the earlier content actually supplied as part of its captured basis within the active process, preserving its provenance, qualifications and delivery limits. Exact retained-answer presentation preserves the selected content, designated alternatives and independently captured standing and change context. These contributions remain distinct from captured program states. This does not implement investigation of hypothetical alternatives or intended designs, general capture of participant-supplied architectural material, or a general interface accepting arbitrary earlier Projections as inputs. The broader [architectural scope](decisions/specialized-architectural-investigation.md#adoption-and-conformance) leaves this subset valid.

The interactive shell retains an investigation within one process. There is no implemented GUI Workspace, general multi-Projection View composition, multi-state analysis or save/resume facility. The default command is `modules`; `summarize` is an explicit request for interpretation. An external agent may invoke documented CLI capabilities subject to their ordinary output and reference-lifetime contracts; this is not a shared-Workspace synchronization or general contribution interface.

## Common contribution capabilities

The [structured architectural accounts plan](plans/structured-architectural-accounts.md) defines migration of existing mechanical and agentic information to common qualified contributions, exact association declarations and exposure-based reconsideration. It also requires state-dependent-behavior investigation, one bounded state diagram and execution of retained follow-up options through supported application APIs. These application capabilities are implemented and covered by the [integrated checkpoint](../records/validation/structured-architectural-accounts/m4-integrated-checkpoint.md).

Mechanical module, export, dependency and organization answers now retain common contribution support. Their method-specific findings remain selected after an organizing use changes; fresh answers disclose applicable displacement, reconsideration and inconsistency, while exact retained answers keep their captured status. Symbol and group identifications are available through the common ledger alongside module identities. All four existing agentic operations and their supported direct/CLI/worker callers now use common contributions, explicit designations and captured exposure causes. The old tree/correction route is removed. API availability alone must not be described as a new CLI command, GUI or public transport. The initial user-facing catalogue remains separate from this mechanism delivery.

<a id="mechanical-exploration"></a>
## Mechanical exploration

| Action | Information requested | Subjects and important limits |
| --- | --- | --- |
| `modules` | Inventory of modules in the configured project | The supported TypeScript population and analysis limitations qualify the inventory; it is not a whole-repository architectural account. |
| `organization project` / `organization repository` | Organization under a project or repository scheme | Groups provide a navigation scheme, not a canonical decomposition of the program. Repository mode does not analyze every project in the repository. |
| `inspect` | Detail about the selected module or group, with associated retained interpretations where present | Exact names and generated handles can be missing or ambiguous. Inspection of a retained investigram has the separate meaning described below. |
| `dependencies` | Qualified dependency information and cycles for the project | Supported relations and resolution limits remain explicit. An opaque external endpoint does not establish an empty interior. |
| `children` / `parents` | Outgoing or incoming module dependencies | These names describe dependency direction, not a universal containment hierarchy. Known incompatible subjects are refused without losing their Session references. |

See [inventory and inspection](cli-reference.md#inventory-and-inspection), [organization](cli-reference.md#organization-and-group-inspection), and [dependency investigation](cli-reference.md#dependency-investigation) for supported populations, selection forms, paging, and qualifications.

<a id="interpretive-investigation"></a>
## Interpretive investigation

Interpretations are qualified accounts, not established program truth. Hosted investigation requires explicit setup and repository-transmission enablement. The [hosted setup guide](hosted-investigation.md) describes the available authentication and billing routes; [progressive investigation](cli-reference.md#progressive-investigation-and-usage) describes outcomes and reuse.

| Action | Information requested | Subjects and important limits |
| --- | --- | --- |
| `summarize` | A terse qualified account of a module, with selectable aspects where useful | Requires one selected module. It is not a universal initial View or a summary of an arbitrary Workspace. |
| `explain` | Clarification of the selected aspect | Requires an exact retained investigram reference in the active shell. |
| `decompose` | Finer selectable aspects of the selected account | Requires retained selected content; the resulting aspects do not assert an exhaustive or disjoint partition of the program. |
| `examine` | Deeper investigation of the selected aspect, including useful limits or contrary findings | Requires an investigram; more investigation does not inherently increase truth or completeness. |
| `inspect @investigram-…` | The exact original retained account, supporting context, independently addressable items, organizing uses and captured status | Does not generate a missing interpretation or redirect the selected subject to a replacement. |

Follow-up investigation produces a separate result for its exact subject. Result designations select owned items or uses; all standing alternatives remain separate, with no last-writer or primary branch. Explicit supersession/withdrawal changes uses, while exact historical answers keep their captured content and status. Reconsideration reports changes to received information and does not establish error.

Repeated investigation requests reuse retained outcomes under the current operation contract. All attempt outcomes are retained and reported separately from selected answer meaning. Completed failures/stops can be reused; communication/configuration failures remain eligible for retry. The application API accepts an explicit `fresh: true` investigation; the CLI has no fresh-investigation flag. References and retained accounts last only within the transient Session, and one-shot follow-ups cannot reuse a prior process's investigram references.

<a id="presentation-and-operational-facilities"></a>
## Exact subjects and application-only operations

`openApplication` accepts `{ kind: 'lens', lens, designation: { kind: 'selection', subject } }` for exact whole contributions (`investigram`), items/components (`content`), and result uses (`designation`). The same objects cross the application worker boundary as plain structured data. Invalid, foreign or unsupported selections are refused before invocation. The existing CLI follow-ups accept whole-contribution references; they do not introduce item/component syntax.

`state-behavior` requests a qualified account of state-dependent behavior with its declared diagram result contract. `follow-up`, with an exact contribution reference and `parameters: { option: key }`, executes that owner's retained proposed question. These are internal application routes, with no new CLI commands or public transport. A partial account retains its limitations; failure to fulfill a diagram contract does not erase valid information or organizing declarations.

## Presentation and operational facilities

Unicode text and experimental JSON are the current presentation formats. Shell `present @answer-…` preserves an exact retained answer while changing format, supported additional detail or paging. Fresh Lens commands select anew and reject paging flags. Options depend on the retained content family; the CLI reference is authoritative for their syntax. `--more-details` reveals qualified detail and captured attribution where supported, without source excerpts. Detail access is recorded separately from inadequacy feedback. Evidence sent only to the Investigator is distinct from source shown to the human.

`shell` provides successive requests in one transient Session. `auth chatgpt` supports the documented sign-in and account-management commands; authentication alone does not enable transmission of a project. See [commands](cli-reference.md#commands) and [hosted setup](hosted-investigation.md).

`usage` reports execution attempts and available provider usage, including unsuccessful attempts, without inference. It is subjectless operational reporting, with no Lens, Projection or View descriptor. Unknown measurements are not zero, and reported totals are not confirmed billing.

The CLI submits observation batches to a separate local sink. New version-four batches record the actual normalized request independently of the produced View. Subject lookup reports preserve candidates and qualified outcomes when no answer can be selected. Equivalent names and references share retained answers. Session results and observations carry bounded request-scoped reports of prerequisite and evidence work. Captured-basis attribution remains incomplete. See [additional detail and observations](cli-reference.md#source-detail-and-observations), [request work attribution](architecture/README.md#request-work-attribution), and [basis attribution](backlog.md#preserve-captured-basis-attribution-in-observations). Do not infer complete research instrumentation from the existence of a sink. The current CLI does this automatically and has no public no-recording mode or question-specific capture control. This is current behavior, not a universal recording requirement: [research capture](decisions/research-question-driven-observation.md#research-capture) may be selective or absent in ordinary non-research use. Explicit feedback remains a deliberate submission. Optional decoupling is [backlogged](backlog.md#separate-optional-research-recording-from-feedback-context).

The current CLI retains Projections and records produced Views in observation batches; it does not maintain a general navigable collection of retained Views. Investigation follow-ups retain their exact selected subject and explicit declarations, but ordinary commands do not retain a general origin View for a supplied reference. For example, requesting `children @module-…` after viewing dependencies does not record which View supplied that reference. This is partial investigation context, not complete navigation-origin history. See the [lineage follow-up](backlog.md#assess-and-preserve-navigation-origin-lineage) before relying on the CLI to reconstruct an investigation’s navigation history.

Exact presentation resolves a retained Projection and its fixed support without selection, Evaluation, new evidence acquisition or provider usage. Views distinguish fresh and retained selection, expose precise answer IDs and separate Session-local aliases, and disclose one-shot reference expiry in text and JSON. Qualified failures remain answer semantics; successfully presenting them completes the current command. Detection of relevant input changes invalidates further requests and requires reopening; retained presentation adds no persistence or post-invalidation access.

<a id="scope-of-this-reference"></a>
## Scope of this reference

Other Lens families in the research design are illustrative possibilities, not implemented toolbox entries. Future GUI actions can use well-defined names without exposing internal Lens names. Keep this reference aligned with supported behavior as interfaces evolve; exact organization and vocabulary can evolve without changing shared architectural contracts.

`feedback [explanation]` reports inadequacy without starting investigation. The shell
includes the already displayed result and available context; one-shot feedback is
context-free and does not open a project or investigator. Batches retain the exact
previous output when available, without reconstructing unavailable basis or history.
