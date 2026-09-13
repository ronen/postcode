# Module inventory continuation: eighth-round disposition and handoff

Date: 2026-09-13
Status: requested regression and example verified; awaiting human-arranged rereview
Change commit: `fa8ecee`
Reviewed predecessor: `74ed1033ad9d3152f4b2560c3443e885ae3e81ee`
Pull request: [#1](https://github.com/ronen/postcode/pull/1)
Task: [active continuation](../tasks/2026-09-13-module-inventory-review-continuation.md)
Previous handoff: [seventh round](2026-09-13-module-inventory-continuation-round-7.md)

## Review disposition

GitHub CLI retrieval returned nine reviews, twelve inline comments overall and
no conversation comments. The latest [review 5192494945](https://github.com/ronen/postcode/pull/1#pullrequestreview-5192494945)
is COMMENTED, reports 75/81 files reviewed at Lite effort and includes one new
[selector-collision finding](https://github.com/ronen/postcode/pull/1#discussion_r4001073532).
Its summary calls the collision critical; the human reports a High label.

The reported scoped/unscoped difference is reproducible, but the defect and High
classification are disputed. An exporting `widget.ts` and an ambient module
named `widget` both genuinely receive the handle `widget`, from basename and
language name respectively. Scoped handle inspection therefore selects both;
unscoped exact-name inspection selects the ambient module. Each scoped Entity ID
still selects precisely its own module. Counts and identities remain visible.
The [approved plan](../../docs/plans/initial-module-inventory-plan.md) explicitly
supports duplicate handles and multiple exact matches. The name branch does not
add an unrelated non-handle match in this example.

The human authorized a regression and CLI example after this assessment; the
follow-up was committed as `4ab1486` before changes. `fa8ecee` adds both without
changing runtime behavior or method versions. Distinct selector namespaces or
unique handles are not adopted by this change.

## Verification and limits

- `npm test`: **74/74 passed**, including the new end-to-end regression.
- `npm run check`: passed. `git diff --check`: passed.
- The regression executes the actual generated shell command in a disposable
  checkout, checks the two-match Unicode count and both Entity IDs, and verifies
  exact recorded output. JSON checks confirm both scoped handle matches, the
  single unscoped name match and precise selection by each scoped Entity ID.
- The temporary checkout and its observation output are removed in `finally`.
  No runtime source, governing material or completed predecessor record changed.
- Real-project captures and human presentation exercises were not repeated;
  this change preserves existing selection and rendering behavior.

## Next review gate

Review the shared-handle regression and the CLI example against the approved
multiple-match contract. The continuation remains active for human-arranged
rereview; this handoff does not claim Copilot acceptance or close the task.
