# Proposed revisions to docs/architectural-constraints.md

Unlisted constraints remain in force. No core-concept semantic revision is included.

## Application and interface boundary — replace the “Preserve append-only aliases” bullet

- Preserve precise identity, stable referents and qualified references within the supported Session lifetime, including exact targets used to connect requests. Retire compact CLI aliases, their allocation schedules, accepted compact inputs and scoped binding ports; do not introduce a replacement short namespace. Name resolution and investigator wire handles remain distinct from canonical identity. [[Precise references](decisions/cli-shell-retirement.md#precise-references)]

## Application and interface boundary — replace the “Preserve ownership, typed lifecycle outcomes” bullet

- Preserve ownership, typed lifecycle outcomes, progress/usage, credentials and guarded publication validity independently of research capture. Deliver plain data without store handles or executable capabilities; human clients must verify their actual output disclosure. The command feedback/sink implementation retires with its documented capability gap, without withdrawing client-neutral feedback/delivery obligations. This establishes no public transport or compatibility commitment. [[Retained boundary](decisions/cli-shell-retirement.md#retire-client)] [[Research gap](decisions/cli-shell-retirement.md#research-gap)]

## Application and interface boundary — add the following bullet

- Preserve terminal Session abort through `interrupt()`, lifetime-signal abort and active `close()`: internally finalize accounting before interrupted settlement, preserve the first established terminal cause, reject late content/usage after sealing, and expose one separately observed shutdown assessment without repeating cleanup. Keep request settlement, bounded resource-exit reporting and confirmed exit distinct. In-process responsiveness is cooperative; injected resource execution retains caller ownership. [[Terminal abort](decisions/cli-shell-retirement.md#terminal-abort)]

## Views and analysis boundary — delete one bullet

Delete the bullet beginning “For these Projection families, arrangement may use a narrowly scoped, session-owned reference-binding capability”. The supplied-qualified-information and no-acquisition rules surrounding it remain unchanged; alias binding is retired by [precise references](decisions/cli-shell-retirement.md#precise-references).

## Observation lifecycle and delivery — replace the first two bullets

- Inadequacy feedback records experience; it neither establishes program truth nor changes an investigation, initiates work or applies a correction. Retain available actual displayed artifacts and exact output, associated subject, qualified captured basis and investigation context without reconstruction or further investigation. Missing context does not prevent submission and must remain explicit; context-free feedback must not fabricate project, Session or View context. [[Preserved feedback obligations](decisions/cli-shell-retirement.md#research-gap)]
- Deliver requested feedback to its designated observation destination, disclosing failure without invalidating the displayed result or preventing subsequent use. Preserve sufficient available context for its interpretation without requiring earlier batches or a live store to reconstruct what was actually supplied. The command-shaped implementation retires without replacement; the resulting feedback/research capability gap remains documented and backlogged. Observation history is not restored operational state. [[Research gap](decisions/cli-shell-retirement.md#research-gap)]

## Views and analysis boundary — add the following bullet

- Retire the CLI's mechanical-family Presentations and disclosure classification while preserving qualified analysis and Projection construction. Validation rendering moved out of core remains subject to qualification, no-new-claims and applicable human-output obligations; assess actual output rather than infer conformance from module location or old CLI checks. [[Client retirement](decisions/cli-shell-retirement.md#retire-client)] [[Validation rendering](decisions/cli-shell-retirement.md#validation-rendering)]
