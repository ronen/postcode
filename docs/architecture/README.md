# Implemented architecture

The internal Node application opens one configured TypeScript project in a
transient Session, constructs complete qualified mechanical and contribution
content, and retains exact answers with their fixed support. Authentication/help
is the only CLI entry. Direct validation trials own explanation and state-diagram
rendering; there is no current human investigation interface.

The [retirement decision](../decisions/cli-shell-retirement.md) removes the private
shell/worker, mechanical human Views, compact aliases and research sink/feedback
implementation. It preserves analysis, qualification, account services and direct
execution. [Core concepts](../core-concepts.md), [architectural constraints](../architectural-constraints.md)
and accepted decisions govern these boundaries; the [application specification](../app-specification.md)
describes broader intended behavior without claiming its implementation.

## Common contribution mechanism

The [common analysis contribution mechanism](contributions.md) is implemented under
`src/lib/contributions/` and verified with controlled producers. It retains Session
identities, immutable investigrams, exact association declarations, Query-result
designations and recorded producer input, and derives standing and reconsideration
from them. Module/symbol identification, expansions, dependencies and repository organization
now contribute their findings to the Session ledger. Mechanical answers capture their
selected findings with organizing status and exact qualified support. Fresh selections
show later changes while exact retained answers preserve their earlier snapshots.
The application interface also exposes `state-behavior` and `follow-up` Lenses over
this ledger, with contribution evaluation, investigating-agent dialogs and retained
answers. Application hosted configuration select the common dialog
protocol under the existing explicit enablement and credential contracts.
See the [application route](contributions.md#application-route) and
[hosted transport](contributions.md#hosted-transport) for those boundaries.

The `summarize`, `explain`, `decompose` and `examine` operations and their
associated-content callers use this boundary, completing the migration under the
[structured-accounts plan](../plans/structured-architectural-accounts.md). The superseded tree/correction helpers and their storage, presentation and wire contracts are removed; application registration rejects earlier interpretation requirements.

## Implemented subset of the product model

The [architectural-investigation decision](../decisions/specialized-architectural-investigation.md)
permits accounts over captured program states, observations, participant-supplied
material and earlier Projections. The implemented subset is one configured
TypeScript project under an unchanged-input precondition, family-specific
construction, and qualified contributions. Embedded mechanical bases and associated
inspections are specific compositions, not arbitrary multi-Projection coordination.

Accounts retain flat owned items, explicit associations/result designations and
independent producer records. Follow-up can select an exact contribution,
item/component or designation. Delivery captures what the producer actually received.
Answers preserve evidence, qualifications, origins and standing/change snapshots.
Failed attempt diagnostics remain reportable separately from answer meaning.
There is no general participant-material ingestion, multi-state analysis or arbitrary
Projection-input interface.

`present` resolves an exact retained Projection and fixed support. It has no Lens
parameters or Evaluation plan and cannot select replacements or acquire missing
support. Fresh requests can select later interpretation/standing snapshots while
retaining their captured program basis. Precise references are Session-scoped;
no compact bindings, display aliases or reference-lifetime metadata remain.
There is no save/resume or automatic refresh.

Trial arrangement receives supplied qualified content and applies display choices.
Counts/omissions do not independently establish project-wide coverage. No human
View history, research sink or feedback mechanism is retained. Historical output
and its captured-basis attribution limitations remain historical evidence; see the
[research-support gap](../backlog.md#research-observation-and-feedback-after-cli-retirement).

<a id="application-entry"></a>
## Internal application entry

`src/lib/application/index.ts` supplies the in-process application lifecycle and
explicit request/delivery types. `openApplication` captures the project options,
semantic catalog and optional client Presentation declarations. A caller can
execute `{ kind: 'lens', lens: 'modules', designation: { kind: 'configured-project' } }`,
inspect a returned precise module ID with the `reference` designation, and retrieve
an exact answer with `{ kind: 'present', target: answer.id }`. The caller separately
awaits `close()`. This is an internal Node entry, without a package API or browser
runtime. Synchronous compiler work cannot be preempted in the calling thread.

Answer delivery contains complete selected qualified content and fixed support,
including both the composite and mechanical content of associated inspection.
It contains neither a rendered View nor a store handle. Direct requests default
to standard expansions for the resolved content contract, or accept supported
subsets. Exact requests use only retained support. Invocation attachments are
captured separately from semantic request meaning; neither occurrence context
nor Presentation choices enter answer identity. Capabilities expose Lens meaning
and semantic requirements without implementation registrations or output formats.

The small [direct client](../../test/application-client.ts) imports only the
application entry and exported types. Its integration test exercises complete
exports, dependency occurrences, alternative populations and historical answers.
No internal adapter, worker, CLI operation capability or deferred publication
check is needed. All ordinary requests use the same direct validity boundary.

Ordinary application execution checks input validity before and after work.
The client-neutral `guardPublication` can separately check before/after a caller's
output; it does not bypass or defer Session execution checks. Overlapping direct
operations raise `SessionBusy`; invalidation and interruption are terminal. Closing releases retained domain
state while preserving final reports and usage. For an opened direct application
Session, `interrupt()`, lifetime-signal abort and close during unfinished work
establish terminal cancellation. Detected invalidation also immediately starts owned
resource cleanup and uses the same terminal-finalization protections and shutdown
assessment. An invalidated request rejects with `SessionInvalidated` and keeps
`invalidated` work despite later interrupt or close; producing attempts stopped by
invalidation report `invalidated`. If interruption
is established while a changed input is still pending detection, work remains
`interrupted`. Both terminal paths finalize accounting without awaiting Git exit.
Both shutdown methods observe the same
assessment of owned resource cleanup and terminal participant/report failures;
`SessionShutdownError.failures` distinguishes their phases and retains original
causes. Signal-only failures are internally observed and remain available through
later close. Invalidation alone leaves shutdown clean; participant cleanup, attempt/work
reporting and owned-resource failures remain separately observable through both shutdown
methods, without repeating cleanup. See the [terminal invalidation decision](../decisions/terminal-session-invalidation.md).
Completed production retains its actual outcome when final request
validation is interrupted or invalidated. Invalidation established first remains the terminal cause.

Git cleanup reporting remains bounded, with ownership retained until confirmed exit.
Injected `runGit` leaves subprocess ownership with its caller. Session shutdown has
no overall deadline and cannot preempt synchronous compiler work or callbacks.
Notification protection applies only once an interruption or invalidation cause is
established. Ordinary request callback/finalizer failures remain request-local;
this does not provide general callback isolation. Opening retains its earlier
cleanup contract, including the separately recorded opening-error preservation gap. Presentation method versions are
client artifact provenance and are absent from captured application methods.

The same engine serves organization, dependency structure/children/parents,
group and mixed inspection, interpretation follow-ups, resolution and usage.
Dependency organization detail is constructed only when group details are
requested. Direct interpretation journeys use the real evidence, validation and
retention path with a substituted agent communication participant in tests.
Fresh selection can expose later displacements, conflicts, associations and
reconsideration; exact retrieval preserves the earlier answer's full content and
support, including historical failed or unavailable outcomes, without new analysis or inference.
Captured catalogs also support the internal interpretation and exports fixtures
through the same execution and exact-access paths.

Account/provider services are available separately at `application/accounts.ts`.
They assemble existing credential services, return typed configuration reasons,
and expose the explicitly requested, cost-bearing connection check without
opening a project. The authentication host owns process signals and passes cancellation to account
services. Neither preflight nor ordinary authentication starts the connection check.
`authentication/commands.ts` supplies terminal-safe authentication/help independently
of project setup. Direct clients explicitly choose provider configuration and own
their transmission disclosures.

The CLI-only deferred publication path and private operation scope are removed.
The Session's `requestFinalized` marker remains necessary for direct clients: a
work-finish callback may synchronously call `close()` before `finish()` returns.
It preserves completed work in that case, rather than relabelling it as interrupted.
A direct boundary test covers this residual; it is not a retained CLI capability.
Client Presentation method versions remain artifact provenance outside application
method capture.

<a id="request-publication"></a>
## Request publication

Session execution captures and normalizes the requested question, designation,
parameters and consumption choices independently of the answer. Its fixed catalog
supplies Lens applicability, requirements, mechanical implementations and consuming
operations. Missing/incompatible designation modes are refused before Evaluation.
Usage is subjectless and refuses extraneous designation or parameter input.
Unrepresentable input produces rejected context with explicit omissions, without
invoking accessors. Invocation correlation is separate from reusable answer identity.

Qualified resolution consumes module/group populations and Lens cardinality.
Exact references must identify actual same-Session retained records; prefixes alone
do not establish existence. Known unsupported kinds, unknown references, ambiguous
names and incomplete/unavailable lookup remain distinct. Candidates carry precise
IDs, support, criteria and qualifications, with no alias allocation. Names and exact
references supply settled subjects to construction; equivalent subjects, question,
parameters and support share an answer regardless of designation spelling.

Mechanical registrations own prerequisite expansions, result-contract selection
and construction. Catalog capture rejects missing implementations or declarations
that repurpose a registered question. Coordination does not dispatch construction
by Lens name. This is a fixed internal catalog, not dynamic plugin installation.

Family constructors retain complete qualified selections and support. Unsuccessful
resolution creates no requested Projection; established empty populations remain
valid. Unordered collection payloads use evaluation-population order, followed by
outside-population subjects ordered by record ID. Meaningful order/roles are not
redefined. Ordinary inspection rejects empty settled input; group-only inspection
uses the explicit embedded empty module detail constructor.

The exports fixture selects export claims, documentation, support and outcomes
without constructing module inspection. It distinguishes complete empty surfaces
from incomplete, unavailable or unrequested exports, and preserves known subjects
omitted from a supplied population. Dependencies retain direction, endpoint roles
and recognition coverage explicitly. Associated inspection selects its mechanical
basis and contributions before returning a complete composite.

Shared Presentation negotiation remains in `application/consumption.ts`. It lost
its principal CLI client but is coupled to useful standard/subset expansion
selection and exact-support compatibility. Optional internal declarations can
constrain options, require materialization and specify qualified fallbacks.
Compatibility is checked before acquisition and against the actual constructed or
retained contract. A refusal preserves unmet states and retained answer IDs; exact
access never enriches missing support. Negotiation affects consumption, not answer
identity. No production renderer or new client has been added to preserve it.
Separating this residual requires later acquisition/presentation design; there is
no general planner or public Presentation registration API.

<a id="request-work-attribution"></a>
## Request work attribution

Every Session request and direct interpretation entry establishes a frozen parent
context before validation/work: correlation, normalized need, caller role, purpose
and actual inherited investigation guards. Caller identity is not assumed to be
human. There is no numeric whole-request budget. Requested-answer work remains
distinct from PostCode's subject-resolution prerequisites and investigator-triggered
evidence work. Evidence triggers include the query and its attempt-local occurrence.

Provider, evaluator and pure-derivation boundaries report execution where they know
it. TypeScript reports reuse per module/expansion/dependency component and captured
content. The module evaluator separately reports new versus retained qualified
outcomes, including expansion outcomes; pure organization derivations report their
own reuse. Dependency outcome construction still derives and validates each time,
so an equal retained ID is not reported as skipped execution. First-retention
attribution lives alongside supported records in Session-owned metadata. Re-derived
equal records do not overwrite it or invent an origin for previously untracked work.
Unknown origins are explicit. This adds no reusable-work key inputs or retained
answer fields, and neither reuse nor new materialization claims fresh inputs.

Expansion reporting groups equal per-expansion qualifications by requirement within
each provider/evaluator call. Each group keeps its count, exact record identities and
their generating origins; different qualifications and reuse dispositions stay
separate. A report carries its current parent once, plus a table of distinct earlier
parents. Report-local origin references resolve entirely within that report even if
a caller reuses a request correlation ID. Detail still scales
with supported record identities and evidence queries; no detail is silently capped.

Returned execution envelopes carry immutable work reports separately from answer
meaning, resolution and usage. Reporting completeness is explicit and does not
depend on research recording. This follows the
[interface attribution decision](../decisions/research-question-driven-observation.md#compact-attribution).

The Session exposes its latest execution report
for failure handling, not a request-history catalog. Interpretation attempts carry
their parent context; retained operation reuse and exact/associated selection record
current consumption with original attribution. Evidence reporting preserves qualified
outcomes, page limits and support separately from delivery: captured-but-withheld,
acquired-but-not-dispatched and actually dispatched information remain distinguishable.
Pure retrieval/continuation records consumption without claiming new acquisition.
Producer exposure depends on actual dispatch; references and host-side assembly do not create it.

Work is recorded internally before terminal notification. Thrown execution failures
preserve completed boundary facts while disclosing unknown work without outcomes.
Once a terminal cause is established, final notification failure cannot erase
attempt/work/usage accounting. Ordinary callback failure remains request-local.
Application completion and subsequent client publication remain distinct.
Closing releases core state while returned report snapshots remain usable. This is
bounded attribution, not a scheduler, history store or captured-program export.

## Responsibilities and flow

The [common contribution dialog and Session integration](contributions.md) supplies
subject-based evidence queries, bounded dialogues and atomic retention for summary,
explanation, decomposition and examination. Stable references support associated
account inspection and exact historical access. Fresh selection preserves every standing designation as an independent alternative, with explicit displacement, inconsistency and actual-delivery reconsideration causes. Exact answers retain earlier snapshots without automatic reassessment. Usage remains attributable across success,
failure and cancellation.

Hosted work explicitly selects OpenAI API-key billing or Sign in with ChatGPT and
granted plan usage. The calling process owns credentials, coordinated renewal, streaming
transport and usage; credentials stay outside investigation context. Both routes share domain validation and structural
reference translation. Scripted/offline tests exercise production boundaries;
retained live formative evidence and its limitations are described in
[STATUS](../../STATUS.md). See [hosted setup](../hosted-investigation.md) and the
[capability reference](../capability-reference.md#interpretive-investigation).

Operational project opening lives in the TypeScript integration. It follows
TypeScript configuration inheritance, file selection, package and module
resolution, and automatic module detection. It disables emission because this
application reads programs. Configuration errors and unavailable configured root
files return project-open failure before a projection exists. Compiler objects
remain inside that integration; input projects are never executed.

The application selects standard or explicitly requested exports, documentation and composition requirements
before the evaluator requests discovery through a small language-analysis boundary. Discovery writes an atomic batch of session, captured analysis inputs, module entity, module
claim, Claim context, and source-evidence records through `ProgramRecordStore`.
Compiler expansion preparation completes before its supporting input record is captured.
Session identity is allocated once after project opening, independently of that input record.
Expansion materialization adds semantic symbol entities and claims, export
relationship claims, recorded documentation assertions, and qualified association
claims. The evaluator records an immutable discovery attempt and separate expansion
outcomes scoped to each module in one atomic outcome batch, so inspection does not inherit unrelated expansion
failures. Lens
construction reads stored information, selects relevant subjects and context,
and writes an addressable projection. It does not call TypeScript.

For module, organization, dependency and investigation families, core construction
resolves immutable qualified content, including supporting populations and
qualification for derived counts. Associated inspection fixes its mechanical basis
and full associated population. Trial arrangement consumes only supplied content;
core has no dependency on trial rendering. This follows the
[qualified construction decision](../decisions/qualified-projection-construction.md).

The current store adapter uses private in-memory maps. It clones and freezes
records, requires each session record's own ID to equal its session identity,
rejects conflicting replacements and invalid references (including entity
claim discriminators and reciprocal subjects, and documentation-association
subjects matching their module, origin-symbol or export-alias provenance), and
supports session namespaces and immutable evaluation attempts. Evaluators return immutable store-owned outcomes; provider discovery results are also frozen before crossing the provider boundary. A session evaluation index is published only after batch validation, while selected projections still determine their own populations. The request executor
owns an opened provider and ephemeral store and releases them on close. Completed
evaluations are reused by declared requirements, while newly requested work adds
records. Each projection uses its own evaluation basis, never the entire store
population. This establishes neither persistence nor a general scheduler.

Processing indexes are prepared from the immutable records selected by a view or
evaluation. Merged buckets retain evidence order; weak capture/layout indexes have
the same lifetime as their inputs and do not cache new filesystem observations.
Generic SCC, incremental cycle checks, ancestry and upward closure delegate to a
private Stately topology adapter under the [graph decision](../decisions/graph-kernel-delegation.md).
PostCode retains population selection, every parallel supporting claim, deterministic
link acceptance and presentation traversal. Library identifiers and mutable graph
objects never become stored domain evidence.

Module claims carry the information asserted. Claim context separately identifies
evidence, method, scope, guarantee, limitations, and encountered diagnostic codes.
Source evidence carries compiler names, file paths, contributing declaration
ranges, content digests, configured-root provenance, and written module-specifier
occurrences with established resolution targets or explicit non-establishment. It is not a conceptual
module label. SourceFile modules without an independently established module name
are anonymous; their generated handles are navigation aids.

Within each opened provider, the TypeScript integration computes a captured
`SourceFile` object's content digest once and reuses it for captured input source entries
and source-evidence records. This avoids repeatedly serializing and hashing large
declaration files during expansion materialization. The map is local to that provider;
new project openings still capture and analyze inputs afresh. Evidence identity,
spans, excerpts, qualification and store validation are unchanged. The
[latency investigation](../../records/validation/2026-09-21-analysis-latency.md)
records the measurements and equivalence checks supporting this bounded reuse.

Evaluation state separately records applicability, availability, execution,
materialization, reason, and a deterministic module-count cost. An established
empty population has a completed, fully materialized evaluation and a stored
projection. Unavailable or unmaterialized work cannot establish emptiness. The
current TypeScript provider discovers eagerly; other state combinations are
verified at the evaluation boundary, not exposed as a new scheduling product.
Unexpected defects propagate rather than becoming ordinary analysis failures.

## Dependency provider checkpoint

An explicit dependency evaluation can now request a bounded source-request pass
through the same TypeScript integration. Compiler and file-resolution work
finishes before its supporting inputs are recorded. The pass materializes qualified
occurrences, separate recognition/ownership coverage results, and directed
module-pair relationship claims retaining every resolved supporting occurrence.
The evaluator records dependency work separately from its module-discovery basis;
a provider that cannot supply it yields unavailable work, not an empty graph.
Ordinary discovery does not implicitly request dependency analysis.

The [dependency structure decisions](../decisions/module-dependency-structure-decisions.md)
and [bounded CommonJS decision](../decisions/bounded-commonjs-source-evidence-decision.md)
govern this boundary. Only project-owned requests contribute relationships;
external interiors remain opaque. Resolution outside the existing module
population never adds an entity. Source evidence keeps the configured file
resolver's result distinct from the evidence identifying a target module, and
retains actual target declarations for later placement analysis. Aggregation
preserves direct re-export intermediates and all occurrences, and marks a
relationship type-only only when every occurrence establishes that qualification.

This provider boundary supplies the evidence for the integrated dependency graph
projections and composition/organization expansions described below, without moving
compiler analysis into projections or trial rendering.

## Identity and evidence

Session identity is a random UUID namespace, not a digest of program inputs.
The analysis-input record retains compiler/PostCode method versions, Node and
platform context, selected configuration and options, source population/content
digests, observed configuration/resolution inputs, and repository evidence.
Claim contexts produced by the provider reference that record; claims retain
source and responsible method context. Repository-derived contexts retain their
captured repository evidence. Neither session identity nor reporting metadata
establishes the evidential basis of a claim.

Positive and negative reads/existence checks, directory queries and realpath
results are memoized within the opened project. Capture is first-observed and
non-atomic. Inputs are assumed unchanged. Validation replays captured probes and
compares repository capture and process environment at request boundaries; it
never updates the supporting evidence or refreshes the session. The session record retains concise
coverage, consistency and enforced output-location counts for presentation.
Counts identify filter boundaries, not generated files found or read.

The method registry is versioned with changes to the corresponding semantics.
Entity identity follows compiler source identities and ambient symbols, without
cross-session or relocation continuity. Internal keys belong to a session;
reference spelling is excluded from the local key digest so random session IDs
do not randomize semantic record ordering. Handles use language names, basenames
or declared exports with honest anonymity, retaining generated provenance.
Exact names/generated handles remain lookup aids; precise record IDs resolve only
within their retained Session. Compact module/group/investigram/answer aliases,
allocation and `@` input syntax have retired. The generated-module-handle method
still reserves its existing spellings (including former compact-ID patterns) to
preserve naming semantics and method identity; reserved spelling is not alias lookup.
Investigator wire handles are a separate dialog transport and are unchanged.

Actual generated-output directories supplied by the caller are excluded before
configuration discovery and compiler reads. A target directory named `_observations`
or `_build` remains an ordinary configured input unless it is an explicitly
supplied output destination. Exclusion applies to roots, imported files, directory
listings, and symlink targets, including dangling targets and missing descendants.
One shared live policy supplies compiler and repository exclusion and retains
lexical and resolved locations. Equivalent aliases count once; sorted, deduplicated
entries make caller ordering and repetition immaterial. Unverifiable explicit
boundaries refuse opening with an operational failure, separately from compiler
diagnostics. Revalidation detects retargeting or resolution failure and invalidates
the session. Captured repository source links retain their separate historical
resolver. The current captured-input method is `postcode/observed-inputs@7`. Ordinary candidate paths that fail operational resolution remain absent
to the compiler, with a retained recovery probe; they do not turn a resolved output
boundary into an opening refusal. Missing output suffixes use filesystem case
handling observed by a read-only spelling probe of an existing directory on the
same device, shared within each boundary-resolution pass. This avoids requiring
directory-listing permission for the ordinary probe. Unknown case handling refuses
with an explicit case-detection reason. The current per-device case assumption
does not reliably handle per-directory case rules or lexical paths crossing
filesystems with different case rules. Validation compares captured compiler
observations without extending their identity or acquisition revision. Case-equivalent materialization does not itself
retarget the boundary. This implements the [output-boundary decision](../decisions/generated-output-boundaries.md). Discovery contexts assert this exclusion only when at least one
output location was supplied; direct library runs may enforce none. Direct clients and trial runners supply their actual output destinations before
opening a project. The authentication CLI opens no project. Git-ignore rules
alone are not this evidence boundary.

Configuration opening retains explicit syntax validation because TypeScript 6.0
omits root syntax errors from its parsed configuration error list. Repeated error
reports are deduplicated by file, position, length, category, code and message;
identical text at different source occurrences remains visible. Failure messages
retain the diagnostic file and one-based line/column when available, so those
occurrences can be located; absent locations are not inferred.

Discovery collects syntax diagnostics encountered while examining the configured
Program, conservatively qualifying the whole population and affected modules.
It does not invoke unrelated semantic checking. There is no claim that an absence
of discovery diagnostics establishes a type-correct project.

## Expansions and presentations

The compiler's effective exports preserve exported names, originating semantic
symbol identity, independent type/value roles, and direct/aliased/forwarded routes.
Overloads and merged declarations remain one semantic symbol with separate source
evidence. Type-only restrictions on routes and alias chains suppress runtime value
exposure without rewriting the underlying symbol's roles. Unresolved targets,
conflicting wildcard origins, and unestablished forwarding routes qualify expansion
outcomes and claims. The integration uses the public compiler API and does not
perform a whole-project semantic check merely to collect diagnostics.

Compiler-associated JSDoc blocks are retained individually, including structured
tags. Module documentation, originating-symbol documentation and export-alias
documentation retain distinct association claims. Documentation is a recorded
assertion: mechanically establishing its association does not establish that the
text is true, current or complete. Unattached comments are not assigned a subject.

Projection construction selects expansion claims and outcomes relevant to selected
modules, with immutable contexts, input records, evidence and complete populations.
It takes no format/display limit and cannot refresh captured support. Human mechanical
Views, source-detail classification, terminal bounds and JSON View schemas have
retired; qualified domain content remains available to direct clients.

Trial explanation arrangement and state-diagram rendering live in
`scripts/structured-accounts/support/`. They depend on supplied selected content,
never a store/history callback. Alternatives remain separate, including incompatible
models and unrendered notices. Each standalone SVG/text diagram carries its own
alternative's supplied interpretation status and applicable owner limitations.
The rendering-only disclosure correction advances the diagram method to version 8;
core state semantics and answer identity are unchanged.

## Observations and runtime boundaries

The research policy still permits question-specific capture and ordinary use without
records. CLI observation envelopes, local sink/delivery, human disclosure classification
and feedback builders are removed. There is no replacement research framework,
feedback context mechanism or automatic recording in trials. Operational attribution,
qualified bases and actual producer exposure remain independent of research delivery.
Historical records remain evidence under their original limitations.
[Research reconciliation](../backlog.md#research-observation-and-feedback-after-cli-retirement)
tracks these lost facilities, captured-basis attribution and later contextual feedback;
retirement does not withdraw the foundation's requirements.

Authentication escapes inline controls and reports credential-safe errors. Trial
artifacts may contain source-derived content; their capture is not authorization
for external evidence export. Core content and JSON preserve literal evidence.

## Repository organization

The completed [repository organization task](../../records/tasks/2026-09-15-module-organization.md)
added an internal repository-layout evidence boundary under `src/lib/repository/`,
governed by the [organization decisions](../decisions/repository-organization-decisions.md).
Repository evidence is captured after successful project opening and before
requested discovery. The session references a stored capture result,
including explicit unavailability outside a worktree. Organization evaluation
reads that result and a stored module evaluation; it performs no filesystem or
compiler work. Pure organization and relationship-organization derivations reuse deterministic stored outcomes over their immutable bases, including unavailable and partial results. Provider acquisition and retry remain a separate responsibility. Pure layout is prepared with capture and retained alongside it,
so view construction never repeats layout analysis. Repository inputs contribute
to claim support across module and organization content.

Capture uses the enclosing Git worktree of a configuration path. Git supplies
tracked membership, effective ignore decisions, and repository metadata; native
filesystem reads capture present artifact kinds, directory entries, link targets,
and applicable exclusion-policy digests. Tracked artifacts override ignore
matches, while deleted artifacts are absent. Explicit output destinations are
normalized and excluded independently of Git ignores. Nested repository markers
and Gitlinks identify opaque boundaries without importing their contents.
Opaque boundaries named README or README.* do not establish documentation
availability. Ordinary artifact and README contents are not read. Repository, local, and global
exclusion inputs remain distinguishable. Known environmental or filesystem
failures produce explicit capture unavailability; unexpected defects propagate.

Link resolution uses the captured visible paths and link targets. A metadata-only
probe in an already visible containing directory distinguishes an absent target
from an existing target whose exact path spelling was not captured. The latter
remains unestablished. Resolution does not traverse opaque repositories, ignored
contents, or generated output, and distinguishes proven cycles from the bounded
redirect limit. External path traversal is refused, even where a path could later
re-enter the worktree through an uncaptured alias.

Pure layout derivation prepares region names, direct containment and artifact
placements, direct README associations, and qualified link outcomes. Directory
links can add a parent to an existing region; deterministic cycle refusal leaves
a directed acyclic containment graph. Captured canonical and invoked repository
roots (verified by resolving lexical ancestors, rather than inferred from path
depth) let placement interpret apparent source paths without using realpath as
module identity. Bounded traversal through accepted directory-link regions maps
aliased source paths to existing groups; ordinary file-link modules retain their
apparent artifact's placement.

Organization evaluation materializes group entities, region and artifact evidence,
qualified direct containment, artifact and module placement, and direct README
associations through `ProgramRecordStore`. Group entities and direct layout
relationships remain fixed within a session. Root groups have no intrinsic name;
other names are single captured segments. Module placement retains established,
multiple, unplaced, external, and unavailable outcomes with reasons. Candidate
ambiguity is represented separately; this provider does not invent candidates.

Each organization evaluation references its module-evaluation basis and retains
repository coverage separately from placement coverage. Group-property claims
reference that evaluation. Known direct placements survive incomplete evaluation;
descendant-only and none are asserted only when placement evaluation completed
fully. Unknown presence is represented separately from those values. The store
validates group claim identity, reference kinds, placement outcome shape, and the
evaluation prerequisite for negative presence.

Repository projections select the complete group population. Project projections
select established project-module placement groups and their ancestor closure.
Neither changes the direct relationships of a retained group. Declared
`group-details` expansions retain direct parents, subgroups, modules, artifact
placements, and documentation relationships; adjacent entities are expansion
data rather than extra selected subjects. Generic organization inspection matches
exact group and module names together, including repeated group names, or selects
precisely by currently scoped Entity ID. Group references use exact retained IDs in the owning Session. Group paths and root
display labels are not selectors. Existing module inspection expansion records
remain available through a referenced module projection.

Application defaults select group details and module-standard expansions; callers
can request supported subsets. Core content includes full selected relationships,
captured paths and summaries tied to the evaluation basis. Artifact classification
distinguishes complete, incomplete and unrequested states. Incomplete classification
never establishes absence of module/documentation associations. Module-only and
mixed inspection preserve qualified module detail without a mechanical human View.
Paths and README/artifact/link metadata are captured evidence, without artifact
contents. The analysis repository root comes from stored capture, not a second lookup.

Ephemeral Git fixtures and synthetic partial/unavailable providers verify these
semantics independently of the retired tree rendering, disclosure and observations.

Inputs remain first-observed and non-atomic. Git may reread live exclusion policy;
a final policy check refuses detected lasting changes but cannot detect every
transient concurrent edit. Sparse-checkout completeness remains unresolved.
Capture refuses non-UTF-8 names or Git evidence and Git output exceeding its
bounded subprocess buffer instead of silently dropping or corrupting artifacts.


## Dependency graph and qualified expansions

The dependency library now constructs project structure and focused child/parent
projections from stored provider results. It keeps the discovered project population,
including isolated modules, separate from dependency evaluation coverage. Structure
uses strongly connected components of project-to-project edges; generated component
indices are grouping data, never entity identities. Every internal relationship and
cycle member remains available. Source components are established roots only with
complete module and dependency evaluations. External endpoints remain opaque.
Focused projections reuse exact module selection within a session and retain direct
relationships; non-edge requests remain attached to their source owners.

Composition is a separately requested module expansion. The TypeScript integration
checks all captured module declarations for the positive `re-exports-only` property
and records its own outcome. No inverse property is produced. Discovery classifications
use `discoveryFacets`, keeping discovery evidence distinct from qualified composition.

The optional dependency-organization expansion consumes a matching stored organization
evaluation. Captured request and target declaration evidence narrow endpoint placement
before broader module-placement fallback. All applicable endpoint combinations remain
explicit, including placement and occurrence variation, incomplete information, and
candidate ambiguity. Common ancestors retain containment evidence across multiple
parents. This expansion performs no filesystem or compiler work and cannot weaken the
underlying dependency result when repository organization is unavailable.

These library layers follow the accepted [dependency structure](../decisions/module-dependency-structure-decisions.md),
[composition](../decisions/module-composition-property-decision.md), and
[organization integration](../decisions/dependency-organization-integration-decisions.md)
decisions. Standard direct requirements include composition and repository-layout
support. Project SCCs remain separate from opaque endpoints. Parent coverage does
not invent source-owned evidence. Full captured requests, qualification and
organization metadata remain in the selected core content.

Ordinary organization analysis remains independent of dependency evaluation.
Dependency resolution can acquire additional inputs. Ordinary inspection uses exact name/handle lookup or precise retained IDs. Accumulation reuses applicable
completed work while preserving earlier captured input support. Discovery is
retained per store; expansions and dependency analysis are acquired when requested.
Completed results remain reusable across input acquisition. The TypeScript
provider additionally retains partial work against the captured-input revision on
which it was prepared. New acquisition makes that partial work eligible to retry;
ordinary repetition on the same basis reuses its qualified outcome. Evaluation
accepts that reuse only with an explicit provider assurance referencing captured
analysis inputs. Providers without the assurance retain ordinary retry behavior.
Session requests go through the provider/evaluation boundary so an outer cache
cannot hide acquisition. Earlier outcomes remain unchanged.
The compiler Program fixes this provider’s module population at opening, so
additional dependency inputs do not add modules. Repeated contexts read their
first supporting input record from the stored Claim context; new contexts can reference a later input basis.
Any conflicting record content still fails the store’s immutability check.

The direct Session owns compiler execution and asynchronous Git in the calling
process. Cancellation settles cooperative waits and rejects late participant content;
it cannot preempt synchronous compiler work or callbacks. Worker termination,
transport races, parent observation delivery and prompt/EOF policy have retired.

Each Git invocation has a 30-second deadline and a combined 64 MiB output bound.
On cancellation, POSIX children receive SIGTERM, then SIGKILL after 250 ms if
still running. Cleanup reporting waits at most 2 seconds; an unconfirmed child is reported separately while exit monitoring remains owned. These bounds
do not establish a whole-analysis deadline, descendant-tree termination, or
universal native-work exit. After confirmed cleanup an opening Git timeout yields
qualified unavailable repository evidence under `postcode/repository-inputs@5`.
Recovery to available evidence, or loss of a previously available basis, invalidates
the session. Consistently unavailable evidence stays qualified as unavailable.
Unconfirmed opening cleanup is a resource failure, never a usable degraded session.
There is no terminal prompt or worker-state recovery contract.

Direct execution checks inputs before and after work. The private CLI-only
publication deferral is removed. `guardPublication` retains the neutral distinction
between withholding output after a failed precheck, output failure, and a failed
post-output check. It does not make output atomic. Validation replays positive and
negative compiler reads/existence checks, directory queries, realpaths, repository
capture and relevant process environment. It does not continually watch files or
observe unacquired inputs. Transient changes can escape sequential checks, and
validation cannot turn first-observed acquisition into an atomic snapshot.
