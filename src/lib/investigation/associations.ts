import { freezeOwned } from '../immutable.js';
import { identityReference, methods, recordId } from '../identity.js';
import { inlineText } from '../terminal-text.js';
import type { ProgramRecordStore, RecordId, SessionId } from '../records.js';
import type { Investigram } from './contracts.js';

/** Association roles are explicit; originating context and evidence mentions do not add matches. */
export function associatedInvestigrams(store: ProgramRecordStore, session: SessionId, subjects: readonly RecordId[]): Investigram[] {
  const selected = new Set(subjects);
  return store.investigations(session).flatMap(item => item.investigrams).map(id => store.get(id))
    .filter((item): item is Investigram => item.kind === 'investigram' && item.associations.some(item => selected.has(item.subject)));
}

export function associatedView(store: ProgramRecordStore, session: SessionId, subjects: readonly RecordId[], after?: string,
  lifetime: 'session' | 'command' = 'session') {
  const matches = associatedInvestigrams(store, session, subjects);
  const refs = store.entityIds(matches.map(item => item.id), 'investigram');
  const index = after === undefined ? -1 : matches.findIndex(item => refs.get(item.id) === after);
  const valid = after === undefined || index >= 0;
  let remaining = 55_000;
  const items = (valid ? matches.slice(index + 1, index + 25) : []).map(account => {
    const provenance = store.get(account.provenance);
    if (provenance.kind !== 'investigation-provenance') throw new Error('Expected investigation provenance');
    const detail = { prose: account.prose.slice(0, 400), omittedProseCharacters: Math.max(0, account.prose.length - 400),
      qualifications: account.qualifications, associations: account.associations.filter(item => subjects.includes(item.subject)),
      evidence: account.evidence, operation: provenance.request.operation, subject: provenance.request.subject,
      origin: provenance.agent.origin, provenance: provenance.id };
    const size = JSON.stringify(detail).length;
    const included = size <= remaining;
    if (included) remaining -= size;
    return { id: account.id, reference: refs.get(account.id)!, detail: included ? detail : null,
      omissions: included ? [] : ['Account detail exceeds listing bounds; inspect its reference for complete qualification.'] };
  });
  const omitted = valid ? Math.max(0, matches.length - (index + 1) - items.length) : matches.length;
  return freezeOwned({ subjects, after: after ?? null, status: valid ? 'available' as const : 'unknown-continuation' as const,
    total: matches.length, items, omitted, next: omitted && items.length ? items.at(-1)!.reference : null, referenceLifetime: lifetime,
    limitations: ['Retained interpretations selected through explicit associations; session history can add accounts. Absence of an association does not establish absence of functionality.',
      'Listing order does not establish authority. Originals are shown; correction-aware selection and derived revision warnings are not yet presented.'] });
}
export type AssociatedInvestigations = ReturnType<typeof associatedView>;

/** Extend only declared subject inspection. Mechanical content remains its original snapshot. */
export function withAssociatedInvestigations<T extends { readonly id: RecordId; readonly projection: { readonly id: RecordId; readonly session: SessionId } }>(
  view: T, investigations: AssociatedInvestigations): T & { readonly investigations: AssociatedInvestigations } {
  const session = view.projection.session;
  const projection = { ...view.projection, id: recordId(session, 'associated-inspection-projection', [methods.investigationPresentation,
    identityReference(session, view.projection.id), investigations.subjects.map(id => identityReference(session, id)),
    investigations.items.map(item => identityReference(session, item.id)), investigations.total, investigations.omitted, investigations.status]) };
  return freezeOwned({ ...view, projection, investigations,
    id: recordId(session, 'associated-inspection-view', [methods.investigationPresentation, identityReference(session, view.id), identityReference(session, projection.id)]) });
}
export function renderAssociatedInvestigations(value: AssociatedInvestigations | undefined): string {
  if (!value) return '';
  const lines = ['\nAssociated investigrams (explicit associations)', `Listing: ${value.status}; ${value.items.length} shown of ${value.total}.`,
    value.referenceLifetime === 'command' ? 'References expire when this command ends.' : 'Use inspect @reference for retained content; no inference.'];
  for (const item of value.items) {
    lines.push(`@${item.reference} · interpretation`);
    if (item.detail) {
      lines.push(`  ${inlineText(item.detail.prose)}${item.detail.omittedProseCharacters ? ` [${item.detail.omittedProseCharacters} prose characters omitted]` : ''}`,
        `  Operation: ${item.detail.operation}; origin: ${item.detail.origin}; provenance: ${item.detail.provenance}`,
        ...item.detail.qualifications.map(text => `  Qualification: ${inlineText(text)}`),
        ...item.detail.associations.map(association => `  Association: ${association.subject} (${association.role}); ${association.qualifications.map(inlineText).join('; ')}; evidence: ${association.evidence.join(', ')}`));
    }
    lines.push(...item.omissions.map(inlineText));
  }
  if (value.next) lines.push(`${value.omitted} later accounts omitted. Continue this inspection with --after @${value.next}.`);
  lines.push(...value.limitations);
  return `${lines.join('\n')}\n`;
}
