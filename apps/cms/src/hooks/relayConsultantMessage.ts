import type { CollectionAfterChangeHook } from 'payload'
import type { Lead, LeadConversation } from '../payload-types'
import { sendLeadEmail } from '../lib/lead/email/send'
import { noteChannel, refId, updateConversation } from '../lib/lead/store'
import { isHumanOwned, type LeadState } from '../lib/lead/state-machine'

/**
 * Closes the loop for "nhân viên vào tư vấn và chat với khách": when staff post a
 * message on the `consultant` channel (from admin, or via the API), the customer
 * receives it by email AND sees it in the web chat — the same message, both
 * channels, one thread.
 *
 * Side effects, all idempotent:
 *  - the AI is paused for this conversation (a human is now driving);
 *  - the status moves NEED_MORE_INFORMATION/HUMAN_READY → CONTACTED;
 *  - `humanTakeoverAt` is stamped the first time.
 *
 * Delivery failures are logged, never thrown: the message is already stored, and
 * failing the admin save would lose the consultant's text.
 */
export const relayConsultantMessage: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc
  if (doc.channel !== 'consultant' || doc.direction !== 'outbound') return doc
  // `meta.relayed` marks a message that was created BY the relay path itself.
  if (doc.meta && typeof doc.meta === 'object' && (doc.meta as { relayed?: boolean }).relayed) {
    return doc
  }

  const payload = req.payload
  try {
    const conversationId = refId(doc.conversation)
    const conversation = (await payload.findByID({
      collection: 'lead-conversations',
      id: conversationId,
      depth: 0,
      req,
    })) as LeadConversation
    const lead = (await payload.findByID({
      collection: 'leads',
      id: refId(conversation.lead),
      depth: 0,
      req,
    })) as Lead

    // Human takeover: stop the AI and advance the pipeline.
    const status = (conversation.status ?? 'NEW') as LeadState
    await updateConversation(payload, conversation.id, {
      aiPaused: true,
      ...(conversation.humanTakeoverAt ? {} : { humanTakeoverAt: new Date().toISOString() }),
      ...(isHumanOwned(status) || status === 'HUMAN_READY' ? { status: 'CONTACTED' } : {}),
    })
    await payload
      .update({ collection: 'leads', id: lead.id, data: { status: 'CONTACTED' }, depth: 0, req })
      .catch(() => null)
    await noteChannel(payload, conversation, 'consultant')

    // Resolve the consultant's display name for the email signature.
    let consultantName: string | undefined
    const assignment = await payload
      .find({
        collection: 'consultant-assignments',
        where: { conversation: { equals: conversation.id } },
        limit: 1,
        depth: 1,
        req,
      })
      .catch(() => null)
    const assigned = assignment?.docs?.[0]?.consultant
    if (assigned && typeof assigned === 'object') consultantName = assigned.name

    const fresh = (await payload.findByID({
      collection: 'lead-conversations',
      id: conversation.id,
      depth: 0,
      req,
    })) as LeadConversation

    await sendLeadEmail(payload, {
      templateKey: 'consultant_message',
      lead,
      conversation: fresh,
      aiReply: String(doc.contentText ?? ''),
      consultantName: consultantName ?? 'Chuyên gia XTECH',
      // The text already lives on the `consultant` channel row that triggered us.
      skipTranscript: true,
    })
  } catch (err) {
    payload.logger.error({ err }, 'relayConsultantMessage: could not deliver consultant message')
  }

  return doc
}
