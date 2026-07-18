"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

/** Humanize a field key: "hoTen" / "ho-ten" / "full_name" -> "Ho Ten". */
function labelFor(key: string): string {
  const s = key
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fieldType(key: string): "email" | "tel" | "textarea" | "text" {
  const k = key.toLowerCase();
  if (k.includes("email") || k.includes("mail")) return "email";
  if (k.includes("phone") || k.includes("tel") || k.includes("sdt") || k.includes("dien-thoai"))
    return "tel";
  if (k.includes("message") || k.includes("noi-dung") || k.includes("noidung") || k.includes("ghi-chu"))
    return "textarea";
  return "text";
}

const DEFAULT_FIELDS = ["hoTen", "email", "soDienThoai", "noiDung"];

export function LeadFormBlock({
  formCode,
  fields,
  siteCode,
  pageId,
}: {
  formCode: string;
  fields?: string[];
  siteCode?: string;
  pageId?: string;
}) {
  const activeFields = fields && fields.length > 0 ? fields : DEFAULT_FIELDS;
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = {};
    activeFields.forEach((f) => {
      payload[f] = data.get(f) ?? "";
    });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          formCode,
          siteCode,
          pageId,
          payload,
          consent: data.get("consent") === "on",
        }),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-border bg-card p-8 text-center">
        <p className="text-lg font-semibold">Cảm ơn bạn!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Chúng tôi đã nhận thông tin và sẽ liên hệ trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-8 flex max-w-xl flex-col gap-4 rounded-3xl border border-border bg-card p-8"
    >
      {activeFields.map((f) => {
        const t = fieldType(f);
        return (
          <label key={f} className="flex flex-col gap-1.5 text-sm font-medium">
            {labelFor(f)}
            {t === "textarea" ? (
              <textarea
                name={f}
                rows={4}
                className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-primary"
              />
            ) : (
              <input
                type={t}
                name={f}
                className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-primary"
              />
            )}
          </label>
        );
      })}
      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Đang gửi…" : "Gửi thông tin"}
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </button>
      {status === "error" ? (
        <p className="text-sm text-destructive">
          Có lỗi xảy ra. Vui lòng thử lại.
        </p>
      ) : null}
    </form>
  );
}
