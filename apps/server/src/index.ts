import { networkInterfaces } from 'node:os';
import { env } from '@workspace/config/env';
import { serve } from '@hono/node-server';
import pc from 'picocolors';

import app from './app';

export type { AppType } from './app';

const PORT = env.API_PORT;

function getLanIp(): string | null {
  const nets = networkInterfaces();
  for (const iface of Object.values(nets)) {
    if (!iface) continue;
    for (const info of iface) {
      if (!info.internal && info.family === 'IPv4') return info.address;
    }
  }
  return null;
}

const lanIp = getLanIp();

console.log('');
console.log(`  ${pc.green('●')} API listening:  ${pc.green(`http://localhost:${PORT}`)}`);
if (lanIp) {
  console.log(`  ${pc.dim('●')} LAN access:    ${pc.dim(`http://${lanIp}:${PORT}`)}`);
}
console.log('');

serve({ fetch: app.fetch, port: PORT });
