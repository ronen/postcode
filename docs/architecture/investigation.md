# Investigation execution

This describes milestones 1–2 of [module investigation](../plans/module-investigation.md).
The domain boundary, session retention and summary/inspection CLI paths are
implemented and exercised through a deterministic agent double. There is no
hosted adapter or credential setup yet. Public follow-up lenses and correction-aware
replacement selection remain later milestones. The governing contracts are
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
No external dependencies are needed for this checkpoint.

The execution guard currently permits 180 seconds, 32 agent exchanges, 96 tool
requests and 2,000,000 serialized UTF-16 code units across sent/received exchanges.
It covers initial validity checks, dialogue and tool-triggered work. These are
runaway-containment limits, not spending allowances or coverage definitions.
Each exchange receives the remaining time and call counts to permit completion
within the guard. Synchronous work may delay deadline detection; its returned
content is checked before delivery. Abort signals reach asynchronous work, but
ignored cancellation cannot forcibly terminate it. No late submission is accepted.
Future hosted cancellation cannot promise that remote work or billing has stopped.

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
inconsistencies retain affected references and qualifications. Associations
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
exposure provenance. Deriving reconsideration and human-facing replacement
selection remains milestone 5 work.

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
addressable; views show originals and explicit correction links at this checkpoint.
Correction-aware replacement selection and reconsideration display are milestone 5
work. Broader subject-associated discovery and public follow-up lenses remain later
work. The internal session evaluation entry point already supports successive
operations and correction-aware investigator context over earlier retained results.

The experimental investigation view includes selected operation/outcome and reuse,
immutable accounts, corrections, generating provenance, evidence exposure, stable
references and attempt/session usage.
Human correction displays identify each correction's corrected subjects and own
evidence references alongside its reporter, target, replacement, reason and
qualifications; the shared support list does not replace that attribution.
Standard support details distinguish full,
summary and earlier-interpretation exposure per generating provenance, including
the provenance of incoming corrections. Explicit source detail reveals captured
support locations and excerpts, with a source-disclosure observation; investigator
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
and one-shot tests. Ordinary CLI use has no configured investigator and reports
configuration unavailability without an actual provider call.

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
provider reports from synthetic test data. Categories retain units and subset
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
