# M3 corrected-revision memory investigation

Date: 2026-11-18
Task: [Implement structured architectural accounts](../../tasks/2026-11-15-structured-architectural-accounts.md)
Corrected implementation: `8e06c5c74ba6679dd7e030dbb28162503b6235aa`
Evidence: [compact measurements](m3-memory-profile-summary.json)
Scripts: [profiler](../../../scripts/profile-contribution-memory.mjs), [experimental build transformation](../../../scripts/prototype-contribution-sharing.mjs)

## Finding

A substantial, demonstrably avoidable part of retained memory is duplicated immutable content, not information required to preserve historical answers. On the representative 741-module journey, the corrected implementation retains 1,183.3 MB after GC. An experimental build sharing owned immutable records/content retains 598.2 MB with the same 15 answer identities and contribution counts: 585.1 MB less, about 49%. Eight distinct answers over heavily overlapping information add 20.2 MB in the corrected build and 1.1 MB in that prototype. Identical requests stabilize in both.

This does not establish that the remaining 598.2 MB is a minimum or that all remaining objects are necessary. Compiler state, indexes, provenance, genuinely distinct snapshots, runtime overhead and experimental ownership tracking are included. It does establish that copying all support is unnecessary for exact historical answers. The prototype leaves product source unchanged and is not a shipped optimization.

The elevated post-close heap is separately explained on the representative workload: the measurement's suspended async frame retains its last inventory result after the Session closes. Letting that frame return releases the result and most of the residual heap, while deliberately retaining the closed Session facade. Store and ledger weak references are already dead before the frame returns. This is not evidence of a live ledger leaking through the facade.

## Method and limits

The source fixture is the clean primary checkout at `bd92670e4e0db1c9d9804e6d7797f38678ab9bf1`, the same 741-module population used in the [earlier measurement](m3-mechanical-measurement.md). It remained unchanged. All profiling runs use Node 26.11.0, fresh processes and `--expose-gc`. The corrected compiled `src/` digest is `6113c623dc0d3df39d2a05b89fa98a88580518f56604da9c94b1467aca9e16b4`; the summary records every experimental digest. There was no live inference. The history probe uses a scripted ledger withdrawal, not a model call.

The main run repeats the earlier 18-request application journey: two rounds of module inventory, organization, dependency structure, and inspection/dependency children for work-attribution, memory-store and executor. It then directly constructs inspections to isolate answer retention from compiler acquisition: an eight-module answer, eight identical repeats, and eight distinct answers sharing seven of the original eight modules. Finally it withdraws an identification, checks the original answer's complete JSON hash, constructs a fresh answer and exercises close/collection controls.

Each heap observation follows four asynchronous turns with explicit GC. Inspector allocation sampling uses a 32,768-byte interval. Named wrappers attribute native cloning allocations without changing clone semantics. Weak references track the store, ledger, last returned inventory and retained records. Their ID registry itself consumes about 25 MB and is cleared separately at the end. JSON audits run after the heap sample. The reported heap therefore includes instrumentation, but not the immediately following audit's temporary strings.

Serialized byte counts describe representation and repetition; they are **not heap sizes or a disjoint information-size accounting**. A ledger item can serialize a provider record also counted in the canonical store and answer support. Sampling estimates allocation origins, not object dominators or exact retained sizes; their sums need not equal measured heap. The allocation-only run includes subsequently collected objects and is explicitly distinguished from live-allocation sampling. Pre-GC samples are not reported as peak application memory: earlier audit serialization can contaminate them. These are single bounded runs, not statistical benchmarks or proof of bounded growth under every possible request.

## Canonical information and duplicated support

At the end of the corrected application journey:

| Retained representation | Serialized bytes, decimal MB | Counts / meaning |
| --- | ---: | --- |
| Canonical non-Projection program records | 99.40 | Provider records, evaluations and their context |
| Contribution ledger | 180.25 | 8,400 Entities, 65,583 investigrams, 15 productions; includes native bodies that repeat provider records |
| Retained answers | 377.38 | 15 Projections, including resolved support and answer content |
| Answer owner support | 50.40 | Immutable provenance plus captured producing causes |
| Answer item support | 112.87 | Content items, resolved identifying information and captured inconsistency associations |
| Answer use support | 46.96 | Declarations plus captured standing/reconsideration status |
| Answer evidence support | 135.66 | Exact provider/context records repeated in support |

The last four rows are components of the answer row, not additional totals. Empty changes/metadata/bearer support accounts for negligible bytes in this unmodified journey; the later controlled history change exercises changing status.

The 15 answers contain 138,695 evidence occurrences for 96,935 distinct record IDs and 48,361 content-item occurrences for 35,025 distinct item addresses. In the current build, **none** of the inspected evidence occurrences is the same object as its canonical store record, and **none** of the item occurrences is the same object as the ledger item. The answer assembler initially has those canonical references. `MemoryProgramRecordStore.put` then deep-clones the whole Projection. `ContributionLedger.accept` separately deep-clones native item bodies that already contain canonical provider records. Additional payload/delivery captures also clone immutable values.

Live allocation samples at this point attribute approximately 484.7 MB to answer-record cloning, 234.4 MB to ledger/production cloning, 24.7 MB to canonical record cloning, 7.7 MB to other clones and 492.5 MB to other allocations. These approximate allocation-origin buckets should not be added to the serialized table or interpreted as all avoidable. The controlled representation changes below provide the stronger evidence of avoidability.

## Controlled sharing and repeated requests

All three prototypes preserve the existing answer shape and fully resolved support. They share only values known to have crossed an internal deep-ownership boundary. Mutable or unrecognized input is still copied. They do not treat arbitrary `Object.isFrozen` objects as trusted, replace payloads with lazy IDs, change support selection, or consult current standing during exact access.

| Observation, after GC | Corrected build | Answer capture sharing | Sharing at all four capture sites | Sharing with owned roots only |
| --- | ---: | ---: | ---: | ---: |
| Application journey, 15 answers | 1,183.3 MB | 877.9 MB | 639.0 MB | 598.2 MB |
| Initial overlapping selection, 16 answers | 1,169.1 MB | 877.7 MB | 639.2 MB | 598.5 MB |
| After eight identical repeats, still 16 answers | 1,169.0 MB | 877.6 MB | 639.2 MB | 598.5 MB |
| After eight distinct overlapping answers, 24 answers | 1,189.3 MB | 878.6 MB | 640.2 MB | 599.6 MB |
| Distinct-answer increase from initial selection | 20.22 MB | 0.93 MB | 0.94 MB | 1.11 MB |

Answer capture sharing changes only the Projection copy in the program store. The broader variants also change capture in the contribution ledger, contribution answers and production delivery. The first two variants brand all deeply frozen descendants in a module-level WeakSet. The root variant brands only owned roots and selected ledger item/declaration/metadata roots. It copies more small wrapper structures but needs a smaller ownership table.

All journey-local answer identities match the corrected build after removing the Session namespace. All variants retain the same Entity, investigram and production counts. Every audited evidence occurrence and content-item occurrence in the sharing variants has canonical identity. Serialized payload sizes remain effectively unchanged; the small byte differences arise from operational build/output exclusion paths. Sharing reduces heap duplication, not the information represented or JSON wire size.

The isolated identical requests retain the same answer ID and do not grow the answer count, canonical record population or ledger. The eight distinct requests add exactly eight answers while the native information population and the union of support item/evidence identities remain unchanged. Their new per-answer selection/status information is legitimate; repeatedly copying overlapping bodies dominates the additional current-build heap. The small downward heap drift during identical runs is GC/runtime noise, not negative answer cost.

After the controlled withdrawal, each variant preserves the original complete answer hash while a fresh answer gets a different ID. This checks the necessary distinction between immutable content and time-dependent answer state. Fresh IDs after the synthetic withdrawal need not match across independent runs because the scripted production has its own identity; the checks are preservation of the old answer and change of the fresh one within each Session.

## Temporary allocation is a different problem

A separate real-project run evaluates exports, documentation and composition, captures one 32-module answer, restarts allocation sampling with collected objects included, then repeats that exact answer four times. It uses the corrected build and the broad sharing prototype, not the owned-root variant.

| Observation | Corrected build | Broad sharing prototype |
| --- | ---: | ---: |
| Heap after initial answer | 620.2 MB | 506.4 MB |
| Heap after four identical repeats | 619.7 MB | 506.1 MB |
| Sampled cumulative allocation over the repeats | 913.8 MB | 886.9 MB |
| Of that, answer-copy allocation | 29.8 MB | 8.8 MB |

Both retain one answer throughout. The cumulative allocation totals include the sampling harness; they are not peak heaps. Most allocated memory is temporary. Sharing dramatically improves retention in the full journey but leaves most of this construction allocation intact.

Large sampled frames are string joins (about 276 MB across the three largest join stacks in the corrected run), sorting, `canonical`, `Object.entries`, and the store's `put` operation. The code recursively materializes canonical strings for identity and collision checks. `put` compares `canonical(prior)` with `canonical(record)` and still prepares a cloned pending record even when the existing ID will ultimately retain its original object. Reusing retained answers therefore does not yet avoid reconstructing, serializing and checking the candidate.

A separate optimization could compare trusted identical immutable subtrees by identity, cache canonical fingerprints with the same ownership lifetime, or avoid materializing entire intermediate strings. It must retain collision validation, exact canonical semantics and atomic validation of a batch. These are candidates, not changes made by this investigation; the samples do not establish which is best.

## Representative post-close heap

The corrected run reproduces the earlier elevated post-close observation and adds causal lifetime controls:

| Corrected run after GC | Heap | Weak-reference observation |
| --- | ---: | --- |
| Close called; measurement async frame still active | 352.6 MB | Store and ledger collected; last inventory result and one Projection remain |
| Measurement frame returns; closed Session facade deliberately held | 50.7 MB | Store, ledger and inventory collected; zero tracked Projections remain |
| Closed facade released | 49.2 MB | Same collection state |
| Weak-reference registry cleared | 23.9 MB | Instrument metadata released |

The surviving inventory Projection serializes to 193.35 MB, including 63.70 MB evidence support, 59.58 MB item support, 28.75 MB owners and 26.83 MB uses. Its resolved module content also retains canonical record objects. The weak record audit detects one Projection, not an accumulating ledger. The loop's `inventory`/`modules` values and `pick` closure live in the suspended journey frame; after that frame returns the weak inventory dies. Holding the Session facade across that transition rules out facade release as the explanation for the large decrease.

This representative control explains the same retention mechanism behind the earlier 346.5 MB observation; it does not retroactively assign every byte in that older process. It also demonstrates the intended lifetime distinction: a caller retaining a historical output can keep its self-contained value graph alive after close, while Session resources are released. That surviving output is not an active Session or authority for new operations.

The prototypes reveal a separate implementation pitfall. After all answers, the facade and profiler registry are released, the deep-branding variants still use 91.2 MB (all capture sites) or 158.2 MB (answer-only). Allocation samples show WeakSet backing-table allocations of 67.1 MB and 134.2 MB respectively. The owned-root variant finishes at 40.8 MB with a 16.8 MB table. Weak keys do not retain their referents, but this module-global ownership table retains capacity. It is experimental overhead, not a remaining answer or ledger leak, and is a reason **not** to adopt the prototype literally.

## Representation compatible with the existing contracts

The existing `AnswerSupport` shape can remain a self-contained immutable object graph. It need not become a live view or require an architectural change to historical meaning.

| Shareable immutable information | State fixed separately for each answer |
| --- | --- |
| Canonical program/evidence records and content items/bodies | Selected item/use/evidence lists and their scope |
| Producer identity, qualification, origin and report | Producing reconsideration causes captured for each owner |
| Association/change declarations and immutable grounds | Standing, displacement, membership/producing/content causes and inconsistency associations at capture |
| Immutable metadata contents | Which metadata and bearer identifications were selected |
| Already resolved identifying information where safely owned | Answer fulfillment, selected historical designation and other request-specific result state |

The implementation must still derive and freeze the answer's state at capture. Sharing an immutable declaration does not mean sharing a mutable status cell. Two independently captured snapshots may share immutable subvalues, but old answers must never ask today's ledger what their standing is. Exact access and presentation must require neither fresh analysis nor an available store/ledger.

Direct references to **owned immutable objects already included in the resolved graph** fit these constraints better than naked IDs resolved through a Session. They preserve synchronous resolved presentation and post-close retained-value lifetime without closures, compiler objects, lazy lookup or renewed selection. The accepted [qualified-answer decision](../../../docs/decisions/qualified-answers-over-contributions.md) and [exposure decision](../../../docs/decisions/association-organization-and-exposure.md) require fixed meaning and actual delivery history, not independent physical copies of immutable payloads.

Ownership proof should be scoped to a Session/store lifetime, or carried by an equally bounded trusted capture mechanism. Release its registry when the owner closes; a retained answer keeps the frozen objects it directly references, without keeping the ownership registry, Session or compiler alive. The module-global WeakSet prototype has not implemented that lifecycle and is not ready for adoption. Arbitrary caller-frozen objects must still be copied; a shallow freeze is insufficient evidence of deep ownership. Cross-Session reuse must retain existing Session validation rather than acquire authority through object identity.

Delivery records still need their own actual timing, selection, exposure and producing-investigation attribution. Sharing a delivered immutable body creates no additional acquisition and cannot remove those records. Public/worker `structuredClone` stays native; a message receives its own plain structured value graph. Internal sharing does not promise shared pointers across processes or eliminate serialization volume.

## Verification and next implementation boundary

Both the broad and owned-root experimental builds passed **144/144** existing tests with no skips on Node 22.13.1. These cover contribution mechanism/exposure/history, exact compatibility, ownership/mutation isolation, application boundaries and lifecycle, services, resolved Projection content and scripted dialogs. The builder additionally checks that shallow-frozen external input is isolated, owned evidence shares identity, later status/cause changes do not mutate the old snapshot, and native structured cloning preserves the plain value while creating independent objects.

The corrected product implementation was not changed or rebuilt during profiling. Its prior **773/773** full-suite result remains the product verification; these prototype checks are additional investigation evidence, not a replacement full-suite claim. All runs are offline.

The evidence supports implementing bounded ownership-aware sharing at retention/capture boundaries while retaining per-answer state snapshots. A production change should explicitly cover ownership-registry disposal, multiple simultaneous Sessions, retained answers after close, caller mutation isolation, collision/atomic validation and worker delivery. It should then repeat this representative profile and the full suite. Temporary canonicalization cost warrants a separate measured change, so its benefit and validation are not conflated with retained sharing.

The task remains active. This investigation does not accept the mechanical checkpoint, start the separate agentic/caller checkpoint, satisfy M4, or authorize live inference.

## Reproduction

Build the corrected revision with the repository's normal build command, holding the source fixture fixed separately. Use fresh empty report/build directories. For example:

```sh
node --expose-gc scripts/profile-contribution-memory.mjs <fixed-source-tsconfig> _build _verification/profile-corrected
node scripts/prototype-contribution-sharing.mjs _build _verification/profile-roots-build roots
node --expose-gc scripts/profile-contribution-memory.mjs <fixed-source-tsconfig> _verification/profile-roots-build _verification/profile-roots
node --expose-gc scripts/profile-contribution-memory.mjs <fixed-source-tsconfig> _build _verification/profile-allocations allocations
```

Use `answers` and `all` instead of `roots` for the other variants. Run allocation mode against the `all` build for the temporary-allocation comparison. The transformation changes only the new scratch build. Raw reports for the recorded runs remain under `_verification/memory-{corrected,answer-sharing,sharing,root-sharing,allocation-corrected,allocation-sharing}/report.json`; the committed summary preserves their relevant numeric evidence without source bodies or machine-specific paths. Early reports have a prototype-copy counter aliasing defect; those counters are excluded from the summary and all conclusions. Heap samples, allocation groups, identities and audits are unaffected; the profiler now snapshots those counters.
