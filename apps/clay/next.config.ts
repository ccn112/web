import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

/**
 * Allow next/image to optimize media served by the CMS (Payload uploads).
 * The CMS origin is env-driven for production; localhost:3000 is always allowed
 * for local dev. Payload returns absolute media URLs (its own serverURL).
 */
const remotePatterns: RemotePattern[] = [
  { protocol: "http", hostname: "localhost", port: "3000", pathname: "/**" },
];

const envCmsUrl = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL;
if (envCmsUrl) {
  try {
    const u = new URL(envCmsUrl);
    const proto = u.protocol.replace(":", "");
    const already = remotePatterns.some(
      (p) => p.hostname === u.hostname && (p.port ?? "") === (u.port ?? ""),
    );
    if ((proto === "http" || proto === "https") && !already) {
      remotePatterns.push({
        protocol: proto,
        hostname: u.hostname,
        port: u.port || "",
        pathname: "/**",
      });
    }
  } catch {
    // ignore malformed CMS_URL
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Workspace packages are source-only; transpile them in the app build.
  transpilePackages: ["@x/shared-types", "@x/cms-client"],
  images: {
    // Serve modern formats; next/image negotiates avif→webp→original.
    formats: ["image/avif", "image/webp"],
    remotePatterns,
    // The CMS serves media from localhost (dev) or an internal host, which
    // resolve to private/loopback IPs. Next blocks optimizing those by default
    // (SSRF guard). Allow it in dev, or opt in via ALLOW_LOCAL_IMAGE_IP for a
    // self-hosted CMS on a private network. A public prod CMS domain never needs it.
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV !== "production" ||
      process.env.ALLOW_LOCAL_IMAGE_IP === "true",
  },
};

export default nextConfig;
