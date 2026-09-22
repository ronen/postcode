# Explorative module summary

Discussion captured: 2026-09-22, from exploration on 2026-09-21–22.

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
or accumulated understanding should be used. These questions remain open; the
assistant's proposed answers are recorded below as recommendations rather than
accepted decisions.

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

## AI integration and a smaller first experiment

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

When the human questioned the size of this new infrastructure, the assistant
proposed separating the usefulness experiment from product integration:

1. Assemble a fixed evidence package for one module, including captured source,
   documentation, exports, dependency context, and qualifications.
2. Supply it with fixed instructions to a fresh external AI session.
3. Retain the exact inputs, instructions, response, and available model metadata
   as experimental artifacts.
4. Compare the interpretation with an evidence-only account, and try one deeper
   follow-up to discover what evidence or structure is missing.

This could be a planning experiment before any product implementation. It would
defer provider integration, autonomous tools, interpretation persistence, navigation
machinery, and a general explanation schema. It has not been authorized for
execution. The current planning conversation would be a poor clean evaluator or
synthesis condition because it already contains architecture knowledge and the
human's preferred explanation.

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

Possible later policies include continuing context for elaboration, fresh assessment
for challenging an explanation, and explicit revalidation after code changes. No
universal session policy has been chosen.

## Product integration questions retained for later

These concerns arose before the smaller experiment was proposed. They remain
important if product integration proceeds, but are not prerequisites for building
a general framework now.

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
facts. PostCode's familiar `evaluation` module could be formative, followed by an
unfamiliar subject before claiming broader usefulness.

Focused conflicting-documentation and changed-input cases could test qualification
and stale-result handling. Better prose accompanied by poorer calibration should
count against the approach. No evaluation protocol or acceptance threshold has yet
been agreed.

## Scope boundaries and next open choices

The discussion does not justify a universal natural-language reasoning framework,
autonomous workflow, durable semantic memory, canonical responsibility taxonomy,
runtime/history/test-intent analysis, or GUI. New capabilities should follow a
demonstrated investigation need.

Before an experiment or implementation is selected, clarify:

- What exact evidence package and question make the first experiment useful?
- Which synthesis and session conditions are worth comparing first?
- How much explanatory structure is needed to make one follow-up traceable?
- What observations would justify proceeding to product integration?
- Which identity, capture, provider, and lifecycle choices does that demonstrated
  integration actually require?

Related exploratory material: [candidate capabilities](candidate-capabilities.md).
The completed [module dependency task](../records/tasks/2026-09-16-module-dependencies.md)
and [latency task](../records/tasks/2026-09-21-analysis-latency.md) describe available
infrastructure and its limits; they do not authorize this next investigation.
