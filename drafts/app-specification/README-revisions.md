# Proposed revisions to docs/README.md

Each block below is a complete replacement or addition at the identified destination. Unlisted material remains unchanged.

## Replace the foundation/local-document allocation paragraph

<!-- BEGIN PROMOTION CONTENT -->
Adopted research concepts and baseline development material live under [`foundation/`](../foundation/). This directory contains the human-maintained application specification, governing core concepts and architectural constraints, plans, accepted decisions, supported-capability documentation, and descriptions of the application built from that foundation.
<!-- END PROMOTION CONTENT -->

## Replace “Core concepts”, adding the specification and capability-reference entries immediately before it

<!-- BEGIN PROMOTION CONTENT -->
### Application specification

[`app-specification.md`](app-specification.md) governs intended application behavior, UX, semantic contracts, and high-level architecture within the research foundation. It does not claim full implementation or authorize work. It is human-maintained: agents prepare changes only under explicit human direction during design or planning. Implementing agents report gaps or contradictions rather than changing it during implementation. Consequential changes require accepted decisions.

### Supported capabilities

[`capability-reference.md`](capability-reference.md) describes supported investigations and Views, their meanings, applicability, and limitations. It complements the CLI reference and project status. It does not prioritize particular Lenses as architecture or turn research candidates into delivered capabilities.

### Core concepts

[`core-concepts.md`](core-concepts.md) states PostCode's governing cross-cutting architectural terminology and the relationships necessary to define it. It records what the terms mean now; accepted decision records preserve why the concepts were adopted or changed. Semantic changes require explicit human agreement and a corresponding accepted decision record.
<!-- END PROMOTION CONTENT -->

## Replace “Architecture”

<!-- BEGIN PROMOTION CONTENT -->
### Architecture

Architecture documentation is a selective, descriptive map of how the current system works, not an exhaustive inventory of the implementation or a source of prescriptive requirements. It describes major boundaries, responsibilities, data flows, and operational constraints. Intended high-level responsibilities and guarantees belong in the application specification and governing architectural documents; scoped implementation proposals belong in plans and decisions. Neither belongs here as if already implemented.

Create architecture documentation under `architecture/` when there is implemented architecture to describe. Begin with `architecture/README.md` as the single overview, and add further documents only when a stable area needs its own conceptual explanation. Implementing agents may maintain this descriptive account within authorized work and governing contracts. Link to accepted decisions that govern the described architecture; if implementation and a governing decision diverge, expose the inconsistency rather than making the description silently normative.
<!-- END PROMOTION CONTENT -->

## Replace “Decisions”

<!-- BEGIN PROMOTION CONTENT -->
### Decisions

[`decisions/`](decisions/) preserves consequential choices explicitly accepted by the human, together with their context, rationale, and consequences. Accepted decisions are prescriptive and binding within their stated scope unless superseded; they authorize and explain substantive changes to the governing application specification, core concepts, and architectural constraints, while architecture documentation describes the resulting implemented shape.
<!-- END PROMOTION CONTENT -->
