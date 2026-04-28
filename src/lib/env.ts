export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function resolveAppOrigin(request?: Request) {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredOrigin) {
    return configuredOrigin.replace(/\/$/, "");
  }

  if (request) {
    return new URL(request.url).origin;
  }

  return "http://localhost:3000";
}

