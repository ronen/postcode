Record type: disposition

# Module investigation milestone 4: review disposition

Prepared: 2026-10-01
Status: accepted by the human on 2026-10-01
Task: [Module investigation](../../tasks/2026-09-29-module-investigation.md)
Handoff: [Milestone 4](2026-10-01-milestone-4-handoff.md)
Findings: [Round 1](2026-10-01-milestone-4-round-1-findings.md)
Reviewed target: `69c86d6125441ea151f3dd2dbbe95cfc870a25ab`
Correction: `c8780c0b048b576c2e7d450e48df12fb62d3bfbe`
Human direction: `bd00b66`

## Findings

| Finding | Disposition | Resolution |
| --- | --- | --- |
| F1 — continuation omitted from identity | Accepted and corrected | Mechanical associated-inspection projection identity now includes the supplied continuation, including invalid references; view identity follows it. Regression distinguishes two invalid references, preserves identity on repeat, checks failure status, and retains no-inference behavior. Presentation method advances to @8. |
| F2 — selection failure coverage | Accepted and covered | Offline regressions use the real CLI/worker path for a throwing selector and interruption while its identity reply is withheld. Both end the shell, terminate the worker, preserve earlier accepted usage exactly, add no attempt/call, publish no result and suppress subsequent queued commands. Separate FIFO probes put wrong-operation and wrong-selection-ID replies before a valid reply and verify the correct participant in provenance and usage. A late reply/message after closure cannot restart selection or publish. No runtime handshake change was needed. |
| F3 — unsupported subject and continuation wording | Accepted and corrected | Unsupported program references now explain that the requested lens needs an investigram reference. Unknown continuations explicitly say the supplied reference is not in that listing and explain how to start at its first page. Human-rendering assertions cover these messages; JSON status/selection behavior remains distinct. |
| F4 — controlled-case discriminating power | Accepted limitation; human accepts sufficiency for milestone 4 | The case strongly cues correction through conclusion-stating documentation, injected/unverified qualification and tiny source. It establishes end-to-end correction but cannot isolate spontaneous source-based noticing. No milestone-4 rerun is required. The approved plan now carries the human's bounded refinement of one already-planned milestone-5 case. |

F4 is a human-resolved assessment judgment, not a rejection of the finding or
unqualified evidence of investigator capability. The ordinary merge-anything
correction provides additional, source-checked evidence but remains one case.
Milestone-4 fixture, injected setup, frozen references, captures, assessments and
report remain byte-for-byte unchanged. This disposition supplements their limits.
Those captures remain attributable to their frozen presentation@7 implementation;
the corrected presentation@8 has offline verification only. Milestone 5 will freeze
its then-current implementation and revised assessment materials separately.

For milestone 5, the revised case must keep a small reviewable source and use
interface documentation without the conclusion under test. Its plausible mistaken
account must retain warranted evidence/provenance qualification without adding an
“unverified” cue solely to invite correction. Test origin remains truthful and
visible in views, observations and assessment records. The fixture, injected setup
and source-grounded reference must be frozen and identified before live assessment;
the existing protocol records what was actually delivered. This is one bounded
refinement, not a tuning loop or a measure of unbiased spontaneous error detection.
The case has not been created or run here; milestone 5 remains behind acceptance.

## Other observations and residual limits

The review's non-defect observations are accepted: exact shell grammar and lifetime,
allocate-once bindings, append-only retention, explicit association roles,
availability distinct from exposure, bounded whole qualification/omission,
structural navigation mapping, intentionally empty one-shot listings, qualified
upstream decompositions, and frozen-template checks. F1 corrects the identified
identity gap without changing those conclusions.

UTF-16 prose slicing can split a surrogate pair. This remains the review's disclosed
cosmetic limitation, alongside existing whole-journey presentation concerns. No
unrequested truncation redesign is included. Canonical IDs in association detail,
empty evidence labels, post-order/non-authoritative listing and the already-reported
source/configuration presentation limitations remain disclosed. Original/replacement
selection, derived warnings and inconsistency/correction display belong to milestone 5;
their absence is not reclassified as a milestone-4 defect.

The review independently reproduced the original 448-test suite and the capture
and navigation audits, and checked consequential numeric, merge, Cockatiel and FSM
claims against pinned source. These checks strengthen that evidence without proving
unexamined claims. The deeper documentation/test/type/logger/timer claims outside
its spot checks, upstream runtime behavior, confinement of assessment roles and
model-family/orchestration independence remain limited as reported. No live
selection-hook/provider integration or new live assessment was run for these fixes.
The new tests cover the previously unexercised offline selection failure/race paths;
they do not prove all possible scheduling or remote-service behavior.

The review's coincidental key-shaped substring in encrypted provider state is not
a credential; its scan and the earlier differently bounded supplementary scan are
not complete secret-detection proofs. Historical cancellation concerns and exact
capture whitespace/license records remain unchanged. No finding was rejected or
silently waived, and no new credential access, model/billing change, diagnostic
request or provider spending action occurred.

## Verification and gate

Build/type checking passed. The five targeted regressions passed during correction.
At `c8780c0`, the complete offline suite passed **452 tests, zero failures,
cancellations or skips**, 144.934 seconds (153.789 seconds including build). Node
22.13.1, a clean stationary checkout, command-scoped idle-sleep prevention and a
one-second monitor recorded maximum gap 1.003 seconds and no gaps over two seconds.
See [verification and complete output](../../validation/module-investigation/2026-10-01-milestone-4-round-1/README.md).

A Git comparison confirms the milestone-4 fixture and all pass-04 records are
unchanged from the reviewed target. No live request was made. Diagnostic allowance
remains two used/eight remaining. Authored-document links and diff checks passed.

The corrections are local and do not materially invalidate the reviewer's core
analysis: F1 adds a missing identity input, F3 changes wording, and F2 adds tests
without changing the handshake. F4's consequential choice is resolved explicitly
by the human. No additional independent review is judged necessary for these
corrections, although the human controls whether the accumulated review is sufficient.
The human acceptance below satisfies this review gate. The active task is not
closed and milestone 5 has not begun.

## Human acceptance — 2026-10-01

The human accepted milestone 4 in `8bd5c77` after the corrections and verification
recorded above. No additional review round is required for this milestone. The
assessment limitations and bounded milestone-5 refinement remain unchanged.
