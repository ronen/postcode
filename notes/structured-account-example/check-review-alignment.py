"""Authored review probes: production updates, precise disagreement, referent lookup.

The payload shapes are local executable choices, not a proposed public API.
"""
import copy
import json
from pathlib import Path
import runpy
import sys

BASE = Path(__file__).resolve().parent
helpers = runpy.run_path(str(BASE / 'check-additions.py'))
api = helpers['api']
read, accept, renamed = helpers['read'], helpers['accept'], helpers['renamed']
rejected_count = 0


def delivery_summary(delivery):
    return {**{k: delivery[k] for k in ['entity', 'asOfAcceptance']},
            **{k: sorted(delivery.get(k, {})) for k in ['associationUses', 'declarations', 'items', 'notices']},
            **{k: delivery[k] for k in ['inventory', 'selectionScope'] if k in delivery}}


def rejected(model, stage, deliveries=None):
    global rejected_count
    branch = copy.deepcopy(model)
    before = copy.deepcopy(branch.__dict__)
    try:
        accept(branch, stage, deliveries)
    except (AssertionError, KeyError, TypeError):
        rejected_count += 1
    else:
        raise AssertionError('Malformed probe accepted')
    assert branch.__dict__ == before


def check(directory):
    model, additions = helpers['build_baseline'](directory, 'inventory')
    life = read(directory / 'lifecycle-probes.json')
    old_selection = life['expansion']['request']['deliveries'][0]
    old = model.project(old_selection)
    initial = copy.deepcopy(model)

    def consumer(name, selections):
        p = renamed(additions['referenceControl'], name)
        p['request']['operation'] = 'authored-review-alignment'
        p['request']['deliveries'] = selections
        p['request']['declaredMeaning'] = {
            'question': 'Exercise qualified acquisition and contribution boundaries.',
            'scope': 'Authored protocol control; no new Cockatiel conclusion.'}
        a = p['submission']['result']['investigrams'][0]
        a['title'] = name
        a['qualifications'] = ['Authored protocol control at the pinned basis; no new architectural conclusion.']
        a['content'][0]['text'] = 'This control records production behavior without asserting a new architectural finding.'
        return p

    # An accepted contribution cannot be cleared by the input to another production.
    completed = consumer('completed-before-update', [old_selection])
    accept(model, completed, [old])
    inherited_selection = {'entity': 'RESULT-completed-before-update', 'associations': [
        {'investigram': 'COMPLETED-BEFORE-UPDATE', 'associationKey': 'result'}]}
    inherited = model.project(inherited_selection)
    before_change = model.acceptance_order
    accept(model, life['expansion'])
    cause = 'EXPANSION-1::expanded-identification'
    full_selection = {'entity': 'S', 'associations': [
        {'investigram': 'EXPANSION-1', 'associationKey': 'expanded-identification'}]}
    full = model.project(full_selection)
    notice_only = model.project(old_selection)
    assert cause in notice_only['notices'] and 'EXPANSION-1::expanded-half-open' not in notice_only['items']
    assert cause in full['declarations'] and 'EXPANSION-1::expanded-half-open' in full['items']
    rows = {}
    for name, selections, deliveries, affected in [
        ('updated-before-submission', [old_selection, full_selection], [old, full], False),
        ('notice-only', [old_selection, old_selection], [old, notice_only], True),
        ('undelivered-update', [old_selection], [old], True),
        ('inherited-update-delivered', [inherited_selection, full_selection], [inherited, full], False),
        ('inherited-update-undelivered', [inherited_selection], [inherited], True),
    ]:
        stage = consumer(name, selections)
        accept(model, stage, deliveries)
        causes = model.reconsideration()['evaluations'][stage['request']['id']]
        assert (cause in causes) == affected
        rows[name] = {'causes': causes, 'deliveries': [delivery_summary(p) for p in model.queries[stage['request']['id']]['deliveries']]}
    assert cause in model.reconsideration()['evaluations']['Q-completed-before-update']
    assert model.standing(api['address'](old_selection['associations'][0], 'associationKey'))['displacedBy'] == [cause]
    assert model.queries['Q-updated-before-submission']['deliveries'][0] == old

    # Two independently produced investigrams accepted together: only one got the update.
    split = consumer('separate-producers', [old_selection, full_selection])
    root = split['submission']['result']['investigrams'][0]
    sibling = copy.deepcopy(root)
    sibling['key'] = 'other'
    sibling['associationSpecifications'] = []
    sibling['content'][0]['key'] = 'other-control'
    root['associationSpecifications'][0]['members'].append({'item': {
        'investigram': {'submittedInvestigram': 'other'}, 'contentKey': 'other-control'}})
    split['submission']['result']['investigrams'].append(sibling)
    split['bindings']['investigramIds']['other'] = 'OTHER-PRODUCER'
    split['bindings']['exposureByInvestigram'] = {
        'contribution': {'execution': 'informed', 'deliveryIndices': [0, 1], 'sameSubmissionItems': []},
        'other': {'execution': 'uninformed', 'deliveryIndices': [0], 'sameSubmissionItems': []}}
    accept(model, split, [old, full])
    status = model.reconsideration()
    assert cause not in status['investigrams']['SEPARATE-PRODUCERS']
    assert cause in status['investigrams']['OTHER-PRODUCER']
    # Sharing the invocation doesn't copy production exposure. Result membership of an
    # item isn't an invented input to the other producer (same-submission gap unchanged).
    rows['separate-producers'] = {oid: status['investigrams'][oid] for oid in ['SEPARATE-PRODUCERS', 'OTHER-PRODUCER']}

    # A later independent change is still a cause; old production history is immutable.
    competing = renamed(life['expansion'], 'later-change')
    accept(model, competing)
    later = 'LATER-CHANGE::expanded-identification'
    assert later in model.reconsideration()['evaluations']['Q-updated-before-submission']
    assert cause not in model.reconsideration()['evaluations']['Q-updated-before-submission']
    rows['later-independent-change'] = model.reconsideration()['evaluations']['Q-updated-before-submission']
    rows['completed-contribution'] = model.reconsideration()['evaluations']['Q-completed-before-update']

    # Addition: a refreshed inventory alone doesn't deliver added substantive content.
    added = copy.deepcopy(initial)
    inventory = {'entity': 'S', 'inventory': {'roles': ['topic']}}
    before = added.project(inventory)
    accept(added, additions['complementary'])
    add_owner = additions['complementary']['bindings']['investigramIds']['contribution']
    add_cause = add_owner + '::addition'
    added_selection = {'entity': 'S', 'associations': [{'investigram': add_owner, 'associationKey': 'addition'}]}
    for name, selections, deliveries, affected in [
        ('inventory-refresh-only', [inventory, inventory], [before, added.project(inventory)], True),
        ('addition-delivered', [inventory, added_selection], [before, added.project(added_selection)], False),
    ]:
        stage = consumer(name, selections)
        accept(added, stage, deliveries)
        causes = added.reconsideration()['evaluations'][stage['request']['id']]
        assert (add_cause in causes) == affected
        rows[name] = {'causes': causes}

    # Withdrawal has no replacement members: its complete qualified reason IS the update.
    withdrawn = copy.deepcopy(initial)
    accept(withdrawn, life['reuse'])
    withdrawal_selection = life['withdrawal']['request']['deliveries'][0]
    pre_withdrawal = withdrawn.project(withdrawal_selection)
    accept(withdrawn, life['withdrawal'])
    post_withdrawal = withdrawn.project(withdrawal_selection)
    stage = consumer('withdrawal-delivered', [withdrawal_selection, withdrawal_selection])
    accept(withdrawn, stage, [pre_withdrawal, post_withdrawal])
    assert 'WITHDRAW-1::withdraw-policy-indexing' not in withdrawn.reconsideration()['evaluations']['Q-withdrawal-delivered']
    rows['withdrawal-delivered'] = {'causes': withdrawn.reconsideration()['evaluations']['Q-withdrawal-delivered']}

    # Exact membership remains historical, even for a production with an updated context.
    member = renamed(life['observer'], 'historical-membership')
    member['request']['deliveries'] = [old_selection, full_selection]
    accept(model, member, [old, full])
    declaration = model.declarations()[('HISTORICAL-MEMBERSHIP', 'selected-result')]
    assert declaration['members'] == life['observer']['submission']['result']['investigrams'][0]['associationSpecifications'][0]['members']

    # Forging updated content or its qualifications is a delivery-integrity defect.
    stage = consumer('forged-update', [old_selection, full_selection])
    for field in ['items', 'declarations']:
        bad = copy.deepcopy(full); bad[field] = {}
        rejected(model, stage, [old, bad])
    bad = copy.deepcopy(full); next(iter(bad['items'].values()))['sourceQualifications'] = []
    rejected(model, stage, [old, bad])
    bad = copy.deepcopy(full); bad['asOfAcceptance'] = before_change
    rejected(model, stage, [old, bad])

    # Referent discovery is independent of association targets and keeps history visible.
    discovery = initial.project({'entity': 'S', 'referentDiscovery': True})
    found = discovery['referentDiscovery']['investigrams']
    assert {'investigram': 'ADMISSION-1'} in found
    behavior = ('ADMISSION-1', 'admission-cases')
    assert initial.declarations()[behavior]['target']['entity']['entity'] == 'P'
    assert not discovery['items'] and not discovery['associationUses'] and 'inventory' not in discovery
    assert not initial.projection_sources(discovery)
    reference_stage = consumer('referent-discovery', [{'entity': 'S', 'referentDiscovery': True}])
    accept(initial, reference_stage, [discovery])
    assert initial.queries['Q-referent-discovery']['sourceQueries'] == []
    # Arbitrary prose/identities in content aren't an explicit referent declaration.
    incidental = consumer('incidental-mention', [])
    incidental['submission']['result']['investigrams'][0]['referents'] = []
    incidental['submission']['result']['investigrams'][0]['content'][0]['text'] = 'Half-open / S mentioned in prose only.'
    accept(initial, incidental)
    assert {'investigram': 'INCIDENTAL-MENTION'} not in initial.discover_referents('S')['investigrams']
    assert initial.discover_referents('S', discovery['asOfAcceptance']) == discovery['referentDiscovery']
    # Subsequent exact access supplies only requested content with its original scope.
    exact_selection = {'entity': 'S', 'exactItems': [{'investigram': 'ADMISSION-1', 'contentKey': 'admission-cases'}]}
    acquired = initial.project(exact_selection)
    access = consumer('discovered-content', [exact_selection])
    accept(initial, access, [acquired])
    assert initial.queries['Q-discovered-content']['sourceQueries'] == ['Q1']
    assert not acquired['associationUses'] and set(acquired['items']) == {'ADMISSION-1::admission-cases'}
    assert acquired['items']['ADMISSION-1::admission-cases']['sourceQualifications'] == initial.investigrams['ADMISSION-1']['qualifications']
    for mutate in [lambda p: p.pop('referentDiscovery'),
                   lambda p: p['referentDiscovery']['investigrams'].clear(),
                   lambda p: p['referentDiscovery'].update(coverage='semantic-search')]:
        bad = copy.deepcopy(discovery); mutate(bad)
        rejected(initial, consumer('bad-discovery', [{'entity': 'S', 'referentDiscovery': True}]), [bad])

    # Unresolved comparison: exact claims, with a separate report for organizing uses.
    comparison = consumer('comparison', [])
    comparison['request']['suppliedEvidence'] = ['E-state', 'E-admission', 'E-half-open']
    comparison['request']['declaredMeaning'] = {'question': 'Compare the admission descriptions.', 'scope': 'Authored limited comparison, not a new displacement.'}
    bundle = comparison['submission']['result']['investigrams'][0]
    bundle['inconsistencies'] = [
        {'key': 'admission-claims', 'targets': [
            {'item': {'investigram': 'ADMISSION-1', 'contentKey': 'admission-cases'}},
            {'item': {'investigram': 'ADMISSION-2', 'contentKey': 'admission-cases'}}],
         'reason': 'The initial admission explanation omits waiting; the later explanation includes a waiting case. This report compares that omission only and does not decide other claims.',
         'qualifications': ['Authored comparison within the two admission items\' stated default-sampling and reentrancy exclusions; no new source analysis.'],
         'evidence': ['E-admission', 'E-half-open']},
        {'key': 'admission-uses', 'targets': [
            {'association': {'investigram': 'ADMISSION-1', 'associationKey': 'admission-cases'}},
            {'association': {'investigram': 'ADMISSION-2', 'associationKey': 'admission-cases'}}],
         'reason': 'These two policy-description uses communicate different coverage of admission. Recording disagreement does not alter the already recorded displacement.',
         'qualifications': ['Limited to these uses and their supplied scope, not unrelated content or all results from either producer.'],
         'evidence': ['E-admission']}]
    original_standing = {r: initial.standing(r) for r in initial.declarations()}
    accept(initial, comparison)
    assert all(initial.standing(r) == v for r, v in original_standing.items())
    assert initial.queries['Q-comparison']['sourceQueries'] == [], 'endpoint references invented exposure'
    assert not initial.reconsideration()['investigrams']['COMPARISON']
    claim_target = bundle['inconsistencies'][0]['targets'][0]
    use_target = bundle['inconsistencies'][1]['targets'][0]
    assert initial.inconsistencies_for(claim_target) == [{'investigram': 'COMPARISON', 'inconsistencyKey': 'admission-claims'}]
    assert initial.inconsistencies_for(use_target) == [{'investigram': 'COMPARISON', 'inconsistencyKey': 'admission-uses'}]
    identifying_owner = old_selection['associations'][0]['investigram']
    assert initial.inconsistencies_for({'item': {'investigram': identifying_owner, 'contentKey': 'half-open-description'}}) == []
    report_selection = {'entity': 'S', 'inconsistencies': initial.inconsistencies_for(claim_target)}
    report_delivery = initial.project(report_selection)
    assert not report_delivery['items'] and not report_delivery['associationUses']
    assert initial.projection_sources(report_delivery) == {'Q-comparison'}
    accept(initial, consumer('comparison-reader', [report_selection]), [report_delivery])
    assert initial.queries['Q-comparison-reader']['sourceQueries'] == ['Q-comparison']
    assert report_delivery['inconsistencies']['COMPARISON::admission-claims']['sourceQualifications']
    # No acquisition gate, but the investigator instruction still requires understanding.
    # Exercise the ordinary instructed path too, with actual qualified item deliveries.
    acquired_comparison = renamed(comparison, 'acquired-comparison')
    acquired_comparison['request']['deliveries'] = [
        {'entity': 'P', 'exactItems': [t['item'] for t in bundle['inconsistencies'][0]['targets']]}]
    accept(initial, acquired_comparison)
    assert initial.queries['Q-acquired-comparison']['sourceQueries'] == ['Q1', 'Q2']
    # Report delivery inherits actual concerns of its producer, not fabricated
    # acquisition of its endpoints. The two paths are independently observable.
    exposed = renamed(comparison, 'exposed-comparison')
    exposed['request']['deliveries'] = [old_selection]
    accept(initial, exposed)
    exposed_report_selection = {'entity': 'S', 'inconsistencies': [
        {'investigram': 'EXPOSED-COMPARISON', 'inconsistencyKey': 'admission-claims'}]}
    accept(initial, consumer('exposed-report-reader', [exposed_report_selection]))
    propagation = copy.deepcopy(initial)
    accept(propagation, life['expansion'])
    propagated = propagation.reconsideration()['evaluations']
    assert cause in propagated['Q-exposed-comparison']
    assert cause in propagated['Q-exposed-report-reader']
    assert cause not in propagated['Q-comparison-reader'], 'endpoint reference fabricated acquisition'
    mutations = [
        lambda r: r.update(reason=''), lambda r: r.update(qualifications=[]),
        lambda r: r.update(evidence=[]), lambda r: r.update(evidence=['NOT-SUPPLIED']),
        lambda r: r.update(targets=r['targets'][:1]), lambda r: r.update(targets=[r['targets'][0]] * 2),
        lambda r: r['targets'][0]['item'].update(contentKey='missing'),
        lambda r: r['targets'][0].update(association={'investigram': 'ADMISSION-1', 'associationKey': 'admission-cases'}),
        lambda r: r.update(targets=[{'investigram': 'ADMISSION-1'}, r['targets'][1]]),
        lambda r: r.update(key=''), lambda r: r.update(operation='supersession')]
    for mutate in mutations:
        bad = renamed(comparison, 'bad-comparison')
        mutate(bad['submission']['result']['investigrams'][0]['inconsistencies'][0])
        rejected(initial, bad)
    bad = renamed(comparison, 'duplicate-comparison')
    reports = bad['submission']['result']['investigrams'][0]['inconsistencies']; reports.append(copy.deepcopy(reports[0]))
    rejected(initial, bad)
    bad = renamed(comparison, 'missing-association')
    bad['submission']['result']['investigrams'][0]['inconsistencies'][1]['targets'][0]['association']['associationKey'] = 'missing'
    rejected(initial, bad)
    for field in ['sourceQualifications', 'value']:
        bad = copy.deepcopy(report_delivery)
        bad['inconsistencies']['COMPARISON::admission-claims'][field] = [] if field == 'sourceQualifications' else {}
        rejected(initial, consumer('bad-report-delivery', [report_selection]), [bad])

    return {'status': 'Bounded authored probes; no product/API or live-agent verification.',
            'updatesDuringProduction': rows,
            'referentDiscovery': {'lookup': discovery, 'subsequentDelivery': acquired},
            'inconsistencies': {'submission': comparison, 'qualifiedReportDelivery': report_delivery,
                                'standingUnchanged': True, 'noInventedExposure': True,
                                'actualReporterExposurePropagates': {
                                    q: propagated[q] for q in ['Q-exposed-comparison', 'Q-exposed-report-reader', 'Q-comparison-reader']}}}


if __name__ == '__main__':
    report = {directory.name: check(directory) for directory in [BASE, BASE / 'children']}
    report['malformedCasesRejected'] = rejected_count
    if '--write' in sys.argv:
        (BASE / 'review-alignment-report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'Both partitions: substantive production updates, precise inconsistency reports and referent discovery pass; {rejected_count} malformed cases rejected atomically.')
