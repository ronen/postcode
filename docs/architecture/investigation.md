# Investigation execution

All supported agentic operations use the [common contribution dialog](contributions.md#agentic-dialog). The accepted mechanical and caller checkpoints migrated the producers and consumers; integrated retirement removes the old tree, whole-investigram correction, citation-closure and primary-replacement machinery. The final integrated review remains a separate gate. Historical assessment records describe their recorded code and instructions; no new live inference was used for this migration.

## Responsibilities and lifetime

`contributions/dialog.ts` coordinates one fresh agent conversation over a Session-owned ledger. `contributions/evaluation.ts` owns operation reuse and attempt results; `contributions/answers.ts` and `inspection.ts` capture answer selection, standing and reconsideration causes. These are distinct from the hosted communication participant, which owns SDK history, reference translation and credentials. The [attempt/answer decision](../decisions/investigation-attempts-and-answer-outcomes.md) separates a failed attempt from the answer currently designated for its question.

Each accepted contribution owns immutable content, qualification and support. The ledger and program store share only content they deeply own, using lifetime-scoped capture bookkeeping. An externally frozen object is copied and validated. Each answer independently captures its selected uses and time-dependent standing/causes, while sharing immutable owned evidence and items. Retained answer content remains renderable after Session close without looking up current standing or reopening analysis. Close clears ownership bookkeeping and releases execution state; retaining an answer keeps only its own reachable support. See [ownership and capture](contributions.md) and the [representative memory measurements](../../records/validation/structured-architectural-accounts/m3-agentic-caller-memory.md).

Application coordination supplies all reference bindings with the selected content. The CLI arranges plain immutable inputs under one operation guard; it has no store-backed allocation port. Worker messages are structured data. Exact presentation resolves only fixed retained support, without population discovery, acquisition or inference. Neither answer capture nor presentation records exposure.

## Native evidence and actual delivery

`evidence-access.ts` dispatches exact subject queries to the existing module, export, dependency and organization evaluators. Their algorithms, evidence, scope and guarantees remain unchanged. The evaluators also contribute qualified native findings to the common ledger. A response identifies its selected records, relevant qualification, support references and any omissions; paths supplied by an agent never authorize reads.

Module and organization listings, exports, dependencies, dependents, membership and group navigation use stable pages over retained selections. A page covers at most 24 entries and targets 55,000 serialized UTF-16 code units. Opaque continuations belong to the evidence boundary and exact query; later acquisition does not refresh that selection. Large support can be represented by inspectable references, with partial status and explicit omissions. A reference is available navigation, not delivered content. Evaluation and repository summaries qualify the returned selection without embedding unrelated populations. These summary objects do not make the omitted full records eligible evidence.

Module source requests follow retained source mappings; artifact requests follow captured repository evidence. Multiple mappings remain distinct. Reads pass through the first-observed input host and its generated-output exclusions and validity probes. Module inspection exposes qualified local and ancestor documentation references, without inferring applicability or reading sibling content. Requested source content is then acquired separately.

The dialog supplies both native evidence and the common retained findings actually obtained by a query. It records dispatched full program records as `suppliedEvidence` and common exposure as `contributionDeliveries`; obsolete tree deliveries and the always-empty legacy summary-citation report are removed. Common delivery records distinguish scopes, exact association uses, content portions, metadata, members and exact change notices. A record assembled by the host but withheld by a response/character guard is not exposure. A known address is not a substantive acquisition.

Request-scoped work reporting separately records what was acquired, unavailable, withheld or actually delivered. Acquired-but-undispatched facts remain attributable without granting citation eligibility. A query still awaiting its result has an unknown outcome; cancellation seals that report and a late result cannot rewrite it. The 60,000-character response guard and canonical dialog guards remain separate from selected-answer retention.

## Acceptance and answer history

The common acceptance boundary validates same-Session references, content structure, qualifications, exact organizing declarations and collisions atomically. Additions, supersessions, withdrawals, inconsistency reports and result designations keep their distinct meanings. Supersession operates on exact uses; it neither rewrites shared content nor chooses a preferred alternative. Failed or repaired submissions cannot partially update the ledger. Current-only and all-history acquisition have explicit scope and timing.

Fresh selection captures current uses and concerns. Exact retained selection keeps its earlier snapshot, including selected owner reports, without acquiring today's standing or replaying attempt diagnostics. Failed attempt kind/code/diagnostic remains in invocation reporting and does not manufacture a different empty answer. Common operation guidance covers functionality, clarification, decomposition, examination, state behavior and retained follow-up options; the state diagram and option invocation are application capabilities, with no new CLI command implied.

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
snapshots. Subsequent usage reports and command observations read those same snapshots;
worker report updates supply termination/exposure metadata without replacing the
sealed call reports. View identity includes the finalized usage snapshot separately
from the interpretation projection identity. The worker envelope carries an
explicit usage-independent arrangement key, including format, source choices,
normalized continuation/page, reference lifetime and invocation reporting. The
parent uses that key without accessing core content or reconstructing inputs from
bounded View fields. Repeated finalization with the same usage is stable, and
retained accounts and earlier Views remain unchanged. Subjectless usage travels as an explicit report alternative with no program
Projection, View or content identity. The parent replaces its usage from the same
sealed ledger and re-renders it without core access; parameter-resolution reports
use that same finalization boundary. Direct in-process
sessions continue to use their own domain ledger and termination boundary.

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

## Reference protocol

The common hosted protocol exposes `request_information` and `submit_contribution`. Its typed codec translates only designated references in program records, native findings, questions, exact subjects, content addresses, organizing declarations and replies. Source, names, paths, opaque payloads, prose and qualifications remain literal. Each conversation owns a random namespace and append-only short-handle table; close releases it. Unknown, canonical or foreign-dialogue spellings in a reference field remain explicitly unresolvable, with their full spelling preserved for the canonical character guard.

The transport measures no domain acceptance itself. The dialog's volume guard counts canonical domain inputs and decoded replies, including fields that compact wire handles would shorten. It is not a token or price ceiling. Available handle bindings do not establish exposure. Captures contain sanitized requests, terminal responses, separately finalized stream items when applicable, and auditable path-indexed reference resolutions. Domain history records actual deliveries independently of that transport metadata.

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
submission only when the function explicitly names `submit_contribution`; malformed
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

## Inadequacy feedback delivery

The parent CLI publishes optional-explanation `feedback` reports through the existing
command-completion sink. The shell snapshots the last displayed View, resolution
report or command failure, including exact stdout/stderr and already available context; feedback and
usage acknowledgments do not replace it. Reporting does not call the analysis worker,
select an answer, rerender, refresh or correct an account. One-shot feedback bypasses
project opening and investigator configuration, uses its own invocation identifier
and ordinal one, and writes under `_observations/context-free/`. Both forms disclose
missing context and sink failures. Each feedback batch embeds the available displayed
artifacts independently of earlier batches. Captured-basis and navigation-history
gaps are not reconstructed or resolved by feedback.
