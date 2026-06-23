import nodemailer from "nodemailer";

/**
 * Sends an enquiry notification email if SMTP is configured.
 * Fails silently (logs only) so a missing SMTP config never breaks the public form.
 */
export async function sendEnquiryNotification(opts: {
  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  vehicleTitle?: string | null;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, ENQUIRY_NOTIFY_TO } = process.env;
  if (!SMTP_HOST || !ENQUIRY_NOTIFY_TO) {
    console.info("[mailer] SMTP not configured — skipping email notification.");
    return;
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });

  const subject = opts.vehicleTitle
    ? `New enquiry: ${opts.vehicleTitle}`
    : "New website enquiry";

  const html = `
    <h2>New enquiry from the Hawk Motors website</h2>
    ${opts.vehicleTitle ? `<p><strong>Vehicle:</strong> ${opts.vehicleTitle}</p>` : ""}
    <p><strong>Name:</strong> ${opts.name}</p>
    ${opts.email ? `<p><strong>Email:</strong> ${opts.email}</p>` : ""}
    ${opts.phone ? `<p><strong>Phone:</strong> ${opts.phone}</p>` : ""}
    ${opts.message ? `<p><strong>Message:</strong><br/>${opts.message.replace(/\n/g, "<br/>")}</p>` : ""}
  `;

  try {
    await transport.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: ENQUIRY_NOTIFY_TO,
      replyTo: opts.email || undefined,
      subject,
      html,
    });
  } catch (e) {
    console.error("[mailer] Failed to send enquiry notification:", e);
  }
}
