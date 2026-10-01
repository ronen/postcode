/** Assessment-only interpretations. Production acceptance owns identities,
 * citations and retention; each frozen recipe records its truthful test origin. */
export function injectedSetup(recipe, capture) {
  if (typeof recipe?.prose !== 'string' || !Array.isArray(recipe?.qualifications)
      || (recipe.childProse !== undefined && typeof recipe.childProse !== 'string')) throw new Error('Invalid assessment injection recipe');
  return {
    identity: { provider: 'postcode-assessment', model: 'injected-earlier-interpretation', origin: 'scripted',
      configuration: { setup: recipe.id, providerRequests: false } },
    open() {
      let closed = false, acquired = false, module;
      return {
        async exchange(input, _signal, report) {
          if (closed) throw new Error('Closed injected setup');
          module ??= input.responses?.flatMap(response => response.accounts ?? []).find(account => account.id === input.request.subject)?.originatingModule ?? input.request.subject;
          let reply;
          if (recipe.acquireSource && !acquired) {
            acquired = true;
            reply = { kind: 'tools', requests: [{ kind: 'source', subject: module }] };
          } else {
            const evidence = [...new Set([...(recipe.citeSubject ? [input.request.subject] : []),
              ...input.responses?.flatMap(response => response.records ? response.selected ?? [] : []) ?? []])];
            const account = (localId, prose) => ({ localId, prose,
              referent: { description: 'The selected module behavior.', subjects: [module] },
              qualifications: recipe.qualifications, evidence, associations: [], children: [], corrections: [], inconsistencies: [] });
            const result = { ...account('injected-root', recipe.prose), children: recipe.childProse ? [account('injected-part', recipe.childProse)] : [] };
            if (recipe.correction) result.corrections.push({ target: input.request.subject, correctedSubjects: [module],
              reason: recipe.correction.reason, qualifications: recipe.qualifications, evidence,
              replacement: account('injected-replacement', recipe.correction.prose) });
            reply = { kind: 'submit', result };
          }
          // Empty synthetic accounting is preserved as unknown/anomalous by the
          // ordinary ledger; independently, this scripted participant sends no POST.
          report({ source: 'synthetic', categories: [] });
          capture({ input, reply, origin: 'injected-assessment-setup', providerRequests: 0 });
          return reply;
        },
        close() { closed = true; },
      };
    },
  };
}
