"use client";

/**
 * Minimal markdown renderer for chat bubbles — the subset the assistant is
 * allowed to emit: **bold**, [links](/path), headings and bullet/numbered lists.
 * Tables are deliberately flattened to " · " separated text because a narrow
 * chat column cannot render them.
 *
 * Shared by the floating ChatWidget and the /tu-van consultation thread.
 */

import type { ReactNode } from "react";

/** Inline markdown: **bold** and [text](url). */
export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
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

/** Lightweight markdown → styled blocks. */
export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let list: { items: string[] } | null = null;
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
    if (!line.trim()) {
      flush();
      continue;
    }
    // skip markdown table separator rows
    if (/^\|?\s*:?-{2,}/.test(line.replace(/\s/g, ""))) continue;
    const li = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (li) {
      if (!list) list = { items: [] };
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
