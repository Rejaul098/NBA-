import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

type ShortCodePageProps = {
  params: Promise<{
    shortCode: string;
  }>;
};

function getClientIp(headerStore: Headers) {
  const forwardedFor = headerStore.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return headerStore.get("x-real-ip");
}

export default async function ShortCodePage({ params }: ShortCodePageProps) {
  if (!isDatabaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg rounded-[32px] border border-black/5 bg-white/90 p-10 text-center shadow-card backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sea">
            Setup Required
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-ink">
            Flashlink is waiting for a database connection.
          </h1>
          <p className="mt-4 text-base leading-7 text-ink/70">
            Add your managed Postgres `DATABASE_URL`, set `NEXT_PUBLIC_APP_URL`, and push the Prisma
            schema before resolving short links.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Back to homepage
          </Link>
        </div>
      </main>
    );
  }

  const { shortCode } = await params;
  const link = await prisma.link.findUnique({
    where: {
      shortCode
    }
  });

  if (!link || !link.isActive || (link.expiresAt && link.expiresAt < new Date())) {
    notFound();
  }

  const requestHeaders = await headers();

  await prisma.$transaction([
    prisma.link.update({
      where: {
        id: link.id
      },
      data: {
        clickCount: {
          increment: 1
        }
      }
    }),
    prisma.clickEvent.create({
      data: {
        linkId: link.id,
        ipAddress: getClientIp(requestHeaders),
        userAgent: requestHeaders.get("user-agent"),
        referer: requestHeaders.get("referer")
      }
    })
  ]);

  redirect(link.originalUrl);
}
