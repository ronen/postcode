# Review alignment and consolidation

Updated: 2026-11-15. Exploratory notes, not an adopted decision or implementation authorization.

The [proposal](../structured-architectural-accounts-proposal.md) states the intended behavior and scope;
the [consolidation](../structured-architectural-accounts-consolidation.md) provides the ownership maps
and vocabulary. This note locates the resolutions from the independent pre-planning review and records
three previously missing authored checks. The review itself and historical discussion remain unchanged.
No product or governing files were changed by this alignment pass.

## Re-review follow-up

The re-review at `69df12f` confirms the earlier decisions and raises three application-boundary
consequences. **R1 is resolved:** a Lens returns its declared question/method's answer, with complete
applicable displacement, standing, reconsideration and qualified history available for application
presentation. Current-designation selection does not substitute different claims for a method-specific
answer. See the [inline agreement](../structured-architectural-accounts-proposal.md#lens-answer-and-standing).
**R2 is clarified:** when an investigation changes the earlier answer it is addressing, instruct it
to explicitly redesignate that result. This uses the existing result-target mechanism; it introduces
neither a duty to update every containing result nor a mechanical semantic gate. See the
[inline instruction](../structured-architectural-accounts-proposal.md#redesignation-instructions).
R3 (the exact meaning of a prior-result Subject) remains for discussion. The earlier resolution
table below records the first review, not a claim that all re-review questions are settled.

<a id="review-resolutions"></a>
## Review resolutions

| Review issue | Current resolution | Where to read it |
| --- | --- | --- |
| B1 — existing agentic capabilities | Migrate summarize, explain, decompose, examine, prose, prior-result follow-up and inspection/status access along with mechanical information. No permanent legacy correction/exposure regime. | [Agentic migration](../structured-architectural-accounts-proposal.md#existing-agentic-capability-migration) |
| B2 — mechanical findings and repeated production | Preserve the establishing method's guarantees separately from organizing judgments. Equivalent recomputation reuses existing identification without new association, invented exposure or automatic reassertion after displacement. Explicit re-adoption is a new organizing act. | [Common production](../structured-architectural-accounts-proposal.md#mechanical-and-interpreted-contributions), [unification probe](unification/README.md) |
| B3 — selection, reuse and application access | Supply equally standing alternatives distinctly, without a host-invented priority. Captured answers are immutable; later information can create cause-specific concerns without forcing a new request. The application can access exact standing/provenance/cause information through raw or mapped records. | [Outer answer mapping](../structured-architectural-accounts-proposal.md#outer-answers-and-the-investigation-engine), [recognized reuse](../structured-architectural-accounts-proposal.md#recognized-request-reuse) |
| B4 — Query result versus Entity | Keep separate concepts sharing identity/reference and association machinery. Entities concern the system under study; Query results organize answers to particular invocations. Keep redesignation. | [Reading conventions and identity](../structured-architectural-accounts-proposal.md#reading-conventions) |
| B5 — migration scope/checkpoints | Full migration stays in scope. Test the common boundary first, then an early real vertical slice before remaining migration; milestones provide human review checkpoints. A usable mixed intermediate product or compatibility layer is not required. | [Migration scope](../structured-architectural-accounts-proposal.md#agreed-implementation-scope-existing-mechanical-information-staged) |
| B6 — first-delivery contracts | Baseline all standing identification associations for each subject Entity; keep alternatives, qualification and empty coverage explicit. Discovery through explicit referents is in scope. Exposure follows each producing investigram's actual inputs, not a shared invocation. | [Baseline](check-baseline.py), [referent probe below](#referent-discovery), [exposure](../structured-architectural-accounts-consolidation.md#exposure-and-result-membership) |
| D1 — governing departures | Include explicit adoption/supersession mappings. Inconsistency reporting uses exact claims/uses and the same acquisition-instruction boundary as other operations; no special prior-delivery gate. | [Inconsistency agreement](../structured-architectural-accounts-proposal.md#unresolved-inconsistency-reports), [probe below](#precise-inconsistencies) |
| D2 — diagrams and Presentations | Use existing result/Presentation compatibility contracts. One real state-diagram contract and renderer are required; investigator-authored illustrations reference content instead of duplicating architectural meaning. | [Catalogue responsibilities](../structured-architectural-accounts-consolidation.md#catalogue-responsibilities-and-diagrams) |
| D3 — eligibility and role vocabulary | Existing Lens subject signatures remain. Identification requires a readable name/designation and distinguishing information; topical keys can be investigator-chosen. Concept-based relevance and soft signatures are deferred candidates, not automatic enable/disable rules. | [Association vocabulary](../structured-architectural-accounts-consolidation.md#baseline-initial-context-and-association-vocabulary) |
| D4 — validation and timing | Controlled dialogs cover mechanism branches; focused live trials test instructions and real integration without golden agent output. Relevant updates received before submission inform the producing investigation. | [Instruction inventory](../structured-architectural-accounts-proposal.md#agent-instructions-and-focused-live-trials), [timing probe below](#production-updates) |
| D5 — acquisition policy | Mechanically enforce well-formed data and faithful delivery. Instruct agents on semantic acquisition obligations; defer additional semantic gates unless practical evidence warrants them. Dialog repair is permitted. | [Acquisition guidance](../structured-architectural-accounts-proposal.md#displacement-acquisition-guidance) |
| D6–D7 — consistency and self-containment | Remove stale pending-decision/coverage text, define standing/designation/guidance and fixture evaluation terminology, distinguish engine captures from Projections, and state migration alternatives/rationale. Preserve the historical discussion separately. | [Reading conventions](../structured-architectural-accounts-proposal.md#reading-conventions), [ownership maps](../structured-architectural-accounts-consolidation.md#three-ownership-maps) |
| Optional: investigrams organized as trees | Remove nesting from first delivery; defer investigram organization until needed. Entity organization is a separate future exploration, without removing existing mechanical organization migration. | [Organization boundary](../structured-architectural-accounts-consolidation.md#investigram-organization--deferred) |
| Optional: pictures, options and addition warnings | Keep illustrations for explanations through words and pictures; execute retained follow-up options in scope; retain scoped addition warnings rather than hide possible limitations before observing their usefulness. | [Follow-up execution](../structured-architectural-accounts-consolidation.md#retained-follow-up-execution-in-scope), [addition rationale](../structured-architectural-accounts-proposal.md) |

No identified design question is deliberately left to be decided implicitly during drafting. A new
review can still find conflicts. Drafting remains substantive work: exact decision supersession
mappings, governing revisions, milestones/observable acceptance criteria, backlog entries and the
necessary self-contained context from these notes. It must not silently promote local fixture
restrictions into architectural requirements.

Detailed schemas, API/tool shape, indexes, pagination and execution scheduling are implementation
choices within the agreed meaning, coverage and qualification guarantees. The fixture's same-target
supersession restriction can be implemented through withdrawal plus addition; any proposed broader
operation must preserve exact target meaning and displacement effects, not introduce implicit copying.

Explicit deferrals remain: reassessment/clearance and automatic scheduling; targeted suppression or
investigator-directed propagation; declared semantic dependencies; user objections; declaration
challenge/reinstatement; automatic identity merging, aliasing or entity supersession; relevance
ontologies/soft signatures; investigram and new Entity organization; persistence and broader UI.
Interaction/composition are later concept probes, not additional required first-delivery capabilities.
Provider suppression policy is also deferred; equivalent recomputation already does **not** reassert
associations automatically under the agreed reuse rule.

<a id="production-updates"></a>
## Updates received during production

The checker starts with a delivered Half-open identification, then accepts the authored expanded
identification. Production can continue across that change. The outputs retain both deliveries.

| Case | Result for this change |
| --- | --- |
| Old identification, then the full qualified supersession and its identifying content, before submission | No reconsideration cause on the still-producing investigation solely from this change. |
| Old identification again, now with the qualified change notice but without replacement members | The original exposure still creates a cause. |
| Update accepted in the store but not delivered | The cause remains. |
| Earlier affected producer's result, followed by substantive update | Same timing rule for inherited concern; the historical producer remains flagged. |
| Two producers accepted together, only one receiving the update | Only the uninformed producer retains that cause. |
| A contribution completed before the change | Later deliveries to another investigation do not clear it. |
| Another independent change occurs afterward | It creates its own cause normally; the earlier received update does not suppress it. |
| Inventory refreshed without reading the newly added content | A matching addition still affects the earlier acquired scope. |
| Added content and its qualified declaration actually delivered before submission | The matching addition alone does not flag that production. |
| Withdrawal and its qualified reason delivered before submission | This supplies the update; there are no replacement members to acquire. |

`received_update()` in the bounded model recognizes a **sufficient full-delivery case**: the exact
change declaration, including qualified reason, and all its declared members arrive before submission.
The records may span multiple acquisitions. It does not infer adequacy from a bare entity ID, mention,
reference or timestamp, erase earlier input, or accept an investigator's claimed exemption. It does
not determine semantic sufficiency for arbitrary partial excerpts. Defining supported delivery shapes
is implementation work within the agreed behavior; these probes do not impose a universal full-payload
rule or silently defer the production-update requirement.

Association standing and exact result membership do not change. The check retains old membership
without substituting replacement members. It rejects fabricated/incomplete updated deliveries and
altered source qualification. Other existing tests continue to cover future delivery positions and
missing known-cause disclosure. No completed-contribution reassessment or clearance is implemented.

<a id="precise-inconsistencies"></a>
## Precise unresolved inconsistencies

The authored comparison reports the admission omission against the later waiting case. One report
targets the two exact content items; another targets their exact policy-description association uses.
This is a deliberately limited representation test, not an assertion that already recorded displacement
has disappeared or a live investigator's discovery of a new unresolved architectural conflict.

Optional investigram metadata carries a local report key, exact typed endpoints, explanation,
qualification and support. These fields preserve attributable qualified disagreement. They do not
constitute an addition/supersession/withdrawal operation, and no whole investigram is invalidated.

The checker verifies:

- Exact-target lookup finds the appropriate report; an unrelated identifying item in the same owner
  does not acquire that report merely through shared ownership.
- Qualified report delivery exposes the reporter, without delivering endpoint content by reference.
  A later change to the reporter's actual inputs reaches its reader; merely naming comparison
  endpoints does not create that path.
- Reporting leaves all earlier association standing unchanged.
- An instructed acquisition path records actual source delivery. A separate deliberately no-delivery
  structural control is accepted without inventing exposure or certifying that the investigator obeyed
  the semantic instruction.
- Missing/ambiguous endpoints, duplicate report keys/targets, missing grounds/qualification/support,
  and altered delivered qualification fail atomically.

The report shape and lookup methods are illustrative. The architectural requirement is exact,
qualified, attributable disagreement with discoverability, preserved standing and honest exposure.

<a id="referent-discovery"></a>
## Discovery through explicit referents

Half-open (S) discovers ADMISSION-1 through its explicit referents even though the admission association
targets Circuit Breaker (P). The lookup returns exact investigram handles and its coverage/retained-state
position. It does not supply content or association inventory, and records no source-content exposure.
A subsequent exact item request delivers the admission content with its original qualifications and
records that acquisition. An incidental prose mention is not a declared referent. Historical lookup
excludes later contributions; displaced associations do not erase their owner's explicit references.

This establishes discovery and acquisition as distinct capabilities. It does not introduce a new
subscription to future referent-list membership or a semantic-search/relevance mechanism. The bounded
lookup returns bare handles only; an implementation adding interpretive summaries must record the
corresponding actual content exposure. General declared dependencies remain deferred.

## Verification

Run `python3 notes/structured-account-example/check-review-alignment.py` from the worktree root.
Use `--write` to regenerate [the report](review-alignment-report.json). Both partitions run the same
scenarios and reject 44 malformed copies atomically. The checker-generated branches use the existing
qualified authored payloads; their exact construction is in [the checker](check-review-alignment.py).

The full [verification suite](README.md#verification) must also pass. These are bounded authored
simulations, not proof of product integration, semantic correctness, agent compliance, realistic
warning frequency or performance. The planning package still needs the specified controlled-dialog
and focused live-agent validation within the supported Session.
