# Shared application API — review package

Prepared 2026-11-08 against `e9e4965d98aa7ab8c9c69469ea768141afce5c94`.

This package is a draft, not an approved plan, accepted decision or implementation authorization. It changes no canonical governing document and contains no application-code changes. This guide is package-local review material; do not promote it over `docs/README.md`.

Read the [plan](plans/shared-application-api.md) for the implementation assessment, bounded work, contracts, milestones and validation; then review the [decision](decisions/shared-application-api.md) together with the [specification addition](app-specification-revisions.md) and [constraint additions](architectural-constraints-revisions.md).

The recommendation is to expose the existing complete selected qualified content through a small internal application boundary, move current CLI arrangement/rendering outside execution, and retain the private worker's lifecycle guarantees. Returning the existing bounded CLI View descriptors would require less restructuring, but would make future interfaces inherit their bounds and presentation choices or bypass the API.

The consequential choices remain open for discussion:

1. Qualified content, rather than bounded CLI Views, as the application result boundary.
2. One default worker-backed application facade, keeping lower-level direct Sessions private.
3. Existing static requirement/compatibility contracts separated from encoding, without a new Presentation framework.
4. Bounded extraction of provider/feedback services while preserving CLI recording and disclosure behavior.
5. Preservation of current CLI behavior, with internal API evolution allowed and no future feature required for completion.

The plan specifically addresses reference-binding schedules, associated-inspection composites, correction/association snapshots, retained failure versus current presentation outcomes, full operational attribution, authoritative parent usage, raw-support disclosure and publication checks. These are the main risks of moving the boundary.

Exploratory context consulted: [API, ACCOUNT, PRESENT, MINIGUI and AGENT entries](../../notes/upcoming-work.md), [connected account examples](../../notes/initial-journey/cockatiel-account-examples.md), [journey findings](../../notes/initial-journey/design-findings.md), and the [initial-journey guide](../../notes/initial-journey/README.md). These links are planning context only. Required rationale is carried into the plan/decision, which do not depend on the notes. The admission/trial/correction and ordered-composition examples motivate preserving scope, relationships and exact earlier answers; they are not claims that those future capabilities exist.

No core-concepts revision is recommended: existing meanings already express the necessary distinctions. No foundation, process, notes or backlog edits are included. The known navigation-origin and research basis-export limitations retain their existing scope. Descriptive architecture and implementation conventions should be updated during implementation after the resulting boundary is verified.

## Promotion checklist

- Obtain explicit human acceptance of consequential choices and approval of the plan; resolve local `[Needs review]` annotations and the pending decision date.
- Move the plan and decision to their intended `docs/plans/` and `docs/decisions/` filenames with the required canonical metadata.
- Incorporate the two additive revision units into the latest governing documents and update plan/decision indexes atomically. No predecessor supersession is proposed; verify this remains true after review and any intervening changes.
- Check incoming references to the unchanged responsibility and views/analysis sections. The additions preserve existing text/anchors; no historical-record rewrite is required by this proposal.
- Check canonical links in the promoted documents. Within this package, links to existing canonical material deliberately use their intended canonical paths and may not resolve relative to the draft directory.
- Remove this guide and promoted draft artifacts under human direction. Do not modify exploratory notes unless separately directed. Approval/promotion alone does not authorize implementation.

## Planning verification

The package was developed through source/test and document inspection, including current supersession chains for operational reporting and research capture. A local link check verified all 40 links across the five package files against their intended canonical destinations (or actual locations for this guide), including anchors. Staged whitespace checks passed. Self-review checked scope, coordinated decision/revision wording and preservation of existing semantics; the staged changes contain only this package. No independent review or runtime verification was performed during this planning-only task. Runtime verification is specified for implementation.
