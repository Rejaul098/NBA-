import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-[32px] border border-black/5 bg-white/90 p-10 text-center shadow-card backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-sea">
          Missing Link
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-ink">
          That short URL does not exist.
        </h1>
        <p className="mt-4 text-base leading-7 text-ink/70">
          The link may have expired, been removed, or never existed in the first place.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          Create a new short link
        </Link>
      </div>
    </main>
  );
}

