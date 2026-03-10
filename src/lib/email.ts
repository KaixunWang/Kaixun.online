import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export async function sendVerificationEmail(opts: {
  to: string;
  verifyUrl: string;
}) {
  const { to, verifyUrl } = opts;

  const from = process.env.EMAIL_FROM;

  if (!process.env.RESEND_API_KEY || !from) {
    console.warn(
      "[email] Missing RESEND_API_KEY or EMAIL_FROM, skip sending email. Verification URL:",
      verifyUrl,
    );
    return;
  }

  await resend.emails.send({
    from,
    to,
    subject: "Verify your email for kaixun.online",
    html: `<p>Hi,</p>
<p>Please verify your email by clicking the link below:</p>
<p><a href="${verifyUrl}">${verifyUrl}</a></p>
<p>If you did not request this, you can ignore this email.</p>`,
    text: `Hi,\n\nPlease verify your email by visiting this link:\n\n${verifyUrl}\n\nIf you did not request this, you can ignore this email.`,
  });
}

