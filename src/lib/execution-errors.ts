/** Shared operational failures; compiler and transport modules do not own these types. */
export class AnalysisFailure extends Error {}
export class SessionInvalidated extends Error {
  constructor() { super('Session invalidated: relevant inputs changed or could not be verified. Restart to continue.'); }
}
export class CommandInterrupted extends Error {
  constructor() { super('Command interrupted; session ended.'); }
}
export class SessionBusy extends Error {
  constructor() { super('Concurrent session command'); }
}
export class SessionClosed extends Error {
  constructor() { super('Session is closed'); }
}
export class CleanupIncomplete extends Error {
  constructor(readonly resource: string) { super(`Cleanup incomplete: exit unconfirmed for ${resource}. Ownership and exit monitoring remain active.`); }
}
export class GitFailure extends Error {
  constructor(readonly operation: string, readonly code: string | number | null) { super(`${operation}: ${code ?? 'failed'}`); }
}
export function errorCode(error: unknown): string | null {
  return error instanceof Error && 'code' in error && typeof error.code === 'string' ? error.code : null;
}
export function operationalIO(error: unknown): error is Error {
  return ['EACCES', 'EPERM', 'ENOENT', 'ENOTDIR', 'ELOOP', 'EIO', 'EMFILE', 'ENFILE'].includes(errorCode(error) ?? '');
}

/** Failures observed separately from a terminal request's established outcome. */
export interface ShutdownFailure {
  readonly phase: 'resource-cleanup' | 'participant-cleanup' | 'attempt-report' | 'work-report';
  readonly cause: unknown;
}
export class SessionShutdownError extends AggregateError {
  constructor(readonly failures: readonly ShutdownFailure[]) {
    super(failures.map(failure => failure.cause), 'Session shutdown encountered cleanup or report-delivery failures.');
  }
}
/** Internal propagation preserves the primary terminal cause and every finalizer failure. */
export class TerminalFinalizationError extends SessionShutdownError {
  constructor(readonly terminal: unknown, failures: readonly ShutdownFailure[]) { super(failures); }
}
