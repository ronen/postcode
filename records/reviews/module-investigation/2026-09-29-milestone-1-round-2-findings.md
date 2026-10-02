# Module investigation: domain execution review findings, round 2

Record type: findings
Received: 2026-09-29
Reviewer: Claude Opus 5.5 (Claude Code session arranged by the human; not the implementing agent)
Handoff: [2026-09-29-milestone-1-handoff.md](2026-09-29-milestone-1-handoff.md)
Round: 2
Reviewed target: `32f90a504344352a12810be66e3b41547731909f`
Prior findings: [Round 1](2026-09-29-milestone-1-round-1-findings.md)
Prior reviewed target: `d4260522c2abf0530de076c05944f531de003e4b`

## Returned findings

### Scope and method

I reviewed the corrections for round-1 findings F1–F7. The code diff reviewed was
`d426052..32f90a5` for `src/` and `test/`, covering correction commits `1de634a`,
`f5a974d` and `32f90a5`. The working tree was at `2388914`, and
`git diff 32f90a5..2388914` touches no `src/` or `test/` file. I also read the
[disposition](2026-09-29-milestone-1-disposition.md), the handoff addendum, the
updated [architecture account](../../../docs/architecture/investigation.md), and
the new backlog entry.

To judge the new evidence response bound against realistic scale, I ran the
production evidence-access boundary against this repository's own `tsconfig.json`
using the built code. That is 256 modules, 91 of them project modules. I did not
commit that script.

### Checks performed

- `npm run check`: passed.
- `npm test`: 318 passed, 0 failed, 13 cancelled (331 total). The cancelled tests
  are the same 13 `execution-ownership` tests, with the same pending-promise
  error, matching the disposition.
- `node --test _build/test/execution-ownership.test.js`: 13 of 13 passed.
- `node --test _build/test/investigation.test.js _build/test/session-inputs.test.js`:
  56 of 56 passed.
- Evidence response sizes, measured on this repository (next section).

### Status of round-1 findings

- **F1: corrected.** Corrections now require explicit, distinct `correctedSubjects`
  that are not investigrams (`acceptance.ts:69-74`). Replacements receive only
  those associations, qualified by the correction. The target stays in the
  correction record. Tests cover a clarification-then-examination chain, a
  subordinate target describing a different module, and invalid subject lists.
- **F2: corrected.** Anomalous or differing usage reports are retained with
  anomalies, and `reported` becomes null. Neither accepted nor failed outcomes are
  affected. Identical reports deduplicate, and distinct non-finite reports survive.
- **F3: the stated behavior is corrected, but see R2-F1.** An oversized response
  now becomes an explicit unavailable response. Withheld records are not counted
  as supplied evidence, and the dialogue continues. However, the measurements
  below show this bound now applies to almost every relationship query on a
  realistic project.
- **F4: corrected** as ruled. Delivered correction content cites its reporter,
  without granting account completeness. Withheld correction content does not
  cite.
- **F5: corrected.** Empty or whitespace-only excerpts do not cite.
- **F6: corrected.** Rejection reasons are asserted. The serializer boundary is
  named for the cycle case. Direct acceptance tests cover cyclic and shared
  nodes, and a same-unit identity cannot be a correction target.
- **F7: accepted with regression coverage.** This follows the human's ruling. The
  architecture account now states the conservative acquisition-basis meaning.

### Actionable findings

**R2-F1 (high; affects the milestone gate). Relationship queries embed
evaluation-wide context, so they are unusable at realistic scale.**

Per-subject evidence responses include whole-evaluation records and contexts
(`evidence-access.ts:90,103,115`):

- `evaluation.id`
- `evaluation.contexts`
- `evaluation.coverage`
- `organization.id` and `organization.contexts`

`response()` (`evidence-access.ts:39-58`) then chases each record's contexts and
evidence transitively.

Serialized sizes on this repository:

| Query | Size (code units) | Scope |
| --- | --- | --- |
| `dependencies` | 3.02M–3.10M | every project module |
| `dependents` | 3.04M–3.31M | every project module |
| `membership` | 3.18M | every project module |
| `modules` | 2.24M | whole project |
| `organization` | 4.15M | whole project |
| `exports` | over 60,000 | 26 of 91 modules |
| `source` | over 60,000 | 1 module |

Two breakdowns show where the size comes from:
- **`dependencies` for `graph`** has 4 selected edges, but the response carries
  1,266 claim contexts (2.06M), 752 source-evidence records (0.62M) and the
  complete dependency-evaluation record (0.34M).
- **`membership` for one module** carries 1,692 source-evidence records,
  1,102 claim contexts, 591 artifacts, the whole organization evaluation and the
  repository-evidence record.

**Consequence after `1de634a`:** every `dependencies`, `dependents`, `membership`,
`modules` and `organization` request on this project returns "unavailable". Before
`1de634a`, any one of them ended the whole evaluation with `limit-stop`. The
defect was therefore already present at the round-1 target. In round 1, I flagged
only large files and the population-wide `organization` listing, and missed the
per-module case.

In practice, an investigator on a real project cannot:
- follow delegation through qualified dependency claims;
- find dependents or organization membership;
- discover documentation artifacts at all, because `organization` is the only
  route to artifacts.

That leaves source (if under the bound), exports (in about 70% of modules) and
`inspect`. Milestone 1 requires "the full program-evidence interface", with
"navigation across modules and multiple layers of delegation". That is
demonstrated only on the five-file fixture. The architecture statement "the
investigator can request a narrower known subject" has no narrower subject
available: these per-module requests are already the narrowest. This would
surface immediately in the milestone-3 live assessment.

Suggested direction:
- Scope each response to the selected claims and their own contexts and evidence.
- Refer to evaluation-level records by identity, with their qualification
  summary (materialization, reason, coverage status), instead of embedding them
  and everything they reach.
- Give `organization` a bounded or navigable form, for example groups with
  artifact and documentation references, and member listing per group.
- Add a regression test that per-subject response size does not grow with
  project size, or run the evidence queries over a moderately sized fixture.

Qualification must survive this scoping. For each returned claim, its context,
method and coverage must stay attributable.

**R2-F2 (low). `correctedSubjects` accepts evidence records as "program subjects".**
The check reuses the `subject` reference rule (`acceptance.ts:44,71-73`), which
admits `claim`, `source-evidence` and `captured-content` records. A correction
could therefore create a `corrected-subject` association with a content capture
or a claim. The rejection message and instructions say "program subjects". Either
restrict to subject kinds (`module`, `symbol`, `group`, and `repository-artifact`
if intended), or document the broader meaning.

### Observations

- **Execution-ownership cancellations.** I reproduced the same 13 cancellations in
  the full run, and the file passes in isolation. I did not rerun the baseline
  comparison myself. The code under review does not touch that subsystem, so I do
  not consider the uncertainty material to milestone-1 domain behavior. However,
  the standard `npm test` command does not currently validate those 13 tests. The
  recorded deferral and qualified validation describe this accurately.
- **Handoff amended after review began.** The handoff received an addendum after
  round 1. `dev/review.md` says not to change a handoff after review begins. The
  addendum states it was added at the human's explicit request, and it leaves the
  original assignment intact. I note it only for process traceability.

### Residual limits

- No hosted adapter, provider responses or live inference exist yet.
- The size measurements come from one real repository (this one). Other projects
  will differ in magnitude, but the growth is structural: response size scales
  with evaluation size.

### Recommendation for the milestone-1 gate

The round-1 corrections are sound and verified. I do not recommend proceeding to
milestone 2 until R2-F1 is corrected. The alternative is for the human to
explicitly accept deferring it, knowing that the relationship and organization
evidence interface is unusable on realistically sized projects, and that this
would block meaningful milestone-3 assessment.

R2-F1 changes the evidence-response contract and its qualification-preservation
rules, so I recommend a further independent round for that correction. R2-F2 can
be corrected or dispositioned alongside it. The gate decision remains the human's.
