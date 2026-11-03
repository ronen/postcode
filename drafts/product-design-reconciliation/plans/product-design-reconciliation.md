# Reconcile the application with the architectural working premise

Status: in review
Created: 2026-10-29
Updated: 2026-11-03

## Purpose and scope

Humans practice software design and architecture through PostCode; coding agents implement the software. The [adopted product design](../../foundation/product-design.md) presumes computational and architectural understanding without programming-language literacy. Human understanding must not depend on programming-language source or syntax. This is a semantic restriction: intelligible assertions, labels and evidence from source artifacts may be presented with their provenance and epistemological status preserved. A code excerpt the human must decipher does not answer an architectural question.

Reconcile the application specification, governing architecture and still-binding decisions with that premise, and implement the minimum changes needed for the supported application to conform to the reconciled requirements. Required work includes replacing the source escape, remedying demonstrated human-output conflicts, and providing inadequacy feedback. Completion requires verified implementation as well as document reconciliation. Structured-account UX and architecture remain subsequent design work. Foundation and development-instruction changes are outside scope.

<a id="assessed-baseline"></a>
## Assessed baseline

The assessed implementation is revision `5525bf9ccf8b4df46d28295fe70d8fad4e645a44`; the governing product design is assessed at `2410a9855a5303217bf93d9872090dd68ecf43ed`. Evidence consists of source, tests, descriptive documents and accepted/historical records, including command parsing, publication, shell behavior, investigation instructions, qualification wording and observation delivery. No application tests or hosted investigations were run for this assessment; existing tests and recorded outputs are evidence of recorded behavior and intended coverage, not fresh verification.

The assessment identifies explicit source-escape behavior and semantic risks in other output paths. Those risks require verification against actual representations and journeys; the presence of unrestricted text or absence of syntax filtering does not by itself establish nonconformance.

Exact retained-answer presentation **is implemented**. The [completed task](../../records/tasks/2026-10-26-exact-retained-answer-presentation.md) records 609 passing tests at its final implementation revision and human acceptance. [Retained presentation](../../src/lib/retained-presentation.ts) resolves the exact Projection and fixed support, checks compatibility and arranges without fresh subject selection or Evaluation. [Continuity tests](../../test/investigation-selection.test.ts) exercise intervening corrections and associations; [family tests](../../test/retained-presentation.test.ts) cover mechanical/composite families, refusals, invalidation and worker publication. The [implemented architecture](../architecture/README.md) describes the same boundary.

Preserve those mechanisms. The retained-answer plan and index need a lifecycle correction to reflect the completed task. Exact retained presentation is not persistence, arbitrary multi-Projection composition, cross-state correspondence, general View history or complete captured-basis export.

## Contradictions and document changes

| Finding | Reconciliation |
| --- | --- |
| The application offers conventional source as an escape when conceptual capabilities are inadequate. | Replace that fallback with representation-limit disclosure and optional inadequacy feedback. Retain intelligible source-derived assertions, evidence and mappings; a source excursion cannot substitute for an adequate account. |
| Earlier decisions permit or require syntax-oriented human detail and record source excursions as development feedback. | Narrowly supersede those commitments. Preserve capture, qualification, useful detail, actual-output observations and agent access. Provenance access does not establish inadequacy, and exposure classification does not establish intelligibility. |
| The specification understates the presumed architectural competence and working vocabulary. | State the audience and architectural purpose. Use established concepts and notations with qualified applicability, without a universal ontology. |
| Investigram and related contracts refer specifically to interpretation prose. | Define interpretation content as prose, structured content, or a combination, including embedded prose. Apply the existing qualification, retention, inspection, follow-up, citation and correction contracts to all of it without selecting a schema. |
| Accumulated architectural understanding is not stated as a required application capability. | Require partial, qualified understanding to accumulate across investigations, while leaving its UX and supporting architecture unresolved. Permit overlapping accounts and structured interpretation without selecting an account model or promising persistence. |
| Implementation descriptions and conventions reflect source excursions. | Describe the actual baseline and targeted semantic gaps. Do not relabel all source-derived text as defective or claim runtime conformance through promotion. |

## Suitable concepts and mechanisms

Retain Lens/Projection/Presentation/View, open-ended Subject, Claim and Claim context, source Evidence, Facet, Evaluation, Session, Workspace and investigation context. The conceptual/implementation distinction is useful; “language-specific” does not mean “unfit for human reasoning.” A compiler may establish a property whose meaning can be conveyed architecturally. Conversely, relabelling a raw signature as a contract does not make it an architectural representation.

Keep immutable evidence/results, exact references, captured support, explicit associations, fixed result composition, follow-up provenance, replacement history, conflicting corrections and citation-based reconsideration. Existing accounts are useful qualified interpretation, not a complete architecture. Qualification cannot be hidden to make a view simpler. Read-only Views and human instructions to coding agents remain the development model.

Keep qualified construction separate from arrangement. New architectural synthesis or inferred correspondence requires analysis and a qualified Projection; selecting or arranging supplied accounts need not manufacture new claims. Keep generated outputs distinct from independent repository evidence. An earlier account can be reused as interpretation without its repetition corroborating itself.

## Human representation and source access: actual scope

Replacing the explicit source escape is bounded work within a broader conformance change covering explanations, qualifications, diagnostics, feedback and observation delivery. The following inventory identifies the affected surfaces; the [implementation specification](#implementation-specification) defines the required outcomes.

| Surface and inspected evidence | Current finding | Implementation implication |
| --- | --- | --- |
| [Module](../../src/lib/presentation.ts), [dependency](../../src/lib/dependencies/presentation.ts), [organization](../../src/lib/organization/presentation.ts), [internal exports](../../src/lib/exports/presentation.ts) and [investigation presentation](../../src/lib/investigation/presentation.ts) | Explicit detail can display captured excerpts, declarations/forwarders and serialized support; organization detail also contains paths and metadata. Fresh and retained routes reach these arrangements. | Apply [more-details](#more-details) across these families and delivery paths; preserve useful non-source information, including dependency requests that did not establish edges. |
| Declarations and signatures | Declaration snippets come from captured spans, sometimes expanded to enclosing statements. No dedicated raw-signature renderer was found in the inspected symbol/export path; it reports names, roles and declaration counts. | Keep names, roles and counts. Assess declarations used as explanations under [human-output conformance](#human-output-conformance); deriving a new contract requires analysis. |
| [Documentation presentation](../../src/lib/documentation-view.ts) | Strips triple-backtick blocks and example/see tags before displaying remaining assertions. This is a formatting heuristic, not a test of comprehension. | Assess representative assertions and content omitted by current filtering under [human-output conformance](#human-output-conformance), preserving useful qualified content. |
| [Investigation acceptance](../../src/lib/investigation/acceptance.ts), [instructions](../../src/lib/investigation/execute.ts), [contracts](../../src/lib/investigation/contracts.ts) and presentation | Structural/reference validation and terminal escaping preserve free-text prose, referents, qualifications and correction reasons. Instructions do not explicitly establish the human audience premise. | Add the audience contract to generation guidance and assess representative outputs under [human-output conformance](#human-output-conformance). |
| [Command execution](../../src/lib/command-execution.ts), [project opening](../../src/lib/typescript/project.ts), [worker errors](../../src/lib/session-protocol.ts), request reporting and hosted failures | Normal module qualifications include compiler-specific terminology and diagnostic codes/categories. Project-open failures can be expressed only as syntax such as “'}' expected”; other paths show supplied reasons. | Make the problem, consequence and available next action intelligible under [human-output conformance](#human-output-conformance), while preserving useful original messages and provenance. |
| [Disclosure classification](../../src/lib/source-disclosure.ts) and [observations](../../src/lib/observations.ts) | Known fields are classified by format as locations/excerpts. This describes exposure, not comprehension or inadequacy. | Reconcile event meanings under [observations and documentation](#observations-and-documentation); exposure classification is not an adequacy test. |
| JSON and agent APIs | Public CLI text and JSON are human-facing Presentations; core/investigator evidence interfaces have a distinct machine-facing contract. | Apply the human output boundary to public CLI formats while preserving existing machine evidence contracts. |

<a id="implementation-specification"></a>
## Implementation specification

Deliver the following outcomes together with the document reconciliation, within the existing architecture.

<a id="more-details"></a>
### Replace source escape with more details

Replace the public `--source-detail` option with `--more-details`. Preserve the additional qualified information currently available through the option, including dependency requests that did not establish edges, attribution, locations, implementation mappings and organization metadata. Keep its current placement and display bounds for this minimal change. The [later placement review](../backlog.md#review-more-details-information-placement) can decide which information belongs in default output or other interactions.

Remove programming-language source excerpts and declaration text from this detail output. Apply the same behavior to human-facing text and JSON, fresh requests, exact retained presentation, continuations, and embedded or coordinated views, including internal extension presentations used to verify the contracts. Intelligible assertions, labels and evidence originating in source remain eligible; this is not a rule against source-derived text. Do not discard useful non-source information merely because it shares a record or container with an excerpt.

Update command help, option validation, supported-choice reporting and continuation instructions to the renamed behavior. Preserve exact retained-answer selection, support, identity and qualification. More detail must not acquire new evidence, rerun interpretation or refresh selection inside presentation. Preserve source acquisition, captured evidence, source coordinates and mappings for analyses and agents through their existing interfaces. A new exceptional source-display interaction or agent export protocol is not required.

<a id="human-output-conformance"></a>
### Make existing human output intelligible

Assess the existing module, organization, dependency and investigation outputs, including documentation assertions, supporting detail, qualifications, referent descriptions, correction and inconsistency reasons, request outcomes and diagnostics. Apply the audience contract to public CLI text and JSON, including non-View output and failures.

Correct demonstrated reliance on source-language knowledge. Express supplied semantic information and qualifications through computational and architectural concepts without inferring new program properties. Preserve meaningful names, references, diagnostic identifiers, evidence attribution and intelligible original messages. Explain relevant language-specific limits rather than merely deleting them. For a failure, make the problem, consequence and available next action intelligible without requiring source editing by the human; the human may direct a coding agent to perform repairs.

When PostCode recognizes that the available information or representation cannot meet a need adequately, disclose that limitation and preserve independently intelligible qualified content. Distinguish unavailable information from an inadequate representation. Do not substitute source, unqualified assertions or confident unsupported prose. A material qualification that cannot be conveyed adequately is itself a representation limit; do not silently drop it or present the affected claim without it.

Update investigator guidance to state the presumed human competence and human-output requirements across all generated human-facing content. Evaluate representative generated results and remedy demonstrated failures using proportionate measures. Free-form output and text originating in source are not inherently defective; a general syntax detector, blanket code-token scrubber or automatic rejection of all source-derived text is not required. Rendering must not silently generate a new architectural explanation or rewrite retained interpretation.

<a id="inadequacy-feedback"></a>
### Provide simple inadequacy feedback

Provide a simple feedback command in the interactive shell and as a one-shot invocation. Both record an inadequacy report with optional explanation; neither requires the human to supply an explanation or report inadequacy before continuing.

In the shell, feedback concerns the most recently displayed result and retains its associated View or exact answer, subject, captured basis and investigation context where already available. Use the context of what was displayed, rather than rerunning its request or selecting a newer result. Feedback acknowledgments do not replace that investigation result. If no associated context is available, the report is still accepted. Other context may be included when available without undue effort and likely to help interpret the feedback.

One-shot feedback has no associated prior-result or investigation context and does not require opening a project or enabling an investigator. Submit it without requiring a receipt, historical lookup, reopening an investigation, reconstructing context or keeping an earlier Session alive. Ordinary observation metadata does not imply that an earlier answer or captured basis is known.

Recording feedback does not otherwise change the investigation, trigger analysis or refresh, alter selection, make corrections, or direct an agent to change the program. Submit through the existing observation destination and applicable delivery policy. Preserve self-contained observation batches; ordinary invocation correlation and destination grouping must not be represented as unavailable investigation or project context. The human can continue investigation without waiting for delivery; failure is disclosed without invalidating the displayed result or blocking continued use. Report submission and delivery outcomes truthfully, including on command/session completion. Exact command syntax, acknowledgment wording and delivery mechanics are implementation choices within these requirements.

<a id="observations-and-documentation"></a>
### Reconcile observations and interface documentation

Record actual presented output, attribution disclosures, recognized representation limits and submitted inadequacy feedback with the available context. Distinguish these from machine evidence acquisition and any display of source as source. More-detail access is neither a subjective inadequacy report nor proof that a representation failed. Do not manufacture a View or investigation context for context-free feedback.

Replace the source-escape interpretation of current observation events with meanings appropriate to the new behavior. Reuse useful existing metadata where it remains accurate; historical observations keep their original meaning. Record a nonconforming output truthfully if one occurs. Event names, record layouts and necessary experimental format-version changes are implementation decisions, not requirements for a new observation subsystem.

Include the disclosure-classification assessment raised by the [module-investigation review](../../records/reviews/module-investigation/2026-09-29-milestone-2-round-3-findings.md): assess attribution outside explicit detail fields, including paths in JSON context and non-View output, under the human output boundary.

Update the CLI and capability references, help, implementation conventions, project status and affected descriptive architecture to describe the implemented behavior and its limits. The capability-reference and architecture revisions describe the required delivered behavior and are published as current descriptions only after verification. Keep the assessed baseline in this plan; finalize feedback syntax, actual format versions and implementation-specific descriptions during implementation. Preserve existing section anchors where renamed sections retain their meaning. Preserve the distinction between implemented exact retained presentation and future accumulation UX. Document the scope actually assessed rather than claiming exhaustive semantic correctness of unrestricted generated text.

<a id="implementation-verification"></a>
### Verification and completion criteria

Use existing fixtures and controlled investigator substitutes where suitable, with representative human review of semantic adequacy. Verification must establish:

- `--more-details` preserves the previously available non-source information, attribution, mappings and qualifications while omitting the former source excerpts and declarations. Cover supported families, embedded views, text and JSON, fresh and retained requests, and continuations.
- Analyses and agents still obtain the same captured source evidence. Exact presentation retains its frozen answer and support through intervening associations or corrections and performs no fresh acquisition or interpretation.
- Positive preservation cases retain intelligible source-derived assertions and useful diagnostics with their status and provenance. Negative cases include a raw signature used as a contract explanation, an unexplained source expression used to justify behavior, compiler-specific qualification without intelligible meaning, and a diagnostic that requires the human to decipher syntax. An unsupported prose gloss also fails.
- Generated main prose, referents, qualifications and correction/inconsistency reasons follow the same audience contract. Disclosed representation limits remain distinguishable from failed analysis and from unsupported certainty. Record the cases and scope assessed; a syntax scan alone is not verification.
- Shell feedback refers to the displayed result even if newer information exists, preserves available context, permits an omitted explanation, and triggers no investigation work or selection change. One-shot feedback and shell feedback without prior context submit successfully without invented context.
- Delayed or failed feedback delivery does not block continued investigation, change the result or silently lose the failure indication. Observation contents distinguish feedback, detail access, limitations and machine acquisition, including failure and context-free paths.
- Relevant automated checks and integrated regression tests pass, and interface documentation matches the resulting supported behavior.

A disclosed inability to answer a particular architectural question can conform to the specification; a known violation in a supported interaction cannot be called complete merely because it is documented.

This work does not implement structured interpretation schemas, account selection, accumulated-understanding UX, persistence, cross-state correspondence, a new agent protocol, or general View-history infrastructure. Permitting structured interpretation is a document change; existing prose is a valid representation. Existing broader context-attribution and navigation-lineage gaps are not silently resolved by feedback: use the context actually available without reconstructing missing history. The principal risks are loss of useful detail, weakened qualifications, hidden fresh analysis during presentation, and feedback delivery changing investigation behavior; the checks above address those risks.

## Architectural accounts: remove the obstacle, leave the design open

Structured accounts carried as investigram content are a promising hypothesis. Existing retention, evidence, associations and replacements offer suitable mechanisms; a working account might comprise several selected investigrams, with content shapes driven by selected architectural representations. The prose-only definition unnecessarily obstructs exploration. The [structured-content decision](../decisions/structured-investigram-content.md) generalizes that definition while preserving qualification, inspection, follow-up, citation and correction contracts.

Fixed composition describes one produced result; it need not govern every grouping humans select later. The choice not to require a canonical architecture model does not prohibit partial accounts. Typed result/Presentation compatibility, immutable references, complete correction context and generated-output separation impose useful obligations. Current prose fields, validation, context delivery, paging and rendering must support those contracts if structured content is implemented; they do not by themselves justify a new account store.

Detailed account design and review of information placement remain separate work. The [account exploration candidate](../backlog.md#explore-architectural-accounts-through-journeys) uses concrete journeys to determine schemas, selection, correspondence and representation needs. A bounded same-Session experiment can use the existing lifecycle; reuse across changed captures or restarts requires separate lifecycle, basis and correspondence decisions. The [more-details review](../backlog.md#review-more-details-information-placement) addresses information organization after the minimal conformance change.

## Reviewable outcome, promotion and verification

The companion decisions are [Human-facing architectural representations](../decisions/human-facing-architectural-representations.md) and [Allow structured investigram content](../decisions/structured-investigram-content.md). Revisions target the governing application/architecture documents, implementation conventions, descriptive documentation, the remaining exploratory backlog and affected decision/index metadata. Supersession also covers the earlier deferral of subjective feedback and the Session-correlation and delivery-timing clauses affected by context-free, nonblocking feedback.

Promotion follows the [planning workflow](../../dev/planning.md#promotion-and-disposal). This package also corrects the retained-answer plan and index to completed status; it does not supersede that implementation. Descriptive capability and architecture revisions accompany verified implementation.

Existing captured-basis observation attribution and navigation-origin gaps remain independently tracked; do not treat this work as resolving them or rely on newly collected observations for state-specific assessment before necessary basis attribution is established.
