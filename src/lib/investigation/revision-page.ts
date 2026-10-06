import type { RevisionSnapshot, RevisionStatus } from './revisions.js';

/** Existing CLI and investigator-context delivery policy, over a full domain snapshot. */
export function revisionPage(snapshot: RevisionSnapshot, page = 1): RevisionStatus {
  const start = (page - 1) * 24;
  const { rows: _rows, inconsistencies: _inconsistencies, ...status } = snapshot;
  return { ...status, page, total: snapshot.rows.length,
    inconsistencies: snapshot.inconsistencies.slice(start, start + 24), inconsistencyCount: snapshot.inconsistencies.length,
    nextPage: start + 24 < Math.max(snapshot.rows.length, snapshot.inconsistencies.length) ? page + 1 : null,
    rows: snapshot.rows.slice(start, start + 24).map(row => ({ ...row,
      cause: row.cause ? { direct: row.cause.direct, via: row.cause.via.slice(0, 8), omittedVia: Math.max(0, row.cause.via.length - 8) } : null })) };
}
