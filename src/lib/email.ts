import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
  }
  return _resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "TrustedCollectibles <noreply@trustedcollectibles.com>";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trustedcollectibles.com";

function brandedTemplate({
  heading,
  body,
  ctaText,
  ctaUrl,
  footerText,
}: {
  heading: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  footerText?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#08090e;font-family:'Plus Jakarta Sans',Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#08090e;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#15171f;border-radius:12px;border:1px solid rgba(255,255,255,0.07);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border:2px solid #c67b2f;border-radius:8px;padding:6px 10px;">
                    <span style="font-size:14px;font-weight:700;color:#c67b2f;letter-spacing:0.5px;">TC</span>
                  </td>
                  <td style="padding-left:12px;">
                    <span style="font-size:16px;font-weight:700;color:#ffffff;">Trusted</span><span style="font-size:16px;font-weight:700;color:#c67b2f;">Collectibles</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Heading -->
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${heading}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:16px 32px 0 32px;">
              <div style="font-size:14px;line-height:1.6;color:#f0eff2;">${body}</div>
            </td>
          </tr>
          ${ctaText && ctaUrl ? `
          <!-- CTA Button -->
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#c67b2f;border-radius:8px;">
                    <a href="${ctaUrl}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#08090e;text-decoration:none;">${ctaText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ""}
          <!-- Footer -->
          <tr>
            <td style="padding:32px;border-top:1px solid rgba(255,255,255,0.07);margin-top:24px;">
              ${footerText ? `<p style="margin:0 0 12px 0;font-size:12px;color:#9ca3af;">${footerText}</p>` : ""}
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} TrustedCollectibles. All rights reserved.
              </p>
              <p style="margin:4px 0 0 0;font-size:12px;">
                <a href="${SITE_URL}/terms" style="color:#9ca3af;text-decoration:underline;">Terms</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}/privacy" style="color:#9ca3af;text-decoration:underline;">Privacy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

// ============================================================
// Email senders
// ============================================================

export async function sendWelcomeEmail(email: string, name: string) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to TrustedCollectibles!",
    html: brandedTemplate({
      heading: `Welcome, ${name || "Collector"}!`,
      body: `
        <p style="color:#f0eff2;">Thanks for joining TrustedCollectibles — the trusted marketplace for authenticated sports memorabilia.</p>
        <p style="color:#f0eff2;">Here's what you can do:</p>
        <ul style="color:#f0eff2;padding-left:20px;">
          <li><strong style="color:#ffffff;">Browse</strong> verified collectibles from trusted sellers</li>
          <li><strong style="color:#ffffff;">Buy with confidence</strong> — every payment is escrow-protected</li>
          <li><strong style="color:#ffffff;">Sell your items</strong> — list authenticated memorabilia and reach thousands of collectors</li>
        </ul>
        <p style="color:#f0eff2;">Every item on our platform is verified by our authentication team. Your payment is always protected.</p>
      `,
      ctaText: "Browse the Marketplace",
      ctaUrl: `${SITE_URL}/marketplace`,
    }),
  }).catch(console.error);
}

export async function sendOrderConfirmationBuyer(
  email: string,
  buyerName: string,
  itemTitle: string,
  amount: number,
  orderId: string
) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Order Confirmed — ${itemTitle}`,
    html: brandedTemplate({
      heading: "Order Confirmed!",
      body: `
        <p style="color:#f0eff2;">Hi ${buyerName},</p>
        <p style="color:#f0eff2;">Your purchase has been confirmed and your payment of <strong style="color:#ffffff;">${formatPrice(amount)}</strong> is being held securely in escrow.</p>
        <table role="presentation" width="100%" style="background-color:#08090e;border-radius:8px;border:1px solid rgba(255,255,255,0.07);margin:16px 0;">
          <tr><td style="padding:16px;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">${itemTitle}</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#f0eff2;">Amount: ${formatPrice(amount)}</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#f0eff2;">Status: Payment held in escrow</p>
          </td></tr>
        </table>
        <p style="color:#f0eff2;">The seller has been notified and will ship your item within 3 business days. You'll receive a tracking number once it's on its way.</p>
      `,
      ctaText: "View Your Order",
      ctaUrl: `${SITE_URL}/dashboard/orders`,
      footerText: "Your payment is protected by our escrow system. Funds are only released to the seller after you confirm delivery.",
    }),
  }).catch(console.error);
}

export async function sendNewOrderSeller(
  email: string,
  sellerName: string,
  itemTitle: string,
  amount: number,
  buyerName: string
) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `New Order — ${itemTitle}`,
    html: brandedTemplate({
      heading: "You've Got a Sale!",
      body: `
        <p style="color:#f0eff2;">Hi ${sellerName},</p>
        <p style="color:#f0eff2;"><strong style="color:#ffffff;">${buyerName}</strong> has purchased your item:</p>
        <table role="presentation" width="100%" style="background-color:#08090e;border-radius:8px;border:1px solid rgba(255,255,255,0.07);margin:16px 0;">
          <tr><td style="padding:16px;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">${itemTitle}</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#f0eff2;">Sale amount: ${formatPrice(amount)}</p>
          </td></tr>
        </table>
        <p style="color:#f0eff2;">Please ship the item within <strong style="color:#ffffff;">3 business days</strong> and add the tracking number to your dashboard. Payment will be released once the buyer confirms delivery.</p>
      `,
      ctaText: "Manage Orders",
      ctaUrl: `${SITE_URL}/dashboard/orders`,
    }),
  }).catch(console.error);
}

export async function sendShippingConfirmation(
  email: string,
  buyerName: string,
  itemTitle: string,
  trackingNumber: string
) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your Item Has Shipped — ${itemTitle}`,
    html: brandedTemplate({
      heading: "Your Item Has Shipped!",
      body: `
        <p style="color:#f0eff2;">Hi ${buyerName},</p>
        <p style="color:#f0eff2;">Great news — <strong style="color:#ffffff;">${itemTitle}</strong> is on its way to you.</p>
        <table role="presentation" width="100%" style="background-color:#08090e;border-radius:8px;border:1px solid rgba(255,255,255,0.07);margin:16px 0;">
          <tr><td style="padding:16px;">
            <p style="margin:0;font-size:13px;color:#f0eff2;">Tracking Number</p>
            <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:#c67b2f;">${trackingNumber}</p>
          </td></tr>
        </table>
        <p style="color:#f0eff2;">Once you receive the item, you'll have 3 business days to inspect it and confirm delivery. Your payment remains safely held in escrow until then.</p>
      `,
      ctaText: "Track Your Order",
      ctaUrl: `${SITE_URL}/dashboard/orders`,
    }),
  }).catch(console.error);
}

export async function sendDeliveryConfirmation(
  buyerEmail: string,
  sellerEmail: string,
  buyerName: string,
  sellerName: string,
  itemTitle: string,
  amount: number,
  platformFee: number
) {
  // Email to buyer
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: buyerEmail,
    subject: `Delivery Confirmed — ${itemTitle}`,
    html: brandedTemplate({
      heading: "Delivery Confirmed!",
      body: `
        <p style="color:#f0eff2;">Hi ${buyerName},</p>
        <p style="color:#f0eff2;">You've confirmed delivery of <strong style="color:#ffffff;">${itemTitle}</strong>. The payment has been released to the seller.</p>
        <p style="color:#f0eff2;">We'd love to hear about your experience — leave a review to help other collectors.</p>
      `,
      ctaText: "Leave a Review",
      ctaUrl: `${SITE_URL}/dashboard/orders`,
    }),
  }).catch(console.error);

  // Email to seller
  const sellerPayout = amount - platformFee;
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: sellerEmail,
    subject: `Payment Released — ${itemTitle}`,
    html: brandedTemplate({
      heading: "Payment Released!",
      body: `
        <p style="color:#f0eff2;">Hi ${sellerName},</p>
        <p style="color:#f0eff2;">The buyer has confirmed delivery of <strong style="color:#ffffff;">${itemTitle}</strong>. Your payment has been released.</p>
        <table role="presentation" width="100%" style="background-color:#08090e;border-radius:8px;border:1px solid rgba(255,255,255,0.07);margin:16px 0;">
          <tr><td style="padding:16px;">
            <p style="margin:0;font-size:13px;color:#f0eff2;">Sale: ${formatPrice(amount)}</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#f0eff2;">Platform fee: -${formatPrice(platformFee)}</p>
            <p style="margin:8px 0 0 0;font-size:16px;font-weight:600;color:#c67b2f;">Your payout: ${formatPrice(sellerPayout)}</p>
          </td></tr>
        </table>
        <p style="color:#f0eff2;">Funds will arrive in your Stripe account within 2-3 business days.</p>
      `,
      ctaText: "View Dashboard",
      ctaUrl: `${SITE_URL}/dashboard`,
    }),
  }).catch(console.error);
}

export async function sendOfferReceivedSeller(
  email: string,
  sellerName: string,
  itemTitle: string,
  offerAmount: number,
  listingPrice: number,
  buyerName: string
) {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `New Offer on ${itemTitle}`,
    html: brandedTemplate({
      heading: "New Offer Received",
      body: `
        <p style="color:#f0eff2;">Hi ${sellerName},</p>
        <p style="color:#f0eff2;"><strong style="color:#ffffff;">${buyerName}</strong> has made an offer on your listing:</p>
        <table role="presentation" width="100%" style="background-color:#08090e;border-radius:8px;border:1px solid rgba(255,255,255,0.07);margin:16px 0;">
          <tr><td style="padding:16px;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;">${itemTitle}</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#f0eff2;">Listed price: ${formatPrice(listingPrice)}</p>
            <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:#c67b2f;">Offer: ${formatPrice(offerAmount)}</p>
          </td></tr>
        </table>
        <p style="color:#f0eff2;">You can accept or decline this offer from your dashboard.</p>
      `,
      ctaText: "View Offers",
      ctaUrl: `${SITE_URL}/dashboard`,
    }),
  }).catch(console.error);
}

export async function sendOfferResponseBuyer(
  email: string,
  buyerName: string,
  itemTitle: string,
  offerAmount: number,
  accepted: boolean
) {
  const heading = accepted ? "Offer Accepted!" : "Offer Declined";
  const message = accepted
    ? `Your offer of <strong style="color:#c67b2f;">${formatPrice(offerAmount)}</strong> on <strong style="color:#ffffff;">${itemTitle}</strong> has been accepted! An order has been created and the seller will ship your item soon.`
    : `Unfortunately, your offer of ${formatPrice(offerAmount)} on <strong style="color:#ffffff;">${itemTitle}</strong> was declined by the seller. You can browse other listings or make a new offer.`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `${heading} — ${itemTitle}`,
    html: brandedTemplate({
      heading,
      body: `
        <p style="color:#f0eff2;">Hi ${buyerName},</p>
        <p style="color:#f0eff2;">${message}</p>
      `,
      ctaText: accepted ? "View Your Order" : "Browse Marketplace",
      ctaUrl: accepted ? `${SITE_URL}/dashboard/orders` : `${SITE_URL}/marketplace`,
    }),
  }).catch(console.error);
}

export async function sendListingReviewResult(
  email: string,
  sellerName: string,
  itemTitle: string,
  approved: boolean,
  reason?: string
) {
  const heading = approved ? "Listing Approved!" : "Listing Needs Attention";
  const body = approved
    ? `<p style="color:#f0eff2;">Hi ${sellerName},</p>
       <p style="color:#f0eff2;">Great news — your listing <strong style="color:#ffffff;">${itemTitle}</strong> has been verified and is now live on the marketplace!</p>
       <p style="color:#f0eff2;">Buyers can now find, purchase, and make offers on your item.</p>`
    : `<p style="color:#f0eff2;">Hi ${sellerName},</p>
       <p style="color:#f0eff2;">Your listing <strong style="color:#ffffff;">${itemTitle}</strong> was not approved at this time.</p>
       ${reason ? `<table role="presentation" width="100%" style="background-color:#08090e;border-radius:8px;border:1px solid rgba(255,255,255,0.07);margin:16px 0;">
         <tr><td style="padding:16px;">
           <p style="margin:0;font-size:13px;color:#f0eff2;">Reason:</p>
           <p style="margin:4px 0 0 0;font-size:14px;color:#ffffff;">${reason}</p>
         </td></tr>
       </table>` : ""}
       <p style="color:#f0eff2;">You can update your listing and resubmit it for review from your dashboard.</p>`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `${heading} — ${itemTitle}`,
    html: brandedTemplate({
      heading,
      body,
      ctaText: approved ? "View Your Listing" : "Update Listing",
      ctaUrl: `${SITE_URL}/dashboard/listings`,
    }),
  }).catch(console.error);
}
