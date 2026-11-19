import type { QualifiedContent } from './application/content.js';
/** Qualified content families arranged by this client. */
export type PresentationContent = QualifiedContent;
export { validateContent as validatePresentationContent, materializationLimitations } from './application/content.js';
import { freezeOwned } from './immutable.js';
import { moduleStandardExpansions } from './records.js';
import type { ModuleExpansion } from './records.js';
import { groupStandardExpansions } from './organization/records.js';
import type { GroupExpansion } from './organization/records.js';
import type { Presentation } from './presentation.js';
import type { ResultContract } from './requests.js';
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
  { ...standard, id: 'module', contract: 'modules', source: 'selected-subjects', associationPage: true, revisionPage: true,
    requirements: { modules: moduleStandardExpansions, groups: [] } },
  { ...standard, id: 'organization', contract: 'organization', source: 'selected-subjects', associationPage: true, revisionPage: true,
    requirements: { modules: moduleStandardExpansions, groups: groupStandardExpansions } },
  { ...standard, id: 'dependency', contract: 'dependencies', source: 'supported', associationPage: false, revisionPage: false,
    requirements: { modules: moduleStandardExpansions, groups: groupStandardExpansions } },
  { ...standard, id: 'contribution', contract: 'contribution', source: 'supported', associationPage: false, revisionPage: true, requirements: { modules: [], groups: [] } },
  { ...standard, id: 'contribution-inspection', contract: 'contribution-inspection', source: 'supported', associationPage: true, revisionPage: true, requirements: { modules: [], groups: [] } },
]);

export function validatePresentations(definitions: readonly PresentationDefinition[]): void {
  const ids = new Map(definitions.map(item => [item.id, item]));
  if (ids.size !== definitions.length) throw new Error('Duplicate Presentation identity');
  const defaults = new Set<ResultContract>();
  for (const definition of definitions) {
    if (!definition.id || !['modules', 'organization', 'dependencies', 'module-exports', 'contribution', 'contribution-inspection'].includes(definition.contract)
      || !['qualified', 'complete-materialization'].includes(definition.precondition)
      || !['supported', 'selected-subjects', 'none'].includes(definition.source)
      || !definition.formats.length || definition.formats.some(format => !['unicode', 'json'].includes(format))
      || definition.requirements.modules.some(item => !moduleStandardExpansions.includes(item))
      || definition.requirements.groups.some(item => !groupStandardExpansions.includes(item))) throw new Error('Invalid Presentation definition');
    if (definition.contract === 'organization' && !definition.requirements.groups.includes('group-details')
      || ['modules', 'module-exports'].includes(definition.contract) && definition.requirements.groups.length
      || ['contribution', 'contribution-inspection'].includes(definition.contract) && (definition.requirements.modules.length || definition.requirements.groups.length)) throw new Error('Unsupported Presentation requirements');
    if (['modules', 'organization'].includes(definition.contract) && definition.source === 'supported'
      || !['modules', 'organization', 'contribution', 'contribution-inspection'].includes(definition.contract) && definition.revisionPage
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

export function presentedOptions(options: Presentation, decision: PresentationDecision): PresentedOptions {
  return freezeOwned({ format: options.format, moreDetails: options.moreDetails, decision });
}
export function presentationChanges(options: PresentedOptions): string[] {
  return options.decision?.changes.map(change => `Presentation changed from ${inlineText(change.from)} to ${inlineText(change.to)}: ${inlineText(change.reason)}`) ?? [];
}
