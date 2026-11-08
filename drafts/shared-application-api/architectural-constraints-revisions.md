# Proposed revisions to docs/architectural-constraints.md

## Add “Application and interface boundary”

Insert immediately before “Views and analysis boundary”. Preserve that existing section and its rules.

<a id="application-and-interface-boundary"></a>
## Application and interface boundary

- Expose shared application capabilities through intended internal request, result and lifecycle contracts. Keep semantic request resolution, evaluation/investigation coordination, qualified selection, retention, references and operational attribution independent of interface parsers, controls, renderers and transports. Interface adapters call those capabilities rather than owning or duplicating their logic; they own interaction, input translation and presentation. Different interfaces may expose different subsets. [[Application/client boundary](decisions/shared-application-api.md#application-and-clients)]
- Deliver selected qualified content and operational outcomes independently of encoded or bounded interface output. Preserve captured support, answer identity, qualifications and meaningful failure/materialization distinctions; do not replace them with rendered strings or expose unrestricted mutable store access. Internal source-bearing support remains subject to the applicable disclosure boundary when exposed by an interface. [[Qualified delivery](decisions/shared-application-api.md#qualified-delivery)]
- Preserve explicit Presentation requirements and compatibility across this boundary, and keep exact retained-answer access distinct from fresh selection. Presentation and reference coordination may use only the supplied qualified population and scoped binding capability; they must not broaden the answer or acquire new information. [[Qualified delivery](decisions/shared-application-api.md#qualified-delivery)]
- Keep resource ownership, cancellation that ends the Session, input validity, final usage and cleanup reporting in shared execution services. Interfaces retain publication mechanics and apply the shared pre/post-publication validity policy; they must not treat delivery, cancellation or a cleanup deadline as proof of successful publication or resource exit. [[Runtime and publication](decisions/shared-application-api.md#runtime-and-publication)]
- Do not make application execution depend on research recording or terminal handlers. Preserve reusable provider setup and explicit feedback submission behind neutral service contracts, with credential/disclosure policy and feedback context/delivery guarantees intact. Keep interface acknowledgment and current recording policy separate from those services. [[Operational services](decisions/shared-application-api.md#operational-services)]
