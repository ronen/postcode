import { freezeOwned } from '../immutable.js';
import type { ExactSubject } from '../contributions/subjects.js';

export type PublicLensId = 'modules' | 'inspect' | 'organization' | 'dependency-structure' | 'dependency-children' | 'dependency-parents'
  | 'summarize' | 'explain' | 'decompose' | 'examine';
export type LensId = string;
/** `contribution` is an accepted contribution of the common ledger, designated by its exact identity. */
export type SubjectKind = 'configured-project' | 'repository' | 'module' | 'group' | 'investigram' | 'contribution' | 'content' | 'designation' | 'entity';
export type SubjectDesignation = { readonly kind: 'default' | 'configured-project' | 'repository' | 'missing' }
  | { readonly kind: 'name' | 'reference'; readonly value: string }
  | { readonly kind: 'selection'; readonly subject: ExactSubject };
/** Request parameters cross the worker boundary as JSON data. */
export type ParameterValue = null | boolean | number | string | readonly ParameterValue[] | { readonly [key: string]: ParameterValue };
export type ResultContract = 'modules' | 'organization' | 'dependencies' | 'module-exports' | 'contribution' | 'contribution-inspection';
export interface LensDefinition {
  readonly id: LensId;
  readonly question: string;
  readonly title: string;
  readonly subjects: readonly SubjectKind[];
  readonly cardinality: 'one' | 'collection' | 'population';
  /** Declared parameter names with their meaning. Most Lenses declare none. */
  readonly parameters: Readonly<Record<string, string>>;
  readonly requirements: { readonly kind: 'modules' | 'organization' | 'dependencies' | 'inspection' | 'exports'; readonly implementation: string }
    /** An agentic investigation retained through common contributions, with an explicit requested result contract. */
    | { readonly kind: 'contribution'; readonly operation: string; readonly resultContract: string | null }
    /** Invocation of an exact retained follow-up option; the option supplies the delegated question. */
    | { readonly kind: 'follow-up' };
  readonly results: readonly ResultContract[];
}

/** Semantic policy shared by coordination and the internal application boundary. */
export const lenses: Readonly<Record<PublicLensId, LensDefinition>> = freezeOwned({
  modules: { id: 'modules', title: 'Modules', question: 'Which modules are discovered for the configured project?', subjects: ['configured-project'], cardinality: 'population', parameters: {}, requirements: { kind: 'modules', implementation: 'module-inventory' }, results: ['modules'] },
  organization: { id: 'organization', title: 'Organization', question: 'How is the designated project or repository organized?', subjects: ['configured-project', 'repository'], cardinality: 'population', parameters: {}, requirements: { kind: 'organization', implementation: 'organization' }, results: ['organization'] },
  'dependency-structure': { id: 'dependency-structure', title: 'Dependencies', question: 'What is the configured project’s direct dependency structure?', subjects: ['configured-project'], cardinality: 'population', parameters: {}, requirements: { kind: 'dependencies', implementation: 'dependency-structure' }, results: ['dependencies'] },
  'dependency-children': { id: 'dependency-children', title: 'Children', question: 'Which modules does the subject directly depend on?', subjects: ['module'], cardinality: 'collection', parameters: {}, requirements: { kind: 'dependencies', implementation: 'dependency-children' }, results: ['dependencies'] },
  'dependency-parents': { id: 'dependency-parents', title: 'Parents', question: 'Which modules directly depend on the subject?', subjects: ['module'], cardinality: 'collection', parameters: {}, requirements: { kind: 'dependencies', implementation: 'dependency-parents' }, results: ['dependencies'] },
  inspect: { id: 'inspect', title: 'Inspect', question: 'What qualified information is established about the subject?', subjects: ['module', 'group', 'contribution', 'content', 'designation', 'entity'], cardinality: 'collection', parameters: {}, requirements: { kind: 'inspection', implementation: 'inspection' }, results: ['modules', 'organization', 'contribution-inspection'] },
  summarize: { id: 'summarize', title: 'Module summary', question: 'What does this module apparently do?', subjects: ['module'], cardinality: 'one', parameters: {}, requirements: { kind: 'contribution', operation: 'functionality', resultContract: null }, results: ['contribution'] },
  explain: { id: 'explain', title: 'Explain · investigram', question: 'What clarification makes this interpreted aspect more understandable?', subjects: ['contribution', 'content', 'designation'], cardinality: 'one', parameters: {}, requirements: { kind: 'contribution', operation: 'clarification', resultContract: null }, results: ['contribution'] },
  decompose: { id: 'decompose', title: 'Decompose · investigram', question: 'What smaller aspects make up this interpretation?', subjects: ['contribution', 'content', 'designation'], cardinality: 'one', parameters: {}, requirements: { kind: 'contribution', operation: 'decomposition', resultContract: null }, results: ['contribution'] },
  examine: { id: 'examine', title: 'Examine · investigram', question: 'What can further investigation establish about this interpreted aspect?', subjects: ['contribution', 'content', 'designation'], cardinality: 'one', parameters: {}, requirements: { kind: 'contribution', operation: 'examination', resultContract: null }, results: ['contribution'] },
});

/**
 * Lenses answered from common contributions. They are available through the application
 * interface; no command-line spelling or menu exists for them.
 */
export const contributionLenses: Readonly<Record<string, LensDefinition>> = freezeOwned({
  'state-behavior': { id: 'state-behavior', title: 'State-dependent behavior', question: 'Does this module\'s behavior depend on state, and if so what are its states and transitions, shown as a state diagram?',
    subjects: ['module'], cardinality: 'one', parameters: {}, requirements: { kind: 'contribution', operation: 'state-behavior', resultContract: 'postcode/state-diagram-answer@1' }, results: ['contribution'] },
  'follow-up': { id: 'follow-up', title: 'Follow-up option', question: 'What does the investigation proposed by this retained follow-up option establish?',
    subjects: ['contribution'], cardinality: 'one', parameters: { option: 'The key of the follow-up option within the designated contribution.' }, requirements: { kind: 'follow-up' }, results: ['contribution'] },
});

