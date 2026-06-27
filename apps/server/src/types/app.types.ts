import type { Context, Handler, Hono } from 'hono';
import type { PinoLogger } from 'hono-pino';

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type AppOpenAPI = Hono<AppBindings>;

export type AppHandler = Handler<AppBindings>;

export type AppContext = Context<AppBindings>;

export type ValidatedJsonContext<T, P extends string = string> = Context<
  AppBindings,
  P,
  {
    in: {
      json: T;
    };
    out: {
      json: T;
    };
  }
>;
