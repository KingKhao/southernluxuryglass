/** @type {import('next').NextConfig} */

// Deliberately permissive on 'unsafe-inline' for script/style: Next.js App
// Router injects its own inline hydration/bootstrap scripts and Tailwind/
// Next inject some inline styles, and this app has no nonce plumbing set up
// to allow those safely without it. The real value here is blocking every
// THIRD-PARTY script/style/frame/connection outright — this site loads none
// today, so a compromised or injected external resource has nowhere to go.
// Revisit with a nonce-based policy if that changes.
const csp = [
  "default-src 'self'",
  "img-src 'self' data: https://*.public.blob.vercel-storage.com",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://*.blob.vercel-storage.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
