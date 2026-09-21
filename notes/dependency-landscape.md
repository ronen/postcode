# Dependency landscape working notes

Status: working notes; durable but non-governing
Started: 2026-09-16

These notes preserve early investigation of a possible dependency-landscape
slice. They are not a plan, decision record, governing concept revision,
implementation authorization, or task record. There is intentionally no
`proposal/` package yet.

The concise product candidate is listed in
[`candidate-capabilities.md`](candidate-capabilities.md#explorative-dependency-landscape).
These working notes retain the detailed derivations, alternatives, difficult
cases, and open questions rather than moving that material into the inventory.

## Why this investigation is separate

The module-dependencies slice establishes the dependable substrate:

- direct module relationships supported by retained source occurrences;
- project-level module graph structure;
- focused navigation to dependency children and dependency parents;
- mechanism, type-only, resolution, and coverage qualifications; and
- organization-relative properties of individual dependency relationships.

That slice answers where a module sits in the direct dependency structure and
where a human can navigate next. This is independently useful, but it remains a
module-by-module view. A bounded graph beginning at module dependency roots is a
way to move among trees; it does not necessarily reveal the overall landscape.

The dependency-landscape investigation asks whether PostCode can provide a useful
higher-level map after both module dependencies and repository organization exist
as established infrastructure. Keeping the investigation separate prevents
unsettled aggregation and interpretation questions from delaying the dependency
substrate.

## Product motivation

The emerging product question is:

> How do the project's organizational regions depend on one another, which
> module relationships support those connections, and where should a human zoom
> in next?

The desired scale lies between repository organization and individual module
relationships. Organization says which code has been placed together. Module
dependencies say which modules directly refer to which other modules. A landscape
could compose those facts to expose broader regions and their connections without
claiming that repository layout establishes intended architecture.

The word **block** is not yet preferred. It is overloaded by lexical blocks,
compiler basic blocks, and graph-theoretic blocks, and it may imply that PostCode
has discovered canonical architectural components. **Region** is useful working
language for an organizational area shown in a landscape, not a new accepted
entity kind.

## Candidate dependency-landscape lens

Treat the landscape as a separate lens rather than a presentation that merely
collapses module nodes. The subjects and relationships change from modules and
module relationships to organization groups and qualified group-to-group
dependency relationships.

A candidate exact derivation for a selected organization group is:

1. Use its direct child groups as the current organizational regions.
2. Relate captured dependency occurrences to regions through their established
   source and target placements.
3. Establish a directed region relationship when one or more supported direct
   module relationships cross between two regions.
4. Preserve every supporting occurrence, ordered module pair, mechanism,
   qualification, placement, and evaluation outcome behind the aggregated
   relationship.
5. Keep modules placed directly in the selected group explicit rather than
   silently assigning them to a child region. Their eventual representation is
   unresolved.
6. Descend into a child region to repeat the operation at the next organizational
   level.

This produces a natural scale progression:

```text
project dependency landscape
    -> group dependency landscape
    -> local dependency structure [explorative]
    -> module dependency children or parents
    -> supporting source occurrences
```

The landscape must remain exact. Do not select or rank “important” regions using
fan-in thresholds, density thresholds, centrality cutoffs, community detection,
or other unaccepted heuristics. Exact structural information can include region
roots, incoming and outgoing region relationships, convergence, boundary modules,
supporting relationship counts, and disclosed omissions. Which features matter
remains a human interpretation unless a later decision defines more.

## Local dependency structure

**Local dependency structure** is a candidate property of an organization group.
Under the selected organization scheme:

- select project modules placed in the group or its descendants;
- select direct dependency occurrences whose established source and target
  placements are both within that boundary;
- preserve the directed internal graph; and
- derive its weakly connected components and isolated selected modules.

Cross-boundary, opaque external, and platform relationships remain separately
available as boundary information. They do not connect modules in the local
structure, but they are not erased from the complete dependency projection.
Multiple, ambiguous, partial, or unavailable placement evidence qualifies the
result.

This absolute boundary-relative derivation avoids defining shared modules by a
numeric threshold. A module with several dependency parents inside one group may
be central to that group. An ambient declaration does not by itself establish
shared use. Platform origin, external origin, multiple dependency parents, and
use across organization branches remain distinct facts.

Local dependency structure does not establish that a group is a conceptual unit,
cohesive, encapsulated, self-contained, correctly organized, or architecturally
sound. It is intended to test whether internal collaboration structure helps a
human recognize something unit-like while leaving external services such as
filesystem access or repository-wide logging as boundary context.

Whether local dependency structure is best modeled as a group property, a
standard expansion, part of the landscape projection, or a separate lens remains
open.

## Explorative capability

Candidate core terminology:

> **Explorative:** an analysis or capability whose results have an explicit,
> qualified epistemological basis, but whose usefulness for human understanding
> has not yet been established. An explorative capability is implemented and
> visibly identified so that formative use can reveal where its results are
> informative, irrelevant, misleading, or require refinement.

Explorative describes product maturity and purpose, not weaker confidence in a
result. Claims produced by an explorative capability retain the ordinary
requirements for evidence, provenance and method, scope, epistemological
guarantee, limitations, and evaluation outcomes. Formative use does not itself
strengthen a claim or establish an interpretation.

Use `[explorative]` as the candidate compact human-facing label. The uncommon word
is intentional: it can carry a precise PostCode meaning without colliding with
experimental schemas, experimental trials, or general exploratory activity.

Alternatives considered in discussion:

- **experimental** collides with schema maturity and later product experiments;
- **trial** can be confused with an evaluation run or experimental trial;
- **hypothetical** and **tentative** imply uncertainty in results whose derivation
  may be exact;
- **provisional** emphasizes likely replacement rather than formative evaluation;
  and
- leaving the status implicit could make an exact result look like an adopted
  architectural interpretation.

The dependency landscape and local dependency structure are candidate
explorative capabilities. This core term should not be adopted merely to support
working notes. If a later proposal uses it, the proposal should include the exact
capability semantics, visible qualification, formative evaluation plan, and the
corresponding core-concept decision.

## Relationship to conceptual units

The motivating intuition comes from a common programming practice: a directory
contains one or more primary modules plus sibling or nested support modules, and
together they describe one conceptual thing. Dependencies on platform modules or
shared services do not make that conceptual grouping disappear. TypeScript would
permit the same modules to be scattered and connected through imports, so the
conceptual unit cannot be inferred from dependency edges alone.

Organization and dependencies therefore provide different evidence:

- organization records which code has been placed together conceptually;
- dependencies show how that code collaborates and how other code reaches it;
  and
- a landscape may show how organizational regions interact at a useful scale.

Possible boundary summaries include modules reached by parents outside the
group, modules reached only by parents inside the group, outgoing relationships
to other groups, and external or platform dependency children. These are
mechanical observations about the selected project and snapshot. They do not
establish intended public API, privacy, ownership, layering, or correctness.

Do not introduce a `unit` entity or property until formative evidence supports a
precise and useful meaning. A statement that a group forms a conceptual unit is a
hypothesis, distinct from the exact landscape and local-structure information
that may support it.

## Qualification and difficult cases

The investigation must preserve rather than smooth over:

- modules and groups with multiple placements or containment parents;
- occurrence evidence that narrows one endpoint placement but not another;
- direct modules of a selected group that belong to no child region;
- unplaced and ambiguously placed modules;
- dependency relationships whose occurrences aggregate to different region
  relationships;
- external, platform, unresolved, and target-indeterminate endpoints;
- partial or unavailable organization evaluation; and
- presentation bounds and omitted regions or supporting relationships.

The selected organization scheme and organizational frontier are part of the
requested landscape, not hidden rendering choices. Visual collapsing within an
already selected projection remains presentation policy.

## Open questions

- Is the direct-child-group frontier the right absolute region selection at every
  organizational level?
- How should modules placed directly in the selected group appear beside its
  child regions?
- Does a group-level dependency root provide useful orientation, or merely repeat
  the weaknesses of module roots at another scale?
- Which exact boundary summaries help humans understand a region without
  implying API or layering intent?
- Should local dependency structure appear within the landscape or remain a
  separately requested group property?
- How should overlapping or multiply parented regions be represented without
  duplication or arbitrary ownership?
- What structured result lets a human or clean evaluator compare the landscape
  with their understanding while preserving qualification?
- What observations would justify adopting, revising, or removing each
  explorative capability?
- Is one unfamiliar TypeScript repository enough for formative evaluation, or
  does usefulness depend too strongly on repository organization style?

## Current boundary

There is no dependency-landscape plan or proposal yet. The module-dependencies
slice should expose enough qualified module and organization-relative relationship
information to support this later investigation without implementing landscape,
local-structure, unit inference, threshold-based clustering, or explorative
product semantics.
