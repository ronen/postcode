# Foundation readiness M2 state/identity review: round 1 findings

Record type: findings
Received: 2026-09-27
Reviewer: Claude Code (Claude Opus 5.5), independent agent session arranged by the human
Handoff: [2026-09-27-m2-state-identity-handoff.md](2026-09-27-m2-state-identity-handoff.md)
Round: 1
Reviewed target: `0037eaff2d7dcd17fdb9186bed8511011f1eb9b6` (scope `6af13629aa50d875b378bf8d0294a9fda5e356d3..0037eaff2d7dcd17fdb9186bed8511011f1eb9b6`)

## Returned findings

### Scope and method

I reviewed the implementation diff for packages 1–3, C13/C16, and the authorized idle
Ctrl-C follow-up. I read it against the plan, the handoff, `dev/review.md`, the
engineering guidelines and the M2 validation record. I treated the validation
record as a set of claims to check, not as evidence.

I checked out the exact target and the baseline `6af1362` into separate detached
worktrees and built each one. Where the handoff's focus areas called for it, I went
beyond reading and running the supplied tests:

- Targeted probes against the compiled target and baseline builds: a selector
  identity collision, store batch atomicity, duplicate submissions and entity-binding
  rejection.
- Mutation checks. I edited the compiled target build, ran the relevant tests, then
  restored the file. The mutations covered selector normalization in all three
  projection families, `identityReference`, the organization and dependency-evaluation
  reference positions, the coupled root/expansion `put`, historical Claim-context
  support and the idle Ctrl-C reset.
- A manual inventory of every production `recordId` and organization `id(...)` call,
  classifying each key position as a reference or a literal.

### Actionable findings

#### F1 (medium; pre-existing, not a regression): an internal-ID selector and a literal selector spelled like a normalized reference produce the same projection ID

The three projection families normalize a selector that resolves to a selected record
(`src/lib/projections.ts:46-51`, `src/lib/organization/projections.ts:84-91`,
`src/lib/dependencies/projections.ts:71-76`). The normalized key string, such as
`session:module:<hash>`, is a valid literal selector too. The selector is the one
identity-key position that holds either a reference or a literal. In that position the
normalized spelling and the literal spelling share one value space, so the identity is
not injective there.

Reproduction on the target, using the real provider and `inspect`:

1. Discover a project containing `a.ts`. Read module `S:module:H`. `H` is
   session-independent because module keys are literal.
2. Add `declare module "session:module:H" { … }` and discover again.
3. `inspect(store, evaluation, S:module:H)` selects the file module. The projection
   key's `selector` is `session:module:H`.
4. `inspect(store, evaluation, 'session:module:H')` selects the ambient module by name.
   Its key has the same `selector`, `lens`, `reference` and `evaluation`, so it gets the
   same ID with different content. The call throws `Immutable record collision`.

Baseline `6af1362` throws the same error, because textual replacement collapsed both
spellings. This is therefore not a regression. It is still the class of defect that
package 3 targets. The plan's acceptance says that literal session text must stay
distinguishable and must not collide with a normalized reference. Handoff focus 4
asks the reviewer to confirm that literal selectors survive and that internal
selectors are normalized only after resolution. The literal survives, but it collides
with the resolved form.

Suggested direction: encode the resolved form structurally so that it cannot equal a
string, for example `selector: selectedReference ? { reference: identityReference(...) } : selector`.
Any other encoding works if it keeps the two spaces disjoint. Apply it in all three
families and assess the effect on the projection/record method version. Add a
regression test such as the reproduction above. The same injectivity question should
be asked for any future mixed reference/literal key position.

#### F2 (low–medium): "internal-record selectors normalize only after resolution" has no test coverage

In each of the three projection families, I replaced `selector: selectorKey` with the
raw `selector`. With each mutation applied on its own, the full suite still passes
(248/248). The CLI and session comparison command sets use names and handles only
(`forward`, `requests`, `origin`, `module0`). The previous `compare-analysis.mjs`
stale-`entityId` case was dropped. As a result, no comparison exercises selection by
internal record ID or by compact reference.

The validation record claims this normalization, and the identity-caller inventory
lists it. The existing test `literal selectors containing the producing session…` only
covers the literal case, where the selector is the session ID and resolves to nothing.
Add a positive control, for example the same internal-ID selection in two sessions
producing equal normalized projection IDs, alongside the F1 regression test. Also add
at least one internal-ID or compact-reference selector to the comparison command set.

### Non-defect observations

- **Composition classification semantics changed slightly.** `isCompositionContext`
  now matches the composition method token anywhere in a `;`-separated chain. The old
  code matched only as a prefix, which in practice meant the primary producer.
  Organization contexts compose `organization@3;<inherited method>`. Today they
  inherit only discovery contexts, so no output changes, as the version-aligned
  comparison shows. A future derived context that inherits from a composition context
  would be classified as composition, and its limitations could be suppressed once
  composition completes. This is probably acceptable, but the intended meaning ("any
  component" or "primary producer") should be stated where the policy is defined.
- **Identity equivalence for ordinary input holds by construction.** For a reference,
  `identityReference` produces exactly the spelling that the old `replaceAll` produced:
  `session` or `session:<kind>:<hash>`. Ordinary identities and ID-derived order
  therefore change only where literal text contained the producing UUID, plus the
  analysis-inputs ID through the `records@19` method list. That matches the
  version-aligned comparison result. Using the existing versioned method identity
  (`records@19`, `presentation@24`) instead of adding codes or view fields is
  proportionate.
- **Caller inventory is accurate.** Every production key position I found matches the
  validation record's inventory. References go through `identityReference`, and
  names, paths, file positions, compiler names, method strings and captured values stay
  literal. The only mixed position is the selector (F1). Dependency-evaluation keys
  cover all five `DependencyResult` reference collections.
- **Mutation coverage of reference normalization is good elsewhere.** Disabling
  `identityReference` entirely fails 21 tests. Disabling organization references fails
  9. Leaving dependency-evaluation relationship references raw fails 6.
- **Ownership, atomicity and the index work as claimed.**
  - Splitting the coupled `put` fails the coupling test.
  - A batch with a valid evaluation and a malformed later member leaves no index entry
    and no lookup result.
  - A same-batch duplicate with different content is rejected, and the index stays
    empty.
  - An identical resubmission keeps the originally owned object in both the store and
    the index.
  - `entityIds` rejects a missing member before any binding is allocated. The later
    allocation is sorted.
  - `evaluations()` returns a fresh array over a per-session index.
- **Validation still runs before reuse.** In the pure-derivation reuse paths
  (`evaluateOrganization`, `evaluateDependencyOrganization`), basis-kind and
  basis-match validation runs before the deterministic lookup. Their IDs capture all
  varying inputs: the session's repository evidence is fixed per session. Reuse does
  not depend on outcome state, as the matrix says. The old completed-only session maps
  recomputed deterministic records identically, so removing them changes cost, not
  results.
- **Historical support is read from the store.** Making the provider ignore stored
  support fails the two acquisition/retry tests. The new rule is per-store rather than
  per-provider. That is more robust than the removed map, which could supply a basis
  that did not exist in a different store. The provider's per-provider `results` cache
  still assumes one store per session (pre-existing, not introduced here).
- **Freezing provider results is safe.** `freezeOwned(result)` deeply freezes the
  retained discovery results and cache values. They contain only record IDs and state,
  with no compiler objects, so this is safe.
- **The comparison policy fails closed rather than silently normalizing.** Reference
  normalization is field-name based. Where it skips opaque keys (`artifact`, `link(s)`,
  `layout`, `capture`, `location`, `dependencyResolution`), any reference that appears
  there compares literally. That causes a false failure, not a silent acceptance.
  Reference-named view fields that do not hold `RecordId`s hold only enum literals
  (`subject`, `basis`). Rendered JSON layout is asserted exactly.
- **The idle Ctrl-C test detects the defect.** Removing the `line`/`cursor` reset fails
  the `dumb` case and passes the `xterm` case, which demonstrates the dumb-terminal
  defect.

### Verification performed (independent, at `0037eaf`)

- `npm run check`: passed. `npm test`: 248 pass, 0 fail, 0 skipped or cancelled.
- `scripts/compare-analysis.mjs` against a disposable copy of the baseline build, with
  only the two method constants aligned: 72/72 equal. The build fingerprints match the
  recorded report (`a0a5e4e5…`, `1c27c0f2…`). The same script against the unaligned
  baseline fails on the `records@18/19` and `presentation@23/24` fields, as expected.
- `scripts/compare-session-requests.mjs`: 4 fixtures × 54 = 216 comparisons passed.
- `scripts/probe-compiler-interruption.mjs`: the control published and finished. The
  interrupted case exited by SIGINT with only `compiler-source-read` recorded.
- The probes and mutations described above.

### Unverified areas and residual limits

- I checked the store's atomicity and index behavior with synthetic records only. I did
  not independently re-measure the reported query operation counts.
- I did not independently review the C01/C02 test-helper consolidations beyond reading
  the diff and relying on the suite passing.
- Native scope: macOS and Node 22.13.1 only, like the implementer's verification.
- M3 ownership/publication and later packages are out of scope, as the handoff states.
  I found no new universal cache, scheduler, provider registry or persistent-session
  assumption. The changes stay inside existing store, provider and evaluator
  boundaries and look compatible with the investigation plan.

### Recommendation

The state/consumer matrix, immutable publication, atomic coupled outcomes, pure
reuse, historical support, binding allocation, and version baseline are sound and
well verified. F1 and F2 are narrow and sit in the identity scheme itself. I recommend
correcting F1 with a regression test and adding F2's coverage before these identity
patterns are extended into later migrations. After that, a lightweight re-review of
just that correction should be enough for this intermediate gate. The human decides
whether the gate is satisfied.
