# Proposed revisions to docs/app-specification.md

Add the following subsection after **Responsibilities and boundaries**, before
**Extension and compatibility**. Retain the existing responsibility table and its
analysis, construction and arrangement contracts unchanged.

<a id="application-interface-boundary"></a>
### Application functionality and interface clients

Application and investigation behavior is accessible through an explicit internal
application API independently of the interface used to request it. Shared
services coordinate qualified resolution, information requirements, Evaluation,
answer construction and retention, exact retained-answer access, reference
validity and operational outcomes. Clients do not own or duplicate that behavior.
They remain responsible for their interaction, input handling, Presentations and
output delivery. [[Internal application boundary](decisions/internal-application-api.md#shared-application-boundary)]

Requests distinguish information needs, exact retained-answer access and
operational reports. Application results preserve complete selected qualified
content and supporting context independently of an interface's display bounds or
format. Current invocation reporting remains distinct from answer meaning and
identity. Keeping a returned answer does not extend reference lifetime or promise
availability after Session disposal. Internal source-bearing support is neither
human disclosure nor an external-agent access permission.
[[Qualified answer delivery](decisions/internal-application-api.md#qualified-content-delivery)]

An interface can declare the information required by a Presentation through shared
coordination, while retaining its rendering choices and interaction policy.
Compatibility uses the answer's semantic contract and qualified materialization;
arrangement cannot acquire missing information or broaden a retained answer.
Application use without a Presentation is also supported. Interfaces expose only
the capabilities appropriate to their purpose; a new interface need not reproduce
every existing command or affordance.
[[Requirements and Presentations](decisions/internal-application-api.md#requirements-and-presentations)]

Shared provider/account, feedback and delivery services preserve their respective
credential, resource, actual-display and failure contracts independently of
command handling. Hosts retain explicit responsibility for runtime ownership,
validity at publication, actual output and selected recording. The API does not
prescribe a public library, network service, separate process, permanent schema or
particular worker transport. Future account, Presentation and interface work may
extend it within the governing contracts. Keeping useful command-line facilities
does not require indefinite retention of an interactive human command shell.
[[Runtime and publication](decisions/internal-application-api.md#runtime-and-publication)]

The associated [implementation plan](plans/application-interface-boundary.md)
establishes conformance for current capabilities. Adoption of this boundary does
not claim that the existing implementation already supplies it or that future
graphical and external-agent interfaces exist.
