import { canonical } from './identity.js';
import type { EvaluationRecord, ProgramRecord, ProgramRecordStore, RecordId, SnapshotId } from './records.js';

function references(record: ProgramRecord): readonly RecordId[] {
  switch (record.kind) {
    case 'snapshot': return record.repository ? [record.repository] : [];
    case 'repository-evidence': return [];
    case 'repository-region':
    case 'repository-artifact': return [record.repository];
    case 'group':
    case 'module':
    case 'symbol': return [record.claim];
    case 'recorded-assertion': return [record.context];
    case 'dependency-occurrence': return [record.owner, record.context, record.evidence, ...record.targetEvidence, ...(record.target ? [record.target] : [])];
    case 'dependency-coverage': return [record.context, record.evidence, ...(record.owner ? [record.owner] : [])];
    case 'dependency-projection': return [record.evaluation, ...record.subjects, ...record.modules, ...record.relationships,
      ...record.occurrences, ...record.nonEdgeRequests, ...record.coverage, ...record.opaqueSubjects, ...record.contexts,
      ...record.expansions.moduleEvaluations, ...record.expansions.moduleClaims, ...(record.expansions.organization ? [record.expansions.organization] : []),
      ...(record.graph?.components.flatMap(component => [...component.members, ...component.internalRelationships]) ?? [])];
    case 'dependency-organization-evaluation': return [record.dependencyEvaluation, record.organizationEvaluation, ...record.claims, ...record.contexts];
    case 'dependency-evaluation': return [record.moduleEvaluation, ...record.projectModules, ...record.occurrences,
      ...record.relationships, ...record.coverage, ...record.contexts];
    case 'claim': return [record.subject, record.context,
      ...(record.information.type === 'dependency-organization' ? [record.information.evaluation,
        ...record.information.occurrences.flatMap(item => [item.occurrence,
          ...[item.source, item.target].flatMap(endpoint => [...endpoint.groups, ...endpoint.candidates, ...endpoint.artifacts, ...endpoint.evidence, ...endpoint.claims]),
          ...item.pairs.flatMap(pair => [pair.source, pair.target, ...pair.commonAncestors, ...pair.containment])])] : []),
      ...(record.information.type === 'dependency' ? [record.information.child, ...record.information.occurrences] : []),
      ...(record.information.type === 'export' ? [record.information.symbol, record.information.origin,
        ...record.information.routes.map(route => route.via)].filter((id): id is RecordId => id !== null) : []),
      ...(record.information.type === 'documentation-association' ? [record.information.assertion] : []),
      ...(record.information.type === 'group-containment' ? [record.information.child] : []),
      ...(record.information.type === 'artifact-placement' || record.information.type === 'group-documentation' ? [record.information.artifact] : []),
      ...(record.information.type === 'module-placement' ? [...record.information.groups, ...record.information.candidates, ...record.information.artifacts] : []),
      ...(record.information.type === 'group-properties' ? [record.information.evaluation] : [])];
    case 'claim-context': return [...record.evidence,
      ...(record.scope === 'configured-project' ? [] : [record.scope])];
    case 'source-evidence': return record.resolution?.target ? [record.resolution.target] : [];
    case 'evaluation': return [...record.modules, ...record.contexts, ...(record.claims ?? []), ...(record.basis ? [record.basis] : [])];
    case 'projection': return [...record.modules, ...record.claims, ...record.contexts, ...record.evaluations, ...record.expansions.claims];
    case 'organization-evaluation': return [record.repository, record.moduleEvaluation, ...record.groups, ...record.claims, ...record.contexts];
    case 'organization-projection': return [...record.expansions.moduleClaims, ...record.expansions.moduleEvaluations, record.evaluation, ...(record.moduleProjection ? [record.moduleProjection] : []),
      ...record.groups, ...record.modules, ...record.claims, ...record.contexts,
      ...record.expansions.groups, ...record.expansions.modules, ...record.expansions.claims];
  }
}

function freeze(value: unknown): void {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
}

/** Atomic batches permit mutually referring entity/claim/context records. */
export class MemoryProgramRecordStore implements ProgramRecordStore {
  readonly #records = new Map<RecordId, ProgramRecord>();

  put(records: readonly ProgramRecord[]): void {
    const pending = new Map<RecordId, ProgramRecord>();
    for (const record of records) {
      if (!record.id || !record.snapshot || !record.method) throw new Error('Missing record context');
      const prior = pending.get(record.id) ?? this.#records.get(record.id);
      if (prior && canonical(prior) !== canonical(record)) throw new Error('Immutable record collision');
      pending.set(record.id, structuredClone(record));
    }
    for (const record of pending.values()) {
      const snapshot = pending.get(record.snapshot) ?? this.#records.get(record.snapshot);
      if ((record.kind === 'snapshot' && record.id !== record.snapshot)
        || snapshot?.kind !== 'snapshot' || snapshot.id !== snapshot.snapshot) {
        throw new Error('Missing or invalid snapshot');
      }
      for (const id of references(record)) {
        const target = pending.get(id) ?? this.#records.get(id);
        if (!target || target.snapshot !== record.snapshot) throw new Error('Invalid record reference');
      }
      const requireKind = (id: RecordId, kind: ProgramRecord['kind']) => {
        if ((pending.get(id) ?? this.#records.get(id))?.kind !== kind) {
          throw new Error(`Expected ${kind} reference`);
        }
      };
      switch (record.kind) {
        case 'group':
        case 'module':
        case 'symbol': {
          requireKind(record.claim, 'claim');
          const claim = pending.get(record.claim) ?? this.#records.get(record.claim);
          if (claim?.kind !== 'claim' || claim.information.type !== record.kind || claim.subject !== record.id) {
            throw new Error(`Invalid ${record.kind} entity claim`);
          }
          break;
        }
        case 'dependency-occurrence': {
          requireKind(record.owner, 'module');
          requireKind(record.context, 'claim-context');
          requireKind(record.evidence, 'source-evidence');
          record.targetEvidence.forEach(id => requireKind(id, 'source-evidence'));
          if (record.target) requireKind(record.target, 'module');
          const evidence = pending.get(record.evidence) ?? this.#records.get(record.evidence);
          if (evidence?.kind !== 'source-evidence' || evidence.dependencyResolution?.status !== record.targetStatus) {
            throw new Error('Dependency occurrence requires matching resolution evidence');
          }
          if ((record.targetStatus === 'resolved') !== (record.target !== null)
            || (record.mechanism === 'commonjs') !== (record.commonjs !== null)
            || (record.commonjs !== null && record.commonjs.outcome !== 'recognized')) {
            throw new Error('Invalid dependency occurrence');
          }
          break;
        }
        case 'dependency-coverage':
          if (record.owner) requireKind(record.owner, 'module');
          requireKind(record.context, 'claim-context');
          requireKind(record.evidence, 'source-evidence');
          if (record.outcome === 'recognized') throw new Error('Recognized requests are not coverage exclusions');
          break;
        case 'dependency-projection': {
          requireKind(record.evaluation, 'dependency-evaluation');
          [...record.modules, ...record.subjects, ...record.opaqueSubjects].forEach(id => requireKind(id, 'module'));
          record.relationships.forEach(id => {
            requireKind(id, 'claim');
            const edge = pending.get(id) ?? this.#records.get(id);
            if (edge?.kind !== 'claim' || edge.information.type !== 'dependency') throw new Error('Expected dependency relationship');
          });
          [...record.occurrences, ...record.nonEdgeRequests].forEach(id => requireKind(id, 'dependency-occurrence'));
          record.coverage.forEach(id => requireKind(id, 'dependency-coverage'));
          record.contexts.forEach(id => requireKind(id, 'claim-context'));
          record.expansions.moduleEvaluations.forEach(id => requireKind(id, 'evaluation'));
          record.expansions.moduleClaims.forEach(id => requireKind(id, 'claim'));
          if (record.expansions.organization) requireKind(record.expansions.organization, 'dependency-organization-evaluation');
          if (record.graph) {
            const count = record.graph.components.length;
            const indices = [...record.graph.roots, ...record.graph.components.flatMap(component => component.children)];
            if (indices.some(index => !Number.isInteger(index) || index < 0 || index >= count)
              || !record.graph.rootsEstablished && record.graph.roots.length > 0) throw new Error('Invalid dependency graph grouping');
            const members = record.graph.components.flatMap(component => component.members);
            if (new Set(members).size !== members.length || members.some(id => !record.modules.includes(id))) throw new Error('Invalid dependency graph population');
          }
          break;
        }
        case 'dependency-organization-evaluation':
          requireKind(record.dependencyEvaluation, 'dependency-evaluation');
          requireKind(record.organizationEvaluation, 'organization-evaluation');
          record.claims.forEach(id => requireKind(id, 'claim'));
          record.contexts.forEach(id => requireKind(id, 'claim-context'));
          break;
        case 'dependency-evaluation': {
          requireKind(record.moduleEvaluation, 'evaluation');
          const basis = pending.get(record.moduleEvaluation) ?? this.#records.get(record.moduleEvaluation);
          if (basis?.kind !== 'evaluation' || basis.requirement !== 'modules') throw new Error('Expected module evaluation basis');
          record.projectModules.forEach(id => requireKind(id, 'module'));
          record.occurrences.forEach(id => requireKind(id, 'dependency-occurrence'));
          record.relationships.forEach(id => {
            requireKind(id, 'claim');
            const relationship = pending.get(id) ?? this.#records.get(id);
            if (relationship?.kind !== 'claim' || relationship.information.type !== 'dependency') throw new Error('Expected dependency relationship');
          });
          record.coverage.forEach(id => requireKind(id, 'dependency-coverage'));
          record.contexts.forEach(id => requireKind(id, 'claim-context'));
          break;
        }
        case 'recorded-assertion': requireKind(record.context, 'claim-context'); break;
        case 'claim':
          if (record.information.type === 'dependency-organization') {
            requireKind(record.subject, 'claim');
            requireKind(record.information.evaluation, 'dependency-organization-evaluation');
            const subject = pending.get(record.subject) ?? this.#records.get(record.subject);
            if (subject?.kind !== 'claim' || subject.information.type !== 'dependency') throw new Error('Expected dependency relationship subject');
            const information = record.information;
            if (canonical([...information.occurrences.map(item => item.occurrence)].sort())
              !== canonical([...subject.information.occurrences].sort())) throw new Error('Organization expansion requires every supporting occurrence');
            for (const item of information.occurrences) {
              requireKind(item.occurrence, 'dependency-occurrence');
              for (const endpoint of [item.source, item.target]) {
                [...endpoint.groups, ...endpoint.candidates].forEach(id => requireKind(id, 'group'));
                endpoint.artifacts.forEach(id => requireKind(id, 'repository-artifact'));
                endpoint.evidence.forEach(id => requireKind(id, 'source-evidence'));
                endpoint.claims.forEach(id => requireKind(id, 'claim'));
              }
              item.pairs.forEach(pair => {
                [pair.source, pair.target, ...pair.commonAncestors].forEach(id => requireKind(id, 'group'));
                pair.containment.forEach(id => requireKind(id, 'claim'));
              });
              if ((item.status === 'established') !== (item.classification !== null)) throw new Error('Invalid occurrence organization qualification');
            }
            if (information.classification !== null && information.occurrences.some(item => item.status !== 'established')) throw new Error('Incomplete organization evidence cannot establish a common classification');
          }
          if (record.information.type === 'dependency') {
            const child = record.information.child;
            requireKind(record.subject, 'module');
            requireKind(record.information.child, 'module');
            const occurrences = record.information.occurrences.map(id => pending.get(id) ?? this.#records.get(id));
            if (occurrences.length === 0 || new Set(record.information.occurrences).size !== occurrences.length
              || occurrences.some(occurrence => occurrence?.kind !== 'dependency-occurrence'
                || occurrence.owner !== record.subject || occurrence.target !== child
                || occurrence.targetStatus !== 'resolved')) throw new Error('Dependency relationship lacks matching occurrences');
            const support = occurrences.filter(occurrence => occurrence?.kind === 'dependency-occurrence');
            const mechanisms = [...new Set(support.map(occurrence => occurrence.mechanism))].sort();
            if (record.information.typeOnly !== support.every(occurrence => occurrence.typeOnly)
              || canonical(mechanisms) !== canonical(record.information.mechanisms)) throw new Error('Invalid dependency aggregation');
          }
          if (record.information.type === 'module' || record.information.type === 'export' || record.information.type === 'module-composition') requireKind(record.subject, 'module');
          if (record.information.type === 'symbol') requireKind(record.subject, 'symbol');
          if (['group', 'group-containment', 'artifact-placement', 'group-documentation', 'group-properties'].includes(record.information.type)) {
            requireKind(record.subject, 'group');
          }
          if (record.information.type === 'group-containment') requireKind(record.information.child, 'group');
          if (record.information.type === 'artifact-placement' || record.information.type === 'group-documentation') {
            requireKind(record.information.artifact, 'repository-artifact');
          }
          if (record.information.type === 'group-properties') {
            requireKind(record.information.evaluation, 'organization-evaluation');
            const outcome = pending.get(record.information.evaluation) ?? this.#records.get(record.information.evaluation);
            if (outcome?.kind === 'organization-evaluation' && !outcome.groups.includes(record.subject)) {
              throw new Error('Group property subject is outside its evaluation');
            }
            if (record.information.modulePresence !== null && record.information.modulePresence !== 'direct'
              && outcome?.kind === 'organization-evaluation'
              && (outcome.placement.execution !== 'completed' || outcome.placement.materialization !== 'full')) {
              throw new Error('Negative group presence requires completed placement evaluation');
            }
          }
          if (record.information.type === 'module-placement') {
            requireKind(record.subject, 'module');
            record.information.groups.forEach(id => requireKind(id, 'group'));
            record.information.candidates.forEach(id => requireKind(id, 'group'));
            record.information.artifacts.forEach(id => requireKind(id, 'repository-artifact'));
            const { outcome, groups, candidates, materialization } = record.information;
            if (new Set(groups).size !== groups.length || new Set(candidates).size !== candidates.length
              || (outcome === 'established' ? groups.length !== 1 : outcome === 'multiple' ? groups.length < 2 : groups.length !== 0)
              || (outcome === 'ambiguous' ? candidates.length === 0 : candidates.length !== 0)
              || (outcome === 'unavailable' && materialization !== 'none')) {
              throw new Error('Invalid module placement outcome');
            }
          }
          if (record.information.type === 'documentation-association') {
            requireKind(record.information.assertion, 'recorded-assertion');
            const subject = pending.get(record.subject) ?? this.#records.get(record.subject);
            const association = record.information.association;
            const validSubject = association === 'module' ? subject?.kind === 'module'
              : association === 'origin-symbol' ? subject?.kind === 'symbol'
              : subject?.kind === 'claim' && subject.information.type === 'export';
            if (!validSubject) throw new Error(`Invalid ${association} documentation subject`);
          }
          if (record.information.type === 'export') {
            if (record.information.symbol) requireKind(record.information.symbol, 'symbol');
            if (record.information.origin) requireKind(record.information.origin, 'module');
            record.information.routes.forEach(route => { if (route.via) requireKind(route.via, 'module'); });
          }
          requireKind(record.context, 'claim-context');
          break;
        case 'claim-context':
          record.evidence.forEach(id => {
            const evidence = pending.get(id) ?? this.#records.get(id);
            if (!evidence || !['source-evidence', 'repository-evidence', 'repository-region', 'repository-artifact'].includes(evidence.kind)) {
              throw new Error('Expected source-evidence reference');
            }
          });
          break;
        case 'evaluation':
          record.modules.forEach(id => requireKind(id, 'module'));
          record.contexts.forEach(id => requireKind(id, 'claim-context'));
          record.claims?.forEach(id => requireKind(id, 'claim'));
          if (record.basis) requireKind(record.basis, 'evaluation');
          break;
        case 'projection':
          record.modules.forEach(id => requireKind(id, 'module'));
          record.claims.forEach(id => requireKind(id, 'claim'));
          record.contexts.forEach(id => requireKind(id, 'claim-context'));
          record.evaluations.forEach(id => requireKind(id, 'evaluation'));
          record.expansions.claims.forEach(id => requireKind(id, 'claim'));
          break;
        case 'source-evidence':
          if (record.resolution?.target) requireKind(record.resolution.target, 'module');
          break;
        case 'snapshot':
          if (record.repository) requireKind(record.repository, 'repository-evidence');
          break;
        case 'repository-evidence':
          if ((record.capture.status === 'available') !== (record.layout !== null)) throw new Error('Repository layout must match capture availability');
          break;
        case 'repository-region':
        case 'repository-artifact': requireKind(record.repository, 'repository-evidence'); break;
        case 'organization-evaluation': {
          requireKind(record.repository, 'repository-evidence');
          requireKind(record.moduleEvaluation, 'evaluation');
          const basis = pending.get(record.moduleEvaluation) ?? this.#records.get(record.moduleEvaluation);
          if (basis?.kind !== 'evaluation' || basis.requirement !== 'modules') throw new Error('Expected module evaluation basis');
          record.groups.forEach(id => requireKind(id, 'group'));
          record.claims.forEach(id => requireKind(id, 'claim'));
          record.contexts.forEach(id => requireKind(id, 'claim-context'));
          break;
        }
        case 'organization-projection':
          record.expansions.moduleClaims.forEach(id => requireKind(id, 'claim'));
          record.expansions.moduleEvaluations.forEach(id => requireKind(id, 'evaluation'));
          requireKind(record.evaluation, 'organization-evaluation');
          if (record.moduleProjection) requireKind(record.moduleProjection, 'projection');
          [...record.groups, ...record.expansions.groups].forEach(id => requireKind(id, 'group'));
          [...record.modules, ...record.expansions.modules].forEach(id => requireKind(id, 'module'));
          [...record.claims, ...record.expansions.claims].forEach(id => requireKind(id, 'claim'));
          record.contexts.forEach(id => requireKind(id, 'claim-context'));
          break;
      }
    }
    for (const [id, record] of pending) {
      freeze(record);
      this.#records.set(id, record);
    }
  }

  get(id: RecordId): ProgramRecord {
    const result = this.#records.get(id);
    if (!result) throw new Error(`Missing program record: ${id}`);
    return result;
  }

  evaluations(snapshot: SnapshotId): readonly EvaluationRecord[] {
    return [...this.#records.values()].filter((record): record is EvaluationRecord =>
      record.kind === 'evaluation' && record.snapshot === snapshot);
  }
}
