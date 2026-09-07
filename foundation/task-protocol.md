# Task Protocol

This document defines how an approved implementation task becomes a durable record of its instructions, material follow-ups, outcome, and verification.

## 1. Initiating a Task

The protocol applies to substantive implementation tasks. It does not require every documentation adjustment, exploratory conversation, or incidental cleanup to become a task record.

A task may begin in either of two ways:

- The human supplies an approved `_work/TASK.md`.
- During an interactive conversation, the human explicitly authorizes a substantive implementation request and the agent confirms that it will open a task record before proceeding.

`_work/TASK.md` is a disposable drafting and handoff artifact. It is prepared and revised before implementation by the human, possibly in collaboration with a planning agent. The executing agent treats it as immutable input, does not modify it, and does not commit it.

Before opening the task record, the executing agent must restate the goal and identify any explicit scope boundary.

A request with an independently meaningful goal, or one made after the current task has concluded, begins a new task. A request that changes, clarifies, constrains, redirects, pauses, or extends an active task is a follow-up to that task. Incidental cleanup may remain within the current task when it is local, obvious, and supports the approved goal without introducing a separate design decision. If the classification is unclear and would materially affect scope or history, the agent must ask the human.

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

After confirming that the opening commit succeeded, the executing agent must delete `_work/TASK.md` if it was the source of the task. The committed task record then becomes the sole record of the active task.

The approved task text is immutable evidence. It must not be rewritten retrospectively for clarity or to match the implementation.

## 3. Follow-up Prompts

Before acting on a material follow-up prompt, the executing agent must:

1. append it to the **Follow-ups** section in the order received;
2. commit the updated record using the title `TASK FOLLOW-UP: YYYY-MM-DD-<slug>`, matching the record identifier;
3. only then perform the work affected by the follow-up.

Preserve the prompt verbatim when practical. If surrounding conversation is required to make it intelligible, include only the minimum necessary context and distinguish that context from the prompt itself.

Incidental conversation, status questions, tool output, and discussion that does not affect the task need not be recorded.

Previously recorded task text and follow-ups must not be edited when a later prompt supersedes them. The later prompt records the change in direction.

## 4. Concluding a Task

The agent may conclude a task as `completed` when the approved goal and appropriate verification are clearly satisfied. It must ask the human when completion depends on unresolved interpretation, subjective acceptance, or explicitly required approval. If required work remains, the task may be completed only when the human has explicitly approved deferring that work and thereby revised the effective goal. Concluding a task as `blocked` or `abandoned` also requires explicit human approval.

To conclude the task, the executing agent must:

1. set the task status to `completed`, `blocked`, or `abandoned` and set **Closed** to the conclusion date;
2. append a concise **Outcome** describing what was implemented and any material deviations from the approved task, unresolved concerns, resulting follow-up work, or resulting backlog entries;
3. append the checks and observations that support the **Verification** result;
4. commit the concluded task record using the title `TASK CLOSED: YYYY-MM-DD-<slug>`, matching the record identifier. Append `(BLOCKED)` or `(ABANDONED)` when the corresponding status applies.

Once a task has been concluded and its closing record committed, the record must not be modified. If a correction, redaction, or addition appears necessary, the agent must pause and ask for guidance. Further implementation—including work following a premature conclusion—requires a new continuation task that references the concluded record. The earlier record remains unchanged, preserving the historical judgment made at closure.

## 5. Git Chronology and Worktree State

Task-record commits preserve the chronology of the approved request, implementation, and conclusion. In particular:

- the initial task record is committed before implementation;
- each material follow-up is committed before the work it changes;
- the closing record is committed after implementation and verification.

Before making any task-record commit, the executing agent must inspect the worktree for other uncommitted changes. If any are present, the agent must ask the human whether to:

1. commit those changes separately first;
2. include them in the task-record commit, which is unusual because it weakens the historical boundary but may be chosen deliberately;
3. commit only the task record and leave the other changes uncommitted and untouched.

The prescribed commit-message formats govern only the subject line. The agent may add a commit body with useful explanatory context based on its own judgment.

Because task records are committed to a public repository, they must be checked for private, sensitive, or irrelevant contextual material before they are committed.
