import { completedMaterialization } from '../evaluation-state.js';
import type { EvaluationState } from '../records.js';
import type { ModuleProjectionContent } from '../module-content.js';
import type { OrganizationProjectionContent } from '../organization/content.js';
import type { DependencyProjectionContent } from '../dependencies/content.js';
import type { ModuleExportsContent } from '../exports/content.js';
import type { ContributionInspectionContent } from '../contributions/inspection.js';
import type { ContributionAnswerContent } from '../contributions/answers.js';

/** These contracts name qualified meanings, not interchangeable graph shapes. */
export type QualifiedContent =
  | { readonly contract: 'modules'; readonly value: ModuleProjectionContent }
  | { readonly contract: 'organization'; readonly value: OrganizationProjectionContent }
  | { readonly contract: 'dependencies'; readonly value: DependencyProjectionContent }
  | { readonly contract: 'module-exports'; readonly value: ModuleExportsContent }
  | { readonly contract: 'contribution-inspection'; readonly value: ContributionInspectionContent }
  | { readonly contract: 'contribution'; readonly value: ContributionAnswerContent };

const complete = (state: Pick<EvaluationState, 'applicability' | 'availability' | 'execution' | 'materialization'>) =>
  state.applicability === 'applicable' && state.availability === 'available' && completedMaterialization(state);

/** Malformed internal content is a defect; qualified incompleteness is data.
 * The family resolvers have already checked support records and their kinds. */
export function validateContent(content: QualifiedContent): void {
  const projection = content.value.projection;
  const expected = { modules: 'projection', organization: 'organization-projection', dependencies: 'dependency-projection', 'module-exports': 'module-exports-projection', contribution: 'contribution-projection', 'contribution-inspection': 'contribution-inspection-projection' };
  if (projection.kind !== expected[content.contract] || !projection.id || !projection.session) throw new Error('Malformed Presentation content contract');
  if (content.contract === 'contribution-inspection') {
    if (!content.value.projection.subjects.length) throw new Error('Empty inspection subjects');
  } else if (content.contract === 'contribution') {
    if (content.value.projection.alternatives.some(item => !item.items.length)) throw new Error('Malformed contribution answer content');
  } else if (content.contract === 'modules') {
    if (!['configured-project', 'selected-modules'].includes(content.value.projection.subject)
      || content.value.discovery.kind !== 'evaluation' || content.value.evaluations[0]?.id !== content.value.discovery.id || content.value.session.id !== projection.session
      || content.value.modules.length !== content.value.projection.modules.length
      || content.value.modules.some((item, index) => item.id !== content.value.projection.modules[index])) throw new Error('Malformed module Presentation content');
  } else if (content.contract === 'organization') {
    if (!['configured-project', 'repository', 'selected-entities'].includes(content.value.projection.subject)
      || content.value.evaluation.kind !== 'organization-evaluation' || content.value.moduleEvaluation.kind !== 'evaluation') throw new Error('Malformed organization Presentation content');
    if (content.value.moduleDetail) validateContent({ contract: 'modules', value: content.value.moduleDetail });
  } else if (content.contract === 'dependencies') {
    if (content.value.evaluation.kind !== 'dependency-evaluation' || content.value.basis.kind !== 'evaluation') throw new Error('Malformed dependency Presentation content');
    const answer = content.value.projection;
    if (![null, 'parent', 'child'].includes(answer.subjectRole)
      || !['evaluation', 'subject-owners', 'unattributable-to-subjects'].includes(answer.coverageScope)
      || !['configured-project', 'selected-modules'].includes(answer.subject)
      || (answer.subjectRole === null) !== (answer.subject === 'configured-project')
      || (answer.graph !== null) !== (answer.subjectRole === null)
      || answer.coverageScope === 'unattributable-to-subjects' && (answer.nonEdgeRequests.length || answer.coverage.length)) throw new Error('Malformed dependency direction or coverage');
  } else if (content.contract === 'module-exports') {
    if (content.value.basis.id !== content.value.projection.evaluation || content.value.basis.session !== projection.session
      || content.value.basis.requirement !== 'modules' || content.value.module.record.subject !== content.value.projection.subject
      || content.value.evaluations.length !== content.value.projection.evaluations.length
      || content.value.evaluations.some((item, index) => item.id !== content.value.projection.evaluations[index])
      || content.value.exports.length !== content.value.projection.exports.length
      || content.value.exports.some((item, index) => item.claim.record.id !== content.value.projection.exports[index]
        || item.claim.record.subject !== content.value.projection.subject)) throw new Error('Malformed exports Presentation content');
  }
}

/** Explain unmet operational completeness without treating qualifications as defects. */
export function materializationLimitations(content: QualifiedContent): readonly string[] {
  const state = (label: string, value: Pick<EvaluationState, 'applicability' | 'availability' | 'execution' | 'materialization' | 'reason'>) => complete(value) ? []
    : [`${label}: ${value.applicability}, ${value.availability}, ${value.execution}, ${value.materialization}${value.reason ? `; ${value.reason}` : ''}`];
  const outsiders = (ids: readonly string[] | undefined) => ids?.length ? ['Selected subjects are outside the supplied evaluation population.'] : [];
  switch (content.contract) {
    case 'contribution-inspection': return [];
    case 'contribution': return [...(content.value.projection.alternatives.length ? [] : ['No answer is currently designated for this question.']),
      ...content.value.projection.alternatives.flatMap(item => item.unmet.map(unmet => `Requested result not met: ${unmet.requirement} ${unmet.reason}`))];
    case 'module-exports': return [...(content.value.complete ? [] : ['A complete export surface is not established.']),
      ...[content.value.basis, ...content.value.evaluations].flatMap(item => state(`Exports (${item.requirement})`, item))];
    case 'modules': return [...outsiders(content.value.projection.selection.outsidePopulation),
      ...content.value.evaluations.flatMap(item => state(`Modules (${item.requirement})`, item))];
    case 'organization': return [...state('Organization', content.value.evaluation), ...state('Placement', content.value.evaluation.placement),
      ...state('Modules', content.value.moduleEvaluation), ...content.value.moduleEvaluations.flatMap(item => state(`Modules (${item.requirement})`, item)),
      ...outsiders(content.value.projection.selection.outsidePopulation),
      ...(content.value.moduleDetail ? materializationLimitations({ contract: 'modules', value: content.value.moduleDetail }) : [])];
    case 'dependencies': return [...state('Dependencies', content.value.evaluation), ...state('Modules', content.value.basis),
      ...content.value.moduleEvaluations.flatMap(item => state(`Modules (${item.requirement})`, item)),
      ...(content.value.expanded ? state('Dependency organization', content.value.expanded) : []), ...outsiders(content.value.projection.selection.outsidePopulation)];
  }
}

