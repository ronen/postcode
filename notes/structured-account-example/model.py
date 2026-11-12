"""Bounded authored declaration/context model. No PostCode API or semantic certification."""
import copy
import json
import runpy
from pathlib import Path

BASE = Path(__file__).resolve().parent
GUIDANCE = runpy.run_path(str(BASE / 'guidance.py'))

def read(path):
    return json.loads(Path(path).read_text())

def owner(ref):
    return ref['investigram'] if isinstance(ref, dict) else ref

def address(ref, field):
    return (owner(ref['investigram']), ref[field])

def label(ref):
    return '::'.join(ref)

def resolve(value, bindings):
    if isinstance(value, list):
        return [resolve(x, bindings) for x in value]
    if isinstance(value, dict):
        if set(value) == {'introducedEntity'}:
            return {'entity': bindings['entityIds'][value['introducedEntity']]}
        if set(value) == {'submittedInvestigram'}:
            return {'investigram': bindings['investigramIds'][value['submittedInvestigram']]}
        return {k: resolve(v, bindings) for k, v in value.items()}
    return value

class Model:
    def __init__(self, seed, basis):
        self.entities = copy.deepcopy(seed['entities'])
        self.investigrams = {x['id']: copy.deepcopy(x) for x in seed['investigrams']}
        self.basis = copy.deepcopy(basis)
        self.queries = {}
        self.snapshots = {}

    def declarations(self):
        return {(oid, x['key']): x for oid, a in self.investigrams.items() for x in a['associationSpecifications']}

    def items(self):
        return {(oid, x['key']): x for oid, a in self.investigrams.items() for x in a['content']}

    def qualified(self, oid, value):
        a = self.investigrams[oid]
        return {'value': copy.deepcopy(value), 'sourceInvestigram': oid,
                'queryInvocation': a['queryInvocation'], 'basis': copy.deepcopy(self.basis),
                'sourceQualifications': copy.deepcopy(a['qualifications']),
                'sourceEvidence': copy.deepcopy(a['evidence'])}

    def expand(self, ref, visiting=None):
        """Exact result membership, never current-association substitution or whole bundle delivery."""
        visiting = set() if visiting is None else visiting
        assert ref not in visiting, 'cyclic association membership'
        spec = self.declarations()[ref]
        declarations = {ref}
        items = set()
        for member in spec.get('members', []):
            assert len(member) == 1
            if 'item' in member:
                item_ref = address(member['item'], 'contentKey')
                self.items()[item_ref]
                items.add(item_ref)
            else:
                assert 'declaration' in member and spec['target']['role'] == 'result', 'nested membership only for query results'
                ds, its = self.expand(address(member['declaration'], 'associationKey'), visiting | {ref})
                declarations |= ds
                items |= its
        # Required semantic dependencies, not all informative links or all referent definitions.
        for oid, key in list(items):
            item = self.items()[(oid, key)]
            if item['contentType'] == 'interaction/0':
                steps = item['prefix'] + [s for b in item['alternatives'] for s in b['steps']]
                for step in steps:
                    if step['kind'] == 'state-transition':
                        dep = (oid, step['stateContent'])
                        model = self.items()[dep]
                        assert model['contentType'] == 'state-behavior/0'
                        assert step['transition'] in {t['key'] for t in model['transitions']}
                        items.add(dep)
        return declarations, items

    def query_meaning(self, entity):
        qid = self.entities[entity]['queryInvocation']
        request = self.queries[qid]['request']
        return {'queryInvocation': qid, 'resultEntity': entity,
                'operation': request['operation'], 'subject': copy.deepcopy(request['subject']),
                'parameterValues': copy.deepcopy(request.get('parameterValues', {})),
                'option': copy.deepcopy(request.get('option')),
                'declaredMeaning': copy.deepcopy(request['declaredMeaning']),
                'basis': copy.deepcopy(self.basis)}

    def item_route(self, ref, item):
        """Only declaration paths actually leading to this excerpt, not sibling membership."""
        if item not in self.expand(ref)[1]:
            return set()
        route = {ref}
        for member in self.declarations()[ref].get('members', []):
            if 'declaration' in member:
                route |= self.item_route(address(member['declaration'], 'associationKey'), item)
        return route

    def project(self, selection):
        """Exact association uses, qualified content and question; never entity-wide exposure."""
        entity = selection['entity']
        assert entity in self.entities
        ds, its, uses, opts = set(), set(), set(), {}
        for ref in selection.get('associations', []):
            key = address(ref, 'associationKey')
            assert self.declarations()[key]['target']['entity']['entity'] == entity, 'association belongs to another entity'
            more_ds, more_items = self.expand(key)
            ds |= more_ds; its |= more_items; uses |= more_ds
        # Excerpts retain the exact association route without claiming full member delivery.
        for ref in selection.get('items', []):
            key = address(ref, 'contentKey')
            via = address(ref['viaAssociation'], 'associationKey')
            assert self.declarations()[via]['target']['entity']['entity'] == entity
            route = self.item_route(via, key)
            assert route, 'item is not part of the specified association use'
            uses |= route
            its.add(key)
        available = set()
        for ref, declaration in self.declarations().items():
            if declaration['target']['entity']['entity'] == entity:
                available |= self.expand(ref)[1]
        for ref in selection.get('options', []):
            oid, key = address(ref, 'optionKey')
            assert any(source == oid for source, _ in available), 'option owner is not part of selected entity information'
            found = [x for x in self.investigrams[oid]['followupOptions'] if x['key'] == key]
            assert len(found) == 1
            opts[label((oid, key))] = self.qualified(oid, found[0])
        notices = {}
        for ref, declaration in self.declarations().items():
            if uses.intersection(address(x, 'associationKey') for x in declaration.get('displaces', [])):
                notices[label(ref)] = self.qualified(ref[0], declaration)
        use_records = {}
        for ref in sorted(uses):
            declaration = self.declarations()[ref]
            value = {'association': {'investigram': ref[0], 'associationKey': ref[1]},
                     'target': declaration['target']}
            for field in ['reason', 'qualifications', 'evidence']:
                if field in declaration: value[field] = declaration[field]
            use_records[label(ref)] = self.qualified(ref[0], value)
        result_entities = {self.declarations()[r]['target']['entity']['entity'] for r in uses
                           if self.declarations()[r]['target']['role'] == 'result'}
        if self.entities[entity]['kind'] == 'query-result' and (uses or opts):
            result_entities.add(entity)
        return {'entity': entity,
                'associationUses': use_records,
                'queryMeanings': {eid: self.query_meaning(eid) for eid in sorted(result_entities)},
                'declarations': {label(x): self.qualified(x[0], self.declarations()[x]) for x in sorted(ds)},
                'items': {label(x): self.qualified(x[0], self.items()[x]) for x in sorted(its)},
                'options': opts, 'notices': notices,
                'noticeLimits': 'Notices concern exact supplied association uses; their references do not deliver members. No shared-item or entity-wide displacement inference, received-cause exemption, or automatic redesignation.'}

    def accept(self, document, bindings, request, delivered=None):
        """Stage everything on a copy; bad declarations never partially change retained state."""
        staged = copy.deepcopy(self)
        projections = [self.project(x) for x in request['deliveries']] if delivered is None else copy.deepcopy(delivered)
        assert len(projections) == len(request['deliveries'])
        for projection, selection in zip(projections, request['deliveries']):
            assert projection['associationUses'] == self.project(selection)['associationUses'], 'missing or altered association-use provenance'
        assert request['declaredMeaning']['question'] and request['declaredMeaning']['scope'], 'missing declared question/scope'
        qid = request['id']
        subject = request['subject']
        assert set(subject) in [{'entity'}, {'entities'}]
        assert set(subject.get('entities', [subject.get('entity')])) <= set(self.entities), 'unknown query subject'
        assert qid not in self.queries
        result = resolve(document['result'], bindings)
        assert result['queryInvocation'] == qid
        rid = result['queryResult']['entity']
        assert rid == request['resultEntity'] and rid not in self.entities
        assert len(set(bindings['entityIds'].values())) == len(bindings['entityIds'])
        assert not set(bindings['entityIds'].values()) & set(self.entities), 'new entity collision'
        assert set(bindings['investigramIds']) == {a['key'] for a in result['investigrams']}
        assert len(set(bindings['investigramIds'].values())) == len(result['investigrams'])
        assert not set(bindings['investigramIds'].values()) & set(self.investigrams), 'bundle identity collision'
        staged.entities.update({eid: {'kind': 'architectural'} for eid in bindings['entityIds'].values()})
        staged.entities[rid] = {'kind': 'query-result', 'queryInvocation': qid}
        new_owners = set()
        introductions = []
        for raw in result['investigrams']:
            a = copy.deepcopy(raw)
            oid = bindings['investigramIds'][a.pop('key')]
            a.update(id=oid, queryInvocation=qid)
            assert a['qualifications'] and a['evidence'], 'missing own qualification/support'
            assert len({x['key'] for x in a['content']}) == len(a['content'])
            assert len({x['key'] for x in a['associationSpecifications']}) == len(a['associationSpecifications'])
            for x in a['content']:
                if x.get('introducesEntity'):
                    assert x['name'] and x['description']
                    introductions.append(x['subject']['entity'])
            staged.investigrams[oid] = a
            new_owners.add(oid)
        assert len(introductions) == len(set(introductions))
        assert set(introductions) | {rid} == set(bindings['entityIds'].values()), 'entity allocation lacks introduction'
        staged.validate_content(new_owners, set(request['suppliedEvidence']))
        decls = staged.declarations()
        new_decls = {k: v for k, v in decls.items() if k[0] in new_owners}
        supplied_ds = {k: v for p in projections for k, v in p['declarations'].items()}
        supplied_items = {k: v for p in projections for k, v in p['items'].items()}
        supplied_meanings = {k: v for p in projections for k, v in p.get('queryMeanings', {}).items()}
        covered = set()
        for ref, sp in new_decls.items():
            assert sp['operation'] in ['addition', 'supersession', 'withdrawal']
            target = sp['target']
            assert set(target) == {'entity', 'role'} and set(target['entity']) == {'entity'}
            eid = target['entity']['entity']
            assert eid in staged.entities
            is_result = staged.entities[eid]['kind'] == 'query-result'
            assert (target['role'] == 'result') == is_result, 'result role/target mismatch'
            assert target['role'] in ['result', 'identifies', 'describes'], 'unsupported bounded role'
            if is_result and eid != rid:
                assert supplied_meanings.get(eid) == self.query_meaning(eid), 'earlier result requires its exact declared question and scope'
            if sp['operation'] == 'withdrawal':
                assert not sp.get('members'), 'withdrawal has replacement members'
            else:
                assert sp['members'], 'empty association contribution'
            if sp['operation'] == 'addition':
                assert not sp.get('displaces'), 'addition displaces earlier information'
            else:
                assert sp['reason'] and sp['displaces'], 'displacement needs reason and exact targets'
                old_refs = [address(x, 'associationKey') for x in sp['displaces']]
                assert len(old_refs) == len(set(old_refs))
                for old_ref in old_refs:
                    assert old_ref in self.declarations(), 'displacement target must predate this acceptance'
                    assert self.declarations()[old_ref]['operation'] != 'withdrawal', 'withdrawal is not an association to supersede'
                    assert self.declarations()[old_ref]['target'] == target, 'use withdrawal and addition to change target'
                    old_ds, old_items = self.expand(old_ref)
                    for r in old_ds:
                        assert supplied_ds.get(label(r)) == self.qualified(r[0], self.declarations()[r]), 'incomplete declaration delivery'
                    for r in old_items:
                        assert supplied_items.get(label(r)) == self.qualified(r[0], self.items()[r]), 'incomplete member/qualification delivery'
            ds, its = staged.expand(ref)
            covered |= its
            for r in its:
                if r[0] not in new_owners:
                    assert supplied_items.get(label(r)) == self.qualified(r[0], self.items()[r]), 'new association based on undelivered content'
            for r in ds:
                if r[0] not in new_owners:
                    assert supplied_ds.get(label(r)) == self.qualified(r[0], self.declarations()[r]), 'result includes undelivered association'
        assert {(oid, x['key']) for oid in new_owners for x in staged.investigrams[oid]['content']} <= covered, 'unassociated own content'
        for oid in new_owners:
            for x in staged.investigrams[oid]['content']:
                if x.get('introducesEntity'):
                    assert any(s['target'] == {'entity': x['subject'], 'role': 'identifies'} and (oid, x['key']) in staged.expand(r)[1] for r, s in new_decls.items()), 'introduction lacks identifying association'
        own_results = [r for r, s in new_decls.items() if s['target'] == {'entity': {'entity': rid}, 'role': 'result'} and s['operation'] == 'addition']
        assert len(own_results) == 1, 'one initial designation per query result'
        parents = {oid: 0 for oid in new_owners}
        for r in result['compositionRoots']:
            assert owner(r) in new_owners
            parents[owner(r)] += 1
        for oid in new_owners:
            for r in staged.investigrams[oid]['children']:
                assert owner(r) in new_owners, 'old bundle cannot be adopted as child'
                parents[owner(r)] += 1
        assert all(v == 1 for v in parents.values()), 'composition forest ownership'
        visited = set()
        def visit(oid):
            assert oid not in visited, 'composition cycle'
            visited.add(oid)
            for child in staged.investigrams[oid]['children']: visit(owner(child))
        for root in result['compositionRoots']: visit(owner(root))
        assert visited == new_owners
        exposure = sorted({p['entity'] for p in projections if p['items'] or p['declarations'] or p['options'] or p['notices']})
        sources = sorted({x['queryInvocation'] for p in projections for field in ['items','declarations','associationUses','options','notices'] for x in p[field].values()})
        staged.queries[qid] = {'request':copy.deepcopy(request), 'resultEntity':rid,'initialDesignation':own_results[0], 'deliveries':projections,'exposureIndex':exposure,'sourceQueries':sources,'declarations':list(new_decls)}
        # Exact returned answer is fixed, separate from later declarations targeting the same result entity.
        initial = staged.project({'entity':rid,'associations':[{'investigram':own_results[0][0],'associationKey':own_results[0][1]}]})
        staged.snapshots[qid] = initial
        self.__dict__ = staged.__dict__
        return self

    def validate_content(self, owners, evidence):
        """Representation checks; never certify Cockatiel semantics or identity judgments."""
        all_items = self.items()
        def refs(v):
            if isinstance(v,list):
                for x in v: refs(x)
            elif isinstance(v,dict):
                if set(v)=={'entity'}: assert v['entity'] in self.entities, 'unknown entity reference'
                if set(v)=={'investigram'} and isinstance(v['investigram'],str): assert v['investigram'] in self.investigrams
                for e in v.get('evidence',[]):
                    if isinstance(e,str): assert e in evidence, 'unavailable evidence'
                for x in v.values(): refs(x)
        for oid in owners:
            a=self.investigrams[oid]; refs(a)
            GUIDANCE['presentation_plans'](a, oid)
            for item in a['content']:
                assert item['contentType'] in {'prose/0','entity-description/0','admission-cases/0','architectural-relations/0','state-behavior/0','interaction/0'}, 'unsupported content type'
                roles={x['key'] for x in item.get('roles',[])}
                assert len(roles)==len(item.get('roles',[]))
                if roles: assert item['roleScope']
                def local(v):
                    if isinstance(v,list):
                        for x in v: local(x)
                    elif isinstance(v,dict):
                        if set(v)=={'localRole'}: assert v['localRole'] in roles
                        for x in v.values(): local(x)
                local(item)
                for link in item.get('relatedContent',[])+item.get('illustrations',[]):
                    assert address(link,'contentKey') in all_items
                    if 'roleBindings' in link:
                        assert link['qualification'] and link['evidence']
                        assert {x['role'] for x in link['roleBindings']}==roles
                if item['contentType']=='state-behavior/0':
                    states={x['key'] for x in item['states']}
                    assert len(states)==len(item['states'])
                    assert len({x['key'] for x in item['transitions']})==len(item['transitions'])
                    assert all(x['source'] in states and x['target'] in states for x in item['transitions'])
                if item['contentType']=='interaction/0':
                    participants={x['key'] for x in item['participants']}
                    assert len(participants)==len(item['participants'])
                    def path(steps,seen):
                        seen=set(seen)
                        for step in steps:
                            assert step['key'] not in seen
                            assert set(step.get('causedBy',[]))<=seen
                            for field in ['from','to','actor','participant','on']:
                                if field in step: assert step[field] in participants
                            if step['kind']=='state-transition':
                                model=all_items[(oid,step['stateContent'])]
                                assert model['contentType']=='state-behavior/0'
                                assert step['transition'] in {x['key'] for x in model['transitions']}
                            seen.add(step['key'])
                        return seen
                    steps=item['prefix']+[x for branch in item['alternatives'] for x in branch['steps']]
                    assert len({x['key'] for x in steps})==len(steps)
                    prefix=path(item['prefix'],set())
                    for branch in item['alternatives']: path(branch['steps'],prefix)

    def standing(self, ref):
        by=[label(r) for r,s in self.declarations().items() if any(address(x,'associationKey')==ref for x in s.get('displaces',[]))]
        return {'displacedBy':sorted(by),'competingDeclarations':len(by)>1}

    def reconsideration(self):
        """Warnings on exact designations; displaced standing is a separate historical fact."""
        decls = self.declarations()
        designations = {r: d for r, d in decls.items()
                        if d['target']['role'] == 'result' and d['operation'] != 'withdrawal'}
        membership = {r: self.expand(r)[0] - {r} for r in designations}
        uses = {qid: {key for p in q['deliveries'] for key in p['associationUses']}
                for qid, q in self.queries.items()}
        member_causes = {r: set() for r in designations}
        eval_causes = {qid: set() for qid in self.queries}
        for cause, declaration in decls.items():
            if declaration['operation'] == 'addition':
                continue
            cid = label(cause)
            producer = self.investigrams[cause[0]]['queryInvocation']
            displaced = {address(x, 'associationKey') for x in declaration['displaces']}
            for qid in self.queries:
                if qid != producer and uses[qid] & {label(r) for r in displaced}:
                    eval_causes[qid].add(cid)
            for ref in designations:
                if self.investigrams[ref[0]]['queryInvocation'] != producer and membership[ref] & displaced:
                    member_causes[ref].add(cid)
            changed = True
            while changed:
                before = copy.deepcopy(eval_causes)
                for qid, query in self.queries.items():
                    if qid == producer:
                        continue
                    received_affected_designation = any(
                        label(ref) in uses[qid] and
                        (cid in member_causes[ref] or
                         cid in eval_causes.get(self.investigrams[ref[0]]['queryInvocation'], set()))
                        for ref in designations)
                    received_affected_producer = any(cid in eval_causes.get(src, set())
                                                     for src in query['sourceQueries'])
                    if received_affected_designation or received_affected_producer:
                        eval_causes[qid].add(cid)
                changed = before != eval_causes
        statuses = {}
        for ref, declaration in sorted(designations.items()):
            qid = self.investigrams[ref[0]]['queryInvocation']
            generated = eval_causes.get(qid, set())
            statuses[label(ref)] = {
                'resultEntity': declaration['target']['entity']['entity'],
                **self.standing(ref),
                'membershipCauses': sorted(member_causes[ref]),
                'generatingEvaluationCauses': sorted(generated),
                'needsReconsideration': sorted(member_causes[ref] | generated)}
        return {'designations': statuses, 'evaluations': {k: sorted(v) for k, v in eval_causes.items()}}

def initial_model(directory):
    ledger=read(directory/'context-and-bindings.json')
    return Model(read(directory/'seed-context.json'),ledger['basis'])

def run_variant(directory):
    ledger=read(directory/'context-and-bindings.json'); model=initial_model(directory)
    for file,stage,request in [('first-result.json','firstAcceptance','firstRequest'),('followup-result.json','followupAcceptance','followupRequest')]:
        model.accept(read(directory/file),ledger[stage],ledger[request])
    return model
