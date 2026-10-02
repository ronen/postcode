/** Development assessment accounting. Input: [{ role, session, usage }], where usage is
 * PostCode's finalized usage view. Provider, evaluator and source-assessor runs retain
 * separate rows even when they consume the same ChatGPT allowance. No credentials. */
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export function assessmentUsageReport(runs) {
  return {
    runs: runs.map(({ role, session, usage }) => ({
      role, session, calls: usage.calls, missingCalls: usage.missingCalls, anomalousCalls: usage.anomalousCalls,
      groups: usage.totals.map(total => ({ ...total,
        authenticationRoute: total.agent.configuration.authenticationRoute ?? 'unreported',
        billingRoute: total.agent.configuration.billingRoute ?? 'unreported',
        monetaryAttribution: { status: 'unavailable', amount: null, currency: null,
          explanation: total.agent.configuration.billingRoute === 'chatgpt-plan'
            ? 'Token usage does not identify included allowance versus optional purchased-credit charges. API prices are not ChatGPT credit prices.'
            : 'Reported tokens alone are not confirmed API charges. An API estimate requires separately sourced rates and billing distinctions.' },
      })),
      limitations: usage.limitations,
    })),
    limitations: [
      'Role totals are kept separate even when the same subscription allowance funds them.',
      'Missing or anomalous usage and unavailable monetary attribution are unknown, not zero.',
      'No API-equivalent estimate is presented as actual ChatGPT credit usage.',
    ],
    chatGPTUsageControls: 'https://chatgpt.com/settings/usage',
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.length !== 3) throw new Error('Usage: node scripts/module-investigation/usage-report.mjs <captured-runs.json>');
  process.stdout.write(JSON.stringify(assessmentUsageReport(JSON.parse(await readFile(process.argv[2], 'utf8'))), null, 2) + '\n');
}
