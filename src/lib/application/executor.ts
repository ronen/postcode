import { invalidParameters, invalidDesignation, invalidReportInputs } from './requests.js';
import type { InputConstraints } from './requests.js';
import { mechanicalImplementation } from '../mechanical-implementations.js';
import { evaluateModules } from '../evaluation.js';
import type { ModuleAnalysis } from '../evaluation.js';
import { evaluateOrganization } from '../organization/evaluate.js';
import { resolveSubjects, resolutionExplanation } from '../subject-resolution.js';
import type { SubjectResolution } from '../subject-resolution.js';
import { resolveInvestigationContent } from '../investigation/content.js';
import { selectInvestigation, selectAssociatedInspection } from '../investigation/selection.js';
import type { investigationEvaluation } from '../investigation/evaluation.js';
import type { InvestigationUsageReport } from '../investigation/reporting.js';
import type { ProgramRecordStore, RecordId, SessionId } from '../records.js';
import type { RequestWork } from '../work-attribution.js';
import { methods } from '../identity.js';
import { coordinateBindings } from './bindings.js';
import type { CoordinatedBindings } from './bindings.js';
import { materializationLimitations } from './content.js';
import type { QualifiedContent } from './content.js';
import { consumptionPlan, freshFacts, retainedFacts, settleConsumption, standardRequirements, supportedRequirements, suppliedRequirements, unsupportedOptions } from './consumption.js';
import type { ConsumptionDecision, PresentationDeclaration } from './consumption.js';
import { resolveRetainedTarget, supportingWork } from './retained.js';
import type { ApplicationContext, PreparedResult, AnswerDelivery } from './contracts.js';
import type { CapturedApplicationCatalog } from './catalog.js';
import type { ResolutionInformation } from './reports.js';

const noBindings: CoordinatedBindings = { modules: [], groups: [], detail: [], associations: [] };
export function requestExecutor(store: ProgramRecordStore, analysis: ModuleAnalysis, session: SessionId,
  integration: ReturnType<typeof investigationEvaluation>, usage: () => InvestigationUsageReport, catalog: CapturedApplicationCatalog) {
  return async (context: ApplicationContext, work: RequestWork, referenceLifetime: 'session' | 'command', constraints: InputConstraints = {}): Promise<PreparedResult> => {
    const request = context.request;
    const lookupWork = work.scope('Establish qualified populations to resolve the requested subject.', null, 'resolution-prerequisite');
    const answerWork = work.scope('Materialize requirements and declared expansions for the requested answer.');
    const refusal = (resolution: ResolutionInformation, referenceNotice = false): PreparedResult => ({ kind: 'resolution', context, usage: usage(), resolution, referenceLifetime, referenceNotice });
    const basic = (reason: ResolutionInformation['reason'], explanation: string, criteria: readonly string[] = []): PreparedResult => refusal({ reason, explanation, candidates: [], criteria,
      qualifications: [], prerequisites: [], retainedAnswers: [] });
    const failPresentation = (explanation: string, resolution?: SubjectResolution, retained: readonly RecordId[] = [], content?: QualifiedContent): PreparedResult => refusal({
      reason: 'presentation-unavailable', explanation, candidates: resolution?.candidates ?? [],
      criteria: [...(resolution?.criteria ?? []), 'Compatible qualified result contract and explicit Presentation choices'],
      qualifications: [...new Set([...(resolution?.qualifications ?? []), ...(content ? materializationLimitations(content) : [])])],
      prerequisites: resolution?.prerequisites ?? [], support: resolution?.support ?? [],
      retainedAnswers: [...store.answerIds(retained)].map(([id, reference]) => ({ id, reference })),
    }, retained.length > 0);
    const delivery = (content: QualifiedContent, base: QualifiedContent, decision: ConsumptionDecision | null,
      title: string, answerReference: string, selectionMode: 'fresh' | 'retained', resolution?: SubjectResolution,
      reporting: AnswerDelivery['reporting'] = null, failed = false): PreparedResult => {
      const sessionContext = store.get(session);
      if (sessionContext.kind !== 'session') throw new Error('Expected Session');
      const repository = sessionContext.repository ? store.get(sessionContext.repository) : null;
      const mechanical = base.contract !== 'investigation' && content !== base ? base : null;
      return { kind: 'answer', context, usage: usage(), answer: { id: content.value.projection.id, content, mechanical },
        title, selectionMode, referenceLifetime, answerReference, consumption: decision, reporting, failed,
        ...(resolution ? { resolution } : {}),
        bindings: base.contract === 'investigation' ? noBindings : coordinateBindings(store, base,
          content.contract === 'investigation' ? content.value.projection.associated : undefined),
        repositoryRoot: repository?.kind === 'repository-evidence' && repository.capture.status === 'available' ? repository.capture.evidence.root : null,
        methods: selectionMode === 'fresh' && base.contract === 'investigation' ? [...sessionContext.methods, methods.investigationEvaluation] : sessionContext.methods };
    };
    if (request.kind === 'rejected') return refusal({ reason: 'invalid-request', explanation: 'The supplied request input could not be accepted.',
      candidates: [], criteria: ['Registered Lens or report', 'Serializable request data', 'Supported designation and reference choices'],
      qualifications: request.problems.map(problem => `${problem.field}: ${problem.reason} ${problem.representation === 'preserved'
        ? 'The supplied value is preserved as rejected input.' : problem.representation === 'absent' ? 'No value was supplied.' : `Representation limit: ${problem.omittedField ?? problem.field} is omitted from the report.`}`),
      representationLimits: request.problems.filter(problem => problem.representation === 'omitted').map(problem => `Representation limit: ${problem.omittedField ?? problem.field} is omitted from the report.`),
      prerequisites: [], retainedAnswers: [] }, request.input.kind === 'present');
    const parameterError = invalidParameters(request, catalog.lenses);
    const reportError = invalidReportInputs(request, constraints.reportHasInputs ?? false);
    const designationError = invalidDesignation(request, catalog.lenses, constraints.conflictingDesignation);
    const invalid = parameterError ?? reportError ?? designationError;
    if (invalid) return basic(parameterError ? 'invalid-parameters' : reportError ? 'invalid-report-inputs' : 'invalid-designation', invalid,
      [parameterError ? 'Declared Lens parameters' : reportError ? 'Subjectless usage report' : 'Declared Lens subjects and cardinality']);
    if (request.kind === 'report') return { kind: 'usage', context, usage: usage() };
    if (request.kind === 'present') {
      const exact = resolveRetainedTarget(store, session, request.target);
      const exactRefusal = (reason: ResolutionInformation['reason'], explanation: string, retained: readonly RecordId[] = [], qualifications: readonly string[] = []) => refusal({ reason, explanation,
        candidates: [], criteria: ['Exact retained target in the active Session', 'Compatible Presentation over fixed support'], qualifications, prerequisites: [],
        retainedAnswers: [...store.answerIds(retained)].map(([id, reference]) => ({ id, reference })) }, true);
      if (exact.kind === 'refusal') return exactRefusal(exact.reason, exact.explanation);
      const { content, base, associated, answerReference } = exact;
      const id = content.value.projection.id;
      let decision: ConsumptionDecision | null = null;
      if (request.consumption) {
        if (base.contract === 'organization' && !base.value.projection.expansions.requested.includes('group-details')) return exactRefusal('presentation-unavailable', 'This Presentation needs group details not selected by the retained answer. Issue a new information request.', [id]);
        const first = catalog.presentations.find(item => request.consumption!.presentations.includes(item.id) && item.default && item.contract === base.contract);
        if (!first) return exactRefusal('presentation-unavailable', 'No default Presentation is registered for this retained answer’s content contract.', [id], materializationLimitations(base));
        const facts = retainedFacts(base, associated);
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
      return delivery(content, base, decision, title, answerReference, 'retained');
    }
    const definition = catalog.lenses[request.lens]!;
    const designation = request.designation;
    const plans = new Map(definition.results.map(contract => [contract, request.consumption
      ? consumptionPlan(catalog.presentations, contract, request.consumption, freshFacts(definition)) : []]));
    if (request.consumption && ![...plans.values()].some(plan => plan.length)) return failPresentation('No Presentation accepts the prospective answer contract with the supplied format, source and paging choices.');
    const mechanical = mechanicalImplementation(definition);
    const operation = definition.requirements.kind === 'interpretation' ? definition.requirements.operation : null;
    const lookupModules = designation.kind === 'name' && definition.subjects.includes('module') ? evaluateModules(store, analysis, mechanical?.lookup.modules ?? [], lookupWork) : undefined;
    const lookupOrganization = lookupModules && definition.subjects.includes('group') ? evaluateOrganization(store, lookupModules, mechanical?.lookup.groups ?? [], lookupWork) : undefined;
    const resolution = resolveSubjects(store, session, definition, designation, { ...(lookupModules ? { modules: lookupModules } : {}), ...(lookupOrganization ? { organization: lookupOrganization } : {}) });
    if (resolution.status !== 'resolved') return refusal({ ...resolution, reason: resolution.status, explanation: resolutionExplanation(resolution), retainedAnswers: [] });
    const selected = resolution.candidates.map(candidate => candidate.id);
    const interpretationInspection = definition.requirements.kind === 'inspection' && resolution.candidates[0]?.kind === 'investigram';
    const contract = operation !== null ? 'investigation' : mechanical!.contract(resolution);
    const plan: readonly PresentationDeclaration[] = plans.get(contract) ?? [];
    if (request.consumption && !plan.length) return failPresentation('No compatible Presentation accepts the resolved subject’s answer contract and supplied choices.', resolution);
    const requirements = request.requirements ?? standardRequirements[contract];
    if (!request.consumption && !supportedRequirements(contract, requirements)) return failPresentation('The requested expansions are not supported by this answer content contract.', resolution);
    const modules = [...new Set([...(mechanical?.required.modules ?? []), ...(request.consumption ? plan.flatMap(item => item.requirements.modules) : requirements.modules)])];
    const groups = [...new Set([...(request.consumption ? plan.flatMap(item => item.requirements.groups) : requirements.groups), ...(mechanical?.required.groups ?? [])])];
    const consumeInterpretation = (id: RecordId) => {
      const selection = store.get(id);
      if (selection.kind !== 'investigation-selection-projection') return;
      const records = [...new Set([...selection.relations.flatMap(item => [item.original, item.account]), ...selection.displaced, ...selection.associated])];
      if (records.length) answerWork.record('interpretation', 'consumed', { records, limitations: ['Retained interpretation and revision/association selection; no new inference or independent corroboration.'] });
    };
    if (operation !== null || interpretationInspection) {
      const basis = evaluateModules(store, analysis, [], answerWork); answerWork.check();
      if (definition.subjects.includes('module') && operation !== null) store.entityIds(basis.modules, 'module');
      else store.entityIds(store.investigations(session).flatMap(item => item.investigrams), 'investigram');
      const result = operation !== null && selected.length === 1 ? await integration.evaluate({ operation, subject: selected[0]!, parameters: {} }, work) : null;
      answerWork.check();
      const content: QualifiedContent = { contract: 'investigation', value: resolveInvestigationContent(store, selectInvestigation(store, session, { lens: request.lens, definition }, selected, result)) };
      consumeInterpretation(content.value.projection.id);
      const decision = request.consumption ? settleConsumption(plan, content) : null;
      if (request.consumption && !decision) return failPresentation('The retained interpretation answer does not meet the Presentation materialization precondition; no compatible declared fallback applies.', resolution, [content.value.projection.id], content);
      return delivery(content, content, decision, interpretationInspection ? `${definition.title} · investigram` : definition.title,
        store.answerIds([content.value.projection.id]).get(content.value.projection.id)!, 'fresh', resolution,
        result ? { reused: result.reused, attempt: result.attempt, ...(result.unavailable?.provider ? { provider: result.unavailable.provider } : {}) } : null,
        operation !== null && (!result?.evaluation || result.evaluation.outcome.kind !== 'accepted'));
    }
    if (!mechanical) throw new Error('Missing mechanical implementation');
    const constructed = mechanical.construct({ store, analysis, subjects: selected, request, expansions: { modules, groups }, work: answerWork });
    const base = constructed.content;
    const decision = request.consumption ? settleConsumption(plan, base) : null;
    if (request.consumption && !decision) return failPresentation('The retained answer does not meet the Presentation materialization precondition; no compatible declared fallback applies.', resolution, constructed.retainedAnswers, base);
    const content: QualifiedContent = constructed.associatedSubjects ? { contract: 'investigation', value: resolveInvestigationContent(store, selectAssociatedInspection(store, base.value.projection.id, constructed.associatedSubjects)) } : base;
    consumeInterpretation(content.value.projection.id);
    return delivery(content, base, decision, definition.title, store.answerIds([content.value.projection.id]).get(content.value.projection.id)!, 'fresh', resolution);
  };
}
