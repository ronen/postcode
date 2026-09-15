# Independent Review Workflow

This document describes how an implementation agent prepares for a human-arranged independent review and how the resulting review evidence is preserved. It applies when an approved plan or authorized task requires an independent review checkpoint. It does not require independent review for every implementation task and does not determine which reviewer or review mechanism the human uses.

The applicable plan or task defines whether review is required, what gates it establishes, and when those gates occur. A reviewer's findings are input to the active task; they do not authorize implementation, expand task scope, accept a product result, or conclude the task.

## Review records

Store durable independent-review records under [`records/reviews/`](../records/reviews/). Group a review series under a directory named for its governing plan when one exists, or for its task otherwise:

```text
records/reviews/<plan-or-task-slug>/
```

The directory is the **review series** for that plan or task. Within the series:

- a **review assignment** begins with exactly one handoff;
- a **review round** examines one exact implementation target and produces a findings file;
- an assignment may have repeated findings, correction, and further-review rounds under its original handoff; and
- the assignment may end with one disposition file when a separate disposition is needed.

Normally derive the series slug from the governing plan's filename stem, omitting a generic suffix such as `-plan` when the remaining name is unambiguous, or from the task-record slug when no plan applies. Shorten it further only when that improves readability without creating ambiguity.

Use filenames that make each role apparent without opening the file:

```text
YYYY-MM-DD-<review-name>-handoff.md
YYYY-MM-DD-<review-name>-round-1-findings.md
YYYY-MM-DD-<review-name>-round-2-<reviewer>-findings.md
YYYY-MM-DD-<review-name>-disposition.md
```

Use and adapt the [handoff](templates/review-handoff.md), [findings](templates/review-findings.md), and [disposition](templates/review-disposition.md) templates. Replace their bracketed drafting prompts and omit optional metadata that has no value. The templates provide the record shape; the requirements and lifecycle in this document still apply.

Begin each file with `Record type: handoff`, `Record type: findings`, or `Record type: disposition`. Use the handoff's review name across its findings and disposition files. Distinguish successive findings files by round and, when useful, reviewer.

A new implementation target produced in response to findings normally remains under the same handoff. Prepare another uniquely named file ending in `-handoff.md` only when the review assignment's scope, focus, governing basis, or intended gate changes materially. Keep the new assignment in the same review-series directory, and do not combine the earlier assignment's disposition with the new handoff.

These conventions apply to new review records. Preserve existing historical records and links rather than renaming them to match the newer layout.

## Preparing a handoff

The implementing agent prepares and commits the handoff, then stops for the human to arrange the independent review. Do not change the handoff after review begins. The handoff governs repeated review rounds while its assignment remains applicable; each findings record supplies the exact target reviewed in that round. If the assignment itself changes materially, prepare a new handoff and make the relationship clear.

A handoff should identify:

- the active task and the review gate or checkpoint being addressed;
- the exact implementation commit to review;
- the baseline or diff range that defines the review scope;
- the branch and pull request, when useful as conveniences rather than as substitutes for immutable commit identity;
- the governing plan, accepted decisions, core concepts, architectural constraints, and other material needed to judge the work;
- the behavior, boundary, or integrated result reached at the checkpoint;
- verification already performed by the implementing agent, without presenting it as independent verification;
- the requested review focus and any important checks to reproduce;
- known limits and work deliberately remaining after an intermediate checkpoint;
- the reviewer's boundaries and the condition for proceeding or closing; and
- the intended naming pattern and conditional return procedure for findings under the same review-series directory.

The exact target and baseline or diff range define the implementation under review. Later commits, including the handoff's own commit, are not part of that implementation scope unless a later review round explicitly names a new target; the reviewer still reads the handoff as the assignment. The handoff must ask the reviewer to inspect the implementation and relevant evidence rather than treating the handoff, prior verification, or earlier reviews as proof of correctness.

The handoff should give the reviewer a conditional return procedure. If the reviewer has repository write access, it should use the [findings template](templates/review-findings.md), create the conformingly named findings record, include the required metadata, preserve its report under `## Returned findings`, and commit that record without modifying anything else. If the reviewer cannot write to the repository, it should return its findings to the human. The human may then supply that text to the implementing agent or instruct the agent to retrieve the review from an external system. Unless the human explicitly authorizes otherwise, the reviewer must not modify implementation, governing material, task status, or the active task record.

## Recording findings

Each findings record should identify the reviewer, the handoff followed, the round, the exact commit and scope actually reviewed, the review method, verification performed, actionable findings, relevant non-defect observations, unverified areas or residual limits, and the reviewer's recommendation about the stated gate. After the first round, it should also identify the prior findings, prior reviewed target, and the corrections or other changes presented for further review.

Preserve returned findings as authored. When a repository-writing reviewer creates and commits the conforming findings record as directed by the handoff, the implementing agent uses that record and does not duplicate it. Otherwise, the human supplies the returned findings text to the implementing agent. The implementing agent then selects a filename conforming to the handoff's naming pattern, creates the findings record, and adds repository metadata in this form:

```text
Record type: findings
Received: YYYY-MM-DD
Reviewer:
Handoff:
Round:
Reviewed target:
Prior findings:
Prior reviewed target:
```

Omit `Prior findings` and `Prior reviewed target` in the first round. After the metadata, add a `## Returned findings` section and include the human-supplied review text verbatim. The metadata and section wrapper are repository-authored; the returned text remains reviewer-authored. Do not edit or intersperse the returned text with the implementing agent's interpretation, disagreement, correction, or outcome; put those in a disposition. If a necessary redaction or normalization prevents verbatim preservation, disclose it explicitly rather than silently changing the report.

The human may instead instruct the implementing agent to retrieve a review from an external review system. In that case, use the system's API or command-line client to retrieve every component within the stated review scope, including overall review text, file or line annotations, and relevant conversation comments. Follow pagination and identify the external review, comment, and annotation records through stable links or identifiers. For a GitHub or Copilot pull-request review, use `gh` to retrieve the complete review rather than relying on the pull-request summary displayed in one view.

Assemble the retrieved components into a findings record under a clearly marked `## Retrieved findings` section. Preserve each source component's text and distinguish it with minimal repository-authored labels identifying its kind, author, location, and external link or identifier. Do not silently summarize, combine, reorder in a misleading way, or omit components. State the retrieval method and scope, and disclose unavailable components, filtering, redaction, normalization, or uncertainty about completeness. Interpretation and disposition remain separate from the retrieved findings.

A pull-request review or external review system may be the transport for a review, but it does not replace durable repository evidence. The findings record may link to detailed external comments while preserving enough context and conclusions for the repository record to remain intelligible.

## Review cycle

Keep repeated review and correction under one handoff lightweight while its assignment remains applicable:

1. The reviewer creates and commits its findings record when it can do so. Otherwise, the human supplies the returned text or instructs the implementing agent to retrieve it, and the implementing agent creates and commits the findings record before acting on it.
2. The implementing agent investigates the findings, makes clearly in-scope corrections, verifies them, and commits the correction.
3. If further independent review is warranted, the implementing agent gives the human the new exact target commit, the prior findings record, and a concise account of the corrections and verification. The new target may be supplied in that rereview message; it does not require another repository artifact. The resulting findings record preserves the exact target actually reviewed.
4. Repeat as needed until the returned reviews are clean or the human determines that the accumulated review is sufficient for the stated gate.
5. When needed, create one final disposition for the assignment.

Ordinary rereview does not require another handoff, an intermediate disposition, an update to the original handoff, or a separate durable rereview-request document. A correction already required by the authorized task and governing material does not require a task follow-up merely because a reviewer identified it. Human direction and the task follow-up protocol remain necessary when a finding would change, extend, or redirect the authorized work.

## Disposition and further review

When findings require investigation, correction, scope judgment, or an explicit review-gate conclusion, record the implementing agent's final disposition separately. Link it to the handoff and every findings record for the assignment, and summarize the corrections and verification between rounds.

For each actionable finding, record whether it was accepted, rejected, deferred, or requires human direction, together with the basis for that judgment. Identify resulting correction commits and verification. Suggestions that would change or extend the authorized task require human direction and, when material, must be recorded as a task follow-up under the governing task protocol before the implementing agent acts on them.

Minor corrections directly responsive to a finding may be verified by the implementing agent. If corrections materially invalidate the reviewer's original analysis, obtain a further review round under the same handoff when its assignment remains applicable; do not treat the earlier recommendation as applying to the changed work. Prepare a new handoff only when the review assignment changes materially.

Review and correction may continue through multiple rounds until the returned reviews are clean or the human determines that the accumulated review is sufficient for the stated gate. Conclude the disposition by recording the rounds and stating whether the human determined that the review gate is satisfied, further review is required, or other human direction is required. A separate disposition may be omitted when a findings record reports no actionable findings and the active task record can unambiguously preserve the human's review-gate conclusion.

## Arranging the review

By default, the human chooses and arranges the independent reviewer and transport for each review. A fresh agent session, a person, a pull-request reviewer, or several reviewers may be appropriate. The human also decides whether a later checkpoint warrants one reviewer or several and whether a pull request is useful at that stage.

The implementing agent may invoke or arrange a reviewer when the approved plan explicitly assigns that responsibility to the agent or the human explicitly instructs it to do so. The authorization should make the intended independence and any reviewer or transport constraints clear. A requirement for review alone does not authorize the agent to select or invoke a reviewer.

Whether the review is human-arranged or expressly agent-arranged, the implementing agent must not infer human acceptance from a reviewer's recommendation. Its responsibility is to prepare the durable handoff, stop or continue as the stated gate permits, and incorporate returned review evidence through the authorized task workflow.
