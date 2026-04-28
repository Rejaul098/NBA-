import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured, resolveAppOrigin } from "@/lib/env";
import { createShortCode } from "@/lib/short-code";
import { rateLimit } from "@/lib/rate-limit";
import { validateDestinationUrl } from "@/lib/validate-url";

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "anonymous";
  }

  return request.headers.get("x-real-ip") ?? "anonymous";
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: "The app is not configured yet. Add DATABASE_URL and run the Prisma schema push first."
      },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const rateLimitResult = rateLimit.limit(ip);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a minute before creating another short URL."
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limitValue),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.resetAt)
        }
      }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const urlInput =
    typeof payload === "object" && payload !== null && "url" in payload ? payload.url : undefined;

  const validation = validateDestinationUrl(urlInput);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    let shortCode = "";

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const candidate = createShortCode();
      const existing = await prisma.link.findUnique({
        where: {
          shortCode: candidate
        },
        select: {
          id: true
        }
      });

      if (!existing) {
        shortCode = candidate;
        break;
      }
    }

    if (!shortCode) {
      return NextResponse.json(
        { error: "Could not generate a unique short code. Please try again." },
        { status: 500 }
      );
    }

    const link = await prisma.link.create({
      data: {
        originalUrl: validation.url,
        shortCode
      }
    });

    return NextResponse.json(
      {
        id: link.id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: `${resolveAppOrigin(request)}/${link.shortCode}`,
        clickCount: link.clickCount
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limitValue),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.resetAt)
        }
      }
    );
  } catch (error) {
    console.error("Failed to create short URL", error);
    return NextResponse.json(
      { error: "Something went wrong while creating the short URL." },
      { status: 500 }
    );
  }
}
