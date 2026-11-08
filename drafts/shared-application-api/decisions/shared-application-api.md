# Separate application capabilities from interface adapters

Status: in preparation
Decided: pending human acceptance
Arising from: [Shared internal application API](../plans/shared-application-api.md)
Scope: internal application/client boundary for existing capabilities, their execution and delivery; no public API or transport commitment

## Context

PostCode already separates evaluation, investigation, retained qualified Projections and pure arrangement. Its current Session path nevertheless accepts CLI-shaped requests, constructs bounded Views and renders output; parent worker handling finalizes usage by rerendering those Views. Provider setup and feedback also contain reusable behavior in terminal handlers. Another client can call some internal modules, but has no complete intended application boundary independent of terminal presentation.

The governing [responsibility separation](../app-specification.md#responsibilities-and-boundaries), [qualified construction](research-question-driven-observation.md#qualified-construction), [request model](lens-application-and-request-outcomes.md) and [exact retained-answer contract](exact-retained-answer-presentation.md) provide the foundation. The task is to make application coordination accessible through a coherent internal boundary, not to replace those semantics.

## Decisions

[Needs review: each headed choice below is recommended, not accepted.]

<a id="application-and-clients"></a>
### Application capabilities behind an internal client boundary

Expose existing application capabilities through intended internal request, result and lifecycle contracts. Shared application code owns semantic validation/resolution, evaluation and investigation coordination, qualified selection, retention, reference validity/binding, operational attribution and execution lifecycle. Interfaces use those contracts and own interaction, their input syntax, choice presentation, output rendering and publication mechanics. Interfaces may expose different subsets of capabilities.

Application execution does not depend on command parsing, terminal streams/formatting, GUI controls or an external-agent transport. Infrastructure remains separately owned behind the boundary. A small internal module boundary is sufficient; do not create an independently versioned package, network service or separate process requirement.

Reusing the current lower-level core preserves tested semantics. A wrapper around CLI execution would preserve the coupling; permitting each client to compose private evaluation/store machinery would duplicate coordination and make invariants vary by caller. A universal framework would introduce contracts without concrete users.

This boundary does not prescribe a permanent interactive CLI. Its existing behavior is preserved during extraction; future interface decisions may retain useful command-line facilities without retaining that shell.

<a id="qualified-delivery"></a>
### Deliver qualified content independently of output presentation

Application information requests use canonical Lens identities and explicit subject designations. Reports and exact retained-answer access have distinct request kinds. Deliver typed selected qualified content and operational results independently of an encoded or bounded human View. Preserve actual requests/resolution, selected-answer identity, captured support, qualifications, evaluation outcomes, generating/current-work attribution, reference lifetime and authoritative usage.

Reuse the existing qualified content families, including explicit composite support for associated inspection. Do not expose the mutable store, compiler, arbitrary record lookup or unqualified content stripped of its support. Result access is not a public source-export contract: source-bearing internal support still requires an appropriate human Presentation or a separately designed machine evidence interface before disclosure.

Presentation requirements and compatibility remain declared before evaluation. Client format and layout are distinct from those requirements. Presentation consumes supplied content; it does not reselect accumulated information, evaluate, acquire evidence or establish new architectural claims. A scoped reference-binding capability may return compact spellings only for the supplied population, as already permitted. Preserve current binding schedules while moving arrangement.

Exact-answer access follows fixed retained support and preserves corrections, associations, reconsideration snapshots and composite identity. It does not repeat the Lens request or inspect current history. Presentation failure, retained investigation failure, invalidation and current request failure remain distinct. Compatible reformatting/paging/detail does not extend the answer or infer new claims. Preserve existing refusal and continuation semantics.

Bounded CLI JSON is an interface artifact, not the complete application result. Using it as the common API would impose its display limits on future consumers. Exposing all store records instead would erase selected populations and qualification boundaries. Full selected content is already available in the implementation; carrying it across the private worker boundary requires attention to transfer cost and ownership, not a second answer archive.

<a id="runtime-and-publication"></a>
### Preserve one execution owner and explicit publication obligations

Provide one default application runtime using the existing private compiler worker, with Git and investigator dialogue/usage ownership in the parent. Keep one active operation, terminal Session interruption, explicit close, settled pending work and separately awaitable cleanup. Do not require another interface to reproduce this ownership, and do not expose the worker protocol as an external API.

Validate requests against the unchanged-input Session contract before execution and before successful delivery. Delayed publication also validates before output and after output; share that lifecycle policy while leaving actual output with the interface. Invalidation after output must remain visible. These checks remain best-effort and non-atomic; neither delivery nor a retained reference promises comprehensive freshness. Do not add automatic restart, refresh, or historical access after Session closure/invalidation.

Keep final usage and work attribution available independently of rendering, disposable compiler state and research recording. Rendering uses finalized reporting context; it does not recreate attempts or change immutable answer content. Direct lower-level execution may remain an implementation/testing seam without becoming a second supported client backend.

This retains the [execution-ownership decision](execution-ownership-and-cancellation.md) and [validity contract](research-question-driven-observation.md#validity-and-recording). Choosing a new process transport, allowing concurrent requests or making cancellation nonterminal would require separate decisions.

<a id="operational-services"></a>
### Separate reusable operational services from interface policy

Application use does not require a terminal or observation sink. Provider configuration and project-independent credential/check services remain reusable without command handlers. Intentional enablement, billing route, credential isolation, preflight and no-fallback behavior remain unchanged; interfaces communicate disclosure and obtain the relevant interaction input.

Feedback creation/submission accepts explicit available displayed context and returns structured delivery outcomes. It does not infer history, inspect a live store or initiate investigation. Interfaces retain their displayed context and provide acknowledgments. Preserve the existing explicit feedback protocol and current CLI recording, destination and delivery behavior; do not introduce a research-mode framework or treat omitted recording as failed delivery. Returned operational qualifications and attribution never depend on observation submission.

This is a bounded extraction of current behavior. The optional-recording and feedback-snapshot backlog remains separate; a new feedback schema, sink or authentication flow is not needed to establish the application boundary.

## Governing impact and adoption

Add the application/client boundary to the application specification and architectural constraints together with acceptance of this decision. Existing core-concept meanings and foundation remain unchanged. This decision supplements existing decisions and does not replace a headed predecessor: CLI preservation clauses still govern CLI behavior, while the new internal result contract is not that CLI's external output schema. Existing [experimental-output policy](experimental-structured-outputs.md) does not by itself authorize semantic changes during this extraction.

At adoption, the CLI-shaped request normalization, rendering inside execution, inferred worker result contract and operational-service coupling identified in the companion plan are known conformance work. Establish conformance for all existing paths in that plan before claiming the new boundary is implemented. Do not defer those separations to a future client. No newly imposed conformance work is left to an unspecified backlog.

Existing navigation-origin, research basis-export, future account structure and persistent continuity limitations are unaffected. Future capability planning may extend or revise this internal API; this decision does not require placeholder fields, universal schemas, public compatibility versions or delivery of any future client to complete the extraction.

## Validation

Accept implementation only with direct API scenarios and adapted CLI coverage of qualified resolution, every current result family, interpretation/follow-up, exact retained continuity after corrections and accumulation, source disclosure, reference allocation, final usage, invalidation/cancellation and feedback/delivery failures. Use existing offline investigator and extension fixtures. Runtime checks and independent review follow the companion plan; this draft itself is not runtime evidence or implementation authorization.
