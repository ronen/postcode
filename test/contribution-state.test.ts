import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ContentCatalog, identificationContract, proseContract } from '../src/lib/contributions/catalog.js';
import { ContributionLedger } from '../src/lib/contributions/ledger.js';
import { InvalidContribution } from '../src/lib/contributions/model.js';
import type { EntityId, QueryResultId } from '../src/lib/contributions/model.js';
import { assessFulfillment } from '../src/lib/contributions/outcomes.js';
import { renderStateDiagram, stateDiagramIncompatibility } from '../src/lib/contributions/state-diagram.js';
import { stateBehaviorGuidance, stateDiagramContract, stateModelContract } from '../src/lib/contributions/state-model.js';
import type { StateModel } from '../src/lib/contributions/state-model.js';
import type { SessionId } from '../src/lib/records.js';

const session = 'session:22222222-2222-4222-8222-222222222222' as SessionId;
const caveat = { limitations: ['Interpretation from the supplied evidence.'] };
const agent = { mechanism: 'agentic' as const, method: 'test/state-behavior@1', agent: null };
const ledger = () => new ContributionLedger({ session, catalog: new ContentCatalog([proseContract, identificationContract, stateModelContract]) });
/** A circuit breaker account. The content is controlled test data, not a claim about any program. */
const breaker = (bearer: unknown) => ({ bearer, applicability: 'Default configuration only.',
  states: [{ key: 'closed', label: 'Closed', description: 'Requests pass through.' }, { key: 'open', label: 'Open' }, { key: 'half', label: 'Half-open', entity: { local: 'half-open' } }],
  initial: { kind: 'state', state: 'closed', condition: 'on construction' },
  transitions: [
    { key: 'trip', from: 'closed', to: 'open', trigger: 'failure count reaches the threshold', effect: 'starts the reset timer' },
    { key: 'probe', from: 'open', to: 'half', trigger: 'reset timer elapses' },
    { key: 'recover', from: 'half', to: 'closed', trigger: 'probe request succeeds', guard: 'no other probe is in flight', effect: 'clears the failure count' },
    { key: 'retrip', from: 'half', to: 'open', trigger: 'probe request fails' },
    { key: 'count', from: 'closed', to: 'closed', trigger: 'a request fails below the threshold', effect: 'increments the failure count' },
    { key: 'forced', from: 'closed', to: 'open' },
  ],
  coverage: { states: 'all', transitions: 'some' }, unsupported: ['Concurrent callers during the probe are not modelled.'] });
function accept(body: unknown) {
  const store = ledger(), handle = store.begin({ producer: agent });
  const accepted = store.accept([{ production: handle, contribution: { investigrams: [{ key: 'a', qualification: caveat,
    entities: [{ key: 'breaker', entityKind: 'module' }, { key: 'half-open', entityKind: 'state' }],
    items: [{ key: 'model', type: 'state-model', body },
      { key: 'b', type: 'identification', body: { name: 'Breaker', nameOrigin: 'assigned', designation: 'The circuit breaker' } },
      { key: 'h', type: 'identification', body: { name: 'Half-open', nameOrigin: 'assigned', designation: 'Probing state' } }],
    declarations: [{ key: 'ib', operation: 'add', target: { kind: 'entity', entity: { local: 'breaker' }, role: 'identification' }, members: [{ kind: 'item', item: { investigram: { local: 'a' }, item: 'b' } }] },
      { key: 'ih', operation: 'add', target: { kind: 'entity', entity: { local: 'half-open' }, role: 'identification' }, members: [{ kind: 'item', item: { investigram: { local: 'a' }, item: 'h' } }] }] }] } }]);
  const production = accepted.productions[0]!;
  return { store, entities: production.entities, item: store.item({ investigram: production.investigrams.a!, item: 'model' }) };
}

test('a state model retains its bearer, states, entry and transitions with exact references and local components', () => {
  const { entities, item } = accept(breaker({ entity: { local: 'breaker' } }));
  const model = item.body as StateModel;
  assert.deepEqual(model.bearer, { kind: 'entity', entity: entities.breaker });
  assert.deepEqual(model.states.map(state => [state.key, state.entity]), [['closed', null], ['open', null], ['half', entities['half-open']]]);
  assert.deepEqual([model.initial, model.coverage, model.transitions.length], [{ kind: 'state', state: 'closed', condition: 'on construction' }, { states: 'all', transitions: 'some' }, 6]);
  // What the account did not establish stays unestablished.
  assert.deepEqual(model.transitions.find(transition => transition.key === 'forced'), { key: 'forced', from: 'closed', to: 'open', trigger: null, guard: null, effect: null });
  // Explicit referents and locally addressable components, without an Entity for every node or edge.
  assert.deepEqual(item.referents, [entities.breaker, entities['half-open']]);
  assert.deepEqual(item.components.slice(0, 4), ['state:closed', 'state:open', 'state:half', 'transition:trip']);
  assert.equal((accept(breaker({ role: 'the admission gate in this scenario' })).item.body as StateModel).bearer.kind, 'role');
  const base = breaker({ entity: { local: 'breaker' } });
  const rejected: [RegExp, unknown][] = [
    [/exactly one of an Entity reference or a scoped role/, { ...base, bearer: {} }],
    [/exactly one of an Entity reference or a scoped role/, { ...base, bearer: { entity: { local: 'breaker' }, role: 'gate' } }],
    [/Unknown local Entity key/, { ...base, bearer: { entity: { local: 'missing' } } }],
    [/Duplicate state key/, { ...base, states: [...base.states, { key: 'open', label: 'Open again' }] }],
    [/transition target must be a state of this model/, { ...base, transitions: [{ key: 't', from: 'closed', to: 'tripped' }] }],
    [/initial state must be a state of this model/, { ...base, initial: { kind: 'state', state: 'idle' } }],
    [/state, unknown, or established as none/, { ...base, initial: { kind: 'absent' } }],
    [/coverage must be all, some or unknown/, { ...base, coverage: { states: 'complete', transitions: 'some' } }],
    [/Duplicate transition key/, { ...base, transitions: [base.transitions[0], base.transitions[0]] }],
    [/Unexpected state model field/, { ...base, regions: [] }],
  ];
  for (const [message, body] of rejected) assert.throws(() => accept(body), (error: unknown) => error instanceof InvalidContribution && message.test(error.message), String(message));
  assert.match(stateBehaviorGuidance, /do not invent states/);
});

test('the diagram arranges exactly the supplied states and transitions and carries their full meaning in its legend and notes', () => {
  const model = accept(breaker({ entity: { local: 'breaker' } })).item.body as StateModel;
  const diagram = renderStateDiagram(model, 'Breaker');
  const count = (pattern: RegExp) => diagram.svg.match(pattern)?.length ?? 0;
  // One node per supplied state, one edge per supplied transition plus the established entry marker; nothing else.
  assert.deepEqual([count(/<rect class="state"/g), count(/<path class="edge"/g), count(/<circle class="entry"/g)], [3, 7, 1]);
  assert.deepEqual([diagram.diagramType, diagram.legend.length, diagram.svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'), diagram.svg.endsWith('</svg>')], ['state-transition', 6, true, true]);
  // Conditions and effects survive in full even where the picture abbreviates them.
  assert.deepEqual(diagram.legend[2], { mnemonic: 'T3', from: 'Half-open', to: 'Closed', trigger: 'probe request succeeds', guard: 'no other probe is in flight', effect: 'clears the failure count' });
  assert.deepEqual(diagram.legend[5], { mnemonic: 'T6', from: 'Closed', to: 'Open', trigger: null, guard: null, effect: null });
  assert.match(diagram.svg, /T6 \(trigger not established\)/);
  assert.match(diagram.text, /T6 {2}Closed → Open\n {6}trigger: not established/);
  assert.match(diagram.text, /guard: no other probe is in flight/);
  // Scope and qualification accompany the picture.
  assert.deepEqual(diagram.notes.slice(1, 6), ['Entry: Closed, on construction.', 'States shown: the account claims these are all the states.',
    'Transitions shown: some transitions only; others may exist.', 'Applies to: Default configuration only.', 'Not representable in this diagram: Concurrent callers during the probe are not modelled.']);
  assert.match(diagram.notes.at(-1)!, /adds no state, transition or completeness claim/);
  assert.equal(renderStateDiagram(model, 'Breaker').svg, diagram.svg);
  // An entry that is not established is stated, never drawn; established absence is a different statement.
  const unknown = renderStateDiagram({ ...model, initial: { kind: 'unknown' }, coverage: { states: 'unknown', transitions: 'unknown' } }, 'Breaker');
  assert.deepEqual([unknown.svg.includes('class="entry"'), unknown.notes[1], unknown.notes[2]], [false, 'Entry: not established by this account. No entry marker is drawn.', 'States shown: whether other states exist is not established.']);
  assert.equal(renderStateDiagram({ ...model, initial: { kind: 'none' } }, 'Breaker').notes[1], 'Entry: this account establishes that there is no distinguished entry state.');
  // Agent-authored labels are data: markup and control characters are neutralized in every output.
  const hostile = renderStateDiagram({ ...model, states: [{ key: 'closed', label: '<script>alert(1)</script>\u001b[31m', description: null, entity: null }, ...model.states.slice(1)] }, '"><b>x');
  assert.equal(/<script|<b>/.test(hostile.svg), false);
  assert.equal((hostile.svg + hostile.text + hostile.notes.join('')).includes('\u001b'), false);
  assert.match(hostile.svg, /&#60;script&#62;/);
  assert.match(hostile.text, /<script>alert\(1\)<\/script>\\u001b\[31m/);
  // Missing content is not a rendering failure: an empty model is incompatible, and says why.
  const empty = { ...model, states: [], transitions: [], initial: { kind: 'unknown' as const } };
  assert.equal(stateDiagramIncompatibility(empty), 'The state model establishes no states.');
  assert.throws(() => renderStateDiagram(empty, 'Breaker'), /Incompatible state model/);
  assert.equal(stateDiagramIncompatibility(model), null);
});

test('an explicit state-diagram request is fulfilled only by state-model content, assessed for each alternative', () => {
  const store = ledger(), seed = store.begin({ producer: agent });
  const entity = store.accept([{ production: seed, contribution: { investigrams: [{ key: 's', qualification: caveat, entities: [{ key: 'm', entityKind: 'module' }],
    items: [{ key: 'id', type: 'identification', body: { name: 'Breaker', nameOrigin: 'assigned', designation: 'The breaker' } }],
    declarations: [{ key: 'i', operation: 'add', target: { kind: 'entity', entity: { local: 'm' }, role: 'identification' }, members: [{ kind: 'item', item: { investigram: { local: 's' }, item: 'id' } }] }] }] } }]).productions[0]!.entities.m as EntityId;
  const { result } = store.invoke({ operation: 'state-behavior', subjects: [{ role: null, subject: { kind: 'entity', entity } }], parameters: {}, context: [], resultContract: stateDiagramContract.id });
  const answer = (key: string, type: string, body: unknown, target: QueryResultId = result.id) => {
    const handle = store.begin({ producer: agent });
    return { investigram: store.accept([{ production: handle, contribution: { investigrams: [{ key, qualification: caveat, items: [{ key: 'c', type, body }],
      declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: target }, members: [{ kind: 'item', item: { investigram: { local: key }, item: 'c' } }] }] }] } }]).productions[0]!.investigrams[key]!, declaration: 'answer' };
  };
  assert.equal(assessFulfillment(store, stateDiagramContract, result.id).status, 'no-designated-answer');
  // Prose placed under a key does not fulfil the diagram requirement.
  const prose = answer('prose', 'prose', { text: 'It has three states: closed, open and half-open.' });
  assert.deepEqual(assessFulfillment(store, stateDiagramContract, result.id).alternatives, [{ designation: prose, standing: { state: 'standing', displacedBy: [] },
    unmet: [{ requirement: 'A state model from which a state-transition diagram can be drawn.', reason: 'The selected answer contains no state-model content.' }] }]);
  const model = { ...breaker({ entity }), states: breaker({ entity }).states.map(state => ({ key: state.key, label: state.label })) };
  const structured = answer('model', 'state-model', model);
  const empty = answer('empty', 'state-model', { ...model, states: [], transitions: [], initial: { kind: 'unknown' } });
  // Three equally standing alternatives: all preserved, only one renderable, the request not reported as fulfilled.
  const whole = assessFulfillment(store, stateDiagramContract, result.id);
  assert.deepEqual([whole.status, whole.alternatives.map(item => item.unmet.map(unmet => unmet.reason))],
    ['unfulfilled', [['The selected answer contains no state-model content.'], [], ['The state model establishes no states, so there is nothing to draw.']]]);
  assert.equal(assessFulfillment(store, stateDiagramContract, result.id, [structured]).status, 'fulfilled');
  assert.equal(assessFulfillment(store, stateDiagramContract, result.id, [empty]).status, 'unfulfilled');
});

test('several self-transitions on one state are drawn as distinct nested loops with separate captions', () => {
  const states = [{ key: 'below', label: 'Below threshold', description: null, entity: null }, { key: 'reached', label: 'Threshold reached', description: null, entity: null }];
  const loop = (key: string, at: string, trigger: string) => ({ key, from: at, to: at, trigger, guard: null, effect: null });
  // The live trial's shape: two self-transitions on each of two states, besides transitions between them.
  const model: StateModel = { bearer: { kind: 'role', role: 'breaker' }, states, initial: { kind: 'unknown' }, applicability: null, unsupported: [],
    coverage: { states: 'all', transitions: 'all' }, transitions: [loop('t1', 'below', 'failure() below threshold'), { key: 't2', from: 'below', to: 'reached', trigger: 'failure() reaches threshold', guard: null, effect: null },
      loop('t3', 'reached', 'failure() again'), loop('t4', 'below', 'success()'), { key: 't6', from: 'reached', to: 'below', trigger: 'success()', guard: null, effect: null }, loop('t7', 'reached', 'success() with zero threshold')] };
  const { svg } = renderStateDiagram(model, 'Breaker');
  const paths = [...svg.matchAll(/<path class="edge" d="([^"]+)"/g)].map(match => match[1]);
  const captions = [...svg.matchAll(/<text class="edge-label"[^>]* x="([^"]+)" y="([^"]+)">([^<]+)<\/text>/g)].map(match => ({ at: `${match[1]},${match[2]}`, text: match[3]! }));
  // One distinct path and one distinctly placed caption per supplied transition: none is hidden behind another.
  assert.equal(paths.length, 6);
  assert.equal(new Set(paths).size, 6);
  assert.equal(captions.length, 6);
  assert.equal(new Set(captions.map(caption => caption.at)).size, 6);
  assert.deepEqual(captions.map(caption => caption.text.split(' ')[0]).sort(), ['T1', 'T2', 'T3', 'T4', 'T5', 'T6']);
  // Captions are drawn after every state box, so none can be hidden behind one.
  assert.ok(svg.lastIndexOf('<rect class="state"') < svg.indexOf('<text class="edge-label"'));
  // Every coordinate stays inside the picture.
  const [width, height] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)!.slice(1).map(Number);
  for (const caption of captions) { const [x, y] = caption.at.split(',').map(Number); assert.ok(x! > 0 && x! < width! && y! > 0 && y! < height!, caption.at); }
});

test('Entity bearer diagrams use the derived label independently of Session identity', () => {
  const model = accept(breaker({ entity: { local: 'breaker' } })).item.body as StateModel;
  const original = renderStateDiagram(model, 'Breaker');
  const other: StateModel = { ...model, bearer: { kind: 'entity', entity: 'session:33333333-3333-4333-8333-333333333333:entity:other' as EntityId } };
  assert.deepEqual(renderStateDiagram(other, 'Breaker'), original);
  assert.ok(!JSON.stringify(original).includes('session:'));
  assert.match(original.text, /States of Breaker/);
});

test('duplicate and truncated state labels keep distinguishable state identities in picture, text and legends', () => {
  const model = accept({ bearer: { role: 'a request' },
    states: [{ key: 'w1', label: 'Waiting for primary response' }, { key: 'w2', label: 'Waiting for primary response (retry)' }, { key: 'd1', label: 'Done' }, { key: 'd2', label: 'Done' }],
    initial: { kind: 'state', state: 'w2' }, transitions: [{ key: 'first', from: 'w1', to: 'd1' }, { key: 'second', from: 'w2', to: 'd2' }],
    coverage: { states: 'some', transitions: 'some' } }).item.body as StateModel;
  const diagram = renderStateDiagram(model, 'Request');
  assert.deepEqual(diagram.stateLegend.map(state => [state.key, state.mnemonic]), [['w1', 'S1'], ['w2', 'S2'], ['d1', 'S3'], ['d2', 'S4']]);
  assert.deepEqual(diagram.legend.map(transition => [transition.from, transition.to]), [['S1: Waiting for primary response', 'S3: Done'], ['S2: Waiting for primary response (retry)', 'S4: Done']]);
  const labels = [...diagram.svg.matchAll(/<text class="state-label"[^>]*>([^<]*)<\/text>/g)].map(match => match[1]!);
  assert.equal(new Set(labels).size, 4);
  for (const state of diagram.stateLegend) {
    assert.ok(labels.some(label => label.startsWith(`${state.mnemonic}: `)));
    assert.ok(diagram.text.includes(`[${state.mnemonic}: ${state.label}]`));
  }
  assert.ok(diagram.notes.some(note => note.startsWith('Entry: S2: Waiting for primary response (retry)')));
  // Prefix collision alone must trigger disambiguation even when every full label is unique.
  const distinctFullLabels = { ...model, states: model.states.map(state => state.key.startsWith('d') ? { ...state, label: `Done ${state.key}` } : state) };
  assert.deepEqual(renderStateDiagram(distinctFullLabels, 'Request').stateLegend.map(state => state.mnemonic), ['S1', 'S2', 'S3', 'S4']);
});
