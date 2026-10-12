import assert from 'node:assert/strict';
import type { ExecutedRequest } from '../src/lib/session-protocol.js';

export function requireView(result: ExecutedRequest) {
  assert.equal(result.kind, 'view');
  return result;
}

/** Compare program outputs independently of their distinct invocation occurrences. */
export function programOutput<T extends { readonly context: unknown; readonly attribution: unknown }>(result: T) {
  const { context: _context, attribution: _attribution, ...output } = result;
  return output;
}

export function requireResolution(result: ExecutedRequest) {
  assert.equal(result.kind, 'resolution');
  return result.report;
}
