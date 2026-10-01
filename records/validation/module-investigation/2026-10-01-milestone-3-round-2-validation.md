# Milestone 3 round-2 correction verification

Date: 2026-10-01
Correction: `2ca400a`
Review: [Round 2](../../reviews/module-investigation/2026-10-01-milestone-3-round-2-findings.md)

Both actionable findings were accepted. The accepted reference-transport decision
is indexed; its contents are unchanged. A deterministic regression crawls real
fixture evidence, following discovered references and available continuations,
and encodes full and bounded retained investigram context. It covers all nine
evidence-query kinds in 177 queries, bare support references, unavailable results,
accounts, corrections, revision notices, provenance and omitted context. It fails
if a canonical session/record identifier remains in encoded output. Reference
field discovery does not mirror the encoder's handwritten field list.

This fixture deliberately contains no literal canonical IDs in source or prose.
Existing structural tests separately require those literals to remain unchanged;
the new test is not a general ban on such content. Coverage remains representative
of fields populated by this fixture, not a proof of every optional record variant.
There is no new runtime scan, transformation, rejection or provider behavior.

Verification on Node 22.13.1 / TypeScript 6.0.3:

- `npm run build`: passed, including TypeScript checking.
- New regression in isolation: passed; 177 queries plus both context deliveries.
- `/usr/bin/caffeinate -i node --test _build/test/investigation.test.js _build/test/investigator-references.test.js _build/test/openai-investigator.test.js _build/test/chatgpt-investigator.test.js`: **75 passed**, zero failures, cancellations or skips; **43.666 seconds**. [Full output](2026-10-01-milestone-3-round-2-focused.tap.txt).
- `git diff --check`: passed for the corrections.
- The decision-index link resolves to the existing accepted record.

No full-suite rerun was needed for these test/documentation-only changes. The
reviewer independently reports **438/438 passing** at `bba3d7a`, with no failures,
cancellations or skips; that result is attributed to the reviewer, not this run.
Earlier failed-suite evidence and qualified timing diagnosis remain preserved.
No credential access, browser operation, live inference, model/configuration
change or rewriting of frozen assessment captures occurred. The diagnostic
allowance remains two used / eight remaining.
