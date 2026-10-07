# Proposed revisions to foundation/product-design.md

Baseline: `c0ed132`. These amendments qualify the adopted revision; the remaining product design is unchanged. Each unit below has its own replacement or insertion instruction.

## Insert in §2.1.2 Projection

Insert after “A projection includes both its content and the qualifications needed to understand what that content establishes.”:

A produced projection retains its captured program-state basis, selected content, supporting evidence and method, qualifications, and relevant evaluation outcomes. Its states remain associated with the claims and evidence they support, preserving ordering or roles where meaningful. A branch name, working-tree location, or continuing stream does not by itself identify that captured basis. Following changing inputs is a binding or refresh policy for subsequent requests; refreshing produces another result rather than mutating the earlier projection. Reusing or rendering the same retained result does not itself establish a new answer.

## Replace §2.1.3 Presentation in full

#### 2.1.3 Presentation

A **presentation** describes how one or more projections should be rendered, interacted with, or exposed through a PostCode interface.

A projection might be presented as:

- a graph;
- a table;
- a tree;
- a timeline;
- annotated text;
- a diagram;
- a combination of these.

Presentation can be selected independently of the information requested. Four dependencies might be most useful as a small graph; eighty-seven might be better as a searchable or grouped table. A rationale projection might be best presented as annotated text.

A presentation may arrange, align, overlay, compare, or otherwise coordinate several projections while preserving each projection's identity and qualifications. The projections may concern the same subject or different subjects, revisions, or program states. Presentation may align or overlay information using correspondence already established by the input projections or an exact identity guarantee they provide; determining further correspondence is analysis and belongs to a lens. Likewise, a presentation may display or coordinate a flow only when an input projection establishes that flow.

If combining projections derives new program claims—such as correlations, priorities, reconciliations, synthesized summaries, or analytical aggregates—that derivation belongs to core analysis serving a lens and produces another qualified projection; it must not be hidden inside presentation. Ordinary descriptions of a supplied qualified population, as distinguished below, do not require another lens. For example, placing dependency projections from two revisions in corresponding positions may be presentational when their identities already match, while identifying and characterizing additions, removals, or correspondence across renames requires a revision-diff lens.

A presentation may accept presentation-specific parameters such as sorting, grouping, layout, filtering, expansion depth, or whether to show implementation names, descriptive labels, or both. Consequential filtering, grouping, or omission must remain visible so that presentation does not make any input projection appear more complete than the information shown.

Sorting, exact grouping by supplied fields, and ordinary counts or descriptive aggregates over a supplied qualified population may remain presentational. They may describe the full supplied population, a filtered subset, or the displayed items or groups, provided the population actually described is clear. For example, “87 dependencies; showing 20” is valid when the supplied qualified dependency population contains 87 items and the view displays 20. A presentation receiving only 20 items cannot infer 87 unless the core also supplies that qualified total. Neither an exact count nor complete display establishes analysis completeness; partial materialization and narrower scope remain visible.

Across projections, such descriptions retain the contribution, population and qualification of each input. Counting displayed rows does not establish a count of distinct program entities across overlapping populations. Clustering by inferred similarity, deriving categories or correspondence, extrapolating a project-wide total, reconciling overlaps without established identity, or deriving an aggregate that establishes a new program claim requires core analysis and a qualified projection. Arithmetic alone does not determine which side of the boundary an operation belongs to.

Presentations may share common interaction affordances such as hover or focus detail, subject and relationship selection, contextual lens application, expansion and collapse of evidence or qualifications, opening or pinning views, and copying stable references for coding-agent prompts.

Presentations need not be GUI elements; they may be emitted or exported as human-readable text or structured machine-readable data.

## Replace the opening sentence of §3.2 Summary as Initial View and Recursive Navigation

When the human has not expressed a more specific information need, PostCode defaults to a summary view of the subject as the starting experience and basis for recursive navigation:

## Insert in §3.2 after the paragraph beginning “PostCode constructs an appropriate summary view”

Summary-first is an interaction default, not a requirement to apply a summary lens. A summary view may coordinate independently qualified projections, present a synthesized summary projection, or combine both. Explicit information needs and choices take precedence. When the available analyses cannot supply part of the requested account, the view exposes that limitation rather than implying the aspect is absent or unimportant.

## Replace the binding block in §3.3 Workspace Model

Replace from “A revision may be the current working tree, a branch, or a commit.” through “When program states represented within one view differ or refresh at different times, the presentation must expose their associations and timing rather than imply that they form a synchronized snapshot.” with:

A revision-oriented input may designate a working tree, branch, commit, or staged/index state. Its binding policy may be:

- **live:** follow a working tree or branch for subsequent requests or refreshes;
- **pinned:** continue to designate a particular revision for subsequent requests.

These policies belong to the request or workspace's association with program inputs. Retaining an exact result for redisplay is distinct from pinning an input revision. They do not turn an existing projection into a mutable account of the latest state. A live refresh captures and evaluates a basis for another result; earlier results retain their content and qualification. Pinning a revision does not by itself promise persistent storage, atomic capture, or complete analysis.

Other inputs, such as runtime observations, retain bindings appropriate to their source—for example, an execution, observation interval, or continuing stream. A projection based on such inputs still identifies the captured observations supporting its claims; a continuing stream is not permission to rewrite that result.

A projection may concern several captured states obtained under different bindings, as in a working-tree/commit comparison. A multi-projection view may also coordinate results with different bindings. The view preserves the association of each projection and claim with its captured basis, including meaningful order or roles. It exposes differences in state and capture or refresh timing and any capture limitations rather than implying a synchronized snapshot.
