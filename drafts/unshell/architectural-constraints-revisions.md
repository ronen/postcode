# Proposed revisions to docs/architectural-constraints.md

Unlisted constraints remain in force. No core-concept semantic revision is included.

## Application and interface boundary — replace the “Preserve append-only aliases” bullet

- Preserve precise identity, stable referents and qualified references within the supported Session lifetime, including exact targets used to connect requests. Keep name resolution and investigator wire handles distinct from canonical identity. [[Precise references](decisions/cli-shell-retirement.md#precise-references)]

## Application and interface boundary — replace the “Preserve ownership, typed lifecycle outcomes” bullet

- Preserve ownership, typed lifecycle outcomes, progress/usage, credentials and guarded publication validity independently of research capture. Deliver plain data without store handles or executable capabilities. Keep shared feedback and delivery contracts independent of interface View types. Human clients must verify what their output actually discloses. The application boundary is internal and carries no public transport or compatibility commitment. [[Application boundary](decisions/cli-shell-retirement.md#retire-client)] [[Feedback and delivery obligations](decisions/cli-shell-retirement.md#research-gap)]

## Application and interface boundary — add the following bullet

- Preserve terminal Session abort through `interrupt()`, lifetime-signal abort and active `close()`: internally finalize accounting before interrupted settlement, preserve the first established terminal cause, reject late content/usage after sealing, and expose one separately observed shutdown assessment without repeating cleanup. Keep request settlement, bounded resource-exit reporting and confirmed exit distinct. In-process responsiveness is cooperative; injected resource execution retains caller ownership. [[Terminal abort](decisions/cli-shell-retirement.md#terminal-abort)]

## Views and analysis boundary — delete one bullet

Delete the bullet beginning “For these Projection families, arrangement may use a narrowly scoped, session-owned reference-binding capability”.

## Observation lifecycle and delivery — replace the first two bullets

- Inadequacy feedback records experience; it neither establishes program truth nor changes an investigation, initiates work or applies a correction. Retain available actual displayed artifacts and exact output, associated subject, qualified captured basis and investigation context without reconstruction or further investigation. Missing context does not prevent submission and must remain explicit; context-free feedback must not fabricate project, Session or View context. [[Preserved feedback obligations](decisions/cli-shell-retirement.md#research-gap)]
- Deliver requested feedback to its designated observation destination, disclosing failure without invalidating the displayed result or preventing subsequent use. Each submission must include enough available context for a recipient to interpret it independently of prior submissions and the live Session. Keep observation history separate from Session state. [[Feedback and delivery obligations](decisions/cli-shell-retirement.md#research-gap)]

## Views and analysis boundary — add the following bullet

- Core owns qualified analysis and Projection construction. Validation rendering belongs outside core and uses the structured results as its authoritative input. Render only claims supplied by those results, preserve alternatives and qualifications, and disclose consequential omissions or incompatibilities. Verify disclosure against the actual human-facing output. [[Analysis boundary](decisions/cli-shell-retirement.md#retire-client)] [[Validation rendering](decisions/cli-shell-retirement.md#validation-rendering)]

## Views and analysis boundary — update the presentation continuity references

In the bullet beginning “Preserve the selected answer”, keep the Presentation continuity reference and remove the adjacent “Current CLI limitation and deferred remediation” reference.

## Observation lifecycle and delivery — replace the destination-selection bullet

- Keep the choice of observation destination independent of retention, migration, historical reading and producer-side caching. [[Observation lifecycle policy](decisions/adopt-identity-evidence-and-observation-constraints.md#keep-sink-selection-separate-from-observation-lifecycle-policy)]

## Observation lifecycle and delivery — replace the bullet beginning “Keep research collection distinct”

- Keep research collection distinct from architectural provenance, qualification, exact-answer continuity and investigation attribution. When recording Views or their changes, preserve or reference the composition, contributing bases and surrounding context needed for the research question; do not imply that displayed output establishes a complete captured basis. Required local investigation lineage is independent of research export. [[Qualified results](decisions/research-question-driven-observation.md#results-over-captured-bases)] [[Local context](decisions/research-question-driven-observation.md#retained-understanding-and-context)] [[Research capture and basis-attribution gap](decisions/cli-shell-retirement.md#research-gap)]

## Observation lifecycle and delivery — replace the bullet beginning “During early development”

- During early development, affected structured outputs can change directly under the temporary experimental-output policy, with specific accepted preservation clauses reconciled explicitly. Preserve semantic qualification and method provenance; experimental output schema strings do not establish supported compatibility versions. [[Experimental outputs](decisions/experimental-structured-outputs.md)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

## Source evidence and human understanding — replace the bullet beginning “Human understanding must not depend”

- Human understanding must not depend on programming-language source or syntax. Apply this to Views, generated explanations, evidence detail, qualifications, diagnostics and non-View reports. An interface's declared purpose and consumption contract determine its audience, not its encoding or caller identity. [[Human output boundary](decisions/human-facing-architectural-representations.md#human-output-boundary)]
