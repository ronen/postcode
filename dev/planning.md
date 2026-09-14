# Planning Workflow

This document describes how plans, related decisions, and governing core-concept changes may be developed, reviewed, promoted, or discarded. It expands the planning stage of the [development workflow](workflow.md#3-planning). Planning does not authorize implementation.

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
- governing core-concept changes associated with the work, if any.

Keep plans at the level needed to guide work. Do not use planning documents to settle architecture implicitly: record consequential accepted choices under [`docs/decisions/`](../docs/decisions/).

## Provisional working material

Use [`drafts/`](../drafts/) for provisional planning artifacts when their history is worth tracking in Git. Draft artifacts are durable but non-governing; a commit preserves a draft without approving it. Use a descriptively named root underscore directory, such as `_initial-product-slice/`, instead when the artifacts are ephemeral, local to the checkout, and disposable. Both forms of provisional material follow the [provisional-working-material conventions](conventions.md#provisional-working-material).

## Suggested planning sequence

This sequence is a convenience, not a required ceremony. Feel free to vary it or use an entirely different approach to suit the planning work.

1. Capture initial notes and alternatives in whichever provisional form is useful: for example, `drafts/<planning-name>/` when Git history helps, or `_<planning-name>/` for disposable checkout-local work.
2. When a coherent package is ready for review, arrange the proposed canonical documents under a tracked directory such as:

   ```text
   drafts/<planning-name>/proposal/
   ├── plans/<plan-name>.md
   ├── decisions/<decision-name>.md
   └── docs/core-concepts.md
   ```

   Include the complete proposed revision of `docs/core-concepts.md` only when the package would change the governing core concepts. This layout makes the intended role and destination of each proposed document clear.
3. For clarity during drafting and review, consider using `Status: in preparation` or `Status: in review`. These are optional draft labels, not canonical plan or decision statuses. Regardless of any status or approval language within a file, material under `drafts/` remains non-governing under the [provisional-working-material conventions](conventions.md#provisional-working-material).
4. Review the plan and decisions together when their choices are interdependent. Another agent may perform a review when an independent reading would be useful.
5. Once the human approves the package, change the plan status to `approved`, give accepted decision records their canonical `accepted` status, and move the files into the corresponding canonical directories. When the package changes core concepts, replace `docs/core-concepts.md` with the approved revision in the same promotion commit as the corresponding decision record. Check and correct links after moving the files; relative paths to documents that were already canonical will generally change. Review the moved documents and their links as a whole before committing the promotion.

## Promotion and disposal

The human directs which provisional artifacts are promoted or discarded. Move or incorporate only explicitly approved plans into `docs/plans/`, and only explicitly accepted decisions into `docs/decisions/`. Promotion is a change of project role, not merely a file move: review the resulting canonical documents against their destination requirements. Before removing provisional material, confirm that all context worth preserving has been carried into durable documents. An abandoned draft may be deleted without acquiring a lifecycle status; its Git history remains available.

## Draft commits

Any commit that adds, modifies, or deletes draft artifacts under `drafts/` must use a subject beginning `draft: ` followed by a concise description, and must not include changes outside `drafts/`. A promotion commit is the exception: it may add or update approved material at its canonical location while deleting the corresponding draft artifacts, and uses an ordinary descriptive subject. Changes to the directory guidance in `drafts/README.md` are not changes to a draft artifact and follow ordinary commit conventions.
