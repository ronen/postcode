import { freezeOwned } from '../immutable.js';
import type { RecordId, SessionId } from '../records.js';
import type { AccountContext, ContextDelivery, ContextPart, Correction, InvestigationHistory } from './contracts.js';

const allParts: readonly ContextPart[] = ['prose', 'referent', 'qualifications'];

/** Exposure is recorded only for responses the coordinator dispatches, never agent declarations. */
export class InvestigationContext {
  readonly deliveries: ContextDelivery[] = [];
  readonly #parts = new Map<RecordId, Set<ContextPart>>();
  readonly #corrections = new Map<RecordId, Correction>();
  constructor(readonly history: InvestigationHistory, readonly session: SessionId) {}

  prepare(subject: RecordId, parts: readonly ContextPart[] = allParts, excerptCharacters?: number,
    limits = { accounts: 24, characters: 60_000 }, revisionPage = 1): ContextDelivery {
    const accounts: AccountContext[] = [], corrections: Correction[] = [];
    const pending = [subject], seen = new Set<RecordId>(), correctionIds = new Set<RecordId>();
    const omittedAccounts: RecordId[] = [], omittedCorrections: RecordId[] = [];
    let remaining = limits.characters;
    while (pending.length) {
      const id = pending.shift()!;
      if (seen.has(id)) continue;
      seen.add(id);
      const account = this.history.get(id);
      if (!account || account.session !== this.session) { omittedAccounts.push(id); continue; }
      if (accounts.length >= limits.accounts) { omittedAccounts.push(id); continue; }
      const incoming = this.history.corrections(id);
      if (incoming.some(item => item.target !== id)) throw new Error('Invalid retained incoming correction');
      let revision = this.history.revision?.(id, id === subject ? revisionPage : 1);
      // Expand the requested account's cause/alternative page once. Automatically
      // included account bodies carry a revision summary and an explicit page-1
      // continuation, avoiding quadratic repetition of the same family/causes.
      if (revision && id !== subject) revision = { ...revision, rows: [], omittedRows: revision.total,
        inconsistencies: [], omittedInconsistencyReporters: revision.inconsistencies.map(item => item.reporter),
        nextPage: revision.total || revision.inconsistencyCount ? 1 : null };
      if (revision) {
        const omittedInconsistencyReporters: RecordId[] = [...(revision.omittedInconsistencyReporters ?? [])];
        const inconsistencies = revision.inconsistencies.filter(item => {
          const size = JSON.stringify(item).length;
          if (size > remaining) { omittedInconsistencyReporters.push(item.reporter); return false; }
          remaining -= size; return true;
        });
        revision = { ...revision, inconsistencies, omittedInconsistencyReporters };
      }
      const revisionLinks = revision ? [...revision.rows.map(row => this.history.correction(row.correction)!).filter(Boolean), ...(id !== subject ? incoming.slice(0, 1) : [])] : incoming;
      const related = [...new Map([...revisionLinks, ...account.corrections.slice(((id === subject ? revisionPage : 1) - 1) * 24, (id === subject ? revisionPage : 1) * 24).map(id => {
        const correction = this.history.correction(id);
        if (!correction) throw new Error('Missing retained accompanying correction');
        return correction;
      })].map(item => [item.id, item])).values()];
      for (const correction of related) {
        if (correction.session !== this.session) throw new Error('Invalid retained correction context');
        pending.push(correction.target, correction.replacement);
        if (correctionIds.has(correction.id)) continue;
        correctionIds.add(correction.id);
        const size = JSON.stringify(correction).length;
        if (size > remaining) omittedCorrections.push(correction.id);
        else { corrections.push(correction); remaining -= size; }
      }
      const provenance = this.history.provenance(account.provenance);
      if (!provenance || provenance.session !== this.session) throw new Error('Missing retained investigation provenance');
      // Earlier delivery payloads are not recursively embedded in later contexts.
      const { deliveries: _deliveries, ...origin } = provenance;
      const completeParts: ContextPart[] = [], omissions: string[] = [];
      if (revision?.omittedRows) omissions.push('Revision details omitted for automatically included account; retrieve this account at revisionPage 1.');
      if (revision?.omittedInconsistencyReporters?.length) omissions.push('Incoming inconsistency content omitted by character bound; retrieve reporting account qualifications.');
      const nextCorrectionPage = account.corrections.length > (id === subject ? revisionPage : 1) * 24 ? (id === subject ? revisionPage : 1) + 1 : null;
      if (nextCorrectionPage) omissions.push(`Accompanying corrections omitted; retrieve this account with revisionPage ${nextCorrectionPage}.`);
      const values: { prose?: string; referent?: NonNullable<AccountContext['referent']>; qualifications?: readonly string[];
        associations?: NonNullable<AccountContext['associations']>; inconsistencies?: NonNullable<AccountContext['inconsistencies']> } = {};
      for (const part of parts) {
        const original = account[part];
        const value = part === 'prose' && excerptCharacters !== undefined ? account.prose.slice(0, excerptCharacters) : original;
        const size = JSON.stringify(value).length + (part === 'qualifications' ? JSON.stringify([account.associations, account.inconsistencies]).length : 0);
        if (size > remaining) { omissions.push(`${part} omitted by context bound; request that part separately.`); continue; }
        remaining -= size;
        Object.assign(values, { [part]: value });
        if (part === 'qualifications') { values.associations = account.associations; values.inconsistencies = account.inconsistencies; }
        if (part !== 'prose' || value === original) completeParts.push(part);
        else omissions.push('Prose excerpt is incomplete; retrieve full prose for correction eligibility.');
      }
      for (const part of allParts) if (!parts.includes(part)) omissions.push(`${part} not requested.`);
      accounts.push({ id, status: 'prior-interpretation', ...values, completeParts,
        evidence: account.evidence, originatingModule: account.originatingModule, children: account.children,
        ...(revision ? { revision } : {}), nextCorrectionPage, provenance: origin, corrections: related.map(item => item.id),
        revisionNotices: related.map(({ id, target, replacement }) => ({ id, target, replacement })), omissions });
    }
    return freezeOwned(structuredClone({ requested: subject, accounts, corrections, omittedAccounts, omittedCorrections,
      limitations: ['Prior interpretations are not independent corroboration. Delivery does not establish comprehension.',
        'Correction references denote revisions, including competing alternatives; exact originals are preserved. Revision rows are bounded; use investigram(subject, revisionPage: nextPage) for further relationships/causes. Retrieve cause targets, replacements and proximal citations for full context. Reference-only revision metadata does not supply account content or complete correction context.',
        ...(omittedAccounts.length || omittedCorrections.length ? ['Correction context is incomplete. Retrieve omitted account or correction-target references separately.'] : [])] }));
  }

  list(subject: RecordId, cursor?: RecordId): ContextDelivery {
    const ids = this.history.associated?.(subject);
    const start = cursor === undefined ? 0 : (ids?.indexOf(cursor) ?? -1) + 1;
    const valid = ids !== undefined && (cursor === undefined || start > 0);
    const selected = valid ? ids.slice(start, start + 24) : [];
    return freezeOwned({ requested: subject, accounts: [], corrections: [], omittedAccounts: [], omittedCorrections: [],
      ...(valid ? { listing: { subject, selected, total: ids.length, next: start + selected.length < ids.length ? selected.at(-1)! : null } } : {}),
      limitations: [valid ? 'Explicit subject associations in retention order, not authority or corroboration. Bare references do not supply account content; request investigram for qualified content and correction context.'
        : 'Unavailable association listing: unsupported subject or invalid continuation.'],
    });
  }

  supplied(delivery: ContextDelivery): void {
    this.deliveries.push(delivery);
    for (const account of delivery.accounts) {
      for (const inconsistency of account.revision?.inconsistencies ?? []) {
        if (!this.#parts.has(inconsistency.reporter)) this.#parts.set(inconsistency.reporter, new Set());
      }
      // Metadata such as evidence links, provenance or a bare identifier alone is not exposure.
      if (!account.prose?.trim() && account.referent === undefined && account.qualifications === undefined) continue;
      const parts = this.#parts.get(account.id) ?? new Set<ContextPart>();
      for (const part of account.completeParts) parts.add(part);
      this.#parts.set(account.id, parts);
    }
    for (const correction of delivery.corrections) {
      this.#corrections.set(correction.id, correction);
      // Reasons and qualifications are substantive accompanying content of the
      // reporter. Exposure does not imply delivery of that account's own fields.
      if (!this.#parts.has(correction.reporter)) this.#parts.set(correction.reporter, new Set());
    }
  }
  get citations(): readonly RecordId[] { return [...this.#parts.keys()]; }
  get completeTargets(): readonly RecordId[] { return [...this.#parts].filter(([, parts]) => allParts.every(part => parts.has(part))).map(([id]) => id); }
  get completeCorrections(): readonly RecordId[] {
    const complete = new Set(this.completeTargets);
    return [...this.#corrections.values()].filter(item => complete.has(item.target) && complete.has(item.replacement)).map(item => item.id);
  }
}
