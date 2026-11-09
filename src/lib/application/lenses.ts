import { freezeOwned } from '../immutable.js';
import type { InvestigationOperation } from '../investigation/contracts.js';

export type PublicLensId = 'modules' | 'inspect' | 'organization' | 'dependency-structure' | 'dependency-children' | 'dependency-parents'
  | 'summarize' | 'explain' | 'decompose' | 'examine';
export type LensId = string;
export type SubjectKind = 'configured-project' | 'repository' | 'module' | 'group' | 'investigram';
export type SubjectDesignation = { readonly kind: 'default' | 'configured-project' | 'repository' | 'missing' }
  | { readonly kind: 'name' | 'reference'; readonly value: string };
/** Request parameters cross the worker boundary as JSON data. */
export type ParameterValue = null | boolean | number | string | readonly ParameterValue[] | { readonly [key: string]: ParameterValue };
export type ResultContract = 'modules' | 'organization' | 'dependencies' | 'investigation' | 'module-exports';
export interface LensDefinition {
  readonly id: LensId;
  readonly question: string;
  readonly title: string;
  readonly subjects: readonly SubjectKind[];
  readonly cardinality: 'one' | 'collection' | 'population';
  readonly parameters: Readonly<Record<string, never>>;
  readonly requirements: { readonly kind: 'modules' | 'organization' | 'dependencies' | 'inspection' | 'exports'; readonly implementation: string }
    | { readonly kind: 'interpretation'; readonly operation: InvestigationOperation };
  readonly results: readonly ResultContract[];
}

/** Semantic policy shared by coordination and the internal application boundary. */
export const lenses: Readonly<Record<PublicLensId, LensDefinition>> = freezeOwned({
  modules: { id: 'modules', title: 'Modules', question: 'Which modules are discovered for the configured project?', subjects: ['configured-project'], cardinality: 'population', parameters: {}, requirements: { kind: 'modules', implementation: 'module-inventory' }, results: ['modules'] },
  organization: { id: 'organization', title: 'Organization', question: 'How is the designated project or repository organized?', subjects: ['configured-project', 'repository'], cardinality: 'population', parameters: {}, requirements: { kind: 'organization', implementation: 'organization' }, results: ['organization'] },
  'dependency-structure': { id: 'dependency-structure', title: 'Dependencies', question: 'What is the configured project’s direct dependency structure?', subjects: ['configured-project'], cardinality: 'population', parameters: {}, requirements: { kind: 'dependencies', implementation: 'dependency-structure' }, results: ['dependencies'] },
  'dependency-children': { id: 'dependency-children', title: 'Children', question: 'Which modules does the subject directly depend on?', subjects: ['module'], cardinality: 'collection', parameters: {}, requirements: { kind: 'dependencies', implementation: 'dependency-children' }, results: ['dependencies'] },
  'dependency-parents': { id: 'dependency-parents', title: 'Parents', question: 'Which modules directly depend on the subject?', subjects: ['module'], cardinality: 'collection', parameters: {}, requirements: { kind: 'dependencies', implementation: 'dependency-parents' }, results: ['dependencies'] },
  inspect: { id: 'inspect', title: 'Inspect', question: 'What qualified information is established about the subject?', subjects: ['module', 'group', 'investigram'], cardinality: 'collection', parameters: {}, requirements: { kind: 'inspection', implementation: 'inspection' }, results: ['modules', 'organization', 'investigation'] },
  summarize: { id: 'summarize', title: 'Module summary', question: 'What does this module apparently do?', subjects: ['module'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'functionality' }, results: ['investigation'] },
  explain: { id: 'explain', title: 'Explain · investigram', question: 'What clarification makes this interpreted aspect more understandable?', subjects: ['investigram'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'clarification' }, results: ['investigation'] },
  decompose: { id: 'decompose', title: 'Decompose · investigram', question: 'What smaller aspects make up this interpretation?', subjects: ['investigram'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'decomposition' }, results: ['investigation'] },
  examine: { id: 'examine', title: 'Examine · investigram', question: 'What can further investigation establish about this interpreted aspect?', subjects: ['investigram'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'examination' }, results: ['investigation'] },
});

