# CLI shell retirement — final integrated review: round 2 findings

Record type: findings
Received: 2026-11-26
Reviewer: Claude (Claude Code, `claude-opus-5-5`), the same reviewer as round 1, re-review requested by the human
Handoff: [Final integrated review](2026-11-25-integrated-retirement-handoff.md)
Round: 2
Reviewed target: `ae9f2ac` (code corrections `eb403a7`, `ebf656a` and `cacea3e`; evidence and disposition in `ae9f2ac`)
Prior findings: [Round 1](2026-11-25-integrated-retirement-round-1-findings.md)
Prior reviewed target: `3b1a5bc0d1fb9e4bfc943bd1d71eecdba1760edc`

## Returned findings

### Scope and method

I reviewed every source, test and script change in `75d28d7..ae9f2ac`, against my
round 1 findings and the human's 2026-11-26 task follow-up, which authorized a
bounded rendering extension for R2. I re-ran verification independently. I formed
these conclusions before reading the
[disposition](2026-11-25-integrated-retirement-disposition.md), and then checked
the disposition against them (see the last section).

I confirmed that the corrections change no lifecycle or contribution code: there
are no changes to `application/session.ts` or `src/lib/contributions/`. The last
commit, `ae9f2ac`, adds only records and evidence.

### Verification performed by the reviewer

All runs used Node 26.11.0.

- I removed `_build`, then ran `npm run check` (passed) and `npm run build` (passed).
- Full suite (`node --test --test-concurrency=2 _build/test/*.test.js`): **500/500
  passed**, with 0 failures, cancellations or skips. That includes the new
  submission-validation case.
- I ran the controlled capture twice with the documented fixture path. Both runs
  are byte-identical, with SHA-256 `3945ac6d…4054b6`, equal to the committed
  `after-review-round-1` capture. The regenerated `fresh-0-0` and `fresh-1-0` SVG
  and text equal the committed artifacts. The comparator reproduced the committed
  `comparison.json` exactly: 18 steps, five identified and qualified diagrams, and
  the unchanged alias-removal counts.
- I rendered `fresh-1-0.svg` with `rsvg-convert` on a white background and
  inspected it visually.

### Disposition of round 1 findings

- **R1 — Resolved.** The new `application-shutdown` case drives the
  submission-validation branch through `openApplication`. It asserts
  `SessionInvalidated`, `invalidated` work and termination, the retained usage
  report, no accepted producing invocation, no `contribution-projection` record,
  one participant close, and an idle `close()` that does not reject. It matches my
  round 1 probe.
- **R2 — Resolved within the human's authorization.** Both formats now carry:
  - the trial answer ID;
  - "Alternative j of N";
  - the exact designation and selected state-model item address;
  - when N > 1, the existing standing statement (equal standing, no preference,
    not reconciled).

  The SVG now includes entry, coverage, applicability and unsupported-content notes,
  plus an explicit pointer to the companion text for the full legend. In the
  capture, the two fresh alternatives are now distinguishable by designation and
  account address; before, their files were byte-identical. The context uses only
  supplied identifiers (`projection.id`, `alternative.designation`, `item.address`),
  and there is no new core capability. The unit test drives both formats from the
  same structured input: two alternatives with partial and unknown coverage, and
  distinct applicability, unsupported content and qualifications. It checks
  inclusion of each format's own content and exclusion of the other alternative's.
  The comparator derives the expected context and notes from the baseline's
  unchanged structured alternatives and notes. It still requires byte-identical
  picture markup and strict equality of everything else.
- **R3 — Resolved.** Wrapping now prefers spaces at 77 columns, which matches 13px
  monospace on the minimum 660-unit canvas, with wide characters counted as two
  cells. Every character is preserved (`xml:space="preserve"`). The minimum canvas
  width also rules out a non-advancing loop. In the rendered output, words such as
  "Interpretation" are intact and every line stays within the canvas.
- **R4 — Resolved.** The `operation` initiation variant and its purpose branch are
  gone, and the former test uses a normalized Lens request.
  `retainedAnswers[].reference` is removed from the type, the executor and the
  tests.

### New findings

**N1 — Test strength (nit).** In `test/contribution-answers.test.ts` (around lines
103 and 139), two assertions used to require that no diagram field contains the
Session ID. They protected the rule that bearer labels never fall back to raw IDs.
Because the trial record now legitimately includes precise IDs, the assertions were
narrowed to `diagram.notes` only. The `State bearer:` note still covers the label,
so the protection largely survives. The diagram title, state legend and the SVG
picture are no longer checked. A tighter form would assert that the text and SVG,
with the `Trial record` section removed, contain no Session ID. This does not block
the gate.

### Non-defect observations

- The comparator selects the account item by filtering on `states.length`, an
  approximation of `stateDiagramIncompatibility`. It fails closed: a mismatch would
  make the exact-text assertion fail, not pass. It is sufficient for the controlled
  fixture.
- The SVG picture labels transitions by mnemonic and trigger. Effects and guards
  remain in the companion text, which the SVG now references explicitly, as the
  human allowed.
- The JSON-form designation and address lines are raw but exact and traceable to
  the trial record. This is a presentation choice, not a disclosure gap.

### Unverified areas and residual limits

The round 1 limits still apply: no live model, credential or browser run; no clean
`npm ci`; no independent run of the trial runners beyond the suite's
`structured-trial` tests. I visually rendered one of the two new SVGs; the other
was checked by markup and byte equality.

### Recommendation

All four round 1 findings are resolved, and the R2 extension stays within the
human's authorization. I found no new correctness or disclosure defect; N1 is an
optional test-tightening nit. I recommend the human treat the final integrated
review gate as **sufficient**. This review does not authorize task closure or
merging.

### Check of the disposition against this re-review

The [disposition](2026-11-25-integrated-retirement-disposition.md) agrees with this
re-review on every point:

- R1, R3 and R4: each "accepted and corrected", as described.
- R2: the human-directed extension is implemented as authorized.
- Verification: its capture hash, byte-identical repeats and comparator behavior
  match what I reproduced. Its test count matches my full-suite run (see above).
- O1 and lifecycle: "no lifecycle implementation changed" matches the diff.

Two small notes:

1. The disposition does not mention that the two raw-ID assertions in
   `contribution-answers` were narrowed (N1). It is a test-only change and does not
   affect the disposition's conclusions.
2. The disposition describes round 1 as having "allowed implementing-agent
   verification of minor corrections". That applies to R1, R3 and R4. The R2
   extension was a material rendering change, which needed this further round. The
   disposition correctly leaves the corrected target open for further review, and
   this round supplies it.

The disposition correctly leaves the gate conclusion pending human confirmation.
