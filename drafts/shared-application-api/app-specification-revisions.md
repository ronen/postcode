# Proposed revisions to docs/app-specification.md

## Addition under “Responsibilities and boundaries”

Insert the following subsection after the existing responsibility discussion and before “Extension and compatibility”. Retain the existing responsibility table and analysis/presentation rules unchanged.

<a id="internal-application-api"></a>
#### Internal application API and interface clients

Application capabilities are accessible through an internal application API independently of the user or agent interface through which they are requested. The application owns semantic request validation and resolution, investigation and evaluation coordination, qualified result selection, retention and reference semantics, operational attribution and execution lifecycle. CLI, graphical and external-agent interfaces are clients of those shared capabilities. Each owns its interaction, interface-specific input handling and output presentation; interfaces need not expose identical subsets of functionality. [[Application/client boundary](decisions/shared-application-api.md#application-and-clients)]

The API delivers qualified selected content and operational outcomes without requiring command syntax, terminal rendering or a particular human View. Results retain their subjects, Lens meaning, captured support, qualifications, evaluation outcomes and exact-answer identity. Presentation requirements remain explicit before Evaluation; presentation-only operations preserve supplied answers. Access to an exact retained answer is distinct from a fresh request, and neither internal access nor holding returned data extends the supported Session/reference lifetime. [[Qualified delivery](decisions/shared-application-api.md#qualified-delivery)]

Shared execution owns resource cleanup, cancellation, input validity and authoritative usage independently of rendering and research capture. Interfaces publish output under the applicable validity checks and report failures without changing the meaning of qualified results. Reusable provider setup and explicit feedback submission are accessible without terminal handlers; interaction and acknowledgment remain interface responsibilities. [[Runtime and publication](decisions/shared-application-api.md#runtime-and-publication)] [[Operational services](decisions/shared-application-api.md#operational-services)]

The internal API does not commit PostCode to a public library, network service, separate process or permanent interactive CLI. It may evolve as additional capabilities are planned and implemented. Internal source-bearing support is not automatically an authorized external export; the human output and investigator/evidence-access boundaries still govern actual exposure. [[Application/client boundary](decisions/shared-application-api.md#application-and-clients)] [[Qualified delivery](decisions/shared-application-api.md#qualified-delivery)]

Adoption establishes the intended boundary, not current implementation conformance. The [application API plan](plans/shared-application-api.md) addresses the known request, rendering, delivery and operational-service coupling for existing capabilities. Future account, presentation, graphical and external-agent capabilities are separate work, not prerequisites for establishing this boundary.
