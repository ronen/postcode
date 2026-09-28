Record type: disposition
Date: 2026-09-28
Task: [Foundation readiness](../../tasks/2026-09-27-foundation-readiness.md)
Handoff: [M3 acquisition and lifetime](2026-09-28-m3-acquisition-lifetime-handoff.md)
Findings: [Round 1](2026-09-28-m3-acquisition-lifetime-round-1-findings.md)

# Foundation readiness M3 acquisition/lifetime review: disposition

## Findings and dispositions

**F1 — accepted and corrected in full.** Operationally unresolvable ordinary
compiler candidates must not turn a project that previously opened into a project
opening failure merely because valid output boundaries are configured. The
correction distinguishes those candidates from explicit boundary failure. A failed
candidate remains absent to the compiler and has a retained resolution probe;
consistent absence can continue, and recovery requires restart. Unexpected defects
still propagate. The misleading configuration-file diagnostic disappears with this
incorrect refusal. Native cycle and permission-denied fixtures cover opening,
execution, stable replay and recovery through direct and both CLI paths.

**Case-insensitive missing suffix — accepted as a confirmed additional defect,
corrected under explicit human direction.** Before investigating, the implementing
agent asked about the reviewer’s uncertainty. The human authorized investigation
and correction within the existing policy; that response was committed in the
[task record](../../tasks/2026-09-27-foundation-readiness.md) before affected work.
Native APFS reproduction showed two aliases counted separately and alternate-case
candidates not excluded. The correction observes filesystem case handling without
writing probe files, applies it to containment/counting and retained-basis replay,
and preserves original path spellings. Compiler and repository checks cover the
boundary while missing and after materialization. No finding has been rejected or
materially qualified.

## Non-defect observations and verification limits

Every remaining observation is acknowledged separately; none is silently treated
as a request to expand the task.

| Reviewer observation | Disposition |
| --- | --- |
| Execution ownership traced end to end, including direct AbortSignal cleanup | Acknowledged. No ownership change is needed for F1. Existing distinctions among operation settlement, cleanup report and actual exit remain. |
| Qualification mappings match the decision | Acknowledged. Confirmed timeout stays unavailable, unconfirmed opening cleanup is a resource failure, later unverified basis invalidates, and interruption remains 130. |
| Publication follows the acceptance point | Acknowledged. Complete staged publication, no-overwrite link, owned cleanup and distinct accepted-with-warning outcome remain unchanged. |
| Configuration paths reached through directory symlinks group separately | Acknowledged as the specified normalized-absolute-path grouping. No conversion to real-path project identity is introduced. |
| Async propagation, retained serialization and ignored-ancestor lookup | Acknowledged. Existing async call sites and validation phases remain; current full-suite and comparison results are recorded below. |
| Hung Git incurs a deadline per validation phase | Acknowledged. The CLI reference now explicitly explains roughly two minutes across opening and three publication checks. No aggregate budget or skipped replay is introduced. |
| Large-input early Git failure may report EPIPE rather than exit 128 | Acknowledged as the reported pre-existing behavior. Both retain operational unavailable qualification; no new precedence policy is needed or introduced. |
| Parent termination outside SIGINT is outside the guarantee | Acknowledged. The CLI reference now explicitly states that SIGTERM/SIGKILL or other owner termination does not guarantee child cleanup. No new signal supervision is implemented. |
| Comparison/journey/profiler not rerun by reviewer | Acknowledged as independent-review scope, not a claim of failure. The implementing agent reran the relevant comparisons for this correction; earlier journey/profiler evidence stays attributed to the implementing agent. |
| No native Linux, Windows, network filesystem or unsupported-hard-link filesystem | Acknowledged. Existing native verification scope remains macOS/local APFS; injected failure handling does not certify those platforms. |
| No native never-settling worker termination or post-publication unlink failure | Acknowledged. Existing injected tests remain evidence of contract handling only, without asserting a native reproduction. |
| Failed-opening message-before-exit ordering reasoned about rather than stress tested | Acknowledged as a verification limit. This correction does not alter worker protocol or ordering; no additional native stress-test claim is made. |
| Compatibility with later investigation | Acknowledged. The correction introduces no investigator, scheduler, persistent session or descendant supervisor. |

The missing-suffix uncertainty is resolved by the native reproduction and correction
above. The remaining stated verification limits remain explicit. They do not
constitute human acceptance of M3 or authorize later milestones.

## Corrections and verification

Correction target: `43410a0c1066389e64df657f9a850f53b3c951d3`.

See the [round-1 correction verification](../../validation/foundation-readiness/2026-09-28-m3-round-1.md)
for method assessment, native fixtures, negative regression controls, comparison
provenance and remaining limits. Observed-input and repository-input methods advance
to version 5 for the changed acquisition policy; other methods and batch schema do
not change. Current descriptive architecture/conventions and CLI limits are updated.

The type check and all **280 tests** pass. All **72** version-aligned CLI comparisons
and **288** fresh/accumulating/reordered/retained session comparisons pass. The three
new regression cases fail as expected on the unmodified reviewed source, and the
corrected source passes them. The comparison builds are fingerprinted and checked
for mutation; no comparison suppression was introduced.

The correction affects opening and validation outcomes. Consistent with the reviewer’s
recommendation, a short further independent round is required under the existing
M3 handoff; the original handoff and returned findings are preserved unchanged.

## Review rounds

Round 1 reviewed `4656a34c0847c82d9f830a9d1587a2a28f2dd138`. Its findings were
committed by the reviewer in `9ca5987`. The implementing agent accepted F1, obtained
human direction on the case-insensitive uncertainty, and prepared the correction
identified above. No second-round recommendation is inferred from round 1.

## Gate conclusion

Further review is required. The human has not accepted the M3 gate. The task remains
active, and M4–M5 remain outstanding. No pending work has been deferred out of scope.
