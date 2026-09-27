"""Collect public npm metadata and published JS sources; no package execution."""
import concurrent.futures, datetime, io, json, pathlib, tarfile, urllib.parse, urllib.request
ROOT = pathlib.Path(__file__).parent / 'graph-research'
NAMES = ['strongly-connected-components', '@rtsao/scc', '@dagrejs/graphlib', 'graphology', 'graphology-components', '@statelyai/graph', 'directed-graph-typed', 'graph-data-structure', 'cytoscape', '@thi.ng/adjacency']
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'PostCode-library-audit'}), timeout=45) as r: return r.read()
def inspect(name):
    url='https://registry.npmjs.org/'+urllib.parse.quote(name,safe='')
    meta=json.loads(get(url)); version=meta['dist-tags']['latest']; p=meta['versions'][version]
    result={k:p.get(k) for k in ['name','version','license','engines','dependencies','peerDependencies','peerDependenciesMeta','repository','types','main','module','exports','dist']}
    result.update(registry_url=url,created=meta['time']['created'],published=meta['time'][version])
    try: result['downloads']=json.loads(get('https://api.npmjs.org/downloads/point/last-week/'+urllib.parse.quote(name,safe='')))
    except Exception as e: result['downloads_error']=str(e)
    dest=ROOT/'sources'/name.replace('/','__'); dest.mkdir(parents=True,exist_ok=True)
    with tarfile.open(fileobj=io.BytesIO(get(p['dist']['tarball'])),mode='r:gz') as archive:
        for member in archive:
            path=pathlib.PurePosixPath(member.name)
            if not member.isfile() or '..' in path.parts or path.is_absolute(): continue
            if path.suffix not in ['.js','.mjs','.cjs','.ts','.mts','.cts','.json','.md'] and 'LICENSE' not in path.name.upper(): continue
            target=dest.joinpath(*path.parts[1:]); target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(archive.extractfile(member).read())
    return result
ROOT.mkdir(exist_ok=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: results=list(pool.map(inspect,NAMES))
(ROOT/'package-evidence.json').write_text(json.dumps({'retrieved_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'packages':results},indent=2)+'\n')
for p in results: print(json.dumps({k:p.get(k) for k in ['name','version','created','published','license','dependencies','downloads']}))
