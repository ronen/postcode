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
    assert isinstance(item['introducesEntity'], bool)
    scope = item['providerIdentity']['basisScope']
    assert set(scope) == {'session', 'programState', 'configuration'} and all(scope.values())
    assert isinstance(item['providerIdentity']['nativeEntity'], str) and item['providerIdentity']['nativeEntity']
    assert item['providerIdentity']['scope'] and item['providerIdentity']['provider']
    assert item['module']['handleStatus'] == 'generated-navigation-aid'
    assert item['module']['discoveryFacets'] and item['module']['sourcePath']
    # A mechanical module need not have a conceptual name or invented prose description.
    assert item['module']['name'] is None or isinstance(item['module']['name'], str)


def symbol_identity(item):
    qualification(item)
    assert isinstance(item['introducesEntity'], bool)
    scope = item['providerIdentity']['basisScope']
    assert set(scope) == {'session', 'programState', 'configuration'} and all(scope.values())
    assert isinstance(item['providerIdentity']['nativeEntity'], str) and item['providerIdentity']['nativeEntity']
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
mechanical_cause = 'TARGET-ORGANIZATION-1::runtime'
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
assert ('CONSTANT-TARGET-1', 'runtime') not in model.declarations()
assert model.standing(('TARGET-ORGANIZATION-1', 'runtime'))['displacedBy'] == []
assert model.declarations()[('RUNTIME-REFINED-1', 'runtime')]['operation'] == 'addition'
final = model.qualified('RUNTIME-REFINED-1', model.items()[('RUNTIME-REFINED-1', 'dependency')])
assert final['provenance']['producer']['kind'] == 'agentic'
assert final['value']['qualification']['guarantee'] != mechanical_after['value']['qualification']['guarantee']
assert model.qualified('CONSTANT-TARGET-1', model.items()[('CONSTANT-TARGET-1', 'dependency')]) == mechanical_after
assert model.qualified('DEPENDENCIES-1', model.items()[('DEPENDENCIES-1', 'dependencies')]) == static_before
assert model.snapshots['Q-C'] == combined_before
assert {e for e in model.entities if not e.startswith('RESULT-')} == initial_entities - {e for e in initial_entities if e.startswith('RESULT-')}
fresh_combined = model.project(select('RESULT-Q-C', 'COMBINED-1', 'result'))
assert mechanical_cause in fresh_combined['notices']
assert 'RUNTIME-REFINED-1::runtime' not in fresh_combined['notices']
assert model.reconsideration()['evaluations']['Q-C'] == [mechanical_cause]
current = model.project({'entity': 'M-loader', 'scopeSelection': {'roles': ['describes'], 'standing': 'undisplaced'}})
assert set(current['declarations']) == {'EXPORTS-1::exports', 'DEPENDENCIES-1::dependencies', 'TARGET-ORGANIZATION-1::runtime', 'RUNTIME-REFINED-1::runtime'}
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
reject(empty, stages['Q-D'], lambda s: first_item(s)['providerIdentity'].update(nativeEntity=''))
reject(empty, stages['Q-D'], lambda s: first_item(s)['providerIdentity'].pop('basisScope'))
reject(empty, stages['Q-D'], lambda s: s['bindings']['provenance']['producer'].update(kind='unknown'))
reject(empty, stages['Q-D'], lambda s: s['bindings']['provenance'].update(basis={}))
reject(empty, stages['Q-D'], lambda s: s['submission']['result']['investigrams'][0].update(provenance={'producer': {'kind': 'mechanical', 'method': 'forged'}, 'basis': {'forged': True}}))
reject(empty, stages['Q-D'], lambda s: first_item(s).update(contentType='unknown/0'))
reject(checkpoints['Q-D'], stages['Q-E'], lambda s: first_item(s)['qualification'].update(scope=''))
reject(checkpoints['Q-D'], stages['Q-E'], lambda s: first_item(s)['entries'].append(copy.deepcopy(first_item(s)['entries'][0])))
reject(checkpoints['Q-E'], stages['Q-S'], lambda s: first_item(s)['requests'][0].update(target={'entity': 'M-plugin'}))
reject(checkpoints['Q-S'], stages['Q-I'], lambda s: first_item(s)['relationships'][0].update(target={'entity': 'absent'}))
reject(checkpoints['Q-C'], stages['Q-M'], lambda s: s['submission']['result']['investigrams'][1]['associationSpecifications'][0]['displaces'][0].update(associationKey='absent'))
reject(checkpoints['Q-C'], stages['Q-M'], lambda s: s['submission']['result']['investigrams'][1]['associationSpecifications'][0].update(reason=''))
# A fresh allocation collision is invalid; provider re-encounter is resolved before acceptance.
duplicate = copy.deepcopy(stages['Q-D']); duplicate['request'].update(id='Q-D2', resultEntity='RESULT-Q-D2')
duplicate['submission']['result']['queryInvocation']='Q-D2'; duplicate['bindings']['entityIds']['query-result']='RESULT-Q-D2'; duplicate['bindings']['investigramIds']['discovery']='DISCOVERY-2'
reject(checkpoints['Q-D'], duplicate, lambda s: None)

# Per-bundle provenance separates the calculation from the organizing judgment.
organization = model.qualified('TARGET-ORGANIZATION-1', model.declarations()[('TARGET-ORGANIZATION-1', 'runtime')])
assert organization['provenance']['producer']['kind'] == 'agentic'
assert 'provenance' not in model.queries['Q-M']
assert model.query_meaning('RESULT-Q-M')['basis'] == stages['Q-M']['bindings']['queryBasis']
assert model.investigrams['COMBINED-1']['provenance']['basis'] == {'retainedSelections': stages['Q-C']['request']['deliveries']}
assert 'sourceDigests' not in model.investigrams['COMBINED-1']['provenance']['basis']
reject(checkpoints['Q-C'], stages['Q-M'], lambda s: s['bindings']['provenanceByInvestigram'].pop('organization'))
reject(checkpoints['Q-C'], stages['Q-M'], lambda s: s['bindings'].update(provenance=s['bindings']['provenanceByInvestigram']['constant']))
reject(checkpoints['Q-C'], stages['Q-M'], lambda s: s['bindings']['provenanceByInvestigram']['organization'].update(basis={}))

# Host-side provider resolution is a separate positive path from raw allocation checks.
normalize = runpy.run_path(str(BASE / 'provider-identity.py'))['normalize']
rerun_model = copy.deepcopy(checkpoints['Q-D'])
normalized, reuse_report = normalize(rerun_model, duplicate)
assert len(normalized['bindings']['entityIds']) == 1  # Only the new invocation result.
assert normalized['submission']['result']['investigrams'][0]['content'] == []
accept(rerun_model, normalized)
assert set(rerun_model.entities) - set(checkpoints['Q-D'].entities) == {'RESULT-Q-D2'}
assert len([d for d in rerun_model.declarations().values() if d['target']['role'] == 'identifies']) == 3
assert rerun_model.queries['Q-D2']['deliveries'] == []
assert rerun_model.queries['Q-D2']['sourceQueries'] == []
assert rerun_model.queries['Q-D2']['exposureIndex'] == []
assert rerun_model.snapshots['Q-D'] == checkpoints['Q-D'].snapshots['Q-D']
# A different method can contribute new qualified identifications for the same entities.
changed = copy.deepcopy(duplicate)
changed['bindings']['provenance']['producer']['method'] = 'authored/discovery-revised@1'
changed, changed_report = normalize(checkpoints['Q-D'], changed)
changed_model = copy.deepcopy(checkpoints['Q-D']); accept(changed_model, changed)
assert len(changed_report['resolvedExistingEntities']) == 3 and not changed_report['reusedIdentifications']
assert len([d for d in changed_model.declarations().values() if d['target']['role'] == 'identifies']) == 6
assert all(not item['introducesEntity'] for item in changed_model.investigrams['DISCOVERY-2']['content'])
# Distinct native/common identities are exercised throughout, not just in a side branch.
assert all(item['providerIdentity']['nativeEntity'] != item['subject']['entity']
           for item in model.items().values() if 'providerIdentity' in item)
# A genuinely different identity scope allocates fresh common IDs, with no correspondence.
new_scope = copy.deepcopy(duplicate)
new_scope['bindings']['provenance']['basis']['programState'] = 'DISTINCT-IDENTITY-SCOPE'
for item in new_scope['submission']['result']['investigrams'][0]['content']:
    item['providerIdentity']['basisScope']['programState'] = 'DISTINCT-IDENTITY-SCOPE'
scoped_model = copy.deepcopy(checkpoints['Q-D'])
new_scope, scope_report = normalize(scoped_model, new_scope)
accept(scoped_model, new_scope)
assert len(scope_report['allocatedEntities']) == 3 and not scope_report['resolvedExistingEntities']
assert not set(scope_report['allocatedEntities'].values()) & set(checkpoints['Q-D'].entities)
assert {i['providerIdentity']['nativeEntity'] for i in scoped_model.investigrams['DISCOVERY-2']['content']} == {i['providerIdentity']['nativeEntity'] for i in scoped_model.investigrams['DISCOVERY-1']['content']}
assert len(scoped_model.entities) == len(checkpoints['Q-D'].entities) + 4
# Per-investigram attribution works on re-encounter too.
multi = copy.deepcopy(duplicate)
production = multi['bindings'].pop('provenance')
multi['bindings']['provenanceByInvestigram'] = {'discovery': production}
multi['bindings']['queryBasis'] = copy.deepcopy(production['basis'])
multi, multi_report = normalize(checkpoints['Q-D'], multi)
multi_model = copy.deepcopy(checkpoints['Q-D']); accept(multi_model, multi)
assert len(multi_report['reusedIdentifications']) == 3
assert multi_model.queries['Q-D2']['deliveries'] == []


def displace_identification(operation):
    """Authored organizing claim used only to test standing, not provider truth."""
    selection = select('M-loader', 'DISCOVERY-1', 'loader')
    declaration = {'key': 'loader', 'operation': operation,
                   'target': {'entity': {'entity': 'M-loader'}, 'role': 'identifies'},
                   'displaces': [{'investigram': {'investigram': 'DISCOVERY-1'}, 'associationKey': 'loader'}],
                   'reason': 'Authored standing probe: displace this identifying use; no claim that the native provider is faulty.'}
    # A supersession can select the same content for a differently qualified use.
    if operation == 'supersession':
        declaration['members'] = [{'item': {'investigram': {'investigram': 'DISCOVERY-1'}, 'contentKey': 'loader'}}]
    return {
        'request': {'id': 'Q-STANDING', 'operation': 'authored.displace-identification',
                    'subject': {'entity': 'M-loader'}, 'resultEntity': 'RESULT-Q-STANDING',
                    'deliveries': [selection], 'suppliedEvidence': ['E-standing'],
                    'declaredMeaning': {'question': 'Exercise identification standing', 'scope': 'Authored probe only'}},
        'bindings': {'entityIds': {'query-result': 'RESULT-Q-STANDING'},
                     'investigramIds': {'standing': 'STANDING-1'},
                     'provenance': {'producer': {'kind': 'agentic', 'method': 'authored/standing-probe@0'},
                                    'basis': {'retainedSelections': [selection]}}},
        'submission': {'result': {'queryInvocation': 'Q-STANDING',
                       'queryResult': {'introducedEntity': 'query-result'},
                       'compositionRoots': [{'submittedInvestigram': 'standing'}],
                       'investigrams': [{'key': 'standing', 'title': 'Identification standing probe',
                         'content': [], 'associationSpecifications': [declaration,
                            {'key': 'result', 'operation': 'addition',
                             'target': {'entity': {'introducedEntity': 'query-result'}, 'role': 'result'},
                             'members': [{'declaration': {'investigram': {'submittedInvestigram': 'standing'}, 'associationKey': 'loader'}}]}],
                         'referents': [], 'evidence': ['E-standing'],
                         'qualifications': ['A lifecycle-only probe, not an adjudication of provider semantics.'],
                         'children': [], 'followupOptions': [], 'presentations': []}]}}}


def selection_consumer(selection):
    stage = displace_identification('withdrawal')
    stage['request'].update(id='Q-RENEWAL-READER', resultEntity='RESULT-Q-RENEWAL-READER',
                            operation='authored.read-renewed-identification', deliveries=[selection])
    stage['bindings']['entityIds']['query-result'] = 'RESULT-Q-RENEWAL-READER'
    stage['bindings']['investigramIds']['standing'] = 'RENEWAL-READER-1'
    stage['bindings']['provenance']['basis'] = {'retainedSelections': [selection]}
    result = stage['submission']['result']; result['queryInvocation'] = 'Q-RENEWAL-READER'
    bundle = result['investigrams'][0]
    bundle['associationSpecifications'] = [bundle['associationSpecifications'][1]]
    bundle['associationSpecifications'][0]['members'] = [{'declaration': {'investigram': {'investigram': 'DISCOVERY-2'}, 'associationKey': 'loader'}}]
    return stage


def reject_delivery(state, stage, change):
    global negative_count
    candidate = copy.deepcopy(state); before = copy.deepcopy(candidate.__dict__)
    delivered = [candidate.project(x) for x in stage['request']['deliveries']]
    change(delivered[0])
    try:
        candidate.accept(stage['submission'], stage['bindings'], stage['request'], delivered=delivered)
    except AssertionError:
        negative_count += 1
    else:
        raise AssertionError('Incomplete renewal disclosure accepted')
    assert candidate.__dict__ == before


renewals = {}
for operation in ['supersession', 'withdrawal']:
    # Displacement AFTER equality reuse affects result membership, not an invented delivery.
    after_reuse = copy.deepcopy(rerun_model)
    accept(after_reuse, displace_identification(operation))
    status = after_reuse.reconsideration()
    assert status['evaluations']['Q-D2'] == []
    assert status['designations']['DISCOVERY-2::result']['membershipCauses'] == ['STANDING-1::loader']
    # Displacement BEFORE the new run prevents redirecting to the old association.
    renewal_model = copy.deepcopy(checkpoints['Q-D'])
    accept(renewal_model, displace_identification(operation))
    normalized, renewal_report = normalize(renewal_model, duplicate)
    renewal_base = copy.deepcopy(renewal_model)
    accept(renewal_model, normalized)
    assert renewal_report['skippedDisplacedIdentifications'] == ['DISCOVERY-1::loader']
    assert renewal_report['reusedIdentifications'] == ['DISCOVERY-1::plugin', 'DISCOVERY-1::empty']
    assert renewal_model.standing(('DISCOVERY-1', 'loader'))['displacedBy'] == ['STANDING-1::loader']
    assert renewal_model.declarations()[('DISCOVERY-2', 'loader')]['operation'] == 'addition'
    assert renewal_model.standing(('STANDING-1', 'loader'))['displacedBy'] == []
    assert renewal_model.investigrams['DISCOVERY-2']['provenance'] == duplicate['bindings']['provenance']
    assert renewal_model.queries['Q-D2']['deliveries'] == []
    assert renewal_model.queries['Q-D2']['sourceQueries'] == []
    assert renewal_model.reconsideration()['designations']['DISCOVERY-2::result']['needsReconsideration'] == []
    current_identifies = renewal_model.project({'entity': 'M-loader', 'scopeSelection': {'roles': ['identifies'], 'standing': 'undisplaced'}})
    expected = {'DISCOVERY-2::loader'} | ({'STANDING-1::loader'} if operation == 'supersession' else set())
    assert set(current_identifies['declarations']) == expected
    # Fresh scope, exact and excerpt deliveries carry history, never old content by implication.
    exact = select('M-loader', 'DISCOVERY-2', 'loader')
    fresh = renewal_model.project(exact)
    history = fresh['renewalHistory']
    assert set(history) == {'DISCOVERY-2::loader'}
    assert history['DISCOVERY-2::loader']['establishedBy'] == 'authored/provider-qualified-equality@0'
    assert history['DISCOVERY-2::loader']['previousAssociations'] == [{'investigram': {'investigram': 'DISCOVERY-1'}, 'associationKey': 'loader'}]
    assert fresh['notices']['STANDING-1::loader']['value']['reason'] == displace_identification(operation)['submission']['result']['investigrams'][0]['associationSpecifications'][0]['reason']
    assert 'DISCOVERY-1::loader' not in fresh['items'] and 'DISCOVERY-1::loader' not in fresh['associationUses']
    assert 'STANDING-1::loader' in current_identifies['notices']
    excerpt = renewal_model.project({'entity': 'M-loader', 'items': [{'investigram': 'DISCOVERY-2', 'contentKey': 'loader', 'viaAssociation': {'investigram': 'DISCOVERY-2', 'associationKey': 'loader'}}]})
    assert excerpt['renewalHistory'] == history and excerpt['notices'] == fresh['notices']
    assert 'renewalHistory' not in renewal_model.project({'entity': 'M-loader', 'inventory': {'roles': ['identifies']}})
    consumer = selection_consumer(exact)
    reject_delivery(renewal_model, consumer, lambda p: p.pop('renewalHistory'))
    reject_delivery(renewal_model, consumer, lambda p: p['notices'].pop('STANDING-1::loader'))
    reject_delivery(renewal_model, consumer, lambda p: p['notices']['STANDING-1::loader']['value'].update(reason='altered'))
    reader_model = copy.deepcopy(renewal_model); accept(reader_model, consumer)
    assert reader_model.queries['Q-RENEWAL-READER']['sourceQueries'] == ['Q-D2', 'Q-STANDING']
    assert reader_model.reconsideration()['evaluations']['Q-RENEWAL-READER'] == []
    # A renewal delivered as a substantive reconsideration notice discloses history too.
    notice_model = copy.deepcopy(renewal_base)
    inventory_reader = selection_consumer({'entity': 'M-loader', 'inventory': {'roles': ['identifies']}})
    inventory_reader['submission']['result']['investigrams'][0]['associationSpecifications'][0]['members'] = [{'item': {'investigram': {'investigram': 'DISCOVERY-1'}, 'contentKey': 'loader'}}]
    accept(notice_model, inventory_reader)
    accept(notice_model, normalized)
    notice_projection = notice_model.project(select('RESULT-Q-RENEWAL-READER', 'RENEWAL-READER-1', 'result'))
    assert 'DISCOVERY-2::loader' in notice_projection['notices']
    assert 'DISCOVERY-2::loader' in notice_projection['renewalHistory']
    assert 'STANDING-1::loader' in notice_projection['notices']
    # Reusing a renewed association retains its history on subsequent fresh delivery.
    again = copy.deepcopy(duplicate)
    again['request'].update(id='Q-D3', resultEntity='RESULT-Q-D3')
    again['bindings']['entityIds']['query-result'] = 'RESULT-Q-D3'
    again['bindings']['investigramIds']['discovery'] = 'DISCOVERY-3'
    again['submission']['result']['queryInvocation'] = 'Q-D3'
    again, again_report = normalize(renewal_model, again)
    repeated_model = copy.deepcopy(renewal_model); accept(repeated_model, again)
    repeated = repeated_model.project(select('RESULT-Q-D3', 'DISCOVERY-3', 'result'))
    assert 'DISCOVERY-2::loader' in repeated['renewalHistory'] and 'STANDING-1::loader' in repeated['notices']
    assert repeated_model.queries['Q-D3']['deliveries'] == []
    renewals[operation] = {'normalization': renewal_report,
                          'originalStanding': renewal_model.standing(('DISCOVERY-1', 'loader')),
                          'freshRenewalHistory': fresh['renewalHistory'], 'freshNotices': fresh['notices'],
                          'readerSourceQueries': reader_model.queries['Q-RENEWAL-READER']['sourceQueries'],
                          'currentIdentifications': sorted(current_identifies['declarations']),
                          'afterReuseEvaluationCauses': status['evaluations']['Q-D2'],
                          'afterReuseMembershipCauses': status['designations']['DISCOVERY-2::result']['membershipCauses']}

# Malformed host history must not forge identity/equivalence authority or future links.
reject(renewal_base, normalized, lambda s: s['bindings']['renewals'][0]['previousAssociations'][0].update(associationKey='absent'))
reject(renewal_base, normalized, lambda s: s['bindings']['renewals'][0]['previousAssociations'][0].update(associationKey='plugin'))
reject(renewal_base, normalized, lambda s: s['bindings']['renewals'][0].update(previousAssociations=[]))
reject(renewal_base, normalized, lambda s: s['bindings']['renewals'][0].update(establishedBy='agent-asserted-equivalence'))
reject(renewal_base, normalized, lambda s: s['submission']['result']['investigrams'][0]['associationSpecifications'][0].update(renewalHistory={'forged': True}))

# One organizer association supplies submission-wide reachability of the mechanical item.
assert model.investigrams['CONSTANT-TARGET-1']['associationSpecifications'] == []
assert model.expand(('TARGET-ORGANIZATION-1', 'result'))[1] == {('CONSTANT-TARGET-1', 'dependency')}
assert len([r for r in current['declarations'] if r == 'TARGET-ORGANIZATION-1::runtime']) == 1
assert model.snapshots['Q-M']['items']['CONSTANT-TARGET-1::dependency'] == mechanical_after
# Removing that association's item is rejected as unassociated content; owner-local is not required.
reject(checkpoints['Q-C'], stages['Q-M'], lambda s: s['submission']['result']['investigrams'][1]['associationSpecifications'][0].update(members=[{'item': {'investigram': {'investigram': 'RUNTIME-1'}, 'contentKey': 'dependency'}}]))
assert final['basis']['sourceAnalysis'] == stages['Q-M']['bindings']['provenanceByInvestigram']['constant']['basis']
assert final['basis']['retainedSelections'] == stages['Q-R']['request']['deliveries']

# Change the organizing use without retracting or reparenting the mechanical finding.
reorganization_stage = read(BASE / 'organization-renewal.json')
reorganized = copy.deepcopy(model)
original_items = copy.deepcopy(model.items())
original_snapshots = copy.deepcopy(model.snapshots)
accept(reorganized, reorganization_stage)
assert reorganized.items() == original_items
assert all(reorganized.snapshots[q] == snapshot for q, snapshot in original_snapshots.items())
assert reorganized.standing(('TARGET-ORGANIZATION-1', 'runtime'))['displacedBy'] == ['TARGET-REORGANIZATION-1::withdraw-organizing-use']
assert reorganized.standing(('RUNTIME-1', 'runtime'))['displacedBy'] == ['TARGET-ORGANIZATION-1::runtime']
selection = reorganized.project({'entity': 'M-loader', 'scopeSelection': {'roles': ['describes'], 'standing': 'undisplaced'}})
assert set(selection['declarations']) == {'EXPORTS-1::exports', 'DEPENDENCIES-1::dependencies', 'RUNTIME-REFINED-1::runtime', 'TARGET-REORGANIZATION-1::retain-finding'}
assert selection['items']['CONSTANT-TARGET-1::dependency'] == mechanical_after
assert reorganized.snapshots['Q-O']['items']['CONSTANT-TARGET-1::dependency'] == mechanical_after
assert reorganized.investigrams['TARGET-REORGANIZATION-1']['content'] == []
assert 'TARGET-REORGANIZATION-1::withdraw-organizing-use' in reorganized.reconsideration()['designations']['TARGET-ORGANIZATION-1::result']['membershipCauses']
# Optional restoration of the earlier interpretation is also explicit addition of old content.
restore_stage = copy.deepcopy(reorganization_stage)
restore_stage['request']['deliveries'].append(select('M-loader', 'RUNTIME-1', 'runtime'))
restore_stage['bindings']['provenance']['basis']['retainedSelections'] = copy.deepcopy(restore_stage['request']['deliveries'])
bundle = restore_stage['submission']['result']['investigrams'][0]
restore = copy.deepcopy(bundle['associationSpecifications'][1])
restore.update(key='restore-inference', reason='Use the earlier qualified inference alongside the mechanical finding; no earlier association is reinstated.',
               members=[{'item': {'investigram': {'investigram': 'RUNTIME-1'}, 'contentKey': 'dependency'}}])
bundle['associationSpecifications'].append(restore)
bundle['associationSpecifications'][2]['members'].append({'declaration': {'investigram': {'submittedInvestigram': 'reorganization'}, 'associationKey': 'restore-inference'}})
restored = copy.deepcopy(model); accept(restored, restore_stage)
assert restored.standing(('RUNTIME-1', 'runtime'))['displacedBy'] == ['TARGET-ORGANIZATION-1::runtime']
assert restored.items() == original_items
restored_selection = restored.project({'entity': 'M-loader', 'scopeSelection': {'roles': ['describes'], 'standing': 'undisplaced'}})
assert 'TARGET-REORGANIZATION-1::restore-inference' in restored_selection['declarations']
assert restored_selection['items']['RUNTIME-1::dependency'] == interpreted_before
reorganization_report = {'currentAssociations': sorted(selection['declarations']),
                        'mechanicalItem': selection['items']['CONSTANT-TARGET-1::dependency'],
                        'earlierInferenceStanding': reorganized.standing(('RUNTIME-1', 'runtime')),
                        'organizingAssociationStanding': reorganized.standing(('TARGET-ORGANIZATION-1', 'runtime')),
                        'optionalRestorationAssociations': sorted(restored_selection['declarations']),
                        'originalItemsAndCapturedAnswersUnchanged': True}

report = {'status': fixture['status'], 'acceptedInvocations': list(model.queries),
          'identities': {'architectural': ['PROJECT', 'M-loader', 'M-plugin', 'M-empty', 'S-load', 'S-target'], 'recognizedReuse': 'Q-E and RESULT-Q-E reused without allocation', 'providerReencounter': reuse_report, 'changedMethodReencounter': changed_report, 'newIdentityScope': scope_report, 'perInvestigramProvenanceReencounter': multi_report, 'renewalAfterDisplacement': renewals},
          'complementary': {'mechanicalSourceRequest': static_before, 'interpretedConditionalTarget': interpreted_before},
          'qualifiedOrganizationAndAddition': {'laterMechanical': mechanical_after, 'organizingDeclaration': organization, 'complementaryInterpretation': final,
                                     'organizingStageCauses': mechanical_status['evaluations'],
                                     'finalCauses': model.reconsideration()['evaluations']},
          'emptyVersusUnavailable': {'establishedEmpty': model.qualified('EMPTY-EXPORTS-1', model.items()[('EMPTY-EXPORTS-1','exports')]),
                                    'unavailable': fixture['noContributionOutcome']},
          'currentAssociations': sorted(current['declarations']),
          'withdrawalPlusAddition': reorganization_report,
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
print(f'Common contributions: 7 accepted invocations plus 6 provider re-encounter branches and organizing-use renewal/restoration; separate mechanical/organizing provenance, complementary additions, exact history and qualified basis pass; {negative_count} malformed cases rejected atomically.')
print('Authored design probe only: no native provider, new compiler method, live investigator, or runtime execution.')
