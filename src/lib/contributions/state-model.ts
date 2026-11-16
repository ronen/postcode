import { record, text } from './catalog.js';
import type { ContentTypeContract } from './catalog.js';
import { InvalidContribution } from './model.js';
import type { EntityId } from './model.js';
import type { ResultContract } from './outcomes.js';

/**
 * State-dependent behavior of one bearer: named states, an entry where established, and
 * directed transitions with their trigger, guard and effect where claimed. This is the retained
 * meaning, independent of any picture. It is a bounded conventional state-machine account:
 * hierarchy, orthogonal regions, history and concurrency semantics are not representable and
 * must be disclosed under `unsupported`, never flattened into an apparently complete model.
 */
export interface StateModel {
  /** The thing whose behavior depends on state: an identified Entity, or a role scoped to this account. */
  readonly bearer: { readonly kind: 'entity'; readonly entity: EntityId } | { readonly kind: 'role'; readonly role: string };
  readonly states: readonly { readonly key: string; readonly label: string; readonly description: string | null; readonly entity: EntityId | null }[];
  /** `unknown` means not established; `none` means the account establishes there is no distinguished entry. */
  readonly initial: { readonly kind: 'state'; readonly state: string; readonly condition: string | null } | { readonly kind: 'unknown' } | { readonly kind: 'none' };
  readonly transitions: readonly { readonly key: string; readonly from: string; readonly to: string;
    /** The trigger or occurrence condition; null when the account does not establish one. */
    readonly trigger: string | null; readonly guard: string | null; readonly effect: string | null }[];
  /** Whether the listed states and transitions are claimed to be all of them. Omission is not established absence. */
  readonly coverage: { readonly states: 'all' | 'some' | 'unknown'; readonly transitions: 'all' | 'some' | 'unknown' };
  /** Applicability of the whole model, such as the configuration or scenario it describes. */
  readonly applicability: string | null;
  /** State semantics the account needs that this bounded model cannot express. */
  readonly unsupported: readonly string[];
}

const invalid = (message: string): never => { throw new InvalidContribution(message); };
const optional = (value: unknown, what: string): string | null => value === undefined || value === null ? null : text(value, what);
const coverage = (value: unknown, what: string): 'all' | 'some' | 'unknown' =>
  value === 'all' || value === 'some' || value === 'unknown' ? value : invalid(`State model ${what} coverage must be all, some or unknown.`);
function entries(value: unknown, what: string): Record<string, unknown>[] {
  if (!Array.isArray(value)) return invalid(`Expected ${what} array.`);
  return value as Record<string, unknown>[];
}

export const stateModelContract: ContentTypeContract = {
  type: 'state-model', method: 'postcode/content-state-model@1',
  meaning: 'State-dependent behavior of one bearer: named states, the established entry if any, and directed transitions with trigger, guard and effect. Unknown or omitted information is distinct from established absence. Relationships between a state and anything else are asserted content, never inferred from a diagram.',
  accept(body, resolve) {
    const value = record(body, ['bearer', 'states', 'initial', 'transitions', 'coverage', 'applicability', 'unsupported'], 'state model');
    const bearerValue = record(value.bearer, ['entity', 'role'], 'state bearer');
    if ((bearerValue.entity === undefined) === (bearerValue.role === undefined)) invalid('A state bearer is exactly one of an Entity reference or a scoped role.');
    const bearer: StateModel['bearer'] = bearerValue.entity !== undefined ? { kind: 'entity', entity: resolve.entity(bearerValue.entity) }
      : { kind: 'role', role: text(bearerValue.role, 'bearer role') };
    const states = entries(value.states, 'state').map(entry => {
      const state = record(entry, ['key', 'label', 'description', 'entity'], 'state');
      return { key: text(state.key, 'state key'), label: text(state.label, 'state label'), description: optional(state.description, 'state description'),
        entity: state.entity === undefined || state.entity === null ? null : resolve.entity(state.entity) };
    });
    const keys = new Set(states.map(state => state.key));
    if (keys.size !== states.length) invalid('Duplicate state key.');
    const known = (key: unknown, what: string): string => keys.has(text(key, what)) ? key as string : invalid(`A ${what} must be a state of this model.`);
    const initialValue = record(value.initial, ['kind', 'state', 'condition'], 'initial entry');
    const initial: StateModel['initial'] = initialValue.kind === 'state' ? { kind: 'state', state: known(initialValue.state, 'initial state'), condition: optional(initialValue.condition, 'entry condition') }
      : initialValue.kind === 'unknown' || initialValue.kind === 'none' ? { kind: initialValue.kind } : invalid('An initial entry is a state, unknown, or established as none.');
    const transitions = entries(value.transitions, 'transition').map(entry => {
      const transition = record(entry, ['key', 'from', 'to', 'trigger', 'guard', 'effect'], 'transition');
      return { key: text(transition.key, 'transition key'), from: known(transition.from, 'transition source'), to: known(transition.to, 'transition target'),
        trigger: optional(transition.trigger, 'trigger'), guard: optional(transition.guard, 'guard'), effect: optional(transition.effect, 'effect') };
    });
    if (new Set(transitions.map(transition => transition.key)).size !== transitions.length) invalid('Duplicate transition key.');
    const covered = record(value.coverage, ['states', 'transitions'], 'state model coverage');
    if (!Array.isArray(value.unsupported ?? [])) invalid('Expected unsupported semantics array.');
    const model: StateModel = { bearer, states, initial, transitions,
      coverage: { states: coverage(covered.states, 'state'), transitions: coverage(covered.transitions, 'transition') },
      applicability: optional(value.applicability, 'applicability'), unsupported: ((value.unsupported ?? []) as unknown[]).map(item => text(item, 'unsupported semantics')) };
    return { body: model, entities: [...(bearer.kind === 'entity' ? [bearer.entity] : []), ...states.flatMap(state => state.entity ? [state.entity] : [])], content: [],
      components: [...states.map(state => `state:${state.key}`), ...transitions.map(transition => `transition:${transition.key}`)] };
  },
};

/** The architectural concept: vocabulary and guidance for identifying and explaining state-dependent behavior. */
export const stateBehaviorGuidance = [
  'STATE-DEPENDENT BEHAVIOR. Some things behave differently depending on a state they are in: a mode, phase or condition that persists until something changes it. Establish from the evidence whether the subject has such behavior, what bears the state, which states there are, how each is entered and left, and what each transition does. If the subject has no state-dependent behavior, say so and explain; do not invent states to fill the form.',
  'Supply one item of type "state-model" with body { bearer: { entity } or { role }, states: [{ key, label, description?, entity? }], initial: { kind: "state", state, condition? } or { kind: "unknown" } or { kind: "none" }, transitions: [{ key, from, to, trigger?, guard?, effect? }], coverage: { states, transitions }, applicability?, unsupported? }. Use short stable keys; from, to and the initial state name state keys. The trigger is the event or occurrence condition that causes the transition; the guard is an additional condition that must hold; the effect is what the transition does. Leave a field out when the evidence does not establish it. Coverage says whether you claim to have listed all states and transitions ("all"), only some ("some"), or cannot tell ("unknown"). Use initial kind "unknown" when the entry is not established and "none" only when you establish there is no distinguished entry.',
  'A state is a category of condition. Identify a state as an Entity only when it needs to be referred to again; otherwise its key within the model is enough. If the behavior needs nested states, parallel regions, history or concurrent access semantics, describe that under unsupported and in prose, not as extra flat states that would misstate it. Explain the behavior in a prose item as well: the model carries structure, the prose carries the reasoning and its limits.',
].join('\n');

export const stateDiagramContractId = 'postcode/state-diagram-answer@1';
/**
 * The result contract of an explicit state-diagram request: a designated answer selecting a
 * state model with at least one state. A prose answer does not meet it.
 */
export const stateDiagramContract: ResultContract = { id: stateDiagramContractId, requirements: [
  { kind: 'designated-answer', description: 'A designated answer to the state-behavior question.' },
  { kind: 'content', description: 'A state model from which a state-transition diagram can be drawn.', type: stateModelContract.type,
    unmet: body => (body as StateModel).states.length ? null : 'The state model establishes no states, so there is nothing to draw.' },
] };
