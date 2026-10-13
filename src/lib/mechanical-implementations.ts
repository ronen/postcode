import { canonical } from './identity.js';
import { freezeOwned } from './immutable.js';
import { lenses } from './requests.js';
import type { LensDefinition, ResultContract, ViewRequest } from './requests.js';
import type { SubjectResolution } from './subject-resolution.js';
import type { PresentationContent } from './presentation-contracts.js';
import type { ProgramRecordStore, RecordId, ModuleExpansion, ProjectionRecord } from './records.js';
import { moduleStandardExpansions } from './records.js';
import { groupStandardExpansions } from './organization/records.js';
import type { GroupExpansion } from './organization/records.js';
import { evaluateModules } from './evaluation.js';
import type { ModuleAnalysis } from './evaluation.js';
import type { WorkScope } from './work-attribution.js';
import { modules } from './projections.js';
import { resolveModuleProjection } from './module-content.js';
import { evaluateOrganization } from './organization/evaluate.js';
import { organization, inspectOrganization } from './organization/projections.js';
import { resolveOrganizationProjection } from './organization/content.js';
import { evaluateDependencies } from './dependencies/evaluate.js';
import { evaluateDependencyOrganization } from './dependencies/organization.js';
import { dependencyStructure, dependencyChildren, dependencyParents } from './dependencies/projections.js';
import { resolveDependencyProjection } from './dependencies/content.js';
import { moduleExports, resolveModuleExports } from './exports/content.js';

type Expansions = { readonly modules: readonly ModuleExpansion[]; readonly groups: readonly GroupExpansion[] };
export type MechanicalContent = Exclude<PresentationContent, { contract: 'investigation' }>;
interface Construction {
  readonly content: MechanicalContent;
  readonly retainedAnswers: readonly RecordId[];
  readonly associatedSubjects?: readonly RecordId[];
}
interface Inputs {
  readonly store: ProgramRecordStore;
  readonly analysis: ModuleAnalysis;
  readonly subjects: readonly RecordId[];
  readonly request: ViewRequest;
  readonly expansions: Expansions;
  readonly work: WorkScope;
}
interface MechanicalImplementation {
  /** Exact question/application contract implemented by this registered constructor. */
  readonly definition: LensDefinition;
  readonly lookup: Expansions;
  readonly required: Expansions;
  readonly contract: (resolution: SubjectResolution) => ResultContract;
  readonly construct: (input: Inputs) => Construction;
}
const none: Expansions = { modules: [], groups: [] };
const lookup: Expansions = { modules: moduleStandardExpansions, groups: groupStandardExpansions };
const result = (content: MechanicalContent): Construction => ({ content, retainedAnswers: [content.value.projection.id] });
const fixed = (contract: ResultContract) => () => contract;

/** The extension is registered internally but is absent from production Lens catalogs. */
export const exportsLens: LensDefinition = freezeOwned({ id: 'exports', title: 'Module exports', question: 'Which exports are established for this module?',
  subjects: ['module'], cardinality: 'one', parameters: {}, requirements: { kind: 'exports', implementation: 'module-exports' }, results: ['module-exports'] });

function dependency(definition: LensDefinition, direction: 'structure' | 'children' | 'parents'): MechanicalImplementation {
  return { definition, lookup, required: none, contract: fixed('dependencies'), construct: ({ store, analysis, subjects, expansions, work }) => {
    const outcome = evaluateDependencies(store, analysis, expansions.modules, work);
    const basis = store.get(outcome.moduleEvaluation);
    if (basis.kind !== 'evaluation') throw new Error('Expected dependency module basis');
    const placement = evaluateOrganization(store, basis, expansions.groups, work);
    const expanded = evaluateDependencyOrganization(store, outcome, placement, work);
    work.check();
    const projection = direction === 'structure' ? dependencyStructure(store, outcome, expanded.id)
      : direction === 'children' ? dependencyChildren(store, outcome, subjects, expanded.id) : dependencyParents(store, outcome, subjects, expanded.id);
    return result({ contract: 'dependencies', value: resolveDependencyProjection(store, projection) });
  } };
}

/** Adding a mechanical question requires its local constructor and this explicit registration,
 * never a new Lens-name branch in request coordination or reporting. */
const implementations: Readonly<Record<string, MechanicalImplementation>> = freezeOwned({
  'module-inventory': { definition: lenses.modules, lookup, required: none, contract: fixed('modules'), construct: ({ store, analysis, expansions, work }) => {
    const basis = evaluateModules(store, analysis, expansions.modules, work); work.check();
    return result({ contract: 'modules', value: resolveModuleProjection(store, modules(store, basis)) });
  } },
  organization: { definition: lenses.organization, lookup, required: none, contract: fixed('organization'), construct: ({ store, analysis, expansions, work, request }) => {
    const basis = evaluateModules(store, analysis, expansions.modules, work);
    const outcome = evaluateOrganization(store, basis, expansions.groups, work); work.check();
    return result({ contract: 'organization', value: resolveOrganizationProjection(store,
      organization(store, outcome, request.subject === 'repository' ? 'repository' : 'configured-project')) });
  } },
  inspection: { definition: lenses.inspect, lookup, required: { modules: [], groups: groupStandardExpansions },
    contract: resolution => resolution.candidates[0]?.kind === 'investigram' ? 'investigation'
      : resolution.candidates.some(item => item.kind === 'group') ? 'organization' : 'modules',
    construct: ({ store, analysis, expansions, work, subjects }) => {
      const basis = evaluateModules(store, analysis, expansions.modules, work);
      const outcome = evaluateOrganization(store, basis, expansions.groups, work); work.check();
      const projection = inspectOrganization(store, outcome, subjects);
      const detail = projection.moduleProjection ? store.get(projection.moduleProjection) as ProjectionRecord : null;
      const moduleOnly = projection.groups.length === 0 && detail !== null && (detail.modules.length > 0 || outcome.groups.length === 0);
      return { content: moduleOnly ? { contract: 'modules', value: resolveModuleProjection(store, detail) }
        : { contract: 'organization', value: resolveOrganizationProjection(store, projection) },
      retainedAnswers: [...new Set([projection.id, ...(detail ? [detail.id] : [])])], associatedSubjects: [...projection.groups, ...(detail?.modules ?? [])] };
    } },
  'dependency-structure': dependency(lenses['dependency-structure'], 'structure'),
  'dependency-children': dependency(lenses['dependency-children'], 'children'),
  'dependency-parents': dependency(lenses['dependency-parents'], 'parents'),
  'module-exports': { definition: exportsLens, lookup: none, required: { modules: ['exports'], groups: [] }, contract: fixed('module-exports'),
    construct: ({ store, analysis, subjects, expansions, work }) => {
      const basis = evaluateModules(store, analysis, expansions.modules, work); work.check();
      return result({ contract: 'module-exports', value: resolveModuleExports(store, moduleExports(store, basis, subjects, exportsLens.id)) });
    } },
});

export function mechanicalImplementation(definition: LensDefinition): MechanicalImplementation | null {
  if (definition.requirements.kind === 'interpretation') return null;
  const implementation = Object.hasOwn(implementations, definition.requirements.implementation) ? implementations[definition.requirements.implementation] : undefined;
  if (!implementation || canonical(definition) !== canonical(implementation.definition)) throw new Error('Unsupported mechanical Lens definitions for registered construction');
  return implementation;
}
