// lib/email.ts
import { resend } from "./resend";

const SCHOOL_NAME = "The Benedictine Academy";
const SCHOOL_EMAIL = "admissions@mail.thebenedictineacademyportal.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
const WHATSAPP_NUMBER = "2347059443788";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Reusable email layout wrapper
function emailLayout(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background: #F5F0EB; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background: #1B3A5C; padding: 30px 20px; text-align: center;">
            <h1 style="color: #F59E0B; margin: 0; font-size: 22px; font-weight: 700;">${SCHOOL_NAME}</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 13px;">Catholic Education Centre</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px 25px;">
            ${content}
          </td>
        </tr>
        <tr>
          <td style="background: #FAF7F2; padding: 20px 25px; text-align: center; border-top: 1px solid #E5D9CC;">
            <p style="color: #8B5E3C; font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} The Benedictine Academy. All rights reserved.<br>
              <a href="${APP_URL}" style="color: #8B5E3C; text-decoration: underline;">Visit our website</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await resend.emails.send({
      from: `${SCHOOL_NAME} <${SCHOOL_EMAIL}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false };
  }
}

export function applicationSubmittedEmail(data: {
  parentName: string;
  childName: string;
  registrationNumber: string;
  applyingClass: string;
  session: string;
}) {
  const safe = {
    parentName: escapeHtml(data.parentName),
    childName: escapeHtml(data.childName),
    registrationNumber: escapeHtml(data.registrationNumber),
    applyingClass: escapeHtml(data.applyingClass),
    session: escapeHtml(data.session),
  };

  const content = `
    <h2 style="color: #1B3A5C; margin-top: 0;">Application Received</h2>
    <p style="color: #333; line-height: 1.6;">Dear <strong>${safe.parentName}</strong>,</p>
    <p style="color: #333; line-height: 1.6;">
      Thank you for applying to The Benedictine Academy. We have successfully received the application for <strong>${safe.childName}</strong>.
    </p>
    <div style="background: #FAF7F2; border: 1px solid #E5D9CC; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 8px; font-weight: 600; color: #1B3A5C;">Application Details</p>
      <table cellpadding="4" style="font-size: 14px; color: #333;">
        <tr><td style="color: #8B5E3C;">Registration Number:</td><td><strong>${safe.registrationNumber}</strong></td></tr>
        <tr><td style="color: #8B5E3C;">Class Applied:</td><td><strong>${safe.applyingClass}</strong></td></tr>
        <tr><td style="color: #8B5E3C;">Session:</td><td><strong>${safe.session}</strong></td></tr>
      </table>
    </div>
    <p style="color: #333; line-height: 1.6;"><strong>What happens next?</strong></p>
    <ul style="color: #333; line-height: 1.6; padding-left: 20px;">
      <li>Your application will be reviewed within 2‑7 working days.</li>
      <li>All updates will be sent to this email address.</li>
      <li>You can track your application status at any time using the button below.</li>
    </ul>
    <div style="text-align: center; margin: 25px 0;">
      <a href="${APP_URL}/admission/track" 
         style="display: inline-block; background: #1B3A5C; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600;">
        Track Application
      </a>
    </div>
    <p style="color: #666; font-size: 13px; margin-top: 20px;">
      If you have any questions, please reply to this email or contact us via WhatsApp at
      <a href="https://wa.me/${WHATSAPP_NUMBER}" style="color: #1B3A5C;">+234 705 944 3788</a>.
    </p>
  `;

  return {
    subject: `Application Received – ${safe.registrationNumber}`,
    html: emailLayout(content),
  };
}

export function statusUpdateEmail(data: {
  parentName: string;
  childName: string;
  registrationNumber: string;
  status: string;
  message: string;
}) {
  const labels: Record<string, string> = {
    UNDER_REVIEW: "Under Review",
    ACCEPTED: "Accepted",
    ADMITTED: "Admitted",
    REJECTED: "Not Successful",
  };

  const safe = {
    parentName: escapeHtml(data.parentName),
    childName: escapeHtml(data.childName),
    registrationNumber: escapeHtml(data.registrationNumber),
    status: labels[data.status] || escapeHtml(data.status),
    message: escapeHtml(data.message),
  };

  // Acceptance / Admission – include payment instructions
  let paymentSection = "";
  if (data.status === "ACCEPTED" || data.status === "ADMITTED") {
    paymentSection = `
      <div style="background: #FFF9E6; border: 1px solid #F5D300; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px; font-weight: 700; color: #1B3A5C;">🎉 Next Step: Complete Admission</p>
        <p style="margin: 0 0 12px; color: #333;">
          To secure your child's place, please pay the required school fees and send the payment receipt to our official WhatsApp number:
        </p>
        <p style="font-size: 18px; font-weight: 700; text-align: center; margin: 12px 0;">
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20would%20like%20to%20complete%20the%20admission%20for%20${encodeURIComponent(data.childName)}%20(${data.registrationNumber})." 
             style="color: #25D366; text-decoration: none;">
            📱 +234 705 944 3788
          </a>
        </p>
        <p style="color: #666; font-size: 13px; margin: 0;">
          After payment confirmation, the admission process will be finalized and your child will be officially enrolled.
        </p>
      </div>
    `;
  }

  const content = `
    <h2 style="color: #1B3A5C; margin-top: 0;">Application Status Update</h2>
    <p style="color: #333; line-height: 1.6;">Dear <strong>${safe.parentName}</strong>,</p>
    <p style="color: #333; line-height: 1.6;">
      An update regarding the application of <strong>${safe.childName}</strong> is now available.
    </p>
    <div style="background: #FAF7F2; border: 1px solid #E5D9CC; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <table cellpadding="4" style="font-size: 14px; color: #333;">
        <tr><td style="color: #8B5E3C;">Registration Number:</td><td><strong>${safe.registrationNumber}</strong></td></tr>
        <tr><td style="color: #8B5E3C;">New Status:</td><td><strong style="color: #1B3A5C;">${safe.status}</strong></td></tr>
      </table>
    </div>
    <p style="color: #333; line-height: 1.6;">${safe.message}</p>
    ${paymentSection}
    <div style="text-align: center; margin: 25px 0;">
      <a href="${APP_URL}/admission/track" 
         style="display: inline-block; background: #1B3A5C; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600;">
        Track Application
      </a>
    </div>
    <p style="color: #666; font-size: 13px; margin-top: 20px;">
      If you have any questions, please contact us via WhatsApp at
      <a href="https://wa.me/${WHATSAPP_NUMBER}" style="color: #1B3A5C;">+234 705 944 3788</a>.
    </p>
  `;

  return {
    subject: `Application Update – ${safe.registrationNumber}`,
    html: emailLayout(content),
  };
}