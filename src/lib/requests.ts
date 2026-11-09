import { captureFields, normalizeInformation, invalidParameters as semanticParameters, invalidDesignation as semanticDesignation, invalidReportInputs as semanticReportInputs } from './application/requests.js';
import { freezeOwned } from './immutable.js';
import type { Presentation } from './presentation.js';

export { lenses } from './application/lenses.js';
export type { PublicLensId, LensId, SubjectKind, SubjectDesignation, ParameterValue, ResultContract, LensDefinition } from './application/lenses.js';
import { lenses } from './application/lenses.js';
import type { LensId, LensDefinition, SubjectDesignation, ParameterValue } from './application/lenses.js';

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

/** Capture before any asynchronous work; only known input defects become refusals. */
export function captureRequest(request: ViewRequest, catalog: Readonly<Record<string, LensDefinition>> = lenses): CapturedRequest {
  const captured = captureFields(request);
  const input = { ...captured.input }, problems: RejectedInputProblem[] = [...captured.problems];
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
    const allowed = present ? ['format', 'moreDetails', 'after', 'revisionPage'] : ['format', 'moreDetails'];
    for (const field of Object.keys(choice)) if (!allowed.includes(field)) problem('presentation', `Unsupported presentation choice: ${field}.`);
    if (choice.format !== undefined && (typeof choice.format !== 'string' || !['unicode', 'json'].includes(choice.format))) problem('presentation', 'Format must be unicode or json.');
    if (choice.moreDetails !== undefined && typeof choice.moreDetails !== 'boolean') problem('presentation', 'More details must be a boolean.');
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
      presentation: { format: presentation?.format === 'json' ? 'json' : 'unicode', moreDetails: false },
      referenceLifetime: input.referenceLifetime === 'command' ? 'command' : 'session' }) };
  }
  input.presentation = { ...choice, format: choice!.format ?? 'unicode', moreDetails: choice!.moreDetails ?? false };
  const snapshot = freezeOwned(input) as unknown as ViewRequest;
  return { input: snapshot, normalized: normalizeCapturedRequest(snapshot, catalog) };
}

/** Interface spellings never become semantic Lens parameters. */
export function normalizeRequest(request: ViewRequest): NormalizedRequest {
  return captureRequest(request).normalized;
}

function normalizeCapturedRequest(request: ViewRequest, catalog: Readonly<Record<string, LensDefinition>>): NormalizedRequest {
  const effective = { format: request.presentation.format ?? 'unicode', moreDetails: request.presentation.moreDetails ?? false };
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
      : { kind: 'default' };
  return freezeOwned({ ...choices, ...normalizeInformation(id, designation, request.parameters === undefined ? {} : request.parameters, catalog) });
}

export function invalidParameters(request: NormalizedRequest, catalog: Readonly<Record<string, LensDefinition>> = lenses): string | null {
  return semanticParameters(request, catalog);
}
export function invalidDesignation(request: NormalizedRequest, supplied: LensViewRequest, catalog: Readonly<Record<string, LensDefinition>> = lenses): string | null {
  return semanticDesignation(request, catalog, supplied.subject !== undefined && supplied.selector !== null);
}
export function invalidReportInputs(request: NormalizedRequest): string | null {
  return semanticReportInputs(request, request.kind === 'report' && !!request.suppliedInputs);
}
