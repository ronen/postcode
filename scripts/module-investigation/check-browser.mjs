/** Explicit native browser smoke/regression check. Opens only a temporary local page;
 * does not read credentials, start OAuth or call a provider. Not part of routine tests. */
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { openBrowser } from '../../_build/src/lib/investigation/openai/browser.js';

const route = `/postcode-browser-check/${randomUUID()}`;
let received;
const visited = new Promise(resolve => { received = resolve; });
const server = createServer((request, response) => {
  response.setHeader('content-type', 'text/plain; charset=utf-8');
  response.setHeader('cache-control', 'no-store');
  if (request.url !== route) { response.writeHead(404); response.end(); return; }
  response.end('PostCode browser launch verified. No sign-in or credentials were used. You can close this tab.');
  received();
});
let timeout;
try {
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const address = server.address();
  const deadline = new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Browser did not reach the local check page within 20 seconds.')), 20000); });
  await Promise.race([Promise.all([openBrowser(`http://127.0.0.1:${address.port}${route}`), visited]), deadline]);
  process.stdout.write('PASS: the production launcher opened the browser and its local page was requested. No credentials or OAuth were used.\n');
} catch {
  process.stderr.write('FAIL: native browser handoff or local page delivery did not complete. No credentials or OAuth were used.\n');
  process.exitCode = 1;
} finally {
  clearTimeout(timeout); server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
