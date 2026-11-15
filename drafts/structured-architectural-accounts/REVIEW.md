# Structured architectural accounts — draft review guide

This package is **in review**, not adopted and not implementation authorization. This file guides review only and is not promoted into `docs/`.

Start with [the plan](plans/structured-architectural-accounts.md), then read the four complete decisions:

1. [Common analysis contributions](decisions/common-analysis-contributions.md): identity, flat contributions, producer wrappers, outcomes and storage boundaries.
2. [Association organization and exposure](decisions/association-organization-and-exposure.md): uses of content, result designations, acquisition, timing, reconsideration and inconsistency.
3. [Qualified application answers](decisions/qualified-answers-over-contributions.md): outer/engine mapping, per-Lens migration, exact subjects, identity, fixed presentation and construction.
4. [Structured explanation](decisions/structured-architectural-explanation.md): content contracts, metadata, follow-up execution and the bounded state-diagram capability.

Review these against the complete replacement units in `core-concepts-revisions.md`, `architectural-constraints-revisions.md` and `app-specification-revisions.md`. `backlog-revisions.md` separates deferred capabilities. Capability/CLI revision files only disclose the planned transition; actual support documentation changes during implementation rather than claiming delivery at adoption.

The decisions carry the ownership distinctions, alternatives, scope and verification obligations inline. The plan's milestones put controlled producer coverage first, then a real mechanical/agentic/diagram slice, then complete migration and integrated review. Temporary migration gaps are recorded at checkpoints; final conformance is not optional. The real diagram is a bounded directed state-transition diagram, without a full statechart language or interaction/composition requirement.

## Supersession and preservation

Each predecessor revision file changes only its opening metadata; historical bodies and reasoning remain intact. The successor decisions carry backward mappings, while predecessor revisions add forward mappings. In particular:

- The old investigram definition follows structured-content → specialized-investigation → common-contributions.
- Old association/correction/exposure/dialog rules follow the live structured-content successor into the new coordinated decisions. The original records are not rewritten.
- Domain/storage and qualified construction follow their live research-question-driven-observation successors, preserving optional research capture. No mandatory export policy is restored.
- Exact retained-answer reporting already has its own research successor and remains there; only the four remaining exact-answer decisions move here.
- The existing construction record's answer/View/report identity decision remains accepted. Its referenced effective-input and retention definitions follow the new successors.
- Foundation, method guarantees, source/credential protections, Session lifetime, cancellation/publication and unaffected application contracts remain governing. No research evidence or current product-conformance claim is inferred from the exploratory design.

## Review focus

Check for lost governing obligations or accidental scope changes during consolidation, especially at the production/assembly boundary, per-producer exposure, provider recomputation after displacement, exact subjects versus current designated answers, partial fulfillment, and mechanical method-specific results. Check that delegated implementation details do not weaken those semantics.

The fidelity-review questions are resolved: withdrawal from a delivered current-only inventory triggers reconsideration even without delivery of the removed content, and across-submission content-to-association reachability is required. The bounded diagram notation is made concrete here for review. Fresh independent review has reopened contract clarifications, listed in the plan; ordinary reuse after an explicit fresh investigation is also marked locally for resolution before promotion. New semantic conflicts found during review or implementation require human resolution; observations about warning breadth or instruction usability do not implicitly authorize deferred mechanisms.

## Promotion boundary

Promotion requires explicit human approval. Set new plan/decision statuses and decision dates then; merge revision units into the latest canonical files, preserve complete supersession mappings, and update both indexes. Links in substantive files target their intended canonical destinations, so some do not resolve as ordinary paths inside this draft. Do not move this review guide into canonical documentation.

No foundation or development-process files are changed. The main-branch directory reorganization requires no merge for this package: canonical content does not depend on exploratory or steering documents. Reconcile intervening canonical changes at promotion. Supporting notes and fixtures remain untouched; cleanup needs separate human direction.

## Draft verification

Checked all 371 local links against intended canonical destinations and the draft's new/replacement units. All 18 backward headed supersession mappings have corresponding predecessor revisions and forward links. Confirmed no substantive package links depend on notes, steering or review scratch files. These are document checks, not implementation or live-agent verification; the plan specifies that later work.
