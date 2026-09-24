# Module investigation planning package

Status: in review

This package contains promotion-ready text except for status metadata and explicit
review markers. It is non-governing while under drafts; implementation has not been
authorized. Only this directory is changed by the package.

## Contents and destinations

| Document | Canonical destination |
| --- | --- |
| [Module investigation](plans/module-investigation.md) | `docs/plans/module-investigation.md` |
| [Investigons and progressive module investigation](decisions/module-investigation-decisions.md) | `docs/decisions/module-investigation-decisions.md` |
| [Core concepts](docs/core-concepts.md) — full revised document | `docs/core-concepts.md` |
| [Architectural constraints](docs/architectural-constraints.md) — full revised document | `docs/architectural-constraints.md` |

Investigation is the product framing; interpretation remains the supporting
capability. Investigons are retained qualified prose accounts, while projections
remain the general lens-result concept, including for mechanical investigations.

Interpretation uses the existing evaluation and session-store pipeline. Interpreter
queries can request qualified mechanical analysis and full captured source;
interpreter-only source access is not a human source-escape event.

The core-concepts revision adds Investigon and its relationships, and explicitly
includes investigons in the Subject definition. The constraints
revision adds stable investigon references, fixed composition and investigation provenance, and explicit
correction rules. Other existing definitions and constraints retain their wording;
links are adjusted for the draft location. There is no foundation change and no
existing decision supersession in this package.

## Review markers

`[proposed Pn]` identifies a concrete default offered for human review. It is not
an implementation choice until accepted. `[needs-review Rn]` identifies a domain
choice that must be resolved consistently across the documents before promotion.
The marking covers the paragraph that follows it unless that paragraph explicitly
identifies a larger section. Untagged behavior expresses the direction established
in discussion, subject to review of this complete package.

| Marker | Choice | Location |
| --- | --- | --- |
| R1 — resolved | Follow-up lenses select investigons as subjects in their own right, retaining program context; investigons are not entities | Plan, decision, core concepts |
| R2 — resolved | Whole-investigon one-to-one correction and handling obsolete/conflicting targets | Plan and decision |
| R3 — resolved | Qualified subject associations, inspect/retrieval, and selection of retained results and replacements; inspection expansion mapping | Plan, decision, core concepts |
| P1 — resolved | One-shot and shell module summary; shell-only follow-ups; project-summary default deferred | Plan, scope |
| P2 — resolved | Root investigon for each result with selectable subparts | Plan, result/navigation |
| P3 — resolved | Repeat commands display retained current results, including partial/failed outcomes, without inference | Plan, retained results |
| P4 — resolved | Minimum request context; evidence is acquired by reference, with optional prefetching under the same rules | Plan and decision, interpreter execution |
| P5 — resolved | Subject/artifact references are the complete interpreter program-access surface; shared acquisition owns capture and validity | Plan and decision, evidence access |
| P6 | Bounded execution policy and reported limits | Plan, outcomes |
| P7 | Coherent validation/publication of result and correction batch | Plan, outcomes |
| P8 | Three fixed formative subjects and preparation policy | Plan, verification |
| P9 — resolved | Retry and forced regeneration outside the slice; separate backlog candidates; restart recovery documented | Plan, retained results |

Exact provider route and configuration, schemas, link storage, command spelling,
reference formatting, tool signatures, and numerical execution defaults are
implementation choices within the reviewed semantics. They are not additional
pre-plan research projects. Provider setup must describe source transmission,
authentication, and measured limitations.

## Review and promotion

Resolve the markers as one package, remove resolved markers, set the plan status
and decision status/date, and remove draft status from the governing-document
copies. Promote the full reviewed governing revisions with the accepted decision.
Adjust relative links for canonical destinations and update the plan/decision
indexes. Recheck against concurrent changes before replacing either governing
document. The package itself does not change canonical indexes or plan lifecycles.

The canonical plan index currently describes the shell as awaiting implementation,
whereas STATUS and the merged implementation show it exists. That is a pre-existing
index/lifecycle discrepancy, not a reason to redo the shell. Its correction needs
the normal human-directed lifecycle handling, separately from silently changing
historical plan status in this package.

Approval of this package is not authorization to implement. An implementation
request and task record establish that later boundary. No claim about model quality,
price, or supported effort setting has been verified by drafting these documents.
