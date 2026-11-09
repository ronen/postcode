/** Account/provider services are independent of a project Session or CLI host.
 * Connection checks are explicitly requested, cost-bearing operations.
 * configuredInvestigator(provider) returns disabled, a typed unavailable reason,
 * or an agent suitable for openApplication dependencies; it does not infer a
 * billing route or run the connection check. Callers own cancellation for
 * credential operations and checkChatGPTConnection(credentials, signal). */
export { configuredInvestigator } from '../investigation/openai/configuration.js';
export type { InvestigatorConfiguration, ConfigurationReason } from '../investigation/openai/configuration.js';
export { productionChatGPTCredentials, checkChatGPTConnection } from '../investigation/openai/accounts.js';
export { CredentialError } from '../investigation/openai/credential-store.js';
export type { ChatGPTCredentials, AccountStatus } from '../investigation/openai/chatgpt-credentials.js';
