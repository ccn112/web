'use client'

import { useState } from 'react'
import { FIELD_LIBRARY, type LeadFormBlock } from '@x/shared-types'
import { Section, SectionHeading } from './primitives'

export interface LeadFormProps {
  block: LeadFormBlock
  siteCode?: string
  pageId?: string
  successMessage?: string
  /** Endpoint that persists the submission (defaults to the app's /api/lead route). */
  action?: string
}

export function LeadForm({ block, siteCode, pageId, successMessage, action = '/api/lead' }: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const fieldKeys = block.fields?.length ? block.fields : []

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ formCode: block.formCode, siteCode, pageId, payload: data, consent: true }),
      })
      setStatus(res.ok ? 'done' : 'error')
      if (res.ok) form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <Section block={block} containerClassName="max-w-2xl">
      <SectionHeading title={block.title ?? 'Đăng ký'} />
      {status === 'done' ? (
        <div className="rounded-panel border border-success/40 bg-success/10 p-6 text-center">
          {successMessage ?? 'Cảm ơn bạn. Chúng tôi sẽ liên hệ sớm nhất.'}
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="grid gap-4 rounded-panel border border-border-subtle bg-surface p-6 sm:grid-cols-2"
        >
          {fieldKeys.map((key) => {
            const def = FIELD_LIBRARY[key]
            if (!def) return null
            const full = def.type === 'textarea'
            return (
              <label key={key} className={full ? 'sm:col-span-2' : undefined}>
                <span className="mb-1.5 block text-sm font-medium">
                  {def.label}
                  {def.required ? <span className="text-warning"> *</span> : null}
                </span>
                {def.type === 'textarea' ? (
                  <textarea
                    name={key}
                    required={def.required}
                    rows={4}
                    className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                ) : def.type === 'select' ? (
                  <select
                    name={key}
                    required={def.required}
                    defaultValue=""
                    className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="" disabled>
                      — Chọn —
                    </option>
                    {def.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={key}
                    type={def.type}
                    required={def.required}
                    className="w-full rounded-xl border border-border-subtle bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                )}
              </label>
            )
          })}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === 'submitting' ? 'Đang gửi…' : 'Gửi yêu cầu'}
            </button>
            {status === 'error' ? (
              <p className="mt-3 text-sm text-warning">Có lỗi xảy ra. Vui lòng thử lại.</p>
            ) : null}
          </div>
        </form>
      )}
    </Section>
  )
}
