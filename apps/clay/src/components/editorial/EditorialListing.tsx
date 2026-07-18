"use client";

/**
 * Reusable article listing (News + Insights): search + category filter + sort +
 * pagination (client state) with a featured/tags/newsletter sidebar.
 * Follows the "Tất cả bài viết" mockup in XTECH_NEWS_CLAUDE_HANDOFF_V1.
 */

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AmbientSection } from "@/components/corporate/about-kit";
import { cn } from "@/lib/utils";
import {
  ArticleCard,
  SidebarFeatured,
  TagChips,
  NewsletterBox,
  type EditorialItem,
} from "./kit";

type Cat = { slug: string; title: string };

function norm(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();
}

export function EditorialListing({
  items,
  categories,
  pageSize = 8,
  topics,
}: {
  items: EditorialItem[];
  categories: Cat[];
  pageSize?: number;
  topics: string[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    let list = items.filter((it) => {
      if (cat !== "all" && it.categorySlug !== cat) return false;
      if (!nq) return true;
      return norm(`${it.title} ${it.excerpt} ${it.tags.join(" ")}`).includes(nq);
    });
    list = [...list].sort((a, b) => {
      const da = a.publishedAt ?? "";
      const db = b.publishedAt ?? "";
      return sort === "new" ? db.localeCompare(da) : da.localeCompare(db);
    });
    return list;
  }, [items, q, cat, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const curPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((curPage - 1) * pageSize, curPage * pageSize);
  const featured = items.filter((i) => i.featured).slice(0, 3);

  function setFilter(next: string) {
    setCat(next);
    setPage(1);
  }

  return (
    <AmbientSection id="danh-sach" city={false} compact>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div>
          {/* toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Tìm kiếm bài viết, chủ đề…"
                className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
              Sắp xếp:
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "new" | "old")}
                className="rounded-full border border-input bg-card px-3 py-2 text-sm outline-none focus:border-gold"
              >
                <option value="new">Mới nhất</option>
                <option value="old">Cũ nhất</option>
              </select>
            </label>
          </div>

          {/* category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip active={cat === "all"} onClick={() => setFilter("all")}>Tất cả</Chip>
            {categories.map((c) => (
              <Chip key={c.slug} active={cat === c.slug} onClick={() => setFilter(c.slug)}>{c.title}</Chip>
            ))}
            {cat !== "all" || q ? (
              <Chip active={false} onClick={() => { setFilter("all"); setQ(""); }}>✕ Xóa bộ lọc</Chip>
            ) : null}
          </div>

          {/* grid */}
          {pageItems.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Không tìm thấy bài viết phù hợp.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {pageItems.map((it, i) => (
                <ArticleCard key={it.href} item={it} delay={(i % 2) * 0.06} />
              ))}
            </div>
          )}

          {/* pagination */}
          {totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-2">
              <PageBtn disabled={curPage === 1} onClick={() => setPage(curPage - 1)}>‹</PageBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PageBtn key={p} active={p === curPage} onClick={() => setPage(p)}>{p}</PageBtn>
              ))}
              <PageBtn disabled={curPage === totalPages} onClick={() => setPage(curPage + 1)}>›</PageBtn>
            </div>
          ) : null}
        </div>

        {/* sidebar */}
        <aside className="flex flex-col gap-8">
          {featured.length ? <SidebarFeatured title="Bài nổi bật" items={featured} /> : null}
          {topics.length ? <TagChips title="Chủ đề nổi bật" tags={topics} /> : null}
          <NewsletterBox />
        </aside>
      </div>
    </AmbientSection>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "border-gold/60 bg-gold/15 text-blue"
          : "border-blue/15 bg-card text-muted-foreground hover:border-gold/40",
      )}
    >
      {children}
    </button>
  );
}

function PageBtn({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition disabled:opacity-40",
        active ? "border-gold bg-gold text-ink" : "border-blue/15 bg-card text-blue hover:border-gold/45",
      )}
    >
      {children}
    </button>
  );
}
