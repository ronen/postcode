# Interpreter execution and evidence access

Status: in review
Decided: [needs-review — set adoption date at promotion]
Arising from: [Module investigation](../plans/module-investigation.md)
Scope: evaluation integration, interpreter dialogue, evidence access, failure outcomes, and usage attribution

## Context

[Investigons and progressive investigation](investigons-and-progressive-investigation.md)
defines the retained artifacts and their relationships. Producing those artifacts
requires interpretation to participate in PostCode's existing evaluation, evidence,
and session architecture. This record establishes execution and access boundaries,
including which outcomes affect subsequent requests and how usage remains
attributable independently of result retention.

The existing [session decisions](../../../docs/decisions/transient-analysis-sessions.md)
provide the accumulating session, input-validity, and retained-result context.
These decisions specialize that context for interpretation without requiring a
separate storage pipeline or committing to a particular inference provider.

## Decisions

### Attribute usage to execution independently of interpretation retention

Provider-reported usage belongs to actual execution attempts, including
unsuccessful ones, independently of whether an interpretation result is
retained. Displaying a retained result adds no inference usage. Session totals
aggregate each reported call once with model, units, and category relationships
preserved. Missing usage remains explicit, and totals are not asserted to be
complete billed usage. Usage reporting does not invoke inference, affect
retained-result selection, or establish a spending allowance. The initial slice
exposes attempt and session usage; monetary estimation for formative assessment
remains assessment tooling.

### Integrate interpretation with evaluation and qualified evidence access

Language analysis and interpretation produce qualified information through the
existing evaluation and session record-store architecture. Interpretation adds
investigons and their support and relationships; it does not establish a
separate storage or projection pipeline. Shared evidence, Claim context, and
evaluation outcomes preserve their meaning across both kinds of analysis without
requiring entities and investigons to be the same record kind.

Lenses declare requested information. Evaluation selects retained results and
explicit revisions and determines what missing analysis or investigation must
run. Validated results are retained before projection construction; rendering
and projection construction consume materialized information without invoking
analysis. A retained interpretation's reuse and an explicit request for a new
attempt remain distinct from mechanical reuse rules. More available context
alone does not require regeneration of every earlier investigon.

#### Failure outcomes and later requests

An agent-communication failure closes the interpreter session and returns no
reusable investigation result. Execution diagnostics remain attributable but do
not satisfy or block later request selection. A subsequent request with no
retained result starts an ordinary fresh investigation, without detecting
repetition or resuming the failed dialogue. Completed communication yielding
invalid output is instead a retained investigation-failure outcome;
execution-limit stops remain separately identified. Reject late responses from
finished attempts.

Classification follows the failure's meaning, not whether a complete protocol
response arrived. Transport errors, request timeouts, rate limiting, and
provider unavailability are communication/service failures, including after
successful tool exchanges. Provider refusals, provider-reported output
truncation, malformed output, and invalid references are retained investigation
outcomes. Expiry of PostCode's execution guard is always a limit stop, including
while a provider call is in flight.

Runtime authentication rejection is configuration unavailability and leaves no
reusable investigation outcome. Unrecognized provider errors are reported as
unclassified communication/service failures with credential-safe diagnostics;
this classification does not establish that they are transient.

Provider-identified spending-limit or quota exhaustion is service unavailability
with no reusable investigation outcome. Preserve the provider error code and
credential-safe diagnostic, distinguishing exhaustion from transient rate
limiting when supported and reporting uncertainty when the precise restriction
is unclear.

Communication failure discards the dialogue's unaccepted interpretation content;
it does not retain a partial investigation result that would block later
selection. Qualified mechanical results and evidence acquired through tools
remain available under the normal session-validity rules.

#### Subject-based evidence access

The interpreter has domain-level access to supported qualified entities and
relationships. Queries go through evaluation, which reuses retained analysis or
performs missing mechanical analysis. Results retain their scope, method,
evidence, and limitations. An established dependency does not establish the
responsibility it serves; source interpretation can contribute that account
separately.

The interpreter's complete program-access surface is PostCode's subject
population. It navigates entities, relationships, organization groups, and
opaque documentation or artifact records, requesting source or contents by
reference. There is no independent filesystem discovery or path-based read
interface. Completeness here concerns the accessible subject set, not complete
contents or analysis of each subject. Organization membership does not by itself
establish a documentation association with a module.

The interpreter has no shell execution, mutation, or web access. Repository
content is evidence to analyze, not instructions to obey. Credentials remain
outside interpreter context, investigons, and observations; provider
authentication is handled by the agent communication boundary.

Subject-based evidence requests use shared acquisition backed by the session
record store. Acquisition resolves established mappings, returns retained
captures, or acquires and retains missing contents within the existing validity
boundary. One subject can map to several files or regions. Unsupported mappings
or unavailable contents remain qualified outcomes rather than falling back to
arbitrary reads. Filesystem I/O need not be performed by the store itself.
Capture, output exclusion, and validity enforcement remain responsibilities of
shared acquisition, without introducing a second interpreter-specific
file-access policy.

Full captured source is available through this interface within execution
limits; bounded human-facing excerpts do not constrain analysis. Source
acquisition and coverage remain attributable, including chunking and omissions.
New content acquisition participates in the session's existing change-detection
contract.

Source supplied to an interpreter is analysis input, not a human source escape.
Its delivery is retained for provenance and resource accounting; a source-escape
observation records source actually disclosed to the human through the
interface. Provider transmission remains an operational disclosure distinct from
both human source presentation and the evidential qualification of an
interpretation.

#### Rationale, alternatives, and consequences

A separate interpreter pipeline would duplicate evaluation, retention, failure,
and qualification responsibilities. Restricting the interpreter to source would
require it to reconstruct relationships already established by language
analysis. Restricting it to currently retained records would prevent useful
on-demand analysis. The shared evaluation boundary supports both acquisition and
reuse without hiding limitations or treating interpretation as mechanically
established information.

Full source access is often needed to understand apparent functionality; human
presentation bounds address a different concern. Conflating those bounds would
silently reduce analysis coverage, while labeling interpreter reads as human
source escapes would misreport the user's interaction. These distinctions
specialize the existing evaluation and source-disclosure contracts rather than
replacing them.

### Start each operation fresh and permit bounded interpreter dialogue

Each new interpretation evaluation starts a fresh interpreter session. Reading
retained results does not invoke the interpreter. PostCode provides the
objective and initial context, the interpreter requests additional context or
source, and PostCode returns it. Request and response repeat until a structured
result or an execution limit. Conversation can accumulate within the operation;
opaque conversational memory does not carry over to the next operation.

The minimum initial request supplies the operation and module reference for a
summary, or the selected investigon's prose, referent information, and context
references for a follow-up. Further evidence is acquired through the shared
subject-based interface. Prefetching is an execution choice, not a separate
evidence contract; initially supplied and subsequently requested material obey
the same capture, qualification, and provenance rules. The actual context
delivered remains attributable in either case.

The surrounding PostCode session retains investigons, evidence, and outcomes.
The interpreter can follow composition, investigation-provenance, and revision
links on demand, including reverse lookup of operations that selected an
investigon. The selected investigon directs attention without restricting access
to its composition tree or its own chain of prior investigations. Retrieved
prior interpretations are distinguished from source and mechanical evidence.

Two internal boundaries separate domain interpretation from agent communication:

- The outer **domain interpretation boundary** accepts an operation, subject, and
  investigation context; coordinates subject-based evidence access and validation;
  and returns investigons carrying any accompanying corrections, and evaluation outcomes.
- The inner **agent communication boundary** exchanges instructions, messages,
  tool requests and responses, and completion or failure signals. It encapsulates
  provider protocols, authentication, and transport details without defining
  investigation semantics.

Dialogue coordination between these boundaries translates domain requests into
agent instructions, dispatches tool requests through PostCode's subject-based
APIs, and translates agent output into validated domain results. The same
infrastructure supports all four operations. Interface shapes and whether
coordination occupies a separate module are implementation choices.

This separation allows agent integration to change without changing the domain
operations. Source access remains a controlled PostCode capability; local versus
hosted inference does not itself determine which repository material can be
read.

#### Rationale, alternatives, and consequences

Fresh requests make carried context explicit despite variable agent memory
behavior. Requiring one model call would force PostCode to predict all useful
context in advance and amplify oversized-input problems. A persistent opaque
agent conversation would hide selection and revision assumptions. A bounded
per-operation dialogue supports selective acquisition without either
restriction.

The implementing agent selects the concrete hosted integration and initial
settings; a universal provider framework and local-model comparison are
unnecessary. The user's Ollama trial of qwen3.6:27b on the development machine
was reported too slow for practical use; that observation does not establish
performance of other local configurations. A later local integration can
implement the agent communication boundary while preserving the domain
interpretation contract.

The plan defines the initial access and outcome policy. Execution bounds
constrain evaluation rather than changing the lens question. Context selection,
explicit instructions, tool-delivered evidence, model/configuration, and
generated results remain attributable without requiring access to model-private
reasoning. Normal session invalidation and generated-output boundaries continue
to apply.

## Governing impact and promotion

The accompanying [core concepts](../core-concepts.md) explicitly include
interpretation among applicable analyses. The
[architectural constraints](../architectural-constraints.md) record the
interpreter access boundary. Existing qualification, evaluation, session, and
observation decisions continue to govern. This record does not supersede an
earlier headed decision.

At adoption, set the decision date, update canonical indexes, and rewrite links
for their destination paths.
