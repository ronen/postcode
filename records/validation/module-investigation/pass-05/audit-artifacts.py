"""Supplementary syntax and credential-pattern checks, not a secrecy proof."""
from pathlib import Path
import json,re
base=Path(__file__).parent
files=0;lines=0;flagged=[]
patterns=[re.compile(r'\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}'),re.compile(r'Bearer\s+[A-Za-z0-9_.-]{20,}'),re.compile(r'eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}')]
def check_keys(v,path):
 if isinstance(v,dict):
  for k,x in v.items():
   if path.name=='manifest.json' and k=='authorization' and x=='1d74cb4 (milestone 5); bd00b66 (controlled-case refinement)':continue
   if k.lower() in ['access_token','refresh_token','id_token','client_secret','authorization'] and isinstance(x,str) and len(x)>20:flagged.append({'file':str(path),'reason':'credential-shaped field'})
   check_keys(x,path)
 elif isinstance(v,list):
  for x in v:check_keys(x,path)
for p in base.rglob('*'):
 if not p.is_file() or p.name=='artifact-verification.json':continue
 s=p.read_text();files+=1
 if any(pattern.search(s) for pattern in patterns):flagged.append({'file':str(p),'reason':'credential-shaped value'})
 if p.suffix=='.json':check_keys(json.loads(s),p)
 if p.suffix=='.jsonl':
  for line in s.splitlines():check_keys(json.loads(line),p);lines+=1
out={'filesChecked':files,'jsonlRecordsChecked':lines,'flagged':flagged,'reviewedFalsePositive':'The frozen manifest authorization field is the exact plain-text commit references for milestone-5 authorization and controlled-case refinement, not a credential.','limitations':'Pattern and field checks are supplementary, do not inspect real credentials, and do not prove absence of all sensitive content. Exact opaque provider reasoning payloads are retained transport evidence, not decoded or evaluated.'}
(base/'artifact-verification.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2));assert not flagged
