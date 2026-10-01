import type { RecordId } from './records.js';
import type { AgentInput, AgentReply, AgentIdentity, InvestigationRequest, AttemptReport, ReportedUsage } from './investigation/contracts.js';
import type { openSession, ViewRequest, ExecutionOptions } from './session.js';
import type { GitRequest, GitResult } from './git-execution.js';
import { AnalysisFailure, SessionInvalidated, CleanupIncomplete, GitFailure } from './execution-errors.js';

type Opened = Extract<Awaited<ReturnType<typeof openSession>>, { status: 'opened' }>;
export type ExecutedView = Awaited<ReturnType<Opened['session']['execute']>>;
export type Opening = { status: 'opened'; id: string } | Exclude<Awaited<ReturnType<typeof openSession>>, Opened>;
export type WireError = { kind: 'invalidated' | 'unavailable' | 'cleanup' | 'git' | 'defect'; message: string; operation?: string; code?: string | number | null };
export function encodeError(error: unknown): WireError {
  if (error instanceof SessionInvalidated) return { kind: 'invalidated', message: error.message };
  if (error instanceof AnalysisFailure) return { kind: 'unavailable', message: error.message };
  if (error instanceof CleanupIncomplete) return { kind: 'cleanup', message: error.resource };
  if (error instanceof GitFailure) return { kind: 'git', message: error.message, operation: error.operation, code: error.code };
  return { kind: 'defect', message: error instanceof Error ? error.message : 'Unknown execution defect' };
}
export function decodeError(error: WireError): Error {
  switch (error.kind) {
    case 'invalidated': return new SessionInvalidated();
    case 'unavailable': return new AnalysisFailure(error.message);
    case 'cleanup': return new CleanupIncomplete(error.message);
    case 'git': return new GitFailure(error.operation!, error.code ?? null);
    case 'defect': return new Error(error.message);
  }
}
export type WorkerRequest = { type: 'execute'; operation: number; request: ViewRequest; execution: ExecutionOptions }
  | { type: 'check'; operation: number }
  | { type: 'agent-selected'; operation: number; id: number; identity?: AgentIdentity; error?: WireError }
  | { type: 'agent-result'; operation: number; id: number; reply?: AgentReply; error?: WireError }
  | { type: 'agent-usage'; operation: number; id: number; usage: ReportedUsage }
  | { type: 'git-result'; operation: number; id: number; result?: GitResult; error?: WireError };
export type WorkerReply = { type: 'reply'; operation: number; opening?: Opening; result?: ExecutedView; error?: WireError }
  | { type: 'agent-select'; operation: number; id: number; request: InvestigationRequest }
  | { type: 'agent-exchange'; operation: number; id: number; call: number; input: AgentInput }
  | { type: 'agent-close'; operation: number; attempt: RecordId }
  | { type: 'attempt-report'; operation: number; report: AttemptReport }
  | { type: 'git'; operation: number; id: number; request: GitRequest };
