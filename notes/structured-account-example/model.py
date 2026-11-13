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
    def __init__(self, seed, basis, addition_policy="displacement-only", content_contracts=None):
        # Host-side comparison modes: "conservative" reproduces the earlier broad
        # entity policy; "inventory" is the current proposed acquisition boundary.
        assert addition_policy in {"displacement-only", "conservative", "inventory"}
        self.addition_policy = addition_policy
        self.content_contracts = content_contracts or {}
        self.entities = copy.deepcopy(seed['entities'])
        self.investigrams = {x['id']: copy.deepcopy(x) for x in seed['investigrams']}
        self.basis = copy.deepcopy(basis)
        self.queries = {}
        self.snapshots = {}
        self.acceptance_order = 0

    def declarations(self):
        return {(oid, x['key']): x for oid, a in self.investigrams.items() for x in a['associationSpecifications']}

    def items(self):
        return {(oid, x['key']): x for oid, a in self.investigrams.items() for x in a['content']}

    def qualified(self, oid, value):
        a = self.investigrams[oid]
        production = a.get('provenance')
        return {'value': copy.deepcopy(value), 'sourceInvestigram': oid,
                'queryInvocation': a['queryInvocation'],
                'basis': copy.deepcopy(production['basis'] if production else self.basis),
                **({'provenance': copy.deepcopy(production)} if production else {}),
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
                'basis': copy.deepcopy(self.queries[qid].get('provenance', {}).get('basis', self.basis))}

    def item_route(self, ref, item):
        """Only declaration paths actually leading to this excerpt, not sibling membership."""
        if item not in self.expand(ref)[1]:
            return set()
        route = {ref}
        for member in self.declarations()[ref].get('members', []):
            if 'declaration' in member:
                route |= self.item_route(address(member['declaration'], 'associationKey'), item)
        return route

    def accepted_at(self, ref):
        return self.investigrams[ref[0]].get('acceptedAt', 0)

    @staticmethod
    def projection_sources(projection):
        return {x['queryInvocation'] for field in ['items', 'declarations', 'associationUses', 'options', 'notices']
                for x in projection[field].values()}

    @staticmethod
    def projection_entities(projection):
        """Explicitly delivered association targets, not every entity mentioned in content."""
        entities = {x['value']['target']['entity']['entity'] for x in projection['associationUses'].values()}
        if any(projection[field] for field in ['items', 'declarations', 'options', 'notices']):
            entities.add(projection['entity'])
        return entities

    @staticmethod
    def delivered_declarations(projection):
        """Exact declarations supplied as uses or substantive disclosures, not nested refs."""
        return set(projection['associationUses']) | set(projection['notices'])

    @staticmethod
    def inventory_matches(projection, declaration):
        """Scope dependencies arise from a list OR content acquired by an explicit scope."""
        return declaration['operation'] != 'withdrawal' and any(
            scope and scope['entity'] == declaration['target']['entity']['entity']
            and declaration['target']['role'] in scope['roles']
            for scope in [projection.get('inventory'), projection.get('selectionScope')])

    def scoped_associations(self, entity, roles, as_of, undisplaced=False):
        allowed = {'result'} if self.entities[entity]['kind'] == 'query-result' else {'identifies', 'describes'}
        assert isinstance(roles, list) and roles and all(isinstance(r, str) for r in roles)
        assert len(set(roles)) == len(roles) and set(roles) <= allowed, 'invalid scope roles'
        declarations = {r: d for r, d in self.declarations().items() if self.accepted_at(r) <= as_of}
        displaced = {address(x, 'associationKey') for d in declarations.values() for x in d.get('displaces', [])}
        return [r for r, d in sorted(declarations.items())
                if d['operation'] != 'withdrawal' and d['target']['entity']['entity'] == entity
                and d['target']['role'] in roles and (not undisplaced or r not in displaced)]

    def project(self, selection, as_of=None):
        """Exact delivered information and organizing identities; no future content is inferred."""
        as_of = self.acceptance_order if as_of is None else as_of
        assert isinstance(as_of, int) and 0 <= as_of <= self.acceptance_order, 'invalid delivery position'
        entity = selection['entity']
        assert entity in self.entities
        ds, its, uses, opts = set(), set(), set(), {}
        association_selection = list(selection.get('associations', []))
        selection_scope = None
        if 'scopeSelection' in selection:
            scope = selection['scopeSelection']
            assert set(scope) == {'roles', 'standing'} and scope['standing'] == 'undisplaced', 'unsupported selection scope'
            assert not association_selection and not selection.get('items') and 'inventory' not in selection, 'ambiguous acquisition mode'
            selected = self.scoped_associations(entity, scope['roles'], as_of, undisplaced=True)
            association_selection = [{'investigram': r[0], 'associationKey': r[1]} for r in selected]
            selection_scope = {'entity': entity, 'roles': sorted(scope['roles']),
                               'coverage': 'all-undisplaced-in-scope', 'asOfAcceptance': as_of}
        for ref in association_selection:
            key = address(ref, 'associationKey')
            assert self.declarations()[key]['target']['entity']['entity'] == entity, 'association belongs to another entity'
            assert self.accepted_at(key) <= as_of, 'association did not exist at delivery'
            more_ds, more_items = self.expand(key)
            ds |= more_ds; its |= more_items; uses |= more_ds
        # Excerpts retain the exact association route without claiming full member delivery.
        for ref in selection.get('items', []):
            key = address(ref, 'contentKey')
            via = address(ref['viaAssociation'], 'associationKey')
            assert self.declarations()[via]['target']['entity']['entity'] == entity
            assert self.accepted_at(via) <= as_of, 'excerpt route did not exist at delivery'
            route = self.item_route(via, key)
            assert route, 'item is not part of the specified association use'
            uses |= route
            its.add(key)
        available = set()
        for ref, declaration in self.declarations().items():
            if self.accepted_at(ref) <= as_of and declaration['target']['entity']['entity'] == entity:
                available |= self.expand(ref)[1]
        for ref in selection.get('options', []):
            oid, key = address(ref, 'optionKey')
            assert any(source == oid for source, _ in available), 'option owner is not part of selected entity information'
            found = [x for x in self.investigrams[oid]['followupOptions'] if x['key'] == key]
            assert len(found) == 1
            opts[label((oid, key))] = self.qualified(oid, found[0])
        notices = {}
        for ref, declaration in self.declarations().items():
            if self.accepted_at(ref) <= as_of and uses.intersection(address(x, 'associationKey') for x in declaration.get('displaces', [])):
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
        projection = {'entity': entity, 'asOfAcceptance': as_of,
                'associationUses': use_records,
                'queryMeanings': {eid: self.query_meaning(eid) for eid in sorted(result_entities)},
                'declarations': {label(x): self.qualified(x[0], self.declarations()[x]) for x in sorted(ds)},
                'items': {label(x): self.qualified(x[0], self.items()[x]) for x in sorted(its)},
                'options': opts, 'notices': notices,
                'noticeLimits': 'Includes direct displacement and inherited concerns known at this delivery position. Notices preserve standing and qualified reasons, not replacement-member delivery, adequate understanding, clearance, or automatic redesignation.'}
        if selection_scope is not None:
            # The scope guarantee accompanies the selected content; no unseen list is invented.
            projection['selectionScope'] = selection_scope
        if 'inventory' in selection:
            scope = selection['inventory']
            assert set(scope) == {'roles'}, 'inventory requires explicit supported scope'
            refs = self.scoped_associations(entity, scope['roles'], as_of)
            projection['inventory'] = {
                'entity': entity, 'roles': sorted(scope['roles']), 'coverage': 'all-retained-in-scope',
                'asOfAcceptance': as_of,
                'entries': [{'association': {'investigram': r[0], 'associationKey': r[1]},
                             'role': self.declarations()[r]['target']['role']} for r in refs]}
        if self.addition_policy == 'conservative':
            projection['noticeLimits'] += ' Conservative mode also discloses unsupplied additions in the explicit entity scope, without claiming semantic novelty or displacement.'
            about = self.projection_entities(projection)
            for ref, declaration in self.declarations().items():
                if (declaration['operation'] == 'addition' and self.accepted_at(ref) <= as_of
                        and declaration['target']['entity']['entity'] in about and ref not in uses):
                    notices[label(ref)] = self.qualified(ref[0], declaration)
        # Disclose already-known indirect concerns too, including provenance of notice text.
        status = self.reconsideration(as_of)
        by_label = {label(r): r for r in self.declarations()}
        while True:
            # A substantive notice supplies its own declaration. Fresh access must
            # disclose later displacement of that declaration too, not just its producer.
            delivered = self.delivered_declarations(projection)
            known = {label(r) for r, d in self.declarations().items()
                     if self.accepted_at(r) <= as_of and
                     any(label(address(x, 'associationKey')) in delivered for x in d.get('displaces', []))}
            for ref in uses:
                known.update(status['designations'].get(label(ref), {}).get('needsReconsideration', []))
            for source in self.projection_sources(projection):
                known.update(status['evaluations'].get(source, []))
            missing = known - set(notices)
            if not missing:
                break
            for cid in sorted(missing):
                ref = by_label[cid]
                notices[cid] = self.qualified(ref[0], self.declarations()[ref])
        return projection

    def accept(self, document, bindings, request, delivered=None):
        """Stage everything on a copy; bad declarations never partially change retained state."""
        staged = copy.deepcopy(self)
        projections = [self.project(x) for x in request['deliveries']] if delivered is None else copy.deepcopy(delivered)
        assert len(projections) == len(request['deliveries'])
        for projection, selection in zip(projections, request['deliveries']):
            expected = self.project(selection, projection['asOfAcceptance'])
            assert projection['associationUses'] == expected['associationUses'], 'missing or altered association-use provenance'
            assert projection['notices'] == expected['notices'], 'missing or altered known-cause disclosure at delivery'
            assert projection.get('inventory') == expected.get('inventory'), 'missing or altered inventory delivery'
            assert projection.get('selectionScope') == expected.get('selectionScope'), 'missing or altered selection-scope delivery'
            assert projection.get('queryMeanings') == expected.get('queryMeanings'), 'missing or altered delivered query meaning'
            # Validate what the selected delivery actually contained, independently of
            # whether it was sufficient for the investigator's later displacement.
            assert projection['declarations'] == expected['declarations'] and projection['items'] == expected['items'], 'missing or altered selected content'
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
            assert 'provenance' not in a, 'production provenance is host-attributed'
            oid = bindings['investigramIds'][a.pop('key')]
            a.update(id=oid, queryInvocation=qid, acceptedAt=self.acceptance_order + 1)
            # Host-attributed production context, not investigator-claimed authority.
            if 'provenance' in bindings:
                production = bindings['provenance']
                assert production['producer']['kind'] in {'mechanical', 'agentic'}
                assert production['producer']['method'] and production['basis']
                a['provenance'] = copy.deepcopy(production)
            assert a['qualifications'] and a['evidence'], 'missing own qualification/support'
            assert len({x['key'] for x in a['content']}) == len(a['content'])
            assert len({x['key'] for x in a['associationSpecifications']}) == len(a['associationSpecifications'])
            for x in a['content']:
                if x.get('introducesEntity'):
                    if x['contentType'] == 'entity-description/0':
                        assert x['name'] and x['description']
                    else:
                        assert self.content_contracts.get(x['contentType'], {}).get('identifying'), 'unsupported identifying content'
                    introductions.append(x['subject']['entity'])
            staged.investigrams[oid] = a
            new_owners.add(oid)
        assert len(introductions) == len(set(introductions))
        assert set(introductions) | {rid} == set(bindings['entityIds'].values()), 'entity allocation lacks introduction'
        staged.validate_content(new_owners, set(request['suppliedEvidence']))
        decls = staged.declarations()
        new_decls = {k: v for k, v in decls.items() if k[0] in new_owners}
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
                    # Acquiring the target's complete qualified support is an investigator
                    # instruction, not an acceptance gate in the first capability.
            # Expansion validates reference resolution, types and acyclic membership.
            # Prior acquisition/understanding is investigator policy, not data validity.
            _, its = staged.expand(ref)
            covered |= its
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
        sources = sorted({src for p in projections for src in self.projection_sources(p)})
        staged.acceptance_order = self.acceptance_order + 1
        staged.queries[qid] = {'acceptedAt': staged.acceptance_order, 'request':copy.deepcopy(request), 'resultEntity':rid,'initialDesignation':own_results[0], 'deliveries':projections,'exposureIndex':exposure,'sourceQueries':sources,'declarations':list(new_decls)}
        if 'provenance' in bindings:
            staged.queries[qid]['provenance'] = copy.deepcopy(bindings['provenance'])
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
                assert item['contentType'] in {'prose/0','entity-description/0','admission-cases/0','architectural-relations/0','state-behavior/0','interaction/0'} | self.content_contracts.keys(), 'unsupported content type'
                if item['contentType'] in self.content_contracts:
                    self.content_contracts[item['contentType']]['validate'](item)
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

    def reconsideration(self, as_of=None):
        """Later changes only, relative to each delivery and designation's acceptance."""
        as_of = self.acceptance_order if as_of is None else as_of
        decls = {r: d for r, d in self.declarations().items() if self.accepted_at(r) <= as_of}
        queries = {qid: q for qid, q in self.queries.items() if q['acceptedAt'] <= as_of}
        designations = {r: d for r, d in decls.items()
                        if d['target']['role'] == 'result' and d['operation'] != 'withdrawal'}
        membership = {r: self.expand(r)[0] - {r} for r in designations}
        member_causes = {r: set() for r in designations}
        eval_causes = {qid: set() for qid in queries}
        for cause, declaration in decls.items():
            addition = declaration['operation'] == 'addition'
            if addition and self.addition_policy == 'displacement-only':
                continue
            cid = label(cause)
            cause_at = self.accepted_at(cause)
            producer = self.investigrams[cause[0]]['queryInvocation']
            displaced = {address(x, 'associationKey') for x in declaration.get('displaces', [])}
            target_entity = declaration['target']['entity']['entity']
            # Old deliveries remain exposures even if the same query acquires fresh context later.
            prior = {qid: [p for p in q['deliveries'] if p['asOfAcceptance'] < cause_at]
                     for qid, q in queries.items()}
            for qid in queries:
                if self.addition_policy == 'inventory':
                    direct = any(self.inventory_matches(p, declaration) or
                                 bool(self.delivered_declarations(p) & {label(r) for r in displaced})
                                 for p in prior[qid])
                else:
                    direct = any(target_entity in self.projection_entities(p) if addition else
                                 bool(self.delivered_declarations(p) & {label(r) for r in displaced})
                                 for p in prior[qid])
                if qid != producer and direct:
                    eval_causes[qid].add(cid)
            for ref in designations:
                represented = {decls[r]['target']['entity']['entity'] for r in membership[ref] | {ref}}
                relevant = ((self.addition_policy == 'conservative' and target_entity in represented)
                            if addition else bool(membership[ref] & displaced))
                if self.accepted_at(ref) < cause_at and relevant:
                    member_causes[ref].add(cid)
            changed = True
            while changed:
                before = copy.deepcopy(eval_causes)
                for qid in queries:
                    if qid == producer:
                        continue
                    for projection in prior[qid]:
                        received_affected_designation = any(
                            label(ref) in projection['associationUses'] and
                            (cid in member_causes[ref] or
                             cid in eval_causes.get(self.investigrams[ref[0]]['queryInvocation'], set()))
                            for ref in designations)
                        received_affected_producer = any(cid in eval_causes.get(src, set())
                                                         for src in self.projection_sources(projection))
                        if received_affected_designation or received_affected_producer:
                            eval_causes[qid].add(cid)
                changed = before != eval_causes
        statuses = {}
        for ref, declaration in sorted(designations.items()):
            qid = self.investigrams[ref[0]]['queryInvocation']
            generated = eval_causes.get(qid, set())
            statuses[label(ref)] = {
                'resultEntity': declaration['target']['entity']['entity'],
                'displacedBy': sorted(label(r) for r, d in decls.items()
                                      if any(address(x, 'associationKey') == ref for x in d.get('displaces', []))),
                'competingDeclarations': sum(any(address(x, 'associationKey') == ref for x in d.get('displaces', []))
                                            for d in decls.values()) > 1,
                'membershipCauses': sorted(member_causes[ref]),
                'generatingEvaluationCauses': sorted(generated),
                'needsReconsideration': sorted(member_causes[ref] | generated)}
        result = {'designations': statuses, 'evaluations': {k: sorted(v) for k, v in eval_causes.items()}}
        if self.addition_policy != 'displacement-only':
            result['causeKinds'] = {label(r): ('new-information' if d['operation'] == 'addition' else 'displacement')
                                    for r, d in decls.items()}
        return result

def initial_model(directory, addition_policy='displacement-only'):
    ledger=read(directory/'context-and-bindings.json')
    return Model(read(directory/'seed-context.json'),ledger['basis'],addition_policy)

def run_variant(directory):
    ledger=read(directory/'context-and-bindings.json'); model=initial_model(directory)
    for file,stage,request in [('first-result.json','firstAcceptance','firstRequest'),('followup-result.json','followupAcceptance','followupRequest')]:
        model.accept(read(directory/file),ledger[stage],ledger[request])
    return model
