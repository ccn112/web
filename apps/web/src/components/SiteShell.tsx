import type { CSSProperties, ReactNode } from 'react'
import type { MenuItem, SiteConfig } from '@x/shared-types'
import { Header } from './Header'
import { Footer } from './Footer'

export function SiteShell({
  site,
  mode,
  menu,
  children,
}: {
  site: SiteConfig
  mode: 'dark' | 'light'
  menu: MenuItem[]
  children: ReactNode
}) {
  // Per-site accent injected from the CMS theme, layered on the dark/light base tokens.
  const style = {
    ...(site.theme?.primary ? { '--primary': site.theme.primary } : {}),
    ...(site.theme?.accent ? { '--accent': site.theme.accent } : {}),
  } as CSSProperties

  return (
    <div className={`theme-${mode} min-h-screen bg-background text-foreground`} style={style}>
      <Header mode={mode} items={menu} ctaLabel="Đặt lịch Demo" ctaHref="/demo" />
      <main>{children}</main>
      <Footer mode={mode} siteName={site.name} tagline={site.tagline} items={menu} />
    </div>
  )
}
