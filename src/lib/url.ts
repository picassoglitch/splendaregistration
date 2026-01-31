export function getAppBaseUrl() {
  // Prefer an explicit env var for stability.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // Vercel provides this at runtime (no protocol).
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  // Local dev fallback.
  return "http://localhost:3000";
}

