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

## Document scope

Alongside the product reconciliation, the application specification removes duplicated development-process guidance and consolidates repeated explanations; the accepted division of design responsibility remains in [Application specification boundaries](../decisions/application-specification-boundaries.md) and development guidance. The source-navigation origin wording generalizes to the known origin of a supplied reference, retaining established provenance without requiring a source browser. These edits do not change the development workflow.

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

Before removing excerpts, inventory the useful information for which each excerpt is the only human-readable carrier. Expose that information as qualified labels or conceptual descriptions using already established records. Dependency non-edge requests must identify their written specifier, such as `./missing` or `lodash/fp`, with target status and provenance; location alone is insufficient. Inspect declaration/export detail for the same loss of names or other intelligible information. This preserves information, not source syntax as an explanation.

Remove programming-language source excerpts and declaration text from this detail output. Apply the same behavior to human-facing text and JSON, fresh requests, exact retained presentation, continuations, and embedded or coordinated views, including internal extension presentations used to verify the contracts. Intelligible assertions, labels and evidence originating in source remain eligible; this is not a rule against source-derived text. Do not discard useful non-source information merely because it shares a record or container with an excerpt.

Update command help, option validation, supported-choice reporting and continuation instructions to the renamed behavior. Reject `--source-detail` with guidance to use `--more-details`; it must not remain a source-bearing alias. Preserve exact retained-answer selection, support, identity and qualification. More detail must not acquire new evidence, rerun interpretation or refresh selection inside presentation. Preserve source acquisition, captured evidence, source coordinates and mappings for analyses and agents through their existing interfaces. A new exceptional source-display interaction or agent export protocol is not required.

<a id="human-output-conformance"></a>
### Make existing human output intelligible

Assess the existing module, organization, dependency and investigation outputs, including documentation assertions, supporting detail, qualifications, referent descriptions, correction and inconsistency reasons, request outcomes and diagnostics. Apply the audience contract to public CLI text and JSON, including non-View output and failures.

Correct demonstrated reliance on source-language knowledge. Express supplied semantic information and qualifications through computational and architectural concepts without inferring new program properties. Preserve meaningful names, references, diagnostic identifiers, evidence attribution and intelligible original messages. Explain relevant language-specific limits rather than merely deleting them. For a failure, make the problem, consequence and available next action intelligible without requiring source editing by the human; the human may direct a coding agent to perform repairs.

When PostCode recognizes that the available information or representation cannot meet a need adequately, disclose that limitation and preserve independently intelligible qualified content. Distinguish unavailable information from an inadequate representation. Do not substitute source, unqualified assertions or confident unsupported prose. A material qualification that cannot be conveyed adequately is itself a representation limit; do not silently drop it or present the affected claim without it.

Update investigator guidance to state the presumed human competence and human-output requirements across all generated human-facing content. Complete the minimum deterministic coverage and real investigator sample below, and remedy failures found within that coverage. Preserve attempt attribution of the actual instructions and method so an instruction change is not mistaken for a change in the program. Free-form output and text originating in source are not inherently defective; a general syntax detector, blanket code-token scrubber or automatic rejection of all source-derived text is not required. Rendering must not silently generate a new architectural explanation or rewrite retained interpretation.

<a id="inadequacy-feedback"></a>
### Provide simple inadequacy feedback

Provide a simple feedback command in the interactive shell and as a one-shot invocation. Both record an inadequacy report with optional explanation; neither requires the human to supply an explanation or report inadequacy before continuing.

In the shell, feedback concerns the most recently displayed result and retains its associated View or exact answer, subject, captured basis and investigation context where already available. Use the context of what was displayed, rather than rerunning its request or selecting a newer result. Feedback acknowledgments do not replace that investigation result; consecutive reports therefore target the same result until another investigation result is displayed. If no associated context is available, the report is still accepted. Other context may be included when available without undue effort and likely to help interpret the feedback.

One-shot feedback has no associated prior-result or investigation context and does not require opening a project or enabling an investigator. Submit it without requiring a receipt, historical lookup, reopening an investigation, reconstructing context or keeping an earlier Session alive. Use the existing one-shot observation correlation model without opening an analysis Session. Its invocation identifier and command ordinal do not imply that an earlier answer, project or captured basis is known. Context-free reports must be discoverable under the existing observation root and identifiable as context-free; directory naming remains an implementation choice.

Recording feedback does not otherwise change the investigation, trigger analysis or refresh, alter selection, make corrections, or direct an agent to change the program. Submit through the existing observation destination at feedback-command completion under the existing delivery contract; awaiting local sink acceptance is permitted. Failure is disclosed without invalidating the displayed result or preventing subsequent commands. No new asynchronous delivery queue is required. Preserve self-contained batches by including the available displayed artifact, exact rendered output and associated subject, qualification, basis and investigation context. A reference into a prior batch or transient store alone is insufficient. Use already available artifacts without new capture, reconstruction, analysis or rendering; disclose missing context. Ordinary invocation correlation and destination grouping must not be represented as unavailable investigation or project context. Exact command syntax, acknowledgment wording and delivery mechanics are implementation choices within these requirements.

<a id="observations-and-documentation"></a>
### Reconcile observations and interface documentation

Record actual presented output, attribution disclosures, recognized representation limits and submitted inadequacy feedback with the available context. Distinguish these from machine evidence acquisition and any display of source as source. More-detail access is neither a subjective inadequacy report nor proof that a representation failed. Do not manufacture a View or investigation context for context-free feedback. Keep actual-exposure classification across expansions and exports; non-View reports must not become an unclassified source-export path.

Replace the source-escape interpretation of current observation events with meanings appropriate to the new behavior. Reuse useful existing metadata where it remains accurate; historical observations keep their original meaning. Record a nonconforming output truthfully if one occurs. Event names, record layouts and necessary experimental format-version changes are implementation decisions, not requirements for a new observation subsystem.

Include the disclosure-classification assessment raised by the [module-investigation review](../../records/reviews/module-investigation/2026-09-29-milestone-2-round-3-findings.md): assess attribution outside explicit detail fields, including paths in JSON context and non-View output, under the human output boundary.

Update descriptive documentation and implementation conventions as implementation deliverables, once the resulting behavior is verified. These are not document replacements promoted with the governing proposal:

| Document | Required update |
| --- | --- |
| [User README](../../README.md), [CLI reference](../cli-reference.md), command help and [status](../../STATUS.md) | Replace source-escape instructions with `--more-details`, document old-flag rejection and feedback syntax, and describe the supported behavior and limits. Preserve useful existing section anchors. |
| [Capability reference](../capability-reference.md) | Describe additional detail and shell/context-free feedback, with accurate invocation prerequisites and observation behavior. Retain the distinction between supporting accumulation mechanisms and unresolved accumulation UX. |
| [Architecture overview](../architecture/README.md) and [investigation architecture](../architecture/investigation.md) | Update exposure/feedback events, command delivery and worker participation, actual observation format and available context. Preserve the implemented exact-retained-answer boundary and disclosed captured-basis/navigation gaps. |
| [Implementation conventions](../implementation-conventions.md) | Rename source-detail presentation, preserve current bounds and evidence acquisition, document the context-free destination and invocation correlation, scope project-opening/analysis-worker requirements to investigation, and update actual experimental format versions. Retain existing local sink privacy, acceptance and output-exclusion rules. |

Describe exposure categories without implying automatic detection of arbitrary source-like prose. Format versions, event layouts and feedback syntax are chosen during implementation. Document the capabilities and output cases assessed rather than claiming exhaustive semantic correctness.

<a id="implementation-verification"></a>
### Verification and completion criteria

#### Deterministic output and delivery checks

The following is minimum coverage, not a selectable menu. Use automated tests for these paths in public text and JSON. Assess shared qualification rendering across module, organization, dependency and internal-export families; cover fresh and retained output where both are supported. Test expected meaning and preservation of qualifications rather than requiring one exact prose template.

| Known case or path | Required observable outcome |
| --- | --- |
| `Encountered TypeScript diagnostic: TS2307` and other diagnostic-code-only rendering | An intelligible problem and its effect on the answer, with the original diagnostic identifier and useful message/provenance retained. A bare diagnostic code does not suffice. |
| Project opening fails with `TS1005: '}' expected` | Explain that configuration cannot be read because it is malformed, what investigation cannot proceed, and that the coding agent can repair it. Retain useful locations/identifiers; do not require the human to parse or edit syntax. |
| `Program external-module SourceFiles` / `visible named ambient-module symbols` population qualification | Describe which module population is covered and which categories are not established in computational terms. Preserve the method's actual scope rather than replacing it with a generic uncertainty warning. |
| `Defined ESM format overrides ambient declarations; preserve requires callable ambient corroboration` and related dependency caveats | State the relevant dependency-recognition limits intelligibly, preserving precedence and missing-evidence qualifications. Do not imply runtime loading or execution from source-form recognition. |
| `checker-symbol`, `configured-file-resolution`, `esm/commonjs`, target status and type-only markers | Explain resolution basis and relationship meaning where needed; retain identifiers as labels/provenance without requiring their spelling to convey the meaning. |
| Non-edge requests and declaration/export detail after excerpt removal | The requested module's written specifier, useful names, status and other excerpt-only information remain intelligible. Test an unresolved relative request and a package/subpath request. No source excerpt is needed to identify either. |
| Documentation assertions and filtering | Preserve intelligible source-derived assertions, their asserted status, attribution and omissions. Include a useful assertion adjacent to source syntax and inspect useful content omitted by current filtering. |
| Request-resolution, worker and hosted-service failures | Give intelligible reasons, consequences and available next action while preserving failure category, provenance and credential protections. Non-View reports remain bounded reports, not source exports. |

Also verify:

- `--more-details` preserves useful non-source information while omitting source excerpts and declaration text across supported families, embedded views, text/JSON, fresh/retained requests and continuations. Old-flag guidance uses the new control.
- Analysis and agent access retain captured source. Exact presentation preserves frozen selection and support through intervening associations or corrections, with no fresh acquisition or interpretation.
- Shell feedback includes the displayed result's available artifacts and context even if newer information exists. Consecutive reports retain the same target. Missing context and omitted explanation are accepted without investigation or selection changes. One-shot feedback opens no project or investigator.
- Feedback uses the existing command-completion delivery path. Failure is visible and leaves the displayed result and subsequent shell use intact. Each batch can be read independently; it distinguishes feedback, additional-detail access, recognized limits and machine acquisition. No prior store or batch is needed to interpret included context.
- Relevant automated checks and integrated regression tests pass, and the documentation above matches supported behavior.

#### Generated-output sample and assessment

Controlled investigator substitutes verify acceptance, retention, correction and rendering mechanics; they do not establish generation quality. In addition, run a bounded real-investigator journey covering `summarize`, `explain`, `decompose` and `examine` on a small documented TypeScript fixture. Choose or adapt a fixture with cross-module responsibility, an intelligible documentation assertion and an uncertain or language-specific analysis limit. Identify the fixture, captured basis, operations, provider/model, actual instructions and all run outcomes in the assessment record. Include at least one completed result for each operation; retained reuse is not another generation sample. Include failed attempts and any reruns rather than selecting only favorable outputs. Fixture details and any additional cases remain implementation choices.

Assess each sample's main interpretation, referent information and qualifications against this rubric:

- A human with the presumed architectural/computational competence can state the claim and its limits without deciphering programming-language syntax.
- Source-derived assertions and labels remain useful, attributed and epistemically qualified. A raw signature as a contract explanation or an unexplained source expression as justification fails this criterion.
- Computational language preserves the evidence and scope. An unsupported prose gloss, hidden material qualification or overconfident explanation fails even if it contains no code.
- An unmet need is disclosed intelligibly; a display of source does not resolve it. A representation limit remains distinguishable from an analysis failure.

Include a correction/inconsistency case when naturally produced. Exercise those less predictable generated fields with controlled inputs as well, recording that this verifies handling rather than real-model production. Retain the actual outputs and a case-by-case assessment against the rubric for human review in the normal implementation review. Remedy observed failures and repeat affected cases before claiming this bounded assessment passes. If real runs are unavailable or an operation produces no assessable result, record that coverage as incomplete rather than substituting a scripted result. This sample supports only the stated coverage, not universal semantic correctness or a statistical reliability claim.

A disclosed inability to answer a particular architectural question can conform to the specification; a known violation in a supported interaction cannot be called complete merely because it is documented.

This work does not implement structured interpretation schemas, account selection, accumulated-understanding UX, persistence, cross-state correspondence, a new agent protocol, or general View-history infrastructure. Permitting structured interpretation is a document change; existing prose is a valid representation. Existing broader context-attribution and navigation-lineage gaps are not silently resolved by feedback: use the context actually available without reconstructing missing history. The principal risks are loss of useful detail, weakened qualifications, hidden fresh analysis during presentation, and feedback delivery changing investigation behavior; the checks above address those risks.

## Architectural accounts: remove the obstacle, leave the design open

Structured accounts carried as investigram content are a promising hypothesis. Existing retention, evidence, associations and replacements offer suitable mechanisms; a working account might comprise several selected investigrams, with content shapes driven by selected architectural representations. The prose-only definition unnecessarily obstructs exploration. The [structured-content decision](../decisions/structured-investigram-content.md) generalizes that definition while preserving qualification, inspection, follow-up, citation and correction contracts.

Fixed composition describes one produced result; it need not govern every grouping humans select later. The choice not to require a canonical architecture model does not prohibit partial accounts. Typed result/Presentation compatibility, immutable references, complete correction context and generated-output separation impose useful obligations. Current prose fields, validation, context delivery, paging and rendering must support those contracts if structured content is implemented; they do not by themselves justify a new account store.

Detailed account design and review of information placement remain separate work. The [account exploration candidate](../backlog.md#explore-architectural-accounts-through-journeys) uses concrete journeys to determine schemas, selection, correspondence and representation needs. A bounded same-Session experiment can use the existing lifecycle; reuse across changed captures or restarts requires separate lifecycle, basis and correspondence decisions. The [more-details review](../backlog.md#review-more-details-information-placement) addresses information organization after the minimal conformance change.

## Reviewable outcome, promotion and verification

The companion decisions are [Human-facing architectural representations](../decisions/human-facing-architectural-representations.md) and [Allow structured investigram content](../decisions/structured-investigram-content.md). Promotion covers the governing application/architecture documents, decisions, backlog and affected decision/index metadata. Descriptive documentation and implementation conventions are deliverables of implementation. The feedback decision replaces the deferral of subjective reporting while preserving existing command-scoped correlation and delivery.

Promotion follows the [planning workflow](../../dev/planning.md#promotion-and-disposal). This package also corrects the retained-answer plan and index to completed status; it does not supersede that implementation. Descriptive documentation and conventions are updated by the implementing task against the delivered behavior.

Existing captured-basis observation attribution and navigation-origin gaps remain independently tracked; do not treat this work as resolving them or rely on newly collected observations for state-specific assessment before necessary basis attribution is established.
