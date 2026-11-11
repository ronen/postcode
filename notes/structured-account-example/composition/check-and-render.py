"""Check authored composition fixtures; optionally generate notation, not analysis.
Python 3, no dependencies. --write-diagrams updates Mermaid and traceability files.
No PostCode API calls or claim of semantic validation.
"""
import copy
import json
from pathlib import Path
import runpy
import sys

BASE = Path(__file__).resolve().parent
shared = runpy.run_path(str(BASE.parent / 'check-fixtures.py'))
read, check_result = shared['read'], shared['check_result']
ledger = read(BASE / 'context-and-bindings.json')
old_ledger = read(BASE.parent / 'children/context-and-bindings.json')
known = set(old_ledger['entry']['knownEntities'])
for stage in ['firstAcceptance', 'followupAcceptance']:
    known.update(old_ledger[stage]['entityIds'].values())
earlier = dict(shared['child_investigrams'])
bulk = read(BASE / 'bulkhead-result.json')
bulk_investigrams = check_result(bulk, ledger['bulkheadAcceptance'], known, earlier,
                             set(), set(ledger['bulkheadRequest']['suppliedEvidence']))
known.update(ledger['bulkheadAcceptance']['entityIds'].values())
earlier.update({ledger['bulkheadAcceptance']['investigramIds'][k]: a for k, a in bulk_investigrams.items()})
request = ledger['compositionRequest']
complete = {x['investigram'] for x in request['suppliedInvestigramContext']}
assert complete <= set(earlier)
history = request['revisionHistory']
expected_exposure_index = complete | ({history['reporter']} if history['substantiveExplanationDelivered'] else set())
assert expected_exposure_index == set(ledger['exposure']['exposureIndex'])
assert {'ADMISSION-2', 'TRIAL-1'} <= complete
assert 'ADMISSION-1' not in complete | expected_exposure_index
assert 'ADMISSION-1' in request['notSupplied']
assert not any(history[k] for k in ['targetContentDelivered', 'completeCorrectionContext', 'claimsExemption'])
assert (history['relationship'], history['target'], history['replacement'], history['reporter']) == ('K', 'ADMISSION-1', 'ADMISSION-2', 'TRIAL-1')
selection = request['subjectSelection']
assert selection['kind'] == 'unordered-set'
assert len(selection['members']) == len(set(selection['members'])) == 2
assert set(selection['members']) == {'P', 'B'}
for ev in ledger['evidence'].values():
    if 'investigram' in ev:
        assert ev['investigram'] in complete, 'undelivered interpretation contribution'
args = (ledger['compositionAcceptance'], known, earlier, complete, set(request['suppliedEvidence']))


def check(document):
    investigrams = check_result(document, *args)
    for a in investigrams.values():
        for item in a['content']:
            if item['contentType'] != 'interaction/0':
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
                    assert state['category']['entity'] in known
                for occupancy in snap['resourceOccupancy']:
                    assert occupancy['holder']['localRole'] in roles
                    assert occupancy['owner']['localRole'] in roles
                    assert occupancy['resource'] in RESOURCE_LABELS
                    assert isinstance(occupancy['amount'], int) and occupancy['amount'] > 0
                for progress in snap['executionProgress']:
                    assert progress['execution']['localRole'] in roles
                    assert progress['applicationWork'] in ['not-started', 'started']
    return investigrams


RESOURCE_LABELS = {'execution-capacity': 'execution slot', 'queue-capacity': 'queue place',
                   'recovery-trial-slot': 'recovery trial slot'}
document = read(BASE / 'composition-result.json')
investigrams = check(document)
accepted = set(ledger['compositionAcceptance']['investigramIds'].values())
assert set(ledger['retainedAnswer']['selectedInvestigrams']) == accepted
assert set(ledger['retainedAnswer']['identifyingSupport']) <= set(earlier) | accepted


retained_investigrams = dict(earlier)
retained_investigrams.update({ledger['compositionAcceptance']['investigramIds'][k]: a for k, a in investigrams.items()})


def check_selection(selection, registry):
    assert isinstance(selection, dict) and set(selection) == {'investigram', 'contentKey', 'selector'}, 'invalid selection envelope'
    assert isinstance(selection['investigram'], str) and isinstance(selection['contentKey'], str)
    investigram = registry[selection['investigram']]
    items = [i for i in investigram['content'] if i['key'] == selection['contentKey']]
    assert len(items) == 1 and items[0]['contentType'] == 'interaction/0', 'not one interaction item'
    item, selector = items[0], selection['selector']
    assert isinstance(selector, dict)
    if selector.get('kind') == 'relation':
        assert set(selector) == {'kind', 'key'} and isinstance(selector['key'], str), 'invalid relation selector'
        matches = [r for r in item['relations'] if r['key'] == selector['key']]
        assert len(matches) == 1, 'unknown or ambiguous relation'
    elif selector.get('kind') == 'state-assignment':
        assert set(selector) == {'kind', 'situation', 'bearer', 'category'}, 'invalid state selector'
        assert isinstance(selector['situation'], str)
        assert isinstance(selector['bearer'], dict) and set(selector['bearer']) == {'localRole'}
        assert isinstance(selector['category'], dict) and set(selector['category']) == {'entity'}
        assert isinstance(selector['bearer']['localRole'], str) and isinstance(selector['category']['entity'], str)
        situations = [s for s in item['situations'] if s['key'] == selector['situation']]
        assert len(situations) == 1, 'unknown or ambiguous situation'
        assert selector['bearer']['localRole'] in {r['key'] for r in item['roles']}
        assert selector['category']['entity'] in known
        matches = [a for a in situations[0]['stateAssignments']
                   if a['bearer'] == selector['bearer'] and a['category'] == selector['category']]
        assert len(matches) == 1, 'unknown or ambiguous state assignment'
    else:
        raise AssertionError('unsupported selector kind')


for probe in ledger['followupProbes']:
    check_selection(probe['selection'], retained_investigrams)
assert ledger['patternFollowupRequest']['subject']['entity'] in ledger['compositionAcceptance']['entityIds'].values()
relation_selection = ledger['followupProbes'][0]['selection']
state_selection = ledger['followupProbes'][1]['selection']
selector_mutations = [
    ('mixed envelope fields', relation_selection, lambda s, r: s.update(localRelation='recovery-wait')),
    ('unsupported kind', relation_selection, lambda s, r: s['selector'].update(kind='role')),
    ('missing selector key', relation_selection, lambda s, r: s['selector'].pop('key')),
    ('unknown account', relation_selection, lambda s, r: s.update(investigram='absent')),
    ('unknown content', relation_selection, lambda s, r: s.update(contentKey='absent')),
    ('relation from another item', relation_selection, lambda s, r: s['selector'].update(key='capacity-wait')),
    ('nonexistent bearer/category pair', state_selection, lambda s, r: s['selector'].update(bearer={'localRole': 'bulkhead'})),
    ('unknown situation', state_selection, lambda s, r: s['selector'].update(situation='absent')),
    ('ambiguous assignment', state_selection, lambda s, r: r[s['investigram']]['content'][0]['situations'][0]['stateAssignments'].append(
        copy.deepcopy(r[s['investigram']]['content'][0]['situations'][0]['stateAssignments'][0]))),
]
for name, original, mutate in selector_mutations:
    invalid, registry = copy.deepcopy(original), copy.deepcopy(retained_investigrams)
    mutate(invalid, registry)
    try:
        check_selection(invalid, registry)
    except (AssertionError, KeyError):
        continue
    raise AssertionError('Invalid nested selection accepted: ' + name)


def first_item(d):
    return d['result']['investigrams'][2]['content'][0]


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

# Shared overview generation preserves full meanings in keyed legends.
overviews = runpy.run_path(str(BASE.parent / 'render-overviews.py'))
overviews['render_composition'](document, '--write-diagrams' in sys.argv)
print('Composition results, local roles/relations, situation references, deliveries and diagram/legend inputs pass; five malformed payload copies rejected.')
print('Both follow-up selections resolve; nine malformed or ambiguous nested selections rejected.')
print('Scope/causality and source applicability require interpretive review. No product or end-to-end acceptance is established.')
