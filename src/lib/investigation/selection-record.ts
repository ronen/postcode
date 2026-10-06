import type { ProgramRecord, RecordContext, RecordId, SessionId } from '../records.js';
import type { InvestigationSelection } from './evaluation.js';
import type { RevisionSnapshot } from './revisions.js';
import { identityReference } from '../identity.js';

export type InvestigationLens = 'summarize' | 'explain' | 'decompose' | 'examine' | 'inspect' | 'children' | 'parents';
export const investigationOperations = { summarize: 'functionality', explain: 'clarification', decompose: 'decomposition', examine: 'examination' } as const;
export type SelectionSelector = null | { readonly literal: string } | { readonly reference: RecordId } | { readonly unresolvedReference: string };
export interface SelectionRelation { readonly original: RecordId; readonly account: RecordId }
export interface AccountNavigation {
  readonly account: RecordId;
  readonly compositionParent: RecordId | null;
  readonly investigationSubject: RecordId;
}
interface SelectionContent extends RecordContext {
  readonly kind: 'investigation-selection-projection';
  readonly lens: InvestigationLens;
  readonly selector: SelectionSelector;
  readonly subjects: readonly RecordId[];
  readonly status: 'selected' | 'ambiguous' | 'missing' | 'unsupported-subject-lens';
  readonly roots: readonly RecordId[];
  /** Incoming originals remain separate even when they choose the same account. */
  readonly relations: readonly SelectionRelation[];
  readonly displaced: readonly RecordId[];
  readonly navigation: readonly AccountNavigation[];
  readonly associated: readonly RecordId[];
  readonly revisions: readonly RevisionSnapshot[];
}
export type InvestigationSelectionProjection = SelectionContent & (
  | { readonly variant: 'request'; readonly unsupportedSubject: 'investigram' | 'program-subject' | null;
      readonly outcome: { readonly kind: 'evaluation'; readonly evaluation: RecordId }
        | { readonly kind: 'unavailable'; readonly value: NonNullable<InvestigationSelection['unavailable']> }
        | { readonly kind: 'no-evaluation' } }
  | { readonly variant: 'historical-inspection'; readonly lens: 'inspect' }
  | { readonly variant: 'associated-inspection'; readonly lens: 'inspect'; readonly mechanical: RecordId }
);
type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;
export type SelectionPayload = WithoutId<InvestigationSelectionProjection>;

type Kind = ProgramRecord['kind'];
const subjects: readonly Kind[] = ['module', 'group', 'investigram'];
/** One explicit inventory of reference positions for validation and identity.
 * Prose, selector literals, diagnostics and qualification strings remain literal. */
function mapReferences(value: SelectionPayload, ref: (id: RecordId, kinds: readonly Kind[] | null) => RecordId): SelectionPayload {
  const account = (id: RecordId) => ref(id, ['investigram']);
  return { ...value, session: ref(value.session, ['session']) as SessionId,
    selector: value.selector && 'reference' in value.selector ? { reference: ref(value.selector.reference, subjects) } : value.selector,
    subjects: value.subjects.map(id => ref(id, subjects)), roots: value.roots.map(account),
    relations: value.relations.map(item => ({ original: account(item.original), account: account(item.account) })),
    displaced: value.displaced.map(account), associated: value.associated.map(account),
    navigation: value.navigation.map(item => ({ account: account(item.account),
      compositionParent: item.compositionParent === null ? null : account(item.compositionParent),
      investigationSubject: ref(item.investigationSubject, ['module', 'investigram']) })),
    revisions: value.revisions.map(item => ({ ...item, original: account(item.original), primary: account(item.primary), familyPrimary: account(item.familyPrimary),
      rows: item.rows.map(row => ({ ...row, correction: ref(row.correction, ['investigram-correction']), target: account(row.target),
        replacement: account(row.replacement), reporter: account(row.reporter),
        cause: row.cause ? { ...row.cause, via: row.cause.via.map(account) } : null })),
      inconsistencies: item.inconsistencies.map(inconsistency => ({ ...inconsistency, reporter: account(inconsistency.reporter),
        targets: inconsistency.targets.map(account), evidence: inconsistency.evidence.map(id => ref(id, null)) })) })),
    ...(value.variant === 'associated-inspection' ? { mechanical: ref(value.mechanical, ['projection', 'organization-projection']) } : {}),
    ...(value.variant === 'request' && value.outcome.kind === 'evaluation'
      ? { outcome: { kind: 'evaluation' as const, evaluation: ref(value.outcome.evaluation, ['investigation-evaluation']) } } : {}),
  };
}

export function selectionIdentity(payload: SelectionPayload): unknown {
  const { id: _id, ...semantic } = payload as SelectionPayload & { readonly id?: RecordId };
  return mapReferences(semantic, id => identityReference(payload.session, id) as RecordId);
}

export function selectionReferences(payload: SelectionPayload): readonly { readonly id: RecordId; readonly kinds: readonly Kind[] | null }[] {
  const references: { id: RecordId; kinds: readonly Kind[] | null }[] = [];
  mapReferences(payload, (id, kinds) => { references.push({ id, kinds }); return id; });
  return references;
}

export function selectionStatus(subjects: readonly RecordId[], unsupported?: string): InvestigationSelectionProjection['status'] {
  return unsupported ? 'unsupported-subject-lens' : subjects.length === 1 ? 'selected' : subjects.length ? 'ambiguous' : 'missing';
}
