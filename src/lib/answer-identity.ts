import { identityReference } from './identity.js';
import type { ProjectionRecord, RecordId } from './records.js';
import type { OrganizationProjectionRecord } from './organization/records.js';
import type { DependencyProjectionRecord } from './dependencies/records.js';

type Answer = ProjectionRecord | OrganizationProjectionRecord | DependencyProjectionRecord;
type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;

/** Full qualified payload, normalizing only the declared reference positions. */
export function mechanicalAnswerIdentity(answer: WithoutId<Answer>): unknown {
  const ref = (id: RecordId | null) => identityReference(answer.session, id);
  const refs = (ids: readonly RecordId[]) => ids.map(ref);
  const common = { ...answer, session: identityReference(answer.session, answer.session),
    modules: refs(answer.modules), contexts: refs(answer.contexts),
    selection: { ...answer.selection, ...(answer.selection.outsidePopulation ? { outsidePopulation: refs(answer.selection.outsidePopulation) } : {}) } };
  switch (answer.kind) {
    case 'projection': return { ...common, claims: refs(answer.claims), evaluations: refs(answer.evaluations),
      expansions: { ...answer.expansions, claims: refs(answer.expansions.claims) } };
    case 'organization-projection': return { ...common, evaluation: ref(answer.evaluation), moduleProjection: ref(answer.moduleProjection),
      groups: refs(answer.groups), claims: refs(answer.claims), expansions: { ...answer.expansions,
        groups: refs(answer.expansions.groups), modules: refs(answer.expansions.modules), claims: refs(answer.expansions.claims),
        moduleClaims: refs(answer.expansions.moduleClaims), moduleEvaluations: refs(answer.expansions.moduleEvaluations) } };
    case 'dependency-projection': return { ...common, evaluation: ref(answer.evaluation), subjects: refs(answer.subjects),
      relationships: refs(answer.relationships), occurrences: refs(answer.occurrences), nonEdgeRequests: refs(answer.nonEdgeRequests),
      coverage: refs(answer.coverage), opaqueSubjects: refs(answer.opaqueSubjects),
      graph: answer.graph ? { ...answer.graph, components: answer.graph.components.map(component => ({ ...component,
        members: refs(component.members), internalRelationships: refs(component.internalRelationships) })) } : null,
      expansions: { moduleEvaluations: refs(answer.expansions.moduleEvaluations), moduleClaims: refs(answer.expansions.moduleClaims),
        organization: ref(answer.expansions.organization) } };
  }
}
