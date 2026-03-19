import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trustedcollectibles.com";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
  return _resend;
}

// POST: send verification code
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.email_confirmed_at) {
    return NextResponse.json({ verified: true });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Store code in user metadata (expires in 30 min)
  await supabase.auth.updateUser({
    data: {
      email_verify_code: code,
      email_verify_expires: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  });

  // Send branded email
  const fromEmail = process.env.RESEND_FROM_EMAIL || "TrustedCollectibles <noreply@trustedcollectibles.com>";

  await getResend().emails.send({
    from: fromEmail,
    to: user.email!,
    subject: `Your verification code: ${code}`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#08090e;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#08090e;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#15171f;border-radius:12px;border:1px solid rgba(255,255,255,0.07);">
        <tr><td style="padding:32px 32px 0 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="border:2px solid #c67b2f;border-radius:8px;padding:6px 10px;">
                <span style="font-size:14px;font-weight:700;color:#c67b2f;">TC</span>
              </td>
              <td style="padding-left:12px;">
                <span style="font-size:16px;font-weight:700;color:#ffffff;">Trusted</span><span style="font-size:16px;font-weight:700;color:#c67b2f;">Collectibles</span>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 32px 0 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Verify your email</h1>
        </td></tr>
        <tr><td style="padding:16px 32px 0 32px;">
          <p style="font-size:14px;color:#f0eff2;line-height:1.6;">Enter this code to verify your email address:</p>
        </td></tr>
        <tr><td style="padding:16px 32px;">
          <div style="background-color:#08090e;border:2px solid #c67b2f;border-radius:12px;padding:20px;text-align:center;">
            <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#c67b2f;">${code}</span>
          </div>
        </td></tr>
        <tr><td style="padding:0 32px 24px 32px;">
          <p style="font-size:12px;color:#9ca3af;line-height:1.6;">This code expires in 30 minutes. If you didn't request this, you can safely ignore this email.</p>
        </td></tr>
        <tr><td style="padding:16px 32px 32px 32px;border-top:1px solid rgba(255,255,255,0.07);">
          <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} TrustedCollectibles</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  }).catch(console.error);

  return NextResponse.json({ sent: true });
}

// PATCH: verify code
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.email_confirmed_at) {
    return NextResponse.json({ verified: true });
  }

  const { code } = await request.json();
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

  const meta = user.user_metadata || {};
  const storedCode = meta.email_verify_code;
  const expires = meta.email_verify_expires;

  if (!storedCode || !expires) {
    return NextResponse.json({ error: "No verification pending. Send a new code." }, { status: 400 });
  }

  if (new Date(expires) < new Date()) {
    return NextResponse.json({ error: "Code expired. Send a new code." }, { status: 400 });
  }

  if (code !== storedCode) {
    return NextResponse.json({ error: "Incorrect code." }, { status: 400 });
  }

  // Mark email as verified in metadata
  await supabase.auth.updateUser({
    data: {
      email_verified_manually: true,
      email_verify_code: null,
      email_verify_expires: null,
    },
  });

  return NextResponse.json({ verified: true });
}
