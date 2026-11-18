/** Assessment-only common contributions. Recipes never call a provider. */
export function injectedSetup(recipe, capture) {
  if (typeof recipe?.prose !== 'string' || !Array.isArray(recipe?.qualifications)
      || (recipe.childProse !== undefined && typeof recipe.childProse !== 'string')) throw new Error('Invalid assessment injection recipe');
  return {
    identity: { provider: 'postcode-assessment', model: 'injected-earlier-interpretation', origin: 'scripted',
      configuration: { setup: recipe.id, providerRequests: false, protocol: 'common-contributions' } },
    open() {
      let closed = false, acquired = false;
      return {
        async exchange(input, _signal, report) {
          if (closed) throw new Error('Closed injected setup');
          const selected = input.request.subjects[0], subject = selected.subject;
          let reply;
          if (recipe.acquireSource && !acquired) {
            if (!selected.moduleRecord) throw new Error('Source setup requires an exact module subject');
            acquired = true;
            reply = { kind: 'tools', requests: [{ kind: 'source', subject: selected.moduleRecord }] };
          } else {
            const evidence = [...new Set(input.responses.flatMap(response => response.tool === 'evidence' ? response.response.selected : []))];
            const qualification = { limitations: recipe.qualifications };
            const owner = (key, text) => ({ key, qualification, items: [{ key: 'prose', type: 'prose', body: { text }, evidence,
              support: recipe.citeSubject && subject.kind === 'content' ? [subject.item] : [] }] });
            const owners = [owner('injected-root', recipe.prose), ...(recipe.childProse ? [owner('injected-part', recipe.childProse)] : [])];
            const members = owners.map(value => ({ kind: 'item', item: { investigram: { local: value.key }, item: 'prose' } }));
            owners[0].declarations = [{ key: 'answer', operation: 'add', target: { kind: 'result', result: input.request.result }, members }];
            if (recipe.correction) {
              // A whole contribution is not a correction target. The frozen assessment must
              // explicitly select the organizing use whose membership it intends to replace.
              if (subject.kind !== 'designation') throw new Error('Correction setup requires an exact designation subject');
              const target = input.responses.flatMap(response => response.tool === 'contribution' && response.kind === 'association' ? [response.value] : [])
                .find(value => value.address.investigram === subject.association.investigram && value.address.declaration === subject.association.declaration)?.declaration.target;
              if (!target) throw new Error('Correction setup requires the delivered target declaration');
              const replacement = owner('injected-replacement', recipe.correction.prose);
              replacement.declarations = [{ key: 'replacement', operation: 'supersede', target, displaces: [subject.association],
                members: [{ kind: 'item', item: { investigram: { local: replacement.key }, item: 'prose' } }], grounds: { text: recipe.correction.reason } }];
              owners.push(replacement);
            }
            reply = { kind: 'submit', contribution: { investigrams: owners } };
          }
          report({ source: 'synthetic', categories: [] });
          capture({ input, reply, origin: 'injected-assessment-setup', providerRequests: 0 });
          return reply;
        },
        close() { closed = true; },
      };
    },
  };
}
