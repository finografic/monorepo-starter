import { authHandler } from '@hono/auth-js';
import { db } from 'db';
import { eq } from 'drizzle-orm';
import { env } from 'env.server';
import { describeRoute } from 'hono-openapi';
import { rateLimit } from 'middlewares/rate-limit';

import { createRouter } from 'lib/create-app';
import { hashPassword } from 'utils/password.utils';

import { user } from '../../db/schemas';

const { COOKIES, COOKIE_DELETE_ATTRIBUTES } = env;

const signUpRateLimit = rateLimit({ limit: 5, windowMs: 60_000 });
const signInRateLimit = rateLimit({ limit: 10, windowMs: 60_000 });

const router = createRouter();

// ======================================================
// POST /auth/sign-up — custom registration
// ======================================================

router.post(
  '/auth/sign-up',
  describeRoute({
    tags: ['auth'],
    summary: 'Register a new account',
    description: 'Creates a new user with role=user. Rate-limited to 5 requests per minute per IP.',
    responses: {
      201: { description: 'Account created' },
      400: { description: 'Validation error' },
      409: { description: 'Email already registered' },
      429: { description: 'Rate limit exceeded' },
    },
  }),
  signUpRateLimit,
  async (c) => {
    try {
      const { email, password, name } = await c.req.json<{
        email: string;
        password: string;
        name: string;
      }>();

      if (!email || !password || !name) {
        return c.json({ error: 'VALIDATION_ERROR', message: 'Email, password, and name are required' }, 400);
      }

      if (password.length < 4 || password.length > 64) {
        return c.json({ error: 'VALIDATION_ERROR', message: 'Password must be 4–64 characters' }, 400);
      }

      const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);

      if (existing) {
        return c.json({ error: 'CONFLICT', message: 'Email already registered' }, 409);
      }

      const hashedPassword = await hashPassword(password);
      const now = new Date();

      const [created] = await db
        .insert(user)
        .values({
          name,
          email,
          hashedPassword,
          emailVerified: false,
          role: 'user',
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return c.json(
        {
          user: {
            id: created!.id,
            name: created!.name,
            email: created!.email,
            role: created!.role,
          },
        },
        201,
      );
    } catch (error) {
      c.var.logger?.error({ err: error }, 'Sign-up error');
      return c.json({ error: 'INTERNAL_ERROR', message: 'Registration failed' }, 500);
    }
  },
);

// ======================================================
// POST /auth/clear-all-cookies — dev/debug helper
// ======================================================

router.post(
  '/auth/clear-all-cookies',
  describeRoute({
    tags: ['auth'],
    summary: 'Clear all auth cookies',
    description: 'Debug helper — clears all known auth cookie variants.',
    responses: { 200: { description: 'Cookies cleared' } },
  }),
  async (c) => {
    const response = c.json({ success: true, message: 'All cookies cleared' });

    const cookieNames = [
      COOKIES.TOKEN_COOKIE,
      COOKIES.DATA_COOKIE,
      `__Secure-${COOKIES.TOKEN_COOKIE}`,
      `__Secure-${COOKIES.DATA_COOKIE}`,
      `__Host-${COOKIES.TOKEN_COOKIE}`,
      `__Host-${COOKIES.DATA_COOKIE}`,
      `${COOKIES.COOKIE_PREFIX}.auth_token`,
      `${COOKIES.COOKIE_PREFIX}.session`,
    ];

    const deletionAttributes = [
      COOKIE_DELETE_ATTRIBUTES,
      'Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure',
    ];

    cookieNames.forEach((cookieName) => {
      deletionAttributes.forEach((attrs) => {
        response.headers.append('Set-Cookie', `${cookieName}=; ${attrs}`);
      });
    });

    return response;
  },
);

// ======================================================
// Auth.js handler — all standard auth routes:
//   GET  /auth/session
//   GET  /auth/csrf
//   GET  /auth/providers
//   GET  /auth/signin
//   POST /auth/signin/:provider
//   POST /auth/callback/:provider
//   POST /auth/signout
// ======================================================

router.use('/auth/signin/*', signInRateLimit);
router.use('/auth/*', authHandler());

export default router;
