# Adopt identity, evidence, and observation constraints

Status: accepted
Decided: 2026-09-14
Arising from: the adopted [product design](../../foundation/product-design.md), [initial projection architecture decisions](initial-projection-architecture-decisions.md), [initial module inventory decisions](initial-module-inventory-decisions.md), and [initial observation recording decisions](initial-observation-recording-decisions.md)
Scope: identity, generated output, observations, and source evidence across PostCode

## Context

The initial PostCode slice established deterministic analysis identity, an evidence boundary for PostCode-generated output, a separate observation lifecycle, visible non-blocking observation delivery failure, and explicit source-escape evidence. These rules arise from the adopted product design and accepted initial decisions, but later implementation should not have to reconstruct their cross-cutting force from slice-specific records or representations.

The constraints must preserve the meaning demonstrated by the initial slice without making its current filesystem layout, TypeScript source-span representation, CLI presentation, or observation schema into universal architecture.

## Decisions

### Make analysis identity independent of invocation identity

#### Decision

Include every analysis method version capable of changing the claims in analysis-snapshot identity. Keep program-record identity and deterministic structured projection output independent of invocation-specific values such as clocks and random observation UUIDs.

#### Rationale

Equivalent analysis inputs and methods should reproduce the same logical records and structured projection regardless of when or in which observation-producing invocation they were evaluated. Method changes capable of changing claims must instead create a distinguishable analysis context.

#### Alternatives considered

- Include timestamps or observation identities in program-record identity: rejected because equivalent analyses would produce different logical records for reasons unrelated to the program information.
- Omit method versions from snapshot identity: rejected because materially different analysis semantics could then appear to describe the same snapshot.

#### Consequences

- Invocation and observation records may use clocks and random UUIDs without affecting program-information identity.
- Implementations must update the applicable identity method version when analysis semantics change.

### Exclude generated output through an explicit evidence boundary

#### Decision

Keep PostCode-generated output outside the analyzed repository or exclude it from repository evidence through an explicit, enforced PostCode policy. Do not infer exclusion merely from generic directory names, Git-ignore status, or markings in the content.

#### Rationale

Rediscovering PostCode's own output as independent evidence creates a feedback loop and can strengthen or multiply claims without a new source. An explicit PostCode policy may reserve and enforce an output location, but generic repository conventions and content self-description do not establish that boundary.

#### Alternatives considered

- Exclude conventional generated-directory names automatically: rejected because a subject project may intentionally contain analyzable sources under those names.
- Treat Git-ignored content as generated output: rejected because ignore policy does not determine whether content is valid program evidence.
- Trust markings within content to establish exclusion: rejected because content does not define the analysis boundary, whether or not its markings are authentic.
- Rely on a generation-time location being supplied again to later analyses: rejected because forgetting or losing that transient input would allow PostCode output to re-enter repository evidence.

#### Consequences

- PostCode may adopt explicit policies for reserved or configured output locations, provided the applicable policy remains available and enforced when later analysis occurs.
- Generated content may remain inside a subject repository only when such a policy excludes it before every applicable analysis.

### Keep sink selection separate from observation lifecycle policy

#### Decision

Selecting an observation sink does not by itself establish retention, migration, historical-reading, or producer-side cache policy.

#### Rationale

An observation producer and a destination for one submitted batch do not determine how accepted observations are retained, queried, migrated, or reused. Coupling those concerns would make development-sink selection silently establish durable application policy.

#### Alternatives considered

- Give every sink one producer-defined lifecycle: rejected because development, discard, research, and archival sinks can have materially different responsibilities.
- Treat accepted observation batches as an application cache: rejected because observation evidence and current program information have different validity and ownership.

#### Consequences

- Sinks define their own post-acceptance lifecycle within their contracts.
- Observation retention and program-analysis caching remain separate choices even if they later share physical infrastructure.

### Preserve a successful view when observation delivery fails

#### Decision

Make failure to deliver an observation visible without invalidating an otherwise successfully produced view.

#### Rationale

Silent delivery loss would misrepresent observation coverage, while converting a valid view into an analysis failure would make program information depend on the health of a separate observation sink.

#### Alternatives considered

- Ignore delivery failure: rejected because the apparent observation record would be incomplete without disclosure.
- Fail the successfully produced view: rejected for the current policy because sink availability is distinct from analysis and projection success.

#### Consequences

- The user can continue with a valid view while seeing the observation gap.
- A future stricter research environment may adopt a different operational policy without redefining view validity.

### Present source evidence from captured analysis input

#### Decision

Derive source evidence shown for a claim from the captured analysis input supporting that claim, not from a later filesystem read that may observe different content.

#### Rationale

If presentation rereads a changing filesystem, the displayed excerpt may no longer be the evidence from which the claim was derived. Captured input keeps the claim, source detail, and analysis snapshot coherent.

#### Alternatives considered

- Reread source files when rendering: rejected because later content could be presented as support for a claim derived from an earlier state.
- Omit source excerpts entirely: rejected because bounded source detail is a legitimate investigation and verification mechanism.

#### Consequences

- Language integrations or evidence records must retain enough captured material to produce supported source detail.
- Presentation mechanics such as span units, bounds, and grouping remain implementation conventions rather than cross-cutting constraints.

### Record the actual source-disclosure level

#### Decision

Record every source escape and the actual level of source detail disclosed.

#### Rationale

Source escape is development feedback about where conceptual representations were insufficient, and different disclosure levels represent materially different human exposure to conventional source. Recording only that some source action occurred would lose that distinction.

#### Alternatives considered

- Record source escape without its disclosure level: rejected because the observation could not distinguish a location reference from excerpts or broader source exposure.
- Infer disclosure from the requested option: rejected because the actual presentation, not merely the request, determines what the human saw.

#### Consequences

- Observation events must describe actual disclosure rather than only requested disclosure.
- Exact disclosure-level names and schema representations remain implementation choices.
