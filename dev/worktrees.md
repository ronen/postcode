# Worktrees

This document describes the local checkout layout and how agents use it. It is human-maintained under the [development workflow](workflow.md#human-directed-process-maintenance).

To allow independent work to proceed simultaneously, work on separate branches generally uses separate worktrees.

<a id="layout"></a>
## Layout

Keep the primary checkout for general-purpose work. Put additional worktrees in a sibling directory named `<checkout-name>-worktrees/`, where `<checkout-name>` is the primary checkout's directory name:

```text
<checkout-name>/
<checkout-name>-worktrees/
├── <branch-directory>/
└── <another-branch-directory>/
```

Identify the primary checkout and registered worktrees with `git worktree list --porcelain`; derive the worktree container's location from the primary checkout's parent and directory name, not from the agent's current directory. Create the container when the first worktree is needed.

Planning and process maintenance may use the primary checkout. Read-only inspection may cross checkout boundaries, but account for the revision being inspected. Keep one writer at a time in a checkout; agents collaborating on the same work may use it in turn. Do not switch, reset, stash, or modify a checkout being used for other work.

<a id="setup"></a>
## Setup

Given the selected branch name and, for a new branch, its starting revision, the agent prepares the worktree; the human need not create it or start another agent there.

1. Inspect the registered worktrees. Reuse the worktree for the selected branch when it belongs to the work being continued; do not take over a checkout being used for other work.
2. Otherwise, create a worktree for the existing branch, or create the new branch and worktree from the selected starting revision. Derive a readable directory name from the branch name, omitting a prefix such as `<agent>/` and making it safe for use as a single directory name. Place it under the worktree container. Check existing branches and paths before creating them; choose a distinguishing suffix if the derived directory name is already in use. Do not overwrite or repurpose a worktree used for other work.
3. State the branch, worktree path, and starting commit. Direct subsequent edits, commands, verification, and commits to that worktree, even if the conversation began in the primary checkout. Read the applicable instructions there before proceeding.

An unrelated dirty checkout does not prevent creating a worktree from committed history. Preserve its changes.

If permissions prevent creating or using the sibling worktree, request the needed access rather than falling back to a checkout being used for other work.

<a id="local-files"></a>
## Local files

A new worktree contains committed files, not the source checkout's uncommitted or ignored material.

Read supporting scratch material from its known source location, or copy only the material needed into an appropriate ignored directory in the working checkout. Preserve the source material and its provisional status; do not treat copying as approval or promotion. Install dependencies and produce build outputs in the working checkout as needed. Do not share mutable dependency or build directories between active worktrees.

<a id="integration"></a>
## Integration

Worktrees share Git history, so local branches can be merged without pushing and pulling between checkouts. Updating one branch does not itself update worktrees on other branches. Perform integration in the receiving branch's worktree, preserving existing changes and repeating affected verification.

If that checkout is dirty or being used for other work, leave it untouched and report the pending integration.

<a id="main-synchronization"></a>
### Synchronizing main

Before starting new work from `main`, and after a GitHub merge, fetch `origin` and compare local `main` with `origin/main`. Fast-forward a clean, available checkout of `main` when it is behind. If local commits await publication, publish them only when authorized. Resolve divergence or unpublished prerequisites with the human unless their treatment has already been directed. Do not reset or rebase `main` to make the references agree.

If synchronization would require changing a checkout that is dirty or being used for other work, leave it untouched and report the pending synchronization. Obtain direction on the starting revision if beginning new work, rather than silently using a stale baseline. When verifying a GitHub merge, use the freshly fetched `origin/main`; a local merge is verified against its local destination branch and, when publication is required, the fetched remote destination after pushing.

<a id="cleanup"></a>
## Removal

When a worktree is no longer needed and its removal is authorized, perform removal from outside that worktree.

- Confirm that commits were published when required and incorporated into the intended destination when integration was required. For a squash merge, verify the incorporated result rather than relying solely on commit ancestry.
- Inspect tracked changes, untracked files, and ignored material before removal. Preserve useful work and evidence in an appropriate location. Remove expendable material created for the work; ask about material whose ownership or value is unclear. A clean Git status alone is insufficient evidence that all local material is disposable.
- Remove the worktree with `git worktree remove` once preservation is complete. Do not force removal to bypass unresolved local work.
- When local branch deletion is authorized by the applicable workflow or human direction, delete it after removing the worktree. First verify that all branch commits are incorporated into the intended destination, no remaining worktree uses the branch, and the human has not asked to retain it. Use `git branch -d`; if deletion fails, report it rather than forcing it.
- Leave the general-purpose checkout and other active worktrees undisturbed. Report cleanup performed and anything retained for further attention.
