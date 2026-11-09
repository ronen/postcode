/** Trusted host composition only; intentionally absent from the application entry point. */
import type { ApplicationSession, ApplicationResult, CapturedInvocation } from './contracts.js';
import type { SemanticRequest, InputConstraints } from './requests.js';
import type { ReferenceBinding } from '../reference-binding.js';
import type { InvestigationRequest } from '../investigation/contracts.js';
import type { InvestigationSelection } from '../investigation/evaluation.js';
import type { InitiationContext, WorkReport } from '../work-attribution.js';
export interface ClientOperation {
  execute(request: SemanticRequest, context?: { readonly requestId?: string; readonly invocation?: CapturedInvocation; readonly referenceLifetime?: 'session' | 'command'; readonly constraints?: InputConstraints }): Promise<ApplicationResult>;
  /** Validity transport while this scope already owns the operation guard. */
  check(): Promise<void>;
  readonly bindings: ReferenceBinding;
}
export interface OperationHost {
  run<T>(client: (operation: ClientOperation) => Promise<T>): Promise<T>;
  evaluate(request: InvestigationRequest): Promise<InvestigationSelection & { context: InitiationContext; attribution: WorkReport }>;
}
const hosts = new WeakMap<ApplicationSession, OperationHost>();
export function registerOperationHost(session: ApplicationSession, host: OperationHost): void { hosts.set(session, host); }
export function withCliOperation<T>(session: ApplicationSession, client: (operation: ClientOperation) => Promise<T>): Promise<T> {
  const host = hosts.get(session);
  if (!host) throw new Error('Unknown application Session');
  return host.run(client);
}
export function evaluateOperation(session: ApplicationSession, request: InvestigationRequest) {
  const host = hosts.get(session);
  if (!host) throw new Error('Unknown application Session');
  return host.evaluate(request);
}
