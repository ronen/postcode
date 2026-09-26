# Reference lifetime disclosure

Status: accepted
Decided: 2026-09-26
Arising from: [Module investigation](../plans/module-investigation.md)
Scope: presentation of references whose validity ends before follow-up use

## Context

PostCode presents references to subjects within transient sessions. A reference
can connect items within output even when the session ends with the operation
producing that output. Such references can also suggest a route to further
inspection that is no longer available.

## Decision

When presenting references that will expire before they can be used as subjects
of a subsequent request, make that limitation clear in the surrounding
presentation. This applies to references generally, including entities and
investigrams. A shared notice can cover the affected references.

## Rationale

Disclosure preserves references' usefulness for connecting items within the
output without implying later resolvability.

## Alternatives considered

Suppressing references would lose those connections. Caveating every reference
in an active session would add noise where follow-up remains available.

## Consequences and follow-up

Conformance of views from earlier slices has not been assessed. That assessment
and any needed presentation changes are recorded as backlog work. The potential
impact is misleading navigation guidance; this disclosure rule does not change
reference binding or program-claim semantics. Assessment can therefore follow
separately from the module investigation slice.

## Governing impact

The accompanying [architectural constraints](../architectural-constraints.md)
add the disclosure rule under session references. Existing reference-binding and
session-lifetime decisions remain in force.
