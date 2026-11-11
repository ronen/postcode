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
    for name in ['completeOriginalDelivery', 'withoutOfferMetadata']:
        case = access[name]
        owner = registry[case['account']]
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
    for field in ['offers', 'presentations', 'qualifications', 'referents', 'associations', 'children']:
        missing = copy.deepcopy(complete); missing.pop(field)
        assert not g['complete_own_delivery'](owner, missing), 'omitted metadata claimed complete'
    stripped = copy.deepcopy(complete); stripped['offers'] = []
    assert not g['complete_own_delivery'](owner, stripped), 'empty list concealed existing offer'
    old_offer = g['metadata_excerpt'](registry, {'account': 'ADMISSION-1', 'offerKey': 'concurrent-callers-offer'}, ledger['basis']['id'], full['provenance'])
    assert not g['complete_own_delivery'](owner, old_offer), 'offer excerpt became complete target'
    recommendation = access['presentationOnly']['delivery']
    actual = g['metadata_excerpt'](registry, recommendation['address'], recommendation['basis'], recommendation['provenance'])
    assert actual == recommendation, 'recommendation excerpt lost support or changed inputs'
    assert recommendation['basis'] == ledger['basis']['id']
    assert recommendation['provenance']['request'] == 'followupRequest'
    assert access['presentationOnly']['citationsIfSuppliedToInvestigator'] == ['TRIAL-1']
    assert access['presentationOnly']['completeTargets'] == []
    assert not g['complete_own_delivery'](registry['TRIAL-1'], actual)
    plans = g['presentation_plans'](registry['TRIAL-1'], 'TRIAL-1')
    expected_plans = {x['address']['presentationKey']: x for x in access['presentationInputs']}
    assert len(plans) == len(expected_plans) == 2
    for plan in plans:
        rec = plan['recommendation']; expected = expected_plans[rec['key']]
        assert rec['diagramType'] == expected['diagramType']
        assert {role: {'account': addr['account']['account'], 'contentKey': addr['contentKey']} for role, addr in rec['inputs'].items()} == expected['bindings']
        assert {item['key'] for item, _ in plan['inputs'].values()} == set(expected['availableForBoundedRender'])
    # The consumer receives only declared models; no content lookup by label or recovery convention.
    changed = copy.deepcopy(registry['TRIAL-1'])
    sequence = changed['presentations'][1]
    sequence['inputs'].pop('stateModel')
    rejected('undeclared sequence state dependency', lambda: g['presentation_plans'](changed, 'TRIAL-1'))
    for name, mutate in {
        'unknown diagram': lambda a: a['presentations'][0].update(diagramType='invented/0'),
        'missing input': lambda a: a['presentations'][0]['inputs'].clear(),
        'wrong form': lambda a: a['presentations'][0]['inputs']['model'].update(contentKey='explanation'),
        'missing content': lambda a: a['presentations'][0]['inputs']['model'].update(contentKey='absent'),
        'entity as model': lambda a: a['presentations'][0]['inputs'].update(model={'entity':'R'}),
        'different owner': lambda a: a['presentations'][0]['inputs']['model'].update(account={'account':'ADMISSION-2'}),
        'offer as model': lambda a: a['presentations'][0]['inputs'].update(model={'account':{'account':'TRIAL-1'},'offerKey':'recovery'}),
        'duplicate metadata key': lambda a: a['presentations'].append(copy.deepcopy(a['presentations'][0])),
        'unqualified recommendation': lambda a: a['presentations'][0].update(qualifications=[]),
    }.items():
        invalid = copy.deepcopy(registry['TRIAL-1']); mutate(invalid)
        rejected(name, lambda: g['presentation_plans'](invalid, 'TRIAL-1'))
    # Identical key spelling in another namespace or replacement is never a fallback.
    shadow = copy.deepcopy(registry)
    shadow['ADMISSION-1']['content'].append({'key':'concurrent-callers-offer','form':'prose/0','text':'not an offer'})
    assert g['metadata_excerpt'](shadow, old_offer['address'], old_offer['basis'], old_offer['provenance']) == old_offer
    shadow['ADMISSION-1']['offers'] = []
    rejected('content/replacement fallback', lambda: g['metadata_excerpt'](shadow, old_offer['address'], old_offer['basis'], old_offer['provenance']))
    rejected('content address used for metadata', lambda: g['metadata_excerpt'](registry, {'account':'TRIAL-1','contentKey':'recovery-state'}, actual['basis'], actual['provenance']))
    # Simulated candidate record, not a new architectural result: identical keys must not retarget.
    hypothetical = copy.deepcopy(registry)
    hypothetical['TRIAL-2'] = copy.deepcopy(hypothetical.pop('TRIAL-1'))
    rejected('missing original with same-key candidate', lambda: g['metadata_excerpt'](hypothetical, actual['address'], actual['basis'], actual['provenance']))
    assert registry == saved, 'access mutated retained fixture records'

print(f'Guidance metadata, complete-own delivery and explicit diagram bindings pass in both partitions; {negative_count} invalid guidance/address copies rejected.')
print('Missing own metadata and offer/presentation excerpts do not confer completeness. No product, live investigation or general presentation-policy validation is claimed.')
