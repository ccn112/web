import Link from 'next/link'
import type { MenuItem } from '@x/shared-types'
import { Logo } from './Logo'

export function Footer({
  mode,
  siteName,
  tagline,
  items,
}: {
  mode: 'dark' | 'light'
  siteName: string
  tagline?: string
  items: MenuItem[]
}) {
  const year = 2026
  return (
    <footer className="border-t border-border-subtle bg-surface">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo mode={mode} />
          {tagline ? <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{tagline}</p> : null}
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
          {items.slice(0, 6).map((item) => (
            <div key={item.href}>
              <Link href={item.href} className="text-sm font-semibold hover:text-primary">
                {item.label}
              </Link>
              {item.children?.length ? (
                <ul className="mt-3 space-y-2">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} className="text-sm text-muted hover:text-foreground">
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border-subtle">
        <div className="mx-auto max-w-[1200px] px-5 py-6 text-sm text-muted sm:px-6 lg:px-8">
          © {year} {siteName}. Hệ sinh thái chuyển đổi số và AI cho bất động sản.
        </div>
      </div>
    </footer>
  )
}
