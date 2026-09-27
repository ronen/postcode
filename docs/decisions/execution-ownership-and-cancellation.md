# Execution ownership and cancellation semantics

Status: accepted
Decided: 2026-09-27
Arising from: [Foundation readiness](../plans/foundation-readiness.md)
Scope: ownership and cancellation contract for command opening, Git acquisition, validation and disposal

## Context

Synchronous Git calls can prevent the analysis worker from responding to cancellation. The archived timeout probe demonstrated a child continuing after a termination signal; terminating a worker also does not establish that its children have exited. Investigation needs an execution boundary whose resource ownership survives interruption of the computation.

## Decision

Use asynchronous Git execution and asynchronous opening/validation orchestration, retaining compiler work in the private analysis worker. The parent owns Git subprocesses and monitors their exit, including when the worker requests them. Direct session users use the same ownership model in their calling process. Terminating disposable computation must not discard responsibility for its resources. Observation delivery remains parent-owned.

Preserve one active operation and terminal interruption of the session. Interruption or disposal prevents further work and late publication; it does not transparently restart the worker or continue under discarded session state. Each pending operation settles once, independently of the time required to confirm resource cleanup.

Git operations have deadlines. Cancellation initiates termination, with escalation where supported. If cleanup cannot be confirmed within its reporting deadline, report incomplete cleanup separately from the command outcome and retain resource ownership and exit monitoring. Request cancellation, command settlement and actual child/worker exit are distinct events; none may be presented as proof of another. Numeric limits and platform-specific termination mechanics are implementation choices.

A Git acquisition deadline during opening produces qualified unavailable repository evidence, as other expected Git acquisition failures do, once child cleanup is confirmed. It does not by itself prevent opening a compiler-backed session. Unconfirmed cleanup remains a resource failure and must not be hidden by degrading repository evidence.

During validation, preserve the existing captured-basis comparison: loss or change of retained evidence invalidates the session rather than refreshing it. An initially unavailable repository capture may remain consistently unavailable without pretending that repository contents were verified; it must not become established empty evidence. Unexpected defects retain their distinct failure path, and cleanup problems remain separately visible.

These guarantees do not establish a deadline for an entire analysis, universal prompt exit of native filesystem/compiler work, or termination of every descendant process. Report supported-platform limits explicitly.

## Rationale

An owner that survives disposable computation can complete or truthfully report its cleanup. Asynchrony makes Git waits interruptible; ownership and confirmed exit make that interruption dependable. Retaining the compiler worker preserves the existing isolation and active-work termination boundary. Treating an initial timeout like another acquisition failure preserves the distinction between project opening and optional repository evidence; a latency threshold should not impose a stronger prerequisite than a missing Git executable. Validation is different when repository evidence was already retained: failure to re-establish that basis cannot silently weaken the earlier result.

## Alternatives considered

- Add only a synchronous Git timeout: does not provide responsive cancellation or prove child exit after a signal.
- Launch asynchronous Git inside the disposable worker: worker termination can discard the only owner of outstanding children.
- Move compiler work into the parent: loses the existing active-work interruption boundary.
- Replace the worker with a supervised process: introduces a larger execution-boundary change without a demonstrated need for it.
- Refuse opening on every Git timeout: makes slow optional evidence acquisition a stricter opening prerequisite than other Git failures. Use qualified unavailability after cleanup instead; preserve invalidation for a changed or unverifiable retained basis.

## Consequences

If Git times out during opening and later succeeds during validation, the capture changes from unavailable to available and the session invalidates. The user must restart; recovery does not silently add a new repository basis to the existing session. Intermittent latency can therefore cause repeated restarts. This is the conservative consequence of the unchanged-input contract, and limit selection must account for representative acquisition times.

Opening and validation become asynchronous for current direct session users as well as CLI callers. Command completion and cleanup reporting must remain distinguishable at their interfaces. The [implementation plan](../plans/foundation-readiness.md#4-shared-acquisition-policy-and-dependable-execution-ownership) specifies protocol changes, failure mappings, limit selection and verification.

This decision preserves [transient-session ownership](transient-analysis-sessions.md#retained-domain-and-storage-boundaries), [input stability](transient-analysis-sessions.md#stable-inputs-as-the-session-precondition), and the [distinction between project opening and analysis availability](repository-organization-decisions.md#keep-project-opening-distinct-from-later-analysis-availability). Investigation builds on this ownership boundary and remains responsible for its evidence interface, dialogue, result acceptance and a non-disposable owner for incremental usage reporting.
