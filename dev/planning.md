# Planning Workflow

This document describes how plans, related decisions, and changes to the application specification, core concepts, or architectural constraints may be developed, reviewed, promoted, or discarded. It expands the planning stage of the [development workflow](workflow.md#planning). Planning does not authorize implementation.

Application specification revisions may be developed with an implementation plan or through standalone human-directed design work. Follow the [specification revision requirements](workflow.md#application-specification) in either case. A package may contain specification revisions and related decisions without an implementation plan; apply the review and promotion steps relevant to its contents.

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
- application-specification, core-concept, or architectural-constraint changes associated with the work, if any.

When adopting changes to governing requirements, assess their implications for existing implementation proportionately to the risk. If the implementation is known to be nonconforming when the decision is adopted, describe the gap in the decision, including any restrictions needed until reconciliation. Link to the associated approved plan if it covers the reconciliation work; otherwise, add a backlog entry specifying the needed reconciliation and referencing the decision, and note in the decision that the entry was added.

If conformance is unknown and immediate assessment is not warranted, describe the uncertainty in the decision and arrange assessment through the plan or backlog in the same way. Do not defer assessment or remediation when the uncertainty or nonconformance would make current behavior unsafe or materially undermine current claims. Approval adopts the requirements; it does not establish implementation conformance.

Keep plans at the level needed to guide work. Do not use planning documents to settle application behavior or architecture implicitly: record consequential accepted choices under [`docs/decisions/`](../docs/decisions/) and update affected governing documents together.

## Planning material

Use [`notes/`](../notes/) for human-curated exploratory material worth preserving in Git, including durable planning notes, alternatives, unresolved questions, and investigation results. Notes are non-governing and non-permanent and follow the [durable-note conventions](process-conventions.md#durable-non-governing-notes).

Use [`drafts/`](../drafts/) for complete proposed new canonical documents and structured revisions to existing canonical documents being prepared for approval and promotion. Draft artifacts are durable but non-governing; a commit preserves a draft without approving it.

Use a descriptively named root underscore directory, such as `_initial-product-slice/`, when working material is ephemeral, local to the checkout, and disposable. Each form follows the applicable [durable-note](process-conventions.md#durable-non-governing-notes), [provisional-draft](process-conventions.md#provisional-draft-material), or [disposable-scratch](process-conventions.md#disposable-scratch-material) conventions.

Reviews of draft planning material are working material, not historical review records, unless the human explicitly requests otherwise. Once findings have been addressed or carried into the promoted documents, backlog, or other appropriate location, discard the associated scratch review material during promotion or worktree cleanup. Preserve any independently useful unresolved content, rather than retaining the review merely as evidence that review occurred.

## Suggested planning sequence

This sequence is a convenience, not a required ceremony. Feel free to vary it or use an entirely different approach to suit the planning work.

1. Start planning on a new branch in its own [worktree](worktrees.md#setup). Capture useful initial notes and alternatives under `notes/`, or use `_<planning-name>/` for disposable work.
2. When the discussion has taken shape and the human directs preparation of a proposal, write it in a single file under `notes/`. Use the note to develop and revise the substance of the planning package before dividing it among the draft documents.
3. Seek appropriate review of the proposal while it is still in notes. When useful, compare it with the discussion notes to check that it captures the ideas intended to carry forward. Use the findings to refine the approach with the human.
4. When the proposal is ready, draft the plan, related decisions, and canonical revisions in a tracked [planning package](#planning-package).
5. Compare the draft package with the reviewed proposal for omissions or unintended changes. Also [review the package on its own merits](#planning-package-review), reading the plan, decisions, and revisions together. These checks may be combined in one review or performed separately.
6. Once the human approves the package, promote it as described below.

### Planning package

Arrange the draft plan, related decisions, and canonical revisions under a tracked directory such as:

```text
drafts/<planning-name>/
├── plans/<plan-name>.md
├── decisions/<decision-name>.md
├── app-specification-revisions.md
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

<a id="planning-package-review"></a>
## Reviewing a planning package

When asked to review a draft package, assess whether it is ready for human approval and promotion. Read the package alongside the governing documents it relies on or would change. Inspect the implementation where a material assumption depends on current behavior.

- Assess whether the proposed work addresses the stated problem, whether its scope and complexity are proportionate, and whether its success criteria and verification would establish the intended outcome. Test feasibility against the proposed sequence, dependencies, and material risks.
- Check that consequential choices are explicit, supported by reasoning, and recorded in the appropriate documents. Identify decisions the human needs to make before approval and choices that can reasonably wait for implementation.
- Read the decisions and governing documents as they would stand after promotion, including unchanged passages affected by the proposal. Look for inconsistencies, material gaps, obsolete instructions, and incomplete supersession. Check that the package accounts for any known gap between the adopted requirements and the implementation.
- Check that the promoted documents would stand on their own once draft context, working notes, and temporary steering labels are gone.

Identify the package reviewed and any material limits of the review. For each finding, cite the affected passage, explain the practical consequence, and suggest a resolution when clear. Distinguish verified problems from uncertainties. Conclude whether the package is ready for approval, making clear which findings need resolution before approval and which are optional improvements.

Write the findings to a descriptively named Markdown file under `_reviews/` at the root of the worktree containing the draft package. Use a distinct filename for each review and return its path with a brief assessment. Make no other changes to the repository unless the human explicitly directs you to do so.

## Promotion and disposal

The human directs which provisional artifacts are promoted or discarded. Promotion is a change of project role, not merely a file move. Before removing provisional material, confirm that all context required by the promoted documents has been carried into them.

When promoting an approved package:

1. Give plans their canonical `approved` status and accepted decision records their canonical `accepted` status.
2. Move complete new documents into their canonical locations under `docs/`.
3. Merge approved additions, replacements, and deletions into the latest versions of existing canonical documents; reconcile intervening canonical changes rather than replacing them with stale draft content.
4. Update any earlier plans or decisions that the promoted documents supersede. Follow the applicable [plan lifecycle](../docs/plans/README.md#lifecycle) and [decision lifecycle](../docs/decisions/README.md#lifecycle), including complete forward and backward decision-supersession mappings.
5. Update any canonical indexes that list the promoted or superseded documents.
6. Check and correct links after moving or merging the files, including links that could not resolve within the draft package or that referred to canonical documents outside it. Remove or replace links to notes, carrying any required context into the promoted documents.
7. Read the associated notes and propose a disposition to the human for each file, distinguishing passages when they warrant different treatment. Recommend removing material already incorporated into the promoted documents or no longer relevant. For material worth keeping through implementation, identify the question it could help answer and propose revisiting it when the plan concludes. For material with value beyond the plan, recommend what to preserve and where, such as a consolidated note or a backlog entry for follow-up work. Briefly explain the recommendations, then apply the approved changes and update affected note indexes and links.
8. Review the promoted documents, application specification, core concepts or architectural constraints when changed, remaining associated notes, supersession metadata, indexes, and links as a whole.
9. Commit the entire promotion atomically, including new canonical documents, merged revisions, corresponding accepted decisions, plan-dependent backlog changes, associated note cleanup, supersession metadata, index and link updates, and removal of the promoted draft artifacts.

An abandoned draft may be deleted without acquiring a lifecycle status; its Git history remains available.
