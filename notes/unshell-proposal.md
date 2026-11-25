# UNSHELL proposal

Working proposal, 25 November 2026. Non-governing notes for discussion, not an
implementation plan or authorization. This is the current synthesis; the
[assessment](unshell-assessment.md) supplies technical evidence and the
[planning discussion](unshell-planning.md) preserves direction and qualifications.

## Purpose

Surgically separate and remove the CLI shell, including one-shot investigation
commands and their private execution machinery. Preserve the application capabilities
needed by direct validation, the future book model and future human clients.

Remove a core capability when the feature it supports is only needed by the retiring
client and removal is separable. Being exported, tested, generally named or originally
intended for reuse is not sufficient reason to keep it. Conversely, no current caller
does not by itself establish that a capability has no foundation or future-product
responsibility. Identify those responsibilities explicitly rather than preserving
the entire shell or assuming every unused facility is dead.

## Resulting system

- The internal application API continues to supply qualified analysis, investigation,
  exact retained access, resolution, attribution and usage within its supported Session
  lifetime. It does not become a public API or external-agent export.
- A small command entry point supplies authentication. There is no replacement
  end-user investigation interface during this transition.
- Existing trial runners continue to call the application directly. Rendering useful
  for validation lives in trial support, outside core.
- The private CLI worker, transport, adapter, shell, investigation commands and their
  exclusive support disappear. The application remains callable in-process; this
  proposal does not supply hard preemption of synchronous work or a new GUI host.
- Precise identities and qualified references survive. CLI compact aliases and their
  metadata do not. Trial steps retain their connections through exact references,
  option addresses and captured requests.

## Separation and removal

| Area | Disposition |
| --- | --- |
| CLI interaction and presentation | Remove command parsing for retired operations, interactive navigation, terminal arrangements, CLI output/classification and worker finalization. Preserve authentication's actual dependencies. |
| Useful trial rendering | Move qualified explanation arrangement and state-diagram rendering into trial support. Preserve alternative answers, limitations and notices for unrendered content. Keep content selection, exact support and state semantics in core. |
| CLI-only core hooks | Remove private operation-scope access, CLI-only request constraints, deferred-check routing, binding ports and shell-only work/usage formatting. Preserve ordinary application validation and execution checks. |
| Compact aliases | Remove allocation, compact-input resolution and alias-only metadata. Preserve precise-ID validation, kind checks, names/ambiguity, exact retained targets and qualified support. Investigator wire handles are a separate active facility and remain. |
| Feedback and observation implementation | Remove command-shaped feedback builders, snapshots, envelope and the unused observation sink/delivery implementation. Preserve foundation obligations and document the remaining research-support gap below. GUI feedback design is outside this proposal. |
| Domain/application capabilities | Preserve acquisition, qualified analysis and contributions, retained answers, fresh/follow-up behavior, attribution, credentials, resource ownership and useful client-neutral validity policy. CLI use alone does not make these CLI features. |
| Tests, scripts and dependencies | Remove those whose purpose disappears; relocate checks of surviving semantics to the direct boundary or trial support. Preserve direct validation/measurement tools and shared fixtures with surviving consumers. |

## Interruption capability

The proposal includes a narrow core improvement where the retiring host currently
protects a useful guarantee better than direct application execution does:

**An interrupted operation remains interrupted when cleanup fails; cleanup failure
is separately observable, and final accounting remains available.**

Retain terminal cancellation, rejection of late content, sealing of usage, and
resource ownership until confirmed exit. Distinguish cancellation request, operation
settlement, cleanup reporting and actual resource exit. Do not claim that in-process
cancellation can stop arbitrary synchronous computation or survive destruction of
its host.

The assessed gap is concrete: a dialog's cleanup exception can replace the original
interruption, causing attempt and work classifications to disagree. Address that
through existing lifecycle responsibilities rather than a general worker framework.

The proposal still needs a precise account of how secondary cleanup failures reach
the caller, when final reports are complete, and how reporting-callback exceptions
interact with interruption. Choosing `Session.close()` by name alone is insufficient:
it currently does not join an active request. These are remaining design details to
settle in this proposal before converting it into implementation steps.

## Trial preservation

Structured results remain authoritative. Moving rendering preserves the useful
explanations and diagrams, their qualification, and the runner's existing sequence,
capture and budget behavior. Do not redesign trial schemas, reporting, publication
or failure handling merely because the renderer moves.

Two deliberate differences are distinguished from that preservation:

- Compact-alias metadata and accepted compact-alias inputs may disappear, as agreed.
  Precise identity, qualified references and connections between trial steps remain.
- The separately specified core interruption correction changes its exceptional
  outcome/cleanup behavior. It is not permission to revise the runner's lifecycle.

Evidence for preservation should cover equal-input rendering and application results,
ordinary/fresh/follow-up step connections, alternatives, omissions and state diagrams.
Any comparison exclusions must name the deliberate alias changes and unavoidable
run-specific values; they must not hide changed qualification or broken references.
Live trials supplement controlled comparison rather than establish equality between
nondeterministic agent responses.

## Research observation capture and delivery

The [foundation](../foundation/product-design.md#research-observation-support)
requires research observation support and delivery of resulting records to a
designated research destination. It does not prescribe the current sink API,
command-shaped batch schema, or a universal event stream. Its
[feedback intent](../foundation/product-design.md#inadequate-representations)
also survives retirement of the particular CLI interaction. Removing the shell
does not withdraw either requirement.

Remove the unused observation sink and delivery implementation with its retiring
CLI consumers. Do not retain it speculatively, introduce a new consumer to justify
it, or replace it with a generic observation framework.

After retirement, the application lacks the observation capture and delivery
facility needed to support research into human interactions and inadequacy feedback.
Document this capability gap in the resulting architecture/capability account and
the eventual retirement decision's conformance statement. The foundation obligations
remain requirements for future work; removing the unused implementation neither
withdraws them nor establishes conformance. GUI feedback design is outside UNSHELL.

## Residual capabilities and exclusions

Shared Presentation negotiation remains outside UNSHELL. It loses its principal
client, while requirement selection is coupled to still-needed Expansion acquisition.
Document that residual, its surviving uses and what a later separation would require.
Do not remove evidence acquisition with presentation negotiation or declare a future
BOOK/GUI consumption model here.

Other leftovers should be classified by evidence: useful retained capability,
deliberately retained transition code, or unnecessary code whose removal needs actual
core redesign. Only the last category belongs in the redesign residual register.
Canonical exports, tests and adopted clauses require reconciliation, but do not by
themselves make removal technically inseparable.

Excluded: implementing BOOK, GUI interaction/hosting/feedback design, replacement
investigation CLI, generic worker abstraction, unrelated trial improvements and
changes to foundation or development-process documents.

## What remains before an implementation plan

Settle the precise interruption outcome, cleanup and reporting contract. Check the
complete proposal against the governing
requirements, including scoped retirement of alias, worker and CLI feedback clauses.
Then prepare the formal decision/document revisions and an implementation plan.
Agreement on this note's direction does not amend governing documents or authorize
implementation. No formal plan is being drafted in parallel with this discussion.
