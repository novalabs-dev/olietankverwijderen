/**
 * Supabase test helper — query and cleanup leads for E2E tests.
 *
 * Uses the service role key (bypasses RLS) so tests can verify
 * lead creation and clean up after themselves.
 */

import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — " +
        "set them in .env.local or pass via environment",
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface TestLead {
  id: string;
  naam: string;
  email: string;
  postcode: string;
  type_dienst: string;
  status: string;
  created_at: string;
}

/**
 * Find a lead by email address. Returns the most recently created match.
 * Retries up to `maxWaitMs` with 1-second intervals to handle async inserts.
 */
export async function findLeadByEmail(
  email: string,
  maxWaitMs = 10_000,
): Promise<TestLead | null> {
  const client = getAdminClient();
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const { data, error } = await client
      .from("leads")
      .select("id, naam, email, postcode, type_dienst, status, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    if (data && data.length > 0) return data[0] as TestLead;

    await new Promise((r) => setTimeout(r, 1000));
  }
  return null;
}

/**
 * Delete a test lead and its toewijzingen by lead ID.
 */
export async function deleteTestLead(leadId: string): Promise<void> {
  const client = getAdminClient();

  // Delete toewijzingen first (FK constraint)
  await client.from("lead_toewijzingen").delete().eq("lead_id", leadId);
  // Delete the lead itself
  const { error } = await client.from("leads").delete().eq("id", leadId);
  if (error) throw new Error(`Failed to delete test lead: ${error.message}`);
}
