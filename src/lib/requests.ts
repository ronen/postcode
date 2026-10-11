import { freezeOwned } from './immutable.js';
import type { Presentation } from './presentation.js';
import type { InvestigationOperation } from './investigation/contracts.js';

export type LensId = 'modules' | 'inspect' | 'organization' | 'dependency-structure' | 'dependency-children' | 'dependency-parents'
  | 'summarize' | 'explain' | 'decompose' | 'examine';
export type SubjectKind = 'configured-project' | 'repository' | 'module' | 'group' | 'investigram';
export type SubjectDesignation = { readonly kind: 'default' | 'configured-project' | 'repository' | 'missing' }
  | { readonly kind: 'name' | 'reference'; readonly value: string };
/** Request parameters cross the worker boundary as JSON data. */
export type ParameterValue = null | boolean | number | string | readonly ParameterValue[] | { readonly [key: string]: ParameterValue };
export type ResultContract = 'modules' | 'organization' | 'dependencies' | 'investigation';
export interface LensDefinition {
  readonly id: LensId;
  readonly question: string;
  readonly subjects: readonly SubjectKind[];
  readonly cardinality: 'one' | 'collection' | 'population';
  readonly parameters: Readonly<Record<string, never>>;
  readonly requirements: { readonly kind: 'modules' | 'organization' | 'dependencies' | 'inspection' }
    | { readonly kind: 'interpretation'; readonly operation: InvestigationOperation };
  readonly results: readonly ResultContract[];
}

/** Semantic policy shared by coordination and the internal application boundary. */
export const lenses: Readonly<Record<LensId, LensDefinition>> = freezeOwned({
  modules: { id: 'modules', question: 'Which modules are discovered for the configured project?', subjects: ['configured-project'], cardinality: 'population', parameters: {}, requirements: { kind: 'modules' }, results: ['modules'] },
  organization: { id: 'organization', question: 'How is the designated project or repository organized?', subjects: ['configured-project', 'repository'], cardinality: 'population', parameters: {}, requirements: { kind: 'organization' }, results: ['organization'] },
  'dependency-structure': { id: 'dependency-structure', question: 'What is the configured project’s direct dependency structure?', subjects: ['configured-project'], cardinality: 'population', parameters: {}, requirements: { kind: 'dependencies' }, results: ['dependencies'] },
  'dependency-children': { id: 'dependency-children', question: 'Which modules does the subject directly depend on?', subjects: ['module'], cardinality: 'collection', parameters: {}, requirements: { kind: 'dependencies' }, results: ['dependencies'] },
  'dependency-parents': { id: 'dependency-parents', question: 'Which modules directly depend on the subject?', subjects: ['module'], cardinality: 'collection', parameters: {}, requirements: { kind: 'dependencies' }, results: ['dependencies'] },
  inspect: { id: 'inspect', question: 'What qualified information is established about the subject?', subjects: ['module', 'group', 'investigram'], cardinality: 'collection', parameters: {}, requirements: { kind: 'inspection' }, results: ['modules', 'organization', 'investigation'] },
  summarize: { id: 'summarize', question: 'What does this module apparently do?', subjects: ['module'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'functionality' }, results: ['investigation'] },
  explain: { id: 'explain', question: 'What clarification makes this interpreted aspect more understandable?', subjects: ['investigram'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'clarification' }, results: ['investigation'] },
  decompose: { id: 'decompose', question: 'What smaller aspects make up this interpretation?', subjects: ['investigram'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'decomposition' }, results: ['investigation'] },
  examine: { id: 'examine', question: 'What can further investigation establish about this interpreted aspect?', subjects: ['investigram'], cardinality: 'one', parameters: {}, requirements: { kind: 'interpretation', operation: 'examination' }, results: ['investigation'] },
});

/** Command spellings are interface aliases, never normalized Lens identities. */
export const commandLenses = freezeOwned({
  modules: 'modules', organization: 'organization', inspect: 'inspect',
  dependencies: 'dependency-structure', children: 'dependency-children', parents: 'dependency-parents',
  summarize: 'summarize', explain: 'explain', decompose: 'decompose', examine: 'examine',
} as const satisfies Record<string, LensId>);
export type CommandLens = keyof typeof commandLenses;

export interface ViewRequest {
  readonly lens: LensId | CommandLens | 'usage';
  readonly selector: string | null;
  readonly parameters?: Readonly<Record<string, ParameterValue>>;
  readonly after?: string;
  readonly revisionPage?: number;
  readonly referenceLifetime?: 'session' | 'command';
  readonly reference?: boolean;
  readonly subject?: 'project' | 'repository';
  readonly presentation: Presentation;
}
interface RequestChoices {
  readonly presentation: Presentation & { readonly after?: string; readonly revisionPage?: number };
  readonly referenceLifetime: 'session' | 'command';
}
export type NormalizedRequest = RequestChoices & (
  | { readonly kind: 'lens'; readonly lens: LensId; readonly question: string; readonly designation: SubjectDesignation;
      readonly parameters: Readonly<Record<string, ParameterValue>>; readonly programInput: 'session-configured-project' }
  | { readonly kind: 'report'; readonly report: 'usage' }
);

/** Interface spellings never become semantic Lens parameters. */
export function normalizeRequest(request: ViewRequest): NormalizedRequest {
  const choices: RequestChoices = { presentation: { ...request.presentation,
    ...(request.after === undefined ? {} : { after: request.after }),
    ...(request.revisionPage === undefined ? {} : { revisionPage: request.revisionPage }) },
    referenceLifetime: request.referenceLifetime ?? 'session' };
  if (request.lens === 'usage') return freezeOwned({ ...choices, kind: 'report', report: 'usage' });
  const id = Object.hasOwn(commandLenses, request.lens) ? commandLenses[request.lens as CommandLens] : request.lens as LensId;
  const definition = Object.hasOwn(lenses, id) ? lenses[id] : undefined;
  if (!definition) throw new Error('Unknown Lens definition');
  const designation: SubjectDesignation = request.selector !== null
    ? { kind: request.reference ? 'reference' : 'name', value: request.selector }
    : request.subject ? { kind: request.subject === 'project' ? 'configured-project' : 'repository' }
      : { kind: definition.cardinality === 'population' ? 'default' : 'missing' };
  return freezeOwned(structuredClone({ ...choices, kind: 'lens', lens: definition.id, question: definition.question,
    designation, parameters: request.parameters === undefined ? {} : request.parameters, programInput: 'session-configured-project' }));
}

export function invalidParameters(request: NormalizedRequest): string | null {
  if (request.kind === 'report') return null;
  if (!request.parameters || typeof request.parameters !== 'object' || Array.isArray(request.parameters) || Object.getPrototypeOf(request.parameters) !== Object.prototype) return 'Lens parameters must be an object.';
  const unexpected = Object.keys(request.parameters).filter(key => !Object.hasOwn(lenses[request.lens].parameters, key));
  return unexpected.length ? `Lens ${request.lens} declares no parameters; unexpected: ${unexpected.join(', ')}.` : null;
}

export function operationForLens(lens: LensId): InvestigationOperation | null {
  const requirement = lenses[lens].requirements;
  return requirement.kind === 'interpretation' ? requirement.operation : null;
}

/** Reject designation modes whose incompatibility is known without subject lookup. */
export function invalidDesignation(request: NormalizedRequest, supplied: ViewRequest): string | null {
  if (request.kind !== 'lens') return null;
  const definition = lenses[request.lens];
  if (supplied.subject !== undefined && supplied.selector !== null) return 'Supply either a selector or a project/repository subject, not both.';
  if (request.designation.kind === 'missing') return `Lens ${definition.id} requires a subject designation.`;
  if (request.designation.kind === 'configured-project' || request.designation.kind === 'repository') {
    if (!definition.subjects.includes(request.designation.kind)) return `Lens ${definition.id} does not apply to ${request.designation.kind}.`;
  }
  if ((request.designation.kind === 'name' || request.designation.kind === 'reference') && definition.cardinality === 'population') {
    return `Lens ${definition.id} requires a project or repository subject, not a selector.`;
  }
  return null;
}
