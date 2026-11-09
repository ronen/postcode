import { freezeOwned } from '../immutable.js';
import { representationProblem } from './input.js';
import { lenses } from './lenses.js';
import type { LensDefinition, ParameterValue, SubjectDesignation } from './lenses.js';
import type { ModuleExpansion } from '../records.js';
import type { GroupExpansion } from '../organization/records.js';

export interface InformationRequirements {
  readonly modules: readonly ModuleExpansion[];
  readonly groups: readonly GroupExpansion[];
}
/** Names and opaque option values refer only to declarations captured at opening. */
export interface ConsumptionChoice {
  readonly presentations: readonly string[];
  readonly options: Readonly<Record<string, ParameterValue>>;
}
export interface ConsumptionRequirements {
  readonly requirements?: InformationRequirements;
  readonly consumption?: ConsumptionChoice;
}
export type ApplicationRequest = ConsumptionRequirements & (
  | { readonly kind: 'lens'; readonly lens: string; readonly designation: SubjectDesignation;
      readonly parameters?: Readonly<Record<string, ParameterValue>> }
  | { readonly kind: 'present'; readonly target: string }
  | { readonly kind: 'report'; readonly report: 'usage' }
);
export interface InputProblem {
  readonly field: string;
  readonly reason: string;
  readonly representation: 'preserved' | 'omitted' | 'absent';
  readonly omittedField?: string;
}
export interface RejectedInput {
  readonly kind: 'rejected';
  readonly input: Readonly<Record<string, ParameterValue>>;
  readonly problems: readonly InputProblem[];
}
export type SemanticRequest = ConsumptionRequirements & (
  | { readonly kind: 'lens'; readonly lens: string; readonly question: string; readonly designation: SubjectDesignation;
      readonly parameters: Readonly<Record<string, ParameterValue>>; readonly programInput: 'session-configured-project' }
  | { readonly kind: 'present'; readonly target: string }
  | { readonly kind: 'report'; readonly report: 'usage' }
  | RejectedInput
);

/** Safe ownership transfer, shared by interface adapters and the direct boundary. */
export function captureFields(value: unknown, field: 'request' | 'invocation' = 'request'): { readonly input: Readonly<Record<string, ParameterValue>>; readonly problems: readonly InputProblem[] } {
  const fields: [string, ParameterValue][] = [], problems: InputProblem[] = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
    return freezeOwned({ input: {}, problems: [{ field, reason: field === 'request' ? 'A request must be a plain object.' : 'An invocation attachment must be a plain object.', representation: 'omitted', ...(field === 'request' ? {} : { omittedField: field }) }] });
  }
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key === 'symbol') {
      problems.push({ field: '(symbol key)', reason: 'Symbol-keyed input cannot be represented in a request report.', representation: 'omitted' }); continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (!('value' in descriptor)) {
      problems.push({ field: key, reason: 'Accessor input cannot be captured without executing caller code.', representation: 'omitted', omittedField: key }); continue;
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
  return freezeOwned({ input: Object.fromEntries(fields), problems });
}

/** The catalog is the sole authority for question and normalized program-input meaning. */
export function normalizeInformation(lens: string, designation: SubjectDesignation,
  parameters: Readonly<Record<string, ParameterValue>>, catalog: Readonly<Record<string, LensDefinition>> = lenses): Extract<SemanticRequest, { kind: 'lens' }> {
  const definition = catalog[lens];
  if (!definition) throw new Error('Unknown Lens definition');
  return freezeOwned({ kind: 'lens', lens: definition.id, question: definition.question,
    designation: designation.kind === 'default' && definition.cardinality !== 'population' ? { kind: 'missing' } : designation,
    parameters, programInput: 'session-configured-project' });
}

export function captureApplicationRequest(value: unknown, catalog: Readonly<Record<string, LensDefinition>> = lenses): SemanticRequest {
  const captured = captureFields(value), input = captured.input, problems = [...captured.problems];
  const problem = (field: string, reason: string) => problems.push({ field, reason, representation: Object.hasOwn(input, field) ? 'preserved' : 'absent' });
  if (!['lens', 'present', 'report'].includes(input.kind as string)) problem('kind', 'Request kind must be lens, present or report.');
  const allowed = input.kind === 'lens' ? ['kind', 'lens', 'designation', 'parameters', 'requirements', 'consumption']
    : input.kind === 'present' ? ['kind', 'target', 'requirements', 'consumption'] : ['kind', 'report'];
  for (const field of Object.keys(input)) if (!allowed.includes(field)) problem(field, 'This field is not supported for the requested operation.');
  if (input.kind === 'lens') {
    if (typeof input.lens !== 'string' || !Object.hasOwn(catalog, input.lens)) problem('lens', 'The supplied name does not identify a registered Lens.');
    const designation = input.designation as Record<string, ParameterValue> | undefined;
    if (!designation || typeof designation !== 'object' || Array.isArray(designation)
      || !['default', 'configured-project', 'repository', 'missing', 'name', 'reference'].includes(designation.kind as string)
      || (designation.kind === 'name' || designation.kind === 'reference') && typeof designation.value !== 'string'
      || Object.keys(designation).some(key => !['kind', ...(['name', 'reference'].includes(designation.kind as string) ? ['value'] : [])].includes(key))) {
      problem('designation', 'Supply one explicit subject designation.');
    }
    if (input.parameters !== undefined && (!input.parameters || typeof input.parameters !== 'object' || Array.isArray(input.parameters))) problem('parameters', 'Lens parameters must be an object.');
  } else if (input.kind === 'present') {
    if (typeof input.target !== 'string' || !input.target) problem('target', 'An exact retained answer target is required.');
  } else if (input.kind === 'report' && input.report !== 'usage') problem('report', 'Only the subjectless usage report is supported.');
  if (input.requirements !== undefined) {
    const requirements = input.requirements as Record<string, ParameterValue>;
    if (!requirements || typeof requirements !== 'object' || Array.isArray(requirements)
      || !Array.isArray(requirements.modules) || !Array.isArray(requirements.groups)
      || Object.keys(requirements).some(key => !['modules', 'groups'].includes(key))
      || requirements.modules.some(item => !['exports', 'documentation', 'composition'].includes(item as string))
      || requirements.groups.some(item => item !== 'group-details')) problem('requirements', 'Unsupported information requirements.');
  }
  if (input.consumption !== undefined) {
    const consumption = input.consumption as Record<string, ParameterValue>;
    if (!consumption || typeof consumption !== 'object' || Array.isArray(consumption)
      || !Array.isArray(consumption.presentations) || consumption.presentations.some(item => typeof item !== 'string')
      || !consumption.options || typeof consumption.options !== 'object' || Array.isArray(consumption.options)
      || Object.keys(consumption).some(key => !['presentations', 'options'].includes(key))) problem('consumption', 'Supply captured Presentation names and plain option values.');
  }
  if (input.requirements !== undefined && input.consumption !== undefined) problem('requirements', 'Choose direct requirements or a captured Presentation.');
  if (problems.length) return freezeOwned({ kind: 'rejected', input, problems });
  const request = input as unknown as ApplicationRequest;
  return freezeOwned({ ...(request.kind === 'lens' ? normalizeInformation(request.lens, request.designation, request.parameters ?? {}, catalog) : request),
    ...(request.requirements ? { requirements: request.requirements } : {}), ...(request.consumption ? { consumption: request.consumption } : {}) });
}

/** Conflicting interface designations cannot be silently collapsed to one subject.
 * Adapters supply only these structural facts; semantic refusal policy lives here. */
export interface InputConstraints {
  readonly conflictingDesignation?: boolean;
  readonly reportHasInputs?: boolean;
}
export function invalidParameters(request: SemanticRequest, catalog: Readonly<Record<string, LensDefinition>> = lenses): string | null {
  if (request.kind !== 'lens') return null;
  if (!request.parameters || typeof request.parameters !== 'object' || Array.isArray(request.parameters) || Object.getPrototypeOf(request.parameters) !== Object.prototype) return 'Lens parameters must be an object.';
  const unexpected = Object.keys(request.parameters).filter(key => !Object.hasOwn(catalog[request.lens]!.parameters, key));
  return unexpected.length ? `Lens ${request.lens} declares no parameters; unexpected: ${unexpected.join(', ')}.` : null;
}
export function invalidDesignation(request: SemanticRequest, catalog: Readonly<Record<string, LensDefinition>> = lenses, conflict = false): string | null {
  if (request.kind !== 'lens') return null;
  const definition = catalog[request.lens]!;
  if (conflict) return 'Supply either a selector or a project/repository subject, not both.';
  if (request.designation.kind === 'missing') return `Lens ${definition.id} requires a subject designation.`;
  if (request.designation.kind === 'configured-project' || request.designation.kind === 'repository') {
    if (!definition.subjects.includes(request.designation.kind)) return `Lens ${definition.id} does not apply to ${request.designation.kind}.`;
  }
  if ((request.designation.kind === 'name' || request.designation.kind === 'reference') && definition.cardinality === 'population') return `Lens ${definition.id} requires a project or repository subject, not a selector.`;
  if (request.designation.kind === 'name' && !definition.subjects.some(kind => kind === 'module' || kind === 'group')) return `Lens ${definition.id} requires a precise investigram reference; investigrams cannot be designated by name.`;
  return null;
}
export function invalidReportInputs(request: SemanticRequest, supplied: boolean): string | null {
  return request.kind === 'report' && supplied ? 'Usage is subjectless and accepts no selector, subject, reference designation, or nonempty parameters.' : null;
}
