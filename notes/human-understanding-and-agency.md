# Support human understanding and agency

Started: 2026-10-14
Status: emerging design principle; durable, non-governing exploration

This principle emerged while exploring the first useful graphical investigation
journey. It builds on the foundation's aim of helping humans understand, direct,
and supervise software and its adopted [design premise](../foundation/product-design.md#design-premise):
the model must not presuppose knowledge of the implementation language or a program
representation intended for human reading. This note explores the implications
for human participation and experience design. Those elaborations remain
non-governing; this note is not an application requirement, implementation plan,
or authorization to implement.

## Principle

PostCode's purpose is to help humans understand and guide software development
when the coding is carried out by agents. It should help people develop and
examine their understanding of the software's purposes, design, externally visible
commitments, responsibilities, constraints, invariants, tradeoffs, and evolution.

PostCode anticipates a near future in which the human may not know the programming
language, may not know how to debug the implementation, and may be working with
software that has no human-readable source code. The experience should be designed
for that situation. Human understanding and direction must not depend on an
ability to read, write, or repair the underlying implementation.

This purpose should orient the experience toward questions such as: What design
is taking shape? Which constraints and invariants matter, and what supports the
claim that they hold? What would a proposed change preserve or alter? Routine
implementation diagnosis and repair can be delegated to agents; helping the human
perform those tasks should not become PostCode's default organizing purpose.

PostCode gives the human a working surface for exploring the software, questioning
accounts of it, considering alternatives, and judging proposed changes. Its value
lies in making that participation informed and effective.

The appropriate level of detail follows the human's information need. A broad
account may help establish context; a precise implementation detail may determine
an important commitment. PostCode should make the significance of that detail
intelligible through appropriate explanations and representations, preserving its
evidence and limits without requiring fluency in the implementation language.
People should be able to move between broad context and precise questions while
retaining the question, evidence, qualifications, and earlier understanding.

A useful PostCode journey should make clear what the human gains from
participating: an understanding they wanted, a consequential choice they can now
make, an assumption they can challenge, or a direction they can communicate. That
benefit should guide which investigations and presentations the experience brings
forward.

Open-ended exploration is part of this purpose. The human need not begin with a
decision or an agent's proposal; discovering what deserves attention can itself be
a valuable outcome.

## Example: repeated changes when adding a policy

> We keep changing several parts whenever we add a policy. Is that an accidental
> coupling worth removing, or does it reflect a shared commitment?

This is an illustrative design question, not a finding about Cockatiel or another
particular project. The reported pattern is a lead to investigate; repeated
co-change alone establishes neither accidental coupling nor a shared commitment.

An agent could investigate which responsibilities change together, what evidence
explains those relationships, and what alternative boundaries would preserve or
alter. PostCode could help the human examine that qualified account, distinguish
recorded rationale from inferred explanations, and weigh the consequences of
keeping or changing the design.

The human's contribution is to judge which commitments matter and which tradeoffs
are acceptable. Possible outcomes include directing a refactoring, retaining the
existing coupling with a clearer understanding of its purpose, or requesting more
evidence. The example does not require the human to trace every dependency or
perform the refactoring, and it does not assume PostCode already supplies the
necessary history, synthesis, or alternative-design analysis.

## Example: investigating a reported problem

> Investigate this problem and report what you find, what remains uncertain, and
> anything preventing you from making progress.

When a problem calls for debugging, the expected pattern is for the human to ask
an agent to investigate and report its findings, evidence, uncertainty, and any
difficulty making progress. PostCode should help the human understand and question
that account, resolve choices about intended behavior or acceptable tradeoffs,
and direct further work. The human may have no ability to take over the debugging.
An agent's difficulty therefore needs to be expressed in terms the human can act
on: unresolved intended behavior, competing explanations, missing observations,
or a need for another investigative method. Further diagnosis may require other
agents or tools, additional evidence, or an explicit acknowledgment that the
problem remains unresolved. Agent reports remain attributed accounts whose
conclusions can be examined and challenged; a readable explanation alone does not
establish that its conclusion is correct.

## Design implications

Scale and abstraction do not determine the value of human participation. A small
behavioral distinction can require human judgment, while a large refactoring may
be delegated.

Assess a proposed journey through three questions:

- What understanding, choice, or direction does the human gain from participating?
- Can they gain it without reading the implementation or taking over its debugging?
- Can they understand what supports the account, what remains uncertain, and how
  to challenge it or request further investigation?

Evidence access needs intelligible accounts of what the evidence establishes and
leaves open, preserving its qualification. Source access can supplement those
accounts where useful, but cannot be their necessary fallback. These are criteria
for designing and assessing the experience, not claims of current capability.

## Related material

- [Research product design](../foundation/product-design.md), especially the
  design premise and epistemological contract.
- [Application specification](../docs/app-specification.md), especially working
  through qualified Views and shared context for external coding agents.
- [First useful graphical investigation](gui/first-useful-investigation.md),
  including the scenario reconsideration that prompted this principle.
