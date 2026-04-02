import { createClient } from "@supabase/supabase-js";

/**
 * Admin client with service role key — bypasses Row Level Security.
 * Use for server-side operations that need elevated privileges:
 * - Inserting leads (RLS blocks public inserts)
 * - Build-time data fetching (generateStaticParams, sitemap)
 *
 * NEVER expose this client to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
