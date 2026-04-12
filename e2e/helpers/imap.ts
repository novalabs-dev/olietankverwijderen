/**
 * IMAP test helper — check inbox for notification emails after form submit.
 *
 * Connects to Versio mail (mail.versio.nl:993) and searches for emails
 * matching a subject pattern. Used to verify that the lead notification
 * email was actually delivered after an offerte form submission.
 */

import { ImapFlow } from "imapflow";

interface ImapConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

function getImapConfig(): ImapConfig {
  const host = process.env.SMTP_HOST; // Same server for SMTP and IMAP
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Missing SMTP_HOST/SMTP_USER/SMTP_PASS — " +
        "set them in .env.local for IMAP access",
    );
  }

  return { host, port: 993, user, pass };
}

export interface FoundEmail {
  uid: number;
  subject: string;
  from: string;
  date: Date;
}

/**
 * Search the inbox for an email whose subject contains `subjectPattern`.
 * Retries up to `maxWaitMs` with 3-second intervals (email delivery is async).
 * Returns the matching email or null if not found within the timeout.
 *
 * Only searches emails received in the last 5 minutes to avoid false matches
 * from old test runs.
 */
export async function findEmailBySubject(
  subjectPattern: string,
  maxWaitMs = 30_000,
): Promise<FoundEmail | null> {
  const config = getImapConfig();
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const client = new ImapFlow({
      host: config.host,
      port: config.port,
      secure: true,
      auth: { user: config.user, pass: config.pass },
      logger: false,
    });

    try {
      await client.connect();
      const lock = await client.getMailboxLock("INBOX");

      try {
        // Search emails from the last 5 minutes
        const since = new Date(Date.now() - 5 * 60 * 1000);

        // Fetch recent messages and check subject
        const messages = client.fetch(
          { since, seen: false },
          { envelope: true },
        );

        for await (const msg of messages) {
          const subject = msg.envelope?.subject ?? "";
          if (subject.includes(subjectPattern)) {
            return {
              uid: msg.uid,
              subject,
              from: msg.envelope?.from?.[0]?.address ?? "",
              date: msg.envelope?.date ?? new Date(),
            };
          }
        }
      } finally {
        lock.release();
      }

      await client.logout();
    } catch (err) {
      // Connection errors are transient; retry
      console.warn(`IMAP attempt failed: ${err}`);
    }

    // Wait before retrying
    await new Promise((r) => setTimeout(r, 3000));
  }

  return null;
}

/**
 * Delete an email by UID (cleanup after test).
 */
export async function deleteEmailByUid(uid: number): Promise<void> {
  const config = getImapConfig();
  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: true,
    auth: { user: config.user, pass: config.pass },
    logger: false,
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    try {
      await client.messageDelete({ uid }, { uid: true });
    } finally {
      lock.release();
    }
    await client.logout();
  } catch (err) {
    console.warn(`Failed to delete email UID ${uid}: ${err}`);
  }
}
