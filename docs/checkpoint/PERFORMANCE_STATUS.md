# PERFORMANCE STATUS — Corporate (Checkpoint V2)

_Audit date: 2026-07-17. App: `apps/clay` (Next.js 16, Turbopack)._

## Present ✅
- Fonts optimized via `next/font` (self-hosted, swap).
- Hero backgrounds now **webp** (70–128 KB each) — big win vs the old 1.2 MB PNGs.
- All hero/section motion is `prefers-reduced-motion` safe.
- CMS client uses `next: { revalidate: 60 }` (data cache).

## Red flags 🔴
| Issue | Where | Impact |
|---|---|---|
| `export const dynamic = "force-dynamic"` | `[[...slug]]/page.tsx:12` | Every route SSR'd per request; no ISR/CDN HTML cache; neutralizes the `revalidate:60`. Highest TTFB/scalability cost |
| No `next/image` anywhere | all images raw `<img>` | No AVIF/webp negotiation, no responsive srcset, no built-in lazy pipeline |
| Hero `<img>` = LCP, unoptimized | `HeroBackdrop.tsx` | No `priority`/preload, no `sizes`/dimensions on the largest above-the-fold asset |
| Illustration `<img>` no dimensions | `BlockRenderer.tsx` `IllustrationImage` | CLS risk; has `loading="lazy"` but no width/height/sizes |
| No `images` config | `next.config.ts` | No `remotePatterns`/`formats`; CMS media served at origin resolution |
| Illustration PNGs served raw | CMS media | ~1 MB isometric PNGs, no resize/webp |

## Top perf fixes before go-live
1. **Drop `force-dynamic`** → use ISR (`revalidate`) or route segment caching so HTML is CDN-cacheable. Biggest win.
2. Adopt `next/image` (or a lightweight wrapper) for hero + illustrations; add `next.config` `images.remotePatterns` (CMS host) + `formats: [avif, webp]`; mark hero `priority`, add `sizes`.
3. Add Payload `Media` `imageSizes` + webp `formatOptions`; reprocess existing illustration PNGs to webp.
4. Add width/height (or aspect-ratio) to all images to kill CLS.
5. Remove orphaned old hero PNGs from repo/seed.

## Not yet measured
No Lighthouse/CWV run yet. Recommend a Lighthouse pass on `/`, `/dich-vu/chuyen-doi-so` (heavy), `/ve-x` (heavy motion) after fixes #1–#4.

_Effort: ~1–2 days (force-dynamic + next/image are the bulk)._
