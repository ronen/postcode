# Initial architectural investigation journey

JOURNEY is complete as a design exploration, closed on 2026-11-08. It produced a
plausible architectural reasoning episode and connected account examples that can
inform bounded capability planning. These remain exploratory notes: subsequent
planning can accept, revise or narrow them. Completion approves neither product
requirements nor an implementation plan.

<a id="outputs"></a>
## Primary outputs

Read these in order as needed:

1. [Investigation script](cockatiel-investigation-script.md): the intended experience
   of a human consulting PostCode while considering Cockatiel's breaker recovery
   behavior. It includes the starting situation, selections, displayed information,
   human reasoning and two explicit corrections.
2. [Connected account examples](cockatiel-account-examples.md): a smaller admission,
   half-open trial and policy-composition sequence. It makes request meaning,
   navigable subjects, qualifications, retained answers and a correction concrete.
   This is input to structured-account and presentation planning.
3. [Architectural concept references](architectural-concept-references.md): the
   mnemonic definitions and source grounding used by the examples, distinguishing
   established architectural concepts from PostCode's account-support operations.

<a id="outcome"></a>
## Outcome and limits

The exploration established a concrete design example of PostCode as an available
window onto software. A human can consult the application/policy boundary,
admission and waiting, shared state and individual execution, composition,
recovery transitions and notifications while choosing a direction for further
design. Observation versus reservation, eligibility versus admission, and elapsed
time versus scheduled action are consequential distinctions in that episode.

The artifacts identify candidate requirements for qualified architectural subjects
and relationships, movement between perspectives, additional detail, exact earlier
answers and explicit correction notices. The selected endpoint is a direction worth
investigating, with lifecycle, timer and compatibility questions still open.

What remains assumed:

- The illustrated cross-module accounts can be produced with adequate fidelity,
  coverage and qualifications; they are not actual PostCode output.
- The human can discover and use the offered selections. The smaller examples
  clarify their meaning, but neither the navigation nor its usefulness has been
  tested as a product interaction.
- The staged corrections describe delivery after an error is identified. They do
  not demonstrate reliable discovery or automatic consistency checking.
- This human brings design experience. Reaching the same conclusion, displaying
  the right information, or generating pictures does not establish comprehension
  or benefit for another user.

The script explicitly leaves hypothetical/intended-design analysis, related
architectural comparisons, historical comparisons across program revisions, issue
ingestion and an integrated design conversation for other journeys. Optional
recording of a human preference or choice and revisiting earlier answers over the
same revision remain included. No mandatory summary-first experience, diagram
notation, panel arrangement, universal account schema or GUI has been chosen.

<a id="next-planning"></a>
## Subsequent planning decisions

Use the connected examples to choose a bounded set of account content and
interactions. Decide which subject meanings and relationships need explicit
structure; what can remain prose; how selections request information independently
of private thoughts; and which parts of generation, navigation, qualification and
revision need additional core or presentation capability. Distinguish a new
investigation from presenting an exact retained answer.

Assess those needs against the [current capabilities](../../docs/capability-reference.md).
Existing qualified interpretation, correction and exact-answer support are useful
foundations, rather than proof of the full experience. Use the consolidated
[capability-planning inputs](design-findings.md#capability-planning-inputs) for the
account and navigation map, core/presentation split and conditional prerequisites.
The [implementation-validation checks](design-findings.md#implementation-validation)
preserve concrete evaluation criteria, including both correction episodes. A further full journey is not required merely to use
these examples. Broader sequencing belongs to the strategy/planning work.

<a id="basis"></a>
## Basis and research material

The primary outputs can be read without reading the whole source conversation.
These supporting materials have independent purposes:

- [Cockatiel working account](cockatiel-working-account.md): the first extraction
  of inspected behavior, source citations and limitations at revision
  `f48bea55022ab15ab07eb52a79bfc1e661300fd4`. Preserve it as the input used in the
  account-reuse experiment, including wording later found ambiguous.
- [Original investigation dialogue](readiness-investigation-dialogue.md): the
  actual human–agent exchanges and debrief. It supports research into how questions,
  corrections and gradual orientation shaped understanding, and why the product
  exploration shifted toward retained architectural accounts. It also exposes
  which ideas came from the agent rather than the human.
- [Design findings and follow-up questions](design-findings.md): consolidated
  rationale, orientation and presentation hypotheses, and unselected research
  alternatives from the intermediate sketches.
- [Picture experiment and human review](pictures-result-review.md): evidence about
  reuse of an account and visual communication, with the original artifacts,
  [prompt](pictures-agent-prompt.md) and [visual-reference input](visual-language-references.md)
  retained for traceability. It has not established better newcomer understanding.

The library accounts derive from documentation and static inspection in the
original dialogue, not runtime reproduction. The issue was read on 2026-10-14;
its starting name leads were rechecked on 2026-11-08. The later scripts and account
examples add no independent verification of Cockatiel behavior.

Overlapping walkthroughs, intermediate sketches, the duplicate edited transcript
and the separate visual-research summary were removed at closeout after carrying
forward their useful material. Their evolution remains in Git. The source dialogue's
substantive exchanges, working-account input and received picture artifacts remain
preserved; editorial navigation links have been maintained.

<a id="archive"></a>
## Exact earlier material

The nine removed documents are available at commit
`942475f33198d72397ee1410d6e3ca7f6c72ce4e` (short name `942475f`). Paths below are
relative to `notes/initial-journey/`. These versions preserve the exploration at
that point; later governing decisions and the curated outputs take precedence.

| File at `942475f` | Material to consult when needed |
| --- | --- |
| `first-useful-investigation.md` | Journey method, scenario candidates, original capability and Presentation dependencies |
| `persistent-architectural-perspectives.md` | Scope/perspective movement, persistent reference surfaces and follow-on assumptions |
| `established-concepts-and-accounts.md` | Use of SEI concepts in account design without adopting a methodology |
| `cockatiel-conceptual-operations-sketch.md` | Operation vocabulary, design-agent context and hypothetical/conditional-account discussion |
| `cockatiel-human-postcode-walkthrough.md` | Verbatim questions, concept selections and earlier capability breakdown |
| `cockatiel-information-and-judgment.md` | Detailed before/after reconstruction, account requirements, navigation findings and validation checklist |
| `cockatiel-reference-surface-sketch.md` | Participant/input attribution, external-agent reference surface and optional repository-change beat |
| `cockatiel-dialogue-standalone.md` | Edited shareable version of the first 30 exchanges |
| `pictorial-representation-research.md` | Original visual-research shortlist and its proposed comparisons |

Read any file from a repository checkout with `git show`, for example:

```sh
git show 942475f:notes/initial-journey/cockatiel-conceptual-operations-sketch.md
```

<a id="historical-visual-shortlist"></a>
### Original visual-research shortlist

The dialogue's “research shortlist and implications” link refers to the original
`pictorial-representation-research.md`, rather than its later consolidation:

```sh
git show 942475f:notes/initial-journey/pictorial-representation-research.md
```

The [consolidated visual precedents](design-findings.md#visual-precedents) are a
separate current reading aid. This archive pointer preserves which document the
recorded message referred to without implying the two texts are identical.
