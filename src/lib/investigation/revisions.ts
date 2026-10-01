import type { ProgramRecordStore, RecordId, SessionId } from '../records.js';
import type { Correction, Investigram, InvestigationProvenance, Inconsistency } from './contracts.js';

export interface RevisionRow {
  readonly correction: RecordId;
  readonly target: RecordId;
  readonly replacement: RecordId;
  readonly reporter: RecordId;
  readonly relationship: boolean;
  readonly cause: null | { readonly direct: boolean; readonly via: readonly RecordId[]; readonly omittedVia: number };
}
export interface RevisionStatus {
  readonly original: RecordId;
  readonly primary: RecordId;
  readonly familyPrimary: RecordId;
  readonly superseded: boolean;
  readonly conflicting: boolean;
  readonly needsReconsideration: boolean;
  readonly causeCount: number;
  readonly page: number;
  readonly total: number;
  readonly nextPage: number | null;
  readonly rows: readonly RevisionRow[];
  readonly omittedRows?: number;
  readonly inconsistencies: readonly (Inconsistency & { readonly reporter: RecordId; readonly ordinal: number })[];
  readonly inconsistencyCount: number;
  readonly omittedInconsistencyReporters?: readonly RecordId[];
}

/** A derived snapshot. Retention order supplies recency; same-result array order
 * is the stable tie-break. No retained interpretation or citation is modified. */
export class InvestigationRevisions {
  readonly corrections: readonly Correction[];
  readonly accounts: ReadonlyMap<RecordId, Investigram>;
  readonly incoming = new Map<RecordId, Correction[]>();
  readonly outgoing = new Map<RecordId, Correction[]>();
  readonly #inconsistencies = new Map<RecordId, (Inconsistency & { reporter: RecordId; ordinal: number })[]>();
  readonly #affected = new Map<RecordId, Set<RecordId>>();
  readonly #origins: ReadonlyMap<RecordId, InvestigationProvenance>;
  readonly #rank: ReadonlyMap<RecordId, number>;
  constructor(accounts: readonly Investigram[], corrections: readonly Correction[], origins: readonly InvestigationProvenance[]) {
    this.corrections = [...corrections];
    this.accounts = new Map(accounts.map(item => [item.id, item]));
    this.#origins = new Map(origins.map(item => [item.id, item]));
    this.#rank = new Map(corrections.map((item, index) => [item.id, index]));
    for (const account of accounts) account.inconsistencies.forEach((item, ordinal) => {
      for (const target of new Set(item.targets)) {
        const list = this.#inconsistencies.get(target) ?? [];
        list.push({ ...item, reporter: account.id, ordinal }); this.#inconsistencies.set(target, list);
      }
    });
    const citers = new Map<RecordId, RecordId[]>();
    for (const account of accounts) for (const cited of this.#origin(account).citations) {
      const items = citers.get(cited) ?? []; items.push(account.id); citers.set(cited, items);
    }
    for (const correction of corrections) {
      const incoming = this.incoming.get(correction.replacement) ?? [];
      incoming.push(correction); this.incoming.set(correction.replacement, incoming);
      const outgoing = this.outgoing.get(correction.target) ?? [];
      outgoing.push(correction); this.outgoing.set(correction.target, outgoing);
      const affected = new Set<RecordId>(), queue = [correction.target], visited = new Set<RecordId>();
      for (let index = 0; index < queue.length; index++) {
        const cited = queue[index]!;
        if (visited.has(cited)) continue;
        visited.add(cited);
        for (const id of citers.get(cited) ?? []) {
          const origin = this.#origin(this.accounts.get(id)!);
          if (origin.id === correction.provenance || origin.completeCorrections.includes(correction.id)) continue;
          if (!affected.has(id)) { affected.add(id); queue.push(id); }
        }
      }
      this.#affected.set(correction.id, affected);
    }
  }
  #origin(account: Investigram): InvestigationProvenance {
    const origin = this.#origins.get(account.provenance);
    if (!origin) throw new Error('Missing revision provenance');
    return origin;
  }
  /** Domain traversal visits each correction once, never enumerating paths. */
  #links(id: RecordId, family: boolean): Correction[] {
    const queue = [id], seen = new Set<RecordId>(), links = new Map<RecordId, Correction>();
    for (let index = 0; index < queue.length; index++) {
      const current = queue[index]!;
      if (seen.has(current)) continue;
      seen.add(current);
      for (const link of [...(this.outgoing.get(current) ?? []), ...(family ? this.incoming.get(current) ?? [] : [])]) {
        links.set(link.id, link); queue.push(link.replacement); if (family) queue.push(link.target);
      }
    }
    return [...links.values()].sort((a, b) => this.#rank.get(a.id)! - this.#rank.get(b.id)!);
  }
  primary(id: RecordId): RecordId { return this.#links(id, false).at(-1)?.replacement ?? id; }
  status(id: RecordId, page = 1): RevisionStatus {
    const account = this.accounts.get(id);
    if (!account) throw new Error('Revision status requires an investigram');
    const family = this.#links(id, true), familyIds = new Set(family.map(item => item.id));
    const causes = this.corrections.filter(item => this.#affected.get(item.id)!.has(id));
    const causeIds = new Set(causes.map(item => item.id));
    const rows = this.corrections.filter(item => familyIds.has(item.id) || causeIds.has(item.id));
    const targets = new Set<RecordId>();
    let conflicting = false;
    for (const link of family) { if (targets.has(link.target)) conflicting = true; targets.add(link.target); }
    const primary = this.primary(id);
    const start = (page - 1) * 24;
    const inconsistencies = this.#inconsistencies.get(id) ?? [];
    return { original: id, primary, familyPrimary: family.at(-1)?.replacement ?? id, superseded: primary !== id,
      conflicting, needsReconsideration: causes.length > 0, causeCount: causes.length, page, total: rows.length,
      inconsistencies: inconsistencies.slice(start, start + 24), inconsistencyCount: inconsistencies.length,
      nextPage: start + 24 < Math.max(rows.length, inconsistencies.length) ? page + 1 : null,
      rows: rows.slice(start, start + 24).map(item => {
        const citations = this.#origin(account).citations;
        const via = causeIds.has(item.id) ? citations.filter(cited => cited === item.target || this.#affected.get(item.id)!.has(cited)) : [];
        return { correction: item.id, target: item.target, replacement: item.replacement, reporter: item.reporter,
          relationship: familyIds.has(item.id), cause: causeIds.has(item.id) ? { direct: citations.includes(item.target), via: via.slice(0, 8), omittedVia: Math.max(0, via.length - 8) } : null };
      }) };
  }
}

export function sessionRevisions(store: ProgramRecordStore, session: SessionId): InvestigationRevisions {
  const evaluations = store.investigations(session);
  const accounts = evaluations.flatMap(item => item.investigrams).map(id => store.get(id)).filter((item): item is Investigram => item.kind === 'investigram');
  const corrections = evaluations.flatMap(item => item.corrections).map(id => store.get(id)).filter((item): item is Correction => item.kind === 'investigram-correction');
  const origins = [...new Set(accounts.map(item => item.provenance))].map(id => store.get(id)).filter((item): item is InvestigationProvenance => item.kind === 'investigation-provenance');
  return new InvestigationRevisions(accounts, corrections, origins);
}
