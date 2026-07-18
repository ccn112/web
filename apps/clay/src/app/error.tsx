"use client";

/**
 * Root error boundary (500). Error boundaries MUST be Client Components, so this
 * renders standalone (no CMS/SiteShell — it can't read request headers). It
 * catches render errors below the root layout.
 */

import { useEffect } from "react";
import { RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="theme-dark relative isolate flex min-h-screen items-center overflow-hidden bg-background text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-24 size-[34rem] rounded-full bg-blue opacity-25 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 size-[30rem] rounded-full bg-cyan opacity-20 blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.07] mask-fade-b" />
      </div>
      <div className="relative mx-auto max-w-md px-6 text-center">
        <p className="brand-gradient-text text-6xl font-bold tracking-tight md:text-7xl">500</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">Đã có lỗi xảy ra</h1>
        <p className="mt-3 text-base leading-relaxed text-white/70">
          Hệ thống gặp sự cố ngoài ý muốn. Vui lòng thử lại — nếu vẫn tiếp diễn, hãy liên hệ với chúng tôi.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-white/40">Mã lỗi: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-gold group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:brightness-105"
          >
            <RotateCcw className="size-4" />
            Thử lại
          </button>
          <a
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-gold/50"
          >
            <Home className="size-4" />
            Về trang chủ
          </a>
        </div>
      </div>
    </section>
  );
}
