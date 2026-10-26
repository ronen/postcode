# Capability reference

This reference describes the current toolbox. The [application specification](app-specification.md) defines intended application behavior and shared contracts; inclusion here describes support, not architectural priority or a promise that a capability is the preferred starting point. [Project status](../STATUS.md) summarizes current scope, and the [CLI reference](cli-reference.md) supplies syntax, options, and detailed limitations.

PostCode currently provides a development CLI over one configured TypeScript project. The interactive shell retains an investigation within one process. There is no implemented GUI Workspace, general multi-Projection View composition, multi-state analysis, or save/resume facility. The default command is `modules`; `summarize` is an explicit request for interpretation.

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
| `decompose` | Finer selectable aspects of the selected account | Requires an investigram; the resulting composition does not assert an exhaustive or disjoint partition of the program. |
| `examine` | Deeper investigation of the selected aspect, including useful limits or contrary findings | Requires an investigram; more investigation does not inherently increase truth or completeness. |
| `inspect @investigram-…` | The exact original retained account, supporting context, composition, and correction information | Does not generate a missing interpretation or redirect the selected subject to a replacement. |

Follow-up investigation produces a separate result linked to its selected subject. Original accounts and conflicting corrections remain retained; normal result selection can choose explicit replacements while exact inspection preserves the original. Reconsideration reports corrected context exposure, not proof that the account is wrong.

Repeated investigation requests reuse retained outcomes under the current operation contract. Some failures and stops are retained; communication/configuration failures have different retry behavior. There is no general rerun control. References and retained accounts last only within the transient Session, and one-shot follow-ups cannot reuse a prior process's investigram references.

<a id="presentation-and-operational-facilities"></a>
## Presentation and operational facilities

Unicode text and experimental JSON are the current presentation formats. Shell `present @answer-…` preserves an exact retained answer while changing format, supported source disclosure or paging. Fresh Lens commands select anew and reject paging flags. Options depend on the retained content family; the CLI reference is authoritative for their syntax. `--source-detail` reveals captured supporting source where supported and records that disclosure. Evidence sent only to the Investigator is distinct from source shown to the human.

`shell` provides successive requests in one transient Session. `auth chatgpt` supports the documented sign-in and account-management commands; authentication alone does not enable transmission of a project. See [commands](cli-reference.md#commands) and [hosted setup](hosted-investigation.md).

`usage` reports execution attempts and available provider usage, including unsuccessful attempts, without inference. It is subjectless operational reporting, with no Lens, Projection or View descriptor. Unknown measurements are not zero, and reported totals are not confirmed billing.

The application submits observation batches to a separate local sink. New version-three batches record the actual normalized request independently of the produced View. Subject lookup reports preserve candidates and qualified outcomes when no answer can be selected. Equivalent names and references share retained answers. Session results and observations carry bounded request-scoped reports of prerequisite and evidence work. Captured-basis attribution remains incomplete. See [source detail and observations](cli-reference.md#source-detail-and-observations), [request work attribution](architecture/README.md#request-work-attribution), and [basis attribution](backlog.md#preserve-captured-basis-attribution-in-observations). Do not infer complete research instrumentation from the existence of a sink.

The current CLI retains Projections and records produced Views in observation batches; it does not maintain a general navigable collection of retained Views. Investigram follow-ups retain their selected subject and composition relationships, but ordinary commands do not retain a general origin View for a supplied reference. For example, requesting `children @module-…` after viewing dependencies does not record which View supplied that reference. This is partial investigation context, not complete navigation-origin history. See the [lineage follow-up](backlog.md#assess-and-preserve-navigation-origin-lineage) before relying on the CLI to reconstruct an investigation’s navigation history.

Exact presentation resolves a retained Projection and its fixed support without selection, Evaluation, new evidence acquisition or provider usage. Views distinguish fresh and retained selection, expose precise answer IDs and separate Session-local aliases, and disclose one-shot reference expiry in text and JSON. Qualified failures remain answer semantics; successfully presenting them completes the current command. Detection of relevant input changes invalidates further requests and requires reopening; retained presentation adds no persistence or post-invalidation access.

<a id="scope-of-this-reference"></a>
## Scope of this reference

Other Lens families in the research design are illustrative possibilities, not implemented toolbox entries. Future GUI actions can use well-defined names without exposing internal Lens names. Keep this reference aligned with supported behavior as interfaces evolve; exact organization and vocabulary can evolve without changing shared architectural contracts.
