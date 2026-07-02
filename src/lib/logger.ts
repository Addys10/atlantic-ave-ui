/**
 * Small server-side logger. The point isn't structured logging (we don't
 * ship logs anywhere yet) — it's a single convention so every server-side
 * warning and error looks the same in the terminal / Vercel logs:
 *
 *   [scope] message  {optional meta}
 *
 * Call `createLogger('scope')` once per file, then log.info / log.warn /
 * log.error. Meta arg can be anything (Error, object, string).
 */

export interface Logger {
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
}

export function createLogger(scope: string): Logger {
  const prefix = `[${scope}]`;
  return {
    info(message, meta) {
      if (meta !== undefined) console.log(`${prefix} ${message}`, meta);
      else console.log(`${prefix} ${message}`);
    },
    warn(message, meta) {
      if (meta !== undefined) console.warn(`${prefix} ${message}`, meta);
      else console.warn(`${prefix} ${message}`);
    },
    error(message, meta) {
      if (meta !== undefined) console.error(`${prefix} ${message}`, meta);
      else console.error(`${prefix} ${message}`);
    },
  };
}
