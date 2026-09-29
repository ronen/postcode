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
    limits = { accounts: 24, characters: 60_000 }): ContextDelivery {
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
      const related = [...new Map([...incoming, ...account.corrections.map(id => {
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
        provenance: origin, corrections: related.map(item => item.id),
        revisionNotices: related.map(({ id, target, replacement }) => ({ id, target, replacement })), omissions });
    }
    return freezeOwned(structuredClone({ requested: subject, accounts, corrections, omittedAccounts, omittedCorrections,
      limitations: ['Prior interpretations are not independent corroboration. Delivery does not establish comprehension.',
        'Correction references denote revisions, including competing alternatives; exact originals are preserved.',
        ...(omittedAccounts.length || omittedCorrections.length ? ['Correction context is incomplete. Retrieve omitted account or correction-target references separately.'] : [])] }));
  }

  supplied(delivery: ContextDelivery): void {
    this.deliveries.push(delivery);
    for (const account of delivery.accounts) {
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
