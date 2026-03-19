import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { data: req } = await supabase.from("auth_requests")
    .select("*, reviewer:profiles!auth_requests_reviewed_by_fkey(full_name)")
    .eq("id", id).single();

  if (!req) return new NextResponse("Not found", { status: 404 });
  if (req.user_id !== user.id) return new NextResponse("Forbidden", { status: 403 });
  if (req.tier !== "premium" || req.status !== "completed") return new NextResponse("Certificate not available", { status: 400 });

  const verdictLabels: Record<string, string> = {
    authentic: "AUTHENTIC",
    likely_authentic: "LIKELY AUTHENTIC",
    inconclusive: "INCONCLUSIVE",
    likely_not_authentic: "LIKELY NOT AUTHENTIC",
  };

  const verdictColors: Record<string, string> = {
    authentic: "#22c55e",
    likely_authentic: "#22c55e",
    inconclusive: "#eab308",
    likely_not_authentic: "#ef4444",
  };

  const reviewerName = (req.reviewer as any)?.full_name || "TC Authentication Team";
  const verdictLabel = verdictLabels[req.verdict || ""] || req.verdict || "";
  const verdictColor = verdictColors[req.verdict || ""] || "#ffffff";

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Authentication Certificate — TrustedCollectibles</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #08090e; color: #fff; padding: 40px; }
  .cert { max-width: 700px; margin: 0 auto; border: 2px solid #c67b2f; border-radius: 16px; padding: 48px; background: #15171f; }
  .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
  .logo-mark { border: 2px solid #c67b2f; border-radius: 8px; padding: 6px 10px; font-weight: 800; color: #c67b2f; font-size: 14px; }
  .logo-text { font-size: 18px; font-weight: 700; }
  .logo-text span { color: #c67b2f; }
  .title { font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #c67b2f; margin-bottom: 8px; }
  .subtitle { font-size: 14px; color: #9ca3af; margin-bottom: 32px; }
  .verdict { font-size: 36px; font-weight: 800; letter-spacing: 3px; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0; border: 2px solid; }
  .details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
  .detail-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
  .detail-value { font-size: 14px; font-weight: 600; margin-top: 4px; }
  .notes { background: #08090e; border-radius: 8px; padding: 16px; margin: 24px 0; border: 1px solid rgba(255,255,255,0.07); }
  .notes h3 { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
  .notes p { font-size: 14px; color: #d1d5db; line-height: 1.6; }
  .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; }
  @media print { body { background: #08090e; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="cert">
  <div class="logo">
    <span class="logo-mark">TC</span>
    <span class="logo-text">Trusted<span>Collectibles</span></span>
  </div>
  <div class="title">Certificate of Authentication</div>
  <div class="subtitle">Reference: ${req.id.slice(0, 8).toUpperCase()}</div>
  <div class="verdict" style="color: ${verdictColor}; border-color: ${verdictColor}30; background: ${verdictColor}10;">
    ${verdictLabel}
  </div>
  <div class="details">
    <div><div class="detail-label">Sport</div><div class="detail-value">${req.sport}</div></div>
    <div><div class="detail-label">Item Type</div><div class="detail-value">${req.item_type}</div></div>
    <div><div class="detail-label">Date</div><div class="detail-value">${new Date(req.reviewed_at || req.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div></div>
    <div><div class="detail-label">Reviewed By</div><div class="detail-value">${reviewerName}</div></div>
  </div>
  ${req.reviewer_notes ? `<div class="notes"><h3>Expert Assessment</h3><p>${req.reviewer_notes}</p></div>` : ""}
  <div class="footer">
    <span>TrustedCollectibles Authentication Service</span>
    <span>Certificate ID: TC-${req.id.slice(0, 8).toUpperCase()}</span>
  </div>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
