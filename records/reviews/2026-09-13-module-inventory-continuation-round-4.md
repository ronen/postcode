# Module inventory continuation: fourth Copilot disposition and handoff

Date: 2026-09-13
Status: corrections verified; awaiting human-arranged Copilot rereview
Correction/review target: `92e4ed20bcef2af99181b7813ab6fb2910f3f82b`
Handle correction: `cc836cc`
Reviewed predecessor: `3a09a24a96f9c26039771202183b2e551e09a487`
Pull request: [#1](https://github.com/ronen/postcode/pull/1)
Task: [active continuation](../tasks/2026-09-13-module-inventory-review-continuation.md)
Previous handoff: [third Copilot dispositions](2026-09-13-module-inventory-continuation-round-3.md)

## Review and dispositions

Paginated GitHub CLI retrieval returned four reviews, eight inline comments overall
and no conversation comments. [Review 5191357243](https://github.com/ronen/postcode/pull/1#pullrequestreview-5191357243)
on `3a09a24` is `COMMENTED`, says “Needs a closer look”, and reports 70/76 files
reviewed at Balanced effort. It adds zero inline comments and two suppressed
findings labelled “Previously missed”. Both defects are accepted as within the
[approved plan](../../docs/plans/initial-module-inventory-plan.md) and its three
accepted decisions. Initial authorization was recorded in `78d80dd`.

| Finding in review summary | Correction and verification |
| --- | --- |
| `src/lib/projections.ts:29`: a generated handle can coincide with another module's compact ID, which takes precedence and hides the handle match. | Corrected at handle generation in `cc836cc`: normalized cues matching `module-` plus 8–64 lowercase hexadecimal characters receive `handle-`. Provenance and exact language names remain unchanged. A constructed collision checks basename, language-name and export cues; four repeated handles select four modules, while scoped IDs remain precise and unscoped exact names still work. Extended ID grammar and deterministic regeneration are covered. |
| `src/lib/typescript/project.ts:38`: redundant parsing duplicates configuration syntax diagnostics. | Corrected in `92e4ed2` by suppressing repeated diagnostic occurrences using file, start, length, category, code and message. Malformed root/inherited configurations still fail with one report per occurrence; equal messages in different files or positions remain visible. No broad message-only deduplication or change to the public diagnostic shape is introduced. |

The suggested removal of the additional parse was tried and rejected by regression
tests: TypeScript 6.0.3 omits root syntax errors from `parsed.errors`, although
inherited syntax errors appear there. Removing the callback accepted malformed
roots. The agent restored validation and paused for discussion. The human approved
preserving syntax validation with occurrence-based deduplication in follow-up
`77be33c`, before that implementation. This resolves the unforeseen issue; no
further disagreement or scope change remains.

Handle/discovery method versions advance to `module-handles@4` and
`typescript-modules@7`. Normalized handles in the reserved ID grammar change;
other handles, selector rules and view layout remain unchanged. Method changes
produce new snapshot IDs. Usage, conventions and architecture documentation explain
the resulting behavior. The completed predecessor and accepted governing material
remain unchanged.

## Verification and limits

- `npm test`: **64/64 passed**; `npm run check`: passed on Node 22.13.1 / TypeScript
  6.0.3. The initial collision and duplicate-diagnostic regressions failed before
  correction. The additional diagnostic test protects distinct source occurrences.
- Regenerated fixture JSON/Unicode shows `handle-module-deadbeef` and successful
  scoped handle inspection, with unique requested expansion kinds. Root and
  inherited malformed fixtures each return exit 2, no view/observation and one
  syntax-error report.
- The full passing suite left all 211 existing top-level checkout observation
  batches unchanged by name/content hash, added none and leaked no temporary test directories.
- Full-branch whitespace, changed-document links and evidence hashes checked.

Seven retained evidence files and their manifest are under the ignored
`_observations/validation/2026-09-13/continuation-round-4/`. Manifest SHA-256:
`c936a5a417f2d6cbe3183a550db14477479ac4e64ef32b15843627e001e3bb3b`.
This optional evidence is not a repository dependency. Real-project captures,
clean-agent exercises and human presentation review were not repeated this round.
Earlier evidence is preserved. Subsequent handoff/checkpoint commits are metadata.

## Next review gate

Have Copilot review both corrections, especially handle/ID separation across all
cue sources and preservation of legitimate distinct configuration diagnostics.
Run `npm test` and `npm run check` to reproduce automated verification.

The human arranges and returns the next review. The continuation remains **active**;
no rereview acceptance is claimed. Resolve returned in-scope defects and close only
when no actionable findings remain or the human explicitly accepts residual concerns.
