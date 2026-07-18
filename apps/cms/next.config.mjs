import { fileURLToPath } from 'node:url'

import { withPayload } from '@payloadcms/next/withPayload'

// Monorepo root — lets Next trace workspace deps into the standalone output.
const repoRoot = fileURLToPath(new URL('../../', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Self-contained server bundle for Docker/PaaS (small runtime image).
  output: 'standalone',
  outputFileTracingRoot: repoRoot,
  transpilePackages: ['@x/shared-types'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
