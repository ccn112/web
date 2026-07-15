import { z } from 'zod'

export const chatRequestSchema = z.object({
  siteCode: z.string().min(1).max(40),
  pageId: z.string().uuid(),
  sectionId: z.string().max(120).optional(),
  message: z.string().min(1).max(2000),
  conversation: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(4000),
  })).max(8).optional(),
})

export type ChatRequest = z.infer<typeof chatRequestSchema>

export type ChatResponse = {
  answer: string
  suggestions: Array<{
    label: string
    type: 'ask' | 'navigate' | 'page' | 'demo'
    target: string
  }>
}
