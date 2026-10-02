# Investigation execution

This describes the implemented portion of [module investigation](../plans/module-investigation.md),
including the hosted adapter, progressive shell lenses, correction-aware selection
and citation-based reconsideration. The domain boundary, session retention and
summary/follow-up/inspection paths are exercised through a deterministic agent
double and the real SDK with offline provider responses. The
[integrated assessment](../../records/validation/module-investigation/pass-05/report.md)
retains live evidence and its limitations. The governing contracts are
[investigator execution](../decisions/investigator-execution-and-evidence-access.md),
[investigrams](../decisions/investigrams-and-progressive-investigation.md), and
[operations and lenses](../decisions/investigation-operations-and-lenses.md).

## Evaluation and evidence

Existing module, dependency and organization evaluators continue to own mechanical
evaluation and its reuse. A shared evidence-access boundary dispatches declared
subject queries to those evaluators, returning selected stored records with their
own contexts, methods, evidence and limitations. It constructs neither projections
nor human-command observations. It can materialize missing exports, documentation,
dependencies, dependents and organization information.

Evaluation-wide results are delivered as explicitly separate summaries: identity,
method, applicability, availability, execution, materialization, reason and the
relevant basis reference. Organization summaries retain separate placement state.
Evaluation-wide contexts retain scope, guarantees, limitations, input references
and diagnostic code/category counts; their evidence populations are represented
by counts, not recursively embedded. A selected claim's own context and evidence
remain unchanged. Repository evidence reached through a context is separately
summarized by identity, method, availability and limitations, rather than embedding
its entire artifact census. Summaries are delivery metadata, not modified stored
records. Attempt reports and accepted provenance distinguish `suppliedEvidence`
(full records delivered) from `summarizedEvidence` (summaries delivered, including
evaluation-wide qualification contexts). Both are accumulated only when dispatched
to the investigator. A citation to a summary-only identity supports only the
summary content, not omitted diagnostics, evidence populations or artifact census.
An identity can appear in both sets if both forms were delivered, preserving the
summary exposure without denying subsequent or earlier full delivery. Neither set
claims comprehension. References alone enter neither set and cannot be cited as
evidence until substantive content is delivered. Internal raw session/input
snapshots remain outside the inspection tool.

Module listings embed each module, its naming claim and unchanged own context;
source support is supplied by explicit inspectable references from the first page.
This keeps inventory navigation lighter without treating uninspected source as
supplied evidence or dropping naming qualification. The listing remains partial
while support bodies are referenced, including on its final page. Complete
inventory traversal is not a prerequisite for investigation, and a bounded page
does not guarantee arbitrary inventories fit one dialogue's cumulative guards.

Module and organization listings, exports, dependencies, dependents, membership
and group navigation use stable pages over retained selections. Each page covers
at most 24 selected entries and targets 55,000 serialized UTF-16 code units,
including their support and qualification. Continuations are opaque, scoped to
the evidence boundary and exact query, and refer to the original selection even
if later acquisition enables another evaluation. They neither refresh nor merge
that selection. Responses identify the covered interval, total selected population,
next continuation and oversized omitted entries. Continuations live in memory in
one evidence-access instance. Session integration must retain that instance for
at least the entire evaluation; recreating it between tool requests loses the
continuations and returns explicit unknown-continuation responses.
Total selection size does not assert that the underlying analysis is complete.
Full qualification that itself exceeds delivery bounds remains explicitly unavailable rather than silently
truncated. If an individual entry has extensive source support, its claim and own
context remain embedded while explicit source-support references replace the support
bodies. Those references can be inspected individually; the page is partial and
the references alone do not count as supplied evidence. If even that qualified
entry cannot fit (for example, an enormous documentation assertion), it is
explicitly omitted; continuation can still reach later entries. Per-page partial
status and omissions must be considered across the whole traversal, not replaced by the last page's
status.

Organization lists groups. Group navigation supplies direct containment,
module-placement claims, artifacts and documentation references; content is then
requested by artifact reference. Membership exposes a module's qualified groups
without pulling in unrelated placements. Outgoing dependency queries include
recognized requests without established edges and owner-specific coverage records.
Incoming queries report established incoming edges and explicitly qualify that
unresolved requests or unattributed coverage cannot establish absence of dependents.
External interiors remain opaque. Each relationship's own evidence accompanies it;
evaluation-wide qualification does not turn bounded recognition into a claim of
runtime completeness. Missing provider expansions remain explicitly unavailable
or partial, not empty complete exports.

Content acquisition is a provider capability behind that same boundary. Module
references resolve through their retained source mappings; organization artifacts
resolve through captured repository evidence. Multiple module file mappings are
preserved. The TypeScript provider reads through the existing first-observed input
host, using the shared generated-output policy and registering new content with
the existing validity probes. There is no investigator filesystem or path-reading
interface.

The captured input basis is a conservative shared acquisition basis, not an exact
list of inputs used by the compiler or to derive an individual mechanical claim.
Reading an artifact such as README registers its content for session validity
and advances the shared acquisition revision. Membership in a later input-basis
record means “captured in the shared basis”; it does not assert that the compiler
used that content or that it contributed to the claim's derivation.

Advancing that revision makes incomplete mechanical work eligible for another
attempt. This conservative retry can do unnecessary work without changing the
qualification of its outcome. Work that remains partial is reused on the same
stable basis; completed work remains reusable across acquisition revisions.
Earlier evaluations, claim-context attribution and input snapshots remain
unchanged. The README regression covers these interactions, and F7 is accepted
as current behavior for this slice. Separating acquisition revisions by relevance
could be a later optimization if unnecessary re-evaluation becomes significant;
no such separation is part of this milestone.

Opaque artifacts, unresolved links, excluded targets, unavailable text
and providers without acquisition support return qualified unavailability.

Immutable content records retain full mapped files, their input basis, digest and
source mapping. They do not apply human excerpt limits. A mapped file may include
code outside the selected subject; artifact placement alone does not establish
documentation applicability or truth. Module content must match its established
source digest, and the store validates mappings before atomic publication.
Retained contents supply subsequent evidence; input changes invalidate through the
caller's shared validity check rather than refresh the account. Capture remains
non-atomic. Full-file acquisition has no streaming or range selector at this
checkpoint, and the existing synchronous compiler/filesystem operations cannot
be preempted mid-operation.

Before delivery, each mechanical/source tool response is limited to 60,000
serialized UTF-16 code units. An oversized response becomes an explicit
unavailable response identifying the omitted size and record/reference counts;
it does not claim an empty result, create supplied-evidence references or terminate
the dialogue. Evidence already acquired remains retained. Collection continuations
and group navigation support narrower access; an individually oversized source or
qualified item can still require finishing with an explicit coverage limitation. This
delivery bound does not bound acquisition memory or introduce range retrieval.
Inspection is also unpaged: a broad claim or global context can exceed the bound
when its evidence is traversed. Individually addressable source-support references
can still be inspected separately; their existence does not guarantee that a
broader inspection response will fit.
The separate cumulative dialogue guard can still stop an operation after
multiple bounded responses.

## Dialogue, acceptance and ownership

An investigation request names an operation, exact subject and semantic parameters,
independently of its future consuming lens. The four operation objectives are
functionality, clarification, decomposition and examination; this slice accepts
no semantic parameters. A functionality request starts with a module reference;
the other operations start with the exact earlier investigram and correction-aware
context. Every new operation execution opens a fresh agent dialogue; retained outcomes do not open one. The communication contract
contains provider identity/configuration, context exchanges, explicit submission,
failure signals, cancellation and usage reporting. No provider SDK types cross it.

The coordinator supplies instructions treating source and earlier interpretation
as evidence rather than authority. It dispatches only the declared evidence/context
tools, supplies remaining limits, validates the submitted unit and returns one
outcome. Unexpected defects propagate. Provider adapters are responsible for
translating transport/authentication errors and credential-safe diagnostics at the
communication boundary; a scripted adapter exercises the same contract in tests.
The hosted adapter uses the official OpenAI SDK behind that communication boundary.

The execution guard currently permits 180 seconds, 32 agent exchanges, 96 tool
requests and 2,000,000 serialized UTF-16 code units across sent/received exchanges.
It covers initial validity checks, dialogue and tool-triggered work. These are
runaway-containment limits, not spending allowances or coverage definitions.
Each exchange receives the remaining time and call counts to permit completion
within the guard. Synchronous work may delay deadline detection; its returned
content is checked before delivery. Abort signals reach asynchronous work, but
ignored cancellation cannot forcibly terminate it. No late submission is accepted.
Hosted cancellation cannot promise that remote work or billing has stopped.

Submission is a single explicit `submit` exchange containing the assembled forest.
Submission before the guard stops execution enters synchronous whole-result
validation, followed by a shared input-validity check before returning acceptance.
That validation/publication check does not start another model turn or spend more
generation time. There is no repair loop or truncation recovery at this checkpoint.
Malformed submissions, missing submission, refusal and unrecovered truncation
return investigation failure; guard stops remain separate. Communication/service
failure and configuration unavailability remain distinct returned outcomes. The
evaluation/session integration owns the prescribed retention policy.
Interruption and invalidation propagate their existing termination errors.

Acceptance validates required prose, referents, attributable qualifications,
supplied evidence references, supported subject references, unique local IDs,
composition ownership, and earlier correction targets. The structural backstop is
256 investigrams and 32 nesting edges, including replacement trees. Every new
investigram is marked interpretation by PostCode, regardless of prose confidence
or mechanical citations. Each correction constructs a disjoint replacement tree;
recursive corrections and conflicting alternatives are valid. Unresolved
inconsistencies target earlier investigrams in the same session and retain their
qualifications. Operation instructions and the provider tool schema make that
restriction explicit: documentation-versus-implementation discrepancies belong in
attributed prose and qualification with supplied support, not in structured
inconsistencies targeting program subjects or source records. Reference copying
remains exact; unknown or mistyped identities reject the unit without repair or
inference retry. Associations
distinguish explicit description, the investigation subject and corrected subjects.
Each correction explicitly names distinct modules, symbols, groups or repository
artifacts whose accounts it corrects. Claims, source evidence and content captures
are evidence rather than eligible corrected subjects;
its target separately identifies the corrected investigram. Replacement roots
receive those qualified corrected-subject associations. They are never inferred
from the original request or copied from all earlier associations.

PostCode assigns identities and freezes the complete accepted unit, including
operation provenance and every replacement. Acceptance does not insert
investigrams or corrections into the program store. Evaluation retains the
unit atomically alongside its outcome before view construction. Mechanical evidence already acquired is
independent of whether interpretation is accepted. Rendering and projection code
do not participate in investigation execution.

## Context exposure and usage

Earlier accounts are supplied through a read-only history boundary over retained
program records; domain tests also use fixtures produced through ordinary acceptance. Context retrieval preserves
the exact original, explicit revision notices, replacement accounts, reasons and
qualifications, including chains, alternatives and accompanying corrections.
It does not recursively embed earlier delivery payloads or automatically expand
composition children. Bounded responses disclose omitted references and allow
separate retrieval: at most 24 accounts and 60,000 code units of substantive
content/reasons per request, with the overall dialogue-volume guard also covering
metadata. Prose, referent and qualifications can be requested separately; excerpts
do not establish complete prose delivery.

Only dispatched substantive context enters the conservative citation index.
Identifiers alone and empty or whitespace-only prose excerpts do not. Delivered
correction reasons and qualifications cite their reporting investigram as
substantive accompanying content, without making its own account fields complete.
Complete target eligibility accumulates across exchanges; complete correction
context requires the target and replacement's own prose,
referent and qualifications plus the correction's reasons and qualifications.
Completeness is recorded per correction identity. It does not imply comprehension
or require subordinate trees. Every accepted investigram shares this execution's
exposure provenance. The derived revision snapshot supplies reconsideration and replacement selection without changing those exposure records.

Usage is held by an independently owned attempt/call ledger. Calls are registered
before dispatch; absent reports remain explicitly unknown. Identical repeated
reports do not double count, and category subset relationships remain explicit.
Every distinct report is preserved with accounting anomalies. Missing parents,
cycles, duplicate categories, impossible amounts and differing updates do not
fail the investigation. Calls with unresolved accounting have no trusted report;
consumers must not silently sum or select their uncertain values.
Synthetic test usage is distinguished from provider usage. A final report callback
runs on success, failure, interruption, invalidation or defect and retains received
usage, instructions, termination classification and supplied-context identities.
Late callbacks after termination are ignored; remote billed usage may therefore
remain unknown. Session aggregation and presentation preserve these distinctions.

## Retention, selection and presentation

The investigation evaluator owns one evidence-access instance per session, so
continuations survive successive tool requests. It selects work by operation,
exact subject and semantic parameters before execution. A successful accepted
forest, its provenance, accompanying corrections and evaluation outcome enter the
shared program record store in one atomic batch. Investigation failures and limit
stops retain an outcome with no result. Configuration and communication failures
retain diagnostics/usage but no reusable outcome. Presentation changes, additional
evidence and later interpretations do not regenerate retained requests.

Module summary selection resolves exactly one module name, handle or bound
reference before starting work. Missing and ambiguous selections expose their
status and candidates without generation. Summary and exact investigram inspection
construct views from retained records. Inspection never invokes investigation.
Known investigram references supplied to `children`, `parents` or `summarize`
produce an explicit unsupported subject/lens selection and expected failure
status, without coercion or generation. Missing references remain distinct.
Investigram bindings use the existing append-only session allocator with a distinct
`investigram-` prefix. Originals, composition children and replacements remain
addressable. Redisplay selects explicit replacements; exact inspection retains originals. Public follow-up lenses and associated discovery use the same evaluation
and correction-aware investigator context over earlier retained results.

The experimental investigation view includes selected operation/outcome and reuse,
immutable accounts, corrections, generating provenance, evidence exposure, stable
references and attempt/session usage.
Human correction displays identify each correction's corrected subjects and own
evidence references alongside its reporter, target, replacement, reason and
qualifications; the shared support list does not replace that attribution.
Standard support details distinguish full,
summary and earlier-interpretation exposure per generating provenance, including
the provenance of incoming corrections. Explicit source detail reveals captured
support locations and excerpts, with a source-disclosure observation only when
source detail is actually presented. Empty support containers for missing,
unsupported selections or accounts with no disclosed source support produce no source-escape event;
the request still records the explicit option. Events distinguish locations from
nonempty excerpts through the shared format-aware observation classification. Investigator
source acquisition by itself emits no human source-disclosure event. One-shot views
disclose that their references expire when the command ends. Summary/configuration
and selection failures produce an explicit view and expected failure exit status;
the shell can continue. No automatic mechanical substitute is presented as a summary.

## Worker communication and reporting lifetime

CLI execution retains the existing compiler worker and one-command-at-a-time
ownership. The worker owns analysis, evidence acquisition, investigation
coordination, validation and retention. The parent owns the injected investigator's
communication participant, cancellation and independently recorded usage. A private,
operation-tagged bridge carries agent exchanges, immediate usage reports and attempt
exposure snapshots. Worker usage callbacks remain registered for the whole dialogue,
including after the corresponding reply resolves, and are removed on dialogue
close; pending reply ownership ends earlier. The bridge does not provide an additional program-access interface.
The same in-process CLI environment injection reaches this bridge for both shell
and one-shot tests. Ordinary CLI use can deliberately enable the hosted adapter
through the setup boundary described below; disabled summary requests report
configuration unavailability without a provider call.

Every new investigation opens a fresh parent dialogue; closing or interrupting it
aborts its signal, closes local communication state and ignores late replies and
usage. At the parent closure boundary, before abort or local close can invoke any
callbacks, the parent seals an immutable snapshot of that attempt's call reports.
That snapshot is authoritative for CLI usage. It includes reports received after
the worker finalized its own snapshot but before the parent processed dialogue
closure. Reports after parent closure remain ignored, including first reports for
otherwise unknown calls. Duplicate reports still count once.

The worker's close message precedes its result message. On receiving a completed
investigation view, the parent finalizes its usage and rendering from the sealed
snapshots. Subsequent usage views and command observations read those same snapshots;
worker report updates supply termination/exposure metadata without replacing the
sealed call reports. View identity includes the finalized usage snapshot separately
from the interpretation projection identity, and finalization leaves retained
accounts and earlier views unchanged. Direct in-process sessions continue to use
their own domain ledger and termination boundary.

The parent retains received usage and the last dispatched-context snapshot
when worker termination prevents a final worker report. Active interruption still
ends the session and disposes the compiler worker. Remote work/billing cannot be
guaranteed to stop. Shared validity checks run through evidence work, after
submission, before output and after output; invalidated results are not published.

Reports group usage by full provider/model/configuration identity and distinguish
provider reports from synthetic test data. Returned provider model and service-tier
metadata are retained separately from requested configuration and also partition
totals; missing metadata is not invented. Categories retain units and subset
relationships; there is no sum that double-counts subsets as additional usage.
Unknown and anomalous calls remain separate from trusted totals. Numeric aggregate
overflow is explicitly unknown without losing raw reports or failing interpretation.
Non-finite raw category values carry indexed textual annotations so JSON serialization
does not make distinct anomalies indistinguishable. Usage inspection opens no dialogue. Repeated result display attributes the original
attempt without adding calls. Attempt/session reports survive direct session close
and parent worker disposal. Command observations include usage independently of view
production; interrupted or invalidated commands emit final usage reporting even
when their result view was suppressed. Human final reporting lists every attempt
and its termination as well as session totals, even when all reports are unknown.
These records describe received reports,
not complete billed usage.


## Hosted transport and credential boundary

Explicit `POSTCODE_INVESTIGATOR=openai` or `chatgpt` selects API-key billing or
Sign in with ChatGPT plan use, respectively. The fixed ChatGPT assessment
configuration is `gpt-5.6-sol` with medium reasoning, selected by the human after
the account catalog did not list `gpt-6-sol`; API-key configuration remains separate.
Both announce repository transmission
and preflight before either project-opening path. Disabled use performs no
credential lookup. Authentication commands do not open a project. Local preflight
is not evidence of remote eligibility or model access. The [accepted route decision](../decisions/hosted-authentication-and-billing.md)
requires explicit selection and forbids billing/account/model fallback.

The parent owns the SDK transport and credentials; workers and investigator
context receive only safe configuration, replies and usage. API keys are read
privately once per invocation. ChatGPT's stable host, issued client, verified
subject and token sets persist in PostCode's own Keychain item. The native boundary
normalizes null/undefined absence before decoding; empty, malformed or inaccessible
stored data still fails without replacing it. Labels separate
registrations even when emails match. The native browser handoff receives the authorization URL through stdin, keeping
returning ID-token hints out of helper process arguments. A loopback OAuth callback validates state,
PKCE-bound exchange, signed identity, issuer/audience, expiry, nonce and saved
subject before activation; token-response scopes determine plan permission.
A valid identity without that permission remains signed in but cannot infer.

Refresh reads current state under a kernel file lock shared by processes, replaces
access/refresh/ID/expiry/scope state together, and saves it before inference.
Unlike a stale timed lease, this lock cannot admit a second rotation while its
owner is suspended and is released by process death. Access renews within a 60-second expiry margin before inference;
the unspecified `earliest_refresh_at` representation is retained opaquely, not
interpreted as a speculative early-refresh time. Terminal refresh errors clear
unusable tokens; temporary failures retain them. No investigation is retried.

A running project binds to one registration/session generation. Sign-out writes
an invalidation before attempting revocation; new requests fail, and active
transport cancels when its local watcher observes the invalidation. Revocation
has bounded transient retries; unconfirmed remote revocation is disclosed after
local token removal. Registrations survive sign-out; process exit does not revoke.
Keychain does not absolutely isolate credentials from same-user processes. Setup,
platform limits, controls and recovery are in [hosted setup](../hosted-investigation.md).

The fixed public Responses endpoint overrides ambient SDK endpoint, organization,
project and logging settings and rejects redirects. Neither route automatically
retries inference. API-key requests use non-streaming responses, standard service
tier and a 16,000 output-token cap. ChatGPT requests stream, group the two functions
in a namespace, and omit unsupported fields including the output-token cap.
Deltas and output-item completion alone are never accepted as completed submissions.
An explicit terminal event supplies response status when the optional nested status
is absent; a contradictory nested status is rejected. Absent content type does not prevent parsing the requested event stream; an
explicitly incompatible type is rejected. Valid framing and a completed terminal
are still required. Premature EOF and inconsistent terminals produce distinct
credential-safe diagnostics. When a successful completed envelope has empty output,
the adapter can use finalized item events from the same response: every contiguous
added item must have one matching done event, with consistent identity and kind.
Missing, duplicate or mismatched items remain unaccepted. Nonempty terminal output
remains authoritative. Assessment captures preserve the terminal envelope and
resolved stream items separately; neither is rewritten to conceal the wire form.
Only a successful completed response may submit a whole result to domain
validation; failed/incomplete terminals, malformed streams and premature EOF
remain distinct from accepted investigrams. Domain guards still bound the dialogue.

Each operation owns fresh local history, including opaque encrypted reasoning
needed for further exchanges. No previous-response or server-conversation state
is used. Only evidence-request and whole-result submission functions are exposed;
the domain continues validating capabilities, references, qualifications and
submissions. Closing aborts local transport and releases history, without claiming
remote computation, allowance use or charges have stopped.

Under the accepted [reference transport decision](../decisions/investigator-reference-transport.md),
both hosted transports use a private per-dialogue reference table
(`postcode/investigator-references@3`, adapter versions `@6`). Canonical domain
IDs, public Entity bindings, worker messages and retained records are unchanged.
The model receives short exact handles with a random dialogue namespace and an
append-only ordinal. A fresh dialogue gets a fresh table; close releases it.
Handles identify available references, not supplied evidence. In particular,
issuing a handle for a bare support reference, omitted record or cursor does not
add anything to the full-record, summary or prior-account exposure ledgers.

Translation follows designated fields in the record union, evidence responses,
qualification summaries and prior-account deliveries. Incoming evidence subjects
and cursors, nested accounts, associations, inconsistencies and correction
replacements are decoded structurally before domain validation. Names, source,
paths, assertions, tags, opaque analysis values, prose, local IDs and qualification
text remain literal, even when they contain an ID or handle. There is no string
substitution over content, approximate matching or inference repair. Unknown,
foreign-dialogue and raw canonical spellings in incoming reference fields become
explicitly unresolvable references, preserving their full spelling for volume
accounting; ordinary tool unavailability or atomic submission rejection follows.
Only successful terminal tool calls are decoded; partial streamed output is never
an accepted result.

The transport appends instructions explaining handles, exposure and the guard to
the domain instructions. Agent configuration records the reference version and
guard representation. The character guard continues to measure serialized
**canonical domain inputs and decoded replies in UTF-16 code units**, including
all domain input fields. Evidence pagination and response bounds likewise run
before compaction. It does not measure compact wire messages, repeated provider
history, transport-only instructions, SDK envelopes or audit metadata. Invalid
result trees beyond the existing depth/count bounds remain invalid; translation
stops at those bounds. This is an execution backstop, not a token or price ceiling.

Assessment captures retain the exact sanitized wire request, raw terminal body
(and separately finalized stream items when used), plus a snapshot of available
handle-to-canonical bindings and path-indexed reply resolutions. Failed resolutions
are explicit nulls. The table is capture metadata, never extra provider context.
Capture consumers must use delivered records/summaries and canonical exposure
provenance to establish disclosure, not count table membership as delivery.
Canonical provenance retains domain instructions; captures retain the actual
transport instructions. Regression coverage in `investigator-references.test.ts`,
`investigation.test.ts` and both transport suites checks structural translation,
exposure separation, guards, fresh histories, cancellation and credential exclusion.
A deterministic fixture crawl also checks all evidence-query kinds and retained
investigram context for unencoded canonical references; its source/prose contain
no literal IDs, whose preservation is covered separately.

Received terminal usage is reported before outcome classification, including
failed, refused and incomplete responses. Missing usage after interruption is
unknown. Identity provenance and aggregation retain the selected authentication
and billing route. ChatGPT token counts establish neither allowance-versus-credit
attribution nor actual monetary charges; usage reporting links the provider's
controls and states this limit. Development assessment reporting separates
investigator, evaluator and source-informed assessor usage even when they share
one allowance. API-equivalent prices cannot be labeled actual ChatGPT charges.

Optional assessment capture receives sanitized request bodies, terminal responses
or failure records, never headers or SDK exceptions. Failure records retain HTTP
status, body shape, exact safe code/parameter and request ID; known credential
echoes are redacted before delivery. Captures may contain repository source and
remain development artifacts, not additional investigator access.

The development assessment harness drives the ordinary CLI and parent transport,
retaining exact views, observations and sanitized exchanges. A frozen pass fixes
source revisions, effective project configuration, compiler version, investigator
configuration and shared instructions; preflight rejects drift before credential
access. Assessment-only configuration overrides are preserved separately from
unchanged pinned source and attributed as part of the effective configuration.
Planned assessment runs and additional implementation diagnostics use separate
request ledgers. Reservations precede dispatch, including requests whose usage
remains unknown. A ledger ceiling is an administrative interruption, not an
interpretive result or milestone failure; ordinary investigation execution guards
retain their distinct outcomes. Fresh view-only evaluators and source-informed
assessors consume captured artifacts separately and receive no credentials.

Completed stream items with an explicit non-completed status are inconsistent
with terminal success and cannot supply tool calls or submissions. Missing item
status remains supported; successful terminal completion and consistent item
identity are still required. Malformed function arguments count as an invalid
submission only when the function explicitly names `submit_investigram`; malformed
evidence calls or unknown functions end without a submission, retaining usage.

Module inspection now includes bounded, paginated organization context: retained
placement claims, containing-group and ancestor containment claims, and nearby
README artifact references with their original qualification. It excludes sibling
branches and does not infer documentation applicability or inheritance. Content
is acquired separately through the existing source query. Unavailable placement,
partial discovery and withheld support remain explicit. Only dispatched records
count as full exposure; evaluation/repository summaries and undelivered content
retain their separate treatment. General investigation instructions describe how
relevant documentation assertions can be compared with implementation; they do
not prescribe exhaustive reading or supply assessment answers.

The human presentation no longer advertises correction links in a generic
milestone footer when a view may contain no correction or interpretation.

## Progressive shell navigation

The shell maps `explain`, `decompose` and `examine` to clarification,
decomposition and examination requirements on exact investigram references.
Missing or unsupported subjects do not start a dialogue. The same operation
retention and failure policy applies as for functionality; formatting, additional
context and repeated commands do not change request identity. Each new result
has a separate root. Inspection and rendering do not invoke an investigator.

Result views distinguish fixed composition from the generating investigation's
selected subject. Inspection exposes the composition parent and precise
provenance subject as navigation references; inspecting a linked child or earlier
subject reaches its original account. Evidence support keeps its original
qualification and source-detail disclosure remains explicitly requested. Display substitution follows explicit correction chains while retaining each account’s original composition separately. Derived revision status accompanies both original and replacement accounts.

Subject inspection adds a history-dependent section selected only through
explicit qualified associations, including the investigation-subject and
corrected-subject roles. Incidental mentions, referents and originating module
context do not create associations. This section does not change mechanical
information or turn interpretation into an intrinsic subject property. The
inspection projection identifies its mechanical basis, retained listing and supplied
continuation, including an invalid continuation. Different invalid references do
not share a projection/view identity; reference lifetime also distinguishes views.
Pages contain at most 24 accounts, 400 prose code units each and 55,000 code units
of detail with complete qualification. An oversized qualified entry keeps its
selectable reference and an explicit omission. `--after` continues in append-only
retention order; newly retained accounts may appear on subsequent inspection.
An invalid continuation is explicit. Direct investigram inspection lists later
results explicitly associated with it, so reverse provenance is also navigable.

Investigators use `investigations(subject)` to obtain up to 24 associated account
references and a continuation, then `investigram(reference)` to acquire content,
provenance, composition links, evidence and correction context. Bare listing
references never create citations or correction eligibility. Actual account
retrieval uses the existing delivery ledger and bounds. Typed reference transport
maps listing subjects, selected accounts and continuations structurally; listing
availability cannot confer evidence exposure.

A private assessment dependency selects the communication participant only after
evaluation determines that work is missing. In CLI execution the worker requests
an identity from the parent for that evaluation; credentials and agent instances
remain in the parent. The selected identity follows provenance, observations and
both usage ledgers. Ordinary configured operation uses its single explicit route.
The controlled fixture injects its earlier account through ordinary submission
and retention, then selects the live participant for later evaluations. It is
marked scripted in user-facing views and contributes only explicitly synthetic
setup accounting, with no provider request. This is not a public configuration
option or a billing fallback.

Selection completes before an investigation attempt or dialogue starts. A selector
failure closes the CLI session as an internal failure; interruption while identity
is pending terminates the worker. Neither adds attempt usage, and earlier usage
remains available for final reporting. Operation and selection identifiers prevent
stale replies from resolving another selection. Offline regressions exercise
these boundaries with the real worker, including late messages after closure.


## Correction selection and reconsideration

`investigation/revisions.ts` derives a snapshot from accepted session evaluations.
It indexes correction links and reverse citations without changing stored accounts,
composition, provenance, citation indexes or earlier projections. Corrections take
effect at retention, independently of presentation. The context coordinator caches
this derived snapshot only until another evaluation is retained.

Primary selection considers every reachable branch, using accepted evaluation
order and then correction array order within a simultaneous result as its stable
tie-break. Recency does not establish credibility or resolve a conflict. A branch
remains conflicting after a later descendant is selected. The qualified overview
links every competing account through paged correction relationships; inspecting
a reference always supplies that exact original. Family-primary metadata supplies
navigation across competing branches without redirecting the chosen subject.

Result redisplay follows replacement chains and then the selected replacement’s
own composition, with explicit original-to-displayed placement metadata. Corrected
children can appear under an unchanged root. Replacing the root displaces its old
subtree. Corrections targeting it remain in revision context; corrections reported
by displaced accounts are separately listed by reporter, target and replacement
references, without incorporating their replacements into the new tree. No display placement is stored as composition.
At most 256 accounts are materialized per view, with omitted references identified.
Displaced-account, displaced accompanying-correction and revision-status listings
are each limited to 256 entries, with separate omitted counts. Revision statuses
prioritize the selected investigram and displayed original/current accounts. Exact
inspection exposes each account’s own bounded context; omitted display entries do
not trigger displaced-subtree expansion. Retained history is still traversed to
count omissions; the bound limits output, not session memory or traversal time.
Follow-ups retain their exact subject and request identity, including superseded
subjects; repeated results show current subject revisions without further inference.

For each correction, the citation worklist starts at its target. A citer is affected
unless its generating provenance either produced that correction or records its
complete correction context. The exemption applies to the whole evaluation,
including composition children and every replacement, and blocks propagation
through that account. Other paths and later causes remain independent. No complete
paths are enumerated: each account is visited at most once per cause. The work is
bounded by corrections times the retained citation graph, rather than the number
of possible citation paths. These domain worklists retain correction-specific
exemptions; they do not add a generic graph framework. Composition and provenance
subjects alone never propagate reconsideration. Warnings do not establish error,
clear automatically, invalidate a session or trigger inference.

Human and investigator revision pages each contain at most 24 correction/cause
rows and 24 incoming unresolved inconsistencies. Each cause identifies up to eight
proximal citations, with an omitted count and the complete immutable citation index
available in provenance. `inspect @investigram --revision-page N` and
`investigram(subject, revisionPage: N)` expose further pages. Rows preserve cause
identity, distinguishing direct and transitive exposure without duplicating a cause
for revised-subject disclosure. Current revision facets participate in projection
identity, including associated-account inspections over unchanged mechanical data.

Context retains the exact requested account plus bounded correction-family and
cause context. Automatically included accounts carry their own content and a
revision summary with an explicit page-1 continuation; their automatic correction
link follows the path to the current primary. Incoming inconsistency omissions
distinguish summary policy (with the full count) from the character bound; the requested account’s
relationship/cause page is expanded once, avoiding quadratic metadata repetition. Correction reasons and incoming inconsistency content create
citations to their reporters; metadata and bare navigation references do not.
Instructions, tool schemas and supplied context make the citation rule explicit:
correction reasons and qualifications are content of the reporting investigram.
The investigator cites `correction.reporter`; the correction handle identifies the
relationship and is never eligible evidence. Metadata alone does not supply that
content. Validation neither substitutes the reporter for an invalid correction ID
nor opens a repair dialogue. Context pages report omitted accounts/corrections and further accompanying-correction
pages. Only actual complete delivery of target and replacement fields plus
correction reasons/qualifications establishes an exemption. Recursive children are
not required. Reference transport maps these new fields structurally; prose is
unchanged. The existing character guard continues to measure canonical domain
exchanges before private handle translation. Captured deliveries remain the audit
of actual exposure, including citation indexes and per-correction completeness.
