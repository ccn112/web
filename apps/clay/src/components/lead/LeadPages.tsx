"use client";

/**
 * Lead conversion pages (/lien-he, /dat-lich-demo, /yeu-cau-tu-van).
 * Bespoke two-column layout: dark hero + a trust aside and a typed VN form.
 * Submissions post to /api/lead with the page's `formCode`.
 */

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { Container } from "@/components/primitives";
import { Reveal, AmbientSection } from "@/components/corporate/about-kit";
import { KeywordLine } from "@/components/home/kit";
import { cn } from "@/lib/utils";
import { leadPageForRoute, type LeadField, type LeadPage } from "@/data/lead-content";

const ASIDE_ICONS = [Clock, ShieldCheck, Sparkles];

function LeadForm({ page, siteCode }: { page: LeadPage; siteCode?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [multi, setMulti] = useState<Record<string, string[]>>({});

  function toggleMulti(field: string, opt: string) {
    setMulti((prev) => {
      const cur = prev[field] ?? [];
      return { ...prev, [field]: cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt] };
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = {};
    for (const f of page.fields) {
      if (f.type === "checkbox") continue;
      if (f.type === "multiselect") payload[f.name] = (multi[f.name] ?? []).join(", ");
      else payload[f.name] = (data.get(f.name) as string) ?? "";
    }
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          formCode: page.formCode,
          siteCode,
          payload,
          consent: data.get("consent") === "on",
        }),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) {
        form.reset();
        setMulti({});
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-3xl border border-gold/30 bg-card p-8 text-center shadow-[0_30px_80px_-50px_var(--accent-blue)]">
        <span className="icon-gold mx-auto flex size-12 items-center justify-center rounded-full">
          <Check className="size-6" />
        </span>
        <p className="mt-4 text-lg font-semibold text-blue">Cảm ơn bạn!</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Chúng tôi đã nhận thông tin và sẽ liên hệ trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-x-4 gap-y-4 rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-55px_var(--accent-blue)] sm:grid-cols-2 md:p-8"
    >
      {page.fields.map((f) => (
        <Field key={f.name} f={f} selected={multi[f.name] ?? []} onToggle={toggleMulti} />
      ))}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-gold group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_14px_34px_-14px_var(--accent-gold)] transition hover:brightness-105 disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Đang gửi…" : page.submitLabel}
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </button>
        {status === "error" ? (
          <p className="mt-3 text-sm text-destructive">Có lỗi xảy ra. Vui lòng thử lại.</p>
        ) : null}
      </div>
    </form>
  );
}

const inputCls =
  "rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25";

function Field({
  f,
  selected,
  onToggle,
}: {
  f: LeadField;
  selected: string[];
  onToggle: (field: string, opt: string) => void;
}) {
  const spanCls = f.span === 2 ? "sm:col-span-2" : "";

  if (f.type === "checkbox") {
    return (
      <label className={cn("flex items-start gap-3 text-sm text-muted-foreground", spanCls)}>
        <input
          type="checkbox"
          name={f.name}
          required={f.required}
          className="mt-0.5 size-4 shrink-0 rounded border-input accent-[var(--accent-gold)]"
        />
        <span>
          {f.label}
          {f.required ? <span className="text-destructive"> *</span> : null}
        </span>
      </label>
    );
  }

  if (f.type === "multiselect") {
    return (
      <div className={cn("flex flex-col gap-2", spanCls)}>
        <span className="text-sm font-medium">
          {f.label}
          {f.required ? <span className="text-destructive"> *</span> : null}
        </span>
        <div className="flex flex-wrap gap-2">
          {(f.options ?? []).map((opt) => {
            const on = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onToggle(f.name, opt)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                  on
                    ? "border-gold/60 bg-gold/15 text-blue"
                    : "border-blue/15 bg-background text-muted-foreground hover:border-gold/40",
                )}
              >
                {on ? "✓ " : ""}
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <label className={cn("flex flex-col gap-1.5 text-sm font-medium", spanCls)}>
      <span>
        {f.label}
        {f.required ? <span className="text-destructive"> *</span> : null}
      </span>
      {f.type === "textarea" ? (
        <textarea name={f.name} rows={4} required={f.required} placeholder={f.placeholder} className={cn(inputCls, "font-normal")} />
      ) : f.type === "select" ? (
        <select name={f.name} required={f.required} defaultValue="" className={cn(inputCls, "font-normal")}>
          <option value="" disabled>
            Chọn…
          </option>
          {(f.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input type={f.type} name={f.name} required={f.required} placeholder={f.placeholder} className={cn(inputCls, "font-normal")} />
      )}
    </label>
  );
}

export function LeadPages({ route, siteCode }: { route: string; siteCode?: string }) {
  const page = leadPageForRoute(route);
  if (!page) return null;

  return (
    <>
      {/* Hero (dark, on-theme for header contrast) */}
      <section className="theme-dark relative isolate overflow-hidden bg-background text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-blue opacity-25 blur-[120px] animate-aurora" />
          <div className="absolute -right-32 top-0 size-[30rem] rounded-full bg-cyan opacity-20 blur-[120px] animate-aurora [animation-delay:3s]" />
          <div className="absolute inset-0 bg-grid opacity-[0.08] mask-fade-b" />
        </div>
        <Container className="relative pt-32 pb-14 md:pt-40 md:pb-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85 backdrop-blur">
              <span className="size-1.5 rounded-full bg-gold" />
              {page.hero.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              {page.hero.lines.map((line, i) => (
                <span key={i} className="block">
                  <KeywordLine text={line} highlight={page.hero.highlight} />
                </span>
              ))}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">{page.hero.subtitle}</p>
          </Reveal>
        </Container>
      </section>

      {/* Form + trust aside */}
      <AmbientSection id={page.slug} city={false} compact>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="lg:pt-2">
            <h2 className="text-xl font-semibold tracking-tight text-blue">{page.aside.title}</h2>
            <div className="mt-6 flex flex-col gap-5">
              {page.aside.points.map((pt, i) => {
                const Ico = ASIDE_ICONS[i % ASIDE_ICONS.length]!;
                return (
                  <div key={pt.title} className="flex gap-3.5">
                    <span className="icon-gold flex size-10 shrink-0 items-center justify-center rounded-xl">
                      <Ico className="size-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{pt.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{pt.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <LeadForm page={page} siteCode={siteCode} />
          </Reveal>
        </div>
      </AmbientSection>
    </>
  );
}
