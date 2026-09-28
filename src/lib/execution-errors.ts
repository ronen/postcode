/** Shared operational failures; compiler and transport modules do not own these types. */
export class AnalysisFailure extends Error {}
export class SessionInvalidated extends Error {
  constructor() { super('Session invalidated: relevant inputs changed or could not be verified. Restart to continue.'); }
}
export class CommandInterrupted extends Error {
  constructor() { super('Command interrupted; session ended.'); }
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
