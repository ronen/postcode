# Module investigation

Status: in review
Created: 2026-09-24
Updated: 2026-09-24
Superseded by:

## Outcome and use narrative

A human investigating one configured TypeScript project requests a terse summary
of a module, selects a point of interest, and clarifies, decomposes, or examines it
without translating that point back into source locations. The shell retains the
investigation, its evidence, and earlier interpretations. A deeper investigation
can correct an earlier explanation without erasing what was previously presented.

The retained prose unit is an **investigon**: an immutable, addressable artifact
of program investigation containing a qualified interpretation, with referent
information, evidence context, and provenance. One result has a fixed composition
tree of investigons. A later investigation produces a separate tree whose root
references the selected subject through investigation provenance. Neither structure
establishes a decomposition of the program into canonical architectural units.

Investigation is the user-facing activity; interpretation is the capability that
supports these operations. Existing mechanical investigations, such as organization
and dependencies, continue to produce qualified projections. They can supply
evidence for investigons without themselves becoming investigons.

This slice implements four operations using shared interpretation infrastructure:

| Operation | Requested information | Observable distinction |
| --- | --- | --- |
| `summary(module)` | A deliberately terse account of apparent functionality and responsibility, including significant mechanisms, cases, and delegation | Broad, coherent selectable investigons; no mandatory 5WH template or exhaustive branch inventory |
| `explain(investigon)` | A more understandable account of the selected aspect of this program | Useful clarification and detail omitted for brevity; new findings are not required |
| `decompose(investigon)` | Smaller, tersely described selectable aspects of the selected functionality | More precise focus without requiring a deeper investigation of each aspect |
| `examine(investigon)` | A deeper investigation of the selected aspect | Substantive findings, sharper limitations, corrections, or an explicit report that no useful addition was established |

For a summary saying that a module “assembles configuration and starts the
application,” decomposition can expose those two activities separately. Examining
configuration assembly can investigate input precedence and validation. Explanation
can clarify what assembly means in this program. All three return investigons
that can be used with any subsequent operation. Decomposition may discover new
claims while reasoning over existing evidence; examination may need additional
source. Their objectives, not exclusive tool permissions, distinguish them.

“Explorative” describes the formative purpose of trying these interactions; it is
not a domain status or a required CLI label. Useful summary content and the value
of each follow-up remain questions for formative use.

### Summary substance and investigation reach

A summary describes the apparent functionality accomplished by the selected module,
not merely its structural role. Labels such as “root module” or “coordinates
submodules” are insufficient on their own. Delegation explains how responsibilities
are divided; it does not replace explaining what the combined work accomplishes.
If the functionality cannot be established, the result identifies that gap rather
than treating a structural label as a sufficient answer.

The selected module defines the question, not a fixed dependency-depth cutoff.
Investigation may follow multiple layers of delegation and inspect related subjects
through PostCode's evidence interface when that can materially improve the account.
A root module may therefore lead to a summary of much of an application's
functionality. Unrelated project functionality remains outside the requested
subject; reachable dependencies are not an exhaustive checklist. A terse result
may require substantial investigation to produce.

The interpreter's investigation policy weighs the expected explanatory value of
further inspection. It continues where additional evidence is likely to materially
improve or clarify the account and stops when that is unlikely to be fruitful.
Consequential remaining gaps are disclosed. This is a behavioral requirement, not
prescribed prompt text; its instructions and implementation are design choices.
The policy complements hard execution bounds rather than replacing them.

## Scope and boundaries

Include all four operations, repeatable follow-ups, evidence inspection, explicit
corrections to the selected or an earlier investigon, Unicode and structured JSON
presentation, and integration with the existing shell and observation lifecycle.
There is no fixed single-follow-up depth. Each operation has bounded execution.

The initial subject is one supported module in the configured project. Source,
qualified mechanical results, and attributed documentation provide the evidence.
The interpreter can acquire more permitted source and inspect interpretation
context while satisfying the selected operation.

Exclude repository-wide summaries, a whole-summary granularity control, arbitrary
user-written questions, general programming tutorials, program mutation, running
the target program, runtime/test execution, Git-history investigation, a GUI,
persistence after shell exit, model-comparison campaigns, local-model deployment,
and a formal ontology of responsibilities or functionality. Reading source does
not establish runtime behavior or author intent. No capability for saving and
resuming interpreter conversations is introduced.

Existing default commands remain unchanged. Explicit module summary is available
in one-shot CLI use and in the shell; follow-ups require a live shell session.
A future default of `summary(project)` is outside this slice. Summarizing a root
module does not implicitly request coverage of every subject in the project.

### Retry and forced regeneration are out of scope

Explicit retry of failed or incomplete interpretation and forced regeneration of
successful results are outside this slice. Retry may be straightforward to invoke,
but introduces outcome eligibility, partial-result reuse, attempt selection, and
additional interaction and verification requirements. Its practical value in early
use is not yet established. Forced regeneration likewise has no established need.

Restarting the shell is the recovery path for a retained failed or incomplete
request, with loss of accumulated investigation context. The CLI documents that
cost. Frequent disruption by transient failures would justify reconsidering retry.
The separate [retry](../../../docs/backlog.md#retry-failed-or-incomplete-interpretation-without-restarting-the-session)
and [successful-rerun](../../../docs/backlog.md#explicitly-rerun-a-successful-interpretation)
backlog entries are candidates, not commitments or prerequisites for this slice.

## Architectural basis

The [module investigation decisions](../decisions/module-investigation-decisions.md)
establish investigons, their composition, investigation provenance, revisions, and fresh per-operation
interpreter dialogues. The accompanying [core concepts](../docs/core-concepts.md)
and [constraints](../docs/architectural-constraints.md) carry the cross-cutting
meaning and invariants.

The adopted [product design](../../../foundation/product-design.md#32-summary-as-initial-view-and-recursive-navigation)
establishes qualified summary and recursive investigation. The existing
[session decisions](../../../docs/decisions/transient-analysis-sessions.md) supply
accumulating immutable records, stable references, transient lifetime, input
invalidation, and command-scoped observations. The
[qualification decisions](../../../docs/decisions/adopt-qualification-and-evaluation-constraints.md)
and [evidence boundaries](../../../docs/decisions/adopt-identity-evidence-and-observation-constraints.md)
continue to apply. No foundation revision is required.

Summary, explain, decompose, and examine are lenses. Summary selects a module;
follow-up lenses select an investigon as their subject, using its prose and
underlying program context to focus the investigation. The projection identifies
both that selection and the retained result. An investigon is a valid subject
in its own right; it is not an entity.

### Evaluation and retained program information

Language analysis and interpretation are parallel producers of qualified program
information in the session record store. Language analysis produces entities,
relationship claims, evidence, and context; interpretation produces investigons,
their supporting context, composition, investigation provenance, and revisions. Shared evidence, qualification,
evaluation-outcome, and storage mechanisms retain their existing meanings. Entities
and investigons do not require a common record kind merely because they share
these features.

Investigation lenses declare their information requirements. Evaluation selects
retained results that satisfy the request, accounts for explicit revisions, and
identifies investigations that must run to supply missing information. It invokes
the interpreter where needed and retains validated results before projection
construction. Projection construction and rendering do not invoke investigation.
The retained-result and explicit-new-attempt policies below determine whether
interpretation is required; newly available context alone does not silently
invalidate a retained interpretation or force another model call.

The interpreter can query supported entities and relationships through that same
evaluation boundary. It is not limited to records already materialized before the
operation began: a query can reuse qualified analysis or request missing mechanical
analysis. Internal queries retain their outcomes and provenance without simulating
additional human CLI commands. This is a domain API, not direct storage-engine
access or a second analysis pipeline.

## Result and navigation behavior

Investigons carry or resolve to:

- prose and a free-form referent description intelligible to a fresh interpreter;
- the originating module context, with optional validated references to more
  specific entities or supported subjects, including captured source regions;
- evidence and narrower qualifications, including consequential missing context;
- generating operation, selected target, and actual method/execution provenance;
- stable session-local identity, fixed composition, and investigation-provenance links.

These are semantic requirements, not a prescribed object layout. Context may be
shared where it remains attributable. The model supplies local references to
known material; PostCode assigns retained identities and validates links. A
free-form string containing an entity ID does not by itself create a navigable
reference. A valid reference establishes a target, not interpretive correctness.

Broad investigons may contain multiple related claims. Qualification must remain
attributable where it differs. The implementation need not atomize every sentence
or store a formal semantic representation of the prose.

Every selectable investigon is displayed with a reference that the human can type
into subsequent CLI commands. Root results and subordinate investigons are both
addressable. References remain valid for the lifetime of the session: later
investigations, new siblings, reordered presentation, and corrections never change
their referents. A historical or superseded investigon remains selectable. Unknown
and cross-session references are explicit selection failures. Exact spelling
(compact IDs, qualified paths, or another scheme) is an implementation choice; a
visible ordinal that shifts when results grow is not a valid persistent reference.

Lookup handles, including path-like selectors, may resolve to zero, one, or several
investigons. The CLI reports missing or ambiguous matches rather than silently
choosing a replacement. A version-distinguishing path such as `1.2a` and `1.2b`
can instead serve as a precise reference if each spelling retains its binding for
the session. UID syntax is not required. Once selection resolves, the request
identifies the exact retained subject independently of the selector's spelling.

The human can select displayed investigons, inspect their retained content and
support without generating a new result, and use any follow-up operation on them.
A follow-up receives the selected prose, referent description, references, and
context, rather than only a module identifier. General conceptual background is
not a separate investigation subject merely because an explanation includes it.

Present each operation's result through a root investigon and selectable subordinate
investigons where useful. The composition tree may be several levels deep and is
fixed when retained. A follow-up produces a separate root and fixed tree, with
provenance linking it to the selected subject; it does not add composition children
to that subject. Retain operation provenance on the whole produced set. Existing subject selection
can navigate to a module; investigon selection uses a distinguishable session-local
reference. Exact syntax, labels, and formatting are implementation choices.

## Retained results and subject inspection

Repeating a summary or follow-up
command displays its retained result, selecting explicit replacements in the
displayed result, rather than invoking the interpreter again. On the first request,
when no attempt is retained for that operation and target, the command runs the
investigation. Repeated requests with a retained partial or failed attempt show
that outcome and any usable result; they do not silently retry. Availability of
more context does not by itself authorize new generation.

A follow-up on a different investigon, including a replacement, is a distinct
request and can still run normally. This boundary does not prevent new
investigation through the four supported operations.

A retained request is identified by operation, selected target, and semantic lens
parameters. Presentation changes do not create a new investigation. The output
identifies whether information was retained or newly generated, which attempt it
comes from, and any explicit replacements selected for display. If the request's
original target has since been revised, its old follow-up result remains available
with that context disclosed; repetition does not secretly investigate the new target.
A new follow-up also targets the exact supplied investigon reference.

Retain explicit
associations between investigons and the subjects they describe. `inspect(subject)`
displays a bounded listing of associated investigons, their operations, qualification,
revision state, and selectable references. It provides access to fuller retained
content, evidence, and originals without inference. Absence of an association means
no retained associated account, not that the subject has no such functionality.
Any omitted associated results are disclosed. Inspection does not generate a missing
summary automatically.

The same `inspect` lens may also accept an investigon reference. This is a candidate
CLI expression of the required exact-result inspection, not another generative
operation: it shows that immutable investigon's prose, referent information,
evidence, composition, investigation provenance, and revision links. A superseded reference shows
the original with its replacement linked, rather than silently selecting the
replacement. The exact inspection command arrangement remains an implementation
choice.

These associations are subject-oriented access to qualified information, not a
silent conversion of interpretation into an intrinsic property of the subject.
Distinguish the subject on which an investigation originated from additional
subjects explicitly described by an investigon, and from subjects merely cited as
evidence. A prose mention alone does not create an association. A module can have
several associated investigons from different investigations, none automatically
more authoritative because it is newer or more frequently retrieved.

An interpreter encountering a known subject can retrieve its
associated investigons from earlier investigations in the same session, beyond
its current chain of prior investigations. Retrieval exposes provenance, evidence links, limitations,
and revision state. It records which prior interpretations were supplied. Repeated
use of an interpretation is not independent corroboration; new claims need an
attributable basis and must not cite a circular chain as independent support.

A view produced by a repeated request selects retained results and explicit revision
relationships. It is a newly constructed projection of the current retained
account, not mutation of the projection or view originally produced. Unrelated
accumulated investigons do not enter the view merely because they exist. Only the
declared operation/target and revision selection, or the subject-association
selection of `inspect`, determine its contents.

### Example navigation journey

Reference spelling below is illustrative; stable selection and the behaviors are
requirements, not a required grammar.

1. `summary M` generates a root and broad investigons with displayed references.
2. `decompose @i7` generates a separate root and finer selectable subparts. Its
   provenance identifies `@i7` as the subject; it does not add children to `@i7`.
3. `examine @i12` discovers that an earlier summary point `@i7` needs correction
   and retains a replacement `@i20` with a reason and supporting evidence.
4. `summary M` displays the retained result with `@i20` marked as a
   replacement of `@i7`, without another model call. Unaffected points retain IDs.
5. `inspect M` exposes associated investigons and their revision relationships.
   Inspecting `@i7` shows the exact original and a link to `@i20`.
6. A repeated `decompose @i7` shows its retained decomposition with a revised-origin
   warning. An explicit new follow-up on the current replacement can produce a
   new decomposition; the older decomposition still names `@i7` as its subject
   and retains its own original composition tree.
7. An investigation of another subject encounters M and retrieves these qualified
   accounts through subject associations rather than requiring a new summary.

## Correction and display of retained results

Any operation can uncover a correction. The interpreter can traverse composition,
investigation provenance, and revision relationships, inspect support, and explicitly identify an earlier
investigon that needs replacement. A correction records the affected investigon,
replacement, reason, and evidence context. A suspected inconsistency without a
supported replacement is recorded as unresolved, not silently promoted to a
replacement.

Original investigons and their composition trees remain intact. When retained
results are displayed again, explicit replacements are primary and marked as
revised, with originals available. The displayed result makes the change apparent:
it identifies the replaced and replacement investigons and makes the correction's
reason and supporting context accessible. The replacement retains its interpretive
qualification; becoming primary does not establish greater certainty. No human
acceptance step is required. Earlier views remain historical results.
Replacement selection in a new view does not rewrite the stored composition tree.
Original subparts remain in that tree; separate investigations based on a corrected
investigon retain their original subject references and disclose its revision where
relevant. Neither relationship silently transfers to the replacement.

A follow-up using a precise reference targets exactly that investigon. If it is superseded,
the CLI warns and displays the replacement's reference without redirecting the request or
requiring confirmation. The user can investigate the historical interpretation or
select the replacement explicitly. Retained request identity uses the operation,
resolved subject identity, and semantic parameters; the two subjects have distinct requests.

Summary redisplay selects explicit replacements and labels them with their own precise references.
Inspection exposes retained history, including superseded investigons and their references.
A precise reference remains bound to its original investigon regardless of display selection.

For the initial slice, a
correction replaces one entire investigon with one new investigon, which may have
subparts. One operation can correct multiple distinct earlier targets. A new
correction must target the current replacement if a prior revision exists; an
attempt to revise an obsolete target or create competing current replacements is
reported as an unresolved conflict. There is no automatic merge or cascading
rewrite. This bounds conflict behavior without preventing ancestor corrections.

## Interpreter execution and evidence access

The domain interpretation boundary accepts operations, subjects, and investigation
context and returns investigons, corrections, and evaluation outcomes. An inner
agent communication boundary handles instructions, messages, tool exchanges,
completion/failure signals, and provider-specific authentication and transport.
Dialogue coordination between them assembles instructions, dispatches tool requests
through PostCode's subject-based APIs, and validates results. The four operations
share these capabilities; interface shapes and module layout remain implementation
choices.

One real hosted implementation is sufficient. The implementing agent
chooses the concrete invocation route, dependency, authentication mechanism, and
supported initial configuration. Astra Light/low is the starting preference;
verify the actual supported setting rather than assuming a UI/API naming mapping.
Document material departures and their reason. Do not build a general provider
registry or comparative benchmark as a prerequisite.

Each new evaluation starts a fresh interpreter session; viewing retained results
does not start one. PostCode supplies an initial
request; the interpreter requests evidence or interpretation context; PostCode
returns it; this dialogue repeats until a structured result or an execution limit.
A fresh operation does not inherit an opaque conversation or hidden memory. The
PostCode session retains evidence and results across operations. An interpreter's
working conversation lives within one operation.

A summary request starts with the module reference and operation instructions.
A follow-up starts with the selected investigon, its prose and referent information,
and references to its evidence and investigation context. This establishes the
subject and objective without prescribing a fixed upfront evidence package.

The interpreter requests source, qualified mechanical results, documentation, and
prior investigons through the shared subject-based interface as needed. Prefetching
likely-needed material is an execution optimization left to implementation. Whether
material is supplied initially or retrieved during the dialogue, it uses the same
acquisition, qualification, coverage, and provenance rules. Actual supplied context
remains attributable; equivalent access rules do not imply identical generated
answers under different context-selection strategies.

Interpreter tools expose supported entities and relationships, including module
exports, dependencies, dependents, and organization membership, with their evidence,
method, coverage, and limitations. These queries use evaluation to reuse retained
results or perform missing mechanical analysis. The interpreter need not reconstruct
established relationships from source; interpreting their role remains separate
from the mechanical claims. Tools also retrieve investigons, their support, and
composition, investigation-provenance, and revision links and subject associations within the session.

The interpreter can request full source for a module reference, or contents for
an organization artifact/documentation reference, not merely human-facing
source-detail excerpts. A subject can map to multiple captured files or regions;
responses identify the supporting captures and actual coverage. Range selection
or content search, if provided, operates on these referenced subjects and artifacts.
Execution limits may require chunking or an explicitly incomplete response, but a
presentation excerpt limit must not silently become an analysis coverage limit.

### Subject-based evidence access

The PostCode subject population is the interpreter's complete program-access
surface. The interpreter navigates existing organization groups, entities,
relationships, and opaque documentation/artifact records, then requests evidence
by subject or artifact reference. It has no independent filesystem-discovery or
path-based file-reading interface. This is completeness of the access surface,
not a claim that every subject's content or analysis is complete or available.

Requests go through the shared evidence-acquisition boundary backed by the session
record store. That boundary resolves established subject-to-source mappings,
returns retained captures, or acquires and retains missing content through the
appropriate analysis/capture mechanism. The store need not itself perform I/O.
An opaque documentation record can therefore be located through organization
before its contents have been acquired. Group membership alone does not establish
that documentation describes a particular module; association retains its own
qualification.

Capture identity, generated-output exclusions, permitted mappings, and filesystem
validity belong to the shared acquisition layer, not a second interpreter-specific
filesystem policy. Content requests must respect that layer's established boundary;
a reference does not by itself authorize an unsupported acquisition. Unavailable
content, unresolved mappings, and incomplete coverage are explicit results, not a
reason to fall back to arbitrary file access. Source remains task data, not
instructions that expand the interpreter's authority. The dialogue has no
unrestricted shell, file mutation, or web-browsing tool.

New acquisitions register captured content and relevant probes with the session's
input-validity machinery. Evidence shown later comes from those captures, not a
new filesystem read. Detectable changes invalidate rather than refresh the session.
The first-observed, non-atomic capture limitation remains visible.

Hosted-service use is intentionally enabled, with disclosure that selected
repository content is transmitted to that service. The enablement and announcement
mechanisms are implementation choices. Deliberately configuring a PostCode-specific
hosted provider can constitute opt-in; an explicit invocation option is another
possibility. A separate per-request confirmation is not required. Configuration
and help make the effect of enablement clear. Existing mechanical commands remain usable without inference
credentials. Missing authentication produces explicit unavailability, not an
invented summary. Credential material does not enter investigons or observations.
Exact setup steps and authentication storage follow the selected integration.

## Bounds, outcomes, and publication

**[proposed P6 — human review before promotion]** Bound model turns/tool requests,
source bytes supplied, elapsed time, and generated output using explicit defaults
chosen and documented by implementation. Report measured usage where available;
unknown cost remains unknown. Bounds constrain execution, not the meaning of the
lens. No automatic paid retry loop or silent provider/model fallback is required.

The outcome distinguishes stopping with sufficient support for the requested
account, stopping because further investigation appears unlikely to be useful,
and stopping because an execution limit is reached. The first two are interpretive
assessments, not proofs of completeness; the last is an execution constraint. A
reported stopping reason does not erase material gaps in the returned account.

A limit, unavailable tool, provider failure, malformed result, invalid reference,
and lack of useful new findings have distinct outcomes. Do not publish streaming
fragments or invalid references as established investigons. A validated, explicitly
partial result may be retained with its outcome; malformed output produces no
accepted interpretation result. Already captured evidence and earlier results
remain usable when the session itself remains valid. Completed generation is not
proof of exhaustive investigation or correct interpretation.

**[proposed P7 — human review before promotion]** Publish each validated result and
its correction links as one coherent batch. Structural validation checks identity,
reference existence, permitted relationships, qualifications, and revision targets;
it does not establish the prose's truth. If a structural defect prevents accepting
the batch, preserve the failure outcome without activating its corrections.
Bounded repair using the same operation budget is an implementation choice.

The shell remains single-operation-at-a-time. Adapt its synchronous executor and
worker handling for asynchronous interpretation, retaining input checks before
publication and after output. Active interruption keeps the existing end-session
behavior; terminate/cancel inference where the chosen provider permits it and
truthfully report limits on remote cancellation or cost. No late response is
published after interruption or invalidation.

Normal command observations include the exact selected target, any superseded-target
warning and displayed replacement reference, operation,
selected retained or newly produced investigons and revisions needed to interpret
the view, prior interpretations retrieved by the interpreter, qualifications,
outcomes, actual output, and available usage. Keep the batch self-contained and
distinguish source sent to inference from source shown to the human. Supplying full
source to the interpreter is analysis-input access and does not emit a human
source-escape event. Retain actual source/context delivery for provenance and
usage accounting. A source-escape observation records source actually disclosed
to the human through the interface, including source excerpts in a displayed result.
Observation files are not restored as operational session state.

Retain explicit request instructions, actual model/configuration identifiers,
method versions, context/evidence IDs delivered during the dialogue, and generated
results for attribution. This does not require access to model-private reasoning.
Exact transcript serialization and whether raw provider envelopes are retained
are implementation choices; secrets must not be recorded.

## Milestones

All milestones are in scope before implementation starts. They verify progress
against the agreed capability, not decide whether the later milestones should be
built. There is no planned usefulness gate after the first milestone that changes
the remaining scope. Formative findings assess the complete slice and inform future
planning. Unexpected findings that invalidate the plan's assumptions still follow
the normal development workflow; that exception is not a planned scope-selection
stage. If a capability requires an earlier usefulness result before committing to
its implementation, it belongs in a separately planned slice.

1. **Terse module summary through the real interpreter boundary.** Establish
   investigon records and references, qualified evidence assembly, bounded tool
   dialogue, async execution, stable user-selectable references, and a usable summary
   in the shell. Repeating the request displays retained results without inference. Include expected
   failure paths and source traceability rather than a prose-only demonstration.
2. **Progressive investigation.** Expose explain, decompose, and examine over the
   same results. Support on-demand context traversal, repeated operations,
   evidence inspection, subject-associated retrieval and inspection, and access to
   additional permitted source.
3. **Corrections and integrated lifecycle.** Exercise ancestor corrections,
   current-versus-historical presentation, preserved composition and prior
   investigation context, invalidation,
   interruption, observations, and formative investigation on the fixed subjects.
   Complete documentation and prepare the integrated review handoff.

Use deterministic interpreter doubles to verify orchestration, but exercise the
real interpreter during each useful end-to-end milestone. Arrange independent
review through the human under the development workflow; do not confuse passing
mocked tests with established interpretive value.

## Verification and formative assessment

### Deterministic behavioral checks

Verify public boundaries and journeys, including:

- broad summary investigons, attributable mixed evidence, unsupported and ambiguous
  module selections, unknown/cross-session references, and preserved qualifications;
- multi-level composition produced in one evaluation; follow-ups produce separate
  roots with subject provenance, without modifying the selected investigon's tree;
- path-like or other lookup handles with zero/one/multiple matches, without silently
  preferring a replacement; version-distinguishing paths, if used as precise
  references, retain their bindings;
- stable CLI selection of roots and subordinate investigons after session growth, changed
  display order, and revision; repeat-display with no model calls; exact historical
  inspection; retained failure/partiality on repetition and documented restart recovery;
- subject inspection and interpreter retrieval of qualified prior investigons,
  association roles, bounded display, no automatic generation, and non-corroborating
  reuse of earlier interpretation across investigations;
- evaluation-driven selection of missing interpretation work, retained-result reuse,
  and interpreter queries that acquire missing mechanical results without changing
  their qualification or generating nested human-command observations;
- full captured source supplied independently of human excerpt limits, explicit
  chunking/coverage, no human source-escape event for interpreter-only reads, and
  correct disclosure observations when source is actually shown to the human;
- fresh sessions per new evaluation with multiple tool exchanges within an operation;
  on-demand composition traversal, prior investigations, reverse subject lookup,
  revision context, and additional source;
- explain/decompose/examine on outputs of each other, including more than one
  follow-up level and no useful finer decomposition or additional finding;
- source acquisition by module reference, multiple source mappings, documentation
  acquisition through organization artifacts, and explicit unavailable content;
  unknown references and arbitrary path requests cannot bypass subject-based access;
- shared acquisition enforces generated-output and validity boundaries; bounded
  omissions, prompt-like repository text, and captured-source inspection preserve
  their qualifications without a parallel interpreter file-reading path;
- correction of the selected investigon and an ancestor, unresolved disagreement,
  obsolete revision targets, preserved old output and composition trees, revised-subject
  warnings on subsequent investigations, and
  precise-reference targeting with supersession warnings and no redirection, distinct
  retained requests for original and replacement subjects, corrected
  retained summary redisplay that visibly identifies changes and preserves
  interpretive qualification, and unchanged historical projections;
- provider unavailability, failures, malformed output, exhausted bounds, usage
  unknown, publication integrity, sink failure, and no inference during inspection;
- input change during asynchronous work, new evidence acquisition, excluded output,
  interruption, and rejection of late results;
- preserved stopping reasons and material limitations for sufficient-account,
  low-expected-value, and execution-limit outcomes, without treating model-reported
  sufficiency as mechanical completeness;
- retained existing mechanical CLI behavior, type checks, and the full relevant
  test suite. Do not assert exact wording from live generative results.

### Formative investigation assessment

**[proposed P8 — human review before promotion]** Use three fixed formative subjects:
PostCode `evaluation`, `thingts/fsm-engine`, and `mesqueeb/merge-anything`. Before
live runs, the implementing agent records revisions, module boundaries, supplied
and accessible documentation, provider compatibility, and evaluator familiarity.
The first two are human-authored/familiar; no human use of merge-anything was
recalled. These are purposeful development subjects, not an unbiased sample or
untouched validation set. If a subject cannot be exercised in the supported
configured-project scope, report the obstacle for human choice rather than
silently replacing an awkward result.

For each subject, record the initial summary and a sequence exercising all three
follow-ups, including a follow-up on a generated investigon. Assess whether:

- summary conveys specific apparent functionality and division of responsibility;
  a root/delegating-module case requires tracing multiple layers to explain the
  work accomplished rather than merely naming its structural role;
- source/context acquisition is relevant to that explanation, with a focused case
  exercising a low-value further-investigation path. Assess the stopping rationale
  and disclosed gaps rather than prescribing an exact read count or prompt;
  contrast this with a hard-limit outcome;
- explanation makes this program more understandable rather than adding generic
  background; decomposition creates useful narrower selection targets;
- examination adds a supported finding, a useful limit, or a candid no-addition
  result rather than rewarding sheer output length;
- consequential claims are traceable, contrary evidence is not ignored, and
  interpretation is not presented as mechanical certainty;
- context retrieval enables correction of earlier results through composition and
  investigation-provenance traversal without erasing earlier results.

Use a controlled retained misinterpretation against unchanged source to exercise
correction explicitly, both with deterministic tests and a live interpreter. Mark
that setup as injected test context, not a natural model error. Do not change source
mid-session to simulate correction; that tests invalidation instead.

Retain exact explicit inputs, outputs, configuration, evidence access, failures,
observed usage, elapsed time, and assessment findings in an appropriate validation
artifact. Prompt revisions are assessed on all three subjects; do not hide a
regression in an aggregate score or replace an inconvenient subject. No broad
prompt/model optimization search is required. The human reviews formative results;
no universal acceptable-cost or usefulness threshold has been established.

## Deliverables and remaining design choices

The delivered capability includes the four operations, stable session-long CLI
references, retained/current and historical viewing, subject-associated investigon
inspection and retrieval, and correction-aware navigation. Retry and forced
regeneration remain outside the slice, with restart recovery documented.
CLI documentation describes these behaviors with examples and documents inference
setup, actual input-change coverage, and provider/cancellation limits. The
architecture overview, README, status, schemas, and applicable implementation
conventions describe the implemented boundaries and lifecycle.

Schemas, record layout, tool signatures, reference spelling, command grammar,
provider setup, numerical limits, and asynchronous worker plumbing remain
implementation choices within the reviewed behavior. The marked choices in this
plan and its decision record remain review items; the package review index collects
them for resolution before promotion.
