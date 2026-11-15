"""Authored agent baseline: all non-displaced identifications, not a live-agent run."""
import copy
import json
from pathlib import Path
import runpy
import sys

BASE = Path(__file__).resolve().parent
helpers = runpy.run_path(str(BASE / 'check-additions.py'))
read, accept, renamed = helpers['read'], helpers['accept'], helpers['renamed']
rejected_count = 0


def reject(fn):
    global rejected_count
    try:
        fn()
    except (AssertionError, KeyError, TypeError):
        rejected_count += 1
    else:
        raise AssertionError('Invalid baseline accepted')


def consumer(model, template, suffix, subject):
    stage = renamed(template, suffix)
    context = model.initial_identification_context(subject)
    stage['request'].update(subject=subject, deliveries=context['selections'])
    stage['request']['declaredMeaning'] = {'question': 'Inspect the identified subjects', 'scope': 'Authored baseline-context validation'}
    bundle = stage['submission']['result']['investigrams'][0]
    bundle['title'] = 'Identification context receipt'
    bundle['referents'] = [{'entity': p['entity']} for p in context['deliveries']]
    bundle['qualifications'] = ['Authored acquisition control; records supplied context without a new architectural inference.']
    bundle['content'] = [{'key': 'receipt', 'concept': 'explanation', 'contentType': 'prose/0',
                          'text': f"Received {sum(len(p['declarations']) for p in context['deliveries'])} standing identification associations for the selected subjects.",
                          'evidence': bundle['evidence']}]
    bundle['associationSpecifications'][0]['members'] = [{'item': {
        'investigram': {'submittedInvestigram': bundle['key']}, 'contentKey': 'receipt'}}]
    return stage, context


def summary(context):
    return [{'entity': p['entity'], 'scope': p['selectionScope'],
             'associations': sorted(p['declarations']), 'items': sorted(p['items']),
             'notices': sorted(p['notices'])} for p in context['deliveries']]


def check(directory):
    model, _ = helpers['build_baseline'](directory, 'inventory')
    probes = read(directory / 'acquisition-probes.json')
    life = read(directory / 'lifecycle-probes.json')
    ledger = read(directory / 'context-and-bindings.json')
    seed = helpers['api']['initial_model'](directory, 'inventory')
    assert seed.initial_identification_context(ledger['firstRequest']['subject'])['selections'] == ledger['firstRequest']['deliveries']

    initial = model.initial_identification_context({'entities': ['S', 'R']})
    assert [p['entity'] for p in initial['deliveries']] == ['S', 'R']
    for p in initial['deliveries']:
        assert p['selectionScope']['roles'] == ['identification']
        assert 'inventory' not in p
        assert all(x['value']['target']['role'] == 'identification' for x in p['declarations'].values())
        assert all(x['sourceQualifications'] and x['sourceEvidence'] for x in p['items'].values())
    assert set(initial['deliveries'][0]['items']) != set(model.project({'entity': 'S', 'scopeSelection': {'roles': ['topic'], 'standing': 'undisplaced'}})['items'])

    # Two differently keyed identifications for S from one producer, alongside the older one.
    additions = copy.deepcopy(probes['additionalIdentification'])
    bundle = additions['submission']['result']['investigrams'][0]
    second = copy.deepcopy(bundle['content'][0])
    second.update(key='alternate-label', name='Recovery state', description='Another assigned label for the same retained state category; not a new Entity or a canonical rename.')
    bundle['content'].append(second)
    association = copy.deepcopy(bundle['associationSpecifications'][0])
    association['key'] = 'alternate-identification'
    association['members'][0]['item']['contentKey'] = 'alternate-label'
    bundle['associationSpecifications'].append(association)
    before_stage, before = consumer(model, probes['scopeSelected'], 'baseline-before', {'entity': 'S'})
    accept(model, before_stage, before['deliveries'])
    accept(model, additions)
    fresh = model.initial_identification_context({'entity': 'S'})
    assert len(fresh['deliveries'][0]['declarations']) == 3
    assert {'ADDITIONAL-ID-1::addition', 'ADDITIONAL-ID-1::alternate-identification'} <= set(fresh['deliveries'][0]['declarations'])
    assert {x['value']['name'] for x in fresh['deliveries'][0]['items'].values()} == {'Half-open', 'Recovery state'}
    assert {'ADDITIONAL-ID-1::addition', 'ADDITIONAL-ID-1::alternate-identification'} <= set(model.reconsideration()['evaluations']['Q-baseline-before'])
    fresh_stage, fresh_context = consumer(model, probes['scopeSelected'], 'baseline-informed', {'entity': 'S'})
    accept(model, fresh_stage, fresh_context['deliveries'])
    assert not model.reconsideration()['evaluations']['Q-baseline-informed']

    # Displacement removes the old association; warnings do not remove standing replacements.
    accept(model, life['expansion'])
    competing = renamed(life['expansion'], 'baseline-competing')
    accept(model, competing)
    current = model.initial_identification_context({'entity': 'S'})
    current_refs = set(current['deliveries'][0]['declarations'])
    old_refs = set(before['deliveries'][0]['declarations'])
    assert not old_refs & current_refs
    assert {'EXPANSION-1::expanded-identification', 'BASELINE-COMPETING::expanded-identification'} <= current_refs
    assert 'BASELINE-COMPETING::expanded-identification' in model.reconsideration()['investigrams']['EXPANSION-1']
    assert 'BASELINE-COMPETING::expanded-identification' in current['deliveries'][0]['notices']
    assert model.initial_identification_context({'entity': 'S'}, before['deliveries'][0]['asOfAcceptance']) == before

    # Empty identification is a disclosed empty scoped selection, not a fabricated description.
    empty_stage, empty = consumer(model, probes['scopeSelected'], 'baseline-empty', {'entity': 'M'})
    assert not empty['deliveries'][0]['items'] and not empty['deliveries'][0]['declarations']
    assert empty['deliveries'][0]['selectionScope']['coverage'] == 'all-undisplaced-in-scope'
    accept(model, empty_stage, empty['deliveries'])
    first = renamed(probes['additionalIdentification'], 'baseline-first-name')
    first['request'].update(subject={'entity': 'M'}, deliveries=[])
    new_bundle = first['submission']['result']['investigrams'][0]
    new_bundle['content'][0].update(subject={'entity': 'M'}, name='Breaker implementation', description='Assigned fixture label for the existing module reference, not an established source name.')
    new_bundle['associationSpecifications'][0]['target']['entity'] = {'entity': 'M'}
    new_bundle['referents'] = [{'entity': 'M'}]
    accept(model, first)
    assert 'BASELINE-FIRST-NAME::addition' in model.reconsideration()['evaluations']['Q-baseline-empty']

    reject(lambda: model.initial_identification_context({'entity': 'RESULT-Q1'}))
    reject(lambda: model.initial_identification_context({'entities': ['S', 'S']}))
    reject(lambda: model.initial_identification_context({'entity': 'missing'}))
    # Missing any part of a captured complete baseline cannot pass as that baseline.
    incomplete = copy.deepcopy(fresh_context['deliveries'])
    incomplete[0]['items'].pop(next(iter(incomplete[0]['items'])))
    copy_model = copy.deepcopy(model)
    before_reject = copy.deepcopy(copy_model.__dict__)
    reject(lambda: accept(copy_model, renamed(fresh_stage, 'baseline-malformed'), incomplete))
    assert copy_model.__dict__ == before_reject
    for name in [None, '', '   ']:
        malformed = renamed(probes['additionalIdentification'], 'baseline-bad-name')
        malformed['submission']['result']['investigrams'][0]['content'][0]['name'] = name
        copy_model = copy.deepcopy(model); before_reject = copy.deepcopy(copy_model.__dict__)
        reject(lambda: accept(copy_model, malformed))
        assert copy_model.__dict__ == before_reject

    report = {'initialMultipleSubjects': summary(initial), 'coexistingIdentifications': summary(fresh),
              'displacedExcludedConcernedIncluded': summary(current), 'emptyScopedSelection': summary(empty),
              'baselineRecipientAdditionCauses': model.reconsideration()['evaluations']['Q-baseline-before'],
              'emptyRecipientCause': model.reconsideration()['evaluations']['Q-baseline-empty'],
              'historicalContextUnchanged': True,
              'designationMeaning': 'entity-description/0 names are producer-assigned labels; mechanical names and paths retain their distinct contracts.',
              'limit': 'Authored context policy and integrity checks, not live-agent analysis or a universal context policy for Query results.'}
    path = directory / 'baseline-report.json'
    if '--write' in sys.argv: path.write_text(json.dumps(report, indent=2) + '\n')
    else: assert read(path) == report, 'stale baseline report'
    print(f'{directory.name}: all standing identifications supplied, alternatives preserved, warning/empty/history/timing checks pass.')


check(BASE)
check(BASE / 'children')
print(f'{rejected_count} malformed baseline/identification cases rejected.')
