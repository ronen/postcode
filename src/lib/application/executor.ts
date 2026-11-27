import { invalidParameters, invalidDesignation } from './requests.js';
import { mechanicalImplementation } from '../mechanical-implementations.js';
import { evaluateModules } from '../evaluation.js';
import type { ModuleAnalysis } from '../evaluation.js';
import { evaluateOrganization } from '../organization/evaluate.js';
import { resolveSubjects, resolutionExplanation } from '../subject-resolution.js';
import type { SubjectResolution } from '../subject-resolution.js';
import { resolveContributionInspection, selectContributionInspection } from '../contributions/inspection.js';
import { contributionReference } from '../contributions/subjects.js';
import { nativeEntity } from '../contributions/native.js';
import type { ExactSubject } from '../contributions/subjects.js';
import type { InvestigationUsageReport } from '../investigation/reporting.js';
import type { ProgramRecordStore, RecordId, SessionId } from '../records.js';
import type { RequestWork } from '../work-attribution.js';
import { methods } from '../identity.js';
import { materializationLimitations } from './content.js';
import type { QualifiedContent } from './content.js';
import { consumptionPlan, freshFacts, retainedFacts, settleConsumption, standardRequirements, supportedRequirements, suppliedRequirements, unsupportedOptions } from './consumption.js';
import type { ConsumptionDecision, PresentationDeclaration } from './consumption.js';
import { resolveRetainedTarget, supportingWork } from './retained.js';
import type { ApplicationContext, PreparedResult, AnswerDelivery } from './contracts.js';
import type { CapturedApplicationCatalog } from './catalog.js';
import type { ResolutionInformation } from './reports.js';
import { resolveContributionAnswer, selectContributionAnswer } from '../contributions/answers.js';
import type { contributionEvaluation, ContributionEvaluated } from '../contributions/evaluation.js';
import { UnknownReference } from '../contributions/model.js';
import type { InvocationRequest, SubjectRef } from '../contributions/model.js';
import { entityModule, moduleEntity, sessionLedger } from '../contributions/modules.js';
import { resultContract } from '../contributions/operations.js';
import type { ContributionOperation } from '../contributions/operations.js';

export function requestExecutor(store: ProgramRecordStore, analysis: ModuleAnalysis, session: SessionId,
  usage: () => InvestigationUsageReport, catalog: CapturedApplicationCatalog,
  contributions?: ReturnType<typeof contributionEvaluation>) {
  return async (context: ApplicationContext, work: RequestWork): Promise<PreparedResult> => {
    const request = context.request;
    const lookupWork = work.scope('Establish qualified populations to resolve the requested subject.', null, 'resolution-prerequisite');
    const answerWork = work.scope('Materialize requirements and declared expansions for the requested answer.');
    const refusal = (resolution: ResolutionInformation): PreparedResult => ({ kind: 'resolution', context, usage: usage(), resolution });
    const basic = (reason: ResolutionInformation['reason'], explanation: string, criteria: readonly string[] = []): PreparedResult => refusal({ reason, explanation, candidates: [], criteria,
      qualifications: [], prerequisites: [], retainedAnswers: [] });
    const failPresentation = (explanation: string, resolution?: SubjectResolution, retained: readonly RecordId[] = [], content?: QualifiedContent): PreparedResult => refusal({
      reason: 'presentation-unavailable', explanation, candidates: resolution?.candidates ?? [],
      criteria: [...(resolution?.criteria ?? []), 'Compatible qualified result contract and explicit Presentation choices'],
      qualifications: [...new Set([...(resolution?.qualifications ?? []), ...(content ? materializationLimitations(content) : [])])],
      prerequisites: resolution?.prerequisites ?? [], support: resolution?.support ?? [],
      retainedAnswers: retained.map(id => ({ id })),
    });
    const delivery = (content: QualifiedContent, base: QualifiedContent, decision: ConsumptionDecision | null,
      title: string, selectionMode: 'fresh' | 'retained', resolution?: SubjectResolution,
      reporting: AnswerDelivery['reporting'] = null, failed = false): PreparedResult => {
      const sessionContext = store.get(session);
      if (sessionContext.kind !== 'session') throw new Error('Expected Session');
      const repository = sessionContext.repository ? store.get(sessionContext.repository) : null;
      const mechanical = base.contract !== 'contribution' && base.contract !== 'contribution-inspection' && content !== base ? base : null;
      return { kind: 'answer', context, usage: usage(), answer: { id: content.value.projection.id, content, mechanical },
        title, selectionMode, consumption: decision, reporting, failed,
        ...(resolution ? { resolution } : {}),
        repositoryRoot: repository?.kind === 'repository-evidence' && repository.capture.status === 'available' ? repository.capture.evidence.root : null,
        methods: base.contract === 'contribution' ? [...sessionContext.methods, methods.contributions, methods.contributionStatus, methods.contributionProjection] : sessionContext.methods };
    };
    if (request.kind === 'rejected') return refusal({ reason: 'invalid-request', explanation: 'The supplied request input could not be accepted.',
      candidates: [], criteria: ['Registered Lens or report', 'Serializable request data', 'Supported designation and reference choices'],
      qualifications: request.problems.map(problem => `${problem.field}: ${problem.reason} ${problem.representation === 'preserved'
        ? 'The supplied value is preserved as rejected input.' : problem.representation === 'absent' ? 'No value was supplied.' : `Representation limit: ${problem.omittedField ?? problem.field} is omitted from the report.`}`),
      representationLimits: request.problems.filter(problem => problem.representation === 'omitted').map(problem => `Representation limit: ${problem.omittedField ?? problem.field} is omitted from the report.`),
      prerequisites: [], retainedAnswers: [] });
    const parameterError = invalidParameters(request, catalog.lenses);
    const designationError = invalidDesignation(request, catalog.lenses);
    const invalid = parameterError ?? designationError;
    if (invalid) return basic(parameterError ? 'invalid-parameters' : 'invalid-designation', invalid,
      [parameterError ? 'Declared Lens parameters' : 'Declared Lens subjects and cardinality']);
    if (request.kind === 'report') return { kind: 'usage', context, usage: usage() };
    if (request.kind === 'present') {
      const exact = resolveRetainedTarget(store, session, request.target);
      const exactRefusal = (reason: ResolutionInformation['reason'], explanation: string, retained: readonly RecordId[] = [], qualifications: readonly string[] = []) => refusal({ reason, explanation,
        candidates: [], criteria: ['Exact retained target in the active Session', 'Compatible Presentation over fixed support'], qualifications, prerequisites: [],
        retainedAnswers: retained.map(id => ({ id })) });
      if (exact.kind === 'refusal') return exactRefusal(exact.reason, exact.explanation);
      const { content, base, associated } = exact;
      const id = content.value.projection.id;
      let decision: ConsumptionDecision | null = null;
      if (request.consumption) {
        if (base.contract === 'organization' && !base.value.projection.expansions.requested.includes('group-details')) return exactRefusal('presentation-unavailable', 'This Presentation needs group details not selected by the retained answer. Issue a new information request.', [id]);
        const first = catalog.presentations.find(item => request.consumption!.presentations.includes(item.id) && item.default && item.contract === base.contract);
        if (!first) return exactRefusal('presentation-unavailable', 'No default Presentation is registered for this retained answer’s content contract.', [id], materializationLimitations(base));
        const facts = [...new Set([...retainedFacts(base, associated), ...(content.contract === 'contribution-inspection' ? ['revision' as const] : [])])];
        const unsupported = unsupportedOptions(first, request.consumption, facts);
        if (unsupported.length) return exactRefusal('presentation-unavailable', `Unsupported presentation choices for this retained answer: ${unsupported.join(', ')}. Remove these choices to present the answer.`, [id], materializationLimitations(base));
        const plan = consumptionPlan(catalog.presentations, base.contract, request.consumption, facts).filter(item => suppliedRequirements(base, item.requirements));
        decision = settleConsumption(plan, base);
        if (!decision) return exactRefusal('presentation-unavailable', plan.length
          ? 'The retained answer does not meet the Presentation’s materialization precondition, and no compatible declared fallback can present it.'
          : 'The Presentation requires support not selected by this retained answer, and no compatible declared fallback can use its retained support. Issue a new information request for the additional information.', [id], materializationLimitations(base));
        if (decision.initial !== first.id) decision = { ...decision, initial: first.id, changes: [{ from: first.id, to: decision.selected.id,
          reason: 'The preferred Presentation requires support absent from this answer; the declared fallback uses only retained support.' }] };
      } else if (request.requirements && (!supportedRequirements(base.contract, request.requirements) || !suppliedRequirements(base, request.requirements))) {
        return exactRefusal('presentation-unavailable', 'The requested content requirements are not selected by this retained answer.', [id], materializationLimitations(base));
      }
      const title = catalog.lenses[content.value.projection.lens]?.title;
      if (!title) throw new Error('Retained answer has no meaning in the fixed Session catalog');
      work.scope('Present the exact retained answer and fixed supporting content.').record('content', 'consumed', {
        records: [...new Set([id, ...(associated ? [base.value.projection.id, ...supportingWork(base)] : []), ...supportingWork(content)])],
        limitations: ['Exact retained answer and its fixed support; no selection, Evaluation or new evidence acquisition.'] });
      return delivery(content, base, decision, title, 'retained');
    }
    const definition = catalog.lenses[request.lens]!;
    const designation = request.designation;
    const plans = new Map(definition.results.map(contract => [contract, request.consumption
      ? consumptionPlan(catalog.presentations, contract, request.consumption, freshFacts(definition)) : []]));
    if (request.consumption && ![...plans.values()].some(plan => plan.length)) return failPresentation('No Presentation accepts the prospective answer contract with the supplied format, source and paging choices.');
    /** Obtain or reuse the investigation, then select the current designated answer of its question into a retained answer. */
    const contribution = async (operation: ContributionOperation, invocation: InvocationRequest, subject: RecordId, parameters: Readonly<Record<string, string>>,
      resolution: SubjectResolution | undefined): Promise<PreparedResult> => {
      if (!contributions) throw new Error('Contribution investigations are not available in this Session');
      if (!request.consumption && !supportedRequirements('contribution', request.requirements ?? standardRequirements.contribution)) {
        return failPresentation('The requested expansions are not supported by this answer content contract.', resolution);
      }
      const ledger = sessionLedger(store, session), contract = resultContract(invocation.resultContract);
      if (contract === undefined) return basic('invalid-parameters', `The requested result contract ${invocation.resultContract} is not supported.`, ['Supported result contract']);
      const evaluated: ContributionEvaluated = await contributions.evaluate(invocation, operation, contract, { ...(request.fresh ? { fresh: true } : {}), subject, work });
      answerWork.check();
      const content: QualifiedContent = { contract: 'contribution', value: resolveContributionAnswer(store, selectContributionAnswer(store, ledger,
        { lens: request.lens, subject, parameters, result: evaluated.result, contract })) };
      const outcome = evaluated.execution?.outcome ?? null;
      answerWork.record('interpretation', evaluated.reused ? 'reused' : outcome?.kind === 'accepted' ? 'established' : 'unavailable', { records: [content.value.projection.id],
        limitations: [evaluated.reused ? 'A retained outcome for this question was reused; no dialog ran.' : outcome?.kind ?? evaluated.unavailable?.kind ?? 'unavailable'] });
      const plan = plans.get('contribution') ?? [];
      const decision = request.consumption ? settleConsumption(plan, content) : null;
      if (request.consumption && !decision) return failPresentation('No compatible Presentation accepts this contribution answer and the supplied choices.', resolution, [content.value.projection.id], content);
      // The attempt failed when a dialog ran, or could not run, without an accepted contribution. Reuse reports the retained outcome as it is.
      const failed = evaluated.reused ? evaluated.attempt!.outcome.kind !== 'accepted' : outcome?.kind !== 'accepted';
      return delivery(content, content, decision, definition.title, 'fresh', resolution,
        { contribution: evaluated.attemptResult, unavailable: evaluated.unavailable, reused: evaluated.reused, attempt: evaluated.execution?.attempt ?? evaluated.attempt?.id ?? null, ...(evaluated.unavailable?.provider ? { provider: evaluated.unavailable.provider } : {}) }, failed);
    };
    if (definition.requirements.kind === 'follow-up') {
      // The option supplies the delegated question. It must name a supported operation and satisfy that operation's subject signature.
      const ledger = sessionLedger(store, session), key = request.parameters.option as string;
      const criteria = ['Exact contribution retained in this Session', 'A follow-up option of that contribution', 'A supported operation whose subject signature the option satisfies'];
      if (designation.kind !== 'reference') return basic('invalid-designation', 'A follow-up option is designated by the exact identity of the contribution that offers it.', criteria);
      const owner = contributionReference(ledger, designation.value);
      if (!owner) return basic('unknown-reference', 'This contribution is not retained in this Session.', criteria);
      let option;
      try { option = ledger.investigram(owner).options.find(item => item.key === key); } catch (error) {
        if (!(error instanceof UnknownReference)) throw error;
        return basic('unknown-reference', 'This contribution is not retained in this Session.', criteria);
      }
      if (!option) return basic('invalid-parameters', `The designated contribution offers no follow-up option with key ${JSON.stringify(key)}.`, criteria);
      const operation = Object.hasOwn(catalog.operations, option.request.operation) ? catalog.operations[option.request.operation] : undefined;
      const subjects = option.request.subjects.map(item => item.subject);
      const moduleSubject = (item: SubjectRef | undefined) => item?.kind === 'entity' ? entityModule(store, session, item.entity) : undefined;
      const satisfied = operation && subjects.length === 1 && (operation.subject === 'module' ? moduleSubject(subjects[0]) !== undefined
        : ['content', 'designation', 'investigram'].includes(subjects[0]!.kind));
      // Naming an unsupported operation, or a subject it does not accept, does not make an option executable.
      if (!operation || !satisfied) return basic('unsupported-subject', `This follow-up option requests ${JSON.stringify(option.request.operation)} on a subject no supported operation accepts, so it cannot be invoked.`, criteria);
      return contribution(operation, { ...option.request, option: { investigram: owner, key } }, owner, { option: key }, undefined);
    }
    const mechanical = mechanicalImplementation(definition);

    const lookupModules = designation.kind === 'name' && definition.subjects.includes('module') ? evaluateModules(store, analysis, mechanical?.lookup.modules ?? [], lookupWork) : undefined;
    const lookupOrganization = lookupModules && definition.subjects.includes('group') ? evaluateOrganization(store, lookupModules, mechanical?.lookup.groups ?? [], lookupWork) : undefined;
    const resolution = resolveSubjects(store, session, definition, designation, { ...(lookupModules ? { modules: lookupModules } : {}), ...(lookupOrganization ? { organization: lookupOrganization } : {}) });
    if (resolution.status !== 'resolved') return refusal({ ...resolution, reason: resolution.status, explanation: resolutionExplanation(resolution), retainedAnswers: [] });
    const selected = resolution.candidates.map(candidate => candidate.id);
    const contributionInspection = definition.requirements.kind === 'inspection' && resolution.candidates.every(candidate => !['module', 'group'].includes(candidate.kind));
    const contract = definition.requirements.kind === 'contribution' ? 'contribution' : mechanical!.contract(resolution);
    const plan: readonly PresentationDeclaration[] = plans.get(contract) ?? [];
    if (request.consumption && !plan.length) return failPresentation('No compatible Presentation accepts the resolved subject’s answer contract and supplied choices.', resolution);
    const requirements = request.requirements ?? standardRequirements[contract];
    if (!request.consumption && !supportedRequirements(contract, requirements)) return failPresentation('The requested expansions are not supported by this answer content contract.', resolution);
    const modules = [...new Set([...(mechanical?.required.modules ?? []), ...(request.consumption ? plan.flatMap(item => item.requirements.modules) : requirements.modules)])];
    const groups = [...new Set([...(request.consumption ? plan.flatMap(item => item.requirements.groups) : requirements.groups), ...(mechanical?.required.groups ?? [])])];
    if (definition.requirements.kind === 'contribution') {
      const operation = catalog.operations[definition.requirements.operation]!;
      let subject: ExactSubject;
      if (operation.subject === 'module') {
        evaluateModules(store, analysis, [], answerWork); answerWork.check();
        const entity = moduleEntity(store, selected[0]!);
        if (!entity) throw new Error('Expected a contributed module identification');
        subject = { kind: 'entity', entity };
      } else {
        const exact = resolution.candidates[0]?.selected;
        if (!exact || exact.kind === 'entity') throw new Error('Expected an exact selected-content subject');
        subject = exact;
      }
      return contribution(operation, { operation: operation.id, subjects: [{ role: null, subject }], parameters: {}, context: [],
        resultContract: definition.requirements.resultContract }, selected[0]!, {}, resolution);
    }
    if (contributionInspection) {
      const ledger = sessionLedger(store, session);
      const subjects = resolution.candidates.map(candidate => {
        if (!candidate.selected) throw new Error(`Missing exact inspection subject for ${candidate.kind}: ${candidate.id}`);
        return candidate.selected;
      });
      const content: QualifiedContent = { contract: 'contribution-inspection', value: resolveContributionInspection(store, selectContributionInspection(store, ledger, subjects)) };
      answerWork.record('interpretation', 'consumed', { records: supportingWork(content),
        limitations: ['Exact retained content and independently captured current standing; no dialog ran.'] });
      const decision = request.consumption ? settleConsumption(plan, content) : null;
      if (request.consumption && !decision) return failPresentation('No compatible Presentation accepts this exact inspection.', resolution, [content.value.projection.id], content);
      return delivery(content, content, decision, definition.title, 'fresh', resolution);
    }
    if (!mechanical) throw new Error('Missing mechanical implementation');
    const nativeSubjects = definition.requirements.kind === 'inspection' ? resolution.candidates.filter(candidate => ['module', 'group'].includes(candidate.kind)).map(candidate => candidate.id) : selected;
    const constructed = mechanical.construct({ store, analysis, subjects: nativeSubjects, request, expansions: { modules, groups }, work: answerWork });
    const base = constructed.content;
    const decision = request.consumption ? settleConsumption(plan, base) : null;
    if (request.consumption && !decision) return failPresentation('The retained answer does not meet the Presentation materialization precondition; no compatible declared fallback applies.', resolution, constructed.retainedAnswers, base);
    const subjects = constructed.associatedSubjects?.map(id => {
      const entity = nativeEntity(store, id);
      if (!entity) throw new Error('Expected a contributed inspection Entity');
      return { kind: 'entity' as const, entity };
    });
    if (subjects) for (const candidate of resolution.candidates) {
      const exact = candidate.selected;
      if (exact?.kind === 'entity' && !subjects.some(subject => subject.entity === exact.entity)) subjects.push(exact);
    }
    const content: QualifiedContent = subjects ? { contract: 'contribution-inspection', value: resolveContributionInspection(store,
      selectContributionInspection(store, sessionLedger(store, session), subjects, base.value.projection.id)) } : base;
    return delivery(content, base, decision, definition.title, 'fresh', resolution);
  };
}
