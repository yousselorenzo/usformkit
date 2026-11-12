import 'server-only';
import { SITE } from './site';

type Attachment = { filename: string; content: string /* base64 */ };

export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: Attachment[];
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.includes('REPLACE_ME')) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${args.subject}" to ${args.to}`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || `${SITE.name} <documents@${SITE.domain}>`,
      to: [args.to],
      reply_to: SITE.supportEmail,
      subject: args.subject,
      html: args.html,
      text: args.text,
      attachments: args.attachments,
    }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`);
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function shell(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#F2F5FA;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0E1C36">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E3E9F3;border-radius:16px">
<tr><td style="padding:24px 28px;border-bottom:1px solid #E3E9F3;font-weight:700;font-size:15px;letter-spacing:.2px">US Form Kit</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 12px;font-size:20px;line-height:1.3">${esc(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #E3E9F3;font-size:12px;color:#64748B;line-height:1.5">
Questions? Reply to this email or write to <a href="mailto:${SITE.supportEmail}" style="color:#1F3760">${SITE.supportEmail}</a>.<br>${esc(SITE.disclaimer)}
</td></tr></table></td></tr></table></body></html>`;
}

export function customerEmail(o: { productName: string; downloadUrl: string; attached: boolean; days: number }) {
  const subject = `Your ${o.productName} is ready`;
  const html = shell(
    subject,
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155">Thanks for your purchase. ${
      o.attached ? 'A backup copy of your PDF is attached to this email.' : 'For your security, the PDF is not attached to this email.'
    } You can also download it any time in the next ${o.days} days:</p>
<p style="margin:0 0 20px"><a href="${esc(o.downloadUrl)}" style="display:inline-block;background:#0E1C36;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px">Download PDF</a></p>
<p style="margin:0;font-size:13px;line-height:1.6;color:#64748B">Print it, review every field, and sign where indicated. Keep this link private: anyone with it can download your document.</p>`,
  );
  const text = `${subject}\n\n${o.attached ? 'Your PDF is attached.\n' : ''}Download: ${o.downloadUrl}\n(available for ${o.days} days)\n\n${SITE.disclaimer}`;
  return { subject, html, text };
}

export function adminEmail(o: {
  productName: string;
  amount: string;
  customerEmail: string;
  sessionId: string;
  livemode: boolean;
}) {
  const subject = `${o.livemode ? '' : '[TEST] '}New order: ${o.productName} (${o.amount})`;
  const rows = [
    ['Product', o.productName],
    ['Amount', o.amount],
    ['Customer', o.customerEmail || '—'],
    ['Checkout session', o.sessionId],
    ['Mode', o.livemode ? 'Live' : 'Test'],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:#64748B;font-size:13px;width:140px">${k}</td><td style="padding:6px 0;font-size:13px">${esc(v)}</td></tr>`,
    )
    .join('');
  const html = shell('New order received', `<table cellpadding="0" cellspacing="0" width="100%">${rows}</table>`);
  const text = `New order\nProduct: ${o.productName}\nAmount: ${o.amount}\nCustomer: ${o.customerEmail}\nSession: ${o.sessionId}`;
  return { subject, html, text };
}
