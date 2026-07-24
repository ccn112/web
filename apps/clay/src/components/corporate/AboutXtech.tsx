"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives";
import { Reveal } from "@/components/reveal";
import { SplitText } from "@/components/reactbits/SplitText";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { IconNode } from "./about-kit";
import { PRODUCTS, PLATFORM } from "./about-content";
import {
  WhoWeAre,
  ProductEcosystem,
  Transformation,
  EnterprisePlatform,
  BusinessValue,
  DeliveryModel,
  FutureVision,
} from "./about-sections";

/**
 * About XTECH (/ve-x) — corporate page rebuilt to the SET C01 visual language:
 * ambient light backdrop (radial wash + faint tech grid + city silhouette), glass
 * cards, cyan connectors + node glow, central hubs, scroll-driven journeys.
 * All copy is HTML; illustrations are composed natively (no baked-in text/logo).
 */
export function AboutXtech({ heroBackground }: { heroBackground?: string } = {}) {
  return (
    <>
      {/* 1. Hero (dark, on-theme for header contrast) */}
      <section className="theme-dark relative isolate overflow-hidden bg-[oklch(0.15_0.02_265)] text-white">
        {heroBackground ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <Image
              src={heroBackground}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover motion-safe:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,13,34,0.35),rgba(3,13,34,0.62))]" />
            <div className="absolute inset-0 bg-grid opacity-[0.06] mask-fade-b" />
          </div>
        ) : (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -left-40 -top-40 size-[36rem] rounded-full bg-blue opacity-25 blur-[120px] animate-aurora" />
              <div className="absolute -right-40 top-10 size-[34rem] rounded-full bg-cyan opacity-20 blur-[120px] animate-aurora [animation-delay:3s]" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.12] mask-fade-b" />
          </>
        )}
        <Container className="relative pt-36 pb-20 md:pt-44 md:pb-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
                <span className="size-1.5 rounded-full bg-cyan" />
                <ShinyText text="XTECH" />
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-[4rem]">
                <SplitText text="Nền tảng công nghệ cho doanh nghiệp số" />
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Kết nối dữ liệu — Tự động hóa vận hành — Kích hoạt trí tuệ nhân tạo trên một hệ sinh thái thống nhất.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <Link href="/san-pham" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  Khám phá hệ sinh thái
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link href="/lien-he" className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition hover:bg-accent">
                  Trao đổi với chuyên gia
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={320}>
            <div className="mx-auto mt-14 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {PRODUCTS.map((p) => (
                <div key={p.name} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
                  <IconNode icon={p.icon} size="sm" />
                  <p className="mt-1 text-sm font-semibold">{p.name}</p>
                  <p className="text-xs leading-snug text-muted-foreground">{p.tagline}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2.5">
              {PLATFORM.map((c) => (
                <a
                  key={c.label}
                  href={`/insights/tag/${encodeURIComponent(c.label)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur transition-colors hover:border-cyan/60 hover:text-white"
                >
                  <c.icon className="size-4 text-cyan" />
                  {c.label}
                </a>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <WhoWeAre />
      <ProductEcosystem />
      <Transformation />
      <EnterprisePlatform />
      <BusinessValue />
      <DeliveryModel />
      <FutureVision />
    </>
  );
}
