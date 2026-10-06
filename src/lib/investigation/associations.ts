import { revisionPage } from './revision-page.js';
import { resolveInvestigationContent } from './content.js';
import type { InvestigationProjectionContent } from './content.js';
import { selectAssociatedInspection } from './selection.js';
import { freezeOwned } from '../immutable.js';
import { identityReference, methods, recordId } from '../identity.js';
import { inlineText } from '../terminal-text.js';
import type { ProgramRecordStore, RecordId, SessionId } from '../records.js';

/** Pure listing arrangement over a retained full association population. */
export function arrangeAssociatedInvestigations(content: InvestigationProjectionContent, refs: ReadonlyMap<RecordId, string>, after?: string,
  lifetime: 'session' | 'command' = 'session') {
  const subjects = content.projection.subjects;
  const accounts = new Map(content.accounts.map(item => [item.id, item]));
  const origins = new Map(content.provenance.map(item => [item.id, item]));
  const revisions = new Map(content.projection.revisions.map(item => [item.original, item]));
  const matches = content.projection.associated.map(id => accounts.get(id)!);
  const index = after === undefined ? -1 : matches.findIndex(item => refs.get(item.id) === after);
  const valid = after === undefined || index >= 0;
  let remaining = 55_000;
  const items = (valid ? matches.slice(index + 1, index + 25) : []).map(account => {
    const provenance = origins.get(account.provenance)!;
    if (provenance.kind !== 'investigation-provenance') throw new Error('Expected investigation provenance');
    const revision = revisionPage(revisions.get(account.id)!);
    const detail = { revision, prose: account.prose.slice(0, 400), omittedProseCharacters: Math.max(0, account.prose.length - 400),
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
      'Listing order does not establish authority. Exact originals are shown with current revision status; inspect their references for correction reasons, alternatives, and paged causes.'] });
}
export type AssociatedInvestigations = ReturnType<typeof arrangeAssociatedInvestigations>;

/** Semantic continuation identity, resolved only within the frozen match population. */
export function associationContinuation(session: SessionId, matches: readonly RecordId[], refs: ReadonlyMap<RecordId, string>, after?: string | null) {
  if (after === undefined || after === null) return { none: true } as const;
  const matched = matches.find(id => refs.get(id) === after);
  return matched ? { reference: identityReference(session, matched) } : { literal: after };
}

/** Coordination preserves the all-match allocation after the mechanical View. */
export function createAssociatedInspectionView<T extends { readonly id: RecordId; readonly projection: { readonly id: RecordId; readonly session: SessionId } }>(
  store: ProgramRecordStore, view: T, subjects: readonly RecordId[], after?: string, lifetime: 'session' | 'command' = 'session') {
  const selection = selectAssociatedInspection(store, view.projection.id, subjects);
  const content = resolveInvestigationContent(store, selection);
  const references = store.entityIds(selection.associated, 'investigram');
  return arrangeAssociatedInspection(view, content, references, after, lifetime);
}

export function arrangeAssociatedInspection<T extends { readonly id: RecordId; readonly projection: { readonly id: RecordId; readonly session: SessionId } }>(
  view: T, content: InvestigationProjectionContent, references: ReadonlyMap<RecordId, string>, after?: string, lifetime: 'session' | 'command' = 'session') {
  const selection = content.projection;
  if (selection.variant !== 'associated-inspection' || selection.mechanical !== view.projection.id) throw new Error('Associated inspection requires its selected mechanical View');
  const session = selection.session;
  const investigations = arrangeAssociatedInvestigations(content, references, after, lifetime);
  const projection = { ...view.projection, id: selection.id };
  return freezeOwned({ ...view, projection, investigations,
    id: recordId(session, 'associated-inspection-view', [methods.investigationPresentation, identityReference(session, projection.id),
      identityReference(session, view.id), associationContinuation(session, selection.associated, references, after), lifetime]) });
}
export function renderAssociatedInvestigations(value: AssociatedInvestigations | undefined): string {
  if (!value) return '';
  const lines = ['\nAssociated investigrams (explicit associations)', `Listing: ${value.status}; ${value.items.length} shown of ${value.total}.`,
    value.referenceLifetime === 'command' ? 'References expire when this command ends.' : 'Use inspect @reference for retained content; no inference.'];
  if (value.status === 'unknown-continuation') lines.push('The supplied continuation reference is not in this listing. Inspect without --after to start from the first page.');
  for (const item of value.items) {
    lines.push(`@${item.reference} · interpretation`);
    if (item.detail) {
      lines.push(`  Revision: ${item.detail.revision.superseded ? 'superseded' : 'current original'}; ${item.detail.revision.conflicting ? 'unresolved conflicts; ' : ''}${item.detail.revision.needsReconsideration ? `needs reconsideration (${item.detail.revision.causeCount} causes); ` : ''}inspect this reference for details.`);
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
