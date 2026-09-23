# Transient session shell — planning package

Status: in preparation

This package is provisional and non-governing. It does not authorize implementation
or open a task record. Canonical documents and historical records are unchanged.

Read in order:

1. [Plan](plans/transient-session-shell.md): motivation, representative journey,
   acceptance, scope, proposed command lifecycle, and open decisions.
2. [Proposed decision](decisions/transient-analysis-sessions.md): session model,
   accumulating results, reference binding, input stability, observations, and
   scoped supersession map.
3. Complete proposed document revisions:
   [core concepts](docs/core-concepts.md),
   [architectural constraints](docs/architectural-constraints.md), and
   [implementation conventions](docs/implementation-conventions.md).

The additional constraints revision is necessary because the current binding
identity rules explicitly require analysis snapshots and cross-invocation
deterministic identity. Replacing only terminology and conventions would leave
the proposal inconsistent.

Open review items are selector-mode syntax and precedence, command interruption
and exit behavior, and experimental schema transitions. Public stdin/file batch
support is deferred. Persistent sessions and summary interpretation remain separate
slices.

On human-directed promotion, rebase links for canonical destinations, add reciprocal
supersession metadata and index entries, and promote governing changes with their
accepted decision. Do not rewrite concluded task/review/validation evidence or
historical plan narratives. The conventions revision describes proposed future
practice and should be adopted alongside the corresponding implementation.
