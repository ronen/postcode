# Proposed revisions to docs/backlog.md

Add the following entries under `Candidates` when the module investigation package
is promoted.

## Assess reference-lifetime disclosure in existing views

Added: 2026-09-26
Origin: module investigation review and reference-lifetime disclosure decision
Area: presentation and session references

Assess views introduced by earlier slices against the
[reference-lifetime disclosure requirement](decisions/investigrams-and-progressive-investigation.md#disclose-reference-expiry-before-follow-up-use):
when references expire before they can be used as subjects of a subsequent
request, their surrounding presentation must make that limitation clear.
Check one-shot output in particular and bring nonconforming presentations into
conformance. A shared notice can cover affected references; ordinary follow-up
references in a continuing session need no repeated caveats.

The earlier implemented slices to assess are:

- [Initial module inventory](plans/initial-module-inventory-plan.md): module lists,
  module inspection, exports, and forwarding relationships.
- [Repository organization](plans/repository-organization-plan.md): repository
  and project organization views, group inspection, and membership references.
- [Module dependencies](plans/module-dependencies-plan.md): dependency overview,
  direct dependencies and dependents, and references in supporting source detail.
- [Transient interactive session shell](plans/transient-session-shell.md): shared
  presentation and help for one-shot commands versus continuing shell sessions.

Cover human and JSON output, including ambiguous-selection results, as these
views currently behave after the shell integration.

Conformance is currently unknown. The potential impact is confusion about which
displayed references support further navigation, rather than a change to
reference binding or the underlying program claims. This is a deferred usability
assessment, not a prerequisite for the module investigation slice.

## Retry failed or incomplete interpretation without restarting the session

Added: 2026-09-24
Origin: module investigation planning discussion
Area: investigation execution and recovery

Module investigation retains investigation-failure and
execution-limit outcomes; repeating a command displays those outcomes rather than
invoking the investigator again. Communication/service failures leave no reusable
outcome, so later requests already proceed through ordinary selection in the same
shell. This candidate concerns explicit retry of retained outcomes, whose current
recovery requires restarting the shell and losing accumulated investigation context.
Consider supporting that retry if formative use establishes its value. Define
which outcomes qualify, how retained evidence and accepted results are used, and
which attempt is displayed afterward. Preserve earlier outcomes and qualification;
a retry does not itself establish that earlier claims are superseded. This concerns
interpretation requests, not a change to existing mechanical-analysis retry rules.

## Explicitly rerun a successful interpretation

Added: 2026-09-24
Origin: module investigation planning discussion
Area: investigation execution and retained results

Module investigation reuses a retained successful result when
its command is repeated. Consider whether an explicit action to regenerate a
successful interpretation would be useful; no concrete need has yet been
established. Distinguish regeneration from inspecting a retained result, following
up on a new target, and displaying an explicit correction. Any later design must
account for inference cost and preserve earlier results without treating a newer
generation as automatically more correct. This is separate from retrying failed
or incomplete interpretation.

## Investigation usage and budgeting support

Added: 2026-09-24
Origin: module investigation planning discussion of execution containment and usage allowances
Area: investigation usage and budgeting

Consider user-set allowances for hosted inference, separate from the per-evaluation
mechanism that contains runaway investigations. Module investigation
includes basic per-investigation and session usage reporting, with explicit coverage
limits, but no budgeting interface. Future support could use those measurements
to prevent a new investigation from starting once an allowance is exhausted,
at coarse granularity without interrupting work in progress.
Define allowance scope, configuration, measured units, and enforcement limitations;
a token allowance is not a guaranteed monetary ceiling, and admission checks can
permit an in-flight investigation to exceed the remaining allowance.

Local inference may remove the need for provider-spending controls, but runaway
containment remains useful for responsiveness and resource use. Keep that mechanism
independent of budgeting support so it applies to either hosted or local execution.
Retain available provider usage metadata without assuming every integration reports
the same measures or supports precise cost accounting.

## Reconsider investigrams after context corrections

Added: 2026-09-25
Origin: module investigation planning discussion of citation exposure
Area: investigation revision and qualification

Consider an explicit reconsider operation for accounts marked as needing
reconsideration after cited context changes. Module investigation records
conservative citation indexes and discloses direct and transitive warnings, but
provides no clearing operation. Evaluate the need using correction frequency,
citation breadth, and the practical burden of uncleared warnings.

A reassessment could retain a new account or record that the earlier account remains
unchanged against specified updated context. Preserve the original investigram and
record the reassessment basis. Define how clearing a cause affects downstream
warnings without erasing independent causes or implying downstream reassessment.
Track no-change outcomes as a possible sign of overly broad citation exposure,
not proof that the original citations were irrelevant. Investigator-reported
relevance may eventually refine selection while the full history of context
supplied to the investigator remains available as provenance.
