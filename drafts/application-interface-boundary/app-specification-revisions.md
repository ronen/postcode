# Proposed revisions to docs/app-specification.md

Add the following subsection after **Responsibilities and boundaries**, before
the `<a id="design-freedom-and-extension-evidence">` anchor belonging to
**Extension and compatibility**. Retain the existing responsibility table and its
analysis, construction and arrangement contracts unchanged.

<a id="application-interface-boundary"></a>
### Application functionality and interface clients

Application and investigation behavior is accessible through an explicit internal
application API independently of the interface used to request it. Shared
services coordinate qualified resolution, information requirements, Evaluation,
answer construction, interpretation selection into answers, retention, exact
retained-answer access, reference validity and operational outcomes. The API is
the request-validation boundary for direct callers. Clients do not duplicate those
operations; they own interaction, input handling, choice of supplied answers to
display, Presentations and output delivery.
[[Internal application boundary](decisions/internal-application-api.md#shared-application-boundary)]

Requests distinguish information needs, exact retained-answer access and
operational reports. Application results preserve selected qualified content and
supporting context independently of display bounds or format. Current eager
families deliver full selected materialized content, without making exhaustive
analysis or eager materialization a universal requirement. Typed application attribution and optional client invocation context remain
distinct from answer meaning and identity. Client Presentation methods affect
their artifacts, not application input or answer identity. Precise IDs suffice for clients;
compact aliases are a CLI affordance. Holding data does not extend the host-declared
Session/reference lifetime or promise availability after disposal. Internal
source-bearing support is not a ready-made public JSON or external-agent export.
[[Qualified answer delivery](decisions/internal-application-api.md#qualified-content-delivery)]
[[Method provenance](decisions/internal-application-api.md#method-provenance)]

Clients own Presentations and declare their information requirements through shared
coordination. Compatibility uses semantic content contracts
and qualified materialization; arrangement cannot acquire missing information or
broaden a retained answer. Presentations may be shared by compatible clients.
A direct information request without a Presentation defaults to current subject-kind
standard expansions supported by its answer family's content contract and may
request a supported subset;
exact retrieval never acquires missing support. Future costly expansions require
reconsidering that default. Interfaces may expose different capability subsets.
[[Requirements and Presentations](decisions/internal-application-api.md#requirements-and-presentations)]

Application work and client presentation/publication have distinct outcomes. An
answer successfully produced or retrieved remains completed application work when
subsequent client presentation fails; the client still reports its failure.
Application validity requirements must be satisfied before completing application
work, except where a guarded host explicitly takes ownership of those checks. Compact
alias handling preserves existing request and reference behavior without making
aliases a prerequisite for other clients.
[[CLI binding and outcomes](decisions/internal-application-api.md#cli-bindings-and-outcomes)]

Shared provider/account, feedback and delivery services preserve credentials,
resources, actual-display context and failure distinctions independently of command
handling. Shared publication guards enforce validity policy; hosts retain actual
output and recording choices. Feedback services accept available actual-display
context through neutral contracts or explicit context-free input; each client
exposes only the context it can supply. Future human
clients must reuse or re-establish verified output disclosure before exposing
internal support. The boundary permits later hosting without requiring a public
library, network service, separate process or permanent
schema. Keeping useful command-line facilities does not require indefinite
retention of an interactive human shell.
[[Runtime and publication](decisions/internal-application-api.md#runtime-and-publication)]

The associated [implementation plan](plans/application-interface-boundary.md)
establishes conformance for current capabilities. Adoption does not claim that
the existing implementation already supplies the boundary or that future graphical
and external-agent interfaces exist. Those tasks may extend these contracts.
