import { pinoLogger as honoPinoLogger } from 'hono-pino';
import pc from 'picocolors';
import pino from 'pino';

const LEVEL_COLOR: Record<string, (s: string) => string> = {
  trace: pc.dim,
  debug: pc.green,
  info: pc.cyan,
  warn: pc.yellow,
  error: pc.red,
  fatal: pc.red,
};

const METHOD_COLOR: Record<string, (s: string) => string> = {
  GET: pc.green,
  POST: pc.yellow,
  PUT: pc.cyan,
  PATCH: pc.yellow,
  DELETE: pc.red,
  OPTIONS: pc.magenta,
};

function str(val: unknown, fallback = ''): string {
  return typeof val === 'string' ? val : typeof val === 'number' ? String(val) : fallback;
}

function devDestination(): pino.DestinationStream {
  return {
    write(chunk: string) {
      try {
        const data = JSON.parse(chunk) as Record<string, unknown>;
        const level = str(data['level'], 'info');
        const colorLevel = (LEVEL_COLOR[level] ?? pc.white)(level.toUpperCase().padEnd(5));
        const time = data['time']
          ? new Date(Number(data['time'])).toLocaleTimeString('en-GB', { hour12: false })
          : '';

        if (data['req'] && typeof data['req'] === 'object') {
          const req = data['req'] as Record<string, unknown>;
          const method = str(req['method']);
          const url = str(req['url']);
          const colorMethod = (METHOD_COLOR[method] ?? pc.white)(method);
          const res =
            data['res'] && typeof data['res'] === 'object' ? (data['res'] as Record<string, unknown>) : null;
          const status = res ? str(res['statusCode']) : '';
          const rt = data['responseTime'];
          const ms = typeof rt === 'number' ? `${rt}ms` : '';
          process.stdout.write(
            `${pc.dim(time)} ${colorLevel} ${colorMethod} ${url} ${pc.dim(status)} ${pc.dim(ms)}\n`,
          );
        } else {
          const msg = str(data['msg']);
          process.stdout.write(`${pc.dim(time)} ${colorLevel} ${msg}\n`);
        }
      } catch {
        process.stdout.write(chunk);
      }
    },
  };
}

export function pinoLogger() {
  const isProd = process.env.NODE_ENV === 'production';

  return honoPinoLogger({
    pino: pino({ level: isProd ? 'info' : 'debug' }, isProd ? pino.destination(1) : devDestination()),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
