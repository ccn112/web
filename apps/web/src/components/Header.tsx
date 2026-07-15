'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { ChevronDown, Menu, X } from 'lucide-react'
import type { MenuItem } from '@x/shared-types'
import { Logo } from './Logo'

export interface HeaderProps {
  mode: 'dark' | 'light'
  items: MenuItem[]
  ctaLabel: string
  ctaHref: string
}

export function Header({ mode, items, ctaLabel, ctaHref }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-border-subtle bg-background/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Trang chủ" className="shrink-0">
          <Logo mode={mode} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {item.label}
                {item.children?.length ? <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" /> : null}
              </Link>
              {item.children?.length ? (
                <div className="invisible absolute left-0 top-full min-w-56 rounded-panel border border-border-subtle bg-surface p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={ctaHref}
            className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:inline-flex"
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Mở menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-surface p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo mode={mode} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Đóng menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {items.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 font-medium hover:bg-surface-2"
                  >
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <div className="ml-3 border-l border-border-subtle pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              <Link
                href={ctaHref}
                onClick={() => setMobileOpen(false)}
                className="mt-4 rounded-xl bg-primary px-4 py-3 text-center font-semibold text-white"
              >
                {ctaLabel}
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  )
}
