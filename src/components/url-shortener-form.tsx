"use client";

import { FormEvent, useState } from "react";

type ShortenResponse = {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
};

type UrlShortenerFormProps = {
  disabled?: boolean;
};

export function UrlShortenerForm({ disabled = false }: UrlShortenerFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setCopied(false);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url
        })
      });

      const data = (await response.json()) as ShortenResponse | { error?: string };

      if (!response.ok) {
        setResult(null);
        setError(data && "error" in data ? data.error ?? "Unable to shorten this URL." : "Unable to shorten this URL.");
        return;
      }

      setResult(data as ShortenResponse);
      setUrl("");
    } catch {
      setError("Something went wrong while reaching the server.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink/70">Destination URL</span>
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/your-long-link"
            className="w-full rounded-[24px] border border-ink/10 bg-mist px-5 py-4 text-base text-ink outline-none transition placeholder:text-ink/40 focus:border-sea focus:ring-4 focus:ring-sea/10"
            autoComplete="off"
            inputMode="url"
            disabled={disabled}
            required
          />
        </label>

        <button
          type="submit"
          disabled={isLoading || disabled}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/50"
        >
          {disabled ? "Setup required" : isLoading ? "Creating short URL..." : "Shorten URL"}
        </button>
      </form>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 rounded-[28px] border border-sea/10 bg-mist p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sea">Your short link</p>
          <div className="mt-3 break-all text-lg font-semibold text-ink">{result.shortUrl}</div>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Redirects to {result.originalUrl}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center rounded-full bg-sea px-5 py-3 text-sm font-semibold text-white transition hover:bg-sea/90"
            >
              {copied ? "Copied" : "Copy short URL"}
            </button>
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/20"
            >
              Open short URL
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
