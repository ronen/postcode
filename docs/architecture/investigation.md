# Investigation execution

This describes milestone 1 of [module investigation](../plans/module-investigation.md).
The domain boundary is implemented and exercised through a deterministic agent
double. It has no CLI entry point, hosted adapter, credentials, interpretation
retention, or human-facing investigram presentation yet. Those integrations remain
in the plan's later milestones. The governing contracts are
[investigator execution](../decisions/investigator-execution-and-evidence-access.md),
[investigrams](../decisions/investigrams-and-progressive-investigation.md), and
[operations and lenses](../decisions/investigation-operations-and-lenses.md).

## Evaluation and evidence

Existing module, dependency and organization evaluators continue to own mechanical
evaluation and its reuse. A shared evidence-access boundary dispatches declared
subject queries to those evaluators, returning stored records and their
qualifications. It constructs neither projections nor human-command observations.
It can materialize missing exports, documentation, dependencies, dependents and
organization information. Its lookup operation resolves domain references; its
inspection tool excludes internal session/input snapshots. Claim-context input
references remain attributable without transmitting the raw acquisition ledger
with each response.

Content acquisition is a provider capability behind that same boundary. Module
references resolve through their retained source mappings; organization artifacts
resolve through captured repository evidence. Multiple module file mappings are
preserved. The TypeScript provider reads through the existing first-observed input
host, using the shared generated-output policy and registering new content with
the existing validity probes. There is no investigator filesystem or path-reading
interface. Opaque artifacts, unresolved links, excluded targets, unavailable text
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

## Dialogue, acceptance and ownership

An investigation request names an operation, exact subject and semantic parameters,
independently of its future consuming lens. The four operation objectives are
functionality, clarification, decomposition and examination; this slice accepts
no semantic parameters. A functionality request starts with a module reference;
the other operations start with the exact earlier investigram and correction-aware
context. Every execution opens a fresh agent dialogue. The communication contract
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
future evaluation/session integration owns the prescribed retention policy.
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
Replacement associations preserve the corrected account's originating request
subject without copying every additional association from the original.

PostCode assigns identities and freezes the complete accepted unit, including
operation provenance and every replacement. Acceptance does not insert
investigrams or corrections into the program store. Milestone 2 will retain the
unit atomically alongside its outcome. Mechanical evidence already acquired is
independent of whether interpretation is accepted. Rendering and projection code
do not participate in investigation execution.

## Context exposure and usage

Earlier accounts are supplied through a read-only history boundary. Milestone 1
uses fixtures produced through ordinary acceptance. Context retrieval preserves
the exact original, explicit revision notices, replacement accounts, reasons and
qualifications, including chains, alternatives and accompanying corrections.
It does not recursively embed earlier delivery payloads or automatically expand
composition children. Bounded responses disclose omitted references and allow
separate retrieval: at most 24 accounts and 60,000 code units of substantive
content/reasons per request, with the overall dialogue-volume guard also covering
metadata. Prose, referent and qualifications can be requested separately; excerpts
do not establish complete prose delivery.

Only dispatched substantive context enters the conservative citation index.
Identifiers alone do not. Complete target eligibility accumulates across exchanges;
complete correction context requires the target and replacement's own prose,
referent and qualifications plus the correction's reasons and qualifications.
Completeness is recorded per correction identity. It does not imply comprehension
or require subordinate trees. Every accepted investigram shares this execution's
exposure provenance. Deriving reconsideration and human-facing replacement
selection remains milestone 5 work.

Usage is held by an independently owned attempt/call ledger. Calls are registered
before dispatch; absent reports remain explicitly unknown. Identical repeated
reports do not double count, and category subset relationships remain explicit.
Synthetic test usage is distinguished from provider usage. A final report callback
runs on success, failure, interruption, invalidation or defect and retains received
usage, instructions, termination classification and supplied-context identities.
Late callbacks after termination are ignored; remote billed usage may therefore
remain unknown. Session aggregation and presentation are milestone 2 work.
