/** Transitional import for existing assessment scripts. Execution is exclusively
 * owned by the application engine and the shared CLI adapter. Live scripts move
 * to their appropriate entry points in M3 of application-interface-boundary. */
export { openCliSession as openSession, AnalysisFailure, SessionInvalidated } from './interfaces/cli/application.js';
export type { ViewRequest, ExecutionOptions } from './interfaces/cli/application.js';
