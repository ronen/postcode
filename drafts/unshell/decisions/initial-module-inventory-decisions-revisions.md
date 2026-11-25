# Proposed revisions to docs/decisions/initial-module-inventory-decisions.md

Replace the metadata block before the first level-two heading with the following. Preserve all historical body text.

# Initial module inventory slice decisions

Status: partially superseded
Decided: 2026-09-12
Arising from: [Initial module inventory plan](../plans/initial-module-inventory-plan.md)
Scope: the initial PostCode product slice and TypeScript language integration
Superseded in part:

- [Represent modules as qualified domain entities](#represent-modules-as-qualified-domain-entities) is replaced by [Stable reference bindings within a session](transient-analysis-sessions.md#stable-reference-bindings-within-a-session), [Retained domain and storage boundaries](transient-analysis-sessions.md#retained-domain-and-storage-boundaries).
- [Make references repeatable but snapshot-scoped](#make-references-repeatable-but-snapshot-scoped) is replaced by [Stable reference bindings within a session](transient-analysis-sessions.md#stable-reference-bindings-within-a-session), [Retained domain and storage boundaries](transient-analysis-sessions.md#retained-domain-and-storage-boundaries).
- [Preserve Claim context and evaluation outcomes distinctly](#preserve-claim-context-and-evaluation-outcomes-distinctly) is replaced by [Immutable information within an accumulating session](transient-analysis-sessions.md#immutable-information-within-an-accumulating-session), [Retained domain and storage boundaries](transient-analysis-sessions.md#retained-domain-and-storage-boundaries).
- [Keep conceptual presentation separate from source escape](#keep-conceptual-presentation-separate-from-source-escape) is replaced by [Human output boundary and additional detail](human-facing-architectural-representations.md#human-output-boundary). The replacement also specifies [additional detail](human-facing-architectural-representations.md#additional-detail).
- [Begin with a TypeScript module inventory](#begin-with-a-typescript-module-inventory), only development CLI delivery, CLI subject selection and Unicode-text/experimental JSON Views, is replaced by [CLI shell retirement](cli-shell-retirement.md#retire-client).
