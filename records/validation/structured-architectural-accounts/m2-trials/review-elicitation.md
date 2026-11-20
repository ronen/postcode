# M2 review follow-up: focused instruction elicitation

Date: 2026-11-17
Task: [Implement structured architectural accounts](../../../tasks/2026-11-15-structured-architectural-accounts.md)
Review: [M2 round 1 findings](../../../reviews/structured-architectural-accounts/2026-11-17-m2-vertical-round-1-findings.md)
Prior evidence: [Original M2 trials](README.md)
Harness: [`run-trial.mjs`](../../../../scripts/structured-accounts/run-trial.mjs)

## Authority and method

After the first review identified missing live observations, the human approved three prepared scenarios within the **remaining 21 requests** of the original 60-request ceiling. The task follow-up is committed as `ac93fa2`. The original instruction allowing deterministic-only change notices remains in effect.

The three steps ran in one Session against Cockatiel commit `80b5ed67966dfcc5410a912285fcb3eeb2dc5e5e`, on `circuit-breaker-policy`. The existing checkout was verified at that commit with a clean working tree. They used the same ChatGPT plan route, `gpt-5.6-sol`, medium reasoning, adapter `postcode/chatgpt-responses@7`, and reference transport `postcode/investigator-references@3`.

Application implementation: `2493db7`, with only the trial-authorization task record added before execution. Dialog method: `postcode/contribution-dialog@4`; wire: `postcode/contribution-dialog-wire@3`; Projection method: `postcode/contribution-projection@2`; diagram method: `postcode/state-transition-diagram@5`. Node: 22.13.1, matching the installed native credential-lock module.

The harness appended each scenario's elicitation to the ordinary dialog instructions and captured it with every exchange. These are deliberately elicited actions, not spontaneous choices. The two conflicting statements were explicitly supplied hypothetical trial scenarios, not purported findings about Cockatiel. No artificial agent response replaced a live model response.

Each request was reserved before dispatch in the existing request ledger. The run used **10 requests**: 3 + 3 + 4. The cumulative total is **49 of 60**, leaving 11 unused. Every response had HTTP status 200; each dialog submitted once and was accepted without structural repair. All three attempts and their current selected answers fulfilled the state-diagram contract.

Raw sanitized exchanges, resolved answers, attempt reports and generated diagrams remain uncommitted working material. They contain repository source. This record preserves the inputs and observations needed to interpret the trial without depending on those captures.

## Scenario inputs and observations

### 1. Establish the state account, trial hypotheses and an illustration

The application request was `state-behavior` on the module name `circuit-breaker-policy`. The added instruction requested the source-grounded state account, plus two separately addressable, explicitly hypothetical statements:

- H1: “In this hypothetical scenario every attempted request is admitted while the breaker is open”.
- H2: “In this hypothetical scenario no attempted request is admitted while the breaker is open”.

It requested separate temporary topical uses, qualifications denying any implication that either hypothesis was true of the implementation, and an illustration of the actual state model.

The agent acquired inspection, source, exports and dependencies, then source for two collaborator interfaces. It submitted one contribution with `model`, `explanation`, `h1` and `h2` items; separate `actual-topic`, `h1-topic` and `h2-topic` associations; and an `answer` designation selecting only the actual model and explanation. The hypothesis items and uses explicitly retained their hypothetical, non-evidentiary scope. The illustration `diagram` referenced the exact `model` item and carried its own limitations.

The model's bearer was the scoped role “each CircuitBreakerPolicy instance”, not the module globally. Its rendered text preserved that bearer. The account separated source interpretation from execution evidence and described coverage and unsupported concurrency/hydration details. These observations do not independently verify its architectural conclusions.

### 2. Compare exact hypotheses, reuse unchanged content and partition new discussion

An explicit fresh investigation repeated the original question. Elicitation requested acquisition of the earlier answer and support, a qualified inconsistency report on the exact hypothetical endpoints without displacement, reuse of the unchanged model by reference, a separate implementation explanation and hypothetical-discussion contribution, an illustration of the reused model, and an added alternative for the original question.

The initial current answer did not select the hypothetical items. The agent requested the whole earlier contribution, the all-history result inventory, program evidence, exact `model`, `h1` and `h2` items, and the original answer association with content before submission.

It produced two investigrams:

- `implementation` added a new explanation and `alternative-answer`. The designation referenced the earlier owner's `model` directly, alongside the new prose. Its grounds explicitly supplemented the first answer and denied mechanical corroboration of the earlier interpretation. Its `state-diagram` illustration referenced that same unchanged model.
- `hypothetical-disagreement` retained a discussion with support references to `h1` and `h2`, and reported `h1-versus-h2` at those exact item endpoints. It neither displaced an endpoint nor made an implementation claim. Its owner/item/report qualifications were limited to the hypothetical comparison rather than copying implementation-method limitations indiscriminately.

The delivered answer had two standing alternatives. Reused model content retained its original address, owner and qualifications. The hypothesis comparison remained separately qualified and was not silently folded into the implementation answer.

### 3. Withdraw only the temporary H1 topical use

A second explicit fresh investigation repeated the question. Elicitation requested acquisition of H1's complete topical use and necessary qualified support, withdrawal of only that temporary use as an organizing trial closeout, preservation of its content and inconsistency history, and no withdrawal of the implementation model or unrelated result designations.

The agent requested all-history topical inventory, source and inspection; then exact H1, H2 and actual state-behavior associations with content, and the original contribution. It subsequently requested H1 as a member of its exact use, another contribution and an all-history Entity inventory. One request incorrectly supplied an investigram handle to the module `dependents` tool; the domain returned unavailability, and the dialog continued. This is a live navigation mistake, not successful evidence acquisition.

The accepted `withdraw-h1-topic` declaration displaced only `h1-topic`. Its grounds explicitly characterized withdrawal as ending the trial's organizing use, not proving H1 false or establishing implementation correctness. It retained support to the original H1 item. The same contribution added a third state-behavior answer; it did not displace the first two answers or the actual state-behavior and H2 topical uses. The original items and the prior inconsistency report remained retained.

## Additional correction exposed by the trials

Authored illustrations were accepted into the ledger but absent from the resolved answer's fixed metadata support. This was another omission at the answer-construction boundary addressed by review finding F1. Commit `a062be2` captures selected owners' illustration metadata, exact inputs, qualification and required support, and advances the Projection method to `postcode/contribution-projection@3`.

That host-side capture correction did not change the dialog, instructions, accepted contributions or renderer. The live run above is evidence at `2493db7`, not a claim of live verification of later code. The subsequent TypeScript build and seven contribution-answer/application tests passed under Node 22, including exact illustration inputs and qualification. No additional inference was needed to verify copying the already accepted metadata into fixed support.

## Review correction verification and remaining limits

Commit `2493db7` addresses the eight first-round findings: exact use/support qualification, separate attempt outcomes and reports, successful reuse after a prior failure, originating-question delivery, malformed acquisition handling, dispatch-time exposure, terminal usage accounting, and model-specific state bearers. It also corrects the stale architecture descriptions.

Verification before the live run:

- Type check, build and `git diff --check` passed.
- The full offline suite ran 747 tests: 742 passed, five authentication tests failed. Three failures were sandbox loopback restrictions; two were a native Node 22 lock module loaded under Node 26.
- The complete authentication file passed 20/20 under Node 22 outside the sandbox.
- The final focused contribution suite passed 61/61 under Node 22 after the answer-arrangement cleanup.

Together these provide passing coverage for every offline test, with the environment differences disclosed above. They are implementing-agent checks, not an independent review of the corrections.

The new trials supply the previously missing live observations of inconsistency reporting, withdrawal, qualified content reuse/partitioning and illustrations. They do not establish general instruction reliability, architectural correctness or user value. No general renderer stress test or new accumulating-Session benchmark was performed. The deterministic no-exposure and unrelated-acceptance controls verify that support capture does not create producer deliveries or change an answer merely because unrelated history grew.

Milestone 2 still awaits further independent review and the human's determination that the checkpoint is sufficient. Milestone 3 has not started.
