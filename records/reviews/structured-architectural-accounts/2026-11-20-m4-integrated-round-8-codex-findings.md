Record type: findings
Received: 2026-11-20
Reviewer: Codex, independent review in a fresh session
Handoff: [Structured architectural accounts: final integrated review](2026-11-19-m4-integrated-handoff.md)
Round: 8
Reviewed target: `8a0551e29467aa13fc5b6fc6aebfa35973cb429a`
Prior findings: [round 7](2026-11-20-m4-integrated-round-7-claude-findings.md), identified for chronology only; its conclusions were not used as review evidence
Prior reviewed target: production `3ef4e20dec8899b7bbd2b75cc8262ff11791cada`; round 7 evidence target `54383a3`

# Structured architectural accounts: independent full implementation review

## Returned findings

Review scope was the complete implementation from `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1` to the reviewed target, not merely the changes since the preceding review. The current human instruction expressly requested an independent evaluation without relying on earlier reviews. I read the integrated handoff as the assignment and only the preceding findings' header for chronology, not its conclusions. No implementation, governing document, task status or task record was changed.

### Recommendation

**Changes are needed before accepting the final integrated gate.** Three reproducible P2 defects remain. They concern qualification preservation, usable hosted references and answer identity. None requires changing the adopted architecture or expanding the plan. The findings below are independent of the earlier review results.

### F1 — P2: preserve an offered option's narrower qualification in presentation

Location: `src/lib/contributions/answers.ts:251`; related presentation aggregation in `src/lib/interfaces/cli/contribution-presentation.ts:73`.

`arrangeContributionAnswer` exposes each follow-up option's meaning, operation and result contract but drops `option.qualification`. The alternative's qualification groups cover selected items, uses, bearer identifications, changes and inconsistency reports; they do not cover options. The CLI View's separate qualification groups also enumerate owners, items and uses only. An owner-wide limitation therefore survives while a consequential limitation attached specifically to the offered option disappears from the arranged answer and human-facing JSON summary.

I accepted an ordinary qualified prose answer with a supported `clarification` option on its exact content. Its owner had `OWNER_LIMIT`; the option had `OPTION_ONLY_LIMIT: valid only for the hypothetical deployment.` The selected Projection retained the option qualification. `arrangeContributionAnswer({ projection }, 'Review')` still offered `Investigate further`, but its entire serialized output contained no `OPTION_ONLY_LIMIT`. This is not a request for new CLI controls: an existing presentation already exposes the offer while losing part of its meaning.

Preserve the option-specific qualification alongside the exact offered option, with owner attribution kept distinct. Verify both direct arrangement and the human-facing JSON View, including exact re-presentation after subsequent history. Retention and invocation-time delivery already carry the field; preserving it only there does not qualify the displayed offer.

Basis: the accepted structured-explanation decision's qualified owner-specific follow-up contract and the binding requirement that narrower, consequential qualification survive presentation.

### F2 — P2: translate the references inside retained export-content bodies

Location: `src/lib/investigation/openai/contribution-protocol.ts:116–124`.

The contribution wire codec treats `body` as opaque unless `item()` supplies a type-specific conversion. It handles module identification, native findings on delivery, and state models, but has no branch for `module-exports`. Consequently a real retained export item reaches the hosted investigator with canonical IDs in `item.body.exports`, while the same references in `item.evidence` are compact handles. Including `exports` in the generic `referenceKeys` set does not fix this: generic traversal has already stopped at `body`.

I ran real export evaluation on `fixtures/exports/tsconfig.json`, acquired the `barrel` export association with content through a production, and passed the resulting delivery through `contributionProtocol.codec().message()`. `item.body.exports[0]` remained a `session:<uuid>:export:<digest>` ID; `item.evidence[0]` became an `r…` handle. Copying the export reference from the delivered body into `codec.tools({ requests: [{ kind: 'source', subject: reference }] })` produced `invalid-investigator-reference:session:…`. The normal decoder expressly rejects canonical spellings, so an agent cannot faithfully copy this supplied reference into a subsequent acquisition or evidence field. This can lead to unavailable tool responses or rejected submissions despite using supplied references.

Add typed conversion for `module-exports.body.exports` in the applicable directions, preserving literal reason/qualification text. Cover a real retained export delivery and a copy-back round trip, not just the native program-evidence envelope. Existing compact evidence handles provide a possible workaround; they do not make the unconverted references in the content body valid.

Basis: the retained exact-access and hosted reference-transport contracts, including the instruction to copy supplied handles exactly rather than construct or use canonical IDs.

### F3 — P2: normalize reference positions rather than replacing Session text throughout answer payloads

Location: `src/lib/contributions/answers.ts:114–117`.

The new contribution-answer key uses `JSON.stringify(payload).replaceAll(session, 'session')`. That rewrites ordinary strings in parameters, prose, qualification, option meaning and captured evidence as well as actual references. It is contrary to the explicit kind-aware identity rule and can collapse different valid literal inputs onto the same retained-record key.

I selected the same existing Query result twice through `selectContributionAnswer`, holding the Lens, subject, support and contract fixed and changing only `selection.parameters.literal` from the current full Session ID to the literal string `session`. The first selection succeeded. The second calculated the same ID for a different payload and threw **`Immutable record collision`** in `store.put`. This probe exercises the internal answer-construction contract; it does not claim that the current built-in CLI declares an arbitrary `literal` parameter. The helper accepts semantic string parameters, and neither its contract nor the governing identity rules reserve Session-shaped literal text.

Use an explicit semantic key with reference-aware normalization, preserving literal values verbatim. The neighboring inspection/native answer paths already have `answerSupportIdentity` for immutable reference support and captured status; review reuse of that policy rather than performing serialized string substitution. Add a collision regression with Session-shaped literal parameters and literal text in retained support.

A related probe found that two controlled equivalent contributions over the same export fixture, with identical normalized subject/item identities, received different answer keys solely when an unused output-exclusion directory was configured. This answer path hashes complete captured evidence/input payloads, whereas the neighboring support-identity helper explicitly excludes operational exclusion metadata from answer keys. Preserve that separation when correcting the semantic key; this observation is not a claim of persistent or globally interchangeable cross-Session IDs.

### Review method and coverage

- Read the approved plan, active task directions, relevant foundation/application and architectural rules, and accepted contribution, association/exposure, qualified-answer, structured-explanation and attempt/answer decisions.
- Inspected atomic contribution staging/validation and commit, native/common identity mapping, explicit association membership, standing/cause derivation, actual-delivery checkpointing and bounded dialog dispatch, reuse/fresh-attempt coordination, and exact selected-content/follow-up execution.
- Traced module/export, symbol/documentation/composition, organization and dependency producer entry points into common contributions, including independently discovered findings versus actual retained-input derivation. Reviewed native selections and their qualified presentation support.
- Reviewed immutable ownership/capture, Session disposal, fixed retained-answer resolution, direct/worker delivery and CLI arrangement. Compared the retirement inventory with current code/test routes and checked for stale compiled test files; none were present.
- Examined state-model acceptance, diagram fulfillment across alternatives and renderer data flow. Inspected the recorded memory comparison and its scope rather than treating previous review approvals as evidence.
- Wrote and ran focused offline probes using real fixture discovery, the actual ledger, answer selector/arranger and hosted codec. All three defect reproductions completed with the observed results above. These probes changed no implementation or committed tests.
- Independently read the private dialog-14 captures: current production instructions and hosted schema matched exactly; seven selected entries produced the three addressed item responses `note_k`, `note_r`, `note_b`; there was one hosted exchange and a submitted, accepted, non-failed result. No new inference was invoked.

### Verification

- Node 22.13.1; `npm run check` and `npm run build` passed.
- Full offline run: `node --test --test-concurrency=2 _build/test/*.test.js` completed in 501.14 seconds: **731 tests, 728 passed, 3 failed, no cancellations or skips**. The only failures were loopback sign-in setup cases in `chatgpt-auth.test.js` under the sandbox.
- Reran the complete authentication file with permitted local-loopback access: **20/20 passed**, zero failures, in 3.49 seconds. Thus every suite case passed in an applicable environment, but this was a full sandboxed run plus a targeted rerun, not one unrestricted 731-test run.
- Focused qualification-loss, literal-key-collision and real export-reference codec probes passed their assertions reproducing the defects. A separate controlled output-exclusion identity comparison reproduced the related identity observation.
- Private dialog-14 instruction/schema, selection/delivery-count and terminal-outcome checks passed without inference.
- No stale emitted test files were found; `git diff --check` passed. Tracked implementation and tests remained unchanged throughout verification.

### Non-defect observations and limits

The code distinguishes attempt reporting from selected answers, keeps exact historical support independently captured, and routes the migrated families through the common model. The reviewed ownership mechanism uses a lifetime-scoped weak registry rather than treating arbitrary frozen objects as trusted. The focused live capture is useful evidence for addressed duplicate-context delivery, not evidence for all content types or general architectural correctness.

Current `STATUS.md` still states that M3/M4 verification is offline, and the retirement inventory's limits still call M2 the only live evidence. Those descriptions lag the later M4 context-authoring and dialog-14 records. This is a documentation cleanup observation, not a fourth implementation blocker or a reason to rewrite historical review evidence.

I did not invoke live inference, independently establish the architectural truth of generated accounts, repeat the representative memory benchmark, or perform a new browser/image visual inspection of the SVG output. The memory and older live-trial measurements remain attributed implementation evidence. Offline passing checks do not negate the focused counterexamples above. The review does not authorize task closure, merge or implementation changes by this reviewing agent.
