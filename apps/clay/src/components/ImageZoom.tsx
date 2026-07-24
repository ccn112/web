"use client";

/**
 * ImageZoom — wrap any image so clicking it opens a full-screen viewer.
 * Default behavior for content/article images. Reduced-motion safe, Esc/backdrop
 * to close, no deps.
 */

import Image from "next/image";
import { useState, useEffect, type ReactNode } from "react";
import { X, Maximize2 } from "lucide-react";

export function ImageZoom({
  src,
  alt = "",
  width = 1200,
  height = 800,
  caption,
  className,
  children,
}: {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Xem ảnh lớn: ${alt}`}
        className={`group relative block w-full cursor-zoom-in overflow-hidden ${className ?? ""}`}
      >
        {children ?? (
          <Image src={src} alt={alt} width={width} height={height} sizes="(min-width:1024px) 720px, 100vw" className="h-auto w-full object-cover" />
        )}
        <span aria-hidden className="absolute bottom-2.5 right-2.5 inline-flex size-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          <Maximize2 className="size-4" />
        </span>
      </button>

      {open ? (
        <div role="dialog" aria-modal="true" aria-label={alt} className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="flex justify-end px-4 py-3">
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng" className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
              <X className="size-5" />
            </button>
          </div>
          <figure className="flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-6" onClick={(e) => e.stopPropagation()}>
            <Image src={src} alt={alt} width={1600} height={1200} sizes="92vw" className="max-h-[82vh] w-auto rounded-xl object-contain shadow-2xl" />
            {caption ? <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/70">{caption}</figcaption> : null}
          </figure>
        </div>
      ) : null}
    </>
  );
}
