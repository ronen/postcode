import { freezeOwned } from './immutable.js';
import type { Presentation } from './presentation.js';
import type { InvestigationOperation } from './investigation/contracts.js';

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

/** Command spellings are interface aliases, never normalized Lens identities. */
export const commandLenses = freezeOwned({
  modules: 'modules', organization: 'organization', inspect: 'inspect',
  dependencies: 'dependency-structure', children: 'dependency-children', parents: 'dependency-parents',
  summarize: 'summarize', explain: 'explain', decompose: 'decompose', examine: 'examine',
} as const satisfies Record<string, LensId>);
export type CommandLens = keyof typeof commandLenses;

export interface LensViewRequest {
  readonly kind?: 'lens';
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
export interface PresentRequest {
  readonly kind: 'present';
  readonly target: string;
  readonly presentation: Presentation & { readonly after?: string; readonly revisionPage?: number };
  readonly referenceLifetime?: 'session' | 'command';
}
export type ViewRequest = LensViewRequest | PresentRequest;
export interface RequestChoices {
  readonly presentation: Presentation & { readonly after?: string; readonly revisionPage?: number };
  readonly referenceLifetime: 'session' | 'command';
}
export type NormalizedRequest = RequestChoices & (
  | { readonly kind: 'lens'; readonly lens: LensId; readonly question: string; readonly designation: SubjectDesignation;
      readonly parameters: Readonly<Record<string, ParameterValue>>; readonly programInput: 'session-configured-project' }
  | { readonly kind: 'report'; readonly report: 'usage'; readonly suppliedInputs?: Pick<LensViewRequest, 'selector' | 'subject' | 'reference' | 'parameters'> }
  | { readonly kind: 'present'; readonly target: string }
  | RejectedRequest
);

export interface RejectedInputProblem {
  readonly field: string;
  readonly reason: string;
  readonly representation: 'preserved' | 'omitted' | 'absent';
  readonly omittedField?: string;
}
export type RejectedRequest = RequestChoices & {
  readonly kind: 'rejected';
  /** Supplied values are evidence of rejected input, not a validated Lens request. */
  readonly input: Readonly<Record<string, ParameterValue>>;
  readonly problems: readonly RejectedInputProblem[];
};
export type CapturedRequest = { readonly input: ViewRequest; readonly normalized: NormalizedRequest }
  | { readonly input: null; readonly normalized: RejectedRequest };

/** A rejected value must never make its own report unserializable. */
function representationProblem(value: unknown, field: string, ancestors = new Set<object>()): { field: string; reason: string } | null {
  if (value === null || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' && Number.isFinite(value)) return null;
  if (typeof value === 'number') return { field, reason: 'Non-finite numbers cannot be represented as JSON request data.' };
  if (typeof value !== 'object') return { field, reason: `A ${typeof value} value cannot be represented as JSON request data.` };
  if (ancestors.has(value)) return { field, reason: 'A cyclic value cannot be represented as JSON request data.' };
  if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
    return { field, reason: 'Only plain objects and arrays can be represented as structured request data.' };
  }
  if (Array.isArray(value) && (Object.keys(value).length !== value.length || Object.keys(value).some((key, index) => key !== String(index)))) return { field, reason: 'Sparse arrays or array properties cannot be preserved as JSON request data.' };
  ancestors.add(value);
  try {
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key === 'symbol') return { field, reason: 'Symbol keys cannot be represented as JSON request data.' };
      if (Array.isArray(value) && key === 'length') continue;
      const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
      if (!descriptor.enumerable) return { field: `${field}.${key}`, reason: 'Non-enumerable properties cannot be preserved as JSON request data.' };
      if (!('value' in descriptor)) return { field: `${field}.${key}`, reason: 'Accessor properties cannot be captured as request data without executing caller code.' };
      const problem = representationProblem(descriptor.value, `${field}.${key}`, ancestors);
      if (problem) return problem;
    }
    return null;
  } finally { ancestors.delete(value); }
}

/** Capture before any asynchronous work; only known input defects become refusals. */
export function captureRequest(request: ViewRequest, catalog: Readonly<Record<string, LensDefinition>> = lenses): CapturedRequest {
  const fields: [string, ParameterValue][] = [], problems: RejectedInputProblem[] = [];
  for (const key of Reflect.ownKeys(request)) {
    if (typeof key === 'symbol') {
      problems.push({ field: '(symbol key)', reason: 'Symbol-keyed input cannot be represented in a request report.', representation: 'omitted' });
      continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(request, key)!;
    if (!('value' in descriptor)) {
      problems.push({ field: key, reason: 'Accessor input cannot be captured without executing caller code.', representation: 'omitted', omittedField: key });
      continue;
    }
    if (descriptor.value === undefined) continue;
    const problem = representationProblem(descriptor.value, key);
    if (problem) { problems.push({ ...problem, representation: 'omitted', omittedField: key }); continue; }
    try { fields.push([key, structuredClone(descriptor.value) as ParameterValue]); }
    catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'DataCloneError') throw error;
      problems.push({ field: key, reason: 'This value cannot be cloned across the request boundary.', representation: 'omitted', omittedField: key });
    }
  }
  const input = Object.fromEntries(fields);
  const present = input.kind === 'present';
  const problem = (field: string, reason: string) => problems.push({ field, reason,
    representation: Object.hasOwn(input, field) ? 'preserved' : 'absent' });
  if (input.kind !== undefined && input.kind !== 'lens' && !present) problem('kind', 'Request kind must be lens or present.');
  if (present) {
    if (typeof input.target !== 'string' || !input.target) problem('target', 'An exact retained answer target is required.');
    for (const field of Object.keys(input)) if (!['kind', 'target', 'presentation', 'referenceLifetime'].includes(field)) {
      problem(field, 'A present request accepts only an exact answer target, presentation choices and reference lifetime; it cannot include Lens or subject inputs.');
    }
  } else if (Object.hasOwn(input, 'target')) problem('target', 'An answer target requires a present request.');
  const choice = input.presentation as Record<string, ParameterValue> | undefined;
  if (!choice || typeof choice !== 'object' || Array.isArray(choice)) problem('presentation', 'Presentation choices must be an object.');
  else {
    const allowed = present ? ['format', 'sourceDetail', 'after', 'revisionPage'] : ['format', 'sourceDetail'];
    for (const field of Object.keys(choice)) if (!allowed.includes(field)) problem('presentation', `Unsupported presentation choice: ${field}.`);
    if (choice.format !== undefined && (typeof choice.format !== 'string' || !['unicode', 'json'].includes(choice.format))) problem('presentation', 'Format must be unicode or json.');
    if (choice.sourceDetail !== undefined && typeof choice.sourceDetail !== 'boolean') problem('presentation', 'Source detail must be a boolean.');
    if (present && choice.after !== undefined && (typeof choice.after !== 'string' || !/^investigram-[a-f0-9]{8,64}$/.test(choice.after))) problem('presentation', 'Association continuation must be a displayed investigram reference.');
    if (present && choice.revisionPage !== undefined && (typeof choice.revisionPage !== 'number' || !Number.isSafeInteger(choice.revisionPage) || choice.revisionPage < 1)) problem('presentation', 'Revision page must be a positive safe integer.');
  }
  if (!present && (input.after !== undefined || input.revisionPage !== undefined)) problem('presentation', 'Paging requires present with an exact answer reference; fresh Lens requests select an answer anew.');
  const suppliedLens = input.lens;
  const effectiveLens = typeof suppliedLens === 'string' && Object.hasOwn(commandLenses, suppliedLens) ? commandLenses[suppliedLens as CommandLens] : suppliedLens;
  if (!present && !problems.some(problem => problem.omittedField === 'lens')
    && (typeof effectiveLens !== 'string' || effectiveLens !== 'usage' && !Object.hasOwn(catalog, effectiveLens))) {
    const supplied = Object.hasOwn(input, 'lens');
    problems.push({ field: 'lens', reason: supplied ? 'The supplied name does not identify a registered Lens or report.' : 'A Lens or report name must be supplied.',
      representation: supplied ? 'preserved' : 'absent' });
  }
  const designationFields = [
    { field: 'selector', required: !present, valid: (value: ParameterValue) => value === null || typeof value === 'string', reason: 'A selector must be supplied as a string or null (no selector).' },
    { field: 'reference', required: false, valid: (value: ParameterValue) => typeof value === 'boolean', reason: 'Reference designation must be a boolean.' },
    { field: 'subject', required: false, valid: (value: ParameterValue) => value === 'project' || value === 'repository', reason: 'Subject must be project or repository.' },
    { field: 'referenceLifetime', required: false, valid: (value: ParameterValue) => value === 'session' || value === 'command', reason: 'Reference lifetime must be session or command.' },
  ];
  for (const { field, required, valid, reason } of designationFields) {
    if (problems.some(problem => problem.omittedField === field)) continue;
    const supplied = Object.hasOwn(input, field);
    if (supplied ? !valid(input[field]!) : required) {
      problems.push({ field, reason, representation: supplied ? 'preserved' : 'absent' });
    }
  }
  if (problems.length) {
    const presentation = input.presentation as unknown as Presentation | undefined;
    return { input: null, normalized: freezeOwned({ kind: 'rejected', input, problems,
      presentation: { format: presentation?.format === 'json' ? 'json' : 'unicode', sourceDetail: false },
      referenceLifetime: input.referenceLifetime === 'command' ? 'command' : 'session' }) };
  }
  input.presentation = { ...choice, format: choice!.format ?? 'unicode', sourceDetail: choice!.sourceDetail ?? false };
  const snapshot = freezeOwned(input) as unknown as ViewRequest;
  return { input: snapshot, normalized: normalizeCapturedRequest(snapshot, catalog) };
}

/** Interface spellings never become semantic Lens parameters. */
export function normalizeRequest(request: ViewRequest): NormalizedRequest {
  return captureRequest(request).normalized;
}

function normalizeCapturedRequest(request: ViewRequest, catalog: Readonly<Record<string, LensDefinition>>): NormalizedRequest {
  const effective = { format: request.presentation.format ?? 'unicode', sourceDetail: request.presentation.sourceDetail ?? false };
  if (request.kind === 'present') return freezeOwned({ kind: 'present', target: request.target,
    presentation: { ...effective, ...(request.presentation.after === undefined ? {} : { after: request.presentation.after }),
      ...(request.presentation.revisionPage === undefined ? {} : { revisionPage: request.presentation.revisionPage }) },
    referenceLifetime: request.referenceLifetime ?? 'session' });
  const choices: RequestChoices = { presentation: { ...effective,
    ...(request.after === undefined ? {} : { after: request.after }),
    ...(request.revisionPage === undefined ? {} : { revisionPage: request.revisionPage }) },
    referenceLifetime: request.referenceLifetime ?? 'session' };
  if (request.lens === 'usage') {
    const parameters = request.parameters;
    const extra = request.selector !== null || request.subject !== undefined || request.reference === true
      || parameters !== undefined && (!parameters || typeof parameters !== 'object' || Array.isArray(parameters) || Object.keys(parameters).length > 0);
    return freezeOwned({ ...choices, kind: 'report', report: 'usage', ...(extra ? { suppliedInputs: {
      selector: request.selector, ...(request.subject === undefined ? {} : { subject: request.subject }),
      ...(request.reference === undefined ? {} : { reference: request.reference }),
      ...(parameters === undefined ? {} : { parameters }),
    } } : {}) });
  }
  const id = Object.hasOwn(commandLenses, request.lens) ? commandLenses[request.lens as CommandLens] : request.lens as LensId;
  const definition = Object.hasOwn(catalog, id) ? catalog[id] : undefined;
  if (!definition) throw new Error('Unknown Lens definition');
  const designation: SubjectDesignation = request.selector !== null
    ? { kind: request.reference === true ? 'reference' : 'name', value: request.selector }
    : request.subject !== undefined ? { kind: request.subject === 'project' ? 'configured-project' : 'repository' }
      : { kind: definition.cardinality === 'population' ? 'default' : 'missing' };
  return freezeOwned(structuredClone({ ...choices, kind: 'lens', lens: definition.id, question: definition.question,
    designation, parameters: request.parameters === undefined ? {} : request.parameters, programInput: 'session-configured-project' }));
}

export function invalidParameters(request: NormalizedRequest, catalog: Readonly<Record<string, LensDefinition>> = lenses): string | null {
  if (request.kind !== 'lens') return null;
  if (!request.parameters || typeof request.parameters !== 'object' || Array.isArray(request.parameters) || Object.getPrototypeOf(request.parameters) !== Object.prototype) return 'Lens parameters must be an object.';
  const unexpected = Object.keys(request.parameters).filter(key => !Object.hasOwn(catalog[request.lens]!.parameters, key));
  return unexpected.length ? `Lens ${request.lens} declares no parameters; unexpected: ${unexpected.join(', ')}.` : null;
}

/** Reject designation modes whose incompatibility is known without subject lookup. */
export function invalidDesignation(request: NormalizedRequest, supplied: LensViewRequest, catalog: Readonly<Record<string, LensDefinition>> = lenses): string | null {
  if (request.kind !== 'lens') return null;
  const definition = catalog[request.lens]!;
  if (supplied.subject !== undefined && supplied.selector !== null) return 'Supply either a selector or a project/repository subject, not both.';
  if (request.designation.kind === 'missing') return `Lens ${definition.id} requires a subject designation.`;
  if (request.designation.kind === 'configured-project' || request.designation.kind === 'repository') {
    if (!definition.subjects.includes(request.designation.kind)) return `Lens ${definition.id} does not apply to ${request.designation.kind}.`;
  }
  if ((request.designation.kind === 'name' || request.designation.kind === 'reference') && definition.cardinality === 'population') {
    return `Lens ${definition.id} requires a project or repository subject, not a selector.`;
  }
  if (request.designation.kind === 'name' && !definition.subjects.some(kind => kind === 'module' || kind === 'group')) {
    return `Lens ${definition.id} requires a precise investigram reference; investigrams cannot be designated by name.`;
  }
  return null;
}

export function invalidReportInputs(request: NormalizedRequest): string | null {
  return request.kind === 'report' && request.suppliedInputs
    ? 'Usage is subjectless and accepts no selector, subject, reference designation, or nonempty parameters.' : null;
}
