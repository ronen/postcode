Record type: findings
Received: 2026-11-20
Reviewer: Claude (Claude Code, Opus 5.5), independent correction rereviewer
Handoff: [Structured architectural accounts: final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 11
Reviewed target: `893db378108eb2aa70e3e23b7da1e12e36b34532`
Prior findings: [round 10 Copilot](2026-11-20-m4-integrated-round-10-copilot-findings.md)
Prior reviewed target: `5dc5d18c4c09aa949040b73b26f131b9c048c421`; production `25e9361b12580cd6440fcff38b6f7b44907a86fd`

# Structured architectural accounts: native-identity correction rereview

## Returned findings

**The round 10 Copilot finding is resolved. No actionable findings were found in the correction, and it requires no further changes.** This report does not accept the integrated review gate, close the task or authorize a merge; those remain human determinations.

### Scope and method

This is a focused correction rereview under the existing integrated handoff. It is not another full implementation review. The correction delta reviewed was `5dc5d18c4c09aa949040b73b26f131b9c048c421..893db378108eb2aa70e3e23b7da1e12e36b34532`, covering `src/lib/contributions/{native-identity,native,modules,subjects}.ts`, the architecture note in `docs/architecture/contributions.md`, and the new or extended tests in `contribution-native-identity`, `contribution-native` and `contribution-application`. The Round 10 disposition text was read at `8d22849`. That commit changes no source, test or documentation files relative to the target.

Read against the governing material: core concepts (provider-native identity resolved under method and scope; modality is preserved) and [common analysis contributions](../../../docs/decisions/common-analysis-contributions.md) (the provider/native-key/scope combination maps to a common identity, and equivalence across scopes is never inferred). Traced every reverse-mapping caller (`subject-resolution.ts` `commonCandidate`, `application/executor.ts` follow-up `moduleSubject`, and `dialog.ts` subject `moduleRecord`), plus the forward mappings (`moduleEntity`, `nativeEntity`) and ledger acceptance. Searched for any remaining key-parsing reverse mapping and found none outside `entityRecord`. No implementation, governing material, task status or existing review record was modified.

### Assessment

1. **Finding resolution.** `entityRecord` now treats the native key only as a candidate locator. It returns the record only when all of the following hold: the Entity is `implemented`; the candidate record exists in the ledger's Session and is a module, symbol or group; the Entity kind equals the record kind; and `ledger.native(nativeIdentity(record)) === entity`. The ledger indexes Entities by `canonical` of the full provider/rule/scope/key tuple, and each tuple maps to at most one Entity. The last condition is therefore exactly equivalent to tuple equality with the record's provider identity. That covers a differing provider, rule or scope under the same key. The kind and modality conditions cover an exact tuple first introduced under another kind or modality. `entityModule` now delegates to the same function, replacing its separate provider-and-key-prefix check, so the earlier partial check is gone.
2. **Consistency across paths.** Inspection (`commonCandidate`) falls back to the Entity's own common identity when no correspondence exists. Direct module Lenses then resolve to `unsupported-subject`. The follow-up option path uses `entityModule` and refuses the option without opening a dialog. Dialog delivery reports `moduleRecord: null` and adds no mechanical identification. All four paths share one predicate.
3. **Legitimate mappings and exposure.** The shared constructor in `native-identity.ts` produces the same tuple that `moduleNativeIdentity` produced before the correction (provider `typescript`, the module's method, scope `configured-project`, its identity reference). Forward identities and Entity IDs therefore do not change. The real-fixture assertions now check reverse correspondence for modules, symbols and groups. `entityRecord` reads `ledger.entity`, `ledger.native` and `store.lookup`/`store.get` only. It neither begins a production nor records a delivery, and the test asserts this. Historical answers are not affected: retained records are immutable, and valid mappings produce identical subjects.
4. **Tests, documentation and method versions.** The new regressions discriminate. I rebuilt the target tests against the pre-correction production sources (`5dc5d18` `src/`) in a temporary worktree. Both `contribution-native-identity` tests failed there, each returning the original module record ID where none should exist. The new `contribution-application` regression also failed there. All pass at the target. The architecture paragraph accurately describes the implemented boundary. Leaving method versions unchanged is justified. No identity rule, tuple representation, record shape or answer-key formula changed, and outputs change only for inputs that were previously misclassified in violation of the already-accepted contract.

### Independent counterexamples

A scratchpad probe against the target build (not committed) confirmed the following:

- An exact module tuple resubmitted by another production reuses the original Entity and still maps to the module (legitimate dedupe).
- Swapping provider and scope together to the group family's values with the same key does not map.
- A rule differing only by a suffix does not map.
- A key with appended text does not map.
- A `group`-kind Entity carrying the exact module tuple in a fresh ledger does not map.
- An exact tuple in a ledger for a different Session does not map.
- `nativeIdentity(module)` deep-equals `moduleNativeIdentity(module)`.

### Verification

- Node 22.13.1, detached checkout of `893db378108eb2aa70e3e23b7da1e12e36b34532`: `npm run check` and `npm run build` passed.
- **60/60 focused tests passed** in 51.20 seconds, with no failures, skips or cancellations. Command: `node --test --test-concurrency=2` over `contribution-native-identity`, `contribution-native`, `contribution-modules`, `contribution-application`, `contribution-dialog` and `application-exact-compatibility`.
- Discrimination check: 2/2 `contribution-native-identity` tests and the new application regression failed against the pre-correction production sources, as described above.
- The independent probe passed.
- `git diff --check 5dc5d18..893db37` passed.
- No full-suite rerun was performed. No live inference was run.

### Non-defect observations and residual limits

- **Forward mapping does not check kind or modality.** `moduleEntity` and `nativeEntity` return `ledger.native(tuple)` without checking the Entity's kind or modality. The ledger accepts native identities from any production, including scripted agent dialogs, as the new application test itself demonstrates. A non-mechanical production could therefore introduce the exact tuple of a not-yet-contributed symbol under another kind. The later mechanical contribution would then be rejected as reidentification, and forward lookup would return that Entity.
- **Why this is not a finding here:**
  - It predates this correction and lies outside the Round 10 finding.
  - The reverse check now refuses the mechanical classification of such an Entity.
  - Module identifications are contributed at evaluation, before any dialog.
  - The hosted protocol's entity schema (`investigation/openai/contribution-protocol.ts`) admits only `key` and `entityKind`, with `additionalProperties: false`. Hosted agents therefore cannot supply native identities.
  - I did not verify how strictly the hosted decoder enforces that schema at runtime. The human may wish to consider whether ledger acceptance should restrict native identities to their providers' productions, but that would be separate from this correction.
- **Review scope.** The review was limited to the correction delta and its callers. It does not re-review the rest of the integrated implementation, the earlier live or memory evidence, or the implementer's full-suite result.
