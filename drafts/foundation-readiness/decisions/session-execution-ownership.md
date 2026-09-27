# Execution ownership and cancellation semantics

Status: in review
Decided:
Arising from: [Foundation readiness](../plans/foundation-readiness.md)
Scope: ownership and cancellation contract for command opening, Git acquisition, validation and disposal

## Context

Synchronous Git calls can prevent the analysis worker from responding to cancellation. The archived timeout probe demonstrated a child continuing after a termination signal; terminating a worker also does not establish that its children have exited. Investigation needs an execution boundary whose resource ownership survives interruption of the computation.

## Decision

Use asynchronous Git execution and asynchronous opening/validation orchestration, retaining compiler work in the private analysis worker. The parent owns Git subprocesses and monitors their exit, including when the worker requests them. Direct session users use the same ownership model in their calling process. Terminating disposable computation must not discard responsibility for its resources. Observation delivery remains parent-owned.

Preserve one active operation and terminal interruption of the session. Interruption or disposal prevents further work and late publication; it does not transparently restart the worker or continue under discarded session state. Each pending operation settles once, independently of the time required to confirm resource cleanup.

Git operations have deadlines. Cancellation initiates termination, with escalation where supported. If cleanup cannot be confirmed within its reporting deadline, report incomplete cleanup separately from the command outcome and retain resource ownership and exit monitoring. Request cancellation, command settlement and actual child/worker exit are distinct events; none may be presented as proof of another. Numeric limits and platform-specific termination mechanics are implementation choices.

A deadline during opening is an expected operational opening failure. During input validation, inability to verify the retained basis invalidates the session rather than refreshing its evidence. Unexpected defects retain their distinct failure path. A cleanup problem must not conceal the triggering interruption or failure.

These guarantees do not establish a deadline for an entire analysis, universal prompt exit of native filesystem/compiler work, or termination of every descendant process. Report supported-platform limits explicitly.

## Rationale

An owner that survives disposable computation can complete or truthfully report its cleanup. Asynchrony makes Git waits interruptible; ownership and confirmed exit make that interruption dependable. Retaining the compiler worker preserves the existing isolation and active-work termination boundary.

## Alternatives considered

- Add only a synchronous Git timeout: does not provide responsive cancellation or prove child exit after a signal.
- Launch asynchronous Git inside the disposable worker: worker termination can discard the only owner of outstanding children.
- Move compiler work into the parent: loses the existing active-work interruption boundary.
- Replace the worker with a supervised process: introduces a larger execution-boundary change without a demonstrated need for it.

## Consequences

Opening and validation become asynchronous for current direct session users as well as CLI callers. Command completion and cleanup reporting must remain distinguishable at their interfaces. The [implementation plan](../plans/foundation-readiness.md#4-shared-acquisition-policy-and-dependable-execution-ownership) specifies protocol changes, failure mappings, limit selection and verification.

This decision preserves transient-session and input-stability semantics. Investigation builds on this ownership boundary and remains responsible for its evidence interface, dialogue, result acceptance and a non-disposable owner for incremental usage reporting.
