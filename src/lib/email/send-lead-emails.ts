import {
  sendLeadConfirmation,
  sendLeadNotification,
  type LeadEmailData,
} from "./leads";

/**
 * Sends both the lead confirmation (to the requester) and the lead
 * notification (to the site owner) in parallel.
 *
 * This function never throws. Email failures are logged but will not
 * break the lead creation flow.
 */
export async function sendLeadEmails(lead: LeadEmailData): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn(
      "[Email] SMTP is not configured. Skipping lead emails. " +
        "Set SMTP_HOST, SMTP_USER, and SMTP_PASS to enable email sending."
    );
    return;
  }

  const [confirmationResult, notificationResult] = await Promise.all([
    sendLeadConfirmation(lead),
    sendLeadNotification(lead),
  ]);

  if (!confirmationResult.success) {
    console.error(
      `[Email] Lead confirmation to ${lead.email} failed: ${confirmationResult.error}`
    );
  }

  if (!notificationResult.success) {
    console.error(
      `[Email] Lead notification for ${lead.naam} failed: ${notificationResult.error}`
    );
  }
}

export type { LeadEmailData } from "./leads";
