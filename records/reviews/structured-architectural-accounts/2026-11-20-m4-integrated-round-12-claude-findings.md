Record type: findings
Received: 2026-11-20
Reviewer: Claude (Claude Code, Opus 5.5), independent correction rereviewer
Handoff: [Structured architectural accounts: final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 12
Reviewed target: `aec3bc511dbe398f8a598a50ae162cf5dc475d08`
Prior findings: [round 11 Claude](2026-11-20-m4-integrated-round-11-claude-findings.md)
Prior reviewed target: `893db378108eb2aa70e3e23b7da1e12e36b34532`

# Structured architectural accounts: native-identity authority rereview

## Returned findings

**The round 11 residual observation is addressed as the human directed. No actionable findings were found in this change.** This report does not accept the integrated review gate, close the task or authorize a merge.

### Scope and method

This is a focused rereview of the human-directed follow-up under the existing integrated handoff. The direction is recorded in task follow-up `8ccb539`, and the disposition was read at `d9d8756`, which changes no source, test or documentation files relative to the target. The delta reviewed was `893db378108eb2aa70e3e23b7da1e12e36b34532..aec3bc511dbe398f8a598a50ae162cf5dc475d08`. It covers:

- `ledger.ts`, `native-identity.ts`, `modules.ts`, `native.ts`, `subjects.ts`, and the `postcode/contributions@2` version in `identity.ts`;
- the architecture paragraphs in `docs/architecture/contributions.md`;
- the new `contribution-native-authority` tests and the adjusted contribution, exposure, application and native-identity tests and helpers.

I checked the change against each element of the human's direction and traced every `ledger.begin` call in `src/`. Only the two built-in provider batches pass a credential: the module finder (`modules.ts`) and the native-finding batch (`native.ts`). The module-identification policy production, the native-finding policy production, `produce` (`outcomes.ts`), unavailable-evaluation abandonment and dialog productions all open without one. No implementation, governing material, task status or existing review record was modified.

### Assessment against the direction

- **Authority is enforced at acceptance, not by the hosted schema.** The check runs inside atomic staging, before both the known-tuple lookup and allocation. Reassertion of an existing or same-pool tuple therefore also requires authority, and a failure throws before any state is committed. A scripted dialog that bypasses the hosted schema is rejected and repairs normally, as the application regression shows.
- **Authority is host-established and not inferred from producer metadata.**
  - The credential is attached to the exact `ProductionHandle` object in a ledger-private `WeakMap`. It is set only through `begin`, read only at acceptance and deleted in `#conclude`, which serves both the accept and abandon paths.
  - Another pool member cannot borrow it, and the test asserts that it never enters retained records.
  - The default policy denies everything.
  - The Session policy requires the fixed host symbol *and* exact tuple equality with a retained same-Session provider record. Even the genuine adapter credential therefore cannot claim a different provider, rule, scope or key.
  - Mechanism labels grant nothing: an authorized agentic production succeeds, and unauthorized mechanical productions fail.
- **Other producers keep their abilities.** They reference the common Entity ID and can add topics, challenge information and withdraw identifying information about it. The native mapping and the Entity itself are unchanged, and no exposure is invented. The tests previously exercised reuse by resubmitting a native tuple; they now reuse the common Entity ID. This follows directly from the direction.
- **Forward lookup is consistent with reverse lookup.** `moduleEntity` and `nativeEntity` now go through `nativeRecordEntity`, which checks the same Session, expected kind, `implemented` modality and complete tuple. `entityRecord` composes the same helper with the candidate locator, so all four mapping entry points share one correspondence predicate. `native.ts` calls `nativeEntity` to decide whether to introduce an identity, and this tightening cannot cause duplicate introduction. A refused mapping can only come from an existing incompatible tuple, and reintroducing that tuple fails loudly at acceptance instead of being returned silently.
- **Versioning and documentation are justified.** Advancing `postcode/contributions@2` is justified because the set of admissible submissions changed. The tuple and common-ID formulas are unchanged, so legitimate identities are preserved. The hosted schema and instructions are unchanged, which is appropriate because hosted agents already could not submit native identities. The architecture text accurately describes the boundary, the credential lifetime and the absence of a global registry.

### Verification

- Node 22.13.1, detached checkout of `aec3bc511dbe398f8a598a50ae162cf5dc475d08`: `npm run check` and `npm run build` passed.
- **118/118 focused tests passed** in 53.86 seconds, with no failures, skips or cancellations. Command: `node --test --test-concurrency=2`, run from the repository root, over `contribution-native-authority`, `contribution-native-identity`, `contributions`, `contribution-exposure`, `contribution-application`, `contribution-native`, `contribution-modules`, `contribution-results`, `method-provenance`, `contribution-dialog` and `application-exact-compatibility`.
  - This is a superset of the implementer's 92-test set.
  - A first invocation from inside `_build/test` failed 40 fixture-dependent tests only because fixture paths resolve against the working directory. That was an invocation error, not a product result.
- **Counterfactual.** In a temporary worktree, I restored `ledger.ts`, `modules.ts` and `native.ts` from `893db37` and emitted the build despite the expected type errors from the new options. Four tests then failed on assertions:
  - three authority tests, each with "Missing expected exception";
  - the forward kind/modality test, which returned an Entity where none should exist.

  The unchanged reverse-mapping test still passed. This independently matches the four discrimination checks reported in the disposition.
- **Independent probe** (scratchpad, not committed):
  - An abandoned production that was opened with the built-in credential cannot later submit.
  - A holder of the built-in credential *can* introduce a provider record's exact tuple under the wrong Entity kind (see the observation below). The forward lookup then refuses that Entity, and the genuine provider's later contribution fails with "cannot be reidentified".
- `git diff --check 893db37..aec3bc5` passed.
- No full-suite rerun was performed. No live inference was run.

### Non-defect observation

The built-in Session policy validates the namespace and the exact tuple, but not the submitted Entity kind or modality, because the policy receives only the native identity. Only trusted host adapters hold `programProviderIdentityAuthority`, and both always submit the record's own kind with the implemented modality. A wrong-kind introduction therefore requires a host-code defect. Its effect is a loud acceptance failure for the genuine provider. Thanks to the forward and reverse checks, it never produces a silent misclassification. Constraining kind and modality at acceptance would only be additional defense in depth, outside the smallest change the human directed. I do not consider it necessary.

### Residual limits

The review was limited to this follow-up delta and its callers. It does not re-review the rest of the integrated implementation, the earlier live or memory evidence, or the implementer's 741-test full-suite result.
