import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadEmails } from "@/lib/email/send-lead-emails";
import { leadSchema } from "@/lib/validations/lead";

/**
 * Venster waarbinnen een tweede inzending met hetzelfde e-mailadres,
 * dezelfde postcode en dezelfde niche geldt als herindiening (dubbelklik of
 * een geherformuleerde toelichting) in plaats van een nieuwe lead.
 *
 * Aanleiding: op 2026-06-26 diende dezelfde aanvrager binnen drie minuten
 * twee keer in. Er was hier geen enkele dedup, dus dat werden twee losse
 * leads voor een en dezelfde aanvraag.
 */
const DEDUP_WINDOW_MINUTES = 30;

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    // Validate request body with Zod
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      // Flatten Zod issues into { fieldName: "error message" }
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path.join(".");
        // Keep only the first error per field
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }

      return NextResponse.json(
        { success: false, errors: fieldErrors },
        { status: 400 },
      );
    }

    const data = result.data;

    // Capture the referer header as landing_page
    const landingPage = request.headers.get("referer") ?? undefined;

    // Insert into Supabase using admin client (bypasses RLS)
    const supabase = createAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Database niet geconfigureerd. Neem contact op via e-mail." },
        { status: 503 },
      );
    }

    // Velden die zowel de insert als de dedup-update schrijft. `status` en
    // `bron` staan er bewust NIET in: een herindiening mag de status niet
    // terugzetten van een lead die de pipeline al aan het verwerken is.
    const leadFields = {
      naam: data.naam,
      email: data.email,
      telefoon: data.telefoon ?? null,
      postcode: data.postcode,
      type_dienst: data.type_dienst,
      type_materiaal: data.type_tank ?? null,
      urgentie: data.urgentie ?? null,
      toelichting: data.toelichting ?? null,
      landing_page: landingPage ?? null,
      niche: "olietank",
    };

    const windowStartISO = new Date(
      Date.now() - DEDUP_WINDOW_MINUTES * 60_000,
    ).toISOString();

    const { data: existing, error: dedupError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", data.email)
      .eq("postcode", data.postcode)
      .eq("niche", "olietank")
      .gte("created_at", windowStartISO)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dedupError) {
      // Fail open: een mislukte dedup-lookup mag nooit stil een echte lead laten vallen.
      console.error("Dedup lookup failed, proceeding with insert:", dedupError);
    }

    if (!dedupError && existing) {
      const { error: updateError } = await supabase
        .from("leads")
        .update(leadFields)
        .eq("id", existing.id);

      if (updateError) {
        console.error("Supabase update (dedup) error:", updateError);
        return NextResponse.json(
          { success: false, error: "Er ging iets mis bij het opslaan. Probeer het opnieuw." },
          { status: 500 },
        );
      }

      // Zelfde antwoordvorm als bij een nieuwe lead; geen tweede mail.
      return NextResponse.json(
        { success: true, id: existing.id, deduplicated: true },
        { status: 200 },
      );
    }

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        ...leadFields,
        status: "nieuw",
        bron: "website",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Er ging iets mis bij het opslaan. Probeer het opnieuw." },
        { status: 500 },
      );
    }

    // Send confirmation and notification emails
    await sendLeadEmails({
      naam: data.naam,
      email: data.email,
      telefoon: data.telefoon,
      postcode: data.postcode,
      type_dienst: data.type_dienst,
      type_tank: data.type_tank,
      inhoud_tank: data.inhoud_tank,
      urgentie: data.urgentie,
      toelichting: data.toelichting,
    });

    return NextResponse.json(
      { success: true, id: lead.id },
      { status: 201 },
    );
  } catch (err) {
    // Handle JSON parse errors or unexpected failures
    console.error("Unexpected error in POST /api/leads:", err);
    return NextResponse.json(
      { success: false, error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 },
    );
  }
}
