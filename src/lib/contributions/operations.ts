import { methods } from '../identity.js';
import { freezeOwned } from '../immutable.js';
import type { DialogOperation } from './dialog.js';
import type { ResultContract } from './outcomes.js';
import { stateBehaviorGuidance, stateDiagramContract } from './state-model.js';

/**
 * An agentic operation retained through common contributions. `subject` is its hard
 * subject signature: one discovered module, or exact selected retained content.
 */
export interface ContributionOperation extends Omit<DialogOperation, 'contract'> { readonly subject: 'module' | 'selected-content' }
export const contributionOperations: Readonly<Record<string, ContributionOperation>> = freezeOwned({
  'state-behavior': { id: 'state-behavior', subject: 'module', method: `${methods.contributionDialog} postcode/state-behavior@1`,
    objective: 'Establish whether the behavior of the subject module depends on state and, if it does, explain that state-dependent behavior: what bears the state, the states, how each is entered and left, and what each transition does. Follow the behavior into other modules only where the evidence requires it.',
    guidance: stateBehaviorGuidance },
  'examine-content': { id: 'examine-content', subject: 'selected-content', method: `${methods.contributionDialog} postcode/examine-content@1`,
    objective: 'Investigate the selected retained content more deeply. The subject is exactly the selected information as retained, with its own question and standing, not whatever now answers that question. Supply substantive findings, sharper limitations, explicit organizing changes, or a candid report that nothing useful could be added.',
    guidance: stateBehaviorGuidance },
});
const contributionResultContracts: Readonly<Record<string, ResultContract>> = freezeOwned({ [stateDiagramContract.id]: stateDiagramContract });
/** The supported result contract with this identity. An unknown identity is not a contract. */
export function resultContract(id: string | null): ResultContract | null | undefined {
  return id === null ? null : Object.hasOwn(contributionResultContracts, id) ? contributionResultContracts[id] : undefined;
}

/** Current executable follow-ups, derived from the same operation and contract registrations as invocation. */
export function followUpInstructions(): string {
  return [
    'SUPPORTED FOLLOW-UP OPERATIONS (exactly one subject):',
    ...Object.values(contributionOperations).map(operation => `${operation.id}: ${operation.subject === 'module'
      ? 'one discovered module Entity, { kind: "entity", entity }. A newly invented Entity is not a discovered module.'
      : 'one exact content item { kind: "content", item: { investigram, item }, component?: string }, result designation { kind: "designation", association: { investigram, declaration } }, or contribution { kind: "investigram", investigram }. Submission-local references are allowed.'} ${operation.objective}`),
    'SUPPORTED OPTIONAL RESULT CONTRACTS: omit resultContract when no specialized form is promised.',
    ...Object.values(contributionResultContracts).map(contract => `${contract.id}: ${contract.requirements.map(requirement => requirement.description).join(' ')}`),
    'Set the option meaning to the specific question being proposed. Invoking that exact owner/key preserves its meaning as the delegated question; another option is a different question even if operation and subjects match.',
  ].join('\n');
}
