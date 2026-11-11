"""Check authored composition fixtures; optionally generate notation, not analysis.
Python 3, no dependencies. --write-diagrams updates Mermaid and traceability files.
No PostCode API calls or claim of semantic validation.
"""
import copy
import json
from pathlib import Path
import runpy
import sys
import textwrap

BASE = Path(__file__).resolve().parent
shared = runpy.run_path(str(BASE.parent / 'check-fixtures.py'))
read, check_result = shared['read'], shared['check_result']
ledger = read(BASE / 'context-and-bindings.json')
old_ledger = read(BASE.parent / 'children/context-and-bindings.json')
known = set(old_ledger['entry']['knownSubjects'])
for stage in ['firstAcceptance', 'followupAcceptance']:
    known.update(old_ledger[stage]['subjectIds'].values())
earlier = dict(shared['child_accounts'])
bulk = read(BASE / 'bulkhead-result.json')
bulk_accounts = check_result(bulk, ledger['bulkheadAcceptance'], known, earlier,
                             set(), set(ledger['bulkheadRequest']['suppliedEvidence']))
known.update(ledger['bulkheadAcceptance']['subjectIds'].values())
earlier.update({ledger['bulkheadAcceptance']['accountIds'][k]: a for k, a in bulk_accounts.items()})
request = ledger['compositionRequest']
complete = {x['account'] for x in request['suppliedAccountContext']}
assert complete <= set(earlier)
assert complete == set(ledger['exposure']['citations'])
assert {'ADMISSION-1', 'ADMISSION-2', 'TRIAL-1'} <= complete
for ev in ledger['evidence'].values():
    if 'account' in ev:
        assert ev['account'] in complete, 'undelivered interpretation contribution'
args = (ledger['compositionAcceptance'], known, earlier, complete, set(request['suppliedEvidence']))


def check(document):
    accounts = check_result(document, *args)
    for a in accounts.values():
        for item in a['content']:
            if item['form'] != 'interaction/0':
                continue
            assert item['conditions'] and item['notShown'] and not item['alternatives']
            roles = {r['key']: r for r in item['roles']}
            participants = {p['key']: p['role']['localRole'] for p in item['participants']}
            assert set(participants.values()) <= set(roles), 'unknown participant role'
            assert len(set(participants.values())) == len(participants), 'duplicate role participant'
            order = [r['localRole'] for r in item['policyOrder']]
            assert len(order) == len(set(order)) == 2
            assert all('policyKind' in roles[r] for r in order), 'nonpolicy in policy order'
            relations = {r['key']: r for r in item['relations']}
            assert len(relations) == len(item['relations']), 'duplicate relation key'
            for rel in relations.values():
                assert rel['when'] and rel['evidence']
                assert rel['kind'] in ['waits-for-decision', 'waits-for-capacity']
                owner = 'decisionHolder' if rel['kind'] == 'waits-for-decision' else 'capacityOwner'
                assert rel['waiter']['localRole'] in roles and rel[owner]['localRole'] in roles
            steps = {s['key']: s for s in item['prefix']}
            for s in steps.values():
                if s['kind'] == 'wait':
                    rel = relations[s['relationship']['localRelation']]
                    assert participants[s['participant']] == rel['waiter']['localRole']
                    owner = rel.get('decisionHolder', rel.get('capacityOwner'))
                    assert participants[s['on']] == owner['localRole']
            assert len({s['key'] for s in item['situations']}) == len(item['situations'])
            for snap in item['situations']:
                assert snap['afterStep'] in steps, 'unknown situation point'
                assert snap['evidence']
                assert all(r['localRelation'] in relations for r in snap['activeRelations'])
                for state in snap['stateAssignments']:
                    assert state['bearer']['localRole'] in roles
                    assert state['category']['subject'] in known
                for occupancy in snap['resourceOccupancy']:
                    assert occupancy['holder']['localRole'] in roles
                    assert occupancy['owner']['localRole'] in roles
                    assert occupancy['resource'] in RESOURCE_LABELS
                    assert isinstance(occupancy['amount'], int) and occupancy['amount'] > 0
                for progress in snap['executionProgress']:
                    assert progress['execution']['localRole'] in roles
                    assert progress['applicationWork'] in ['not-started', 'started']
    return accounts


RESOURCE_LABELS = {'execution-capacity': 'execution slot', 'queue-capacity': 'queue place',
                   'recovery-trial-slot': 'recovery trial slot'}
document = read(BASE / 'composition-result.json')
accounts = check(document)
accepted = set(ledger['compositionAcceptance']['accountIds'].values())
assert set(ledger['retainedAnswer']['selectedAccounts']) == accepted
assert set(ledger['retainedAnswer']['identifyingSupport']) <= set(earlier) | accepted


def first_item(d):
    return d['result']['accounts'][2]['content'][0]


mutations = {
    'unknown local relationship': lambda d: first_item(d)['prefix'][-1]['relationship'].update(localRelation='absent'),
    'unknown state bearer': lambda d: first_item(d)['situations'][0]['stateAssignments'][0].update(bearer={'localRole': 'absent'}),
    'unknown situation point': lambda d: first_item(d)['situations'][0].update(afterStep='absent'),
    'wrong wait endpoint': lambda d: first_item(d)['prefix'][-1].update(on='bulkhead'),
    'execution in policy order': lambda d: first_item(d)['policyOrder'].__setitem__(0, {'localRole': 'caller'}),
}
for name, mutate in mutations.items():
    invalid = copy.deepcopy(document)
    mutate(invalid)
    try:
        check(invalid)
    except (AssertionError, KeyError):
        continue
    raise AssertionError('Malformed composition accepted: ' + name)

# Rendering selects notation only. Snapshot content is asserted in JSON, not computed.
state_labels = {i['subject']['introducedSubject']: i['name']
                for a in read(BASE.parent / 'children/first-result.json')['result']['accounts']
                for i in a['content'] if i['form'] == 'subject-description/0'}
state_labels = {old_ledger['firstAcceptance']['subjectIds'][k]: v for k, v in state_labels.items()}
trace = []


def label(text):
    escaped = text.replace('&', '&amp;').replace(';', ',').replace('\n', ' ')
    return '<br/>'.join(textwrap.wrap(escaped, width=85))


for index, stem in [(2, 'bulkhead-outside'), (3, 'breaker-outside')]:
    a = document['result']['accounts'][index]
    item = a['content'][0]
    pointer = f'/result/accounts/{index}/content/0'
    labels = {r['key']: r['name'] for r in item['roles']}
    participants = {p['key']: f'p{n}' for n, p in enumerate(item['participants'])}
    role_participant = {p['role']['localRole']: participants[p['key']] for p in item['participants']}
    span = ','.join([next(iter(participants.values())), list(participants.values())[-1]])
    lines = ['sequenceDiagram', '    title ' + item['title']]
    for p in item['participants']:
        lines.append(f'    participant {participants[p["key"]]} as {p["label"]}')
    lines.append(f'    Note over {span}: {label(item["semantics"])}')
    lines.append(f'    Note over {span}: ' + label('Policy order: ' + ' then '.join(labels[r['localRole']] for r in item['policyOrder'])))
    for condition in item['conditions']:
        lines.append(f'    Note over {span}: {label(condition)}')
    trace.append({'diagram': stem + '.mmd', 'meaning': 'Title, roles, call order and declared scope',
                  'pointers': [pointer + '/' + k for k in ['title', 'roles', 'participants', 'roleScope', 'policyOrder', 'conditions', 'semantics']],
                  'qualificationPointer': f'/result/accounts/{index}/qualifications'})
    for n, step in enumerate(item['prefix']):
        if step['kind'] in ['request', 'response']:
            arrow = '->>' if step['kind'] == 'request' else '-->>'
            lines.append(f'    {participants[step["from"]]}{arrow}{participants[step["to"]]}: {label(step["text"])}')
        else:
            actors = participants[step['actor']] if step['kind'] == 'action' else ','.join([participants[step['participant']], participants[step['on']]])
            lines.append(f'    Note over {actors}: {label(step["text"])}')
        trace.append({'diagram': stem + '.mmd', 'meaning': step['key'], 'pointers': [pointer + f'/prefix/{n}']})
    for n, snap in enumerate(item['situations']):
        lines.append(f'    Note over {span}: Asserted situation after {snap["afterStep"]} - partial snapshot')
        for state in snap['stateAssignments']:
            r = state['bearer']['localRole']
            lines.append(f'    Note over {role_participant[r]}: State: {state_labels[state["category"]["subject"]]}')
        for occupancy in snap['resourceOccupancy']:
            holder, owner = occupancy['holder']['localRole'], occupancy['owner']['localRole']
            text = f'{labels[holder]} occupies {occupancy["amount"]} {RESOURCE_LABELS[occupancy["resource"]]} at {labels[owner]}'
            lines.append(f'    Note over {role_participant[holder]},{role_participant[owner]}: {label(text)}')
        for p in snap['executionProgress']:
            lines.append(f'    Note over {role_participant[p["execution"]["localRole"]]}: Application work: {p["applicationWork"]}')
        trace.append({'diagram': stem + '.mmd', 'meaning': 'Asserted state, resource occupancy and work progress', 'pointers': [pointer + f'/situations/{n}', pointer + '/relations']})
    trace.append({'diagram': stem + '.mmd', 'meaning': 'Support and omissions accompany this preview, not drawn as architecture', 'pointers': [pointer + '/evidence', pointer + '/notShown']})
    output = '\n'.join(lines) + '\n'
    path = BASE / (stem + '.mmd')
    if '--write-diagrams' in sys.argv:
        path.write_text(output)
    else:
        assert path.read_text() == output, 'notation differs from payload; regenerate deliberately'
for entry in trace:
    for pointer in entry['pointers'] + ([entry['qualificationPointer']] if 'qualificationPointer' in entry else []):
        value = document
        for part in pointer.strip('/').split('/'):
            value = value[int(part)] if isinstance(value, list) else value[part]
path = BASE / 'diagram-traceability.json'
if '--write-diagrams' in sys.argv:
    path.write_text(json.dumps(trace, indent=2) + '\n')
else:
    assert read(path) == trace
print('Composition results, local roles/relations, situation references, deliveries and diagram inputs pass; five malformed copies rejected.')
print('Scope/causality and source applicability require interpretive review. No product or end-to-end acceptance is established.')
