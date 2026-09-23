# One-shot session conversion review: round 1 findings

Record type: findings
Received: 2026-09-23
Reviewer: Claude Opus 5.5 (`claude-opus-5-5`) in a fresh Claude Code session, arranged by the human; not the implementing agent
Handoff: [One-shot session conversion review](2026-09-23-one-shot-handoff.md)
Round: 1
Reviewed target: `45205c54c908d70c618caa9bb03187bf0bd5e887` (scope `8dccbfd..45205c5`; branch `codex/transient-session-shell`)

## Returned findings

### Scope and method

I reviewed the complete `8dccbfd..45205c5` diff against the approved plan (stage 1),
the accepted session decisions, and the handoff's six focus areas. I read the new
session executor, the CLI conversion, identity/record/store changes, the
TypeScript provider's input-support linkage, all three projection selectors, the
three presentations, observation batches, the updated tests, runtime
documentation, the validation record, and both verification scripts. I treated
the handoff and validation record as claims to check, not as evidence.
`HEAD` (`f5a5894`) differs from the target only by the handoff; `src`, `test`
and `scripts` are identical.

### Verification performed

- `npm run check` in the checkout: passed.
- `npm test` in the checkout: 197 tests, 197 passed.
- `git diff --check 8dccbfd 45205c5`: clean.
- Built baseline `8dccbfd` and target `45205c5` separately from `git archive`
  exports under a disposable `_review-one-shot/` directory. I installed each with
  `npm ci` and confirmed TypeScript 6.0.3 resolved for both.
- `node scripts/compare-session-conversion.mjs BEFORE AFTER REPORT`: 54
  comparisons passed. I ran it three times on fresh temporary paths and it passed
  every time, so the earlier ordering instability did not recur.
- `node scripts/probe-compiler-interruption.mjs`: reproduced. The control run
  published its view and exited 0 in about 1.5 s. The interrupted run ended by
  native SIGINT about 13 ms after the signal, with only the `compiler-source-read`
  phase and no view or completion event. The stack check confirms that the signal
  arrived during real compiler-host work.
- Mutation check of the comparator (see F1).
- The target's test suite, run in the ignored `_review-one-shot/after` copy, had
  two failures in `dependency-presentation.test.js`. The baseline copy in the same
  location fails the same two tests. Both depend on repository-layout evidence,
  and an ignored directory has none. This comes from the environment and is not a
  regression; the same tests pass in the checkout.

### Actionable findings

**F1 (low; verification harness only). The comparator removes every `reference`
key, which drops display-row fields from the structural comparison.**
`scripts/compare-session-conversion.mjs`, `comparable()`, filters
`['navigation', 'dependencyNavigation', 'expectedSnapshot', 'reference']` at
every depth. The intent is to adapt the retired and new selector-mode parameter
(`parameters.expectedSnapshot` → `parameters.reference`). But
`display.rows[].reference` in both the dependency and organization views is a
presentation fact: it marks a repeated component or group shown as "reference
(already expanded)". The filter removes that field too. Real fixture views contain such rows:
`dependencies --json` has one on `dependency-journey` and two each on
`dependency-contract` and `exports`. The validation record says only selector-mode
fields are adapted and that presentation rows are not normalized. The comparison
does not do what that statement says.

Evidence:
- I made a variant that removes `reference` only when it is `false` inside a
  `parameters` object (the object that contains `selector`). Against the real
  target it still passes all 54 comparisons, so the equivalence conclusion
  stands.
- In a copied target build, I changed dependency rows to always carry
  `reference: false`. The row-preserving variant fails at
  `view.display.rows[6].reference`. The shipped comparator catches the mutant only
  through the Unicode text comparison, which runs only for Unicode cases. A
  difference that affected only structured fields would go unnoticed in the JSON
  cases.

Recommendation: limit the filter to the projection `parameters` path. Do this
before the harness, or its approach, is reused for the stage-2 and stage-3
comparisons between one-shot and shell requests and between reordered requests.
This does not affect runtime behavior or this checkpoint's result.

I found no actionable runtime defects.

### Focus-area assessment (non-defect observations)

1. **Session identity and input support.** `sessionId()` is a random UUID with no
   dependence on inputs. The captured input set is now a separate immutable
   `analysis-inputs` record. The provider attaches it to every claim context it
   produces, including dependency contexts, before one atomic `put`. The store
   enforces the reference kind and same-session ownership. Presentations strip
   `inputs` from qualifications, and observations do not include the input
   record. Claims keep their own method and evidence; nothing reads the session
   record as support. Source evidence keeps path, content digest and span through
   the store boundary. Organization contexts get their support from
   repository-evidence, region and artifact records, as before. The session tests
   cover wrong-kind rejection, immutability collision and cross-store rejection.
2. **Lookup and selectors.** The CLI always uses lookup mode: exact name or handle,
   plus a full record key from the same session. Lookup keeps zero, one and many
   matches, and group-name and module-name collisions are kept together. Compact
   IDs are accepted only in library reference mode, which turns off name lookup
   and reports `unknown-reference` when nothing matches. `--snapshot`,
   `--dependency-context`, generated commands and the `navigation` and
   `dependencyNavigation` fields are gone. Tests cover rejection of the retired
   options, compact-ID-shaped exact names, handles that avoid the compact-ID
   grammar, and a copied ID or full key from another invocation matching nothing.
   I consider the library separation between reference and lookup suitable for
   stage 2. The limits below belong to stage 2 and the handoff already records
   them:
   - Compact spellings are still abbreviated against each evaluation's complete
     population.
   - Claim-context IDs are keyed only by scope (`recordId(session, 'context',
     scope)`), but they now carry `inputs`. A second discovery in the same session
     with a different captured input set would raise an immutable-record
     collision on those IDs unless accumulation keys contexts by input basis or
     otherwise separates them. This is expected given that the executor refuses a
     second request, but stage 2 must address it directly.
3. **Populations, qualification and disclosure.** The projection logic is
   unchanged apart from selector mode and naming. Rendering still consumes only
   materialized view values; I found no new source reads or evaluation in
   `create*View` or `render*`. Source detail remains explicit. The one-shot
   inspection footer states that references belong to the session. Zero-match
   organization and dependency inspections do not repeat that sentence, but
   `--help` and the CLI reference do. The recovery journey is reserved for the
   shell stage.
4. **Observations.** Batches are format version 1 and carry
   `session = view.projection.session` and `command` (validated as a positive safe
   integer), separate from the batch, record and event UUIDs. They remain
   self-contained. The rendered-output record equals stdout; the comparator and
   the CLI tests assert this. Source-escape event types match the baseline for all
   54 cases. The warning path for sink failure, terminal-control escaping of
   external text, and output exclusions for `_observations` and `_build` are
   unchanged, and their tests still pass. The session is closed in a `finally`
   after submission. The experimental schema bumps (`postcode-*-view/1`) and method bumps
   (`program-records@17`, `projection@7`, `dependency-projection@2`,
   `presentation@21`) are consistent with the changes. The CLI reference, README,
   architecture overview, conventions and STATUS no longer describe snapshot
   navigation, apart from historical and retirement notes.
5. **Comparison harness.** Apart from F1, the reference bijection is enforced in
   both directions, including for references first bound inside evidence records.
   Organization-evidence records are matched on all fields, and bindings are
   rolled back when a match fails. Ordering is relaxed only for `.containment` and
   `.organizationEvidence`. The `.containment` references left unbound are paired
   by position, but they appear nowhere else in the view, so the pairing carries
   no information. It could produce a false failure but not a false pass. The
   Unicode footer truncation removes only the trailing generated-command or
   session-note lines, which in every renderer come after all semantic content.
6. **Interruption experiment.** The experiment reproduces, and the record states
   its conclusion narrowly: native SIGINT ends the process during synchronous
   compiler work, and no view or observation is published. It does not establish
   returning to a prompt, safe continuation, or delivery of an interruption
   observation. The checkpoint claims none of these.

Minor implementation note: `recordId` removes the session namespace from keys
with a textual `replaceAll(session, 'session')` on the canonical key. That makes
derived-record digests independent of the session, which I checked is the intent.
The substitution could in principle map two distinct keys to one digest. The store
would then throw a collision error rather than silently merge records, and the
case needs repository text containing an exact generated session UUID, so I do not
treat it as a defect. A structural substitution would remove the concern if
stage 2 revisits identity.

### Unverified areas and residual limits

- I did not repeat the PostCode smoke checks or the profiler run, and I did not
  inspect human-facing output beyond the fixtures and tests.
- I did not measure memory. The validation record's RSS high-water mark rising
  from 411 to 856 MiB across three sequential sessions is not evidence either way
  about whether `close()` releases state. Stage 2's measurements should check it.
- Everything deferred by the handoff is outside this review: accumulation,
  growth-safe compact bindings, change detection and invalidation, the prompt
  lifecycle, failed-command and interruption observations, the ambiguity recovery
  journey, and latency and memory measurement.
- Running the verification CLIs and tests in the checkout wrote ordinary local
  observation batches under the ignored `_observations/` directory.

### Recommendation

The one-shot conversion checkpoint is sound enough to proceed to accumulation.
The runtime conversion preserves lens semantics, selection cardinality,
qualification, disclosure and observation contracts, within the fixture and test
coverage I reproduced. F1 is a narrow verification-harness correction. It does not
change this checkpoint's equivalence result, which I re-established with the
narrowed filter. It should be fixed before the harness is reused for later
equivalence claims. Stage 2 must also resolve how claim-context identity handles a
growing input basis. This recommendation does not constitute human acceptance of
the review gate.
