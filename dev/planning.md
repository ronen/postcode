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

Keep plans at the level needed to guide work. Do not use planning documents to settle architecture implicitly: record consequential accepted choices under [`docs/decisions/`](../docs/decisions/).

## Provisional working material

Use [`drafts/`](../drafts/) for provisional planning artifacts when their history is worth tracking in Git. Draft artifacts are durable but non-governing; a commit preserves a draft without approving it. Use a descriptively named root underscore directory, such as `_initial-product-slice/`, instead when the artifacts are ephemeral, local to the checkout, and disposable. Each form follows the applicable [provisional-draft](process-conventions.md#provisional-draft-material) or [disposable-scratch](process-conventions.md#disposable-scratch-material) conventions.

When the human shelves exploratory material for durable reference rather than continuing it toward approval or abandonment, reclassify it under [`notes/`](../notes/) instead of leaving it indefinitely as a draft. Notes remain non-governing and non-permanent and follow the [durable-note conventions](process-conventions.md#durable-non-governing-notes).

## Suggested planning sequence

This sequence is a convenience, not a required ceremony. Feel free to vary it or use an entirely different approach to suit the planning work.

1. Capture initial notes and alternatives in whichever provisional form is useful: for example, `drafts/<planning-name>/` when Git history helps, or `_<planning-name>/` for disposable checkout-local work.
2. When a coherent package is ready for review, arrange the proposed canonical documents under a tracked directory such as:

   ```text
   drafts/<planning-name>/proposal/
   ├── plans/<plan-name>.md
   ├── decisions/<decision-name>.md
   └── docs/
       ├── core-concepts.md
       └── architectural-constraints.md
   ```

   Include the complete proposed revision of `docs/core-concepts.md` or `docs/architectural-constraints.md` only when the package would change that governing document. This layout makes the intended role and destination of each proposed document clear.
3. For clarity during drafting and review, a draft plan or draft decision record may use `Status: in preparation` or `Status: in review`. These are optional draft labels, not canonical plan or decision statuses. Regardless of any status or approval language within a file, material under `drafts/` remains non-governing under the [provisional-draft conventions](process-conventions.md#provisional-draft-material).
4. Review the plan and decisions together when their choices are interdependent. Another agent may perform a review when an independent reading would be useful.
5. Once the human approves the package, promote it as described below.

## Promotion and disposal

The human directs which provisional artifacts are promoted or discarded. Promotion is a change of project role, not merely a file move. When promoting an approved package:

1. Give plans their canonical `approved` status and accepted decision records their canonical `accepted` status.
2. Move or incorporate the documents into their canonical locations under `docs/`.
3. If the package changes the governing core concepts or architectural constraints, replace each affected governing document with the approved revision in the same commit as the corresponding accepted decision record.
4. Update any earlier plans or decisions that the promoted documents supersede. Follow the applicable [plan lifecycle](../docs/plans/README.md#lifecycle) and [decision lifecycle](../docs/decisions/README.md#lifecycle), including complete forward and backward decision-supersession mappings.
5. Update any canonical indexes that list the promoted or superseded documents.
6. Check and correct links after moving the files; relative paths to documents that were already canonical will generally change. Remove or replace links to notes, carrying any required context into the promoted documents. A historical record that cannot later be edited must not link to a note.
7. Review the promoted documents, governing core concepts or architectural constraints when changed, supersession metadata, indexes, and links as a whole before committing the promotion.

Before removing provisional material, confirm that all context worth preserving has been carried into canonical documents. An abandoned draft may be deleted without acquiring a lifecycle status; its Git history remains available.

## Draft commits

Any commit that adds, modifies, or deletes draft artifacts under `drafts/` must use a subject beginning `draft: ` followed by a concise description, and must not include changes outside `drafts/`. A promotion commit is an exception: it may add or update approved material at its canonical location while deleting the corresponding draft artifacts, and uses an ordinary descriptive subject. A human-directed reclassification commit is also an exception: it may move shelved exploratory material into `notes/` and update directly affected links and guidance without implying approval. Changes to the directory guidance in `drafts/README.md` are not changes to a draft artifact and follow ordinary commit conventions.
