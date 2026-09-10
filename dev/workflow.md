# Development Workflow

This document describes how humans and coding agents plan, implement, verify, document, and hand off changes to PostCode. It complements the durable implementation history defined by the [task protocol](../foundation/task-protocol.md).

## 1. Kinds of Work

### 1.1 Exploration and planning

Exploration, discussion, and preliminary planning do not require a task record. This includes investigating alternatives, drafting plans, maintaining development-process documentation, and preparing a proposed implementation task.

Planning must not be treated as authorization to implement. Unresolved choices should remain in drafts or discussion until the human approves a plan or accepts and records a decision.

### 1.2 Substantive implementation

Substantive implementation follows the [task protocol](../foundation/task-protocol.md). Examples include creating an executable scaffold, adding application dependencies, defining runtime contracts, implementing behavior, and materially changing existing behavior or architecture.

Before implementation begins, restate the authorized goal and its explicit scope boundaries, then open the task record as prescribed by the protocol.

### 1.3 Incidental changes

Small local corrections may accompany related work when they are obvious, low risk, and do not introduce a separate design decision. Keep unrelated cleanup separate. When classification would materially affect scope or history, ask the human.

## 2. Before Making Changes

1. Read `AGENTS.md` and the applicable adopted foundation documents.
2. Read the current plan, architecture documentation, accepted decisions, and conventions relevant to the work.
3. Inspect the worktree and preserve existing human or agent changes.
4. For substantive implementation, locate or open the applicable task record before changing the implementation.
5. Identify uncertainties that could materially change the goal, architecture, or external behavior. Resolve them with the human rather than embedding an assumption silently.

## 3. Planning

Plans describe intended work, not established system behavior. Store human-approved plans under [`docs/plans/`](../docs/plans/) and follow the lifecycle described there.

A useful implementation plan should state:

- the problem or use narrative;
- the intended outcome and observable success criteria;
- scope and explicit non-goals;
- relevant constraints and dependencies;
- proposed milestones or vertical slices;
- risks, uncertainties, and open questions;
- decisions required before or during implementation.

Keep plans at the level needed to guide work. Do not use planning documents to settle architecture implicitly: record consequential accepted choices under [`docs/decisions/`](../docs/decisions/).

Use [`drafts/`](../drafts/) for provisional planning artifacts when their history is worth tracking in Git. Draft artifacts are durable but non-governing; a commit preserves a draft without approving it. Use a descriptively named root underscore directory, such as `_initial-product-slice/`, instead when the artifacts are ephemeral, local to the checkout, and disposable. Both forms of provisional material follow the [provisional-working-material conventions](conventions.md#provisional-working-material).

The human directs which provisional artifacts are promoted. Move or incorporate only explicitly approved plans into `docs/plans/`, and only explicitly accepted decisions into `docs/decisions/`. Promotion is a change of project role, not merely a file move: review the resulting canonical documents against their destination requirements. Before removing provisional material, confirm that all context worth preserving has been carried into durable documents.

Any commit that adds or modifies draft artifacts under `drafts/` must use a subject beginning `draft: ` followed by a concise description, and must not include changes outside `drafts/`. A promotion commit is the exception: it may add or update approved material at its canonical location while deleting the corresponding draft artifacts, and uses an ordinary descriptive subject. Changes to the directory guidance in `drafts/README.md` are not changes to a draft artifact and follow ordinary commit conventions.

## 4. Implementation

- Prefer the smallest coherent change that advances the authorized goal.
- Preserve established boundaries and dependency direction. If they need to change, make that change explicit and document the decision when consequential.
- Add or update automated tests with behavior where practical.
- Use fixtures with known expected results for analysis behavior.
- Validate data at boundaries rather than relying solely on static types or convention.
- Do not introduce dependencies, generated artifacts, or new repository-wide tooling without making their purpose and lifecycle clear.
- Avoid speculative abstractions and empty structural scaffolding. Create directories and extension points when they acquire a concrete use.
- Keep outputs deterministic where practical, particularly schemas, projections, snapshots, and generated agent context.

## 5. Unexpected Findings

Implementation, documentation, planning, decisions, and verification may reveal anomalies or contradictions. Treat an unexpected finding as evidence to investigate, not as proof of a particular explanation or an automatic instruction to clean up.

1. Investigate enough to determine whether the finding materially affects the current work.
2. Do not silently resolve a contradiction by changing whichever implementation or document is easiest.
3. Address a clear, local consequence of the authorized work when doing so does not introduce a separate goal or design decision.
4. Report a material finding outside the current scope and add it to the backlog when it remains worth considering.
5. Pause and ask the human when the finding undermines the task's premise, requires a consequential new decision, or would materially expand the authorized scope.
6. Preserve historical evidence: supersede accepted decisions rather than rewriting their original rationale, and do not revise concluded task records.
7. Record material uncertainty when the available evidence does not resolve the explanation.

Pre-existing or trivial inconsistencies do not all require investigation. Relevance to the current work, potential impact, and the cost of being wrong should determine the depth of investigation.

## 6. Documentation and Decisions

Documentation is part of the implementation. If a change makes an existing document materially false or incomplete, the work is not complete until that document is updated or the omission is explicitly recorded.

Architecture documentation is selective and descriptive, not a source of prescriptive requirements. Include information when it defines a major responsibility or boundary; explains important dependency direction or data flow; describes a process, storage, deployment, trust, or security boundary; records a system-wide invariant or operational constraint; or helps orient work across multiple components or tasks. It should be durable, cross-cutting, and necessary to understand the system beyond what the implementation directly reveals.

Do not turn architecture documentation into a file, class, function, or API inventory. Exclude copied interfaces, details readily discoverable from nearby source, transient implementation mechanics, speculative future structure, and rationale already preserved in a decision record. Store architecture documentation under `docs/architecture/`. Begin with `docs/architecture/README.md` as the single overview, and add further documents only when a stable area needs its own conceptual explanation. Link descriptions to the accepted decisions that govern them. If the implementation, architecture documentation, and a governing decision disagree, treat that divergence as an unexpected finding rather than silently changing the decision or presenting the description as normative.

Update the appropriate form of documentation:

- plans describe intended work and learning goals;
- architecture documentation describes how the current system works;
- decision records preserve consequential choices and their rationale;
- `STATUS.md` gives humans a concise, current view of the project's externally meaningful state;
- the backlog captures worthwhile work that is not part of an active plan or authorized task;
- conventions describe repeatable local engineering rules;
- task records preserve authorization, material follow-ups, outcome, and verification;
- user-facing documentation describes observable use and behavior.

Do not modify governing documents under `foundation/` unless the human explicitly authorizes a foundation revision. Authorization for implementation that conflicts with the foundation is not authorization to revise it; report the conflict and seek direction.

Record a decision when a choice has meaningful, durable consequences; constrains later work; or is likely to be repeatedly reconsidered. Routine implementation details do not require decision records.

Update `STATUS.md` when a change materially alters what exists, what can be run or demonstrated, what work is active, or what is expected next. Keep it concise and link to authoritative plans and task records instead of duplicating them.

When useful work or a concern arises outside the current scope, add it to [`docs/backlog.md`](../docs/backlog.md) rather than silently expanding the plan or task. A backlog entry records an open candidate, not an implementation commitment. The human evaluates and curates the backlog during planning; an agent must not prioritize, promote, implement, or remove an entry without human direction.

## 7. Verification

Verification should be proportional to the risk and scope of the change. Before handing work back:

1. run the relevant automated checks;
2. exercise important user-visible behavior when applicable;
3. inspect generated or visual output when layout or representation matters;
4. check that documentation describes the resulting system rather than the initial intention;
5. update `STATUS.md` if the externally meaningful project state changed;
6. capture material out-of-scope follow-up work in the backlog when appropriate;
7. review the final diff for accidental, unrelated, sensitive, or generated content.

Report what was verified, what was not verified, and any residual uncertainty. Never imply that an unperformed check passed.

## 8. Completion and Handoff

For substantive implementation, conclude the task according to the task protocol only when the authorized outcome and appropriate verification are satisfied.

A handoff should leave the repository understandable without access to the conversation that produced it. State:

- the resulting behavior or artifact;
- material deviations from the plan;
- verification performed;
- unresolved risks or questions;
- any follow-up work that remains outside the completed scope.

Do not leave durable rationale only in chat, commit messages, or an agent's final response. Put it in the appropriate repository document when later work will depend on it.
