import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { DialogInput } from '../src/lib/contributions/dialog.js';
import { chatGPTIdentity, openAIIdentity } from '../src/lib/investigation/openai/adapter.js';
import type { OpenAIExchange } from '../src/lib/investigation/openai/adapter.js';
import { contributionProtocol, contributionWireProtocol, openAIDialogAgent } from '../src/lib/investigation/openai/contribution-protocol.js';
import type { ReportedUsage } from '../src/lib/investigation/contracts.js';
import type { RecordId } from '../src/lib/records.js';

const sentinel = 'postcode-sentinel-secret-not-a-real-key';
const session = 'session:33333333-3333-4333-8333-333333333333';
const id = (kind: string, n: string) => `${session}:${kind}:${n.repeat(64)}`;
const entity = id('entity', 'a'), investigram = id('investigram', 'b'), module = id('module', 'c'), claim = id('claim', 'd'), result = id('query-result', 'e');
const literal = `The account mentions ${entity} in prose.`;
const input = { attempt: id('production', 'f') as RecordId, instructions: 'Explain the state-dependent behavior.',
  request: { invocation: id('invocation', '1'), result, operation: 'state-behavior', fresh: false, parameters: {}, resultContract: 'postcode/state-diagram-answer@1',
    subjects: [{ role: null, subject: { kind: 'entity', entity }, moduleRecord: module }] },
  notices: [{ change: { investigram, declaration: 'use' }, operation: 'withdraw', displaces: [{ investigram, declaration: 'old' }], establishes: null }],
  responses: [{ tool: 'contribution', kind: 'baseline', value: { entity, entityKind: 'module', identifications: [{ address: { investigram, declaration: 'identify' },
    owner: { investigram, production: id('production', '2'), qualification: { status: 'mechanically-derived', method: 'm', scope: `session:module:${'c'.repeat(64)}`, limitations: [literal], contexts: [claim] } },
    content: [{ address: { investigram, item: 'name' }, type: 'module-identification', item: { key: 'name', type: 'module-identification', body: { claim, name: 'breaker.ts', handle: 'breaker' }, evidence: [claim] } }] }] } }],
  remaining: { milliseconds: 10_000, calls: 5, toolCalls: 10, repairs: 1 } } as unknown as DialogInput;
const usage = { input_tokens: 10, output_tokens: 5, total_tokens: 15 };
const response = (output: unknown[]) => new Response(JSON.stringify({ id: 'resp', object: 'response', status: 'completed', model: 'gpt-6-sol', service_tier: 'default', usage, output }),
  { status: 200, headers: { 'content-type': 'application/json' } });
const call = (name: string, args: unknown) => ({ type: 'function_call', call_id: 'call_1', id: 'fc_1', status: 'completed', name, arguments: typeof args === 'string' ? args : JSON.stringify(args) });

test('the hosted transport carries the contribution dialog with exact handles and literal content', async () => {
  const sent: Record<string, any>[] = [], captures: OpenAIExchange[] = [], reported: ReportedUsage[] = [];
  let reply: (message: Record<string, any>) => unknown[] = () => [];
  const agent = openAIDialogAgent(sentinel, { onExchange: item => captures.push(item), fetch: async (url, options) => {
    assert.equal(String(url), 'https://api.openai.com/v1/responses');
    const body = JSON.parse(String(options?.body)); sent.push(body);
    return response(reply(JSON.parse(body.input.findLast((item: { role?: string }) => item.role === 'user').content)));
  } });
  // The identity records the protocol; routes and billing are those of the existing transports.
  assert.deepEqual([agent.identity.configuration.protocol, agent.identity.model, agent.identity.configuration.billingRoute], [contributionWireProtocol, openAIIdentity.model, 'openai-api']);
  assert.equal('protocol' in chatGPTIdentity.configuration, false);
  const dialogue = agent.open(), signal = new AbortController().signal;
  let handles: Record<string, string> = {};
  reply = message => {
    // Every identity reached the model as a short handle; names, local keys, prose and scope text are literal.
    const text = JSON.stringify(message);
    assert.equal(text.includes(session) && !text.includes(literal), false);
    const baseline = message.responses[0].value, identification = baseline.identifications[0];
    handles = { entity: message.request.subjects[0].subject.entity, module: message.request.subjects[0].moduleRecord, result: message.request.result,
      investigram: identification.address.investigram, claim: identification.content[0].item.body.claim };
    assert.deepEqual([baseline.entity, identification.owner.investigram, message.notices[0].change.investigram, identification.owner.qualification.contexts[0], identification.content[0].item.evidence[0]],
      [handles.entity, handles.investigram, handles.investigram, handles.claim, handles.claim]);
    assert.deepEqual([identification.content[0].item.body.name, identification.address.declaration, identification.owner.qualification.limitations[0], identification.owner.qualification.scope, message.request.resultContract],
      ['breaker.ts', 'identify', literal, `session:module:${'c'.repeat(64)}`, 'postcode/state-diagram-answer@1']);
    for (const handle of Object.values(handles)) assert.match(handle, /^r[\w-]+\.[0-9a-z]+$/);
    return [call('request_information', { requests: [{ kind: 'source', subject: handles.module }, { kind: 'association', association: { investigram: handles.investigram, declaration: 'identify' }, content: true },
      { kind: 'inventory', scope: { kind: 'entity', entity: handles.entity, role: 'topic', topic: null }, inventory: 'current-only' }, { kind: 'item', item: { investigram: 'made-up-handle', item: 'name' } }] })];
  };
  const requested = await dialogue.exchange(input, signal, item => reported.push(item));
  // Tool requests are decoded structurally to canonical identities; an unknown handle stays explicitly unresolvable.
  assert.deepEqual(requested, { kind: 'tools', requests: [{ kind: 'source', subject: module }, { kind: 'association', association: { investigram, declaration: 'identify' }, content: true },
    { kind: 'inventory', scope: { kind: 'entity', entity, role: 'topic', topic: null }, inventory: 'current-only' }, { kind: 'item', item: { investigram: 'invalid-investigator-reference:made-up-handle', item: 'name' } }] });
  assert.deepEqual(captures[0]!.references.resolutions.map(item => item.reference), [module, investigram, entity, null]);
  reply = message => {
    // A program-evidence response is translated by its typed record structure, and its host identity mapping by key.
    assert.deepEqual([message.responses, sent[1]!.input.some((item: { type?: string }) => item.type === 'function_call_output')], [undefined, true]);
    const output = JSON.parse(sent[1]!.input.find((item: { type?: string }) => item.type === 'function_call_output').output);
    assert.deepEqual([output[0].response.records[0].id, output[0].response.records[0].subject, output[0].entities[0], output[0].response.records[0].information.exportedName],
      [output[0].response.selected[0], handles.module, { record: handles.module, entity: handles.entity }, literal]);
    return [call('submit_contribution', { report: { answer: [{ investigram: handles.investigram, declaration: 'earlier-answer' }, { investigram: { local: 'states' }, declaration: 'answer' }] }, investigrams: [{ key: 'states', qualification: { limitations: [literal] }, referents: [handles.entity],
      entities: [{ key: 'open', entityKind: 'state' }],
      items: [{ key: 'model', type: 'state-model', evidence: [handles.claim], body: { bearer: { entity: handles.entity }, states: [{ key: 'open', label: 'Open', entity: { local: 'open' } }],
        initial: { kind: 'unknown' }, transitions: [], coverage: { states: 'some', transitions: 'unknown' } } }],
      declarations: [{ key: 'answer', operation: 'add', target: { kind: 'result', result: handles.result }, members: [{ kind: 'item', item: { investigram: { local: 'states' }, item: 'model' } }] },
        { key: 'w', operation: 'withdraw', displaces: [{ investigram: handles.investigram, declaration: 'identify' }], grounds: { text: literal } }] }] })];
  };
  const exported = { kind: 'claim', id: claim, session, method: 'm', subject: module, context: id('context', '3'), information: { type: 'export', exportedName: literal, symbol: null, origin: null, roles: null, routes: [] } };
  const submitted = await dialogue.exchange({ ...input, notices: [], responses: [{ tool: 'evidence', response: { status: 'available', records: [exported], selected: [claim], limitations: [] },
    entities: [{ record: module, entity }], retained: [], retainedOmitted: [] }] } as unknown as DialogInput, signal, item => reported.push(item));
  assert.equal(submitted.kind, 'submit');
  assert.deepEqual((submitted as { contribution: { report: unknown } }).contribution.report,
    { answer: [{ investigram, declaration: 'earlier-answer' }, { investigram: { local: 'states' }, declaration: 'answer' }] });
  const contribution = (submitted as { contribution: { investigrams: any[] } }).contribution.investigrams[0];
  assert.deepEqual([contribution.referents, contribution.items[0].evidence, contribution.items[0].body.bearer, contribution.items[0].body.states[0].entity, contribution.declarations[0].target.result,
    contribution.declarations[0].members[0].item, contribution.declarations[1].displaces, contribution.declarations[1].grounds.text, contribution.qualification.limitations],
    [[entity], [claim], { entity }, { local: 'open' }, result, { investigram: { local: 'states' }, item: 'model' }, [{ investigram, declaration: 'identify' }], literal, [literal]]);
  // Only the two PostCode functions are offered, the credential never enters the request body or captures, and usage is reported per call.
  assert.deepEqual(sent[0]!.tools.map((tool: { name: string }) => tool.name), ['request_information', 'submit_contribution']);
  // The submission schema closes the structures live agents got wrong: a report inside an investigram, an option's
  // request fields at its top level or stray values in its subjects, and grounds with fields other than text, evidence and support.
  const schema = sent[0]!.tools[1].parameters as Record<string, any>, shape = schema.properties.investigrams.items;
  assert.deepEqual([shape.additionalProperties, Object.hasOwn(shape.properties, 'report')], [false, false]);
  const option = shape.properties.options.items;
  assert.deepEqual([option.additionalProperties, option.required, option.properties.request.additionalProperties, option.properties.request.properties.subjects.items.required], [false, ['key', 'meaning', 'request'], false, ['subject']]);
  assert.deepEqual(Object.keys(shape.properties.declarations.items.properties.grounds.properties), ['text', 'evidence', 'support']);
  assert.equal(JSON.stringify([sent, captures]).includes(sentinel), false);
  assert.equal(reported.length, 2);
  dialogue.close();
  // A rejected submission is answered in the next exchange as the submission call's output, and the dialogue continues.
  const repairing = agent.open();
  reply = () => [call('submit_contribution', { investigrams: [{ key: 'x' }] })];
  assert.equal((await repairing.exchange(input, signal, () => {})).kind, 'submit');
  const sentBefore = sent.length;
  reply = () => [call('submit_contribution', { investigrams: [{ key: 'y', qualification: { limitations: ['q'] }, items: [] }] })];
  const repaired = await repairing.exchange({ ...input, notices: [], responses: [{ tool: 'invalid-submission', problem: 'A content item requires attributable qualification.' }] } as unknown as DialogInput, signal, () => {});
  assert.deepEqual((repaired as { contribution: { investigrams: { key: string }[] } }).contribution.investigrams.map(item => item.key), ['y']);
  const repairRequest = sent[sentBefore]!;
  const output = repairRequest.input.find((item: { type?: string }) => item.type === 'function_call_output');
  assert.deepEqual([output.call_id, JSON.parse(output.output)], ['call_1', [{ tool: 'invalid-submission', problem: 'A content item requires attributable qualification.' }]]);
  repairing.close();
  // An unparseable submission is still a submission for validation and repair; a malformed request ends the turn.
  const second = agent.open();
  reply = () => [call('submit_contribution', '{not json')];
  assert.deepEqual(await second.exchange(input, signal, () => {}), { kind: 'submit', contribution: null });
  second.close();
  const third = agent.open();
  reply = () => [call('request_information', { requests: 'everything' })];
  assert.deepEqual(await third.exchange(input, signal, () => {}), { kind: 'ended' });
  reply = () => [call('read_file', { path: '/etc/passwd' })];
  third.close();
  const fourth = agent.open();
  assert.deepEqual(await fourth.exchange(input, signal, () => {}), { kind: 'ended' });
  fourth.close();
  // A fresh dialog has a fresh handle table and no history.
  assert.equal(sent.at(-1)!.input.length, 1);
});

test('originating questions keep exact wire references and literal parameters separate', () => {
  const codec = contributionProtocol.codec();
  const origin = { invocation: 'session:origin:invocation:1', result: 'session:origin:query-result:1', fresh: false,
    request: { operation: 'original-question', subjects: [{ role: null, subject: { kind: 'entity', entity: 'session:origin:entity:1' } }],
      parameters: { entity: 'literal parameter', scenario: 'original-scope' }, context: [], resultContract: 'original-contract',
      option: { investigram: 'session:origin:investigram:1', key: 'session:literal-option-key' } } };
  const message = codec.message({ attempt: 'session:attempt' as never, instructions: '', request: { invocation: 'session:new:invocation:1', result: 'session:new:query-result:1', operation: 'examine-content', fresh: false,
    subjects: [], parameters: {}, resultContract: null }, notices: [], responses: [{ tool: 'contribution', kind: 'item', value: { owner: { origin } } }],
    remaining: { milliseconds: 1000, calls: 1, toolCalls: 1, repairs: 1 } } as unknown as DialogInput);
  const encoded = (message.responses as { value: { owner: { origin: typeof origin } } }[])[0]!.value.owner.origin;
  assert.notEqual(encoded.invocation, origin.invocation);
  assert.notEqual(encoded.result, origin.result);
  assert.equal(encoded.request.operation, origin.request.operation);
  assert.deepEqual(encoded.request.parameters, origin.request.parameters);
  assert.notEqual(encoded.request.option.investigram, origin.request.option.investigram);
  assert.equal(encoded.request.option.key, origin.request.option.key);
  const request = codec.tools({ requests: [{ kind: 'designations', result: encoded.result }] });
  assert.deepEqual(request, { kind: 'tools', requests: [{ kind: 'designations', result: origin.result }] });
  codec.close();
});

test('common native findings translate typed references while literal and unknown bodies stay exact', () => {
  const codec = contributionProtocol.codec();
  const native = (information: unknown) => ({ key: 'finding', type: 'native-finding', body: { record: claim,
    finding: { kind: 'claim', id: claim, session, method: 'controlled', subject: module, context: result, information } }, evidence: [claim] });
  const items = [
    native({ type: 'export', exportedName: entity, symbol: entity, origin: module, roles: null, routes: [{ via: module, kind: 'star' }] }),
    native({ type: 'module-placement', groups: [entity], candidates: [entity], artifacts: [module], reason: entity }),
    native({ type: 'group-containment', child: entity, reason: entity }),
    { key: 'opaque', type: 'future-type', body: { record: claim, finding: { subject: entity }, entity, evidence: [claim], text: literal }, evidence: [claim] },
    { key: 'prose', type: 'prose', body: { text: entity }, evidence: [claim] },
  ];
  const message = codec.message({ ...input, responses: [{ tool: 'contribution', kind: 'contribution', value: { items } }] });
  const encoded = (message.responses as { value: { items: typeof items } }[])[0]!.value.items;
  for (let index = 0; index < 3; index++) {
    const value = encoded[index]! as ReturnType<typeof native>;
    assert.notEqual(value.body.record, claim);
    assert.equal(value.body.record, value.body.finding.id);
    assert.equal(value.body.finding.subject, (message.content.request as { subjects: { moduleRecord: string }[] }).subjects[0]!.moduleRecord);
  }
  const information = (encoded[0]! as ReturnType<typeof native>).body.finding.information as { exportedName: string; symbol: string; origin: string; routes: { via: string }[] };
  assert.equal(information.exportedName, entity);
  assert.notEqual(information.symbol, entity);
  assert.equal(information.origin, information.routes[0]!.via);
  const placement = (encoded[1]! as ReturnType<typeof native>).body.finding.information as { groups: string[]; artifacts: string[]; reason: string };
  assert.notEqual(placement.groups[0], entity); assert.notEqual(placement.artifacts[0], module); assert.equal(placement.reason, entity);
  assert.deepEqual(encoded[3]!.body, items[3]!.body);
  assert.deepEqual(encoded[4]!.body, items[4]!.body);
  const decoded = codec.submission({ investigrams: [{ key: 'x', items: encoded.slice(3) }] }, false);
  assert.equal(decoded.kind, 'submit');
  const decodedItems = (decoded.contribution as { investigrams: { items: typeof items }[] }).investigrams[0]!.items;
  assert.deepEqual(decodedItems.map(item => item.body), items.slice(3).map(item => item.body));
  assert.ok(decodedItems.every(item => item.evidence[0] === claim));
  codec.close();
});
