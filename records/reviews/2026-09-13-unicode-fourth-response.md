# Fourth Unicode output review sample

Status: awaiting explicit human output approval
Date: 2026-09-13
Implementation: `b59d2b1` (following `9628de5`)
Task: [initial module inventory](../tasks/2026-09-12-initial-module-inventory.md)

The human's third output review is preserved verbatim in
[the supplied findings](2026-09-13-unicode-third-findings.txt). The requested
scratch filename was `view-after-3-review.txt`; the matching supplied file was
`_work/2026-09-13-view-review-3-review.txt`. That original file is untouched.
This response supersedes the third sample for further human inspection, without
claiming acceptance. Earlier reviews and observation artifacts remain intact.

## Dispositions

1. **Epistemological status.** Successful views say that TypeScript analysis
   establishes module membership and effective exports. Zero-match inspection
   states only module membership. Partial or unavailable export information is
   explicitly qualified by capability states. Completion remains a separate
   execution statement; it is not an assertion of program correctness.
2. **Qualification scope.** Supported population, non-atomic input consistency,
   current enforced output-boundary counts, diagnostics and local limitations
   remain visible. Documentation epistemology appears where assertions are shown;
   relationship interpretation appears in inspections showing those relationships.
3. **Recognition and precision.** Mnemonics no longer receive a `module-` prefix
   or anonymous sequence suffix. Compact Entity IDs begin with `module-` and an
   eight-character digest prefix. Prefixes extend against the entire discovered
   population, including collapsed entries. The algorithm checks both sorted
   neighbours, deterministically distinguishes collisions, and rejects invalid
   full-key collisions instead of displaying duplicate IDs. The complete address
   is snapshot plus Entity ID; both are separate in structured views. Full internal
   record keys remain for references and backward-compatible exact selection.
4. **Bounded basename evidence.** Non-generic extensionless source basenames are
   preferred after actual language names and before representative exports.
   `index`, `main`, `entry` and `mod` fall back to exports or `anonymous`.
   `handleStatus` and `handleProvenance` retain the generated character and cue
   origin. Names stay null for ordinary anonymous source modules; no directory,
   extension, location or responsibility claim is introduced by the handle.
5. **Compact table.** Each ordinary inventory entry occupies one line with handle,
   compact ID and export names. The handle padding has a maximum of 30 characters;
   long handles remain intact and can exceed it. Roles and export provenance remain
   in inspection. `(none)` denotes established emptiness; a literal export `none`
   remains distinguishable. Local `+N` and aggregate omissions replace repeated
   total counts. Exceptional module qualifications remain attached below the row.
6. **Inspection headings.** Selection is expressed as zero, one or multiple modules
   selected from the population, with the exact referent. `Entity ID` labels the
   compact address; the short snapshot appears once at view level.
7. **Next command.** Shell-safe tokens are unquoted; sensitive tokens are escaped
   with POSIX shell quoting. The multiline command uses `MODULE_HANDLE`, the full
   snapshot, and the actual project configuration. It also accepts a compact ID
   in place of the placeholder. Arguments are quoted before assembling lines.
8. **Omissions.** Separate indented lines disclose collapsed modules/details,
   omitted exports and documentation coverage. Inspection does not misleadingly
   promise more detail from repeating an already bounded inspection. The external
   alphabetical preview remains omitted.
9. **Reference.** The [CLI reference](../../docs/cli-reference.md) now includes the
   first-use workflow, basename provenance, compact identity model and snapshot
   scope. It explicitly retains consequential qualifications in Unicode, with
   fuller context in JSON. Usage, conventions and architecture descriptions agree.
10. **Exceptional samples.** Ten captured cases cover re-export/alias provenance,
    merged declarations/overloads, zero and multiple matches, unresolved partial
    exports, documentation truncation, explicit source detail, and synthetic
    unavailable/deferred, failed and stopped export expansions. Synthetic cases
    pass through evaluation, projection and rendering and are clearly labeled;
    they are not claims of observed CLI production failures. The capture review
    caught and corrected zero-selection status and inspection omission guidance.

## Verification

All 46 automated tests and `npm run check` pass. Checks include intentional digest
prefix collisions and input-order determinism; independent CLI-process Unicode
and JSON determinism; duplicate basename handles; exact compact-ID selection and
missing scope; changed-input stale-reference rejection; long untruncated handles;
empty versus `none`; exceptional roles/provenance; source separation; truncation;
current output exclusions; and execution of a suggested command with spaces and
an apostrophe in the project path. The full branch whitespace check passes.

PostCode self-analysis retains 174 JSON modules and 349 fully materialized scopes.
Unicode lists 18 project modules and collapses 156 external modules. It discloses
28 omitted exports and documentation omissions for nine listed modules. The
extra omitted export versus sample three is the new compact-ID mapping function.
Both `cli` handles are intentionally retained; their adjacent IDs distinguish them.
The generated command selects the presentation module precisely and retains all
six of its exports plus its recorded documentation assertion.

The approved pinned p-queue checkout was rechecked: seven JSON modules, five listed
and two collapsed in Unicode, 15 fully materialized scopes, and all six entry
exports retained under compact-ID inspection. No new repository was acquired and
no target code was executed. Its original validation remains recorded in
[the p-queue exercise](../validation/2026-09-13-p-queue.md).

## Local review artifacts

Artifacts are retained under the ignored directory
`_observations/validation/2026-09-13/` in the PostCode checkout:

- `view-review-4.txt` and `view-review-4.json`: refreshed self inventory.
- `inspect-review-4.txt`: generated-command inspection of the presentation module.
- `exceptions-review-4.txt`: ten labeled exceptional inspection cases.
- `exceptions-review-4-cases.json`: case descriptions, commands where applicable,
  and exact rendered output.
- `p-queue/unicode-review-4.txt`, `p-queue/unicode-review-4.json`, and
  `p-queue/inspect-review-4.json`: approved external recheck.
- `unicode-review-4-manifest.json`: byte counts, SHA-256 hashes and snapshots.

The final inventory is 47 lines / 2,287 bytes; the ordinary inspection is 33 lines /
1,456 bytes. The exceptional collection is 392 lines / 23,859 bytes, including
explicit source locations and a deliberately long truncated assertion.

Self snapshot: `snapshot:c8ded06b31038f92e103066947f3326f04b1c1f75f95155f01ae394b3398f229`. External snapshot: `snapshot:ad46aba5e3b7a60c35926a43fa58350009b53e3e9f6735c9e47bc48797571974`.

| Artifact | SHA-256 |
| --- | --- |
| `view-review-4.txt` | `2c5ba2aabe7d7f00511d8b47441349323be4bfe8907995e766571ea7ed4cb94c` |
| `view-review-4.json` | `415449bb39dbe4899d8322782e0624b7042c2664548a06925b68333c2715b401` |
| `inspect-review-4.txt` | `f28751c36904878da8a367c8244b53c386fa57bc024c76edd73e7efd0d29539f` |
| `exceptions-review-4.txt` | `3fc77c5826f050de921a334d91cd1105360b567d57b4b7bea630b5f817d2c9b2` |

Manifest SHA-256: `b0b010b7192f4802e69b25234fe54d4bab9ba16552a3c826791cc9a680daccff`.

The fixture capture driver and refresh driver are retained locally with these
artifacts (they run from `_build/`, where their relative imports resolve). CLI cases use normal local observation delivery; synthetic provider
cases are renderer/evaluation validation and do not claim a CLI observation batch.
No real-project observation or third-party repository content is committed.

Human output approval remains outstanding. Earlier clean agents evaluated their
original input, not this sample. The final integrated independent-review handoff
remains on hold for explicit human output approval; the task remains active.
