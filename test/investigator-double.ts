import type { ReportedUsage } from '../src/lib/investigation/contracts.js';

export const syntheticUsage: ReportedUsage = { source: 'synthetic', categories: [
  { category: 'input', unit: 'tokens', value: 20, includedIn: null },
  { category: 'cached-input', unit: 'tokens', value: 5, includedIn: 'input' },
  { category: 'output', unit: 'tokens', value: 10, includedIn: null },
  { category: 'reasoning', unit: 'tokens', value: 4, includedIn: 'output' },
] };
