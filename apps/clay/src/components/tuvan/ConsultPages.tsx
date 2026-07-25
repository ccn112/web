"use client";

/**
 * `/tu-van` surface — the web-chat half of the two-channel consultation.
 *
 *   /tu-van                  intake form, or the live thread if this device has one
 *   /tu-van/tiep-tuc?t=…     open an email resume link (OTP if the device is new)
 *   /tu-van/lich-su          read-only transcript + export / erase
 *   /tu-van/huy-nhan-email   one-click unsubscribe confirmation
 *
 * All server calls go through clay's `/api/lead/*` proxies; the CMS owns the
 * transcript, the provider keys and every authorisation decision.
 */

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, Download, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/primitives";
import { Reveal, AmbientSection } from "@/components/corporate/about-kit";
import { KeywordLine } from "@/components/home/kit";
import { cn } from "@/lib/utils";
import { getDeviceId } from "@/lib/device";
import {
  CONSULT_FIELDS,
  CONSULT_HERO,
  CONSULT_POINTS,
  type ConsultMode,
} from "@/data/consult-content";
import { ConsultThread, type SessionView } from "./ConsultThread";

const inputCls =
  "rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25";

const ASIDE_ICONS = [Clock, ShieldCheck, Sparkles];

/* ------------------------------------------------------------------ shells */

function Hero({ mode }: { mode: ConsultMode }) {
  const hero = CONSULT_HERO[mode];
  return (
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
            {hero.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            {hero.lines.map((line, i) => (
              <span key={i} className="block">
                <KeywordLine text={line} highlight={hero.highlight} />
              </span>
            ))}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">{hero.subtitle}</p>
        </Reveal>
      </Container>
    </section>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-55px_var(--accent-blue)] md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Loading({ label }: { label: string }) {
  return (
    <Panel>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Panel>
  );
}

/* -------------------------------------------------------------- intake form */

function IntakeForm({
  siteCode,
  onStarted,
}: {
  siteCode?: string;
  onStarted: (session: SessionView | null) => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const data = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    for (const f of CONSULT_FIELDS) payload[f.name] = String(data.get(f.name) ?? "");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          formCode: "consultation",
          siteCode,
          deviceId: getDeviceId(),
          payload,
          consent: data.get("consent") === "on",
        }),
      });
      if (!res.ok) {
        setStatus("error");
        setError("Không gửi được yêu cầu. Vui lòng thử lại.");
        return;
      }
      setStatus("ok");
      // The thread now exists for this device — load it so the visitor can
      // continue right away instead of waiting for the email.
      const sess = await fetch(`/api/lead/session?deviceId=${encodeURIComponent(getDeviceId())}`)
        .then((r) => r.json() as Promise<{ session: SessionView | null }>)
        .catch(() => ({ session: null }));
      onStarted(sess.session);
    } catch {
      setStatus("error");
      setError("Không kết nối được. Vui lòng thử lại.");
    }
  }

  if (status === "ok") {
    return (
      <Panel className="text-center">
        <span className="icon-gold mx-auto flex size-12 items-center justify-center rounded-full">
          <Check className="size-6" />
        </span>
        <p className="mt-4 text-lg font-semibold text-blue">Đã ghi nhận yêu cầu của bạn</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Chúng tôi vừa gửi email xác nhận kèm liên kết mở lại hội thoại. Bạn có thể trao đổi tiếp
          ngay tại đây hoặc trả lời email — cả hai đều cùng một mạch tư vấn.
        </p>
      </Panel>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {CONSULT_FIELDS.map((f) => (
        <label
          key={f.name}
          className={cn("flex flex-col gap-1.5 text-sm font-medium", f.span === 2 && "sm:col-span-2")}
        >
          <span>
            {f.label}
            {f.required ? <span className="text-destructive"> *</span> : null}
          </span>
          {f.type === "textarea" ? (
            <textarea
              name={f.name}
              rows={4}
              required={f.required}
              placeholder={f.placeholder}
              className={cn(inputCls, "font-normal")}
            />
          ) : (
            <input
              type={f.type}
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              className={cn(inputCls, "font-normal")}
            />
          )}
        </label>
      ))}

      <label className="flex items-start gap-3 text-sm text-muted-foreground sm:col-span-2">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 rounded border-input accent-[var(--accent-gold)]"
        />
        <span>
          Tôi đồng ý để XTECH liên hệ tư vấn qua email và điện thoại, và đồng ý lưu lại hội thoại tư
          vấn của mình. <span className="text-destructive">*</span>
        </span>
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-gold group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_14px_34px_-14px_var(--accent-gold)] transition hover:brightness-105 disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Đang gửi…" : "Bắt đầu tư vấn"}
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </button>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </div>
    </form>
  );
}

/* -------------------------------------------------------- OTP verification */

function VerifyForm({
  token,
  maskedEmail,
  onVerified,
}: {
  token: string;
  maskedEmail: string;
  onVerified: (session: SessionView) => void;
}) {
  const [phase, setPhase] = useState<"idle" | "sending" | "sent" | "checking">("idle");
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async () => {
    setPhase("sending");
    setError(null);
    const res = await fetch("/api/lead/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, deviceId: getDeviceId(), action: "request" }),
    });
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setPhase("idle");
      setError(j.error ?? "Không gửi được mã xác minh.");
      return;
    }
    setPhase("sent");
  }, [token]);

  async function confirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code") ?? "").trim();
    setPhase("checking");
    setError(null);
    const res = await fetch("/api/lead/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, deviceId: getDeviceId(), action: "confirm", code }),
    });
    const j = (await res.json().catch(() => ({}))) as { error?: string; session?: SessionView };
    if (!res.ok || !j.session) {
      setPhase("sent");
      setError(j.error ?? "Mã xác minh không đúng.");
      return;
    }
    onVerified(j.session);
  }

  return (
    <Panel>
      <span className="icon-gold flex size-12 items-center justify-center rounded-full">
        <MailCheck className="size-6" />
      </span>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-blue">
        Xác minh email để mở hội thoại
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Bạn đang mở liên kết trên một thiết bị mới. Để bảo vệ nội dung đã trao đổi, chúng tôi cần
        gửi một mã xác minh tới <span className="font-semibold text-blue">{maskedEmail}</span>.
      </p>

      {phase === "idle" || phase === "sending" ? (
        <button
          type="button"
          onClick={() => void request()}
          disabled={phase === "sending"}
          className="btn-gold mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold disabled:opacity-60"
        >
          {phase === "sending" ? "Đang gửi mã…" : "Gửi mã xác minh"}
        </button>
      ) : (
        <form onSubmit={confirm} className="mt-5 flex flex-col gap-3 sm:max-w-xs">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            <span>Mã xác minh (6 số)</span>
            <input
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              placeholder="000000"
              className={cn(inputCls, "font-mono text-lg tracking-[0.35em]")}
            />
          </label>
          <button
            type="submit"
            disabled={phase === "checking"}
            className="btn-gold h-11 rounded-full text-sm font-semibold disabled:opacity-60"
          >
            {phase === "checking" ? "Đang kiểm tra…" : "Xác minh & mở hội thoại"}
          </button>
          <button
            type="button"
            onClick={() => void request()}
            className="text-left text-xs font-semibold text-blue underline underline-offset-2"
          >
            Gửi lại mã
          </button>
        </form>
      )}

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </Panel>
  );
}

/* ---------------------------------------------------------------- history */

function HistoryActions({ session }: { session: SessionView }) {
  function download() {
    const lines = session.messages.map(
      (m) =>
        `[${m.at}] (${m.channel}) ${m.role === "user" ? "Bạn" : m.role === "consultant" ? "Chuyên gia XTECH" : "Trợ lý XTECH"}: ${m.content}`,
    );
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xtech-tu-van-${session.conversationPublicId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={download}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-blue/20 px-4 text-sm font-semibold text-blue transition hover:border-gold/50"
      >
        <Download className="size-4" />
        Tải lịch sử (.txt)
      </button>
      <Link
        href="/lien-he"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-blue/20 px-4 text-sm font-semibold text-blue transition hover:border-gold/50"
      >
        Yêu cầu xóa lịch sử
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------- pages */

type ResumeState =
  | { kind: "loading" }
  | { kind: "session"; session: SessionView }
  | { kind: "verify"; maskedEmail: string }
  | { kind: "error"; message: string };

export function ConsultPages({ mode, siteCode }: { mode: ConsultMode; siteCode?: string }) {
  const [state, setState] = useState<ResumeState>({ kind: "loading" });

  // /tu-van and /tu-van/lich-su: try the device's own session.
  useEffect(() => {
    if (mode !== "start" && mode !== "history") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lead/session?deviceId=${encodeURIComponent(getDeviceId())}`);
        const j = (await res.json()) as { session: SessionView | null };
        if (cancelled) return;
        setState(
          j.session
            ? { kind: "session", session: j.session }
            : { kind: "error", message: "no-session" },
        );
      } catch {
        if (!cancelled) setState({ kind: "error", message: "no-session" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  // /tu-van/tiep-tuc: exchange the signed token for the thread (or an OTP challenge).
  useEffect(() => {
    if (mode !== "resume") return;
    let cancelled = false;
    (async () => {
      const token = new URLSearchParams(window.location.search).get("t") ?? "";
      if (!token) {
        setState({ kind: "error", message: "Liên kết không hợp lệ hoặc thiếu mã." });
        return;
      }
      try {
        const res = await fetch("/api/lead/resume", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, deviceId: getDeviceId() }),
        });
        const j = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          session?: SessionView;
          needsVerification?: boolean;
          maskedEmail?: string;
          error?: string;
        };
        if (cancelled) return;
        if (j.needsVerification) {
          setState({ kind: "verify", maskedEmail: j.maskedEmail ?? "email của bạn" });
        } else if (j.ok && j.session) {
          setState({ kind: "session", session: j.session });
        } else {
          setState({ kind: "error", message: j.error ?? "Không mở được hội thoại." });
        }
      } catch {
        if (!cancelled) setState({ kind: "error", message: "Không kết nối được. Vui lòng thử lại." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  // /tu-van/huy-nhan-email
  const [unsub, setUnsub] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => {
    if (mode !== "unsubscribe") return;
    let cancelled = false;
    (async () => {
      const token = new URLSearchParams(window.location.search).get("t") ?? "";
      if (!token) {
        if (!cancelled) setUnsub("error");
        return;
      }
      try {
        const res = await fetch(`/api/lead/unsubscribe?t=${encodeURIComponent(token)}`, {
          method: "POST",
        });
        if (!cancelled) setUnsub(res.ok ? "ok" : "error");
      } catch {
        if (!cancelled) setUnsub("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  return (
    <>
      <Hero mode={mode} />
      <AmbientSection id="tu-van" city={false} compact>
        {mode === "unsubscribe" ? (
          <Panel className="mx-auto max-w-xl text-center">
            {unsub === "loading" ? (
              <p className="text-sm text-muted-foreground">Đang xử lý yêu cầu…</p>
            ) : unsub === "ok" ? (
              <>
                <span className="icon-gold mx-auto flex size-12 items-center justify-center rounded-full">
                  <Check className="size-6" />
                </span>
                <p className="mt-4 text-lg font-semibold text-blue">Đã dừng email tư vấn</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Chúng tôi sẽ không gửi thêm email tư vấn tự động cho hồ sơ này. Nếu cần trao đổi
                  lại, bạn có thể{" "}
                  <Link href="/lien-he" className="font-semibold text-blue underline underline-offset-2">
                    liên hệ đội ngũ XTECH
                  </Link>{" "}
                  bất cứ lúc nào.
                </p>
              </>
            ) : (
              <p className="text-sm text-destructive">
                Liên kết hủy nhận email không hợp lệ hoặc đã hết hiệu lực.
              </p>
            )}
          </Panel>
        ) : mode === "resume" ? (
          state.kind === "loading" ? (
            <Loading label="Đang mở hội thoại của bạn…" />
          ) : state.kind === "verify" ? (
            <div className="mx-auto max-w-xl">
              <VerifyForm
                token={new URLSearchParams(window.location.search).get("t") ?? ""}
                maskedEmail={state.maskedEmail}
                onVerified={(session) => setState({ kind: "session", session })}
              />
            </div>
          ) : state.kind === "session" ? (
            <ConsultThread session={state.session} siteCode={siteCode} />
          ) : (
            <Panel className="mx-auto max-w-xl">
              <p className="text-sm text-destructive">{state.message}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Liên kết mở lại hội thoại có thời hạn. Hãy dùng liên kết trong email XTECH mới nhất,
                hoặc{" "}
                <Link href="/tu-van" className="font-semibold text-blue underline underline-offset-2">
                  bắt đầu một phiên tư vấn mới
                </Link>
                .
              </p>
            </Panel>
          )
        ) : mode === "history" ? (
          state.kind === "loading" ? (
            <Loading label="Đang tải lịch sử…" />
          ) : state.kind === "session" ? (
            <div className="flex flex-col gap-6">
              <HistoryActions session={state.session} />
              <ConsultThread session={state.session} siteCode={siteCode} readOnly />
            </div>
          ) : (
            <Panel className="mx-auto max-w-xl">
              <p className="text-sm text-muted-foreground">
                Không tìm thấy lịch sử tư vấn trên thiết bị này. Nếu bạn đã trao đổi trước đó, hãy mở
                liên kết trong email XTECH để xác minh và hợp nhất lịch sử.
              </p>
            </Panel>
          )
        ) : /* mode === "start" */ state.kind === "session" ? (
          <ConsultThread session={state.session} siteCode={siteCode} />
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal className="lg:pt-2">
              <h2 className="text-xl font-semibold tracking-tight text-blue">
                Cách phiên tư vấn này hoạt động
              </h2>
              <div className="mt-6 flex flex-col gap-5">
                {CONSULT_POINTS.map((pt, i) => {
                  const Ico = ASIDE_ICONS[i % ASIDE_ICONS.length]!;
                  return (
                    <div key={pt.title} className="flex gap-3.5">
                      <span className="icon-gold flex size-10 shrink-0 items-center justify-center rounded-xl">
                        <Ico className="size-5" strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{pt.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {pt.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <Panel>
                {state.kind === "loading" ? (
                  <p className="text-sm text-muted-foreground">Đang kiểm tra phiên tư vấn…</p>
                ) : (
                  <IntakeForm
                    siteCode={siteCode}
                    onStarted={(session) =>
                      session
                        ? setState({ kind: "session", session })
                        : setState({ kind: "error", message: "no-session" })
                    }
                  />
                )}
              </Panel>
            </Reveal>
          </div>
        )}
      </AmbientSection>
    </>
  );
}
