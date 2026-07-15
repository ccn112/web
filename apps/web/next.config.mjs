/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@x/shared-types',
    '@x/cms-client',
    '@x/ui',
    '@x/content-blocks',
    '@x/seo',
  ],
}

export default nextConfig
