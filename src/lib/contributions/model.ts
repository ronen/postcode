import type { RecordId, SessionId } from '../records.js';

/**
 * Common qualified analysis contributions: Session identities, immutable investigrams,
 * association declarations, Query-result designations and recorded producer input.
 * Field spellings are implementation choices; the governing semantics are in
 * docs/decisions/common-analysis-contributions.md and association-organization-and-exposure.md.
 */
export type EntityId = RecordId & { readonly entityId: unique symbol };
export type InvestigramId = RecordId & { readonly investigramId: unique symbol };
export type ProductionId = RecordId & { readonly productionId: unique symbol };
export type InvocationId = RecordId & { readonly invocationId: unique symbol };
export type QueryResultId = RecordId & { readonly queryResultId: unique symbol };

export interface ItemAddress { readonly investigram: InvestigramId; readonly item: string }
/** Every declaration is addressed through its owner. Additions and supersessions establish an association at that address. */
export interface DeclarationAddress { readonly investigram: InvestigramId; readonly declaration: string }
export type AssociationAddress = DeclarationAddress;
export interface MetadataAddress {
  readonly investigram: InvestigramId;
  readonly metadata: 'option' | 'illustration' | 'inconsistency';
  readonly key: string;
}

/** Epistemic character follows the producing method, never producer-expressed confidence. */
export type EpistemicStatus = 'mechanically-derived' | 'recorded-assertion' | 'observation' | 'interpretation' | 'organizing-policy';

export interface Qualification {
  readonly status: EpistemicStatus;
  /** The producing method to which this qualification is attributable. */
  readonly method: string;
  readonly scope: string | null;
  readonly guarantee: string | null;
  readonly limitations: readonly string[];
  /** Provider Claim-context records carrying the full method qualification, where a provider retains them. */
  readonly contexts: readonly RecordId[];
}

/** Identity only. Names and descriptions are qualified associated information. */
export interface Entity {
  readonly kind: 'entity';
  readonly id: EntityId;
  readonly session: SessionId;
  /** Kind of thing identified, such as module, symbol, group, state or role. */
  readonly entityKind: string;
  readonly modality: 'implemented' | 'hypothetical' | 'intended';
  /** Provider identity resolved under its explicit rule and basis scope; never the common ID. */
  readonly native: NativeIdentity | null;
  readonly introducedBy: InvestigramId;
  readonly position: number;
}
export interface NativeIdentity { readonly provider: string; readonly rule: string; readonly scope: string; readonly key: string }

export type SubjectRef =
  | { readonly kind: 'entity'; readonly entity: EntityId }
  | { readonly kind: 'investigram'; readonly investigram: InvestigramId }
  /** An exact content selection; a selected component is identified within its enclosing item. */
  | { readonly kind: 'content'; readonly item: ItemAddress; readonly component: string | null }
  | { readonly kind: 'designation'; readonly association: AssociationAddress }
  /** A non-Entity subject designation, such as the configured project. */
  | { readonly kind: 'scope'; readonly scope: string };

export interface InvocationRequest {
  readonly operation: string;
  readonly subjects: readonly { readonly role: string | null; readonly subject: SubjectRef }[];
  readonly parameters: Readonly<Record<string, unknown>>;
  /** Explicitly selected input context; context acquired during execution is production history instead. */
  readonly context: readonly SubjectRef[];
  /** Identity of the requested result contract, including required analysis content or forms. */
  readonly resultContract: string | null;
}
/** The particular request. Its Query result is a separate identity organizing designated answers. */
export interface Invocation {
  readonly kind: 'invocation';
  readonly id: InvocationId;
  readonly session: SessionId;
  readonly request: InvocationRequest;
  readonly result: QueryResultId;
  /** An explicit fresh investigation has its own invocation history and the repeated question's result. */
  readonly fresh: boolean;
  readonly position: number;
}
export interface QueryResult { readonly kind: 'query-result'; readonly id: QueryResultId; readonly session: SessionId; readonly origin: InvocationId }

export interface ContentItem {
  readonly key: string;
  readonly type: string;
  readonly body: unknown;
  /** Explicitly identified things this item concerns; prose mentions are not referents. */
  readonly referents: readonly EntityId[];
  readonly evidence: readonly RecordId[];
  /** Retained content cited as support. A reference is not proof of delivery. */
  readonly support: readonly ItemAddress[];
  /** Content dependencies declared once by the content-type contract. */
  readonly dependencies: readonly ItemAddress[];
  /** Locally addressable components of the body; these are not Entities. */
  readonly components: readonly string[];
  readonly qualification: Qualification | null;
}

export type AssociationTarget =
  | { readonly kind: 'entity'; readonly entity: EntityId; readonly role: 'identification' }
  | { readonly kind: 'entity'; readonly entity: EntityId; readonly role: 'topic'; readonly topic: string }
  | { readonly kind: 'result'; readonly result: QueryResultId };
export type Member =
  | { readonly kind: 'item'; readonly item: ItemAddress }
  | { readonly kind: 'association'; readonly association: AssociationAddress };
export interface Grounds { readonly text: string; readonly evidence: readonly RecordId[]; readonly support: readonly ItemAddress[] }

interface DeclarationBase { readonly key: string; readonly qualification: Qualification | null }
export interface Addition extends DeclarationBase {
  readonly operation: 'add'; readonly target: AssociationTarget; readonly members: readonly Member[]; readonly grounds: Grounds | null;
}
export interface Supersession extends DeclarationBase {
  readonly operation: 'supersede'; readonly target: AssociationTarget; readonly members: readonly Member[];
  readonly displaces: readonly AssociationAddress[]; readonly grounds: Grounds;
}
export interface Withdrawal extends DeclarationBase {
  readonly operation: 'withdraw'; readonly displaces: readonly AssociationAddress[]; readonly grounds: Grounds;
}
export type Declaration = Addition | Supersession | Withdrawal;
export type AssociationDeclaration = Addition | Supersession;

export interface FollowUpOption {
  readonly key: string;
  /** Retained meaning of the available further inquiry; no temporal recommendation is implied. */
  readonly meaning: string;
  readonly request: InvocationRequest;
  readonly references: readonly Member[];
  readonly qualification: Qualification | null;
}
export interface Illustration {
  readonly key: string;
  readonly diagramType: string;
  readonly inputs: readonly ItemAddress[];
  readonly evidence: readonly RecordId[];
  readonly qualification: Qualification | null;
}
export interface InconsistencyReport {
  readonly key: string;
  /** Exact content items or association uses; whole investigrams are not endpoints. */
  readonly endpoints: readonly Member[];
  readonly grounds: Grounds;
  readonly qualification: Qualification | null;
}

/** An immutable, addressable analysis contribution in a flat accepted pool. */
export interface Investigram {
  readonly kind: 'investigram';
  readonly id: InvestigramId;
  readonly session: SessionId;
  readonly method: string;
  readonly production: ProductionId;
  /** Submission-local key retained for traceability. */
  readonly key: string;
  /** Provider contribution identity used to recognize equivalent recomputation. */
  readonly providerKey: string | null;
  readonly position: number;
  /** Position within its acceptance; enumeration only, never priority. */
  readonly ordinal: number;
  readonly qualification: Qualification | null;
  readonly referents: readonly EntityId[];
  readonly items: readonly ContentItem[];
  readonly declarations: readonly Declaration[];
  readonly options: readonly FollowUpOption[];
  readonly illustrations: readonly Illustration[];
  readonly inconsistencies: readonly InconsistencyReport[];
}

export interface Producer {
  readonly mechanism: 'mechanical' | 'agentic';
  readonly method: string;
  /** Actual agent/model provenance for agentic production. */
  readonly agent: Readonly<Record<string, unknown>> | null;
}

export type SelectionScope =
  | { readonly kind: 'entity'; readonly entity: EntityId; readonly role: 'identification' }
  /** Every association of the Entity, whatever its role. */
  | { readonly kind: 'entity'; readonly entity: EntityId; readonly role: 'any' }
  /** Topical associations; a null topic selects every topic key. */
  | { readonly kind: 'entity'; readonly entity: EntityId; readonly role: 'topic'; readonly topic: string | null }
  | { readonly kind: 'result'; readonly result: QueryResultId };

/** Substantive information actually supplied to one producing execution, with its delivery position. */
export type Delivery =
  | { readonly kind: 'item'; readonly position: number; readonly item: ItemAddress;
    /** The exact association route when delivered as a particular use. */
    readonly route: AssociationAddress | null; readonly coverage: 'complete' | 'excerpt' }
  | { readonly kind: 'association'; readonly position: number; readonly association: AssociationAddress;
    /** Displacements already accepted and disclosed with this delivery. */
    readonly disclosed: readonly DeclarationAddress[] }
  | { readonly kind: 'declaration'; readonly position: number; readonly declaration: DeclarationAddress }
  | { readonly kind: 'scope'; readonly position: number; readonly scope: SelectionScope;
    readonly inventory: 'current-only' | 'all-history'; readonly listed: readonly AssociationAddress[]; readonly complete: boolean }
  /** An exact change notice; not delivery of replacement content. */
  | { readonly kind: 'notice'; readonly position: number; readonly change: DeclarationAddress }
  | { readonly kind: 'metadata'; readonly position: number; readonly address: MetadataAddress }
  /** Discovery-only handles; no content exposure. */
  | { readonly kind: 'discovery'; readonly position: number; readonly referent: EntityId; readonly handles: readonly ItemAddress[] };

export interface ProducerReport {
  /** Producer-reported inability or incompleteness, distinct from PostCode's contract checks. */
  readonly inability: string | null;
  /** Exact existing designations returned as the answer without new declarations. */
  readonly answer: readonly AssociationAddress[];
  readonly statement: string | null;
}

/** One producing execution. Each of its investigrams inherits exactly this input history. */
export interface Production {
  readonly kind: 'production';
  readonly id: ProductionId;
  readonly session: SessionId;
  readonly producer: Producer;
  readonly invocation: InvocationId | null;
  readonly opened: number;
  /** Acceptance position of the submission, or the position at which the attempt ended without one. */
  readonly concluded: number;
  readonly outcome: { readonly kind: 'accepted' } | { readonly kind: 'no-contribution'; readonly reason: string };
  readonly deliveries: readonly Delivery[];
  /** Program evidence actually supplied to, or acquired as the source basis of, this production. */
  readonly evidence: readonly RecordId[];
  readonly report: ProducerReport | null;
  readonly investigrams: readonly InvestigramId[];
}

// Submission shapes. References are either retained identities or submission-local keys.
export type EntityRef = EntityId | { readonly local: string };
export type InvestigramRef = InvestigramId | { readonly local: string };
export interface SubmittedItemRef { readonly investigram: InvestigramRef; readonly item: string }
export interface SubmittedDeclarationRef { readonly investigram: InvestigramRef; readonly declaration: string }
export type SubmittedMember =
  | { readonly kind: 'item'; readonly item: SubmittedItemRef }
  | { readonly kind: 'association'; readonly association: SubmittedDeclarationRef };
export interface SubmittedQualification {
  readonly status?: EpistemicStatus;
  readonly scope?: string | null;
  readonly guarantee?: string | null;
  readonly limitations?: readonly string[];
  readonly contexts?: readonly RecordId[];
}
export interface SubmittedGrounds { readonly text: string; readonly evidence?: readonly RecordId[]; readonly support?: readonly SubmittedItemRef[] }
export type SubmittedTarget =
  | { readonly kind: 'entity'; readonly entity: EntityRef; readonly role: 'identification' }
  | { readonly kind: 'entity'; readonly entity: EntityRef; readonly role: 'topic'; readonly topic: string }
  | { readonly kind: 'result'; readonly result: QueryResultId };
export type SubmittedDeclaration =
  | { readonly key: string; readonly operation: 'add'; readonly target: SubmittedTarget; readonly members: readonly SubmittedMember[];
    readonly grounds?: SubmittedGrounds | null; readonly qualification?: SubmittedQualification | null }
  | { readonly key: string; readonly operation: 'supersede'; readonly target: SubmittedTarget; readonly members: readonly SubmittedMember[];
    readonly displaces: readonly SubmittedDeclarationRef[]; readonly grounds: SubmittedGrounds; readonly qualification?: SubmittedQualification | null }
  | { readonly key: string; readonly operation: 'withdraw'; readonly displaces: readonly SubmittedDeclarationRef[];
    readonly grounds: SubmittedGrounds; readonly qualification?: SubmittedQualification | null };
export interface SubmittedEntity {
  readonly key: string;
  readonly entityKind: string;
  readonly modality?: Entity['modality'];
  readonly native?: NativeIdentity | null;
}
export type SubmittedSubject =
  | { readonly kind: 'entity'; readonly entity: EntityRef }
  | { readonly kind: 'investigram'; readonly investigram: InvestigramRef }
  | { readonly kind: 'content'; readonly item: SubmittedItemRef; readonly component?: string | null }
  | { readonly kind: 'designation'; readonly association: SubmittedDeclarationRef }
  | { readonly kind: 'scope'; readonly scope: string };
export interface SubmittedInvestigram {
  readonly key: string;
  readonly providerKey?: string | null;
  readonly qualification?: SubmittedQualification | null;
  readonly entities?: readonly SubmittedEntity[];
  readonly referents?: readonly EntityRef[];
  readonly items?: readonly {
    readonly key: string; readonly type: string; readonly body: unknown; readonly referents?: readonly EntityRef[];
    readonly evidence?: readonly RecordId[]; readonly support?: readonly SubmittedItemRef[]; readonly qualification?: SubmittedQualification | null;
  }[];
  readonly declarations?: readonly SubmittedDeclaration[];
  readonly options?: readonly {
    readonly key: string; readonly meaning: string;
    readonly request: { readonly operation: string; readonly subjects: readonly { readonly role?: string | null; readonly subject: SubmittedSubject }[];
      readonly parameters?: Readonly<Record<string, unknown>>; readonly context?: readonly SubmittedSubject[]; readonly resultContract?: string | null };
    readonly references?: readonly SubmittedMember[]; readonly qualification?: SubmittedQualification | null;
  }[];
  readonly illustrations?: readonly { readonly key: string; readonly diagramType: string; readonly inputs: readonly SubmittedItemRef[];
    readonly evidence?: readonly RecordId[]; readonly qualification?: SubmittedQualification | null }[];
  readonly inconsistencies?: readonly { readonly key: string; readonly endpoints: readonly SubmittedMember[];
    readonly grounds: SubmittedGrounds; readonly qualification?: SubmittedQualification | null }[];
}
export interface SubmittedReport {
  readonly inability?: string | null;
  readonly answer?: readonly SubmittedDeclarationRef[];
  readonly statement?: string | null;
}
export interface SubmittedContribution {
  readonly investigrams: readonly SubmittedInvestigram[];
  readonly report?: SubmittedReport | null;
}

export class InvalidContribution extends Error {}

export const addressKey = (address: DeclarationAddress): string => `${address.investigram}#${address.declaration}`;
export const itemKey = (address: ItemAddress): string => `${address.investigram}#${address.item}`;
export function targetKey(target: AssociationTarget): string {
  return target.kind === 'result' ? `result ${target.result}`
    : target.role === 'identification' ? `entity ${target.entity} identification` : `entity ${target.entity} topic ${JSON.stringify(target.topic)}`;
}
export function inScope(scope: SelectionScope, target: AssociationTarget): boolean {
  if (scope.kind === 'result') return target.kind === 'result' && target.result === scope.result;
  if (target.kind !== 'entity' || target.entity !== scope.entity) return false;
  if (scope.role === 'any') return true;
  if (scope.role === 'identification') return target.role === 'identification';
  return target.role === 'topic' && (scope.topic === null || scope.topic === target.topic);
}
