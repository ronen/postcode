# Retained investigation diagnostics and budget support

Build from the PostCode checkout with `npm ci` and `npm run build`, using Node
22.13 or later and the pinned TypeScript 6.0.3. These are internal validation tools,
not public commands or an authorization to run inference.

The shell assessment runner, injected worker setup, frozen scenario/rubric input
files and CLI configuration verifier have retired. Historical passes under
`records/validation/module-investigation/` retain their exact manifests, runtime,
instructions, results and limitations; they do not describe the current runtime.
Do not reproduce them by substituting a new harness and implying equivalence.

Surviving tools:

- `request-budget.mjs`: exclusive ledger lease and reservation before dispatch;
  failed/uncertain attempts consume reservations. Used by direct structured-account
  trials. A ceiling contains execution; it does not authorize requests. A leftover
  `.lock` requires manual confirmation that the owner is gone and an audit before
  removal; no automatic stale-lock clearing is provided.
- `usage-report.mjs`: keeps role, route and model accounting separate. Unknown
  charges remain unavailable, not zero; API-equivalent estimates are not ChatGPT charges.
- `diagnose-chatgpt.mjs`: separately authorized one-request structural diagnostic.
  Uses PostCode credentials, never Codex credentials; preserve question, authorization,
  sanitized result and diagnostic accounting.
- `check-browser.mjs`: opt-in credential-free local browser-launch diagnostic.
  Opens a tab and waits for a temporary local page request; no OAuth or inference.

Current direct trials and scenario auditing live under `scripts/structured-accounts/`.
`run-trial.mjs` consumes an explicit run specification and preserves its normal
capture order/budget behavior. `run-dialog14-trial.mjs` runs the focused
regression; `audit-dialog14-trial.mjs` audits captured scenarios. Their qualified rendering
is in `support/`, separate from core content. Inspect each tool's usage before use.
Captures can contain source evidence; inspect them and preserve attribution before
committing. Credentials, authorization URLs and raw caught errors must not be captured.

Existing failure-path limitations remain: failed steps can leave attempt reports
without completed step records or final usage; final usage is success-path capture.
Session close can replace a prior error. In the standard runner, close failure can
skip budget close; the dialog14 runner attempts budget close in a nested finalizer.
This retirement does not redesign runner cleanup or provide research observation.
