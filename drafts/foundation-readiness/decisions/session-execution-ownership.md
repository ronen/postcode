# Session execution and subprocess ownership

Status: in review
Decided:
Arising from: [Foundation readiness](../plans/foundation-readiness.md)
Scope: current command opening, Git acquisition, validation, interruption and disposal

## Context

Synchronous Git calls can prevent the worker from responding to cancellation. A timeout that sends SIGTERM alone does not establish a deadline: the archived probe demonstrated a child continuing after that signal. Terminating a worker also does not by itself prove that children it launched have exited. Upcoming investigation needs a coherent execution boundary, but this programme must solve the concrete current ownership problem first.

## Decision

Use owned asynchronous Git execution and asynchronous opening/validation orchestration while retaining compiler work in the private analysis worker. Preserve one active operation, terminal interruption and parent-owned observation delivery. The process owning Git handles must remain alive through worker termination and retain responsibility for signalling and observing child exit; use parent-owned execution or a narrowly scoped supervisor. Do not rely on cleanup callbacks inside a terminated worker.

Give asynchronous operations identities sufficient to reject stale replies and prevent late publication. Synchronous message-send failure, close while pending, unexpected worker exit and cancellation must each settle the pending operation once and release its resources. Share execution contracts and interruption errors through a neutral boundary. If graceful close is required, make it a real invoked and tested protocol; otherwise remove the unused close-message branch.

Preserve Git environment sanitation, bounded output, decoding checks, expected operational-error classification and input invalidation. Async propagation covers current direct session users and CLI publishers, not only a wrapper around the shell. No transparent restart, worker pool or general scheduler is introduced.

[Needs review] Before promotion, select numeric limits and escalation policy separately for Git operation duration, initial termination grace, force-termination handling, and owner shutdown. Specify whether each limit bounds caller settlement, child exit, worker exit, or the whole operation. The default direction is prompt cancellation followed by a bounded graceful period and forced termination where supported, with explicit reporting when cleanup cannot be confirmed. Set values using controlled readiness/termination probes and representative opening/validation measurements; do not claim an arbitrary timeout is established by the existing audits.

Do not promise a universal wall-clock bound for native filesystem/compiler work or an OS process in uninterruptible state. Distinguish supported-platform behavior and observed cleanup from request rejection. Preserve current publication-check phases and coverage; these are not removed to make cancellation or performance tests pass.

## Rationale

An owner that survives the disposable computation can finish cleanup. Asynchrony enables cancellation during Git waits but is insufficient without ownership, operation identity and explicit exit evidence. Compiler integration can remain direct and synchronous inside its existing isolation boundary.

## Alternatives considered

- Add only a `spawnSync` timeout: useful mitigation, insufficient lifetime guarantee.
- Use `spawn` inside a worker and immediately terminate the worker: can discard the only owner of outstanding children.
- Move all compiler work into the parent: loses the existing active-work interruption fallback.
- Replace the worker with a supervised process: retain as a concrete fallback if parent/supervisor ownership cannot meet the chosen limits coherently; reconsider the decision with evidence before making that larger change.

## Consequences and verification

Use controlled readiness markers and watchdogs to test cancellation during opening and validation, a child ignoring graceful termination, worker failure with an outstanding child, close while pending, send failure, and late replies. Assert command settlement and actual process/worker exit separately. The one-shot native compiler interruption probe must retain its first phase marker and interrupt once; its control case must still pass.

An intermediate review must assess the actual ownership implementation and platform limits. This decision extends current execution mechanics without superseding transient-session semantics. Investigation remains responsible for its subject-based evidence interface, dialogue, acceptance, and a non-disposable owner for usage reporting.
