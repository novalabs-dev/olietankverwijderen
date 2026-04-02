import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let _transporter: Transporter | null = null;

export function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? "587"),
      secure: false, // STARTTLS on port 587
      auth: { user, pass },
    });
  }

  return _transporter;
}
