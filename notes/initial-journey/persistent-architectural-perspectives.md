# Persistent architectural perspectives

Recorded: 2026-11-03
Status: working direction for the next sketch; non-governing exploration

## Purpose and basis

Build on the [Cockatiel investigation](readiness-investigation-dialogue.md) and
[picture experiment](pictures-result-review.md) to investigate whether retained,
qualified architectural understanding makes reasoning easier or more reliable
than capable agent chat with repository access, diagrams, and retained notes.
This follows [JOURNEY](../upcoming-work.md#journey). The initial dialogue reached a
useful design judgment through prose; the pictures demonstrated some reuse of the
account, but did not establish an improvement in reasoning or initial learning.

The revised [product design](../../foundation/product-design.md) and
[application specification](../../docs/app-specification.md) establish architectural
understanding without programming-language literacy and accumulation across
investigations. The human may bring substantial design judgment while being
unfamiliar with a project. The next episode should support that judgment and the
ability to challenge the agent's framing.

## Help frame the investigation

PostCode could help turn an initial concern into architectural questions using
established concepts: responsibility, boundary, ownership, state, interaction,
contract, and concurrency. These perspectives can cue consequential questions
before the human knows enough about the project to formulate them independently.

For the Cockatiel readiness discussion, possible prompts include:

| Perspective | Architectural question |
| --- | --- |
| Responsibility and boundary | Does Cockatiel manage jobs, or govern execution of work owned by the application? |
| Ownership | Who owns the work, recovery timing, and decision to submit another operation? |
| State | Does an open breaker describe its last transition, or whether it would currently admit an attempt? |
| Interaction and concurrency | What happens to other calls during a recovery trial, and how does composition order affect waiting? |
| Contract | Does readiness report an observation, announce eligibility, or reserve permission to execute? |

These are retrospective examples from the dialogue, not demonstrated PostCode
framing output or a required taxonomy. A proposed framing should explain why a
perspective matters, remain qualified, and allow the human to question it or ask
something else. Fewer conversational exchanges alone would not establish success.

## Persistent perspectives and changing scope

The emerging interaction idea is a subject or concern with several recognizable
architectural perspectives that remain available through the investigation. Tabs
are one possible expression. A perspective could contain prose, a diagram,
questions, evidence, qualifications, or unresolved points; its presentation format
is not settled at this level.

The perspective remains recognizable while the account develops. The human can
return to "what we understand about ownership" after investigating recovery and
see what has been added, challenged, or revised. Earlier answers remain accessible;
a revised account must not silently rewrite what was previously shown. Here
persistence means continuity during the investigation, without deciding storage
across sessions.

Distinguish two movements:

- **Change perspective:** keep the subject and examine a different architectural
  concern, such as its responsibilities, state, or contract.
- **Change scope:** investigate something within the subject or expand into the
  context that gives it meaning, preserving the perspective where applicable.

The human proposed both a fresh-repository entry showing top-level concerns and a
focused entry around an issue, with navigation inward and outward. The focused
subject need not be one module: a concern may span several implementation parts.
For Cockatiel, expanding context could reveal application ownership, callers, or
composed policies. "Up" is therefore not necessarily a parent directory or a
single architectural hierarchy. Proposed context should say what relationship
makes it relevant.

Context might determine the initial perspectives. How that selection happens,
how the human finds other perspectives, and how stable the set remains are open.
A stable set for one episode with suggestions to add perspectives is an agent
proposal to try, not an accepted interface rule. If a perspective does not apply
at a new scope, explain the limitation rather than inventing content.

Discovering useful top-level concerns is itself an analytical capability to
establish. Neither a project summary nor a dependency landscape is a mandatory
entry point or an assumed solution.

## Role of diagrams

The direction is to try a representation where visual structure might contribute
to architectural reasoning, without making diagrams necessary for every
perspective or deciding that they are essential to the first implementation.
An interaction view could expose waiting and resource ownership; a state view
could clarify eligibility and transitions. Established notation, spatial
arrangement, boundaries, and repeated identities may carry useful meaning as well
as pictorial icons. The earlier preference for pictorial explanation remains
worth exploring without excluding conventional architectural diagrams.

Evaluate whether a representation helps the human notice a consequential
relationship, formulate a question, or compare alternatives. Faithful rendering
or an attractive illustration of an already understood answer is insufficient.

Changing perspective may require new investigation. A structural account cannot
supply missing temporal semantics merely because an interaction diagram needs
them. Presentation must preserve qualifications and avoid strengthening claims.

## Candidate episode and questions for the sketch

A candidate progression is responsibility/ownership, then waiting or recovery
behavior, then a return to the earlier perspective. The organizing questions are:
**what carries forward, what requires new investigation, and what is revised?**

We could reconstruct a small portion of the recorded Cockatiel dialogue to supply
concrete material, then introduce a new concern, such as the previously identified
overall time-budget question, to test reuse without already knowing the answer.
Neither a new issue nor that specific issue is selected. Both participants now
have Cockatiel familiarity; a follow-on episode tests cumulative use rather than
first-time orientation. Do not manufacture a correction to demonstrate machinery;
confirmation, extension, and unresolved conflict are also informative outcomes.

The sketch should make these interactions concrete:

1. Enter a concern and consider a small, explained set of architectural perspectives.
2. Investigate one perspective, with evidence and qualifications understandable
   without source-language fluency.
3. Follow relevant surrounding context or investigate a narrower subject.
4. Return to another perspective and distinguish reused understanding, new
   findings, and claims needing reconsideration, with access to the earlier answer.

The human's intended change and design judgments should remain distinguishable
from claims about existing behavior. A meaningful endpoint may include a change
proposal or handoff without requiring the first implementation to deliver it all.

## Capability position and unresolved design

Main at `b9599a3`, merged into this planning branch as `102a2e2`, includes
[exact retained-answer presentation](../../docs/plans/exact-retained-answer-presentation.md):
the shell can redisplay an exact answer with frozen supporting selection through
`present`. This provides part of the continuity needed here, not general graphical
navigation or persistent perspectives. Retention remains Session-local.

The [structured-investigram decision](../../docs/decisions/structured-investigram-content.md)
permits structured or mixed interpretation and requires accumulated architectural
understanding as an intended application capability. The current implementation
still retains prose accounts. The working-account structure, correspondence among
accounts, and selection for a perspective remain to be designed. Investigation
lineage is distinct from architectural relationships, and retaining an account
does not establish its correctness or applicability.

Next determine which concrete account content each interaction needs, what
existing results can supply, and what requires Presentation work or additional
core analysis and retention support. Representative content and manual examples
can expose those requirements before implementation; mark assumptions separately
from actual PostCode results. No GUI implementation, universal account schema,
fixed taxonomy, or implementation-plan breakdown is selected by this note.

## Follow-on sketch assumptions

The subsequent discussion allows a useful partial/tentative initial framing and
perspectives conceptually available from the start, leaving lazy computation and
command discovery out of the first sketch. Begin at the issue with surrounding
context available; a top-level start is not compulsory. Contexts are provisional
UX places to return to, with perspectives across them; their mapping to existing
application concepts is unresolved. Surrounding architectural relationships are
distinct from navigation history, which is supporting UX unless the episode makes
it consequential.

The human proposed trying architectural operations without unrestricted
conversation as an exercise. Discover the basic vocabulary through the existing
dialogue rather than choosing it in advance. Assume the human can issue available
commands and select offered targets, while remaining unfamiliar with Cockatiel.
Record unexpressible intentions and capability gaps before inventing new commands.
The [first operations sketch](cockatiel-conceptual-operations-sketch.md) carries
this out with concrete illustrative answers and an explicit account of its limits.
Contextual conversation remains a possible product interaction; this experiment
does not reject it or establish command-only sufficiency.

The [2026-11-04 follow-up](cockatiel-conceptual-operations-sketch.md#design-context-and-hypotheticals)
distinguishes existing-system investigation from collaborative design, records
shared external-agent context as a sketch assumption, and considers supplied
hypotheticals as a possible further input to architectural investigation. None of
these discussions selects hypothetical support as a first-slice requirement.

<a id="always-available-reference-surface"></a>
## Always-available reference surface

Recorded: 2026-11-05

The human proposed PostCode remaining available beside the design conversation,
with persistent panels as a reference onto the software and its architecture.
Repeated CLI requests would be cumbersome for this use. A graphical or terminal
surface could support glancing, referring, and occasional focused investigation,
without continually demanding the human's attention. The operation vocabulary
still describes capabilities, but need not dictate a request/response rhythm.

During development some panels might follow repository changes. Availability,
currentness and exact-answer continuity are distinct: change detection does not
establish architectural impact, new analysis must retain its basis and limitations,
and a discussion reference must not silently change meaning. Fixed accounts and
following panels are possible preferences; notification policy, automatic work
and cross-change lifecycle remain unresolved capabilities.

The [reference-surface storyboard](cockatiel-reference-surface-sketch.md) reworks
Cockatiel with an operating-model panel, a focused architectural panel, and a
separate design conversation. It includes selected shared references, proposal
inspection, corrections, the return to ownership, and a clearly hypothetical
later repository-change beat. It is a design exercise, not a GUI implementation.

In follow-up, the human emphasized presentation quality as a possible determinant
of usefulness, challenged any requirement for exactly an overview and a focused
panel, and requested explicit operation/input attribution by participant. The
storyboard now treats those panels as an example arrangement, permits other
supported views to be opened and arranged, and records who supplies material,
requests analysis, displays accounts and shares references. The surface is labelled
PostCode; the activity trace is a sketch annotation outside the product UI.

<a id="established-concepts"></a>
## Established concepts as account-design resources

Recorded: 2026-11-06

The human's "operationalizes established concepts" framing applies to what
PostCode can represent, investigate and connect, not just tab labels. Established
architecture resources can inform account content, relationships, supporting
context and presentation. The human explicitly rejected making PostCode or this
journey follow a particular formal methodology. The
[concepts and accounts note](established-concepts-and-accounts.md) preserves the
SEI references and the concrete reassessment of the reference-surface sketch.
