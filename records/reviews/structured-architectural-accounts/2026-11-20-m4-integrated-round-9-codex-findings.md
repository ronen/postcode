Record type: findings
Received: 2026-11-20
Reviewer: Codex, returning independent reviewer for round 8 corrections
Handoff: [Structured architectural accounts: final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 9
Reviewed target: `cbd3c91722cdab21a35cac6bd05f2c47528fc09a`; corrected production implementation `25e9361b12580cd6440fcff38b6f7b44907a86fd`
Prior findings: [round 8](2026-11-20-m4-integrated-round-8-codex-findings.md)
Prior reviewed target: `8a0551e29467aa13fc5b6fc6aebfa35973cb429a`

# Structured architectural accounts: correction rereview

## Returned findings

**All three round 8 findings are resolved. No new actionable findings were found in the correction delta or the affected integration paths.** The corrected result is ready for human determination of review sufficiency; this report does not itself accept the gate, close the task or authorize a merge.

### Scope and method

Reviewed `032799b..cbd3c91722cdab21a35cac6bd05f2c47528fc09a`, including production correction `25e9361`, regression tests, method versions, documentation and the appended disposition. This is a correction rereview following the independent full review in round 8, not a second complete baseline-to-tip review.

Inspected each fix against the original counterexample and traced its use through answer support, CLI arrangement, hosted reference translation, retained-answer selection and historical status. Reused the original reviewer probes with assertions changed to require the correct behavior; these were run independently of the implementing agent's new regression cases. No implementation, tests, governing material, task record or task status was modified.

### Finding dispositions

**F1 — option qualification: resolved.** Each arranged option now carries an exact metadata-attributed qualification group. Its narrower statements remain separate from owner qualification and producing-context concerns. The same group is included in the alternative's qualifications, and CLI qualification pages include option metadata. Verified the original option-only limitation remains visible, plus the real-application regression for direct arrangement, rendered JSON, exact historical presentation after later work and detached presentation after Session close. The presentation method version advances appropriately.

**F2 — export references: resolved.** The codec explicitly translates `module-exports.body.exports` in both directions. In the original real-export probe, body and evidence now contain the same compact handle, and copying that body handle into a tool request decodes to the exact original export reference. The new regression also checks submission decoding and preservation of Session-shaped literal reason/qualification text. This change remains confined to typed reference positions and advances the wire protocol version; it introduces no acquisition or exposure.

**F3 — answer identity: resolved.** The serialized string replacement is removed. Literal selection parameters remain verbatim; immutable question, content, use and metadata references identify fixed information, while the shared support-identity policy includes the captured standing and cause state. Fulfillment and alternative-specific unmet requirements remain in the key. The original Session-ID-versus-`session` probe now produces two distinct answer IDs, and repeating the first selection returns the original retained object. The output-exclusion probe also now produces the same normalized answer key with distinct operational input captures still present in retained support. Inspected the immutable-owner assumptions and exercised historical selection, competing answers, withdrawal, failed fresh attempts, exact presentation and worker delivery. The contribution-projection method version advances appropriately.

**Documentation observation: resolved.** Current status and retirement coverage now identify the focused M4 live trials and their limited scope. The corrected codec is expressly recorded as offline-verified, without claiming that earlier live captures exercised wire version 11.

### Independent verification

- Node 22.13.1: `npm run check` and `npm run build` passed.
- **46/46 focused tests passed** in 56.23 seconds, with no failures, skips or cancellations: `contribution-answers`, `contribution-application`, `contribution-hosted`, `contribution-modules`, `application-exact-compatibility` and `method-provenance`.
- **40/40 additional integration tests passed** in 8.71 seconds, with no failures, skips or cancellations: `contribution-results`, `investigation-answer-outcomes`, `m3-agentic-cutover` and `immutable-capture`. Both test commands used `node --test --test-concurrency=2` over the respective emitted files.
- Original reviewer probes independently confirmed option qualification, export-reference round trips, distinct literal parameter identities, repeated-selection reuse and output-exclusion identity stability.
- Rebuilt source SHA-256: `9b716ef3a97fc8a39ec39ea1630096bdc39bf2119adaa5fbdcd8ac856bd3a637`, obtained using `buildIdentity("_build")` from `scripts/comparison-fixtures.mjs`.
- `git diff --check` passed; the tracked working tree was clean before adding this findings record.

The implementing agent's recorded 735/735 full-suite result remains attributed to that agent. I did not repeat the entire suite for this bounded correction rereview. The independently reproduced build digest agrees with its recorded corrected-target digest.

### Limits and gate recommendation

No live inference, representative memory benchmark or new SVG visual inspection was performed. The earlier live trials remain evidence at their recorded revisions, not new live validation of the corrected wire codec. The ownership representation and diagram renderer are unchanged by this delta. The full review's broader limits continue to apply.

No unresolved round 8 blocker remains. Human confirmation of integrated review sufficiency remains required under the active task and original handoff.
