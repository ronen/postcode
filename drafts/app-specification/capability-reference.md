# Supported investigations and views

This reference describes the current toolbox. The [application specification](app-specification.md) defines intended application behavior and shared contracts; inclusion here describes support, not architectural priority or a promise that a capability is the preferred starting point. [Project status](../STATUS.md) summarizes current scope, and the [CLI reference](cli-reference.md) supplies syntax, options, and detailed limitations.

PostCode currently provides a development CLI over one configured TypeScript project. The interactive shell retains an investigation within one process. There is no implemented GUI Workspace, general multi-Projection View composition, multi-state analysis, or save/resume facility. The default command is `modules`; `summarize` is an explicit request for interpretation.

## Mechanical exploration

| Action | Information requested | Subjects and important limits |
| --- | --- | --- |
| `modules` | Inventory of modules in the configured project | The supported TypeScript population and analysis limitations qualify the inventory; it is not a whole-repository architectural account. |
| `organization project` / `organization repository` | Organization under a project or repository scheme | Groups provide a navigation scheme, not a canonical decomposition of the program. Repository mode does not analyze every project in the repository. |
| `inspect` | Detail about the selected module or group, with associated retained interpretations where present | Exact names and generated handles can be missing or ambiguous. Inspection of a retained investigram has the separate meaning described below. |
| `dependencies` | Qualified dependency information for the project | Supported relations and resolution limits remain explicit. An opaque external endpoint does not establish an empty interior. |
| `children` / `parents` | Outgoing or incoming module dependencies | These names describe dependency direction, not a universal containment hierarchy. Subject applicability and resolution are limited to the current command family. |

See [inventory and inspection](cli-reference.md#inventory-and-inspection), [organization](cli-reference.md#organization-and-group-inspection), and [dependency investigation](cli-reference.md#dependency-investigation) for supported populations, selection forms, paging, and qualifications.

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

## Presentation and operational facilities

Unicode text and experimental JSON are the current presentation formats. Paging, continuation, source disclosure, and correction-detail options depend on the command family; the CLI reference is authoritative for their syntax. `--source-detail` reveals captured supporting source where supported and records that disclosure. Evidence sent only to the Investigator is distinct from source shown to the human.

`usage` reports execution attempts and available provider usage, including unsuccessful attempts, without inference. It is operational reporting, not a program Lens; its current lens-shaped descriptor is a compatibility detail. Unknown measurements are not zero, and reported totals are not confirmed billing.

The application submits observation batches to a separate local sink. Current recording has documented limitations, including request misdescription and incomplete captured-basis attribution. See [source detail and observations](cli-reference.md#source-detail-and-observations), the [recording correction](backlog.md#correct-lens-misreporting-in-observations-and-dependency-subject-status), and [basis attribution](backlog.md#preserve-captured-basis-attribution-in-observations). Do not infer complete research instrumentation from the existence of a sink.

Current commands cannot explicitly present a particular retained Projection again. Repeating a request for another page or format can select newer interpretation history; the human-facing continuity/disclosure limitation remains [open](backlog.md#allow-a-view-to-be-requested-for-an-existing-projection). Detection of relevant input changes invalidates further investigation and requires reopening; this is not live refresh.

## Scope of this reference

Other Lens families in the research design are illustrative possibilities, not implemented toolbox entries. Future GUI actions can use well-defined names without exposing internal Lens names. Keep this reference aligned with supported behavior as interfaces evolve; exact organization and vocabulary can evolve without changing shared architectural contracts.
