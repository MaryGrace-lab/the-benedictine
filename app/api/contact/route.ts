import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

// 1. Initialize Resend only
const resend = new Resend(process.env.RESEND_API_KEY);

// 2. Validation Schema
const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(50),
  email: z.string().email("Invalid email address").toLowerCase(),
  phone: z.string().min(10, "Phone number is too short"),
  message: z.string().trim().min(10, "Message is too short").max(2000),
  honeypot: z.string().optional(), // Invisible field to catch bots
});

export async function POST(req: Request) {
  try {
    // A. Parse the incoming request body
    const body = await req.json();
    
    // B. Honeypot Logic: If this hidden field is filled, it's a bot. 
    // We return a 200 "success" so the bot thinks it succeeded, but we do nothing.
    if (body.honeypot) {
      return NextResponse.json({ success: true, message: "Message sent!" }, { status: 200 });
    }

    // C. Validate the data against our schema
    const validation = ContactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { name, email, phone, message } = validation.data;

    // D. Send Email using your verified domain
    const { error } = await resend.emails.send({
      from: "The Benedictine Academy <info@mail.thebenedictineacademyportal.com>",
      to: "thebenedictineacademy@gmail.com",
      reply_to: email,
      subject: `Inquiry: ${name}`,
      html: `
        <div style="background-color: #f4f4f4; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e1e1e1;">
            <div style="height: 6px; background-color: #d4af37;"></div>
            <div style="padding: 30px 40px; border-bottom: 1px solid #eee;">
              <h1 style="margin: 0; color: #270f01; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                The Benedictine Academy
              </h1>
              <p style="margin: 4px 0 0; color: #666; font-size: 13px;">Official Website Inquiry</p>
            </div>
            <div style="padding: 40px; color: #333; line-height: 1.8;">
              <div style="margin-bottom: 30px; padding: 20px; background-color: #fcfcfc; border-left: 4px solid #d4af37;">
                <table style="width: 100%; font-size: 14px; border-spacing: 0;">
                  <tr><td style="color: #888; padding-bottom: 8px;">Sender:</td><td style="font-weight: 600; color: #270f01;">${name}</td></tr>
                  <tr><td style="color: #888; padding-bottom: 8px;">Email:</td><td style="font-weight: 600; color: #270f01;">${email}</td></tr>
                  <tr><td style="color: #888;">Phone:</td><td style="font-weight: 600; color: #270f01;">${phone}</td></tr>
                </table>
              </div>
              <p style="font-weight: 700; font-size: 12px; color: #270f01; text-transform: uppercase; margin-bottom: 10px;">Message Content:</p>
              <div style="font-size: 15px; color: #444; white-space: pre-wrap; border-top: 1px solid #eee; padding-top: 15px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <div style="padding: 20px; background-color: #270f01; text-align: center;">
              <p style="margin: 0; color: #d4af37; font-size: 11px; font-weight: 600;">© ${new Date().getFullYear()} THE BENEDICTINE ACADEMY</p>
            </div>
          </div>
        </div>
      `,
    });

    // E. Handle Resend errors
    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // F. Success!
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}