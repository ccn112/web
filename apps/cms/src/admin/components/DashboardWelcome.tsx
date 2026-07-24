import { getPayload, type Where } from 'payload'
import config from '@payload-config'

/**
 * beforeDashboard — panel chào mừng + summary cards + quick links.
 * Đếm số liệu qua Local API (bọc try/catch, lỗi thì hiện "—"). Server component.
 * Style ở brand.css (.x-dash*).
 */
async function safeCount(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'posts' | 'pages' | 'media' | 'users',
  where?: Where,
): Promise<string> {
  try {
    const res = await payload.count({ collection, where, overrideAccess: true })
    return String(res.totalDocs)
  } catch {
    return '—'
  }
}

export async function DashboardWelcome() {
  let published = '—'
  let pages = '—'
  let media = '—'
  let users = '—'

  try {
    const payload = await getPayload({ config })
    ;[published, pages, media, users] = await Promise.all([
      safeCount(payload, 'posts', { status: { equals: 'published' } }),
      safeCount(payload, 'pages'),
      safeCount(payload, 'media'),
      safeCount(payload, 'users'),
    ])
  } catch {
    /* Local API chưa sẵn sàng — giữ giá trị "—" */
  }

  const cards: { label: string; value: string; href: string }[] = [
    { label: 'Bài viết đã xuất bản', value: published, href: '/admin/collections/posts' },
    { label: 'Trang đang quản trị', value: pages, href: '/admin/collections/pages' },
    { label: 'Media assets', value: media, href: '/admin/collections/media' },
    { label: 'Người dùng quản trị', value: users, href: '/admin/collections/users' },
  ]

  return (
    <div className="x-dash">
      <div className="x-dash__welcome">
        <img src="/brand/xtech-favicon-square.png" alt="XTECH" />
        <div>
          <h2>Chào mừng đến XTECH Admin</h2>
          <p>Quản trị nội dung, dữ liệu và hệ sinh thái số trên một giao diện thống nhất.</p>
        </div>
      </div>
      <div className="x-dash__cards">
        {cards.map((c) => (
          <a key={c.href} className="x-dash__card" href={c.href}>
            <div className="x-dash__label">{c.label}</div>
            <div className="x-dash__value">{c.value}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default DashboardWelcome
