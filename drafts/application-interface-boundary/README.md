# Application/interface boundary: review package

Status: in review
Prepared: 2026-11-08
Implementation baseline: `e9e4965d98aa7ab8c9c69469ea768141afce5c94`

This is planning only. Nothing in this package approves implementation or changes
governing material. The human agreed with the five recommendations below and supplied the further
merge directions recorded here. The combined package remains in review; no
implementation task record has been opened.

## Reading and decisions

Read the [implementation plan](plans/application-interface-boundary.md), the
[decision draft](decisions/internal-application-api.md), and the proposed
[specification](app-specification-revisions.md) and
[constraint](architectural-constraints-revisions.md) additions together.

Discussion outcome: the human said, “For the discussion choices listed in the
README, I think i agree with your recommendations”. This establishes the working
direction for all five choices. It does not yet adopt the detailed decision and
governing revisions, direct promotion, or authorize implementation.

| Choice for discussion | Recommendation | Alternative and tradeoff |
| --- | --- | --- |
| What does the API return? | Complete, fixed, qualified answer content and explicit operational outcomes. CLI Views are built by a client adapter. | Returning current View JSON is cheaper initially, but makes display bounds and CLI disclosure policy the information boundary. Merely dropping `rendered` is insufficient. |
| How does presentation influence acquisition? | Retain shared compatibility/requirements coordination, with client-owned declarations captured once at composition/opening. Direct content requests use current family standard expansions by default, with supported subsets explicit. | Moving all compatibility into clients duplicates semantic checks; a universal Presentation/plugin framework is unnecessary. |
| Where does the CLI run its Presentation? | Preserve its private worker/parent arrangement and usage-finalization behavior. Inside the worker, a CLI client calls the application API, then arranges supplied content. | Moving all arrangement to the parent would send larger source-bearing content across the worker boundary and require revisiting accepted wire/identity provisions. That relocation is not needed for architectural separation. |
| How much existing functionality is included? | Investigation, exact answers, operational reporting, output-boundary setup, and the existing provider/account and feedback operations, through cohesive services rather than one giant Session object. | Deferring account/feedback separation leaves application operations available only through command modules. New account management UX and recording modes remain out of scope. |
| What compatibility is promised? | Preserve CLI capabilities and behavior except the agreed application work-status change for failed continuation presentation; keep the API internal and evolvable. | Public SDK/versioned transport commitments would add lifecycle and compatibility work without a present client need. |

The third choice is a recommendation about implementation extent, not a requirement
that all future clients use the CLI worker protocol. The application boundary is a
logical dependency boundary; it need not coincide with a thread boundary.

## Combined package and merge directions

This package incorporates the independently developed `shared-application-api`
draft at `35e4cb5`, alongside this package at `c59bff7`, both based on `e9e4965`.
The branches' commits are preserved by integration into this planning branch.
The duplicate draft is removed from the combined tree after incorporating its
useful material; it remains available in Git history. No canonical plan or decision
is promoted by this merge.

The human directed synthesis after comparative and independent reviews. The later
human directions settled the runtime and contract choices as follows:

- Precise IDs are the general client contract. GUI clients display names and keep
  IDs internally. Arrangement-time aliases are CLI-only, supplied at worker
  composition and confined to that serialized requesting operation. Existing
  shared coordination allocations stay intact and may yield optional alias fields.
- CLI arrangement stays in the worker, with existing parent usage finalization and
  View/arrangement-key delivery. No general `bind` API or worker binding bridge is
  introduced. Plain structured-clone-safe delivery prepares for later GUI hosting.
- A produced/retrieved answer with CLI `unknown-continuation` has completed
  application work, failed CLI presentation/publication and exit code 3. Its
  observation application-work-status field changes from `failed` to `completed`;
  malformed syntax still follows the refusal path.
- Client declarations are supplied once at composition/opening, semantically
  validated and frozen. Requests name captured choices; capability metadata exposes
  semantic requirements, not CLI format lists.
- A direct information request defaults to all current standard expansions for
  its answer family's subject kinds, with supported subsets explicit. This is a
  domain default; current expansions are mechanical and inference-free. Future
  costly expansions require revisiting it. Exact retrieval cannot acquire more.
- The batch envelope, local sink and acknowledgment become neutral dependencies.
  CLI observation content construction/classification remains CLI-owned. Feedback
  uses only neutral contracts. Generalized batch construction and optional-recording
  controls stay out of scope.

| Material adopted from the other draft | Treatment in the combined package |
| --- | --- |
| Operation table | Spine of the plan's request/lifecycle surface; omit general compact binding under the later human direction |
| Static descriptor capture | Client ownership retained, capture/validation before requests explicit |
| Shared publication guard | Replaces the bare public `deferPublicationCheck` option, preserving pre/post-output checks |
| Four milestones and early review | M1 includes inventory, module inspection and exact `present`, with binding/outcome pass/fail criteria |
| Concrete direct journey | M2 covers modules → resolution → scripted investigation → follow-up → correction/association → exact earlier answer → fresh selection |
| Identity, usage and lifetime checks | Combined with this package's compatibility and companion-service matrix |
| Selected-content wording and non-export boundary | Avoid universal eager-materialization requirements; distinguish internal support from public output |
| Shared Presentations and GUI-host limitations | Compatible clients can share Presentations; future GUI hosting/content transport and verified human disclosure remain explicit work |
| Worker-backed facade and parent-side arrangement | Not adopted: retain the agreed in-process direct host and CLI worker arrangement, without moving usage finalization |
| Whole-content transfer measurement | Not adopted for the CLI: its existing View/key transport stays in place |

The synthesis also names progress callbacks, typed lifecycle/busy outcomes,
host-owned reference lifetime, repository/method delivery context, and untyped
`scripts/` consumers. It cites the existing Presentation/F5 and optional-recording
backlog scope and adds the directed GUI-host consequence to the MINIGUI note.
Local wording now distinguishes interpretation selection into an answer from a
client choosing an answer to display, scopes complete content to current eager
families, and identifies the application API as direct callers' validation boundary.

This is a merge pass, not closure of the earlier independent reviews. Their
substantive findings need reassessment against the combined package; no blanket
resolution is claimed. The original review material is preserved separately and
has not been edited. Required rationale and agreed directions are included here
and in the plan/decision so the package does not depend on disposable review files.

## Findings from implementation inspection

Paths below are relative to the repository root at the stated baseline. These are
source-inspection findings, not results of executing a new API or rerunning the
test suite.

| Existing boundary or contract | Evidence | Treatment |
| --- | --- | --- |
| Domain Session and immutable store | `src/lib/session.ts`, `memory-store.ts`, `records.ts` | Preserve Session ownership, one active operation, captured support and immutable retention. Do not export the store as the client API. |
| Lens definitions, operations and qualified resolution | `requests.ts`, `request-catalog.ts`, `subject-resolution.ts`, `mechanical-implementations.ts`, `investigation/operations.ts` | Reuse the fixed catalog, applicability, resolution outcomes, constructor registrations and operation distinction. Avoid a second dispatcher per interface. |
| Unbounded qualified content | `module-content.ts`, `organization/content.ts`, `dependencies/content.ts`, `investigation/content.ts`, `exports/content.ts` | These already resolve full fixed support independently of display bounds. Establish their intended application-facing boundary; do not invent another generic account schema. |
| Exact answer resolution | `retained-presentation.ts: resolveRetainedContent`, `answer-references.ts`, `investigation/selection-record.ts` | Reuse fixed-reference resolution, frozen revision/association snapshots, mechanical support and separate answer aliases. Extract target resolution/preparation from arrangement. |
| Isolated arrangement | `arrangeModuleView`, `arrangeOrganizationView`, `arrangeDependencyView`, `arrangeInvestigationView`, associated inspection | Preserve content-only arrangement. Convenience wrappers still coordinate bindings and need splitting at their existing seam. |
| Domain investigator and evidence access | `investigation/contracts.ts`, `evaluation.ts`, `execute.ts`, `context.ts`, `evidence-access.ts`, `evidence-delivery.ts` | Preserve the existing provider-independent investigation and subject-based captured-evidence interfaces. This is the built-in Investigator boundary, not an external-agent product API. |
| Execution ownership | `interactive-session.ts`, `session-worker.ts`, `session-protocol.ts`, `git-execution.ts` | Preserve private worker isolation, parent-owned Git/dialogues/usage, tagged replies, terminal cancellation and separately reported cleanup. |

The principal remaining couplings are specific, rather than evidence that the
whole core must be rewritten:

1. `ViewRequest` requires a CLI `Presentation`; it mixes command aliases, a nullable
   selector, `reference`/`subject` switches and the subjectless `usage` command.
   `NormalizedRequest` already distinguishes designation and Lens meaning, but
   still requires format/detail choices and embeds reporting defaults. Domain
   contract modules import the Presentation type from the terminal implementation.
2. `session.ts: requestExecutor` combines shared resolution, Evaluation and
   construction with Presentation selection, CLI arrangement and rendering. Its
   success result is a bounded View plus `rendered`; there is no application entry
   point returning the complete resolved answer without first making that View.
   `evaluateInvestigation` is a useful lower-level operation, but does not replace
   qualified Lens resolution, mechanical capabilities or exact-answer access.
3. `retained-presentation.ts: presentRetained` correctly avoids fresh selection, but
   also builds and renders CLI Views. `program-presentation.ts` wrappers mix store
   binding coordination with arrangement. Those wrappers can be split without
   changing the underlying selection or identity algorithms.
4. `request-reporting.ts`, `answer-presentation.ts` and `presentation-contracts.ts`
   mix useful data contracts with terminal text, command continuations and
   CLI-specific compatibility choices. `interactive-session.ts` performs parent
   usage finalization and rendering. Rename/re-export alone would retain these
   dependencies.
5. `command-execution.ts` combines application validity/outcome handling and
   observation submission with stdout/stderr, exit codes and terminal failure
   guidance. `feedback.ts` builds the actual feedback report while writing an
   acknowledgment and calling back into command publication for sink warnings.
   Shell feedback currently retains a snapshot shaped as observation records;
   it does not query a live store. Preserve that useful guarantee.
6. `cli.ts` and `shell.ts` repeat runtime/output-exclusion setup. The CLI selects
   hosted configuration and displays disclosure. `openai/configuration.ts`
   imports `productionChatGPTCredentials` from `auth-command.ts`, which also owns
   the cost-bearing `checkChatGPTConnection`. Credential storage, OAuth and agent
   adapters already provide reusable mechanisms; extract service assembly and
   connection checking from the command handler, not a new authentication system.

Existing tests provide meaningful starting points: `projection-content.test.ts`
checks full content beyond display bounds; `retained-presentation.test.ts` denies
selection/Evaluation during exact presentation; `presentation-compatibility.test.ts`
checks prospective refusals and materialization fallbacks; request, identity,
revision, output, attribution and execution-ownership tests cover the associated
invariants. They currently often call the coupled Session/CLI boundary and must
also exercise the new application entry point.

## Future-use pressure, without future implementation

The exploratory inputs were [upcoming work](../../notes/upcoming-work.md), the
[journey script](../../notes/initial-journey/cockatiel-investigation-script.md),
[connected accounts](../../notes/initial-journey/cockatiel-account-examples.md), and
[design findings](../../notes/initial-journey/design-findings.md). Their examples
are staged, qualified planning material; they do not demonstrate implemented
architectural subjects, correction discovery or diagram production.

| Future work | What this boundary must make possible | Deliberately deferred |
| --- | --- | --- |
| ACCOUNT | Complete qualified content, exact subjects/relationships already supported, interpretation composition, corrections and captured support survive delivery. No requirement to flatten into rows, snippets or graph edges. | Policy-kind/state/instance-role subjects, new account structure, relationship contracts and content sufficient for structural/state/interaction diagrams. ACCOUNT must establish that semantics; rendering cannot recover it from prose. |
| PRESENT | A caller can distinguish fresh investigation, exact answer retrieval and arrangement. Content carries conditions, evidence, selected revisions and mechanical/composite support. | New account renderers, discoverable subject-specific questions, general View composition/identity and navigation-origin history. |
| MINIGUI | A client can request an existing question for an explicit subject, use returned candidates/references and revisit an exact answer within a Session. | Graphical controls, layout, choosing how relationships become new selectable subjects, Workspace management and human-use evaluation. |
| AGENT | Typed requests and qualified results do not require a human shell or a preceding GUI journey. Exact answers differ from repeatable requests; source support is not silently promoted to human output. | External transport, authentication/authorization for an external service, stable exchange schemas, participant-material intake and durable references. |

For example, the admission → trial → correction episode requires preserving an
earlier answer while later investigation retains a replacement. Existing
Investigram correction fixtures can verify that boundary now. They cannot verify
the future half-open state subject, navigation origin or structured trial account.
The composition example additionally needs qualified ordering and responsibility
claims; coordinating two current answers cannot supply those claims. The API task
is complete without producing any of those diagrams or implementing the journey.

## Governing impact and promotion

The direction extends existing interface-independent analysis and qualified
construction rules to an explicit application service boundary. The agreed
continuation work-status exception is explicit in the plan and decision; other
CLI preservation rules remain in force. No foundation,
core-concept definition, Session lifetime, public compatibility promise or CLI
retirement decision is changed. Existing accepted decisions are supplemented,
not superseded, under the recommended worker arrangement. In particular, preserve
worker-side alias allocation, the explicit investigation arrangement key and
parent-side authoritative usage finalization. Shared publication policy is exposed
through a guard without relaxing those existing checks.

The governing revisions are additions: they remove no existing heading, anchor,
definition or responsibility. Inspection of the current specification, constraints,
concepts and decision successor references identified no historical citation that
needs clarification for these additions. Recheck inbound references if discussion
changes this into replacement or supersession of an existing rule.

Review authority comes from the current successors, especially
`research-question-driven-observation.md`, rather than superseded universal
recording clauses. The current CLI's automatic version-four batches remain
supported behavior. The known captured-basis export and navigation-origin gaps
remain disclosed and outside this plan; no new reliance on them is proposed.

On human approval, promote the plan and decision, merge the two governing
additions, and update their canonical indexes atomically. The plan already carries
the necessary future-use context without depending on these notes. This package
README is a review guide, not a proposed replacement for `docs/README.md`; dispose
of it under human direction after promotion. No canonical document should link to
this draft. Implementation requires separate authorization and its own task record.

Verification of this merge consists of source/document inspection, synthesis
coverage, link and diff checks. Runtime validation is specified in the plan, not claimed as performed.
