import { freezeOwned } from './immutable.js';
import { completedMaterialization } from './evaluation-state.js';
import { moduleStandardExpansions } from './records.js';
import type { EvaluationState, ModuleExpansion } from './records.js';
import { groupStandardExpansions } from './organization/records.js';
import type { GroupExpansion } from './organization/records.js';
import type { Presentation } from './presentation.js';
import type { ModuleProjectionContent } from './module-content.js';
import type { OrganizationProjectionContent } from './organization/content.js';
import type { DependencyProjectionContent } from './dependencies/content.js';
import type { InvestigationProjectionContent } from './investigation/content.js';
import type { ModuleExportsContent } from './exports/content.js';
import type { LensDefinition, NormalizedRequest, ResultContract } from './requests.js';
import { inlineText } from './terminal-text.js';

/** These contracts name qualified meanings, not interchangeable graph shapes. */
export type PresentationContent =
  | { readonly contract: 'modules'; readonly value: ModuleProjectionContent }
  | { readonly contract: 'organization'; readonly value: OrganizationProjectionContent }
  | { readonly contract: 'dependencies'; readonly value: DependencyProjectionContent }
  | { readonly contract: 'investigation'; readonly value: InvestigationProjectionContent }
  | { readonly contract: 'module-exports'; readonly value: ModuleExportsContent };

export interface PresentationDefinition {
  readonly id: string;
  readonly contract: ResultContract;
  readonly default: boolean;
  readonly formats: readonly Presentation['format'][];
  readonly source: 'supported' | 'selected-subjects' | 'none';
  readonly associationPage: boolean;
  readonly revisionPage: boolean;
  readonly requirements: { readonly modules: readonly ModuleExpansion[]; readonly groups: readonly GroupExpansion[] };
  /** Qualified includes incomplete, unavailable and established-empty answers. */
  readonly precondition: 'qualified' | 'complete-materialization';
  readonly fallback?: string;
}
export interface PresentationDecision {
  readonly contract: ResultContract;
  readonly initial: string;
  readonly selected: string;
  readonly criteria: Omit<PresentationDefinition, 'id' | 'default' | 'fallback'>;
  readonly changes: readonly { readonly from: string; readonly to: string; readonly reason: string }[];
}
export interface PresentedOptions extends Presentation { readonly decision?: PresentationDecision }
const standard = { default: true, formats: ['unicode', 'json'] as const, precondition: 'qualified' as const };
export const presentations: readonly PresentationDefinition[] = freezeOwned([
  { ...standard, id: 'module', contract: 'modules', source: 'selected-subjects', associationPage: true, revisionPage: false,
    requirements: { modules: moduleStandardExpansions, groups: [] } },
  { ...standard, id: 'organization', contract: 'organization', source: 'selected-subjects', associationPage: true, revisionPage: false,
    requirements: { modules: moduleStandardExpansions, groups: groupStandardExpansions } },
  { ...standard, id: 'dependency', contract: 'dependencies', source: 'supported', associationPage: false, revisionPage: false,
    requirements: { modules: moduleStandardExpansions, groups: groupStandardExpansions } },
  { ...standard, id: 'interpretation', contract: 'investigation', source: 'supported', associationPage: true, revisionPage: true,
    requirements: { modules: [], groups: [] } },
]);

export function validatePresentations(definitions: readonly PresentationDefinition[]): void {
  const ids = new Map(definitions.map(item => [item.id, item]));
  if (ids.size !== definitions.length) throw new Error('Duplicate Presentation identity');
  const defaults = new Set<ResultContract>();
  for (const definition of definitions) {
    if (!definition.id || !['modules', 'organization', 'dependencies', 'investigation', 'module-exports'].includes(definition.contract)
      || !['qualified', 'complete-materialization'].includes(definition.precondition)
      || !['supported', 'selected-subjects', 'none'].includes(definition.source)
      || !definition.formats.length || definition.formats.some(format => !['unicode', 'json'].includes(format))
      || definition.requirements.modules.some(item => !moduleStandardExpansions.includes(item))
      || definition.requirements.groups.some(item => !groupStandardExpansions.includes(item))) throw new Error('Invalid Presentation definition');
    if (definition.contract === 'organization' && !definition.requirements.groups.includes('group-details')
      || ['modules', 'module-exports'].includes(definition.contract) && definition.requirements.groups.length
      || definition.contract === 'investigation' && (definition.requirements.modules.length || definition.requirements.groups.length)) throw new Error('Unsupported Presentation requirements');
    if (['modules', 'organization'].includes(definition.contract) && definition.source === 'supported'
      || definition.contract !== 'investigation' && definition.revisionPage
      || ['dependencies', 'module-exports'].includes(definition.contract) && definition.associationPage) throw new Error('Unsupported Presentation options');
    if (definition.default && defaults.has(definition.contract)) throw new Error('Duplicate default Presentation for a contract');
    if (definition.default) defaults.add(definition.contract);
    const seen = new Set<string>([definition.id]);
    let next = definition;
    while (next.fallback !== undefined) {
      const fallback = ids.get(next.fallback);
      if (!fallback || fallback.contract !== definition.contract || seen.has(fallback.id)) throw new Error('Invalid Presentation fallback');
      seen.add(fallback.id); next = fallback;
    }
  }
}

type LensRequest = Extract<NormalizedRequest, { kind: 'lens' }>;
export function compatiblePresentation(definition: PresentationDefinition, request: LensRequest, lens: LensDefinition): boolean {
  const options = request.presentation;
  return definition.formats.includes(options.format)
    && (!options.sourceDetail || definition.source === 'supported' || definition.source === 'selected-subjects' && lens.cardinality !== 'population')
    && (options.after === undefined || definition.associationPage && lens.requirements.kind === 'inspection')
    && (options.revisionPage === undefined || definition.revisionPage);
}

/** A bounded default and its declared fallbacks, filtered without changing choices.
 * Their standard expansions are planned together before Evaluation. */
export function planPresentation(definitions: readonly PresentationDefinition[], contract: ResultContract, request: LensRequest, lens: LensDefinition): readonly PresentationDefinition[] {
  const first = definitions.find(item => item.default && item.contract === contract && compatiblePresentation(item, request, lens));
  if (!first) return [];
  const result = [first];
  let next = first;
  while (next.fallback) {
    next = definitions.find(item => item.id === next.fallback)!;
    if (compatiblePresentation(next, request, lens)) result.push(next);
  }
  return result;
}

const complete = (state: Pick<EvaluationState, 'applicability' | 'availability' | 'execution' | 'materialization'>) =>
  state.applicability === 'applicable' && state.availability === 'available' && completedMaterialization(state);

/** Malformed internal content is a defect; qualified incompleteness is data.
 * The family resolvers have already checked support records and their kinds. */
export function validatePresentationContent(content: PresentationContent): void {
  const projection = content.value.projection;
  const expected = { modules: 'projection', organization: 'organization-projection', dependencies: 'dependency-projection', investigation: 'investigation-selection-projection', 'module-exports': 'module-exports-projection' };
  if (projection.kind !== expected[content.contract] || !projection.id || !projection.session) throw new Error('Malformed Presentation content contract');
  if (content.contract === 'modules') {
    if (!['configured-project', 'selected-modules'].includes(content.value.projection.subject)
      || content.value.discovery.kind !== 'evaluation' || content.value.evaluations[0]?.id !== content.value.discovery.id || content.value.session.id !== projection.session
      || content.value.modules.length !== content.value.projection.modules.length
      || content.value.modules.some((item, index) => item.id !== content.value.projection.modules[index])) throw new Error('Malformed module Presentation content');
  } else if (content.contract === 'organization') {
    if (!['configured-project', 'repository', 'selected-entities'].includes(content.value.projection.subject)
      || content.value.evaluation.kind !== 'organization-evaluation' || content.value.moduleEvaluation.kind !== 'evaluation') throw new Error('Malformed organization Presentation content');
    if (content.value.moduleDetail) validatePresentationContent({ contract: 'modules', value: content.value.moduleDetail });
  } else if (content.contract === 'dependencies') {
    if (content.value.evaluation.kind !== 'dependency-evaluation' || content.value.basis.kind !== 'evaluation') throw new Error('Malformed dependency Presentation content');
    const answer = content.value.projection;
    if (![null, 'parent', 'child'].includes(answer.subjectRole)
      || !['evaluation', 'subject-owners', 'unattributable-to-subjects'].includes(answer.coverageScope)
      || !['configured-project', 'selected-modules'].includes(answer.subject)
      || (answer.subjectRole === null) !== (answer.subject === 'configured-project')
      || (answer.graph !== null) !== (answer.subjectRole === null)
      || answer.coverageScope === 'unattributable-to-subjects' && (answer.nonEdgeRequests.length || answer.coverage.length)) throw new Error('Malformed dependency direction or coverage');
  } else if (content.contract === 'module-exports') {
    if (content.value.basis.id !== content.value.projection.evaluation || content.value.basis.session !== projection.session
      || content.value.basis.requirement !== 'modules' || content.value.module.record.subject !== content.value.projection.subject
      || content.value.evaluations.length !== content.value.projection.evaluations.length
      || content.value.evaluations.some((item, index) => item.id !== content.value.projection.evaluations[index])
      || content.value.exports.length !== content.value.projection.exports.length
      || content.value.exports.some((item, index) => item.claim.record.id !== content.value.projection.exports[index]
        || item.claim.record.subject !== content.value.projection.subject)) throw new Error('Malformed exports Presentation content');
  } else {
    const { projection: selected, evaluation } = content.value;
    if (selected.variant === 'request' && selected.outcome.kind === 'evaluation' && (!evaluation || evaluation.id !== selected.outcome.evaluation)) throw new Error('Malformed interpretation Presentation content');
    const accounts = new Set(content.value.accounts.map(item => item.id));
    if (selected.relations.some(item => !accounts.has(item.original) || !accounts.has(item.account))) throw new Error('Malformed interpretation account content');
  }
}

/** Explain unmet operational completeness without treating qualifications as defects. */
export function materializationLimitations(content: PresentationContent): readonly string[] {
  const state = (label: string, value: Pick<EvaluationState, 'applicability' | 'availability' | 'execution' | 'materialization' | 'reason'>) => complete(value) ? []
    : [`${label}: ${value.applicability}, ${value.availability}, ${value.execution}, ${value.materialization}${value.reason ? `; ${value.reason}` : ''}`];
  const outsiders = (ids: readonly string[] | undefined) => ids?.length ? ['Selected subjects are outside the supplied evaluation population.'] : [];
  switch (content.contract) {
    case 'module-exports': return [...(content.value.complete ? [] : ['A complete export surface is not established.']),
      ...[content.value.basis, ...content.value.evaluations].flatMap(item => state(`Exports (${item.requirement})`, item))];
    case 'modules': return [...outsiders(content.value.projection.selection.outsidePopulation),
      ...content.value.evaluations.flatMap(item => state(`Modules (${item.requirement})`, item))];
    case 'organization': return [...state('Organization', content.value.evaluation), ...state('Placement', content.value.evaluation.placement),
      ...state('Modules', content.value.moduleEvaluation), ...content.value.moduleEvaluations.flatMap(item => state(`Modules (${item.requirement})`, item)),
      ...outsiders(content.value.projection.selection.outsidePopulation),
      ...(content.value.moduleDetail ? materializationLimitations({ contract: 'modules', value: content.value.moduleDetail }) : [])];
    case 'dependencies': return [...state('Dependencies', content.value.evaluation), ...state('Modules', content.value.basis),
      ...content.value.moduleEvaluations.flatMap(item => state(`Modules (${item.requirement})`, item)),
      ...(content.value.expanded ? state('Dependency organization', content.value.expanded) : []), ...outsiders(content.value.projection.selection.outsidePopulation)];
    case 'investigation': {
      if (content.value.projection.variant !== 'request') return [];
      const outcome = content.value.evaluation?.outcome ?? (content.value.projection.outcome.kind === 'unavailable' ? content.value.projection.outcome.value : null);
      if (!outcome) throw new Error('Missing interpretation outcome');
      return outcome.kind === 'accepted' ? [] : [`Interpretation: ${outcome.kind}${'diagnostic' in outcome && outcome.diagnostic ? `; ${outcome.diagnostic}` : ''}`];
    }
  }
}

export function settlePresentation(plan: readonly PresentationDefinition[], content: PresentationContent): PresentationDecision | null {
  validatePresentationContent(content);
  if (plan.some(item => item.contract !== content.contract)) throw new Error('Presentation plan does not match constructed content');
  const index = plan.findIndex(item => item.precondition === 'qualified' || !materializationLimitations(content).length);
  if (index < 0) return null;
  const { id, default: _default, fallback: _fallback, ...criteria } = plan[index]!;
  return freezeOwned({ contract: content.contract, initial: plan[0]!.id, selected: id, criteria,
    changes: index === 0 ? [] : [{ from: plan[0]!.id, to: plan[index]!.id, reason: 'The preferred Presentation requires complete materialization; the declared fallback accepts qualified partial or unavailable content.' }] });
}

export function presentedOptions(options: Presentation, decision: PresentationDecision): PresentedOptions {
  return freezeOwned({ format: options.format, sourceDetail: options.sourceDetail, decision });
}
export function presentationChanges(options: PresentedOptions): string[] {
  return options.decision?.changes.map(change => `Presentation changed from ${inlineText(change.from)} to ${inlineText(change.to)}: ${inlineText(change.reason)}`) ?? [];
}

/** Content-based compatibility for exact presentation; no Lens request or planning. */
export function retainedPresentation(definitions: readonly PresentationDefinition[], content: PresentationContent,
  options: Extract<NormalizedRequest, { kind: 'present' }>['presentation'], associated = false): PresentationDecision | null {
  validatePresentationContent(content);
  const selected = content.contract === 'modules' ? content.value.projection.subject === 'selected-modules'
    : content.contract === 'organization' ? content.value.projection.subject === 'selected-entities' : true;
  const association = associated || content.contract === 'investigation' && content.value.projection.variant === 'historical-inspection';
  const revision = content.contract === 'investigation' && content.value.projection.variant !== 'associated-inspection';
  const accepts = (definition: PresentationDefinition) => definition.formats.includes(options.format)
    && (!options.sourceDetail || definition.source === 'supported' || definition.source === 'selected-subjects' && selected)
    && (options.after === undefined || definition.associationPage && association)
    && (options.revisionPage === undefined || definition.revisionPage && revision);
  const supplied = (definition: PresentationDefinition): boolean => {
    const requirements = definition.requirements;
    switch (content.contract) {
      case 'modules': return requirements.modules.every(item => content.value.projection.expansions.requested.includes(item));
      case 'organization': return requirements.groups.every(item => content.value.projection.expansions.requested.includes(item))
        && (!content.value.moduleEvaluation.modules.length || requirements.modules.every(item => content.value.moduleEvaluations.some(outcome => outcome.requirement === item)))
        && (!content.value.moduleDetail || requirements.modules.every(item => content.value.moduleDetail!.projection.expansions.requested.includes(item)));
      case 'dependencies': return (!content.value.basis.modules.length || requirements.modules.every(item => content.value.moduleEvaluations.some(outcome => outcome.requirement === item)))
        && (!requirements.groups.length || content.value.expanded !== null);
      case 'module-exports': return requirements.modules.every(item => content.value.evaluations.some(outcome => outcome.requirement === item));
      case 'investigation': return true;
    }
  };
  const initial = definitions.find(item => item.default && item.contract === content.contract && accepts(item));
  if (!initial) return null;
  const plan: PresentationDefinition[] = [];
  let next: PresentationDefinition | undefined = initial;
  while (next) {
    if (accepts(next) && supplied(next)) plan.push(next);
    next = next.fallback ? definitions.find(item => item.id === next!.fallback) : undefined;
  }
  const settled = settlePresentation(plan, content);
  if (!settled) return null;
  return settled.initial === initial.id ? settled : freezeOwned({ ...settled, initial: initial.id,
    changes: [{ from: initial.id, to: settled.selected, reason: 'The preferred Presentation requires support absent from this answer; the declared fallback uses only retained support.' }] });
}
