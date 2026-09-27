"""Inspect selected published sources without extraction, installation, or execution."""
import io
import json
import pathlib
import tarfile
import urllib.request

root = pathlib.Path(__file__).parent
packages = {item['name']: item for item in json.loads((root / 'package-evidence.json').read_text())['packages']}
selection = {
    '@dagrejs/graphlib': ['tarjan'],
    'graphology-components': ['package/index.js'],
    'fast-json-stable-stringify': ['package/index.js'],
}
for name, patterns in selection.items():
    item = packages[name]
    url = item['registry_url'] + '/' + item['version']
    with urllib.request.urlopen(url, timeout=30) as response:
        metadata = json.load(response)
    tarball = metadata['dist']['tarball']
    with urllib.request.urlopen(tarball, timeout=30) as response:
        archive = tarfile.open(fileobj=io.BytesIO(response.read()), mode='r:gz')
    print('\nPACKAGE', name, item['version'], tarball)
    names = [member.name for member in archive.getmembers() if member.isfile() and any(p in member.name for p in patterns) and member.name.endswith(('.js', '.mjs', '.cjs'))]
    if not names:
        names = [member.name for member in archive.getmembers() if member.isfile() and member.name.endswith(('.js', '.mjs', '.cjs')) and 'min' not in member.name][:1]
    for member in names:
        text = archive.extractfile(member).read().decode('utf8')
        if name == '@dagrejs/graphlib' and len(text) > 20000:
            start = text.find('function tarjan(')
            text = text[start:start+4500]
        if name == 'graphology-components':
            text = text[text.find('function stronglyConnectedComponents'):]
        print('FILE', member, '\n', text[:12000])
