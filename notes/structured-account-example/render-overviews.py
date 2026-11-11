"""Generate/check compact illustrative diagrams with separate qualified legends.
No product renderer or semantic analysis. Run with --write to update authored artifacts.
"""
import json
from pathlib import Path
import sys

BASE = Path(__file__).resolve().parent


def read(path):
    return json.loads(path.read_text())


def emit(path, content, write):
    if write:
        path.write_text(content)
    else:
        assert path.read_text() == content, f'Stale generated overview/legend: {path.name}'


def mm(s):
    return ''.join({'&': '#38;', '"': '#34;', ';': '#59;', '\n': '<br/>'}.get(c, c) for c in s)


def cell(s):
    return str(s).replace('|', '&#124;').replace('\n', '<br/>')


def short(item):
    value = item['displayLabel']
    assert isinstance(value, str) and value.strip(), 'missing authored concise label'
    return value


def ref_text(ref, ledger):
    if 'entity' in ref:
        return ref['entity']
    if 'introducedEntity' in ref:
        for key, stage in ledger.items():
            if key.endswith('Acceptance') and ref['introducedEntity'] in stage.get('entityIds', {}):
                return stage['entityIds'][ref['introducedEntity']]
    if 'localRole' in ref:
        return 'local role ' + ref['localRole']
    if 'localRelation' in ref:
        return 'local relation ' + ref['localRelation']
    raise AssertionError(ref)


def state_category_label(subject):
    ledger = read(BASE / 'children/context-and-bindings.json')
    for account in read(BASE / 'children/first-result.json')['result']['accounts']:
        for item in account['content']:
            if item['form'] == 'entity-description/0' and ledger['firstAcceptance']['entityIds'][item['subject']['introducedEntity']] == subject:
                return item['name']
    raise AssertionError('No supplied state-category label: ' + subject)


def evidence(ids):
    return ', '.join(ids) or 'See investigram support'


def table(headers, rows):
    return ['| ' + ' | '.join(headers) + ' |', '| ' + ' | '.join('---' for _ in headers) + ' |'] + [
        '| ' + ' | '.join(cell(c) for c in row) + ' |' for row in rows] + ['']


def scope(a, item, ledger, source):
    lines = ['<a id="scope"></a>', '## Q — Scope and qualifications', '',
             'These limits apply to the overview and every legend entry. This page accompanies the image; the image alone is an overview, not the complete qualified account.', '']
    lines += ['- ' + q for q in a['qualifications']]
    lines += ['', 'Basis: `' + ledger['basis']['revision'] + '`. ' + ledger['basis']['method'], '']
    for field in ['semantics', 'roleScope', 'outcomeQualification']:
        if field in item:
            lines += [item[field], '']
    if 'applicability' in item:
        lines += [item['applicability']['scope'], '']
    if 'coverage' in item:
        lines += [item['coverage']['note'], '', 'Initial state: ' + item['coverage']['initialState'] + '. No initial marker is inferred.', '']
    if item.get('conditions'):
        lines += ['Scenario conditions:', ''] + ['- ' + x for x in item['conditions']] + ['']
    omissions = item.get('notShown', item.get('coverage', {}).get('omitted', []))
    if omissions:
        lines += ['Not covered / not shown:', ''] + ['- ' + x for x in omissions] + ['']
    lines += ['## Evidence and exact content', '',
              f'Investigram content: [{source}]({source}). Reference keys below are display-local aliases; the traceability file maps them to exact content locations. They are not entity identities or correction units.', '']
    used = set(a['evidence']) | set(item['evidence'])
    rows = []
    for key in sorted(used):
        record = ledger['evidence'][key]
        target = f"[source]({record['url']}) — {record['selector']}" if 'url' in record else f"Earlier investigram {record['account']} — {record['status']}"
        rows.append([key, target])
    lines += table(['Reference', 'Support'], rows)
    lines += ['[Captured basis and delivery context](context-and-bindings.json) · [Exact diagram/legend mapping](diagram-traceability.json)', '']
    return lines


def page_start(item, stem, directory):
    image_stem = ('../' if directory == BASE / 'children' else '') + stem
    return ['# ' + short(item), '', '**Overview:** ' + item['overviewScope'] + '. [Q — scope and conditions](#scope).', '',
            f'![{short(item)}]({image_stem}.svg)', '',
            'The short labels locate fuller meanings in the legend. Guarded transitions and scenario conditions remain part of the account; omission from a box is not removal of a condition.', '']


def trace_entry(stem, key, pointers, account='TRIAL-1'):
    return {'diagram': stem + '.mmd', 'legend': stem + '.md', 'legendKey': key, 'account': account, 'pointers': pointers}


def check_pointers(document, entries):
    for entry in entries:
        for pointer in entry['pointers']:
            value = document
            for part in pointer.strip('/').split('/'):
                value = value[int(part)] if isinstance(value, list) else value[part]


def render_state(a, item, ledger, pointer, directory, write):
    stem = 'recovery-state'
    states = {s['key']: s for s in item['states']}
    aliases = {k: f's{n}' for n, k in enumerate(states)}
    lines = ['---', 'title: ' + json.dumps(short(item)), '---', 'stateDiagram-v2', '  direction LR']
    trace = []
    for n, s in enumerate(item['states']):
        lines.append(f'  state "{mm(s["label"])}" as {aliases[s["key"]]}')
        trace.append(trace_entry(stem, s['label'], [pointer + f'/states/{n}']))
    rows = []
    for n, t in enumerate(item['transitions']):
        key = f'T{n+1}'
        lines.append(f'  {aliases[t["source"]]} --> {aliases[t["target"]]}: {key} · {mm(short(t))}')
        rows.append([key, short(t), states[t['source']]['label'] + ' → ' + states[t['target']]['label'] + '. Trigger: ' + t['trigger'] + '. Guard: ' + t['guard'] + '. Effect: ' + t['effect'] + '.', evidence(t['evidence'])])
        trace.append(trace_entry(stem, key, [pointer + f'/transitions/{n}']))
    lines += [f'  note right of {aliases["half-open"]}', '    ' + mm(item['overviewScope']), '    Q: scope · T1–T3: guarded transitions', '  end note']
    page = page_start(item, stem, directory) + ['## Transition legend', '', 'Every edge is conditional; the guard column supplies its full condition.', '']
    page += table(['Key', 'Short label', 'Full guarded transition', 'Evidence'], rows)
    page += ['## State names', '', 'State bearer: ' + ref_text(item['stateBearer'], ledger) + ', the shared breaker scenario role. State names denote categories, not execution progress.', '']
    page += table(['Name', 'Category identity'], [[s['label'], ref_text(s['subject'], ledger)] for s in item['states']])
    page += scope(a, item, ledger, 'followup-result.json')
    trace.append(trace_entry(stem, 'Q', [pointer + '/displayLabel', pointer + '/overviewScope', pointer + '/coverage', pointer + '/applicability', pointer + '/outcomeQualification', pointer + '/stateBearer', pointer.split('/content/')[0] + '/qualifications', pointer.split('/content/')[0] + '/evidence']))
    if directory != BASE / 'children':
        emit(directory / (stem + '.mmd'), '\n'.join(lines) + '\n', write)
    emit(directory / (stem + '.md'), '\n'.join(page).rstrip() + '\n', write)
    return trace


def render_sequence(a, item, ledger, pointer, directory, stem, account_id, write, models=None):
    participants = {p['key']: f'p{n}' for n, p in enumerate(item['participants'])}
    span = next(iter(participants.values())) + ',' + list(participants.values())[-1]
    lines = ['sequenceDiagram', '  title ' + short(item)]
    trace, participant_rows = [], []
    for n, p in enumerate(item['participants']):
        lines.append(f'  participant {participants[p["key"]]} as {mm(short(p))}')
        participant_rows.append([short(p), p['label'], ref_text(p.get('subject', p.get('role')), ledger)])
        trace.append(trace_entry(stem, short(p), [pointer + f'/participants/{n}'], account_id))
    lines.append(f'  Note over {span}: {mm(item["overviewScope"])}<br/>Q: scope and conditions')
    all_steps = item['prefix'] + [s for b in item['alternatives'] for s in b['steps']]
    keys = {s['key']: f'I{n+1}' for n, s in enumerate(all_steps)}
    rows, branches = [], []

    def emit_step(s, path):
        key = keys[s['key']]
        text = key + ' · ' + short(s)
        if s['kind'] in ['request', 'response']:
            arrow = '->>' if s['kind'] == 'request' else '-->>'
            lines.append(f'  {participants[s["from"]]}{arrow}{participants[s["to"]]}: {mm(text)}')
        else:
            actors = participants[s['actor']] if 'actor' in s else participants[s['on']] + ',' + participants[s['participant']]
            lines.append(f'  Note over {actors}: {mm(text)}')
        pointers = [path]
        if s['kind'] == 'state-transition':
            model, model_pointer = models[s['stateContent']]
            n, t = next((n, t) for n, t in enumerate(model['transitions']) if t['key'] == s['transition'])
            states = {x['key']: x['label'] for x in model['states']}
            meaning = f"{states[t['source']]} → {states[t['target']]}. Trigger: {t['trigger']}. Guard: {t['guard']}. Effect: {t['effect']}."
            pointers.append(model_pointer + f'/transitions/{n}')
        else:
            meaning = s['text']
        if 'condition' in s:
            meaning += ' Condition: ' + s['condition']
        if 'relationship' in s:
            meaning += ' Relationship: ' + ref_text(s['relationship'], ledger) + '.'
        rows.append([key, short(s), meaning, ', '.join(keys[k] for k in s.get('causedBy', [])) or 'Not asserted', evidence(s['evidence'])])
        trace.append(trace_entry(stem, key, pointers, account_id))

    for n, s in enumerate(item['prefix']):
        emit_step(s, pointer + f'/prefix/{n}')
    for b, branch in enumerate(item['alternatives']):
        key = f'B{b+1}'
        lines.append('  ' + ('alt' if b == 0 else 'else') + ' ' + key + ' · ' + mm(short(branch)))
        branches.append([key, short(branch), branch['condition']])
        trace.append(trace_entry(stem, key, [pointer + f'/alternatives/{b}'], account_id))
        for n, s in enumerate(branch['steps']):
            emit_step(s, pointer + f'/alternatives/{b}/steps/{n}')
    if item['alternatives']:
        lines.append('  end')
    for n, snap in enumerate(item.get('situations', [])):
        key = f'S{n+1}'
        lines.append(f'  Note over {span}: {key} · {mm(short(snap))}')
        trace.append(trace_entry(stem, key, [pointer + f'/situations/{n}', pointer + '/relations'], account_id))
    page = page_start(item, stem, directory) + ['## Participants', ''] + table(['On diagram', 'Full label', 'Designation'], participant_rows)
    if branches:
        page += ['## Branches', ''] + table(['Key', 'Short label', 'Condition'], branches)
    page += ['## Interaction legend', '', 'I-keys identify steps, not time or causation. The cause column preserves explicit `causedBy` links; it does not assert that a cause is sufficient or exclusive. “Not asserted” is not a claim that no cause exists.', '']
    page += table(['Key', 'Short label', 'Full meaning / condition', 'Causal support', 'Evidence'], rows)
    for n, snap in enumerate(item.get('situations', [])):
        page += [f'## S{n+1} — {short(snap)}', '', 'Asserted after ' + keys[snap['afterStep']] + '. Partial snapshot: absent entries are unspecified, not zero or false.', '']
        for st in snap['stateAssignments']:
            page += ['- State: ' + ref_text(st['bearer'], ledger) + ' has category ' + ref_text(st['category'], ledger) + ' (' + state_category_label(st['category']['entity']) + ').']
        page += [''] + table(['Holder', 'Resource owner', 'Resource', 'Amount'], [[ref_text(x['holder'], ledger), ref_text(x['owner'], ledger), {'execution-capacity': 'Execution slot', 'queue-capacity': 'Queue place', 'recovery-trial-slot': 'Recovery trial slot'}[x['resource']], x['amount']] for x in snap['resourceOccupancy']])
        for x in snap['executionProgress']:
            page += ['- Application work: ' + ref_text(x['execution'], ledger) + ' — ' + x['applicationWork'] + '.']
        page += ['- Active relations: ' + ', '.join(ref_text(x, ledger) for x in snap['activeRelations']) + '.', '- Evidence: ' + evidence(snap['evidence']) + '.', '']
    if item.get('relations'):
        page += ['## Local relationships', '']
        for r in item['relations']:
            owner = r.get('decisionHolder', r.get('capacityOwner'))
            page += [f"- **{r['key']}** ({r['kind']}): {ref_text(r['waiter'], ledger)} → {ref_text(owner, ledger)}. Condition: {r['when']}. Evidence: {evidence(r['evidence'])}."]
        page += ['']
    if item.get('policyOrder'):
        page += ['Composite policy order: ' + ' → '.join(ref_text(x, ledger) for x in item['policyOrder']) + '. The independent bulkhead-only execution, where present, is outside that path.', '']
    page += scope(a, item, ledger, 'composition-result.json' if item.get('situations') else 'followup-result.json')
    account_pointer = pointer.split('/content/')[0]
    scope_fields = ['displayLabel', 'overviewScope', 'semantics', 'conditions', 'notShown', 'evidence']
    scope_fields += [k for k in ['roles', 'roleScope', 'policyOrder'] if k in item]
    trace.append(trace_entry(stem, 'Q', [account_pointer + '/qualifications', account_pointer + '/evidence'] + [pointer + '/' + k for k in scope_fields], account_id))
    if directory != BASE / 'children':
        emit(directory / (stem + '.mmd'), '\n'.join(lines) + '\n', write)
    emit(directory / (stem + '.md'), '\n'.join(page).rstrip() + '\n', write)
    return trace


def render_composition(document, write=False):
    directory = BASE / 'composition'
    ledger = read(directory / 'context-and-bindings.json')
    trace = []
    for index, stem in [(2, 'bulkhead-outside'), (3, 'breaker-outside')]:
        a = document['result']['accounts'][index]
        trace += render_sequence(a, a['content'][0], ledger, f'/result/accounts/{index}/content/0', directory, stem, ledger['compositionAcceptance']['accountIds'][a['key']], write)
    check_pointers(document, trace)
    emit(directory / 'diagram-traceability.json', json.dumps(trace, indent=2) + '\n', write)


def render_all(write=False):
    document = read(BASE / 'followup-result.json')
    ledger = read(BASE / 'context-and-bindings.json')
    a = document['result']['accounts'][0]
    items = {i['key']: (i, f'/result/accounts/0/content/{n}') for n, i in enumerate(a['content'])}
    state, state_pointer = items['recovery']
    interaction, interaction_pointer = items['concurrent-callers']
    trace = render_state(a, state, ledger, state_pointer, BASE, write)
    trace += render_sequence(a, interaction, ledger, interaction_pointer, BASE, 'concurrent-callers', 'TRIAL-1', write, items)
    check_pointers(document, trace)
    emit(BASE / 'diagram-traceability.json', json.dumps(trace, indent=2) + '\n', write)
    # Same behavioral payload, different exact source account in the children variant.
    child_document = read(BASE / 'children/followup-result.json')
    child_index, child = next((n, a) for n, a in enumerate(child_document['result']['accounts']) if a['key'] == 'trial')
    assert child['qualifications'] == a['qualifications']
    child_ledger = read(BASE / 'children/context-and-bindings.json')
    child_items = {i['key']: (i, f'/result/accounts/{child_index}/content/{n}') for n, i in enumerate(child['content'])}
    for key in ['recovery', 'concurrent-callers']:
        assert items[key][0] == child_items[key][0]
    child_trace = render_state(child, child_items['recovery'][0], child_ledger, child_items['recovery'][1], BASE / 'children', write)
    child_trace += render_sequence(child, child_items['concurrent-callers'][0], child_ledger, child_items['concurrent-callers'][1], BASE / 'children', 'concurrent-callers', 'TRIAL-1', write, child_items)
    for entry in child_trace:
        entry['diagram'] = '../' + entry['diagram']
    check_pointers(child_document, child_trace)
    emit(BASE / 'children/diagram-traceability.json', json.dumps(child_trace, indent=2) + '\n', write)
    render_composition(read(BASE / 'composition/composition-result.json'), write)
    print('Four compact diagram inputs, qualified legends and both partition mappings match retained content.')


if __name__ == '__main__':
    render_all('--write' in sys.argv)
