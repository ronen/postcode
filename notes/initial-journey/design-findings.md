# Design findings and follow-up questions

Consolidated: 2026-11-08

These are the remaining useful hypotheses and rationale from the completed
[JOURNEY exploration](README.md). They are research/design notes rather than
additional requirements for the [script](cockatiel-investigation-script.md) or a
new work sequence.

<a id="human-role"></a>
## Human judgment shaped the scenario

An initial debugging-oriented sketch used existing executor interpretations.
It gave a plausible route through code but did too little to establish the value
of human involvement when an agent could investigate the implementation. Reframing
around externally visible commitments made the human's role clearer: what should
an operation promise, which responsibilities belong together, and what tradeoffs
are worth making? A small boundary question can matter more than a large overview.

For example: “We keep changing several parts whenever we add a policy. Is that
accidental coupling worth removing, or does it reflect a shared commitment?”
That is a worthwhile question, but the repeated-change premise needs historical
evidence. The selected issue instead supplies a real lead and a consequential
question over one fixed program revision. A lead from an error, documentation or
an issue is legitimate; supplying the correct module merely because the researcher
knows the repository would hide discovery work.

The [human-understanding note](../human-understanding-and-agency.md) records the
emerging purpose discussion; the adopted [product design](../../foundation/product-design.md)
now governs that purpose. The original
[dialogue and debrief](readiness-investigation-dialogue.md#added-value-debrief)
show that ordinary agent conversation already supported a useful design direction.
PostCode's specialization is a design choice; comparing it with capable chat,
notes and diagrams can inform evaluation without becoming a prerequisite for
building a useful bounded capability.

<a id="orientation"></a>
## Orientation can develop alongside local understanding

The human reported that the overall explanation became meaningful only after
exploring local details. An operating-model account kept available might gradually
become useful; requiring an exhaustive summary at entry could miss that opportunity.
A larger module tree or dependency map can reproduce “trees without a forest.”

The episode needs a task-relevant application/library model and connected behavior,
not proof that a project-wide summary or dependency-landscape capability is needed.
Distinguish missing presentation of a known relationship, discovery of relevant
subjects, and new interpretation of purpose or behavior. They call for different work.

Perspectives can remain recognizable while the investigation changes scope:

- Changing perspective examines another concern of the selected subject.
- Changing scope follows a meaningful relationship to a narrower or surrounding
  subject. “Up” may mean application context, callers or a composed policy, rather
  than a parent directory.
- Retaining an answer gives somewhere to return to; it does not prescribe tabs,
  a fixed hierarchy, exactly two panels, or storage across application restarts.

The always-available reference-surface idea remains a presentation hypothesis.
The human may arrange several accounts and consult them intermittently alongside
work elsewhere. Following repository changes would add separate questions of new
analysis, notification, reference continuity and capture; it is outside the fixed-
revision journey. A changed file does not by itself establish architectural impact.

<a id="framing"></a>
## Concepts can help frame questions

Responsibility, ownership, contract, state and interaction supplied useful ways
of asking about the same software. Their value lies in the distinctions they
expose, not merely in adding labels to summaries. Source-language independence,
project familiarity and experience making design judgments are separate matters;
the human in this episode had substantial design experience.

An optional cue could explain why examining ownership or concurrent callers may
help, while allowing a different direction. Such guidance must not silently assert
an unestablished relationship or lead toward a preferred design. The selected
journey assumes usable choices; it has not demonstrated that a new user would
find them or independently generate the same alternatives.

The [concept references](architectural-concept-references.md) preserve the relevant
Views and Beyond, ATAM and ADD grounding and our adaptations. These resources can
inform account content and investigation practices without making a formal
methodology the product workflow. A mnemonic is neither a schema nor a Lens
definition. A display cannot create missing temporal semantics or establish a
relationship merely by placing two accounts together.

<a id="continuity"></a>
## Continuity and evidence have distinct jobs

The original dialogue combined explanation with collaborative design. The final
journey isolates understanding implemented software, leaving design judgment to
the human. External-agent collaboration and investigation of supplied proposals
remain useful possibilities in the broader product; their omission here makes
the selected account interactions easier to assess.

Important distinctions to preserve in subsequent planning:

- An exact earlier answer preserves its selected content, captured basis and
  qualification. Selecting newer information differs from redisplaying that answer.
- Further detail can be disclosure of retained content or a new investigation.
  A representation change alone cannot supply a missing behavioral account.
- Navigation origin is the relationship actually established by an interaction,
  distinct from program relationships, evidence support and inferred human reliance.
- Correction delivery should identify the earlier account, replacement and reason.
  Detection, competing explanations and propagation to related accounts require
  their own capability assessment; the staged successes prove none of them.
- Evidence needs to be understandable without deciphering source. Source citations
  alone neither explain a claim nor verify it. Accounts also need usable conditions,
  provenance and disclosed uncertainty.

The original [retained-account debrief](readiness-investigation-dialogue.md#corrections-continuity-model-debrief)
is evidence of the motivation for externalizing a revisable account. The subsequent
picture exercise tests one limited form of reuse. Neither establishes a complete
persistent model, ongoing synchronization or a general retrieval architecture.

<a id="capability-planning-inputs"></a>
## Capability-planning inputs

This restores the concrete planning inputs from the intermediate walkthroughs.
They are candidate needs for the selected episode, to be narrowed during planning,
rather than approved implementation requirements. The
[connected examples](cockatiel-account-examples.md) give the smaller worked case.

### Accounts and their use

| Account | Information to make intelligible | Human use |
| --- | --- | --- |
| Application/library operating model | Supplied work, responsibility boundary, reusable state, per-call progress and composition | Place the reported need and identify relevant control boundaries |
| Policy family, contracts and access | Shared execution role, individual policy semantics, outcomes and component access | Consider where a facility could belong |
| State and interaction | Stored state, transition conditions/triggers, concurrency, waiting and elapsed time | Reason about an early query or changed recovery trigger |
| Evidence, rationale and revisions | Supported, inferred, corrected and unknown content with its basis | Assess confidence and revisit an earlier understanding |
| Human preferences/choices, optionally supplied | Attributed intent and exact selected references | Resume or explain a direction; recording does not evaluate it |

### Navigation dependencies

| Route in the script | Capability needed |
| --- | --- |
| Issue-derived names → subject → surrounding context (step 1) | Repository selection, semantic lookup and disambiguation; distinguish CircuitBreakerPolicy from CircuitState, rather than assume a perfect match |
| Policy combination → wrapping-order case (step 6) | An account exposing qualified relationships and their destinations, beyond mentioning composition in prose |
| Half-open → trial interaction (steps 5/8 → 13) | Preserve the selected state's meaning and its policy relationship across perspectives |
| Earlier admission/timing answer → correction (steps 2 → 5 and 12 → 15) | Supply exact earlier account context, show target/replacement/reason, and preserve both versions and answer snapshots |
| Breaker → deeper lifecycle detail (step 17) | Request another perspective on a known subject; disclose partial or unavailable content |
| Human choice → optional retained record (steps 4/18) | Explicit attributed input and selected support, rather than inferring intent from viewing history |

Outside issue reading remains the human's activity. It supplies neither a hidden
PostCode subject nor evidence that the application has been inspected.

### Existing support, presentation work and analytical gaps

The [capability reference](../../docs/capability-reference.md) is authoritative for
current support. At closeout it provides mechanical module/project exploration,
module-originating interpretations, retained explain/decompose/examine operations,
corrections and exact retained-answer presentation within a transient Session.
The completed [request model](../../docs/plans/lens-request-model.md) and
[exact presentation](../../docs/plans/exact-retained-answer-presentation.md) supply
foundations; they do not deliver this whole selection experience.

Presentation work includes subject/perspective selection, connected readable
accounts, optional detail, qualification and correction disclosure, and clear
navigation and answer origin. Additional core capability may be needed to produce
a useful cross-module operating account, expose architectural subjects/relationships,
and answer their behavioral perspectives. Inferring a flow or correspondence is
analysis, not a different rendering. A GUI, general multi-Projection composition,
cross-session persistence and hypothetical/intended investigation are not current
capabilities or prerequisites assumed by this journey.

Test whether current module interpretations can be combined into a supported
cross-module account, or whether a broader investigation is needed. Related
assumptions are discovery of the application/library boundary, fidelity of waiting
and composition accounts, continuity of subject meaning, and selection of a useful
next perspective without the original conversational cues. Neither a project-wide
summary nor a dependency landscape has been selected as the solution.

### Presentation contracts and conditional prerequisites

For the bounded slice, specify the needed selection, sorting, bounds, expansions,
partial/unavailable-result handling and reference coordination. Current bounded
JSON output is not necessarily the entire information available to an analysis.
Consequential qualifications must be visible without hover; type, density, contrast
and layout are part of whether the proposed reference surface works.

Reopening, paging or reformatting an exact answer must preserve its selected content,
basis and correction/association snapshot. Distinguish disclosure of retained detail,
fresh investigation and selection of newer content. Show current revision status
separately from historical content where needed. Preserve actual navigation origin
without inventing evidence dependence or human reliance. Session-local retention is
sufficient to start; a pinned program revision is not persistence across restart.

Relevant planning dependencies are:

- [Presentation representation](../../docs/backlog.md#decide-how-gui-presentations-and-their-parameters-are-represented)
  and [additional-detail placement](../../docs/backlog.md#review-more-details-information-placement).
- [Navigation origin](../../docs/backlog.md#assess-and-preserve-navigation-origin-lineage)
  when the interaction relies on returning through its origin.
- [Captured-basis attribution in observations](../../docs/backlog.md#preserve-captured-basis-attribution-in-observations)
  before relying on new recorded observations for state-specific assessment. This
  is a prerequisite for that assessment, not a universal recording requirement or
  a reason to block ordinary investigation without research capture.
- [External-agent context exchange](../../docs/backlog.md#design-a-bounded-shared-context-interface-for-coding-agents)
  if a later journey introduces shared agent context.

Supporting evidence must refer to the captured basis and remain intelligible under
the [human representation boundary](../../docs/decisions/human-facing-architectural-representations.md#human-output-boundary).

<a id="implementation-validation"></a>
### Checks when evaluating a real implementation

- **Faithfulness:** check claims against the stated revision and evidence, including
  observation/reservation, start/wait/refuse, shared/per-call state, composition order,
  eligibility/execution and elapsed-time/scheduled-action distinctions. Expose gaps.
- **Findability:** try the issue-derived names, ambiguous or missing matches, and
  the indicated paths between operating model, focused behavior and evidence.
- **Effective presentation:** observe whether the account is legible and usable,
  what readers infer, and where they need further detail. Displaying content does
  not establish understanding; reaching the scripted decision is not the sole test.
- **Evidence and qualification:** distinguish static interpretation, illustrations,
  observations, inferred rationale, unknown maintainer intent and usage prevalence.
- **Corrections:** exercise both the waiting omission (steps 2 → 5) and timer wording
  (steps 12 → 15), including notice, exact target, replacement, reason and access to
  both answers. Evaluate discovery separately from these seeded delivery cases.
  A changed human preference is not a factual correction.
- **Optional capture and stopping:** supplied choices retain attribution and exact
  supporting references. The human can also stop without recording a choice or
  receiving a verdict. Viewing an account does not establish reliance.

Actual earlier PostCode material remains available in the
[pass-04 Cockatiel module sequence](../../records/validation/module-investigation/pass-04/cockatiel-m4/sequence-view.txt)
and [pass-06 correction assessment](../../records/validation/module-investigation/pass-06/report.md).
The former supplied an earlier executor-centered candidate at its own assessment
baseline; the latter uses controlled injected errors. Neither proves this journey's
cross-module accounts or a natural correction-discovery rate.

<a id="pictures"></a>
## Pictures: retained experiment and remaining hypotheses

The [picture review](pictures-result-review.md) and received artifacts answer an
identifiable research question: could another agent use the retained account to
produce useful explanatory views, and where would interpretation or depiction fail?
The human reported the generating configuration as **GPT-6 Astra | High**.
The producing agent reported broad cross-conversation context, so this was not
an isolated or blinded run.

The account transferred useful content. The already-informed human reported no
new understanding, found some local illustrations reasonable, and found the broad
operating-model picture less illuminating. Specific problems included the bulkhead
WAIT arrow, ambiguity in “recovery work,” framing of the problematic application
loop, and a recovery timeline that conveyed too much through words. The record
also shows the reviewing agent correcting its own overly positive assessment.

This separates content transfer, fidelity of a drawing and benefit to understanding.
A poor drawing does not refute the concept, and a pleasing one does not establish
its value. Whether a small picture presented at the first explanation would help
remains a live-use question. Received artifacts and input wording are kept unchanged
so a later correction can distinguish an account ambiguity from a representation
error.

<a id="visual-precedents"></a>
## Visual precedents and their limits

The [references-only input](visual-language-references.md) remains the exact source
list supplied to the picture agent. The following design interpretations consolidate
the earlier shortlist; they are not newly verified research findings:

| Precedent | Possible contribution | Limit relevant here |
| --- | --- | --- |
| Enterprise Integration Patterns | Recurring functional symbols composed into larger explanations | Messaging metaphors could misrepresent in-process policies. |
| C4 and Structurizr | Recognizable elements across context and ordered interaction views | Shared identity alone supplies neither behavioral semantics nor evidence/correction guarantees. |
| Learnable Programming | Inspectable flow, state and time; successive moments | An illustrative sequence must remain distinguishable from a runtime observation. |
| Software cities / CodeCity | Recognizable places for returning to known parts | Organization and size can leave purpose and commitments unexplained. |
| Visual Notation Design 2.0 | Evaluate what intended readers actually infer from symbols | Object recognition does not establish understanding of software semantics; the linked manuscript is a draft. |
| UML and statecharts | Established distinctions among order, states, transitions and conditions | These were reference candidates, not fully evaluated here; preference for pictorial icons should not exclude them. |

A useful small comparison could hold content constant while varying the depiction
of ownership, composition or recovery timing. Keep execution capacity distinct
from waiting space, trial eligibility from a trial actually executing, and program
state from confidence in the account. Repeated subjects should remain recognizable.
The existing [GUI visual-language notes](../gui/visual-language.md) concern view
anatomy and legibility; pictorial semantics are a related but different question.

<a id="future-journey-method"></a>
## Method and material for further journeys

For another episode, specify a credible starting lead, concrete received information,
a plausible reason for the next selection, and a useful endpoint with remaining
uncertainty. Use actual results when available and label illustrative ones. Keep a
short list of consequential assumptions: the result needed, why the journey depends
on it, existing support and the check still needed. Test the assumption carrying
the central value early. Avoid tailoring every answer to a predetermined next click;
use imperfect cases where they test a consequential ambiguity rather than designing
all failure paths.

Distinguish the explored endpoint from a first implementation slice. The person may
reach a design direction or handoff while some capabilities remain sketched. A
selection-only route must not inherit the conversational agent's contributions
silently: alternative mechanisms and the timer-risk list require an explicit source
or a stated assumption about human reasoning. A comparison study should use capable
guided chat with repository access, notes and diagrams, rather than a deliberately
passive conversational baseline.

The [archive index](README.md#archive) identifies the exact earlier files for deferred
work. In particular:

- **Hypotheticals and intentions:** the operations sketch's “Discussion: design,
  shared context, and hypotheticals” separates existing accounts, supplied designs
  and conditional interpretations. These are earlier exploratory proposals to
  reconcile with the current adopted modality model before reuse.
- **External-agent context:** the same discussion considers AGENTS.md conventions;
  instructions to use context do not prove an agent received or saw a correction.
  The reference-surface sketch's “Inputs and participants” identifies who supplies
  each input and requests analysis. Its “Optional later beat” considers repository
  changes separately from a fixed-basis reference surface.
- **Operation vocabulary:** “Vocabulary encountered and limits” in the operations
  sketch records Focus/Show/Explain/Compare and the gaps of generating alternatives
  and expressing human intentions. It is exploratory notation, not implemented CLI.
- **Scenario selection:** “First sketch and why it was reconsidered” and “Current
  open-issue candidate” in the first-investigation note retain the monitoring/
  notification-failure alternative and the issue #80 candidate assessment.

The old reference-surface sketch also describes an external interactive HTML mockup.
That prototype is not a repository-retained artifact; the archived sketch preserves
its intended behavior, not a reproducible implementation or a usability result.

<a id="further-studies"></a>
## Unselected follow-up studies

These remain options, not prerequisites or commitments:

- A second Cockatiel investigation, such as an overall retry/time budget, could
  test cumulative understanding. Both participants would now have familiarity;
  it would not recreate first-time orientation. The earlier candidate used a
  two-second illustrative budget to separate stopping the wait, preventing later
  attempts and stopping underlying work.
- A different unfamiliar project could test transfer, while introducing project
  differences that complicate attribution.
- A clean agent given only the working account could continue investigation or
  reconstruct views. Record actual supplied context; the picture experiment showed
  that absence of the original dialogue does not establish complete isolation.
- A short natural-use exercise could make the operating model readily available
  and follow the human's chosen questions, instead of enforcing the retrospective
  sequence. It could examine cues, persistent reference use and correction notice.

Another candidate uses a real historical policy addition to select a fixed baseline.
Designer use of history to choose a case is distinct from adding historical-analysis
capability to the product. The 2026-10-14 metadata inspection identified:

| Addition | Commit | Pre-addition baseline |
| --- | --- | --- |
| Bulkhead isolation | `351b094fc042e15a94029b148054d3ce210522ea` | `2fa5d8508d7d5ff9310102a27b984ec6705b123d` |
| Timeout | `ad38b5580d69b623638e9e1fa24d367704b55812` | `351b094fc042e15a94029b148054d3ce210522ea` |
| Fallback with composition | `ee4768448263e8dcc0a0039f7d076084cf0e5f68` | `443d055e79eba641b726ae49bd466c109d6a61d0` |

All three additions are from the project's first week; those small early baselines
are weak tests of orientation in a mature codebase. The pre-bulkhead tree and README
were inspected, but no build, runtime test or
PostCode run of those early baselines was performed. Analyzer compatibility remains
to be assessed. Keep later patches outside the investigated inputs, and do not use
the eventual implementation as a uniquely correct answer. Initial case selection
was not blind.

For any later study, choose observations to answer the actual research question.
Usefulness can include understanding a relationship, noticing a changed assumption,
asking a relevant question or resuming with less reconstruction. Fewer steps,
correct rendering or a predetermined endpoint is insufficient evidence on its own.
See the adopted [research-question-driven observation decision](../../docs/decisions/research-question-driven-observation.md)
for the governing research-capture distinction.
