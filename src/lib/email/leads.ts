import { getTransporter } from "./resend";

export interface LeadEmailData {
  naam: string;
  email: string;
  telefoon?: string;
  postcode: string;
  type_dienst: string;
  type_tank?: string;
  inhoud_tank?: string;
  urgentie?: string;
  toelichting?: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

const FROM_ADDRESS = '"Olietankverwijderen.nl" <info@olietankverwijderen.nl>';

// Human-readable labels for enum values
const DIENST_LABELS: Record<string, string> = {
  verwijdering: "Tankverwijdering",
  sanering: "Bodemsanering",
  beide: "Verwijdering + sanering",
};

const TYPE_TANK_LABELS: Record<string, string> = {
  ondergronds: "Ondergrondse tank",
  bovengronds: "Bovengrondse tank",
  onbekend: "Onbekend",
};

const INHOUD_TANK_LABELS: Record<string, string> = {
  "0-1000": "Tot 1.000 liter",
  "1000-3000": "1.000 - 3.000 liter",
  "3000-6000": "3.000 - 6.000 liter",
  "6000+": "Meer dan 6.000 liter",
  onbekend: "Onbekend",
};

const URGENTIE_LABELS: Record<string, string> = {
  direct: "Zo snel mogelijk",
  "binnen-maand": "Binnen een maand",
  "binnen-3-maanden": "Binnen 3 maanden",
  orienterend: "Ori\u00EBnterend",
};

function getLabel(
  map: Record<string, string>,
  value: string | undefined
): string {
  if (!value) return "-";
  return map[value] ?? value;
}

/**
 * Sends a confirmation email to the person who submitted the quote request.
 */
export async function sendLeadConfirmation(
  lead: LeadEmailData
): Promise<EmailResult> {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn("[Email] SMTP not configured, skipping confirmation email");
      return { success: false, error: "SMTP not configured" };
    }

    await transporter.sendMail({
      from: FROM_ADDRESS,
      to: lead.email,
      subject: "Uw offerte-aanvraag is ontvangen",
      html: `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Uw offerte-aanvraag is ontvangen</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f5;color:#18181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1d4ed8;padding:24px 32px;">
              <h1 style="margin:0;font-size:20px;color:#ffffff;">Olietankverwijderen.nl</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 16px;font-size:18px;color:#18181b;">
                Beste ${escapeHtml(lead.naam)},
              </h2>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">
                Bedankt voor uw offerte-aanvraag via Olietankverwijderen.nl. Wij hebben uw aanvraag in goede orde ontvangen.
              </p>

              <!-- Summary -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f9ff;border-radius:6px;margin:0 0 24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#1d4ed8;">Uw aanvraag:</p>
                    <p style="margin:0 0 4px;font-size:14px;color:#3f3f46;">
                      <strong>Type dienst:</strong> ${escapeHtml(getLabel(DIENST_LABELS, lead.type_dienst))}
                    </p>
                    <p style="margin:0;font-size:14px;color:#3f3f46;">
                      <strong>Postcode:</strong> ${escapeHtml(lead.postcode)}
                    </p>
                  </td>
                </tr>
              </table>

              <h3 style="margin:0 0 12px;font-size:16px;color:#18181b;">Wat gebeurt er nu?</h3>
              <ol style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.8;color:#3f3f46;">
                <li>Wij koppelen uw aanvraag aan geschikte gecertificeerde bedrijven in uw regio.</li>
                <li>U ontvangt binnen <strong>48 uur</strong> een reactie van een of meerdere bedrijven.</li>
                <li>U vergelijkt de offertes en kiest het bedrijf dat het beste bij u past.</li>
              </ol>

              <p style="margin:0;font-size:15px;line-height:1.6;color:#3f3f46;">
                Heeft u in de tussentijd vragen? Neem dan gerust contact met ons op via
                <a href="mailto:info@olietankverwijderen.nl" style="color:#1d4ed8;text-decoration:underline;">info@olietankverwijderen.nl</a>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#f4f4f5;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:12px;color:#71717a;line-height:1.5;">
                Olietankverwijderen.nl &mdash; Vind de beste gecertificeerde olietankverwijderaar bij u in de buurt.<br />
                U ontvangt deze e-mail omdat u een offerte-aanvraag heeft ingediend op onze website.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Email] Exception sending lead confirmation:", message);
    return { success: false, error: message };
  }
}

/**
 * Sends a notification email to the site owner about a new lead.
 */
export async function sendLeadNotification(
  lead: LeadEmailData
): Promise<EmailResult> {
  const notificationEmail =
    process.env.NOTIFICATION_EMAIL ?? "info@olietankverwijderen.nl";

  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn("[Email] SMTP not configured, skipping notification email");
      return { success: false, error: "SMTP not configured" };
    }

    await transporter.sendMail({
      from: FROM_ADDRESS,
      to: notificationEmail,
      subject: `Nieuwe lead: ${lead.naam} (${lead.postcode})`,
      html: `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nieuwe lead ontvangen</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f5;color:#18181b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#16a34a;padding:24px 32px;">
              <h1 style="margin:0;font-size:20px;color:#ffffff;">Nieuwe Lead Ontvangen</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;">
                Er is een nieuwe offerte-aanvraag binnengekomen via Olietankverwijderen.nl.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:6px;overflow:hidden;">
                <!-- Contact info -->
                <tr>
                  <td colspan="2" style="padding:12px 16px;background-color:#f0fdf4;font-size:14px;font-weight:bold;color:#16a34a;border-bottom:1px solid #e4e4e7;">
                    Contactgegevens
                  </td>
                </tr>
                ${detailRow("Naam", lead.naam)}
                ${detailRow("E-mail", lead.email)}
                ${detailRow("Telefoon", lead.telefoon ?? "-")}
                ${detailRow("Postcode", lead.postcode)}

                <!-- Project details -->
                <tr>
                  <td colspan="2" style="padding:12px 16px;background-color:#f0fdf4;font-size:14px;font-weight:bold;color:#16a34a;border-bottom:1px solid #e4e4e7;">
                    Projectdetails
                  </td>
                </tr>
                ${detailRow("Type dienst", getLabel(DIENST_LABELS, lead.type_dienst))}
                ${detailRow("Type tank", getLabel(TYPE_TANK_LABELS, lead.type_tank))}
                ${detailRow("Inhoud tank", getLabel(INHOUD_TANK_LABELS, lead.inhoud_tank))}
                ${detailRow("Urgentie", getLabel(URGENTIE_LABELS, lead.urgentie))}
                ${detailRow("Toelichting", lead.toelichting ?? "-")}
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#f4f4f5;border-top:1px solid #e4e4e7;">
              <p style="margin:0;font-size:12px;color:#71717a;">
                Dit is een automatisch bericht van Olietankverwijderen.nl.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Email] Exception sending lead notification:", message);
    return { success: false, error: message };
  }
}

// --- Helpers ---

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 16px;font-size:14px;color:#71717a;border-bottom:1px solid #f4f4f5;width:140px;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:10px 16px;font-size:14px;color:#18181b;border-bottom:1px solid #f4f4f5;vertical-align:top;">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
