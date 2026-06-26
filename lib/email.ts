import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SCHOOL_NAME = "The Benedictine Academy";
const SCHOOL_EMAIL = "admissions@thebenedictineacademy.edu.ng";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
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
  return {
    subject: `Application Received - ${data.registrationNumber}`,
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: auto; background: #FAF7F2;">
        <div style="background: #1B3A5C; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #F59E0B; margin: 0;">${SCHOOL_NAME}</h1>
          <p style="color: #ffffff99;">Admission Confirmation</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
          <p>Dear <strong>${data.parentName}</strong>,</p>
          <p>We have received the application for <strong>${data.childName}</strong>.</p>
          <div style="background: #FAF7F2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Registration Number:</strong> ${data.registrationNumber}</p>
            <p><strong>Class:</strong> ${data.applyingClass}</p>
            <p><strong>Session:</strong> ${data.session}</p>
          </div>
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Application reviewed within 2-7 working days</li>
            <li>Updates sent to your email</li>
            <li>Track your application anytime</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admission/track" 
             style="display: inline-block; background: #1B3A5C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Track Application
          </a>
        </div>
      </div>
    `,
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
    AWAITING_TEST: "Awaiting Entrance Test",
    TEST_SCHEDULED: "Entrance Test Scheduled",
    TEST_COMPLETED: "Test Completed",
    INTERVIEW_SCHEDULED: "Interview Scheduled",
    ACCEPTED: "Accepted",
    ADMITTED: "Admitted",
    REJECTED: "Not Successful",
  };

  return {
    subject: `Application Update - ${data.registrationNumber}`,
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: auto; background: #FAF7F2;">
        <div style="background: #1B3A5C; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #F59E0B; margin: 0;">${SCHOOL_NAME}</h1>
          <p style="color: #ffffff99;">Application Update</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
          <p>Dear <strong>${data.parentName}</strong>,</p>
          <p>Update regarding <strong>${data.childName}</strong>:</p>
          <div style="background: #FAF7F2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Registration:</strong> ${data.registrationNumber}</p>
            <p><strong>Status:</strong> ${labels[data.status] || data.status}</p>
          </div>
          <p>${data.message}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admission/track" 
             style="display: inline-block; background: #1B3A5C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Track Application
          </a>
        </div>
      </div>
    `,
  };
}