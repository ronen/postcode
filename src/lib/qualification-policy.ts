/** Shared qualification prose retained with captured module support. */
export const moduleLimitations = {
  population: 'Population covers configured files the analyzer treats as separate modules and visible named modules described by declarations (including interfaces to external implementations). Files treated as shared global code and other compiler module categories are not established as modules.',
  excludedOutput: 'Configured generated-output locations are explicitly excluded from repository evidence.',
  firstObserved: 'No atomic filesystem snapshot is claimed; inputs are memoized as first observed.',
} as const;
