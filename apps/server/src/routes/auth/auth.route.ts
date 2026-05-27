import { authHandler } from '@hono/auth-js';
import { db } from 'db';
import { eq } from 'drizzle-orm';
import { env } from 'env.server';

import { createRouter } from 'lib/create-app';
import { hashPassword } from 'utils/password.utils';

import { user } from '../../db/schemas';

const { COOKIES, COOKIE_DELETE_ATTRIBUTES } = env;

const router = createRouter();

// ======================================================
// POST /auth/sign-up — custom registration
// ======================================================

router.post('/auth/sign-up', async (c) => {
  try {
    const { email, password, name } = await c.req.json<{
      email: string;
      password: string;
      name: string;
    }>();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    if (password.length < 4 || password.length > 64) {
      return c.json({ error: 'Password must be 4–64 characters' }, 400);
    }

    const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);

    if (existing) {
      return c.json({ error: 'Email already registered' }, 409);
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
    console.error('Sign-up error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// ======================================================
// POST /auth/clear-all-cookies — dev/debug helper
// ======================================================

router.post('/auth/clear-all-cookies', async (c) => {
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

  const deletionAttributes = [COOKIE_DELETE_ATTRIBUTES, 'Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure'];

  cookieNames.forEach((cookieName) => {
    deletionAttributes.forEach((attrs) => {
      response.headers.append('Set-Cookie', `${cookieName}=; ${attrs}`);
    });
  });

  return response;
});

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

router.use('/auth/*', authHandler());

export default router;
