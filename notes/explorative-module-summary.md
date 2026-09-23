# Explorative module summary

Discussion captured through 2026-09-23, from exploration on 2026-09-21–23.

This note preserves exploratory product reasoning, not an approved plan, accepted
decision, implementation task, or authorization to run an experiment. The human
authorized recording the discussion in `notes/`. Directions expressed by the human
are distinguished below from assistant recommendations and unresolved alternatives.
The note may evolve or be discarded under the [notes conventions](README.md).

## Product question and direction expressed in discussion

The proposed investigation tests PostCode's central interpretive premise: whether a
qualified synthesis of mechanical facts, recorded assertions, source evidence,
unavailable information, and explicit interpretation helps a human understand a
program subject better than isolated structural views.

The human clarified that:

- **5WH is a convenient framing, not a required template.** The summary need not
  answer every question or organize its output under those headings.
- **Source interpretation can contribute to apparent functionality.** A model can
  read implementation and explain what a module appears to do. Existing structural
  projections need not be the only synthesis inputs.
- **Division of responsibility matters.** An explanation should capture what a
  module contributes and what it delegates, when that distinction is useful.
- **Progressively deeper explanation is a possible future capability.** “Tell me
  more” could expand an initial account into cases, mechanisms, or collaborations,
  and continue into more detail or a selected part of the explanation.

The human also raised whether explicit knowledge representation is needed, whether
new AI infrastructure warrants a smaller first experiment, and when clean sessions
or accumulated understanding should be used. The later discussion chose fresh
requests with explicit context as the starting continuity policy. Other proposed
answers remain recommendations rather than accepted architectural decisions.

## Evidence and the initial subject

A module is a plausible first subject because identity, exports and forwarding,
associated documentation, organization, dependency parents and children, source
evidence, and evaluation outcomes already exist. A module need not correspond to
one coherent responsibility; a mixed or poorly explained role is a legitimate result.

The assistant initially recommended synthesis only from existing qualified records.
The human challenged that restriction, and the discussion shifted to including the
selected module's captured source. The conceptual interface limits what the human
routinely needs to read; it need not restrict what the synthesizer can inspect.

Source can support an interpretation of transformations, conditions, state changes,
delegation, calls, and error handling. This does not establish general behavior or
runtime participation mechanically. The summary should distinguish locally visible
mechanisms from delegated behavior whose implementation has not been inspected.

The existing short source-display excerpts are designed for human disclosure and
may omit essential synthesis context. Source supplied to a model needs explicit
coverage, captured-content identity, and traceable references. Adding arbitrary
repository documentation also requires a defined capture and association method:
the current organization provider recognizes direct README availability, not its
contents or applicability to a member module.

### The `evaluation` example

The module corresponding to [evaluation.ts](../src/lib/evaluation.ts) was examined
as a possible representative subject. Existing dependency and inspection views were
exercised during planning. This was a subject-selection probe, not validation of a
summary capability. No generated interpretation was integrated into PostCode.

The inspected view exposed four exports: the type-role `DiscoveryResult` and
`ModuleAnalysis`, and the value-role `evaluateModules` and
`recordModuleEvaluation`. Associated documentation says language-specific objects
stay behind the analysis boundary and describes a shared discovery-recording path.
These are recorded assertions, not proof of conformance.

The human pointed out the more useful explanatory distinction: the caller supplies
an implementation of the analysis interface; this module invokes it and records
the outcome. A candidate explanation developed in discussion was:

> **Interpretation from source:** This module coordinates discovery and records
> its outcomes. The caller supplies an implementation of the analysis interface,
> which performs discovery; this module invokes that implementation and records
> the discovery and expansion outcomes.

The interface, supplied parameter, invocation, and recording code support this
account without requiring inspection of every analysis implementation. The account
does not establish that language-specific objects never cross the boundary, the
historical reason for this design, or participation in actual executions.

The planning probe also showed incoming dependency relationships from the CLI and
dependency evaluator, type-only incoming relationships, and outgoing relationships
to identity and record modules. Two distinct children shared the handle `records`;
an explanation must preserve identity rather than merge equal labels. Organization
context included same-group and descendant-group relationships. These are layout
claims, not intended architecture. Probe references and counts are not durable
current navigation addresses; any experiment needs a fresh coherent capture.

## Questions as prompts, not headings

The original framing remains useful for detecting opportunities and limits:

| Question | Potential contribution and qualification |
| --- | --- |
| What? | Export surface, attributed documentation, and source-based interpretation of apparent functionality and responsibility. |
| How? | Local mechanism, division of responsibility, and collaboration; dependencies alone do not establish execution sequence. |
| Why? | Explicit recorded rationale where available; apparent benefit does not establish the actual or historical reason for existence. |
| Who uses it? | Direct dependency parents under the configured-project analysis contract; this does not enumerate runtime users or actors. |
| When? | Attributed descriptions or scoped observations if available; current source-request analysis does not establish runtime participation. |
| Where? | Qualified repository placement and structural context, without architectural-role inference. |

The assistant suggested letting the explanation follow the subject, with apparent
role, supporting information, uncertainty, and next investigation as possible
presentation sections. Neither those sections nor a functionality/delegation
taxonomy has been adopted as mandatory.

## Qualification and evidence

The [product design](../foundation/product-design.md),
[core concepts](../docs/core-concepts.md), and
[architectural constraints](../docs/architectural-constraints.md) govern the
epistemological distinctions independently of this proposal:

- Preserve mechanically derived information, recorded assertions, scoped
  observations where available, and explicit interpretation as distinguishable.
- Documentation establishes what was written, not truth, currency, completeness,
  or continuing rationale. Its association with a subject is a separate claim.
- A confident model response or a source citation does not make an interpretation
  mechanically established. Source evidence and the explanation drawn from it
  remain distinct.
- Absence of evidence does not establish a negative. Unavailability, incomplete
  analysis, display omission, and established emptiness retain their meanings.
- Supporting and contrary evidence should remain attributable. Conflicting
  assertions should not be silently reconciled; interpreting a conflict also
  needs qualification.
- Expanding support should first permit qualified conceptual evidence, with
  captured source detail available through explicit disclosure. Model access to
  source is distinct from source actually disclosed to the human.

## Progressive explanation

The human proposed a progression such as “It does X,” followed by “X is classified
into three disjoint cases,” followed by further detail on a chosen case. Repeated
deepening is a useful direction, not a promise of unlimited supported detail.

Two operations may look similar in the interface:

- revealing already-materialized explanatory detail is presentation;
- requesting a deeper account may change the information requested and require
  additional evidence and synthesis.

Each deeper account retains its evidence and qualification. “Three disjoint cases”
is itself a consequential claim, not an innocuous formatting choice. Eventually
the investigation may reach insufficient evidence, opaque dependencies, or no
further useful explanation. It should expose that limit rather than elaborate
unsupported prose.

## Explanation structure versus a semantic model

The assistant distinguished three levels of representation:

1. Existing program records: subjects, claims, relationships, assertions, evidence,
   qualification, and evaluation outcomes.
2. Structured explanation: what a passage concerns, its evidential basis, and how
   it elaborates a particular part of another explanation.
3. A semantic model: explicitly represented responsibilities, mechanisms, cases,
   delegation, invariants, and relationships with defined reasoning semantics.

The provisional recommendation was the second level over the first, without
committing to the third. Arbitrary unconnected text fragments make focus,
traceability, and progressive explanation difficult. A formal program-understanding
ontology would be a much larger commitment than the investigation currently needs.

An explanation part might retain its subject or focus, content, epistemological
qualification, supporting evidence and analysis context, and an elaboration
relationship. Exact granularity and representation remain open. Explanations need
not form one canonical tree: a detail may support several accounts, and competing
interpretations may coexist.

Knowing that one paragraph elaborates another represents the explanation's
organization, not the program's semantics. For the three-case example, storing
three elaborations does not establish mutual exclusion or exhaustiveness. Using
such relationships to reason about an uncovered fourth case would require precise
semantics, suitable evidence and methods, and preservation of inferred premises.

“Explain and support investigation” still permits substantial reasoning during
synthesis. It avoids treating the resulting prose as an authoritative model from
which later answers follow without reconsidering evidence. This is a proposed
boundary, not a settled schema or accepted architecture.

## Interpretation contract and future follow-ups

The human asked whether structured output should anticipate follow-ups. The
assistant proposed a small envelope around natural-language explanation:

- Identify the subject and captured evidence context.
- Give coherent explanatory parts local identifiers, so a follow-up can refer to
  the whole result or a particular part without relying on matching prose.
- Associate each part with evidence references, its qualification, and material
  limitations. Split parts when their support or qualification materially differs;
  do not require a separate record for every clause.
- Let PostCode assign result identities and attach actual execution metadata. The
  interpreting model references supplied evidence identifiers; it cannot confer
  mechanical certainty on its own interpretation.

This is a proposed contract, not an agreed schema. It does not require rigid 5WH
headings, predefined detail levels, an exhaustive decomposition, or a semantic
ontology. Structural and reference validation cannot establish explanatory truth.

### Revision rather than elaboration alone

The human agreed that a follow-up must be able to correct an earlier account, then
asked how supersession would be detected. Text differences alone do not reliably
establish that relationship. The assistant proposed supplying the exact earlier
result and asking the model to distinguish elaboration, qualification/correction,
and an alternative interpretation. An explicit revision would identify the earlier
part, its replacement, what changed, and the supporting reason and evidence.

That revision relationship is itself interpretive. Validating its references does
not prove the replacement correct, and the model can miss a contradiction. A
reconciliation request may help without guaranteeing detection. An account of a
changed code snapshot must also be distinguished from correction of an account of
the same captured code.

The human preferred an explicitly revised explanation to become the primary
presentation, marked as revised, with the original still accessible. The assistant
agreed: preserve the original and the reason for revision; do not treat every newer
response as automatically superior. An unresolved alternative may coexist instead
of replacing an earlier account. A complete revision interface is a future concern;
referable parts would leave room for it. Later scope discussion below considers
including one follow-up and explicit revision in the first slice.

### Human contributions

The human also raised whether users could weigh in and how their contributions
would be retained. This remains a future design question, now recorded separately
under [human contributions to interpretation and investigation](candidate-capabilities.md#human-contributions-to-interpretation-and-investigation).
Feedback, author assertions, and presentation preferences have different meanings;
a contribution and the interpretation changes it prompts should remain distinct.
That capability does not imply a storage or retrieval design for this slice.

## AI integration and the proposed first slice

Source-based synthesis is expected to involve a language model. It does not
necessarily require an autonomous tool-using agent. Alternatives discussed were:

- **Bounded synthesis:** PostCode selects evidence, requests an interpretation,
  validates the response's structure and references, and records it. Such
  validation cannot by itself establish semantic truth.
- **Agent-led investigation:** a model selects further evidence and uses tools
  until it can answer or reaches a limit.

The assistant recommended beginning with bounded synthesis. A human's follow-up
could trigger another bounded request without requiring an autonomous loop.
Provider/API versus external-agent integration, disclosure of repository content,
cost, execution, and failure handling remain consequential open choices.

Earlier discussion proposed a separate usefulness experiment before product work.
The discussion subsequently moved toward using **Astra Light/low as a provisional
starting inference choice**, deferring exploration of inference configurations.
The human proposed this simplification; the assistant recommended a first
implementation slice with an early interpretive-contract check:

1. Review concrete explanations from three fixed evidence packages using the
   starting configuration, checking useful content, structure, and evidence
   references before committing to substantial integration infrastructure.
2. Integrate a bounded module summary: evidence capture, inference, qualified
   results, and textual presentation.
3. Verify the investigation path, including traceability, failures, changed-input
   handling, and observable usage cost.

This is still a proposal. The human explicitly said the conversation was discussion,
not authorization. Neither an implementation slice nor an experiment has been
approved. The uncommitted interpretation-experiments directory was removed at the
human's direction; a separate experimental programme is no longer the proposed
starting path. Full repeated follow-ups, autonomous investigation, and durable
semantic memory need not be part of the first slice.

### Interpreter boundary and access to additional source

The human raised letting the interpreter read the repository to obtain additional
source when needed and avoid supplying oversized inputs upfront. Repository access
and inference location are separate choices: a hosted model can request reads
through local tools, while a local model also needs a tool interface and execution
loop to obtain files. A repository need not be public for the hosted arrangement,
but requested content would be sent to the service. Public URLs alone do not
establish complete access to a fixed repository state.

Selective reads reduce the need for a large initial package but still require
bounds on investigation and retained context. The evidence actually read and its
captured repository state must remain traceable. The assistant recommended bounded
requests for additional source; the exact tools, limits, and initial evidence
package remain open.

The human specified that the interpreter should sit behind an internal API so it
can be replaced fairly easily. The assistant proposed keeping provider-specific
settings, authentication, and tool-call formats behind that boundary, with evidence
access a distinct responsibility usable by either hosted or local inference.
This does not require a general plugin framework or multiple implementations in
the first slice.

The human independently installed Ollama and tried `qwen3.6:27b` on the current
development machine. They reported only a few tokens per second on a simple
question and judged it too slow for practical use. This is a reported limitation
of that configuration on that machine, not a benchmark of local models generally.
Hosted inference remains the provisional starting direction; trying smaller local
models is not a prerequisite.

### Follow-up scope and the shell prerequisite

The human supported a small initial interpretation of one module, and asked
whether follow-up capabilities would reveal enough about its contract to belong
in the same slice. The assistant proposed an initial explanation followed by one
selected-part question, potentially requesting more source and explicitly revising
the earlier account. This would exercise addressability, evidence sufficiency, and
correction. Investigation across related modules and long histories can remain
later work.

The human challenged acceptance bias in the assistant's recommendations. The
material tradeoff is that follow-ups add context selection, earlier-result
references, and revision behavior. Their value in testing the initial contract
does not by itself establish that they belong in the slice. The human also
clarified that slice scope is set before the coding agent starts: an implementation
milestone cannot be used to defer the decision about what the plan includes.
Output review can inform execution within an agreed plan; a scope-changing
experiment would need separate planning and authorization.

The existing CLI does not retain results for a later invocation. Fresh inference
requests still require PostCode to retain the earlier investigation context. The
human suggested implementing and testing internal follow-ups without CLI exposure
as one option. Tests could hold the earlier result in memory; deterministic checks
would verify context assembly and revision references, while actual inference
would be needed to assess interpretive value.

The human then introduced a proposed prerequisite from a separate roadmap
discussion: implement a CLI shell in a separate slice first, allowing a sequence
of views with state retained in memory. This interpretation slice could then
presume the shell exists. The assistant recommended exposing the initial
interpretation and one follow-up through that shell, instead of limiting the
follow-up to tests.

Planning must confirm that the shell's session lifetime can host retained
interpretation results and references, not merely preserve a workspace between
commands. Interpretation-specific context and revision behavior can belong to
this slice. Persistence after shell exit, elaborate conversation management, and
unlimited recursive expansion remain deferred. This is the latest proposed slice
shape, superseding the earlier one-shot-only recommendation; no implementation
has been authorized here.

### Deferred inference-configuration exploration

Local inference means loading model weights and running inference on the human's
machine, without calling an external inference service. For both local execution
and service/model/effort combinations, the feasibility questions are interpretive
value and sufficient value at acceptable cost. Local operation is an additional
property, not evidence of interpretive quality.

The configuration space includes prompts, evidence, tools, session context, and
provider settings; local execution also involves hardware and runtime choices.
Different configurations may benefit from different prompts. An exhaustive search
is impractical, and no acceptable product-cost threshold has been agreed. A bounded
learning budget would be distinct from that threshold. Usage, elapsed time, setup
burden, and local resources could be recorded without inventing a monetary value
where none is available.

The newer proposal defers this comparison until an actual quality, cost, latency,
or offline-use need warrants it. It does not call for a general provider framework,
or make Astra part of the domain model. “Light/low” is discussion terminology;
the exact supported setting and integration mechanism still need confirmation.
Expected usefulness of the starting model is a working expectation, not a measured
result. Bounded evidence, qualification, mechanical-analysis contribution, and
usable output remain substantive uncertainties even if basic synthesis is useful.

## Candidate subjects and selection

The human proposed using three evidence packages from the start, to avoid tuning
only to `evaluation`. The assistant agreed: keep the trio fixed while revising a
shared prompt, inspect regressions on each subject, and avoid an aggregate score
that conceals confident errors. Once used for tuning, these are development
subjects, not untouched validation cases. A later unfamiliar check could test
transfer without expanding the initial search indefinitely.

Purposeful selection seems sufficient for initial learning; it is not a claim of
representativeness. Useful dimensions include mechanism, local versus delegated
responsibility, documentation, manageable complexity, evaluator familiarity, and a
concrete comprehension question that can be assessed. Sparse documentation is a
useful dimension, but was not made a priority over starting with a workable set.
Record what documentation was actually supplied, separately from what exists.

The assistant's provisional trio was `evaluation`, `fsm-engine`, and
`merge-anything`. No final evidence boundaries or subject set have been approved.
Candidates discussed were:

| Subject | Potential learning value | Familiarity and limitations |
| --- | --- | --- |
| PostCode `evaluation` | Invocation and outcome recording versus caller-provided discovery implementation | Familiar to the human and this discussion; useful formative example, poor clean assessment |
| [thingts/fsm-engine](https://github.com/thingts/fsm-engine/tree/main/src) | Meaningful branching, guards, transition actions, and queued reentrant requests | Human-authored; documented; organizational and style familiarity |
| [thingts/execution](https://github.com/thingts/execution/tree/main/src) | Function transformation and shared internal implementation across timing wrappers | Human-authored; similar style confound; not every exported wrapper shares the same base |
| [emittery](https://github.com/sindresorhus/emittery/blob/main/index.js) | Concurrent/serial emission, listener changes, and async-iterator lifecycle | Human used it as a client and once glanced at implementation; sparse comments, not absent; larger subject |
| [merge-anything](https://github.com/mesqueeb/merge-anything/blob/main/src/merge.ts) | Recursion versus replacement and shared implementation with customization | No recalled human use or inspection; comments present; external predicate helpers affect evidence boundaries |
| [async-mutex Semaphore](https://github.com/DirtyHairy/async-mutex/blob/master/src/Semaphore.ts) | Weight, priority, waiting, and release in compact, sparsely commented code | Possible prior human exposure while considering mutex libraries; generic semaphore expectations may bias interpretation |
| [path-to-regexp](https://github.com/pillarjs/path-to-regexp/blob/master/src/index.ts) | Shared token representation across parsing, generation, and matching | No recalled human use or inspection; larger and documented, with higher assessment effort |

The last three came from the assistant's search at the human's request. This
reduces known human familiarity; it cannot establish absence of model exposure.
Source screening did not establish PostCode compatibility or execute package
behavior. Concrete source observations should be kept separate from synthesis
instructions where supplying them would seed the answer. Subject revisions and
exact captured inputs would need to be fixed before any meaningful comparison.

## Mechanical analysis as synthesis input

The human asked whether mechanical results should be supplied to the AI analysis,
or used only to identify the context and question sent to it. The assistant
recommended using them for both purposes, and the human asked to preserve that
discussion. This remains an experimental direction rather than an accepted
integration contract.

Relevant mechanical results can supply information the model might otherwise
reconstruct incorrectly from selected source: resolved module identities,
forwarding relationships, type-only qualifications, dependency parents outside
the supplied source, and analysis gaps. They should remain qualified evidence,
not an interpretation the model must endorse. Established incoming dependencies,
for example, do not establish that the subject coordinates those modules.
Unresolved requests and material coverage limits must not disappear from context.

The proposed default evidence package combines selected source, relevant
mechanical results, documentation assertions, and their respective qualifications.
Selection and consequential omission should be explicit. Supplying every available
record could obscure useful evidence, so inclusion should serve the question.

A useful comparison would hold the subject, source coverage, and question fixed:

- source plus question;
- the same source and question plus qualified mechanical results.

This tests whether mechanical analysis improves accuracy, explanation, or handling
of uncertainty, separately from its value in selecting what to investigate. Which
results help, and whether the additional context introduces distraction or
anchoring, remain empirical questions.

## Clean sessions and accumulated understanding

The human raised when questions should use clean sessions and when an agent should
accumulate understanding. Accumulating evidence is distinct from accumulating
belief in earlier interpretations.

| Approach | Benefit | Risk or cost |
| --- | --- | --- |
| Clean session for each question | Explicit evidence inputs; less conversational anchoring | Repeated work and weaker continuity; still subject to model priors |
| Continuing investigation session | Retains explored subjects, confusion, evidence, and explanatory context | Early interpretations may become unquestioned premises |
| Fresh session with explicit investigation context | Selective, inspectable continuity | Requires a policy for what is carried forward and how it is qualified |

An explicit context could include the current question, inspected evidence, earlier
interpretations labelled as such, and unresolved issues. This need not be durable
semantic memory or a formal semantic model. A clean session is not inherently more
accurate, and consistency in a continuing session is not independent corroboration.

The assistant suggested comparing the same deeper question in a continuing session
and a fresh session given the same source evidence and explicit focus. A further
condition supplying the earlier explanation could help separate its anchoring
effect from the rest of the conversation. Conditions must record what each session
actually received; these comparisons answer different questions and are not
automatically equivalent-input tests.

The human subsequently agreed to start with **fresh requests and explicit
PostCode-controlled context**, citing variability in agents' memory retention.
Each follow-up must receive its question, relevant earlier interpretation and
selected part, and the evidence context needed to continue. Earlier interpretations
remain revisable; including them can still anchor the model, so a fresh request is
not an independent assessment.

The retained investigation record and the context sent for a particular request
are distinct: retaining results does not mean sending the whole history every
time. Selection can initially be simple for one explanation and one follow-up.
Long-history summarization and comparisons with continuing sessions are deferred.
The human suggested revisiting the policy if actual use feels limited by loss of
continuity or memory. This is a starting policy, not a claim that fresh sessions
are universally better.

## Product integration questions retained for later

These concerns remain relevant to the proposed bounded implementation slice.
They do not justify building a general framework in advance.

- **Lens and execution boundaries:** the assistant proposed one composite summary
  lens with an explicit synthesis operation coordinated by evaluation. Existing
  projections retain their meanings; synthesis creates additional interpretations;
  projection construction assembles materialized information; rendering does not
  invoke analysis. A presentation-only evidence assembly remains a useful baseline.
- **Claim representation:** the current implementation's claim-context status is
  mechanically derived, while the governing vocabulary already accommodates
  interpretation. A scoped extension would be needed. Generated interpretations
  should not acquire truth merely by being stored, and observations of PostCode
  use are not observations of the subject program's behavior.
- **Identity:** distinguish a logical request, its evidence and method context, a
  particular generated result, and an execution attempt. The accepted
  [core-concepts decision](../docs/decisions/initial-core-concepts-decisions.md)
  explicitly leaves logical versus materialized projection identity unresolved.
  Generative results make that question concrete.
- **Reproducibility:** preserve selected inputs, exact prompts, reported model
  identity, settings, method versions, and generated output. Claim-changing methods
  must participate in analysis identity. Exact replay of retained output differs
  from regeneration; low-temperature generation does not guarantee identical text.
  Distinct explanations need distinguishable results without invocation randomness
  changing program identity.
- **Execution and cost:** availability, execution, materialization, and epistemic
  status remain separate. Time and token use may be observable while monetary cost
  is unknown. Failure may preserve useful evidence without accepting unfinished
  generated fragments as claims. Budgets constrain execution rather than silently
  narrowing the lens question.
- **Storage and navigation:** inspecting support should not silently regenerate
  the explanation. An explicit result artifact might suffice before a durable
  cache, but its lifecycle would need definition. The
  [observation sink](../docs/decisions/initial-observation-recording-decisions.md)
  is not a summary cache or a source of current program truth.
- **Currency and evidence boundaries:** interpretations remain tied to captured
  inputs; changing code requires revalidation or fresh analysis. Retained results
  must not masquerade as current. Generated output must remain outside subsequent
  repository evidence through the established explicit boundary.

## What would demonstrate value?

The proposed success criterion is whether a human can understand apparent
functionality and responsibility, trace why that account was offered, identify
where it stops, and choose a productive next investigation. Plausible prose,
agreement, and preference alone are insufficient.

Possible comparison conditions are isolated structural views, compact assembly of
the same evidence, and that evidence plus interpretation. Source availability must
be made explicit: an advantage caused by additional evidence should not be
misattributed solely to synthesis or presentation.

Candidate evaluation questions include explaining the division of responsibility,
tracing a consequential conclusion to evidence, resisting an unsupported runtime
claim, and selecting a useful next subject. Record effort, corrections, and
confidence alongside answer quality. Independent implementation inspection can
assess consequential mistakes afterward; evaluator impressions are not program
facts. The proposed fixed trio broadens formative assessment beyond familiar
`evaluation`; it would still not establish broader usefulness on unseen subjects.

Focused conflicting-documentation and changed-input cases could test qualification
and stale-result handling. Better prose accompanied by poorer calibration should
count against the approach. No evaluation protocol or acceptance threshold has yet
been agreed.

## Scope boundaries and next open choices

The discussion does not justify a universal natural-language reasoning framework,
autonomous workflow, durable semantic memory, canonical responsibility taxonomy,
runtime/history/test-intent analysis, or GUI. New capabilities should follow a
demonstrated investigation need.

Before authorizing a slice, clarify:

- What exact evidence boundaries and questions should the initial trio cover?
- What minimum output contract makes interpretations useful and traceable while
  leaving room for follow-ups and explicit revision?
- Does the plan include the proposed initial explanation and one user-facing
  follow-up, and what shell session facilities can it presume?
- What verification demonstrates useful elaboration and explicit correction,
  beyond deterministic checks of context and result structure?
- Which identity, capture, invocation, and lifecycle choices does this bounded
  integration require?

Comparative inference configurations and session policies remain possible later
investigations, rather than prerequisites to this proposed starting point.

Related exploratory material: [candidate capabilities](candidate-capabilities.md).
The completed [module dependency task](../records/tasks/2026-09-16-module-dependencies.md)
and [latency task](../records/tasks/2026-09-21-analysis-latency.md) describe available
infrastructure and its limits; they do not authorize this next investigation.
