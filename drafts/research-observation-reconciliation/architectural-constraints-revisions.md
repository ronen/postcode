# Proposed revisions to docs/architectural-constraints.md

Replace the complete bullet beginning “When additional investigation influences”.

- When additional investigation influences selection, ambiguity, inability to resolve, suggestions, Views or reports, keep its trigger, parent where applicable, captured basis, relevant results and qualifications inspectable from that outcome. Preserve attribution in any research records that capture the work. Research selection does not weaken investigation attribution. Reuse does not establish freshness merely because the input has a following binding. [[Investigation attribution](decisions/research-question-driven-observation.md#investigation-attribution)]

Replace the complete bullet beginning “Make additions and removals”.

- Make additions and removals of underlying Projections visible as View composition changes. When replacing displayed information with a result based on newly captured material, expose the change of basis. Preserve the lineage needed by the investigation; research capture follows its selected question. Do not treat these as rendering-context changes or infer architectural relationships from presentation coordination or investigation lineage. [[View composition](decisions/research-question-driven-observation.md#results-over-captured-bases)]

Replace “Observation lifecycle and delivery” in full.

## Observation lifecycle and delivery

- Inadequacy feedback records experience; it neither establishes program truth nor changes an investigation, initiates work or applies a correction. Retain associated View/answer, subject, captured basis and investigation context where already available, without reconstruction or further investigation. Missing context does not prevent submission. Context-free feedback must not fabricate project, investigation Session or View context; its observation correlation identifier does not establish investigation context. [[Feedback observations](decisions/human-facing-architectural-representations.md#feedback-observations)]
- Submit feedback at its command completion through the selected observation destination under the existing delivery contract. Failure remains visible without invalidating the displayed result or preventing subsequent commands. Keep batches self-contained: include available displayed result artifacts, exact rendered output and associated context rather than references requiring earlier batches or a live store. Missing context stays explicit; no reconstruction is required. Observation history is not restored operational state. [[Feedback observations](decisions/human-facing-architectural-representations.md#feedback-observations)]

- Keep observation-sink selection independent of retention, migration, historical-reading, and producer-side cache policy. [[Observation lifecycle policy](decisions/adopt-identity-evidence-and-observation-constraints.md#keep-sink-selection-separate-from-observation-lifecycle-policy)]
- Make observation-delivery failure visible without invalidating an otherwise successfully produced view. [[Observation delivery failure](decisions/adopt-identity-evidence-and-observation-constraints.md#preserve-a-successful-view-when-observation-delivery-fails)]

- Choose research capture for the research question, with automatic recording where retrospective reconstruction would be unreliable. Ordinary non-research use need not produce or export research records. No comprehensive event taxonomy or field set is required for every use. Preserve or reference enough context for the intended interpretation, disclose relevant limits and deliver resulting research records to the designated research destination under the generated-output boundary. Do not treat ephemeral references as retained evidence. [[Research capture](decisions/research-question-driven-observation.md#research-capture)]

- Keep research collection distinct from architectural provenance, qualification, exact-answer continuity and investigation attribution. When recording Views or their changes, preserve or reference the composition, contributing bases and surrounding context needed for the research question; do not imply that displayed output establishes a complete captured basis. Required local investigation lineage is independent of research export. [[Qualified results](decisions/research-question-driven-observation.md#results-over-captured-bases)] [[Local context](decisions/research-question-driven-observation.md#retained-understanding-and-context)]

- The delivery-failure rule also applies to non-View resolution results and usage reports: expose observation-delivery failure without invalidating an otherwise delivered result. When recording these interactions, describe actual output, usage and outcome without a fabricated View or view-produced event. Choosing not to record is not a failed delivery. [[Request reporting](decisions/research-question-driven-observation.md#request-reporting)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]
- During early development, affected structured outputs can change directly under the temporary experimental-output policy, with specific accepted preservation clauses reconciled explicitly. Preserve semantic qualification and method provenance; experimental output schema strings do not establish supported compatibility versions. Observation batches remain explicitly versioned and experimental without a historical migration promise. [[Experimental outputs](decisions/experimental-structured-outputs.md)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

Replace the complete bullet beginning “Holding or passing resolved core support”.

- Holding or passing resolved core support internally is not human disclosure. Classify what each Presentation actually exposes, including expansions and exports; new exposed fields require boundary coverage independently of research recording. Source-bearing qualified content goes through its appropriate classified View. Non-View reports carry bounded request, reason and reference information; they must not become an unclassified source-export path. [[Qualified construction and disclosure](decisions/research-question-driven-observation.md#qualified-construction)] [[Actual exposure](decisions/research-question-driven-observation.md#actual-exposure)]

Replace the complete bullet beginning “Record actual human output”.

- When research captures human output, distinguish actual exposure, attribution disclosures, displayed source, recognized representation limits and submitted inadequacy feedback as applicable to the collected material. Detail access or source display does not itself establish inadequacy; machine acquisition is not human presentation. Preserve the context needed to interpret the record without treating syntax classification as a semantic adequacy test or reinterpreting historical observations. [[Actual exposure](decisions/research-question-driven-observation.md#actual-exposure)]

Replace the complete bullet beginning “Apply a Lens only where its method supports the subject and modality.” (decision-link update only).

- Apply a Lens only where its method supports the subject and modality. New architectural claims, including correspondence, conformance, contradiction and synthesized explanation, require core analysis and a qualified result. Request interpretation and presentation cannot independently derive those claims. This extends the existing program-claim boundary, including its permissions for arranging and counting supplied qualified populations, without adding evidence access. [[Architectural scope](decisions/research-question-driven-observation.md#results-over-captured-bases)]

Replace the complete bullet beginning “Obtain additional qualified information needed for request resolution through analysis, Evaluation, and” (decision-link update only).

- Obtain additional qualified information needed for request resolution through analysis, Evaluation, and core construction. Request interpretation must not independently derive program claims or the population used to resolve subjects. Preserve established candidates and consequential incompleteness, ambiguity, unavailability, or inability to resolve. [[Investigation initiation](decisions/research-question-driven-observation.md#investigation-attribution)]

Replace the complete bullet beginning “Distinguish the initiator of additional investigation from the actor authorizing its parent.” (decision-link update only).

- Distinguish the initiator of additional investigation from the actor authorizing its parent. Attribute request-scoped system-initiated work to an explicit parent and govern it by that request's purpose, constraints, and resource choices. [[Investigation initiation](decisions/research-question-driven-observation.md#investigation-attribution)]

Replace the complete bullet beginning “Treat work outside the parent's purpose or continuing after satisfaction or cancellation” (decision-link update only).

- Treat work outside the parent's purpose or continuing after satisfaction or cancellation as autonomous. Autonomous work requires human-authorized resource policies; defer work exceeding those policies or materially delaying an explicit request unless authorized. Hosted-service enablement alone is not autonomous resource authorization. [[Investigation initiation](decisions/research-question-driven-observation.md#investigation-attribution)]

Replace the complete bullet beginning “Carry actual normalized request and outcome information through publication rather than infer” (decision-link update only).

- Carry actual normalized request and outcome information through publication rather than infer it from a View. Usage reports and resolution results do not manufacture a program Lens, Projection or View. Preserve generating provenance on reuse and attribute current consumption separately. [[Actual reporting](decisions/research-question-driven-observation.md#request-reporting)] [[Current request-model conformance gaps](decisions/lens-application-and-request-outcomes.md#adoption-and-conformance)]

Replace the complete bullet beginning “Preserve each Projection's identity, subject, Lens, parameters, captured basis, qualification and relevant” (decision-link update only).

- Preserve each Projection's identity, subject, Lens, parameters, captured basis, qualification and relevant outcomes when coordinating it with others. Align or overlay only through correspondence already established by the inputs or an exact identity guarantee they supply. Displaying results together does not establish changes, correlations, conformance, contradictions or flows. [[Coordinated interface boundary](decisions/coordinated-views-and-qualified-results.md#coordinate-supplied-information-without-deriving-new-program-claims)] [[Captured bases](decisions/research-question-driven-observation.md#results-over-captured-bases)]

Replace the complete bullet beginning “For the current eagerly retained Projection families, a supported exact-presentation request names” (decision-link update only).

- For the current eagerly retained Projection families, a supported exact-presentation request names a retained answer and arranges its fixed qualified content without subject reselection, Evaluation or acquisition of additional evidence. Preserve its selected interpretation, correction/association state and relevant evaluation outcomes as well as its captured program basis. An incompatible target or need for information outside that answer produces an explicit refusal, never silent fresh selection. Report current presentation separately from the retained answer's analysis outcome; references remain subject to the supported Session lifetime. Session invalidation does not itself invalidate a historical answer over its captured basis; the current lifecycle can make that answer unavailable. [[Exact retained presentation](decisions/exact-retained-answer-presentation.md#request-an-exact-retained-answer)] [[Outcome reporting](decisions/research-question-driven-observation.md#retained-presentation)]

Replace the complete bullet beginning “Preserve the association of every Projection's claims and evidence with their captured” (decision-link update only).

- Preserve the association of every Projection's claims and evidence with their captured basis, including meaningful contribution roles or order, capture timing where applicable and relevant limitations. Program states retain their existing guarantees. Results and coordinated Views must not imply synchronized snapshots, complete capture, equivalent evidentiary bases or cross-account correspondence unless their basis supports those claims. [[Bindings and refresh](decisions/coordinated-views-and-qualified-results.md#preserve-immutable-results-under-bindings-and-refresh)] [[Broader basis attribution](decisions/research-question-driven-observation.md#results-over-captured-bases)]

Replace the complete bullet beginning “Under the initial unchanged-input session contract, detected relevant input changes invalidate further” (decision-link update only).

- Under the initial unchanged-input session contract, detected relevant input changes invalidate further investigation. Disclose best-effort detection and non-atomic capture; do not claim comprehensive freshness validation. [[Input stability](decisions/research-question-driven-observation.md#validity-and-recording)]
