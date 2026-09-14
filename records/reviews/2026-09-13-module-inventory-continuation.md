# Module inventory continuation: disposition and rereview handoff

Date: 2026-09-13
Status: corrections verified; awaiting human-arranged Copilot rereview
Correction/review target: `15c1398ccfafd0cd094645d63a77cb3b618ee5f7`
Prior reviewed target: `8c1222953d1e0a09fc9bfdaa4839120cb82013a5`
Pull request: [#1](https://github.com/ronen/postcode/pull/1)
Task: [active continuation](../tasks/2026-09-13-module-inventory-review-continuation.md)
Predecessor: [completed initial task](../tasks/2026-09-12-initial-module-inventory.md)

Review against the [approved plan](../../docs/plans/initial-module-inventory-plan.md)
and its three linked accepted decisions. The prior completed record and all
historical review evidence remain unchanged. The continuation was opened and
committed as `4fdf1f7` before implementation, on the existing feature branch.

## Returned review and dispositions

Retrieved directly with paginated GitHub CLI API calls: one
[Copilot review](https://github.com/ronen/postcode/pull/1#pullrequestreview-5190982289),
five inline comments, and no PR conversation comments. Review state: `COMMENTED`;
summary: changes recommended. Copilot reports Balanced effort and 66/72 changed
files reviewed. Its suppressed comment repeats the second stale architecture
paragraph; it is covered by finding 5. Generic skill/MCP setup advice is outside
this continuation.

| Finding | Disposition in `15c1398` | Regression/verification |
| --- | --- | --- |
| [1. Primary entity claims](https://github.com/ronen/postcode/pull/1#discussion_r3999839452) | Module/symbol references require the corresponding claim discriminator and reciprocal subject before committing the batch. | Pending and existing targets; wrong type, foreign subject, export claim; atomic rejection and retained valid records. A separate case isolates an export claim with the correct reciprocal module subject. |
| [2. Implicit target exclusions](https://github.com/ronen/postcode/pull/1#discussion_r3999839463) | Removed name-based exclusions under the selected configuration. The CLI still supplies actual checkout observation/build destinations. | Legitimate `_build`/`_observations` sources under explicit `files` and glob `include`; edits change snapshot identity. Actual output, imported output, symlink targets and nested-configuration exclusion remain covered. |
| [3. Option-like selectors](https://github.com/ronen/postcode/pull/1#discussion_r3999839470) | `--` ends option parsing; all following arguments are literal positional values. Generated commands put options before the marker and selector after it. | Six option-like names, including `-h`, `--help` and `--`; zero/multiple selector errors; normal help; a generated command executed in a separate process. |
| [4. Attempt numbering](https://github.com/ronen/postcode/pull/1#discussion_r3999839478) | Included optional consistency cleanup: count root discovery evaluations. Expansion outcomes share the root ordinal. | Unexpanded, fully expanded and differently expanded attempts numbered 1/2/3; prior outcomes remain intact. |
| [5. Architecture status](https://github.com/ronen/postcode/pull/1#discussion_r3999839487) | Both stale gate statements now reference completed initial evidence and distinguish this active continuation. | Documentation links and task/status consistency reviewed. |

The first three findings correct defects within the approved contract. Finding 4
did not violate a stipulated consecutive-number requirement, but is now explicitly
documented as an ordinal. The record/discovery/evaluation/presentation method
versions were advanced for changed semantics. No general validator, selector
language, persistent session or dependency was introduced.

## Verification and evidence

- `npm test`: **57/57 passed**; `npm run check`: passed, on Node 22.13.1 and
  TypeScript 6.0.3. Four core regression cases failed on the prior implementation
  before the fixes. The full suite includes separate-process determinism, scoped
  selection, source boundaries, observation delivery/privacy and output exclusion.
- Refreshed PostCode self-analysis: 174 modules, 349 fully materialized evaluation
  records, exactly `["exports", "documentation"]` requested, and successful exact
  inspection using the generated command.
- Refreshed previously approved pinned p-queue analysis: seven modules, 15 full
  evaluation scopes, five listed/two collapsed, and all six entry exports.
- Refreshed eleven exceptional cases, including direct/alias source detail,
  zero/multiple selection, partial exports, documentation truncation and explicitly
  synthetic unavailable/failed/stopped outcomes.
- Full-branch whitespace, changed-document links, generated-output exclusions and
  preservation of the completed task/governing documents checked.

Private, ignored artifacts and a SHA-256 manifest are retained under
`_observations/validation/2026-09-13/continuation/`, including test/check logs,
JSON/Unicode inventories and inspection, source/exception samples and capture
drivers. Earlier approved samples are preserved. This local evidence is optional
for rereview; the repository does not depend on it.

The 15-file manifest was verified against all retained bytes. Its SHA-256 is
`28701c44391edb31867353af0e659e6a2d8e39552cc4a397ea1cfdbe2ba1f1ac`.
The representative self-analysis JSON SHA-256 is
`f6392459e3404782c1c0f8f71ae302f71ff2317ac68918ff9360da5068f75201`.

Expected output differences are new snapshot identities, the option-safe generated
inspection command and removal of falsely inferred output-location counts when
analyzing external configurations. The unique expansion list and per-module
qualification records remain intact. No presentation redesign is included.

## Rereview request and exit gate

Please have Copilot assess these corrections against its original findings,
especially primary-claim validation before mutation, preservation of legitimate
target inputs alongside exclusion of actual outputs, literal selector parsing and
generated commands, and attempt/context retention. Reproduce with `npm test` and
`npm run check`; the new regressions are in the existing record, discovery and CLI
test files. Subsequent handoff/task checkpoint commits are metadata only.

The human requests rereview and returns its result. This continuation remains
**active**: current tests and implementing-agent dispositions are not rereview
acceptance. Address remaining in-scope defects after the result is returned; close
only when no actionable findings remain or the human explicitly accepts residual
concerns. No rereview result or acceptance is claimed here.

The original clean-agent exercise was not repeated; it evaluated its original
view. No fresh external clone or p-queue runtime/build/test execution was performed.
Input capture remains first-observed rather than atomic, and exceptional provider
states remain synthetic. These unchanged limits are not new verification claims.
