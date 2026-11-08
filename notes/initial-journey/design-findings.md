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

The pre-bulkhead tree and README were inspected, but no build, runtime test or
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
