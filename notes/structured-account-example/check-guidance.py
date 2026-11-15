"""Follow-up options and authored illustrations through entity/result context, not bundle exposure."""
import copy
from pathlib import Path
import runpy

BASE=Path(__file__).resolve().parent
m=runpy.run_path(str(BASE/'model.py'));g=runpy.run_path(str(BASE/'guidance.py'));read=m['read']
count=0

def reject(name,fn):
    global count
    try:fn()
    except (AssertionError,KeyError,TypeError):count+=1
    else:raise AssertionError('Invalid guidance accepted: '+name)

def resolve_option(model,request):
    assert request['operation']=='follow-up-investigation'
    assert request['subject']=={'entity':'RESULT-Q1'}
    assert request['parameterValues']=={}
    selection=request['option'];assert set(selection)=={'investigram','optionKey'}
    owner=model.investigrams[selection['investigram']]
    options=[x for x in owner['followupOptions'] if x['key']==selection['optionKey']]
    assert len(options)==1
    g['validate_option'](options[0])
    assert any(x['investigram']==selection['investigram'] and x['optionKey']==selection['optionKey'] for d in request['deliveries'] for x in d['options'])
    return options[0]['targets']

for directory in [BASE,BASE/'children']:
    ledger=read(directory/'context-and-bindings.json');model=m['run_variant'](directory)
    request=ledger['followupRequest']
    assert resolve_option(model,request)==[{'role':'focus','subject':{'entity':'S'}}]
    assert model.queries['Q2']['exposureIndex']==['RESULT-Q1']
    delivered=model.queries['Q2']['deliveries'][0]
    option=delivered['options']['ADMISSION-1::concurrent-callers-option']
    assert option['sourceQualifications']==model.investigrams['ADMISSION-1']['qualifications']
    assert option['queryInvocation']=='Q1' and option['basis']==ledger['basis']
    # Bare identity/navigation availability is not exposure. An option excerpt is substantive result exposure.
    bare=model.project({'entity':'RESULT-Q1','associations':[],'items':[],'options':[]})
    assert not any(bare[k] for k in ['declarations','items','options','notices'])
    excerpt=model.project({'entity':'RESULT-Q1','associations':[],'items':[],'options':[request['option']]})
    assert excerpt['options'] and not excerpt['declarations'] and not excerpt['items']
    assert model.investigrams['ADMISSION-2']['followupOptions']==[]
    for label,change in {
        'label as key':lambda r:r['option'].update(optionKey='Concurrent callers and trial outcomes'),
        'missing owner':lambda r:r['option'].update(investigram='absent'),
        'new owner fallback':lambda r:r['option'].update(investigram='ADMISSION-2'),
        'content namespace':lambda r:r['option'].update(contentKey=r['option'].pop('optionKey')),
        'undeclared parameters':lambda r:r.update(parameterValues={'question':'new question'}),
        'entity mistaken for originating result':lambda r:r.update(subject={'entity':'S'}),
    }.items():
        bad=copy.deepcopy(request);change(bad);reject(label,lambda:resolve_option(model,bad))
    owner=model.investigrams['TRIAL-1'];plans=g['illustration_plans'](owner,'TRIAL-1')
    access=read(directory/'guidance-access.json');without=copy.deepcopy(owner);without['illustrations']=[]
    direct=[g['diagram_plan'](without,x['diagramType'],x['inputs'],'TRIAL-1') for x in access['directDiagramSelections']]
    assert direct==[{k:v for k,v in p.items() if k!='illustration'} for p in plans]
    for plan,expected in zip(plans,access['illustrationInputs']):
        assert {i['key'] for i,_ in list(plan['inputs'].values())+list(plan['dependencies'].values())}==set(expected['availableForBoundedRender'])
    for label,change in {
        'missing model':lambda a:a['content'].__setitem__(slice(None),[i for i in a['content'] if i['key']!='recovery']),
        'wrong dependency type':lambda a:next(i for i in a['content'] if i['key']=='recovery').update(contentType='prose/0'),
        'unknown transition':lambda a:next(i for i in a['content'] if i['key']=='recovery').update(transitions=[]),
        'unknown diagram':lambda a:a['illustrations'][0].update(diagramType='invented/0'),
        'duplicate dependency binding':lambda a:a['illustrations'][1]['inputs'].update(stateModel={'investigram':{'investigram':'TRIAL-1'},'contentKey':'recovery'}),
        'wrong owner':lambda a:a['illustrations'][0]['inputs']['model'].update(investigram={'investigram':'ADMISSION-2'}),
        'missing qualification':lambda a:a['illustrations'][0].update(qualifications=[]),
    }.items():
        bad=copy.deepcopy(owner);change(bad);reject(label,lambda:g['illustration_plans'](bad,'TRIAL-1'))
print(f'Follow-up options preserve exact provenance, Query-result context and actual exposure; direct and authored illustrations agree; {count} malformed guidance cases rejected.')
