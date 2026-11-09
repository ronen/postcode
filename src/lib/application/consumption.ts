import { canonical } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import { moduleStandardExpansions } from '../records.js';
import { groupStandardExpansions } from '../organization/records.js';
import type { LensDefinition, ParameterValue, ResultContract } from './lenses.js';
import type { ConsumptionChoice, InformationRequirements } from './requests.js';
import { materializationLimitations, validateContent } from './content.js';
import type { QualifiedContent } from './content.js';

export type ConsumptionFact = 'selected-subjects' | 'inspection' | 'association' | 'revision';
export interface OptionEligibility {
  readonly option: string;
  readonly when: 'present' | 'truthy' | 'always';
  readonly values?: readonly ParameterValue[];
  readonly requires?: readonly ConsumptionFact[];
  /** Client-owned explanation of an opaque option. */
  readonly label: string;
  readonly includeValue?: boolean;
}
export interface PresentationDeclaration {
  readonly id: string;
  readonly contract: ResultContract;
  readonly default: boolean;
  readonly requirements: InformationRequirements;
  readonly eligibility: readonly OptionEligibility[];
  readonly precondition: 'qualified' | 'complete-materialization';
  readonly fallback?: string;
  /** Captured client description for reporting the actual selected declaration. */
  readonly description?: Readonly<Record<string, ParameterValue>>;
}
export interface ConsumptionDecision {
  readonly contract: ResultContract;
  readonly initial: string;
  readonly selected: PresentationDeclaration;
  readonly changes: readonly { readonly from: string; readonly to: string; readonly reason: string }[];
}
export const standardRequirements: Readonly<Record<ResultContract, InformationRequirements>> = freezeOwned({
  modules: { modules: moduleStandardExpansions, groups: [] },
  organization: { modules: moduleStandardExpansions, groups: groupStandardExpansions },
  dependencies: { modules: moduleStandardExpansions, groups: groupStandardExpansions },
  'module-exports': { modules: ['exports', 'documentation'], groups: [] },
  investigation: { modules: [], groups: [] },
});
export function supportedRequirements(contract: ResultContract, requirements: InformationRequirements): boolean {
  const supported = standardRequirements[contract];
  return requirements.modules.every(item => supported.modules.includes(item)) && requirements.groups.every(item => supported.groups.includes(item));
}
export function capturePresentations(source: readonly PresentationDeclaration[]): readonly PresentationDeclaration[] {
  const declarations = freezeOwned(structuredClone(source));
  const ids = new Map(declarations.map(item => [item.id, item]));
  if (ids.size !== declarations.length) throw new Error('Duplicate Presentation identity');
  const defaults = new Set<string>();
  for (const declaration of declarations) {
    if (!declaration.id || !Object.hasOwn(standardRequirements, declaration.contract)
      || !supportedRequirements(declaration.contract, declaration.requirements)
      || declaration.contract === 'organization' && !declaration.requirements.groups.includes('group-details')
      || !['qualified', 'complete-materialization'].includes(declaration.precondition)
      || declaration.eligibility.some(rule => !rule.option || !['present', 'truthy', 'always'].includes(rule.when)
        || rule.requires?.some(fact => !['selected-subjects', 'inspection', 'association', 'revision'].includes(fact)))) throw new Error('Invalid Presentation declaration');
    if (declaration.default && defaults.has(declaration.contract)) throw new Error('Duplicate default Presentation for a contract');
    if (declaration.default) defaults.add(declaration.contract);
    const seen = new Set([declaration.id]);
    let next = declaration;
    while (next.fallback) {
      const fallback = ids.get(next.fallback);
      if (!fallback || fallback.contract !== declaration.contract || seen.has(fallback.id)) throw new Error('Invalid Presentation fallback');
      seen.add(fallback.id); next = fallback;
    }
  }
  return declarations;
}
export function unsupportedOptions(declaration: PresentationDeclaration, choice: ConsumptionChoice, facts: readonly ConsumptionFact[]): readonly string[] {
  const unknown = Object.keys(choice.options).filter(option => !declaration.eligibility.some(rule => rule.option === option));
  return [...unknown, ...declaration.eligibility.flatMap(rule => {
    const value = Object.hasOwn(choice.options, rule.option) ? choice.options[rule.option] : undefined;
    if (rule.when === 'present' && value === undefined || rule.when === 'truthy' && !value) return [];
    const valid = (!rule.values || rule.values.some(allowed => canonical(allowed) === canonical(value ?? null)))
      && (!rule.requires || rule.requires.every(fact => facts.includes(fact)));
    return valid ? [] : [rule.label + (rule.includeValue ? ` ${String(value)}` : '')];
  })];
}
export function freshFacts(lens: LensDefinition): readonly ConsumptionFact[] {
  return [...(lens.cardinality !== 'population' ? ['selected-subjects' as const] : []),
    ...(lens.requirements.kind === 'inspection' ? ['inspection' as const, 'association' as const] : []), 'revision'];
}
export function retainedFacts(content: QualifiedContent, associated: boolean): readonly ConsumptionFact[] {
  const selected = content.contract === 'modules' ? content.value.projection.subject === 'selected-modules'
    : content.contract === 'organization' ? content.value.projection.subject === 'selected-entities' : true;
  return [...(selected ? ['selected-subjects' as const] : []), 'inspection',
    ...(associated || content.contract === 'investigation' && content.value.projection.variant === 'historical-inspection' ? ['association' as const] : []),
    ...(content.contract === 'investigation' && content.value.projection.variant !== 'associated-inspection' ? ['revision' as const] : [])];
}
export function consumptionPlan(declarations: readonly PresentationDeclaration[], contract: ResultContract, choice: ConsumptionChoice,
  facts: readonly ConsumptionFact[]): readonly PresentationDeclaration[] {
  const first = declarations.find(item => choice.presentations.includes(item.id) && item.default && item.contract === contract && !unsupportedOptions(item, choice, facts).length);
  if (!first) return [];
  const result = [first]; let next = first;
  while (next.fallback) {
    next = declarations.find(item => item.id === next.fallback)!;
    if (!unsupportedOptions(next, choice, facts).length) result.push(next);
  }
  return result;
}
export function settleConsumption(plan: readonly PresentationDeclaration[], content: QualifiedContent): ConsumptionDecision | null {
  validateContent(content);
  if (plan.some(item => item.contract !== content.contract)) throw new Error('Presentation plan does not match constructed content');
  const index = plan.findIndex(item => item.precondition === 'qualified' || !materializationLimitations(content).length);
  if (index < 0) return null;
  return freezeOwned({ contract: content.contract, initial: plan[0]!.id, selected: plan[index]!, changes: index === 0 ? [] : [{
    from: plan[0]!.id, to: plan[index]!.id, reason: 'The preferred Presentation requires complete materialization; the declared fallback accepts qualified partial or unavailable content.',
  }] });
}
export function suppliedRequirements(content: QualifiedContent, requirements: InformationRequirements): boolean {
  switch (content.contract) {
    case 'modules': return requirements.modules.every(item => content.value.projection.expansions.requested.includes(item));
    case 'organization': return requirements.groups.every(item => content.value.projection.expansions.requested.includes(item))
      && (!content.value.modules.length || requirements.modules.every(item => content.value.moduleEvaluations.some(outcome => outcome.requirement === item)))
      && (!content.value.moduleDetail || requirements.modules.every(item => content.value.moduleDetail!.projection.expansions.requested.includes(item)));
    case 'dependencies': return (!content.value.basis.modules.length || requirements.modules.every(item => content.value.moduleEvaluations.some(outcome => outcome.requirement === item)))
      && (!requirements.groups.length || content.value.expanded !== null);
    case 'module-exports': return requirements.modules.every(item => content.value.evaluations.some(outcome => outcome.requirement === item));
    case 'investigation': return !requirements.modules.length && !requirements.groups.length;
  }
}
