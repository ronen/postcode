"""Read-only public package metadata snapshot; never installs or imports packages."""
import concurrent.futures
import datetime
import json
import pathlib
import urllib.parse
import urllib.request

PACKAGES = ['@dagrejs/graphlib', 'graphology', 'graphology-components', 'commander',
            'shell-quote', 'string-width', 'wrap-ansi', 'zod', 'simple-git', 'execa',
            'ignore', 'fast-glob', 'ts-morph', 'chokidar', 'piscina',
            'fast-json-stable-stringify', 'pino', 'tinybench']

def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'PostCode-library-reuse-audit'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)

def inspect(name):
    url = 'https://registry.npmjs.org/' + urllib.parse.quote(name, safe='')
    result = {'name': name, 'registry_url': url}
    try:
        metadata = fetch(url)
        version = metadata['dist-tags']['latest']
        package = metadata['versions'][version]
        result.update(version=version, published=metadata.get('time', {}).get(version),
                      created=metadata.get('time', {}).get('created'),
                      license=package.get('license'), engines=package.get('engines'),
                      dependencies=package.get('dependencies', {}),
                      peerDependencies=package.get('peerDependencies', {}),
                      repository=package.get('repository'), deprecated=package.get('deprecated'))
        downloads_url = 'https://api.npmjs.org/downloads/point/last-week/' + urllib.parse.quote(name, safe='')
        result['downloads_url'] = downloads_url
        try:
            result['downloads'] = fetch(downloads_url)
        except Exception as error:
            result['downloads_error'] = str(error)
    except Exception as error:
        result['error'] = str(error)
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(inspect, PACKAGES))
snapshot = {'retrieved_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'packages': results}
destination = pathlib.Path(__file__).with_name('package-evidence.json')
destination.write_text(json.dumps(snapshot, indent=2) + '\n')
for result in results:
    print(json.dumps({key: result[key] for key in ['name', 'version', 'published', 'license', 'engines', 'dependencies', 'downloads', 'error'] if key in result}))
