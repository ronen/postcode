# Candidate Capabilities

This non-governing inventory keeps possible future analyses, lenses, presentations, and interactions visible when considering future implementation steps. Entries are possibilities, not requirements, accepted design decisions, roadmap commitments, scheduled work, or authorization to implement. They may be refined, combined, or rejected before implementation.

The [backlog](backlog.md) records broader worthwhile work and concerns; this inventory gives exploratory product capabilities room to retain their questions, evidence distinctions, and open alternatives. Inclusion here assigns no priority. Any selected capability still needs the applicable planning, decision, and task authorization before implementation.

## Explorative 5WH summary

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

Each answer could disclose its evidence, method, scope, and limitations, preserving the distinctions in the governing [core concepts](core-concepts.md) and [architectural constraints](architectural-constraints.md).

### Possible form and open choices

This need not become a rigid schema or a single monolithic analysis. Possibilities include a parameterized summary presentation or a summary assembled from narrower lenses. The questions and information requested would remain lens concerns; layout and disclosure would remain presentation concerns. The composition and parameter choices remain open.

The summary could omit inapplicable questions, report unavailable answers explicitly, and let the human expand each answer into its supporting evidence. Omission would not imply an established negative answer, and a compact presentation would retain consequential qualification.

## Historical metadata

Historical metadata about an entity could answer:

- Who introduced or subsequently worked on it?
- When was it introduced, and when did consequential changes occur?

Historical authorship and change chronology are distinct from the operational users and circumstances of use explored by the [5WH summary](#explorative-5wh-summary). They could complement that summary without substituting for its operational answers.

Answers could derive from Git and related records, qualified by available history, attribution, and correspondence of the entity across revisions. Identifying a change as consequential may itself involve interpretation. Each answer could be expanded into its supporting evidence, with its method, scope, and limitations visible.
