"""Check complete authored guidance payloads and negative access/binding probes."""
import copy
import json
from pathlib import Path
import runpy

BASE = Path(__file__).resolve().parent
shared = runpy.run_path(str(BASE / 'check-fixtures.py'))
g = shared['guidance']
read = shared['read']
negative_count = 0


def rejected(label, fn):
    global negative_count
    try:
        fn()
    except (AssertionError, KeyError, TypeError):
        negative_count += 1
    else:
        raise AssertionError('Accepted invalid guidance: ' + label)


for directory in [BASE, BASE / 'children']:
    ledger = read(directory / 'context-and-bindings.json')
    access = read(directory / 'guidance-access.json')
    registry = {}
    for file, stage in [('first-result.json', 'firstAcceptance'), ('followup-result.json', 'followupAcceptance')]:
        registry.update(g['retained'](read(directory / file), ledger[stage]))
    saved = copy.deepcopy(registry)
    for name in ['completeOriginalDelivery', 'withoutOptionMetadata']:
        case = access[name]
        owner = registry[case['investigram']]
        delivery = g['own_delivery'](owner, case['includedParts'])
        assert g['complete_own_delivery'](owner, delivery) is case['expectedComplete']
    full = access['completeOriginalDelivery']
    assert full['basis'] == ledger['basis']['id'] and full['provenance']['request'] == 'firstRequest'
    owner = registry['ADMISSION-1']
    complete = g['own_delivery'](owner, full['includedParts'])
    envelope = {'own': complete, 'basis': full['basis'], 'provenance': full['provenance']}
    assert g['complete_delivery'](owner, envelope, ledger['basis']['id'], full['provenance'])
    for field in ['basis', 'provenance']:
        missing = copy.deepcopy(envelope); missing.pop(field)
        assert not g['complete_delivery'](owner, missing, ledger['basis']['id'], full['provenance'])
        wrong = copy.deepcopy(envelope); wrong[field] = 'wrong-context'
        assert not g['complete_delivery'](owner, wrong, ledger['basis']['id'], full['provenance'])
    for field in ['followupOptions', 'presentations', 'qualifications', 'referents', 'contentAssociations', 'children']:
        missing = copy.deepcopy(complete); missing.pop(field)
        assert not g['complete_own_delivery'](owner, missing), 'omitted metadata claimed complete'
    stripped = copy.deepcopy(complete); stripped['followupOptions'] = []
    assert not g['complete_own_delivery'](owner, stripped), 'empty list concealed existing option'
    old_option = g['metadata_excerpt'](registry, {'investigram': 'ADMISSION-1', 'optionKey': 'concurrent-callers-option'}, ledger['basis']['id'], full['provenance'])
    assert not g['complete_own_delivery'](owner, old_option), 'option excerpt became complete target'
    recommendation = access['presentationOnly']['delivery']
    actual = g['metadata_excerpt'](registry, recommendation['address'], recommendation['basis'], recommendation['provenance'])
    assert actual == recommendation, 'recommendation excerpt lost support or changed inputs'
    assert recommendation['basis'] == ledger['basis']['id']
    assert recommendation['provenance']['request'] == 'followupRequest'
    assert access['presentationOnly']['exposureIndexIfSuppliedToInvestigator'] == ['TRIAL-1']
    assert access['presentationOnly']['completeTargets'] == []
    assert not g['complete_own_delivery'](registry['TRIAL-1'], actual)
    plans = g['presentation_plans'](registry['TRIAL-1'], 'TRIAL-1')
    expected_plans = {x['address']['presentationKey']: x for x in access['presentationInputs']}
    assert len(plans) == len(expected_plans) == 2
    for plan in plans:
        rec = plan['recommendation']; expected = expected_plans[rec['key']]
        assert rec['diagramType'] == expected['diagramType']
        assert {role: {'investigram': addr['investigram']['investigram'], 'contentKey': addr['contentKey']} for role, addr in rec['inputs'].items()} == expected['bindings']
        assert {item['key'] for item, _ in list(plan['inputs'].values()) + list(plan['dependencies'].values())} == set(expected['availableForBoundedRender'])
    # The same inputs work without retained recommendations; resolve only content-declared dependencies.
    bare = copy.deepcopy(registry['TRIAL-1']); bare['presentations'] = []
    direct = [g['diagram_plan'](bare, x['diagramType'], x['inputs'], 'TRIAL-1') for x in access['directDiagramSelections']]
    assert direct == [{k: v for k, v in plan.items() if k != 'recommendation'} for plan in plans]
    sequence_selection = access['directDiagramSelections'][1]
    # A changed local key works when the content references change with it: no recovery-name convention.
    renamed = copy.deepcopy(bare)
    next(i for i in renamed['content'] if i['key'] == 'recovery')['key'] = 'renamed-model'
    interaction = next(i for i in renamed['content'] if i['key'] == 'concurrent-callers')
    for step in interaction['prefix'] + [s for b in interaction['alternatives'] for s in b['steps']]:
        if step['kind'] == 'state-transition':
            step['stateContent'] = 'renamed-model'
    resolved = g['diagram_plan'](renamed, sequence_selection['diagramType'], sequence_selection['inputs'], 'TRIAL-1')
    assert set(resolved['dependencies']) == {'renamed-model'}
    for label, mutate in {
        'missing state content': lambda a: a['content'].__setitem__(slice(None), [i for i in a['content'] if i['key'] != 'recovery']),
        'wrong dependency content type': lambda a: next(i for i in a['content'] if i['key'] == 'recovery').update(contentType='prose/0'),
        'unknown transition': lambda a: next(i for i in a['content'] if i['key'] == 'recovery').update(transitions=[]),
    }.items():
        invalid = copy.deepcopy(bare); mutate(invalid)
        rejected(label, lambda: g['diagram_plan'](invalid, sequence_selection['diagramType'], sequence_selection['inputs'], 'TRIAL-1'))
    changed = copy.deepcopy(registry['TRIAL-1'])
    changed['presentations'][1]['inputs']['stateModel'] = {'investigram': {'investigram': 'TRIAL-1'}, 'contentKey': 'recovery'}
    rejected('duplicate presentation dependency binding', lambda: g['presentation_plans'](changed, 'TRIAL-1'))
    for name, mutate in {
        'unknown diagram': lambda a: a['presentations'][0].update(diagramType='invented/0'),
        'missing input': lambda a: a['presentations'][0]['inputs'].clear(),
        'wrong content type': lambda a: a['presentations'][0]['inputs']['model'].update(contentKey='explanation'),
        'missing content': lambda a: a['presentations'][0]['inputs']['model'].update(contentKey='absent'),
        'entity as model': lambda a: a['presentations'][0]['inputs'].update(model={'entity':'R'}),
        'different owner': lambda a: a['presentations'][0]['inputs']['model'].update(investigram={'investigram':'ADMISSION-2'}),
        'option as model': lambda a: a['presentations'][0]['inputs'].update(model={'investigram':{'investigram':'TRIAL-1'},'optionKey':'recovery'}),
        'duplicate metadata key': lambda a: a['presentations'].append(copy.deepcopy(a['presentations'][0])),
        'unqualified recommendation': lambda a: a['presentations'][0].update(qualifications=[]),
    }.items():
        invalid = copy.deepcopy(registry['TRIAL-1']); mutate(invalid)
        rejected(name, lambda: g['presentation_plans'](invalid, 'TRIAL-1'))
    # Identical key spelling in another namespace or replacement is never a fallback.
    shadow = copy.deepcopy(registry)
    shadow['ADMISSION-1']['content'].append({'key':'concurrent-callers-option','contentType':'prose/0','text':'not an option'})
    assert g['metadata_excerpt'](shadow, old_option['address'], old_option['basis'], old_option['provenance']) == old_option
    shadow['ADMISSION-2']['followupOptions'] = copy.deepcopy(shadow['ADMISSION-1']['followupOptions'])
    shadow['ADMISSION-1']['followupOptions'] = []
    rejected('content/replacement fallback', lambda: g['metadata_excerpt'](shadow, old_option['address'], old_option['basis'], old_option['provenance']))
    rejected('content address used for metadata', lambda: g['metadata_excerpt'](registry, {'investigram':'TRIAL-1','contentKey':'recovery-state'}, actual['basis'], actual['provenance']))
    # Simulated candidate record, not a new architectural result: identical keys must not retarget.
    hypothetical = copy.deepcopy(registry)
    hypothetical['TRIAL-2'] = copy.deepcopy(hypothetical.pop('TRIAL-1'))
    rejected('missing original with same-key candidate', lambda: g['metadata_excerpt'](hypothetical, actual['address'], actual['basis'], actual['provenance']))
    assert registry == saved, 'access mutated retained fixture records'

print(f'Guidance metadata, complete-own delivery and explicit diagram bindings pass in both partitions; {negative_count} invalid guidance/address copies rejected.')
print('Missing own metadata and option/presentation excerpts do not confer completeness. No product, live investigation or general presentation-policy validation is claimed.')
