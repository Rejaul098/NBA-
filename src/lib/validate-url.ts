function isPrivateIpv4(hostname: string) {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);

  if (!match) {
    return false;
  }

  const octets = match.slice(1).map(Number);

  if (octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
    return false;
  }

  if (octets[0] === 10) {
    return true;
  }

  if (octets[0] === 127) {
    return true;
  }

  if (octets[0] === 192 && octets[1] === 168) {
    return true;
  }

  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) {
    return true;
  }

  if (octets[0] === 0) {
    return true;
  }

  return false;
}

function isBlockedHostname(hostname: string) {
  const normalized = hostname.toLowerCase();

  if (normalized === "localhost" || normalized.endsWith(".local")) {
    return true;
  }

  if (isPrivateIpv4(normalized)) {
    return true;
  }

  return false;
}

type ValidationSuccess = {
  success: true;
  url: string;
};

type ValidationFailure = {
  success: false;
  error: string;
};

export function validateDestinationUrl(input: unknown): ValidationSuccess | ValidationFailure {
  if (typeof input !== "string") {
    return {
      success: false,
      error: "A destination URL is required."
    };
  }

  const trimmed = input.trim();

  if (!trimmed) {
    return {
      success: false,
      error: "Please enter a URL to shorten."
    };
  }

  if (trimmed.length > 2048) {
    return {
      success: false,
      error: "The URL is too long."
    };
  }

  let parsed: URL;

  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      success: false,
      error: "Please enter a valid URL including http:// or https://"
    };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return {
      success: false,
      error: "Only http:// and https:// URLs are supported."
    };
  }

  if (isBlockedHostname(parsed.hostname)) {
    return {
      success: false,
      error: "This host is not allowed."
    };
  }

  return {
    success: true,
    url: parsed.toString()
  };
}
