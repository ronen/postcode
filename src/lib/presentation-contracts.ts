import { validateContent as validatePresentationContent, materializationLimitations } from './application/content.js';
import type { QualifiedContent as PresentationContent } from './application/content.js';
export { validateContent as validatePresentationContent, materializationLimitations } from './application/content.js';
export type { QualifiedContent as PresentationContent } from './application/content.js';
import { freezeOwned } from './immutable.js';
import { moduleStandardExpansions } from './records.js';
import type { ModuleExpansion } from './records.js';
import { groupStandardExpansions } from './organization/records.js';
import type { GroupExpansion } from './organization/records.js';
import type { Presentation } from './presentation.js';
import type { LensDefinition, NormalizedRequest, ResultContract } from './requests.js';
import { inlineText } from './terminal-text.js';

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
    && (!options.moreDetails || definition.source === 'supported' || definition.source === 'selected-subjects' && lens.cardinality !== 'population')
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
  return freezeOwned({ format: options.format, moreDetails: options.moreDetails, decision });
}
export function presentationChanges(options: PresentedOptions): string[] {
  return options.decision?.changes.map(change => `Presentation changed from ${inlineText(change.from)} to ${inlineText(change.to)}: ${inlineText(change.reason)}`) ?? [];
}

/** Content-based compatibility for exact presentation; no Lens request or planning. */
export function retainedPresentation(definitions: readonly PresentationDefinition[], content: PresentationContent,
  options: Extract<NormalizedRequest, { kind: 'present' }>['presentation'], associated = false):
  { readonly decision: PresentationDecision } | { readonly explanation: string } {
  validatePresentationContent(content);
  const selected = content.contract === 'modules' ? content.value.projection.subject === 'selected-modules'
    : content.contract === 'organization' ? content.value.projection.subject === 'selected-entities' : true;
  const association = associated || content.contract === 'investigation' && content.value.projection.variant === 'historical-inspection';
  const revision = content.contract === 'investigation' && content.value.projection.variant !== 'associated-inspection';
  const unsupportedChoices = (definition: PresentationDefinition): string[] => [
    ...(!definition.formats.includes(options.format) ? [`format ${options.format}`] : []),
    ...(options.moreDetails && !(definition.source === 'supported' || definition.source === 'selected-subjects' && selected) ? ['--more-details'] : []),
    ...(options.after !== undefined && !(definition.associationPage && association) ? ['--after'] : []),
    ...(options.revisionPage !== undefined && !(definition.revisionPage && revision) ? ['--revision-page'] : []),
  ];
  const accepts = (definition: PresentationDefinition) => unsupportedChoices(definition).length === 0;
  const supplied = (definition: PresentationDefinition): boolean => {
    const requirements = definition.requirements;
    switch (content.contract) {
      case 'modules': return requirements.modules.every(item => content.value.projection.expansions.requested.includes(item));
      case 'organization': return requirements.groups.every(item => content.value.projection.expansions.requested.includes(item))
        && (!content.value.modules.length || requirements.modules.every(item => content.value.moduleEvaluations.some(outcome => outcome.requirement === item)))
        && (!content.value.moduleDetail || requirements.modules.every(item => content.value.moduleDetail!.projection.expansions.requested.includes(item)));
      case 'dependencies': return (!content.value.basis.modules.length || requirements.modules.every(item => content.value.moduleEvaluations.some(outcome => outcome.requirement === item)))
        && (!requirements.groups.length || content.value.expanded !== null);
      case 'module-exports': return requirements.modules.every(item => content.value.evaluations.some(outcome => outcome.requirement === item));
      case 'investigation': return true;
    }
  };
  const initial = definitions.find(item => item.default && item.contract === content.contract);
  if (!initial) return { explanation: 'No default Presentation is registered for this retained answer’s content contract.' };
  const unsupported = unsupportedChoices(initial);
  if (unsupported.length) return { explanation: `Unsupported presentation choices for this retained answer: ${unsupported.join(', ')}. Remove these choices to present the answer.` };
  const plan: PresentationDefinition[] = [];
  let next: PresentationDefinition | undefined = initial;
  while (next) {
    if (accepts(next) && supplied(next)) plan.push(next);
    next = next.fallback ? definitions.find(item => item.id === next!.fallback) : undefined;
  }
  const settled = settlePresentation(plan, content);
  if (!settled) return { explanation: plan.length
    ? 'The retained answer does not meet the Presentation’s materialization precondition, and no compatible declared fallback can present it.'
    : 'The Presentation requires support not selected by this retained answer, and no compatible declared fallback can use its retained support. Issue a new information request for the additional information.' };
  return { decision: settled.initial === initial.id ? settled : freezeOwned({ ...settled, initial: initial.id,
    changes: [{ from: initial.id, to: settled.selected, reason: 'The preferred Presentation requires support absent from this answer; the declared fallback uses only retained support.' }] }) };
}
