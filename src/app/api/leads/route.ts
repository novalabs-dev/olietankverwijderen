import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendLeadEmails } from "@/lib/email/send-lead-emails";
import { leadSchema } from "@/lib/validations/lead";

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

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        naam: data.naam,
        email: data.email,
        telefoon: data.telefoon ?? null,
        postcode: data.postcode,
        type_dienst: data.type_dienst,
        type_tank: data.type_tank ?? null,
        inhoud_tank: data.inhoud_tank ?? null,
        urgentie: data.urgentie ?? null,
        toelichting: data.toelichting ?? null,
        landing_page: landingPage ?? null,
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
