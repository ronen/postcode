# Module investigation: domain execution review findings, round 3

Record type: findings
Received: 2026-09-29
Reviewer: Claude Opus 5.5 (Claude Code session arranged by the human; not the implementing agent)
Handoff: [2026-09-29-milestone-1-handoff.md](2026-09-29-milestone-1-handoff.md)
Round: 3
Reviewed target: `212fa9e82f58d41f3de6829ad84285e40305930b`
Prior findings: [Round 2](2026-09-29-milestone-1-round-2-findings.md)
Prior reviewed target: `32f90a504344352a12810be66e3b41547731909f`

## Returned findings

### Scope and method

I reviewed the round-2 corrections. The code diff reviewed was `32f90a5..212fa9e`,
which covers the following files:

- `evidence-delivery.ts` (new)
- `evidence-access.ts` (rewritten)
- the `execute.ts` tool validator, instructions and supplied-evidence accounting
- the `acceptance.ts` corrected-subject check
- `test/evidence-access.test.ts` (new) and changes to the investigation and
  session-input tests

I also read the round-2 sections of the
[disposition](2026-09-29-milestone-1-disposition.md). The working tree was at
`8f3a7c8`; `git diff 212fa9e..8f3a7c8` touches no `src/` or `test/` file.

I repeated the round-2 scale measurement using the same method as before: the
built production evidence boundary run over this repository's `tsconfig.json`
(258 modules, 93 project modules, 79 groups). This time I traversed every
continuation page, for every query kind, for every project module and group. I
did not commit the script.

### Checks performed

- `npm run check`: passed.
- `npm test`: 339 of 339 passed, with 0 failed and 0 cancelled. The 13
  `execution-ownership` cancellations seen in earlier rounds did not occur in this
  run. I did not investigate why; it remains the deferred backlog item.
- Full traversal of the real-repository sweep:

| Query | Result |
| --- | --- |
| `dependencies` | Largest page 54,665 units; at most 3 pages |
| `dependents` | Largest page 54,674 units; at most 7 pages |
| `membership` | Largest page 9,244 units; 1 page |
| `exports` | Largest page 54,820 units; at most 4 pages |
| `group` (all 79) | Largest page 54,819 units; at most 5 pages |
| `organization` | 4 pages, 190,177 units in total |
| `modules` | 40 pages, 1,871,220 units in total; 181 entries delivered with support references |
| `source` | Largest 61,300 units; 1 module exceeds the 60,000 bound (documented: no range retrieval) |

Across the relationship, membership, export and group queries:
- no page exceeded the 60,000-unit delivery bound;
- no entry was omitted;
- every traversal delivered all `page.total` entries.

### Status of round-2 findings

**R2-F1: corrected.** The key changes:

- **Scoped responses.** Responses are now seeded only from the selected claims.
  Each selected claim's own context, method and evidence is still delivered in
  full.
- **Evaluation summaries.** Evaluation-level state, reason, basis and global
  (configured-project or repository-scope) qualification arrive as separate
  summaries, instead of embedding the whole evaluation and every per-claim
  context.
- **Repository summaries.** Repository evidence is summarized rather than
  delivered as a full artifact census.
- **Continuations and group navigation.** Collections page through stable
  continuations tied to the original query. Organization lists groups, and the
  new `group` query exposes containment, members, artifacts and documentation.
- **Coverage records.** Outgoing dependency responses keep owner-specific
  non-edge requests and coverage.
- **Oversized entries.** An entry that would overflow a page alone falls back to
  source-support references it can `inspect`. If it still does not fit, it is
  explicitly omitted without blocking later entries. Status is `partial` whenever
  a page is continued, omitted or reference-only.

The growth regression in `test/evidence-access.test.ts:68-89` compares
a small fixture with a larger one. It directly guards against the defect
reappearing. My real-repository measurements confirm the fix: relationship
navigation, group documentation discovery and exports are now usable on this
repository. The architecture statement about narrower subjects is also accurate
now.

**R2-F2: corrected.** `correctedSubjects` is restricted to `module`, `symbol`,
`group` and `repository-artifact` (`acceptance.ts:73`), and the instructions name
these kinds.

### Actionable findings

**R3-F1 (low). A complete `modules` listing does not fit in one investigation at
realistic scale.** Every `modules` entry embeds its module claim context and full
own source-evidence support. On this repository, that gives about 8 project
modules per page, with 181 dependency or declaration modules falling back to
references. A complete traversal therefore costs:

- 40 sequential continuation pages, against the 32-exchange agent call guard;
- 1.87M units, against the 2,000,000-unit cumulative dialogue guard.

It cannot complete within one evaluation. Searching the listing for a module by
name is also costly, because there is no name lookup.

This does not block the milestone. Delegation navigation, groups and documentation
no longer depend on the full listing. Possible remedies:

- a lighter listing entry: the module and its naming claim, with support by
  reference, retrievable through `inspect`;
- a name or handle filter.

Alternatively, record the cost as a known limitation for milestone 3.

**R3-F2 (low; provenance granularity). Summarized records count as fully
supplied evidence.** `execute.ts:134-138` adds the following to
`suppliedEvidence`:

- evaluation-summary IDs;
- the IDs of summarized global qualification contexts;
- repository-summary IDs.

The investigator received only summaries of these records. Their evidence lists,
full diagnostics and artifact census were omitted. An investigram can then cite
the full record as supplied evidence, and provenance cannot tell summary delivery
from full delivery.

Summaries are substantive, so recording some exposure is reasonable. However,
source-support references are carefully treated as "not supplied evidence".
Recording summary delivery as a distinct form, for example a separate
`summarizedEvidence` set in provenance, would keep evidence attribution precise
for milestone 2 retention and milestone 5 audit views. Alternatively, document
that citing a summarized record's ID means citing its summary.

### Observations

- **`inspect` is not paged.** Inspecting a broad record, such as the global
  configured-project claim context or a claim whose context has hundreds of
  evidence items, still traverses all of its evidence. That can exceed the
  delivery bound and return an explicit unavailable response. Individual
  support references remain inspectable, which the merged-module test
  exercises. Since the result is explicit, I note it rather than raise it as a
  defect.
- **Continuations live in memory.** They are held by one `evidenceAccess`
  instance. Milestone 2 must keep one instance per session, or at least per
  evaluation, for cursors to remain valid. Otherwise they correctly report
  "Unknown continuation".

### Residual limits

- No hosted adapter, provider responses or live inference exist yet.
- The scale evidence comes from one real repository and the implementer's
  generated 163-module fixture.
- I did not rerun the execution-ownership baseline comparison.

### Recommendation for the milestone-1 gate

R2-F1 and R2-F2 are corrected and verified, including at realistic scale. The
earlier corrections remain intact. The remaining findings (R3-F1 and R3-F2) are
low severity. They can be corrected or dispositioned without a further
independent round.

I consider this checkpoint sufficient to proceed to milestone 2 once they are
dispositioned. The gate decision remains the human's.
