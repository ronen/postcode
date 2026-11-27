import assert from 'node:assert/strict';
import type { ApplicationResult, AnswerDelivery } from '../src/lib/application/index.js';
export function requireAnswer(result: ApplicationResult) { assert.equal(result.kind, 'answer'); return result; }
export function requireResolution(result: ApplicationResult) { assert.equal(result.kind, 'resolution'); return result; }
export function mechanicalContent(result: AnswerDelivery) {
  const content = result.answer.mechanical ?? result.answer.content;
  assert.ok(content.contract !== 'contribution' && content.contract !== 'contribution-inspection');
  return content.value;
}
