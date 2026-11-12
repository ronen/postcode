"""Current association/entity-context fixtures. No product acceptance or semantic proof."""
import copy
import json
from pathlib import Path
import runpy
import sys

BASE=Path(__file__).resolve().parent
m=runpy.run_path(str(BASE/'model.py'))
read=m['read']; address=m['address']; label=m['label']
negative_count=0

def rejected(name,fn):
    global negative_count
    try: fn()
    except (AssertionError,KeyError,TypeError,ValueError): negative_count+=1
    else: raise AssertionError('Invalid fixture accepted: '+name)

def declaration(doc,key):
    return next(s for a in doc['result']['investigrams'] for s in a['associationSpecifications'] if s['key']==key)

def item(doc,key):
    return next(i for a in doc['result']['investigrams'] for i in a['content'] if i['key']==key)

def selection(entity,oid,key):
    return {'entity':entity,'associations':[{'investigram':oid,'associationKey':key}],'items':[],'options':[]}

def check_variant(directory,write=False):
    ledger=read(directory/'context-and-bindings.json');probes=read(directory/'lifecycle-probes.json')
    first=read(directory/'first-result.json');follow=read(directory/'followup-result.json')
    state=m['initial_model'](directory)
    state.accept(first,ledger['firstAcceptance'],ledger['firstRequest'])
    original_bundles=copy.deepcopy(state.investigrams);original_answer=copy.deepcopy(state.snapshots['Q1'])
    initial=copy.deepcopy(state)
    observer=probes['observer'];state.accept(observer['submission'],observer['bindings'],observer['request'])
    excerpt=probes['excerptConsumer'];state.accept(excerpt['submission'],excerpt['bindings'],excerpt['request'])
    before_follow=copy.deepcopy(state)
    state.accept(follow,ledger['followupAcceptance'],ledger['followupRequest'])
    assert state.snapshots['Q1']==original_answer
    assert all(state.investigrams[k]==v for k,v in original_bundles.items()), 'retained bundle mutated'
    assert state.standing(('ADMISSION-1','admission-cases'))['displacedBy']==['ADMISSION-2::admission-cases']
    definitions=[r for r,s in state.declarations().items() if s['target']=={'entity':{'entity':'S'},'role':'identifies'}]
    original_definition=definitions[0]
    assert not state.standing(original_definition)['displacedBy']
    assert state.queries['Q2']['exposureIndex']==['RESULT-Q1']
    initial_designation=label(address(ledger['initialResultAssociation'],'associationKey'))
    updated_designation=label(address(ledger['updatedResultAssociation'],'associationKey'))
    def designation_status(model, ref):return model.reconsideration()['designations'][ref]
    def warnings(model, ref):return designation_status(model,ref)['needsReconsideration']
    admission_cause='ADMISSION-2::admission-cases'
    statuses=state.reconsideration()
    assert statuses['evaluations']['Q1']==[], 'own output was mistaken for incoming exposure'
    assert admission_cause in warnings(state,initial_designation)
    assert updated_designation in designation_status(state,initial_designation)['displacedBy']
    assert updated_designation not in warnings(state,initial_designation), 'displaced standing became a self-warning'
    assert warnings(state,'OBSERVER-1::result')
    assert not warnings(state,updated_designation), 'updated designation inherits its own repair cause'
    assert statuses['evaluations']['Q2']==[], 'producer inherited its own cause'
    assert statuses['evaluations']['Q-excerpt']==[admission_cause], 'excerpt lost its exact use or gained undelivered result membership'
    updated=probes['updatedConsumer'];state.accept(updated['submission'],updated['bindings'],updated['request'])
    assert not state.reconsideration()['evaluations']['Q-updated'], 'new designation confused with original designation'
    assert not warnings(state,'UPDATED-1::result')
    after_admission=copy.deepcopy(state.reconsideration())
    # Fresh lookup discloses declarations; exact prior answer never acquires later notices.
    old_projection=state.project(selection('P','ADMISSION-1','admission-cases'))
    assert 'ADMISSION-2::admission-cases' in old_projection['notices']
    assert not original_answer['notices']
    new_projection=state.project(selection('P','ADMISSION-2','admission-cases'))
    assert 'ADMISSION-1::admission-cases' not in new_projection['items']
    assert len(new_projection['items'])==1
    # The result redesignation includes existing associations without reparenting/copying content.
    upd=ledger['updatedResultAssociation']
    revised_result=state.project(selection('RESULT-Q1',upd['investigram'],upd['associationKey']))
    assert label(original_definition) in revised_result['declarations']
    assert 'ADMISSION-1::admission-cases' not in revised_result['declarations']
    assert 'ADMISSION-2::admission-cases' in revised_result['declarations']
    assert state.investigrams['ADMISSION-2']['content'][0]['key']=='admission-cases'
    assert len(state.investigrams['ADMISSION-2']['content'])==1
    assert state.investigrams['ADMISSION-2']['followupOptions']==[]
    # Excerpt/identifier delivery is not enough to displace a whole selected association.
    actual=[before_follow.project(x) for x in ledger['followupRequest']['deliveries']]
    for part in ['items','declarations']:
        delivered=copy.deepcopy(actual);delivered[0][part]={}
        rejected('incomplete target '+part,lambda: copy.deepcopy(before_follow).accept(follow,ledger['followupAcceptance'],ledger['followupRequest'],delivered))
    for field in ['sourceQualifications','sourceEvidence','basis','queryInvocation']:
        delivered=copy.deepcopy(actual)
        next(iter(delivered[0]['items'].values())).pop(field)
        rejected('missing target '+field,lambda: copy.deepcopy(before_follow).accept(follow,ledger['followupAcceptance'],ledger['followupRequest'],delivered))
    for field in ['missing','scope','subject','parameterValues']:
        delivered=copy.deepcopy(actual)
        if field=='missing':delivered[0]['queryMeanings']={}
        elif field=='scope':delivered[0]['queryMeanings']['RESULT-Q1']['declaredMeaning']['scope']='unqualified changed question'
        else:delivered[0]['queryMeanings']['RESULT-Q1'][field]={'changed':True}
        rejected('redesignation without exact question '+field,lambda: copy.deepcopy(before_follow).accept(follow,ledger['followupAcceptance'],ledger['followupRequest'],delivered))
    delivered=copy.deepcopy(actual);delivered[0]['associationUses']={}
    rejected('stripped association use',lambda:copy.deepcopy(before_follow).accept(follow,ledger['followupAcceptance'],ledger['followupRequest'],delivered))
    for field in ['missing','wrong']:
        excerpt_selection=copy.deepcopy(probes['excerptConsumer']['request']['deliveries'][0])
        if field=='missing':excerpt_selection['items'][0].pop('viaAssociation')
        else:excerpt_selection['items'][0]['viaAssociation']['associationKey']='absent'
        rejected('excerpt association route '+field,lambda:before_follow.project(excerpt_selection))
    # Revising the architectural association need not redesignate every containing result.
    no_redesignation=copy.deepcopy(follow)
    for a in no_redesignation['result']['investigrams']:
        a['associationSpecifications']=[sp for sp in a['associationSpecifications'] if sp['key']!='updated-admission-result']
        for sp in a['associationSpecifications']:
            sp['members']=[m for m in sp.get('members',[]) if m.get('declaration',{}).get('associationKey')!='updated-admission-result']
    optional=copy.deepcopy(before_follow);optional.accept(no_redesignation,ledger['followupAcceptance'],ledger['followupRequest'])
    assert not designation_status(optional,initial_designation)['displacedBy']
    assert admission_cause in warnings(optional,initial_designation)
    mutations={
        'absent displaces':lambda d: declaration(d,'admission-cases').pop('displaces'),
        'missing reason':lambda d: declaration(d,'admission-cases').update(reason=''),
        'wrong target':lambda d: declaration(d,'admission-cases')['target'].update(entity={'entity':'S'}),
        'unknown old declaration':lambda d: declaration(d,'admission-cases')['displaces'][0].update(associationKey='absent'),
        'same-result displacement':lambda d: declaration(d,'admission-cases')['displaces'][0].update(investigram={'submittedInvestigram':'trial'}),
        'result-role mismatch':lambda d: declaration(d,'updated-admission-result')['target'].update(role='describes'),
        'entity-result mismatch':lambda d: declaration(d,'admission-cases')['target'].update(role='result'),
        'withdrawal has members':lambda d: declaration(d,'admission-cases').update(operation='withdrawal'),
        'addition displaces':lambda d: declaration(d,'admission-cases').update(operation='addition'),
        'unknown member':lambda d: declaration(d,'admission-cases')['members'][0]['item'].update(contentKey='absent'),
        'undeclared entity':lambda d: item(d,'shared-breaker-description')['subject'].update(introducedEntity='absent'),
        'duplicate entity declaration':lambda d: item(d,'trial-description').update(subject={'introducedEntity':'shared-breaker'}),
        'forward cause':lambda d: item(d,'concurrent-callers')['prefix'][0].update(causedBy=['wait']),
        'unknown state model':lambda d: next(s for b in item(d,'concurrent-callers')['alternatives'] for s in b['steps'] if s['kind']=='state-transition').update(stateContent='absent'),
        'unknown local role':lambda d: item(d,'admission-cases').update(stateBearer={'localRole':'absent'}),
        'bare new unassociated content':lambda d: d['result']['investigrams'][0]['content'].append({'key':'uncovered','contentType':'prose/0','text':'not selected','evidence':[]}),
        'cyclic result designation':lambda d: declaration(d,'result')['members'].append({'declaration':{'investigram':{'submittedInvestigram':d['result']['investigrams'][0]['key']},'associationKey':'result'}}),
        'old child adoption':lambda d: d['result']['investigrams'][0]['children'].append({'investigram':'ADMISSION-1'}),
        'unknown type':lambda d: item(d,'recovery').update(contentType='invented/0'),
    }
    for name,mutate in mutations.items():
        bad=copy.deepcopy(follow);mutate(bad);candidate=copy.deepcopy(before_follow);saved=copy.deepcopy(candidate.__dict__)
        rejected(name,lambda: candidate.accept(bad,ledger['followupAcceptance'],ledger['followupRequest']))
        assert candidate.__dict__==saved, 'invalid acceptance partially mutated state'
    # Expansion flags result composition even though Q1 was never exposed to the newly introduced S.
    assert 'S' not in state.queries['Q1']['exposureIndex']
    for name in ['expansion','reuse','withdrawal']:
        p=probes[name];state.accept(p['submission'],p['bindings'],p['request'])
    expansion_cause='EXPANSION-1::expanded-identification'
    status=state.reconsideration()
    assert expansion_cause in warnings(state,initial_designation)
    assert expansion_cause not in status['evaluations']['Q1'], 'composition invented incoming exposure'
    assert expansion_cause in warnings(state,'OBSERVER-1::result')
    assert expansion_cause in warnings(state,updated_designation), 'updated designation incorrectly clears an independent later cause'
    assert status['evaluations']['Q1']==[], 'later associations on P fabricated earlier exposure'
    withdrawal_cause='WITHDRAW-1::withdraw-policy-indexing'
    assert withdrawal_cause in warnings(state,'REUSE-1::result')
    assert all(withdrawal_cause not in cs for cs in status['evaluations'].values()), 'withdrawal reached unexposed or own producer evaluation'
    assert withdrawal_cause not in warnings(state,initial_designation), 'shared content falsely implied shared association use'
    assert withdrawal_cause not in warnings(state,updated_designation)
    assert admission_cause not in status['evaluations']['Q-reuse'], 'an unreceived admission association contaminated the reused definition'
    assert admission_cause not in status['evaluations']['Q-expansion'], 'propagation went backwards through Q1 output'
    assert not warnings(state,'EXPANSION-1::result'), 'expansion acquired unrelated/self causes'
    assert not state.project(selection('S',original_definition[0],original_definition[1]))['notices'].get(withdrawal_cause), 'unrelated withdrawal notice on shared item'
    assert state.investigrams['REUSE-1']['content']==state.investigrams['WITHDRAW-1']['content']==[]
    reuse=('REUSE-1','policy-state-description')
    assert state.standing(reuse)['displacedBy']==['WITHDRAW-1::withdraw-policy-indexing']
    assert state.standing(original_definition)['displacedBy']==[expansion_cause], 'withdrawal crossed association targets'
    withdrawal_projection=state.project(selection('RESULT-withdraw','WITHDRAW-1','result'))
    assert not withdrawal_projection['items'] and withdrawal_projection['declarations'], 'declaration-only result lost substance'
    assert state.snapshots['Q1']==original_answer
    # Independently authored competing supersession is retained, never chosen by timestamp here.
    competing=copy.deepcopy(probes['expansion']);competing['request'].update(id='Q-competing',resultEntity='RESULT-competing')
    competing['submission']['result']['queryInvocation']='Q-competing'
    competing['bindings']['entityIds']['query-result']='RESULT-competing'
    competing['bindings']['investigramIds']['contribution']='COMPETING-1'
    state.accept(competing['submission'],competing['bindings'],competing['request'])
    assert state.standing(original_definition)['competingDeclarations']
    report={'status':'Generated by check-fixtures.py from current authored fixtures. No application/live validation.',
            'queryExposure':{k:{'contextEntities':v['exposureIndex'], 'associationUses':sorted({r for d in v['deliveries'] for r in d['associationUses']})} for k,v in state.queries.items()},
            'q1QuestionDeliveredForRedesignation':state.queries['Q2']['deliveries'][0]['queryMeanings']['RESULT-Q1'],
            'negativeAssertions':['Q1 has no incoming-exposure causes from its own output or subsequently created associations.','Q-excerpt receives the admission cause, not displacement of an undelivered result designation.','The updated designation and its consumer have no admission/redesignation warnings before independent expansion.','Withdrawal does not warn other uses of the same content; optional redesignation leaves other result membership unchanged.'],
            'originalAnswerStillExact':state.snapshots['Q1']==original_answer,
            'admissionAssociation':state.standing(('ADMISSION-1','admission-cases')),
            'identifyingAssociation':state.standing(original_definition),'withdrawnAssociation':state.standing(reuse),
            'reconsideration':state.reconsideration(),
            'checkpoints':{'afterAdmissionFollowup':after_admission, 'afterWithdrawalBeforeCompeting':status},
            'qualifiedCurrentAdmissionProjection':new_projection,
            'qualifiedHistoricalAdmissionProjection':old_projection,
            'qualifiedDeclarationOnlyResult':withdrawal_projection,
            'limitations':['Additions do not trigger in this prototype; policy unresolved.','Exact association uses determine displacement exposure; generating-evaluation provenance remains conservative across its outputs.','No received-cause completeness exemption, reassessment clearance, or automatic reinstatement of withdrawn associations.']}
    path=directory/'lifecycle-report.json'
    if write:path.write_text(json.dumps(report,indent=2)+'\n')
    else:assert read(path)==report, 'stale lifecycle report'
    return state

mixed=check_variant(BASE,'--write' in sys.argv)
children=check_variant(BASE/'children','--write' in sys.argv)
for key in ['recovery','concurrent-callers']:
    assert mixed.items()[('TRIAL-1',key)]==children.items()[('TRIAL-1',key)]
print(f'Both partitions pass: declaration lifecycle, qualified entity delivery, exact history, result/exposure propagation, and atomic acceptance; {negative_count} malformed cases rejected.')
print('Architectural state/interaction content matches across partitions. This is not product acceptance or semantic verification.')
