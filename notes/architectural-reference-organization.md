# Architectural reference organization

Exploratory context for ORGANIZE, from strategy discussion on 2026-11-18.
This is a capability direction, not an adopted content model or implementation plan.

## Purpose

ACCOUNT retains entities and qualified, potentially competing information about
them, together with question-specific results. That machinery does not by itself
choose an organization that helps a reader understand a project.

ORGANIZE could construct and revise a useful reference framework: groupings,
entry points, cross-references and reading paths suited to a project, architectural
concern or stated investigative purpose. This is analogous to some of an editor's
work. It could organize accumulated material, propose a framework before all its
parts are populated, or revise an earlier organization as understanding develops.
It need not be a mandatory first step for every investigation.

A related candidate is [investigator contributions to reference organization](../steering/candidate-capabilities.md#investigator-contributions-to-reference-organization):
supply a framework during an investigation and ask the agent to suggest placement,
cross-references or new entries for its contribution. This may complement a
dedicated organizing investigation without requiring a model change in advance.

## Different kinds of work

- **Indexing:** enumerate known subjects, names and explicit relationships.
  This may be mechanically derived without new architectural judgment.
- **Organizing:** propose headings, groupings, connections and reading paths
  that help someone understand this project or concern. These choices may require
  interpretation and should have an intelligible purpose and rationale.
- **Planning coverage:** identify worthwhile topics or gaps and propose further
  investigation. This requires additional judgment about relevance and sufficiency;
  it is a possible extension, not an automatic part of the first implementation.

An editorial choice such as placing recovery under resilience differs from a
claim that a particular subsystem implements recovery. A contents hierarchy need
not assert a program hierarchy. Likewise, placing two accounts next to one
another does not establish their correspondence or reconcile their disagreement.

Simple sorting and display grouping remain presentation choices. Where a framework
adds inferred relationships, synthesis or coverage claims, those are core results
with qualification and provenance, not analysis hidden in GUI construction.

## Questions to explore

- What is organized: subjects, questions, selected content, or combinations?
  How does an entry relate to several contributions or alternative accounts?
- What makes an organization useful for a particular purpose? Could responsibility,
  runtime behavior and deployment offer different, equally legitimate routes?
- What minimum information is needed to propose a useful framework? How are
  tentative headings distinguished from findings about the program?
- How can partial coverage be made intelligible without suggesting that missing
  material was investigated and found absent?
- How is a framework retained, selected and revised using the account machinery?
  Earlier references and organizations should remain intelligible; no particular
  schema, universal ontology or single reconciled model is implied here.

## Relationship to other work

[SLICE](first-graphical-slice.md) decides whether the first graphical experience
needs this capability and scopes its initial use. Preliminary organization
exploration can inform that choice without making implementation a prerequisite
for selecting the offering. ORGANIZE builds on ACCOUNT; PRESENT and MINIGUI make
the resulting framework readable and navigable.

The [initial journey](initial-journey/README.md) and earlier
[landscape-orientation ideas](../steering/candidate-capabilities.md#explorative-landscape-orientation)
are useful inputs. Organizing known accounts and discovering a project's
architectural landscape are related but distinct capabilities.

See [upcoming work](../steering/upcoming-work.md#organize) for current sequencing.
