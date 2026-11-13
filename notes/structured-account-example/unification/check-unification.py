"""Authored common-contribution probe, not native-provider or live-agent acceptance."""
import copy
import hashlib
import json
from pathlib import Path
import runpy
import sys

BASE = Path(__file__).resolve().parent
api = runpy.run_path(str(BASE.parent / 'model.py'))
Model, read, label = api['Model'], api['read'], api['label']


def qualification(item):
    assert item['qualification']['guarantee'] and item['qualification']['scope']
    assert item['evidence']


def module_identity(item):
    qualification(item)
    assert item['introducesEntity'] is True
    assert item['providerIdentity']['nativeEntity'] == item['subject']['entity']
    assert item['providerIdentity']['scope'] and item['providerIdentity']['provider']
    assert item['module']['handleStatus'] == 'generated-navigation-aid'
    assert item['module']['discoveryFacets'] and item['module']['sourcePath']
    # A mechanical module need not have a conceptual name or invented prose description.
    assert item['module']['name'] is None or isinstance(item['module']['name'], str)


def symbol_identity(item):
    qualification(item)
    assert item['introducesEntity'] is True
    assert item['providerIdentity']['nativeEntity'] == item['subject']['entity']
    assert item['symbol']['name'] and item['symbol']['declarationCount'] > 0
    assert set(item['symbol']['roles']) == {'type', 'value'}
    assert item['symbol']['origin']


def export_surface(item):
    qualification(item)
    assert item['coverage'] in {'complete-for-selected-surface', 'partial'}
    assert len({e['key'] for e in item['entries']}) == len(item['entries'])
    for entry in item['entries']:
        assert entry['exportedName'] and entry['route'] in {'direct', 'alias', 'reexport'}
        assert set(entry['roles']) == {'type', 'value'}
        assert all(isinstance(v, bool) for v in entry['roles'].values())


def dependencies(item):
    qualification(item)
    assert item['relationSemantics'] in {'source-request', 'conditional-load-attempt'}
    assert item['coverage']
    assert len({r['key'] for r in item['requests']}) == len(item['requests'])
    assert len({r['key'] for r in item['relationships']}) == len(item['relationships'])
    for request in item['requests']:
        assert request['mechanism'] == 'dynamic-import' and request['evidence']
        assert request['targetStatus'] in {'resolved', 'target-indeterminate'}
        assert (request['target'] is None) == (request['targetStatus'] == 'target-indeterminate')
    for relation in item['relationships']:
        assert relation['target'] and relation['condition'] and relation['effect'] and relation['evidence']


contracts = {'module-identification/0': {'identifying': True, 'validate': module_identity},
             'symbol-identification/0': {'identifying': True, 'validate': symbol_identity},
             'export-surface/0': {'validate': export_surface},
             'dependency-account/0': {'validate': dependencies}}
fixture = read(BASE / 'contributions.json')
for path, digest in fixture['basis']['sourceDigests'].items():
    assert hashlib.sha256((BASE / 'source' / path).read_bytes()).hexdigest() == digest
assert hashlib.sha256((BASE / 'source/tsconfig.json').read_bytes()).hexdigest() == fixture['basis']['configuration']
model = Model(fixture['seed'], fixture['basis'], 'inventory', contracts)
stages = {stage['request']['id']: stage for stage in fixture['stages']}


def accept(target, stage):
    target.accept(stage['submission'], stage['bindings'], stage['request'])


def select(entity, owner, key):
    return {'entity': entity, 'associations': [{'investigram': owner, 'associationKey': key}], 'items': [], 'options': []}


def delivery_summary(projection):
    return {'entity': projection['entity'], 'asOfAcceptance': projection['asOfAcceptance'],
            'items': projection['items'], 'notices': projection['notices']}


checkpoints = {}
for qid in ['Q-D', 'Q-E', 'Q-S', 'Q-I', 'Q-C']:
    accept(model, stages[qid])
    checkpoints[qid] = copy.deepcopy(model)
initial_entities = set(model.entities)
assert {e for e in model.entities if not e.startswith('RESULT-')} == {'PROJECT', 'M-loader', 'M-plugin', 'M-empty', 'S-load', 'S-target'}
assert model.entities['M-loader']['kind'] == 'architectural'
assert 'S-load' not in checkpoints['Q-D'].entities and 'S-load' in checkpoints['Q-E'].entities
assert model.items()[('EXPORTS-1', 'exports')]['entries'][0]['symbol'] == {'entity': 'S-load'}
assert 'name' not in model.items()[('DISCOVERY-1', 'loader')]
assert 'description' not in model.items()[('DISCOVERY-1', 'loader')]
assert model.items()[('EMPTY-EXPORTS-1', 'exports')]['entries'] == []
assert model.items()[('EMPTY-EXPORTS-1', 'exports')]['coverage'] == 'complete-for-selected-surface'
assert fixture['noContributionOutcome']['materialization'] == 'none'
assert fixture['noContributionOutcome']['contributions'] == []
assert model.standing(('DEPENDENCIES-1', 'dependencies'))['displacedBy'] == []
assert model.standing(('RUNTIME-1', 'runtime'))['displacedBy'] == []
static_before = model.qualified('DEPENDENCIES-1', model.items()[('DEPENDENCIES-1', 'dependencies')])
interpreted_before = model.qualified('RUNTIME-1', model.items()[('RUNTIME-1', 'dependency')])
assert static_before['basis'] != interpreted_before['basis']
assert static_before['provenance']['producer']['kind'] == 'mechanical'
assert interpreted_before['provenance']['producer']['kind'] == 'agentic'
assert static_before['value']['relationSemantics'] != interpreted_before['value']['relationSemantics']
# Mechanical export/dependency producers read captured source, not prior identifying prose.
assert model.queries['Q-E']['exposureIndex'] == [] and model.queries['Q-S']['exposureIndex'] == []
assert model.queries['Q-I']['sourceQueries'] == ['Q-D', 'Q-S']
combined_before = copy.deepcopy(model.snapshots['Q-C'])
source_before = copy.deepcopy(model.snapshots['Q-S'])
all_old_bundles = copy.deepcopy(model.investigrams)
# Recognized reuse returns existing identities; this is an access check, not a cache algorithm.
before_reuse = copy.deepcopy(model.__dict__)
reused_exports = copy.deepcopy(model.snapshots['Q-E'])
assert reused_exports == checkpoints['Q-E'].snapshots['Q-E']
assert model.__dict__ == before_reuse

accept(model, stages['Q-M'])
mechanical_cause = 'CONSTANT-TARGET-1::runtime'
assert model.standing(('RUNTIME-1', 'runtime'))['displacedBy'] == [mechanical_cause]
assert model.standing(('DEPENDENCIES-1', 'dependencies'))['displacedBy'] == []
mechanical_status = copy.deepcopy(model.reconsideration())
assert mechanical_cause in mechanical_status['evaluations']['Q-C']
assert mechanical_cause in mechanical_status['designations']['RUNTIME-1::result']['membershipCauses']
for qid in ['Q-D', 'Q-E', 'Q-S']:
    assert mechanical_status['evaluations'][qid] == []
mechanical_after = model.qualified('CONSTANT-TARGET-1', model.items()[('CONSTANT-TARGET-1', 'dependency')])
assert mechanical_after['provenance']['producer']['kind'] == 'mechanical'
assert mechanical_after['value']['qualification']['guarantee'] != interpreted_before['value']['qualification']['guarantee']
assert all(model.investigrams[k] == v for k, v in all_old_bundles.items())
assert model.snapshots['Q-C'] == combined_before and model.snapshots['Q-S'] == source_before

accept(model, stages['Q-R'])
interpreted_cause = 'RUNTIME-REFINED-1::runtime'
assert model.standing(('CONSTANT-TARGET-1', 'runtime'))['displacedBy'] == [interpreted_cause]
final = model.qualified('RUNTIME-REFINED-1', model.items()[('RUNTIME-REFINED-1', 'dependency')])
assert final['provenance']['producer']['kind'] == 'agentic'
assert final['value']['qualification']['guarantee'] != mechanical_after['value']['qualification']['guarantee']
assert model.qualified('CONSTANT-TARGET-1', model.items()[('CONSTANT-TARGET-1', 'dependency')]) == mechanical_after
assert model.qualified('DEPENDENCIES-1', model.items()[('DEPENDENCIES-1', 'dependencies')]) == static_before
assert model.snapshots['Q-C'] == combined_before
assert {e for e in model.entities if not e.startswith('RESULT-')} == initial_entities - {e for e in initial_entities if e.startswith('RESULT-')}
fresh_combined = model.project(select('RESULT-Q-C', 'COMBINED-1', 'result'))
assert {mechanical_cause, interpreted_cause} <= set(fresh_combined['notices'])
assert model.reconsideration()['evaluations']['Q-C'] == [mechanical_cause]
current = model.project({'entity': 'M-loader', 'scopeSelection': {'roles': ['describes'], 'standing': 'undisplaced'}})
assert set(current['declarations']) == {'EXPORTS-1::exports', 'DEPENDENCIES-1::dependencies', 'RUNTIME-REFINED-1::runtime'}
assert model.queries['Q-R']['deliveries'][0]['items']['CONSTANT-TARGET-1::dependency'] == mechanical_after

negative_count = 0

def reject(state, stage, change):
    global negative_count
    candidate = copy.deepcopy(state); before = copy.deepcopy(candidate.__dict__); bad = copy.deepcopy(stage)
    change(bad)
    try:
        accept(candidate, bad)
    except (AssertionError, KeyError, TypeError):
        negative_count += 1
    else:
        raise AssertionError('Malformed common contribution accepted')
    assert candidate.__dict__ == before


def first_item(stage): return stage['submission']['result']['investigrams'][0]['content'][0]
empty = Model(fixture['seed'], fixture['basis'], 'inventory', contracts)
reject(empty, stages['Q-D'], lambda s: first_item(s)['providerIdentity'].update(nativeEntity='wrong'))
reject(empty, stages['Q-D'], lambda s: s['bindings']['provenance']['producer'].update(kind='unknown'))
reject(empty, stages['Q-D'], lambda s: s['bindings']['provenance'].update(basis={}))
reject(empty, stages['Q-D'], lambda s: s['submission']['result']['investigrams'][0].update(provenance={'producer': {'kind': 'mechanical', 'method': 'forged'}, 'basis': {'forged': True}}))
reject(empty, stages['Q-D'], lambda s: first_item(s).update(contentType='unknown/0'))
reject(checkpoints['Q-D'], stages['Q-E'], lambda s: first_item(s)['qualification'].update(scope=''))
reject(checkpoints['Q-D'], stages['Q-E'], lambda s: first_item(s)['entries'].append(copy.deepcopy(first_item(s)['entries'][0])))
reject(checkpoints['Q-E'], stages['Q-S'], lambda s: first_item(s)['requests'][0].update(target={'entity': 'M-plugin'}))
reject(checkpoints['Q-S'], stages['Q-I'], lambda s: first_item(s)['relationships'][0].update(target={'entity': 'absent'}))
reject(checkpoints['Q-C'], stages['Q-M'], lambda s: s['submission']['result']['investigrams'][0]['associationSpecifications'][0]['displaces'][0].update(associationKey='absent'))
reject(checkpoints['Q-C'], stages['Q-M'], lambda s: s['submission']['result']['investigrams'][0]['associationSpecifications'][0].update(reason=''))
# A later contribution cannot claim to introduce the already established module under a new alias.
duplicate = copy.deepcopy(stages['Q-D']); duplicate['request'].update(id='Q-D2', resultEntity='RESULT-Q-D2')
duplicate['submission']['result']['queryInvocation']='Q-D2'; duplicate['bindings']['entityIds']['query-result']='RESULT-Q-D2'; duplicate['bindings']['investigramIds']['discovery']='DISCOVERY-2'
reject(checkpoints['Q-D'], duplicate, lambda s: None)

report = {'status': fixture['status'], 'acceptedInvocations': list(model.queries),
          'identities': {'architectural': ['PROJECT', 'M-loader', 'M-plugin', 'M-empty', 'S-load', 'S-target'], 'recognizedReuse': 'Q-E and RESULT-Q-E reused without allocation'},
          'complementary': {'mechanicalSourceRequest': static_before, 'interpretedConditionalTarget': interpreted_before},
          'crossMethodSupersession': {'laterMechanical': mechanical_after, 'laterInterpretation': final,
                                     'mechanicalStageCauses': mechanical_status['evaluations'],
                                     'finalCauses': model.reconsideration()['evaluations']},
          'emptyVersusUnavailable': {'establishedEmpty': model.qualified('EMPTY-EXPORTS-1', model.items()[('EMPTY-EXPORTS-1','exports')]),
                                    'unavailable': fixture['noContributionOutcome']},
          'currentAssociations': sorted(current['declarations']),
          'freshCombinedResult': delivery_summary(fresh_combined),
          'preservedHistoricalSelections': ['Q-S', 'Q-C', 'Q-E'], 'malformedCasesRejected': negative_count,
          'limits': ['No native producer, live interpreting agent, hypothetical constant-target method or runtime execution was run.',
                     'Per-contribution provenance and four small content contracts are exercised; the general migration and partial/failure result contract are not implemented.',
                     'Source facts/guarantees are authored and require qualified interpretation; structural checks do not certify their truth.',
                     'Recognized reuse is an exact-access demonstration, not an implementation or proof of the product cache key.',
                     'Warnings preserve cause identity; no clearance, semantic dependency inference or producer-based priority rule.']}
path = BASE / 'report.json'
if '--write' in sys.argv: path.write_text(json.dumps(report, indent=2)+'\n')
else: assert read(path) == report, 'stale unification report'
print(f'Common contributions: 7 accepted analyses; structured mechanical identification, complementary dependencies, supersession in both directions, exact history and qualified provenance pass; {negative_count} malformed cases rejected atomically.')
print('Authored design probe only: no native provider, new compiler method, live investigator, or runtime execution.')
