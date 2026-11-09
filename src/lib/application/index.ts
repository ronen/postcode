/** Internal in-process application boundary. Open one configured project, call
 * execute({kind:'lens', lens:'modules', designation:{kind:'configured-project'}}),
 * follow precise subject IDs, and retrieve an answer with {kind:'present', target}.
 * Always await close() separately. Calls serialize by refusal (SessionBusy), never
 * queue; interruption is terminal. Synchronous compiler work in the calling thread
 * cannot be preempted there. Content can contain source support: it is not a human
 * output format or an authorized external evidence export.
 * Account/configuration, observation delivery and feedback are independent
 * companion entries in accounts.ts, observations.ts and feedback.ts; none
 * requires opening a project or constructing a CLI host. */
export { openApplication } from './session.js';
export type { ApplicationSession, ApplicationResult, AnswerDelivery, ResolutionDelivery, UsageDelivery,
  SelectedAnswer, ApplicationContext, ApplicationDependencies, ExecutionContext, OpenApplicationResult, Capability, ProjectOptions } from './contracts.js';
export type { ApplicationRequest, SemanticRequest, InformationRequirements, ConsumptionChoice, InputProblem } from './requests.js';
export type { QualifiedContent } from './content.js';
export type { ApplicationCatalog } from './catalog.js';
export type { PresentationDeclaration, ConsumptionDecision, OptionEligibility } from './consumption.js';
export type { SubjectDesignation, LensDefinition, ResultContract, ParameterValue } from './lenses.js';
export type { WorkReport, WorkProgress } from '../work-attribution.js';
export type { AttemptReport, InvestigatorAgent } from '../investigation/contracts.js';
export { AnalysisFailure, SessionInvalidated, SessionClosed, SessionBusy, CommandInterrupted, CleanupIncomplete } from '../execution-errors.js';
export { guardPublication } from './publication.js';
export type { PublicationOutcome } from './publication.js';
