import { randomBytes } from 'node:crypto';
import { env } from 'env.server';
import pc from 'picocolors';

function shouldUseEphemeralJwtSecret(): boolean {
  const flag = env.AUTH_INVALIDATE_JWT_ON_SERVER_BOOT;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return env.NODE_ENV === 'development';
}

const useEphemeralJwtSecret = shouldUseEphemeralJwtSecret();

export const runtimeAuthSecret: string = useEphemeralJwtSecret
  ? randomBytes(32).toString('hex')
  : env.AUTH_SECRET;

if (useEphemeralJwtSecret) {
  console.log(
    pc.dim('[auth]'),
    pc.yellow('Ephemeral JWT signing secret'),
    pc.dim(
      '(sessions do not survive server restart; set AUTH_INVALIDATE_JWT_ON_SERVER_BOOT=false to keep stable JWTs in dev)',
    ),
  );
}
