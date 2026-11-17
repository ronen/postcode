import type { FunctionTool } from 'openai/resources/responses/responses.js';
import type { DialogAgent, DialogInput, DialogReply } from '../../contributions/dialog.js';
import type { ChatGPTSession } from './chatgpt-credentials.js';
import { hostedAgent } from './adapter.js';
import type { OpenAIExchange, WireProtocol } from './adapter.js';
import { InvestigatorReferences } from './references.js';

export const contributionWireProtocol = 'postcode/contribution-dialog-wire@1';

/**
 * Reference positions of the contribution dialog. A string at one of these keys is an exact
 * identity and travels as a short handle; arrays under these keys are lists of identities.
 * Everything else is literal: names, local keys, prose, labels, qualification text and scope
 * descriptions are never searched or substituted, even when they contain an identity.
 */
const referenceKeys = new Set(['entity', 'investigram', 'production', 'result', 'invocation', 'attempt', 'record', 'moduleRecord', 'referent', 'claim',
  'referents', 'evidence', 'contexts', 'exports', 'subject', 'cursor']);
const depthLimit = 64;

function translate(value: unknown, key: string, path: string, map: (value: string, path: string) => string, special: (value: Record<string, unknown>, path: string) => unknown, depth = 0): unknown {
  if (typeof value === 'string') return referenceKeys.has(key) ? map(value, path) : value;
  // Domain validation rejects whatever lies beyond the structural bound, untouched.
  if (depth > depthLimit || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item, index) => translate(item, key, `${path}[${index}]`, map, special, depth + 1));
  const replaced = special(value as Record<string, unknown>, path);
  if (replaced !== undefined) return replaced;
  return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, translate(item, name, `${path}.${name}`, map, special, depth + 1)]));
}

const exact = { type: 'string', description: 'An exact handle supplied in this dialogue.' };
const address = (second: string) => ({ type: 'object', properties: { investigram: exact, [second]: { type: 'string' } }, required: ['investigram', second] });
/** Only PostCode's subject-based acquisition and explicit whole-contribution submission. */
export const contributionFunctions: FunctionTool[] = [
  { type: 'function', name: 'request_information', strict: false,
    description: [
      'Request qualified information. Results correspond to requests in order. Use exact supplied handles, never paths or names.',
      'Program evidence, by record handle: { kind: "modules" | "organization" }, or { kind: "inspect" | "exports" | "dependencies" | "dependents" | "membership" | "group" | "source", subject }. Follow page.next by repeating the request with cursor.',
      'Retained analysis, by exact identity: { kind: "baseline", entity } for the standing identifications of a thing; { kind: "inventory", scope, inventory: "current-only" | "all-history" } for addresses only, where scope is { kind: "entity", entity, role: "identification" | "any" }, { kind: "entity", entity, role: "topic", topic: <key or null> } or { kind: "result", result };',
      '{ kind: "association", association: { investigram, declaration }, content?: true } for one exact use with its grounds, standing and optionally its content; { kind: "declaration", declaration: { investigram, declaration } }; { kind: "item", item: { investigram, item }, excerptCharacters? } for content on its own; { kind: "member", association, item } for content as part of a use;',
      '{ kind: "contribution", investigram } for a whole contribution; { kind: "designations", result, content?: true } for the current answers of a question; { kind: "metadata", address: { investigram, metadata: "option" | "illustration" | "inconsistency", key } }; { kind: "referents", entity } for handles of content that names a thing.',
      'An inventory, a handle or a notice is not the content it refers to. Unavailable or omitted information is not evidence of absence.',
    ].join(' '),
    parameters: { type: 'object', additionalProperties: false, required: ['requests'], properties: { requests: { type: 'array', items: { type: 'object', additionalProperties: true, required: ['kind'],
      properties: { kind: { type: 'string' }, subject: exact, cursor: { type: 'string' }, entity: exact, investigram: exact, result: exact,
        association: address('declaration'), declaration: address('declaration'), item: address('item'), content: { type: 'boolean' }, excerptCharacters: { type: 'integer', minimum: 0 },
        inventory: { type: 'string', enum: ['current-only', 'all-history'] }, scope: { type: 'object' }, address: { type: 'object' } } } } } } },
  { type: 'function', name: 'submit_contribution', strict: false,
    description: 'Submit the complete contribution for atomic validation, in the form the instructions give. Copy supplied handles exactly; refer to content of this same submission with { investigram: { local: <key> }, item | declaration }. A structurally invalid submission is returned once for repair. Schema conformance establishes neither valid references nor truth.',
    parameters: { type: 'object', additionalProperties: false, required: ['investigrams'], properties: {
      investigrams: { type: 'array', items: { type: 'object', additionalProperties: true, required: ['key'], properties: { key: { type: 'string' } } } },
      report: { type: 'object', additionalProperties: false, properties: { inability: { type: 'string' }, statement: { type: 'string' },
        answer: { type: 'array', items: address('declaration') } } } } } },
];

/** The contribution dialog over the hosted transport, with its own structural reference translation. */
export const contributionProtocol: WireProtocol<DialogInput, DialogReply> = {
  functions: contributionFunctions, requestFunction: 'request_information', submitFunction: 'submit_contribution',
  description: 'PostCode qualified information acquisition and explicit contribution submission', protocol: contributionWireProtocol,
  codec() {
    const references = new InvestigatorReferences();
    const encode = (value: unknown, path: string): unknown => translate(value, '', path, reference => references.handle(reference),
      // A program-evidence response is translated by its typed record structure; the wrapper's own fields by key.
      (object, at): unknown => object.tool === 'evidence' && 'response' in object ? { ...object, response: references.evidenceResponse(object.response, `${at}.response`),
        entities: encode(object.entities, `${at}.entities`), retained: encode(object.retained, `${at}.retained`), retainedOmitted: encode(object.retainedOmitted, `${at}.retainedOmitted`) } : undefined);
    const decode = (value: unknown, path: string) => translate(value, '', path, (handle, at) => references.resolve(handle, at), () => undefined);
    return {
      message(input) {
        references.begin();
        return { content: { request: encode(input.request, '$.request'), notices: encode(input.notices, '$.notices'), remaining: input.remaining },
          responses: encode(input.responses, '$.responses') };
      },
      tools: args => !args || typeof args !== 'object' || !('requests' in args) || !Array.isArray(args.requests) ? null
        // Domain coordination validates every requested capability and reference.
        : { kind: 'tools', requests: decode(args.requests, '$.requests') as unknown[] },
      // An unparseable submission is still a submission: validation rejects it and bounded repair applies.
      submission: (args, malformed) => ({ kind: 'submit', contribution: malformed ? null : decode(args, '$') }),
      audit: () => references.audit(), close: () => references.close(),
    };
  },
};

interface TransportOptions { fetch?: typeof fetch; onExchange?: (exchange: OpenAIExchange) => void }
export function openAIDialogAgent(apiKey: string, options: TransportOptions = {}): DialogAgent {
  return hostedAgent({ apiKey }, contributionProtocol, options);
}
export function chatGPTDialogAgent(session: ChatGPTSession, options: TransportOptions = {}): DialogAgent {
  return hostedAgent({ session }, contributionProtocol, options);
}
