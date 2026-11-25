/** Internal in-process application boundary. Open one configured project, call
 * execute({kind:'lens', lens:'modules', designation:{kind:'configured-project'}}),
 * follow precise subject IDs, and retrieve an answer with {kind:'present', target}.
 * Always await close() separately. Calls serialize by refusal (SessionBusy), never
 * queue; interruption is terminal. Synchronous compiler work in the calling thread
 * cannot be preempted there. Content can contain source support: it is not a human
 * output format or an authorized external evidence export.
 * Account/configuration, observation delivery and feedback are independent
 * companion entries in accounts.ts, observations.ts and feedback.ts; none
 * requires opening a project or constructing a CLI host.
 *
 * @example
 * const opened = await openApplication({ configPath }, { onWork: recordWork });
 * if (opened.status === 'opened') {
 *   const session = opened.session;
 *   try {
 *     const result = await session.execute({ kind: 'lens', lens: 'modules',
 *       designation: { kind: 'configured-project' } }, { requestId: 'inventory' });
 *     if (result.kind === 'answer') {
 *       const exact = await session.execute({ kind: 'present', target: result.answer.id });
 *       consume(exact); // Plain qualified content; no rendering or source export implied.
 *     }
 *   } finally { await session.close(); }
 * }
 *
 * Opening can return project-open-failed or throw a lifecycle/cleanup failure.
 * execute returns answer, resolution or usage; resolution is qualified refusal,
 * not an empty answer. Typed lifecycle errors remain distinct from result data.
 * Invalid requestId correlation rejects with InvalidRequestId before work begins;
 * its captured input/problems preserve safe values or explicit omission reasons.
 * onWork and investigator onProgress/onReport callbacks receive owned cloneable
 * reports. interrupt(), lifetime-signal abort and active close() terminate the Session.
 * The request retains its first established terminal outcome and final accounting;
 * interrupt()/close() separately expose the same shutdown assessment. Observe these
 * promises for owned cleanup and terminal-report failures (SessionShutdownError).
 * Signal-only failures remain available to later close(), without an unhandled
 * internal rejection. usage() and work() remain available after shutdown.
 * Injected runGit retains caller subprocess ownership. No overall shutdown deadline
 * or hard interruption of synchronous compiler work/callbacks is promised. */
export { openApplication } from './session.js';
export type { ApplicationSession, ApplicationResult, AnswerDelivery, ResolutionDelivery, UsageDelivery,
  SelectedAnswer, ApplicationContext, ApplicationDependencies, ExecutionContext, OpenApplicationResult, Capability, ProjectOptions } from './contracts.js';
export type { ApplicationRequest, SemanticRequest, InformationRequirements, ConsumptionChoice, InputProblem } from './requests.js';
export { InvalidRequestId } from './requests.js';
export type { QualifiedContent } from './content.js';
export type { ApplicationCatalog } from './catalog.js';
export type { PresentationDeclaration, ConsumptionDecision, OptionEligibility } from './consumption.js';
export type { SubjectDesignation, LensDefinition, ResultContract, ParameterValue } from './lenses.js';
export type { WorkReport, WorkProgress } from '../work-attribution.js';
export type { AttemptReport } from '../investigation/contracts.js';
export type { DialogAgent as InvestigatorAgent } from '../contributions/dialog.js';
export type { ExactSubject } from '../contributions/subjects.js';
export { AnalysisFailure, SessionInvalidated, SessionClosed, SessionBusy, CommandInterrupted, CleanupIncomplete, SessionShutdownError } from '../execution-errors.js';
export { guardPublication } from './publication.js';
export type { PublicationOutcome } from './publication.js';

export type { ShutdownFailure } from '../execution-errors.js';
