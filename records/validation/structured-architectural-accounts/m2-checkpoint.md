# M2 early vertical application

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Plan: [Structured architectural accounts](../../../docs/plans/structured-architectural-accounts.md#2-early-vertical-application)
Starting revision: `d1c34ddc938e834ec96018991643a48eafb5659a` (M1 disposition)
Implementation: `6f42db0`

## Scope reached

Milestone 2 integrates real producers, an agentic dialog, the state-behavior concept with a real diagram, and the application route, all on the M1 mechanism. The human found the M1 gate satisfied on 2026-11-16. Two follow-ups during M2 are recorded verbatim in the task record: the resolution of the secondary-standing question, and the approval of the live trials.

| Commit | Increment |
| --- | --- |
| `f72e2e0` | Module identification contributed through a Session-owned ledger paired with the record store; one common Entity per module |
| `a58c2c9` | Export findings contributed; the internal exports answer selects its naming and export finding from the ledger |
| `69ef0fc` | Agentic dialog over the ledger: initial context, acquisition, exact change notices, bounded repair and outcomes |
| `4d4c12c` | State-model content type, state-behavior concept guidance, state-diagram result contract and renderer |
| `0f571e7` | Application route: the `state-behavior` and `follow-up` Lenses, explicit fresh investigation, and a retained contribution answer |
| `5e81a83` | Hosted transport generic over typed dialog protocols; the contribution protocol over it |
| `ce03f16` | Delivery correction found by the measurement; measurement script and record; live-trial harness |
| `85f1b49`, `107e32f`, `6f42db0` | Corrections found by the live trials: adapter repair turn, exact submission shapes, complete submission schema, renderer loop and caption placement |

The [architecture account](../../../docs/architecture/contributions.md) describes each part as implemented.

## Plan requirements for M2

| Requirement | Status and evidence |
| --- | --- |
| Real module identification | Each module's identifying finding is contributed under the discovery method, and a separately attributed policy uses it. A module record and its Entity resolve to each other. Tests in `test/contribution-modules.test.ts`. |
| Exports needed for an export answer using retained module naming | The exports answer selects the discovery method's naming and the export method's finding from the ledger, and captures their standing. Mechanical claims and qualification are the provider's own records. |
| A read-only export assembly creates no production exposure | Verified: assembling and repeating the answer leaves every production's deliveries empty. |
| A producer consuming retained module information records it | Verified with a mechanical consumer and with dialogs. The baseline identification and the retained export finding are recorded deliveries of the consuming production. |
| Equivalent provider recomputation after displacement adds no associations | Verified for identification and exports after withdrawal; the method's own finding remains, with its standing. |
| Naming qualification and mechanical semantic content survive the wrapper | Verified; the finding carries the discovery Claim context, and a mechanical qualification can name only a Claim context of its own method. |
| Agentic state-dependent behavior, real diagram contract and renderer | Implemented. Prose does not fulfil the diagram contract, and each alternative is assessed separately. |
| Accepted partial outcomes and declarations | Verified: an accepted contribution with a reported inability keeps its declarations in effect and is reported unfulfilled. |
| A retained follow-up option executed through the application API | Verified deterministically and live. |
| Focused live trials and controlled dialogs across acquisition, retention, exact access and rendering | Controlled dialogs on real fixtures in `test/contribution-dialog.test.ts` and `test/contribution-application.test.ts`. Live trials in the [trial record](m2-trials/README.md). |
| Bounded accumulating-Session exercise against the baseline | [Measurement record](m2-measurement.md). |

## Obligations carried from M1

| Obligation | Status |
| --- | --- |
| Equal mechanical answers under reordered arrival | Verified for the exports answer. The structured answer, resolved content and both renderings are equal under the shared comparison policy whether independent contributions arrive before the findings, after them, or not at all. The remaining mechanical families are M3. |
| One Entity per module, no competing interpreted copy | Verified. |
| Qualification and reference integrity for program records | Verified; unresolved references are rejected, and a mechanical qualification context must be a Claim context of the producing method, checked by record kind and method. |
| Shared Session lifetime and invalidation | The ledger is created for and released with the Session's record store. Heap after Session close equals the baseline in the measurement. |
| No capability left on both regimes after migration | For module identification and exports, the module claim remains as the finding's full statement and the ledger organizes it. Module inventory, inspection, organization, dependencies and the earlier interpretation operations remain on the earlier structures until M3. |
| Result delivery through the real dialog | Verified with a substituted agent participant and live. A dialog that requests exports receives the mechanical finding that request retained, through its own production, and a change it receives that way is not a later cause for its output. |

## Defects found and corrected during M2

- **Delivery bundling.** For modules with large export surfaces, the dialog bundled the evidence page with the retained finding and both were withheld. Found by the measurement and corrected in `ce03f16`.
- **Hosted adapter repair turn.** The adapter did not keep a submission call pending, so a repair turn failed. Found by live trial and corrected in `85f1b49`.
- **Harness exclusion.** The harness excluded its ledger's directory, and with it the project. Found by live trial and corrected in `85f1b49`.
- **Renderer overlaps.** Overlapping self-loops, captions hidden behind states, and a caption across a state label. Found by inspecting live diagrams and corrected in `85f1b49` and `6f42db0`.
- **Unclear instructions.** Grounds, options, `unsupported`, content bodies and report placement were not exactly specified, and the submission schema was open. Found by live trials and corrected in `85f1b49` and `107e32f`. Each observed mistake is kept as a regression case.

## Capability migration status

| Capability | Status at this checkpoint | Applicable contract | Required by |
| --- | --- | --- | --- |
| Module identification | Contributed through the ledger; deterministic handles and module claims unchanged | New, for the identification and its use | — |
| Effective exports (internal exports answer) | Contributed and selected through the ledger | New | — |
| Module inventory, inspection, organization, dependencies, documentation, composition | Unmigrated | Pre-adoption contracts | M3 |
| `summarize`, `explain`, `decompose`, `examine` | Unmigrated: legacy trees, correction and citations | Pre-adoption contracts | M3 |
| State-behavior investigation and diagram | Available through the application interface; no CLI route or Presentation | New | — |
| Follow-up option invocation | Available through the application interface for supported operations | New | — |
| Explicit fresh investigation | Available for contribution Lenses; refused for mechanical Lenses and the earlier interpretation operations | New | M3 for the earlier operations |
| Hosted agent for contribution dialogs | The protocol exists; no application or CLI configuration path selects it, and a caller constructs it | New | M3 or M4 |
| Exposure-index terminology | Not started | New terminology | M3 |

## Legacy check families at this checkpoint

No existing test was removed or weakened. Two were changed:

- **One exports test** in `test/exports-lens.test.ts` stores controlled partial and unavailable evaluations directly. It now passes them through the same contribution wrapper as real evaluations, because the exports answer deliberately fails when a finding was never contributed.
- **The shared comparison policy** in `test/comparison.ts` treats the new Entity and investigram reference fields as references.

The remaining families keep the restoration milestones recorded at M1.

## Risks and questions for review

- **Warning breadth.** One change that identifies every module again flags every dialog that acquired those modules' baselines. The measurement shows one cause per changed module per dialog, cheap to derive. The decision anticipates this breadth, and it is not mitigated.
- **Supersede versus add.** In the live fresh investigation the agent superseded an earlier interpretation it described as confirmed and refined. That is permitted with grounds, but a reader might expect an added alternative.
- **Single repair attempt and first-problem reporting.** Under the final protocol no trial needed more than one repair, but several independent mistakes in one submission would still exhaust it.
- **No configuration path for the hosted dialog agent.** Live use requires constructing the agent in code.
- **Answer record size.** A contribution answer carries its selected content, which keeps exact presentation independent of the ledger and makes answer records larger.

## Verification

Run by the implementing agent, offline except where stated:

- `npm run check` and `git diff --check` passed at `6f42db0`.
- The full offline suite passed **738/738** with no skips at `6f42db0`. That is the 668 tests of the starting revision, of which one was adapted as described, plus 70 new tests. Earlier complete runs during M2 that failed did so under heavy background load or machine sleep, with "Session invalidated" errors and per-test durations of many minutes. They were rerun under normal load before each commit.
- The accumulating-Session measurement ran on the baseline and current builds; see its record.
- Live trials used 39 of the approved 60 requests on the ChatGPT plan route; see the trial record.

These are implementing-agent checks, not independent review. Milestone 2 is implemented and awaits the human-arranged checkpoint review.
