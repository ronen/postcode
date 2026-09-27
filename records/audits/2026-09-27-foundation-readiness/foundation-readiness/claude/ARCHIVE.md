# Archive metadata

Archived: 2026-09-27
Original workspace: `_foundation-readiness-review-claude/`

[Report](REPORT.md) · [Collection index](../../README.md) · [File hashes and link-adjustment manifest](ARCHIVE-MANIFEST.json)

This directory preserves an exploratory audit and its selected supporting evidence. It is historical evidence, not an approved implementation plan or a review-gate acceptance. The authors' conclusions and claims of verification are preserved as written, including their limitations and any later-disputed assertions.

The report filename is standardized to `REPORT.md`. Markdown link destinations were mechanically rebased to archived evidence or repository files; authored prose, code blocks, scripts, results, and logs were not rewritten. Original and archived SHA-256 hashes and every link adjustment are recorded in the manifest. Repository-source links identify current file locations; the report's audited commit and retained baseline metadata establish the historical target. Original absolute paths in prose, scripts, and logs are provenance, not a dependency on that machine.

## Reproduction

Do not execute the archived probes in this directory: several write results relative to themselves or assume the original scratch layout. Restore retained files into their `original_path` locations in a disposable checkout of the reported baseline, using the manifest. Recreate builds, synthetic inputs, and exact package installations using the retained source, manifests/lockfiles, package metadata, and original reproduction instructions. Cross-audit graph probes may require restoring the library-reuse workspace too. Original reproduction commands are historical and may need local runtime/path adjustment; relocating these artifacts does not certify a fresh run.

No test, benchmark, dependency install, or archived probe was run during archival. The archived test logs and result JSON describe the original runs. Files not selected for the archive were left in the existing scratch workspace and may be disposed of separately. The separate library implementation brief, where present, remains an unapproved scratch proposal and is not part of this evidence collection.

## Omitted artifacts

The table records intentionally unarchived paths relative to the original workspace. A linked artifact omitted from this archive now links here rather than to an ephemeral location. Exact original link targets are also retained in `ARCHIVE-MANIFEST.json`. A retained metadata file nested within an omitted directory is listed individually in the manifest and is an explicit exception to that directory omission.

| Original path | Disposition |
| --- | --- |
| `build/` | Compiled output; rebuild from the recorded source baseline. |
| `layout-probe/node_modules/` | Installed dependencies; manifests/lockfiles are retained. |

## Unavailable references

No unresolved original local link targets were identified beyond the deliberately omitted artifacts above.
