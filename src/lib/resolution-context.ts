import { identityReference } from './identity.js';
import { freezeOwned } from './immutable.js';
import { inlineText } from './terminal-text.js';
import type { RecordId, SessionId } from './records.js';
import type { SubjectDesignation } from './requests.js';
import type { SubjectResolution } from './subject-resolution.js';

/** Consequential lookup information supplied to arrangement, never retained in an answer. */
export interface ResolutionContext {
  readonly designation: SubjectDesignation;
  readonly subjects: readonly RecordId[];
  readonly criteria: readonly string[];
  readonly qualifications: readonly string[];
  readonly populations: readonly {
    readonly kind: 'evaluation' | 'organization-evaluation';
    readonly size: number;
    readonly applicability: string;
    readonly availability: string;
    readonly execution: string;
    readonly materialization: string;
    readonly reason: string | null;
  }[];
}

export function resolutionContext(designation: SubjectDesignation, resolution: SubjectResolution): ResolutionContext {
  return freezeOwned({ designation, subjects: resolution.candidates.map(item => item.id),
    criteria: resolution.criteria, qualifications: resolution.qualifications,
    populations: resolution.support.map(({ kind, population, applicability, availability, execution, materialization, reason }) =>
      ({ kind, size: population.length, applicability, availability, execution, materialization, reason })) });
}

export function resolutionContextIdentity(session: SessionId, context?: ResolutionContext): unknown {
  return context ? { ...context, subjects: context.subjects.map(id => identityReference(session, id)),
    designation: context.designation.kind === 'reference' ? { ...context.designation, value: identityReference(session, context.designation.value as RecordId) } : context.designation } : null;
}

export function lookupDescription(context: ResolutionContext | undefined, matches: number): string | null {
  const designation = context?.designation;
  if (!designation || !('value' in designation)) return null;
  return `${matches === 0 ? 'no exact match' : matches === 1 ? 'exact match' : 'exact matches'} for ${designation.kind === 'reference' ? '@' : ''}${inlineText(designation.value)}${designation.kind === 'reference' ? ' · current' : ''}`;
}
