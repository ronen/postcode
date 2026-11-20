# SLICE scope discussion

Started: 2026-11-20

Working notes for [SLICE](../steering/upcoming-work.md#slice), explicitly identified
by the human as the subject of this discussion. These record evidence, proposals
and unresolved choices; no scope or implementation plan has been accepted.

The human requested discussion of the first useful graphical investigation
experience, using actual structured-account outputs alongside the authored journey,
with working notes here and a plan only after scope has been worked out.

## Working context

Branch: `codex/first-graphical-experience`.
Worktree: `/Users/ronen/postcode/app-worktrees/first-graphical-experience`.
Starting commit: `c6654827eef15a02786429cf0e0b4af15816a273`, synchronized with
`origin/main` before worktree creation. This is exploration, without an
implementation task record. Governing documents and steering remain unchanged.

## Evidence informing the opening discussion

- The adopted [product design](../foundation/product-design.md) and
  [application specification](../docs/app-specification.md) place the human's
  architectural reasoning at the center. The human may understand computation and
  design without understanding the implementation language. Accounts can remain
  partial, overlapping and disputed. Presentation cannot supply missing analysis
  or turn interpretation into established fact.
- The [first-slice note](first-graphical-slice.md) proposes recognizable entries,
  contents, cross-references and supporting detail. The
  [organization note](architectural-reference-organization.md) distinguishes
  indexing retained subjects from interpreting useful groupings and from judging
  coverage. None of these is already a selected product offering.
- The [journey script](initial-journey/cockatiel-investigation-script.md) starts
  with a real concern and issue-derived names, little Cockatiel knowledge, and
  substantial design experience. Its endpoint is a reasoned direction with open
  questions. The [connected examples](initial-journey/cockatiel-account-examples.md)
  depend on admission, shared state, individual execution and composition accounts,
  not only a state machine. Their answers and correction discoveries are authored
  examples, not actual PostCode execution.
- The [journey findings](initial-journey/design-findings.md) report that broader
  orientation became meaningful through local understanding. The
  [picture review](initial-journey/pictures-result-review.md) distinguishes useful
  content transfer from visual fidelity and human benefit. The human found some
  local illustrations reasonable, the broad ownership picture less illuminating,
  and particular arrows, wording and timing depictions misleading. All four
  retained PNGs were inspected for this discussion. They are illustrations derived
  from a working account, not current application-generated diagrams.
- The completed [structured-account task](../records/tasks/2026-11-15-structured-architectural-accounts.md)
  supplies the underlying retention, selected-content investigation, alternatives,
  revision, state-account and follow-up mechanisms. Its completion does not
  establish a useful graphical experience. The
  [capability reference](../docs/capability-reference.md) still discloses transient
  Sessions, unchanged-input requirements, no save/resume and no general navigable
  collection of Views.
- Actual [M2 output and trial evidence](../records/validation/structured-architectural-accounts/m2-trials/README.md)
  includes the generated
  [breaker state diagram](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy.svg)
  and [full text](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy.txt),
  its [fresh-investigation diagram](../records/validation/structured-architectural-accounts/m2-trials/circuit-breaker-policy-fresh.svg),
  and accounts of the delegated breaker implementations. The two breaker-policy
  SVGs were rasterized on white and visually inspected. They show recognizable
  state structure but dense crossing edges and truncated transition labels; the
  explanatory text is needed for conditions and scope. These are preserved early
  renderer outputs, not a fresh test of the final renderer.
- The generated breaker-policy account distinguishes an arriving execution after
  the recovery delay from an automatic transition. It explicitly says the flat
  model does not represent each concurrent call. The delegated-breaker account
  qualifies its state bearer and common abstraction. The ConsecutiveBreaker output
  includes numeric comparison categories and unusual-value qualifications. These
  are useful examples of the selection/detail problem: structurally supported
  content can be much broader than the reader's current concern. Reading these
  outputs did not independently verify Cockatiel behavior.
- The [promised-contract follow-up](../records/validation/structured-architectural-accounts/m2-trials/promised-contract-verification.md)
  successfully produced and invoked a diagram-promising option with natural-language
  elicitation, in seven requests without repair. The
  [review elicitation](../records/validation/structured-architectural-accounts/m2-trials/review-elicitation.md)
  demonstrated reuse, alternatives, inconsistency and withdrawal under explicitly
  supplied trial directions. Neither proves natural discovery of important gaps.
- The [M4 context-authoring trial](../records/validation/structured-architectural-accounts/m4-option-context-authoring.md)
  preserved a real failure: a broader diagram follow-up timed out during repair at
  181 seconds. A subsequent run deliberately requested one small prose clarification;
  that invocation succeeded in about 43 seconds. This is evidence for making work,
  failure and a useful route to continue visible, not evidence that prose is always
  better or that a user can already narrow a request through the product.
- The [dialog 14 trial](../records/validation/structured-architectural-accounts/m4-dialog14-live-regression.md)
  produced an accepted clarification distinguishing admission, isolation and stale
  completion from three controlled retained notes. Its setup was scripted; it did
  not independently investigate those claims. The historical records preserve
  their own implementation revisions and limitations despite subsequent acceptance.

The journey uses Cockatiel `f48bea5`; the structured-account trials use `80b5ed6`.
They must not be combined into one verified account. The ignored raw-capture
directory named by the live records was not present in the remaining registered
structured-account worktree. This reading used committed actual diagrams/text and
durable trial records, not an inspection of those missing raw exchanges. No new
inference or Cockatiel runtime verification was performed.

## Opening choice: what must the person bring?

The consequential choice is the starting promise of the experience. Three useful
levels are distinguishable without selecting a particular screen layout:

| Starting situation | What PostCode must make useful | Main scope consequence |
| --- | --- | --- |
| The person already knows the subject and precise question | A focused answer, detail and follow-up | Smallest investigation surface, but a weak test of reference browsing and discovery |
| The person brings a concrete concern and an ordinary name or lead, but does not know the implementation or all the questions to ask | A bounded reference around that concern, related subjects and new inquiry | Needs orientation and discoverability within that concern; potentially a small amount of interpreted organization |
| The person opens an unfamiliar project with no specific concern | Useful entry points and an architectural organization from which to discover worthwhile questions | Makes broader orientation and coverage judgment central capabilities |

The initial agent recommendation is the middle case. This is a proposal for
discussion, not an accepted narrowing. It permits browsing and discovering new
questions; it does not require a scripted click sequence or an expert to supply
the correct source module. A raw index may or may not be sufficient: test whether
it exposes useful connections rather than assuming either full ORGANIZE or no
organization work.

A concrete candidate is: someone considering early admission/readiness behavior
in Cockatiel wants to understand recovery, waiting and the commitments an early
check could make. They bring the use concern and names found in ordinary material.
They should leave able to explain the relevant mechanism and consequences, choose
a defensible next design question or direction, identify unresolved assumptions,
and return to the accounts supporting that reasoning. Reaching the journey's
particular timer proposal is not an acceptance criterion.

## Consequences to discuss after that choice

- **Reference substance:** a recovery entry connected to admission, ownership and
  composition may support the candidate episode. Decide which connections must be
  produced and navigable. Several adjacent answers alone do not establish them.
  An entry need not equal one contribution or one authoritative answer.
- **Pictures and detail:** a state overview explains transitions; waiting,
  concurrency and composition may need complementary interaction content and
  pictures. A state renderer cannot invent that meaning. Keep consequential
  conditions in the main explanation, with exact support and fuller detail nearby.
- **Inadequate accounts:** distinguish revealing retained detail, investigating a
  new question, retrying production, and submitting a specific objection. Fresh
  investigation exists. Inadequacy feedback only records the experience; giving
  an objection to the investigator requires additional capability. Do not imply
  that retry alone lets the person explain what is wrong or missing.
- **Return:** a developing reference within one sitting and a reference someone
  returns to tomorrow make different promises. Choose that explicitly before
  including or deferring PERSIST. Readable saved answers and executable resumed
  investigation are different levels of support.
- **Changing software:** choose whether usefulness ends at a design direction over
  fixed inputs or includes checking the subsequent implementation. The latter
  creates a reason for CHANGE. Neither repository changes nor restart should
  silently retarget earlier accounts.
- **Evidence of usefulness:** observe people explaining a consequential distinction,
  finding a related topic without researcher steering, returning to earlier support,
  recognizing an unresolved limitation, and continuing after an inadequate answer.
  Separate fidelity of content, fidelity of pictures, findability and actual
  reasoning benefit. A successful request or attractive diagram is insufficient.
  Allow different defensible endpoints and cases where the person reasonably stops.

No decision on these dependencies, diagrams, hosting, persistence, changed inputs,
or acceptance thresholds has yet been made. PRESENT and MINIGUI remain subsequent
design/implementation work; this discussion selects their useful scope.
