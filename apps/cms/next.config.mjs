import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@x/shared-types'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
