// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { resend } from "@/lib/resend";
import { escapeHtml } from "@/lib/sanitize";

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
});

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(20).optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  honeypot: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  try {
    // Rate limiting
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || "127.0.0.1";

    if (process.env.NODE_ENV === "production") {
      const { success, reset } = await ratelimit.limit(clientIp);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
            },
          }
        );
      }
    }

    const body = await req.json();

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Validate
    const validation = ContactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = validation.data;

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email.toLowerCase()),
      phone: escapeHtml(phone),
      message: escapeHtml(message),
    };

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const { error } = await resend.emails.send({
      from: "The Benedictine Academy <info@mail.thebenedictineacademyportal.com>",
      to: "thebenedictineacademy@gmail.com",
      replyTo: safe.email,
      subject: `[Contact Form] ${safe.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px; font-weight: bold; width: 100px;">Name:</td><td style="padding: 8px;">${safe.name}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
              ${safe.phone ? `<tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${safe.phone}</td></tr>` : ""}
            </table>
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h3 style="margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap;">${safe.message}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}