/**
 * In-process search index for the corporate site. Most corporate content lives
 * in static typed modules (products, suites, cases, insights, news) rendered by
 * bespoke route overrides, so the index is assembled from those modules plus the
 * main navigation pages. Server-safe (no "use client").
 */

import { newsArticles } from "./news-content";
import { insightArticles } from "./insights-content";
import { caseStories } from "./case-content";
import { suites, PRODUCT_META } from "./suite-content";

export type SearchDoc = { title: string; description: string; url: string; kind: string };

const MAIN_PAGES: SearchDoc[] = [
  { title: "Trang chủ", description: "Hệ sinh thái công nghệ và AI cho doanh nghiệp số và bất động sản.", url: "/", kind: "Trang" },
  { title: "Về X", description: "Giới thiệu XTECH, năng lực, nền tảng và con người.", url: "/ve-x", kind: "Trang" },
  { title: "Giải pháp", description: "Giải pháp theo chuỗi nghiệp vụ, đối tượng và mục tiêu kinh doanh.", url: "/giai-phap", kind: "Trang" },
  { title: "Sản phẩm", description: "Hệ sinh thái sản phẩm XTECH quanh nền tảng dùng chung.", url: "/san-pham", kind: "Trang" },
  { title: "Bộ giải pháp X", description: "Các bộ giải pháp lắp ghép theo mô hình doanh nghiệp.", url: "/bo-giai-phap-x", kind: "Trang" },
  { title: "Dịch vụ", description: "Dịch vụ chuyển đổi số, dữ liệu, AI, tự động hóa và tích hợp.", url: "/dich-vu", kind: "Trang" },
  { title: "Triển khai", description: "Mô hình triển khai và kiến trúc tích hợp.", url: "/trien-khai", kind: "Trang" },
  { title: "Khách hàng", description: "Câu chuyện triển khai thực tế (ẩn danh).", url: "/khach-hang", kind: "Trang" },
  { title: "Insights", description: "Góc nhìn về chuyển đổi số, AI, dữ liệu và PropTech.", url: "/insights", kind: "Trang" },
  { title: "Tin tức", description: "Cập nhật sản phẩm, sự kiện và hoạt động của XTECH.", url: "/tin-tuc", kind: "Trang" },
  { title: "Liên hệ", description: "Trao đổi cùng đội ngũ XTECH.", url: "/lien-he", kind: "Trang" },
  { title: "Đặt lịch demo", description: "Trải nghiệm giải pháp qua demo thực tế.", url: "/dat-lich-demo", kind: "Trang" },
  { title: "Yêu cầu tư vấn", description: "Nhận tư vấn giải pháp theo bài toán riêng.", url: "/yeu-cau-tu-van", kind: "Trang" },
];

function build(): SearchDoc[] {
  const docs: SearchDoc[] = [...MAIN_PAGES];
  for (const m of Object.values(PRODUCT_META)) {
    docs.push({ title: m.title, description: "Sản phẩm trong hệ sinh thái XTECH.", url: m.href, kind: "Sản phẩm" });
  }
  for (const s of suites) {
    docs.push({ title: s.title, description: s.summary, url: `/bo-giai-phap-x/${s.slug}`, kind: "Bộ giải pháp" });
  }
  for (const c of caseStories) {
    docs.push({ title: c.title, description: c.summary, url: `/khach-hang/${c.slug}`, kind: "Khách hàng" });
  }
  for (const a of insightArticles) {
    docs.push({ title: a.title, description: a.summary, url: `/insights/${a.slug}`, kind: "Insights" });
  }
  for (const n of newsArticles) {
    docs.push({ title: n.title, description: n.excerpt, url: `/tin-tuc/${n.slug}`, kind: "Tin tức" });
  }
  return docs;
}

export const searchIndex: SearchDoc[] = build();

/** Accent- and case-insensitive normalization for Vietnamese matching. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function searchDocs(query: string): SearchDoc[] {
  const q = norm(query.trim());
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return searchIndex
    .map((d) => {
      const title = norm(d.title);
      const hay = norm(`${d.title} ${d.description} ${d.kind}`);
      const score = terms.reduce(
        (acc, t) => acc + (title.includes(t) ? 2 : hay.includes(t) ? 1 : 0),
        0,
      );
      return { d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.d);
}
