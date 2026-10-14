# Support human understanding and agency

Started: 2026-10-14
Status: emerging design principle; durable, non-governing exploration

This principle emerged while exploring the first useful graphical investigation
journey. It sharpens the foundation's existing aim of helping humans understand,
direct, and supervise software. It is not an adopted foundation revision,
application requirement, implementation plan, or authorization to implement.

## Principle

PostCode's purpose is to help humans understand and guide software development
when the coding is carried out by agents. It should help people develop and
examine their understanding of the software's purposes, design, externally visible
commitments, responsibilities, constraints, invariants, tradeoffs, and evolution.

This purpose should orient the experience toward questions such as: What design
is taking shape? Which constraints and invariants matter, and what supports the
claim that they hold? What would a proposed change preserve or alter? Routine
implementation diagnosis and repair can be delegated to agents; helping the human
perform those tasks should not become PostCode's default organizing purpose.

PostCode gives the human a working surface for exploring the software, questioning
accounts of it, considering alternatives, and judging proposed changes. Its value
lies in making that participation informed and effective.

When a problem calls for debugging, the expected pattern is for the human to ask
an agent to investigate and report its findings, evidence, uncertainty, and any
difficulty making progress. PostCode should help the human understand and question
that account, resolve choices about intended behavior or acceptable tradeoffs,
and direct further work. An agent's difficulty is a reason to make the obstacle
intelligible, not an automatic handoff of implementation-level diagnosis to the
human. Agent reports remain attributed accounts whose conclusions can be examined
and challenged.

The appropriate level of detail follows the human's information need. A broad
account may help establish context; a precise implementation detail may determine
an important commitment. People should be able to move between them while
retaining the question, evidence, qualifications, and earlier understanding.

A useful PostCode journey should make clear what the human gains from
participating: an understanding they wanted, a consequential choice they can now
make, an assumption they can challenge, or a direction they can communicate. That
benefit should guide which investigations and presentations the experience brings
forward.

Open-ended exploration is part of this purpose. The human need not begin with a
decision or an agent's proposal; discovering what deserves attention can itself be
a valuable outcome.

## Implications to explore

"Higher level" is an imperfect description of this purpose. A small behavioral
distinction can require human judgment, while a large refactoring may be delegated.
Scale and abstraction do not determine the value of human participation.

A graphical journey that asks the human to repeat an agent's debugging procedure
may demonstrate PostCode's machinery without establishing why the human would use
it. Access to detailed evidence remains valuable for questioning an explanation
or informing a consequential choice. The human should be able to inspect it
without having to reconstruct the agent's diagnostic procedure. Direct human
investigation remains possible, but the experience should not depend on the human
taking over the agent's implementation work.

Use this question when selecting a journey: **What does the human gain from this
experience that makes their participation worthwhile?** Do not require every
exploration to end in a decision, a change request, or an agent handoff.

The principle may merit incorporation into application design or the research
project. Its destination and any governing adoption remain for explicit human
direction.

## Related material

- [Research product design](../foundation/product-design.md), especially the
  design premise and epistemological contract.
- [Application specification](../docs/app-specification.md), especially working
  through qualified Views and shared context for external coding agents.
- [First useful graphical investigation](gui/first-useful-investigation.md),
  including the scenario reconsideration that prompted this principle.
