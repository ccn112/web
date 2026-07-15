import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Geist_Mono, Inter, Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin', 'vietnamese'], variable: '--font-manrope', display: 'swap' })
const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-inter', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'X Technology',
  description: 'Hệ sinh thái chuyển đổi số và AI cho bất động sản',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${manrope.variable} ${inter.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
