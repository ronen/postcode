# Fifth output review sample

Status: awaiting explicit human output approval
Date: 2026-09-13
Implementation: `ecff418`
Task: [initial module inventory](../tasks/2026-09-12-initial-module-inventory.md)

The fourth review is preserved verbatim in
[the supplied findings](2026-09-13-unicode-fourth-findings.txt). The requested
scratch filename was `view-after-4-review.txt`; the supplied matching file was
`_work/2026-09-13-view-review-4-review.txt`, which remains untouched.
The review's positive assessment of the inventory is recorded without treating
its conditional acceptance language as approval of the presentation set.

## Dispositions

1. **Human-readable source detail.** Source items now use displayed module,
   export and documentation labels, with compact module IDs to distinguish
   duplicate handles. Export and symbol evidence is deduplicated within each
   item; contributing declaration/documentation spans remain separate. Unicode
   shows one-based line/UTF-16-column ranges with exclusive ends, and excerpts
   capped at four source lines and 300 Unicode characters per evidence span.
   Source wrapping uses `↪`; omitted source characters are counted. Module-level
   file associations are explicitly labeled and have no excerpt. Full claim keys
   remain in structured source items rather than dominating Unicode output.
2. **Evidence boundaries.** Ranges and excerpts are captured from already observed
   compiler input. Rendering never reads source files. Source disclosure remains
   opt-in and limited to displayed concepts; omitted exports and documentation
   do not gain source disclosure. File associations and declaration spans have
   distinct evidence keys even when a declaration occupies an entire file. The
   observation source-escape level now identifies locations and excerpts.
3. **Ordinary facets.** Homogeneous ordinary project-module headings suppress
   `implementation-available`. Inspection says `Selected project modules` and
   omits the redundant `project` facet. Facets remain visible in mixed or
   exceptional cases where they distinguish subjects, and remain in JSON.
4. **Documentation layout and omissions.** Prose and structured-tag text wrap to
   88-character display lines including indentation, without changing stored
   assertions or JSON excerpts. Inspection retains precise local assertion,
   character and tag omission notices and suppresses the ambiguous module-level
   documentation aggregate. Inventory retains aggregate omission counts. The
   truncation sample uses unmistakably synthetic numbered `TEST_SEGMENT` content.
5. **Zero selection and continuations.** Zero matches say `no exact match` and
   suggest choosing a handle or Entity ID from `modules`. Successful inspection
   offers another module and, when source detail is absent, `--source-detail`.
   Generated commands retain their shell-safe placeholder and snapshot scope.
6. **Qualifications and reference.** Successful/abnormal capability states,
   supported population, current enforced output exclusions and non-atomic input
   limitations remain visible. Inventory now says JSON lists all selected modules
   with bounded related detail. The [CLI reference](../../docs/cli-reference.md),
   usage, architecture and conventions describe the actual source expansion.

## Verification

All 48 automated tests and type checking pass. New checks cover conceptual source
labels, deduplicated merged declarations, known line/column ranges, file-only
associations, exact captured excerpts and omission counts, CRLF/UTF-16 positioning,
wrapping, excerpt bounds, absence of full claim keys in Unicode, and exclusion of
undisplayed exports from source detail. Existing independent-process determinism,
snapshot scoping, observations, source separation and abnormal-state checks pass.
The full branch whitespace check passes.

Self-analysis and the approved pinned p-queue recheck retain their populations and
export surfaces. Self-analysis has 174 modules, 18 listed and 156 collapsed, with
349 fully materialized evaluation scopes. P-queue has seven modules, five listed
and two collapsed, 15 fully materialized scopes, and all six entry exports in
precise-ID inspection. No new external repository was acquired or target code run.

Ten exceptional samples were regenerated and inspected: aliases/re-exports,
merged/overloaded declarations, zero/multiple matches, partial exports,
documentation truncation, explicit source detail, and synthetic unavailable,
failed and stopped export states. Synthetic provider cases remain clearly labeled;
they are not observations of production CLI failures.

## Retained local artifacts

All samples remain private, ignored artifacts under
`_observations/validation/2026-09-13/` in the PostCode checkout:

- `view-review-5.txt` and `view-review-5.json`: self inventory.
- `inspect-review-5.txt`: ordinary precise-ID inspection.
- `source-review-5.txt`: the source-detail case as a separate review file.
- `exceptions-review-5.txt` and `exceptions-review-5-cases.json`: ten exceptional
  cases, their descriptions, CLI commands where applicable, and exact output.
- `p-queue/unicode-review-5.txt`, `p-queue/unicode-review-5.json`, and
  `p-queue/inspect-review-5.json`: approved external recheck.
- `unicode-review-5-manifest.json`: hashes, sizes and snapshot references.

Self snapshot: `snapshot:789bbe738ad0b82b3518dff0b93a52bfc5594428e97196ed0692c77e82134110`.
External snapshot: `snapshot:5c82a4d2e73799c9953ab710038dea4c452e0f63ba171436e52af9b68f1df249`.

| Artifact | Lines | Bytes | SHA-256 |
| --- | --- | --- | --- |
| `view-review-5.txt` | 47 | 2280 | `a9d00819f97fa3b2c003fb6604e88f74d90bd993da6d2ba5f71f9052c47029bd` |
| `view-review-5.json` | 48309 | 2426485 | `78b922f1879cfe885eab89a87acf25f69e5c6dd41fd967f02828b794b7019c08` |
| `inspect-review-5.txt` | 34 | 1519 | `fdf8913012fcda46875cb3f5405e55a7f08dfc6ad67989815f74ad5f79987438` |
| `source-review-5.txt` | 97 | 4229 | `8982f18b758662c88a2bfccf55c23738a459c064b48ad8373ee88bab9f10c9a1` |
| `exceptions-review-5.txt` | 423 | 21839 | `fef8c58e016df3974caf99fcae105ee03b2fcd7a81eb7528ec10c919594c5301` |

Manifest SHA-256: `1d03fc9cc4c933a2a3fde493424bc2451e173bda1d0a670dee4c4eb06ca142bf`.

Capture and refresh drivers are retained beside the artifacts; run them from
`_build/` to resolve their imports. Earlier review samples remain intact. CLI
samples use normal local observation delivery; synthetic cases exercise the
provider/evaluation/projection/presentation path without claiming CLI batches.
No real-project observations or third-party repository content is committed.

Explicit human output approval remains required. The task is active, and final
integrated independent review remains on hold. No readiness or completion is
inferred from passing verification or the positive inventory assessment.
