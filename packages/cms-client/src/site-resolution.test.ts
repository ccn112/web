import { describe, expect, it } from 'vitest'
import { contentCacheKey, DEFAULT_SITE_CODE, resolveSiteCode } from './site-resolution'

const sites = [
  { code: 'corporate', primaryDomain: 'x.vn' },
  { code: 'xbooking', primaryDomain: 'xbooking.vn' },
  { code: 'finerp', primaryDomain: 'finerp.vn' },
]

describe('resolveSiteCode', () => {
  it('maps a known host to its site code', () => {
    expect(resolveSiteCode('xbooking.vn', null, sites, false)).toBe('xbooking')
  })

  it('ignores port and casing in the host', () => {
    expect(resolveSiteCode('XBooking.VN:443', null, sites, false)).toBe('xbooking')
  })

  it('falls back to corporate for unknown hosts', () => {
    expect(resolveSiteCode('unknown.example', null, sites, false)).toBe(DEFAULT_SITE_CODE)
  })

  it('honors ?site= only in development', () => {
    expect(resolveSiteCode('x.vn', 'finerp', sites, true)).toBe('finerp')
    expect(resolveSiteCode('x.vn', 'finerp', sites, false)).toBe('corporate')
  })

  it('ignores ?site= for an unknown code', () => {
    expect(resolveSiteCode('x.vn', 'nope', sites, true)).toBe('corporate')
  })
})

describe('contentCacheKey', () => {
  it('includes site, locale and pathname', () => {
    expect(contentCacheKey('xai', 'vi', '/giai-phap/document-ai')).toBe(
      'xai:vi:/giai-phap/document-ai',
    )
  })
})
