"""Compare earlier entity-wide propagation with exact association/inventory exposure."""
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
        raise AssertionError('Malformed delivery or reference was accepted')
    assert candidate.__dict__ == before


def build_baseline(directory, policy="conservative"):
    ledger = read(directory / 'context-and-bindings.json')
    life = read(directory / 'lifecycle-probes.json')
    probes = read(directory / 'addition-probes.json')
    model = api['initial_model'](directory, addition_policy=policy)
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
        p['asOfAcceptance'] < cause_at and (model.inventory_matches(p, declaration) if model.addition_policy == 'inventory' else target in model.projection_entities(p))
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
            'inheritedOnlyViaProducerQueries': {qid: sorted({src for p in model.queries[qid]['deliveries'] if p['asOfAcceptance'] < cause_at for src in model.projection_sources(p) if cause in status['evaluations'].get(src, [])}) for qid in sorted(set(affected) - set(direct))},
            'unaffectedEvaluations': sorted(set(prior_queries) - set(affected)),
            'affectedDesignations': designations,
            'counts': {'priorEvaluations': len(prior_queries), 'affectedEvaluations': len(affected),
                       'priorDesignations': len(prior_designations), 'affectedDesignations': len(designations)}}


def check_legacy(directory):
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
    return report


def capture(model):
    return {'status': model.reconsideration(),
            'deliveredContext': {qid: [
                {'contextEntity': p['entity'], 'asOfAcceptance': p['asOfAcceptance'],
                 'associationUses': sorted(p['associationUses']),
                 'inventory': p.get('inventory'), 'notices': sorted(p['notices']),
                 'sourceQueries': sorted(model.projection_sources(p))}
                for p in q['deliveries']] for qid, q in model.queries.items()}}


def check_inventory(directory, legacy, write=False):
    model, probes = build_baseline(directory, 'inventory')
    original = copy.deepcopy(model.investigrams)
    snapshots = copy.deepcopy(model.snapshots)
    baseline = capture(model)
    qs, ds = set(model.queries), set(model.reconsideration()['designations'])
    comparisons = {}
    for name in ['complementary', 'behavioral']:
        branch = copy.deepcopy(model)
        accept(branch, probes[name])
        oid = probes[name]['bindings']['investigramIds']['contribution']
        cause = oid + '::addition'
        row = impact(branch, cause, qs, ds)
        assert row['affectedEvaluations'] == [] and row['affectedDesignations'] == {}
        assert row['counts']['priorEvaluations'] == 7 and row['counts']['priorDesignations'] == 8
        assert all(branch.investigrams[k] == v for k, v in original.items())
        assert all(branch.snapshots[k] == v for k, v in snapshots.items())
        assert all(branch.standing(ref) == model.standing(ref) for ref in model.declarations())
        fresh = branch.project(probes['awareConsumer']['request']['deliveries'][0])
        assert cause not in fresh['notices'], 'unrequested unrelated addition reason was automatically delivered'
        assert oid + '::detail' not in fresh['items']
        accept(branch, probes['awareConsumer'])
        assert not branch.reconsideration()['evaluations']['Q-aware']
        comparisons[name] = row

    # Inventory-only delivery does not make every listed producer or item an exposure.
    extended = copy.deepcopy(model)
    inv = probes['inventoryConsumer']
    projection = extended.project(inv['request']['deliveries'][0])
    assert projection['inventory']['entries'] and not extended.projection_sources(projection)
    assert not any(projection[f] for f in ['items', 'declarations', 'associationUses', 'notices'])
    accept(extended, inv)
    accept(extended, probes['inventoryDependent'])
    inventory_snapshot = copy.deepcopy(extended.queries['Q-inventory']['deliveries'])
    inv_qs, inv_ds = set(extended.queries), set(extended.reconsideration()['designations'])
    inventory_comparisons = {}
    for name in ['complementary', 'behavioral']:
        branch = copy.deepcopy(extended)
        accept(branch, probes[name])
        cause = probes[name]['bindings']['investigramIds']['contribution'] + '::addition'
        row = impact(branch, cause, inv_qs, inv_ds)
        assert row['directEvaluations'] == ['Q-inventory']
        assert row['inheritedOnlyEvaluations'] == ['Q-inventory-dependent']
        assert row['affectedEvaluations'] == ['Q-inventory', 'Q-inventory-dependent']
        assert set(row['affectedDesignations']) == {'INVENTORY-1::result', 'INVENTORY-DEPENDENT-1::result'}
        assert all(not x['membershipCauses'] for x in row['affectedDesignations'].values())
        assert branch.queries['Q-inventory']['deliveries'] == inventory_snapshot
        assert not branch.reconsideration()['evaluations'][probes[name]['request']['id']]
        inventory_comparisons[name] = row

    # Scope: a different entity or role is unaffected; even an empty matching inventory counts.
    filtered = copy.deepcopy(model)
    for suffix, entity, roles in [('identifying-inventory', 'S', ['identifies']),
                                  ('other-inventory', 'R', ['describes']),
                                  ('empty-inventory', 'S', ['describes'])]:
        probe = renamed(inv, suffix)
        probe['request']['subject'] = {'entity': entity}
        probe['request']['deliveries'][0].update(entity=entity, inventory={'roles': roles})
        if suffix == 'empty-inventory':
            assert not filtered.project(probe['request']['deliveries'][0])['inventory']['entries']
        accept(filtered, probe)
    accept(filtered, probes['complementary'])
    causes = filtered.reconsideration()['evaluations']
    assert not causes['Q-identifying-inventory'] and not causes['Q-other-inventory']
    assert causes['Q-empty-inventory'] == ['CATEGORY-DETAIL-1::addition']

    # Known inventory contents are not later changes; an old acquisition still matters.
    timing = copy.deepcopy(extended)
    old = model.project(inv['request']['deliveries'][0])
    accept(timing, probes['complementary'])
    fresh = timing.project(inv['request']['deliveries'][0])
    assert any(x['association']['investigram'] == 'CATEGORY-DETAIL-1' for x in fresh['inventory']['entries'])
    assert not fresh['items'] and not fresh['notices'] and not timing.projection_sources(fresh)
    after = renamed(inv, 'inventory-after')
    accept(timing, after, [fresh])
    assert not timing.reconsideration()['evaluations']['Q-inventory-after']
    spanning = renamed(inv, 'inventory-spanning')
    spanning['request']['deliveries'] *= 2
    accept(timing, spanning, [old, fresh])
    assert timing.reconsideration()['evaluations']['Q-inventory-spanning'] == ['CATEGORY-DETAIL-1::addition']
    # Fresh downstream access still discloses a relevant known inherited cause.
    after_result = renamed(probes['inventoryDependent'], 'inventory-result-after')
    result_projection = timing.project(after_result['request']['deliveries'][0])
    assert 'CATEGORY-DETAIL-1::addition' in result_projection['notices']
    incomplete = copy.deepcopy(result_projection)
    incomplete['notices'].pop('CATEGORY-DETAIL-1::addition')
    rejected(timing, after_result, [incomplete])
    accept(timing, after_result, [result_projection])
    assert not timing.reconsideration()['evaluations']['Q-inventory-result-after']
    # Source delivery and inventory acquisition may occur at different dialog positions.
    acquired = renamed(probes['awareConsumer'], 'late-inventory')
    acquired['request']['deliveries'].append(copy.deepcopy(inv['request']['deliveries'][0]))
    content_before = model.project(acquired['request']['deliveries'][0])
    accept(timing, acquired, [content_before, fresh])
    assert not timing.reconsideration()['evaluations']['Q-late-inventory']

    # Supersession still affects exact content recipients; it also introduces an inventory entry.
    displacement = copy.deepcopy(model)
    identifying = renamed(inv, 'before-expansion')
    identifying['request']['deliveries'][0]['inventory']['roles'] = ['identifies']
    accept(displacement, identifying)
    accept(displacement, read(directory / 'lifecycle-probes.json')['expansion'])
    displacement_status = displacement.reconsideration()
    cid = 'EXPANSION-1::expanded-identification'
    assert cid in displacement_status['evaluations']['Q-observer']
    assert cid in displacement_status['evaluations']['Q-before-expansion']
    first = next(ref for ref, d in displacement_status['designations'].items()
                 if d['resultEntity'] == 'RESULT-Q1' and ref.endswith('::result'))
    assert cid in displacement_status['designations'][first]['membershipCauses']
    assert cid not in displacement_status['evaluations']['Q-reference-only']

    # All-retained inventories keep withdrawn entries; actual content recipients react.
    withdrawal = copy.deepcopy(model)
    lifecycle = read(directory / 'lifecycle-probes.json')
    accept(withdrawal, lifecycle['reuse'])
    inventory_before_withdrawal = renamed(inv, 'before-withdrawal-inventory')
    inventory_before_withdrawal['request']['subject'] = {'entity': 'P'}
    inventory_before_withdrawal['request']['deliveries'][0].update(entity='P', inventory={'roles': ['describes']})
    before_inventory = withdrawal.project(inventory_before_withdrawal['request']['deliveries'][0])['inventory']
    accept(withdrawal, inventory_before_withdrawal)
    content_before_withdrawal = renamed(probes['awareConsumer'], 'before-withdrawal-content')
    content_before_withdrawal['request']['subject'] = {'entity': 'P'}
    content_before_withdrawal['request']['deliveries'] = copy.deepcopy(lifecycle['withdrawal']['request']['deliveries'])
    content_before_withdrawal['submission']['result']['investigrams'][0]['associationSpecifications'][0]['members'] = [
        {'declaration': {'investigram': {'investigram': 'REUSE-1'}, 'associationKey': 'policy-state-description'}}]
    accept(withdrawal, content_before_withdrawal)
    accept(withdrawal, lifecycle['withdrawal'])
    # Read the authored declaration key rather than assuming a display alias.
    wid = 'WITHDRAW-1::' + lifecycle['withdrawal']['submission']['result']['investigrams'][0]['associationSpecifications'][0]['key']
    withdrawal_status = withdrawal.reconsideration()
    assert wid not in withdrawal_status['evaluations']['Q-before-withdrawal-inventory']
    assert wid in withdrawal_status['evaluations']['Q-before-withdrawal-content']
    after_inventory = withdrawal.project(inventory_before_withdrawal['request']['deliveries'][0])['inventory']
    assert before_inventory['entries'] == after_inventory['entries']

    # Referencing content does not fabricate prior delivery. Semantic-policy compliance
    # is not an acceptance gate; reference resolution and original ownership still are.
    reuse = renamed(probes['awareConsumer'], 'inventory-reuse')
    reuse['request']['deliveries'] = copy.deepcopy(inv['request']['deliveries'])
    reuse_branch = copy.deepcopy(model)
    accept(reuse_branch, reuse, [projection])
    assert reuse_branch.queries['Q-inventory-reuse']['deliveries'] == [projection]
    assert not projection['items'] and not projection['declarations']
    assert not api['Model'].projection_sources(projection)
    assert all(reuse_branch.investigrams[k] == v for k, v in model.investigrams.items())
    unresolved = copy.deepcopy(reuse)
    unresolved['submission']['result']['investigrams'][0]['associationSpecifications'][0]['members'] = [
        {'item': {'investigram': {'investigram': 'ADMISSION-1'}, 'contentKey': 'absent'}}]
    rejected(model, unresolved, [projection])
    malformed = []
    missing = copy.deepcopy(projection); missing.pop('inventory'); malformed.append(missing)
    wrong_scope = copy.deepcopy(projection); wrong_scope['inventory']['roles'] = ['describes']; malformed.append(wrong_scope)
    omitted = copy.deepcopy(projection); omitted['inventory']['entries'].pop(); malformed.append(omitted)
    fabricated = copy.deepcopy(projection); fabricated['inventory']['entries'][0]['association']['associationKey'] = 'absent'; malformed.append(fabricated)
    altered_time = copy.deepcopy(projection); altered_time['inventory']['asOfAcceptance'] -= 1; malformed.append(altered_time)
    prose = copy.deepcopy(projection); prose['inventory']['entries'][0]['summary'] = 'Unqualified interpretation'; malformed.append(prose)
    future = copy.deepcopy(projection); future['asOfAcceptance'] = model.acceptance_order + 1; malformed.append(future)
    for payload in malformed:
        rejected(model, inv, [payload])
    for roles in [[], ['identifies', 'identifies'], ['result']]:
        invalid_scope = copy.deepcopy(inv)
        invalid_scope['request']['deliveries'][0]['inventory']['roles'] = roles
        rejected(model, invalid_scope, None)
    forged = model.project(probes['awareConsumer']['request']['deliveries'][0])
    forged['inventory'] = copy.deepcopy(projection['inventory'])
    rejected(model, probes['awareConsumer'], [forged])

    # Second addition: original readers remain unmarked, actual inventory readers accumulate causes.
    cumulative = copy.deepcopy(extended)
    accept(cumulative, probes['complementary'])
    after_first = renamed(inv, 'between-additions')
    accept(cumulative, after_first)
    before_qs, before_ds = set(cumulative.queries), set(cumulative.reconsideration()['designations'])
    accept(cumulative, probes['behavioral'])
    second = impact(cumulative, 'RECOVERY-CAVEAT-1::addition', before_qs, before_ds)
    assert second['affectedEvaluations'] == ['Q-between-additions', 'Q-inventory', 'Q-inventory-dependent']
    assert second['counts']['affectedDesignations'] == 3
    for qid in qs:
        assert not {'CATEGORY-DETAIL-1::addition', 'RECOVERY-CAVEAT-1::addition'} & set(cumulative.reconsideration()['evaluations'][qid])
    assert cumulative.reconsideration()['evaluations']['Q-between-additions'] == ['RECOVERY-CAVEAT-1::addition']
    assert not cumulative.reconsideration()['evaluations']['Q-category-detail']
    after_both = renamed(inv, 'after-both-additions')
    accept(cumulative, after_both)
    assert not cumulative.reconsideration()['evaluations']['Q-after-both-additions']

    report = {
        'status': 'Authored before/after boundary comparison, not product acceptance or semantic reassessment. Association delivery is not inventory exposure.',
        'earlierEntityWidePolicy': {'status': 'Historical broad-policy comparison only; not the recommended rule.',
                                   'independentComparisons': legacy['independentComparisons']},
        'associationInventoryPolicy': {'baseline': baseline, 'independentComparisons': comparisons,
                                      'explicitInventoryBaseline': capture(extended),
                                      'explicitInventoryComparisons': inventory_comparisons,
                                      'scopeChecks': {q: causes[q] for q in ['Q-identifying-inventory', 'Q-other-inventory', 'Q-empty-inventory']},
                                      'timingChecks': {q: timing.reconsideration()['evaluations'][q] for q in ['Q-inventory-after', 'Q-inventory-spanning', 'Q-late-inventory', 'Q-inventory-result-after']},
                                      'displacementChecks': {q: displacement_status['evaluations'][q] for q in ['Q-observer', 'Q-before-expansion', 'Q-reference-only']},
                                      'withdrawalChecks': {q: withdrawal_status['evaluations'][q] for q in ['Q-before-withdrawal-inventory', 'Q-before-withdrawal-content']},
                                      'cumulativeSecondAddition': second,
                                      'afterBothAdditionCauses': cumulative.reconsideration()['evaluations']['Q-after-both-additions']},
        'limitations': ['Inventory scope is a complete all-retained entity/role listing in this small fixture; pagination, relevance-ranked discovery and current-only inventories are not generalized.',
                       'Inventory entries contain only mechanical addresses and roles. Authored summaries, names, reasons or qualifications would require their own content exposure.',
                       'Direct matching is structural, not semantic. Inventory-driven producer concerns still propagate conservatively to all delivered contributions.',
                       'Fixed designation membership is not inventory exposure. Exact displacement membership causes remain, and a producing investigation may have inventory exposure.',
                       'No targeted suppression, reassessment, clearance, notification UI or dialog protocol implemented.']}
    path = directory / 'addition-report.json'
    if write:
        path.write_text(json.dumps(report, indent=2) + '\n')
    else:
        assert read(path) == report, 'stale addition report'
    print(f'{directory.name}: original 7 evaluations / 8 designations: each addition now affects 0/7 and 0/8 (earlier 5/7 and 7/8). Explicit inventory branch: 2/9 evaluations and 2/10 designations; 1 direct, 1 inherited.')
    return report


if __name__ == '__main__':
    legacy_start = rejected_count
    mixed_legacy = check_legacy(BASE)
    children_legacy = check_legacy(BASE / 'children')
    legacy_rejections = rejected_count - legacy_start
    current_start = rejected_count
    mixed = check_inventory(BASE, mixed_legacy, '--write' in sys.argv)
    children = check_inventory(BASE / 'children', children_legacy, '--write' in sys.argv)
    for name in ['complementary', 'behavioral']:
        for group in ['independentComparisons', 'explicitInventoryComparisons']:
            assert mixed['associationInventoryPolicy'][group][name]['counts'] == children['associationInventoryPolicy'][group][name]['counts']
    print(f'Association/inventory scope, timing, acquisition, exact history and displacement checks pass; {rejected_count - current_start} malformed inventory/reference cases rejected; {legacy_rejections} historical broad-policy disclosure negatives retained.')
