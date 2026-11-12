"""Authored conservative-addition experiment, separate from displacement-only regressions."""
import copy
import json
from pathlib import Path
import runpy
import sys

BASE = Path(__file__).resolve().parent
api = runpy.run_path(str(BASE / 'model.py'))
read, label = api['read'], api['label']
rejected_count = 0


def accept(model, probe, delivered=None):
    model.accept(probe['submission'], probe['bindings'], probe['request'], delivered)


def renamed(probe, suffix):
    out = copy.deepcopy(probe)
    qid, rid = 'Q-' + suffix, 'RESULT-' + suffix
    out['request'].update(id=qid, resultEntity=rid)
    out['submission']['result']['queryInvocation'] = qid
    out['bindings']['entityIds']['query-result'] = rid
    local = next(iter(out['bindings']['investigramIds']))
    out['bindings']['investigramIds'][local] = suffix.upper()
    return out


def rejected(model, probe, delivered):
    global rejected_count
    candidate = copy.deepcopy(model)
    before = copy.deepcopy(candidate.__dict__)
    try:
        accept(candidate, probe, delivered)
    except (AssertionError, KeyError, TypeError):
        rejected_count += 1
    else:
        raise AssertionError('Missing addition disclosure was accepted')
    assert candidate.__dict__ == before


def build_baseline(directory):
    ledger = read(directory / 'context-and-bindings.json')
    life = read(directory / 'lifecycle-probes.json')
    probes = read(directory / 'addition-probes.json')
    model = api['initial_model'](directory, addition_policy='conservative')
    model.accept(read(directory / 'first-result.json'), ledger['firstAcceptance'], ledger['firstRequest'])
    accept(model, life['observer'])
    accept(model, life['excerptConsumer'])
    model.accept(read(directory / 'followup-result.json'), ledger['followupAcceptance'], ledger['followupRequest'])
    accept(model, life['updatedConsumer'])
    accept(model, probes['roleConsumer'])
    accept(model, probes['referenceControl'])
    return model, probes


def impact(model, cause, prior_queries, prior_designations):
    status = model.reconsideration()
    declaration = model.declarations()[tuple(cause.split('::'))]
    target = declaration['target']['entity']['entity']
    cause_at = model.accepted_at(tuple(cause.split('::')))
    direct = sorted(qid for qid in prior_queries if any(
        p['asOfAcceptance'] < cause_at and target in model.projection_entities(p)
        for p in model.queries[qid]['deliveries']))
    affected = sorted(qid for qid in prior_queries if cause in status['evaluations'][qid])
    designations = {ref: {key: row[key] for key in ['resultEntity', 'displacedBy', 'membershipCauses', 'generatingEvaluationCauses']}
                    for ref, row in status['designations'].items()
                    if ref in prior_designations and cause in row['needsReconsideration']}
    # Show only this cause in per-cause rows, not unrelated baseline history.
    for row in designations.values():
        for key in ['membershipCauses', 'generatingEvaluationCauses']:
            row[key] = [x for x in row[key] if x == cause]
    return {'cause': cause, 'causeKind': status['causeKinds'][cause], 'targetEntity': target,
            'acceptedAt': cause_at, 'directEvaluations': direct,
            'inheritedOnlyEvaluations': sorted(set(affected) - set(direct)),
            'affectedEvaluations': affected,
            'inheritedOnlyViaProducerQueries': {qid: sorted({src for p in model.queries[qid]['deliveries'] if p['asOfAcceptance'] < cause_at for src in model.projection_sources(p) if cause in status['evaluations'].get(src, [])}) for qid in set(affected) - set(direct)},
            'unaffectedEvaluations': sorted(set(prior_queries) - set(affected)),
            'affectedDesignations': designations,
            'counts': {'priorEvaluations': len(prior_queries), 'affectedEvaluations': len(affected),
                       'priorDesignations': len(prior_designations), 'affectedDesignations': len(designations)}}


def check(directory, write=False):
    model, probes = build_baseline(directory)
    baseline_status = model.reconsideration()
    original = copy.deepcopy(model.investigrams)
    snapshots = copy.deepcopy(model.snapshots)
    prior_queries = set(model.queries)
    prior_designations = set(baseline_status['designations'])
    comparisons = {}
    for name in ['complementary', 'behavioral']:
        branch = copy.deepcopy(model)
        accept(branch, probes[name])
        oid = probes[name]['bindings']['investigramIds']['contribution']
        cause = oid + '::addition'
        report = impact(branch, cause, prior_queries, prior_designations)
        comparisons[name] = report
        assert report['causeKind'] == 'new-information'
        assert report['affectedEvaluations'] == ['Q-excerpt', 'Q-observer', 'Q-role-only', 'Q-updated', 'Q2']
        assert report['directEvaluations'] == ['Q-observer', 'Q-updated', 'Q2']
        assert report['inheritedOnlyEvaluations'] == ['Q-excerpt', 'Q-role-only']
        assert report['counts']['affectedDesignations'] == 7 and len(prior_designations) == 8
        assert cause not in branch.reconsideration()['evaluations']['Q1'], 'new S was fabricated as Q1 input'
        assert cause not in branch.reconsideration()['evaluations'][probes[name]['request']['id']], 'producer acquired its own addition cause'
        assert 'Q-reference-only' in report['unaffectedEvaluations'], 'bare identity counted as exposure'
        assert 'Q-excerpt' not in report['directEvaluations'], 'content referents silently enlarged direct addition scope'
        assert branch.snapshots == {**snapshots, probes[name]['request']['id']: branch.snapshots[probes[name]['request']['id']]}
        assert all(branch.investigrams[k] == v for k, v in original.items())
        assert all(branch.standing(ref) == model.standing(ref) for ref in model.declarations()), 'addition changed prior association standing'
        assert all(cause not in p['associationUses'] for qid in prior_queries for p in branch.queries[qid]['deliveries']), 'earlier delivery rewritten'
        fresh = branch.project(probes['awareConsumer']['request']['deliveries'][0])
        assert cause in fresh['notices'] and fresh['notices'][cause]['value']['operation'] == 'addition'
        assert oid + '::detail' not in fresh['items'], 'notice invented member delivery'
        incomplete = copy.deepcopy(fresh); incomplete['notices'].pop(cause)
        rejected(branch, probes['awareConsumer'], [incomplete])
        accept(branch, probes['awareConsumer'])
        assert not branch.reconsideration()['evaluations']['Q-aware'], 'known addition re-entered as later change'
        assert not branch.reconsideration()['designations']['AWARE-1::result']['needsReconsideration'], 'known addition re-entered via new membership'
        stale = renamed(probes['awareConsumer'], 'spanning-addition')
        old_delivery = model.project(stale['request']['deliveries'][0])
        # A fresh acquisition does not erase the earlier pre-addition acquisition.
        stale['request']['deliveries'] *= 2
        accept(branch, stale, [old_delivery, fresh])
        assert cause in branch.reconsideration()['evaluations']['Q-spanning-addition']
        comparisons[name]['timingChecks'] = {'knownAdditionDisclosed': True, 'noticeDoesNotDeliverNewMembers': True,
                                            'informedEvaluationCauses': branch.reconsideration()['evaluations']['Q-aware'],
                                            'preAdditionAcquisitionPreservesCause': cause in branch.reconsideration()['evaluations']['Q-spanning-addition']}
    assert comparisons['complementary']['affectedEvaluations'] == comparisons['behavioral']['affectedEvaluations']
    assert set(comparisons['complementary']['affectedDesignations']) == set(comparisons['behavioral']['affectedDesignations'])

    # Repeated additions accumulate, while an informed producer is not warned about prior additions.
    cumulative = copy.deepcopy(model)
    accept(cumulative, probes['complementary'])
    accept(cumulative, probes['awareConsumer'])
    q_before_second = set(cumulative.queries)
    d_before_second = set(cumulative.reconsideration()['designations'])
    accept(cumulative, probes['behavioral'])
    second = impact(cumulative, 'RECOVERY-CAVEAT-1::addition', q_before_second, d_before_second)
    assert second['counts']['affectedDesignations'] == 9 and second['counts']['priorDesignations'] == 10
    assert 'Q-category-detail' in second['affectedEvaluations'] and 'Q-aware' in second['affectedEvaluations']
    assert not cumulative.reconsideration()['evaluations']['Q-recovery-caveat'], 'known earlier additions contaminated new contribution'
    for ref in prior_designations:
        causes = cumulative.reconsideration()['designations'][ref]['needsReconsideration']
        assert ('CATEGORY-DETAIL-1::addition' in causes) == ('RECOVERY-CAVEAT-1::addition' in causes)
    aware_after_both = renamed(probes['awareConsumer'], 'aware-after-both')
    accept(cumulative, aware_after_both)
    assert not cumulative.reconsideration()['evaluations']['Q-aware-after-both']
    known = cumulative.queries['Q-aware-after-both']['deliveries'][0]['notices']
    assert {'CATEGORY-DETAIL-1::addition', 'RECOVERY-CAVEAT-1::addition'} <= set(known)

    # Baseline includes every ordinary addition, not just the two illustrative additions.
    report = {'status': 'Authored conservative policy experiment, not product or live investigation. Two branch comparisons have identical history and target scope; no inferred harmlessness exception.',
              'additionPolicy': 'conservative', 'acceptanceOrder': {q: r['acceptedAt'] for q, r in model.queries.items()},
              'baseline': {'statusIncludingAllEarlierAdditions': baseline_status,
                           'deliveredContext': {qid: [{'contextEntity': p['entity'], 'asOfAcceptance': p['asOfAcceptance'],
                                                      'newInformationScope': sorted(model.projection_entities(p)),
                                                      'associationUses': sorted(p['associationUses']), 'notices': sorted(p['notices']),
                                                      'sourceQueries': sorted(model.projection_sources(p))}
                                                     for p in q['deliveries']] for qid, q in model.queries.items()},
                           'warningCounts': {r: len(v['needsReconsideration']) for r, v in baseline_status['designations'].items()}},
              'independentComparisons': comparisons, 'cumulative': {'secondAddition': second,
                           'laterInformedEvaluationCauses': cumulative.reconsideration()['evaluations']['Q-aware-after-both'],
                           'knownAdditionCauses': sorted(c for c in known if c in {'CATEGORY-DETAIL-1::addition', 'RECOVERY-CAVEAT-1::addition'})},
              'limitations': ['Manual relevance assessment, not measured warning precision or a live study.',
                             'No semantic novelty/deduplication: a new qualified association can trigger even if some consumers previously saw equivalent content through another entity.',
                             'Roles do not narrow new-information scope. Bare referents do not expand it. Raw item-only membership needs its explicit association route for entity-specific membership effects.',
                             'All known applicable additions are disclosed with qualified reasons; omitted new members are not presumed read.',
                             'No targeted suppression, reassessment, clearance, notification UI, or automatic scheduling is implemented.']}
    path = directory / 'addition-report.json'
    if write:
        path.write_text(json.dumps(report, indent=2) + '\n')
    else:
        assert read(path) == report, 'stale addition report'
    print(f'{directory.name}: each addition affects {comparisons["complementary"]["counts"]["affectedEvaluations"]}/7 earlier evaluations and 7/8 earlier designations; second cumulative addition affects {second["counts"]["affectedDesignations"]}/{second["counts"]["priorDesignations"]} designations.')
    return report


mixed = check(BASE, '--write' in sys.argv)
children = check(BASE / 'children', '--write' in sys.argv)
for name in ['complementary', 'behavioral']:
    assert mixed['independentComparisons'][name]['counts'] == children['independentComparisons'][name]['counts']
print(f'Addition timing, exact history, cause identity, unchanged standing and positive/negative propagation checks pass; {rejected_count} incomplete-disclosure cases rejected.')
