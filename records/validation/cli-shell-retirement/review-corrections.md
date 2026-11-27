# CLI retirement review-correction verification

Date: 2026-11-26
Task: [Surgical CLI shell retirement](../../tasks/2026-11-25-cli-shell-retirement.md)
Review: [Integrated round 1 findings](../../reviews/cli-shell-retirement/2026-11-25-integrated-retirement-round-1-findings.md)
Correction source: `cacea3e8850f47c9e1976fcb4c09de5260fbaae5` (with R1 `eb403a7` and R4 `ebf656a`).

This is implementing-agent verification of R1–R4. The human authorized R2's
bounded rendering extension in the task follow-up. The original integrated evidence
and `after/` artifacts remain unchanged as the record of the reviewed target.
Reproduce that earlier result at its recorded commit; the current comparator checks
rendering method `@9` against the original baseline `@7`.

## Controlled preservation

Both new captures used **Node 26.11.0**, TypeScript 6.0.3, the same synthetic fixture
path `/private/tmp/postcode-cli-retirement-controlled`, and the original controlled
UUID and monotonic clock. They are byte-identical. The uncompressed new capture's
SHA-256 is `3945ac6d645e65b14bdc60b3a3f2b219a9b62cea392d480a62d54aab134054b6`.
The original baseline remains `7c8af4e41ced1590f3ac9be352aacb513cda7ccf5c6b0222b3f441c3ff53f919`.

The [new capture](after-review-round-1/capture.json.gz) and
[comparison result](after-review-round-1/comparison.json) retain all 18 steps.
The comparator permits only the checked differences below, then deep-compares the
complete result. No identity, runtime provenance, selected support, relationship,
qualification, ordering, state-model content, or usage normalization is applied.

| Location | Intentional difference from baseline |
| --- | --- |
| Application envelope and candidates | The already reviewed retirement changes: 17 `bindings`, 17 `answerReference`, 18 `referenceLifetime`, one `referenceNotice` removed; six candidate compact spellings replaced by their own precise ID. |
| Five standalone diagrams | Rendering method `@7` becomes `@9` (`@8` was the first disclosure correction). Text appends trial answer ID, alternative position/count and exact designation, exact selected account-item address, and the existing multiple-alternative standing statement, followed by that alternative's supplied qualifications. |
| Those SVGs | Add the same identity/standing and qualifications, existing entry/coverage/applicability/unsupported-content notes, and an explicit reference to the companion text with the same basename for the full legend. Wrap on spaces when possible at the 13px monospace width, with conservative allowance for wider characters; split only overlong tokens. Preserve every character and grow the canvas. |

The comparator independently derives the expected identity and disclosure from the
baseline's unchanged structured alternatives and account items. It checks exact
text, complete SVG footer text, distinct in-canvas line positions, and byte-identical
picture markup after restoring the old height. The graph's nodes, transitions,
entry, labels and styling are unchanged; the structured legends and notes are
unchanged. This comparison does not discard diagram fields.

R4 additionally removes `ResolutionInformation.retainedAnswers[].reference`, the
redundant compact-answer slot now identical to `id`. These captures have no nonempty
retained-answer refusal list; the two exact-compatibility refusal tests verify the
remaining `{ id }` shape. Candidate `reference` remains because it can preserve the
supplied precise spelling. The unused private operation variant of initiation was
removed; its former test now uses the actual normalized semantic Lens request.

Reproduction (Node must report exactly 26.11.0):

```sh
node --version
npm run check
npm run build
node scripts/structured-accounts/capture-retirement-baseline.mjs _verification/review-capture /private/tmp/postcode-cli-retirement-controlled
node scripts/structured-accounts/compare-retirement-capture.mjs records/validation/cli-shell-retirement/baseline/capture.json.gz _verification/review-capture/capture.json
node --test --test-concurrency=2 _build/test/*.test.js
```

## Standalone rendering verification

The same structured input drives both formats in `contribution-answers`:
two alternatives have distinct interpretation/owner/item limitations, applicability
and unsupported-content notes, partial state coverage and unknown transition
coverage. Assertions check each exact trial answer/designation/account address,
position/count, equal standing and unreconciled status, every diagram note, all own
qualifications, XML escaping, no other alternative's qualifications or notes, the
SVG's companion-text reference, and intact status-word wrapping. The structured
input is unchanged and repeated arrangement is identical. Single-alternative and
multiple-model cases retain their own bearers, identify one alternative without
claiming plurality, and preserve exact account selection.

The controlled capture's fresh result supplies two alternatives with partial state
and transition coverage. See [alternative 1 SVG](after-review-round-1/fresh-0-0.svg),
[alternative 1 text](after-review-round-1/fresh-0-0.txt),
[alternative 2 SVG](after-review-round-1/fresh-1-0.svg), and
[alternative 2 text](after-review-round-1/fresh-1-0.txt).
Both SVGs were rendered using `rsvg-convert` against a white inspection background
and visually inspected: identity, standing, notes and qualification remain readable
and within the canvas. The artifacts retain their original transparent background.
Their precise designation and account address distinguish the two files even when
the depicted state model is identical. The full legend remains in the matching text.

## Lifecycle coverage and checks

R1 restores the formerly host-owned submission-validation assertion directly through
`openApplication`: a controlled agent changes captured source, reports measured
usage and submits a valid contribution. The request rejects with `SessionInvalidated`,
work and attempt termination are `invalidated`, no producing invocation is accepted,
no answer projection is retained, usage survives, participant cleanup occurs once,
and idle close is clean. This supplements the original coverage map's input
invalidation row; its earlier pre/post-execution and tool-request tests did not
exercise submission validation before acceptance. No lifecycle implementation
changed in these corrections.

- Type checking and build passed.
- All 73 focused tests passed: contribution answers/state, actual trial runners,
  direct shutdown, work attribution and exact compatibility.
- All **500/500** full-suite tests passed on Node 26.11.0; no failures, skips or cancellations (115.3 seconds). Authentication tests used the local socket/process permissions they require.
- The 18-step baseline comparison passed and the independent capture repeat is
  byte-identical. Core content and graph markup remain exact.
- `git diff --check` passed.

The previously reviewed O1 result is unchanged: private publication deferral is gone;
`requestFinalized` remains for the directly tested reentrant completed-work callback.
The full suite includes that case and the accepted first-cause/finalization matrix.
No new core capability, analysis or general callback isolation was introduced.
No live model/credential/browser run was performed; the original cooperative
execution and opening-path residual limits remain.
