# Support human understanding and agency

Started: 2026-10-14
Status: emerging design principle; durable, non-governing exploration

This principle emerged while exploring the first useful graphical investigation
journey. It sharpens the foundation's existing aim of helping humans understand,
direct, and supervise software. It is not an adopted foundation revision,
application requirement, implementation plan, or authorization to implement.

## Principle

PostCode should help people develop and examine the understanding they need to
shape software: its purposes, externally visible commitments, responsibilities,
tradeoffs, and evolution.

Agents can undertake substantial investigation and implementation. PostCode gives
the human a working surface for exploring the software, questioning accounts of
it, considering alternatives, and judging proposed changes. Its value lies in
making that participation informed and effective.

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
it. Detailed investigation remains valuable when it serves understanding,
challenges an explanation, or informs a consequential choice. Neither source
access nor debugging is excluded by this principle.

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
