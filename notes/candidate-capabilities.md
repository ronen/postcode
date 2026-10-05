# Candidate Capabilities

This non-governing inventory keeps possible future analyses, lenses, presentations, and interactions visible when considering future implementation steps. Entries are possibilities, not requirements, accepted design decisions, roadmap commitments, scheduled work, or authorization to implement. They may be refined, combined, or rejected before implementation.

The [backlog](../docs/backlog.md) records broader worthwhile work and concerns; this inventory gives exploratory product capabilities room to retain their questions, evidence distinctions, and open alternatives. Inclusion here assigns no priority. Any selected capability still needs the applicable planning, decision, and task authorization before implementation.

## Investigation across changing repository states

PostCode could continue an investigation as the repository or worktree changes,
showing which earlier findings remain applicable and which need reconsideration.
When an input changes, analyses that depended on it need reconsideration before
their results can be treated as accounts of the new state. That status could
propagate through results derived from those analyses. The existing mechanism
that marks interpretations for reconsideration after a cited account is
corrected offers a related pattern, but its citation links do not establish
which analyses depended on an input. A changed input is not itself a correction
of a prior result, which can remain valid for the state it analyzed.

This would require a qualified relationship between program states, captured
inputs, and subjects across those states, plus a policy for new analysis and
earlier results. Distinguish a result about the old state, a result known to be
affected by a change, and a result whose continued applicability has not been
established. The current session instead assumes unchanged relevant inputs and
invalidates on detected change. Open questions include change detection,
dependency tracking (including negative lookups and configuration), subject
correspondence, selective re-evaluation, and whether continuity belongs within
one session or across sessions.

## Visual and structured qualification

A graphical interface could use a consistent visual vocabulary for
epistemological qualifications, such as badges or symbols for mechanically
derived results, recorded assertions, observations, and interpretations, with
additional signals for scope, partiality, and limitations. The aim is to make
important distinctions legible at a glance without repeating explanatory prose
beside every result. Visual marks would still need accessible names and a way
to inspect their precise meaning, evidence, and exceptions; one icon cannot
stand for all dimensions of a claim's qualification.

Explore whether investigators should report some qualifications using a small,
well-defined set of fields or categories in addition to prose. Such a vocabulary
could support consistent display, filtering, and validation. Possible dimensions
include which evidence sources were examined, how deeply an investigator
followed relevant relationships, whether behavior was observed in executions,
and how much of a defined population was covered. Depth and coverage may admit
grades; evidence kinds need not form a stronger-to-weaker order. A graphical
view might show these dimensions with compact marks or gauges, provided their
meaning includes method and scope rather than implying a single overall strength.

The useful dimensions and grades need investigation. A name alone can support a
claim about the name but little about behavior; examining code and documentation
can support an interpretation without establishing that it is correct; executing
the program establishes observations about those runs, not complete knowledge of
all behavior. Likewise, "one level deep" depends on which relationships were
followed, and "the entire codebase" requires a defined, demonstrably covered
population. A generic 1–10 confidence score used as the sole qualification
would collapse these distinctions.

A graded self-reported confidence score could still be useful as its own
dimension: it would say how confident the investigator is in its interpretation,
not how much evidence was examined or what guarantee that evidence supplies.
Its scale, calibration, and presentation would need testing; a high score would
not strengthen what the evidence and method establish.

For mechanical analyses, some method-specific grades can be defined before
formative use: for example, whether a declared population was completely
processed, whether a relationship was resolved, or whether an evaluation
materialized fully or partially. These report distinct properties, not one
universal strength ranking. A provider contract could report grades intrinsic
to its method; a higher-level summary analysis could derive grades that combine
qualified results or assess coverage for a particular question. A summary's
grade would need its own method and qualification and could not silently turn
provider results into a stronger guarantee. Which grades belong at either
boundary remains open.

Formative use of qualified views and investigator reports can show which
distinctions people find informative, confusing, or missing, and guide any
broader categories, subjective-confidence scale, or visual marks. There is no
need to settle a universal vocabulary or iconography in advance.

## Explorative dependency landscape

A dependency-landscape lens could show how organizational regions depend on one
another, which module relationships support those connections, and where a human
might zoom in next. It would occupy a scale between repository organization and
individual module dependency relationships.

One candidate derivation uses the direct child groups of a selected organization
group as the current regions, then aggregates qualified module dependency
occurrences across those regions while retaining the supporting module pairs,
mechanisms, placements, evidence, and evaluation outcomes. A related local
dependency structure could expose collaboration among modules within one selected
group boundary. Neither result would establish canonical architectural units,
intended layers, API boundaries, cohesion, importance, or architectural quality.

The usefulness and exact semantics remain unsettled. Open questions include the
right organizational frontier, treatment of modules placed directly in the
selected group, multiply placed or multiply parented regions, useful boundary
summaries, and whether visual collapsing of the existing dependency graph already
answers much of the need. The capability may warrant visible formative status
while its value is being tested, without weakening the epistemological guarantees
of its mechanically derived claims.

The detailed derivations, alternatives, difficult cases, and open questions are
preserved in the [dependency-landscape notes](dependency-landscape.md).

## Explorative 5WH summary

The approved [module investigation plan](../docs/plans/module-investigation.md)
includes a terse `summarize(module)` focused on apparent functionality,
responsibility, significant mechanisms, cases, and delegation, with selectable
follow-up investigations. That covers much of **What** and some **How** without
requiring a 5WH template. This entry retains the broader candidate questions
and possible forms beyond the plan's scope.

A 5WH-style summary could help a human explore an entity through several complementary questions:

- **What:** What behavior, responsibility, or capability does it provide?
- **Why:** What requirement, rationale, or need explains its existence?
- **How:** What conceptual mechanism or collaboration produces its behavior?
- **Who uses it:** Which entities, actors, or external systems depend on or invoke it?
- **When it is used:** Under what events, states, workflows, or lifecycle phases does it participate?

**Where** is also part of 5WH, but an appropriate meaning in this context has not yet been identified. A useful interpretation remains welcome; none needs to be invented merely to include all five W's.

### Evidence and qualification

Answers could have different epistemological bases, even within one question:

- **What and how** could draw on program structure, documentation, tests, observations, or interpretation. A conceptual explanation may go beyond what structure alone establishes.
- **Why** could draw on recorded rationale, requirements, documentation, or interpretation. A recorded explanation establishes what was asserted, not necessarily the actual or continuing reason for the entity's existence.
- **Who uses it** could be mechanically derived where supported, with static-analysis scope and limitations visible; discovered callers or dependents need not exhaust actual users.
- **When it is used** could require runtime observations or qualified control-flow analysis. Observed participation and possible participation establish different things.

Each answer could disclose its evidence, method, scope, and limitations, preserving the distinctions in the governing [core concepts](../docs/core-concepts.md) and [architectural constraints](../docs/architectural-constraints.md).

### Possible form and open choices

This need not become a rigid schema or a single monolithic analysis. Possibilities include a parameterized summary presentation or a summary assembled from narrower lenses. The questions and information requested would remain lens concerns; layout and disclosure would remain presentation concerns. The composition and parameter choices remain open.

The summary could omit inapplicable questions, report unavailable answers explicitly, and let the human expand each answer into its supporting evidence. Omission would not imply an established negative answer, and a compact presentation would retain consequential qualification.

## Responsibility-focused investigation

A focused question for a module, function, or other component is: **What is it
responsible for?** The implemented `summarize(module)` already addresses apparent
responsibility as part of a broader account and permits mixed or unclear
responsibilities. A focused investigation might be useful when that question
deserves more attention than a terse summary can give it.

The answer might identify one responsibility, several distinct responsibilities,
or an unclear boundary. It should explain the behavior or outcome attributed to
each responsibility and how the subject performs or delegates it, with supporting
evidence and limitations. Neither a singular name nor the presence of several
activities establishes whether the subject follows the single-responsibility
principle; that judgment depends on which activities change for the same reason.

This could be a focus of `summarize(subject)`, a follow-up investigation, or a
narrower lens. Its useful scope and form remain open, especially for functions
and components beyond the currently supported module-summary subject.

## Qualified subject search

PostCode could find subjects with a specified characteristic across a declared
population. A query over already established facets or other qualified results
may need no new analysis. A query that examines subjects not yet assessed would
need Evaluation, potentially on demand, rather than a Presentation filter that
silently treats missing information as a negative result.

Results should distinguish established matches, assessed non-matches, and
unassessed or unavailable subjects, with population coverage and each finding's
qualification visible. Some characteristics may be mechanically established;
others, such as having several distinct responsibilities, require interpretation
and may remain unclear. A failure to identify one responsibility is not itself
evidence that the subject has several or violates the single-responsibility
principle. The useful query vocabulary and treatment of partial evaluation
remain open.

## Scoped audits across subjects

An audit could ask a criterion-driven or exploratory question across a selected
population and report supported findings, exceptions, and coverage. Unlike
search for a known characteristic, an exploratory audit might discover patterns
or formulate candidate concerns while examining subjects. A free-form request
could help choose the question, but it would still need a bounded scope,
explicit method, resource limits, and qualified results. An absence of reported
findings must not be mistaken for an established clean bill of health.

Assessing several subjects in one investigator dialogue might reduce repeated
setup and context cost, but it is an execution choice rather than a different
epistemological guarantee. Each subject-level finding needs attributable
evidence, method, qualification, and outcome; shared context must not obscure
which subjects were examined or how thoroughly. Whether a general audit Lens,
more specific Lenses, or a composition of existing capabilities is useful
remains open.

## Human contributions to interpretation and investigation

A human could challenge an explanation, contribute rationale or other program
knowledge, choose a preferred working account, or clarify the focus of an
investigation. These contributions have different meanings and should not all
become undifferentiated feedback or program facts.

For example:

- “That explanation is wrong” could prompt reconsideration without itself
  establishing a correction.
- “This exists because we needed X” could supply a recorded rationale assertion
  with human provenance, not mechanically established truth or continuing purpose.
- “Use this explanation as the current account” could select a working
  interpretation without strengthening its epistemological status.
- “I am interested in cancellation rather than scheduling” could refine the
  investigation without making a claim about the program.

### Provenance and subsequent use

Preserve what the human contributed separately from what PostCode subsequently
did with it. A contribution could identify its author, the relevant subject,
result or explanation part, the program state, and enough conversational context
to remain intelligible. Later interpretations could reference it as evidence;
revisions and choices of a primary explanation would remain separate actions.
Human endorsement does not turn an interpretation into a derived fact.

A contribution could remain retrievable after code changes without automatically
applying to the new state. Earlier assertions and preferences may be relevant
context, but their continued applicability and subject correspondence need
qualification rather than silent inheritance.

### Storage and open questions

Possible homes include durable investigation context for feedback, focus and
preferences; addressable assertions for contributed program explanations; and
the observation stream for evidence of the interaction. These could share
physical storage without sharing meaning, validity or retention policy. The
current observation sink alone does not supply retrieval for later investigation
or establish a durable program-knowledge lifecycle.

Open questions include how the human targets a contribution, how contributions
are retrieved and selected for later synthesis, how disagreement and revision
are presented, what persists across investigations, and how stale applicability
is detected or disclosed. Storage, retention, editing, and deletion policies
remain unsettled. This is future capability exploration, not a requirement to
add human-contribution storage to the first interpretive summary slice.

## Historical summary

An exploration of an entity's history could address both authorship and chronology and the substance of particular changes:

- **Who:** Who introduced or subsequently worked on it?
- **When:** When was it introduced, and when did consequential changes occur?
- **What:** What did they change or achieve?
- **Why:** What need, problem, or rationale motivated the change?
- **How:** What mechanism or approach produced the change or its effects?

Historical authorship and change chronology are distinct from the operational users and circumstances of use explored by the [5WH summary](#explorative-5wh-summary). They could complement that summary without substituting for its operational answers.

Answers could draw on Git, related development records, comparisons of program structure, tests, and runtime observations, qualified by available history, attribution, and correspondence of the entity across revisions. A claimed outcome might be measured or merely recorded; motivation might be documented or interpreted; and a mechanism might be derived from the implementation change. Evidence of the mechanism alone would not establish its effects or motivation. Identifying a change as consequential may itself involve interpretation.

As with the operational summary, these questions need not form a rigid schema or a monolithic analysis. Each answer could be expanded into its supporting evidence, with its method, scope, and limitations visible; inapplicable questions could be omitted and unavailable answers reported explicitly.
