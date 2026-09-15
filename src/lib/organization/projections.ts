import { compare, groupEntityIds, methods, moduleEntityIds, recordId } from '../identity.js';
import { inspect as inspectModules } from '../projections.js';
import type { EvaluationRecord, ProgramRecordStore, RecordId } from '../records.js';
import type { GroupClaim, OrganizationClaims, OrganizationEvaluationRecord, OrganizationProjectionRecord } from './records.js';

function groupClaim(store: ProgramRecordStore, id: RecordId): GroupClaim {
  const group = store.get(id);
  if (group.kind !== 'group') throw new Error('Expected group entity');
  const claim = store.get(group.claim);
  if (claim.kind !== 'claim' || claim.information.type !== 'group') throw new Error('Expected group claim');
  return claim as GroupClaim;
}

/** Lenses read stored evaluations only. Selection never rewrites group relationships. */
function project(store: ProgramRecordStore, evaluation: OrganizationEvaluationRecord,
  subject: OrganizationProjectionRecord['subject'], selector: string | null, expectedSnapshot: string | null): OrganizationProjectionRecord {
  const stored = store.get(evaluation.id);
  if (stored.kind !== 'organization-evaluation') throw new Error('Expected organization evaluation');
  evaluation = stored;
  const moduleEvaluation = store.get(evaluation.moduleEvaluation) as EvaluationRecord;
  const claims = evaluation.claims.map(id => store.get(id) as OrganizationClaims);
  const placements = claims.filter(claim => claim.information.type === 'module-placement');
  let selected = new Set(evaluation.groups);
  let moduleProjection: RecordId | null = null;
  let selectedModules: readonly RecordId[] = [];
  let referenceStatus: OrganizationProjectionRecord['selection']['referenceStatus'] = 'current';
  if (subject === 'configured-project') {
    selected = new Set(placements.flatMap(claim => claim.information.type === 'module-placement' ? claim.information.groups : []));
    let changed = true;
    while (changed) {
      changed = false;
      for (const claim of claims) {
        if (claim.information.type === 'group-containment' && selected.has(claim.information.child) && !selected.has(claim.subject)) {
          selected.add(claim.subject);
          changed = true;
        }
      }
    }
  } else if (subject === 'selected-entities') {
    if (selector === null) throw new Error('Inspection requires a selector');
    const groupIds = groupEntityIds(evaluation.groups);
    const preciseGroup = evaluation.groups.find(id => selector === id || expectedSnapshot !== null && selector === groupIds.get(id));
    const compactGroup = [...groupIds.values()].includes(selector);
    const compactModule = [...moduleEntityIds(moduleEvaluation.modules).values()].includes(selector);
    const namedGroups = evaluation.groups.filter(id => groupClaim(store, id).information.name === selector);
    // A group address is handled here; no module language name can impersonate it.
    const moduleView = preciseGroup
      ? null : inspectModules(store, moduleEvaluation, selector, expectedSnapshot);
    moduleProjection = moduleView?.id ?? null;
    referenceStatus = expectedSnapshot !== null && expectedSnapshot !== evaluation.snapshot ? 'snapshot-mismatch'
      : preciseGroup || namedGroups.length > 0 && !(compactModule && expectedSnapshot !== null) ? 'current'
      : compactGroup && expectedSnapshot === null && moduleView?.modules.length === 0 ? 'snapshot-required' : moduleView?.selection.referenceStatus ?? 'current';
    selected = new Set(referenceStatus !== 'current' ? [] : preciseGroup ? [preciseGroup]
      : compactModule && expectedSnapshot !== null ? [] : namedGroups);
    selectedModules = referenceStatus === 'current' ? moduleView?.modules ?? [] : [];
  }
  const groups = evaluation.groups.filter(id => selected.has(id));
  // Investigation retains project modules and their placement exceptions, including outside-repository evidence.
  if (subject !== 'selected-entities') selectedModules = placements.filter(claim => claim.information.type === 'module-placement'
    && !claim.information.reasons.includes('external-module')).map(claim => claim.subject);
  const selectedModuleSet = new Set(selectedModules);
  const selectedClaims = claims.filter(claim => selected.has(claim.subject) || selectedModuleSet.has(claim.subject));
  const expandedGroups = new Set<RecordId>();
  const expandedModules = new Set<RecordId>();
  const expandedClaims = new Set<RecordId>();
  if (evaluation.requested.includes('group-details')) {
    for (const claim of claims) {
      if (claim.information.type === 'group-containment' && (selected.has(claim.subject) || selected.has(claim.information.child))) {
        expandedGroups.add(claim.subject);
        expandedGroups.add(claim.information.child);
        expandedClaims.add(claim.id);
      }
      if (claim.information.type === 'module-placement' && (selectedModuleSet.has(claim.subject)
        || claim.information.groups.some(id => selected.has(id)))) {
        expandedModules.add(claim.subject);
        [...claim.information.groups, ...claim.information.candidates].forEach(id => expandedGroups.add(id));
        expandedClaims.add(claim.id);
      }
      if (selected.has(claim.subject)) expandedClaims.add(claim.id);
    }
    for (const claim of claims) {
      if (expandedGroups.has(claim.subject) && (claim.information.type === 'group' || claim.information.type === 'group-properties')) {
        expandedClaims.add(claim.id);
      }
    }
  }
  const method = `${methods.projection};${methods.organization}`;
  const populationEstablished = evaluation.execution === 'completed' && evaluation.materialization === 'full'
    && (subject === 'repository' || evaluation.placement.execution === 'completed' && evaluation.placement.materialization === 'full');
  const projection: OrganizationProjectionRecord = {
    kind: 'organization-projection', method, snapshot: evaluation.snapshot,
    id: recordId(evaluation.snapshot, 'organization-projection', { method, evaluation: evaluation.id, subject, selector, expectedSnapshot }),
    lens: subject === 'selected-entities' ? 'inspect' : 'organization', subject, parameters: { selector, expectedSnapshot },
    evaluation: evaluation.id, moduleProjection, groups, modules: selectedModules, claims: selectedClaims.map(claim => claim.id),
    contexts: [...new Set([...evaluation.contexts, ...selectedClaims.map(claim => claim.context),
      ...claims.filter(claim => expandedClaims.has(claim.id)).map(claim => claim.context)])],
    expansions: { requested: evaluation.requested, groups: [...expandedGroups].sort(compare),
      modules: [...expandedModules].sort(compare), claims: [...expandedClaims].sort(compare) },
    selection: { matches: groups.length + (subject === 'selected-entities' ? selectedModules.length : 0),
      population: subject === 'selected-entities' ? evaluation.groups.length + moduleEvaluation.modules.length : groups.length,
      populationEstablished, materialization: populationEstablished ? 'full' : groups.length + selectedModules.length > 0 ? 'partial' : 'none', referenceStatus },
  };
  store.put([projection]);
  return projection;
}

export function organization(store: ProgramRecordStore, evaluation: OrganizationEvaluationRecord,
  subject: 'repository' | 'configured-project' = 'configured-project'): OrganizationProjectionRecord {
  return project(store, evaluation, subject, null, null);
}

export function inspectOrganization(store: ProgramRecordStore, evaluation: OrganizationEvaluationRecord,
  selector: string, expectedSnapshot: string | null = null): OrganizationProjectionRecord {
  return project(store, evaluation, 'selected-entities', selector, expectedSnapshot);
}
