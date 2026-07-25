"use client";

/**
 * The unified consultation thread.
 *
 * One transcript, three sources — every bubble carries a badge (Web Chat /
 * Email / Chuyên gia XTECH) so the customer can see how each message arrived.
 * A progress panel shows how complete the brief is and, once the state machine
 * reaches HUMAN_READY, the "Đang chuyển tới chuyên gia XTECH" banner replaces
 * the AI framing.
 *
 * The session is scoped by `deviceId`; the server refuses any device that did
 * not create the conversation and has not verified by email OTP.
 */

import { useEffect, useRef, useState } from "react";
import { Send, ShieldCheck, UserRound, Sparkles, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDeviceId } from "@/lib/device";
import { Markdown } from "@/components/chat/markdown";
import { CHANNEL_BADGE, SLOT_LABEL, STATUS_LABEL } from "@/data/consult-content";

export type SessionMessage = {
  role: "user" | "assistant" | "consultant" | "system";
  channel: string;
  content: string;
  at: string;
};

export type SessionView = {
  conversationPublicId: string;
  status: string;
  score: number;
  missing: string[];
  summary: string;
  handoff: boolean;
  aiPaused: boolean;
  channels: string[];
  customerName?: string;
  companyName?: string;
  messages: SessionMessage[];
};

function ChannelBadge({ channel }: { channel: string }) {
  const b = CHANNEL_BADGE[channel] ?? CHANNEL_BADGE["web-chat"]!;
  const Icon = channel === "email" ? Mail : channel === "consultant" ? UserRound : MessageSquare;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        b.className,
      )}
    >
      <Icon className="size-2.5" />
      {b.label}
    </span>
  );
}

function Bubble({ m }: { m: SessionMessage }) {
  const mine = m.role === "user";
  const fromConsultant = m.role === "consultant";
  return (
    <div className={cn("flex flex-col gap-1.5", mine ? "items-end" : "items-start")}>
      <div className="flex items-center gap-2">
        {!mine ? (
          <span className="text-[11px] font-semibold text-muted-foreground">
            {fromConsultant ? "Chuyên gia XTECH" : "Trợ lý XTECH"}
          </span>
        ) : null}
        <ChannelBadge channel={m.channel} />
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          mine
            ? "whitespace-pre-wrap bg-blue text-white"
            : fromConsultant
              ? "border border-cyan/35 bg-cyan/6 text-foreground"
              : "border border-blue/12 bg-card text-foreground",
        )}
      >
        {mine ? m.content : <Markdown text={m.content} />}
      </div>
    </div>
  );
}

function ProgressPanel({ session }: { session: SessionView }) {
  const pct = Math.max(0, Math.min(100, session.score));
  return (
    <aside className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trạng thái</p>
        <p className="mt-1.5 text-sm font-semibold text-blue">
          {STATUS_LABEL[session.status] ?? session.status}
        </p>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Hồ sơ tư vấn
          </p>
          <span className="text-sm font-bold text-blue">{pct}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blue/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue to-cyan transition-[width] duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {session.missing.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Còn cần làm rõ
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {session.missing.slice(0, 6).map((k) => (
              <li
                key={k}
                className="rounded-full border border-blue/12 bg-background px-2.5 py-1 text-[11px] text-muted-foreground"
              >
                {SLOT_LABEL[k] ?? k}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Hồ sơ đã đủ thông tin — chuyên gia XTECH sẽ xác nhận phạm vi cùng bạn.
        </p>
      )}

      {session.summary ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Nhu cầu đã ghi nhận
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{session.summary}</p>
        </div>
      ) : null}

      <div className="flex items-start gap-2.5 rounded-2xl border border-border bg-background p-3.5">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Hội thoại này chỉ mở trên thiết bị của bạn. Liên kết trong email có thời hạn; thiết bị mới
          phải xác minh email.
        </p>
      </div>
    </aside>
  );
}

function HandoffBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-cyan/40 bg-cyan/8 p-4">
      <span className="relative mt-0.5 flex size-3.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60" />
        <span className="relative inline-flex size-3.5 rounded-full bg-cyan" />
      </span>
      <div>
        <p className="text-sm font-semibold text-blue">Đang chuyển tới chuyên gia XTECH</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Hồ sơ của bạn đã được gửi tới đội tư vấn. Chuyên gia phụ trách sẽ phản hồi ngay trong hội
          thoại này và qua email. Bạn vẫn có thể gửi thêm thông tin bên dưới.
        </p>
      </div>
    </div>
  );
}

export function ConsultThread({
  session: initial,
  siteCode,
  readOnly = false,
}: {
  session: SessionView;
  siteCode?: string;
  readOnly?: boolean;
}) {
  const [session, setSession] = useState<SessionView>(initial);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [session.messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setNotice(null);
    setInput("");
    const now = new Date().toISOString();
    setSession((s) => ({
      ...s,
      messages: [
        ...s.messages,
        { role: "user", channel: "web-chat", content: text, at: now },
        { role: "assistant", channel: "web-chat", content: "", at: now },
      ],
    }));
    setSending(true);

    const patchLast = (content: string) =>
      setSession((s) => {
        const messages = [...s.messages];
        messages[messages.length - 1] = {
          role: "assistant",
          channel: "web-chat",
          content,
          at: now,
        };
        return { ...s, messages };
      });

    try {
      const res = await fetch("/api/lead/consult", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          conversationPublicId: session.conversationPublicId,
          message: text,
          siteCode,
        }),
      });
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        setSession((s) => ({ ...s, messages: s.messages.slice(0, -1) }));
        setNotice(err.error ?? "Có lỗi xảy ra. Vui lòng thử lại.");
        setSending(false);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const evt = JSON.parse(line.slice(5).trim()) as {
            type: string;
            text?: string;
            message?: string;
            status?: string;
            score?: number;
            missing?: string[];
            handoff?: boolean;
          };
          if (evt.type === "delta" && evt.text) {
            acc += evt.text;
            patchLast(acc);
          } else if (evt.type === "error") {
            patchLast(evt.message ?? "Có lỗi xảy ra.");
          } else if (evt.type === "state") {
            setSession((s) => ({
              ...s,
              status: evt.status ?? s.status,
              score: evt.score ?? s.score,
              missing: evt.missing ?? s.missing,
              handoff: evt.handoff ?? s.handoff,
            }));
          }
        }
      }
    } catch {
      setNotice("Không kết nối được. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.55fr_0.85fr]">
      <div className="flex flex-col gap-4">
        {session.handoff || session.aiPaused ? <HandoffBanner /> : null}

        <div
          ref={scrollRef}
          className="flex max-h-[62vh] min-h-[340px] flex-col gap-5 overflow-y-auto rounded-3xl border border-border bg-background p-5 md:p-6"
        >
          {session.messages.length === 0 ? (
            <div className="flex flex-col items-start gap-3">
              <span className="icon-gold flex size-10 items-center justify-center rounded-xl">
                <Sparkles className="size-5" />
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Hãy mô tả bài toán bạn đang cần giải quyết. Trợ lý XTECH sẽ hỏi thêm từng bước để
                đề xuất đúng phạm vi.
              </p>
            </div>
          ) : (
            session.messages.map((m, i) => <Bubble key={`${m.at}-${i}`} m={m} />)
          )}
        </div>

        {readOnly ? (
          <p className="text-sm text-muted-foreground">
            Đây là bản xem lại. Để tiếp tục trao đổi, hãy mở hội thoại từ liên kết trong email mới
            nhất của XTECH.
          </p>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-4">
            {notice ? (
              <p className="mb-2.5 rounded-xl bg-gold/10 px-3 py-2 text-xs text-blue">{notice}</p>
            ) : null}
            <div className="flex items-end gap-2.5">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                rows={2}
                placeholder="Nhập câu trả lời hoặc thông tin bổ sung…"
                className="max-h-40 min-h-[52px] flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={sending || !input.trim()}
                className="btn-gold mb-0.5 flex size-11 shrink-0 items-center justify-center rounded-full disabled:opacity-50"
                aria-label="Gửi"
              >
                <Send className="size-4" />
              </button>
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
              Bạn cũng có thể trả lời trực tiếp email của XTECH — nội dung sẽ xuất hiện ngay trong
              hội thoại này.
            </p>
          </div>
        )}
      </div>

      <ProgressPanel session={session} />
    </div>
  );
}
