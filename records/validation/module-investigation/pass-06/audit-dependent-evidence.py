from pathlib import Path
import json
base=Path('records/validation/module-investigation/pass-06');case=base/'dependent-numeric-m5'
bs=[json.loads(l) for l in (case/'observations.jsonl').read_text().splitlines()]
views=[next((r['value'] for r in b['records'] if r['kind']=='qualified-view'),None) for b in bs]
views=[v for v in views if v]
originals={name:views[i]['result']['evaluation']['outcome']['root'] for i,name in enumerate(['A','Y','Z'])}
usage=next(v['usage'] for v in reversed(views) if 'usage' in v)
xs=[json.loads(l) for l in (case/'exchanges.jsonl').read_text().splitlines()]
source=Path('fixtures/dependent-investigation-assessment/classify.ts').read_text()
rows=[];offset=0
for attempt in usage['attempts']:
 if attempt['agent']['origin']!='hosted':continue
 n=len(attempt['usage']);exchanges=xs[offset:offset+n];offset+=n
 bodies={};citation_handles={}
 for ordinal,x in enumerate(exchanges,1):
  bindings={r['handle']:r['reference'] for r in x['references']['bindings']}
  for item in x['request']['input']:
   raw=item.get('output') if item.get('type')=='function_call_output' else item.get('content') if item.get('role')=='user' else None
   if not isinstance(raw,str):continue
   content=json.loads(raw)
   for response in content if isinstance(content,list) else content.get('responses',[]):
    for record in response.get('records',[]):
     if record.get('kind')=='captured-content' and record.get('text')==source:
      bodies.setdefault(bindings[record['id']],{'firstExchange':ordinal,'coverage':record['coverage'],'path':record['path'],'digest':record['contentDigest']})
    for correction in response.get('corrections',[]):
     citation_handles[bindings[correction['id']]]=bindings[correction['reporter']]
 accepted=next((v for v in views if (v.get('result') or {}).get('attempt')==attempt['attempt'] and ((v.get('result') or {}).get('evaluation') or {}).get('outcome',{}).get('kind')=='accepted'),None)
 corrections=[]
 if accepted:
  ids=set(accepted['result']['evaluation']['corrections'])
  corrections=[{'id':c['id'],'target':c['target'],'replacement':c['replacement'],'reason':c['reason'],'evidence':c['evidence']} for c in accepted['corrections'] if c['id'] in ids]
 row={'subject':attempt['request']['subject'],'termination':attempt['termination'],'sourceBodiesActuallyReceived':bodies,
      'suppliedCorrectionToReporter':citation_handles,'acceptedCorrections':corrections,
      'dependentCorrections':[c['id'] for c in corrections if c['target'] in [originals['Y'],originals['Z']]]}
 rows.append(row)
assert offset==len(xs)
correction_evidence=[r for x in xs for r in x['references']['resolutions']
                     if '.evidence[' in r['path'] and ':investigram-correction:' in r['reference']]
assert not correction_evidence
assert all(r['sourceBodiesActuallyReceived'] for r in rows)
result={'originals':originals,'evaluations':rows,'acceptedDependentCorrectionCount':sum(len(r['dependentCorrections']) for r in rows),
 'distinctDependentAccountsCorrected':len({c['target'] for r in rows for c in r['acceptedCorrections'] if c['target'] in [originals['Y'],originals['Z']]}),
 'correctionRelationshipsUsedAsEvidence':len(correction_evidence),
 'limits':'This audit establishes delivery and accepted relationships, not semantic truth. Compare assertions/reasons with frozen source and source-informed findings; warnings alone are not proof of error.'}
(base/'dependent-evidence-verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'acceptedDependentCorrections':result['acceptedDependentCorrectionCount'],'evaluations':[(r['termination'],len(r['sourceBodiesActuallyReceived']),len(r['dependentCorrections'])) for r in rows]}))
