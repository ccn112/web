"use client";

/**
 * XTECH AI chat widget — floating button on every page. Context-aware (per-route
 * summary + suggested prompts), streaming answers, image/PDF upload and chat
 * history gated behind a lightweight email+phone registration, two panel sizes
 * (default and expanded = 2/3 viewport height × 1/2 width). Device-id keyed;
 * conversations persist to the CMS.
 */

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  MessageCircle, X, Send, Paperclip, History, Maximize2, Minimize2, Plus, Trash2, ArrowLeft, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { chatContextForRoute } from "@/data/chat-context";

type Msg = { role: "user" | "assistant"; content: string; images?: number };
type SessionMeta = { sessionId: string; title: string; messageCount: number; updatedAt: string };
type Attachment = { kind: "image" | "pdf"; mediaType: string; data: string; name: string };

const DEVICE_KEY = "xtech_chat_device";
const REG_KEY = "xtech_chat_registered";

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxx-4xxx-yxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Inline markdown: **bold** and [text](url). */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  // Split on links first, then handle bold within each chunk.
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  const pushBold = (s: string) => {
    const parts = s.split(/(\*\*[^*]+\*\*)/g);
    for (const p of parts) {
      if (!p) continue;
      if (p.startsWith("**") && p.endsWith("**")) out.push(<strong key={k++}>{p.slice(2, -2)}</strong>);
      else out.push(<span key={k++}>{p}</span>);
    }
  };
  while ((m = linkRe.exec(text))) {
    if (m.index > last) pushBold(text.slice(last, m.index));
    out.push(
      <a key={`l${k++}`} href={m[2]} className="font-semibold text-blue underline underline-offset-2 hover:text-gold">
        {m[1]}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) pushBold(text.slice(last));
  return out;
}

/** Lightweight markdown → styled blocks (headings, bold, bullet/numbered lists, links). */
function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;
  const flush = () => {
    if (!list) return;
    const items = list.items.map((it, i) => (
      <li key={i} className="flex gap-2">
        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-blue/50" />
        <span>{inline(it)}</span>
      </li>
    ));
    blocks.push(
      <ul key={`ul${key++}`} className="my-1.5 flex flex-col gap-1">
        {items}
      </ul>,
    );
    list = null;
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); continue; }
    // skip markdown table separator rows and render table pipes as plain text
    if (/^\|?\s*:?-{2,}/.test(line.replace(/\s/g, ""))) continue;
    const li = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (li) {
      if (!list) list = { ordered: false, items: [] };
      list.items.push(li[1]!);
      continue;
    }
    flush();
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      blocks.push(
        <p key={key++} className="mt-2 mb-1 text-sm font-bold text-blue first:mt-0">
          {inline(h[2]!)}
        </p>,
      );
      continue;
    }
    blocks.push(
      <p key={key++} className="leading-relaxed">
        {inline(line.replace(/^\|/, "").replace(/\|$/, "").replace(/\s*\|\s*/g, " · "))}
      </p>,
    );
  }
  flush();
  return <div className="flex flex-col gap-1.5">{blocks}</div>;
}

/** Grab the current page's readable text (main content) so the assistant can
 * answer "tóm tắt trang này". Collapses whitespace and caps length; the backend
 * trims again. Falls back to empty string on the server. */
function capturePageText(): string {
  if (typeof document === "undefined") return "";
  const root = document.querySelector("main") ?? document.body;
  const raw = (root as HTMLElement)?.innerText ?? "";
  return raw.replace(/\s+/g, " ").trim().slice(0, 6000);
}

export function ChatWidget({ siteCode = "corporate" }: { siteCode?: string }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<"chat" | "history" | "register">("chat");
  const [deviceId, setDeviceId] = useState("");
  const [registered, setRegistered] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [ctx, setCtx] = useState(() => chatContextForRoute(typeof window !== "undefined" ? window.location.pathname : "/"));
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // init device id + registration + session
  useEffect(() => {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = uuid();
      localStorage.setItem(DEVICE_KEY, id);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeviceId(id);
    setRegistered(localStorage.getItem(REG_KEY) === "1");
    setSessionId(uuid());
  }, []);

  // keep context in sync with route changes (SPA nav)
  useEffect(() => {
    const update = () => setCtx(chatContextForRoute(window.location.pathname));
    update();
    window.addEventListener("popstate", update);
    const t = setInterval(update, 1500); // catch client-side nav without a router hook
    return () => {
      window.removeEventListener("popstate", update);
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  function resetChat() {
    setSessionId(uuid());
    setMessages([]);
    setAttachments([]);
    setInput("");
    setNotice(null);
    setView("chat");
  }

  async function send(text: string) {
    const content = text.trim();
    if ((!content && attachments.length === 0) || sending) return;
    setNotice(null);
    const userMsg: Msg = { role: "user", content, images: attachments.filter((a) => a.kind === "image").length || undefined };
    setMessages((m) => [...m, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    const atts = attachments;
    setAttachments([]);
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          deviceId,
          sessionId,
          message: content,
          siteCode,
          route: window.location.pathname,
          // Live page text so the AI can summarize/answer about the current page;
          // fall back to the static route summary if the DOM read is empty.
          pageContext: capturePageText() || ctx.summary,
          attachments: atts.map((a) => ({ kind: a.kind, mediaType: a.mediaType, data: a.data })),
        }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        setMessages((m) => m.slice(0, -1)); // drop empty assistant bubble
        if (err.code === "register_required" || err.code === "register_for_more") {
          setNotice(err.error ?? "Vui lòng đăng ký để tiếp tục.");
          setView("register");
        } else {
          setNotice(err.error ?? "Có lỗi xảy ra. Vui lòng thử lại.");
        }
        setSending(false);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const p of parts) {
          const line = p.trim();
          if (!line.startsWith("data:")) continue;
          const evt = JSON.parse(line.slice(5).trim());
          if (evt.type === "delta") {
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + evt.text };
              return copy;
            });
          } else if (evt.type === "error") {
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "assistant", content: evt.message };
              return copy;
            });
          }
        }
      }
    } catch {
      setNotice("Không kết nối được. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  }

  async function onPickFiles(files: FileList | null) {
    if (!files) return;
    if (!registered) {
      setNotice("Đăng ký (email + SĐT) để gửi ảnh/tài liệu.");
      setView("register");
      return;
    }
    const next: Attachment[] = [];
    for (const f of Array.from(files).slice(0, 3)) {
      if (f.size > 5 * 1024 * 1024) {
        setNotice(`"${f.name}" quá lớn (tối đa 5MB).`);
        continue;
      }
      const isImg = f.type.startsWith("image/");
      const isPdf = f.type === "application/pdf";
      if (!isImg && !isPdf) {
        setNotice("Chỉ hỗ trợ ảnh và PDF.");
        continue;
      }
      const b64 = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
        r.readAsDataURL(f);
      });
      next.push({ kind: isImg ? "image" : "pdf", mediaType: f.type, data: b64, name: f.name });
    }
    setAttachments((a) => [...a, ...next].slice(0, 3));
  }

  async function doRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setNotice(null);
    const res = await fetch("/api/chat/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        deviceId,
        email: data.get("email"),
        phone: data.get("phone"),
        name: data.get("name"),
        siteCode,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      localStorage.setItem(REG_KEY, "1");
      setRegistered(true);
      setView("chat");
      setNotice("Đăng ký thành công! Bạn đã mở khóa gửi tệp và lịch sử.");
    } else {
      setNotice(j.error ?? "Đăng ký thất bại.");
    }
  }

  async function openHistory() {
    if (!registered) {
      setNotice("Đăng ký để xem và quản lý lịch sử.");
      setView("register");
      return;
    }
    setView("history");
    const res = await fetch(`/api/chat/sessions?deviceId=${encodeURIComponent(deviceId)}`);
    const j = await res.json().catch(() => ({ sessions: [] }));
    setSessions(j.sessions ?? []);
  }

  async function loadSession(sid: string) {
    const res = await fetch(`/api/chat/sessions?deviceId=${encodeURIComponent(deviceId)}&sessionId=${encodeURIComponent(sid)}`);
    const j = await res.json().catch(() => null);
    if (j?.messages) {
      setSessionId(sid);
      setMessages(j.messages.map((m: Msg) => ({ role: m.role, content: m.content, images: m.images })));
      setView("chat");
    }
  }

  async function removeSession(sid: string) {
    await fetch(`/api/chat/sessions?deviceId=${encodeURIComponent(deviceId)}&sessionId=${encodeURIComponent(sid)}`, { method: "DELETE" });
    setSessions((s) => s.filter((x) => x.sessionId !== sid));
    if (sid === sessionId) resetChat();
  }

  return (
    <>
      {/* Floating button */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Mở trợ lý AI XTECH"
          className="btn-gold fixed bottom-5 right-5 z-[70] flex size-14 items-center justify-center rounded-full shadow-[0_16px_40px_-12px_var(--accent-gold)] transition hover:brightness-105"
        >
          <MessageCircle className="size-6" />
          <span className="absolute -right-0.5 -top-0.5 flex size-3.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60" />
            <span className="relative inline-flex size-3.5 rounded-full bg-cyan" />
          </span>
        </button>
      ) : null}

      {/* Panel */}
      {open ? (
        <div
          className={cn(
            "fixed z-[70] flex flex-col overflow-hidden rounded-2xl border border-blue/15 bg-card shadow-[0_40px_100px_-30px_rgba(10,20,60,0.55)]",
            expanded
              ? "bottom-4 right-4 h-[80vh] max-h-[calc(100vh-2rem)] w-[50vw] max-w-[calc(100vw-2rem)] min-w-[360px]"
              : "bottom-5 right-5 h-[560px] max-h-[calc(100vh-2.5rem)] w-[min(400px,calc(100vw-2.5rem))]",
          )}
        >
          {/* Header */}
          <div className="theme-dark flex items-center gap-2 bg-[oklch(0.2_0.03_262)] px-4 py-3 text-white">
            {view !== "chat" ? (
              <button type="button" onClick={() => setView("chat")} className="text-white/70 hover:text-white" aria-label="Quay lại">
                <ArrowLeft className="size-4" />
              </button>
            ) : (
              <span className="flex size-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                <Sparkles className="size-4" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">Trợ lý XTECH</p>
              <p className="truncate text-[11px] text-white/60">Chuyển đổi số · AI · Bất động sản</p>
            </div>
            <button type="button" onClick={resetChat} className="text-white/70 hover:text-white" aria-label="Hội thoại mới" title="Hội thoại mới">
              <Plus className="size-4" />
            </button>
            <button type="button" onClick={openHistory} className="text-white/70 hover:text-white" aria-label="Lịch sử" title="Lịch sử">
              <History className="size-4" />
            </button>
            <button type="button" onClick={() => setExpanded((e) => !e)} className="hidden text-white/70 hover:text-white sm:block" aria-label="Đổi cỡ" title="Phóng to/thu nhỏ">
              {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-white/70 hover:text-white" aria-label="Đóng">
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          {view === "history" ? (
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-3 text-sm font-semibold text-blue">Lịch sử hội thoại</p>
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có hội thoại nào.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {sessions.map((s) => (
                    <li key={s.sessionId} className="group flex items-center gap-2 rounded-xl border border-blue/12 bg-background p-3">
                      <button type="button" onClick={() => loadSession(s.sessionId)} className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-medium text-blue">{s.title}</p>
                        <p className="text-[11px] text-muted-foreground">{s.messageCount} tin nhắn</p>
                      </button>
                      <button type="button" onClick={() => removeSession(s.sessionId)} className="text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive" aria-label="Xóa">
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : view === "register" ? (
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm font-semibold text-blue">Đăng ký để mở khóa</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Để gửi ảnh/tài liệu và lưu lại lịch sử hội thoại, vui lòng để lại thông tin. Đội ngũ XTECH có thể liên hệ tư vấn thêm.
              </p>
              {notice ? <p className="mt-3 rounded-lg bg-gold/10 p-2 text-xs text-blue">{notice}</p> : null}
              <form onSubmit={doRegister} className="mt-4 flex flex-col gap-3">
                <input name="name" placeholder="Họ và tên (tùy chọn)" className={inputCls} />
                <input name="email" type="email" required placeholder="Email công việc *" className={inputCls} />
                <input name="phone" type="tel" required placeholder="Số điện thoại *" className={inputCls} />
                <button type="submit" className="btn-gold h-11 rounded-full text-sm font-semibold">Đăng ký & tiếp tục</button>
              </form>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div>
                    <div className="rounded-2xl border border-blue/12 bg-background p-4">
                      <p className="text-sm text-foreground">
                        Xin chào! Tôi là trợ lý XTECH. Bạn đang xem <span className="font-semibold text-blue">{ctx.label}</span>.
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{ctx.summary}</p>
                    </div>
                    <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gợi ý câu hỏi</p>
                    <div className="flex flex-col gap-2">
                      {ctx.prompts.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => send(p)}
                          className="rounded-xl border border-blue/15 bg-background px-3 py-2 text-left text-sm text-blue transition hover:border-gold/45 hover:bg-gold/5"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href="/lien-he" className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-blue">Liên hệ tư vấn</Link>
                      <Link href="/dat-lich-demo" className="rounded-full border border-blue/15 px-3 py-1.5 text-xs font-semibold text-blue">Đặt lịch demo</Link>
                    </div>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                          m.role === "user" ? "whitespace-pre-wrap bg-blue text-white" : "border border-blue/12 bg-background text-foreground",
                        )}
                      >
                        {m.role === "assistant" && !m.content && sending ? (
                          <span className="inline-flex gap-1"><Dot /><Dot d={0.15} /><Dot d={0.3} /></span>
                        ) : m.role === "user" ? (
                          m.content
                        ) : (
                          <Markdown text={m.content} />
                        )}
                        {m.images ? <p className="mt-1 text-[11px] opacity-70">📎 {m.images} ảnh</p> : null}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-border p-3">
                {notice ? <p className="mb-2 rounded-lg bg-gold/10 px-2 py-1.5 text-xs text-blue">{notice}</p> : null}
                {attachments.length ? (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {attachments.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-full border border-blue/15 bg-background px-2 py-1 text-[11px] text-blue">
                        {a.kind === "image" ? "🖼️" : "📄"} {a.name.slice(0, 16)}
                        <button type="button" onClick={() => setAttachments((x) => x.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => (registered ? fileRef.current?.click() : (setNotice("Đăng ký để gửi ảnh/tài liệu."), setView("register")))}
                    className="mb-1 shrink-0 text-muted-foreground transition hover:text-blue"
                    aria-label="Đính kèm"
                    title={registered ? "Đính kèm ảnh/PDF" : "Đăng ký để đính kèm"}
                  >
                    <Paperclip className="size-5" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => onPickFiles(e.target.files)} />
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    rows={1}
                    placeholder="Nhập câu hỏi..."
                    className="max-h-28 min-h-[40px] flex-1 resize-none rounded-2xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => send(input)}
                    disabled={sending || (!input.trim() && attachments.length === 0)}
                    className="btn-gold mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full disabled:opacity-50"
                    aria-label="Gửi"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}
    </>
  );
}

const inputCls = "h-11 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

function Dot({ d = 0 }: { d?: number }) {
  return <span className="inline-block size-1.5 animate-bounce rounded-full bg-blue/50" style={{ animationDelay: `${d}s` }} />;
}
