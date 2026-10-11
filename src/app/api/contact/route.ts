import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Basic in-memory rate limiting: 5 submissions per hour per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Clean expired entry
  if (entry && now > entry.resetTime) {
    rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(ip);
  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count += 1;
  return true;
}

function sanitizeText(input: unknown, maxLen: number): string {
  if (typeof input !== "string") return "";
  return input
    .slice(0, maxLen)
    .replace(/[<>]/g, "")
    .trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit reached. Please wait or send an email directly.",
          rateLimited: true,
          fallbackEmail: "sasotomujaddid@gmail.com",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name, email, message, company_hp } = body;

    // Honeypot check: if filled, quietly succeed to confound bot
    if (typeof company_hp === "string" && company_hp.trim().length > 0) {
      return NextResponse.json({ success: true, message: "Message sent." });
    }

    const cleanName = sanitizeText(name, 100);
    const cleanEmail = sanitizeText(email, 150);
    const cleanMsg = sanitizeText(message, 3000);

    if (!cleanName) {
      return NextResponse.json(
        { success: false, error: "Please provide your name." },
        { status: 400 }
      );
    }

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!cleanMsg) {
      return NextResponse.json(
        { success: false, error: "Please enter a message." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_TO_EMAIL;

    // Fail gracefully if environment variables are not configured in Vercel
    if (!apiKey || !recipient) {
      console.warn(
        "[Contact API] RESEND_API_KEY or CONTACT_TO_EMAIL is not configured. Falling back to direct email."
      );
      return NextResponse.json(
        {
          success: false,
          missingConfig: true,
          error:
            "Email service is currently offline. Please reach out directly at sasotomujaddid@gmail.com.",
          fallbackEmail: "sasotomujaddid@gmail.com",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const fromAddress =
      process.env.CONTACT_FROM_EMAIL ||
      "Portfolio Studio <onboarding@resend.dev>";

    const { error: resendError } = await resend.emails.send({
      from: fromAddress,
      to: recipient,
      replyTo: cleanEmail,
      subject: `New Portfolio Inquiry from ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMsg}`,
    });

    if (resendError) {
      console.error("[Contact API] Resend email delivery error:", resendError);
      return NextResponse.json(
        {
          success: false,
          error: "Delivery failed. Please email sasotomujaddid@gmail.com directly.",
          fallbackEmail: "sasotomujaddid@gmail.com",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (err) {
    console.error("[Contact API] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please use direct email.",
        fallbackEmail: "sasotomujaddid@gmail.com",
      },
      { status: 500 }
    );
  }
}
