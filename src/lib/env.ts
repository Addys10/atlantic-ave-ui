/**
 * Env-var accessors that throw at the point of use if the variable is missing.
 * This surfaces missing config with a clear error instead of a downstream
 * NullPointerException (e.g. Stripe: "apiKey required") or silent runtime bug
 * (e.g. Supabase URL undefined -> requests to `undefined/rest/...`).
 */

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function optionalEnv(key: string, fallback: string): string {
  const value = process.env[key];
  return value && value.length > 0 ? value : fallback;
}

// Public URLs need NEXT_PUBLIC_ prefix so they're inlined into the client bundle.
// Everything else is server-only.
export const env = {
  supabaseUrl: () => requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: () => requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: () => requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  stripeSecretKey: () => requireEnv('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: () => requireEnv('STRIPE_WEBHOOK_SECRET'),
  resendApiKey: () => requireEnv('RESEND_API_KEY'),
  resendFromEmail: () => optionalEnv('RESEND_FROM_EMAIL', 'faktury@atlanticave.cz'),
  baseUrl: () => requireEnv('NEXT_PUBLIC_BASE_URL'),
};
