# CLI shell retirement preservation evidence

Task: [Surgical CLI shell retirement](../../tasks/2026-11-25-cli-shell-retirement.md).
Approved source baseline: `5f9534aeee06996843c74548a3083b11df8815bf`.
Implementation starts at `5db2cf19f0436d206aa5d5c05de7f022a03b45b9`; no intervening source changes.

## Controlled baseline

Before removal or movement, run:

```sh
npm run build
node scripts/structured-accounts/capture-retirement-baseline.mjs _verification/baseline /private/tmp/postcode-cli-retirement-controlled
node scripts/structured-accounts/capture-retirement-baseline.mjs _verification/baseline-repeat /private/tmp/postcode-cli-retirement-controlled
cmp _verification/baseline/capture.json _verification/baseline-repeat/capture.json
```

Both captures are byte-identical. `baseline/capture.json.gz` is the full sanitized
capture, compressed without a timestamp. It contains only a synthetic two-module
fixture, controlled participant contributions and real application coordination.
No credentials, live inference, or private repository material are used. The supplied
fixture path must remain identical when comparing builds; the script refuses to
replace unexpected contents. Its UUID sequence and monotonic clock are controlled
before loading application modules. Every precise identity, owner, target and
step relationship is retained, without a cross-Session identity claim. No fields
are excluded at this baseline. Comparison after retirement will list each intentional
alias-field exclusion explicitly; support and qualification are never excluded.

The capture exercises mechanical families and exact access, contribution ordinary
reuse, fresh alternatives, exact historical answers, delegated option owner/key,
qualified name-resolution failure, actual agent input delivery and final usage.
The standalone ordinary diagram and text are included for readable inspection.
Existing application, answer and state-model suites additionally cover incompatible
and unrendered alternatives, historical status and immutable exact support.

## Disclosure assessment (pending human direction)

The arranged view records interpretation status and the owner limitation
“Controlled interpretation; not independently established.” The standalone diagram
SVG and text exported by the standard runner do not include either statement.
The text preserves entry, coverage and unsupported semantics, but those disclosures
do not establish the epistemic status of the account. The SVG is an overview whose
full transition meaning requires its accompanying text/legend. This is a material
pre-existing disclosure gap; equality alone cannot establish conformance. Human
direction is required by the plan before rendering verification can be complete.
