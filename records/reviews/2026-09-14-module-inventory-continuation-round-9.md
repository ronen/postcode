# Module inventory continuation: ninth-round disposition and handoff

Date: 2026-09-14
Status: corrections verified; awaiting human-arranged Copilot rereview
Correction commit: `30145ad`
Reviewed predecessor: `8d4c094222adea94bb7dfc86636c24c94b10e07d`
Pull request: [#1](https://github.com/ronen/postcode/pull/1)
Task: [active continuation](../tasks/2026-09-13-module-inventory-review-continuation.md)
Previous handoff: [eighth round](2026-09-13-module-inventory-continuation-round-8.md)

## Review and dispositions

Paginated GitHub CLI retrieval returned ten reviews, fifteen inline comments
overall and no conversation comments. The latest [review 5192561111](https://github.com/ronen/postcode/pull/1#pullrequestreview-5192561111)
on `8d4c094` recommends changes, reports 76/82 files reviewed at Balanced effort,
and contains three new inline findings plus one previously missed suppressed
finding. All four are accepted within the approved initial plan and continuation.
Authorization was committed as `2fc876f` before implementation.

| Finding | Disposition |
| --- | --- |
| [Bidi formatting controls](https://github.com/ronen/postcode/pull/1#discussion_r4001143968) | Escape U+061C, U+200E/F, U+202A–E and U+2066–9 in terminal text. Command eligibility now uses the same inline escaping boundary, suppressing commands with affected paths. JSON and actual filesystem paths stay unchanged. |
| [Exponential forwarding paths](https://github.com/ronen/postcode/pull/1#discussion_r4001143982) | Visit each reachable module/exported-name state once per root, retain distinct declaration route steps, and propagate value reachability through non-type-only edges. Shared suffixes no longer expand into every complete path; cycles terminate. |
| [Stale STATUS count](https://github.com/ronen/postcode/pull/1#discussion_r4001143994) | Refresh the headline to 76 tests, the review date and eighth/ninth-round status. |
| Summary, `src/lib/typescript/inputs.ts:29`: repeated ancestor resolution per exclusion | Check lexical containment first, resolve the candidate once if needed, then compare against all real roots. Empty exclusions require no resolution. No new persistent resolution memo is introduced. |

Expansion and presentation methods advance to `typescript-expansions@2` and
`presentation@11`; these semantic changes intentionally affect snapshot identity.
The input optimization preserves exclusion and input-identity semantics, so its
method version is unchanged. No dependencies or governing decisions changed.

## Verification and limits

- `npm test`: **76/76 passed**; `npm run check` and whitespace checks passed.
- Four targeted regressions were run against predecessor implementations in a
  disposable copied build: all four failed as expected. The old eight-layer diamond
  produced 2,560 route steps; the corrected representation has 33. Missing-candidate
  resolution with twelve exclusions previously made 48 file checks, 48 directory
  checks and twelve realpath calls; it now matches the one-exclusion counts of
  four, four and one for the fixture.
- Diamond coverage checks deterministic evidence, dual-role preservation, a
  type-only root and a converging cyclic branch with a valid value route. Existing
  renamed-module traversal, cyclic forwarding and type-only regressions pass.
- Bidi tests cover every Unicode Bidi_Control code point in displayed data and
  command eligibility, unchanged JSON, diagnostics/warnings, and a real sink at
  a control-bearing path with escaped disclosure and exact stored output.
- Representative exports-fixture JSON and Unicode were refreshed: seven modules
  and unique requested expansions `["exports", "documentation"]`. Scratch output
  and test logs are under ignored `_work/round-9-validation/` and `_work/round-9-*.txt`;
  they are optional evidence, not repository dependencies.
- Temporary test projects and predecessor builds are removed in `finally`.
  Real-project captures, clean-agent exercises and human presentation review were
  not repeated. No wall-clock performance guarantee is claimed: route evidence is
  bounded by reachable states/edges per export root, and the compiler still performs
  its own analysis. No new global cap or partial-discovery policy was introduced.

## Next review gate

Review graph traversal and value reachability across converging, renamed and cyclic
routes; aligned bidi escaping/command omission; and single-resolution exclusion
checks. Reproduce with `npm test` and `npm run check`.

The continuation remains active. The human arranges and returns the next Copilot
review; no reviewer acceptance or task closure is claimed.
