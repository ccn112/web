import Image from 'next/image'

/**
 * Brand logo. ONLY the original assets in /brand are allowed (XTECH_UI_STYLE_HANDOFF §2):
 * white on dark surfaces, color on light surfaces. Never recolored or regenerated.
 */
export function Logo({ mode, className }: { mode: 'dark' | 'light'; className?: string }) {
  const src = mode === 'dark' ? '/brand/xtech-logo-white-original.png' : '/brand/xtech-logo-color-original.png'
  return (
    <Image
      src={src}
      alt="XTECH"
      width={2048}
      height={675}
      priority
      className={className ?? 'h-7 w-auto'}
    />
  )
}
