# Investigator execution and evidence access

Status: in review
Decided: [needs-review — set adoption date at promotion]
Arising from: [Module investigation](../plans/module-investigation.md)
Scope: evaluation integration, investigator dialogue, evidence access, failure outcomes, and usage attribution

## Context

[Investigrams and progressive investigation](investigrams-and-progressive-investigation.md)
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
retained. Displaying a retained outcome adds no inference usage. Session totals
aggregate each reported call once with model, units, and category relationships
preserved. Missing usage remains explicit, and totals are not asserted to be
complete billed usage. Usage reporting does not invoke inference, affect
outcome reuse, or establish a spending allowance. The initial slice
exposes attempt and session usage; monetary estimation for formative assessment
remains assessment tooling.

### Integrate interpretation with evaluation and qualified evidence access

An **Investigator** investigates a subject through a dialogue with PostCode and
submits an interpretation for validation. PostCode supplies context and handles
the investigator's evidence requests through its qualified evidence interfaces.
The role
serves summary, explain, decompose, and examine. The inference model and provider
are integration choices behind this role.

Language analysis and interpretation produce qualified information through the
existing evaluation and session record-store architecture. Interpretation adds
investigrams and their support and relationships; it does not establish a
separate storage or projection pipeline. Shared evidence, Claim context, and
evaluation outcomes preserve their meaning across both kinds of analysis without
requiring entities and investigrams to be the same record kind.

Lenses declare requested information. Evaluation selects retained outcomes and
explicit revisions and determines what missing analysis or investigation must
run. Validated results are retained before projection construction; rendering
and projection construction consume materialized information without invoking
analysis. A retained interpretation's reuse and an explicit request for a new
attempt remain distinct from mechanical reuse rules. More available context
alone does not require regeneration of every earlier investigram.

#### Evaluation outcomes and later requests

Each interpretation evaluation ends with one outcome, describing whether it
produced an accepted result or why it did not. A result is the accepted root
investigram; only a successful outcome carries one.

| Outcome | Meaning | Accepted investigram? | Retains outcome? |
| --- | --- | --- | --- |
| Accepted result | The investigator submits the result before execution is stopped, and whole-result validation passes. | Yes | Yes, with its result. |
| Execution-limit stop | PostCode's guard ends investigation or repair in progress before an acceptable result is submitted, including while a provider call is in flight. | No | Yes. |
| Investigation failure | The dialogue ends without submission, or submitted-result validation fails, without an execution-limit, communication/service, or configuration failure causing the termination. This includes refusal, unrecovered output truncation, and unrepaired structural or reference errors. | No | Yes. |
| Communication/service failure | Communication breaks down or the provider cannot serve the request, including transport errors, request timeouts, rate limiting, provider unavailability, and spending-limit or quota exhaustion. | No | No. |
| Configuration unavailability | Required setup or access is unavailable, including runtime authentication rejection. | No | No. |

Classification reflects what actually ended the evaluation, including when
optional repair is attempted.

Interruption and session invalidation follow the existing termination rules and
leave no reusable outcome for the interrupted evaluation.

Repeating a request returns its retained outcome without new investigation,
displaying the result when present. If no reusable outcome is retained, the
request attempts a new investigation through ordinary selection, without detecting
repetition or resuming the previous dialogue. Diagnostic and usage records alone
do not count as retained reusable outcomes.

Limited coverage, uncertainty, and no useful new findings do not constitute
investigation failure: a submitted account describing them can be an accepted
result.

Unrecognized provider errors are reported as
unclassified communication/service failures with credential-safe diagnostics;
this classification does not establish that they are transient.

For spending-limit or quota exhaustion, preserve the provider error code and
credential-safe diagnostic, distinguishing exhaustion from transient rate
limiting when supported and reporting uncertainty when the precise restriction
is unclear.

Qualified mechanical results and evidence acquired through tools remain available
under the normal session-validity rules regardless of interpretation outcome.

#### Subject-based evidence access

The investigator has domain-level access to supported qualified entities and
relationships. Queries go through evaluation, which reuses retained analysis or
performs missing mechanical analysis. Results retain their scope, method,
evidence, and limitations. An established dependency does not establish the
responsibility it serves; source interpretation can contribute that account
separately.

The investigator's complete program-access surface is PostCode's subject
population. It navigates entities, relationships, organization groups, and
opaque documentation or artifact records, requesting source or contents by
reference. There is no independent filesystem discovery or path-based read
interface. Completeness here concerns the accessible subject set, not complete
contents or analysis of each subject. Organization membership does not by itself
establish a documentation association with a module.

The investigator has no shell execution, mutation, or web access. Repository
content is evidence to analyze, not instructions to obey. Credentials remain
outside investigator context, investigrams, and observations; provider
authentication is handled by the agent communication boundary.

Subject-based evidence requests use shared acquisition backed by the session
record store. Acquisition resolves established mappings, returns retained
captures, or acquires and retains missing contents within the existing validity
boundary. One subject can map to several files or regions. Unsupported mappings
or unavailable contents yield qualified tool responses rather than falling back to
arbitrary reads. Filesystem I/O need not be performed by the store itself.
Capture, output exclusion, and validity enforcement remain responsibilities of
shared acquisition, without introducing a second investigator-specific
file-access policy.

Unavailable evidence from an individual acquisition is normally a qualified tool
response the dialogue can continue past, not an investigation failure.
Configuration and service failures follow the evaluation outcome taxonomy above.

The surrounding PostCode session retains investigrams, evidence, and outcomes.
The investigator can follow composition, investigation-provenance, and revision
links on demand, including reverse lookup of operations that selected an
investigram. The selected investigram directs attention without restricting access
to its composition tree or its own chain of prior investigations. Retrieved
prior interpretations are distinguished from source and mechanical evidence.

Full captured source is available through this interface within execution
limits; bounded human-facing excerpts do not constrain analysis. Source
acquisition and coverage remain attributable, including chunking and omissions.
New content acquisition participates in the session's existing change-detection
contract.

Source supplied to an investigator is analysis input, not a human source escape.
Its delivery is retained for provenance and resource accounting; a source-escape
observation records source actually disclosed to the human through the
interface. Provider transmission remains an operational disclosure distinct from
both human source presentation and the evidential qualification of an
interpretation.

#### Rationale, alternatives, and consequences

Investigator names evidence gathering and interpretation without implying a
judgment of correctness. Interpreter suggests source execution; examiner can
suggest assessment or certification. Analyst and analyzer overlap with the
mechanical analysis machinery, while inspector conflicts with inspect's
retrieval-only role. In user journeys, describe the human as exploring or seeking
to understand the code, reserving Investigator for this component.

A separate investigator pipeline would duplicate evaluation, retention, failure,
and qualification responsibilities. Restricting the investigator to source would
require it to reconstruct relationships already established by language
analysis. Restricting it to currently retained records would prevent useful
on-demand analysis. The shared evaluation boundary supports both acquisition and
reuse without hiding limitations or treating interpretation as mechanically
established information.

Full source access is often needed to understand apparent functionality; human
presentation bounds address a different concern. Conflating those bounds would
silently reduce analysis coverage, while labeling investigator reads as human
source escapes would misreport the user's interaction. These distinctions
specialize the existing evaluation and source-disclosure contracts rather than
replacing them.

### Start each operation fresh and permit bounded investigator dialogue

Each new interpretation evaluation uses one fresh investigator dialogue,
including any bounded repair turns. Delivery during the evaluation and delivery
during that dialogue refer to the same exposure history. PostCode provides the
objective and initial context, the investigator requests additional context or
source, and PostCode returns it. Request and response continue until the
investigator submits a result for acceptance or execution ends. Conversation can
accumulate within the operation; opaque conversational memory does not carry
over to the next operation.

The result contract applies to the assembled dialogue result, not necessarily
one final response. Delivery may span exchanges; validation and acceptance
remain atomic. The protocol must establish that the investigator submitted the
result for acceptance; structural validity alone does not establish readiness.
Submission mechanics remain an implementation choice and do not assert
exhaustive investigation. Submission before the guard stops execution
transitions the result to ordinary whole-result validation. A stop before
submission retains no investigram; submissions arriving after the stop are
rejected. If validation fails, the implementation may request repair within the
same dialogue, subject to the execution guard. The investigator describes
investigation coverage in prose; epistemological qualifications remain
separately identifiable and attributable.

Investigator-written qualifications can caveat an account but cannot raise its
epistemological status; validation checks their required presence, structure,
and attribution rather than their truth.

Continuation or repair of a truncated exchange is permitted within the
evaluation's limits as an implementation choice. Any terminal failure follows
the [evaluation outcome taxonomy](#evaluation-outcomes-and-later-requests),
including guard expiry during repair. Communication failure discards unaccepted
dialogue content rather than submitting it for validation.

The minimum initial request supplies the operation and module reference for a
summary, or the selected investigram's prose, referent information, and context
references for a follow-up. Further evidence is acquired through the shared
subject-based interface. Prefetching is an execution choice, not a separate
evidence contract; initially supplied and subsequently requested material obey
the same capture, qualification, and provenance rules. The actual context
delivered remains attributable in either case.

The Investigator is the dialogue participant reached through the agent
communication boundary. PostCode's dialogue coordinator is its counterpart:
it supplies context, handles evidence requests, and validates submissions.
An investigator test double replaces that participant while exercising PostCode's
coordination. These roles are independent of local or hosted model execution.

Two internal boundaries separate domain interpretation from agent communication:

- The outer **domain interpretation boundary** accepts an operation, subject, and
  investigation context; coordinates subject-based evidence access and validation;
  and returns an evaluation outcome, carrying a result when accepted.
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

The plan specifies the initial integration and practical bounds. Execution bounds
constrain evaluation rather than changing the lens question. Context selection,
explicit instructions, tool-delivered evidence, model/configuration, and
generated results remain attributable without requiring access to model-private
reasoning. Normal session invalidation and generated-output boundaries continue
to apply.

## Governing impact and promotion

The accompanying [core concepts](../core-concepts.md) define Investigator and explicitly
include interpretation among applicable analyses. The
[architectural constraints](../architectural-constraints.md) record the
investigator access boundary. Existing qualification, evaluation, session, and
observation decisions continue to govern. This record does not supersede an
earlier headed decision.

At adoption, set the decision date, update canonical indexes, and rewrite links
for their destination paths.
