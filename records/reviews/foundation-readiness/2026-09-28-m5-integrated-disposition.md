Record type: disposition
Date: 2026-09-28
Task: [Foundation readiness](../../tasks/2026-09-27-foundation-readiness.md)
Handoff: [M5 integrated review](2026-09-28-m5-integrated-handoff.md)
Findings: [Round 1](2026-09-28-m5-integrated-round-1-findings.md)

# Foundation readiness M5 integrated review disposition

## Findings and dispositions

The returned findings and original handoff remain unchanged. No finding is
rejected. The human's disposition instructions and subsequent authorization to
investigate prefix fitting were recorded before the affected work.

| Finding or observation | Disposition and basis |
| --- | --- |
| F1: multiline scanner hints appear as literal `\u000a` text | Accepted and corrected in `1a8ee38`. Join scanner message LF characters with spaces before inline escaping. The ambiguous project-value hint becomes readable without introducing user-controlled line structure. Grammar, status 2, one-shot absence of observations and shell refusal recording remain unchanged. New one-shot and shell regressions fail on the reviewed implementation and pass with the correction. |
| O-a: literal `\u` plus four hex digits is indivisible even in raw prose | Accepted as the reported non-defect observation. The CLI reference now explicitly documents that literal escape spellings are also indivisible and can make truncation coarser while retaining exact original-code-point omission counts. No tokenization or truncation behavior was changed. |
| O-b: a combining mark following an escaped control renders on the escape's last digit | Acknowledged as the reported non-defect observation. The existing exact-spelling/combining policy remains; no correction was requested and no alternate representation was introduced. |
| O-c: adapter rejects edges outside the selected population | Acknowledged. Current callers construct/filter their own populations; the existing adapter contract test requires rejection of an unknown endpoint. No population policy or graph behavior is changed. |
| O-d: tab-indented source becomes visibly escaped | Acknowledged as the approved presentation@26 change. Existing terminal and source-evidence tests retain it; stored text is unchanged. |
| O-e: single-dash selectors require `--` | Acknowledged as the approved grammar. The restriction and literal-selector route remain documented and tested. |
| M3 O1/O2: per-directory case rules and mixed-filesystem lexical paths | Remain explicitly deferred by the human's prior direction. This review did not re-examine them; neither is represented as fixed or newly verified. The M3 disposition and backlog remain the governing task history for that deferral. |
| Reviewer did not regenerate the 72-case CLI comparisons or timing reports | Recorded as an independent-verification limit. The implementation-agent reports retain their actual targets and authorship. The F1 correction affects scanner error rendering; normal-view comparison results and measurements were not regenerated or relabeled as post-correction evidence. |
| Packages 1–5 and C01–C14/C16/C20/C22 were not re-audited beyond M4 touch points | Recorded as the reviewer's stated scope. The earlier accepted rounds and passing regressions remain evidence, but this round is not described as a new line-by-line audit of those packages. |
| Integrated ownership/publication invariants were not independently re-traced beyond M4 touch points | Recorded as a gate-relevant review limit. No additional independent review is claimed. The human must decide whether the accepted earlier rounds plus this review and local corrections satisfy M5, or whether another review is needed. |
| Dependency/license review covered only pinned versions | Recorded as an independent-review limit. The implementation-agent dependency/license assessment remains in the M4/M5 validation record; it was not independently repeated in this round. No dependency changed in these corrections. |
| Native verification covers only the same macOS/APFS/Node environment | Acknowledged. No other OS, filesystem or volume configuration is claimed. The existing approved native scope and filesystem deferrals remain explicit. |
| `fitText` binary-search monotonicity was only spot-checked | Investigated after explicit human authorization. Exhaustive prefix enumeration found no nonmonotonic predicate or fitting-result mismatch in 81,915 bounded whitespace/control cases and 6,000 deterministic Unicode cases. A smaller persistent regression test covers 5,115 exhaustive cases and 1,000 Unicode cases. No defect was confirmed; production layout code is unchanged. This is bounded evidence, not an exhaustive proof for every Unicode string and parameter combination. |
| Recommendation: sound for reviewed M4 scope; F1 can be locally verified; human decides gate | Acknowledged as authored. F1 has been locally corrected and verified. The additional authorized fitting investigation required no production change. This recommendation is not treated as human acceptance of M5. |

## Corrections and verification

Correction commit: `1a8ee38` (scanner diagnostic rendering, regression coverage
and O-a documentation). Investigation commit:
`c5077817a7440b4bec2ce65f31e5cfccce63fed6` (prefix regression and reproducible probe).
That is the resulting exact target if another review is requested under the
existing handoff; no new assignment is required.

- Before changing production code, both new ambiguous-value assertions failed
  on the reviewed implementation, explicitly showing the escaped line-break text.
- `npm run check` and `npm run build` pass after the correction and test additions.
- All eight command/layout tests pass. They check one-shot status/output and
  absent observations, shell refusal observations followed by successful use,
  readable inline-value advice, and continued escaping of tab, ESC and bidi
  controls in untrusted scanner values.
- The [prefix probe](../../validation/foundation-readiness/m5-fit-prefix-probe.mjs)
  and [result](../../validation/foundation-readiness/m5-fit-prefix-probe-result.json)
  retain the verified application build hash and both case counts. It enumerates
  legal prefixes and uses actual renderer results as the oracle instead of
  duplicating binary search. ASCII/control enumeration covers every length-0–6
  string over `a`, space, LF and tab, five widths and three height limits. Unicode
  sampling includes CJK, combining marks, ZWJ emoji, variation selectors, CR/LF,
  tabs, ESC, literal escape sequences, prefixes, indentation and narrow budgets.
  Both probes report zero nonmonotonic cases and zero result mismatches.
- `git diff --check` passes. `terminal-layout.ts` is unchanged from the reviewed
  target. Scanner diagnostics are invocation feedback rather than a qualified
  view; no analysis/presentation method or observation schema version is bumped.
- The reviewer independently passed all 294 tests and 288 session comparisons
  at `9f8c8bd`. Those checks were not rerun after this small error-rendering fix;
  post-correction evidence is the focused suite and authorized prefix probe above.

## Review rounds

Round 1 reviewed `9f8c8bd85e94428b11abb5b415e98cebb1f50901` under the original
M5 assignment. Its findings were committed in `1295c7d`. This disposition covers
F1, every named observation, each stated verification limit and the recommendation.
It does not rewrite the narrower scope actually reviewed into a broader claim.

## Gate conclusion

The clear in-scope correction and authorized uncertainty investigation are complete.
No new defect or scope expansion was introduced. Human direction is still required
on whether the accumulated review satisfies M5 or another round is needed. The task
remains active; it has not been accepted or closed on the agent's authority.
