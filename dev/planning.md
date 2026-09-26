# Planning Workflow

This document describes how plans, related decisions, and changes to governing core concepts or architectural constraints may be developed, reviewed, promoted, or discarded. It expands the planning stage of the [development workflow](workflow.md#planning). Planning does not authorize implementation.

## Plan contents

Plans describe intended work, not established system behavior. Store human-approved plans under [`docs/plans/`](../docs/plans/) and follow the lifecycle described there.

A useful implementation plan should state:

- the problem or use narrative;
- the intended outcome and observable success criteria;
- scope and explicit non-goals;
- relevant constraints and dependencies;
- proposed milestones or vertical slices;
- risks, uncertainties, and open questions;
- accepted decisions relevant to the proposed work;
- unresolved consequential decisions, including when and by whom they must be resolved; and
- governing core-concept or architectural-constraint changes associated with the work, if any.

When a proposed architectural constraint may affect existing implementation, consider whether conformance must be assessed or established as part of the associated work. Make that determination proportionate to the risk. If known nonconformance may acceptably be deferred, acknowledge it in the corresponding decision and add a backlog entry describing its impact and urgency. If conformance is unknown and immediate assessment is not warranted, the backlog entry may instead call for that assessment. Do not defer assessment or remediation when the uncertainty or nonconformance would make current behavior unsafe or materially undermine current claims.

Keep plans at the level needed to guide work. Do not use planning documents to settle architecture implicitly: record consequential accepted choices under [`docs/decisions/`](../docs/decisions/).

## Planning material

Use [`notes/`](../notes/) for human-curated exploratory material worth preserving in Git, including durable planning notes, alternatives, unresolved questions, and investigation results. Notes are non-governing and non-permanent and follow the [durable-note conventions](process-conventions.md#durable-non-governing-notes).

Use [`drafts/`](../drafts/) for complete proposed new canonical documents and structured revisions to existing canonical documents being prepared for approval and promotion. Draft artifacts are durable but non-governing; a commit preserves a draft without approving it.

Use a descriptively named root underscore directory, such as `_initial-product-slice/`, when working material is ephemeral, local to the checkout, and disposable. Each form follows the applicable [durable-note](process-conventions.md#durable-non-governing-notes), [provisional-draft](process-conventions.md#provisional-draft-material), or [disposable-scratch](process-conventions.md#disposable-scratch-material) conventions.

## Suggested planning sequence

This sequence is a convenience, not a required ceremony. Feel free to vary it or use an entirely different approach to suit the planning work.

1. Capture durable initial notes and alternatives under a suitable location in `notes/`, or use `_<planning-name>/` for disposable checkout-local work.
2. When discussion has reached the point of being ready to create a plan, draft the plan and its related documents in a tracked [planning package](#planning-package).
3. Review the plan, decisions, and canonical revisions together when their choices are interdependent. Another agent may perform a review when an independent reading would be useful.
4. Once the human approves the package, promote it as described below.

### Planning package

Arrange the draft plan, related decisions, and canonical revisions under a tracked directory such as:

```text
drafts/<planning-name>/
├── plans/<plan-name>.md
├── decisions/<decision-name>.md
├── core-concepts-revisions.md
├── architectural-constraints-revisions.md
└── backlog-revisions.md
```

The planning-package root corresponds to canonical `docs/`. Give a complete new document its intended canonical filename. For revisions to an existing document, preserve its relative directory and append `-revisions` to the filename stem: for example, revisions to `docs/core-concepts.md` belong in `core-concepts-revisions.md`. In promotion-ready content, link to intended canonical filenames rather than to revision files; those links may remain unresolved within the draft package.

Write proposed documents and revision content in promotion-ready wording appropriate to their canonical destinations. Their location under `drafts/` already establishes that they are proposals; do not qualify the substantive text throughout with “proposed,” “planned,” or similar drafting language merely for that reason. When a particular passage remains unsettled, mark it with a brief local annotation such as `[Needs review]` rather than weakening otherwise final wording, and resolve or remove the annotation before promotion.

#### Plan and decision records

Write a proposed new plan or decision record as a complete document.

For clarity during drafting and review, a draft plan or draft decision record may use `Status: in preparation` or `Status: in review`. These are optional draft labels, not canonical plan or decision statuses. Regardless of any status or approval language within a file, material under `drafts/` remains non-governing under the [provisional-draft conventions](process-conventions.md#provisional-draft-material).

#### Revisions to canonical documents

Include a revision file only for a canonical document the package would change. Begin each revision file with a heading such as `# Proposed revisions to docs/core-concepts.md` so it cannot be mistaken for a complete replacement and its canonical destination is explicit.

A backlog candidate whose meaning depends on the proposal belongs in the package's `backlog-revisions.md` file and is promoted with the package. A candidate that remains independently intelligible and worthwhile whether or not the proposal is approved may instead be added directly to the canonical backlog under the normal backlog workflow.

For a revision to a canonical file, normally include only the independently reviewable units that would change:

- include the complete text of each proposed addition;
- include the complete replacement text for each changed unit and clearly identify the canonical heading or entry it replaces; and
- identify each canonical heading or entry proposed for deletion.

Use a stable unit appropriate to the destination, such as a core-concept definition, architectural constraint, or backlog entry. These are proposed revisions, not line-level patches.

## Promotion and disposal

The human directs which provisional artifacts are promoted or discarded. Promotion is a change of project role, not merely a file move. Before removing provisional material, confirm that all context required by the promoted documents has been carried into them. Retain, consolidate, or delete associated notes according to whether they remain independently useful.

When promoting an approved package:

1. Give plans their canonical `approved` status and accepted decision records their canonical `accepted` status.
2. Move complete new documents into their canonical locations under `docs/`.
3. Merge approved additions, replacements, and deletions into the latest versions of existing canonical documents; reconcile intervening canonical changes rather than replacing them with stale draft content.
4. Update any earlier plans or decisions that the promoted documents supersede. Follow the applicable [plan lifecycle](../docs/plans/README.md#lifecycle) and [decision lifecycle](../docs/decisions/README.md#lifecycle), including complete forward and backward decision-supersession mappings.
5. Update any canonical indexes that list the promoted or superseded documents.
6. Check and correct links after moving or merging the files, including links that could not resolve within the draft package or that referred to canonical documents outside it. Remove or replace links to notes, carrying any required context into the promoted documents.
7. Review the promoted documents, governing core concepts or architectural constraints when changed, supersession metadata, indexes, and links as a whole.
8. Commit the entire promotion atomically, including new canonical documents, merged revisions, corresponding accepted decisions, plan-dependent backlog changes, supersession metadata, index and link updates, and removal of the promoted draft artifacts.

An abandoned draft may be deleted without acquiring a lifecycle status; its Git history remains available.

## Draft commits

Any commit that adds, modifies, or deletes draft artifacts under `drafts/` must use a subject beginning `draft: ` followed by a concise description, and must not include changes outside `drafts/`. A promotion commit is an exception: it may add or update approved material at its canonical location while deleting the corresponding draft artifacts, and uses an ordinary descriptive subject. A human-directed reclassification commit is also an exception: it may move shelved exploratory material into `notes/` and update directly affected links and guidance without implying approval. Changes to the directory guidance in `drafts/README.md` are not changes to a draft artifact and follow ordinary commit conventions.
