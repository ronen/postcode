/** Assessment-only earlier interpretation. Ordinary acceptance and retention own
 * identity/associations. The recipe is frozen separately from reference answers. */
export function injectedSetup(recipe, capture) {
  if (typeof recipe?.prose !== 'string' || typeof recipe?.childProse !== 'string' || !Array.isArray(recipe?.qualifications)) throw new Error('Invalid assessment injection recipe');
  return {
    identity: { provider: 'postcode-assessment', model: 'injected-earlier-interpretation', origin: 'scripted',
      configuration: { setup: recipe.id, providerRequests: false } },
    open() {
      let closed = false;
      return {
        async exchange(input, _signal, report) {
          if (closed) throw new Error('Closed injected setup');
          const account = (localId, prose) => ({ localId, prose,
            referent: { description: 'The selected module behavior.', subjects: [input.request.subject] },
            qualifications: recipe.qualifications, evidence: [], associations: [], children: [], corrections: [], inconsistencies: [] });
          const reply = { kind: 'submit', result: { ...account('injected-root', recipe.prose), children: [account('injected-part', recipe.childProse)] } };
          // Explicit empty synthetic accounting: one scripted exchange, zero provider requests.
          report({ source: 'synthetic', categories: [] });
          capture({ input, reply, origin: 'injected-assessment-setup', providerRequests: 0 });
          return reply;
        },
        close() { closed = true; },
      };
    },
  };
}
