# Investigation operations and lenses

Status: accepted
Decided: 2026-09-29
Arising from: [Module investigation](../plans/module-investigation.md), before implementation
Scope: reusable investigation operations, lens requirements, evaluation selection, and dialogue granularity

## Context

The [execution decision](investigator-execution-and-evidence-access.md#integrate-interpretation-with-evaluation-and-qualified-evidence-access)
already separates lens requirements, evaluation, domain interpretation, and
projection construction. Its operation vocabulary does not explicitly distinguish
a lens invocation from the investigation work supplying its information. This
distinction matters when several lenses can use the same interpretation or a
composite lens combines interpretation with other qualified information.

The [projection architecture decision](initial-projection-architecture-decisions.md#separate-lens-requirements-evaluation-and-projection-construction)
names the evaluation layer as the coordinator of declared requirements, analysis
providers, shared work, and qualified outcomes. Evaluation itself remains the
attempt to materialize requested information.

## Decision

An investigation operation describes reusable domain-level work that produces
qualified interpretation. Its request identifies the requested information,
subject, and relevant input parameters and context independently of the lens
that consumes its result. Operation names and request representations are
implementation choices.

Lenses declare information requirements referring to applicable investigation
operations. The evaluation layer selects compatible retained outcomes and identifies the
missing operations. Execution coordinates PostCode-side work and invokes the
domain interpretation boundary to obtain an evaluation outcome;
the evaluation layer and session handling apply retention and reuse policy. Lenses
construct projections from the materialized information. Evidence requests
within a dialogue remain adaptive and use the existing subject-based interface.

Operation outcomes are shareable when lens requirements request the same work
for compatible subjects, parameters, and input context. Reuse preserves the
original result and its generating provenance. A different consuming lens does
not by itself require another investigation, and newly accumulated evidence
does not by itself invalidate a reusable outcome. Existing outcome-retention,
qualification, correction, and session-validity rules continue to apply.

This separation extends the existing evaluation layer; the organization of
PostCode-side coordination around the domain interpretation boundary remains an
implementation choice.

The initial slice maps each of its four lenses to one core investigation
operation. Each missing operation executes in a fresh investigator dialogue,
with one terminal evaluation outcome and at most one accepted root investigram.
Selecting multiple operations and grouping their execution into one dialogue
are distinct concerns; multi-operation dialogues are deferred.

## Rationale

Defining investigation work independently of its consumer allows different
projections to reuse it and allows composite lenses to request several kinds of
information. The current functionality investigation supplies this slice's
summary content without defining the complete or permanent composition of a
summary projection.

## Alternatives considered

Identifying investigation work solely by the invoking lens would couple reuse
and execution to presentation questions. Letting each lens invoke the
investigator directly would bypass the existing evaluation and retention
boundaries. Grouping operations now would additionally require decisions about
submission, partial failure, execution limits, shared context, and usage
attribution that are unnecessary for the initial lens mappings.

## Consequences

Implement and verify operation selection, execution, and reuse separately from
projection construction. The slice retains its four public lenses and its
single-operation dialogue lifecycle. This decision clarifies the existing
execution separation without superseding its outcome or evidence contracts;
it adds a corresponding architectural constraint. Future dialogue grouping
requires an explicit design for the affected contracts.
