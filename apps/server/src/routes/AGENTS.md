# AGENTS.md — Server Routes

`apps/server/src/routes/` holds every HTTP route group. Each group is mounted in
`apps/server/src/app.ts` under its own stable prefix.

| Prefix              | Router               | Folder/File      |
| ------------------- | -------------------- | ---------------- |
| `/`                 | `indexRouter`        | `index.route.ts` |
| `/api/health`       | `healthRouter`       | `health/`        |
| `/api/auth`         | `authRouter`         | `auth/`          |
| `/api/i18n`         | `i18nRouter`         | `i18n/`          |
| `/api/users`        | `usersRouter`        | `users/`         |
| `/api/translations` | `translationsRouter` | `translations/`  |

Route group folders follow the LLAAB-inspired shape:

- `*.routes.ts` exports named route definitions with `path` and `handler`.
- `*.schema.ts` holds request/query schemas when the route group has reusable schemas that are
  not already provided by DB/schema modules.
- `index.ts` wires route definitions onto `createRouter()` only.

Keep implementation logic out of `index.ts`. Route paths inside a group are relative to that
group's app mount point. For example, `users/index.ts` owns `/` and `/:id`, while `app.ts` mounts
that router at `/api/users`.

Auth is intentionally different from LLAAB: this starter uses DB-backed Auth.js/session auth. Do
not replace it with LLAAB's basic password auth. The auth route group keeps the custom sign-up and
clear-cookie helpers plus Auth.js wildcard routes for CSRF, session, credentials callbacks, and
sign-out.
