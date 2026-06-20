// app/api/contact/route.ts
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/prisma";
import { escapeHtml } from "@/lib/sanitize"; // ✅ Import shared utility

// 1. Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 2. Initialize Upstash Rate Limiter
const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  analytics: true,
});

// 3. Validation Schema
const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  honeypot: z.string().max(0).optional(),
});

// ❌ DELETE this local function
// function sanitizeHtml(str: string): string {
//   return str ...
// }

export async function POST(req: Request) {
  try {
    // A. Get client IP for rate limiting
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || "127.0.0.1";

    // B. Rate Limiting (skip in development)
    if (process.env.NODE_ENV === "production") {
      const { success, limit, reset, remaining } = await ratelimit.limit(clientIp);
      
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": String(remaining),
              "X-RateLimit-Reset": String(reset),
            },
          }
        );
      }
    }

    // C. Parse request body
    const body = await req.json();

    // D. Honeypot check (bot detection)
    if (body.honeypot) {
      console.log("🤖 Bot caught in honeypot");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // E. Validate input
    const validation = ContactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validation.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = validation.data;
    
    // F. Sanitize input — use imported escapeHtml
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email.toLowerCase()),
      phone: escapeHtml(phone),
      message: escapeHtml(message),
    };

    // G. Check API key
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY not configured");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    // H. Save to database FIRST
    try {
      await prisma.contactMessage.create({
        data: {
          name: safe.name,
          email: safe.email,
          phone: safe.phone || null,
          subject: `New inquiry from ${safe.name}`,
          message: safe.message,
          isRead: false,
        },
      });
      console.log("✅ Contact saved to database");
    } catch (dbError) {
      console.error("❌ Database save failed:", dbError);
      // Continue with email even if DB fails
    }

    // I. Send email notification
    const { data, error } = await resend.emails.send({
      from: "The Benedictine Academy <info@mail.thebenedictineacademyportal.com>",
      to: "thebenedictineacademy@gmail.com",
      replyTo: safe.email,
      subject: `[Contact Form] ${safe.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; font-weight: bold; width: 100px;">Name:</td>
                <td style="padding: 8px;">${safe.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px;">
                  <a href="mailto:${safe.email}" style="color: #2b6cb0;">${safe.email}</a>
                </td>
              </tr>
              ${safe.phone ? `
              <tr>
                <td style="padding: 8px; font-weight: bold;">Phone:</td>
                <td style="padding: 8px;">
                  <a href="tel:${safe.phone}" style="color: #2b6cb0;">${safe.phone}</a>
                </td>
              </tr>
              ` : ''}
            </table>
            
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <h3 style="margin-top: 0; color: #2d3748;">Message:</h3>
              <p style="white-space: pre-wrap;">${safe.message}</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #718096;">
              Sent from The Benedictine Academy contact form
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      return NextResponse.json(
        { error: "Failed to send email notification" }, 
        { status: 500 }
      );
    }

    console.log("✅ Email sent successfully:", data?.id);
    return NextResponse.json(
      { 
        success: true, 
        message: "Your message has been sent successfully!" 
      }, 
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (err) {
    console.error("❌ Server Error:", {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' 
          ? `Internal error: ${err instanceof Error ? err.message : 'Unknown'}` 
          : "An unexpected error occurred. Please try again later." 
      }, 
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}