from pathlib import Path
import hashlib, json, re, subprocess
out=Path(__file__).resolve().parent
root=out.parent
base=json.loads((out/'baseline.json').read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
changed=[p for p,h in base['sha256'].items() if not (root/p).is_file() or sha(root/p)!=h]
old=json.loads((root/'_codex-processing-cost-audit-2026-09-27/source-manifest.json').read_text())['sha256']
old_changes=[p for p,h in old.items() if not (root/p).is_file() or sha(root/p)!=h]
links=[]; bad=[]
for f in [out/'REPORT.md',out/'REPRODUCE.md']:
 for target in re.findall(r'\]\(([^)]+)\)',f.read_text()):
  if target.startswith('https://'): continue
  links.append(target)
  if not (f.parent/target.split('#')[0]).exists(): bad.append(target)
refs=[]; badrefs=[]
for file,first,last in re.findall(r'`((?:src|test|scripts|docs)/[\w./-]+):(\d+)(?:[–-](\d+))?`',(out/'REPORT.md').read_text()):
 p=root/file
 if not p.is_file() or len(p.read_text().splitlines())<int(last or first): badrefs.append((file,first,last))
 refs.append((file,first,last))
result={
 'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),
 'status':subprocess.check_output(['git','status','--short','--untracked-files=all'],cwd=root,text=True),
 'trackedFileCount':len(base['sha256']), 'changedTrackedFilesSinceStart':changed,
 'changedFilesSincePriorProcessingManifest':old_changes,
 'localMarkdownLinksChecked':len(links),'brokenLinks':bad,
 'explicitSourceLineReferencesChecked':len(refs),'outOfBoundsSourceReferences':badrefs,
 'reviewDirectoryIgnored':subprocess.run(['git','check-ignore','-q',str(out/'REPORT.md')],cwd=root).returncode==0,
 'guidelineSha256':sha(root/'dev/engineering-guidelines.md'),
 'graphPackageVersion':json.loads((out/'upstream/stately-graph/package.json').read_text())['version'],
 'reviewArtifactSha256':{str(p.relative_to(out)):sha(p) for p in [out/'REPORT.md',out/'probes.mjs',out/'probe-results.json',out/'terminal-results.json',out/'timeout-results.json']},
 'graphPublishedSourceSha256':{str(p.relative_to(out)):sha(p) for p in (out/'upstream/stately-graph').rglob('*') if p.is_file()},
}
(out/'final-verification.json').write_text(json.dumps(result,indent=2)+'\n')
assert not changed and not old_changes and not bad and not badrefs
print(f'Preserved {len(base["sha256"])} tracked files; {len(links)} local links and {len(refs)} explicit source ranges valid.')
print(result['status'],end='')
