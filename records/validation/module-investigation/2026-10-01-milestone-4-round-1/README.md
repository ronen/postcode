# Milestone 4 round-1 correction verification

Correction target: `c8780c0b048b576c2e7d450e48df12fb62d3bfbe`
Node: 22.13.1
TypeScript: 6.0.3 (unchanged)

The [review disposition](../../../reviews/module-investigation/2026-10-01-milestone-4-disposition.md)
records all findings and the human's F4 decision.

- Build/type checking passed.
- [Targeted checks](focused.tap.txt): five tests passed during correction. These
  cover association identity and human wording, selector throw/interruption,
  stale operation and stale selection-ID replies. Final wording was subsequently
  simplified and verified by the complete suite below.
- [Complete offline suite](suite.tap.txt) at the correction commit: **452 passed,
  zero failed/cancelled/skipped**, 144.934 seconds; 153.789 seconds including build.
  [Timing record](suite.timing.json) confirms the same clean HEAD/worktree before
  and after, command-scoped `caffeinate -i`, 153 monitor ticks, maximum gap 1.003
  seconds and no gaps over two seconds. No timeout or validation rule was relaxed.

The F2 tests drive the real worker and production CLI. After an initial accepted
investigation, a throwing selector or a withheld second identity reply interrupted
by SIGINT ends the shell and terminates its worker. Earlier usage is unchanged;
there is no new attempt/call, result or prompt, and a queued usage command is not
executed. Late messages after closure do not restart work. Stale reply tests deliver
wrong-operation/wrong-selection-ID identities before a valid identity using FIFO
message order; retained provenance and usage identify the intended participant.
No timing sleep is used to infer that the stale message was ignored.

The F1 regression compares two unknown continuation references and a repeated one:
different references produce different projection/view identities, while the
repeat remains stable. Both invalid results remain failures and no additional
investigation occurs. F3 asserts actionable human wording while JSON retains its
structured status.

`git diff --quiet 69c86d6 -- fixtures/progressive-investigation-assessment
records/validation/module-investigation/pass-04` confirms the historical fixture,
setup, references and results are unchanged. Presentation method @8 describes the
correction; pass 04 remains attributable to its original frozen @7 implementation.
No live provider request, credential access, model/route change or provider-side
spending action was made. The diagnostic allowance remains two used/eight remaining.

Historical cancelled/failed suites remain as recorded. This complete successful
run does not prove the precise cause of every historical cancellation or all possible
worker/service races. Offline synthetic selection checks do not establish live
provider behavior, and no new semantic assessment is claimed for these corrections.
