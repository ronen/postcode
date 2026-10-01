# Module investigation

Status: approved
Created: 2026-09-24
Updated: 2026-09-29
Superseded by:

## Outcome and use narrative

A human exploring one configured TypeScript project requests a terse summary
of a module, selects a point of interest, and clarifies, decomposes, or examines
it without translating that point back into source locations. The shell retains
the investigation, its evidence, and earlier interpretations. A deeper
investigation can correct an earlier explanation without erasing what was
previously presented.

The retained prose unit is an **investigram**: an immutable, addressable artifact
of program investigation containing a qualified interpretation, with referent
information, evidence context, and provenance. One result has a fixed
composition tree of investigrams. A later investigation produces a separate tree
whose root references the selected subject through investigation provenance.
Neither structure establishes a decomposition of the program into canonical
architectural units.

The human explores the code through these lenses. The investigator gathers
evidence and produces interpretations to support that exploration. Existing
mechanical analyses, such as organization and dependencies, continue to produce
qualified projections. They can supply evidence for investigrams without
themselves becoming investigrams.

This slice implements four public lenses using shared interpretation
infrastructure:

| Lens | Requested information | Observable distinction |
| --- | --- | --- |
| `summarize(module)` | A deliberately terse account of apparent functionality and responsibility, including significant mechanisms, cases, and delegation | Broad, coherent selectable investigrams; no mandatory 5WH template or exhaustive branch inventory |
| `explain(investigram)` | A more understandable account of the selected aspect of this program | Useful clarification and detail omitted for brevity; new findings are not required |
| `decompose(investigram)` | Smaller, tersely described selectable aspects of the selected functionality | More precise focus without requiring a deeper investigation of each aspect |
| `examine(investigram)` | A deeper investigation of the selected aspect | Substantive findings, sharper limitations, corrections, or an explicit report that no useful addition was established |

In this slice, each lens's information requirements map to one investigation
operation. The operations use the shared
[domain interpretation boundary](#investigator-execution-and-evidence-access),
with objectives and input context determined by the behaviors above.

In this plan, a lens is the public projection request; an investigation operation
is the reusable work selected to supply its information. The table specifies the
mapping through the requested information. Internal operation names remain
implementation choices. Investigram provenance records the generating operation;
projections identify the consuming lens.

The functionality investigation supplies this slice's summary content. It does
not define the complete or permanent composition of a summary projection, which
can later combine that interpretation with other qualified information.

For a summary saying that a module “assembles configuration and starts the
application,” decomposition can expose those two activities separately.
Examining configuration assembly can investigate input precedence and
validation. Explanation can clarify what assembly means in this program. All
three expose investigrams that can be selected by any subsequent follow-up lens.
Decomposition may discover new claims while reasoning over existing evidence;
examination may need additional source. Their objectives, not exclusive tool
permissions, distinguish them.

### Summary substance and investigation reach

A summary describes the apparent functionality accomplished by the selected
module, not merely its structural role. Labels such as “root module” or
“coordinates submodules” are insufficient on their own. Delegation explains how
responsibilities are divided; it does not replace explaining what the combined
work accomplishes. If the functionality cannot be established, the result
identifies that gap rather than treating a structural label as a sufficient
answer.

A module need not have one coherent responsibility. A supported account of mixed
responsibilities or an unclear role is a legitimate summary; the investigator
must not invent a unifying purpose merely to make the explanation tidy.

The selected module defines the question, not a fixed dependency-depth cutoff.
Investigation may follow multiple layers of delegation and inspect related
subjects through PostCode's evidence interface when that can materially improve
the account. A root module may therefore lead to a summary of much of an
application's functionality. Unrelated project functionality remains outside the
requested subject; reachable dependencies are not an exhaustive checklist. A
terse result may require substantial investigation to produce.

The investigator's investigation policy weighs the expected explanatory value of
further inspection. It continues where additional evidence is likely to
materially improve or clarify the account and stops when that is unlikely to be
fruitful. Consequential remaining gaps are disclosed. The policy complements
hard execution bounds rather than replacing them.

## Success criteria and completion

Completion requires the four lenses and their agreed behavior to work
through the supported CLI flows, the required automated and behavioral checks to
pass, and the implementation and user documentation to be complete. The
prescribed formative exercise is completed with retained artifacts reporting
semantic findings, limitations, and operational reliability. A blocked required
case remains incomplete unless the human explicitly approves its deferral.

Investigate observed shortfalls enough to distinguish implementation defects
from limitations of the configured investigator. Violations of
implementation-controlled invariants, such as reference validity, conflict
visibility, provenance, and qualification, are defects to address. Poor prose
can also expose a defect, such as omitted required evidence, incorrect operation
instructions, or broken context delivery; the form of the symptom does not
determine its classification.

Generative-content expectations guide interpretation design and formative
assessment. For limitations of the configured investigator, make a bounded,
documented improvement effort and reassess across all three subjects. Record the
chosen adjustment, or why none is justified, and the reassessment evidence. An
adjustment need not be a prompt revision. Persistent shortfalls after that
effort are product findings; they do not automatically expand the slice or
require indefinite tuning. There is no numeric usefulness threshold or
intermediate usefulness gate that changes the agreed scope.

If findings undermine the slice's premise, stop and seek human direction under
the [unexpected-findings
workflow](../../dev/workflow.md#5-unexpected-findings). The human may
authorize a plan revision, further work, or closure with the limitations
recorded. The agent must not dismiss such findings merely because mechanical
checks pass.

At completion review, the human considers the combined formative artifacts and
findings alongside the final integrated review and decides whether the review
gate is sufficient. Conclude the task through the task protocol only after the
required work and verification are satisfied, any required deferrals are
explicitly approved, and the human has accepted the review gate. Preserve
material limitations and follow-up candidates in the account.

## Scope and boundaries

Include all four lenses, repeatable follow-ups, evidence inspection,
explicit corrections to the selected or an earlier investigram, Unicode and
structured JSON presentation, basic per-investigation and session usage
reporting, provider credential setup, and integration with the existing shell
and observation lifecycle. There is no fixed single-follow-up depth. Each
investigation operation has bounded execution. Each operation executes
in its own fresh dialogue; grouping multiple operations into one dialogue is
deferred to a [separate candidate](../backlog.md#consider-grouping-investigation-operations-in-one-dialogue).

The initial subject is one supported module in the configured project. Source,
qualified mechanical results, and attributed documentation provide the evidence.
The investigator can acquire more permitted source and inspect interpretation
context while satisfying the selected operation.

Exclude repository-wide summaries, a whole-summary granularity control,
arbitrary user-written questions, general programming tutorials, program
mutation, running the target program, runtime/test execution, Git-history
investigation, a GUI, persistence after shell exit, model-comparison campaigns,
local-model deployment, and a formal ontology of responsibilities or
functionality. Reading source does not establish runtime behavior or author
intent. No capability for saving and resuming investigator conversations is
introduced.

Existing default command selection remains unchanged. Explicit module summary is
available in one-shot CLI use and in the shell; follow-ups require a live shell
session. A future default of `summarize(project)` is outside this slice.
Summarizing a root module does not implicitly request coverage of every subject
in the project.

### Correction scope and deferred retry controls

Corrections are part of the progressive-investigation workflow being assessed.
Repeated investigation can produce correction chains, conflicting replacements,
and corrections to subordinate accounts, so the slice defines their behavior
together. Explicit retry of retained investigation failures and limit-stop
outcomes, and forced regeneration of successful results, add recovery and
repetition controls that are deferred to separate work.

Communication failures leave no reusable outcome, so another request can run in
the same session through ordinary selection. This supports robustness of the
formative assessments without requiring explicit product retry controls.

Recovery from a retained investigation failure or limit-stop outcome requires
restarting the shell, losing accumulated investigation context. The CLI documents
that cost. The assessment protocol records these failures as findings rather than
automatically restarting to replace them with successful runs.

The separate
[retry](../backlog.md#retry-failed-or-incomplete-interpretation-without-restarting-the-session)
and
[successful-rerun](../backlog.md#explicitly-rerun-a-successful-interpretation)
backlog entries are candidates, not commitments or prerequisites for this slice.

## Architectural basis

[Investigrams and progressive investigation](../decisions/investigrams-and-progressive-investigation.md)
establishes the investigram, lens focus, subject associations, composition,
investigation provenance, and revisions.
[Reference lifetime disclosure](../decisions/reference-lifetime-disclosure.md)
establishes the presentation rule for references that expire before follow-up use.
[Investigator execution and evidence access](../decisions/investigator-execution-and-evidence-access.md)
establishes evaluation integration, fresh per-operation dialogues, access
boundaries, failure outcomes, and usage attribution.
[Investigation operations and lenses](../decisions/investigation-operations-and-lenses.md)
makes investigation work independently reusable through declared requirements
and evaluation selection.
[Facets for subjects](../decisions/facets-for-subjects.md) supersedes the initial
Property/Facet decision, extending facet applicability from entities to subjects
while preserving the other Property/Facet distinctions. The accompanying
[core concepts](../core-concepts.md) and
[constraints](../architectural-constraints.md) carry the cross-cutting
meaning and invariants.

The adopted [product
design](../../foundation/product-design.md#32-summary-as-initial-view-and-recursive-navigation)
establishes qualified summary and recursive investigation. The existing [session
decisions](../decisions/transient-analysis-sessions.md) supply
accumulating immutable records, stable references, transient lifetime, input
invalidation, and command-scoped observations. The [qualification
decisions](../decisions/adopt-qualification-and-evaluation-constraints.md)
and [evidence
boundaries](../decisions/adopt-identity-evidence-and-observation-constraints.md)
continue to apply. No foundation revision is required.

`summarize`, `explain`, `decompose`, and `examine` are lenses. `summarize` selects a module;
follow-up lenses select an investigram as their subject, using its prose and
underlying program context to focus the investigation. The projection identifies
its lens, selected subject, the investigation-operation outcomes used, and the
retained result. Reused outcomes preserve their original generating provenance.
An investigram is a valid subject in its own right; it is not an entity.

### Established foundation

This plan assumes the [foundation-readiness work](foundation-readiness.md) is complete and builds on its established immutable publication, reference identity, output-exclusion, graph, execution and validation boundaries.

Foundation readiness covers the needs of the existing commands. This plan extends those shared foundations with investigation-specific evidence access, dialogue, result acceptance, corrections and usage reporting.

### Evaluation and retained program information

**Evaluation** is an attempt to materialize requested information, as defined in
[core concepts](../core-concepts.md#evaluation). The **evaluation layer** is the
coordinating responsibility established by the
[projection architecture decision](../decisions/initial-projection-architecture-decisions.md#separate-lens-requirements-evaluation-and-projection-construction):
it handles declared requirements, analysis selection, shared work, and qualified
outcomes.

An **investigation evaluation**, also called an interpretation evaluation, is one
execution of one investigation operation in one investigator dialogue.
Citation-index sharing, correction-cause exemptions, the execution guard, the terminal outcome,
and attempt usage are scoped to that execution. A lens request can select work
without merging these scopes across the operations it requires.

Language analysis and interpretation are parallel producers of qualified program
information in the session record store. Language analysis produces entities,
relationship claims, evidence, and context; interpretation produces investigrams,
their supporting context, composition, investigation provenance, and revisions.
Shared evidence, qualification, evaluation-outcome, and storage mechanisms
retain their existing meanings. Entities and investigrams do not require a common
record kind merely because they share these features.

Investigation lenses declare information requirements referring to reusable
domain investigation operations. Request identity comprises the operation,
exact selected subject, and semantic operation parameters, independently of the
consuming lens. Investigation context is supplied when the operation executes.
The evaluation layer selects retained outcomes that satisfy those requirements,
accounts for explicit revisions, and identifies missing operations before
execution. It invokes the domain interpretation boundary for selected work and
applies the outcome-retention policy to the returned outcome. Successful results and their
accompanying corrections are retained atomically before projection construction.
Projection construction and rendering do not invoke investigation. The
outcome-retention policy and retry exclusions below determine
whether interpretation is required; newly available context alone does not
silently invalidate a retained interpretation or invoke the investigator again.

Different lenses can consume the same retained operation outcome when their
requirements have the same [request identity](#request-identity). Reuse preserves
generating provenance;
the consuming lens alone does not determine whether investigation is needed.
Operation selection and projection construction remain separate from the choice
of how many operations an investigator dialogue executes.

The investigator can query supported entities and relationships through that same
evaluation layer. It is not limited to records already materialized before
the operation began: a query can reuse qualified analysis or request missing
mechanical analysis. Internal queries retain their outcomes and provenance
without simulating additional human CLI commands. This is a domain API, not
direct storage-engine access or a second analysis pipeline.

When extending the evaluation layer to support investigation operations, assess
whether an explicit interface or module for the layer would improve its
organization, and which responsibilities belong together. Preserve a clear
separation from lens projection construction and investigator communication.

## Result and navigation behavior

Investigrams carry or resolve to:

- prose and a free-form referent description intelligible to a fresh investigator;
- the originating module context, with optional validated references to more
  specific entities or supported subjects, including captured source regions;
- evidence and narrower qualifications, including consequential missing context;
- a citation index of prior investigrams supplied to the investigator during the
  investigation evaluation;
- generating operation, selected target, and actual method/execution provenance;
- stable session-local identity, fixed composition, and investigation-provenance links.

These are semantic requirements, not a prescribed object layout. Context may be
shared where it remains attributable. The investigator supplies local references to
known material; PostCode assigns retained identities and validates links. A
free-form string containing an entity ID does not by itself create a navigable
reference. A valid reference establishes a target, not interpretive correctness.

Broad investigrams may contain multiple related claims. Qualification must remain
attributable where it differs. The implementation need not atomize every
sentence or store a formal semantic representation of the prose.

An investigram view may present a retained mechanical claim with its existing
qualification when a validated reference identifies that claim. Present it as
the retained claim, with its qualification derived from its evidence and method.
The investigator cannot assign mechanical status to its own prose merely by
citing supporting evidence; synthesis and additional conclusions remain
interpretation.

A decomposition identifies finer aspects without inherently establishing that
they are exhaustive or mutually exclusive. Such claims require their own
support; the number or arrangement of subordinate investigrams does not establish
them.

### Stable references and selection

Every selectable investigram is displayed with a reference that the human can
type into subsequent CLI commands within the same session. Root results and
subordinate investigrams are both addressable. References remain valid for the
lifetime of the session: later investigations, new siblings, reordered
presentation, and corrections never
change their referents. A historical or superseded investigram remains
selectable. Unknown and cross-session references are explicit selection
failures. Exact spelling (compact IDs, qualified paths, or another scheme) is an
implementation choice; a visible ordinal that shifts when results grow is not a
valid persistent reference.

Lookup handles, including path-like selectors, may resolve to zero, one, or
several investigrams. The CLI reports missing or ambiguous matches rather than
silently choosing a replacement. A version-distinguishing path such as `1.2a`
and `1.2b` can instead serve as a precise reference if each spelling retains its
binding for the session. UID syntax is not required. Once selection resolves,
the request identifies the exact retained subject independently of the
selector's spelling.

The human can select displayed investigrams, inspect their retained content and
support without generating a new result, and use any follow-up lens on
them. A follow-up receives the selected prose, referent description, references,
and context, rather than only a module identifier. General conceptual background
is not a separate investigation subject merely because an explanation includes
it.

### Fixed composition and follow-up results

Present each operation's result through a root investigram and selectable
subordinate investigrams where useful. The composition tree may be several levels
deep and is fixed when retained. A follow-up produces a separate root and fixed
tree, with provenance linking it to the selected subject; it does not add
composition children to that subject. Retain operation provenance on the whole
produced set. Existing subject selection can navigate to a module; investigram
selection uses a distinguishable session-local reference. Exact syntax, labels,
and formatting are implementation choices.

## Retained outcomes and inspection

### Retained request outcomes

Repeating a `summarize` or follow-up command displays its retained outcome and, when
present, its result, selecting explicit replacements for display rather than
invoking the investigator again. A result is the accepted root investigram; an
outcome records how the evaluation ended, as defined by the [evaluation outcome
taxonomy](../decisions/investigator-execution-and-evidence-access.md#evaluation-outcomes-and-later-requests).
When no reusable outcome exists for that investigation request, the command runs
the investigation. Retained execution-limit and investigation-failure outcomes
have no result and are displayed without silently retrying. Availability of more
context does not by itself authorize new generation.

#### Communication failures and retained outcomes

An agent-communication failure ends the request and closes its investigator
dialogue with a reported communication/service failure. Keep execution
diagnostics and observations, but no reusable outcome that satisfies or blocks
later request selection. This applies even when the first provider exchange
fails. A later request follows ordinary selection: if no reusable outcome
exists, start a fresh investigator dialogue. PostCode neither detects a repeat
for this purpose nor resumes the failed dialogue. The shell and previously
acquired evidence remain usable subject to normal validity checks. Reject late
responses from the finished attempt; lack of a response does not establish lack
of provider work or cost.

Classification follows failure meaning rather than receipt of a complete
protocol response: transport errors, request timeouts, rate limits, and provider
unavailability are communication/service failures, even after earlier successful
tool exchanges. Provider refusal and unrecovered provider-reported output
truncation are retained investigation outcomes. PostCode guard expiry is always
a limit stop, including during a provider call. Communication failure discards
unaccepted interpretation content; acquired mechanical results and evidence
remain available under normal validity rules.

Runtime authentication rejection is configuration unavailability, with no
reusable investigation outcome. Report unrecognized provider errors as
unclassified communication/service failures with credential-safe diagnostics; do
not infer transience merely from that classification.

Identify spending-limit or quota exhaustion explicitly when reported by the
provider, preserving its error code and credential-safe diagnostic. Such service
unavailability leaves no reusable outcome. Do not label it transient rate
limiting unless the provider's response supports that distinction; expose
uncertainty when the precise restriction cannot be determined.

Communication that completes with malformed output or invalid references instead
produces a retained investigation-failure outcome. Execution-limit stops remain
separately identified retained outcomes. Other investigations can proceed in the
shell, but repetition of these requests redisplays their outcomes under the
existing no-regeneration policy.

#### Request identity

A follow-up on a different investigram, including a replacement, is a distinct
request and can still run normally. This boundary does not prevent new
investigation through the four supported lenses.

A retained investigation request is identified by investigation operation, exact
resolved subject, and semantic operation parameter values. Lens parameters map
to those operation parameters; lens identity and presentation choices are not
part of the retained request's identity. In this slice, compatible reuse means
equality of those components. Original and replacement investigrams remain
distinct subjects.

Request-level input context in the
[operation/lens decision](../decisions/investigation-operations-and-lenses.md)
would be expressed through explicit request parameters; this slice has no separate
context-selection parameter.
Supplied investigation context is an execution input, recorded in provenance and
citation indexes as applicable, rather than a request-identity component.
Accumulating evidence, corrections, or associated investigrams does not turn a
repeated request into a new one. Presentation changes do not create a new
investigation. The output identifies whether information was retained or newly
generated, which attempt it comes from, and any explicit replacements selected
for display. If
the request's original target has since been revised, its old follow-up result
remains available with that context disclosed; repetition does not secretly
investigate the new target. A new follow-up also targets the exact supplied
investigram reference.

### Subject inspection and associations

Retain explicit associations between investigrams and the subjects they describe.
`inspect(subject)` displays a bounded listing of associated investigrams, their
operations, qualification, revision state, and selectable references. It
provides access to fuller retained content, evidence, and originals without
inference. Absence of an association means no retained associated account, not
that the subject has no such functionality. Any omitted associated results are
disclosed. Inspection does not generate a missing summary automatically.

The investigram listing in `inspect(subject)` answers which retained investigrams
explicitly describe the subject in the current session. Its contents depend on
session investigation history: later associated investigrams and corrections can
change the listing. Selection uses validated associations, not incidental
mentions or evidence citations. The mechanical portion of inspection retains its
existing determinism guarantee; that guarantee does not apply to the generated
content of associated investigrams.

The `inspect` lens accepts an investigram reference and shows that immutable
investigram's prose, referent
information, evidence, composition, investigation provenance, and revision
links. A superseded reference shows the original with its replacement linked,
rather than silently selecting the replacement. Exact CLI syntax remains an implementation choice.

These associations are subject-oriented access to qualified information, not a
silent conversion of interpretation into an intrinsic property of the subject.
Distinguish the subject on which an investigation originated from additional
subjects explicitly described by an investigram, and from subjects merely cited
as evidence. A prose mention alone does not create an association. Replacement
associations are independent of composition placement: preserve association with
the subject whose account is corrected, and explicitly attribute any other
described subjects. Do not blindly inherit all associations from the original. A
module can have several associated investigrams from different investigations,
none automatically more authoritative because it is newer or more frequently
retrieved.

An investigator encountering a known subject can retrieve its associated
investigrams from earlier investigations in the same session, beyond its current
chain of prior investigations. Retrieval exposes provenance, evidence links,
limitations, and revision state. It records which prior interpretations were
supplied. Repeated use of an interpretation is not independent corroboration;
new claims need an attributable basis and must not cite a circular chain as
independent support.

A view produced by a repeated request selects retained results and explicit
revision relationships. It is a newly constructed projection of the current
retained account, not mutation of the projection or view originally produced.
Unrelated accumulated investigrams do not enter the view merely because they
exist. Only the consuming lens's requirements, selected subject and revision
selection, or the subject-association selection of `inspect`, determine its
contents.

### Example navigation journey

Reference spelling below is illustrative; stable selection and the behaviors are
requirements, not a required grammar.

1. `summarize M` generates a root and broad investigrams with displayed references.
2. `decompose @i7` generates a separate root and finer selectable subparts. Its
   provenance identifies `@i7` as the subject; it does not add children to `@i7`.
3. `examine @i12` discovers that an earlier summary point `@i7` needs correction
   and retains a replacement `@i20` with a reason and supporting evidence. The
   reporting view shows the target, replacement reference, reason, and support access.
4. `summarize M` displays the retained result with `@i20` marked as a
   replacement of `@i7`, without invoking the investigator again. Unaffected points
   are displayed unchanged.
5. `inspect M` exposes associated investigrams and their revision relationships.
   Inspecting `@i7` shows the exact original and a link to `@i20`.
6. A repeated `decompose @i7` shows its retained decomposition with revised-subject
   disclosure. An explicit new follow-up on the current replacement can produce a
   new decomposition; the older decomposition still names `@i7` as its subject
   and retains its own original composition tree.
7. An investigation of another subject encounters M and retrieves these qualified
   accounts through subject associations rather than requiring a new summary.

## Correction and display of retained results

Any operation can uncover corrections or unresolved inconsistencies. Apply the
[correction
semantics](../decisions/investigrams-and-progressive-investigation.md#record-explicit-corrections-without-rewriting-earlier-interpretation):
investigrams carry these as immutable accompanying content. Replacements are
constructed through corrections, with composition trees disjoint from the
reporting tree, and may themselves carry corrections. Every target must predate
acceptance of the operation result; all new content is validated and accepted
together.

Conflicting corrections, including corrections to already superseded targets,
are retained without invalidating an otherwise valid result. When showing one
account, select the endpoint produced by the most recently accepted correction
across all reachable correction branches, marking unresolved conflicts. Recency
is only a display heuristic. A presentation may instead show attributed excerpts
and references as a conflict overview; it does not synthesize a new
interpretation. `inspect()` exposes all conflicting accounts, relationships, and
the primary selection. Bounded listings disclose omissions and provide access to
the remainder.

The reporting view lists accompanying corrections with targets, replacement
references, reasons, and access to supporting context. Unresolved
inconsistencies are visible through inspection of both reporting and affected
investigrams and flagged on redisplay. Session-derived facets such as superseded,
supersedes, conflicting, and needs reconsideration expose correction relationships
and their consequences without mutating investigrams.

Redisplay substitutes corrected children under an old root, annotated as
updates. A corrected root instead supplies its own composition. Disclose further
corrections in displaced trees with references, without splicing their children
into the new tree or implying those corrections were incorporated. Both ancestor
and descendant may be corrected in one operation. Original composition and
historical views remain unchanged; presentation substitution creates no
composition relationship.

Exact references continue to select their original investigrams. Follow-ups on a
superseded subject warn and identify replacements without redirecting or
requiring confirmation. Repeated follow-ups display their retained results with
revised-subject context; they do not investigate a replacement implicitly.
Original and replacement subjects identify distinct retained requests.

### Citation indexes and needs reconsideration

Implement the [citation and reconsideration contract](../decisions/investigrams-and-progressive-investigation.md#record-citation-exposure-and-derive-reconsideration-status).
Construct citation indexes from investigram context actually supplied to the
investigator, conservatively shared across investigrams produced by an
investigation evaluation. Any substantive content, including excerpts and
descriptive listings,
creates a citation; identifiers
alone do not. Correction eligibility requires complete retained prose, referent
information, and qualifications, with no omitted or truncated elements. Delivery
can accumulate across exchanges. Retrieval may extend beyond the selected
subject's composition or provenance chain.

Context delivery means PostCode supplying content to the investigator, initially
or in context responses, at any point in the investigation evaluation. Later
context trimming or summarization does not erase that exposure. It does not
guarantee continued internal retention or comprehension. Preservation or re-supply
during PostCode-managed trimming is an implementation choice.

Derive "needs reconsideration" through direct and transitive citations when
context is corrected. Display the warning without suppressing the account.
Preserve the causal graph and expose causes within bounds in inspection and
investigator retrieval, with access to further detail. No full-path presentation
or enumeration is required. Revised-subject disclosure presents the same
reconsideration cause, when applicable, rather than a duplicate warning. Keep
citation indexes and original content immutable. Warnings do not trigger
regeneration or change exact selection. This slice has no explicit reconsideration capability;
[explicit
reconsideration](../backlog.md#reconsider-investigrams-after-context-corrections)
is deferred. Another investigation does not silently clear an earlier account.

If B corrects A, B's citation index necessarily includes A. Exempt every
investigram produced by an investigation evaluation from each correction cause
that evaluation
produced or received in full. For each cause, a non-exempt investigram needs
reconsideration if it cites the target or an investigram needing reconsideration
for that cause. Exemption applies at the investigram on every path; later citers
can still inherit the cause through other, non-exempt citations. Other
correction causes remain independent, and earlier investigrams' warnings are not
cleared.

When supplying corrected investigrams to the investigator, provide the exact
requested investigram together with correction notices, replacement accounts,
reasons, chains, and conflicting alternatives. Record actual delivery and disclose omissions. Record
complete correction-context delivery per correction identity: both the target's
and replacement's own prose, referent information, and qualifications, plus
correction reasons and qualifications. Their subordinate composition trees are
not required for completeness. A subsequent correction of the replacement is a
separate cause; it does not invalidate completeness for the earlier correction.
Partial delivery does not qualify for exemption.

## Investigator execution and evidence access

The domain interpretation boundary accepts an investigation request, its subject,
and investigation context,
and returns an evaluation outcome, carrying a result when accepted. The evaluation
layer and session handling apply retention and reuse policy to
those outcomes. An inner agent communication boundary handles instructions,
messages, tool exchanges, completion/failure signals, and
provider-specific authentication and transport. Dialogue coordination between
them assembles instructions, dispatches tool requests through PostCode's
subject-based APIs, and validates results. The investigation operations share these
capabilities; interface shapes and module layout remain implementation choices.

The authorized milestone-3 addition supports two explicitly selected OpenAI
routes: API-key billing and Sign in with ChatGPT with optional ChatGPT plan usage.
There is no silent fallback between them. The implementing agent chooses the
concrete CLI commands, dependencies and supported initial configuration, subject
to the credential and subscription requirements below. OpenAI's GPT-6 Sol with medium reasoning effort is the
starting preference; verify the available model identifier and supported
setting. Record the provider and dependency choices and their rationale in the
task record; selection remains delegated and does not require a separate
approval pause. Document material departures and their reason. Do not build a
general provider registry or comparative benchmark as a prerequisite.

The human's Ollama trial of qwen3.6:27b on the development machine was
reported too slow for practical use, motivating the hosted starting point.
That observation does not establish the performance of other local configurations.

### Per-operation dialogue and context

Each new interpretation evaluation starts a fresh investigator dialogue; viewing
retained outcomes does not start one. PostCode supplies the investigation
instructions and initial context; the investigator makes context requests for
evidence or prior interpretation; PostCode supplies context responses;
this dialogue continues until the investigator submits a result for acceptance or
execution ends. A fresh operation does not inherit an opaque conversation or
hidden memory. The PostCode session retains evidence, results, and outcomes
across operations. An investigator's working conversation lives within one
operation.

The operation selected by `summarize` starts with the module reference and its
instructions. An operation selected by a follow-up lens starts with the selected
investigram, its prose and referent information, and references to its evidence
and investigation context. This
establishes the subject and objective without prescribing a fixed upfront
evidence package.

The investigator requests source, qualified mechanical results, documentation,
and prior investigrams through the shared subject-based interface as needed.
Prefetching likely-needed material is an execution optimization left to
implementation. Whether material is supplied initially or retrieved during the
dialogue, it uses the same acquisition, qualification, coverage, and provenance
rules. Actual supplied context remains attributable; equivalent access rules do
not imply identical generated answers under different context-selection
strategies.

Investigator tools expose supported entities and relationships, including module
exports, dependencies, dependents, and organization membership, with their
evidence, method, coverage, and limitations. These queries use the evaluation layer to
reuse retained results or perform missing mechanical analysis. The investigator
need not reconstruct established relationships from source; interpreting their
role remains separate from the mechanical claims. Tools also retrieve
investigrams, their support, and composition, investigation-provenance, and
revision links and subject associations within the session.

The investigator can request full source for a module reference, or contents for
an organization artifact/documentation reference, not merely human-facing
source-detail excerpts. A subject can map to multiple captured files or regions;
responses identify the supporting captures and actual coverage. Range selection
or content search, if provided, operates on these referenced subjects and
artifacts. Execution limits may require chunking or an explicitly incomplete
response, but a presentation excerpt limit must not silently become an analysis
coverage limit.

### Subject-based evidence access

The PostCode subject population is the investigator's complete program-access
surface. The investigator navigates existing organization groups, entities,
relationships, and opaque documentation/artifact records, then requests evidence
by subject or artifact reference. It has no independent filesystem-discovery or
path-based file-reading interface. This is completeness of the access surface,
not a claim that every subject's content or analysis is complete or available.

Requests go through the shared evidence-acquisition boundary backed by the
session record store. That boundary resolves established subject-to-source
mappings, returns retained captures, or acquires and retains missing content
through the appropriate analysis/capture mechanism. The store need not itself
perform I/O. An opaque documentation record can therefore be located through
organization before its contents have been acquired. Group membership alone does
not establish that documentation describes a particular module; association
retains its own qualification.

Capture identity, generated-output exclusions, permitted mappings, and
filesystem validity belong to the shared acquisition layer, not a second
investigator-specific filesystem policy. Content requests must respect that
layer's established boundary; a reference does not by itself authorize an
unsupported acquisition. Unavailable content, unresolved mappings, and
incomplete coverage are explicit tool responses, not a reason to fall back to arbitrary
file access. Source remains task data, not instructions that expand the
investigator's authority. The dialogue has no unrestricted shell, file mutation,
or web-browsing tool.

New acquisitions register captured content and relevant probes with the
session's input-validity machinery. Evidence shown later comes from those
captures, not a new filesystem read. Detectable changes invalidate rather than
refresh the session. The first-observed, non-atomic capture limitation remains
visible.

### Hosted-service enablement

Hosted-service use is intentionally enabled, with disclosure that selected
repository content is transmitted to that service. The enablement and
announcement mechanisms are implementation choices. Deliberately configuring a
PostCode-specific hosted provider can constitute opt-in; an explicit invocation
option is another possibility. A separate per-request confirmation is not
required. Configuration and help make the effect of enablement clear. With
investigation disabled, existing mechanical commands remain usable without
inference credentials. Enabled investigation with unsatisfied prerequisites
fails preflight, even if the intended shell commands are mechanical. Check
prerequisites that can be checked during project opening, before starting the shell, and
apply the same preflight to one-shot investigation. Report failures clearly enough
for a human or assessment agent to distinguish configuration unavailability from
runtime failure. Do not silently substitute mechanical-only output for a failed
investigation.
Credential material does not enter investigrams or observations. Exact setup
steps and authentication storage follow the selected integration.

### Credential setup for live inference

The human's 2026-09-30 authorized addition replaces the pending API-key-only
setup handoff with project-independent browser Sign in with ChatGPT. Keep the
API-key option available. Implement the current official local/public-client
OAuth protocol, validate identity and granted plan permission, preserve stable
host and account/client registrations, and store credentials in protected storage.
Provide credential-safe status, account selection and sign-out. Persist sign-in
across invocations, rotate refresh tokens atomically with cross-process renewal
coordination, and do not sign out on ordinary process exit. A missing plan grant
must not silently enable API billing. Do not inspect or reuse Codex credentials.

Implement the subscription Responses streaming and namespaced-tool contract as
a distinct transport configuration. Only completed explicit submissions proceed
to domain validation. Preserve cancellation, execution guards, usage attribution
and the existing no-automatic-inference-retry policy; credential renewal is a
separate lifecycle operation. The human selected `gpt-5.6-sol` with medium
reasoning for the ChatGPT-plan assessment after the account did not list
`gpt-6-sol`. Verify it through that route and hold it fixed throughout the pass.
Do not switch to Astra for disappointing results; report findings for human
consideration. The human rationale preserves a reasonably capable, moderately
priced starting point; interpretive sufficiency remains to be assessed. Any
further substitution needs a human choice.

When implementation and offline verification are ready, pause with the exact
sign-in command for the human's own terminal. After they report readiness, run
the connection check and continue the authorized assessments using the ChatGPT
plan route. Interactive reauthorization requires another human setup pause.
Do not purchase credits, enable automatic purchases or alter provider spending
settings. Materially broader eligibility or protocol requirements require human
direction before expansion. The accepted [authentication/billing decision](../decisions/hosted-authentication-and-billing.md)
records this scope addition.

Prefer the OS credential store for provider credentials, with PostCode
retrieving them at runtime. The human supplies credentials through a separate
setup flow, not through the coding or assessment agent's conversation. Keep
credential values out of agent-visible commands, output, prompts, logs, and
assessment artifacts. Report authentication availability and failures without
exposing secrets.

At the credential-setup handoff, the implementing agent presents the selected
provider, invocation and repository-content transmission route, added dependencies,
and rationale for those choices, together with the credential mechanism, supported
platforms, setup steps, and access guarantees and limitations. The human sees this
concrete integration before configuring access for live inference or assessment.
Integration selection remains delegated; this uses the existing credential-setup
pause rather than a separate selection-approval gate. Provider-specific storage
and authentication details remain implementation choices. Document expiration,
revocation, and any refresh requirements; credential storage alone does not
remove those concerns. Subsequent assessment runs use the configured mechanism
without asking the human to disclose credentials to an agent.

If the selected platform lacks the credential mechanism or secure credential
access is unavailable, report configuration unavailability. Do not silently fall
back to a mechanism that exposes credential values to the coding or assessment
agent. A cross-platform credential abstraction and a fallback mechanism are not
required for this slice.

Avoid claiming enforced isolation merely because credentials use an OS store. An
agent able to execute commands under the same OS account may have access
equivalent to PostCode's. Explain that limitation before the human supplies
credentials; stronger isolation requires a mechanism that actually restricts
credential access, such as a separately authorized broker.

During setup, document whether the invocation route incurs separate API charges
and confirm the provider's available spending controls and their enforcement
behavior. Do not assume a subscription covers API use or that an alert is a hard
cap. No separate spending allowance is imposed on the formative exercise in this
slice; retain available usage information and revisit budgeting if observed
usage makes it a concern.

## Bounds, outcomes, and result acceptance

Each new investigation evaluation has a finite runaway-containment guard
covering the entire investigator dialogue and work triggered through its tools,
including mechanical analysis. Implementation chooses and documents practical
bounds, such as elapsed time, dialogue/tool-call count, and input/output volume.
The guard is a usability backstop against uncontrolled continuation, not a
spending budget or an attempt to optimize the amount of useful investigation.

Reaching the guard before result submission produces an explicit stopped outcome
with the reason and no investigram. No investigator turn continues beyond the guard
to finish or submit a result. Cancellation coverage and delays in
interrupting in-flight provider or mechanical work are disclosed; the guard does
not guarantee immediate termination or a monetary ceiling. It applies to hosted
and future local inference alike. Bounds constrain execution, not the lens
question.

The human-authorized milestone-3 correction uses private short, exact references
at the hosted communication boundary. Canonical IDs and domain validation stay
unchanged. Translation is structural, including nested result and evidence-request
fields; it never rewrites source or prose. Reference availability remains distinct
from evidence exposure. Captures preserve actual wire inputs and reference
resolution, and transport instructions state that the character guard measures
canonical domain inputs and decoded replies, not the compact wire representation.
The authorized follow-up is one fixed reassessment of the same three upstream
subjects and documentation fixture, one attempt each, without extra retries or
model/configuration changes. Earlier failed captures remain assessment evidence.

Consider a soft threshold inside the guard that asks the investigator to finish
with available evidence, or supplying remaining-limit information during the
dialogue. These are implementation recommendations, not required mechanisms;
any wrap-up or repair remains within the guard. A soft threshold helps the
investigator reach submission before the hard stop; it neither stops execution nor
creates a special result category. Verify the selected approach,
including production of an accepted result within normal execution limits.

User-set spending or resource allowances and allowance-based admission checks
remain outside this slice and are recorded as [budgeting
support](../backlog.md#investigation-usage-and-budgeting-support).
Basic usage reporting is included; it does not require pricing tables, provider
administration credentials, or billing queries in PostCode. No silent
provider/model fallback is required.

### Outcomes and result acceptance

Use the [evaluation outcome
taxonomy](../decisions/investigator-execution-and-evidence-access.md#evaluation-outcomes-and-later-requests).
A retained outcome carries either an accepted result or a failure/stop report.
Communication/service and configuration failures leave no reusable outcome.
Diagnostics and usage remain separately attributable. Unavailable content from
an individual evidence request is normally a qualified tool response the
dialogue can continue past, not a terminal investigation outcome. Investigation
coverage and the investigator's judgment about whether further work would be
useful are expressed in prose. A limited investigation can yield an ordinary
valid result. Completed generation is not proof of exhaustive investigation or
correct interpretation.

Epistemological qualifications remain separately identifiable and attributable
to the accounts they qualify. Their wording may be free-form; PostCode preserves
and exposes their association without mechanically interpreting their meaning.
Coverage limitations belong in those qualifications when they materially affect
how a claim should be understood. Investigator-written qualifications can limit or
caveat an account but cannot promote its epistemological status. PostCode
derives that status from method and evidence; wording such as "established from
source" does not confer mechanical status. Validation checks required
qualification presence, structure, and attribution, not the truth of the
wording.

Transmission of result content from the investigator and its assembly are
dialogue-protocol choices: content can arrive in one message or across multiple
exchanges. An assembled result is ready for acceptance only when the dialogue
protocol establishes that the investigator has submitted it for that purpose. A
structurally valid intermediate tree alone is insufficient. Submission does not assert exhaustive investigation, and bounded
repair may follow. The submission mechanism is an implementation choice.
Submission before the guard stops execution transitions the result to ordinary
whole-result validation. If validation fails, the implementation may request
repair within the same dialogue, subject to the execution guard. A guard stop
before submission retains a stopped outcome without an investigram; reject
submissions arriving after the stop. Communication failure still discards
unaccepted interpretation content under its separate failure policy. Already
captured evidence and earlier accepted results remain usable when the session
itself remains valid.

Provider-reported truncation of an exchange may be recovered through
continuation or repair within the same evaluation's limits, as an implementation
choice. Recovered content still requires submission and whole-result validation.
If recovery ends unsuccessfully, classify its cause under the outcome taxonomy:
unrecovered truncation is an investigation failure unless a guard stop or
communication/configuration failure ended recovery.

Accept the submitted root investigram, including its composition and accompanying
corrections, as a unit at the domain interpretation boundary after validation
succeeds. Return the accepted result in the outcome; the evaluation layer and
session handling retain the result and its corrections atomically. Correction
relationships take effect in the session on retention, independently of display.
Atomic acceptance and retention do not require the investigator to transmit the
result in a single exchange; individual dialogue exchanges do not independently
retain investigrams or apply corrections.
Validation checks identity, reference existence, permitted relationships,
qualifications, and revision targets predating this result. Conflicting
corrections are valid retained content, not structural validation failures.
Validation does not establish the prose's truth. Optional repair also applies to
corrections targeting investigrams whose required content was not supplied to the
investigator. If that validation error remains unrepaired, reject the entire
submission and classify the outcome by the taxonomy, preserving any guard stop or
communication/configuration failure that ended repair. No correction takes
effect from a rejected submission. Acceptance is distinct from displaying a
view, which remains subject to the session-validity checks below.

### Asynchronous execution and interruption

The shell remains single-command-at-a-time. Support asynchronous interpretation,
retaining input checks before publication and after output. Active interruption
keeps the existing end-session behavior; terminate/cancel inference where the
chosen provider permits it and truthfully report limits on remote cancellation or cost. No late response is
published after interruption or invalidation.

## Basic inference usage reporting

PostCode exposes provider-reported usage for each investigation attempt and
totals for the current session, in both human-readable and structured output.
Retain model, provider, reported units, and relevant usage categories, including
input/output, cached input, and reasoning tokens where supplied. Preserve
category relationships so subsets such as reasoning tokens are not added again
to inclusive output totals. Keep unlike units and model/provider breakdowns
distinguishable. Exact report commands and formatting are implementation
choices; session totals remain available without issuing another investigation,
including after a failed request and before shell exit. One-shot investigations
expose their own usage.

Preserve provider-reported usage as it becomes available, independently of
disposable investigation and session state. Interruption or invalidation ends
the session without erasing usage already recorded. Final reporting and
observations include available attempt and session totals and identify calls
whose usage was not obtained. The recording and reporting mechanisms remain
implementation choices.

Count actual provider calls once, including calls from unsuccessful
investigations where usage was returned. Repeated display of retained outcomes
does not add usage; attribute the original usage separately from any new work.
Communication failures do not erase recorded usage. Identify
attempts or calls whose usage is missing, and label accumulated figures as
reported totals with incomplete coverage when appropriate. Unknown usage is not
zero; PostCode does not claim that reported totals equal billed usage,
especially after interrupted or failed communication. Reporting never triggers
inference or changes request selection.

## Observations and execution provenance

Normal command observations identify the consuming lens, the investigation
operations executed and outcomes selected, and the exact selected target. They
include any superseded-target warning and displayed replacement reference,
selected retained or newly produced investigrams and revisions needed to
interpret the view, prior interpretations retrieved by the investigator,
qualifications, outcomes, actual output, and available usage. Keep the batch
self-contained and distinguish source sent to inference from source shown to the
human. Supplying full source to the investigator is analysis-input access and
does not emit a human source-escape event. Record the source and context supplied
to the investigator for provenance and usage accounting. A source-escape
observation records source actually disclosed to the human through the interface,
including source excerpts in a displayed result. Observation files are not restored as operational session
state.

Retain explicit request instructions, actual model/configuration identifiers,
method versions, IDs of context and evidence supplied to the investigator, and
generated results for attribution. Record citation indexes and per-correction
context completeness in observations and expose them through structured
inspection output so reconsideration causes and exemptions can be audited.
This does not require access to model-private
reasoning. Exact transcript serialization and whether raw provider envelopes are
retained are implementation choices; secrets must not be recorded.

## Risks and uncertainties

| Risk or uncertainty | How and when it is addressed |
| --- | --- |
| Interpretation quality and generative variation | The implementing agent assesses these in milestones 3–5, records limitations, and makes [bounded improvements](#success-criteria-and-completion). The human considers the evidence at milestone and final reviews. [Assessment runs and variation](#assessment-runs-and-generative-variation) define the comparison limits. |
| Provider, credential, and assessment-tool availability | The implementing agent verifies the concrete integration and [assessment tooling](#assessment-tooling-and-artifact-lifecycle) before live assessment; the human configures credentials after the [setup disclosure](#credential-setup-for-live-inference). |
| Usage, cost, and reliability | Record [usage](#basic-inference-usage-reporting) and failures throughout assessment, including incomplete usage after interruption. Report [assessment costs](#assessment-usage-and-cost-report) and escalate obstacles under the [recovery policy](#assessment-failure-recovery-and-reliability). |
| Recovery loses accumulated context | Retained investigation failures and limit stops require restarting the shell to attempt the request again. Record the impact on formative sequences under the [recovery policy](#assessment-failure-recovery-and-reliability); the [retry candidate](../backlog.md#retry-failed-or-incomplete-interpretation-without-restarting-the-session) tracks future recovery within a session. |
| Correction complexity and usefulness | [Deterministic checks](#corrections-and-conflicts) verify the mechanics; milestone 5 assesses correction-aware views and the burden of reconsideration warnings through the [formative assessment](#investigation-sequences-and-assessment-targets). |

## Milestones

At the end of each milestone, prepare a committed milestone-specific review
handoff and pause for independent review arranged by the human under the
development workflow. Resolve findings and obtain the human's direction before
starting the next milestone. After the milestone-5 review is complete, prepare a
separate integrated review handoff and pause for final review and the completion
gate. The integrated handoff may reference earlier milestone evidence; preparing
it does not itself require rerunning completed checks.

The milestone-end gates do not replace the development workflow's provision for
[intermediate review](../../dev/workflow.md#intermediate-review) when complexity
warrants it.

Handoffs for milestones with live assessment evidence (3–5), and the integrated
handoff, identify that evidence and instruct the reviewer to assess it without
independently rerunning live assessments.
The reviewer independently examines the pinned source underlying consequential
claims and compares its own analysis with the generated accounts, source-grounded
reference material, and assessment findings. Review covers result quality and
usefulness as well as adherence to the assessment protocol. Report disagreements,
unsupported conclusions, and material omissions with source evidence and any
remaining uncertainty.
Reviewers may rerun deterministic tests and offline adapter checks. If additional
live evidence is needed, they report the gap and request human direction.

The four lenses exercise complementary uses of shared interpretation
infrastructure. Their combined value, including progressive investigation, is
what this slice assesses; summary quality alone is not the basis for deciding
whether to implement the remaining lenses.

Milestone 1 implements interpretation execution and the full result contract
using the double. Milestone 2 integrates returned outcomes with the evaluation layer,
session handling, and the shell. Milestones 3–4 exercise live summary and
follow-up lenses. Milestone 5 adds correction-aware selection and display,
conflict handling, and reconsideration propagation.

Use deterministic investigator doubles in the regular test suite. The double and
real adapter implement the same agent communication contract. Tests exercise
PostCode's actual dialogue coordination, evidence handling, validation, and
retention, with scripted evidence requests and submissions at that boundary.
Retain the double as reusable test infrastructure. Run shared contract checks
against both implementations where feasible, using representative provider
responses to exercise the real adapter without live inference.
Before retaining captured provider responses as test fixtures, remove credential
values and account identifiers, and retain third-party source content only as
permitted by its license.

Live inference requires credentials and consumes limited provider usage, so
routine tests remain credential-free. Exercise the real investigator in the
formative assessments in milestones 3–5. A small, separately invoked live
integration check may verify the provider connection; exclude it from routine
test runs. The double and offline adapter checks do not establish live provider
behavior or interpretive value.

### Milestone 1: Domain interpretation execution

Begin by assessing the evaluation layer's organization as described under
[Evaluation and retained program information](#evaluation-and-retained-program-information),
including the entry points for investigator evidence queries. Record the chosen
organization and rationale in the task record, and reflect material responsibility
or boundary changes in `docs/architecture/`. Necessary restructuring of existing
mechanical evaluation is in scope while preserving existing behavior.

Implement the domain interpretation boundary with lens-independent operation
requests, using an investigator double at the agent communication boundary.
Exercise real dialogue coordination, qualified evidence requests, bounded
asynchronous execution, submission and validation, and returned outcomes. Verify handling of cancellation and
invalidation signals, rejection of late results, and attempt usage attribution
with synthetic provider-reported usage through domain-level tests.

Exercise the full result structure: the root and subordinate investigrams,
qualifications, referent information, evidence context, citation indexes, and
accompanying corrections, including corrections carried by replacements.
Verify whole-result validation and the returned outcomes. Conflicting corrections
are valid result content; conflict-aware selection and presentation arrive in
milestone 5.

Provide the full program-evidence interface: source acquisition by subject
reference, qualified entity and relationship queries, and organization and
documentation access. Exercise navigation across modules and multiple layers of
delegation through the double.

Handle investigator requests for investigram context by supplying responses
through the context and evidence interfaces. Record which content was supplied
to the investigator and whether correction context was complete. Use fixtures
representing earlier investigrams, including corrected ones, to exercise these
context exchanges and validate the resulting outcomes. Broader investigram
discovery and navigation arrive in milestone 4.

The milestone review covers the domain and agent-communication contracts,
context requests and responses, complete-result validation, and returned
outcomes. Include the recorded evaluation-layer organization and any restructuring
of existing mechanical evaluation, with regression-test evidence that existing
behavior is preserved. The working domain capability is demonstrated through
behavioral tests without requiring new CLI behavior.

### Milestone 2: Shell and session integration

Integrate investigation-operation requirements and outcomes with the evaluation
layer and session handling. Select reusable outcomes and missing operations before
execution, independently of projection construction. Apply
retention policy, retain successful results and their accompanying corrections
atomically, establish stable session references, and reuse retained outcomes.
Exercise successive evaluations in one session, including supplying earlier
retained investigrams to the investigator in context responses and retaining
later results that correct them.

Connect investigation to the shell. Demonstrate a complete `summarize`
journey using the investigator double, including stable references, human and
JSON views, retained-outcome reuse, expected failure paths, and source
traceability. Implement and verify one-shot `summarize` with the double as well,
including its output, failure behavior, and usage reporting.
Implement `inspect(investigram)` by exact reference to expose
retained content and support, including accompanying corrections. Display the
result's accompanying corrections with selectable references to their targets
and replacements.

Verify asynchronous coordination, active interruption ending the session,
input invalidation, rejection of late results, observations, and attempt and
session usage reporting end to end, including final usage reports and
observations after interruption or invalidation. Keep these tests credential-free
and use synthetic provider-reported usage. The milestone review checks integration of
the domain lifecycle with the shell and session lifecycle.

Drive these journeys through the in-process CLI entry point with injected input
and captured output, using the development-only harness described below.

### Milestone 3: Live summary and baseline assessment

Connect the summary path to the hosted integration. Implement credential setup
and verify usage reporting against actual provider responses. Prepare the frozen
source references, summary evaluator, source-informed assessor, and cost-reporting
tooling. Connect the shell harness to the live investigator, then run the
summary-only baseline on all three fixed subjects. Live execution may reveal
adjustments needed to the boundaries exercised in milestones 1–2.

The summary-only baseline does not require corrections to occur; deliberate live
correction assessment begins in milestone 4. Complete the milestone-3 focused
cases assigned below alongside the baseline.

Observe these dependencies when scheduling the work:

- Before live inference, implement and offline-verify both explicit routes and
  document the credential mechanism, then pause for the human browser sign-in.
  Verify the intended account/model/reasoning configuration after setup readiness. Reference preparation may proceed independently.
- Before any live run on a formative subject, pin its revision and freeze its
  source-grounded reference material. The same freeze-before-live-run rule applies
  to assessment fixtures. Earlier live development runs may use other subjects or
  fixtures outside the assessment set after credential setup.
- Before the baseline assessment, complete session usage reporting and the
  summary evaluator and assessor pipeline. Run the summary-only assessment on all
  three fixed subjects using the applicable questions and protocol below, and
  retain its usage and cost records. This is an early baseline for subsequent
  implementation and assessment, not a scope-selection gate.
- Include the baseline views, assessment findings, usage and cost records in the
  milestone-3 review handoff. The review covers the hosted adapter and offline
  contract checks; enablement, preflight, credential setup and disclosure, and
  credential-exclusion checks; OAuth validation, persistence, renewal, concurrent
  renewal, revocation, streaming completion/failure and cancellation regressions;
  explicit billing selection and qualified monetary attribution; live usage reporting; assessment tooling; and
  baseline findings. Include any changes to the earlier boundaries or session
  integration prompted by live execution.

### Milestone 4: Progressive investigation

Expose `explain`, `decompose`, and `examine` over the same results. Support on-demand
investigram composition and investigation-provenance traversal, repeated
lenses, investigram evidence inspection, and subject-associated investigram
retrieval and inspection.

Verify the follow-up lenses and context navigation with the investigator
double before running the formative assessment. Then run a small formative live
sequence exercising `explain`, `decompose`, and
`examine` under the assessment protocol, using the pinned subjects and frozen
references. Assess whether examination notices and explains inconsistencies in
earlier accounts and can submit accompanying corrections. Complete the
milestone-4 focused cases assigned below. Repeated views still
show the original accounts without replacement substitution or human-facing
derived revision warnings. Correction context is supplied to the investigator
under the milestone-1 contract. Record these presentation limits when assessing
milestone-4 views; they are not failed milestone-5 checks. Include the views,
assessment findings, and usage records in the milestone review handoff.

### Milestone 5: Corrections and integrated lifecycle

Implement correction-aware selection and display, conflict handling, and
citation-based reconsideration propagation. Exercise ancestor
corrections, current-versus-historical presentation, preserved
composition and prior investigation context, invalidation, interruption,
and observations with deterministic tests using the investigator double. After
these checks pass, run the integrated formative assessment on the fixed subjects
to assess the completed investigation sequence and its user-facing views. Compare the
completed assessment with the milestone-3 summary baseline, recording changes in
configuration or evidence that affect the comparison. The completed sequence has
access to prior investigrams and corrections that the initial summary did not;
the comparison assesses what progressive investigation adds, rather than
isolating improvement in the summary generator. Complete documentation and
prepare the milestone-5 review handoff. After that review, the integrated handoff
covers interactions across milestones, governing-document alignment, assessment
findings, and documentation for the completed slice.

## Verification and formative assessment

### Deterministic behavioral checks

Verify that views preserve the qualification of referenced retained mechanical
claims while keeping generated synthesis interpretive. Investigator-assigned status or
a supporting citation alone must not confer mechanical status on generated
prose.

Verify public boundaries and journeys, including:

#### Results, references, and retention

- mechanical lenses applied to investigram references report unsupported
  subject/lens combinations without coercing the reference to a program entity or
  invoking the investigator; `inspect(investigram)` remains supported;
- reference-lifetime disclosure in this slice's human and JSON presentations when
  displayed references expire before follow-up use, including one-shot output;
- broad summary investigrams, attributable mixed evidence, unsupported and ambiguous
  module selections, unknown/cross-session references, and preserved qualifications;
- multi-level composition produced in one evaluation; follow-ups produce separate
  roots with subject provenance, without modifying the selected investigram's tree;
- path-like or other lookup handles with zero/one/multiple matches, without silently
  preferring a replacement; version-distinguishing paths, if used as precise
  references, retain their bindings;
- stable CLI selection of roots and subordinate investigrams after session growth, changed
  display order, and revision; repeat-display without invoking the investigator; exact historical
  inspection; retained investigation failure/limit stops on repetition and documented
  restart recovery; communication failures without reusable outcomes, closed investigator dialogues,
  preserved diagnostics, rejection of late responses, and ordinary subsequent
  requests in the same shell without repeat detection;
- subject inspection and investigator retrieval of qualified prior investigrams,
  association roles, bounded display, no automatic generation, and non-corroborating
  reuse of earlier interpretation across investigations;

#### Evaluation and evidence access

- evaluation-layer selection of missing interpretation work, retained-outcome reuse,
  and investigator queries that acquire missing mechanical results without changing
  their qualification or generating nested human-command observations;
- investigation-operation requests and retained-outcome keys independent of lens
  identity; equality of operation, exact subject, and semantic operation parameters
  determines reuse, while accumulated execution context does not change identity;
  repeated requests reuse retained outcomes and projection construction does not
  invoke the investigator. Cross-lens reuse is not demonstrated in this slice;
  verify it when a second consuming lens exists;
- full captured source supplied independently of human excerpt limits, explicit
  chunking/coverage, no human source-escape event for investigator-only reads, and
  correct disclosure observations when source is actually shown to the human;
- fresh investigator dialogues per investigation evaluation, with multiple tool
  exchanges and one terminal outcome; citation sharing, correction exemptions,
  execution guards, and attempt usage remain scoped to that operation execution;
- on-demand composition traversal, prior investigations, reverse subject lookup,
  revision context, and additional source;
- explain/decompose/examine on outputs of each other, including more than one
  follow-up level and no useful finer decomposition or additional finding;
- source acquisition by module reference, multiple source mappings, documentation
  acquisition through organization artifacts, and explicit unavailable content;
  unknown references and arbitrary path requests cannot bypass subject-based access;
- shared acquisition enforces generated-output and validity boundaries; bounded
  omissions, prompt-like repository text, and captured-source inspection preserve
  their qualifications without a parallel investigator file-reading path;

#### Corrections and conflicts

- correction eligibility after complete context is supplied to the investigator,
  initially or through permitted context responses, including across exchanges;
  excerpts, descriptive listings, truncated prose, and missing qualifications create citations but do not establish
  eligibility; identifiers alone create neither;
- complete conservative citation indexes for all investigrams from an investigation
  evaluation, including replacements, unchanged by later dialogue trimming or
  summarization;
- direct and transitive reconsideration warnings, multiple causes, unchanged
  investigrams and selection, no inference on disclosure, and no implicit clearing
  by a later investigation;
- bounded cause presentation in human and JSON views and investigator retrieval
  over a graph with combinatorially many paths, with further detail accessible
  without requiring full-path display or enumeration;
- A → B requires A in B's citations; all investigrams from the generating
  investigation evaluation are exempt from that cause, including the reporting
  root, composition children, other replacements, and recursively accompanying
  corrections; an indirect citation through Y citing A does not reintroduce that
  cause into exempt investigrams;
- later citers do not inherit a cause through exempt investigrams but do inherit it
  through other non-exempt citations; later corrections of A propagate independently;
- correction-aware initial and retrieved context, exact originals plus replacements,
  chains and conflicting alternatives; actual delivery indexes include supplied
  replacement content, with bounded omissions explicit;
- complete correction-context delivery exempts new investigrams from that specific cause,
  including indirect paths; partial delivery and unseen later corrections remain
  unexempted, and earlier investigrams' warnings remain unchanged;
- complete correction-context delivery for replacements with composition children,
  and separate completeness and causes when a replacement is itself corrected;
- revised-subject disclosure and reconsideration reporting do not duplicate a cause
  in repeated follow-up displays; observations and structured inspection expose
  citation indexes and completeness of correction context supplied to the
  investigator for audit;
- conflict acceptance without losing useful results, latest-accepted primary selection
  with conflict annotations, conflict overviews and complete inspection access;
  a two-step replacement chain and branching A → B, A → C, B → D sequence
  selecting D; simultaneous alternatives with stable selection,
  and corrections in displaced trees, including ancestor/descendant corrections;
- at most one composition position per investigram across all result trees;
  recursive accompanying corrections, rejection of same-result or missing targets,
  unresolved-inconsistency content and session-derived investigram facets;
- accompanying corrections with replacements outside the reporting investigram's
  composition, replacement provenance and subject associations, atomic acceptance,
  child replacement under an old root, and root replacement using its own composition;
- correction of the selected investigram and an ancestor, unresolved disagreement
  discoverable through affected-investigram inspection and redisplay,
  conflicting corrections to superseded targets, preserved old output and composition trees, revised-subject
  warnings on subsequent investigations, and
  precise-reference targeting with supersession warnings and no redirection, distinct
  retained requests for original and replacement subjects, corrected
  retained summary redisplay that visibly identifies changes and preserves
  interpretive qualification, and unchanged historical projections;

#### Execution, failure, usage, and regression checks

- enabled investigation with unsatisfied prerequisites fails before the shell
  starts, including when intended commands are mechanical; equivalent preflight
  failure in one-shot use;
- disabled investigation leaves mechanical commands usable without credentials;
  configuration and help disclose enablement and repository-content transmission;
- synthetic sentinel credentials never appear in observations, diagnostics, logs,
  investigator context, or assessment artifacts across setup and execution success
  and failure paths; run these checks without real credentials;
- runaway containment across tool-triggered mechanical work and the dialogue loop,
  stopped outcomes, and documented in-flight cancellation limits;
- failure classification for transport errors, request timeouts, rate limits and
  provider unavailability after successful tool exchanges; retained refusal,
  unrecovered provider-reported truncation, malformed output and invalid references;
  guard expiry during a provider call; discarded interpretation content but
  preserved acquired evidence on communication failure;
- submission and acceptance within configured execution limits, exercising a soft
  threshold or remaining-limit information if implemented;
- dialogue termination without submission, absent another terminal failure cause,
  produces a retained investigation failure;
- unavailable credential mechanisms on unsupported platforms or failed secure
  credential access produce configuration unavailability without an exposing fallback;
- runtime authentication rejection and provider spending-limit or quota exhaustion
  leave no reusable outcome; later requests start fresh evaluations;
- repeated requests follow the retention column for every taxonomy row, reusing
  retained outcomes and starting fresh evaluations when no reusable outcome exists;
- shared agent communication contract checks for the double and real adapter where
  feasible, including representative provider responses processed by the real
  adapter offline; include simulated transport errors and request timeouts, rate
  limiting, quota or spending-limit exhaustion, authentication rejection, refusal,
  truncation, and unrecognized provider errors to verify taxonomy mappings;
  routine tests require neither credentials nor live inference;
- per-investigation and session usage in human-readable and structured output;
  multiple model/category breakdowns, subset accounting, failed-attempt usage,
  missing usage disclosure, no double counting on redisplay, one-shot reporting,
  and totals available after communication failure without inference;
- interruption and invalidation after earlier calls have reported usage, including
  while a later call is in flight: final reporting and observations preserve the
  earlier usage and session totals, mark unavailable usage explicitly, and retain
  no late investigation result;
- provider unavailability, failures, malformed output, exhausted bounds, usage
  unknown, acceptance of a single-operation result as a unit at the domain boundary,
  visible observation-delivery failure without invalidating a successfully
  produced view, and no inference during inspection;
- input change during asynchronous work, new evidence acquisition, excluded output,
  interruption, and rejection of late results;
- result assembly from dialogue exchanges and atomic acceptance without retaining
  individual fragments or applying their corrections; a guard stop before submission
  retains no investigram, even if an intermediate tree is structurally valid;
- submission before the stop proceeds to ordinary validation; submissions after
  the stop are rejected, and any investigator repair remains within the guard;
- recovery from truncated exchanges when supported, retained failure on unrecovered
  truncation, and limit-stop classification when recovery exhausts the guard;
- qualified unavailable-evidence tool responses permit continued investigation;
  investigator-written qualifications cannot promote interpretation to mechanical status;
- execution outcomes distinguished from prose describing investigation coverage;
  attributable epistemological qualifications preserved in views and subsequent
  investigator context;
- retained existing mechanical CLI behavior, type checks, and the full relevant
  test suite. Do not assert exact wording from live generative results.

### Formative investigation assessment

Use three fixed formative subjects: Cockatiel’s `src/common/Executor.ts`,
`thingts/fsm-engine`, and `mesqueeb/merge-anything`. Before live runs, the
implementing agent records revisions, module boundaries, supplied and accessible
documentation, provider compatibility, and supplied assessment context. These
are purposeful development subjects, not an unbiased sample or untouched
validation set. If a subject cannot be exercised in the supported
configured-project scope, report the obstacle for human choice rather than
silently replacing an awkward result.

Pin all three subjects to recorded revisions for the entire formative exercise,
including the milestone-3 baseline and later assessments. Prepare reference
material against these same pinned revisions. For Cockatiel, start at
`src/common/Executor.ts` with surrounding repository evidence accessible through
the normal subject-based interface.

#### Subject selection rationale

The subjects exercise complementary aspects of source-based understanding:

| Subject | Relevant code characteristics | Assessment purpose |
| --- | --- | --- |
| [Cockatiel `src/common/Executor.ts`](https://github.com/connor4312/cockatiel/blob/master/src/common/Executor.ts) | Invokes caller-supplied work, classifies values and errors through supplied filters, and reports outcomes through return values and timed events; retry policy lives in a caller | Test whether summaries separate execution and outcome classification from the supplied work and surrounding policy |
| `thingts/fsm-engine` | Meaningful cases, guards, transition actions, and reentrant-request handling | Test terse accounts of branching behavior and useful local decomposition |
| `mesqueeb/merge-anything` | Related operations share implementation, with recursion versus replacement and customization | Test whether investigation explains substantive mechanisms beyond a generic package description |

These are selection rationales, not expected answers supplied to the investigator
or view-only evaluator. Capture the exact modules and revisions used;
source-based assessment establishes which conclusions those captures actually
support. The Cockatiel branch link identifies the candidate file; the recorded
revision pin governs the assessment and its source references.

#### Investigation sequences and assessment targets

For each subject, record the initial summary and a sequence exercising all three
follow-ups, including a follow-up on a generated investigram. Assess whether:

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
- a focused case with mixed responsibilities does not acquire an invented unifying
  purpose; an unclear role remains explicit when the evidence does not support one;
- a focused case with documentation that conflicts with implementation preserves
  the attributed assertion and exposes the discrepancy, rather than silently
  reconciling it or treating documentation as proof of behavior;
- decomposition of overlapping or non-exhaustive cases does not imply mutual
  exclusion or completeness merely because it produces an enumerated set of
  subordinate investigrams; any stronger claim is assessed against its evidence;
- context retrieval enables correction of earlier results through composition and
  investigation-provenance traversal without erasing earlier results;
- citation-index breadth and apparently irrelevant inclusions, correction frequency,
  and the burden of uncleared reconsideration warnings. Large indexes alone do not
  demonstrate a problem; assess whether incidental context makes warnings unhelpful.
  Use controlled correction cases to exercise transitive warning propagation even
  when natural corrections are rare.

#### Focused cases and controlled fixtures

The three selected repositories provide realistic formative investigation
sequences; they need not contain every focused verification case. Use an
appropriate case from those repositories when available. Otherwise, use a small
controlled fixture with reviewable source and known evidence for mixed
responsibilities, conflicting documentation, overlapping or non-exhaustive
cases, delegated functionality, or unproductive further investigation. Keep
fixture results distinct from the three repository assessments. Do not replace a
selected repository or spend an open-ended search trying to make it satisfy
every case.

Record which focused cases each repository subject or fixture covers; one
subject may cover several cases. Schedule the live assessments as follows:

| Milestone | Focused cases |
| --- | --- |
| 3 — Live summary | Mixed responsibilities, conflicting documentation, delegated functionality, and unproductive further investigation contrasted with a hard-limit stop. |
| 4 — Progressive investigation | Overlapping or non-exhaustive decomposition, and controlled correction of an earlier interpretation. |
| 5 — Integrated lifecycle | Correction-aware views, conflicts, and transitive reconsideration, using the controlled correction cases. |

Verify the corresponding mechanical invariants with deterministic tests before
the live assessments. Before the first live run on an assessment fixture, freeze
its source, documentation, any injected setup, and source-grounded reference
material.

To exercise a hard-limit stop reliably, the harness may use an assessment-only
execution-bound override through internal test configuration. Identify the run
as controlled setup and record the override value; this does not add a normal
configuration option. The internal mechanism remains an implementation choice.

Exercise interpretation-sensitive fixture cases through the real investigator and
assess the resulting views against their source-grounded reference material
using the protocol below. Deterministic tests verify orchestration and
invariants but do not substitute for assessment of the generated interpretation.
Record fixture construction and any deliberately injected assertions or earlier
interpretations.

#### Clean-agent comprehension exercise

The implementing agent orchestrates fresh evaluator subagents using its available
agent tools, supplying captured user-facing views and consistent structured
questions. Follow the approach established by the [module inventory
exercise](../../records/validation/initial-module-inventory-questions.md) and
[module organization assessment](../../records/tasks/2026-09-15-module-organization.md#bounded-instrument-validation).
Evaluators have no implementation-task or investigator conversation history and
use only the supplied views, including any explicitly supplied
evidence-inspection view. They do not independently read source, repository
documentation, plans, or the internet. Record evaluator configuration, supplied
artifacts, and any context limits. Fresh context does not establish absence of
model prior knowledge or independent corroboration of generated claims.

For each formative subject, assess the initial summary separately from the
captured follow-up sequence. Use separate fresh contexts for summary-only and
sequence conditions so later explanations do not inform the summary-only
answers. The sequence includes the selected references and relevant prior
output, allowing an evaluator to assess what each lens added. Fix the
question set before assessment and apply it consistently across subjects.
Questions cover:

- What functionality and division of responsibility does the view communicate?
- Which conclusions are interpretations, which have other qualified support, and
  what consequential information remains unestablished?
- What became clearer after explanation, more precisely selectable after
  decomposition, or substantively different after examination?
- Which investigram would you select next, by displayed reference, with which
  lens, and what would you expect to learn?
- Where correction is shown, what changed, which references identify original and
  replacement, and what remains uncertain? Can composition be distinguished from
  the provenance of a later investigation?
- What wording, omissions, repetition, or presentation could mislead or impede use?

Responses use a consistent structured format with references to supplied output,
explicit unknowns, and a qualitative usefulness judgment rather than a single
numeric score. Retain exact questions, inputs, and responses. Compare
summary-only and sequence responses for conveyed understanding, not just length
or agreement.

#### Source-grounded comparison and automated execution

The implementing agent or a designated subagent prepares the reference material.
Record who prepared it, including whether the preparer was the implementing
agent; disclose that overlap as an assessment limitation.
Establish and freeze it before any live investigator run on a formative subject
or assessment fixture, including the milestone-3 summary assessment. Use the
captured source and qualified mechanical evidence for each subject. The material
records consequential supported conclusions, evidence references, material
limits, and acceptable qualified interpretations. Apparent responsibility or
purpose need not have one uniquely correct phrasing; reference material
distinguishes established facts from interpretive judgments and unresolved
questions. Record any later corrections to the reference material with their
evidence and rationale.

Keep investigator instructions and context-selection rules general across
subjects. Do not insert subject-specific expected answers or hints derived from
assessment references or selection rationales. Source, documentation, qualified
mechanical evidence, and prior investigrams remain legitimate context under the
normal evidence-access rules. Assessment reference material is not supplied to
the live investigator. Controlled cases may supply the documented injected
misinterpretations as test context; this does not permit supplying the reference
answers used to assess their correction.

Freeze the investigator prompt set and context-selection rules before each
assessment pass, including shared instructions and operation-specific templates.
Apply that version consistently across all subjects and investigation sequences.
Any revision begins a separately identified assessment pass; preserve earlier
results and record the changes. Subject evidence and operation-specific context
vary under those fixed templates and rules.

The comprehension evaluators remain view-only: source-grounded reference
material and selection rationales are not supplied to them. A separate
assessment stage compares both generated investigrams and evaluator responses
against that material, as well as checking what the supplied views actually
support. Distinguish:

- generation errors faithfully repeated by the evaluator;
- presentation misunderstandings where supported information was present but misunderstood;
- successful communication of source-supported understanding and qualifications;
- unsupported evaluator extrapolation, including conclusions that happen to match
  source but were not established by the supplied view;
- material omissions and cases where the reference evidence cannot settle a claim.

Run the assessment automatically across the formative subjects and investigation
sequences, retaining outputs and assessment findings for human review after the
exercise completes. Human inspection is not a per-subject or per-sequence step.
The implementing agent invokes a separate fresh subagent as the source-informed
assessor, supplying the reference material, captured views, evaluator responses,
and a consistent rubric. Its judgments remain attributable and reviewable rather
than authoritative program truth. Record the reference material, rubric, assessor
conditions, evidence for discrepancies, and uncertainty alongside the view-only
responses. Record the actual model identifiers, families, and configurations for
the implementing/orchestrating agent, reference preparer, investigator,
comprehension evaluators, and source-informed assessor; disclose unavailable
identifiers. Record shared orchestration and model-family overlap across these
roles as assessment limitations. Fresh contexts do not remove shared blind spots,
reference-selection bias, or possible preferences for similar output styles. A
cross-family comparison remains optional; no particular evaluator model
comparison is required.

Use a controlled retained misinterpretation against unchanged source to exercise
correction explicitly, both with deterministic tests and a live investigator.
Mark that setup as injected test context, not a natural investigator error.

| Milestone | Double-based testing | Live testing |
| --- | --- | --- |
| 1 | Domain-level submission, validation, context requests and responses, and returned outcomes, using supplied context fixtures. | None. |
| 2 | Retention, reuse, and successive evaluations with retained context; reporting and `inspect(investigram)` through the shell. | None. |
| 3 | Retain the deterministic correction tests; run offline adapter contract checks. | Summary baseline; no deliberate live correction case required. |
| 4 | Follow-up lenses and context navigation, including accompanying corrections, before formative assessment. | Assess correction through follow-up lenses. |
| 5 | Correction-aware selection, display, conflicts, and reconsideration propagation, before formative assessment. | Integrated assessment of the completed sequence and views; mechanical correctness is established by deterministic checks. |

Retain exact explicit inputs, outputs, configuration, evidence access, failures,
observed usage, elapsed time, and assessment findings in an appropriate
validation artifact. Record changes to investigator prompts and context-selection
rules with each reassessment. Prompt revisions are assessed on all three
subjects; do not hide a regression in an aggregate score or replace an
inconvenient subject. No
broad prompt/model optimization search is required. The human reviews the
combined formative results after the automated exercise; no universal
acceptable-cost or usefulness threshold has been established.

#### Assessment runs and generative variation

Run each subject once for each prescribed assessment condition: the summary
baseline, progressive sequence, and completed integrated sequence. Apply the
same default to focused cases at their assigned milestones. Differences between
runs may reflect generative variation, changed context, or implementation and
configuration changes. Record these as limitations; a single comparison cannot
isolate their effects.

The implementing agent may conduct additional unchanged-configuration runs to
investigate a specific finding. Record the diagnostic question and a finite run
count before those runs. Use a fresh PostCode session for each new run; repeating
a command in an existing session follows ordinary outcome reuse. Preserve all
results, including failures; a later success does not replace an earlier
finding. These diagnostic runs are distinct from the bounded communication-failure
recovery below. Reassessment after prompt revisions still covers all three
subjects.

#### Shell driving and controlled investigator inputs

The development-only harness invokes the existing CLI entry point in-process,
supplies terminal-like input, and captures output and observations. Follow the
existing shell-test approach to issue later commands using references from
earlier results in the same session. Exercise production command parsing,
session handling, dialogue coordination, validation, retention, and presentation.
The harness leaves normal CLI input behavior unchanged.

For live sequences, the implementing agent selects follow-up targets and
lenses from captured views to exercise the prescribed assessment objectives.
Controlled correction cases use their designated target. Record each selection
and its rationale, and identify adaptive target selection as a limitation of the
formative findings. Selection remains separate from the clean comprehension
evaluators' assessment of captured views.

The harness supports incremental command submission while keeping the same
PostCode session alive across the implementing agent's inspections and choices.
The control mechanism is an implementation choice.

For live controlled correction cases, use the investigator double to produce the
earlier misinterpretation through ordinary submission, validation, and retention.
Use the live investigator for subsequent investigation evaluations in that same
session.
Provide internal dependency injection at the agent communication boundary so
the harness can select scripted or live investigation for each investigation
evaluation.
The injection mechanism is a test/assessment dependency, not a public command or
normal configuration option. Its implementation remains delegated.
The injection route must reach the investigator through the production session
execution path, wherever the session executes.

Identify injected interpretations in views, observations, and assessment records
through attributable test-origin metadata. Preserve the distinction between
scripted setup and live findings. Scripted exchanges contribute no provider
usage; record actual live usage normally. Synthetic usage used in deterministic
tests remains identified as test data and excluded from live usage and cost
totals.

#### Assessment tooling and artifact lifecycle

Commit reusable assessment runners, question sets, and cost-reporting code under
`scripts/module-investigation/`, with instructions for running them. Retain them
as development tooling for later comparisons. The implementing agent orchestrates
clean evaluator subagents through its available agent tools; assessment scripts
support capture, comparison, and reporting rather than requiring a separate
evaluator-service integration. Record each run's orchestration steps and exact
subagent prompts as sent, alongside the supplied artifacts and responses. Later
comparisons require equivalent agent orchestration as well as the committed
tooling; scripts alone do not reproduce the agent execution environment.

Retain reviewable assessment records under
`records/validation/module-investigation/`. Keep transient working files in a
root underscore directory under the disposable-scratch conventions. Before
committing records, check captured repository content and transcripts for
private, sensitive, or third-party material and follow the applicable approval
requirements. Prefer references to pinned source revisions and locations where
practical. Any copied third-party source excerpts must be compatible with the
source repository's license, including applicable attribution requirements.
Retained records must be self-contained apart from pinned source references,
without depending on disposable files.

#### Assessment usage and cost report

Log each PostCode session's usage report, including one-shot runs and incomplete
or failed sessions, alongside its investigation-attempt records. Produce a final
report of PostCode session usage and available monetary attribution across all
assessment runs and recovery attempts, with per-session and authentication/billing
route breakdowns. ChatGPT-funded usage must distinguish token accounting from
unknown allowance/credit attribution; unavailable monetary amounts are not zero.

Report available usage for reference preparation, comprehension evaluation, and
source-informed assessment separately from PostCode sessions. Keep any known
assessment costs separate from the PostCode session-cost total. Unavailable usage
or monetary attribution remains explicit rather than being reported as zero.

For API-key runs, calculate estimated API cost from reported usage and the applicable published
rates, recording the pricing source, retrieval date, model, service tier,
currency, and relevant caching or other billing distinctions. Avoid double
counting usage categories. Distinguish estimated cost from provider-confirmed
charges. Missing usage, uncertain rates, and potentially billed failed calls are
explicit coverage limits, not zero-cost assumptions. If a complete total cannot
be established, report the accounted-for amount and what is missing.
Provider-side reconciliation may be used when separately configured access is
available, but an Admin API key or billing integration is not a prerequisite.
For ChatGPT plan runs, do not equate API list-price estimates with actual ChatGPT
credit charges. An optional API-equivalent estimate is a comparison only. Link
provider usage controls, explain shared allowance and optional credit use, and
keep evaluator and assessor usage separately attributed even if they consume the
same allowance. The cost calculation belongs to assessment tooling, not PostCode's product
reporting in this slice.

#### Assessment failure recovery and reliability

Configuration or structural unavailability stops the exercise for correction or
human direction; repeated invocations are not a recovery strategy for these
failures. Use the product failure classification above to distinguish
communication/service failures from retained investigation outcomes and
execution-limit stops. Record the classification and finite repeat allowance
before execution. For plausibly transient communication failures, the harness
may issue the affected request again in the same PostCode shell, with a fresh
investigator dialogue, up to that allowance. Earlier completed investigations
need not be regenerated. Authentication rejection or other known configuration
or structural failures stop the exercise rather than consuming the repeat
allowance. Provider-identified spending-limit or quota exhaustion also stops the
exercise, leaving affected validation incomplete. Preserve the provider error
code and credential-safe diagnostic in the logged results and assessment report.
Distinguish exhaustion from transient rate limiting where the provider permits;
if it does not distinguish a spending cap from another quota restriction, report
that uncertainty and retain the diagnostic for checking against the provider's
dashboard. Do not repeatedly issue requests against an exhausted allowance. An
unclassified provider error is not automatically eligible for repetition;
without evidence that it is plausibly transient, stop for diagnosis or human
direction. This policy belongs to the assessment harness; PostCode applies
ordinary request selection without repeat detection or an automatic retry loop.

Refusals, unrecovered provider-reported truncation, malformed or invalid investigator
submissions, and execution-limit stops are assessment findings, not triggers for
these repeated requests. Continue independent cases and record dependent steps
as blocked when a needed result is unavailable. If only an assessment agent
fails while inspecting captured views, restart that assessment with the same
views in a fresh agent context; regenerating the PostCode investigation is
unnecessary.

##### Attempt records and escalation

Preserve every attempt's inputs, outputs, diagnostics, configuration, evidence
access, failure point, elapsed time, and available usage information, excluding
credentials. A completed run supplies semantic validation evidence; earlier
agent-communication failures do not invalidate it. Invalid-submission and limit-stop
findings remain part of the assessment even if later work succeeds. Exhausting
recovery without completing a required case leaves that validation incomplete,
rather than establishing poor interpretive quality. Report runtime failure
frequency and recovery cost separately from the semantic assessment, including
failed attempts rather than only completed runs.

If communication failures exhaust the recorded repeat allowance or otherwise
make the exercise impractical, stop and request human instructions with the
completed validation, failure evidence, and recovery costs. Do not add product
retries or silently waive required validation. The human may approve a plan
amendment and authorize further work; during an active task, record and commit
that direction as a task follow-up before acting. Reliability findings can
inform whether to introduce automated or manual retries in PostCode, but do not
authorize them.

## Deliverables and remaining design choices

The delivered capability includes the four lenses, stable session-long CLI
references, retained/current and historical viewing, subject-associated
investigram inspection and retrieval, correction-aware navigation, and basic
per-investigation and session usage reporting. Retry and forced regeneration
remain outside the slice, with restart recovery documented. CLI documentation
describes these behaviors with examples and documents inference setup, actual
input-change coverage, and provider/cancellation limits. The architecture
overview, README, status, schemas, and applicable implementation conventions
describe the implemented boundaries and lifecycle.

Schemas, record layout, tool signatures, reference spelling, command grammar,
provider setup, numerical limits, and asynchronous coordination mechanisms remain
implementation choices within the behavior specified by this plan and its
associated decisions.
