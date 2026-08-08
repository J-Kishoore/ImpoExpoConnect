const nodemailer = require("nodemailer");
const { config } = require("../config/env");

let transport = null;

function isConfigured() {
  return Boolean(config.email.smtpHost && config.email.from);
}

function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: config.email.smtpHost,
      port: config.email.smtpPort,
      secure: config.email.smtpSecure,
      auth: config.email.smtpUser
        ? { user: config.email.smtpUser, pass: config.email.smtpPass }
        : undefined,
    });
  }
  return transport;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Sends email best-effort: never throws, and becomes a silent no-op when SMTP is
// not configured (so dev/test environments run without a mail server).
async function sendEmail({ to, subject, html }) {
  if (!isConfigured()) {
    console.warn(`[email] SMTP not configured — skipping "${subject}" to ${to}`);
    return { skipped: true };
  }
  try {
    return await getTransport().sendMail({ from: config.email.from, to, subject, html });
  } catch (err) {
    console.error(`[email] send failed for "${subject}" to ${to}:`, err.message);
    return { failed: true };
  }
}

function renderLayout({ heading, paragraphs = [], details = [], cta }) {
  const brandGreen = "#1e5c3a";
  const detailsRows = details
    .map(
      (d) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e5e1d8;font-size:12px;color:#78716c;">${escapeHtml(d.label)}</td>
          <td style="padding:8px 12px;border:1px solid #e5e1d8;font-size:13px;color:#1c1917;font-weight:600;">${escapeHtml(String(d.value))}</td>
        </tr>`
    )
    .join("");
  const paras = paragraphs
    .map((p) => `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#44403c;">${escapeHtml(p)}</p>`)
    .join("");
  const ctaHtml = cta
    ? `
      <p style="text-align:center;margin:24px 0 8px;">
        <a href="${escapeAttr(cta.href)}" style="display:inline-block;background:${brandGreen};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;">${escapeHtml(cta.label)}</a>
      </p>`
    : "";

  return `
  <div style="background:#f6f4f0;padding:24px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e1d8;border-radius:12px;overflow:hidden;">
      <div style="background:${brandGreen};padding:20px 28px;">
        <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">ImpoExpo Connect</p>
      </div>
      <div style="padding:28px;">
        <h2 style="margin:0 0 16px;font-size:18px;color:#1c1917;">${escapeHtml(heading)}</h2>
        ${paras}
        ${detailsRows ? `<table style="width:100%;border-collapse:collapse;margin:12px 0;">${detailsRows}</table>` : ""}
        ${ctaHtml}
      </div>
      <div style="background:#faf9f7;padding:16px 28px;border-top:1px solid #e5e1d8;">
        <p style="margin:0;font-size:11px;color:#a8a29e;">You received this email because you have an account on ImpoExpo Connect. If you didn't expect this, you can ignore it.</p>
      </div>
    </div>
  </div>`;
}

module.exports = { sendEmail, renderLayout, isConfigured };
