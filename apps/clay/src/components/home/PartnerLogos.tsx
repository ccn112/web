"use client";

/**
 * PartnerLogos — tabbed "trusted by / integration partners" wall.
 * Tabs (Tất cả, Khách hàng, Tài chính, Cloud, ERP, AI) with a FIXED-height grid
 * area so switching tabs never shifts the layout.
 *
 * Tech-brand logos use real SVGs from `simple-icons`. Brands simple-icons no
 * longer ships (AWS/Azure/Oracle/OpenAI — removed on brand request) and Vietnamese
 * developers/customers show as wordmarks; drop a `logo` public path to replace.
 */

import { useState } from "react";
import Image from "next/image";
import {
  siGooglecloud, siCloudflare, siDocker, siKubernetes,
  siSap, siOdoo, siPostgresql, siMongodb,
  siGooglegemini, siAnthropic, siHuggingface, siTensorflow, siPytorch,
  siVisa, siMastercard, siStripe, siPaypal,
  type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

type Slot = { name: string; icon?: SimpleIcon; logo?: string };
type Group = { key: string; label: string; slots: Slot[] };

const GROUPS: Group[] = [
  {
    key: "customer",
    label: "Khách hàng",
    slots: [
      { name: "Chủ đầu tư BĐS" }, { name: "Tập đoàn đa ngành" }, { name: "Nhà phát triển đô thị" },
      { name: "Chuỗi bán lẻ" }, { name: "Doanh nghiệp sản xuất" }, { name: "Đơn vị dịch vụ" },
    ],
  },
  {
    key: "finance",
    label: "Tài chính",
    slots: [
      { name: "Visa", icon: siVisa }, { name: "Mastercard", icon: siMastercard },
      { name: "Stripe", icon: siStripe }, { name: "PayPal", icon: siPaypal },
      { name: "VNPay" }, { name: "MoMo" },
    ],
  },
  {
    key: "cloud",
    label: "Cloud",
    slots: [
      { name: "Google Cloud", icon: siGooglecloud }, { name: "Cloudflare", icon: siCloudflare },
      { name: "Docker", icon: siDocker }, { name: "Kubernetes", icon: siKubernetes },
      { name: "AWS" }, { name: "Microsoft Azure" },
    ],
  },
  {
    key: "erp",
    label: "ERP",
    slots: [
      { name: "SAP", icon: siSap }, { name: "Odoo", icon: siOdoo },
      { name: "PostgreSQL", icon: siPostgresql }, { name: "MongoDB", icon: siMongodb },
      { name: "Oracle" }, { name: "MS Dynamics" },
    ],
  },
  {
    key: "ai",
    label: "AI",
    slots: [
      { name: "Google Gemini", icon: siGooglegemini }, { name: "Anthropic", icon: siAnthropic },
      { name: "Hugging Face", icon: siHuggingface }, { name: "TensorFlow", icon: siTensorflow },
      { name: "PyTorch", icon: siPytorch }, { name: "OpenAI" },
    ],
  },
];

const ALL: Group = { key: "all", label: "Tất cả", slots: GROUPS.flatMap((g) => g.slots) };
const TABS = [ALL, ...GROUPS];
const VISIBLE = 12; // 2 rows × 6 → chiều cao lưới cố định giữa các tab

function LogoCell({ slot }: { slot: Slot }) {
  return (
    <div className="group/cell flex h-16 items-center justify-center rounded-xl border border-border/60 bg-background/60 px-3 transition hover:border-blue/30 hover:bg-background">
      {slot.logo ? (
        <Image src={slot.logo} alt={slot.name} width={120} height={40} className="max-h-8 w-auto object-contain opacity-70 grayscale transition group-hover/cell:opacity-100 group-hover/cell:grayscale-0" />
      ) : slot.icon ? (
        <span className="flex items-center gap-2 text-muted-foreground/70 transition group-hover/cell:text-foreground" title={slot.name}>
          <svg role="img" viewBox="0 0 24 24" className="size-6 fill-current transition group-hover/cell:[fill:var(--brand-hex)]" style={{ ["--brand-hex" as string]: `#${slot.icon.hex}` }}>
            <path d={slot.icon.path} />
          </svg>
          <span className="text-sm font-semibold">{slot.name}</span>
        </span>
      ) : (
        <span className="text-center text-xs font-semibold text-muted-foreground/60">{slot.name}</span>
      )}
    </div>
  );
}

export function PartnerLogos() {
  const [tab, setTab] = useState(0);
  const slots = TABS[tab]!.slots.slice(0, VISIBLE);
  const cells: (Slot | null)[] = [...slots];
  while (cells.length < VISIBLE) cells.push(null);

  return (
    <section className="relative border-y border-border/60 bg-card/40 py-12">
      <div className="container-x relative flex flex-col items-center gap-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Được tin dùng bởi doanh nghiệp và tích hợp cùng các nền tảng công nghệ hàng đầu
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {TABS.map((t, i) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(i)}
              aria-pressed={tab === i}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                tab === i
                  ? "border border-gold/50 bg-gold/10 text-blue"
                  : "border border-border/60 bg-background/60 text-muted-foreground hover:border-blue/30 hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cells.map((slot, i) => (
            <div key={i}>
              {slot ? <LogoCell slot={slot} /> : <div className="h-16 rounded-xl border border-dashed border-border/40" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
