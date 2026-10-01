# Milestone 3: authorized offline contract and validation diagnosis

Date: 2026-10-01. Authorization: `f315bb8`, following the human's approval of
contract clarification and bounded offline diagnosis, with consequential remedies
returned for approval before more live assessments. No provider request, real
credential operation, model change or billing change was performed in this work.

## Submission contract correction

The operation instructions now say that structured inconsistency targets must be
earlier investigrams in the same session. Documentation-versus-implementation
discrepancies belong in attributed prose and qualifications, with supplied
support. When no earlier investigram is targeted, the inconsistency array stays
empty. The provider tool schema describes the same boundary for both root and
nested accounts, and both routes receive it. Reference copying must remain exact.
The schema changes are descriptions only; no new provider constraint or tool is
introduced. Existing domain validation, atomic retention and no-retry policy are
unchanged. Provenance advances to investigation `@8` and both adapters `@4`.
Historical pass manifests/captures remain unchanged and cannot be rerun against
this new context without preparing a separately frozen pass.

Five new scripted real-domain tests exercise a supplied documentation assertion
and contradictory captured source: attributed prose is accepted with qualifications
and support intact; module/artifact inconsistency targets and mistyped evidence
or subject references are rejected atomically, with no extra exchange. Existing
coverage still accepts inconsistencies targeting prior investigrams. Transport
tests check that both routes send the clarified root/nested schema. Type checking
and build passed; the focused investigation/adapter run passed **65 tests**, zero
failures/cancellations, 35.753 seconds. [Output](offline-diagnosis-2026-10-01/contract-focused.tap.txt).
These deterministic results establish the contract, not live model compliance or
successful reconciliation of the assessment fixture. F1 remains open at that gate.

## Reference diagnosis

The [audit](offline-diagnosis-2026-10-01/reference-audit.json) compares every
structured submission reference with every reference spelling in the actual
provider inputs, including bare references as well as delivered records. This
narrows the earlier record-only diagnostic: the extra unmatched module spellings
in fsm-engine and merge-anything were supplied as references. They are not shown
to be fabricated merely because their full record bodies were absent.

| Case | Structured reference occurrences | Unique spellings | Spellings absent from all provider inputs |
| --- | ---: | ---: | --- |
| Focused entry | 25 | 16 | None; target-kind misuse is distinct |
| Cockatiel | 33 | 22 | One capture identity, one occurrence, two characters omitted |
| fsm-engine | 53 | 22 | One module identity repeated three times, two characters omitted |
| merge-anything | 32 | 28 | One symbol identity, one occurrence, two characters omitted |

References in these submissions are 114–129 characters long, including malformed
ones. Each malformed suffix has 62 characters rather than 64; repeated characters make
the precise deletion alignment non-unique. Cockatiel
also uses its correct capture identity elsewhere in the same submission. Exact
matching is working as designed; nearest matches in the audit are diagnostic
candidates only and were never accepted, repaired or resubmitted.

[Eight offline adapter replays](offline-diagnosis-2026-10-01/submission-replay.json)
feed the four captured argument payloads through both route parsers with stub
responses. Every returned submission matches the captured arguments exactly.
This supports locating the malformed spellings in the received model output,
rather than an adapter transformation. The replay synthesizes terminal output
from retained finalized items; it does not replay the original stream, all domain
lookups or inference. No claim is made that repairing one spelling would make the
whole draft acceptable or semantically correct.

The evidence shows a copying burden at the model-facing interface, without proving
that length alone caused the failures or that the model cannot copy exact IDs.
Pass 01's accepted accounts remain contrary evidence to any universal claim.
The newly explicit copying instruction is a clarification, not a demonstrated
reliability cure. Provider retries, fuzzy lookup and post-hoc repair would change
acceptance semantics and are not proposed.

## Proposed consequential remedy — not implemented

Introduce short, exact references privately at the investigator communication
boundary, while retaining canonical IDs in the domain, exposure ledger, worker
messages, accepted records and public CLI bindings. For example, a short token
could denote exactly one canonical reference already made available in that
dialogue. This is an interface adaptation, not a change to subject identity.

The implementation should preserve these boundaries:

- Bind tokens once, append-only within one dialogue; never reuse or rebind one.
  A new dialogue gets a distinct token namespace and fresh bindings. Unknown or
  foreign-dialogue tokens fail exactly, with no nearest
  matching or inference retry.
- Encode/decode only explicitly typed reference positions, including nested
  composition/corrections and tool requests. Do not rewrite source text, authored
  assertions or ordinary prose. A token appearing in prose acquires no special
  reference semantics; instructions should use descriptive names in prose.
- Register references visible in delivered structured context without treating a
  bare reference as delivery of its record. Decode before the existing domain
  validation; evidence eligibility, prior-target rules and citation accounting
  continue to use canonical references.
- Keep the original identity and session checks, acquisition/character bounds,
  cancellation, credential exclusions and usage attribution. Retain enough
  credential-safe wire/binding evidence to audit what each token denoted.
- Cover all reference-bearing record/response forms with deterministic round-trip,
  collision, unknown/foreign-dialogue, source/prose preservation, exposure,
  invalid-submission, cancellation and both-route regressions before live use.

The existing `EntityBindings` supplies public CLI bindings only for module, group
and investigram. Reusing its interface directly would omit symbols and evidence
and conflate a private dialogue representation with public session references.
Its append-only invariant is useful precedent, not authorization to broaden that
public API. The exact placement and traversal design need review during the
bounded implementation; if they require broader protocol redesign, return before
expanding scope.

Alternatives are retaining the now-clarified long references and reassessing, or
changing model. The former does not reduce the observed copying burden; the latter
would abandon the fixed human-selected assessment configuration and would not
isolate this interface issue. Short references are the recommended next experiment,
not a proven remedy. Human approval is required before implementation and another
live pass. A proposed new live pass would run the same three upstream subjects
and conflicting-documentation fixture once each, freezing the new context while
holding model, reasoning, source pins, effective configurations, TypeScript version
and source references fixed. No extra diagnostic, repair retry or tuning loop is
included; normal guards remain unchanged. Further gaps would return for disposition.

## Suite diagnosis and controlled rerun

The prior [failed suite](2026-10-01-milestone-3-round-1-validation.md) remains
**410 passed, 9 failed, 5 cancelled**, with a reported 4,251.442-second duration.
The original log's creation/modification interval is 2026-09-30 23:14:13 to
2026-10-01 00:25:43 UTC. A bounded read of the local macOS power log found
**21 Sleep/Wake/DarkWake events** in that interval. Only event timestamps/types
are retained in [power-events.json](offline-diagnosis-2026-10-01/power-events.json);
application/process details and unrelated events are excluded.

Before editing product code, the unchanged full suite ran at `f315bb8` (product
code identical to the failed `4a0a334` target) using `/usr/bin/caffeinate -i npm test`.
The idle-sleep assertion existed only for that command; no permanent power settings
changed. Test limits and validation rules were unchanged. A one-second diagnostic
timer measured scheduling gaps, and repository inputs remained stationary.
The result was **424 passed, 0 failed, 0 cancelled, 0 skipped**, **140.781 seconds**
by the test runner. The command including build took about 150 seconds; the largest
monitor interval was 1.075 seconds, with no interval above two seconds and no
power events in the run window. [Timing](offline-diagnosis-2026-10-01/unchanged-suite-timing.json)
and [complete output](offline-diagnosis-2026-10-01/unchanged-suite.tap.txt) are retained.

This is positive integrated verification of the unchanged product code, rather
than isolated passes substituted for a suite. The power-event correlation,
large historical durations and clean monitored rerun support a suspension-related
timing explanation. They do not prove the cause of each old assertion failure,
exclude load effects, or guarantee behavior through every suspension. No product,
Git deadline, test timeout or readiness-harness change is warranted by this bounded
evidence. The earlier readiness-race diagnosis is not reused as an explanation.
The old run stays failed/cancelled and remains visible for milestone review.

Final integrated verification at `db091cdac906ae5981b75062a75f211cc9c61a6b`
passed **429 tests, 0 failures, 0 cancellations, 0 skipped**, in **139.885 seconds**
by the runner (about 150.6 seconds including build). Inputs stayed clean and
stationary. The same temporary idle-sleep prevention was used; maximum monitor
interval was 1.002 seconds, with no interval above two seconds or recorded power
event in the window. [Final output](offline-diagnosis-2026-10-01/final-suite.tap.txt)
and [timing](offline-diagnosis-2026-10-01/final-suite-timing.json) are retained.
The retained audit/replay scripts reproduced their saved JSON results. This is a
passing integrated suite for the clarification, while the earlier failed run and
the limit on causal attribution remain disclosed.

## Reproduction and limits

From the repository root, build with `npm run build`. The retained diagnostic
scripts use only committed captures and stub credentials:

```sh
python3 records/validation/module-investigation/offline-diagnosis-2026-10-01/audit-references.py
node records/validation/module-investigation/offline-diagnosis-2026-10-01/replay-submissions.mjs
node records/validation/module-investigation/offline-diagnosis-2026-10-01/run-monitored-suite.mjs unique-run-label
```

The scripts write disposable output under `_investigation`; create that directory
if absent. The monitored run requires local callback permission and macOS
`caffeinate`; it makes no inference request. A unique label avoids overwriting
an earlier raw suite log. The reference audit does not establish full-record
exposure from string membership. The supplied/persisted provenance and normal
validator remain authoritative. This diagnosis is implementer verification, not
independent review, milestone acceptance or permission to proceed to milestone 4.
