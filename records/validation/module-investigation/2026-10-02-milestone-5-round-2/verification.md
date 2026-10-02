# Milestone 5 round-2 follow-up verification

The human authorized investigation of R2-O1 in `015ea9c`; the correction and R2-O2
coverage are `9d189d9`. This is offline verification, not a new live assessment or
milestone acceptance.

The real-session ordering reproduction failed against the reviewed implementation
at `assert.ok(repeated.displaced.includes(k.id))`: the replacement was displayed
already and deduplication skipped displacement of K and its child. The same test
passes after recording displacement before body deduplication. New bodies exceeding
the output bound remain omitted before displacement traversal. The test also checks
that the primary appears once, exact K inspection retains its original child, and
only the two setup/correction evaluations invoke the scripted investigator.

A second regression passed before and after the fix. Three accumulated replaced
branches exceed both metadata bounds: 372 displaced accounts and 387 accompanying
corrections produce listings of 256, with 116 and 131 explicit omissions. Human
output agrees. Exact inspection retrieves omitted original children and correction
relationships; reuse and inspection perform no inference. This closes the coverage
gap without changing truncation semantics.

The focused run also includes the prior revision lifecycle and 511-status bound
regressions: four tests pass, no failures/cancellations/skips. Exact before/after
outputs are retained alongside this record. Presentation identity is @11; prior
frozen live assessment inputs and outputs remain attributed to @10.

The full suite at clean, stationary `9d189d9e0e208881b3a037da88af0d49b52b61e0`
passed **468 tests**, zero failures/cancellations/skips, 153.733 seconds (163.513
including build/monitor). Local callback listeners were permitted, as in the prior
successful run. No real credentials or provider requests were used. Idle-sleep
prevention and a one-second monitor recorded maximum gap 1.111 seconds, none over
two seconds. Historical cancelled and restricted-environment runs remain preserved;
this result does not retroactively diagnose them.

The original fixture, pass-05/pass-06 artifacts, handoff and reviewer findings are
unchanged from `e722031`. Diff whitespace and local Markdown target checks pass.
The production correction changes presentation only; investigation instructions,
evidence eligibility, acceptance and the inference-retry policy are unchanged.
The human still decides milestone acceptance; final integrated review remains.
