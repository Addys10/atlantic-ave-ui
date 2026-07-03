import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Client-side client — stores auth session in cookies so middleware can read it
export const supabase = createBrowserClient(
  env.supabaseUrl(),
  env.supabaseAnonKey()
);

// Server-only — bypasses RLS, used only in API route handlers
export function createServiceClient() {
  return createClient(
    env.supabaseUrl(),
    env.supabaseServiceRoleKey()
  );
}
