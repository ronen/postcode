import { canonical } from '../identity.js';
import type { ProgramRecordStore, RecordId } from '../records.js';
import type { InvestigationSelectionProjection } from './selection-record.js';
import { investigationOperations, selectionStatus } from './selection-record.js';

/** Structural invariants supplement the store's kind/session reference validation. */
export function validateInvestigationSelection(record: InvestigationSelectionProjection, get: ProgramRecordStore['get']): void {
  const unsupported = record.variant === 'request' ? record.unsupportedSubject ?? undefined : undefined;
  for (const ids of [record.subjects, record.displaced, record.associated]) {
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate investigation selection subject');
  }
  if (record.status !== selectionStatus(record.subjects, unsupported)) throw new Error('Invalid investigation selection status');
  if (record.selector && 'reference' in record.selector
    && (record.subjects.length !== 1 || record.subjects[0] !== record.selector.reference)) throw new Error('Invalid resolved selection reference');
  if (record.variant === 'request') {
    if (record.lens === 'inspect') throw new Error('Inspection requires the historical variant');
    if ((record.lens === 'children' || record.lens === 'parents') && unsupported !== 'investigram') throw new Error('Investigation children/parents requires an unsupported investigram subject');
    if (record.outcome.kind === 'no-evaluation' && record.status === 'selected') throw new Error('A selected operation subject requires an outcome');
    if (record.outcome.kind === 'unavailable' && Object.keys(record.outcome.value).some(key => !['kind', 'code', 'diagnostic'].includes(key))) throw new Error('Unavailable selection cannot retain provider reporting');
    if (record.associated.length) throw new Error('Operation selection cannot include associated listing');
    if (record.outcome.kind === 'evaluation') {
      const evaluation = get(record.outcome.evaluation);
      if (evaluation.kind !== 'investigation-evaluation' || record.subjects.length !== 1
        || record.subjects[0] !== evaluation.request.subject || unsupported
        || !(record.lens in investigationOperations) || investigationOperations[record.lens as keyof typeof investigationOperations] !== evaluation.request.operation
        || canonical(record.roots) !== canonical(evaluation.outcome.kind === 'accepted' ? [evaluation.outcome.root] : [])) {
        throw new Error('Invalid selected evaluation');
      }
    } else if (record.roots.length) throw new Error('Selection without evaluation cannot have result roots');
    if (record.outcome.kind === 'unavailable' && (record.subjects.length !== 1 || unsupported
      || !(record.lens in investigationOperations)
      || !['configuration-unavailable', 'communication-failure'].includes(record.outcome.value.kind)
      || typeof record.outcome.value.code !== 'string' || typeof record.outcome.value.diagnostic !== 'string')) throw new Error('Invalid unavailable selection');
    const expectedKind = unsupported === 'investigram' ? ['investigram'] : unsupported === 'program-subject' ? ['module', 'group']
      : record.lens === 'summarize' ? ['module'] : ['investigram'];
    if (record.subjects.some(id => !expectedKind.includes(get(id).kind))) throw new Error('Invalid operation subject kind');
    if (unsupported && record.outcome.kind !== 'no-evaluation') throw new Error('Unsupported selection cannot have evaluation');
  } else {
    if (record.lens !== 'inspect') throw new Error('Invalid inspection lens');
    if (record.variant === 'historical-inspection' && (canonical(record.roots) !== canonical(record.subjects)
      || record.subjects.some(id => get(id).kind !== 'investigram'))) throw new Error('Historical roots must preserve exact investigram subjects');
    if (record.variant === 'associated-inspection') {
      const basis = get(record.mechanical);
      if ((basis.kind !== 'projection' && basis.kind !== 'organization-projection') || basis.lens !== 'inspect'
        || record.roots.length || record.relations.length || record.displaced.length || record.navigation.length) throw new Error('Invalid associated inspection basis');
      const embedded = basis.kind === 'organization-projection' && basis.moduleProjection ? get(basis.moduleProjection) : null;
      const subjects = basis.kind === 'projection' ? basis.modules
        : [...basis.groups, ...(embedded?.kind === 'projection' ? embedded.modules : [])];
      if (canonical(record.subjects) !== canonical(subjects)) throw new Error('Associated subjects must match the shown mechanical Projection');
    }
  }
  const relations = new Map(record.relations.map(item => [item.original, item.account]));
  const revisions = new Map(record.revisions.map(item => [item.original, item]));
  if (relations.size !== record.relations.length || revisions.size !== record.revisions.length) throw new Error('Duplicate investigation selection relation');
  for (const root of record.roots) if (!relations.has(root)) throw new Error('Missing selected root relation');
  for (const relation of record.relations) {
    if (!revisions.has(relation.original) || !revisions.has(relation.account)
      || relation.account !== (record.variant === 'historical-inspection' ? relation.original : revisions.get(relation.original)!.primary)) throw new Error('Invalid selected revision relation');
  }
  for (const id of [...record.displaced, ...record.associated]) if (!revisions.has(id)) throw new Error('Missing selection revision');
  const expectedRevisions = [...new Set([...record.subjects.filter(id => get(id).kind === 'investigram'),
    ...record.relations.flatMap(item => [item.original, item.account]), ...record.displaced, ...record.associated])];
  if (canonical([...revisions.keys()]) !== canonical(expectedRevisions)) throw new Error('Invalid revision population');
  for (const id of record.associated) {
    const account = get(id);
    if (account.kind !== 'investigram' || !account.associations.some(item => record.subjects.includes(item.subject))) throw new Error('Invalid explicit association selection');
  }
  const pending = [...record.roots], visited = new Set<RecordId>(), expanded = new Set<RecordId>(), displaced = new Set<RecordId>();
  for (let cursor = 0; cursor < pending.length; cursor++) {
    const original = pending[cursor]!;
    if (visited.has(original)) continue;
    visited.add(original);
    const id = relations.get(original);
    if (!id) throw new Error('Missing composition or accompanying selection relation');
    if (id !== original) {
      const displacedQueue = [original];
      for (let cursor = 0; cursor < displacedQueue.length; cursor++) {
        const displacedId = displacedQueue[cursor]!;
        if (displaced.has(displacedId)) continue;
        displaced.add(displacedId);
        const account = get(displacedId);
        if (account.kind !== 'investigram') throw new Error('Invalid displaced account');
        displacedQueue.push(...account.children);
      }
    }
    if (expanded.has(id)) continue;
    expanded.add(id);
    const account = get(id);
    if (account.kind !== 'investigram') throw new Error('Invalid selected account');
    pending.push(...account.children);
    for (const correctionId of account.corrections) {
      const correction = get(correctionId);
      if (correction.kind !== 'investigram-correction') throw new Error('Invalid accompanying correction');
      pending.push(correction.replacement);
    }
  }
  if (canonical([...visited]) !== canonical([...relations.keys()]) || canonical([...displaced]) !== canonical(record.displaced)
    || canonical([...expanded]) !== canonical(record.navigation.map(item => item.account))) throw new Error('Incomplete selection graph');
  for (const item of record.navigation) {
    const account = get(item.account);
    const provenance = account.kind === 'investigram' ? get(account.provenance) : null;
    const parent = item.compositionParent ? get(item.compositionParent) : null;
    if (provenance?.kind !== 'investigation-provenance' || provenance.request.subject !== item.investigationSubject
      || parent && (parent.kind !== 'investigram' || !parent.children.includes(item.account))) throw new Error('Invalid selected navigation');
  }
  for (const revision of record.revisions) {
    if (['page', 'total', 'nextPage', 'omittedRows', 'inconsistencyCount', 'omittedInconsistencyReporters'].some(key => key in revision)
      || revision.rows.some(row => row.cause && 'omittedVia' in row.cause)) throw new Error('Retained revision results must be unpaged');
    if (new Set(revision.rows.map(row => row.correction)).size !== revision.rows.length) throw new Error('Duplicate revision correction');
    if (revision.superseded !== (revision.original !== revision.primary)
      || revision.causeCount !== revision.rows.filter(row => row.cause !== null).length
      || revision.needsReconsideration !== (revision.causeCount > 0)) throw new Error('Invalid revision summary');
    for (const row of revision.rows) {
      const correction = get(row.correction);
      if (correction.kind !== 'investigram-correction' || correction.reporter !== row.reporter
        || correction.target !== row.target || correction.replacement !== row.replacement) throw new Error('Invalid revision correction row');
      if (!row.relationship && row.cause === null) throw new Error('Revision row has no selected relationship or cause');
    }
    for (const item of revision.inconsistencies) {
      const reporter = get(item.reporter), { reporter: _reporter, ordinal, ...assertion } = item;
      if (reporter.kind !== 'investigram' || !Number.isInteger(ordinal) || ordinal < 0
        || canonical(reporter.inconsistencies[ordinal] ?? null) !== canonical(assertion)) throw new Error('Invalid inconsistency attribution');
    }
  }
}
