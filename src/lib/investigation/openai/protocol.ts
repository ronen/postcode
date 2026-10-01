import type { FunctionTool } from 'openai/resources/responses/responses.js';

const strings = { type: 'array', items: { type: 'string' } };
const support = { qualifications: strings, evidence: { ...strings, description: 'Exact references to context actually supplied; a bare support reference alone does not grant evidence eligibility.' } };
const node = { $ref: '#/$defs/investigram' };
const account = {
  type: 'object', additionalProperties: false,
  properties: {
    localId: { type: 'string' }, prose: { type: 'string' },
    referent: { type: 'object', additionalProperties: false, properties: { description: { type: 'string' }, subjects: strings }, required: ['description', 'subjects'] },
    ...support,
    associations: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { subject: { type: 'string' }, ...support }, required: ['subject', 'qualifications', 'evidence'] } },
    children: { type: 'array', items: node },
    corrections: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { target: { type: 'string' }, correctedSubjects: strings, reason: { type: 'string' }, ...support, replacement: node },
      required: ['target', 'correctedSubjects', 'reason', 'qualifications', 'evidence', 'replacement'] } },
    inconsistencies: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { targets: { ...strings, description: 'One or more exact references to earlier investigrams in this session, never program subjects or source records. Describe documentation-versus-implementation discrepancies in attributed prose and qualifications instead.' }, reason: { type: 'string' }, ...support }, required: ['targets', 'reason', 'qualifications', 'evidence'] } },
  },
  required: ['localId', 'prose', 'referent', 'qualifications', 'evidence', 'associations', 'children', 'corrections', 'inconsistencies'],
};

/** Only PostCode's subject-based evidence and explicit whole-result submission. */
export const investigatorFunctions: FunctionTool[] = [
  {
    type: 'function', name: 'request_evidence', strict: false,
    description: 'Request qualified PostCode evidence. Results correspond to requests in order. Use exact supplied references, never paths. Omit inapplicable optional fields. Follow page.next with the same kind and subject and cursor.',
    parameters: { type: 'object', additionalProperties: false, required: ['requests'], properties: {
      requests: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['kind'], properties: {
        kind: { type: 'string', enum: ['modules', 'organization', 'group', 'inspect', 'exports', 'dependencies', 'dependents', 'membership', 'source', 'investigram', 'investigations'] },
        subject: { type: 'string', description: 'Required except for modules and organization.' },
        cursor: { type: 'string', description: 'Only for paged collection queries.' },
        parts: { type: 'array', items: { type: 'string', enum: ['prose', 'referent', 'qualifications'] }, description: 'Only for investigram context; omit for complete context.' },
        revisionPage: { type: 'integer', minimum: 1, description: 'Only for investigram context; follow revision.nextPage for further revision and cause details.' },
        excerptCharacters: { type: 'integer', minimum: 0, description: 'Only for investigram context; omit for complete context.' },
      } } },
    } },
  },
  {
    type: 'function', name: 'submit_investigram', strict: true,
    description: 'Submit the complete root interpretation for atomic PostCode validation. Copy supplied references exactly, including their kind; do not abbreviate or reconstruct them. Follow the investigation instructions; schema conformance does not establish valid references or truth.',
    parameters: { ...account, $defs: { investigram: account } },
  },
];
