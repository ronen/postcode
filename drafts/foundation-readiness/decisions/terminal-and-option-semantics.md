# Terminal text and command-option semantics

Status: in review
Decided:
Arising from: [Foundation readiness](../plans/foundation-readiness.md)
Scope: terminal layout and option scanning for current CLI and shell commands

## Context

The library audits found suitable generic mechanisms for display width and option scanning. They also found that replacing local behavior wholesale can change Unicode spelling, whitespace, token meaning and error precedence. Those visible choices need an explicit contract rather than being hidden inside a reuse refactor.

## Decisions

### Measure display width without normalizing source spelling

#### Decision

Use `string-width` for terminal width and `Intl.Segmenter` for grapheme boundaries, with a thin local policy for wrapping, continuation and disclosure. Preserve original Unicode code-point spelling, apart from deliberate control escaping, wrapping and disclosed truncation. Keep source positions in UTF-16 and omission counts in original code points. Use the same layout calculation for fit checks and actual rendering.

[Needs review] Visibly escape tabs in terminal layout so their width is deterministic; retain exact stored text. Treat ambiguous-width characters as narrow. When an indivisible grapheme exceeds the available budget, disclose omission rather than splitting it or overflowing without qualification. Review tab/control/CRLF treatment and omission accounting together before promotion.

#### Rationale

Width and segmentation are generic mechanisms; exact evidence spelling and qualification are application policy. The audited `wrap-ansi` behavior changes whitespace/tabs and normalizes Unicode, so it is not a suitable replacement for that policy.

#### Alternatives considered

- Keep local Unicode-width logic: retains difficult generic character handling.
- Adopt `wrap-ansi` wholesale: changes evidence spelling and layout semantics beyond the intended delegation.
- Normalize stored text to simplify layout: changes the evidence rather than presenting it faithfully.

#### Consequences

Pin and verify the selected width-library release during implementation. Test CJK, combining sequences, ZWJ emoji, tabs, CRLF, control escapes, narrow budgets, continuation prefixes and exact omitted-code-point counts. Assess affected presentation/method versions and record intentional differences separately from performance equivalence.

### Scan standard options while preserving domain selection

#### Decision

Use Node's `util.parseArgs` for option scanning. PostCode retains lens and selector interpretation, shell tokenization, conceptual help, controlled errors, observation production and shell project restrictions.

[Needs review] Apply the following grammar consistently to one-shot and shell paths where the option is permitted:

| Input case | Behavior |
| --- | --- |
| `--project=value` | Accept the inline value. |
| Option-looking selector | Require `--` before the literal selector. |
| Dash-prefixed option value | Require inline `--option=-value` form. |
| Literal reserved-looking `@` selector | Preserve literal selection through the existing terminator convention. |
| Unknown/invalid option alongside help | Parse the full input strictly and report the error. |
| Repeated value option | Reject duplicates instead of silently selecting a value. |
| Empty value for a required nonempty option | Report a controlled invocation error. |
| Repeated boolean flag | Treat as idempotent. |

Review the grammar against every current option and both entry paths before promotion. Scanner output alone is not the domain validator.

#### Rationale

The runtime scanner reduces bespoke option mechanics while leaving selection and command policy explicit. A documented grammar prevents accidental behavior changes caused by parser defaults.

#### Alternatives considered

- Keep the custom scanner: retains generic behavior already available in the runtime.
- Add a broad CLI framework: introduces concepts and dependencies unnecessary for the current interface.
- Let scanner defaults implicitly select duplicate/help behavior: obscures user-visible policy.

#### Consequences

Test the grammar matrix, project restrictions, quoting/tokenization, literal selectors and observation/error behavior in both interfaces. Update CLI documentation for intentional changes. This decision specializes interface policy and does not redefine domain identity, lens semantics or stored evidence.
