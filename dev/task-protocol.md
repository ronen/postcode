# Task Protocol

This document defines the lifecycle of an approved implementation task and how its instructions, material follow-ups, outcome, and verification are preserved.

This protocol must satisfy the adopted [task-record requirements](../foundation/task-records.md). It is human-maintained and may be changed only through separate human-directed process maintenance under the [development workflow](workflow.md#human-directed-process-maintenance).

## 1. Initiating a Task

The protocol applies to substantive implementation tasks as classified by the [development workflow](workflow.md#kinds-of-work). Follow its [preparation sequence](workflow.md#before-making-changes) before opening a record.

A task may begin in either of two ways:

- The human supplies an approved `_work/TASK.md`.
- During an interactive conversation, the human explicitly authorizes a substantive implementation request and the agent confirms that it will open a task record before proceeding.

After preparation, restate the authorized goal and its explicit scope boundaries.

The root-level `_work/TASK.md` file is a disposable drafting and handoff artifact, excluded from Git by the root `.gitignore`. It is prepared and revised before implementation by the human, possibly in collaboration with a planning agent. The executing agent treats it as immutable input, does not modify it, and does not commit it.

If the task input is `_work/TASK.md`, locate the original before changing working directories and read it from that location when opening the record in the task worktree. Do not create another `_work/TASK.md` merely to transfer it.

A request with an independently meaningful goal, or one made after the current task has concluded, begins a new task. A request that changes, clarifies, constrains, redirects, pauses, or extends an active task is a follow-up to that task. If the classification is unclear and would materially affect scope or history, the agent must ask the human.

<a id="task-branch"></a>
### Task branch

Implement each task in its own feature branch and worktree unless the human explicitly directs otherwise. For a new task, select a suitably named branch using `codex/<task-name>` and start from local `main`, unless the approved plan or human specifies another starting revision or branch name. When starting from `main`, follow the [main synchronization instructions](worktrees.md#main-synchronization) before selecting the starting commit. Confirm that the starting commit contains the approved documents and prerequisites needed by the task. If required work is missing or exists only as uncommitted changes elsewhere, resolve the starting point with the human before opening the task record.

When continuing an active task, locate its existing record and use its existing branch and worktree rather than opening another task merely because the agent started elsewhere. Create or locate the worktree under the [worktree setup instructions](worktrees.md#setup). Perform implementation and task-record commits there; the checks before task-record commits apply to that worktree.

For a new task, if the proposed branch name already exists, choose a distinguishing suffix rather than reusing or resetting that branch.

<a id="finding-active-task"></a>
### Finding an active task

An active record may exist only on its task branch. Inspect `git worktree list --porcelain` and look in `records/tasks/` in the relevant worktrees. If it is not found there, inspect local and remote-tracking branches and their `TASK OPENED:` history, then read the candidate record at the branch tip to confirm its current status. Ask the human if the requested task cannot be identified unambiguously; do not open a duplicate record merely because it is absent from the current checkout.

<a id="opening-task-record"></a>
## 2. Opening the Task Record

Each started task has one durable record under `records/tasks/`. The record is committed to Git and remains directly available after the task is concluded.

### 2.1 Record title

If the approved task provides an explicit title, use it as the short task title. Otherwise, derive a concise human-readable title from the task's stated or inferred goal.

Creating the title is routine record metadata and does not modify or reinterpret the preserved task text. The agent need not ask the human to approve the title unless the task's goal is itself ambiguous.

### 2.2 Record identifier and filename

Derive a filename-friendly slug from the short task title. The slug need not be an exact mechanical slugification: it may be shortened or adjusted to remain readable, stable, and distinctive.

Combine the date on which implementation begins with the slug to form the record identifier and filename:

```text
Identifier: YYYY-MM-DD-<slug>
File:       records/tasks/YYYY-MM-DD-<slug>.md
```

If the resulting filename already exists, add a concise distinguishing suffix rather than renaming another task.

For example:

```text
Title:      Implement the initial repository summary lens
Identifier: 2026-09-05-repository-summary-lens
File:       records/tasks/2026-09-05-repository-summary-lens.md
```

### 2.3 Initial record and commit

The initial task record has this form:

```markdown
# Short task title

Status: active
Opened: YYYY-MM-DD
Closed:

## Task

[Approved task text, preserved verbatim.]

## Follow-ups

## Outcome

## Verification
```

Allowed status values are:

- `active`;
- `completed`;
- `blocked`;
- `abandoned`.

Before making implementation changes, the executing agent must:

1. create the task record with status `active` and the opening date;
2. copy the approved `_work/TASK.md` or explicitly authorized interactive request verbatim into the **Task** section;
3. commit the new task record using the title `TASK OPENED: YYYY-MM-DD-<slug>`, matching the record identifier.

The initial commit establishes the historical boundary between the approved request and the implementation performed in response to it.

After confirming that the opening commit succeeded, the executing agent must delete the original `_work/TASK.md` if it was the source of the task, even when it was read from another checkout. First confirm that it still matches the input preserved in the record; if it has changed, preserve it and ask for human direction. The committed task record then becomes the sole record of the active task once the source has been consumed.

This deletion is an explicit exception to the [rule against modifying a checkout being used for other work](worktrees.md#layout).

The approved task text is immutable evidence. It must not be rewritten retrospectively for clarity or to match the implementation.

## 3. Follow-up Prompts

Before acting on a material follow-up prompt, the executing agent must:

1. append it to the **Follow-ups** section in the order received;
2. commit the updated record using the title `TASK FOLLOW-UP: YYYY-MM-DD-<slug>`, matching the record identifier;
3. only then perform the work affected by the follow-up.

Preserve the prompt verbatim when practical. If surrounding conversation is required to make it intelligible, include only the minimum necessary context and distinguish that context from the prompt itself.

Incidental conversation, status questions, tool output, and discussion that does not affect the task need not be recorded.

Previously recorded task text and follow-ups must not be edited when a later prompt supersedes them. The later prompt records the change in direction.

<a id="independent-review"></a>
## 4. Independent Review

Unless the approved plan or human explicitly directs otherwise, substantive implementation of an approved plan uses these independent-review defaults:

- <a id="intermediate-review"></a> If the implementation becomes sufficiently complex that intermediate review would materially reduce risk, pause for independent review after appropriate key developments.
- After implementation and planned verification are substantially complete, prepare and commit a final integrated-review handoff. Pause for one or more final review rounds, and do not close the task until the human says that the review gate is sufficient.

Follow the [independent review workflow](review.md) whenever these defaults, an approved plan, or an authorized task require review. The human arranges the reviewer and review mechanism unless the approved plan expressly assigns that responsibility to the agent or the human explicitly directs the agent to do so.

<a id="concluding-task-record"></a>
## 5. Concluding a Task

The agent may conclude a task as `completed` when the approved goal and appropriate verification are clearly satisfied. It must ask the human when completion depends on unresolved interpretation, subjective acceptance, or explicitly required approval. If required work remains, the task may be completed only when the human has explicitly approved deferring that work and thereby revised the effective goal. Concluding a task as `blocked` or `abandoned` also requires explicit human approval.

Satisfy the applicable review gates before closing the task.

To conclude the task, the executing agent must:

1. set the task status to `completed`, `blocked`, or `abandoned` and set **Closed** to the conclusion date;
2. append a concise **Outcome** describing what was implemented and any material deviations from the approved task, unresolved concerns, resulting follow-up work, or resulting backlog entries;
3. append the checks and observations that support the **Verification** result;
4. commit the concluded task record using the title `TASK CLOSED: YYYY-MM-DD-<slug>`, matching the record identifier. Append `(BLOCKED)` or `(ABANDONED)` when the corresponding status applies.

Once a task has been concluded and its closing record committed, the record must not be modified. If a correction, redaction, or addition appears necessary, the agent must pause and ask for guidance. Further implementation—including work following a premature conclusion—requires a new continuation task that references the concluded record. The earlier record remains unchanged, preserving the historical judgment made at closure.

Pushing the closed task record, an authorized merge, and cleanup may follow task closure without opening another task. Follow the [publication, merge, and cleanup sequence](#publication-and-cleanup).

<a id="completion-report"></a>
### Completion report

A completion report should leave the repository understandable without access to the conversation that produced it. State:

- the resulting behavior or artifact;
- material deviations from the plan;
- verification performed;
- unresolved risks or questions;
- any follow-up work that remains outside the completed scope.

## 6. Git Chronology and Working-Tree State

Task-record commits preserve the chronology of the approved request, implementation, and conclusion. In particular:

- the initial task record is committed before implementation;
- each material follow-up is committed before the work it changes;
- the closing record is committed after implementation and verification.

Preserve the task's commits from `TASK OPENED` onward. Do not rebase, squash, amend, or otherwise rewrite that history. Integrate the task branch using a merge that retains its commits, including a fast-forward when possible; for a GitHub PR, use a merge commit rather than squash or rebase merging.

Incorporate needed changes from `main` into the task branch by merging at a deliberate checkpoint, preserving the task's authorized scope and repeating affected verification. Changes to the task's instructions remain subject to the follow-up protocol.

Before making any task-record commit, the executing agent must inspect the worktree for other uncommitted changes. If any are present, the agent must ask the human whether to:

1. commit those changes separately first;
2. include them in the task-record commit, which is unusual because it weakens the historical boundary but may be chosen deliberately;
3. commit only the task record and leave the other changes uncommitted and untouched.

The prescribed commit-message formats govern only the subject line. The agent may add a commit body with useful explanatory context based on its own judgment.

Because task records are committed to a public repository, they must be checked for private, sensitive, or irrelevant contextual material before they are committed.

<a id="publication-and-cleanup"></a>
## 7. Publication, Merge, and Cleanup

Unless the human directs otherwise, substantive implementation tasks use a GitHub pull request for review and integration.

When a GitHub pull request is used, push the task branch and create or update the PR while the task is still active, so that external review can take place before task closure. Keep the task active while review and any resulting corrections are in progress. Close the task only after the human confirms that external review is finished and the applicable review gates are satisfied. Then push the final commits, including the closed task record, before merging when authorized.

This human confirmation is required even for an interactively authorized task with no formal independent-review gate. Using a PR does not by itself require the formal review records in the independent review workflow.

Follow the [review workflow](review.md) and [pull request description conventions](process-conventions.md#pull-request-descriptions). A clean reviewer report does not by itself authorize task closure or merging.

After a GitHub merge, follow the [main synchronization instructions](worktrees.md#main-synchronization) and verify that the task's final commit is included in the fetched destination history. Report any local synchronization left pending because the checkout is unavailable.

Authorization to merge includes the following cleanup unless the human directs otherwise. The agent completing the merge is responsible for it; if the human merges elsewhere, an agent directed to perform post-closure steps may carry it out once the merge is confirmed.

- Remove the task worktree under the [worktree removal instructions](worktrees.md#cleanup).
- Delete its local branch under those instructions after removing the worktree.
- If the remote task branch still exists, delete it after verifying that its current tip is included in the remote destination's history; if it contains unmerged commits, preserve it and report them.
- Report cleanup performed and anything retained for further attention.

If the task is blocked or abandoned, retain its worktree and work until the human directs their disposition.
