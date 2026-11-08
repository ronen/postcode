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
analysis or eager materialization a universal requirement. Invocation reporting
remains distinct from answer meaning and identity. Precise IDs suffice for clients;
compact aliases are a CLI affordance. Holding data does not extend the host-declared
Session/reference lifetime or promise availability after disposal. Internal
source-bearing support is not a ready-made public JSON or external-agent export.
[[Qualified answer delivery](decisions/internal-application-api.md#qualified-content-delivery)]

Clients own Presentation declarations, supplied once at composition or Session
opening and validated/captured by shared coordination before requests. Requests
choose among captured declarations. Compatibility uses semantic content contracts
and qualified materialization; arrangement cannot acquire missing information or
broaden a retained answer. Presentations may be shared by compatible clients.
A direct information request without a Presentation defaults to current subject-kind
standard expansions for its answer family and may request a supported subset;
exact retrieval never acquires missing support. Future costly expansions require
reconsidering that default. Interfaces may expose different capability subsets.
[[Requirements and Presentations](decisions/internal-application-api.md#requirements-and-presentations)]

Application work and client presentation/publication have distinct outcomes. An
answer successfully produced or retrieved remains completed application work when
CLI continuation presentation fails; the CLI still reports its failure. Alias
allocation remains append-only infrastructure with arrangement-time access confined
to the CLI's serialized requesting operation.
[[CLI binding and outcomes](decisions/internal-application-api.md#cli-bindings-and-outcomes)]

Shared provider/account, feedback and delivery services preserve credentials,
resources, actual-display context and failure distinctions independently of command
handling. Shared publication guards enforce validity policy; hosts retain actual
output and recording choices. CLI observation construction/classification stays
with its Views; feedback depends on neutral batch/sink contracts. Future human
clients must reuse or re-establish verified output disclosure before exposing
internal support. Plain structured-clone-safe delivery permits later hosting
without requiring a public library, network service, separate process or permanent
schema. Keeping useful command-line facilities does not require indefinite
retention of an interactive human shell.
[[Runtime and publication](decisions/internal-application-api.md#runtime-and-publication)]

The associated [implementation plan](plans/application-interface-boundary.md)
establishes conformance for current capabilities. Adoption does not claim that
the existing implementation already supplies the boundary or that future graphical
and external-agent interfaces exist. Those tasks may extend these contracts.
