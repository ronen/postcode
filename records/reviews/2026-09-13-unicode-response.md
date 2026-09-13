# Unicode review response: second presentation sample

Status: awaiting explicit human Unicode approval
Implementation commit: `43b6e6b`
Review input: [complete supplied findings](2026-09-13-unicode-findings.txt)
Task: [initial module inventory](../tasks/2026-09-12-initial-module-inventory.md)

The human rejected the previous 3,380-line Unicode inventory as insufficiently
usable and requested progressive disclosure. These changes address that review;
they do not constitute acceptance. The implementing agent will show the new output
for further human review and will not treat Unicode as ready without explicit
approval. Final integrated-review handoff remains on hold for that feedback.

## Disposition

1. **Project prominence and external collapse:** Unicode inventory lists
   project-associated modules. Other modules are collapsed with their exact count
   and a three-name preview. Their entries and export/documentation details are
   explicitly omitted from display. The lens population is unchanged; JSON lists
   the full selected inventory. Exceptional collapsed-module qualifications remain
   visible in the qualifications section.
2. **Compact entries:** each entry shows its handle, name or honest anonymity,
   facets, up to three exports with type/value roles, and omitted-export counts.
3. **Documentation disclosure:** detailed symbol documentation is omitted from
   inventory. The view discloses this policy, including counts for listed subjects;
   inspection exposes bounded assertions and their remaining omissions.
4. **Conceptual handles:** deterministic handles use established module names or
   declared export cues. Named default class/function exports can supply a cue;
   otherwise the fallback is a short anonymous handle. No snapshot-derived text
   appears in a handle. These are navigation aids, not synthesized responsibilities.
5. **Snapshot identity:** Unicode inventory displays snapshot context once and
   omits per-module full Entity IDs. JSON and detailed inspection retain full IDs.
   To preserve scoping, handle selection requires `--snapshot` from its inventory.
   Missing or mismatched context produces an explicit no-current-match result,
   including when the same handle text exists in the changed snapshot. Exact
   names are current lookups; full Entity IDs already encode their snapshot.
   The projection and observation request retain the supplied snapshot context.
6. **Provenance suppression:** ordinary direct/local/single-declaration details
   are suppressed. Aliases, re-exports, type-only forwarding, non-local origins,
   and multiple contributing declarations remain visible for displayed exports.
   Omitted exports remain counted rather than implied to be fully displayed.
7. **Shared qualifications:** derivation, population boundary, generated-output
   exclusion and filesystem limitations appear once. Differing local limitations
   and diagnostics stay associated with affected modules, including collapsed ones.
8. **Analysis versus display coverage:** the heading distinguishes found, listed,
   and collapsed module counts. Analysis outcomes retain materialization state;
   the qualified view records collapse separately from the domain selection.
9. **Assertion status:** inspection uses `doc [recorded assertion]` locally and
   one shared explanation that truth, currency and completeness are not established.
10. **Detailed inspection:** inspection retains exports, documentation, Entity IDs,
    exceptional relationships, qualifications, and opt-in source locations. It
    applies the same ordinary-provenance suppression. No source browsing, project
    purpose synthesis, dependencies, or inferred architecture was added.

Handle, discovery, record, projection and presentation method versions advance
for their changed semantics. The store remains ephemeral and no persistent
navigation session or cross-snapshot alias registry is introduced.

## Verification and review artifacts

All 39 tests and type checking pass. Added or extended checks cover external
collapse counts, hidden external documentation, differing collapsed qualifications,
snapshot context displayed once, no full inventory Entity IDs, ordinary provenance
suppression, exceptional aliases/forwarding/merged declarations, established empty
versus unresolved exports, detailed inspection, stale references, and equivalent
Unicode output from separate processes. The branch diff passes whitespace checks.

The new self-analysis inventory is retained locally as
`_observations/validation/2026-09-13/view-review-2.txt`; its JSON counterpart is
`view-review-2.json`, and `inspect-review-2.txt` demonstrates detailed inspection of
the presentation module using its new handle and explicit snapshot context.
All remain ignored and excluded from analysis. The reviewed earlier artifacts and
clean-agent inputs/responses remain intact. Those clean-agent responses evaluate
the original view, not this second sample.

The final self-analysis snapshot is
`snapshot:7ca033fe3d78486c386657e28275dab524f1c7002bffbdabb3ab1c468af12f04`.
JSON retains 174 modules and all 349 evaluation scopes are fully materialized.
Unicode has exactly 18 module entries and discloses 156 collapsed modules. The
inventory is 105 lines and 5,226 bytes, about 97% fewer bytes than `view-after.txt`.
The inspection sample is 2,182 bytes. These measured reductions support further
review; they do not prove usability acceptance.

SHA-256 identifiers:

- `view-review-2.txt`: `6951fec4862135e34d36deb947effaeb019ddf2463c2e8e46db1a05b6ba65972`
- `view-review-2.json`: `6fd37933717818f069ff9bda7912a0c8bd0855cf46db4ad8cd2a9487c46490b8`
- `inspect-review-2.txt`: `f7328855f2b6d888815f74b2356900127d788acd12e4d7acee9c011dc00f6503`

The local `unicode-review-2-manifest.json` records these and the repeated external
exercise artifacts. Its SHA-256 is
`768593d2ab28a03182c1b0fc518762e1d04c3ad07b703ae0a9b3db80603de913`.

The approved pinned p-queue checkout was also exercised again: JSON still includes
all seven modules, while Unicode lists five project modules and collapses two
external modules. Exact inspection using the new handle and snapshot retains all
six entry-module exports. All 15 evaluation scopes remain fully materialized.
New external artifacts are retained under the same local validation directory as
`p-queue/unicode-review-2.txt`, `p-queue/unicode-review-2.json`, and
`p-queue/inspect-review-2.json`. The
[original external validation record](../validation/2026-09-13-p-queue.md) retains
its earlier implementation and evidence context.

Human usability acceptance is pending. Further corrections may be required after
the human reads these samples; no final readiness or task completion is claimed.
