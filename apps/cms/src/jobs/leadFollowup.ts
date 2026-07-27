import type { TaskConfig } from 'payload'
import { followUpOnSilence } from '../lib/lead/service'

/**
 * Delayed follow-up for a lead that went quiet after leaving the form.
 *
 * Queued by `service.intake()` with `waitUntil = now + LEAD_FOLLOWUP_DELAY_MINUTES`
 * (default 30). The immediate `lead_received` acknowledgement already went out;
 * this job is the *second* touch — the one that actually moves the conversation
 * forward — and it deliberately does not fire instantly, so that a real
 * consultant has a window to step in first and the follow-up does not read as a
 * bot answering itself a second later.
 *
 * All the interesting logic lives in `followUpOnSilence` (it needs the same
 * store/AI/email helpers as the web-chat and inbound-email paths, and must stay
 * in step with them). This wrapper only adapts it to the jobs queue.
 *
 * Runs when an external cron pings `POST /api/payload-jobs/run` — see the `jobs`
 * block in `payload.config.ts` and `CRON_SECRET`.
 */
export const leadFollowup: TaskConfig<'leadFollowup'> = {
  slug: 'leadFollowup',
  retries: 2,
  inputSchema: [
    { name: 'conversationId', type: 'text', required: true },
    // Customer turns at queue time. If the count has grown the visitor already
    // came back on their own, so the nudge is dropped as redundant.
    { name: 'expectedTurnCount', type: 'number' },
  ],
  handler: async ({ input, req }) => {
    const { conversationId, expectedTurnCount } = input as {
      conversationId: string
      expectedTurnCount?: number
    }

    const result = await followUpOnSilence({
      conversationId: String(conversationId),
      expectedTurnCount: typeof expectedTurnCount === 'number' ? expectedTurnCount : undefined,
    })

    if (result.action === 'error') {
      // Surface it so the queue retries; the reason is already logged upstream.
      throw new Error(`leadFollowup failed for ${conversationId}: ${result.reason ?? 'unknown'}`)
    }

    req.payload.logger.info({ conversationId, ...result }, 'leadFollowup')
    return { output: { ...result } }
  },
}
