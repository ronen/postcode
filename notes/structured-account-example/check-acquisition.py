"""Scope selection, discovery acquisition and substantive declaration exposure probes."""
import copy
import json
from pathlib import Path
import runpy
import sys

BASE = Path(__file__).resolve().parent
helpers = runpy.run_path(str(BASE / 'check-additions.py'))
api = helpers['api']
read, accept, renamed, impact = helpers['read'], helpers['accept'], helpers['renamed'], helpers['impact']
rejected_count = 0


def rejected(model, probe, deliveries=None):
    global rejected_count
    branch = copy.deepcopy(model)
    before = copy.deepcopy(branch.__dict__)
    try:
        accept(branch, probe, deliveries)
    except (AssertionError, KeyError, TypeError):
        rejected_count += 1
    else:
        raise AssertionError('Malformed acquisition was accepted')
    assert branch.__dict__ == before


def delivery_summary(model, projection):
    return {'entity': projection['entity'], 'asOfAcceptance': projection['asOfAcceptance'],
            'associationUses': sorted(projection['associationUses']),
            'fullDeclarations': sorted(projection['declarations']), 'items': sorted(projection['items']),
            'inventory': projection.get('inventory'), 'selectionScope': projection.get('selectionScope'),
            'qualifiedDeclarationDisclosures': projection['notices'],
            'sourceQueries': sorted(model.projection_sources(projection))}


def check(directory, write=False):
    model, additions = helpers['build_baseline'](directory, 'inventory')
    probes = read(directory / 'acquisition-probes.json')
    ledger = read(directory / 'context-and-bindings.json')
    life = read(directory / 'lifecycle-probes.json')

    # Same original identifying information, but scope selection and exact selection
    # have different selection guarantees, visibly recorded with the content.
    scoped = copy.deepcopy(model)
    p = scoped.project(probes['scopeSelected']['request']['deliveries'][0])
    exact = scoped.project(probes['exactSelected']['request']['deliveries'][0])
    assert p['associationUses'] == exact['associationUses'] and p['items'] == exact['items']
    assert 'selectionScope' in p and 'inventory' not in p
    assert 'selectionScope' not in exact and 'inventory' not in exact
    accept(scoped, probes['scopeSelected'])
    accept(scoped, probes['exactSelected'])
    accept(scoped, probes['scopeDependent'])
    original = copy.deepcopy(scoped.investigrams)
    snapshots = copy.deepcopy(scoped.snapshots)
    qs, ds = set(scoped.queries), set(scoped.reconsideration()['designations'])
    accept(scoped, probes['additionalIdentification'])
    cid = 'ADDITIONAL-ID-1::addition'
    scope_impact = impact(scoped, cid, qs, ds)
    assert scope_impact['directEvaluations'] == ['Q-scope-selected']
    assert scope_impact['inheritedOnlyEvaluations'] == ['Q-scope-dependent']
    assert scope_impact['counts']['affectedDesignations'] == 2
    assert cid not in scoped.reconsideration()['evaluations']['Q-exact-selected']
    assert all(scoped.investigrams[k] == v for k, v in original.items())
    assert all(scoped.snapshots[k] == v for k, v in snapshots.items())
    fresh = scoped.project(probes['scopeSelected']['request']['deliveries'][0])
    assert cid in fresh['associationUses'] and 'ADDITIONAL-ID-1::detail' in fresh['items']
    assert len(fresh['declarations']) == len(p['declarations']) + 1
    after = renamed(probes['scopeSelected'], 'scope-after')
    accept(scoped, after, [fresh])
    assert not scoped.reconsideration()['evaluations']['Q-scope-after']
    finishing_later = renamed(probes['scopeSelected'], 'scope-finishes-later')
    accept(scoped, finishing_later, [p])
    assert cid in scoped.reconsideration()['evaluations']['Q-scope-finishes-later']
    # Different role outside selection scope does not match. Historical undisplaced
    # selection is not recomputed using the latest standing.
    unrelated = copy.deepcopy(model)
    accept(unrelated, probes['scopeSelected'])
    accept(unrelated, additions['complementary'])
    assert not unrelated.reconsideration()['evaluations']['Q-scope-selected']
    before_expansion = copy.deepcopy(model)
    accept(before_expansion, life['expansion'])
    current = before_expansion.project(probes['scopeSelected']['request']['deliveries'][0])
    assert 'EXPANSION-1::expanded-identification' in current['declarations']
    assert not set(p['declarations']) & set(current['declarations'])
    assert before_expansion.project(probes['scopeSelected']['request']['deliveries'][0], p['asOfAcceptance']) == p

    # Malformed scope records, incomplete scoped payloads, unsupported policies and
    # inventing a scope dependency on an exact request all fail atomically.
    bad = copy.deepcopy(p); bad.pop('selectionScope'); rejected(model, probes['scopeSelected'], [bad])
    bad = copy.deepcopy(p); bad['selectionScope']['roles'] = ['describes']; rejected(model, probes['scopeSelected'], [bad])
    bad = copy.deepcopy(p); bad['selectionScope']['asOfAcceptance'] -= 1; rejected(model, probes['scopeSelected'], [bad])
    bad = copy.deepcopy(p); bad['items'].pop(next(iter(bad['items']))); rejected(model, probes['scopeSelected'], [bad])
    bad = copy.deepcopy(p); bad['declarations'].pop(next(iter(bad['declarations']))); rejected(model, probes['scopeSelected'], [bad])
    bad = copy.deepcopy(exact); bad['selectionScope'] = p['selectionScope']; rejected(model, probes['exactSelected'], [bad])
    invalid = copy.deepcopy(probes['scopeSelected']); invalid['request']['deliveries'][0]['scopeSelection']['standing'] = 'best'; rejected(model, invalid)
    invalid = copy.deepcopy(probes['scopeSelected']); invalid['request']['deliveries'][0]['scopeSelection']['roles'] = []; rejected(model, invalid)
    invalid = copy.deepcopy(probes['scopeSelected']); invalid['request']['deliveries'][0]['associations'] = probes['exactSelected']['request']['deliveries'][0]['associations']; rejected(model, invalid)

    # Same seven-query baseline, but Q2 actually discovers an S inventory and then
    # retrieves its identifying association. This is authored boundary traffic, not
    # an agent transcript or empirical estimate of normal warning rates.
    discovery = api['initial_model'](directory, 'inventory')
    discovery.accept(read(directory / 'first-result.json'), ledger['firstAcceptance'], ledger['firstRequest'])
    accept(discovery, life['observer']); accept(discovery, life['excerptConsumer'])
    discovery.accept(read(directory / 'followup-result.json'), ledger['followupAcceptance'], probes['discoveryFollowupRequest'])
    accept(discovery, life['updatedConsumer'])
    accept(discovery, additions['roleConsumer']); accept(discovery, additions['referenceControl'])
    deliveries = discovery.queries['Q2']['deliveries']
    assert len(deliveries) == 3 and 'inventory' in deliveries[1]
    assert not api['Model'].projection_sources(deliveries[1]) and not deliveries[1]['associationUses']
    assert deliveries[2]['associationUses'] and 'inventory' not in deliveries[2]
    discovery_comparisons = {}
    for name in ['complementary', 'behavioral']:
        branch = copy.deepcopy(discovery)
        accept(branch, additions[name])
        cause = additions[name]['bindings']['investigramIds']['contribution'] + '::addition'
        row = impact(branch, cause, set(discovery.queries), set(discovery.reconsideration()['designations']))
        assert row['directEvaluations'] == ['Q2']
        assert row['inheritedOnlyEvaluations'] == ['Q-role-only', 'Q-updated']
        assert row['counts'] == {'priorEvaluations': 7, 'affectedEvaluations': 3, 'priorDesignations': 8, 'affectedDesignations': 4}
        discovery_comparisons[name] = row

    # Old admission access supplies the replacement's declaration/reason as context,
    # but not its member content. Track that exact declaration, not every reference.
    notices = copy.deepcopy(model)
    notice_selection = probes['noticeReader']['request']['deliveries'][0]
    notice_delivery = notices.project(notice_selection)
    replacement = 'ADMISSION-2::admission-cases'
    assert replacement in notice_delivery['notices']
    assert replacement in notices.delivered_declarations(notice_delivery)
    assert replacement not in notice_delivery['declarations'] and replacement not in notice_delivery['associationUses']
    assert 'ADMISSION-2::admission-cases' not in notice_delivery['items']
    accept(notices, probes['noticeReader'])
    bare = renamed(additions['inventoryConsumer'], 'notice-address-only')
    bare['request']['subject'] = {'entity': 'P'}
    bare['request']['deliveries'][0].update(entity='P', inventory={'roles': ['describes']})
    bare_delivery = notices.project(bare['request']['deliveries'][0])
    assert any(x['association']['investigram'] == 'ADMISSION-2' for x in bare_delivery['inventory']['entries'])
    assert not notices.delivered_declarations(bare_delivery) and not notices.projection_sources(bare_delivery)
    accept(notices, bare)
    # Target-support acquisition is an investigator instruction, not a mechanical gate.
    # Both deliberately incomplete branches are structurally accepted without inventing
    # exposure. They do not demonstrate sound investigation or compliance with instructions.
    instruction_boundary = {}
    for kind, selections, supplied in [('reason-only', [notice_selection], [notice_delivery]),
                                        ('no-target-content', [], [])]:
        branch = copy.deepcopy(notices)
        probe = copy.deepcopy(probes['withdrawAdmissionUpdate'])
        probe['request']['deliveries'] = selections
        accept(branch, probe, supplied)
        captured = branch.queries[probe['request']['id']]['deliveries']
        assert captured == supplied
        assert all('ADMISSION-2::admission-cases' not in p['items'] for p in captured)
        instruction_boundary[kind] = {'structurallyAccepted': True,
            'deliveryCount': len(captured), 'completeTargetSupportDelivered': False,
            'interpretiveAdequacyEstablished': False}
    # Well-formedness remains mandatory, independent of acquisition completeness.
    for defect in ['unknown-target', 'missing-grounds']:
        bad = copy.deepcopy(probes['withdrawAdmissionUpdate'])
        bad['request']['deliveries'] = []
        declaration = bad['submission']['result']['investigrams'][0]['associationSpecifications'][0]
        if defect == 'unknown-target': declaration['displaces'][0]['associationKey'] = 'absent'
        else: declaration['reason'] = ''
        rejected(notices, bad, [])
    accept(notices, probes['withdrawAdmissionUpdate'])
    wid = 'WITHDRAW-UPDATE-1::' + probes['withdrawAdmissionUpdate']['submission']['result']['investigrams'][0]['associationSpecifications'][0]['key']
    status = notices.reconsideration()
    assert wid in status['evaluations']['Q-notice-reader']
    assert wid not in status['evaluations']['Q2'], 'test must isolate direct declaration exposure, not producer inheritance'
    assert wid not in status['evaluations']['Q-notice-address-only']
    fresh_notice = notices.project(notice_selection)
    assert wid in fresh_notice['notices'] and replacement in fresh_notice['notices']
    after_notice = renamed(probes['noticeReader'], 'notice-after-withdrawal')
    bad = copy.deepcopy(fresh_notice); bad['notices'].pop(wid); rejected(notices, after_notice, [bad])
    accept(notices, after_notice, [fresh_notice])
    assert not notices.reconsideration()['evaluations']['Q-notice-after-withdrawal']
    late_notice = renamed(probes['noticeReader'], 'notice-finishes-later')
    accept(notices, late_notice, [notice_delivery])
    assert wid in notices.reconsideration()['evaluations']['Q-notice-finishes-later']
    # Historical fact of the original displacement remains; no automatic reinstatement.
    assert replacement in notices.standing(('ADMISSION-1', 'admission-cases'))['displacedBy']

    # A recipient exposed to A before B retains cause B when C later displaces B.
    # Fresh access resolves B's current standing without inventing receipt of B or C.
    renewal = copy.deepcopy(model)
    original_input = copy.deepcopy(renewal.queries['Q-excerpt']['deliveries'])
    original_snapshot = copy.deepcopy(renewal.snapshots['Q-excerpt'])
    original_causes = renewal.reconsideration()['evaluations']['Q-excerpt']
    assert replacement in original_causes
    assert all(replacement not in renewal.delivered_declarations(p) for p in original_input)
    result_selection = {'entity': 'RESULT-excerpt',
                        'associations': [{'investigram': 'EXCERPT-1', 'associationKey': 'result'}],
                        'items': [], 'options': []}
    before_renewal = renewal.project(result_selection)
    assert replacement in before_renewal['notices']
    accept(renewal, probes['renewAdmission'])
    renewal_cause = 'RENEW-ADMISSION-1::renew-admission'
    after_causes = renewal.reconsideration()['evaluations']['Q-excerpt']
    assert after_causes == original_causes and renewal_cause not in after_causes
    assert renewal.standing(('ADMISSION-1', 'admission-cases'))['displacedBy'] == [replacement]
    cause_standing = renewal.standing(('ADMISSION-2', 'admission-cases'))
    assert cause_standing['displacedBy'] == [renewal_cause]
    fresh_result = renewal.project(result_selection)
    assert {replacement, renewal_cause} <= set(fresh_result['notices'])
    assert renewal_cause not in before_renewal['notices']
    assert renewal.queries['Q-excerpt']['deliveries'] == original_input
    assert renewal.snapshots['Q-excerpt'] == original_snapshot
    # Resolving fresh status is read-only. A new investigator delivery records both
    # qualified declarations, but neither is a later change for that new recipient.
    fresh_reader = renamed(probes['noticeReader'], 'renewal-status-reader')
    fresh_reader['request']['subject'] = {'entity': 'RESULT-excerpt'}
    fresh_reader['request']['deliveries'] = [result_selection]
    incomplete = copy.deepcopy(fresh_result); incomplete['notices'].pop(renewal_cause)
    rejected(renewal, fresh_reader, [incomplete])
    accept(renewal, fresh_reader, [fresh_result])
    assert not renewal.reconsideration()['evaluations']['Q-renewal-status-reader']
    assert renewal.reconsideration()['evaluations']['Q-excerpt'] == original_causes

    report = {
        'status': 'Authored acquisition/disclosure refinement; no architectural coverage dependency, live dialogue or semantic impact proof.',
        'scopeSelectedInitialContext': {'before': delivery_summary(model, p), 'exactReferenceContrast': delivery_summary(model, exact), 'after': delivery_summary(scoped, fresh), 'impact': scope_impact,
            'freshRecipientCauses': scoped.reconsideration()['evaluations']['Q-scope-after'],
            'earlierAcquisitionCauses': scoped.reconsideration()['evaluations']['Q-scope-finishes-later']},
        'discoveryFollowup': {'q2Deliveries': [delivery_summary(discovery, d) for d in deliveries], 'independentComparisons': discovery_comparisons},
        'displacementInstructionBoundary': instruction_boundary,
        'displacedCauseAccess': {'recipient': 'Q-excerpt', 'historicalCauses': original_causes,
            'causesAfterRenewal': after_causes, 'cause': replacement, 'causeCurrentStanding': cause_standing,
            'before': delivery_summary(renewal, before_renewal), 'freshResult': delivery_summary(renewal, fresh_result),
            'originalInputAndSnapshotUnchanged': True,
            'freshRecipientCauses': renewal.reconsideration()['evaluations']['Q-renewal-status-reader'],
            'qualification': 'Counterfactual renewal; no original association reinstatement, clearance, or new Cockatiel claim.'},
        'substantiveDeclarationDisclosure': {'before': delivery_summary(notices, notice_delivery), 'after': delivery_summary(notices, fresh_notice), 'withdrawalCause': wid,
            'directRecipientCauses': status['evaluations']['Q-notice-reader'],
            'replacementProducerCauses': status['evaluations']['Q2'],
            'bareAddressRecipientCauses': status['evaluations']['Q-notice-address-only'],
            'freshRecipientCauses': notices.reconsideration()['evaluations']['Q-notice-after-withdrawal'],
            'earlierAcquisitionCauses': notices.reconsideration()['evaluations']['Q-notice-finishes-later']},
        'limitations': ['Undisplaced means no accepted displacement at capture time, not authoritative or reconciled; all competing undisplaced descriptions are selected.',
                       'The original 0/7 and 0/8 baseline is a by-reference boundary control. Discovery branch counts are authored examples, not measured warning frequency.',
                       'Architectural coverage of program behavior is not assigned an inventory dependency. Declared dependencies and investigator-directed propagation are deferred pending observed coverage gaps.',
                       'A supplied reason exposes its exact declaration, not referenced members or full source bundles. Complete target-support acquisition is an investigator instruction; structural acceptance does not establish compliance, adequacy or reinstatement.']}
    path = directory / 'acquisition-report.json'
    if write: path.write_text(json.dumps(report, indent=2) + '\n')
    else: assert read(path) == report, 'stale acquisition report'
    print(f'{directory.name}: scoped description addition reaches 1 direct + 1 inherited recipient; discovery Q2 branch reaches 3/7 evaluations and 4/8 designations; exact reason-displacement/timing, renewal cause access and instruction-boundary checks pass.')
    return report


mixed = check(BASE, '--write' in sys.argv)
children = check(BASE / 'children', '--write' in sys.argv)
for name in ['complementary', 'behavioral']:
    assert mixed['discoveryFollowup']['independentComparisons'][name]['counts'] == children['discoveryFollowup']['independentComparisons'][name]['counts']
print(f'{rejected_count} malformed scope, disclosure or declaration cases rejected atomically.')
