import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

/**
 * Cached Payload Local API client for server-side code outside the admin/REST
 * layer (custom API routes, jobs). Importing `@payload-config` also runs the
 * root-`.env` loader in payload.config, so provider keys (ANTHROPIC_API_KEY, …)
 * are present in process.env before any LLM client is constructed.
 */
let cached: Promise<Payload> | null = null

export function getPayloadClient(): Promise<Payload> {
  return (cached ??= getPayload({ config }))
}
